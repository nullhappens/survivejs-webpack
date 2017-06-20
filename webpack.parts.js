const ExtractTextPlugin = require('extract-text-webpack-plugin');

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

exports.extractCSS = ({include, exclude, use}) => {
  const plugin = new ExtractTextPlugin({
    filename: 'css/[name].css'
  });

  return {
    module: {
      rules: [
        {
          test: /\.scss$/,
          include,
          exclude,
          use: plugin.extract({
            use,
            fallback: 'style-loader',
            loader: 'css-loader!sass-loader'
          })
        }
      ]
    },
    plugins: [plugin]
  };
};

exports.autoprefix = () => ({
  loader: 'postcss-loader',
  options: {
    plugins: () => ([
      require('autoprefixer')()
    ])
  }
});
