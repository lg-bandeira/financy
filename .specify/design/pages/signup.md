# Página — Cadastro (Registro)

> Rota: `/signup`
> Figma extraído em 2026-07-08

## Visão geral

Tela de criação de conta com card branco centralizado sobre fundo claro. Espelha o layout
da página de login. Após cadastro bem-sucedido, autentica o usuário e redireciona para o
Dashboard (`/`).

## Layout

```
┌─────────────────────────────────────────────┐
│              [Logo FINANCY]                 │
│                                             │
│         ┌─────────────────────┐             │
│         │   Criar conta       │             │
│         │   Subtítulo         │             │
│         │                     │             │
│         │   Nome completo     │             │
│         │   [input]           │             │
│         │   E-mail            │             │
│         │   [input]           │             │
│         │   Senha             │             │
│         │   [input]           │             │
│         │   Helper: min 8     │             │
│         │                     │             │
│         │   [ Cadastrar ]     │             │
│         │                     │             │
│         │   ─── ou ───        │             │
│         │                     │             │
│         │ Já tem uma conta?   │             │
│         │   [ Fazer login ]   │             │
│         └─────────────────────┘             │
└─────────────────────────────────────────────┘
```

| Propriedade | Valor |
|-------------|-------|
| **Background da página** | `gray-100` (`#F8F9FA`) |
| **Card** | Fundo `white`, border-radius ~12px, sombra suave |
| **Largura do card** | ~400px (max-width responsivo) |
| **Alinhamento** | Centralizado vertical e horizontalmente |
| **Logo** | Acima do card, centralizado (ícone + "FINANCY") |

## Conteúdo

### Cabeçalho do card

| Elemento | Texto | Estilo |
|----------|-------|--------|
| Título | "Criar conta" | `gray-800`, bold, ~24px |
| Subtítulo | "Comece a controlar suas finanças ainda hoje" | `gray-500`, regular, ~14px |

### Campos do formulário

#### Nome completo

| Propriedade | Valor |
|-------------|-------|
| Label | "Nome completo" |
| Ícone à esquerda | `User` (Lucide) |
| Placeholder | "Seu nome completo" |
| Tipo | `text` |
| Obrigatório | Sim |

#### E-mail

| Propriedade | Valor |
|-------------|-------|
| Label | "E-mail" |
| Ícone à esquerda | `Mail` (Lucide) |
| Placeholder | `mail@exemplo.com` |
| Tipo | `email` |
| Obrigatório | Sim |

#### Senha

| Propriedade | Valor |
|-------------|-------|
| Label | "Senha" |
| Ícone à esquerda | `Lock` (Lucide) |
| Ícone à direita | `Eye` / `EyeOff` (toggle visibilidade) |
| Placeholder | "Digite sua senha" |
| Helper text | "A senha deve ter no mínimo 8 caracteres" |
| Tipo | `password` (alternável para `text`) |
| Obrigatório | Sim |
| Validação | Mínimo 8 caracteres |

### Ações

| Botão | Variante | Ícone | Ação |
|-------|----------|-------|------|
| **Cadastrar** | Primary (`brand-base`, full-width) | — | Submete formulário → mutation `register` |
| **Fazer login** | Secondary (outline, full-width) | `LogIn` | Navega para `/login` |

### Separador

Texto "ou" centralizado entre duas linhas `gray-200`.

### Texto auxiliar

"Já tem uma conta?" — `gray-500`, centralizado, acima do botão Fazer login.

## Comportamento

| Cenário | Resultado |
|---------|-----------|
| Cadastro com dados válidos | Salva token + user no store (Zustand), redireciona para `/` |
| E-mail já cadastrado | Exibe erro retornado pela API |
| Senha com menos de 8 caracteres | Validação inline (label/ícone em `danger`) |
| Usuário já autenticado | Redireciona para `/` (rota pública inversa) |
| Submit com campos vazios | Validação inline nos campos obrigatórios |
| Toggle senha | Alterna tipo do input e ícone Eye/EyeOff |

## Integração GraphQL

```graphql
mutation Register($data: RegisterInput!) {
  register(data: $data) {
    token
    refreshToken
    user {
      id
      name
      email
    }
  }
}
```

**Input:**

```typescript
type RegisterInput = {
  name: string
  email: string
  password: string
}
```

## Estrutura de arquivos sugerida

```text
frontend/src/
├── pages/
│   └── Auth/
│       └── Signup.tsx
├── lib/graphql/mutations/
│   └── Register.ts
└── stores/
    └── auth.ts
```

## Componentes utilizados

| Componente | Origem |
|------------|--------|
| `Input` | Style Guide §5.1 |
| `Button` (primary/secondary) | Style Guide §5.2 |
| `Label` | Shadcn/ui |
| Logo | `frontend/src/assets/` |

## Validação (Zod sugerido)

```typescript
const registerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})
```

## Referências

- Página relacionada: [login.md](./login.md)
- Style Guide: `../style-guide.md`
- Padrão Mindshare: `ftr-pos-360-mindshare/frontend/src/pages/Auth/Signup.tsx`
