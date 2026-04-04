import { MORPH_DURATION } from '../points/points.js';
// import { revealRoom } from '../scenario/scenarioUtility.js';
import * as SU from '../scenario/scenarioUtility.js';
import { HUD_CONFIG_SCENARIO, HUD_CONFIG } from '../resources/addHUDFrame.js';
import { GLOBAL_COLORS, SCENARIO_STATES } from '../configs/sceneConfig.js';
import { getDynamicText } from '../utils/contentUtils.js';
import { personaManager } from '../content-manager/personaManager.js';
import { BOARD_LAYOUT_CONFIG, fitBoardTexts, getTextWidth } from '../content-manager/textBoard.js';
import { NavInteractions } from './navInteractions.js';

export const BEAM_IMPACT_DUR = 100; // Delay before beam dissipation (ms)


/**
 * scroll-pointsMorph.js
 * Handles scroll-based morphing for the Points system using GSAP Observer.
 */

export function initScrollMorph(scene, pointsInstance, TWEEN) {
    const gsap = window.gsap;
    const Observer = window.Observer || (gsap ? gsap.Observer : null);

    if (gsap && Observer) {
        gsap.registerPlugin(Observer);
    }

    // Manage scroll lock state globally for this module
    let isScrollLocked = true;

    // Manage Case-wise state
    // Step 0: Chaos
    // Step 1: Root (Index 1)
    // Step 2: Armature (Index 2)
    // Step 3: Animation 'standClap' - WaveSit -> Auto Final Scene
    let currentStep = 0;
    const MAX_STEPS = 3; // 0 to 3 (Step 3 triggers final scene sequence automatically)

    // Internal state for step 3
    let step3Timeout = null;
    let isStep3Sitting = false;

    let lastMorphTime = 0;
    let jumpTimeline = null;

    // Track previous step for directional effects (Beam Attach)
    pointsInstance.previousStep = 0;

    // Initialize Board Scale Tracking
    pointsInstance._lastBoardScale = 1.0;
    pointsInstance._lastSubProgress = 1.0;
    window.__boardScale = 1.0;

    // Initial sync of subProgress based on Chaos state
    window.__boardSubProgress = BOARD_LAYOUT_CONFIG.chaos.subVisible ? 1.0 : 0.0;

    // -------------------------------------------------------------------------
    // Helper Functions
    // -------------------------------------------------------------------------

    /**
     * Update the HUD's bottom progress bar
     */
    const updateHUDProgressBar = (progressValue, alpha = 1.0, marginX = 0.2) => {
        const hUniforms = scene.HUD.material.uniforms;
        hUniforms.uBNotchBarProgress.value = progressValue;
        hUniforms.uBNotchBarAlpha.value = alpha;
        hUniforms.uBNotchBarMarginX.value = marginX;
    };

    /**
 * Update the HUD's right progress bar
 */
    const updateHUDRightProgressBar = (progressValue) => {
        if (scene && scene.HUD && scene.HUD.material.uniforms) {
            const hUniforms = scene.HUD.material.uniforms;
            hUniforms.uRNotchBarProgress.value = progressValue;
        }
    };

    /**
     * Update HUD colors (Beam and Active Bars)
     */
    const updateHUDColors = (color) => {
        if (scene && scene.HUD && scene.HUD.material.uniforms) {
            const hUniforms = scene.HUD.material.uniforms;
            hUniforms.uBeamColor.value.copy(color);
            hUniforms.uBNotchBarColor.value.copy(color);
        }
    };

    /**
     * Trigger the energetic beam blast (Start)
     */
    const startBeamShoot = (attachRatio = 0.0) => {
        if (!scene || !scene.HUD || !scene.HUD.material.uniforms) return;
        const hUniforms = scene.HUD.material.uniforms;

        // Set directionality
        hUniforms.uBeamAttachRatio.value = attachRatio;

        // Kill any existing beam tween
        if (pointsInstance.beamTween) pointsInstance.beamTween.stop();

        // --- Safe Reset ---
        hUniforms.uBeamMaxHeight.value = 0.0;
        hUniforms.uBeamBaseThickness.value = 0.0;
        hUniforms.uBeamGrowth.value = 0.0;

        const shootDuration = 200;

        pointsInstance.beamTween = new TWEEN.Tween({ growth: 0.0, height: 0.0, thickness: 0.0 })
            .to({
                growth: HUD_CONFIG.BEAM_GROWTH || 1.0,
                height: HUD_CONFIG.BEAM_MAX_HEIGHT || 0.03,
                thickness: HUD_CONFIG.BEAM_BASE_THICKNESS || 0.001
            }, shootDuration)
            .easing(TWEEN.Easing.Quadratic.In)
            .onUpdate((obj) => {
                hUniforms.uBeamGrowth.value = obj.growth;
                hUniforms.uBeamMaxHeight.value = obj.height;
                hUniforms.uBeamBaseThickness.value = obj.thickness;
            })
            .onComplete(() => {
                pointsInstance.beamTween = null;

                // --- IMPACT VIBRATION ---
                // Logic: Beam hits an end -> That end becomes a pivot -> Other end vibrates
                // uRNotchVibeB (0 at bottom, 1 at top): Bottom is Anchor, Top vibrates
                // uRNotchVibeT (0 at top, 1 at bottom): Top is Anchor, Bottom vibrates

                // attachRatio 0.0: Target is Bottom -> Use uRNotchVibeB (Bottom Anchor)
                // attachRatio 1.0: Target is Top    -> Use uRNotchVibeT (Top Anchor)
                const vibeUniform = (attachRatio < 0.5) ? hUniforms.uRNotchVibeB : hUniforms.uRNotchVibeT;

                if (pointsInstance.impactVibeTween) pointsInstance.impactVibeTween.stop();

                vibeUniform.value = 1.0;
                pointsInstance.impactVibeTween = new TWEEN.Tween(vibeUniform)
                    .to({ value: 0.0 }, 1500) // Linger for 1.5s as requested
                    .easing(TWEEN.Easing.Exponential.Out)
                    .onComplete(() => { pointsInstance.impactVibeTween = null; })
                    .start();

                if (typeof window.cvShake === 'function') {
                    window.cvShake(1500);
                }

                // --- AUTOMATIC DISSIPATION ---
                setTimeout(() => endBeamShoot(), BEAM_IMPACT_DUR);

                // --- BEAM IMPULSE (Step 3) ---
                if (currentStep === 3 && scene.HUD) {
                    if (scene.HUD.applyBeamImpulse) {
                        scene.HUD.applyBeamImpulse();
                    }
                    if (typeof window.cvFall === 'function') {
                        window.cvFall();
                    }
                }
            })
            .start();
    };

    /**
     * Trigger the energetic beam dissipation (End)
     */
    const endBeamShoot = () => {
        if (!scene || !scene.HUD || !scene.HUD.material.uniforms) return;
        const hUniforms = scene.HUD.material.uniforms;

        // Kill any existing beam tween
        if (pointsInstance.beamTween) pointsInstance.beamTween.stop();

        const endDuration = 200;

        pointsInstance.beamTween = new TWEEN.Tween({
            growth: hUniforms.uBeamGrowth.value,
            height: hUniforms.uBeamMaxHeight.value,
            thickness: hUniforms.uBeamBaseThickness.value
        })
            .to({ growth: 0.0, height: 0.0, thickness: 0.0 }, endDuration)
            .easing(TWEEN.Easing.Quadratic.In)
            .onUpdate((obj) => {
                hUniforms.uBeamGrowth.value = obj.growth;
                hUniforms.uBeamMaxHeight.value = obj.height;
                hUniforms.uBeamBaseThickness.value = obj.thickness;
            })
            .onComplete(() => {
                pointsInstance.beamTween = null;
                // Hide Bottom Bar Slot on completion
                updateHUDProgressBar(0, 0, 1.0);
            })
            .start();
    };

    /**
     * Trigger an energetic jump for the scroll icon
     */
    const triggerEnergeticJump = (infinite = false) => {
        const icon = document.querySelector('.indicator-icon');
        if (!icon) return;

        // Kill existing jump if any
        if (jumpTimeline) jumpTimeline.kill();

        // Temporarily disable the CSS bounce animation
        const originalAnimation = icon.style.animation;
        icon.style.animation = 'none';

        // TIMELINE CONFIG
        jumpTimeline = gsap.timeline({
            repeat: infinite ? -1 : 0,
            repeatDelay: infinite ? 0.8 : 0, // Slight breathing room
            onComplete: () => {
                // Restore CSS animation if still visible and not looping
                if (!infinite) {
                    icon.style.animation = originalAnimation;
                    jumpTimeline = null;
                }
            }
        });

        // LUXURIOUS HUD BOUNCE
        const liftDuration = 0.45;
        const dropDuration = 0.65;
        const liftEase = "power3.out";
        const dropEase = "bounce.out";

        // Jump 1: Gentle start
        jumpTimeline.to(icon, { y: -25, duration: liftDuration, ease: liftEase })
            .to(icon, { y: 0, duration: dropDuration, ease: dropEase }, "-=0.1");

        // Jump 2: More energy
        jumpTimeline.to(icon, { y: -35, duration: liftDuration - 0.05, ease: liftEase }, "+=0.1")
            .to(icon, { y: 0, duration: dropDuration, ease: dropEase }, "-=0.1");

        // Jump 3: Final peak
        jumpTimeline.to(icon, { y: -45, duration: liftDuration - 0.1, ease: liftEase }, "+=0.1")
            .to(icon, { y: 0, duration: dropDuration + 0.2, ease: dropEase }, "-=0.1");
    };

    /**
     * Stop the jump and restore baseline state
     */
    const stopEnergeticJump = () => {
        if (jumpTimeline) {
            jumpTimeline.kill();
            jumpTimeline = null;
        }
        const icon = document.querySelector('.indicator-icon');
        if (icon) {
            gsap.to(icon, { y: 0, duration: 0.3 });
            icon.style.animation = ''; // Restores CSS default
        }
    };

    // Expose control to pointsInstance
    pointsInstance.triggerEnergeticScrollJump = triggerEnergeticJump;
    pointsInstance.stopEnergeticScrollJump = stopEnergeticJump;
    pointsInstance.triggerStep = (step, durationOverride = null, skipEffects = false) => {
        currentStep = step;
        executeStep(step, null, durationOverride, skipEffects);
    };

    /**
     * Get the current scroll-morph step (0: Chaos, 1: Root, 2: Dance, 3: Room)
     */
    pointsInstance.getCurrentStep = () => currentStep;

    /**
     * Persona-driven refresh: Triggers a title scramble animation for the current step.
     */
    pointsInstance.refreshUIPersonaSync = () => {
        const config = SCROLL_STEP_CONFIG[currentStep];
        if (config && config.ui) {
            if (config.ui.board) {
                const n1 = document.querySelector('.intro-main-name1');
                const n2 = document.querySelector('.intro-main-name2');
                const pMain = document.querySelector('.board-philo-main');
                const pSub = document.querySelector('.board-philo-sub');
                const f1 = document.getElementById('board-feat-1');
                const boardAnimDur = 400; // 50% of default 800
                if (n1) scrambleElementText(n1, config.ui.board.name1, boardAnimDur, n1.innerText);
                if (n2) scrambleElementText(n2, config.ui.board.name2, boardAnimDur, n2.innerText);
                if (pSub && config.ui.board.philoSub) scrambleElementText(pSub, config.ui.board.philoSub, boardAnimDur, pSub.innerText);
                if (pMain && config.ui.board.philo) scrambleElementText(pMain, config.ui.board.philo, boardAnimDur, pMain.innerText);
                if (f1 && config.ui.board.feat1) scrambleElementText(f1, config.ui.board.feat1, boardAnimDur, f1.innerText);
                const f2 = document.getElementById('board-feat-2');
                if (f2 && config.ui.board.feat2) scrambleElementText(f2, config.ui.board.feat2, boardAnimDur, f2.innerText);
            }
        }
    };

    // -------------------------------------------------------------------------
    // Helper: Camera Tween
    // -------------------------------------------------------------------------
    const tweenCameraToSit = (points, tweenDuration = 3000, delay = 3000, onComplete) => {
        // Use explicitly passed scene, fallback to points.scene if needed
        const scene = points.scene;
        const camera = (scene ? scene.camera : null) || points.camera;
        const controls = (scene ? scene.orbitControls : null) || points.controls;



        if (!camera || !controls) {
            console.error("[ScrollMorph] Camera or Controls missing! Aborting tween.");
            return;
        }

        // Delay is now passed as argument (default 3000ms)

        // Target Values (Plain Objects)
        const targetCamPos = { x: 17.4192690499384, y: 4.136164408312478, z: 0.015309904980740474 };
        const targetCamRot = { x: -0.04520672934354282, y: 1.5515547851416993, z: 0.045198372394982464 };
        const targetOrbit = { x: -3.226367634071287, y: 4.1182097600816245, z: -0.38158710192007556 };

        // Uniform Target Values
        const targetUniScale = 0.036;
        const targetUniRot = { x: Math.PI / 2, y: Math.PI / 2, z: 0 };
        const targetUniOffset = { x: 0, y: 0 };
        const targetUniPos = { x: -2.1, y: 0, z: 0 };
        const targetUniLightBoost = 0;
        const targetUniPixelRatio = 1.0; // SWEET SPOT: Balanced for fill-rate performance
        const targetUniVib = 0.0;


        // Start States (Clone current values to avoid reference issues)
        const startCamPos = camera.position.clone();
        const startCamRot = camera.rotation.clone(); // Euler
        const startOrbit = controls.target.clone();

        // Capture Start Uniforms
        const uniforms = points.material ? points.material.uniforms : null;
        const hudUniforms = scene.HUD.material.uniforms || null;
        // Use current values directly
        const startUniScale = uniforms?.uModelScale?.value || 1.0;
        const startUniRot = uniforms?.uModelRotation?.value ? uniforms.uModelRotation.value.clone() : { x: 0, y: 0, z: 0 };
        const startUniOffset = uniforms?.uModelScreenOffset?.value ? uniforms.uModelScreenOffset.value.clone() : { x: 0, y: 0 };

        const startUniPos = uniforms?.uModelPosition?.value ? uniforms.uModelPosition.value.clone() : { x: 0, y: 0, z: 0 };
        const startUniLightBoost = uniforms?.uLightSizeBoost?.value || 1.5;
        const startUniPixelRatio = uniforms?.uPixelRatio?.value || 2.0;
        const startUniPointSize = uniforms?.uModelPointSizeFactor?.value || 1.0;
        const targetUniPointSize = startUniPointSize * 0.32; // User Refinement: Restoring original pinpoint sharpness (0.32).
        const startUniVib = uniforms?.uModelVibFactor?.value || 0.0;

        // HUD Uniforms

        // MAIN TWEEN
        const progress = { t: 0 };

        new TWEEN.Tween(progress)
            .to({ t: 1 }, tweenDuration)
            .easing(TWEEN.Easing.Linear.None)
            .delay(delay)
            .onStart(() => {
                // START looping breath for the transition
                if (window.scene && window.scene.HUD && typeof window.scene.HUD.startBreathing === 'function') {
                    window.scene.HUD.startBreathing();
                }

                // PERFORMANCE LOCK: Silence interaction and Maximizer immediately
                if (window.scene) window.scene.isTransitioning = true;

                // Trigger HUD "Swaying Deco" animation on hide
                if (window.scene && window.scene.HUD && typeof window.scene.HUD.runTweenHideDecos === 'function') {
                    window.scene.HUD.runTweenHideDecos(2000,
                        () => {
                            window.scene.HUD.toggleGarden()
                        }
                    )
                    // Delayed Island Hide to let bars fall visibly
                    setTimeout(() => {
                        window.scene.HUD.runTweenHideIsland(3000)
                    }, 500); // 0.5s delay
                    window.scene.HUD.runTweenHideRNotch(3000)
                }
            })
            .onUpdate((obj) => {
                const alpha = obj.t;

                // 1. Lerp Camera Position
                camera.position.lerpVectors(startCamPos, targetCamPos, alpha);

                // 2. Lerp Camera Rotation
                camera.rotation.x = startCamRot.x + (targetCamRot.x - startCamRot.x) * alpha;
                camera.rotation.y = startCamRot.y + (targetCamRot.y - startCamRot.y) * alpha;
                camera.rotation.z = startCamRot.z + (targetCamRot.z - startCamRot.z) * alpha;

                // 3. Lerp Orbit Target
                controls.target.lerpVectors(startOrbit, targetOrbit, alpha);

                // 4. Lerp Uniforms (if available)
                if (uniforms) {
                    // Float Lerps
                    if (uniforms.uModelScale)
                        uniforms.uModelScale.value = startUniScale + (targetUniScale - startUniScale) * alpha;
                    if (uniforms.uModelVibFactor)
                        uniforms.uModelVibFactor.value = startUniVib + (targetUniVib - startUniVib) * alpha;

                    // Vector Lerps
                    if (uniforms.uModelRotation && uniforms.uModelRotation.value) {
                        uniforms.uModelRotation.value.lerpVectors(startUniRot, targetUniRot, alpha);
                    }
                    if (uniforms.uModelScreenOffset && uniforms.uModelScreenOffset.value) {
                        uniforms.uModelScreenOffset.value.lerpVectors(startUniOffset, targetUniOffset, alpha);
                    }
                    if (uniforms.uModelPosition && uniforms.uModelPosition.value) {
                        uniforms.uModelPosition.value.lerpVectors(startUniPos, targetUniPos, alpha);
                    }
                    if (uniforms.uLightSizeBoost)
                        uniforms.uLightSizeBoost.value = startUniLightBoost + (targetUniLightBoost - startUniLightBoost) * alpha;

                    if (uniforms.uPixelRatio)
                        uniforms.uPixelRatio.value = startUniPixelRatio + (targetUniPixelRatio - startUniPixelRatio) * alpha;
                    if (uniforms.uModelPointSizeFactor)
                        uniforms.uModelPointSizeFactor.value = startUniPointSize + (targetUniPointSize - startUniPointSize) * alpha;
                }
            })
            .onComplete(() => {
                if (onComplete) {
                    onComplete();
                    points.hasVisitedRoom = true;
                } else {
                    // Default Fallback (Safe Landing logic)
                    if (scene) {
                        setTimeout(() => {
                            // FADE OUT BOARD ON ROOM ENTRY (Safe-guard)
                            const boardEl = document.getElementById('board');
                            if (boardEl) {
                                if (points.boardPosTween) points.boardPosTween.stop();
                                if (points.boardScaleTween) points.boardScaleTween.stop();

                                window.gsap.to(boardEl, {
                                    opacity: 0,
                                    duration: 0.8,
                                    onComplete: () => { boardEl.style.display = 'none'; }
                                });
                            }

                            SU.assembleRoom(scene);
                            points.hasVisitedRoom = true;
                        }, 1125);
                    }
                }
            })
            .start();
    };

    // -------------------------------------------------------------------------
    // Helper: Step 3 Trigger
    // -------------------------------------------------------------------------
    const triggerWalkSitType = (points, onComplete) => {
        // Flag is now set in the action config to prevent spamming during the 3s wave period
        isStep3Sitting = true;

        const getClipDuration = (name) => {
            if (!points.scene.heroClips) return 1000;
            const clip = points.scene.heroClips.find(c => c.name === name);
            return clip ? clip.duration * 1000 : 1000;
        }

        const isRepeatVisit = points.hasVisitedRoom || false;

        // 4X DYNAMIC SCALING: Base is 2.25s @ 1.2x speed
        const walkTime = isRepeatVisit ? (2.25 / 4.0) : 2.25; // Original was 2.25
        const walkTimeScale = isRepeatVisit ? (1.2 * 4.0) : 1.2; // Original was 1.2
        const delay = 0; // Adjusted to sync camera with walk start

        const transitionTime = 0.2; // [FIX] Short, snappy cross-fade duration (Prevents "Transparent Walk" bug)
        const sitDuration = getClipDuration('standToSit');
        const typeTransitionDuration = getClipDuration('sitToType');
        const typeScale = 2.5;
        const walkSitTypeDuration = sitDuration + typeTransitionDuration / typeScale + walkTime * 1000;

        points.playAnimation('walking', transitionTime, true, walkTimeScale);

        // --- EXPOSURE HANDOFF ---
        // Start fading the high points exposure down to a neutral range (0.4) 
        // throughout the walking duration. This prepares the eyes for the room assembly.
        if (points.renderer) {
            new TWEEN.Tween(points.renderer)
                .to({ toneMappingExposure: 0.4 }, walkTime * 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
        }

        // Camera Tween Handler
        tweenCameraToSit(points, walkTime * 1000, delay, async () => {
            // [UI FIX] Explicitly hide the board to prevent ghosting or interaction overlapping
            const boardEl = document.getElementById('board');
            if (boardEl) {
                if (points.boardPosTween) points.boardPosTween.stop();
                if (points.boardScaleTween) points.boardScaleTween.stop();

                window.gsap.to(boardEl, {
                    opacity: 0,
                    duration: 0.8,
                    onComplete: () => { boardEl.style.display = 'none'; }
                });
            }

            // [DEEP_ANALYSIS] STAGGER_BUILD:
            // Give the Pilot 1.125s to comfortably begin the "Sit" animation 
            // before dumping the Room Assembly load.
            await SU.delay(1125);

            // PERFORMANCE SIGNAL: Mark the build as active (used for mixer throttling)
            if (scene) scene.isHeavyBuilding = true;
            SU.assembleScene(scene);
        });

        setTimeout(async () => {
            points.playAnimation('standToSit', transitionTime, false);
            await SU.delay(sitDuration);
            points.playAnimation('sitToType', transitionTime, false, typeScale);
            await SU.delay(typeTransitionDuration / typeScale);
            points.playAnimation('typing', 0.5, true);

            if (onComplete) onComplete();

        }, walkTime * 1000 + delay);
    };

    // -------------------------------------------------------------------------
    // Step Configuration
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // Step Configuration
    // -------------------------------------------------------------------------
    const SCROLL_STEP_CONFIG = {
        0: {
            label: "Chaos",
            bloom: 3,
            knowhere: { scale: 0.8, offset: { x: 0, y: 0.25 }, gravity: 50.0, radius: 200.0, gardenHoverMult: 12.0, chargeUpDur: 3000, collapseOutDur: 1200 },
            get targetIndex() { return pointsInstance.getChaosIndex(); },
            allowsScrollBack: false,
            ui: {
                scrollIcon: 'pos-bottom',
                scrollScale: 1, // Neutralized to match font-size 1:1 with credibility line
                maskBounds: { widthVw: 0, heightVh: 0, topVh: 60, leftVw: 5 },
                maskScale: 0.0, // NEW: No mask in Chaos
                board: {
                    nameSub: "HELLO, I AM",
                    get philoSub() {
                        const mode = personaManager.currentMode.toUpperCase();
                        return getDynamicText(`NARR_STEP_0_VERB_${mode}`);
                    },
                    get name1() {
                        const mode = personaManager.currentMode.toUpperCase();
                        return getDynamicText(`BOARD_STEP_0_NAME1_${mode}`);
                    },
                    get name2() {
                        const mode = personaManager.currentMode.toUpperCase();
                        return getDynamicText(`BOARD_STEP_0_NAME2_${mode}`);
                    },
                    get philo() {
                        const mode = personaManager.currentMode.toUpperCase();
                        return getDynamicText(`NARR_STEP_0_OUTCOME_${mode}`);
                    },
                    get feat1() {
                        const mode = personaManager.currentMode.toUpperCase();
                        const full = getDynamicText(`NARR_STEP_0_CREDIBILITY_${mode}`);
                        return full.split('\n')[0].trim();
                    },
                    get feat2() {
                        const mode = personaManager.currentMode.toUpperCase();
                        const full = getDynamicText(`NARR_STEP_0_CREDIBILITY_${mode}`);
                        const parts = full.split('\n');
                        return parts.length > 1 ? parts[1].trim() : "";
                    }
                }
            },
            action: (points) => {
                points.stopAnimations(0.8);
            }
        },
        1: {
            label: "Root",
            bloom: 3,
            knowhere: { scale: 1.0, offset: { x: -0.4, y: -0.75 }, gravity: 60.0, radius: 200.0, gardenHoverMult: 15.0, chargeUpDur: 4000, collapseOutDur: 500 },
            get targetIndex() { return pointsInstance.getRootIndex(); },
            allowsScrollBack: true,
            ui: {
                scrollIcon: 'hidden',
                scrollScale: 1,
                get maskBounds() {
                    return { useBoard: true }; // Safe method: measure the div id=board
                },
                maskScale: 1.0, // NEW: Full mask in Root
                board: {
                    get name1() {
                        const mode = personaManager.currentMode.toUpperCase();
                        return getDynamicText(`BOARD_STEP_1_NAME1_${mode}`);
                    },
                    get name2() {
                        const mode = personaManager.currentMode.toUpperCase();
                        return getDynamicText(`BOARD_STEP_1_NAME2_${mode}`);
                    },
                    get philo() {
                        const mode = personaManager.currentMode.toUpperCase();
                        return getDynamicText(`NARR_STEP_1_SUBTITLE_${mode}`);
                    },
                    get feat1() {
                        const mode = personaManager.currentMode.toUpperCase();
                        return getDynamicText(`NARR_STEP_1_DESC_${mode}`);
                    }
                }
            },
            action: (points) => {
                points.stopAnimations(0.8);
                // REVEAL Nav Buttons when transitioning to Root state morph
                NavInteractions.onMorphToAbout(points.scene);
            }
        },
        2: {
            label: "Dance",
            bloom: 3,
            knowhere: { scale: 0.5, offset: { x: 0, y: -1.0 }, gravity: -800.0, radius: 300.0, gardenHoverMult: -0.5, chargeUpDur: 3000, collapseOutDur: 400 },
            get targetIndex() { return pointsInstance.getCharIndex(); },
            allowsScrollBack: true, // Allow going back to Root
            ui: {
                scrollIcon: 'hidden',
                scrollScale: 1,
                get maskBounds() {
                    return { useBoard: true }; // Safe method: measure the div id=board
                },
                maskScale: 1.0,
                board: {
                    get name1() {
                        const mode = personaManager.currentMode.toUpperCase();
                        return getDynamicText(`BOARD_STEP_2_NAME1_${mode}`);
                    },
                    get name2() {
                        const mode = personaManager.currentMode.toUpperCase();
                        return getDynamicText(`BOARD_STEP_2_NAME2_${mode}`);
                    },
                    get philo() {
                        const mode = personaManager.currentMode.toUpperCase();
                        return getDynamicText(`NARR_STEP_2_SUBTITLE_${mode}`);
                    },
                    get feat1() {
                        const mode = personaManager.currentMode.toUpperCase();
                        return getDynamicText(`NARR_STEP_2_DESC_${mode}`);
                    }
                }
            },
            action: (points) => {
                // Sequential Dance Routine: breakDance -> robotDance -> gangnam -> recycle
                const runDanceCycle = () => {
                    if (pointsInstance.getCurrentStep() !== 2) return; // Safety: Stop if state changed

                    points.playAnimation('breakDance', 0.8, 'pingpong', 1.1, () => {
                        if (pointsInstance.getCurrentStep() !== 2) return;
                        points.playAnimation('robotDance', 0.8, false, 1.1, () => {
                            if (pointsInstance.getCurrentStep() !== 2) return;
                            points.playAnimation('gangnam', 0.8, false, 1.25, runDanceCycle);
                        });
                    })

                };

                runDanceCycle();

                // Tween Electricity Head Sprite Size to 16
                if (window.scene && window.scene.HUD && window.scene.HUD.material.uniforms.uHeadSpriteSize) {
                    new TWEEN.Tween(window.scene.HUD.material.uniforms.uHeadSpriteSize)
                        .to({ value: 16.0 }, 1000)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();
                }

                // --- NEW: LOG BONES ---
                // console.log(`[Points] Dance Animation: ${randomName}`);
                // if (points.model) {
                //     const bones = [];
                //     points.model.traverse(node => { if (node.isBone) bones.push(node.name); });
                //     console.log(`[Points] ${randomName} Skeleton Bones:`, bones);
                // }

                // DPR is now handled dynamically by PixelRatioMaximizer in sceneConfig.js
                // No need for manual setPixelRatio calls here to avoid fighting the logic.

                // Ensure points are visible for the mask effect
                let p = scene.getObjectByName('PointsCloud');
                if (p) {
                    p.visible = true;
                }
            }
        },
        3: {
            label: "WaveSit",
            knowhere: { scale: 0.0, offset: { x: 0, y: -3.0 }, gravity: 0.0, radius: 200.0, gardenHoverMult: 0.0, chargeUpDur: 2250, collapseOutDur: 1200 },
            get targetIndex() { return pointsInstance.getCharIndex(); },
            allowsScrollBack: false,
            ui: {
                scrollIcon: 'hidden',
                get maskBounds() {
                    return { useBoard: true }; // Safe method: measure the div id=board
                },
                maskScale: 1.0,
                board: {
                    get name1() {
                        const mode = personaManager.currentMode.toUpperCase();
                        return getDynamicText(`BOARD_STEP_3_NAME1_${mode}`);
                    },
                    get name2() {
                        const mode = personaManager.currentMode.toUpperCase();
                        return getDynamicText(`BOARD_STEP_3_NAME2_${mode}`);
                    },
                    get philo() {
                        // For Step 3, the outcome is the invitation subtitle
                        const mode = personaManager.currentMode.toUpperCase();
                        return getDynamicText(`NARR_STEP_3_SUBTITLE_${mode}`);
                    }
                }
            },
            action: async (points) => {
                if (isStep3Sitting) return;
                isStep3Sitting = true;
 
                // Immediate lock on performance: hide knowhere hub as we enter state 3
                if (scene.knowhere) {
                    scene.knowhere.visible = false;
                }

                if (scene) {
                    scene.isTransitioning = true;

                    // --- STAGGERED QUALITY DROP (Avoiding the "Hard Snap") ---
                    // We drop the resolution in 3 discrete steps during the walk to reduce visual shock
                    // while still reaching the 0.25x performance floor before the build starts.
                    // ULTRA-AGGRESSIVE THROTTLE: Drop to 0.20x native to ensure zero-lag assembly
                    const nativeDPR = window.devicePixelRatio || 1;
                    const transitionDPR = nativeDPR * 0.20;
                    const isRepeatVisit = points.hasVisitedRoom || false;
                    const walkTimeMS = (isRepeatVisit ? (2.25 / 4.0) : 2.25) * 1000;

                    const setDPRStep = (val) => {
                        if (scene.renderer) {
                            scene.renderer.setPixelRatio(nativeDPR * val);
                            // Re-sync composer buffers to avoid stretched visuals
                            if (scene.pointsApp && typeof scene.pointsApp.onWindowResize === 'function') {
                                scene.pointsApp.onWindowResize();
                            }
                        }
                    };

                    // These 3 discrete resizes are spread through the walk to be almost invisible
                    setTimeout(() => setDPRStep(0.75), walkTimeMS * 0.3);
                    setTimeout(() => setDPRStep(0.50), walkTimeMS * 0.6);
                    setTimeout(() => setDPRStep(0.20), walkTimeMS * 0.9);

                    // --- SMOOTH MEATY BOOST ---
                    // Simultaneously thicken the points to "fill the gaps" created by the low resolution.
                    // This is a seamless shader change (zero lag).
                    if (points.material && points.material.uniforms.uModelPointSizeFactor) {
                        new TWEEN.Tween(points.material.uniforms.uModelPointSizeFactor)
                            .to({ value: 1.85 }, walkTimeMS) // Target 1.85x density
                            .easing(TWEEN.Easing.Quadratic.Out)
                            .start();
                    }
                }
                if (step3Timeout) clearTimeout(step3Timeout);

                points.playAnimation('waving', 0.2, true);

                if (scene.HUD && typeof scene.HUD.startBreathing === 'function') {
                    scene.HUD.startBreathing();
                }

                step3Timeout = setTimeout(() => {
                    // Manual DPR reset removed: PixelRatioMaximizer handles the handoff to Room state


                    triggerWalkSitType(points, () => {
                        // Sequence Complete
                    });
                }, 1300); // Reduced delay from 2250ms
            }
        }
    };

    /**
     * Logic: Execute Step
     */
    const executeStep = (step, onComplete, durationOverride = null, skipEffects = false) => {
        // [PERF_FIX] Force shadow-map update to false during all morph states (No stutter)
        if (scene && scene.renderer && scene.renderer.shadowMap) {
            scene.renderer.shadowMap.autoUpdate = false;
        }

        const config = SCROLL_STEP_CONFIG[step];
        if (!config) return;

        // --- MASTER TRANSITION LOCK ---
        // Lock the PixelRatioMaximizer IMMEDIATELY when targeting Step 3 (Walk).
        // This prevents the transient "Snap + Revert" glitch on faster scroll-frames.
        if (step === 3 && scene) {
            scene.isTransitioning = true;
        }

        // Track Step-level morph states for the guard
        pointsInstance.morphOriginStep = (pointsInstance.morphTargetStep !== undefined) ? pointsInstance.morphTargetStep : step;
        pointsInstance.morphTargetStep = step;

        const morphDur = durationOverride !== null ? durationOverride : MORPH_DURATION;

        // --- BLOOM TRANSITION ---
        if (pointsInstance.isBloomEnabled && pointsInstance.bloomPass && (config.bloom !== undefined)) {
            new TWEEN.Tween(pointsInstance.bloomPass)
                .to({ strength: config.bloom }, morphDur)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
        }

        // Directional Logic:
        // Increasing Step (Down) -> Attach 0.0
        // Decreasing Step (Up)   -> Attach 1.0 (Reverse)
        const isScrollingUp = step < pointsInstance.previousStep;
        const attachRatio = isScrollingUp ? 1.0 : 0.0;
        pointsInstance.previousStep = step;

        // Restore Knowhere visibility if we are not in Step 3
        if (scene.knowhere && step !== 3) {
            scene.knowhere.visible = true;
        }

        // PERFORMANCE: Ensure points are visible if NOT in Room Step (3)
        if (step !== 3 && pointsInstance.points) {
            pointsInstance.points.visible = true;
        }

        // CRITICAL: Reset Step 3 State immediately on step change
        if (step !== 3) {
            isStep3Sitting = false;
            if (step3Timeout) clearTimeout(step3Timeout);
        }

        if (!skipEffects) {
            // Reset and show Bottom Bar Slot (Closed)
            // Only reset if we aren't already morphing to avoid jumps
            if (!pointsInstance.isMorphing) {
                const initialBarProgress = isScrollingUp ? 1.0 : 0.0;
                updateHUDProgressBar(initialBarProgress, 1, 0.2);
            }

            // --- COLOR TWEENING ---
            // Scrolling Down (Index increases) -> Current to Cyan
            // Scrolling Up (Index decreases)   -> Current to Gold
            // EXCEPTION: Step 3 is technically "Forward" but stays Cyany/White. 
            const targetColor = (isScrollingUp && step !== 3) ? GLOBAL_COLORS.ACCENT_GOLD : GLOBAL_COLORS.ELECTRIC_CYAN;

            if (!pointsInstance.hudCurrentColor) {
                // Initialize if not exists
                const startColor = (scene && scene.HUD) ? scene.HUD.material.uniforms.uBeamColor.value : GLOBAL_COLORS.ELECTRIC_CYAN;
                pointsInstance.hudCurrentColor = startColor.clone();
            }

            if (pointsInstance.hudColorTween) pointsInstance.hudColorTween.stop();

            pointsInstance.hudColorTween = new TWEEN.Tween(pointsInstance.hudCurrentColor)
                .to({
                    r: targetColor.r,
                    g: targetColor.g,
                    b: targetColor.b
                }, morphDur)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(() => {
                    updateHUDColors(pointsInstance.hudCurrentColor);
                })
                .onComplete(() => { pointsInstance.hudColorTween = null; })
                .start();

            // 1. BEAM BLAST (Delayed Ignition)
            if (pointsInstance.beamTimeout) clearTimeout(pointsInstance.beamTimeout);
            // Tightened: morphDur / 15 or 50ms to account for the aggressive front-loaded Cubic.Out easing
            const beamDelay = Math.min(50, morphDur / 15);
            pointsInstance.beamTimeout = setTimeout(() => startBeamShoot(attachRatio), beamDelay);
        }

        // 2. PROGRESS BARS & MORPH (Immediate)
        if (pointsInstance.morphTimeout) clearTimeout(pointsInstance.morphTimeout);
        // No delay anymore
        const executeMorph = () => {
            // --- RIGHT BAR SYNC ---
            const startRProgress = (scene && scene.HUD) ? scene.HUD.material.uniforms.uRNotchBarProgress.value : 0;
            const targetRProgress = step / MAX_STEPS;

            // Kill existing Right Bar Tween to prevent Jumps
            if (pointsInstance.rightBarTween) pointsInstance.rightBarTween.stop();

            if (step !== 3) {
                pointsInstance.rightBarTween = new TWEEN.Tween({ r: startRProgress })
                    .to({ r: targetRProgress }, morphDur)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .onUpdate((obj) => {
                        updateHUDRightProgressBar(obj.r);
                    })
                    .onComplete(() => { pointsInstance.rightBarTween = null; })
                    .start();
            } else {
                pointsInstance.rightBarTween = new TWEEN.Tween({ r: startRProgress })
                    .to({ r: targetRProgress }, 1000)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .onUpdate((obj) => {
                        updateHUDRightProgressBar(obj.r);
                    })
                    .onComplete(() => { pointsInstance.rightBarTween = null; })
                    .start();
            }

            // --- 0. Knowhere Tween ---
            if (scene.knowhere && config.knowhere) {
                const kMat = scene.knowhere.material;
                if (kMat.uniforms.uScaleFactor && kMat.uniforms.uHudOffset) {
                    if (pointsInstance.knowhereMorphTween) pointsInstance.knowhereMorphTween.stop();
                    if (pointsInstance.knowherePhysicsTween) pointsInstance.knowherePhysicsTween.stop();

                    const startScale = kMat.uniforms.uScaleFactor.value;
                    const startX = kMat.uniforms.uHudOffset.value.x;
                    const startY = kMat.uniforms.uHudOffset.value.y;


                    // Points Gravity, Radius & Hover Factor Tween
                    const pMat = pointsInstance.material;
                    const startGravity = pMat.uniforms.uKnowhereGravity.value;
                    const startRadius = pMat.uniforms.uKnowhereRadius.value;
                    const startHoverMult = pMat.uniforms.uKnowhereGravityHoverFactor.value;

                    // 1. ARCHITECTURAL MORPH (Scale & Position of the Mesh)
                    pointsInstance.knowhereMorphTween = new TWEEN.Tween({
                        scale: startScale,
                        x: startX,
                        y: startY
                    })
                        .to({
                            scale: config.knowhere.scale,
                            x: config.knowhere.offset.x,
                            y: config.knowhere.offset.y
                        }, morphDur)
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .onUpdate((obj) => {
                            kMat.uniforms.uScaleFactor.value = obj.scale;
                            kMat.uniforms.uHudOffset.value.set(obj.x, obj.y);
                        })
                        .onComplete(() => { pointsInstance.knowhereMorphTween = null; })
                        .start();

                    // 2. PHYSICS MORPH (Attraction Uniforms) - Can be safely interrupted by Tooltip/HUD interactions
                    pointsInstance.knowherePhysicsTween = new TWEEN.Tween({
                        gravity: startGravity,
                        radius: startRadius,
                        hoverMult: startHoverMult
                    })
                        .to({
                            gravity: config.knowhere.gravity || 0.0,
                            radius: config.knowhere.radius || 200.0,
                            hoverMult: config.knowhere.gardenHoverMult || 50.0
                        }, morphDur)
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .onUpdate((obj) => {
                            pMat.uniforms.uKnowhereGravity.value = obj.gravity;
                            pMat.uniforms.uKnowhereRadius.value = obj.radius;
                            if (pMat.uniforms.uKnowhereGravityHoverFactor) {
                                pMat.uniforms.uKnowhereGravityHoverFactor.value = obj.hoverMult;
                            }
                        })
                        .onComplete(() => { pointsInstance.knowherePhysicsTween = null; })
                        .start();

                    // Store for other modules (like HUD garden hover) to know the "resting" values
                    pointsInstance.targetKnowhereGravity = config.knowhere.gravity || 50.0;
                    pointsInstance.targetKnowhereRadius = config.knowhere.radius || 200.0;
                    pointsInstance.targetGardenHoverMult = config.knowhere.gardenHoverMult || 50.0;
                    pointsInstance.targetChargeUpDur = config.knowhere.chargeUpDur || 3000;
                    pointsInstance.targetCollapseOutDur = config.knowhere.collapseOutDur || 1200;
                }
            }

            // --- 1. Morphing ---
            const geo = pointsInstance.points.geometry;
            const currentMorphIdx = geo.morphCurrentIndex || 0;
            const isCurrentlyMorphing = pointsInstance.isMorphing;

            let morphTriggered = false;
            if (config.targetIndex !== undefined) {
                // Helper: Step 3 Sequence (Loading Bar + Pixel Ratio)
                const startStep3Sequence = () => {
                    // isTransitioning is now moved to assembleScene in scenarioUtility.js
                    // to allow points to stay visible during the Walking morph.
                    // Reset Logic to Start
                    if (!skipEffects) updateHUDProgressBar(0, 1, 0.2);

                    const totalSeqDuration = 2000; // 2s Loading
                    const progress = { t: 0 };
                    let ratioSwitched = false;

                    if (pointsInstance.currentMorphTween) pointsInstance.currentMorphTween.stop();

                    pointsInstance.currentMorphTween = new TWEEN.Tween(progress)
                        .to({ t: 100 }, totalSeqDuration)
                        .easing(TWEEN.Easing.Linear.None)
                        .onUpdate(() => {
                            const pNorm = progress.t / 100;
                            if (!skipEffects) updateHUDProgressBar(pNorm, 1, 0.2);
                            updateHUDRightProgressBar(1.0);

                            if (progress.t >= 80 && !ratioSwitched) {
                                ratioSwitched = true;
                                // REMOVED: setPixelRatio here causes a massive lag spike mid-sequence.
                                // The Maximizer or setScenarioState will handle this at a more stable moment.
                            }
                        })
                        .onComplete(() => {
                            // Keep bar full at the end
                            // scene.isTransitioning = false; // MOVED: Keep true until Room Assembly is further along to prevent Maximizer spikes
                            if (!skipEffects) updateHUDProgressBar(1.0, 1.0);
                            if (onComplete) onComplete();
                            pointsInstance.currentMorphTween = null;
                        })
                        .start();
                };

                if (currentMorphIdx !== config.targetIndex || isCurrentlyMorphing) {
                    // Store the intended direction for the HUD sync
                    if (!isCurrentlyMorphing) {
                        pointsInstance.isMovingUp = isScrollingUp;
                    }

                    // For Step 3, we use the custom sequence for Bar updates
                    const ignoreMorphBarUpdate = (step === 3);
                    if (ignoreMorphBarUpdate) startStep3Sequence();

                    pointsInstance.morphToTarget(config.targetIndex, morphDur, 0.1, () => {
                        // Standard Completion Logic
                        // For Step 3, startStep3Sequence handles onComplete
                        if (!ignoreMorphBarUpdate) {
                            if (!skipEffects) updateHUDProgressBar(pointsInstance.isMovingUp ? 0 : 1, 0.0);
                            if (onComplete) onComplete();
                        }
                    }, (alpha) => {
                        // SYNC BOTTOM BAR WITH CORE MORPH ENGINE
                        // Only run if NOT Step 3 (Step 3 has its own tween)
                        if (!ignoreMorphBarUpdate) {
                            let displayProgress = alpha;
                            if (pointsInstance.isMovingUp) {
                                // If moving UP, alpha 0->1 means display 1->0
                                displayProgress = 1.0 - alpha;
                            }
                            if (!skipEffects) updateHUDProgressBar(displayProgress, 1, 0.2);
                        }
                    });
                    morphTriggered = true;
                }
                else if (step === 3) {
                    morphTriggered = true;
                    startStep3Sequence();
                }
            }

            // --- 2. Action ---
            // Fix: Run action regardless of morph trigger (Essential for Step 2 <-> Step 3 where morph doesn't change)
            if (config.action) {
                config.action(pointsInstance);
            }

            if (!morphTriggered && !skipEffects) {
                // If no morph triggered, we still need to handle the beam blast cleanup if needed
                if (pointsInstance.beamTimeout) {
                    clearTimeout(pointsInstance.beamTimeout);
                    pointsInstance.beamTimeout = null;
                }

                // SPECIAL: Step 2 Reverse Animation (3->2)
                // Since no morph happens (2->2), we manually animate the bar 1->0 to show "Reverse Transition"
                if (step === 2 && isScrollingUp) {
                    if (pointsInstance.currentMorphTween) pointsInstance.currentMorphTween.stop();
                    let progress = { t: 100 };

                    pointsInstance.currentMorphTween = new TWEEN.Tween(progress)
                        .to({ t: 0 }, 1000) // 1s reverse
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .onUpdate(() => {
                            if (!skipEffects) updateHUDProgressBar(progress.t / 100, 1, 0.2);
                        })
                        .onComplete(() => {
                            if (onComplete) onComplete();
                            pointsInstance.currentMorphTween = null;
                        })
                        .start();
                } else {
                    // Important: If morph didn't handle onComplete, we must do it here
                    if (onComplete) onComplete();
                }
            }
        };

        executeMorph();

        // --- 3. UI Updates (Icon & Title) ---
        if (config.ui) {
            // A. SCROLL ICON
            const scrollIcon = document.querySelector('.scroll-indicator');
            if (scrollIcon) {
                const isNewlyAppearing = scrollIcon.style.display === 'none' || scrollIcon.style.opacity === '0';

                if (config.ui.scrollIcon === 'hidden') {
                    // --- ANIMATED HIDE: Slide Down (TWEEN) ---
                    if (pointsInstance.scrollTween) pointsInstance.scrollTween.stop();

                    const currentMargin = parseFloat(scrollIcon.style.getPropertyValue('--scroll-indicator-margin')) || 16;
                    const scrollObj = {
                        y: currentMargin,
                        opacity: parseFloat(scrollIcon.style.opacity) || 0.9
                    };

                    pointsInstance.scrollTween = new TWEEN.Tween(scrollObj)
                        .to({ y: -16, opacity: 0 }, 800)
                        .easing(TWEEN.Easing.Quadratic.In)
                        .onUpdate(() => {
                            scrollIcon.style.setProperty('--scroll-indicator-margin', `${scrollObj.y}vh`);
                            scrollIcon.style.opacity = scrollObj.opacity;
                        })
                        .onComplete(() => {
                            scrollIcon.style.display = 'none';
                            scrollIcon.style.pointerEvents = 'none';
                            pointsInstance.scrollTween = null;
                        })
                        .start();

                } else {
                    // --- ANIMATED SHOW: Float from below (TWEEN) ---
                    if (pointsInstance.scrollTween) pointsInstance.scrollTween.stop();

                    if (isNewlyAppearing) {
                        scrollIcon.style.display = 'flex';
                        scrollIcon.style.pointerEvents = 'auto';
                        scrollIcon.style.setProperty('--scroll-indicator-margin', '-16vh');
                        scrollIcon.style.opacity = '0';
                    }

                    scrollIcon.style.pointerEvents = 'auto';

                    // Removing positioning classes
                    scrollIcon.classList.remove('pos-middle', 'pos-bottom', 'pos-left');
                    // Add new one
                    if (config.ui.scrollIcon) scrollIcon.classList.add(config.ui.scrollIcon);

                    const targetScale = config.ui.scrollScale !== undefined ? config.ui.scrollScale : 1;
                    const currentMargin = parseFloat(scrollIcon.style.getPropertyValue('--scroll-indicator-margin')) || -16;
                    const startOp = parseFloat(scrollIcon.style.opacity) || 0;
                    const startScale = parseFloat(scrollIcon.style.getPropertyValue('--scroll-scale')) || 0;

                    const scrollObj = { y: currentMargin, opacity: startOp, scale: startScale };

                    pointsInstance.scrollTween = new TWEEN.Tween(scrollObj)
                        .to({ y: 16, opacity: 0.9, scale: targetScale }, 1200)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .onUpdate(() => {
                            scrollIcon.style.setProperty('--scroll-indicator-margin', `${scrollObj.y}vh`);
                            scrollIcon.style.opacity = scrollObj.opacity;
                            scrollIcon.style.setProperty('--scroll-scale', scrollObj.scale);
                        })
                        .onComplete(() => {
                            scrollIcon.style.display = 'flex';
                            pointsInstance.scrollTween = null;
                        })
                        .start();

                    // Jump behavior
                    if (step === 0) {
                        triggerEnergeticJump(true); // Loop forever on step 0
                    } else {
                        stopEnergeticJump();
                    }
                }
            }

            // --- NEW: JS-Configured Mask Target Calculation (Option A) ---
            if (pointsInstance && pointsInstance.material && pointsInstance.material.uniforms.uTitleMaskRectBase) {
                const maskBounds = config.ui.maskBounds;
                const targetMaskScale = config.ui.maskScale !== undefined ? config.ui.maskScale : 0.0;
                const uRect = pointsInstance.material.uniforms.uTitleMaskRectBase;
                const uScale = pointsInstance.material.uniforms.uTitleMaskScale;

                const vh = window.innerHeight / 100;

                // PADDING (Safe Method - Proportional to height)
                const mLeft_vh = 4.5;   // Increased space on left edge
                const mRight_vh = -10.0;  // Reduced gap on right
                const mTop_vh = 3.0;    // Increased space at top
                const mBottom_vh = -0.75; // Negative gap to pull points up even tighter

                // 1. CLEAR EXISTING TWEENS
                if (pointsInstance.maskFollowTween) pointsInstance.maskFollowTween.stop();
                if (pointsInstance.activeUniformTweens) {
                    pointsInstance.activeUniformTweens.forEach(t => t.stop());
                    pointsInstance.activeUniformTweens = [];
                } else {
                    pointsInstance.activeUniformTweens = [];
                }

                // 2. DEFINE TARGET OR FOLLOWER logic
                if (maskBounds && maskBounds.useBoard) {
                    const boardEl = document.getElementById('board');

                    pointsInstance.maskFollowTween = new TWEEN.Tween({ t: 0 })
                        .to({ t: 1 }, morphDur)
                        .easing(TWEEN.Easing.Cubic.InOut)
                        .onUpdate((obj) => {
                            if (boardEl && uScale.value > 0.001) {
                                const b = boardEl.getBoundingClientRect();

                                const bWidthVh = b.width / vh;
                                const bHeightVh = b.height / vh;
                                const bLeftVh = b.left / vh;
                                const bTopVh = b.top / vh;

                                const rectWidthVh = bWidthVh + mLeft_vh + mRight_vh;
                                const rectHeightVh = bHeightVh + mTop_vh + mBottom_vh;
                                const rectLeftVh = bLeftVh - mLeft_vh;
                                const rectTopVh = bTopVh - mTop_vh;

                                const centerXVh = rectLeftVh + (rectWidthVh / 2.0);
                                const centerYVh = 100.0 - (rectTopVh + (rectHeightVh / 2.0)); // bottom-up WebGL space

                                uRect.value.set(
                                    centerXVh * vh,
                                    centerYVh * vh,
                                    (rectWidthVh / 2.0) * vh,
                                    (rectHeightVh / 2.0) * vh
                                );
                            }
                        })
                        .start();

                    pointsInstance.activeUniformTweens.push(pointsInstance.maskFollowTween);
                }

                // 3. TWEEN SCALE (Standard)
                const scaleTween = new TWEEN.Tween(uScale)
                    .to({ value: targetMaskScale }, morphDur)
                    .easing(TWEEN.Easing.Cubic.InOut)
                    .start();

                pointsInstance.activeUniformTweens.push(scaleTween);
            }

            // C. TEST BOARD SYNC (TWEEN Position)
            const boardEl = document.getElementById('board');
            if (boardEl) {
                // RESTORE DISPLAY: Ensure board is visible before tweening opacity
                boardEl.style.display = 'flex';

                const stepKeys = ['chaos', 'root', 'dance', 'walk'];
                const layout = BOARD_LAYOUT_CONFIG[stepKeys[step]] || BOARD_LAYOUT_CONFIG.chaos;

                // Apply Mode immediately for styling resets
                if (layout.mode) {
                    boardEl.classList.forEach(cls => { if (cls.startsWith('mode-')) boardEl.classList.remove(cls); });
                    boardEl.classList.add(layout.mode);
                }

                // Kill existing board tween to prevent jump
                if (pointsInstance.boardPosTween) pointsInstance.boardPosTween.stop();

                const boardAnimDur = morphDur * 0.5;
                const vh = window.innerHeight / 100;
                const rect = boardEl.getBoundingClientRect();

                const isTopAnchored = (layout.top !== undefined && layout.top !== 0);
                const startVal = isTopAnchored
                    ? (rect.top / vh)
                    : ((window.innerHeight - rect.bottom) / vh);

                const startOp = boardEl.style.opacity === "" ? 0 : parseFloat(boardEl.style.opacity);

                pointsInstance.boardPosTween = new TWEEN.Tween({ val: startVal, op: startOp })
                    .to({ val: isTopAnchored ? layout.top : layout.bottom, op: 1.0 }, boardAnimDur)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .onUpdate((obj) => {
                        boardEl.style.opacity = obj.op;
                        if (isTopAnchored) {
                            boardEl.style.top = obj.val + 'vh';
                            boardEl.style.bottom = 'auto';
                        } else {
                            boardEl.style.bottom = obj.val + 'vh';
                            boardEl.style.top = 'auto';
                        }
                    })
                    .start();

                // 2. BOARD TEXT SIZE TWEEN
                if (pointsInstance.boardScaleTween) pointsInstance.boardScaleTween.stop();

                // We need a way to track the current scale on the element or points instance
                const startScale = pointsInstance._lastBoardScale ?? 1.0;
                const startSub = pointsInstance._lastSubProgress ?? 1.0;
                window.__boardScale = startScale;
                window.__boardSubProgress = startSub;

                pointsInstance.boardScaleTween = new TWEEN.Tween({ scale: startScale, sub: startSub })
                    .to({ scale: layout.scale, sub: layout.subVisible ? 1.0 : 0.0 }, boardAnimDur)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .onUpdate((obj) => {
                        window.__boardScale = obj.scale;
                        window.__boardSubProgress = obj.sub;
                        fitBoardTexts(obj.scale, obj.sub);
                    })
                    .onComplete(() => {
                        pointsInstance._lastBoardScale = layout.scale;
                        pointsInstance._lastSubProgress = layout.subVisible ? 1.0 : 0.0;
                        window.__boardScale = layout.scale;
                        window.__boardSubProgress = pointsInstance._lastSubProgress;
                        fitBoardTexts(layout.scale, pointsInstance._lastSubProgress);
                    })
                    .start();

                // BOARD CONTENT SCRAMBLE
                if (config.ui.board) {
                    const nSub = boardEl.querySelector('.intro-sub');
                    const n1 = boardEl.querySelector('.intro-main-name1');
                    const n2 = boardEl.querySelector('.intro-main-name2');
                    const pSub = boardEl.querySelector('.board-philo-sub');
                    const philo = boardEl.querySelector('.board-philo-main');
                    const f1 = boardEl.querySelector('#board-feat-1');
                    const f2 = boardEl.querySelector('#board-feat-2');

                    if (nSub && config.ui.board.nameSub) scrambleElementText(nSub, config.ui.board.nameSub, boardAnimDur, nSub.innerText);
                    if (n1) scrambleElementText(n1, config.ui.board.name1, boardAnimDur, n1.innerText);
                    if (n2) scrambleElementText(n2, config.ui.board.name2, boardAnimDur, n2.innerText);
                    if (pSub && config.ui.board.philoSub) scrambleElementText(pSub, config.ui.board.philoSub, boardAnimDur, pSub.innerText);
                    if (philo && config.ui.board.philo) scrambleElementText(philo, config.ui.board.philo, boardAnimDur, philo.innerText);
                    if (f1 && config.ui.board.feat1) scrambleElementText(f1, config.ui.board.feat1, boardAnimDur, f1.innerText);
                    if (f2 && config.ui.board.feat2) scrambleElementText(f2, config.ui.board.feat2, boardAnimDur, f2.innerText);
                }
            }
        }
    };

    const scrambleElementText = (el, targetText, duration = 800, startText = "") => {
        if (!el || (el.innerText === targetText && startText === targetText)) return;

        const initialText = startText || el.innerText || "";

        // Stop existing
        if (el._scrambleRAId) cancelAnimationFrame(el._scrambleRAId);

        // STABILIZATION: Pre-calculate start and end widths to avoid jitter
        const font = getComputedStyle(el).fontFamily;
        const startW = getTextWidth(initialText, `20px ${font}`);
        const targetW = getTextWidth(targetText, `20px ${font}`);

        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*";
        const startTime = performance.now();

        const render = (time) => {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1.0);

            // Stabilize the width for fitBoardTexts during the transition
            el._stableWidth = startW + (targetW - startW) * progress;

            // Lerp length for smoother container expansion
            const currentLen = Math.round(initialText.length + (targetText.length - initialText.length) * progress);

            let result = "";
            for (let i = 0; i < currentLen; i++) {
                // Character reveal threshold (reveals left to right)
                const revealThreshold = i / currentLen;

                // If progress is past the reveal threshold for this char index
                if (progress > revealThreshold) {
                    // If we are at the very end of reveal for this char, show target
                    // otherwise flick random
                    if (progress > revealThreshold + 0.1 || progress === 1.0) {
                        result += targetText[i] || "";
                    } else {
                        result += chars[Math.floor(Math.random() * chars.length)];
                    }
                } else {
                    // Before reveal: show initial char or random
                    // If it's the very start, prefer initialText char for "start from these text" feel
                    if (progress < (revealThreshold * 0.5) && i < initialText.length) {
                        result += initialText[i];
                    } else {
                        result += chars[Math.floor(Math.random() * chars.length)];
                    }
                }
            }
            el.innerText = result;

            // Force a re-layout of the board text during the scramble
            if (typeof window.fitBoardTexts === 'function') {
                window.fitBoardTexts(window.__boardScale || 1.0, window.__boardSubProgress ?? 1.0);
            }

            if (progress < 1.0) {
                el._scrambleRAId = requestAnimationFrame(render);
            } else {
                el._scrambleRAId = null;
                el._stableWidth = null; // Cleanup
                // Final fit without stabilization to nail the last frame perfectly
                if (typeof window.fitBoardTexts === 'function') {
                    window.fitBoardTexts(window.__boardScale || 1.0, window.__boardSubProgress ?? 1.0);
                }
            }
        };
        el._scrambleRAId = requestAnimationFrame(render);
    };


    // -------------------------------------------------------------------------
    // GSAP Observer Implementation
    // -------------------------------------------------------------------------

    // We create the observer but maybe we shouldn't ENABLE it immediately if we want to allow normal Scroll?
    // Requirement: "Onloading: show the loading div... once complete, navigated to section about... LOCKED"
    // So we invoke lock logic when needed. for now, assuming page loads -> About -> Locked.

    const observer = Observer.create({
        target: window, // Listen to window to ensure we catch events
        type: "wheel,touch", // Enable touch for mobile/iPad
        // preventDefault: true, // REMOVED: Must allow CV to scroll! 
        // CSS (overflow: hidden on body) handles the "lock" for the main page.
        onDown: () => handleScrollInput(1),
        onUp: () => handleScrollInput(-1),
        tolerance: 10,
        dragMinimum: 10
    });

    // Explicitly START enabled
    observer.enable();


    // -------------------------------------------------------------------------
    // Helper: Toggle Morph Status Indicator (System Bottom Frame) -> REMOVED
    // -------------------------------------------------------------------------

    const handleScrollInput = (direction) => {
        if (!isScrollLocked) return;

        // GUARD: Only trigger if mouse is over the Experience Container (Left Pane)
        const expContainer = document.getElementById('experience-container');
        if (expContainer && !expContainer.matches(':hover')) return;

        // GUARD: Only allow scroll-morph if HUD is open (tracked via isOpen property)
        if (scene && scene.HUD && scene.HUD.isOpen === false) return;

        const now = Date.now();
        let isCurrentlyMorphing = pointsInstance.isMorphing;

        // Determine potential next step
        let nextStep = currentStep;
        if (direction > 0) { // Scroll Down
            nextStep = Math.min(currentStep + 1, MAX_STEPS);

            // SPECIAL: If we are already at MAX_STEPS and scroll DOWN, 
            // we want to allow re-triggering the Step 3 action (e.g. after a reverse)
            if (currentStep === MAX_STEPS && !isStep3Sitting) {
                const config = SCROLL_STEP_CONFIG[MAX_STEPS];
                if (config && config.action) {
                    // Update cooldown to prevent scroll-spamming resets
                    lastMorphTime = now;
                    config.action(pointsInstance);
                }
            }
        } else { // Scroll Up
            nextStep = Math.max(currentStep - 1, 0);
        }

        // COOLDOWN & DEBOUNCE LOGIC
        const DEBOUNCE = 500; // Increased from 50ms to prevent accidental "triple-ticks" on smooth wheels
        // Determine intended morph target for the potential next step
        const nextConfig = SCROLL_STEP_CONFIG[nextStep];
        const nextTargetIndex = (nextConfig && nextConfig.targetIndex !== undefined) ? (typeof nextConfig.targetIndex === 'function' ? nextConfig.targetIndex() : nextConfig.targetIndex) : nextStep;

        isCurrentlyMorphing = pointsInstance.isMorphing;
        const morphOrigin = pointsInstance.morphOriginIndex;
        const morphTarget = pointsInstance.morphRequestedTarget;

        const isReversalInProgress = (nextStep === pointsInstance.morphOriginStep && isCurrentlyMorphing);
        const isPivotBackToTarget = (nextStep === pointsInstance.morphTargetStep && isCurrentlyMorphing && pointsInstance.isReversing);

        const canBypassMorphGuard = isReversalInProgress || isPivotBackToTarget;

        if (canBypassMorphGuard) {
            // Reversals or pivoting back to target bypasses all guards
        } else if (isCurrentlyMorphing || (now - lastMorphTime < DEBOUNCE)) {
            return;
        }

        // Check if the target step allows scrolling back
        if (direction < 0) { // Only apply this check for scrolling UP
            const currentConfig = SCROLL_STEP_CONFIG[currentStep];
            if (currentConfig && currentConfig.allowsScrollBack === false) {
                return; // Blocked
            }
        }

        if (nextStep !== currentStep) {
            currentStep = nextStep;
            lastMorphTime = now;

            // Visual feedback
            document.body.classList.add('morph-active');

            // Callback when the 3D engine is DONE
            const onFinish = () => {
                // Important: Double check if a new morph hasn't already started
                if (!pointsInstance.isMorphing) {
                    document.body.classList.remove('morph-active');
                    // Reset progress bar CSS variable -> REMOVED to allow fade out at 100%
                    // document.documentElement.style.setProperty('--morph-progress', '0%');
                }
            };

            executeStep(currentStep, onFinish);
        }
    };


    // -------------------------------------------------------------------------
    // EXPOSED CONTROL: setScrollLock
    // -------------------------------------------------------------------------
    // This function will be called from scenarioUtility.js to UNLOCK the page
    pointsInstance.setScrollLock = (locked) => {
        isScrollLocked = locked;

        const expContainer = document.getElementById('experience-container');

        // FORCE PERMANENT HUB LOCK: Experience container never scrolls natives sections now.
        document.body.style.overflow = 'hidden';
        if (expContainer) {
            expContainer.style.overflow = 'hidden';
            expContainer.scrollTo(0, 0);
        }
        const mainWrapper = document.getElementById('app-container');
        if (mainWrapper) mainWrapper.style.height = '100%';

        if (locked) {
            observer.enable();
            updateHUDRightProgressBar(0);

            // Force browser to act as if we are at top (for the main window)
            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
            }
            window.scrollTo(0, 0);

        } else {
            // Even when "unlocked" from the Morph flow, we stay hidden inside the 3D pane
            observer.disable();
        }
    };

    // -------------------------------------------------------------------------
    // REVERSE TRANSITION: Room -> Points Step 3
    // -------------------------------------------------------------------------
    const reverseToPointsStep3 = async (tweenDuration = 3000) => {
        const camera = scene.camera;
        const controls = scene.orbitControls;
        const uniforms = pointsInstance.material.uniforms;

        // 1. Target Values (Identity Core / Step 2 focus state)
        // Values from points.js _addMorphDataByModelName(SCENE_OBJECTS.CHAR)
        const targetCamPos = { x: 61.56, y: 2.97, z: 30 };
        const targetOrbit = { x: 0, y: 0, z: 0 };

        const targetUniScale = 0.25;
        const targetUniRot = { x: Math.PI / 2, y: -1.15, z: 0 };
        const targetUniOffset = { x: 0.4, y: -0.8 };
        const targetUniPos = { x: 0, y: 0, z: 0 };
        const targetUniLightBoost = 0.5;
        const targetUniPixelRatio = 2.0;

        // 2. Start Values (Current Desk State)
        const startCamPos = camera.position.clone();
        const startOrbit = controls.target.clone();

        const startUniScale = uniforms.uModelScale.value;
        const startUniRot = uniforms.uModelRotation.value.clone();
        const startUniOffset = uniforms.uModelScreenOffset.value.clone();
        const startUniPos = uniforms.uModelPosition.value.clone();
        const startUniLightBoost = uniforms.uLightSizeBoost.value;
        const startUniPixelRatio = uniforms.uPixelRatio.value;

        // 3. Trigger Scene Disassembly
        if (scene) scene.isTransitioning = true;
        SU.disassembleRoom(scene, tweenDuration);

        // 4. HUD RESET & UNHIDE
        if (scene.HUD) {
            if (scene.HUD.resetBarPhysics) scene.HUD.resetBarPhysics();
            scene.HUD.runTweenShowIsland(3000);
            scene.HUD.runTweenShowDecos(3000);
            scene.HUD.runTweenShowRNotch(3000);
        }

        // 5. MAIN REVERSE TWEEN
        const progress = { t: 0 };
        new TWEEN.Tween(progress)
            .to({ t: 1 }, tweenDuration)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate((obj) => {
                const alpha = obj.t;

                camera.position.lerpVectors(startCamPos, targetCamPos, alpha);
                controls.target.lerpVectors(startOrbit, targetOrbit, alpha);
                camera.lookAt(controls.target); // Force look at target during transition

                uniforms.uModelScale.value = startUniScale + (targetUniScale - startUniScale) * alpha;
                uniforms.uModelRotation.value.lerpVectors(startUniRot, targetUniRot, alpha);
                uniforms.uModelScreenOffset.value.lerpVectors(startUniOffset, targetUniOffset, alpha);
                uniforms.uModelPosition.value.lerpVectors(startUniPos, targetUniPos, alpha);
                uniforms.uLightSizeBoost.value = startUniLightBoost + (targetUniLightBoost - startUniLightBoost) * alpha;
                uniforms.uPixelRatio.value = startUniPixelRatio + (targetUniPixelRatio - startUniPixelRatio) * alpha;

                // Sync HUD Progress Bars
                updateHUDProgressBar(1.0 - alpha, 1.0);
                updateHUDRightProgressBar(1.0);
            })
            .onComplete(() => {
                // Restore interaction state
                if (scene) scene.isTransitioning = false;
                if (pointsInstance.beamTimeout) clearTimeout(pointsInstance.beamTimeout);
                if (step3Timeout) clearTimeout(step3Timeout);

                isStep3Sitting = false;

                // Logic: We have visually returned to the "Dance/Points" state (Step 2 equivalent)
                currentStep = 2;
                pointsInstance.previousStep = 3;

                // Play animation defined in SCROLL_STEP_CONFIG Step 3
                // BUT: We ONLY want the waving, NOT the auto-trigger walk-sit sequence.
                pointsInstance.playAnimation('gangnam', 0.5, true);

                // Unlock scroll
                pointsInstance.setScrollLock(true);

                // Logic: Hand-off back to Maximizer
                // Resetting this.lastStep in maximizer will trigger the Clarity Mode return
                if (scene.maximizer) scene.maximizer.lastStep = -1;

                console.log("🔙 Reversed to Points Step 2 -> Auto Trigger Root");

                // USER REQUEST: Fast reverse automatically to Step 1 (Root)
                setTimeout(() => {
                    if (pointsInstance.triggerStep) {
                        pointsInstance.triggerStep(1);
                    }
                }, 500);
            })
            .start();
    };

    pointsInstance.triggerReverseTransition = () => {
        // Only allow if we are in the Room state (Step 3 complete)
        if (currentStep === 3) {
            reverseToPointsStep3(1000);
        }
    };

    // Initialize lock state
    pointsInstance.setScrollLock(true);

    // Cleanup
    return () => {
        observer.kill();
    };
}


