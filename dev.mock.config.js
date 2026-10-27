// `yarn start:mock`: the normal dev build, but /api is answered by mock/server.cjs
// instead of being proxied to Rails, so no backend is needed.
const base = require('./dev.config.js');
const setupMiddlewares = require('./mock/server.cjs');

module.exports = env => {
  const config = base(env);
  const { proxy, ...devServer } = config.devServer;
  return {
    ...config,
    devServer: {
      ...devServer,
      setupMiddlewares,
      // The base config emits a harmless DefinePlugin warning; keep its overlay off the app.
      client: { overlay: { warnings: false, errors: true } },
    },
  };
};
