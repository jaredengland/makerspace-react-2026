// Minimal in-memory stand-in for the Rails API, mounted by dev.mock.config.js.
// Collections are arrays with a `total-items` header; unknown GETs return an
// empty collection and unknown writes echo back `{ id: 'mock' }`, so screens
// render without a backend. Add real fixtures to fixtures.cjs as screens need them.
const fs = require('fs');
const path = require('path');
const { personas, members, invoices, rentals, home } = require('./fixtures.cjs');

let current = null; // the signed-in persona; one browser session at a time

const readBody = req => new Promise(resolve => {
  let raw = '';
  req.on('data', chunk => { raw += chunk; });
  req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { resolve({}); } });
});

const send = (res, body, { status = 200, total } = {}) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  if (total !== undefined) res.setHeader('total-items', String(total));
  res.end(JSON.stringify(body));
};

const collection = (res, rows, query) => {
  const size = Number(query.get('pageSize')) || rows.length || 1;
  const page = Number(query.get('pageNum')) || 0;
  send(res, rows.slice(page * size, page * size + size), { total: rows.length });
};

const isAdmin = () => !!(current && current.isAdmin);

async function handle(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname.replace(/^\/api/, '');
  const q = url.searchParams;
  const method = req.method;
  const body = method === 'GET' ? {} : await readBody(req);

  if (path === '/config') return send(res, { wiki_url: '' });
  if (path === '/signup_status') return send(res, { locked: false });
  if (path === '/members/sign_in') {
    if (body.member) {
      current = /^admin@/i.test(body.member.email || '') ? personas.admin : personas.member;
      return send(res, current);
    }
    return current ? send(res, current) : send(res, { error: 'Sign in required' }, { status: 401 });
  }
  if (path === '/members/sign_out') { current = null; return send(res, {}); }
  if (!current) return send(res, { error: 'Sign in required' }, { status: 401 });

  if (path.endsWith('/permissions')) return send(res, { billing: true, earned_membership: true, custom_billing: true });
  if (path === '/home') return send(res, home(current));

  const memberRoute = path.match(/^(?:\/admin)?\/members(?:\/([^/]+))?$/);
  if (memberRoute && method === 'GET') {
    if (!memberRoute[1]) return collection(res, members, q);
    return send(res, members.find(m => m.id === memberRoute[1]) || current);
  }

  const scope = rows => (isAdmin() || path.startsWith('/admin') ? rows : rows.filter(r => r.memberId === current.id));
  if (/^(\/admin)?\/invoices$/.test(path) && method === 'GET') {
    let rows = scope(invoices);
    if (q.get('pastDue') === 'true') rows = rows.filter(r => r.pastDue);
    if (q.get('settled') === 'false') rows = rows.filter(r => !r.settled);
    return collection(res, rows, q);
  }
  if (/^(\/admin)?\/rentals$/.test(path) && method === 'GET') return collection(res, scope(rentals), q);

  if (method === 'GET') return collection(res, [], q);
  return send(res, { id: 'mock', ...body });
}

module.exports = function setupMiddlewares(middlewares, devServer) {
  // Rails serves the header logo in production; serve the bundled copy instead.
  devServer.app.get('/assets/FilledLaserableLogo.svg', (req, res) => {
    res.type('image/svg+xml').send(fs.readFileSync(path.join(__dirname, '../src/assets/FilledLaserableLogo.svg')));
  });
  devServer.app.use('/api', (req, res, next) => {
    // Express strips the mount path, so restore it for the router above.
    req.url = `/api${req.url}`;
    handle(req, res).catch(next);
  });
  return middlewares;
};
