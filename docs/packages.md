# Packages

## @super-app/core

Pacote **compartilhado por todos os módulos** — é o único que Mini Apps podem importar além de `react` e `react-native`.

| Export | Descrição |
| --- | --- |
| `EventBus` | Singleton Pub/Sub com fallback `globalThis` para multi-repo |
| `AppEvents` | Constantes tipadas de todos os eventos do sistema |
| `useEventBus` | Hook React — subscribe com auto-cleanup no unmount |
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
import { EventBus, AppEvents, useEventBus, Card, Badge, colors } from '@super-app/core';

// Emitir evento
EventBus.emit(AppEvents.PROFILE_UPDATED, { name: 'Felipe' });

// Escutar evento (com auto-cleanup)
useEventBus(AppEvents.THEME_CHANGED, (payload) => {
  // Reagir à mudança de tema
});
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

**Eventos:**
- **Emite:** `NOTIFICATION_BADGE_CHANGED` — atualiza badge na tab do Host
- **Escuta:** `PROFILE_UPDATED` — atualiza greeting com o nome do usuário

---

### @super-app/mini-profile

**Squad responsável:** Time de Identidade

| Camada | Responsabilidade |
| --- | --- |
| **DI** | Instancia `UserApiClient` → `UserRepositoryImpl` → `GetUserUseCase` + `UpdateUserUseCase` |
| **Domain** | Entity `User`, validações (`validateName`, `validateEmail`, `validateBio`) |
| **Application** | `GetUserUseCase`, `UpdateUserUseCase` (com `UserValidationError`), `UserMapper`, `UserUpdateInput` |
| **Data** | `UserApiClient` (mock HTTP), `UserRepositoryImpl` |
| **Presentation** | `ProfileScreen` com formulário editável, `AvatarCircle`, `useProfile` hook |

**Eventos:**
- **Emite:** `PROFILE_UPDATED` — quando o usuário salva alterações no nome
- **Escuta:** `THEME_CHANGED` — aplica dark/light mode recebido do Settings

---

### @super-app/mini-settings

**Squad responsável:** Time de Plataforma

| Camada | Responsabilidade |
| --- | --- |
| **DI** | Instancia `SettingsApiClient` → `SettingsRepositoryImpl` → `GetSettingsUseCase` + `UpdateSettingsUseCase` |
| **Domain** | Entity `AppSettings` (`ThemeMode`, `AppLanguage`), regras (`getDefaultSettings`, `isValidLanguage`, `getAvailableLanguages`) |
| **Application** | `GetSettingsUseCase`, `UpdateSettingsUseCase` (com `SettingsUpdateInput`), `SettingsMapper`, `SettingsViewModel` (inclui `availableLanguages`) |
| **Data** | `SettingsApiClient` (mock in-memory), `SettingsRepositoryImpl` |
| **Presentation** | `SettingsScreen` com toggles e seletor de idioma, `SettingsRow`, `useSettings` hook |

**Eventos:**
- **Emite:** `THEME_CHANGED` — quando o toggle de tema muda
- **Emite:** `SETTINGS_LANGUAGE_CHANGED` — quando o idioma é alterado
- **Escuta:** Nenhum (é produtor de configurações)
