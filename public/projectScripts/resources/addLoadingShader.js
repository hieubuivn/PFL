import * as THREE from 'three';

/**
 * Box Grid Veil: A high-spec tectonic loading shader.
 * Ported from testShader.html for a premium entry experience.
 */

const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
    }
`;

const fragmentShader = `
    uniform float iTime;
    uniform vec2 iResolution;
    uniform float uLoadProgress;
    varying vec2 vUv;

    #define PI 3.141592
    #define TAU (PI*2.0)

    float rand(vec2 n) { 
        return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453123);
    }

    float noise(vec2 p){
        vec2 ip = floor(p);
        vec2 u = fract(p);
        u = u*u*(3.0-2.0*u);
        
        float res = mix(
            mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
            mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
        return res*res;
    }

    float fbm(vec2 p) {
        float r = 0.0;
        float amp = 1.0;
        float freq = 1.0;
        for(int i = 0; i < 3; i++) {
            r += amp * noise(freq*p);
            amp *= 0.5;
            freq *= 1.0/0.5;
        }
        return r;
    }

    mat2 rot( float th ){ vec2 a = sin(vec2(1.5707963, 0) + th); return mat2(a, -a.y, a.x); }

    float remap(float val, float im, float ix, float om, float ox) {
        return clamp(om + (val - im) * (ox - om) / (ix - im), om, ox);
    }

    float cio(float t) {
        return t < 0.5
        ? 0.5 * (1.0 - sqrt(1.0 - 4.0 * t * t))
        : 0.5 * (sqrt((3.0 - 2.0 * t) * (2.0 * t - 1.0)) + 1.0);
    }

    struct GlobalAnim {
        float s;
        float hs;
        float t;
        float pls;
        mat2 totalRot;
        vec2 seed;
        float heightMod;
    };

    GlobalAnim g_anim;

    float noiseSimple(vec2 p){
        vec2 ip = floor(p);
        return rand(ip);
    }

    float animHeight(vec2 p, GlobalAnim anim, bool simple) {
        p *= anim.totalRot;
        p += anim.seed; 
        float h = simple ? noiseSimple(p * anim.s + anim.t * .5) : fbm(p * anim.s + anim.t * .5);
        return (h + anim.pls) * anim.hs * anim.heightMod;
    }

    float sdBox( vec3 p, vec3 b ) {
      vec3 d = abs(p) - b;
      return length(max(d,0.0));
    }

    vec2 rep( in vec2 p, in vec2 c) {
        return mod(p,c)-0.5*c;
    }

    float map(vec3 p) {
        p /= 0.5; // uScale hardcoded to 0.5 for stability
        float bd = length(p.xz) - 5.0; 
        if (bd > 0.5) return bd * 0.5;
        
        vec2 id = floor(p.xz * 2.5); 
        float height = animHeight(id * 0.4, g_anim, false) * 0.5;
        height *= smoothstep(0.2, -0.2, bd);
        
        p.xz = rep(p.xz, vec2(0.4));
        p.y -= height;
        float box = sdBox(p, vec3(0.08, height, 0.08));
        return (box + max(0.0, bd*0.5)) * .5 * 0.5;
    }

    vec2 trace(vec3 p, vec3 ray, float mx) {
        float t = 0.0;
        for (int i = 0; i < 32; i++) {
            float dist = map(p + ray * t);
            if (dist < 0.01 || t > mx) break;
            t += dist;
        }
        return vec2(t, 0.01);
    }

    vec3 getColor(vec3 p, vec3 ray) {
        vec2 t = trace(p, ray, 30.0);
        vec3 pos = p + ray * t.x;
        if (t.x > 30.0) return vec3(0.0);
        float invScale = 1.0 / 0.5;
        float rayRadius = 5.0; 
        float h = max(0.0, pos.y * invScale);
        return max(vec3(0.2, 0.5, 0.8) * 7.0 * pow(h, 4.0) * smoothstep(0.0, -2.0, length(pos.xz * invScale) - rayRadius), vec3(0.0));
    }

    mat3 camera(vec3 ro, vec3 ta, float cr ) {
        vec3 cw = normalize(ta - ro);
        vec3 cp = vec3(sin(cr), cos(cr),0.);
        vec3 cu = normalize( cross(cw,cp) );
        vec3 cv = normalize( cross(cu,cw) );
        return mat3( cu, cv, cw );
    }

    vec3 acesFilm(const vec3 x) {
        const float a = 2.51; float b = 0.03; float c = 2.43; float d = 0.59; float e = 0.14;
        return clamp((x * (a * x + b)) / (x * (c * x + d ) + e), 0.0, 1.0);
    }

    float N21(vec2 p) {
        p = fract(p * vec2(233.34, 851.73));
        p += dot(p, p + 23.45);
        return fract(p.x * p.y);
    }

    float inRect(vec2 pos, vec2 topLeft, vec2 rightBottom) {
        return step(topLeft.x, pos.x) * step(rightBottom.y, pos.y) * step(-rightBottom.x, -pos.x) * step(-topLeft.y, -pos.y);
    }

    float inBetween(float x, float a, float b) {
        return step(a, x) * step(-b, -x);
    }

    float boxLayer(float depth, vec2 uv, float size, float pos) {
        const float fullDepth = 4.0;
        float boxHalfSize = size * 0.5;
        vec2 boxCenter = vec2(fullDepth * pos, (1.0 - boxHalfSize) * sin(iTime * 1.5 * (0.3 + 0.7 * N21(vec2(depth, size))) ));
        return inRect(uv, boxCenter + vec2(-boxHalfSize, boxHalfSize), boxCenter + vec2(boxHalfSize, -boxHalfSize))
        * inRect(uv, vec2(0.0, 1.0), vec2(3.99, -1.0)) * mix(1.0, 0.0, pos);
    }

    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        vec2 uv = (fragCoord.xy * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);
        
        float t = iTime * 0.01;
        float cycleDuration = 25.0;
        float animTime = mod(iTime, cycleDuration);
        float cycleID = floor(iTime / cycleDuration);
        
        g_anim.seed = vec2(rand(vec2(cycleID, 1.2)), rand(vec2(cycleID, 3.4))) * 50.0;
        g_anim.heightMod = mix(0.7, 1.3, rand(vec2(cycleID, 5.6)));

        g_anim.t = animTime;
        float tt = remap(animTime, 1.0, 8.0, 0., 1.0);
        g_anim.s = mix(0., .3, cio(tt));
        tt = remap(animTime, 10.0, 18.0, 0., 1.0);
        g_anim.s = mix(g_anim.s, 1.0, cio(tt));
        tt = remap(animTime, 23.0, 25.0, 0., 1.0);
        g_anim.hs = mix(1.0, 0.0, cio(tt));
        g_anim.pls = (sin(animTime * 0.25 * TAU - PI*.5) * .5 + .5) * step(mod(animTime, 8.), 4.) * .2;

        float rotDir = (rand(vec2(cycleID, 7.8)) > 0.5) ? 1.0 : -1.0;
        float r1 = cio(remap(animTime, 3.0, 12.0, 0., 1.)) * 1.2 * rotDir;
        float r2 = -cio(remap(animTime, 13.0, 22.0, 0., 1.)) * 0.8 * rotDir;
        float r3 = cio(remap(animTime, 23.0, 25.0, 0., 1.)) * 0.4;
        float totalAngle = r1 + r2 + r3;
        float sa = sin(totalAngle), ca = cos(totalAngle);
        g_anim.totalRot = mat2(ca, -sa, sa, ca);

        vec3 ro = vec3(cos(t) * 10.0, 5.5, sin(t) * 10.0);
        vec3 ta = vec3(0.0, 1.0, 0.0);
        mat3 c = camera(ro, ta, 0.0);
        vec3 ray = c * normalize(vec3(uv, 2.5));
        vec3 col = getColor(ro, ray);
        
        vec3 lp = vec3(0.0, 6.0, 0.0), rd = ray;
        float invScale = 1.0 / 0.5;
        float s = 7.5, vol = 0.0;
        
        float jitter = rand(uv + iTime) * 0.4;
        s += jitter;

        for(int i = 0; i < 8; i++) { 
            vec3 pos = ro + rd*s;
            vec3 v = -normalize(lp - pos);
            float tv = -(lp.y-2.) / v.y;
            vec3 ppos = lp + v * tv;
            vec2 samplePos = ppos.xz * invScale;
            float rayRadius = 5.0;
            vol += pow(animHeight(samplePos, g_anim, true), 3.0) * 0.45 * smoothstep(0.0, 1.5, pos.y * invScale) * smoothstep(-0.5, -4.5, length(samplePos) - rayRadius);
            s += 0.55; 
        }

        col += 1.6*vec3(0.3*vol, 0.5*vol, vol);
        col = acesFilm(col * 0.5);
        col = pow(col, vec3(1.0/2.2));

        // --- Integrated Loading Bar ---
        float aspect = iResolution.x / iResolution.y;
        vec2 uv_ui = vUv;
        uv_ui.x *= aspect;
        
        const float barWidthRatio = 0.8;
        float inv_barWidth = 1.0 / (barWidthRatio * aspect);
        float barHeight = 0.012; 
        float twice_inv_barHeight = 2.0 / barHeight;

        mat3 T_bar2s = mat3(
            vec3(inv_barWidth, 0.0, 0.0),
            vec3(0.0, inv_barWidth, 0.0),
            vec3((1.0 - aspect * inv_barWidth) * 0.5, -0.05 * inv_barWidth, 1.0)
        );

        vec2 uv_bar = (T_bar2s * vec3(uv_ui, 1.0)).xy;
        float uvBarX = uv_bar.x;
        float barCells = (0.8 * aspect) / barHeight; 
        float cellID = floor(uvBarX * barCells);
        float quantizedProgress = floor(uLoadProgress * barCells);
        
        float isInBaseRect = inRect(uv_bar, vec2(0.0, 0.5 * barHeight), vec2(1.0, -0.5 * barHeight));
        float isInActiveRect = step(cellID, quantizedProgress) * isInBaseRect;
        float gaps = step(0.1, fract(uvBarX * barCells));
        isInActiveRect *= gaps;
        isInBaseRect *= gaps;

        vec3 baseColor = vec3(0.05, 0.08, 0.12);
        vec3 activeColor = mix(vec3(0.2, 0.5, 0.8), vec3(0.4, 0.8, 1.0), uvBarX);
        
        float verticalShine = pow(remap(uv_bar.y, -barHeight*0.5, barHeight*0.5, 0.0, 1.0), 0.5);
        float horizontalBevel = smoothstep(0.05, 0.2, fract(uvBarX * barCells)) * smoothstep(0.95, 0.8, fract(uvBarX * barCells));
        float gloss = smoothstep(0.4, 0.6, verticalShine) * 0.3;
        activeColor = activeColor * mix(0.7, 1.3, verticalShine * horizontalBevel) + gloss;

        vec3 barColor = mix(vec3(0.0), baseColor, isInBaseRect);
        barColor = mix(barColor, activeColor, isInActiveRect);

        mat3 T_top2bar = mat3(
            vec3(twice_inv_barHeight, 0.0, 0.0),
            vec3(0.0, twice_inv_barHeight, 0.0),
            vec3(-twice_inv_barHeight * uLoadProgress, 0.0, 1.0)
        );

        vec2 topCord = (T_top2bar * vec3(uv_bar, 1.0)).xy;
        float inBoxes = 0.0;
        inBoxes += boxLayer(0.0, topCord, 0.64, fract(0.0 + iTime * 0.6));
        inBoxes += boxLayer(0.25, topCord, 0.53, fract(0.25 + iTime * 0.6));
        inBoxes += boxLayer(0.5, topCord, 0.56, fract(0.5 + iTime * 0.6));
        inBoxes += boxLayer(0.75, topCord, 0.79, fract(0.75 + iTime * 0.6));

        barColor = mix(barColor, activeColor, clamp(inBoxes, 0.0, 1.0) * inBetween(uv_bar.x, 0.0, 1.0) );
        col = mix(col, barColor, isInBaseRect * 0.95);

        // Global Fade-Out (Quantum Dispersal)
        float alpha = 1.0;
        if (uLoadProgress > 1.0) {
            float ft = uLoadProgress - 1.0; 
            alpha = 1.0 - smoothstep(0.0, 1.0, ft);
            // col += vec3(0.0, 0.4, 0.6) * ft * 0.2;
        }

        fragColor = vec4(col, alpha);
    }

    void main() {
        mainImage(gl_FragColor, vUv * iResolution.xy);
    }
`;

export class LoadingVeil {
    constructor(scene) {
        this.scene = scene;
        this.geometry = new THREE.PlaneGeometry(2, 2);

        // Calculate initial res for the viewport
        const dpr = Math.min(window.devicePixelRatio, 2.0);
        const scale = 0.25; // Good balance for heavy init phase
        const res = new THREE.Vector2(window.innerWidth * dpr * scale, window.innerHeight * dpr * scale);

        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                iTime: { value: 0 },
                iResolution: { value: res },
                uTargetProgress: { value: 0 },
                uLoadProgress: { value: 0 }
            },
            transparent: true,
            depthTest: false,
            depthWrite: false,
            renderOrder: 9999
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.name = "BoxGridVeil";

        // Make it an overlay
        this.mesh.frustumCulled = false;
        scene.add(this.mesh);

        this.isActive = true;
        this.smoothingSpeed = 4.0;

        window.addEventListener('resize', this.onResize.bind(this));
    }

    onResize() {
        if (!this.isActive) return;
        const dpr = Math.min(window.devicePixelRatio, 2.0);
        const scale = 0.25;
        this.material.uniforms.iResolution.value.set(
            window.innerWidth * dpr * scale,
            window.innerHeight * dpr * scale
        );
    }

    update(time, targetProgress, delta = 0.016) {
        if (!this.isActive) return;

        this.material.uniforms.iTime.value = time;
        this.material.uniforms.uTargetProgress.value = targetProgress;

        // Smooth Catch-up
        const current = this.material.uniforms.uLoadProgress.value;
        const target = this.material.uniforms.uTargetProgress.value;

        // Only interpolate if we are in the loading phase
        if (!this.isHiding) {
            this.material.uniforms.uLoadProgress.value += (target - current) * (1.0 - Math.exp(-delta * this.smoothingSpeed));
        }

        if (this.material.uniforms.uLoadProgress.value >= 0.999 && !this.isHiding) {
            this.fadeOut();
        }
    }

    fadeOut() {
        if (this.isHiding) return;
        this.isHiding = true;

        let fadeStartTime = performance.now();
        const duration = 2000;

        const fadeLoop = () => {
            const now = performance.now();
            const elapsed = now - fadeStartTime;
            const t = Math.min(1.0, elapsed / duration);

            // Drive exit dispersal from 1.0 to 2.0
            this.material.uniforms.uLoadProgress.value = 1.0 + t;

            if (t < 1.0) {
                requestAnimationFrame(fadeLoop);
            } else {
                this.hide();
            }
        };
        fadeLoop();
    }

    hide() {
        this.isActive = false;
        window.removeEventListener('resize', this.onResize.bind(this));
        if (this.mesh.parent) {
            this.scene.remove(this.mesh);
        }
        this.geometry.dispose();
        this.material.dispose();
        // console.log("[Loading] Box Grid Veil Dispersed.");

        // Final UI cleanup: Hide HTML bar completely
        const htmlLoader = document.getElementById('loading-container');
        if (htmlLoader) htmlLoader.style.display = 'none';
    }
}

