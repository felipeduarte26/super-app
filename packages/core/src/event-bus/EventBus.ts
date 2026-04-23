type EventCallback<T = unknown> = (payload: T) => void;

class EventBusImpl {
  private listeners: Map<string, Set<EventCallback>> = new Map();

  emit<T = unknown>(event: string, payload?: T): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(payload as never));
    }
  }

  on<T = unknown>(event: string, callback: EventCallback<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback as EventCallback);

    return () => {
      this.listeners.get(event)?.delete(callback as EventCallback);
    };
  }

  off(event: string): void {
    this.listeners.delete(event);
  }

  clear(): void {
    this.listeners.clear();
  }
}

const GLOBAL_KEY = '__SUPER_APP_EVENT_BUS__';
const g = globalThis as Record<string, unknown>;

if (!g[GLOBAL_KEY]) {
  g[GLOBAL_KEY] = new EventBusImpl();
}

export const EventBus = g[GLOBAL_KEY] as EventBusImpl;
