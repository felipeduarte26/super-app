import {useState, useCallback, useEffect} from 'react';
import type {HomeFailure} from '../../domain/failures';
import type {NotificationViewModel} from '../../application/viewModels/NotificationViewModel';
import {container} from '../../di';

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationViewModel[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<HomeFailure | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await container.getNotificationsUseCase.execute();

    result.fold(
      err => setError(err),
      data => setNotifications(data),
    );

    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const unreadCount = notifications.filter(n => n.isUnread).length;

  return {notifications, loading, error, unreadCount, refresh};
}
