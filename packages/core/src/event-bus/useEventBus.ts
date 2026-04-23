import {useEffect, useRef} from 'react';
import {EventBus} from './EventBus';

export function useEventBus<T = unknown>(
  event: string,
  callback: (payload: T) => void,
): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const unsubscribe = EventBus.on<T>(event, payload => {
      callbackRef.current(payload);
    });
    return unsubscribe;
  }, [event]);
}
