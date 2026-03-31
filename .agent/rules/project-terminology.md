# Project Terminology

This document defines the project-specific technical and visual terms to ensure consistency across AI agent sessions.

- **Root State**: The standard 3D "Room" or "Office" environment where models are rendered with standard materials and physics.
- **Chaos State**: The energetic "Points" or "Particles" system state where world objects morph into dynamic particle clouds.
- **Armature**: The skeletal structure for 3D model animations, particularly for character rigging.
- **a-char**: Short for "Armature Character", referring to the rigged character model in the scene.
- **Island**: The distinct top-left tab UI element on the HUD Frame.
  - **Island Head**: The parallelogram area at the top of the Island which holds the decorative pattern (linked to `CUT_SIZE`).
  - **Island Body**: The main vertical area of the Island below the Head, housing progress bars. Its right edge matches the Head's 45-degree slope.
- **Mainland**: The primary outer frame/border that encompasses the screen in the HUD shader.
- **HUD Frame**: The full-screen, camera-fixed shader overlay providing a futuristic UI.
- **Points System**: The core particle engine used for morphing transitions and background effects.
- **ConstantUniform**: The centralized object used to synchronize uniforms (iTime, iResolution, iDate) across all materials.
- **Lexicon**: The internal data and narrative content management system.
- **Persona**: User-specific profiles (e.g., Recruiter, Agency) that dictate UI themes and content selection.
- **Wall Area**: A targeted mesh area used for specialized shaders like the "Dragon Eye" or fire effects.
- **Dragon Balls**: Interactive click-triggered elements within the 3D scene.
- **SCR**: The "Scene, Camera, Renderer" setup configuration.
- **Persona Selection Timer**: The auto-selection countdown in the loading phase.
- **The Garden**: The holographic decorative area located within the bottom notch of the HUD Frame, containing animated flowers and fireflies. Interaction triggers global system scanning effects.
