import {BaseRepository, HttpError, type HandleExceptionFn} from '@super-app/core';
import type {Result} from '@super-app/core';
import type {AppSettings} from '../../domain/entities/AppSettings';
import {
  type SettingsFailure,
  SettingsServerFailure,
  SettingsTimeoutFailure,
  SettingsUnexpectedFailure,
} from '../../domain/failures';
import type {ISettingsRepository} from '../../domain/repositories/ISettingsRepository';
import {SettingsApiClient} from '../datasources/SettingsApiClient';

export class SettingsRepositoryImpl
  extends BaseRepository<SettingsFailure>
  implements ISettingsRepository
{
  constructor(private readonly apiClient: SettingsApiClient) {
    super();
  }

  protected handleException: HandleExceptionFn<SettingsFailure> = error => {
    if (error instanceof HttpError) {
      if (error.status >= 500) {
        return new SettingsServerFailure(error.message);
      }
    }
    if (error instanceof TypeError && error.message === 'Network request failed') {
      return new SettingsTimeoutFailure();
    }
    if (error instanceof Error && error.name === 'AbortError') {
      return new SettingsTimeoutFailure();
    }
    return new SettingsUnexpectedFailure(String(error));
  };

  async getSettings(): Promise<Result<AppSettings, SettingsFailure>> {
    return this.execute(
      () => this.apiClient.fetchSettings(),
      settings => settings,
    );
  }

  async updateSettings(
    settings: Partial<AppSettings>,
  ): Promise<Result<AppSettings, SettingsFailure>> {
    return this.execute(
      () => this.apiClient.updateSettings(settings),
      updated => updated,
    );
  }

  async resetToDefaults(): Promise<Result<AppSettings, SettingsFailure>> {
    return this.execute(
      () => this.apiClient.resetSettings(),
      settings => settings,
    );
  }
}
