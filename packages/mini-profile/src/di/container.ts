import {UserApiClient} from '../data/datasources/UserApiClient';
import {UserRepositoryImpl} from '../data/repositories/UserRepositoryImpl';
import {GetUserUseCase} from '../application/useCases/GetUserUseCase';
import {UpdateUserUseCase} from '../application/useCases/UpdateUserUseCase';

const userDataSource = new UserApiClient();
const userRepository = new UserRepositoryImpl(userDataSource);

export const container = {
  getUserUseCase: new GetUserUseCase(userRepository),
  updateUserUseCase: new UpdateUserUseCase(userRepository),
} as const;
