export const sampleTransactions = [
  {
    date: "2025-01-10",
    ticker: "DEMO",
    type: "BUY",
    shares: 10,
    price: 20,
    fees: 1,
  },
  {
    date: "2025-02-05",
    ticker: "LOSS",
    type: "BUY",
    shares: 8,
    price: 15,
    fees: 1,
  },
  {
    date: "2025-03-15",
    ticker: "DEMO",
    type: "BUY",
    shares: 5,
    price: 24,
    fees: 1,
  },
  {
    date: "2025-06-30",
    ticker: "DEMO",
    type: "DIVIDEND",
    amount: 8,
  },
  {
    date: "2025-09-01",
    ticker: "DEMO",
    type: "SELL",
    shares: 4,
    price: 30,
    fees: 1,
  },
  {
    date: "2025-10-01",
    ticker: "LOSS",
    type: "DIVIDEND",
    amount: 2,
  },
  {
    date: "2025-11-15",
    ticker: "CASH",
    type: "FEE",
    amount: 3,
  },
];

export const sampleMarketPrices = {
  DEMO: 28,
  LOSS: 10,
};

export const sampleValuationDate = "2026-01-01";
