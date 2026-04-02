/**
 * sceneConfig.js
 * Centralized configuration for scene object names and keys.
 */
import * as THREE from 'three';
export const SCENE_OBJECTS = {
    // The starting shape/distribution for the points system (often a loose cloud or galaxy structure)
    ROOT: "root",

    // The main character mesh that the points morph into (the 'Pilot')
    CHAR: "a-char",

    ROOT_DEV: 'rootDev'
};

export const PERSONA_IDS = {
    POBA: 'poba',
    DEV: 'dev'
};

export const DEFAULT_PERSONA = PERSONA_IDS.POBA;
export const ASSET_VERSION = '1.0.0'; // Change this to bust cache after asset updates

export const GLOBAL_COLORS = {
    ELECTRIC_CYAN: new THREE.Color(0.0, 0.95, 1.0),
    ACCENT_GOLD: new THREE.Color('#DCD0BA'), // Classic gold #DCD0BA
    CRIMSON_RED: new THREE.Color('#FF003C'),
    INACTIVE_GRAY: new THREE.Color(0.05, 0.05, 0.05),
};
export const SCENARIO_STATES = [
    {
        name: 'points',
        renderer: 'composer',
        pixelRatioScale: 1.0,
        toneMappingExposure: 4.0, // Reduced from 5.0 to optimize Bloom pass fill-rate overhead
        ui: {
            cursorInformer: false,
            subtitle: false,
            personaButton3D: false
        },
        environment: {
            cssBackground: null,
            sceneBackground: null
        },
        hudUniforms: {
            uOutsideColor: new THREE.Color(0., 0., 0.),
            uFlowerColor: new THREE.Color(0.0, 0.92, 1.0),
            uGridThickness: 1.,
            uBNotchBarAlpha: 0.0,
        }
    },
    {
        name: 'room',
        renderer: 'standard',
        pixelRatioScale: 0.625, // Restored to original high-quality baseline
        toneMappingExposure: 0.4,
        ui: {
            cursorInformer: true,
            subtitle: true,
            personaButton3D: true
        },
        environment: {
            cssBackground: 'black',
            // sceneBackground: 0x000000
        },
        hudUniforms: {
            uOutsideColor: new THREE.Color('#2b2b2b'),
            uFlowerColor: new THREE.Color(1.0, 1.0, 1.0),
            uGridThickness: 2,
            uBNotchBarAlpha: 0.0,
        }
    }
];

export const TIMELINES = {
    ASSEMBLE: 4,
    BUILD: 2,

}

export const PixelRatioMaximizer = {
    thresholdUp: 56, // Must be rock-solid 60 to upgrade
    thresholdSoftDown: 50, // Gentle reduction to 1.0
    thresholdHardDown: 40, // Panic reset to base
    waitDuration: 3.0,
    elapsedGoodTime: 0,
    settleTimer: 0,
    update(delta, renderer, currentScenarioConfig) {
        if (!renderer || !currentScenarioConfig || delta <= 0) return false;

        const nativeDPR = window.devicePixelRatio || 1;
        const currentRatio = renderer.getPixelRatio();
        const rawFps = 1.0 / delta;

        // --- 0. State Detection & Transition Lock ---
        // If the scene is in a transition (Walking, Room Building), 
        // the Maximizer must stay out of the way to allow for manual staggered drops.
        if (window.scene && window.scene.isTransitioning) {
            this.lastStep = -1; // Reset state tracking so we re-baseline cleanly AFTER transition
            return false;
        }

        const pointsApp = window.scene ? window.scene.pointsApp : null;
        const currentStep = (pointsApp && typeof pointsApp.getCurrentStep === 'function') ? pointsApp.getCurrentStep() : -1;

        // Mode Classification
        // CLARITY (Native Lock): Chaos (0), Root (1), Entrance (2)
        // STABILITY (Baseline): Interaction (3+), Room Scenario
        const isClarityMode = (currentStep === 0 || currentStep === 1 || currentStep === 2);
        const isStabilityMode = (currentStep >= 3 || currentScenarioConfig.name === 'room');

        // --- 1. Mode Initialization (State Change Detect) ---
        if (this.lastStateName !== currentScenarioConfig.name || this.lastStep !== currentStep) {
            this.lastStateName = currentScenarioConfig.name;
            this.lastStep = currentStep;
            this.elapsedGoodTime = 0;
            this.settleTimer = 1.0;


            // Set Baseline for the new mode (Relative to Native)
            const multiplier = currentScenarioConfig.pixelRatioScale || 1.0;
            const baseline = isClarityMode ? nativeDPR : (nativeDPR * multiplier);

            if (currentRatio !== baseline) {
                renderer.setPixelRatio(baseline);
                return true;
            }
            return false;
        }

        // 2. Settle Period (Avoid flickering during state init)
        if (this.settleTimer > 0) {
            this.settleTimer -= delta;
            return false;
        }

        // --- 3. DUAL-PRIORITY LOGIC ---
        const scenarioScale = currentScenarioConfig.pixelRatioScale || 1.0;
        const baseline = nativeDPR * scenarioScale;

        // A. CLARITY MODE (Chaos/Root/Entrance)
        if (isClarityMode) {
            // Logic: Stay Native unless we hit rock bottom (< 30 FPS)
            if (rawFps < 30) {
                if (currentRatio > 1.01) {
                    renderer.setPixelRatio(1.0); // Reset to standard quality to save the experience
                    return true;
                }
            } else if (rawFps > 45) {
                // If recovered, try to climb back to Native
                if (currentRatio < nativeDPR - 0.01) {
                    this.elapsedGoodTime += delta;
                    if (this.elapsedGoodTime > 2.0) {
                        renderer.setPixelRatio(Math.min(nativeDPR, currentRatio + 0.1));
                        this.elapsedGoodTime = 0;
                        return true;
                    }
                }
            }
        }
        // B. STABILITY MODE (Interaction/Room)
        else if (isStabilityMode) {
            const smoothedFps = (window.scene && window.scene.fpsStats) ? window.scene.fpsStats.avg : rawFps;

            // EMERGENCY PANIC: If we drop below 40 FPS, reset to baseline immediately
            if (rawFps < 40) {
                if (currentRatio > baseline + 0.01) {
                    renderer.setPixelRatio(baseline);
                    this.elapsedGoodTime = 0;
                    return true;
                }
            }
            // SOFT DOWN: If struggling (40-50 FPS), step down gradually towards baseline
            else if (rawFps < 50) {
                if (currentRatio > baseline + 0.1) {
                    renderer.setPixelRatio(Math.max(baseline, currentRatio - 0.1));
                    this.elapsedGoodTime = 0;
                    return true;
                }
            }
            // GRADUAL UPGRADE: Only if > 56 FPS (Rock Solid 60 target)
            else if (smoothedFps > 56) {
                this.elapsedGoodTime += delta;
                if (this.elapsedGoodTime >= 5.0) { // Increased to 5s for better stability
                    if (currentRatio < baseline - 0.01) {
                        renderer.setPixelRatio(Math.min(baseline, currentRatio + 0.05));
                        this.elapsedGoodTime = 0;
                        return true;
                    }
                }
            } else {
                this.elapsedGoodTime = 0; // Reset streak if between 50-56
            }
        }

        return false;
    }
};

/**
 * Test Helpers for Device Pixel Ratio adjustment
 * Usage: dprI (Increase) | dprD (Decrease)
 */
export const dprI = (amount = 0.5) => {
    if (!window.scene || !window.scene.renderer) return;
    const oldDPR = window.scene.renderer.getPixelRatio();
    const newDPR = oldDPR + amount;
    window.scene.renderer.setPixelRatio(newDPR);

};

export const dprD = (amount = 0.5) => {
    if (!window.scene || !window.scene.renderer) return;
    const oldDPR = window.scene.renderer.getPixelRatio();
    const newDPR = Math.max(0.1, oldDPR - amount);
    window.scene.renderer.setPixelRatio(newDPR);

};

// Auto-expose to window for console usage
if (typeof window !== 'undefined') {
    window.dprI = dprI;
    window.dprD = dprD;
}
