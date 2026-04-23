import type {EventPayloadMap} from './events';

type EventCallback<T = unknown> = (payload: T) => void;
type RequestHandler<TReq = unknown, TRes = unknown> = (
  payload: TReq,
) => TRes | Promise<TRes>;

let requestIdCounter = 0;

class EventBusImpl {
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private handlers: Map<string, RequestHandler> = new Map();

  // ─── Fire & Forget ───────────────────────────────────────────

  emit<E extends keyof EventPayloadMap>(
    event: E,
    ...args: EventPayloadMap[E] extends undefined
      ? []
      : [payload: EventPayloadMap[E]]
  ): void;
  emit<T = unknown>(event: string, payload?: T): void;
  emit(event: string, payload?: unknown): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(payload as never));
    }
  }

  on<E extends keyof EventPayloadMap>(
    event: E,
    callback: EventCallback<EventPayloadMap[E]>,
  ): () => void;
  on<T = unknown>(event: string, callback: EventCallback<T>): () => void;
  on(event: string, callback: EventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  off(event: string): void {
    this.listeners.delete(event);
  }

  clear(): void {
    this.listeners.clear();
    this.handlers.clear();
  }

  // ─── Request / Response ──────────────────────────────────────

  /**
   * Registra um handler para responder requests de um evento.
   * Apenas UM handler por evento (o último registrado vence).
   *
   * ```ts
   * // Mini App B — registra o handler
   * EventBus.handle<{ userId: string }, User>(
   *   'profile:get_user',
   *   async (payload) => {
   *     return await fetchUser(payload.userId);
   *   },
   * );
   * ```
   *
   * Retorna função de unregister.
   */
  handle<TReq = unknown, TRes = unknown>(
    event: string,
    handler: RequestHandler<TReq, TRes>,
  ): () => void {
    this.handlers.set(event, handler as RequestHandler);
    return () => {
      if (this.handlers.get(event) === (handler as RequestHandler)) {
        this.handlers.delete(event);
      }
    };
  }

  /**
   * Envia um request e aguarda a resposta do handler registrado.
   * Retorna uma Promise que resolve com a resposta.
   *
   * ```ts
   * // Mini App A — faz o request
   * const user = await EventBus.request<{ userId: string }, User>(
   *   'profile:get_user',
   *   { userId: '123' },
   * );
   * console.log(user.name);
   * ```
   *
   * @param timeoutMs — Timeout em ms (padrão: 10000). Rejeita se ninguém responder.
   */
  async request<TReq = unknown, TRes = unknown>(
    event: string,
    payload: TReq,
    timeoutMs = 10000,
  ): Promise<TRes> {
    const handler = this.handlers.get(event);

    if (!handler) {
      return this.waitForHandler<TReq, TRes>(event, payload, timeoutMs);
    }

    return (await handler(payload)) as TRes;
  }

  /**
   * Aguarda um handler ser registrado antes de executar.
   * Útil quando o mini-app que responde ainda não carregou.
   */
  private waitForHandler<TReq, TRes>(
    event: string,
    payload: TReq,
    timeoutMs: number,
  ): Promise<TRes> {
    const requestId = ++requestIdCounter;
    const responseEvent = `__response__:${event}:${requestId}`;

    return new Promise<TRes>((resolve, reject) => {
      const timer = setTimeout(() => {
        cleanup();
        reject(
          new Error(
            `EventBus.request('${event}') timeout after ${timeoutMs}ms — no handler registered.`,
          ),
        );
      }, timeoutMs);

      const cleanup = this.on<TRes>(responseEvent, response => {
        clearTimeout(timer);
        cleanup();
        resolve(response);
      });

      const checkInterval = setInterval(async () => {
        const h = this.handlers.get(event);
        if (h) {
          clearInterval(checkInterval);
          clearTimeout(timer);
          cleanup();
          try {
            const result = await h(payload);
            resolve(result as TRes);
          } catch (err) {
            reject(err);
          }
        }
      }, 50);

      setTimeout(() => clearInterval(checkInterval), timeoutMs);
    });
  }
}

const GLOBAL_KEY = '__SUPER_APP_EVENT_BUS__';
const g = globalThis as Record<string, unknown>;

if (!g[GLOBAL_KEY]) {
  g[GLOBAL_KEY] = new EventBusImpl();
}

export const EventBus = g[GLOBAL_KEY] as EventBusImpl;
