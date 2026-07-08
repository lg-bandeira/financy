# Página — Login

> Rota: `/login` (ou `/` quando deslogado, conforme requisitos)
> Figma extraído em 2026-07-08

## Visão geral

Tela de autenticação centralizada com card branco sobre fundo claro. Usuário deslogado
acessa esta página para entrar na conta. Após login bem-sucedido, redireciona para o
Dashboard (`/`).

## Layout

```
┌─────────────────────────────────────────────┐
│              [Logo FINANCY]                 │
│                                             │
│         ┌─────────────────────┐               │
│         │   Fazer login       │               │
│         │   Subtítulo         │               │
│         │                     │               │
│         │   E-mail            │               │
│         │   [input]           │               │
│         │   Senha             │               │
│         │   [input]           │               │
│         │                     │               │
│         │ ☐ Lembrar-me  Recuperar senha      │
│         │                     │               │
│         │   [ Entrar ]        │               │
│         │                     │               │
│         │   ─── ou ───        │               │
│         │                     │               │
│         │ Ainda não tem conta?│               │
│         │   [ Criar conta ]   │               │
│         └─────────────────────┘               │
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
| Título | "Fazer login" | `gray-800`, bold, ~24px |
| Subtítulo | "Entre na sua conta para continuar" | `gray-500`, regular, ~14px |

### Campos do formulário

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
| Tipo | `password` (alternável para `text`) |
| Obrigatório | Sim |

### Linha de opções

| Elemento | Posição | Comportamento |
|----------|---------|---------------|
| Checkbox "Lembrar-me" | Esquerda | Persiste sessão/token localmente (opcional) |
| Link "Recuperar senha" | Direita | **Fora de escopo v1** — pode ser link desabilitado ou omitido |

Link "Recuperar senha" usa estilo **Link** (`brand-base`, sublinhado no hover).

### Ações

| Botão | Variante | Ícone | Ação |
|-------|----------|-------|------|
| **Entrar** | Primary (`brand-base`, full-width) | — | Submete formulário → mutation `login` |
| **Criar conta** | Secondary (outline, full-width) | `UserPlus` | Navega para `/signup` |

### Separador

Texto "ou" centralizado entre duas linhas `gray-200`.

### Texto auxiliar

"Ainda não tem uma conta?" — `gray-500`, centralizado, acima do botão Criar conta.

## Comportamento

| Cenário | Resultado |
|---------|-----------|
| Login com credenciais válidas | Salva token + user no store (Zustand), redireciona para `/` |
| Login com credenciais inválidas | Exibe erro (toast ou mensagem no formulário) |
| Usuário já autenticado | Redireciona para `/` (rota protegida inversa) |
| Submit com campos vazios | Validação inline (label/ícone em `danger`) |
| Toggle senha | Alterna tipo do input e ícone Eye/EyeOff |

## Integração GraphQL

```graphql
mutation Login($data: LoginInput!) {
  login(data: $data) {
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
type LoginInput = {
  email: string
  password: string
}
```

## Estrutura de arquivos sugerida

```text
frontend/src/
├── pages/
│   └── Auth/
│       └── Login.tsx
├── lib/graphql/mutations/
│   └── Login.ts
└── stores/
    └── auth.ts
```

## Componentes utilizados

| Componente | Origem |
|------------|--------|
| `Input` | Style Guide §5.1 |
| `Button` (primary/secondary) | Style Guide §5.2 |
| `Checkbox` | Shadcn/ui |
| `Label` | Shadcn/ui |
| Logo | `frontend/src/assets/` |

## Validação (Zod sugerido)

```typescript
const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})
```

## Referências

- Style Guide: `../style-guide.md`
- Padrão Mindshare: `ftr-pos-360-mindshare/frontend/src/pages/Auth/Login.tsx`
