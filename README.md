# capital-ledger

Capital Ledger is a lightweight personal investment analytics web application.

Phase 1 focuses on a readable financial calculation engine first, with a very small GitHub Pages-compatible interface layered on top.

## Project structure

```text
/
├── index.html
├── README.md
├── .gitignore
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── calculations.js
│   ├── portfolio.js
│   └── utils.js
├── data/
│   ├── sample-transactions.js
│   └── README.md
└── tests/
    └── calculations.test.js
```

## Architecture

- `js/calculations.js` contains pure portfolio math that is independent from the UI.
- `data/sample-transactions.js` contains only synthetic sample data.
- `js/app.js` reads the calculation results and renders a simple table into `index.html`.

## Development

- Open `index.html` directly in a browser or serve the repository with a static file server.
- Run the deterministic calculation tests with:

```bash
node --experimental-default-type=module tests/calculations.test.js
```

## Current calculation assumptions

- Realized gains and remaining cost basis use FIFO lots.
- If transactions share the same date, buys are processed before sells because Phase 1 data does not include intraday timestamps.
- Valuation-date metrics use an end-of-day convention, so transactions dated on the valuation date are included before terminal market value is measured.
- Holding period is the weighted-average age of open positions on the valuation date.
- XIRR uses actual transaction dates and includes current market value as a terminal inflow on the valuation date.
