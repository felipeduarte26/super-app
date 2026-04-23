# Clean Architecture

Cada Mini App segue a mesma arquitetura em camadas, com **Composition Root** para injeção de dependências.

## Diagrama de Camadas

```
┌───────────────────────────────────────────────────┐
│                 Presentation                      │
│  Screens · Hooks · Components                     │
│  (React, UI, estado de tela)                      │
│  ⚠️ SÓ importa de: application/ e di/             │
├───────────────────────────────────────────────────┤
│                 Application                       │
│  Use Cases · ViewModels · Mappers · Input DTOs    │
│  (orquestração, transformação)                    │
│  ⚠️ SÓ importa de: domain/                        │
├───────────────────────────────────────────────────┤
│                   Domain                          │
│  Entities · Failures · Repo Interfaces · Rules    │
│  (regras de negócio puras)                        │
│  ⚠️ NÃO importa de NENHUMA outra camada           │
├───────────────────────────────────────────────────┤
│                    Data                           │
│  DataSources · Repo Impls (extends BaseRepo<F>)   │
│  (acesso a dados, mocks, HTTP)                    │
│  ⚠️ SÓ importa de: domain/ e @super-app/core      │
├───────────────────────────────────────────────────┤
│            ⭐ DI — Composition Root               │
│  container.ts                                     │
│  (único local que conhece TODAS as camadas)       │
│  Instancia DataSources → Repositories → UseCases  │
└───────────────────────────────────────────────────┘
```

## Regra de Dependência

```
Presentation → Application → Domain ← Data
                    ↑
              DI Container
         (conecta tudo no startup)
```

- **Domain** não depende de nada externo (entidades, failures, interfaces, regras puras)
- **Application** depende apenas de Domain (Use Cases recebem interfaces por construtor, retornam `Result<T, XxxFailure>`)
- **Data** implementa interfaces do Domain + estende `BaseRepository<XxxFailure>` do core (Dependency Inversion Principle)
- **Presentation** consome Use Cases via DI Container — **NUNCA** importa de `data/` ou `domain/` (exceto Failures para instanceof check)
- **DI (Composition Root)** é o **único ponto** que conhece todas as camadas e conecta as dependências

## Composition Root (DI Container)

O `di/container.ts` é o coração da inversão de dependência. Ele é o **único arquivo** que instancia classes concretas e as conecta:

```typescript
// packages/mini-profile/src/di/container.ts
import {UserApiClient} from '../data/datasources/UserApiClient';
import {UserRepositoryImpl} from '../data/repositories/UserRepositoryImpl';
import {GetUserUseCase} from '../application/useCases/GetUserUseCase';
import {UpdateUserUseCase} from '../application/useCases/UpdateUserUseCase';

const userDataSource = new UserApiClient();
const userRepository = new UserRepositoryImpl(userDataSource);

export const container = {
  getUserUseCase: new GetUserUseCase(userRepository),
  updateUserUseCase: new UpdateUserUseCase(userRepository),
} as const;
```

O hook na presentation **só conhece o container**, nunca as implementações:

```typescript
// packages/mini-profile/src/presentation/hooks/useProfile.ts
import {container} from '../../di';

export function useProfile() {
  // ✅ Correto: usa DI container
  const viewModel = await container.getUserUseCase.execute();

  // ❌ PROIBIDO: instanciar repositório na presentation
  // const repo = new UserRepositoryImpl(); // NUNCA FAÇA ISSO
}
```

## Por que DI Container importa?

| Sem DI Container | Com DI Container |
| --- | --- |
| Hook instancia `RepositoryImpl` direto | Hook só conhece Use Cases via container |
| `presentation → data` (quebra Clean Arch) | `presentation → di → data` (correto) |
| Difícil de testar (acoplamento forte) | Fácil de testar (swap de implementação) |
| Trocar API exige alterar hooks | Trocar API exige alterar apenas `container.ts` |

## Imports Proibidos

| De | Para | Permitido? |
| --- | --- | --- |
| `presentation/` | `application/` | ✅ Sim |
| `presentation/` | `di/` | ✅ Sim |
| `presentation/` | `data/` | ❌ **PROIBIDO** |
| `presentation/` | `domain/entities/` | ❌ **PROIBIDO** |
| `presentation/` | `domain/failures/` | ✅ Sim (para instanceof check) |
| `application/` | `domain/` | ✅ Sim |
| `application/` | `data/` | ❌ **PROIBIDO** |
| `data/` | `domain/` | ✅ Sim |
| `domain/` | qualquer outra camada | ❌ **PROIBIDO** |
| `di/` | todas as camadas | ✅ Sim (é o Composition Root) |

## Exemplo Prático: Mini Profile

```
Usuário toca "Salvar"
    │
    ▼
ProfileScreen (Presentation)
    │ chama useProfile().updateUser({ name, email, bio })
    ▼
useProfile hook (Presentation)
    │ usa container.updateUserUseCase (injetado via DI)
    ▼
UpdateUserUseCase (Application)
    │ 1. Busca user atual via IUserRepository.getUser() → Result<User, ProfileFailure>
    │ 2. result.flatMapAsync() → valida com Domain rules
    │ 3. Se inválido: retorna failure(new ProfileValidationFailure(...))
    │ 4. Se válido: chama IUserRepository.updateUser()
    │ 5. updateResult.map(UserMapper.toViewModel) → Result<UserViewModel, ProfileFailure>
    ▼
UserRepositoryImpl extends BaseRepository<ProfileFailure> (Data)
    │ this.execute(() => apiClient.updateUser(), user => user)
    │ Se exceção: handleException(error) → ProfileServerFailure | ProfileTimeoutFailure | ...
    ▼
useProfile hook faz result.fold():
    │ Success → setUser(data) + EventBus.emit(PROFILE_UPDATED)
    │ Failure → instanceof ProfileValidationFailure? setFieldErrors : setError
    │
    ▼
Mini Home escuta e atualiza greeting: "Olá, Felipe!"
```

## Validação Automatizada

Para verificar que nenhuma regra de dependência foi violada:

```bash
# Presentation não importa de data/ nem domain/
rg "from ['\"]\.\./(\.\./)*(data|domain)/" packages/*/src/presentation/

# Domain não importa de nenhuma outra camada
rg "from ['\"]\.\./(\.\./)*(data|application|presentation|di)/" packages/*/src/domain/

# Application não importa de data/ nem presentation/
rg "from ['\"]\.\./(\.\./)*(data|presentation|di)/" packages/*/src/application/

# Todos devem retornar 0 resultados
```
