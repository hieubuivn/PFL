import * as THREE from 'three';
import * as CSU from '../utils/addConstantUniform.js';
import { resources } from './loadResources.js';
import TWEEN from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/tween.module.min.js';
// Define the radius as a constant in one place

//CENTER AROUND LATHE_CENTER WORLD POS
const FIREFLY_RADIUS = 15.0;

const startPosition = new THREE.Vector3(
    -FIREFLY_RADIUS,
    7.25,
    0
);

const vertexShader = `
    uniform float iTime;
    uniform vec2 uSmoothedMouse;
    uniform float uMergeProgress;
    uniform vec3 uPointMergePos;
    
    // Override Uniforms
    uniform float uOverrideActive; // 0.0 to 1.0 (Mix factor)
    uniform float uOverrideRow;
    uniform float uOverrideCol;

    uniform float uSizeFactor;
    uniform float uKamikazeScale;

    attribute float size;
    attribute float speed;
    attribute vec3 direction;
    attribute float random;

    const float radius =  ${FIREFLY_RADIUS.toFixed(1)};
    const float speedFactor = .006;
    const float PI = 3.1415926535;
    varying float vRandom; 

    void main() {
        vRandom = random; //for fragmentShader
        // 1. LIFECYCLE
        float lifeTime = (radius * 2.0) / (direction.x * speed * speedFactor);
        float cycleTime = mod(iTime + random * lifeTime, lifeTime);

        // 2. POSITION
        vec3 displacement = direction * speed * speedFactor * cycleTime;
  
        vec3 newPosition = position + displacement;
        newPosition.x *= 15.;

        // 4. BEHAVIOR SELECTION
        // "KAMIKAZE" (Fly toward camera) vs "ORBITAL" (Rotate gently)
        if (random > 0.8) {
             // --- TYPE: KAMIKAZE --- 
             // Reset orbit/rotation logic for these so they fly straight
             // Move along Z axis towards camera (positive Z in Three.js)
             // Use mod to loop them coming back from far distance
             float cameraSpeed = speed * 10.0; // Faster
             float zDist = 20.0;
             newPosition.z = mod(iTime * cameraSpeed + (random * 100.0), zDist) + 15.0; 
             
             // Interactive Wiggle: React to uSmoothedMouse
             // uSmoothedMouse.x moves Z (Left/Right), uSmoothedMouse.y moves Y (Up/Down)
             // We map standard mouse (-1 to 1) to a factor
             
             newPosition.x = position.x + sin(iTime + random * 10.0) * 2.0; 
             
             // Y reacts to Mouse Y with Randomized Damping
             // We use 'random' (0.0 to 1.0) to vary the strength.
             // Some particles will follow the mouse loosely (dampened), others more tightly.
             // Y reacts to Mouse Y with Randomized Damping & Simulated Wave Delay
             // 1. DAMPNESS: random^3 biases heavily towards 0, so we multiply by 40.0 to make the few "active" ones really move.
             float dampness = (random * random ); 
             
             // 2. DELAY: We simulate a signal traveling down the depth (X-axis)
             // As the wave passes (sin), the particle reacts more or less to the mouse.
             // This prevents them from all moving in perfect unison.
             float waveDelay = random + 0.4 * sin(iTime * 3.0 - position.x * 0.2); 

             newPosition.y = position.y + (cos(iTime + random * 10.0) * 2.0) + (uSmoothedMouse.y * dampness * waveDelay); 
             
             // Removed Z reaction to Mouse X as requested
        } else {
             // --- TYPE: ORBITAL ---
            // Apply the rotation to the x and y coordinates only for the points that need it
            vec2 pivot = vec2(${startPosition.y.toFixed(1)}, ${startPosition.z.toFixed(1)});
            float angle = iTime * 0.09; 
            mat2 rotationMatrix = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
            newPosition.yz = rotationMatrix * (newPosition.yz - pivot) + pivot;
        }
        

        // 4. SIZE
        // Synchronize breathing rhythm with texture change speed (3.0 * random)
        float syncSpeed = 3.0 * random;
        float pulsatingSize = size + 15.0 * sin(iTime * syncSpeed + random * 100.0);
    
        // if ( newPosition.z > 0. || newPosition.y < 0.) {
        //     pulsatingSize = 0.0;
        // }
        // 5. PROJECTION
        // Apply Merge Blending:
        // Apply Staggered Convergence:
        // uMergeProgress goes 0 -> 1 linearly.
        // Stagger: localProgress = smoothstep(random * 0.4, 1.0, uMergeProgress)
        
        float progressCycle = uMergeProgress; // No Modulo, just 0 -> 1 clamp effective via smoothstep
        
        // Wait offset based on random, so they don't all start moving at t=0
        float staggerStart = random * 0.4; // up to 40% delay start
        float localProgress = smoothstep(staggerStart, 1.0, progressCycle);
        
        vec3 finalPos = mix(newPosition, uPointMergePos, localProgress);
        
        vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
        
        // Conditional Size Multiplier:
        // Kamikaze (random > 0.8) -> 2.0
        // Orbital (random <= 0.8) -> 4.0 (Doubled as requested)
        float isOrbital = step(random, 0.8); 
        float sizeMult = 1.6 + (1.2 * isOrbital);

        // Apply Kamikaze Scale (0 to 1) via Uniform
        // If isOrbital is 0.0 (Kamikaze), we multiply by uKamikazeScale.
        // If isOrbital is 1.0, we multiply by 1.0 (no change).
        sizeMult *= mix(uKamikazeScale, 1.0, isOrbital);
        
        // Shrink points as they converge
        // Reduce to randomized small size (0.05 to 0.25) when progress is 1.0
        float randomTarget = 0.05 + (random * 0.2);
        // Reduce to randomized small size (0.05 to 0.25) when progress is 1.0
        // float randomTarget = 0.05 + (random * 0.2); // Already defined above
        float shrinkFactor = mix(1.0, randomTarget, localProgress);
        
        float calculatedSize = sizeMult * pulsatingSize * (5.0 / -mvPosition.z) * shrinkFactor;
        
        // Custom Logic: Discard Orbital points if X > 1.0
        // isOrbital is 1.0 if orbital, 0.0 if not.
        if (isOrbital > 0.5 && finalPos.x > 1.0) {
             calculatedSize = 0.0;
        }

        gl_PointSize = clamp(calculatedSize , 0.5, 30.0) * uSizeFactor;
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const fragmentShader = `
    uniform sampler2D fireFliesTexture;
    uniform float iTime;
    // Override Uniforms
    uniform float uOverrideActive;
    uniform float uOverrideRow;
    uniform float uOverrideCol;

    varying float vRandom; // <-- Receive the random value

    void main() {
        // Define the two possible colors
        vec3 orange = vec3(2.0, 0.8, 0.2);
        vec3 cyan = vec3(0.7, 1.8, 1.8); // A lightning cyan color

        // We hash vRandom to get a new random value for color, 
        // because vRandom is correlated with Behavior (Kamikaze > 0.8).
        float colorRandom = fract(sin(vRandom * 123.45) * 43758.5453);
        
        vec3 color;

        // If the random value is less than 0.5 (a 50% chance), use cyan.
        if (colorRandom < 0.5) {
            color = cyan;
        } else {
            color = orange;
        }

        // Sprite Sheet Logic
        float cols = 8.0;
        float rows = 4.0;
        
        // Intermittent Animation Logic
        // 1. Define Cycle
        float activeDuration = 1.5; // Animates for 1.5s
        float pauseDuration = 2.5;  // Pauses for 2.5s
        float totalCycle = activeDuration + pauseDuration;
        
        // 2. Local Time (Desynchronized)
        float localTime = iTime + (vRandom * 10.0);
        float timeInCycle = mod(localTime, totalCycle);
        
        // 3. Calc Stepped Time (Burst vs Pause)
        float animationSpeed = 20.0; // 10 FPS during burst
        float steppedTime = 0.0;
        
        if (timeInCycle < activeDuration) {
             // Active Phase: Animate
             steppedTime = floor(timeInCycle * animationSpeed);
        } else {
             // Pause Phase: Pick a NEW random frame for this specific pause cycle
             // We use 'floor(localTime / totalCycle)' to get the unique ID of the current cycle.
             float cycleIndex = floor(localTime / totalCycle);
             float randomSeed = sin(cycleIndex * 123.45 + vRandom * 67.89); 
             // Map -1..1 to 0..32
             float randomFrame = abs(randomSeed) * 32.0;
             steppedTime = floor(randomFrame);
        }

        float frameIndex = floor(mod((vRandom * 32.0) + steppedTime, 32.0));

        float col = mod(frameIndex, cols);
        float row = floor(frameIndex / cols);
        
        // Fix: Invert the row because texture coordinates (0,0) are bottom-left,
        // but often sprite sheets are read top-left to bottom-right.
        // OR simply because WebGL Y is flipped relative to image rows.
        row = row; // KTX2 Top-Left (No flip needed)

        // --- OVERRIDE LOGIC ---
        // If Override is active (uOverrideActive > 0), simple mix or hard switch
        // We do a hard switch if uOverrideActive > 0.5 to keyframe it, or mix?
        // User said "swap the texture", implying a replacement.
        
        // We override ROW and COL directly.
        if (uOverrideActive > 0.01) {
             float targetRow = uOverrideRow; // KTX2 Top-Left (No flip needed)
             
             // Smooth Mix or Hard Cut?
             // Mix introduces artifacts (cycling sprites). 
             // We use uOverrideActive as a threshold for hard cut, OR we just replace calculated row/col.
             // But we want to 'revert' later.
             
             // Let's use step for hard swap at 50% transition if we tween 0->1
             // OR if we just tween opacity, maybe we want mix?
             // Sprite indices are discrete. We cannot mix 3.0 and 5.0 to get 4.0.
             
             // Logic: If uOverrideActive is high enough, force the override frame.
             if (uOverrideActive > 0.1) {
                 col = uOverrideCol;
                 row = targetRow;
             }
        }

        // Flip V coordinate inside the cell
        vec2 cellUV = gl_PointCoord;
        // cellUV.y = 1.0 - cellUV.y; // Removed for KTX2 Top-Left origin

        vec2 uv = (cellUV + vec2(col, row)) / vec2(cols, rows);

        // Apply texture and intensity
        vec4 tex = texture2D(fireFliesTexture, uv);
        float intensity = pow(tex.a, 3.0); 

        // Set the final color with enhanced Glow/Halo
        float distToCenter = length(gl_PointCoord - 0.5);
        float halo = smoothstep(0.5, 0.0, distToCenter);
        float aura = pow(halo, 3.0) * mix(0.4, 1.2, uOverrideActive); // Boost aura during coin ritual
        
        gl_FragColor = vec4(color * (intensity + aura), 1.0);
    }
`;

export function addFireflies(scene, amount = 600) {

    const positions = new Float32Array(amount * 3);
    const sizes = new Float32Array(amount);
    const speeds = new Float32Array(amount);
    const directions = new Float32Array(amount * 3);
    const randoms = new Float32Array(amount);

    const vertex = new THREE.Vector3();
    const direction = new THREE.Vector3();

    for (let i = 0; i < amount; i++) {
        // Define the central starting point

        // Create a small, random offset from the center
        const offset = new THREE.Vector3().randomDirection().multiplyScalar(Math.random() * 5.0);
        // Apply the offset to get the final starting position
        vertex.copy(startPosition).add(offset);
        vertex.toArray(positions, i * 3);

        // Set a random direction for movement
        direction.x = Math.random() * 0.5 + 0.5;
        direction.y = (Math.random() - 0.5) * 1.0;
        direction.z = (Math.random() - 0.5) * 0.5;
        direction.normalize();
        direction.toArray(directions, i * 3);

        // Set unique attributes for each particle
        randoms[i] = Math.random();
        sizes[i] = 20.0;
        speeds[i] = Math.random() * 0.4 + 0.2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));
    geometry.setAttribute('direction', new THREE.BufferAttribute(directions, 3));
    geometry.setAttribute('random', new THREE.BufferAttribute(randoms, 1));

    // Note: The 'vertexShader' and 'fragmentShader' constants must be defined
    // outside this function, as in your original code.
    const hub = scene.globalUniformsHub;
    const hubUniforms = hub ? hub.uniforms : {};
    const hubCore = hub ? hub.core : {};

    const fireFliesTexture = resources.spriteSheet;
    const material = new THREE.ShaderMaterial({
        uniforms: {
            iTime: hubCore.iTime || { value: 0 },
            uMouse: hubCore.uMouse || { value: new THREE.Vector2(0, 0) },
            uSmoothedMouse: { value: new THREE.Vector2(0, 0) },
            fireFliesTexture: { value: fireFliesTexture },
            uMergeProgress: hubUniforms.uMergeProgress || { value: 0.0 },
            uPointMergePos: hubUniforms.uPointMergePos || { value: new THREE.Vector3(-0.6, 4.4, 0) },
            uOverrideActive: hubUniforms.uOverrideActive || { value: 0.0 },
            uOverrideRow: hubUniforms.uOverrideRow || { value: 0.0 },
            uOverrideCol: hubUniforms.uOverrideCol || { value: 0.0 },
            uSizeFactor: hubUniforms.uSizeFactor || { value: 1.0 }, // Changed 0.0 -> 1.0 default
            uKamikazeScale: hubUniforms.uKamikazeScale || { value: 0.0 }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        transparent: true,
        name: 'firefliesMat'
    });

    const fireflies = new THREE.Points(geometry, material);

    // --- SMOOTH MOUSE INTERPOLATION ---
    fireflies.onBeforeRender = () => {
        const target = material.uniforms.uMouse.value;
        const current = material.uniforms.uSmoothedMouse.value;
        const factor = 0.22; // High-frequency responsiveness
        current.x += (target.x - current.x) * factor;
        current.y += (target.y - current.y) * factor;
    };

    // --- TRIGGER FLASH METHOD ---
    fireflies.tweenFlashIn = null;
    fireflies.tweenFlashOut = null;

    fireflies.triggerFlash = (type) => {
        const specialIcons = resources.spriteSheetSpecialIcons;
        if (!specialIcons || !specialIcons[type.toLowerCase()]) {
            console.warn(`[Fireflies] No icon mapping found for type: ${type}`);
            return;
        }

        const mapping = specialIcons[type.toLowerCase()];
        const targetRow = mapping.row;
        const targetCol = mapping.col;

        const uniforms = fireflies.material.uniforms;

        // Update Uniforms for Icon Selection
        uniforms.uOverrideRow.value = targetRow;
        uniforms.uOverrideCol.value = targetCol;

        // CANCEL EXISTING TWEENS (Spam Management)
        if (fireflies.tweenFlashIn) fireflies.tweenFlashIn.stop();
        if (fireflies.tweenFlashOut) fireflies.tweenFlashOut.stop();

        // 1. FLASH IN (Active -> 1.0, Size -> 2.0)
        // We use a proxy object to sync multiple uniforms
        const startValues = {
            active: uniforms.uOverrideActive.value,
            size: uniforms.uSizeFactor.value
        };

        fireflies.tweenFlashIn = new TWEEN.Tween(startValues)
            .to({ active: 1.0, size: 1.6 }, 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate((obj) => {
                uniforms.uOverrideActive.value = obj.active;
                uniforms.uSizeFactor.value = obj.size;
            })
            .start();

        // 2. FLASH OUT (Active -> 0.0, Size -> 1.0)
        // Delayed reset
        const waitTime = 4000;

        // We start 'from' the target values of the IN tween to ensure continuity 
        // if this runs after IN completes.
        const resetValues = { active: 1.0, size: 1.6 };

        fireflies.tweenFlashOut = new TWEEN.Tween(resetValues)
            .to({ active: 0.0, size: 1.0 }, 1000)
            .delay(waitTime)
            .easing(TWEEN.Easing.Quadratic.Out) // Smooth exit
            .onUpdate((obj) => {
                uniforms.uOverrideActive.value = obj.active;
                uniforms.uSizeFactor.value = obj.size;
            })
            .onComplete(() => {
                fireflies.tweenFlashIn = null;
                fireflies.tweenFlashOut = null;
            })
            .start();
    };

    scene.add(fireflies);
    fireflies.name = "fireflies";
    scene.fireflies = fireflies;
    // fireflies.position.x = -10


    // const detector = new THREE.Object3D();
    // detector.name = "firefliesDetector";
    // // detector.add(fireflies);
    // scene.add(detector);
    return fireflies;
}