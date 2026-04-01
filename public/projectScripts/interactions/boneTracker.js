import * as THREE from 'three';
import TWEEN from 'tween';
import { createHologramBeam, projectDOMToWorld } from '../utils/hologramEffects.js';
import { updateDroneGaze, triggerDroneHitEffect } from '../scenario/scenarioUtility.js';
import { updateStory } from '../utils/status.js';
import { spawnBitcoin } from '../resources/spawnBitcoin.js';
export class BoneTracker {
    constructor(scene, boneName = "mixamorigRightHand") {
        this.scene = scene;
        this.boneName = boneName;
        this.element = null;
        this.targetBone = null;
        this.isActive = false; // Start inactive, toggled by 'T'

        this.originalParent = null;
        this.originalStyle = {};
        this.originalNextSibling = null;

        // Scaling and Offset variables
        this.scaleReferenceDistance = 6.0; 
        this.manualScaleFactor = 1.0;
        this.localOffset = new THREE.Vector3(0, 0, 0); // Offset from bone in local space
        this.rotationOffset = new THREE.Euler(0, 0, 0); // Applied rotation offset

        // Transition logic
        this.isTransitioning = false;
        this.transitionProgress = 0;
        this.startScreenPos = { x: 0, y: 0 };
        this.droneBeam = null;
        this.isJittering = false;
        this.returnTargetPos = { x: 0, y: 0 };
        
        this.hasHitThisSwing = false;
        
        // Cleanup old tracker if it exists from previous versions
        const oldTracker = document.getElementById('bone-tracker-test');
        if (oldTracker) oldTracker.remove();

        this.initTargetElement('#persona-switch-btn');
    }

    /**
     * Bind to the target element and store its original state for return flight
     */
    initTargetElement(selectorOrEl) {
        const el = (typeof selectorOrEl === 'string') ? document.querySelector(selectorOrEl) : selectorOrEl;
        if (!el) {
            console.warn(`[BoneTracker] Target element not found.`);
            return;
        }
        
        // If switching targets, ensure we aren't in a broken state
        if (this.element && this.isActive) {
            this.forceReset();
        }

        this.element = el;
        this.originalParent = el.parentElement;
        this.originalNextSibling = el.nextSibling;

        // Reset start position for the flight
        const rect = el.getBoundingClientRect();
        this.startScreenPos = { x: rect.left, y: rect.top };

        // Capture original inline styles to restore accurately later
        this.originalStyle = {};
        const styleKeys = [
            'position', 'top', 'left', 'transform', 'zIndex', 
            'pointerEvents', 'margin', 'display', 'transition', 
            'transformOrigin', 'perspective'
        ];
        styleKeys.forEach(key => {
            this.originalStyle[key] = el.style[key] || '';
        });
    }

    /**
     * Toggles the tracking state and handles the DOM parenting/styling shift
     */
    toggleTracking(onArrival = null) {
        if (!this.element) return false;

        this.isActive = !this.isActive;

        if (this.isActive) {
            // LOCK: Pause integrity checks during the interaction
            this.scene.isHeroAnimating = true;

            // 1. Capture current screen position BEFORE moving/reparenting
            const rect = this.element.getBoundingClientRect();
            this.startScreenPos = { x: rect.left, y: rect.top };
            this.transitionProgress = 0;
            this.isTransitioning = true;
            this.isBeaming = false; // Delayed until 65% flux
            
            // 2.5 Lock Drone Gaze
            if (this.scene.gazeFollower) {
                this.scene.gazeFollower.isLocked = true;
            }

            // 2.6 VISUAL PERSISTENCE: Create a ghost that lingers at the original spot
            const ghost = this.element.cloneNode(true);
            ghost.id = 'bone-tracker-ghost';
            this.element.parentElement.insertBefore(ghost, this.element);
            ghost.style.transition = 'opacity 0.6s ease-out';
            ghost.style.pointerEvents = 'none';
            // Start fade slightly after the flight begins
            setTimeout(() => {
                ghost.style.opacity = '0';
                setTimeout(() => ghost.remove(), 600);
            }, 500);

            // 3. Pre-flight Attention Catcher (400ms "Breaking Free" effect)
            this.element.classList.add('persona-breakout');
            let hasTriggeredArrival = false;

            // Launch flight after the "Breaking" effect finishes
            setTimeout(() => {
                this.element.classList.remove('persona-breakout');
                
                if (this.flightTween) this.flightTween.stop();
                this.flightTween = new TWEEN.Tween(this)
                    .to({ transitionProgress: 1 }, 1500)
                    .easing(TWEEN.Easing.Back.In) 
                    .onUpdate(() => {
                        if (this.transitionProgress > 0.65 && !this.isBeaming) {
                            this.isBeaming = true;
                            this.setupBeam();
                        }
                        if (this.transitionProgress >= 0.9 && !hasTriggeredArrival) {
                            hasTriggeredArrival = true;
                            this.cleanupBeam();
                            if (onArrival) onArrival();
                        }
                    })
                    .onComplete(() => {
                        this.isTransitioning = false;
                        this.flightTween = null;
                        
                        setTimeout(() => {
                            if (this.scene.gazeFollower) {
                                this.scene.gazeFollower.isLocked = false;
                            }
                        }, 400); 
                    })
                    .start();
            }, 400); 

            // 4. Reparent to absolute overlay container
            const container = document.getElementById('experience-container') || document.body;
            if (this.element.parentElement !== container) {
                container.appendChild(this.element);
            }

            // Apply "3D Canvas" container styling
            Object.assign(this.element.style, {
                position: 'absolute',
                top: '0',
                left: '0',
                zIndex: '10005', // Above most UI
                pointerEvents: 'none',
                margin: '0',
                display: 'block',
                transition: 'none', 
                perspective: '1000px', // Enable 3D perspective
                transformOrigin: '10% 50%' 
            });

            // 5. Apply Hover Style (User Request: Feed visual importance)
            this.element.classList.add('persona-active-hover');
        } else {
            // DEACTIVATE: Remove Physics Phantom immediately

            // CAPTURE RETURN TARGET: Where should it fly back to?
            // Since it's reparented to body, we need the CURRENT screen pos of its original placeholder/parent
            if (this.originalParent) {
                const parentRect = this.originalParent.getBoundingClientRect();
                // Add a small offset if needed, but usually rect.left/top is the start pos
                this.returnTargetPos = { x: parentRect.left, y: parentRect.top };
            }

            // --- RETURN FLIGHT TRANSITION ---
            this.isTransitioning = true;
            this.setupBeam();
            if (this.scene.gazeFollower) {
                this.scene.gazeFollower.isLocked = true;
            }

            if (this.flightTween) this.flightTween.stop();
            this.flightTween = new TWEEN.Tween(this)
                .to({ transitionProgress: 0 }, 800)
                .easing(TWEEN.Easing.Cubic.InOut)
                .onComplete(() => {
                    this.isTransitioning = false;
                    this.flightTween = null;
                    this.cleanupBeam();
                    if (this.scene.gazeFollower) {
                        this.scene.gazeFollower.isLocked = false;
                    }

                    // RELEASE HERO: Allow integrity checks once UI has returned
                    this.scene.isHeroAnimating = false;

                    // DETACH: Restore original parent and style
                    if (this.originalParent) {
                        if (this.originalNextSibling) {
                            this.originalParent.insertBefore(this.element, this.originalNextSibling);
                        } else {
                            this.originalParent.appendChild(this.element);
                        }
                    }

                    // Cleanly restore original styling
                    this.element.classList.remove('persona-active-hover');
                    Object.assign(this.element.style, this.originalStyle);
                    
                    // Force display update
                    this.element.style.display = 'flex'; // Persona tag is flex
                })
                .start();
        }

        return this.isActive;
    }

    /**
     * IDEMPOTENT FORCE RESET: Immediately snaps the element back to the UI.
     * Essential for recovering from interrupted animations or 'stuck' states.
     */
    forceReset() {
        if (this.flightTween) this.flightTween.stop();
        this.flightTween = null;
        this.isTransitioning = false;
        this.isActive = false;
        this.transitionProgress = 0;
        this.cleanupBeam();

        if (this.scene.gazeFollower) {
            this.scene.gazeFollower.isLocked = false;
        }

        // Safety: Always release the hero on force reset
        this.scene.isHeroAnimating = false;

        // DETACH & RESTORE: Ensure it exists in the original DOM hierarchy
        if (this.originalParent) {
            if (this.originalNextSibling) {
                this.originalParent.insertBefore(this.element, this.originalNextSibling);
            } else {
                this.originalParent.appendChild(this.element);
            }
        }

        // Cleanly restore original styling
        this.element.classList.remove('persona-active-hover');
        this.element.classList.remove('persona-breakout');
        Object.assign(this.element.style, this.originalStyle);
        this.element.style.display = 'flex';
    }

    setupBeam() {
        this.cleanupBeam(); // Safety
        this.droneBeam = createHologramBeam(this.scene, 'transition-tether-beam', 0x00ffff);
        this.scene.add(this.droneBeam);
    }

    cleanupBeam() {
        if (this.droneBeam) {
            this.scene.remove(this.droneBeam);
            this.droneBeam.traverse(c => {
                if (c.geometry) c.geometry.dispose();
                if (c.material) {
                    if (Array.isArray(c.material)) c.material.forEach(m => m.dispose());
                    else c.material.dispose();
                }
            });
            this.droneBeam = null;
        }
    }

    /**
     * Find the bone in the scene graph
     */
    findBone() {
        if (this.targetBone) return this.targetBone;

        let root = this.scene.getObjectByName('a-char') || 
                   this.scene.getObjectByName('roomGLBModel') || 
                   this.scene;

        root.traverse((child) => {
            if (child.isBone && child.name === this.boneName) {
                this.targetBone = child;
            }
        });

        return this.targetBone;
    }

    /**
     * Update position, rotation, and 3D tilt in the animation loop
     */
    update() {
        if (!this.isActive && !this.isTransitioning && !this.isDroneGazing) return;

        if (this.isActive && !this.scene.isHeroAnimating && !this.isTransitioning) {
            this.forceReset();
            return;
        }
        if (!this.element) return;

        const bone = this.findBone();
        if (!bone) return;

        // 1. Get world position and rotation of the bone
        const worldPos = new THREE.Vector3().copy(this.localOffset);
        bone.localToWorld(worldPos);

        const worldQuat = new THREE.Quaternion();
        bone.getWorldQuaternion(worldQuat);

        // 2. Calculate Distance for Scaling
        const dist = worldPos.distanceTo(this.scene.camera.position);
        const autoScale = THREE.MathUtils.clamp(this.scaleReferenceDistance / dist, 0.4, 1.5);
        const finalScale = autoScale * this.manualScaleFactor;

        // 3. 3D Orientation relative to Camera
        // We calculate how the bone's "forward" and "up" axes are oriented in Camera Space
        const boneMatrix = new THREE.Matrix4().makeRotationFromQuaternion(worldQuat);
        const viewMatrix = this.scene.camera.matrixWorldInverse;
        const relativeMatrix = viewMatrix.clone().multiply(boneMatrix);
        
        // Extract Euler from relative matrix for 3D tilt
        const relativeEuler = new THREE.Euler().setFromRotationMatrix(relativeMatrix, 'YXZ');
        
        // Tilt Intensity (Dampened slightly for legibility, but follows bone)
        const tiltX = -relativeEuler.x * 30; // Pitch in degrees
        const tiltY = relativeEuler.y * 30;  // Yaw in degrees

        // 4. Calculate 2D position (Projected)
        const offsetAxis = new THREE.Vector3(0, 0.1, 0); // Local Y axis
        const offsetPos = worldPos.clone().add(offsetAxis.applyQuaternion(worldQuat));

        const screenPos = worldPos.clone().project(this.scene.camera);
        const screenOffsetPos = offsetPos.clone().project(this.scene.camera);

        const canvas = this.scene.renderer.domElement;
        const widthHalf = canvas.clientWidth / 2;
        const heightHalf = canvas.clientHeight / 2;

        const targetX = (screenPos.x * widthHalf) + widthHalf;
        const targetY = -(screenPos.y * heightHalf) + heightHalf;

        // --- LERP Position if transitioning ---
        let x = targetX;
        let y = targetY;

        if (this.isTransitioning) {
            const t = this.transitionProgress;
            
            // --- ENHANCEMENT: Parabolic Arc Mid-point Offset ---
            // t*(1-t) is 0 at start/end, and 0.25 at midpoint. 
            // Multiplier -1000 means a -250px upward bulge at the peak.
            const arcY = t > 0 ? t * (1 - t) * -1000 : 0; 

            if (this.isActive) {
                // Flying TO the hand
                x = THREE.MathUtils.lerp(this.startScreenPos.x, targetX, t);
                y = THREE.MathUtils.lerp(this.startScreenPos.y, targetY, t) + arcY;
            } else {
                // Flying BACK to the panel
                x = THREE.MathUtils.lerp(this.returnTargetPos.x, targetX, t);
                y = THREE.MathUtils.lerp(this.returnTargetPos.y, targetY, t);
            }
        }

        // Apply baseline rotation offset
        let rotJitter = 0;

        const x2 = (screenOffsetPos.x * widthHalf) + widthHalf;
        const y2 = -(screenOffsetPos.y * heightHalf) + heightHalf;

        // 2D rotation for the hinge (width aligns with vector + manual Z offset)
        const angle2D = Math.atan2(y2 - y, x2 - x) + this.rotationOffset.z + rotJitter;

        // 5. Update Drone Beam if active
        if (this.isTransitioning && this.droneBeam) {
            this.updateDroneBeam(x, y);
        }

        // 6. Update DOM
        if (screenPos.z < 1) {
            this.element.style.display = 'flex';
            // Apply current 3D state
            this.element.style.transform = `
                translate(${x}px, ${y}px) 
                translate(-10%, -50%) 
                rotate(${angle2D}rad) 
                rotateX(${tiltX + THREE.MathUtils.radToDeg(this.rotationOffset.x)}deg) 
                rotateY(${tiltY + THREE.MathUtils.radToDeg(this.rotationOffset.y)}deg) 
                scale(${finalScale})
            `.replace(/\s+/g, ' '); 
        } else {
            this.element.style.display = 'none';
        }

        // --- 8. POWER HIT (Pure Progress-Based Scripted Hit) ---
        const activeAction = this.scene.activeAction;
        if (this.isActive && activeAction && activeAction.getClip().name === 'golfDrive') {
            const candidates = ['pokeball', 'pokeball2', 'questionCube'];
            const hero = this.scene.getObjectByName('a-char');
            let ball = null;
            let minDist = Infinity;

            if (hero) {
                candidates.forEach(name => {
                    const obj = this.scene.getObjectByName(name);
                    if (obj && obj.visible && obj.rapierBody) {
                        const d = obj.position.distanceTo(hero.position);
                        if (d < minDist) {
                            minDist = d;
                            ball = obj;
                        }
                    }
                });
            }

            if (ball && ball.rapierBody) {
                
                // Progressive Hit Logic (Trigger at 20% mark)
                const duration = activeAction.getClip().duration;
                const progress = activeAction.time / duration;

                // Manual Reset Guard: Ensures it only fires once per swing cycle
                if (progress < 0.1) this.hasHitThisSwing = false;

                if (!this.hasHitThisSwing && progress >= 0.22) {
                    this.hasHitThisSwing = true;
                    
                    // Wake up the body to guarantee the impulse is registered
                    ball.rapierBody.wakeUp();

                    // DIRECTION: Negative X and Positive Y (Toward sidebar/camera)
                    // Slightly randomize for "Wild Guess" variety
                    const hitDir = new THREE.Vector3(-1.0, 1.35, 0.0).normalize();
                    
                    // PHYSICS EQUATION: Impulse = Mass * ΔVelocity
                    // We target a ΔV of ~61 (original 550/9) to maintain impact feel
                    const mass = ball.rapierBody.mass();
                    const power = mass * 61.1;

                    const world = (this.scene && this.scene.world) ? this.scene.world : null;
                    if (world && !world.isBusy) {
                        try {
                            world.isBusy = true;
                             ball.rapierBody.applyImpulse({ 
                                 x: hitDir.x * power, 
                                 y: hitDir.y * power, 
                                 z: hitDir.z * power 
                             }, true);

                             // --- NARRATIVE CINEMATIC HIT ---
                             const cp = ball.rapierBody.translation();
                             const impactPos = new THREE.Vector3(cp.x, cp.y, cp.z);
                             
                             // 1. Time Dilation (Momentary Slow-mo for impact weight)
                             activeAction.setEffectiveTimeScale(0.1);
                             setTimeout(() => {
                                 new TWEEN.Tween({ ts: 0.1 })
                                     .to({ ts: 1.0 }, 700)
                                     .easing(TWEEN.Easing.Cubic.Out)
                                     .onUpdate((obj) => activeAction.setEffectiveTimeScale(obj.ts))
                                     .start();
                             }, 120);

                             // 2. Fragment Narrative
                             if (ball.name.startsWith('pokeball')) {
                                 // White-Hot Orange Capture Burst
                                 triggerDroneHitEffect(this.scene, impactPos, hero.position, [0xffffff, 0xff8800, 0xffaa00]);
                                 updateStory("TARGET_STABILIZED: DATA_ENTITY_SEQUESTERED");
                             } else if (ball.name === 'questionCube') {
                                 // Gold/White-Hot Reward Burst (More Shards)
                                 triggerDroneHitEffect(this.scene, impactPos, hero.position, [0xffffff, 0xffd700, 0xff8800]);
                                 updateStory("SYSTEM_ANOMALY_RESOLVED: JACKPOT_SECTOR_OPEN");

                                 // JACKPOT: Spawn randomized count (1-6) of the same kind of coins
                                 const numCoins = Math.floor(Math.random() * 6) + 1;
                                 const coinType = Math.random() > 0.5 ? "BTC" : "ETH";
                                 
                                 // Impact Location: Combat Position Ground (hardcoded for reliability)
                                 const coinSpawnPos = new THREE.Vector3(1, 0.1, -1.5);

                                 for(let i = 0; i < numCoins; i++) {
                                     // Radial Explosion Impulse
                                     const angle = (i / numCoins) * Math.PI * 2 + (Math.random() * 0.5);
                                     const spreadStrength = 4.0 + Math.random() * 4.0;
                                     const upwardStrength = 12.0 + Math.random() * 8.0;

                                     const coinPopImpulse = {
                                         x: Math.cos(angle) * spreadStrength,
                                         y: upwardStrength,
                                         z: Math.sin(angle) * spreadStrength
                                     };

                                     // First coin triggers narration/sounds, others are silent
                                     spawnBitcoin(this.scene, coinSpawnPos, coinPopImpulse, i > 0, coinType);
                                 }

                                 // Bonus: Arcane lightning at impact point
                                 if (window.LIGHT) {
                                     window.LIGHT.lightningStrike({
                                         scene: this.scene,
                                         constantUniform: this.scene.globalUniformsHub?.uniforms,
                                         windowLight: this.scene.windowLight
                                     }, 0.9, impactPos, false);
                                 }
                             }

                             // MOMENT OF INERTIA SCALING: Scaling spin by mass for consistent visual chaos
                            const torqueScale = mass * 15.0; // Derived from original torque/mass ratio
                            ball.rapierBody.applyTorqueImpulse({ 
                                x: (Math.random() - 0.5) * (torqueScale * 0.6), 
                                y: -torqueScale * 1.0, 
                                z: (Math.random() - 0.5) * (torqueScale * 0.6)
                            }, true);
                            world.isBusy = false;
                        } catch (e) {
                            console.error("[BoneTracker] Impulse failed:", e.message);
                            if (world) world.isBusy = false;
                        }
                    }


                }
            }
        }
    }

    updateDroneBeam(screenX, screenY) {
        const drone = this.scene.getObjectByName('drone');
        const eye = drone ? drone.getObjectByName('Sphere001_0') : null;
        if (!eye || !this.droneBeam) return;

        const eyePos = new THREE.Vector3();
        eye.getWorldPosition(eyePos);

        // Map the current SCREEN position of the transition element back to a world point
        // This is where the drone "sees" the button in 3D space.
        const rect = { left: screenX, top: screenY, width: 0, height: 0, right: screenX, bottom: screenY };
        const targetWorldPos = projectDOMToWorld(this.scene, rect, 'TL', 0.5);

        this.droneBeam.position.copy(eyePos);
        this.droneBeam.lookAt(targetWorldPos);

        // SYNC DRONE GAZE: Make drone head turn toward the floating button instantly
        updateDroneGaze(this.scene, targetWorldPos, true, true);

        const dist = eyePos.distanceTo(targetWorldPos);
        this.droneBeam.children.forEach(c => {
            if (c.name.includes('beam')) {
                c.scale.z = dist;
            }
        });
    }

    /**
     * Console Tool: Move the tracker to a different bone
     * @param {string} boneName 
     */
    setBone(boneName) {

        this.boneName = boneName;
        this.targetBone = null; 
    }

    /**
     * Console Tool: Manually adjust the text scale multiplier
     * @param {number} val 
     */
    setScale(val) {

        this.manualScaleFactor = val;
    }

    /**
     * Console Tool: Manually adjust the local position offset
     * Use this to move the "stick" into the palm or lengthen it
     */
    setOffset(x = 0, y = 0, z = 0) {

        this.localOffset.set(x, y, z);
    }

    /**
     * Console Tool: Manually adjust the 3D rotation offset (in Degrees)
     */
    setRotationOffset(x = 0, y = 0, z = 0) {

        this.rotationOffset.set(
            THREE.MathUtils.degToRad(x),
            THREE.MathUtils.degToRad(y),
            THREE.MathUtils.degToRad(z)
        );
    }

    destroy() {
        if (this.isActive) this.toggleTracking();
        this.isActive = false;
        this.element = null;
    }
}


