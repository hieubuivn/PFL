import * as THREE from 'three';
import * as ARAP from '../rapierPhysics/addRapierWorld.js';
import RAPIER from 'rapier-compat'; // FIX: Direct Import
import { updateTaskProgress, updateProgressUI } from '../../configs/setupLoaders.js';
import { yieldToBrowser } from '../utils/asyncUtils.js';
import { getDynamicText } from '../utils/contentUtils.js';

export async function bindPhysics(scene, progressText) {
    if (progressText) {
        const progress = window.loadingProgress || 0;
        updateProgressUI(progress, getDynamicText("SYS_PHYSICS_CALC"));
    }

    // Check if scene.world exists, if not, wait or throw
    if (!scene.world) {
        console.warn("Physics world not ready, waiting...");
        // rudimentary wait
        await new Promise(r => setTimeout(r, 100));
        if (!scene.world) throw new Error("Physics World not initialized");
    }

    scene.bhTargets ||= [];
    const objectMap = new Map();
    scene.traverse((obj) => { if (obj.name) objectMap.set(obj.name, obj); });

    async function specifyBinding(names, func, options = {}) {
        const targets = Array.isArray(names) ? names : [names];
        let processedCount = 0;
        let lastYieldTime = performance.now();

        for (let name of targets) {
            let m = objectMap.get(name);
            if (!m) continue;

            if (options.isBhTarget) scene.bhTargets.push(m);

            // FIX: Ensure object stays hidden when detached from Invisible Parent
            m.visible = false;

            // Time-based yielding: yield if > 1ms has passed, or force yield for heavy convex hulls
            // User requested extremely smooth transition (Super-Slice).
            if (options.isConvexHull || (performance.now() - lastYieldTime > 1)) {
                await yieldToBrowser();
                lastYieldTime = performance.now();
            }

            let bodyShape = func(scene, m, options);
            ARAP.bindBodyObject(scene, m, bodyShape.body, bodyShape.shape, options);
            processedCount++;

            // Report incremental progress if it's a multi-target binding
            if (targets.length > 5) {
                const subProgress = processedCount / targets.length;
                // Since specifyBinding is called multiple times, we'd need a global counter for perfect accuracy,
                // but for now, we'll just report "activity" or use a shared counter if available.
                // Let's assume this specific call represents a slice of physics-binding (0.1 - 0.9 range).
                updateTaskProgress('physics-binding', 0.1 + (subProgress * 0.7));
            }
        }
    }

    // Process bindings sequentially to allow yielding

    await specifyBinding([
        'backWall_rapier', 'rightWall', 'leftWall', 'glass2', 'frontWall',
        '', 'Object_15', 'Object_15001', 'Cube004', 'Cube019_3',
        'Cube019_5', "Object_1001_1", 'Object_8001', "leftWallFoot001", "Object_38001"
    ], ARAP.getFreeFormBodyShapeFromMesh, { bodyType: 'fixed', restitution: 0.4, friction: 0.4 });

    await specifyBinding(["bedMain", "bedStand"], ARAP.getFreeFormBodyShapeFromMesh, {
        bodyType: 'fixed',
        restitution: 0.1,
        friction: 0.4,
        isConvexHull: true
    });

    updateTaskProgress('physics-binding', 0.2, getDynamicText("SYS_MAPPING_BOUNDARIES"));

    // --- NEW: Character Physics Binding (Bone Tracking) ---
    // 1. Get the Character Group
    const charGroup = objectMap.get("a-char");
    if (charGroup) {
        updateTaskProgress('physics-binding', 0.3, getDynamicText("SYS_CHAR_COLLISION"));
        // 2. Define Shape (Capsule is best for characters)
        // Rotate 90 degrees on X axis
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);

        // Radius 0.6, Half-Height 1.0 
        const charShape = RAPIER.ColliderDesc.capsule(0.48, 0.66)
            .setTranslation(0, 0.1, 0) // Align center
        // .setRotation({ x: q.x, y: q.y, z: q.z, w: q.w }); // Apply 90 deg Z rotation

        // 3. Create Body
        const charBody = scene.world.createRigidBody(
            RAPIER.RigidBodyDesc.kinematicPositionBased()
        );

        // 4. Bind using Bone Tracking
        ARAP.bindSkinnedMeshToBody(scene, charGroup, charBody, charShape, {
            trackBoneName: 'mixamorigSpine1', // CONFIRMED BONE NAME
            offset: new THREE.Vector3(0, 0, 0),
            restitution: 0.5, // Allow some bounce back
            friction: 0.4,    // Reduced friction to prevent "sticking" to objects
            softKinematic: 0.7 // SWEET SPOT (0.7 is a good balance of force and stability)
        });

        // --- Add Limbs (Arms & Legs & Head) ---
        updateTaskProgress('physics-binding', 0.4, getDynamicText("SYS_BINDING_ARMATURES"));
        const limbConfigs = [
            // Upper Body (Arms)
            { bone: 'mixamorigLeftArm', shapeType: 'capsule', radius: 0.2, height: 0.4, offset: new THREE.Vector3(0, 0.35, 0) },
            { bone: 'mixamorigRightArm', shapeType: 'capsule', radius: 0.2, height: 0.4, offset: new THREE.Vector3(0, 0.35, 0) },

            // Forearms
            { bone: 'mixamorigLeftForeArm', shapeType: 'capsule', radius: 0.2, height: 0.3, offset: new THREE.Vector3(0, 0.5, 0) },
            { bone: 'mixamorigRightForeArm', shapeType: 'capsule', radius: 0.2, height: 0.3, offset: new THREE.Vector3(0, 0.5, 0) },

            // Legs (Upper & Lower)
            { bone: 'mixamorigLeftUpLeg', shapeType: 'capsule', radius: 0.3, height: 0.4, offset: new THREE.Vector3(0, 1, 0) },
            { bone: 'mixamorigRightUpLeg', shapeType: 'capsule', radius: 0.3, height: 0.4, offset: new THREE.Vector3(0, 1, 0) },
            // { bone: 'mixamorigLeftLeg', shapeType: 'capsule', radius: 0.3, height: 0.4, offset: new THREE.Vector3(0, 1, 0) },
            { bone: 'mixamorigRightLeg', shapeType: 'capsule', radius: 0.3, height: 0.4, offset: new THREE.Vector3(0, 1, 0) },

            // Feet
            { bone: 'mixamorigLeftFoot', shapeType: 'capsule', radius: 0.24, height: 0.15, offset: new THREE.Vector3(0, 0.5, 0) },
            { bone: 'mixamorigRightFoot', shapeType: 'capsule', radius: 0.24, height: 0.15, offset: new THREE.Vector3(0, 0.5, 0) },

            // Head (Note: Balls don't visually rotate, but applying consistent logic)
            { bone: 'mixamorigHead', shapeType: 'ball', radius: 0.43, offset: new THREE.Vector3(0, 0.35, 0) }
        ];

        limbConfigs.forEach(config => {
            let limbShape;

            if (config.shapeType === 'ball') {
                limbShape = RAPIER.ColliderDesc.ball(config.radius);
            } else {
                limbShape = RAPIER.ColliderDesc.capsule(config.height, config.radius);
            }

            if (config.offset) {
                limbShape.setTranslation(config.offset.x, config.offset.y, config.offset.z);
            }
            if (config.rotation) {
                limbShape.setRotation(config.rotation);
            }

            const limbBody = scene.world.createRigidBody(
                RAPIER.RigidBodyDesc.kinematicPositionBased()
            );

            ARAP.bindSkinnedMeshToBody(scene, charGroup, limbBody, limbShape, {
                trackBoneName: config.bone,
                restitution: 0.5,
                friction: 0.4, // Lower friction for limbs to avoid sticking
                softKinematic: 0.7 // SWEET SPOT
            });
        });
    } else {
        console.warn("bindPhysics: Character 'a-char' not found.");
    }

    // --- Ceiling Fan Physics (Animated Tracking) ---
    updateTaskProgress('physics-binding', 0.5, getDynamicText("SYS_ANCHORING_ROTORS"));
    for (const fanPartName of ["cFanBody"]) {
        const fanPart = objectMap.get(fanPartName);
        if (fanPart) {
            const { body, shape } = ARAP.getFreeFormBodyShapeFromMesh(scene, fanPart, {
                bodyType: 'kinematicPosition'
            });
            ARAP.bindSkinnedMeshToBody(scene, fanPart, body, shape, {
                restitution: 0.2,
                friction: 0.9,
                softKinematic: 0.7 // Allows smooth but firm deflection
            });
        }
    }


    await specifyBinding("glassInvi", ARAP.getFreeFormBodyShapeFromMesh, { bodyType: 'kinematicPosition' });

    //stool
    await specifyBinding("stool_bound", ARAP.getFreeFormBodyShapeFromMesh, {
        bodyType: 'kinematicPosition',
        isIntegrityResetTarget: true,
        isIntegrityCheckTarget: true,
        isConvexHull: true,    // MUCH more stable for dynamic collisions than Trimesh
        restitution: 0.7,      // Bouncier
        friction: 0.2          // Slippery
    });


    updateTaskProgress('physics-binding', 0.6, getDynamicText("SYS_DYNAMIC_RIGIDBODIES"));
    await specifyBinding('Object_31', ARAP.getFreeFormBodyShapeFromMesh, { bodyType: 'dynamic', restitution: 0.2, mass: 10, pullingDampness: 0.25, canSleep: true, isBhTarget: true, isConvexHull: true, isIntegrityCheckTarget: true }); // LAPTOP - Restored Convex
    await specifyBinding('pictureLionFrame', ARAP.getFreeFormBodyShapeFromMesh, { bodyType: 'dynamic', mass: 1, pullingDampness: 0.0025, canSleep: true, isBhTarget: true, isConvexHull: true, isIntegrityCheckTarget: false, isIntegrityResetTarget: true }); // PICTURE FRAME - Restored Convex

    await specifyBinding('Model_0001', ARAP.getFreeFormBodyShapeFromMesh, { bodyType: 'dynamic', mass: 1.5, restitution: 0.01, friction: 0.995, pullingDampness: 0.0025, canSleep: true, isBhTarget: true, isConvexHull: true, isIntegrityResetTarget: true, isIntegrityCheckTarget: false }); // PICTURE FRAME 2 - Restored Convex

    // await specifyBinding("caseCover", ARAP.getFreeFormBodyShapeFromMesh, { bodyType: 'dynamic', mass: 400, restitution: 0.3, canSleep: true, isBhTarget: true,  pullingDampness: 0.25 }) // SHELF

    await specifyBinding('blackCat', ARAP.getBodyShapeByBoundingBox, { bodyType: 'fixed', scale: new THREE.Vector3(1, 1, 0.5), offset: new THREE.Vector3(0, 0.5, 0) }); //black cat

    // await specifyBinding('Object_108', ARAP.getBodyShapeByBoundingBox, { bodyType: 'kinematicPosition', scale: new THREE.Vector3(2, 1, 1) }); //whiteCat (OLD)

    // --- NEW: Cat Physics (GLTF_created_0001) ---
    updateTaskProgress('physics-binding', 0.7, getDynamicText("SYS_BONE_HIERARCHIES"));
    const whiteCatGroup = objectMap.get("GLTF_created_0001");
    if (whiteCatGroup) {
        // Main Body (Root)
        const catShape = RAPIER.ColliderDesc.capsule(0.2, 0.15)
            .setTranslation(0, 0, 0);

        const catBody = scene.world.createRigidBody(
            RAPIER.RigidBodyDesc.kinematicPositionBased()
        );

        ARAP.bindSkinnedMeshToBody(scene, whiteCatGroup, catBody, catShape, {
            trackBoneName: 'Root_M_2_6_11',
            offset: new THREE.Vector3(0, 0, 0),
            restitution: 0.2,
            friction: 0.9,
            softKinematic: 0.7 // SWEET SPOT
        });

        const catLimbs = [
            // Hips
            { bone: 'HipFix_R_3_7_12', shapeType: 'ball', radius: 0.1, offset: new THREE.Vector3(0, 0, 0) },
            { bone: 'HipFix_L_85_89_94', shapeType: 'ball', radius: 0.1, offset: new THREE.Vector3(0, 0, 0) },

            // Chest / Front
            { bone: 'RootPart1_M_16_20_25', shapeType: 'capsule', radius: 0.4, height: 0.3, offset: new THREE.Vector3(0, 0.2, 0.2) },

            // Tail
            { bone: 'Tail0_M_10_14_19', shapeType: 'capsule', radius: 0.05, height: 0.2, offset: new THREE.Vector3(0, 0, 0) },
            { bone: 'Tail20_M_15_19_24', shapeType: 'capsule', radius: 0.05, height: 0.2, offset: new THREE.Vector3(0, 0, 0) },

            // Head
            { bone: 'Head_M_26_30_35', shapeType: 'ball', radius: 0.3, offset: new THREE.Vector3(0, 0, 0) }
        ];

        catLimbs.forEach(config => {
            let limbShape;
            if (config.shapeType === 'ball') {
                limbShape = RAPIER.ColliderDesc.ball(config.radius);
            } else {
                limbShape = RAPIER.ColliderDesc.capsule(config.height, config.radius);
            }

            if (config.offset) {
                limbShape.setTranslation(config.offset.x, config.offset.y, config.offset.z);
            }

            const limbBody = scene.world.createRigidBody(
                RAPIER.RigidBodyDesc.kinematicPositionBased()
            );

            ARAP.bindSkinnedMeshToBody(scene, whiteCatGroup, limbBody, limbShape, {
                trackBoneName: config.bone,
                restitution: 0.2,
                friction: 0.9,
                softKinematic: 0.7 // SWEET SPOT
            });
        });
    }

    await specifyBinding("Object_2001", ARAP.getFreeFormBodyShapeFromMesh, {
        bodyType: 'dynamic',
        mass: 80,
        restitution: 0.6,
        canSleep: true,
        isBhTarget: true,
        isConvexHull: true,
        offset: new THREE.Vector3(0, 0., 0),
        pullingDampness: 0.45,
        isIntegrityCheckTarget: true
    }); // CHAIR

    await specifyBinding("mjolnir_low_mjolnir_hammer_0", ARAP.getFreeFormBodyShapeFromMesh, { bodyType: 'dynamic', mass: 10, restitution: 0.0, canSleep: true, isBhTarget: true, pullingDampness: 0.9075, isConvexHull: true, isIntegrityResetTarget: true }); // MJOLNIR - Restored Convex


    await specifyBinding('questionCube', ARAP.getBodyShapeByBoundingBox, { bodyType: 'dynamic', mass: 20, isBhTarget: true, isIntegrityResetTarget: true });

    await specifyBinding("shelf", ARAP.getFreeFormBodyShapeFromMesh, { bodyType: 'dynamic', mass: 400, restitution: 0.3, canSleep: true, isBhTarget: true, pullingDampness: 0.25, isIntegrityCheckTarget: false, isIntegrityResetTarget: true }); // SHELF

    let books = [];
    for (let i = 0; i <= 38; i++) {
        const bookName = "book" + String(i).padStart(3, "0");
        books.push(bookName);
    }

    await specifyBinding(books, ARAP.getBodyShapeByBoundingBox, { bodyType: 'dynamic', isBhTarget: true, mass: 2, restitution: 0.05, canSleep: true, pullingDampness: 0.25, isIntegrityCheckTarget: false, isIntegrityResetTarget: true });

    await specifyBinding(['pokeball', 'pokeball2'], ARAP.getBodyShapeByBoundingSphere, { bodyType: 'dynamic', mass: 27.0, scale: 0.425, restitution: 0.9, isBhTarget: true, isIntegrityResetTarget: true });

    await specifyBinding('drone', ARAP.getBodyShapeByBoundingBox, { bodyType: 'kinematicPosition', mass: 2.5, isBhTarget: false, linearDamping: 1, angularDamping: 1 });

    updateTaskProgress('physics-binding', 0.85, getDynamicText("SYS_COLLISION_MESHES"));
    try {
        await specifyBinding('caseCover', ARAP.getBodyShapeByBoundingBox, { bodyType: 'dynamic', mass: 100, restitution: 0.1, isBhTarget: true, isIntegrityCheckTarget: true }); //PC case

        await specifyBinding("Object_42001", ARAP.getBodyShapeByBoundingBox, { bodyType: 'dynamic', mass: 0.5, restitution: 0.93, canSleep: true, isBhTarget: true, pullingDampness: -1, isIntegrityResetTarget: true }); //mouse

        // specifyBinding("Object_38001", ARAP.getBodyShapeByBoundingBox, { bodyType: 'dynamic', mass: 0.5, restitution: 0.7, canSleep: true, isBhTarget: true, pullingDampness: 0 }) // keyboard

        await specifyBinding('screenDisplay', ARAP.getBodyShapeByBoundingBox, { bodyType: 'dynamic', mass: 200, scale: new THREE.Vector3(1, 1.05, 0.9), offset: new THREE.Vector3(0, -0.13, 0), isBhTarget: true, pullingDampness: 0.5, isIntegrityCheckTarget: true }); //monitor

        await specifyBinding('screenDisplay2', ARAP.getBodyShapeByBoundingBox, { bodyType: 'dynamic', mass: 20, scale: new THREE.Vector3(1, 1.05, 0.9), offset: new THREE.Vector3(0, -0.13, 0), isBhTarget: true, pullingDampness: 0.15, restitution: 0.3, isIntegrityCheckTarget: true }); //monitor


        await specifyBinding('verticalMonitor', ARAP.getBodyShapeByBoundingBox, { bodyType: 'dynamic', mass: 150, friction: 0.9, scale: new THREE.Vector3(1, 1., 1), offset: new THREE.Vector3(0, 1.75, 0), isBhTarget: true, pullingDampness: 0.25, isIntegrityCheckTarget: true }); //monitor

        await specifyBinding(['aegis', 'aegis2'], ARAP.getFreeFormBodyShapeFromMesh, { bodyType: 'dynamic', mass: 1.1, restitution: 0.01, canSleep: true, isBhTarget: true, isConvexHull: true, isIntegrityResetTarget: true }); // AEGIS - Restored Convex

        await specifyBinding(['pillow-small-1', 'pillow-small-2', 'pillow-big-1', 'pillow-big-2'], ARAP.getFreeFormBodyShapeFromMesh, { bodyType: 'dynamic', mass: 100.3, restitution: 0.0, friction: 0.9, canSleep: true, pullingDampness: 0.64, isBhTarget: true, isConvexHull: true, isIntegrityResetTarget: true }); // PILLOWS - Restored Convex

    } catch (e) {
        throw e;
    }
}
