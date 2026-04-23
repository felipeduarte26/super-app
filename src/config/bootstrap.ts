import {AppEvents, EventBus, I18nStore, type AppLocale} from '@super-app/core';
import {registerMiniApp} from './miniApps';

import HomeNavigator from '@super-app/mini-home/src/Navigator';
import {manifest as homeManifest} from '@super-app/mini-home/src/manifest';

import ProfileNavigator from '@super-app/mini-profile/src/Navigator';
import {manifest as profileManifest} from '@super-app/mini-profile/src/manifest';

import SettingsNavigator from '@super-app/mini-settings/src/Navigator';
import {manifest as settingsManifest} from '@super-app/mini-settings/src/manifest';

export function bootstrapMiniApps(): void {
  EventBus.on(
    AppEvents.SETTINGS_LANGUAGE_CHANGED,
    (payload: {language: AppLocale}) => {
      I18nStore.setLocale(payload.language);
    },
  );
  registerMiniApp({
    manifest: homeManifest,
    getNavigator: () => HomeNavigator,
  });

  registerMiniApp({
    manifest: profileManifest,
    getNavigator: () => ProfileNavigator,
  });

  registerMiniApp({
    manifest: settingsManifest,
    getNavigator: () => SettingsNavigator,
  });
}
