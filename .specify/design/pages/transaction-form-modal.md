# Modal — Nova / Editar Transação

> Componente: `TransactionFormDialog`
> Figma extraído em 2026-07-08

## Visão geral

Dialog para criar ou editar uma transação financeira. Abre sobre o Dashboard ou a página
de Transações com overlay escurecido. Título e campos variam conforme o modo (criar vs.
editar) e o tipo selecionado (Despesa vs. Receita).

## Triggers

| Origem | Ação |
|--------|------|
| Dashboard | Botão "+ Nova transação" |
| Transações | Botão "+ Nova transação" |
| Transações | Ícone `Pencil` na linha da tabela (modo editar) |

---

## Layout

```
┌─────────────────────────────────────┐
│ Nova transação                  [X] │
│ Registre sua despesa ou receita     │
│                                     │
│  ┌─────────────┐ ┌─────────────┐   │
│  │  Despesa ↓  │ │  Receita ↑  │   │  ← toggle tipo
│  └─────────────┘ └─────────────┘   │
│                                     │
│  Descrição                          │
│  [ Ex. Almoço no restaurante    ]   │
│                                     │
│  Data              Valor            │
│  [ Selecione   ]   [ R$ 0,00    ]   │
│                                     │
│  Categoria                          │
│  [ Selecione                    ▼]  │
│                                     │
│  [         Salvar               ]   │
└─────────────────────────────────────┘
```

| Propriedade | Valor |
|-------------|-------|
| **Componente** | Shadcn `Dialog` |
| **Largura** | ~480px (max-width responsivo) |
| **Overlay** | Fundo escurecido (`black/50`) |
| **Fundo do modal** | `white`, border-radius ~12px |

---

## Cabeçalho

| Elemento | Criar | Editar |
|----------|-------|--------|
| Título | "Nova transação" | "Editar transação" |
| Subtítulo | "Registre sua despesa ou receita" | "Atualize os dados da transação" |
| Fechar | Ícone `X` — canto superior direito, fecha sem salvar |

---

## Toggle de tipo (Despesa / Receita)

Dois botões lado a lado, largura igual (50% cada).

| Opção | Ícone | Estado selecionado | Estado não selecionado |
|-------|-------|-------------------|------------------------|
| **Despesa** | `ArrowDownCircle` vermelho | Borda `danger`, fundo `red-light` | Borda `gray-300`, fundo `white` |
| **Receita** | `ArrowUpCircle` verde | Borda `success`, fundo `green-light` | Borda `gray-300`, fundo `white` |

| Valor interno | Tipo API |
|---------------|----------|
| Despesa | `EXPENSE` / `SAIDA` |
| Receita | `INCOME` / `ENTRADA` |

Default ao abrir (criar): **Despesa** selecionada.

---

## Campos do formulário

### Descrição

| Propriedade | Valor |
|-------------|-------|
| Label | "Descrição" |
| Placeholder | "Ex. Almoço no restaurante" |
| Tipo | `text` |
| Obrigatório | Sim |

### Data

| Propriedade | Valor |
|-------------|-------|
| Label | "Data" |
| Placeholder | "Selecione" |
| Tipo | Date picker ou input `date` |
| Layout | Metade da largura (grid 2 cols com Valor) |
| Obrigatório | Sim |
| Default (criar) | Data atual |

### Valor

| Propriedade | Valor |
|-------------|-------|
| Label | "Valor" |
| Placeholder / Default | `R$ 0,00` |
| Tipo | Monetário (máscara BRL) |
| Layout | Metade da largura (grid 2 cols com Data) |
| Obrigatório | Sim |
| Validação | Valor > 0 |

### Categoria

| Propriedade | Valor |
|-------------|-------|
| Label | "Categoria" |
| Placeholder | "Selecione" |
| Tipo | Select dropdown |
| Ícone | `ChevronDown` à direita |
| Obrigatório | Sim |
| Opções | Categorias do usuário (`listCategories`) |

---

## Ação principal

| Botão | Variante | Ação |
|-------|----------|------|
| **Salvar** | Primary (`brand-base`, full-width) | Submete formulário |

Modo criar → `createTransaction`  
Modo editar → `updateTransaction`

---

## Comportamento

| Cenário | Resultado |
|---------|-----------|
| Abrir (criar) | Formulário vazio, Despesa selecionada, data = hoje |
| Abrir (editar) | Campos pré-preenchidos com dados da transação |
| Trocar tipo | Mantém demais campos; pode filtrar categorias por tipo (opcional) |
| Salvar válido | Fecha modal, atualiza lista/cache, toast de sucesso |
| Salvar inválido | Validação inline nos campos com erro |
| Fechar (X) ou overlay | Descarta alterações, fecha modal |
| Sem categorias | Select vazio + link "Criar categoria" (opcional) |

---

## Integração GraphQL

### Criar

```graphql
mutation CreateTransaction($data: CreateTransactionInput!) {
  createTransaction(data: $data) {
    id
    title
    amount
    type
    date
    category { id name color }
  }
}
```

### Editar

```graphql
mutation UpdateTransaction($id: String!, $data: UpdateTransactionInput!) {
  updateTransaction(id: $id, data: $data) {
    id
    title
    amount
    type
    date
    category { id name color }
  }
}
```

**Input sugerido:**

```typescript
type CreateTransactionInput = {
  title: string
  amount: number       // em centavos ou decimal — definir no backend
  type: 'INCOME' | 'EXPENSE'
  date: string         // ISO 8601
  categoryId: string
}

type UpdateTransactionInput = {
  title?: string
  amount?: number
  type?: 'INCOME' | 'EXPENSE'
  date?: string
  categoryId?: string
}
```

### Query auxiliar (categorias no select)

```graphql
query ListCategoriesForSelect {
  listCategories {
    id
    name
    color
  }
}
```

---

## Validação (Zod sugerido)

```typescript
const transactionSchema = z.object({
  title: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.number().positive('Valor deve ser maior que zero'),
  type: z.enum(['INCOME', 'EXPENSE']),
  date: z.string().min(1, 'Data é obrigatória'),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
})
```

---

## Estrutura de arquivos sugerida

```text
frontend/src/
├── pages/
│   ├── Dashboard/components/
│   └── Transactions/components/
│       └── TransactionFormDialog.tsx   # componente compartilhado
└── lib/graphql/mutations/
    └── Transaction.ts
```

Recomendado: componente único em `components/TransactionFormDialog.tsx` reutilizado
pelo Dashboard e Transações.

## Componentes utilizados

| Componente | Origem |
|------------|--------|
| `Dialog` | Shadcn/ui |
| `Input` | Style Guide §5.1 |
| `Select` | Style Guide §5.1 |
| `Button` (primary + toggle) | Style Guide §5.2 |
| `Type` (despesa/receita) | Style Guide §5.7 |

## Referências

- Dashboard: [dashboard.md](./dashboard.md)
- Transações: [transactions.md](./transactions.md)
- Categorias: [categories.md](./categories.md)
- Style Guide: `../style-guide.md`
