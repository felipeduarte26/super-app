# Criando um Novo Mini App

Guia passo a passo para criar um novo Mini App do zero. Usaremos como exemplo um módulo de **Carteira** (`mini-wallet`).

## Passo 1 — Estrutura de diretórios

```bash
mkdir -p packages/mini-wallet/src/{di,domain/{entities,repositories,rules},application/{useCases,viewModels,mappers},data/{datasources,repositories},presentation/{screens/Wallet,components,hooks}}
```

```
packages/mini-wallet/
├── package.json
├── rspack.config.mjs
└── src/
    ├── di/
    │   ├── container.ts
    │   └── index.ts
    ├── domain/
    │   ├── entities/
    │   ├── repositories/
    │   ├── rules/
    │   └── index.ts
    ├── application/
    │   ├── useCases/
    │   ├── viewModels/
    │   ├── mappers/
    │   └── index.ts
    ├── data/
    │   ├── datasources/
    │   ├── repositories/
    │   └── index.ts
    ├── presentation/
    │   ├── screens/Wallet/
    │   ├── components/
    │   ├── hooks/
    │   └── index.ts
    ├── Navigator.tsx
    ├── Navigator.styles.ts
    ├── manifest.ts
    └── index.ts
```

## Passo 2 — `package.json`

```json
{
  "name": "@super-app/mini-wallet",
  "version": "1.0.0",
  "private": true,
  "main": "src/index.ts",
  "dependencies": {
    "@super-app/core": "*"
  },
  "peerDependencies": {
    "react": "*",
    "react-native": "*"
  }
}
```

**Por que `peerDependencies`?** Em Module Federation, `react` e `react-native` são compartilhados como singleton. Declarar como peer evita duplicação no bundle.

## Passo 3 — Domain Layer

A camada Domain é **pura** — não depende de React, APIs, nem de `@super-app/core`.

### `src/domain/entities/Transaction.ts`

```typescript
export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: Date;
  category: string;
}
```

### `src/domain/repositories/ITransactionRepository.ts`

```typescript
import type {Transaction} from '../entities/Transaction';

export interface ITransactionRepository {
  getTransactions(): Promise<Transaction[]>;
  getBalance(): Promise<number>;
}
```

### `src/domain/rules/transactionRules.ts`

```typescript
import type {Transaction} from '../entities/Transaction';

export function calculateBalance(transactions: Transaction[]): number {
  return transactions.reduce((acc, t) => {
    return t.type === 'income' ? acc + t.amount : acc - t.amount;
  }, 0);
}

export function filterByType(
  transactions: Transaction[],
  type: Transaction['type'],
): Transaction[] {
  return transactions.filter(t => t.type === type);
}
```

## Passo 4 — Application Layer

### `src/application/viewModels/TransactionViewModel.ts`

```typescript
import type {TransactionType} from '../../domain/entities/Transaction';

export interface TransactionViewModel {
  id: string;
  description: string;
  formattedAmount: string;
  type: TransactionType;
  formattedDate: string;
  category: string;
  isExpense: boolean;
}
```

### `src/application/mappers/TransactionMapper.ts`

```typescript
import type {Transaction} from '../../domain/entities/Transaction';
import type {TransactionViewModel} from '../viewModels/TransactionViewModel';

export class TransactionMapper {
  static toViewModel(transaction: Transaction): TransactionViewModel {
    return {
      id: transaction.id,
      description: transaction.description,
      formattedAmount: transaction.amount.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
      type: transaction.type,
      formattedDate: transaction.date.toLocaleDateString('pt-BR'),
      category: transaction.category,
      isExpense: transaction.type === 'expense',
    };
  }

  static toViewModelList(transactions: Transaction[]): TransactionViewModel[] {
    return transactions.map(t => TransactionMapper.toViewModel(t));
  }
}
```

### `src/application/useCases/GetTransactionsUseCase.ts`

```typescript
import type {ITransactionRepository} from '../../domain/repositories/ITransactionRepository';
import {TransactionMapper} from '../mappers/TransactionMapper';
import type {TransactionViewModel} from '../viewModels/TransactionViewModel';

export class GetTransactionsUseCase {
  constructor(private repository: ITransactionRepository) {}

  async execute(): Promise<TransactionViewModel[]> {
    const transactions = await this.repository.getTransactions();
    return TransactionMapper.toViewModelList(transactions);
  }
}
```

## Passo 5 — Data Layer

### `src/data/datasources/TransactionApiClient.ts`

```typescript
import {HttpClientFactory, type IHttpClient} from '@super-app/core';
import type {Transaction} from '../../domain/entities/Transaction';

interface TransactionDto {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  date: string;
  category: string;
}

const MOCK_DATA: TransactionDto[] = [
  { id: '1', description: 'Salário', amount: 5000, type: 'income', date: '2025-04-01', category: 'Trabalho' },
  { id: '2', description: 'Aluguel', amount: 1500, type: 'expense', date: '2025-04-05', category: 'Moradia' },
];

export class TransactionApiClient {
  private httpClient: IHttpClient;

  constructor(httpClient?: IHttpClient) {
    this.httpClient = httpClient ?? HttpClientFactory.create();
  }

  async fetchTransactions(): Promise<Transaction[]> {
    await new Promise(r => setTimeout(r, 300));
    return MOCK_DATA.map(dto => ({ ...dto, date: new Date(dto.date) }));
  }
}
```

### `src/data/repositories/TransactionRepositoryImpl.ts`

```typescript
import type {Transaction} from '../../domain/entities/Transaction';
import type {ITransactionRepository} from '../../domain/repositories/ITransactionRepository';
import {calculateBalance} from '../../domain/rules/transactionRules';
import {TransactionApiClient} from '../datasources/TransactionApiClient';

export class TransactionRepositoryImpl implements ITransactionRepository {
  constructor(private readonly apiClient: TransactionApiClient) {}

  async getTransactions(): Promise<Transaction[]> {
    return this.apiClient.fetchTransactions();
  }

  async getBalance(): Promise<number> {
    const transactions = await this.apiClient.fetchTransactions();
    return calculateBalance(transactions);
  }
}
```

## Passo 6 — DI Container (Composition Root)

### `src/di/container.ts`

```typescript
import {TransactionApiClient} from '../data/datasources/TransactionApiClient';
import {TransactionRepositoryImpl} from '../data/repositories/TransactionRepositoryImpl';
import {GetTransactionsUseCase} from '../application/useCases/GetTransactionsUseCase';

const transactionDataSource = new TransactionApiClient();
const transactionRepository = new TransactionRepositoryImpl(transactionDataSource);

export const container = {
  getTransactionsUseCase: new GetTransactionsUseCase(transactionRepository),
} as const;
```

### `src/di/index.ts`

```typescript
export {container} from './container';
```

## Passo 7 — Presentation Layer

### `src/presentation/hooks/useWallet.ts`

```typescript
import {useState, useCallback, useEffect} from 'react';
import type {TransactionViewModel} from '../../application/viewModels/TransactionViewModel';
import {container} from '../../di';

export function useWallet() {
  const [transactions, setTransactions] = useState<TransactionViewModel[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const items = await container.getTransactionsUseCase.execute();
      setTransactions(items);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {transactions, loading, refresh};
}
```

### `src/presentation/screens/Wallet/WalletScreen.tsx`

```typescript
import React from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import {Card, Section, colors} from '@super-app/core';
import {useWallet} from '../../hooks/useWallet';
import {styles} from './WalletScreen.styles';

export function WalletScreen() {
  const {transactions, loading} = useWallet();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Section title="Transações">
        <Card>
          <FlatList
            data={transactions}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            renderItem={({item}) => (
              <View style={styles.transactionItem}>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={item.isExpense ? styles.amountExpense : styles.amountIncome}>
                  {item.formattedAmount}
                </Text>
              </View>
            )}
          />
        </Card>
      </Section>
    </View>
  );
}
```

## Passo 8 — Navigator, Manifest e Index

### `src/manifest.ts`

```typescript
import type {MiniAppManifest} from '@super-app/core';

export const manifest: MiniAppManifest = {
  name: 'wallet',
  displayName: 'Carteira',
  version: '1.0.0',
  routes: [{name: 'Wallet', screen: 'Main'}],
  tabConfig: {
    icon: 'wallet',
    label: 'Carteira',
    order: 4,
  },
};
```

### `src/Navigator.tsx`

```typescript
import React from 'react';
import {ScrollView} from 'react-native';
import {WalletScreen} from './presentation/screens/Wallet/WalletScreen';

export default function WalletNavigator() {
  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <WalletScreen />
    </ScrollView>
  );
}
```

### `src/index.ts`

```typescript
export {default as Navigator} from './Navigator';
export {manifest} from './manifest';
```

## Passo 9 — Module Federation (`rspack.config.mjs`)

```javascript
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import * as Repack from '@callstack/repack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default Repack.defineRspackConfig({
  context: __dirname,
  entry: './src/index.ts',
  resolve: { ...Repack.getResolveOptions() },
  module: {
    rules: [
      { test: /\.[cm]?[jt]sx?$/, type: 'javascript/auto', use: { loader: '@callstack/repack/babel-swc-loader', parallel: true, options: {} } },
      ...Repack.getAssetTransformRules(),
    ],
  },
  plugins: [
    new Repack.RepackPlugin(),
    new Repack.plugins.ModuleFederationPluginV2({
      name: 'MiniWallet',
      filename: 'MiniWallet.container.js.bundle',
      exposes: {
        './Navigator': './src/Navigator.tsx',
        './manifest': './src/manifest.ts',
      },
      shared: {
        react: {singleton: true, eager: true},
        'react-native': {singleton: true, eager: true},
        '@super-app/core': {singleton: true, eager: true},
      },
    }),
  ],
});
```

## Passo 10 — Registrar no Host App

### 10.1 — `rspack.config.mjs` do Host

```javascript
remotes: {
  MiniWallet: 'MiniWallet@http://localhost:9004/[platform]/MiniWallet.container.js.bundle',
},
```

### 10.2 — `src/config/bootstrap.ts`

```typescript
import WalletNavigator from '@super-app/mini-wallet/src/Navigator';
import {manifest as walletManifest} from '@super-app/mini-wallet/src/manifest';

registerMiniApp({
  manifest: walletManifest,
  getNavigator: () => WalletNavigator,
});
```

### 10.3 — Ícone no `BottomTabNavigator.tsx`

```typescript
const TAB_ICONS: Record<string, string> = {
  home: '🏠',
  profile: '👤',
  settings: '⚙️',
  wallet: '💰',
};
```

### 10.4 — Script no `package.json`

```json
"start:mini-wallet": "react-native start --port 9004 --config packages/mini-wallet/rspack.config.mjs"
```

## Passo 11 — Registrar eventos (se necessário)

```typescript
// packages/core/src/event-bus/events.ts
export const AppEvents = {
  // ... eventos existentes ...
  WALLET_BALANCE_CHANGED: 'wallet:balance_changed',
  WALLET_TRANSACTION_ADDED: 'wallet:transaction_added',
} as const;
```

## Checklist de Validação

**Arquitetura (Clean Architecture + SOLID):**
- [ ] `di/container.ts` é o **único** arquivo que instancia implementações concretas
- [ ] `presentation/` **NÃO** importa de `data/` nem de `domain/`
- [ ] `application/` **NÃO** importa de `data/` nem de `presentation/`
- [ ] `domain/` **NÃO** importa de nenhuma outra camada
- [ ] Use Cases recebem repositórios via construtor (DIP)
- [ ] Repositórios recebem DataSources via construtor
- [ ] DataSources ficam em `data/datasources/`
- [ ] Cada camada tem um `index.ts` barrel export

**Isolamento e comunicação:**
- [ ] `package.json` tem apenas `@super-app/core` como dependency
- [ ] Nenhum import de `@super-app/mini-*`
- [ ] EventBus é usado para comunicação entre módulos
- [ ] Domain layer não importa React nem `@super-app/core`

**Organização:**
- [ ] Componentes e styles em arquivos separados (`.tsx` + `.styles.ts`)
- [ ] Manifest exporta `tabConfig` com `order` definido
- [ ] `index.ts` exporta apenas Navigator e manifest
- [ ] `rspack.config.mjs` com `singleton: true` para react, react-native e @super-app/core
- [ ] TypeScript compila sem erros (`npx tsc --noEmit`)
- [ ] Nenhuma pasta vazia no módulo
