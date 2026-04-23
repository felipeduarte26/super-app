import path from 'node:path';
import {fileURLToPath} from 'node:url';
import * as Repack from '@callstack/repack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default Repack.defineRspackConfig({
  context: __dirname,
  entry: './index.js',
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
      name: 'HostApp',
      dts: false,
      remotes: {
        MiniHome: 'MiniHome@http://localhost:9001/[platform]/MiniHome.container.js.bundle',
        MiniProfile: 'MiniProfile@http://localhost:9002/[platform]/MiniProfile.container.js.bundle',
        MiniSettings: 'MiniSettings@http://localhost:9003/[platform]/MiniSettings.container.js.bundle',
      },
      shared: {
        react: {singleton: true, eager: true},
        'react-native': {singleton: true, eager: true},
        '@super-app/core': {singleton: true, eager: true},
      },
    }),
  ],
});
