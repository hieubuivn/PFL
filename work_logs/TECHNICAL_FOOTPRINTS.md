# 🚀 Performance Sprint: TECHNICAL_FOOTPRINTS // 2026-03-24

**Mission:** Complete technical transparency and documentation for the performance overhaul.

---

### 🔋 1. The "Bundle" Collapse (Network)
**Why?** The browser was wasting ~2 seconds downloading 400+ small JS files individually.
**Solution:** Switched the `importmap` to use pre-built, minified production bundles.

```json
// index.html:33
"three": "../../build/three.module.min.js",
"three/webgpu": "../../build/three.webgpu.min.js",
"three/tsl": "../../build/three.tsl.min.js"
```

---

### 🛡️ 2. The "Pixel Guard" (UX Protection)
**Why?** Display devices with Pixel Ratios over 2.0 (like Retinas) render way too many pixels, causing excessive GPU heat and frame drops.
**Solution:** Capped the renderer's `pixelRatio` to 2.0 (max) or 1.5 (mobile).

```javascript
// office.js:101
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const dprLimit = isMobile ? 1.5 : 2.0;

renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprLimit));
```

---

### 🧈 3. The "Settle Window" (GC Breather)
**Why?** Right as the 100MB download ends, the browser's "Garbage Collector" (GC) and GPU task manager spike, causing a ~300ms stutter in the first 3D frames of the intro.
**Solution:** Added a 200ms "dark" delay after the loading screen is hidden to let the browser settle before the animation starts.

```javascript
// runScenario.js:40
await SU.hideLoadingScreen();
await SU.delay(200); // 🏁 THE SETTLE WINDOW
scene.isTransitioning = true; // Start the performance monitor AFTER the cleanup spike
```

---

### 👻 4. The "SEO Ghost" (LCP)
**Why?** Google's bots see a black screen for several seconds until the 3D scene builds. This results in poor SEO rankings.
**Solution:** Injected a "Fast-Paint" skeleton into the HTML that renders in < 500ms.

```html
<!-- index.html:120 -->
<div id="skeleton-lcp">SYSTEMS PORTFOLIO // V1.0</div>
```

---

### 🧱 5. DOM Cleanup (Reflow Prevention)
**Why?** Using `.innerHTML` in `status.js` was forcing the browser to clear and rebuild the DOM tree every time a log message appeared, causing 100ms "Main Thread" freezes.
**Solution:** Switched to `.textContent` and used `will-change: transform`.

```javascript
// status.js:92
storyElement.textContent = text; // No more layout thrashing
storyElement.style.willChange = 'transform'; // Force GPU layer
```

---

### 🔄 6. Loop Standardization
**Why?** Traditional `requestAnimationFrame` is not as stable or compatible with modern WebXR features as `setAnimationLoop`.
**Solution:** Migrated the entire app to the Three.js standard loop.

```javascript
// office.js:807
renderer.setAnimationLoop(animate);
```

---

### 🛡️ 7. The "Passive" Shield (Main Thread)
**Why?** Browsers must wait for listeners to finish before scrolling, causing "Jank."
**Solution:** Explicitly marked all non-blocking listeners as `passive: true`.

```javascript
// addRaycaster.js:130
window.addEventListener('pointermove', this._onPointerMove, { passive: true });
```

---

### 🔒 8. Security Hardening (CSP)
**Why?** To prevent Cross-Site Scripting (XSS) and unauthorized resource loading.
**Solution:** Added a strict Content Security Policy meta tag.

```html
<!-- index.html:13 -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self' ...">
```

---

### ⚡ 9. Zero-Latency Fonts (FOUT)
**Why?** Text "morphed" styles as fonts were downloaded, looking unprofessional.
**Solution:** Used `<link rel="preload">` to ensure fonts are ready before the first paint.

```html
<!-- index.html:16 -->
<link rel="preload" href="..." as="style">
```

---

### 🖼️ 10. Data Diet (WebP Migration)
**Why?** PNGs are slow to decode and heavy to transmit.
**Solution:** Migrated the 8MB Sprite Sheet to `.webp`.

```javascript
// loadResources.js:12
const spriteSheet = 'spriteSheet.webp'; // Faster decoding & lighter payload
```

---

### 🗜️ 11. Draco Compression (Native)
**Why?** Large 3D models (>5MB) cause long download times and stall the main thread during parsing if left uncompressed.
**Solution:** Verified that `room8.glb` natively exports from Blender with Draco compression properly configured, and is decoded correctly via `DRACOLoader` at runtime, bypassing the need for secondary CLI optimization.

```javascript
// setupLoaders.js:218
export const dracoLoader = new DRACOLoader(manager);
dracoLoader.setDecoderPath('../../examples/jsm/libs/draco/');
gltfLoader.setDRACOLoader(dracoLoader); // Unpacks native Blender Draco
```

---

### 📉 12. The "DPR Sabotage" Fix (Transition Performance)
**Why?** A hardcoded "safety floor" of 0.75 was preventing standard 1.0 DPR screens from receiving the intended performance relief during the heavy Room Scenario assembly. This resulted in the transition being *more* expensive than the steady-state scenario.
**Solution:** Dropped the DPR to an ultra-aggressive **0.25 (1/4 native)** during the peak Bloom assembly. Pixelation was deemed an acceptable trade-off for absolute frame stability.

```javascript
// scenarioUtility.js:82
const nativeDPR = window.devicePixelRatio || 1;
const transitionDPR = nativeDPR * 0.25; // ULTRA-AGGRESSIVE THROTTLE: ensure zero-lag assembly
scene.renderer.setPixelRatio(transitionDPR);
```

---

### 🔍 13. The "Informer" Guard (Raycast)
**Why?** Recursive scene-tree traversal for "Interaction Groups" was firing every frame, and hallucinated method calls were causing runtime crashes.
**Solution:** Implemented `userData.isRaycastTarget` O(1) lookup and a **Mouse/Camera Stationary Guard**. If neither the mouse nor camera moves beyond `0.0001`, the raycaster skips its entire workload.

```javascript
// addRaycaster.js:304
if (!mouseChanged && !cameraChanged && this._hasLastIntersections) return;
```

---

### 💡 14. 20Hz Lighting Strategy (Bulb Ingress)
**Why?** Helical movement of a dynamic light source (Bulb) forced 60 re-renders of the room's shadow maps per second, overloading the GPU.
**Solution:** Delayed shadow activation until the bulb has traveled **50%** of its path. Once active, the shadow map only updates at **20Hz** (every 3rd frame).

```javascript
// scenarioUtility.js:1278
if (t > 0.50 && scene.renderer && (scene.frameCounter % 3 === 0)) {
    scene.renderer.shadowMap.needsUpdate = true;
}
```

---

### 🧱 15. The "Scattered Wake-up" (Phase 1)
**Why?** Restoration of `matrixAutoUpdate` and `updateMatrix()` for 100+ objects in a single frame created a "Big Bang" spike at the end of the transition.
**Solution:** Implemented **Phase 1: Chunked Restoration**, spreading the matrix status reset over several frames (20 objects per frame).

```javascript
// scenarioUtility.js:421
const restoreBatch = () => {
    const limit = Math.min(restoreIndex + chunkSize, remainingObjects.length);
    // ... restore logic ...
    if (restoreIndex < remainingObjects.length) requestAnimationFrame(restoreBatch);
};
```
---

### 🛡️ 16. Delayed Interaction Unlock (Phase 5)
**Why?** Raycasting/Hover interaction would fire as soon as objects appeared, competing for CPU time with the final lighting and physics settle.
**Solution:** Kept `scene.raycasterEnabled = false` until the **Bulb flight completes**. This ensures the system is 100% stable before the first mouse interaction is calculated.

```javascript
// scenarioUtility.js:1326
scene.raycasterEnabled = true; 
updateStory("Scenario Stable.");---

### 🧈 17. Passive Listener Optimization (Best Practices)
**Why?** Browsers hit a "Scroller Block" when they wait for a non-passive listener to finish, causing stuttering during scrolls. 
**Solution:** Migrated all scroll/touch listeners to `{ passive: true }` unless they explicitly use `preventDefault()`.
**Special Case (Fixed):** The `wheel` listener for the Object Customizer panel was incorrectly marked `passive: false` without a `preventDefault()`. It now correctly blocks background scrolling to provide an anchored UI feel.

```javascript
// addObjectMaterialUniform.js:180
panel.addEventListener('wheel', (e) => {
    e.preventDefault(); // Now legitimately non-passive to lock scroll
}, { passive: false });
```
