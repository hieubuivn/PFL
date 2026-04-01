import * as THREE from 'three';
import { gltfLoader, textureLoader, rgbeLoader } from '../../configs/setupLoaders.js'
// const blankTexture = textureLoader.load('./textures/blank2.png');
// const fireFliesTexture = textureLoader.load('./textures/spark1.png')
import { resources } from '../resources/loadResources.js'

// --- Feature Blueprints (Central Source of Truth) ---
export const WATER_PATCH_CONFIG = {
    uWaterIntensity: 0
};

export const GRID_PATCH_CONFIG = {
    uWorldGridSize: 40.0,
    uWorldGridThickness: 0.2, // Reduced from 0.35 for sharper square aesthetic
    uWorldGridPulseSpeed: 1.0,
    uWorldGridPulseDensity: 5.0,
    uWorldGridProgress: 0.0,
    uGroupGridProgress: 0.0,
    uWorldGridActive: 0.0,
    uGroupGridActive: 0.0,
    uBorderColor: new THREE.Color(0x00ffff)
};

export const DOTA_LOGO_PATCH_CONFIG = {
    uSelectedSlot: new THREE.Vector2(3, 1),
    uSpriteSize: new THREE.Vector2(4, 8),
    uSpritePixels: new THREE.Vector2(2048, 1024),
    uGlowIntensity: 0.05,
    uBorderThickness: 0.02,
    uCurrentSpeed: 5.0,
    uIconScale: 1.0
};

export const WELCOME_PATCH_CONFIG = {
    uWelcomeProgress: 0.0,
    uWelcomeRotation: Math.PI / 2,
    uWelcomePosition: new THREE.Vector2(4.9, 0.46),
    uWelcomeScale: 1.65,
    uWelcomeScanline: 1.0,
    uWelcomeOpacity: 0.0,
    uWelcomeGlow: 0.0
};

export const constantUniform = {
    // iTime: { value: 0.1 },
    // iDate: { value: new THREE.Vector4() },
    // iResolution: { value: new THREE.Vector2(window.screen.width * window.devicePixelRatio, window.screen.height * window.devicePixelRatio) },
    // glowColor: { value: new THREE.Color("red") },
    // scaleFactor: { value: 1.7 },
    // iChannel0: { value: resources.noise },
    // iChannelX: { value: resources.blank },
    // moonLightYs: { value: new THREE.Vector2(0.0, 0.1) },
    // alpha: { value: 1.0 },
    // nebulaCoreRadius: { value: 20.0 }, // Adjust this value to control the core radius of the nebula
    // nebulaTwistFactor: { value: 0.0 }, // Adjust this value to control the twistiness of the nebula
    // isStriking: { value: false },
    // enableLightning: { value: false },
    // // isRaining: { value: true },

    // uMouse: { value: new THREE.Vector2(0, 0) },

    // normalizedStrikePosX: { value: -2. },
    // normalizedStrikePosY: { value: -2. },
    // normalizedStrikePos: { value: new THREE.Vector2(-2., -2.) },
    // // normalizedStrikePosY: {value: -2.},
    // strikeWhiteCoreWidth: { value: 0.001 },  // 0.0006 - 0.002 recommended
    // // fireFliesTexture: { value: fireFliesTexture },
    // rainGlassOpacity: { value: 1. },
    // glassRainAmount: { value: 1. },
    // hasRimOnGlass: { value: true },
    // uRainHeaviness: { value: 2. },
    // uRainOffset: { value: 0.0 },
    // uRimCenter: { value: new THREE.Vector2(-0.5, 0.5) },
    // uOscillationStrength: { value: 1.0 },
    // uIsOscillating: { value: 1.0 },
    // uStormSharpness: { value: 0.0 },
    // uMoonPosition: { value: new THREE.Vector2(0.58, 0.705) },
    // uMoonSize: { value: 0.006 },
    // uMoonBrightness: { value: 2.5 },
    // uMoonBlur: { value: 0. },
    // uCraterScale: { value: 0.555 },
    // uCraterIntensity: { value: 0.280 },
    // uFarMountainOffset: { value: 0.0 },
    // uNearMountainOffset: { value: -0.5 },
    // uTransformProgress: { value: 0. },
    // uMouse: { value: new THREE.Vector2(0, 0) }, // Initialize uMouse to prevent undefined errors
    // uMergeProgress: { value: 0.0 },
    // uPointMergePos: { value: new THREE.Vector3(0, 3, 0) },
    // uModelRotationX: { value: -1.5 }, // New
    // uModelRotationY: { value: 0 },
    // uModelRotationZ: { value: 1.15 },
    // uModelScale: { value: 0.270 },
    // uModelPosition: { value: new THREE.Vector3(0, -25, 0) }, // New Vector3 Offset,

    // uEyeOpenness: { value: 0.0 },
    // uEyeActive: { value: false },
    // uFireHeightOverride: { value: 0.0 },
    // uEyeAngle: { value: -0.36 },
    // uEyeScale: { value: 0.5 },
    // uEyeFlameOffset: { value: new THREE.Vector2(0, 0.52) },
    // uFlameScale: { value: new THREE.Vector2(0.5, 0.5) },
    // uEyeScreenPosition: { value: new THREE.Vector2(0.6, 0.0) },
    // uScreenSpaceMouseClick: { value: new THREE.Vector2(0.5, 0.5) },
    // uDivSpaceMouseClick: { value: new THREE.Vector2(0.5, 0.5) },
    // uBSODState: { value: 0.0 }, // 0.0 = Normal, 1.0 = BSOD (Global/Shared)
    // uPCBSODState: { value: 0.0 },
    // uLaptopBSODState: { value: 0.0 },
    // uNetflixStartTime: { value: 0.0 },
    // uDragonEyeAspect: { value: 1.0 },
    // uWaterIntensity: { value: 0.5 },
    uIsPoba: { value: 0.0 }
};

export function addConstantUniform(scene) {
    scene.constantUniform = constantUniform;
    const customizer = new ConstantUniformsCustomizer(scene);
}


export function linkConstantUniforms(material, keys) {

    if (!Array.isArray(keys)) {
        keys = [keys];
    }
    keys.forEach(key => {
        if (constantUniform[key]) {
            // We directly link the reference. 
            // If the key didn't exist in material.uniforms, JS simply creates it.
            material.uniforms[key] = constantUniform[key];
        }
    });
}

export class ConstantUniformsCustomizer {
    /**
     * @param {THREE.Scene} scene The Three.js scene object.
     */
    constructor(scene) {
        this.scene = scene;

        // --- Main Panel Style ---
        const panel = document.createElement('div');
        Object.assign(panel.style, {
            position: 'fixed',
            left: '10px',
            top: '100px',
            background: 'white',
            color: 'black',
            padding: '0',
            borderRadius: '5px',
            fontFamily: 'monospace',
            fontSize: '12px',
            zIndex: '999999',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            minWidth: '280px',
            userSelect: 'none',
            resize: 'both',
            overflow: 'hidden', // Required for resize handle in some cases, content scrolls in body
            maxHeight: '90vh'
        });

        // --- Header Style ---
        const head = document.createElement('div');
        Object.assign(head.style, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            background: '#eee',
            padding: '6px 10px',
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
            cursor: 'move', // Indicate it's draggable
            flexShrink: '0', // Don't shrink the header
            letterSpacing: '1px'
        });

        const title = document.createElement('span');
        title.textContent = 'Global Uniform Customizer';

        const chevron = document.createElement('span');
        chevron.innerHTML = '&#x25BC;'; // Down arrow
        chevron.style.transition = 'transform 0.2s';
        chevron.style.cursor = 'pointer';

        head.appendChild(title);
        head.appendChild(chevron);

        // --- Body Style ---
        const body = document.createElement('div');
        Object.assign(body.style, {
            padding: '8px 10px 10px 10px',
            flex: '1', // Take up remaining space
            overflowY: 'auto', // Enable scrolling
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minHeight: '0' // flexbox scroll fix
        });
        this.body = body;

        // --- Refresh Button Section (Fixed) ---
        const controlsHeader = document.createElement('div');
        Object.assign(controlsHeader.style, {
            padding: '8px 10px',
            background: '#f9f9f9',
            borderBottom: '1px solid #ddd',
            flexShrink: '0'
        });

        const refreshButton = document.createElement('button');
        refreshButton.textContent = 'Refresh Uniforms';
        Object.assign(refreshButton.style, {
            padding: '6px 14px',
            width: '100%',
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'background 0.2s',
        });
        refreshButton.onclick = () => this.populateUniforms();
        controlsHeader.appendChild(refreshButton);

        // --- Add to document ---
        panel.appendChild(head);
        panel.appendChild(controlsHeader); // Insert before body
        panel.appendChild(body);
        document.body.appendChild(panel);

        // Capture initial states before any user interaction
        this.initialStates = this.captureInitialStates();

        // Initial population of uniforms
        this.populateUniforms();

        // --- Panel Drag and Collapse Logic ---
        this.makeDraggableAndCollapsible(panel, head, body, chevron);
    }

    /**
     * Captures a snapshot of the initial uniform values for reset functionality.
     */
    captureInitialStates() {
        const uniforms = (this.scene.globalUniformsHub && this.scene.globalUniformsHub.uniforms) || this.scene.constantUniform || constantUniform;
        const states = {};
        for (const key in uniforms) {
            const val = uniforms[key].value;
            if (val instanceof THREE.Color) {
                states[key] = val.clone();
            } else if (val instanceof THREE.Vector4 || val instanceof THREE.Vector3 || val instanceof THREE.Vector2) {
                states[key] = val.clone();
            } else {
                states[key] = val; // Simple types
            }
        }
        return states;
    }

    /**
     * Clears and rebuilds the UI controls based on the current scene.constantUniform.
     */
    populateUniforms() {
        // Clear all controls
        while (this.body.firstChild) {
            this.body.removeChild(this.body.firstChild);
        }
        const uniforms = (this.scene.globalUniformsHub && this.scene.globalUniformsHub.uniforms) || this.scene.constantUniform || constantUniform;

        if (!uniforms) {
            return;
        }
        const visited = new Set();

        // Helper to append control if it exists
        const add = (key, control) => {
            if (control) {
                this.body.appendChild(control);
                visited.add(key);
            }
        };

        // 1. Group: General Settings
        this.createGroupHeader("General Settings");
        if (uniforms.uGlowIntensity) add('uGlowIntensity', this.createNumberControl("Glow Intensity", uniforms.uGlowIntensity.value, (val) => uniforms.uGlowIntensity.value = val, { min: 0, max: 0.2, step: 0.001 }));
        if (uniforms.uBorderThickness) add('uBorderThickness', this.createNumberControl("Border Thickness", uniforms.uBorderThickness.value, (val) => uniforms.uBorderThickness.value = val, { min: 0, max: 0.5, step: 0.001 }));
        if (uniforms.uIconScale) add('uIconScale', this.createNumberControl("Icon Scale", uniforms.uIconScale.value, (val) => uniforms.uIconScale.value = val, { min: 0.1, max: 2.0, step: 0.01 }));
        if (uniforms.uCurrentSpeed) add('uCurrentSpeed', this.createNumberControl("Current Speed", uniforms.uCurrentSpeed.value, (val) => uniforms.uCurrentSpeed.value = val, { min: 0, max: 20, step: 0.1 }));
        if (uniforms.uStormSharpness) add('uStormSharpness', this.createNumberControl("Storm Sharpness", uniforms.uStormSharpness.value, (val) => uniforms.uStormSharpness.value = val, { min: 0, max: 1 }));
        if (uniforms.uRainHeaviness) add('uRainHeaviness', this.createNumberControl("Rain Heaviness", uniforms.uRainHeaviness.value, (val) => uniforms.uRainHeaviness.value = val, { min: 0, max: 5 }));

        // 2. Group: Moon Settings
        this.createGroupHeader("Moon Settings");
        if (uniforms.uMoonPosition) {
            add('uMoonPosition', null); // Mark as visited handled manually below
            this.body.appendChild(this.createNumberControl("Moon Pos X", uniforms.uMoonPosition.value.x, (val) => uniforms.uMoonPosition.value.x = val, { min: 0, max: 1 }));
            this.body.appendChild(this.createNumberControl("Moon Pos Y", uniforms.uMoonPosition.value.y, (val) => uniforms.uMoonPosition.value.y = val, { min: 0, max: 1 }));
        }
        if (uniforms.uMoonSize) add('uMoonSize', this.createNumberControl("Size", uniforms.uMoonSize.value, (val) => uniforms.uMoonSize.value = val, { min: 0.001, max: 0.2, step: 0.001 }));
        if (uniforms.uMoonBrightness) add('uMoonBrightness', this.createNumberControl("Brightness", uniforms.uMoonBrightness.value, (val) => uniforms.uMoonBrightness.value = val, { min: 0, max: 10.0 }));
        if (uniforms.uMoonBlur) add('uMoonBlur', this.createNumberControl("Blur", uniforms.uMoonBlur.value, (val) => uniforms.uMoonBlur.value = val, { min: 0.0, max: 0.05, step: 0.0001 }));
        if (uniforms.uCraterScale) add('uCraterScale', this.createNumberControl("Crater Scale", uniforms.uCraterScale.value, (val) => uniforms.uCraterScale.value = val, { min: 0.1, max: 2.0 }));
        if (uniforms.uCraterIntensity) add('uCraterIntensity', this.createNumberControl("Crater Intensity", uniforms.uCraterIntensity.value, (val) => uniforms.uCraterIntensity.value = val, { min: 0.0, max: 1.0 }));

        // 3. Group: Mountain Settings
        this.createGroupHeader("Mountain Settings");
        if (uniforms.uFarMountainOffset) add('uFarMountainOffset', this.createNumberControl("Far Mount Offset", uniforms.uFarMountainOffset.value, (val) => uniforms.uFarMountainOffset.value = val, { min: -2.0, max: 2.0 }));
        if (uniforms.uNearMountainOffset) add('uNearMountainOffset', this.createNumberControl("Near Mount Offset", uniforms.uNearMountainOffset.value, (val) => uniforms.uNearMountainOffset.value = val, { min: -2.0, max: 2.0 }));

        // 4. Group: Welcome Text Settings
        this.createGroupHeader("Welcome Text Settings");
        if (uniforms.uWelcomeProgress) add('uWelcomeProgress', this.createNumberControl("Progress", uniforms.uWelcomeProgress.value, (val) => uniforms.uWelcomeProgress.value = val, { min: 0, max: 1.0, step: 0.01 }));
        if (uniforms.uWelcomeScanline) add('uWelcomeScanline', this.createCheckboxControl("Enable Scanlines", uniforms.uWelcomeScanline.value, (val) => uniforms.uWelcomeScanline.value = val ? 1.0 : 0.0));
        if (uniforms.uWelcomeOpacity) add('uWelcomeOpacity', this.createNumberControl("Opacity", uniforms.uWelcomeOpacity.value, (val) => uniforms.uWelcomeOpacity.value = val, { min: 0, max: 1.0, step: 0.01 }));
        if (uniforms.uWelcomeGlow) add('uWelcomeGlow', this.createNumberControl("Flash Intensity", uniforms.uWelcomeGlow.value, (val) => uniforms.uWelcomeGlow.value = val, { min: 0, max: 2.0, step: 0.05 }));
        if (uniforms.uWelcomeRotation) add('uWelcomeRotation', this.createNumberControl("Rotation", uniforms.uWelcomeRotation.value, (val) => uniforms.uWelcomeRotation.value = val, { min: -Math.PI, max: Math.PI, step: 0.1 }));
        if (uniforms.uWelcomeScale) add('uWelcomeScale', this.createNumberControl("Scale", uniforms.uWelcomeScale.value, (val) => uniforms.uWelcomeScale.value = val, { min: 0.1, max: 5.0, step: 0.1 }));
        if (uniforms.uWelcomePosition) {
            add('uWelcomePosition', null);
            this.body.appendChild(this.createNumberControl("Pos X", uniforms.uWelcomePosition.value.x, (val) => uniforms.uWelcomePosition.value.x = val, { min: -20, max: 20, step: 0.1 }));
            this.body.appendChild(this.createNumberControl("Pos Y", uniforms.uWelcomePosition.value.y, (val) => uniforms.uWelcomePosition.value.y = val, { min: -10, max: 10, step: 0.1 }));
        }

        // 5. Other Settings (Generic Loop)
        const allKeys = Object.keys(uniforms);
        const remainingKeys = allKeys.filter(key => !visited.has(key));

        if (remainingKeys.length > 0) {
            this.createGroupHeader("Other Settings");
            for (const key of remainingKeys) {
                const uniform = uniforms[key];
                const value = uniform.value;
                let control;

                if (value instanceof THREE.Color) {
                    control = this.createColorControl(key, value, (newVal) => {
                        uniform.value.set(newVal);
                    });
                } else if (value instanceof THREE.Vector4 || value instanceof THREE.Vector3 || value instanceof THREE.Vector2) {
                    const components = (value instanceof THREE.Vector4) ? ['x', 'y', 'z', 'w'] : (value instanceof THREE.Vector3) ? ['x', 'y', 'z'] : ['x', 'y'];
                    control = this.createVectorControl(key, value, components, () => { /* Value is updated directly by reference */ });
                } else if (typeof value === 'number') {
                    // Default range for unknown numbers
                    control = this.createNumberControl(key, value, (newVal) => {
                        uniform.value = newVal;
                    }, { min: -10, max: 10, step: 0.01 });
                } else if (typeof value === 'boolean') {
                    control = this.createCheckboxControl(key, value, (newVal) => {
                        uniform.value = newVal;
                    });
                }

                if (control) {
                    this.body.appendChild(control);
                }
            }
        }
    }

    /**
     * Checks if current value matches initial value and updates label color.
     */
    updateLabelState(labelSpan, current, initial, isVector = false) {
        let changed = false;
        if (initial instanceof THREE.Color) {
            changed = !current.equals(initial);
        } else if (initial instanceof THREE.Vector4 || initial instanceof THREE.Vector3 || initial instanceof THREE.Vector2) {
            changed = !current.equals(initial);
        } else {
            changed = current !== initial;
        }
        labelSpan.style.color = changed ? 'red' : 'black';
        labelSpan.style.cursor = 'pointer';
        labelSpan.title = changed ? 'Click to reset to default' : '';
    }

    createGroupHeader(text) {
        const div = document.createElement('div');
        div.textContent = text;
        div.style.fontWeight = 'bold';
        div.style.marginTop = '10px';
        div.style.marginBottom = '5px';
        div.style.borderBottom = '1px solid #ccc';
        div.style.paddingBottom = '2px';
        this.body.appendChild(div);
    }

    createVectorControl(label, vector, components, onChange) {
        const initial = this.initialStates[label];
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.gap = '8px';

        const labelSpan = document.createElement('span');
        labelSpan.textContent = label;
        labelSpan.style.fontWeight = '500';
        labelSpan.style.width = '120px';

        const updateAll = () => {
            this.updateLabelState(labelSpan, vector, initial);
            if (onChange) onChange();
        };

        labelSpan.onclick = () => {
            if (initial) {
                vector.copy(initial);
                inputs.forEach((input, i) => {
                    input.value = vector[components[i]].toFixed(3);
                });
                updateAll();
            }
        };

        const inputBox = document.createElement('div');
        inputBox.style.display = 'flex';
        inputBox.style.gap = '8px';

        const inputs = [];
        components.forEach(axis => {
            const input = document.createElement('input');
            input.type = 'number';
            input.value = vector[axis].toFixed(3);
            input.step = 0.01;
            input.style.width = '50px';
            input.style.fontFamily = 'monospace';
            input.style.fontSize = '12px';
            input.style.padding = '2px 4px';
            input.style.border = '1px solid #bbb';
            input.style.borderRadius = '3px';
            input.oninput = () => {
                let val = parseFloat(input.value);
                if (isNaN(val)) val = 0;
                vector[axis] = val;
                updateAll();
            };
            inputBox.appendChild(input);
            inputs.push(input);
        });

        this.updateLabelState(labelSpan, vector, initial);
        row.appendChild(labelSpan);
        row.appendChild(inputBox);
        return row;
    }

    /**
     * Helper to create a color picker control.
     * @param {string} label The name of the uniform.
     * @param {THREE.Color} color The color object.
     * @param {function} onChange Callback function.
     * @returns {HTMLDivElement} The control row element.
     */
    createColorControl(label, color, onChange) {
        const initial = this.initialStates[label];
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.gap = '8px';

        const labelSpan = document.createElement('span');
        labelSpan.textContent = label;
        labelSpan.style.width = '120px';
        labelSpan.style.fontWeight = '500';

        const input = document.createElement('input');
        input.type = 'color';
        input.value = '#' + color.getHexString();
        input.style.border = '1px solid #bbb';
        input.style.padding = '0';
        input.style.height = '24px';

        const updateAll = (val) => {
            input.value = val;
            onChange(val);
            this.updateLabelState(labelSpan, color, initial);
        };

        labelSpan.onclick = () => {
            if (initial) {
                const hex = '#' + initial.getHexString();
                updateAll(hex);
            }
        };

        input.oninput = () => updateAll(input.value);

        this.updateLabelState(labelSpan, color, initial);
        row.appendChild(labelSpan);
        row.appendChild(input);
        return row;
    }

    /**
     * Helper to create a number/range slider control.
     * @param {string} label The name of the uniform.
     * @param {number} value The initial number value.
     * @param {function} onChange Callback function.
     * @param {object} options Options for min, max, and step.
     * @returns {HTMLDivElement} The control row element.
     */
    createNumberControl(label, value, onChange, options) {
        const initial = this.initialStates[label] ?? value;
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.gap = '8px';

        const labelSpan = document.createElement('span');
        labelSpan.textContent = label;
        labelSpan.style.width = '120px';
        labelSpan.style.fontWeight = '500';

        const rangeInput = document.createElement('input');
        rangeInput.type = 'range';
        rangeInput.min = options?.min ?? 0;
        rangeInput.max = options?.max ?? 1;
        rangeInput.step = options?.step ?? 0.01;
        rangeInput.value = value;
        rangeInput.style.flex = '1';

        const numberInput = document.createElement('input');
        numberInput.type = 'number';
        numberInput.min = rangeInput.min;
        numberInput.max = rangeInput.max;
        numberInput.step = rangeInput.step;
        numberInput.value = value;
        numberInput.style.width = '60px';
        numberInput.style.border = '1px solid #bbb';
        numberInput.style.borderRadius = '3px';
        numberInput.style.padding = '2px 4px';

        const updateAll = (val) => {
            rangeInput.value = val;
            numberInput.value = val.toFixed(3);
            onChange(val);
            this.updateLabelState(labelSpan, val, initial);
        };

        labelSpan.onclick = () => {
            updateAll(initial);
        };

        rangeInput.oninput = () => {
            updateAll(parseFloat(rangeInput.value));
        };
        numberInput.oninput = () => {
            updateAll(parseFloat(numberInput.value));
        };

        this.updateLabelState(labelSpan, value, initial);
        row.appendChild(labelSpan);
        row.appendChild(rangeInput);
        row.appendChild(numberInput);
        return row;
    }

    /**
     * Helper to create a checkbox control.
     * @param {string} label The name of the uniform.
     * @param {boolean} value The initial boolean value.
     * @param {function} onChange Callback function.
     * @returns {HTMLDivElement} The control row element.
     */
    createCheckboxControl(label, value, onChange) {
        const initial = this.initialStates[label] ?? value;
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.gap = '8px';

        const labelSpan = document.createElement('label');
        labelSpan.textContent = label;
        labelSpan.style.width = '120px';
        labelSpan.style.fontWeight = '500';
        labelSpan.style.cursor = 'pointer';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = !!value;

        const updateAll = (val) => {
            input.checked = val;
            onChange(val);
            this.updateLabelState(labelSpan, val, initial);
        };

        labelSpan.onclick = (e) => {
            // Prevent double trigger if clicking label associated with checkbox
            if (e.target === labelSpan) {
                updateAll(initial);
                e.preventDefault();
            }
        };

        input.onchange = () => updateAll(input.checked);

        this.updateLabelState(labelSpan, value, initial);
        row.appendChild(labelSpan);
        row.appendChild(input);
        return row;
    }

    /**
     * Encapsulates the logic for making the panel draggable and collapsible.
     * @param {HTMLDivElement} panel The main panel element.
     * @param {HTMLDivElement} head The header element that acts as the drag handle.
     * @param {HTMLDivElement} body The body element to collapse/expand.
     * @param {HTMLSpanElement} chevron The arrow indicator.
     */
    makeDraggableAndCollapsible(panel, head, body, chevron) {
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        let dragMoved = false;

        head.style.cursor = 'move';

        head.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragMoved = false;
            const rect = panel.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            document.body.style.userSelect = 'none'; // Prevent text selection while dragging
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            dragMoved = true;
            panel.style.left = (e.clientX - dragOffsetX) + 'px';
            panel.style.top = (e.clientY - dragOffsetY) + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.userSelect = '';
                // Use a timeout to prevent the click event from firing immediately after a drag
                setTimeout(() => { dragMoved = false; }, 0);
            }
        });

        // Collapse/expand logic, which ignores the click if it was part of a drag
        let collapsed = false;
        head.addEventListener('click', () => {
            if (dragMoved) return;
            collapsed = !collapsed;
            body.style.display = collapsed ? 'none' : 'flex';
            chevron.innerHTML = collapsed ? '&#x25B2;' : '&#x25BC;'; // Up/Down arrow
        });
    }
}
export { ConstantUniformsCustomizer as GlobalUniformsCustomizer };


/**
 * @param {Object} options Configuration object
 * @param {THREE.Scene} options.scene The scene to attach the hub to
 * @param {THREE.Clock} options.clock Existing clock instance
 * @param {THREE.Raycaster} options.raycaster Existing raycaster instance (for mouse)
 * @param {THREE.Camera} options.camera Camera reference
 * @param {HTMLElement} [options.domElement=window] Element for resize listener
 */
export function createGlobalUniformsHub({ scene, clock, raycaster, camera, domElement = window }) {
    // Singleton Check: Prevent multiple hubs on the same scene
    if (scene && scene.globalUniformsHub) {
        return scene.globalUniformsHub;
    }

    const featureUniforms = new Map();

    /** Helper to convert raw config values to Three.js uniform objects */
    const toUniforms = (feature) => Object.fromEntries(
        Object.entries(feature).map(([k, v]) => [k, { value: v }])
    );

    const coreUniforms = {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio) },
        uMouse: { value: new THREE.Vector2(0, 0) },
        iDate: { value: new THREE.Vector4() },
        iChannel0: { value: resources.noise },
        iChannelX: { value: resources.blank },
        iChannelSprite: { value: resources.spriteSheet },
        iChannelSpriteIcon: { value: resources.spriteSheetIcon },
        uSpritePixels: { value: new THREE.Vector2(2048, 1024) },
        uSpriteIconPixels: { value: new THREE.Vector2(512, 256) },
        uSpriteSize: { value: new THREE.Vector2(4, 8) },
        uSpriteIconSize: { value: new THREE.Vector2(4, 8) },
        uGlowIntensity: { value: 0.05 },
        uChannelAvatars: { value: resources.avatarsCelShaded }
    };

    // Shared object to avoid recreating and GC pressure
    const masterUniforms = { ...coreUniforms };

    const updateResolution = () => {
        masterUniforms.iResolution.value.set(
            window.innerWidth * window.devicePixelRatio,
            window.innerHeight * window.devicePixelRatio
        );
    };

    window.addEventListener('resize', updateResolution);

    const getShaderDate = (target) => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const day = now.getDate();
        const seconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds() + now.getMilliseconds() / 1000;
        target.set(year, month, day, seconds);
    };

    // Initial date setup
    getShaderDate(coreUniforms.iDate.value);

    let lastLogTime = 0;

    const hub = {
        // Core set used for most materials (No bloat)
        core: { ...coreUniforms },
        // Kitchen sink for all uniforms (Global state)
        uniforms: { ...coreUniforms },

        update(delta = 0, mouse = null) {
            coreUniforms.iTime.value += delta;
            const time = coreUniforms.iTime.value;

            // Update iDate every 0.5s (Reduced from per-frame to save on new Date() allocation)
            if (!this._lastDateUpdate || time - this._lastDateUpdate > 0.5) {
                getShaderDate(coreUniforms.iDate.value);
                this._lastDateUpdate = time;

                // Sync late-loaded resources (Throttled alongside date update)
                this.uniforms.iChannel0.value = resources.noise;
                this.uniforms.iChannelX.value = resources.blank;
                this.core.iChannel0.value = resources.noise;
                this.core.iChannelX.value = resources.blank;
                if (this.uniforms.iChannelSprite && resources.spriteSheet) this.uniforms.iChannelSprite.value = resources.spriteSheet;
                if (this.core.iChannelSprite && resources.spriteSheet) this.core.iChannelSprite.value = resources.spriteSheet;
                if (this.uniforms.iChannelSpriteIcon && resources.spriteSheetIcon) this.uniforms.iChannelSpriteIcon.value = resources.spriteSheetIcon;
                if (this.core.iChannelSpriteIcon && resources.spriteSheetIcon) this.core.iChannelSpriteIcon.value = resources.spriteSheetIcon;
                if (this.uniforms.uChannelAvatars && resources.avatarsCelShaded) this.uniforms.uChannelAvatars.value = resources.avatarsCelShaded;
                if (this.core.uChannelAvatars && resources.avatarsCelShaded) this.core.uChannelAvatars.value = resources.avatarsCelShaded;
            }

            // Sync mouse if provided
            if (mouse) {
                coreUniforms.uMouse.value.copy(mouse);
            }

            // 3. Update Nebula Self-Rotation (Built-in Math replacement)
            if (this.uniforms.uNebulaRotationSpeed) {
                this.uniforms.uNebulaRotation.value += delta * this.uniforms.uNebulaRotationSpeed.value;
            }
            if (this.uniforms.uNebulaSwirlSpeed) {
                this.uniforms.uNebulaSwirl.value += delta * this.uniforms.uNebulaSwirlSpeed.value;
            }

            // Optional: Periodic Debug Log (every 10 seconds)
            if (time - lastLogTime > 10.0) {
                lastLogTime = time;
            }
        },

        registerFeature(name, featureUniformsSource) {
            featureUniforms.set(name, featureUniformsSource);
            // Expose as group property for structured access (e.g. hub.environmental)
            this[name] = featureUniformsSource;
            // Merge into the permanent 'uniforms' object for flat/proxy access
            Object.assign(this.uniforms, featureUniformsSource);
        },

        dispose() {
            window.removeEventListener('resize', updateResolution);
            featureUniforms.clear();
            if (scene) delete scene.globalUniformsHub;
        }
    };

    // --- Register Shared/Feature Uniforms (Display States, Energy, etc.) ---
    const savedPersona = localStorage.getItem('cv-view-mode-v3') || 'dev';
    hub.registerFeature('displaySystem', {
        uBSODState: { value: 0.0 },
        uPCBSODState: { value: 0.0 },
        uLaptopBSODState: { value: 0.0 },
        uIsPoba: { value: (savedPersona === 'poba') ? 1.0 : 0.0 },
        uNetflixStartTime: { value: 0.0 },
        uBorderThickness: { value: 0.02 },
        uCurrentSpeed: { value: 5.0 },
        uIconScale: { value: 1.0 }
    });

    hub.registerFeature('environmental', {
        uFireHeightOverride: { value: 0.0 },
        ...toUniforms(WATER_PATCH_CONFIG),
        ...toUniforms(WELCOME_PATCH_CONFIG)
    });

    hub.registerFeature('lightning', {
        isStriking: { value: false },
        enableLightning: { value: false },
        normalizedStrikePos: { value: new THREE.Vector2(-2.0, -2.0) }
    });

    hub.registerFeature('glassWeather', {
        rainGlassOpacity: { value: 1.0 },
        glassRainAmount: { value: 1.0 },
        uRimCenter: { value: new THREE.Vector2(-0.5, 0.5) },
        uRainOffset: { value: 0.0 }
    });

    hub.registerFeature('morphing', {
        uTransformProgress: { value: 0.0 },
        uIsOscillating: { value: 1.0 },
        uOscillationStrength: { value: 1.0 }
    });

    hub.registerFeature('fireflies', {
        uMergeProgress: { value: 0.0 },
        uPointMergePos: { value: new THREE.Vector3(-0.6, 4.4, 0) },
        uOverrideActive: { value: 0.0 },
        uOverrideRow: { value: 0.0 },
        uOverrideCol: { value: 0.0 },
        uSizeFactor: { value: 0.0 },
        uKamikazeScale: { value: 0.0 }
    });

    hub.registerFeature('skyWeather', {
        uRainHeaviness: { value: 2.0 },
        uStormSharpness: { value: 0.0 },
        uMoonPosition: { value: new THREE.Vector2(0.58, 0.705) },
        uMoonSize: { value: 0.006 },
        uMoonBrightness: { value: 2.5 },
        uMoonBlur: { value: 0.0 },
        uCraterScale: { value: 0.555 },
        uCraterIntensity: { value: 0.280 },
        uFarMountainOffset: { value: 0.0 },
        uNearMountainOffset: { value: -0.5 }
    });

    hub.registerFeature('nebula', {
        uNebulaRotation: { value: 0.0 },
        uNebulaRotationSpeed: { value: 0.3 }, // Base speed (0.3 matches original iTime multiplier)
        uNebulaSwirl: { value: 0.0 },
        uNebulaSwirlSpeed: { value: 0.25 }  // Base swirl speed (0.25 matches original)
    });

    hub.registerFeature('gridSystem', toUniforms(GRID_PATCH_CONFIG));

    // Create a Proxy for easier access (scene.globalUniformsHub.uMyUniform)
    const hubProxy = new Proxy(hub, {
        get(target, prop) {
            if (prop in target) return target[prop];
            if (target.uniforms && prop in target.uniforms) return target.uniforms[prop];
            return undefined;
        }
    });

    // Attach to scene for external access
    if (scene) {
        scene.globalUniformsHub = hubProxy;
    }

    return hubProxy;
}
