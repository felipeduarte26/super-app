# Arquitetura

## Regras Fundamentais

| Regra | Descrição |
| --- | --- |
| **Isolamento total** | Um Mini App **nunca** importa código de outro Mini App |
| **Core como contrato** | `@super-app/core` é a **única** dependência compartilhada entre módulos |
| **Comunicação via Event Bus** | Toda comunicação entre módulos acontece por eventos tipados |
| **Clean Architecture** | Cada Mini App segue DI → Domain → Application → Data → Presentation |
| **Registro dinâmico** | Mini Apps registram seus manifests; o Host monta as tabs automaticamente |
| **Error Boundary por módulo** | Se um Mini App falhar, os outros continuam funcionando |

## Camadas do Sistema

```
Host App ──────── Orquestra navegação e carrega Mini Apps
    │
    ├── MiniAppLoader ── Error Boundary + Suspense por módulo
    ├── BottomTabNavigator ── Tabs dinâmicas a partir dos manifests
    ├── Bootstrap ── Registro dos Mini Apps no Host
    └── EventBusMonitor ── Debug visual dos eventos (apenas POC)

@super-app/core ── Pacote compartilhado (singleton via Module Federation)
    │
    ├── EventBus ── Pub/Sub com singleton global (globalThis fallback)
    ├── AppEvents ── Constantes tipadas de todos os eventos
    ├── useOn ── Hook React para subscrever eventos (auto-cleanup)
    ├── Theme ── Paleta de cores centralizada
    ├── Components ── Card, Badge, Section (UI compartilhada)
    ├── HTTP ── HttpClientFactory, FetchHttpClient, IHttpClient (Strategy pattern)
    └── Types ── MiniAppManifest, RouteDefinition, TabConfig
```

## Estrutura do Projeto

```
super_app/
├── App.tsx                                 # Host App principal
├── index.js                                # Entry point
├── rspack.config.mjs                       # Module Federation Host
├── package.json                            # Workspaces + dependências
├── tsconfig.json                           # TypeScript com path aliases
├── docs/                                   # Documentação do projeto
│
├── src/                                    # Código do Host App
│   ├── config/
│   │   ├── bootstrap.ts                    # Registro dos Mini Apps
│   │   └── miniApps.ts                     # Registry pattern
│   ├── navigation/
│   │   ├── BottomTabNavigator.tsx          # Tabs dinâmicas
│   │   └── MiniAppLoader.tsx               # Error Boundary + Suspense
│   └── screens/
│       └── EventBusMonitor.tsx             # Monitor de eventos (debug)
│
└── packages/
    ├── core/                               # @super-app/core
    │   └── src/
    │       ├── event-bus/                  # EventBus, AppEvents, useOn, EventPayloadMap
    │       ├── theme/                      # Paleta de cores
    │       ├── components/                 # Card, Badge, Section
    │       ├── http/                       # HttpClientFactory, FetchHttpClient
    │       ├── navigation/                 # MiniAppManifest, RouteDefinition
    │       └── index.ts                    # Barrel export
    │
    └── mini-*/                             # Mini Apps (home, profile, settings)
        ├── rspack.config.mjs               # Module Federation Remote
        └── src/
            ├── di/                         # ⭐ Composition Root (DI Container)
            │   ├── container.ts
            │   └── index.ts
            ├── domain/                     # Camada mais interna (ZERO deps externas)
            │   ├── entities/
            │   ├── repositories/           # Interfaces (portas)
            │   ├── rules/                  # Funções puras
            │   └── index.ts
            ├── application/                # Depende apenas de domain/
            │   ├── useCases/
            │   ├── mappers/
            │   ├── viewModels/
            │   └── index.ts
            ├── data/                       # Implementa interfaces do domain/
            │   ├── datasources/            # API clients, mocks
            │   ├── repositories/           # Implementações concretas
            │   └── index.ts
            ├── presentation/               # Depende apenas de application/ e di/
            │   ├── screens/
            │   ├── components/
            │   ├── hooks/
            │   └── index.ts
            ├── Navigator.tsx               # Componente raiz exposto via MF
            ├── manifest.ts                 # Contrato com o Host
            └── index.ts                    # Barrel export
```

## Fluxo de Comunicação

### 1. Fire & Forget — Eventos globais (core)

```
┌──────────────┐    PROFILE_UPDATED     ┌──────────────┐
│ Mini Profile │ ─────────────────────► │  Mini Home   │
│              │    { name: 'Felipe' }  │              │
└──────────────┘                        └──────┬───────┘
                                               │
                                    NOTIFICATION_BADGE_CHANGED
                                        { count: 3 }
                                               │
                                               ▼
┌──────────────┐    THEME_CHANGED       ┌──────────────┐
│Mini Settings │ ─────────────────────► │   Host App   │
│              │  { mode: 'dark' }      │  (Tab Badge) │
└──────┬───────┘                        └──────────────┘
       │
       │            THEME_CHANGED
       └──────────────────────────────► Mini Profile
                  { mode: 'dark' }      (aplica dark mode)
```

### 2. Fire & Forget — Evento customizado (fora do core)

```
┌──────────────┐  settings:biometric_toggled  ┌──────────────┐
│Mini Settings │ ────────────────────────────► │ Mini Profile │
│              │     { enabled: true }         │              │
└──────────────┘                               │ Exibe banner │
                                               │ de segurança │
                                               └──────────────┘
```

> O evento `settings:biometric_toggled` **NÃO está no core**. Settings emite uma string,
> Profile escuta a mesma string. Zero acoplamento.

### 3. Request / Response — Buscar dados de outro módulo

```
┌──────────────┐                               ┌──────────────┐
│  Mini Home   │   request('profile:get_      │ Mini Profile │
│              │    summary', {})               │              │
│  await ...   │ ─────────────────────────────►│  handle(     │
│              │                               │   'profile:  │
│              │  ◄──── { displayName,         │    get_      │
│              │          email,               │    summary') │
│  Exibe card  │          avatarInitials }     │              │
│  com dados   │                               │              │
└──────────────┘                               └──────────────┘
```

> Home faz `EventBus.request()` e recebe uma Promise.
> Profile registra `EventBus.handle()` e retorna os dados.
> **Zero imports entre módulos.**
