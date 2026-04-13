import type {
  MotionEffectDefinition,
  SelectionSnapshot,
  TargetKind,
} from "@motionkit/shared-types"

export function effectMatchesSelection(
  effect: MotionEffectDefinition,
  selection: SelectionSnapshot,
): boolean {
  if (selection.count === 0) return false
  if (effect.selectionPolicy === "single" && selection.count !== 1) return false
  if (effect.selectionPolicy === "multi" && selection.count < 2) return false

  if (effect.compatibleTargets.includes("any")) return true

  const targets = new Set(selection.targets)
  return effect.compatibleTargets.some((target) => targets.has(target))
}

export function countEffectsByTarget(
  effects: MotionEffectDefinition[],
  target: TargetKind,
): number {
  return effects.filter((effect) => effect.compatibleTargets.includes(target)).length
}

