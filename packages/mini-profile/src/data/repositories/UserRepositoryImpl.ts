import {BaseRepository, HttpError, type HandleExceptionFn} from '@super-app/core';
import type {Result} from '@super-app/core';
import type {User} from '../../domain/entities/User';
import {
  type ProfileFailure,
  ProfileNotFoundFailure,
  ProfileServerFailure,
  ProfileTimeoutFailure,
  ProfileUnexpectedFailure,
} from '../../domain/failures';
import type {IUserRepository} from '../../domain/repositories/IUserRepository';
import {UserApiClient} from '../datasources/UserApiClient';

export class UserRepositoryImpl
  extends BaseRepository<ProfileFailure>
  implements IUserRepository
{
  constructor(private readonly apiClient: UserApiClient) {
    super();
  }

  protected handleException: HandleExceptionFn<ProfileFailure> = error => {
    if (error instanceof HttpError) {
      if (error.status === 404) {
        return new ProfileNotFoundFailure();
      }
      if (error.status >= 500) {
        return new ProfileServerFailure(error.message);
      }
    }
    if (error instanceof TypeError && error.message === 'Network request failed') {
      return new ProfileTimeoutFailure();
    }
    if (error instanceof Error && error.name === 'AbortError') {
      return new ProfileTimeoutFailure();
    }
    return new ProfileUnexpectedFailure(String(error));
  };

  async getUser(): Promise<Result<User, ProfileFailure>> {
    return this.execute(
      () => this.apiClient.fetchUser(),
      user => user,
    );
  }

  async updateUser(partial: Partial<User>): Promise<Result<User, ProfileFailure>> {
    return this.execute(
      () => this.apiClient.updateUser(partial),
      user => user,
    );
  }
}
