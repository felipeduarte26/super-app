import path from 'node:path';
import {fileURLToPath} from 'node:url';
import * as Repack from '@callstack/repack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default Repack.defineRspackConfig({
  context: __dirname,
  entry: './src/index.ts',
  resolve: {
    ...Repack.getResolveOptions(),
  },
  module: {
    rules: [
      {
        test: /\.[cm]?[jt]sx?$/,
        type: 'javascript/auto',
        use: {
          loader: '@callstack/repack/babel-swc-loader',
          parallel: true,
          options: {},
        },
      },
      ...Repack.getAssetTransformRules(),
    ],
  },
  plugins: [
    new Repack.RepackPlugin(),
    new Repack.plugins.ModuleFederationPluginV2({
      name: 'MiniHome',
      dts: false,
      filename: 'MiniHome.container.js.bundle',
      exposes: {
        './Navigator': './src/Navigator.tsx',
        './manifest': './src/manifest.ts',
      },
      shared: {
        react: {singleton: true, eager: true},
        'react-native': {singleton: true, eager: true},
        '@super-app/core': {singleton: true, eager: true},
      },
    }),
  ],
});
