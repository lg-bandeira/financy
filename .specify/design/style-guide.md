# Financy — Style Guide (Figma)

> Fonte de verdade visual para implementação do frontend.
> Extraído do Figma em 2026-07-08.

## 1. Cores

### Brand

| Token | Hex | Uso |
|-------|-----|-----|
| `brand-dark` | `#124B2B` | Hover de botões primários, estados ativos escuros |
| `brand-base` | `#1F6F43` | Botões primários, links, label ativo de input |

### Grayscale

| Token | Hex | Uso |
|-------|-----|-----|
| `gray-800` | `#111827` | Texto principal |
| `gray-700` | `#374151` | Texto secundário |
| `gray-600` | `#4B5563` | Texto terciário |
| `gray-500` | `#6B7280` | Placeholders, helper text |
| `gray-400` | `#9CA3AF` | Bordas, ícones inativos |
| `gray-300` | `#D1D5DB` | Bordas de input |
| `gray-200` | `#E5E7EB` | Divisores, bordas suaves |
| `gray-100` | `#F8F9FA` | Backgrounds claros |

### Neutros

| Token | Hex |
|-------|-----|
| `black` | `#000000` |
| `white` | `#FFFFFF` |

### Feedback

| Token | Hex | Uso |
|-------|-----|-----|
| `danger` | `#EF4444` | Erros, saídas, ícone de exclusão |
| `success` | `#19AD70` | Sucesso, entradas |

### Paleta estendida (categorias e tags)

Cada cor possui variante `dark`, `base` e `light` para tags e ícones de categoria.

| Cor | dark | base | light |
|-----|------|------|-------|
| Blue | `#1D4ED8` | `#2563EB` | `#DBEAFE` |
| Purple | `#7E22CE` | `#9333EA` | `#F3E8FF` |
| Pink | `#BE185D` | `#DB2777` | `#FCE7F3` |
| Red | `#B91C1C` | `#DC2626` | `#FEE2E2` |
| Orange | `#C2410C` | `#EA580C` | `#FFEDD5` |
| Yellow | `#A16207` | `#CA8A04` | `#F7F3CA` |
| Green | `#15803D` | `#16A34A` | `#E0FAE9` |
| Gray | — | — | `#F3F4F6` (fundo) / `#374151` (texto) |

### Mapeamento Tailwind sugerido

```js
// tailwind.config.js — extend.colors
brand: { dark: '#124B2B', base: '#1F6F43' },
danger: '#EF4444',
success: '#19AD70',
```

---

## 2. Tipografia

| Propriedade | Valor |
|-------------|-------|
| **Fonte** | [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts) |
| **Pesos usados** | Regular (400), Medium (500), SemiBold (600), Bold (700) |

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

---

## 3. Ícones

| Propriedade | Valor |
|-------------|-------|
| **Biblioteca** | [Lucide Icons](https://lucide.dev/) (`lucide-react`) |
| **Estilo** | Outline, stroke consistente |

### Ícones mapeados por contexto

| Contexto | Ícone Lucide |
|----------|-------------|
| E-mail | `Mail` |
| Senha | `Lock` |
| Usuário | `User` |
| Cadastro | `UserPlus` |
| Login | `LogIn` |
| Logout | `LogOut` |
| Mostrar/ocultar senha | `Eye` / `EyeOff` |
| Finanças | `PiggyBank`, `Wallet` |
| Entrada | `ArrowDownCircle` |
| Saída | `ArrowUpCircle` |
| Transações | `ArrowUpDown` |
| Trabalho | `Briefcase` |
| Alimentação | `Utensils` |
| Compras | `ShoppingCart` |
| Transporte | `Car` |
| Saúde | `HeartPulse` |
| Lazer | `Ticket` |
| Presente | `Gift` |
| Busca | `Search` |
| Categoria | `Tag` |
| Educação | `Book` |
| Academia | `Dumbbell` |
| Casa | `Home` |
| Pet | `PawPrint` |
| Editar | `Pencil` |
| Excluir | `Trash2` |
| Fechar | `X` |
| Adicionar | `Plus` |
| Navegação | `ChevronLeft`, `ChevronRight`, `ChevronDown`, `ChevronUp` |
| Dashboard | `LayoutDashboard` |
| Documento | `FileText` |
| Confirmar | `Check` |

---

## 4. Logo e identidade visual

| Elemento | Especificação |
|----------|--------------|
| **Wordmark** | "FINANCY" em caixa alta, fonte Inter Bold |
| **Ícone** | Duas moedas sobrepostas |
| **Cor do logo** | `brand-base` (`#1F6F43`) |
| **Variações** | Ícone isolado + wordmark horizontal |

Arquivos de logo devem ficar em `frontend/src/assets/`.

---

## 5. Componentes

### 5.1 Input

Estrutura: **Label** → **Campo** (ícone à esquerda + texto) → **Helper text**

| Estado | Label | Ícone | Borda | Texto |
|--------|-------|-------|-------|-------|
| Empty | `gray-800` | `gray-400` | `gray-300` | Placeholder `gray-500` |
| Active (foco) | `brand-base` | `brand-base` | `gray-300` | `gray-800` |
| Filled | `gray-800` | `gray-800` | `gray-300` | `gray-800` |
| Error | `danger` | `danger` | `gray-300` | `gray-800` |
| Disabled | `gray-400` | `gray-400` | `gray-300` | `gray-400` (opacidade reduzida) |

**Select (dropdown):**
- Mesma estrutura do input + ícone `ChevronDown` à direita
- Menu flutuante: fundo branco, sombra suave, border-radius
- Item selecionado: ícone `Check` verde (`brand-base`) à direita

**Implementação:** Shadcn `Input`, `Select`, `Label` customizados com tokens acima.

### 5.2 Label Button (com ícone + texto)

| Variante | Default | Hover | Disabled |
|----------|---------|-------|----------|
| **Primary** | Fundo `brand-base`, texto branco | Fundo `brand-dark` | Fundo verde acinzentado, opacidade reduzida |
| **Secondary** | Fundo branco, borda `gray-300`, texto `gray-800` | Fundo `gray-100` | Borda e texto `gray-400` |

**Tamanhos:**

| Size | Uso |
|------|-----|
| `md` | Ações principais (formulários, CTAs) |
| `sm` | Ações secundárias, toolbars |

### 5.3 Icon Button

| Estado | Aparência |
|--------|-----------|
| Default | Ícone `gray-800`, fundo transparente |
| Hover | Fundo `gray-100` arredondado |
| Disabled | Ícone `gray-400` |

**Variantes:**
- Neutro: ícone `gray-800` (ex.: editar)
- Destrutivo: ícone `danger` (ex.: `Trash2`)

### 5.4 Link

| Estado | Aparência |
|--------|-----------|
| Default | Texto `brand-base`, sem sublinhado |
| Hover | Texto `brand-base` + sublinhado |

### 5.5 Pagination Button

Botão quadrado com cantos levemente arredondados.

| Estado | Fundo | Borda | Texto |
|--------|-------|-------|-------|
| Default | `white` | `gray-300` | `gray-800` |
| Hover | `gray-100` | `gray-300` | `gray-800` |
| Active | `brand-base` | — | `white` |
| Disabled | `white` | `gray-200` | `gray-400` |

### 5.6 Tag (categorias)

Formato pill (border-radius total). Fundo `*-light`, texto `*-base`.

| Variante | Fundo | Texto |
|----------|-------|-------|
| Gray | `#F3F4F6` | `gray-700` |
| Blue | `blue-light` | `blue-base` |
| Purple | `purple-light` | `purple-base` |
| Pink | `pink-light` | `pink-base` |
| Red | `red-light` | `red-base` |
| Orange | `orange-light` | `orange-base` |
| Yellow | `yellow-light` | `yellow-dark` |
| Green | `green-light` | `green-base` |

### 5.7 Type (tipo de transação)

| Tipo | Ícone | Cor |
|------|-------|-----|
| **Entrada** | Círculo com `+` (`ArrowDownCircle` ou círculo custom) | `success` (`#19AD70`) |
| **Saída** | Círculo com `-` (`ArrowUpCircle` ou círculo custom) | `danger` (`#EF4444`) |

---

## 6. Ordem de implementação

Conforme constitution e Figma:

1. Configurar Tailwind com tokens de cor e fonte Inter
2. Instalar Shadcn/ui e Lucide React
3. Criar componentes base: `Button`, `Input`, `Select`, `Tag`, `Link`, `Pagination`
4. Adicionar logo e assets em `frontend/src/assets/`
5. Só então implementar páginas

---

## 7. Páginas

Documentação detalhada de cada tela em `.specify/design/pages/`:

| Página | Arquivo | Rota |
|--------|---------|------|
| Login | [pages/login.md](./pages/login.md) | `/login` |
| Cadastro | [pages/signup.md](./pages/signup.md) | `/signup` |
| Dashboard | [pages/dashboard.md](./pages/dashboard.md) | `/` |
| Transações | [pages/transactions.md](./pages/transactions.md) | `/transactions` |
| Categorias | [pages/categories.md](./pages/categories.md) | `/categories` |
| Perfil | [pages/profile.md](./pages/profile.md) | `/profile` |

Ver índice completo em [pages/README.md](./pages/README.md).

---

## 8. Referências

- Constitution: `.specify/memory/constitution.md`
- Frontend de referência (padrões): `ftr-pos-360-mindshare/frontend`
- Shadcn components: https://ui.shadcn.com/
