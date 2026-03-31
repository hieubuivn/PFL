import * as THREE from 'three';
import { gltfLoader, rgbeLoader, textureLoader, dracoLoader, handleProgress, registerFile, updateTaskProgress, completeTask } from '../../configs/setupLoaders.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass-transparentBg.js';
import TWEEN from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/tween.module.min.js';
import { createUI as createUIFromModule } from './ui.js';
import { vertexShader, fragmentShader, constellationVertexShader, constellationFragmentShader } from './shaders.js';
import { getBackInOut, BACK_IN_OUT_DEFAULT, BACK_OUT_DEFAULT } from '../utils/customTween.js';

import { linkConstantUniforms } from '../utils/addConstantUniform.js'
import { resources } from '../resources/loadResources.js';
import { Tooltip } from './tooltip.js';
import { initScrollMorph } from '../interactions/scroll-pointsMorphScenario.js';
import { EVENTS } from '../configs/events.js';
import { SCENE_OBJECTS, GLOBAL_COLORS, PERSONA_IDS, DEFAULT_PERSONA } from '../configs/sceneConfig.js';
import { MAX_PULSES } from '../utils/constant.js';
import { PerformanceLogger } from '../utils/performanceLogger.js';
import { BOARD_LAYOUT_CONFIG, fitBoardTexts } from '../content-manager/textBoard.js';

// import { addTestPlane } from '../resources/addPlane.js';
// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

export const MORPH_DURATION = 1500; // Restore to production speed

// Scatter Ranges: How far points are spread out
const scatterRangeModel = 120 * 1.2;
const scatterRangeGrid = 500 * 1.2;  // Slightly denser than 1500, but optimized (was 750 originally)

// Point Properties (Now in World Units)
const GRID_SIZE = 1.53;         // Base size for background grid points in world units
const POINT_COUNT = 18000;    // Total number of particles in the system


const MODEL_SIZE_THRESHOLD = 0.05;

// Camera
const CAMERA_FOV = 45;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 300;
const CAMERA_POSITION = { x: 61.56, y: 2.97, z: 30 };

// Scene
const SCENE_BACKGROUND = '#000000'; // (Used if we set a clear color, but we use transparent)

// Renderer
const RENDERER_DPR_MAX = 2;

// Postprocessing (Bloom)
const BLOOM_STRENGTH = 2;
const BLOOM_RADIUS = 0.4;
const BLOOM_THRESHOLD = 0.8;



// GRID
const gridZ = -40.0;
const gridSpacing = 2.5;
const GAP_SIZE = 1;

// Pulse Config
const MAX_PULSE = MAX_PULSES;

// UI controls
const UI_WIDTH = '200px';
const UI_TOP = '20px';
const UI_RIGHT = '20px';


// Mouse interaction settings
const mouseDamping = { value: 0.15 };
const pointReturnSpeed = { value: 0.08 };

//model
const MODEL_INFO = [
    {
        "name": "man",
        "baseColor": new THREE.Vector3(1, 1, 1),
        "brightness": 1.0,
        "pointSizeMultiplier": 1.0
        // "lensflare": true
    },
    {
        "name": "heart",
        "baseColor": new THREE.Vector3(0.984, 0.757, 0.537),
        "brightness": 8.65,
        "pointSizeMultiplier": 0.15
    },
    {
        "name": "heartDev",
        "baseColor": new THREE.Vector3(0.2, 0.8, 0.8),
        "brightness": 8.75,
        "pointSizeMultiplier": 1.0
    },
]

const bigDipper = [
    { name: "Alkaid", category: "VALIDATION", meaning: "Technical De-risking", usp_subtitle: "TECH VALIDATION • WEBGL", usp: "I personally de-risk technical roadmaps by validating architectural feasibility and requirement scalability through code-driven functional prototyping in WebGL.", row: 61, col: 31, brightnessFactor: 5.0, textureSlotRow: 3, textureSlotCol: 6 }, // 0 (WebGL)
    { name: "Mizar", category: "EXECUTION", meaning: "Automation", usp_subtitle: "WORKFLOW AUTOMATION • N8N", usp: "I personally deploy automated AI and n8n production pipelines that reduce manual project overhead by an estimated 40%.", row: 60, col: 35, brightnessFactor: 1.0, textureSlotRow: 1, textureSlotCol: 4 }, // 1 (n8n)
    { name: "Alioth", category: "EXECUTION", meaning: "Workflow Velocity", usp_subtitle: "VELOCITY • JIRA", usp: "I lead high-velocity product execution through structured Jira management and data-driven SQL audits to ensure on-time delivery.", row: 56, col: 35, brightnessFactor: 3.5, textureSlotRow: 1, textureSlotCol: 2, useDipperColor: true }, // 2 (Jira)
    { name: "Megrez", category: "LOGIC", meaning: "Data-driven ROI", usp_subtitle: "DATA ANALYSIS • RICE", usp: "I navigate competing stakeholder demands using the RICE and MoSCoW frameworks to deliver maximum ROI within tight technical constraints.", row: 55, col: 32, brightnessFactor: 0.8, textureSlotRow: 1, textureSlotCol: 6 }, // 3 (Stats/Chart)
    { name: "Phecda", category: "LOGIC", meaning: "Agile Standards", usp_subtitle: "ADAPTIVE LOGIC • GHERKIN", usp: "I establish a Single Source of Truth for complex requirements via Gherkin Acceptance Criteria, aligning 10,000+ stakeholders.", row: 52, col: 30, brightnessFactor: 1.0, textureSlotRow: 2, textureSlotCol: 4 }, // 4 (Agile Loop)
    { name: "Merak", category: "PI-SHAPED", meaning: "UI/UX Strategy", usp_subtitle: "UX ARCHITECTURE • TECH", usp: "I bridge deep engineering with human-centric design, ensuring your complex architectural vision is never compromised by UX constraints.", row: 49, col: 28, brightnessFactor: 1.0, textureSlotRow: 2, textureSlotCol: 3 }, // 5 (Ui Icon)
    { name: "Dubhe", category: "PI-SHAPED", meaning: "Design Synergy", usp_subtitle: "TECH SYNERGY • FIGMA", usp: "I integrate high-fidelity Figma designs with functional prototyping to ensure every requirement is architecturally sound.", row: 45, col: 29, brightnessFactor: 1.5, textureSlotRow: 0, textureSlotCol: 3 }, // 6 (Figma)

    // Sirius - The Connective Tissue (Isolated Anchor)
    { name: "CONNECT", category: "STRATEGIC SYNERGY", meaning: "Technical Partnership", usp_subtitle: "BUSINESS • TECH • USER", usp: "I serve as the connective tissue of your product lifecycle. By unifying abstract business goals, technical feasibility, and user-centric design into a single roadmap, I ensure your vision survives the journey from pitch to production.", row: 71, col: 68, brightnessFactor: 5.0, textureSlotRow: 3, textureSlotCol: 2, useDipperColor: true }, // 7 (Star-Burst)
];





// --- Big Dipper Deep Projection (Chaos State) ---
// We project the stars along their lines of sight to varying depths.
// This maintains the perfect shape from the camera position while adding 3D depth.
const cam = new THREE.Vector3(61.56, 2.97, 30); // Match CAMERA_POSITION
const flatDipper = [
    new THREE.Vector3(-20, 20.0, -14.0),   // 0: Alkaid
    new THREE.Vector3(-20, 25.8, -22.0),   // 1: Mizar
    new THREE.Vector3(-20, 27.0, -31.5),  // 2: Alioth (Highlight)
    new THREE.Vector3(-20, 28.0, -45.0),  // 3: Megrez (Pivot)
    new THREE.Vector3(-20, 24.4, -48.4),  // 4: Phecda
    new THREE.Vector3(-20, 27.5, -57.2),  // 5: Merak
    new THREE.Vector3(-20, 33.3, -57.0),  // 6: Dubhe
    new THREE.Vector3(-25, -27, 38)       // 7: Sirius
];

// Artistic depths (distance from camera) to create a vast sense of scale
const targetDepths = [140, 115, 175, 130, 165, 190, 145, 105];

const chaosDipperConfig = flatDipper.map((pos, i) => {
    const dir = new THREE.Vector3().subVectors(pos, cam).normalize();
    return { pos: new THREE.Vector3().addVectors(cam, dir.multiplyScalar(targetDepths[i])) };
});

export default class Points {
    get isMorphing() {
        return this.material?.uniforms?.uProgress?.value > 0.01 || !!this.morphTween;
    }

    get targetIndex() {
        return (this.points?.geometry?.morphTargetIndex !== undefined) ? this.points.geometry.morphTargetIndex : (this.morphRequestedTarget || 0);
    }

    constructor(scene, camera, renderer, raycaster, options = {}) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.options = Object.assign({ enableLoadingUI: true }, options);
        scene.points = this;
        this.bigDipper = bigDipper; // Expose for external access

        // 1. Initial Strict Scroll Lock
        document.documentElement.style.setProperty('overflow', 'hidden', 'important');
        document.body.style.setProperty('overflow', 'hidden', 'important');
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);

        this.isBloomEnabled = true;
        this.points = null;
        this.userData = {};
        this._currentPersona = DEFAULT_PERSONA; // Default matching personaManager
        this.material = null;
        this.dipperLines = null;
        this.raycaster = (raycaster && raycaster.raycaster) ? raycaster.raycaster : (raycaster || new THREE.Raycaster());
        this.intersectionPlane = null;

        this.mouse = new THREE.Vector2(0, 0);
        this.targetMouse = new THREE.Vector2(0, 0);
        this.smoothMouse = new THREE.Vector2(0, 0);
        this.smoothRepulsionMouse = new THREE.Vector2(0, 0);
        this.rawMouse = new THREE.Vector2(0, 0);
        this.isFirstMouseMove = true;

        this.clock = new THREE.Clock(false); // Do not auto-start! We wait for playIntro
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseClick = this.onMouseClick.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);

        this.pointCap = POINT_COUNT;
        this.morphs = [];

        const camPos = new THREE.Vector3(CAMERA_POSITION.x, CAMERA_POSITION.y, CAMERA_POSITION.z);
        const target = new THREE.Vector3(0, 0, 0);
        const forward = new THREE.Vector3().subVectors(target, camPos).normalize();

        this.shaderUniforms = {
            iTime: { value: 0.0 },
            uResolution: { value: new THREE.Vector2(this.renderer.domElement.clientWidth, this.renderer.domElement.clientHeight) },
            uPixelRatio: { value: 2.0 },
            uMousePos: { value: new THREE.Vector3(0, 0, 0) },
            uMouseNDC: { value: new THREE.Vector2(0, 0) },
            uProgress: { value: 0.0 },
            uMorphStagger: { value: 0.1 },
            uIsChaos: { value: 1.0 }, // Enable by default for initial state (Chaos)
            uSize: { value: 0.015 },
            uColor: { value: new THREE.Color('#ffffff') },
            uStarTexture: { value: resources.spriteSheet },
            uSizeThreshold: { value: 0.05 },
            uCols: { value: 8.0 },
            uRows: { value: 4.0 },
            uSpritePixels: { value: new THREE.Vector2(512, 256) }, // Match spriteSheetIcon dimensions
            uLightDir: { value: new THREE.Vector3(-100, -100.0, 100.7) },
            uLightStrength: { value: 1.0 },
            uLightSizeBoost: { value: 1.5 },
            uModelScale: { value: 1 },
            uModelPosition: { value: new THREE.Vector3(0, 0, 0) },
            uModelRotation: { value: new THREE.Vector3(0, 0, 0) },
            uEnableMouseRotation: { value: true },
            uAttractionForce: { value: 0.0 },
            uIsArmatureState: { value: 0.0 },
            uAttractionRefSize: { value: 0.5 }, // We can keep this for suction logic but worldSize is much smaller now
            uModelScreenOffset: { value: new THREE.Vector2(0., 0) },
            uModelPointSizeFactor: { value: 1.0 },
            uHoverPointScaleFactor: { value: 2.5 },
            uVibrateAmp: { value: 0.8 }, // Boosted for world-space visibility
            uModelVibFactor: { value: 1.0 },
            uVibrateBoostSizeThreshold: { value: 1.0 },
            uBaseRotateSpeed: { value: 1. },
            uHoverRadius: { value: 200.0 },
            uAttractionRadius: { value: 200.0 },
            uHoveredTextureIndex: { value: 0.0 },
            uHoveredIndex: { value: -1.0 },
            uGlobalHoverStrength: { value: 0.0 },
            uGridZ: { value: gridZ },
            uBaseGridZ: { value: gridZ },
            uGridForward: { value: forward },
            uBigDipper: { value: bigDipper.map(d => new THREE.Vector4(d.row, d.col, d.brightnessFactor || 1.0, (d.textureSlotRow || 0) * 8 + (d.textureSlotCol || 0))) },
            uGridSide: { value: 0.0 },
            uModelPointCount: { value: 0.0 },
            uFOV: { value: this.camera.fov }, // Add uFOV uniform
            uProjectionMultiplier: { value: 1.0 }, // Pre-calculated for performance
            uDipperColor: { value: new THREE.Vector3(0.0, 1.0, 1.0) }, // Radiant Cyan
            uPulseCenters: { value: Array(MAX_PULSE).fill().map(() => new THREE.Vector3(0, 0, 0)) },
            uPulseStartTimes: { value: Array(MAX_PULSE).fill(-100.0) },
            uPulseDuration: { value: 2.5 },
            uPulseDisplacementFactors: { value: Array(MAX_PULSE).fill(0.0) }, // 1.0 = color wave only, 0.0 = full pulse
            uPulseSpeed: { value: 60.0 },
            uPulseWidth: { value: 7.0 },
            uActivePulseCount: { value: 0 },
            uPulseactive: { value: 0.0 },
            uMaskRect: { value: new THREE.Vector4(0, 0, 0, 0) },
            uMaskRectNav: { value: new THREE.Vector4(0, 0, 0, 0) },
            uMaskSlant: { value: new THREE.Vector2(0, 0) },
            uDipperBrightnessScalar: { value: 1.0 },
            uModelMat3: { value: new THREE.Matrix3() },
            uMouseScreen: { value: new THREE.Vector2(0, 0) },
            uTitleMaskRectBase: { value: new THREE.Vector4(0, 0, 0, 0) }, // Precalc: X, Y, W, H
            uTitleMaskScale: { value: 0.0 }, // 0 in Chaos, 1 in Root. Controlled via script.
            uTitleMaskEdgeJitter: { value: 0.02 }, // Controls mask rim jitter
            uKnowhereScreen: { value: new THREE.Vector2(0, 0) },
            uKnowhereGravity: { value: 50.0 },
            uKnowhereGravityMultiplier: { value: -1.0 }, // Flip mechanism
            uKnowhereGravityHoverFactor: { value: 50.0 }, // Intensity factor
            uKnowhereRadius: { value: 200.0 },
            uKnowhereScale: { value: 1.0 },
            uIsGardenHovering: { value: 0.0 },
            uKnowhereVibrateBoost: { value: 0.0 },
            uRippleColor: { value: new THREE.Vector3(0.0, 1.0, 1.0) }, // Default color
            uDistStaggerFactor: { value: 0.0 },
            uDistStaggerMax: { value: 120.0 },
            uBonePos: { value: new THREE.Vector2(0, 0) },
            uBoneRadius: { value: 0.15 },
            uBoneIntensity: { value: 0.0 },
            uStickRect: { value: new THREE.Vector4(0, 0, 0, 0) },
            uStickStrength: { value: 0.0 }
        };
        console.log("[Points] shaderUniforms initialized with uTitleMaskRectBase, uTitleMaskScale, uTitleMaskEdgeJitter, uKnowhereGravityMultiplier and uIsGardenHovering");
        this.bigDipper = bigDipper;

        this.currentPulseIndex = 0;
        this.userData.chaosUniforms = THREE.UniformsUtils.clone(this.shaderUniforms);
        this.userData.chaosUniforms.uIsChaos.value = 1.0;
        this.forceDisableAttraction = false;
        this.tooltip = new Tooltip();
        this.tooltip.tooltip.addEventListener('mouseleave', (e) => {
            if (e.relatedTarget !== this.renderer.domElement) {
                this.onMouseLeave(e);
            }
        });
        this.enableScrollMorph = true;
        this.isReady = false;

        // --- OPTIMIZATION CACHE ---
        this._modelPointCount = 0;
        this._gridSide = 1;
        this._tooltipFrameCount = 0;
    }

    /**
     * Pre-calculates model vs grid point ratios to avoid expensive per-frame loops.
     */
    _updateCachedCounts() {
        if (!this.points || !this.points.geometry) return;
        const count = this.pointCap;
        const geo = this.points.geometry;
        const isGridAttr = geo.attributes.aTargetSizeIsGrid;

        if (isGridAttr) {
            let mCount = 0;
            // Scan for the transition point (Model points are contiguous at start)
            for (let i = 0; i < count; i++) {
                if (isGridAttr.array[i * 2 + 1] < 0.5) mCount++;
                else break;
            }
            this._modelPointCount = mCount;
            const gridPointCount = count - mCount;
            this._gridSide = Math.ceil(Math.sqrt(gridPointCount)) || 1;
        }

        // Sync to shader uniforms only when they change
        if (this.material && this.material.uniforms) {
            this.material.uniforms.uModelPointCount.value = this._modelPointCount;
            this.material.uniforms.uGridSide.value = this._gridSide;
        }
    }

    async yieldToBrowser() {
        return new Promise(resolve => requestAnimationFrame(resolve));
    }

    async init() {
        PerformanceLogger.start('Points: Services Init');
        this.initPostprocessing();

        this.intersectionPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(5000, 5000),
            new THREE.MeshBasicMaterial({ visible: true, opacity: 0.0, transparent: true, depthWrite: false })
        );
        this.intersectionPlane.position.z = gridZ;
        this.scene.add(this.intersectionPlane);

        if (this.points && this.points.geometry) {
            this.points.geometry.morphCurrentIndex = 0;
        }
        this._initDipperLines();

        this.renderer.domElement.addEventListener('mousemove', this.onMouseMove, false);
        this.renderer.domElement.addEventListener('mouseleave', this.onMouseLeave, false);
        this.renderer.domElement.addEventListener('click', this.onMouseClick, false);
        window.addEventListener('resize', this.onWindowResize, false);

        if (this.renderer.domElement) {
            this.resizeObserver = new ResizeObserver(() => this.onWindowResize());
            this.resizeObserver.observe(this.renderer.domElement);
        }

        this.createLandingOverlay();
        PerformanceLogger.end('Points: Services Init');

        PerformanceLogger.start('Points: Background Particles');
        await this.createBackgroundParticles();
        this.onWindowResize();
        this._updateCachedCounts();

        PerformanceLogger.start('Points: Model Loading');
        await this.loadModel();
        PerformanceLogger.end('Points: Model Loading');

        this.createControlUI();

        // --- Build Dipper Point Index Lookup (for Chaos-state hover detection) ---
        // With Option A remapping, dipper stars occupy reserved tail slots: _dipperBaseIndex + starIndex.
        this._dipperPointIndices = new Set();
        bigDipper.forEach((star, si) => {
            this._dipperPointIndices.add(this._dipperBaseIndex + si);
        });

        // --- Event Listeners for Garden Interaction ---
        window.addEventListener(EVENTS.GARDEN.HOVER_START, () => {
            if (this.dipperLines) {
                if (this.dipperLines.tween) this.dipperLines.tween.stop();

                // Separate Tween: Opacity comes in quickly, Tracing happens slowly
                this.dipperLines.tween = new TWEEN.Tween(this.dipperLines.userData)
                    .to({ opacity: 1.0, drawProgress: 1.0 }, 1750) // Doubled speed (3500 / 2)
                    .easing(TWEEN.Easing.Cubic.InOut)
                    .start();
            }
        });

        window.addEventListener(EVENTS.GARDEN.HOVER_END, () => {
            if (this.dipperLines) {
                if (this.dipperLines.tween) this.dipperLines.tween.stop();

                this.dipperLines.tween = new TWEEN.Tween(this.dipperLines.userData)
                    .to({ opacity: 0.0, drawProgress: 0.0 }, 800)
                    .easing(TWEEN.Easing.Cubic.Out)
                    .start();
            }
        });

        this.isReady = true;

        // Initialize Ripple Color based on default persona
        const devInfo = MODEL_INFO.find(m => m.name === 'heartDev');
        const pobaInfo = MODEL_INFO.find(m => m.name === 'heart');
        const initialRippleColor = (this._currentPersona === PERSONA_IDS.DEV) ? devInfo.baseColor : pobaInfo.baseColor;
        this.shaderUniforms.uRippleColor.value.copy(initialRippleColor);
        if (this.material && this.material.uniforms.uRippleColor) {
            this.material.uniforms.uRippleColor.value.copy(initialRippleColor);
        }

        // --- SHADER WARMUP (Proactive Compilation) ---
        // Render once during the loading phase to trigger GPU shader linking.
        // This prevents the 1.8s "Frame Spike" when the intro starts.
        this.warmup();
    }

    /**
     * Ghost Render: Forces the browser to compile all shaders used by the Points system
     * and the Post-processing pipeline.
     */
    warmup() {
        if (!this.composer || !this.points) return;

        const wasVisible = this.points.visible;
        this.points.visible = true;

        // Render a single frame to the internal buffers
        // We use a tiny delta to avoid side effects
        this.material.uniforms.iTime.value = 0.001;
        this.composer.render(0.016);

        this.points.visible = wasVisible;
    }

    activateScrollInteractions() {
        // --- Interaction Initialization ---
        initScrollMorph(this.scene, this, TWEEN);
    }

    // Animation reset
    playIntro() {
        if (this.points) this.points.visible = true; // Ensure visible
        this.clock.start(); // Resets elapsedTime to 0, triggering the shader 'appear' animation
        this.clock.elapsedTime = 0; // Explicitly ensure 0
    }

    initPostprocessing() {
        this.composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);

        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(this.renderer.domElement.clientWidth, this.renderer.domElement.clientHeight),
            BLOOM_STRENGTH,
            BLOOM_RADIUS,
            BLOOM_THRESHOLD
        );

        // Fix Color Banding by increasing precision
        this.bloomPass.renderTargetsHorizontal.forEach(element => {
            element.texture.type = THREE.HalfFloatType;
        });
        this.bloomPass.renderTargetsVertical.forEach(element => {
            element.texture.type = THREE.HalfFloatType;
        });

        this.composer.addPass(renderPass);
        this.composer.addPass(this.bloomPass);
    }

    createLandingOverlay() {
        // Create container for Loading/Enter UI
        this.overlayContainer = document.createElement('div');
        //add ID to this overlay for debugging
        this.overlayContainer.id = 'overlay-container';
        Object.assign(this.overlayContainer.style, {
            position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none', zIndex: '9999'
        });
        document.body.appendChild(this.overlayContainer);

        // Progress Text
        if (this.options.enableLoadingUI) {
            this.progressText = document.createElement('div');
            this.progressText.innerText = '0%';
            Object.assign(this.progressText.style, {
                color: 'white', fontSize: '24px', fontFamily: "'Orbitron', sans-serif", marginBottom: '20px'
            });
            this.overlayContainer.appendChild(this.progressText);
        }

        // Progress Bar
        if (this.options.enableLoadingUI) {
            this.progressBarContainer = document.createElement('div');
            Object.assign(this.progressBarContainer.style, {
                width: '300px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', overflow: 'hidden'
            });
            this.progressBar = document.createElement('div');
            Object.assign(this.progressBar.style, {
                width: '0%', height: '100%', background: 'white', transition: 'width 0.1s linear'
            });
            this.progressBarContainer.appendChild(this.progressBar);
            this.overlayContainer.appendChild(this.progressBarContainer);
        }

        // Create wrapper for bottom controls
        this.controlsWrapper = document.createElement('div');
        this.controlsWrapper.style.position = 'absolute';
        this.controlsWrapper.style.bottom = '30px';
        this.controlsWrapper.style.left = '50%';
        this.controlsWrapper.style.transform = 'translateX(-50%)';
        this.controlsWrapper.style.display = 'none'; // this.options.enableLoadingUI ? 'none' : 'flex'; // Hidden until loaded if UI enabled
        this.controlsWrapper.style.flexDirection = 'column';
        this.controlsWrapper.style.alignItems = 'center';
        this.controlsWrapper.style.gap = '15px';
        this.controlsWrapper.style.zIndex = '1000';
        this.controlsWrapper.style.background = 'rgba(0, 0, 0, 0.5)';
        this.controlsWrapper.style.padding = '10px 20px';
        this.controlsWrapper.style.borderRadius = '12px';
        this.controlsWrapper.style.backdropFilter = 'blur(5px)';
        this.controlsWrapper.style.pointerEvents = 'auto'; // Enable clicks
        this.overlayContainer.appendChild(this.controlsWrapper);

        // Create row container for buttons
        this.buttonRow = document.createElement('div');
        this.buttonRow.style.display = 'flex';
        this.buttonRow.style.alignItems = 'center';
        this.buttonRow.style.gap = '10px';
        this.controlsWrapper.appendChild(this.buttonRow);

        // Input for Morph Index
        this.morphInput = document.createElement('input');
        this.morphInput.type = 'number';
        this.morphInput.value = '0'; // Default to 0
        this.morphInput.style.padding = '10px';
        this.morphInput.style.fontSize = '16px';
        this.morphInput.style.borderRadius = '8px';
        this.morphInput.style.border = '1px solid #444';
        this.morphInput.style.background = '#222';
        this.morphInput.style.color = '#fff';
        // Back Button
        this.backBtn = document.createElement('button');
        this.backBtn.innerText = 'Back';
        this.backBtn.style.padding = '12px 20px';
        this.backBtn.style.fontSize = '18px';
        this.backBtn.style.border = 'none';
        this.backBtn.style.borderRadius = '30px';
        this.backBtn.style.background = '#444';
        this.backBtn.style.color = '#fff';
        this.backBtn.style.cursor = 'pointer';
        this.backBtn.style.fontFamily = "'Orbitron', sans-serif";
        this.backBtn.style.textTransform = 'uppercase';
        this.backBtn.style.marginRight = '10px';

        this.triggerPrevMorph = () => {
            let geometry = this.points.geometry;
            let total = geometry.morphData ? geometry.morphData.length : 0;
            if (total === 0) return;

            let current = geometry.morphCurrentIndex || 0;
            let prev = (current - 1 + total) % total;

            this.morphInput.value = prev;
            this.morphToTarget(prev);

            // Show Main Control UI
            if (!this.controlsCreated) {
                this.createControlUI();
                this.controlsCreated = true;
            }
        };

        this.backBtn.onclick = this.triggerPrevMorph;
        this.buttonRow.appendChild(this.backBtn);

        this.morphInput.style.width = '60px';
        this.morphInput.style.textAlign = 'center';
        this.buttonRow.appendChild(this.morphInput);

        // Morph Button
        this.enterBtn = document.createElement('button');
        this.enterBtn.innerText = 'Morph';
        this.enterBtn.style.padding = '12px 30px'; // Slightly fat button
        this.enterBtn.style.fontSize = '18px';
        this.enterBtn.style.border = 'none';
        this.enterBtn.style.borderRadius = '30px';
        this.enterBtn.style.background = 'linear-gradient(90deg, #ff0077, #7700ff)'; // Energetic gradient
        this.enterBtn.style.color = '#fff';
        this.enterBtn.style.cursor = 'pointer';
        this.enterBtn.style.fontFamily = "'Orbitron', sans-serif";
        this.enterBtn.style.textTransform = 'uppercase';
        this.enterBtn.style.letterSpacing = '2px';
        this.enterBtn.style.boxShadow = '0 0 15px rgba(255, 0, 119, 0.5)';
        this.enterBtn.style.transition = 'all 0.3s ease';
        this.enterBtn.style.display = this.options.enableLoadingUI ? 'none' : 'block'; // Initially hidden until loaded if UI enabled

        // Hover Effect
        this.enterBtn.onmouseenter = () => {
            this.enterBtn.style.transform = 'scale(1.05)';
            this.enterBtn.style.boxShadow = '0 0 25px rgba(119, 0, 255, 0.7)';
        };
        this.enterBtn.onmouseleave = () => {
            this.enterBtn.style.transform = 'scale(1.0)';
            this.enterBtn.style.boxShadow = '0 0 15px rgba(255, 0, 119, 0.5)';
        };

        this.buttonRow.appendChild(this.enterBtn);

        // Next Button
        this.nextBtn = document.createElement('button');
        this.nextBtn.innerText = 'Next';
        this.nextBtn.style.padding = '12px 20px';
        this.nextBtn.style.fontSize = '18px';
        this.nextBtn.style.border = 'none';
        this.nextBtn.style.borderRadius = '30px';
        this.nextBtn.style.background = '#444';
        this.nextBtn.style.color = '#fff';
        this.nextBtn.style.cursor = 'pointer';
        this.nextBtn.style.fontFamily = "'Orbitron', sans-serif";
        this.nextBtn.style.textTransform = 'uppercase';
        this.nextBtn.style.marginLeft = '10px';

        this.triggerNextMorph = () => {
            // Cycle logic
            let geometry = this.points.geometry;
            let total = geometry.morphData ? geometry.morphData.length : 0;
            if (total === 0) return;

            let current = geometry.morphCurrentIndex || 0;
            let next = (current + 1) % total;

            this.morphInput.value = next; // Update input
            this.morphToTarget(next);

            // Show Main Control UI
            if (!this.controlsCreated) {
                this.createControlUI();
                this.controlsCreated = true;
            }
        };

        this.nextBtn.onclick = this.triggerNextMorph;
        this.buttonRow.appendChild(this.nextBtn);

        // Create slider row for uProgress
        this.sliderRow = document.createElement('div');
        this.sliderRow.style.display = 'flex';
        this.sliderRow.style.alignItems = 'center';
        this.sliderRow.style.gap = '10px';
        this.sliderRow.style.width = '100%';
        this.sliderRow.style.justifyContent = 'center';
        this.controlsWrapper.appendChild(this.sliderRow);

        // Progress Slider
        this.progressSlider = document.createElement('input');
        this.progressSlider.type = 'range';
        this.progressSlider.min = '0';
        this.progressSlider.max = '1';
        this.progressSlider.step = '0.01';
        this.progressSlider.value = '0';
        this.progressSlider.style.width = '300px';
        this.progressSlider.style.cursor = 'pointer';

        // Update uProgress when slider changes
        this.progressSlider.oninput = (e) => {
            const value = parseFloat(e.target.value);
            if (this.points.material && this.points.material.uniforms.uProgress) {
                this.points.material.uniforms.uProgress.value = value;
            }
        };

        this.sliderRow.appendChild(this.progressSlider);

        // Keyboard Listener
        // window.addEventListener('keydown', (e) => {
        //     if (e.key === 'n' || e.key === 'N') {
        //         this.triggerNextMorph();
        //     }
        // });

        this.enterBtn.addEventListener('click', () => {
            // Get index from input
            const index = parseInt(this.morphInput.value, 10);
            if (isNaN(index)) return;

            this.morphToTarget(index);

            // Do not hide the UI controls

            // Show Main Control UI
            if (!this.controlsCreated) {
                this.createControlUI();
                this.controlsCreated = true;
            }
        });

        // this.overlayContainer.appendChild(this.progressBarContainer); // Handled above
    }

    addMorphData(name, data, targetUniforms = this.userData.chaosUniforms) {
        //name, targetPosArr, targetColorArr, targetSizeIsGridArr, targetNormalArr
        let { targetPosAttr, targetColorAttr, targetSizeIsGridAttr, targetNormalAttr, targetSkinIndexAttr, targetSkinWeightAttr, targetSkeleton, targetBindMatrix, targetBindMatrixInverse } = data;
        let morphDataArr = this.points.geometry.morphData ?? [];
        if (!this.morphData) this.morphData = {};

        const newItem = {
            name: name,
            targetUniforms: targetUniforms,
            targetPosAttr: targetPosAttr,
            targetColorAttr: targetColorAttr,
            targetSizeIsGridAttr: targetSizeIsGridAttr,
            targetNormalAttr: targetNormalAttr,
            targetSkinIndexAttr: targetSkinIndexAttr,
            targetSkinWeightAttr: targetSkinWeightAttr,
            targetSkeleton: targetSkeleton,
            targetBindMatrix: targetBindMatrix,
            targetBindMatrixInverse: targetBindMatrixInverse
        };

        // check if name exists update, else add
        let index = morphDataArr.findIndex((item) => item.name === name);
        if (index !== -1) {
            morphDataArr[index] = newItem;
        } else {
            morphDataArr.push(newItem);
        }

        this.points.geometry.morphData = morphDataArr;
        this.morphData[name] = newItem; // Update cache
    }
    _getMorphData(index) {
        if (typeof index === 'string') return this.morphData[index];
        return this.points.geometry.morphData[index];
    }
    _setMorphTargetData(nameOrIndex) {
        const data = this._getMorphData(nameOrIndex);
        if (!data) {
            console.error(`Morph target ${nameOrIndex} not found`);
            return;
        }

        const geometry = this.points.geometry;

        geometry.setAttribute('aTargetPos', data.targetPosAttr);
        geometry.setAttribute('aTargetColor', data.targetColorAttr);
        geometry.setAttribute('aTargetNormal', data.targetNormalAttr);
        geometry.setAttribute('aTargetSizeIsGrid', data.targetSizeIsGridAttr); // Packed Buffer

        // Custom Skinning attributes
        if (data.targetSkinIndexAttr) geometry.setAttribute('skinIndex', data.targetSkinIndexAttr);
        if (data.targetSkinWeightAttr) geometry.setAttribute('aTargetSkinWeight', data.targetSkinWeightAttr);

        if (data.targetSkeleton) {
            this.points.skeleton = data.targetSkeleton;
            this.points.bindMatrix = data.targetBindMatrix || new THREE.Matrix4();
            this.points.bindMatrixInverse = data.targetBindMatrixInverse || new THREE.Matrix4();
            this.points.isSkinnedMesh = true;
        } else {
            this.points.isSkinnedMesh = false;
        }

        // Trigger updates
        geometry.attributes.aTargetPos.needsUpdate = true;
        geometry.attributes.aTargetColor.needsUpdate = true;
        geometry.attributes.aTargetNormal.needsUpdate = true;
        geometry.attributes.aTargetSizeIsGrid.needsUpdate = true;
        if (geometry.attributes.aTargetSkinWeight) geometry.attributes.aTargetSkinWeight.needsUpdate = true;

        if (geometry.attributes.aTargetSkinWeight) geometry.attributes.aTargetSkinWeight.needsUpdate = true;
    }

    /**
     * Snap the geometry and uniforms to a specific resting state.
     * Essential for ensuring that mid-morph interruptions or reversals 
     * leave the system in a consistent state.
     */
    _syncRestingState(index) {
        const data = this._getMorphData(index);
        if (!data) return;

        const geo = this.points.geometry;
        const mat = this.material;

        // 1. Sync Base Attributes (Mirror Target -> Start)
        // This ensures uProgress = 0.0 always looks like the landing target.
        geo.setAttribute('aStartPos', data.targetPosAttr);
        geo.setAttribute('position', data.targetPosAttr); // For raycasting
        geo.setAttribute('aStartColor', data.targetColorAttr);
        geo.setAttribute('aStartNormal', data.targetNormalAttr);
        geo.setAttribute('aStartSizeIsGrid', data.targetSizeIsGridAttr);
        if (data.targetSkinWeightAttr) geo.setAttribute('aStartSkinWeight', data.targetSkinWeightAttr);

        // 2. Clear flags for next upload
        geo.attributes.aStartPos.needsUpdate = true;
        geo.attributes.position.needsUpdate = true;
        geo.attributes.aStartColor.needsUpdate = true;
        geo.attributes.aStartNormal.needsUpdate = true;
        geo.attributes.aStartSizeIsGrid.needsUpdate = true;
        if (geo.attributes.aStartSkinWeight) geo.attributes.aStartSkinWeight.needsUpdate = true;
        if (data.targetSkinIndexAttr) geo.setAttribute('skinIndex', data.targetSkinIndexAttr);

        // 3. Sync Skeleton State
        if (data.targetSkeleton) {
            this.points.skeleton = data.targetSkeleton;
            this.points.bindMatrix = data.targetBindMatrix || new THREE.Matrix4();
            this.points.bindMatrixInverse = data.targetBindMatrixInverse || new THREE.Matrix4();
            this.points.isSkinnedMesh = true;
        } else {
            this.points.isSkinnedMesh = false;
        }

        // 3. Sync Uniforms
        if (data.targetUniforms) {
            for (const key in data.targetUniforms) {
                // EXCEPTION: Don't sync global 'View/Screen' or 'Pulse' uniforms.
                if (key === 'uResolution' || key === 'uPixelRatio' || key === 'uFOV' || key === 'uProjectionMultiplier' || key === 'uRippleColor' || key === 'iTime' || key.startsWith('uPulse') || key === 'uActivePulseCount' || key === 'uTitleMaskRectBase' || key === 'uTitleMaskScale' || key === 'uTitleMaskEdgeJitter' || key.startsWith('uKnowhere')) continue;

                if (mat.uniforms[key]) {
                    const dest = mat.uniforms[key].value;
                    const src = data.targetUniforms[key].value;
                    if (typeof dest === 'object' && dest.copy) dest.copy(src);
                    else mat.uniforms[key].value = src;
                }
            }
        }

        // 3. Reset Progress to 0 to prepare for the NEXT morph FROM this resting state
        mat.uniforms.uProgress.value = 0.0;

        // 4. Chaos/Root Specific Refinements (Step 0, 1: POBA, 2: DEV)
        if (index === 0 || index === 1 || index === 2) {
            this.material.uniforms.uIsChaos.value = 1.0;
            this.material.uniforms.uIsArmatureState.value = 0.0;
            this.material.uniforms.uGlobalHoverStrength.value = 0.0;

            // DEBUG FIX: Ensure visibility params are reset when returning to Chaos
            if (index === 0) {
                if (this.material.uniforms.uSizeThreshold) {
                    this.material.uniforms.uSizeThreshold.value = 0.05;
                }

                // Log Model Point Count just in case removed
                if (this.material.uniforms.uModelPointCount) {
                }
            }
        } else {
            this.material.uniforms.uIsChaos.value = 0.0;
        }

        this.points.geometry.morphCurrentIndex = index;
        this._updateCachedCounts(); // Sync cache after state snap
    }

    morphToTarget(targetDataIndex, duration = MORPH_DURATION, stagger = 0.1, onCompleteCb = null, onUpdateCb = null) {
        if (this.tooltip) this.tooltip.hide();
        const currentMorphIndex = this.points.geometry.morphCurrentIndex || 0;

        // --- INTERRUPT/REVERSAL/PIVOT LOGIC ---
        // Added early return for redundant morphs to ensure consistency
        if (!this.morphTween && currentMorphIndex === targetDataIndex) {
            // Already there and not moving?
            this._syncRestingState(targetDataIndex);
            if (onCompleteCb) onCompleteCb();
            return;
        }

        let isPivoting = false;

        // --- INTERRUPT/REVERSAL/PIVOT LOGIC ---
        if (this.morphTween) {
            // Case A: Reversing to Origin (The "Undo" scroll)
            if (targetDataIndex === this.morphOriginIndex) {
                if (this.isReversing) return; // Already going back? Do nothing.

                this.morphTween.stop();
                this.isReversing = true;
                console.log(`[Points] Morph INTERRUPT: Case A (Reversing ${this.morphOriginIndex} <-> ${this.morphRequestedTarget})`);

                const currentAlpha = this.material.uniforms.uProgress.value;
                const reversalDuration = duration * currentAlpha;

                this.morphTween = new TWEEN.Tween(this.tweenProxy)
                    .to({ t: 0 }, reversalDuration)
                    .easing(TWEEN.Easing.Cubic.Out)
                    .onUpdate(() => {
                        const alpha = this.tweenProxy.t;
                        if (this.activePropsToTween) {
                            for (const prop of this.activePropsToTween) {
                                if (prop.type === 'number') prop.uniform.value = prop.start + (prop.target - prop.start) * alpha;
                                else prop.uniform.copy(prop.start).lerp(prop.target, alpha);
                            }
                        }
                        this.material.uniforms.uProgress.value = alpha;
                        document.documentElement.style.setProperty('--morph-progress', `${Math.min(100, alpha * 100)}%`);
                        if (onUpdateCb) onUpdateCb(alpha);
                    })
                    .onComplete(() => {
                        this.isReversing = false;
                        this.morphTween = null;
                        this._syncRestingState(this.morphOriginIndex);
                        if (onCompleteCb) onCompleteCb();
                    })
                    .start();
                return;
            }

            // Case B: Pivoting back to Goal (The "Forward" scroll)
            if (targetDataIndex === this.morphRequestedTarget) {
                if (!this.isReversing) return; // Already going forward? Do nothing.

                this.morphTween.stop();
                this.isReversing = false;
                console.log(`[Points] Morph INTERRUPT: Case B (Resuming -> ${this.morphRequestedTarget})`);

                const currentAlpha = this.material.uniforms.uProgress.value;
                const resumeDuration = duration * (1.0 - currentAlpha);

                // Ensure the goal state is correctly configured (fixes the 'cube' bug)
                this._setMorphTargetData(targetDataIndex);

                this.morphTween = new TWEEN.Tween(this.tweenProxy)
                    .to({ t: 1 }, resumeDuration)
                    .easing(TWEEN.Easing.Cubic.Out)
                    .onUpdate((obj) => {
                        const alpha = obj.t;
                        if (this.activePropsToTween) {
                            for (const prop of this.activePropsToTween) {
                                if (prop.type === 'number') prop.uniform.value = prop.start + (prop.target - prop.start) * alpha;
                                else prop.uniform.copy(prop.start).lerp(prop.target, alpha);
                            }
                        }
                        this.material.uniforms.uProgress.value = alpha;
                        document.documentElement.style.setProperty('--morph-progress', `${Math.min(100, alpha * 100)}%`);
                        if (onUpdateCb) onUpdateCb(alpha);
                    })
                    .onComplete(() => {
                        this.morphTween = null;
                        this._syncRestingState(targetDataIndex);
                        if (onCompleteCb) onCompleteCb();
                    })
                    .start();
                return;
            }

            // --- CASE C: PERSONA PIVOT (Restore Responsive Spamming) ---
            // If we are toggling between persona states (1 <-> 2) while mid-morph from a different state (e.g. Chaos 0 or Room 5)
            // we allow the transition to "pivot" by stopping the current animation and starting a fresh one from the current mid-point.
            const isPersonaMidFlight = (targetDataIndex === 1 || targetDataIndex === 2);
            if (isPersonaMidFlight) {
                console.log(`[Points] Morph INTERRUPT: Case C (Pivot -> Root ${targetDataIndex})`);
                this._bakeMidFlightState();
                this.morphTween.stop();
                this.morphTween = null;
                isPivoting = true;
                // Fall through to "NEW MORPH START" which handles baking from current mid-way state.
            } else {
                // Block other redundant noise
                return;
            }
        }

        // --- NEW MORPH START ---
        this.morphOriginIndex = currentMorphIndex;
        this.morphRequestedTarget = targetDataIndex;
        this.isReversing = false;

        // Ensure we starting from the current resting state (unless we just baked a mid-flight pivot)
        if (!isPivoting) {
            this._syncRestingState(currentMorphIndex);
        }

        // --- Handle Model Baking for Skinned Models ---
        // If our CURRENT state is skinned, we bake it into position buffer.
        // If it's NOT skinned (like Chaos), synchronous attribute setting handles it.
        const currentIsSkinned = this.points.isSkinnedMesh;
        if (currentIsSkinned) {
            const bakedAttr = this.points.geometry.attributes.position.clone();
            this._bakeCurrentTransforms(bakedAttr);
            this.points.geometry.setAttribute('aStartPos', bakedAttr);
            this.points.geometry.setAttribute('position', bakedAttr);
            const emptyWeights = new THREE.BufferAttribute(new Float32Array(bakedAttr.count * 4), 4);
            this.points.geometry.setAttribute('aStartSkinWeight', emptyWeights);
        }

        this._setMorphTargetData(targetDataIndex);
        this._updateCachedCounts(); // Re-calculate for the new target

        // Prep Uniform Tweens
        const morphData = this._getMorphData(targetDataIndex);
        if (morphData && morphData.targetUniforms) {
            const propsToTween = [];
            for (const key in morphData.targetUniforms) {
                // EXCEPTION: Blacklist global uniforms and pulse data from being overwritten
                if (key === 'uResolution' || key === 'uPixelRatio' || key === 'uFOV' || key === 'uProjectionMultiplier' || key === 'uRippleColor' || key === 'iTime' || key.startsWith('uPulse') || key === 'uActivePulseCount' || key === 'uTitleMaskRectBase' || key === 'uTitleMaskScale' || key === 'uTitleMaskEdgeJitter' || key.startsWith('uKnowhere')) continue;

                if (this.material.uniforms[key]) {
                    const uProp = this.material.uniforms[key];
                    const targetVal = morphData.targetUniforms[key].value;
                    if (typeof targetVal === 'number') {
                        propsToTween.push({ type: 'number', uniform: uProp, start: uProp.value, target: targetVal });
                    } else if (targetVal && (targetVal.isVector2 || targetVal.isVector3 || targetVal.isColor)) {
                        propsToTween.push({ type: 'vector', uniform: uProp.value, start: uProp.value.clone(), target: targetVal });
                    }
                }
            }
            this.activePropsToTween = propsToTween;
            this.tweenProxy = { t: 0 };

            // --- ENHANCEMENT: Linear Progress for Long Morphs (2->3) ---
            // If we are morphing from 2 to 3, use time-based linear progress for the bar
            // to avoid the "stuck" feeling of Cubic Easing on long durations.
            const currentMorphIndex = this.points.geometry.morphCurrentIndex || 0;
            const isLongMorph = (currentMorphIndex === 1 || currentMorphIndex === 2) && targetDataIndex === 3;
            let startTime = null;

            this.morphTween = new TWEEN.Tween(this.tweenProxy)
                .to({ t: 1 }, duration)
                .easing(TWEEN.Easing.Cubic.Out)
                .onStart(() => {
                    startTime = performance.now();
                    this.material.uniforms.uMorphStagger.value = stagger;
                })
                .onUpdate(() => {
                    const alpha = this.tweenProxy.t;
                    for (const prop of propsToTween) {
                        if (prop.type === 'number') prop.uniform.value = prop.start + (prop.target - prop.start) * alpha;
                        else prop.uniform.copy(prop.start).lerp(prop.target, alpha);
                    }
                    this.material.uniforms.uProgress.value = alpha;

                    // Progress Bar Logic
                    let progressPct = alpha * 100;
                    if (isLongMorph && startTime) {
                        const elapsed = performance.now() - startTime;
                        const linearAlpha = Math.min(0.99, elapsed / duration);
                        progressPct = linearAlpha * 100;
                    }

                    document.documentElement.style.setProperty('--morph-progress', `${Math.min(100, progressPct)}%`);
                    if (onUpdateCb) onUpdateCb(alpha);
                })
                .onComplete(() => {
                    this.morphTween = null;
                    document.documentElement.style.setProperty('--morph-progress', '100%'); // Force completion
                    this._syncRestingState(targetDataIndex);
                    if (onCompleteCb) onCompleteCb();
                })
                .start();

            // Store target state for logic in update loop
            if (this.points && this.points.geometry) {
                this.points.geometry.morphTargetIndex = targetDataIndex;
            }
        }
    }

    interruptMorph(reverse = false) {
        if (this.morphTween) {
            this.morphTween.stop();
            this.morphTween = null;
        }

        // Stop and Clear any active Uniform tweens
        if (this.activeUniformTweens) {
            this.activeUniformTweens.forEach(t => t.stop());
            this.activeUniformTweens = [];
        }

        if (reverse) {
            const duration = 500; // Fast reverse
            const easing = TWEEN.Easing.Quadratic.Out;

            // REVERSE UNIFORMS: Tween back to the *Current* (Start) Index's values
            const currentIdx = this.points.geometry.morphCurrentIndex || 0;
            const startMorphData = this._getMorphData(currentIdx);

            if (startMorphData && startMorphData.targetUniforms) {
                for (const key in startMorphData.targetUniforms) {
                    // EXCEPTION: Blacklist global uniforms
                    if (key === 'uResolution' || key === 'uPixelRatio' || key === 'uFOV' || key === 'uProjectionMultiplier' || key === 'uRippleColor' || key === 'iTime' || key.startsWith('uPulse') || key === 'uActivePulseCount' || key === 'uTitleMaskRectBase' || key === 'uTitleMaskScale' || key === 'uTitleMaskEdgeJitter' || key.startsWith('uKnowhere')) continue;

                    if (this.material.uniforms[key]) {
                        const uProp = this.material.uniforms[key];
                        const targetVal = startMorphData.targetUniforms[key].value;

                        // We must mimic the logic of morphToTarget but for reversing
                        if (typeof targetVal === 'number') {
                            new TWEEN.Tween(uProp)
                                .to({ value: targetVal }, duration)
                                .easing(easing)
                                .start();
                        } else if (targetVal && (targetVal.isVector2 || targetVal.isVector3 || targetVal.isColor)) {
                            new TWEEN.Tween(uProp.value)
                                .to(targetVal, duration)
                                .easing(easing)
                                .start();
                        }
                    }
                }
            }

            new TWEEN.Tween(this.material.uniforms.uProgress)
                .to({ value: 0.0 }, duration)
                .easing(easing)
                .onComplete(() => {
                    this.material.uniforms.uProgress.value = 0.0;
                })
                .start();
        } else {
            // Stop in place? Or finish? 
            // Requirement says "stop current tween". It doesn't specify what to do if NOT reversing.
            // But for safety, we just allow stopping.
        }
    }

    /**
     * Captures the current visual position of every point (including skinning & model transforms)
     * and writes it into the provided BufferAttribute.
     * Used to freeze the current state before morphing away from a Skinned Mesh.
     */
    /**
     * Bakes the current interpolated mid-morph state into aStartPos.
     * Prevents "snap back" glitches when interrupting a flight mid-way.
     */
    _bakeMidFlightState() {
        if (!this.points || !this.material) return;
        const geo = this.points.geometry;
        const mat = this.material;
        const alpha = mat.uniforms.uProgress.value;

        const lerp = (a, b, t) => a + (b - a) * t;

        const bake = (startName, targetName) => {
            const sAttr = geo.attributes[startName];
            const tAttr = geo.attributes[targetName];
            if (!sAttr || !tAttr) return;

            const size = sAttr.itemSize;
            const count = sAttr.count;
            const arr = new Float32Array(count * size);

            for (let i = 0; i < count * size; i++) {
                arr[i] = lerp(sAttr.array[i], tAttr.array[i], alpha);
            }
            geo.setAttribute(startName, new THREE.BufferAttribute(arr, size));
            geo.attributes[startName].needsUpdate = true;
        };

        bake('aStartPos', 'aTargetPos');
        bake('aStartColor', 'aTargetColor');
        bake('aStartNormal', 'aTargetNormal');
        bake('aStartSizeIsGrid', 'aTargetSizeIsGrid');

        // Sync main position for collision/raycasting
        geo.setAttribute('position', geo.attributes.aStartPos);
        geo.attributes.position.needsUpdate = true;

        // Reset state
        mat.uniforms.uProgress.value = 0.0;
        if (this.tweenProxy) this.tweenProxy.t = 0.0;
    }

    _bakeCurrentTransforms(targetAttribute) {
        const geometry = this.points.geometry;
        const positionAttr = geometry.attributes.position;
        const skinIndexAttr = geometry.attributes.skinIndex;
        const skinWeightAttr = geometry.attributes.aStartSkinWeight || geometry.attributes.aTargetSkinWeight;

        // Safety check: Needs skinning data
        if (!this.points.isSkinnedMesh || !skinIndexAttr || !skinWeightAttr) {
            // Fallback: Just copy current 'position' if no skinning
            for (let i = 0; i < positionAttr.count; i++) {
                targetAttribute.setXYZ(i, positionAttr.getX(i), positionAttr.getY(i), positionAttr.getZ(i));
            }
            targetAttribute.needsUpdate = true;
            return;
        }

        const skeleton = this.points.skeleton;
        // Ensure matrices are fresh
        if (skeleton) skeleton.update();

        const vector = new THREE.Vector3();
        const bindMatrix = this.points.bindMatrix;
        const bindMatrixInverse = this.points.bindMatrixInverse;

        const boneMat = new THREE.Matrix4();
        const skinVertex = new THREE.Vector4();
        const skinned = new THREE.Vector4();
        const tempVec4 = new THREE.Vector4();

        // Iterate all points
        for (let i = 0; i < positionAttr.count; i++) {
            // 1. Get Bind Pose Position
            vector.fromBufferAttribute(positionAttr, i);

            // 2. Apply Skinning
            skinVertex.set(vector.x, vector.y, vector.z, 1.0).applyMatrix4(bindMatrix);
            skinned.set(0, 0, 0, 0);

            for (let j = 0; j < 4; j++) {
                const weight = skinWeightAttr.getComponent(i, j);
                if (weight > 0.0001) {
                    const si = skinIndexAttr.getComponent(i, j);
                    boneMat.fromArray(skeleton.boneMatrices, si * 16);
                    tempVec4.copy(skinVertex).applyMatrix4(boneMat).multiplyScalar(weight);
                    skinned.add(tempVec4);
                }
            }

            // Back to local space
            skinVertex.copy(skinned).applyMatrix4(bindMatrixInverse);
            targetAttribute.setXYZ(i, skinVertex.x, skinVertex.y, skinVertex.z);
        }

        targetAttribute.needsUpdate = true;
    }

    //add a param for timeScale, default = 1
    playAnimation(clipName, duration = 0.5, loop = true, timeScale = 1, onComplete = null) {
        if (!this.mixer) {
            console.warn("[Points] playAnimation aborted: No Mixer");
            return;
        }
        if (!this.scene.pointsClips) {
            console.warn("[Points] playAnimation aborted: No scene.pointsClips");
            return;
        }

        const clip = THREE.AnimationClip.findByName(this.scene.pointsClips, clipName);
        if (!clip) {
            return;
        }

        const newAction = this.mixer.clipAction(clip);

        // Handle crossfade if there's an active action
        if (this.pointsActiveAction && this.pointsActiveAction !== newAction) {
            this.pointsActiveAction.fadeOut(duration);
        }

        newAction.reset();
        newAction.setEffectiveWeight(1);

        if (!loop) {
            newAction.setLoop(THREE.LoopOnce);
            newAction.clampWhenFinished = true; // Crucial: don't snap back to start
        } else {
            newAction.setLoop(THREE.LoopRepeat);

        }
        newAction.timeScale = timeScale;
        newAction.fadeIn(duration);
        newAction.play();

        // Handle onComplete callback
        if (onComplete) {
            const onFinished = (e) => {
                if (e.action === newAction) {
                    this.mixer.removeEventListener('finished', onFinished);
                    onComplete();
                }
            };
            this.mixer.addEventListener('finished', onFinished);
        }

        this.pointsActiveAction = newAction;
    }

    /**
     * Plays the next dance animation in the predefined sequence.
     */
    playNextDance() {
        if (!this.scene || !this.scene.pointsClips) return;

        // Current Dance Pool (Synced with interaction logic)
        const danceClips = this.scene.pointsClips.filter(c => {
            const name = c.name.toLowerCase();
            return name === 'robotdance' ||
                name === 'gangnam' ||
                name === 'waving' ||
                name === 'wave' ||
                name === 'breakdance';
        });

        if (danceClips.length === 0) return;

        // Selection Logic: Sequence through the pool
        if (this._currentDanceIdx === undefined) this._currentDanceIdx = 0;
        else this._currentDanceIdx = (this._currentDanceIdx + 1) % danceClips.length;

        const nextClip = danceClips[this._currentDanceIdx];

        // Play next dance with auto-transition upon completion
        this.playAnimation(nextClip.name, 0.8, false, 1.0, () => {
            this.playNextDance(); // Auto-transition
        });

        // Feedback
        this.triggerScalePulse();
    }

    /**
     * Trigger a subtle scale pulse for visual feedback.
     */
    triggerScalePulse() {
        if (!this.material || !this.material.uniforms.uModelScale) return;
        if (this._clickScaleTween) this._clickScaleTween.stop();

        const uScale = this.material.uniforms.uModelScale;
        const currentIdx = this.getCurrentStep ? this.getCurrentStep() : 0;

        // Use a safe baseline scale for the transition states
        const baseScale = (currentIdx === 2) ? 0.225 : uScale.value;
        const pulseScale = baseScale * 1.08;

        this._clickScaleTween = new TWEEN.Tween(uScale)
            .to({ value: pulseScale }, 100)
            .easing(TWEEN.Easing.Quadratic.Out)
            .yoyo(true)
            .repeat(1)
            .onComplete(() => {
                uScale.value = baseScale;
                this._clickScaleTween = null;
            })
            .start();
    }

    /**
     * Smoothly stops all active animations.
     */
    stopAnimations(duration = 0.5) {
        if (!this.mixer || !this.pointsActiveAction) return;
        this.pointsActiveAction.fadeOut(duration);
        this.pointsActiveAction = null;
    }
    async loadModel() {
        if (resources.pointsModel) {
            const gltf = resources.pointsModel;
            this.model = SkeletonUtils.clone(gltf.scene);

            // Fix: Ensure scene has access to clips if that's where we look
            if (gltf.pointsClips && gltf.pointsClips.length > 0) {
                if (!this.scene.pointsClips) {
                    this.scene.pointsClips = gltf.pointsClips;
                }
            } else if (gltf.animations) {
                // Fallback if pointsClips weren't processed for some reason
                this.scene.pointsClips = gltf.animations;
            }

            if (gltf.animations && gltf.animations.length > 0) {
                this.mixer = new THREE.AnimationMixer(this.model);
            }

            await this._addMorphDataByModelName(SCENE_OBJECTS.ROOT, true, {
                uModelScale: { value: 4.4 },
                uSizeThreshold: { value: 0.05 },
                uVibrateBoostSizeThreshold: { value: 0.3 },
                uIsChaos: { value: 1.0 }, // Changed from 0.0 to 1.0
                uModelScreenOffset: { value: new THREE.Vector2(0.4, 0) },
                uModelVibFactor: { value: 4.0 }, // Increased for character presence
                uIsArmatureState: { value: 0.0 },
                uAttractionForce: { value: 0.0 },
                uAttractionRefSize: { value: 0.5 }, // Tuned for world-space size (0.35-0.5)
                uLightSizeBoost: { value: 2.5 },
                uGlobalHoverStrength: { value: 0.0 },
                uHoveredTextureIndex: { value: 0.0 },
                uVibrateAmp: { value: 0.15 },
                uHoverPointScaleFactor: { value: 1.1 }, // Subtle boost for Root state
                uDipperBrightnessScalar: { value: 2.0 } // Double dipper brightness in Root state
            });

            await this._addMorphDataByModelName(SCENE_OBJECTS.ROOT_DEV, true, {
                uModelScale: { value: 4.4 },
                uSizeThreshold: { value: 0.05 },
                uVibrateBoostSizeThreshold: { value: 0.3 },
                uIsChaos: { value: 1.0 },
                uModelScreenOffset: { value: new THREE.Vector2(0.4, 0) },
                uModelVibFactor: { value: 4.0 },
                uIsArmatureState: { value: 0.0 },
                uAttractionForce: { value: 0.0 },
                uAttractionRefSize: { value: 0.5 },
                uLightSizeBoost: { value: 2.5 },
                uGlobalHoverStrength: { value: 0.0 },
                uHoveredTextureIndex: { value: 0.0 },
                uVibrateAmp: { value: 0.15 },
                uHoverPointScaleFactor: { value: 1.1 },
                uDipperBrightnessScalar: { value: 2.0 }
            });

            await this._addMorphDataByModelName(SCENE_OBJECTS.CHAR, false, {
                uModelScale: { value: 0.25 },
                uModelRotation: { value: new THREE.Vector3(Math.PI / 2, -1.15, 0) },
                uIsChaos: { value: 0.0 },
                uModelScreenOffset: { value: new THREE.Vector2(0.25, -0.8) },
                uEnableMouseRotation: { value: false },
                uModelPointSizeFactor: { value: 1.2 },
                uIsArmatureState: { value: 1.0 },
                uAttractionForce: { value: 60.0 },
                uAttractionRefSize: { value: 0.55 }, // Tuned for world-space size
                uAttractionRadius: { value: 500.0 },

                uLightSizeBoost: { value: 0.5 },
                uModelVibFactor: { value: 3.0 },
                uSizeThreshold: { value: 0.01 },
                uHoverPointScaleFactor: { value: 1.0 }, // Disable hover scale boost for Char state
                uKnowhereGravityHoverFactor: { value: 0.0 }
            });

            // Fake loading removed in favor of Execution-Honest progress system managed in office.js
            updateTaskProgress('points-init', 1.0);
            return;
        } else {
            console.error("Hero Model not found in resources!");
        }
    }

    async createBackgroundParticles() {
        // ... (This involves a large block, I will replace the start and end of the loop with progress calls)
        const totalPoints = this.pointCap;
        let lastReportProgress = 0;
        // Initialize Material with default uniforms
        this.material = new THREE.ShaderMaterial({
            uniforms: this.shaderUniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            depthWrite: false,
            skinning: true,
            extensions: { derivatives: true }
        });

        const count = this.pointCap;
        const randomPositions = new Float32Array(count * 3);
        const targetPositions = new Float32Array(count * 3);
        const startSizeIsGrid = new Float32Array(count * 2);
        const targetSizeIsGrid = new Float32Array(count * 2);
        const startColors = new Float32Array(count * 3);
        const targetColors = new Float32Array(count * 3);
        const stableRandoms = new Float32Array(count);
        const spatialGridIndices = new Float32Array(count * 2);

        const gridSide = Math.ceil(Math.sqrt(count)) || 1;
        const camPos = new THREE.Vector3(CAMERA_POSITION.x, CAMERA_POSITION.y, CAMERA_POSITION.z);
        const target = new THREE.Vector3(0, 0, 0);
        const forward = new THREE.Vector3().subVectors(target, camPos).normalize();
        const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
        const up = new THREE.Vector3().crossVectors(right, forward).normalize();
        const gridOrigin = forward.clone().multiplyScalar(-gridZ);
        const tempVec = new THREE.Vector3();
        const baseColorObj = new THREE.Color('#ffffff');

        let lastYieldTime = performance.now();
        const YIELD_LIMIT = 8; // 8ms threshold for smoother cold starts
        for (let i = 0; i < count; i++) {
            if (performance.now() - lastYieldTime > YIELD_LIMIT) {
                await this.yieldToBrowser();
                lastYieldTime = performance.now();

                // Incrementally report progress (0 to 0.8 range for particle generation)
                const currentP = (i / count) * 0.8;
                if (currentP - lastReportProgress > 0.05) {
                    updateTaskProgress('points-init', currentP);
                    lastReportProgress = currentP;
                }
            }
            stableRandoms[i] = Math.random();
            randomPositions[i * 3 + 0] = (Math.random() * 2.0 - 1.0) * scatterRangeGrid;
            randomPositions[i * 3 + 1] = (Math.random() * 2.0 - 1.0) * scatterRangeGrid;
            randomPositions[i * 3 + 2] = (Math.random() * 2.0 - 1.0) * scatterRangeGrid;

            const col = i % gridSide;
            const row = Math.floor(i / gridSide);
            spatialGridIndices[i * 2 + 0] = col;
            spatialGridIndices[i * 2 + 1] = row;

            const xOffset = (col - gridSide / 2) * gridSpacing;
            const yOffset = (row - gridSide / 2) * gridSpacing;

            tempVec.copy(gridOrigin).addScaledVector(right, xOffset).addScaledVector(up, yOffset);

            targetPositions[i * 3 + 0] = tempVec.x;
            targetPositions[i * 3 + 1] = tempVec.y;
            targetPositions[i * 3 + 2] = tempVec.z;

            startSizeIsGrid[i * 2 + 0] = GRID_SIZE;
            startSizeIsGrid[i * 2 + 1] = 1.0;
            targetSizeIsGrid[i * 2 + 0] = GRID_SIZE;
            targetSizeIsGrid[i * 2 + 1] = 1.0;

            startColors[i * 3 + 0] = baseColorObj.r;
            startColors[i * 3 + 1] = baseColorObj.g;
            startColors[i * 3 + 2] = baseColorObj.b;
            targetColors[i * 3 + 0] = baseColorObj.r;
            targetColors[i * 3 + 1] = baseColorObj.g;
            targetColors[i * 3 + 2] = baseColorObj.b;
        }




        // --- aPointData (vec4 per point) ---
        // x = linear index, y = isDipper flag, z = brightnessFactor, w = packed(texSlot*2+useColor)
        // Promoted from vec2→vec4 to fold dipper metadata in and avoid exceeding WebGL attribute limit.
        const pointData = new Float32Array(count * 4);
        for (let i = 0; i < count; i++) {
            pointData[i * 4 + 0] = i;    // x: linear index
            pointData[i * 4 + 1] = 0.0;  // y: isDipper
            pointData[i * 4 + 2] = 0.0;  // z: brightnessFactor
            pointData[i * 4 + 3] = 0.0;  // w: packed meta
        }

        // ===================================================================================
        // OPTION A: RESERVED TAIL SLOTS for Big Dipper
        // Dipper stars occupy the last bigDipper.length buffer slots:
        //   slot i = count - bigDipper.length + starIndex
        // These indices always exceed any model's modelPointCount, so they always
        // fall in the grid range (grid loop: i = modelPointCount..count-1) for ALL morphs.
        // ===================================================================================
        const DIPPER_BASE = count - bigDipper.length;

        bigDipper.forEach((star, starIndex) => {
            const index = DIPPER_BASE + starIndex;
            const cfg = chaosDipperConfig[starIndex];

            // --- Chaos Position (Start State) ---
            randomPositions[index * 3 + 0] = cfg.pos.x;
            randomPositions[index * 3 + 1] = cfg.pos.y;
            randomPositions[index * 3 + 2] = cfg.pos.z;

            // --- Color: bright white in Chaos ---
            let brightness = 1.0;
            if (starIndex === 2 || starIndex === 7) brightness = 0.2; // Alioth & Sirius dimmer
            startColors[index * 3 + 0] = brightness;
            startColors[index * 3 + 1] = brightness;
            startColors[index * 3 + 2] = brightness;
            targetColors[index * 3 + 0] = brightness;
            targetColors[index * 3 + 1] = brightness;
            targetColors[index * 3 + 2] = brightness;

            // --- Pack all dipper data into aPointData (.y/.z/.w) ---
            const texSlot = (star.textureSlotRow || 0) * 8 + (star.textureSlotCol || 0);
            const useColor = star.useDipperColor ? 1.0 : 0.0;
            pointData[index * 4 + 1] = 1.0;                         // y: isDipper flag
            pointData[index * 4 + 2] = star.brightnessFactor || 1.0; // z: brightnessFactor
            pointData[index * 4 + 3] = texSlot * 2.0 + useColor;    // w: packed meta
        });

        // Expose DIPPER_BASE so morph builders can reference it
        this._dipperBaseIndex = DIPPER_BASE;

        const geometry = new THREE.BufferGeometry();

        // --- Position ---
        const startPosAttr = new THREE.Float32BufferAttribute(randomPositions, 3);
        const targetPosAttr = new THREE.Float32BufferAttribute(targetPositions, 3);
        geometry.setAttribute('position', startPosAttr);
        geometry.setAttribute('aTargetPos', targetPosAttr);

        // --- SizeIsGrid (Packed) ---
        const startSizeIsGridAttr = new THREE.Float32BufferAttribute(startSizeIsGrid, 2);
        const targetSizeIsGridAttr = new THREE.Float32BufferAttribute(targetSizeIsGrid, 2);
        geometry.setAttribute('aStartSizeIsGrid', startSizeIsGridAttr);
        geometry.setAttribute('aTargetSizeIsGrid', targetSizeIsGridAttr);

        // --- Color ---
        const startColorAttr = new THREE.Float32BufferAttribute(startColors, 3);
        const targetColorAttr = new THREE.Float32BufferAttribute(targetColors, 3);
        geometry.setAttribute('aStartColor', startColorAttr);
        geometry.setAttribute('aTargetColor', targetColorAttr);

        // --- Normal ---
        // Start and Target Normals
        const startNormals = new Float32Array(count * 3).fill(0);
        const targetNormals = new Float32Array(count * 3).fill(0);

        const startNormalAttr = new THREE.Float32BufferAttribute(startNormals, 3);
        const targetNormalAttr = new THREE.Float32BufferAttribute(targetNormals, 3);
        geometry.setAttribute('aStartNormal', startNormalAttr);
        geometry.setAttribute('aTargetNormal', targetNormalAttr);

        // --- IsGrid --- REMOVED (Packed above)

        // --- Stable Index ---
        geometry.setAttribute('aStableRandom', new THREE.Float32BufferAttribute(stableRandoms, 1));

        // --- Spatial Grid Index (for Tooltip) ---
        geometry.setAttribute('aSpatialGridIndex', new THREE.Float32BufferAttribute(spatialGridIndices, 2));

        // --- aPointData (vec4): index, isDipper, brightnessFactor, packedMeta ---
        geometry.setAttribute('aPointData', new THREE.Float32BufferAttribute(pointData, 4));

        PerformanceLogger.markEnd('parse_binary_headers');
        PerformanceLogger.markStart('hydrate_particles');

        // --- ATTRIBUTE REGENERATION (Hybrid Loading) ---
        // If attributes were pruned to save size, we regenerate them here.

        const pointCount = geometry.attributes.position.count; // Use local variable to avoid confusion

        PerformanceLogger.markStart('regen_attributes');

        // 1. Target Positions (Grid)
        if (!geometry.attributes.aTargetPos) {
            const targetPositions = new Float32Array(pointCount * 3);
            // Reconstruct Grid Logic
            // We need to access the class properties or constants if they are not available in local scope
            // The loop above uses `gridSide`, `gridSpacing`, `gridZ`... let's reuse correct values

            // Recalculate or reuse variables from above if they are in scope.
            // `gridSide` is defined in line 1186. `gridSpacing` is imported/constant.
            let gSide = Math.ceil(Math.sqrt(pointCount));
            let gSpace = gridSpacing;
            let gZ = gridZ;

            const camPos = new THREE.Vector3(CAMERA_POSITION.x, CAMERA_POSITION.y, CAMERA_POSITION.z);
            const target = new THREE.Vector3(0, 0, 0);
            const forward = new THREE.Vector3().subVectors(target, camPos).normalize();
            const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
            const up = new THREE.Vector3().crossVectors(right, forward).normalize();
            const gridOrigin = forward.clone().multiplyScalar(-gZ);
            const tempVec = new THREE.Vector3();

            for (let i = 0; i < pointCount; i++) {
                const col = i % gSide;
                const row = Math.floor(i / gSide);
                const xOffset = (col - gSide / 2) * gSpace;
                const yOffset = (row - gSide / 2) * gSpace;

                tempVec.copy(gridOrigin).addScaledVector(right, xOffset).addScaledVector(up, yOffset);

                targetPositions[i * 3 + 0] = tempVec.x;
                targetPositions[i * 3 + 1] = tempVec.y;
                targetPositions[i * 3 + 2] = tempVec.z;
            }
            geometry.setAttribute('aTargetPos', new THREE.BufferAttribute(targetPositions, 3));
        }

        // 2. Colors (White)
        // 2. Colors (White with Dipper Overrides)
        if (!geometry.attributes.aStartColor) {
            const colors = new Uint8Array(pointCount * 3).fill(255);

            // --- FIX: Apply Dipper Brightness to Regenerated Buffer ---
            if (this.shaderUniforms && this.shaderUniforms.uGridSide) {
                const gSide = Math.ceil(Math.sqrt(pointCount));
                bigDipper.forEach((star, i) => {
                    const index = star.row * gSide + star.col;
                    if (index < pointCount) {
                        // Use brightnessFactor from the star definition (Capped at 255 for Uint8)
                        const bFactor = star.brightnessFactor || 1.0;
                        const brightness = Math.min(255, Math.floor(bFactor * 255));

                        colors[index * 3 + 0] = brightness;
                        colors[index * 3 + 1] = brightness;
                        colors[index * 3 + 2] = brightness;
                    }
                });
            }

            geometry.setAttribute('aStartColor', new THREE.BufferAttribute(colors, 3, true));
        }
        if (!geometry.attributes.aTargetColor) {
            const colors = new Uint8Array(pointCount * 3).fill(255);

            // --- FIX: Apply Dipper Brightness to Target Buffer as well ---
            if (this.shaderUniforms && this.shaderUniforms.uGridSide) {
                const gSide = Math.ceil(Math.sqrt(pointCount));
                bigDipper.forEach((star, i) => {
                    const index = star.row * gSide + star.col;
                    if (index < pointCount) {
                        let brightness = 255;
                        if (i === 2 || i === 7) {
                            brightness = 51;
                        }
                        colors[index * 3 + 0] = brightness;
                        colors[index * 3 + 1] = brightness;
                        colors[index * 3 + 2] = brightness;
                    }
                });
            }

            geometry.setAttribute('aTargetColor', new THREE.BufferAttribute(colors, 3, true));
        }

        // 3. Normals (Zero)
        if (!geometry.attributes.aStartNormal) {
            const normals = new Int8Array(pointCount * 3).fill(0); // 0,0,0
            geometry.setAttribute('aStartNormal', new THREE.BufferAttribute(normals, 3, true));
        }
        if (!geometry.attributes.aTargetNormal) {
            const normals = new Int8Array(pointCount * 3).fill(0);
            geometry.setAttribute('aTargetNormal', new THREE.BufferAttribute(normals, 3, true));
        }

        // 4. SizeIsGrid (Default)
        if (!geometry.attributes.aStartSizeIsGrid) {
            const sizes = new Float32Array(pointCount * 2);
            for (let i = 0; i < pointCount; i++) {
                sizes[i * 2 + 0] = GRID_SIZE; // Constant
                sizes[i * 2 + 1] = 1.0; // IsGrid = true
            }
            geometry.setAttribute('aStartSizeIsGrid', new THREE.BufferAttribute(sizes, 2));
        }
        if (!geometry.attributes.aTargetSizeIsGrid) {
            const sizes = new Float32Array(pointCount * 2);
            for (let i = 0; i < pointCount; i++) {
                sizes[i * 2 + 0] = GRID_SIZE;
                sizes[i * 2 + 1] = 1.0;
            }
            geometry.setAttribute('aTargetSizeIsGrid', new THREE.BufferAttribute(sizes, 2));
        }

        // 5. Skin Weights (Zero) - If missing
        if (!geometry.attributes.aStartSkinWeight) {
            geometry.setAttribute('aStartSkinWeight', new THREE.BufferAttribute(new Float32Array(pointCount * 4), 4));
        }
        if (!geometry.attributes.aTargetSkinWeight) {
            geometry.setAttribute('aTargetSkinWeight', new THREE.BufferAttribute(new Float32Array(pointCount * 4), 4));
        }
        if (!geometry.attributes.skinIndex) {
            geometry.setAttribute('skinIndex', new THREE.BufferAttribute(new Uint16Array(pointCount * 4), 4));
        }
        PerformanceLogger.markEnd('regen_attributes');

        // --- SKINNING (Manual) ---
        const startSkinWeights = new Float32Array(count * 4).fill(0);

        // Finalize Profiling
        PerformanceLogger.logTable();
        const targetSkinWeights = new Float32Array(count * 4).fill(0);
        const skinIndices = new Uint16Array(count * 4).fill(0);

        const startSkinWeightAttr = new THREE.Float32BufferAttribute(startSkinWeights, 4);
        const targetSkinWeightAttr = new THREE.Float32BufferAttribute(targetSkinWeights, 4);
        const skinIndexAttr = new THREE.Uint16BufferAttribute(skinIndices, 4);

        geometry.setAttribute('aStartSkinWeight', startSkinWeightAttr);
        geometry.setAttribute('aTargetSkinWeight', targetSkinWeightAttr);
        geometry.setAttribute('skinIndex', skinIndexAttr);

        this.points = new THREE.Points(geometry, this.material);

        // Log Profile Results
        PerformanceLogger.logTable();

        this.points.frustumCulled = false; // Disable culling explicitly
        geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 5000.0); // Create huge bounding sphere to prevent any culling calculations
        // geometry.center(); // Don't center, keep explicit positions
        this.points.name = 'PointsCloud';
        this.points.parentInstance = this; // Back-reference for Tooltip logic
        this.points.visible = false;       // Initially hidden until playIntro
        this.scene.add(this.points);

        // add morph data named chaos
        const chaosData = {
            targetPosAttr: startPosAttr,
            targetColorAttr: startColorAttr,
            targetSizeIsGridAttr: startSizeIsGridAttr,
            targetNormalAttr: startNormalAttr,
            targetSkinIndexAttr: skinIndexAttr,
            targetSkinWeightAttr: targetSkinWeightAttr // 0s
        }
        this.addMorphData("chaos", chaosData, this.userData.chaosUniforms);
        // Wrap up particle generation progress
        updateTaskProgress('points-init', 0.9);
        this._updateCachedCounts();
    }



    async _addMorphDataByModelName(name, hasGrid = false, uniformOverrides = {}) {
        const modelUniforms = THREE.UniformsUtils.clone(this.userData.chaosUniforms);
        for (const key in uniformOverrides) {
            if (modelUniforms[key]) modelUniforms[key].value = uniformOverrides[key].value;
        }
        const baseModel = this.model.getObjectByName(name);
        if (!baseModel) {
            console.warn(`[Points] _addMorphDataByModelName: Model object '${name}' not found in GLTF.`);
            return;
        }

        const meshes = [];
        baseModel.traverse((child) => {
            if (child.isMesh) {
                child.updateMatrixWorld(true);
                meshes.push(child);
            }
        });

        const count = this.pointCap;
        const baseData = this._getMorphData(0);

        const targetPositions = new Float32Array(baseData.targetPosAttr.array);
        const targetSizeIsGrid = new Float32Array(baseData.targetSizeIsGridAttr.array);
        const targetNormals = new Float32Array(baseData.targetNormalAttr.array);
        const sourceColorArray = baseData.targetColorAttr.array;
        const targetColors = new Float32Array(sourceColorArray.length);
        const sourceIsByte = sourceColorArray instanceof Uint8Array || sourceColorArray instanceof Uint8ClampedArray;

        // Normalize color data if coming from a byte buffer to prevent 255.0 brightness blowouts
        let lastYieldTimeColor = performance.now();
        for (let i = 0; i < sourceColorArray.length; i++) {
            if (i % 10000 === 0 && (performance.now() - lastYieldTimeColor > 4)) {
                await this.yieldToBrowser();
                lastYieldTimeColor = performance.now();
            }
            targetColors[i] = sourceIsByte ? (sourceColorArray[i] / 255) : sourceColorArray[i];
        }
        const targetSkinIndices = new Float32Array(count * 4);
        const targetSkinWeights = new Float32Array(count * 4);

        let foundSkeleton = null;
        let foundBindMatrix = null;
        let foundBindMatrixInverse = null;
        let currentPointIndex = 0;

        const tempVec = new THREE.Vector3();
        const tempNormal = new THREE.Vector3();
        const normalMatrix = new THREE.Matrix3();
        const baseColorObj = new THREE.Color('#ffffff');

        for (let m = 0; m < meshes.length; m++) {
            const mesh = meshes[m];
            const worldMatrix = mesh.matrixWorld;
            normalMatrix.getNormalMatrix(worldMatrix);

            if (mesh.skeleton && !foundSkeleton) {
                foundSkeleton = mesh.skeleton;
                foundBindMatrix = mesh.bindMatrix;
                foundBindMatrixInverse = mesh.bindMatrixInverse;
            }

            const originalGeometry = mesh.geometry;
            const originalPosAttr = originalGeometry.attributes.position;
            const originalNormals = originalGeometry.attributes.normal;
            const originalSkinIndex = originalGeometry.attributes.skinIndex;
            const originalSkinWeight = originalGeometry.attributes.skinWeight;
            const meshVertexCount = originalPosAttr.count;

            let meshColor = new THREE.Vector3(1, 1, 1);
            let brightness = 1.0;

            // Robust matching: Try to find info by name, case-insensitive, longest name first to avoid collisions (heart vs heartDev)
            // Check the mesh name and all its parents up to the baseModel to support nested objects
            const sortedInfo = MODEL_INFO.slice().sort((a, b) => b.name.length - a.name.length);
            let info = null;
            let current = mesh;
            while (current) {
                const currentName = current.name.toLowerCase();
                info = sortedInfo.find(info => currentName.includes(info.name.toLowerCase()));
                if (info || current === baseModel) break;
                current = current.parent;
            }

            if (info) {
                meshColor = info.baseColor;
                if (info.brightness) brightness = info.brightness;
            }

            let lastYieldTime = performance.now();
            const YIELD_LIMIT = 8;
            for (let i = 0; i < meshVertexCount; i++) {
                if (currentPointIndex >= count) break;
                if (performance.now() - lastYieldTime > YIELD_LIMIT) {
                    await this.yieldToBrowser();
                    lastYieldTime = performance.now();
                }

                if (foundSkeleton) {
                    targetPositions[currentPointIndex * 3 + 0] = originalPosAttr.getX(i);
                    targetPositions[currentPointIndex * 3 + 1] = originalPosAttr.getY(i);
                    targetPositions[currentPointIndex * 3 + 2] = originalPosAttr.getZ(i);
                } else {
                    tempVec.set(originalPosAttr.getX(i), originalPosAttr.getY(i), originalPosAttr.getZ(i));
                    tempVec.applyMatrix4(worldMatrix);
                    targetPositions[currentPointIndex * 3 + 0] = tempVec.x;
                    targetPositions[currentPointIndex * 3 + 1] = tempVec.y;
                    targetPositions[currentPointIndex * 3 + 2] = tempVec.z;
                }

                if (originalNormals) {
                    if (foundSkeleton) {
                        targetNormals[currentPointIndex * 3 + 0] = originalNormals.getX(i);
                        targetNormals[currentPointIndex * 3 + 1] = originalNormals.getY(i);
                        targetNormals[currentPointIndex * 3 + 2] = originalNormals.getZ(i);
                    } else {
                        tempNormal.set(originalNormals.getX(i), originalNormals.getY(i), originalNormals.getZ(i));
                        tempNormal.applyMatrix3(normalMatrix).normalize();
                        targetNormals[currentPointIndex * 3 + 0] = tempNormal.x;
                        targetNormals[currentPointIndex * 3 + 1] = tempNormal.y;
                        targetNormals[currentPointIndex * 3 + 2] = tempNormal.z;
                    }
                }

                if (originalSkinIndex) {
                    targetSkinIndices[currentPointIndex * 4 + 0] = originalSkinIndex.getX(i);
                    targetSkinIndices[currentPointIndex * 4 + 1] = originalSkinIndex.getY(i);
                    targetSkinIndices[currentPointIndex * 4 + 2] = originalSkinIndex.getZ(i);
                    targetSkinIndices[currentPointIndex * 4 + 3] = originalSkinIndex.getW(i);
                }
                if (originalSkinWeight) {
                    targetSkinWeights[currentPointIndex * 4 + 0] = originalSkinWeight.getX(i);
                    targetSkinWeights[currentPointIndex * 4 + 1] = originalSkinWeight.getY(i);
                    targetSkinWeights[currentPointIndex * 4 + 2] = originalSkinWeight.getZ(i);
                    targetSkinWeights[currentPointIndex * 4 + 3] = originalSkinWeight.getW(i);
                }

                // World Unit Sizing: 0.28 to 0.44 units wide (reduced 20% from 0.35-0.55)
                const pointSizeMult = (info && info.pointSizeMultiplier !== undefined) ? info.pointSizeMultiplier : 1.0;
                targetSizeIsGrid[currentPointIndex * 2 + 0] = (0.28 + Math.pow(Math.random(), 0.7) * 0.16) * pointSizeMult;
                targetSizeIsGrid[currentPointIndex * 2 + 1] = 0.0;

                targetColors[currentPointIndex * 3 + 0] = meshColor.x * brightness;
                targetColors[currentPointIndex * 3 + 1] = meshColor.y * brightness;
                targetColors[currentPointIndex * 3 + 2] = meshColor.z * brightness;

                currentPointIndex++;
            }
        }

        const modelPointCount = currentPointIndex;

        if (hasGrid) {
            const remaining = Math.max(0, count - modelPointCount);
            const gridSide = Math.ceil(Math.sqrt(remaining)) || 1;

            if (modelUniforms.uGridSide) modelUniforms.uGridSide.value = gridSide;
            const camPos = new THREE.Vector3(CAMERA_POSITION.x, CAMERA_POSITION.y, CAMERA_POSITION.z);
            const target = new THREE.Vector3(0, 0, 0);
            const forward = new THREE.Vector3().subVectors(target, camPos).normalize();
            const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
            const up = new THREE.Vector3().crossVectors(right, forward).normalize();
            const gridOrigin = forward.clone().multiplyScalar(-gridZ);

            const occupied = new Uint8Array(gridSide * gridSide);
            const offset = (modelUniforms.uModelScreenOffset) ? modelUniforms.uModelScreenOffset.value : this.material.uniforms.uModelScreenOffset.value;
            const modelPos = (modelUniforms.uModelPosition) ? modelUniforms.uModelPosition.value : this.material.uniforms.uModelPosition.value;
            const scale = (modelUniforms.uModelScale) ? modelUniforms.uModelScale.value : this.material.uniforms.uModelScale.value;
            const rot = (modelUniforms.uModelRotation) ? modelUniforms.uModelRotation.value : this.material.uniforms.uModelRotation.value;

            const mX = new THREE.Matrix4().makeRotationX(rot.x);
            const mY = new THREE.Matrix4().makeRotationY(rot.y);
            const mZ = new THREE.Matrix4().makeRotationZ(rot.z);
            const mR = mZ.clone().multiply(mY).multiply(mX);

            const ndcVec = new THREE.Vector3();
            const modelGapCells = Math.ceil((GAP_SIZE * 3.0) / gridSpacing);

            this.camera.updateMatrixWorld();
            this.camera.updateProjectionMatrix();

            // Matrices for skinning
            const skeleton = foundSkeleton;
            const bindMatrix = foundBindMatrix;
            const bindMatrixInverse = foundBindMatrixInverse;
            const boneMat = new THREE.Matrix4();
            const vSkin = new THREE.Vector4();
            const vSkinned = new THREE.Vector4();

            for (let i = 0; i < modelPointCount; i++) {
                if (i % 500 === 0) await this.yieldToBrowser(); // More frequent yielding for heavy math
                tempVec.set(targetPositions[i * 3 + 0], targetPositions[i * 3 + 1], targetPositions[i * 3 + 2]);

                // 1. Apply Skinning if skeleton exists
                if (skeleton) {
                    vSkin.set(tempVec.x, tempVec.y, tempVec.z, 1.0).applyMatrix4(bindMatrix);
                    vSkinned.set(0, 0, 0, 0);

                    for (let j = 0; j < 4; j++) {
                        const sw = targetSkinWeights[i * 4 + j];
                        if (sw > 0.0001) {
                            const si = targetSkinIndices[i * 4 + j];
                            boneMat.fromArray(skeleton.boneMatrices, si * 16);
                            tempVec.copy(vSkin.xyz).applyMatrix4(boneMat).multiplyScalar(sw);
                            vSkinned.x += tempVec.x;
                            vSkinned.y += tempVec.y;
                            vSkinned.z += tempVec.z;
                        }
                    }
                    vSkin.set(vSkinned.x, vSkinned.y, vSkinned.z, 1.0).applyMatrix4(bindMatrixInverse);
                    tempVec.set(vSkin.x, vSkin.y, vSkin.z);
                }
                tempVec.multiplyScalar(scale);
                tempVec.applyMatrix4(mR);
                tempVec.add(modelPos);

                ndcVec.copy(tempVec).project(this.camera);
                // REMOVED REDUNDANT OFFSET: ndcVec.x += offset.x; ndcVec.y += offset.y;
                ndcVec.unproject(this.camera);

                const rayDir = ndcVec.sub(camPos).normalize();
                const numer = gridOrigin.clone().sub(camPos).dot(forward);
                const denom = rayDir.dot(forward);

                if (denom > 0.0001) {
                    const t = numer / denom;
                    const hit = camPos.clone().add(rayDir.multiplyScalar(t));
                    const local = hit.sub(gridOrigin);
                    const c = Math.round(local.dot(right) / gridSpacing + gridSide / 2);
                    const r = Math.round(local.dot(up) / gridSpacing + gridSide / 2);

                    for (let dx = -modelGapCells; dx <= modelGapCells; dx++) {
                        for (let dy = -modelGapCells; dy <= modelGapCells; dy++) {
                            const nc = c + dx; const nr = r + dy;
                            if (nc >= 0 && nc < gridSide && nr >= 0 && nr < gridSide) {
                                if (dx * dx + dy * dy <= modelGapCells * modelGapCells) {
                                    occupied[nr * gridSide + nc] = 1;
                                }
                            }
                        }
                    }
                }
            }

            // Pre-compute a lookup from buffer-slot → dipper star for O(1) detection
            const dipperBase = this._dipperBaseIndex;
            const dipperSlotToStar = new Map();
            // Also track which grid (row, col) are dipper positions so regular grid points
            // at those cells can be hidden (prevents double-star overlap).
            const dipperCells = new Set(); // "row,col" strings
            bigDipper.forEach((star, si) => {
                dipperSlotToStar.set(dipperBase + si, star);
                dipperCells.add(`${star.row},${star.col}`);
            });

            let lastYieldTime = performance.now();
            for (let i = modelPointCount; i < count; i++) {
                if (performance.now() - lastYieldTime > 16) {
                    await this.yieldToBrowser();
                    lastYieldTime = performance.now();
                }

                const dipperStar = dipperSlotToStar.get(i);

                if (dipperStar) {
                    // --- DIPPER TAIL SLOT: land at the star's defined grid (row, col) ---
                    // These slots are always in the grid range and morph correctly from sky → grid.
                    const sc = dipperStar.col;
                    const sr = dipperStar.row;
                    const xOff = (sc - gridSide / 2) * gridSpacing;
                    const yOff = (sr - gridSide / 2) * gridSpacing;
                    tempVec.copy(gridOrigin).addScaledVector(right, xOff).addScaledVector(up, yOff);
                    targetPositions[i * 3 + 0] = tempVec.x;
                    targetPositions[i * 3 + 1] = tempVec.y;
                    targetPositions[i * 3 + 2] = tempVec.z;
                    // Always visible — dipper stars should never be hidden by the model gap
                    targetSizeIsGrid[i * 2 + 0] = GRID_SIZE * 1.2;
                    targetSizeIsGrid[i * 2 + 1] = 2.0; // isGrid=true
                    // Preserve brightness from Chaos state
                    const brightness = (dipperStar.brightnessFactor || 1.0);
                    targetColors[i * 3 + 0] = brightness;
                    targetColors[i * 3 + 1] = brightness;
                    targetColors[i * 3 + 2] = brightness;
                } else {
                    const extraIndex = i - modelPointCount;
                    const col = extraIndex % gridSide;
                    const row = Math.floor(extraIndex / gridSide);
                    const xOffset = (col - gridSide / 2) * gridSpacing;
                    const yOffset = (row - gridSide / 2) * gridSpacing;
                    tempVec.copy(gridOrigin).addScaledVector(right, xOffset).addScaledVector(up, yOffset);

                    targetPositions[i * 3 + 0] = tempVec.x;
                    targetPositions[i * 3 + 1] = tempVec.y;
                    targetPositions[i * 3 + 2] = tempVec.z;

                    // Hide if this cell is occupied by a dipper star (tail-slot handles it)
                    const isDipperCell = dipperCells.has(`${row},${col}`);

                    if (isDipperCell || occupied[row * gridSide + col] === 1) {
                        targetSizeIsGrid[i * 2 + 0] = 0.0;
                        targetSizeIsGrid[i * 2 + 1] = 0.0;
                    } else {
                        let nearHalo = false;
                        const checkRad = 2;
                        for (let dx = -checkRad; dx <= checkRad; dx++) {
                            for (let dy = -checkRad; dy <= checkRad; dy++) {
                                const nc = col + dx; const nr = row + dy;
                                if (nc >= 0 && nc < gridSide && nr >= 0 && nr < gridSide) {
                                    if (occupied[nr * gridSide + nc] === 1) { nearHalo = true; break; }
                                }
                            }
                            if (nearHalo) break;
                        }
                        targetSizeIsGrid[i * 2 + 0] = GRID_SIZE;
                        targetSizeIsGrid[i * 2 + 1] = nearHalo ? 25.0 : 2.0;
                    }
                    targetColors[i * 3 + 0] = baseColorObj.r;
                    targetColors[i * 3 + 1] = baseColorObj.g;
                    targetColors[i * 3 + 2] = baseColorObj.b;
                }
            }
        } else {
            const range = scatterRangeGrid;
            let lastYieldTime = performance.now();
            const suctionMode = (name === SCENE_OBJECTS.CHAR);

            for (let i = modelPointCount; i < count; i++) {
                if (performance.now() - lastYieldTime > 16) {
                    await this.yieldToBrowser();
                    lastYieldTime = performance.now();
                }

                if (suctionMode) {
                    // SUCTION: Target points move toward the character center
                    // We use a small randomized volume within the character body
                    const suctionRadius = 1.0;
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.acos(Math.random() * 2.0 - 1.0);
                    const r = Math.pow(Math.random(), 0.5) * suctionRadius;
                    targetPositions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
                    targetPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
                    targetPositions[i * 3 + 2] = r * Math.cos(phi);
                } else {
                    // SCATTER: Original random scatter logic for other states (e.g. Chaos)
                    targetPositions[i * 3 + 0] = (Math.random() * 2.0 - 1.0) * range;
                    targetPositions[i * 3 + 1] = (Math.random() * 2.0 - 1.0) * range;
                    targetPositions[i * 3 + 2] = (Math.random() * 2.0 - 1.0) * range;
                }

                targetSizeIsGrid[i * 2 + 0] = 0.0;
                targetSizeIsGrid[i * 2 + 1] = 0.0;

                targetColors[i * 3 + 0] = baseColorObj.r;
                targetColors[i * 3 + 1] = baseColorObj.g;
                targetColors[i * 3 + 2] = baseColorObj.b;
            }

            // ENHANCEMENT: Set Radial Stagger behavior for CHAR state
            if (suctionMode) {
                const gridSide = Math.ceil(Math.sqrt(count));
                const maxRadius = (gridSide * gridSpacing) * 0.5;
                uniformOverrides.uDistStaggerFactor = { value: 1.0 };
                uniformOverrides.uDistStaggerMax = { value: maxRadius };
                uniformOverrides.uMorphStagger = { value: 0.8 };
            }

            // OPTION A: Anatomical Mapping for Hero Model (SCENE_OBJECTS.CHAR)
            // We map the Dipper stars (tail of the buffer) to landmark points on the model.
            if (name === SCENE_OBJECTS.CHAR && modelPointCount > 0) {
                const dipperBase = this._dipperBaseIndex;
                const landmarkBasis = [
                    0.45, // Star 0: Chest (Heart)
                    0.90, // Star 1: Eye L
                    0.92, // Star 2: Eye R
                    0.60, // Star 3: Shoulder L
                    0.65, // Star 4: Shoulder R
                    0.98, // Star 5: Head
                    0.25, // Star 6: Hand L
                    0.30  // Star 7: Hand R (Sirius)
                ];

                landmarkBasis.forEach((basis, dipperIdx) => {
                    const sourceIdx = Math.floor(modelPointCount * basis);
                    const destIdx = dipperBase + dipperIdx;

                    // 1. Position & Skinning
                    for (let d = 0; d < 3; d++) targetPositions[destIdx * 3 + d] = targetPositions[sourceIdx * 3 + d];
                    for (let d = 0; d < 4; d++) {
                        targetSkinIndices[destIdx * 4 + d] = targetSkinIndices[sourceIdx * 4 + d];
                        targetSkinWeights[destIdx * 4 + d] = targetSkinWeights[sourceIdx * 4 + d];
                    }

                    // 2. Normals
                    for (let d = 0; d < 3; d++) targetNormals[destIdx * 3 + d] = targetNormals[sourceIdx * 3 + d];

                    // 3. Visuals: Overwrite the 'hidden' scatter state from above
                    targetSizeIsGrid[destIdx * 2 + 0] = 1.0;
                    targetSizeIsGrid[destIdx * 2 + 1] = 0.0;

                    const baseCyan = GLOBAL_COLORS.ELECTRIC_CYAN;
                    // Mix with white for a "Starlight/Ice" look (adjusted for more cyan influence)
                    const starR = baseCyan.r * 0.5 + 0.5;
                    const starG = baseCyan.g * 0.5 + 0.5;
                    const starB = baseCyan.b * 0.5 + 0.5;

                    let brightness = 4.0;
                    if (dipperIdx === 0) brightness = 9.0; // Heart
                    if (dipperIdx === 1 || dipperIdx === 2) brightness = 6.0; // Eyes

                    const hotCore = (dipperIdx === 0 || dipperIdx === 1 || dipperIdx === 2) ? 0.5 : 0.0;

                    targetColors[destIdx * 3 + 0] = (starR + hotCore) * brightness;
                    targetColors[destIdx * 3 + 1] = (starG + hotCore) * brightness;
                    targetColors[destIdx * 3 + 2] = (starB + hotCore) * brightness;
                });
            }
        }


        // FIX: Ensure 'Chaos' or 'Root' target data has the Dipper Brightness
        // The loops above (Grid/Model) might have overwritten targetColors with 1.0.
        // We re-apply the overrides here to ensure they persist in the MorphData.
        if (name === 'Chaos' || name === 'Initial' || name === SCENE_OBJECTS.ROOT) {
            const gSide = Math.ceil(Math.sqrt(count)); // ROOT uses the full count for grid
            bigDipper.forEach((star) => {
                const index = star.row * gSide + star.col;
                if (index < count) {
                    const brightness = star.brightnessFactor || 1.0;
                    targetColors[index * 3 + 0] = brightness;
                    targetColors[index * 3 + 1] = brightness;
                    targetColors[index * 3 + 2] = brightness;
                }
            });
        }

        // Create new attributes
        const newTargetPosAttr = new THREE.Float32BufferAttribute(targetPositions, 3);
        const newTargetSizeIsGridAttr = new THREE.Float32BufferAttribute(targetSizeIsGrid, 2);
        const newTargetNormalAttr = new THREE.Float32BufferAttribute(targetNormals, 3);
        const newTargetColorAttr = new THREE.Float32BufferAttribute(targetColors, 3);

        // Define Skin Attributes
        const targetSkinIndicesAttr = new THREE.Float32BufferAttribute(targetSkinIndices, 4);
        const targetSkinWeightsAttr = new THREE.Float32BufferAttribute(targetSkinWeights, 4);

        const data = {
            targetPosAttr: newTargetPosAttr,
            targetSizeIsGridAttr: newTargetSizeIsGridAttr,
            targetNormalAttr: newTargetNormalAttr,
            targetColorAttr: newTargetColorAttr,
            targetSkinIndexAttr: targetSkinIndicesAttr,
            targetSkinWeightAttr: targetSkinWeightsAttr,
            targetSkeleton: foundSkeleton,
            targetBindMatrix: foundBindMatrix,
            targetBindMatrixInverse: foundBindMatrixInverse
        };

        this.addMorphData(name, data, modelUniforms);
    }

    createControlUI() {
        if (!this.options.enableControls) return;

        createUIFromModule({
            material: this.material,
            bloomPass: this.bloomPass,
            TWEEN,
            MORPH_DURATION,
            DEFAULT_VIBRATE_AMPLITUDE: 0.25,
            DEFAULT_SIZE_THRESHOLD: 0.1,
            DEFAULT_VIBRATE_BOOST_SIZE_THRESHOLD: 1.0,
            POINT_SIZE: 0.03,
            UI_WIDTH,
            UI_TOP,
            UI_RIGHT,
            speed: this.material.uniforms.uBaseRotateSpeed,
            hoverEffect: this.material.uniforms.uHoverRadius,
            mouseDamping,
            pointReturnSpeed,
            onStart: () => {
                const isGoingToModel = this.material.uniforms.uProgress.value < 0.5;
                const targetThreshold = isGoingToModel ? MODEL_SIZE_THRESHOLD : 0.1;

                new TWEEN.Tween(this.material.uniforms.uSizeThreshold)
                    .to({ value: targetThreshold }, MORPH_DURATION)
                    .easing(BACK_OUT_DEFAULT)
                    .start();
            },
            onComplete: () => {
                // Animation complete callback
            }
        });
    }

    onMouseMove(event) {
        let rect;
        // Try to find the container/element interaction area
        if (this.renderer.domElement) {
            rect = this.renderer.domElement.getBoundingClientRect();
        } else {
            rect = { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
        }

        const clientX = event.clientX;
        const clientY = event.clientY;

        // Calculate NDC based on container
        this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        this._mouseInCanvas = true;
        this.rawMouse.set(clientX, clientY);
        this.targetMouse.copy(this.mouse);
        this.lastMouseMoveTime = performance.now();

        if (this.isFirstMouseMove) {
            this.smoothMouse.copy(this.targetMouse);
            this.smoothRepulsionMouse.copy(this.targetMouse);
            this.isFirstMouseMove = false;
        }
    }

    onMouseLeave(event) {
        if (event && (event.relatedTarget === this.tooltip?.tooltip)) return;

        this.targetMouse.set(10000, 10000);
        this._mouseInCanvas = false;
        this.isFirstMouseMove = true;
    }

    onMouseClick(event) {
        // Limit to Three.js container only
        if (event && event.target !== this.renderer.domElement) return;

        // Recalculate NDC instantly from event to handle stale state or resized viewports
        if (event && this.renderer.domElement) {
            const rect = this.renderer.domElement.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        }

        // Limit ripple effect to Chaos (0) and Root states (1: POBA, 2: DEV)
        const currentIdx = this.getCurrentStep();
        const targetIdx = this.targetIndex; // Check the target index if morphing

        // Allow if current OR target is within the root states (0, 1, 2)
        if (currentIdx > 2 && targetIdx > 2) return;

        // Trigger pulse if a point is hovered (Excluding Step 2 Dance which uses clicks for animation switching)
        if (this.tooltip && this.tooltip.lastHoveredIndex !== -1 && currentIdx !== 2) {
            const idx = this.tooltip.lastHoveredIndex;

            // Safety Check: Avoid out-of-bounds access for special items like Knowhere
            if (idx === 999999) {
                // Future Knowhere explicit click interaction can go here
                return;
            }

            const geo = this.points.geometry;
            const mat = this.material;
            const uniforms = mat.uniforms;

            // 1. Get Base Raw Positions
            const startVec = new THREE.Vector3().fromBufferAttribute(geo.attributes.position, idx);
            const targetVec = new THREE.Vector3().fromBufferAttribute(geo.attributes.aTargetPos, idx);

            // 2. Extract Transformation State
            const progress = uniforms.uProgress.value;
            const scale = uniforms.uModelScale.value;
            const modelPos = uniforms.uModelPosition.value;
            const modelRot = uniforms.uModelRotation.value;
            const euler = new THREE.Euler(modelRot.x, modelRot.y, modelRot.z, 'XYZ');

            const forward = uniforms.uGridForward.value;
            const gridZ = uniforms.uGridZ.value;
            const baseZ = uniforms.uBaseGridZ.value;
            const gridShift = forward.clone().multiplyScalar(baseZ - gridZ);

            const startIsGrid = geo.attributes.aStartSizeIsGrid.array[idx * 2 + 1];
            const targetIsGrid = geo.attributes.aTargetSizeIsGrid.array[idx * 2 + 1];

            // 3. Staggered Progress (Match Shader logic exactly)
            const stagger = uniforms.uMorphStagger.value;
            const flightDuration = 0.5;
            const totalDuration = flightDuration + stagger;
            const currentGlobalTime = progress * totalDuration;
            const myDelay = geo.attributes.aStableRandom.array[idx] * stagger;
            const myEnd = myDelay + flightDuration;
            const localProgress = THREE.MathUtils.smoothstep(currentGlobalTime, myDelay, myEnd);

            // 4. Transform Start Position
            if (startIsGrid > 0.5) startVec.add(gridShift);
            else startVec.multiplyScalar(scale).applyEuler(euler).add(modelPos);

            // 5. Transform Target Position
            if (targetIsGrid > 0.5) targetVec.add(gridShift);
            else targetVec.multiplyScalar(scale).applyEuler(euler).add(modelPos);

            // 6. Final Interp (Morphed World Position)
            const hitPoint = startVec.lerp(targetVec, localProgress);
            hitPoint.applyMatrix4(this.points.matrixWorld);

            // 7. Grid Coordination Logs
            const modelPointCount = uniforms.uModelPointCount.value;
            const gridSide = uniforms.uGridSide.value;
            let row = -1, col = -1;
            if (idx >= modelPointCount) {
                const gridIdx = idx - modelPointCount;
                row = Math.floor(gridIdx / gridSide);
                col = gridIdx % gridSide;
            }

            // Set Trigger
            const slot = this.currentPulseIndex;
            uniforms.uPulseCenters.value[slot].copy(hitPoint);
            uniforms.uPulseStartTimes.value[slot] = uniforms.iTime.value;
            uniforms.uPulseDisplacementFactors.value[slot] = 0.0; // Default displacement for tooltip hits

            if (this.totalPulsesTriggered === undefined) this.totalPulsesTriggered = 0;
            this.totalPulsesTriggered++;
            uniforms.uActivePulseCount.value = Math.min(MAX_PULSE, this.totalPulsesTriggered);

            this.currentPulseIndex = (this.currentPulseIndex + 1) % MAX_PULSE;
            uniforms.uPulseactive.value = 1.0;
        }
        else if (this.raycaster) {
            // --- NEW: DANCE ANIMATION SWITCHING ---
            // If we are in the Dance state (step 2), clicking anywhere switches the hero's animation
            if (currentIdx === 2 && !this.isMorphing) {
                this.playNextDance();
                return;
            }

            // --- FALLBACK: CLICK ANYWHERE (Aligned Fallback) ---
            const uniforms = this.material.uniforms;
            const offset = uniforms.uModelScreenOffset ? uniforms.uModelScreenOffset.value : new THREE.Vector2(0, 0);
            const correctedMouse = this.mouse.clone().sub(offset);

            this.raycaster.setFromCamera(correctedMouse, this.camera);

            let hitPoint = null;
            const tempPlane = new THREE.Plane();

            // MATH SYNC: Normal must be exactly the Grid Forward for perfect alignment.
            const forward = uniforms.uGridForward.value;
            const normal = forward.clone().negate();

            // Calculate REAL dynamic world center of the grid plane
            const baseZ = uniforms.uBaseGridZ.value;
            const currentGridZ = uniforms.uGridZ.value;
            const shiftMag = (baseZ - currentGridZ);

            // The grid is fundamentally constructed at: forward * -baseZ
            const gridOrigin = forward.clone().multiplyScalar(-baseZ);
            const coplanarPoint = gridOrigin.clone().add(forward.clone().multiplyScalar(shiftMag));

            const curStep = this.getCurrentStep();
            const targetIdx = this.targetIndex;

            // Only use the grid depth in Chaos/Root states
            const isActiveState = (curStep <= 2 || targetIdx <= 2);
            if (isActiveState) {
                tempPlane.setFromNormalAndCoplanarPoint(normal, coplanarPoint);
            } else {
                // Secondary choice: camera-facing plane through origin for transitions
                const camNormal = new THREE.Vector3(0, 0, 1).applyQuaternion(this.camera.quaternion);
                tempPlane.setFromNormalAndCoplanarPoint(camNormal, new THREE.Vector3(0, 0, 0));
            }

            const virtualHit = new THREE.Vector3();
            if (this.raycaster.ray.intersectPlane(tempPlane, virtualHit)) {
                hitPoint = virtualHit;
            }

            if (hitPoint) {
                const slot = this.currentPulseIndex;
                uniforms.uPulseCenters.value[slot].copy(hitPoint);
                uniforms.uPulseStartTimes.value[slot] = uniforms.iTime.value;
                uniforms.uPulseDisplacementFactors.value[slot] = 0.0; // Default displacement for fallback hits

                if (this.totalPulsesTriggered === undefined) this.totalPulsesTriggered = 0;
                this.totalPulsesTriggered++;
                uniforms.uActivePulseCount.value = Math.min(MAX_PULSE, this.totalPulsesTriggered);

                this.currentPulseIndex = (this.currentPulseIndex + 1) % MAX_PULSE;
                uniforms.uPulseactive.value = 1.0;
            }
        }

    }


    onWindowResize() {
        let w, h;
        // Try to find the container we are rendering into
        if (this.renderer.domElement) {
            const rect = this.renderer.domElement.getBoundingClientRect();
            w = rect.width;
            h = rect.height;
        } else {
            w = this.renderer.domElement.clientWidth;
            h = this.renderer.domElement.clientHeight;
        }

        if (this.camera) {
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
        }

        if (this.renderer) {
            this.renderer.setSize(w, h);
            // this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }

        if (this.composer) {
            this.composer.setSize(w, h);
        }

        if (this.bloomPass) {
            this.bloomPass.resolution.set(w, h);
        }

        // --- NEW: Recalculate Static Title Mask Base ---
        this._updateTitleMaskBase();

        if (this.material) {
            // Use exact renderer drawing buffer size vs logical size? 
            // setSize sets logical CSS px. Shader usually wants logical px if using it for screen positions matching MouseEvent coords.
            this.material.uniforms.uResolution.value.set(w, h);
            this.material.uniforms.uPixelRatio.value = this.renderer.getPixelRatio();

            // Sync uFOV and uProjectionMultiplier on resize
            if (this.camera && this.material.uniforms.uFOV) {
                this.material.uniforms.uFOV.value = this.camera.fov;
                const multiplier = h / (2.0 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov) * 0.5));
                if (this.material.uniforms.uProjectionMultiplier) {
                    this.material.uniforms.uProjectionMultiplier.value = multiplier;
                }
            }

            // Also update the cached chaos uniforms so future clones are correct
            if (this.userData.chaosUniforms && this.userData.chaosUniforms.uResolution) {
                this.userData.chaosUniforms.uResolution.value.set(w, h);
                this.userData.chaosUniforms.uPixelRatio.value = this.renderer.getPixelRatio();
                if (this.camera) {
                    this.userData.chaosUniforms.uFOV.value = this.camera.fov;
                    const multiplier = h / (2.0 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov) * 0.5));
                    if (this.userData.chaosUniforms.uProjectionMultiplier) {
                        this.userData.chaosUniforms.uProjectionMultiplier.value = multiplier;
                    }
                }
            }
        }
    }

    /**
     * Pre-calculates the screen-space bounding box of the title in its "Root" state.
     * This is used by the vertex shader to carve out a hole for the text.
     */
    _updateTitleMaskBase() {
        if (!this.material || !this.material.uniforms.uTitleMaskRectBase) return;

        const board = document.getElementById('board');
        if (!board) return;

        // --- IMPROVED: Use REAL board for accurate screen-space measurement ---
        // Even if opacity is 0, offsetWidth/height and getBoundingClientRect() work.
        // This ensures the mask tracks the board's real position inside the experience-container.
        const b = board.getBoundingClientRect();
        const vh = window.innerHeight / 100;

        // Safety: If the board is display:none, it returns 0s. 
        if (b.width === 0 || b.height === 0) {
            // Fallback: If board is hidden (loading), we skip for now. 
            // scroll-pointsMorphScenario.js will update it during the first transition anyway.
            return;
        }

        // PADDING (Synchronized with scroll-pointsMorphScenario.js)
        const mLeft_vh = 4.5;
        const mRight_vh = -10.0;
        const mTop_vh = 3.0;
        const mBottom_vh = -0.75;

        const rectWidthVh = (b.width / vh) + mLeft_vh + mRight_vh;
        const rectHeightVh = (b.height / vh) + mTop_vh + mBottom_vh;
        const rectLeftVh = (b.left / vh) - mLeft_vh;
        const rectTopVh = (b.top / vh) - mTop_vh;

        const centerXVh = rectLeftVh + (rectWidthVh / 2.0);
        const centerYVh = 100.0 - (rectTopVh + (rectHeightVh / 2.0)); // WebGL space is bottom-up

        // Update the shader uniform
        this.material.uniforms.uTitleMaskRectBase.value.set(
            centerXVh * vh,
            centerYVh * vh,
            (rectWidthVh / 2.0) * vh,
            (rectHeightVh / 2.0) * vh
        );
    }

    update(shouldUpdateTween = true, shouldRender = true) {
        if (!this.isReady) return;

        // --- 0. Core Systems ---
        // REMOVED: Redundant TWEEN.update() (Consolidated to office.js main loop)
        if (this.controls && shouldRender) this.controls.update();

        if (this.mixer) {
            const delta = this.clock.getDelta();
            const currentStep = this.getCurrentStep();
            const isPointsScenario = this.scene && this.scene.scenarioState && this.scene.scenarioState.name === 'points';
            const isTransitioning = this.scene && (this.scene.isTransitioning || this.scene.isPersonaActive);

            this._mixerAccumulatedDelta = (this._mixerAccumulatedDelta || 0) + delta;

            // PERFORMANCE: Skip entirely if not in character-based states (Step 2: Dance / Step 3: Room Intro)
            // Skeleton skinning/matrix updates are the #1 CPU hog.
            // ENHANCEMENT: Also disable if we are not in the Points scenario!
            // FIX: Allow update during morphing to Step 2/3 to prevent snapping upon completion.
            const isMorphingToCharacter = this.isMorphing && this.targetIndex >= 2;
            let shouldUpdateMixer = (currentStep >= 2 || isMorphingToCharacter) && isPointsScenario;

            if (shouldUpdateMixer) {
                this.mixer.update(this._mixerAccumulatedDelta);
                this._mixerAccumulatedDelta = 0;

                // FIX: Keep the hidden GLTF model at the origin (0,0,0) to prevent double-counting transforms in the shader.
                // The shader manually applies uModelPosition/Rotation/Scale to BOTH Grid and Model points.
                // If we also move the model here, the bone matrices (matrixWorld) would include the offset,
                // causing a "Snap" (Double-offset) when the Mixer starts/stops.
                if (this.model) {
                    this.model.scale.setScalar(1.0);
                    this.model.position.set(0, 0, 0);
                    this.model.rotation.set(0, 0, 0);
                    this.model.updateMatrixWorld(true);
                }
            }
        }

        // --- NEW: HEAD BONE DEBUG LOGGING & SONIC WAKE (Dance State Interaction) ---
        if (this.getCurrentStep() === 2 && this.model) {
            if (!this._headBone) {
                this.model.traverse(node => {
                    if (node.isBone && node.name === "mixamorigHead") {
                        this._headBone = node;
                    }
                });
            }
            if (this._headBone) {
                const worldPos = new THREE.Vector3();
                this._headBone.getWorldPosition(worldPos);

                // --- FIX: Manually apply the Model transform to the bone position ---
                // Since we now keep this.model at (0,0,0), getWorldPosition() returns Model-Space coordinates.
                // We must apply the same transform used in the shader logic.
                const uniforms = this.material.uniforms;
                const uScale = uniforms.uModelScale.value;
                const uRot = uniforms.uModelRotation.value;
                const uPos = uniforms.uModelPosition.value;

                worldPos.multiplyScalar(uScale);
                worldPos.applyEuler(new THREE.Euler(uRot.x, uRot.y, uRot.z, 'XYZ'));
                worldPos.add(uPos);

                // Project to NDC space [-1, 1]
                const ndcPos = worldPos.project(this.camera);

                // Account for the model screen offset used in the shader logic
                if (uniforms.uModelScreenOffset) {
                    ndcPos.x += uniforms.uModelScreenOffset.value.x;
                    ndcPos.y += uniforms.uModelScreenOffset.value.y;
                }

                // Convert NDC (-1 to 1) to Screen Space (0 to 1)
                const screenX = (ndcPos.x + 1) / 2;
                const screenY = (1 - ndcPos.y) / 2;

                // Update Shader Uniforms
                uniforms.uBonePos.value.set(screenX, screenY);
                uniforms.uBoneIntensity.value = 1.0;
                uniforms.uBoneRadius.value = 0.18; // Slightly larger for better visual overlap

                // --- DOM INTERACTION (3D MONOLITH & SONIC WAKE) ---
                if (!this._boardItems) {
                    this._boardItems = document.querySelectorAll('.board-item');
                }

                if (this._boardItems.length > 0) {
                    // 1. PHYSICAL 3D TILT
                    // As character moves Left (screenX 0), tilt board Right (positive rotateY)
                    // As character moves Right (screenX 1), tilt board Left (negative rotateY)
                    const clampTiltX = (screenY - 0.5) * 15; // Vertical tilt based on character height
                    const clampTiltY = (0.5 - screenX) * 20; // Horizontal tilt follows character
                    const transform = `perspective(1200px) rotateX(${clampTiltX}deg) rotateY(${clampTiltY}deg)`;
                    
                    this._boardItems.forEach(item => {
                        item.style.transform = transform;
                    });
                }

                this._boardItems.forEach(item => {
                    const rect = item.getBoundingClientRect();

                    // Convert DOM rect to 0..1 coordinate system for comparison
                    const itemCenterX = (rect.left + rect.width / 2) / window.innerWidth;
                    const itemCenterY = (rect.top + rect.height / 2) / window.innerHeight;

                    // Proximity for Shine & Shake
                    const distX = Math.abs(screenX - itemCenterX);
                    const distY = Math.abs(screenY - itemCenterY);

                    // If character is vertically near the board and horizontally overlapping
                    const isNearY = screenY < 0.45;
                    const isNearX = distX < (rect.width / window.innerWidth) * 0.7;

                    if (isNearX && isNearY) {
                        // Activate Shake
                        item.classList.add('active-wake');

                        // Update Shine Position (Left to Right sweep)
                        // Local progress across the item: 0% at left edge, 100% at right edge
                        const localX = (screenX - (rect.left / window.innerWidth)) / (rect.width / window.innerWidth);
                        const shinePos = (localX * 120) - 20; // Scale to gradient range

                        item.style.setProperty('--shine-pos', `${shinePos}%`);
                        item.style.setProperty('--shine-opacity', '1');

                        // --- NEW: PHYSICAL STICKINESS (Only for Cyan Phili/Sub text) ---
                        if (item.id === 'board-philo') {
                            const res = uniforms.uResolution.value;
                            // Convert DOM Rect to WebGL screen pixels (bottom-up)
                            uniforms.uStickRect.value.set(
                                rect.left,
                                res.y - rect.bottom,
                                rect.right,
                                res.y - rect.top
                            );
                            uniforms.uStickStrength.value = 1.0;
                        }
                    } else {
                        item.classList.remove('active-wake');
                        item.style.setProperty('--shine-opacity', '0');

                        if (item.id === 'board-philo') {
                            uniforms.uStickStrength.value = 0.0;
                        }
                    }
                });
            }
        } else if (this.material && this.material.uniforms.uBoneIntensity) {
            // Fade out the intensity when leaving dance state
            this.material.uniforms.uBoneIntensity.value *= 0.9;
            if (this._boardItems) {
                this._boardItems.forEach(item => {
                    item.classList.remove('active-wake');
                    item.style.setProperty('--shine-opacity', '0');
                    item.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg)`;
                });
            }
            if (this.material && this.material.uniforms.uStickStrength) {
                this.material.uniforms.uStickStrength.value = 0.0;
            }
        }

        // --- 1. Global Shader States ---
        if (this.material) {
            const iTime = this.clock.getElapsedTime();
            this.material.uniforms.iTime.value = iTime;
        }

        // --- 2. Passive Visuals (Constellations) ---
        // Constellations manifest based on time and morph state - allowed during transitions
        if (this.dipperLines && this.material) {
            const prog = this.material.uniforms.uProgress.value;
            const iTime = this.material.uniforms.iTime.value;
            const isHUDOpen = this.scene?.HUD?.isOpen === true;

            const geo = this.points.geometry;
            const currentIndex = geo.morphCurrentIndex || 0;
            const targetIndex = geo.morphTargetIndex;
            const isMorphing = this.isMorphing;

            // Constellation logic
            let morphFade = 0.0;
            if (!isMorphing) {
                morphFade = (currentIndex === 0) ? 1.0 : 0.0;
            } else {
                if (currentIndex === 0) morphFade = 1.0 - prog;
                else if (targetIndex === 0) morphFade = prog;
            }

            morphFade = morphFade * morphFade * (3.0 - 2.0 * morphFade);
            const introFade = Math.min(1.0, Math.max(0.0, (iTime - 2.5) * 2.0));

            let dipperHoverOpacity = 0.0;
            if (this.tooltip && this.tooltip.lastHoveredIndex !== -1 && this._dipperPointIndices) {
                const hoverIdx = this.tooltip.lastHoveredIndex;
                const isDipperStar = this._dipperPointIndices.has(hoverIdx);
                const starNum = hoverIdx - this._dipperBaseIndex;
                if (isDipperStar && starNum >= 0 && starNum <= 6) {
                    dipperHoverOpacity = 1.0;
                }
            }
            this._dipperHoverSmoothed = (this._dipperHoverSmoothed || 0);
            this._dipperHoverSmoothed += (dipperHoverOpacity - this._dipperHoverSmoothed) * 0.15;

            const lineState = this.dipperLines.userData;
            const hudPath = lineState.opacity * (isHUDOpen ? 1.0 : 0.0);
            const hoverPath = this._dipperHoverSmoothed;
            const combinedBaseOpacity = Math.max(hudPath, hoverPath);
            const finalOpacity = combinedBaseOpacity * morphFade * introFade;

            this.dipperLines.material.uniforms.uOpacity.value = finalOpacity;
            // DRIVE progress by the maximum of the manual tween or the smoothed hover state
            this.dipperLines.material.uniforms.uDrawProgress.value = Math.max(lineState.drawProgress, this._dipperHoverSmoothed);
            this.dipperLines.material.uniforms.uTime.value = iTime;

            // --- 3. Interaction Phase (Gated by Performance) ---
            if (this.material && this.raycaster && this.camera && this.intersectionPlane) {
                const isTransitioning = this.scene && (this.scene.isPersonaActive || this.scene.isTransitioning);

                // --- 3a. Update Variables (Must run every frame for visual continuity) ---
                this.smoothMouse.x += (this.mouse.x - this.smoothMouse.x) * mouseDamping.value;
                this.smoothMouse.y += (this.mouse.y - this.smoothMouse.y) * mouseDamping.value;
                this.smoothRepulsionMouse.x += (this.mouse.x - this.smoothRepulsionMouse.x) * pointReturnSpeed.value;
                this.smoothRepulsionMouse.y += (this.mouse.y - this.smoothRepulsionMouse.y) * pointReturnSpeed.value;

                this.raycaster.setFromCamera(this.smoothMouse, this.camera);

                // --- 3a.1 TITILE MASKING ALREADY PRECALCULATED ---
                // We use uTitleMaskRectBase and uTitleMaskScale now.
                // The actual rectangle math is done purely in shaders.js to save JS CPU.


                this._perfSkipCounter = (this._perfSkipCounter || 0) + 1;
                const shouldRunThrottled = (this._perfSkipCounter % 3 === 0);
                const currentMorphIndex = this.points.geometry.morphCurrentIndex || 0;

                // --- 3b. Interaction Lock (Gated during Transitions) ---
                if (isTransitioning) {
                    if (this.tooltip) this.tooltip.hide();
                    if (this.material && this.material.uniforms.uHoveredIndex) {
                        this.material.uniforms.uHoveredIndex.value = -1.0;
                    }
                }

                // Check environment conditions for interactivity
                const isRootState = currentMorphIndex === 0 || currentMorphIndex === 1 || currentMorphIndex === 2;
                const isPointsScenario = this.scene && this.scene.scenarioState && this.scene.scenarioState.name === 'points';
                const isInteractive = isRootState && isPointsScenario && !isTransitioning;

                if (this.tooltip) {
                    // FIXED: Explicitly hide and block tooltip if morphing OR not in an interactive state OR blocked
                    const canUpdate = !this.isMorphing && isInteractive && shouldRender && this._mouseInCanvas && !this._raycastBlockedByOverlay;

                    if (canUpdate) {
                        this._tooltipFrameCount = (this._tooltipFrameCount || 0) + 1;
                        if (this._tooltipFrameCount % 3 === 0) {
                            this.tooltip.update(this.raycaster, this.points, this.material, this.smoothMouse, this.rawMouse, this.camera, this.renderer);
                            if (this.tooltip.lastHoveredIndex !== -1) {
                                this.points.geometry.lastClosestIndex = this.tooltip.lastHoveredIndex;
                                this.material.uniforms.uHoveredIndex.value = this.tooltip.lastHoveredIndex;
                            } else {
                                this.material.uniforms.uHoveredIndex.value = -1.0;
                            }
                        }
                    } else {
                        // Ensure it's hidden and states are reset
                        this.tooltip.hide();
                        this._tooltipFrameCount = 0;
                        if (this.material && this.material.uniforms.uHoveredIndex) {
                            this.material.uniforms.uHoveredIndex.value = -1.0;
                        }
                    }
                }

                // Global Hover (SIRIUS-like effect)
                // Enabled for both Root Poba (1) and Root Dev (2) states
                if ((currentMorphIndex === 1 || currentMorphIndex === 2) && this.material.uniforms.uGlobalHoverStrength && shouldRunThrottled) {
                    const isHovering = this.tooltip && this.tooltip.lastHoveredIndex !== -1 && this.tooltip.lastHoveredIndex !== 999999;
                    let targetStrength = 0.0;
                    if (isHovering) {
                        if (!this.hoverStartTime) this.hoverStartTime = performance.now();
                        if (performance.now() - this.hoverStartTime > 100) {
                            targetStrength = 1.0;
                            const idx = this.tooltip.lastHoveredIndex;
                            const isDipper = this._dipperPointIndices && this._dipperPointIndices.has(idx);

                            if (isDipper) {
                                // FIXED: Use constant texture slot for Dipper stars (no flickering)
                                const starIdx = idx - this._dipperBaseIndex;
                                const star = this.bigDipper[starIdx];
                                if (star) {
                                    const texSlot = (star.textureSlotRow || 0) * 8 + (star.textureSlotCol || 0);
                                    this.material.uniforms.uHoveredTextureIndex.value = texSlot;
                                }
                            } else {
                                const rnd = this.points.geometry.attributes.aStableRandom.array[idx];
                                const time = this.material.uniforms.iTime.value;

                                // Visual Flicker Logic (Synchronized with shaders.js line 708+)
                                const isChaos = this.material.uniforms.uIsChaos.value;
                                const isOtherState = 1.0 - isChaos;
                                const isGridFlag = this.points.geometry.attributes.aStartSizeIsGrid.array[idx * 2 + 1] > 0.5 ? 1.0 : 0.0;
                                const cycleLen = 6.0 + (isGridFlag * isOtherState * 4.0);

                                const totalTime = time + rnd * 10.0;
                                const buzzDuration = 0.75;
                                const cycle = totalTime % cycleLen;
                                const isBuzzPhase = cycle > (cycleLen - buzzDuration) ? 1.0 : 0.0;
                                const steppedTime = Math.floor((time * 13.33) + rnd) * isBuzzPhase;

                                // baseOffset logic from shader: floor(totalTime / cycleLen) * 13.0
                                const baseOffset = Math.floor(totalTime / cycleLen) * 13.0;

                                const finalTexIndex = Math.floor((rnd * 32.0) + steppedTime + baseOffset) % 32;

                                this.material.uniforms.uHoveredTextureIndex.value = finalTexIndex;
                            }
                        }
                    } else {
                        this.hoverStartTime = null;
                    }
                    this.material.uniforms.uGlobalHoverStrength.value += (targetStrength - this.material.uniforms.uGlobalHoverStrength.value) * 0.1;
                }

                // Intersection and Uniform updates
                const intersects = this.raycaster.intersectObject(this.intersectionPlane);
                if (intersects.length > 0 && shouldRunThrottled) {
                    this.material.uniforms.uMousePos.value.copy(intersects[0].point);
                }
                if (this.material.uniforms.uMouseNDC) this.material.uniforms.uMouseNDC.value.copy(this.smoothRepulsionMouse);

                if (this.material.uniforms.uMouseScreen) {
                    const res = this.material.uniforms.uResolution.value;
                    this.material.uniforms.uMouseScreen.value.set((this.smoothMouse.x * 0.5 + 0.5) * res.x, (this.smoothMouse.y * 0.5 + 0.5) * res.y);
                }

                // Rotation and Attraction
                if (!this.isMorphing && this.material.uniforms.uModelRotation && this.material.uniforms.uEnableMouseRotation?.value) {
                    const targetY = this.smoothMouse.x * -0.24;
                    this.material.uniforms.uModelRotation.value.y += (targetY - this.material.uniforms.uModelRotation.value.y) * 0.08;
                }

                if (shouldRunThrottled && this.model && currentMorphIndex >= 1 && shouldRender) {
                    const intersectsModel = this.raycaster.intersectObject(this.model, true);
                    const isOver = intersectsModel.length > 0;
                    const morphData = this._getMorphData(currentMorphIndex);
                    const targetForce = this.forceDisableAttraction ? 0.0 : (morphData?.targetUniforms?.uAttractionForce?.value || 0.0);
                    const currentForce = this.material.uniforms.uAttractionForce.value;
                    this.material.uniforms.uAttractionForce.value += ((isOver ? 0.0 : targetForce) - currentForce) * 0.1;
                    this._mouseWasOverModel = isOver;
                }
            }
        }

        // --- 4. Final Render ---
        if (shouldRender && this.composer) {
            this.composer.render();
        }
    }

    /**
     * Bakes the current geometry attributes into a binary file for faster loading.
     * Format: 
     * [Header Length (Uint32)]
     * [Header JSON string]
     * [Binary Data...]
     */
    bake() {
        if (!this.points || !this.points.geometry) {
            console.error("No geometry to bake!");
            return;
        }

        const geometry = this.points.geometry;
        const attributes = {};
        const buffers = [];
        let offset = 0;

        const excludedAttributes = [
            'aTargetPos',
            'aStartNormal', 'aTargetNormal',
            'aStartColor', 'aTargetColor',
            'aStartSizeIsGrid', 'aTargetSizeIsGrid'
        ];

        // 1. Collect Attributes
        for (const name in geometry.attributes) {
            if (excludedAttributes.includes(name)) continue;

            const attr = geometry.attributes[name];
            const array = attr.array;

            attributes[name] = {
                itemSize: attr.itemSize,
                count: attr.count,
                type: array.constructor.name, // Float32Array, Uint8Array etc
                byteLength: array.byteLength,
                offset: offset
            };

            buffers.push(array);
            offset += array.byteLength;
        }

        // 2. Prepare Header
        const header = JSON.stringify(attributes);
        const headerEncoder = new TextEncoder();
        const headerData = headerEncoder.encode(header);
        const headerLen = headerData.byteLength;

        // 3. create Final Buffer (HeaderSize + Header + Data)
        const totalSize = 4 + headerLen + offset;
        const finalBuffer = new Uint8Array(totalSize);
        const view = new DataView(finalBuffer.buffer);

        // Write Header Length
        view.setUint32(0, headerLen, true); // Little Endian

        // Write Header
        finalBuffer.set(headerData, 4);

        // Write Attribute Data
        let currentOffset = 4 + headerLen;
        for (const buf of buffers) {
            // Check type and copy bytes
            const bufView = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
            finalBuffer.set(bufView, currentOffset);
            currentOffset += buf.byteLength;
        }

        // 4. Download
        const blob = new Blob([finalBuffer], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'points_data.bin';
        link.click();
    }

    // OPTIMIZATION TOOL (TEMPORARY)
    optimizeAndBake() {
        if (!this.points || !this.points.geometry) return;

        const geometry = this.points.geometry;
        const newAttributes = {};
        const buffers = [];
        let offset = 0;

        // Helper to quantize Float32Array
        const quantized = (originalArray, type, normalized = false) => {
            // ... logic handled by constructor usually, but manual remapping needed for precision?
            // Actually, THREE.BufferAttribute/WebGL handles the int->float conversion if normalized=true.
            // We just need to pack the data: val * range.
            // Float 0..1 -> 0..255 (Uint8)
            // Float -1..1 -> -127..127 (Int8)

            let newArr;
            if (type === 'Uint8Array') newArr = new Uint8Array(originalArray.length);
            else if (type === 'Int8Array') newArr = new Int8Array(originalArray.length);
            else if (type === 'Uint16Array') newArr = new Uint16Array(originalArray.length);
            else return originalArray; // Fallback

            for (let i = 0; i < originalArray.length; i++) {
                let val = originalArray[i];
                if (type === 'Uint8Array') {
                    // Assert 0..1 range usually
                    // Special case: Stable Random (0..1) -> 255
                    // Color (0..1) -> 255
                    if (normalized) val = Math.max(0, Math.min(1, val)) * 255;
                    else val = val; // Raw cast
                } else if (type === 'Int8Array') {
                    // Assert -1..1 range (Normals)
                    if (normalized) val = Math.max(-1, Math.min(1, val)) * 127;
                }
                newArr[i] = val;
            }
            return newArr;
        };

        const excludedAttributes = [
            'aTargetPos',
            'aStartNormal', 'aTargetNormal',
            'aStartColor', 'aTargetColor',
            'aStartSizeIsGrid', 'aTargetSizeIsGrid'
        ];

        for (const name in geometry.attributes) {
            if (excludedAttributes.includes(name)) {
                continue;
            }

            const attr = geometry.attributes[name];
            let array = attr.array;
            let type = array.constructor.name;
            let normalized = false;

            // OPTIMIZATION RULES
            if (name.includes('Color') || name === 'aStableRandom' || name.includes('SkinW')) {
                // 0..1 -> Uint8 (Colors, Weights)
                array = quantized(attr.array, 'Uint8Array', true);
                type = 'Uint8Array';
                normalized = true;
            } else if (name.includes('Normal')) {
                // -1..1 -> Int8
                array = quantized(attr.array, 'Int8Array', true);
                type = 'Int8Array';
                normalized = true;
            } else if (name === 'aSpatialGridIndex') {
                // integers -> Uint8 (if grid < 256)
                array = quantized(attr.array, 'Uint8Array', false);
                type = 'Uint8Array';
                normalized = false;
            } else if (name === 'aPointData') {
                // PointData: x=Index(0-36k), y=Flag(0/1)
                // Fits in Uint16 (0-65535)
                array = quantized(attr.array, 'Uint16Array', false);
                type = 'Uint16Array';
                normalized = false;
            } else if (name === 'position') {
                // OPTION 1: HALF-FLOAT (16-bit)
                // Requires THREE.DataUtils.toHalfFloat()
                const f32 = attr.array;
                const f16 = new Uint16Array(f32.length);
                for (let i = 0; i < f32.length; i++) {
                    f16[i] = THREE.DataUtils.toHalfFloat(f32[i]);
                }
                array = f16;
                type = 'Uint16Array';
                normalized = false; // It's not 0..1, it's a float encoded as int
                // We will rely on custom hydration to treat this as Float16
            }

            newAttributes[name] = {
                itemSize: attr.itemSize,
                count: attr.count,
                type: type,
                byteLength: array.byteLength,
                offset: offset,
                normalized: normalized
            };

            buffers.push(array);
            offset += array.byteLength;
        }

        const header = JSON.stringify(newAttributes);
        const headerEncoder = new TextEncoder();
        const headerData = headerEncoder.encode(header);
        const headerLen = headerData.byteLength;

        const totalSize = 4 + headerLen + offset;
        const finalBuffer = new Uint8Array(totalSize);
        const view = new DataView(finalBuffer.buffer);

        view.setUint32(0, headerLen, true);
        finalBuffer.set(headerData, 4);

        let currentOffset = 4 + headerLen;
        for (const buf of buffers) {
            const bufView = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
            finalBuffer.set(bufView, currentOffset);
            currentOffset += buf.byteLength;
        }

        const blob = new Blob([finalBuffer], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'points_data_optimized.bin';
        link.click();
    }

    _initDipperLines() {
        const indicesSegments = [
            [0, 1], [1, 2], [2, 3], // Handle: Alkaid -> Mizar -> Alioth -> Megrez
            [3, 4], [4, 5], [5, 6], [6, 3] // Bowl: Megrez -> Phecda -> Merak -> Dubhe -> Megrez
        ];

        const gapRatio = 0.2;
        const thickness = 0.4; // Controlled width for "Premium" look

        const vertices = [];
        const indices = [];
        const uvs = [];
        const staggers = [];

        let vertexOffset = 0;

        indicesSegments.forEach(([startIdx, endIdx], staggerIndex) => {
            const startPos = chaosDipperConfig[startIdx].pos;
            const endPos = chaosDipperConfig[endIdx].pos;

            const dir = new THREE.Vector3().subVectors(endPos, startPos);
            const dist = dir.length();
            dir.normalize();

            const offset = dist * gapRatio;
            const p1 = new THREE.Vector3().copy(startPos).add(dir.clone().multiplyScalar(offset));
            const p2 = new THREE.Vector3().copy(endPos).sub(dir.clone().multiplyScalar(offset));

            // Calculate "Side" vector for thickness that faces the default camera position
            // This ensures the lines look thick from the starting view
            const cameraPos = new THREE.Vector3(CAMERA_POSITION.x, CAMERA_POSITION.y, CAMERA_POSITION.z);
            const viewDir = new THREE.Vector3().subVectors(p1, cameraPos).normalize();
            const side = new THREE.Vector3().crossVectors(dir, viewDir).normalize();

            const halfThick = thickness * 0.5;

            // 4 vertices per segment
            const v1 = p1.clone().addScaledVector(side, -halfThick);
            const v2 = p1.clone().addScaledVector(side, halfThick);
            const v3 = p2.clone().addScaledVector(side, -halfThick);
            const v4 = p2.clone().addScaledVector(side, halfThick);

            vertices.push(v1.x, v1.y, v1.z);
            vertices.push(v2.x, v2.y, v2.z);
            vertices.push(v3.x, v3.y, v3.z);
            vertices.push(v4.x, v4.y, v4.z);

            // UVs: x is across thickness (0 to 1), y is along length (0 to 1)
            uvs.push(0, 0, 1, 0, 0, 1, 1, 1);

            // Stagger attribute for sequential drawing
            const staggerVal = staggerIndex / indicesSegments.length;
            staggers.push(staggerVal, staggerVal, staggerVal, staggerVal);

            // 2 triangles
            indices.push(vertexOffset + 0, vertexOffset + 1, vertexOffset + 2);
            indices.push(vertexOffset + 2, vertexOffset + 1, vertexOffset + 3);

            vertexOffset += 4;
        });

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        geometry.setAttribute('aStagger', new THREE.Float32BufferAttribute(staggers, 1));
        geometry.setIndex(indices);

        const material = new THREE.ShaderMaterial({
            vertexShader: constellationVertexShader,
            fragmentShader: constellationFragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uOpacity: { value: 0.0 },
                uDrawProgress: { value: 0.0 }
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });

        this.dipperLines = new THREE.Mesh(geometry, material);
        this.dipperLines.frustumCulled = false;

        // Use userData for TWEEN tracking as before
        this.dipperLines.userData = {
            opacity: 0.0,
            drawProgress: 0.0
        };

        this.scene.add(this.dipperLines);
    }

    // --- PERSONA & STEP HELPERS ---

    getChaosIndex() {
        return 0; // The fixed index for Chaos/Constellation state
    }

    getCurrentStep() {
        if (!this.points || !this.points.geometry) return 0;
        return this.points.geometry.morphCurrentIndex || 0;
    }

    getRootIndex() {
        return (this._currentPersona === PERSONA_IDS.DEV) ? 2 : 1;
    }

    getCharIndex() {
        return 3;
    }

    syncPersona(mode, skipMorph = false) {
        this._currentPersona = mode;

        // --- NEW: PERSONA-BASED RIPPLE COLOR ---
        if (this.material && this.material.uniforms.uRippleColor) {
            const devInfo = MODEL_INFO.find(m => m.name === 'heartDev');
            const pobaInfo = MODEL_INFO.find(m => m.name === 'heart');
            if (devInfo && pobaInfo) {
                const targetColor = (mode === PERSONA_IDS.DEV) ? devInfo.baseColor : pobaInfo.baseColor;
                this.material.uniforms.uRippleColor.value.copy(targetColor);
            }
        }

        if (skipMorph) return;

        // If we are currently in or morphing to a ROOT state, update the target
        const currentIdx = this.getCurrentStep();
        const targetIdx = this.getRootIndex();

        // If we are targeting Step 1 or 2, we ALWAYS allow the sync, regardless of current state.
        // This allows Step 0 -> Step 1/2 transitions via avatar click.
        const isRootAffected = (targetIdx === 1 || targetIdx === 2);

        if (isRootAffected) {
            // ENHANCEMENT: Treat click as a target scroll morph
            // Requirement: Only trigger scroll morph if in 'points' scenario
            const isPointsScenario = window.scene && window.scene.scenarioState && window.scene.scenarioState.name === 'points';

            if (isPointsScenario && typeof this.triggerStep === 'function') {
                // If in Dance (2), Chaos (0), or Root (1) -> Click always brings user to Root (Step 1)
                const stepToTrigger = 1;
                console.log(`[Points] Avatar Switch -> Triggering Scroll Step ${stepToTrigger} for ${mode.toUpperCase()}`);
                this.triggerStep(stepToTrigger);
            } else {
                // Fallback to raw morph if in other scenarios or scroll-morph logic isn't initialized
                if (currentIdx !== targetIdx || this.isMorphing) {
                    this.morphToTarget(targetIdx);
                }
            }
        }
    }
    /**
     * Triggers a visual pulse on a specific Big Dipper star.
     * Index 0-7 refers to the stars in the bigDipper array defined at the top.
     */
    triggerStarPulse(dipperIdx) {
        if (!this.points || !this.material) return;
        const star = this.bigDipper[dipperIdx];
        if (!star) return;

        const idx = this._dipperBaseIndex + dipperIdx;
        const uniforms = this.material.uniforms;

        // 1. Calculate World Position of the star
        // This logic mimics the shader's grid-to-sky morphing
        const geo = this.points.geometry;
        const progress = uniforms.uProgress.value;
        const scale = uniforms.uModelScale.value;
        const modelPos = uniforms.uModelPosition.value;
        const modelRot = uniforms.uModelRotation.value;
        const euler = new THREE.Euler(modelRot.x, modelRot.y, modelRot.z, 'XYZ');

        const forward = uniforms.uGridForward.value;
        const gridZ = uniforms.uGridZ.value;
        const baseZ = uniforms.uBaseGridZ.value;
        const gridShift = forward.clone().multiplyScalar(baseZ - gridZ);

        const startVec = new THREE.Vector3().fromBufferAttribute(geo.attributes.position, idx);
        const targetVec = new THREE.Vector3().fromBufferAttribute(geo.attributes.aTargetPos, idx);

        const startIsGrid = geo.attributes.aStartSizeIsGrid.array[idx * 2 + 1];
        const targetIsGrid = geo.attributes.aTargetSizeIsGrid.array[idx * 2 + 1];

        // Staggered Progress
        const stagger = uniforms.uMorphStagger.value;
        const flightDuration = 0.5;
        const totalDuration = flightDuration + stagger;
        const currentGlobalTime = progress * totalDuration;
        const myDelay = geo.attributes.aStableRandom.array[idx] * stagger;
        const myEnd = myDelay + flightDuration;
        const localProgress = THREE.MathUtils.smoothstep(currentGlobalTime, myDelay, myEnd);

        if (startIsGrid > 0.5) startVec.add(gridShift);
        else startVec.multiplyScalar(scale).applyEuler(euler).add(modelPos);

        if (targetIsGrid > 0.5) targetVec.add(gridShift);
        else targetVec.multiplyScalar(scale).applyEuler(euler).add(modelPos);

        const hitPoint = startVec.clone().lerp(targetVec, localProgress);
        hitPoint.applyMatrix4(this.points.matrixWorld);

        // 2. Trigger the Shader Pulse
        const slot = this.currentPulseIndex;
        uniforms.uPulseCenters.value[slot].copy(hitPoint);
        uniforms.uPulseStartTimes.value[slot] = uniforms.iTime.value;
        uniforms.uPulseDisplacementFactors.value[slot] = 0.5; // Stronger displacement for programmatic hits

        if (this.totalPulsesTriggered === undefined) this.totalPulsesTriggered = 0;
        this.totalPulsesTriggered++;
        uniforms.uActivePulseCount.value = Math.min(MAX_PULSE, this.totalPulsesTriggered);

        this.currentPulseIndex = (this.currentPulseIndex + 1) % MAX_PULSE;
        uniforms.uPulseactive.value = 1.0;

        // 3. Set as Hovered to show tooltip if we want (optional, but let's at least highlight)
        uniforms.uHoveredIndex.value = idx;

        // Auto-clear highlight after a bit
        if (this._starHighlightTimeout) clearTimeout(this._starHighlightTimeout);
        this._starHighlightTimeout = setTimeout(() => {
            if (uniforms.uHoveredIndex.value === idx) uniforms.uHoveredIndex.value = -1.0;
        }, 1500);
    }

    /**
     * Controls the visibility of Big Dipper constellation lines.
     * @param {boolean} visible 
     */
    setConstellationVisibility(visible = true) {
        if (!this.dipperLines) return;
        if (this.dipperLines.tween) this.dipperLines.tween.stop();

        const targetOpacity = visible ? 1.0 : 0.0;
        const targetProgress = visible ? 1.0 : 0.0;
        const duration = visible ? 1500 : 800;
        const easing = visible ? TWEEN.Easing.Cubic.InOut : TWEEN.Easing.Cubic.Out;

        this.dipperLines.tween = new TWEEN.Tween(this.dipperLines.userData)
            .to({ opacity: targetOpacity, drawProgress: targetProgress }, duration)
            .easing(easing)
            .start();
    }
}