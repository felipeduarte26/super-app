import type {Result} from '@super-app/core';
import type {AppSettings} from '../entities/AppSettings';
import type {SettingsFailure} from '../failures';

export interface ISettingsRepository {
  getSettings(): Promise<Result<AppSettings, SettingsFailure>>;
  updateSettings(
    settings: Partial<AppSettings>,
  ): Promise<Result<AppSettings, SettingsFailure>>;
  resetToDefaults(): Promise<Result<AppSettings, SettingsFailure>>;
}
