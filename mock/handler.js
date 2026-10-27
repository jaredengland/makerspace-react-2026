// Fake Rails API shared by the Node dev server (server.cjs) and the browser
// build (browser.js). Pure logic only: no Node or DOM APIs.
// Collections are arrays with a `total-items` header; unknown GETs return an
// empty collection and unknown writes echo back `{ id: 'mock', ...body }`, so
// screens render without a backend. Add fixtures to fixtures.js as screens need them.
const { personas, members, invoices, rentals, home } = require('./fixtures.js');

const json = (body, status = 200, headers = {}) => ({ status, headers, body });

const collection = (rows, query) => {
  const size = Number(query.get('pageSize')) || rows.length || 1;
  const page = Number(query.get('pageNum')) || 0;
  return json(rows.slice(page * size, page * size + size), 200, { 'total-items': String(rows.length) });
};

// `current` is the signed-in persona. `store` (optional) lets the browser build keep it
// across page reloads: { get(): 'admin' | 'member' | null, set(key | null) }.
function createHandler(store) {
  let current = store && store.get() ? personas[store.get()] : null;
  const setCurrent = key => { current = key ? personas[key] : null; if (store) store.set(key); };
  const isAdmin = () => !!(current && current.isAdmin);

  return function handle({ method, path, query, body }) {
    if (path === '/config') return json({ wiki_url: '' });
    if (path === '/signup_status') return json({ locked: false });
    if (path === '/members/sign_in') {
      if (body && body.member) {
        setCurrent(/^admin@/i.test(body.member.email || '') ? 'admin' : 'member');
        return json(current);
      }
      return current ? json(current) : json({ error: 'Sign in required' }, 401);
    }
    if (path === '/members/sign_out') { setCurrent(null); return json({}); }
    if (!current) return json({ error: 'Sign in required' }, 401);

    if (path.endsWith('/permissions')) return json({ billing: true, earned_membership: true, custom_billing: true });
    if (path === '/home') return json(home(current));

    const memberRoute = path.match(/^(?:\/admin)?\/members(?:\/([^/]+))?$/);
    if (memberRoute && method === 'GET') {
      if (!memberRoute[1]) return collection(members, query);
      return json(members.find(m => m.id === memberRoute[1]) || current);
    }

    const scope = rows => (isAdmin() || path.startsWith('/admin') ? rows : rows.filter(r => r.memberId === current.id));
    if (/^(\/admin)?\/invoices$/.test(path) && method === 'GET') {
      let rows = scope(invoices);
      if (query.get('pastDue') === 'true') rows = rows.filter(r => r.pastDue);
      if (query.get('settled') === 'false') rows = rows.filter(r => !r.settled);
      return collection(rows, query);
    }
    if (/^(\/admin)?\/rentals$/.test(path) && method === 'GET') return collection(scope(rentals), query);

    if (method === 'GET') return collection([], query);
    return json({ id: 'mock', ...(body || {}) });
  };
}

module.exports = { createHandler };
