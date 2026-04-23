import type {Result} from '@super-app/core';
import type {User} from '../entities/User';
import type {ProfileFailure} from '../failures';

export interface IUserRepository {
  getUser(): Promise<Result<User, ProfileFailure>>;
  updateUser(user: Partial<User>): Promise<Result<User, ProfileFailure>>;
}
