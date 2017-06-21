const webpack = require('webpack');
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
      app: PATHS.app,
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
  parts.loadJs({ include: PATHS.app }),
  parts.extractBundles([{
    name: 'vendor',
    minChunks: ({ resource }) => (
      resource &&
      resource.indexOf('node_modules') >= 0 &&
      resource.match(/\.js$/)
    )
  }])
]);

const productionConfig = merge([
  parts.clean(PATHS.build),
  parts.extractCSS({
    use: ['css-loader', parts.autoprefix()]
  }),
  parts.loadImages({
    options: {
      limit: 150000,
      name: '[name].[ext]'
    }
  }),
  parts.generateSourceMaps({ type: 'source-map' }),
  parts.attachRevision()
]);

const developmentConfig = merge([
  {
    output: {
      devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]'
    }
  },
  parts.generateSourceMaps({ type: 'cheap-module-eval-source-map' }),
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
