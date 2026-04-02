import * as THREE from 'three';
import { resources } from './loadResources.js';
import { GLOBAL_COLORS } from '../configs/sceneConfig.js';
import * as CONSTANTS from '../utils/constant.js'
import { constantUniform, linkConstantUniforms } from '../utils/addConstantUniform.js';
import { getDynamicText } from '../utils/contentUtils.js';
import { patchWaterFlow, patchGrid, patchDotaLogo } from '../utils/shaderPatches.js';
import { typingFS } from './typingFS.js';
// --- SHARED PATCH FUNCTIONS (Optimization: Maximize Shader Program Reuse) ---
// Three.js uses the onBeforeCompile function identity to cache programs.
// Using a named singleton instead of anonymous closures avoids redundant recombinations.
const sharedGridPatchHandler = function (shader) {
    if (this.uniforms) {
        patchGrid(shader, this.uniforms);
    }
};


export function createShaderMat(scene, fs, options = {}) {
    const {
        transparent = false,
        blending = THREE.AdditiveBlending,
        side = THREE.FrontSide,
        derivatives = false,
        uniforms = {}, // Local uniforms passed from the caller
        vs = CONSTANTS.vertexShader // Added: support custom vertex shader
    } = options;

    // Use the Hub's lean core set for all materials, avoiding 'kitchen sink' bloat
    const baseUniforms = scene.globalUniformsHub ? scene.globalUniformsHub.core : {};

    return new THREE.ShaderMaterial({
        vertexShader: vs,
        fragmentShader: fs,
        uniforms: {
            ...baseUniforms,
            ...uniforms
        },
        blending: blending,
        side: side,
        transparent: transparent,
        extensions: { derivatives: derivatives }
    });
}

export let fireMat, fireworksMat, typingMat, seaAndMoonMat, sunsetMat, netflixMat, netflixPCMat, dragonEyeMat, bloodDotaMat, dotaAcceptMat, fanBulbMat, fanBulbAuraMat;
export let screenLaptopMats, screenPCMats;

// Materials will be initialized inside adjustObjects

import { yieldToBrowser } from '../utils/asyncUtils.js';

export async function adjustObjects(scene, progressText) {
    if (progressText) progressText.innerText = getDynamicText("SYS_CONFIG_MATERIALS");

    // --- Initialize Materials with Scene Context ---
    const hub = scene.globalUniformsHub;
    const hubUniforms = hub ? hub.uniforms : {};

    fireMat = createShaderMat(scene, CONSTANTS.fireFS, {
        transparent: true,
        uniforms: {
            uFireHeightOverride: hubUniforms.uFireHeightOverride || { value: 0.0 },
            uSmoothedMouse: { value: new THREE.Vector2(0, 0) }
        }
    });
    fireworksMat = createShaderMat(scene, CONSTANTS.fireworksClockFS);
    typingMat = createShaderMat(scene, typingFS, {
        blending: THREE.NormalBlending,
        uniforms: {
            uBSODState: hubUniforms.uPCBSODState || { value: 0.0 },
            uIsPoba: hubUniforms.uIsPoba || { value: 0.0 },
            uHoverPos: { value: new THREE.Vector2(0, 0) },
            uTargetHoverPos: { value: new THREE.Vector2(0, 0) },
            uHoverActive: { value: 0.0 },
            uClickPos: { value: new THREE.Vector2(0.5, 0.5) },
            uClickTime: { value: -99.0 },
            uBootState: { value: 0.0 },
            uChannelAvatars: hubUniforms.uChannelAvatars || { value: null },
            uHasAvatarTexture: { value: 1.0 },
            uSpecialPos1: { value: new THREE.Vector2(0, 1) }, // Top Left
            uSpecialPos2: { value: new THREE.Vector2(2, 0) }  // Bot Right
        }
    });

    seaAndMoonMat = createShaderMat(scene, CONSTANTS.seaAndMoonFS, { blending: THREE.NormalBlending });
    sunsetMat = createShaderMat(scene, CONSTANTS.sunsetFS, { blending: THREE.NormalBlending });
    netflixMat = createShaderMat(scene, CONSTANTS.netflixFS, {
        blending: THREE.NormalBlending,
        derivatives: true,
        uniforms: {
            uBSODState: hubUniforms.uLaptopBSODState || { value: 0.0 },
            uNetflixStartTime: hubUniforms.uNetflixStartTime || { value: 0.0 },

        }
    });
    netflixPCMat = createShaderMat(scene, CONSTANTS.netflixFS, {
        blending: THREE.NormalBlending,
        derivatives: true,
        uniforms: {
            uBSODState: hubUniforms.uPCBSODState || { value: 0.0 },
            uNetflixStartTime: hubUniforms.uNetflixStartTime || { value: 0.0 }
        }
    });
    dragonEyeMat = createShaderMat(scene, CONSTANTS.dragonEyeFireFS, {
        depthWrite: false,
        depthTest: false,
        transparent: true,
        uniforms: {
            uEyeActive: { value: false },
            uOffsetY: { value: -0.017 },
            uEyeOpenness: { value: 0.0 },
            uEyeAngle: { value: -0.36 },
            uEyeScale: { value: 0.5 },
            uEyeFlameOffset: { value: new THREE.Vector2(0, 0.52) },
            uFlameScale: { value: new THREE.Vector2(0.5, 0.5) },
            uEyeScreenPosition: { value: new THREE.Vector2(0.6, 0.0) },
            uFireHeightOverride: hubUniforms.uFireHeightOverride || { value: 0.0 },
            uSmoothedMouse: { value: new THREE.Vector2(0, 0) }
        }
    });
    // shockwaveMat = createShaderMat(scene, CONSTANTS.pulseFS, {
    //     transparent: true,
    //     depthWrite: false,
    //     blending: THREE.AdditiveBlending,
    //     uniforms: {
    //         uClickTime: { value: -100.0 },
    //         uAspect: { value: window.innerWidth / window.innerHeight }
    //     }
    // });
    bloodDotaMat = createShaderMat(scene, CONSTANTS.bloodFS, {
        transparent: true,
        uniforms: {
            ...scene.globalUniformsHub.core,
            uSelectedSlot: { value: new THREE.Vector2(3, 1) },
            uGlowIntensity: { value: 0.05 },
            uBorderThickness: { value: 0.02 },
            uCurrentSpeed: { value: 5.0 },
            uIconScale: { value: 0.75 },
            uDarkness: { value: 0.74 },
            uAspect: { value: 1.77 } // Hardcoded 16:9 for PC screen
        }
    });

    dotaAcceptMat = createShaderMat(scene, CONSTANTS.dotaAcceptFS, {
        blending: THREE.NormalBlending,
        uniforms: {
            uBSODState: hubUniforms.uPCBSODState || { value: 0.0 },
            uAspect: { value: 1.77 } // Hardcoded 16:9 for PC screen
        }
    });

    // Update reference arrays
    screenLaptopMats = [fireworksMat, seaAndMoonMat, sunsetMat, netflixMat, bloodDotaMat, dotaAcceptMat];
    screenPCMats = [typingMat, netflixPCMat, bloodDotaMat, dotaAcceptMat];

    // Inner Helper to apply logic once texture is ready
    const applyConfiguration = async (envTexture) => {
        const materialConfigs = [
            {
                name: ["screenDisplay001_1"],
                envMapIntensity: 10, metalness: 0.1, roughness: 0.5,
                envMapRotation: new THREE.Euler(0, 0.5, 0.5)
            },
            {
                name: ["verticalMonitorBody"],
                envMapIntensity: 10, metalness: 0, roughness: 0.15,
                envMapRotation: new THREE.Euler(0, 1.97, 0.39),
                toneMapped: false
            },

            //ceilingFan cFanBody
            // { name: "cFanBody", envMapIntensity: 1, metalness: 0, roughness: 0.1 },

            { name: "Object_0003_3", envMapIntensity: 1, metalness: 0, roughness: 0.32, envMapRotation: new THREE.Euler(0, Math.PI / 2, 0) }, //CHAIR
            { name: "shelf", envMapIntensity: 2.65, metalness: 0., roughness: 1, envMapRotation: new THREE.Euler(1.2, 0.1, 0.2), side: THREE.BackSide, toneMapped: true },
            { name: "mjolnir_low_mjolnir_hammer_0", envMapIntensity: 5, metalness: 1, roughness: 1, },
            { name: "Object_15", envMapIntensity: 20, metalness: 0.15, roughness: 0.5, }, // DESK FACE
            { name: "Object_15001", envMapIntensity: 2, metalness: 0.15, roughness: 0.2, envMapRotation: new THREE.Euler(Math.PI, -Math.PI / 2, -1) }, // DESK STAND

            { name: "book001", envMapIntensity: 20, metalness: 0, roughness: 1, envMapRotation: new THREE.Euler(Math.PI / 2, Math.PI / 2, 0) },
            // { name: ["Object_0001", "Circle004_0"], envMapIntensity: 2.2 },
            { name: "blackCat", envMapIntensity: 0.75, envMapRotation: new THREE.Euler(0, 1, 0), toneMapped: false },
            { name: "Object_108", envMapIntensity: 1 },
            { name: "leftWallFoot001", envMapIntensity: 0.5 },
            { name: "Object_17", envMapIntensity: 0.5 },

            // Ch23_Hair, Ch23_Suit, Ch23_Body, Ch23_Pants, Ch23_Shoes
            // CHARACTER
            // { name: "Ch23_Hair", envMapIntensity: 2, metalness: 0, roughness: 0 },
            // { name: "Ch23_Suit", envMapIntensity: 2, metalness: 0, roughness: 0 },
            { name: "Ch23_Body", envMapIntensity: 8, metalness: 0, roughness: 1, envMapRotation: new THREE.Euler(-2.17, -2.83, 0.73) },
            // { name: "Ch23_Pants", envMapIntensity: 10, metalness: 0, roughness: 0 },
            // { name: "Ch23_Shoes", envMapIntensity: 2, metalness: 0, roughness: 1 },
            // { name: "Ch23_Shirt", envMapIntensity: 2, metalness: 0, roughness: 0 },

            { name: "PokeBall__0002" },
            { name: "PokeBall__0002_1" },
            { name: "PokeBall__0002_2" },

            { name: "Model_0001" },// Model_0.001 - picture frame
            { name: "pictureLion", map: resources.avatarsCelShaded, envMapIntensity: 1.5, metalness: 0, roughness: 1 },
            { name: "PokeBall__0003" },
            { name: "PokeBall__0003_1" },
            { name: "PokeBall__0003_2" },

            { name: "pillow-small-2", envMapIntensity: 0.3 },
            { name: "pillow-small-1", envMapIntensity: 0.3 },


            //Sphere.001_0
            { name: "Sphere001_0", toneMapped: false },
            // { name: "stool", envMapIntensity: 1, envMapRotation: new THREE.Euler(1.06, -0.72, 0.06) },
            { name: "stool1" },
            { name: "stool2" },
            { name: "stool_seat", envMapIntensity: 5, envMapRotation: new THREE.Euler(0, -0.4, 0.2) },
            { name: "Object_8001" }, //window frame
            { name: "aegis", envMapIntensity: 5 },
            { name: "questionCube", envMapIntensity: 5, metalness: 0, roughness: 0 },
            { name: "Object_34001", envMapIntensity: 10, metalness: 0, roughness: 0.7, side: THREE.BackSide },
            { name: "Object_32", envMapIntensity: 2.5 },
            { name: "Object_31", envMapIntensity: 5, envMapRotation: new THREE.Euler(Math.PI, 0, 0) },
            { name: "Object_33", envMapIntensity: 2, envMapRotation: new THREE.Euler(Math.PI, 0, 0), roughness: 0 },
            { name: "Object_42001", envMapIntensity: 6 },
            { name: "Object_40001", envMapIntensity: 15, roughness: 0 },
            { name: "bedMain", envMapIntensity: 0.15, roughness: 1, envMapRotation: new THREE.Euler(Math.PI, Math.PI, Math.PI) },
            { name: "bedStand", envMapIntensity: 0.9, roughness: 1 },

            { name: "Object_0007", toneMapped: false, envMapIntensity: 0.4 }, //caseCover

            //Blackhole
            { name: "Lathe_S_Blackhole_01_0", toneMapped: false, emissiveIntensity: 0.7 },

            //DRONE PARTS
            { name: "Circle_0", envMapIntensity: 3.5, roughness: 0.1 },
            { name: "Cube_1", envMapIntensity: 1.5, roughness: 0.1 },
            { name: "Circle002_0", envMapIntensity: 6, roughness: 0.1 },

        ];

        // 1. Build a lookup map for faster config lookups
        const configMap = new Map();
        for (const config of materialConfigs) {
            const names = Array.isArray(config.name) ? config.name : [config.name];
            for (const n of names) configMap.set(n, config);
        }


        let lastYieldTime = performance.now();
        let itemsProcessed = 0;

        // 2. Deep traversal with manual stack to allow asynchronous yielding
        const objectCount = 600;
        const stack = [scene];

        while (stack.length > 0) {
            const obj = stack.pop();

            if (obj.name && configMap.has(obj.name)) {
                const config = configMap.get(obj.name);
                const { name: _, ...props } = config;

                obj.traverse((child) => {
                    if (child.isMesh && child.material) {
                        child.material.envMap = envTexture;
                        Object.assign(child.material, props);
                    }
                });
            }

            if (obj.children) {
                for (let i = obj.children.length - 1; i >= 0; i--) {
                    stack.push(obj.children[i]);
                }
            }

            itemsProcessed++;
            if (itemsProcessed % 50 === 0 && (performance.now() - lastYieldTime > 8)) {
                await yieldToBrowser();
                lastYieldTime = performance.now();
                const progress = 0.2 + (Math.min(itemsProcessed / objectCount, 1.0) * 0.6);
                updateTaskProgress('model-assembly', progress);
            }
        }

        scene.isAdjusted = true;
    };

    // Fix Double HDR Load: Check if Main.js already loaded it

    if (resources.environmentMap) {
        await applyConfiguration(resources.environmentMap);
    } else if (scene.environment) {
        await applyConfiguration(scene.environment);
    } else {
        // Fallback or skip
    }

    //
    // SPECIFIC OBJECTS
    let laptopScreen = scene.getObjectByName("Object_34001");
    if (laptopScreen) laptopScreen.material = fireworksMat;
    laptopScreen.material.side = THREE.BackSide;

    // --- MONITOR LAYOUT CONTROL ---
    // shared typingMat with geometry-based layout switching

    // 1. Horizontal PC Screen (Full IDE)
    //apply the same effect to screenDisplay002
    const screenDisplay2 = scene.getObjectByName("screenDisplay002");
    if (screenDisplay2) {
        screenDisplay2.material = typingMat;
        screenDisplay2.userData.originalMaterial = typingMat;

        // Mode 2: Secondary Monitor (Right half of panoramic graph)
        const count = screenDisplay2.geometry.attributes.position.count;
        screenDisplay2.geometry.setAttribute('aLayoutMode', new THREE.BufferAttribute(new Float32Array(count).fill(2.0), 1));
    }
    const screenDisplay = scene.getObjectByName("screenDisplay001");
    if (screenDisplay) {
        screenDisplay.material = typingMat;
        screenDisplay.userData.originalMaterial = typingMat;

        // SMOOTH MOUSE INTERPOLATION
        screenDisplay.onBeforeRender = () => {
            if (!typingMat.uniforms.uHoverPos || !typingMat.uniforms.uTargetHoverPos) return;
            const target = typingMat.uniforms.uTargetHoverPos.value;
            const current = typingMat.uniforms.uHoverPos.value;
            const factor = 0.12; // Smoothing factor

            // If uHoverActive is low (leaving), we can either stop or lerp to 0.5/0.5
            // But let's just keep lerping while relevant
            current.x += (target.x - current.x) * factor;
            current.y += (target.y - current.y) * factor;

            // Optional: Snap if very close
            if (current.distanceTo(target) < 0.001) current.copy(target);

            // SPECIAL AVATAR SHUFFLE (Interval)
            if (typingMat.uniforms.uIsPoba.value > 0.5) {
                const now = performance.now();
                if (!screenDisplay.userData.lastShuffleTime) screenDisplay.userData.lastShuffleTime = now;
                if (now - screenDisplay.userData.lastShuffleTime > 5000) { // 5s interval
                    screenDisplay.userData.lastShuffleTime = now;

                    const updatePos = (vec) => {
                        const idx = Math.round(vec.y * 3 + vec.x);
                        const nextIdx = (idx + 1) % 6;
                        vec.x = nextIdx % 3;
                        vec.y = Math.floor(nextIdx / 3);
                    };

                    updatePos(typingMat.uniforms.uSpecialPos1.value);
                    updatePos(typingMat.uniforms.uSpecialPos2.value);
                }
            }
        };

        // Mode 0: Split (Phone + Code)
        const count = screenDisplay.geometry.attributes.position.count;
        screenDisplay.geometry.setAttribute('aLayoutMode', new THREE.BufferAttribute(new Float32Array(count).fill(0.0), 1));
    }

    // 2. Vertical Monitor (Code Only)
    const verticalMonitorDisplay = scene.getObjectByName("verticalMonitorDisplay");
    if (verticalMonitorDisplay) {
        verticalMonitorDisplay.material = typingMat;
        verticalMonitorDisplay.userData.originalMaterial = typingMat;

        // Mode 1: Full Code (No Phone)
        const count = verticalMonitorDisplay.geometry.attributes.position.count;
        verticalMonitorDisplay.geometry.setAttribute('aLayoutMode', new THREE.BufferAttribute(new Float32Array(count).fill(1.0), 1));
    }

    // scene.getObjectByName("deskStandInnerPlate").material = dragonEyeMat;

    const wallArea = scene.getObjectByName("wallArea");
    if (wallArea) {
        wallArea.material = dragonEyeMat;
        // --- SMOOTH MOUSE INTERPOLATION (SLOWER) ---
        wallArea.onBeforeRender = () => {
            const target = dragonEyeMat.uniforms.uMouse.value;
            const current = dragonEyeMat.uniforms.uSmoothedMouse.value;
            const factor = 0.06; // Faster (doubled from 0.02)
            current.x += (target.x - current.x) * factor;
            current.y += (target.y - current.y) * factor;
        };

        // Calculate Mesh Aspect Ratio
        const meshAspect = wallArea.scale.x / wallArea.scale.y;
        dragonEyeMat.uniforms.uDragonEyeAspect = { value: meshAspect };
    }

    dragonEyeMat.visible = false
    const caseCoverArea = scene.getObjectByName("caseCoverArea");
    if (caseCoverArea) {
        caseCoverArea.material = fireMat;
        // --- SMOOTH MOUSE INTERPOLATION ---
        caseCoverArea.onBeforeRender = () => {
            const target = fireMat.uniforms.uMouse.value;
            const current = fireMat.uniforms.uSmoothedMouse.value;
            const factor = 0.22; // High-frequency responsiveness
            current.x += (target.x - current.x) * factor;
            current.y += (target.y - current.y) * factor;
        };
    }
    // const shockwavePlane = scene.getObjectByName('shockwavePlane');
    // if (shockwavePlane) {
    //     shockwavePlane.material = shockwaveMat;
    //     shockwavePlane.visible = false;
    // }
    // shockwaveMat.uniforms.uAspect = { value: window.innerWidth / window.innerHeight }; // Update this if needed to match mesh too



    const backChairArea = scene.getObjectByName('chairBack');
    if (backChairArea) {
        backChairArea.material = bloodDotaMat;
    }

    fanBulbMat = CONSTANTS.createInnerGlowMat("#FBC189", 1., 0.05);
    fanBulbMat.side = THREE.DoubleSide;


    fanBulbAuraMat = CONSTANTS.createOuterGlowMat("#FBC189", 1.5, 0.01, 6.5, THREE.FrontSide)
    // fanBulbMat.uniforms.uGlowIntensity.value = 0.05
    const fanBulbAura = scene.getObjectByName('cFanBulbAura');
    if (fanBulbAura) {
        fanBulbAura.material = fanBulbAuraMat;
    }
    const fanBulb = scene.getObjectByName('cFanBulb');
    if (fanBulb) {
        fanBulb.material = fanBulbMat;
    }



    // Patch Dota Logo to the Chair (Object_0003_3)
    // const chair = scene.getObjectByName('Object_0003_3');
    // if (chair && chair.material) {
    //     const hub = scene.globalUniformsHub;

    //     // Manually define local uniforms for the Dota Logo patch
    //     const dotaUniforms = {
    //         ...hub.core,
    //         uSelectedSlot: { value: new THREE.Vector2(3, 1) },
    //         uGlowIntensity: { value: 0.05 },
    //         uBorderThickness: { value: 0.02 },
    //         uCurrentSpeed: { value: 5.0 },
    //         uIconScale: { value: 1.0 },

    //     };

    //     const patchedMat = chair.material.clone();
    //     patchedMat.uniforms = dotaUniforms; // Expose for the customizer
    //     patchedMat.onBeforeCompile = (shader) => {
    //         // Use the uniforms from the material object itself
    //         const uniforms = patchedMat.uniforms;

    //         // Manually link uniforms to ensure they exist on the shader object
    //         shader.uniforms.iChannelSprite = uniforms.iChannelSprite;
    //         shader.uniforms.uSelectedSlot = uniforms.uSelectedSlot;
    //         shader.uniforms.uSpriteSize = uniforms.uSpriteSize;
    //         shader.uniforms.uSpritePixels = uniforms.uSpritePixels;
    //         shader.uniforms.uGlowIntensity = uniforms.uGlowIntensity;
    //         shader.uniforms.uBorderThickness = uniforms.uBorderThickness;
    //         shader.uniforms.uCurrentSpeed = uniforms.uCurrentSpeed;
    //         shader.uniforms.uIconScale = uniforms.uIconScale;
    //         if (hub) shader.uniforms.iTime = hub.uniforms.iTime;

    //         patchDotaLogo(shader, uniforms);
    //     };
    //     chair.material = patchedMat;
    // }
    // const geometry = new THREE.PlaneGeometry(2, 2);
    // const plane = new THREE.Mesh(geometry, dragonEyeMat);
    // // plane.position, rotation, scale are now irrelevant due to vertex shader override
    // plane.position.set(0, 5, 0);
    // plane.scale.set(5, 5, 1);
    // plane.rotation.set(0, Math.PI / 2, 0);

    // plane.name = 'testPlane';
    // scene.add(plane);

}

export async function patchGridToObjects(scene) {
    if (!scene.physicBodies || !scene.globalUniformsHub) {
        return;
    }

    const hub = scene.globalUniformsHub.uniforms;
    const CYAN = GLOBAL_COLORS.ELECTRIC_CYAN;
    const GOLD = GLOBAL_COLORS.ACCENT_GOLD;

    // 0. Initialize Cyan Pulse (shared by all dynamic bodies for reset flash)
    if (!scene.cyanPulseActive) scene.cyanPulseActive = { value: 0.0 };

    // --- STRATEGY DEFINITIONS (Static for Memoization) ---
    const dynamicStrategy = {
        ...hub,
        uWorldGridActive: hub.uWorldGridActive,
        uGroupGridActive: scene.cyanPulseActive,
        uBorderColor: { value: CYAN },
        uObjectStagger: { value: 0.5 } // Uniform stagger for grouped dynamic objects
    };

    const fixedStrategy = {
        ...hub,
        uWorldGridActive: hub.uWorldGridActive,
        uGroupGridActive: { value: 0.0 },
        uBorderColor: { value: GOLD },
        uObjectStagger: { value: 0.5 }
    };

    // Investigation Counters
    let totalMeshesPushed = 0;
    let totalClonesCreated = 0;
    let totalSkippedTooSmall = 0;
    const memoMap = new Map(); // Key: MaterialPropertyHash, Value: Map(Strategy -> PatchedMaterial)

    // Helper: Option I - Skip patching for tiny objects (screws, small clutter)
    const isTooSmall = (mesh) => {
        if (!mesh.geometry) return false;
        if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
        const size = new THREE.Vector3();
        mesh.geometry.boundingBox.getSize(size);
        const volume = size.x * size.y * size.z;
        return volume < 0.0001; // Reject extremely small clutter
    };

    // Helper: Option M - Content-based hashing to merge effectively identical materials
    const getMaterialHash = (mat) => {
        // If it's a custom shader, we must include the unique shader code in the hash
        if (mat.isShaderMaterial || mat.type === 'ShaderMaterial') {
            return `shader|${mat.fragmentShader.length}|${mat.vertexShader.length}|${mat.name || 'unnamed'}`;
        }

        const color = mat.color ? mat.color.getHex() : 0;
        const emissive = mat.emissive ? mat.emissive.getHex() : 0;
        const eIntensity = mat.emissiveIntensity ?? 0;

        // Check all standard texture slots
        const map = mat.map ? mat.map.uuid : 'n1';
        const aMap = mat.alphaMap ? mat.alphaMap.uuid : 'n2';
        const nMap = mat.normalMap ? mat.normalMap.uuid : 'n3';
        const aoMap = mat.aoMap ? mat.aoMap.uuid : 'n4';
        const eMap = mat.emissiveMap ? mat.emissiveMap.uuid : 'n5';

        const metal = mat.metalness ?? 0;
        const rough = mat.roughness ?? 1;
        const opac = mat.opacity ?? 1;
        const trans = mat.transparent ? 1 : 0;
        const envInt = mat.envMapIntensity ?? 1;
        const side = mat.side ?? THREE.FrontSide;
        const tone = mat.toneMapped ? 1 : 0;

        // Handle envMapRotation (Euler)
        const rot = mat.envMapRotation ? `${mat.envMapRotation.x.toFixed(2)}|${mat.envMapRotation.y.toFixed(2)}|${mat.envMapRotation.z.toFixed(2)}` : '0';

        // Include Name as a ultimate tie-breaker for artistic intent (Blender distinction)
        const name = mat.name || 'unnamed';

        return `std|${name}|${color}|${emissive}|${eIntensity}|${map}|${aMap}|${nMap}|${aoMap}|${eMap}|${metal}|${rough}|${opac}|${trans}|${envInt}|${side}|${tone}|${rot}`;
    };

    const applyPatch = (mesh, uniforms) => {
        if (!mesh.material || mesh.material.isGridPatched) return;

        // Skip tiny objects to save compilation and fragment cost
        if (isTooSmall(mesh)) {
            totalSkippedTooSmall++;
            return;
        }

        totalMeshesPushed++;

        // 1. Generate Property Hash for Memoization
        const hash = getMaterialHash(mesh.material);

        let strategyMap = memoMap.get(hash);
        if (!strategyMap) {
            strategyMap = new Map();
            memoMap.set(hash, strategyMap);
        }

        let patchedMat = strategyMap.get(uniforms);
        if (patchedMat) {
            mesh.material = patchedMat;
            return;
        }

        // 2. Not in cache -> Create New
        totalClonesCreated++;
        const newMat = mesh.material.clone();
        newMat.uniforms = uniforms;

        // Use the shared handler to enable Three.js to cache/reuse the compiled program
        newMat.onBeforeCompile = sharedGridPatchHandler;
        newMat.isGridPatched = true;

        // Cache it
        strategyMap.set(uniforms, newMat);
        mesh.material = newMat;
    };

    // 1. Process Physics Bodies
    let itemCounter = 0;
    const YIELD_CHUNK_SIZE = 5; // Process 5 bodies then yield
    let lastYield = performance.now();

    for (const body of scene.physicBodies) {
        const root = body.threeObject;
        if (!root) continue;

        itemCounter++;
        // Throttle: Yield every few items or if time exceeds 2ms
        if ((itemCounter % YIELD_CHUNK_SIZE === 0) || (performance.now() - lastYield > 2)) {
            await yieldToBrowser();
            lastYield = performance.now();
        }

        const name = root.name;

        // Determine Config Strategy
        let strategyUniforms = null;

        // A. ISOLATED: Stool (Local Animation + Global Hover)
        if (name === 'stool' || name === 'stool_bound') {
            if (!scene.stoolGridUniforms) {
                scene.stoolGridUniforms = {
                    ...hub,
                    uWorldGridActive: { value: 0.0 },     // Local Pulse
                    uWorldGridProgress: { value: 0.0 },   // Local Progress
                    uGroupGridActive: hub.uWorldGridActive,   // Global Link (Hover)
                    uGroupGridProgress: hub.uWorldGridProgress, // Global Link (Hover)
                    uBorderColor: { value: GOLD },
                    uObjectStagger: { value: 0.0 }
                };
            }
            strategyUniforms = scene.stoolGridUniforms;
        }
        // B. ISOLATED: Cats & Pokeballs (Local Click + Global Hover)
        else if (['Object_0003', 'Object_108', 'GLTF_created_0001', 'pokeball', 'pokeball2'].includes(name) || name.includes('pokeball')) {
            if (!scene.pokeballGridUniforms) {
                scene.pokeballGridUniforms = {
                    ...hub,
                    uWorldGridActive: { value: 0.0 }, // Local Click Trigger
                    uGroupGridActive: hub.uWorldGridActive, // Global Hover Reactivity
                    uWorldGridProgress: { value: 0.0 }, // Local Progress for Click
                    uGroupGridProgress: hub.uWorldGridProgress,
                    uBorderColor: { value: CYAN },
                    uObjectStagger: { value: 0.0 }
                };
            }
            strategyUniforms = scene.pokeballGridUniforms;
        }
        // C. GLOBAL: Dynamic vs Fixed
        else {
            strategyUniforms = (body.bodyType() === 0) ? dynamicStrategy : fixedStrategy;
        }

        root.traverse((child) => {
            if (child.isMesh) applyPatch(child, strategyUniforms);
        });
    }

    // Initialize the picture swap state based on current uniform value (if available)
    if (typingMat && typingMat.uniforms.uIsPoba) {
        swapPicture(typingMat.uniforms.uIsPoba.value > 0.5);
    }
}

/**
 * Global utility to swap the visible half of the cel-shaded avatar texture 
 * for standard materials (like pictureLion's frame).
 * @param {boolean} isPoba - If true, use the right half; otherwise, use the left.
 */
export function swapPicture(isPoba = true) {
    if (resources.avatarsCelShaded) {
        // We set these directly on the texture object. 
        // Standard materials respect these, while our custom ShaderMaterials 
        // in typingFS manually manage their UVs and remains unaffected.
        
        // KTX2 Orientation Fix: Use negative repeat.y and unit offset to flip vertically
        resources.avatarsCelShaded.repeat.set(0.5, -1.0);
        resources.avatarsCelShaded.offset.set(isPoba ? 0.0 : 0.5, 1.0);
    }
}