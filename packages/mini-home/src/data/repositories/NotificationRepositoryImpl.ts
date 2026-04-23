import {BaseRepository, HttpError, NoParams, type HandleExceptionFn} from '@super-app/core';
import type {Result} from '@super-app/core';
import type {Notification} from '../../domain/entities/Notification';
import {
  type HomeFailure,
  HomeServerFailure,
  HomeTimeoutFailure,
  HomeUnexpectedFailure,
} from '../../domain/failures';
import type {INotificationRepository} from '../../domain/repositories/INotificationRepository';
import {filterUnreadNotifications} from '../../domain/rules/filterUnreadNotifications';
import {NotificationApiClient} from '../datasources/NotificationApiClient';

export class NotificationRepositoryImpl
  extends BaseRepository<HomeFailure>
  implements INotificationRepository
{
  constructor(private readonly apiClient: NotificationApiClient) {
    super();
  }

  async getAll(): Promise<Result<Notification[], HomeFailure>> {
    return this.execute(
      () => this.apiClient.fetchNotifications(),
      notifications => notifications,
    );
  }

  async getUnreadCount(): Promise<Result<number, HomeFailure>> {
    return this.execute(
      () => this.apiClient.fetchNotifications(),
      notifications => filterUnreadNotifications(notifications).length,
    );
  }

  async markAsRead(id: string): Promise<Result<NoParams, HomeFailure>> {
    return this.execute(
      () => this.apiClient.patchMarkAsRead(id),
      () => NoParams.create(),
    );
  }

   protected handleException: HandleExceptionFn<HomeFailure> = error => {
    if (error instanceof HttpError) {
      if (error.status >= 500) {
        return new HomeServerFailure(error.message);
      }
    }
    if (error instanceof TypeError && error.message === 'Network request failed') {
      return new HomeTimeoutFailure();
    }
    if (error instanceof Error && error.name === 'AbortError') {
      return new HomeTimeoutFailure();
    }
    return new HomeUnexpectedFailure(String(error));
  };
}
