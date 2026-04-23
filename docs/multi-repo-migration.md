# Migração Multi-Repo

Esta POC usa **monorepo** para simplicidade, mas a arquitetura está **pronta para multi-repo**.

## Comparação

| Aspecto | Monorepo (POC) | Multi-Repo (Produção) |
| --- | --- | --- |
| Mini Apps | `packages/mini-*` | Repositórios separados |
| Core | `packages/core` | Publicado no npm registry |
| Imports | npm workspaces resolve | Module Federation resolve remotamente |
| Deploy | Build único | Cada Mini App deploya independente |
| CI/CD | Pipeline única | Pipeline por squad/módulo |
| Versioning | Workspace link | Semver no registry |
| Rollback | Git revert único | Apontar para tag anterior |

## Vantagens do Multi-Repo

- **Deploy independente** — cada squad deploya seu módulo sem depender de outras
- **Rollback granular** — se o mini-profile v2.1.0 quebrar, volta para v2.0.0 sem afetar home/settings
- **CI/CD por squad** — pipelines menores e mais rápidas
- **Isolamento de conflitos** — zero conflitos de merge entre squads
- **Escala** — 10+ squads trabalhando sem contenção

## Passos para migrar

### 1. Publicar `@super-app/core` em um registry privado

```bash
# GitHub Packages, npm registry privado, ou Verdaccio
cd packages/core
npm publish --registry https://npm.wiipo.com.br
```

### 2. Cada Mini App vira um repositório

Cada `packages/mini-*` vira um repositório com seu próprio `package.json`:

```json
{
  "name": "@super-app/mini-home",
  "version": "1.0.0",
  "dependencies": {
    "@super-app/core": "^1.0.0"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-native": "^0.85.0"
  }
}
```

### 3. Mini Apps declaram core como dependência

Versão fixa via semver — atualizações do core são coordenadas:

```bash
npm install @super-app/core@^1.0.0 --save
```

### 4. Host configura Module Federation para CDN

```javascript
// rspack.config.mjs do Host
remotes: {
  MiniHome: 'MiniHome@https://cdn.wiipo.com.br/bundles/mini-home/v1.2.0/[platform]/MiniHome.container.js.bundle',
  MiniProfile: 'MiniProfile@https://cdn.wiipo.com.br/bundles/mini-profile/v2.0.1/[platform]/MiniProfile.container.js.bundle',
  MiniSettings: 'MiniSettings@https://cdn.wiipo.com.br/bundles/mini-settings/v1.5.0/[platform]/MiniSettings.container.js.bundle',
},
```

### 5. Deploy por squad

Cada squad faz deploy da sua tag:

```bash
# Squad de Home deploya v1.2.0
git tag v1.2.0
git push origin v1.2.0
# CI/CD builda e sobe para CDN

# Host App é atualizado com a nova URL do bundle
# Ou: Host baixa manifesto dinâmico que resolve as versões
```

## O que a arquitetura já garante

| Garantia | Como funciona |
| --- | --- |
| **Isolamento** | Mini Apps nunca importam uns dos outros |
| **EventBus singleton** | `globalThis` fallback funciona mesmo em multi-repo |
| **Core como contrato** | Todos dependem apenas de `@super-app/core` |
| **DI Container** | Cada mini-app tem seu próprio container — zero dependências cruzadas |
| **Module Federation** | `shared: { singleton: true }` garante instância única de react/core |
