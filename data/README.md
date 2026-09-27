# Portfolio data notes

## Expected transaction schema

Each transaction is a plain JavaScript object.

```js
{
  date: "2026-01-15",
  ticker: "DEMO",
  type: "BUY",
  shares: 10,
  price: 20,
  fees: 1
}
```

- `date`: ISO date string (`YYYY-MM-DD`)
- `ticker`: symbol or internal cash label related to the event
- `type`: `BUY`, `SELL`, `DIVIDEND`, or `FEE`
- `shares`: required for `BUY` and `SELL`
- `price`: required for `BUY` and `SELL`
- `fees`: optional trade fee attached to `BUY` or `SELL`
- `amount`: required for `DIVIDEND` and standalone `FEE` transactions

Sign convention:

- `BUY` and `SELL` cash is derived from `shares * price`
- `DIVIDEND.amount` should be the positive cash received
- `FEE.amount` should be the positive cash paid out

## Broker data vs. market-price data

Broker transaction data explains how cash moved through the account over time.
Market-price data answers what open positions are worth on the valuation date.
Both data sets are needed because realized results come from transaction history, while unrealized results depend on current prices.

## Sensitive data policy

Do not commit real brokerage exports, statements, account numbers, API keys, or private financial records to this repository.
The sample data in this project is fully synthetic.

## Future CSV imports

Future CSV imports should parse broker exports into the normalized transaction schema above.
Imported raw files should live in `data/imports/`, which is ignored by Git so local files do not get committed.
