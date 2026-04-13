import type { SelectionSnapshot } from "@motionkit/shared-types"

import { formatTargetLabel } from "../lib/selection"

interface SelectionSummaryProps {
  selection: SelectionSnapshot
}

export function SelectionSummary({ selection }: SelectionSummaryProps) {
  return (
    <section className="selection-summary">
      <div className="selection-header">
        <strong>Current selection</strong>
        <span className="status-chip">
          {selection.count === 0 ? "Nothing selected" : `${selection.count} selected`}
        </span>
      </div>

      <div className="selection-grid">
        <div className="selection-item">
          <strong>Target</strong>
          <span>{formatTargetLabel(selection.dominantTarget)}</span>
        </div>
        <div className="selection-item">
          <strong>Layer</strong>
          <span>{selection.labels[0] ?? "Select a layer in Framer"}</span>
        </div>
      </div>
    </section>
  )
}

