import {
  CanvasNode,
  ComponentInstanceNode,
  FrameNode,
  SVGNode,
  TextNode,
} from "framer-plugin"
import type { SelectionSnapshot, TargetKind } from "@motionkit/shared-types"

export function getTargetKind(node: CanvasNode): TargetKind {
  if (node instanceof TextNode) return "text"
  if (node instanceof SVGNode) return "svg"
  if (node instanceof ComponentInstanceNode) return "component-instance"
  if (node instanceof FrameNode) return node.backgroundImage ? "image" : "frame"

  return "frame"
}

export function createSelectionSnapshot(selection: CanvasNode[]): SelectionSnapshot {
  if (selection.length === 0) {
    return {
      count: 0,
      targets: [],
      nodeIds: [],
      labels: [],
      dominantTarget: "none",
    }
  }

  const targets = selection.map(getTargetKind)
  const dominantTarget = selection.length === 1
    ? targets[0]
    : targets.every((target) => target === targets[0])
      ? targets[0]
      : "mixed"

  return {
    count: selection.length,
    targets,
    nodeIds: selection.map((node) => node.id),
    labels: selection.map((node) => ("name" in node ? String(node.name ?? node.id) : node.id)),
    dominantTarget,
  }
}

export function formatTargetLabel(target: TargetKind): string {
  switch (target) {
    case "none":
      return "No selection"
    case "frame":
      return "Frame"
    case "image":
      return "Image"
    case "text":
      return "Text"
    case "component-instance":
      return "Component"
    case "svg":
      return "SVG"
    case "mixed":
      return "Mixed selection"
    case "any":
      return "Any layer"
    default:
      return target
  }
}

