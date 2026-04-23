import {HttpClientFactory, type IHttpClient} from '@super-app/core';
import type {AppLanguage, AppSettings, ThemeMode} from '../../domain/entities/AppSettings';
import {getDefaultSettings} from '../../domain/rules/settingsRules';

interface SettingsApiResponse {
  theme: ThemeMode;
  language: AppLanguage;
  notifications_enabled: boolean;
  biometric_enabled: boolean;
  app_version: string;
}

interface UpdateSettingsRequest {
  theme?: ThemeMode;
  language?: AppLanguage;
  notifications_enabled?: boolean;
  biometric_enabled?: boolean;
}

const BASE_URL = 'https://api.wiipo.com.br/v1';

function createMockResponse(): SettingsApiResponse {
  const defaults = getDefaultSettings();
  return {
    theme: defaults.theme,
    language: defaults.language,
    notifications_enabled: defaults.notificationsEnabled,
    biometric_enabled: defaults.biometricEnabled,
    app_version: defaults.appVersion,
  };
}

function mapResponseToEntity(dto: SettingsApiResponse): AppSettings {
  return {
    theme: dto.theme,
    language: dto.language,
    notificationsEnabled: dto.notifications_enabled,
    biometricEnabled: dto.biometric_enabled,
    appVersion: dto.app_version,
  };
}

function mapEntityToRequest(settings: Partial<AppSettings>): UpdateSettingsRequest {
  const request: UpdateSettingsRequest = {};
  if (settings.theme !== undefined) {
    request.theme = settings.theme;
  }
  if (settings.language !== undefined) {
    request.language = settings.language;
  }
  if (settings.notificationsEnabled !== undefined) {
    request.notifications_enabled = settings.notificationsEnabled;
  }
  if (settings.biometricEnabled !== undefined) {
    request.biometric_enabled = settings.biometricEnabled;
  }
  return request;
}

export class SettingsApiClient {
  private httpClient: IHttpClient;
  private mockData: SettingsApiResponse = createMockResponse();

  constructor(httpClient?: IHttpClient) {
    this.httpClient = httpClient ?? HttpClientFactory.create();
    this.httpClient.setBaseUrl(BASE_URL);
  }

  async fetchSettings(): Promise<AppSettings> {
    // POC: retorna mock. Em produção:
    // const response = await this.httpClient.get<SettingsApiResponse>('/settings');
    // return mapResponseToEntity(response.data);

    await this.simulateDelay();
    return mapResponseToEntity(this.mockData);
  }

  async updateSettings(partial: Partial<AppSettings>): Promise<AppSettings> {
    const body = mapEntityToRequest(partial);

    // POC: mock local. Em produção:
    // const response = await this.httpClient.patch<SettingsApiResponse>('/settings', body);
    // return mapResponseToEntity(response.data);

    await this.simulateDelay();
    if (body.theme !== undefined) {
      this.mockData.theme = body.theme;
    }
    if (body.language !== undefined) {
      this.mockData.language = body.language;
    }
    if (body.notifications_enabled !== undefined) {
      this.mockData.notifications_enabled = body.notifications_enabled;
    }
    if (body.biometric_enabled !== undefined) {
      this.mockData.biometric_enabled = body.biometric_enabled;
    }
    return mapResponseToEntity(this.mockData);
  }

  async resetSettings(): Promise<AppSettings> {
    // POC: mock local. Em produção:
    // const response = await this.httpClient.post<SettingsApiResponse>('/settings/reset');
    // return mapResponseToEntity(response.data);

    await this.simulateDelay();
    this.mockData = createMockResponse();
    return mapResponseToEntity(this.mockData);
  }

  private async simulateDelay(): Promise<void> {
    const ms = 150 + Math.random() * 250;
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
