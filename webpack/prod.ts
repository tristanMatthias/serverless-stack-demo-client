
import { Configuration } from 'webpack';
import merge from 'webpack-merge';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import common from './common';

const plugins = [];
if (process.env.CI) {
  console.log('Running CI. Skipping BundleAnalyzerPlugin');
} else {
  plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false
    })
  );
}

export default merge(common, {
  mode: 'production',
  plugins
}) as Configuration;
