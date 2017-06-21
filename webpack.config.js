const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const parts = require('./webpack.parts');
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

const commonConfig = merge([
  {
    entry: {
      app: PATHS.app
    },
    output: {
      path: PATHS.build,
      filename: '[name].js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Webpack Demo'
      })
    ]
  },
  parts.lintJs({ include: PATHS.app }),
  parts.lintCSS({ include: PATHS.app }),
  parts.loadJs({ include: PATHS.app })
]);

const productionConfig = merge([
  parts.extractCSS({
    use: ['css-loader', parts.autoprefix()]
  }),
  parts.loadImages({
    options: {
      limit: 150000,
      name: '[name].[ext]'
    }
  })
]);

const developmentConfig = merge([
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT
  }),
  parts.loadCSS(),
  parts.loadImages()
]);

module.exports = (env) => {
  if (env === 'production') {
    return merge(commonConfig, productionConfig);
  }
  return merge(commonConfig, developmentConfig);
};
