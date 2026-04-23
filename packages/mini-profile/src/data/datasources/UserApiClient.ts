import {HttpClientFactory, type IHttpClient} from '@super-app/core';
import type {User} from '../../domain/entities/User';

interface UserApiResponse {
  id: string;
  full_name: string;
  email: string;
  bio: string;
  avatar_url: string | null;
  member_since: string;
}

interface UpdateUserRequest {
  full_name?: string;
  email?: string;
  bio?: string;
}

const BASE_URL = 'https://api.wiipo.com.br/v1';

const MOCK_USER: UserApiResponse = {
  id: '1',
  full_name: 'Felipe Duarte Barbosa',
  email: 'felipe@teste.com.br',
  bio: 'Mobile Developer | Flutter ',
  avatar_url: null,
  member_since: '2025-03-15T00:00:00.000Z',
};

function mapResponseToEntity(dto: UserApiResponse): User {
  return {
    id: dto.id,
    name: dto.full_name,
    email: dto.email,
    bio: dto.bio,
    avatarUrl: dto.avatar_url,
    memberSince: new Date(dto.member_since),
  };
}

function mapEntityToRequest(user: Partial<User>): UpdateUserRequest {
  const request: UpdateUserRequest = {};
  if (user.name !== undefined) {
    request.full_name = user.name;
  }
  if (user.email !== undefined) {
    request.email = user.email;
  }
  if (user.bio !== undefined) {
    request.bio = user.bio;
  }
  return request;
}

export class UserApiClient {
  private httpClient: IHttpClient;
  private mockData: UserApiResponse = {...MOCK_USER};

  constructor(httpClient?: IHttpClient) {
    this.httpClient = httpClient ?? HttpClientFactory.create();
    this.httpClient.setBaseUrl(BASE_URL);
  }

  async fetchUser(): Promise<User> {


    await this.simulateDelay();
    return mapResponseToEntity(this.mockData);
  }

  async updateUser(partial: Partial<User>): Promise<User> {
    const body = mapEntityToRequest(partial);



    await this.simulateDelay();
    if (body.full_name) {
      this.mockData.full_name = body.full_name;
    }
    if (body.email) {
      this.mockData.email = body.email;
    }
    if (body.bio !== undefined) {
      this.mockData.bio = body.bio;
    }
    return mapResponseToEntity(this.mockData);
  }

  private async simulateDelay(): Promise<void> {
    const ms = 200 + Math.random() * 400;
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
