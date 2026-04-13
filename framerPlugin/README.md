# MotionKit Workspace

MotionKit is structured as a three-layer Framer product:

- `apps/motionkit-plugin`: the plugin shell users open inside Framer.
- `packages/effect-catalog`: the effect manifest the plugin reads to render, filter, and apply effects.
- `registry`: source-of-truth examples for Framer library module URLs and version tracking outside the plugin zip.

## Why this shape

The plugin itself should stay small and stable. Effects live outside the plugin as either:

- native attribute recipes
- Smart Components published from a Framer library
- Code Components published from a Framer library

That lets MotionKit update the VFX catalog without reshipping the whole plugin every time.

## Workspace Layout

```text
apps/
  motionkit-plugin/      Framer plugin shell
docs/
  architecture.md        system overview
  effect-authoring.md    how to add/update an effect
  release-flow.md        plugin vs library release process
packages/
  shared-types/          shared schema/types for effects and selection
  effect-catalog/        local manifest and compatibility helpers
registry/
  module-urls.example.json  sample registry for published Framer modules
```

## Local Commands

```bash
npm install
npm run dev
npm run build
```

## Operational Rule

When adding a new non-native effect:

1. Publish or update the Smart/Code Component in the Framer library project.
2. Copy the module URL into the catalog/registry.
3. Update `packages/effect-catalog/src/catalog.json`.
4. Only repack/resubmit the plugin if the plugin shell behavior changes.

