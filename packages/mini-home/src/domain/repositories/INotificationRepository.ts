import type {NoParams, Result} from '@super-app/core';
import type {Notification} from '../entities/Notification';
import type {HomeFailure} from '../failures';

export interface INotificationRepository {
  getAll(): Promise<Result<Notification[], HomeFailure>>;
  getUnreadCount(): Promise<Result<number, HomeFailure>>;
  markAsRead(id: string): Promise<Result<NoParams, HomeFailure>>;
}
