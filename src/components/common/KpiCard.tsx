interface KpiCardProps {
  label: string
  value: string
  detail?: string
  tone?: 'default' | 'positive' | 'negative' | 'muted'
}

export const KpiCard = ({ label, value, detail, tone = 'default' }: KpiCardProps) => (
  <article className="kpi-card">
    <p className="eyebrow">{label}</p>
    <p className={`kpi-value ${tone}`}>{value}</p>
    {detail && <p className="kpi-detail">{detail}</p>}
  </article>
)
