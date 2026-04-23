# Decisões Técnicas

## Por que Event Bus e não Context/Redux compartilhado?

- **Context/Redux** cria acoplamento — módulos precisariam compartilhar o mesmo store
- **Event Bus** é desacoplado — emissores e ouvintes não se conhecem
- Funciona em multi-repo sem necessidade de sincronizar estado global
- Cada módulo mantém seu próprio estado interno

## Por que `globalThis` no EventBus?

Em cenários multi-repo com Module Federation, se o `singleton: true` falhar (versão incompatível, fallback), cada bundle teria sua instância do core. O `globalThis.__SUPER_APP_EVENT_BUS__` garante que existe apenas um EventBus no runtime, independente de quantas cópias do core sejam carregadas.

## Por que DI Container (Composition Root)?

Sem DI Container, os hooks da presentation instanciavam repositórios concretos da camada data — quebrando a regra fundamental do Clean Architecture. O `di/container.ts` é o **único local** que conhece todas as camadas e faz a fiação:

```
DataSource → Repository → UseCase → (exportado no container)
```

A presentation só importa o container — nunca sabe qual implementação concreta está por trás.

## Por que `data/datasources/` e não `data/api/`?

A nomenclatura `datasources` é o padrão de mercado em Clean Architecture (especialmente no ecossistema Android/Flutter). Além disso, "datasource" é mais genérico — cobre API REST, GraphQL, localStorage, SQLite, mock, etc. "api" limita semanticamente a HTTP.

## Por que MiniAppLoader com Error Boundary?

Se um Mini App remoto falhar ao carregar (rede, versão quebrada), o Error Boundary captura o erro e exibe uma tela de fallback **sem derrubar o app inteiro**. Em produção, isso permitiria rollback automático para a versão anterior do módulo.

## Por que manifests?

O `MiniAppManifest` é o contrato que cada Mini App expõe. O Host não precisa conhecer a implementação — apenas o manifest. Isso permite:

- Adicionar novos Mini Apps sem alterar o Host
- Tabs são criadas dinamicamente a partir de `tabConfig.order`
- Rotas são registradas sob demanda

## Por que HttpClientFactory (Strategy Pattern)?

O `HttpClientFactory` no core permite que cada Mini App use um HTTP client abstrato (`IHttpClient`). A implementação padrão usa `fetch` nativo, mas pode ser trocada por Axios, Ky, ou qualquer outra lib — sem alterar nenhum código nos mini-apps:

```typescript
// Trocar implementação globalmente
HttpClientFactory.setProvider(() => new AxiosHttpClient());
```

## Por que Input DTOs no Application Layer?

Os hooks da presentation não devem importar tipos do domain (como `User` ou `AppSettings`). Para resolver isso, o application layer exporta **Input DTOs** (`UserUpdateInput`, `SettingsUpdateInput`) que definem exatamente quais campos a presentation pode enviar — sem expor a entidade completa do domain.
