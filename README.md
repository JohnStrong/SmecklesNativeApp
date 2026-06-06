# Smeckles

A personal budgeting companion that grows with you — from simple shopping lists to full expense tracking.

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

## License

MIT — see [LICENSE](./LICENSE).
