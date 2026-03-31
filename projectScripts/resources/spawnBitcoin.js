import * as THREE from 'three';
import * as RAYCAST from '../raycast/addRaycaster.js';
import RAPIER from '@dimforge/rapier3d-compat';
import { bindBodyObject, getFreeFormBodyShapeFromMesh } from '../rapierPhysics/addRapierWorld.js';
import TWEEN from 'tween';
import * as CONSTANTS from '../utils/constant.js';
import * as B64 from '../utils/base64Strings.js';
import * as DB from './addDragonBalls.js';
import { updateStory } from '../utils/status.js';
import { fetchTop10Cryptos } from '../utils/fetchCryptoData.js';
import { playOneShotAnimation } from '../utils/animationManager.js';
import { watchApex, startKinematicReturn } from '../utils/physicsUtils.js';
import { shootDroneBeam, updateDroneGaze, registerInMap, removeFromMap, getObj } from '../scenario/scenarioUtility.js';
import { triggerGridFlash } from '../utils/integrityCheck.js';

// --- Skinned Mesh Helper: Get precise position during animation ---
function getLiveModelPosition(object) {
    if (!object) return new THREE.Vector3(0, 0, 0);

    // If it's a SkinnedMesh, the best "logic" center is the root bone
    if (object.skeleton && object.skeleton.bones.length > 0) {
        const rootBone = object.skeleton.bones[0];
        const pos = new THREE.Vector3();
        rootBone.getWorldPosition(pos);
        return pos;
    }

    // Fallback: Ensure Matrix is updated before getting world position
    object.updateMatrixWorld(true);
    const fallbackPos = new THREE.Vector3();
    object.getWorldPosition(fallbackPos);
    return fallbackPos;
}

// Shared materials for Bitcoins (Lazy loaded)
let sharedBitcoinMat = null;
let sharedBitcoinAuraMat = null;

// Price Cache
let cryptoPrices = {};
let lastCoinType = null;

// Initial Fetch (Non-blocking)
fetchTop10Cryptos().then(data => {
    data.forEach(coin => {
        cryptoPrices[coin.symbol.toLowerCase()] = coin.current_price;
    });
    // console.log("Crypto Prices Cached:", cryptoPrices);
});

// Coin Management
export const activeCoins = [];
const inactiveBTC = [];
const inactiveETH = [];
const dyingCoins = [];
const MAX_COINS = 120; // Hard Limit (Mesh Pool)
const VISUAL_LIMIT = 60; // Soft Limit (Trigger Eviction)


function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

// --- Informer Helpers ---
// Use shared helpers from addRaycaster.js
const setInformerBg = (scene, b64, text) => {
    if (scene.raycasterWrapper?.mouseInContainer) {
        RAYCAST.setInformerBg(scene, b64, text);
        document.body.style.cursor = 'pointer';
    }
};

const hideInformer = (scene) => {
    RAYCAST.hideInformer(scene);
    document.body.style.cursor = 'auto';
};


// =========================================================
// BLACKHOLE RITUAL — Main Orchestrator for Bulb Click
// =========================================================
// Sequence:
//   1. Dragon balls collapse INTO the blackhole (Cubic.In, 800ms)
//   2. BH scale-pulse flashes (1 → 1.5 → 1)
//   3. Coin erupts from BH position toward hero
//   4. Dragon balls scatter back radially
export function alignDragonBallsAndDropBitcoin(scene, bulbObj) {
    const latheCenterObj = scene.getObjectByName("Lathe_Center");
    const bhPos = new THREE.Vector3();
    if (latheCenterObj) {
        latheCenterObj.getWorldPosition(bhPos);
    } else {
        bhPos.set(-8.5, 7.25, -0.39); // Fallback
    }

    // Hero target for coin impulse
    const hero = scene.getObjectByName('a-char');
    const heroPos = new THREE.Vector3();
    if (hero) {
        hero.getWorldPosition(heroPos);
    } else {
        heroPos.set(0, 1, 0);
    }
    heroPos.y += 0.8;

    updateStory("Dragon Balls drawn to the singularity...");

    // --- RITUAL FAN SURGE (Phase 1: Acceleration) ---
    if (scene.fanAction) {
        new TWEEN.Tween(scene.fanAction)
            .to({ timeScale: 12.0 }, 1500) // Aggressive build-up
            .easing(TWEEN.Easing.Quadratic.In)
            .start();
    }

    // Step 1: Collapse balls into BH
    collapseDragonBallsIntoBH(scene, bhPos, () => {

        // Step 2: BH Flash at convergence peak
        triggerBHFlash(scene, latheCenterObj);

        // Step 3: Spawn coin ~250ms after flash starts (at flash peak)
        setTimeout(() => {
            if (scene._spawnStopSignal) return; // KILL!
            const targetDropPos = heroPos.clone();
            // Point above hero with mini random offset
            targetDropPos.y += 6.0 + Math.random() * 2.5;
            targetDropPos.x += (Math.random() - 0.5) * 1.5;
            targetDropPos.z += (Math.random() - 0.5) * 1.5;

            const coin = spawnBitcoin(scene, bhPos.clone(), null);
            if (coin && coin.rapierBody) {
                const body = coin.rapierBody;

                // Set to kinematic for controlled tween
                body.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased);

                const startPos = bhPos.clone();
                const currentPos = startPos.clone();

                // DYNAMIC DISTANCE ENHANCEMENT: 1.5x the travel distance from BH
                const travelVector = new THREE.Vector3().subVectors(targetDropPos, bhPos);
                targetDropPos.addVectors(bhPos, travelVector.multiplyScalar(1.5));

                let activeBeam = null;
                const TWEEN_DURATION = 1400; // Slightly longer for the extra distance

                new TWEEN.Tween(currentPos)
                    .to({ x: targetDropPos.x, y: targetDropPos.y, z: targetDropPos.z }, TWEEN_DURATION)
                    .easing(TWEEN.Easing.Cubic.Out) // Faster start, cinematic finish
                    .onStart(() => {
                        const beamName = 'coin-erupt-beam';
                        const coinColor = 0xFFD700; // Uniform Gold for all coins

                        // Start the endless manual beam
                        if (shootDroneBeam) {
                            shootDroneBeam(scene, "", "", bhPos.clone(), beamName, false, coinColor, true, Infinity, true);
                            activeBeam = scene.getObjectByName(beamName);
                        }
                    })
                    .onUpdate(() => {
                        body.setNextKinematicTranslation(currentPos);

                        // --- Visual Polish: Scale Pulse while mid-air ---
                        // t goes from 0 to 1 based on distance traveled
                        const distToStart = currentPos.distanceTo(startPos);
                        const totalDist = targetDropPos.distanceTo(startPos);
                        const progress = totalDist > 0 ? distToStart / totalDist : 0;
                        const scalePulse = 1.0 + Math.sin(progress * Math.PI) * 0.4;
                        coin.scale.setScalar(0.5 * scalePulse);

                        // --- Dynamic Beam Update ---
                        const drone = getObj(scene, 'drone');
                        if (activeBeam && activeBeam.visible && drone) {
                            const eye = drone.getObjectByName('Sphere001_0'); // Nested check on local ref is fine
                            if (eye) {
                                const beamStart = new THREE.Vector3();
                                eye.getWorldPosition(beamStart);

                                const dist = beamStart.distanceTo(currentPos);
                                activeBeam.position.copy(beamStart);
                                activeBeam.lookAt(currentPos);
                                activeBeam.children.forEach(child => {
                                    child.scale.z = dist;
                                });

                                // Face the coin
                                if (scene.gazeFollower) {
                                    scene.gazeFollower.lookAtTarget(coin);
                                }
                            }
                        }
                    })
                    .onComplete(() => {
                        // Restore base scale before drop
                        coin.scale.setScalar(0.5);

                        // Hide beam
                        const beamName = 'coin-erupt-beam';
                        const droneBeam = scene.getObjectByName(beamName);
                        if (droneBeam) {
                            droneBeam.visible = false;
                            if (droneBeam.activeRequestID) cancelAnimationFrame(droneBeam.activeRequestID);
                        }

                        // Drop it!
                        body.setBodyType(RAPIER.RigidBodyType.Dynamic);
                        body.wakeUp();
                        // CELEBRATORY POP: Stronger upward kick
                        body.applyImpulse({
                            x: (Math.random() - 0.5) * 6.0,
                            y: 18.0 + Math.random() * 12.0, // Stronger celebratory pop
                            z: (Math.random() - 0.5) * 6.0
                        }, true);
                    })
                    .start();
            }
        }, 250);

        // Step 4: Scatter dragon balls back after flash
        setTimeout(() => {
            if (scene._spawnStopSignal) return; // KILL!
            scatterDragonBalls(scene, bhPos);
        }, 500);
    });
}

// --- Helper: Collapse Dragon Balls INTO the Blackhole ---
// Collision group constants: Rapier uses a 32-bit filter (upper 16 = membership, lower 16 = mask)
const CG_GHOST = 0x00020002; // Group 2 only collides with group 2 (effectively no room objects)
const CG_ALL = 0xFFFFFFFF; // Collides with everything (default)

function setCollisionGroup(ball, scene, groupFilter) {
    if (!ball.rapierBody || !scene.world) return;
    try {
        const handle = ball.rapierBody.collider(0);
        const collider = scene.world.getCollider(handle);
        if (collider) {
            collider.setCollisionGroups(groupFilter);
            collider.setSolverGroups(groupFilter);
        }
    } catch (e) { /* Rapier API variance — safe to ignore */ }
}

function collapseDragonBallsIntoBH(scene, targetPos, onComplete) {
    DB.toggleGravityState(scene, false);

    setTimeout(() => {
        const balls = scene.dragonBalls || [];
        const validBalls = balls.filter(b => b);

        if (validBalls.length === 0) {
            if (onComplete) onComplete();
            return;
        }

        let remaining = validBalls.length;

        validBalls.forEach((ball, i) => {
            // Capture original scale for the ritual restoration
            ball.ritualStartScale = ball.scale.clone();
            const startPos = ball.position.clone();

            // 1. Kinematic: owns its position
            if (ball.rapierBody) {
                ball.rapierBody.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased);
            }

            // 2. Ghost group: ball will no longer push the monitor/floor/chair
            //    Safe because it only modifies the ball's own filter, not the global island
            setCollisionGroup(ball, scene, CG_GHOST);

            // Per-ball stagger: spread start times so they don't all arrive simultaneously
            const staggerDelay = i * 60; // 60ms between each ball's start

            setTimeout(() => {
                const delayedStart = ball.position.clone();

                // Direction vector for the travel axis
                const baseDir = new THREE.Vector3()
                    .subVectors(targetPos, delayedStart)
                    .normalize();

                // Phase offset so each ball starts at a different point on the orbit ring
                const helixPhase = (i / Math.max(validBalls.length, 1)) * Math.PI * 2;

                const tweenObj = { t: 0 };
                new TWEEN.Tween(tweenObj)
                    .to({ t: 1 }, 1000)
                    .easing(TWEEN.Easing.Cubic.In) // Accelerates into singularity
                    .onUpdate(() => {
                        const t = tweenObj.t;

                        // Base: straight-line lerp
                        const base = new THREE.Vector3().lerpVectors(delayedStart, targetPos, t);

                        // Arc: rise high above room at t=0.5, then dive in
                        // This provides the "vaulting" effect the user preferred
                        base.y += Math.sin(t * Math.PI) * 5.0;

                        // Helix: XZ pseudo-spiral with bell-curve radius
                        // t*(1-t)*4 peaks at 0.5 -> 0 at start/end to prevent pops
                        const helixAngle = t * Math.PI * 3 + helixPhase;
                        const radius = t * (1 - t) * 4 * 2.0;

                        // Perpendicular axis (approx XZ perp)
                        const perp = new THREE.Vector3(-baseDir.z, 0, baseDir.x).normalize();
                        base.addScaledVector(perp, Math.cos(helixAngle) * radius);
                        // Subtle vertical oscillation using the same axis
                        base.y += Math.sin(helixAngle) * radius * 0.5;

                        if (ball.rapierBody) {
                            ball.rapierBody.setNextKinematicTranslation(base);
                        }

                        // --- SHRINK EFFECT ---
                        // Shrink to 10% of original scale as it approaches the singularity
                        const scaleFactor = 1.0 - (t * 0.9);
                        if (ball.ritualStartScale) {
                            ball.scale.copy(ball.ritualStartScale).multiplyScalar(scaleFactor);
                        }
                    })
                    .onComplete(() => {
                        ball.visible = false;
                        remaining--;
                        if (remaining === 0 && onComplete) onComplete();
                    })
                    .start();
            }, staggerDelay);
        });
    }, 150);
}

// --- Helper: BH Rotation Surge ---
// Reverse direction (negative Y) + Back.Out: fast burst that overshoots then snaps back
// — feels like the singularity "flicks" to eject the coin.
function triggerBHFlash(scene, bhMesh) {
    if (!bhMesh) return;

    // --- INTEGRATED NEBULA SURGE ---
    // Instead of a "lazy" angle offset, we modulate the underlying speed math.
    // This makes the particles "warp" and swirl faster during the ejection peak.
    const hub = scene.globalUniformsHub;
    if (hub && hub.uNebulaRotationSpeed && hub.uNebulaSwirlSpeed) {
        const baseRotSpeed = 0.3;
        const baseSwirlSpeed = 0.25;
        const peakRotSpeed = 3.0;   // Reduced rotation for specific "Swirl" focus
        const peakSwirlSpeed = 25.0; // DRAMATIC Swirl surge

        new TWEEN.Tween({ rot: baseRotSpeed, swirl: baseSwirlSpeed })
            .to({ rot: peakRotSpeed, swirl: peakSwirlSpeed }, 600)
            .easing(TWEEN.Easing.Exponential.Out)
            .onUpdate((obj) => {
                hub.uNebulaRotationSpeed.value = obj.rot;
                hub.uNebulaSwirlSpeed.value = obj.swirl;
            })
            .onComplete(() => {
                // Smooth decay back to idle
                new TWEEN.Tween({ rot: peakRotSpeed, swirl: peakSwirlSpeed })
                    .to({ rot: baseRotSpeed, swirl: baseSwirlSpeed }, 1500)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .onUpdate((obj) => {
                        hub.uNebulaRotationSpeed.value = obj.rot;
                        hub.uNebulaSwirlSpeed.value = obj.swirl;
                    })
                    .start();
            })
            .start();
    }

    // --- RITUAL FAN SURGE (Phase 2: Deceleration) ---
    if (scene.fanAction) {
        new TWEEN.Tween(scene.fanAction)
            .to({ timeScale: 1.0 }, 2500) // Long smooth decay back to normal
            .easing(TWEEN.Easing.Cubic.Out)
            .start();
    }

    if (scene.raycasterWrapper) {
        RAYCAST.adjustNebula(scene);
    }
}

// --- Helper: Scatter Dragon Balls radially from BH ---
function scatterDragonBalls(scene, origin) {
    const balls = scene.dragonBalls || [];

    balls.forEach((ball, i) => {
        if (!ball) return;

        // Teleport body back to BH origin before releasing
        if (ball.rapierBody) {
            ball.rapierBody.setTranslation({ x: origin.x, y: origin.y, z: origin.z }, true);
            ball.rapierBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
            ball.rapierBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
        }

        // Reveal
        ball.visible = true;

        // --- RESTORE SCALE ---
        if (ball.ritualStartScale) {
            ball.scale.copy(ball.ritualStartScale);
        }

        // Restore FULL collision groups BEFORE switching to Dynamic (order matters in Rapier)
        setCollisionGroup(ball, scene, CG_ALL);

        // Now switch back to full Dynamic physics
        if (ball.rapierBody) {
            ball.rapierBody.setBodyType(RAPIER.RigidBodyType.Dynamic);
            ball.rapierBody.wakeUp();

            // Evenly distributed radial scatter with strong outward force
            const angle = (i / Math.max(balls.length, 1)) * Math.PI * 2 + Math.random() * 0.4;
            const hForce = 20 + Math.random() * 15; // Was 10-22, now 20-35
            const vForce = 10 + Math.random() * 8;  // Was 4-10, now 10-18

            ball.rapierBody.applyImpulse({
                x: Math.cos(angle) * hForce,
                y: vForce,
                z: Math.sin(angle) * hForce
            }, true);
            ball.rapierBody.applyTorqueImpulse({
                x: (Math.random() - 0.5) * 4,
                y: (Math.random() - 0.5) * 4,
                z: (Math.random() - 0.5) * 4
            }, true);
        }
    });
}

// Unified Alignment Helper: Used by Bulb, Wall, and Integrity Check
export function alignDragonBalls(scene, targetPosParam = null, onComplete = null) {
    // 🛡️ SAFETY GUARD: If Rapier is busy (e.g., stepping), defer to next frame to avoid aliasing error.
    if (scene.world && scene.world.isBusy) {
        setTimeout(() => alignDragonBalls(scene, targetPosParam, onComplete), 16);
        return;
    }
    // 0. Save the current gravity state before resetting it
    const wasGravityActive = scene.world.hasPointGravityOnBalls;

    // Clear any existing restoration timeouts to prevent overlapping
    if (scene._dragonBallRestoreTimeout) {
        clearTimeout(scene._dragonBallRestoreTimeout);
        scene._dragonBallRestoreTimeout = null;
    }

    // 1. Turn off point gravity if active
    DB.toggleGravityState(scene, false);

    const balls = scene.dragonBalls || [];
    if (balls.length === 0) {
        if (onComplete) onComplete();
        return;
    }

    // Determine Center (Default to Cat if no param)
    const centerPos = new THREE.Vector3(0, 0.8, 0);
    if (targetPosParam) {
        centerPos.copy(targetPosParam);
    } else {
        const cat = scene.getObjectByName("Object_108");
        const liveCatPos = getLiveModelPosition(cat);
        centerPos.copy(liveCatPos);
        centerPos.y += 0.25; // Hover Offset
    }

    const radius = 1.035; // Increased by 15% (from 0.9)
    const baseStrength = 5.0; // "Gathering" energy
    const resetDuration = 1200;
    const targetEndTime = performance.now() + resetDuration + 200;

    let remaining = balls.length;

    balls.forEach((ball, index) => {
        if (!ball || !ball.rapierBody) return;

        const body = ball.rapierBody;

        // Ghost mode during flight
        if (body.rapierCollider) body.rapierCollider.setSensor(true);

        // Calculate slot in the circle
        const angle = (index / balls.length) * Math.PI * 2;
        const tx = centerPos.x + Math.cos(angle) * radius;
        const ty = centerPos.y;
        const tz = centerPos.z + Math.sin(angle) * radius;

        // --- Phase 1: Physical Jump ---
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

        // --- Phase 2: Apex Catch & Bezier Return ---
        watchApex(body, () => {
            const targetPos = new THREE.Vector3(tx, ty, tz);
            const targetQuat = new THREE.Quaternion(); // Neutral landing

            const beamName = `dragon-beam-${index}`;
            // Trigger Drone Beam on apex catch
            let activeBeam = null;
            if (shootDroneBeam) {
                const currentBodyPos = body.translation();
                const ballColor = 0xFF8C00; // Themed Orange for Dragon Balls
                shootDroneBeam(scene, "", "", new THREE.Vector3(currentBodyPos.x, currentBodyPos.y, currentBodyPos.z), beamName, true, ballColor, true, Infinity, true);
                activeBeam = scene.getObjectByName(beamName);
            }

            // TRIGGER START (Sustained)
            scene._activeResetCount = (scene._activeResetCount || 0) + 1;
            if (triggerGridFlash) triggerGridFlash(scene, true);

            startKinematicReturn(body, targetPos, targetQuat, targetEndTime, RAPIER.RigidBodyType.Dynamic, () => {
                // onComplete: hide beam
                if (activeBeam) {
                    activeBeam.visible = false;
                    if (activeBeam.activeRequestID) cancelAnimationFrame(activeBeam.activeRequestID);
                }

                // TRIGGER END (Release sustain)
                scene._activeResetCount--;
                if (triggerGridFlash) triggerGridFlash(scene, false);


                remaining--;
                if (remaining === 0) {
                    if (onComplete) onComplete();

                    // Release Gaze Lock after ritual
                    if (scene.gazeFollower) {
                        scene.gazeFollower.isLocked = false;
                        updateDroneGaze(scene, scene.camera, false);
                    }

                    // --- NARRATIVE RESTORATION LOGIC ---
                    if (wasGravityActive) {
                        // After 3 seconds, the "spell" wears off or they "recharge", breaking formation
                        scene._dragonBallRestoreTimeout = setTimeout(() => {
                            // Only restore if they are still physically valid bodies
                            if (scene.world && scene.world.ballBodies) {
                                DB.toggleGravityState(scene, true);
                            }
                            scene._dragonBallRestoreTimeout = null;
                        }, 3000);
                    }
                }
            }, (currentPoint, t) => {
                // onUpdate: update beam (PERFORMANCE: use cached activeBeam)
                const drone = scene.getObjectByName('drone');
                if (activeBeam && activeBeam.visible && drone) {
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

                        // Head follows the group's "average" target or center
                        if (index === 0) {
                            updateDroneGaze(scene, centerPos, true);
                        }
                    }
                }
            });
        });
    });
}


// --- COIN SPAWN ---
export function spawnBitcoin(scene, spawnLocation, impulse, silent = false, forcedType = null) {
    const btcSymbol = scene.getObjectByName("btc_symbol");
    const ethSymbol = scene.getObjectByName("eth_symbol"); // Assuming this exists

    if (!btcSymbol) {
        console.warn("btc_symbol not found in scene");
        return;
    }

    const coinScale = 0.5;

    // Initialize shared materials if first run
    if (!sharedBitcoinMat) {
        // Use the NEW solid bitcoin material for the coin itself
        sharedBitcoinMat = CONSTANTS.bitcoinMat.clone();
        // Aura can still use the outer glow mat
        sharedBitcoinAuraMat = CONSTANTS.goldOscillatingOuterGlowMat.clone();
    }

    // 1. SELECT TYPE
    let type = "BTC";
    let template = btcSymbol;

    if (forcedType) {
        type = (forcedType === "ETH") ? "ETH" : "BTC";
        template = (type === "ETH") ? ethSymbol : btcSymbol;
    } else {
        // 50/50 Chance if ETH exists
        if (ethSymbol && Math.random() > 0.5) {
            type = "ETH";
            template = ethSymbol;
        }
    }

    let coin = null;
    let isReused = false;

    // 2. ENFORCE LIMITS
    // Soft Limit check -> Trigger eviction
    let evictedType = null;
    if (activeCoins.length >= VISUAL_LIMIT) {
        // Find oldest active coin to evict
        const victim = activeCoins.shift();
        if (victim) {
            evictedType = victim.userData.coinType;
            evictCoin(scene, victim);
        }
    }

    // Hard Limit check -> Force recycle immediately if we are totally full
    if (activeCoins.length + dyingCoins.length >= MAX_COINS) {
        // If we are here, we are desperate. Try to take from dying pool first.
        let recycled = dyingCoins.shift();

        if (!recycled && activeCoins.length > 0) {
            // Extremely rare case: All dying, or activeCoins full of non-evicted?
            // Just take oldest active
            recycled = activeCoins.shift();
        }

        if (recycled) {
            // Force cleanup of the recycled coin so it can be used below
            cleanupCoin(scene, recycled);

            // Check type stuck on userData and push to pool so step 3 can find it
            if (recycled.userData.coinType === "ETH") {
                inactiveETH.push(recycled);
            } else {
                inactiveBTC.push(recycled);
            }
        }
    }

    // 3. TRY REUSE FROM POOL
    const pool = (type === "ETH") ? inactiveETH : inactiveBTC;
    if (pool.length > 0) {
        coin = pool.shift();
        isReused = true;
        coin.visible = true;
        // Re-register in map since it was removed during pooling
        registerInMap(scene, coin);
    } else {
        // Create NEW
        coin = template.clone();
        coin.scale.setScalar(coinScale);
        coin.name = `${type}_${performance.now()} `;
        coin.userData.coinType = type; // Mark type
        coin.material = sharedBitcoinMat;

        registerInMap(scene, coin);

        const aura = coin.clone();
        aura.name = "Aura";
        aura.material = sharedBitcoinAuraMat;
        aura.position.set(0, 0, 0);
        aura.rotation.set(0, 0, 0);
        aura.scale.setScalar(1.25);
        coin.add(aura);

        scene.add(coin);
    }

    // Add to end of active queue
    activeCoins.push(coin);

    // 4. RESET STATE (Position & Rotation)
    // Use passed spawnLocation (Vector3)
    if (spawnLocation) {
        coin.position.copy(spawnLocation);
    }

    coin.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

    const originalScale = template.scale.clone();
    const targetScale = originalScale.clone();

    // 5. PHYSICS & BLACKHOLE
    if (scene.world) {
        const body = (isReused && coin.rapierBody) ? coin.rapierBody : null;

        if (body) {
            // Wake and Teleport existing body
            body.wakeUp();
            body.setTranslation({ x: spawnLocation.x, y: spawnLocation.y, z: spawnLocation.z }, true);
            body.setLinvel({ x: 0, y: 0, z: 0 }, true);
            body.setAngvel({ x: 0, y: 0, z: 0 }, true);
        } else {
            // Create NEW Body
            const { body: newBody, shape } = getFreeFormBodyShapeFromMesh(scene, coin, {
                bodyType: 'dynamic',
                mass: 1.0,
                restitution: 0.2, // Low bounciness
                friction: 0.8,    // High friction
                canSleep: true,
                isConvexHull: true,
                isBhTarget: true,
                linearDamping: 0.8, // Reduced damping for longer flight
                angularDamping: 0.8
            });
            bindBodyObject(scene, coin, newBody, shape);
        }

        // Apply Passed Impulse (Common to both path)
        const finalBody = coin.rapierBody;
        if (finalBody) {
            if (impulse) {
                finalBody.applyImpulse({ x: impulse.x, y: impulse.y, z: impulse.z }, true);
            }
            finalBody.applyTorqueImpulse({ x: Math.random(), y: Math.random(), z: Math.random() }, true);

            // Re-add to BH targets if removed by cleanupCoin
            if (scene.bhTargets && !scene.bhTargets.includes(coin)) {
                scene.bhTargets.push(coin);
            }
        }
    }

    // 6. RAYCAST (Only needs to be added ONCE per object)
    if (!isReused) {
        // const label = (type === "ETH") ? "Push Ethereum" : "Push Bitcoin";
        RAYCAST.addRaycastObject(scene, coin, {
            onMouseEnter: (obj) => {
                // Determine Label (Price or Default)
                const price = cryptoPrices[type.toLowerCase()];
                let label = `Push ${type}`;

                if (price) {
                    // Format Price: $65,000 or $0.50
                    const formattedPrice = price.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: price < 1 ? 4 : 0,
                        maximumFractionDigits: price < 1 ? 4 : 0,
                    });

                    const now = new Date();
                    const month = now.toLocaleString('en-US', { month: 'short' });
                    const day = now.getDate();
                    const year = now.getFullYear();
                    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

                    label = `${type}: ${formattedPrice} \nat ${month}${day} ${year}, ${time}`;
                }

                // Choose Icon
                const icon = (type === "ETH") ? B64.eth : B64.btc;

                // "Push" icon -> Now Coin Icon
                setInformerBg(scene, icon, label);
                RAYCAST.highlightObject(scene, obj);
            },
            onMouseLeave: (obj) => {
                hideInformer(scene);

            },
            onMouseDown: (clickedObj, intersect) => {
                // Apply Force (Jump) using Raycaster helper
                RAYCAST.applyImpulse(scene, clickedObj, intersect, 5.0);
            }
        });
    }

    // --- FIREFLY EFFECT ---
    if (!silent && scene.fireflies && scene.fireflies.triggerFlash) {
        if (lastCoinType !== type) {
            scene.fireflies.triggerFlash(type);
            lastCoinType = type;
        }
    }

    // Diagnostic Check: Pool Status
    if (activeCoins.length % 5 === 0) {
        // Debug log removed
    }

    // Update Story with Coin Name
    if (!silent) {
        const coinName = type === "BTC" ? "Bitcoin" : "Ethereum";
        if (evictedType) {
            const victimName = evictedType === "BTC" ? "Bitcoin" : "Ethereum";
            updateStory(`Received 1 ${coinName}, lost 1 ${victimName}. Even you can't hold that much power!`);
        } else {
            updateStory(`The Cosmos has manifested 1 ${coinName} just for you!`);
        }
    }

    // 7. ANIMATION (Pop In + Oscillation)
    // Always restart the pop-in tween
    const startScaleVal = 0.1;
    coin.scale.copy(originalScale).multiplyScalar(coinScale * startScaleVal);

    const progress = { t: 0 };

    // Reset UserData for Oscillation
    coin.userData.oscStrength = 5;
    const auraObj = coin.getObjectByName("Aura");
    if (auraObj) auraObj.userData.oscStrength = 5;

    // Apply Uniform Overrides (Only needed once)
    if (!isReused) {
        const applyOscillationOverride = (mesh) => {
            mesh.onBeforeRender = function (renderer, scene, camera, geometry, material, group) {
                if (material.uniforms && material.uniforms.uOscillationStrength) {
                    this.userData.prevOsc = material.uniforms.uOscillationStrength.value;
                    material.uniforms.uOscillationStrength.value = this.userData.oscStrength;
                }
            };
            mesh.onAfterRender = function (renderer, scene, camera, geometry, material, group) {
                if (material.uniforms && material.uniforms.uOscillationStrength && this.userData.prevOsc !== undefined) {
                    material.uniforms.uOscillationStrength.value = this.userData.prevOsc;
                }
            };
        };
        applyOscillationOverride(coin);
        if (auraObj) applyOscillationOverride(auraObj);
    }

    // Store the tween so we can stop it if the coin is pooled early (Lag Fix)
    if (coin.userData.activeTween) coin.userData.activeTween.stop();
    coin.userData.activeTween = new TWEEN.Tween(progress)
        .to({ t: 1 }, 5000)
        .easing(TWEEN.Easing.Cubic.Out)
        .onUpdate(() => {
            const t = progress.t;
            // Scale Tween
            coin.scale.lerpVectors(originalScale.clone().multiplyScalar(coinScale * startScaleVal), targetScale.clone().multiplyScalar(coinScale), t);

            // Oscillation Tween (5 -> 0)
            const currentOsc = 5 * (1 - t);
            coin.userData.oscStrength = currentOsc;
            if (auraObj) auraObj.userData.oscStrength = currentOsc;
        })
        .onComplete(() => {
            coin.userData.activeTween = null;
        })
        .start();

    return coin;
}


// Helper: Evict Coin (Throw to Window)
export function evictCoin(scene, coin) {
    // Stress Check: If we have too many dying coins, do a SILENT eviction 
    // to save TWEEN and Physics overhead.
    if (dyingCoins.length > 40) {
        cleanupCoin(scene, coin);
        // Return to pool immediately
        if (coin.userData.coinType === "ETH") {
            inactiveETH.push(coin);
        } else {
            inactiveBTC.push(coin);
        }
        return;
    }

    dyingCoins.push(coin);

    if (coin.rapierBody) {
        // Ensure Dynamic
        coin.rapierBody.setBodyType(RAPIER.RigidBodyType.Dynamic);
        coin.rapierBody.wakeUp();

        // Calculate Direction to Window (6, 7, 8)
        const targetPos = new THREE.Vector3(6, 7, 8);
        const direction = new THREE.Vector3().subVectors(targetPos, coin.position).normalize();

        // Force Strength
        const force = 30.0;
        direction.multiplyScalar(force);

        // Apply Impulse
        coin.rapierBody.applyImpulse({ x: direction.x, y: direction.y, z: direction.z }, true);

        // Add random rotation
        coin.rapierBody.applyTorqueImpulse({
            x: Math.random(),
            y: Math.random(),
            z: Math.random()
        }, true);
    }

    // Cleanup after delay (simulate flight time)
    // Animate disappearance (Scale to 0) before cleanup
    if (coin.userData.activeTween) coin.userData.activeTween.stop();
    coin.userData.activeTween = new TWEEN.Tween(coin.scale)
        .to({ x: 0, y: 0, z: 0 }, 500)
        .delay(1500) // Fly for 1.5s
        .easing(TWEEN.Easing.Back.In)
        .onComplete(() => {
            coin.userData.activeTween = null;
            cleanupCoin(scene, coin);

            // Remove from dyingCoins array
            const idx = dyingCoins.indexOf(coin);
            if (idx > -1) dyingCoins.splice(idx, 1);

            // Return to pool
            if (coin.userData.coinType === "ETH") {
                inactiveETH.push(coin);
            } else {
                inactiveBTC.push(coin);
            }
        })
        .start();
}

// Helper: Force Cleanup Coin
export function cleanupCoin(scene, coin) {
    if (!coin) return;
    if (scene.world && scene.world.ballBodies && scene.world.ballBodies.includes(coin.rapierBody)) {
        // remove it from the array
        scene.world.ballBodies.splice(scene.world.ballBodies.indexOf(coin.rapierBody), 1);
    }
    // Optimization: Remove from BH targets when pooled to save loop overhead
    if (scene.bhTargets && scene.bhTargets.includes(coin)) {
        scene.bhTargets.splice(scene.bhTargets.indexOf(coin), 1);
    }

    // NEW: Clean up from the high-performance map when pooled
    removeFromMap(scene, coin.name);

    // Optimization: Stop all active tweens on the coin when pooled
    // Completed tweens are automatically removed by the engine.
    if (coin.userData.activeTween) {
        coin.userData.activeTween.stop();
        coin.userData.activeTween = null;
    }
    coin.visible = false;
    if (coin.rapierBody) {
        // Reset to Dynamic (default state for pool) or Sleep
        // We sleep it far away
        coin.rapierBody.setBodyType(RAPIER.RigidBodyType.Dynamic);
        coin.rapierBody.setTranslation({ x: 0, y: -100, z: 0 }, true);
        coin.rapierBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
        coin.rapierBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
        coin.rapierBody.sleep();

        // NEW: Cleanup orphaned beams
        const beamName = `coin-integrity-beam-${coin.rapierBody.handle}`;
        const beam = scene.getObjectByName(beamName);
        if (beam) {
            beam.visible = false;
            if (beam.activeRequestID) cancelAnimationFrame(beam.activeRequestID);
        }
    }
}

/**
 * Purge All Active Coins (Optimized for Performance)
 * Per user request: removed animations and individual tweens to prevent stutter.
 * This now performs a direct cleanup of all coins.
 */
export function purgeAllCoins(scene) {
  // Use the robust, bulletproof snapPurge which cleans arrays and the scene
  snapPurgeCoins(scene);
}

/**
 * Snap Purge Coins (for Flash Peak)
 * Immediately cleans up all coins without any animation or physics simulation.
 * Designed for scenarios where instant removal is critical, e.g., during a flash peak.
 */
export function snapPurgeCoins(scene) {
    // 1. Array-based cleanup (Consolidate Targets)
    const allTargetCoins = [...activeCoins, ...dyingCoins];
    
    // Immediately clear arrays to prevent double-processing while the async loop runs
    activeCoins.length = 0;
    dyingCoins.length = 0;

    // 2. Perform STAGGERED Cleanup (Avoid 3s Lock)
    // We process coins in batches of 5 to spread the CPU/Physics cost.
    let index = 0;
    const batchSize = 5;

    const processBatch = () => {
        // KILL GUARD: If the scene is no longer valid, stop
        if (!scene) return;

        const end = Math.min(index + batchSize, allTargetCoins.length);
        for (let i = index; i < end; i++) {
            const coin = allTargetCoins[i];
            if (coin) cleanupCoin(scene, coin);
        }

        index = end;
        if (index < allTargetCoins.length) {
            requestAnimationFrame(processBatch);
        } else {
            // 3. Final Scene Sweep (Deep Fallback)
            // This catches any orphaned coins that might have been spawned during the purge.
            // We run this once at the end.
            scene.children.forEach(obj => {
                if (obj && obj.name && (obj.name.startsWith('BTC_') || obj.name.startsWith('ETH_'))) {
                    if (obj.visible) cleanupCoin(scene, obj);
                }
            });
        }
    };

    if (allTargetCoins.length > 0) {
        processBatch();
    }
}

// =========================================================
// END OF FILE
// =========================================================
