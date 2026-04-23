# Event Bus

O Event Bus é o **único mecanismo de comunicação** entre Mini Apps. Ele reside integralmente no `@super-app/core`.

## Como Funciona

```
Mini Profile                    @super-app/core                    Mini Home
     │                               │                                │
     │  EventBus.emit(               │                                │
     │    PROFILE_UPDATED,           │                                │
     │    { name: 'Felipe' }         │                                │
     │  ) ──────────────────────────►│                                │
     │                               │  useEventBus(                  │
     │                               │    PROFILE_UPDATED,            │
     │                               │    (p) => setName(p.name)      │
     │                               │  ) ──────────────────────────► │
     │                               │                                │
     │                               │        "Olá, Felipe!"          │
```

## Uso

```typescript
import { EventBus, AppEvents, useEventBus } from '@super-app/core';

// Emitir evento
EventBus.emit(AppEvents.PROFILE_UPDATED, { name: 'Felipe' });

// Escutar evento (com auto-cleanup no unmount)
useEventBus(AppEvents.THEME_CHANGED, (payload) => {
  console.log('Tema mudou para:', payload.mode);
});
```

## Mapa de Eventos

| Evento | Payload | Emissor | Ouvinte(s) |
| --- | --- | --- | --- |
| `auth:login` | — | Host | Todos |
| `auth:logout` | — | Host | Todos |
| `profile:updated` | `{ name: string }` | Mini Profile | Mini Home |
| `theme:changed` | `{ mode: 'light' \| 'dark' }` | Mini Settings | Mini Profile |
| `notification:badge_changed` | `{ count: number }` | Mini Home | Host (badge na tab) |
| `settings:language_changed` | `{ language: string }` | Mini Settings | Qualquer módulo |

## Garantia de Singleton (Multi-Repo)

O EventBus possui **duas camadas de proteção** para garantir instância única:

1. **Module Federation `shared`** — `@super-app/core` é `singleton: true` em todos os rspack configs
2. **`globalThis` fallback** — mesmo que o MF falhe, o EventBus registra em `globalThis.__SUPER_APP_EVENT_BUS__`

```typescript
// packages/core/src/event-bus/EventBus.ts
const GLOBAL_KEY = '__SUPER_APP_EVENT_BUS__';
const g = globalThis as Record<string, unknown>;

if (!g[GLOBAL_KEY]) {
  g[GLOBAL_KEY] = new EventBusImpl();
}

export const EventBus = g[GLOBAL_KEY] as EventBusImpl;
```

## EventBusMonitor (Debug)

O componente `EventBusMonitor` (disponível apenas na POC) intercepta `EventBus.emit` para exibir todos os eventos em tempo real. Ele é renderizado como um botão flutuante (📡) no Host App e **não faz parte do core** — é uma ferramenta de debug do Host.
