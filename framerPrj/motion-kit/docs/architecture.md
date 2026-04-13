# MotionKit Architecture

## 1. Plugin Shell

The plugin is responsible for:

- observing current canvas selection
- loading the effect catalog
- filtering compatible effects
- applying either a native recipe or a published component URL

The plugin should stay thin. It should not embed the full effect implementation.

## 2. Effect Catalog

`packages/effect-catalog` is the product contract between design, engineering, and the plugin runtime.

Each effect definition includes:

- compatibility targets
- selection policy
- implementation type
- default params
- preview metadata
- native patch or component source

This package is the right place to version and review effect metadata.

## 3. Framer Library

The actual VFX assets live in a separate Framer library project:

- Smart Components for no-code composite effects
- Code Components for advanced effects and exposed property controls

The plugin references these assets by module URL. The library is not bundled into `plugin.zip`.

## 4. Update Model

- Plugin shell updates require repacking and marketplace submission.
- Catalog-only changes can be shipped by updating the manifest if the plugin reads a remote manifest.
- Component changes can be shipped by publishing a new module URL/version from the Framer library.

## 5. Recommended V1 Split

- Native: reveal, fade, scale, slide presets
- Smart Component: parallax, layered hover, composited scroll blocks
- Code Component: pixel scroll, distortions, advanced hover FX

