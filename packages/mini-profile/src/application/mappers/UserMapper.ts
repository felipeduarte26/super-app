import type {User} from '../../domain/entities/User';
import type {UserViewModel} from '../viewModels/UserViewModel';

export class UserMapper {
  static toViewModel(user: User): UserViewModel {
    const trimmedName = user.name.trim();
    const initials =
      trimmedName.length >= 2
        ? trimmedName.slice(0, 2).toUpperCase()
        : trimmedName.toUpperCase().padEnd(2, '?');

    return {
      id: user.id,
      displayName: user.name,
      email: user.email,
      bio: user.bio,
      avatarInitials: initials,
      memberSinceFormatted: UserMapper.formatMemberSince(user.memberSince),
    };
  }

  private static formatMemberSince(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  }
}
