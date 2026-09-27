# Capital Ledger

Design direction and verified implementation boundaries: [Design system](docs/design/CAPITAL_LEDGER_DESIGN_SYSTEM.md) · [Product areas](docs/design/PRODUCT_INFORMATION_ARCHITECTURE.md) · [Screen reference](docs/design/SCREEN_REFERENCE.md) · [Implementation status](docs/design/IMPLEMENTATION_STATUS.md).

Capital Ledger is a React + TypeScript + Vite UI shell for an investment decision terminal. Its layout and interaction patterns selectively adapt the `iggykilla/ai-studio` prototype while keeping this repository's separate views, context, demo data and calculation boundary.

## Scope of this phase

The current UI includes:

- Primary navigation: **Portfolio**, **Metrics**, **Logs**, **Analysis**
- Position drill-down flow: **Portfolio → Position Detail**
- A responsive position ledger, desktop navigation and mobile bottom navigation
- Per-holding inclusion switches that update the synthetic portfolio snapshot and weights
- Position detail with lot and transaction records and a lot/income dialog
- Searchable, filterable, read-only synthetic decision journal
- Clearly marked pending spaces for validated metrics and research modules
- Synthetic demo holdings, transactions, market prices, and decision logs
- Explicit placeholder calculation layer (`src/calculations/demoPortfolioCalculations.ts`)

> Portfolio value, profit, return, weight and dividend figures are synthetic demo outputs, **not** validated accounting. Annualized return / XIRR, benchmark comparisons and performance attribution are shown as **Pending**. The weighted annualized placeholder still exists in `demoPortfolioCalculations.ts` for demo compatibility, but the UI does not display it as XIRR. No broker feed, AI integration, or investment recommendations are implemented.

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
npm run lint
npm run preview
```

## GitHub Pages compatibility

`vite.config.ts` sets `base` to `/capital-ledger/` for production builds.
