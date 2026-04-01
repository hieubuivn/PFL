import * as THREE from 'three';
import { createShaderMat } from './adjustObjects.js';
import { linkConstantUniforms } from '../utils/addConstantUniform.js';

const knowhereVS = /* glsl */ `
    varying vec2 vUv;
    uniform float uScaleFactor;
    uniform vec2 uHudOffset;
 
    void main() {
        vUv = uv;
        
        // Spherical Billboarding
        float scaleX = length(vec3(modelMatrix[0][0], modelMatrix[0][1], modelMatrix[0][2]));
        float scaleY = length(vec3(modelMatrix[1][0], modelMatrix[1][1], modelMatrix[1][2]));
        
        vec4 mvPosition = viewMatrix * modelMatrix * vec4(0.0, 0.0, 0.0, 1.0);
        mvPosition.xy += position.xy * vec2(scaleX, scaleY) * uScaleFactor;
        
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const knowhereFS = /* glsl */ `
    uniform float iTime;
    uniform vec2 iResolution;
    uniform vec2 uMouse;
    uniform vec2 uStarScreenPos;
    varying vec2 vUv;

    void main() {
        vec2 p = vUv * 2.0 - 1.0;
        float starMask = length(p);
        
        // --- KNOWHERE STATE ---
        float kwTime = 5.0 * iTime;
        float iKw = .2, aKw;
        float distToMouse = length(uMouse - uStarScreenPos);
        float warp = 0.8 * exp(-distToMouse * 4.0);
        
        vec2 pKw = p / 0.8;
        pKw += (uMouse - uStarScreenPos) * warp * 1.2 * sin(kwTime * 3.0);
        
        vec2 dKw = vec2(-1, 1),
             bKw = pKw - iKw * dKw + (uMouse - uStarScreenPos) * warp,
             cKw = pKw * mat2(1, 1, dKw / (.1 + iKw / dot(bKw, bKw))),
             vKw = cKw * mat2(cos(.5 * log(aKw = dot(cKw, cKw)) + kwTime * iKw + vec4(0, 33, 11, 0))) / iKw;
        
        vec2 wKw = vec2(0.0);
        for (; iKw++ < 9.; wKw += 1. + sin(vKw)) vKw += .7 * sin(vKw.yx * iKw + kwTime) / iKw + .5;
        
        iKw = length( sin(vKw / .3) * .4 + cKw * (3. + dKw) );
        // Channel weights: R/G tightened for less orange, B lifted to -1.1 to keep teal edges
        vec4 O_Kw = 1. - exp( -exp( cKw.x * vec4(0.95, -.55, -1.1, 0) )
                       / wKw.xyyx / ( 2. + iKw * iKw / 4. - iKw )
                       / ( .5 + 1. / aKw ) / ( .03 + abs( length(pKw) - .7 ) ) );
        
        // Moderate vibrance: gentle lift away from grey (cool swirls stay cyan)
        float luma = dot(O_Kw.rgb, vec3(0.299, 0.587, 0.114));
        O_Kw.rgb = luma + (O_Kw.rgb - luma) * 1.5;
        O_Kw.rgb = clamp(O_Kw.rgb, 0.0, 1.0);
        
        // Archival Gold pull (#DCD0BA → linear: 0.863, 0.816, 0.729)
        // #DCD0BA is a *muted* parchment — bright zones desaturate toward it, not oversaturate
        vec3 archivalGold = vec3(0.863, 0.816, 0.729);
        float goldInfluence = smoothstep(0.3, 0.8, luma); // mid-to-bright areas only
        // First desaturate warm zones toward luma, then tint with gold ratios
        vec3 desatToGold = mix(vec3(luma), archivalGold * luma * 1.1, 0.75);
        O_Kw.rgb = mix(O_Kw.rgb, desatToGold, goldInfluence * 0.72);

        // Final Masking
        float edgeMask = 1.0 - smoothstep(0.9, 0.98, starMask);
        // Sharpen the alpha to remove white haze in the background
        float alpha = pow(O_Kw.a, 1.5) * edgeMask;
        vec4 finalColor = vec4(O_Kw.rgb, alpha);
        
        if (finalColor.a < 0.01) discard;

        gl_FragColor = finalColor;
    }
`;

export function addKnowhere(parent, scene) {
    if (!parent) {
        console.warn('[knowhere] Parent not found. Skipping.');
        return null;
    }

    const geometry = new THREE.PlaneGeometry(1, 1);

    const starMat = createShaderMat(scene, knowhereFS, {
        transparent: true,
        blending: THREE.NormalBlending,
        side: THREE.DoubleSide,
        depthTest: true,
        depthWrite: false,
        vs: knowhereVS
    });

    if (starMat.uniforms) {
        starMat.uniforms.uScaleFactor = { value: 0.00 };
        starMat.uniforms.uHudOffset = { value: new THREE.Vector2(0.0, 1.2) };
        starMat.uniforms.uStarScreenPos = { value: new THREE.Vector2(0.0, 0.0) };
    }

    const starMesh = new THREE.Mesh(geometry, starMat);
    starMesh.name = 'knowhere';
    starMesh.scale.set(10.0, 10.0, 1);
    starMesh.frustumCulled = false;

    parent.add(starMesh);
    scene.knowhere = starMesh;

    return starMesh;
}
