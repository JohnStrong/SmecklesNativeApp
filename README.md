# Smeckles

A personal budgeting companion that grows with you — from simple shopping lists to full expense tracking.

## Table of Contents

- [Vision](#vision)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Adding Android (later)](#adding-android-later)
- [Scripts](#scripts)
- [Homepage UX Design](#homepage-ux-design)
- [Budgeting View UX Design (Person Detail)](#budgeting-view-ux-design-person-detail)
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

## Homepage UX Design

### Condition 1: New to app (no persons exist)

Centered layout, vertically middle of screen. Single prompt to identify the user.

```
┌───────────────────────────────┐
│                               │
│                               │
│                               │
│        Who are you?           │
│                               │
│     ┌───────────────────┐     │
│     │ Enter your name   │     │
│     └───────────────────┘     │
│                               │
│       [ Get Started ]         │
│                               │
│                               │
│                               │
└───────────────────────────────┘
```

### Condition 2: Persons already exist

Header with app title. Tappable list of persons leading into their budgeting/shopping lists. Smaller input at bottom to add new persons.

```
┌───────────────────────────────┐
│ Smeckles                      │
├───────────────────────────────┤
│                               │
│ ┌───────────────────────┐     │
│ │ Alice               ▸ │     │
│ └───────────────────────┘     │
│ ┌───────────────────────┐     │
│ │ Bob                 ▸ │     │
│ └───────────────────────┘     │
│ ┌───────────────────────┐     │
│ │ Charlie             ▸ │     │
│ └───────────────────────┘     │
│                               │
│                               │
│ ┌────────────────┐  [+]       │
│ │ Add a person   │            │
│ └────────────────┘            │
└───────────────────────────────┘
```

## Budgeting View UX Design (Person Detail)

After selecting a person from the homepage, the user enters the budgeting view.

### Layout

- **Header** — full width, app title "Smeckles"
- **Left side-nav bar** (collapsible) — ~30% width
  - Heading: **Expenses** (not clickable, category label only)
    - Sub-item: **Shopping Lists** (clickable, fetches all shopping lists for the selected person via Play API)
  - Side-nav auto-opens on entry for now
- **Main content area** — ~70% width, right of the nav bar
  - **Breadcrumb** at top for navigation (e.g. `Persons > Alice > Shopping Lists > Weekly Groceries`)
  - List of shopping lists below the breadcrumb
- **Footer** — full width, small text (e.g. "© Smeckles 2026")

### Shopping List Cards

Each shopping list is displayed as a bordered card with padding between cards:

- **List name** as card title (left-aligned)
- **Frequency pill** right-aligned on the same row as list name — indicates `Weekly`, `Daily`, or `Monthly`
- **Next due hint** — text below the title (e.g. "Next due: in 3 weeks", "Next due: in 1 day", "Next due: today"). Generated from scheduling data persisted with the shopping list, returned by the service
- **Top 3 items** shown as colour-coded pills (item name + quantity), followed by `... more` if additional items exist
- **Cost pill** — right-aligned on the items row, accent colour (e.g. tangerine/orange) contrasting against the card's white/light-grey base. Should visually stand out as the key financial indicator
- Clicking the card expands to show all items
- Clear border separating each card
- Generous padding between cards

### Colour Notes

- Card base: white or light-grey
- Cost pill: **accent colour** (tangerine/warm orange) — must contrast clearly against the card base to draw the eye to the expense total
- Frequency pills: green (Daily), blue (Weekly), purple (Monthly)
- Item pills: colour-coded per item category (palette TBD)

### ASCII Mockup: Budgeting View (Shopping Lists — side-nav open)

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

### ASCII Mockup: Side-nav collapsed

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

### Notes

- Cost pill (e.g. `€24.50`) uses accent colour (tangerine) against card base (white/light-grey) — the accent must pop visually as it's the key financial info at a glance
- `... more` indicates the card is expandable; clicking the card reveals all items
- "Next due" text derived from scheduling metadata persisted with each shopping list; the service returns the raw schedule and the frontend computes a human-friendly message
- Breadcrumb supports navigation back to: all persons, selected person's expenses, or sub-pages when viewing a detailed shopping list breakdown (detail view UX TBD)
- Side-nav collapse toggle is the `≡` icon

## License

MIT — see [LICENSE](./LICENSE).
