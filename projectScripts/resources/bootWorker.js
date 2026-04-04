/**
 * BOOT WORKER - HIGH-END OFFSCREEN RENDERER
 * Debug Fixes: Improved plunge timing and localized cell displacement.
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
    void pR(inout vec2 p, float a) {
        p = cos(a)*p + sin(a)*vec2(p.y, -p.x);
    }
    float vmax(vec3 v) { return max(max(v.x, v.y), v.z); }
    float fBox(vec3 p, vec3 b) {
        vec3 d = abs(p) - b;
        return length(max(d, vec3(0))) + vmax(min(d, vec3(0)));
    }
    vec3 erot(vec3 p, vec3 ax, float ro) {
        return mix(dot(ax,p)*ax, p, cos(ro))+sin(ro)*cross(ax,p);
    }
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
        float edge = 0.02; 
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
        float aspect = iResolution.x / iResolution.y;

        // --- GLOBAL SYNC ---
        float globalT = mod(iTime / 3.0, 1.0);
        float breathe = (1. - pow(1. - min(globalT * 1.85, 1.0), 24.0)) * (1. - pow(min(globalT * 1.85, 1.0), 2.5));
        float violentPeak = pow(breathe, 0.5);

        // --- 1. THE DROpleT PHYSICS ---
        float dropT = saturate((globalT - 0.08) * 4.0);
        float barY_uv = -0.84; 
        float dropY = mix(0.2, barY_uv, dropT);
        float dVis = smoothstep(0.0, 0.1, dropT) * smoothstep(1.0, 0.9, dropT);
        vec2 dPos = uv - vec2(0.0, dropY); 
        
        // PHSICAL TEARDROP: Nonlinear width scaling for a sharp tip
        float dropTip = saturate(dPos.y * 10.0 + 0.5); 
        float teardropShape = 1.0 + pow(dropTip, 2.0) * 15.0; 
        float dShape = length(dPos * vec2(teardropShape, 1.5)); 
        
        float dCore = smoothstep(0.035, 0.0, dShape) * dVis;
        float dGlow = exp(-length(dPos) * 85.0) * dVis; 
        
        // Impact Splashes / Shards
        float impactFade = saturate((globalT - 0.28) * 4.0);
        // FIX: Ensure splash only exists after impact starts (T > 0.28)
        float splash = (impactFade > 0.0) ? exp(-impactFade * 6.0) : 0.0;
        vec2 impactPos = uv - vec2(0.0, barY_uv);
        float angle = atan(impactPos.y, impactPos.x);
        float distCol = length(impactPos);
        
        float shards = 0.0;
        if (impactFade > 0.01 && impactFade < 1.0) {
            float shardPath = distCol - (impactFade * 0.6);
            float shardW = 0.02 + impactFade * 0.15;
            float radialA = mod(angle + PI*0.5, PI*2.0);
            if (radialA < PI) {
                shards = smoothstep(shardW, 0.0, abs(radialA - PI*0.25)) + 
                         smoothstep(shardW, 0.0, abs(radialA - PI*0.5)) + 
                         smoothstep(shardW, 0.0, abs(radialA - PI*0.75));
                shards *= smoothstep(0.06, 0.0, abs(shardPath)) * splash;
            }
        }

        // --- 2. CORE ZONE ---
        vec2 sceneUv = (uv - vec2(0.0, 0.2)) * 1.25; 
        vec3 col = mix(vec3(0.0, 0.95, 1.0), vec3(1.6), dCore) * (dGlow * 1.0 + dCore * 9.0); 
        col += vec3(0.0, 0.95, 1.0) * (shards * 4.0 + exp(-distCol * 30.0) * splash * 2.5); 
        
        bool isBuckyZone = length(sceneUv) < 1.2;
        if (isBuckyZone) {
            vec3 camPos = vec3(0,0,3.2), rayDir = normalize(vec3(sceneUv,-4)), rayPos = camPos;
            float rayLen = 0., dist = 0.; bool hit = false;
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
                vec3 base = vec3(diff * 1.2 + rim * 0.8 + 0.2);
                vec3 cyan = vec3(0.0, 0.95, 1.0) * (diff * 0.5 + rim * 1.5);
                col = mix(base, cyan, uLoadProgress * 0.8);
            }
            float coreDist = length(sceneUv);
            float microPulse = sin(iTime * 15.0) * 0.03 + 0.97;
            float loadI = smoothstep(0.0, 1.0, uLoadProgress);
            float coreV = smoothstep(0.01, 0.25, violentPeak);
            float bI = (0.05 + (violentPeak + loadI * 0.5) * 3.2) * coreV; 
            float bF = 160.0 - (violentPeak + loadI * 0.2) * 115.0; 
            float rev = max(smoothstep(0.0, 0.4, uLoadProgress) * coreV, 0.2 * coreV);
            vec3 coreC = mix(vec3(0.0, 0.95, 1.0), vec3(1.0), saturate(violentPeak * 0.8 + loadI * 0.4) * 0.9) * (1.5 + saturate(violentPeak * 0.8 + loadI * 0.4) * 5.0);
            coreC *= (rand(vec2(iTime, 0.0)) > 0.97 ? 1.5 : 1.0);
            float flare = exp(-coreDist * bF) * 3.8 * microPulse * bI;
            float aura = exp(-coreDist * (bF * 0.4)) * (0.01 + saturate(violentPeak * 0.8 + loadI * 0.4) * 0.8);
            col += (coreC * (flare + aura) * smoothstep(1.0, 0.5, coreDist)) * rev * (hit && rayPos.z < 0.2 ? 1.0 : hit ? 0.0 : 1.0);
        }

        // 3. THE LOADING BAR ZONE
        float barH = 0.025, barW = 0.6;
        float cellW = barH / aspect, numCells = floor(barW / cellW), actualBarW = numCells * cellW;
        float startX = (1.0 - actualBarW) * 0.5, barY = 0.08;
        float leadX = startX + uLoadProgress * actualBarW;
        float dxL = abs(vUv.x - leadX) * aspect;
        float dyL = abs(vUv.y - barY);
        float lG = exp(-dxL * 12.0) * exp(-dyL * 20.0);
        float dxM = abs(vUv.x - iMouse.x) * aspect;
        float dyM = abs(vUv.y - barY);
        float mD = exp(-dxM * 6.5) * exp(-dyM * 30.0);
        
        // REFINED PLUNGE: Localization and Timing
        float impactCellX = 0.5; 
        float distToImpactX = abs(vUv.x - impactCellX) * numCells; // Units of cell width
        // FIX: Sharp falloff so only cells directly under the drop dip
        float plunge = smoothstep(1.5, 0.0, distToImpactX) * splash * 1.8; 
        
        vec2 uv_bar = vec2((vUv.x - startX) / actualBarW, (vUv.y - barY + plunge * 0.02) / (barH * (1.0 + mD * 2.5)) + 0.5);
        
        float aa = 2.0 / iResolution.y; 
        float barM = smoothstep(0.0, aa, uv_bar.x) * smoothstep(1.0, 1.0 - aa, uv_bar.x) *
                     smoothstep(0.0, aa * 2.0, uv_bar.y) * smoothstep(1.0, 1.0 - aa * 2.0, uv_bar.y);
        
        if (barM > 0.0) {
            float cellID = floor(uv_bar.x * numCells);
            float cF = fract(uv_bar.x * numCells);
            float cMask = smoothstep(0.12, 0.15, cF) * smoothstep(0.88, 0.85, cF) * smoothstep(0.12, 0.15, uv_bar.y) * smoothstep(0.88, 0.85, uv_bar.y);
            if (cMask > 0.0) {
                float act = clamp(uLoadProgress * numCells - cellID, 0.0, 1.0);
                
                float cellDist = abs(uv_bar.x - impactCellX) * 10.0;
                float barRipple = exp(-cellDist) * exp(-impactFade * 3.0) * sin(impactFade * 15.0) * 0.5;
                
                vec3 bc = mix(vec3(0.08, 0.12, 0.15), vec3(0.0, 0.95, 1.0) * (1.5 + barRipple * 4.0), step(0.01, act));
                float l = boxLayer(0.0, vec2(uv_bar.x * 12.0 - uLoadProgress * 12.0, uv_bar.y * 3.0), 0.7, fract(iTime * 1.5));
                col = mix(col, bc + l * vec3(0.0, 0.95, 1.0) * 1.6, barM * cMask);
            }
        }
        
        col += lG * 0.22 * (0.4 + violentPeak * 2.1) * vec3(0.0, 0.95, 1.0);
        col += mD * 0.05 * vec3(0.0, 0.95, 1.0);

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
