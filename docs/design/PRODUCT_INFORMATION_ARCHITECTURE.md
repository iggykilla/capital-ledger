# Product information architecture

**Measure the decisions, not just the portfolio.** Every result should eventually point to the source transaction and the reasoning that produced it. Views should prioritize the decision, with detailed records one level deeper.

| Area | Question | Current entry point | Intended scope |
| --- | --- | --- | --- |
| Portfolio | What do I own, and how is it allocated? | Portfolio and position detail | Value, invested capital, gains, income, holdings, allocation, concentration, include/exclude simulation, position drill-down. Values currently come from demo inputs. |
| Metrics | How did my capital perform? | Metrics | Cumulative and yearly return, XIRR, time-weighted return, benchmark, income/price split, realized/unrealized P/L, drawdown, attribution. Validated engines and histories are future work. |
| Journal | Why did I make the decision? | Logs | Dated transaction/decision, thesis, valuation, sizing, reviews and decision-vs-outcome. Current synthetic logs are read-only. |
| Analysis | What is the business worth and which assumptions matter? | Analysis | Quality, financial history, intrinsic value, margin of safety, scenarios and a Buffett-style valuation. Current modules are placeholders. |
| Data | Where did the source records come from? | Import modal + local status bar | File preview, validation, deduplication and browser-local storage; future broker adapters, history and backup. Imported records are currently separate from demo views. |

## Navigation and flow

Current navigation is Portfolio / Metrics / Logs / Analysis on desktop and mobile; Import is a button opening a modal. Future navigation may rename Logs to Journal and add a Data destination when a genuine data management screen exists. Keep the modal operational meanwhile. Position detail and lots are drill-downs, not primary navigation destinations.

Import path today: choose or drop a normalized CSV → parse and validate → preview with duplicate checks → commit accepted rows to IndexedDB → update local status. Clearing local records is a separate confirmed action. No imported row currently feeds Portfolio/Metrics/Journal/Analysis. This boundary must stay explicit until accounting and rendering are implemented and tested.

## Source-of-truth rule

Mark each visible value as one of: synthetic demo output, persisted imported data, or Pending. Broker names and illustrative values from Stitch are never real source records. Do not present mockup charts, benchmark lines, audit badges or invented account balances as production results.
