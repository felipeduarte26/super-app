import type {Notification} from '../../domain/entities/Notification';
import type {NotificationViewModel} from '../viewModels/NotificationViewModel';

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 60) {
    return `${diffMin}min atrás`;
  }
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) {
    return `${diffHours}h atrás`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d atrás`;
}

export class NotificationMapper {
  static toViewModel(notification: Notification): NotificationViewModel {
    return {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      isUnread: !notification.read,
      timeAgo: formatTimeAgo(notification.createdAt),
      type: notification.type,
    };
  }

  static toViewModelList(notifications: Notification[]): NotificationViewModel[] {
    return notifications.map(n => NotificationMapper.toViewModel(n));
  }
}
