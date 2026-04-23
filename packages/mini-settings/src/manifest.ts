import type {MiniAppManifest} from '@super-app/core';

export const manifest: MiniAppManifest = {
  name: 'settings',
  displayName: 'Configurações',
  version: '1.0.0',
  routes: [{name: 'Settings', screen: 'Main'}],
  tabConfig: {
    icon: 'settings',
    label: 'Configurações',
    order: 3,
  },
};
