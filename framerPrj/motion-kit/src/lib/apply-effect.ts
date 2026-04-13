import { CanvasNode, framer } from "framer-plugin"
import type { MotionEffectDefinition } from "@motionkit/shared-types"

import { insertGeneratedAppear, isGeneratedAppearSource } from "./generated-appear"

function assertSelection(effect: MotionEffectDefinition, selection: CanvasNode[]) {
  if (selection.length === 0) {
    throw new Error("Select a layer before applying an effect.")
  }

  if (effect.selectionPolicy === "single" && selection.length !== 1) {
    throw new Error("This effect requires a single selected layer.")
  }

  if (effect.selectionPolicy === "multi" && selection.length < 2) {
    throw new Error("This effect requires multiple selected layers.")
  }
}

async function applyNativeEffect(
  effect: MotionEffectDefinition,
  selection: CanvasNode[],
) {
  const target = selection[0]
  if (!target) throw new Error("Missing selection target.")
  if (!effect.nativePatch) {
    throw new Error("This native effect is missing its patch recipe.")
  }
  if (!framer.isAllowedTo("Node.setAttributes")) {
    throw new Error("Framer does not allow this plugin to edit the selected layer.")
  }

  await target.setAttributes(effect.nativePatch.attributes as never)

  if (framer.isAllowedTo("Node.setPluginData")) {
    await target.setPluginData("motionkit.effectId", effect.id)
    await target.setPluginData(
      "motionkit.deliveryMode",
      effect.deliveryMode,
    )
    await target.setPluginData(
      "motionkit.defaultParams",
      JSON.stringify(effect.defaultParams),
    )
  }

  await framer.notify(`Applied ${effect.name} to the selected layer.`, {
    variant: "success",
    durationMs: 1800,
  })
}

async function applyPublishedComponent(effect: MotionEffectDefinition) {
  const source = effect.componentSource
  if (!source) throw new Error("This effect is missing a published component source.")

  if (isGeneratedAppearSource(source.moduleUrl)) {
    throw new Error("Generated appear effects require the current selection.")
  }

  const attributes = {
    controls: effect.defaultParams,
  }

  if (effect.applyStrategy === "insert-detached" || source.insertMode === "detached") {
    await framer.addDetachedComponentLayers({
      url: source.moduleUrl,
      layout: true,
      attributes,
    })
  } else {
    await framer.addComponentInstance({
      url: source.moduleUrl,
      attributes,
    })
  }

  await framer.notify(`Inserted ${effect.name}.`, {
    variant: "success",
    durationMs: 1800,
  })
}

export async function applyEffect(
  effect: MotionEffectDefinition,
  selection: CanvasNode[],
) {
  try {
    assertSelection(effect, selection)

    if (effect.implementationType === "native") {
      await applyNativeEffect(effect, selection)
      return
    }

    if (effect.componentSource && isGeneratedAppearSource(effect.componentSource.moduleUrl)) {
      await insertGeneratedAppear(selection)
      return
    }

    await applyPublishedComponent(effect)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to apply effect."

    await framer.notify(message, {
      variant: "error",
      durationMs: 2200,
    })
  }
}
