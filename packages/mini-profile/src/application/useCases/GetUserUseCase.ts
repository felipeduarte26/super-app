import type {Result} from '@super-app/core';
import type {ProfileFailure} from '../../domain/failures';
import type {IUserRepository} from '../../domain/repositories/IUserRepository';
import {UserMapper} from '../mappers/UserMapper';
import type {UserViewModel} from '../viewModels/UserViewModel';

export class GetUserUseCase {
  constructor(private repository: IUserRepository) {}

  async execute(): Promise<Result<UserViewModel, ProfileFailure>> {
    const result = await this.repository.getUser();
    return result.map(UserMapper.toViewModel);
  }
}
