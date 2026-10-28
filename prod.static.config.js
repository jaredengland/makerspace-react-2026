// `yarn build:static`: the production bundle with the fake API compiled in, laid out
// as a plain static site in dist-static/ (index.html at the root, JS/CSS under assets/).
// Upload the contents of dist-static/ to the folder served at STATIC_BASE (default /mm).
// Set STATIC_BASE="" to build for a domain root instead. See docs/mock-dev-mode.md.
const path = require('path');
const webpack = require('webpack');
const base = require('./prod.config.js');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = env => {
  const staticBase = (process.env.STATIC_BASE ?? '/mm').replace(/\/$/, '');
  const config = base(env);
  return {
    ...config,
    entry: ['./mock/browser.js', ...config.entry],
    // Content-hashed file names, so a redeploy can never mix a cached old chunk with a new main bundle.
    output: {
      ...config.output,
      path: path.resolve(__dirname, 'dist-static/assets'),
      publicPath: `${staticBase}/assets/`,
      filename: 'app.[contenthash:8].js',
      chunkFilename: 'chunk.[name].[contenthash:8].js',
    },
    module: {
      rules: [
        { test: /(LoginPage\.tsx|rentalLabel\.ts)$/, enforce: 'pre', loader: path.resolve(__dirname, 'mock/base-path-loader.js'), options: { base: staticBase } },
        ...config.module.rules,
      ],
    },
    plugins: [
      ...config.plugins.filter(p => !(p instanceof HtmlWebPackPlugin) && !(p instanceof CopyWebpackPlugin) && !(p instanceof MiniCssExtractPlugin)),
      new MiniCssExtractPlugin({ filename: 'app.[contenthash:8].css', chunkFilename: 'chunk.[name].[contenthash:8].css' }),
      new webpack.DefinePlugin({ __STATIC_BASE__: JSON.stringify(staticBase) }),
      new HtmlWebPackPlugin({ template: './src/assets/index.html', filename: '../index.html' }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/assets/favicon.png', to: '../favicon.png' },
          { from: 'src/assets/FilledLaserableLogo.svg', to: 'FilledLaserableLogo.svg' },
          { from: 'mock/static.htaccess', to: '../.htaccess', toType: 'file', transform: content => content.toString().replace('__BASE__', staticBase) },
        ],
      }),
    ],
  };
};
