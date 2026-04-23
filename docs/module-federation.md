# Module Federation

Cada Mini App é configurado como um **Remote** no Module Federation, e o Host App como **Host**. O Re.Pack utiliza Module Federation 2.0 via Rspack.

## Configuração Host

```javascript
// rspack.config.mjs (raiz)
new Repack.plugins.ModuleFederationPluginV2({
  name: 'HostApp',
  remotes: {
    MiniHome:     'MiniHome@http://localhost:9001/[platform]/MiniHome.container.js.bundle',
    MiniProfile:  'MiniProfile@http://localhost:9002/[platform]/MiniProfile.container.js.bundle',
    MiniSettings: 'MiniSettings@http://localhost:9003/[platform]/MiniSettings.container.js.bundle',
  },
  shared: {
    react:            { singleton: true, eager: true },
    'react-native':   { singleton: true, eager: true },
    '@super-app/core': { singleton: true, eager: true },
  },
})
```

## Configuração Remote

```javascript
// packages/mini-home/rspack.config.mjs
new Repack.plugins.ModuleFederationPluginV2({
  name: 'MiniHome',
  filename: 'MiniHome.container.js.bundle',
  exposes: {
    './Navigator': './src/Navigator.tsx',
    './manifest':  './src/manifest.ts',
  },
  shared: {
    react:            { singleton: true, eager: true },
    'react-native':   { singleton: true, eager: true },
    '@super-app/core': { singleton: true, eager: true },
  },
})
```

## O que `singleton: true` garante

- `react`, `react-native` e `@super-app/core` existem em **uma única instância** no runtime
- O EventBus é o mesmo objeto para Host e todos os Remotes
- Hooks do React funcionam corretamente (múltiplas instâncias quebram hooks)

## Portas dos bundlers

| Módulo | Porta |
| --- | --- |
| Host App | 8081 |
| Mini Home | 9001 |
| Mini Profile | 9002 |
| Mini Settings | 9003 |

## Em produção

Em multi-repo, os `remotes` apontam para uma CDN ou servidor de bundles ao invés de `localhost`:

```javascript
remotes: {
  MiniHome: 'MiniHome@https://cdn.wiipo.com.br/bundles/mini-home/v1.2.0/[platform]/MiniHome.container.js.bundle',
}
```

Cada squad faz deploy da sua tag — o Host baixa o bundle correto em runtime.
