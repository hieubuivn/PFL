import * as THREE from 'three';
import { WATER_PATCH_CONFIG, GRID_PATCH_CONFIG, DOTA_LOGO_PATCH_CONFIG, WELCOME_PATCH_CONFIG } from './addConstantUniform.js';

/**
 * Standardized Water Flow Effect Patcher
 * Works with MeshStandardMaterial/MeshPhysicalMaterial via onBeforeCompile
 * or can be manually applied to ShaderMaterial objects.
 */
// --- Unified Patch Configuration (Fallbacks for standalone use) ---
const PATCH_CONFIG = {
    core: {
        iTime: 0,
        iResolution: new THREE.Vector2(1024, 1024)
    },
    water: WATER_PATCH_CONFIG,
    grid: {
        ...GRID_PATCH_CONFIG,
        uObjectStagger: 0.0
    },
    dotaLogo: DOTA_LOGO_PATCH_CONFIG,
    welcome: WELCOME_PATCH_CONFIG
};

/**
 * Robustly injects a varying into the shader if not already present.
 */
const injectVarying = (shader, type, name, glslType = 'vec2') => {
    const declaration = `varying ${glslType} ${name};`;
    const mainRegex = /void\s+main\s*\(\s*\)\s*\{/;

    // Vertex Check
    if (shader.vertexShader && !shader.vertexShader.includes(name + ';')) {
        shader.vertexShader = shader.vertexShader.replace(mainRegex, (match) => `${declaration}\n${match}`);
    }
    // Fragment Check
    if (shader.fragmentShader && !shader.fragmentShader.includes(name + ';')) {
        if (shader.fragmentShader.includes('#include <common>')) {
            shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `#include <common>\n${declaration}`);
        } else {
            shader.fragmentShader = `${declaration}\n${shader.fragmentShader}`;
        }
    }
};

/**
 * Robustly injects code into the start of void main()
 */
const injectMain = (shader, type, code) => {
    const target = type === 'vertex' ? 'vertexShader' : 'fragmentShader';
    const mainRegex = /void\s+main\s*\(\s*\)\s*\{/;

    if (shader[target] && !shader[target].includes(code.trim())) {
        shader[target] = shader[target].replace(mainRegex, (match) => `${match}\n    ${code}`);
    }
};

/**
 * Links a group of uniforms to the shader.
 * Skips already linked uniforms, pulls from source, or falls back to defaults.
 */
const linkFeature = (shader, source, featureName) => {
    const feature = PATCH_CONFIG[featureName];
    if (!feature) return;

    // Grid and Water always depend on Core (iTime)
    if (featureName !== 'core') linkFeature(shader, source, 'core');

    for (const [key, defaultValue] of Object.entries(feature)) {
        if (!shader.uniforms[key]) {
            shader.uniforms[key] = source[key] || { value: defaultValue };
        }
    }
};

export function patchWaterFlow(shader, localUniforms = {}) {
    // 1. Link Uniforms (Feature-based)
    linkFeature(shader, localUniforms, 'water');

    // 2. Inject Varying and Assignment
    injectVarying(shader, 'vertex', 'vPatchedUv', 'vec2');
    injectMain(shader, 'vertex', 'vPatchedUv = uv;');

    // 3. Fragment Shader Header
    const hasITime = shader.fragmentShader.includes('uniform float iTime;');
    const headerCode = `
        ${hasITime ? '' : 'uniform float iTime;'}
        uniform float uWaterIntensity;
        vec2 vWarpedUv;

        const float speed = 0.15;
        const float speed_x = -0.2;
        const float speed_y = -0.2;
        const float emboss = 0.50;
        const float intensity = 2.5;
        const int steps = 6;
        const float frequency = 5.0;
        const int angle = 7;
        const float delta = 60.;
        const float gain = 800.;
        const float reflectionCutOff = 0.012;
        const float reflectionIntensity = 150000.;

        float getWaterCol(vec2 coord, float time) {
            float delta_theta = 2.0 * 3.14159 / float(angle);
            float c = 0.0;
            for (int i = 0; i < steps; i++) {
                vec2 adjc = coord;
                float theta = delta_theta * float(i);
                adjc.x += cos(theta) * time * speed + time * speed_x;
                adjc.y -= sin(theta) * time * speed - time * speed_y;
                c = c + cos((adjc.x * cos(theta) - adjc.y * sin(theta)) * frequency) * intensity;
            }
            return cos(c);
        }
    `;

    if (shader.fragmentShader.includes('#include <common>')) {
        shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\n' + headerCode);
    } else {
        shader.fragmentShader = headerCode + '\n' + shader.fragmentShader;
    }

    // 4. Fragment Shader: Main Initialization (Use unique local names to avoid collisions)
    const mainInitCode = `
        float wTime = iTime * 1.2;
        vec2 waterP = vPatchedUv * vec2(12.0, 15.0); 
        float cc1 = getWaterCol(waterP, wTime);

        vec2 p2 = waterP;
        p2.x += 1.0 / delta;
        float dx = emboss * (cc1 - getWaterCol(p2, wTime)) / delta;

        p2 = waterP;
        p2.y += 1.0 / delta;
        float dy = emboss * (cc1 - getWaterCol(p2, wTime)) / delta;

        vWarpedUv = vPatchedUv + vec2(dx, dy) * (2.5 * uWaterIntensity);
    `;

    injectMain(shader, 'fragment', mainInitCode);

    // 5. Texture Warping (Surgical replacement)
    shader.fragmentShader = shader.fragmentShader
        .replace(/UV\s*=\s*vUv/g, 'UV = vWarpedUv')
        .replace(/texture2D\(\s*map\s*,\s*vMapUv\s*\)/g, 'texture2D( map, vWarpedUv )')
        .replace(/texture2D\(\s*roughnessMap\s*,\s*vMapUv\s*\)/g, 'texture2D( roughnessMap, vWarpedUv )')
        .replace(/texture2D\(\s*metalnessMap\s*,\s*vMapUv\s*\)/g, 'texture2D( metalnessMap, vWarpedUv )')
        .replace(/texture2D\(\s*bumpMap\s*,\s*vMapUv\s*\)/g, 'texture2D( bumpMap, vWarpedUv )')
        .replace(/texture2D\(\s*iChannel([0-9X])\s*,\s*(vUv|uv)\s*\)/g, 'texture2D( iChannel$1, vWarpedUv )')
        .replace(/textureLod\(\s*iChannelX\s*,\s*UV\+n\s*,\s*focus\s*\)/g, 'textureLod( iChannelX, vWarpedUv+n, focus )')
        .replace(/texture2D\(\s*fireFliesTexture\s*,\s*uv\s*\)/g, 'texture2D( fireFliesTexture, vWarpedUv )');

    // 6. Normal Perturbation
    if (shader.fragmentShader.includes('#include <normal_fragment_begin>')) {
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <normal_fragment_begin>',
            `
            #include <normal_fragment_begin>
            normal = normalize(normal + vec3(dx, dy, 0.0) * (12.0 * uWaterIntensity));
            `
        );
    }

    // 7. Specular Glint
    if (shader.fragmentShader.includes('#include <dithering_fragment>')) {
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <dithering_fragment>',
            `
            #include <dithering_fragment>
            float waterAlpha = 1.0 + dot(dx, dy) * gain;
            float ddx = dx - reflectionCutOff;
            float ddy = dy - reflectionCutOff;
            if (ddx > 0. && ddy > 0.) {
                waterAlpha = pow(abs(waterAlpha), ddx * ddy * reflectionIntensity);
                gl_FragColor.rgb += vec3(waterAlpha) * 0.4;
            }
            `
        );
    }
}

/**
 * Standardized Hexagonal Grid Effect Patcher
 * Mimics the HUD's holographic structure but adapted for world-space surfaces.
 */
export function patchGrid(shader, localUniforms = {}) {
    // 1. Link Uniforms (Feature-based)
    linkFeature(shader, localUniforms, 'grid');

    // 2. Inject Varyings and Assignments
    injectVarying(shader, 'vertex', 'vPatchedUv', 'vec2');
    injectVarying(shader, 'vertex', 'vWorldPos', 'vec3');

    injectMain(shader, 'vertex', 'vPatchedUv = uv;');
    injectMain(shader, 'vertex', 'vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;');

    // 3. Inject Header (Helpers and Uniforms)
    if (shader.fragmentShader.includes('Holographic Grid Overlay')) return;

    const hasITime = shader.fragmentShader.includes('uniform float iTime;');

    const headerCode = `
        ${hasITime ? '' : 'uniform float iTime;'}
        uniform float uWorldGridSize;
        uniform float uWorldGridThickness;
        uniform float uWorldGridPulseSpeed;
        uniform float uWorldGridPulseDensity;
        uniform float uWorldGridProgress;
        uniform float uGroupGridProgress;
        uniform float uWorldGridActive;
        uniform float uGroupGridActive;
        uniform float uObjectStagger;
        uniform vec3 uBorderColor;

        float calcSquareDistance(vec2 p) {
            return max(abs(p.x), abs(p.y));
        }
        vec2 calcSquareOffset(vec2 uv) {
            return fract(uv + 0.5) - 0.5;
        }
    `;

    if (shader.fragmentShader.includes('#include <common>')) {
        shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\n' + headerCode);
    } else {
        shader.fragmentShader = headerCode + '\n' + shader.fragmentShader;
    }

    // 3. Main Injection (Grid Overlay)
    const midPoint = `
        // --- Holographic Grid Overlay ---
        float finalActive = max(uWorldGridActive, uGroupGridActive);
        float finalProgress = max(uWorldGridProgress, uGroupGridProgress);
        if (finalActive > 0.5 && finalProgress > 0.001) {
            // Use World Position for uniform grid regardless of object scale/UVs
            // We use a simplified projection based on surface orientation
            vec3 worldNormal = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
            vec2 gPosition;
            if (abs(worldNormal.y) > 0.5) {
                gPosition = vWorldPos.xz; // Floor/Top
            } else if (abs(worldNormal.x) > 0.5) {
                gPosition = vWorldPos.zy; // Side walls
            } else {
                gPosition = vWorldPos.xy; // Front/Back walls
            }

            float dynCellSize = uWorldGridSize * 0.02; 
            vec2 sOffset = calcSquareOffset(gPosition / dynCellSize);
            
            // local ripple center
            vec2 localCenter = (vPatchedUv - 0.5) * 2.0; 
            float dPulse = length(localCenter);
            float wave = cos(2.0 * (dPulse * 5.0 * uWorldGridPulseDensity - iTime * 2.5 * uWorldGridPulseSpeed));
            float ripple = (wave * 0.5 + 0.5);
            float distSq = calcSquareDistance(sOffset);
            
            // Staggered activation: 
            // We want the total delay across all objects to be 666ms.
            // If the TWEEN is 1.0s, we use 0.666 as the spread.
            float staggerWindow = 0.6; // ~66% of the progress bar is for staggering
            float localVisibility = smoothstep(uObjectStagger * staggerWindow, uObjectStagger * staggerWindow + (1.0 - staggerWindow), finalProgress);

            float baseT = uWorldGridThickness * 0.0015; // Reduced from 0.002 for better visuality
            float ripples = smoothstep(baseT, 0.0, abs(1.0 - abs(sin(distSq * wave * 10.0))));
            float ripplesGlow = 0.5 * smoothstep(baseT * 12.0, 0.0, abs(1.0 - abs(sin(distSq * wave * 10.0))));
            float sqL = 0.5 * smoothstep(baseT * 4.0, 0.0, abs(0.48 - distSq));
            float sqG = 0.4 * smoothstep(baseT * 30.0, 0.0, abs(0.48 - distSq));
            float bloom = 0.2 * smoothstep(0.4, 0.0, distSq);
            
            float mask = (ripples + ripplesGlow + sqL + sqG + bloom) * localVisibility;
            gl_FragColor.rgb += uBorderColor * mask * 1.5;
            gl_FragColor.a = max(gl_FragColor.a, mask * 0.5);
        }
    `;

    // Inject before dithering or end of main
    if (shader.fragmentShader.includes('#include <dithering_fragment>')) {
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <dithering_fragment>',
            midPoint + '\n#include <dithering_fragment>'
        );
    } else {
        const lastBrace = shader.fragmentShader.lastIndexOf('}');
        shader.fragmentShader = shader.fragmentShader.substring(0, lastBrace) + midPoint + '\n}';
    }
}

/**
 * Dota Logo Overlay Patcher
 * Injects the Dota logo logic into the fragment shader.
 */
export function patchDotaLogo(shader, localUniforms = {}) {
    // 1. Link Uniforms - Manually assign to ensure they are present on the shader
    const feature = PATCH_CONFIG.dotaLogo;
    if (feature) {
        // Ensure iTime is present (Core requirement)
        if (!shader.uniforms.iTime) {
            shader.uniforms.iTime = localUniforms.iTime || { value: 0 };
        }

        // Ensure iChannelSprite is present
        if (!shader.uniforms.iChannelSprite) {
            shader.uniforms.iChannelSprite = localUniforms.iChannelSprite || { value: null };
        }

        for (const [key, defaultValue] of Object.entries(feature)) {
            if (!shader.uniforms[key]) {
                // Use the provided local uniform or fall back to a new uniform object with the default value
                shader.uniforms[key] = localUniforms[key] || { value: defaultValue };
            }
        }
    }

    // 2. Fragment Header (Functions and Uniforms)
    if (shader.fragmentShader.includes('Dota Logo Header')) return;

    injectVarying(shader, 'vertex', 'vPatchedUv', 'vec2');
    injectMain(shader, 'vertex', 'vPatchedUv = uv;');

    const hasITime = shader.fragmentShader.includes('uniform float iTime;');

    const headerCode = `
        // --- Dota Logo Header ---
        ${hasITime ? '' : 'uniform float iTime;'}
        uniform sampler2D iChannelSprite;
        uniform vec2 uSelectedSlot;  
        uniform vec2 uSpriteSize;    
        uniform vec2 uSpritePixels;  
        uniform float uGlowIntensity;
        uniform float uBorderThickness;
        uniform float uCurrentSpeed;
        uniform float uIconScale;

        mat2 dota_makem2(in float theta) {
            float c = cos(theta);
            float s = sin(theta);
            return mat2(c,-s,s,c);
        }
        float dota_rand(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 4.1414))) * 43758.5453);
        }
        float dota_noise(in vec2 n) {
            const vec2 d = vec2(0.0, 1.0);
            vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
            return mix(mix(dota_rand(b), dota_rand(b + d.yx), f.x), 
                       mix(dota_rand(b + d.xy), dota_rand(b + d.yy), f.x), f.y);
        }
        float dota_fbm(in vec2 p) {	
            float z=2.;
            float rz = 0.;
            for (float i= 1.;i < 5.;++i) {
                rz+= abs((dota_noise(p * 3.)-0.5)*2.)/z;
                z = z*2.;
                p = p*2.;
            }
            return rz;
        }
        float dota_dualfbm(in vec2 p) {
            float time = iTime * 0.15;
            vec2 p2 = p * 0.7;
            vec2 basis = vec2(dota_fbm(p2 - time * 1.6), dota_fbm(p2 + time * 1.7));
            basis = (basis - 0.5) * 0.2;
            p += basis;
            return dota_fbm(p);
        }
    `;

    if (shader.fragmentShader.includes('#include <common>')) {
        shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\n' + headerCode);
    } else {
        shader.fragmentShader = headerCode + '\n' + shader.fragmentShader;
    }

    // 3. Main Injection
    const logoLogic = `
        // --- Dota Logo Overlay ---
        vec2 dota_centeredUV = (vPatchedUv - 0.5) / max(0.001, uIconScale) + 0.5;
        if(dota_centeredUV.x >= 0.0 && dota_centeredUV.x <= 1.0 && dota_centeredUV.y >= 0.0 && dota_centeredUV.y <= 1.0) {
            vec2 dota_uv = dota_centeredUV;
            dota_uv.y = 1.0 - dota_uv.y; // KTX2 Top-Left Flip
            vec2 dota_p = dota_centeredUV - 0.5;

            // Sprite Mapping
            vec2 dota_tileSize = 1.0 / vec2(uSpriteSize.y, uSpriteSize.x); 
            vec2 dota_pixelOffset = 0.5 / uSpritePixels; 
            
            float dota_offsetX = uSelectedSlot.y * dota_tileSize.x;
            float dota_offsetY = uSelectedSlot.x * dota_tileSize.y;
            vec2 dota_finalUV = dota_uv * (dota_tileSize - dota_pixelOffset * 2.0) + vec2(dota_offsetX, dota_offsetY) + dota_pixelOffset;

            vec4 dota_tex = texture2D(iChannelSprite, dota_finalUV);
            
            float dota_mask = dota_tex.a;
            float dota_dist = dota_mask - 0.5;
            float dota_smoothing = fwidth(dota_dist);
            float dota_alpha = smoothstep(-dota_smoothing, dota_smoothing, dota_dist);

            // Shading
            vec2 dota_grad = vec2(dFdx(dota_dist), dFdy(dota_dist));
            vec3 dota_normal = normalize(vec3(dota_grad * 80.0, 0.5)); 
            vec3 dota_lightDir = normalize(vec3(1.0, 1.0, 1.5));
            float dota_diff = max(0.5, dot(dota_normal, dota_lightDir));
            vec3 dota_viewDir = vec3(0.0, 0.0, 1.0);
            vec3 dota_halfDir = normalize(dota_lightDir + dota_viewDir);
            float dota_spec = pow(max(0.0, dot(dota_normal, dota_halfDir)), 32.0);
            
            // Aura & Edges
            float dota_aura = smoothstep(-0.4, 0.0, dota_dist) * (1.0 - dota_alpha);
            vec3 dota_auraColor = vec3(0.0, 0.8, 1.0) * dota_aura * uGlowIntensity * 25.0;

            float dota_edgeWidth = uBorderThickness;
            float dota_edgeHighlight = smoothstep(-dota_edgeWidth, 0.0, dota_dist) * (1.0 - smoothstep(0.0, dota_edgeWidth, dota_dist));
            
            float dota_angle = atan(dota_p.y, dota_p.x);
            float dota_current = smoothstep(0.7, 1.0, sin(dota_angle * 2.0 - iTime * uCurrentSpeed));
            vec3 dota_edgeColor = mix(vec3(1.0, 1.0, 1.0), vec3(0.0, 1.0, 0.9), dota_current) * dota_edgeHighlight;
            dota_edgeColor += vec3(0.0, 1.0, 1.0) * dota_current * dota_edgeHighlight * 3.0;

            float dota_energyStripes = sin(dota_dist * 50.0 - iTime * 15.0);
            vec3 dota_leakColor = vec3(0.0, 1.0, 0.8) * smoothstep(0.8, 1.0, dota_energyStripes) * dota_aura;

            float dota_rz = dota_dualfbm(dota_p * 8.0);
            vec3 dota_baseCol = vec3(0.2, 0.07, 0.01);
            vec3 dota_electricCol = dota_baseCol / (dota_rz + 0.01); 
            dota_electricCol += dota_baseCol * (uGlowIntensity / pow(dota_rz, 1.5));
            dota_electricCol = pow(dota_electricCol, vec3(1.4));
            
            vec3 dota_red = vec3(0.85, 0.15, 0.1); 
            vec3 dota_volumeColor = dota_red * dota_diff + vec3(0.8, 0.9, 1.0) * dota_spec * 0.6;
            dota_volumeColor *= smoothstep(-0.1, 0.15, dota_dist);
            
            vec3 dota_finalColor = mix(dota_volumeColor, dota_electricCol, 0.4 + 0.6 * smoothstep(0.0, 0.2, dota_dist));
            dota_finalColor += dota_auraColor + dota_edgeColor + dota_leakColor + dota_electricCol * 0.3 * dota_alpha;
            
            float dota_finalAlpha = clamp(dota_alpha + dota_aura * 0.8 + dota_edgeHighlight + length(dota_leakColor), 0.0, 1.0);
            
            gl_FragColor.rgb = mix(gl_FragColor.rgb, dota_finalColor, dota_finalAlpha);
        }
    `;

    if (shader.fragmentShader.includes('#include <dithering_fragment>')) {
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <dithering_fragment>',
            logoLogic + '\n#include <dithering_fragment>'
        );
    } else {
        const lastBrace = shader.fragmentShader.lastIndexOf('}');
        shader.fragmentShader = shader.fragmentShader.substring(0, lastBrace) + logoLogic + '\n}';
    }
}

/**
 * Welcome Text Shader Patcher
 * Renders a stylized "WELCOME" text overlay.
 */
export function patchWelcomeText(shader, localUniforms = {}) {
    // 1. Link Uniforms
    linkFeature(shader, localUniforms, 'welcome');

    // 2. Inject Varying and Assignment
    injectVarying(shader, 'vertex', 'vPatchedUv', 'vec2');
    injectMain(shader, 'vertex', 'vPatchedUv = uv;');

    // 3. Fragment Header (Macros and Helpers)
    if (shader.fragmentShader.includes('Welcome Text Header')) return;

    const hasITime = shader.fragmentShader.includes('uniform float iTime;');
    const hasIResolution = shader.fragmentShader.includes('uniform vec2 iResolution;');

    const headerCode = `
        // --- Welcome Text Header ---
        ${hasITime ? '' : 'uniform float iTime;'}
        ${hasIResolution ? '' : 'uniform vec2 iResolution;'}
        uniform float uWelcomeProgress;
        uniform float uWelcomeRotation;
        uniform float uWelcomeScale;
        uniform float uWelcomeScanline;
        uniform float uWelcomeOpacity;
        uniform float uWelcomeGlow;
        uniform vec2 uWelcomePosition;

        #define WT_STROKEWIDTH 0.07
        #define WT_PI 3.14159265359

        #define WT_A_ vec2(0.,0.)
        #define WT_B_ vec2(1.,0.)
        #define WT_C_ vec2(2.,0.)
        #define WT_E_ vec2(1.,1.)
        #define WT_G_ vec2(0.,2.)
        #define WT_H_ vec2(1.,2.)
        #define WT_I_ vec2(2.,2.)
        #define WT_J_ vec2(0.,3.)
        #define WT_K_ vec2(1.,3.)
        #define WT_L_ vec2(2.,3.)
        #define WT_M_ vec2(0.,4.)
        #define WT_N_ vec2(1.,4.)
        #define WT_O_ vec2(2.,4.)
        #define WT_S_ vec2(0.,6.)
        #define WT_T_ vec2(1.,6.)
        #define WT_U_ vec2(2.0,6.)

        float wt_minimum_distance(vec2 v, vec2 w, vec2 p) {
            float l2 = dot(v - w, v - w);
            if (l2 == 0.0) return distance(p, v);
            float t = dot(p - v, w - v) / l2;
            if(t < 0.0) return distance(p, v);
            else if (t > 1.0) return distance(p, w);
            vec2 proj = v + t * (w - v);
            return distance(p, proj);
        }

        float wt_textColor(vec2 from, vec2 to, vec2 p, float size) {
            p *= size;
            float nearLine = wt_minimum_distance(from,to,p);
            float ink = smoothstep(0., 1., 1.- 14.*(nearLine - WT_STROKEWIDTH));
            ink += smoothstep(0., 2.5, 1.- (nearLine + 5. * WT_STROKEWIDTH));
            return ink;
        }

        vec2 wt_grid(vec2 letterspace) {
            return ( vec2( (letterspace.x / 2.) * .65 , 1.0-((letterspace.y / 2.) * .95) ));
        }

        float wt_t(vec2 from, vec2 to, vec2 p, inout float count, float reveal, float size) {
            count += 1.0;
            if (count > reveal * 30.0) return 0.0;
            return wt_textColor(wt_grid(from), wt_grid(to), p, size);
        }
    `;

    if (shader.fragmentShader.includes('#include <common>')) {
        shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\n' + headerCode);
    } else {
        shader.fragmentShader = headerCode + '\n' + shader.fragmentShader;
    }

    // 3. Main Injection
    const welcomeLogic = `
        // --- Welcome Text Overlay ---
        if (uWelcomeProgress > 0.01) {
            float w_time = mod(iTime, 11.0);
            float w_gtime = w_time;
            float w_d = 0.;
            float w_count = 0.0;
            float w_font_size = 25.;
            float w_font_spacing = 0.05;
            
            vec2 w_caret = uWelcomePosition;
            
            // Apply scale and rotation to UVs
            vec2 w_uv = (vPatchedUv - 0.5) / max(0.001, uWelcomeScale) + 0.5;
            float w_cos = cos(uWelcomeRotation);
            float w_sin = sin(uWelcomeRotation);
            w_uv = mat2(w_cos, -w_sin, w_sin, w_cos) * (w_uv - 0.5) + 0.5;
            
            #define W_T(f, t) w_d += wt_t(f, t, vec2(w_uv.x - w_font_spacing * w_caret.x, w_uv.y - w_caret.y), w_count, uWelcomeProgress, w_font_size)
            
            // W
            W_T(WT_G_, WT_M_); W_T(WT_M_, WT_O_); W_T(WT_N_, WT_H_); W_T(WT_O_, WT_I_); w_caret.x += 1.0;
            // E
            W_T(WT_O_, WT_M_); W_T(WT_M_, WT_G_); W_T(WT_G_, WT_I_); W_T(WT_I_, WT_L_); W_T(WT_L_, WT_J_); w_caret.x += 1.0;
            // L
            W_T(WT_B_, WT_N_); w_caret.x += 1.0;
            // C
            W_T(WT_I_, WT_G_); W_T(WT_G_, WT_M_); W_T(WT_M_, WT_O_); w_caret.x += 1.0;
            // O
            W_T(WT_G_, WT_I_); W_T(WT_I_, WT_O_); W_T(WT_O_, WT_M_); W_T(WT_M_, WT_G_); w_caret.x += 1.0;
            // M
            W_T(WT_M_, WT_G_); W_T(WT_G_, WT_I_); W_T(WT_H_, WT_N_); W_T(WT_I_, WT_O_); w_caret.x += 1.0;
            // E
            W_T(WT_O_, WT_M_); W_T(WT_M_, WT_G_); W_T(WT_G_, WT_I_); W_T(WT_I_, WT_L_); W_T(WT_L_, WT_J_); w_caret.x += 1.0;

            #undef W_T

            w_d = clamp(w_d * (.75 + sin(w_uv.x * iResolution.x * WT_PI * .5 - w_time * 4.3) * .5), 0.0, 1.0);
            
            vec3 w_textCol = vec3(w_d * .5, w_d, w_d * .85);
            
            // Clean dark background base instead of full-screen scanlines
            vec3 w_bgBase = vec3(0.02, 0.05, 0.03); 

            // Scanline effect isolated
            float w_scanline = 0.07 * (.5 + sin(w_uv.y * iResolution.y * 3.14159 * 1.1 + w_time * 2.0)) + sin(w_uv.y * iResolution.y * .01 + w_time + 2.5) * 0.05;
            w_scanline *= uWelcomeScanline;
            
            // Apply scanlines ONLY to the text area (w_d)
            w_textCol += vec3(0.0, w_scanline * w_d * 2.5, 0.0);

            // Apply global opacity and flashing glow
            w_textCol *= uWelcomeOpacity;
            w_textCol *= (1.0 + uWelcomeGlow * (0.5 + 0.5 * sin(iTime * 15.0)));
            
            w_d *= uWelcomeOpacity;

            // Vignette/Glow effect from snippet
            float w_vignette = pow(100.0 * w_uv.x * w_uv.y * (1.0 - w_uv.x) * (1.0 - w_uv.y), .4);
            vec3 w_finalPatch = (w_bgBase + w_textCol) * (vec3(.4, .4, .3) + vec3(0.5 * w_vignette));
            
            gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb + w_finalPatch, uWelcomeProgress);
        }
    `;

    if (shader.fragmentShader.includes('#include <dithering_fragment>')) {
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <dithering_fragment>',
            welcomeLogic + '\n#include <dithering_fragment>'
        );
    } else {
        const lastBrace = shader.fragmentShader.lastIndexOf('}');
        shader.fragmentShader = shader.fragmentShader.substring(0, lastBrace) + welcomeLogic + '\n}';
    }
}
