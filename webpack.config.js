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
  parts.extractBundles([
    {
      name: 'vendor',
      minChunks: ({ resource }) => (
        resource &&
        resource.indexOf('node_modules') >= 0 &&
        resource.match(/\.js$/)
      )
    },
    {
      name: 'manifest',
      minChunks: Infinity
    }
  ])
]);

const productionConfig = merge([
  {
    output: {
      chunkFilename: '[name].[chunkhash:8].js',
      filename: '[name].[chunkhash:8].js'
    },
    performance: {
      hints: 'warning',
      maxEntrypointSize: 100000,
      maxAssetSize: 450000
    }
  },
  parts.clean(PATHS.build),
  parts.minifyJavascript(),
  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true
      },
      safe: true
    }
  }),
  parts.extractCSS({
    use: ['css-loader', parts.autoprefix()]
  }),
  parts.loadImages({
    options: {
      limit: 150000,
      name: '[name].[hash:8].[ext]'
    }
  }),
  parts.generateSourceMaps({ type: 'source-map' }),
  parts.attachRevision(),
  parts.setFreeVariable('process.env.NODE_ENV', 'production')
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
