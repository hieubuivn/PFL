import * as THREE from 'three';
import * as CONSTANTS from '../utils/constant.js';
import { constantUniform } from '../utils/addConstantUniform.js';
import { BasicGeometries } from '../../configs/setupGeometries.js';

export function addGrid(scene, fragmentShader = CONSTANTS.voronoiGridFS) {
    const gridShaderMat = new THREE.ShaderMaterial({
        vertexShader: CONSTANTS.vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        uniforms: {
            ...constantUniform
        },
        blending: THREE.NormalBlending,
        side: THREE.FrontSide,
        depthTest: false, // Ensure it draws over/under correctly without z-fighting if close
        depthWrite: false
    });

    let gridPlane = new THREE.Mesh(BasicGeometries.plane, gridShaderMat);
    gridPlane.name = "camGrid";

    // Attach to camera so it follows the view
    const camera = scene.camera;
    camera.add(gridPlane);

    // Position in front of camera
    // Distance needs to be within near/far planes. 
    // Calculating mid-point to be safe.
    const dist = (camera.near + camera.far) / 2;

    gridPlane.position.set(0, 0, -dist);
    gridPlane.visible = false; // Initially Inactive

    // Initial Scale to cover screen
    updateGridScale(gridPlane, camera, dist);

    // Resize Listener to keep it covering screen
    window.addEventListener('resize', () => {
        updateGridScale(gridPlane, camera, dist);
    });

    // --- PULSE INTERACTION ---
    // Removed local listener. Now handled globally via addRaycaster.js updating constantUniform.uDivSpaceMouseClick
    // gridShaderMat.uniforms.uDivMouseClick = ... (removed)
    // The shader now uses uDivSpaceMouseClick form constantUniform
}

function updateGridScale(mesh, camera, dist) {
    if (camera.isPerspectiveCamera) {
        const vFOV = THREE.MathUtils.degToRad(camera.fov);
        const height = 2 * Math.tan(vFOV / 2) * dist;
        const width = height * camera.aspect;
        mesh.scale.set(width, height, 1);

        // Ensure uniform matches current aspect
        if (mesh.material.uniforms && mesh.material.uniforms.uAspect) {
            mesh.material.uniforms.uAspect.value = camera.aspect;
        }
    } else {
        // Orthographic fallback (if ever used)
        // mesh.scale.set(window.innerWidth, window.innerHeight, 1);
    }
}
