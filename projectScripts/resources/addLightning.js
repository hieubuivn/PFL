import * as THREE from 'three';

// --- CONSTANTS ---
const WHITE = new THREE.Color('#88B0FF');
const BLACK = new THREE.Color('black');
const MOON_COL = new THREE.Color('#b9d1ff');



/**
 * Manages the lightning strike simulation, updating uniforms and lights.
 * @param {object} dependencies - Object containing scene-specific dependencies.
 * @param {number} [ratio] - Ratio (0-1) to force a strike; if undefined, Math.random() is used.
 * @param {number} [normalizedStrikePosX=-2] - X position for the strike (-1 to 1) if manual. -2 if auto.
 * @param {boolean} [isLoopTrigger=false] - Internal flag to manage recursion/looping.
 */

// Returns 0.002 for x >= 0.4, and decays exponentially towards 0.0006 for x < 0.4.
function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

// export function monotonicallyDecreasing(x) {
//     const VALUE_FLOOR = 0.0006;
//     const CRITICAL_POINT = 0.4;
//     const START_VALUE = 0.002;
//     const DECAY_RATE_K = 5.0;

//     if (x >= CRITICAL_POINT) {
//         return START_VALUE;
//     }

//     const DECAY_RANGE = START_VALUE - VALUE_FLOOR;
//     const distance = CRITICAL_POINT - x;
//     const decayFactor = Math.exp(-DECAY_RATE_K * distance);

//     return VALUE_FLOOR + DECAY_RANGE * decayFactor;
// }


// Variable to store the interval ID (module scope)
let lightningInterval = null;

export function lightningStrike(dependencies, ratio, normalizedStrikePos = undefined, isLoopTrigger = true) {
    const { scene, windowLight } = dependencies;

    // Safeguard: Only run in Room state
    const isRoomActive = scene.scenarioState && scene.scenarioState.name === 'room';

    const hub = scene.globalUniformsHub;

    // --- Loop Logic ---
    if (isLoopTrigger) {
        if (lightningInterval) clearInterval(lightningInterval);
        lightningInterval = setInterval(() => {
            lightningStrike(dependencies, Math.random(), undefined, false);
        }, 3000);
    }

    if (!isRoomActive) return;

    // --- Safety Check ---
    if (!hub || !windowLight) return;

    // --- Strike Logic ---
    if (ratio > 0.6) {
        if (scene.scenarioState && scene.scenarioState.name !== 'room') return;

        // Use hub proxy access
        if (!hub.enableLightning.value && ratio !== 2) return;

        if (ratio < 1) {
            if (!normalizedStrikePos) normalizedStrikePos = new THREE.Vector2();
            normalizedStrikePos.x = getRandomFloat(0.045, 0.5);
            normalizedStrikePos.y = getRandomFloat(-0.9, 0.55);
        } else if (!normalizedStrikePos) {
            normalizedStrikePos = new THREE.Vector2(0, 0);
        }

        const minY = -0.9;
        const maxY = 0.55;
        const clampedY = Math.max(minY, Math.min(maxY, normalizedStrikePos.y));
        const strength = 1.0 - ((clampedY - minY) / (maxY - minY));

        hub.isStriking.value = true;
        // windowLight.visible = true; // [PERF_FIX] Avoid visible toggle
        hub.normalizedStrikePos.value.copy(normalizedStrikePos);

        windowLight.intensity = 1000000 * (0.5 + 2.5 * (1 + strength) * (1 + strength));
        windowLight.distance = 30 + (150 - 36.6) * strength;
        windowLight.decay = 2.4 - (0.6 * strength);

        const duration = 100 + (400 * strength);

        setTimeout(() => {
            hub.isStriking.value = false;
            // windowLight.visible = false; // [PERF_FIX] Avoid visible toggle
            windowLight.intensity = 0; // Reset to ghost intensity
        }, duration);
    }
}

// --- LIGHT SETUP FUNCTION ---
export function addLightning(scene) {
    const windowLight = createSpotLight(scene);
    windowLight.intensity = 0;

    const strikeDependencies = {
        scene: scene,
        windowLight: windowLight
    };

    lightningStrike(strikeDependencies, Math.random());
    return windowLight;
}


function createSpotLight(scene) {
    const windowLight = new THREE.SpotLight();
    windowLight.angle = 2;

    windowLight.color = MOON_COL;
    windowLight.name = "windowLight";

    windowLight.position.set(0.00, 5.00, 40.00);
    windowLight.visible = true; // [PERF_FIX] Keep visible as 'Ghost' to avoid shader stalls on first strike
    scene.add(windowLight);
    scene.windowLight = windowLight;

    windowLight.castShadow = false

    windowLight.color = WHITE; 
    windowLight.intensity = 0; // Starts silent


    return windowLight;
}

