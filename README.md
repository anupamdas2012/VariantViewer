# simpleViewer

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

testing:
use assets: https://github.com/anupamdas2012/testAssets

NOTE: this app uses a special branch of BabylonJS here:
https://github.com/anupamdas2012/Babylon.js/tree/KHR_materials_variants
To ensure varaints are properly exported. Clone down the above repo.
CD nito the cloned director and Build ES6 modules:
  1. npm install
  2. npx nx run @babylonjs/serializers:build
  3. npm link -w @babylonjs/serializers

Then follow the steps below.


1. clone app, cd into directory.
2. npm install
3. link -w @babylonjs/serializers (this step  links the lib from above steps, is important to insure proper exporting of KHR_materials_varians)
4. npm run dev, open app in chrome.
5. upload glb (use assets from https://github.com/anupamdas2012/testAssets)
6. change colors of each variant. Click update model.
7. use drop down selector to switch variants
8. click export GLTF to export asset with proper variant extension
