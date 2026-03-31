import TWEEN from 'tween';
import * as THREE from 'three';
import * as ARAP from '../rapierPhysics/addRapierWorld.js';
import RAPIER from '@dimforge/rapier3d-compat';
import * as GF from '../raycast/gazeFollower.js'
import { slideGlassAnimation, openDragonEye, closeDragonEye } from '../raycast/loadedModelRaycast.js';
import { updateStory, updateSubtitle, clearSubtitle } from '../utils/status.js';
import { getDynamicText } from '../utils/contentUtils.js';
import { personaManager } from '../content-manager/personaManager.js';
import { PERSONA_IDS } from '../configs/sceneConfig.js';
import { addDragonBall } from '../resources/addDragonBalls.js';
import { bindBodyObject } from '../rapierPhysics/addRapierWorld.js';

import { setupIntegrityBaseline, startIntegrityCheckLoop, stopIntegrityCheckLoop } from '../utils/integrityCheck.js';
import { getBackOut, BACK_OUT_DEFAULT } from '../utils/customTween.js';
import { SCENE_OBJECTS, SCENARIO_STATES, GLOBAL_COLORS } from '../configs/sceneConfig.js';
import { createInnerGlowMat, createOuterGlowMat } from '../utils/constant.js';
import { NavInteractions } from '../interactions/navInteractions.js';
import { fanBulbMat } from '../resources/adjustObjects.js';
import { purgeAllCoins, snapPurgeCoins } from '../resources/spawnBitcoin.js';


export const MASTER_TIME = 15000;
// --- CONSTANTS ---
const SPAWN_DISTANCE = 100;
const SEQUENCE_DELAY = 200;

// Timings


const BOOK_START_DELAY = 500;
const assembleExcludeNames = ["planeSky", "blackholeScene", "PointsCloud", "bulb", 'bulbLight', "a-char", "stool", "stool_bound", "rightWall-cover", "floor"];

// --- HIGH LEVEL HELPERS ---

/**
 * Step 1: Initialize Scenario
 * Pauses the clock, creates a map of all scene objects, and prepares them for the entry animation
 * (e.g., hiding some, moving others to spawn points).
 */
export function initializeRoomScenario(scene) {
    scene.clock.stop();
    if (scene.orbitControls) scene.orbitControls.update();

    const objectMap = createSceneMap(scene);


    // // console.log(`%c[PERF] Initialized Room Scenario: ${scene.assembleGroups.length} build targets identified.`, "color: #00f3ff; font-weight: bold;");

    prepareObjectsForEntry(scene);

    return objectMap;
}



/**
 * Step 4: Assemble Scene
 * Orchestrates the "Build Sequence" where objects fly in.
 * - Animates foundations (floor, moon).
 * - Animates furniture and books.
 * - Tweens the Black Hole into place.
 */

/**
 * prepareRendererForTransition
 * Snaps the renderer to a low resolution (0.25x) immediately to prepare for heavy Bloom/Assembly.
 * This should be called as early as possible in a transition to avoid "DPR-Snapping" mid-animation.
 */
export function prepareRendererForTransition(scene) {
    if (!scene || !scene.renderer) return;

    // Phase 2: DPR Throttling (Optimizing Bloom fill-rate)
    // Target 32% of the room baseline (native * 0.625 * 0.32 = native * 0.20)
    // ULTRA-AGGRESSIVE THROTTLE: Drop to 0.20x native to ensure zero-lag assembly
    const nativeDPR = window.devicePixelRatio || 1;
    const transitionDPR = nativeDPR * 0.20;

    // Only snap if we aren't already at transition resolution to save texture re-allocation
    const currentDPR = scene.renderer.getPixelRatio();
    if (Math.abs(currentDPR - transitionDPR) > 0.01) {
        scene.renderer.setPixelRatio(transitionDPR);

        // One-time window resize trigger to scale composer buffers
        if (scene.pointsApp && typeof scene.pointsApp.onWindowResize === 'function') {
            scene.pointsApp.onWindowResize();
        }
    }
}

/**
 * restoreResolutionStaggered
 * Performant resolution upgrade using discrete steps (avoiding per-frame buffer churn)
 */
export async function restoreResolutionStaggered(scene, startMult, targetMult, stepDelay = 800) {
    if (!scene || !scene.renderer) return;

    const nativeDPR = window.devicePixelRatio || 1;
    const steps = [0.35, 0.50, targetMult]; // Discrete steps for smoothness without buffer churn

    for (const step of steps) {
        if (step <= startMult) continue;
        await delay(stepDelay);
        if (scene.renderer) {
            scene.renderer.setPixelRatio(nativeDPR * step);
            if (scene.pointsApp && typeof scene.pointsApp.onWindowResize === 'function') {
                scene.pointsApp.onWindowResize();
            }
        }
    }
}

export async function assembleScene(scene, tweenDuration = 800, skipBloom = false) {
    const startAssemblyTime = performance.now();

    // PERFORMANCE LOCK: Freeze interaction and Maximizer immediately
    scene.isTransitioning = true;

    // 0. HUD CLEANUP: Stop breathing as the room takes over
    if (scene.HUD && typeof scene.HUD.stopBreathing === 'function') {
        scene.HUD.stopBreathing();
    }

    // 1. PERFORMANCE LOCK: Keep shadow updates throttled.
    if (scene.renderer) {
        scene.renderer.shadowMap.autoUpdate = false;
        // Ensure the renderer is in low-res mode (If not already called manually)
        prepareRendererForTransition(scene);
    }

    // Make sure the room model is visible NOW (starts "Explosion" / Build)
    const roomModel = getObj(scene, 'roomGLBModel');
    if (roomModel) {
        roomModel.visible = true;
        roomModel.scale.set(1, 1, 1); // Reset scale after disassembly
        roomModel.position.set(0, 0, 0); // Restore Position from Void

        // We skip the expensive roomModel.traverse() to save CPU. 
        // Most objects are already visible but scale 0 (initialized).
        // If specific sub-trees are hidden, they should be toggled by name.

        // Unhide physics objects that were hidden on attach or disassembly
        if (scene.physicObjects) {
            scene.physicObjects.forEach(obj => {
                obj.visible = true;
            });
        }

        // Unhide Special Excluded Objects (except the snappy ones)
        const specialNames = ["rightWall-cover", "floor", "planeSky"];
        specialNames.forEach(name => {
            const obj = getObj(scene, name);
            if (obj) obj.visible = true;
        });
    }

    // --- FOUNDATIONS & SPECIALS (Snappy Staggered Entry) ---
    // Delay to start when the "Sit" animation is almost complete (~1.2s - 1.5s)
    const isLowPower = scene.isLowPowerMode;
    const foundationDelay = skipBloom ? 0 : (isLowPower ? 600 : 1050); // Start earlier in Lite
    const foundationGroup = ["floor", "planeSky", "rightWall-cover"];
    foundationGroup.forEach(name => {
        const obj = getObj(scene, name);
        if (obj) {
            obj.visible = true;
            tweenSpecificObject({
                obj: obj,
                duration: tweenDuration * (isLowPower ? 0.1 : 0.2), // Faster foundations
                delay: foundationDelay,
                easing: getBackOut(0.25)
            });
        }
    });

    // Step A0: Character & Stool (Ghost Scale Pre-warm)
    const charGroup = getObj(scene, "a-char");
    if (charGroup) {
        // [PERF_FIX] Setting visible: true here + scale: 0.0001 pre-warms the shaders.
        // This prevents the frame-skip when the character "Snaps" in later.
        charGroup.visible = true;
        charGroup.scale.setScalar(0.0001);
        if (charGroup.userData.originalPos) charGroup.position.copy(charGroup.userData.originalPos);
        if (charGroup.userData.originalRot) charGroup.rotation.copy(charGroup.userData.originalRot);
        charGroup.updateMatrix();
    }

    const stoolGroup = getObj(scene, "stool");
    if (stoolGroup) {
        stoolGroup.visible = true;
        stoolGroup.scale.setScalar(0.0001);
        if (stoolGroup.userData.originalPos) stoolGroup.position.copy(stoolGroup.userData.originalPos);
        if (stoolGroup.userData.originalRot) stoolGroup.rotation.copy(stoolGroup.userData.originalRot);
        stoolGroup.updateMatrix();
    }

    const stoolBound = getObj(scene, "stool_bound");
    if (stoolBound) {
        stoolBound.visible = false; // Stay hidden until peak
        if (stoolBound.userData.originalPos) stoolBound.position.copy(stoolBound.userData.originalPos);
        if (stoolBound.userData.originalScale) stoolBound.scale.copy(stoolBound.userData.originalScale);
        if (stoolBound.userData.originalRot) stoolBound.rotation.copy(stoolBound.userData.originalRot);
        stoolBound.updateMatrix();
    }

    // console.timeEnd("CHECK: Build Steps (Chars/Walls)");
    // const floor = await executeBuildStep(scene, "floor", 5, 0, false);
    // const floor = scene.objectMap.get("floor");
    if (!skipBloom) {
        // rightWallCover.visible = false;
        // if (charGroup) charGroup.visible = false;
        // if (stoolGroup) stoolGroup.visible = false;

        // floor.material.transparent = true
        // floor.material.opacity = 0
        // floor.visible = false
        // charGroup.scale.setScalar(0)
        // stoolGroup.scale.setScalar(0)
    }


    //get current pixel ratio of the points shader uniform
    const startPixelRatio = scene.points.material.uniforms.uPixelRatio.value;
    const startPointSize = scene.points.material.uniforms.uSize.value;
    const POINTS_DURATION = skipBloom ? 0 : (isLowPower ? 900 : 1500);
    const BLOOM_OFF_RATE = 0.15 // Fast falloff
    const BLOOM_PAUSE_RATE = 0.05

    const BLOOM_UP_DURATION = POINTS_DURATION * (1 - BLOOM_OFF_RATE - BLOOM_PAUSE_RATE)
    const endToneMappingExposure = SCENARIO_STATES[1].toneMappingExposure;

    const pixelRatioTween = (targetVal) => {
        return new TWEEN.Tween(scene.points.material.uniforms.uPixelRatio)
            .to({ value: targetVal }, BLOOM_UP_DURATION)
            .easing(TWEEN.Easing.Exponential.In) // Sharp suck-in
    }

    const pointSizeTween = (targetVal) => {
        return new TWEEN.Tween(scene.points.material.uniforms.uSize)
            .to({ value: targetVal }, BLOOM_UP_DURATION)
            .easing(TWEEN.Easing.Exponential.In) // Faster shrinkage
    }

    const toneMappingTween = (targetVal) => {
        return new TWEEN.Tween(scene.renderer)
            .to({ toneMappingExposure: targetVal }, BLOOM_UP_DURATION)
            .easing(TWEEN.Easing.Linear.None)
    }



    if (!skipBloom) {
        // // console.log("CHECK: Starting Bloom Off Tween");
        const bloomOff = new TWEEN.Tween(scene.points.bloomPass)
            .to({ strength: 0 }, POINTS_DURATION * BLOOM_OFF_RATE)
            .delay(POINTS_DURATION * BLOOM_PAUSE_RATE)
            .easing(TWEEN.Easing.Back.InOut)
            .onComplete(async () => {
                const rightWallCover = getObj(scene, 'rightWall-cover');
                if (rightWallCover) rightWallCover.visible = true;
                if (window.showSectionPoint) window.showSectionPoint();
            })



        const bloomUpTarget = 5; // Reduced from 20 to 5 to balance beauty and FPS during assembly
        const bloomUp = new TWEEN.Tween(scene.points.bloomPass)
            .to({ strength: bloomUpTarget }, BLOOM_UP_DURATION)
            .easing(TWEEN.Easing.Quadratic.In) // Faster approach to peak
            .onComplete(async () => {
                // QUANTUM SNAP: Snap characters in at peak via scale (Zero-stutter)
                if (charGroup) {
                    charGroup.scale.copy(charGroup.userData.originalScale);
                }
                if (stoolGroup) {
                    stoolGroup.scale.copy(stoolGroup.userData.originalScale);
                }
                if (stoolBound) {
                    stoolBound.visible = true;
                    if (stoolBound.userData.originalPos) stoolBound.position.copy(stoolBound.userData.originalPos);
                    if (stoolBound.userData.originalRot) stoolBound.rotation.copy(stoolBound.userData.originalRot);
                    stoolBound.scale.copy(stoolBound.userData.originalScale);
                    stoolBound.updateMatrix();
                }

                if (scene.pointsApp && scene.pointsApp.points) {
                    scene.pointsApp.points.visible = false;
                }

                bloomOff.start();
            })
        // .chain(bloomOff)
        // .start();
        bloomUp.start();
        pixelRatioTween(0).start();
        pointSizeTween(0).start();
        // await delay(200000)
        setTimeout(() => {
            assembleRoom(scene)
        }, BLOOM_UP_DURATION * 0.10) // [PERF_FIX] Start assembly earlier to spread CPU load away from Bloom peak (Option 2)
        // run a tween to rescale
    } else {
        if (charGroup) {
            charGroup.visible = true;
            tweenSpecificObject({ obj: charGroup, duration: 100 }); // Quick snap
        }
        if (stoolGroup) {
            stoolGroup.visible = true;
            tweenSpecificObject({ obj: stoolGroup, duration: 100 });
        }
        // Force assemble room for skipBloom path
        assembleRoom(scene, 0);
    }

    toneMappingTween(endToneMappingExposure).start();
    // await delay(POINTS_DURATION);

}


async function tweenRemainingObjects(scene, tweenDuration) {
    const remainingObjects = getRemainingObjects(scene);

    // VERIFICATION LOG: Cyan colored list of names
    // console.log(`%c[PERF] Room Assembly: Animating ${remainingObjects.length} primary objects.`, "color: #00f3ff; font-weight: bold;");
    // console.log("%cObjects being tweened:", "color: #00f3ff; text-decoration: underline;");
    remainingObjects.forEach((obj, i) => {
        // console.log(`%c  ${i + 1}. ${obj.name} (${obj.type})`, "color: #00f3ff;");
    });

    // 0. RESET PARENT (Critical Safeguard)
    if (scene.loadedModel && scene.loadedModel.model) {
        scene.loadedModel.model.position.set(0, 0, 0);
    }

    const books = remainingObjects.filter(obj => /^book\d+$/.test(obj.name));
    const others = remainingObjects.filter(obj => !/^book\d+$/.test(obj.name));

    // [PERF_FIX] Shuffle removed to preserve Material Grouping sort from getRemainingObjects.
    // Instead, we will add jitter to the delay calculation inside animateList().
    
    const isLowPower = scene.isLowPowerMode;

    const animateList = (list, baseDuration, staggerFactor = 1.0, isBook = false, onComplete = null) => {
        return new Promise((resolve) => {
            if (list.length === 0) return resolve();

            let finishedCount = 0;
            const total = list.length;
            const ease = isBook ? TWEEN.Easing.Cubic.Out : getBackOut(1);

            // TWEEN CHUNKING: process objects in batches over 5 frames to avoid execution spikes
            const chunkSize = Math.ceil(total / 5);
            let currentIndex = 0;

            const processChunk = () => {
                const limit = Math.min(currentIndex + chunkSize, total);
                const frameStartTime = performance.now();

                for (let i = currentIndex; i < limit; i++) {
                    const obj = list[i];
                    
                    // [PERF_FIX] JIT PREP: Prep only the objects we are about to tween in this frame.
                    // This spreads the main-thread cost of stopping old tweens and toggling matrices.
                    if (obj.userData.scenarioTween) {
                        obj.userData.scenarioTween.stop();
                        obj.userData.scenarioTween = null;
                    }
                    obj.userData.wasMatrixAutoUpdate = obj.matrixAutoUpdate;
                    obj.matrixAutoUpdate = false;

                    const ud = obj.userData;
                    // [PERF_FIX] ORGANIC JITTER: Adds the "chaos" back without breaking material order in the loop.
                    const delayJitter = (Math.random() - 0.5) * 500; 
                    const delayTime = Math.max(0, (i / total) * baseDuration * staggerFactor + delayJitter);

                    // 2. UNIQUE SPEED: Jitter the duration
                    const jitter = isBook ? 1.0 : (0.7 + Math.random() * 0.7);
                    const duration = baseDuration * jitter;

                    const progress = { t: 0 };
                    // [LAG FIX] Store the tween so we can cancel it if the state changes quickly
                    obj.userData.scenarioTween = new TWEEN.Tween(progress)
                        .to({ t: 1 }, duration)
                        .delay(delayTime)
                        .easing(ease)
                        .onUpdate(() => {
                            const alpha = progress.t;

                            if (ud.originalPos && ud.hidePos) {
                                obj.position.x = ud.hidePos.x + (ud.originalPos.x - ud.hidePos.x) * alpha;
                                obj.position.y = ud.hidePos.y + (ud.originalPos.y - ud.hidePos.y) * alpha;
                                obj.position.z = ud.hidePos.z + (ud.originalPos.z - ud.hidePos.z) * alpha;
                            }

                            if (ud.originalScale && ud.hideScale) {
                                obj.scale.x = ud.hideScale.x + (ud.originalScale.x - ud.hideScale.x) * alpha;
                                obj.scale.y = ud.hideScale.y + (ud.originalScale.y - ud.hideScale.y) * alpha;
                                obj.scale.z = ud.hideScale.z + (ud.originalScale.z - ud.hideScale.z) * alpha;
                            }

                            if (isBook && ud.originalRot && ud.hideRot) {
                                obj.rotation.x = ud.hideRot.x + (ud.originalRot.x - ud.hideRot.x) * alpha;
                                obj.rotation.y = ud.hideRot.y + (ud.originalRot.y - ud.hideRot.y) * alpha;
                                obj.rotation.z = ud.hideRot.z + (ud.originalRot.z - ud.hideRot.z) * alpha;
                            }

                            if (obj.matrixAutoUpdate === false) obj.updateMatrix();
                        })
                        .onComplete(async () => {
                            obj.userData.scenarioTween = null; // Clear reference on completion
                            finishedCount++;
                            if (finishedCount === total) {
                                if (onComplete) await onComplete();
                                resolve();
                            }
                        })
                        .start();
                }

                currentIndex = limit;
                if (currentIndex < total) {
                    requestAnimationFrame(processChunk);
                }
            };

            processChunk();
        });
    };

    // 1. Swarm "Others" (Balanced Individual Stagger)
    await animateList(others, tweenDuration, isLowPower ? 0.3 : 0.5);

    // 2. Slide "Books" (Higher stagger for effect - reduced for Lite)
    await delay(isLowPower ? 34 : 17 * 4);
    await animateList(books, tweenDuration * 0.8, isLowPower ? 0.3 : 0.4, true, async () => {
        // --- PHASE 2: Sequential Matrix Restoration ---
        // Restore matrix updates in chunks to prevent frameskip before ignition.
        await restoreAllMatrices(scene, remainingObjects);

        // --- PHASE 3: Scenario Alignment (Unlock UI/Maximizer) ---
        setScenarioState(scene, 1);


        // --- PHASE 4: Delayed Physics Ignition ---
        // Give the main thread 250ms to settle the high-res buffers and LCP paint
        setTimeout(() => {
            applyTimePhysics(scene);

            // --- PHASE 5: Staggered Body Wake-up ---
            if (scene.physicObjects) {
                scene.physicObjects.forEach((obj, i) => {
                    if (obj.rapierBody) {
                        setTimeout(() => {
                            if (obj.rapierBody) obj.rapierBody.wakeUp();
                        }, i * 6);
                    }
                });
            }
        }, 250);

        // Buffer before bulb activation begins (via finalDuration await in assembleRoom)
        await delay(isLowPower ? 300 : 500);
        // scene.isTransitioning = false; // Unified: Now handled by restoreResolutionStaggered to prevent premature resolution snaps
    });
}

/**
 * restoreAllMatrices
 * Wraps the chunked matrix restoration in a Promise to allow sequential execution.
 */
function restoreAllMatrices(scene, objects) {
    return new Promise((resolve) => {
        const chunkSize = 20;
        let restoreIndex = 0;

        const restoreBatch = () => {
            const limit = Math.min(restoreIndex + chunkSize, objects.length);
            for (let i = restoreIndex; i < limit; i++) {
                const obj = objects[i];
                obj.matrixAutoUpdate = obj.userData.wasMatrixAutoUpdate !== undefined ? obj.userData.wasMatrixAutoUpdate : true;
                obj.updateMatrix();
            }

            restoreIndex = limit;
            if (restoreIndex < objects.length) {
                requestAnimationFrame(restoreBatch);
            } else {
                if (scene.loadedModel && scene.loadedModel.model) {
                    scene.loadedModel.model.updateMatrixWorld(true);
                }
                resolve();
            }
        };

        restoreBatch();
    });
}

/**
 * Step 6: Apply Physics
 * Resumes the clock and activates the physics world.
 * This makes dynamic objects start falling/interacting.
 */




export async function togglePhysics(scene, apply = true) {
    const planeSky = scene.objectMap.get("planeSky");
    // if (planeSky) planeSky.visible = apply;

    scene.objectMap.forEach((obj, name) => {
        if (/^dragonBall\d+Stars$/.test(name)) {
            obj.visible = apply;
        }
    });

    if (apply) {
        scene.clock.start();
        updateStory("Clock Resumed.");
    } else {
        scene.clock.stop();
        updateStory("Clock Paused.");
    }

    if (scene.world) {
        scene.world.isActive = apply;
        updateStory(apply ? "Physics Activated." : "Physics Deactivated.");
    }
}


const applyTimePhysics = (scene) => togglePhysics(scene, true);
const deactivateTimePhysics = (scene) => togglePhysics(scene, false);
const revertPhysics = (scene) => togglePhysics(scene, false);

// --- BLACKHOLE LOGIC ---

function initializeBlackholeState(obj) {
    obj.userData.originalPos = obj.position.clone();
    obj.userData.originalScale = obj.scale.clone();
    obj.userData.originalRot = obj.rotation.clone();

    // 1. Apply Position Offset (X Axis, Direction -1)
    applyAxisOffset(obj, SPAWN_DISTANCE, 'x', -1);

    // 2. Apply Scale & Rotation Offset
    obj.scale.set(0, 0, 0);
    obj.rotation.z += 0.1 * Math.PI * 2;

    obj.visible = true;
}

function tweenBlackhole(scene, duration, delay = 0) {
    const obj = scene.objectMap.get("blackholeScene");
    if (!obj.userData.originalPos || !obj.userData.originalScale || !obj.userData.originalRot) return;

    // Capture Start States
    const startPos = obj.position.clone();
    const endPos = obj.userData.originalPos;

    const startScale = obj.scale.clone();
    const endScale = obj.userData.originalScale;

    const startRotZ = obj.rotation.z;
    const endRotZ = obj.userData.originalRot.z;

    // Master Tween: Runs from 0 to 2
    // Phase 1 (0-1): Position
    // Phase 2 (1-2): Scale & Rotation
    const totalDuration = duration * 2;
    const progress = { t: 0 };

    function detachCore() {
        const core = scene.getObjectByName("Lathe_Center");
        if (core) {
            scene.attach(core);
        }
    }

    new TWEEN.Tween(progress)
        .to({ t: 2 }, totalDuration)
        .easing(TWEEN.Easing.Linear.None) // Manual easing inside onUpdate
        .delay(delay)
        .onUpdate(() => {
            const t = progress.t;

            // --- Phase 1: Position ---
            if (t <= 1) {
                const easePos = TWEEN.Easing.Back.Out(t);
                obj.position.lerpVectors(startPos, endPos, easePos);
            } else {
                // Ensure Position is final (in case of frame skip)
                obj.position.copy(endPos);
                scene.fireflies.material.uniforms.uSizeFactor.value = 1.;

                // --- Phase 2: Scale & Rotation ---
                const localT = Math.min(t - 1, 1); // Clamp to 0-1

                // Scale (Back.Out)
                const easeScale = TWEEN.Easing.Back.Out(localT);
                obj.scale.lerpVectors(startScale, endScale, easeScale);



                // Rotation Z (Back.InOut)
                const easeRot = TWEEN.Easing.Back.InOut(localT);
                obj.rotation.z = startRotZ + (endRotZ - startRotZ) * easeRot;
            }
        })
        .onComplete(() => {
            // Finalize state just in case
            obj.position.copy(endPos);
            obj.scale.copy(endScale);
            obj.rotation.z = endRotZ;
            new TWEEN.Tween(scene.fireflies.material.uniforms.uKamikazeScale)
                .to({ value: 1 }, duration)
                .easing(TWEEN.Easing.Cubic.In)
                .start();
            // detachCore();

            // scene.scenarioState = SCENARIO_STATES[1]; // 
            // activateBulb(scene);
        })
        .start();
}

// --- CORE LOGIC ---

export function prepareObjectsForEntry(scene) {

    // scene.assembleGroups = []
    const planeSky = scene.objectMap.get("planeSky");
    // // console.log("HERRRER", planeSky)
    if (planeSky) planeSky.visible = false;

    // let hero = scene.objectMap.get("a-char")
    //change parent to hero for special assemble treatment
    // const charObj = scene.objectMap.get("a-char");
    // if (charObj) scene.attach(charObj);

    // const stoolObj = scene.objectMap.get("stool");
    // if (stoolObj) scene.attach(stoolObj);

    // const floorObj = scene.objectMap.get("floor");
    // if (floorObj) scene.attach(floorObj);

    // scene.objectMap.forEach((obj, name) => {
    //     if (/^dragonBall\d+Stars$/.test(name)) obj.visible = false;
    // });

    const SPECIFIC_CONFIGS = [
        { name: "moon", axis: 'x', dir: -1 },
        { name: "floor", axis: 'x', dir: -1 }
    ];

    // SPECIFIC_CONFIGS.forEach(config => {
    //     const obj = scene.objectMap.get(config.name);
    //     if (obj) initializeObjectState(obj, { fixedAxis: config.axis, fixedDirection: config.dir });
    // });

    const blackhole = scene.objectMap.get("blackholeScene");
    if (blackhole) initializeBlackholeState(blackhole);

    // 1. Initialize & Hide Special Excluded Objects (Ensure they have originalPos captured)
    const specialNames = ["rightWall-cover", "a-char", "stool", "stool_bound", "floor", "moon", "planeSky"];
    specialNames.forEach(name => {
        const obj = scene.getObjectByName(name);
        if (obj) {
            initializeObjectState(obj);
            // Move to hidden "void" position to prepare for assembly flight
            // SNAPPY OBJECTS: Skip displacement for objects that should "snap" in
            const isSnappy = name === 'a-char' || name === 'stool' || name === 'stool_bound';

            if (name !== 'floor' && name !== 'moon' && !isSnappy) {
                obj.position.set(0, -SPAWN_DISTANCE, 0);
                obj.visible = false;
            } else {
                // Snappy objects (Character, Stool) stay at original pos with Ghost Scale (0.0001)
                // फाउंडेशन (Floor, Moon) hide completely for bloom peek.
                if (isSnappy) {
                    obj.visible = true; // Pre-warm shaders
                    obj.scale.setScalar(0.0001); // Invisible to human eye
                } else {
                    obj.visible = false;
                }
            }
        }
    });

    const leftovers = getRemainingObjects(scene);
    leftovers.forEach(obj => {
        const isBook = /^book\d+$/.test(obj.name);
        if (isBook) {
            initializeObjectState(obj, { fixedAxis: 'x', fixedDirection: 1, enableSpin: true, ignoreAxisOffset: false });
        } else {
            initializeObjectState(obj, { fixedAxis: 'x', fixedDirection: -1, ignoreAxisOffset: false });
        }
    });

    // const droneEye = scene.objectMap.get("drone");
    // const bulb = scene.objectMap.get("bulb");
    // droneEye.add(bulb)
    // bulb.position.set(0, 0, 0);


    // if (droneEye) initializeObjectState(droneEye, null, null, false);
}

function initializeObjectState(obj, options = {}) {
    const { fixedAxis = null, fixedDirection = null, enableSpin = false, ignoreAxisOffset = false } = options;

    obj.userData.originalPos = obj.position.clone();
    obj.userData.originalScale = obj.scale.clone();
    obj.userData.originalRot = obj.rotation.clone();

    const direction = fixedDirection !== null ? fixedDirection : (Math.random() > 0.5 ? 1 : -1);

    //push obj away along the axis
    // applyAxisOffset(obj, SPAWN_DISTANCE, fixedAxis, direction);
    if (ignoreAxisOffset) {
        applyPositiveYOffset(obj, SPAWN_DISTANCE, fixedAxis, direction);
    } else {
        applyAxisOffset(obj, SPAWN_DISTANCE, fixedAxis, direction);
    }

    if (enableSpin) {
        const rounds = Math.random() * 50 + 50;
        const rotationAmount = rounds * (Math.PI * 2);
        const spinDir = Math.random() > 0.5 ? 1 : -1;
        obj.rotation.y += rotationAmount * spinDir;
    }

    obj.scale.set(0, 0, 0);
    obj.visible = true;

    //store the data after moving them away
    obj.userData.hidePos = obj.position.clone();
    obj.userData.hideScale = obj.scale.clone();
    obj.userData.hideRot = obj.rotation.clone();

    if (obj.name === 'floor') {
        // // console.log(obj)
    }
}

function tweenSpecificObject({ obj, duration, delay = 0, enableSpin = false, easing = TWEEN.Easing.Cubic.Out }) {
    if (!obj.userData.originalPos) return;

    // Capture start states
    const startPos = obj.position.clone();
    const startScale = obj.scale.clone();
    const startRot = obj.rotation.clone();

    // Targets from userData
    const endPos = obj.userData.originalPos;
    const endScale = obj.userData.originalScale;
    const endRot = obj.userData.originalRot;

    // PERFORMANCE SAFEGUARDS
    const wasCasting = obj.castShadow;
    const wasReceiving = obj.receiveShadow;
    const wasAutoUpdate = obj.matrixAutoUpdate;
    const wasCulling = obj.frustumCulled;

    obj.castShadow = false;
    obj.receiveShadow = false;
    obj.matrixAutoUpdate = false;
    obj.frustumCulled = false;

    const progress = { t: 0 };
    new TWEEN.Tween(progress)
        .to({ t: 1 }, duration)
        .delay(delay)
        .easing(TWEEN.Easing.Linear.None) // Manual phase mapping
        .onUpdate(() => {
            const t = progress.t;

            // 1. Position (0.0 -> 0.7)
            const pT = Math.min(t / 0.7, 1.0);
            const pAlpha = easing(pT); // Use the custom easing for position
            obj.position.lerpVectors(startPos, endPos, pAlpha);

            // 2. Scale (0.2 -> 0.8)
            const sT = Math.max(0, (t - 0.2) / 0.6);
            const sAlpha = TWEEN.Easing.Back.Out(Math.min(sT, 1.0));
            obj.scale.lerpVectors(startScale, endScale, sAlpha);

            // 3. Rotation (0.4 -> 1.0)
            if (enableSpin) {
                const rT = Math.max(0, (t - 0.4) / 0.6);
                const rAlpha = TWEEN.Easing.Quadratic.Out(Math.min(rT, 1.0));
                obj.rotation.x = startRot.x + (endRot.x - startRot.x) * rAlpha;
                obj.rotation.y = startRot.y + (endRot.y - startRot.y) * rAlpha;
                obj.rotation.z = startRot.z + (endRot.z - startRot.z) * rAlpha;
            }

            obj.updateMatrix();
        })
        .onComplete(() => {
            obj.castShadow = wasCasting;
            obj.receiveShadow = wasReceiving;
            obj.matrixAutoUpdate = wasAutoUpdate;
            obj.frustumCulled = wasCulling;

            obj.position.copy(endPos);
            obj.scale.copy(endScale);
            obj.rotation.copy(endRot);

            obj.updateMatrix();
            obj.updateMatrixWorld(true);
        })
        .start();
}

// --- UTILS & HELPERS ---

function getRemainingObjects(scene) {
    // 0. Cache Guard: Return the pre-filtered list if it exists
    if (scene.assembleGroups) {
        return scene.assembleGroups;
    }

    // 1. Identification Logic: Favor direct children of the scene.
    // This is critical because physics binding detaches objects from the GLB
    // and attaches them directly to the scene. By tweening only these 
    // root-level objects, we drastically reduce the total tween count.
    const targets = scene.children.filter(child => {
        if (!child.name || child.isCamera || child.isLight || child.isBone) return false;
        if (child.name === 'roomGLBModel' || child === scene || child.name === 'HUDFrame') return false;

        // Exclude foundation objects and special characters handled in Step A0
        const isExcluded = assembleExcludeNames.includes(child.name) || /^dragonBall\d+Stars$/.test(child.name);
        if (isExcluded) return false;

        // Hard exclusion for character meshes and dynamic coins
        if (/^Ch23_/.test(child.name) || /^mixamorig/.test(child.name)) return false;
        if (/^BTC_/.test(child.name) || /^ETH_/.test(child.name)) return false;

        return child.isObject3D;
    });

    // 2. MATERIAL GROUPING: Sort targets by material ID to improve renderer efficiency 
    // during the high-draw-call state of assembly.
    targets.sort((a, b) => {
        const getMatId = (mesh) => {
            if (mesh.material) return Array.isArray(mesh.material) ? mesh.material[0].uuid : mesh.material.uuid;
            return "";
        };
        return getMatId(a).localeCompare(getMatId(b));
    });

    // CACHE FOR NEXT TIME: Avoid expensive scene scan on 2nd+ visit
    scene.assembleGroups = targets;

    return targets;
}

function getRandomDuration(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * executeBuildStepSync
 * Wrapper to fetch an object and trigger its assembly immediately.
 */
function executeBuildStepSync({ scene, targetName, duration, waitTime = 0, enableSpin = false }) {
    const obj = scene.objectMap.get(targetName);
    if (obj) {
        tweenSpecificObject({ obj, duration, enableSpin });
    }
    return obj;
}

/**
 * executeBuildStep
 * Async version of the build step.
 */
async function executeBuildStep({ scene, targetName, duration, waitTime = 0, enableSpin = false }) {
    const obj = scene.objectMap.get(targetName);
    if (obj) {
        tweenSpecificObject({ obj, duration, enableSpin });
        if (waitTime > 0) await delay(waitTime);
    }
    return obj;
}

function applyAxisOffset(object, offset, axis = null, direction = 1) {
    const axes = ['x', 'y', 'z'];
    let selectedAxis = axis;

    if (!selectedAxis || !axes.includes(selectedAxis)) {
        const randomIndex = Math.floor(Math.random() * 3);
        selectedAxis = axes[randomIndex];
    }

    // Enforce Direction Rules
    if (selectedAxis === 'y') direction = 1;
    // if (selectedAxis === 'x') direction = -1;
    // Z keeps the passed (random or fixed) direction

    object.position[selectedAxis] += offset * direction;
}

function applyPositiveYOffset(object, offset, axis = null, direction = 1) {
    const axes = ['x', 'y', 'z'];
    let selectedAxis = axis;

    if (!selectedAxis || !axes.includes(selectedAxis)) {
        const randomIndex = Math.floor(Math.random() * 3);
        selectedAxis = axes[randomIndex];
    }

    // Apply Main Offset
    // If Main Axis is Y, force direction to 1
    if (selectedAxis === 'y') direction = 1;
    object.position[selectedAxis] += offset * direction;

    // Apply Secondary Offsets (Half amount, random direction)
    const secondaryOffset = offset * 0.5;
    const remainingAxes = axes.filter(a => a !== selectedAxis);

    remainingAxes.forEach(secAxis => {
        let secDir = Math.random() > 0.5 ? 1 : -1;

        // If Secondary Axis is Y, force direction to 1
        if (secAxis === 'y') secDir = 1;

        object.position[secAxis] += secondaryOffset * secDir;
    });
}

/**
 * High-Performance Lookup: Returns the object from the Map if it exists,
 * otherwise falls back to the expensive getObjectByName and caches the result.
 */
export function getObj(scene, name) {
    if (!name) return null;
    if (!scene.objectMap) createSceneMap(scene);

    // 1. Fast Path: Map Lookup O(1)
    if (scene.objectMap.has(name)) return scene.objectMap.get(name);

    // 2. Slow Path: Tree Traversal O(N)
    const found = scene.getObjectByName(name);

    // 3. Self-Healing: Cache for next time
    if (found) scene.objectMap.set(name, found);

    return found;
}

/**
 * Explicit Registration: Use this when spawning dynamic entities (Coins, Balls)
 * to ensure they are immediately accessible in the map.
 */
export function registerInMap(scene, object) {
    if (!object || !object.name) return;
    if (!scene.objectMap) createSceneMap(scene);
    scene.objectMap.set(object.name, object);
}

/**
 * Unregistration: Call this when objects are permanently destroyed/removed.
 */
export function removeFromMap(scene, name) {
    if (scene.objectMap) scene.objectMap.delete(name);
}

export function createSceneMap(scene) {
    const map = new Map();
    scene.traverse((child) => {
        if (child.name) map.set(child.name, child);
    });
    scene.objectMap = map;
    return map;
}

/**
 * Step 3: Reveal Point System (Technical Unveiling)
 * Centralizes the logic for transitioning from the Loading screen to the Scene.
 */
export async function prepareSystemReady() {
    const progressText = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress-bar');
    const cvContainer = document.getElementById('cv-container');

    if (progressText) progressText.innerText = getDynamicText("SYS_READY");
    if (progressBar) progressBar.parentElement.style.opacity = '0'; // Fade bar out

    // Ensure CV is collapsed and clean for the intro
    if (cvContainer) cvContainer.classList.add('collapsed');

    // Hide any other UI that shouldn't be here yet
    const mainUI = document.getElementById('main-ui');
    if (mainUI) mainUI.style.opacity = '0';

    await delay(200); // Trimmed from 500ms
}

export async function hideLoadingScreen() {
    const loadingContainer = document.getElementById('loading-container');
    const loaderContent = document.querySelector('.loader-content');

    if (loaderContent) {
        loaderContent.style.transition = 'opacity 0.5s ease';
        loaderContent.style.opacity = '0'; // Fade text first
    }

    if (loadingContainer) {
        await delay(100); // Trimmed from 500ms
        loadingContainer.style.transition = 'opacity 0.4s ease';
        loadingContainer.style.opacity = '0';
        await delay(400); // Trimmed from 800ms (Matches faster transition or overlap)
        loadingContainer.style.display = 'none';

        // Reveal Main HUD Frame once text is gone
        const mainUI = document.getElementById('main-ui');
        if (mainUI) {
            mainUI.style.transition = 'opacity 1s ease';
            mainUI.style.opacity = '1';
        }
    }
}

/** Legacy support - Orchestrated by runScenario now */
export async function revealPointSystem(scene, pointsApp = null) {
    await prepareSystemReady();
    await hideLoadingScreen();

    if (pointsApp && pointsApp.triggerRoomLoading) {
        pointsApp.triggerRoomLoading();
    }
}

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// DRONE
/**
 * Step 7: Play Drone
 * Animates the drone flying along a curved path and initializes its "Gaze Follower" behavior upon completion.
 */
let droneEndPos, droneEndRot;
export async function playDrone(scene, options = {}) {
    const { duration = 3000, delay: startDelay = 0, onStart, onComplete } = options;
    const drone = scene.getObjectByName('drone');
    // const droneBody = drone.ra

    if (!drone) {
        console.error("Drone not found");
        return;
    }

    return new Promise((resolve) => {
        // --- 1. Define Path Points (Renamed) ---
        const startPoint = drone.position.clone();
        const midPoint = new THREE.Vector3(9, 1, -1.3);
        const endPoint = new THREE.Vector3(-1, 9, -5);
        droneEndPos = endPoint;
        // --- 2. Create the Curve ---
        const curve = new THREE.CatmullRomCurve3(
            [startPoint, midPoint, endPoint],
            false,
            'centripetal'
        );

        // --- 3. Rotation Setup (Quaternion Slerp) ---
        // A. Capture the starting rotation
        const startQuaternion = drone.quaternion.clone();

        // B. Define the target rotation
        // User requested Euler: (-Math.PI/2, 0.2, 1.25)
        const targetEuler = new THREE.Euler(-Math.PI / 2, 0.2, 1.25);
        const endQuaternion = new THREE.Quaternion().setFromEuler(targetEuler);

        // Fine-tuning: Rotate 90 degrees on X axis
        const xRot = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
        endQuaternion.multiply(xRot);

        droneEndRot = endQuaternion;

        const tObj = { val: 0 };
        let quat = new THREE.Quaternion()
        new TWEEN.Tween(tObj)
            .to({ val: 1 }, duration)
            .delay(startDelay)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onStart(() => {
                let gazeFollower = new GF.GazeFollower(drone)
                gazeFollower.init()
                scene.gazeFollower = gazeFollower

                if (onStart) onStart();
            })
            .onUpdate(() => {
                // KILL SWITCH: Abort if user left the room
                if (scene._spawnStopSignal) {
                    tObj.val = 1.0;
                    return; // Stop processing further frames
                }
                // --- 4. Update Loop ---

                // A. Update Position
                const point = curve.getPoint(tObj.val);
                drone.rapierBody.setNextKinematicTranslation(point)
                // drone.position.copy(point);

                // B. Update Rotation (SLERP)
                // Smoothly blend from startQuaternion to endQuaternion based on progress 'val'
                quat.copy(startQuaternion).slerp(endQuaternion, tObj.val);

                // Safety check for recursive WASM calls
                const world = scene.world;
                if (world && !world.isBusy) {
                    try {
                        const wasBusy = world.isBusy;
                        world.isBusy = true;
                        drone.rapierBody.setRotation({ x: quat.x, y: quat.y, z: quat.z, w: quat.w }, true);
                        world.isBusy = wasBusy;
                    } catch (e) {
                        console.error("[Scenario] Rapier failed to set rotation @CurveAnim:", e.message);
                        if (e.message.includes("recursive")) {
                            console.trace("[Scenario] Recursive WASM call trace @CurveAnim:");
                        }
                    }
                }
                // drone.lookAt(scene.camera.position) // <--- CAUSED SNAP
                // quat.copy(drone.quaternion)
                // drone.rapierBody.setRotation(quat)
            })
            .onComplete(() => {
                if (scene._spawnStopSignal) {
                    resolve();
                    return;
                }
                if (scene.world && !scene.world.isBusy) {
                    drone.rapierBody.setTranslation({ x: endPoint.x, y: endPoint.y, z: endPoint.z }, true);
                    drone.rapierBody.setRotation({ x: endQuaternion.x, y: endQuaternion.y, z: endQuaternion.z, w: endQuaternion.w }, true);
                }

                if (onComplete) onComplete();
                resolve();
            })
            .start();
    });
    return { end }
}
//ENVIRONMENT CONTROL
function deactivateSky(scene) {
    scene.globalUniformsHub.uStormSharpness.value = 0
}
function deactivateRain(scene) {
    // const uniform = scene.globalUniformsHub
    //sky rain
    scene.globalUniformsHub.enableLightning.value = false
    scene.globalUniformsHub.uRainHeaviness.value = 0
    //glass rain
    scene.globalUniformsHub.glassRainAmount.value = 0
    scene.globalUniformsHub.rainGlassOpacity.value = 0
}

function blackenObjects(scene) {
    const floor = scene.getObjectByName('floor');
    const chair = scene.getObjectByName('Object_0003_3'); // Consider renaming this in Blender/Maya if possible!
    const blackCat = scene.getObjectByName('Object_12001');
    if (floor?.material) floor.material.envMapIntensity = 0.1;
    if (chair?.material) chair.material.envMapIntensity = 0.7;
    if (blackCat?.material) blackCat.material.envMapIntensity = 0.0;

    scene.environmentIntensity = 0.4
}


/**
 * Step 2: Deactivate Environment
 * Resets environment uniforms (rain, storm) and darkens materials to prepare for the "Build" sequence.
 */
export function deactivateEnvironment(scene) {
    deactivateSky(scene)
    deactivateRain(scene)
    blackenObjects(scene)
}

// RAIN CONTROL
/**
 * Step 5: Activate Environment
 * Activates rain, storm effects, and moves the moon slightly.
 * Also ramps up "sharpness" and opacity for a dramatic effect.
 */
export function activateEnvironment(scene, tweenDuration = 12000) {
    let globalUniformsHub = scene.globalUniformsHub
    let rainStartTime = tweenDuration
    let easing = TWEEN.Easing.Linear.None
    const glassRainProgress = { val: 0 };
    let glassRainTween = new TWEEN.Tween(glassRainProgress)
        .to({ val: 1 }, rainStartTime)
        .easing(easing)
        .onUpdate(() => {
            scene.globalUniformsHub.glassRainAmount.value = glassRainProgress.val; // 
            scene.globalUniformsHub.rainGlassOpacity.value = glassRainProgress.val;
        });

    let moonPosYTween = new TWEEN.Tween(globalUniformsHub.uMoonPosition.value)
        .to({ x: "+0.001", y: "+0.05" }, rainStartTime * 2)
        .easing(easing)

    let moonSizeTween = new TWEEN.Tween(globalUniformsHub.uMoonSize)
        .to({ value: globalUniformsHub.uMoonSize.value * 0.65 }, rainStartTime * 2)
        .easing(easing);

    const progress = { t: 0 };
    new TWEEN.Tween(progress)
        .to({ t: 1 }, rainStartTime)
        .easing(easing)
        .onUpdate(() => {
            scene.globalUniformsHub.uStormSharpness.value = progress.t;
            scene.globalUniformsHub.uRainHeaviness.value = progress.t * 0.75;
        })
        .onStart(() => {

            setTimeout(() => {
                glassRainTween.start()
                moonPosYTween.start()
                moonSizeTween.start()
            }, rainStartTime * 0.4)
        })
        .onComplete(() => {
            // scene.globalUniformsHub.enableLightning.value = true
        })
        .start()
}

// BULB LIGHT CONTROL
export function prepareBulb(scene) {
    // [DEBUG] Print all animation clip names — remove after identification
    if (scene.animations) {
        // console.log('%c [DEBUG] All scene.animations:', 'color: #00ffff; font-weight: bold;');
        scene.animations.forEach((clip, i) => {
            // console.log(`  [${i}] "${clip.name}" — duration: ${clip.duration.toFixed(2)}s, tracks: ${clip.tracks.length}`);
            clip.tracks.forEach(track => {
                // console.log(`       └ track: "${track.name}" (${track.constructor.name})`);
            });
        });
    }

    // Pre-bind animation action to avoid spike later
    if (scene.animations && scene.animations.length > 1) {
        const clip = scene.animations[1];
        if (scene.mixer) {
            const action = scene.mixer.clipAction(clip);
            action.play();
            action.weight = 0; // Invisible for now
            action.stop(); // Just ensuring compiled? Or play with 0 weight?
            // Better: Play it, set paused=true? 
            // Or just 'clipAction' is enough to cache binding? Use 'getClipAction' helper maybe?
            // scene.mixer.clipAction(clip); 
        }
    }
}

// BULB LIGHT CONTROL
export async function activateBulb(scene, tweenDuration = 3000) {
    let bulb = scene.objectMap.get("bulb");
    if (!bulb) return;

    let targetIntensity = 1000;
    // ... rest of vars 
    let targetDistance = 25;
    let targetScale = new THREE.Vector3(1, 1, 1);
    let targetPosition = new THREE.Vector3(0, 9.2, 0);
    let targetRotation = bulb.rotation.clone();

    // Safety check for light object, assuming it's named 'bulbLight'
    let bulbLight = bulb.getObjectByName("bulbLight");

    // RE-ATTACHMENT FIX: If bulbLight was detached (e.g., by fan re-attachment logic), find it in the scene and restore it.
    if (!bulbLight) {
        bulbLight = scene.getObjectByName("bulbLight") || scene.bulbLight;
        if (bulbLight && bulb) {
            bulb.attach(bulbLight);
            // Reset local offsets to standard bulb position
            bulbLight.position.set(0, 0, 0);
            if (bulbLight.target) {
                bulb.add(bulbLight.target);
                bulbLight.target.position.set(0, -10, 0);
            }
        }
    }

    // Start State
    let startIntensity = bulbLight ? bulbLight.intensity : 0;
    let startDistance = bulbLight ? bulbLight.distance : 0;
    let startScale = new THREE.Vector3(0, 0, 0)//bulb.scale.clone();

    // START POSITION: 'Lathe_Center'
    let latheCenter = scene.objectMap.get("Lathe_Center");
    let startPosition = new THREE.Vector3();
    // if (latheCenter) {
    //     latheCenter.getWorldPosition(startPosition);
    // } else {
    //     startPosition.copy(bulb.position); // Fallback
    // }
    startPosition.copy(bulb.position); // Fallback
    // Force set bulb to start position immediately
    bulb.position.copy(startPosition);

    // REVEAL BULB (Option B: Forever Candles)
    // The previous Dragon Ball sequence hides the entire bulb object (visible = false).
    // We must restore object visibility and re-attach the light if it was moved to the fan.
    bulb.visible = true;
    bulb.scale.setScalar(0);
    bulb.material.visible = true;

    if (bulbLight) {
        // bulbLight.visible = true; // [PERF_FIX] REMOVED visibility toggle to avoid Shader Stall.
        // If it was attached to something else (fan), ensure it's back on the bulb
        if (bulbLight.parent !== bulb) {
            bulb.add(bulbLight);
            if (bulbLight.target) bulb.add(bulbLight.target);
            bulbLight.position.set(0, 0, 0); // Reset local offset
            bulbLight.target.position.set(0, -10, 0); // Aim down relative to bulb
        }
    }

    const aura = bulb.getObjectByName("bulbAura");
    if (aura) aura.visible = true;

    let progress = { t: 0 };

    // BLACKHOLE CLIP ANIMATION
    const clip = scene.animations[1]
    const action = scene.mixer.clipAction(clip)
    action.reset(); // Ensure usage
    action.play();  // Ensure playing
    // action.timeScale = -1 


    // 1. Single Merged Tween
    new TWEEN.Tween(progress)
        .to({ t: 1 }, tweenDuration) // Duration: 5s
        .easing(TWEEN.Easing.Back.Out)
        .onStart(() => {
        })
        .onUpdate(() => {
            const t = progress.t;

            // --- A. Scale & Light ---
            bulb.scale.lerpVectors(startScale, targetScale, t);

            if (bulbLight) {
                bulbLight.intensity = THREE.MathUtils.lerp(startIntensity, targetIntensity, t);
                bulbLight.distance = THREE.MathUtils.lerp(startDistance, targetDistance, Math.min(t * 5, 1));
            }

            // [PERF_FIX] Shadow Map updates completely disabled during bulb travel to save GPU main-thread.
            // A final needsUpdate is called after the transition stabilization.

            // --- B. Position (Helix Path) ---

            // Linear Baseline Movement
            bulb.position.lerpVectors(startPosition, targetPosition, t);

            // Spiral Offset
            const helixRadius = 1.5;
            const revs = 4.0;
            const amp = Math.sin(t * Math.PI) * helixRadius;
            const angle = -t * Math.PI * 2 * revs;

            bulb.position.y += Math.cos(angle) * amp;
            bulb.position.z += Math.sin(angle) * amp;

            // --- C. Rotation ---
            const spin = (1 - t) * Math.PI * 2 * 4.0;
            bulb.rotation.set(
                targetRotation.x + spin,
                targetRotation.y + spin * 0.5,
                targetRotation.z
            );
        })
        .onComplete(() => {
            // PHASE 5: Restore interaction and global shadow auto-update 
            // the heavy helical light movement is over and the room is stable
            // if (scene.renderer) scene.renderer.shadowMap.autoUpdate = true;
            scene.raycasterEnabled = true;
            updateStory("Scenario Stable. System interactions re-enabled.");
            if (bulbLight) {
                new TWEEN.Tween(bulbLight)
                    .to({ intensity: 800 }, 3000)
                    .easing(TWEEN.Easing.Back.Out)
                    .start();
            }

            // KILL SWITCH CHECK: Only spawn balls if we haven't already exited the room
            if (!scene._spawnStopSignal) {
                if (!scene.dragonBalls || scene.dragonBalls.length === 0) {
                    spawnDragonBalls(scene, bulb);
                }
            }

            // // console.log(bulb.position)
        })
        .start();
}


function spawnDragonBalls(scene, sourceObject) {
    const dropStartDelay = 100; // Wait 1s
    const dropInterval = 300;   // 0.4s between each ball

    // Cleanup previous balls if they still exist (Leak prevention)
    if (scene.dragonBalls && scene.dragonBalls.length > 0) {
        scene.dragonBalls.forEach(b => { if (b.parent) b.parent.remove(b); scene.remove(b); });
    }
    scene.dragonBalls = [];

    const startOscStrength = 2

    setTimeout(() => {
        updateStory("The Dragon Balls descend...");

        for (let i = 1; i <= 7; i++) {
            const spawnBall = () => {
                // KILL SWITCH: Abort spawn sequence if user left the room
                if (scene._spawnStopSignal) return;

                // GUARD: If Physics is busy, wait and try again
                if (scene.world.isBusy) {
                    setTimeout(spawnBall, 16);
                    return;
                }

                // 1. Create Ball
                const ball = addDragonBall(scene, i);
                if (!ball) {
                    // This shouldn't happen with our guard, but safety first
                    setTimeout(spawnBall, 16);
                    return;
                }

                // 2. Position at Source (World Position!)
                const dropPos = new THREE.Vector3();
                sourceObject.getWorldPosition(dropPos);

                dropPos.y -= 0.5;

                // Random slight offset to avoid perfect stacking
                dropPos.x += (Math.random() - 0.5) * 0.2;
                dropPos.z += (Math.random() - 0.5) * 0.2;

                ball.position.copy(dropPos);

                //store original data
                ball.userData.originalPos = ball.position.clone();
                ball.userData.originalScale = ball.scale.clone();
                ball.userData.originalRot = ball.rotation.clone();

                // 3. Bind Physics
                // Important: set Rapier body position to match ThreeJS position
                if (ball.rapierBody) {
                    ball.rapierBody.setTranslation(dropPos, true);
                    ball.rapierBody.wakeUp();
                }
                // add a small impulse of x = 0.5


                // Initialize Oscillation Strength (Spiky) in userData
                ball.userData.oscStrength = startOscStrength;
                const aura = ball.children.find(c => c.name.startsWith("Aura"));
                if (aura) aura.userData.oscStrength = startOscStrength;

                // --- SHARED MATERIAL OVERRIDES ---
                // Helper to Apply Per-Object Uniforms
                const applyOscillationOverride = (mesh) => {
                    mesh.onBeforeRender = function (renderer, scene, camera, geometry, material, group) {
                        if (material.uniforms && material.uniforms.uOscillationStrength) {
                            // Save original global value
                            this.userData.prevOsc = material.uniforms.uOscillationStrength.value;
                            // Set per-object value
                            material.uniforms.uOscillationStrength.value = this.userData.oscStrength;
                        }
                    };

                    mesh.onAfterRender = function (renderer, scene, camera, geometry, material, group) {
                        if (material.uniforms && material.uniforms.uOscillationStrength) {
                            // Restore original global value
                            material.uniforms.uOscillationStrength.value = this.userData.prevOsc;
                        }
                    };
                };

                applyOscillationOverride(ball);
                if (aura) applyOscillationOverride(aura);

                // Initialize Scale (Small)
                const targetScale = ball.scale.clone();
                let initialScaleVal = 0.1;
                ball.scale.multiplyScalar(initialScaleVal);


                bindBodyObject(scene, ball, ball.rapierBody, ball.rapierShape);
                if (ball.rapierBody) {
                    const mass = ball.rapierBody.mass();

                    // Calibrated for consistent throw velocity regardless of mass
                    // Original values were tuned for a mass of ~3.0 (5.0 / 3.0 = ~1.6 m/s)
                    const baseVelX = 1.6;
                    const baseVelZ = (Math.random() > 0.5 ? 1.0 : -1.0) * (0.7 + Math.random());

                    ball.rapierBody.applyImpulse({
                        x: baseVelX * mass,
                        y: 0,
                        z: baseVelZ * mass
                    }, true);
                }

                // Calculate Ratio dynamically
                let radiusRatio = 0.5;
                if (ball.rapierShape && ball.rapierShape.radius && targetScale.x > 0) {
                    radiusRatio = ball.rapierShape.radius / targetScale.x;
                }

                ball.rapierCollider.setRadius(ball.scale.x * radiusRatio);

                // 4. Oscillation Tween (Spiky -> Round) && Scale Tween (Small -> Big)
                // Wait 2s, then tween over 4s
                const tweenStartDelay = 3000;
                setTimeout(() => {
                    const tweenDuration = 4500;
                    const progress = { t: 0 };
                    // User set 0.025

                    // Capture start states
                    const startScale = targetScale.clone().multiplyScalar(initialScaleVal);


                    // 1. Scale Tween (Quadratic In - Starts Slow, Ends Fast)
                    // Note: User description "grow fast start" contradicts "Quadratic In". 
                    // complying with "Quadratic In" to hide displacement artifacts at start.
                    const scaleProgress = { t: 0 };
                    new TWEEN.Tween(scaleProgress)
                        .to({ t: 1 }, tweenDuration)
                        .easing(TWEEN.Easing.Cubic.Out) // Fast start, slow end
                        .onUpdate(() => {
                            const t = scaleProgress.t;
                            // Scale (Start -> Target)
                            ball.scale.lerpVectors(startScale, targetScale, t);

                            // Collider Resize (Sync with Scale)
                            if (ball.rapierCollider) {
                                try {
                                    if (typeof ball.rapierCollider.setRadius === 'function') {
                                        // change to 
                                        ball.rapierCollider.setRadius(ball.scale.x * radiusRatio);

                                    }
                                } catch (e) { }
                            }
                        })
                        .start();

                    // 2. Oscillation Tween (Quadratic Out - Starts Fast, Ends Slow)
                    const oscProgress = { t: 0 };
                    new TWEEN.Tween(oscProgress)
                        .to({ t: 1 }, tweenDuration)
                        .easing(TWEEN.Easing.Exponential.In)
                        .onUpdate(() => {
                            const t = oscProgress.t;
                            // Oscillation Strength (Start -> 0)
                            const currentOsc = startOscStrength * (1 - t);
                            ball.userData.oscStrength = currentOsc;
                            if (aura) aura.userData.oscStrength = currentOsc;
                        })
                        .start();

                }, tweenStartDelay);



            };
            setTimeout(spawnBall, i * dropInterval);
        }

        // Enable Gravity Interaction after all balls + 3s
        // 7 balls * 600ms = 4200ms approx + 3000ms delay = 7200ms
        const totalSpawnTime = 8 * dropInterval; // Using 8 to match loop index limit + buffer
        setTimeout(() => {
            updateStory("Point Gravity System Online.");
            if (scene.world) scene.world.hasPointGravityOnBalls = true;
        }, totalSpawnTime + 3000);

        // CHAIN: Transfer bulb light to fan after all balls land
        setTimeout(() => {
            const cFanBulb = scene.getObjectByName('cFanBulb');

            const bulb = scene.getObjectByName('bulb');
            const bulbLight = scene.getObjectByName('bulbLight');

            if (!cFanBulb || !bulb) return;

            // 1. Re-attach the SpotLight AND its target to cFanBulb
            // SpotLight aims from its world position → target's world position.
            // The cFanBulb's local axes are unknown so we work in WORLD SPACE.
            if (bulbLight) {
                cFanBulb.attach(bulbLight);
                bulbLight.position.set(0, 0, 0); // Center on the fan bulb

                // Get the light's actual world position AFTER re-parenting
                const lightWorldPos = new THREE.Vector3();
                bulbLight.getWorldPosition(lightWorldPos);

                // Target lives in world space (scene root) so no parent transform
                // interferes. Place it directly below the light in WORLD Y.
                scene.add(bulbLight.target);
                bulbLight.target.position.set(
                    lightWorldPos.x,
                    lightWorldPos.y - 10, // 10 world units straight down
                    lightWorldPos.z
                );
            }


            // 2. Tween bulb to cFanBulb's world position while shrinking to 0
            const startPos = new THREE.Vector3();
            bulb.getWorldPosition(startPos);

            const targetPos = new THREE.Vector3();
            cFanBulb.getWorldPosition(targetPos);

            const startScale = bulb.scale.x;
            // tween scale to (0.1, 0.1, 0.9)

            new TWEEN.Tween(bulb.scale)
                .to({ x: 0.1, y: 0.1, z: 0.9 }, 2000)
                .easing(TWEEN.Easing.Cubic.In)
                .start();

            new TWEEN.Tween(bulb.position)
                .to(targetPos, 2000)
                .easing(TWEEN.Easing.Cubic.In) // Accelerate into the fan
                .start()
                .onComplete(() => {
                    bulb.visible = false;

                    // 3. Tween fanBulbMat glow to full intensity
                    if (fanBulbMat && fanBulbMat.uniforms && fanBulbMat.uniforms.glowIntensity) {
                        new TWEEN.Tween(fanBulbMat.uniforms.glowIntensity)
                            .to({ value: 1 }, 500)
                            .easing(TWEEN.Easing.Quadratic.Out)
                            .start();
                    }
                    //tween glowPower to 0.015
                    if (fanBulbMat && fanBulbMat.uniforms && fanBulbMat.uniforms.glowPower) {
                        new TWEEN.Tween(fanBulbMat.uniforms.glowPower)
                            .to({ value: 0.015 }, 500)
                            .easing(TWEEN.Easing.Quadratic.Out)
                            .start();
                    }
                    updateStory("Power transferred to ceiling array.");

                    //tween bulb scale to (0.1, 0.1, 0.1). on conpletion, hide the bulb
                    new TWEEN.Tween(bulb.scale)
                        .to({ x: 0.1, y: 0.1, z: 0.1 }, 500)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .onComplete(() => {
                            bulb.visible = false;
                        })
                        .start();
                })
                .start();

        }, totalSpawnTime); // Fires right after last ball spawns

    }, dropStartDelay);
}

export function callMjolnir(scene, options = {}) {
    // console.time("CHECK: callMjolnir Start");
    const { duration = 2000, delay: startDelay = 0, onComplete } = options;
    let t = new THREE.Object3D()
    t.name = 'testObj'
    scene.add(t)
    const hammer = scene.getObjectByName('mjolnir_low_mjolnir_hammer_0');

    if (hammer.isFlying) {
        // console.timeEnd("CHECK: callMjolnir Start");
        return
    }
    hammer.isFlying = true
    if (hammer && hammer.rapierBody) {
        // ...
        updateStory("Boomerang Mjolnir initiated");
        // Use stored original state
        const originalPos = hammer.userData.originalPos;
        const originalRot = hammer.userData.originalRot;

        if (!originalPos || !originalRot) {
            console.error("Mjolnir missing userData.originalPos/Rot");
            return;
        }

        // 1. Destination
        // const destinationPos = originalPos.clone();
        // destinationPos.y += 2;
        // const destinationPos = new THREE.Vector3(-5.22, 9.54, 5);
        const destinationPos = new THREE.Vector3(-1.5, 9, 7.3);

        // 2. Set Start State (Far away)
        const startPos = new THREE.Vector3(-20, 15, 30);

        // Switch to Kinematic
        hammer.rapierBody.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased);
        hammer.rapierBody.isManualControl = true; // GUARD: Prevents Integrity Check from conflicting
        hammer.rapierBody.wakeUp();

        // Teleport to start
        hammer.rapierBody.setTranslation(startPos, true);

        // Rotation: Identity + 90 degrees X
        const baseQuat = new THREE.Quaternion(0, 0, 0, 1);
        const x90 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
        baseQuat.multiply(x90);

        hammer.rapierBody.setRotation(baseQuat, true);



        // 3. Define Curved Path
        // const midPoint1 = new THREE.Vector3(2.92, 5, -2.43);
        // const midPointAir = new THREE.Vector3(-450, 155, 320);
        const midPointWindow = new THREE.Vector3(7, 6, 8);

        const midPointCam = new THREE.Vector3(12, 4, 0);
        let drone = scene.getObjectByName('drone');
        // Offset the target slightly so we don't penetrate the exact center (which causes extreme physics repulsion)
        const midPointDrone = new THREE.Vector3(drone.position.x, drone.position.y, drone.position.z);

        const curve = new THREE.CatmullRomCurve3(
            [startPos, midPointWindow, midPointCam, midPointDrone, destinationPos],
            false, // closed
            'centripetal'
        );
        // console.timeEnd("CHECK: callMjolnir Start");

        // --- EXPLANATION: setSensor(true) ---
        // We switch the collider to 'Sensor' mode during the controlled animation.
        // 1. A Kinematic body normally has 'infinite mass' and would crush the drone on contact,
        //    causing unstable physics or sending it flying instantly.
        // 2. 'Sensor' disables physical collision resolution (no bouncing/pushing).
        // 3. This allows the hammer to pass THROUGH the drone while we manually calculate
        //    and apply a controlled impulse (see "Manual Collision Check" below).
        let hammerCollider = null;
        if (hammer.rapierBody.numColliders() > 0) {
            hammerCollider = hammer.rapierBody.collider(0);
            hammerCollider.setSensor(true);
        }
        hammer.userData.hitDrone = false;

        // 4. Tween
        const progress = { val: 0 };
        new TWEEN.Tween(progress)
            .to({ val: 1 }, duration)
            .easing(TWEEN.Easing.Cubic.Out)
            .delay(startDelay)
            .onUpdate(() => {
                // KILL SWITCH: Abort if user left the room
                if (scene._spawnStopSignal) {
                    progress.val = 1.0;
                    hammer.isFlying = false;
                    return;
                }
                // Position on Curve
                const cp = curve.getPoint(progress.val);
                // Pass a plain object to avoid Rapier/Three aliasing issues
                hammer.rapierBody.setNextKinematicTranslation({ x: cp.x, y: cp.y, z: cp.z });

                // Rotation (Spinning Effect)
                // Spin 15 times around Local Y (Handle)
                const angle = progress.val * Math.PI * 30;
                const axis = new THREE.Vector3(0, 1, 0); // Handle
                const rotQuat = new THREE.Quaternion().setFromAxisAngle(axis, angle);

                // Combine with base orientation
                const finalQuat = baseQuat.clone().multiply(rotQuat);

                hammer.rapierBody.setNextKinematicRotation(finalQuat);

                // Manual Collision Check with Drone
                if (drone && drone.rapierBody && !hammer.userData.hitDrone) {
                    const cp = curve.getPoint(progress.val);
                    const dist = cp.distanceTo(drone.position);
                    if (dist < 3.0) { // Hit threshold
                        // Capture State BEFORE Hit (for recovery)
                        // const recoveryPos = drone.position.clone();
                        const recoveryRot = drone.quaternion.clone();
                        const recoveryPos = droneEndPos.clone();
                        // const recoveryRot = droneEndRot.clone();

                        // Apply Strong Impulse - persona-wise hit message
                        const _isPoba = personaManager.currentMode === PERSONA_IDS.POBA;
                        const _key = _isPoba ? 'SYS_DRONE_SUBTITLES_POBA' : 'SYS_DRONE_SUBTITLES_DEV';
                        updateStory(getDynamicText(_key));
                        drone.rapierBody.setBodyType(RAPIER.RigidBodyType.Dynamic);
                        drone.rapierBody.wakeUp();

                        // Direction: Up and Away
                        // Mass is now ~2.5, so Impulse 50 -> 20 m/s
                        drone.rapierBody.applyImpulse({ x: -100, y: 75, z: -100 }, true);
                        drone.rapierBody.applyTorqueImpulse({ x: 5., y: 5., z: 5 }, true); // Slight spin

                        hammer.userData.hitDrone = true;

                        // Schedule Recovery
                        setTimeout(() => {
                            if (scene._spawnStopSignal) return; // KILL SWITCH

                            const _keyR = (personaManager.currentMode === PERSONA_IDS.POBA) ? 'SYS_DRONE_SUBTITLES_POBA' : 'SYS_DRONE_SUBTITLES_DEV';
                            updateStory(getDynamicText(_keyR));
                            drone.rapierBody.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased);

                            // Tween back
                            const startPos = drone.position.clone();
                            const startRot = drone.quaternion.clone();
                            const tObj = { val: 0 };

                            new TWEEN.Tween(tObj)
                                .to({ val: 1 }, 2000)
                                .easing(TWEEN.Easing.Back.Out)
                                .onUpdate(() => {
                                    const p = new THREE.Vector3().lerpVectors(startPos, recoveryPos, tObj.val);
                                    const q = startRot.clone().slerp(recoveryRot, tObj.val);
                                    drone.rapierBody.setNextKinematicTranslation(p);
                                    drone.rapierBody.setNextKinematicRotation(q);
                                })
                                .onComplete(async () => {
                                    if (scene._spawnStopSignal) return; // FINAL KILL SWITCH

                                    drone.rapierBody.setGravityScale(0);
                                    drone.rapierBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
                                    drone.rapierBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
                                    drone.rapierBody.setBodyType(RAPIER.RigidBodyType.Fixed);
                                    // Back online — pick a fresh persona-wise line for both story + subtitle
                                    const _keyC = (personaManager.currentMode === PERSONA_IDS.POBA) ? 'SYS_DRONE_SUBTITLES_POBA' : 'SYS_DRONE_SUBTITLES_DEV';
                                    updateStory(getDynamicText(_keyC));

                                    startIntegrityCheckLoop(scene)
                                    // Reveal welcome text with drone projection effect
                                    await activateFloorText(scene, 'welcome', {
                                        scale: 1.65,
                                        duration: 2500,
                                        isAsync: true
                                    });

                                    await delay(5500);
                                    if (scene._spawnStopSignal) return; // FINAL KILL SWITCH
                                    updateSubtitle(getDynamicText(_keyC));
                                    // shootDroneBeam(scene, drone);

                                    // OPTIMIZATION: Switch informer to opacity mode now that the transition peak is over
                                    if (scene.cursorInformer && scene.cursorInformer.switchToOpacityMode) {
                                        scene.cursorInformer.switchToOpacityMode();
                                    }

                                })
                                .start();

                        }, 2000);
                    }
                }
            })
            .onComplete(() => {
                updateStory("Mjolnir Returned.");
                // 5. Revert to Dynamic
                hammer.rapierBody.setBodyType(RAPIER.RigidBodyType.Dynamic);
                hammer.rapierBody.isManualControl = false;

                // Update Integrity Baseline to new position
                hammer.userData.originalPos = hammer.position.clone();
                // Store rotation as Euler to match initial setup format
                hammer.userData.originalRot = new THREE.Euler().setFromQuaternion(hammer.quaternion);

                //update body integrity position and rotation

                // Return to Solid Physics
                // We disable Sensor mode so the hammer becomes a physical object again,
                // capable of resting on the floor and colliding normally.
                if (hammerCollider) {
                    hammerCollider.setSensor(false);
                }
                hammer.userData.hitDrone = false;

                hammer.rapierBody.wakeUp();
                hammer.isFlying = false;

                if (onComplete) onComplete();
            })
            .start();

    } else {
        console.warn("Mjolnir mesh or rapierBody not found");
    }
}

/**
 * SHOOT DRONE BEAM
 * Visual connection between drone and the status UI element.
 * Tracks the animated eye (Sphere001_0) and projects toward HUD subtitle.
 */
export function createDroneBeam(scene, name = 'drone-beam', color = null) {
    const group = new THREE.Group();
    group.name = name;

    const beamColor = color || (GLOBAL_COLORS.ELECTRIC_CYAN || 0x00ffff);

    // Helper to create a beam segment
    const createSegment = (name, color, radius, opacity) => {
        const geom = new THREE.CylinderGeometry(radius, radius, 1, 8, 1, true);
        geom.rotateX(Math.PI / 2); // Align with Z-axis
        geom.translate(0, 0, 0.5); // Pivot at start
        const mat = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: opacity,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geom, mat);
        mesh.name = name;
        return mesh;
    };

    // 1. CORE (White/Hot) - Thin
    group.add(createSegment('beam-core', 0xffffff, 0.005, 1.0));
    // 2. INNER GLOW (Themed) - Medium
    group.add(createSegment('beam-glow', beamColor, 0.015, 0.6));
    // 3. OUTER GLOW (Gold/Heat) - Wide
    group.add(createSegment('beam-outer', GLOBAL_COLORS.ACCENT_GOLD || 0xffcc00, 0.03, 0.3));

    group.frustumCulled = false;
    scene.add(group);
    return group;
}

export function triggerDroneHitEffect(scene, position, lookAtTarget = null, customColors = null) {
    const group = new THREE.Group();
    group.position.copy(position);
    scene.add(group);

    // Sub-group for Shards (to maintain lookAt orientation)
    const shardGroup = new THREE.Group();
    if (lookAtTarget) {
        shardGroup.lookAt(lookAtTarget); // Local +Z points back towards drone
    }
    group.add(shardGroup);

    // 1. KINETIC SHARDS (Hemispherical Reflection)
    const shardGeom = new THREE.IcosahedronGeometry(0.1, 0); // Slightly larger
    const shards = [];
    const shardCount = 35; // Increased from 10 to 35 for high-fidelity impact

    const cyanColor = 0x00ffff; // Electric Cyan
    const deepCyanColor = 0x0088ff; // Deep Cyan
    const whiteHotColor = 0xffffff; // White Hot
    const colors = customColors || [whiteHotColor, cyanColor, deepCyanColor, 0x00ccff];

    for (let i = 0; i < shardCount; i++) {
        const colorValue = colors[i % colors.length];

        const innerMat = createInnerGlowMat(colorValue, 1.2, 2.5);
        const shard = new THREE.Mesh(shardGeom, innerMat);

        const outerMat = createOuterGlowMat(colorValue, 1.0, 0.01, 4.0, THREE.FrontSide);
        const aura = new THREE.Mesh(shardGeom, outerMat);
        aura.scale.setScalar(1.35);
        shard.add(aura);

        // --- HEMISPHERICAL TRAJECTORY ---
        // Since group looks at drone, positive Z = towards drone.
        // theta: 0..2PI, phi: 0..PI/2 (hemisphere)
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * (Math.PI * 0.4); // Slightly narrowed for more "push"

        const localVelocity = new THREE.Vector3(
            Math.sin(phi) * Math.cos(theta),
            Math.sin(phi) * Math.sin(theta),
            Math.cos(phi) // Forward bias
        ).multiplyScalar(0.08 + Math.random() * 0.12); // Slower initial burst

        shard.userData.velocity = localVelocity;

        // Orient shard initially towards its trajectory (for stretching)
        shard.lookAt(localVelocity.clone().add(shard.position));

        shard.scale.setScalar(0.1 + Math.random() * 0.5);
        shardGroup.add(shard);
        shards.push(shard);
    }

    // 2. SHOCKWAVE RINGS (Dual Expansion - Flat to Ground)
    const ringGeom = new THREE.TorusGeometry(1, 0.015, 8, 32);
    const primaryColor = colors[1] || colors[0]; // Second color is usually the beam color
    const primaryMat = createOuterGlowMat(primaryColor, 2.0, 0.01, 4.0, THREE.DoubleSide);
    const ringPrimary = new THREE.Mesh(ringGeom, primaryMat);
    ringPrimary.rotation.x = Math.PI / 2; // Parallel to ground
    group.add(ringPrimary);

    // Inner Hot Ring (Keep White or themed-White)
    const hotColor = colors[0] || 0xffffff;
    const ringWhiteMat = createOuterGlowMat(hotColor, 1.5, 0.01, 4.0, THREE.DoubleSide);
    const ringWhite = new THREE.Mesh(ringGeom, ringWhiteMat);
    ringWhite.rotation.x = Math.PI / 2; // Parallel to ground
    ringWhite.scale.setScalar(0.5);
    group.add(ringWhite);

    // 3. VOLUMETRIC FLASH CORE (The "Punch")
    const flashGeom = new THREE.SphereGeometry(0.4, 16, 16);
    const flashMat = createInnerGlowMat(hotColor, 1.0, 4.0);
    const flash = new THREE.Mesh(flashGeom, flashMat);
    group.add(flash);

    // ANIMATION TWEEN
    new TWEEN.Tween({ progress: 0 })
        .to({ progress: 1 }, 1000) // Slightly longer fade-out
        .easing(TWEEN.Easing.Quadratic.Out) // Smoother start
        .onUpdate((obj) => {
            const p = obj.progress;

            shards.forEach(shard => {
                shard.position.add(shard.userData.velocity);

                // Volume fade + Kinetic Stretch
                const scaleP = 1.0 - p;
                const stretch = 1.0 + p * 4.0; // Reduced streak length

                shard.scale.set(
                    (0.3 + Math.random() * 0.4) * scaleP,
                    (0.3 + Math.random() * 0.4) * scaleP,
                    (0.4 + Math.random() * 0.6) * scaleP * stretch
                );

                if (shard.material.uniforms) {
                    shard.material.uniforms.glowIntensity.value = 2.5 * scaleP;
                }
                const aura = shard.children[0];
                if (aura && aura.material.uniforms) {
                    aura.material.uniforms.outerGlowStrength.value = 1.0 * scaleP;
                }
            });

            // Rings expansion with slight "wobble"
            const ringScale = 0.1 + p * 3.5;
            ringPrimary.scale.set(ringScale, ringScale, 1.0);
            ringPrimary.material.uniforms.outerGlowStrength.value = 2.0 * (1.0 - p);

            const innerRingScale = 0.1 + p * 4.5;
            ringWhite.scale.set(innerRingScale, innerRingScale, 1.0);
            ringWhite.material.uniforms.outerGlowStrength.value = 1.0 * (1.0 - p);

            // Flash core: Intense burst then rapid shrink
            const flashP = Math.min(p * 4, 1.0); // Reach peak size at 25% of animation
            const flashScale = flashP < 0.5 ? p * 8.0 : (1.0 - p) * 1.5; // Half size
            flash.scale.setScalar(flashScale);

            if (flash.material.uniforms) {
                flash.material.uniforms.glowIntensity.value = 2.5 * (1.0 - p); // Reduced intensity
            }
        })
        .onComplete(() => {
            scene.remove(group);
            shardGeom.dispose();
            ringGeom.dispose();
            flashGeom.dispose();
            shards.forEach(s => {
                s.material.dispose();
                if (s.children[0]) s.children[0].material.dispose();
            });
            ringPrimary.material.dispose();
            ringWhite.material.dispose();
            flashMat.dispose();
        })
        .start();
}

/**
 * Force the drone to look at a specific world target using GazeFollower.
 * @param {THREE.Scene} scene 
 * @param {THREE.Object3D|THREE.Vector3} target - Object to track or static position
 * @param {boolean} lock - Whether to prevent other gaze updates
 */
export function updateDroneGaze(scene, target, lock = false, immediate = false) {
    const drone = getObj(scene, 'drone');
    if (!drone || !scene.gazeFollower) return;

    if (lock) {
        scene.gazeFollower.isLocked = true;
    }

    // Resolve target to an Object3D for GazeFollower
    let targetObj = target;
    if (target instanceof THREE.Vector3) {
        if (!drone.userData.gazeProxy) drone.userData.gazeProxy = new THREE.Object3D();
        drone.userData.gazeProxy.position.copy(target);
        targetObj = drone.userData.gazeProxy;
    }

    if (targetObj) {
        if (lock) drone.userData.lockTarget = targetObj;
        scene.gazeFollower.lookAtTarget(targetObj, immediate);
    }
}

/**
 * SHOOT DRONE BEAM
 * Visual connection between drone and the status UI element.
 * Tracks the animated eye (Sphere001_0) and follows the scanline progressive reveal.
 */
export function shootDroneBeam(scene, inputObj, text = "", targetPosition = null, beamName = 'drone-beam', isMulti = false, color = null, skipHitEffect = false, durationParam = null, isManual = false) {
    // 1. Resolve actual drone model
    let drone = getObj(scene, 'drone');
    const eye = drone ? drone.getObjectByName('Sphere001_0') : null;
    if (!eye) return;

    let beam = getObj(scene, beamName);
    if (!beam) beam = createDroneBeam(scene, beamName, color);

    if (beam.activeRequestID) cancelAnimationFrame(beam.activeRequestID);

    const camera = scene.camera;
    const startPos = new THREE.Vector3();
    const endPos = new THREE.Vector3();

    // 2. Sync Duration
    const isStaticTarget = targetPosition !== null;
    const isEndless = durationParam === Infinity;

    let duration;
    if (isEndless) {
        duration = Infinity;
    } else if (durationParam !== null) {
        duration = durationParam;
    } else {
        const minDur = isStaticTarget ? 400 : 1000;
        const maxDur = isStaticTarget ? 600 : 3000;
        duration = isStaticTarget ? 500 : Math.min(Math.max(text.length * 50, minDur), maxDur);
    }
    const startTime = performance.now();

    // 3. Dynamic Alignment Loop
    beam.visible = false;

    const setBeamOpacity = (opacity) => {
        beam.children.forEach((child, i) => {
            // Core stays bright, outer glows pulse
            const mult = i === 0 ? 1 : (i === 1 ? 0.7 : 0.4);
            child.material.opacity = opacity * mult;
        });
    };

    const updateBeamGeometry = (start, end) => {
        const dist = start.distanceTo(end);
        beam.position.copy(start);
        beam.lookAt(end);
        beam.children.forEach(child => {
            child.scale.z = dist;
        });
    };

    const animateBeam = () => {
        const now = performance.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1.0);

        if (progress < 1.0) {
            let foundTarget = false;

            if (isStaticTarget) {
                endPos.copy(targetPosition);
                foundTarget = true;
            } else if (inputObj && inputObj.isMesh) {
                // FALLBACK: track the input mesh if no static target
                inputObj.getWorldPosition(endPos);
                foundTarget = true;
            }

            if (foundTarget) {
                eye.getWorldPosition(startPos);

                // ONLY update geometry internally if not under manual control
                if (!isManual) {
                    updateBeamGeometry(startPos, endPos);

                    // Drone head follows the beam tip (Only for single beams to avoid conflict)
                    if (!isMulti) {
                        updateDroneGaze(scene, endPos, true);
                    }
                }

                beam.visible = true;

                // Hit effect trigger (once at start or based on some logic)
                if (isStaticTarget && progress < 0.1 && !beam.hitTriggered && !skipHitEffect) {
                    const hitColors = color ? [0xffffff, color, color] : null; // Pass customized beam color to hit effect correctly
                    triggerDroneHitEffect(scene, endPos, startPos, hitColors);
                    beam.hitTriggered = true;
                }
            } else {
                beam.visible = false;
            }

            // FX: Heat Pulse
            const pulse = 0.7 + Math.sin(now * 0.08) * 0.3;
            let fade;
            if (isEndless) {
                fade = 1.0; // Stay bright
            } else {
                fade = isStaticTarget ? (progress < 0.2 ? progress * 5 : 1.0 - (progress - 0.5) * 2) : (1.0 - Math.pow(progress, 2.0));
            }
            setBeamOpacity(pulse * Math.max(0, fade));

            beam.activeRequestID = requestAnimationFrame(animateBeam);
        } else {
            // Finish Sequence
            beam.visible = false;
            setBeamOpacity(0);
            beam.activeRequestID = null;
            beam.hitTriggered = false;

            if (scene.gazeFollower && !drone.userData.isHovering) {
                scene.gazeFollower.isLocked = false;
                scene.gazeFollower.lookAtTarget(camera);
            }
        }
    };

    beam.hitTriggered = false;
    beam.activeRequestID = requestAnimationFrame(animateBeam);
}

function sendOffMjolnir(scene, tweenDuration = 2000) {

}

export function setScenarioState(scene, scenarioStateIndex = 0) {
    const config = SCENARIO_STATES[scenarioStateIndex];
    if (!config) {
        console.error(`Scenario state index ${scenarioStateIndex} not found`);
        return;
    }

    // 1. Update Scene State Name
    scene.scenarioState = config;

    // 2. Apply UI Configs
    if (config.ui) {
        // A. Cursor Informer
        if (config.ui.cursorInformer !== undefined) {
            scene.cursorInformerEnabled = config.ui.cursorInformer;
            if (scene.cursorInformer) {
                if (config.ui.cursorInformer) {
                    if (scene.cursorInformer.show) scene.cursorInformer.show();
                    else scene.cursorInformer.style.display = 'block';
                } else {
                    if (scene.cursorInformer.hide) scene.cursorInformer.hide();
                    else scene.cursorInformer.style.display = 'none';
                }
            }
        }

        // B. Subtitle (Narrative Text)
        if (config.ui.subtitle === false) {
            updateStory(""); // Clear Story box
            clearSubtitle(true); // Immediate clear Subtitle box
        }

        // C. Persona Switch Button (3D -> 2D Snap)
        if (config.ui.personaButton3D === false) {
            if (window.boneTracker && typeof window.boneTracker.forceReset === 'function') {
                window.boneTracker.forceReset();
            }
        }
    }

    // 3. Apply Environment Configs
    if (config.environment) {
        // CSS Background (Container)
        const container = scene.domElement;
        if (container) {
            if (config.environment.cssBackground) {
                container.style.background = config.environment.cssBackground;
            } else if (config.environment.background) {
                // Fallback
                container.style.background = config.environment.background;
            }
        }

        if (config.environment.sceneBackground !== undefined) {
            if (config.environment.sceneBackground === null) {
                scene.background = null;
            } else {
                scene.background = new THREE.Color(config.environment.sceneBackground);
            }
        }
    }

    // 4. Apply Renderer Configs
    if (scene.renderer) {
        // [PERF_FIX] Skip resolution adjustment during active transitions (DPR Snap handles it later)
        if (!scene.isTransitioning) {
            // Pixel Ratio Scale
            const dpr = window.devicePixelRatio || 1;
            const scale = (config.pixelRatioScale !== undefined) ? config.pixelRatioScale : 1.0;
            const targetRatio = dpr * scale;

            scene.renderer.setPixelRatio(targetRatio);

            // Force Resize/Recalculate for Composer
            if (scene.points && typeof scene.points.onWindowResize === 'function') {
                scene.points.onWindowResize();
            }
        }

        // Tone Mapping Exposure
        if (config.toneMappingExposure !== undefined) {
            scene.renderer.toneMappingExposure = config.toneMappingExposure;
        }
    }

    // 5. Sync HUD Uniforms with Smooth Transitions
    if (scene.HUD && scene.HUD.material.uniforms && config.hudUniforms) {
        const TWEEN_DURATION = 3000;
        const TWEEN_EASING = TWEEN.Easing.Quadratic.Out;

        for (const [key, val] of Object.entries(config.hudUniforms)) {
            const uniform = scene.HUD.material.uniforms[key];
            if (!uniform) continue;

            // Stop any existing tweens on this specific uniform to avoid conflict
            if (uniform._currentTween) uniform._currentTween.stop();

            if (val && val.isColor) {
                // Color Transition
                uniform._currentTween = new TWEEN.Tween(uniform.value)
                    .to({ r: val.r, g: val.g, b: val.b }, TWEEN_DURATION)
                    .easing(TWEEN_EASING)
                    .start();
            } else if (typeof val === 'number') {
                // Scalar Transition
                uniform._currentTween = new TWEEN.Tween(uniform)
                    .to({ value: val }, TWEEN_DURATION)
                    .easing(TWEEN_EASING)
                    .start();
            } else {
                // Non-tweenable fallback (Vectors, etc. - can be expanded if needed)
                uniform.value = val;
            }
        }
    }
    // Deco tween
    // scene.HUD.tweenDeco('showDeco').start();
}

export function activateFloorText(scene, text = 'welcome', options = {}) {
    const {
        scale = null,
        rotation = null,
        position = null,
        duration = 2000,
        isAsync = false,
        scanline = 1.0
    } = options;
    const uniforms = (scene.globalUniformsHub && scene.globalUniformsHub.uniforms) || scene.constantUniform;

    if (!uniforms || !uniforms.uWelcomeProgress) {
        console.warn("Welcome Text uniforms not found on scene");
        return;
    }

    // Apply immediate overrides if provided
    if (scale !== null && uniforms.uWelcomeScale) uniforms.uWelcomeScale.value = scale;
    if (rotation !== null && uniforms.uWelcomeRotation) uniforms.uWelcomeRotation.value = rotation;
    if (position !== null && uniforms.uWelcomePosition) {
        if (position instanceof THREE.Vector2) uniforms.uWelcomePosition.value.copy(position);
        else if (position.x !== undefined && position.y !== undefined) uniforms.uWelcomePosition.value.set(position.x, position.y);
    }
    if (uniforms.uWelcomeScanline) uniforms.uWelcomeScanline.value = scanline;

    // Reset initial states for the sequence
    if (uniforms.uWelcomeOpacity) uniforms.uWelcomeOpacity.value = 1.0;
    if (uniforms.uWelcomeGlow) uniforms.uWelcomeGlow.value = 0.0;
    if (uniforms.uWelcomeProgress) uniforms.uWelcomeProgress.value = 0.0;

    // 1. Reveal (1 by 1 - Linear easing works best for the shader's segment count logic)
    const revealTween = new TWEEN.Tween(uniforms.uWelcomeProgress)
        .to({ value: 1.0 }, duration)
        .easing(TWEEN.Easing.Linear.None);

    // 2. Flash (for 2 seconds total)
    const flashTween = new TWEEN.Tween(uniforms.uWelcomeGlow)
        .to({ value: 5.2 }, 500)
        .repeat(3)
        .yoyo(true)
        .easing(TWEEN.Easing.Quadratic.InOut);

    // 3. Disappear (Wait 4 seconds of "stay" then fade out)
    const fadeOutTween = new TWEEN.Tween(uniforms.uWelcomeOpacity)
        .to({ value: 0.0 }, 1000)
        .delay(4000)
        .easing(TWEEN.Easing.Quadratic.In)
        .onComplete(() => {
            // Reset Progress to clean up
            uniforms.uWelcomeProgress.value = 0.0;
            uniforms.uWelcomeGlow.value = 0.0;
        });

    // Chain the sequence
    revealTween.chain(flashTween);
    flashTween.chain(fadeOutTween);

    revealTween.start();

    if (!isAsync) return revealTween;
    // Resolve when the text is fully drawn (the "activation" part)
    return new Promise(resolve => revealTween.onComplete(resolve));
}

export async function assembleRoom(scene, assembleDuration = 800) {

    const isLowPower = scene.isLowPowerMode;
    const finalDuration = isLowPower ? assembleDuration * 0.6 : assembleDuration;

    // 0. Safety Cleanup: Purge any leftovers from previous sessions immediately
    // to prevent "stale" coins from snapping visible during the build phase.
    snapPurgeCoins(scene);

    // RESET KILL SWITCH
    scene._spawnStopSignal = false;
    if (scene._assembleCount === undefined) scene._assembleCount = 0;
    scene._assembleCount++;

    // 1. PERFORMANCE OPTIMIZATION: Freeze Shadows and Snap Resolution during massive movement
    if (scene.renderer) {
        if (scene.renderer.shadowMap) scene.renderer.shadowMap.autoUpdate = false;
        prepareRendererForTransition(scene);
    }
    scene.isTransitioning = true;
    scene.raycasterEnabled = false; // GUARD: Disable interaction during build phase

    // 2. Force Disable Physics Contention (Lag Fix)
    // TWEEN controls the Mesh. Physics Control must be OFF.
    if (scene.world) scene.world.isActive = false;
    deactivateTimePhysics(scene)
    try {
        // --- PARALLEL ASSEMBLY ORCHESTRATION ---
        // 1. Blackhole (Desk Core): Start immediately on visit 1, staggered on re-entry
        if (scene._assembleCount <= 1) {
            PerformanceLogger.start('Tween Blackhole');
            tweenBlackhole(scene, finalDuration);
            PerformanceLogger.end('Tween Blackhole');
        } else {
            // [ENHANCEMENT] For re-entry: Slight delay (400ms) for the "Dramatic Anchor" feel
            // without blocking the rest of the furniture build.
            setTimeout(() => {
                tweenBlackhole(scene, finalDuration);
            }, 400);
        }

        // BLOOM: Ensure garden is in 'flower' mode (Room Scenario)
        if (scene.HUD && typeof scene.HUD.tweenGardenMode === 'function') {
            scene.HUD.tweenGardenMode(true, finalDuration);
        }

        // 2. Furniture/Objects: Start immediately and WAIT for them to finish
        PerformanceLogger.start('Tween Remaining Objects');
        // CRITICAL: We 'await' here to provide a stabilization window. 
        // This prevents the Bulb, Drone, and Physics from starting while frames are already dropped by furniture.
        await tweenRemainingObjects(scene, finalDuration);
        PerformanceLogger.end('Tween Remaining Objects');

        // BLOOM: Reset Bloom parameters for Room Scenario (Restore glow to monitors, moon, etc.)
        if (scene.points && scene.points.bloomPass) {
            new TWEEN.Tween(scene.points.bloomPass)
                .to({
                    strength: isLowPower ? 0.8 : 1.0,
                    threshold: 0.21, // Allow emissive items to glow in the room
                    radius: 0.4
                }, finalDuration)
                .easing(TWEEN.Easing.Cubic.Out)
                .start();
        }

        // GARDEN: Ensure stars and atmosphere are visible
        if (scene.HUD && scene.HUD.material.uniforms.uIsGardenFlower) {
            scene.HUD.material.uniforms.uIsGardenFlower.value = 1.0;
        }

        // RENDERER: Restore room-specific exposure and Bloom baseline
        if (scene.renderer) {
            scene.renderer.toneMappingExposure = 0.25;
            // shadowMap.autoUpdate is now delayed until bulb finishes travel (throttled)
        }
        if (scene.points && scene.points.bloomPass) {
            scene.points.bloomPass.threshold = 0.21; // Hard snap for sanity
            scene.points.bloomPass.strength = 1.0;
        }

        // --- PERFORMANCE OPTIMIZATION (Option 1) ---
        // Set an opaque background to allow the browser compositor 
        // to skip expensive transparency blending for the room state.
        scene.background = new THREE.Color(0x000000);

        // applyTimePhysics(scene);
        // await delay(isLowPower ? 200 : 400); // Increased stagger between Physics and Bulb
        // console.time("[Transition] Activate Bulb");




        await delay(200);

        activateBulb(scene);

        // Wait 3s after bulb activation, then smoothly (but performantly) upgrade DPR
        setTimeout(async () => {
            await restoreResolutionStaggered(scene, 0.2, 0.625, 800);

            // FINAL UNLOCK: Resolution is stable, proceed to interactive mode
            scene.isTransitioning = false;

            await delay(4000);
            if (scene.windowLight) {
                scene.windowLight.intensity = 10000000;
                await delay(40);
                scene.windowLight.intensity = 0;
            }
        }, 800);



    } finally {

    }


    updateStory(getDynamicText('ENV_ATMOS_INIT'));
    activateEnvironment(scene, MASTER_TIME * 0.6)


    PerformanceLogger.start('Sync Bodies');
    if (scene.rapierWorldWrapper && scene.rapierWorldWrapper.syncBodiesToMeshes) {
        scene.rapierWorldWrapper.syncBodiesToMeshes();
    }
    PerformanceLogger.end('Sync Bodies');

    updateStory(getDynamicText('SYS_PHYSICS_INIT'));

    // applyTimePhysics(scene); // Sets isActive = true

    updateStory(getDynamicText('SYS_DRONE_START'));

    playDrone(scene, {
        duration: isLowPower ? 2000 : 3000,
        delay: isLowPower ? 1500 : 2500,
        onStart: () => {
            // scene.HUD.tweenDeco('showDeco');
            // scene.HUD.runTweenShowIsland(1000);
        },
        onComplete: () => {
            callMjolnir(scene, {
                duration: isLowPower ? 2000 : 4000,
                onComplete: () => {
                    setupIntegrityBaseline(scene)

                    let dragonEye = scene.getObjectByName('wallArea');
                    if (dragonEye && dragonEye.material && dragonEye.material.uniforms && dragonEye.material.uniforms.uEyeActive) {
                        dragonEye.material.uniforms.uEyeActive.value = true;
                        openDragonEye(scene)
                        setTimeout(() => {
                            if (dragonEye && dragonEye.material && dragonEye.material.uniforms) {
                                closeDragonEye(scene)
                            }
                        }, 3000)
                    }
                    // UNLOCK SCROLLING: Disabled by user request — container is now perpetually locked.
                    // 3. HUD REVEAL: Separated UI layers to manage reveal precisely after movement.
                    // Start the backdrop (Island)
                    if (scene.HUD && typeof scene.HUD.runTweenShowIsland === "function") {
                        scene.HUD.runTweenShowIsland(isLowPower ? 2500 : 3000);
                    }

                    // Reveal Navigation Buttons
                    NavInteractions.onRoomAssemble(scene);

                    // Reset CV Panel in case it was "fallen" (Synced with nav button reveal DUR)
                    if (window.cvReset) window.cvReset(1500);

                    // Reveal Frame Decos (Monitor glows, etc.)
                    if (scene.HUD && typeof scene.HUD.runTweenShowDecos === "function") {
                        scene.HUD.runTweenShowDecos();
                    }
                }
            })
            const planeSky = scene.getObjectByName('planeSky');
            if (planeSky) planeSky.visible = true;

            setTimeout(() => {

                slideGlassAnimation(scene, { forcedX: 0.65, environmentRatio: 1, delay: 0 });

            }, 600);
        }
    });

    // scene.isTransitioning = false;

    // 5. POST-TRANSITION STABILIZATION
    await delay(isLowPower ? 1000 : 2000)
    // RE-ENABLE SHADOWS: We do this last to avoid contention while objects were flying.
    if (scene.renderer) {
        // One final shot for the settled state
        // scene.renderer.shadowMap.needsUpdate = true;
        // Now resume auto-updates for interactive objects (like physics objects)
        setTimeout(() => {
            // if (scene.renderer) scene.renderer.shadowMap.autoUpdate = true;
        }, 500);
    }

    // SYSTEM STAGGER: Decouple interaction enablement from deep callbacks
    // to ensure interaction comes back even if Mjolnir sequence is long/lagged.
    setTimeout(() => {
        scene.raycasterEnabled = true;
        // scene.isTransitioning = false; // Unified: Now handled by restoreResolutionStaggered
        scene.targetAnimHz = 51; // --- 51Hz ANIMATIONS: UNLOCKED (Post-Assembly Sweet Spot) ---
    }, isLowPower ? 5500 : 9000);

    scene.globalUniformsHub.enableLightning.value = true;

    // Phase 2 Restore: Transition DPR -> Room Baseline (Binary Handoff)
    // [PERF_FIX] Removed 'Every-Frame' tween that was causing 60x buffer re-allocation per second.
    if (scene.renderer) {
        const nativeDPR = window.devicePixelRatio || 1;
        const roomBaseline = nativeDPR * (SCENARIO_STATES[1].pixelRatioScale || 0.625);

        // DELAYED SNAP: Unified and replaced by restoreResolutionStaggered
    }
}

/**
 * disassembleRoom
 * Modern disassembly logic to hide room elements and prepare for Points return.
 */
export async function disassembleRoom(scene, duration = 1500) {
    // 1. Stop Integrity Loops and Physics
    stopIntegrityCheckLoop(scene);

    // Perform shared state cleanup (Balls, Hammer, Lights)
    resetRoomState(scene);

    // ACTIVATE SPAWN KILL SWITCH
    scene._spawnStopSignal = true;

    // UI CLEANUP: Hide story and subtitles immediately
    updateStory("");
    clearSubtitle(true);

    // BONE TRACKER: Stop eye tracking
    if (scene.gazeFollower && typeof scene.gazeFollower.stop === 'function') {
        scene.gazeFollower.stop();
    }

    if (scene.world) {
        scene.world.isActive = false;
        scene.world.hasPointGravityOnBalls = false;
    }

    if (scene.windowLight) {
        scene.windowLight.intensity = 0; // RE-GHOST: Prevent shader stall on re-entry
        // scene.windowLight.visible = false; // [PERF_FIX] Disabled visibility toggle
    }

    // UI PERSONA SWITCH: Force the "About" button back to UI instantly
    if (window.boneTracker && typeof window.boneTracker.forceReset === 'function') {
        window.boneTracker.forceReset();
    }

    // --- DECO CLEANUP (Moved to resetRoomState) ---

    // --- LIGHTING CLEANUP (Moved to resetRoomState) ---

    // 2. HUD Re-activation (Sync with reverse camera)
    // We don't hide them here; the orchestrator will show them via TWEENS.

    // 3. Trigger Environment Disassembly
    disassembleEnvironment(scene, duration);

    // 4. Return to Points Scenario State (Index 0)
    setScenarioState(scene, 0);

    // 5. Restore Renderer Performance
    if (scene.renderer) {
        // scene.renderer.shadowMap.autoUpdate = true; // Restore shadow updates
    }

    // 6. Unhide Points Cloud immediately
    if (scene.pointsApp) {
        scene.pointsApp.points.visible = true;
    }
}

/**
 * disassembleEnvironment
 * Moves all room objects back to their hidden/void positions.
 */
export function disassembleEnvironment(scene, duration = 1500) {
    const roomModel = scene.getObjectByName('roomGLBModel');
    if (!roomModel) return;

    const children = Array.from(roomModel.children);
    const total = children.length;
    const chunkSize = 20;
    let currentIndex = 0;

    const processDisassemblyBatch = () => {
        const limit = Math.min(currentIndex + chunkSize, total);
        for (let i = currentIndex; i < limit; i++) {
            const obj = children[i];
            
            // Stop any assembly tweens
            if (obj.userData.scenarioTween) {
                obj.userData.scenarioTween.stop();
                obj.userData.scenarioTween = null;
            }

            if (obj.userData.originalPos) {
                const objDuration = duration + Math.random() * 500;
                new TWEEN.Tween(obj.position)
                    .to({
                        x: obj.userData.hidePos?.x || 0,
                        y: obj.userData.hidePos?.y || -SPAWN_DISTANCE,
                        z: obj.userData.hidePos?.z || 0
                    }, objDuration)
                    .easing(TWEEN.Easing.Cubic.In)
                    .onComplete(() => { obj.visible = false; })
                    .start();
            } else {
                obj.visible = false;
            }
        }

        currentIndex = limit;
        if (currentIndex < total) {
            requestAnimationFrame(processDisassemblyBatch);
        }
    };

    requestAnimationFrame(processDisassemblyBatch);

    // Aggressive group hide
    new TWEEN.Tween(roomModel.scale)
        .to({ x: 0, y: 0, z: 0 }, duration)
        .easing(TWEEN.Easing.Cubic.In)
        .onComplete(() => { roomModel.visible = false; })
        .start();

    // 2. Specifically handle the "Built" objects from A0 step
    const specialObjects = ["rightWall-cover", "a-char", "stool", "floor", "planeSky"];
    specialObjects.forEach(name => {
        const obj = scene.getObjectByName(name);
        if (obj) {
            const hidePos = obj.userData.hidePos || { x: 0, y: -SPAWN_DISTANCE, z: 0 };

            // Position Tween
            new TWEEN.Tween(obj.position)
                .to(hidePos, duration)
                .easing(TWEEN.Easing.Cubic.In)
                .onComplete(() => { obj.visible = false; })
                .start();

            // Scale Tween (to 0)
            new TWEEN.Tween(obj.scale)
                .to({ x: 0, y: 0, z: 0 }, duration)
                .easing(TWEEN.Easing.Cubic.In)
                .start();
        }
    });

    // 3. Clear all Physics-bound interactive objects (Dragonballs, Mjolnir, etc.)
    if (scene.physicObjects) {
        scene.physicObjects.forEach(obj => {
            // [LAG FIX] Stop any existing scenario tweens to prevent fighting animations
            if (obj.userData.scenarioTween) {
                obj.userData.scenarioTween.stop();
                obj.userData.scenarioTween = null;
            }

            const ud = obj.userData;
            if (ud.hidePos) {
                const objDuration = duration + Math.random() * 500;
                obj.userData.scenarioTween = new TWEEN.Tween(obj.position)
                    .to({
                        x: ud.hidePos.x,
                        y: ud.hidePos.y,
                        z: ud.hidePos.z
                    }, objDuration)
                    .easing(TWEEN.Easing.Cubic.In)
                    .onComplete(() => {
                        obj.visible = false;
                        obj.userData.scenarioTween = null;
                    })
                    .start();
            } else {
                obj.visible = false;
            }

            if (obj.userData.originalScale) {
                new TWEEN.Tween(obj.scale)
                    .to({ x: 0, y: 0, z: 0 }, duration)
                    .start();
            }
        });
    }

    // 4. Reset Bloom for Points (Smooth transition to default)
    if (scene.points && scene.points.bloomPass) {
        new TWEEN.Tween(scene.points.bloomPass)
            .to({ strength: 1.5, radius: 0.4, threshold: 0.85 }, duration)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    }
}

export async function revealTest(scene) {
    //something here which show the hero, which is named 'a-char'
    let hero = scene.getObjectByName('a-char');
    if (hero) {
        hero.position.copy(hero.userData.originalPos)
        hero.rotation.copy(hero.userData.originalRot)
        hero.scale.copy(hero.userData.originalScale)
        hero.visible = true;
    }
}
// End of disassembly logic

export function reassembleScene(scene) {
    startIntegrityCheckLoop(scene);
    scene.world.isActive = true;
    assembleScene(scene, 1500, true);
}


export async function revertAssembleRoom(scene, duration = 500) {
    scene.globalUniformsHub.enableLightning.value = false
    stopIntegrityCheckLoop(scene)

    // Reset CV Panel in case it was "fallen" (Synced with points triggerStep duration)
    if (window.cvReset) window.cvReset(1500);

    //disable physic
    revertPhysics(scene);

    // 0. Dynamic Spawns: Clean up temporary objects (Bitcoins, etc.)
    // SNAP-RESET for performance (User request: no cinematic exit to save frame-rate)
    purgeAllCoins(scene);

    // Determine objects to hide
    const excludes = [];

    // 1. Scene Children - Optimized search (Only hide objects with defined hide positions)
    scene.children.forEach(obj => {
        if (!obj.userData.hidePos) return; // Skip non-interactive/static objects to save CPU
        if (excludes.includes(obj)) return;

        sendObjectToHide(obj, duration);
    });

    // 2. Room GLB Children (The main room content)
    const roomModel = scene.getObjectByName('roomGLBModel');
    if (roomModel) {
        roomModel.children.forEach(obj => {
            // Force hide regardless of hidePos for room parts
            sendObjectToHide(obj, duration);
        });

        // Hide the model group itself
        new TWEEN.Tween(roomModel.scale)
            .to({ x: 0, y: 0, z: 0 }, duration)
            .easing(TWEEN.Easing.Cubic.In)
            .onComplete(() => { roomModel.visible = false; })
            .start();
    }

    // 3. Camera Repositioning (Return to Points perspective)
    if (scene.camera && scene.orbitControls) {
        // Points Baseline Camera (from points.js constants)
        const targetPos = { x: 61.56, y: 2.97, z: 30 };
        const targetLookAt = new THREE.Vector3(0, 0, 0);

        new TWEEN.Tween(scene.camera.position)
            .to(targetPos, duration * 3) // Slower return for smoothness
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(() => {
                scene.camera.lookAt(targetLookAt);
                scene.orbitControls.target.copy(targetLookAt);
            })
            .start();

        // Reset controls target
        new TWEEN.Tween(scene.orbitControls.target)
            .to({ x: 0, y: 0, z: 0 }, duration * 3)
            .easing(TWEEN.Easing.Cubic.Out)
            .start();
    }

    const kamikazeTween = new TWEEN.Tween(scene.fireflies.material.uniforms.uKamikazeScale)
        .to({ value: 1 }, duration)
        .easing(TWEEN.Easing.Cubic.In)
    // .start();

    new TWEEN.Tween(scene.fireflies.material.uniforms.uSizeFactor)
        .to({ value: 0 }, duration)
        .easing(TWEEN.Easing.Cubic.In)
        .chain(kamikazeTween)
        .onComplete(flashBloom)
        .start();

    function flashBloom() {
        const BLOOM_UP_DURATION = 400; // Slightly slower for better perception
        const BLOOM_DOWN_DURATION = 800;
        const PEAK_STRENGTH = 12; // SAFE PEAK (Lowered from 30)
        const DEFAULT_STRENGTH = 1.5;

        const bloomDown = new TWEEN.Tween(scene.points.bloomPass)
            .to({ strength: DEFAULT_STRENGTH, threshold: 0.85, radius: 0.4 }, BLOOM_DOWN_DURATION)
            .easing(TWEEN.Easing.Quadratic.Out);

        const bloomUp = new TWEEN.Tween(scene.points.bloomPass)
            .to({ strength: PEAK_STRENGTH, threshold: 0, radius: 1 }, BLOOM_UP_DURATION)
            .easing(TWEEN.Easing.Quadratic.In)
            .onComplete(() => {
                // Peak State Switch: Reset Scenario and Buffers
                resetRoomState(scene);
                setScenarioState(scene, 0);
                scene.isTransitioning = false; // [LAG FIX] Must reset flag for shadowmap/renderer updates

                // Reveal Points immediately
                if (scene.pointsApp) {
                    scene.pointsApp.points.visible = true;

                    // 1. Re-enable the scroll-hijack
                    if (typeof scene.pointsApp.setScrollLock === 'function') {
                        scene.pointsApp.setScrollLock(true);
                    }

                    // 2. Reset 3D State (Step 1 = Root)
                    if (typeof scene.pointsApp.triggerStep === 'function') {
                        scene.pointsApp.triggerStep(1, 1500, true);
                    }

                    // 3. Navigation State managed by triggerStep(1) above.

                    // 4. Reverse Garden State (Flower -> Grok)
                    if (typeof scene.HUD.tweenGardenMode === 'function') {
                        scene.HUD.tweenGardenMode(false, 1500);
                    }

                    // 5. Restore Grok Visibility (Show Decos)
                    if (typeof scene.HUD.runTweenShowDecos === 'function') {
                        scene.HUD.runTweenShowDecos(1500);
                    }
                }

                // Reset Board UI Element specifically
                const board = document.getElementById('board');
                if (board) {
                    board.style.display = ''; // Ensure visible
                    board.classList.remove('mode-room');
                    if (window.fitBoardTexts) {
                        window.__boardScale = 1.0;
                        window.__boardSubProgress = 0.0;
                        window.fitBoardTexts(1.0, 0.0);
                    }
                }

                // Update 'Active' nav button to ABOUT (Top Nav)
                // Use a more specific selector to avoid unintended matches
                const navItems = document.querySelectorAll('.nav-modules .nav-item');
                navItems.forEach(btn => btn.classList.remove('active'));
                const aboutBtn = Array.from(navItems).find(btn => btn.getAttribute('data-target') === 'cv-header');
                if (aboutBtn) aboutBtn.classList.add('active');

                // FADE BLOOM DOWN slowly
                new TWEEN.Tween(scene.points.bloomPass)
                    .to({ strength: 1.5, threshold: 0.85, radius: 0.5 }, 1200)
                    .easing(TWEEN.Easing.Cubic.Out)
                    .onComplete(() => {
                        scene.isTransitioning = false;
                        if (scene.points && scene.points.bloomPass) {
                            scene.points.bloomPass.threshold = 0.85; // Hard snap for Points
                            scene.points.bloomPass.strength = 1.5;
                        }

                    })
                    .start();
            })
            .start();
    }


}

function sendObjectToHide(obj, duration, onComplete) {
    if (obj.userData.hidePos) {
        // Random variation for organic feel
        const objDuration = duration + Math.random() * 500;

        new TWEEN.Tween(obj.position)
            .to({
                x: obj.userData.hidePos.x,
                y: obj.userData.hidePos.y,
                z: obj.userData.hidePos.z
            }, objDuration)
            .easing(TWEEN.Easing.Cubic.In)
            .onComplete(() => {
                obj.visible = false;
                if (onComplete) onComplete();
            })
            .start();

        if (obj.userData.hideRot) {
            new TWEEN.Tween(obj.rotation)
                .to({
                    x: obj.userData.hideRot.x,
                    y: obj.userData.hideRot.y,
                    z: obj.userData.hideRot.z
                }, objDuration)
                .easing(TWEEN.Easing.Cubic.In)
                .start();
        }

        if (obj.userData.hideScale) {
            new TWEEN.Tween(obj.scale)
                .to({
                    x: obj.userData.hideScale.x,
                    y: obj.userData.hideScale.y,
                    z: obj.userData.hideScale.z
                }, objDuration)
                .easing(TWEEN.Easing.Cubic.In)
                .start();
        }
    }
}

/**
 * resetRoomState
 * Centralized cleanup of room-specific state variables to ensure 
 * consistent behavior on subsequent transitions.
 */
export function resetRoomState(scene) {
    // 1. Reset Drone & Hammer
    const drone = scene.getObjectByName('drone');
    if (drone && drone.userData.hidePos) {
        drone.position.copy(drone.userData.hidePos);
        drone.visible = false;
    }

    const hammer = scene.getObjectByName('mjolnir_low_mjolnir_hammer_0');
    if (hammer) {
        if (hammer.userData.hidePos) {
            hammer.position.copy(hammer.userData.hidePos);
            hammer.visible = false;
        }
        hammer.isFlying = false; // CRITICAL: Unblock next callMjolnir
    }

    // 2. Clear Dragon Balls (Destroy they can be re-spawned)
    if (scene.dragonBalls) {
        scene.dragonBalls.forEach(ball => {
            if (ball.rapierBody && scene.world && scene.world.physics) {
                scene.world.physics.removeRigidBody(ball.rapierBody);
            }
            if (ball.geometry) ball.geometry.dispose();
            if (ball.material) {
                if (Array.isArray(ball.material)) ball.material.forEach(m => m.dispose());
                else ball.material.dispose();
            }

            // Remove from global arrays
            const lists = [scene.physicObjects, scene.physicsControlledObjects, scene.bhTargets];
            lists.forEach(list => {
                if (list) {
                    const idx = list.indexOf(ball);
                    if (idx !== -1) list.splice(idx, 1);
                }
            });

            if (scene.physicBodies && ball.rapierBody) {
                const bIdx = scene.physicBodies.indexOf(ball.rapierBody);
                if (bIdx !== -1) scene.physicBodies.splice(bIdx, 1);
            }

            if (ball.parent) ball.parent.remove(ball);
        });
        scene.dragonBalls = [];
        if (scene.world) scene.world.ballBodies = [];
    }

    // 3. Reset Lighting & Emissives
    const bulb = scene.getObjectByName('bulb') || scene.bulb;
    if (bulb) {
        bulb.visible = false;
        bulb.traverse(obj => {
            obj.visible = false;
            if (obj.isLight) obj.intensity = 0;
        });
    }

    const bulbLight = scene.getObjectByName('bulbLight') || scene.bulbLight;
    if (bulbLight) {
        bulbLight.intensity = 0.001; // GHOST STATE (Keep shader compiled)
        bulbLight.distance = 0;
        bulbLight.visible = true; // KEEP ACTIVE
    }

    const fanBulb = scene.getObjectByName('Object_120'); // Ceiling fan bulb
    if (fanBulb && fanBulb.material && fanBulb.material.uniforms) {
        const mat = fanBulb.material;
        if (mat.uniforms.glowPower) mat.uniforms.glowPower.value = 0.0;
        if (mat.uniforms.glowIntensity) mat.uniforms.glowIntensity.value = 0.0;
    }

    // 4. Scene Background
    scene.background = null;

    // 5. CLEAR ROOM-EXCLUSIVE UI & EFFECTS (Critical for Points transition)
    // Killing any pending async loops in room scripts
    scene._spawnStopSignal = true;

    // Direct removal of all coins during the flash peak
    snapPurgeCoins(scene);

    // Clear Subtitles
    if (typeof clearSubtitle === 'function') {
        clearSubtitle();
    }

    // Clear Shouts (Persona conversation box)
    if (scene.conversationManager && typeof scene.conversationManager.clear === 'function') {
        scene.conversationManager.clear();
    }
    // [LAG FIX] Replace recursive traverse with shallow scene children cleanup
    // Laser beams and auras are always children of the root objects or the scene itself.
    scene.children.forEach(obj => {
        if (obj && obj.name && (obj.name.toLowerCase().includes('beam') || obj.name.toLowerCase().includes('aura'))) {
            obj.visible = false;
            // Cancel any active animation frame requests for beams
            if (obj.activeRequestID) {
                cancelAnimationFrame(obj.activeRequestID);
                obj.activeRequestID = null;
            }
        }
    });

    // Targeted Character Reset
    const character = scene.getObjectByName('a-char');
    if (character) {
        // Hide lasers that might be nested inside character
        character.traverse(obj => {
            if (obj && obj.name && (obj.name.toLowerCase().includes('beam'))) {
                obj.visible = false;
                if (obj.activeRequestID) {
                    cancelAnimationFrame(obj.activeRequestID);
                    obj.activeRequestID = null;
                }
            }
        });
    }

    // 4. LOCK 30Hz: Save CPU for points transition
    scene.targetAnimHz = 30;
}