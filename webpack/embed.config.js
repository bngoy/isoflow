const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  target: 'web',
  entry: './src/embed.tsx',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'isoflow-embed.js',
    library: 'IsoflowEmbed',
    libraryTarget: 'umd',
    libraryExport: 'default',
    globalObject: 'this'
  },
  // No externals — React/ReactDOM are bundled in
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.svg$/,
        type: 'asset/inline'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      PACKAGE_VERSION: JSON.stringify(require('../package.json').version),
      REPOSITORY_URL: JSON.stringify(require('../package.json').repository.url),
    })
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()]
  }
};
