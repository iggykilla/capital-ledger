# Capital Ledger (UI Transplant Phase)

Capital Ledger is a React + TypeScript + Vite UI shell for an investment decision terminal.

## Scope of this phase

This repository currently implements a **UI transplant phase** with:

- Primary navigation: **Portfolio**, **Metrics**, **Logs**, **Analysis**
- Position drill-down flow: **Portfolio → Position Detail**
- Information-dense desktop layout and mobile bottom navigation
- Synthetic demo holdings, transactions, market prices, and decision logs
- Explicit placeholder calculation layer (`src/calculations/demoPortfolioCalculations.ts`)

> Financial outputs in this phase are synthetic/placeholder and are **not** validated portfolio accounting or XIRR logic.

## Architecture

```text
src/
  calculations/   # placeholder/demo calculation boundary
  components/     # reusable UI elements + layout
  context/        # app state (view, selected holding, inclusion toggles)
  data/           # synthetic demo transactions + market data + logs
  types/          # domain types for holdings/transactions/logs
  views/          # Portfolio, Position Detail, Metrics, Logs, Analysis
```

## Local development

```bash
npm install
npm run dev
```

## Build and preview

```bash
npm run build
npm run preview
```

## GitHub Pages compatibility

`vite.config.ts` sets `base` to `/capital-ledger/` for production builds.
