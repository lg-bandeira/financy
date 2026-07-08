# Feature Specification: Financy — Personal Finance Management

**Feature Branch**: `001-financy-app`

**Created**: 2026-07-08

**Status**: Draft

**Input**: User description: "Full-stack personal finance application (Financy) enabling users to organize finances through transaction and category management, with account registration/login, data isolation per user, dashboard overview, and UI aligned to Figma design system."

**Design references**: `.specify/design/style-guide.md`, `.specify/design/pages/`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Account Access (Priority: P1)

A new user wants to create an account and sign in so they can securely manage their personal
finances. Returning users want to access their existing data with email and password.

**Why this priority**: Without authentication, no personal data can be stored or retrieved.
This is the foundation for all other functionality.

**Independent Test**: Can be fully tested by registering a new account, signing out, signing
back in, and confirming the session grants access to protected areas while unauthenticated
users are redirected to the login screen.

**Acceptance Scenarios**:

1. **Given** a visitor on the login page, **When** they submit valid credentials, **Then**
   they are signed in and redirected to the dashboard.
2. **Given** a visitor on the registration page, **When** they submit a unique email, name,
   and password (minimum 8 characters), **Then** an account is created, they are signed in,
   and redirected to the dashboard.
3. **Given** a visitor submitting an already-registered email, **When** they attempt
   registration, **Then** the system displays a clear error and does not create a duplicate
   account.
4. **Given** a signed-in user, **When** they sign out, **Then** their session ends and they
   are redirected to the login page.
5. **Given** an unauthenticated visitor, **When** they attempt to access protected pages,
   **Then** they are redirected to the login page.

---

### User Story 2 - Category Organization (Priority: P2)

A signed-in user wants to create and manage categories (e.g., Food, Transport, Salary) so
they can classify their income and expenses consistently.

**Why this priority**: Categories are required to meaningfully organize transactions. Users
should define their classification structure before or alongside recording transactions.

**Independent Test**: Can be fully tested by creating, editing, and deleting categories,
verifying each operation reflects immediately in the category list and that only the
authenticated user's categories are visible.

**Acceptance Scenarios**:

1. **Given** a signed-in user on the categories page, **When** they create a category with
   a title, optional description, icon, and color, **Then** the new category appears in the
   category grid.
2. **Given** an existing category, **When** the user edits its title, description, icon, or
   color, **Then** the updated information is saved and displayed.
3. **Given** an existing category with no linked transactions, **When** the user deletes it,
   **Then** the category is removed from the list.
4. **Given** an existing category with linked transactions, **When** the user attempts to
   delete it, **Then** the system prevents deletion and explains that the category is in
   use.
5. **Given** two different user accounts, **When** each views their categories, **Then**
   each sees only their own categories.

---

### User Story 3 - Transaction Recording (Priority: P3)

A signed-in user wants to record income and expenses with description, date, amount, and
category so they can track their financial activity.

**Why this priority**: Recording transactions is the core value proposition of the
application — turning category structure into actionable financial data.

**Independent Test**: Can be fully tested by creating, editing, and deleting transactions
of both types (income and expense), verifying amounts and categories are stored correctly
and only visible to the owning user.

**Acceptance Scenarios**:

1. **Given** a signed-in user with at least one category, **When** they create a transaction
   with description, date, amount, type (income or expense), and category, **Then** the
   transaction is saved and appears in their transaction list.
2. **Given** an existing transaction, **When** the user edits any field, **Then** the
   updated transaction is saved and reflected in listings.
3. **Given** an existing transaction, **When** the user deletes it, **Then** it is removed
   from all views and summaries.
4. **Given** a user creating a transaction, **When** they leave required fields empty or
   enter a zero/negative amount, **Then** the system displays validation errors and does
   not save.
5. **Given** two different user accounts, **When** each views their transactions, **Then**
   each sees only their own transactions.

---

### User Story 4 - Financial Dashboard (Priority: P4)

A signed-in user wants a dashboard showing their balance, monthly income, monthly expenses,
recent transactions, and top spending categories so they can understand their financial
position at a glance.

**Why this priority**: The dashboard aggregates existing data into actionable insight. It
depends on transactions and categories but delivers the primary "overview" experience after
core data entry is available.

**Independent Test**: Can be fully tested by signing in with existing transactions and
verifying summary cards, recent transaction list (up to 5 items), and category breakdown
display correct calculated values for the current month.

**Acceptance Scenarios**:

1. **Given** a signed-in user with transactions in the current month, **When** they open the
   dashboard, **Then** they see total balance, monthly income total, and monthly expense
   total calculated from their data.
2. **Given** a signed-in user with transactions, **When** they view the dashboard, **Then**
   they see up to 5 most recent transactions with description, date, category, type, and
   amount.
3. **Given** a signed-in user with categorized expenses, **When** they view the dashboard,
   **Then** they see a category breakdown with item count and total spent per category.
4. **Given** a signed-in user with no transactions, **When** they view the dashboard,
   **Then** they see empty states with a clear prompt to create their first transaction.
5. **Given** a signed-in user on the dashboard, **When** they click "New transaction",
   **Then** the transaction creation form opens.

---

### User Story 5 - Transaction Discovery (Priority: P5)

A signed-in user wants to browse, search, and filter all their transactions so they can find
specific records across time periods and categories.

**Why this priority**: As transaction volume grows, list management and filtering become
essential for day-to-day use beyond the dashboard's recent-items view.

**Independent Test**: Can be fully tested by loading the transactions page with multiple
records, applying search and filter combinations, and verifying only matching transactions
appear with correct pagination.

**Acceptance Scenarios**:

1. **Given** a signed-in user with transactions, **When** they open the transactions page,
   **Then** they see a paginated table with description, date, category, type, amount, and
   edit/delete actions.
2. **Given** the transactions page, **When** the user searches by description, **Then** only
   matching transactions are displayed.
3. **Given** the transactions page, **When** the user filters by type (income/expense),
   category, or time period, **Then** only matching transactions are displayed.
4. **Given** multiple pages of results, **When** the user navigates pages, **Then** the
   system shows the correct range (e.g., "1 to 10 | 27 results") and loads the
   corresponding records.
5. **Given** the transactions page, **When** the user clicks "New transaction" or the edit
   icon on a row, **Then** the appropriate transaction form opens.

---

### User Story 6 - Profile Management (Priority: P6)

A signed-in user wants to view and update their display name and sign out from their profile
page so they can maintain their account information.

**Why this priority**: Profile management is important but not blocking for core financial
tracking. Email is read-only; only name editing is required.

**Independent Test**: Can be fully tested by navigating to the profile page, updating the
display name, verifying the change persists, and signing out successfully.

**Acceptance Scenarios**:

1. **Given** a signed-in user, **When** they open their profile via the header avatar,
   **Then** they see their name, email, and an editable name field.
2. **Given** the profile page, **When** the user views their email, **Then** it is displayed
   as read-only with a message that email cannot be changed.
3. **Given** the profile page, **When** the user updates their name and saves, **Then** the
   new name is persisted and reflected in the header avatar initials.
4. **Given** the profile page, **When** the user clicks "Sign out", **Then** the session
   ends and they are redirected to the login page.

---

### Edge Cases

- What happens when a user registers with an invalid email format? System rejects with a
  clear validation message.
- What happens when login credentials are incorrect? System displays a generic error without
  revealing whether the email exists.
- What happens when a user has no categories and tries to create a transaction? System
  prompts them to create a category first or shows an empty category selector with guidance.
- What happens when filters return no transactions? System displays an empty state message.
- What happens when the user clears all filters? Full transaction list is restored.
- What happens when monthly calculations span month boundaries? Only transactions within the
  selected/current calendar month are included in monthly summaries.
- What happens when two categories share the same name for one user? System rejects duplicate
  category names per user.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow visitors to create an account with full name, email, and
  password (minimum 8 characters).
- **FR-002**: System MUST allow registered users to sign in with email and password.
- **FR-003**: System MUST maintain authenticated sessions so users remain signed in across
  page navigation until they sign out or the session expires.
- **FR-004**: System MUST restrict access to all financial data pages to authenticated users
  only.
- **FR-005**: System MUST ensure each user can view and manage only their own transactions
  and categories.
- **FR-006**: System MUST allow users to create categories with a title, optional description,
  icon, and color.
- **FR-007**: System MUST allow users to list, edit, and delete their categories.
- **FR-008**: System MUST prevent deletion of categories that have linked transactions.
- **FR-009**: System MUST allow users to create transactions with description, date, amount,
  type (income or expense), and category.
- **FR-010**: System MUST allow users to list, edit, and delete their transactions.
- **FR-011**: System MUST validate that transaction amounts are greater than zero.
- **FR-012**: System MUST display a dashboard with total balance, monthly income, monthly
  expenses, recent transactions (up to 5), and category spending summary.
- **FR-013**: System MUST provide a transactions page with search by description and filters
  by type, category, and time period.
- **FR-014**: System MUST paginate transaction lists showing the current range and total
  result count.
- **FR-015**: System MUST allow users to update their display name from the profile page.
- **FR-016**: System MUST display user email as read-only on the profile page.
- **FR-017**: System MUST allow users to sign out from the profile page.
- **FR-018**: System MUST present monetary values in Brazilian Real format (R$).
- **FR-019**: System MUST follow the visual design defined in the Figma Style Guide and page
  specifications (colors, typography, components, layout).
- **FR-020**: System MUST provide `.env.example` files documenting required configuration
  for backend and frontend deployments.

### Key Entities

- **User**: Person who owns an account. Attributes: name, email, password (stored securely,
  never displayed). Owns categories and transactions.
- **Category**: Classification label for transactions. Attributes: title, optional description,
  icon, color. Belongs to one user. Referenced by many transactions.
- **Transaction**: Financial record. Attributes: description, date, amount, type (income or
  expense). Belongs to one user and one category.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user can complete registration and land on the dashboard in under 2
  minutes.
- **SC-002**: A signed-in user can create a transaction (with existing category) in under
  1 minute.
- **SC-003**: 100% of data access attempts by authenticated users return only their own
  transactions and categories (no cross-user data leakage).
- **SC-004**: Dashboard summary values match the sum of the user's transactions for the
  displayed period.
- **SC-005**: Search and filter operations on the transactions page return correct results
  within 2 seconds for lists up to 1,000 transactions per user.
- **SC-006**: All 7 pages and 2 modals match the approved Figma layouts (login, registration,
  dashboard, transactions, categories, profile, transaction form, category form).
- **SC-007**: 90% of users successfully complete their primary task (record a transaction)
  on first attempt without assistance.

## Assumptions

- Users access the application via a modern web browser with internet connectivity.
- Single-user personal finance scope — no shared accounts, family plans, or multi-tenant
  organizations in v1.
- Email/password is the only authentication method; password recovery and OAuth are out of
  scope for v1.
- "Remember me" on login is optional and persists session locally when selected.
- Balance on the dashboard represents net position (monthly income minus monthly expenses)
  for the current calendar month unless otherwise specified in design.
- Currency is Brazilian Real (BRL) only; multi-currency support is out of scope.
- Category icons are selected from a predefined set of 16 options as shown in Figma.
- Category colors are selected from 7 predefined options (green, blue, purple, pink, red,
  orange, yellow).
- Mobile-responsive layout is expected but optimized for desktop-first per Figma designs.
- Backend and frontend are separate deployable applications communicating over a network API.
