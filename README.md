# Smeckles

A personal budgeting companion that grows with you — from simple shopping lists to full expense tracking.

## Table of Contents

- [Vision](#vision)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Adding Android (later)](#adding-android-later)
- [Scripts](#scripts)
- [Authentication](#authentication)
- [Deployment](#deployment)
- [Design](#design)
- [Testing](#testing)
- [License](#license)

## Vision

Smeckles starts as a straightforward way to manage **persons** and their **shopping lists**. Each person can have multiple lists, and lists can be created, viewed, updated, and removed over time.

The longer-term goal is to evolve these shopping lists into a budgeting tool where lists become **expenses** tied to monthly, weekly, or daily budgets. The data model is intentionally simple today so it can be extended without rearchitecting later.

## Architecture

- **Backend**: Scala Play Framework service returning JSON via REST (WebSocket support planned)
- **Frontend**: React + Ionic UI running in the browser today, deployable to Android via Capacitor when ready
- **Communication**: AJAX (`fetch`) and WebSockets for real-time data retrieval

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 + Ionic 7 |
| Build Tool | Vite 5 |
| Native Bridge | Capacitor 6 |
| Language | TypeScript |

## Getting Started

```bash
npm install
npm run dev
```

## Adding Android (later)

```bash
npm run build
npx cap add android
npx cap open android
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run deploy` | Build and deploy webapp to Firebase Hosting |
| `npm run undeploy` | Take down hosted site (requires confirmation phrase) |

## Authentication

### Overview

The app uses Firebase Authentication with Google sign-in to gate access. The auth layer is decoupled from the business logic via an adapter pattern, allowing the provider to be swapped without changing UI or page components.

### Architecture

```
App.tsx
  └─ AuthProvider (adapter={firebaseAuthAdapter})
       └─ AuthGate (blocks rendering until signed in)
            └─ IonReactRouter (app routes)
```

### How It Works

1. `AuthProvider` wraps the app and accepts an `AuthAdapter` — currently wired to Firebase
2. `AuthGate` consumes the auth context via `useAuth()` hook
3. If no user is authenticated, AuthGate renders a "Sign in with Google" button
4. On successful sign-in, the app renders normally
5. The authenticated user's ID token can be passed to the backend via `user.token()`

### File Structure

| File | Purpose |
|------|---------|
| `src/auth/types.ts` | `AuthUser` and `AuthAdapter` interfaces |
| `src/auth/AuthProvider.tsx` | React context provider + `useAuth()` hook |
| `src/auth/AuthGate.tsx` | Login gate component |
| `src/auth/adapters/firebaseAuth.ts` | Firebase implementation of `AuthAdapter` |
| `src/config/firebase.ts` | Firebase app initialisation and exports |

### Switching Auth Provider

To replace Firebase with another provider (e.g. Auth0, Cognito):

1. Create a new adapter in `src/auth/adapters/` implementing `AuthAdapter`
2. Change the import in `App.tsx` to use the new adapter
3. No other files need to change

### Troubleshooting

#### `CONFIGURATION_NOT_FOUND` error on sign-in

**Cause:** Firebase Authentication has not been enabled for the project.

**Fix:**
1. Go to Firebase Console → your project → **Authentication** → **Get started**
2. Select **Google** as a sign-in provider → **Enable** → set support email → **Save**

#### Sign-in popup opens and closes immediately

**Cause:** The `apiKey` or `projectId` in `src/config/firebase.ts` doesn't match the Firebase project where auth is enabled.

**Fix:**
1. Run `firebase apps:sdkconfig WEB --project <your-project-id>` to get the correct config
2. Compare with `src/config/firebase.ts` and update any mismatched values
3. Verify your project ID with `firebase projects:list`

#### Auth still fails after enabling / config change

**Cause:** Browser has cached the old Firebase auth state.

**Fix:**
1. Hard refresh the browser: `Cmd + Shift + R` (Mac) / `Ctrl + Shift + R` (Windows/Linux)
2. Click "Sign in with Google" again

## Deployment

Deploy the static site to Firebase Hosting:

```bash
npm run deploy
```

The app is accessible at `https://smeckles-app-11ca3.web.app`.

Firebase automatically authorises `.web.app` and `.firebaseapp.com` domains for Google sign-in.

## Design

### Colour Palette

| Role | Hex | Usage |
|------|-----|-------|
| Page base | `#FAFAFA` | Off-white background |
| Card base | `#FFFFFF` | List items, cards |
| Primary / Add | `#00897B` | Add buttons, positive actions (teal) |
| Danger / Remove | `#E53935` | Remove buttons, destructive actions (coral red) |
| Accent / Attention | `#F57C00` | Cost pills, highlights, badges (tangerine) |
| Text primary | `#212121` | Headings, body text (charcoal) |
| Text secondary | `#757575` | Subtitles, hints (slate grey) |
| Border | `#E0E0E0` | Card borders, dividers (light grey) |
| Hover | `#FFF8E1` | Item hover states (warm cream) |

### Mockups

#### Homepage (Persons)

> **Implementation:** [`src/pages/PersonsPage.tsx`](./src/pages/PersonsPage.tsx)

##### Email Validation

The input field requires a valid email address. Validation rules are applied on "Add" click:

| Rule | Error message |
|------|---------------|
| Non-empty (after trim) | "cannot be empty - Please enter a valid email address" |
| Valid email pattern (`x@y.z`) | "invalid pattern - Please enter a valid email address" |
| No duplicate emails | "email already exists" |

When validation fails:
- The person is **not** added
- A red error message (`#E53935`) appears below the Add button
- The error clears once a valid email is successfully added

##### Condition 1: New to app (no persons exist)

Centered layout, offset from top (~10vh). Single prompt with "Add" button.

```
┌───────────────────────────────┐
│ Smeckles                      │
├───────────────────────────────┤
│                               │
│                               │
│        New here?              │
│                               │
│     ┌───────────────────┐     │
│     │ Enter your email  │     │
│     └───────────────────┘     │
│                               │
│     [ Add                  ]  │
│     Please enter a valid...   │  ← only shown on error
│                               │
│                               │
└───────────────────────────────┘
```

##### Condition 2: Persons already exist

Header with app title. List of persons (emails) with a remove (`-`) button per row. Input and "Add" button at the bottom.

```
┌───────────────────────────────┐
│ Smeckles                      │
├───────────────────────────────┤
│                               │
│ ┌───────────────────────────┐ │
│ │ alice@example.com     [-] │ │
│ └───────────────────────────┘ │
│ ┌───────────────────────────┐ │
│ │ bob@example.com       [-] │ │
│ └───────────────────────────┘ │
│                               │
│ ┌──────────────────┐  [Add]   │
│ │ Enter your email │          │
│ └──────────────────┘          │
│ Please enter a valid...       │  ← only shown on error
└───────────────────────────────┘
```

#### Budgeting View (Person Detail)

After selecting a person from the homepage, the user enters the budgeting view.

##### Layout

- **Header** — full width, app title "Smeckles"
- **Left side-nav bar** (collapsible) — ~30% width
  - Heading: **Expenses** (not clickable, category label only)
    - Sub-item: **Shopping Lists** (clickable, fetches all shopping lists for the selected person via Play API)
  - Side-nav auto-opens on entry for now
- **Main content area** — ~70% width, right of the nav bar
  - **Breadcrumb** at top for navigation (e.g. `Persons > Alice > Shopping Lists > Weekly Groceries`)
  - List of shopping lists below the breadcrumb
- **Footer** — full width, small text (e.g. "© Smeckles 2026")

##### Shopping Lists View

> **Implementation:** [`src/pages/views/ShoppingListsView.tsx`](./src/pages/views/ShoppingListsView.tsx)

Each shopping list is displayed as a bordered card with padding between cards:

- **List name** as card title (left-aligned)
- **Frequency pill** right-aligned on the same row as list name — indicates `Weekly`, `Daily`, or `Monthly`
- **Next due hint** — text below the title (e.g. "Next due: in 3 weeks", "Next due: in 1 day", "Next due: today"). Generated from scheduling data persisted with the shopping list, returned by the service
- **Top 3 items** shown as colour-coded pills (item name + quantity), followed by `... more` if additional items exist
- **Cost pill** — right-aligned on the items row, accent colour (e.g. tangerine/orange) contrasting against the card's white/light-grey base. Should visually stand out as the key financial indicator
- Clicking the card expands to show all items
- Clear border separating each card
- Generous padding between cards

##### Side-nav open

```
┌──────────────────────────────────────────────────────────────────────┐
│ Smeckles                                                             │
├─────────────────────┬────────────────────────────────────────────────┤
│ ≡ Expenses          │ Persons > Alice > Shopping Lists               │
│                     │                                                │
│   Shopping Lists ◀  │  ┌──────────────────────────────────────────┐  │
│                     │  │ Weekly Groceries              (Weekly)   │  │
│                     │  │ Next due: in 3 days                      │  │
│                     │  │                                          │  │
│                     │  │ [Milk x2] [Bread x1] [Eggs x6] ... more  │  │
│                     │  │                                 €24.50   │  │
│                     │  └──────────────────────────────────────────┘  │
│                     │                                                │
│                     │                                                │
│                     │  ┌──────────────────────────────────────────┐  │
│                     │  │ BBQ Saturday                 (Monthly)   │  │
│                     │  │ Next due: in 3 weeks                     │  │
│                     │  │                                          │  │
│                     │  │ [Burgers x8] [Buns x8] [Coals x1] ...    │  │
│                     │  │                                 €41.00   │  │
│                     │  └──────────────────────────────────────────┘  │
│                     │                                                │
│                     │                                                │
│                     │  ┌──────────────────────────────────────────┐  │
│                     │  │ Lunch Meal Prep                (Daily)   │  │
│                     │  │ Next due: today                          │  │
│                     │  │                                          │  │
│                     │  │ [Rice x1] [Chicken x2] [Veg x3]          │  │
│                     │  │                                  €7.80   │  │
│                     │  └──────────────────────────────────────────┘  │
│                     │                                                │
├─────────────────────┴────────────────────────────────────────────────┤
│ © Smeckles 2026                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

##### Side-nav collapsed

```
┌──────────────────────────────────────────────────────────────────────┐
│ Smeckles                                                             │
├──┬───────────────────────────────────────────────────────────────────┤
│≡ │ Persons > Alice > Shopping Lists                                  │
│  │                                                                   │
│  │  ┌─────────────────────────────────────────────────────────────┐  │
│  │  │ Weekly Groceries                                 (Weekly)   │  │
│  │  │ Next due: in 3 days                                         │  │
│  │  │                                                             │  │
│  │  │ [Milk x2] [Bread x1] [Eggs x6] ... more           €24.50    │  │
│  │  └─────────────────────────────────────────────────────────────┘  │
│  │                                                                   │
│  │                                                                   │
│  │  ┌─────────────────────────────────────────────────────────────┐  │
│  │  │ BBQ Saturday                                    (Monthly)   │  │
│  │  │ Next due: in 3 weeks                                        │  │
│  │  │                                                             │  │
│  │  │ [Burgers x8] [Buns x8] [Coals x1] ... more        €41.00    │  │
│  │  └─────────────────────────────────────────────────────────────┘  │
│  │                                                                   │
├──┴───────────────────────────────────────────────────────────────────┤
│ © Smeckles 2026                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

##### Notes

- Cost pill (e.g. `€24.50`) uses accent colour (tangerine) against card base (white/light-grey) — the accent must pop visually as it's the key financial info at a glance
- `... more` indicates the card is expandable; clicking the card reveals all items
- "Next due" text derived from scheduling metadata persisted with each shopping list; the service returns the raw schedule and the frontend computes a human-friendly message
- Breadcrumb supports navigation back to: all persons, selected person's expenses, or sub-pages when viewing a detailed shopping list breakdown (detail view UX TBD)
- Side-nav collapse toggle is the `≡` icon

## Testing

Tests use [Vitest](https://vitest.dev/) with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

| Command | Description |
|---------|-------------|
| `npm test` | Run tests in watch mode |
| `npm test -- --run` | Single test run (no watch) |
| `npm run build` | Run tests + compile + bundle (fails if tests fail) |

Test files live alongside their components with a `.test.tsx` suffix (e.g. `src/pages/PersonsPage.test.tsx`).

## License

MIT — see [LICENSE](./LICENSE).
