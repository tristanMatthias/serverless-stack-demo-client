
import execa from 'execa';
import webpack, { Configuration } from 'webpack';
import ForkTSCheckerPlugin from 'fork-ts-checker-webpack-plugin';
import HTMLPlugin from 'html-webpack-plugin';


const { stdout: hash } = execa.sync('git', ['rev-parse', 'HEAD']);


export default {
  entry: './src/index.tsx',
  output: {
    filename: '[hash].js',
    chunkFilename: '[chunkhash].js',
    publicPath: '/'
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs']
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: { fullySpecified: false }
      },
      {
        test: /\.(ts|tsx)/,
        use: [{
          loader: 'babel-loader',
          options: {
            plugins: [
              // %%HASH%% replace with git hash
              ['search-and-replace', {
                rules: [
                  { search: '%%HASH%%', replace: hash }
                ]
              }]
            ]
          }
        }]
      },

      {
        test: /\.(svg|png|jpg|jpeg)$/,
        loader: 'file-loader',
        options: { name: 'images/[hash].[ext]' }
      },
      {
        test: /\/fonts\/.*\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: { name: 'fonts/[hash].[ext]' }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },

  plugins: [
    new HTMLPlugin({ template: './src/index.html' }),
    new ForkTSCheckerPlugin(),
    new webpack.ProvidePlugin({
      process: 'process/browser'
    })
  ]
} as Configuration;
