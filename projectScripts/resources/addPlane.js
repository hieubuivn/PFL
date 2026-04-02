import * as THREE from 'three';
import { constantUniform } from '../utils/addConstantUniform.js';
import * as CONSTANTS from '../utils/constant.js';

export function addTestPlane(scene, fragmentShader) {
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
        uniforms: constantUniform,
        vertexShader: CONSTANTS.vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: true,
        depthTest: true // Ensure it's not occluded by 3D objects
    });

    const redMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const plane = new THREE.Mesh(geometry, material);
    // plane.position, rotation, scale are now irrelevant due to vertex shader override
    plane.position.set(0, 5, 0);
    plane.scale.set(5, 5, 1);
    plane.rotation.set(0, Math.PI / 2, 0);

    plane.name = 'testPlane';
    scene.add(plane);
    scene.testPlane = plane;
    return plane
}


