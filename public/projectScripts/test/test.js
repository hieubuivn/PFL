import * as THREE from 'three';
import TWEEN from 'tween';
import RAPIER from 'rapier-compat';
import { updateStory } from '../utils/status.js';
import { fetchTop10Cryptos } from '../utils/fetchCryptoData.js';
import { getCountryAndBooks } from '../utils/fetchBooks.js';
import { playOneShotAnimation } from '../utils/animationManager.js';
import * as SU from '../scenario/scenarioUtility.js';

// --- ACT 1: PAUSE & RESET ---
function handleAct1(scene, clock, exceptions) {
    const button = document.getElementById('act-button');
    if (!button) return;

    button.addEventListener('click', () => {
        console.log("ACT 1: PAUSE & RESET");

        if (scene.physicObjects && scene.physicObjects.length > 0) {
            scene.physicObjects.forEach(obj => {
                // Check Exceptions (by Name)
                if (exceptions.includes(obj.name)) return;

                const body = obj.rapierBody;
                if (!body) return;

                // Revert to original State if available
                if (obj.userData.originalPos && obj.userData.originalRot) {

                    // Capture Original Type
                    const originalBodyType = body.bodyType();

                    // Optimization: Fixed bodies don't need resetting
                    if (originalBodyType === RAPIER.RigidBodyType.Fixed) return;

                    // 1. Switch to Kinematic for controlled movement
                    body.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased);

                    // 2. Prepare Tween Data
                    const startPos = obj.position.clone();
                    const startQuat = obj.quaternion.clone();

                    const targetPos = obj.userData.originalPos;
                    const targetEuler = obj.userData.originalRot;
                    const targetQuat = new THREE.Quaternion().setFromEuler(targetEuler);

                    const progress = { val: 0 };

                    new TWEEN.Tween(progress)
                        .to({ val: 1 }, 2000) // 2 seconds duration
                        .easing(TWEEN.Easing.Cubic.InOut)
                        .onUpdate(() => {
                            const world = (scene && scene.world) ? scene.world : null;
                            if (world && world.isBusy) return;

                            // Lerp Position
                            const p = new THREE.Vector3().lerpVectors(startPos, targetPos, progress.val);
                            body.setNextKinematicTranslation(p);

                            // Slerp Rotation
                            const q = startQuat.clone().slerp(targetQuat, progress.val);
                            body.setNextKinematicRotation(q);
                        })
                        .onComplete(() => {
                            // 3. Restore Physics State to Original Type
                            body.setBodyType(originalBodyType);

                            // Kill Momentum (if Applicable)
                            if (originalBodyType === RAPIER.RigidBodyType.Dynamic) {
                                body.setLinvel({ x: 0, y: 0, z: 0 }, true);
                                body.setAngvel({ x: 0, y: 0, z: 0 }, true);
                            }

                            body.wakeUp();
                        })
                        .start();
                }
            });
            updateStory("Resetting Scene (Smooth)...");
        } else {
            console.warn("No scene.physicObjects found to reset.");
        }
    });
}

// --- ACT 2: RESUME & RESCALE ---
function handleAct2(scene, clock) {
    const button2 = document.getElementById('act-button-2');
    if (!button2) return;

    button2.addEventListener('click', async () => {
        console.log("ACT 2: Button Clicked - Play Standup");

        if (scene.mixer && scene.animations) {
            const standupClip = scene.animations.find(clip => clip.name === "standup");
            if (standupClip) {
                // Optional: Stop other actions?
                scene.mixer.stopAllAction();

                const action = scene.mixer.clipAction(standupClip);
                action.reset();
                action.setLoop(THREE.LoopOnce); // Usually standup is once? Or LoopRepeat? Assuming Once for "standup"
                action.clampWhenFinished = true; // Keep final pose
                action.play();

                updateStory("Playing Standup Animation...");
            } else {
                console.warn("Standup clip not found in scene.animations");
            }
        } else {
            console.warn("Mixer or Animations not found on scene");
        }
    });
}

// --- ACT 3: BULB MORPH ---
function handleAct3(scene) {
    const button3 = document.getElementById('act-button-3');
    if (!button3) return;

    button3.addEventListener('click', () => {
        console.log("ACT 3: BULB MORPH");
        const bulb = scene.getObjectByName('bulb');
        const uniform = scene.constantUniform;
        const geo = bulb.geometry;
        const geoAura = scene.getObjectByName('bulb').geometry;
        if (uniform && uniform.uTransformProgress) {
            const currentVal = uniform.uTransformProgress.value;
            const targetVal = currentVal > 0.5 ? 0.0 : 1.0;

            const ease = TWEEN.Easing.Back.InOut;
            let swapped = currentVal > 0.5; // Initial State

            new TWEEN.Tween(uniform.uTransformProgress)
                .to({ value: targetVal }, 1500)
                .easing(ease)
                .onUpdate(() => {
                    // Current progress of the morph (0.0 to 1.0)
                    const p = uniform.uTransformProgress.value;

                    // Calculate sine wave based on progress
                    // Math.sin(p * Math.PI) goes from 0 -> 1 -> 0 as p goes from 0 -> 1
                    const sineWave = Math.sin(p * Math.PI);

                    // Map sine wave (0 to 1) to desired strength range (0.2 to 1.0)
                    // strength = start + (range * sineWave)
                    uniform.uOscillationStrength.value = 0.2 + (0.8 * sineWave);

                    // Check if we crossed the 50% threshold
                    // If we are morphing TO Bitcoin (targetVal=1), we want to swap at > 0.5
                    // If we are morphing TO Bulb (targetVal=0), we want to swap at <= 0.5

                    const shouldBeSwapped = p > 0.5;

                    if (shouldBeSwapped !== swapped) {
                        // console.log(geo)
                        swapped = shouldBeSwapped; // Update state

                        // Perform ONE-TIME swap
                        if (shouldBeSwapped) {
                            geo.setIndex(geo.targetIndex);
                            if (geoAura) geoAura.setIndex(geo.targetIndex);
                            // Wait, user code for Aura: new THREE.Mesh(bulb.geometry, ...).
                            // So they share geometry. We only need to setIndex on 'geo'.

                        } else {
                            geo.setIndex(geo.originalIndex);
                            if (geoAura) geoAura.setIndex(geo.originalIndex);
                            // geoAura shares geometry, no need to setIndex twice if it's the same object reference.
                        }
                    }
                })
                .start();

            updateStory(targetVal === 1.0 ? "Morphing to Bitcoin..." : "Reverting to Bulb...");
        } else {
            console.warn("Bulb or Morph Uniform not found.");
        }
    });
}



// --- ACT 4: TEST ---
function handleAct4(scene) {
    const button4 = document.getElementById('act-button-4');
    if (!button4) return;

    button4.addEventListener('click', () => {
        console.log("TEST 4 CLICKED: Converging Fireflies...");

        if (scene.constantUniform && scene.constantUniform.uMergeProgress) {
            const uMerge = scene.constantUniform.uMergeProgress;

            // Revert or Forward? Let's assume always Forward to 1.0 for now,
            // or toggle if you want back and forth. User said "stop... then fly... and stay there". 
            // So one-way trip to 1.0.

            // Ensure start state
            uMerge.value = 0.0;

            // Continuous Logic:
            // Tween to 1.0 (8s) and stop.
            new TWEEN.Tween(uMerge)
                .to({ value: 1.0 }, 8000)
                .easing(TWEEN.Easing.Linear.None)
                .repeat(0)
                .start();

            updateStory("Fireflies Gathering...");
        } else {
            console.warn("Constant Uniforms not found");
        }
    });
}

function handleKeyboardAnimations(scene) {
    window.addEventListener('keydown', (event) => {
        // Numeric Logic (0-9 keys trigger animations by index)
        const key = parseInt(event.key);
        if (isNaN(key)) return;

        const clipIndex = key;

        if (scene.heroClips && scene.heroClips[clipIndex]) {
            const clip = scene.heroClips[clipIndex];
            playOneShotAnimation(scene, clip.name);
        } else {
            console.warn(`No clip found for key ${key} (Index ${clipIndex})`);
        }
    });
}

import { setScenarioState } from '../scenario/scenarioUtility.js';

// --- ACT 5: POINTS ENVIRONMENT TOGGLE ---
function handleAct5(scene) {
    const button5 = document.getElementById('act-button-5');
    if (!button5) return;

    button5.addEventListener('click', () => {
        console.log("ACT 5: Toggle Points Environment (OFF)");
        setScenarioState(scene, 1);
        updateStory("Returning to Room Environment...");
    });
}

export function initActButton(scene, clock, exceptions = []) {
    handleAct1(scene, clock, exceptions);
    handleAct2(scene, clock);
    handleAct3(scene);
    handleAct4(scene);
    handleAct5(scene);

    handleHeroDance(scene);

    // Test Row 2
    const revBtn = document.getElementById('test-btn-revert');
    const t2Btn = document.getElementById('test-btn-2');
    const t3Btn = document.getElementById('test-btn-3');

    const resBtn = document.getElementById('test-btn-resume');

    if (revBtn) revBtn.addEventListener('click', () => {
        console.log("clicked Revert Room");
        SU.revertAssembleRoom(scene);
    });
    if (t2Btn) t2Btn.addEventListener('click', () => {
        console.log("clicked Reassemble Scene");
        SU.reassembleScene(scene);
    });

    // Active Grid
    if (t3Btn) t3Btn.addEventListener('click', () => {
        console.log("clicked Active Grid (Toggle Visibility)");
        // Find the grid object attached to the camera (name 'camGrid' from addGrid.js)
        // Search in scene.camera.children because addGrid attached it to camera
        let grid = scene.camera.getObjectByName('camGrid');

        // Fallback: Check scene direct children just in case
        if (!grid) grid = scene.getObjectByName('camGrid');

        if (grid) {
            // 1. Show it
            grid.visible = true;
            console.log("Grid Visible: TRUE");

            // 2. Hide after 0.5 seconds
            setTimeout(() => {
                if (grid) {
                    grid.visible = false;
                    console.log("Grid Visible: FALSE (Auto-Hide)");
                }
            }, 500);
        } else {
            console.log("Grid 'camGrid' not found in camera or scene.");
        }
    });

    // Resume Tween
    if (resBtn) resBtn.addEventListener('click', () => {
        console.log("clicked Resume Tween");
        if (scene.points && scene.points.morphTween) {
            const tween = scene.points.morphTween;
            if (tween.isPaused()) {
                tween.resume();
                console.log("Tween Resumed.");
            } else {
                console.log("Tween is not paused (or is playing).");
            }
        } else {
            // Fallback: If logic lost the reference (e.g. onComplete cleared it?), we can't resume easily 
            // unless we stored it elsewhere. But points.js clears it onComplete.
            console.log("No active morph tween found to resume.");
        }
    });

    // Make Draggable
    makeDraggable(document.getElementById('act-controls'));

    handleKeyboardAnimations(scene);

    // --- NEW: RAPIER DEBUGGER TOGGLE ---
    /**
     * Toggles the Rapier physics debugger.
     * Accessible via console: scene.toggleRapierHelper()
     */
    scene.toggleRapierHelper = () => {
        const wrapper = scene.rapierWorldWrapper;
        if (!wrapper) {
            console.warn("[Physics] Rapier wrapper (rapierWorldWrapper) not found on scene.");
            return;
        }

        wrapper.debuggerEnabled = !wrapper.debuggerEnabled;
        wrapper.world.debuggerEnabled = wrapper.debuggerEnabled;

        if (wrapper.lines) {
            wrapper.lines.visible = wrapper.debuggerEnabled;
            if (wrapper.debuggerEnabled) {
                scene.add(wrapper.lines);
            } else {
                scene.remove(wrapper.lines);
            }
        }

        console.log(`[Physics] Debugger ${wrapper.debuggerEnabled ? 'ENABLED' : 'DISABLED'}`);
    };
}

/**
 * Advanced Dance Interaction (D key)
 * Handles stool physics disruption, hero movement, and staged return sequence.
 */
/**
 * Advanced Dance Interaction (D key)
 * Delegated to centralized trigger logic in uiInteractions.js
 */
import { triggerHeroDance } from '../interactions/uiInteractions.js';

function handleHeroDance(scene) {
    window.addEventListener('keydown', (e) => {
        if (e.key === 'd' || e.key === 'D') {
            triggerHeroDance(scene);
        }
    });
}


function makeDraggable(element) {
    if (!element) return;

    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    element.style.cursor = 'move';
    element.style.userSelect = 'none';

    element.addEventListener("mousedown", dragStart);
    window.addEventListener("mouseup", dragEnd);
    window.addEventListener("mousemove", drag);

    function dragStart(e) {
        if (e.target.closest('button')) return; // Allow normal button clicks

        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (element.contains(e.target)) {
            isDragging = true;
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, element);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }
}
