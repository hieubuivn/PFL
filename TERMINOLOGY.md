# HUD Terminology & Conceptual Map

This document defines the naming conventions for various HUD elements and interaction zones.

## 🏗️ Structural Elements

### 🗺️ The Navigator
*   **Previous Name**: Top-Right Island / Right Island
*   **Description**: The square interactive container located in the top-right corner of the HUD frame.
*   **Function**: Context-aware navigation, action shortcuts, or status icons.
*   **Design**: A perfect square geometry with a chamfer-less (90-degree) outer corner to distinguish it from the stylistic chamfers of the mainland.
*   **Masking**: Explicitly masks out background particles and the mainland electric grid to maintain visual clarity.

### 🏝️ The Island
*   **Location**: Top-Left corner.
*   **Description**: A slanted parallelogram tab that houses primary system metrics (FPS, PERF).
*   **Design**: Features a 45-degree chamfered leading edge and a dynamic width based on content.

### 🖼️ The Mainland / Frame
*   **Description**: The global bounding structure that encapsulates the entire viewport.
*   **Zones**: 
    *   **Notches**: Tactical cutouts at the bottom and right edges for secondary data streams (Garden, Physics bars).
    *   **Chamfers**: 45-degree "cut" corners (TL, BL, BR) that define the "Cyber-Noir" silhouette.

## ⚡ Interactions

### 🌬️ Breathing
*   **Description**: A volumetric pulse of light and electrical activity that cycles through the frame's borders.
*   **Trigger**: Hovering over interactive zones (Island, Navigator, Garden).

### 🔋 Electricity (Fill/Hold/Wipe)
*   **Description**: The animated frame circuit that simulates a power-up sequence.
*   **Cycle**:
    1.  **FILL**: Circuit travels from start to head.
    2.  **HOLD**: Full circuit illumination with "stroboscopic" grid scan.
    3.  **WIPE**: Circuit clears, leaving a subtle energy "linger."

## 🧱 Technical Stacking
*   **Points System**: The particle background.
*   **Grids**: The hexagonal electric "stroboscopic" overlays that appear inside the HUD frame.
*   **Garden**: The procedural flower simulation at the bottom of the HUD.
