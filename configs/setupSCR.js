import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';

export function setupSCR(options = {}) { //Scene Camera Renderer
    const domElement = options.domElement || undefined;
    const fogEnabled = options.fogEnabled || false;
    const alpha = options.alpha || false;
    const useBackdrop = options.useBackdrop || false;

    // --- 1. Determine Parent Element and Size ---
    let parentWidth, parentHeight;
    const parentElement = domElement || document.body;
    if (domElement) {
        const rect = domElement.getBoundingClientRect();
        parentWidth = rect.width;
        parentHeight = rect.height;
        if (getComputedStyle(parentElement).position === 'static') {
            parentElement.style.position = 'relative';
        }
    } else {
        parentWidth = window.innerWidth;
        parentHeight = window.innerHeight;
    }

    // --- 2. Calculate Container Size ---
    let containerWidth = parentWidth;
    let containerHeight = parentHeight;

    // --- 3. Create the Master Pivot Container ---
    const threeJsContainer = document.createElement('div');
    threeJsContainer.id = 'threeJsContainer'; // This is the pivot that handlers transforms

    threeJsContainer.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        right: 0;
        overflow: hidden;
        background: transparent;
    `;

    // --- 3.5 Create the Doppelganger (Backdrop Sibling) ---
    let backdropLayer = null;
    if (useBackdrop) {
        backdropLayer = document.createElement('div');
        backdropLayer.id = 'threeJsBackdrop';
        backdropLayer.className = 'three-js-backdrop'; // Uses high-perf CSS from layout.css
        threeJsContainer.appendChild(backdropLayer);
    }

    parentElement.appendChild(threeJsContainer);

    // --- 4. Setup Three.js Elements ---
    const camera = new THREE.PerspectiveCamera(50, containerWidth / containerHeight, 2, 800);
    camera.name = 'camera';

    const scene = new THREE.Scene();
    scene.name = 'scene';
    scene.width = containerWidth;
    scene.height = containerHeight;

    if (fogEnabled) {
        scene.fog = new THREE.Fog(0x000000, 2, 500);
    }

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
        stencil: false,
        alpha: alpha || useBackdrop // Transparency is mandatory for backdrop visibility
    });
    renderer.name = 'renderer';
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(containerWidth, containerHeight);

    // Append the canvas as a sibling to the backdrop
    threeJsContainer.appendChild(renderer.domElement);

    // --- 5. Resize Functionality update ---
    function onResize() {
        let parentW, parentH;
        if (domElement) {
            const rect = domElement.getBoundingClientRect();
            parentW = rect.width;
            parentH = rect.height;
        } else {
            parentW = window.innerWidth;
            parentH = window.innerHeight;
        }

        const w = parentW;
        const h = parentH;

        // Resize the pivot (both backdrop and canvas will follow as absolute children)
        threeJsContainer.style.width = w + 'px';
        threeJsContainer.style.height = h + 'px';

        if (w > 0 && h > 0) {
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            renderer.render(scene, camera);
        }
        scene.width = w;
        scene.height = h;
    }

    window.addEventListener('resize', onResize);

    // --- 6. Attach references and return ---
    scene.domElement = threeJsContainer;
    scene.backdropLayer = backdropLayer; // Return reference to the backdrop
    scene.renderer = renderer;
    scene.camera = camera;

    scene.add(camera);
    return [scene, camera, renderer];
}