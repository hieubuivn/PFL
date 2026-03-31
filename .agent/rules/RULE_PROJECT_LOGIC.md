---
trigger: always_on
---

<!-- Last Edited: 2026-01-25T15:00:22+07:00 -->
# RULE_PROJECT_LOGIC: Operational Standards & Constants

> [!IMPORTANT]
> ## 0. Performance Baseline (The Law)
> *   **Primary Target**: Steady 60 FPS.
> *   **The Law**: If a visual effect drops the frame rate below **54 FPS**, it must be optimized or removed immediately.

---

## 1. Project Profile (Source: Reference Data)
- **Primary Type**: Portfolio/Personal
- **Core Pillars**: Motion-Driven + Minimalism
- **Stylistic Infusions**: Brutalism, Aurora UI, HUD/Sci-Fi FUI
- **Strategy**: Storytelling-Driven content with a focus on "Personality Shine-Through."

## 2. Aesthetic Directives
### A. Structural Minimalism
- Use **Grid-Based** layouts with mathematical spacing (Swiss Style 2.0).
- Maintain high "White Space" (or "Void Space" in Cyber-Noir context).
- Focus on **Essential** elements only; strip away redundant UI chrome.

### B. Material Brutalism
- Use **Bold Geometry** and stark, unpolished transitions.
- Visible borders (1-2px) and sharp corners are preferred over soft rounding.
- High contrast type hierarchy is mandatory.

### C. Atmospheric Aurora & HUD
- **Glows**: Use "Aurora UI" mesh gradients for background depth, but limit colors to the Cyber-Noir palette (Cyan, Gold, Crimson).
- **HUD Elements**: Absolute framing, scanning animations, and ticking terminal text are the primary interaction signals.

## 3. Functional Symbology (System States)
The system uses color to communicate status logic. All UI elements must adhere to this mapping:

| Signal | Color Variable | Meaning | System Logic |
| :--- | :--- | :--- | :--- |
| **OPTIMAL** | `var(--c-cyan)` | Live, Active, High Performance | FPS >= 54, Pixel Ratio > 80% |
| **STABLE** | `var(--c-gold)` | Static, Ready, Neutral | Default state, Idle |
| **CRITICAL** | `var(--c-crimson)` | Error, Low Performance, Alert | FPS < 30, System Error |

### Dynamic Intensity Protocol
- **OPTIMAL** indicators must scale their `--stat-glow-intensity` variable between `0.0` (at 54 FPS) and `1.0` (at 60 FPS).
- **NAMESPACING**: All status-related class names and logic keys MUST use the `stat-` prefix (e.g., `.stat-optimal`, `.stat-critical`) to prevent collisions with third-party libraries or internal components. Do NOT use raw names like `.critical` or `.stable`.

## 4. UX & Interaction Rules
### A. Motion-Driven Feedback
- **Transitions**: 200-300ms for micro-interactions; use `ease-out` for entering and `ease-in` for exiting.
- **Scroll**: Implement smooth scroll behavior; leverage storytelling-driven reveals (Section-to-Section animations).
- **Reduced Motion**: ALWAYS respect user motion preferences via media queries.

### B. Navigation & Stacking
- **Active State**: Current location must be explicitly signalled via color or HUD markers.
- **Z-Index Scale**: Follow a strict scale (10=Base, 20=Overlay, 50=Critical HUD).

## 5. Content Standards (Lexicon System)
To ensure high performance and rich storytelling, all text must be managed programmatically.

- **HYBRID CONTENT MODEL**:
    - **Narrative Content**: All world-building text, logs, and UI labels MUST be stored in local static dictionaries (`config/content.js`).
    - **Live Data Streams**: Exceptions are allowed for real-time external data (e.g., BTC Price, GitHub Stats).
- **FALLBACK PROTOCOL**: Every external data fetch MUST have a local static fallback in the Lexicon to prevent UI breakage on offline/fail states.
- **MULTILINGUAL**: Every content entry must support at least `en` and `vi` variants.
- **RANDOMIZATION**: Entries must be arrays of strings; resolve a random variant upon each request.
- **IDENTIFIERS**: Use categorized, uppercase snake_case for content keys.
    - `SYS_`: System logs, boots, and technical readouts.
    - `ENV_`: Environment descriptions and atmospheric text.
    - `UI_`: Buttons, labels, and interaction feedback.
    - `CV_`: Professional data and experience strings.
- **FILE STRUCTURE**: Keep the dictionary organized by category comments to prevent sprawl.

## 6. Technical Constants (The Law)
- **Precedence**: These rules **OVERRIDE** all generic UI/UX skills.
- **Implementation**:
    - **Variables Only**: Never hardcode colors; use `--c-cyan`, `--c-gold`, etc.
    - **Class Swapping**: Use CSS classes for state management; no inline styles.
    - **Performance Balance**: Maintain steady 60 FPS. If an "Aurora" glow or "Brutalist" animation causes a drop below 54 FPS, it must be optimized or removed immediately.

## 7. Codebase & Architectural Standards
### A. Module Management (Strict ESM)
- **The Law**: Use ES Modules (ESM) with explicit `import`/`export` for all state management and utility sharing.
- **FORBIDDEN**: Do NOT attach properties or managers to the `window` object to share data between modules. 
- **Traceability**: All shared logic must be explicitly imported to ensure clear dependency graphs and IDE support.
- **Implementation**: Export singleton instances (e.g., `export const manager = new Manager()`) or pure functions/constants.
- **Exceptions**: Only use `window` for events or when required by legacy third-party scripts that do not support ESM.

### B. Function Signature Standards (Named Parameters)
- **The Rule of 3**: If a function requires more than 3 parameters, collect them into a single **named options object**.
- **Traceability**: Destructure the object in the function signature to make required properties explicit.
- **Benefits**: Improves call-site readability, allows for easy optional parameters, and prevents "positional mistakes."
- **Example**:
  ```javascript
  // DO NOT: function init(a, b, c, d, e)
  // DO: function init({ scene, camera, controls, clock, app })
  ```
