# MotionKit Plugin Shell

This app is the Framer-facing shell for MotionKit.

It is responsible for:

- reading the effect catalog
- reacting to canvas selection
- filtering compatible effects
- applying either native presets or published Framer components

## Local commands

```bash
npm run dev
npm run build
npm run pack
```

The actual VFX implementations are expected to live outside this folder in a dedicated Framer library project.

Learn more: https://www.framer.com/developers/plugins/introduction
