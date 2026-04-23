import type {MiniAppManifest} from '@super-app/core';

export const manifest: MiniAppManifest = {
  name: 'profile',
  displayName: 'Perfil',
  version: '1.0.0',
  routes: [{name: 'Profile', screen: 'Main'}],
  tabConfig: {
    icon: 'person',
    label: 'Perfil',
    order: 2,
  },
};
