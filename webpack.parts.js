exports.devServer = ({host, port} = {}) => ({
  devServer: {
    historyApiFallback: true,
    host,
    port,
    overlay: {
      errors: true,
      warnings: true
    }
  }
});

exports.lintJs = ({include, exclude, options}) => ({
  module: {
    rules: [{
      test: /\.js$/,
      include,
      exclude,
      enforce: 'pre',
      loader: 'eslint-loader',
      options
    }]
  }
});

exports.loadCSS = ({include, exclude} = {}) => ({
  module: {
    rules: [
      {
        test: /\.scss$/,
        include,
        exclude,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          {
            loader: 'fast-sass-loader'
          }
        ]
      }
    ]
  }
});
