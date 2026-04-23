export const AppEvents = {
  AUTH_LOGIN: 'auth:login',
  AUTH_LOGOUT: 'auth:logout',

  NAVIGATE_TO_SCREEN: 'nav:navigate_to_screen',
  NAVIGATE_TO_TAB: 'nav:navigate_to_tab',

  PROFILE_UPDATED: 'profile:updated',
  THEME_CHANGED: 'theme:changed',

  NOTIFICATION_RECEIVED: 'notification:received',
  NOTIFICATION_BADGE_CHANGED: 'notification:badge_changed',

  SETTINGS_LANGUAGE_CHANGED: 'settings:language_changed',
} as const;

export type AppEvent = (typeof AppEvents)[keyof typeof AppEvents];

/**
 * Mapa de tipos: cada evento → tipo do payload.
 * Garante type-safety no emit() e on().
 */
export interface EventPayloadMap {
  [AppEvents.AUTH_LOGIN]: {userId: string};
  [AppEvents.AUTH_LOGOUT]: undefined;
  [AppEvents.NAVIGATE_TO_SCREEN]: {screen: string; params?: Record<string, unknown>};
  [AppEvents.NAVIGATE_TO_TAB]: {tab: string};
  [AppEvents.PROFILE_UPDATED]: {name: string};
  [AppEvents.THEME_CHANGED]: {mode: 'light' | 'dark'};
  [AppEvents.NOTIFICATION_RECEIVED]: {id: string; title: string};
  [AppEvents.NOTIFICATION_BADGE_CHANGED]: {count: number};
  [AppEvents.SETTINGS_LANGUAGE_CHANGED]: {language: string};
}
