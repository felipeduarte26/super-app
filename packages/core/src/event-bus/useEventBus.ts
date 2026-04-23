import {useEffect, useRef} from 'react';
import {EventBus} from './EventBus';
import type {EventPayloadMap} from './events';

/**
 * Hook React que escuta um evento com auto-cleanup no unmount.
 *
 * Evento do core (payload inferido):
 * ```tsx
 * useOn(AppEvents.THEME_CHANGED, payload => {
 *   setTheme(payload.mode);
 * });
 * ```
 *
 * Evento customizado de mini-app:
 * ```tsx
 * useOn<{ amount: number }>('home:payment_completed', payload => {
 *   setAmount(payload.amount);
 * });
 * ```
 */
export function useOn<E extends keyof EventPayloadMap>(
  event: E,
  callback: (payload: EventPayloadMap[E]) => void,
): void;
export function useOn<T = unknown>(
  event: string,
  callback: (payload: T) => void,
): void;
export function useOn(
  event: string,
  callback: (payload: unknown) => void,
): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    return EventBus.on(event, (payload: unknown) => {
      callbackRef.current(payload);
    });
  }, [event]);
}

/**
 * Hook React que registra um handler de request/response com auto-cleanup.
 *
 * ```tsx
 * useHandle<{ userId: string }, User>('profile:get_user', async (payload) => {
 *   const user = await api.getUser(payload.userId);
 *   return user;
 * });
 * ```
 */
export function useHandle<TReq = unknown, TRes = unknown>(
  event: string,
  handler: (payload: TReq) => TRes | Promise<TRes>,
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    return EventBus.handle<TReq, TRes>(event, payload => {
      return handlerRef.current(payload);
    });
  }, [event]);
}
