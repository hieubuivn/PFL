import * as THREE from 'three';
// import * as CONSTANTS from './constant.js';
import * as RAPIER from 'rapier-compat';
let initialized = false;
export async function initializeRapier() {
    if (initialized) return;
    await RAPIER.init({});
    initialized = true;
}

const UpdateStrategy = {
    PHYSICS_TO_OBJECT: 'physicsToMesh', // Physics engine drives the 3D object
    OBJECT_TO_PHYSICS: 'meshToPhysics'  // 3D object (animation) drives the physics body
};

export class RAPIERWORLD {
    constructor(scene, { debuggerEnabled = false, isActive = true } = {}) {
        this.scene = scene;

        // console.log('Is active', isActive)

        const gravity = new RAPIER.Vector3(0.0, -9.81, 0.0)
        const world = new RAPIER.World(gravity)
        // console.log(world)
        this.gravity = gravity
        this.world = world
        scene.world = world
        scene.rapierWorldWrapper = this

        this.debuggerEnabled = debuggerEnabled
        this.isActive = isActive

        this.world.isActive = isActive;
        this.world.debuggerEnabled = debuggerEnabled;
        this.world.isPaused = false;
        // this.debuggerEnabled = debuggerEnabled
        // this.isActive = isActive

        this.world.productBodies = []

        this.world.hasPointGravityOnBalls = false //for pull/push fucntion
        this.world.hasPointGravityOnBH = false
        this.world.hasPointGravityOnProducts = true
        this.world.gravityStrength = 0.1;

        this.world.gravityCenterForBH = new RAPIER.Vector3(-6.5, 7.10, -0.39)
        this.world.gravityCenterForBalls = new THREE.Vector3(0.0, 7.2, 0.0)
        this.world.gravityCenterForProducts = new THREE.Vector3(0.0, 7.2, -3)
        this._bhInterleaveOdd = false;
        this._lastBHLog = 0;
        this.world.gravityPoints = [
            {
                name: 'pokemon',
                isActive: false,
                affectedBodies: [],
                gravityCenter: ''
            }
        ]

        // const sphereBody = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(-2.5, 5, 0).setCanSleep(false))
        // const sphereShape = RAPIER.ColliderDesc.ball(1).setMass(1).setRestitution(1.1)
        // world.createCollider(sphereShape, sphereBody)

        const geometry = new THREE.BufferGeometry();
        const material = new THREE.LineBasicMaterial({ vertexColors: true, toneMapped: false });
        const lines = new THREE.LineSegments(geometry, material);
        if (debuggerEnabled) scene.add(lines);
        this.lines = lines;

        // --- CHANGE: Create a floor with thickness so objects don't fall through ---
        // The top of the floor is at y=0.
        let thickness = 50
        const floorBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(0, -1 * thickness, 0))
        const floorShape = RAPIER.ColliderDesc.cuboid(200, thickness, 200)

        world.createCollider(floorShape, floorBody)

        this.world.isBusy = false; // LOCK FLAG: Prevents recursive WASM calls
        this.accumulator = 0;
        this.TIMESTEP = 1 / 60;
    }

    resetAccumulator() {
        this.accumulator = 0;
    }

    // Safety Wrapper for all Rapier modifications
    safeStep(delta) {
        if (this.world.isBusy) return;
        this.world.isBusy = true;
        try {
            this.world.timestep = delta;
            this.world.step();
        } finally {
            this.world.isBusy = false;
        }
    }

    pullBody(body, gravityCenter, appliedPullingFactor = 1) {
        if (body.isSleeping()) return;

        const pos = body.translation();
        // Skip objects in the pool (parked far below y=-50)
        if (pos.y < -50) return;

        const dx = gravityCenter.x - pos.x;
        const dy = gravityCenter.y - pos.y;
        const dz = gravityCenter.z - pos.z;

        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < 0.01) return; // Arrived

        const pullingDampness = body.pullingDampness || 0.0;
        const mass = body._mass || body.mass();
        if (body._mass === undefined) body._mass = mass; // Cache it

        const strength = this.world.gravityStrength * 9.81 * mass * appliedPullingFactor * (1 - pullingDampness);
        const invDist = strength / Math.sqrt(distSq);

        body.applyImpulse({
            x: dx * invDist,
            y: dy * invDist,
            z: dz * invDist
        }, true);
    }

    applyPointGravityOnBalls(appliedPullingFactor = 0.45) {
        this.world.ballBodies.forEach((body) => {
            this.pullBody(body, this.world.gravityCenterForBalls, appliedPullingFactor)
        });
    }

    applyPointGravityOnPokeball(appliedPullingFactor = 1) {
        this.pullBody(this.world.pokeballBody, this.world.gravityCenterForPokeball, appliedPullingFactor)
    }

    applyPointGravityOnBH(appliedPullingFactor = 0.52) {
        if (!this.scene.bhTargets) return;

        // Diagnostic Logging
        const now = performance.now();
        const shouldLog = !this._lastBHLog || (now - this._lastBHLog > 2000);
        let pushedCount = 0;

        // PERFORMANCE: Interleaving (Phase 3)
        // Only process 50% of targets per frame to reduce WASM bridge overhead (applyImpulse calls)
        this._bhInterleaveOdd = !this._bhInterleaveOdd;

        this.scene.bhTargets.forEach((target, index) => {
            // Optimization: Skip invisible or pooled objects
            if (!target.visible) return;

            // Interleave Check: alternate between even/odd indices each frame
            if ((index % 2 === 0) === this._bhInterleaveOdd) return;

            const body = target.rapierBody;
            if (body) {
                this.pullBody(body, this.world.gravityCenterForBH, appliedPullingFactor);
                pushedCount++;
            }
        });


    }

    applyPointGravityOnProducts(appliedPullingFactor = 0.45) {
        if (this.world.productBodies.length == 0) return
        this.world.productBodies.forEach((body) => {
            this.pullBody(body, this.world.gravityCenterForProducts, appliedPullingFactor)
        });
    }

    /**
     * Adds a new gravity point.
     * @param {string} name - Unique identifier for the gravity point.
     * @param {THREE.Vector3|RAPIER.Vector3} gravityCenter - The center position of gravity.
     * @param {Array} affectedBodies - List of bodies affected by this point.
     * @param {boolean} isActive - Whether the gravity point is active.
     */
    addGravityPoint(gravityPoint) {
        // 1. Validate that the input is an instance of the GravityPoint class
        if (!(gravityPoint instanceof GravityPoint)) {
            console.error("RAPIERWORLD: Argument must be an instance of the GravityPoint class.");
            return;
        }

        // 2. Check if a point with this name already exists
        const exists = this.world.gravityPoints.some(point => point.name === gravityPoint.name);

        if (exists) {
            console.warn(`RAPIERWORLD: A gravity point with the name "${gravityPoint.name}" already exists. Addition skipped.`);
            return;
        }

        // 3. Add to the array
        this.world.gravityPoints.push(gravityPoint);

        console.log(`Gravity point "${gravityPoint.name}" added.`);
    }

    /**
     * Retrieves a gravity point object by its name.
     * @param {string} name - The name of the gravity point to find.
     * @returns {Object|undefined} The gravity point object or undefined if not found.
     */
    getGravityPointByName(name) {
        return this.world.gravityPoints.find(point => point.name === name);
    }

    update(delta) {
        if (this.world.isPaused) return;
        if (!this.world.isActive) return;
        if (this.world.isBusy) {
            // console.warn("[Physics] Skipped update: World is busy.");
            return;
        }

        this.world.isBusy = true;
        try {
            this.world.timestep = delta;

            // physics to object (only if moving)
            if (this.scene.physicsControlledObjects) {
                this.scene.physicsControlledObjects.forEach(object => {
                    const body = object.rapierBody;
                    if (!object.isRapierBound || !body) return;

                    // OPTIMIZATION: If the body is sleeping, don't waste CPU copying matrices
                    if (body.isSleeping()) return;

                    object.position.copy(body.translation());
                    object.quaternion.copy(body.rotation());
                })
            }

            // object to physics (Standard Kinematic Objects)
            if (this.scene.objectControlledBodies) {
                this.scene.objectControlledBodies.forEach(body => {
                    const object = body.threeObject;
                    if (!object || !body.isObjectBound) return;

                    const pos = object.position;
                    const rot = object.quaternion;

                    if (body.isKinematic()) {
                        body.setNextKinematicTranslation({ x: pos.x, y: pos.y, z: pos.z });
                        body.setNextKinematicRotation({ x: rot.x, y: rot.y, z: rot.z, w: rot.w });
                    } else {
                        // For Dynamic objects forced to match mesh (rare), only update if mesh moved
                        body.setTranslation({ x: pos.x, y: pos.y, z: pos.z }, true);
                        body.setRotation({ x: rot.x, y: rot.y, z: rot.z, w: rot.w }, true);
                    }
                });
            }

            // Skinned Mesh Sync (Visual-to-Kinematic Physics)
            // OPTIMIZATION: Throttle to 30Hz (isHighPriorityFrame) as animations are also throttled
            const isHighPriority = this.scene.isHighPriorityFrame !== false;
            if (isHighPriority && this.scene.skinnedMeshBodies && this.scene.skinnedMeshBodies.length > 0) {
                // Optimization: Update parent matrices once if we have many bones tracking
                // Targeted update: Only update the Hero character, not the whole room!
                const character = this.scene.getObjectByName('a-char') || this.scene.room;
                if (character) character.updateMatrixWorld(true);

                this.scene.skinnedMeshBodies.forEach(body => {
                    const trackTarget = body.trackTarget || body.threeObject;
                    if (!trackTarget || !body.isObjectBound) return;

                    const pos = new THREE.Vector3();
                    const quat = new THREE.Quaternion();
                    trackTarget.getWorldPosition(pos);
                    trackTarget.getWorldQuaternion(quat);

                    if (body.trackOffset) pos.add(body.trackOffset);

                    if (body.isKinematic()) {
                        const currentPos = new THREE.Vector3().copy(body.translation());
                        const currentQuat = new THREE.Quaternion().copy(body.rotation());

                        if (body.softKinematic === true) {
                            body.setTranslation(pos, true);
                            body.setRotation(quat, true);
                        } else {
                            const factor = (typeof body.softKinematic === 'number') ? body.softKinematic : 0.75;
                            const targetPos = new THREE.Vector3().lerpVectors(currentPos, pos, factor);
                            const targetQuat = new THREE.Quaternion().slerpQuaternions(currentQuat, quat, factor);

                            const dist = targetPos.distanceTo(currentPos);
                            const MAX_PER_FRAME = 0.15;
                            if (dist > MAX_PER_FRAME) {
                                targetPos.subVectors(targetPos, currentPos).setLength(MAX_PER_FRAME).add(currentPos);
                            }

                            body.setNextKinematicTranslation(targetPos);
                            body.setNextKinematicRotation(targetQuat);
                        }
                    } else {
                        body.setTranslation(pos, true);
                        body.setRotation(quat, true);
                    }
                });
            }

            // --- PRE-STEP PHYSICS LOGIC ---
            if (this.world.hasPointGravityOnBalls) this.applyPointGravityOnBalls()
            if (this.world.hasPointGravityOnBH) this.applyPointGravityOnBH()
            if (this.world.hasPointGravityOnProducts) this.applyPointGravityOnProducts()

            this.world.gravityPoints.forEach(point => {
                if (!point.isActive) return;
                point.affectedBodies.forEach(body => {
                    this.pullBody(body, point.gravityCenter)
                })
            })

            // --- FIXED TIMESTEP ACCUMULATOR ---
            this.accumulator += delta;

            const isTransitioning = this.scene && this.scene.isTransitioning;
            const maxSteps = isTransitioning ? 8.1 : 5.0;
            const maxAccumulator = maxSteps * this.TIMESTEP;

            if (this.accumulator > maxAccumulator) this.accumulator = maxAccumulator;

            while (this.accumulator >= this.TIMESTEP) {
                // INTERNAL STEP CALL (Already inside busy block)
                try {
                    this.world.timestep = this.TIMESTEP;
                    this.world.step();
                } catch (e) {
                    console.error("[Physics] Step failed:", e.message);
                }
                this.accumulator -= this.TIMESTEP;
            }

            if (this.debuggerEnabled) {
                try {
                    const { vertices, colors } = this.world.debugRender();
                    if (vertices && vertices.length > 0) {
                        this.lines.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
                        this.lines.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4));
                        this.lines.visible = true;
                    }
                } catch (e) {
                    console.warn("[Physics] Debug render failed:", e);
                    this.lines.visible = false;
                }
            }
        } finally {
            this.world.isBusy = false;
        }
    }

    // Static helper to guard calls from outside classes
    static isBusy(scene) {
        return (scene.world && scene.world.isBusy === true);
    }

    static setBusy(scene, busy) {
        if (scene.world) scene.world.isBusy = busy;
    }

    syncBodiesToMeshes() {
        if (this.scene.physicsControlledObjects) {
            this.scene.physicsControlledObjects.forEach(object => {
                if (!object.isRapierBound) return;
                const body = object.rapierBody;
                const pos = object.position;
                const rot = object.quaternion;

                // OPTIMIZATION: Do NOT wake up bodies upon sync.
                // Let them sleep until something hits them. Avoids massive CPU spike.
                body.setTranslation({ x: pos.x, y: pos.y, z: pos.z }, false);
                body.setRotation({ x: rot.x, y: rot.y, z: rot.z, w: rot.w }, false);
                body.setLinvel({ x: 0, y: 0, z: 0 }, false);
                body.setAngvel({ x: 0, y: 0, z: 0 }, false);
            });
        }
    }
}

export function bindBodyObject(scene, object, body, shape, options = {}) {
    // GUARD: Prevent duplicate bindings which cause "explosions"
    // IMPROVED: Allow if the body being passed IS ALREADY the attached body (continuation of binding)
    if ((object.isRapierBound || object.rapierBody) && object.rapierBody !== body) {
        // Clean up the unused body we just created in the helper
        scene.world.removeRigidBody(body);
        return;
    }

    object.isRapierBound = true;
    object.rapierBody = body;
    body.threeObject = object;

    const pullingDampness = options.pullingDampness || 0.0;
    body.pullingDampness = pullingDampness;
    const isIntegrityCheckTarget = options.isIntegrityCheckTarget || false;
    body.isIntegrityCheckTarget = isIntegrityCheckTarget;

    // Default 'isIntegrityResetTarget' to true if 'isIntegrityCheckTarget' is true and it wasn't explicitly provided.
    // Otherwise default to the provided value or false.
    let isIntegrityResetTarget;
    if (options.isIntegrityResetTarget !== undefined) {
        isIntegrityResetTarget = options.isIntegrityResetTarget;
    } else {
        isIntegrityResetTarget = isIntegrityCheckTarget === true;
    }
    body.isIntegrityResetTarget = isIntegrityResetTarget;

    const updateStrategy = options.updateStrategy || UpdateStrategy.PHYSICS_TO_OBJECT;
    switch (updateStrategy) {
        case UpdateStrategy.PHYSICS_TO_OBJECT:
            scene.physicsControlledObjects = scene.physicsControlledObjects || []
            scene.physicsControlledObjects.push(object)
            break;

        case UpdateStrategy.OBJECT_TO_PHYSICS:
            scene.objectControlledBodies = scene.objectControlledBodies || []
            scene.objectControlledBodies.push(body)
            break;
    }
    scene.physicBodies = scene.physicBodies || []
    scene.physicBodies.push(body)

    scene.physicObjects = scene.physicObjects || []
    scene.physicObjects.push(object)

    // Re-parent the mesh to the main scene, automatically
    // adjusting its local position/rotation to keep its world transform the same.

    scene.attach(object);

    if (scene.tweenData && scene.tweenData[object.uuid]) {
        scene.tweenData[object.uuid].scale = object.scale.clone()
    }


    body.setTranslation({ x: object.position.x, y: object.position.y, z: object.position.z })
    body.setRotation({ x: object.quaternion.x, y: object.quaternion.y, z: object.quaternion.z, w: object.quaternion.w })
    const collider = scene.world.createCollider(shape, body);

    object.rapierBody = body
    object.rapierShape = shape
    object.rapierCollider = collider

    body.threeObject = object
    body.rapierShape = shape
    body.rapierCollider = collider

    object.isRapierBound = true;
    body.isObjectBound = true;
}

/**
 * NEW: Binds a SkinnedMesh (character) to a Physics Body with enhanced tracking.
 * 
 * @param {THREE.Scene} scene 
 * @param {THREE.SkinnedMesh|THREE.Group} object - The character mesh.
 * @param {RAPIER.RigidBody} body - The physics body.
 * @param {RAPIER.ColliderDesc} shape 
 * @param {Object} options 
 * @param {string} [options.trackBoneName] - Name of the bone to track (e.g., 'MixamorigHips').
 * @param {THREE.Vector3} [options.offset] - Offset from the tracking target.
 */
export function bindSkinnedMeshToBody(scene, object, body, shape, options = {}) {
    // 1. Force Body Type to Kinematic Position Based
    if (!body.isKinematic()) {
        body.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased);
    }

    // 2. Determine Tracking Target (Mesh or Bone)
    let trackTarget = object;
    if (options.trackBoneName) {
        const bone = object.getObjectByName(options.trackBoneName);
        if (bone) {
            trackTarget = bone;
        } else {
            console.warn(`Rapier: Bone "${options.trackBoneName}" not found. Defaulting to object root.`);
        }
    }

    // 3. Store References
    body.threeObject = object;
    body.trackTarget = trackTarget;
    body.trackOffset = options.offset ? options.offset.clone() : new THREE.Vector3(0, 0, 0);
    body.softKinematic = options.softKinematic ?? false; // Default to FALSE (classic/aggressive) for backward compatibility

    // 4. Register to Scene
    scene.skinnedMeshBodies = scene.skinnedMeshBodies || [];
    scene.skinnedMeshBodies.push(body);

    // Also add to general list for cleanup/debugging if needed
    scene.physicBodies = scene.physicBodies || [];
    scene.physicBodies.push(body);

    // 5. Initial Sync
    trackTarget.updateWorldMatrix(true, false);
    const startPos = new THREE.Vector3();
    const startQuat = new THREE.Quaternion();
    trackTarget.getWorldPosition(startPos);
    trackTarget.getWorldQuaternion(startQuat);

    if (body.trackOffset) startPos.add(body.trackOffset);

    body.setTranslation(startPos);
    body.setRotation(startQuat);

    // 6. Create Collider
    const mass = options.mass ?? 1;
    const restitution = options.restitution ?? 0.0;
    const friction = options.friction ?? 0.5;

    const collider = scene.world.createCollider(shape, body);
    collider.setMass(mass);
    collider.setRestitution(restitution);
    collider.setFriction(friction);

    object.rapierBody = body;
    object.rapierShape = shape;
    object.rapierCollider = collider;

    body.rapierShape = shape;
    body.rapierCollider = collider;
    body.isObjectBound = true;
}

// export function getFreeFormBodyShapeFromMesh(scene, mesh, options = {}) {
//     let world = scene.world;
//     const scale = mesh.getWorldScale(new THREE.Vector3());

//     let mass = options.mass || 1;
//     let restitution = options.restitution || 0.5;
//     let canSleep = options.canSleep || false;
//     let linearDamping = options.linearDamping || 0;
//     let angularDamping = options.angularDamping || 0;
//     let bodyType = options.bodyType || 'dynamic';

//     let desc = getBodyType(bodyType)


//     // Set properties on the description BEFORE creating the body
//     desc.setCanSleep(canSleep);
//     desc.setLinearDamping(linearDamping);
//     desc.setAngularDamping(angularDamping);


// // Now create the body from the fully configured descriptor
//     const body = world.createRigidBody(desc);
//     // const body = world.createRigidBody(
//     //     RAPIER.RigidBodyDesc.dynamic()

//     //         .setCanSleep(canSleep)
//     //         .setLinearDamping(linearDamping)
//     //         .setAngularDamping(angularDamping)
//     // );

//     // 1. Get the original, unscaled vertices and indices
//     const vertices = mesh.geometry.attributes.position.array;
//     const indices = mesh.geometry.index.array;

//     for (let i = 0; i < vertices.length; i += 3) {
//         vertices[i] = vertices[i] * scale.x;     // Scale x-coordinate
//         vertices[i + 1] = vertices[i + 1] * scale.y; // Scale y-coordinate
//         vertices[i + 2] = vertices[i + 2] * scale.z; // Scale z-coordinate
//     }
//     // 3. Create the trimesh collider with the scaled vertices
//     const shape = RAPIER.ColliderDesc.trimesh(vertices, indices)
//         .setMass(mass)
//         .setRestitution(restitution);

//     return { body, shape };
// }

export function getFreeFormBodyShapeFromMesh(scene, mesh, options = {}) {
    const world = scene.world;


    // --- 1. Set Physics Options with Offset ---
    const mass = options.mass ?? 1;
    const restitution = options.restitution ?? 0.5;
    const friction = options.friction ?? 0.5;
    const canSleep = options.canSleep ?? false;
    const linearDamping = options.linearDamping ?? 0;
    const angularDamping = options.angularDamping ?? 0;
    const bodyType = options.bodyType || 'dynamic';
    const isConvexHull = options.isConvexHull || false;
    // Get the offset option, default to a zero vector
    const offset = options.offset ?? new THREE.Vector3();

    // --- 2. Get Mesh's World Transform ---
    // This defines where the Rigid Body will be placed in the world.
    mesh.updateWorldMatrix(true, false);
    const worldPosition = mesh.getWorldPosition(new THREE.Vector3());
    const worldRotation = mesh.getWorldQuaternion(new THREE.Quaternion());
    const scale = mesh.getWorldScale(new THREE.Vector3());

    // --- 3. Create and Configure Rigid Body Description ---
    let desc = getBodyType(bodyType)
        .setTranslation(worldPosition.x, worldPosition.y, worldPosition.z)
        .setRotation(worldRotation)
        .setCanSleep(canSleep)
        .setLinearDamping(linearDamping)
        .setAngularDamping(angularDamping);

    const body = world.createRigidBody(desc);

    // --- 4. Prepare Scaled Data with Sub-Sampling ---
    // Optimization: Convex hull calculation is O(n log n). 
    // Reducing vertex count via sampling maintains shape while drastically speeding up the WASM call.
    const positionAttribute = mesh.geometry.attributes.position;
    const vertexCount = positionAttribute.count;

    // Choose a sampling step for large meshes
    const MAX_SAMPLING_VERTICES = 600;
    let step = 1;
    if (isConvexHull && vertexCount > MAX_SAMPLING_VERTICES) {
        step = Math.ceil(vertexCount / MAX_SAMPLING_VERTICES);
    }

    const indices = mesh.geometry.index ? mesh.geometry.index.array : null;
    const sampledCount = Math.ceil(vertexCount / step);
    const finalVertices = new Float32Array(sampledCount * 3);

    for (let i = 0; i < sampledCount; i++) {
        const idx = i * step;
        const x = positionAttribute.getX(idx) * scale.x;
        const y = positionAttribute.getY(idx) * scale.y;
        const z = positionAttribute.getZ(idx) * scale.z;

        finalVertices[i * 3] = x;
        finalVertices[i * 3 + 1] = y;
        finalVertices[i * 3 + 2] = z;
    }

    // --- 5. Create the Trimesh Collider Shape with Offset ---
    let shape
    // const shape = RAPIER.ColliderDesc.trimesh(scaledVertices, indices)
    //     // .setMass(mass)
    //     .setRestitution(restitution)
    //     // Apply the offset (collider translation relative to the rigid body)
    //     .setTranslation(offset.x, offset.y, offset.z); 

    if (isConvexHull) {
        shape = RAPIER.ColliderDesc.convexHull(finalVertices)
            .setMass(mass)
            .setRestitution(restitution)
            .setFriction(friction)
            .setTranslation(offset.x, offset.y, offset.z);
    } else {
        // Trimesh uses all vertices + indices for precision
        shape = RAPIER.ColliderDesc.trimesh(finalVertices, indices)
            .setMass(mass)
            .setRestitution(restitution)
            .setFriction(friction)
            .setTranslation(offset.x, offset.y, offset.z);
    }
    return { body, shape };
}

export function getFreeFormBodyShapeFromGroup(scene, group, options = {}) {
    const world = scene.world;

    // Set physics options with fallbacks
    const mass = options.mass || 1;
    const restitution = options.restitution || 0.5;
    const canSleep = options.canSleep || false;
    const linearDamping = options.linearDamping || 0;
    const angularDamping = options.angularDamping || 0;
    const bodyType = options.bodyType || 'dynamic';

    // Create rigid body description based on type
    let desc = getBodyType(bodyType)
    // Apply damping and sleep settings
    desc.setCanSleep(canSleep);
    desc.setLinearDamping(linearDamping);
    desc.setAngularDamping(angularDamping);

    // Create the rigid body in the physics world
    const body = world.createRigidBody(desc);

    // Prepare to merge geometry for collider
    const mergedVertices = [];
    const mergedIndices = [];
    let vertexOffset = 0;

    group.updateWorldMatrix(true, true);

    group.traverse((child) => {
        if (child.isMesh && child.geometry && child.visible) {
            const geometry = child.geometry;
            const position = geometry.attributes.position;
            const index = geometry.index;

            if (!position || !index) return;

            const worldScale = child.getWorldScale(new THREE.Vector3());
            const temp = new THREE.Vector3();

            // Scale and collect vertex positions
            for (let i = 0; i < position.count; i++) {
                temp.fromBufferAttribute(position, i);
                temp.multiply(worldScale);
                mergedVertices.push(temp.x, temp.y, temp.z);
            }

            // Offset and collect indices
            for (let i = 0; i < index.count; i++) {
                mergedIndices.push(index.array[i] + vertexOffset);
            }

            vertexOffset += position.count;
        }
    });

    // Create trimesh collider shape
    const shape = RAPIER.ColliderDesc.trimesh(mergedVertices, mergedIndices)
        .setMass(mass)
        .setRestitution(restitution);

    return { body, shape };
}




export function getBodyShapeByBoundingBox0(scene, object3D, options = {}) {

    const world = scene.world;

    // --- 1. Set Physics Options ---
    // Use provided options or fall back to sensible defaults.
    const mass = options.mass ?? 1;
    const restitution = options.restitution ?? 0.5;
    const canSleep = options.canSleep ?? false;
    const linearDamping = options.linearDamping ?? 0;
    const angularDamping = options.angularDamping ?? 0;
    const bodyType = options.bodyType || 'dynamic';
    let scale = options.scale || new THREE.Vector3(1, 1, 1);
    // console.log(object3D.name, scale)
    // console.log(options.scale)
    if (options.scale instanceof THREE.Vector3) {
        scale = scale
    } else {
        let r = parseFloat(options.scale);
        if (isNaN(r)) r = 1; // default fallback
        scale = new THREE.Vector3(r, r, r);
    }
    // console.log(object3D.name, scale)
    // --- 2. Create Rigid Body Description ---
    // This defines the fundamental behavior of the physics body.
    let desc = getBodyType(bodyType);


    // Apply additional properties to the description.
    desc.setCanSleep(canSleep);
    desc.setLinearDamping(linearDamping);
    desc.setAngularDamping(angularDamping);

    // --- 3. Create the Rigid Body ---
    // Instantiate the body in the physics world.
    const body = world.createRigidBody(desc);

    // --- 4. Calculate the Group's Bounding Box ---
    // This is the core difference from the trimesh function.
    // We compute a single Axis-Aligned Bounding Box (AABB) that contains all visible meshes in the group.
    const boundingBox = new THREE.Box3();

    // Ensure all child object matrices are up-to-date before calculation.
    // object3D.updateWorldMatrix(true, true);

    // Calculate the bounding box of the group and all its children.
    // The `true` parameter makes the calculation recursive.
    boundingBox.setFromObject(object3D, true);
    const scaleMatrix = new THREE.Matrix4().makeScale(scale.x, scale.y, scale.z);
    boundingBox.applyMatrix4(scaleMatrix);
    // --- 5. Create a Cuboid Collider from the Bounding Box ---
    const size = new THREE.Vector3();
    boundingBox.getSize(size);
    // no need to multply by world scale
    // Rapier's cuboid collider takes half-extents (half the width, height, and depth).
    const hx = size.x / 2;
    const hy = size.y / 2 - 0.05; //fine tuning
    const hz = size.z / 2;

    // Create the collider description with the calculated dimensions.
    // Handle the case where a dimension might be zero to avoid creating an invalid collider.
    const shape = RAPIER.ColliderDesc.cuboid(
        Math.max(hx, 0.001), // Ensure a minimum size
        Math.max(hy, 0.001),
        Math.max(hz, 0.001)
    )
        .setMass(mass)
        .setRestitution(restitution);

    // --- 6. Return the Body and Shape ---
    // The caller is responsible for creating the collider from the shape description
    // and attaching it to the body. e.g., world.createCollider(shape, body);
    return { body, shape };
}
export function getBodyShapeByBoundingBox(scene, object3D, options = {}) {
    const world = scene.world;

    // --- 1. Set Physics Options ---
    const mass = options.mass ?? 1;
    const restitution = options.restitution ?? 0.5;
    const canSleep = options.canSleep ?? false;
    const linearDamping = options.linearDamping ?? 0;
    const angularDamping = options.angularDamping ?? 0;
    const bodyType = options.bodyType || 'dynamic';
    const yOffset = options.yOffset || -0.005;
    let scale = options.scale ?? new THREE.Vector3(1, 1, 1);
    // Get the offset option, default to a zero vector
    const offset = options.offset ?? new THREE.Vector3(0, 0, 0);

    if (options.scale instanceof THREE.Vector3) {
        scale = scale;
    } else {
        let r = parseFloat(options.scale);
        if (isNaN(r)) r = 1;
        scale = new THREE.Vector3(r, r, r);
    }

    // --- 2. Get Object's World Transform ---
    object3D.updateWorldMatrix(true, false);
    const worldPosition = object3D.getWorldPosition(new THREE.Vector3());
    const worldRotation = object3D.getWorldQuaternion(new THREE.Quaternion());

    // --- 3. Calculate Local Bounding Box to Get True Size ---
    const originalRotation = object3D.quaternion.clone();
    object3D.quaternion.identity();
    object3D.updateWorldMatrix(true, false);

    const localBoundingBox = new THREE.Box3().setFromObject(object3D, true);

    object3D.quaternion.copy(originalRotation);
    object3D.updateWorldMatrix(true, false);

    // --- 4. Create Cuboid Collider from Local Bounding Box ---
    const scaleMatrix = new THREE.Matrix4().makeScale(scale.x, scale.y, scale.z);
    localBoundingBox.applyMatrix4(scaleMatrix);

    const size = new THREE.Vector3();
    localBoundingBox.getSize(size);

    const hx = size.x / 2;
    const hy = size.y / 2 + yOffset; // fine-tuning
    const hz = size.z / 2;

    // UPDATED: The offset is now applied to the collider description
    const shape = RAPIER.ColliderDesc.cuboid(
        Math.max(hx, 0.001),
        Math.max(hy, 0.001),
        Math.max(hz, 0.001)
    )
        .setMass(mass)
        .setRestitution(restitution)
        // This sets the collider's position relative to the rigid body
        .setTranslation(offset.x, offset.y, offset.z);

    // --- 5. Create the Rigid Body with Correct Transform ---
    // The rigid body's transform should always match the visual object's transform
    const desc = getBodyType(bodyType)
        .setTranslation(worldPosition.x, worldPosition.y, worldPosition.z)
        .setRotation(worldRotation)
        .setCanSleep(canSleep)
        .setLinearDamping(linearDamping)
        .setAngularDamping(angularDamping);

    const body = world.createRigidBody(desc);

    // --- 6. Return the Body and Shape ---
    return { body, shape };
}
export function getBodyShapeByBoundingSphere(scene, object, options = {}) {
    let world = scene.world;

    const mass = options.mass ?? 1;
    const restitution = options.restitution ?? 0.5;
    const canSleep = options.canSleep ?? false;
    const linearDamping = options.linearDamping ?? 0;
    const angularDamping = options.angularDamping ?? 0;
    const bodyType = options.bodyType || 'dynamic';
    const scale = options.scale || 1;


    let desc = getBodyType(bodyType)

    desc.setCanSleep(canSleep);
    desc.setLinearDamping(linearDamping);
    desc.setAngularDamping(angularDamping);


    const body = world.createRigidBody(desc);

    const box = new THREE.Box3().setFromObject(object);
    const sphere = new THREE.Sphere();
    box.getBoundingSphere(sphere);
    // console.log(sphere)



    // 4. Create the ball (sphere) shape with the final radius
    const shape = RAPIER.ColliderDesc.ball(sphere.radius * scale);
    shape.setMass(mass)
    shape.setRestitution(restitution)
    return { body, shape };
}


function getBodyType(bodyType) {

    let desc;
    switch (bodyType) {
        case 'fixed':
            // Fixed bodies are static and immovable (e.g., the ground).
            desc = RAPIER.RigidBodyDesc.fixed();
            break;
        case 'kinematicPosition':
            // Kinematic bodies are moved by code, not by physics forces, but still affect other bodies.
            desc = RAPIER.RigidBodyDesc.kinematicPositionBased();
            break;
        default: // 'dynamic'
            // Dynamic bodies are fully simulated, affected by forces, gravity, and collisions.
            desc = RAPIER.RigidBodyDesc.dynamic();
            break;
    }
    return desc
}


export class GravityPoint {
    constructor(name, gravityCenter = new THREE.Vector3(), isActive = true) {
        this.name = name;
        this.gravityCenter = gravityCenter; // Assumes THREE.Vector3
        this.isActive = isActive;
        this.affectedBodies = [];
    }

    activate() {
        this.isActive = true;
    }

    deactivate() {
        this.isActive = false;
    }

    /**
     * Sets the center. Can accept (x, y, z) or (Vector3).
     */
    setGravityCenter(arg1, arg2, arg3) {
        if (arg1 && arg1.isVector3) {
            // Handle Vector3 input
            this.gravityCenter.copy(arg1);
        } else if (typeof arg1 === 'number' && typeof arg2 === 'number' && typeof arg3 === 'number') {
            // Handle 3 floats input
            this.gravityCenter.set(arg1, arg2, arg3);
        } else {
            console.warn(`GravityPoint: Invalid arguments for setGravityCenter.`);
        }
    }

    /**
     * Adds bodies. Checks if valid Rapier bodies before adding.
     */
    addBodies(input) {
        // Normalize input to an array
        const bodiesToAdd = Array.isArray(input) ? input : [input];

        bodiesToAdd.forEach(body => {
            if (this._isValidRapierBody(body)) {
                // Prevent duplicates
                if (!this.affectedBodies.includes(body)) {
                    this.affectedBodies.push(body);
                }
            } else {
                console.warn(`GravityPoint: Attempted to add an invalid Rapier body to "${this.name}".`);
            }
        });
    }

    removeBody(bodyToRemove) {
        this.affectedBodies = this.affectedBodies.filter(body => body !== bodyToRemove);
    }

    emptyBodies() {
        this.affectedBodies = [];
    }

    /**
     * Internal helper to validate if an object is likely a Rapier body.
     * Rapier bodies usually have a 'handle' property (integer) and method like 'setLinvel'.
     */
    _isValidRapierBody(body) {
        return body && typeof body === 'object' && body.hasOwnProperty('handle');
    }
}