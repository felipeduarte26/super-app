import type {AppLanguage, AppSettings} from '../entities/AppSettings';

const AVAILABLE_LANGUAGES: ReadonlyArray<{code: AppLanguage; label: string}> = [
  {code: 'pt-BR', label: 'Português (Brasil)'},
  {code: 'en-US', label: 'English (US)'},
  {code: 'es-ES', label: 'Español (España)'},
] as const;

export function getDefaultSettings(): AppSettings {
  return {
    theme: 'light',
    language: 'pt-BR',
    notificationsEnabled: true,
    biometricEnabled: false,
    appVersion: '1.0.0',
  };
}

export function isValidLanguage(lang: string): lang is AppLanguage {
  return AVAILABLE_LANGUAGES.some(entry => entry.code === lang);
}

export function getAvailableLanguages(): ReadonlyArray<{
  code: AppLanguage;
  label: string;
}> {
  return AVAILABLE_LANGUAGES;
}
