/**
 * BOOT WORKER - HIGH-END OFFSCREEN RENDERER
 * Restores the full Cinematic Shader logic from the original BootLoader.
 */

let gl;
let startTime;
let program;
let uniforms = {};

const vertexShaderSource = `
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
    }
`;

const fragmentShaderSource = `
    precision highp float;
    uniform float iTime;
    uniform vec2 iResolution;
    uniform vec2 iMouse;
    uniform float uLoadProgress;
    uniform float uQuality; // Adaptive performance (0.0 to 1.0)
    uniform float uGrokScaleFactor;
    varying vec2 vUv;

    #define PI 3.14159265359
    #define PHI 1.618033988749895

    // --- UTILS ---
    float saturate(float x) { return clamp(x, 0.0, 1.0); }
    void pR(inout vec2 p, float a) {
        p = cos(a)*p + sin(a)*vec2(p.y, -p.x);
    }
    float vmax(vec3 v) {
        return max(max(v.x, v.y), v.z);
    }
    float fBox(vec3 p, vec3 b) {
        vec3 d = abs(p) - b;
        return length(max(d, vec3(0))) + vmax(min(d, vec3(0)));
    }
    vec3 erot(vec3 p, vec3 ax, float ro) {
        return mix(dot(ax,p)*ax, p, cos(ro))+sin(ro)*cross(ax,p);
    }
    vec3 boolSign(vec3 v) {
        return max(vec3(0), sign(v)) * 2. - 1.;
    }
    float distSq(vec3 a, vec3 b) { vec3 d = a - b; return dot(d, d); }

    vec3 icosahedronVertex(vec3 p) {
        vec3 ap = abs(p), v = vec3(PHI, 1, 0), v2 = v.yzx, v3 = v2.yzx;
        if (distSq(ap, v2) < distSq(ap, v)) v = v2;
        if (distSq(ap, v3) < distSq(ap, v)) v = v3;
        return normalize(v) * boolSign(p);
    }
    vec3 dodecahedronVertex(vec3 p) {
        vec3 ap = abs(p), v = vec3(PHI), v2 = vec3(0, 1, PHI + 1.), v3 = v2.yzx, v4 = v3.yzx;
        if (distSq(ap, v2) < distSq(ap, v)) v = v2;
        if (distSq(ap, v3) < distSq(ap, v)) v = v3;
        if (distSq(ap, v4) < distSq(ap, v)) v = v4;
        return normalize(v) * boolSign(p);
    }
    vec3 secondDodecahedronVertex(vec3 p, vec3 iv, vec3 dv) {
        float side = sign(dot(p, cross(iv, dv)));
        return erot(dv, iv, PI * 0.4 * side);
    }

    float object(vec3 p) {
        pR(p.xz, 1.2); pR(p.xy, .3);
        float d = fBox(p, vec3(.10)) - .02;
        return d;
    }

    float map(vec3 p) {
        float b = length(p) - 1.5;
        if (b > 0.1) return b;
        if (iMouse.x > 0. || iMouse.y > 0.) {
            pR(p.yz, (0.5 - iMouse.y) * PI * 0.5);
            pR(p.xz, (0.5 - iMouse.x) * PI * 2.0);
        }
        vec3 a = icosahedronVertex(p), v_b = dodecahedronVertex(p), c = secondDodecahedronVertex(p, a, v_b);
        float d = 1e12; vec3 pp = p;
        for (int i = 0; i < 3; i++) {
            float t = mod((iTime - dot(a.xy, vec2(1,-1)) / 6.) / 3., 1.);
            float t2 = min(t * 1.85, 1.);
            float explode = (1. - pow(1. - t2, 10.)) * (1. - pow(t2, 5.));
            t2 = max(t - .53, 0.) * 1.2;
            float wobble = sin(t2 * 2.2 + pow(3. * t2, 1.5) * 4. * PI) * smoothstep(.4, .0, t2) * .15;
            p -= a * (wobble + explode) / 6.0;
            d = min(d, max(object(p), max(dot(p, normalize(v_b - a)), dot(p, normalize(c - a)))));
            p = pp; vec3 aa = a; a = v_b; v_b = c; c = aa;
        }
        return d;
    }

    vec3 calcNormal(vec3 p) {
        const float h = 0.0005; const vec2 k = vec2(1,-1);
        return normalize( k.xyy*map( p + k.xyy*h ) + k.yyx*map( p + k.yyx*h ) + k.yxy*map( p + k.yxy*h ) + k.xxx*map( p + k.xxx*h ) );
    }

    float rand(vec2 n) { return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }
    float inRect(vec2 p, vec2 b1, vec2 b2) {
        vec2 low = min(b1, b2), high = max(b1, b2);
        float edge = 0.02; // Soft edge for particles
        vec2 s = smoothstep(low, low + edge, p) * smoothstep(high, high - edge, p);
        return s.x * s.y;
    }
    float boxLayer(float depth, vec2 uv, float size, float pos) {
        float h = size * 0.5;
        vec2 c = vec2(4.0 * pos - 2.0, (1.0 - h) * sin(iTime * 1.5 * (0.3 + 0.7 * rand(vec2(depth, size))) ));
        return inRect(uv, c + vec2(-h, -h), c + vec2(h, h));
    }

    void main() {
        vec2 fragCoord = gl_FragCoord.xy;
        vec2 uv = (-iResolution.xy + 2. * fragCoord.xy) / iResolution.y;
        
        // --- 1. THE BUCKYBALL ZONE ---
        vec2 sceneUv = (uv - vec2(0.0, 0.2)) * 1.25; // Replicate Scissor Scale/Offset
        vec3 col = vec3(0.0);
        bool isBuckyZone = length(sceneUv) < 1.2;

        if (isBuckyZone) {
            vec3 camPos = vec3(0,0,3.2), rayDir = normalize(vec3(sceneUv,-4)), rayPos = camPos;
            float rayLen = 0., dist = 0.; bool hit = false;
            
            // RESTORED: Full 24 steps for the highest quality edges
            for (int i = 0; i < 24; i++) {
                rayLen += dist; rayPos = camPos + rayDir * rayLen;
                dist = map(rayPos);
                if (abs(dist) < .003) { hit = true; break; }
                if (rayLen > 4.5) break;
            }
            if (hit) {
                vec3 n = calcNormal(rayPos);
                float diff = max(dot(n, normalize(vec3(0.6, 1.0, 0.8))), 0.0);
                float rim = pow(1.0 - max(dot(n, -rayDir), 0.0), 2.5);
                col = vec3(diff * 1.2 + rim * 0.8 + 0.2);
            }
            
            // --- VIOLENT BREATHING CORE: Synced with assembly cycle ---
            float globalT = mod((iTime) / 3., 1.0);
            float globalT2 = min(globalT * 1.85, 1.0);
            float breathe = (1. - pow(1. - globalT2, 24.0)) * (1. - pow(globalT2, 2.5));
            float violentPeak = pow(breathe, 0.5);

            float microPulse = 1.0 + 0.05 * sin(iTime * 120.0);
            float breathIntensity = 0.5 + 0.5 * violentPeak;
            float breathFalloff = mix(3.5, 2.0, violentPeak);

            float reveal = max(smoothstep(0.0, 0.4, uLoadProgress), smoothstep(0.2, 0.8, sin(iTime * 2.1) * 0.5 + 0.5) * 0.6);
            vec3 cyan = vec3(0.0, 0.95, 1.0);
            float coreDist = length(sceneUv);

            // "White Hot" Effect: Desaturate and boost peak luminosity
            vec3 coreColor = mix(cyan, vec3(1.0), violentPeak * 0.9) * (1.2 + violentPeak * 5.0);

            // --- 1. CORE GLOW ---
            float flare = exp(-coreDist * breathFalloff) * 3.8 * microPulse * breathIntensity;
            float aura = exp(-coreDist * (breathFalloff * 0.6)) * (0.01 + violentPeak * 0.5);

            // Mask to ensure absolutely no bleed at edges
            float edgeMask = smoothstep(1.0, 0.5, coreDist);

            col += (coreColor * (flare + aura) * edgeMask) * reveal * (hit && rayPos.z < 0.2 ? 1.0 : hit ? 0.0 : 1.0);

            /* 
            // --- ACTUAL GROK CORE: Ported from HUD Garden (COMMENTED FOR LATER USE) ---
            vec2 pGrok = sceneUv / uGrokScaleFactor;
            float gRingMod = violentPeak * 0.15;
            float gSlashMod = violentPeak * 0.05;
            float gDist = length(pGrok) - (0.4 + gRingMod) + (0.02 + gSlashMod) / (pGrok.x - pGrok.y + 1e-5);
            float grokI = 0.05 / abs(gDist);
            vec3 grokCol = cyan * grokI;
            grokCol += vec3(1.0) * pow(clamp(grokI * 0.5, 0.0, 1.0), 3.0) * (1.0 + violentPeak * 2.0);
            float gMask = smoothstep(1.0, 0.5, length(pGrok));
            // col += (grokCol * gMask) * reveal * (hit && rayPos.z < 0.2 ? 1.0 : hit ? 0.0 : 1.0);
            */
        }

        // 2. THE LOADING BAR ZONE
        float aspect = iResolution.x / iResolution.y, barH = 0.025, barW = 0.6;
        float cellW = barH / aspect, numCells = floor(barW / cellW), actualBarW = numCells * cellW;
        float startX = (1.0 - actualBarW) * 0.5, barY = 0.08;
        
        // --- 1. VISUAL GLOW (Tracks Progress Lead) ---
        float leadX = startX + uLoadProgress * actualBarW;
        float dx_lead = abs(vUv.x - leadX) * aspect;
        float dy_lead = abs(vUv.y - barY);
        float leadGlow = exp(-dx_lead * 12.0) * exp(-dy_lead * 20.0);
        
        // --- 2. PHYSICAL DISTORTION (Tracks Mouse) ---
        float dx_mouse = abs(vUv.x - iMouse.x) * aspect;
        float dy_mouse = abs(vUv.y - barY);
        // Soft falloff for a smooth 'wave' transition across the grid
        float mouseDistort = exp(-dx_mouse * 6.5) * exp(-dy_mouse * 30.0);
        
        // Distortion: 1.0 + 2.5 = 3.5x peak height. 
        // This creates an aggressive 'stretchy' bulge under the cursor.
        float hMult = 1.0 + mouseDistort * 2.5;
        vec2 uv_bar = vec2((vUv.x - startX) / actualBarW, (vUv.y - barY) / (barH * hMult) + 0.5);
        
        // ANTI-ALIASING: Use smoothstep for soft edges
        float aa = 2.0 / iResolution.y; 
        float barMask = smoothstep(0.0, aa, uv_bar.x) * smoothstep(1.0, 1.0 - aa, uv_bar.x) *
                        smoothstep(0.0, aa * 2.0, uv_bar.y) * smoothstep(1.0, 1.0 - aa * 2.0, uv_bar.y);
        
        if (barMask > 0.0) {
            float cellID = floor(uv_bar.x * numCells);
            float cellF = fract(uv_bar.x * numCells);
            float gap = 0.12;
            
            // Smoothed Cell Mask
            float cellEdgeX = aa * numCells;
            float cellEdgeY = aa / barH;
            float cellMask = smoothstep(gap, gap + cellEdgeX, cellF) * smoothstep(1.0 - gap, 1.0 - gap - cellEdgeX, cellF) *
                             smoothstep(gap, gap + cellEdgeY, uv_bar.y) * smoothstep(1.0 - gap, 1.0 - gap - cellEdgeY, uv_bar.y);
                             
            if (cellMask > 0.0) {
                float active = clamp(uLoadProgress * numCells - cellID, 0.0, 1.0);
                
                // Color selection
                vec3 baseCol = vec3(0.08, 0.12, 0.15);
                vec3 cyan = vec3(0.0, 0.95, 1.0);
                vec3 barCol = mix(baseCol, cyan * 1.5, step(0.01, active));
                
                // Inner Intensity / Glow
                float innerGlow = pow(cellMask, 3.0);
                barCol *= (0.8 + 0.5 * innerGlow);
                
                float lead = boxLayer(0.0, vec2(uv_bar.x * 12.0 - uLoadProgress * 12.0, uv_bar.y * 3.0), 0.7, fract(iTime * 1.5));
                col = mix(col, barCol + lead * cyan * 1.6, barMask * cellMask);
            }
        }
        
        // Final Bloom: Major energy on progress, minimal aura on mouse.
        col += leadGlow * 0.22 * vec3(0.0, 0.95, 1.0);
        col += mouseDistort * 0.05 * vec3(0.0, 0.95, 1.0);

        // Final Alpha & Gamma
        float alpha = (uLoadProgress > 1.0) ? 1.0 - smoothstep(0.0, 1.0, uLoadProgress - 1.0) : 1.0;
        gl_FragColor = vec4(pow(max(col, 0.0), vec3(1./2.2)), alpha);
    }
`;

function createShader(gl, type, source) {
    const s = gl.createShader(type); gl.shaderSource(s, source); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(s)); return null; }
    return s;
}

function initGL(canvas) {
    gl = canvas.getContext('webgl', { alpha: true, antialias: true });
    if (!gl) return;
    program = gl.createProgram();
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertexShaderSource));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource));
    gl.linkProgram(program);
    gl.useProgram(program);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    uniforms.iTime = gl.getUniformLocation(program, 'iTime');
    uniforms.iResolution = gl.getUniformLocation(program, 'iResolution');
    uniforms.iMouse = gl.getUniformLocation(program, 'iMouse');
    uniforms.uLoadProgress = gl.getUniformLocation(program, 'uLoadProgress');
    uniforms.uQuality = gl.getUniformLocation(program, 'uQuality');
    uniforms.uGrokScaleFactor = gl.getUniformLocation(program, 'uGrokScaleFactor');
    startTime = performance.now();
    requestAnimationFrame(render);
}

let lastProgress = 0, mouse = { x: 0.5, y: 0.5 }, smoothedMouse = { x: 0.5, y: 0.5 }, res = { w: 0, h: 0 };
let currentQuality = 1.0, targetQuality = 1.0, lastTime = 0, grokScale = 1.0;

function render(now) {
    if (!gl) return;
    const time = (now - startTime) / 1000;
    const delta = (now - lastTime) / 1000;
    lastTime = now;

    // --- ADAPTIVE QUALITY LOGIC ---
    // If frame time > 18ms (below 55 FPS), drop quality quickly to protect smoothness.
    // If frame time is healthy, restore quality slowly.
    if (delta > 0.018) {
        targetQuality = Math.max(0.1, targetQuality - 0.25);
    } else {
        targetQuality = Math.min(1.0, targetQuality + 0.01);
    }
    // Smooth quality transition to prevent visual flickering
    currentQuality += (targetQuality - currentQuality) * 0.1;

    // --- SMOOTH MOUSE LERP (Delayed Follow) ---
    const factor = 0.08;
    smoothedMouse.x += (mouse.x - smoothedMouse.x) * factor;
    smoothedMouse.y += (mouse.y - smoothedMouse.y) * factor;

    gl.uniform1f(uniforms.iTime, time);
    gl.uniform2f(uniforms.iResolution, res.w, res.h);
    gl.uniform2f(uniforms.iMouse, smoothedMouse.x, smoothedMouse.y);
    gl.uniform1f(uniforms.uLoadProgress, lastProgress);
    gl.uniform1f(uniforms.uQuality, currentQuality);
    gl.uniform1f(uniforms.uGrokScaleFactor, grokScale);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
}

self.onmessage = e => {
    const { type, payload } = e.data;
    if (type === 'INIT') {
        res.w = payload.width; res.h = payload.height;
        initGL(payload.canvas);
        gl.viewport(0, 0, res.w, res.h);
    }
    else if (type === 'RESIZE') {
        res.w = payload.width; res.h = payload.height;
        if (gl) {
            gl.canvas.width = res.w; gl.canvas.height = res.h;
            gl.viewport(0, 0, res.w, res.h);
        }
    }
    else if (type === 'UPDATE_PROGRESS') lastProgress = payload;
    else if (type === 'UPDATE_GROK_SCALE') grokScale = payload;
    else if (type === 'MOUSE') { mouse.x = payload.x; mouse.y = payload.y; }
};
