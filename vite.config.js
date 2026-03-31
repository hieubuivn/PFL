import { defineConfig } from 'vite';
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    wasm(),
    topLevelAwait()
  ],
  resolve: {
    alias: {
      'three/addons/postprocessing/UnrealBloomPass-transparentBg.js': resolve('./projectScripts/libs/UnrealBloomPass-transparentBg.js'),
      'three/addons': resolve('./node_modules/three/examples/jsm'),
      'three': resolve('./node_modules/three'),
      'tween': resolve('./node_modules/@tweenjs/tween.js/dist/tween.esm.js'),
      'rapier-compat': resolve('./node_modules/@dimforge/rapier3d-compat')
    }
  },
  build: {
    target: 'esnext'
  },
  server: {
    port: 3000,
    open: true
  }
});
