# Packages

## @super-app/core

Pacote **compartilhado por todos os módulos** — é o único que Mini Apps podem importar além de `react` e `react-native`.

| Export | Descrição |
| --- | --- |
| `EventBus` | Singleton Pub/Sub com fallback `globalThis` — `emit`, `on`, `request`, `handle` |
| `AppEvents` | Constantes tipadas de todos os eventos do sistema |
| `useOn` | Hook React — subscribe evento com auto-cleanup no unmount |
| `useHandle` | Hook React — registra handler de request/response com auto-cleanup |
| `EventPayloadMap` | Mapa de tipos — garante type-safety nos eventos globais |
| `colors` | Paleta de cores centralizada |
| `Card` | Componente de card com sombra e bordas arredondadas |
| `Badge` | Badge colorido (primary, success, warning, error) |
| `Section` | Container de seção com título |
| `HttpClientFactory` | Factory para criar HTTP clients (Strategy pattern) |
| `FetchHttpClient` | Implementação de `IHttpClient` usando `fetch` nativo |
| `IHttpClient` | Interface do HTTP client — permite trocar implementação |
| `MiniAppManifest` | Interface que cada Mini App exporta (nome, versão, rotas, tab) |

### Uso em um Mini App

```typescript
import { EventBus, AppEvents, useOn, useHandle } from '@super-app/core';

// ── Fire & Forget ──
EventBus.emit(AppEvents.PROFILE_UPDATED, { name: 'Felipe' });

useOn(AppEvents.THEME_CHANGED, payload => {
  console.log(payload.mode); // 'light' | 'dark' — type-safe
});

// ── Request / Response ──
// Registrar handler (quem responde)
useHandle<{ userId: string }, User>('profile:get_user', async ({ userId }) => {
  return await fetchUser(userId);
});

// Fazer request (quem pergunta)
const user = await EventBus.request<{ userId: string }, User>(
  'profile:get_user',
  { userId: '123' },
);
```

---

## Mini Apps

### @super-app/mini-home

**Squad responsável:** Time de Dashboard

| Camada | Responsabilidade |
| --- | --- |
| **DI** | Instancia `NotificationApiClient` → `NotificationRepositoryImpl` → `GetNotificationsUseCase` |
| **Domain** | Entity `Notification`, `NotificationType`, regras de filtragem (`filterUnreadNotifications`) e ordenação (`sortByDate`) |
| **Application** | `GetNotificationsUseCase`, `NotificationMapper`, `NotificationViewModel` |
| **Data** | `NotificationApiClient` (mock HTTP), `NotificationRepositoryImpl` |
| **Presentation** | `HomeScreen` com greeting dinâmico, `NotificationCard`, `useNotifications` hook |

**Eventos globais (core):**
- **Emite:** `NOTIFICATION_BADGE_CHANGED` — atualiza badge na tab do Host
- **Escuta:** `PROFILE_UPDATED` — atualiza greeting com o nome do usuário

**Request/Response:**
- **Request:** `profile:get_summary` — busca resumo do perfil do Mini Profile via `EventBus.request()` e exibe na tela

---

### @super-app/mini-profile

**Squad responsável:** Time de Identidade

| Camada | Responsabilidade |
| --- | --- |
| **DI** | Instancia `UserApiClient` → `UserRepositoryImpl` → `GetUserUseCase` + `UpdateUserUseCase` |
| **Domain** | Entity `User`, validações (`validateName`, `validateEmail`, `validateBio`), `ProfileCustomEvents` |
| **Application** | `GetUserUseCase`, `UpdateUserUseCase` (com `UserValidationError`), `UserMapper`, `UserUpdateInput` |
| **Data** | `UserApiClient` (mock HTTP), `UserRepositoryImpl` |
| **Presentation** | `ProfileScreen` com formulário editável, banner de biometria, `useProfile` hook |

**Eventos globais (core):**
- **Emite:** `PROFILE_UPDATED` — quando o usuário salva alterações no nome
- **Escuta:** `THEME_CHANGED` — aplica dark/light mode recebido do Settings

**Eventos customizados (fora do core):**
- **Escuta:** `settings:biometric_toggled` — exibe banner de segurança quando biometria é ativada no Settings

**Request/Response:**
- **Handle:** `profile:get_summary` — responde com `{ displayName, email, avatarInitials }` para qualquer módulo que pergunte

---

### @super-app/mini-settings

**Squad responsável:** Time de Plataforma

| Camada | Responsabilidade |
| --- | --- |
| **DI** | Instancia `SettingsApiClient` → `SettingsRepositoryImpl` → `GetSettingsUseCase` + `UpdateSettingsUseCase` |
| **Domain** | Entity `AppSettings` (`ThemeMode`, `AppLanguage`), regras, `SettingsCustomEvents` |
| **Application** | `GetSettingsUseCase`, `UpdateSettingsUseCase` (com `SettingsUpdateInput`), `SettingsMapper`, `SettingsViewModel` (inclui `availableLanguages`) |
| **Data** | `SettingsApiClient` (mock in-memory), `SettingsRepositoryImpl` |
| **Presentation** | `SettingsScreen` com toggles e seletor de idioma, `SettingsRow`, `useSettings` hook |

**Eventos globais (core):**
- **Emite:** `THEME_CHANGED` — quando o toggle de tema muda
- **Emite:** `SETTINGS_LANGUAGE_CHANGED` — quando o idioma é alterado

**Eventos customizados (fora do core):**
- **Emite:** `settings:biometric_toggled` — emite `{ enabled: boolean }` quando o toggle de biometria muda. Profile escuta sem que o evento esteja no core.
