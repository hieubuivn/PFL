import * as THREE from 'three';
import TWEEN from 'tween';
import RAPIER from 'rapier-compat';
import { personaManager } from '../content-manager/personaManager.js';
import { playOneShotAnimation } from '../utils/animationManager.js';
import { watchApex, startKinematicReturn } from '../utils/physicsUtils.js';
import { PERSONA_IDS, GLOBAL_COLORS } from '../configs/sceneConfig.js';
import * as B64 from '../utils/base64Strings.js';
import * as RAYCAST from '../raycast/addRaycaster.js';
import { revertAssembleRoom, shootDroneBeam } from '../scenario/scenarioUtility.js';
import { getDynamicText } from '../utils/contentUtils.js';
import { updateSubtitle } from '../utils/status.js';
import { initNarrativeShader, startNarrativeShader, stopNarrativeShader } from '../shaders/narrativeShader.js';

/**
 * Registry of UI elements and their associated interaction logic.
 * Format: { selector, event, action, options }
 */
const UI_REGISTRY = [
    // 1. Persona Switch Toggle (General Popup)
    {
        selector: '#persona-switch-btn',
        event: 'click',
        action: (e, scene) => {
            e.stopPropagation();
            personaManager.togglePersonaPanel();
        }
    },
    // 2. Header Photo (Toggle Persona + Special Room Effects)
    {
        selector: '.header-photo',
        event: 'click',
        action: (e, scene) => handleHeroAvatarTransition(scene, true)
    },
    // 2b. Name Class (Interactions across states)
    {
        selector: '.name',
        event: 'mouseenter',
        action: (e, scene) => handleNameHover(scene, true)
    },
    {
        selector: '.name',
        event: 'mouseleave',
        action: (e, scene) => handleNameHover(scene, false)
    },
    {
        selector: '.name',
        event: 'click',
        action: (e, scene) => {
            if (scene.scenarioState?.name === 'room') {
                handleHeroAvatarTransition(scene, false);
            } else {
                handleNameClick(scene);
            }
        }
    },
    // 3. Selection Boxes (Popup Panel)
    {
        selector: '.choice-box',
        event: 'click',
        action: (e, scene, el) => {
            const mode = el.getAttribute('data-mode');
            if (mode) personaManager.setPersona(mode);
        }
    },
    // 4. Mode Selection (Optional Header Switchers)
    {
        selector: '#cv-mode-selector .mode-option',
        event: 'click',
        action: (e, scene, el) => {
            const mode = el.getAttribute('data-mode');
            if (mode) personaManager.setPersona(mode);
        }
    },
    // 5. Navigation Items
    {
        selector: '.nav-item',
        event: 'click',
        action: (e, scene, el) => {
            const targetId = el.getAttribute('data-target');

            // Handle 'Active' class for ALL nav items consistently
            document.querySelectorAll('.nav-modules .nav-item').forEach(btn => btn.classList.remove('active'));
            el.classList.add('active');

            // If in room state, revert to points state
            if (targetId === 'cv-header' && scene.scenarioState?.name === 'room') {
                if (!scene.isTransitioning) revertAssembleRoom(scene);
                return; // Revert handles its own scrolling/UI state
            }

            // Normal scroll behavior within the CV scroller
            const targetEl = document.getElementById(targetId);
            const scroller = document.getElementById('cv-scroller');
            if (targetEl && scroller) {
                scroller.scrollTo({
                    bottom: 0, // Fallback for header top
                    top: targetEl.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    },
    // 5b. HUD Navigation - ABOUT (Sync with Room Reversal)
    {
        selector: '#hud-nav-btn-3',
        event: 'click',
        action: (e, scene) => {
            // Priority 1: Update Top Nav Active State
            const topAboutBtn = document.querySelector('.nav-modules .nav-item[data-target="cv-header"]');
            if (topAboutBtn) {
                document.querySelectorAll('.nav-modules .nav-item').forEach(btn => btn.classList.remove('active'));
                topAboutBtn.classList.add('active');
            }

            // Priority 2: Trigger Scenario Revert
            if (scene.scenarioState?.name === 'room' && !scene.isTransitioning) {
                RAYCAST.hideInformer(scene);
                revertAssembleRoom(scene);
            }
        }
    },
    // 5c. HUD Navigation - LAB Only (Trigger Room Assembly from Points)
    {
        selector: '#hud-nav-btn-2',
        event: 'click',
        action: (e, scene) => {
            // If in points state, advance to Step 3 (Wave + Walk + Assemble)
            if (scene.scenarioState?.name === 'points' && !scene.isTransitioning) {
                RAYCAST.hideInformer(scene);
                if (scene.pointsApp && typeof scene.pointsApp.triggerStep === 'function') {
                    scene.pointsApp.triggerStep(3);

                    // Priority: Update Top Nav Active State
                    const topBtn = document.querySelector(`.nav-modules .nav-item[data-target="LAB"]`)
                        || document.querySelector(`.nav-modules .nav-item[data-target="cv-header"]`); // Fallback

                    if (topBtn) {
                        document.querySelectorAll('.nav-modules .nav-item').forEach(btn => btn.classList.remove('active'));
                        topBtn.classList.add('active');
                    }
                }
            }
        }
    },
    // 5d. HUD Navigation - WORK (Experience Modal)
    {
        selector: '#hud-nav-btn-1',
        event: 'click',
        action: async (e, scene) => {
            if (scene.isTransitioning) return;

            // 0. CLEANUP: Hide any active tooltips immediately
            RAYCAST.hideInformer(scene);

            // 1. Close HUD Frame FASTER (1s) AND Scroll CV simultaneously
            if (scene.HUD && typeof scene.HUD.runTweenClose === "function") {
                scene.HUD.runTweenClose(1000); 
            }
            scrollToCVSection('cv-work-header');

            // 2. Hide cluttered UI elements for a clean backdrop during panel slide
            const board = document.getElementById('board');
            const backdrop = document.querySelector('.three-js-backdrop');
            if (board) board.style.transition = 'opacity 0.4s';
            if (board) board.style.opacity = '0';
            if (backdrop) backdrop.style.transition = 'opacity 0.4s';
            if (backdrop) backdrop.style.opacity = '0';

            // Wait for HUD closing animation (approx 1s)
            await new Promise(resolve => setTimeout(resolve, 1100));

            // 3. Slide CV Panel away (Sequential Step)
            // Note: We use the normal transition speed (0.35s) here for a crisp slide
            const cvContainer = document.getElementById('cv-container');
            if (cvContainer) cvContainer.classList.remove('slow-transition'); 
            handleCVToggle(scene, null, true);

            // Wait for CV slide (0.35s)
            await new Promise(resolve => setTimeout(resolve, 400));

            // 4. Show Work Modal
            const modal = document.getElementById('work-experience-modal');
            if (modal) {
                modal.style.display = 'flex';
                // PERFORMANCE FIX: Disable raycasting to prevent "leaks" through the modal overlay
                if (scene) scene.raycasterEnabled = false;
                startNarrativeShader();
            }
        }
    },
    // 5e. WORK Modal Close Button
    {
        selector: '#work-modal-close-btn',
        event: 'click',
        action: (e, scene) => handleWorkModalClose(scene)
    },
    // 7. CV Export Button & Contact Links (Trigger Dance in Room)
    {
        selector: '#cv-export-btn, #modal-cv-export-btn',
        event: 'click',
        action: (e, scene) => {
            const link = document.createElement('a');
            const base = (import.meta.env && import.meta.env.BASE_URL) || './';
            link.href = `${base}cvs/Bui_Quoc_Hieu_CV_Portable.pdf`.replace('//', '/');
            link.download = 'Bui_Quoc_Hieu_CV_Portable.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            if (scene.scenarioState?.name === 'room') {
                triggerHeroDance(scene);
            }
        }
    },
    // 7b. CV View Online Button
    {
        selector: '#cv-view-btn',
        event: 'click',
        action: (e, scene) => {
            const base = (import.meta.env && import.meta.env.BASE_URL) || './';
            const url = `${base}cvs/`.replace('//', '/');
            window.open(url, '_blank');
        }
    },
    // 5f. WORK Modal Backdrop (Close on click outside)
    {
        selector: '#work-experience-modal',
        event: 'click',
        action: (e, scene) => {
            // Close if clicking the backdrop container OR the explicit .modal-backdrop div
            if (e.target.id === 'work-experience-modal' || e.target.classList.contains('modal-backdrop')) {
                handleWorkModalClose(scene);
            }
        }
    },
    // 8. CV Toggle Button (Advanced Interactions)
    {
        selector: '#cv-toggle-btn',
        event: 'click',
        action: (e, scene, el) => handleCVToggle(scene, el)
    },
    {
        selector: '#cv-toggle-btn',
        event: 'mouseenter',
        action: (e, scene) => handleCVHover(scene, true)
    },
    {
        selector: '#cv-toggle-btn',
        event: 'mouseleave',
        action: (e, scene) => handleCVHover(scene, false)
    },
    // 9. Contact Buttons (Copy & Open)
    {
        selector: '.contact-btn-tiny',
        event: 'mouseenter',
        action: (e, scene, el) => handleContactHover(scene, el, true)
    },
    {
        selector: '.contact-btn-tiny',
        event: 'mouseleave',
        action: (e, scene, el) => handleContactHover(scene, el, false)
    },
    {
        selector: '.contact-btn-tiny',
        event: 'click',
        action: (e, scene, el) => handleContactClick(scene, el)
    }
];

/**
 * Initialize all UI Interactions
 */
export function initUIInteractions(scene) {
    registerUIElements(scene);
    initNarrativeShader();

    // Global testing keys
    window.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        
        if (key === 'g') {
            runHeroPersonaCinematic(scene);
        } else if (key === 'l') {
            // L => remove (collapse/close CV panel)
            handleCVToggle(scene, null, true);
        } else if (key === 'i' || key === 'd') {
            // Increase/Decrease width by 5% of parent
            const cvContainer = document.getElementById('cv-container');
            if (cvContainer) {
                const appContainer = document.getElementById('app-container');
                const parentWidth = appContainer ? appContainer.offsetWidth : window.innerWidth;
                const delta = parentWidth * 0.05;
                const currentWidth = cvContainer.offsetWidth;
                
                const newWidth = key === 'i' ? currentWidth + delta : currentWidth - delta;
                
                // Guard: 200px min, 90% max
                if (newWidth > 200 && newWidth < parentWidth * 0.9) {
                    cvContainer.style.width = `${newWidth}px`;
                    
                    // If currently collapsed, update position immediately
                    if (cvContainer.classList.contains('collapsed')) {
                        cvContainer.style.transform = `translateX(${newWidth}px)`;
                        cvContainer.style.marginRight = `-${newWidth}px`;
                        // Update current state memory for sync
                        if (cvContainer.userData) {
                            cvContainer.userData.x = newWidth;
                            cvContainer.userData.margin = -newWidth;
                        }
                    }
                }
                
                // Trigger resize event to update HUD markers/lines if they depend on CV width
                window.dispatchEvent(new Event('resize'));
            }
        }
    });

    // --- Subtitle System Bridge ---
    // Trigger golf ritual if user manually closes the subtitle popup in the room
    window.addEventListener('subtitleClose', (e) => {
        const isRoom = scene.scenarioState?.name === 'room';
        const isReady = !scene.isHeroAnimating && !scene.isTransitioning;
        
        if (e.detail?.manual && isRoom && isReady) {
            runHeroPersonaCinematic(scene);
        }
    });
}

/**
 * Update Top Nav Active State (e.g., during Reversal)
 */
export function onHudOpen(scene) {
    const topAboutBtn = document.querySelector('.nav-modules .nav-item[data-target="cv-header"]');
    if (topAboutBtn) {
        document.querySelectorAll('.nav-modules .nav-item').forEach(btn => btn.classList.remove('active'));
        topAboutBtn.classList.add('active');
    }
}

// ============================================================================
// REGISTRATION ENGINE (HYBRID DELEGATION)
// ============================================================================

/**
 * Delegated click handler for better performance (one listener for all clicks)
 */
function delegatedClickHandler(e, scene) {
    // 1. Iterate through click-based registry items
    const clickRegistry = UI_REGISTRY.filter(reg => reg.event === 'click');

    for (const reg of clickRegistry) {
        // 2. Check if the click target or any parent matches the selector
        const targetElement = e.target.closest(reg.selector);
        
        if (targetElement) {
            // Found a match - execute the action with the relevant element
            // We pass targetElement as the 3rd argument because e.currentTarget 
            // points to document.body in delegated listeners.
            reg.action(e, scene, targetElement);
            return; // Only execute the first match discovered (stop bubble simulation)
        }
    }
}

function registerUIElements(scene) {
    // A. DELEGATED CLICKS: One listener for the entire page
    document.body.addEventListener('click', (e) => delegatedClickHandler(e, scene));

    // B. DIRECT ATTACHMENTS: Only for non-bubbling events (mouseenter, mouseleave)
    UI_REGISTRY.forEach(reg => {
        // Filter: only direct listeners for hovers
        if (reg.event !== 'click') {
            const elements = document.querySelectorAll(reg.selector);
            elements.forEach(el => {
                el.addEventListener(reg.event, (e) => reg.action(e, scene, el));
            });
        }
        
        // Ensure buttons still have the pointer cursor even if delegated
        if (reg.event === 'click') {
            const elements = document.querySelectorAll(reg.selector);
            elements.forEach(el => {
                if (el.tagName !== 'A') el.style.cursor = 'pointer';
            });
        }
    });
}

// ============================================================================
// HELPER FUNCTIONS (Interaction Logic)
// ============================================================================

/**
 * Slide Hero and Stool to combat (or original) positions
 */
const slideCombatPosition = (scene, targetPos = null) => {
    const hero = scene.getObjectByName('a-char');
    const stool = scene.getObjectByName('stool');
    const stoolBound = scene.getObjectByName('stool_bound');
    if (!hero || !stoolBound) return Promise.resolve();

    // Capture Original State
    if (hero.userData.origPos === undefined) hero.userData.origPos = hero.position.clone();
    if (stool && stool.userData.origPos === undefined) stool.userData.origPos = stool.position.clone();

    if (stoolBound.rapierBody && stoolBound.userData.origTranslation === undefined) {
        const t = stoolBound.rapierBody.translation();
        stoolBound.userData.origTranslation = { x: t.x, y: t.y, z: t.z };
        // Calculate stool offset relative to hero
        hero.userData.stoolOffset = {
            x: t.x - hero.userData.origPos.x,
            y: t.y - hero.userData.origPos.y,
            z: t.z - hero.userData.origPos.z
        };
    }

    const duration = 1500;
    const easing = TWEEN.Easing.Cubic.InOut;
    const hTarget = targetPos || hero.userData.origPos;
    const sTarget = {
        x: hTarget.x + (hero.userData.stoolOffset?.x || 0),
        y: hTarget.y + (hero.userData.stoolOffset?.y || 0),
        z: hTarget.z + (hero.userData.stoolOffset?.z || 0)
    };

    return new Promise((resolve) => {
        // 1. Slide Hero (Visual)
        new TWEEN.Tween(hero.position)
            .to({ x: hTarget.x, y: hTarget.y, z: hTarget.z }, duration)
            .easing(easing)
            .onComplete(resolve)
            .start();

        // 2. Slide Stool Visual (Mesh)
        if (stool) {
            new TWEEN.Tween(stool.position)
                .to({ x: sTarget.x, y: sTarget.y, z: sTarget.z }, duration)
                .easing(easing)
                .start();
        }

        // 3. Slide Stool Physics (Kinematic Body)
        if (stoolBound.rapierBody) {
            const cur = stoolBound.rapierBody.translation();
            const stoolTweenObj = { x: cur.x, y: cur.y, z: cur.z };
            new TWEEN.Tween(stoolTweenObj)
                .to(sTarget, duration)
                .easing(easing)
                .onUpdate(() => {
                    stoolBound.rapierBody.setNextKinematicTranslation(stoolTweenObj);
                })
                .start();
        }
    });
};

/**
 * Pure Cinematic Persona Sequence
 * Handles only the visual and physical 'acting' layers:
 * 1. Badge flies to hand
 * 2. Hero performs golf swing
 * 3. Badge return to UI
 * 
 * @param {THREE.Scene} scene 
 * @param {Object} options - { onImpact: function, onComplete: function }
 */
export async function runHeroPersonaCinematic(scene, options = {}) {
    const { onImpact = null, onComplete = null } = options;
    const isRoom = scene.scenarioState && scene.scenarioState.name === 'room';

    if (!isRoom || scene.isHeroAnimating || !window.boneTracker) {
        console.warn("[Cinematic] Aborted: Context mismatch or active animation.");
        return;
    }

    const hero = scene.getObjectByName('a-char');
    const stool = scene.getObjectByName('stool_bound');
    if (!hero || !stool) return;

    scene.isHeroAnimating = true;
    scene.allowsResetting = false;

    // --- 1. FIND NEAREST HIT CANDIDATE ---
    const candidates = ['pokeball', 'pokeball2', 'questionCube'];
    let ball = null;
    let minDist = Infinity;

    candidates.forEach(name => {
        const obj = scene.getObjectByName(name);
        if (obj && obj.visible && obj.rapierBody) {
            const d = obj.position.distanceTo(hero.position);
            if (d < minDist) {
                minDist = d;
                ball = obj;
            }
        }
    });

    const getBestRitualTarget = () => {
        const isVisible = (el) => {
            if (!el) return false;
            const rect = el.getBoundingClientRect();
            return rect.top < window.innerHeight && rect.bottom > 0;
        };
        const personaBtn = document.querySelector('#persona-switch-btn');
        if (isVisible(personaBtn)) return personaBtn;
        const h2s = Array.from(document.querySelectorAll('h2'));
        const activeH2 = h2s.find(h => isVisible(h));
        if (activeH2) return activeH2;
        return document.querySelector('#cv-export-btn') || document.querySelector('#cv-header');
    };

    // --- 2. START RITUAL SEQUENCE ---
    // A. Visual Prep (Jitter if persona button)
    const personaBtn = document.querySelector('#persona-switch-btn');
    if (personaBtn) personaBtn.classList.add('persona-aggressive-jitter');

    // B. Shoot Drone Beam and Shift Candidate to Combat Position (Ritualized)
    if (ball && ball.rapierBody) {
        const body = ball.rapierBody;
        const targetPos = new THREE.Vector3(1, 1, -1.5);
        const targetQuat = new THREE.Quaternion(0, 0, 0, 1);
        const originalBodyType = body.bodyType();

        // 🛡️ Activate Sensor Mode: Fly through the world safely
        if (body.rapierCollider) body.rapierCollider.setSensor(true);
        
        // POP UP: Standard Physics Impulse
        const mass = body.mass();
        body.wakeUp();
        body.applyImpulse({ x: 0, y: 15.0 * mass, z: 0 }, true);

        // Calculate Hero Avoidance (Curve around the star)
        const spineObj = scene.getObjectByName('mixamorigSpine1');
        const heroPos = new THREE.Vector3();
        if (spineObj) spineObj.getWorldPosition(heroPos);
        else hero.getWorldPosition(heroPos);

        // DRONE SEQUENCE
        watchApex(body, () => {
            const beamName = `ritual-beam-${body.handle}`;
            const cyanColor = GLOBAL_COLORS.ELECTRIC_CYAN || 0x00ffff;
            const currentPos = body.translation(); // Use Rapier translation for Group center
            const beamPoint = new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z);

            // 1. Shoot Drone Beam
            shootDroneBeam(scene, "", "", beamPoint, beamName, true, cyanColor, true, Infinity, true);
            const activeBeam = scene.getObjectByName(beamName);

            // 2. Transmit to Combat Pos (Kinematic Return used for smooth shift)
            const travelDuration = 1000;
            const targetEndTime = performance.now() + travelDuration;

            startKinematicReturn(body, targetPos, targetQuat, targetEndTime, originalBodyType, () => {
                // onComplete: hide beam and release sensor
                if (activeBeam) {
                    activeBeam.visible = false;
                    if (activeBeam.activeRequestID) cancelAnimationFrame(activeBeam.activeRequestID);
                }
                
                // Final snap guard: force translation to match perfect hit position
                body.setTranslation(targetPos, true);
                body.setLinvel({ x: 0, y: 0, z: 0 }, true);
                body.setAngvel({ x: 0, y: 0, z: 0 }, true);

            }, (currentPoint, t) => {
                // onUpdate: follow the body with the beam
                if (activeBeam && activeBeam.visible) {
                    const drone = (scene.objectMap && scene.objectMap.get) ? scene.objectMap.get('drone') : scene.getObjectByName('drone');
                    if (drone) {
                        const eye = drone.getObjectByName('Sphere001_0');
                        if (eye) {
                            const startBeam = new THREE.Vector3();
                            eye.getWorldPosition(startBeam);
                            const dist = startBeam.distanceTo(currentPoint);
                            activeBeam.position.copy(startBeam);
                            activeBeam.lookAt(currentPoint);
                            activeBeam.children.forEach(child => {
                                child.scale.z = dist;
                            });
                        }
                    }
                }
            }, heroPos); // Avoid hero during the shift
        });
    }

    // C. Slide Hero to Combat Position (Absolute: 1, 0, 0.75)
    // D. Play Sit-to-Stand
    setTimeout(() => {
        playOneShotAnimation(scene, 'sitToStand', { speed: 1.2, autoReturn: false });
    }, 2000); // 2000ms delay to sync with slide (1500ms slide starts now)

    await slideCombatPosition(scene, { x: 1, y: 0, z: 0.75 });
    if (personaBtn) personaBtn.classList.remove('persona-aggressive-jitter');

    if (window.boneTracker) {
        const ritualTarget = getBestRitualTarget();

        // --- HIGHLIGHT TARGET IF H2 ---
        const isH2 = ritualTarget && ritualTarget.tagName === 'H2';
        if (isH2) {
            ritualTarget.style.outline = '2px solid var(--c-cyan)';
            ritualTarget.style.outlineOffset = '4px';
            ritualTarget.style.transition = 'outline 0.3s ease';
        }

        window.boneTracker.hasHitThisSwing = false;
        window.boneTracker.initTargetElement(ritualTarget);
        
        // Bone Tracker Calibration
        window.boneTracker.setOffset(0.05, 0.36, -0.05);
        window.boneTracker.setRotationOffset(-30, 0, 110);
        window.boneTracker.setScale(3.0);

        window.boneTracker.toggleTracking(() => {
            // ON ARRIVAL:
            // STAGE 1: The Swing
            playOneShotAnimation(scene, 'golfDrive', {
                speed: 0.7,
                autoReturn: false, // Don't return yet, we celebrate
                onComplete: () => {
                    // SWING COMPLETE: Return the 2D Element immediately
                    if (window.boneTracker && window.boneTracker.isActive) {
                        window.boneTracker.toggleTracking();
                    }

                    // STAGE 2: The Victory Clap (Celebrate!)
                    playOneShotAnimation(scene, 'standClap', {
                        speed: 1.0,
                        crossFadeDuration: 0.8,
                        onComplete: async () => {
                            // STAGE 3: Settle back
                            await new Promise(r => setTimeout(r, 500));

                            // SLIDE BACK
                            await slideCombatPosition(scene, null);

                            // RESET H2 HIGHLIGHT
                            if (isH2) {
                                ritualTarget.style.outline = '';
                                ritualTarget.style.outlineOffset = '';
                            }

                            scene.isHeroAnimating = false;
                            scene.allowsResetting = true;
                            if (onComplete) onComplete();
                        }
                    });
                }
            });

            // Impact trigger (for subtitles/drone)
            setTimeout(() => {
                if (onImpact) onImpact();
            }, 660);
        });
    }
}

// Expose to window for testing
if (typeof window !== 'undefined') {
    window.triggerRitual = (mode) => {
        runHeroPersonaCinematic(window.scene, {
            onImpact: () => {
                const targetMode = mode || (personaManager.currentMode === PERSONA_IDS.DEV ? PERSONA_IDS.POBA : PERSONA_IDS.DEV);
                personaManager.setPersona(targetMode);
            }
        });
    };
}

/**
 * Toggles persona and handles the special "Room State" animation sequence.
 * @param {boolean} switchPersona - Whether to toggle the actual persona mode
 */
async function handleHeroAvatarTransition(scene, switchPersona = true) {
    const isRoom = scene.scenarioState?.name === 'room';

    if (switchPersona) {
        const currentMode = personaManager.currentMode;
        const nextMode = currentMode === PERSONA_IDS.DEV ? PERSONA_IDS.POBA : PERSONA_IDS.DEV;

        // --- BRANCH A: Room Scenario Interaction (Ritualized) ---
        if (isRoom) {
            // SPAM GUARD: Only lock if the ritual/golf drive is actively playing
            if (scene.isHeroAnimating) {
                const alertIcon = (typeof B64 !== 'undefined' && B64.alert) ? B64.alert : null;
                RAYCAST.setInformerBg(scene, alertIcon, "CHANGING PROTOCOL...");
                if (scene._informerTimeout) clearTimeout(scene._informerTimeout);
                scene._informerTimeout = setTimeout(() => RAYCAST.hideInformer(scene), 1500);
                return;
            }

            // 1. Immediate UI Swap
            personaManager.setPersona(nextMode);

            // 2. Trigger Visual Ritual
            runHeroPersonaCinematic(scene, {
                onImpact: () => {
                    // --- IMPACT SYNC ---
                    const isPoba = nextMode === PERSONA_IDS.POBA;
                    const key = isPoba ? 'SYS_DRONE_SUBTITLES_POBA' : 'SYS_DRONE_SUBTITLES_DEV';
                    const newText = (typeof getDynamicText === 'function') ? getDynamicText(key) : "";

                    if (newText) {
                        updateSubtitle(newText);
                        shootDroneBeam(scene, null, newText);
                    }
                }
            });
            return;
        }

        // --- BRANCH B: Normal / Points Scenario (Continuous Swap) ---
        const pointsApp = scene.pointsApp;
        const isPointsScenario = scene.scenarioState && scene.scenarioState.name === 'points';
        const isChaos = pointsApp && typeof pointsApp.getCurrentStep === 'function' && pointsApp.getCurrentStep() === 0;

        if (isPointsScenario && isChaos) {
            personaManager.setPersona(nextMode, { skipPointsSync: true });
        } else {
            personaManager.setPersona(nextMode);
        }
    }
}

/**
 * Advanced Dance Interaction
 * Logic moved from test.js to be shared via UI.
 */
export function triggerHeroDance(scene) {
    if (scene.isHeroAnimating || (scene.allowsResetting === false) || (scene.scenarioState && scene.scenarioState.name !== 'room')) return;

    const stool = scene.getObjectByName('stool_bound');
    const hero = scene.getObjectByName('a-char');

    if (!stool || !hero) return;

    scene.isHeroAnimating = true;
    scene.allowsResetting = false;

    // --- Capture World State ---
    const stoolStartPos = new THREE.Vector3();
    const stoolStartRot = new THREE.Quaternion();
    stool.getWorldPosition(stoolStartPos);
    stool.getWorldQuaternion(stoolStartRot);

    const heroStartLocalX = hero.position.x;
    const heroStartLocalY = hero.position.y;
    const heroStartLocalZ = hero.position.z;

    // --- Select Random Dance from Available Pool ---
    const dancePool = [
        { name: 'gangnam', moveOffset: new THREE.Vector3(5, 0, 0), returnSpeed: 1.0, returnDuration: 440, isRobot: false },
        { name: 'breakDance', moveOffset: new THREE.Vector3(3, 0, -2), returnSpeed: 1.2, returnDuration: 440, isRobot: false },
        { name: 'robotDance', moveOffset: new THREE.Vector3(1, 0, 0), returnSpeed: 1.0, returnDuration: 200, isRobot: true }
    ];

    const availableDances = dancePool.filter(d =>
        scene.heroClips?.some(c => c.name.toLowerCase() === d.name.toLowerCase())
    );

    if (availableDances.length === 0) return;

    // --- Weighted Selection Logic ---
    // Target: breakDance 50%, gangnam 25%, robotDance 25%
    const rand = Math.random();
    let chosen;
    if (rand < 0.5) chosen = availableDances.find(d => d.name === 'breakDance');
    else if (rand < 0.75) chosen = availableDances.find(d => d.name === 'gangnam');
    else chosen = availableDances.find(d => d.name === 'robotDance');

    // Safe fallback if our weighted choice isn't available for some reason
    if (!chosen) chosen = availableDances[Math.floor(Math.random() * availableDances.length)];

    const chosenClip = scene.heroClips.find(c => c.name.toLowerCase() === chosen.name.toLowerCase());

    let moveOffset = chosen.moveOffset;
    let returnDuration = chosen.returnDuration;
    let returnSpeed = chosen.returnSpeed;
    let isD2 = chosen.isRobot;

    const heroStartWorld = new THREE.Vector3();
    hero.getWorldPosition(heroStartWorld);
    const heroTargetWorld = heroStartWorld.clone().add(moveOffset);
    const heroTargetLocal = heroTargetWorld.clone();
    if (hero.parent) hero.parent.worldToLocal(heroTargetLocal);

    // --- 1. STOOL INTERACTION ---
    const stoolBody = stool.rapierBody;
    if (stoolBody) {
        stoolBody.setBodyType(RAPIER.RigidBodyType.Dynamic);
        stoolBody.wakeUp();

        const impulse = new THREE.Vector3(
            75 + Math.random() * 10,
            50 + Math.random() * 5,
            (Math.random() - 0.5) * 5
        );
        const torque = new THREE.Vector3(Math.random() * 2, Math.random() * 5, Math.random() * 2);

        stoolBody.applyImpulse({ x: impulse.x, y: impulse.y, z: impulse.z }, true);
        stoolBody.applyTorqueImpulse(torque, true);
    }

    // --- 2. HERO MOVEMENT ---
    new TWEEN.Tween(hero.position)
        .to({ x: heroTargetLocal.x, y: heroTargetLocal.y, z: heroTargetLocal.z }, 800)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    if (chosenClip) {
        playOneShotAnimation(scene, chosenClip.name, {
            idleClipName: isD2 ? 'typing' : 'walking',
            onComplete: () => walkBackAndReset()
        });
    }

    function walkBackAndReset() {
        if (!isD2) {
            let walkClipName = 'walking';


            playOneShotAnimation(scene, walkClipName, { idleClipName: 'typing', speed: returnSpeed });

            const startPos = hero.position.clone();
            const endPos = new THREE.Vector3(heroStartLocalX, heroStartLocalY, heroStartLocalZ);
            const progress = { t: 0 };

            new TWEEN.Tween(progress)
                .to({ t: 1 }, 1200)
                .easing(TWEEN.Easing.Linear.None)
                .onUpdate(() => {
                    let alpha = progress.t;
                    if (alpha < 0.2) {
                        alpha = Math.pow(alpha / 0.2, 3) * 0.05;
                    } else {
                        alpha = 0.05 + ((alpha - 0.2) / 0.8) * 0.95;
                    }
                    hero.position.lerpVectors(startPos, endPos, alpha);
                })
                .onComplete(() => {
                    playOneShotAnimation(scene, 'typing', { crossFadeDuration: 0.2 });
                    resetStool(500);
                    scene.isHeroAnimating = false;
                    scene.allowsResetting = true;
                })
                .start();
        } else {
            new TWEEN.Tween(hero.position)
                .to({ x: heroStartLocalX, y: heroStartLocalY, z: heroStartLocalZ }, returnDuration)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(() => {
                    scene.isHeroAnimating = false;
                    scene.allowsResetting = true;
                })
                .start();
            resetStool();
        }
    }

    function resetStool(duration = 1000) {
        if (!stoolBody) return;
        stoolBody.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased);
        stoolBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
        stoolBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
        stoolBody.wakeUp();

        const currentWorldPos = stoolBody.translation();
        const currentWorldRot = stoolBody.rotation();
        const proxy = { t: 0 };

        new TWEEN.Tween(proxy)
            .to({ t: 1 }, duration)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(() => {
                const lerpPos = new THREE.Vector3().lerpVectors(currentWorldPos, stoolStartPos, proxy.t);
                const lerpRot = new THREE.Quaternion().copy(currentWorldRot).slerp(stoolStartRot, proxy.t);
                stoolBody.setTranslation(lerpPos, true);
                stoolBody.setRotation(lerpRot, true);

                const localPos = lerpPos.clone();
                if (stool.parent) stool.parent.worldToLocal(localPos);
                stool.position.copy(localPos);

                const localRot = lerpRot.clone();
                if (stool.parent) {
                    const parentWorldQuat = new THREE.Quaternion();
                    stool.parent.getWorldQuaternion(parentWorldQuat);
                    stool.quaternion.copy(parentWorldQuat.invert().multiply(localRot));
                } else {
                    stool.quaternion.copy(localRot);
                }
            })
            .onComplete(() => {
                if (isD2 && scene.heroClips) {
                    playOneShotAnimation(scene, 'typing', { crossFadeDuration: 0.5 });
                }
            })
            .onStart(() => {
                if (scene.stoolGridUniforms) {
                    scene.stoolGridUniforms.uWorldGridActive.value = 1.0;
                    scene.stoolGridUniforms.uWorldGridProgress.value = 0.0;
                    new TWEEN.Tween(scene.stoolGridUniforms.uWorldGridProgress).to({ value: 1.0 }, 600).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
                        setTimeout(() => {
                            new TWEEN.Tween(scene.stoolGridUniforms.uWorldGridProgress).to({ value: 0.0 }, 500).onComplete(() => {
                                scene.stoolGridUniforms.uWorldGridActive.value = 0.0;
                            }).start();
                        }, 200);
                    }).start();
                }
            })
            .start();
    }
}

// ============================================================================
// IDENTITY INTERACTIONS (.name)
// ============================================================================

let nameHoverTween = null;
let nameVibTween = null;
let nameFOVTween = null;
let camBasePos = null;
let camBaseRot = null;
let camBaseFOV = null;

let nameHoverTimeout = null;
const NAME_HOVER_THRESHOLD = 400; // ms to prevent accidental swipes

/**
 * Handle Hover over .name elements ("Strategic Alignment")
 */
function handleNameHover(scene, isActive) {
    if (nameHoverTimeout) {
        clearTimeout(nameHoverTimeout);
        nameHoverTimeout = null;
    }

    if (isActive) {
        nameHoverTimeout = setTimeout(() => {
            triggerNameHoverInteraction(scene, true);
        }, NAME_HOVER_THRESHOLD);
    } else {
        triggerNameHoverInteraction(scene, false);
    }
}

/**
 * The actual animation logic for name hover
 */
function triggerNameHoverInteraction(scene, isActive) {
    const points = scene.pointsApp;
    if (!points || !points.material) return;

    // --- Tooltip & Shout (User Request) ---
    if (isActive) {
        RAYCAST.setInformerBg(scene, B64.punch, "The closer you look...");
        scene.conversationManager?.shout("...the less you see.");
    } else {
        RAYCAST.hideInformer(scene);
    }

    // 0. State-Specific Intensity (User Request: 0.3x in Dance state)
    const currentStep = points.getCurrentStep ? points.getCurrentStep() : 0;
    const intensityMult = currentStep === 2 ? 0.3 : 1.0;

    // 1. Perspective Switch Aware (Signal OrbitControl to pause its decay/logic)
    const camera = scene.camera;
    const controls = scene.orbitControls;
    if (controls) {
        if (isActive) {
            controls.isStrategicHover = true; // Lock OrbitControl
        }
    }

    // 2. Vibration "Resonance" Effect
    const uniforms = points.material.uniforms;
    if (nameVibTween) nameVibTween.stop();

    // Scale vibration boost by intensityMult
    const targetVib = isActive ? (0.8 + 2.7 * intensityMult) : 0.8;
    const duration = isActive ? 800 : 500;

    nameVibTween = new TWEEN.Tween(uniforms.uModelVibFactor)
        .to({ value: targetVib }, duration)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();

    // 3. Camera "Strategic Alignment" (Perspective Shift)
    if (!camera || !controls) return;

    // Capture baseline if not set
    if (!camBasePos) camBasePos = camera.position.clone();
    if (!camBaseRot) camBaseRot = camera.rotation.clone();
    if (camBaseFOV === null) camBaseFOV = camera.fov;

    if (nameHoverTween) nameHoverTween.stop();
    if (nameFOVTween) nameFOVTween.stop();

    // Target: Move closer and slightly above, leaning in (scaled by intensity)
    const posShift = new THREE.Vector3(1.8, 0.6, -1.8).multiplyScalar(intensityMult);
    const targetPos = isActive
        ? camBasePos.clone().add(posShift)
        : camBasePos.clone();

    // Zoom in (FOV change - scaled by intensity)
    const fovDiff = (camBaseFOV - 38) * intensityMult;
    const targetFOV = isActive ? (camBaseFOV - fovDiff) : camBaseFOV;

    nameHoverTween = new TWEEN.Tween(camera.position)
        .to({ x: targetPos.x, y: targetPos.y, z: targetPos.z }, duration)
        .easing(TWEEN.Easing.Cubic.Out)
        .onUpdate(() => {
            // Subtle rotation lerp for that "acknowledgment" tilt
            if (isActive) {
                const rotXShift = 0.05 * intensityMult;
                const rotYShift = 0.04 * intensityMult;
                camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, camBaseRot.x - rotXShift, 0.05);
                camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, camBaseRot.y + rotYShift, 0.05);
            }
        })
        .onComplete(() => {
            if (!isActive) {
                camBasePos = null;
                camBaseRot = null;
                camBaseFOV = null;
                if (controls) controls.isStrategicHover = false; // Unlock OrbitControl
            }
        })
        .start();

    nameFOVTween = new TWEEN.Tween(camera)
        .to({ fov: targetFOV }, duration)
        .easing(TWEEN.Easing.Cubic.Out)
        .onUpdate(() => {
            camera.updateProjectionMatrix();
        })
        .start();
}

/**
 * Handle Click on .name elements (State-Specific Effects)
 */
function handleNameClick(scene) {
    const pointsApp = scene.pointsApp;
    if (!pointsApp || !pointsApp.getCurrentStep) return;

    const currentStep = pointsApp.getCurrentStep();
    const uniforms = pointsApp.material.uniforms;

    switch (currentStep) {
        case 0: // CHAOS: Implosion/Explosion
            new TWEEN.Tween(uniforms.uModelScale)
                .to({ value: 0.0 }, 150)
                .easing(TWEEN.Easing.Exponential.In)
                .onComplete(() => {
                    new TWEEN.Tween(uniforms.uModelScale)
                        .to({ value: 1.2 }, 300)
                        .easing(TWEEN.Easing.Back.Out)
                        .onComplete(() => {
                            new TWEEN.Tween(uniforms.uModelScale)
                                .to({ value: 1.0 }, 400)
                                .easing(TWEEN.Easing.Quadratic.Out)
                                .start();
                        })
                        .start();
                })
                .start();
            break;

        case 1: // ROOT: Holographic Scan Wave
            if (scene.stoolGridUniforms) {
                scene.stoolGridUniforms.uWorldGridActive.value = 1.0;
                scene.stoolGridUniforms.uWorldGridProgress.value = 0.0;
                new TWEEN.Tween(scene.stoolGridUniforms.uWorldGridProgress)
                    .to({ value: 1.0 }, 800)
                    .easing(TWEEN.Easing.Cubic.Out)
                    .onComplete(() => {
                        scene.stoolGridUniforms.uWorldGridActive.value = 0.0;
                    })
                    .start();
            }
            break;

        case 2: // DANCE: Animation Cycle
            if (pointsApp.playNextDance) {
                pointsApp.playNextDance();
            }
            break;
    }
}
// ============================================================================
// CV INTERACTIONS
// ============================================================================

/**
 * Handle CV Panel Toggle (Click)
 * @param {boolean} forcedState true for collapsed, false for expand
 */
function handleCVToggle(scene, btn, forcedState) {
    const cvContainer = document.getElementById('cv-container');
    if (!cvContainer) return;

    // Track state to avoid overlapping tweens
    if (!cvContainer.userData) cvContainer.userData = {};
    const currentState = cvContainer.userData;

    let targetCollapsed;
    if (forcedState !== undefined) {
        targetCollapsed = forcedState;
    } else {
        targetCollapsed = !cvContainer.classList.contains('collapsed');
    }

    // Toggle base class for non-animation properties (pointer-events, etc.)
    if (targetCollapsed) {
        cvContainer.classList.add('collapsed');
    } else {
        cvContainer.classList.remove('collapsed');
    }

    document.body.classList.toggle('cv-collapsed', targetCollapsed);

    // Stop active tween before starting a new one
    if (currentState.tween) currentState.tween.stop();

    // Interaction Settings
    const isOpening = !targetCollapsed;
    const panelWidth = cvContainer.offsetWidth || 600;
    const targetX = targetCollapsed ? panelWidth : 0;
    const targetMargin = targetCollapsed ? -panelWidth : 0;
    
    // Initial values if not set
    if (currentState.x === undefined) currentState.x = targetCollapsed ? 0 : panelWidth;
    if (currentState.margin === undefined) currentState.margin = targetCollapsed ? 0 : -panelWidth;

    // Tween for a "subtle physical spring"
    currentState.tween = new TWEEN.Tween(currentState)
        .to({ x: targetX, margin: targetMargin }, 800)
        .easing(TWEEN.Easing.Back.Out)
        .onUpdate(() => {
            cvContainer.style.transform = `translateX(${currentState.x}px)`;
            cvContainer.style.marginRight = `${currentState.margin}px`;
        })
        .onComplete(() => {
            if (targetCollapsed) {
                cvContainer.style.opacity = '0';
            }
        })
        .onStart(() => {
            if (isOpening) {
                cvContainer.style.opacity = '1';
            }
        })
        .start();

    // Dispatch Event for HUD and Systems
    window.dispatchEvent(new CustomEvent('cvToggle', { detail: { collapsed: targetCollapsed } }));

    // Global HUD Feedback
    if (scene.HUD && typeof scene.HUD.breathe === 'function') {
        scene.HUD.breathe(GLOBAL_COLORS.ELECTRIC_CYAN);
    }

    // Informer Update (Text-only)
    // Only show if triggered by a physical interaction (btn is present)
    if (btn) {
        const text = targetCollapsed ? 'EXPAND CV PANEL' : 'COLLAPSE CV PANEL';
        RAYCAST.setInformerBg(scene, null, text, true);
    }
}

/**
 * Handle CV Button Hover (premium effects)
 */
function handleCVHover(scene, isActive) {
    if (isActive) {
        const cvContainer = document.getElementById('cv-container');
        const isCollapsed = cvContainer ? cvContainer.classList.contains('collapsed') : true;
        const text = isCollapsed ? 'EXPAND CV PANEL' : 'COLLAPSE CV PANEL';
        RAYCAST.setInformerBg(scene, null, text, true);

        if (scene.HUD && typeof scene.HUD.breathe === 'function') {
            scene.HUD.breathe(GLOBAL_COLORS.ELECTRIC_CYAN);
        }
    } else {
        RAYCAST.hideInformer(scene);
    }
}

/**
 * Handle Contact Button Hover
 */
function handleContactHover(scene, btn, isActive) {
    if (isActive) {
        const label = btn.getAttribute('data-label');
        const platform = btn.getAttribute('data-platform');
        const text = `COPY ${label.toUpperCase()} & OPEN ${platform.toUpperCase()}`;
        RAYCAST.setInformerBg(scene, null, text, true, true);
    } else {
        RAYCAST.hideInformer(scene);
    }
}

/**
 * Handle Contact Button Click (Copy & Open)
 */
async function handleContactClick(scene, btn) {
    const label = btn.getAttribute('data-label');
    const url = btn.getAttribute('data-url');
    const isMail = btn.getAttribute('data-id') === 'gmail';

    // 1. Copy to Clipboard
    const copyValue = isMail ? url : url;
    try {
        await navigator.clipboard.writeText(copyValue);

        // 2. Feedback Tooltip
        RAYCAST.setInformerBg(scene, null, `COPIED TO CLIPBOARD!`, true, true);

        // 3. Open URL
        const finalUrl = isMail ? `mailto:${url}` : url;
        window.open(finalUrl, '_blank');

        // Restore tooltip after a delay if still hovering
        setTimeout(() => {
            if (btn.matches(':hover')) {
                handleContactHover(scene, btn, true);
            }
        }, 1500);

    } catch (err) {
        console.error('Clipboard copy failed:', err);
    }

    // Micro-interaction: Spring Pop
    if (window.uiAnims && window.uiAnims.triggerSpring) {
        window.uiAnims.triggerSpring(btn);
    }
}

/**
 * Helper to scroll CV to a specific section by ID
 * @param {string} id The element ID to scroll to
 */
function scrollToCVSection(id) {
    const section = document.getElementById(id);
    const scroller = document.getElementById('cv-scroller');
    if (section && scroller) {
        // 1. Check if the section content is collapsed, and expand it
        const content = section.nextElementSibling;
        if (content && content.classList.contains('collapsed')) {
            section.click(); // Trigger the defined toggle behavior
        }

        // 2. Precise Scroll: Account for 60px fixed header + 25px breathing room
        const headerBuffer = 85; 
        const elementTop = section.offsetTop;

        scroller.scrollTo({
            top: elementTop - headerBuffer,
            behavior: 'smooth'
        });
    }
}
/**
 * Handle Closing the Work Experience Modal
 */
async function handleWorkModalClose(scene) {
    // 1. Hide Modal immediately
    const modal = document.getElementById('work-experience-modal');
    if (modal) {
        modal.style.display = 'none';
        // PERFORMANCE RESTORE: Re-enable raycasting for 3D interactions
        if (scene) scene.raycasterEnabled = true;
        stopNarrativeShader();
    }

    // 2. Slide CV back first
    handleCVToggle(scene, null, false);
    await new Promise(resolve => setTimeout(resolve, 400));

    // 3. Restore hidden board/backdrop
    const board = document.getElementById('board');
    const backdrop = document.querySelector('.three-js-backdrop');
    if (board) board.style.opacity = '1';
    if (backdrop) backdrop.style.opacity = '1';

    // 4. Re-open HUD Frame
    if (scene.HUD && typeof scene.HUD.runTweenOpen === "function") {
        scene.HUD.runTweenOpen();
    }
}
