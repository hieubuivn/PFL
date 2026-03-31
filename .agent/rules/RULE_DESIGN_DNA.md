<!-- Last Edited: 2026-01-25T15:00:22+07:00 -->
# RULE_DESIGN_DNA: Aesthetics & HUD Standards

> [!IMPORTANT]
> ## 0. Performance Baseline (The Law)
> *   **Primary Target**: Steady 60 FPS.
> *   **The Law**: If a visual effect drops the frame rate below **54 FPS**, it must be optimized or removed immediately.
> *   **Balance**: Prioritize high-fidelity visual quality ONLY while maintaining the performance target.

---

## 1. Aesthetic Directives (Cyber-Noir Evolutions)
- **IDENTITY**: Enforce "The Grid" aesthetic (HUD-style overlays, absolute framing) infused with **Minimalist** structure.
- **STYLE BLEND**:
    - **Minimalism**: Prioritize essential functions and negative space (Void Space).
    - **Brutalism**: Use bold, raw geometry and stark borders for framing.
    - **Aurora UI**: Implement atmospheric mesh gradients within the Cyber-Noir palette to add depth without clutter.
- **SYMBOLOGY**: 
    - **Functional Mapping**:
        - CYAN (#00F3FF) = LIVE/ACTIVE (Optimal Status).
        - GOLD (#DCD0BA) = STATIC/FRAME (Stable/Idle Status).
        - CRIMSON (#FF003C) = ERROR/CRITICAL (Alert Status).
    - *Thresholds*:
        - Optimal: FPS >= 54.
        - Critical: FPS < 30.
- **ADAPTIVE FIDELITY SIGNALING**: 
    - Scale visual intensity (glow/brightness) based on performance head-room between 54 FPS and 60 FPS.
    - 54 FPS: Base Cyan (Nominal intensity).
    - 60 FPS: Maximum Aurora Glow (Peak intensity).

## 2. Dynamic Standards (Motion-Driven)
- **INTERACTION**: 
    - Use 200-300ms transitions for micro-interactions.
    - Hover states must provide visual feedback (Dim -> Bright or Glow expansion).
    - Scroll behavior: Implement storytelling-driven reveals with smooth parallax transitions.

## 3. Technical Constraints (The Law)
- **VARIABLES**: NEVER hardcode hex colors. ALWAYS use the CSS variables: `var(--c-cyan)`, `var(--c-gold)`, `var(--c-crimson)`, `var(--c-black)`.
- **CLASS SWAPPING**: NEVER use inline `.style` for visual state changes. ALWAYS toggle classes (e.g., `.stat-optimal`, `.active`).
- **FONTS**: 
    - H1-H6 and UI Buttons: ALWAYS use `Orbitron`.
    - Body Text: ALWAYS use `Rajdhani`.
    - Numerical/Coord Data: ALWAYS use `Fira Code`.

## 4. Content Standards (Lexicon System)
User-facing text is a core part of the HUD experience and must be dynamic.

*   **Hybrid Model**: Narrative content (stories/labels) is managed in `config/content.js`. Real-time data (BTC, Stats) may use external APIs.
*   **Fail-Safe**: Every API call must have a static fallback message in the Lexicon for offline states.
*   **Narrative Variance**: Every system message should have 3+ random variants to prevent user fatigue.
*   **Multilingual Support**: Primary support for English (`en`) and Vietnamese (`vi`).

## 5. UI/UX Rules
- **ACCESSIBILITY**: Ensure text contrast even within glows.
- **INTERACTION**: 
    - ALWAYS add `cursor-pointer` to interactive HUD elements.
    - Hover states must provide visual feedback (Dim -> Bright).
- **PERFORMANCE**: 
    - NEVER animate layout-shifting properties (width, height) in loops. Use `transform: scale()`.
    - **BALANCE**: Maintain the 60FPS baseline as the priority over cosmetic fidelity.

## 6. Rule Precedence
These project-specific rules OVERRIDE all generic UI/UX skills. If a conflict arises between "modern minimalist" and "Cyber-Noir HUD", ALWAYS choose **Cyber-Noir HUD**.
