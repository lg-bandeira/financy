# Página — Transações

> Rota: `/transactions`
> Figma extraído em 2026-07-08

## Visão geral

Listagem completa das transações financeiras do usuário com filtros, tabela paginada e
ações de CRUD. Acesso via navegação global (header) ou link "Ver todas" no Dashboard.

## Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Logo]         Dashboard  Transações  Categorias           [CT]  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Transações                              [ + Nova transação ]    │
│  Gerencie todas as suas transações financeiras                   │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Buscar │ Tipo │ Categoria │ Período                        │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ DESCRIÇÃO │ DATA │ CATEGORIA │ TIPO │ VALOR │ AÇÕES       │  │
│  │ [rows...]                                                  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  1 a 10 | 27 resultados              < 1  2  3 >               │
└──────────────────────────────────────────────────────────────────┘
```

| Propriedade | Valor |
|-------------|-------|
| **Background** | `gray-100` |
| **Container** | Card branco full-width com padding |
| **Nav ativa** | "Transações" em `brand-base` |

---

## Cabeçalho da página

| Elemento | Texto / Estilo |
|----------|----------------|
| Título | "Transações" — `gray-800`, bold, ~28px |
| Subtítulo | "Gerencie todas as suas transações financeiras" — `gray-500` |
| Botão CTA | **"+ Nova transação"** — primary (`brand-base`), canto superior direito |

---

## Barra de filtros

Linha horizontal com 4 controles:

| Filtro | Tipo | Placeholder / Default | Comportamento |
|--------|------|----------------------|---------------|
| **Buscar** | Input com ícone `Search` | "Buscar por descrição" | Filtra por título/descrição (client ou server) |
| **Tipo** | Select | "Todos" | Opções: Todos, Entrada, Saída |
| **Categoria** | Select | "Todas" | Lista categorias do usuário + "Todas" |
| **Período** | Select | "Novembro / 2025" | Mês/ano para filtrar transações |

Filtros aplicam-se à tabela em tempo real ou via nova query GraphQL com parâmetros.

---

## Tabela de transações

### Colunas

| Coluna | Conteúdo | Alinhamento |
|--------|----------|-------------|
| **DESCRIÇÃO** | Ícone categoria + nome da transação | Esquerda |
| **DATA** | `DD/MM/YY` (ex.: "30/11/25") | Esquerda |
| **CATEGORIA** | Tag pill colorida | Esquerda |
| **TIPO** | Entrada (verde +) ou Saída (vermelho -) | Esquerda |
| **VALOR** | `+ R$ X` ou `- R$ X` | Direita |
| **AÇÕES** | Ícones editar e excluir | Centro |

### Linha de transação

| Elemento | Detalhes |
|----------|----------|
| Ícone | Quadrado arredondado com fundo `*-light` e ícone da categoria |
| Nome | Bold `gray-800` (ex.: "Jantar no Restaurante") |
| Tag categoria | Style Guide §5.6 (ex.: Alimentação blue, Transporte purple) |
| Tipo | Style Guide §5.7 — "Entrada" verde / "Saída" vermelho |
| Valor entrada | `+ R$ 320,00` em `gray-800` bold |
| Valor saída | `- R$ 85,50` em `gray-800` |
| Editar | Icon button `Pencil` → abre modal editar transação |
| Excluir | Icon button `Trash2` em `danger` → confirma e deleta |

### Exemplos do Figma

| Descrição | Data | Categoria | Tipo | Valor |
|-----------|------|-----------|------|-------|
| Jantar no Restaurante | 30/11/25 | Alimentação | Saída | - R$ 85,50 |
| Posto de Gasolina | 29/11/25 | Transporte | Saída | - R$ 180,00 |
| Compras no Mercado | 28/11/25 | Mercado | Saída | - R$ 234,80 |
| Dividendos Ações | 27/11/25 | Investimento | Entrada | + R$ 320,00 |
| Conta de Energia | 26/11/25 | Utilidades | Saída | - R$ 145,30 |
| Pagamento de Salário | 25/11/25 | Salário | Entrada | + R$ 4.250,00 |
| Cinema e Pipoca | 24/11/25 | Entretenimento | Saída | - R$ 68,00 |

---

## Paginação

| Elemento | Detalhes |
|----------|----------|
| Info | "1 a 10 \| 27 resultados" — `gray-500`, canto inferior esquerdo |
| Controles | Botões numéricos + setas (`ChevronLeft`, `ChevronRight`) |
| Estilo | Style Guide §5.5 — active em `brand-base` |
| Tamanho página | 10 itens por página (padrão) |

---

## Modais relacionados

| Modal | Trigger | Documentação |
|-------|---------|--------------|
| Nova transação | Botão "+ Nova transação" | [transaction-form-modal.md](./transaction-form-modal.md) |
| Editar transação | Ícone lápis na linha | [transaction-form-modal.md](./transaction-form-modal.md) |
| Confirmar exclusão | Ícone lixeira | Dialog de confirmação (pendente) |

---

## Comportamento

| Cenário | Resultado |
|---------|-----------|
| Usuário não autenticado | Redireciona para `/login` |
| Lista vazia | Estado empty com CTA "Nova transação" |
| Busca sem resultados | Mensagem "Nenhuma transação encontrada" |
| Filtro por tipo | Exibe apenas Entrada ou Saída |
| Filtro por categoria | Exibe apenas transações da categoria selecionada |
| Filtro por período | Exibe transações do mês/ano selecionado |
| Criar transação | Abre modal → mutation `createTransaction` → atualiza lista |
| Editar transação | Abre modal pré-preenchido → mutation `updateTransaction` |
| Excluir transação | Confirma → mutation `deleteTransaction` → remove da lista |
| Paginação | Navega entre páginas mantendo filtros ativos |

---

## Integração GraphQL

### Query — listar transações

```graphql
query ListTransactions(
  $search: String
  $type: TransactionType
  $categoryId: String
  $month: Int
  $year: Int
  $page: Int
  $limit: Int
) {
  listTransactions(
    search: $search
    type: $type
    categoryId: $categoryId
    month: $month
    year: $year
    page: $page
    limit: $limit
  ) {
    items {
      id
      title
      amount
      type
      date
      category {
        id
        name
        color
      }
    }
    total
    page
    limit
  }
}
```

### Mutations

```graphql
mutation CreateTransaction($data: CreateTransactionInput!) {
  createTransaction(data: $data) { id }
}

mutation UpdateTransaction($id: String!, $data: UpdateTransactionInput!) {
  updateTransaction(id: $id, data: $data) { id }
}

mutation DeleteTransaction($id: String!) {
  deleteTransaction(id: $id)
}
```

> Nomes exatos dependem do schema final da API. Todos os recursos MUST ser filtrados
> pelo `userId` autenticado (Princípio IV da constitution).

---

## Estrutura de arquivos sugerida

```text
frontend/src/
├── pages/
│   └── Transactions/
│       ├── index.tsx
│       └── components/
│           ├── TransactionFilters.tsx
│           ├── TransactionTable.tsx
│           ├── TransactionRow.tsx
│           └── TransactionFormDialog.tsx
└── lib/graphql/
    ├── queries/Transactions.ts
    └── mutations/Transaction.ts
```

## Componentes utilizados

| Componente | Origem |
|------------|--------|
| `Header` / `Layout` | Dashboard (nav global) |
| `Input` (busca) | Style Guide §5.1 |
| `Select` (filtros) | Style Guide §5.1 |
| `Button` (primary) | Style Guide §5.2 |
| `Tag` | Style Guide §5.6 |
| `Type` | Style Guide §5.7 |
| `Icon Button` | Style Guide §5.3 |
| `Pagination` | Style Guide §5.5 |
| `Dialog` | Shadcn/ui (modal formulário) |

## Responsividade

| Breakpoint | Comportamento |
|------------|---------------|
| Mobile | Filtros empilhados; tabela com scroll horizontal |
| Tablet | Filtros em 2×2 grid |
| Desktop | Filtros em linha; tabela full-width |

## Referências

- Dashboard: [dashboard.md](./dashboard.md)
- Style Guide: `../style-guide.md`
- Categorias: `categories.md` (pendente)
