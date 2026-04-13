import type { SelectionSnapshot } from "@motionkit/shared-types"

import { formatTargetLabel } from "../lib/selection"

interface SelectionSummaryProps {
  selection: SelectionSnapshot
}

export function SelectionSummary({ selection }: SelectionSummaryProps) {
  return (
    <section className="selection-strip">
      <div className="selection-strip-title">
        <strong>Selection</strong>
        <span className="status-chip">
          {selection.count === 0 ? "Browse mode" : "Apply enabled"}
        </span>
      </div>
      <div className="selection-strip-row">
        <span className="selection-pill">
          Target: {formatTargetLabel(selection.dominantTarget)}
        </span>
        <span className="selection-pill">
          Layer: {selection.labels[0] ?? "Select a layer in Framer"}
        </span>
      </div>
    </section>
  )
}
