import type {AppSettings} from '../../domain/entities/AppSettings';
import {getAvailableLanguages} from '../../domain/rules/settingsRules';
import type {SettingsViewModel} from '../viewModels/SettingsViewModel';

export class SettingsMapper {
  static toViewModel(settings: AppSettings): SettingsViewModel {
    const languages = getAvailableLanguages();
    const match = languages.find(l => l.code === settings.language);

    return {
      theme: settings.theme,
      languageCode: settings.language,
      languageLabel: match?.label ?? settings.language,
      notificationsEnabled: settings.notificationsEnabled,
      biometricEnabled: settings.biometricEnabled,
      appVersion: settings.appVersion,
      isDarkMode: settings.theme === 'dark',
      availableLanguages: languages.map(l => ({code: l.code, label: l.label})),
    };
  }
}
