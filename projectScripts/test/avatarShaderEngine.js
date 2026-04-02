import { ktx2Loader } from '../../configs/setupLoaders.js';
import TWEEN from 'tween';

/**
 * AvatarShaderEngine
 * Manages WebGL context, textures, and the custom GLSL effects for the profile avatar.
 */
class AvatarShaderEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        // Using WebGL2 for modern shader support (fwidth, etc.)
        this.gl = this.canvas.getContext('webgl2', {
            alpha: true,
            premultipliedAlpha: true,
            antialias: true
        });

        if (!this.gl) {
            console.error('WebGL2 not supported, falling back to WebGL1 (expect artifacts)');
            this.gl = this.canvas.getContext('webgl');
        }

        this.uProgress = 0.0;
        this.targetProgress = 0.0;
        this.mouse = { x: 0.5, y: 0.5 };
        this.textures = {
            poba: null,
            dev: null
        };

        this.init();
    }

    async init() {
        // console.log("[AvatarEngine] Initializing WebGL2 Lab (KTX2 Edition)...");

        // 1. Load Compressed Textures
        await this.loadTextures();

        // 2. Setup Shaders
        this.setupProgram();

        // 3. Start Loop
        this.onResize();
        window.addEventListener('resize', () => this.onResize());

        // Throttled mouse move: Use requestAnimationFrame to sync with display rate
        let mouseTicking = false;
        window.addEventListener('mousemove', (e) => {
            if (!mouseTicking) {
                requestAnimationFrame(() => {
                    this.onMouseMove(e);
                    mouseTicking = false;
                });
                mouseTicking = true;
            }
        });

        // Use IntersectionObserver to stop rendering when off-screen
        this.isVisible = true;
        if (window.IntersectionObserver) {
            const observer = new IntersectionObserver((entries) => {
                this.isVisible = entries[0].isIntersecting;
            }, { threshold: 0.01 });
            observer.observe(this.canvas);
        }

        requestAnimationFrame((t) => this.render(t));
        // console.log("[AvatarEngine] Engine Ready.");
    }

    async loadTextures() {
        const loadKTX2 = (url) => {
            return new Promise((resolve, reject) => {
                if (!ktx2Loader.transcoderPath) {
                    ktx2Loader.setTranscoderPath('https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/basis/');
                }

                if (!window._ktx2SupportDetected) {
                    ktx2Loader.detectSupport({
                        capabilities: { isWebGL2: true },
                        extensions: {
                            has: (name) => {
                                try { return !!this.gl.getExtension(name); } catch (e) { return false; }
                            },
                            get: (name) => {
                                try { return this.gl.getExtension(name); } catch (e) { return null; }
                            }
                        }
                    });
                    window._ktx2SupportDetected = true;
                }

                ktx2Loader.load(url, (texture) => {
                    const gl = this.gl;
                    const tex = gl.createTexture();
                    gl.bindTexture(gl.TEXTURE_2D, tex);

                    texture.mipmaps.forEach((level, i) => {
                        gl.compressedTexImage2D(
                            gl.TEXTURE_2D,
                            i,
                            texture.format,
                            level.width,
                            level.height,
                            0,
                            level.data
                        );
                    });

                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.mipmaps.length > 1 ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

                    resolve(tex);
                }, undefined, (err) => {
                    console.error("Failed to load KTX2:", url, err);
                    reject(err);
                });
            });
        };

        const BASE = (import.meta.env && import.meta.env.BASE_URL && import.meta.env.BASE_URL !== '/')
            ? import.meta.env.BASE_URL
            : './';

        const pobaUrl = `${BASE}textures/ktx2/cv-poba-nobg.ktx2`.replace('//', '/');
        const devUrl = `${BASE}textures/ktx2/cv-dev-nobg.ktx2`.replace('//', '/');

        this.textures.poba = await loadKTX2(pobaUrl);
        this.textures.dev = await loadKTX2(devUrl);
    }

    setupProgram() {
        const vsSource = `#version 300 es
            in vec2 aPosition;
            out vec2 vUv;
            void main() {
                vUv = aPosition * 0.5 + 0.5;
                vUv.y = 1.0 - vUv.y;
                gl_Position = vec4(aPosition, 0.0, 1.0);
            }
        `;

        const fsSource = `#version 300 es
            precision highp float;
            in vec2 vUv;
            out vec4 fragColor;
            uniform float uTime;
            uniform vec2 uResolution;
            uniform vec4 uMouse;
            uniform float uProgress;
            uniform sampler2D uTexPoba;
            uniform sampler2D uTexDev;

            // Faster pseudo-random hash
            float hash(vec2 p) {
                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
            }

            // Optimized Voronoi using dot() for squared distance
            float voronoi(in vec2 x ) {
                vec2 n = floor(x);
                vec2 f = fract(x);
                float m_dist = 1.0;
                for(int j=-1; j<=1; j++) {
                    for(int i=-1; i<=1; i++) {
                        vec2 g = vec2(float(i), float(j));
                        float h = hash(n + g);
                        vec2 o = vec2(h, fract(h*1.23)); 
                        vec2 r = g + o - f;
                        m_dist = min(m_dist, dot(r, r)); 
                    }
                }
                return sqrt(m_dist);
            }

            float digitalNoise(vec2 p) {
                return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }

            void main() {
                float aspect = uResolution.x / uResolution.y;
                vec2 bgUv = vUv;
                bgUv.x *= aspect;

                // 1. DYNAMIC DIGITAL GRID
                vec2 m = uMouse.xy;
                m.x *= aspect;
                
                float mouseFocus = smoothstep(0.6, 0.05, length(bgUv - m));
                float spotlight = mouseFocus * mouseFocus * 2.5; 

                float vPattern = voronoi(bgUv * 4.0 + uTime * 0.05);
                float val = pow(vPattern * 1.1, 4.0) * 1.1; 
                
                float pulse = sin(uTime * 0.5) * 0.5 + 0.5;
                float baseThickness = (0.8 + pulse * 0.4) / uResolution.y; 
                
                vec2 grid1 = step(mod(bgUv + uTime * 0.005, 0.1), vec2(baseThickness * 1.2));
                vec2 grid2 = step(mod(bgUv * 2.0 - uTime * 0.015, 0.1), vec2(baseThickness * 0.6));
                
                float gridFinal = max(grid1.x, grid1.y) * 0.7 + max(grid2.x, grid2.y) * 0.3;

                vec3 techColor = vec3(0.0, 0.8, 0.9); 
                vec3 bgCol = vec3(0.003, 0.015, 0.035);
                bgCol += val * gridFinal * techColor * (0.2 + spotlight * 0.6);
                bgCol += val * techColor * spotlight * 0.35;
                
                float scanPos = fract(uTime * 0.08) * 1.2 - 0.1;
                float scanHighlight = smoothstep(0.012, 0.0, abs(vUv.y - scanPos)) * gridFinal * 1.2;
                bgCol += techColor * scanHighlight * (0.1 + spotlight * 0.4);

                bgCol *= smoothstep(1.0, 0.45, length(vUv - 0.5));
                
                // 2. PERSONA SWAP
                float uT = uTime * 15.0; 
                float threshold = uProgress * 1.3 - 0.15;
                float jitter = digitalNoise(vec2(floor(vUv.y * 150.0), uT)) * 0.035;
                float sweepX = vUv.x + jitter;
                threshold += (digitalNoise(vec2(uT, uT)) - 0.5) * 0.015; 
                float sweepVal = smoothstep(threshold - 0.015, threshold + 0.015, sweepX);
                
                float glitchZone = smoothstep(0.2, 0.0, abs(sweepX - threshold));
                float chaoticY = floor(vUv.y * (40.0 + digitalNoise(vec2(floor(vUv.y * 5.0), uT)) * 60.0));
                float drift = (digitalNoise(vec2(chaoticY, uT)) - 0.5) * 2.0 * step(0.3, digitalNoise(vec2(chaoticY, uT))) * glitchZone * 0.25; 

                vec4 texDev = vec4(0.0);
                vec4 texPoba = vec4(0.0);
                
                if (sweepVal < 0.999) texDev = texture(uTexDev, vUv + vec2(-drift, 0));
                if (sweepVal > 0.001) {
                    texPoba = texture(uTexPoba, vUv + vec2(drift, 0));
                    if (glitchZone > 0.01) texPoba.r = texture(uTexPoba, vUv + vec2(drift + 0.03 * glitchZone, 0.0)).r;
                }
                
                vec4 avatarCol = mix(texDev, texPoba, sweepVal);
                
                // 3. SCAN-DASHES
                vec3 glitchCoreCol = vec3(0.0, 0.55, 0.7); 
                float scanLine = smoothstep(0.03, 0.0, abs(sweepX - threshold)) * step(0.4, digitalNoise(vec2(floor(vUv.y * 200.0), uT)));
                vec3 materialGlow = glitchCoreCol * scanLine * (digitalNoise(vec2(uT, uT)) * 0.3 + 0.75) * 1.8;
                
                if (glitchZone > 0.01) {
                    float scanRel = abs(vUv.x + jitter*0.5 - threshold);
                    materialGlow += glitchCoreCol * smoothstep(0.01, 0.0, abs(scanRel - 0.035)) * 0.4;
                    materialGlow += techColor * step(0.99, digitalNoise(vUv * 15.0 + uTime)) * glitchZone * 3.0;
                }

                // 4. SILHOUETTE EDGE (8 texture samples total for optimal balance)
                float edge = 0.0;
                if (avatarCol.a > 0.001) {
                    float o = 0.015; 
                    float aDev = min(texture(uTexDev, vUv + vec2(o, 0)).a, 
                                 min(texture(uTexDev, vUv + vec2(-o, o)).a, texture(uTexDev, vUv + vec2(-o, -o)).a));
                    float aPoba = min(texture(uTexPoba, vUv + vec2(o, 0)).a, 
                                  min(texture(uTexPoba, vUv + vec2(-o, o)).a, texture(uTexPoba, vUv + vec2(-o, -o)).a));
                    
                    edge = avatarCol.a * (1.0 - mix(aDev, aPoba, sweepVal));
                }

                // 5. CIRCUIT RIM
                float baseSpeed = uTime * 0.12 + sin(uTime * 1.5) * 0.15; 
                float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
                float spark = pow(smoothstep(0.06, 0.0, abs(fract(angle / 6.2831 + baseSpeed) - 0.5)), 4.0); 
                vec3 rimGlow = (techColor * 0.6 + (techColor + vec3(0.4)) * spark * 4.0) * edge * (1.2 + spotlight);

                // 6. FINAL COMPOSITION
                fragColor = vec4(mix(bgCol, avatarCol.rgb + rimGlow + materialGlow + 0.05, avatarCol.a), 1.0);
            }
        `;

        this.program = this.createProgram(vsSource, fsSource);
        this.locations = {
            aPosition: this.gl.getAttribLocation(this.program, 'aPosition'),
            uTime: this.gl.getUniformLocation(this.program, 'uTime'),
            uResolution: this.gl.getUniformLocation(this.program, 'uResolution'),
            uMouse: this.gl.getUniformLocation(this.program, 'uMouse'),
            uProgress: this.gl.getUniformLocation(this.program, 'uProgress'),
            uTexPoba: this.gl.getUniformLocation(this.program, 'uTexPoba'),
            uTexDev: this.gl.getUniformLocation(this.program, 'uTexDev')
        };

        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), this.gl.STATIC_DRAW);
    }

    createProgram(vs, fs) {
        const createShader = (type, source) => {
            const s = this.gl.createShader(type);
            this.gl.shaderSource(s, source);
            this.gl.compileShader(s);
            if (!this.gl.getShaderParameter(s, this.gl.COMPILE_STATUS)) {
                console.error(this.gl.getShaderInfoLog(s));
            }
            return s;
        };
        const p = this.gl.createProgram();
        this.gl.attachShader(p, createShader(this.gl.VERTEX_SHADER, vs));
        this.gl.attachShader(p, createShader(this.gl.FRAGMENT_SHADER, fs));
        this.gl.linkProgram(p);
        return p;
    }

    onMouseMove(e) {
        this.mouse.x = e.clientX / window.innerWidth;
        this.mouse.y = 1.0 - (e.clientY / window.innerHeight);
    }

    onResize() {
        this.canvas.width = this.canvas.clientWidth * window.devicePixelRatio;
        this.canvas.height = this.canvas.clientHeight * window.devicePixelRatio;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    render(t) {
        requestAnimationFrame((time) => this.render(time));

        // --- ALWAYS update TWEEN independently of shader throttle ---
        TWEEN.update(t);

        // --- INTELLIGENT FPS THROTTLING + VISIBILITY CHECK ---
        if (!this.isVisible) return;

        const isTransitioning = TWEEN.getAll().length > 0;
        const targetPeriod = isTransitioning ? 16.6 : 41.6; // 60fps active, ~24fps idle

        const delta = t - (this.lastTime || 0);
        if (delta < targetPeriod) return;
        this.lastTime = t;

        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.useProgram(this.program);

        this.gl.uniform1f(this.locations.uTime, t * 0.001);
        this.gl.uniform2f(this.locations.uResolution, this.canvas.width, this.canvas.height);
        this.gl.uniform4f(this.locations.uMouse, this.mouse.x, this.mouse.y, 0, 0);
        this.gl.uniform1f(this.locations.uProgress, this.uProgress);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures.poba);
        this.gl.uniform1i(this.locations.uTexPoba, 0);

        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures.dev);
        this.gl.uniform1i(this.locations.uTexDev, 1);

        this.gl.enableVertexAttribArray(this.locations.aPosition);
        this.gl.vertexAttribPointer(this.locations.aPosition, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }

    setProgress(v) {
        this.uProgress = v;
    }

    transitionTo(target) {
        new TWEEN.Tween(this)
            .to({ uProgress: target }, 1500)
            .easing(TWEEN.Easing.Cubic.InOut)
            .start();
    }
}

export { AvatarShaderEngine };
