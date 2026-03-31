import * as THREE from 'three';
import * as RAYCAST from './addRaycaster.js';
import RAPIER from '@dimforge/rapier3d-compat';
import { bindBodyObject, getFreeFormBodyShapeFromMesh } from '../rapierPhysics/addRapierWorld.js';
import TWEEN from 'tween';
import * as CONSTANTS from '../utils/constant.js';
import * as LIGHT from '../resources/addLightning.js';
import * as B64 from '../utils/base64Strings.js';
import { updateStory, updateSubtitle } from '../utils/status.js';
import { alignDragonBallsAndDropBitcoin, spawnBitcoin, alignDragonBalls } from '../resources/spawnBitcoin.js';
import { playOneShotAnimation } from '../utils/animationManager.js';
import { triggerBSOD, triggerBootingSequence, triggerGridFlash } from '../utils/integrityCheck.js';
import { screenLaptopMats, screenPCMats, netflixMat, netflixPCMat, bloodDotaMat, dotaAcceptMat, typingMat, fanBulbMat, fanBulbAuraMat, fireworksMat, seaAndMoonMat, sunsetMat } from '../resources/adjustObjects.js';
import { cvFall, cvSuck, cvShake } from '../interactions/cvFall.js';
import { shootDroneBeam, updateDroneGaze, getObj } from '../scenario/scenarioUtility.js';
import { getDynamicText } from '../utils/contentUtils.js';
import { personaManager } from '../content-manager/personaManager.js';
import { PERSONA_IDS, GLOBAL_COLORS } from '../configs/sceneConfig.js';
import { LEXICON } from '../content-manager/content.js';
import { triggerHeroDance, runHeroPersonaCinematic } from '../interactions/uiInteractions.js';
import { deployHolographicObjectScan, stopHologramScan, createHologramFaceMat } from '../utils/hologramEffects.js';

// =========================================================
// UTILITY FUNCTIONS
// =========================================================
// --- Global Arrays ---
const RAY_BLOCKERS = ['floor', 'backWall_rapier', 'rightWall'];
const BOOKS = [];

// --- Standard Interactions (UPDATED DEFAULT) ---
// MOST objects use highlight, so this is now the default.
const standardEnter = (scene, obj) => {
    document.body.style.cursor = 'pointer';
    RAYCAST.highlightObject(scene, obj);
    if (scene.gazeFollower) scene.gazeFollower.lookAtTarget(obj)
};

const standardLeave = (scene) => {
    document.body.style.cursor = 'auto';
    RAYCAST.restoreMaterials(scene);
    if (scene.gazeFollower) scene.gazeFollower.lookAtTarget(scene.camera)
};

const standardClick = (scene, clickedObject, intersection, forceMultiplier = null) => {
    forceMultiplier = forceMultiplier || Math.random() * 1 + 2.5;
    RAYCAST.applyImpulse(scene, clickedObject, intersection, forceMultiplier);
};

const getScreenNextOptionTextKey = (material) => {
    if (material === typingMat) return "UI_INFORMER_SCREEN_CODE";
    if (material === netflixPCMat || material === netflixMat) return "UI_INFORMER_SCREEN_NETFLIX";
    if (material === bloodDotaMat) return "UI_INFORMER_SCREEN_DOTA";
    if (material === dotaAcceptMat) return "UI_INFORMER_SCREEN_DOTA_ACCEPT";
    return "UI_INFORMER_SCREEN";
};

// --- Cat Role Persistence Logic ---
function assignCatRoles(scene, personaMode, objectMap) {
    // IMPORTANT: Keys must match the interactionConfig keys ("catBlack", "catWhite")
    // as these are the objects registered for raycasting.
    const blackCat = objectMap.get("catBlack");
    const whiteCat = objectMap.get("catWhite");

    const poolMax = personaMode === PERSONA_IDS.POBA ? LEXICON.UI_INFORMER_CAT_MAX_POBA.en : LEXICON.UI_INFORMER_CAT_MAX_DEV.en;
    const poolMin = personaMode === PERSONA_IDS.POBA ? LEXICON.UI_INFORMER_CAT_MIN_POBA.en : LEXICON.UI_INFORMER_CAT_MIN_DEV.en;

    if (blackCat) blackCat.userData.assignedRole = poolMax[Math.floor(Math.random() * poolMax.length)];
    if (whiteCat) whiteCat.userData.assignedRole = poolMin[Math.floor(Math.random() * poolMin.length)];
}

// =========================================================
// MAIN EXPORT
// =========================================================

export function loadedModelRaycast(scene) {
    const objectMap = new Map();
    scene.shootDroneBeam = shootDroneBeam; // Allow addRaycaster to trigger it

    // 1. Single Traversal
    scene.traverse((child) => {
        if (child.name) objectMap.set(child.name, child);
        if (/^book\d+$/.test(child.name)) BOOKS.push(child);
    });

    scene.objectMap = objectMap; // Synchronize for getObj performance

    // 2. Define Stats
    const pokeballStat = {
        gravityCenter: new THREE.Vector3(-0.5, 3.5, 4.9),
        tgtPos: new THREE.Vector3(-2, 3.09, 6.42),
        tgtQuat: new THREE.Quaternion(-0.09, 0.48, -0.05, 0.87)
    };

    // 3. Get Config
    const interactionConfig = getInteractionConfig(scene, objectMap, pokeballStat);

    // --- EXECUTE INITIAL ROLE ASSIGNMENT ---
    assignCatRoles(scene, personaManager.currentMode, objectMap);

    // --- RE-ASSIGN ON PERSONA TOGGLE ---
    window.addEventListener('personaToggle', (e) => {
        assignCatRoles(scene, e.detail.mode, objectMap);
    });

    // --- OPTIMIZATION: Proxy Hitbox for Hero ---
    const hero = objectMap.get('a-char');
    if (hero) {
        // Counteract proxy scale (factoring in hero world scale)
        const scaleVal = 1.0 / hero.scale.y;
        const proxyHeight = 3.675 * scaleVal; // 5% increase from 3.5
        const proxyWidth = 1.6 * scaleVal; // 0.8 * 2.0

        const proxy = new THREE.Mesh(
            new THREE.BoxGeometry(proxyWidth, proxyHeight, proxyWidth),
            new THREE.MeshBasicMaterial({
                color: 0xff00ff,
                transparent: true,
                opacity: 0.0,
                visible: false
            })
        );
        proxy.name = 'hero_hitbox';
        // Adjust position so it stays on floor locally
        proxy.position.set(0, proxyHeight / 2, 0);
        hero.add(proxy);
        objectMap.set(proxy.name, proxy);
    }

    // 4. List of objects to register 
    const objectsToRegister = [
        ...Object.keys(interactionConfig),
        'aegis',
        'aegis2',
        'caseCover',
        'mjolnir_low_mjolnir_hammer_0',
        'Object_34001',
        'screenDisplay001',
        'screenDisplay002',
        'verticalMonitorDisplay',
        'Model_0001',
        'pictureLionFrame'
        // 'hero_hitbox' // Redundant, already in interactionConfig keys
    ];
    // 5. Apply Raycasting
    let registeredCount = 0;
    objectsToRegister.forEach((name) => {
        const object = objectMap.get(name);
        const itemConfig = (interactionConfig[name] || {});

        if (!object) {
            return;
        }
        registeredCount++;
        // console.log(`[Raycast] Registering interaction for: ${name}`, object);

        // Use Custom Logic if defined, otherwise use Standard Defaults
        const baseOnEnter = itemConfig.onMouseEnter
            ? (obj) => {
                itemConfig.onMouseEnter(obj);
            }
            : (obj) => standardEnter(scene, obj);

        // Wrap it: Run gazeFollower first, then the specific logic
        const handleEnter = (obj) => {
            if (scene.gazeFollower) scene.gazeFollower.lookAtTarget(obj);
            baseOnEnter(obj);
        };

        const baseOnLeave = itemConfig.onMouseLeave
            ? (obj) => itemConfig.onMouseLeave(obj)
            : (obj) => standardLeave(scene, obj);

        // Wrap it: Run gazeFollower reset first, then the specific logic
        const handleLeave = (obj) => {
            if (scene.gazeFollower) scene.gazeFollower.lookAtTarget(scene.camera);
            baseOnLeave(obj);
        };

        const handleClick = itemConfig.onMouseDown
            ? (obj, intersect) => itemConfig.onMouseDown(obj, intersect)
            : (obj, intersect) => standardClick(scene, obj, intersect);

        const handleContinuousHover = itemConfig.onMouseHover
            ? (obj, intersect) => itemConfig.onMouseHover(obj, intersect)
            : null;

        RAYCAST.addRaycastObject(
            scene,
            object,
            {
                onMouseEnter: handleEnter,
                onMouseLeave: handleLeave,
                onMouseDown: handleClick,
                onMouseHover: handleContinuousHover
            }
        );
    });

    // 6. Handle Books (Use Standard Defaults)
    BOOKS.forEach((book) => {
        RAYCAST.addRaycastObject(
            scene,
            book,
            {
                onMouseEnter: () => {
                    standardEnter(scene, book);
                    if (scene.gazeFollower) scene.gazeFollower.lookAtTarget(book)
                    if (scene.raycasterWrapper?.mouseInContainer) {
                        RAYCAST.setInformerBg(scene, B64.punch, getDynamicText("UI_INFORMER_BOOK"));
                    }
                },
                onMouseLeave: () => {
                    standardLeave(scene);
                    hideInformer(scene)
                    if (scene.gazeFollower) scene.gazeFollower.lookAtTarget(scene.camera)
                },
                onMouseDown: (obj, intersect) => standardClick(scene, obj, intersect)
            }
        );
    });

    // 7. Handle Blockers (Restored)
    // These objects block the ray but trigger NO functions (empty callbacks), and also not trigger onMouseEnter event
    RAY_BLOCKERS.forEach((name) => {
        const object = objectMap.get(name);
        if (object) {
            RAYCAST.addRaycastObject(
                scene,
                object,
                {
                    onMouseEnter: () => { },
                    onMouseLeave: () => { }
                }
            );
        }
    });

    // --- DEBUG HELPER: scene.testBH(axis) ---
    // Call from the browser console to test BH rotation axes without triggering the full ritual.
    // Usage: scene.testBH('x') | scene.testBH('y') | scene.testBH('z')
    scene.testBH = (axis = 'y') => {
        const bhMesh = scene.getObjectByName('Lathe_Center');
        if (!bhMesh) return;
        if (!['x', 'y', 'z'].includes(axis)) return;

        const target = {};
        target[axis] = bhMesh.rotation[axis] - Math.PI * 6; // reversed direction (matches production)
        new TWEEN.Tween(bhMesh.rotation)
            .to(target, 1500)
            .easing(TWEEN.Easing.Back.Out) // matches production: overshoot + snap
            .start();
    };


}


// =========================================================
// CONFIGURATION (Logic Map)
// =========================================================

const getInteractionConfig = (scene, objectMap, stats) => {
    // Dependencies
    const pokeball = objectMap.get("pokeball");
    const pokeball2 = objectMap.get("pokeball2");
    const pokeball3 = objectMap.get("pokeball3");
    const blackCat = objectMap.get("catBlack");
    const blackCatMesh = objectMap.get("blackCat");
    const whiteCat = objectMap.get("catWhite");
    const whiteCatMesh = objectMap.get("Object_108");
    const drone = objectMap.get('drone');

    // State for Gravity Well
    let gravityAnimFrame = null;
    let gravityStartTime = 0;
    let raycastBackup = [];
    let isDragonRaining = false;
    let eyeTimeout = null;
    let fireHeightTween = null;
    let latheProgressTween = null;
    let catHoverTimeout = null;
    let heroHoverTimeout = null;

    const triggerDragonFortune = (scene, clickedObj, intersect) => {
        console.log("[Dragon Fortune] Triggered Blessing ritual.");
        if (isDragonRaining) {
            updateStory(getDynamicText("SYS_STORY_VOID_EXHAUSTED"));
            return;
        }

        isDragonRaining = true;
        updateStory(getDynamicText("SYS_STORY_VOID_RAIN"));
        alignDragonBalls(scene);

        // --- Environmental Reaction: Darkening the Sky ---
        const hub = scene.globalUniformsHub;
        let originalSharpness = 1.0;
        if (hub && hub.uStormSharpness) {
            originalSharpness = hub.uStormSharpness.value;
            new TWEEN.Tween(hub.uStormSharpness)
                .to({ value: 0.0 }, 1500)
                .easing(TWEEN.Easing.Cubic.Out)
                .start();
        }

        // --- Environmental Reaction: Darkening the Room ---
        const bLight = scene.bulbLight;
        if (bLight) {
            // Capture True Baseline once (prevents drift if triggered during transitions)
            if (scene._bulbBaseline === undefined) {
                scene._bulbBaseline = { intensity: bLight.intensity, angle: bLight.angle };
            }
            
            // Darken the room by decreasing the bulbLight intensity to 0.04 of baseline value
            // (Using baseline * 0.04 instead of current intensity * 0.04 ensures target is absolute if triggered twice)
            animateBulbLightParams(scene, scene._bulbBaseline.intensity * 0.04, scene._bulbBaseline.angle, 1500);
        }

        const hero = scene.getObjectByName('a-char');
        const heroPos = new THREE.Vector3();
        if (hero) hero.getWorldPosition(heroPos);
        else heroPos.set(0, 1, 0);
        heroPos.y += 0.8;

        for (let i = 0; i < 54; i++) {
            const spawnPos = (intersect && intersect.point) ? intersect.point.clone() : clickedObj.position.clone();
            spawnPos.add(new THREE.Vector3(
                (Math.random() - 0.5) * 0.3,
                (Math.random() - 0.5) * 0.3,
                (Math.random() - 0.5) * 0.3
            ));

            const direction = new THREE.Vector3().subVectors(heroPos, spawnPos).normalize();
            direction.x += (Math.random() - 0.5) * 0.15;
            direction.z += (Math.random() - 0.5) * 0.15;
            direction.normalize();

            const force = 28.0 + Math.random() * 12.0;
            const impulse = direction.multiplyScalar(force);
            impulse.y = Math.max(impulse.y, 0.0) + (15.0 + Math.random() * 8.0);

            setTimeout(() => {
                requestAnimationFrame(() => {
                    spawnBitcoin(scene, spawnPos, impulse, i < 53);
                    if (i === 53) {
                        // Restore Sky & Light
                        if (hub && hub.uStormSharpness) {
                            new TWEEN.Tween(hub.uStormSharpness)
                                .to({ value: originalSharpness }, 2000)
                                .easing(TWEEN.Easing.Cubic.InOut)
                                .start();
                        }
                        if (bLight && scene._bulbBaseline) {
                            animateBulbLightParams(scene, scene._bulbBaseline.intensity, scene._bulbBaseline.angle, 2000, { easing: TWEEN.Easing.Cubic.InOut });
                        }

                        // Guaranteed Reset: Ensure the interaction isn't locked even if tweens are voided
                        setTimeout(() => { isDragonRaining = false; }, 1000);
                    }
                });
            }, i * 60);
        }
    };

    // --- Helper Functions for Lathe_Center ---
    const runGravityTimer = () => {

        if (gravityAnimFrame) cancelAnimationFrame(gravityAnimFrame);
        gravityStartTime = performance.now();
        const DURATION = 3000;
        let currentRotation = 0;

        // Progress Bar Tween (Filling Up 0 to 100)
        const progressObj = { value: 0 };
        latheProgressTween = new TWEEN.Tween(progressObj)
            .to({ value: 100 }, DURATION)
            .onUpdate(() => {
                if (scene.cursorInformerProgressBar) {
                    scene.cursorInformerProgressBar.style.height = `${progressObj.value}%`;
                }
                if (progressObj.value >= 100) {
                    if (scene.cursorInformerBox) scene.cursorInformerBox.style.backgroundColor = 'var(--c-cyan)';
                }
            })
            .onComplete(() => {
                latheProgressTween = null;
            })
            .start();

        const animateGravity = (time) => {
            const elapsed = time - gravityStartTime;
            const progress = Math.min(elapsed / DURATION, 1.0); // 0 to 1
            const remaining = Math.max(0, 3 - Math.floor(elapsed / 1000));

            // 1. Text Update (Countdown + Blinking Dots)
            if (remaining > 0) {
                const subSecond = (elapsed % 1000) / 1000;
                let dots = ".";
                if (subSecond > 0.33) dots = "..";
                if (subSecond > 0.66) dots = "...";

                if (scene.cursorInformerText) {
                    scene.cursorInformerText.textContent = `Gravity Well in ${remaining}${dots} `;
                }
            } else if (progress >= 1.0) {
                // Done
                if (scene.cursorInformerText) {
                    scene.cursorInformerText.textContent = "Nom Nom Nom";
                }
                switchPointGravityOnBH(scene, true);
                const pointerY = scene.raycasterWrapper ? scene.raycasterWrapper.pointer.y : 0;
                if (typeof cvSuck === 'function') cvSuck(-pointerY);
                gravityAnimFrame = null;
                return; // Stop loop
            }

            // 2. Spinning Icon (Accelerates)
            const speed = 1 + (progress * progress * 20); // 1 deg/frame to 21 deg/frame
            currentRotation += speed;

            if (scene.cursorInformerIcon) {
                scene.cursorInformerIcon.style.transform = `rotate(${currentRotation}deg)`;
            }

            gravityAnimFrame = requestAnimationFrame(animateGravity);
        };

        gravityAnimFrame = requestAnimationFrame(animateGravity);
    };

    const stopGravityTimer = () => {
        if (gravityAnimFrame) {
            cancelAnimationFrame(gravityAnimFrame);
            gravityAnimFrame = null;
        }
        if (latheProgressTween) {
            latheProgressTween.stop();
            latheProgressTween = null;
        }
        if (scene.cursorInformerProgressBar) {
            scene.cursorInformerProgressBar.style.height = '0%';
        }
        if (scene.cursorInformerBox) {
            scene.cursorInformerBox.style.backgroundColor = ''; // Reset to CSS default
        }
    };

    const resetInformerIcon = () => {
        if (scene.cursorInformerIcon) {
            scene.cursorInformerIcon.style.transform = `rotate(0deg)`;
        }
    };

    let _lastGravityTrigger = 0;
    const instantActivateGravity = () => {
        const now = performance.now();
        if (now - _lastGravityTrigger < 500) return; // Cooldown
        _lastGravityTrigger = now;

        stopGravityTimer();

        if (scene.cursorInformerText) {
            scene.cursorInformerText.textContent = "Gravity Well ACTIVE";
        }

        triggerBSOD(scene, 5000, 'pc');
        switchPointGravityOnBH(scene, true);

        const pointerY = scene.raycasterWrapper ? scene.raycasterWrapper.pointer.y : 0;
        cvSuck(-pointerY);
    };

    const triggerGrid = () => {
        if (scene.pokeballGridUniforms) {
            scene.pokeballGridUniforms.uWorldGridActive.value = 1.0;
            scene.pokeballGridUniforms.uWorldGridProgress.value = 0.0;

            // Re-use Stool-like animation logic
            new TWEEN.Tween(scene.pokeballGridUniforms.uWorldGridProgress)
                .to({ value: 1.0 }, 600)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(() => {
                    setTimeout(() => {
                        new TWEEN.Tween(scene.pokeballGridUniforms.uWorldGridProgress)
                            .to({ value: 0.0 }, 500)
                            .onComplete(() => {
                                scene.pokeballGridUniforms.uWorldGridActive.value = 0.0;
                            })
                            .start();
                    }, 500);
                })
                .start();
        }
    };

    // Standalone helper for the Sit-to-Stand Stretch
    const handleHeroStretch = (scene) => {
        const hero = getObj(scene, 'a-char');
        if (!hero || scene.isHeroAnimating) return;

        scene.isHeroAnimating = true;
        scene.allowsResetting = false;
        const stoolBound = getObj(scene, 'stool_bound');
        if (hero.userData.originalPosX === undefined) hero.userData.originalPosX = hero.position.x;

        let stoolBody = stoolBound?.rapierBody;
        let stoolInit = stoolBound?.userData.originalTranslation;
        if (stoolBody && !stoolInit) {
            const t = stoolBody.translation();
            stoolBound.userData.originalTranslation = { x: t.x, y: t.y, z: t.z };
            stoolInit = stoolBound.userData.originalTranslation;
        }

        if (stoolBody && stoolInit) {
            const stoolTweenObj = { x: stoolInit.x };
            new TWEEN.Tween(stoolTweenObj)
                .to({ x: 0.52 }, 200).easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => stoolBody.setNextKinematicTranslation({ x: stoolTweenObj.x, y: stoolInit.y, z: stoolInit.z }))
                .start();
        }

        new TWEEN.Tween(hero.position)
            .to({ x: 0.4 }, 200).easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
                playOneShotAnimation(scene, 'sitToStand', {
                    autoReturn: false,
                    onComplete: () => {
                        const duration = 300;
                        new TWEEN.Tween(hero.position).to({ x: hero.userData.originalPosX }, duration).easing(TWEEN.Easing.Quadratic.InOut)
                            .onComplete(() => {
                                scene.isHeroAnimating = false;
                                scene.allowsResetting = true;
                            })
                            .start();
                        if (stoolBody && stoolInit) {
                            const stoolReturnObj = { x: 0.52 };
                            new TWEEN.Tween(stoolReturnObj).to({ x: stoolInit.x }, duration).easing(TWEEN.Easing.Quadratic.InOut)
                                .onUpdate(() => stoolBody.setNextKinematicTranslation({ x: stoolReturnObj.x, y: stoolInit.y, z: stoolInit.z }))
                                .start();
                        }
                        playOneShotAnimation(scene, 'typing', { crossFadeDuration: 0.2 });
                    }
                });
                const isPoba = personaManager.currentMode === PERSONA_IDS.POBA;
                const shouts = isPoba ? LEXICON.SHOUT_STRETCH_LEG_POBA.en : LEXICON.SHOUT_STRETCH_LEG_DEV.en;
                scene.conversationManager?.shout(shouts[Math.floor(Math.random() * shouts.length)]);
            }).start();
    };

    const handleHeroHover = (scene, isActive) => {
        const hero = getObj(scene, 'a-char');
        const isBusy = scene.isHeroAnimating || (scene.allowsResetting === false);

        // 1. CLEAR PREVIOUS STATE
        if (heroHoverTimeout) { clearTimeout(heroHoverTimeout); heroHoverTimeout = null; }
        if (scene.heroMenuInterval) { clearInterval(scene.heroMenuInterval); scene.heroMenuInterval = null; }

        if (isActive && !isBusy) {
            const menuOptions = [
                { label: 'DANCE', icon: B64.punch, action: () => triggerHeroDance(scene) },
                { label: 'STRETCH', icon: B64.heart, action: () => handleHeroStretch(scene) },
                { label: 'GOLF', icon: B64.punch, action: () => runHeroPersonaCinematic(scene) },
                { label: 'SPELL', icon: B64.lightning, action: () => castSpellRitual(scene) }
            ];

            // Initialize Menu State on scene object for access by mousedown
            if (scene.heroMenuIndex === undefined) scene.heroMenuIndex = 0;

            const updateMenuUI = () => {
                const current = menuOptions[scene.heroMenuIndex];

                // Active Styling: We use HTML spans with specific inline styles to mimic the nav button
                const activeStyle = `background: var(--c-cyan); color: var(--c-black); padding: 2px 8px; font-weight: 800; border-radius: 2px; text-shadow: none; box-shadow: 0 0 10px var(--c-cyan);`;
                const idleStyle = `opacity: 0.6; padding: 2px 8px;`;

                let menuText = menuOptions.map((opt, i) => {
                    const isSelected = i === scene.heroMenuIndex;
                    return `<span style="${isSelected ? activeStyle : idleStyle}">${opt.label}</span>`;
                }).join(' ');

                RAYCAST.setInformerBg(scene, current.icon, `<div style="display: flex; gap: 4px; align-items: center; font-family: 'Rajdhani', sans-serif; font-size: 13px; letter-spacing: 1px;">${menuText}</div>`);
            };

            // Start cycling every 800ms
            updateMenuUI();
            scene.heroMenuInterval = setInterval(() => {
                scene.heroMenuIndex = (scene.heroMenuIndex + 1) % menuOptions.length;
                updateMenuUI();
            }, 800);

            // --- ISOLATION & GRAVITY DISABLE ---
            const heroHitbox = objectMap.get('hero_hitbox');
            if (scene.raycastObjects && raycastBackup.length === 0 && heroHitbox) {
                raycastBackup = [...scene.raycastObjects];
                scene.raycastObjects = [heroHitbox];

                if (scene.world) {
                    scene._originalBallGravity = scene.world.hasPointGravityOnBalls;
                    scene.world.hasPointGravityOnBalls = false;
                }
            }

            // Engagement Message (Guarded to fire once)
            if (scene.conversationManager && !scene._hasShoutedHeroMenu) {
                const variants = LEXICON.UI_HERO_MENU_ENCOURAGEMENT.en;
                const randomMsg = variants[Math.floor(Math.random() * variants.length)];
                scene.conversationManager.shout(randomMsg, 10000, { small: true });
                scene._hasShoutedHeroMenu = true;
            }

        } else {
            // Restore Hero highlight/shading if not busy
            if (hero) {
                const suit = getObj(scene, 'Ch23_Suit');
                if (suit?.material) {
                    if (suit.userData.originalToneMapped !== undefined) {
                        suit.material.toneMapped = suit.userData.originalToneMapped;
                    }
                }
            }
            // Clear Engagement Message
            if (scene.conversationManager) scene.conversationManager.hide();
            scene._hasShoutedHeroMenu = false;

            // --- HIDE INFORMER ---
            RAYCAST.hideInformer(scene);

            // --- ISOLATION RESTORE ---
            if (raycastBackup.length > 0) {
                scene.raycastObjects = [...raycastBackup];
                raycastBackup = [];

                // Restore Dragon Ball mouse-follow state
                if (scene.world && scene._originalBallGravity !== undefined) {
                    scene.world.hasPointGravityOnBalls = scene._originalBallGravity;
                    delete scene._originalBallGravity;
                }
            }
        }
    };

    const handleMonitorHover = (scene, screenObj, menuOptions, isActive = true) => {
        if (!screenObj) return;

        // 1. CLEAR PREVIOUS STATE
        if (scene.monitorMenuInterval) {
            clearInterval(scene.monitorMenuInterval);
            scene.monitorMenuInterval = null;
        }

        if (isActive && menuOptions) {
            // Initialize state if not present
            if (screenObj.userData.menuIndex === undefined) screenObj.userData.menuIndex = 0;

            const updateMonitorMenuUI = () => {
                const current = menuOptions[screenObj.userData.menuIndex];

                // Reuse Hero styling for consistency
                const activeStyle = `background: var(--c-cyan); color: var(--c-black); padding: 2px 8px; font-weight: 800; border-radius: 2px; text-shadow: none; box-shadow: 0 0 10px var(--c-cyan);`;
                const idleStyle = `opacity: 0.6; padding: 2px 8px;`;

                let menuText = menuOptions.map((opt, i) => {
                    const isSelected = i === screenObj.userData.menuIndex;
                    return `<span style="${isSelected ? activeStyle : idleStyle}">${opt.label}</span>`;
                }).join(' ');

                RAYCAST.setInformerBg(scene, B64.computer, `<div style="display: flex; gap: 4px; align-items: center; font-family: 'Rajdhani', sans-serif; font-size: 11px; letter-spacing: 1px;">${menuText}</div>`);
            };

            // Start cycling every 800ms
            updateMonitorMenuUI();
            scene.monitorMenuInterval = setInterval(() => {
                screenObj.userData.menuIndex = (screenObj.userData.menuIndex + 1) % menuOptions.length;
                updateMonitorMenuUI();
            }, 800);
        } else {
            RAYCAST.hideInformer(scene);
        }
    };

    /**
     * WALL AREA: DRAGON MURAL INTERACTION
     * Cycles between "BLESSING" (Fortune Rain) and "WRATH" (Fan Ki Blast).
     */
    const handleWallHover = (scene, wallObj, menuOptions, isActive = true) => {
        if (!wallObj) return;
        if (scene.wallMenuInterval) {
            clearInterval(scene.wallMenuInterval);
            scene.wallMenuInterval = null;
        }

        if (isActive && menuOptions) {
            if (wallObj.userData.menuIndex === undefined) wallObj.userData.menuIndex = 0;

            const updateWallUI = () => {
                const current = menuOptions[wallObj.userData.menuIndex];
                const activeStyle = `background: var(--c-cyan); color: var(--c-black); padding: 2px 8px; font-weight: 800; border-radius: 2px; text-shadow: none; box-shadow: 0 0 10px var(--c-cyan);`;
                const idleStyle = `opacity: 0.6; padding: 2px 8px;`;

                let menuText = menuOptions.map((opt, i) => {
                    const isSelected = i === wallObj.userData.menuIndex;
                    return `<span style="${isSelected ? activeStyle : idleStyle}">${opt.label}</span>`;
                }).join(' ');

                RAYCAST.setInformerBg(scene, B64.eye, `<div style="display: flex; gap: 4px; align-items: center; font-family: 'Rajdhani', sans-serif; font-size: 13px; letter-spacing: 1px;">${menuText}</div>`);
            };

            updateWallUI();
            scene.wallMenuInterval = setInterval(() => {
                wallObj.userData.menuIndex = (wallObj.userData.menuIndex + 1) % menuOptions.length;
                updateWallUI();
            }, 1000); // Slower cycle for readability
        } else {
            RAYCAST.hideInformer(scene);
        }
    };

    return {
        "hero_hitbox": {
            onMouseEnter: (obj) => {
                try {
                    document.body.style.cursor = 'pointer';

                    const isBusy = scene.isHeroAnimating || (scene.allowsResetting === false);

                    if (scene.raycasterWrapper?.mouseInContainer && !isBusy) {
                        // The Menu logic in handleHeroHover handles the Informer UI
                    }
                    handleHeroHover(scene, true);
                } catch (err) {
                    console.error("Error in hero_hitbox onMouseEnter:", err);
                }
            },
            onMouseLeave: () => {
                document.body.style.cursor = 'auto';
                RAYCAST.hideInformer(scene);
                handleHeroHover(scene, false);
            },
            onMouseDown: () => {
                if (scene.isHeroAnimating || (scene.allowsResetting === false)) return;

                const menuActions = [
                    () => triggerHeroDance(scene),
                    () => handleHeroStretch(scene),
                    () => runHeroPersonaCinematic(scene),
                    () => castSpellRitual(scene)
                ];

                const selectedAction = menuActions[scene.heroMenuIndex || 0];
                if (selectedAction) {
                    RAYCAST.hideInformer(scene); // Immediately hide menu upon selection
                    selectedAction();
                }
            }
        },
        // --- SPECIAL GROUP: Uses changeMaterial (Cats & Pokeball) ---
        "catBlack": { // Black Cat
            onMouseEnter: (obj) => {
                if (scene.raycasterEnabled === false) return;
                document.body.style.cursor = 'pointer';
                if (scene.raycasterWrapper?.mouseInContainer) {
                    RAYCAST.setInformerBg(scene, B64.heart, obj.userData.assignedRole || "MAX - TECH LEAD");
                }

                // Use changeMaterial helper recursively
                RAYCAST.changeMaterial(scene, obj, RAYCAST.goldInnerGlowMatSkinned);
                // Also apply to blackCatMesh in case it was detached from the root by physics (scene.attach)
                if (blackCatMesh) RAYCAST.changeMaterial(scene, blackCatMesh, RAYCAST.goldInnerGlowMatSkinned);

                // Max Tribute: First Hover (Delayed - Rest for 400ms)
                if (blackCat && !blackCat.userData.hasShoutedHover) {
                    if (catHoverTimeout) clearTimeout(catHoverTimeout);
                    catHoverTimeout = setTimeout(() => {
                        scene.conversationManager?.shout(LEXICON.SHOUT_CAT_BLACK_HOVER.en[0]);
                        blackCat.userData.hasShoutedHover = true;
                        catHoverTimeout = null;
                    }, 400);
                }
            },
            onMouseLeave: (obj) => {
                if (catHoverTimeout) {
                    clearTimeout(catHoverTimeout);
                    catHoverTimeout = null;
                }
                document.body.style.cursor = 'auto';

                // standardLeave handles restoring materials from _dirtyRaycastObjects
                standardLeave(scene);
                RAYCAST.hideInformer(scene);
            },
            onMouseDown: (clickedObj, intersect) => {
                standardClick(scene, clickedObj, intersect);

                // Catch the cat!
                if (pokeball && stats) {
                    // Inclusion check: if blackCatMesh was detached, we must catch both the root and the mesh
                    const targets = [blackCat];
                    if (blackCatMesh) targets.push(blackCatMesh);
                    catchTarget(scene, pokeball, targets, stats.gravityCenter, stats.tgtPos, stats.tgtQuat, clickedObj);
                }

                // Max Tribute: First Click
                if (!blackCat.userData.hasShoutedClick) {
                    scene.conversationManager?.shout(LEXICON.SHOUT_CAT_BLACK_CLICK.en[0], 4000, { extraSmall: true });
                    blackCat.userData.hasShoutedClick = true;
                }

                // Subtitle removed as requested
            }
        },
        "catWhite": { // White Cat
            onMouseEnter: (obj) => {
                if (scene.raycasterEnabled === false) return;
                document.body.style.cursor = 'pointer';

                // Use changeMaterial helper to apply gold glow recursively to the whole cat
                RAYCAST.changeMaterial(scene, obj, RAYCAST.goldInnerGlowMatSkinned);

                if (scene.raycasterWrapper?.mouseInContainer) {
                    RAYCAST.setInformerBg(scene, B64.heart, obj.userData.assignedRole || "MIN - QA ENGINEER");
                }

                // Min Tribute: First Hover (Delayed - Rest for 400ms)
                if (whiteCat && !whiteCat.userData.hasShoutedHover) {
                    if (catHoverTimeout) clearTimeout(catHoverTimeout);
                    catHoverTimeout = setTimeout(() => {
                        scene.conversationManager?.shout(LEXICON.SHOUT_CAT_WHITE_HOVER.en[0]);
                        whiteCat.userData.hasShoutedHover = true;
                        catHoverTimeout = null;
                    }, 400);
                }
            },
            onMouseLeave: (obj) => {
                if (catHoverTimeout) {
                    clearTimeout(catHoverTimeout);
                    catHoverTimeout = null;
                }
                document.body.style.cursor = 'auto';

                // standardLeave handles restoring materials from _dirtyRaycastObjects
                standardLeave(scene);
                RAYCAST.hideInformer(scene);
            },
            onMouseDown: (clickedObj, intersect) => {
                standardClick(scene, clickedObj, intersect);

                // Catch the cat!
                if (pokeball && stats) {
                    catchTarget(scene, pokeball, whiteCat, stats.gravityCenter, stats.tgtPos, stats.tgtQuat, clickedObj);
                }

                // Subtitle/Shout removed as requested
            }
        },
        "pokeball": {
            onMouseEnter: (obj) => {
                if (scene.raycasterEnabled === false) return;
                document.body.style.cursor = 'pointer';
                RAYCAST.restoreMaterials(scene);
                RAYCAST.changeMaterial(scene, obj);
            },
            onMouseLeave: () => {
                document.body.style.cursor = 'auto';
                standardLeave(scene);
            },
            onMouseDown: (clickedObj, intersect) => {
                if (scene.raycasterEnabled === false) return;
                standardClick(scene, clickedObj, intersect);
                triggerGrid();
                const potentialTargets = [whiteCat, blackCat];
                const targetsToCatch = potentialTargets.filter(t => t && t.visible);
                if (targetsToCatch.length > 0) {
                    catchTarget(scene, pokeball, targetsToCatch, stats.gravityCenter, stats.tgtPos, stats.tgtQuat, clickedObj);
                }
            }
        },
        "pokeball2": {
            onMouseEnter: (obj) => {
                if (scene.raycasterEnabled === false) return;
                document.body.style.cursor = 'pointer';
                RAYCAST.restoreMaterials(scene);
                RAYCAST.changeMaterial(scene, obj);
            },
            onMouseLeave: () => {
                document.body.style.cursor = 'auto';
                standardLeave(scene);
            },
            onMouseDown: (clickedObj, intersect) => {
                if (scene.raycasterEnabled === false) return;
                standardClick(scene, clickedObj, intersect);
                triggerGrid();
                const potentialTargets = [whiteCat, blackCat];
                const targetsToCatch = potentialTargets.filter(t => t && t.visible);
                if (targetsToCatch.length > 0) {
                    catchTarget(scene, pokeball2, targetsToCatch, stats.gravityCenter, stats.tgtPos, stats.tgtQuat, clickedObj);
                }
            }
        },
        "pokeball3": {
            onMouseEnter: (obj) => {
                if (scene.raycasterEnabled === false) return;
                document.body.style.cursor = 'pointer';
                RAYCAST.restoreMaterials(scene);
                RAYCAST.changeMaterial(scene, obj);
            },
            onMouseLeave: () => {
                document.body.style.cursor = 'auto';
                standardLeave(scene);
            },
            onMouseDown: (clickedObj, intersect) => {
                if (scene.raycasterEnabled === false) return;
                standardClick(scene, clickedObj, intersect);
                triggerGrid();
                const potentialTargets = [whiteCat, blackCat];
                const targetsToCatch = potentialTargets.filter(t => t && t.visible);
                if (targetsToCatch.length > 0) {
                    catchTarget(scene, pokeball3, targetsToCatch, stats.gravityCenter, stats.tgtPos, stats.tgtQuat, clickedObj);
                }
            }
        },

        // --- COMPLEX GROUP: Uses Highlight (Default) + Extra Logic ---
        "Object_2001": { // Chair
            onMouseEnter: (obj) => {
                if (scene.raycasterEnabled === false) return;
                document.body.style.cursor = 'pointer';
                if (scene.raycasterWrapper?.mouseInContainer) {
                    RAYCAST.setInformerBg(scene, B64.punch, getDynamicText("UI_INFORMER_CHAIR"));
                }
                standardEnter(scene, obj); // Use standard highlight
            },
            onMouseLeave: () => {
                document.body.style.cursor = 'auto';
                RAYCAST.hideInformer(scene);
                standardLeave(scene);
            },
            onMouseDown: (clickedObj, intersect) => {
                if (scene.raycasterEnabled === false) return;
                standardClick(scene, clickedObj, intersect);
            }
        },
        "Lathe_Center": { // Blackhole
            onMouseEnter: (obj) => {
                if (scene.raycasterEnabled === false) return;
                if (!scene.integrityBaselineCaptured) return;
                document.body.style.cursor = 'pointer';
                if (scene.raycasterWrapper?.mouseInContainer) {
                    RAYCAST.setInformerBg(scene, B64.blackhole, getDynamicText("UI_INFORMER_BLACKHOLE"));
                }

                // ISOLATION LOGIC:
                // 1. Backup current raycast objects (only if not already backed up)
                if (scene.raycastObjects && raycastBackup.length === 0) {
                    raycastBackup = [...scene.raycastObjects];
                    // 2. Set to ONLY this object
                    scene.raycastObjects = [obj];
                }

                runGravityTimer();
            },
            onMouseLeave: () => {
                document.body.style.cursor = 'auto';
                if (!scene.integrityBaselineCaptured) return;
                stopGravityTimer();
                resetInformerIcon();

                // ISOLATION RESTORE:
                if (raycastBackup.length > 0) {
                    scene.raycastObjects = [...raycastBackup];
                    raycastBackup = [];
                }
                //sleep the chair
                let chairMesh = objectMap.get("Object_2001");
                if (chairMesh) {
                    chairMesh.rapierBody.sleep();
                }
                switchPointGravityOnBH(scene, false);
                RAYCAST.hideInformer(scene);

                if (window._cvState === 'sucking') {
                    cvFall();
                }
            },
            onMouseDown: () => {
                if (scene.raycasterEnabled === false) return;
                if (!scene.integrityBaselineCaptured) return;
                instantActivateGravity();
            },
            onMouseHover: () => {
                RAYCAST.adjustNebula(scene);
            },
        },
        "planeSky": {
            onMouseEnter: () => {
                if (scene.raycasterEnabled === false) return;
                document.body.style.cursor = 'pointer';
                if (scene.raycasterWrapper?.mouseInContainer) {
                    RAYCAST.setInformerBg(scene, B64.lightning, getDynamicText("UI_INFORMER_SKY"));
                }
            },
            onMouseLeave: () => {
                document.body.style.cursor = 'auto';
                RAYCAST.hideInformer(scene);
            },
            onMouseDown: (clickedObj, intersect) => {
                if (scene.raycasterEnabled === false) return;
                const worldPoint = intersect.point.clone();
                const localPoint = clickedObj.worldToLocal(worldPoint);
                const normalizedStrikePos = new THREE.Vector2(2 * localPoint.x, 2 * localPoint.y);
                const hub = scene.globalUniformsHub;
                LIGHT.lightningStrike({
                    scene: scene,
                    constantUniform: hub ? hub.uniforms : null,
                    windowLight: scene.windowLight
                }, 2, normalizedStrikePos, false);
                // console.log('strikePos', normalizedStrikePos);
            }
        },
        "glassInvi": {
            onMouseEnter: (obj) => {
                if (scene.raycasterEnabled === false) return;
                document.body.style.cursor = 'pointer';
                RAYCAST.setInformerBg(scene, B64.slide, getDynamicText("UI_INFORMER_DOOR"));
                standardEnter(scene, obj); // Use standard highlight

            },
            onMouseLeave: () => {
                document.body.style.cursor = 'auto';
                RAYCAST.hideInformer(scene);
                standardLeave(scene);
            },
            onMouseDown: (clickedObj, intersect) => {
                if (scene.raycasterEnabled === false) return;
                // FORCE LEFT (OPEN) ON FIRST CLICK
                if (!clickedObj.userData.hasClickedOnce) {
                    slideGlassAnimation(scene, { forcedX: 0.0 }); // 0.0 -> SLIDE_LEFTX (5.4) -> Open
                    clickedObj.userData.hasClickedOnce = true;
                } else {
                    slideGlassAnimation(scene); // Toggle normally
                }
            }
        },
        "lamp": {
            onMouseEnter: (obj) => {
                if (scene.raycasterEnabled === false) return;
                document.body.style.cursor = 'pointer';
                RAYCAST.setInformerBg(scene, B64.lamp, getDynamicText("UI_INFORMER_LAMP"));
                standardEnter(scene, obj);
            },
            onMouseLeave: () => {
                document.body.style.cursor = 'auto';
                RAYCAST.hideInformer(scene);
                standardLeave(scene);
            },
            onMouseDown: (clickedObj, intersect) => {
                if (scene.raycasterEnabled === false) return;
                const worldPoint = intersect.point.clone();
                const localPoint = clickedObj.worldToLocal(worldPoint);
                if (localPoint.y > 0.1) {
                    LIGHT.toggleLamp(scene);
                } else {
                    standardClick(scene, clickedObj, intersect);
                }
            }
        },
        "computer": {
            onMouseEnter: (obj) => {
                if (scene.raycasterEnabled === false) return;
                document.body.style.cursor = 'pointer';
                RAYCAST.setInformerBg(scene, B64.computer, getDynamicText("UI_INFORMER_SCREEN"));
                standardEnter(scene, obj);
            },
            onMouseLeave: () => {
                document.body.style.cursor = 'auto';
                RAYCAST.hideInformer(scene);
                standardLeave(scene);
            },
            onMouseDown: (clickedObj, intersect) => {
                if (scene.raycasterEnabled === false) return;

                // --- PERSONA ROLE SHIFT ---
                assignCatRoles(scene, personaManager.currentMode, objectMap);
                scene.conversationManager?.shout("PERSONNEL ROLES REASSIGNED");

                // Refresh informer text immediately to reflect current cat roles if needed, 
                // but since this informer is for the screen, we just show the screen's purpose.

                const hub = scene.globalUniformsHub;
                LIGHT.screenFlicker({
                    constantUniform: hub ? hub.uniforms : null,
                    windowLight: scene.windowLight
                }, 0.96, null, false);
            }
        },
        "questionCube": {
            onMouseEnter: (obj) => {
                if (scene.raycasterEnabled === false) return;
                document.body.style.cursor = 'pointer';
                if (scene.raycasterWrapper?.mouseInContainer) {
                    RAYCAST.setInformerBg(scene, B64.punch, getDynamicText("UI_INFORMER_CUBE"));
                }
                standardEnter(scene, obj);
            },
            onMouseLeave: () => {
                document.body.style.cursor = 'auto';
                RAYCAST.hideInformer(scene);
                standardLeave(scene);
            },
            onMouseDown: (clickedObj, intersect) => {
                if (scene.raycasterEnabled === false) return;
                console.log("[Raycast] questionCube clicked! Triggering ritual.", clickedObj.name);
                triggerCubeRitual(scene, clickedObj);
            }
        },
        "mjolnir_low_mjolnir_hammer_0": {
            onMouseEnter: (obj) => {
                if (scene.raycasterEnabled === false) return;
                document.body.style.cursor = 'pointer';
                RAYCAST.setInformerBg(scene, B64.lightning, getDynamicText("UI_INFORMER_MJOLNIR"));
                standardEnter(scene, obj);
            },
            onMouseLeave: () => {
                document.body.style.cursor = 'auto';
                RAYCAST.hideInformer(scene);
                standardLeave(scene);
            },
            onMouseDown: (clickedObj, intersect) => {
                if (scene.raycasterEnabled === false) return;
                const hub = scene.globalUniformsHub;
                standardClick(scene, clickedObj, intersect, 8)
                LIGHT.lightningStrike({
                    scene: scene,
                    constantUniform: hub ? hub.uniforms : null,
                    windowLight: scene.windowLight
                }, 0.96, null, false);
            }
        },
        "cFanBulb": {
            onMouseEnter: (obj) => {
                if (scene.raycasterEnabled === false) return;
                document.body.style.cursor = 'pointer';
                RAYCAST.setInformerBg(scene, B64.bulb, getDynamicText("UI_INFORMER_BULB"));
            },
            onMouseLeave: () => {
                document.body.style.cursor = 'auto';
                RAYCAST.hideInformer(scene);
            },
            onMouseDown: (clickedObj, intersect) => {
                if (scene.raycasterEnabled === false) return;
                triggerBulbRitual(scene, clickedObj);
            },
            onMouseHover: () => { },
        },
        "cFanBody": {
            onMouseEnter: (obj) => {
                document.body.style.cursor = 'pointer';
                const label = getDynamicText("UI_INFORMER_FAN_BODY") || "BOOST & BLAST";
                RAYCAST.setInformerBg(scene, B64.bulb, label);
                standardEnter(scene, obj);
            },
            onMouseLeave: () => {
                RAYCAST.hideInformer(scene);
                standardLeave(scene);
            },
            onMouseDown: (clickedObj, intersect) => {
                triggerFanBlast(scene, clickedObj);
            },
            onMouseHover: () => { },
        },
        "wallArea": {
            onMouseEnter: (obj) => {
                if (scene.raycasterEnabled === false) return;
                document.body.style.cursor = 'pointer';
                if (eyeTimeout) {
                    clearTimeout(eyeTimeout);
                    eyeTimeout = null;
                }
                openDragonEye(scene);

                const wallArea = scene.objectMap ? scene.objectMap.get("wallArea") : null;
                if (scene.gazeFollower) scene.gazeFollower.lookAtTarget(wallArea);

                // Define Mural Protocols
                const options = [
                    { label: 'BLESSING', action: () => triggerDragonFortune(scene, obj) },
                    {
                        label: 'WRATH', action: () => {
                            const fan = scene.getObjectByName("cFanBody") || (scene.objectMap ? scene.objectMap.get("cFanBody") : null);
                            if (fan) triggerFanBlast(scene, fan);
                        }
                    }
                ];
                handleWallHover(scene, obj, options, true);
            },
            onMouseLeave: (obj) => {
                document.body.style.cursor = 'auto';
                if (scene.gazeFollower) scene.gazeFollower.lookAtTarget(scene.camera);
                eyeTimeout = setTimeout(() => {
                    closeDragonEye(scene);
                }, 4000);
                handleWallHover(scene, obj, null, false);
            },
            onMouseDown: (clickedObj, intersect) => {
                const options = [
                    { label: 'BLESSING', action: () => triggerDragonFortune(scene, clickedObj, intersect) },
                    {
                        label: 'WRATH', action: () => {
                            const fan = scene.getObjectByName("cFanBody") || (scene.objectMap ? scene.objectMap.get("cFanBody") : null);
                            if (fan) triggerFanBlast(scene, fan);
                        }
                    }
                ];
                if (clickedObj.userData.menuIndex === undefined) clickedObj.userData.menuIndex = 0;
                options[clickedObj.userData.menuIndex].action();
                // We keep the menu open but it will cycle naturally or immediately if we want
            },
            onMouseHover: () => { },
        },
        "shelf": {},
        "caseCover": {
            onMouseEnter: (obj) => {
                if (scene.raycasterEnabled === false) return;
                document.body.style.cursor = 'pointer';
                RAYCAST.setInformerBg(scene, B64.computer, getDynamicText("UI_INFORMER_REBOOT"));
                standardEnter(scene, obj);

                if (fireHeightTween) fireHeightTween.stop();
                const hub = scene.globalUniformsHub;
                if (!hub || !hub.uFireHeightOverride) return;

                // Start from current height or baseline
                if (hub.uFireHeightOverride.value < 0.01) {
                    hub.uFireHeightOverride.value = 2.5;
                }

                fireHeightTween = new TWEEN.Tween(hub.uFireHeightOverride)
                    .to({ value: 6.0 }, 4000)
                    .easing(TWEEN.Easing.Cubic.Out)
                    .start();
            },
            onMouseLeave: () => {
                RAYCAST.hideInformer(scene);
                standardLeave(scene);

                const hub = scene.globalUniformsHub;
                if (!hub || !hub.uFireHeightOverride) return;

                fireHeightTween = new TWEEN.Tween(hub.uFireHeightOverride)
                    .to({ value: 0.0 }, 1000)
                    .easing(TWEEN.Easing.Cubic.In)
                    .onComplete(() => {
                        if (hub.uFireHeightOverride) {
                            hub.uFireHeightOverride.value = 0.0;
                        }
                    })
                    .start();
            },
            onMouseDown: (clickedObj, intersect) => {
                // Hard reset fire height
                if (fireHeightTween) fireHeightTween.stop();
                const hub = scene.globalUniformsHub;
                if (hub && hub.uFireHeightOverride) {
                    hub.uFireHeightOverride.value = 0.0;
                }

                standardClick(scene, clickedObj, intersect);
                triggerBootingSequence(scene, 4500);

                // --- RESET BOTH SCREENS TO WORK MODE ---
                const screens = ["screenDisplay001", "screenDisplay002", "verticalMonitorDisplay"];
                screens.forEach(name => {
                    const screen = scene.objectMap.get(name);
                    if (screen) {
                        screen.material = typingMat;
                        screen.userData.originalMaterial = typingMat;
                    }
                });
            }
        },
        "droneRC": {
            onMouseEnter: () => {
                document.body.style.cursor = 'pointer';
                const drone = scene.getObjectByName('drone');
                if (drone) {
                    drone.userData.isHovering = true;
                    // Project the subtitle position (center-bottom) to world space
                    const targetPos = new THREE.Vector3(0, -0.76, 0.5).unproject(scene.camera);
                    updateDroneGaze(scene, targetPos, true); // Lock to subtitle
                }
            },
            onMouseLeave: () => {
                document.body.style.cursor = 'auto';
                const drone = scene.getObjectByName('drone');
                if (drone) {
                    drone.userData.isHovering = false;

                    // Only return to camera if not currently shooting a beam
                    const beam = scene.getObjectByName('drone-beam');
                    const isShooting = beam && beam.visible;

                    if (!isShooting && scene.gazeFollower) {
                        scene.gazeFollower.isLocked = false; // Release the subtitle lock
                        updateDroneGaze(scene, scene.camera, false);
                    }
                }
            },
            onMouseDown: (clickedObj) => {
                const isPoba = personaManager.currentMode === PERSONA_IDS.POBA;
                const key = isPoba ? 'SYS_DRONE_SUBTITLES_POBA' : 'SYS_DRONE_SUBTITLES_DEV';

                // --- Improved Random: No Immediate Repeats ---
                // We pull the variants directly from LEXICON to filter out the last used one
                const variants = LEXICON[key]?.en || [];
                let newText;
                if (variants.length > 1) {
                    const filtered = variants.filter(v => v !== clickedObj.userData.lastSubtitle);
                    newText = filtered[Math.floor(Math.random() * filtered.length)];
                } else {
                    newText = getDynamicText(key);
                }
                clickedObj.userData.lastSubtitle = newText;

                // 1. Swap current subtitle (makes it measurable)
                updateSubtitle(newText);
                // console.log("droneRC clicked");
                // 2. Shoot the beam
                shootDroneBeam(scene, newText);
            }
        },
        "Object_34001": { //Laptop
            onMouseEnter: (obj) => {
                document.body.style.cursor = 'pointer';
                const options = [
                    { label: 'FIREWKS', action: () => { obj.material = fireworksMat; obj.userData.originalMaterial = fireworksMat; } },
                    { label: 'MOON', action: () => { obj.material = seaAndMoonMat; obj.userData.originalMaterial = seaAndMoonMat; } },
                    { label: 'SUNSET', action: () => { obj.material = sunsetMat; obj.userData.originalMaterial = sunsetMat; } },
                    {
                        label: 'NETFLIX', action: () => {
                            obj.material = netflixMat; obj.userData.originalMaterial = netflixMat;
                            if (scene.globalUniformsHub?.uniforms.iTime) netflixMat.uniforms.uNetflixStartTime.value = scene.globalUniformsHub.uniforms.iTime.value;
                        }
                    },
                    {
                        label: 'DOTA', action: () => {
                            const dotaMats = [bloodDotaMat, dotaAcceptMat];
                            const mat = dotaMats[Math.floor(Math.random() * dotaMats.length)];
                            obj.material = mat; obj.userData.originalMaterial = mat;
                        }
                    }
                ];
                handleMonitorHover(scene, obj, options, true);
            },
            onMouseLeave: (obj) => {
                document.body.style.cursor = 'auto';
                handleMonitorHover(scene, obj, null, false);
            },
            onMouseDown: (clickedObj, intersect) => {
                const options = [
                    { label: 'FIREWKS', action: () => { clickedObj.material = fireworksMat; clickedObj.userData.originalMaterial = fireworksMat; } },
                    { label: 'MOON', action: () => { clickedObj.material = seaAndMoonMat; clickedObj.userData.originalMaterial = seaAndMoonMat; } },
                    { label: 'SUNSET', action: () => { clickedObj.material = sunsetMat; clickedObj.userData.originalMaterial = sunsetMat; } },
                    {
                        label: 'NETFLIX', action: () => {
                            clickedObj.material = netflixMat; clickedObj.userData.originalMaterial = netflixMat;
                            if (scene.globalUniformsHub?.uniforms.iTime) netflixMat.uniforms.uNetflixStartTime.value = scene.globalUniformsHub.uniforms.iTime.value;
                        }
                    },
                    {
                        label: 'DOTA', action: () => {
                            const dotaMats = [bloodDotaMat, dotaAcceptMat];
                            const mat = dotaMats[Math.floor(Math.random() * dotaMats.length)];
                            clickedObj.material = mat; clickedObj.userData.originalMaterial = mat;
                        }
                    }
                ];
                if (clickedObj.userData.menuIndex === undefined) clickedObj.userData.menuIndex = 0;
                options[clickedObj.userData.menuIndex].action();
                clickedObj.userData.menuIndex = (clickedObj.userData.menuIndex + 1) % options.length;

                // Trigger physics impulse
                let bodyHostingObject = scene.objectMap.get("Object_31");
                standardClick(scene, bodyHostingObject, intersect, 4);
                handleMonitorHover(scene, clickedObj, options); // Refresh UI to next state
            }
        },
        "screenDisplay001": {
            onMouseEnter: (obj) => {
                if (scene.raycasterEnabled === false) return;
                document.body.style.cursor = 'pointer';
                const options = [
                    { label: 'CODE', action: () => { obj.material = typingMat; obj.userData.originalMaterial = typingMat; if (typeof window.cvReset === 'function') window.cvReset(1500); } },
                    {
                        label: 'NETFLIX', action: () => {
                            obj.material = netflixPCMat; obj.userData.originalMaterial = netflixPCMat; cvFall();
                            if (scene.globalUniformsHub?.uniforms.iTime) netflixPCMat.uniforms.uNetflixStartTime.value = scene.globalUniformsHub.uniforms.iTime.value;
                        }
                    },
                    {
                        label: 'DOTA', action: () => {
                            const dotaMats = [bloodDotaMat, dotaAcceptMat];
                            const mat = dotaMats[Math.floor(Math.random() * dotaMats.length)];
                            obj.material = mat; obj.userData.originalMaterial = mat; cvFall();
                        }
                    }
                ];
                handleMonitorHover(scene, obj, options, true);
                if (typingMat.uniforms.uHoverActive) typingMat.uniforms.uHoverActive.value = 1.0;
            },
            onMouseHover: (obj, intersect) => {
                // Keep the existing shader hover coordinate logic
                if (!typingMat.uniforms.uHoverActive) return;
                const uv = intersect.uv;
                const activityRight = 0.045;
                const editorW = 1.0 - activityRight;
                const eUvx = (uv.x - activityRight) / editorW;
                const globalX = eUvx - 0.5; // Mode 0.0 offset
                const statusTop = 0.035;
                const tabBot = (1.0 - 0.05) - 0.05;
                const editorH = tabBot - statusTop;
                const eUvy = (uv.y - statusTop) / editorH;
                typingMat.uniforms.uTargetHoverPos.value.set(globalX, eUvy);
            },
            onMouseLeave: (obj) => {
                document.body.style.cursor = 'auto';
                handleMonitorHover(scene, obj, null, false);
                if (typingMat.uniforms.uHoverActive) typingMat.uniforms.uHoverActive.value = 0.0;
            },
            onMouseDown: (clickedObj, intersect) => {
                const options = [
                    { label: 'CODE', action: () => { clickedObj.material = typingMat; clickedObj.userData.originalMaterial = typingMat; if (typeof window.cvReset === 'function') window.cvReset(1500); } },
                    {
                        label: 'NETFLIX', action: () => {
                            clickedObj.material = netflixPCMat; clickedObj.userData.originalMaterial = netflixPCMat; cvFall();
                            if (scene.globalUniformsHub?.uniforms.iTime) netflixPCMat.uniforms.uNetflixStartTime.value = scene.globalUniformsHub.uniforms.iTime.value;
                        }
                    },
                    {
                        label: 'DOTA', action: () => {
                            const dotaMats = [bloodDotaMat, dotaAcceptMat];
                            const mat = dotaMats[Math.floor(Math.random() * dotaMats.length)];
                            clickedObj.material = mat; clickedObj.userData.originalMaterial = mat; cvFall();
                        }
                    }
                ];
                if (clickedObj.userData.menuIndex === undefined) clickedObj.userData.menuIndex = 0;
                options[clickedObj.userData.menuIndex].action();
                clickedObj.userData.menuIndex = (clickedObj.userData.menuIndex + 1) % options.length;

                let bodyHostingObject = scene.objectMap.get("screenDisplay");
                standardClick(scene, bodyHostingObject, intersect, 4);
                handleMonitorHover(scene, clickedObj, options); // Refresh UI to next state
            }
        },
        "verticalMonitorDisplay": {
            onMouseEnter: (obj) => {
                if (scene.raycasterEnabled === false) return;
                document.body.style.cursor = 'pointer';
                const options = [
                    {
                        label: 'SPLIT', action: () => {
                            const attr = obj.geometry.attributes.aLayoutMode;
                            if (attr) { attr.array.fill(0.0); attr.needsUpdate = true; }
                        }
                    },
                    {
                        label: 'FULL', action: () => {
                            const attr = obj.geometry.attributes.aLayoutMode;
                            if (attr) { attr.array.fill(1.0); attr.needsUpdate = true; }
                        }
                    }
                ];
                handleMonitorHover(scene, obj, options, true);
                if (typingMat.uniforms.uHoverActive) typingMat.uniforms.uHoverActive.value = 1.0;
            },
            onMouseHover: (obj, intersect) => {
                if (!typingMat.uniforms.uHoverActive) return;
                const uv = intersect.uv;
                const activityRight = 0.045;
                const editorW = 1.0 - activityRight;
                const eUvx = (uv.x - activityRight) / editorW;
                const statusTop = 0.035;
                const tabBot = (1.0 - 0.05) - 0.05;
                const editorH = tabBot - statusTop;
                const eUvy = (uv.y - statusTop) / editorH;
                typingMat.uniforms.uTargetHoverPos.value.set(eUvx, eUvy);
            },
            onMouseLeave: (obj) => {
                document.body.style.cursor = 'auto';
                handleMonitorHover(scene, obj, null, false);
                if (typingMat.uniforms.uHoverActive) typingMat.uniforms.uHoverActive.value = 0.0;
            },
            onMouseDown: (clickedObj, intersect) => {
                const options = [
                    {
                        label: 'SPLIT', action: () => {
                            const attr = clickedObj.geometry.attributes.aLayoutMode;
                            if (attr) { attr.array.fill(0.0); attr.needsUpdate = true; }
                        }
                    },
                    {
                        label: 'FULL', action: () => {
                            const attr = clickedObj.geometry.attributes.aLayoutMode;
                            if (attr) { attr.array.fill(1.0); attr.needsUpdate = true; }
                        }
                    }
                ];
                if (clickedObj.userData.menuIndex === undefined) clickedObj.userData.menuIndex = 0;
                options[clickedObj.userData.menuIndex].action();
                clickedObj.userData.menuIndex = (clickedObj.userData.menuIndex + 1) % options.length;

                // Ripples & Click physics
                if (intersect.uv && typingMat.uniforms.uClickPos) {
                    const uv = intersect.uv;
                    const activityRight = 0.045;
                    const editorW = 1.0 - activityRight;
                    const eUvx = (uv.x - activityRight) / editorW;
                    const statusTop = 0.035;
                    const tabBot = (1.0 - 0.05) - 0.05;
                    const editorH = tabBot - statusTop;
                    const eUvy = (uv.y - statusTop) / editorH;
                    typingMat.uniforms.uClickPos.value.set(eUvx, eUvy);
                    if (scene.globalUniformsHub?.uniforms.iTime) typingMat.uniforms.uClickTime.value = scene.globalUniformsHub.uniforms.iTime.value;
                }
                let bodyHostingObject = scene.objectMap.get("verticalMonitor");
                standardClick(scene, bodyHostingObject, intersect, 4);
                handleMonitorHover(scene, clickedObj, options); // Refresh UI to next state
            }
        },
        "screenDisplay002": {
            onMouseEnter: (obj) => {
                if (scene.raycasterEnabled === false) return;
                document.body.style.cursor = 'pointer';
                const options = [
                    { label: 'CODE', action: () => { obj.material = typingMat; obj.userData.originalMaterial = typingMat; } },
                    {
                        label: 'NETFLIX', action: () => {
                            obj.material = netflixPCMat; obj.userData.originalMaterial = netflixPCMat;
                            if (scene.globalUniformsHub?.uniforms.iTime) netflixPCMat.uniforms.uNetflixStartTime.value = scene.globalUniformsHub.uniforms.iTime.value;
                        }
                    },
                    {
                        label: 'DOTA', action: () => {
                            const dotaMats = [bloodDotaMat, dotaAcceptMat];
                            const mat = dotaMats[Math.floor(Math.random() * dotaMats.length)];
                            obj.material = mat; obj.userData.originalMaterial = mat;
                        }
                    }
                ];
                handleMonitorHover(scene, obj, options, true);
                if (typingMat.uniforms.uHoverActive) typingMat.uniforms.uHoverActive.value = 1.0;
            },
            onMouseHover: (obj, intersect) => {
                if (!typingMat.uniforms.uHoverActive) return;
                const uv = intersect.uv;
                const activityRight = 0.045;
                const editorW = 1.0 - activityRight;
                const eUvx = (uv.x - activityRight) / editorW;
                const bezelWidth = 0.04;
                const globalX = 0.5 + bezelWidth + eUvx; // Mode 2.0 offset
                const statusTop = 0.035;
                const tabBot = (1.0 - 0.05) - 0.05;
                const editorH = tabBot - statusTop;
                const eUvy = (uv.y - statusTop) / editorH;
                typingMat.uniforms.uTargetHoverPos.value.set(globalX, eUvy);
            },
            onMouseLeave: (obj) => {
                document.body.style.cursor = 'auto';
                handleMonitorHover(scene, obj, null, false);
                if (typingMat.uniforms.uHoverActive) typingMat.uniforms.uHoverActive.value = 0.0;
            },
            onMouseDown: (clickedObj, intersect) => {
                const options = [
                    { label: 'CODE', action: () => { clickedObj.material = typingMat; clickedObj.userData.originalMaterial = typingMat; } },
                    {
                        label: 'NETFLIX', action: () => {
                            clickedObj.material = netflixPCMat; clickedObj.userData.originalMaterial = netflixPCMat;
                            if (scene.globalUniformsHub?.uniforms.iTime) netflixPCMat.uniforms.uNetflixStartTime.value = scene.globalUniformsHub.uniforms.iTime.value;
                        }
                    },
                    {
                        label: 'DOTA', action: () => {
                            const dotaMats = [bloodDotaMat, dotaAcceptMat];
                            const mat = dotaMats[Math.floor(Math.random() * dotaMats.length)];
                            clickedObj.material = mat; clickedObj.userData.originalMaterial = mat;
                        }
                    }
                ];
                if (clickedObj.userData.menuIndex === undefined) clickedObj.userData.menuIndex = 0;
                options[clickedObj.userData.menuIndex].action();
                clickedObj.userData.menuIndex = (clickedObj.userData.menuIndex + 1) % options.length;

                let bodyHostingObject = scene.objectMap.get("screenDisplay2");
                standardClick(scene, bodyHostingObject, intersect, 4);
                handleMonitorHover(scene, clickedObj, options); // Refresh UI to next state
            }
        },
        "aegis": {
            onMouseEnter: (obj) => {
                standardEnter(scene, obj);
                RAYCAST.setInformerBg(scene, B64.computer, getDynamicText("UI_INFORMER_AEGIS"));
                deployHolographicObjectScan(scene, obj);
            },
            onMouseLeave: (obj) => {
                standardLeave(scene);
                RAYCAST.hideInformer(scene);
                stopHologramScan(scene);
            },
            onMouseDown: (clickedObj, intersect) => {
                const pcScreen = scene.objectMap.get("screenDisplay001");
                const laptopScreen = scene.objectMap.get("Object_34001");

                const targets = [
                    { screen: pcScreen, pool: [bloodDotaMat, dotaAcceptMat] },
                    { screen: laptopScreen, pool: [bloodDotaMat, dotaAcceptMat] }
                ];

                const choice = targets[Math.floor(Math.random() * targets.length)];
                if (choice.screen && choice.pool.length > 0) {
                    const nextMat = choice.pool[Math.floor(Math.random() * choice.pool.length)];
                    choice.screen.material = nextMat;
                    choice.screen.userData.originalMaterial = nextMat;

                    // Specific trigger for Dota Slacking message in integrityCheck
                    updateStory(getDynamicText("SYS_STORY_DOTA_LIFE"));
                }
                standardClick(scene, clickedObj, intersect);
            }
        },
        "aegis2": {
            onMouseEnter: (obj) => {
                standardEnter(scene, obj);
                RAYCAST.setInformerBg(scene, B64.computer, getDynamicText("UI_INFORMER_AEGIS"));
                deployHolographicObjectScan(scene, obj);
            },
            onMouseLeave: (obj) => {
                standardLeave(scene);
                RAYCAST.hideInformer(scene);
                stopHologramScan(scene);
            },
            onMouseDown: (clickedObj, intersect) => {
                const pcScreen = scene.objectMap.get("screenDisplay001");
                const laptopScreen = scene.objectMap.get("Object_34001");

                const targets = [
                    { screen: pcScreen, pool: [bloodDotaMat, dotaAcceptMat] },
                    { screen: laptopScreen, pool: [bloodDotaMat, dotaAcceptMat] }
                ];

                const choice = targets[Math.floor(Math.random() * targets.length)];
                if (choice.screen && choice.pool.length > 0) {
                    const nextMat = choice.pool[Math.floor(Math.random() * choice.pool.length)];
                    choice.screen.material = nextMat;
                    choice.screen.userData.originalMaterial = nextMat;

                    updateStory("PICK ME!!");
                }
                standardClick(scene, clickedObj, intersect);
            }
        }
    };
};

// =========================================================
// UTILITY FUNCTIONS
// =========================================================

function catchTarget(scene, catcher, targets, gravityCenter, tgtPos, tgtQuat, triggerObject = null) {
    if (scene.isSucking || !catcher || !catcher.rapierBody) return;
    let targetList = Array.isArray(targets) ? [...targets] : [targets];


    scene.world.hasPointGravityOnPokeball = false;
    jumpCatcher(scene, catcher, gravityCenter);
    startCatchingTweens(scene, catcher, targetList, tgtPos, tgtQuat);
}

function jumpCatcher(scene, catcher, gravityCenter) {
    let body = catcher.rapierBody;
    if (!body) return;
    scene.world.pokeballBody = body;
    scene.world.gravityCenterForPokeball = gravityCenter;

    const forceDirection = catcher.position.clone();
    forceDirection.normalize();

    // NEGATE MASS: Increase force significantly to give it a strong 'pop'
    const mass = body.mass();
    const forceMultiplier = 15; // Increased from ~1.5 to provide adequate lift
    const forceMagnitude = mass * forceMultiplier;
    const impulse = forceDirection.multiplyScalar(forceMagnitude * -1);

    impulse.y = Math.max(8 * Math.abs(forceDirection.y), 8); // Stronger vertical lift
    impulse.x /= getRandomFloat(1, 2);
    impulse.y *= getRandomFloat(1, 1.5);
    impulse.z /= getRandomFloat(1, 2);

    catcher.rapierBody.applyImpulse({ x: impulse.x, y: impulse.y, z: impulse.z }, true);
}

function startCatchingTweens(scene, catcher, targets, tgtPos, tgtQuat) {
    scene.isSucking = true;
    const mat = CONSTANTS.createInnerGlowMatSkinnedCatching("#FBC189", 1.5, 1);

    let contacts = []; // Ensure contacts is defined/cleared if used globally

    let targetsActive = targets.length;
    targets.forEach((target) => {
        target.ignoreRaycast = true;

        // --- FIX: Aggressive removal from raycasting and visibility logic ---
        // 1. Disable all children immediately (interaction-wise)
        target.traverse((child) => {
            child.ignoreRaycast = true;
            if (child.userData) child.userData.isRaycastTarget = false;
        });

        // 2. Hide from raycaster array recursively
        if (scene.raycastObjects) {
            scene.raycastObjects = scene.raycastObjects.filter(obj => {
                let isPartOfTarget = (obj === target);
                // Also check if any registered root contains this target or vice-versa
                if (!isPartOfTarget) {
                    target.traverse(c => { if (c === obj) isPartOfTarget = true; });
                }
                if (!isPartOfTarget) {
                    obj.traverse(c => { if (c === target) isPartOfTarget = true; });
                }
                return !isPartOfTarget;
            });
        }

        // 3. Clear informer if it's currently focused on this target or its children
        if (scene.raycasterWrapper?.currentObjectTarget) {
            const current = scene.raycasterWrapper.currentObjectTarget;
            let isTargetMatched = (current === target);
            if (!isTargetMatched) {
                target.traverse(c => { if (c === current) isTargetMatched = true; });
            }
            if (isTargetMatched) {
                RAYCAST.hideInformer(scene);
            }
        }

        let startPos = new THREE.Vector3();
        let startQuat = new THREE.Quaternion();

        // Progress object for the tween
        let progress = { value: 0 };
        const DURATION = 1000;

        // Prepare Sucking Tween (Runs AFTER catch)
        const tweenSucking = new TWEEN.Tween(mat.uniforms.uprogress)
            .to({ value: 2 }, 1500)
            .easing(TWEEN.Easing.Bounce.Out)
            .onComplete(() => {
                scene.world.hasPointGravityOnPokeball = false;
                if (catcher.rapierBody) {
                    catcher.rapierBody.setBodyType(0);
                    let force = new THREE.Vector3(0, -4, 0);
                    catcher.rapierBody.applyImpulse({ x: force.x, y: force.y, z: force.z }, true);
                }

                // Robust Physics Cleanup: Traverse and remove ALL rigid bodies in the hierarchy
                target.traverse(child => {
                    if (child.rapierBody) {
                        const body = child.rapierBody;
                        child.isRapierBound = false; // Kill sync immediately
                        body.isObjectBound = false; // Stop update logic

                        try {
                            scene.world.removeRigidBody(body);
                        } catch (e) {
                            console.warn("[Catch] RigidBody removal failed for " + child.name, e);
                        }

                        // Remove from ALL physics tracking caches to prevent "unreachable" errors in world.update()
                        if (scene.physicBodies) scene.physicBodies = scene.physicBodies.filter(b => b !== body);
                        if (scene.skinnedMeshBodies) scene.skinnedMeshBodies = scene.skinnedMeshBodies.filter(b => b !== body);
                        if (scene.objectControlledBodies) scene.objectControlledBodies = scene.objectControlledBodies.filter(b => b !== body);

                        if (scene.physicsControlledObjects) scene.physicsControlledObjects = scene.physicsControlledObjects.filter(obj => obj !== child);
                        if (scene.physicObjects) scene.physicObjects = scene.physicObjects.filter(obj => obj !== child);

                        child.rapierBody = null; // Clear reference
                    }
                });

                // 2. Remove from object tracking caches
                if (scene.physicsControlledObjects) {
                    scene.physicsControlledObjects = scene.physicsControlledObjects.filter(obj => obj !== target);
                }
                if (scene.physicObjects) {
                    scene.physicObjects = scene.physicObjects.filter(obj => obj !== target);
                }

                scene.remove(target);

                // Set missing flags
                if (target.name === 'catBlack' || target.name === 'blackCat') scene.isMaxMissing = true;
                if (target.name === 'catWhite' || target.name === 'Object_108') scene.isMinMissing = true;

                target.visible = false;

                targetsActive--;
                if (targetsActive <= 0) {
                    scene.isSucking = false;
                }
            });

        // Combined Move & Rotate Switch
        const catchTween = new TWEEN.Tween(progress)
            .to({ value: 1 }, DURATION)
            .easing(TWEEN.Easing.Back.InOut)
            .onStart(() => {
                if (catcher.rapierBody) catcher.rapierBody.setBodyType(1);
                // Capture start state
                startPos.copy(catcher.position);
                startQuat.copy(catcher.rotation);

                // --- NEW: Drone lifting sequence start ---
                if (typeof scene.shootDroneBeam === 'function') {
                    // Start a static beam directed at initial position (Skip shards for cleaner look, endless duration, manual tracking)
                    scene.shootDroneBeam(scene, "", "", startPos.clone(), 'drone-beam', false, null, true, Infinity, true);
                }
            })
            .onUpdate(() => {
                // Interpolate Position
                const cp = new THREE.Vector3().lerpVectors(startPos, tgtPos, progress.value);
                if (catcher.rapierBody) catcher.rapierBody.setTranslation({ x: cp.x, y: cp.y, z: cp.z }, false);

                // --- NEW: Dynamic Beam Tracking ---
                const droneBeam = scene.getObjectByName('drone-beam');
                const drone = scene.getObjectByName('drone');
                if (droneBeam && droneBeam.visible && drone) {
                    const eye = drone.getObjectByName('Sphere001_0');
                    if (eye) {
                        const beamStart = new THREE.Vector3();
                        eye.getWorldPosition(beamStart);

                        // Internal update logic mirrored from scenarioUtility to keep visual sync
                        const dist = beamStart.distanceTo(cp);
                        droneBeam.position.copy(beamStart);
                        droneBeam.lookAt(cp);
                        droneBeam.children.forEach(child => {
                            child.scale.z = dist;
                        });

                        // Force drone head to track ball movement
                        if (scene.gazeFollower) scene.gazeFollower.lookAtTarget(catcher);
                    }
                }

                // Interpolate Rotation
                const cq = startQuat.clone().slerp(tgtQuat, progress.value);
                if (catcher.rapierBody) catcher.rapierBody.setRotation({ x: cq.x, y: cq.y, z: cq.z, w: cq.w }, false);
            })
            .onComplete(() => {
                // --- NEW: Hide beam ---
                const droneBeam = scene.getObjectByName('drone-beam');
                if (droneBeam) {
                    droneBeam.visible = false;
                    if (droneBeam.activeRequestID) cancelAnimationFrame(droneBeam.activeRequestID);
                }

                mat.uniforms.catchPoint.value.copy(tgtPos);
                target.traverse((child) => {
                    if (child.isMesh) {
                        child.material = mat;
                        child.userData.originalMaterial = mat;
                    }
                });
            })
            .chain(tweenSucking);

        setTimeout(() => { scene.world.hasPointGravityOnPokeball = true; }, 1000);
        setTimeout(() => {
            catchTween.start();
        }, 3000);
    });
}

// Refactored to allow forcing a specific X position (e.g., 0.75)
export function slideGlassAnimation(scene, options = {}) {
    const { forcedX = null, environmentRatio = null, duration = 1000, delay = 0 } = options;
    const obj = scene.getObjectByName('glassInvi');
    if (!obj) return;

    const SLIDE_LEFTX = 5.4;
    const SLIDE_RIGHTX = 0.75; // The user wants to "slide it to 0.75"

    let kinematicBodyFrame = obj.rapierBody;
    const currentPosition = kinematicBodyFrame.translation();
    const startPosX = currentPosition.x;

    // Determine direction
    let slideDirection;
    if (forcedX !== null) {
        // forcedX is now treated as a PERCENTAGE (0.0 to 1.0)
        // 0.0 = SLIDE_RIGHTX (0.75), 1.0 = SLIDE_LEFTX (5.4)

        // Decide direction based on whether the percentage is "more open" (> 0.5) or "more closed"
        // FIX: 0.0 is Open (Left), mapping to slideDirection 1. 1.0 is Closed (Right), mapping to -1.
        slideDirection = (forcedX < 0.5) ? 1 : -1;
    } else {
        // Toggle if no force value provided
        slideDirection = obj.slideDirection ? obj.slideDirection * -1 : 1;
    }

    // Helper for linear interpolation
    const lerp = (start, end, t) => start + (end - start) * t;

    // Determine target percentage for toggle case
    let targetPercentage;
    if (forcedX !== null) {
        targetPercentage = forcedX;
    } else {
        // If toggling: Moving Left(Open) -> 0.0, Moving Right(Closed) -> 1.0
        // Original: Left was 1.0. Now Left is 0.0.
        // If direction is 1 (Left), pct = 0.0. If -1 (Right), pct = 1.0.
        targetPercentage = (slideDirection === 1) ? 0.0 : 1.0;
    }

    // New MAPPING: 0.0 = Open (Left, 5.4), 1.0 = Closed (Right, 0.75)
    // Position: 5.4 -> 0.75
    let targetPosX = (forcedX !== null)
        ? lerp(SLIDE_LEFTX, SLIDE_RIGHTX, targetPercentage)
        : (slideDirection === 1 ? SLIDE_LEFTX : SLIDE_RIGHTX);


    // Use environmentUtils if provided, otherwise default to the physical target percentage
    const envRatio = (environmentRatio !== null) ? environmentRatio : targetPercentage;

    // Scene Env Intensity Logic
    let startEnvIntensity = scene ? (scene.environmentIntensity ?? 1) : 1;
    // Env: 0.0 (Open) -> 1.0 (Closed)
    // At pct 0.75 -> 0.75 intensity.
    let targetEnvIntensity = lerp(1.0, 0.0, envRatio);


    // Helper to create config items concisely
    const createConfig = (name, prop, closedVal, openVal, axis = null) => {
        return {
            name,
            properties: [{ prop, closedVal, openVal, axis }]
        };
    };

    // Concisely Defined Configuration Array
    const detailObjects = [
        {
            name: 'floor',
            properties: [
                { prop: 'envMapRotation', axis: 'x', closedVal: 1.91, openVal: 2.07 },
                { prop: 'envMapIntensity', closedVal: 0.15, openVal: 1 }
            ]
        },
        createConfig('Object_0003_3', 'envMapIntensity', 0.3, 1),
        createConfig('Object_0003', 'envMapIntensity', 0.2, 0.75),
        createConfig('Object_32', 'envMapIntensity', 0.5, 2.5),
        {
            name: 'mjolnir_low_mjolnir_hammer_0',
            properties: [
                { prop: 'envMapIntensity', closedVal: 1, openVal: 5 },
                { prop: 'metalness', closedVal: 0.6, openVal: 1 },
                { prop: 'roughness', closedVal: 0.2, openVal: 1 }
            ]
        },
        createConfig('aegis', 'envMapIntensity', 1, 5),
        createConfig('Object_34001', 'envMapIntensity', 5, 10),
        createConfig('Object_0003', 'envMapIntensity', 0.5, 3),
        createConfig('shelf', 'envMapIntensity', 0.5, 1.65),
        createConfig('Object_15', 'envMapIntensity', 3, 20),
        createConfig('Object_15001', 'envMapIntensity', 0.5, 2),
        createConfig('Object_31', 'envMapIntensity', 1, 5),
        createConfig('Object_0007', 'envMapIntensity', 0.1, 0.8),
        createConfig('Object_108', 'envMapIntensity', 0.6, 1.2),
    ];

    for (let i = 1; i <= 38; i++) {
        const bookName = "book" + String(i).padStart(3, "0");
        detailObjects.push(createConfig(bookName, 'envMapIntensity', 0.5, 20));
    }


    // CAPTURE START VALUES
    // To prevent snapping, we read the CURRENT value of each property as the start state.
    const startValuesMap = new Map();
    detailObjects.forEach(item => {
        const obj = scene.getObjectByName(item.name);
        if (obj && obj.material) {
            item.properties.forEach(prop => {
                const key = `${item.name}-${prop.prop}`;
                let currentVal = 0;
                if (prop.prop === 'envMapRotation') {
                    if (obj.material.envMapRotation && prop.axis === 'x') {
                        currentVal = obj.material.envMapRotation.x;
                    }
                } else {
                    currentVal = obj.material[prop.prop];
                }
                startValuesMap.set(key, currentVal);
            });
        }

    });

    let progress = { value: 0 };
    // console.log(scene)
    new TWEEN.Tween(progress)
        .to({ value: 1 }, duration)
        .easing(TWEEN.Easing.Back.InOut)
        .delay(delay)
        .onUpdate(() => {
            kinematicBodyFrame.setNextKinematicTranslation({
                x: startPosX + (targetPosX - startPosX) * progress.value,
                y: currentPosition.y,
                z: currentPosition.z
            });

            if (scene) {
                // Update Scene Env
                // Interpolate from Captured Start to Target
                const currentEnv = lerp(startEnvIntensity, targetEnvIntensity, progress.value);
                scene.environmentIntensity = currentEnv;

                // Update Materials
                // Inteprolate from 'startValuesMap' to 'Target Value derived from Ratio'
                detailObjects.forEach(item => {
                    const obj = scene.getObjectByName(item.name);
                    if (!obj || !obj.material) return;
                    const mat = obj.material;

                    item.properties.forEach(prop => {
                        const key = `${item.name}-${prop.prop}`;
                        const startVal = startValuesMap.get(key) ?? 0;

                        // Target Value is based on envRatio (e.g. 1.0 = openVal)
                        const closedVal = (prop.closedVal !== undefined) ? prop.closedVal : 0;
                        const openVal = (prop.openVal !== undefined) ? prop.openVal : 0;
                        const targetVal = lerp(closedVal, openVal, envRatio);

                        const currentVal = lerp(startVal, targetVal, progress.value);

                        if (prop.prop === 'envMapRotation') {
                            if (mat.envMapRotation && prop.axis === 'x') {
                                mat.envMapRotation.x = currentVal;
                            }
                        } else {
                            mat[prop.prop] = currentVal;
                        }
                    });
                });
            }
        })
        .onComplete(() => {
            obj.slideDirection = slideDirection;

            // --- Environmental Reaction: Water Intensity ---
            const hub = scene.globalUniformsHub;
            if (hub && hub.uniforms && hub.uniforms.uWaterIntensity) {
                // REVERTED: 1 = slide to SLIDE_LEFTX (5.4, Closed), -1 = slide to SLIDE_RIGHTX (0.75, Open)
                const isOpening = (slideDirection === -1);
                const targetIntensity = isOpening ? 2.0 : 0.1;

                new TWEEN.Tween(hub.uniforms.uWaterIntensity)
                    .to({ value: targetIntensity }, 3000)
                    .easing(TWEEN.Easing.Cubic.InOut)
                    .start();
            }
        })
        .start();
}

function blackholeSuckTween(scene, targets) {
    if (scene.isSucking) return;
    scene.world.hasPointGravityOnBalls = false;
    scene.isSucking = true;
    let targetList = Array.isArray(targets) ? targets : [targets];
    const mat = CONSTANTS.createInnerGlowMatSkinnedCatching("#FBC189", 1.5, 1);
    mat.uniforms.catchPoint.value.copy(scene.getObjectByName('planeWall').position);

    setTimeout(() => {
        targetList.forEach((target) => {
            target.ignoreRaycast = true;
            let t = new TWEEN.Tween(mat.uniforms.uprogress)
                .to({ value: 2 }, 1500)
                .easing(TWEEN.Easing.Bounce.Out)
                .onStart(() => {
                    target.traverse((child) => {
                        if (child.isMesh) {
                            child.material = mat;
                            child.userData.originalMaterial = mat;
                        }
                    });
                })
                .onComplete(() => {
                    scene.world.hasPointGravityOnPokeball = false;
                    target.visible = false;
                });

            setTimeout(() => { t.start(); }, getRandomFloat(0, 100));
        });
    }, 2000);
}


function switchPointGravityOnBH(scene, val = true) {
    scene.world.hasPointGravityOnBH = val;
    if (val) scene.world.hasPointGravityOnBalls = false;
    scene.physicBodies.forEach((body) => { body.wakeUp(); });
    scene.allowsResetting = !val;
}

// --- Informer Helpers ---
// Use shared helpers from addRaycaster.js
const setInformerBg = (scene, b64, text) => {
    RAYCAST.setInformerBg(scene, b64, text);
    document.body.style.cursor = 'pointer';
};

const hideInformer = (scene) => {
    RAYCAST.hideInformer(scene);
    document.body.style.cursor = 'auto';
};

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

// =========================================================
// BULB RITUAL — Morph Sequence + BH Coin Ejection
// =========================================================
// Sequence:
//   0ms   : Decouple hub uniform → make bulb visible → swap morph target → sphere→lamp (600ms)
//   600ms : BH sequence triggers (balls collapse → flash → coin → scatter)
//   900ms : Lamp→sphere reverse morph (800ms)
//   1700ms: Hide bulb, restore morph target & hub reference
let _bulbRitualActive = false; // Re-entrancy guard

function triggerBulbRitual(scene, bulbClickedObj) {
    if (_bulbRitualActive) return; // Prevent double-fire during sequence
    _bulbRitualActive = true;

    const bulb = scene.bulb;

    // Fallback: If bulb or MorphGeo is missing, run the old simple path
    if (!bulb || !bulb.geometry || !bulb.geometry.isMorphGeo) {
        tweenBulb(scene, null, 1000);
        alignDragonBallsAndDropBitcoin(scene, bulbClickedObj);
        _bulbRitualActive = false;
        return;
    }

    const bulbGeo = bulb.geometry;
    const bulbMat = bulb.material;
    const aura = bulb.getObjectByName("bulbAura");
    const auraMat = aura ? aura.material : null;

    // --- STEP 1: Decouple uTransformProgress from globalUniformsHub ---
    // Save hub references so we can restore them after the ritual
    const hubProgressRef = bulbMat.uniforms.uTransformProgress;
    const hubProgressRefAura = auraMat ? auraMat.uniforms.uTransformProgress : null;

    const localProgress = { value: 0.0 };
    bulbMat.uniforms.uTransformProgress = localProgress;
    if (auraMat) auraMat.uniforms.uTransformProgress = localProgress;

    // --- STEP 2: Swap morph target to bulbSample (index 2 = actual lamp shape) ---
    // MorphGeo stores: [0]=sphere, [1]=btcSymbol, [2]=bulbSample
    bulbGeo.setMorphInfo(0, 2);

    // --- PRE-COMPUTE the toggle target BEFORE Step 3 forces the light to gold ---
    // Step 3 tweens the light to gold (#ffe0b2) as a visual charging effect.
    // If we let tweenBulb(null) at Step 7 read the light color then, it ALWAYS
    // sees gold → always goes blue. We must lock in the correct end-state NOW.
    const COLOR_GOLD = new THREE.Color("#ffe0b2");
    const COLOR_BLUE = new THREE.Color("#9cc1f2");
    let ritualEndColor = '#' + COLOR_BLUE.getHexString(); // default
    if (scene.bulbLight) {
        const c = scene.bulbLight.color;
        const distToGold = Math.abs(c.r - COLOR_GOLD.r) + Math.abs(c.g - COLOR_GOLD.g) + Math.abs(c.b - COLOR_GOLD.b);
        // If currently gold → end at blue; if currently blue → end at gold
        ritualEndColor = distToGold < 0.5
            ? '#' + COLOR_BLUE.getHexString()
            : '#' + COLOR_GOLD.getHexString();
    }

    // --- STEP 3: Reveal the bulb mesh (normally invisible — only the light is active) ---
    bulbMat.visible = true;
    if (aura) aura.visible = true;

    // Warm gold flash to mark the ritual start (visual only — does NOT affect toggle decision)
    tweenBulb(scene, "#ffe0b2", 400);

    // --- STEP 4: Tween sphere → lamp shape (600ms, Cubic.Out) ---
    new TWEEN.Tween(localProgress)
        .to({ value: 1.0 }, 600)
        .easing(TWEEN.Easing.Cubic.Out)
        .onComplete(() => {

            // --- STEP 5: Trigger BH collapse ritual at morph peak ---
            alignDragonBallsAndDropBitcoin(scene, bulbClickedObj);

            // --- STEP 6: Hold lamp shape briefly, then reverse (300ms delay) ---
            setTimeout(() => {
                new TWEEN.Tween(localProgress)
                    .to({ value: 0.0 }, 800)
                    .easing(TWEEN.Easing.Cubic.In)
                    .onComplete(() => {

                        // --- STEP 7: Restore everything ---
                        bulbMat.visible = true;
                        if (aura) aura.visible = true; // Restore aura to visible (was visible before ritual)

                        // Restore morph target to btcSymbol (index 1) — its original state
                        bulbGeo.setMorphInfo(0, 1);

                        // Re-link hub uniform references
                        bulbMat.uniforms.uTransformProgress = hubProgressRef;
                        if (auraMat && hubProgressRefAura) {
                            auraMat.uniforms.uTransformProgress = hubProgressRefAura;
                        }

                        // Hard-sync glowColor to current light to eliminate pop
                        if (scene.bulbLight) {
                            const lc = scene.bulbLight.color;
                            bulbMat.uniforms.glowColor.value.setRGB(lc.r, lc.g, lc.b);
                        }

                        // Use the pre-computed color (captured before Step 3 poisoned the toggle)
                        tweenBulb(scene, ritualEndColor, 600);

                        _bulbRitualActive = false;
                    })
                    .start();
            }, 300);
        })
        .start();
}


/**
 * Unified controller for bulbLight's intensity and beam angle.
 * "Voids" previous tweens if a new one is started (Latest takes priority).
 */
function animateBulbLightParams(scene, targetIntensity, targetAngle, duration = 1000, options = {}) {
    const { easing = TWEEN.Easing.Cubic.Out, onComplete = null, delay = 0 } = options;
    const bLight = scene.bulbLight;
    if (!bLight) return;

    // VOID PREVIOUS: Latest tween kills any active bulbLight parameter animation
    if (bLight._activeParamTween) {
        bLight._activeParamTween.stop();
        bLight._activeParamTween = null;
    }

    const startIntensity = bLight.intensity;
    const startAngle = bLight.angle;

    const progress = { t: 0 };
    bLight._activeParamTween = new TWEEN.Tween(progress)
        .to({ t: 1.0 }, duration)
        .delay(delay)
        .easing(easing)
        .onUpdate(() => {
            bLight.intensity = THREE.MathUtils.lerp(startIntensity, targetIntensity, progress.t);
            bLight.angle = THREE.MathUtils.lerp(startAngle, targetAngle, progress.t);
        })
        .onComplete(() => {
            bLight._activeParamTween = null;
            if (onComplete) onComplete();
        })
        .start();

    return bLight._activeParamTween;
}

function tweenBulb(scene, forceColor = null, duration = 3000) {
    const COLOR_GOLD = new THREE.Color("#ffe0b2");
    const COLOR_BLUE = new THREE.Color("#9cc1f2");

    let targetColor;

    if (forceColor) {
        targetColor = new THREE.Color(forceColor);
    } else {
        // Toggle Logic using light color as reference
        if (scene.bulbLight) {
            const currentColor = scene.bulbLight.color;
            const distToGold = Math.abs(currentColor.r - COLOR_GOLD.r) + Math.abs(currentColor.g - COLOR_GOLD.g) + Math.abs(currentColor.b - COLOR_GOLD.b);
            targetColor = (distToGold < 0.5) ? COLOR_BLUE : COLOR_GOLD;
        } else {
            targetColor = COLOR_BLUE;
        }
    }

    // 1. Bulb Light (Color)
    if (scene.bulbLight) {
        new TWEEN.Tween(scene.bulbLight.color)
            .to({ r: targetColor.r, g: targetColor.g, b: targetColor.b }, duration)
            .easing(TWEEN.Easing.Cubic.Out)
            .start();
    }

    // 2. Bulb Material (Glow Color)
    if (scene.bulb && scene.bulb.material && scene.bulb.material.uniforms.glowColor) {
        new TWEEN.Tween(scene.bulb.material.uniforms.glowColor.value)
            .to({ r: targetColor.r, g: targetColor.g, b: targetColor.b }, duration)
            .easing(TWEEN.Easing.Cubic.Out)
            .start();

        // 3. Bulb Aura
        const aura = scene.bulb.getObjectByName("bulbAura");
        if (aura && aura.material && aura.material.uniforms.glowColor) {
            new TWEEN.Tween(aura.material.uniforms.glowColor.value)
                .to({ r: targetColor.r, g: targetColor.g, b: targetColor.b }, duration)
                .easing(TWEEN.Easing.Cubic.Out)
                .start();
        }
    }

    // 4. cFanBulb Synchronization
    if (fanBulbMat && fanBulbMat.uniforms) {
        // Sync color
        if (fanBulbMat.uniforms.glowColor) {
            new TWEEN.Tween(fanBulbMat.uniforms.glowColor.value)
                .to({ r: targetColor.r, g: targetColor.g, b: targetColor.b }, duration)
                .easing(TWEEN.Easing.Cubic.Out)
                .start();
        }
        // Sync glow intensity (0.0 to 1.0 mapping, but we follow the user request's implicit state)
        if (fanBulbMat.uniforms.glowIntensity) {
            new TWEEN.Tween(fanBulbMat.uniforms.glowIntensity)
                .to({ value: 1.0 }, duration)
                .easing(TWEEN.Easing.Cubic.Out)
                .start();
        }
    }

    // 5. cFanBulbAura Synchronization
    if (fanBulbAuraMat && fanBulbAuraMat.uniforms) {
        if (fanBulbAuraMat.uniforms.glowColor) {
            new TWEEN.Tween(fanBulbAuraMat.uniforms.glowColor.value)
                .to({ r: targetColor.r, g: targetColor.g, b: targetColor.b }, duration)
                .easing(TWEEN.Easing.Cubic.Out)
                .start();
        }
        if (fanBulbAuraMat.uniforms.outerGlowStrength) {
            new TWEEN.Tween(fanBulbAuraMat.uniforms.outerGlowStrength)
                .to({ value: 1.5 }, duration)
                .easing(TWEEN.Easing.Cubic.Out)
                .start();
        }
    }
}

/**
 * RITUAL: THE KI DISCHARGE
 * Shoots a high-intensity anime-style beam downward, clearing the surroundings with a radial blast.
 * Features a cinematic charge-up period and a floor-level shockwave.
 */
/**
 * RITUAL: THE KI DISCHARGE (PREMIUM HIGH-TECH)
 * Premium kinetic event using the project's signature holographic grid shaders.
 */
let _fanBlastActive = false;
function triggerFanBlast(scene, fanBody) {
    if (_fanBlastActive || !fanBody) return;
    _fanBlastActive = true;

    const bLight = scene.bulbLight;
    if (bLight && scene._bulbBaseline === undefined) {
        scene._bulbBaseline = { intensity: bLight.intensity, angle: bLight.angle };
    }
    
    // Use the current color of the bulbLight for the entire effect
    const hColor = bLight ? bLight.color.clone() : (GLOBAL_COLORS.ELECTRIC_CYAN || 0x00f3ff);

    const sourceNode = scene.getObjectByName("cFanBulb") || fanBody;
    const fanWorldPos = new THREE.Vector3();
    sourceNode.getWorldPosition(fanWorldPos);
    const floorY = -0.55;

    // --- 2. PHASE ONE: THE CHARGE (800ms) ---
    const coreGeom = new THREE.IcosahedronGeometry(0.3, 1);
    const coreMat = createHologramFaceMat(hColor);
    coreMat.uniforms.uOpacity.value = 0.5;
    coreMat.uniforms.uBrightness.value = 3.5;
    const core = new THREE.Mesh(coreGeom, coreMat);
    core.position.copy(fanWorldPos);
    scene.add(core);

    new TWEEN.Tween(core.scale)
        .to({ x: 3.5, y: 3.5, z: 3.5 }, 800)
        .easing(TWEEN.Easing.Quintic.Out)
        .start();

    // Shader animation loop
    const startTime = performance.now();
    const updateCoreShader = (now) => {
        if (!core.parent) return;
        coreMat.uniforms.iTime.value = (now - startTime) / 1000;
        core.rotation.y += 0.05;
        core.rotation.z += 0.03;
        requestAnimationFrame(updateCoreShader);
    };
    requestAnimationFrame(updateCoreShader);

    if (scene.fanAction) {
        new TWEEN.Tween(scene.fanAction)
            .to({ timeScale: 65.0 }, 800)
            .easing(TWEEN.Easing.Exponential.In)
            .start();
    }
    updateStory("SYNCHRONIZING KINETIC VECTORS...");

    // --- 3. THE BULB LIGHT TWEEN (Intensity & Angle via Unified Controller) ---
    const flashDuration = 800;
    const restorationDelay = 800;
    if (bLight && scene._bulbBaseline) {
        // Phase 1: The Blast Flash
        animateBulbLightParams(scene, 10000, 0.3, flashDuration, {
            easing: TWEEN.Easing.Exponential.In,
            onComplete: () => {
                // Phase 2: Restoration to catch the tail of the effect
                animateBulbLightParams(scene, scene._bulbBaseline.intensity, scene._bulbBaseline.angle, 400, {
                    delay: restorationDelay,
                    easing: TWEEN.Easing.Cubic.Out
                });
            }
        });
    }

    // --- 3b. GUARANTEED STATE RESET ---
    // Decouple the interaction flag from the light tween lifecycle (prevents locking if tweens are voided)
    const totalRitualDuration = flashDuration + restorationDelay + 600; // Buffer for physics/visuals
    setTimeout(() => {
        _fanBlastActive = false;
    }, totalRitualDuration);

    // --- 4. PHASE TWO: THE DATA DISCHARGE (Starts at 800ms) ---
    setTimeout(() => {
        scene.remove(core);
        coreGeom.dispose();
        coreMat.dispose();

        const height = Math.abs(fanWorldPos.y - floorY);
        const geom = new THREE.CylinderGeometry(1.5, 1.5, height, 32, 1, true);
        geom.translate(0, -height / 2, 0);

        const pMat = createHologramFaceMat(hColor);
        pMat.uniforms.uOpacity.value = 0.9;
        pMat.uniforms.uBrightness.value = 5.0;

        const pillar = new THREE.Mesh(geom, pMat);
        pillar.position.copy(fanWorldPos);
        scene.add(pillar);

        pillar.scale.set(0.1, 1, 0.1);
        new TWEEN.Tween(pillar.scale)
            .to({ x: 2.2, z: 2.2 }, 150)
            .easing(TWEEN.Easing.Exponential.Out)
            .onComplete(() => {
                new TWEEN.Tween(pMat.uniforms.uOpacity).to({ value: 0 }, 500).delay(300).start();
                setTimeout(() => {
                    scene.remove(pillar);
                    geom.dispose();
                    pMat.dispose();
                    // Note: _fanBlastActive is now handled by the Light Tween's restoration cycle
                }, 800);
            })
            .start();

        const pStartTime = performance.now();
        const updatePillarShader = (now) => {
            if (!pillar.parent) return;
            pMat.uniforms.iTime.value = (now - pStartTime) / 1000;
            pillar.rotation.y += 0.02;
            requestAnimationFrame(updatePillarShader);
        };
        requestAnimationFrame(updatePillarShader);

        // --- PHYSICS PULSE ---
        const targets = [];
        if (scene.bhTargets) targets.push(...scene.bhTargets);
        if (scene.dragonBalls) targets.push(...scene.dragonBalls);
        const uniqueTargets = [...new Set(targets)];

        uniqueTargets.forEach(item => {
            if (!item || !item.rapierBody) return;
            const body = item.rapierBody;
            const itemPos = new THREE.Vector3();
            item.getWorldPosition(itemPos);
            const originPoint = new THREE.Vector3(fanWorldPos.x, itemPos.y, fanWorldPos.z);
            const forceDir = new THREE.Vector3().subVectors(itemPos, originPoint);
            const distance = forceDir.length();

            forceDir.normalize();
            forceDir.y = 1.35;
            forceDir.normalize();

            const mass = body.mass();
            const strength = (500.0 * mass) / (Math.max(1, distance) + 0.15);

            body.applyImpulse({
                x: forceDir.x * strength,
                y: forceDir.y * strength * 1.6,
                z: forceDir.z * strength
            }, true);

            const torque = 150.0 * mass;
            body.applyTorqueImpulse({
                x: (Math.random() - 0.5) * torque,
                y: (Math.random() - 0.5) * torque,
                z: (Math.random() - 0.5) * torque
            }, true);
        });

        updateStory("KINETIC DISCHARGE: STABLE");
        if (typeof triggerGridFlash === 'function') triggerGridFlash(scene, true);

        setTimeout(() => {
            if (typeof triggerGridFlash === 'function') triggerGridFlash(scene, false);
            if (scene.fanAction) {
                new TWEEN.Tween(scene.fanAction).to({ timeScale: 1.0 }, 4000).easing(TWEEN.Easing.Cubic.Out).start();
            }
        }, 150);

    }, 800);
}


function ensureLatheMethods(scene) {
    const latheCenter = scene.getObjectByName('Lathe_Center');
    if (!latheCenter) return null;
    if (latheCenter.makeEye) return latheCenter;

    // Cache full initial states to avoid hardcoding resets
    latheCenter.userData.initValues = {
        rotation: latheCenter.rotation.clone(),
        scale: latheCenter.scale.clone(),
        nebulaCoreRadius: 10,
        nebulaSwirlSpeed: 0.25
    };

    if (latheCenter.material && latheCenter.material.uniforms && latheCenter.material.uniforms.nebulaCoreRadius) {
        latheCenter.userData.initValues.nebulaCoreRadius = latheCenter.material.uniforms.nebulaCoreRadius.value;
    }
    if (scene.globalUniformsHub && scene.globalUniformsHub.uNebulaSwirlSpeed) {
        latheCenter.userData.initValues.nebulaSwirlSpeed = scene.globalUniformsHub.uNebulaSwirlSpeed.value;
    }

    latheCenter.makeEye = function (duration) {

        if (this.userData.eyeTweens) this.userData.eyeTweens.forEach(t => t.stop());
        this.userData.eyeTweens = [];

        // 1. Transform: Rotate to face camera and scale to "squint" shape
        const t1 = new TWEEN.Tween(this.rotation)
            .to({ y: -0.3 }, duration)
            .easing(TWEEN.Easing.Cubic.Out)
            .start();

        const t2 = new TWEEN.Tween(this.scale)
            .to({ x: 0.675, y: 1.5, z: 0.875 }, duration)
            .easing(TWEEN.Easing.Cubic.Out)
            .start();

        this.userData.eyeTweens.push(t1, t2);

        // 2. Nebula Radius: Intensify core light
        if (this.material && this.material.uniforms && this.material.uniforms.nebulaCoreRadius) {
            const t3 = new TWEEN.Tween(this.material.uniforms.nebulaCoreRadius)
                .to({ value: 15 }, duration)
                .easing(TWEEN.Easing.Cubic.Out)
                .start();
            this.userData.eyeTweens.push(t3);
        }

        // 3. Nebula Swirl: Speed up the "vortex"
        if (scene.globalUniformsHub && scene.globalUniformsHub.uNebulaSwirlSpeed) {
            const t4 = new TWEEN.Tween(scene.globalUniformsHub.uNebulaSwirlSpeed)
                .to({ value: 2.0 }, duration)
                .easing(TWEEN.Easing.Cubic.Out)
                .start();
            this.userData.eyeTweens.push(t4);
        }

    };

    latheCenter.stopEye = function (duration) {

        if (this.userData.eyeTweens) this.userData.eyeTweens.forEach(t => t.stop());
        this.userData.eyeTweens = [];

        const init = this.userData.initValues;

        // Restore Rotation & Scale
        const t1 = new TWEEN.Tween(this.rotation)
            .to({ x: init.rotation.x, y: init.rotation.y, z: init.rotation.z }, duration)
            .easing(TWEEN.Easing.Cubic.Out)
            .start();

        const t2 = new TWEEN.Tween(this.scale)
            .to({ x: init.scale.x, y: init.scale.y, z: init.scale.z }, duration)
            .easing(TWEEN.Easing.Cubic.Out)
            .start();

        this.userData.eyeTweens.push(t1, t2);

        // Restore Nebula Core Radius
        if (this.material && this.material.uniforms && this.material.uniforms.nebulaCoreRadius) {
            const t3 = new TWEEN.Tween(this.material.uniforms.nebulaCoreRadius)
                .to({ value: init.nebulaCoreRadius }, duration)
                .easing(TWEEN.Easing.Cubic.Out)
                .start();
            this.userData.eyeTweens.push(t3);
        }

        // Restore Nebula Swirl Speed
        if (scene.globalUniformsHub && scene.globalUniformsHub.uNebulaSwirlSpeed) {
            const t4 = new TWEEN.Tween(scene.globalUniformsHub.uNebulaSwirlSpeed)
                .to({ value: init.nebulaSwirlSpeed }, duration)
                .easing(TWEEN.Easing.Cubic.Out)
                .start();
            this.userData.eyeTweens.push(t4);
        }

    };

    return latheCenter;
}

export function openDragonEye(scene, duration = 3000) {
    let obj = getObj(scene, "wallArea");
    if (!obj || !obj.material) return;
    const uniforms = obj.material.uniforms;
    const latheCenter = ensureLatheMethods(scene);

    // STOP PREVIOUS ANIMATION
    if (obj.userData.eyeTween) {
        obj.userData.eyeTween.stop();
        obj.userData.eyeTween = null;
    }
    if (obj.userData.latheEyeTweenObj) {
        obj.userData.latheEyeTweenObj.stop();
        obj.userData.latheEyeTweenObj = null;
    }

    if (uniforms && uniforms.uEyeActive) {
        uniforms.uEyeActive.value = true;
    }

    if (uniforms && uniforms.uEyeOpenness) {
        obj.userData.eyeTween = new TWEEN.Tween(uniforms.uEyeOpenness)
            .to({ value: 1.0 }, duration)
            .easing(TWEEN.Easing.Cubic.Out)
            .onStart(() => {
                obj.material.visible = true;
            })
            .start();

        if (latheCenter) {
            latheCenter.makeEye(duration);
        }
    }
}

export function closeDragonEye(scene, duration = 3000) {
    let obj = getObj(scene, "wallArea");
    if (!obj || !obj.material) return;
    const uniforms = obj.material.uniforms;
    const latheCenter = ensureLatheMethods(scene);

    // STOP PREVIOUS ANIMATION
    if (obj.userData.eyeTween) {
        obj.userData.eyeTween.stop();
        obj.userData.eyeTween = null;
    }
    if (obj.userData.latheEyeTweenObj) {
        obj.userData.latheEyeTweenObj.stop();
        obj.userData.latheEyeTweenObj = null;
    }

    if (uniforms && uniforms.uEyeOpenness) {
        obj.userData.eyeTween = new TWEEN.Tween(uniforms.uEyeOpenness)
            .to({ value: 0.0 }, duration)
            .easing(TWEEN.Easing.Cubic.Out)
            .onComplete(() => {
                obj.material.visible = false;
                if (uniforms && uniforms.uEyeActive) {
                    uniforms.uEyeActive.value = false;
                }
            })
            .start();

        if (latheCenter) {
            latheCenter.stopEye(duration);
        }
    }
}


// --- COIN SPAWN ---


// =========================================================
// CAST SPELL RITUAL
// =========================================================
export function castSpellRitual(scene) {
    if (scene.isHeroAnimating) return;

    const hero = scene.getObjectByName('a-char');
    const stool = scene.getObjectByName('stool_bound');
    if (!hero || !stool) return;

    // --- POSITIONAL DATA (Pattern match from dance) ---
    const heroStartPos = hero.position.clone();
    const stoolStartPos = new THREE.Vector3();
    const stoolStartRot = new THREE.Quaternion();
    stool.getWorldPosition(stoolStartPos);
    stool.getWorldQuaternion(stoolStartRot);

    const originalGravity = -9.81;
    const peakBuildupGravity = 9.0;
    const snapGravity = 27.0; // 3x the buildup peak

    // Randomize ritual texts from LEXICON (Pop culture references)
    const channelingList = LEXICON.SYS_SPELL_CHANNELING.en;
    const castList = LEXICON.SYS_SPELL_CAST.en;
    const randomChanneling = channelingList[Math.floor(Math.random() * channelingList.length)];
    const randomCast = castList[Math.floor(Math.random() * castList.length)];

    // 1. Start Animation at 0.75x speed for a "Slow Motion" buildup
    const anim = playOneShotAnimation(scene, 'castSpell', {
        autoReturn: true,
        speed: 0.75,
        onComplete: () => {
            // 4. RESET EVERYTHING: Restore standard gravity and reset UI
            if (scene.world) {
                scene.world.gravity = { x: 0, y: originalGravity, z: 0 };
                console.log(`[Spell Ritual] Animation complete. Gravity restored to ${originalGravity}.`);
            }

            // Restore 2D Gravity to normal
            window._cvGravity = 0.6;
            if (window._cvState === 'ritual') window._cvState = 'falling';

            if (scene.cursorInformerProgressBar) scene.cursorInformerProgressBar.style.height = '0%';
            if (scene.cursorInformerBox) scene.cursorInformerBox.style.backgroundColor = '';

            // --- RESET POSITION (Sitting Down) ---
            const resetDuration = 1200;
            new TWEEN.Tween(hero.position)
                .to({ x: heroStartPos.x, y: heroStartPos.y, z: heroStartPos.z }, resetDuration)
                .easing(TWEEN.Easing.Cubic.InOut)
                .onComplete(() => {
                    playOneShotAnimation(scene, 'typing', { crossFadeDuration: 0.5 });
                })
                .start();

            if (stool.rapierBody) {
                const body = stool.rapierBody;
                const currentTranslation = body.translation();
                const currentRotation = body.rotation();
                const proxy = { t: 0 };

                new TWEEN.Tween(proxy)
                    .to({ t: 1 }, resetDuration)
                    .easing(TWEEN.Easing.Cubic.Out)
                    .onUpdate(() => {
                        const lp = new THREE.Vector3().lerpVectors(currentTranslation, stoolStartPos, proxy.t);
                        const lr = new THREE.Quaternion().copy(currentRotation).slerp(stoolStartRot, proxy.t);
                        body.setTranslation(lp, true);
                        body.setRotation(lr, true);

                        const localP = lp.clone();
                        if (stool.parent) stool.parent.worldToLocal(localP);
                        stool.position.copy(localP);
                    })
                    .onComplete(() => {
                        body.setBodyType(RAPIER.RigidBodyType.Fixed);
                        scene.isHeroAnimating = false;
                    })
                    .start();
            } else {
                scene.isHeroAnimating = false;
            }

            // 5. SETTLE TIME: Wait 3s before allowing new hero animations
            setTimeout(() => {
                scene.allowsResetting = true;
                console.log(`[Spell Ritual] Ritual fully finalized.`);
            }, 3000);
        }
    });

    if (!anim) return;
    scene.allowsResetting = false;
    scene.isHeroAnimating = true;

    const action = anim.action;
    const clip = action.getClip();

    // --- STEP 1: PRE-RITUAL MOVEMENT (Step Back) ---
    const moveDuration = 800;
    new TWEEN.Tween(hero.position)
        .to({ x: 1.0 }, moveDuration)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();

    if (stool.rapierBody) {
        stool.rapierBody.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased);
        const ct = stool.rapierBody.translation();
        new TWEEN.Tween(ct)
            .to({ x: ct.x + 0.5 }, moveDuration)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(() => {
                stool.rapierBody.setNextKinematicTranslation(ct);
            })
            .start();
    }

    // Timing for first 50% of the clip at 0.75 speed (Buildup Phase)
    const firstHalfWallTimeMs = (clip.duration * 0.5 / 0.75) * 1000;

    // 2. IMMEDIATE ACTION: Zero gravity and wake up all bodies + Start CV Shake/Shatter
    if (scene.world) {
        scene.world.gravity = { x: 0, y: 0, z: 0 };
    }
    if (scene.physicBodies) {
        scene.physicBodies.forEach(body => body.wakeUp());
    }

    // --- 2D DISRUPTION INIT ---
    // Immediate state setup to prevent any early falling
    window._cvState = 'ritual'; // Special state to prevent settlement during buildup
    window._cvGravity = 0.0;    // Match 3D Weightlessness start

    if (typeof cvFall === 'function') {
        cvFall();
    }

    if (typeof cvShake === 'function') {
        cvShake(firstHalfWallTimeMs);
    }

    // 3. TWEEN: Slow start buildup (Gravity Buildup + UI Feedback)
    const progressObj = { value: 0 };

    new TWEEN.Tween(progressObj)
        .to({ value: 100 }, firstHalfWallTimeMs)
        .easing(TWEEN.Easing.Quadratic.In) // "Slow Start"
        .onUpdate(() => {
            const currentG = (progressObj.value / 100) * peakBuildupGravity;
            if (scene.world) {
                scene.world.gravity = { x: 0, y: currentG, z: 0 };
            }

            // --- 2D Gravity Manipulation ---
            // 2D Upwards is negative.
            // Sync: 3D +9.0 -> 2D -1.5 (proportionally strong)
            const cvGVal = - (progressObj.value / 100) * 1.5;
            window._cvGravity = cvGVal;

            // Sync with Cursor Informer
            if (scene.cursorInformerProgressBar) {
                scene.cursorInformerProgressBar.style.height = `${progressObj.value}%`;
            }
            if (scene.cursorInformerText) {
                scene.cursorInformerText.textContent = `${randomChanneling}... ${Math.floor(progressObj.value)}%`;
            }
            if (progressObj.value >= 100) {
                if (scene.cursorInformerBox) scene.cursorInformerBox.style.backgroundColor = 'var(--c-cyan)';
            }
        })
        .onComplete(() => {
            // 4. SNAP: Increase gravity 3x + Trigger 2D Slam
            if (scene.world) {
                scene.world.gravity = { x: 0, y: snapGravity, z: 0 };
            }

            // --- 2D Snap Impact ---
            // 3D gravity goes to +27.0 (HARD UP).
            // So 2D gravity must go to -6.0 (HARD UP).
            // We keep it in 'ritual' state so it doesn't settle and pins to the ceiling
            window._cvGravity = -6.0;

            if (scene.cursorInformerText) {
                scene.cursorInformerText.textContent = '';
            }
            if (scene.conversationManager) {
                scene.conversationManager.shout(randomCast, 3000);
            }

            // Restore normal animation speed for the release phase
            action.timeScale = 1.0;
            console.log(`[Spell Ritual] Peak reached: ${randomCast}. Elements pinned to ceiling.`);
        })
        .start();
}

/**
 * RITUAL: THE ORIGAMI BREACH
 * The cube unfolds into 6 independent faces, linking to the Dragon Eye for a jackpot.
 */
let _cubeRitualActive = false;
export function triggerCubeRitual(scene, cube) {
    if (_cubeRitualActive || !cube) return;
    _cubeRitualActive = true;

    // 1. Snapshot and Hide Original
    cube.visible = false;
    const startPos = cube.position.clone();
    const targetPeakY = startPos.y + 3.5;

    // Preserve and pause physics body if it exists
    const body = (cube.rapierBody) ? cube.rapierBody : null;
    if (body) {
        body.setBodyType(1); // Set to kinematic during ritual
    }

    // 2. Create Origami Group
    const group = new THREE.Group();
    group.position.copy(startPos);
    group.rotation.copy(cube.rotation);
    scene.add(group);

    // --- PREMIUM CORE ---
    // A high-intensity holographic core appearing at the center of the breach
    const coreGeom = new THREE.IcosahedronGeometry(0.35, 1);
    const coreMat = new THREE.MeshStandardMaterial({
        color: "#00F3FF",
        emissive: "#00F3FF",
        emissiveIntensity: 15,
        transparent: true,
        opacity: 0,
        wireframe: true
    });
    const core = new THREE.Mesh(coreGeom, coreMat);
    group.add(core);

    const faces = [];
    const faceConfigs = [
        { pos: [0, 0, 0.5], rot: [0, 0, 0], dir: [0, 0, 1] },
        { pos: [0, 0, -0.5], rot: [0, Math.PI, 0], dir: [0, 0, -1] },
        { pos: [0, 0.5, 0], rot: [-Math.PI / 2, 0, 0], dir: [0, 1, 0] },
        { pos: [0, -0.5, 0], rot: [Math.PI / 2, 0, 0], dir: [0, -1, 0] },
        { pos: [-0.5, 0, 0], rot: [0, -Math.PI / 2, 0], dir: [-1, 0, 0] },
        { pos: [0.5, 0, 0], rot: [0, Math.PI / 2, 0], dir: [1, 0, 0] }
    ];

    faceConfigs.forEach(config => {
        // Use the project's signature Digital Bit-Grid shader factory
        const holoMat = createHologramFaceMat("#00F3FF", 0.0); // Start transparent
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.98, 0.98), holoMat);
        mesh.position.set(...config.pos);
        mesh.rotation.set(...config.rot);
        mesh.userData.dir = new THREE.Vector3(...config.dir);
        group.add(mesh);
        faces.push(mesh);
    });

    // 3. Narrative Link: Dragon Eye
    if (typeof openDragonEye === 'function') {
        openDragonEye(scene, 800);
        updateStory("SECTOR_7_BREACH: SYNCHRONIZING_CORE");
    }

    // 4. STEP 1: ASCENT (The Snappy Pop Up)
    const ascentState = { y: startPos.y, opacity: 0 };
    new TWEEN.Tween(ascentState)
        .to({ y: targetPeakY, opacity: 1.0 }, 450)
        .easing(TWEEN.Easing.Back.Out)
        .onUpdate(() => {
            group.position.y = ascentState.y;
            group.rotation.y += 0.08; // Faster spin during ascent

            // Fade in holographic faces as a single cube unit
            faces.forEach(f => {
                if (f.material.uniforms?.uOpacity) f.material.uniforms.uOpacity.value = ascentState.opacity;
                else f.material.opacity = ascentState.opacity;
            });

            // Sync Rapier body
            if (body) {
                body.setTranslation({ x: group.position.x, y: group.position.y, z: group.position.z }, true);
            }
        })
        .onComplete(() => {
            // STEP 2: THE BREACH (Holographic Unfold)
            // brief dramatic pause at peak (250ms)
            setTimeout(() => {
                const ritualProgress = { unfold: 0, corePulse: 0.1 };

                // Sudden Core Reveal
                coreMat.opacity = 1.0;
                core.scale.setScalar(0.1);

                new TWEEN.Tween(ritualProgress)
                    .to({ unfold: 2.2, corePulse: 1.6 }, 1000)
                    .easing(TWEEN.Easing.Elastic.Out)
                    .onUpdate(() => {
                        faces.forEach(f => {
                            const dist = ritualProgress.unfold;
                            const currentPos = f.userData.dir.clone().multiplyScalar(0.5 + dist);
                            f.position.copy(currentPos);

                            // High-intensity Holographic Flicker
                            if (f.material.uniforms?.uOpacity) {
                                f.material.uniforms.uOpacity.value = 0.7 + Math.random() * 0.3;
                            }
                        });

                        // Core pulsing
                        core.scale.setScalar(ritualProgress.corePulse + Math.sin(performance.now() * 0.015) * 0.15);
                        core.rotation.y += 0.07;
                        core.rotation.z += 0.04;

                        group.rotation.y += 0.01;
                    })
                    .onComplete(() => {
                        // Trigger Coin Jackpot
                        updateStory("CORE_DECRYPTED: REWARD_STREAM_ACTIVE");
                        const coinCount = Math.floor(Math.random() * 5) + 6;
                        for (let i = 0; i < coinCount; i++) {
                            const coinFlip = {
                                x: (Math.random() - 0.5) * 15.0,
                                y: 12.0 + Math.random() * 8.0,
                                z: (Math.random() - 0.5) * 15.0
                            };
                            spawnBitcoin(scene, group.position.clone().add(new THREE.Vector3(0, 0.5, 0)), coinFlip);
                        }

                        // STEP 3: RECONSTRUCTION (Fold back)
                        new TWEEN.Tween(ritualProgress)
                            .to({ unfold: 0, corePulse: 0.1 }, 600)
                            .easing(TWEEN.Easing.Back.In)
                            .delay(1200)
                            .onUpdate(() => {
                                faces.forEach(f => {
                                    f.position.copy(f.userData.dir.clone().multiplyScalar(0.5 + ritualProgress.unfold));
                                    // Gradually fade out holographic grid
                                    if (f.material.uniforms?.uOpacity) {
                                        f.material.uniforms.uOpacity.value = 0.5 + ritualProgress.unfold * 0.5;
                                    }
                                });

                                // Shrink core
                                core.scale.setScalar(Math.max(0.01, ritualProgress.corePulse));
                                coreMat.opacity = Math.max(0, ritualProgress.corePulse);

                                group.rotation.z += 0.05;
                            })
                            .onComplete(() => {
                                // Stage 4: THE FALL (Restore Physics)
                                scene.remove(group);
                                cube.visible = true;
                                cube.position.copy(group.position);
                                cube.rotation.copy(group.rotation);

                                if (body) {
                                    // Sync body position to the peak before setting to dynamic
                                    body.setTranslation({ x: group.position.x, y: group.position.y, z: group.position.z }, true);
                                    body.setRotation({ x: cube.quaternion.x, y: cube.quaternion.y, z: cube.quaternion.z, w: cube.quaternion.w }, true);
                                    body.setBodyType(0); // Restore to dynamic
                                    body.applyImpulse({ x: 0, y: -2, z: 0 }, true); // Slight downward nudge to start fall
                                }

                                _cubeRitualActive = false;
                                updateStory("SYSTEM_STABLE: CORE_REINTEGRATED");
                                if (typeof closeDragonEye === 'function') closeDragonEye(scene, 1000);
                            })
                            .start(); // End Step 3
                    })
                    .start(); // End Step 2
            }, 250);
        })
        .start(); // End Step 1
}
