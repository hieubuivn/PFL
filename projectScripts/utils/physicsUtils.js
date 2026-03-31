import * as THREE from 'three';
import TWEEN from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/tween.module.min.js';
import RAPIER from '../rapierPhysics/rapier3d-compat.js';

const apexWatchers = new Set();
let isApexWatcherRunning = false;

/**
 * Monitors a body's velocity and triggers a callback when it reaches its flight apex (falling).
 */
export function watchApex(body, onApex) {
    apexWatchers.add({ body, onApex, startTime: performance.now() });

    if (!isApexWatcherRunning) {
        isApexWatcherRunning = true;
        const tick = () => {
            const world = window.scene ? window.scene.world : null;
            if (world && world.isBusy) {
                requestAnimationFrame(tick);
                return;
            }

            if (apexWatchers.size === 0) {
                isApexWatcherRunning = false;
                return;
            }
            const now = performance.now();
            apexWatchers.forEach(item => {
                const vel = item.body.linvel();
                if (vel.y <= 0.01 || (now - item.startTime > 1500)) {
                    item.onApex();
                    apexWatchers.delete(item);
                }
            });
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }
}

/**
 * Returns a body from its current state to a target transform via a Bezier path.
 * Supports an optional 'avoidancePos' to "bend" the path away from an obstacle (like the hero).
 */
export function startKinematicReturn(body, targetPos, targetQuat, targetEndTime, originalBodyType, onComplete, onUpdate = null, avoidancePos = null) {
    const now = performance.now();
    const duration = Math.max(200, targetEndTime - now);

    // Safety: we assume the caller provides a valid body that is part of a world
    // We try to find the world to check isBusy
    const world = (window.scene && window.scene.world) ? window.scene.world : null;
    if (world && world.isBusy) {
        // console.warn("[PhysicsUtils] Skipping kinematic return setup: world is busy.");
        return;
    }

    const currentTrans = body.translation();
    const startPos = new THREE.Vector3(currentTrans.x, currentTrans.y, currentTrans.z);
    const linvel = body.linvel();
    const velocity = new THREE.Vector3(linvel.x, linvel.y, linvel.z);

    body.setNextKinematicTranslation(startPos);
    body.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased);

    // --- SMART PATH GENERATION ---
    // Start with the default control point biased by the object's initial momentum
    const controlPoint = startPos.clone().add(velocity.multiplyScalar(0.45));

    if (avoidancePos) {
        // 1. Calculate how close the straight path passes to the avoidance target (Hero)
        const line = new THREE.Line3(startPos, targetPos);
        const closestPointOnLine = new THREE.Vector3();
        line.closestPointToPoint(avoidancePos, true, closestPointOnLine);
        
        const distToHero = closestPointOnLine.distanceTo(avoidancePos);
        const AVOIDANCE_THRESHOLD = 1.75; // Increased threshold for safer clearance

        if (distToHero < AVOIDANCE_THRESHOLD) {
            // 2. Calculate a repulsion vector: push the control point AWAY from the hero
            const repulsionDir = new THREE.Vector3().subVectors(closestPointOnLine, avoidancePos).normalize();
            
            // SECURITY: If the closest point is literally ON the hero, or very close, 
            // ensure we always push in a clear direction (Default to UP)
            if (repulsionDir.lengthSq() < 0.05 || (Math.abs(repulsionDir.y) > 0.9)) {
                repulsionDir.set(0, 1.2, 0.2).normalize(); 
            }

            // AGGRESSIVE PUSH: Strength of the "bend" scales significantly to create a real arc
            // Using a higher multiplier (4.5) to ensure the bulge is visible and effective
            const pushStrength = (AVOIDANCE_THRESHOLD - distToHero) * 4.5;
            controlPoint.add(repulsionDir.multiplyScalar(pushStrength));
            
            // Add a static vertical "skirt" if path is near character base height
            if (closestPointOnLine.y < 3.0) {
                controlPoint.y += (AVOIDANCE_THRESHOLD - distToHero) * 1.5;
            }
        }
    }

    const curve = new THREE.QuadraticBezierCurve3(startPos, controlPoint, targetPos);

    const currentRot = body.rotation();
    const startQuat = new THREE.Quaternion(currentRot.x, currentRot.y, currentRot.z, currentRot.w);

    // Cancel previous return tween if it exists
    if (body._activeReturnTween) {
        body._activeReturnTween.stop();
    }

    const state = { t: 0 };
    const tween = new TWEEN.Tween(state)
        .to({ t: 1 }, duration)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(() => {
            // 🛡️ SAFETY GUARD: Respect physics lock during tween updates
            if (world && world.isBusy) return;

            const currentPoint = curve.getPoint(state.t);
            try {
                if (world) world.isBusy = true;
                body.setNextKinematicTranslation(currentPoint);
                body.setNextKinematicRotation(startQuat.clone().slerp(targetQuat, state.t));
                if (world) world.isBusy = false;
            } catch (e) {
                console.error("[PhysicsUtils] Kinematic update failed:", e.message);
                if (world) world.isBusy = false;
            }

            // NEW: Fire the update hook for external tracking (like the drone beam and grid progress)
            if (onUpdate) onUpdate(currentPoint, state.t);
        })
        .onComplete(() => {
            body._activeReturnTween = null;
            const settleDelay = Math.random() * 200;
            setTimeout(() => {
                if (world && world.isBusy) {
                    // Critical reset: skip delay and force if possible, or retry
                }
                
                try {
                    if (world) world.isBusy = true;
                    body.setBodyType(originalBodyType);
                    body.setLinvel({ x: 0, y: 0, z: 0 }, true);
                    body.setAngvel({ x: 0, y: 0, z: 0 }, true);
                    if (body.rapierCollider) body.rapierCollider.setSensor(false);
                    if (world) world.isBusy = false;
                } catch (e) {
                    console.error("[PhysicsUtils] Body reset failed:", e.message);
                    if (world) world.isBusy = false;
                }
                
                if (onComplete) onComplete();
            }, settleDelay);
        });

    body._activeReturnTween = tween;
    tween.start();
}
