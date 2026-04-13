import catalogJson from "./catalog.json"

import type { EffectCatalogManifest } from "@motionkit/shared-types"

export { effectMatchesSelection, countEffectsByTarget } from "./compatibility"

export const catalogManifest = catalogJson as EffectCatalogManifest

export const effectCategories = catalogManifest.categories
export const effectDefinitions = catalogManifest.effects

export function getEffectById(effectId: string) {
  return effectDefinitions.find((effect) => effect.id === effectId) ?? null
}

