import * as THREE from 'three';
import { textureLoader, ktx2Loader } from '../../configs/setupLoaders.js';
import { BasicGeometries } from '../../configs/setupGeometries.js';
import { resources } from './loadResources.js';
// import { linkConstantUniforms } from '../utils/addConstantUniform.js';
import { patchWaterFlow, patchGrid, patchWelcomeText } from '../utils/shaderPatches.js';

const geo = BasicGeometries.plane;
const wallMat = new THREE.MeshStandardMaterial({
    roughness: 0.90,
    color: 0x0a1633,//0x0a1633, // dark navy color
    metalness: 0.25,
    side: THREE.FrontSide,
    name: 'wallMat',
    // envMapRotation: 0.1,
    // bumpScale: 0.0005
});
const backWallMat = new THREE.MeshStandardMaterial({
    roughness: 0.90,
    color: "#090919",//0x0a1633, // dark navy color
    metalness: 0.25,
    side: THREE.FrontSide,
    name: 'backWallMat',
    // envMapRotation: 0.1,
    // bumpScale: 0.0005
});


wallMat.envMapRotation.y = 1.4
let basicMat = new THREE.MeshBasicMaterial({
    color: 0x0a1633, // dark navy color
})

export function addFloor(scene) {
    // const floorGeometry = new THREE.PlaneGeometry(17.5, 33);
    const floorMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.05,
        roughness: 0.2,
        name: 'floorMat',
        side: THREE.FrontSide,
        envMapIntensity: 2.5,
    });

    // --- LOCAL UNIFORMS FOR CUSTOMIZER ---


    floorMat.uniforms = {
        ...scene.globalUniformsHub.uniforms,
        uBorderColor: { value: new THREE.Color(0x00ffff) } // Local cyan override
    }

    if (resources.environmentMap) {
        floorMat.envMap = resources.environmentMap;
        floorMat.envMapIntensity = 2.5;
        resources.environmentMap.mapping = THREE.EquirectangularReflectionMapping;
    }

    // --- WATER SHADER INTEGRATION ---
    floorMat.onBeforeCompile = (shader) => {
        patchWaterFlow(shader, floorMat.uniforms);
        patchGrid(shader, floorMat.uniforms);
        patchWelcomeText(shader, floorMat.uniforms);
    };

    let folder = 'textures/ktx2/';
    function applyKtx2Texture(path, property, colorSpace = THREE.NoColorSpace) {
        ktx2Loader.load(`${folder}${path}`, function (map) {
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = 4; // High anisotropy for shallow floor angles
            map.repeat.set(0.5, 4);
            map.colorSpace = colorSpace;

            floorMat[property] = map;
            floorMat.needsUpdate = true;
            if (property === 'bumpMap') floorMat.bumpScale = 1.2;
        });
    }

    applyKtx2Texture('hardwood2_diffuse.ktx2', 'map', THREE.SRGBColorSpace);
    applyKtx2Texture('hardwood2_bump.ktx2', 'bumpMap');
    applyKtx2Texture('hardwood2_roughness.ktx2', 'roughnessMap');

    // console.log(floorMat)
    const floor = new THREE.Mesh(geo, floorMat);
    floor.rotation.x = -Math.PI / 2; // Rotate to make it horizontal
    floor.receiveShadow = true; // Enable shadow receiving
    floor.position.set(3, 0, -4); // Adjust position as needed
    floor.name = 'floor';
    floor.scale.set(20, 24.8, 1); // Scale the floor to desired size
    floor.visible = false; // Hide initially

    // scene.add(floor);
    return floor;
}

function addTweenData(item, scene) {
    let parent = item.initialParent || item.parent
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
        // Store the original scale
        scale: item.scale.clone(), // when binding rapier, scale might be changed and need to update
        parent: parent
    };
    // scene.tweenData = scene.tweenData || [];
    // scene.tweenData.push(itemData);
    scene.tweenData = scene.tweenData || {}
    scene.tweenData[item.uuid] = itemData;
}

export function adjustWalls(scene) {
    wallMat.envMap = scene.environment; // Set the environment map for the wall material
    // const walls = new THREE.Group();
    // scene.add(walls)

    //floor
    const floor = addFloor(scene);
    scene.add(floor);
    addTweenData(floor, scene)


    let leftWall = scene.getObjectByName('leftWall');
    let rightWall = scene.getObjectByName('rightWall');
    let backWall = scene.getObjectByName('backWall');
    let frontWall = scene.getObjectByName('frontWall');
    let rightWallCover = scene.getObjectByName('rightWall-cover');

    if (leftWall) leftWall.material = wallMat;
    else console.warn("Missing: leftWall");

    if (rightWall) rightWall.material = wallMat;
    else console.warn("Missing: rightWall");

    if (rightWallCover) rightWallCover.material = wallMat;
    else console.warn("Missing: rightWall-cover");

    if (backWall) backWall.material = backWallMat;
    else console.warn("Missing: backWall");

    if (frontWall) frontWall.material = wallMat;
    else console.warn("Missing: frontWall");

    // --- APPLY WATER EFFECT TO SPECIFIC OBJECTS ---
    const waterObjects = ['rightWall', 'leftWallFoot001'];
    waterObjects.forEach(name => {
        const obj = scene.getObjectByName(name);
        if (obj && obj.material) {
            // Clone to avoid affecting shared materials
            obj.material = obj.material.clone();
            obj.material.uniforms = scene.globalUniformsHub.uniforms;
            
            obj.material.onBeforeCompile = (shader) => {
                patchWaterFlow(shader, obj.material.uniforms);
            };
        }
    });
}
