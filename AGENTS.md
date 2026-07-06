# AGENTS.md

## Project Philosophy

This project should be built following modern software engineering principles with an emphasis on maintainability, scalability, readability, and reusability.

The application should always favor **clean architecture** over quick implementations. Every feature should be easy to understand, extend, and maintain as the project grows.

---

# Tech Stack

The project must use:

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- MongoDB

---

# General Development Rules

## Keep pages thin

Never place large amounts of code inside `app/page.tsx` or any route page.

Pages should only be responsible for:

- Loading data
- Rendering page-level components
- Handling routing logic
- Passing props

Pages should **not** contain:

- Complex UI
- Forms
- Database logic
- Business logic
- Validation
- Large JSX blocks

---

## Modular Architecture

Organize the project into reusable modules.

Example structure:

```text
src/
│
├── app/
│   ├── page.tsx
│   ├── inventory/
│   │   └── page.tsx
│   └── tasks/
│       └── page.tsx
│
├── components/
│   ├── layout/
│   ├── inventory/
│   ├── tasks/
│   ├── forms/
│   ├── dialogs/
│   ├── tables/
│   └── ui/
│
├── lib/
│   ├── mongodb.ts
│   ├── constants.ts
│   ├── validations.ts
│   └── utils.ts
│
├── models/
│   ├── InventoryItem.ts
│   └── Task.ts
│
├── services/
│   ├── inventory.service.ts
│   └── task.service.ts
│
├── hooks/
│
├── types/
│   ├── inventory.ts
│   ├── task.ts
│   └── common.ts
│
├── actions/
│
└── styles/
```

---

# Components

Build small reusable components.

Instead of one component with hundreds of lines, compose multiple focused components.

Example:

Inventory

- InventoryTable
- InventoryCard
- InventoryFilters
- InventorySearch
- InventoryHeader
- InventoryItemForm
- IngredientList
- IngredientRow
- LowStockBadge

Tasks

- TaskList
- TaskCard
- TaskForm
- TaskStatusBadge
- TaskHeader

Shared UI

- Button
- Card
- Badge
- Modal
- Dialog
- Table
- Input
- Select
- SearchBar
- EmptyState
- LoadingSpinner

---

# Component Size

As a general guideline:

- Components should ideally stay under **200 lines**.
- If a component grows beyond **250–300 lines**, split it into smaller components.
- A single file should have one clear responsibility.

---

# Business Logic

Business logic should never live inside components when it can be extracted.

Examples:

Instead of:

```tsx
if (currentAmount <= minimumAmount) {
    ...
}
```

Create:

```ts
isLowStock(item)
```

inside

```text
lib/utils.ts
```

The same applies for:

- filtering
- searching
- sorting
- calculations
- validations

---

# Database

Never connect to MongoDB inside pages or UI components.

MongoDB connection belongs in:

```text
src/lib/mongodb.ts
```

Database models belong in:

```text
src/models/
```

Data operations should be handled by services or server actions.

---

# TypeScript

Avoid using `any`.

Always create explicit types.

Example:

```ts
export type Unit =
    | "grams"
    | "oz"
    | "ml"
    | "liters"
    | "quantity"
    | "bottles";

export interface Ingredient {
    name: string;
    amount: number;
    unit: Unit;
}

export interface InventoryItem {
    id: string;
    name: string;
    category: string;
    currentAmount: number;
    minimumAmount: number;
    unit: Unit;
    ingredients: Ingredient[];
}
```

Shared types belong in:

```text
src/types/
```

---

# Forms

Forms should be isolated.

Examples:

```
InventoryItemForm
TaskForm
IngredientEditor
```

Avoid writing forms directly inside pages.

---

# Styling

Use Tailwind CSS.

The design should feel like professional internal software used in luxury hotels or restaurants.

Style principles:

- Clean
- Minimal
- Elegant
- Spacious
- Consistent

Avoid:

- Large gradients
- Glassmorphism
- Heavy shadows
- Neon colors
- Excessive animations
- Multiple accent colors

Prefer:

- Neutral backgrounds
- Soft borders
- Rounded corners
- Consistent spacing
- Good typography

---

# Color Palette

Keep the interface professional.

Suggested colors:

Background

- White
- Slate 50
- Zinc 50

Borders

- Slate 200

Primary

- Slate 900

Accent

- Emerald
- Blue

Warnings

- Amber

Danger

- Red

Do not use more than one primary accent color.

---

# Typography

Use:

- Inter
- Geist

Maintain consistent typography hierarchy.

Example:

- Page Title
- Section Title
- Card Title
- Body
- Caption

---

# Naming Convention

Use descriptive names.

Good examples:

```
InventoryDashboard
InventoryItemCard
InventoryTable
InventoryFilters
InventoryItemForm

TaskCard
TaskList
TaskForm

StatusBadge
SearchBar
IngredientList
```

Avoid:

```
Box
Data
Component1
Thing
Object
```

---

# File Naming

Use:

```
inventory-table.tsx
inventory-card.tsx
task-card.tsx
inventory.service.ts
```

Avoid inconsistent naming.

---

# Reusability

If code is repeated twice, consider extracting it.

If code is repeated three times, extract it.

---

# State Management

Keep state close to where it is used.

Avoid deeply nested prop drilling.

When state becomes shared across multiple pages, consider a global state solution.

---

# Performance

Prefer:

- Server Components when possible
- Client Components only when necessary
- Memoization only after identifying a real need
- Lazy loading for large sections

Avoid premature optimization.

---

# Error Handling

Handle expected errors gracefully.

Examples:

- Empty inventory
- Database unavailable
- Validation errors
- Network errors

Provide clear user feedback.

---

# Future Scalability

Write code assuming the application will eventually include:

- Authentication
- User roles
- Multiple restaurants
- Multiple locations
- Inventory history
- Audit logs
- Reports
- Analytics
- Barcode support
- QR codes
- Notifications

The architecture should make adding these features straightforward.

---

# UI Consistency

Maintain consistent spacing.

Example spacing scale:

- 4px
- 8px
- 12px
- 16px
- 24px
- 32px

Buttons should all share the same style.

Cards should all share the same style.

Dialogs should all share the same style.

---

# Code Quality

Prioritize:

- Readability
- Simplicity
- Maintainability

Avoid clever code that is difficult to understand.

Code should be understandable by another developer without additional explanation.

---

# Documentation

Write meaningful comments only when necessary.

Prefer self-explanatory function and variable names over excessive comments.

---

# Final Objective

The final product should resemble a professional internal operations dashboard rather than a demo project.

Every new feature should follow these principles:

- Modular
- Reusable
- Typed
- Scalable
- Easy to maintain
- Cleanly designed
- Consistent across the application

When implementing new features, always consider how they fit into the overall architecture before writing code.

# Vercel Deployment Agent

## Role

You are responsible for everything related to Vercel deployment for this Next.js project.

Your responsibilities include:

- Connecting the project to Vercel
- Checking deployment readiness
- Running production build checks
- Reviewing environment variables
- Checking MongoDB production configuration
- Detecting deployment errors
- Explaining errors clearly
- Suggesting safe fixes
- Keeping deployment configuration clean

## Main Rule

Do not rewrite unrelated code.

Only make changes related to:

- Vercel deployment
- Build errors
- Environment variables
- Production configuration
- MongoDB connection safety
- Deployment documentation

## Deployment Checklist

Before saying the project is ready to deploy, check:

1. The project builds successfully.
2. TypeScript has no errors.
3. Linting has no critical errors.
4. Required environment variables are documented.
5. MongoDB connection uses environment variables.
6. No secrets are hardcoded.
7. No `.env.local` file is committed.
8. Vercel configuration is valid.
9. Production URLs are correct.
10. The app works with production environment variables.

## Required Commands

Run or verify these commands when possible:

```bash
npm install
npm run lint
npm run type-check
npm run build
```

If `type-check` does not exist in `package.json`, suggest adding:

```json
{
  "scripts": {
    "type-check": "tsc --noEmit"
  }
}
```

---

## Environment Variables

Check for required environment variables.

Common variables for this project:

```env
MONGODB_URI=
NEXT_PUBLIC_APP_URL=
```

Rules:

- Never commit `.env.local`.
- Never hardcode secrets.
- Never expose server-only secrets with `NEXT_PUBLIC_`.
- Use `NEXT_PUBLIC_` only for values that are safe to be visible in the browser.
- Add missing variables to `.env.example`.
- Make sure Vercel has the same required variables configured.

---

## MongoDB Rules

MongoDB connection logic should live in:

```txt
src/lib/mongodb.ts
```

The MongoDB URI must come from:

```ts
process.env.MONGODB_URI
```

Do not hardcode the MongoDB connection string.

The app should fail gracefully if `MONGODB_URI` is missing.

---

## Vercel Configuration

Only create `vercel.json` if necessary.

If needed, use a minimal configuration:

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

Do not add unnecessary Vercel settings.

---

## Deployment Error Handling

When a deployment fails, report:

- What failed
- Where it failed
- Why it probably failed
- Exact file involved
- Suggested fix
- Whether the fix is safe
- Whether the issue is local or Vercel-specific

Do not guess randomly.

Read the error carefully before changing code.

---

## Security Rules

Never expose:

- MongoDB URI
- API keys
- Tokens
- Passwords
- Private URLs
- Service credentials

Do not move private variables into client components.

Do not use `NEXT_PUBLIC_` for secrets.

---

## Build Safety Rules

Before making changes:

- Inspect the current file.
- Understand the error.
- Make the smallest safe fix.
- Keep existing functionality.
- Do not delete files unless clearly necessary.
- Do not change UI unless the error is caused by UI code.
- Do not replace the architecture unless absolutely required.

---

## Final Report Format

After every deployment-related task, respond with:

```txt
Vercel Deployment Report

Status:
Summary:
Errors Found:
Fixes Applied:
Environment Variables Needed:
Next Steps:
```

---

## Final Goal

The project should be easy to deploy, safe for production, and ready to run on Vercel without exposing secrets or breaking the current Next.js application.