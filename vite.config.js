import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // GitHub Pages hosting sub-path
  base: '/PFL/',
  
  // Project Root (where index.html is located)
  root: './',
  
  // Use standard 'public' folder.
  publicDir: 'public',

  esbuild: {
    legalComments: 'none',
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 0, // Ensure models are not inlined as base64
    rollupOptions: {
      input: {
        main: './index.html',
        office: './office.js'
      },
      // EXTERNAL: Do NOT bundle these. Let the browser load them from CDN via importmap.
      external: [
        'three',
        'tween',
        'rapier-compat',
        /^three\/addons\//,
        /^three\/webgpu$/,
        /^three\/tsl$/,
        /^postprocessing-extra\//,
        /^postprocessing\//
      ],
      output: {
        format: 'es'
      }
    }
  },
  
  resolve: {
    alias: {
      // PRO TIP: Specificity matters! More specific paths MUST come first.
      'three/addons/postprocessing/UnrealBloomPass-transparentBg.js': path.resolve(__dirname, 'projectScripts/libs/UnrealBloomPass-transparentBg.js'),
      'three/addons/': 'https://esm.sh/three@0.170.0/examples/jsm/',
      'three/': 'https://esm.sh/three@0.170.0/',
      'three': 'https://esm.sh/three@0.170.0',
      'tween': 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/tween.module.min.js',
      'rapier-compat': 'https://esm.sh/@dimforge/rapier3d-compat@0.17.3',
      '@scripts': './projectScripts'
    }
  },
});
