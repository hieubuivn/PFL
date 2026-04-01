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
    uniform float uQuality; // Adaptive performance (0.0 to 1.0)
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

        // --- GLOBAL PULSE SYNC: Cube Core rhythm ---
        float globalT = mod((iTime) / 3., 1.0);
        float globalT2 = min(globalT * 1.85, 1.0);
        // Violent Kick: Sharp expansion, slower decay with a 'flash' peak
        float breathe = (1. - pow(1. - globalT2, 24.0)) * (1. - pow(globalT2, 2.5));
        float violentPeak = pow(breathe, 0.5);

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
                
                // Color Shift: The object itself gains a cyan tint as it loads
                vec3 baseObjectCol = vec3(diff * 1.2 + rim * 0.8 + 0.2);
                vec3 cyanTint = vec3(0.0, 0.95, 1.0) * (diff * 0.5 + rim * 1.5);
                col = mix(baseObjectCol, cyanTint, uLoadProgress * 0.8);
            }
            
            // --- VIOLENT BREATHING CORE: Synced with assembly cycle ---
            float coreDist = length(sceneUv);
            float microPulse = sin(iTime * 15.0) * 0.03 + 0.97;
            
            // NARRATIVE: Core intensity grows as loading progress increases
            // Base intensity is proportional to progress, plus the violent flare
            float loadIntensity = smoothstep(0.0, 1.0, uLoadProgress);
            
            // ADJUSTMENT: Core Visibility tied to the breathe cycle intensity
            // When violentPeak is low (shrunk/assembled state), visibility goes to zero
            float coreVisibility = smoothstep(0.01, 0.25, violentPeak);
            
            float breathIntensity = (0.05 + (violentPeak + loadIntensity * 0.5) * 3.2) * coreVisibility; 
            
            // Falloff gets tighter as it gets more 'energetic' (closer to load finish)
            float breathFalloff = 160.0 - (violentPeak + loadIntensity * 0.2) * 115.0; 
            
            float reveal = max(smoothstep(0.0, 0.4, uLoadProgress) * coreVisibility, 0.2 * coreVisibility);
            vec3 cyan = vec3(0.0, 0.95, 1.0);
            
            // "White Hot" Effect: Shift from Pure Cyan to White during intense peaks or near 100%
            float colorShiftFactor = saturate(violentPeak * 0.8 + loadIntensity * 0.4);
            vec3 coreColor = mix(cyan, vec3(1.0), colorShiftFactor * 0.9) * (1.5 + colorShiftFactor * 5.0);
            
            // Subtle White Flicker (Sparks/Unstable energy)
            float flicker = rand(vec2(iTime, 0.0)) > 0.97 ? 1.5 : 1.0;
            coreColor *= flicker;
            
            // --- 1. CORE GLOW ---
            float flare = exp(-coreDist * breathFalloff) * 3.8 * microPulse * breathIntensity;
            float aura = exp(-coreDist * (breathFalloff * 0.4)) * (0.01 + colorShiftFactor * 0.8);
            
            // Mask to ensure absolutely no bleed at edges
            float edgeMask = smoothstep(1.0, 0.5, coreDist);
            
            // Apply glow
            // If we hit, we only show glow for the front parts to simulate internal light
            float hitMask = (hit && rayPos.z < 0.2 ? 1.0 : hit ? 0.0 : 1.0);
            col += (coreColor * (flare + aura) * edgeMask) * reveal * hitMask;
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
        float barPulse = 0.4 + violentPeak * 2.1; // Lower base, higher pulse for contrast
        col += leadGlow * 0.22 * barPulse * vec3(0.0, 0.95, 1.0);
        col += mouseDistort * 0.05 * vec3(0.0, 0.95, 1.0);

        // Final Alpha & Gamma
        float alpha = (uLoadProgress > 1.0) ? 1.0 - smoothstep(0.0, 1.0, uLoadProgress - 1.0) : 1.0;
        gl_FragColor = vec4(pow(max(col, 0.0), vec3(1./2.2)), alpha);
    }
`)),e.linkProgram(n),e.useProgram(n);let o=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,o),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);let s=e.getAttribLocation(n,`position`);e.enableVertexAttribArray(s),e.vertexAttribPointer(s,2,e.FLOAT,!1,0,0),r.iTime=e.getUniformLocation(n,`iTime`),r.iResolution=e.getUniformLocation(n,`iResolution`),r.iMouse=e.getUniformLocation(n,`iMouse`),r.uLoadProgress=e.getUniformLocation(n,`uLoadProgress`),r.uQuality=e.getUniformLocation(n,`uQuality`),t=performance.now(),requestAnimationFrame(m)}let o=0,s=0,c={x:.5,y:.5},l={x:.5,y:.5},u={w:0,h:0},d=1,f=1,p=0;function m(n){if(!e)return;let i=(n-t)/1e3,a=(n-p)/1e3;p=n,o+=(s-o)*.05,f=a>.018?Math.max(.1,f-.25):Math.min(1,f+.01),d+=(f-d)*.1;let h=.08;l.x+=(c.x-l.x)*h,l.y+=(c.y-l.y)*h,e.uniform1f(r.iTime,i),e.uniform2f(r.iResolution,u.w,u.h),e.uniform2f(r.iMouse,l.x,l.y),e.uniform1f(r.uLoadProgress,o),e.uniform1f(r.uQuality,d),e.drawArrays(e.TRIANGLE_STRIP,0,4),requestAnimationFrame(m)}self.onmessage=t=>{let{type:n,payload:r}=t.data;n===`INIT`?(u.w=r.width,u.h=r.height,a(r.canvas),e.viewport(0,0,u.w,u.h)):n===`RESIZE`?(u.w=r.width,u.h=r.height,e&&(e.canvas.width=u.w,e.canvas.height=u.h,e.viewport(0,0,u.w,u.h))):n===`UPDATE_PROGRESS`?s=r:n===`MOUSE`&&(c.x=r.x,c.y=r.y)}})();