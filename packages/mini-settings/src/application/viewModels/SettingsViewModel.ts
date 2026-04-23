import type {AppLanguage, ThemeMode} from '../../domain/entities/AppSettings';

export interface LanguageOption {
  code: AppLanguage;
  label: string;
}

export interface SettingsViewModel {
  theme: ThemeMode;
  languageCode: AppLanguage;
  languageLabel: string;
  notificationsEnabled: boolean;
  biometricEnabled: boolean;
  appVersion: string;
  isDarkMode: boolean;
  availableLanguages: ReadonlyArray<LanguageOption>;
}
