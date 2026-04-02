import * as THREE from 'three';
import { textureLoader, updateProgressUI, updateTaskProgress } from '../../configs/setupLoaders.js';
import { PerformanceLogger } from '../utils/performanceLogger.js';
import { BasicGeometries } from '../../configs/setupGeometries.js';
import { constantUniform, linkConstantUniforms } from '../utils/addConstantUniform.js';
import { adjustWalls } from './adjustWalls.js';
import { addLightning } from './addLightning.js';
import { addBulb } from './addBulb.js';
import * as CONSTANTS from '../utils/constant.js';
import { addFireflies } from './addFireflies.js';
import * as ARAP from '../rapierPhysics/addRapierWorld.js';
import { loadedModelRaycast } from '../raycast/loadedModelRaycast.js';
// import { prewarmCoinPool } from './spawnBitcoin.js';
// import { resources } from './loadResources.js';
import { createShaderMat, adjustObjects, patchGridToObjects } from './adjustObjects.js';
import { bindPhysics } from './bindPhysics.js';
import { addLensflare } from './addLensflare.js';
import { addGrid } from './addGrid.js';
import { patchWaterFlow } from '../utils/shaderPatches.js';
import * as SU from '../scenario/scenarioUtility.js';
import { initConversationBox } from './addConversationBox.js';
import { yieldToBrowser } from '../utils/asyncUtils.js';
import { getDynamicText } from '../utils/contentUtils.js';


// --- Helper: Create Text Sprite ---



// import { addTestPlane } from './addPlane.js';


// const GLB = 'gltf-compressed-MessyRoom58-c6.glb'; //scale up drone to x0.35
// const GLB = 'placeholderMat.glb'; //scale up drone to x0.35






const goldOuterGlowMat = CONSTANTS.createOuterGlowMat("#dcd0ba", 0.85, 0.03, 6.5);
const goldInnerGlowMat = CONSTANTS.createInnerGlowMat("#dcd0ba", 1., 1);

// --- Helper Functions ---

function adjustBlackhole(scene) {
    let blackhole = scene.getObjectByName("Blackhole");
    if (!blackhole) return;

    blackhole.position.y = -500;
    blackhole.scale.setScalar(2);
    blackhole.traverse((child) => {
        if (child.isMesh && child.material) {
            child.material.roughness = 0.95;
            child.material.metalness = 0;
            child.material.side = THREE.FrontSide;
            child.castShadow = false;
            // child.material.needsUpdate = true;
        }
    });

    function setBHMatProp(name, property, value) {
        const child = blackhole.getObjectByName(name);
        if (child?.material && child.material[property] !== undefined) {
            child.material[property] = value;
        }
    }
    //Lathe_S_Blackhole_01_0
    // Lathe_S_Blackhole_01_0001
    setBHMatProp("Lathe_L_Blackhole_03_0", "roughness", 0.4);
    setBHMatProp("Lathe_S_Blackhole_01_0", "metalness", 0.6);

    // let planeWall = new THREE.Mesh(BasicGeometries.plane);
    let lathe = blackhole.getObjectByName("Lathe_Center");
    if (lathe) {
        const hub = scene.globalUniformsHub;
        const baseUniforms = hub ? hub.core : {};

        const realNebulaMat = new THREE.ShaderMaterial({
            vertexShader: CONSTANTS.sineVertexShader,
            fragmentShader: CONSTANTS.nebulaHelixFS,
            transparent: true,
            uniforms: {
                ...hub.uniforms, // Link to Global Hub (includes uNebulaRotation/Swirl)
                nebulaCoreRadius: { value: 20.0 }, // Local context
                nebulaTwistFactor: { value: 0.0 },
                alpha: { value: 1.0 }
            },
            blending: THREE.AdditiveBlending,
            name: 'nebulaMat'
        });
        lathe.material = realNebulaMat;
    }

    // let scaleFactor = 3.5;
    // planeWall.scale.set(scaleFactor, scaleFactor, 1);
    // planeWall.rotation.set(0, Math.PI / 2, 0);
    // planeWall.position.set(-6.45, 7.1, -0.39);
    // planeWall.name = "planeWall";

    // scene.add(planeWall);
    // planeWall.visible = false;
    // addTweenData(planeWall, scene);
}


function addSky(scene) {
    const hub = scene.globalUniformsHub;
    const hubUniforms = hub ? hub.uniforms : {};

    const skyShaderMat = createShaderMat(scene, CONSTANTS.stormFS, {
        side: THREE.BackSide,
        uniforms: {
            ...hub.core,
            isStriking: hubUniforms.isStriking || { value: false },
            normalizedStrikePos: hubUniforms.normalizedStrikePos || { value: new THREE.Vector2(-2.0, -2.0) },
            uRainHeaviness: hubUniforms.uRainHeaviness || { value: 2.0 },
            uStormSharpness: hubUniforms.uStormSharpness || { value: 0.0 },
            uMoonPosition: hubUniforms.uMoonPosition || { value: new THREE.Vector2(0.58, 0.705) },
            uMoonSize: hubUniforms.uMoonSize || { value: 0.006 },
            uMoonBrightness: hubUniforms.uMoonBrightness || { value: 2.5 },
            uMoonBlur: hubUniforms.uMoonBlur || { value: 0.0 },
            uCraterScale: hubUniforms.uCraterScale || { value: 0.555 },
            uCraterIntensity: hubUniforms.uCraterIntensity || { value: 0.280 },
            uFarMountainOffset: hubUniforms.uFarMountainOffset || { value: 0.0 },
            uNearMountainOffset: hubUniforms.uNearMountainOffset || { value: -0.5 }
        }
    });

    let planeSky = new THREE.Mesh(BasicGeometries.plane, skyShaderMat);
    scene.add(planeSky);
    planeSky.position.set(-55.00, -20.00, 30.00);
    planeSky.scale.setScalar(150);
    planeSky.name = "planeSky";
    planeSky.visible = false; // Hide initially
}

function adjustRainyGlass(scene) {
    const hub = scene.globalUniformsHub;
    const hubUniforms = hub ? hub.uniforms : {};

    const rainyGlassMat = createShaderMat(scene, CONSTANTS.rainyGlassFS, {
        transparent: true,
        uniforms: {
            // Core globals (iTime, etc.) provided by createShaderMat (...hub.core)
            rainGlassOpacity: hubUniforms.rainGlassOpacity || { value: 1.0 },
            glassRainAmount: hubUniforms.glassRainAmount || { value: 1.0 },
            uRimCenter: hubUniforms.uRimCenter || { value: new THREE.Vector2(-0.5, 0.5) },
            uRainOffset: hubUniforms.uRainOffset || { value: 0.0 },
            uWaterIntensity: hub ? (hub.uWaterIntensity || { value: 0.2 }) : { value: 0.2 },
            hasRimOnGlass: { value: true } // Simplified to 1 material
        },
        blending: THREE.AdditiveBlending,
        side: THREE.FrontSide
    });

    // --- APPLY PATCH TO SHADERMATERIAL ---
    // For ShaderMaterial, we patch the strings BEFORE standard Three.js compilation
    const mockShader = {
        vertexShader: rainyGlassMat.vertexShader,
        fragmentShader: rainyGlassMat.fragmentShader,
        uniforms: rainyGlassMat.uniforms
    };
    patchWaterFlow(mockShader, rainyGlassMat.uniforms);
    rainyGlassMat.vertexShader = mockShader.vertexShader;
    rainyGlassMat.fragmentShader = mockShader.fragmentShader;

    const g1 = scene.getObjectByName("glass1");
    const g2 = scene.getObjectByName("glass2");

    if (g1) g1.material = rainyGlassMat;
    if (g2) g2.material = rainyGlassMat;
}





function addTweenData(item, scene) {
    let parent = item.initialParent || item.parent;
    const itemData = {
        uuid: item.uuid,
        name: item.name,
        position: item.position.clone(),
        rotation: {
            x: item.rotation.x,
            y: item.rotation.y,
            z: item.rotation.z,
            order: item.rotation.order,
        },
        scale: item.scale.clone(),
        parent: parent
    };
    scene.tweenData = scene.tweenData || {};
    scene.tweenData[item.uuid] = itemData;

    // Also store in userData for scenarioUtility usage
    item.userData.originalPos = itemData.position;
    item.userData.originalRot = itemData.rotation;
    item.userData.originalScale = itemData.scale;
}

// --- Async Logic ---





// --- Main Class ---

export class Model {
    constructor(scene, camera, renderer, resources) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.model = null;
        this.mixer = null;
        this.constantUniform = constantUniform;
        this.resources = resources;

    }

    async init(progressText, progressBar, options = {}) {
        return new Promise(async (resolve, reject) => {
            // Use pre-loaded resource
            const gltf = this.resources.roomModel;

            if (!gltf) {
                const err = "Resources: Room Model not loaded.";
                console.error(err);
                if (progressText) {
                    const progress = window.loadingProgress || 0;
                    updateProgressUI(progress, getDynamicText("SYS_ERROR"));
                }
                reject(err);
                return;
            }

            let compileInterval; // Hoisted for scope visibility

            try {
                if (progressText) {
                    const progress = window.loadingProgress || 0;
                    updateProgressUI(progress, getDynamicText("SYS_INIT_SCENE"));
                }
                updateTaskProgress('model-assembly', 0.1);

                // 1. Synchronous Setup
                this.model = gltf.scene;
                this.model.name = 'roomGLBModel';
                // OPTION A: BORN HIDDEN (Prevents Flash)
                this.model.visible = false;
                this.scene.add(this.model);
                this.scene.room = this.model;
                this.scene.animations = gltf.animations;

                // --- FEATURE: HEAD CONVERSATION BOX ---
                this.boxUpdater = initConversationBox(this.model, this.scene);
                this.scene.conversationManager = this.boxUpdater; // EXPOSE GLOBALLY for IntegrityCheck




                // Shadows
                // Shadows Optimization: OPT-IN Strategy
                const receiveShadows = [
                    "leftWallFoot001", "Cube004", "shelf", "glass1", "Object_17",
                    "Object_1001_1", 'Object_8001', 'glass1', 'pillow-big-2',
                    'pillow-small-2', 'pillow-small-1', 'pillow-big-1', 'bedMain', 'Ch23_Hair', 'Ch23_Suit', 'Object_15'
                ];
                const notCastShadows = ['Object_1001_1', 'Object_8001', "Object_17", 'leftWallFoot001'];

                this.model.getObjectByName('inviMesh').material.visible = false;

                // ASYNC TRAVERSAL FOR SHADOWS
                const shadowStack = [this.model];
                let shadowItemsProcessed = 0;
                let shadowLastYield = performance.now();

                while (shadowStack.length > 0) {
                    const child = shadowStack.pop();

                    if (child.isMesh) {
                        child.material.side = THREE.FrontSide;
                        if (receiveShadows.includes(child.name)) child.receiveShadow = true;
                        if (notCastShadows.includes(child.name)) child.castShadow = false;
                        else if (child.name.startsWith('book')) child.castShadow = false;
                        else child.castShadow = true;
                    }

                    if (child.children) {
                        for (let i = child.children.length - 1; i >= 0; i--) {
                            shadowStack.push(child.children[i]);
                        }
                    }

                    shadowItemsProcessed++;
                    if (shadowItemsProcessed % 50 === 0 && (performance.now() - shadowLastYield > 4)) {
                        await yieldToBrowser();
                        shadowLastYield = performance.now();
                    }
                }

                // Animation Setup (Loaded in loadResources.js)
                this.mixer = gltf.mixer;
                this.scene.mixer = gltf.mixer;
                this.scene.heroClips = gltf.heroClips;
                this.scene.activeAction = gltf.activeAction;

                // Capture Fan Action for interactive speed control
                if (this.mixer && this.scene.animations) {
                    const fanClip = THREE.AnimationClip.findByName(this.scene.animations, "3|PlaneAction");
                    if (fanClip) {
                        this.scene.fanAction = this.mixer.clipAction(fanClip);
                        this.scene.fanAction.play();
                    }
                }


                // Run Visual Helpers
                PerformanceLogger.start('Helpers Setup');
                adjustWalls(this.scene);
                adjustBlackhole(this.scene);
                addSky(this.scene);
                adjustRainyGlass(this.scene);
                addLightning(this.scene);
                addBulb(this.scene);
                let fireflies = addFireflies(this.scene);
                let blackhole = this.scene.getObjectByName("blackholeScene");
                blackhole.attach(fireflies);
                PerformanceLogger.end('Helpers Setup');

                // addGrid(this.scene, CONSTANTS.testGridFS);


                // let testPlane = addTestPlane(this.scene, CONSTANTS.fireFS);

                // linkConstantUniforms(this.scene.testPlane.material, ['uMouse', 'iTime']);

                // constantUniform.uFirePos = { value: 0.15 };











                PerformanceLogger.start('Adjust Objects');

                // Chain Operations (User requested no await, so we use .then sequence)
                adjustObjects(this.scene, progressText)
                    .then(() => {
                        // patchGridToObjects moved after physics binding
                        PerformanceLogger.end('Adjust Objects');
                        PerformanceLogger.start('Bind Physics');
                        let bindPromise = bindPhysics(this.scene, progressText);
                        // SU.initializeRoomScenario(this.scene);
                        return bindPromise;
                    })
                    .then(async () => {
                        PerformanceLogger.end('Bind Physics');

                        // 3. Post-Physics Setup
                        updateTaskProgress('physics-binding', 0.9);
                        await patchGridToObjects(this.scene); // Moved here to access scene.physicBodies
                        updateTaskProgress('physics-binding', 1.0);
                        loadedModelRaycast(this.scene);
                        this.scene.constantUniform = constantUniform;

                        if (progressText) {
                            const progress = window.loadingProgress || 0;
                            updateProgressUI(progress, getDynamicText("SYS_FINALIZE"));
                        }
                        return Promise.resolve();
                    })
                    .then(() => {
                        updateProgressUI(100);
                        clearInterval(compileInterval);

                        // FINAL SAFEGUARD: OFFSET (Not Scale)
                        // We move the room far away after physics binding.
                        // Physics bodies for fixed objects stay at (0,0,0) (Correct).
                        // Visuals disappear into the void.
                        if (this.model) {
                            this.model.position.set(0, -50000, 0);
                            // Remove scale set if present
                        }

                        resolve();
                    })
                    .catch((error) => {
                        console.error("Critical error in async chain:", error);
                        reject(error);
                    });

            } catch (error) {
                console.error("Critical error during scene initialisation:", error);
                reject(error);

            } finally {
                if (compileInterval) clearInterval(compileInterval);
                // SEAL tasks if not already done
                if (window.completeTask) {
                    completeTask('model-assembly');
                    completeTask('physics-binding');
                }
            }
        });
    }

    updateAnimationMixer(delta) {
        // TWEEN.update();
        // if (this.constantUniform) this.constantUniform.iTime.value += delta;
        if (this.mixer) this.mixer.update(delta);
        if (this.boxUpdater) this.boxUpdater.update(delta);
    }
}


