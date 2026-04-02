import * as THREE from 'three';
import RAPIER from 'rapier-compat';
import TWEEN from 'tween';
import { playOneShotAnimation } from './animationManager.js';
import { updateStory } from './status.js';
import { getDynamicText } from './contentUtils.js';
import { callMjolnir } from '../scenario/scenarioUtility.js';
import { netflixPCMat, typingMat, bloodDotaMat, dotaAcceptMat } from '../resources/adjustObjects.js';
import { activeCoins, alignDragonBalls } from '../resources/spawnBitcoin.js';
import { LEXICON } from '../content-manager/content.js';
import { cvReset } from '../interactions/cvFall.js';
import { createInnerGlowMat, createOuterGlowMat } from './constant.js';
import { GLOBAL_COLORS } from '../configs/sceneConfig.js';

import { watchApex, startKinematicReturn } from './physicsUtils.js';
import { shootDroneBeam, updateDroneGaze, getObj } from '../scenario/scenarioUtility.js';

const CHECK_INTERVAL = 3000;
const POSITION_THRESHOLD = 2.0;
const ROTATION_THRESHOLD = 0.25;
const STABILITY_THRESHOLD = 0.25; // Higher threshold for room stability

/**
 * Centrally triggers the Blue Screen of Death (BSOD) visual effect.
 * Implements a "Hard Reset" pattern: clears any existing BSOD timeout to ensure
 * the latest trigger (e.g., a click or integrity check) controls the duration.
 * @param {THREE.Scene} scene 
 * @param {number} duration - ms before deactivating
 * @param {string} target - 'pc', 'laptop' or null for BOTH
 */
export function triggerBSOD(scene, duration = 3000, target = null) {
    const hub = scene.globalUniformsHub;
    const cu = scene.constantUniform;
    const targets = [];

    if (target === 'pc') {
        if (hub && hub.uniforms.uPCBSODState) targets.push(hub.uniforms.uPCBSODState);
        else if (cu && cu.uPCBSODState) targets.push(cu.uPCBSODState);
    } else if (target === 'laptop') {
        if (hub && hub.uniforms.uLaptopBSODState) targets.push(hub.uniforms.uLaptopBSODState);
        else if (cu && cu.uLaptopBSODState) targets.push(cu.uLaptopBSODState);
    } else {
        // Global / Both
        if (hub) {
            if (hub.uniforms.uBSODState) targets.push(hub.uniforms.uBSODState);
            if (hub.uniforms.uPCBSODState) targets.push(hub.uniforms.uPCBSODState);
            if (hub.uniforms.uLaptopBSODState) targets.push(hub.uniforms.uLaptopBSODState);
        }
        if (cu) {
            if (cu.uBSODState) targets.push(cu.uBSODState);
            if (cu.uPCBSODState) targets.push(cu.uPCBSODState);
            if (cu.uLaptopBSODState) targets.push(cu.uLaptopBSODState);
        }
    }

    if (targets.length === 0) return;

    // Hard Reset: Cancel any pending deactivation from previous triggers
    if (scene._bsodTimeout) {
        clearTimeout(scene._bsodTimeout);
    }

    // Activate BSOD for all selected targets
    targets.forEach(t => t.value = 1.0);

    // Schedule deactivation
    scene._bsodTimeout = setTimeout(() => {
        targets.forEach(t => t.value = 0.0);
        scene._bsodTimeout = null;
    }, duration);
}

/**
 * Centrally triggers the Booting sequence visual effect.
 * Forces the typingMat into booting mode (uBootState = 0) for a duration, then restores.
 */
export function triggerBootingSequence(scene, duration = 3000) {
    if (!typingMat || !typingMat.uniforms.uBootState) return;

    // Hard Reset existing boot timeout
    if (scene._bootingTimeout) {
        clearTimeout(scene._bootingTimeout);
    }

    // Set to Booting State (0.0)
    typingMat.uniforms.uBootState.value = 0.0;

    // Schedule restoration to Working State (1.0)
    scene._bootingTimeout = setTimeout(() => {
        typingMat.uniforms.uBootState.value = 1.0;
        scene._bootingTimeout = null;
    }, duration);
}

/**
 * Captures the initial 'correct' position and rotation of all physics bodies
 * to serve as a baseline for future integrity checks.
 * Should be called once after the scene is fully settled.
 */
export function setupIntegrityBaseline(scene) {
    if (!scene.physicBodies || scene.physicBodies.length === 0) {
        setTimeout(() => setupIntegrityBaseline(scene), 1000);
        return;
    }

    // GUARD: Do not capture baseline if chaos is active (wait for user to let go)
    if (scene.world?.hasPointGravityOnBH || window._cvState === 'sucking') {
        setTimeout(() => setupIntegrityBaseline(scene), 1000);
        return;
    }

    // console.log("[Integrity] Capturing baseline for physics bodies...");
    let count = 0;
    scene.physicBodies.forEach(body => {
        if (!body.isIntegrityCheckTarget && !body.isIntegrityResetTarget) return;

        let pos, rot;
        if (body.threeObject && body.threeObject.userData && body.threeObject.userData.originalPos) {
            const op = body.threeObject.userData.originalPos;
            const or = body.threeObject.userData.originalRot;
            pos = new THREE.Vector3(op.x, op.y, op.z);
            if (or && or.isEuler) {
                rot = new THREE.Quaternion().setFromEuler(or);
            } else if (body.threeObject.userData.originalQuaternion) {
                const oq = body.threeObject.userData.originalQuaternion;
                rot = new THREE.Quaternion(oq.x, oq.y, oq.z, oq.w);
            } else {
                const r = body.rotation();
                rot = new THREE.Quaternion(r.x, r.y, r.z, r.w);
            }
        } else {
            const t = body.translation();
            const r = body.rotation();
            pos = new THREE.Vector3(t.x, t.y, t.z);
            rot = new THREE.Quaternion(r.x, r.y, r.z, r.w);
        }

        body.integrity = { position: pos, quaternion: rot };
        count++;
    });

    scene.allowsResetting = true;
    scene.integrityBaselineCaptured = true;
    // console.log(`[Integrity] Baseline Locked: ${count} bodies monitored.`);
}

// --- Grid Reset Tracking ---
export const triggerGridFlash = (scene, sustain = false) => {
    if (scene._activeResetCount === undefined) scene._activeResetCount = 0;
    if (scene.globalUniformsHub && scene.cyanPulseActive) {
        const uniforms = scene.globalUniformsHub.uniforms;
        const cyanFlag = scene.cyanPulseActive;

        if (sustain) {
            // Keep it on
            cyanFlag.value = 1.0;
            uniforms.uWorldGridProgress.value = 1.0;
        } else {
            // Only flash/reset if no one else is sustaining
            if (scene._activeResetCount <= 0) {
                new TWEEN.Tween(uniforms.uWorldGridProgress)
                    .to({ value: 0.0 }, 150)
                    .onComplete(() => {
                        cyanFlag.value = 0.0;
                    })
                    .start();
            }
        }
    }
};


/**
 * Resets a single physics body to its baseline integrity state.
 * Uses a tween to smoothly move the object back.
 * ACTIVATES GHOST MODE (Sensor=true) to prevent collisions during return.
 * @param {THREE.Scene} scene - The main scene (for global flags).
 * @param {RAPIER.RigidBody} body - The body to reset.
 * @param {number} duration - Duration of the reset animation in ms.
 */


function resetBodyToIntegrity(scene, body, targetEndTime, baseStrength = 0) {
    if (body.isResetting) return;

    // 🛡️ SAFETY GUARD: Defer if physics world is currently locked
    if (scene.world && scene.world.isBusy) {
        setTimeout(() => resetBodyToIntegrity(scene, body, targetEndTime, baseStrength), 16);
        return;
    }

    body.isResetting = true;

    if (!body.integrity) {
        body.isResetting = false;
        return;
    }

    // ACTIVATE GHOST MODE: Prevent collisions during reset flight
    // Defensive Check: Ensure the body hasn't been destroyed in WASM by scene transitions
    try {
        if (body.rapierCollider) body.rapierCollider.setSensor(true);
    } catch (e) {
        // Body or collider was likely freed by disassembleRoom
        body.isResetting = false;
        return;
    }

    const targetPos = body.integrity.position.clone();
    const targetQuat = body.integrity.quaternion;

    let originalBodyType;
    try {
        originalBodyType = body.bodyType();
    } catch (e) {
        body.isResetting = false;
        return;
    }

    // TRIGGER START FLASH (Sustained)
    scene._activeResetCount = (scene._activeResetCount || 0) + 1;
    triggerGridFlash(scene, true);


    // STEP 1: POP-UP IMPULSE
    const mass = body.mass();
    const impulseStrength = (Math.random() * 8.0 + 2.) * mass;
    body.applyImpulse({ x: 0, y: baseStrength + impulseStrength, z: 0 }, true);

    const torqueAmount = (baseStrength + 2.0) * mass * 0.2;
    body.applyTorqueImpulse({
        x: (Math.random() - 0.5) * torqueAmount,
        y: (Math.random() - 0.5) * torqueAmount,
        z: (Math.random() - 0.5) * torqueAmount
    }, true);

    body.wakeUp();

    // STEP 2: WAIT FOR APEX & RETURN
    watchApex(body, () => {
        const beamName = `integrity-beam-${body.handle}`;
        const isDragonBall = body.threeObject && body.threeObject.userData.isDragonBall;
        const beamColor = isDragonBall ? 0xffcc00 : (GLOBAL_COLORS.ELECTRIC_CYAN || 0x00ffff);

        // Trigger Drone Beam on apex catch
        let activeBeam = null;
        if (shootDroneBeam) {
            const currentBodyPos = body.translation();
            // shootDroneBeam returns void, but we find it once and cache it
            shootDroneBeam(scene, "", "", new THREE.Vector3(currentBodyPos.x, currentBodyPos.y, currentBodyPos.z), beamName, true, beamColor, true, Infinity, true);
            activeBeam = scene.getObjectByName(beamName);
        }

        // Cache Hero Position for Avoidance (Prioritize Spine for torso center)
        const heroRef = scene.getObjectByName('mixamorigSpine1') || scene.getObjectByName('a-char');
        const avoidancePos = heroRef ? new THREE.Vector3().setFromMatrixPosition(heroRef.matrixWorld) : null;

        startKinematicReturn(body, targetPos, targetQuat, targetEndTime, originalBodyType, () => {
            // onComplete: hide beam
            if (activeBeam) {
                activeBeam.visible = false;
                if (activeBeam.activeRequestID) cancelAnimationFrame(activeBeam.activeRequestID);
            }

            body.isResetting = false;
            // TRIGGER END (Release sustain)
            scene._activeResetCount--;
            triggerGridFlash(scene, false);
        }, (currentPoint, t) => {
            // onUpdate: update beam (PERFORMANCE: use cached activeBeam and drone components)
            if (activeBeam && activeBeam.visible) {
                const drone = getObj(scene, 'drone');
                if (drone) {
                    const eye = drone.getObjectByName('Sphere001_0'); // Nesting is O(small) but drone should be O(1)
                    if (eye) {
                        const startPos = new THREE.Vector3();
                        eye.getWorldPosition(startPos);
                        const dist = startPos.distanceTo(currentPoint);
                        activeBeam.position.copy(startPos);
                        activeBeam.lookAt(currentPoint);
                        activeBeam.children.forEach(child => {
                            child.scale.z = dist;
                        });
                    }
                }
            }
        }, avoidancePos);
    });
}

/**
 * Starts the periodic integrity check loop.
 * Detects misplaced objects (distance/rotation threshold).
 * If mess is found: Updates Story -> Plays 'Bang Desk' -> Resets ALL objects via Ghost Mode.
 */
export function startIntegrityCheckLoop(scene) {
    scene.allowsIntegrityCheck = true;
    if (!scene.allowsIntegrityCheck) return;
    // Guard: ensure mixer available
    // (AnimationManager handles missing mixer gracefully but acts as a fallback)

    let checkTimer;

    const scheduleNextCheck = () => {
        clearTimeout(checkTimer);
        checkTimer = setTimeout(runIntegrityCheck, CHECK_INTERVAL);
    };

    const runIntegrityCheck = () => {
        // 1. Scene Guard
        if (!scene.scenarioState || scene.scenarioState.name !== 'room') {
            scheduleNextCheck();
            return;
        }

        // 2. Baseline Guard
        if (!scene.integrityBaselineCaptured) {
            // console.log("[Integrity] Skipping: Baseline not yet locked.");
            scheduleNextCheck();
            return;
        }

        // 3. TOP PRIORITY: Only pause if user is actively SUCKING with Blackhole
        // or if the HERO is currently animating (Dancing).
        // Once released, we trigger the reset immediately.
        if (scene.world?.hasPointGravityOnBH || scene.isHeroAnimating) {
            scheduleNextCheck();
            return;
        }

        // 4. Concurrency Guard (Prevent double-firing)
        if (scene.allowsResetting === false) {
            scheduleNextCheck();
            return; // Wait for the current reset animation to finish
        }

        // console.log("[Integrity] Analyzing room harmony...");

        let misplacedBodies = [];

        scene.physicBodies.forEach(body => {
            // DETECT MESS: Only monitor Check Targets
            if (!body.isIntegrityCheckTarget || !body.integrity || scene.isHeroAnimating) return;
            if (body.isResetting || body.isManualControl) return; // Skip if processing or manually controlled

            const threeObject = body.threeObject;
            const name = threeObject ? threeObject.name : "Unknown Body";

            const currentTrans = body.translation();
            const currentRot = body.rotation();
            const currentPos = new THREE.Vector3(currentTrans.x, currentTrans.y, currentTrans.z);
            const currentQuat = new THREE.Quaternion(currentRot.x, currentRot.y, currentRot.z, currentRot.w);

            const originalPos = body.integrity.position;
            const distance = currentPos.distanceTo(originalPos);

            let needsReset = false;

            if (distance > POSITION_THRESHOLD) {
                needsReset = true;
            } else {
                const originalQuat = body.integrity.quaternion;
                const angle = currentQuat.angleTo(originalQuat);

                if (angle > ROTATION_THRESHOLD) {
                    needsReset = true;
                }
            }

            if (needsReset) {
                misplacedBodies.push(body);
            }
        });

        // --- NEW: CHECK IF WATCHING NETFLIX OR DOTA (NOT WORKING) ---
        let isNotWorking = false;
        let workStatusMessage = "";

        // Detect Booting State as "Not Working" to trigger the fix
        if (typingMat.uniforms.uBootState && typingMat.uniforms.uBootState.value < 0.5) {
            isNotWorking = true;
            workStatusMessage = getDynamicText("SYS_STORY_INTEGRITY_BOOTING");
        }

        if (scene.objectMap) {
            const screens = [
                { obj: scene.objectMap.get("screenDisplay001"), name: "Main Screen" },
                { obj: scene.objectMap.get("verticalMonitorDisplay"), name: "Vertical Screen" }
            ];

            screens.forEach(s => {
                if (s.obj && s.obj.material !== typingMat) {
                    isNotWorking = true;
                    if (s.obj.material === netflixPCMat) {
                        workStatusMessage = getDynamicText("SYS_STORY_INTEGRITY_NETFLIX");
                    } else if (s.obj.material === bloodDotaMat || s.obj.material === dotaAcceptMat) {
                        workStatusMessage = getDynamicText("SYS_STORY_INTEGRITY_DOTA");
                    } else {
                        workStatusMessage = getDynamicText("SYS_STORY_INTEGRITY_WORK_FOCUS");
                    }
                }
            });
        }

        // --- ANIMATION INTERACTION ---
        if (misplacedBodies.length > 0 || isNotWorking) {
            scene.allowsResetting = false; // Flag start of sequence
            scene.isHeroAnimating = true; // --- LOCK INTERACTIONS ---

            // Log names of misplaced objects removed
            if (misplacedBodies.length > 0) {
                const names = misplacedBodies.map(body => body.threeObject ? body.threeObject.name : "Unknown Body");
                // console.log(`%c [Integrity] Reset triggered by: ${names.join(", ")}`, "color: #ffaa00; font-weight: bold;");
            }

            // Dramatic Story Update
            if (isNotWorking && misplacedBodies.length === 0) {
                updateStory(workStatusMessage);
            } else if (misplacedBodies.length < 3) {
                updateStory(getDynamicText("SYS_STORY_INTEGRITY_MESS_LIGHT"));
            } else {
                updateStory(getDynamicText("SYS_STORY_INTEGRITY_MESS_HEAVY"));
            }

            // --- SHOUT TRIGGER ---
            if (scene.conversationManager) {
                if (isNotWorking) {
                    if (scene.objectMap) {
                        const screen = scene.objectMap.get("screenDisplay001");
                        if (screen && screen.material === netflixPCMat) {
                            scene.conversationManager.shout(LEXICON.SHOUT_RESET_NETFLIX.en);
                        } else if (screen && (screen.material === bloodDotaMat || screen.material === dotaAcceptMat)) {
                            scene.conversationManager.shout(LEXICON.SHOUT_RESET_DOTA.en);
                        } else {
                            scene.conversationManager.shout(LEXICON.SHOUT_RESET_GENERIC.en);
                        }
                    }
                } else if (misplacedBodies.length > 0) {
                    scene.conversationManager.shout(LEXICON.SHOUT_RESET_MESS.en);
                }
            }

            // If it was only Netflix/Dota, we still want a decent anger speed
            const effectiveMessCount = isNotWorking ? Math.max(misplacedBodies.length, 2) : misplacedBodies.length;

            // Calculate Speed: Rational Interpolation
            let angerSpeed = Math.min(1 + (effectiveMessCount - 1) * 0.5, 4.0);

            // Calculate reset Duration
            let resetDuration = Math.min(800 + (effectiveMessCount * 200), 2000);

            // Base strength scales with "anger"
            const l = effectiveMessCount / 1.25;
            const baseStrength = Math.max(l * l, 2) * 2.5; // Boosted pop strength

            // Play Animation first
            const animInfo = playOneShotAnimation(scene, "bangingFist", {
                speed: angerSpeed,
                randomize: false, // We want deterministic anger
                onComplete: () => {
                    // Sequence finished
                }
            });

            // --- DECOUPLED CLEANUP (ROOT CAUSE FIX) ---
            // We use a fixed timer based on the animation's actual duration 
            // instead of relying on onComplete, so interruptions don't leak the lock.
            const totalActionTime = (animInfo.duration * 1000);
            setTimeout(() => {
                scene.allowsResetting = true;
                scene.isHeroAnimating = false;
                scheduleNextCheck();
            }, totalActionTime + 100);

            // TRIGGER RESET at 40% of Animation
            if (animInfo && animInfo.duration) {
                const triggerTime = (animInfo.duration * 1000) * 0.4;

                setTimeout(() => {

                    // Activate shockwave
                    triggerShockwave(scene);

                    // --- NEW: EARTHQUAKE EFFECT ---
                    triggerCameraShake(scene, baseStrength * 0.2); // Substantial impact!

                    cvReset(resetDuration);

                    if (typeof window.cvJump === 'function') {
                        // The duration logic perfectly fits inline here
                        window.cvJump(200);
                    }

                    // --- FORCE PC BACK TO WORK ---
                    if (scene.objectMap) {
                        const monitorNames = ["screenDisplay001", "screenDisplay002", "verticalMonitorDisplay"];
                        monitorNames.forEach(name => {
                            const screen = scene.objectMap.get(name);
                            if (screen) {
                                screen.material = typingMat;
                                screen.userData.originalMaterial = typingMat;
                            }
                        });

                        // Switch typingMat to WORKING state
                        if (typingMat.uniforms.uBootState) {
                            typingMat.uniforms.uBootState.value = 1.0;
                        }
                    }
                    // Reset ALL valid items (Plan 1)
                    updateStory(getDynamicText("SYS_STORY_INTEGRITY_RESTORING"));

                    // Calculate shared end time: Ensure buffer for the longest flight
                    const targetEndTime = performance.now() + resetDuration + 200;

                    scene.physicBodies.forEach(body => {
                        // RESTORE ORDER: Reset All Reset Targets (if baseline exists)
                        // Defensive Check: Ensure the body is still valid in the Rapier world
                        try {
                            if (body.isIntegrityResetTarget && body.integrity && typeof body.handle !== 'undefined') {
                                resetBodyToIntegrity(scene, body, targetEndTime, baseStrength);
                            }
                        } catch (e) {
                            // Object already deleted from world
                        }
                    });
                    // --- Dragon Ball Circle Reset around White Cat (Object_108) ---
                    alignDragonBalls(scene);

                    // --- Coin Circle Reset around Cats ---
                    if (activeCoins && activeCoins.length > 0) {
                        const cats = ["Object_12001", "Object_108"];
                        const chosenCatName = cats[Math.floor(Math.random() * cats.length)];
                        const chosenCat = scene.getObjectByName(chosenCatName);

                        if (chosenCat) {
                            const cp = new THREE.Vector3();
                            chosenCat.getWorldPosition(cp);

                            const radius = 1.265 + Math.random() * 0.46; // Increased by 15%

                            activeCoins.forEach((coin, index) => {
                                // Only reset if visible and potentially misplaced
                                if (!coin.visible) return;

                                const angle = (index / activeCoins.length) * Math.PI * 2;
                                const tx = cp.x + Math.cos(angle) * radius;
                                const ty = cp.y + 0.05;
                                const tz = cp.z + Math.sin(angle) * radius;

                                const body = coin.rapierBody;
                                if (body) {
                                    if (body.rapierCollider) body.rapierCollider.setSensor(true);

                                    // STEP 1: POP-UP IMPULSE
                                    const mass = body.mass();
                                    const impulseStrength = (Math.random() * baseStrength) * mass;
                                    body.applyImpulse({ x: 0, y: baseStrength + impulseStrength, z: 0 }, true);

                                    const torqueAmount = baseStrength * mass * 0.5;
                                    body.applyTorqueImpulse({
                                        x: (Math.random() - 0.5) * torqueAmount,
                                        y: (Math.random() - 0.5) * torqueAmount,
                                        z: (Math.random() - 0.5) * torqueAmount
                                    }, true);

                                    body.wakeUp();

                                    // Watch for apex then return to cat circle
                                    watchApex(body, () => {
                                        const targetPos = new THREE.Vector3(tx, ty, tz);
                                        const targetQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.random() * Math.PI, 0));

                                        const beamName = `coin-integrity-beam-${body.handle}`;
                                        const cyanColor = GLOBAL_COLORS.ELECTRIC_CYAN || 0x00ffff;

                                        // TRIGGER START (Sustained)
                                        scene._activeResetCount = (scene._activeResetCount || 0) + 1;
                                        triggerGridFlash(scene, true);

                                        // Trigger Drone Beam on apex catch
                                        let activeBeam = null;
                                        if (shootDroneBeam) {
                                            const currentBodyPos = body.translation();
                                            shootDroneBeam(scene, "", "", new THREE.Vector3(currentBodyPos.x, currentBodyPos.y, currentBodyPos.z), beamName, true, cyanColor, true, Infinity, true);
                                            activeBeam = scene.getObjectByName(beamName);
                                        }

                                        // Cache Hero Position for Avoidance (Prioritize Spine for torso center)
                                        const heroRef = scene.getObjectByName('mixamorigSpine1') || scene.getObjectByName('a-char');
                                        const avoidancePos = heroRef ? new THREE.Vector3().setFromMatrixPosition(heroRef.matrixWorld) : null;

                                        startKinematicReturn(body, targetPos, targetQuat, targetEndTime, RAPIER.RigidBodyType.Dynamic, () => {
                                            // onComplete: hide beam
                                            if (activeBeam) {
                                                activeBeam.visible = false;
                                                if (activeBeam.activeRequestID) cancelAnimationFrame(activeBeam.activeRequestID);
                                            }

                                            // TRIGGER END (Release sustain)
                                            scene._activeResetCount--;
                                            triggerGridFlash(scene, false);

                                        }, (currentPoint, t) => {
                                            // onUpdate: update beam (PERFORMANCE: use cached references)
                                            if (activeBeam && activeBeam.visible) {
                                                const drone = getObj(scene, 'drone');
                                                if (drone) {
                                                    const eye = drone.getObjectByName('Sphere001_0');
                                                    if (eye) {
                                                        const startPos = new THREE.Vector3();
                                                        eye.getWorldPosition(startPos);
                                                        const dist = startPos.distanceTo(currentPoint);
                                                        activeBeam.position.copy(startPos);
                                                        activeBeam.lookAt(currentPoint);
                                                        activeBeam.children.forEach(child => {
                                                            child.scale.z = dist;
                                                        });
                                                    }
                                                }
                                            }
                                        }, avoidancePos);
                                    });
                                }
                            });
                        }
                    }
                }, triggerTime);
            }
        } else {
            // No mess found, just schedule next check
            scheduleNextCheck();
        }
    };

    // User Interaction Reset
    // Whenever user clicks in DOM, reset the countdown
    window.addEventListener('pointerdown', () => {
        // console.log("User active: Resetting Integrity Timer");
        scheduleNextCheck();
    });

    // Start the loop
    scheduleNextCheck();
}

export function stopIntegrityCheckLoop(scene) {
    scene.allowsIntegrityCheck = false;
}

// Helper to trigger majestic shockwave (shard explosion + volumetric rings)
export function triggerShockwave(scene) {
    const group = new THREE.Group();
    const shockColor = new THREE.Color('#ffc783'); // Deep Orange like Dragon Balls
    const goldColor = GLOBAL_COLORS.ACCENT_GOLD || new THREE.Color('#ffcc00');
    const whiteHotColor = new THREE.Color('#ffffff'); // White Hot core

    // Position group at shockwavePlane world position
    group.position.set(-1.95, 2.64, -1.35)

    scene.add(group);

    // 1. VOLUMETRIC RINGS (Shockwaves) - Thinned for energetic ripple feel
    const ringGeom = new THREE.TorusGeometry(1, 0.04, 16, 100);

    const ringRedMat = createOuterGlowMat(shockColor, 1.5, 0.01, 4.0);
    const ringRed = new THREE.Mesh(ringGeom, ringRedMat);
    ringRed.rotation.x = Math.PI / 2;

    const ringGoldMat = createOuterGlowMat(goldColor, 1.2, 0.01, 4.5);
    const ringGold = new THREE.Mesh(ringGeom, ringGoldMat);
    ringGold.rotation.x = Math.PI / 2;
    // Slight brutalist tilt
    ringGold.rotation.z = 0.2;

    group.add(ringRed, ringGold);

    // 2. CRYSTALLINE SHARDS (Performance optimized count)
    const shardGeom = new THREE.IcosahedronGeometry(0.1, 0);
    const shardCount = 24; // Normalized impact vs performance
    const shards = [];

    for (let i = 0; i < shardCount; i++) {
        const shardCol = i % 2 === 0 ? shockColor : goldColor;
        // Brighter Core (Inner Glow)
        const shardMat = createInnerGlowMat(shardCol, 1.5, 4.0);
        const shard = new THREE.Mesh(shardGeom, shardMat);

        // Enhanced Aura (Outer Glow like Dragon Balls)
        const auraMat = createOuterGlowMat(shardCol, 1.5, 0.01, 4.5);
        const aura = new THREE.Mesh(shardGeom, auraMat);
        aura.scale.setScalar(1.4); // Slightly larger aura
        shard.add(aura);

        // Scattered Velocity (Room-wide trajectory)
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI * 0.6; // Wider upward arc
        const speed = 0.05 + Math.random() * 0.15;

        shard.userData.velocity = new THREE.Vector3(
            Math.sin(theta) * Math.cos(phi) * speed,
            Math.cos(theta) * speed,
            Math.sin(theta) * Math.sin(phi) * speed
        );
        shard.userData.rotationSpeed = new THREE.Vector3(
            Math.random() * 0.15,
            Math.random() * 0.15,
            Math.random() * 0.15
        );

        group.add(shard);
        shards.push(shard);
    }

    // 3. CENTRAL FLASH
    const flashGeom = new THREE.SphereGeometry(0.2, 8, 8);
    const flashMat = createInnerGlowMat(shockColor, 1.0, 5.0); // Brighter flash
    const flash = new THREE.Mesh(flashGeom, flashMat);
    group.add(flash);

    // ANIMATION SUSTAINED FOR MAJESTIC LIFESPAN
    new TWEEN.Tween({ progress: 0 })
        .to({ progress: 1 }, 3500) // Longer lifespan (3.5s)
        .easing(TWEEN.Easing.Exponential.Out)
        .onUpdate((obj) => {
            const p = obj.progress;

            // Shards Flight with Deceleration
            shards.forEach(shard => {
                shard.position.add(shard.userData.velocity);
                shard.userData.velocity.multiplyScalar(0.98); // Add friction

                shard.rotation.x += shard.userData.rotationSpeed.x;
                shard.rotation.y += shard.userData.rotationSpeed.y;
                shard.rotation.z += shard.userData.rotationSpeed.z;

                const scaleP = 1.0 - p;
                shard.scale.setScalar(scaleP);

                if (shard.material.uniforms) {
                    shard.material.uniforms.glowIntensity.value = 4.0 * scaleP;
                }
                const aura = shard.children[0];
                if (aura && aura.material.uniforms) {
                    aura.material.uniforms.outerGlowStrength.value = 1.5 * scaleP;
                }
            });

            // Majestic Expansion
            ringRed.scale.setScalar(0.1 + p * 15.0); // Larger pulse
            ringRed.material.uniforms.outerGlowStrength.value = 1.5 * (1.0 - p);

            ringGold.scale.setScalar(0.05 + p * 10.0);
            ringGold.material.uniforms.outerGlowStrength.value = 1.2 * (1.0 - p);

            // Flash Core
            flash.scale.setScalar(2.0 * (1.0 - p * 1.5));
            if (flash.material.uniforms) {
                flash.material.uniforms.glowIntensity.value = 5.0 * (1.0 - p * 2.0);
            }
        })
        .onComplete(() => {
            scene.remove(group);
            // DISPOSE
            ringGeom.dispose();
            shardGeom.dispose();
            flashGeom.dispose();
            shards.forEach(s => {
                s.material.dispose();
                if (s.children[0]) s.children[0].material.dispose();
            });
            ringRedMat.dispose();
            ringGoldMat.dispose();
            flashMat.dispose();
        })
        .start();
}

/**
 * Centrally triggers a camera shake (earthquake) effect.
 * Uses a series of rapid mini-tweens to create a realistic physical impact.
 * @param {THREE.Scene} scene 
 * @param {number} intensity - The displacement distance
 * @param {number} duration - The total lifespan of the shake
 */
export function triggerCameraShake(scene, intensity = 0.15, duration = 600) {
    const camera = scene.camera;
    if (!camera) return;

    // Use a persistent offset to avoid stomping on other position changes
    if (!camera._shakeOffset) {
        camera._shakeOffset = new THREE.Vector3();
    }

    new TWEEN.Tween({ t: 0 })
        .to({ t: 1 }, duration)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate((obj) => {
            const p = 1.0 - obj.t; // Decay factor
            const currentIntensity = intensity * p;

            // 1. Remove previous offset to restore "true" baseline position
            camera.position.sub(camera._shakeOffset);

            // 2. Generate new high-frequency jitter
            camera._shakeOffset.set(
                (Math.random() - 0.5) * currentIntensity,
                (Math.random() - 0.5) * currentIntensity,
                (Math.random() - 0.5) * currentIntensity
            );

            // 3. Re-apply new offset
            camera.position.add(camera._shakeOffset);
        })
        .onComplete(() => {
            // Precise cleanup: remove the last offset and zero it out
            camera.position.sub(camera._shakeOffset);
            camera._shakeOffset.set(0, 0, 0);
        })
        .start();
}
