import * as THREE from 'three';
import { ASSET_VERSION } from '../configs/sceneConfig.js';
import { gltfLoader, rgbeLoader, textureLoader, ktx2Loader, dracoLoader, fileLoader, handleProgress, registerFile } from '../../configs/setupLoaders.js';
import { PerformanceLogger } from '../utils/performanceLogger.js';



const pointsGLB = 'points.glb';
// const roomGLB = 'allstars_walking40_room.glb';
const roomGLB = 'room8.glb';
const roomHDR = 'peppermint_powerplant_2_1k_256.hdr';
const blank = 'blank2.webp';
const noise = 'noise.webp';
const spriteSheet = 'spriteSheet-etc.ktx2';
const spriteSheetIcon = 'spriteSheet.webp'; // High-quality WebP version for CSS/UI context
const avatarsCelShaded = 'avatars-celShaded.ktx2';

// Global shared resource object
export const resources = {
    spriteSheetSpecialIcons: {
        btc: { row: 1, col: 7 }, // start with 0
        eth: { row: 1, col: 5 }, // start with 0
    }
};

/**
 * Pre-register all files to ensure progress bar scaling is accurate from the start.
 */
export function preRegisterAllResources() {
    // Phase 1 Weights
    registerFile(pointsGLB, 1.2 * 1024 * 1024);     // 1.2MB
    registerFile(spriteSheet, 82 * 1024);           // 82KB (KTX2 ETC1S - GPU only)
    registerFile(spriteSheetIcon, 46 * 1024);      // 46KB (WebP - CSS Tooltip usage)
    registerFile(roomGLB, 4.3 * 1024 * 1024);      // 4.3MB
    registerFile(roomHDR, 107 * 1024);      // 107KB (256px HDR)
    registerFile(blank, 1 * 1024);
    registerFile(noise, 8 * 1024);
    registerFile(avatarsCelShaded, 0.18 * 1024 * 1024); // 450KB
}

const addToLoader = (filename, key, type = 'texture', options = {}) => {
    const { folder = null, onLoaded = null } = options;

    let path = folder;
    if (!path) {
        const BASE = (import.meta.env && import.meta.env.BASE_URL && import.meta.env.BASE_URL !== '/') 
                     ? import.meta.env.BASE_URL 
                     : './';
        path = ((type === 'gltf') ? `${BASE}models/` : (type === 'ktx2' ? `${BASE}textures/ktx2/` : `${BASE}textures/`)).replace('//', '/');
    }
    const url = `${path}${filename}?v=${ASSET_VERSION}`;

    // NOTE: registerFile(filename) is now handled exclusively by preRegisterAllResources()
    // to ensure the total weight is consistent from the first frame.

    let p;
    // Track specific critical resources
    const isCritical = filename.includes('allstars_walking') || filename.includes('sprite');
    const perfLabel = `load_${filename}`;

    if (isCritical) PerformanceLogger.markStart(perfLabel);

    if (type === 'gltf') {
        p = new Promise((resolve) => {
            gltfLoader.setDRACOLoader(dracoLoader);
            gltfLoader.load(url, (gltf) => {
                if (isCritical) PerformanceLogger.markEnd(perfLabel);
                resources[key] = gltf;
                if (onLoaded) onLoaded(gltf);
                resolve();
            }, (xhr) => handleProgress(filename, xhr.loaded, xhr.total));
        });
    } else if (type === 'rgbe') {
        p = new Promise((resolve) => {
            rgbeLoader.load(url, (texture) => {
                resources[key] = texture;
                if (onLoaded) onLoaded(texture);
                resolve();
            }, (xhr) => handleProgress(filename, xhr.loaded, xhr.total));
        });
    } else if (type === 'bin') {
        p = new Promise((resolve) => {
            fileLoader.setResponseType('arraybuffer');
            fileLoader.load(url, (data) => {
                if (isCritical) PerformanceLogger.markEnd(perfLabel);
                resources[key] = data;
                if (onLoaded) onLoaded(data);
                resolve();
            }, (xhr) => handleProgress(filename, xhr.loaded, xhr.total), (err) => {
                console.warn("Failed to load bin:", filename, err);
                resolve(); // Resolve to avoid hanging
            });
        });
    } else if (type === 'ktx2') {
        p = new Promise((resolve) => {
            ktx2Loader.load(url, (texture) => {
                if (isCritical) PerformanceLogger.markEnd(perfLabel);
                resources[key] = texture;
                if (onLoaded) onLoaded(texture);
                resolve();
            }, (xhr) => handleProgress(filename, xhr.loaded, xhr.total));
        });
    } else {
        // Texture
        p = new Promise((resolve) => {
            textureLoader.load(url, (texture) => {
                if (isCritical) PerformanceLogger.markEnd(perfLabel);
                resources[key] = texture;
                if (onLoaded) onLoaded(texture);
                resolve();
            }, (xhr) => handleProgress(filename, xhr.loaded, xhr.total));
        });
    }
    return p;
};

// Animation Processor Helper
const processPointsAnimations = (gltf) => {
    const mixer = new THREE.AnimationMixer(gltf.scene);
    gltf.mixer = mixer;
    gltf.pointsClips = [];
    gltf.pointsActiveAction = null;
    gltf.pointsClips = gltf.animations;
    // gltf.animations.forEach((clip) => {
    //     const action = mixer.clipAction(clip);
    //     if (["gangnam", "robotDance", "waving", 'breakDance', 'walking', 'standToSit'].includes(clip.name)) {
    //         gltf.pointsClips.push(clip);
    //     } else if (clip.name === "typing") {
    //         gltf.pointsClips.push(clip);
    //         action.play();
    //         gltf.pointsActiveAction = action;
    //     } else {
    //         action.play();
    //     }
    // });
};
const processRoomAnimations = (gltf) => {
    const mixer = new THREE.AnimationMixer(gltf.scene);
    gltf.mixer = mixer;
    gltf.heroClips = [];
    gltf.activeAction = null;
    gltf.animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        if (["bangingFist", "gangnam", "robotDance", "sitToStand", "sitToType", "standClap", "golfDrive", "walking", "waving", "castSpell", 'breakDance'].includes(clip.name)) {
            gltf.heroClips.push(clip);
        } else if (clip.name === "typing") {
            gltf.heroClips.push(clip);
            action.play();
            gltf.activeAction = action;
        } else {
            action.play();
        }
    });
};

/**
 * Phase 1: Core Assets needed for Points system
 */
export async function loadCoreResources() {
    PerformanceLogger.start('Phase 1 Download');
    // OPTION D: Truly Sequential Load with Breathers
    // We execute the addToLoader calls INSIDE the loop to prevent parallel request spikes
    const loadTasks = [
        { name: pointsGLB, key: 'pointsModel', type: 'gltf', options: { onLoaded: processPointsAnimations } },
        {
            name: spriteSheet, key: 'spriteSheet', type: 'ktx2',
            options: {
                folder: './textures/ktx2/',
                onLoaded: (t) => {
                    t.minFilter = THREE.LinearMipMapLinearFilter;
                    t.magFilter = THREE.LinearFilter;
                    t.generateMipmaps = false; // KTX2 must have mipmaps pre-authored
                    t.anisotropy = 16;
                }
            }
        },
        {
            name: spriteSheetIcon, key: 'spriteSheetIcon', type: 'texture',
            options: { onLoaded: (t) => { t.minFilter = THREE.LinearFilter; t.magFilter = THREE.LinearFilter; } }
        },
        {
            name: avatarsCelShaded, key: 'avatarsCelShaded', type: 'ktx2',
            options: {
                folder: 'textures/ktx2/',
                onLoaded: (t) => {
                    t.minFilter = THREE.LinearMipMapLinearFilter;
                    t.magFilter = THREE.LinearFilter;
                    t.generateMipmaps = false;
                }
            }
        },
        {
            name: blank, key: 'blank', type: 'texture',
            options: { onLoaded: (t) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; } }
        },
        {
            name: noise, key: 'noise', type: 'texture',
            options: { onLoaded: (t) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; } }
        }
    ];

    for (const task of loadTasks) {
        await addToLoader(task.name, task.key, task.type, task.options);
        // 80ms breather for Draco decompression and main thread animation frames
        await new Promise(r => setTimeout(r, 80));
    }

    PerformanceLogger.end('Phase 1 Download');
    return resources;
}

/**
 * Phase 2: Secondary Assets deferred for scene transition
 */
export async function loadSecondaryResources() {
    // Truly Sequential Load with Breathers
    const secondaryTasks = [
        {
            name: roomGLB, key: 'roomModel', type: 'gltf',
            options: { onLoaded: (gltf) => { if (gltf.animations?.length) processRoomAnimations(gltf); } }
        },
        {
            name: roomHDR, key: 'environmentMap', type: 'rgbe',
            options: { onLoaded: (t) => { t.mapping = THREE.EquirectangularReflectionMapping; } }
        }
    ];

    for (const task of secondaryTasks) {
        await addToLoader(task.name, task.key, task.type, task.options);
        // 80ms breather for environment map processing and main thread
        await new Promise(r => setTimeout(r, 80));
    }

    return resources;
}

// Default export compatibility if needed (but prefer phased calls)
export async function loadAllResources() {
    await loadCoreResources();
    await loadSecondaryResources();
    return resources;
}