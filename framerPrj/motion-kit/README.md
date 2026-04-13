# MotionKit

MotionKit is a Framer plugin shell backed by an effect catalog and a separate VFX library strategy.

## Structure

- `src/`: plugin UI, selection logic, and apply pipeline.
- `packages/shared-types`: shared schema for effects and selection.
- `packages/effect-catalog`: local catalog/manifest consumed by the plugin.
- `registry/`: sample registry for Framer module URLs published from the VFX library.
- `docs/`: architecture, authoring, and release notes.

## Local commands

```bash
npm install
npm run dev
npm run build
npm run lint
npm run pack
```

## Update model

- Native presets live as JSON recipes in the catalog.
- Smart Components and Code Components live in a separate Framer library project.
- The plugin only stores metadata and module URLs, so adding/updating VFX does not always require a new plugin zip.

Learn more: https://www.framer.com/developers/plugins/introduction
