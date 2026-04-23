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
     │                               │  EventBus.on(                  │
     │                               │    PROFILE_UPDATED,            │
     │                               │    (p) => setName(p.name)      │
     │                               │  ) ──────────────────────────► │
     │                               │                                │
     │                               │        "Olá, Felipe!"          │
```

---

## API — Fire & Forget

Para comunicação **unidirecional** (emitir sem esperar resposta).

### `EventBus.emit(event, payload)`

```typescript
import { EventBus, AppEvents } from '@super-app/core';

// Evento global (payload inferido pelo EventPayloadMap)
EventBus.emit(AppEvents.PROFILE_UPDATED, { name: 'Felipe' });

// Evento customizado de mini-app
EventBus.emit<{ amount: number }>('home:payment_completed', { amount: 100 });
```

### `EventBus.on(event, callback)` — fora de componentes React

Retorna função `unsubscribe`.

```typescript
const off = EventBus.on(AppEvents.THEME_CHANGED, payload => {
  payload.mode; // ✅ 'light' | 'dark' — inferido
});

off(); // unsubscribe
```

### `useOn(event, callback)` — Hook React (auto-cleanup)

```tsx
import { AppEvents, useOn } from '@super-app/core';

function MyComponent() {
  useOn(AppEvents.THEME_CHANGED, payload => {
    setTheme(payload.mode); // type-safe
  });

  // Evento customizado
  useOn<{ amount: number }>('home:payment_completed', payload => {
    setAmount(payload.amount);
  });
}
```

---

## API — Request / Response

Para comunicação **bidirecional** — um mini-app envia um request e **aguarda a resposta** de outro mini-app.

```
Mini App A                     EventBus                     Mini App B
     │                            │                              │
     │  request('profile:get',    │                              │
     │    { userId: '123' })      │                              │
     │  ──────────────────────►   │                              │
     │                            │   handle('profile:get',      │
     │     await (Promise)        │     async (p) => {           │
     │                            │       return fetchUser(p);   │
     │                            │     })                       │
     │                            │   ◄──────────────────────    │
     │  ◄── resolve(User)         │                              │
     │       { name: 'Felipe' }   │                              │
```

### `EventBus.handle(event, handler)` — Registrar handler

Registra uma função que **responde** a requests. Apenas **um handler por evento** (o último registrado vence). Retorna função de unregister.

```typescript
import { EventBus } from '@super-app/core';

// Mini App B — registra o handler
const unregister = EventBus.handle<{ userId: string }, User>(
  'profile:get_user',
  async (payload) => {
    const user = await userRepository.getById(payload.userId);
    return user;
  },
);

// Para remover:
unregister();
```

### `EventBus.request(event, payload, timeoutMs?)` — Fazer request

Envia um request e retorna uma **Promise** que resolve com a resposta do handler.

```typescript
import { EventBus } from '@super-app/core';

// Mini App A — faz o request e aguarda
try {
  const user = await EventBus.request<{ userId: string }, User>(
    'profile:get_user',
    { userId: '123' },
  );
  console.log(user.name); // 'Felipe'
} catch (error) {
  // Timeout ou erro no handler
}
```

**Parâmetros:**

| Parâmetro | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| `event` | `string` | — | Nome do evento/canal |
| `payload` | `TReq` | — | Dados enviados ao handler |
| `timeoutMs` | `number` | `10000` | Tempo máximo de espera (ms) |

> Se nenhum handler estiver registrado no momento do request, o EventBus **aguarda** até que um apareça (útil para lazy-loading de mini-apps). Se o timeout expirar, a Promise é rejeitada.

### `useHandle(event, handler)` — Hook React (auto-cleanup)

```tsx
import { useHandle } from '@super-app/core';

function ProfileProvider() {
  useHandle<{ userId: string }, User>('profile:get_user', async (payload) => {
    return await fetchUser(payload.userId);
  });

  return <>{children}</>;
}
```

### Exemplo completo: Mini App A ↔ Mini App B

```typescript
// ──────────────────────────────────────────────
// Mini App B (Profile) — registra o handler
// ──────────────────────────────────────────────
EventBus.handle<{ userId: string }, { name: string; email: string }>(
  'profile:get_user',
  async ({ userId }) => {
    const user = await api.fetchUser(userId);
    return { name: user.name, email: user.email };
  },
);

// ──────────────────────────────────────────────
// Mini App A (Home) — faz o request
// ──────────────────────────────────────────────
async function loadUserInfo() {
  const user = await EventBus.request<
    { userId: string },
    { name: string; email: string }
  >('profile:get_user', { userId: '123' });

  setUserName(user.name);  // 'Felipe'
  setEmail(user.email);    // 'felipe@email.com'
}
```

> **Importante:** Mini App A não importa NADA do Mini App B. A comunicação é 100% via string do evento + tipos genéricos.

---

## Eventos Customizados por Mini App

Cada mini-app pode definir seus **próprios eventos** sem registrá-los no core:

```typescript
// packages/mini-home/src/domain/events.ts
export const HomeEvents = {
  PAYMENT_COMPLETED: 'home:payment_completed',
  BALANCE_REFRESHED: 'home:balance_refreshed',
} as const;
```

```typescript
// Emitir — dentro do mini-home
EventBus.emit<{ amount: number }>(HomeEvents.PAYMENT_COMPLETED, { amount: 150 });

// Escutar — em QUALQUER outro mini-app (sem importar do mini-home)
EventBus.on<{ amount: number }>('home:payment_completed', payload => {
  console.log(payload.amount);
});
```

> **Convenção de nomes:** use `modulo:acao` para evitar colisões — ex: `home:payment_completed`, `profile:avatar_changed`.

---

## Type-Safety com `EventPayloadMap`

Eventos globais possuem payloads tipados via `EventPayloadMap`:

```typescript
export interface EventPayloadMap {
  [AppEvents.AUTH_LOGIN]: { userId: string };
  [AppEvents.AUTH_LOGOUT]: undefined;
  [AppEvents.PROFILE_UPDATED]: { name: string };
  [AppEvents.THEME_CHANGED]: { mode: 'light' | 'dark' };
  [AppEvents.NOTIFICATION_BADGE_CHANGED]: { count: number };
  [AppEvents.SETTINGS_LANGUAGE_CHANGED]: { language: string };
}
```

```typescript
EventBus.on(AppEvents.THEME_CHANGED, payload => {
  payload.mode; // ✅ inferido: 'light' | 'dark'
  payload.foo;  // ❌ Erro de TypeScript
});
```

---

## Mapa de Eventos Globais

| Evento | Payload | Emissor | Ouvinte(s) |
| --- | --- | --- | --- |
| `auth:login` | `{ userId: string }` | Host | Todos |
| `auth:logout` | — | Host | Todos |
| `profile:updated` | `{ name: string }` | Mini Profile | Mini Home |
| `theme:changed` | `{ mode: 'light' \| 'dark' }` | Mini Settings | Mini Profile |
| `notification:badge_changed` | `{ count: number }` | Mini Home | Host (badge na tab) |
| `settings:language_changed` | `{ language: string }` | Mini Settings | Qualquer módulo |

---

## Comparação: `emit/on` vs `request/handle`

| | `emit` / `on` | `request` / `handle` |
| --- | --- | --- |
| **Direção** | Unidirecional (fire & forget) | Bidirecional (request → response) |
| **Retorno** | `void` | `Promise<TRes>` |
| **Múltiplos ouvintes** | ✅ Sim | ❌ Um handler por evento |
| **Timeout** | N/A | Configurável (default 10s) |
| **Lazy loading** | N/A | Aguarda handler ser registrado |
| **Quando usar** | Notificações, mudanças de estado | Buscar dados de outro módulo |

---

## Garantia de Singleton (Multi-Repo)

O EventBus possui **duas camadas de proteção** para instância única:

1. **Module Federation `shared`** — `@super-app/core` é `singleton: true` em todos os rspack configs
2. **`globalThis` fallback** — mesmo que o MF falhe, o EventBus registra em `globalThis.__SUPER_APP_EVENT_BUS__`

```typescript
const GLOBAL_KEY = '__SUPER_APP_EVENT_BUS__';
const g = globalThis as Record<string, unknown>;

if (!g[GLOBAL_KEY]) {
  g[GLOBAL_KEY] = new EventBusImpl();
}

export const EventBus = g[GLOBAL_KEY] as EventBusImpl;
```

---

## EventBusMonitor (Debug)

O componente `EventBusMonitor` (disponível apenas na POC) intercepta `EventBus.emit` para exibir todos os eventos em tempo real. É uma ferramenta de debug do Host e **não faz parte do core**.
