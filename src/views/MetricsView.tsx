export const MetricsView = () => {
  return (
    <section className="view-stack">
      <p className="view-note">
        Metrics view is a shell for validated analytics. Historical and benchmark outputs are intentionally placeholders.
      </p>

      <section className="panel">
        <h2>Performance Framework</h2>
        <ul className="bullet-grid">
          <li>Cumulative Return (placeholder)</li>
          <li>Annualized Return / XIRR (placeholder)</li>
          <li>Calendar-Year Performance (placeholder)</li>
          <li>Dividend Return vs Price Return (placeholder)</li>
          <li>Benchmark Return and Portfolio vs S&P 500 shell</li>
        </ul>
      </section>

      <section className="panel">
        <h2>Contribution, Concentration, and Risk</h2>
        <ul className="bullet-grid">
          <li>Contribution by holding (future calculation layer)</li>
          <li>Concentration by position and sector (placeholder)</li>
          <li>Risk metrics (volatility, drawdown, beta) not implemented yet</li>
        </ul>
      </section>
    </section>
  )
}
