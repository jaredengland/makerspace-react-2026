// Answers /api requests inside the browser so the portal can be hosted as plain
// static files. Imported first by prod.static.config.js; never part of the normal build.
const { createHandler } = require('./handler.js');

// Sub-path the static build is served from (set at build time), e.g. '/mm'.
// eslint-disable-next-line no-undef
window.__APP_BASENAME__ = __STATIC_BASE__;

// Keep the persona for the tab so a reload or deep link doesn't sign you out.
const KEY = 'mock-portal-persona';
const store = {
  get: () => { try { return sessionStorage.getItem(KEY); } catch (e) { return null; } },
  set: key => { try { key ? sessionStorage.setItem(KEY, key) : sessionStorage.removeItem(KEY); } catch (e) { /* storage blocked */ } },
};
const handle = createHandler(store);
const isApi = url => new URL(url, window.location.href).pathname.startsWith('/api/');
const parse = raw => { try { return raw ? JSON.parse(raw) : {}; } catch (e) { return {}; } };
const run = (method, url, raw) => {
  const u = new URL(url, window.location.href);
  return handle({ method: method.toUpperCase(), path: u.pathname.replace(/^\/api/, ''), query: u.searchParams, body: parse(raw) });
};

const realFetch = window.fetch.bind(window);
window.fetch = (input, init = {}) => {
  const url = typeof input === 'string' ? input : input.url;
  if (!isApi(url)) return realFetch(input, init);
  const { status, headers, body } = run(init.method || (input.method) || 'GET', url, init.body);
  return Promise.resolve(new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } }));
};

const proto = XMLHttpRequest.prototype;
const realOpen = proto.open;
const realSend = proto.send;
proto.open = function (method, url, ...rest) {
  this.__mock = isApi(url) ? { method, url } : null;
  return realOpen.call(this, method, this.__mock ? 'data:,' : url, ...rest);
};
proto.send = function (body) {
  if (!this.__mock) return realSend.call(this, body);
  const { status, headers, body: data } = run(this.__mock.method, this.__mock.url, body);
  const text = JSON.stringify(data);
  const all = { 'content-type': 'application/json', ...headers };
  const set = (key, value) => Object.defineProperty(this, key, { value, configurable: true });
  setTimeout(() => {
    set('readyState', 4);
    set('status', status);
    set('statusText', String(status));
    set('responseURL', this.__mock.url);
    set('responseText', text);
    set('response', this.responseType === 'json' ? data : text);
    set('getAllResponseHeaders', () => Object.entries(all).map(([k, v]) => `${k}: ${v}\r\n`).join(''));
    set('getResponseHeader', name => all[String(name).toLowerCase()] ?? null);
    ['readystatechange', 'load', 'loadend'].forEach(type => this.dispatchEvent(new Event(type)));
  }, 0);
};
