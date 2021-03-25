
import { Configuration } from 'webpack';
import merge from 'webpack-merge';
import common from './common';

export default merge(common, {
  // @ts-ignore
  devServer: {
    compress: true,
    port: parseInt(process.env.PORT || '8888', 10),
    historyApiFallback: true,
    writeToDisk: true
  },
  devtool: 'cheap-source-map'

}) as Configuration;
