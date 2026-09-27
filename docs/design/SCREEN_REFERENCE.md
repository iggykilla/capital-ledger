# Stitch screen reference

The original archive contains six concepts, each in mobile and desktop HTML/PNG pairs: `portfolio_cockpit`, `metrics_performance`, `investment_decision_journal`, `portfolio_analysis_workspace`, `data_import_vault_management`, `demo_position_detail`, plus their `desktop_*` counterparts. Its `capital_ledger/DESIGN.md` gives palette and typography. The images contain prominent false security and calculation claims, so this reference captures their useful structure in words rather than copying them unannotated.

## Portfolio Cockpit

- **Purpose:** See included capital, key demo totals and each position's state at a glance.
- **Works:** Compact headline, ledger hierarchy, dense columns, quick filters, prominent inclusion controls; mobile cards and desktop grid have complementary roles.
- **Adopt:** Tight surfaces, aligned financial figures, explicit excluded state and a clearly labeled summary. Keep position drill-down.
- **Change:** Replace mockup totals and account claims with the existing demo data, label all synthetic values, and retain the actual filter semantics.
- **Not yet:** Broker balances, live market data, validated profit, export seed, simulated counterfactual return.

## Position Detail

- **Purpose:** Show what makes up a holding and the decision context behind it.
- **Works:** Hierarchy of position value, lots, income and thesis; responsive detail layout.
- **Adopt:** Keep lot/transaction detail close to the headline and make provenance visible when real data is connected.
- **Change:** Existing detail uses demo records; the mockup's ticker, lot history and audits are illustrative.
- **Not yet:** Buy lot, edit thesis, verified FIFO, audit report and return chart.

## Metrics & Performance

- **Purpose:** Explain actual capital performance over time and relative to a valid benchmark.
- **Works:** Separate price/income/timing and exposure, with clear period controls in the proposed design.
- **Adopt:** Existing decomposition plus structured Pending states; keep high information density without implying a completed engine.
- **Change:** Stitch's charts and trend values are fictional. Current demo calculations and empty benchmark remain clearly distinguished.
- **Not yet:** XIRR, TWR, annual results, beta, Sharpe, benchmark alpha and drawdown.

## Investment Journal

- **Purpose:** Connect a dated investment decision to its thesis, sizing and later review.
- **Works:** Timeline, searchable action types and contextual notes, adapted as today's read-only Logs.
- **Adopt:** Decision-first narrative and compact metadata around each record.
- **Change:** Use calm labels (“Journal”, “Decision”, “Review”), and keep the current entries marked as synthetic.
- **Not yet:** New/edit entry, synced audit stream, Decision Health Index, export hash and counterfactual scoring.

## Analysis Workspace

- **Purpose:** Test business quality, valuation assumptions and the investment thesis.
- **Works:** Topic-based modules and a dedicated place for assumptions and scenario outputs.
- **Adopt:** Module hierarchy and explicit prerequisites from current Analysis view.
- **Change:** Avoid colored results, simulated model runs and charts until sourced inputs and tested calculations exist.
- **Not yet:** Moat score, valuation, factor exposure, scenario simulation and recommendations.

## Data Import / Vault

- **Purpose:** Explain file provenance, preview changes and manage browser-local records.
- **Works:** Distinct stage/preview/commit steps, local footprint and destructive action separated from import.
- **Adopt:** Clear local status copy and explicit file format guidance. Current import modal already provides preview, validation and deduplication.
- **Change:** Call it **Data / Import**, not an encrypted vault. Today only Capital Ledger normalized CSV is recognized; Revolut/ING are scaffolds. Imported records do not replace demo views.
- **Not yet:** Broker-specific import, backup/restore, encrypted storage, telemetry audit, tax export and sync.

## Responsive and interaction guidance

Desktop examples emphasize dense tables and side-by-side context. Mobile examples prioritize one major number, scannable holding cards and stable navigation. A muted holding must remain legible and interactive on both. Buttons in the Stitch HTML are mostly static demonstrations; production controls must connect to a real state transition and accessible label.
