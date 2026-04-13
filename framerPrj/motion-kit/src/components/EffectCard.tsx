import type { MotionEffectDefinition } from "@motionkit/shared-types"

import { formatTargetLabel } from "../lib/selection"

interface EffectCardProps {
  effect: MotionEffectDefinition
  disabled: boolean
  isApplying: boolean
  onApply: () => void
}

function formatImplementationLabel(effect: MotionEffectDefinition) {
  if (effect.implementationType === "native") return "Native preset"
  if (effect.implementationType === "smart-component") return "Smart Component"

  return "Code Component"
}

export function EffectCard({
  effect,
  disabled,
  isApplying,
  onApply,
}: EffectCardProps) {
  return (
    <article className="effect-card">
      <img
        alt={effect.previewAlt}
        className="effect-preview"
        src={effect.previewUrl}
      />

      <div className="card-header">
        <div>
          <h2 className="effect-title">{effect.name}</h2>
          <p className="effect-summary">{effect.summary}</p>
        </div>
        <span className="implementation-badge">
          {formatImplementationLabel(effect)}
        </span>
      </div>

      <div className="pill-row">
        {effect.compatibleTargets.map((target) => (
          <span className="target-pill" key={target}>
            {formatTargetLabel(target)}
          </span>
        ))}
      </div>

      <dl className="effect-controls">
        {effect.controls.slice(0, 2).map((control) => (
          <div key={control.id}>
            <dt>{control.label}</dt>
            <dd>{String(control.defaultValue)}</dd>
          </div>
        ))}
      </dl>

      <button
        className="framer-button-primary effect-apply"
        disabled={disabled || isApplying}
        onClick={onApply}
        type="button"
      >
        {isApplying ? "Applying..." : "Apply effect"}
      </button>
    </article>
  )
}

