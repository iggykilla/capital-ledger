import { ViewIcon } from '../common/ViewIcon'
import type { PrimaryView } from '../../types'

interface HeaderProps {
  activeView: PrimaryView
  isDetail: boolean
  onViewChange: (view: PrimaryView) => void
  onImportData: () => void
}

const navItems: { label: string; view: PrimaryView }[] = [
  { label: 'Portfolio', view: 'portfolio' },
  { label: 'Metrics', view: 'metrics' },
  { label: 'Logs', view: 'logs' },
  { label: 'Analysis', view: 'analysis' },
]

export const Header = ({ activeView, isDetail, onViewChange, onImportData }: HeaderProps) => (
  <header className="app-header">
    <div className="header-inner">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">CL<span className="brand-dot">.</span></span>
        <span className="brand-copy">
          <strong>Capital Ledger</strong>
          <small>Investment decision terminal</small>
        </span>
      </div>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map(({ label, view }) => (
          <button
            type="button"
            key={view}
            className={activeView === view && !isDetail ? 'active' : ''}
            aria-current={activeView === view && !isDetail ? 'page' : undefined}
            onClick={() => onViewChange(view)}
          >
            <ViewIcon view={view} />
            {label}
          </button>
        ))}
      </nav>
      <button type="button" className="header-import-button" onClick={onImportData}>Import data</button>
      <span className="header-status"><span className="status-dot" /> Demo workspace</span>
    </div>
  </header>
)
