# Modal — Nova / Editar Categoria

> Componente: `CategoryFormDialog`
> Figma extraído em 2026-07-08

## Visão geral

Dialog para criar ou editar uma categoria de transação. Abre sobre a página de
Categorias com overlay escurecido. Permite definir título, descrição opcional, ícone
e cor temática.

## Triggers

| Origem | Ação |
|--------|------|
| Categorias | Botão "+ Nova categoria" |
| Categorias | Ícone `Pencil` no card da categoria (modo editar) |

---

## Layout

```
┌─────────────────────────────────────┐
│ Nova categoria                  [X] │
│ Organize suas transações com        │
│ categorias                          │
│                                     │
│  Título                             │
│  [ Ex. Alimentação              ]   │
│                                     │
│  Descrição              Opcional    │
│  [ Descrição da categoria       ]   │
│                                     │
│  Ícone                              │
│  ┌──┬──┬──┬──┬──┬──┬──┬──┐         │
│  │  │  │  │  │  │  │  │  │  (grid) │
│  └──┴──┴──┴──┴──┴──┴──┴──┘         │
│                                     │
│  Cor                                │
│  ( ● )( ● )( ● )( ● )( ● )( ● )( ● )│
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
| Título | "Nova categoria" | "Editar categoria" |
| Subtítulo | "Organize suas transações com categorias" | "Atualize os dados da categoria" |
| Fechar | Ícone `X` — canto superior direito, fecha sem salvar |

---

## Campos do formulário

### Título

| Propriedade | Valor |
|-------------|-------|
| Label | "Título" |
| Placeholder | "Ex. Alimentação" |
| Tipo | `text` |
| Obrigatório | Sim |

### Descrição

| Propriedade | Valor |
|-------------|-------|
| Label | "Descrição" + badge "Opcional" (`gray-400`) |
| Placeholder | "Descrição da categoria" |
| Tipo | `text` ou `textarea` (single line no Figma) |
| Obrigatório | Não |

### Ícone

Grid selecionável de ícones Lucide (2 linhas × 8 colunas = 16 opções).

| Estado | Estilo |
|--------|--------|
| Selecionado | Borda `brand-base`, fundo `green-light` |
| Não selecionado | Borda `gray-300`, fundo `white` |
| Hover | Borda `gray-400` |

**Ícones disponíveis no Figma:**

| # | Ícone Lucide | Uso sugerido |
|---|-------------|--------------|
| 1 | `Briefcase` | Trabalho, Salário |
| 2 | `Car` | Transporte |
| 3 | `HeartPulse` | Saúde |
| 4 | `PiggyBank` | Investimento |
| 5 | `ShoppingCart` | Mercado |
| 6 | `Ticket` | Entretenimento |
| 7 | `Gift` | Presentes |
| 8 | `Utensils` | Alimentação |
| 9 | `PawPrint` | Pet |
| 10 | `Home` | Casa, Utilidades |
| 11 | `Package` | Compras |
| 12 | `Dumbbell` | Academia |
| 13 | `Book` | Educação |
| 14 | `ShoppingBag` | Compras |
| 15 | `Wallet` | Finanças |
| 16 | `Clipboard` | Outros |

Default ao abrir (criar): primeiro ícone (`Briefcase`) ou nenhum selecionado até o
usuário escolher — **obrigatório selecionar um**.

### Cor

Seletor de cor com círculos clicáveis (7 opções).

| Cor | Token | Círculo |
|-----|-------|---------|
| Verde | `green` | `#16A34A` |
| Azul | `blue` | `#2563EB` |
| Roxo | `purple` | `#9333EA` |
| Rosa | `pink` | `#DB2777` |
| Vermelho | `red` | `#DC2626` |
| Laranja | `orange` | `#EA580C` |
| Amarelo | `yellow` | `#CA8A04` |

| Estado | Estilo |
|--------|--------|
| Selecionado | Anel/borda `brand-base` ao redor do círculo |
| Não selecionado | Apenas o círculo colorido |

Default ao abrir (criar): **verde** selecionado.

---

## Ação principal

| Botão | Variante | Ação |
|-------|----------|------|
| **Salvar** | Primary (`brand-base`, full-width) | Submete formulário |

Modo criar → `createCategory`  
Modo editar → `updateCategory`

---

## Comportamento

| Cenário | Resultado |
|---------|-----------|
| Abrir (criar) | Formulário vazio, cor verde e ícone default selecionados |
| Abrir (editar) | Campos pré-preenchidos com dados da categoria |
| Salvar válido | Fecha modal, atualiza grid de categorias, toast de sucesso |
| Salvar inválido | Validação inline (título obrigatório, ícone e cor obrigatórios) |
| Fechar (X) ou overlay | Descarta alterações, fecha modal |
| Nome duplicado | Erro da API (categoria com mesmo nome para o usuário) |

---

## Integração GraphQL

### Criar

```graphql
mutation CreateCategory($data: CreateCategoryInput!) {
  createCategory(data: $data) {
    id
    name
    description
    color
    icon
  }
}
```

### Editar

```graphql
mutation UpdateCategory($id: String!, $data: UpdateCategoryInput!) {
  updateCategory(id: $id, data: $data) {
    id
    name
    description
    color
    icon
  }
}
```

**Input sugerido:**

```typescript
type CategoryColor =
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red'
  | 'orange'
  | 'yellow'

type CreateCategoryInput = {
  name: string
  description?: string
  icon: string       // nome do ícone Lucide (ex.: "Utensils")
  color: CategoryColor
}

type UpdateCategoryInput = {
  name?: string
  description?: string
  icon?: string
  color?: CategoryColor
}
```

---

## Validação (Zod sugerido)

```typescript
const categorySchema = z.object({
  name: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  icon: z.string().min(1, 'Selecione um ícone'),
  color: z.enum(['green', 'blue', 'purple', 'pink', 'red', 'orange', 'yellow']),
})
```

---

## Estrutura de arquivos sugerida

```text
frontend/src/
├── components/
│   └── CategoryFormDialog.tsx    # reutilizável
├── pages/Categories/components/
│   ├── CategoryCard.tsx
│   └── CategoryFormDialog.tsx    # ou import de components/
└── lib/graphql/mutations/
    └── Category.ts
```

## Componentes utilizados

| Componente | Origem |
|------------|--------|
| `Dialog` | Shadcn/ui |
| `Input` | Style Guide §5.1 |
| `Button` (primary) | Style Guide §5.2 |
| `IconPicker` | Componente custom (grid de ícones) |
| `ColorPicker` | Componente custom (círculos de cor) |
| `Badge` "Opcional" | Shadcn/ui ou span estilizado |

## Preview no card

Após seleção, ícone e cor devem refletir no `CategoryCard` da listagem:
- Fundo do ícone: `{color}-light`
- Ícone: `{color}-base`
- Tag: Style Guide §5.6

## Referências

- Categorias: [categories.md](./categories.md)
- Modal transação: [transaction-form-modal.md](./transaction-form-modal.md)
- Style Guide: `../style-guide.md`
