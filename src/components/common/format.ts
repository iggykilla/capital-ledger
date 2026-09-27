const wholeDollars = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})
const sharePrice = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const formatMoney = (value: number) => wholeDollars.format(value)
export const formatPrice = (value: number) => sharePrice.format(value)
export const formatPercent = (value: number, signed = false) =>
  `${signed && value > 0 ? '+' : ''}${value.toFixed(1)}%`
export const formatDate = (isoDate: string) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${isoDate}T00:00:00Z`))
