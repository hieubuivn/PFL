import * as THREE from 'three';
import { LEXICON } from './projectScripts/content-manager/content.js';
import { personaManager } from './projectScripts/content-manager/personaManager.js';
import { setupSCR } from './configs/setupSCR.js';
import TWEEN from 'tween';
import { Helper } from './configs/setupHelper.js';
import { Customizer } from './configs/setupCustomizer.js';
import { setupStats } from './configs/setupStats.js';
import { setupOrbitControl } from './configs/setupOrbitControl.js';
// import { rgbeLoader } from './configs/setupLoaders.js';
import { Model } from './projectScripts/resources/addModel.js';
import { runPointsScenario } from './projectScripts/scenario/runScenario.js';
import { addHUDFrame } from './projectScripts/resources/addHUDFrame.js';
import { addKnowhere } from './projectScripts/resources/knowhere.js';
import { addRapierBodyCustomizer } from './projectScripts/rapierPhysics/rapierBodyCustomizer.js';
import Points from './projectScripts/points/points.js';
import { createSceneMap, prepareObjectsForEntry, shootDroneBeam, updateDroneGaze } from './projectScripts/scenario/scenarioUtility.js';

import { Raycaster } from './projectScripts/raycast/addRaycaster.js';
import { initGridInteractions } from './projectScripts/interactions/grid.js';
import { initUIInteractions, runHeroPersonaCinematic } from './projectScripts/interactions/uiInteractions.js';
import { NavInteractions } from './projectScripts/interactions/navInteractions.js';
import { RAPIERWORLD, initializeRapier } from './projectScripts/rapierPhysics/addRapierWorld.js';
import { PixelRatioMaximizer, SCENARIO_STATES, GLOBAL_COLORS } from './projectScripts/configs/sceneConfig.js';
import * as RAYCAST_MODULE from './projectScripts/raycast/addRaycaster.js';
import * as B64_STRINGS from './projectScripts/utils/base64Strings.js';
import { BoneTracker } from './projectScripts/interactions/boneTracker.js';

// Expose to window for global access
window.RAYCAST = RAYCAST_MODULE;
window.B64 = B64_STRINGS;
window.GLOBAL_COLORS = GLOBAL_COLORS;


import { ConstantUniformsCustomizer, constantUniform, createGlobalUniformsHub } from './projectScripts/utils/addConstantUniform.js'; // Uncomment if needed
import { addObjectMaterialUniformCustomizer } from './projectScripts/utils/addObjectMaterialUniform.js';
import { initActButton } from './projectScripts/test/test.js';
import { initStatus, updateStatus } from './projectScripts/utils/status.js';
import { PerformanceLogger } from './projectScripts/utils/performanceLogger.js';
import { getDynamicText } from './projectScripts/utils/contentUtils.js';
// import { LoadingVeil } from './projectScripts/resources/addLoadingShader.js';


import { updateProgressUI, clearProgressMap, registerTask, completeTask, initKTX2Loader } from './configs/setupLoaders.js';
import { resources, loadCoreResources, loadSecondaryResources, preRegisterAllResources } from './projectScripts/resources/loadResources.js';


// import { gltfLoader, rgbeLoader, textureLoader, dracoLoader } from './configs/setupLoaders.js';
// import { resources } from './projectScripts/loadResources.js';

let camera, scene, renderer;
let orbitControl;
let helper, customizer;
let constantUniformCustomizer;
let stats;
let loadedModel;
let world;
let raycaster;
let pointsApp;
let lensflare
let uniformsHub;
// let loadingVeil;
// let resources;
const clock = new THREE.Clock();
// clock.stop();


// UI Elements (Needed for the Loading Phase)
const progressText = document.getElementById('progress-text');
const progressBar = document.getElementById('progress-bar');


function assignPresets() {
    let collectionSection = document.getElementById('experience-container');
    [scene, camera, renderer] = setupSCR({ alpha: true, domElement: collectionSection, useBackdrop: true });
    initKTX2Loader(renderer);
    orbitControl = setupOrbitControl(scene, camera, renderer, true);
    orbitControl.enableZoom = false;
    scene.renderer = renderer;
    scene.constantUniform = constantUniform;
    window.scene = scene; // Expose globally for UI system access

    // Initialize systems needed for HUD and Shaders
    raycaster = new Raycaster(scene, camera, renderer);
    uniformsHub = createGlobalUniformsHub({ scene, clock, raycaster, camera, domElement: renderer.domElement });

    // Attach persistent HUD frame to the camera
    addHUDFrame(scene);
    NavInteractions.init(scene);

    scene.clock = clock;
    scene.TWEEN = TWEEN;
    scene.maximizer = PixelRatioMaximizer;
    scene.targetAnimHz = 30; // Default to energy-saving 30Hz for Points/Transitions
    window.maximizer = PixelRatioMaximizer;
    // GUARD: If we are in the middle of a swing interaction, don't let integrity checks/drone interrupt
    // This is essentially P0 protection for the Hero's current sequence
    if (scene.isHeroAnimating) return;

    if (shootDroneBeam) {
        scene.shootDroneBeam = shootDroneBeam;
    }
    scene.updateDroneGaze = updateDroneGaze;
    // console.log(window.devicePixelRatio);
    // PERF: Pixel Ratio Guard (Protect high-DPR mobile/desktop)
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const dprLimit = isMobile ? 1.5 : 2.0;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprLimit));
    // console.log(window.devicePixelRatio);

    // loadingVeil = new LoadingVeil(scene);
}

function localizeConfigs() {

    // 2. Renderer Look & Feel
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    // renderer.toneMappingExposure = 0.25;
    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.CineonToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap; // Switched to PCF for testing 
    renderer.shadowMap.autoUpdate = false; // MANUALLY throttled in animate() for True Smoothness
    // PERF: Pixel Ratio Guard (Protect high-DPR mobile/desktop)
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const dprLimit = isMobile ? 1.5 : 2.0;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprLimit));
    scene.background = null; // Transparent background
}

function addWizards() {
    // stats = setupStats();
    // helper = new Helper(scene, camera, renderer, orbitControl);
    // customizer = new Customizer(scene, camera);
    // addRapierBodyCustomizer(scene);
    // constantUniformCustomizer = new ConstantUniformsCustomizer(scene);

    // addObjectMaterialUniformCustomizer(scene, 'knowhere');
    initStatus();

}

function getShaderDate(target = new THREE.Vector4()) {
    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth(); // 0 - 11
    const day = now.getDate();

    // Calculate fractional seconds since midnight
    const seconds = now.getHours() * 3600 +
        now.getMinutes() * 60 +
        now.getSeconds() +
        now.getMilliseconds() / 1000;

    target.set(year, month, day, seconds);

    return target;
}
async function init() {
    // --- MOBILE STRATEGY (Option A: Integrated Responsive CV) ---
    const urlParams = new URLSearchParams(window.location.search);
    const forceMobile = urlParams.get('mobile') === 'true';

    const isMobile = forceMobile || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    window.IS_MOBILE = isMobile;

    // --- MOBILE SKIP PROTOCOL (Option B: Lite Intro) ---
    if (isMobile) {
        document.body.classList.add('mobile-mode');
        // Ensure CV is visible and expanded
        const cvContainer = document.getElementById('cv-container');
        if (cvContainer) cvContainer.classList.remove('collapsed');

        // LITE INTRO: Simulate system initialization for the 'Wow' factor on mobile
        const liteIntro = async () => {
            const sysKeys = Object.keys(LEXICON).filter(k => k.startsWith('SYS_') && k !== 'SYS_ERROR' && k !== 'SYS_READY');
            
            // Show 3 random strings to establish persona
            for (let i = 0; i < 3; i++) {
                const randomKey = sysKeys[Math.floor(Math.random() * sysKeys.length)];
                const strings = LEXICON[randomKey].en;
                const randomStr = strings[Math.floor(Math.random() * strings.length)];
                
                updateProgressUI((i + 1) * 33, randomStr);
                await new Promise(r => setTimeout(r, 600));
            }
            
            updateProgressUI(100, LEXICON.SYS_READY.en[0]);
            await new Promise(r => setTimeout(r, 400));

            // Fast-track the bootloader finish
            if (window.bootLoader && typeof window.bootLoader.finish === 'function') {
                await window.bootLoader.finish();
            }

            const expContainer = document.getElementById('experience-container');
            if (expContainer) expContainer.style.display = 'none';
        };

        await liteIntro();
        return; // Early Exit (Skip Three.js)
    }

    assignPresets();
    initKTX2Loader(renderer);

    localizeConfigs(); // Contains renderer settings

    // Initialize World (Paused by default)
    await initializeRapier();
    world = new RAPIERWORLD(scene, { debuggerEnabled: false, isActive: false });

    addWizards();

    initStatus();
    initActButton(scene, clock);

    const quantumBreather = () => new Promise(r => setTimeout(r, 100));

    try {
        preRegisterAllResources();

        // --- 0. START LOADING PROGRESS ---
        window.loadingProgress = 0;

        registerTask('points-init', 20);      // Points generation & postprocessing
        registerTask('model-assembly', 20);   // Model traversal, shadow setup, material patching
        registerTask('physics-binding', 40);  // Rapier collider baking & body registration

        // 1. Parallel Pipelining: Start both phases immediately
        updateProgressUI(window.loadingProgress || 0, getDynamicText("SYS_RETRIEVING_ASSETS"));

        // Start phase 2 in background while phase 1 downloads and initializes
        const secondaryLoadingPromise = loadSecondaryResources();

        // Wait only for core points assets to begin interaction
        await loadCoreResources();
        await quantumBreather(); // Breather 1: Post-Download

        // 2. Points Setup
        updateProgressUI(window.loadingProgress || 0, getDynamicText("SYS_CALIBRATING_POINTS"));
        const CAMERA_POSITION = { x: 61.56, y: 2.97, z: 30 };
        camera.position.set(CAMERA_POSITION.x, CAMERA_POSITION.y, CAMERA_POSITION.z);

        PerformanceLogger.start('Points System Init');
        pointsApp = new Points(scene, camera, renderer, raycaster, { enableLoadingUI: false, enableBloom: true, enableControls: false });
        scene.pointsApp = pointsApp;
        initGridInteractions(scene);
        initUIInteractions(scene);

        await pointsApp.init();

        // --- REFACTORED KNOWHERE (Previously HUD STAR) ---
        // Add knowhere as a child of the points system for better 3D integration
        if (pointsApp.points) {
            const knowhereMesh = addKnowhere(pointsApp.points, scene);
            // Pass the screen position to the shader for mouse interaction
            if (knowhereMesh.material.uniforms) {
                knowhereMesh.material.uniforms.uStarScreenPos.value.set(0, 0);
                knowhereMesh.material.uniforms.uScaleFactor.value = 0.0;
            }

            // Positioning Logic: Center on bottom notch with uXOffset vertical shift
            const syncStarPosition = () => {
                const isRoom = (scene.scenarioState && scene.scenarioState.name === 'room');
                if (!scene.knowhere || !scene.knowhere.visible || !pointsApp.points || !scene.HUD || isRoom) {
                    // Reset interaction field even if mesh is gone/hidden to save GPU performance
                    if (pointsApp.material && pointsApp.material.uniforms.uKnowhereScale) {
                        pointsApp.material.uniforms.uKnowhereScale.value = 0.0;
                    }
                    if (scene.knowhere) scene.knowhere.visible = false;
                    return;
                }

                const resX = renderer.domElement.clientWidth;
                const resY = renderer.domElement.clientHeight;

                // Extract metrics from HUD uniforms
                const hMarginPct = scene.HUD.material.uniforms.uMarginPct.value;
                const vMarginOffset = scene.HUD.material.uniforms.uVerticalMarginPct.value;
                const vMarginPx = resY * (hMarginPct + vMarginOffset);
                const hMarginPx = resY * hMarginPct;

                // Inner frame dimensions
                const boxSizeX = (resX - hMarginPx * 2.0) * 0.5;
                const boxSizeY = (resY - vMarginPx * 2.0) * 0.5;

                const bNotchH = (boxSizeY * 2.0) * (scene.HUD.material.uniforms.uBNotchHRatio?.value || 0.0);
                const rNotchW = (boxSizeY * 2.0) * (scene.HUD.material.uniforms.uRNotchHRatio?.value || 0.0); // rNotchW is scaled by height in shader

                // uHudOffset mapping: x (0: center, 1: right), y (-1: bottom, 0: center, 1: top)
                const uOff = scene.knowhere.material.uniforms.uHudOffset.value;
                const ux = uOff.x;
                const uy = uOff.y;

                // Base Position
                let targetHUDX = ux * boxSizeX;
                let targetHUDY = uy * boxSizeY;

                // Apply Notch corrections
                // 1. Right Notch pull: only if we are on the horizontal axis (y=0) and pushing right
                if (Math.abs(uy) < 1.0) {
                    targetHUDX -= (1.0 - Math.abs(uy)) * rNotchW * ux;
                }

                // 2. Bottom Notch lift: only if we are on the vertical axis (x=0) and pushing bottom
                if (Math.abs(ux) < 1.0 && uy < 0.0) {
                    targetHUDY += (1.0 - Math.abs(ux)) * bNotchH * Math.abs(uy);
                }

                const baseNDC = new THREE.Vector2(targetHUDX / (resX * 0.5), targetHUDY / (resY * 0.5));

                // --- REFINED: Sentinel Settle-First Logic ---
                const uData = scene.knowhere.userData;
                if (!uData.smoothedNDC) uData.smoothedNDC = baseNDC.clone();
                if (!uData.lastBaseNDC) uData.lastBaseNDC = baseNDC.clone();
                if (!uData.smoothedDist) uData.smoothedDist = camera.position.length();

                const smoothed = uData.smoothedNDC;
                const mouseNDC = raycaster.pointer;

                // 1. Detect if the "Home" state just moved (e.g. Scrolling)
                const transitioning = scene.isTransitioning || (pointsApp && pointsApp.isMorphing);
                const stateMoved = baseNDC.distanceTo(uData.lastBaseNDC) > 0.0001;

                if (transitioning || stateMoved) {
                    // --- SYNC MODE: Lock 1:1 to the TWEEN during morphs ---
                    smoothed.copy(baseNDC);
                    uData.isSettling = true;
                    uData.settleFrameCount = 0;
                } else {
                    // --- SENTINEL MODE: Settle first, then follow guest ---
                    let targetPos = baseNDC; // Head Home
                    if (!uData.isSettling) {
                        targetPos = mouseNDC; // Follow cursor
                    } else {
                        // Check if we are close enough to Home to start following guest
                        if (smoothed.distanceTo(baseNDC) < 0.005) {
                             uData.settleFrameCount = (uData.settleFrameCount || 0) + 1;
                             if (uData.settleFrameCount > 40) uData.isSettling = false; // Settle for ~0.6s
                        }
                    }

                    const followFactor = 0.0015; // Increased (2x of previous 0.00075)
                    smoothed.x += (targetPos.x - smoothed.x) * followFactor;
                    smoothed.y += (targetPos.y - smoothed.y) * followFactor;
                }

                uData.lastBaseNDC.copy(baseNDC);

                const xNDC = smoothed.x;
                const yNDC = smoothed.y;

                // Sync the ripple center uniform
                if (scene.knowhere.material.uniforms.uStarScreenPos) {
                    scene.knowhere.material.uniforms.uStarScreenPos.value.set(xNDC, yNDC);
                }

                const screenPos = new THREE.Vector2(
                    (xNDC * 0.5 + 0.5) * resX,
                    (yNDC * 0.5 + 0.5) * resY
                );

                if (pointsApp && pointsApp.material && pointsApp.material.uniforms.uKnowhereScreen) {
                    pointsApp.material.uniforms.uKnowhereScreen.value.copy(screenPos);
                    pointsApp.material.uniforms.uKnowhereScale.value = scene.knowhere.material.uniforms.uScaleFactor.value;
                }

                // --- VIBRATION FIX: Smooth the unprojected distance ---
                const rawDistance = Math.max(10.0, camera.position.length() - 0.1);
                uData.smoothedDist += (rawDistance - uData.smoothedDist) * 0.05; 

                // Project from screen space to world space
                const vector = new THREE.Vector3(xNDC, yNDC, 0.5);
                vector.unproject(camera);
                const dir = vector.sub(camera.position).normalize();

                const pos = camera.position.clone().add(dir.multiplyScalar(uData.smoothedDist));

                // PERFORMANCE: Check if world position has changed significantly before updating (Stop Jitter)
                const lastPos = uData.lastMeshPos || new THREE.Vector3();
                if (pos.distanceTo(lastPos) > 0.0001) {
                    pointsApp.points.worldToLocal(pos);
                    scene.knowhere.position.set(pos.x, pos.y, pos.z);
                    uData.lastMeshPos = pos.clone();
                }
            };

            // Initial sync and event linking
            setTimeout(syncStarPosition, 100);
            window.addEventListener('resize', syncStarPosition);
            window.addEventListener('cvToggle', () => setTimeout(syncStarPosition, 400));
            window.addEventListener('personaChanged', () => setTimeout(syncStarPosition, 100));

            // Allow dynamic tracking by adding it to the update loop
            scene.onUpdate = scene.onUpdate || [];
            scene.onUpdate.push(syncStarPosition);
        }

        completeTask('points-init');
        PerformanceLogger.end('Points System Init');

        await quantumBreather(); // Breather 2: Post-Points Initialization
        await quantumBreather(); // Extra breathing room for GPU shaders

        // 3. Model Initialization
        updateProgressUI(window.loadingProgress || 0, getDynamicText("SYS_INIT_MODELS"));

        // Ensure background downloads are finished
        await secondaryLoadingPromise;
        await quantumBreather(); // Breather 3: Post-Secondary Download

        loadedModel = new Model(scene, camera, renderer, resources);
        scene.loadedModel = loadedModel; // ATTACH FOR GLOBAL ACCESS (Required by scenarioUtility)
        // Pass pointsApp to allow warming the composer context
        await loadedModel.init(progressText, progressBar, { skipCompile: false, pointsApp: pointsApp });

        // --- GOLF RITUAL logic has been moved to uiInteractions.js:runHeroPersonaCinematic ---

        // --- BONE TRACKER (ACTIVE TOGGLE) ---
        const boneTracker = new BoneTracker(scene, "mixamorigRightHandMiddle1");
        scene.onUpdate = scene.onUpdate || [];
        scene.onUpdate.push(() => boneTracker.update());
        window.boneTracker = boneTracker;

        // Global key listener for T (Toggle tracking for #persona-switch-btn)
        window.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.key.toLowerCase() === 't') {
                runHeroPersonaCinematic(scene);
            }
        });

        // Whenever persona is changed (via UI or otherwise), trigger the combat sequence too
        window.addEventListener('audienceChanged', () => {
            if (!scene.isHeroAnimating) {
                runHeroPersonaCinematic(scene);
            }
        });

        await quantumBreather(); // Breather 4: Post-Model Assembly

        // --- 5. PHYSICS BINDING ---
        // (Handled internally by Model.init sequence to ensure correct asset-to-collider sync)
        await quantumBreather();

        await quantumBreather(); // Final breather before scene map creation

        // --- 6. FINAL SHADER WARMUP (Global Scene) ---
        updateProgressUI(window.loadingProgress || 0, getDynamicText("SYS_WARMING_ENGINES"));

        if (pointsApp && typeof pointsApp.warmup === 'function') {
            const roomModel = scene.getObjectByName('roomGLBModel');
            let roomOriginalPos = new THREE.Vector3();
            let roomFrustumStates = new Map();

            if (roomModel) {
                // console.log("[Warmup] Anchoring Room model for GPU upload...");
                roomOriginalPos.copy(roomModel.position);
                roomModel.position.set(0, 0, 0);
                roomModel.visible = true;

                // [STALL FIX] Collect all unique textures and materials for Progressive Warmup
                const textures = new Set();
                const materials = new Set();

                roomModel.traverse(child => {
                    if (child.isMesh) {
                        roomFrustumStates.set(child.uuid, child.frustumCulled);
                        child.frustumCulled = false;

                        if (child.material) {
                            const mats = Array.isArray(child.material) ? child.material : [child.material];
                            mats.forEach(m => {
                                materials.add(m);
                                for (let key in m) {
                                    if (m[key] && m[key].isTexture) textures.add(m[key]);
                                }
                            });
                        }
                    }
                });

                // Phase 1: Progressive Texture Initialization (yield between uploads)
                // console.log(`[Warmup] Initializing ${textures.size} textures progressively...`);
                for (const tex of textures) {
                    renderer.initTexture(tex);
                    // Yield to browser every texture to keep UI responsive
                    await new Promise(r => requestAnimationFrame(r));
                }
            }

            // PROACTIVE BRANCH WARMING (HUD):
            const hud = scene.HUD;
            let hudOriginals = {};
            if (hud && hud.material && hud.material.uniforms) {
                const hUni = hud.material.uniforms;
                hudOriginals = {
                    uVerticalMarginPct: hUni.uVerticalMarginPct.value,
                    uCutSize: hUni.uCutSize.value,
                    uBNotchHRatio: hUni.uBNotchHRatio.value,
                    uBNotchWRatio: hUni.uBNotchWRatio.value,
                    uIslToMainWRatio: hUni.uIslToMainWRatio.value,
                    uRNotchHRatio: hUni.uRNotchHRatio.value,
                    uRNotchWRatio: hUni.uRNotchWRatio.value,
                    uIsAutoElec: hUni.uIsAutoElec.value,
                    uGridLock: hUni.uGridLock.value
                };

                hUni.uVerticalMarginPct.value = 0.0;
                hUni.uCutSize.value = 10.0;
                hUni.uBNotchHRatio.value = 0.02;
                hUni.uBNotchWRatio.value = 0.6;
                hUni.uIslToMainWRatio.value = 0.32;
                hUni.uRNotchHRatio.value = 0.4;
                hUni.uRNotchWRatio.value = 0.02;
                hUni.uIsAutoElec.value = 1.0;
                hUni.uGridLock.value = 1.0;
                hud.visible = true;
            }

            try {
                const compileDelay = ms => new Promise(r => setTimeout(r, ms));

                // Phase 2: Segmented Shader Compilation (yield between meshes)
                // Instead of bulk compileAsync, we compile smaller chunks of the scene.
                // console.log("[Warmup] Segmented Scene Compilation...");
                const roomMeshes = [];
                roomModel.traverse(c => { if (c.isMesh) roomMeshes.push(c); });

                const CHUNK_SIZE = 5;
                for (let i = 0; i < roomMeshes.length; i += CHUNK_SIZE) {
                    const tasks = [];
                    for (let j = i; j < Math.min(i + CHUNK_SIZE, roomMeshes.length); j++) {
                        tasks.push(renderer.compileAsync(roomMeshes[j], camera));
                    }
                    await Promise.all(tasks);
                    await new Promise(r => requestAnimationFrame(r));
                }

                // Final pass for the Points system and full scene integration
                await renderer.compileAsync(scene, camera);
                await compileDelay(150); // Settlement window

                // B. GHOST RENDER (Second pass - Points System)
                // console.log("[Warmup] Engaging Points System...");
                pointsApp.warmup();
                await compileDelay(150);

                // --- VRAM STATUS REPORT ---
                const info = renderer.info;
                const mem = info.memory || {};
                // console.log(`%c[Warmup] System Ready. VRAM Usage: ${((mem.textures * 0 || 0) + (mem.geometries * 0 || 0))} - G: ${mem.geometries || 0}, T: ${mem.textures || 0}`, "color: #00FF00; font-weight: bold;");
            } catch (err) {
                // console.warn("[Warmup] Swallowed non-critical error during GPU priming:", err);
            }

            // RESTORE STATES
            if (hud && hud.material && hud.material.uniforms) {
                const hUni = hud.material.uniforms;
                for (const key in hudOriginals) {
                    hUni[key].value = hudOriginals[key];
                }
            }

            if (roomModel) {
                roomModel.visible = false;
                roomModel.position.copy(roomOriginalPos);
                roomModel.traverse(child => {
                    if (child.isMesh && roomFrustumStates.has(child.uuid)) {
                        child.frustumCulled = roomFrustumStates.get(child.uuid);
                    }
                });
            }
        } else {
            console.warn("[Warmup] Skipped: pointsApp or warmup function missing.");
        }

        await quantumBreather(); // Extra gap to ensure 100% bar sync

        // Refresh Map so scenarioUtility can find new objects
        createSceneMap(scene);
        prepareObjectsForEntry(scene);

        loadedModel.isLoaded = true;
        personaManager.setPointsApp(pointsApp);

        // Final UI clearance
        updateProgressUI(100);

        const totalLoadTime = ((performance.now() - window.bootStartTime) / 1000).toFixed(2);
        // console.log(`%c[SYSTEM] BOOT COMPLETE in ${totalLoadTime}s`, "color: #00F3FF; font-weight: bold;");

        // (Moved pointsApp init above)

        // Share pointsApp with personaManager
        personaManager.setPointsApp(pointsApp);

        // Final UI clearance
        updateProgressUI(100);

        // --- DISPERSE BOOT SHIELD (Eagerly) ---
        // We trigger this BEFORE the scenario starts so the user doesn't hang at 100% 
        // while waiting for the introductory scenario to initialize.
        if (window.bootLoader && typeof window.bootLoader.finish === 'function') {
            const board = document.getElementById('board');
            if (board) board.style.display = 'flex';
            await window.bootLoader.finish();
        }

        PerformanceLogger.printReport();

        // 4. Start Scenario
        await runPointsScenario({ scene, camera, orbitControl, clock, pointsApp });

        // --- Keyboard Interactions (Restored) ---
        let isRedBreath = false;
        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'b') {
                if (scene.HUD && typeof scene.HUD.breathe === 'function') {
                    // Toggle Color
                    isRedBreath = !isRedBreath;
                    const targetColor = isRedBreath ? GLOBAL_COLORS.CRIMSON_RED : GLOBAL_COLORS.ELECTRIC_CYAN;
                    scene.HUD.breathe(targetColor);
                }
            }
        });

        // --- CV Toggle Breathing ---
        window.addEventListener('cvToggle', (e) => {
            if (scene && scene.HUD && typeof scene.HUD.breathe === 'function') {
                const isCollapsed = e.detail ? e.detail.collapsed : false;
                const targetColor = isCollapsed ? GLOBAL_COLORS.CRIMSON_RED : GLOBAL_COLORS.ELECTRIC_CYAN;
                scene.HUD.breathe(targetColor);
            }
        }, { passive: true });

    } catch (error) {
        console.error("Fatal Error during Initialization:", error);
        updateProgressUI(window.loadingProgress || 0, getDynamicText("SYS_FAILURE"));

        // EMERGENCY EXIT: If it fails but we have at least some progress, 
        // allow the user to try and enter the site after a delay rather than hanging forever.
        setTimeout(() => {
            if (window.bootLoader && typeof window.bootLoader.finish === 'function') {
                window.bootLoader.finish();
            }
        }, 3000);
    }
}

let frameCounter = 0;

function animate() {
    // No manual RAF needed with setAnimationLoop scheduling

    frameCounter++;
    scene.frameCounter = frameCounter; // Expose for granular throttling
    const isHighPriorityFrame = (frameCounter % 2 === 0);
    scene.isHighPriorityFrame = isHighPriorityFrame; // Expose for physics/external systems

    // 3. Render Phase: Select Strategy based on Scenario config
    const stateConfig = scene.scenarioState || SCENARIO_STATES[0];
    const renderMode = stateConfig.renderer || 'composer';
    const isRoomActive = (renderMode !== 'composer');

    // PERFORMANCE: Shadow Map Throttling (Scenario-Aware)
    // We only update shadows during the 'room' state to save GPU while in Galaxy/Points modes.
    if (renderer.shadowMap.enabled && stateConfig.name === 'room' && !scene.isTransitioning && frameCounter % 3 === 0) {
        renderer.shadowMap.needsUpdate = true;
    }

    // --- 1. PRE-LOGIC SYNC (Measured as Logic) ---
    const frameStart = performance.now();

    // 1. Delta Guard
    const rawDelta = clock.getDelta();
    // PERFORMANCE FIX: During transitions, we allow a larger physics delta to maintain 
    // synchronization with TWEENs (which use system clock).
    const delta = (scene && scene.isTransitioning) ? Math.min(rawDelta, 0.25) : Math.min(rawDelta, 0.06);

    // Dynamic Performance Monitoring
    if (scene) {
        if (!scene.fpsStats) scene.fpsStats = { sum: 0, count: 0, avg: 60 };
        if (rawDelta > 0 && rawDelta < 1) {
            const currentFPS = 1 / rawDelta;
            const alpha = 0.05;
            scene.fpsStats.avg = (currentFPS * alpha) + (scene.fpsStats.avg * (1 - alpha));
            scene.fpsStats.count++;
        }

        // [Diagnostics] Trace any frame over 20ms
        if (scene.isTransitioning && rawDelta > 0.02) {
            scene._lastTotalTime = rawDelta * 1000;
        }
    }

    // --- 2. LOGIC PHASE (CPU) ---
    // TWEEN must run every frame for sub-pixel smoothness
    if (TWEEN) TWEEN.update();

    if (scene.onUpdate) scene.onUpdate.forEach(fn => fn(delta));

    if (raycaster && scene.isAdjusted && isRoomActive) raycaster.update();
    if (world && isRoomActive) world.update(delta);
    if (orbitControl) orbitControl.edgeControlUpdate();

    if (uniformsHub) uniformsHub.update(delta, raycaster ? raycaster.pointer : null);

    if (isHighPriorityFrame) {
        updateStatus(scene, 2);
    }

    // [PERF: GPU] Dynamic Pixel Ratio management with Scenario Throttle
    let targetState = scene.scenarioState || SCENARIO_STATES[0];
    if (scene.isTransitioning) {
        // [MITIGATION] Crash-throttle resolution to 0.2x during heavy Bloom + Assembly transition
        targetState = { ...targetState, pixelRatioScale: 0.2 };
    }

    if (PixelRatioMaximizer.update(delta, renderer, targetState)) {
        if (pointsApp && typeof pointsApp.onWindowResize === 'function') {
            pointsApp.onWindowResize();
        }
    }

    const logicEnd = performance.now();
    scene._lastLogicTime = logicEnd - frameStart;

    // 3. Render Phase: Select Strategy based on Scenario config
    const isTransitioning = scene && scene.isTransitioning;

    const renderStart = performance.now();
    if (pointsApp) {
        // BEAUTY RESTORATION: Allow Composer during transitions IF Bloom is still active (> 0.01).
        // Once Bloom fades out, we force Standard Renderer to save GPU for Room assembly.
        const bloomActive = pointsApp.bloomPass && pointsApp.bloomPass.strength > 0.01;

        if (renderMode === 'composer' && (!isTransitioning || bloomActive)) {
            // High-Effect Mode: Bloom + Composer (Point System + Active Transition)
            if (pointsApp.points && !pointsApp.points.visible) pointsApp.points.visible = true;
            pointsApp.update(false, true);
        } else {
            // High-Performance Mode: Standard Renderer (Room System + Finished Transition)

            // CORRECTED: Only hide points if we are NOT actively transitioning with bloom
            // or if we have explicitly switched to the room renderer.
            if (pointsApp.points && pointsApp.points.visible && !bloomActive) {
                pointsApp.points.visible = false;
            }

            // CLEANUP: If we are in Transition, we still need to update pointsApp logic (TWEENs + Mixer)
            // even if the renderer hasn't switched yet.
            if (isTransitioning) {
                pointsApp.update(true, false); // Logic Only, No Render
            }

            if (renderer && scene && camera) {
                renderer.render(scene, camera);
            }
        }
    } else if (renderer && scene && camera) {
        // Fallback for when pointsApp is not yet ready
        renderer.render(scene, camera);
    }
    const renderEnd = performance.now();
    scene._lastRenderTime = renderEnd - renderStart;

    // --- 4. POST-RENDER DIAGNOSTICS ---
    if (scene && scene.isTransitioning && scene._lastTotalTime > 20) {
        const totalTime = scene._lastTotalTime;
        const cpuTime = scene._lastLogicTime || 0;
        const gpuTime = scene._lastRenderTime || 0;
        const driverWait = totalTime - (cpuTime + gpuTime);

        let source = "GPU (Fillrate/Shaders)";
        if (cpuTime > gpuTime && cpuTime > 12) source = "CPU (Logic/TWEENs)";
        if (driverWait > 50) source = `STALL: GPU SYNC/BLOCKING (${driverWait.toFixed(1)}ms overhead)`;

        // const logMsg = `[PERF SPIKE] ${totalTime.toFixed(1)}ms | Logic: ${cpuTime.toFixed(1)}ms | Render: ${gpuTime.toFixed(1)}ms | Cause: ${source}`;
        // console.warn(logMsg);

        if (scene.HUD && scene.HUD.breathe) {
            scene.HUD.breathe(GLOBAL_COLORS.CRIMSON_RED);
        }
        scene._lastTotalTime = 0; // Reset
    }
    // if (scene.isTransitioning) console.timeEnd("[Render] Frame Work");
    if (stats) stats.update();
    if (helper && helper.liveTracking) helper.update();

    // --- 3. Sliced/Skeleton Updates (Option B Lite) ---
    // Character skinning is the #1 CPU hog; 30Hz is fine for Points/Transitions.
    // 51Hz is the "Sweet Spot" for Room fidelity vs CPU load.
    scene._accumulatedDelta ||= 0;
    scene._accumulatedDelta += delta;

    const targetHz = scene.targetAnimHz || 30;
    const targetInterval = 1.0 / targetHz;

    if (scene._accumulatedDelta >= (targetInterval - 0.001)) { // Epsilon for 60Hz loop jitter
        const slicedDelta = scene._accumulatedDelta;
        const transitioning = scene && scene.isTransitioning;
        // PERFORMANCE: Deactivate Room Mixer during transitions to save CPU for assembly
        if (loadedModel && isRoomActive && !transitioning) loadedModel.updateAnimationMixer(slicedDelta);
        scene._accumulatedDelta = 0;
    }

    /*
    // Update Loading Veil
    if (loadingVeil && loadingVeil.isActive) {
        const totalProgress = (window.loadingProgress || 0) / 100;
        loadingVeil.update(clock.elapsedTime, totalProgress, delta);
    }
    */
}

init();
if (typeof renderer !== 'undefined' && renderer) {
    renderer.setAnimationLoop(animate);
}
