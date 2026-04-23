export type ThemeMode = 'light' | 'dark';

export type AppLanguage = 'pt-BR' | 'en-US' | 'es-ES';

export interface AppSettings {
  theme: ThemeMode;
  language: AppLanguage;
  notificationsEnabled: boolean;
  biometricEnabled: boolean;
  appVersion: string;
}
