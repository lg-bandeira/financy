# Página — Dashboard

> Rota: `/` (usuário autenticado)
> Figma extraído em 2026-07-08

## Visão geral

Tela principal após login. Exibe resumo financeiro do mês, transações recentes e
distribuição por categorias. Usuário deslogado que acessa `/` deve ver a tela de login.

## Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Logo FINANCY]    Dashboard  Transações  Categorias      [CT]   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ Saldo Total  │  │ Receitas Mês │  │ Despesas Mês │           │
│  │ R$ 12.847,32 │  │ R$ 4.250,00  │  │ R$ 2.180,45  │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                  │
│  ┌─────────────────────────────┐  ┌─────────────────────────┐   │
│  │ TRANSAÇÕES RECENTES  Ver todas│  │ CATEGORIAS    Gerenciar│   │
│  │                             │  │                         │   │
│  │ [lista de 5 transações]     │  │ [lista de categorias]   │   │
│  │                             │  │                         │   │
│  │      [ + Nova transação ]   │  │                         │   │
│  └─────────────────────────────┘  └─────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

| Propriedade | Valor |
|-------------|-------|
| **Background da página** | `gray-100` (`#F8F9FA`) |
| **Grid principal** | 3 cards resumo (topo) + 2 colunas (70/30 ou 2/3 + 1/3) |
| **Cards** | Fundo `white`, border-radius ~12px, sombra suave, padding interno |

---

## Header (navegação global)

Presente em todas as páginas autenticadas.

| Elemento | Posição | Detalhes |
|----------|---------|----------|
| **Logo** | Esquerda | Ícone moedas + "FINANCY" em `brand-base` |
| **Nav links** | Centro | Dashboard, Transações, Categorias |
| **Avatar** | Direita | Círculo com iniciais do usuário (ex.: "CT") |

### Estados dos links de navegação

| Estado | Estilo |
|--------|--------|
| Ativo | Texto `brand-base`, possível underline ou peso maior |
| Inativo | Texto `gray-600`, hover `gray-800` |

### Rotas de navegação

| Link | Rota |
|------|------|
| Dashboard | `/` |
| Transações | `/transactions` |
| Categorias | `/categories` |

---

## Cards de resumo (linha superior)

Três cards em grid horizontal responsivo (1 col mobile → 3 cols desktop).

### 1. Saldo Total

| Propriedade | Valor |
|-------------|-------|
| Label | "Saldo Total" |
| Ícone | `Wallet` em círculo roxo (`purple-light` / `purple-base`) |
| Valor | Moeda BRL formatada (ex.: `R$ 12.847,32`) |
| Cálculo | Receitas do mês − Despesas do mês (ou saldo acumulado — definir na API) |

### 2. Receitas do Mês

| Propriedade | Valor |
|-------------|-------|
| Label | "Receitas do Mês" |
| Ícone | Seta para cima em círculo verde (`green-light` / `success`) |
| Valor | Soma das transações tipo **Entrada** no mês atual |
| Cor do valor | `success` (`#19AD70`) |

### 3. Despesas do Mês

| Propriedade | Valor |
|-------------|-------|
| Label | "Despesas do Mês" |
| Ícone | Seta para baixo em círculo vermelho (`red-light` / `danger`) |
| Valor | Soma das transações tipo **Saída** no mês atual |
| Cor do valor | `danger` (`#EF4444`) |

---

## Seção — Transações Recentes

Card grande na coluna esquerda.

### Cabeçalho

| Elemento | Texto | Ação |
|----------|-------|------|
| Título | "TRANSAÇÕES RECENTES" | — |
| Link | "Ver todas >" | Navega para página de Transações |

### Item de transação (lista)

Cada linha exibe:

| Coluna | Conteúdo |
|--------|----------|
| Ícone | Círculo colorido com ícone da categoria (ex.: `Briefcase`, `Utensils`, `Car`) |
| Título | Nome da transação (ex.: "Pagamento de Salário") |
| Data | Formato `DD/MM/YY` (ex.: "01/12/25") em `gray-500` |
| Tag | Categoria em pill colorida (ex.: "Receita", "Alimentação") |
| Valor | Prefixo `+` (entrada) ou `-` (saída) + valor BRL |
| Indicador | Ícone `ArrowDownCircle` (verde) ou `ArrowUpCircle` (vermelho) |

**Exemplos do Figma:**

| Transação | Categoria | Valor |
|-----------|-----------|-------|
| Pagamento de Salário | Receita (green) | + R$ 4.250,00 |
| Almoço no restaurante | Alimentação (blue) | - R$ 45,80 |
| Uber para o trabalho | Transporte (purple) | - R$ 28,50 |
| Compras no supermercado | Mercado (orange) | - R$ 156,30 |
| Dividendos ações | Investimento (pink) | + R$ 320,00 |

### Rodapé do card

| Botão | Variante | Ação |
|-------|----------|------|
| **+ Nova transação** | Secondary (outline, centralizado) | Abre modal de criar transação |

Limite de exibição: **5 transações mais recentes**.

---

## Seção — Categorias

Card na coluna direita.

### Cabeçalho

| Elemento | Texto | Ação |
|----------|-------|------|
| Título | "CATEGORIAS" | — |
| Link | "Gerenciar >" | Navega para página de Categorias |

### Item de categoria (lista)

Cada linha exibe:

| Coluna | Conteúdo |
|--------|----------|
| Tag | Nome da categoria em pill colorida |
| Contagem | "N itens" em `gray-500` |
| Total | Valor BRL gasto na categoria (ex.: `R$ 542,30`) |

**Exemplos do Figma:**

| Categoria | Itens | Total |
|-----------|-------|-------|
| Alimentação (blue) | 12 itens | R$ 542,30 |
| Transporte (purple) | 8 itens | R$ 324,80 |
| Mercado (orange) | 6 itens | R$ 892,15 |
| Entretenimento (pink) | 4 itens | R$ 156,00 |
| Utilidades (yellow) | 3 itens | R$ 265,20 |

Ordenação sugerida: por total gasto (decrescente).

---

## Comportamento

| Cenário | Resultado |
|---------|-----------|
| Usuário não autenticado | Redireciona para `/login` |
| Sem transações | Lista vazia com estado empty (mensagem + CTA "Nova transação") |
| Sem categorias | Seção categorias vazia com link "Gerenciar" |
| Modal nova transação | Abre modal Dialog de criar transação | [transaction-form-modal.md](./transaction-form-modal.md) |
| Clique "Ver todas" | Navega para `/transactions` |
| Clique "Gerenciar" | Navega para `/categories` |
| Clique no avatar | Navega para `/profile` ou menu com link Perfil / Sair |

## Dados necessários (GraphQL)

### Queries sugeridas

```graphql
query DashboardSummary {
  # Resumo financeiro do mês atual
  monthlyIncome: ...
  monthlyExpenses: ...
  balance: ...

  # Últimas 5 transações
  recentTransactions: listTransactions(limit: 5, orderBy: createdAt_DESC) {
    id
    title
    amount
    type        # INCOME | EXPENSE
    date
    category { id name color }
  }

  # Top categorias por gasto
  categorySummary: ... {
    category { id name color }
    itemCount
    totalAmount
  }
}
```

> Queries exatas dependem do schema final da API. Agrupamentos (soma por mês,
> contagem por categoria) podem ser resolvers dedicados ou calculados no service.

## Estrutura de arquivos sugerida

```text
frontend/src/
├── components/
│   ├── Header.tsx
│   ├── Layout.tsx
│   ├── SummaryCard.tsx
│   ├── TransactionListItem.tsx
│   └── CategorySummaryItem.tsx
├── pages/
│   └── Dashboard/
│       └── index.tsx
└── lib/graphql/queries/
    └── Dashboard.ts
```

## Componentes utilizados

| Componente | Origem |
|------------|--------|
| `Header` / `Layout` | Navegação global |
| `SummaryCard` | Cards de resumo (topo) |
| `Tag` | Style Guide §5.6 |
| `Type` (entrada/saída) | Style Guide §5.7 |
| `Button` (secondary) | Style Guide §5.2 |
| `Avatar` | Shadcn/ui |
| Modal nova transação | [transaction-form-modal.md](./transaction-form-modal.md) |

## Responsividade

| Breakpoint | Comportamento |
|------------|---------------|
| Mobile | Cards resumo empilhados; seções em coluna única |
| Tablet | 2 cols resumo + 1; transações e categorias empilhados |
| Desktop | 3 cols resumo; transações (2/3) + categorias (1/3) |

## Referências

- Style Guide: `../style-guide.md`
- Páginas relacionadas: [login.md](./login.md), transações e categorias (pendentes)
- Padrão Mindshare: `ftr-pos-360-mindshare/frontend/src/components/Header.tsx`
