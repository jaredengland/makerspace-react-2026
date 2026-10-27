// Webpack loader for the static build: the app references the Rails-served logo by a
// root-relative URL; point it at the sub-path the static site is hosted under.
module.exports = function (source) {
  const base = this.getOptions().base;
  return source.replace(/(["'`])\/assets\/FilledLaserableLogo\.svg\1/g, `$1${base}/assets/FilledLaserableLogo.svg$1`);
};
