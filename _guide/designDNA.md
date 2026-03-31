# Design DNA & Style Guide

## 1. Color Palette & Usage
A high-contrast "Cyber-Noir" palette mixing futuristic tech with elegant archival tones.

### Primary Colors
*   **Deep Black** (`#000000` / `#070707`): Used for backgrounds, modal overlays, and base layers.
*   **Crisp White** (`#FFFFFF`): Used for primary headings, body text in high-contrast modes, and borders.

### Accent Focus
*   **Electric Cyan** (`#00FFFF` / `#00F0FF` / `#00F3FF`)
    *   **Usage**: "Active" states, interactive elements (buttons, links), glows, and technical data overlays.
    *   **Effect**: Often paired with a `text-shadow` or `box-shadow` of the same color to create a neon glow.
*   **Archival Gold** (`#DCD0BA`)
    *   **Usage**: "Legacy" or "Static" elements, decorative frames, sub-headers, and CV structural lines.
    *   **Effect**: Used to ground the futuristic cyan with a sense of history/prestige.

### Contextual Colors
*   **Dimmed Text**: `#8B949E` or `#AAAAAA` (Secondary information).
*   **Dark Overlay**: `rgba(0, 0, 0, 0.85)` (Panels — opaque, not blurred).

---

## 2. Typography & Hierarchy
A blend of geometric sci-fi headers and legible technical body text.

### Font Families
1.  **Orbitron** (The "Tech" Face)
    *   **Usage**: H1-H6 Headlines, Buttons, "Status" indicators, Loader text.
    *   **Style**: Uppercase, Bold (700/800), Wide Letter-spacing (`2px`+).
2.  **Rajdhani** (The "Reading" Face)
    *   **Usage**: CV Body text, long descriptions.
    *   **Style**: Semi-condensed, clean dimensions, legible at 1.1rem.
3.  **Fira Code** (The "Data" Face)
    *   **Usage**: Coordinates, Progress percentages, "Code" snippets.
    *   **Style**: Monospace, often smaller size (`0.9rem`), Cyan/Gold colors.

### Formatting Rules
*   **Headlines**: Almost exclusively **UPPERCASE** with `letter-spacing: 0.05em` to `2px`.
*   **Hierarchy**: Size contrast is dramatic (Massive Titles vs Tiny Data Labels).

---

## 3. Layout & Spacing (The Grid)
An "Absolute" framed aesthetic typically found in HUDs (Heads-Up Displays).

### The Frame System
*   **Structure**: The site behaves like a viewport/monitor, bounded by a global `.frame`.
*   **Metrics**: Borders and Corners use specific relative units (`1.38889em`) to maintain scale.
*   **Z-Indexing**: Layered approach -> Canvas (Bottom) -> Overlays -> Frame (Top).

### Container Styles
*   **Paneling**: Sidebar/CV is a "Drawer" (`#cv-container`), sliding from the right.
*   **Backgrounds**:
    *   **Solid**: Deep Black for high readability areas.
    *   **Tech Grid**: Linear gradients creating 1px grid lines on transparency (`background-size: 20px 20px`).
*   **Padding**: Generous internal padding (`30px` - `80px`) within panels, but "Edge-to-Edge" alignment for the main viewport.

---

## 4. Visual Effects & Decoration
Sharp, vector-based precision vs. soft atmospheric glows.

### Borders & Edges
*   **Style**: 1px Solid lines (`solid`).
*   **Radii**: Mixed.
    *   **Buttons/Panels**: `4px` (Slightly rounded).
    *   **Frames/Layouts**: `0px` (Sharp, angular cutouts).
*   **Decoration**: Structural SVG "Cutouts" and "Corner Brackets" rather than simple CSS borders.

### Atmosphere
*   **Glows**: `text-shadow: 0 0 10px rgba(0,255,255,0.5)` is standard for key text. **Keep these STATIC — do not animate `text-shadow`.**
*   **Glassmorphism**: ~~`backdrop-filter: blur(4px)`~~ **⛔ BANNED.** Blurring over the WebGL canvas forces a per-frame repaint that kills FPS. Use opaque/semi-opaque solid backgrounds instead.
*   **Scanlines/Grids**: CSS Gradient Backgrounds pattern often used on dark panels to add texture without images.

---

## 5. Motion & Interactivity
Deliberate, machine-like precision.

### ⛔ MANDATORY PERFORMANCE RULES — Never Break These
> These rules protect the WebGL FPS target (60fps). Violations cause 10–20fps drops.

1. **No `backdrop-filter`** on any element that overlaps the canvas — ever.
2. **No animated `filter:`** — never put `filter: brightness/hue-rotate` inside `@keyframes` or `transition`.
3. **No `transition: all`** — always specify explicit properties: `transition: opacity 0.3s, transform 0.3s`.
4. **No `text-shadow` inside `@keyframes`** — not GPU composited, causes repaint.
5. **No `box-shadow` inside `@keyframes`** — not GPU composited despite common belief.
6. **No rapid animations** (`< 0.5s` cycle) on infinite elements — minimum `1.5s` cycles.
7. **ONLY `opacity` and `transform`** are GPU-composited and safe for continuous animation.

### Safe Animation Template
```css
/* ✅ ONLY use opacity + transform for infinite animations */
@keyframes safeGlow {
    0%,  100% { opacity: 0.8; transform: scale(1.00); }
    50%        { opacity: 1.0; transform: scale(1.02); }
}
```

### Animations
*   **Type**: "Pulse" (Opacity/Scale), "Blink" (Cursor text), "Slide" (Panels).
*   **Easing**: `cubic-bezier(0.25, 1, 0.5, 1)` or `ease-in-out` for non-linear, mechanical movement.
*   **Durations**:
    *   **Fast**: `0.3s` (Hover states, UI feedback). Do NOT go below `0.2s` for cyclic animations.
    *   **Slow**: `2s`+ (Pulses, floating indicators).

### Interactions
*   **Hover**: High-brightness shift (Dim → Bright).
    *   *Example*: Buttons start transparent with border, fill solid Cyan on hover.
*   **Cursor**: Custom pointer behaviors (Progress bar, Text select) to match the "Terminal" feel.

---

## Summary: Design Tokens

```css
:root {
  /* COLORS */
  --c-black:        #000000;
  --c-white:        #FFFFFF;
  --c-cyan:         #00FFFF;
  --c-gold:         #DCD0BA;
  
  /* TYPOGRAPHY */
  --font-tech:      'Orbitron', monospace;
  --font-body:      'Rajdhani', sans-serif;
  --font-code:      'Fira Code', monospace;
  
  /* SPACING */
  --space-frame:    1.38889em;
  --radius-xs:      4px;
  
  /* EFFECTS — Static only, never animate these */
  --glow-cyan:      0 0 10px rgba(0, 255, 255, 0.5);
  --trans-fast:     0.3s ease;
  --trans-smooth:   cubic-bezier(0.25, 1, 0.5, 1);
  /* ⛔ REMOVED: --glass-blur — backdrop-filter banned for WebGL perf */
}
```

---

## 6. Response System
The design adapts to mobile devices while maintaining the "absolute" HUD feel.

### Breakpoints
*   **Mobile (< 768px)**:
    *   **Layout**: Stacked vertical grid for selection cards.
    *   **Spacing**: Reduced padding (20px).
    *   **Typography**: Scaled down headers (20px).
    *   **Decorations**: "Cyber Lines" hidden to save space.
