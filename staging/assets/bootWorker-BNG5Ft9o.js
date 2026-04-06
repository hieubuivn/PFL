(function(){let e,t,n,r={};function i(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.error(e.getShaderInfoLog(r)),null)}function a(a){if(e=a.getContext(`webgl`,{alpha:!0,antialias:!0}),!e)return;n=e.createProgram(),e.attachShader(n,i(e,e.VERTEX_SHADER,`
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
    }
`)),e.attachShader(n,i(e,e.FRAGMENT_SHADER,`
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

    vec2 getDropPos(float t, float cycleID, float targetX, float barY) {
        float t_acc = pow(t, 1.5);
        float swing = sin(t * PI) * 0.15 * (rand(vec2(cycleID, 7.0)) * 2.0 - 1.0);
        float x = mix(0.0, targetX, pow(t, 0.8)) + swing;
        float y = mix(0.4, barY, t); // Start at 0.4
        return vec2(x, y);
    }

    void main() {
        vec2 fragCoord = gl_FragCoord.xy;
        vec2 uv = (-iResolution.xy + 2. * fragCoord.xy) / iResolution.y;
        float aspect = iResolution.x / iResolution.y;

        // --- GLOBAL SYNC ---
        float cycleDur = 3.0;
        float cycleID = floor(iTime / cycleDur);
        float globalT = mod(iTime / cycleDur, 1.0);
        float breathe = (1. - pow(1. - min(globalT * 1.85, 1.0), 24.0)) * (1. - pow(min(globalT * 1.85, 1.0), 2.5));
        float violentPeak = pow(breathe, 0.5);

        // --- INTERACTIVE MOUSE TARGETING ---
        float targetX = clamp((iMouse.x * 2.0 - 1.0) * aspect, -0.6, 0.6);
        float barY_uv = -0.84; 

        // --- 1. THE DROpleT PHYSICS ---
        float dropT_lin = saturate((globalT - 0.08) * 4.0);
        vec2 dPos_world = getDropPos(dropT_lin, cycleID, targetX, barY_uv);
        vec2 dPos_future = getDropPos(dropT_lin + 0.01, cycleID, targetX, barY_uv);
        vec2 velocity = dPos_future - dPos_world;
        float angle = atan(velocity.y, velocity.x);
        vec2 dPos_uv = uv - dPos_world;
        pR(dPos_uv, angle + PI*0.5); 

        float dVis = smoothstep(0.0, 0.1, dropT_lin) * smoothstep(1.0, 0.9, dropT_lin);
        float dropTip = saturate(dPos_uv.y * 10.0 + 0.5); 
        float teardropShape = 1.0 + pow(dropTip, 2.0) * 15.0; 
        float dShape = length(dPos_uv * vec2(teardropShape, 1.5)); 
        float dCore = smoothstep(0.035, 0.0, dShape) * dVis;
        float dGlow = exp(-length(dPos_uv) * 85.0) * dVis; 
        
        // --- 1b. Impact Splashes & Shards ---
        float impactFade = saturate((globalT - 0.28) * 4.0);
        float splash = (impactFade > 0.0) ? exp(-impactFade * 6.0) : 0.0;
        vec2 impactPos = uv - vec2(targetX, barY_uv);
        float impactAngle = atan(impactPos.y, impactPos.x);
        float distCol = length(impactPos);
        
        float shards = 0.0;
        if (impactFade > 0.01 && impactFade < 1.0) {
            float shardPath = distCol - (impactFade * (0.6 + rand(vec2(cycleID, 1.0)) * 0.4));
            float shardW = 0.008 + impactFade * 0.05;
            float rSeed = cycleID + floor(targetX * 100.0);
            float r1 = rand(vec2(rSeed, 11.0)) * 0.6 - 0.3;
            float r2 = rand(vec2(rSeed, 12.0)) * 0.6 - 0.3;
            float r3 = rand(vec2(rSeed, 13.0)) * 0.6 - 0.3;
            float r4 = rand(vec2(rSeed, 14.0)) * 0.6 - 0.3;

            shards = smoothstep(shardW, 0.0, abs(impactAngle - (PI*0.35 + r1))) + 
                     smoothstep(shardW, 0.0, abs(impactAngle - (PI*0.48 + r2))) + 
                     smoothstep(shardW, 0.0, abs(impactAngle - (PI*0.52 + r3))) +
                     smoothstep(shardW, 0.0, abs(impactAngle - (PI*0.65 + r4)));
            shards *= smoothstep(0.08, 0.0, abs(shardPath)) * splash;
        }

        // --- 2. THE CORE & SCENE ---
        vec2 sceneUv = (uv - vec2(0.0, 0.4)) * 1.25; // Shifted to 0.4
        vec3 col = mix(vec3(0.0, 0.95, 1.0), vec3(1.6), dCore) * (dGlow * 1.0 + dCore * 9.0); 
        col += vec3(0.0, 0.95, 1.0) * (shards * 4.5 + exp(-distCol * 35.0) * splash * 2.5); 
        
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
        
        // REFINED PLUNGE (Clean and Toned down)
        float impactUvX = (targetX / aspect + 1.0) * 0.5;
        float distToImpactX = abs(vUv.x - impactUvX) * actualBarW * numCells;
        float plunge = smoothstep(0.9, 0.0, distToImpactX) * splash * 1.8; 
        float impactFlash = exp(-distToImpactX * 3.5) * splash * 1.2; 
        
        vec2 uv_bar = vec2((vUv.x - startX) / actualBarW, (vUv.y - barY + plunge * 0.025) / (barH * (1.0 + mD * 1.8)) + 0.5);
        
        float aa = 2.0 / iResolution.y; 
        float barM = smoothstep(0.0, aa, uv_bar.x) * smoothstep(1.0, 1.0 - aa, uv_bar.x) *
                     smoothstep(0.0, aa * 2.0, uv_bar.y) * smoothstep(1.0, 1.0 - aa * 2.0, uv_bar.y);
        
        if (barM > 0.0) {
            float cellID = floor(uv_bar.x * numCells);
            float cF = fract(uv_bar.x * numCells);
            float cMask = smoothstep(0.12, 0.15, cF) * smoothstep(0.88, 0.85, cF) * smoothstep(0.12, 0.15, uv_bar.y) * smoothstep(0.88, 0.85, uv_bar.y);
            if (cMask > 0.0) {
                float act = clamp(uLoadProgress * numCells - cellID, 0.0, 1.0);
                float cellDist = abs(uv_bar.x - impactUvX) * 10.0;
                float barRipple = exp(-cellDist) * exp(-impactFade * 3.0) * sin(impactFade * 15.0) * 0.5;
                
                vec3 bc = mix(vec3(0.08, 0.12, 0.15), vec3(0.0, 0.95, 1.0) * (1.5 + barRipple * 4.0), step(0.01, act));
                bc += vec3(0.2, 0.6, 1.0) * impactFlash; 
                
                float l = boxLayer(0.0, vec2(uv_bar.x * 12.0 - uLoadProgress * 12.0, uv_bar.y * 3.0), 0.7, fract(iTime * 1.5));
                col = mix(col, bc + l * vec3(0.0, 0.95, 1.0) * 1.6, barM * cMask);
            }
        }
        
        col += lG * 0.22 * (0.4 + violentPeak * 2.1) * vec3(0.0, 0.95, 1.0);
        col += mD * 0.05 * vec3(0.0, 0.95, 1.0);

        float alpha = (uLoadProgress > 1.0) ? 1.0 - smoothstep(0.0, 1.0, uLoadProgress - 1.0) : 1.0;
        gl_FragColor = vec4(pow(max(col, 0.0), vec3(1./2.2)), alpha);
    }
`)),e.linkProgram(n),e.useProgram(n);let o=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,o),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);let s=e.getAttribLocation(n,`position`);e.enableVertexAttribArray(s),e.vertexAttribPointer(s,2,e.FLOAT,!1,0,0),r.iTime=e.getUniformLocation(n,`iTime`),r.iResolution=e.getUniformLocation(n,`iResolution`),r.iMouse=e.getUniformLocation(n,`iMouse`),r.uLoadProgress=e.getUniformLocation(n,`uLoadProgress`),r.uQuality=e.getUniformLocation(n,`uQuality`),t=performance.now(),requestAnimationFrame(m)}let o=0,s=0,c={x:.5,y:.5},l={x:.5,y:.5},u={w:0,h:0},d=1,f=1,p=0;function m(n){if(!e)return;let i=(n-t)/1e3,a=(n-p)/1e3;p=n,o+=(s-o)*.05,f=a>.018?Math.max(.1,f-.25):Math.min(1,f+.01),d+=(f-d)*.1,l.x+=(c.x-l.x)*.08,l.y+=(c.y-l.y)*.08,e.uniform1f(r.iTime,i),e.uniform2f(r.iResolution,u.w,u.h),e.uniform2f(r.iMouse,l.x,l.y),e.uniform1f(r.uLoadProgress,o),e.uniform1f(r.uQuality,d),e.drawArrays(e.TRIANGLE_STRIP,0,4),requestAnimationFrame(m)}self.onmessage=t=>{let{type:n,payload:r}=t.data;n===`INIT`?(u.w=r.width,u.h=r.height,a(r.canvas),e.viewport(0,0,u.w,u.h)):n===`RESIZE`?(u.w=r.width,u.h=r.height,e&&(e.canvas.width=u.w,e.canvas.height=u.h,e.viewport(0,0,u.w,u.h))):n===`UPDATE_PROGRESS`?s=r:n===`MOUSE`&&(c.x=r.x,c.y=r.y)}})();