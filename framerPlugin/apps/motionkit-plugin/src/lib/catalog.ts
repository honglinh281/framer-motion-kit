import { catalogManifest } from "@motionkit/effect-catalog"
import type {
  EffectCatalogManifest,
  MotionEffectDefinition,
} from "@motionkit/shared-types"

interface CatalogLoadResult {
  manifest: EffectCatalogManifest
  usedFallback: boolean
}

function isEffectDefinition(value: unknown): value is MotionEffectDefinition {
  if (!value || typeof value !== "object") return false

  const candidate = value as Partial<MotionEffectDefinition>
  return (
    typeof candidate.id === "string"
    && typeof candidate.name === "string"
    && typeof candidate.summary === "string"
    && typeof candidate.category === "string"
    && Array.isArray(candidate.compatibleTargets)
  )
}

function isCatalogManifest(value: unknown): value is EffectCatalogManifest {
  if (!value || typeof value !== "object") return false

  const candidate = value as Partial<EffectCatalogManifest>
  return (
    typeof candidate.schemaVersion === "number"
    && typeof candidate.updatedAt === "string"
    && Array.isArray(candidate.categories)
    && Array.isArray(candidate.effects)
    && candidate.effects.every(isEffectDefinition)
  )
}

export async function loadCatalog(): Promise<CatalogLoadResult> {
  const remoteUrl = import.meta.env.VITE_MOTIONKIT_MANIFEST_URL?.trim()

  if (!remoteUrl) {
    return {
      manifest: catalogManifest,
      usedFallback: false,
    }
  }

  try {
    const response = await fetch(remoteUrl)
    if (!response.ok) throw new Error(`Unexpected status: ${response.status}`)

    const json = (await response.json()) as unknown
    if (!isCatalogManifest(json)) throw new Error("Remote manifest shape is invalid")

    return {
      manifest: { ...json, source: "remote", manifestUrl: remoteUrl },
      usedFallback: false,
    }
  } catch (error) {
    console.warn("Falling back to local MotionKit catalog.", error)

    return {
      manifest: catalogManifest,
      usedFallback: true,
    }
  }
}

