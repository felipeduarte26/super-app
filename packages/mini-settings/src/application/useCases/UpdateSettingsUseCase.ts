import {type Result, failure} from '@super-app/core';
import type {AppSettings, AppLanguage, ThemeMode} from '../../domain/entities/AppSettings';
import {
  type SettingsFailure,
  SettingsValidationFailure,
} from '../../domain/failures';
import type {ISettingsRepository} from '../../domain/repositories/ISettingsRepository';
import {isValidLanguage} from '../../domain/rules/settingsRules';
import {SettingsMapper} from '../mappers/SettingsMapper';
import type {SettingsViewModel} from '../viewModels/SettingsViewModel';

export interface SettingsUpdateInput {
  theme?: ThemeMode;
  language?: AppLanguage;
  notificationsEnabled?: boolean;
  biometricEnabled?: boolean;
}

export class UpdateSettingsUseCase {
  constructor(private repository: ISettingsRepository) {}

  async execute(
    updates: SettingsUpdateInput,
  ): Promise<Result<SettingsViewModel, SettingsFailure>> {
    const patch: Partial<AppSettings> = {...updates};

    if (patch.language !== undefined && !isValidLanguage(patch.language)) {
      return failure(
        new SettingsValidationFailure('Idioma selecionado é inválido.', {
          language: `"${patch.language}" não é suportado.`,
        }),
      );
    }

    const result = await this.repository.updateSettings(patch);
    return result.map(SettingsMapper.toViewModel);
  }

  async resetToDefaults(): Promise<Result<SettingsViewModel, SettingsFailure>> {
    const result = await this.repository.resetToDefaults();
    return result.map(SettingsMapper.toViewModel);
  }
}
