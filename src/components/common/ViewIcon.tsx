import type { PrimaryView } from '../../types'

export const ViewIcon = ({ view }: { view: PrimaryView }) => {
  const common = {
    width: 20, height: 20, viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor', strokeWidth: 1.8,
    strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  }

  if (view === 'portfolio') {
    return <svg {...common}><path d="M12 3v9h9" /><path d="M19.5 16A9 9 0 1 1 8 3.9" /><path d="M15 3.5A9 9 0 0 1 20.5 9H15z" /></svg>
  }
  if (view === 'metrics') {
    return <svg {...common}><path d="M3 19h18M5 15l5-5 4 3 5-7" /><path d="M16 6h3v3" /></svg>
  }
  if (view === 'logs') {
    return <svg {...common}><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></svg>
  }
  return <svg {...common}><path d="M4 19h16M6 16V9l6-5 6 5v7" /><path d="M9 16l2-4 2 2 2-3" /></svg>
}
