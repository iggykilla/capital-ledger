import type { PrimaryView } from '../../types'

interface HeaderProps {
  activeView: PrimaryView
  onViewChange: (view: PrimaryView) => void
}

const navItems: { label: string; view: PrimaryView }[] = [
  { label: 'Portfolio', view: 'portfolio' },
  { label: 'Metrics', view: 'metrics' },
  { label: 'Logs', view: 'logs' },
  { label: 'Analysis', view: 'analysis' },
]

export const Header = ({ activeView, onViewChange }: HeaderProps) => {
  return (
    <header className="app-header">
      <div>
        <p className="app-kicker">Capital Ledger</p>
        <h1>Measure decisions, not just portfolio value.</h1>
      </div>
      <nav className="desktop-nav" aria-label="Primary">
        {navItems.map((item) => (
          <button
            type="button"
            key={item.view}
            className={item.view === activeView ? 'active' : ''}
            onClick={() => onViewChange(item.view)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
