import {type Result, failure} from '@super-app/core';
import type {User} from '../../domain/entities/User';
import {
  type ProfileFailure,
  ProfileValidationFailure,
} from '../../domain/failures';
import type {IUserRepository} from '../../domain/repositories/IUserRepository';
import {
  validateBio,
  validateEmail,
  validateName,
} from '../../domain/rules/validateUser';
import {UserMapper} from '../mappers/UserMapper';
import type {UserViewModel} from '../viewModels/UserViewModel';

export type UserProfileField = 'name' | 'email' | 'bio';

export type UserUpdateInput = Partial<Record<UserProfileField, string>>;

export class UpdateUserUseCase {
  constructor(private repository: IUserRepository) {}

  async execute(
    updates: UserUpdateInput,
  ): Promise<Result<UserViewModel, ProfileFailure>> {
    const currentResult = await this.repository.getUser();

    return currentResult.flatMapAsync(async current => {
      const merged: User = {...current, ...updates};
      const fieldErrors: Record<string, string> = {};

      const nameCheck = validateName(merged.name);
      if (!nameCheck.valid && nameCheck.error) {
        fieldErrors.name = nameCheck.error;
      }

      const emailCheck = validateEmail(merged.email);
      if (!emailCheck.valid && emailCheck.error) {
        fieldErrors.email = emailCheck.error;
      }

      const bioCheck = validateBio(merged.bio);
      if (!bioCheck.valid && bioCheck.error) {
        fieldErrors.bio = bioCheck.error;
      }

      if (Object.keys(fieldErrors).length > 0) {
        return failure(
          new ProfileValidationFailure(
            'Dados do perfil inválidos.',
            fieldErrors,
          ),
        );
      }

      const updateResult = await this.repository.updateUser(updates);
      return updateResult.map(UserMapper.toViewModel);
    });
  }
}
