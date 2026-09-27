import { useState } from 'react'

const modules = [
  { title: 'Business Quality', group: 'Company', description: 'Moat, management and durability of cash generation.',
    needs: ['Defined qualitative criteria', 'Documented company sources', 'Reviewer notes'] },
  { title: 'Financial Performance', group: 'Company', description: 'Growth, margins, balance sheet and cash flow trends.',
    needs: ['Historical company statements', 'Comparable periods', 'Consistent financial definitions'] },
  { title: 'Intrinsic Value', group: 'Valuation', description: 'A transparent estimate with explicit assumptions.',
    needs: ['Owner earnings or cash flow inputs', 'Forecast assumptions', 'Sensitivity ranges'] },
  { title: 'Margin of Safety', group: 'Valuation', description: 'Distance between a documented value estimate and price.',
    needs: ['Reviewed intrinsic value', 'Dated market price', 'Chosen margin convention'] },
  { title: 'Valuation', group: 'Valuation', description: 'Compare assumptions, scenarios and prior estimates.',
    needs: ['Versioned valuation inputs', 'Recorded change reasons', 'Scenario definitions'] },
  { title: 'Benchmark Analysis', group: 'Portfolio', description: 'Compare portfolio results over matching time periods.',
    needs: ['Validated portfolio return series', 'Benchmark total return series', 'Currency and cash flow policy'] },
  { title: 'Portfolio Insights', group: 'Portfolio', description: 'Surface exposure and decision context for review.',
    needs: ['Reconciled positions', 'Validated attribution', 'Documented decision journal'] },
] as const

export const AnalysisView = () => {
  const [active, setActive] = useState(0)
  const selected = modules[active]

  return (
    <div className="view-stack">
      <div className="view-intro"><div><p className="eyebrow accent">04 / Analysis</p><h1>Analysis workbench</h1>
        <p className="subtle">A place for deliberate research, valuation and portfolio review.</p></div><span className="view-badge">Design shell</span></div>
      <div className="data-notice" role="note"><span className="notice-mark" aria-hidden="true">i</span>
        <span>Modules show required inputs and intended scope. No live analysis, AI recommendations or valuation results are available in this demo.</span></div>

      <section className="panel">
        <div className="section-heading"><div><p className="eyebrow accent">Research framework</p><h2>Choose a module</h2></div><span className="section-meta">7 modules · pending</span></div>
        <div className="analysis-modules">
          {modules.map((module, index) => <button type="button" key={module.title}
            className={active === index ? 'analysis-module active' : 'analysis-module'}
            aria-pressed={active === index} onClick={() => setActive(index)}>
            <span className="analysis-module-top"><span className="step-number">{String(index + 1).padStart(2, '0')}</span><span className="pending-pill">Pending</span></span>
            <strong>{module.title}</strong><small>{module.description}</small>
            <span className="module-group">{module.group} <span aria-hidden="true">↗</span></span>
          </button>)}
        </div>
      </section>
      <section className="panel module-detail" aria-live="polite" aria-labelledby="module-title">
        <div className="section-heading"><div><p className="eyebrow accent">{selected.group} / Scope</p><h2 id="module-title">{selected.title}</h2>
          <p className="subtle">{selected.description}</p></div><span className="pending-pill">Awaiting inputs</span></div>
        <div className="requirements-grid">
          <div><h3>Before this module can produce results</h3><ul>{selected.needs.map((need) => <li key={need}>{need}</li>)}</ul></div>
          <div className="module-empty"><span className="eyebrow">Output preview</span><strong>Pending</strong>
            <p>When source data and methodology are ready, results can be displayed here with assumptions and a review trail.</p></div>
        </div>
      </section>
    </div>
  )
}
