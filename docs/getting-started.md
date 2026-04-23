# Primeiros Passos

## Pré-requisitos

- Node.js >= 22.11.0
- npm (utilizado como package manager)
- Xcode (para iOS) ou Android Studio (para Android)
- CocoaPods (para iOS)

## Instalação

```bash
# 1. Instalar dependências (inclui workspaces)
cd super_app
npm install

# 2. Instalar pods do iOS
cd ios && pod install && cd ..
```

## Executando o projeto

```bash
# 3. Iniciar o bundler (Re.Pack)
npm start

# 4. Em outro terminal, rodar no simulador
npm run ios       # iOS
npm run android   # Android
```

## Scripts disponíveis

| Script | Descrição |
| --- | --- |
| `npm start` | Inicia o bundler Re.Pack (porta 8081) |
| `npm run ios` | Build e executa no simulador iOS |
| `npm run android` | Build e executa no emulador Android |
| `npm run start:host` | Bundler do Host na porta 8081 |
| `npm run start:mini-home` | Bundler do Mini Home na porta 9001 |
| `npm run start:mini-profile` | Bundler do Mini Profile na porta 9002 |
| `npm run start:mini-settings` | Bundler do Mini Settings na porta 9003 |
| `npm test` | Executa testes com Jest |
| `npm run lint` | Executa ESLint |


