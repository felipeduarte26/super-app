import type {Notification} from '../entities/Notification';

export function filterUnreadNotifications(
  notifications: Notification[],
): Notification[] {
  return notifications.filter(n => !n.read);
}

export function sortByDate(notifications: Notification[]): Notification[] {
  return [...notifications].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
}
