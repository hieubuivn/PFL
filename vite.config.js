import { defineConfig } from 'vite';

export default defineConfig({
  // Project Root (where index.html is located)
  root: './',
  
  // Use standard 'public' folder.
  publicDir: 'public',

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 0, // Ensure models are not inlined as base64
    rollupOptions: {
      input: {
        main: './index.html'
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
      // PRO TIP: By aliasing these directly to the CDN, we ensure Vite's dev server 
      // AND build process use the EXACT SAME URL, avoiding Multiple Instances!
      'three': 'https://esm.sh/three@0.170.0',
      'three/addons/': 'https://esm.sh/three@0.170.0/examples/jsm/',
      'tween': 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/tween.module.min.js',
      'rapier-compat': 'https://esm.sh/@dimforge/rapier3d-compat@0.17.3',
      '@scripts': '/projectScripts'
    }
  },
});
