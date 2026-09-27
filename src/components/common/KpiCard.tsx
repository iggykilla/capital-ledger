interface KpiCardProps {
  label: string
  value: string
  tone?: 'default' | 'positive' | 'negative' | 'muted'
}

export const KpiCard = ({ label, value, tone = 'default' }: KpiCardProps) => {
  return (
    <article className="kpi-card">
      <p className="kpi-label">{label}</p>
      <p className={`kpi-value ${tone}`}>{value}</p>
    </article>
  )
}
