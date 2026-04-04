/**
 * BOOT WORKER - HIGH-END OFFSCREEN RENDERER
 * Bug Fix: Removed 'round()' for WebGL 1.0 compatibility.
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
    uniform float uQuality; 
    varying vec2 vUv;

    #define PI 3.14159265359
    #define PHI 1.618033988749895

    float saturate(float x) { return clamp(x, 0.0, 1.0); }
    void pR(inout vec2 p, float a) { p = cos(a)*p + sin(a)*vec2(p.y, -p.x); }
    float vmax(vec3 v) { return max(max(v.x, v.y), v.z); }
    float fBox(vec3 p, vec3 b) {
        vec3 d = abs(p) - b;
        return length(max(d, vec3(0))) + vmax(min(d, vec3(0)));
    }
    vec3 erot(vec3 p, vec3 ax, float ro) { return mix(dot(ax,p)*ax, p, cos(ro))+sin(ro)*cross(ax,p); }
    vec3 boolSign(vec3 v) { return max(vec3(0), sign(v)) * 2. - 1.; }
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

    float object(vec3 p) {
        pR(p.xz, 1.2); pR(p.xy, .3);
        return fBox(p, vec3(.10)) - .02;
    }

    float map(vec3 p) {
        float b = length(p) - 1.25;
        if (b > 0.05) return b; 

        if (iMouse.x > 0. || iMouse.y > 0.) {
            pR(p.yz, (0.5 - iMouse.y) * PI * 0.5);
            pR(p.xz, (0.5 - iMouse.x) * PI * 2.0);
        }
        
        vec3 a = icosahedronVertex(p), v_b = dodecahedronVertex(p);
        float side = sign(dot(p, cross(a, v_b)));
        vec3 c = erot(v_b, a, PI * 0.4 * side);
        
        float dMax = 1e8; vec3 pp = p;
        for (int i = 0; i < 3; i++) {
            float t = mod((iTime - dot(a.xy, vec2(1,-1)) / 6.) / 3., 1.);
            float t2 = min(t * 1.85, 1.);
            float explode = (1. - pow(1. - t2, 10.)) * (1. - pow(t2, 5.));
            t2 = max(t - .53, 0.) * 1.2;
            float wobble = sin(t2 * 2.2 + pow(3. * t2, 1.5) * 4. * PI) * smoothstep(.4, .0, t2) * .15;
            p -= a * (wobble + explode) / 6.0;
            dMax = min(dMax, max(object(p), max(dot(p, normalize(v_b - a)), dot(p, normalize(c - a)))));
            p = pp; vec3 aa = a; a = v_b; v_b = c; c = aa;
        }
        return dMax;
    }

    vec3 calcNormal(vec3 p) {
        const float h = 0.001; const vec2 k = vec2(1,-1);
        return normalize( k.xyy*map( p + k.xyy*h ) + k.yyx*map( p + k.yyx*h ) + k.yxy*map( p + k.yxy*h ) + k.xxx*map( p + k.xxx*h ) );
    }

    float rand(vec2 n) { return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }
    float inRect(vec2 p, vec2 b1, vec2 b2) {
        vec2 low = min(b1, b2), high = max(b1, b2);
        vec2 s = smoothstep(low, low + 0.02, p) * smoothstep(high, high - 0.02, p);
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
        float aspect = iResolution.x / iResolution.y;

        float globalT = mod(iTime / 3.0, 1.0);
        float breathe = (1. - pow(1. - min(globalT * 1.85, 1.0), 24.0)) * (1. - pow(min(globalT * 1.85, 1.0), 2.5));
        float violentPeak = pow(breathe, 0.5);

        float dropT = saturate((globalT - 0.08) * 4.0);
        float barY_uv = -0.84; 
        float dropY = mix(0.2, barY_uv, dropT);
        float dVis = smoothstep(0.0, 0.05, dropT) * step(barY_uv, uv.y) * step(uv.y, dropY + 0.05);
        vec2 dPos = uv - vec2(0.0, dropY); 
        
        float dropW = 1.0 + smoothstep(-0.02, 0.08, dPos.y) * 15.0; 
        float dCore = smoothstep(0.03, 0.0, length(dPos * vec2(dropW, 2.2))) * dVis;
        float dGlow = exp(-length(dPos) * 120.0) * dVis; 
        
        float impactActive = step(0.33, globalT);
        float impactFade = saturate((globalT - 0.33) * 10.0);
        float impactPeak = impactActive * exp(-impactFade * 12.0);
        float dImpact = length(uv - vec2(0.0, barY_uv));

        vec3 col = mix(vec3(0.0, 0.95, 1.0), vec3(1.5), dCore) * (dGlow * 1.2 + dCore * 8.0); 
        col += vec3(0.0, 0.95, 1.0) * (exp(-dImpact * 120.0) * impactPeak * 18.0);
        
        // CORE RENDERER
        vec2 sceneUv = (uv - vec2(0.0, 0.2)) * 1.25; 
        if (length(sceneUv) < 1.15) { 
            vec3 camPos = vec3(0,0,3.2), rayDir = normalize(vec3(sceneUv,-4)), rayPos = camPos;
            float rayLen = 0., distM = 0.; bool hit = false;
            
            // WebGL 1.0 Compatibility Fix: Manual round and fixed loop termination
            int iterations = int(floor(16.0 + 12.0 * uQuality + 0.5));
            for (int i = 0; i < 28; i++) {
                if (i >= iterations) break;
                rayLen += distM; rayPos = camPos + rayDir * rayLen;
                distM = map(rayPos);
                if (abs(distM) < .003) { hit = true; break; }
                if (rayLen > 4.5) break;
            }
            if (hit) {
                vec3 n = calcNormal(rayPos);
                float diff = max(dot(n, normalize(vec3(0.6, 1.0, 0.8))), 0.0);
                float rim = pow(1.0 - max(dot(n, -rayDir), 0.0), 2.5);
                vec3 cyan = vec3(0.0, 0.95, 1.0) * (diff * 0.5 + rim * 1.5);
                col = mix(vec3(diff * 1.2 + rim * 0.8 + 0.2), cyan, uLoadProgress * 0.8);
            }
            float coreDist = length(sceneUv), coreV = smoothstep(0.01, 0.25, violentPeak);
            float loadI = smoothstep(0.0, 1.0, uLoadProgress);
            float bI = (0.05 + (violentPeak + loadI * 0.5) * 3.2) * coreV; 
            float bF = 160.0 - (violentPeak + loadI * 0.2) * 115.0; 
            vec3 coreC = mix(vec3(0.0, 0.95, 1.0), vec3(1.0), saturate(violentPeak * 0.8 + loadI * 0.4) * 0.9) * (1.5 + saturate(violentPeak * 0.8 + loadI * 0.4) * 5.0);
            float flare = exp(-coreDist * bF) * 3.8 * sin(iTime * 15.0) * bI;
            float aura = exp(-coreDist * (bF * 0.4)) * (0.01 + saturate(violentPeak * 0.8 + loadI * 0.4) * 0.8);
            col += (coreC * (flare + aura) * smoothstep(1.0, 0.5, coreDist)) * max(smoothstep(0.0, 0.4, uLoadProgress) * coreV, 0.2 * coreV) * (hit && rayPos.z < 0.2 ? 1.0 : hit ? 0.0 : 1.0);
        }

        // --- BAR ---
        float barH = 0.025, barW = 0.6;
        float actualBarW = floor(barW / (barH / aspect)) * (barH / aspect);
        float startX = (1.0 - actualBarW) * 0.5, barY = 0.08;
        float dxM = abs(vUv.x - iMouse.x) * aspect;
        float mD = exp(-dxM * 6.5) * exp(-abs(vUv.y - barY) * 30.0);
        
        vec2 uv_bar = vec2((vUv.x - startX) / actualBarW, (vUv.y - barY) / (barH * (1.0 + mD * 2.5)) + 0.5);
        if (uv_bar.x >= 0.0 && uv_bar.x <= 1.0 && uv_bar.y >= 0.0 && uv_bar.y <= 1.0) {
            float numCells = floor(barW / (barH / aspect));
            float cellID = floor(uv_bar.x * numCells);
            float cellIDNorm = cellID / numCells;
            float cellPlunge = impactActive * exp(-abs(cellIDNorm - 0.5) * 15.0) * impactPeak * 6.5; 
            float localY = uv_bar.y - cellPlunge; 

            if (localY >= 0.12 && localY <= 0.88) {
                float cF = fract(uv_bar.x * numCells);
                if (cF >= 0.12 && cF <= 0.88) {
                    float ripple = impactActive * exp(-abs(cellIDNorm - 0.5) * 4.0) * impactPeak * sin(impactFade * 15.0) * 0.5;
                    vec3 bc = mix(vec3(0.08, 0.12, 0.15), vec3(0.0, 0.95, 1.0) * (1.5 + ripple * 4.0), step(0.01, clamp(uLoadProgress * numCells - cellID, 0.0, 1.0)));
                    bc = mix(bc, vec3(1.5), impactActive * exp(-abs(cellIDNorm - 0.5) * 12.0) * impactPeak); 
                    col = mix(col, bc, 1.0); 
                }
            }
        }
        
        float leadX = startX + uLoadProgress * actualBarW;
        float lH = (0.22 + impactPeak * 1.25) * (0.4 + violentPeak * 2.1); 
        col += exp(-abs(vUv.x - leadX) * aspect * 12.0) * exp(-abs(vUv.y - barY) * 20.0) * lH * vec3(0.0, 0.95, 1.0);
        col += mD * 0.05 * vec3(0.0, 0.95, 1.0);
        gl_FragColor = vec4(pow(max(col, 0.0), vec3(1./2.2)), (uLoadProgress > 1.0) ? 1.0 - smoothstep(0.0, 1.0, uLoadProgress - 1.0) : 1.0);
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
    startTime = performance.now();
    requestAnimationFrame(render);
}

let currentProgress = 0, targetProgress = 0, mouse = { x: 0.5, y: 0.5 }, smoothedMouse = { x: 0.5, y: 0.5 }, res = { w: 0, h: 0 };
let currentQuality = 1.0, targetQuality = 1.0, lastTime = 0;

function render(now) {
    if (!gl) return;
    const time = (now - startTime) / 1000;
    const delta = (now - lastTime) / 1000;
    lastTime = now;
    currentProgress += (targetProgress - currentProgress) * 0.05;
    if (delta > 0.018) targetQuality = Math.max(0.1, targetQuality - 0.25);
    else targetQuality = Math.min(1.0, targetQuality + 0.01);
    currentQuality += (targetQuality - currentQuality) * 0.1;
    smoothedMouse.x += (mouse.x - smoothedMouse.x) * 0.08;
    smoothedMouse.y += (mouse.y - smoothedMouse.y) * 0.08;
    gl.uniform1f(uniforms.iTime, time);
    gl.uniform2f(uniforms.iResolution, res.w, res.h);
    gl.uniform2f(uniforms.iMouse, smoothedMouse.x, smoothedMouse.y);
    gl.uniform1f(uniforms.uLoadProgress, currentProgress);
    gl.uniform1f(uniforms.uQuality, currentQuality);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
}

self.onmessage = (e) => {
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
    else if (type === 'UPDATE_PROGRESS') {
        targetProgress = payload; 
    }
    else if (type === 'MOUSE') { 
        mouse.x = payload.x; 
        mouse.y = payload.y; 
    }
};
