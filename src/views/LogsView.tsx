import type { DecisionLogEntry } from '../types'

interface LogsViewProps {
  entries: DecisionLogEntry[]
}

export const LogsView = ({ entries }: LogsViewProps) => {
  return (
    <section className="view-stack">
      <p className="view-note">
        Decision journal shell with local synthetic records only. No backend/authentication is implemented in this phase.
      </p>

      <section className="panel">
        <div className="panel-title-row">
          <h2>Decision Logs</h2>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Ticker</th>
                <th>Action</th>
                <th>Price</th>
                <th>Amount</th>
                <th>Thesis</th>
                <th>Expected Return</th>
                <th>Valuation</th>
                <th>Reason</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.date}</td>
                  <td>{entry.ticker}</td>
                  <td>{entry.action}</td>
                  <td>{entry.price ? `$${entry.price.toFixed(2)}` : '-'}</td>
                  <td>{entry.amount ? `$${entry.amount.toFixed(0)}` : '-'}</td>
                  <td>{entry.thesis ?? '-'}</td>
                  <td>{entry.expectedReturn ?? '-'}</td>
                  <td>{entry.valuation ?? '-'}</td>
                  <td>{entry.reason}</td>
                  <td>{entry.notes ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}
