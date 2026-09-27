import type { PrimaryView } from '../../types'

interface MobileNavProps {
  activeView: PrimaryView
  onViewChange: (view: PrimaryView) => void
}

const navItems: { label: string; view: PrimaryView }[] = [
  { label: 'Portfolio', view: 'portfolio' },
  { label: 'Metrics', view: 'metrics' },
  { label: 'Logs', view: 'logs' },
  { label: 'Analysis', view: 'analysis' },
]

export const MobileNav = ({ activeView, onViewChange }: MobileNavProps) => {
  return (
    <nav className="mobile-nav" aria-label="Primary">
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
  )
}
