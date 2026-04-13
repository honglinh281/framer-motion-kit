import type { MotionEffectDefinition } from "@motionkit/shared-types"

import { formatTargetLabel } from "../lib/selection"

interface EffectCardProps {
  effect: MotionEffectDefinition
  disabled: boolean
  expanded: boolean
  isApplying: boolean
  onApply: () => void
  onToggle: () => void
}

function formatImplementationLabel(effect: MotionEffectDefinition) {
  if (effect.implementationType === "native") return "Native preset"
  if (effect.implementationType === "smart-component") return "Smart Component"

  return "Code Component"
}

function formatDeliveryMode(effect: MotionEffectDefinition) {
  return effect.deliveryMode === "direct-apply" ? "Direct Apply" : "Insert Effect"
}

export function EffectCard({
  effect,
  disabled,
  expanded,
  isApplying,
  onApply,
  onToggle,
}: EffectCardProps) {
  return (
    <article className={expanded ? "effect-card expanded" : "effect-card"}>
      <div className="effect-card-top">
        <img
          alt={effect.previewAlt}
          className="effect-preview"
          src={effect.previewUrl}
        />

        <div className="effect-content">
          <div className="card-header">
            <div className="effect-copy">
              <h2 className="effect-title">{effect.name}</h2>
              <p className="effect-summary">{effect.summary}</p>
            </div>
            <div className="badge-stack">
              <span className="delivery-badge">{formatDeliveryMode(effect)}</span>
              <span className="implementation-badge">
                {formatImplementationLabel(effect)}
              </span>
            </div>
          </div>

          <div className="pill-row">
            {effect.compatibleTargets.map((target) => (
              <span className="target-pill" key={target}>
                {formatTargetLabel(target)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {expanded ? (
        <dl className="effect-controls">
          {effect.controls.map((control) => (
            <div key={control.id}>
              <dt>{control.label}</dt>
              <dd>{String(control.defaultValue)}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="effect-actions">
        <button className="framer-button-secondary effect-toggle" onClick={onToggle} type="button">
          {expanded ? "Less" : "Details"}
        </button>
        <button
          className="framer-button-primary effect-apply"
          disabled={disabled || isApplying}
          onClick={onApply}
          type="button"
        >
          {isApplying ? "Applying..." : "Apply"}
        </button>
      </div>
    </article>
  )
}
