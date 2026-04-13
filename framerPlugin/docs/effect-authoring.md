# Adding Or Updating Effects

## Native Effects

Use native effects when the result can be expressed as editor attributes or simple presets.

Update:

1. Add or edit the entry in `packages/effect-catalog/src/catalog.json`.
2. Set `implementationType` to `native`.
3. Define a conservative `nativePatch`.
4. Keep `authoringNotes` honest about what still needs manual tuning in Framer.

## Smart Component Effects

Use Smart Components for reusable no-code compositions.

Update:

1. Publish/update the component in the Framer library project.
2. Copy its module URL.
3. Set `implementationType` to `smart-component`.
4. Choose `applyStrategy`:
   - `insert-instance` if updates should flow downstream
   - `insert-detached` if users should freely edit the inserted layers

## Code Component Effects

Use Code Components when the effect needs custom runtime logic or property controls.

Update:

1. Publish/update the component in the Framer library project.
2. Copy the module URL.
3. Set `implementationType` to `code-component`.
4. Seed `defaultParams` with the same keys exposed in Property Controls.

## Catalog Hygiene

- Do not add an effect without a preview URL and target compatibility.
- Keep `defaultParams` serializable.
- Use `selectionPolicy` to prevent invalid apply flows.
- Keep module URLs versioned when you need release stability.

