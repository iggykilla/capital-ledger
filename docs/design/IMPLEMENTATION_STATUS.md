# Implementation status — verified against main at `1320c38`

Definitions: **LIVE** = implemented and exposed; **SUPPORTED BUT NOT SURFACED** = code exists but no full user-facing destination or integration; **PLANNED** = intended, no working engine; **DESIGN CONCEPT ONLY** = Stitch illustration without a committed implementation plan; **REJECTED** = inaccurate claim or unnecessary feature for this phase. Review the code again before changing a status.

| Concept | Status | Evidence / constraint |
| --- | --- | --- |
| React/Vite responsive Portfolio, Metrics, Logs, Analysis and detail | LIVE | `src/App.tsx`, `src/views/`, desktop and mobile nav |
| Synthetic holdings, income, sample profit, inclusion and weights | LIVE | `AppContext.tsx`, `demoPortfolioCalculations.ts`; demo only |
| Include/exclude filter and visible muted holdings | LIVE | `PortfolioView.tsx`; demo aggregates, not imported transactions |
| Read-only decision journal and position lots | LIVE | `LogsView.tsx`, `HoldingLotsModal.tsx`; synthetic records |
| Pending XIRR, benchmark and analysis placeholders | LIVE | Pending labels exist; engines do not |
| File selection/drag-drop, normalized CSV adapter, preview and validation | LIVE | `ImportDataModal.tsx`, `src/import/` |
| Duplicate detection and local IndexedDB persistence | LIVE | `fingerprint.ts`, `indexedDb.ts`, import tests |
| Local data counts, last import and confirmed clear | LIVE | `LocalDataBar.tsx`, `indexedDb.ts` |
| Separate demo and imported data | LIVE | AppContext reads demo arrays; imports write IndexedDB only |
| Adapter interface and Revolut/ING scaffold objects | SUPPORTED BUT NOT SURFACED | `adapters.ts` detect functions return false; no live broker parsing |
| Persisted import records/history API | SUPPORTED BUT NOT SURFACED | `indexedDb.ts` writes import records; no history screen |
| Dedicated Data destination and editable journal | PLANNED | Current modal and read-only logs retain their scope |
| Revolut and ING statement adapters | PLANNED | Requires real sample schemas and tests |
| Source-to-portfolio reconciliation, FIFO and realized P/L | PLANNED | Demo calculations cannot substitute for accounting |
| XIRR, TWR, calendar-year returns and drawdown | PLANNED | Need dated flows, prices and validated methodology |
| S&P 500 benchmark, alpha, attribution and risk metrics | PLANNED | Need comparable time series and currency treatment |
| Local export/backup and restore | PLANNED | No user-facing flow exists |
| Buffett-style valuation/scenario engine | PLANNED | Analysis modules remain Pending |
| Decision Health Index and counterfactual returns | DESIGN CONCEPT ONLY | Stitch screens only; no agreed method |
| Passphrase-encrypted local vault, AES-256/PBKDF2 | DESIGN CONCEPT ONLY | Browser IndexedDB is not application-level encryption |
| “AIRGAP ENFORCED,” “Zero-Telemetry Verified,” SHA-256 state checksum, isolated WebWorker | REJECTED | No supporting implementation or audit; do not make these claims |
| “FIFO verified,” “XIRR engine v4.2,” live broker sync, one-click tax report | REJECTED | Mockup copy contradicts the actual code |

The present import flow processes selected files in the browser and stores transactions in browser IndexedDB. It is not an encrypted vault. Do not convert conceptual metrics or security claims into UI text without implementing and verifying them.
