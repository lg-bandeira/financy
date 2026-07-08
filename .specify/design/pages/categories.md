# Página — Categorias

> Rota: `/categories`
> Figma extraído em 2026-07-08

## Visão geral

Gestão visual das categorias de transações em grid de cards. Exibe estatísticas
resumidas e permite criar, editar e excluir categorias. Acesso via navegação global
ou link "Gerenciar" no Dashboard.

## Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Logo]         Dashboard  Transações  Categorias           [CT]  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Categorias                              [ + Nova categoria ]    │
│  Organize suas transações por categorias                         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ 8            │  │ 27           │  │ Alimentação  │           │
│  │ Total Cat.   │  │ Total Trans. │  │ Mais usada   │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │ Card 1  │ │ Card 2  │ │ Card 3  │ │ Card 4  │               │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │ Card 5  │ │ Card 6  │ │ Card 7  │ │ Card 8  │               │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
└──────────────────────────────────────────────────────────────────┘
```

| Propriedade | Valor |
|-------------|-------|
| **Background** | `gray-100` |
| **Nav ativa** | "Categorias" em `brand-base` |
| **Grid de cards** | 4 colunas (desktop), responsivo |

---

## Cabeçalho da página

| Elemento | Texto / Estilo |
|----------|----------------|
| Título | "Categorias" — `gray-800`, bold, ~28px |
| Subtítulo | "Organize suas transações por categorias" — `gray-500` |
| Botão CTA | **"+ Nova categoria"** — primary (`brand-base`), canto superior direito |

---

## Cards de resumo (linha superior)

Três cards em grid horizontal.

### 1. Total de Categorias

| Propriedade | Valor |
|-------------|-------|
| Ícone | `Tag` em círculo cinza |
| Valor | Número total (ex.: **8**) |
| Label | "TOTAL DE CATEGORIAS" — uppercase, `gray-500`, ~12px |

### 2. Total de Transações

| Propriedade | Valor |
|-------------|-------|
| Ícone | `ArrowUpDown` em círculo cinza |
| Valor | Número total (ex.: **27**) |
| Label | "TOTAL DE TRANSAÇÕES" |

### 3. Categoria Mais Utilizada

| Propriedade | Valor |
|-------------|-------|
| Ícone | Ícone da categoria líder (ex.: `Utensils` para Alimentação) |
| Valor | Nome da categoria (ex.: **Alimentação**) |
| Label | "CATEGORIA MAIS UTILIZADA" |

---

## Grid de categorias

Cards em grid 4×N com gap consistente.

### Estrutura do CategoryCard

```
┌─────────────────────────────┐
│ [ícone]          [🗑] [✏]  │
│                             │
│ Nome da Categoria           │
│ Descrição curta...          │
│                             │
│ [Tag nome]        N itens   │
└─────────────────────────────┘
```

| Elemento | Detalhes |
|----------|----------|
| **Ícone** | Quadrado arredondado com fundo `*-light` e ícone Lucide da categoria |
| **Ações** | `Trash2` (danger) + `Pencil` (neutro) — canto superior direito |
| **Título** | Nome da categoria — bold `gray-800` |
| **Descrição** | Texto curto — `gray-500`, ~14px |
| **Tag** | Pill com nome da categoria (Style Guide §5.6) |
| **Contagem** | "N itens" — `gray-500`, alinhado à direita |

### Categorias do Figma

| Categoria | Cor | Ícone | Descrição | Itens |
|-----------|-----|-------|-----------|-------|
| Alimentação | blue | `Utensils` | Restaurantes, delivery e refeições | 12 |
| Entretenimento | pink | `Ticket` | Cinema, jogos e lazer | 2 |
| Investimento | green | `PiggyBank` | Aplicações e retornos financeiros | 1 |
| Mercado | orange | `ShoppingCart` | Compras de supermercado e mantimentos | 3 |
| Salário | green-light | `Briefcase` | Renda mensal e bonificações | 3 |
| Saúde | red | `HeartPulse` | Medicamentos, consultas e exames | 0 |
| Transporte | purple | `Car` | Gasolina, transporte público e viagens | 8 |
| Utilidades | yellow | `Home` ou utilidade | Energia, água, internet e telefone | 7 |

### Mapeamento cor → token

| Cor Figma | Token Tailwind |
|-----------|----------------|
| Blue | `blue-light` / `blue-base` |
| Pink | `pink-light` / `pink-base` |
| Green | `green-light` / `green-base` |
| Orange | `orange-light` / `orange-base` |
| Red | `red-light` / `red-base` |
| Purple | `purple-light` / `purple-base` |
| Yellow | `yellow-light` / `yellow-dark` |

---

## Modais relacionados

| Modal | Trigger | Documentação |
|-------|---------|--------------|
| Nova categoria | Botão "+ Nova categoria" | [category-form-modal.md](./category-form-modal.md) |
| Editar categoria | Ícone lápis no card | [category-form-modal.md](./category-form-modal.md) |
| Confirmar exclusão | Ícone lixeira | Dialog de confirmação (pendente) |

---

## Comportamento

| Cenário | Resultado |
|---------|-----------|
| Usuário não autenticado | Redireciona para `/login` |
| Sem categorias | Grid vazio com CTA "Nova categoria" |
| Criar categoria | Abre modal → mutation `createCategory` → adiciona card ao grid |
| Editar categoria | Abre modal pré-preenchido → mutation `updateCategory` |
| Excluir categoria | Confirma → mutation `deleteCategory` |
| Excluir com transações vinculadas | Bloquear ou reatribuir — definir regra de negócio na API |
| Categoria com 0 itens | Exibe "0 itens" normalmente (ex.: Saúde) |

---

## Integração GraphQL

### Query — listar categorias

```graphql
query ListCategories {
  listCategories {
    id
    name
    description
    color
    icon
    transactionCount
  }
  categoryStats {
    totalCategories
    totalTransactions
    mostUsedCategory {
      id
      name
      icon
      color
    }
  }
}
```

### Mutations

```graphql
mutation CreateCategory($data: CreateCategoryInput!) {
  createCategory(data: $data) { id }
}

mutation UpdateCategory($id: String!, $data: UpdateCategoryInput!) {
  updateCategory(id: $id, data: $data) { id }
}

mutation DeleteCategory($id: String!) {
  deleteCategory(id: $id)
}
```

**Input sugerido:**

```typescript
type CreateCategoryInput = {
  name: string
  description?: string
  color: CategoryColor  // blue | pink | green | orange | red | purple | yellow | gray
  icon: string          // nome do ícone Lucide
}
```

> Todos os recursos MUST ser filtrados pelo `userId` autenticado (Princípio IV).

---

## Estrutura de arquivos sugerida

```text
frontend/src/
├── pages/
│   └── Categories/
│       ├── index.tsx
│       └── components/
│           ├── CategoryStats.tsx
│           ├── CategoryCard.tsx
│           └── CategoryFormDialog.tsx
└── lib/graphql/
    ├── queries/Categories.ts
    └── mutations/Category.ts
```

## Componentes utilizados

| Componente | Origem |
|------------|--------|
| `Header` / `Layout` | Nav global |
| `SummaryCard` | Cards de resumo (reutilizar do Dashboard) |
| `CategoryCard` | Card de categoria no grid |
| `Tag` | Style Guide §5.6 |
| `Icon Button` | Style Guide §5.3 |
| `Button` (primary) | Style Guide §5.2 |
| `Dialog` | Shadcn/ui (modal formulário) |

## Responsividade

| Breakpoint | Grid |
|------------|------|
| Mobile | 1 coluna |
| Tablet | 2 colunas |
| Desktop | 4 colunas |

## Referências

- Dashboard: [dashboard.md](./dashboard.md)
- Transações: [transactions.md](./transactions.md)
- Style Guide: `../style-guide.md`
