const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env = { mode: 'development' }) => {
  return {
    entry: './src/index.ts',
    mode: env.mode,
    output: {
      path: path.resolve(__dirname, './dist'),
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: 9000,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /test\.js$/,
          use: 'mocha-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [new HtmlWebpackPlugin()],
  };
};
