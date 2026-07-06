# Architecture

The project follows a hybrid architecture that separates generic UI, shared application features, and route-specific features.

Every new feature must be placed in the correct layer.

---

# Architecture Hierarchy

The application is organized into four layers:

```
Generic Components
        ↓
Shared App Features
        ↓
Route Features
        ↓
Route Pages
```

Each layer has a single responsibility.

---

# 1. Generic Components

Location:

```
src/components/
```

Purpose:

Reusable UI building blocks with **no business knowledge**.

Examples:

- Button
- Badge
- Card
- Dialog
- Modal
- Input
- Select
- SearchBar
- Table
- LoadingSpinner
- Banner
- EmptyState

A generic component should never know what Inventory, Preparation or Tasks are.

If a component could be copied into another project without modification, it probably belongs here.

---

# 2. Shared Application Features

Location:

```
src/app/features/
```

Purpose:

Smart features that are reused by **multiple routes**.

These features are composed using generic components.

Examples:

- Navigation
- App Shell
- Global Notifications
- Global Search
- Settings
- Shared Toolbar
- Shared Layout Sections

A feature belongs here only if:

- It is used by two or more routes.
- The behavior is mostly identical.
- It is not tightly coupled to one business domain.

Do NOT place Inventory, Preparation or Task features here unless they are genuinely shared.

---

# 3. Route Features

Each route owns its own feature folder.

Example:

```
src/app/inventory/features/
src/app/preparation/features/
src/app/tasks/features/
src/app/completed-tasks/features/
```

Purpose:

Smart components that belong only to that route.

Examples:

Inventory

- InventoryToolbar
- InventoryForm
- InventoryCard
- InventoryTable
- InventoryFilters

Preparation

- PreparationToolbar
- PreparationForm
- IngredientSelector
- PreparationRecipeEditor

Tasks

- TaskList
- TaskCard
- TaskForm

Completed Tasks

- CompletedTaskList
- CompletedTaskCard

These components may use:

- Generic components
- Shared application features

They should NOT be shared unless they are nearly identical.

If two routes implement different behavior, they should each have their own feature.

Avoid over-generalizing.

---

# 4. Route Pages

Each route owns its own page.

Example:

```
src/app/inventory/page.tsx
src/app/preparation/page.tsx
src/app/tasks/page.tsx
src/app/completed-tasks/page.tsx
```

A page is responsible only for:

- Loading data
- Composing route features
- Handling route-level concerns

A page must NOT:

- Contain business logic
- Contain forms
- Contain database logic
- Render one giant shared dashboard component

Every route should render its own features.

Wrong:

```
Inventory Page
        ↓
RestaurantPrepDashboard
```

Correct:

```
Inventory Page
        ↓
InventoryToolbar
InventoryFilters
InventoryTable
InventoryForm
```

Preparation should render Preparation features.

Tasks should render Task features.

Completed Tasks should render Completed Task features.

---

# Generic vs Shared vs Route-Specific

When creating a new file, use this decision tree:

Is it just UI?

→ src/components

↓

Is it reused by multiple routes?

→ src/app/features

↓

Does it belong to one route only?

→ src/app/[route]/features

↓

Does it contain only route-level composition?

→ src/app/[route]/page.tsx

---

# Types

Shared types:

```
src/types/
```

Only place types here if they are reused across multiple domains.

Examples:

- Unit
- ApiResponse
- Pagination
- SelectOption

Route-specific types belong inside:

```
src/app/inventory/types/
src/app/preparation/types/
src/app/tasks/types/
```

---

# Utils

Shared utilities:

```
src/utils/
```

Examples:

- formatDate
- debounce
- formatNumber

Inventory-specific utilities belong inside:

```
src/app/inventory/utils/
```

Preparation-specific utilities belong inside:

```
src/app/preparation/utils/
```

Never place route-specific logic inside shared utilities.

---

# Services

Services remain global.

```
src/services/
```

Examples:

- inventory.service.ts
- preparation.service.ts
- task.service.ts

Services are responsible for:

- Database operations
- Business logic
- Data persistence

Services should never contain UI code.

---

# Final Rule

Every file should have a clear ownership.

A developer should be able to answer immediately:

- Is this generic?
- Is this shared?
- Is this route-specific?

If the answer is not obvious, the architecture should be reconsidered before writing code.