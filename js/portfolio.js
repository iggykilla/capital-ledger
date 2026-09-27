import { sampleMarketPrices, sampleTransactions, sampleValuationDate } from "../data/sample-transactions.js";
import { calculationAssumptions, getPortfolioMetrics } from "./calculations.js";

export function getSamplePortfolioViewModel() {
  return {
    valuationDate: sampleValuationDate,
    metrics: getPortfolioMetrics(sampleTransactions, sampleMarketPrices, sampleValuationDate),
    assumptions: calculationAssumptions,
  };
}
