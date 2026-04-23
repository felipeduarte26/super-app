import {SettingsApiClient} from '../data/datasources/SettingsApiClient';
import {SettingsRepositoryImpl} from '../data/repositories/SettingsRepositoryImpl';
import {GetSettingsUseCase} from '../application/useCases/GetSettingsUseCase';
import {UpdateSettingsUseCase} from '../application/useCases/UpdateSettingsUseCase';

const settingsDataSource = new SettingsApiClient();
const settingsRepository = new SettingsRepositoryImpl(settingsDataSource);

export const container = {
  getSettingsUseCase: new GetSettingsUseCase(settingsRepository),
  updateSettingsUseCase: new UpdateSettingsUseCase(settingsRepository),
} as const;
