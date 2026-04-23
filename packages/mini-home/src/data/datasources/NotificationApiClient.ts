import {HttpClientFactory, type IHttpClient} from '@super-app/core';
import type {Notification, NotificationType} from '../../domain/entities/Notification';

interface NotificationApiResponse {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  type: NotificationType;
}

const BASE_URL = 'https://api.wiipo.com.br/v1';

const MOCK_DATA: NotificationApiResponse[] = [
  {
    id: '1',
    title: 'Bem-vindo ao Super App!',
    message: 'Explore os módulos independentes da POC.',
    is_read: false,
    created_at: new Date(Date.now() - 5 * 60_000).toISOString(),
    type: 'info',
  },
  {
    id: '2',
    title: 'Module Federation ativo',
    message: 'Este módulo foi carregado remotamente via Re.Pack.',
    is_read: false,
    created_at: new Date(Date.now() - 30 * 60_000).toISOString(),
    type: 'success',
  },
  {
    id: '3',
    title: 'Event Bus funcionando',
    message: 'Mude o tema em Settings e veja a Home atualizar.',
    is_read: true,
    created_at: new Date(Date.now() - 2 * 3_600_000).toISOString(),
    type: 'promo',
  },
  {
    id: '4',
    title: 'Clean Architecture',
    message: 'Este Mini App segue Domain → Application → Data → Presentation.',
    is_read: true,
    created_at: new Date(Date.now() - 24 * 3_600_000).toISOString(),
    type: 'info',
  },
];

function mapResponseToEntity(dto: NotificationApiResponse): Notification {
  return {
    id: dto.id,
    title: dto.title,
    message: dto.message,
    read: dto.is_read,
    createdAt: new Date(dto.created_at),
    type: dto.type,
  };
}

export class NotificationApiClient {
  private httpClient: IHttpClient;

  constructor(httpClient?: IHttpClient) {
    this.httpClient = httpClient ?? HttpClientFactory.create();
    this.httpClient.setBaseUrl(BASE_URL);
  }

  async fetchNotifications(): Promise<Notification[]> {

    await this.simulateDelay();
    return MOCK_DATA.map(mapResponseToEntity);
  }

  async patchMarkAsRead(id: string): Promise<void> {
    

    await this.simulateDelay();
    const item = MOCK_DATA.find(n => n.id === id);
    if (item) {
      item.is_read = true;
    }
  }

  private async simulateDelay(): Promise<void> {
    const ms = 200 + Math.random() * 300;
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
