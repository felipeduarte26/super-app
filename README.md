# Super App — POC Micro-Frontends com React Native

Prova de conceito de uma arquitetura **Micro-Frontends** para React Native utilizando **Re.Pack**, **Module Federation** e **Event Bus**. Cada Mini App é um módulo independente, com Clean Architecture própria, que pode ser desenvolvido, testado e versionado de forma autônoma.

## Arquitetura

```
┌───────────────────────────────────────────────────────────┐
│                      Host App                             │
│           (React Navigation + Bottom Tabs)                │
│                                                           │
│  ┌────────────────┐ ┌────────────────┐ ┌───────────────┐  │
│  │   Mini Home    │ │  Mini Profile  │ │ Mini Settings │  │
│  │                │ │                │ │               │  │
│  │  Failures      │ │  Failures      │ │  Failures     │  │
│  │  DI Container  │ │  DI Container  │ │  DI Container │  │
│  │  Domain        │ │  Domain        │ │  Domain       │  │
│  │  Application   │ │  Application   │ │  Application  │  │
│  │  Data          │ │  Data          │ │  Data         │  │
│  │  Presentation  │ │  Presentation  │ │  Presentation │  │
│  └───────┬────────┘ └───────┬────────┘ └──────┬────────┘  │
│          │                  │                 │           │
│          └──────────────────┼─────────────────┘           │
│                             │                             │
│              ┌──────────────▼───────────────┐             │
│              │       @super-app/core        │             │
│              │  EventBus · Theme · i18n     │             │
│              │  Components · HTTP           │             │
│              │  Result · BaseRepository     │             │
│              └──────────────────────────────┘             │
└───────────────────────────────────────────────────────────┘
```

## Quick Start

```bash
cd super_app
npm install
cd ios && pod install && cd ..

# Terminal 1 — Bundler
npm start

# Terminal 2 — Simulador
npm run ios       # ou npm run android
```

## Documentação

| Documento | Descrição |
| --- | --- |
| [Primeiros Passos](docs/getting-started.md) | Como rodar, scripts disponíveis, o que testar na demo |
| [Arquitetura](docs/architecture.md) | Visão geral, regras fundamentais, estrutura do projeto |
| [Clean Architecture](docs/clean-architecture.md) | Camadas, DI Container, regras de dependência, imports proibidos |
| [Event Bus](docs/event-bus.md) | Comunicação entre módulos, mapa de eventos, garantia de singleton |
| [Module Federation](docs/module-federation.md) | Configuração Host/Remote, Re.Pack, singleton shared |
| **Packages** | |
| [Core](docs/packages.md#super-appcore) | EventBus, Theme, i18n, Components, HTTP, Result, BaseRepository |
| [Mini Apps](docs/packages.md#mini-apps) | Home, Profile, Settings — responsabilidades, failures e eventos |
| **Guias** | |
| [Criando um Novo Mini App](docs/creating-a-mini-app.md) | Guia passo a passo com exemplo completo (mini-wallet) |
| [Tratamento de Erros](docs/error-handling.md) | Either Pattern (Result), Failures por feature, BaseRepository, fold |
| [Decisões Técnicas](docs/technical-decisions.md) | Por que Event Bus, globalThis, Error Boundary, manifests |
| [Migração Multi-Repo](docs/multi-repo-migration.md) | Monorepo vs Multi-Repo, como migrar para produção |
