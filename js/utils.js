const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function toUtcDate(dateText) {
  return new Date(`${dateText}T00:00:00Z`);
}

export function daysBetween(startDate, endDate) {
  return Math.round((toUtcDate(endDate) - toUtcDate(startDate)) / MS_PER_DAY);
}

export function roundTo(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
