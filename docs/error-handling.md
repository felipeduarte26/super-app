# Tratamento de Erros — Either Pattern + Failures por Feature

## Filosofia

Neste projeto, **nenhum Use Case lança exceções**. Toda operação que pode falhar retorna um `Result<T, F>` — um tipo inspirado no padrão **Either** (funcional).

Cada Mini App define **suas próprias Failures** no domain, garantindo que erros sejam tipados, explícitos e isolados por feature.

---

## Anatomia do `Result<T, E>`

`Result` é uma classe abstrata com duas subclasses: `Success` e `Failure`.

```
Result<T, E>
  ├── Success  → { ok: true, data: T }
  └── Failure  → { ok: false, error: E }
```

### Construtores

```typescript
import { success, failure } from '@super-app/core';

const ok = success(user);         // Result<User, never>
const err = failure(new ProfileNotFoundFailure());  // Result<never, ProfileFailure>
```

### Métodos da classe `Result`

| Método | Descrição |
|--------|-----------|
| `result.isSuccess()` | Type guard → `this is Success<T, E>` |
| `result.isFailure()` | Type guard → `this is Failure<T, E>` |
| `result.toSuccess()` | Extrai data ou lança exceção |
| `result.toFailure()` | Extrai error ou lança exceção |
| `result.getOrElse(fallback)` | Data ou fallback |
| `result.fold(onFailure, onSuccess)` | Pattern matching |
| `result.map(fn)` | Transforma Success, mantém Failure |
| `result.flatMap(fn)` | Encadeia Results (sync) |
| `result.flatMapAsync(fn)` | Encadeia Results (async) |

---

## Failures por Feature

Cada Mini App define uma **hierarquia de Failures** no seu domain, isolada dos outros módulos:

```
mini-home/src/domain/failures/
  └── HomeFailure.ts          → HomeFailure (abstract)
                                 ├── HomeUnexpectedFailure
                                 ├── HomeServerFailure
                                 ├── HomeTimeoutFailure
                                 └── HomeEmptyFailure

mini-profile/src/domain/failures/
  └── ProfileFailure.ts       → ProfileFailure (abstract)
                                 ├── ProfileUnexpectedFailure
                                 ├── ProfileServerFailure
                                 ├── ProfileTimeoutFailure
                                 ├── ProfileNotFoundFailure
                                 └── ProfileValidationFailure

mini-settings/src/domain/failures/
  └── SettingsFailure.ts      → SettingsFailure (abstract)
                                 ├── SettingsUnexpectedFailure
                                 ├── SettingsServerFailure
                                 ├── SettingsTimeoutFailure
                                 └── SettingsValidationFailure
```

### Anatomia de uma Failure

```typescript
abstract class HomeFailure {
  abstract readonly code: string;
  constructor(readonly message: string = '') {}
}

// Subclasses concretas (equivalente ao final class do Dart)
class HomeServerFailure extends HomeFailure {
  readonly code = 'HOME_SERVER';
  constructor(message = 'Erro no servidor ao carregar notificações.') {
    super(message);
  }
}
```

Todas as Failures possuem `code` e `message`, permitindo pattern matching e exibição na UI.

---

## `BaseRepository<F>` — Centraliza try/catch + error mapping

Inspirado no `BaseRepository<F extends Object>` do Flutter, o core fornece uma classe base que:

1. Envolve o try/catch no método `execute()`
2. Delega o mapeamento de erros para `handleException`

```typescript
// core/src/data/BaseRepository.ts
abstract class BaseRepository<F> {
  protected abstract handleException: HandleExceptionFn<F>;

  protected async execute<T, R>(
    onAction: () => Promise<T>,
    onResponse: (result: T) => R,
  ): Promise<Result<R, F>> {
    try {
      const raw = await onAction();
      return new Success(onResponse(raw));
    } catch (error) {
      return new Failure(this.handleException(error));
    }
  }
}
```

---

## Fluxo Completo por Camada

```
DataSource (pode lançar exceções)
    ↓
Repository extends BaseRepository<XxxFailure>
    ├── execute(onAction, onResponse) → Result
    └── handleException(error) → XxxFailure específica
    ↓
Use Case (recebe Result, encadeia com .map() / .flatMap() → retorna Result)
    ↓
Hook (faz result.fold() → atualiza state)
    ↓
Screen (exibe error.message)
```

### 1. Repository (camada Data)

```typescript
class NotificationRepositoryImpl
  extends BaseRepository<HomeFailure>
  implements INotificationRepository
{
  constructor(private readonly apiClient: NotificationApiClient) {
    super();
  }

  // Mapeia exceções → HomeFailure (como o switch do Dart)
  protected handleException: HandleExceptionFn<HomeFailure> = (error) => {
    if (error instanceof HttpError && error.status >= 500)
      return new HomeServerFailure(error.message);
    if (error instanceof TypeError && error.message === 'Network request failed')
      return new HomeTimeoutFailure();
    return new HomeUnexpectedFailure(String(error));
  };

  async getAll(): Promise<Result<Notification[], HomeFailure>> {
    return this.execute(
      () => this.apiClient.fetchNotifications(),
      (notifications) => notifications,
    );
  }
}
```

### 2. Use Case (camada Application)

Use Cases simples usam `.map()`:

```typescript
class GetUserUseCase {
  async execute(): Promise<Result<UserViewModel, ProfileFailure>> {
    const result = await this.repository.getUser();
    return result.map(UserMapper.toViewModel);
  }
}
```

Use Cases com validação usam `.flatMapAsync()` + `failure()`:

```typescript
class UpdateUserUseCase {
  async execute(updates: UserUpdateInput): Promise<Result<UserViewModel, ProfileFailure>> {
    const currentResult = await this.repository.getUser();

    return currentResult.flatMapAsync(async (current) => {
      // ... validação ...
      if (Object.keys(fieldErrors).length > 0) {
        return failure(new ProfileValidationFailure('Dados inválidos.', fieldErrors));
      }

      const updateResult = await this.repository.updateUser(updates);
      return updateResult.map(UserMapper.toViewModel);
    });
  }
}
```

### 3. Hook (camada Presentation)

```typescript
function useProfile() {
  const [error, setError] = useState<ProfileFailure | null>(null);

  const refresh = useCallback(async () => {
    const result = await container.getUserUseCase.execute();

    result.fold(
      err => setError(err),
      data => setUser(data),
    );
  }, []);

  // Tratando ValidationFailure com field errors
  const updateUser = useCallback(async (updates) => {
    const result = await container.updateUserUseCase.execute(updates);

    result.fold(
      err => {
        if (err instanceof ProfileValidationFailure) {
          setFieldErrors(err.fieldErrors);
        } else {
          setError(err);
        }
      },
      updated => {
        setUser(updated);
        EventBus.emit(AppEvents.PROFILE_UPDATED, { name: updated.displayName });
      },
    );
  }, []);
}
```

### 4. Screen

```tsx
{error ? (
  <Text style={styles.errorText}>{error.message}</Text>
) : (
  <FlatList data={items} ... />
)}
```

## Regras de Ouro

> 1. **Use Cases NUNCA lançam exceções.** Sempre retornam `Result<T, XxxFailure>`.
>
> 2. **Cada Mini App define suas próprias Failures** no `domain/failures/`.
>
> 3. **Repositories estendem `BaseRepository<XxxFailure>`** e implementam `handleException`.
>
> 4. **Hooks nunca usam try/catch** — recebem `Result` e fazem `result.fold()`.
>
> 5. **Um Mini App NUNCA importa Failures de outro.** Cada failure é isolada por feature.
