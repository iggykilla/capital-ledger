import { getSamplePortfolioViewModel } from "./portfolio.js";
import { formatCurrency, formatPercent } from "./utils.js";

const summaryTableBody = document.querySelector("#summary-table-body");
const assumptionsList = document.querySelector("#assumptions-list");

const { metrics, assumptions, valuationDate } = getSamplePortfolioViewModel();

const rows = [
  ["Valuation Date", valuationDate],
  ["Total Invested Capital", formatCurrency(metrics.totalInvestedCapital)],
  ["Remaining Cost Basis", formatCurrency(metrics.remainingCostBasis)],
  ["Current Market Value", formatCurrency(metrics.currentMarketValue)],
  ["Realized Gain / Loss", formatCurrency(metrics.realizedGainLoss)],
  ["Unrealized Gain / Loss", formatCurrency(metrics.unrealizedGainLoss)],
  ["Dividend Income", formatCurrency(metrics.dividendIncome)],
  ["Total Economic Profit", formatCurrency(metrics.totalEconomicProfit)],
  ["Simple Total Return", formatPercent(metrics.simpleTotalReturn)],
  ["Holding Period", `${metrics.holdingPeriodDays} days`],
  ["XIRR", metrics.xirr === null ? "Not available" : formatPercent(metrics.xirr)],
];

for (const [label, value] of rows) {
  const tableRow = document.createElement("tr");
  const labelCell = document.createElement("th");
  const valueCell = document.createElement("td");

  labelCell.scope = "row";
  labelCell.textContent = label;
  valueCell.textContent = value;

  tableRow.append(labelCell, valueCell);
  summaryTableBody.append(tableRow);
}

for (const assumption of assumptions) {
  const listItem = document.createElement("li");
  listItem.textContent = assumption;
  assumptionsList.append(listItem);
}
