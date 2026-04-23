import {NotificationApiClient} from '../data/datasources/NotificationApiClient';
import {NotificationRepositoryImpl} from '../data/repositories/NotificationRepositoryImpl';
import {GetNotificationsUseCase} from '../application/useCases/GetNotificationsUseCase';

const notificationDataSource = new NotificationApiClient();
const notificationRepository = new NotificationRepositoryImpl(notificationDataSource);

export const container = {
  getNotificationsUseCase: new GetNotificationsUseCase(notificationRepository),
} as const;
