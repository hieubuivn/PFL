import * as THREE from 'three';
import * as CONSTANTS from '../utils/constant.js';
import { resources } from './loadResources.js';
import { GLOBAL_COLORS } from '../configs/sceneConfig.js';
import TWEEN from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/tween.module.min.js';
import { BACK_IN_OUT_DEFAULT, getBackInOut } from '../utils/customTween.js';
import { EVENTS } from '../configs/events.js';

// --- Single Source of Truth for HUD Configuration ---
export const HUD_CONFIG = {
    // Layout
    /** Percentage of screen height for uniform outer margin padding */
    MARGIN_PCT: 0.025,
    // MARGIN_PCT: 0.2,
    /** Additional vertical-only margin padding (percentage of screen height) */
    VERTICAL_MARGIN_PCT: 0.5,
    /** Length of the legs of the 45-degree corner chamfer (isosceles triangle) */
    CUT_SIZE: 0, // open: 10.0,
    /** Smoothing/inflation radius applied to all border corners */
    CORNER_RADIUS: 4.0,
    /** Gap distance between the main frame and the top-left "Island" tab */
    TL_GAP: 5.0,

    // Notches
    /** Width of the bottom notch relative to the Inner Mainland width */
    B_NOTCH_TO_MAIN_W_RATIO: 0.0,
    /** Vertical depth of the bottom notch relative to the Inner Mainland height */
    B_NOTCH_TO_MAIN_H_RATIO: 0.0,
    /** Slope angle of the bottom notch walls (in degrees) */
    NOTCH_ANGLE: 60.0,
    /** Height (vertical scale) of the right-side notch relative to the Inner Mainland height */
    R_NOTCH_TO_MAIN_H_RATIO: 0.,
    /** Horizontal depth of the side notch relative to the Inner Mainland width */
    R_NOTCH_TO_MAIN_W_RATIO: 0.,
    /** Slope angle of the side notch walls (in degrees) */
    RIGHT_NOTCH_ANGLE: 45.0,

    // Island
    // Island Head: The top parallelogram area containing the decorative diagonal patterns
    // Island Body: The lower vertical area containing the progress indicators
    /** Number of horizontal progress bars within the island body */
    ISL_BAR_COUNT: 2,
    /** Height (thickness) of each island progress bar relative to the Inner Mainland height */
    ISL_BAR_HEIGHT_RATIO: 0.005,
    /** Vertical space between island bars relative to the Inner Mainland height */
    ISL_BAR_GAP_RATIO: 0.01,
    /** Padding from the island border to the bar group (left edge) */
    ISL_BAR_MARGIN_LEFT_RATIO: 0.1,
    /** Padding from the island border to the bar group (right sloped edge) */
    ISL_BAR_MARGIN_RIGHT_RATIO: 0.4, //open: 0.02,
    /** Padding from the island border to the bar group (vertical) */
    ISL_BAR_MARGIN_Y_RATIO: 0.01,
    /** Individual progress ratios (0-1) for each bar */
    ISL_BAR_PROGRESS: [0.15, 0.42],
    /** Horizontal width of the top-left HUD island relative to the Inner Mainland width */
    ISL_TO_MAIN_W_RATIO: -1.0, // hide: -1.0, open: 0.32

    // Navigator
    NAV_COUNT: 6,
    /** Default visibility (0-1) */
    NAVIGATOR_VISIBILITY: 1,
    /** Width-to-Height ratio of each navigator button. Default 1.0 */
    NAV_BUTTON_WH_RATIO: 2.0,
    NAV_CV_BUTTON_WH_RATIO: 1.0, // Specific for CV icon
    NAV_GAP: 5.0,
    NAV_FILL_OPACITY: 0.15,



    // Animation Durations
    /** Time (sec) for the electricity to complete one full frame circuit */
    DUR_FILL: 1.0,
    /** Time (sec) the electricity stays fully circuitous before wiping */
    DUR_HOLD: 0.5,
    /** Time (sec) for the clockwise erasure animation */
    DUR_WIPE: 0.25,
    /** Time (sec) to wait between animation cycles */
    DUR_PAUSE: 0.25,
    /** Radial velocity of the tracker diamond rotation */
    DIAMOND_ROT_SPEED: 5.0,

    // Visuals
    /** GLSL vector for the primary cyan theme color */
    BORDER_COLOR: GLOBAL_COLORS.ELECTRIC_CYAN,
    /** GLSL vector for the subtle background fill behind the frame */
    OUTSIDE_COLOR: new THREE.Color(0., 0.0, 0.),
    /** Base thickness of the border outlines relative to screen height */
    BORDER_THICK_RATIO: 0.075,
    /** Pixel width for individual strips in the tab's diagonal pattern */
    PATTERN_WIDTH: 10.0,
    /** Pixel gap between individual strips in the tab pattern */
    PATTERN_GAP: 4.0,
    /** Pixel thickness of the stripes in the tab pattern */
    PATTERN_LINE_THICK: 1.0,
    /** Vertical proportion (0-1) of the tab occupied by the pattern */
    PATTERN_HEIGHT_PCT: 0.75,
    /** World-space size of the background grid cells (Passed as Uniform) */
    BG_GRID_SIZE: 60.0,
    /** Pixel thickness of the background grid lines (Passed as Uniform) */
    GRID_LINE_THICKNESS: 0.6,
    /** Speed of the stroboscopic pulse animation */
    GRID_PULSE_SPEED: 1.0,
    /** Density/Frequency of the stroboscopic pulse pattern */
    GRID_PULSE_DENSITY: 1.0,

    // Right Notch Progress Bar

    R_NOTCH_BAR_THICKNESS: 0.0002,
    /** Size of the decorative diamonds at the ends of the progress bar */
    R_NOTCH_BAR_DIAMOND_SIZE: 0.00125,
    /** Individual progress ratio (0-1) */
    R_NOTCH_BAR_PROGRESS: 0.75,
    /** GLSL vector color for the active "filled" state of the bar */
    R_NOTCH_BAR_ACTIVE_COLOR: GLOBAL_COLORS.ELECTRIC_CYAN,
    /** GLSL vector color for the inactive / base state of the bar */
    R_NOTCH_BAR_INACTIVE_COLOR: GLOBAL_COLORS.ACCENT_GOLD,
    // Expanded State Targets
    R_NOTCH_H_RATIO: 0.4,
    R_NOTCH_W_RATIO: 0.02,

    // Bottom Notch Progress Bar
    B_NOTCH_BAR_PROGRESS: 1.0,
    B_NOTCH_BAR_ALPHA: 0.0,
    B_NOTCH_BAR_MARGIN_X: 0.2, // Value used to control width
    B_NOTCH_BAR_MARGIN_Y: 0.45, // Offset relative to vertical zone height
    B_NOTCH_BAR_COLOR: GLOBAL_COLORS.ELECTRIC_CYAN,
    // Electricity
    /** Scroll speed of the noise-based electrical flicker */
    ELEC_SPEED: 256.0,
    /** Spatial detail/tightness of the electrical noise pattern */
    ELEC_FREQUENCY: 4.0,
    /** Glow intensity multiplier for the electrical effects */
    ELEC_INTENSITY: 2.0,
    /** Screen-pixel size of the animated tracker icons */
    HEAD_SPRITE_SIZE: 0.0,  //initially hidden
    /** Target index in the spritesheet for the electricity head */
    SPRITE_INDEX: 26.0,
    /** Columns in the system spritesheet */
    SPRITE_COLS: 8.0,
    /** Rows in the system spritesheet */
    SPRITE_ROWS: 4.0,
    /** Scale multiplier for the electricity head sprite */
    HEAD_SCALE: 1.0,

    // Grid Surge Specifics
    /** Pixel size of the square grid cells during power surge */
    SURGE_GRID_SIZE_PX: 60.0,
    /** Pixel thickness of the surge grid wirelines (thin for high-tech look) */
    SURGE_GRID_THICK_PX: 0.4,
    /** Expansion speed of the central energy rings */
    RING_SPEED: 4.0,
    /** Visual intensity multiplier for the rings */
    RING_INTENSITY: 0.01,
    /** Strength of the flower glow effect when hovered */
    FLOWER_GLOW_HOVER: 1.5,
    GARDEN_HOVER_GRAVITY_MULT: -1.0, // Simply flips the force direction (50 -> -50, -2000 -> 2000)
    GARDEN_HOVER_TWEEN_DUR: 2500,      // Ultra-slow cinematic buildup
    /** Base strength of the flower glow effect when not hovered */
    FLOWER_GLOW_BASE: 1.,
    /** GLSL vector for the base flower color */
    FLOWER_COLOR: GLOBAL_COLORS.ELECTRIC_CYAN,
    /** Rotation of the garden flowers in radians */
    FLOWER_ROTATION: Math.PI / 2, //initially hidden
    /** Scale of the garden flowers */
    FLOWER_SCALE: 0.1,//2.19,
    /** Whether the garden is in Flower mode (1.0) or Grok mode (0.0) */
    GARDEN_IS_FLOWER: 0.0,
    /** Scale factor for the Grok pattern (percentage of garden height) */
    GROK_SCALE_FACTOR: 0.0,
    /** Vertical offset for the Grok pattern (-1: bottom, 0: center, 1: top) */
    GROK_OFFSET_Y: 0.0,

    // Beam Effect
    BEAM_SPEED: 30.0,
    BEAM_FREQ: 0.512,
    BEAM_MAX_HEIGHT: 0.03,
    BEAM_WAVE_THICKNESS: 0.0012,
    BEAM_BASE_THICKNESS: 0.001,
    BEAM_TRIM_RATIO: 0.99,
    BEAM_GROWTH: 1.0,
    BEAM_ATTACH_RATIO: 1.0, // 0: Top (Start), 1: Bottom (End)
    BEAM_BLOOM: 1.5,
    BEAM_WOBBLE: 0.0,
    BEAM_GLOW_STRENGTH: 0.05,
    BEAM_COLOR: GLOBAL_COLORS.ELECTRIC_CYAN,
    // Breathing
    /** The idle background pulse intensity (0-1) */
    BREATH_AUTO_STRENGTH: 0.15,
    /** The strength of the triggered/manual pulse (0-1) */
    BREATH_MANUAL_STRENGTH: 0.2,
};

export const HUD_CONFIG_SCENARIO = {
    // FLOWER_SCALE: 0.0,
    'hideDeco': {
        FLOWER_ROTATION: Math.PI / 2,
        HEAD_SPRITE_SIZE: 0.0,
    },
    'showDeco': {
        FLOWER_ROTATION: 0.0,
        // HEAD_SPRITE_SIZE: 16.0,
    }
};
// --- Adaptive HUD Rules ---
/**
 * Helper to convert THREE.Color to GLSL vec3 string for shader templates
 */
const toVec3 = (color) => {
    return `vec3(${color.r.toFixed(4)}, ${color.g.toFixed(4)}, ${color.b.toFixed(4)})`;
};

const HUD_ADAPTIVE_CONFIG = {
    FPS: {
        PERFECT: 60,
        GOOD: 54,
        NORMAL: 24,
        BAD: 0
    },
    COLORS: {
        BAD: toVec3(GLOBAL_COLORS.CRIMSON_RED) // Use Global Crimson Red
    }
};


/**
 * Adds a persistent HUD plane as a child of the camera.
 */
export function addHUDFrame(scene) {
    const camera = scene.camera;
    const geometry = new THREE.PlaneGeometry(1, 1);

    const totalCycleTime = HUD_CONFIG.DUR_FILL + HUD_CONFIG.DUR_HOLD + HUD_CONFIG.DUR_WIPE + HUD_CONFIG.DUR_PAUSE;

    // --- Dynamic CSS variable sync (Avoid Hardcoding) ---
    // Margin_Pct (0.025 * 100vh = 2.5vh) - Corner_Radius (4px)
    const updateCSSMetrics = () => {
        const root = document.documentElement;
        const resY = window.innerHeight;
        const vMarginVal = resY * (HUD_CONFIG.MARGIN_PCT + uniforms.uVerticalMarginPct.value);
        const mh = resY - 2.0 * vMarginVal;

        const islBodyH = mh * (
            HUD_CONFIG.ISL_BAR_MARGIN_Y_RATIO * 2.0 +
            2.0 * HUD_CONFIG.ISL_BAR_HEIGHT_RATIO +
            1.0 * HUD_CONFIG.ISL_BAR_GAP_RATIO
        );
        const cutSize = uniforms.uCutSize.value || 10.0;
        const islH = cutSize + islBodyH - HUD_CONFIG.CORNER_RADIUS;

        const islHVh = (islH / resY) * 100;
        const vMarginVh = (vMarginVal / resY) * 100;

        // Expose for other systems (JS)
        hudPlane.islandHeightVh = islHVh;
        hudPlane.islandTopVh = vMarginVh;

        root.style.setProperty('--hud-island-height-vh', `${islHVh}vh`);
        root.style.setProperty('--hud-island-top-vh', `${vMarginVh}vh`);
        root.style.setProperty('--hud-island-bottom-vh', `${vMarginVh + islHVh}vh`);

        const visibleMargin = `${HUD_CONFIG.MARGIN_PCT * 100}vh`;
        root.style.setProperty('--hud-margin-visible', visibleMargin);
        root.style.setProperty('--hud-text-nudge', '0.1vh');
    };
    // Initialization moved below hudPlane creation to avoid TDZ for 'uniforms' and 'hudPlane'
    window.addEventListener('resize', updateCSSMetrics);

    const uniforms = {
        ...(scene.globalUniformsHub.uniforms),
        uPosStart: { value: new THREE.Vector2() },
        uPosHead: { value: new THREE.Vector2() },
        uDiamondRot: { value: new THREE.Vector2(1, 0) },
        uSpriteSheet: { value: resources.spriteSheet },
        uMarginPct: { value: HUD_CONFIG.MARGIN_PCT },
        uVerticalMarginPct: { value: HUD_CONFIG.VERTICAL_MARGIN_PCT },
        uIslToMainWRatio: { value: HUD_CONFIG.ISL_TO_MAIN_W_RATIO },

        uBNotchWRatio: { value: 0.0 },
        uBNotchHRatio: { value: 0.0 },
        uRNotchHRatio: { value: 0.0 },
        uRNotchWRatio: { value: 0.0 },
        uCutSize: { value: 0.0 },
        uIsAutoElec: { value: 0.0 },
        uElecStartTime: { value: 0.0 },
        uHeadSpriteSize: { value: HUD_CONFIG.HEAD_SPRITE_SIZE },

        // Island Bar Uniforms
        uIslBarHeightRatio: { value: HUD_CONFIG.ISL_BAR_HEIGHT_RATIO },
        uIslBarGapRatio: { value: HUD_CONFIG.ISL_BAR_GAP_RATIO },
        uIslBarMarginLeftRatio: { value: HUD_CONFIG.ISL_BAR_MARGIN_LEFT_RATIO },
        uIslBarMarginRightRatio: { value: HUD_CONFIG.ISL_BAR_MARGIN_RIGHT_RATIO },
        uIslBarMarginYRatio: { value: HUD_CONFIG.ISL_BAR_MARGIN_Y_RATIO },
        uIslBarProgress1: { value: HUD_CONFIG.ISL_BAR_PROGRESS[0] },
        uIslBarProgress2: { value: HUD_CONFIG.ISL_BAR_PROGRESS[1] },
        // Visual Uniforms
        // Visual Uniforms
        uBorderThickRatio: { value: HUD_CONFIG.BORDER_THICK_RATIO },
        uGridThickness: { value: HUD_CONFIG.GRID_LINE_THICKNESS },
        uGridSize: { value: HUD_CONFIG.BG_GRID_SIZE },
        uGridPulseSpeed: { value: HUD_CONFIG.GRID_PULSE_SPEED },
        uGridPulseDensity: { value: HUD_CONFIG.GRID_PULSE_DENSITY },
        uOutsideColor: { value: new THREE.Color(0, 0, 0) },
        uRNotchBarProgress: { value: HUD_CONFIG.R_NOTCH_BAR_PROGRESS },
        uRNotchBarThickness: { value: HUD_CONFIG.R_NOTCH_BAR_THICKNESS },
        uRNotchBarActiveColor: { value: HUD_CONFIG.R_NOTCH_BAR_ACTIVE_COLOR.clone() },
        uRNotchBarInactiveColor: { value: HUD_CONFIG.R_NOTCH_BAR_INACTIVE_COLOR.clone() },
        uBreathIntensity: { value: 0.0 }, // 0.0 = Default Auto, 1.0 = Manual Boost
        uBreathColor: { value: GLOBAL_COLORS.ELECTRIC_CYAN.clone() },
        uBreathAutoStrength: { value: HUD_CONFIG.BREATH_AUTO_STRENGTH },
        uBreathManualStrength: { value: HUD_CONFIG.BREATH_MANUAL_STRENGTH },

        // Flower / Firefly Uniforms
        uFlyCount: { value: 200.0 },
        uFlySpeed: { value: 1.0 },
        uFlowerWind: { value: 0.02 },
        uFlowerScale: { value: HUD_CONFIG.FLOWER_SCALE },
        uFlowerNotchPos: { value: new THREE.Vector2(0.92, 0.075) },
        uFlowerGlow: { value: HUD_CONFIG.FLOWER_GLOW_BASE },
        uKnowhereGravityHoverMultiplier: { value: HUD_CONFIG.GARDEN_HOVER_GRAVITY_MULT },
        uFlowerColor: { value: HUD_CONFIG.FLOWER_COLOR.clone() },
        uFlowerRotation: { value: HUD_CONFIG.FLOWER_ROTATION },
        uFlowerGlitch: { value: 0.0 },
        uGridLock: { value: 0.0 },
        uRNotchVibeB: { value: 0.0 },
        uRNotchVibeT: { value: 0.0 },
        uBNotchBarProgress: { value: HUD_CONFIG.B_NOTCH_BAR_PROGRESS },
        uBNotchBarAlpha: { value: HUD_CONFIG.B_NOTCH_BAR_ALPHA },
        uBNotchBarMarginX: { value: 1.0 },
        uBNotchBarMarginY: { value: 0.45 },
        uBNotchBarColor: { value: HUD_CONFIG.B_NOTCH_BAR_COLOR.clone() },
        uBeamMaxHeight: { value: 0.0 },
        uBeamWaveThickness: { value: HUD_CONFIG.BEAM_WAVE_THICKNESS },
        uBeamBaseThickness: { value: 0.0 },
        uBeamBloom: { value: HUD_CONFIG.BEAM_BLOOM },
        uBeamWobble: { value: HUD_CONFIG.BEAM_WOBBLE },
        uBeamGlowStrength: { value: HUD_CONFIG.BEAM_GLOW_STRENGTH },
        uBeamSpeed: { value: HUD_CONFIG.BEAM_SPEED },
        uBeamFreq: { value: HUD_CONFIG.BEAM_FREQ },
        uBeamTrimRatio: { value: HUD_CONFIG.BEAM_TRIM_RATIO },
        uBeamGrowth: { value: 0.0 },
        uBeamAttachRatio: { value: HUD_CONFIG.BEAM_ATTACH_RATIO },
        uBeamColor: { value: HUD_CONFIG.BEAM_COLOR.clone() },
        uRBarPos: { value: new THREE.Vector2(0, 0) },
        uRBarRot: { value: 0.0 },
        uBBarPos: { value: new THREE.Vector2(0, 0) },
        uBBarRot: { value: 0.0 },
        // Island Bars Physics
        uIslBar1Pos: { value: new THREE.Vector2(0, 0) },
        uIslBar1Rot: { value: 0.0 },
        uIslBar2Pos: { value: new THREE.Vector2(0, 0) },
        uIslBar2Rot: { value: 0.0 },
        uNavCount: { value: HUD_CONFIG.NAV_COUNT },
        uNavGap: { value: HUD_CONFIG.NAV_GAP },
        uNavigatorVisibility: { value: HUD_CONFIG.NAVIGATOR_VISIBILITY },
        uNavVis: { value: new Float32Array([0, 0, 0, 0, 0, 0]) }, // Initial all hidden
        uNavWH: { value: new Float32Array([1.0, 2.0, 2.0, 2.0, 0.0, 0.0]) }, // Slot 0 is CV (Square)
        uHeadScale: { value: HUD_CONFIG.HEAD_SCALE },
        uIsGardenFlower: { value: HUD_CONFIG.GARDEN_IS_FLOWER },
        uGrokScaleFactor: { value: HUD_CONFIG.GROK_SCALE_FACTOR },
        uGrokOffsetY: { value: HUD_CONFIG.GROK_OFFSET_Y }
    };

    const hudVertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            // Map 1x1 plane (-0.5 to 0.5) directly to clip space (-1 to 1) 
            // bypassing projection and modelView matrices for a perfectly fixed HUD.
            gl_Position = vec4(position.x * 2.0, position.y * 2.0, 0.0, 1.0);
        }
    `;

    const frameMaterial = new THREE.ShaderMaterial({
        vertexShader: hudVertexShader,
        fragmentShader: getHUDFrameFS(),
        transparent: true,
        uniforms: uniforms,
        blending: THREE.NormalBlending,
        depthTest: false,
        depthWrite: false,
        side: THREE.FrontSide
    });

    const hudPlane = new THREE.Mesh(geometry, frameMaterial);
    hudPlane.name = 'HUDFrame';
    hudPlane.frustumCulled = false; // Prevent culling as the origin is at the camera eye point
    hudPlane.renderOrder = 9999;     // Ensure it renders on top of everything
    hudPlane.isOpen = false;
    scene.HUD = hudPlane;

    // Initialize CSS metrics now that uniforms and hudPlane are ready
    updateCSSMetrics();

    // --- JS Side SDF Helpers (Using HUD_CONFIG) ---
    const hash = (n) => {
        const x = Math.sin(n) * 43758.5453123;
        return x - Math.floor(x);
    };

    const getNotchDist = (px, py, width, height, angle) => {
        const ax = Math.abs(px);
        const angleRad = (angle * Math.PI) / 180;
        const nWallX = Math.sin(angleRad);
        const nWallY = Math.cos(angleRad);
        const dWall = (ax - width * 0.5) * nWallX + py * nWallY;
        const dTop = py - height;
        return Math.max(dWall, dTop);
    };

    const sdIslandShape = (px, py, boxSizeX, boxSizeY, islH, islW, tlCut) => {
        const top = boxSizeY;
        const left = -boxSizeX;
        const dTop = py - top;
        const dLeft = -(px - left);
        const dBottom = -(py - (boxSizeY - islH));
        const dTL = (px - (left + tlCut)) * -0.7071 + (py - top) * 0.7071;
        const dRight = (px - (left + islW)) * 0.7071 + (py - top) * -0.7071;
        const dShape = Math.max(Math.max(dTop, dLeft), dBottom);
        return Math.max(Math.max(dShape, dRight), dTL);
    };



    const sdMainFrame = (px, py, boxSizeX, boxSizeY, resX, resY) => {
        const dBoxX = Math.abs(px) - boxSizeX;
        const dBoxY = Math.abs(py) - boxSizeY;
        const dBox = Math.max(dBoxX, dBoxY);

        let dCorner = (Math.abs(px) + Math.abs(py) - (boxSizeX + boxSizeY - uniforms.uCutSize.value)) * 0.7071;
        if (px > 0 && py > 0) dCorner = -1e5; // Perfect 90 degree corner (no chamfer)

        let dFrame = Math.max(dBox, dCorner) - HUD_CONFIG.CORNER_RADIUS;

        const mw = boxSizeX * 2.0;
        const mh = boxSizeY * 2.0;

        const bNotchW = mw * uniforms.uBNotchWRatio.value;
        const bNotchH = mh * uniforms.uBNotchHRatio.value;
        const dNotchBottom = getNotchDist(px, py + boxSizeY, bNotchW, bNotchH, HUD_CONFIG.NOTCH_ANGLE);

        const rNotchW = mh * uniforms.uRNotchHRatio.value;
        const rNotchH = mw * uniforms.uRNotchWRatio.value;
        const dNotchRight = getNotchDist(py, boxSizeX - px, rNotchW, rNotchH, HUD_CONFIG.RIGHT_NOTCH_ANGLE);

        dFrame = Math.max(dFrame, -Math.min(dNotchBottom, dNotchRight));

        // Left Island Socket
        const islBodyH = mh * (
            (uniforms.uIslBarMarginYRatio.value * 2.0) +
            (2.0 * uniforms.uIslBarHeightRatio.value) +
            (1.0 * uniforms.uIslBarGapRatio.value)
        );
        const islH = uniforms.uCutSize.value + islBodyH - HUD_CONFIG.CORNER_RADIUS;
        const islW = mw * uniforms.uIslToMainWRatio.value;
        const dIslandHard = sdIslandShape(px, py, boxSizeX, boxSizeY, islH, islW, uniforms.uCutSize.value);
        const dSocket = (dIslandHard - HUD_CONFIG.TL_GAP) - HUD_CONFIG.CORNER_RADIUS;

        return Math.max(dFrame, -dSocket);
    };

    const snapToSurface = (px, py, boxSizeX, boxSizeY, resX, resY) => {
        let x = px, y = py;
        for (let i = 0; i < 3; i++) {
            const d = sdMainFrame(x, y, boxSizeX, boxSizeY, resX, resY);
            const eps = 0.05;
            const dx = (sdMainFrame(x + eps, y, boxSizeX, boxSizeY, resX, resY) - sdMainFrame(x - eps, y, boxSizeX, boxSizeY, resX, resY)) / (2 * eps);
            const dy = (sdMainFrame(x, y + eps, boxSizeX, boxSizeY, resX, resY) - sdMainFrame(x, y - eps, boxSizeX, boxSizeY, resX, resY)) / (2 * eps);
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            x -= (dx / len) * d;
            y -= (dy / len) * d;
        }
        return { x, y };
    };

    const getChamferedPoint = (angle, boxSizeX, boxSizeY, cutSize, radius) => {
        const rdX = Math.sin(angle);
        const rdY = Math.cos(angle);
        const absRdX = Math.abs(rdX);
        const absRdY = Math.abs(rdY);
        const targetBoxX = boxSizeX + radius;
        const targetBoxY = boxSizeY + radius;
        const tBox = Math.min(targetBoxX / Math.max(absRdX, 0.0001), targetBoxY / Math.max(absRdY, 0.0001));
        const distSharp = (boxSizeX + boxSizeY - cutSize) * 0.70710678;
        const distInflated = distSharp + radius;
        const denom = (absRdX + absRdY) * 0.70710678;
        const tChamfer = distInflated / Math.max(denom, 0.0001);
        let t = Math.min(tBox, tChamfer);

        // Ignore chamfer path in top-right quadrant (rdX > 0, rdY > 0)
        if (rdX > 0 && rdY > 0) t = tBox;

        return { x: rdX * t, y: rdY * t };
    };

    let lastFpsUpdateTime = performance.now();
    let frameCountSinceUpdate = 0;
    let currentFps = 60;

    const _phyCorners = [new THREE.Vector2(), new THREE.Vector2()];

    const barPhysicsR = {
        pos: new THREE.Vector2(0, 0),
        vel: new THREE.Vector2(0, 0),
        rot: 0.0,
        angVel: 0.0,
        isActive: false,
        shouldSnapToAnchor: true,
        mass: 1.0,
        getMOI: (bl) => (1 / 12) * 1.0 * Math.pow(bl * 2, 2)
    };

    const barPhysicsB = {
        pos: new THREE.Vector2(0, 0),
        vel: new THREE.Vector2(0, 0),
        rot: 0.0,
        angVel: 0.0,
        isActive: false,
        shouldSnapToAnchor: true,
        mass: 2.0, // Heavier than side stick
        getMOI: (w, h) => (1 / 12) * 2.0 * (w * w + h * h)
    };

    // Island Bars Physics
    const barPhysicsIsl1 = {
        pos: new THREE.Vector2(0, 0),
        vel: new THREE.Vector2(0, 0),
        rot: 0.0,
        angVel: 0.0,
        isActive: false,
        shouldSnapToAnchor: true,
        mass: 1.5,
        getMOI: (w, h) => (1 / 12) * 1.5 * (w * w + h * h)
    };

    const barPhysicsIsl2 = {
        pos: new THREE.Vector2(0, 0),
        vel: new THREE.Vector2(0, 0),
        rot: 0.0,
        angVel: 0.0,
        isActive: false,
        shouldSnapToAnchor: true,
        mass: 1.5,
        getMOI: (w, h) => (1 / 12) * 1.5 * (w * w + h * h)
    };

    hudPlane.applyBeamImpulse = () => {
        barPhysicsR.isActive = true;
        barPhysicsR.shouldSnapToAnchor = false;

        const resX = scene.width || window.innerWidth;
        const resY = scene.height || window.innerHeight;
        const marginPx = resY * uniforms.uMarginPct.value;
        const vMarginPx = resY * (uniforms.uMarginPct.value + uniforms.uVerticalMarginPct.value);
        const bs = new THREE.Vector2((resX - marginPx * 2.0) * 0.5, (resY - vMarginPx * 2.0) * 0.5);
        const mw = bs.x * 2.0;
        const mh = bs.y * 2.0;

        // Initialize position at default if first time
        if (barPhysicsR.pos.lengthSq() < 0.001) {
            barPhysicsR.pos.set(bs.x, 0);
        }

        // Calculate Beam P1 and P2 in pixel space (matching shader)
        const bNotchHRatio = uniforms.uBNotchHRatio.value;
        const bNotchWRatio = uniforms.uBNotchWRatio.value;
        const gardenCeiling = -bs.y + mh * bNotchHRatio;
        // User Request: Move bar to TOP edge of notch (gardenCeiling)
        const bottomBarY = gardenCeiling;

        // Exact Math: Notch narrows at top. Angle=60, cot(60)=0.57735
        // TopWidth = BaseWidth - 2 * Height * cot(60)
        const bNotchH = mh * bNotchHRatio; // Calculate bNotchH here
        const notchTopNarrowing = bNotchH * 0.57735 * 2.0;
        const bottomBarW = (mw * bNotchWRatio) - notchTopNarrowing;

        const bNotchBarProgress = uniforms.uBNotchBarProgress.value;

        // Beam Start: Center of the bar at the new Top Position
        const p1 = new THREE.Vector2(-bottomBarW * 0.5 + bNotchBarProgress * bottomBarW, bottomBarY);

        const rNotchHRatio = uniforms.uRNotchHRatio.value;
        const bl = (bs.y * 2.0) * rNotchHRatio * 0.8 * 0.5;
        const attachRatio = uniforms.uBeamAttachRatio.value;
        const p2 = new THREE.Vector2(bs.x, THREE.MathUtils.mapLinear(attachRatio, 0, 1, -bl, bl));

        // Impulse Direction
        const dir = new THREE.Vector2().subVectors(p2, p1).normalize();
        const impulseMag = 2800.0;
        const impulse = dir.multiplyScalar(impulseMag);

        // Application at p2 relative to barCenter
        const r = new THREE.Vector2().subVectors(p2, barPhysicsR.pos);

        // Linear Velocity change
        barPhysicsR.vel.add(impulse.clone().divideScalar(barPhysicsR.mass));

        // Angular Velocity change (Torque = r x F)
        const torque = (r.x * impulse.y - r.y * impulse.x);
        barPhysicsR.angVel += torque / barPhysicsR.getMOI(bl);

        // --- ENHANCE: Thicken Bar for Visibility ---
        // Original is ~0.0002. 10x is 0.002.
        const targetThick = 0.002;

        // 1. Tween Up (Permanent for this fall sequence)
        new TWEEN.Tween(uniforms.uRNotchBarThickness)
            .to({ value: targetThick }, 300)
            .easing(TWEEN.Easing.Back.Out)
            .start();

        // --- Trigger Island Bars Falling Too (Scenario Sync) ---
        setTimeout(() => {
            barPhysicsIsl1.isActive = true;
            barPhysicsIsl1.shouldSnapToAnchor = false;
            barPhysicsIsl1.vel.set(-100 + Math.random() * -200, -100);
            barPhysicsIsl1.angVel = (Math.random() - 0.5) * 5.0;

            barPhysicsIsl2.isActive = true;
            barPhysicsIsl2.shouldSnapToAnchor = false;
            barPhysicsIsl2.vel.set(-150 + Math.random() * -200, -50);
            barPhysicsIsl2.angVel = (Math.random() - 0.5) * 5.0;
        }, 100);

        // --- PERFORMANCE CLEANUP ---
        // Removed hard-coded timeout to prevent snapping. Bars now sleep naturally.
    };

    // 2. Restoration Removed for Performance


    /**
     * Resets the right bar physics to its default anchor state.
     */
    hudPlane.resetBarPhysics = () => {
        barPhysicsR.isActive = false;
        barPhysicsR.shouldSnapToAnchor = true;
        barPhysicsR.pos.set(0, 0); // Will be snapped to anchor in onBeforeRender
        barPhysicsR.vel.set(0, 0);
        barPhysicsR.rot = 0;
        barPhysicsR.angVel = 0;

        // Reset Bottom Bar
        barPhysicsB.isActive = false;
        barPhysicsB.pos.set(0, 0);
        barPhysicsB.vel.set(0, 0);
        barPhysicsB.rot = 0;
        barPhysicsB.angVel = 0;

        // Reset Island Bars
        barPhysicsIsl1.isActive = false;
        barPhysicsIsl1.pos.set(0, 0);
        barPhysicsIsl1.vel.set(0, 0);
        barPhysicsIsl1.rot = 0;
        barPhysicsIsl1.angVel = 0;

        barPhysicsIsl2.isActive = false;
        barPhysicsIsl2.pos.set(0, 0);
        barPhysicsIsl2.vel.set(0, 0);
        barPhysicsIsl2.rot = 0;
        barPhysicsIsl2.angVel = 0;
    };

    let lastTime = performance.now();
    hudPlane.onBeforeRender = () => {
        // Sync late-loaded resources
        if (!uniforms.uSpriteSheet.value && resources.spriteSheet) {
            uniforms.uSpriteSheet.value = resources.spriteSheet;
        }

        const now = performance.now();
        const dt = Math.min(0.032, (now - lastTime) / 1000);
        lastTime = now;

        const time = uniforms.iTime.value;
        const resX = scene.width || window.innerWidth;
        const resY = scene.height || window.innerHeight;
        const marginPx = resY * uniforms.uMarginPct.value;
        const vMarginPx = resY * (uniforms.uMarginPct.value + uniforms.uVerticalMarginPct.value);
        const boxSizeX = (resX - marginPx * 2.0) * 0.5;
        const boxSizeY = (resY - vMarginPx * 2.0) * 0.5;

        // --- FPS Tracking ---
        frameCountSinceUpdate++;
        if (now > lastFpsUpdateTime + 1000) {
            currentFps = Math.round((frameCountSinceUpdate * 1000) / (now - lastFpsUpdateTime));
            lastFpsUpdateTime = now;
            frameCountSinceUpdate = 0;

            // Sync progress values from config (REMOVED: Now handled by status.js)


            // --- USER REQUEST: Island Pixel Measurement Logging ---
            const innerFrameW = (resX - marginPx * 2.0) - HUD_CONFIG.CUT_SIZE * 2.0;
            const logIslW = innerFrameW * HUD_CONFIG.ISL_TO_MAIN_WRatio_NOT_FOUND || (innerFrameW * HUD_CONFIG.ISL_TO_MAIN_W_RATIO);
            const logMh = resY - vMarginPx * 2.0;
            const logBarH = logMh * HUD_CONFIG.ISL_BAR_HEIGHT_RATIO;
            const logBarGap = logMh * HUD_CONFIG.ISL_BAR_GAP_RATIO;
            const logBarMarY = logMh * HUD_CONFIG.ISL_BAR_MARGIN_Y_RATIO;
            const logBodyH = logMh * (HUD_CONFIG.ISL_BAR_MARGIN_Y_RATIO * 2.0 + 2.0 * HUD_CONFIG.ISL_BAR_HEIGHT_RATIO + 1.0 * HUD_CONFIG.ISL_BAR_GAP_RATIO);
            const logTotalIslH = HUD_CONFIG.CUT_SIZE + logBodyH - HUD_CONFIG.CORNER_RADIUS;

            // console.log(`[HUD Island Metrics] Screen: ${resX}x${resY} | Island Width: ${logIslW.toFixed(1)}px | Total Island Height: ${logTotalIslH.toFixed(1)}px | Bar Height: ${logBarH.toFixed(1)}px | Bar Gap: ${logBarGap.toFixed(1)}px | Top-Left Margin: ${marginPx.toFixed(1)}x${vMarginPx.toFixed(1)}px`);
        }

        // --- Physics & Uniform Sync ---
        const hMarginPx_local = resY * uniforms.uMarginPct.value;
        const vMarginPx_local = resY * (uniforms.uMarginPct.value + uniforms.uVerticalMarginPct.value);
        const bsX = (resX - hMarginPx_local * 2.0) * 0.5;

        // Anchor bar to frame if not active (physics not started)
        if (barPhysicsR.shouldSnapToAnchor) {
            barPhysicsR.pos.set(bsX, 0);
        }

        // --- Bottom Bar Physics / Anchor ---
        const bNotchH = boxSizeY * 2.0 * uniforms.uBNotchHRatio.value;
        const gardenCeiling = -boxSizeY + bNotchH;
        // User Request: Align to Top of Notch
        const bottomBarY = gardenCeiling;

        // Anchor bottom bar if not active
        if (barPhysicsB.shouldSnapToAnchor) {
            barPhysicsB.pos.set(0, bottomBarY);
        }

        // Always sync uniforms so the bar is visible at its default position before physics start
        uniforms.uRBarRot.value = barPhysicsR.rot;
        uniforms.uRBarPos.value.copy(barPhysicsR.pos);
        uniforms.uBBarRot.value = barPhysicsB.rot;
        uniforms.uBBarPos.value.copy(barPhysicsB.pos);

        if (barPhysicsR.isActive || barPhysicsB.isActive || barPhysicsIsl1.isActive || barPhysicsIsl2.isActive) {
            const gravity = -1200.0;
            const friction = 0.95;
            const bounciness = 0.6;
            const damping = 0.99;
            const angDamping = 0.98;

            const rNotchHRatio = uniforms.uRNotchHRatio.value;
            const bl = boxSizeY * rNotchHRatio * 0.8; // Correct half-length to match shader

            // --- RIGHT BAR UPDATE ---
            if (barPhysicsR.isActive) {
                // Apply Gravity
                barPhysicsR.vel.y += gravity * dt;

                // Integrate
                barPhysicsR.pos.addScaledVector(barPhysicsR.vel, dt);
                barPhysicsR.rot += barPhysicsR.angVel * dt;

                // Damping
                barPhysicsR.vel.multiplyScalar(damping);
                barPhysicsR.angVel *= angDamping;

                // Collision Detection (Check Corners)
                const floorY = -resY * 0.5 + 5.0; // Floor with small buffer
                const wallX = (resX * 0.5) - 5.0; // Right wall

                // Corners of the bar in its local coordinate system (relative to its center)
                _phyCorners[0].set(0, bl);
                _phyCorners[1].set(0, -bl);
                const corners = _phyCorners;

                // Collision Detection
                for (const cLocal of corners) {
                    const s = Math.sin(barPhysicsR.rot);
                    const c = Math.cos(barPhysicsR.rot);
                    const rx = cLocal.x * c - cLocal.y * s;
                    const ry = cLocal.x * s + cLocal.y * c;

                    const worldX = barPhysicsR.pos.x + rx;
                    const worldY = barPhysicsR.pos.y + ry;

                    if (worldY < floorY) {
                        const depth = floorY - worldY;
                        barPhysicsR.pos.y += depth;
                        barPhysicsR.vel.y = Math.abs(barPhysicsR.vel.y) * bounciness;
                        barPhysicsR.vel.x *= friction;
                        barPhysicsR.angVel += (worldX - barPhysicsR.pos.x) * barPhysicsR.vel.y * 0.0001;
                    }

                    if (worldX > wallX) {
                        const depth = worldX - wallX;
                        barPhysicsR.pos.x -= depth;
                        barPhysicsR.vel.x = -Math.abs(barPhysicsR.vel.x) * bounciness;
                        barPhysicsR.angVel += (worldY - barPhysicsR.pos.y) * -barPhysicsR.vel.x * 0.0001;
                    }

                    if (worldX < -wallX) {
                        const depth = (-wallX) - worldX;
                        barPhysicsR.pos.x += depth;
                        barPhysicsR.vel.x = Math.abs(barPhysicsR.vel.x) * bounciness;
                        barPhysicsR.angVel += (worldY - barPhysicsR.pos.y) * barPhysicsR.vel.x * 0.0001;
                    }

                    // --- COLLISION: Stick vs Bottom Bar ---
                    // Simple Box Check against global Bottom Bar bounds (if it's not already active)
                    if (!barPhysicsB.isActive) {
                        const mw = boxSizeX * 2.0;
                        const mh = boxSizeY * 2.0;
                        const notchW = mw * uniforms.uBNotchWRatio.value;

                        const bBarH = 10.0; // Thin bar (approx 10px or proportional)
                        const bBarW = notchW; // Full Width

                        // Check if stick tip is inside bottom bar box
                        // Using bottomBarY as center
                        if (Math.abs(worldX) < bBarW * 0.5 && Math.abs(worldY - bottomBarY) < bBarH * 2.0) { // Increased hit zone vertically
                            // WAKE UP!
                            barPhysicsB.isActive = true;
                            barPhysicsB.shouldSnapToAnchor = false;

                            // Transfer Energy (Impulse)
                            barPhysicsB.vel.addScaledVector(barPhysicsR.vel, 0.8);

                            // Add some random spin and vertical pop
                            barPhysicsB.angVel = (Math.random() - 0.5) * 10.0;
                            barPhysicsB.vel.y -= 200.0; // Push down slightly

                            // Rebound stick slightly
                            barPhysicsR.vel.y *= -0.5;
                            barPhysicsR.angVel += (Math.random() - 0.5) * 5.0;
                        }
                    }
                }
            }

            // --- BOTTOM BAR UPDATE ---
            if (barPhysicsB.isActive) {
                barPhysicsB.vel.y += gravity * dt;
                barPhysicsB.pos.addScaledVector(barPhysicsB.vel, dt);
                barPhysicsB.rot += barPhysicsB.angVel * dt;

                // Floor Collision for Bottom Bar
                const floorY = -resY * 0.5 - 200.0; // Let it fall off screen eventually
                // But bounce once maybe? Na, just fall away per user request "farewell"
                // Or bounce off walls?
                const wallX = (resX * 0.5) - 5.0;
                if (barPhysicsB.pos.x > wallX || barPhysicsB.pos.x < -wallX) {
                    barPhysicsB.vel.x *= -0.8;
                }
            }

            // --- ISLAND BARS UPDATE ---
            const updateIslandBarPhysics = (barPhys, i) => {
                if (barPhys.isActive) {
                    barPhys.vel.y += gravity * dt;
                    barPhys.pos.addScaledVector(barPhys.vel, dt);
                    barPhys.rot += barPhys.angVel * dt;

                    // Bounds
                    const floorY = -resY * 0.5; // Screen bottom
                    const wallX = resX * 0.5;

                    // Simple Point Check (Center)
                    if (barPhys.pos.y < floorY) {
                        barPhys.pos.y = floorY;
                        barPhys.vel.y = Math.abs(barPhys.vel.y) * 0.6; // Bounce
                        barPhys.vel.x *= 0.9; // Friction
                        barPhys.angVel *= 0.9;
                    }
                    if (barPhys.pos.x > wallX || barPhys.pos.x < -wallX) {
                        barPhys.vel.x *= -0.8; // Wall bounce
                    }
                }
            };

            updateIslandBarPhysics(barPhysicsIsl1, 0);
            updateIslandBarPhysics(barPhysicsIsl2, 1);
        }

        // --- SYNC ISLAND BARS (Static vs Dynamic) ---
        // We ALWAYS calculate the static anchor to support resizing/opening
        // Then we feed either that or the physics pos to the uniform.

        const pCutSize = uniforms.uCutSize.value;
        const pBs = new THREE.Vector2(boxSizeX, boxSizeY);
        // Recalc Island Params for Positioning
        const pMh = boxSizeY * 2.0;
        const pMw = boxSizeX * 2.0;
        const pInnerFrameW = pMw - pCutSize * 2.0;
        const pIslW = pInnerFrameW * uniforms.uIslToMainWRatio.value;

        const pBarH = pMh * uniforms.uIslBarHeightRatio.value;
        const pBarGap = pMh * uniforms.uIslBarGapRatio.value;
        const pBarMarL = pMh * uniforms.uIslBarMarginLeftRatio.value;
        const pBarMarR = pMh * uniforms.uIslBarMarginRightRatio.value;
        const pBarMarY = pMh * uniforms.uIslBarMarginYRatio.value;
        // const pBarBaseWidth = pIslW - (pBarMarL + pBarMarR); // Width of the bar body

        // Helper to get Static Center
        const getStaticBarCenter = (i) => {
            const barY = pBs.y - pCutSize - pBarMarY - float(i) * (pBarH + pBarGap) - pBarH * 0.5;

            // Calculate Center X
            // Left Edge at this Y: -bs.x + barMarL + (barY - bs.y)
            // Right Edge at this Y: -bs.x + islW + (barY - bs.y) - barMarR
            // Center is (L+R)/2

            // slant offset driven by Y difference from Top
            const slantOffset = (barY - pBs.y);
            const leftEdge = -pBs.x + pBarMarL + slantOffset;
            const rightEdge = -pBs.x + pIslW + slantOffset - pBarMarR;
            const centerX = (leftEdge + rightEdge) * 0.5;

            return { x: centerX, y: barY };
        };
        // Mock float casting
        const float = (v) => v;

        // Sync Bar 1
        if (!barPhysicsIsl1.isActive) {
            const s1 = getStaticBarCenter(0);
            barPhysicsIsl1.pos.set(s1.x, s1.y);
            barPhysicsIsl1.rot = 0;
        }
        uniforms.uIslBar1Pos.value.copy(barPhysicsIsl1.pos);
        uniforms.uIslBar1Rot.value = barPhysicsIsl1.rot;

        // Sync Bar 2
        if (!barPhysicsIsl2.isActive) {
            const s2 = getStaticBarCenter(1);
            barPhysicsIsl2.pos.set(s2.x, s2.y);
            barPhysicsIsl2.rot = 0;
        }
        uniforms.uIslBar2Pos.value.copy(barPhysicsIsl2.pos);
        uniforms.uIslBar2Rot.value = barPhysicsIsl2.rot;

        const rotAng = time * HUD_CONFIG.DIAMOND_ROT_SPEED;
        uniforms.uDiamondRot.value.set(Math.cos(rotAng), Math.sin(rotAng));

        // --- Calculate Screen Metrics for Masking ---
        // We calculate the screen-space bounding box of the Island Header to feed the Points shader masking logic.
        const cutSize = uniforms.uCutSize.value;
        // Reuse marginPx, vMarginPx from upper scope

        // Main Frame size (BoxSize is Half-Size in shader, so Full Size is * 2)
        const frameW = resX - marginPx * 2.0;

        // Island Dimensions
        const innerFrameW = frameW - cutSize * 2.0;
        const islW = innerFrameW * uniforms.uIslToMainWRatio.value;

        // Position Logic (Top Left)
        // Header Top Y = resY - vMarginPx
        const maskTop = resY - vMarginPx;
        const maskLeft = marginPx;
        const maskRight = maskLeft + islW + cutSize + 20.0; // Extend width slightly for safety

        // Header Height
        // In shader: islH = uCutSize + islBodyH... 
        // But we only care about the HEADER part (the tab with the pattern).
        // The pattern is in `p.y > (bs.y - uCutSize)`.
        // So Header Bottom Y = Top Y - cutSize.
        // --- Full Island Height Calculation (Added via Debug) ---
        const mh = boxSizeY * 2.0;
        const bMarginY = HUD_CONFIG.ISL_BAR_MARGIN_Y_RATIO;
        const bHeight = HUD_CONFIG.ISL_BAR_HEIGHT_RATIO;
        const bGap = HUD_CONFIG.ISL_BAR_GAP_RATIO;
        const cRadius = HUD_CONFIG.CORNER_RADIUS;
        const islBodyH = mh * (bMarginY * 2.0 + 2.0 * bHeight + 1.0 * bGap);
        const islH = cutSize + islBodyH - cRadius;

        const maskBottom = maskTop - islH - 20.0; // Extended

        // Update Points Uniform (Screen Space Pixels)
        if (scene.points && scene.points.material && scene.points.material.uniforms.uMaskRect) {
            scene.points.material.uniforms.uMaskRect.value.set(
                maskLeft,
                maskBottom,
                maskRight,
                maskTop
            );

            // Slant Origin (Top-Right of inner width)
            const slantX = maskLeft + islW;
            const slantY = maskTop;

            if (scene.points.material.uniforms.uMaskSlant) {
                scene.points.material.uniforms.uMaskSlant.value.set(slantX, slantY);
            }

            // --- Navigator Mask Calculation (Top Right) ---
            const navButtonHeight = islH + HUD_CONFIG.CORNER_RADIUS;
            const navGapVal = uniforms.uNavGap ? uniforms.uNavGap.value : HUD_CONFIG.TL_GAP;
            const navVisGlobal = uniforms.uNavigatorVisibility ? uniforms.uNavigatorVisibility.value : 1.0;

            let navW = 0.0;
            const visArr = uniforms.uNavVis.value;
            const whArr = uniforms.uNavWH.value;

            for (let i = 0; i < 6; i++) {
                if (visArr[i] > 0.01 && whArr[i] > 0.01) {
                    navW += (navButtonHeight * whArr[i]) + navGapVal;
                }
            }
            if (navW > 0.0) navW -= navGapVal; // Remove trailing gap
            navW *= navVisGlobal;

            const maskRightNav = resX - marginPx + HUD_CONFIG.CORNER_RADIUS + 20.0; // Extend for safety
            const maskLeftNav = (resX - marginPx + HUD_CONFIG.CORNER_RADIUS) - navW - navGapVal;
            const maskTopNav = resY - vMarginPx + HUD_CONFIG.CORNER_RADIUS + 20.0; // Extend for safety
            const maskBottomNav = (resY - vMarginPx + HUD_CONFIG.CORNER_RADIUS) - islH - navGapVal;

            if (scene.points.material.uniforms.uMaskRectNav) {
                scene.points.material.uniforms.uMaskRectNav.value.set(
                    maskLeftNav,
                    maskBottomNav,
                    maskRightNav,
                    maskTopNav
                );
            }
        }

        // Navigator calculations (managed via arrays in shader)

        // Fixed Head Logic: Always at the middle of the bottom notch
        const bNotchH_head = boxSizeY * 2.0 * uniforms.uBNotchHRatio.value;
        const gardenCeiling_head = -boxSizeY + bNotchH_head;
        const headX = 0.0;
        const headY = gardenCeiling_head;

        uniforms.uPosStart.value.set(headX, headY);
        uniforms.uPosHead.value.set(headX, headY);

        // --- Optimized HTML Label Sync ---
        const vMarginVal = uniforms.uVerticalMarginPct.value;
        const cutSizeVal = uniforms.uCutSize.value;
        const islWRatio = uniforms.uIslToMainWRatio.value;

        // PERFORMANCE: Skip DOM updates if HUD is fully collapsed (VMargin >= 0.5)
        // or if geometry hasn't changed.
        const isCollapsed = vMarginVal >= 0.5;
        const hasGeomChanged =
            hudPlane._lastVMargin !== vMarginVal ||
            hudPlane._lastCutSize !== cutSizeVal ||
            hudPlane._lastIslW !== islWRatio ||
            hudPlane._lastResX !== resX ||
            hudPlane._lastResY !== resY;

        if (labelsContainer && hasGeomChanged && !isCollapsed) {
            const hMargin = marginPx;
            const vMargin = vMarginPx;
            const mh = boxSizeY * 2.0;

            const barHigh = mh * uniforms.uIslBarHeightRatio.value;
            const barGap = mh * uniforms.uIslBarGapRatio.value;
            const barMarL = mh * uniforms.uIslBarMarginLeftRatio.value;
            const barMarY = mh * uniforms.uIslBarMarginYRatio.value;
            const cutSizeVal = uniforms.uCutSize.value;

            // Use cached groups to avoid querySelectorAll
            if (hudPlane._labelGroups) {
                hudPlane._labelGroups.forEach((g, i) => {
                    const centerY = vMargin + cutSizeVal + barMarY + i * (barHigh + barGap) + barHigh * 0.5;
                    const slant = vMargin - centerY;
                    const barStartX = hMargin + barMarL + slant;

                    const fontSize = barHigh * 1.6; // 1.6x multiplier

                    g.style.height = `${barHigh}px`;
                    g.style.fontSize = `${fontSize}px`;
                    g.style.transform = `translate(${barStartX - 20}px, ${centerY}px) translate(-100%, -50%)`;

                    // Safety: Ensure text doesn't bleed past the left HUD margin on extreme aspect ratios
                    const labelText = g.querySelector('.hud-label-text');
                    if (labelText) {
                        const maxW = (barStartX - hMargin) - 25;
                        labelText.style.maxWidth = `${maxW}px`;
                    }
                });
            }

            // Update cache to stop updates until next change
            hudPlane._lastVMargin = vMarginVal;
            hudPlane._lastCutSize = cutSizeVal;
            hudPlane._lastIslW = islWRatio;
            hudPlane._lastResX = resX;
            hudPlane._lastResY = resY;

            // Update Dynamic CSS Variables for external positioning
            updateCSSMetrics();
        }

        // --- NAV LABELS SYNC ---
        // Moved outside of hasGeomChanged to ensure they stay in sync as visibility/scrolling changes.
        // We treat HUD_CONFIG constants as LOGICAL pixels here because the shader's physical units 
        // are effectively pinned to the logical layout in your current configuration.
        if (hudPlane._navLabelGroups && uniforms.uNavCount && uniforms.uNavCount.value > 0 && !isCollapsed) {
            const navGap_l = (uniforms.uNavGap ? uniforms.uNavGap.value : HUD_CONFIG.TL_GAP); // Treat as logical

            const mh_l = boxSizeY * 2.0;
            const ratios = (
                (uniforms.uIslBarMarginYRatio.value * 2.0) +
                (2.0 * uniforms.uIslBarHeightRatio.value) +
                (1.0 * uniforms.uIslBarGapRatio.value)
            );

            const cornerR_l = HUD_CONFIG.CORNER_RADIUS; // Treat as logical 
            const cutSize_l = cutSizeVal; // Treat as logical 

            // Calculate absolute logical button height
            const navBtnH_l = cutSize_l + mh_l * ratios + cornerR_l;

            // Anchor points (Logical pixels from top-left)
            const groupTop_l = vMarginPx - cornerR_l;
            const groupRight_l = (resX - marginPx + cornerR_l);

            const fontSizeCSS = navBtnH_l * 0.32;
            let currentOffset_l = 0;
            hudPlane._navLabelGroups.forEach((g, i) => {
                // i=0 is CV (Rightmost), i=1 is LAB, i=2 is WORK, i=3 is ABOUT
                const vis = uniforms.uNavVis.value[i];
                const ratio = uniforms.uNavWH.value[i];
                const btnW_l = navBtnH_l * ratio;

                // Smooth transition management: 
                // vis drives opacity, ratio drives width.
                // We use a low threshold for display: none to prevent layout thrashing but allow early fade start.
                const globalNavVis = uniforms.uNavigatorVisibility ? uniforms.uNavigatorVisibility.value : 1.0;
                const isActuallyVisible = (vis > 0.001 && ratio > 0.001 && globalNavVis > 0.001);

                // Visual correction for letter-spacing (0.15em) and Orbitron font weight
                const hCorrection = btnW_l * 0.02;

                const centerX_l = groupRight_l - currentOffset_l - (btnW_l * 0.5) + hCorrection;
                const centerY_l = groupTop_l + (navBtnH_l * 0.5);

                g.style.left = '0';
                g.style.top = '0';
                g.style.width = `${btnW_l}px`;
                g.style.height = `${navBtnH_l}px`;
                g.style.fontSize = `${fontSizeCSS}px`;
                g.style.transform = `translate(${centerX_l}px, ${centerY_l}px) translate(-50%, -50%)`;
                g.style.opacity = vis * globalNavVis;
                g.style.display = isActuallyVisible ? 'flex' : 'none';

                if (isActuallyVisible) {
                    currentOffset_l += btnW_l + navGap_l;
                }
            });
        }
    };


    // --- HUD Label System (Injected into Scene Container) ---
    const injectHUDLabels = () => {
        // 1. Island Labels
        const container = document.createElement('div');
        container.className = 'hud-island-labels';
        container.innerHTML = `
            <div class="hud-label-group"><span class="hud-label-text">FPS</span></div>
            <div class="hud-label-group"><span class="hud-label-text">PERF</span></div>
        `;
        hudPlane._labelGroups = Array.from(container.querySelectorAll('.hud-label-group'));

        // 2. Nav Labels
        const navContainer = document.createElement('div');
        navContainer.className = 'hud-nav-labels';
        // HTML Icons for CV Toggle (Slot 0)
        const cvIconHTML = `
            <button id="cv-toggle-btn" class="hud-inline-toggle" aria-label="Toggle CV Panel">
                <div class="icon-lines">
                    <span></span><span></span><span></span><span></span>
                </div>
            </button>
        `;

        // Buttons mapped to labels: 0=CV, 1=LAB, 2=WORK, 3=ABOUT, 4-5=Buffer
        navContainer.innerHTML = Array(6).fill(0).map((_, i) =>
            `<div class="hud-nav-label-group" id="hud-nav-btn-${i}">
                <div class="hud-nav-label-content"></div>
                ${i === 0 ? cvIconHTML : ''}
            </div>`
        ).join('');

        hudPlane._navLabelGroups = Array.from(navContainer.querySelectorAll('.hud-nav-label-group'));

        // Initialize default texts
        const defaultTexts = ['', 'WORK', 'LAB', 'ABOUT', '', ''];
        hudPlane._navLabelGroups.forEach((g, i) => {
            const content = g.querySelector('.hud-nav-label-content');
            if (content) content.textContent = defaultTexts[i] || '';
        });

        // Add Hover Interactions
        hudPlane._navLabelGroups.forEach(g => {
            g.style.pointerEvents = 'auto';
            g.style.cursor = 'pointer';
            g.addEventListener('mouseenter', () => {
                if (typeof hudPlane.breathe === 'function') {
                    hudPlane.breathe();
                }
            });
        });

        // Reset visibility
        container.style.display = 'none';
        navContainer.style.display = 'none';

        // Set shared styles
        [...hudPlane._labelGroups, ...hudPlane._navLabelGroups].forEach(g => {
            g.style.position = 'absolute';
            g.style.display = 'flex';
            g.style.alignItems = 'center';
            g.style.justifyContent = 'center';
        });

        // Inject into the renderer's parent container (threeJsContainer)
        if (scene.domElement) {
            scene.domElement.appendChild(container);
            scene.domElement.appendChild(navContainer);
        }
        hudPlane.navLabelsContainer = navContainer;
        return container;
    };

    const labelsContainer = injectHUDLabels();
    hudPlane.labelsContainer = labelsContainer;

    // --- Dynamic Nav Button API (Independent Control) ---
    hudPlane.navButtons = Array(6).fill(0).map((_, i) => ({
        show: (duration = 600, targetRatio = 2.0) => {
            if (hudPlane._navTweens && hudPlane._navTweens[i]) hudPlane._navTweens[i].stop();
            if (!hudPlane._navTweens) hudPlane._navTweens = {};

            hudPlane._navTweens[i] = new TWEEN.Tween({
                ratio: uniforms.uNavWH.value[i],
                vis: uniforms.uNavVis.value[i]
            })
                .to({ ratio: targetRatio, vis: 1.0 }, duration)
                .easing(TWEEN.Easing.Cubic.InOut)
                .onUpdate((obj) => {
                    uniforms.uNavWH.value[i] = obj.ratio;
                    uniforms.uNavVis.value[i] = obj.vis;
                })
                .onComplete(() => { delete hudPlane._navTweens[i]; })
                .start();
        },
        hide: (duration = 600) => {
            if (hudPlane._navTweens && hudPlane._navTweens[i]) hudPlane._navTweens[i].stop();
            if (!hudPlane._navTweens) hudPlane._navTweens = {};

            hudPlane._navTweens[i] = new TWEEN.Tween({
                ratio: uniforms.uNavWH.value[i],
                vis: uniforms.uNavVis.value[i]
            })
                .to({ ratio: 0.0, vis: 0.0 }, duration)
                .easing(TWEEN.Easing.Cubic.InOut)
                .onUpdate((obj) => {
                    uniforms.uNavWH.value[i] = obj.ratio;
                    uniforms.uNavVis.value[i] = obj.vis;
                })
                .onComplete(() => {
                    delete hudPlane._navTweens[i];
                    // Final cull for safety
                    uniforms.uNavVis.value[i] = 0.0;
                    uniforms.uNavWH.value[i] = 0.0;
                })
                .start();
        },
        setText: (text) => {
            const content = hudPlane._navLabelGroups[i].querySelector('.hud-nav-label-content');
            if (content) content.textContent = text;
        },
        setRatio: (ratio, duration = 0) => {
            if (duration <= 0) {
                uniforms.uNavWH.value[i] = ratio;
            } else {
                new TWEEN.Tween({ val: uniforms.uNavWH.value[i] })
                    .to({ val: ratio }, duration)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .onUpdate((obj) => { uniforms.uNavWH.value[i] = obj.val; })
                    .start();
            }
        },
        setActive: (isActive) => {
            const group = hudPlane._navLabelGroups[i];
            if (group) {
                if (isActive) group.classList.add('active');
                else group.classList.remove('active');
            }
        }
    }));

    const syncToFrustum = () => {
        if (!camera) return;
        const activeRenderer = scene.renderer;
        const resX = activeRenderer ? activeRenderer.domElement.clientWidth : window.innerWidth;
        const resY = activeRenderer ? activeRenderer.domElement.clientHeight : window.innerHeight;

        if (uniforms.iResolution) uniforms.iResolution.value.set(resX, resY);
    };

    syncToFrustum();
    requestAnimationFrame(syncToFrustum);
    camera.add(hudPlane);
    window.addEventListener('resize', syncToFrustum);
    camera.syncHUD = syncToFrustum;
    // --- Interaction Logic ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isHoveringFlower = false;
    let isHoveringIsland = false;
    let isHoveringKnowhere = false;

    window.addEventListener('mousemove', (event) => {
        const canvas = document.querySelector('canvas');
        const rect = canvas ? canvas.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };

        // Fix Mouse Normalization (Use Canvas Space, not Window Space)
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Use manual UV projection for the Screen-Space HUD to ensure interaction 
        // remains consistent even when camera parameters change.
        const uv = new THREE.Vector2(mouse.x * 0.5 + 0.5, mouse.y * 0.5 + 0.5);
        raycaster.setFromCamera(mouse, camera);

        if (hudPlane.visible && Math.abs(mouse.x) <= 1.0 && Math.abs(mouse.y) <= 1.0) {
            // Convert UV to matches Shader Logic
            // JS Calculation needs to mimic Shader details
            const resX = rect.width;
            const resY = rect.height;
            const hMargin = resY * uniforms.uMarginPct.value;
            const vMargin = resY * (uniforms.uMarginPct.value + uniforms.uVerticalMarginPct.value);
            const bs = new THREE.Vector2(resX - hMargin * 2.0, resY - vMargin * 2.0).multiplyScalar(0.5);

            // Pixel Space P (Center relative)
            const p = new THREE.Vector2(uv.x * resX - resX * 0.5, uv.y * resY - resY * 0.5);

            const mw = bs.x * 2.0;
            const mh = bs.y * 2.0;
            const bNotchH = mh * uniforms.uBNotchHRatio.value;
            const gardenCeiling = -bs.y + bNotchH;
            // const gardenFloor = -resY * 0.5; // (Not needed for X calc)
            // const gardenHeight = gardenCeiling - gardenFloor;
            // Simplified: GardenHeight ~ vMargin + bNotchH (approximated)
            const gardenHeight = (resY * 0.5 - vMargin) + bNotchH;

            // Notch Logic
            const notchW = mw * uniforms.uBNotchWRatio.value;
            const targetX = (notchW * -0.5) * (1.0 - uniforms.uFlowerNotchPos.value.x) + (notchW * 0.5) * uniforms.uFlowerNotchPos.value.x;

            // Y Logic - Match Shader
            const notchBottom = -(resY - vMargin * 2.0) * 0.5; // -bs.y
            const notchTop = notchBottom + bNotchH;
            const targetY = notchBottom * (1.0 - uniforms.uFlowerNotchPos.value.y) + notchTop * uniforms.uFlowerNotchPos.value.y;

            // INVISIBLE BOX STRATEGY
            // 1. Define the Zone (Relative to Screen Size)
            // Y Zone: From Bottom of screen up to "Garden Ceiling"
            const boxTop = gardenCeiling;
            const boxBottom = -resY * 0.5;

            // Visual Height: Amount visible on screen (Margin + Notch)
            const visualBoxHeight = boxTop - boxBottom;

            // Width: VisualH * Aspect (w > h)
            const boxWidth = visualBoxHeight * (resX / resY);

            // Interaction Check: Is point inside the box?
            // Check Y:
            const inY = (p.y < boxTop && p.y > boxBottom);
            const inX = (Math.abs(p.x - targetX) < boxWidth * 0.5);

            // --- Island Metrics for Hover ---
            const cutSize = uniforms.uCutSize.value;
            const innerFrameW = (bs.x * 2.0) - cutSize * 2.0;
            const islW = innerFrameW * uniforms.uIslToMainWRatio.value;
            const islBodyH = mh * (
                (uniforms.uIslBarMarginYRatio.value * 2.0) +
                (2.0 * uniforms.uIslBarHeightRatio.value) +
                (1.0 * uniforms.uIslBarGapRatio.value)
            );
            const islH = cutSize + islBodyH - HUD_CONFIG.CORNER_RADIUS;

            const dIsland = sdIslandShape(p.x, p.y, bs.x, bs.y, islH, islW, cutSize);
            const inIsland = dIsland < 5.0; // Small padding for better interaction feel

            if (inIsland) {
                if (!isHoveringIsland) {
                    isHoveringIsland = true;
                    if (scene.orbitControls && scene.orbitControls.showEdgeUI) scene.orbitControls.showEdgeUI();
                    uniforms.uIsAutoElec.value = 1.0;
                    // Skip Fill: Start at DUR_FILL so it's already full
                    uniforms.uElecStartTime.value = uniforms.iTime.value - HUD_CONFIG.DUR_FILL;
                }
            } else {
                if (isHoveringIsland) {
                    isHoveringIsland = false;
                    // Only turn off if we aren't hovering the flower zone either
                    if (!isHoveringFlower) {
                        uniforms.uIsAutoElec.value = 0.0;
                        if (scene.orbitControls && scene.orbitControls.hideEdgeUI) scene.orbitControls.hideEdgeUI();
                    }
                }
            }

            // --- Knowhere Hit Detection ---
            let inKnowhere = false;
            // Ensure no overlap: we only check knowhere if not hovering flower UI
            if (scene.knowhere && scene.knowhere.visible && !inY) {
                const kwIntersects = raycaster.intersectObject(scene.knowhere);
                if (kwIntersects.length > 0) {
                    const uv = kwIntersects[0].uv;
                    const px = uv.x * 2.0 - 1.0;
                    const py = uv.y * 2.0 - 1.0;
                    // Check exact visual area (radius < 0.9 matches shader mask)
                    if (Math.sqrt(px * px + py * py) < 0.9) {
                        inKnowhere = true;
                    }
                }
            }

            // --- Flower Hover Logic ---
            if (inY && inX) {
                if (!isHoveringFlower) {
                    isHoveringFlower = true;

                    // Flower Glow & Glitch
                    uniforms.uFlowerGlow.value = HUD_CONFIG.FLOWER_GLOW_HOVER;

                    new TWEEN.Tween(uniforms.uFlowerGlitch)
                        .to({ value: 1.0 }, 150)
                        .easing(TWEEN.Easing.Exponential.Out)
                        .start();

                    // --- NEW: Garden Interaction Logic ---
                    if (scene.points) {
                        const points = scene.points;
                        const currentStep = points.getCurrentStep ? points.getCurrentStep() : 0;
                        const pMat = points.material;
                        if (pMat) {
                            // 1. Show Dipper Lines in Chaos state
                            if (currentStep === 0 && points.dipperLines) {
                                points.dipperLines.userData.opacity = 1.0;
                            }

                            // 2. Knowhere Gravity Shift: a * -1 * {stateMult}
                            // Capture current gravity as starting point
                            const startG = pMat.uniforms.uKnowhereGravity.value;
                            // Target is resting gravity * Flip * Factor
                            const baseG = points.targetKnowhereGravity !== undefined ? points.targetKnowhereGravity : startG;
                            const flip = pMat.uniforms.uKnowhereGravityMultiplier ? pMat.uniforms.uKnowhereGravityMultiplier.value : -1.0;
                            const factor = pMat.uniforms.uKnowhereGravityHoverFactor ? pMat.uniforms.uKnowhereGravityHoverFactor.value : 50.0;
                            const targetG = baseG * flip * factor;

                            // 2.5 Set Garden Hover Uniform for Shader Exceptions
                            if (pMat.uniforms.uIsGardenHovering) pMat.uniforms.uIsGardenHovering.value = 1.0;

                            // 3. Knowhere Radius Shift: 20000
                            const startR = pMat.uniforms.uKnowhereRadius.value;
                            const targetR = 100000.0;

                            const chargeUpDur = points.targetChargeUpDur !== undefined ? points.targetChargeUpDur : HUD_CONFIG.GARDEN_HOVER_TWEEN_DUR;
                            if (points.knowhereTween) points.knowhereTween.stop();
                            points.knowhereTween = new TWEEN.Tween({ g: startG, r: startR })
                                .to({ g: targetG, r: targetR }, chargeUpDur)
                                .easing(TWEEN.Easing.Exponential.InOut)
                                .onUpdate((obj) => {
                                    pMat.uniforms.uKnowhereGravity.value = obj.g;
                                    pMat.uniforms.uKnowhereRadius.value = obj.r;
                                })
                                .onComplete(() => {
                                    points.knowhereTween = null;
                                })
                                .start();
                        }
                    }

                    // Dispatch Global Event
                    window.dispatchEvent(new CustomEvent(EVENTS.GARDEN.HOVER_START));
                }
            } else {
                if (isHoveringFlower) {
                    isHoveringFlower = false;

                    // Smoothly fade out Glow & Glitch
                    new TWEEN.Tween(uniforms.uFlowerGlow)
                        .to({ value: HUD_CONFIG.FLOWER_GLOW_BASE }, 800)
                        .easing(TWEEN.Easing.Cubic.Out)
                        .start();

                    new TWEEN.Tween(uniforms.uFlowerGlitch)
                        .to({ value: 0.0 }, 800)
                        .easing(TWEEN.Easing.Cubic.Out)
                        .start();

                    // --- NEW: Reset Garden Interaction Logic ---
                    if (scene.points) {
                        const points = scene.points;
                        const pMat = points.material;
                        if (pMat) {
                            // 1. Hide Dipper Lines
                            if (points.dipperLines) {
                                points.dipperLines.userData.opacity = 0.0;
                            }

                            // 2. Reset Knowhere Gravity & Radius to values appropriate for the current state
                            const currentG = pMat.uniforms.uKnowhereGravity.value;
                            const currentR = pMat.uniforms.uKnowhereRadius.value;

                            // Reset to stored target values or safe defaults
                            const resetG = points.targetKnowhereGravity !== undefined ? points.targetKnowhereGravity : 50.0;
                            const resetR = points.targetKnowhereRadius !== undefined ? points.targetKnowhereRadius : 200.0;

                            const collapseOutDur = points.targetCollapseOutDur !== undefined ? points.targetCollapseOutDur : 800;
                            if (points.knowhereTween) points.knowhereTween.stop();
                            points.knowhereTween = new TWEEN.Tween({ g: currentG, r: currentR })
                                .to({ g: resetG, r: resetR }, collapseOutDur)
                                .easing(TWEEN.Easing.Exponential.InOut)
                                .onUpdate((obj) => {
                                    pMat.uniforms.uKnowhereGravity.value = obj.g;
                                    pMat.uniforms.uKnowhereRadius.value = obj.r;
                                })
                                .onComplete(() => {
                                    points.knowhereTween = null;
                                    // 2.5 Reset Garden Hover Uniform ONLY after the field has collapsed
                                    if (pMat.uniforms.uIsGardenHovering && !isHoveringKnowhere && !isHoveringFlower) {
                                        pMat.uniforms.uIsGardenHovering.value = 0.0;
                                    }
                                })
                                .start();
                        }
                    }

                    // Dispatch Global Event
                    window.dispatchEvent(new CustomEvent(EVENTS.GARDEN.HOVER_END));
                }
            }

            // --- Knowhere Hover Logic ---
            if (inKnowhere) {
                if (!isHoveringKnowhere) {
                    if (scene.points) {
                        const points = scene.points;
                        const currentStep = points.getCurrentStep ? points.getCurrentStep() : 0;

                        // USER REQUEST: Only in Chaos (0) and Root (1)
                        if (currentStep === 0 || currentStep === 1) {
                            isHoveringKnowhere = true;

                            const pMat = points.material;
                            if (pMat) {
                                if (currentStep === 0 && points.dipperLines) {
                                    points.dipperLines.userData.opacity = 1.0;
                                }

                                // REVERSED EFFECT: Multiply by -1.0 to do the opposite of Garden
                                const startG = pMat.uniforms.uKnowhereGravity.value;
                                const baseG = points.targetKnowhereGravity !== undefined ? points.targetKnowhereGravity : startG;
                                const flip = pMat.uniforms.uKnowhereGravityMultiplier ? pMat.uniforms.uKnowhereGravityMultiplier.value : -1.0;
                                const factor = pMat.uniforms.uKnowhereGravityHoverFactor ? pMat.uniforms.uKnowhereGravityHoverFactor.value : 50.0;
                                const targetG = baseG * flip * factor * -1.0;

                                if (pMat.uniforms.uIsGardenHovering) pMat.uniforms.uIsGardenHovering.value = 1.0;

                                const startR = pMat.uniforms.uKnowhereRadius.value;
                                const targetR = 100000.0;

                                // Option C: Magnetic Tension (Vibration + Smooth Glide)
                                const startVib = pMat.uniforms.uKnowhereVibrateBoost ? pMat.uniforms.uKnowhereVibrateBoost.value : 0.0;
                                const targetVib = 2.0; // Immediate magnetic hum

                                const chargeUpDur = 3000; // MUCH slower for cinematic buildup (was 1500)
                                if (points.knowhereTween) points.knowhereTween.stop();
                                points.knowhereTween = new TWEEN.Tween({ g: startG, r: startR, v: startVib })
                                    .to({ g: targetG, r: targetR, v: targetVib }, chargeUpDur)
                                    .easing(TWEEN.Easing.Exponential.InOut) // slow-fast-slow
                                    .onUpdate((obj) => {
                                        pMat.uniforms.uKnowhereGravity.value = obj.g;
                                        pMat.uniforms.uKnowhereRadius.value = obj.r;
                                        if (pMat.uniforms.uKnowhereVibrateBoost) pMat.uniforms.uKnowhereVibrateBoost.value = obj.v;
                                    })
                                    .onComplete(() => {
                                        points.knowhereTween = null;
                                    })
                                    .start();
                            }
                        }
                    }
                }
            } else {
                if (isHoveringKnowhere) {
                    isHoveringKnowhere = false;

                    if (scene.points) {
                        const points = scene.points;
                        const pMat = points.material;
                        if (pMat) {
                            if (points.dipperLines) {
                                points.dipperLines.userData.opacity = 0.0;
                            }

                            const currentG = pMat.uniforms.uKnowhereGravity.value;
                            const currentR = pMat.uniforms.uKnowhereRadius.value;
                            const currentVib = pMat.uniforms.uKnowhereVibrateBoost ? pMat.uniforms.uKnowhereVibrateBoost.value : 0.0;

                            const resetG = points.targetKnowhereGravity !== undefined ? points.targetKnowhereGravity : 50.0;
                            const resetR = points.targetKnowhereRadius !== undefined ? points.targetKnowhereRadius : 200.0;

                            const collapseOutDur = 1500; // Slower settle
                            if (points.knowhereTween) points.knowhereTween.stop();
                            points.knowhereTween = new TWEEN.Tween({ g: currentG, r: currentR, v: currentVib })
                                .to({ g: resetG, r: resetR, v: 0.0 }, collapseOutDur)
                                .easing(TWEEN.Easing.Exponential.InOut)
                                .onUpdate((obj) => {
                                    pMat.uniforms.uKnowhereGravity.value = obj.g;
                                    pMat.uniforms.uKnowhereRadius.value = obj.r;
                                    if (pMat.uniforms.uKnowhereVibrateBoost) pMat.uniforms.uKnowhereVibrateBoost.value = obj.v;
                                })
                                .onComplete(() => {
                                    points.knowhereTween = null;
                                    if (pMat.uniforms.uIsGardenHovering && !isHoveringKnowhere && !isHoveringFlower) {
                                        pMat.uniforms.uIsGardenHovering.value = 0.0;
                                    }
                                })
                                .start();
                        }
                    }
                }
            }
        }
    }); // End of mousemove listener


    // --- Manual Breathe Trigger ---
    /**
     * Triggers a single "breathing" pulse of the border electricity.
     * Uses the durations defined in HUD_CONFIG for FILL, HOLD, and WIPE phases.
     */
    hudPlane.breathe = async function (color = null) {
        // Trigger a manual breath (Tween intensity 0 -> 1 -> 0)
        // Duration: 1 second inhale, 1 second exhale

        // Optimize: If color is provided, update the uniform
        if (color) {
            uniforms.uBreathColor.value.copy(color);
        } else {
            // Default to Cyan if no color specified (e.g. key press)
            uniforms.uBreathColor.value.copy(GLOBAL_COLORS.ELECTRIC_CYAN);
        }

        // Inhale (Slow, ethereal expansion)
        new TWEEN.Tween(uniforms.uBreathIntensity)
            .to({ value: 1.0 }, 1400)
            .easing(TWEEN.Easing.Cubic.InOut)
            .start();

        await _delay(1400);

        // Exhale (Slow, fading release)
        new TWEEN.Tween(uniforms.uBreathIntensity)
            .to({ value: 0.0 }, 2400)
            .easing(TWEEN.Easing.Cubic.InOut)
            .start();
    };

    /**
     * Starts a continuous looping breathing animation.
     */
    hudPlane.startBreathing = function (color = null) {
        if (hudPlane._isBreathingLoop) return;
        hudPlane._isBreathingLoop = true;

        if (color) uniforms.uBreathColor.value.copy(color);

        const inhale = () => {
            if (!hudPlane._isBreathingLoop) return;
            hudPlane._breathTween = new TWEEN.Tween(uniforms.uBreathIntensity)
                .to({ value: 1.0 }, 1400)
                .easing(TWEEN.Easing.Cubic.InOut)
                .onComplete(exhale)
                .start();
        };

        const exhale = () => {
            if (!hudPlane._isBreathingLoop) return;
            hudPlane._breathTween = new TWEEN.Tween(uniforms.uBreathIntensity)
                .to({ value: 0.0 }, 2400)
                .easing(TWEEN.Easing.Cubic.InOut)
                .onComplete(inhale)
                .start();
        };

        inhale();
    };

    /**
     * Stops the continuous looping breathing animation.
     */
    hudPlane.stopBreathing = function () {
        hudPlane._isBreathingLoop = false;
        if (hudPlane._breathTween) {
            hudPlane._breathTween.stop();
            // Optionally fade out to 0
            new TWEEN.Tween(uniforms.uBreathIntensity)
                .to({ value: 0.0 }, 1000)
                .easing(TWEEN.Easing.Cubic.InOut)
                .start();
        }
    };


    //ANIMATION
    hudPlane.tweenDeco = function (
        mode = 'showDeco',
        duration = 2000,
        delay = 0
    ) {
        let progress = { value: 0 };
        let startRot = uniforms.uFlowerRotation.value;
        let startHeadSize = uniforms.uHeadSpriteSize.value;

        let endRot = HUD_CONFIG_SCENARIO[mode].FLOWER_ROTATION;
        let endHeadSize = HUD_CONFIG_SCENARIO[mode].HEAD_SPRITE_SIZE;

        return new TWEEN.Tween(progress)
            .to({ value: 1 }, duration)
            .easing(TWEEN.Easing.Cubic.InOut)
            .delay(delay)
            .onUpdate((obj) => {
                const alpha = obj.value;
                uniforms.uFlowerRotation.value =
                    startRot + (endRot - startRot) * alpha;
                uniforms.uHeadSpriteSize.value =
                    startHeadSize + (endHeadSize - startHeadSize) * alpha;
            })
            .start()
    };

    // target
    // {key: value, key2: value2, ...}

    function _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function _runSyncTweens(target, duration, delay = 0, easing = TWEEN.Easing.Cubic.InOut) {
        for (let key in target) {
            _runTween(key, target[key], duration, delay, easing);
        }
        // Wait for both the delay and the duration to ensure all tweens finish
        await _delay(duration + delay);
    }

    function _runTween(key, to, duration, delay = 0, easing = BACK_IN_OUT_DEFAULT) {
        if (!uniforms[key]) return;
        return new TWEEN.Tween(uniforms[key])
            .to({ value: to }, duration)
            .delay(delay)
            .easing(easing)
            .start();
    }

    hudPlane.runTweenHideRNotch = async function (duration = 1000) {
        // Trigger the physics impulse so the bar falls as it disappears
        hudPlane.applyBeamImpulse();

        await _runSyncTweens({
            uRNotchHRatio: 0,
            uRNotchWRatio: 0,
            uRNotchBarThickness: HUD_CONFIG.R_NOTCH_BAR_THICKNESS, // Reset thickness
            uRNotchBarProgress: 0, // Cleanup progress bar
            uBNotchBarAlpha: 0.0,  // Cleanup bottom bar (ghost fix)
        }, duration);

        // Reset physics after fall duration (ensure bars are off-screen)
        setTimeout(() => hudPlane.resetBarPhysics(), duration + 2000);
    }

    hudPlane.runTweenShowRNotch = async function (duration) {
        await _runSyncTweens({
            uRNotchHRatio: HUD_CONFIG.R_NOTCH_H_RATIO,
            uRNotchWRatio: HUD_CONFIG.R_NOTCH_W_RATIO,
            uRNotchBarThickness: HUD_CONFIG.R_NOTCH_BAR_THICKNESS, // Restore default thickness
            uRNotchBarProgress: HUD_CONFIG.R_NOTCH_BAR_PROGRESS, // Restore progress
        }, duration);
    }

    hudPlane.runTweenHideIsland = async function (duration = 1000) {
        if (hudPlane.labelsContainer) hudPlane.labelsContainer.style.display = 'none';
        if (hudPlane.navLabelsContainer) hudPlane.navLabelsContainer.style.display = 'none';

        // Shrink all navigation buttons to 0 width
        if (hudPlane.navButtons) {
            hudPlane.navButtons.forEach(btn => btn.hide(duration * 0.5));
        }

        // Trigger the physics fall of the island bars
        barPhysicsIsl1.isActive = true;
        barPhysicsIsl1.vel.set(-100 + Math.random() * -200, -100);
        barPhysicsIsl1.angVel = (Math.random() - 0.5) * 5.0;

        barPhysicsIsl2.isActive = true;
        barPhysicsIsl2.vel.set(-150 + Math.random() * -200, -50);
        barPhysicsIsl2.angVel = (Math.random() - 0.5) * 5.0;

        await _runSyncTweens({
            uIslBarMarginRightRatio: 0.4,
        }, 0.5 * duration);

        await _runSyncTweens({
            uIslToMainWRatio: -1.0,
        }, 0.5 * duration);
    }

    //show island
    hudPlane.runTweenShowIsland = async function (duration = 2000) {
        //make it breathe too
        hudPlane.breathe();
        hudPlane.resetBarPhysics();

        // Restore Navigation Buttons with proper Wh ratios
        if (hudPlane.navButtons) {
            hudPlane.navButtons[0].show(duration * 0.5, 1.0); // CV (Square)
            hudPlane.navButtons[1].show(duration * 0.5, 2.2); // WORK
            hudPlane.navButtons[2].show(duration * 0.5, 1.8); // LAB
            hudPlane.navButtons[3].show(duration * 0.5, 2.0); // ABOUT
        }

        _runSyncTweens({
            uIslBarMarginRightRatio: 0.02,
        }, 1 * duration);  // show island

        _runSyncTweens({
            uIslToMainWRatio: 0.32,
        }, 0.5 * duration);  // show island

        if (hudPlane.labelsContainer) hudPlane.labelsContainer.style.display = 'block';
        if (hudPlane.navLabelsContainer) hudPlane.navLabelsContainer.style.display = 'block';
    }

    hudPlane.isOpen = true; // Initial state matches boot
    hudPlane.isTweening = false;

    hudPlane.runTweenClose = async function (d = 2000) {
        if (hudPlane.isTweening) return;
        hudPlane.isTweening = true;
        hudPlane.isOpen = false;
        hudPlane.breathe();
        // Trigger Transition Effects (Grid ON)
        _runTween('uGridLock', 1.0, 300);
        if (scene.orbitControls && scene.orbitControls.showEdgeUI) scene.orbitControls.showEdgeUI();
        uniforms.uIsAutoElec.value = 1.0;
        uniforms.uElecStartTime.value = uniforms.iTime.value - HUD_CONFIG.DUR_FILL;

        // 1. Hide Island
        const closeTime = d;

        //add breathe

        await hudPlane.runTweenHideIsland(closeTime * 0.2);

        // 2 hide deco
        await hudPlane.runTweenHideDecos(0.2 * closeTime);

        await _runSyncTweens({
            uCutSize: 0,
            uBNotchHRatio: 0,
            uBNotchWRatio: 0,
            uFlowerScale: 0.1,
            uRNotchHRatio: 0,
            uRNotchWRatio: 0,

        }, 0.2 * closeTime);

        await _runSyncTweens({
            uGrokScaleFactor: 0.05,
            uVerticalMarginPct: 0.5,
        }, 0.4 * closeTime);

        // LINGER EFFECT: Wait before turning off scanning grid
        await _delay(500);

        // Turn OFF grid
        uniforms.uIsAutoElec.value = 0.0; // Stop cycle while locked
        _runTween('uGridLock', 0.0, 600); // Smooth fade out
        if (scene.orbitControls && scene.orbitControls.hideEdgeUI) scene.orbitControls.hideEdgeUI();

        hudPlane.isTweening = false;
    }

    hudPlane.runTweenOpen = async function (openTime = 1800, { isIncludedIsland = true, isIncludedDecos = true } = {}) {
        if (hudPlane.isTweening) return;
        hudPlane.isTweening = true;
        // hudPlane.isOpen = true; // Moved to end of animation to prevent early scroll morph triggers
        // Trigger Transition Effects (Grid ON)
        hudPlane.breathe();



        // 1. Parallel: Smooth Grid Fade-in (Prevents "Snapping")
        // We use a shorter duration for a snappier activation
        _runTween('uGridLock', 1.0, 500, 0, TWEEN.Easing.Cubic.Out);
        if (scene.orbitControls && scene.orbitControls.showEdgeUI) scene.orbitControls.showEdgeUI();
        uniforms.uIsAutoElec.value = 1.0;
        // Start 40% filled to allow the "Running" effect to be visible during the open animation
        uniforms.uElecStartTime.value = uniforms.iTime.value - HUD_CONFIG.DUR_FILL * 0.4;

        // 2. Sequential: Decrease vertical margin
        await _runSyncTweens({
            uVerticalMarginPct: 0,

        }, 0.4 * openTime);

        // 2. Show corner and notch
        await _runSyncTweens({
            uCutSize: 10, //10
            uBNotchHRatio: 0.02, //0.02
            uBNotchWRatio: 0.6, // 0.06
            uFlowerScale: 2.19, //2.19
            uRNotchHRatio: 0.4, //0.4
            uRNotchWRatio: 0.02, // 0.02

        }, 0.2 * openTime);


        // 3. Show deco
        if (isIncludedDecos) {
            await hudPlane.runTweenShowDecos(0.2 * openTime);
        }


        // 4. Show Island
        if (isIncludedIsland) {
            await hudPlane.runTweenShowIsland(0.2 * openTime);
        }

        // LINGER EFFECT: Wait before turning off scanning grid
        await _delay(300);

        // Turn OFF grid - Smart Sync (Fast-Forward Strategy)
        // Instead of waiting, we FORCE the cycle to the "Wipe" phase immediately if it's currently filling/holding.
        const nowSec = uniforms.iTime.value;
        const startSec = uniforms.uElecStartTime.value;
        const totalCycle = HUD_CONFIG.DUR_FILL + HUD_CONFIG.DUR_HOLD + HUD_CONFIG.DUR_WIPE + HUD_CONFIG.DUR_PAUSE;
        let currentCycleT = (nowSec - startSec) % totalCycle;

        const startOfWipe = HUD_CONFIG.DUR_FILL + HUD_CONFIG.DUR_HOLD;
        const endOfWipe = startOfWipe + HUD_CONFIG.DUR_WIPE;

        let waitMs = 0;

        if (currentCycleT < startOfWipe) {
            // Case 1: In Fill/Hold -> Jump forward to Wipe Start
            const timeJump = startOfWipe - currentCycleT;
            uniforms.uElecStartTime.value -= timeJump;
            // Now effectively at startOfWipe, wait for wipe duration
            waitMs = HUD_CONFIG.DUR_WIPE * 1000;
        } else if (currentCycleT < endOfWipe) {
            // Case 2: Already Wiping -> Wait remaining wipe time
            waitMs = (endOfWipe - currentCycleT) * 1000;
        }
        // Case 3: Paused -> No wait needed (already clear)

        if (waitMs > 0) await _delay(waitMs);

        uniforms.uIsAutoElec.value = 0.0; // Stop cycle while locked (Border is now naturally wiped)
        _runTween('uGridLock', 0.0, 800); // Natural, smooth fade out
        if (scene.orbitControls && scene.orbitControls.hideEdgeUI) scene.orbitControls.hideEdgeUI();
        await _delay(800);
        _runTween('uGrokScaleFactor', 0.45, 0.75 * openTime);

        hudPlane.isOpen = true; // Animation complete, now we can allow scroll morphing
        hudPlane.isTweening = false;

        // Dispatch reveal event to sync Title Text and other UI
        window.dispatchEvent(new CustomEvent('hudOpened'));
    }

    hudPlane.toggleGarden = function () {
        // toggle the uniform uIsGardenFlower
        uniforms.uIsGardenFlower.value = 1.0 - uniforms.uIsGardenFlower.value;
    }

    hudPlane.runTweenHideDecos = async function (totalTime = 2000, callback = null) {
        await _runSyncTweens({
            uFlowerRotation: HUD_CONFIG.FLOWER_ROTATION,
            uHeadSpriteSize: HUD_CONFIG.HEAD_SPRITE_SIZE,
            uGrokOffsetY: -2,
        }, totalTime * 0.95);

        await _runSyncTweens({
            uFlowerScale: HUD_CONFIG.FLOWER_SCALE,

        }, totalTime * 0.05);
        if (callback) {
            callback();
        }
    }

    // add a hide deco tween with reversed order
    hudPlane.runTweenShowDecos = async function (totalTime = 2000) {
        await _runSyncTweens({
            uFlowerScale: 2.19,
        }, totalTime * 0.05);

        await _runSyncTweens({
            uFlowerRotation: 0, // random either  0 or 2*PI,
            uHeadSpriteSize: 0,
            uGrokOffsetY: 0.0,
        }, totalTime * 0.95);


    }

    window.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();

        if (key === 'l') {
            // Guard: Prevent HUD toggling during existing HUD animations OR global scene transitions
            if (hudPlane.isTweening || (scene && scene.isTransitioning)) {
                console.log("[HUD] Toggle blocked: System busy.");
                return;
            }

            if (hudPlane.isOpen) {
                hudPlane.runTweenClose();
            } else {
                hudPlane.runTweenOpen();
            }
        }

        if (key === 'f') {
            hudPlane.tweenFallRightBar();
        }
    });

    hudPlane.tweenFallRightBar = function () {
        if (barPhysicsR.isActive) return;

        // Mock a "structural snap" as an impulse
        // Applying it at the top of the bar for maximum rotational momentum
        const resY = scene.height || window.innerHeight;
        const vMarginPx = resY * (uniforms.uMarginPct.value + uniforms.uVerticalMarginPct.value);
        const bsY = (resY - vMarginPx * 2.0) * 0.5;
        const rNotchHRatio = uniforms.uRNotchHRatio.value;
        const bl = bsY * rNotchHRatio * 0.8;

        barPhysicsR.isActive = true;

        // Force: Pushing it right and slightly up from the top-left corner
        const impulse = new THREE.Vector2(1200, 400);
        const r = new THREE.Vector2(0, bl); // Top of the bar

        barPhysicsR.vel.add(impulse.clone().divideScalar(barPhysicsR.mass));
        const torque = (r.x * impulse.y - r.y * impulse.x);
        barPhysicsR.angVel += torque / barPhysicsR.getMOI(bl);

        // --- Trigger Island Bars Falling Too ---
        setTimeout(() => {
            // Bar 1
            barPhysicsIsl1.isActive = true;
            // Push out and down
            barPhysicsIsl1.vel.set(-100 + Math.random() * -200, -100);
            barPhysicsIsl1.angVel = (Math.random() - 0.5) * 5.0;

            // Bar 2 (slight delay?)
            barPhysicsIsl2.isActive = true;
            barPhysicsIsl2.vel.set(-150 + Math.random() * -200, -50);
            barPhysicsIsl2.angVel = (Math.random() - 0.5) * 5.0;
        }, 100);

        // --- PERFORMANCE CLEANUP ---
        setTimeout(() => {
            barPhysicsR.isActive = false;
            barPhysicsB.isActive = false;
            barPhysicsIsl1.isActive = false;
            barPhysicsIsl2.isActive = false;
        }, 4000);
    };

    hudPlane.setGardenMode = (isFlower) => {
        uniforms.uIsGardenFlower.value = isFlower ? 1.0 : 0.0;
    };

    hudPlane.tweenGardenMode = (isFlower, duration = 800) => {
        return new TWEEN.Tween(uniforms.uIsGardenFlower)
            .to({ value: isFlower ? 1.0 : 0.0 }, duration)
            .easing(TWEEN.Easing.Cubic.InOut)
            .start();
    };

    return hudPlane;
}

function getHUDFrameFS() {
    return `
precision highp float;
uniform float iTime, uMarginPct, uVerticalMarginPct, uIslToMainWRatio;
uniform float uBNotchWRatio, uBNotchHRatio, uRNotchHRatio, uRNotchWRatio, uCutSize;
uniform float uIsAutoElec, uElecStartTime, uFlowerGlow, uFlowerRotation, uHeadSpriteSize, uHeadScale, uFlowerGlitch, uGridLock, uRNotchVibeB, uRNotchVibeT, uBNotchBarProgress, uBNotchBarAlpha, uBNotchBarMarginX, uBNotchBarMarginY, uRNotchBarProgress, uRNotchBarThickness, uNavCount, uNavigatorVisibility, uNavGap, uNavCutSize, uIsGardenFlower, uGrokScaleFactor, uGrokOffsetY;
uniform float uNavVis[6], uNavWH[6];
uniform float uBreathAutoStrength, uBreathManualStrength;
uniform vec2 uRBarPos;
uniform float uRBarRot;
uniform vec2 uBBarPos;
uniform float uBBarRot;
uniform vec2 uIslBar1Pos, uIslBar2Pos;
uniform float uIslBar1Rot, uIslBar2Rot;
uniform float uBeamMaxHeight, uBeamWaveThickness, uBeamBaseThickness, uBeamBloom, uBeamWobble, uBeamGlowStrength, uBeamSpeed, uBeamFreq, uBeamTrimRatio, uBeamGrowth, uBeamAttachRatio;
uniform vec3 uBNotchBarColor, uRNotchBarActiveColor, uRNotchBarInactiveColor, uBeamColor;
uniform vec3 uFlowerColor;
uniform vec2 iResolution, uPosStart, uPosHead, uDiamondRot;
varying vec2 vUv;

const vec3 BORDER_COLOR = ${toVec3(HUD_CONFIG.BORDER_COLOR)};
uniform vec3 uOutsideColor;
const vec3 ERR_RED = ${HUD_ADAPTIVE_CONFIG.COLORS.BAD};
uniform float uBorderThickRatio; 
uniform float uBreathIntensity;
uniform vec3 uBreathColor;
const float NOTCH_ANGLE = ${HUD_CONFIG.NOTCH_ANGLE.toFixed(4)}, RIGHT_NOTCH_ANGLE = ${HUD_CONFIG.RIGHT_NOTCH_ANGLE.toFixed(4)}; 
const float TL_GAP = ${HUD_CONFIG.TL_GAP.toFixed(4)}, CORNER_RADIUS = ${HUD_CONFIG.CORNER_RADIUS.toFixed(4)};
const float PATTERN_WIDTH = ${HUD_CONFIG.PATTERN_WIDTH.toFixed(4)}, PATTERN_GAP = ${HUD_CONFIG.PATTERN_GAP.toFixed(4)}, PATTERN_LINE_THICK = ${HUD_CONFIG.PATTERN_LINE_THICK.toFixed(4)}, PATTERN_HEIGHT_PCT = ${HUD_CONFIG.PATTERN_HEIGHT_PCT.toFixed(4)}; 

uniform float uGridSize;
uniform float uGridThickness;
uniform float uGridPulseSpeed;
uniform float uGridPulseDensity;
const float R_NOTCH_BAR_DIAMOND_SIZE = ${HUD_CONFIG.R_NOTCH_BAR_DIAMOND_SIZE.toFixed(4)};
uniform float uIslBarHeightRatio, uIslBarGapRatio, uIslBarMarginLeftRatio, uIslBarMarginRightRatio, uIslBarMarginYRatio;
uniform float uIslBarProgress1, uIslBarProgress2;
const float ELEC_SPEED = ${HUD_CONFIG.ELEC_SPEED.toFixed(4)}, ELEC_FREQUENCY = ${HUD_CONFIG.ELEC_FREQUENCY.toFixed(4)}, ELEC_INTENSITY = ${HUD_CONFIG.ELEC_INTENSITY.toFixed(4)}; 
const float SPRITE_INDEX = ${HUD_CONFIG.SPRITE_INDEX.toFixed(1)}, SPRITE_COLS = ${HUD_CONFIG.SPRITE_COLS.toFixed(1)}, SPRITE_ROWS = ${HUD_CONFIG.SPRITE_ROWS.toFixed(1)};   
const float DUR_FILL = ${HUD_CONFIG.DUR_FILL.toFixed(4)}, DUR_HOLD = ${HUD_CONFIG.DUR_HOLD.toFixed(4)}, DUR_WIPE = ${HUD_CONFIG.DUR_WIPE.toFixed(4)}, DUR_PAUSE = ${HUD_CONFIG.DUR_PAUSE.toFixed(4)}; 
const float SURGE_GRID_SIZE_PX = ${HUD_CONFIG.SURGE_GRID_SIZE_PX.toFixed(4)}, SURGE_GRID_THICK_PX = ${HUD_CONFIG.SURGE_GRID_THICK_PX.toFixed(4)}, RING_SPEED = ${HUD_CONFIG.RING_SPEED.toFixed(4)}, RING_INTENSITY = ${HUD_CONFIG.RING_INTENSITY.toFixed(4)};
uniform sampler2D uSpriteSheet;

// --- FLOWER / FIREFLY CONSTANTS ---
const float pi = 3.1415926;
const int FLY_COUNT = 40;
uniform float uFlyCount, uFlySpeed, uFlowerWind, uFlowerScale;
uniform vec2 uFlowerNotchPos;

float hash(float n) { return fract(sin(n) * 43758.5453123); }

// --- FLOWER / FIREFLY HELPERS ---
float pingPong(float v) {
    const float amplitude = 1.;
    const float t = pi * 2.0;
    float k = 4.0*amplitude / t;
    float r = mod(v, t);
    float d = floor(v / (0.5 * t));
    return mix(k * r - amplitude, amplitude * 3. - k * r, mod(d, 2.0));
}

float getRad(vec2 q) {
    return atan(q.y, q.x);
}

vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1. + 2.*fract(sin(p) * 53758.5453123);
}

vec2 noise2(vec2 tc) { return hash2(tc); }

float firefly(vec2 p, float size) {
    // Inverted from original snippet usage: We want 1.0 at center, 0.0 at edge
    return 1.0 - smoothstep(0.0, size, length(p));
}

// Modified drawFlower to output color directly with alpha handling
vec4 drawFlower(vec4 current, vec2 p, vec2 flowerP, float t, float count, float ratio) {
    // Coordinate shift (from original shader)
    // Linked uFlowerWind to the sway amplitude
    vec2 q = p - flowerP - vec2(uFlowerWind * cos(3.0*iTime), uFlowerWind * sin(3.0*iTime));
    vec2 rootP = p - flowerP - vec2(0.02 * cos(3.0*iTime) * p.y, -0.48 + uFlowerWind * sin(3.0*iTime));
    
    // Scale Y by ratio to maintain aspect if needed (logic from original)
    q.y *= ratio;
    
    vec3 col = current.rgb;
    float alpha = current.a;

    // Stem
    float width = 0.01;
    float h = 0.5;
    float w = 0.0005;
    
    float stemMask = (1.0 - smoothstep(h, h + width, abs(rootP.y))) * 
                     (1.0 - smoothstep(w, w + width, abs(rootP.x - 0.1 * sin(4.0 * rootP.y + pi * 0.35))));
    
    vec3 stemCol = vec3(0.5, 0.7, 0.4); // Keep stem green? Or make it sci-fi? User said "petals". I'll keep stem green for contrast.
    col = mix(col, stemCol, stemMask);
    alpha = max(alpha, stemMask);

    // Flower - Using uFlowerColor
    vec3 petalBase = uFlowerColor * 0.5; 
    vec3 petalTip = mix(uFlowerColor, vec3(1.0), 0.5); 
    
    vec3 flowerCol = mix(petalBase, petalTip, smoothstep(0.0, 1.0, length(q) * 10.0));
    
    // --- FLOWER GLOW ENHANCEMENT ---
    flowerCol += uFlowerGlow * uFlowerColor * pow(clamp(1.0 - length(q) * 4.0, 0.0, 1.0), 3.0) * 2.0;
    
    float r = 0.1 + 0.05 * (pingPong(getRad(q) * count + 2.*q.x * (t - 1.0)));
    float flowerMask = smoothstep(r, r + 0.02, length(q)); // 0 = flower, 1 = background
    
    // Inverse mask because original code mixed (flower, col, mask) where 1 was col.
    // So mask < 1 is flower.
    float fMask = 1.0 - flowerMask;
    col = mix(col, flowerCol, fMask);
    alpha = max(alpha, fMask);

    // Buds
    float r1 = 0.04;
    vec3 budCol = mix(uFlowerColor * 0.8, vec3(1.0), length(q) * 10.0);
    // Bud Glow
    budCol += uFlowerGlow * vec3(1.0) * pow(clamp(1.0 - length(q) * 20.0, 0.0, 1.0), 2.0) * 3.0;
    
    float budMask = 1.0 - smoothstep(r1, r1 + 0.01, length(q));
    col = mix(col, budCol, budMask);
    alpha = max(alpha, budMask);

    return vec4(col, alpha);
}

vec4 drawGrok(vec4 current, vec2 pGrok) {
    // Singularity Pulse: Activated by hover (uFlowerGlow 1.0 -> 1.5)
    float hoverFactor = clamp((uFlowerGlow - 1.0) / 0.5, 0.0, 1.0);
    
    // Double-heartbeat modulation logic
    float pulseSlow = sin(iTime * 3.0) * 0.5 + 0.5;
    float pulseFast = sin(iTime * 15.0) * 0.5 + 0.5;
    
    // Ring radius breathes smoothly, Slash fluctuates like a digital data-stream
    float ringMod = (pulseSlow * 0.04 + pulseFast * 0.01) * hoverFactor;
    float slashMod = (pulseFast * 0.02) * hoverFactor;

    // Math logic from Grok snippet with pulse modulation
    float gDist = length(pGrok) - (0.5 + ringMod) + (0.01 + slashMod) / (pGrok.x - pGrok.y + 1e-5);
    float grokI = 0.1 / abs(gDist);
    
    // Tint with theme
    vec3 col = uFlowerColor * grokI;
    // Digital "Glow" enhancement (White-hot core)
    col += vec3(1.0) * pow(clamp(grokI * 0.4, 0.0, 1.0), 3.0);
    
    float alpha = clamp(grokI, 0.0, 1.0);
    return vec4(mix(current.rgb, col, alpha), max(current.a, alpha));
}


float noise(float x) {
    float i = floor(x), f = fract(x);
    return mix(hash(i), hash(i + 1.0), f * f * (3.0 - 2.0 * f));
}
float fbm(float x) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 3; ++i) { v += a * noise(x); x = x * 2.0 + 100.0; a *= 0.5; }
    return v;
}
float getNotchDist(vec2 p, float w, float h, float a) {
    float ar = radians(a);
    return max(dot(vec2(abs(p.x), p.y) - vec2(w * 0.5, 0.0), vec2(sin(ar), cos(ar))), p.y - h);
}
float sdRhombus(vec2 p, float s) { return abs(p.x) + abs(p.y) - s; }
float sdVerticalLine(vec2 p, float h, float t) {
    vec2 d = abs(p) - vec2(t, h); return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}
float sdBox2D(vec2 p, vec2 b) {
    vec2 d = abs(p) - b; return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}
float sdIslandShape(vec2 p, vec2 bs, float h, float w, float tc) {
    float top = bs.y, left = -bs.x;
    float dTL = dot(p - vec2(left + tc, top), vec2(-0.7071, 0.7071));
    float dRight = dot(p - vec2(left + w, top), vec2(0.7071, -0.7071));
    float dShape = max(max(p.y - top, -(p.x - left)), -(p.y - (bs.y - h)));
    return max(max(dShape, dRight), dTL);
}

float sdMainFrame(vec2 p, vec2 bs) {
    // Distance to the basic AABB box
    float dBox = max(abs(p.x) - bs.x, abs(p.y) - bs.y);

    float dCorner = (abs(p.x) + abs(p.y) - (bs.x + bs.y - uCutSize)) * 0.7071;
    if (p.x > 0.0 && p.y > 0.0) dCorner = -1e5; // Exclude top-right corner
    float dFrame = max(dBox, dCorner) - CORNER_RADIUS;
    
    vec2 mw = bs * 2.0;
    float dNotchB = mix(1e5, getNotchDist(vec2(p.x, p.y + bs.y), mw.x * uBNotchWRatio, mw.y * uBNotchHRatio, NOTCH_ANGLE), step(0.001, uBNotchHRatio));
    float dNotchR = mix(1e5, getNotchDist(vec2(p.y, bs.x - p.x), mw.y * uRNotchHRatio, mw.x * uRNotchWRatio, RIGHT_NOTCH_ANGLE), step(0.001, uRNotchHRatio));
    
    float islH = uCutSize + mw.y * (uIslBarMarginYRatio * 2.0 + 2.0 * uIslBarHeightRatio + 1.0 * uIslBarGapRatio);
    float navButtonHeight = islH + CORNER_RADIUS;
    
    float navW = 0.0;
    for (int i = 0; i < 6; i++) {
        if (uNavVis[i] > 0.01 && uNavWH[i] > 0.01) {
            navW += (navButtonHeight * uNavWH[i] + uNavGap);
        }
    }
    if (navW > 0.0) navW -= uNavGap;
    navW *= uNavigatorVisibility;

    float dSocket = sdIslandShape(p, bs, islH - CORNER_RADIUS, mw.x * uIslToMainWRatio, uCutSize) - TL_GAP - CORNER_RADIUS;
    
    // Navigator Socket (Top Right)
    float xGrpR = bs.x + CORNER_RADIUS;
    float xGrpL = xGrpR - navW;
    float yGrpT = bs.y + CORNER_RADIUS;
    float yGrpB = bs.y - islH;
    
    float dNavHole = max(max(p.y - (yGrpT + 10.0), -(p.y - (yGrpB - uNavGap))), max(p.x - (xGrpR + 10.0), -(p.x - (xGrpL - uNavGap))));
    float dNavSocket = mix(1e5, dNavHole, step(0.01, uNavigatorVisibility));
    
    return max(max(max(dFrame, -min(dNotchB, dNotchR)), -dSocket), -dNavSocket);
}
vec3 getSpriteLight(vec2 p, vec2 center, float size) {
    vec2 o = (p - center);
    float d = length(o);
    
    // 1. Atmospheric Glow (Halo effect outside the quad)
    float gDist = d / (size * 1.5);
    vec3 glow = BORDER_COLOR * pow(0.5 / (gDist + 0.15), 2.0) * 0.8;
    glow += vec3(1.0) * (0.005 / (gDist * gDist + 0.005)) * smoothstep(1.0, 0.0, gDist); 

    // 2. Sprite Sampling
    vec2 rotO = mat2(uDiamondRot.x, -uDiamondRot.y, uDiamondRot.y, uDiamondRot.x) * (o / uHeadScale);
    vec2 uv = (rotO / size) * 0.5 + 0.5;
    
    vec3 core = vec3(0.0);
    if (uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0) {
        float colIdx = mod(SPRITE_INDEX, SPRITE_COLS);
        float rowIdx = floor(SPRITE_INDEX / SPRITE_COLS);
        vec2 atlasUV = uv / vec2(SPRITE_COLS, SPRITE_ROWS) + vec2(colIdx / SPRITE_COLS, (SPRITE_ROWS - 1.0 - rowIdx) / SPRITE_ROWS);
        vec4 tex = texture2D(uSpriteSheet, atlasUV);
        
        // Brilliant White Core: Mix theme into white based on texture density
        core = mix(BORDER_COLOR * 0.5, vec3(2.5), pow(tex.a, 1.5)) * tex.a;
    }
    
    // 3. Falloff to prevent hard edges at optimization boundary
    // Fade out completely by 6x radius or 100px max
    float maxDist = max(size * 6.0, 80.0);
    float falloff = 1.0 - smoothstep(maxDist * 0.8, maxDist, d);
    
    return (core + glow) * falloff;
}
float getDiamondDistOpt(vec2 p, vec2 c, float s) {
    vec2 o = p - c; o = mat2(uDiamondRot.x, -uDiamondRot.y, uDiamondRot.y, uDiamondRot.x) * o;
    return abs(o.x) + abs(o.y) - s;
}

// --- NEW: Square Electric Grid Logic ---
float calcSquareDistance(vec2 p) {
    return max(abs(p.x), abs(p.y));
}

vec2 calcSquareOffset(vec2 uv) {
    return fract(uv + 0.5) - 0.5;
}

float beam(vec2 uv, vec2 p1, vec2 p2, float max_height, float offset, float speed, float freq, float thickness) {
    vec2 dir = p2 - p1;
    float len = length(dir);
    if(len < 1.0) return 0.0;
    vec2 unit_dir = dir / len;
    vec2 rel_uv = uv - p1;
    
    float t = dot(rel_uv, unit_dir) / len;
    t = clamp(t, 0.0, 1.0);
    
    vec2 projection = unit_dir * t * len;
    float dist = length(rel_uv - projection);

    float height = max_height * (uBeamWobble + (1.0 - t));
    float ramp = smoothstep(0.0, 0.1, t) * smoothstep(1.0, 0.9, t);
    height *= ramp;

    // Use normalized length for frequency to stay resolution independent
    float wave = sin(t * freq * 100.0 - iTime * speed + offset) * height;
    
    // Optimized core: Reduced softening bias (0.5 -> 0.1) for a "hotter" center
    float core = thickness / (abs(dist + wave) + 0.1); 
    core = pow(core, uBeamBloom);
    
    // Improved glow: Slower exponential decay (0.15 -> 0.06) for a more voluminous aura
    float ambientGlow = exp(-dist * 0.06) * uBeamGlowStrength;
    
    return max(0.0, (core + ambientGlow));
}

void main() {
    vec2 res = iResolution.xy; vec2 p = vUv * res - res * 0.5;
    float resX = res.x;
    float resY = res.y;
    float hMargin = resY * uMarginPct; 
    float vMargin = resY * (uMarginPct + uVerticalMarginPct);
    vec2 bs = vec2(res.x - hMargin * 2.0, res.y - vMargin * 2.0) * 0.5;
    float mw = bs.x * 2.0;
    float mh = bs.y * 2.0;
    bool inBottomNotchZone = (abs(p.x) < (mw * uBNotchWRatio * 0.5 + 5.0) && p.y < -bs.y + mh * uBNotchHRatio + 5.0);

    // --- GARDEN LAYER START ---
    
    // Calculate Bottom Notch Height (The "Garden" Height)
    float bNotchH = mh * uBNotchHRatio;
    // Notch depth (vertical) depends on angle and width, but uBNotchHRatio is the 'depth' param?
    // In HUD_CONFIG: B_NOTCH_TO_MAIN_H_RATIO is depth.
    // getNotchDist uses getNotchDist(px, py + bs.y...)
    // Bottom edge of main frame is -bs.y.
    // Notch is carved UP from there? No, notches are usually cutouts.
    // Wait, getNotchDist logic: dWall = ... dTop = py - h.
    // For bottom notch: p.y + bs.y is relative Y from bottom edge.
    // So notch extends UP into the frame by H? Or is it an extension?
    // "Cutout" implies it eats INTO the frame, so it adds more "empty" space above -bs.y.
    // User wants flowers at the bottom margin + notch.
    // The margin is the space between screen bottom (-resY/2) and frame bottom (-bs.y).
    // The notch cuts INTO the frame, so it adds more "empty" space above -bs.y.
    // So gardenTop = -bs.y + bNotchH (approx).
    
    float gardenCeiling = -bs.y + bNotchH; // Top of the notch cutout area
    float gardenFloor = -resY * 0.5; // Bottom of the screen
    float gardenHeight = gardenCeiling - gardenFloor;

    vec4 gardenLayer = vec4(0.0);
    
    // Only render garden if we are low enough (Optimization)
    if (p.y < gardenCeiling + 20.0) {
        // Calculate Notch Position Logic
        // Notch Width (mw is full width * 2? No, mw is bs.x * 2.0 = Full Width - Margins)
        // uBNotchWRatio is relative to mw.
        float notchW = mw * uBNotchWRatio;
        float notchLeft = -notchW * 0.5;
        float notchRight = notchW * 0.5;
        
        // Target X position in pixel coords (relative to center 0)
        float targetX = mix(notchLeft, notchRight, uFlowerNotchPos.x);
        
        // Target Y Position
        // 0 = Bottom of Notch (Frame Bottom Edge: -bs.y)
        // 1 = Top of Notch (gardenCeiling: -bs.y + bNotchH)
        float notchBottom = -bs.y;
        float notchTop = -bs.y + bNotchH;
        float targetY = mix(notchBottom, notchTop, uFlowerNotchPos.y);

        // --- 2D Rotation (Pivoted at the ROOT / Bottom Center) ---
        // targetY is the petal center. Root is roughly 1.0 gardenHeight below.
        vec2 pivot = vec2(targetX, targetY - gardenHeight);
        vec2 pr = p - pivot;
        float ang = -uFlowerRotation; 
        mat2 mRot = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
        pr = mRot * pr + pivot;

        // We want gx=0, gy=0 (flower root center) to map to (targetX, targetY).
        float gy = (pr.y - targetY) / gardenHeight;
        float gx = (pr.x - targetX) / gardenHeight;

        vec2 flowerP = vec2(gx + 0.5, gy); // 0.5 is center X in flower logic
        
        float ratio = 1.0; 

        float t = 1.0 * (1. + sin(3.0 * iTime));
        
        if (uIsGardenFlower > 0.5) {
            // --- RESTORED: Original Flower State Logic ---
            float gy = (pr.y - targetY) / gardenHeight;
            float gx = (pr.x - targetX) / gardenHeight;
            vec2 flowerP = vec2(gx + 0.5, gy); 
            
            float baseScale = 1.5; 
            float finalScale = baseScale / uFlowerScale;
            vec2 localP = (flowerP - 0.5) * finalScale + 0.5;

            // Glitch Logic (Restored to use localP)
            float glitchStrength = max(uFlowerGlitch * 0.4, uGridLock);
            float glitchY = floor(localP.y * 50.0);
            float glitchOffset = (hash(glitchY + iTime * 20.0) - 0.5) * 0.15 * glitchStrength;
            float glitchScanline = step(0.9, hash(glitchY + iTime)) * glitchStrength;
            
            vec2 glitchedP = localP;
            glitchedP.x += glitchOffset + glitchScanline * 0.05;

            gardenLayer = drawFlower(gardenLayer, glitchedP, vec2(0.618, 0.1), t, 7.0, ratio);
            
            // Secondary subtle glitch for variety
            vec2 glitchedP2 = localP;
            glitchedP2.x += (hash(floor(localP.y * 30.0) + iTime * 15.0) - 0.5) * 0.1 * glitchStrength;
            
            gardenLayer = drawFlower(gardenLayer, glitchedP2, vec2(0.418, 0.05), t*4.0, 6.0, ratio);
            gardenLayer = drawFlower(gardenLayer, glitchedP, vec2(0.818, 0.0), t*2.0, 8., ratio); 

            // Chromatic Color Split
            if (glitchStrength > 0.01) {
                 float offset = 0.02 * glitchStrength;
                 gardenLayer.r = mix(gardenLayer.r, drawFlower(vec4(0.0), glitchedP + vec2(offset, 0.0), vec2(0.618,0.1), t, 7.0, ratio).r, 0.5);
                 gardenLayer.b = mix(gardenLayer.b, drawFlower(vec4(0.0), glitchedP - vec2(offset, 0.0), vec2(0.618,0.1), t, 7.0, ratio).b, 0.5);
            }
        } else {
            // --- Grok State Logic (Quantum Drift) ---
            float glitchStrength = max(uFlowerGlitch * 0.4, uGridLock);
            
            float grokTargetY = (gardenFloor + gardenCeiling) * 0.5;
            grokTargetY += uGrokOffsetY * (gardenHeight * 0.5);
            
            float grokBaseScale = gardenHeight * uGrokScaleFactor;
            vec2 pGrok = (p - vec2(targetX, grokTargetY)) / grokBaseScale; 

            // Quantum Drift: Amplified floating sway and rotation
            float dTime = iTime * 0.8;
            vec2 driftPos = vec2(sin(dTime), cos(dTime * 0.72)) * 0.22;
            float driftRot = sin(iTime * 0.4) * 0.15;
            
            float dS = sin(driftRot), dC = cos(driftRot);
            pGrok = mat2(dC, -dS, dS, dC) * (pGrok - driftPos);

            gardenLayer = drawGrok(gardenLayer, pGrok);

            // Chromatic Color Split (Scaled to Grok Space)
            if (glitchStrength > 0.01) {
                 float grokOffset = (0.02 * glitchStrength) / grokBaseScale;
                 gardenLayer.r = mix(gardenLayer.r, drawGrok(vec4(0.0), pGrok + vec2(grokOffset, 0.0)).r, 0.5);
                 gardenLayer.b = mix(gardenLayer.b, drawGrok(vec4(0.0), pGrok - vec2(grokOffset, 0.0)).b, 0.5);
            }
        }

        // Fireflies
        float fy = (p.y - notchBottom) / max(0.001, bNotchH);
        for (int i = 0; i < FLY_COUNT; i++) {
            float seed = float(i) / float(FLY_COUNT);
            float t1 = 1.0 * (1. + sin(noise2(vec2(seed)).x * iTime));
            
            vec2 noiseVal = noise2(vec2(seed));
            // Fireflies relative to the notch center
            vec2 fireflyP = vec2((p.x - targetX) / gardenHeight, fy - 0.5) - vec2(
                noiseVal.x + noiseVal.y * t1 * 0.1,
                noiseVal.y + noiseVal.y * t1 * 0.1
            );
            
            float fly = firefly(fireflyP, 0.006 + 0.02 * seed);
            vec3 flyCol = vec3(0.1, 0.9, 0.1) * t1;
            
            gardenLayer.rgb += flyCol * fly;
            gardenLayer.a = max(gardenLayer.a, fly);
        }
    }
    // --- GARDEN LAYER END ---
    
    // --- Lifecycle Calculation ---
    float localTime = iTime - uElecStartTime;
    float totalTime = DUR_FILL + DUR_HOLD + DUR_WIPE + DUR_PAUSE;
    float cycleTime = mod(localTime, totalTime); 
    // Fixed start angle at bottom notch (-PI/2) to match fixed head position
    float startAngle = -1.570796; 
    float hPos = 0.0, tPos = 0.0, pPos = 0.0, wPos = -1.0, wStr = 0.0;
    
    if (cycleTime < DUR_FILL) {
        hPos = cycleTime / DUR_FILL;
    } else if (cycleTime < (DUR_FILL + DUR_HOLD)) {
        hPos = 1.0; float tw = cycleTime - DUR_FILL;
        if (tw < 0.5) { wPos = (tw / 0.5) * 0.6; wStr = smoothstep(0.0, 1.0, 1.0 - (tw / 0.5)); }
    } else {
        hPos = 1.0;
        float postHoldTime = cycleTime - (DUR_FILL + DUR_HOLD);
        tPos = min(1.0, postHoldTime / DUR_WIPE);
        pPos = postHoldTime / (DUR_WIPE + DUR_PAUSE);
    }

    // --- GATE: Manual/Auto Control ---
    if (uIsAutoElec < 0.5) {
        hPos = 0.0; tPos = 0.0;
    }

    // --- OPTIMIZATION: Guarded Shading ---
    float gridAlpha = smoothstep(0.9, 1.0, hPos) * (1.0 - smoothstep(0.0, 0.4, pPos));
    // Apply Grid Lock
    gridAlpha = max(gridAlpha, uGridLock);

    // Energy Linger: Extremely slow decay spanning the entire Wipe+Pause cycle
    float lingerAlpha = smoothstep(0.9, 1.0, hPos) * (1.0 - smoothstep(0.0, 1.0, pPos));
    lingerAlpha = max(lingerAlpha, uGridLock);

    // Connection Flash: A soft energetic bloom when hPos hits 1.0
    float connFlash = exp(-abs(cycleTime - DUR_FILL) * 5.0) * 0.8;

    // --- BEAM CALCULATION ---
    gardenCeiling = -bs.y + mh * uBNotchHRatio;
    // User Request: Align to Top of Bottom Notch
    float bottomBarY = gardenCeiling;
    // User Request: Full Notch Width (Corrected for Taper)
    // TopWidth = BaseWidth - Height * 1.1547
    float bottomBarW = (mw * uBNotchWRatio) - (mh * uBNotchHRatio * 1.1547);
    
    vec2 beamP1 = vec2(-bottomBarW * 0.5 + uBNotchBarProgress * bottomBarW, bottomBarY);
    
    float rightBarL = (bs.y * 2.0) * uRNotchHRatio * 0.8 * 0.5;
    vec2 beamP2 = vec2(bs.x, mix(rightBarL, -rightBarL, uBeamAttachRatio));
    
    // Vibe synchronization: Match the horizontal offset used for the right bar tip
    // Interpolate vibe strength based on attachment position
    float curVibe = mix(uRNotchVibeB, uRNotchVibeT, uBeamAttachRatio);
    beamP2.x += sin(iTime * 120.0) * curVibe * 12.0;

    // Apply centering trim (default 0.99)
    vec2 bMid = (beamP1 + beamP2) * 0.5;
    vec2 bDir = (beamP2 - beamP1) * (uBeamTrimRatio * 0.5); 
    beamP1 = bMid - bDir;
    beamP2 = bMid + bDir;

    // Apply Growth (Pivot at beamP1)
    beamP2 = mix(beamP1, beamP2, uBeamGrowth);
    
    float b_max_height = uBeamMaxHeight * resY;
    float b_wave_thick = uBeamWaveThickness * resY;
    float b_base_thick = uBeamBaseThickness * resY;
    
    float fBeam = beam(p, beamP1, beamP2, b_max_height, 0.0, uBeamSpeed, uBeamFreq * 1.5, b_wave_thick * 0.5) + 
                  beam(p, beamP1, beamP2, b_max_height, iTime, uBeamSpeed, uBeamFreq, b_wave_thick) +
                  beam(p, beamP1, beamP2, b_max_height, iTime + 0.5, uBeamSpeed + 0.2, uBeamFreq * 0.9, b_wave_thick * 0.5) + 
                  beam(p, beamP1, beamP2, 0.0, 0.0, uBeamSpeed, uBeamFreq, b_base_thick);
    // Persist beam as long as the island is expanded
    fBeam *= smoothstep(-1.0, 0.0, uIslToMainWRatio); 

    // --- OPTIMIZATION: Guarded Shading ---
    // --- Border & Complex Math Area ---
    float islH = uCutSize + mh * (uIslBarMarginYRatio * 2.0 + 2.0 * uIslBarHeightRatio + 1.0 * uIslBarGapRatio);
    float islW = mw * uIslToMainWRatio;
    float dIsland = sdIslandShape(p, bs, islH - CORNER_RADIUS, islW, uCutSize) - CORNER_RADIUS;
    
    float navButtonHeight = islH + CORNER_RADIUS;
    
    float xGrpR = bs.x + CORNER_RADIUS;
    float yGrpT = bs.y + CORNER_RADIUS;
    float yGrpB = bs.y - islH;
    
    float dNavHard = 1e5;
    float currentOffset = 0.0;
    
    for (int i = 0; i < 6; i++) {
        float vis = uNavVis[i];
        float ratio = uNavWH[i];
        float btnW = navButtonHeight * ratio;
        
        // Logical box for this button
        float bL = xGrpR - currentOffset - btnW;
        float bR = xGrpR - currentOffset;
        
        float dBtn = max(max(p.y - yGrpT, -(p.y - yGrpB)), max(p.x - bR, -(p.x - bL)));
        
        // Hide button by moving it to infinity if vis or ratio is 0
        float mask = step(0.01, vis) * step(0.01, ratio);
        dNavHard = min(dNavHard, mix(1e5, dBtn, mask));
        
        currentOffset += (btnW + uNavGap) * mask;
    }
    float dNavButtons = mix(1e5, dNavHard, uNavigatorVisibility); // Sharp interactive boundaries
    
    float dFrame = sdMainFrame(p, bs);
    float dist = min(min(dFrame, dIsland), dNavButtons);

    float absDist = abs(dist);
    float normPos = fract((atan(p.x, p.y) - startAngle) / 6.283185), mask = step(tPos, normPos) * step(normPos, hPos), intensity = 0.0, pulse = 0.0;
    // --- SUBDUED VOLUMETRIC BREATHING ---
    float autoBreath = (sin(iTime * 1.5) * 0.5 + 0.5) * uBreathAutoStrength; 
    float totalBreath = autoBreath + uBreathIntensity * uBreathManualStrength;

    // Optimized guard (60px) captures the much tighter atmospheric effects
    if (absDist < 60.0) {
        float baseNormThick = 10.0 / (resY * uBorderThickRatio);
        
        // 1. SURGICAL LAYERS (Tight Core)
        float surgicalI = 0.0;
        float haloI = 0.0;
        float coreLine = 0.0; 
        
        if (absDist < 40.0) {
            pulse = (wPos >= 0.0) ? exp(-abs(normPos - wPos) * 10.0) * wStr : 0.0;
            haloI = exp(-absDist * baseNormThick * 0.55) * 0.15;
            coreLine = pow(1.0 / (1.0 + absDist * baseNormThick * 1.3), 3.0);
            
            // --- NEW: Sharp Anti-Aliased Core Layer (Crispy Edges) ---
            float sharpCore = smoothstep(1.5, 0.0, absDist); 
            
            float elecI = 0.0;
            if (mask > 0.01 && absDist < 3.0) {
                float edgeFocus = 1.0 - smoothstep(0.0, 3.0, absDist);
                float rawNoise = pow(abs(fbm(atan(p.x, p.y) * 6.0 + iTime * 128.0)), 4.0);
                elecI = rawNoise * 0.15 * edgeFocus;
            }
            float activeMask = mask > 0.01 ? 1.0 : 0.04;
            surgicalI = (coreLine + sharpCore + elecI) * activeMask;
        }
        
        // 2. LAYERED VOLUMETRIC GLOW
        float ambientGlow = exp(-absDist * baseNormThick * 0.4) * 0.1; // Slightly boosted
        // Increased multipliers for visibility, but kept falloff tight
        float coronaGlow = exp(-absDist * baseNormThick * 0.8) * totalBreath * 1.2;
        float auraGlow = exp(-absDist * baseNormThick * 0.35) * totalBreath * 0.4;
        
        // 3. ENERGY SHIMMER (Reduced)
        float shimmer = (hash(p.x * 0.01 + p.y * 0.01 + iTime * 15.0) - 0.5) * 0.02 * uBreathIntensity;
        
        intensity = surgicalI + ambientGlow + coronaGlow + auraGlow + haloI * (mask > 0.01 ? 1.0 : 0.05) + shimmer;
        
        // Final overall boost (Reduced)
        intensity *= (1.0 + uBreathIntensity * 0.1); 
    }
    
    // Mix Border Color
    vec3 iceBorderColor = mix(BORDER_COLOR, vec3(0.4, 0.9, 1.0), 0.3);
    
    // Premium Tinting: Softer transition
    float tintFactor = clamp(uBreathIntensity, 0.0, 0.8);
    vec3 effectiveBorderColor = mix(iceBorderColor, uBreathColor, tintFactor);
    
    // White-Hot Core Logic: Kept subtle to avoid "flat" look
    float whiteHot = pow(clamp(1.0 - absDist * 0.25, 0.0, 1.0), 4.0) * totalBreath * 0.2;
    vec3 baseCol = mix(effectiveBorderColor, vec3(1.3), whiteHot);
    baseCol = mix(baseCol, vec3(1.0), pulse * 0.6);
    
    // (mask dimming is handled per-layer above via activeMask)

    // Sprites - Increased optimization bounds to prevent glow clipping (mask effect)
    vec3 dLight = vec3(0.0); float maxDI = 0.0; 
    if (abs(p.x - uPosStart.x) < 100.0 && abs(p.y - uPosStart.y) < 100.0 && tPos < 0.1) {
        vec3 l = getSpriteLight(p, uPosStart, uHeadSpriteSize);
        float f = 1.0 - smoothstep(0.0, 0.1, tPos); dLight += l * f; maxDI = max(maxDI, l.g * f);
    }
    if (abs(p.x - uPosHead.x) < 100.0 && abs(p.y - uPosHead.y) < 100.0 && hPos > 0.01 && hPos < 0.99) {
        vec3 l = getSpriteLight(p, uPosHead, uHeadSpriteSize);
        dLight += l; maxDI = max(maxDI, l.g);
    }

    // Final mix with Background Fill for Navigator
    vec3 glow = baseCol * intensity + dLight;
    
    // Procedural Fill: Inside buttons, add a cyanish atmospheric wash
    if (dist < 0.0 && dNavButtons < 0.0) {
        float fillMask = smoothstep(-5.0, -10.0, dNavButtons); // Soften fill slightly inside
        glow += BORDER_COLOR * 0.12 * uNavigatorVisibility * fillMask;
    }
    
    // Progress Bar
    vec3 barCol = vec3(0.0); float barAlpha = 0.0;
    
    // Physicalized Right Bar Transformation
    // Transformed p to local bar space
    vec2 pr = p - uRBarPos;
    float ang = uRBarRot;
    mat2 mRot = mat2(cos(ang), sin(ang), -sin(ang), cos(ang));
    pr = mRot * pr;
    
    // Bounds check removed or made global for the right bar to avoid clipping during physics
    // (We only render the bar if it's within a reasonable screen area, but large enough for the fall)
    if (p.x > -res.x * 0.5) { 
        float bl = (bs.y * 2.0) * uRNotchHRatio * 0.8 * 0.5;
        vec2 pb = pr; // pb is local bar center
        
        // Vibe Effect (B: Bottom Anchor, T: Top Anchor)
        float vibeDiv = max(0.001, 2.0 * bl);
        float factorB = (pb.y + bl) / vibeDiv; 
        float factorT = (bl - pb.y) / vibeDiv; 
        pb.x += sin(iTime * 120.0) * (uRNotchVibeB * factorB + uRNotchVibeT * factorT) * 12.0; 

        float bt = resY * uRNotchBarThickness, ds = resY * R_NOTCH_BAR_DIAMOND_SIZE * 1.5;
        float dBox = sdBox2D(pb, vec2(bt, bl));
        float dDiamondT = sdRhombus(pb - vec2(0.0, bl), ds);
        float dDiamondB = sdRhombus(pb - vec2(0.0, -bl), ds);
        float db = min(dBox, min(dDiamondT, dDiamondB));

        if (db < 2.0) {
            float LP = uRNotchBarProgress;
            // Top to Bottom: (bl - pb.y) is distance from top
            float relY = (bl - pb.y) / max(0.001, 2.0 * bl); 
            
            // Add a diamond head at the current progress position
            bool isActive = relY < LP || dDiamondT < 1.0;
            barCol = isActive ? uRNotchBarActiveColor * (1.0 + 0.5 / (1.0 + abs(db) * 0.5)) : uRNotchBarInactiveColor;
            
            // Mask alpha by uRNotchHRatio to ensure it vanishes when notch is hidden
            barAlpha = (1.0 - smoothstep(0.0, 0.4, db)) * smoothstep(0.0, 0.01, uRNotchHRatio);
        }
    }

    // --- Legacy Grid Logic Removed ---
    vec3 activeGrid = vec3(0.0);

    // --- NEW: Stroboscopic Target Grid Logic (Moved Here) ---
    // User requested to keep the same trigger logic (E key / uIsAutoElec)
    // Coords: p is in pixel space centered. We need UV in range [-0.5, 0.5] corrected for aspect
    vec2 shUV = p / resY; 
    
    // Only render if we are in the "Active" state (triggered by E)
    if (dist < -10.0) {
        
        if (lingerAlpha > 0.001) { 
            // Square logic
            vec2 gUV = shUV / (uGridSize / resY);
            vec2 sOffset = calcSquareOffset(gUV);
            float sDist = calcSquareDistance(sOffset); // From 0.0 (center) to 0.5 (edge)
            
            // Core Ripple Logic (Starts from 4 edge centers) - RESTORED
            float aspect = res.x / res.y;
            float dStart = min(
                min(length(shUV - vec2(0.0, 0.5)), length(shUV - vec2(0.0, -0.5))),
                min(length(shUV - vec2(aspect * 0.5, 0.0)), length(shUV - vec2(-aspect * 0.5, 0.0)))
            );
            float rippleA = cos(2.0 * (2.0 * dStart - iTime * uGridPulseSpeed));

            // Calculate the intensity components
            float baseThickness = uGridThickness; 
            
            // 1. Sharp Ripple Lines (Using Square Dist)
            float ripples = smoothstep(baseThickness / resY, 0.0, abs(1.0 - abs(sin(sDist * rippleA * 10.0))));
            // 2. Soft "Bloom" for Ripples
            float ripplesGlow = 0.35 * smoothstep((baseThickness * 12.0) / resY, 0.0, abs(1.0 - abs(sin(sDist * rippleA * 10.0))));

            // 3. Square Outlines (Structural)
            float sqOutline = 0.45 * smoothstep((baseThickness + 4.0) / resY, 0.0, abs(0.48 - sDist));
            // 4. Soft Outer Glow for Squares
            float sqGlow = 0.3 * smoothstep((baseThickness + 30.0) / resY, 0.0, abs(0.48 - sDist));
            
            // 5. Internal Cell Fill (Subtle Glow)
            float cellGlow = 0.12 * smoothstep(0.4, 0.0, sDist);
            
            float gridMaskVal = (ripples + ripplesGlow + sqOutline + sqGlow + cellGlow);

            // Final Color: Using BORDER_COLOR (Increased boost to 1.5 for sharper presence)
            activeGrid = BORDER_COLOR * gridMaskVal * 1.5 * (1.0 + connFlash);

            // Integrate Beam into mainland grid
            // Hot White-Core Mapping: Add white boost based on intensity
            vec3 beamFinalCol = uBeamColor * fBeam;
            beamFinalCol += vec3(1.0, 1.0, 1.0) * pow(fBeam * 0.4, 3.0); 
            
            activeGrid = mix(activeGrid, beamFinalCol, clamp(fBeam * 0.8, 0.0, 1.0));
            
            // Update the main color and alpha instead of early return for better blending
            gridAlpha = gridAlpha * clamp(gridMaskVal, 0.0, 1.0);
        }
    }

    vec3 col = (dist > 0.0) ? uOutsideColor : glow + activeGrid;
    
    // Composite Garden Layer
    // Garden is strictly "behind" the HUD frame (dist > 0.0 area)
    // But we want it to show through the "Outside Color" (which is usually dark)
    // Actually, user wants it in the "area of bottom margin + notch"
    // If dist > 0.0 (outside frame), we show garden. 
    // If dist < 0.0 (inside frame), we show HUD.
    // Note: Top of garden is fuzzy, let's mix it based on garden alpha.
    
    if (dist > 0.0) {
        // We are outside the frame (margin or notch area)
        col = mix(uOutsideColor, gardenLayer.rgb, gardenLayer.a);
    }

    // Composite Beam: Now correctly applied on top of both mainland and margin/garden areas
    vec3 beamFinalCol = uBeamColor * fBeam;
    beamFinalCol += vec3(1.0, 1.0, 1.0) * pow(fBeam * 0.4, 3.0); 
    col = mix(col, beamFinalCol, clamp(fBeam * 0.8, 0.0, 1.0));

    float borderAlpha = max(max(intensity, maxDI), barAlpha);
    float finalAlpha = (dist > 0.0) ? 1.0 : max(max(borderAlpha, clamp(gridAlpha * length(activeGrid), 0.0, 1.0)), clamp(fBeam, 0.0, 1.0));

    // --- Island Bars Implementation ---
    vec3 islandBarCol = vec3(0.0); float islandBarAlpha = 0.0;
    
    // 1. Holographic Back-Plate (Strictly inside Islands)
    if (dIsland < 0.0 || dNavButtons < 0.0) {
        col = mix(col, BORDER_COLOR * 0.06, 0.4); 
    }

    // 2. Progress Bars (can fall outside)
    float barH = mh * uIslBarHeightRatio;
    float barGap = mh * uIslBarGapRatio;
    float barMarL = mh * uIslBarMarginLeftRatio;
    float barMarR = mh * uIslBarMarginRightRatio;
    float barMarY = mh * uIslBarMarginYRatio;
    
    // Optimization: Only run heavy matrix loop if we are in the left 60% of screen
    // (Bars are spawned on left and fall down/left mostly)
    if (p.x < resX * 0.1) {
        for (int i = 0; i < 2; i++) {
            // New Logic: Use Uniform Positions
            vec2 barCenter = (i == 0) ? uIslBar1Pos : uIslBar2Pos;
            
            // Interaction Bounding Box (Screen Space)
            // Skip loop if pixel is far from bar center
            if (abs(p.y - barCenter.y) > 200.0 || abs(p.x - barCenter.x) > 400.0) continue;

            float barRot = (i == 0) ? uIslBar1Rot : uIslBar2Rot;

            // Transform P to Local
            vec2 localP = p - barCenter;
            float ang = barRot;
            mat2 mRot = mat2(cos(ang), sin(ang), -sin(ang), cos(ang));
            localP = mRot * localP;

            // Calculate Skew Box SDF
            // Bar Base Width
            float barBaseWidth = islW - (barMarL + barMarR);

            // Skew Transform for standard Box SDF
            // x' = x - y
            vec2 skewP = vec2(localP.x - localP.y, localP.y);

            // Box SDF
            vec2 halfSize = vec2(barBaseWidth * 0.5, barH * 0.5);
            vec2 d = abs(skewP) - halfSize;
            float dBar = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
            
            if (dBar < 2.0) {
                float prog = (i == 0) ? uIslBarProgress1 : uIslBarProgress2;
                
                // --- Adaptive Effects (Calculated in-shader) ---
                // Mapping: Perfect (1.0), Good (>= 54/60), Normal (>= 24/60), Bad (< 24/60)
                float tGood = ${(HUD_ADAPTIVE_CONFIG.FPS.GOOD / 60).toFixed(4)};
                float tNorm = ${(HUD_ADAPTIVE_CONFIG.FPS.NORMAL / 60).toFixed(4)};
                
                float status = 0.0;
                if (prog < tNorm) status = 3.0;
                else if (prog < tGood) status = 2.0;
                else if (prog < 1.0) status = 1.0;
                
                float speedMult = 1.0 + status * 4.0;
                float flicker = 1.0;
                if (status >= 1.0) flicker = 0.85 + 0.15 * hash(iTime * 20.0 + float(i));
                
                float jitter = 0.0;
                if (status >= 2.0) jitter = (hash(floor(iTime * 20.0) + float(i)) - 0.5) * 0.02 * (status - 1.0);
                
                // relX needs to represent progress 0..1 along the bar
                // In skew space, x runs from -Width/2 to +Width/2
                float relX = (skewP.x - (-barBaseWidth * 0.5)) / barBaseWidth;
                
                float glitchRelX = relX + jitter;
                
                // --- Sci-Fi Enhancement: Segmented Energy Bar ---
                // User Request: Reduce gap between patterns.
                // New: 5% Gap
                float segments = 25.0; 
                float segX = fract(glitchRelX * segments + 0.95); 
                float isSeg = step(0.05, segX); 
                
                // Energy Flow Texture (Animated)
                float flow = 0.5 + 0.5 * sin(glitchRelX * 10.0 - (iTime * (4.0 * speedMult)));
                float activeGlow = smoothstep(prog - 0.05, prog, glitchRelX) * (1.0 - step(prog, glitchRelX));
                
                vec3 barBaseTheme = (status >= 2.5) ? ERR_RED : BORDER_COLOR;
                vec3 activeCol = barBaseTheme * (0.8 + 0.4 * flow + activeGlow * 2.0) * flicker;
                vec3 baseStructuralCol = vec3(0.08); 
                vec3 segCol = (glitchRelX < prog) ? activeCol : baseStructuralCol;
                
                // --- Gap Enhancement: Structural Rail ---
                float rail = (1.0 - smoothstep(0.0, 0.05, abs(localP.y))); // Center Y in local space is 0

                vec3 gapCol = mix(baseStructuralCol, BORDER_COLOR * 0.15, rail);
                
                // Glass Specular Highlight
                float spec = exp(-pow(localP.y, 2.0) / (0.01 * barH));
                segCol += vec3(0.5) * spec * (relX < prog ? 1.0 : 0.3);

                vec3 thisBarCol = mix(gapCol, segCol, isSeg);
                float thisBarAlpha = (1.0 - smoothstep(0.0, 1.0, dBar));
                
                // Accumulate
                islandBarCol = mix(islandBarCol, thisBarCol, thisBarAlpha);
                islandBarAlpha = max(islandBarAlpha, thisBarAlpha);
            }
        }
    }
    
    // Composite Bars (independent of dIsland)
    col = mix(col, islandBarCol, islandBarAlpha);
    finalAlpha = max(finalAlpha, islandBarAlpha);

    // --- Bottom Notch Progress Bar ---
    // Update Zone Logic: We are now at the TOP of the Notch
    if (inBottomNotchZone || abs(p.y - (-bs.y + mh * uBNotchHRatio)) < 20.0) {
        float gardenCeiling = -bs.y + mh * uBNotchHRatio;
        float notchW = mw * uBNotchWRatio;
        float notchH = mh * uBNotchHRatio;
        
        // User Request: Thin bar aligned to top, full width
        float barH = resY * 0.005; // Fixed thinness (~0.5% screen height)
        // Correct Width for Taper
        float barW = notchW - (notchH * 1.1547);
        
        float barY = gardenCeiling; 
        
        // --- PHYSICS TRANSFORM FOR BOTTOM BAR ---
        vec2 pB = p - uBBarPos; // Shift to physics pos
        // For rotation, we pivot around center. uBBarPos is center in world space.
        float angB = uBBarRot;
        mat2 mRotB = mat2(cos(angB), sin(angB), -sin(angB), cos(angB));
        pB = mRotB * pB; 
        
        // Note: uBBarPos defaults to (0, gardenCeiling). relative pB is 0,0 at bar center.
        
        float dBox = sdBox2D(pB, vec2(barW * 0.5, barH * 0.5));
        
        // User Request: Remove Diamond Heads -> Just dBox
        float dBotBar = dBox;
        
        if (dBotBar < 5.0) {
            float prog = uBNotchBarProgress;
            // relX calculation needs local coords now
            float relX = (pB.x - (-barW * 0.5)) / barW;
            
            float flicker = 0.95 + 0.05 * hash(iTime * 15.0 + 99.0);
            
            vec3 activeCol = uBNotchBarColor * (0.9 + 0.3 * sin(relX * 15.0 - iTime * 6.0)) * flicker;
            bool isActive = relX < prog;
            vec3 slotCol = mix(vec3(0.06), activeCol, isActive ? 1.0 : 0.0);
            
            // Specular (pB.y is straight vertical distance from center axis)
            float spec = exp(-pow(pB.y, 2.0) / (0.01 * barH));
            slotCol += vec3(0.4) * spec * (isActive ? 1.0 : 0.3);
            
            // Glow Effect
            if (isActive) {
                float barGlow = exp(-abs(dBotBar) * 0.2) * 0.4;
                slotCol += uBNotchBarColor * barGlow;
            }
            
            float barAlpha = (1.0 - smoothstep(0.0, 1.0, dBotBar)) * uBNotchBarAlpha;
            col = mix(col, slotCol, barAlpha);
            finalAlpha = max(finalAlpha, barAlpha);
        }
    }

    if (dist <= 0.0 && sdIslandShape(p, bs, islH, islW, uCutSize) < 0.0 && p.y > (bs.y - uCutSize)) {
        // --- Enhancement: Cyber-Ruler (Subtle Scale) ---
        // Slant Logic: 135 Degrees (Opposite Diagonal)
        float slant = -p.y; 
        float scrollSpeed = 15.0;
        
        // Base coordinate for pattern (Slanted & Scrolling)
        float xBase = p.x + slant; 
        float xScroll = xBase - iTime * scrollSpeed;
        
        // Ruler Ticks
        float tickPeriod = 6.0;         // Minor ticks
        float bigTickPeriod = 30.0;     // Major ticks
        
        bool isMajor = (mod(xScroll, bigTickPeriod) < tickPeriod);
        float xMod = mod(xScroll, tickPeriod);
        
        // Tick Shape (Thin line)
        float tickW = isMajor ? 2.0 : 1.5; 
        float tickAlpha = 1.0 - smoothstep(0.0, tickW, abs(xMod - tickPeriod * 0.5));
        
        // Height Logic (Bottom-aligned growing up)
        // Note: xScroll changes with y now, so major ticks will slant too.
        float tickHeightRatio = isMajor ? 0.6 : 0.35;
        float tickH = uCutSize * tickHeightRatio;
        
        float yBottom = bs.y - uCutSize;
        float dY = (p.y - yBottom) - tickH;
        float yAlpha = 1.0 - smoothstep(0.0, 1.0, dY); // Fade top of tick
        
        // Combined Intensity
        // User Request: Make 0, 5, 10 (Major ticks) brighter (final tuning)
        float baseInt = isMajor ? 1.2 : 0.8; 
        float ruler = tickAlpha * yAlpha * baseInt;
        
        // Scan Cursor (A subtle passing highlight)
        // Direction: - iTime * 0.5 (Left to Right)
        // Slant applied to cursor too for consistency
        float cursor = smoothstep(0.96, 1.0, sin(xBase * 0.015 - iTime * 0.5) * 0.5 + 0.5);
        ruler += cursor * 1.5 * tickAlpha; // Highlight ticks
        
        // Very low opacity / Subtle mix
        vec3 rulerCol = BORDER_COLOR * 0.25; // Darker/Subtle
        
        // Vertical Gradient for Header Overall (Fade out at bottom of header)
        float headerV = (p.y - yBottom) / uCutSize;
        float baseFade = smoothstep(0.0, 0.5, headerV);
        
        vec3 finalHeaderCol = mix(vec3(0.0), rulerCol, ruler * baseFade);
        
        // Add minimal noise/grain
        float noise = hash(dot(p, vec2(12.3, 45.6)) + iTime) * 0.05;
        
        col = mix(col, finalHeaderCol + vec3(noise), max(ruler * baseFade, 0.1));
        finalAlpha = max(finalAlpha, ruler * baseFade + 0.1); 
    }
    gl_FragColor = vec4(mix(col, barCol, barAlpha), finalAlpha);
}
`;
}


