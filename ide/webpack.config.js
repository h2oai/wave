const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    app: './src/index.tsx'
  },
  devServer: {
    port: 3000,
    open: true,
    hot: true,
    watchContentBase: true,
    historyApiFallback: true,
    stats: 'minimal',
    proxy: {
      '/_p': 'http://localhost:55555'
    }
  },
  optimization: {
    minimize: !isDevelopment,
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
    alias: {
      '@static': path.resolve(__dirname, 'static'),
      '@': path.resolve(__dirname, 'src/'),
    }
  },
  output: {
    globalObject: 'self',
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: isDevelopment ? '/' : '/_ide/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react'],
              plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean)
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif|ttf)$/,
        use: ['file-loader']
      },
      {
        test: /\.worker\.js$/,
        use: ['worker-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({ template: 'src/index.html', minify: 'auto', favicon: "./static/favicon.ico" }),
    isDevelopment && new ReactRefreshWebpackPlugin(),
    new webpack.DefinePlugin({
      BASENAME: isDevelopment ? JSON.stringify('') : JSON.stringify('_ide'),
      IFRAME_URL: isDevelopment ? JSON.stringify('http://localhost:55555') : JSON.stringify('')
    }),
  ].filter(Boolean),
};
