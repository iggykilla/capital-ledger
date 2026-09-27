import { daysBetween, roundTo } from "./utils.js";

function sortTransactions(transactions) {
  const typePriority = {
    BUY: 0,
    DIVIDEND: 1,
    FEE: 2,
    SELL: 3,
  };

  return transactions
    .map((transaction, index) => ({ transaction, index }))
    .sort((left, right) => {
      const dateComparison = left.transaction.date.localeCompare(right.transaction.date);

      if (dateComparison !== 0) {
        return dateComparison;
      }

      const typeComparison = (typePriority[left.transaction.type] ?? 99) - (typePriority[right.transaction.type] ?? 99);

      if (typeComparison !== 0) {
        return typeComparison;
      }

      return left.index - right.index;
    })
    .map(({ transaction }) => transaction);
}

function getTransactionAmount(transaction) {
  if (transaction.type === "BUY" || transaction.type === "SELL") {
    return transaction.shares * transaction.price;
  }

  return transaction.amount ?? 0;
}

function getTickerLots(lotsByTicker, ticker) {
  if (!lotsByTicker.has(ticker)) {
    lotsByTicker.set(ticker, []);
  }

  return lotsByTicker.get(ticker);
}

function sellFromLots(lotsByTicker, transaction) {
  const lots = getTickerLots(lotsByTicker, transaction.ticker);
  let sharesToSell = transaction.shares;
  let matchedCostBasis = 0;

  while (sharesToSell > 0) {
    const lot = lots[0];

    if (!lot) {
      throw new Error(`Not enough shares to sell for ${transaction.ticker} on ${transaction.date}.`);
    }

    const soldShares = Math.min(sharesToSell, lot.sharesRemaining);
    matchedCostBasis += soldShares * lot.unitCost;
    lot.sharesRemaining -= soldShares;
    sharesToSell -= soldShares;

    if (lot.sharesRemaining === 0) {
      lots.shift();
    }
  }

  return matchedCostBasis;
}

export function analyzeTransactions(transactions) {
  const lotsByTicker = new Map();
  let realizedGainLoss = 0;

  for (const transaction of sortTransactions(transactions)) {
    if (transaction.type === "BUY") {
      const lots = getTickerLots(lotsByTicker, transaction.ticker);
      lots.push({
        ticker: transaction.ticker,
        purchaseDate: transaction.date,
        sharesRemaining: transaction.shares,
        unitCost: (transaction.shares * transaction.price + (transaction.fees ?? 0)) / transaction.shares,
      });
      continue;
    }

    if (transaction.type === "SELL") {
      const matchedCostBasis = sellFromLots(lotsByTicker, transaction);
      const netProceeds = transaction.shares * transaction.price - (transaction.fees ?? 0);

      // FIFO matches each sale against the oldest remaining purchase lots, so the realized gain
      // reflects the actual cost basis that is leaving the portfolio on that sale date.
      realizedGainLoss += netProceeds - matchedCostBasis;
    }
  }

  return {
    realizedGainLoss,
    lotsByTicker,
  };
}

function getRemainingCostBasisFromLots(lotsByTicker) {
  let remainingCostBasis = 0;

  for (const lots of lotsByTicker.values()) {
    for (const lot of lots) {
      remainingCostBasis += lot.sharesRemaining * lot.unitCost;
    }
  }

  return roundTo(remainingCostBasis);
}

function getCurrentMarketValueFromLots(lotsByTicker, marketPrices) {
  let currentMarketValue = 0;

  for (const [ticker, lots] of lotsByTicker.entries()) {
    if (lots.length === 0) {
      continue;
    }

    const currentPrice = marketPrices[ticker];

    if (typeof currentPrice !== "number") {
      throw new Error(`Missing market price for ${ticker}.`);
    }

    for (const lot of lots) {
      currentMarketValue += lot.sharesRemaining * currentPrice;
    }
  }

  return roundTo(currentMarketValue);
}

function getHoldingPeriodDaysFromLots(lotsByTicker, valuationDate) {
  let weightedDays = 0;
  let totalShares = 0;

  // Remaining shares inherit the purchase date of the lot they still belong to, so the holding
  // period here is the weighted average age of the currently open lots on the valuation date.
  for (const lots of lotsByTicker.values()) {
    for (const lot of lots) {
      weightedDays += lot.sharesRemaining * daysBetween(lot.purchaseDate, valuationDate);
      totalShares += lot.sharesRemaining;
    }
  }

  if (totalShares === 0) {
    return 0;
  }

  return roundTo(weightedDays / totalShares, 2);
}

export function getTotalInvestedCapital(transactions) {
  return roundTo(
    transactions.reduce((total, transaction) => {
      if (transaction.type === "BUY") {
        return total + transaction.shares * transaction.price + (transaction.fees ?? 0);
      }

      if (transaction.type === "FEE") {
        return total + getTransactionAmount(transaction);
      }

      return total;
    }, 0),
  );
}

export function getRemainingCostBasis(transactions) {
  const { lotsByTicker } = analyzeTransactions(transactions);
  return getRemainingCostBasisFromLots(lotsByTicker);
}

export function getCurrentMarketValue(transactions, marketPrices) {
  const { lotsByTicker } = analyzeTransactions(transactions);
  return getCurrentMarketValueFromLots(lotsByTicker, marketPrices);
}

export function getRealizedGainLoss(transactions) {
  return roundTo(analyzeTransactions(transactions).realizedGainLoss);
}

export function getUnrealizedGainLoss(transactions, marketPrices) {
  return roundTo(getCurrentMarketValue(transactions, marketPrices) - getRemainingCostBasis(transactions));
}

export function getDividendIncome(transactions) {
  return roundTo(
    transactions.reduce((total, transaction) => {
      if (transaction.type !== "DIVIDEND") {
        return total;
      }

      return total + getTransactionAmount(transaction);
    }, 0),
  );
}

export function getFeeExpenses(transactions) {
  return roundTo(
    transactions.reduce((total, transaction) => {
      if (transaction.type !== "FEE") {
        return total;
      }

      return total + getTransactionAmount(transaction);
    }, 0),
  );
}

export function getTotalEconomicProfit(transactions, marketPrices) {
  return roundTo(
    getRealizedGainLoss(transactions) +
      getUnrealizedGainLoss(transactions, marketPrices) +
      getDividendIncome(transactions) -
      getFeeExpenses(transactions),
  );
}

export function getSimpleTotalReturn(transactions, marketPrices) {
  const investedCapital = getTotalInvestedCapital(transactions);

  if (investedCapital === 0) {
    return 0;
  }

  return roundTo(getTotalEconomicProfit(transactions, marketPrices) / investedCapital, 6);
}

export function getHoldingPeriodDays(transactions, valuationDate) {
  const { lotsByTicker } = analyzeTransactions(transactions);
  return getHoldingPeriodDaysFromLots(lotsByTicker, valuationDate);
}

export function buildXirrCashFlows(transactions, marketPrices, valuationDate) {
  // All date-based metrics use end-of-day valuation semantics, so a valuation date includes
  // every transaction dated that day before the terminal market value is appended.
  const datedTransactions = sortTransactions(transactions).filter((transaction) => transaction.date <= valuationDate);
  const cashFlows = [];

  for (const transaction of datedTransactions) {
    if (transaction.type === "BUY") {
      cashFlows.push({
        date: transaction.date,
        amount: -(transaction.shares * transaction.price + (transaction.fees ?? 0)),
      });
      continue;
    }

    if (transaction.type === "SELL") {
      cashFlows.push({
        date: transaction.date,
        amount: transaction.shares * transaction.price - (transaction.fees ?? 0),
      });
      continue;
    }

    if (transaction.type === "DIVIDEND") {
      cashFlows.push({
        date: transaction.date,
        amount: getTransactionAmount(transaction),
      });
      continue;
    }

    if (transaction.type === "FEE") {
      cashFlows.push({
        date: transaction.date,
        amount: -getTransactionAmount(transaction),
      });
    }
  }

  const terminalValue = getCurrentMarketValue(datedTransactions, marketPrices);

  if (terminalValue !== 0) {
    cashFlows.push({
      date: valuationDate,
      amount: terminalValue,
    });
  }

  return cashFlows;
}

function xnpv(rate, cashFlows) {
  if (rate <= -0.999999 || cashFlows.length === 0) {
    return Number.POSITIVE_INFINITY;
  }

  const firstDate = cashFlows[0].date;

  return cashFlows.reduce((total, cashFlow) => {
    const years = daysBetween(firstDate, cashFlow.date) / 365;
    return total + cashFlow.amount / (1 + rate) ** years;
  }, 0);
}

function xnpvDerivative(rate, cashFlows) {
  if (rate <= -0.999999 || cashFlows.length === 0) {
    return Number.POSITIVE_INFINITY;
  }

  const firstDate = cashFlows[0].date;

  return cashFlows.reduce((total, cashFlow) => {
    const years = daysBetween(firstDate, cashFlow.date) / 365;

    if (years === 0) {
      return total;
    }

    return total - (years * cashFlow.amount) / (1 + rate) ** (years + 1);
  }, 0);
}

export function getXirr(transactions, marketPrices, valuationDate, guess = 0.1) {
  const cashFlows = buildXirrCashFlows(transactions, marketPrices, valuationDate);

  if (cashFlows.length === 0) {
    return null;
  }

  const hasPositiveFlow = cashFlows.some((cashFlow) => cashFlow.amount > 0);
  const hasNegativeFlow = cashFlows.some((cashFlow) => cashFlow.amount < 0);

  if (!hasPositiveFlow || !hasNegativeFlow) {
    return null;
  }

  let rate = guess;

  for (let iteration = 0; iteration < 50; iteration += 1) {
    const value = xnpv(rate, cashFlows);

    if (Math.abs(value) < 1e-7) {
      return roundTo(rate, 6);
    }

    if (rate <= -0.999999) {
      break;
    }

    const derivative = xnpvDerivative(rate, cashFlows);

    if (!Number.isFinite(derivative) || Math.abs(derivative) < 1e-10) {
      break;
    }

    const nextRate = rate - value / derivative;

    if (nextRate <= -0.999999 || !Number.isFinite(nextRate)) {
      break;
    }

    rate = nextRate;
  }

  let low = -0.999999;
  let high = 1;
  let lowValue = xnpv(low, cashFlows);
  let highValue = xnpv(high, cashFlows);

  while (lowValue * highValue > 0 && high < 128) {
    high *= 2;
    highValue = xnpv(high, cashFlows);
  }

  if (lowValue * highValue > 0) {
    return null;
  }

  for (let iteration = 0; iteration < 100; iteration += 1) {
    const middle = (low + high) / 2;
    const middleValue = xnpv(middle, cashFlows);

    if (Math.abs(middleValue) < 1e-7) {
      return roundTo(middle, 6);
    }

    if (lowValue * middleValue < 0) {
      high = middle;
      highValue = middleValue;
    } else {
      low = middle;
      lowValue = middleValue;
    }
  }

  return roundTo((low + high) / 2, 6);
}

export function getPortfolioMetrics(transactions, marketPrices, valuationDate) {
  const analysis = analyzeTransactions(transactions);
  const remainingCostBasis = getRemainingCostBasisFromLots(analysis.lotsByTicker);
  const currentMarketValue = getCurrentMarketValueFromLots(analysis.lotsByTicker, marketPrices);
  const realizedGainLoss = roundTo(analysis.realizedGainLoss);
  const unrealizedGainLoss = roundTo(currentMarketValue - remainingCostBasis);
  const dividendIncome = getDividendIncome(transactions);
  const feeExpenses = getFeeExpenses(transactions);
  const totalEconomicProfit = roundTo(realizedGainLoss + unrealizedGainLoss + dividendIncome - feeExpenses);
  const totalInvestedCapital = getTotalInvestedCapital(transactions);

  return {
    totalInvestedCapital,
    remainingCostBasis,
    currentMarketValue,
    realizedGainLoss,
    unrealizedGainLoss,
    dividendIncome,
    totalEconomicProfit,
    simpleTotalReturn: totalInvestedCapital === 0 ? 0 : roundTo(totalEconomicProfit / totalInvestedCapital, 6),
    holdingPeriodDays: getHoldingPeriodDaysFromLots(analysis.lotsByTicker, valuationDate),
    xirr: getXirr(transactions, marketPrices, valuationDate),
  };
}

export const calculationAssumptions = [
  "Realized gains and remaining cost basis use FIFO lots.",
  "When multiple trades share the same date, buys are processed before sells because the data model does not include intraday timestamps.",
  "Valuation-date calculations use an end-of-day convention, so transactions dated on the valuation date are included before market value is measured.",
  "Holding period is the weighted-average age of currently open shares.",
  "XIRR uses dated cash flows and adds current market value on the valuation date as the terminal inflow.",
  "Dividend transactions use the explicit cash amount supplied in the data.",
  "Simple total return is total economic profit divided by cumulative BUY cash outflows plus standalone FEE outflows.",
];
