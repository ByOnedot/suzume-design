// Custom webpack build configuration (consumed by tools/build-scripts).
const path = require('path');
const webpack = require('webpack');
const { version, description } = require('../package.json');

const BANNER = [
  `Suzume Design v${version}`,
  description || '',
  '',
  'Copyright (c) 2019-present Bytedance, Inc. and its affiliates.',
  'Copyright (c) 2026 Suzume Design.',
  '',
  'Licensed under the MIT License. See LICENSE for details.',
].join('\n');

function withBanner(config) {
  config.plugins.pop();
  config.plugins.push(new webpack.BannerPlugin({ banner: BANNER }));
  return config;
}

// Component dist bundle
exports.component = (config) => {
  if (process.env.BUILD_TYPE === 'hooks') {
    config.entry = { 'suzume-hooks': path.resolve(__dirname, '../hooks/src-es/index.ts') };
    config.output.library = 'suzumehooks';
  } else {
    config.entry = { suzume: path.resolve(__dirname, '../components/index.tsx') };
    config.output.library = '[name]';
  }
  return withBanner(config);
};

// Icon dist bundle
exports.icon = (config) => withBanner(config);
