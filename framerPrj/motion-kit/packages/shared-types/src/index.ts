export type EffectImplementationType =
  | "native"
  | "smart-component"
  | "code-component"

export type ApplyStrategy =
  | "set-attributes"
  | "insert-instance"
  | "insert-detached"

export type SelectionPolicy = "single" | "multi" | "any"

export type TargetKind =
  | "none"
  | "any"
  | "frame"
  | "image"
  | "text"
  | "component-instance"
  | "svg"
  | "mixed"

export interface EffectCategory {
  id: string
  label: string
}

export interface EffectOption {
  label: string
  value: string | number | boolean
}

export interface EffectParameterDefinition {
  id: string
  label: string
  type: "number" | "boolean" | "enum" | "string"
  description: string
  defaultValue: string | number | boolean
  min?: number
  max?: number
  step?: number
  options?: EffectOption[]
}

export interface NativePatchRecipe {
  attributes: Record<string, unknown>
  notes?: string[]
}

export interface PublishedComponentSource {
  moduleUrl: string
  version: string
  insertMode: "instance" | "detached"
  exportedName?: string
}

export interface MotionEffectDefinition {
  id: string
  name: string
  summary: string
  category: string
  status: "ready" | "beta" | "planned"
  tags: string[]
  compatibleTargets: TargetKind[]
  selectionPolicy: SelectionPolicy
  implementationType: EffectImplementationType
  applyStrategy: ApplyStrategy
  previewUrl: string
  previewAlt: string
  defaultParams: Record<string, unknown>
  controls: EffectParameterDefinition[]
  nativePatch?: NativePatchRecipe
  componentSource?: PublishedComponentSource
  authoringNotes?: string[]
}

export interface EffectCatalogManifest {
  schemaVersion: number
  updatedAt: string
  source: "local" | "remote"
  manifestUrl?: string
  libraryProject: {
    name: string
    workspaceUrl: string
    updatePolicy: "plugin-only" | "remote-manifest" | "hybrid"
  }
  categories: EffectCategory[]
  effects: MotionEffectDefinition[]
}

export interface SelectionSnapshot {
  count: number
  targets: TargetKind[]
  nodeIds: string[]
  labels: string[]
  dominantTarget: TargetKind
}

