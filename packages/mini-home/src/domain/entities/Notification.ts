export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  type: NotificationType;
}

export type NotificationType = 'info' | 'warning' | 'success' | 'promo';
