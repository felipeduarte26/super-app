import type {Result} from '@super-app/core';
import type {SettingsFailure} from '../../domain/failures';
import type {ISettingsRepository} from '../../domain/repositories/ISettingsRepository';
import {SettingsMapper} from '../mappers/SettingsMapper';
import type {SettingsViewModel} from '../viewModels/SettingsViewModel';

export class GetSettingsUseCase {
  constructor(private repository: ISettingsRepository) {}

  async execute(): Promise<Result<SettingsViewModel, SettingsFailure>> {
    const result = await this.repository.getSettings();
    return result.map(SettingsMapper.toViewModel);
  }
}
