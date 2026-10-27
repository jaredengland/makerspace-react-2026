// Mounts the fake API on the webpack dev server for `yarn start:mock`.
const fs = require('fs');
const path = require('path');
const { createHandler } = require('./handler.js');

const handle = createHandler();

const readBody = req => new Promise(resolve => {
  let raw = '';
  req.on('data', chunk => { raw += chunk; });
  req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { resolve({}); } });
});

module.exports = function setupMiddlewares(middlewares, devServer) {
  // Rails serves the header logo in production; serve the bundled copy instead.
  devServer.app.get('/assets/FilledLaserableLogo.svg', (req, res) => {
    res.type('image/svg+xml').send(fs.readFileSync(path.join(__dirname, '../src/assets/FilledLaserableLogo.svg')));
  });
  devServer.app.use('/api', async (req, res, next) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      const body = req.method === 'GET' ? {} : await readBody(req);
      const result = handle({ method: req.method, path: url.pathname, query: url.searchParams, body });
      res.statusCode = result.status;
      res.setHeader('Content-Type', 'application/json');
      Object.entries(result.headers).forEach(([k, v]) => res.setHeader(k, v));
      res.end(JSON.stringify(result.body));
    } catch (error) { next(error); }
  });
  return middlewares;
};
