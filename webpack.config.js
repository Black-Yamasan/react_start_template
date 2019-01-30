const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const glob = require('glob');
const entries = {};
const isProd = process.env.NODE_ENV === 'production' ? true : false;
const modeValue = process.env.NODE_ENV;

let destDir = null;
if ( isProd ) {
  destDir = 'htdocs';
} else {
  destDir = 'dist'
}

glob.sync('./src/js/*.js', {
  ignore: './src/**/*_.js'
}).map((file) => {
  const regExp = new RegExp(`./src/js/`);
  const key = file.replace(regExp, '');
  entries[key] = file;
});


module.exports = {
  entry: entries,
  mode: modeValue,
  optimization: {
    usedExports: true,
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: isProd,
        uglifyOptions: {
          compress: { drop_console: isProd }
        }
      })
    ]
  },
  output: {
    path: path.resolve(__dirname, `${destDir}`),
    filename: '[name]'
  },
  devServer: {
    contentBase: path.resolve(__dirname, `./${destDir}`),
    inline: true,
    open: true,
    openPage: '',
    watchContentBase: true,
    port: 3000
  },
  devtool: !isProd ? 'inline-source-map' : false,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {}
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      Component: path.join(__dirname, 'src/react/component')
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
};
