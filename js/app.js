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

summaryTableBody.innerHTML = rows
  .map(
    ([label, value]) => `
      <tr>
        <th scope="row">${label}</th>
        <td>${value}</td>
      </tr>
    `,
  )
  .join("");

assumptionsList.innerHTML = assumptions.map((assumption) => `<li>${assumption}</li>`).join("");
