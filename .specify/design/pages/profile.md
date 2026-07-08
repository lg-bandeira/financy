# Página — Perfil

> Rota: `/profile`
> Figma extraído em 2026-07-08

## Visão geral

Tela de gestão do perfil do usuário autenticado. Permite editar o nome, visualizar o
e-mail (somente leitura) e encerrar a sessão. Acessada pelo clique no avatar do header.

## Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [Logo]         Dashboard  Transações  Categorias           [CT]  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│              ┌─────────────────────┐                             │
│              │       [CT]          │                             │
│              │    Conta teste      │                             │
│              │  conta@teste.com    │                             │
│              │                     │                             │
│              │  Nome completo      │                             │
│              │  [input]            │                             │
│              │  E-mail             │                             │
│              │  [input disabled]   │                             │
│              │  O e-mail não pode  │                             │
│              │  ser alterado       │                             │
│              │                     │                             │
│              │ [ Salvar alterações]│                             │
│              │ [ Sair da conta  ]  │                             │
│              └─────────────────────┘                             │
└──────────────────────────────────────────────────────────────────┘
```

| Propriedade | Valor |
|-------------|-------|
| **Background** | `gray-100` |
| **Card** | Fundo `white`, border-radius ~12px, sombra suave, centralizado |
| **Largura do card** | ~400px (max-width responsivo) |
| **Header** | Navegação global (mesma das demais páginas autenticadas) |

---

## Cabeçalho do card

| Elemento | Detalhes |
|----------|----------|
| **Avatar** | Círculo grande (~80px), fundo `gray-300`, iniciais do nome em branco |
| **Nome** | Ex.: "Conta teste" — `gray-800`, bold, ~20px, centralizado |
| **E-mail** | Ex.: "conta@teste.com" — `gray-500`, ~14px, centralizado |

Iniciais derivadas do nome (ex.: "Conta teste" → **CT**).

---

## Formulário

### Nome completo

| Propriedade | Valor |
|-------------|-------|
| Label | "Nome completo" |
| Ícone à esquerda | `User` (Lucide) |
| Valor | Nome atual do usuário |
| Estado | Editável |
| Obrigatório | Sim |

### E-mail

| Propriedade | Valor |
|-------------|-------|
| Label | "E-mail" |
| Ícone à esquerda | `Mail` (Lucide) |
| Valor | E-mail atual do usuário |
| Estado | **Desabilitado** (readonly) |
| Helper text | "O e-mail não pode ser alterado" — `gray-500`, ~12px |

---

## Ações

| Botão | Variante | Ícone | Ação |
|-------|----------|-------|------|
| **Salvar alterações** | Primary (`brand-base`, full-width) | — | Submete → mutation `updateUser` (apenas `name`) |
| **Sair da conta** | Secondary (outline, full-width) | `LogOut` em `danger` | Limpa store + Apollo cache → redireciona `/login` |

---

## Comportamento

| Cenário | Resultado |
|---------|-----------|
| Usuário não autenticado | Redireciona para `/login` |
| Acesso via avatar | Header abre menu ou navega direto para `/profile` |
| Salvar com nome válido | Atualiza user no store e exibe feedback de sucesso |
| Salvar com nome vazio | Validação inline (campo em `danger`) |
| E-mail | Nunca editável na UI |
| Sair da conta | `logout()` no auth store, `apolloClient.clearStore()`, redirect `/login` |
| Nome alterado | Avatar no header atualiza iniciais se derivadas do nome |

---

## Integração GraphQL

### Query — dados do usuário

```graphql
query GetProfile {
  getUser(id: $userId) {
    id
    name
    email
  }
}
```

> Pode reutilizar o user já persistido no Zustand após login, sem query adicional.

### Mutation — atualizar nome

```graphql
mutation UpdateProfile($id: String!, $data: UpdateUserInput!) {
  updateUser(id: $id, data: $data) {
    id
    name
    email
  }
}
```

**Input:**

```typescript
type UpdateUserInput = {
  name?: string
  // email NÃO enviado — imutável
}
```

---

## Estrutura de arquivos sugerida

```text
frontend/src/
├── pages/
│   └── Profile/
│       └── index.tsx
├── components/
│   └── Header.tsx          # menu do avatar → /profile
└── lib/graphql/mutations/
    └── User.ts
```

## Componentes utilizados

| Componente | Origem |
|------------|--------|
| `Header` / `Layout` | Nav global |
| `Avatar` | Shadcn/ui (grande + pequeno no header) |
| `Input` | Style Guide §5.1 |
| `Button` (primary/secondary) | Style Guide §5.2 |
| `Label` | Shadcn/ui |

## Validação (Zod sugerido)

```typescript
const profileSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
})
```

## Referências

- Login: [login.md](./login.md)
- Style Guide: `../style-guide.md`
- Auth store: padrão Mindshare `stores/auth.ts`
