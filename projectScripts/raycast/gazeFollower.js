import * as THREE from 'three';
import TWEEN from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/tween.module.min.js';


/**
 * Class: GazeFollower
 * -------------------
 * A controller that makes a 3D object smoothly rotate to look at a target
 * using spherical interpolation (SLERP). 
 * * Features:
 * - Handles nested parent hierarchies (World Space vs Local Space).
 * - Interrupts active tweens smoothly if a new target is selected.
 * - Uses Tween.js for animation control.
 */
export class GazeFollower {
    /**
     * @param {THREE.Mesh} mesh - The object that will perform the rotation (The Probe).
     */
    constructor(mesh) {
        this.mesh = mesh;

        // The dummy is our invisible calculator. 
        // We don't attach it yet; we wait for init().
        this.dummy = new THREE.Object3D();

        this.startQuaternion = new THREE.Quaternion();
        this.targetQuaternion = new THREE.Quaternion();
        this.targetWorldPos = new THREE.Vector3();

        this.activeTween = null;
        this.isInitialized = false;
    }

    /**
     * INTRODUCTION / SETUP
     * Call this ONLY after 'this.mesh' has been added to the scene/parent.
     * This attaches the dummy helper to the same parent as the mesh.
     */
    init() {
        if (!this.mesh.parent) {
            console.error("GazeFollower Error: Probe mesh has no parent. Add it to the scene before calling init().");
            return;
        }

        // Attach dummy to the same parent so they share the local coordinate space
        this.mesh.parent.add(this.dummy);

        // Sync initial state
        this.dummy.position.copy(this.mesh.position);
        this.dummy.rotation.copy(this.mesh.rotation);
        this.dummy.scale.copy(this.mesh.scale);

        this.isInitialized = true;
    }

    /**
     * Rotates the probe to look at the target object.
     * @param {THREE.Object3D} targetObject - The object to track.
     * @param {boolean} immediate - If true, snap to target without animation.
     */
    lookAtTarget(targetObject, immediate = false) {
        if (!this.isInitialized) {
            console.warn("GazeFollower: calling lookAtTarget before init()");
            return;
        }

        // --- LOCK GUARD ---
        if (this.isLocked && targetObject !== this.mesh.userData.lockTarget) {
            return;
        }

        // Continuous Tracking Optimization:
        // If we are already tracking this specific object, just update the target calculation
        // and let the existing tween continue towards the moving target.
        if (this.currentTarget === targetObject && this.activeTween && !immediate) {
            targetObject.getWorldPosition(this.targetWorldPos);
            this.dummy.lookAt(this.targetWorldPos);
            this.targetQuaternion.copy(this.dummy.quaternion);
            return;
        }
        this.currentTarget = targetObject;

        // 1. Interrupt existing animation
        if (this.activeTween) {
            this.activeTween.stop();
            this.activeTween = null;
        }

        // 2. Sync Dummy Position with Mesh (in case Mesh moved)
        this.dummy.position.copy(this.mesh.position);
        this.dummy.scale.copy(this.mesh.scale);

        // 3. Calculate World Position of the target
        targetObject.getWorldPosition(this.targetWorldPos);

        // 4. Look at World Position (Dummy converts this to Local Rotation)
        this.dummy.lookAt(this.targetWorldPos);

        // 5. Capture Rotations
        this.targetQuaternion.copy(this.dummy.quaternion);
        this.startQuaternion.copy(this.mesh.quaternion);

        // 6. Snap or Animate
        if (immediate) {
            if (this.mesh.rapierBody) {
                const qObj = { x: this.targetQuaternion.x, y: this.targetQuaternion.y, z: this.targetQuaternion.z, w: this.targetQuaternion.w };
                this.mesh.rapierBody.setRotation(qObj, true);
            } else {
                this.mesh.quaternion.copy(this.targetQuaternion);
            }
            return;
        }

        const values = { t: 0 };
        const quat = new THREE.Quaternion()

        if (this.mesh.rapierBody) {
            this.activeTween = new TWEEN.Tween(values)
                .to({ t: 1 }, 1500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    // Safety check for recursive WASM calls
                    let world = null;
                    if (this.mesh.parent && this.mesh.parent.world) {
                        world = this.mesh.parent.world;
                    } else if (window.scene && window.scene.world) {
                        world = window.scene.world;
                    }

                    if (world && world.isBusy) {
                        // console.warn("[GazeFollower] World is busy, skipping rotation update to avoid WASM recursion.");
                        return;
                    }

                    quat.copy(this.startQuaternion).slerp(this.targetQuaternion, values.t);

                    // Passing as plain object to avoid aliasing issues in the WASM bridge
                    const qObj = { x: quat.x, y: quat.y, z: quat.z, w: quat.w };
                    
                    try {
                        // Mark world as busy if it's not already, just for this call
                        const wasBusy = world ? world.isBusy : false;
                        if (world) world.isBusy = true;
                        
                        this.mesh.rapierBody.setRotation(qObj, true);
                        
                        if (world) world.isBusy = wasBusy; 
                    } catch (e) {
                        console.error("[GazeFollower] Rapier failed to set rotation:", e.message);
                        if (e.message.includes("recursive")) {
                            console.trace("[GazeFollower] Recursive WASM call trace:");
                        }
                        this.activeTween.stop();
                    }
                })
                .onComplete(() => {
                    this.activeTween = null;
                })
                .start();
        } else {
            this.activeTween = new TWEEN.Tween(values)
                .to({ t: 1 }, 1500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    this.mesh.quaternion.copy(this.startQuaternion).slerp(this.targetQuaternion, values.t);
                })
                .onComplete(() => {
                    this.activeTween = null;
                })
                .start();
        }
    }

    /**
     * Cleanup method to remove the dummy helper if the probe is destroyed
     */
    dispose() {
        if (this.dummy.parent) {
            this.dummy.parent.remove(this.dummy);
        }
    }
}

// // --- Usage Example ---

// // 1. Create Mesh and Class
// const probeMesh = new THREE.Mesh(geo, mat);
// const gazeFollower = new GazeFollower(probeMesh);

// // 2. Add Mesh to Scene (Essential!)
// scene.add(probeMesh);

// // 3. Initialize the Class (The "Introduction")
// gazeFollower.init(); // Now the dummy attaches correctly to 'scene'

// // 4. Use it
// // gazeFollower.lookAtTarget(someTarget);