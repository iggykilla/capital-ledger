import assert from "node:assert/strict";

import {
  getCurrentMarketValue,
  getDividendIncome,
  getHoldingPeriodDays,
  getPortfolioMetrics,
  getRealizedGainLoss,
  getRemainingCostBasis,
  getSimpleTotalReturn,
  getTotalEconomicProfit,
  getTotalInvestedCapital,
  getUnrealizedGainLoss,
  getXirr,
} from "../js/calculations.js";

function assertClose(actual, expected, tolerance = 0.000001) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `Expected ${expected} but received ${actual}`,
  );
}

function test(name, callback) {
  callback();
  console.log(`✓ ${name}`);
}

test("profitable position handles multiple purchases, fees, dividends, and a partial sale", () => {
  const transactions = [
    { date: "2026-01-01", ticker: "DEMO", type: "BUY", shares: 10, price: 20, fees: 1 },
    { date: "2026-02-01", ticker: "DEMO", type: "BUY", shares: 5, price: 30, fees: 1 },
    { date: "2026-03-01", ticker: "DEMO", type: "DIVIDEND", amount: 10 },
    { date: "2026-04-01", ticker: "DEMO", type: "SELL", shares: 8, price: 35, fees: 1 },
  ];
  const marketPrices = { DEMO: 32 };

  assert.equal(getTotalInvestedCapital(transactions), 352);
  assert.equal(getRealizedGainLoss(transactions), 118.2);
  assert.equal(getRemainingCostBasis(transactions), 191.2);
  assert.equal(getCurrentMarketValue(transactions, marketPrices), 224);
  assert.equal(getUnrealizedGainLoss(transactions, marketPrices), 32.8);
  assert.equal(getDividendIncome(transactions), 10);
  assert.equal(getTotalEconomicProfit(transactions, marketPrices), 161);
  assertClose(getSimpleTotalReturn(transactions, marketPrices), 0.457386, 0.000001);
  assertClose(getHoldingPeriodDays(transactions, "2026-06-30"), 157.86, 0.01);
});

test("losing position reports a negative unrealized result", () => {
  const transactions = [{ date: "2026-01-01", ticker: "LOSS", type: "BUY", shares: 10, price: 50, fees: 2 }];
  const marketPrices = { LOSS: 40 };

  assert.equal(getTotalInvestedCapital(transactions), 502);
  assert.equal(getRemainingCostBasis(transactions), 502);
  assert.equal(getCurrentMarketValue(transactions, marketPrices), 400);
  assert.equal(getUnrealizedGainLoss(transactions, marketPrices), -102);
  assert.equal(getTotalEconomicProfit(transactions, marketPrices), -102);
});

test("standalone fee transactions reduce economic profit and invested capital", () => {
  const transactions = [
    { date: "2026-01-01", ticker: "ETF", type: "BUY", shares: 10, price: 10, fees: 0 },
    { date: "2026-02-01", ticker: "CASH", type: "FEE", amount: 5 },
  ];
  const marketPrices = { ETF: 11 };

  assert.equal(getTotalInvestedCapital(transactions), 105);
  assert.equal(getTotalEconomicProfit(transactions, marketPrices), 5);
  assertClose(getSimpleTotalReturn(transactions, marketPrices), 0.047619, 0.000001);
});

test("xirr uses irregular cash-flow dates instead of a simple average return approximation", () => {
  const transactions = [
    { date: "2025-01-01", ticker: "FLOW", type: "BUY", shares: 10, price: 100, fees: 0 },
    { date: "2025-07-19", ticker: "FLOW", type: "BUY", shares: 5, price: 100, fees: 0 },
  ];
  const valuationDate = "2026-01-01";
  const expectedTerminalValue = 1000 * 1.1 + 500 * 1.1 ** (166 / 365);
  const marketPrices = { FLOW: expectedTerminalValue / 15 };

  assertClose(getXirr(transactions, marketPrices, valuationDate), 0.1, 0.000001);
});

test("xirr returns null when there is no valid positive-and-negative cash-flow set", () => {
  assert.equal(getXirr([], {}, "2026-01-01"), null);
});

test("portfolio metrics bundle the required calculation outputs", () => {
  const transactions = [{ date: "2026-01-01", ticker: "ONE", type: "BUY", shares: 1, price: 100, fees: 0 }];
  const marketPrices = { ONE: 110 };
  const metrics = getPortfolioMetrics(transactions, marketPrices, "2026-12-31");

  assert.deepEqual(Object.keys(metrics), [
    "totalInvestedCapital",
    "remainingCostBasis",
    "currentMarketValue",
    "realizedGainLoss",
    "unrealizedGainLoss",
    "dividendIncome",
    "totalEconomicProfit",
    "simpleTotalReturn",
    "holdingPeriodDays",
    "xirr",
  ]);
});
