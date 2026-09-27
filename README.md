# Capital Ledger

A personal investment analytics dashboard built to answer a simple question:

> **What did I invest, why did I invest it, and did that decision actually create value?**

Capital Ledger goes beyond showing current portfolio value. It reconstructs investment performance from actual transactions, dividends, fees, and contribution dates to measure how capital allocation decisions have performed over time.

## Goals

- Track the portfolio from actual transaction history
- Calculate true total return
- Separate price appreciation from dividend income
- Calculate money-weighted annual return (XIRR)
- Measure performance by year
- Compare results against an S&P 500 counterfactual
- Analyze individual position performance
- Track portfolio concentration and risk
- Maintain a decision and transaction log
- Record investment thesis changes and overrides
- Support fundamental / Buffett-style business valuation

## Core Metrics

For the portfolio and each position:

- Cost basis
- Current market value
- Unrealized gain/loss
- Realized gain/loss
- Net dividends
- Total return
- Annualized return / XIRR
- Holding period
- Portfolio weight
- Contribution to portfolio return

Example:

```text
RITM

Price Return       +5.5%
Dividends          +$168.79
Total Return       +31.6%
Annualized Return  ~10.8%
```

This distinction matters: two investments with the same headline return may have produced very different results depending on dividends and how long the capital was invested.

## Benchmarking

Capital Ledger will answer:

> **What would have happened if every dollar I invested had instead been invested in the S&P 500 on the same dates?**

This creates a fair benchmark using the investor's actual capital deployment rather than comparing against a generic index chart.

## Portfolio Explorer

Holdings can be included or excluded dynamically.

This allows questions such as:

- What is my performance without MPW?
- How much of my return came from dividends?
- Which positions actually created the most wealth?
- Which positions reduced portfolio performance?
- Am I outperforming the benchmark?
- Is performance coming from stock selection or concentration?

## Decision Ledger

Investment decisions should be measurable, not remembered selectively.

The ledger records:

- Buys
- Sells
- Thesis
- Valuation
- Expected return
- Position-sizing decisions
- Strategy overrides
- Notes
- Outcome reviews

Decisions can later be reviewed after defined periods such as 3, 6, or 12 months.

## Valuation

Capital Ledger will include a fundamental valuation framework inspired by long-term business analysis.

The goal is not to generate automatic buy/sell signals.

The goal is to compare:

```text
Business Quality
      +
Financial Performance
      +
Estimated Intrinsic Value
      +
Market Price
      +
Required Margin of Safety
```

and preserve the assumptions used at the time of the decision.

## Data Architecture

Capital Ledger separates three types of data:

### Source of Truth

Broker statements / transaction exports provide:

- Transactions
- Shares
- Cost basis
- Dividends
- Fees
- Cash flows

### Market Data

External APIs provide:

- Current prices
- Historical prices
- Benchmark prices
- Market data

Market APIs should never rewrite historical transaction records.

### Calculated Data

Capital Ledger calculates:

- Total returns
- XIRR
- Annual performance
- Benchmark performance
- Portfolio weights
- Contribution analysis
- Risk metrics

## Principles

1. **Actual cash flows over headline percentages**
2. **Total return over price return**
3. **Annualized performance over misleading cumulative returns**
4. **Benchmark against identical investment dates**
5. **Preserve the original investment thesis**
6. **Separate data from calculations**
7. **Make every important calculation auditable**
8. **Never expose API keys or private financial data in the repository**

## Planned Stack

- HTML
- CSS
- JavaScript
- GitHub Pages
- Market-data API
- Local/imported transaction data

The application should remain lightweight, portable, and understandable without requiring a large framework.

## Status

🚧 Early development

The initial build will focus on:

**Transactions → Holdings → Total Return → XIRR → Benchmark**

More advanced valuation, decision-analysis, and market-regime features will be added after the performance engine is validated.

---

**Capital Ledger**

*Measure the decisions, not just the portfolio.*
