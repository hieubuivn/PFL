import * as THREE from 'three';

let narrativeShaderState = {
    renderer: null,
    scene: null,
    camera: null,
    material: null,
    mesh: null,
    parent: null,
    animationId: null,
    active: false,
    startTime: 0,
    targetMouse: new THREE.Vector4(0, 0, 0, 0),
    currentMouse: new THREE.Vector4(0, 0, 0, 0),
    lerpFactor: 0.08 // Smoothing factor for staggering effect
};

const TEXTURE_PATH = './textures/noise.webp';

/**
 * Initializes the shader background for the modal-narrative div.
 */
export function initNarrativeShader() {
    const canvas = document.getElementById('narrative-shader-canvas');
    const modalNarrative = document.querySelector('.modal-narrative');
    if (!canvas || !modalNarrative) return;

    narrativeShaderState.parent = modalNarrative;

    // Lightweight dedicated renderer with RESOLUTION SCALING (Option B)
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(0.5); // Render at 0.5x resolution for massive performance gain
    renderer.setSize(modalNarrative.clientWidth, modalNarrative.clientHeight);
    narrativeShaderState.renderer = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    narrativeShaderState.scene = scene;
    narrativeShaderState.camera = camera;

    const geometry = new THREE.PlaneGeometry(2, 2);

    // Load noise texture
    const textureLoader = new THREE.TextureLoader();
    const noiseTexture = textureLoader.load(TEXTURE_PATH);
    noiseTexture.wrapS = THREE.RepeatWrapping;
    noiseTexture.wrapT = THREE.RepeatWrapping;

    // Fragment Shader - Elevator to infinity by @kishimisu
    const fragmentShader = `
        precision highp float;
        uniform float iTime;
        uniform vec2 iResolution;
        uniform vec4 iMouse;
        uniform sampler2D iChannel0;

        #define LIGHTS_ON
        #define rot(a) mat2(cos(a), -sin(a), sin(a), cos(a))
        #define rep(p, r) mod(p+r, r+r)-r
        #define rid(p, r) floor((p+r)/(r+r))
        #define lrep(p, r, l) p-r*clamp(round(p/r), -l, l)

        float acc = 0.;
        float occ = 1.;

        vec3 hash(vec2 p) {
            vec2 r = fract(sin(p*mat2(137.1, 12.7, 74.7, 269.5)) * 43478.5453);
            return vec3(r, fract(r.x*r.y*1121.67));
        }
        #define hash33(p) fract(sin(p*mat3(127.1,311.7,74.7,269.5,183.3,246.1,113.5,271.9,124.6))*43758.5453123)

        float box(vec3 p, vec3 b) {
            vec3 q = abs(p) - b;
            return length(max(q, 0.)) + min(max(q.x, max(q.y, q.z)), 0.);
        }
        float rect(vec2 p, vec2 b) {
            vec2 d = abs(p) - b;
            return length(max(d, 0.)) + min(max(d.x, d.y), 0.);
        }

        #define ext 2.
        float opElevatorWindows(vec3 p, float b) {
            float e  = box(p, vec3(ext*.8, 2.7, .3));
            float lv = length(p.xz) - .1;   p.y += 1.;
            float lh = length(p.yz) - .1;
            lh = max(b, lh);
            b  = max(b, -e);
            b  = min(b, min(lv, lh));
            return b;
        }

        float building(vec3 p0, vec3 p, float L) {
            float B = rect(p.xz, vec2(L, 10)); 
            float B2 = rect(vec2(abs(p.x)-L-ext, p.z), vec2(ext, 10));
            
            if (min(B, B2) > .2) return min(B, B2);
            
            vec3 q = p;
            float var = step(1., mod(rid(p.y, 3.), 6.)); 
            p.y = rep(p.y, 3.);
            vec3 pb = vec3(abs(p.x), p.yz);

        #ifdef LIGHTS_ON
            vec3 id = rid(vec3(q.xy, p0.z), vec3(21, 18, 48));
            vec3 rn = hash33(id);
            float rw = fract(rn.x*rn.z*1021.67);
                
            q.x += 14. * (rn.x*3.-1.);
            q.y += 12. * (floor(rn.y*3.)-1.);
            q.xy = rep(q.xy, vec2(21, 18));

            float l = box(q, vec3(mix(3., 15., rw), rn.z*1.5+.5, 7));
            
            // --- ENHANCEMENT: VOLUMETRIC LIGHT BLEED ---
            // Dual-layer accumulation: 
            // 1. Sharp core glow (power 1.5)
            // 2. Softer atmospheric bleed (power 1.1, lower density distance)
            float core = 0.6 / (1. + pow(abs(l) * 18.0, 1.5));
            float bleed = 0.25 / (1. + pow(abs(l) * 4.0, 1.1)); 
            
            // Add subtle pulse/flicker based on window ID to make the city feel alive
            float pulse = 0.85 + 0.15 * sin(iTime * (1.5 + rn.y * 2.0) + rn.x * 10.0);
            
            acc += (core + bleed) * pulse
                        * smoothstep(0., .4, iTime - rw * 20.)
                        * step(p0.x, 10. + 2e2*step(20., abs(p0.z)));
        #endif
            
            occ = min(occ, smoothstep(3.5, 0., -rect(p.xz, vec2(L+2.,10))));    
            occ = min(occ, smoothstep(0.6, 0., -rect(pb.xz-vec2(L+ext,0), vec2(ext,10))));
            
            q = p;
            q.x = rep(q.x, 7.);    
            q.y -= (1. - var)*1.01;
            
            float f = box(q + vec3(0,0,10), vec3(6.6, 2. + var, 3));
            B = max(B, -f);
            B = max(B, -rect(q.xz + vec2(0,10), vec2(6.6, .7)*var));
            
            q = p;
            q.x = rep(q.x, .8);
            
            float r  = length(p.yz + vec2(1, 9.5-var*.5)) - .2;
            float rv = length(q.xz + vec2(0, 9.5-var*.5)) - .16;
            r = min(r, rv);
            r = max(r, p.y + 1.);

            q = p;
            q.x = rep(q.x, 1.75);
            
            float b = length(q.xz + vec2(0, 7.3)) - .2;
            r = min(r, b);
            
            B = min(B, r);
            B = max(B, abs(p.x) - L);
                    
            if (B2 > .04) return min(B, B2);
            
            B2 = opElevatorWindows(pb - vec3(L+ext,0,-9.9), B2);
            B2 = opElevatorWindows(vec3(pb.z+8., pb.y, pb.x-L-ext-1.9), B2);

            q = vec3(pb.xy, pb.z - 1.8);
            q.z = lrep(q.z, 2.5, 2.);
            
            float w = box(q - vec3(L+ext*2.,1.2,0), vec3(.5, 1.6, 1.2));
            B2 = max(B2, -w);
                        
            return min(B, B2);
        }

        float map(vec3 p) {
            vec2 id = vec2(step(40., p.x), rid(p.z, 140.));  
            vec3 rn = mix(vec3(1, -.5, 0), hash(id), step(.5, id.x+id.y));
                
            vec3 p0 = p;
            p.x = abs(abs(p.x - 40.) - 80.);
            p.z = rep(p.z - id.x*200., 200.);
            
            float bL = 21.4 + id.y*3.;
            float b1 = building(p0, p - vec3(30,0,0), bL);
            float b2 = building(p0, vec3(p.z,p.y,-p.x), 185.);
            
            float rpy = 80. + 150. * rn.x;
            p.y = rep(p.y - iTime * 40. * (rn.y*.5+.5), rpy);
            p -= vec3(30.+bL+ext, rn.z*rpy*.5, ext-10.);

            float l = box(p, vec3(ext*.8, 2.7, ext*.8));
            // Boosted glow for elevator cabs
            acc += .8 / (1. + pow(abs(l)*15., 1.1));
            
            b2 = min(b2, abs(p0.x + p0.z - 30.) + 6.);

            return min(b1, b2);
        }

        vec3 normal(vec3 p) {
            const vec2 k = vec2(1,-1)*.0001;
            return normalize(k.xyy*map(p + k.xyy) + k.yyx*map(p + k.yyx) + 
                            k.yxy*map(p + k.yxy) + k.xxx*map(p + k.xxx));
        }

        void main() {
            vec2 R = iResolution.xy;
            vec2 F = gl_FragCoord.xy;
            vec2 u = (F+F-R)/R.y;
            vec2 M = iMouse.xy/R * 2. - 1.;
            M *= step(0.5, iMouse.z);
            
            float T  = 1. - pow(1. - clamp(iTime*.025, 0., 1.), 3.);
            float ax = mix(-.8, .36, T);
            float az = mix(-40., -140., T);
            
            // --- ENHANCEMENT: INCREASED MOUSE X RESPONSIVENESS ---
            // Increased sensitivity (1.5x) and loosened clamp to allow more horizontal looking
            float rx = M.x * 1.5 - (cos(iTime*.1)*.5+.5)*.4;
            rx = clamp(ax + rx - .55, -2.2, 0.8);

            vec3 ro = vec3(0, iTime*10., az);
            vec3 rd = normalize(vec3(u, 3));
            
            rd.zy *= rot(M.y*1.5); // Boosted Y Tilt responsiveness
            rd.zx *= rot(rx); 
            ro.zx *= rot(rx);  
        
            vec3 p; float d, t = 0.;
            for (int i = 0; i < 30; i++) {
                p = ro + t * rd; 
                t += d = map(p);
                if (d < .01 || t > 2200.) break;
            }
            
            // --- ENHANCEMENT: ELECTRIC CYAN DNA TONE SHIFT ---
            // Base color shifted from deep purple to a more technical navy/cyan mix
            vec3 baseCol = vec3(0.04, 0.12, 0.22) - vec3(0, 1.0, 1.0) * abs(p.x-40.) * 0.001;
            vec3 col = baseCol;
            col *= clamp(1. + dot(normal(p), normalize(vec3(0,0,1))), .5, 1.);
            
            col *= 1. - texture2D(iChannel0, vec2(p.x+p.z, p.y+p.z)*.05).rgb*.7;
            col *= occ;
            
            // Re-tuned fog (mix third param) to lean into Cyan DNA
            col = mix(vec3(0.001, 0.015, 0.02), col, exp(-t * 0.002 * vec3(0.7, 1.0, 1.2) - length(u) * 0.5));

            // Accumulation/Glow: Shifted from Amber to Electric Cyan mix
            col += acc * mix(vec3(0.1, 0.8, 1.0), vec3(0.0, 0.4, 0.6), t * 0.0006);
            col += pow(acc, 2.0) * vec3(0.0, 0.2, 0.4); // Hot specular peaks
                
            col = pow(col, .46*vec3(.98, 1.0, 1.02)); // Slight tint shift towards blue
            
            u = F/R; u *= 1. - u.yx;
            col *= pow(clamp(u.x * u.y * 80., 0., 1.), .2);
                        
            // --- ENHANCEMENT: INCREASED BRIGHTNESS ---
            // Increased from 0.2 to 0.4 for better visibility while remaining a background
            gl_FragColor = vec4(col * 0.45, 1.0); 
        }
    `;

    const material = new THREE.ShaderMaterial({
        uniforms: {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2(modalNarrative.clientWidth, modalNarrative.clientHeight) },
            iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
            iChannel0: { value: noiseTexture }
        },
        vertexShader: `
            void main() {
                gl_Position = vec4(position, 1.0);
            }
        `,
        fragmentShader: fragmentShader,
        transparent: true
    });

    narrativeShaderState.material = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    narrativeShaderState.mesh = mesh;

    // Global Mouse Listener for full-viewport influence (Option B+)
    window.addEventListener('mousemove', (e) => {
        // REMOVED: Activity guard - we always want targetMouse up-to-date even when inactive
        // so that it snaps instantly when the shader starts.

        const rect = modalNarrative.getBoundingClientRect();

        // Calculate influence based on window-center offset
        // This makes the shader tilt based on mouse position regardless of hover
        const winW = window.innerWidth;
        const winH = window.innerHeight;

        // Map window-relative coordinates to the canvas's coordinate system
        // for consistent shader math (iMouse.xy/iResolution)
        const mouseNormX = (e.clientX / winW) * 2 - 1; // -1 to 1
        const mouseNormY = (e.clientY / winH) * 2 - 1; // -1 to 1 (screen-top is 1)

        // Convert back to "pixels" relative to element resolution for the shader's internal math
        const x = (mouseNormX + 1) * 0.5 * modalNarrative.clientWidth;
        const y = (1 - (mouseNormY + 1) * 0.5) * modalNarrative.clientHeight;

        narrativeShaderState.targetMouse.set(x, y, 1, 1);
    });

    narrativeShaderState.startTime = performance.now();
    window.addEventListener('resize', handleResize);
}

/**
 * Starts the animation loop for the shader.
 */
export function startNarrativeShader() {
    if (narrativeShaderState.active) return;
    handleResize();

    // Reset interaction state for immediate responsiveness
    narrativeShaderState.startTime = performance.now();

    // SYNC: Snap current mouse to target immediately to avoid "lagging" from (0,0) center
    narrativeShaderState.currentMouse.x = narrativeShaderState.targetMouse.x;
    narrativeShaderState.currentMouse.y = narrativeShaderState.targetMouse.y;
    narrativeShaderState.currentMouse.z = 1.0; // Force activation immediately
    narrativeShaderState.currentMouse.w = 1.0;

    narrativeShaderState.active = true;
    animate();
}

/**
 * Stops the animation loop.
 */
export function stopNarrativeShader() {
    narrativeShaderState.active = false;
    if (narrativeShaderState.animationId) {
        cancelAnimationFrame(narrativeShaderState.animationId);
        narrativeShaderState.animationId = null;
    }
}

function handleResize() {
    const { parent, renderer, material } = narrativeShaderState;
    if (!parent || !renderer || !material) return;

    const width = parent.clientWidth;
    const height = parent.clientHeight;
    renderer.setSize(width, height);
    material.uniforms.iResolution.value.set(width, height);
}

function animate() {
    if (!narrativeShaderState.active) return;
    narrativeShaderState.animationId = requestAnimationFrame(animate);

    const { renderer, scene, camera, material, startTime, targetMouse, currentMouse, lerpFactor } = narrativeShaderState;
    if (!renderer || !scene || !camera || !material) return;

    // Apply interpolation: current = current + (target - current) * factor
    currentMouse.x += (targetMouse.x - currentMouse.x) * lerpFactor;
    currentMouse.y += (targetMouse.y - currentMouse.y) * lerpFactor;
    currentMouse.z += (targetMouse.z - currentMouse.z) * lerpFactor;
    currentMouse.w += (targetMouse.w - currentMouse.w) * lerpFactor;

    material.uniforms.iTime.value = (performance.now() - startTime) * 0.001;
    material.uniforms.iMouse.value.copy(currentMouse);
    renderer.render(scene, camera);
}
