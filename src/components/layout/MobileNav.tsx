import { ViewIcon } from '../common/ViewIcon'
import type { PrimaryView } from '../../types'

interface MobileNavProps {
  activeView: PrimaryView
  isDetail: boolean
  onViewChange: (view: PrimaryView) => void
}

const navItems: { label: string; view: PrimaryView }[] = [
  { label: 'Portfolio', view: 'portfolio' },
  { label: 'Metrics', view: 'metrics' },
  { label: 'Logs', view: 'logs' },
  { label: 'Analysis', view: 'analysis' },
]

export const MobileNav = ({ activeView, isDetail, onViewChange }: MobileNavProps) => (
  <nav className="mobile-nav" aria-label="Primary navigation">
    <div className="mobile-nav-inner">
      {navItems.map(({ label, view }) => (
        <button
          type="button"
          key={view}
          className={activeView === view && !isDetail ? 'active' : ''}
          aria-current={activeView === view && !isDetail ? 'page' : undefined}
          onClick={() => onViewChange(view)}
        >
          <ViewIcon view={view} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  </nav>
)
