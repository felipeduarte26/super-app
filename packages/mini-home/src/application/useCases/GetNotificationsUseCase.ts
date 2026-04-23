import {type Result, success} from '@super-app/core';
import type {HomeFailure} from '../../domain/failures';
import type {INotificationRepository} from '../../domain/repositories/INotificationRepository';
import {sortByDate} from '../../domain/rules/filterUnreadNotifications';
import {NotificationMapper} from '../mappers/NotificationMapper';
import type {NotificationViewModel} from '../viewModels/NotificationViewModel';

export class GetNotificationsUseCase {
  constructor(private repository: INotificationRepository) {}

  async execute(): Promise<Result<NotificationViewModel[], HomeFailure>> {
    const result = await this.repository.getAll();
    return result.flatMap(notifications => {
      const sorted = sortByDate(notifications);
      return success(NotificationMapper.toViewModelList(sorted));
    });
  }
}
