import { framer } from "framer-plugin"
import { effectCategories } from "@motionkit/effect-catalog"
import type {
  EffectCatalogManifest,
  MotionEffectDefinition,
} from "@motionkit/shared-types"
import { useEffect, useState } from "react"

import { EffectCard } from "./components/EffectCard"
import { SelectionSummary } from "./components/SelectionSummary"
import { applyEffect } from "./lib/apply-effect"
import { loadCatalog } from "./lib/catalog"
import { createSelectionSnapshot } from "./lib/selection"
import { useSelection } from "./lib/useSelection"
import "./App.css"

framer.showUI({
  position: "top right",
  width: 420,
  height: 680,
})

export function App() {
  const [catalog, setCatalog] = useState<EffectCatalogManifest | null>(null)
  const [activeCategory, setActiveCategory] = useState(effectCategories[0]?.id ?? "")
  const [applyingEffectId, setApplyingEffectId] = useState<string | null>(null)
  const [catalogStatus, setCatalogStatus] = useState<"loading" | "ready" | "fallback">(
    "loading",
  )

  const selection = useSelection()
  const selectionSnapshot = createSelectionSnapshot(selection)

  useEffect(() => {
    let cancelled = false

    void loadCatalog().then(({ manifest, usedFallback }) => {
      if (cancelled) return

      setCatalog(manifest)
      setActiveCategory((current) => {
        if (current && manifest.categories.some((category) => category.id === current)) {
          return current
        }

        return manifest.categories[0]?.id ?? ""
      })
      setCatalogStatus(usedFallback ? "fallback" : "ready")
    })

    return () => {
      cancelled = true
    }
  }, [])

  const visibleEffects = (catalog?.effects ?? []).filter((effect) => {
    if (activeCategory && effect.category !== activeCategory) return false
    if (selectionSnapshot.count === 0) return false

    return effect.compatibleTargets.includes("any")
      || effect.compatibleTargets.some((target) =>
          selectionSnapshot.targets.includes(target),
        )
  })

  const handleApply = async (effect: MotionEffectDefinition) => {
    setApplyingEffectId(effect.id)

    try {
      await applyEffect(effect, selection)
    } finally {
      setApplyingEffectId(null)
    }
  }

  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">MotionKit</p>
          <h1>VFX library for Framer builders</h1>
        </div>
        <p className="hero-copy">
          Pick an effect, apply it to the current selection, and keep tuning in
          Framer.
        </p>
      </section>

      <SelectionSummary selection={selectionSnapshot} />

      <section className="panel">
        <div className="panel-header">
          <strong>Catalog</strong>
          <span className={`status-chip status-${catalogStatus}`}>
            {catalogStatus === "loading" && "Loading"}
            {catalogStatus === "ready" && `Source: ${catalog?.source ?? "local"}`}
            {catalogStatus === "fallback" && "Fallback to local"}
          </span>
        </div>
        <p className="muted">
          Effects live in a catalog so MotionKit can evolve the library without
          bundling every VFX implementation into the plugin shell.
        </p>
      </section>

      <section className="tabs" aria-label="Effect categories">
        {(catalog?.categories ?? effectCategories).map((category) => (
          <button
            key={category.id}
            className={category.id === activeCategory ? "tab active" : "tab"}
            onClick={() => setActiveCategory(category.id)}
            type="button"
          >
            {category.label}
          </button>
        ))}
      </section>

      <section className="effect-list">
        {visibleEffects.length > 0 ? (
          visibleEffects.map((effect) => (
            <EffectCard
              key={effect.id}
              effect={effect}
              disabled={selectionSnapshot.count === 0}
              isApplying={applyingEffectId === effect.id}
              onApply={() => void handleApply(effect)}
            />
          ))
        ) : (
          <div className="empty-state">
            <strong>No compatible effects yet.</strong>
            <p>
              Select a single frame, image, text layer, or component instance to
              see the filtered catalog.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}
