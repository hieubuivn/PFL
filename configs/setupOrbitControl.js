import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { HUD_CONFIG } from '../projectScripts/resources/addHUDFrame.js';

// --- Configuration Constants (Can be moved to a shared config if needed) ---
const DECAY_FACTOR = 0.05;
const ROTATION_SPEED_AZIMUTHAL = 0.01;
const ROTATION_SPEED_POLAR = 0.008;
const MAX_AZIMUTHAL_ROTATION = 1;
const MAX_POLAR_ROTATION = 0.08;

/**
 * Creates legacy DOM overlays for edge navigation.
 */
function createUIOverlays(container) {
    const ARROW_FONT_SIZE = '16px';
    const DOT_SIZE = '6px';
    const DOT_GAP = '1.5px';
    const baseSize = parseInt(ARROW_FONT_SIZE, 10);
    const RADIUS_VAL = baseSize * 2.5;
    const BUTTON_RADIUS = `${RADIUS_VAL}px`;
    const BUTTON_DIAMETER = `${RADIUS_VAL * 2}px`;
    const wrapper = document.createElement('div');
    Object.assign(wrapper.style, {
        position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: '2000', overflow: 'hidden'
    });

    const marginPct = (HUD_CONFIG && HUD_CONFIG.MARGIN_PCT) ? HUD_CONFIG.MARGIN_PCT : 0.025;
    const EDGE_ZONE_WIDTH = `${marginPct * 100}vh`;

    const commonZoneStyle = { position: 'absolute', zIndex: '11', pointerEvents: 'auto', backgroundColor: 'transparent' };
    const commonButtonStyle = {
        position: 'absolute', zIndex: '12', pointerEvents: 'auto', backgroundColor: 'rgba(8, 12, 16, 0.9)',
        color: '#00F3FF', border: '1px solid rgba(0, 243, 255, 0.4)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', width: BUTTON_DIAMETER, height: BUTTON_DIAMETER,
        boxSizing: 'border-box', backdropFilter: 'blur(12px)', cursor: 'pointer', opacity: '0',
        transform: 'scale(0.8)', transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
        boxShadow: '0 0 25px rgba(0, 243, 255, 0.1)'
    };

    const getDotIndicator = (id) => {
        const dotStyle = `width: ${DOT_SIZE}; height: ${DOT_SIZE}; background: #00F3FF; transform: rotate(45deg); display: block; box-shadow: 0 0 10px rgba(0, 243, 255, 0.8); transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);`;
        const rowStyle = `display: flex; gap: ${DOT_GAP}; justify-content: center; align-items: center;`;
        const containerStyle = `display: flex; flex-direction: column; gap: ${DOT_GAP}; align-items: center; justify-content: center; width: max-content; overflow: visible;`;
        if (id === 'bottom') return `<div style="${containerStyle}"><div style="${rowStyle}"><div class="dot" style="${dotStyle}"></div><div class="dot" style="${dotStyle}"></div></div><div class="dot" style="${dotStyle}"></div></div>`;
        else if (id === 'top') return `<div style="${containerStyle}"><div class="dot" style="${dotStyle}"></div><div style="${rowStyle}"><div class="dot" style="${dotStyle}"></div><div class="dot" style="${dotStyle}"></div></div></div>`;
        else if (id === 'left') return `<div style="${containerStyle} flex-direction: row;"><div class="dot" style="${dotStyle}"></div><div style="${rowStyle} flex-direction: column;"><div class="dot" style="${dotStyle}"></div><div class="dot" style="${dotStyle}"></div></div></div>`;
        else if (id === 'right') return `<div style="${containerStyle} flex-direction: row;"><div style="${rowStyle} flex-direction: column;"><div class="dot" style="${dotStyle}"></div><div class="dot" style="${dotStyle}"></div></div><div class="dot" style="${dotStyle}"></div></div>`;
        return ``;
    };

    const createElements = (id, zoneStyle, btnStyle, clipPath) => {
        const zone = document.createElement('div');
        zone.id = `zone-${id}`;
        Object.assign(zone.style, commonZoneStyle, zoneStyle);
        const btn = document.createElement('div');
        btn.id = `btn-${id}`;
        btn.innerHTML = getDotIndicator(id);
        Object.assign(btn.style, commonButtonStyle, btnStyle);
        if (clipPath) btn.style.clipPath = clipPath;

        btn.addEventListener('mouseenter', () => {
            btn.style.backgroundColor = 'rgba(0, 243, 255, 0.15)'; btn.style.borderColor = 'rgba(0, 243, 255, 0.8)';
            btn.style.boxShadow = '0 0 40px rgba(0, 243, 255, 0.25)';
            btn.querySelectorAll('.dot').forEach(d => { d.style.background = '#fff'; d.style.boxShadow = '0 0 20px rgba(255, 255, 255, 1)'; });
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.backgroundColor = 'rgba(8, 12, 16, 0.9)'; btn.style.borderColor = 'rgba(0, 243, 255, 0.4)';
            btn.style.boxShadow = '0 0 25px rgba(0, 243, 255, 0.1)';
            btn.querySelectorAll('.dot').forEach(d => { d.style.background = '#00F3FF'; d.style.boxShadow = '0 0 10px rgba(0, 243, 255, 0.8)'; });
        });
        zone.appendChild(btn);
        wrapper.appendChild(zone);
        return { zone, btn };
    };

    const left = createElements('left', { top: '0', left: '0', width: EDGE_ZONE_WIDTH, height: '100%' }, { top: '50%', left: '0', marginTop: `-${BUTTON_RADIUS}`, width: BUTTON_RADIUS, height: BUTTON_DIAMETER, borderLeft: 'none' }, 'polygon(0 0, 100% 25%, 100% 75%, 0 100%)');
    const right = createElements('right', { top: '0', right: '0', width: EDGE_ZONE_WIDTH, height: '100%' }, { top: '50%', right: '0', marginTop: `-${BUTTON_RADIUS}`, width: BUTTON_RADIUS, height: BUTTON_DIAMETER, borderRight: 'none' }, 'polygon(0 25%, 100% 0, 100% 100%, 0 75%)');
    const top = createElements('top', { top: '0', left: '0', width: '100%', height: EDGE_ZONE_WIDTH }, { top: '0', left: '50%', marginLeft: `-${BUTTON_RADIUS}`, width: BUTTON_DIAMETER, height: BUTTON_RADIUS, borderTop: 'none' }, 'polygon(0 0, 100% 0, 75% 100%, 25% 100%)');
    const bottom = createElements('bottom', { bottom: '0', left: '0', width: '100%', height: EDGE_ZONE_WIDTH }, { bottom: '0', left: '50%', marginLeft: `-${BUTTON_RADIUS}`, width: BUTTON_DIAMETER, height: BUTTON_RADIUS, borderBottom: 'none' }, 'polygon(25% 0, 75% 0, 100% 100%, 0 100%)');

    container.appendChild(wrapper);
    return { left, right, top, bottom, wrapper };
}

/**
 * Main Controller Function
 * @param {THREE.Scene} scene 
 * @param {THREE.Camera} camera 
 * @param {THREE.WebGLRenderer} renderer 
 * @param {boolean} enableEdgeControl - Enables the specialized edge physics
 * @param {boolean} createDOM - Optionally creates/binds legacy HTML overlays
 */
export function setupOrbitControl(scene, camera, renderer, enableEdgeControl = true, createDOM = true) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;

    // Standard OrbitControls limits for general use
    controls.minDistance = 2;
    controls.maxDistance = 100;

    if (enableEdgeControl) {
        controls.enableRotate = false;
        controls.enablePan = false;
        controls.enableZoom = false;
    }

    scene.orbitControls = controls;

    // --- State & Variables ---
    controls.moveState = { left: false, right: false, up: false, down: false };

    let totalAzimuthalRotation = 0;
    let totalPolarRotation = 0;

    // --- DOM Initialization ---
    if (enableEdgeControl && createDOM) {
        // PERFORMANCE FIX: Attach to body instead of renderer parent to avoid overflow:visible
        const experienceContainer = renderer.domElement.parentNode;
        const ui = createUIOverlays(document.body);

        // Position the wrapper to match the experience-container bounds
        const syncWrapperPosition = () => {
            if (experienceContainer) {
                const rect = experienceContainer.getBoundingClientRect();
                ui.wrapper.style.left = `${rect.left}px`;
                ui.wrapper.style.top = `${rect.top}px`;
                ui.wrapper.style.width = `${rect.width}px`;
                ui.wrapper.style.height = `${rect.height}px`;
            }
        };

        // Initial sync
        syncWrapperPosition();

        // Sync on window resize
        window.addEventListener('resize', syncWrapperPosition);

        const allButtons = [ui.left.btn, ui.right.btn, ui.top.btn, ui.bottom.btn];
        const allZones = [ui.left.zone, ui.right.zone, ui.top.zone, ui.bottom.zone];

        // --- Layer 1: Awareness (Hovering the Margin/Zone reveals the dots) ---
        const showUI = () => allButtons.forEach(btn => { btn.style.opacity = '1'; btn.style.transform = 'scale(1)'; });
        const hideUI = () => allButtons.forEach(btn => { btn.style.opacity = '0'; btn.style.transform = 'scale(0.8)'; });

        allZones.forEach(zone => {
            zone.addEventListener('mouseenter', showUI);
            zone.addEventListener('mouseleave', hideUI);
        });

        // --- Layer 2: Action (Hovering the Dot itself triggers movement) ---
        const bindMovement = (btn, dir) => {
            btn.addEventListener('mouseenter', () => { controls.moveState[dir] = true; });
            btn.addEventListener('mouseleave', () => { controls.moveState[dir] = false; });
        };
        bindMovement(ui.left.btn, 'left');
        bindMovement(ui.right.btn, 'right');
        bindMovement(ui.top.btn, 'up');
        bindMovement(ui.bottom.btn, 'down');

        controls.domUI = ui;
        controls.syncWrapperPosition = syncWrapperPosition;
        controls.showEdgeUI = showUI;
        controls.hideEdgeUI = hideUI;
    }

    /**
     * Updates the camera based on moveState.
     * Call this inside the main animation loop.
     */
    controls.edgeControlUpdate = () => {
        if (!enableEdgeControl || controls.isStrategicHover) {
            controls.update();
            return;
        }

        let azimuthalDelta = 0;
        let polarDelta = 0;

        // Drive movement from the exposed state
        if (controls.moveState.left) azimuthalDelta = ROTATION_SPEED_AZIMUTHAL;
        if (controls.moveState.right) azimuthalDelta = -ROTATION_SPEED_AZIMUTHAL;
        if (controls.moveState.up) polarDelta = -ROTATION_SPEED_POLAR;
        if (controls.moveState.down) polarDelta = ROTATION_SPEED_POLAR;

        // --- Physics Implementation (Decay & Limits) ---
        if (azimuthalDelta !== 0) {
            const futureTotal = totalAzimuthalRotation + azimuthalDelta;
            if (Math.abs(futureTotal) > MAX_AZIMUTHAL_ROTATION) azimuthalDelta = Math.sign(futureTotal) * MAX_AZIMUTHAL_ROTATION - totalAzimuthalRotation;
            totalAzimuthalRotation += azimuthalDelta;
        } else {
            if (Math.abs(totalAzimuthalRotation) > 0.001) {
                const decay = totalAzimuthalRotation * DECAY_FACTOR;
                azimuthalDelta = -decay;
                totalAzimuthalRotation += azimuthalDelta;
            } else totalAzimuthalRotation = 0;
        }

        if (polarDelta !== 0) {
            const futureTotal = totalPolarRotation + polarDelta;
            if (Math.abs(futureTotal) > MAX_POLAR_ROTATION) polarDelta = Math.sign(futureTotal) * MAX_POLAR_ROTATION - totalPolarRotation;
            totalPolarRotation += polarDelta;
        } else {
            if (Math.abs(totalPolarRotation) > 0.001) {
                const decay = totalPolarRotation * DECAY_FACTOR;
                polarDelta = -decay;
                totalPolarRotation += polarDelta;
            } else totalPolarRotation = 0;
        }

        // --- Execute Matrix Rotation (with Jitter Guard) ---
        const shakeOffset = camera._shakeOffset || new THREE.Vector3(0, 0, 0);
        camera.position.sub(shakeOffset); // 🛡️ Strip jitter for stable path math

        if (azimuthalDelta !== 0) {
            const rotationMatrix = new THREE.Matrix4().makeRotationY(azimuthalDelta);
            camera.position.sub(controls.target).applyMatrix4(rotationMatrix).add(controls.target);
        }

        if (polarDelta !== 0) {
            const currentPosRel = new THREE.Vector3().subVectors(camera.position, controls.target);
            const rotationAxis = new THREE.Vector3().crossVectors(camera.up, currentPosRel).normalize();
            const rotationMatrix = new THREE.Matrix4().makeRotationAxis(rotationAxis, polarDelta);
            camera.position.sub(controls.target).applyMatrix4(rotationMatrix).add(controls.target);
        }

        camera.position.add(shakeOffset); // 🛡️ Restore jitter for rendering

        controls.update();
    };

    const originalDispose = controls.dispose;
    controls.dispose = () => {
        if (controls.domUI && controls.domUI.wrapper) controls.domUI.wrapper.remove();
        if (controls.syncWrapperPosition) {
            window.removeEventListener('resize', controls.syncWrapperPosition);
        }
        originalDispose.call(controls);
    };

    controls.update();
    return controls;
}