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
