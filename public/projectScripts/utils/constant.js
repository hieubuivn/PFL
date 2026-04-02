import * as THREE from 'three';
import { linkConstantUniforms } from './addConstantUniform.js'

export const MAX_PULSES = 8;

export const fresnelVertexShader = `
    uniform float mRefractionRatio;
    uniform float mFresnelBias;
    uniform float mFresnelScale;
    uniform float mFresnelPower;

    varying vec3 vReflect;
    varying vec3 vRefract[3];
    varying float vReflectionFactor;

    void main() {

        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );

        vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );

        vec3 I = worldPosition.xyz - cameraPosition;

        vReflect = reflect( I, worldNormal );
        vRefract[0] = refract( normalize( I ), worldNormal, mRefractionRatio );
        vRefract[1] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.99 );
        vRefract[2] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.98 );
        vReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), mFresnelPower );

        gl_Position = projectionMatrix * mvPosition;

    }
`;
export const fresnelFragmentShader = `
    uniform samplerCube tCube;
    uniform float uOpacity; // Declare the opacity uniform provided by Three.js

    varying vec3 vReflect;
    varying vec3 vRefract[3];
    varying float vReflectionFactor;

    void main() {

        vec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );
        vec4 refractedColor = vec4( 1.0 );

        refractedColor.r = textureCube( tCube, vec3( -vRefract[0].x, vRefract[0].yz ) ).r;
        refractedColor.g = textureCube( tCube, vec3( -vRefract[1].x, vRefract[1].yz ) ).g;
        refractedColor.b = textureCube( tCube, vec3( -vRefract[2].x, vRefract[2].yz ) ).b;

        // 1. Calculate the final RGB color first
        vec3 mixedColor = mix( refractedColor.rgb, reflectedColor.rgb, clamp( vReflectionFactor, 0.0, 1.0 ) );

        // 2. Construct the final output color using your calculated RGB 
        //    and the 'uOpacity' uniform for the alpha channel.
        gl_FragColor = vec4( mixedColor, uOpacity );
    }
`;
export const vertexShaderGlow = `
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        void main() 
        {
          vNormal = normalize( normalMatrix * normal ); // vNormals, the normals vectors of the object related to the world position (where it is in the global scene).
          
          vPositionNormal = normalize(( modelViewMatrix * vec4(position, 1.0) ).xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`
export const fragmentShaderOuterGlow = `
        uniform vec3 glowColor;
        uniform float outerGlowBorder;
        uniform float p;
        uniform float outerGlowStrength;
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        void main() 
        {
          float a = pow( outerGlowBorder + outerGlowStrength * abs(dot(vNormal, vPositionNormal)), p );
          gl_FragColor = vec4( glowColor , a );
        }
        `
export const fragmentShaderInnerGlow = `
uniform vec3 glowColor;
uniform float glowIntensity;
uniform float glowPower;
varying vec3 vNormal;
varying vec3 vPositionNormal;

void main() 
{
    float fresnel = 1.0 - abs(dot(normalize(vNormal), normalize(vPositionNormal)));
    float a = smoothstep(0.0, 1.0, pow(fresnel, glowPower)) * glowIntensity;
    gl_FragColor = vec4( glowColor , a );
}
        `
export const vertexShader = `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        varying vec3 vWorldPosition;
        
        attribute float aLayoutMode;
        varying float vLayoutMode;

        void main() 
        {
          vNormal = normalize( normalMatrix * normal ); // 
          vPositionNormal = normalize(( modelViewMatrix * vec4(position, 1.0) ).xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          gl_PointSize = 4.0;
          vUv = uv;
          vLayoutMode = aLayoutMode;

          vec4 worldPosition	= modelMatrix * vec4( position, 1.0 );
          vWorldPosition = worldPosition.xyz;

        }     
    `

export const sineVertexShader = `
        uniform float iTime;
        uniform float nebulaTwistFactor;
        #define uFrequency 5.0
        #define uAmplitude 0.2

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        varying vec3 vWorldPosition;

        void main() 
        {
            float pos = (position.x + position.z) * uFrequency;
            float waveValue = sin(pos + iTime);
            float offset = abs(waveValue) * uAmplitude;

            vec3 newPosition = position + vec3(1.0) * offset * 100.0*(0.8 + nebulaTwistFactor);

            vNormal = normalize( normalMatrix * normal ); 
            vPositionNormal = normalize(( modelViewMatrix * vec4(newPosition, 1.0) ).xyz);
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
            gl_PointSize = 4.0;
            vUv = uv;

            vec4 worldPosition = modelMatrix * vec4( newPosition, 1.0 );
            vWorldPosition = worldPosition.xyz;
        }     
    `;

export const fireFS = `
    uniform float iTime;
    uniform vec2 uMouse; // x: -1.0 to 1.0 (Skew), y: -1.0 to 1.0 (Height)
    uniform vec2 uSmoothedMouse;
    uniform float uFireHeightOverride;
    
    varying vec2 vUv;

    // --- NOISE FUNCTIONS ---
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy; 
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857; 
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z); 
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_); 
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = inversesqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    // PRNG
    float prng(in vec2 seed) {
        seed = fract(seed * vec2(5.3983, 5.4427));
        seed += dot(seed.yx, seed.xy + vec2(21.5351, 14.3137));
        return fract(seed.x * seed.y * 95.4337);
    }

    const float PI = 3.1415926535897932384626433832795;

    float noiseStack(vec3 pos, int octaves, float falloff){
        float noise = snoise(vec3(pos));
        float off = 1.0;
        if (octaves > 1) {
            pos *= 2.0; off *= falloff;
            noise = (1.0-off)*noise + off*snoise(vec3(pos));
        }
        if (octaves > 2) {
            pos *= 2.0; off *= falloff;
            noise = (1.0-off)*noise + off*snoise(vec3(pos));
        }
        if (octaves > 3) {
            pos *= 2.0; off *= falloff;
            noise = (1.0-off)*noise + off*snoise(vec3(pos));
        }
        return (1.0+noise)/2.0;
    }

    vec2 noiseStackUV(vec3 pos, int octaves, float falloff, float diff){
        float displaceA = noiseStack(pos, octaves, falloff);
        float displaceB = noiseStack(pos+vec3(3984.293,423.21,5235.19), octaves, falloff);
        return vec2(displaceA,displaceB);
    }

    void main() {
        vec2 simulatedResolution = vec2(1000.0);
        vec2 fragCoord = vUv * simulatedResolution; 
        
        // --- 1. MOUSE CONTROLS ---
        
        // Create a mask: 0.0 if uFireHeightOverride is ~0.0, 1.0 otherwise
        float overrideMask = step(0.0001, uFireHeightOverride);
        
        // Calculate default height using Smoothed Mouse
        // Increased min value by 1.5x (from 1.5 to 2.25)
        float defaultHeight = (uSmoothedMouse.y * 2.0) + 2.25;
        
        // Mix between default and override based on the mask
        float remappedHeight = mix(defaultHeight, uFireHeightOverride, overrideMask);

        float safeHeight = max(0.00001, remappedHeight); 

        // Map uSmoothedMouse.x (-1.0 to 1.0) -> Lean Factor (directly -1.0 to 1.0)
        float leanFactor = uSmoothedMouse.x; 

        // --- 2. HEIGHT LOGIC ---
        // Reduced height by 5x (multiplied vUv.y by 5.0)
        float ypartClip = (vUv.y * 5.0) / (safeHeight * 0.5);
        float ypartClippedFalloff = clamp(2.0 - ypartClip, 0.0, 1.0);
        float ypartClipped = min(ypartClip, 1.0);
        float ypartClippedn = 1.0 - ypartClipped;

        // --- 3. FULL WIDTH FUEL ---
        float xfuel = pow(1.0 - abs(2.0 * vUv.x - 1.0), 0.5); 
        
        // --- 4. SKEW LOGIC ---
        // Apply skew: Shift X based on height (vUv.y) and leanFactor
        float skewedX = vUv.x - (leanFactor * vUv.y * 0.5);

        float smokeTime = 0.5 * iTime;
        // Double base speed (0.5 -> 1.0) and add height responsiveness
        float fireTime = iTime * (0.5 + safeHeight * 0.22); 

        vec2 coordScaled = 0.01 * fragCoord;
        
        // Use skewedX for position calculations
        vec3 position = vec3(coordScaled.x + leanFactor * 0.5, coordScaled.y, 0.0) + vec3(1223.0, 6434.0, 8425.0);
        
        vec3 flow = vec3(4.1 * (0.5 - skewedX) * pow(ypartClippedn, 4.0), -2.0 * xfuel * pow(ypartClippedn, 64.0), 0.0);
        vec3 timing = fireTime * vec3(0.0, -1.7, 1.1) + flow;
        vec3 smokeTiming = smokeTime * vec3(0.0, -1.7, 1.1) + flow;

        vec3 displacePos = vec3(1.0, 0.5, 1.0) * 2.4 * position + fireTime * vec3(0.01, -0.7, 1.3);
        vec3 displace3 = vec3(noiseStackUV(displacePos, 2, 0.4, 0.1), 0.0);

        vec3 noiseCoord = (vec3(2.0, 1.0, 1.0) * position + timing + 0.4 * displace3) / 1.0;
        float noise = noiseStack(noiseCoord, 3, 0.4);

        float flames = pow(ypartClipped, 0.3 * xfuel) * pow(noise, 0.3 * xfuel);

        float f = ypartClippedFalloff * pow(1.0 - flames * flames * flames, 8.0);
        float fff = f * f * f;
        vec3 fire = 1.5 * vec3(f, fff, fff * fff);

        // Smoke
        float smokeNoise = 0.5 + snoise(0.4 * position + smokeTiming * vec3(1.0, 1.0, 0.2)) / 2.0;
        vec3 smoke = vec3(0.3 * pow(xfuel, 3.0) * pow(vUv.y, 2.0) * (smokeNoise + 0.4 * (1.0 - noise)));

        // Sparks
        float sparkGridSize = 30.0;
        vec2 sparkCoord = fragCoord - vec2(0.0, 190.0 * fireTime);
        sparkCoord.x += leanFactor * 100.0 * vUv.y; // Wind effect on sparks
        
        sparkCoord -= 30.0 * noiseStackUV(0.01 * vec3(sparkCoord, 30.0 * fireTime), 1, 0.4, 0.1);
        sparkCoord += 100.0 * flow.xy;
        if (mod(sparkCoord.y / sparkGridSize, 2.0) < 1.0) sparkCoord.x += 0.5 * sparkGridSize;
        vec2 sparkGridIndex = vec2(floor(sparkCoord / sparkGridSize));
        float sparkRandom = prng(sparkGridIndex);
        float sparkLife = min(10.0 * (1.0 - min((sparkGridIndex.y + (190.0 * fireTime / sparkGridSize)) / (24.0 - 20.0 * sparkRandom), 1.0)), 1.0);
        vec3 sparks = vec3(0.0);
        if (sparkLife > 0.0) {
            float sparkSize = xfuel * xfuel * sparkRandom * 0.08;
            float sparkRadians = 999.0 * sparkRandom * 2.0 * PI + 2.0 * fireTime;
            vec2 sparkCircular = vec2(sin(sparkRadians), cos(sparkRadians));
            vec2 sparkOffset = (0.5 - sparkSize) * sparkGridSize * sparkCircular;
            vec2 sparkModulus = mod(sparkCoord + sparkOffset, sparkGridSize) - 0.5 * vec2(sparkGridSize);
            float sparkLength = length(sparkModulus);
            float sparksGray = max(0.0, 1.0 - sparkLength / (sparkSize * sparkGridSize));
            sparks = sparkLife * sparksGray * vec3(1.0, 0.3, 0.0);
        }

        gl_FragColor = vec4(max(fire, sparks) + smoke, 1.0);
    }
`;



export const liquidGoldFS = `
    uniform vec2 iResolution;
    uniform float iTime;

    varying vec2 vUv;

    void main() {
        // Reconstruct fragCoord so the original math works 1:1
        vec2 fragCoord = vUv * iResolution;

        // Original Shader Logic
        // Center and scale coordinates
        vec2 p = 5.0 * ((fragCoord.xy - 0.5 * iResolution.xy) / iResolution.y) - 0.5;
        
        vec2 i = p;
        float c = 0.0;
        
        // Calculate radius with time-based offset
        float r = length(p + vec2(sin(iTime), sin(iTime * 0.222 + 99.0)) * 1.5);
        float d = length(p);
        float rot = d + iTime + p.x * 0.15;
        
        // Loop for layering effects
        for (float n = 0.0; n < 4.0; n++) {
            // Apply rotation matrix
            p *= mat2(cos(rot - sin(iTime / 4.0)), sin(rot), 
                      -sin(cos(rot) - iTime), cos(rot)) * -0.15;
            
            float t = r - iTime / (n + 1.5);
            
            // Distort the iterator 'i'
            i -= p + vec2(cos(t - i.x - r) + sin(t + i.y), 
                          sin(t - i.y) + cos(t + i.x) + r);
            
            // Accumulate color intensity
            c += 1.0 / length(vec2((sin(i.x + t) / 0.15), (cos(i.y + t) / 0.15)));
        }
        
        c /= 4.0;
        
        // Output Color
        // Note: Changed alpha from 0.1 to 1.0 for visibility
        gl_FragColor = vec4(vec3(c) * vec3(4.3, 3.4, 0.1) - 0.35, 1.0);
    }
`;
export const seaAndMoonFS = `
    uniform float iTime;
    uniform vec2 iResolution;
    
    // We need the UV coordinates passed from the Vertex Shader
    varying vec2 vUv;

    // --- COMPATIBILITY DEFINES ---
    #define TIME        iTime
    #define RESOLUTION  iResolution
    #define PI          3.141592654
    #define TAU         (2.0*PI)

    // --- CONSTANTS ---
    const float gravity = 1.0;
    const float waterTension = 0.01;

    const vec3 skyCol1 = vec3(0.6, 0.35, 0.3).zyx * 0.5;
    const vec3 skyCol2 = vec3(1.0, 0.3, 0.3).zyx * 0.5;
    const vec3 sunCol1 = vec3(1.0, 0.5, 0.4).zyx;
    const vec3 sunCol2 = vec3(1.0, 0.8, 0.8).zyx;
    const vec3 seaCol1 = vec3(0.1, 0.2, 0.2) * 0.2;
    const vec3 seaCol2 = vec3(0.2, 0.9, 0.6) * 0.5;

    // --- HELPER FUNCTIONS ---

    float tanh_approx(float x) {
        float x2 = x * x;
        return clamp(x * (27.0 + x2) / (27.0 + 9.0 * x2), -1.0, 1.0);
    }

    vec2 wave(in float t, in float a, in float w, in float p) {
        float x = t;
        float y = a * sin(t * w + p);
        return vec2(x, y);
    }

    vec2 dwave(in float t, in float a, in float w, in float p) {
        float dx = 1.0;
        float dy = a * w * cos(t * w + p);
        return vec2(dx, dy);
    }

    vec2 gravityWave(in float t, in float a, in float k, in float h) {
        float w = sqrt(gravity * k * tanh_approx(k * h));
        return wave(t, a, k, w * TIME);
    }

    vec2 capillaryWave(in float t, in float a, in float k, in float h) {
        float w = sqrt((gravity * k + waterTension * k * k * k) * tanh_approx(k * h));
        return wave(t, a, k, w * TIME);
    }

    vec2 gravityWaveD(in float t, in float a, in float k, in float h) {
        float w = sqrt(gravity * k * tanh_approx(k * h));
        return dwave(t, a, k, w * TIME);
    }

    vec2 capillaryWaveD(in float t, in float a, in float k, in float h) {
        float w = sqrt((gravity * k + waterTension * k * k * k) * tanh_approx(k * h));
        return dwave(t, a, k, w * TIME);
    }

    void mrot(inout vec2 p, in float a) {
        float c = cos(a);
        float s = sin(a);
        p = vec2(c * p.x + s * p.y, -s * p.x + c * p.y);
    }

    vec4 sea(in vec2 p, in float ia) {
        float y = 0.0;
        vec3 d = vec3(0.0);

        const int maxIter = 8;
        const int midIter = 4;

        float kk = 1.0 / 1.3;
        float aa = 1.0 / (kk * kk);
        float k = 1.0 * pow(kk, -float(maxIter) + 1.0);
        float a = ia * 0.25 * pow(aa, -float(maxIter) + 1.0);

        float h = 25.0;
        p *= 0.5;

        vec2 waveDir = vec2(0.0, 1.0);

        for (int i = midIter; i < maxIter; ++i) {
            float t = dot(-waveDir, p) + float(i);
            y += capillaryWave(t, a, k, h).y;
            vec2 dw = capillaryWaveD(-t, a, k, h);

            d += vec3(waveDir.x, dw.y, waveDir.y);

            mrot(waveDir, PI / 3.0);

            k *= kk;
            a *= aa;
        }

        waveDir = vec2(0.0, 1.0);

        for (int i = 0; i < midIter; ++i) {
            float t = dot(waveDir, p) + float(i);
            y += gravityWave(t, a, k, h).y;
            vec2 dw = gravityWaveD(t, a, k, h);

            vec2 d2 = vec2(0.0, dw.x);

            d += vec3(waveDir.x, dw.y, waveDir.y);

            mrot(waveDir, -step(2.0, float(i)));

            k *= kk;
            a *= aa;
        }

        vec3 t = normalize(d);
        vec3 nxz = normalize(vec3(t.z, 0.0, -t.x));
        vec3 nor = cross(t, nxz);

        return vec4(y, nor);
    }

    vec3 sunDirection() {
        vec3 dir = normalize(vec3(0, 0.06, 1));
        return dir;
    }

    vec3 skyColor(in vec3 rd) {
        vec3 sunDir = sunDirection();
        float sunDot = max(dot(rd, sunDir), 0.0);
        vec3 final = vec3(0.0);
        final += mix(skyCol1, skyCol2, rd.y);
        final += 0.5 * sunCol1 * pow(sunDot, 90.0);
        final += 4.0 * sunCol2 * pow(sunDot, 900.0);
        return final;
    }

    vec3 render(in vec3 ro, in vec3 rd) {
        vec3 col = vec3(0.0);

        float dsea = (0.0 - ro.y) / rd.y;

        vec3 sunDir = sunDirection();

        vec3 sky = skyColor(rd);

        if (dsea > 0.0) {
            vec3 p = ro + dsea * rd;
            vec4 s = sea(p.xz, 1.0);
            float h = s.x;
            vec3 nor = s.yzw;
            nor = mix(nor, vec3(0.0, 1.0, 0.0), smoothstep(0.0, 200.0, dsea));

            float fre = clamp(1.0 - dot(-nor, rd), 0.0, 1.0);
            fre = fre * fre * fre;
            float dif = mix(0.25, 1.0, max(dot(nor, sunDir), 0.0));

            vec3 refl = skyColor(reflect(rd, nor));
            vec3 refr = seaCol1 + dif * sunCol1 * seaCol2 * 0.1;

            col = mix(refr, 0.9 * refl, fre);

            float atten = max(1.0 - dot(dsea, dsea) * 0.001, 0.0);
            col += seaCol2 * (p.y - h) * 2.0 * atten;

            col = mix(col, sky, 1.0 - exp(-0.01 * dsea));

        } else {
            col = sky;
        }

        return col;
    }

    void main() {
        // --- FIX: USE vUv INSTEAD OF gl_FragCoord ---
        // vUv typically goes from (0,0) to (1,1) across the mesh surface.
        
        vec2 q = vUv; 
        vec2 p = -1.0 + 2.0 * q;
        
        // Use aspect ratio to ensure waves aren't squashed if the mesh isn't square.
        // Make sure iResolution matches your MESH dimensions, not screen dimensions.
        // If you want it to just fill the space regardless of distortion, remove this line:
        p.x *= iResolution.x / iResolution.y;

        vec3 ro = vec3(0.0, 10.0, 0.0);
        vec3 ww = normalize(vec3(0.0, -0.1, 1.0));
        vec3 uu = normalize(cross(vec3(0.0, 1.0, 0.0), ww));
        vec3 vv = normalize(cross(ww, uu));
        vec3 rd = normalize(p.x * uu + p.y * vv + 2.5 * ww);

        vec3 col = render(ro, rd);
        
        vec2 vUV = vUv * (1.0 - vUv.yx);
        float vig = vUV.x * vUV.y * 15.0; 
        vig = pow(vig, 0.15);

        gl_FragColor = vec4(col * vig, 1.0);
    }
`;

export const dragonEyeFS = `
    uniform vec2 iResolution;
    uniform float iTime;
    uniform vec2 uMouse;

    // 1. Renamed Uniform
    uniform float uEyeOpenness; // 0.0 to 1.0

    // 2. New Boolean Switch
    uniform bool uEyeActive; 

    varying vec2 vUv;

// --- Defines ---
#define PI 3.14159265359
#define TAU 6.28318530718
#define TIME iTime
#define RESOLUTION iResolution
#define ROT(a) mat2(cos(a), sin(a), -sin(a), cos(a))

#define LAYERS 6
#define FBM 3
#define DISTORT 1.4
#define PCOS(x) (0.5 + 0.5 * cos(x))

// --- Color Helpers ---
const vec4 hsv2rgb_K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 hsv2rgb(vec3 c) {
      vec3 p = abs(fract(c.xxx + hsv2rgb_K.xyz) * 6.0 - hsv2rgb_K.www);
    return c.z * mix(hsv2rgb_K.xxx,
        clamp(p - hsv2rgb_K.xxx, 0.0, 1.0),
        c.y);
}

const float eyeAngle = 0.8;
const vec2 eyeRef = vec2(cos(eyeAngle), sin(eyeAngle));

    // --- Globals ---
    float g_psy_th = 0.0;
    float g_psy_hf = 0.0;
    vec2 g_psy_vx = vec2(0.0);
    vec2 g_psy_vy = vec2(0.0);
    vec2 g_psy_wx = vec2(0.0);
    vec2 g_psy_wy = vec2(0.0);

const vec3 lightPos1 = 100.0 * vec3(-1.3, 1.9, 2.0);
const vec3 lightPos2 = 100.0 * vec3(9.0, 3.2, 1.0);
const vec3 lightDir1 = normalize(lightPos1);
const vec3 lightDir2 = normalize(lightPos2);
const vec3 lightCol1 = vec3(8.0 / 8.0, 7.0 / 8.0, 6.0 / 8.0);
const vec3 lightCol2 = vec3(0.1 / 8.0, 0.075 / 8.0, 0.0875 / 8.0);
const vec3 skinCol1 = vec3(0.6, 0.2, 0.2);
const vec3 skinCol2 = vec3(0.6);
const float eyeScale = 0.4;


    // Removed saturate functions.

    float tanh_approx(float x) {
      float x2 = x * x;
    return clamp(x * (27.0 + x2) / (27.0 + 9.0 * x2), -1.0, 1.0);
}

    float pmin(float a, float b, float k) {
      float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

    float pmax(float a, float b, float k) { return -pmin(-a, -b, k); }
    float pabs(float a, float k) { return pmax(a, -a, k); }

    vec2 toPolar(vec2 p) { return vec2(length(p), atan(p.y, p.x)); }
    vec2 toRect(vec2 p) { return vec2(p.x * cos(p.y), p.x * sin(p.y)); }

    float modMirror1(inout float p, float size) {
      float halfsize = size * 0.5;
      float c = floor((p + halfsize) / size);
    p = mod(p + halfsize, size) - halfsize;
    p *= mod(c, 2.0) * 2.0 - 1.0;
    return c;
}

    float smoothKaleidoscope(inout vec2 p, float sm, float rep) {
      vec2 hp = p;
      vec2 hpp = toPolar(hp);
      float rn = modMirror1(hpp.y, TAU / rep);
      float sa = PI / rep - pabs(PI / rep - abs(hpp.y), sm);
    hpp.y = sign(hpp.y) * (sa);
    hp = toRect(hpp);
    p = hp;
    return rn;
}

    float vesica(vec2 p, vec2 sz) {
    sz = max(sz, vec2(0.001));
    if (sz.x < sz.y) {
        sz = sz.yx;
    } else {
        p = p.yx;
    }
      vec2 sz2 = sz * sz;
      float d = (sz2.x - sz2.y) / (2.0 * sz.y);
      float r = sqrt(sz2.x + d * d);
      float b = sz.x;
    p = abs(p);
    return ((p.y - b) * d > p.x * b) ? length(p - vec2(0.0, b))
        : length(p - vec2(-d, 0.0)) - r;
}

    float raySphere(vec3 ro, vec3 rd, vec4 sph) {
        vec3 oc = ro - sph.xyz;
        float b = dot(oc, rd);
        float c = dot(oc, oc) - sph.w * sph.w;
        float h = b * b - c;
    if (h < 0.0) return -1.0;
    h = sqrt(h);
    return -b - h;
}

    // --- Shape Functions ---
    float outer(vec2 p) {
    p *= ROT(eyeAngle);
      // Updated: uEyeOpenness
      vec2 sz = vec2(0.5, 0.25 * uEyeOpenness);
    return vesica(p, sz) - (0.15 * uEyeOpenness);
}

    float inner(vec2 p) {
    p *= ROT(eyeAngle);
      // Updated: uEyeOpenness
      vec2 sz = vec2(0.125 * uEyeOpenness, 0.35);
    return vesica(p, sz);
}

    float qc_wave(float theta, vec2 p) {
    return (cos(dot(p, vec2(cos(theta), sin(theta)))));
}

    float qc_noise(vec2 p) {
      float sum = 0.;
      float a = 1.0;
    for (int i = 0; i < LAYERS; ++i) {
        float theta = float(i) * PI / float(LAYERS);
        sum += qc_wave(theta, p) * a;
        a *= DISTORT;
    }
    return abs(tanh_approx(sum));
}

    float qc_fbm(vec2 p, float time) {
      float sum = 0.;
      float a = 1.0;
      float f = 1.0;
    for (int i = 0; i < FBM; ++i) {
        sum += a * qc_noise(p * f);
        a *= 2.0 / 3.0;
        f *= 2.31;
    }
    return 0.45 * (sum);
}

    float qc_height(vec2 p) {
      float od = outer(p);
      float l = length(p);
    const float s = 5.0;
    p *= s;
      float sm = 0.05;
      float oh = smoothstep(0.0, sm, od);
      
      float h = -5.0 * qc_fbm(p, iTime) * exp(-4.0 * l) * oh; 
    return h;
}

    vec3 qc_normal(vec2 p) {
      vec2 e = vec2(4.0 / RESOLUTION.y, 0.0);
      vec3 n;
    n.x = qc_height(p + e.xy) - qc_height(p - e.xy);
    n.y = 2.0 * e.x;
    n.z = qc_height(p + e.yx) - qc_height(p - e.yx);
    return normalize(n);
}

    float psy_noise(vec2 p) {
      float a = sin(p.x);
      float b = sin(p.y);
      float c = 0.5 + 0.5 * cos(p.x + p.y);
      float d = mix(a, b, c);
    return d;
}

    float psy_fbm(vec2 p, float aa) {
    const mat2 frot = mat2(0.80, 0.60, -0.60, 0.80);
      float f = 0.0;
      float a = 1.0;
      float s = 0.0;
      float m = 2.0;
    for (int x = 0; x < 4; ++x) {
        f += a * psy_noise(p);
        p = frot * p * m;
        m += 0.01;
        s += a;
        a *= aa;
    }
    return f / s;
}

    float psy_warp(vec2 p, out vec2 v, out vec2 w) {
      vec2 mouse = vec2(-uMouse.y, -uMouse.x);
      // if (length(uMouse) > 10.0) {
      //   mouse = -1.0 + 2.0 * (uMouse.xy / RESOLUTION.xy);
      //   mouse.x *= RESOLUTION.x / RESOLUTION.y;
      // }

      float lm = length(mouse);
      vec2 pupilPos = vec2(0.0);
    const float maxPupilDist = 0.15;
    if (lm > 0.001) {
        pupilPos = (mouse / lm) * min(lm, maxPupilDist);
    }
    p -= pupilPos;

      float id = inner(p);

    const float r = 0.5;
    const float rr = 0.25;
      float l2 = length(p);
      float f = 1.0;
    f = smoothstep(-0.1, 0.15, id);
    const float rep = 50.0;
    const float sm = 0.125 * 0.5 * 60.0 / rep;
      float n = smoothKaleidoscope(p, sm, rep);
    p.y += iTime * 0.125 + 1.5 * g_psy_th;
    g_psy_hf = f;
      vec2 pp = p;
      vec2 vx = g_psy_vx;
      vec2 vy = g_psy_vy;
      vec2 wx = g_psy_wx;
      vec2 wy = g_psy_wy;
      float aa = 0.5;
    v = vec2(psy_fbm(p + vx, aa), psy_fbm(p + vy, aa)) * f;
    w = vec2(psy_fbm(p + 3.0 * v + wx, aa),
        psy_fbm(p + 3.0 * v + wy, aa)) * f;

    return -tanh_approx(psy_fbm(p + 2.25 * w, aa) * f);
}

    vec3 psy_normal(vec2 p) {
      vec2 v;
      vec2 w;
      vec2 e = vec2(4.0 / RESOLUTION.y, 0.0);
      vec3 n;
    n.x = psy_warp(p + e.xy, v, w) - psy_warp(p - e.xy, v, w);
    n.y = 2.0 * e.x;
    n.z = psy_warp(p + e.yx, v, w) - psy_warp(p - e.yx, v, w);
    return normalize(n);
}

    vec3 psy_weird(vec2 p) {
      vec3 ro = vec3(0.0, 10.0, 0.0);
      vec3 pp = vec3(p.x, 0.0, p.y);
      vec2 v;
      vec2 w;
      float h = psy_warp(p, v, w);
      float hf = g_psy_hf;
      vec3 n = psy_normal(p);
      vec3 lcol1 = lightCol1;
      vec3 lcol2 = lightCol2;
      vec3 po = vec3(p.x, 0.0, p.y);
      vec3 rd = normalize(po - ro);
      
      float diff1 = max(dot(n, lightDir1), 0.0);
      float diff2 = max(dot(n, lightDir2), 0.0);
      vec3 ref = reflect(rd, n);
      float ref1 = max(dot(ref, lightDir1), 0.0);
      float ref2 = max(dot(ref, lightDir2), 0.0);
    const vec3 col1 = vec3(0.1, 0.7, 0.8).xzy;
    const vec3 col2 = vec3(0.7, 0.3, 0.5).zyx;
      
      float a = length(p);
      vec3 col = vec3(0.0);

    col += hsv2rgb(vec3(fract(-0.1 * iTime + 0.125 * a + 0.5 * v.x + 0.125 * w.x),
        abs(0.5 + tanh_approx(v.y * w.y)),
        tanh_approx(0.1 + abs(v.y - w.y))));
    col -= 0.5 * (length(v) * col1 + length(w) * col2 * 1.0);

    col += 0.5 * lcol1 * pow(ref1, 20.0);
    col += 0.01 * lcol2 * pow(ref2, 10.0);
    col *= hf;
    return max(col, 0.0);
}

    float vmax(vec2 v) { return max(v.x, v.y); }

    float corner(vec2 p) {
    return length(max(p, vec2(0.0))) + vmax(min(p, vec2(0.0)));
}

    vec3 skyColor(vec3 ro, vec3 rd) {
      float ld1 = max(dot(lightDir1, rd), 0.0);
      float ld2 = max(dot(lightDir2, rd), 0.0);
      vec3 final = vec3(0.0);
    rd.xy *= ROT(-1.);
      vec2 bp = rd.xz / max(0.0, rd.y);
      float bd = corner(-bp);
    final += 0.05 * exp(-5.0 * max(bd, 0.0));
    final += 0.01 * smoothstep(0.025, 0.0, bd);

    final += 8.0 * lightCol1 * pow(ld1, 100.0);
    final += 0.5 * lightCol2 * pow(ld2, 100.0);

    return final;
}

    vec3 eyeColor(vec2 p, vec3 ro, vec3 rd, vec3 po, float od) {
      vec3 sc = vec3(0.0);
      float sd = raySphere(ro, rd, vec4(sc, 0.75));
      vec3 spos = ro + sd * rd;
      vec3 snor = normalize(spos - sc);
      vec3 refl = reflect(rd, snor);
      vec3 scol = skyColor(spos, refl);
      float dif1 = max(dot(snor, lightDir1), 0.0);
      float dif2 = max(dot(snor, lightDir2), 0.0);
      vec3 pcol = psy_weird(p);
      vec3 col1 = vec3(0.0);
    col1 += pcol;
    col1 += 0.25 * scol;
    col1 += 0.025 * (dif1 * dif1 + dif2 * dif2);
      vec3 col2 = 0.125 * (skinCol1) * (dif1 + dif2) + 0.125 * sqrt(scol);
    snor.xz *= ROT(-0.5 * eyeAngle);
    snor.xy *= ROT(-2.4 * smoothstep(0.99, 1.0, sin((iTime * 6.2831853) / 12.0)));
      float a = atan(snor.y, snor.x);
      vec3 col = mix(col1, col2, step(a, 0.0));
    col *= smoothstep(0.0, -0.1, od);

    return col;
}

    vec3 skinColor(vec2 p, vec3 ro, vec3 rd, vec3 po, float od) {
      float qch = qc_height(p);
      vec3 qcn = qc_normal(p);
      float diff1 = max(dot(qcn, lightDir1), 0.0);
      float diff2 = max(dot(qcn, lightDir2), 0.0);
      vec3 ref = reflect(rd, qcn);
      vec3 scol = skyColor(po, ref);
      vec3 lcol1 = lightCol1;
      vec3 lcol2 = lightCol2;
      vec3 lpow1 = 0.25 * lcol1;
      vec3 lpow2 = 0.0625 * lcol2;
      vec3 dm = mix(1.0 * skinCol1, skinCol2,
    1.0 + tanh_approx(2.0 * qch)) * tanh_approx(-qch * 10.0 + 0.125);
      vec3 col = vec3(0.0);
    col += dm * sqrt(diff1) * lpow1;
    col += dm * sqrt(diff2) * lpow2;
    const float ff = 0.3;
      float f = ff * exp(-8.0 * od);
    col *= f;
    col += 0.1 * ff * sqrt(scol);
    col -= (1.0 - tanh_approx(10.0 * -qch)) * f;
    col *= smoothstep(0.0, 0.025, od);
    return col;
}

void compute_globals() {
      vec2 vx = vec2(0.0, 0.0);
      vec2 vy = vec2(3.2, 1.3);
      vec2 wx = vec2(1.7, 9.2);
      vec2 wy = vec2(8.3, 2.8);
    vx *= ROT((iTime * 6.2831853) / 1000.0);
    vy *= ROT((iTime * 6.2831853) / 900.0);
    wx *= ROT((iTime * 6.2831853) / 800.0);
    wy *= ROT((iTime * 6.2831853) / 700.0);

    g_psy_vx = vx;
    g_psy_vy = vy;

    g_psy_wx = wx;
    g_psy_wy = wy;
}

    vec3 color(vec2 p) {
    compute_globals();
      
      float od = outer(p);
      vec3 ro = vec3(0.0, 10.0, 0.0);
      vec3 pp = vec3(p.x, 0.0, p.y);
      vec3 po = vec3(p.x, 0.0, p.y);
      vec3 rd = normalize(po - ro);
      vec3 col = od > 0.0 ? skinColor(p, ro, rd, po, od)
        : eyeColor(p, ro, rd, po, od);

    return col;
}

    vec3 postProcess(vec3 col, vec2 q) {
    col = clamp(col, 0.0, 1.0);
    col = pow(col, 1.0 / vec3(2.2));
    col = col * 0.6 + 0.4 * col * col * (3.0 - 2.0 * col);
    col = mix(col, vec3(dot(col, vec3(0.33))), -0.4);
    col *= 0.5 + 0.5 * pow(19.0 * q.x * q.y * (1.0 - q.x) * (1.0 - q.y), 0.7);
    return col;
}

void main() {
    // Optimized: Early return with 0 alpha instead of discard for performance
    if (!uEyeActive) {
        gl_FragColor = vec4(0.0);
        return;
    }

      vec2 q = vUv;
      vec2 p = -1.0 + 2.0 * q;
    // p.x *= iResolution.x/iResolution.y; // Fix distortion by removing screen aspect ratio correction
    p *= 1.0 / eyeScale;
      vec3 col = color(p);

    // Updated: uEyeOpenness
    col *= smoothstep(0.0, 1.0, uEyeOpenness);

    col = postProcess(col, q);
    gl_FragColor = vec4(col, 1.0);
}
`;

export const netflixFS = `
    uniform vec2 iResolution;
    uniform float iTime;
    uniform float uBSODState; // 0.0 = Normal, 1.0 = BSOD
    uniform float uNetflixStartTime;
    
    varying vec2 vUv;

// --- PALETTE ---
#define C_BSOD    vec3(0.0, 0.47, 0.84) // Windows Blue

    // --- UTILS ---
    float hash21(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
}

#define rot(x) mat2(cos(x), -sin(x), sin(x), cos(x))

void main() {
        vec2 fragCoord = vUv * iResolution;
        vec2 uv = vUv;
        float aspect = iResolution.x / iResolution.y;

    // --- BSOD OVERRIDE ---
    if (uBSODState > 0.5) {
            vec3 col = C_BSOD;

            // Sad Face :(
            vec2 center = vec2(0.2, 0.7); // Top Left-ish
            vec2 p = uv - center;
        p.x *= aspect;

            // Eyes
            float dEyes = min(length(p - vec2(-0.05, 0.05)), length(p - vec2(0.05, 0.05)));
            float eyes = smoothstep(0.015, 0.01, dEyes);

            // Mouth (Arc)
            vec2 m = p - vec2(0.0, -0.08);
            float dMouthFunc = length(m) - 0.06;
            // Crop bottom half to make arc
            float mouth = smoothstep(0.01, 0.005, abs(dMouthFunc)) * step(0.0, m.y);

        col = mix(col, vec3(1.0), eyes + mouth);

        // Text Lines (Abstract)
        // Header
        if (uv.x > 0.1 && uv.x < 0.6 && uv.y < 0.55 && uv.y > 0.5) {
            col = vec3(1.0);
        }
        // Paragraphs
        if (uv.x > 0.1 && uv.x < 0.8 && uv.y < 0.45 && uv.y > 0.2) {
                 float row = floor(uv.y * 20.0);
            if (mod(row, 2.0) == 0.0) {
                      float lineLen = hash21(vec2(row, 1.0)) * 0.7 + 0.1;
                if ((uv.x - 0.1) < lineLen) col = vec3(1.0);
            }
        }

            // QRCode (Fake Block)
            vec2 qrUV = uv - vec2(0.15, 0.15);
        qrUV.x *= aspect;
        if (abs(qrUV.x) < 0.06 && abs(qrUV.y) < 0.06) {
                float qrNoise = step(0.5, hash21(floor(qrUV * 100.0)));
            col = mix(col, vec3(1.0), qrNoise);
        }

        gl_FragColor = vec4(col, 1.0);
        return;
    }

        vec2 R = iResolution.xy;
        vec2 p = (fragCoord.xy + fragCoord.xy - R) / R.y;

        // Pre-calculate time-based animation
        float t = (0.5 + 0.5 * -cos((iTime - uNetflixStartTime) * 1.7)) * 3.0;
        vec2 s = vec2(0.125, 0.75);
        float px_pos = float(p.x >= 0.0);

        // Optimized d0 calculation
        float level0 = (clamp(t - 2.0 * px_pos, -0.05, 1.0) * 2.0 - 1.0) * s.y;
        float d0 = max(abs(abs(p.x) - s.x * 2.0) - s.x, p.y - level0);

    // Constant geometry values
    const float r = 2.8;
    const float dx = 0.375; // s.x * 3.0
    const float dy = 0.75;  // s.y
    const float geom_offset = 3.5147; // s.y + sqrt(r*r - dx*dx)

    // Angle and Rotation optimization
    const float angle = 1.8925; 
        float w = s.x * sin(angle);
        vec2 p0 = rot(angle) * p;

        // Distance fields
        float d1 = max(abs(p0.y) - w, -(p.y + s.y * ((t - 1.0) * 2.0 - 1.0)));
        float d2 = length(p + vec2(0.0, geom_offset)) - r;

        // Combining masks
        vec2 bounds = abs(p.y) - vec2(s.y);
    d0 = max(max(d0, bounds.x), -d2);
    d1 = max(max(d1, bounds.x), -d2);

        // Shading and Output
        // IMPROVED: Use fragment derivatives (fwidth) for scale-independent antialiasing
        float edgeD1 = fwidth(d1);
        float edgeD0 = fwidth(d0);

        vec4 colRed = vec4(1.0, 0.0, 0.0, 1.0);
        vec4 colBg = vec4(0.0, 0.0, 0.0, 1.0);
        vec4 colGlow = vec4(0.6 - 0.5 * exp(-22.0 * max(d1, 0.0)) * (1.0 - pow(abs(p0.x), 1.25)), 0.0, 0.0, 1.0);
        
        vec4 O = mix(colBg, colGlow, smoothstep(edgeD0, 0.0, d0));
    O = mix(O, colRed, smoothstep(edgeD1, 0.0, d1));

    O.rgb = sqrt(O.rgb); // Gamma correction
    gl_FragColor = O;
}
`;

export const sunsetFS = `
    uniform float iTime;
    uniform vec2 iResolution;
    
    varying vec2 vUv;

// --- CONSTANTS & CONFIG ---
const float PI = 3.14159265;
const float MAX_RAYMARCH_DIST = 150.0;
const float MIN_RAYMARCH_DELTA = 0.00015;
const float GRADIENT_DELTA = 0.015;

    // Global wave parameters (will be modified in main)
    float waveHeight1 = 0.005;
    float waveHeight2 = 0.004;
    float waveHeight3 = 0.001;

    // --- SIMPLEX NOISE FUNCTIONS ---
    // Description : Array and textureless GLSL 2D simplex noise function.
    // Author : Ian McEwan, Ashima Arts.

    vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

    vec2 mod289(vec2 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

    vec3 permute(vec3 x) {
    return mod289(((x * 34.0) + 1.0) * x);
}

    float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
        -0.577350269189626,  // -1.0 + 2.0 * C.x
        0.024390243902439); // 1.0 / 41.0
        // First corner
        vec2 i = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);

        // Other corners
        vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

    // Permutations
    i = mod289(i); 
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
        + i.x + vec3(0.0, i1.x, 1.0));

        vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;

        // Gradients
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;

    // Normalise gradients
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

        // Compute final noise value at P
        vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

    // --- RAYMARCHING LOGIC ---

    float map(vec3 p) {
    return p.y + (0.5 + waveHeight1 + waveHeight2 + waveHeight3)
        + snoise(vec2(p.x + iTime * 0.4, p.z + iTime * 0.6)) * waveHeight1
        + snoise(vec2(p.x * 1.6 - iTime * 0.4, p.z * 1.7 - iTime * 0.6)) * waveHeight2
        + snoise(vec2(p.x * 6.6 - iTime * 1.0, p.z * 2.7 + iTime * 1.176)) * waveHeight3;
}

    vec3 gradientNormalFast(vec3 p, float map_p) {
    return normalize(vec3(
        map_p - map(p - vec3(GRADIENT_DELTA, 0, 0)),
        map_p - map(p - vec3(0, GRADIENT_DELTA, 0)),
        map_p - map(p - vec3(0, 0, GRADIENT_DELTA))));
}

    float intersect(vec3 p, vec3 ray_dir, out float map_p, out int iterations) {
    iterations = 0;
    if (ray_dir.y >= 0.0) { return -1.0; } // Looking up at sky, no sea intersection
        
        float distMin = (- 0.5 - p.y) / ray_dir.y;
        float distMid = distMin;
    for (int i = 0; i < 50; i++) {
        distMid += max(0.05 + float(i) * 0.002, map_p);
        map_p = map(p + ray_dir * distMid);
        if (map_p > 0.0) {
            distMin = distMid + map_p;
        } else { 
                float distMax = distMid + map_p;
            // interval found, now bisect inside it
            for (int i = 0; i < 10; i++) {
                distMid = distMin + (distMax - distMin) / 2.0;
                map_p = map(p + ray_dir * distMid);
                if (abs(map_p) < MIN_RAYMARCH_DELTA) return distMid;
                if (map_p > 0.0) {
                    distMin = distMid + map_p;
                } else {
                    distMax = distMid + map_p;
                }
            }
            return distMid;
        }
    }
    return distMin;
}

void main() {
        // --- ANIMATION PARAMETERS ---
        // Originally controlled by mouse, now fully automatic
        float waveHeight = cos(iTime * 0.03) * 1.2 + 1.6;
    waveHeight1 *= waveHeight;
    waveHeight2 *= waveHeight;
    waveHeight3 *= waveHeight;

        // --- COORDINATE SETUP (vUv Fix) ---
        // Convert vUv (0..1) to centered coordinates (-0.5..0.5)
        vec2 position = vUv - 0.5;
    // Correct aspect ratio
    position.x *= iResolution.x / iResolution.y;

        // --- RAY SETUP ---
        vec3 ray_start = vec3(0, 0.2, -2);
        vec3 ray_dir = normalize(vec3(position, 0.0) - ray_start);
    ray_start.y = cos(iTime * 0.5) * 0.2 - 0.25 + sin(iTime * 2.0) * 0.05;

    // --- LIGHTING & SUN ---
    const float dayspeed = 0.04;
        float subtime = max(-0.16, sin(iTime * dayspeed) * 0.2);
        float middayperc = max(0.0, sin(subtime));
        
        vec3 light1_pos = vec3(0.0, middayperc * 200.0, cos(subtime * dayspeed) * 200.0);
        float sunperc = pow(max(0.0, min(dot(ray_dir, normalize(light1_pos)), 1.0)), 190.0 + max(0.0, light1_pos.y * 4.3));
        
        vec3 suncolor = (1.0 - max(0.0, middayperc)) * vec3(1.5, 1.2, middayperc + 0.5) + max(0.0, middayperc) * vec3(1.0, 1.0, 1.0) * 4.0;
        vec3 skycolor = vec3(middayperc + 0.8, middayperc + 0.7, middayperc + 0.5);
        vec3 skycolor_now = suncolor * sunperc + (skycolor * (middayperc * 1.6 + 0.5)) * (1.0 - sunperc);
        
        vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
        float map_p;
        int iterations;

        // --- RENDER ---
        float dist = intersect(ray_start, ray_dir, map_p, iterations);

    if (dist > 0.0) {
            vec3 p = ray_start + ray_dir * dist;
            vec3 light1_dir = normalize(light1_pos - p);
            vec3 n = gradientNormalFast(p, map_p);
            vec3 ambient = skycolor_now * 0.1;
            vec3 diffuse1 = vec3(1.1, 1.1, 0.6) * max(0.0, dot(light1_dir, n) * 2.8);
            vec3 r = reflect(light1_dir, n);
            vec3 specular1 = vec3(1.5, 1.2, 0.6) * (0.8 * pow(max(0.0, dot(r, ray_dir)), 200.0));     
            float fog = min(max(p.z * 0.07, 0.0), 1.0);
        color.rgb = (vec3(0.6, 0.6, 1.0) * diffuse1 + specular1 + ambient) * (1.0 - fog) + skycolor_now * fog;
    } else {
        color.rgb = skycolor_now.rgb;
    }

    gl_FragColor = color;
}
`;
export const implicitSurfaceFS = `
    uniform float iTime;
    uniform vec2 iResolution;

    // --- UPDATED UNIFORM ---
    uniform vec2 uMouse; // x, y (Normalized -1 to 1)

const vec3 uColor = vec3(0.0, 1.0, 1.0); // Cyan
    
    varying vec2 vUv;

// --- CONSTANTS ---
#define PI 3.1415926

    // --- HELPERS ---
    mat2 rot(float a) {
        float c = cos(a);
        float s = sin(a);
    return mat2(c, s, -s, c);
}

    float sfract(float val, float scale) {
    return (2.0 * fract(0.5 + 0.5 * val / scale) - 1.0) * scale;
}

    float fn(vec3 v) {
        float x = v.x;
        float y = v.y;
        float z = v.z;
    return min(
        min(x * x + y * y + z * z - 0.5, x * x + y * y - 0.125),
        min(x * x + z * z - 0.125, y * y + z * z - 0.125)
    );
}

    float comb(float v, float s) {
    return pow(0.5 + 0.5 * cos(v * 2.0 * PI), s);
}

    vec3 tex(vec3 v) {
        float x = v.x;
        float y = v.y;
        float z = v.z;
        
        float d = exp(-pow(abs(z * 20.0 + sfract(iTime, 4.0) * 5.0), 2.0));

    z += 0.1 * iTime;
    x = (x * 8.0);
    y = (y * 8.0);
    z = (z * 8.0);
        
        float q = 0.0;
    q = max(q, comb(x, 10.0));
    q = max(q, comb(y, 10.0));
    q = max(q, comb(z, 10.0));
        
        float w = 1.0;
    w = min(w, max(comb(x, 10.0), comb(y, 10.0)));
    w = min(w, max(comb(y, 10.0), comb(z, 10.0)));
    w = min(w, max(comb(z, 10.0), comb(x, 10.0)));
        
        vec3 structure = uColor * q;
        vec3 lines = uColor * d * 5.0;

    return (vec3(w) + structure) + lines;
}

    vec3 camera(vec2 uv, float depth) {
        vec3 p = vec3(uv, depth);

        // --- MOUSE ROTATION LOGIC ---
        // 1. Normalize mouse to 0..1 (Input is -1..1)
        vec2 m = uMouse.xy * 0.5 + 0.5;

    // 2. Default: If mouse is at 0,0 (start), rotate slowly
    if (uMouse.x == 0.0 && uMouse.y == 0.0) {
        m = vec2(iTime * 0.05, 0.5);
    }

        // 3. Convert range [0,1] to angles
        // Pitch (Up/Down) - Controlled by Mouse Y
        float pitch = -(m.y - 0.5) * 4.0;

        // Yaw (Left/Right) - Controlled by Mouse X
        float yaw = -(m.x - 0.5) * 10.0;

    // Apply rotations
    p.yz *= rot(pitch);
    p.xz *= rot(yaw);

    // Zoom correction
    p *= 1.5;

    return p;
}

void main() {
        vec2 p = -1.0 + 2.0 * vUv;
    p.x *= iResolution.x / iResolution.y;

    const int depth = 256;
        float m = 0.0;
        vec3 color = vec3(0.0, 0.0, 0.0);

    for (int layer = 0; layer < depth; layer++) {
            vec3 v = camera(p, 2.0 * float(layer) / float(depth) - 1.0);

        if (abs(v.x) > 1.0 || abs(v.y) > 1.0 || abs(v.z) > 1.0)
            continue;

        if (abs(fn(v)) < 0.05) {
            m = 2.0 * float(layer) / float(depth) - 1.0;
            color = tex(v);
        }
    }

    gl_FragColor = vec4(color * vec3(m), 1.0);
}
`;

export const energyBeamFS = `
    uniform float iTime;
    uniform vec2 iResolution;
    
    varying vec2 vUv;

// --- Configuration ---
#define SPEED 15.0
#define FREQ 8.
#define MAX_HEIGHT 0.3
#define THICKNESS 0.005
#define BLOOM 0.65 // above 1 will reduce
#define WOBBLE 0.1 // how much each end wobbles

    // --- Helper Function ---
    float beam(vec2 uv, float max_height, float offset, float speed, float freq, float thickness) {
    // Shift Y center to 0.0 for calculation
    uv.y -= 0.5;

        float height = max_height * (WOBBLE + min(1. - uv.x, 1.));

        // Ramp makes the left hand side stay at/near 0
        float ramp = smoothstep(0., 2.0 / freq, uv.x);

    height *= ramp;
    uv.y += sin(uv.x * freq - iTime * speed + offset) * height;

        float f = thickness / abs(uv.y);
    f = pow(f, BLOOM);

    return f;
}

void main() {
        // Use Three.js varying UV (0.0 to 1.0)
        vec2 uv = vUv;

        // Calculate beams
        float f = beam(uv, MAX_HEIGHT, 0., SPEED, FREQ * 1.5, THICKNESS * 0.5) +
        beam(uv, MAX_HEIGHT, iTime, SPEED, FREQ, THICKNESS) +
        beam(uv, MAX_HEIGHT, iTime + 0.5, SPEED + 0.2, FREQ * 0.9, THICKNESS * 0.5) +
        beam(uv, 0., 0., SPEED, FREQ, THICKNESS * 3.0);

    gl_FragColor = vec4(f * vec3(0.5, 0.05, 0.15), 1.0);
}
`;
export const fireworksClockFS = `
    uniform float iTime;
    uniform vec2 iResolution;
    uniform vec4 iDate; 
    uniform vec2 uMouse; 
    uniform float uBSODState; // 0.0 = Normal, 1.0 = BSOD
    
    varying vec2 vUv;

// --- CLOCK CONSTANTS ---
#define TWELVE_HOUR_CLOCK   0
#define GLOWPULSE    1
#define SECONDS      1

const float pi = 3.14159265359;
const float tau = 6.28318530718;
const float scale = 1.0 / 6.0;

    vec2 digitSize = vec2(1.0, 1.5) * scale;
    vec2 digitSpacing = vec2(1.1, 1.6) * scale;

// --- FIREWORKS CONSTANTS ---
#define PARTICLES_MIN 15.
#define PARTICLES_MAX 60.
#define NUM_ROCKETS 3.
#define duration 2.2
const float ExT = 1. / 4.;

    // --- HELPERS ---
    vec2 hash21(float p) {
        vec3 p3 = fract(vec3(p) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx + p3.yz) * p3.zy);
}
    float hash21(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
}

    vec3 hash31(float p) {
        vec3 p2 = fract(p * vec3(5.3983, 5.4427, 6.9371));
    p2 += dot(p2.zxy, p2.xyz + vec3(21.5351, 14.3137, 15.3219));
    return fract(vec3(p2.x * p2.y * 95.4337, p2.y * p2.z * 97.597, p2.z * p2.x * 93.8365));
}

    vec2 dir(float id){
        vec2 h = hash21(id);
    h.y *= 2. * acos(-1.);
    return h.x * vec2(cos(h.y), sin(h.y));
}

    // --- CLOCK HELPERS ---
    float hash12(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

    float noise(vec2 pos) {
        vec2 i = floor(pos);
        vec2 f = fract(pos);
        float a = hash12(i);
        float b = hash12(i + vec2(1, 0));
        float c = hash12(i + vec2(0, 1));
        float d = hash12(i + vec2(1, 1));
        vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

    // --- CLOCK SDFs ---
    float dfLine(vec2 start, vec2 end, vec2 uv) {
    start *= scale; end *= scale;
        vec2 line = end - start;
        float frac = dot(uv - start, line) / dot(line, line);
    return distance(start + line * clamp(frac, 0.0, 1.0), uv);
}

    float dfCircle(vec2 origin, float radius, vec2 uv) {
    origin *= scale; radius *= scale;
    return abs(length(uv - origin) - radius);
}

    float dfArc(vec2 origin, float start, float sweep, float radius, vec2 uv) {
    origin *= scale; radius *= scale;
    uv -= origin;
    uv *= mat2(cos(start), sin(start), -sin(start), cos(start));
        float offs = (sweep / 2.0 - pi);
        float ang = mod(atan(uv.y, uv.x) - offs, tau) + offs;
    ang = clamp(ang, min(0.0, sweep), max(0.0, sweep));
    return distance(radius * vec2(cos(ang), sin(ang)), uv);
}

    float dfDigit(vec2 origin, float d, vec2 uv) {
    uv -= origin; d = floor(d); float dist = 1e6;
    if (d == 0.0) {
        dist = min(dist, dfLine(vec2(1., 1.), vec2(1., 0.5), uv));
        dist = min(dist, dfLine(vec2(0., 1.), vec2(0., 0.5), uv));
        dist = min(dist, dfArc(vec2(0.5, 1.), 0., 3.142, 0.5, uv));
        dist = min(dist, dfArc(vec2(0.5, 0.5), 3.142, 3.142, 0.5, uv));
    }
    else if (d == 1.0) { dist = min(dist, dfLine(vec2(0.5, 1.5), vec2(0.5, 0.), uv)); }
    else if (d == 2.0) {
        dist = min(dist, dfLine(vec2(1., 0.), vec2(0., 0.), uv));
        dist = min(dist, dfLine(vec2(0.388, 0.561), vec2(0.806, 0.719), uv));
        dist = min(dist, dfArc(vec2(0.5, 1.), 0., 3.142, 0.5, uv));
        dist = min(dist, dfArc(vec2(0.7, 1.), 5.074, 1.209, 0.3, uv));
        dist = min(dist, dfArc(vec2(0.6, 0.), 1.932, 1.209, 0.6, uv));
    }
    else if (d == 3.0) {
        dist = min(dist, dfLine(vec2(0., 1.5), vec2(1., 1.5), uv));
        dist = min(dist, dfLine(vec2(1., 1.5), vec2(0.5, 1.), uv));
        dist = min(dist, dfArc(vec2(0.5, 0.5), 3.142, 4.712, 0.5, uv));
    }
    else if (d == 4.0) {
        dist = min(dist, dfLine(vec2(0.7, 1.5), vec2(0., 0.5), uv));
        dist = min(dist, dfLine(vec2(0., 0.5), vec2(1., 0.5), uv));
        dist = min(dist, dfLine(vec2(0.7, 1.2), vec2(0.7, 0.), uv));
    }
    else if (d == 5.0) {
        dist = min(dist, dfLine(vec2(1., 1.5), vec2(0.3, 1.5), uv));
        dist = min(dist, dfLine(vec2(0.3, 1.5), vec2(0.2, 0.9), uv));
        dist = min(dist, dfArc(vec2(0.5, 0.5), 3.142, 5.356, 0.5, uv));
    }
    else if (d == 6.0) {
        dist = min(dist, dfLine(vec2(0.067, 0.75), vec2(0.5, 1.5), uv));
        dist = min(dist, dfCircle(vec2(0.5, 0.5), 0.5, uv));
    }
    else if (d == 7.0) {
        dist = min(dist, dfLine(vec2(0., 1.5), vec2(1., 1.5), uv));
        dist = min(dist, dfLine(vec2(1., 1.5), vec2(0.5, 0.), uv));
    }
    else if (d == 8.0) {
        dist = min(dist, dfCircle(vec2(0.5, 0.4), 0.4, uv));
        dist = min(dist, dfCircle(vec2(0.5, 1.15), 0.35, uv));
    }
    else if (d == 9.0) {
        dist = min(dist, dfLine(vec2(0.933, 0.75), vec2(0.5, 0.), uv));
        dist = min(dist, dfCircle(vec2(0.5, 1.), 0.5, uv));
    }
    return dist;
}

    float dfNumberInt(vec2 origin, int inum, vec2 uv) {
        float num = float(inum);
    uv -= origin;
        float dist = 1e6;
        float offs = 0.0;
    for (float i = 1.0; i >= 0.0; i--) {
            float d = mod(num / pow(10.0, i), 10.0);
            vec2 pos = digitSpacing * vec2(offs, 0.0);
        dist = min(dist, dfDigit(pos, d, uv));
        offs++;
    }
    return dist;
}

    float dfColon(vec2 origin, vec2 uv) {
    uv -= origin;
        float dist = 1e6; float offs = 0.0;
    dist = min(dist, dfCircle(vec2(offs + 0.9, 0.9) * 1.1, 0.04, uv));
    dist = min(dist, dfCircle(vec2(offs + 0.9, 0.4) * 1.1, 0.04, uv));
    return dist;
}

    float numberLength(float n) {
    return floor(max(log(n) / log(10.0), 0.0) + 1.0) + 2.0;
}

    // --- REFACTORED: CLOCK DISTANCE CALCULATOR ---
    // Returns distance to the clock at position uv
    float getClockDist(vec2 uv) {
        int hour = int(iDate.w / 3600.);
    #if TWELVE_HOUR_CLOCK
    if (hour > 12) hour -= 12;
    if (hour == 0) hour = 12;
    #endif
        int minute = int(mod(iDate.w / 60., 60.));
        
        float nsize = numberLength(999999.);
        vec2 pos = -digitSpacing * vec2(nsize, 1.0) / 2.0;
        
        float dist = 1e6;
    pos.x += 0.02;
    dist = min(dist, dfNumberInt(pos, hour, uv));
    pos.x += 0.27;
    dist = min(dist, dfColon(pos, uv));
    pos.x += 0.27;
    dist = min(dist, dfNumberInt(pos, minute, uv));

    #ifdef SECONDS
        int seconds = int(mod(iDate.w, 60.));
    pos.x += 0.27;
    dist = min(dist, dfColon(pos, uv));
    pos.x += 0.27;
    dist = min(dist, dfNumberInt(pos, seconds, uv));
    #endif

    return dist;
}

    // --- FIREWORKS LOGIC ---
    float bang(vec2 uv, float t, float id){
        float o = 0.;
    if (t <= 0.) return .04 / dot(uv, uv);
        float s = (sqrt(t) + t * exp2(-t / .125) * .8) * 10.;
        float brightness = sqrt(1. - t) * .015 * (step(.0001, t) * .9 + .1);
        float blinkI = exp2(-t / .125);
        float PARTICLES = PARTICLES_MIN + (PARTICLES_MAX - PARTICLES_MIN) * fract(cos(id) * 45241.45);
    for (float i = 0.; i < PARTICLES_MAX; i++) {
        if (i >= PARTICLES) break;
            vec2 d = dir(i + .012 * id);
            vec2 p = d * s;
            vec2 h = hash21(5.33345 * i + .015 * id);
            float blink = mix(cos((t + h.x) * 10. * (2. + h.y) + h.x * h.y * 10.) * .3 + .7, 1., blinkI);
        o += blink * brightness / dot(uv - p, uv - p);
    }
    return o;
}

    float firework(vec2 uv, float t, float id){
    if (id < 1.) return 0.;
        vec2 h = hash21(id * 5.645) * 2. - 1.;
        vec2 offset = vec2(h.x * .1, 0.);
    h.y = h.y * .95; h.y *= abs(h.y);
        vec2 di = vec2(h.y, sqrt(1. - h.y * h.y));
        float thrust = sqrt(min(t, ExT) / ExT) * 25.;
        vec2 p = offset + duration * (di * thrust + vec2(0., -9.81) * t) * t;
    return sqrt(1. - t) * bang(uv - p, max(0., (t - ExT) / (1. - ExT)), id);
}

// --- MAIN ---
void main() {
    // --- BSOD OVERRIDE ---
    if (uBSODState > 0.5) {
            vec3 col = vec3(0.0, 0.47, 0.84); // Windows Blue (C_BSOD)

            // Standard UV logic
            vec2 uv = vUv;
            // Center UVs for drawing shapes
            vec2 p = uv - vec2(0.5);
        // Aspect correction (Assume 16:9 like standard monitor)
        p.x *= 1.77;

            // Sad Face :(
            vec2 faceCenter = vec2(-0.3, 0.2); 
            vec2 fp = p - faceCenter;

            // Eyes
            float dEyes = min(length(fp - vec2(-0.05, 0.05)), length(fp - vec2(0.05, 0.05)));
            float eyes = smoothstep(0.015, 0.01, dEyes);

            // Mouth (Arc)
            vec2 m = fp - vec2(0.0, -0.08);
            float dMouthFunc = length(m) - 0.06;
            // Crop bottom half to make arc
            float mouth = smoothstep(0.01, 0.005, abs(dMouthFunc)) * step(0.0, m.y);

        col = mix(col, vec3(1.0), eyes + mouth);

            // Text Lines (Abstract)
            // Left aligned text block logic
            vec2 txtUV = uv;
        if (txtUV.x > 0.1 && txtUV.x < 0.6 && txtUV.y < 0.55 && txtUV.y > 0.5) {
            col = vec3(1.0);
        }
        if (txtUV.x > 0.1 && txtUV.x < 0.8 && txtUV.y < 0.45 && txtUV.y > 0.2) {
                 float row = floor(txtUV.y * 20.0);
            if (mod(row, 2.0) == 0.0) {
                      float lineLen = hash21(vec2(row, 1.0)) * 0.7 + 0.1;
                if ((txtUV.x - 0.1) < lineLen) col = vec3(1.0);
            }
        }

            // QRCode
            vec2 qrUV = p - vec2(0.5, 0.2); // Bottom right-ish
        if (abs(qrUV.x) < 0.1 && abs(qrUV.y) < 0.1) {
                float qrNoise = step(0.5, hash21(floor(qrUV * 50.0)));
            col = mix(col, vec3(1.0), qrNoise);
        }

        gl_FragColor = vec4(col, 1.0);
        return;
    }

        // --- STANDARD FIREWORK RENDER ---
        // Convert vUv (0..1) to centered coords (-1..1) for rendering logic
        vec2 uv = -1.0 + 2.0 * vUv;
    // Aspect correction: assume standard landscape texture or pass uniform
    uv.x *= 1.77;

    // Shift rendering to center horizon at vUv.y = 0.5
    uv.y -= 0.0;
    uv *= 35.0; // Scale world
        
        vec3 col = vec3(.01, .011, .015) * 0.0;
        
        float time = .75 * iTime;
        float t = time / duration;
        float m = 1.0;

    // --- 1. WATER & BACKGROUND ---
    if (uv.y < 0.0) {
        const float h0 = 5.0;
        const float dcam = 1000.5;
            float y = uv.y - h0;
            float z = dcam * h0 / y;
            float x = uv.x * z / dcam;

            // Water distortion
            vec2 distort = vec2(sin((x * 1.5 + z * .75) * .0005 - t * 1.5), cos((z * 2. - x * .5) * .0005 - t * 2.69));
        distort *= (sin(x * .07 + z * .09 + sin(x * .2 - t) - t * 15.) + cos(z * .1 - x * (.08 + .001 * sin(x * .01 - t)) - t * 16.) * .7 + cos(z * .01 + x * .004 - t * 10.) * 1.7);
        distort *= .15 * dcam / z;

        uv += distort;
            
            float ndv = -uv.y / sqrt(dcam * dcam + uv.y * uv.y);
        m = mix(1.0, .98, pow(1.0 - ndv, 5.0));
        uv.y = -uv.y;
    }

    col += (exp2(-abs(uv.y) * vec3(1., 2., 3.) - .5) + exp2(-abs(uv.y) * vec3(1., .2, .1) - 4.)) * .5;
        // Move island hump to the right: peak centered at x = 45
        float targetX = uv.x - 45.0;
    if (uv.y * 1.5 < (targetX + 25.0) * .015 * (25.0 - targetX) + sin(uv.x) * cos(uv.y * 1.1) * .75) col *= 0.;

    // --- ROCKETS (With Interaction) ---
    for (float i = 0.; i < ceil(NUM_ROCKETS); i++) {
            float T = 1.0 + t + i / NUM_ROCKETS; 
            float id = floor(T) - i / NUM_ROCKETS;
            vec3 rocketCol = hash31(id * .75645);
        rocketCol /= max(rocketCol.r, max(rocketCol.g, rocketCol.b));
            
            vec2 h = hash21(id * 5.645) * 2.0 - 1.0;
            vec2 offset = vec2(h.x * .1, 0.0);

        if (i == 0.0 && uMouse.x > 0.0) {
            offset.x = (uMouse.x - 0.5) * 3.5;
        }

        h.y = h.y * .95; h.y *= abs(h.y);
            vec2 di = vec2(h.y, sqrt(1.0 - h.y * h.y));
            float thrust = sqrt(min(fract(T), ExT) / ExT) * 25.0;
            vec2 p = offset + duration * (di * thrust + vec2(0.0, -9.81) * fract(T)) * fract(T);

        col += sqrt(1.0 - fract(T)) * bang(uv - p, max(0.0, (fract(T) - ExT) / (1.0 - ExT)), id) * rocketCol;
    }
        
        vec3 bgCol = m * col;

        // --- 2. FOREGROUND CLOCK SETUP ---
        vec2 clockUV = (vUv - 0.5) * vec2(1.77, 1.0);
    clockUV *= 1.1; // Scale factor
    clockUV.y -= 0.25; // Base height of sky clock

        // --- 3. MAIN CLOCK (SKY) ---
        vec3 clockCol = vec3(0);
        float dist = getClockDist(clockUV);
        float shade = 0.004 / dist;
        
        vec3 digitCol = vec3(1, 0.2, 0) * shade;
    #if GLOWPULSE
    digitCol *= noise((clockUV + vec2(iTime * .5)) * 2.5 + .5);
    #endif
    clockCol += digitCol;

    // --- 4. REFLECTION CLOCK (WATER) ---
    if (vUv.y < 0.5) {
            // Symmetry around vUv.y = 0.5
            float distFromHorizon = 0.5 - vUv.y;
            vec2 reflUV = (vec2(vUv.x, 0.5 + distFromHorizon) - 0.5) * vec2(1.77, 1.0);
        reflUV *= 1.1;
        reflUV.y -= 0.25;

        reflUV.x += sin(reflUV.y * 10.0 + iTime * 2.0) * 0.02;
            
            float distRefl = getClockDist(reflUV);
            float shadeRefl = 0.004 / distRefl;
            
            vec3 reflColor = vec3(1.0, 0.4, 0.2) * shadeRefl * 0.4;
        reflColor *= exp(-distFromHorizon * 8.0); // Natural fade

        clockCol += reflColor;
    }

        // --- COMPOSITE ---
        vec3 finalCol = bgCol + clockCol;
    finalCol = pow(finalCol, vec3(1.0 / 2.2));

    gl_FragColor = vec4(finalCol, 1.0);
}
`;



export const nebulaHelixFS = `

uniform float iTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform float nebulaCoreRadius; // scale
uniform float uNebulaRotation;  // Integrated rotation control
uniform float uNebulaSwirl;     // Integrated swirl control


varying vec2 vUv;
vec2 uMouse = vec2(0.);

//SHADER HERE
// Fork of "Supernova remnant" by Duke
// https://www.shadertoy.com/view/MdKXzc
//-------------------------------------------------------------------------------------
// Based on "Dusty nebula 4" (https://www.shadertoy.com/view/MsVXWW)
// and "Protoplanetary disk" (https://www.shadertoy.com/view/MdtGRl)
// otaviogood's "Alien Beacon" (https://www.shadertoy.com/view/ld2SzK)
// and Shane's "Cheap Cloud Flythrough" (https://www.shadertoy.com/view/Xsc3R4) shaders
// Some ideas came from other shaders from this wonderful site
// Press 1-2-3 to zoom in and zoom out.
// License: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License
//-------------------------------------------------------------------------------------


//-------------------
#define pi 3.14159265
#define R(p, a) p = cos(a) * p + sin(a) * vec2(p.y, -p.x)

// iq's noise
float noise( in vec3 x)
{
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    vec2 uv = (p.xy + vec2(37.0, 17.0) * p.z) + f.xy;
    vec2 rg = textureLod(iChannel0, (uv + 0.5) / 256.0, 0.0).yx;
    return 1. - 0.82 * mix(rg.x, rg.y, f.z);
}



float fbm(vec3 p)
{
    //    return noise(p*.06125)*.5 + noise(p*.125)*.25 + noise(p*.25)*.125 + noise(p*.4)*.2;
    // return noise(p*.06125)*.5 + noise(p*.125)*.25; //for better performance
    return noise(p * 0.09f) * 0.75f; ////for better performance with minimal quality reduction
}

float length2(vec2 p)
{
    return sqrt(p.x * p.x + p.y * p.y);
}

float length8(vec2 p)
{
    p = p * p; p = p * p; p = p * p;
    return pow(p.x + p.y, 1.0 / 8.0);
}


float Disk(vec3 p, vec3 t)
{
    vec2 q = vec2(length2(p.xy) - t.x, p.z * 0.5);
    return max(length8(q) - t.y, abs(p.z) - t.z);
}

//==============================================================
// otaviogood's noise from https://www.shadertoy.com/view/ld2SzK
//--------------------------------------------------------------
// This spiral noise works by successively adding and rotating sin waves while increasing frequency.
// It should work the same on all computers since it's not based on a hash function like some other noises.
// It can be much faster than other noise functions if you're ok with some repetition.
const float nudge = 0.9;    // size of perpendicular vector
float normalizer = 1.0 / sqrt(1.0 + nudge * nudge);   // pythagorean theorem on that perpendicular to maintain scale
float SpiralNoiseC(vec3 p)
{
    float n = 0.0;  // noise amount
    float iter = 2.0;
    for (int i = 0; i < 4; i++)
    {
        // add sin and cos scaled inverse with the frequency
        n += -abs(sin(p.y * iter) + cos(p.x * iter)) / iter;    // abs for a ridged look
        // rotate by adding perpendicular and scaling down
        p.xy += vec2(p.y, -p.x) * nudge;
        p.xy *= normalizer;
        // rotate on other axis
        p.xz += vec2(p.z, -p.x) * nudge;
        p.xz *= normalizer;
        // increase the frequency
        iter *= 1.733733;
    }
    return n;
}

float NebulaNoise(vec3 p)
{
    float final = Disk(p.xzy, vec3(2.0, 1.8, 1.25));
    final += fbm(p * 90.);
    final += SpiralNoiseC(p.zxy * 0.5123 + 100.0 + uNebulaSwirl) * 3.0;

    return final;
}

float map(vec3 p)
{
    R(p.yx, uMouse.x * 0.008 * pi + uNebulaRotation);  //Integrated rotation math

    float NebNoise = abs(NebulaNoise(p / 0.5) * 0.5);

    return NebNoise + 0.07;
}
//--------------------------------------------------------------

// assign color to the media
vec3 computeColor(float density, float radius)
{
    // color based on density alone, gives impression of occlusion within
    // the media
    // CHANGE: Softer, deeper tones for density (Dark Teal & Bronze)
    vec3 result = mix(vec3(0.0, 0.05, 0.08), vec3(0.05, 0.03, 0.0), density);

    // color added to the media
    // CHANGE: Center is soft Cyan, Edge is pale Gold (Subtle & Artistic)
    vec3 colCenter = 5.0 * vec3(0.3, 0.8, 1.0).rgb; // Softened Cyan
    vec3 colEdge = 1.0 * vec3(1.0, 0.7, 0.4).rgb;   // Pastel Gold
    result *= mix(colCenter, colEdge, min((radius + .05) / .9, 1.15));

    return result;
}

bool RaySphereIntersect(vec3 org, vec3 dir, out float near, out float far)
{
    float b = dot(dir, org);
    float c = dot(org, org) - 8.;
    float delta = b * b - c;
    if (delta < 0.0)
        return false;
    float deltasqrt = sqrt(delta);
    near = -b - deltasqrt;
    far = -b + deltasqrt;
    return far > 0.0;
}

// Applies the filmic curve from John Hable's presentation
// More details at : http://filmicgames.com/archives/75
vec3 ToneMapFilmicALU(vec3 _color)
{
    _color = max(vec3(0), _color - vec3(0.004));
    _color = (_color * (6.2 * _color + vec3(0.5))) / (_color * (6.2 * _color + vec3(1.7)) + vec3(0.06));
    return _color;
}

void main()
{


    // ro: ray origin
    // rd: direction of the ray
    vec3 rd = normalize(vec3(-1. + 2. * vUv, 1.2));
    vec3 ro = vec3(0., 0., -6.);

    // ld, td: local, total density
    // w: weighting factor
    float ld = 0., td = 0., w = 0.;

    // t: length of the ray
    // d: distance function
    float d = 1., t = 0.;

    const float h = 0.1;

    vec4 sum = vec4(0.0);

    float min_dist = 0.0, max_dist = 0.0;

    if (RaySphereIntersect(ro, rd, min_dist, max_dist)) {

        t = min_dist * step(t, min_dist);

        // raymarch loop
        for (int i = 0; i < 64; i++)
        {

        vec3 pos = ro + t * rd;

            // Loop break conditions.
            if (td > 0.9 || d < 0.1 * t || t > 10. || sum.a > 0.99 || t > max_dist) break;

        // evaluate distance function
        float d = map(pos);

            // change this string to control density
            d = max(d, 0.0);

        // point light calculations
        vec3 ldst = vec3(0.0) - pos;
        float lDist = max(length(ldst), 0.001);

        // the color of light
        float _T = lDist * 2.3 + 2.6; // <-v endless tweaking
        //_T -= iTime*0.5;
        // CHANGE: Subtle oscillation between Cool White and Warm White
        vec3 lightColor = vec3(0.5) + 0.4 * vec3(
                cos(_T + pi * 0.0),
                cos(_T + pi * 0.2), // Closer phases for white-ish blend
                cos(_T + pi * 0.4)
            );
            // Removed heavy saturation boost

            // CHANGE: Central star is soft, bright Cyan-White
            sum.rgb += (vec3(0.6, 0.9, 1.0) / (lDist * lDist * 6.) / nebulaCoreRadius); // star itself
            sum.rgb += (lightColor / exp(lDist * lDist * lDist * .08) / 30.); // bloom

            if (d < h) {
                // compute local density
                ld = h - d;

                // compute weighting factor
                w = (1. - td) * ld;

                // accumulate density
                td += w + 1. / 200.;

            vec4 col = vec4(computeColor(td, lDist), td);

                // emission
                sum += sum.a * vec4(sum.rgb, 0.0) * 0.2;

                // uniform scale density
                col.a *= 0.25;
                // colour by alpha
                col.rgb *= col.a;
                // alpha blend in contribution
                sum = sum + col * (1.0 - sum.a);

            }

            td += 1. / 70.;



            // trying to optimize step size near the camera and near the light source
            // t += max(d * 0.1 * max(min(length(ldst),length(ro)),1.0), 0.01);
            t += max(d * 0.1 * max(min(length(ldst), length(ro)), 1.0), 0.02);

        }

        // simple scattering
        sum *= 1. / exp(ld * 0.2) * 0.6;

        sum = clamp(sum, 0.0, 1.0);

        sum.xyz = sum.xyz * sum.xyz * (3.0 - 2.0 * sum.xyz);

    }

    gl_FragColor = vec4(sum.xyz, 1.0);


}
`


export const stormFS = `
  uniform float iTime;
  uniform bool isStriking;
  uniform vec2 normalizedStrikePos;
  
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  uniform float uRainHeaviness;
  uniform float uStormSharpness;

  // --- MOON UNIFORMS ---
  uniform vec2 uMoonPosition;
  uniform float uMoonSize;
  uniform float uMoonBrightness;
  uniform float uMoonBlur;
  uniform float uCraterScale;
  uniform float uCraterIntensity;
  uniform float uFarMountainOffset;
  uniform float uNearMountainOffset;
  uniform vec2 iResolution;

  // --- NOISE & RANDOM FUNCTIONS ---
  float rand(float x) {
    return fract(sin(x) * 75154.32912);
}

  vec2 rand2(vec2 p) {
    return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

  float rand3d(vec3 x) {
    return fract(375.10297 * sin(dot(x, vec3(103.0139, 227.0595, 31.05914))));
}

  float noise(float x) {
      float i = floor(x);
      float a = rand(i), b = rand(i + 1.);
      float f = x - i;
    return mix(a, b, f);
}

  float perlin(float x) {
      float r = 0., s = 1., w = 1.;
    for (int i = 0; i < 2; i++) { // OPTIMIZATION: Reduced from 3 to 2
        s *= 2.0;
        w *= 0.5;
        r += w * noise(s * x);
    }
    return r;
}

  float noise3d(vec3 x) {
      vec3 i = floor(x);
      float i000 = rand3d(i + vec3(0., 0., 0.)), i001 = rand3d(i + vec3(0., 0., 1.));
      float i010 = rand3d(i + vec3(0., 1., 0.)), i011 = rand3d(i + vec3(0., 1., 1.));
      float i100 = rand3d(i + vec3(1., 0., 0.)), i101 = rand3d(i + vec3(1., 0., 1.));
      float i110 = rand3d(i + vec3(1., 1., 0.)), i111 = rand3d(i + vec3(1., 1., 1.));
      vec3 f = x - i;
    return mix(mix(mix(i000, i001, f.z), mix(i010, i011, f.z), f.y),
        mix(mix(i100, i101, f.z), mix(i110, i111, f.z), f.y), f.x);
}

  float perlin3d(vec3 x) {
      float r = 0.0;
      float w = 1.0, s = 1.0;
    // OPTIMIZATION: Reduced from 2 to 1. 3D noise is very expensive.
    w *= 0.5;
    s *= 2.0;
    r += w * noise3d(s * x);
    
    return r;
}

  // Helper to generate 2D-like noise using 3D perlin (slice at z=0.5)
  float moonSurfaceNoise(vec2 uv, float scale) {
    return perlin3d(vec3(uv * scale, 0.5));
}

  // --- OBJECT/EFFECT FUNCTIONS ---

  float f(float y) {
      float w = 0.25; 
      float primary_path = perlin(2.0 * y);
      float forking_detail = perlin(20.0 * y) * 0.1;
    return w * (primary_path + forking_detail - 0.5);
}

  float plot(vec2 p, float d, bool thicker) {
    if (thicker) d += 2. * abs(f(p.y + 0.001) - f(p.y));
    return smoothstep(d, 0., abs(f(p.y) - p.x));
}

  float cloud(vec2 uv, float speed, float scale, float cover) {
      float c = perlin3d(vec3(uv * scale, iTime * speed * 2.));
    return max(0., c - (1. - cover));
}

  float mountain(vec2 uv, float scale, float offset, float h1, float h2) {
      float h = h1 + perlin(scale * uv.x + offset) * (h2 - h1);
    return smoothstep(h, h + 0.01, uv.y);
}

  float rain_layer(vec2 uv, float time_mult, vec2 density, float slant, float streak_length) {
      float time = iTime * time_mult;
      vec2 motion = vec2(slant, 1.0);
      vec2 uv_moved = uv + motion * time;

      vec2 grid_id = floor(uv_moved * density);
      float random_val = rand(grid_id.x + grid_id.y * 19.19);

      vec2 grid_uv = fract(uv_moved * density);

      float drop_y = fract(grid_uv.y + random_val);
      float drop_x = rand(grid_id.y + grid_id.x * 29.29);
      float dist_x = abs(grid_uv.x - drop_x);

      float line = smoothstep(0.04, 0.0, dist_x);
      float streak = line * smoothstep(streak_length, 0.0, drop_y);

    return streak;
}
      
  float getWhiteCoreWidth(float x) {
    const float MIN_WIDTH = 0.0003;
    const float MAX_WIDTH = 0.0015;
    const float CONSTANT_END_POINT = 0.37;
    const float DECAY_RATE_K = 15000.0;

    if (x <= CONSTANT_END_POINT) {
        return MAX_WIDTH;
    }

    const float DECAY_RANGE = MAX_WIDTH - MIN_WIDTH;
        float distance = x - CONSTANT_END_POINT;
        float decayFactor = exp(-DECAY_RATE_K * distance);

    return MIN_WIDTH + DECAY_RANGE * decayFactor;
}

  // --- RENDER FUNCTION ---
  vec3 render(vec2 uv) {
    uv.x += 0.12; // Offset scene to the left (adjusted from 0.2 per user request)
      vec3 lightning = vec3(0.0);
      float light = 0.;

    // --- LIGHTNING LOGIC ---
    if (isStriking) {
          float i = floor(iTime * 10.0);
          vec2 uv2 = uv;
        uv2.y += i * 2.;

          // Input normalizedStrikePos.x is ALREADY in -1..1 range (calculated in JS as 2*localPoint)
          // So we just need to add the scene offset (0.12) to match uv2.x
          float p = normalizedStrikePos.x + 0.12;
        uv2.x -= p;
          
          float whiteCoreWidth = getWhiteCoreWidth(normalizedStrikePos.y);
          float strike = plot(uv2, whiteCoreWidth, false) * 2.0;
          float glow = plot(uv2, 0.04, false) * 0.2;

          vec3 strike_color = vec3(1.0, 1.0, 1.0);
          vec3 glow_color = vec3(0.3, 0.5, 1.0);

          vec3 colored_lightning = strike_color * strike + glow_color * glow;
          
          float h = normalizedStrikePos.y;
        colored_lightning *= smoothstep(h, h + 0.05, uv.y + perlin(1.2 * uv.x + 4. * h) * 0.03);

        light = smoothstep(6., 0., abs(uv.x - p)) * 1.5;
        lightning = colored_lightning;
    }

      vec3 sky = vec3(0.05, 0.08, 0.22); // brighter night sky per user request



      // ==========================================
      // === REALISTIC PROCEDURAL MOON RENDERING ===
      // ==========================================

      vec2 moonPos = -1.0 + 2.0 * uMoonPosition;

      // --- CORRECTING DISTORTION (Ray-Sphere Intersection) ---
      // We derive the Moon's 3D direction from its 2D position on the Sky Plane without using simple 2D distance.
      // This ensures it looks like a perfect sphere regardless of camera angle.
      
      vec3 viewDir = normalize(vWorldPosition - cameraPosition);

      // Sky Plane Parameters (approximate)
      vec3 planeCenter = vec3(-55.0, -20.0, 30.0);
      float planeScale = 150.0;

      // Calculate World Position of the Moon center based on UVs
      vec3 moonWorldPos = planeCenter + vec3((uMoonPosition.x - 0.5) * planeScale, (uMoonPosition.y - 0.5) * planeScale, 0.0);
      vec3 moonDir = normalize(moonWorldPos - cameraPosition);

      // Use Angular Distance (Perfect Circle)
      float moonDot = dot(viewDir, moonDir);
      float moonAngle = acos(clamp(moonDot, -1.0, 1.0));

      // Adjusted scale to match previous "beautiful" look preference
      // The user tuned uMoonSize for the 2D version (factor 4.0).
      // We keep this factor for the Radius calculation to maintain relative visual size logic.
      float moonRadiusRad = uMoonSize * 4.0;

      // 3. Moon Body Mask
      float moonBody = smoothstep(moonRadiusRad, moonRadiusRad - uMoonBlur, moonAngle);

      vec3 finalMoonLayer = vec3(0.0);

    if (moonBody > 0.001) {
          // 4. Billboard Projection for Texture
          vec3 moonRight = normalize(cross(vec3(0.0, 1.0, 0.0), moonDir));
          vec3 moonUp = normalize(cross(moonDir, moonRight));
          
          vec2 localUV = vec2(dot(viewDir, moonRight), dot(viewDir, moonUp));

          // Restore Linear UV Mapping (dividing by radius directly)
          // This restores the "Zoom" level of the craters to what the user liked.
          vec2 moonUV = localUV / moonRadiusRad;
          
          float distSq = dot(moonUV, moonUV);

        if (distSq < 1.0) {
              // 5. Procedural Textures
              // Layer A: Maria (Seas)
              float mariaNoise = moonSurfaceNoise(moonUV, 2.5); 
              float maria = smoothstep(0.3, 0.8, mariaNoise);

              // Layer B: Craters
              float craterNoise = moonSurfaceNoise(moonUV, uCraterScale);
              float craterShape = smoothstep(0.45, 0.55, craterNoise);

              // Combine Textures
              float surfaceBrightness = 1.0;
            surfaceBrightness -= maria * 0.3;
            surfaceBrightness *= mix(1.0, 0.4, craterShape * uCraterIntensity);

              // 6. Color & Lighting
              vec3 icyBlueTint = vec3(0.75, 0.9, 1.0);

              // Soft spherical, but mostly flat to keep detail visible
              float sphereShade = sqrt(1.0 - distSq);
            surfaceBrightness *= (0.9 + 0.1 * sphereShade);

              // Boosted brightness multiplier for the moon body per user request
              vec3 moonColor = icyBlueTint * uMoonBrightness * surfaceBrightness * 2.5;

            finalMoonLayer = moonColor * moonBody;
        }
    }

      // 7. Moon Aura (Glow)
      // Exponential decay starting exactly at the edge
      float distFromEdge = max(0.0, moonAngle - moonRadiusRad);
      // Slower decay for a larger, clearer glow (was -20.0)
      float glowDecay = exp(-12.0 * distFromEdge);

      // Mask: strictly 0 inside the moon (distFromEdge is 0, but we want to be sure)
      // effectively, aura adds on top of the background, but should not wash out the moon body.
      // We use a smoothstep mask slightly outside the radius to blend it clean.
      float auraMask = smoothstep(moonRadiusRad - uMoonBlur, moonRadiusRad, moonAngle);

      // Reverted to clearer light blue-ish tone (less cyan, more white-blue)
      // Linear scaling with brightness but dampened factor (0.5) to scale "a little bit"
      vec3 auraColor = vec3(0.4, 0.6, 1.0) * uMoonBrightness * 0.5;
      vec3 auraLayer = auraColor * glowDecay * auraMask;

    // Composite Moon + Aura (Moved after clouds to ensure visibility)
    // sky += finalMoonLayer + auraLayer; // Originally here

    // ==========================================

    // Composite Moon + Aura (Before Clouds so they cover it)
    sky = finalMoonLayer + sky * (1.0 - moonBody) + auraLayer;

      // --- CLOUDS ---
      // Modified: Faster (shorter cover time) and gapier (contrast) per user request
      float c1_density = cloud(uv, 0.25, 0.1, 0.65); 
      float c2_density = cloud(uv * vec2(0.5, 1.), 0.10, 0.8, 0.60);
      float c3_density = cloud(uv * vec2(0.1, 1.), 0.15, 5.5, 0.55);

      vec3 cloud_base_color = vec3(0.5, 0.6, 0.7); // darker base for contrast
      vec3 cloud_highlight_color = vec3(1.0, 1.0, 1.0); // pure white highlights

      // Use the densities to mix between base and highlight
      vec3 cloud_color = mix(cloud_base_color, cloud_highlight_color, c1_density);

    // Add contribution from other layers
    cloud_color += (vec3(0.9) * c2_density * 0.5) + (vec3(1.0) * c3_density * 0.3);

      float total_cloud_density = c1_density + c2_density + c3_density;

      // Wider transition range allows for soft, partial coverage
      // But we boost the density slightly to make sure it's not too transparent
      float cloud_alpha = smoothstep(0.1, 0.9, total_cloud_density * 1.2);

    sky = mix(sky, cloud_color, cloud_alpha);

      // Re-add moon on top of clouds (Alpha Blend to block clouds behind it)
      // sky = finalMoonLayer + sky * (1.0 - moonBody) + auraLayer; // Moved up

      // --- MOUNTAINS ---
      // Modified: Using Uniforms for X offset
      float far_mountain_mask = mountain(uv + vec2(uFarMountainOffset, 0.0), 1.21, 9., 0.3, 0.6);
      float mid_mountain_mask = mountain(uv + vec2(uNearMountainOffset, 0.0), 1.83, 3., 0.25, 0.5);

      vec3 terrain_color_far = 1. * vec3(0.15, 0.2, 0.3);
      vec3 terrain_color_close = vec3(0.25, 0.3, 0.3) * 0.5;

      vec3 background = sky;
    background = mix(terrain_color_far, background, far_mountain_mask);
    background = mix(terrain_color_close, background, mid_mountain_mask);

    background *= (0.2 + light * 0.03);

      vec3 scene_color = background + lightning;

      // --- RAIN ---
      float density_mult = mix(100.0, 400.0, uRainHeaviness);
      vec2 rain_density = vec2(density_mult * 1.0, density_mult * 0.75);

      float rain_amount = rain_layer(uv, 1.5, rain_density, 1.0, 0.15);
    rain_amount = clamp(rain_amount, 0.0, 1.0);

      vec3 rain_color = vec3(0.7, 0.8, 1.0) * (0.74 + light * 2.0);
      
      vec3 final_color = mix(scene_color, rain_color, rain_amount * uRainHeaviness);

    return final_color;
}

void main() {
      vec2 uv = -1. + 2. * vUv;
      
      vec3 finalColor = render(uv);
    // uStormSharpness = 0 => all black, uStormSharpness = 1 => normal render
    finalColor *= uStormSharpness;

    gl_FragColor = vec4(finalColor, 1.0);
}
`;

export const rainyGlassFS = `

uniform float iTime;
uniform vec2 iResolution;
uniform float rainGlassOpacity;
uniform float glassRainAmount;
varying vec2 vUv;
vec2 uMouse = vec2(0.);

// TOGGLES & RANDOMNESS
uniform bool hasRimOnGlass; 
uniform float uRainOffset; // Allows different rain patterns per plane
uniform vec2 uRimCenter;

uniform sampler2D iChannelX;

// ==================================================
// HELPER FUNCTIONS (Noise & Math)
// ==================================================

float hash(vec2 p)  { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

float noise(vec2 x) {
    vec2 i = floor(x);
    vec2 f = fract(x);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

#define S(a, b, t) smoothstep(a, b, t)

vec3 N13(float p) {
    vec3 p3 = fract(vec3(p) * vec3(.1031, .11369, .13787));
    p3 += dot(p3, p3.yzx + 19.19);
    return fract(vec3((p3.x + p3.y) * p3.z, (p3.x + p3.z) * p3.y, (p3.y + p3.z) * p3.x));
}

vec4 N14(float t) {
    return fract(sin(t * vec4(123., 1024., 1456., 264.)) * vec4(6547., 345., 8799., 1564.));
}

float N(float t) {
    return fract(sin(t * 12345.564) * 7658.76);
}

float Saw(float b, float t) {
    return S(0., b, t) * S(1., b, t);
}

vec2 DropLayer2(vec2 uv, float t) {
    vec2 UV = uv;

    uv.y += t * 0.75;
    vec2 a = vec2(6., 1.);
    vec2 grid = a * 2.;
    vec2 id = floor(uv * grid);
    
    float colShift = N(id.x);
    uv.y += colShift;

    id = floor(uv * grid);
    vec3 n = N13(id.x * 35.2 + id.y * 2376.1);
    vec2 st = fract(uv * grid) - vec2(.5, 0);
    
    float x = n.x - .5;
    
    float y = UV.y * 20.;
    float wiggle = sin(y + sin(y));
    x += wiggle * (.5 - abs(x)) * (n.z - .5);
    x *= .7;
    float ti = fract(t + n.z);
    y = (Saw(.85, ti) - .5) * .9 + .5;
    vec2 p = vec2(x, y);
    
    float d = length((st - p) * a.yx);
    
    float mainDrop = S(0.3, .0, d);
    
    float r = sqrt(S(1., y, st.y));
    float cd = abs(st.x - x);
    float trail = S(.23 * r, .15 * r * r, cd);
    float trailFront = S(-.02, .02, st.y - y);
    trail *= trailFront * r * r;

    y = UV.y;
    float trail2 = S(.2 * r, .0, cd);
    float droplets = max(0., (sin(y * (1. - y) * 120.) - st.y)) * trail2 * trailFront * n.z;
    y = fract(y * 10.) + (st.y - .5);
    float dd = length(st - vec2(x, y));
    droplets = S(.2, 0., dd);
    float m = mainDrop + droplets * r * trailFront;

    return vec2(m, trail);
}

float StaticDrops(vec2 uv, float t) {
    uv *= 20.;
    
    vec2 id = floor(uv);
    uv = fract(uv) - .0;
    vec3 n = N13(id.x * 107.45 + id.y * 3543.654);
    vec2 p = (n.xy - .5) * .7;
    float d = length(uv - p);
    
    float fade = Saw(.025, fract(t + n.z));
    float c = S(.3, 0., d) * fract(n.z * 10.) * fade;
    return c;
}

vec2 Drops(vec2 uv, float t, float l0, float l1, float l2) {
    float s = StaticDrops(uv, t) * l0; 
    vec2 m1 = DropLayer2(uv, t) * l1;
    vec2 m2 = DropLayer2(uv * 1.85, t) * l2;
    
    float c = s + m1.x + m2.x;
    c = S(.3, 1., c);

    return vec2(c, max(m1.y * l0, m2.y * l1));
}

// ==================================================
// MAIN SHADER LOOP
// ==================================================

void main()
{
    // 1. APPLY RANDOM OFFSET (Only for rain drops)
    // We create a separate UV for rain so shifting it doesn't move the dry spot.
    vec2 rainUv = vUv + vec2(uRainOffset * 20.0, uRainOffset * 10.0);

    vec2 uv = -1. + 2. * rainUv;
    vec2 UV = rainUv; // Use randomized UV
    
    vec3 M = vec3(0.);
    float T = 100.0 + iTime + M.y * 2.;
    
    float t = T * 0.16;
    // float glassRainAmount = 1.0;
    float maxBlur = mix(1.0, 30.0, glassRainAmount);
    float minBlur = 0.5;
    float zoom = 3.15;

    uv *= .7 + zoom * .3;
    UV = (UV - .5) * (.9 + zoom * .1) + .5;
    
    float staticDrops = S(-.5, 1., glassRainAmount) * 0.5;
    float layer1 = S(.25, .75, glassRainAmount);
    float layer2 = S(.0, .5, glassRainAmount);

    // Calculate Standard Rain Drops
    vec2 c = Drops(uv, t, staticDrops, layer1, layer2);

    // --------------------------------------------------
    // DRY SPOT & RIM LOGIC
    // --------------------------------------------------

    // Default values (used if hasRimOnGlass is false)
    float rainMask = 1.0;  // 1.0 = visible rain
    float rimFactor = 0.0; // 0.0 = no rim highlight

    if (hasRimOnGlass) {
        // IMPORTANT: Use original 'vUv' here, not 'rainUv'
        // This ensures the hole stays in the center regardless of randomness
        vec2 centerPos = vUv - uRimCenter;

        // Aspect Ratio Fix (Adjust if plane dimensions change)
        float planeAspect = 0.75;
        centerPos.x *= planeAspect; 
        
        float centerDist = length(centerPos);

        // --- SETTINGS (Scaled up 1.5x) ---
        float spotRadius = 0.075; // Size of hole
        float noiseScale = 3.5;   // Spikiness
        float noiseStrength = 0.05; // Depth of spikes
        
        float organicNoise = noise(normalize(centerPos) * noiseScale + iTime * 0.5);
        float distortedDist = centerDist + organicNoise * noiseStrength;

        float rimWidth = 0.06; // Thickness of rim

        rimFactor = S(spotRadius + rimWidth, spotRadius, distortedDist);
        float edgeSoftness = 0.02;

        // Calculate the mask (0.0 inside hole, 1.0 outside)
        rainMask = S(spotRadius, spotRadius + edgeSoftness, distortedDist);
    }

    // --------------------------------------------------
    // COMBINE LAYERS
    // --------------------------------------------------

    // Generate dense rim drops (Double layer technique)
    float extra1 = StaticDrops(uv + vec2(0.3, 0.25), t);
    float extra2 = StaticDrops(uv * 1.1 + vec2(0.0, 0.0), t);

    // Multiply by rimFactor (will be 0.0 if hasRimOnGlass is false)
    float denseRim = (extra1 + extra2) * rimFactor * 2.0;

    // Add rim drops to the main drop channel
    c.x = max(c.x, denseRim);

    // Cut the hole in the rain layer
    c *= rainMask;

    // --------------------------------------------------
    // NORMAL CALCULATION (For neighbors)
    // --------------------------------------------------
    vec2 e = vec2(.001, 0.);

    // Neighbor 1
    vec2 c1 = Drops(uv + e, t, staticDrops, layer1, layer2);
    float e1_1 = StaticDrops(uv + e + vec2(0.3, 0.25), t);
    float e1_2 = StaticDrops((uv + e) * 1.1 + vec2(0.0, 0.0), t);
    float r1 = (e1_1 + e1_2) * rimFactor * 2.0;
    c1.x = max(c1.x, r1);
    float cx = c1.x * rainMask;

    // Neighbor 2
    vec2 c2 = Drops(uv + e.yx, t, staticDrops, layer1, layer2);
    float e2_1 = StaticDrops(uv + e.yx + vec2(0.3, 0.25), t);
    float e2_2 = StaticDrops((uv + e.yx) * 1.1 + vec2(0.0, 0.0), t);
    float r2 = (e2_1 + e2_2) * rimFactor * 2.0;
    c2.x = max(c2.x, r2);
    float cy = c2.x * rainMask;

    vec2 n = vec2(cx - c.x, cy - c.x);

    // --------------------------------------------------
    // FINAL COMPOSITION
    // --------------------------------------------------

    // Calculate Blur
    float focus = mix(maxBlur - c.y, minBlur, S(.1, .2, c.x));

    // Ensure the dry spot is crystal clear (0 blur)
    focus *= rainMask;

    // Sample the background texture
    vec3 col = textureLod(iChannelX, UV + n, focus).rgb;

    // Shading
    col *= 1.0 - c.x * 0.15; // Darken drops
    float highlight = max(0.0, normalize(n).y);
    col += pow(highlight, 20.0) * 0.5; // Add specularity

    col *= 1.0 - c.y * 0.3; // Trail visibility

    // Add subtle whitish highlight to the rim
    col += vec3(0.15) * rimFactor * rainMask;

    gl_FragColor = vec4(col, rainGlassOpacity);
}
`;


export const redGlowFragmentShader = `
  varying vec2 vUv;

void main() {
    vec2 centeredUv = vUv - 0.5;
    float distanceFromCenter = length(centeredUv);
    float glow = 1.0 - smoothstep(0.1, 0.4, distanceFromCenter);
    vec3 glowColor = vec3(1.0, 0.0, 0.0);
    gl_FragColor = vec4(glowColor, glow);
}
`;



export const vertexShaderGlowSkinned = `
    varying vec3 vNormal;
    varying vec3 vPositionNormal;

#include <common>
    #include <skinning_pars_vertex>

    void main()
{
    // This chunk is essential. It reads the bone texture and defines
    // the boneMatX, boneMatY, etc. variables. It must come first.
    #include <skinbase_vertex>

        // These chunks use boneMatX/Y/Z/W to calculate the skinned normal.
        #include <beginnormal_vertex>
        #include <skinnormal_vertex>
        #include <defaultnormal_vertex>

        // These chunks calculate the vertex position after skinning.
        #include <begin_vertex>
        #include <skinning_vertex>
        #include <project_vertex>

        // Now that the built-in chunks have calculated everything,
        // we can safely assign the results to our varyings.
        vNormal = normalize(transformedNormal);
    vPositionNormal = normalize(mvPosition.xyz);
}
`;

export const vertexShaderMorphOscillate2 = `
// ==========================================
// 1. SIMPLEX NOISE FUNCTIONS (Keep these at the top)
// ==========================================
vec4 permute(vec4 x){ return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){
    const vec2  C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

    // Permutations
    i = mod(i, 289.0); 
  vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  // Gradients
  float n_ = 1.0 / 7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z); 

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_); 

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// ==========================================
// 2. MAIN SHADER LOGIC
// ==========================================

uniform float iTime;
uniform float uTransformProgress; // 0.0 to 1.0

attribute vec3 targetPosition;
attribute vec3 targetNormal;



varying vec2 vUv;
varying vec3 vNormal; // Pass to fragment shader for lighting
varying vec3 vPositionNormal;
varying float vNoise;

void main() {
    vUv = uv;

    // A. INTERPOLATION (Morphing)
    // ------------------------------------------------
    // Mix position and normal linearly first
    vec3 mixedPosition = mix(position, targetPosition, uTransformProgress);
    vec3 mixedNormal = normalize(mix(normal, targetNormal, uTransformProgress));

    // B. LIQUID INTENSITY (The Bell Curve)
    // ------------------------------------------------
    // Starts at 0, goes to 1.0 at 50%, ends at 0
    float liquidIntensity = sin(uTransformProgress * 3.14159);

    // C. CALCULATE OSCILLATION (Fluid Effect)
    // ------------------------------------------------
    float time = iTime * 0.8;

    // Noise Layer 1: Base shape blob
    // Note: We use mixedPosition so the noise moves with the object
    float noise1 = snoise(mixedPosition * 0.8 + vec3(time));

    // Noise Layer 2: Smaller ripples
    float noise2 = snoise(mixedPosition * 2.5 - vec3(time * 1.5));

    // Combine noise
    // We multiply by liquidIntensity so the effect is 0 at start/end
    float displacement = ((noise1 * 0.5) + (noise2 * 0.2)) * liquidIntensity;

    // D. APPLY
    // ------------------------------------------------
    // Move the vertex outward along its normal
    vec3 finalPos = mixedPosition + (mixedNormal * displacement);
    vNoise = noise1;

    vNormal = mixedNormal; // Update normal for fragment shader
    vPositionNormal = normalize((modelViewMatrix * vec4(finalPos, 1.0)).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
}
`;
export const vertexShaderMorphOscillate = `
// ==========================================
// 1. SIMPLEX NOISE FUNCTIONS (Keep these at the top)
// ==========================================
vec4 permute(vec4 x){ return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){
    const vec2  C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

    // Permutations
    i = mod(i, 289.0); 
  vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  // Gradients
  float n_ = 1.0 / 7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z); 

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_); 

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// ==========================================
// 2. MAIN SHADER LOGIC
// ==========================================

uniform float iTime;
uniform float uTransformProgress; // 0.0 to 1.0

attribute vec3 targetPosition;
attribute vec3 targetNormal;
uniform float uOscillationStrength;
uniform float uIsOscillating;


varying vec2 vUv;
varying vec3 vNormal; // Pass to fragment shader for lighting
varying vec3 vPositionNormal;
varying float vNoise;

void main() {
    vUv = uv;

    // A. INTERPOLATION (Morphing)
    // ------------------------------------------------
    // Mix position and normal linearly first
    vec3 mixedPosition = mix(position, targetPosition, uTransformProgress);
    vec3 mixedNormal = normalize(mix(normal, targetNormal, uTransformProgress));

    // B. LIQUID INTENSITY (The Bell Curve)
    // ------------------------------------------------
    // Starts at 0, goes to 1.0 at 50%, ends at 0
    float liquidIntensity = sin(uTransformProgress * 3.14159);

    // C. CALCULATE OSCILLATION (Fluid Effect)
    // ------------------------------------------------
    float time = iTime * 0.8;

    // Noise Layer 1: Base shape blob
    // Note: We use mixedPosition so the noise moves with the object
    float noise1 = snoise(mixedPosition * 0.8 + vec3(time));

    // Noise Layer 2: Smaller ripples
    float noise2 = snoise(mixedPosition * 2.5 - vec3(time * 1.5));

    // Combine noise
    // We multiply by liquidIntensity so the effect is 0 at start/end
    // float displacement = ((noise1 * 0.5) + (noise2 * 0.2)) * (liquidIntensity + (uOscillationStrength * uIsOscillating));
  float displacement = ((noise1 * 0.3) + (noise2 * 0.1)) * uOscillationStrength * uIsOscillating;

    // D. APPLY
    // ------------------------------------------------
    // Move the vertex outward along its normal
    vec3 finalPos = mixedPosition + (mixedNormal * displacement);
    vNoise = noise1;

    vNormal = normalize(normalMatrix * mixedNormal); // Update normal for fragment shader
    vPositionNormal = normalize((modelViewMatrix * vec4(finalPos, 1.0)).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
}
`;
export const fragmentShaderMorph = `
            uniform float uProgress;
            // uniform vec3 uColorA;
            // uniform vec3 uColorB;
            
            varying vec2 vUv;
            varying vec3 vNormal;
            varying float vNoise;
            
            vec3 uColorA = vec3(1.0, 1.0, 0.0);
            vec3 uColorB = vec3(0.0, 0.0, 1.0);

void main() {
                // 1. Mix Base Colors
                vec3 finalColor = mix(uColorA, uColorB, uProgress);

                // 2. Add "Liquid" Highlight
                // We use the noise value from vertex shader to add subtle streaks
                float liquidIntensity = sin(uProgress * 3.14159);
    finalColor += vNoise * 0.1 * liquidIntensity;

                // 3. Fresnel Effect (Rim Light)
                // This makes the object look 3D and shiny
                vec3 viewDir = vec3(0.0, 0.0, 1.0); // Simplified view direction
                float fresnel = pow(1.0 - dot(vNormal, viewDir), 3.0);

                // Add a bright rim light that gets stronger during the morph
                vec3 rimColor = vec3(1.0, 1.0, 1.0);
    finalColor += rimColor * fresnel * (0.5 + liquidIntensity);

    gl_FragColor = vec4(finalColor, 1.0);
}
`

export function createOuterGlowMat(color, outerGlowStrength, outerGlowBorder, p, side = THREE.FrontSide, trackKey = '') {

    let glowMat = new THREE.ShaderMaterial({
        uniforms: {
            "outerGlowStrength": { type: "f", value: outerGlowStrength }, //glow strength

            "outerGlowBorder": { type: "f", value: outerGlowBorder }, //outer border
            "p": { type: "f", value: p },
            glowColor: { type: "c", value: new THREE.Color(color) }
        },
        vertexShader: vertexShaderGlow,
        fragmentShader: fragmentShaderOuterGlow,
        side: side,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false
        // fog: false,
        // wireframe:true
    });
    trackKey && trackKey()
    return glowMat
}
export function createInnerGlowMat(glowColor, glowPower, glowIntensity, trackKey = '') {
    trackKey && trackKey()
    return new THREE.ShaderMaterial({
        uniforms: {
            glowColor: { value: new THREE.Color(glowColor) },
            glowPower: { value: glowPower },
            glowIntensity: { value: glowIntensity }
        },
        vertexShader: vertexShaderGlow,
        fragmentShader: fragmentShaderInnerGlow,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
}
export function createInnerGlowMatSkinned(glowColor, glowPower, glowIntensity, trackKey = '') {
    trackKey && trackKey()
    return new THREE.ShaderMaterial({
        uniforms: {
            glowColor: { value: new THREE.Color(glowColor) },
            glowPower: { value: glowPower },
            glowIntensity: { value: glowIntensity }
        },
        vertexShader: vertexShaderGlowSkinned,
        fragmentShader: fragmentShaderInnerGlow,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        //    depthWrite: false

    });
}

export function createOuterGlowMatSkinned(color, outerGlowStrength, outerGlowBorder, p, side = THREE.FrontSide, trackKey = '') {

    let glowMat = new THREE.ShaderMaterial({
        uniforms: {
            "outerGlowStrength": { type: "f", value: outerGlowStrength }, //glow strength

            "outerGlowBorder": { type: "f", value: outerGlowBorder }, //outer border
            "p": { type: "f", value: p },
            glowColor: { type: "c", value: new THREE.Color(color) }
        },
        vertexShader: vertexShaderGlowSkinned,
        fragmentShader: fragmentShaderOuterGlow,
        side: side,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    trackKey && trackKey()
    return glowMat
}

// export { environments, nebulaHelixFS, mistFS, mosaicFS, particleFS, starFieldFS, stormFS, rainyGlassFS, moonLightFS, supernovaFS, vortexFS, forceFS}

export const vertexShaderGlowSkinnedCatching = `
varying vec3 vNormal;
varying vec3 vPositionNormal;

uniform vec3 catchPoint; // Target point for the catching effect
uniform float uprogress; // Progress for animation control (0.0 to 1.0)

#include <common>
    #include <skinning_pars_vertex>

    // Simple pseudo-random function based on vertex position
    float rand(vec3 pos) {
    return fract(sin(dot(pos, vec3(12.9898, 78.233, 45.5432))) * 43758.5453);
}

void main()
{
    // Essential skinning setup
    #include <skinbase_vertex>

        // Calculate skinned normal
        #include <beginnormal_vertex>
        #include <skinnormal_vertex>
        #include <defaultnormal_vertex>

        // Calculate skinned vertex position
        #include <begin_vertex>
        #include <skinning_vertex>

        vec3 skinnedPosition = transformed;

    // --- MODIFICATION START ---

    // 1. Convert the local skinned position to a world position
    vec4 worldPosition = modelMatrix * vec4(skinnedPosition, 1.0);

    // Calculate interpolation factor (this logic is unchanged)
    float speedVariation = 0.65 + rand(skinnedPosition) * 1.0;
    float t = clamp(uprogress * speedVariation, 0.0, 1.0);

    // 2. Linearly interpolate in WORLD SPACE
    vec3 newWorldPosition = mix(worldPosition.xyz, catchPoint, t);

    // 3. Convert the new world position back to model space for the projection
    transformed = (inverse(modelMatrix) * vec4(newWorldPosition, 1.0)).xyz;

    // --- MODIFICATION END ---

    // Apply projection after modifying the position
    #include <project_vertex>

        // Assign varyings for fragment shader
        vNormal = normalize(transformedNormal);
    vPositionNormal = normalize(mvPosition.xyz);
}
`;

export function createInnerGlowMatSkinnedCatching(glowColor, glowPower, glowIntensity, trackKey = '') {
    trackKey && trackKey()
    return new THREE.ShaderMaterial({
        uniforms: {
            glowColor: { value: new THREE.Color(glowColor) },
            glowPower: { value: glowPower },
            glowIntensity: { value: glowIntensity },
            uprogress: { value: 0.0 },
            catchPoint: { value: new THREE.Vector3() }, //-20.00, 8.78, -0.16
            // inverseModelMatrix: { value: new THREE.Matrix4() }

        },
        vertexShader: vertexShaderGlowSkinnedCatching,
        fragmentShader: fragmentShaderInnerGlow,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true

    });
}


export const goldInnerGlowMat = createInnerGlowMat("#FBC189", 1., 1);
goldInnerGlowMat.name = 'goldInner'

export const goldInnerGlowStrongMat = goldInnerGlowMat.clone()
// goldInnerGlowStrongMat.wireframe = true
export const goldOuterGlowMat = createOuterGlowMat("#FBC189", 1, 0.01, 6.5, THREE.FrontSide)
goldOuterGlowMat.name = 'goldOuter'
// export const 

export const vertexShaderOscillation = `
// Simplex 3D Noise 
// by Ian McEwan, Ashima Arts
vec4 permute(vec4 x){ return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){
    const vec2  C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  //  x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

    // Permutations
    i = mod(i, 289.0); 
  vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0 / 7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);    // mod(j,N)

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1),
        dot(p2, x2), dot(p3, x3)));
}


    uniform float iTime;
    uniform float uOscillationStrength;
    uniform float uIsOscillating;
    varying vec3 vNormal;
    varying vec3 vPositionNormal;

void main() {
    vNormal = normalize(normalMatrix * normal);

        // Fluid / Liquid Droplet Effect using Noise
        float time = iTime * 0.8; // Control speed

        // Base shape distortion (low frequency)
        float noise1 = snoise(position * 0.8 + vec3(time));

        // Detail distortion (higher frequency)
        float noise2 = snoise(position * 2.5 - vec3(time * 1.5));

        // Combine them
        float displacement = ((noise1 * 0.3) + (noise2 * 0.1)) * uOscillationStrength * uIsOscillating;

        // Apply to position along the normal
        vec3 newPos = position + normal * displacement;

    vPositionNormal = normalize((modelViewMatrix * vec4(newPos, 1.0)).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
}
`;

export function createOscillatingInnerGlowMat(glowColor, glowPower, glowIntensity, oscillationStrength = 1.0, isOscillating = 1.0) {
    return new THREE.ShaderMaterial({
        uniforms: {
            glowColor: { value: new THREE.Color(glowColor) },
            glowPower: { value: glowPower },
            glowIntensity: { value: glowIntensity },
            iTime: { value: 0 },
            uOscillationStrength: { value: oscillationStrength },
            uIsOscillating: { value: isOscillating }
        },
        vertexShader: vertexShaderOscillation,
        fragmentShader: fragmentShaderInnerGlow,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        polygonOffset: true,
        polygonOffsetFactor: -1.0,
        polygonOffsetUnits: -1.0
    });
}

export function createOscillatingOuterGlowMat(color, outerGlowStrength, outerGlowBorder, p, side = THREE.FrontSide, oscillationStrength = 1.0) {
    return new THREE.ShaderMaterial({
        uniforms: {
            "outerGlowStrength": { type: "f", value: outerGlowStrength },
            "outerGlowBorder": { type: "f", value: outerGlowBorder },
            "p": { type: "f", value: p },
            glowColor: { type: "c", value: new THREE.Color(color) },
            iTime: { value: 0 },
            uOscillationStrength: { value: oscillationStrength },
            uIsOscillating: { value: 1.0 }
        },
        vertexShader: vertexShaderOscillation,
        fragmentShader: fragmentShaderOuterGlow,
        side: side,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -2.0,
        polygonOffsetUnits: -2.0
    });
}

export function createMorphOscillatingInnerGlowMat(glowColor, glowPower, glowIntensity, oscillationStrength = 0.0, isOscillating = 0.0) {
    return new THREE.ShaderMaterial({
        uniforms: {
            glowColor: { value: new THREE.Color(glowColor) },
            glowPower: { value: glowPower },
            glowIntensity: { value: glowIntensity },
            iTime: { value: 0 },
            uOscillationStrength: { value: oscillationStrength },
            uIsOscillating: { value: isOscillating },
            uTransformProgress: { value: 0 },
        },
        vertexShader: vertexShaderMorphOscillate,
        fragmentShader: fragmentShaderInnerGlow,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1.0,
        polygonOffsetUnits: -1.0
    });
}

export function createMorphOscillatingOuterGlowMat(color, outerGlowStrength, outerGlowBorder, p, side = THREE.FrontSide, oscillationStrength = 1.0) {
    return new THREE.ShaderMaterial({
        uniforms: {
            "outerGlowStrength": { type: "f", value: outerGlowStrength },
            "outerGlowBorder": { type: "f", value: outerGlowBorder },
            "p": { type: "f", value: p },
            glowColor: { type: "c", value: new THREE.Color(color) },
            iTime: { value: 0 },
            uOscillationStrength: { value: oscillationStrength },
            uIsOscillating: { value: 1.0 },
            uTransformProgress: { value: 0 }
        },
        vertexShader: vertexShaderMorphOscillate,
        fragmentShader: fragmentShaderOuterGlow,
        side: side,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -2.0,
        polygonOffsetUnits: -2.0
    });
}


export function createMorphOscillatingLiquidGoldMat() {
    let mat = new THREE.ShaderMaterial({
        uniforms: {

            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2(100, 100) },
            uOscillationStrength: { value: 1. },
            uIsOscillating: { value: 1.0 },
            uTransformProgress: { value: 0 }
        },
        vertexShader: vertexShaderMorphOscillate,
        fragmentShader: liquidGoldFS,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: true
    });

    linkConstantUniforms(mat, ['iTime', 'iResolution', 'uTransformProgress', 'uIsOscillating', 'uOscillationStrength']);
    return mat
}

export const liquidGoldMat = createMorphOscillatingLiquidGoldMat();

export const fragmentShaderBitcoin = `
uniform vec3 glowColor;
uniform float glowIntensity;
uniform float glowPower;
varying vec3 vNormal;
varying vec3 vPositionNormal;

void main()
{
    // Fix: Use simple dot product. 
    // Surfaces facing camera (dot ~ 1) will be dimmer if we want edge glow.
    // Surfaces facing away (dot < 0) should be culled or handled.
    
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vPositionNormal); // This is actually View Position in camera space, so ViewDir is -vPositionNormal

    // In Camera space, the camera is at (0,0,0) and looks down -Z. 
    // vPositionNormal coming from vertex shader: normalize((modelViewMatrix * vec4(position, 1.0)).xyz)
    // This vector points FROM camera TO vertex. 
    // So typical viewDir (Vertex to Eye) is -vPositionNormal.

    // Fresnel = 1 - dot(N, V). 
    // If dot(N, V) is 1 (facing), fresnel is 0 (center transparent).
    // If dot(N, V) is 0 (edge), fresnel is 1 (edge bright).
    
    float viewDot = dot(normal, -viewDir); // Standard N dot V
    float fresnel = 1.0 - clamp(viewDot, 0.0, 1.0); // Clamp to ignore backfaces if any
    
    float a = smoothstep(0.0, 1.0, pow(fresnel, glowPower)) * glowIntensity;

    // Add a base opacity so it's not fully transparent in the center?
    // User complaint: "faces which are not facing the camera are almost transparent" 
    // This implies they WANT back-faces or side-faces to be visible/handled differently.
    // If they want a solid gold coin with rim light, we should add base color.

    // Mix Base Gold Color with Glow
    vec3 baseColor = vec3(1.0, 0.84, 0.0); // Gold

    // Simple lighting for base
    float light = clamp(dot(normal, vec3(0.0, 1.0, 1.0)), 0.2, 1.0);

    // Combine: Base Color + Fresnel Glow
    vec3 finalColor = baseColor * light + (glowColor * a);

    // Force alpha to 1.0 because it's a solid coin, not a ghost
    gl_FragColor = vec4(finalColor, 1.0);
}
`

export function createBitcoinMat(glowColor, glowPower, glowIntensity, oscillationStrength = 1.0) {
    return new THREE.ShaderMaterial({
        uniforms: {
            glowColor: { value: new THREE.Color(glowColor) },
            innerlowPower: { value: glowPower },
            glowIntensity: { value: glowIntensity },
            iTime: { value: 0 },
            uOscillationStrength: { value: oscillationStrength },
            uIsOscillating: { value: 0.0 }
        },
        vertexShader: vertexShaderOscillation,
        fragmentShader: fragmentShaderBitcoin, // Use NEW shader
        side: THREE.FrontSide,
        blending: THREE.NormalBlending, // Solid object
        transparent: false,
        depthWrite: true
    });
}

export const goldOscillatingMat = createOscillatingInnerGlowMat("#FBC189", 1., 1., 1);
export const goldMorphOscillatingMat = createMorphOscillatingInnerGlowMat("#FBC189", 1., 1., 1);



export const goldOscillatingOuterGlowMat = createOscillatingOuterGlowMat("#FBC189", 1, 0.01, 6.5, THREE.FrontSide, 1)
export const goldMorphOscillatingOuterGlowMat = createMorphOscillatingOuterGlowMat("#FBC189", 1, 0.01, 6.5, THREE.FrontSide, 1)
export const bitcoinMat = createBitcoinMat("#FBC189", 1., 1., 0.1);


// export function createMorphOscillatingInnerGlowMat(constantUniform, glowColor, glowPower, glowIntensity, oscillationStrength = 1.0) {

export const lensflareFS = `
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License
// Modified: Static, Centered, and Fades out at edges.

varying vec2 vUv;
uniform vec3 iResolution;
uniform float iTime;

#define TileU 1.0
#define TileV 2.0
#define M_PI 3.141592

// Global Parameters
float globalSize = 1.0; 
float globalRotate = 0.0; 
float evolution = 1.0;

// Parameters
float coresize = 3.0; 
float rotation = 0.0; 
vec3 SunColor = vec3(0.3, 0.25, 0.45); 

float sun(vec2 uv, vec2 pos, float size)
{
    float rot = radians(rotation + globalRotate) * evolution;
    mat2 m = mat2(cos(rot), -sin(rot), sin(rot), cos(rot));
    uv = m * uv;
    pos = m * pos;
    
    vec2 vector = uv - pos;
    
    float dist = length(vector);
    dist = pow(dist, 0.1);
    
    float f0 = 1.0 / (length(uv - pos) * (1.0 / size * 100.0) / (coresize * globalSize));

    return f0 + f0;
}

vec2 polarCoordinates(vec2 uv) {
    float radius = length(uv);
    float angle = atan(uv.y, uv.x) / (2.0 * M_PI);

    radius *= TileU;
    angle *= TileV;
    
    vec2 polarUV = vec2(radius, angle);
    polarUV = mix(polarUV, uv, 0.01);
    return polarUV;
}

vec2 hash(vec2 p)
{
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(in vec2 p)
{
    const float K1 = 0.366025404;
    const float K2 = 0.211324865; 

    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    float m = step(a.y, a.x); 
    vec2 o = vec2(m, 1.0 - m);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
    return dot(n, vec3(70.0));
}

void main()
{
    // --- 1. Coordinate Setup ---
    // Use vUv for mesh-centered coordinates (0.5, 0.5 is center)
    vec2 uv = vUv - 0.5;

    // Normalized 0-1 coordinates for the Edge Fading calculation
    vec2 normUV = vUv;
    
    vec2 pos = vec2(0.0);

    // --- 2. Generate Flare ---
    vec2 pUV = polarCoordinates(uv);
    pUV.y *= 2.0;
    pUV.x *= 0.1;
    
    float f = 0.0;
    pUV *= 5.0;
    
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    f = 0.5000 * noise(pUV); pUV = m * pUV;
    f += 0.2500 * noise(pUV); pUV = m * pUV;
    f += 0.1250 * noise(pUV); pUV = m * pUV;
    f += 0.0625 * noise(pUV); pUV = m * pUV;

    f = 0.5 + 0.5 * f;
    
    float c = sun(uv, pos, 1.0);

    f *= c;
    f += c;
    
    vec3 col = vec3(f);
    col *= SunColor;

    // --- 3. Edge Fading (Vignette) ---
    // This creates a mask that is 1.0 in the center and 0.0 at the edges
    // We multiply distance from center x and center y.
    // 0.5 is the distance from center to edge in 0-1 UV space.

    // Option A: Circular Fade (Best for spherical flares)
    float dist = length(normUV - 0.5);
    // Smoothstep from radius 0.0 to 0.5. 
    // We want opacity 1 at center, 0 at edge (0.5).
    // I used 0.4 to 0.5 to make sure it fades completely BEFORE hitting the hard edge.
    float mask = 1.0 - smoothstep(0.3, 0.5, dist);

    col *= mask;

    gl_FragColor = vec4(col, 1.0);
}
`;


export const dragonEyeFireFS = `
    uniform vec2 iResolution;
    uniform float iTime;
    uniform vec2 uMouse;
    uniform vec2 uSmoothedMouse;
    uniform float uEyeOpenness; // 0.0 to 1.0
    uniform bool uEyeActive;  
    uniform float uOffsetY;
    uniform float uEyeAngle;
    uniform float uEyeScale;
    uniform vec2 uEyeFlameOffset;
    uniform vec2 uFlameScale;
    uniform vec2 uEyeScreenPosition;
    uniform float uDragonEyeAspect;

    varying vec2 vUv;

// ==========================================
// PART 1: DRAGON EYE GLOBALS & DEFINES
// ==========================================

#define TIME iTime
#define TTIME (2.0 * 3.141592654 * TIME)
#define RESOLUTION iResolution
#define PI 3.141592654
#define TAU (2.0 * PI)
#define ROT(a) mat2(cos(a), sin(a), -sin(a), cos(a))

#define LAYERS 6
#define FBM 3
#define DISTORT 1.4
#define PCOS(x)(0.5 + 0.5 * cos(x))

// --- Color Helpers ---
const vec4 hsv2rgb_K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 hsv2rgb(vec3 c) {
        vec3 p = abs(fract(c.xxx + hsv2rgb_K.xyz) * 6.0 - hsv2rgb_K.www);
    return c.z * mix(hsv2rgb_K.xxx, clamp(p - hsv2rgb_K.xxx, 0.0, 1.0), c.y);
}

    // --- Global Variables (Simulated) ---
    float g_psy_th = 0.0;
    float g_psy_hf = 0.0;
    vec2 g_psy_vx = vec2(0.0);
    vec2 g_psy_vy = vec2(0.0);
    vec2 g_psy_wx = vec2(0.0);
    vec2 g_psy_wy = vec2(0.0);

const vec3 lightPos1 = 100.0 * vec3(-1.3, 1.9, 2.0);
const vec3 lightPos2 = 100.0 * vec3(9.0, 3.2, 1.0);
const vec3 lightDir1 = normalize(lightPos1);
const vec3 lightDir2 = normalize(lightPos2);
const vec3 lightCol1 = vec3(8.0 / 8.0, 7.0 / 8.0, 6.0 / 8.0);
const vec3 lightCol2 = vec3(0.1 / 8.0, 0.075 / 8.0, 0.0875 / 8.0);
const vec3 skinCol1 = vec3(0.6, 0.2, 0.2);
const vec3 skinCol2 = vec3(0.6);

// ==========================================
// PART 2: FIRE HELPER FUNCTIONS
// ==========================================

#define FLAME_BASE_WIDTH .04

    float hash11(float p) {
    p = fract(p * .1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
}

    vec2 hash21(float p) {
        vec3 p3 = fract(vec3(p) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx + p3.yz) * p3.zy);
}

    float fire_noise(float r, float x, const float n) {
    r *= 1337.;
        float fl = floor(n * x);
        float noise0 = hash11(r + fl);
        float noise1 = hash11(r + fl + 1.);
        float t = fract(n * x);
return mix(noise0, noise1, t);
    }

    float fire_line(vec2 uv) {
        float center = .1 * (fire_noise(1., uv.y, 5.)
        + .8 * fire_noise(2., uv.y, 10.) - .9);
        float width = FLAME_BASE_WIDTH
        + .04 * (fire_noise(3., uv.y, 5.)
            + .8 * fire_noise(4., uv.y, 10.));    
        
        float d = abs(uv.x - center);
    return 1. - smoothstep(width * 0.7, width, d);
}

    vec2 fire_rot(vec2 uv, float a) {
        float c = cos(a);
        float s = sin(a);
    return uv * mat2(c, -s, s, c);
}

    float flame(vec2 uv, float spread, float p) {
        float shift = p + iTime;
    return fire_line(fire_rot(uv, 3.14 - spread) + vec2(0., shift))
        * fire_line(fire_rot(uv, 3.14 + spread) + vec2(0., shift));
}

    vec3 fire_color_func(float x, float blend) {
        vec3 redFire = vec3(1., 0., 0.) * x
        + vec3(1., 1., 0.) * clamp(x - .5, 0., 1.)
        + vec3(1., 1., 1.) * clamp(x - .7, 0., 1.);
                     
        vec3 blueFire = vec3(0.1, 0.1, 1.0) * x
        + vec3(0.0, 1.0, 0.5) * clamp(x - .5, 0., 1.)
        + vec3(1.0, 1.0, 1.0) * clamp(x - .7, 0., 1.);

    return mix(redFire, blueFire, blend);
}

    vec3 particle_color(float t, float blend) {
        float heat = 0.5 + 0.5 * t;
    return fire_color_func(heat, blend);
}

    // ==========================================
    // PART 3: DRAGON EYE HELPER FUNCTIONS
    // ==========================================

    float tanh_approx(float x) {
        float x2 = x * x;
    return clamp(x * (27.0 + x2) / (27.0 + 9.0 * x2), -1.0, 1.0);
}

    float pmin(float a, float b, float k) {
        float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

    float pmax(float a, float b, float k) { return -pmin(-a, -b, k); }
    float pabs(float a, float k) { return pmax(a, -a, k); }

    vec2 toPolar(vec2 p) { return vec2(length(p), atan(p.y, p.x)); }
    vec2 toRect(vec2 p) { return vec2(p.x * cos(p.y), p.x * sin(p.y)); }

    float modMirror1(inout float p, float size) {
        float halfsize = size * 0.5;
        float c = floor((p + halfsize) / size);
    p = mod(p + halfsize, size) - halfsize;
    p *= mod(c, 2.0) * 2.0 - 1.0;
    return c;
}

    float smoothKaleidoscope(inout vec2 p, float sm, float rep) {
        vec2 hp = p;
        vec2 hpp = toPolar(hp);
        float rn = modMirror1(hpp.y, TAU / rep);
        float sa = PI / rep - pabs(PI / rep - abs(hpp.y), sm);
    hpp.y = sign(hpp.y) * (sa);
    hp = toRect(hpp);
    p = hp;
    return rn;
}

    float vesica(vec2 p, vec2 sz) {
    sz = max(sz, vec2(0.001));
    if (sz.x < sz.y) { sz = sz.yx; } else { p = p.yx; }
        vec2 sz2 = sz * sz;
        float d = (sz2.x - sz2.y) / (2.0 * sz.y);
        float r = sqrt(sz2.x + d * d);
        float b = sz.x;
    p = abs(p);
    return ((p.y - b) * d > p.x * b) ? length(p - vec2(0.0, b))
        : length(p - vec2(-d, 0.0)) - r;
}

    float raySphere(vec3 ro, vec3 rd, vec4 sph) {
        vec3 oc = ro - sph.xyz;
        float b = dot(oc, rd);
        float c = dot(oc, oc) - sph.w * sph.w;
        float h = b * b - c;
    if (h < 0.0) return -1.0;
    h = sqrt(h);
    return -b - h;
}

    // --- Shape Functions ---
    float outer(vec2 p, float uEyeOpenness) {
    p *= ROT(uEyeAngle);
        vec2 sz = vec2(0.5, 0.25 * uEyeOpenness);
    return vesica(p, sz) - (0.15 * uEyeOpenness);
}

    float inner(vec2 p, float uEyeOpenness) {
    p *= ROT(uEyeAngle);
        vec2 sz = vec2(0.125 * uEyeOpenness, 0.35);
    return vesica(p, sz);
}

    float qc_wave(float theta, vec2 p) {
    return (cos(dot(p, vec2(cos(theta), sin(theta)))));
}

    float qc_noise(vec2 p) {
        float sum = 0.;
        float a = 1.0;
    for (int i = 0; i < LAYERS; ++i) {
            float theta = float(i) * PI / float(LAYERS);
        sum += qc_wave(theta, p) * a;
        a *= DISTORT;
    }
    return abs(tanh_approx(sum));
}

    float qc_fbm(vec2 p, float time) {
        float sum = 0.;
        float a = 1.0;
        float f = 1.0;
    for (int i = 0; i < FBM; ++i) {
        sum += a * qc_noise(p * f);
        a *= 2.0 / 3.0;
        f *= 2.31;
    }
    return 0.45 * (sum);
}

    float qc_height(vec2 p, float uEyeOpenness) {
        float od = outer(p, uEyeOpenness);
        float l = length(p);
    const float s = 5.0;
    p *= s;
        float sm = 0.05;
    const float falloff = 4.0; 
        float oh = smoothstep(0.0, sm, od);
        float h = -5.0 * qc_fbm(p, TIME) * exp(-falloff * l) * oh;
    return h;
}

    vec3 qc_normal(vec2 p, float uEyeOpenness) {
        vec2 e = vec2(4.0 / RESOLUTION.y, 0);
        vec3 n;
    n.x = qc_height(p + e.xy, uEyeOpenness) - qc_height(p - e.xy, uEyeOpenness);
    n.y = 2.0 * e.x;
    n.z = qc_height(p + e.yx, uEyeOpenness) - qc_height(p - e.yx, uEyeOpenness);
    return normalize(n);
}

    float psy_noise(vec2 p) {
        float a = sin(p.x);
        float b = sin(p.y);
        float c = 0.5 + 0.5 * cos(p.x + p.y);
        float d = mix(a, b, c);
    return d;
}

    float psy_fbm(vec2 p, float aa) {
    const mat2 frot = mat2(0.80, 0.60, -0.60, 0.80);
        float f = 0.0;
        float a = 1.0;
        float s = 0.0;
        float m = 2.0;
    for (int x = 0; x < 4; ++x) {
        f += a * psy_noise(p);
        p = frot * p * m;
        m += 0.01;
        s += a;
        a *= aa;
    }
    return f / s;
}

    float psy_warp(vec2 p, out vec2 v, out vec2 w, float uEyeOpenness, float blendFactor) {
        vec2 offsetMouse = uSmoothedMouse - uEyeScreenPosition;
        vec2 mouse = vec2(-offsetMouse.x, offsetMouse.y);
        
        float lm = length(mouse);
        vec2 pupilPos = vec2(0.0);
    const float maxPupilDist = 0.15;
    if (lm > 0.001) {
        pupilPos = (mouse / lm) * min(lm, maxPupilDist);
    }
    p -= pupilPos;

        float id = inner(p, uEyeOpenness);
        float f = smoothstep(-0.1, 0.15, id);
    const float rep = 50.0;
    const float sm = 0.125 * 0.5 * 60.0 / rep;
        float n = smoothKaleidoscope(p, sm, rep);
    p.y += TIME * 0.125 + 1.5 * g_psy_th;
    g_psy_hf = f;
        vec2 vx = g_psy_vx; vec2 vy = g_psy_vy;
        vec2 wx = g_psy_wx; vec2 wy = g_psy_wy;
        float aa = 0.5;
    v = vec2(psy_fbm(p + vx, aa), psy_fbm(p + vy, aa)) * f;
    w = vec2(psy_fbm(p + 3.0 * v + wx, aa), psy_fbm(p + 3.0 * v + wy, aa)) * f;

    return -tanh_approx(psy_fbm(p + 2.25 * w, aa) * f);
}

    vec3 psy_normal(vec2 p, float uEyeOpenness, float blendFactor) {
        vec2 v; vec2 w;
        vec2 e = vec2(4.0 / RESOLUTION.y, 0);
        vec3 n;
    n.x = psy_warp(p + e.xy, v, w, uEyeOpenness, blendFactor) - psy_warp(p - e.xy, v, w, uEyeOpenness, blendFactor);
    n.y = 2.0 * e.x;
    n.z = psy_warp(p + e.yx, v, w, uEyeOpenness, blendFactor) - psy_warp(p - e.yx, v, w, uEyeOpenness, blendFactor);
    return normalize(n);
}

    vec3 psy_weird(vec2 p, float uEyeOpenness, float blendFactor) {
        vec2 v; vec2 w;
        float h = psy_warp(p, v, w, uEyeOpenness, blendFactor);
        float hf = g_psy_hf;
        vec3 n = psy_normal(p, uEyeOpenness, blendFactor);
        vec3 ro = vec3(0.0, 10.0, 0.0);
        vec3 po = vec3(p.x, 0.0, p.y);
        vec3 rd = normalize(po - ro);
        
        vec3 ref = reflect(rd, n);
        float ref1 = max(dot(ref, lightDir1), 0.0);
        float ref2 = max(dot(ref, lightDir2), 0.0);
        
        vec3 fireTint = fire_color_func(0.95, blendFactor); 
        
        float a = length(p);
        vec3 col = vec3(0.0);

        float pattern = tanh_approx(0.1 + abs(v.y - w.y));
    col += fireTint * pattern * 1.5;

    col -= 0.5 * (length(v) + length(w)) * 0.2;

    col += 0.5 * lightCol1 * pow(ref1, 20.0);
    col += 0.01 * lightCol2 * pow(ref2, 10.0);
    col *= hf;
    return max(col, 0.0);
}

    float vmax(vec2 v) { return max(v.x, v.y); }

    float corner(vec2 p) {
    return length(max(p, vec2(0))) + vmax(min(p, vec2(0)));
}

    vec3 skyColor(vec3 ro, vec3 rd) {
        float ld1 = max(dot(lightDir1, rd), 0.0);
        float ld2 = max(dot(lightDir2, rd), 0.0);
        vec3 final = vec3(0.0);
    rd.xy *= ROT(-1.);
        vec2 bp = rd.xz / max(0.0, rd.y);
        float bd = corner(-bp);
    final += 0.05 * exp(-5.0 * max(bd, 0.0));
    final += 0.01 * smoothstep(0.025, 0.0, bd);
    final += 8.0 * lightCol1 * pow(ld1, 100.0);
    final += 0.5 * lightCol2 * pow(ld2, 100.0);
    return final;
}

    vec3 eyeColor(vec2 p, vec3 ro, vec3 rd, vec3 po, float od, float uEyeOpenness, float blendFactor) {
        vec3 sc = vec3(0.0);
        float sd = raySphere(ro, rd, vec4(sc, 0.75));
        vec3 spos = ro + sd * rd;
        vec3 snor = normalize(spos - sc);
        vec3 refl = reflect(rd, snor);
        vec3 scol = skyColor(spos, refl);
        float dif1 = max(dot(snor, lightDir1), 0.0);
        float dif2 = max(dot(snor, lightDir2), 0.0);
        
        vec3 pcol = psy_weird(p, uEyeOpenness, blendFactor);
        
        vec3 col1 = pcol + 0.25 * scol + 0.025 * (dif1 * dif1 + dif2 * dif2);
        vec3 col2 = 0.125 * (skinCol1) * (dif1 + dif2) + 0.125 * sqrt(scol);
    snor.xz *= ROT(-0.5 * uEyeAngle);
    snor.xy *= ROT(2.4 * smoothstep(0.99, 1.0, sin(TTIME / 12.0)));
        float a = atan(snor.y, snor.x);
        vec3 col = mix(col1, col2, step(a, 0.0));
    col *= smoothstep(0.0, -0.1, od);
    return col;
}

    vec3 skinColor(vec2 p, vec3 ro, vec3 rd, vec3 po, float od, float uEyeOpenness) {
        float qch = qc_height(p, uEyeOpenness);
        vec3 qcn = qc_normal(p, uEyeOpenness);
        float diff1 = max(dot(qcn, lightDir1), 0.0);
        float diff2 = max(dot(qcn, lightDir2), 0.0);
        vec3 ref = reflect(rd, qcn);
        vec3 scol = skyColor(po, ref);
        vec3 dm = mix(1.0 * skinCol1, skinCol2,
    1.0 + tanh_approx(2.0 * qch)) * tanh_approx(-qch * 10.0 + 0.125);
        vec3 col = vec3(0.0);
    col += dm * sqrt(diff1) * (0.25 * lightCol1);
    col += dm * sqrt(diff2) * (0.0625 * lightCol2);
    const float ff = 0.3;
        float f = ff * exp(-8.0 * od);
    col *= f;
    col += 0.1 * ff * sqrt(scol);
    col -= (1.0 - tanh_approx(10.0 * -qch)) * f;
    col *= smoothstep(0.0, 0.025, od);

    // --- NEW: Force Fade Out ---
    col *= smoothstep(0.8, 0.2, od);

    return col;
}

void compute_globals() {
        vec2 vx = vec2(0.0, 0.0); vec2 vy = vec2(3.2, 1.3);
        vec2 wx = vec2(1.7, 9.2); vec2 wy = vec2(8.3, 2.8);
    vx *= ROT(TTIME / 1000.0); vy *= ROT(TTIME / 900.0);
    wx *= ROT(TTIME / 800.0); wy *= ROT(TTIME / 700.0);
    g_psy_vx = vx; g_psy_vy = vy;
    g_psy_wx = wx; g_psy_wy = wy;
}

    vec3 color(vec2 p, float uEyeOpenness, float blendFactor) {
    compute_globals();
        float od = outer(p, uEyeOpenness);
        vec3 ro = vec3(0.0, 10.0, 0.0);
        vec3 po = vec3(p.x, 0.0, p.y);
        vec3 rd = normalize(po - ro);

    return od > 0.0 ? skinColor(p, ro, rd, po, od, uEyeOpenness)
        : eyeColor(p, ro, rd, po, od, uEyeOpenness, blendFactor);
}

    vec3 postProcess(vec3 col, vec2 q) {
    col = clamp(col, 0.0, 1.0);
    col = pow(col, 1.0 / vec3(2.2));
    col = col * 0.6 + 0.4 * col * col * (3.0 - 2.0 * col);
    col = mix(col, vec3(dot(col, vec3(0.33))), -0.4);
    col *= 0.5 + 0.5 * pow(19.0 * q.x * q.y * (1.0 - q.x) * (1.0 - q.y), 0.7);
    return col;
}

void main() {
    if (!uEyeActive) {
        gl_FragColor = vec4(0.0);
        return;
    }

        float blendFactor = 0.5 + 0.5 * sin(iTime * 0.5);

        // --- 1. EYE RENDERING ---
        vec2 q = vUv;
        q.y += uOffsetY; // Add vertical offset

        vec2 p = -1. + 2. * q;
    p.x *= uDragonEyeAspect; // Aspect correction

    // Position Eye
    p += uEyeFlameOffset;
    p *= 1.0 / uEyeScale;
        
        vec3 col = color(p, uEyeOpenness, blendFactor);
    col *= smoothstep(0.0, 1.0, uEyeOpenness);
    col = postProcess(col, q);

        // --- 2. FIRE & SPARKS RENDERING ---
        vec2 uvBase = (q * 2.0 - 1.0);
    uvBase.x *= uDragonEyeAspect;

    uvBase += uEyeFlameOffset;
    uvBase.x -= 0.07;

        // A. Fire Flames
        vec2 uvFire = uvBase;
    uvFire.y -= 0.5; 
        
        float dynamicScale = mix(15.0, 2.0, uEyeOpenness);
    uvFire *= 2. * dynamicScale / 1.35 * uFlameScale;

        // B. Sparks
        vec2 uvParticles = uvBase;
        vec3 particleCol = vec3(0.);
        float time = iTime * .5;
    for (int i = 0; i < 30; i++) {
            float sd = time + float(i) * 3303.1031;
            float id = floor(sd);
            float t = fract(sd);
            float rnd = hash11(id);
            vec2 vp = hash21(id);
        vp.y *= -t * (rnd + .5) - .5;
        vp.x *= (rnd > .5) ? -1. : 1.;
            float size = rnd * .0075 + .00025;
            float cycle = rnd * 8.;
            float w = vp.x * .3 - vp.x * vp.y * .45;
            float x_offset = cos(sd * cycle - t * 2.) * w;
            float d = size / length(uvParticles + vec2(x_offset, vp.y));
        particleCol += particle_color(rnd, blendFactor) * d;
    }

        // Calculate Flames
        float fire_intensity = 0.;
    const int fire_n = 10;
    for (int i = 0; i < fire_n; ++i) {
            float t = float(i) / float(fire_n) - .5;
            float y_off = .08 + .1 * t;
            float spread = .15 + .1 * t;
        fire_intensity += flame(uvFire + vec2(0., y_off), spread, 273. * float(i));
    }
        vec3 finalFire = fire_color_func(2. * fire_intensity / float(fire_n), blendFactor);
        vec3 finalParticles = pow(particleCol, vec3(1.9));

    finalFire *= uEyeOpenness * 1.5;
    finalParticles *= uEyeOpenness;

        // --- 3. COMBINE ---
        vec3 finalCol = col + finalFire + finalParticles;

        // --- 4. EDGE FADE / VIGNETTE ---
        // Smoothly fade out near the edges of the quad (UV 0 and 1)
        float edgeX = smoothstep(0.0, 0.1, vUv.x) * (1.0 - smoothstep(0.9, 1.0, vUv.x));
        float edgeY = smoothstep(0.0, 0.1, vUv.y) * (1.0 - smoothstep(0.9, 1.0, vUv.y));
        float vignette = edgeX * edgeY;

    // Apply fade
    finalCol *= vignette;

    gl_FragColor = vec4(finalCol, 1.0);
}




`;
export const pulseFS = `
uniform float iTime;
uniform vec3 iResolution;
uniform float uAspect; // Optional: To keep it circular if plane isn't square
varying vec2 vUv;

vec3 hsb2rgb(in vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0),
    6.0) - 3.0) - 1.0,
    0.0,
    1.0);
    rgb = rgb * rgb * (3.0 - 2.0 * rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

uniform float uClickTime;

// 3D-ish Pulse Effect
// 1. Chromatic Aberration (RGB split)
// 2. Electric Noise (Lightning arcs)
// 3. Shockwave Distortion (Fake refraction)

// Simple Hash for Noise
float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
}

// Value Noise
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i + vec2(0.0, 0.0));
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// FBM for Electric look
float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.6;
    for (int i = 0; i < 4; i++) {
        v += noise(p) * amp;
        p *= 2.1;
        amp *= 0.5;
    }
    return v;
}

void main() {
    // OBJECT SPACE coords: -1.0 to 1.0
    vec2 p = -1.0 + 2.0 * vUv;
    p.x *= uAspect; 

    float dist = length(p);
    float angle = atan(p.y, p.x);

    // --- PARAMS ---
    // Object is 3x smaller, so we adjust speed to be visually similar duration/travel
    float speed = 5.0; 
    float maxRadius = 1.5; // Reduced to ~60% of 2.5
    float age = iTime - uClickTime;

    if (age < 0.0) { gl_FragColor = vec4(0.0); return; }

    // Acceleration
    float radius = (age * speed) + (10.0 * age * age);

    if (radius > maxRadius) { gl_FragColor = vec4(0.0); return; }

    // --- ELECTRIC DISTORTION (Domain Warping) ---
    // Scale noise UP 
    float noiseVal = fbm(vec2(angle * 6.0, dist * 2.0 - age * 5.0));

    // Distort the distance check
    float distortedDist = dist - (noiseVal * 0.15);

    // --- MAIN SHOCKWAVE ---
    float distDiff = radius - distortedDist;

    // Ahead of wave (taking noise into account)
    if (distDiff < 0.0) { gl_FragColor = vec4(0.0); return; }

    // Thicken the wave significantly since the mesh is small
    float waveWidth = 1.2; // Massive width
    float t = distDiff / waveWidth;

    if (t > 1.0) { gl_FragColor = vec4(0.0); return; }

    // --- COLOR GRADIENT ---
    // t=0 is Front (Shock), t=1 is Tail

    // Front: Hot White/Yellow
    // Mid: Orange Energy
    // Tail: Deep Red
    
    vec3 colFront = vec3(1.0, 1.0, 0.8); // White-Yellow
    vec3 colMid = vec3(1.0, 0.4, 0.0); // Orange
    vec3 colTail = vec3(0.5, 0.0, 0.0); // Deep Red
    
    vec3 color = colFront;

    // Mix based on t
    // Sharp transition from Front to Mid
    float tMid = smoothstep(0.0, 0.3, t);
    color = mix(colFront, colMid, tMid);

    // Smooth transition from Mid to Tail
    float tTail = smoothstep(0.3, 1.0, t);
    color = mix(color, colTail, tTail);

    // --- INTENSITY & ALPHA ---
    // Sharp attack, exponential decay
    float intensity = pow(1.0 - t, 2.0);

    // Add "sparks" inside the trail
    float sparkNoise = hash(p * 50.0 + age);
    if (sparkNoise > 0.95) intensity += 0.5;

    // Global Fade
    // Start fading later to keep it "big" (relative to 1.5)
    float fade = 1.0 - smoothstep(0.8, maxRadius, radius);
    fade = pow(fade, 4.0); // Moderate falloff

    // Add glow
    // Alpha higher at front
    float alpha = intensity * fade;

    // Ensure it's not "washed out" - Pre-multiply alpha effectiveness
    // or just output vivid colors

    gl_FragColor = vec4(color, alpha);
}
`;

export const voronoiGridFS = `
uniform float iTime;
uniform vec3 iResolution;

vec2 rand2(in vec2 p) {
    return fract(vec2(sin(p.x * 591.32 + p.y * 154.077),
        cos(p.x * 391.32 + p.y * 49.077)));
}

float voronoi(in vec2 x) {
  vec2 p = floor(x);
  vec2 f = fract(x);
  float minDistance = 1.;

    for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
      vec2 b = vec2(i, j);
      // Animation Speed increased: iTime * 12.0 (Back to 1x base)
      vec2 rand = .5 + .5 * sin(iTime * 12. + 12. * rand2(p + b));
      vec2 r = vec2(b) - f + rand;
            minDistance = min(minDistance, length(r));
        }
    }
    return minDistance;
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 uv = fragCoord / iResolution.xy;

    // Correct aspect ratio
    uv.x *= iResolution.x / iResolution.y;

  // Calculate Voronoi pattern (animated)
  float speed = 2.0;
  // Voronoi Flow (Right to Left)
  float val = pow(voronoi((uv + vec2(iTime * speed, 0.)) * 8.) * 1.25, 7.) * 2.;

  // Calculate Grid lines
  float gridLineThickness = 1.0 / iResolution.y;

  // Electric Wave: Fast moving scanline pulse (Right to Left)
  float waveSpeed = 20.0;
  float wave = smoothstep(0.0, 1.0, sin(uv.x * 5.0 + iTime * waveSpeed));
    // Make it sharp bands
    wave = pow(wave, 5.0);

  // Remove Distortion to fix "double line" artifact
  // vec2 gridUV = uv;
  // gridUV.y += wave * 0.005 * sin(iTime * 50.0);

  // Create the grid mask using original UV (No physical displacement)
  vec2 grid = step(mod(uv, .1), vec2(gridLineThickness));

  // Base Brightness from Voronoi
  float brightness = val * (grid.x + grid.y);

    // Add Electric Wave boost
    brightness += (grid.x + grid.y) * wave * 2.0;

  // Global Flicker (High Frequency)
  float flicker = 0.8 + 0.2 * sin(iTime * 60.0);
    brightness *= flicker;

  // Color: Pure Cyan (No White Shift)
  vec3 baseColor = vec3(0.0, 1.0, 1.0);
    // Removed mixing with hotColor (White) as requested
    // vec3 finalColor = mix(baseColor, hotColor, clamp(wave, 0.0, 1.0));

    // Output
    gl_FragColor = vec4(baseColor, brightness);
}
`;

// export const testGridFS = `
// uniform float iTime;
// uniform vec3 iResolution;

// mat2 rotate2D(float r) {
//     return mat2(cos(r), sin(r), -sin(r), cos(r));
// }

// vec4 HexGrid(vec2 uv, out vec2 id) {
//     uv *= mat2(1.1547, 0.0, -0.5773503, 1.0);
//     vec2 f = fract(uv);
//     float triid = 1.0;
//     if((f.x + f.y) > 1.0) {
//         f = 1.0 - f;
//         triid = -1.0;
//     }
//     vec2 co = step(f.yx, f) * step(1.0 - f.x - f.y, max(f.x, f.y));
//     id = floor(uv) + (triid < 0.0 ? 1.0 - co : co);
//     co = (f - co) * triid * mat2(0.866026, 0.0, 0.5, 1.0);    
//     uv = abs(co);
//     id *= inverse(mat2(1.1547, 0.0, -0.5773503, 1.0)); 
//     return vec4(0.5 - max(uv.y, abs(dot(vec2(0.866026, 0.5), uv))), length(co), co);
// }

// vec3 gridnoise(vec2 uv, float time) {
//     float t = time * 1.5;
//     vec2 n = vec2(0);
//     vec2 q = vec2(0);
//     vec2 p = uv;
//     float d = dot(p, p);
//     float S = 7.0;
//     float a = 0.0;
//     mat2 m = rotate2D(5.0); 
//     for (float j = 0.; j < 6.; j++) {
//         p *= m;
//         n *= m;
//         q = p * S + t * 0.55 + sin(t * 0.65 - d * 4.0) * 4.0 + j + a - n; 
//         a += dot(cos(q) / S, vec2(0.4));
//         n -= sin(q + q * 0.05);
//         S *= 1.4;
//         m = m * 1.01;
//     }
//     vec3 col = vec3(1.9, 2.8, 1.6) * ((a * 3.0) + 0.3) + a + a - d;
//     return col;
// }

// void main() {
//     vec2 fragCoord = gl_FragCoord.xy;
//     vec2 uv = (fragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

//     // Adapted Logic: Use iTime instead of texelFetch(iChannel0)
//     float animTime = iTime; 

//     // Use the smooth animTime for noise
//     vec3 col = gridnoise(uv, animTime);

//     // Rotation STOPPED (Commented out)
//     // uv *= rotate2D(animTime * 0.075);

//     vec3 finalcol = vec3(0.3);
//     // Cyan Lines
//     vec3 bordercol = vec3(0.0, 1.0, 1.0); 
//     vec2 id;

//     vec4 h = HexGrid(uv * 7.0, id);   

//     // Thinner lines: Reduce upper bound of smoothstep (e.g. 0.085 -> 0.03)
//     float vv = smoothstep(0.01, 0.03, h.x);
//     vv = vv * vv;
//     float xx = 1.0 - vv;

//     finalcol = xx * mix(bordercol, finalcol, vv); 
//     // Removed background color addition
// REMOVED dotaLogoFS because it is no longer used

export const bloodFS = `
varying vec2 vUv;
uniform float iTime;
uniform vec2 iResolution;
uniform sampler2D iChannelSprite;
uniform vec2 uSelectedSlot;  
uniform vec2 uSpriteSize;    
uniform vec2 uSpritePixels;
uniform float uIconScale;
uniform float uDarkness;
uniform float uAspect; // Added for ratio correction

void main() {
    // Correct Aspect Ratio before doing anything else
    vec2 p = vUv - 0.5;
    if (uAspect != 0.0) {
        p.x *= uAspect;
    }
    // Convert back to 0..1 range for texture lookup
    // BUT we want the texture to be square in the middle, so we need to be careful.
    // Actually, sprite logic usually expects 0..1 to map to the full image.
    // If we want the logo to be undistorted, we need to map the quad's rectangular UVs
    // to a square domain for the texture.
    
    vec2 squareUV = p + 0.5;
    
    // --- 1. Sprite Mapping Logic ---
    // Use vUv directly for standard texture mapping
    // We assume the plane itself has the correct aspect ratio for the sprite, 
    // OR we can correct it here if we had a uAspect uniform. 
    // For now, let's stick to standard UV mapping which should stretch WITH the plane 
    // rather than being screen-dependent.
    
    vec2 dota_centeredUV = (squareUV - 0.5) / max(0.001, uIconScale) + 0.5;
    dota_centeredUV.y = 1.0 - dota_centeredUV.y; // KTX2 Top-Left Flip
    
    // Bounds check
    if(dota_centeredUV.x < 0.0 || dota_centeredUV.x > 1.0 || dota_centeredUV.y < 0.0 || dota_centeredUV.y > 1.0) {
        discard;
    }

    vec2 dota_tileSize = 1.0 / vec2(uSpriteSize.y, uSpriteSize.x); 
    vec2 dota_pixelOffset = 0.5 / uSpritePixels; 
    float dota_offsetX = uSelectedSlot.y * dota_tileSize.x;
    float dota_offsetY = uSelectedSlot.x * dota_tileSize.y;
    vec2 dota_finalUV = dota_centeredUV * (dota_tileSize - dota_pixelOffset * 2.0) + vec2(dota_offsetX, dota_offsetY) + dota_pixelOffset;

    vec4 dota_tex = texture2D(iChannelSprite, dota_finalUV);
    float dota_mask = dota_tex.a;
    float dota_dist = dota_mask - 0.5;
    float dota_smoothing = fwidth(dota_dist);
    float dota_alpha = smoothstep(-dota_smoothing, dota_smoothing, dota_dist);

    if (dota_alpha < 0.01) discard;

    // --- 2. Blood Effect Logic ---
    // Blood effect should also be local to UV space to stay attached to the icon
    vec2 bloodP = 5.0 * (dota_centeredUV - 0.5);
    vec2 i = bloodP;
    float c = 0.0;
    float r = length(bloodP + vec2(sin(iTime), sin(iTime * 0.222 + 99.0)) * 1.5);
    float d = length(bloodP);
    float rot = d + iTime + bloodP.x * 0.15; 

    for (float n = 0.0; n < 2.0; n++) {
        bloodP *= mat2(cos(rot - sin(iTime / 4.0)), sin(rot), -sin(cos(rot) - iTime), cos(rot)) * -0.15;
        float t = r - iTime / (n + 1.5);
        i -= bloodP + vec2(cos(t - i.x - r) + sin(t + i.y), sin(t - i.y) + cos(t + i.x) + r);
        c += 1.0 / length(vec2((sin(i.x + t) / 0.15), (cos(i.y + t) / 0.15)));
    }
    c /= 2.0;

    // --- COLOR MAPPING ---
    vec3 baseRed = vec3(0.35, 0.08, 0.04); 
    vec3 midTone = vec3(0.65, 0.20, 0.12);
    vec3 highlight = vec3(1.0, 0.9, 0.8);

    // We use the darkness variable to bias the intensity curve
    float intensity = clamp(c, 0.0, 1.0);
    float biasedIntensity = pow(intensity, uDarkness);
    
    // Smooth transition from the base color to the highlight
    vec3 col = mix(baseRed * 0.2, midTone, biasedIntensity);
    col = mix(col, highlight, pow(intensity, 8.0)); // Sharp white peaks
    
    // Final brightness boost to ensure waves stay visible
    col += baseRed * biasedIntensity * 1.5;

    gl_FragColor = vec4(col, dota_alpha);
}
`;

export const dotaAcceptFS = `
uniform vec2 iResolution;
uniform float iTime;
varying vec2 vUv;

// --- Constants & Macros ---
#define S smoothstep
#define P 3.14159265
#define HASHSCALE1 443.8975

const vec3 darkGreen   = vec3(0.0, 0.15, 0.05);
const vec3 bloodRed    = vec3(0.35, 0.0, 0.01);
const vec3 dialogBody  = vec3(0.03, 0.03, 0.03); 
const vec3 mutedGreen  = vec3(0.0, 0.3, 0.15); 
const vec3 highlightG  = vec3(0.0, 0.8, 0.4);   

// --- SDF Letter Segments ---

float line(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
}

// Segment-based characters with increased thickness for BOLD effect
float drawChar(vec2 p, int charIdx) {
    float d = 1.0;
    // Character bounds
    vec2 tl = vec2(-0.008, 0.012), tr = vec2(0.008, 0.012);
    vec2 ml = vec2(-0.008, 0.0),   mr = vec2(0.008, 0.0);
    vec2 bl = vec2(-0.008, -0.012), br = vec2(0.008, -0.012);
    
    // Character mapping
    if(charIdx==0) { d=min(d, line(p,bl,tl)); d=min(d, line(p,tl,tr)); d=min(d, line(p,tr,br)); d=min(d, line(p,ml,mr)); } // A
    if(charIdx==1) { d=min(d, line(p,tl,bl)); d=min(d, line(p,bl,br)); } // L
    if(charIdx==2) { d=min(d, line(p,bl,tl)); d=min(d, line(p,tl,tr)); d=min(d, line(p,tr,mr)); d=min(d, line(p,mr,ml)); } // P
    if(charIdx==3) { d=min(d, line(p,tl,tr)); d=min(d, line(p,vec2(0,0.012),vec2(0,-0.012))); d=min(d, line(p,bl,br)); } // I
    if(charIdx==4) { d=min(d, line(p,tr,tl)); d=min(d, line(p,tl,bl)); d=min(d, line(p,bl,br)); } // C
    if(charIdx==5) { d=min(d, line(p,tl,bl)); d=min(d, line(p,ml,tr)); d=min(d, line(p,ml,br)); } // K
    if(charIdx==6) { d=min(d, line(p,tr,tl)); d=min(d, line(p,tl,bl)); d=min(d, line(p,bl,br)); d=min(d, line(p,ml,mr)); } // E
    if(charIdx==7) { d=min(d, line(p,tl,tr)); d=min(d, line(p,vec2(0,0.012),vec2(0,-0.012))); } // T
    
    // Increased the second parameter of S (smoothstep) to make the stroke thicker (Bold)
    return S(0.005, 0.003, d); 
}

// --- Background & UI Shapes ---

float sdBox(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float hash13(vec3 p3) {
    p3 = fract(p3 * HASHSCALE1);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

mat2 r(float a) { return mat2(cos(a), -sin(a), sin(a), cos(a)); }

float m(vec2 u, float t, float o) {
    u *= r(t);
    return S(-P, P, sin(atan(u.x, u.y) * (0.5 + o * .125)) * u.y / u.x) * S(-0.125, 1.25, 1. - length(u * 0.85));
}

// --- Main ---

uniform float uAspect; // Optional: To keep it circular if plane isn't square

void main()
{
    // Use UV Space (-0.5 to 0.5) centered
    vec2 u = vUv - 0.5;
    
    // Correct Aspect Ratio (if provided via uniform, otherwise assume square UVs)
    // If uAspect > 1.0 (Landscape), we scale X. If < 1.0 (Portrait), we scale Y inverse.
    // Standard approach: Keep vertical fixed (-0.5 to 0.5) and stretch horizontal.
    if (uAspect != 0.0) {
        u.x *= uAspect;
    }
    
    float t = iTime * .5;
    u *= 2.0; // Scale up to match previous -1..1 range approx
    
    // 1. BACKGROUND
    vec3 bgCol = mix(darkGreen, bloodRed, sin(t + length(u)) * .5 + .5) * 0.2;
    float no = hash13(vec3(u, t * 0.000001)) * 0.5;
    for(float i = 0.; i < 11.0; i++){
        float s = i / 11.0 * P * 2.;
        float b = sin(t + s) * no * 0.0125; 
        vec2 o = vec2(cos(t + s * 4.) * (.25 + b), sin(t + s * 4.) * (.25 + b));
        bgCol += (m(u + o, no * 0.125, no) * mix(bloodRed, darkGreen, pow(sin(s * 32. + t) * .5 + .5, 1.25)));
    }
    bgCol /= 2.5;

    // 2. DIALOG
    vec2 dSize = vec2(0.48, 0.15); 
    float d = sdBox(u, dSize);
    vec3 finalCol = bgCol + highlightG * S(0.12, 0.0, d) * 0.12; 

    if (d < 0.0) {
        float splitY = dSize.y - (dSize.y * 2.0 * 0.25);
        vec3 uiCol;
        
        if (u.y > splitY) {
            uiCol = vec3(0.015);
            // Centering "ALL PICK"
            vec2 tp = u - vec2(-0.08, (splitY + dSize.y) * 0.5);
            float txt = 0.0;
            txt += drawChar(tp - vec2(-0.02, 0), 0); // A
            txt += drawChar(tp - vec2(0.008, 0), 1); // L
            txt += drawChar(tp - vec2(0.036, 0), 1); // L
            txt += drawChar(tp - vec2(0.08, 0), 2);  // P
            txt += drawChar(tp - vec2(0.108, 0), 3); // I
            txt += drawChar(tp - vec2(0.136, 0), 4); // C
            txt += drawChar(tp - vec2(0.164, 0), 5); // K
            uiCol = mix(uiCol, vec4(1).rgb, txt);
        } else {
            uiCol = dialogBody;
            float bCY = (splitY - dSize.y) * 0.5;
            vec2 bp = u - vec2(0.0, bCY); 
            float btn = sdBox(bp, vec2(0.12, 0.03));
            if (btn < 0.0) uiCol = mutedGreen;
            
            // "ACCEPT" on Button
            vec2 tp = bp - vec2(-0.07, 0);
            float txt = 0.0;
            txt += drawChar(tp - vec2(-0.01, 0), 0); // A
            txt += drawChar(tp - vec2(0.018, 0), 4); // C
            txt += drawChar(tp - vec2(0.046, 0), 4); // C
            txt += drawChar(tp - vec2(0.074, 0), 6); // E
            txt += drawChar(tp - vec2(0.102, 0), 2); // P
            txt += drawChar(tp - vec2(0.130, 0), 7); // T
            uiCol = mix(uiCol, vec4(1).rgb, txt);
            uiCol += mutedGreen * S(0.08, 0.0, btn) * 0.2;
        }
        finalCol = mix(finalCol, uiCol, 0.9);
        finalCol += highlightG * S(0.005, 0.0, abs(d)) * 0.4;
    }

    gl_FragColor = vec4(finalCol, 1.0);
}
`;
