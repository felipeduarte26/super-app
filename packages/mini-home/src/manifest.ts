import type {MiniAppManifest} from '@super-app/core';

export const manifest: MiniAppManifest = {
  name: 'home',
  displayName: 'Home',
  version: '1.0.0',
  routes: [{name: 'Home', screen: 'Main'}],
  tabConfig: {
    icon: 'home',
    label: 'Home',
    order: 1,
  },
};
