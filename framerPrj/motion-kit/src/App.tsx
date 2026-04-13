import { framer } from "framer-plugin"
import {
  effectCategories,
  effectMatchesSelection,
} from "@motionkit/effect-catalog"
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
  const [expandedEffectId, setExpandedEffectId] = useState<string | null>("appear-direct")
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
    if (selectionSnapshot.count === 0) return true

    return effectMatchesSelection(effect, selectionSnapshot)
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
      <header className="topbar">
        <div className="topbar-copy">
          <span className="eyebrow">MotionKit</span>
          <h1>Effects</h1>
        </div>
        <span className="selection-counter">
          {selectionSnapshot.count === 0
            ? "No selection"
            : `${selectionSnapshot.count} selected`}
        </span>
      </header>

      <SelectionSummary selection={selectionSnapshot} />

      <details className="meta-drawer">
        <summary>
          <span>Catalog & integration modes</span>
          <span className={`status-chip status-${catalogStatus}`}>
            {catalogStatus === "loading" && "Loading"}
            {catalogStatus === "ready" && `Source: ${catalog?.source ?? "local"}`}
            {catalogStatus === "fallback" && "Fallback to local"}
          </span>
        </summary>
        <div className="meta-grid">
          <div className="meta-block">
            <strong>Direct Apply</strong>
            <p>Plugin edits the selected layer itself. Best for simple native presets.</p>
          </div>
          <div className="meta-block">
            <strong>Insert Effect</strong>
            <p>Plugin inserts a component-based effect. Best for richer motion or reusable VFX.</p>
          </div>
        </div>
      </details>

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

      <section className="list-header">
        <strong>{activeCategory ? "Filtered effects" : "Effects"}</strong>
        <span className="muted">
          {selectionSnapshot.count === 0
            ? "Browse first, then select a layer to apply."
            : `${visibleEffects.length} compatible`}
        </span>
      </section>

      <section className="effect-list">
        {visibleEffects.length > 0 ? (
          visibleEffects.map((effect) => (
            <EffectCard
              key={effect.id}
              effect={effect}
              disabled={selectionSnapshot.count === 0}
              expanded={expandedEffectId === effect.id}
              isApplying={applyingEffectId === effect.id}
              onApply={() => void handleApply(effect)}
              onToggle={() =>
                setExpandedEffectId((current) => (current === effect.id ? null : effect.id))
              }
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
