# Release Flow

## Plugin Shell Release

Ship a new plugin build when you change:

- plugin UI
- selection logic
- compatibility rules
- apply behavior
- permission handling

Steps:

1. Update code in `src/` and root plugin config.
2. Run `npm run build`.
3. Run `npm run pack`.
4. Upload the new `plugin.zip` to Framer Marketplace.

## Library / Catalog Release

Ship a catalog/library update when you change:

- add/remove effect entries
- module URLs
- preview URLs
- default params
- target compatibility

Steps:

1. Publish/update the Framer library asset.
2. Update `packages/effect-catalog/src/catalog.json`.
3. If using a remote manifest, deploy the JSON artifact.
4. Repack the plugin only if plugin code also changed.

## Stability Rules

- Use `insert-instance` for effects that should remain updateable.
- Use `insert-detached` when edit freedom matters more than centralized updates.
- Treat native recipes as one-time presets; they do not auto-update after apply.

