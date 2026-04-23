import type {NotificationType} from '../../domain/entities/Notification';

export interface NotificationViewModel {
  id: string;
  title: string;
  message: string;
  isUnread: boolean;
  timeAgo: string;
  type: NotificationType;
}
