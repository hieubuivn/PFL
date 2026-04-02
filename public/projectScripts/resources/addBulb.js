import * as THREE from 'three';
import * as CONSTANTS from '../utils/constant.js';
import { linkConstantUniforms } from '../utils/addConstantUniform.js';
import { BasicGeometries } from '../../configs/setupGeometries.js';
//import from constant.js

// import { groundVortexFS2 } from '../utils/constant.js';
import { MorphGeo } from '../utils/MorphGeo.js';

import { addLensflare } from './addLensflare.js';
import { resources } from '../resources/loadResources.js';


export function addBulb(scene) {
    const hub = scene.globalUniformsHub;
    const hubUniforms = hub ? hub.uniforms : {};
    const hubCore = hub ? hub.core : {};

    // --- REFACTORED MATERIALS TO USE HUB ---
    const bulbMat = new THREE.ShaderMaterial({
        uniforms: {
            glowColor: { value: new THREE.Color("#FBC189") },
            glowPower: { value: 1.0 },
            glowIntensity: { value: 1.0 },
            iTime: hubCore.iTime || { value: 0 },
            uOscillationStrength: hubUniforms.uOscillationStrength || { value: 1.0 },
            uIsOscillating: hubUniforms.uIsOscillating || { value: 0.0 },
            uTransformProgress: hubUniforms.uTransformProgress || { value: 0.0 },
        },
        vertexShader: CONSTANTS.vertexShaderMorphOscillate,
        fragmentShader: CONSTANTS.fragmentShaderInnerGlow,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        name: 'bulbInnerMat'
    });

    const bulbAuraMat = new THREE.ShaderMaterial({
        uniforms: {
            "outerGlowStrength": { value: 1.0 },
            "outerGlowBorder": { value: 0.01 },
            "p": { value: 6.5 },
            glowColor: { value: new THREE.Color("#FBC189") },
            iTime: hubCore.iTime || { value: 0 },
            uOscillationStrength: hubUniforms.uOscillationStrength || { value: 1.0 },
            uIsOscillating: hubUniforms.uIsOscillating || { value: 1.0 },
            uTransformProgress: hubUniforms.uTransformProgress || { value: 0.0 }
        },
        vertexShader: CONSTANTS.vertexShaderMorphOscillate,
        fragmentShader: CONSTANTS.fragmentShaderOuterGlow,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        name: 'bulbOuterGlowMat'
    });

    let btcSymbol = scene.getObjectByName("btc_symbol");
    // let bulbSample = scene.getObjectByName("bulbSample"); // no UV
    let bulbSample = scene.getObjectByName("cFanBulb"); // no UV

    let sphereSample = scene.getObjectByName("sphereSample");

    // Revert to using MorphGeo Class explicitly
    const bulbGeo = new MorphGeo([BasicGeometries.sphere, btcSymbol.geometry, bulbSample.geometry]);
    bulbGeo.setMorphInfo(0, 1);

    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    scene.add(bulb);

    bulb.position.set(-9.20, 9.6, -0.39);
    // bulb.rotation.x = -Math.PI / 2;
    // bulb.scale.setScalar(0); // CAUTION: Scaling parent to 0 breaks SpotLight Direction & Shadow Frustum!
    bulb.scale.setScalar(1);
    bulb.material.visible = false; // Hide mesh visually, but keep object active for Light
    bulb.name = "bulb";

    let bulbAura = new THREE.Mesh(bulb.geometry, bulbAuraMat);
    bulbAura.scale.setScalar(2);
    bulbAura.name = "bulbAura";
    bulbAura.visible = false; // Hide aura too
    bulb.add(bulbAura);

    // let fanBulb = scene.getObjectByName("cFanBulb");
    // let fanBulbAura = fanBulb.clone()
    // fanBulbAura.scale.setScalar(2);
    // fanBulbAura.name = "fanBulbAura";
    // fanBulbAura.visible = false; // Hide aura too
    // fanBulb.add(fanBulbAura);

    // Light
    // Light
    const bulbColor = new THREE.Color(0xffe0b2);
    const bulbIntensity = 0.001; // GHOST LIGHT: Keep at tiny intensity so shader is always compiled.
    const bulbDistance = 50; // Increased distance for spotlight reach

    // PERFORMANCE FIX: Use SpotLight instead of PointLight (1 shadow pass vs 6)
    const bulbLight = new THREE.SpotLight(bulbColor, bulbIntensity, bulbDistance, Math.PI / 3, 0.5, 2);
    bulbLight.name = "bulbLight";
    bulbLight.visible = true; // START VISIBLE (as ghost)
    bulb.add(bulbLight);

    // Aim down
    bulbLight.target.position.set(0, -10, 0); // Local down
    bulb.add(bulbLight.target); // Must add target to scene graph

    bulbLight.castShadow = true;
    bulbLight.shadow.mapSize.width = 256; // Reduced for huge performance gains, soft focus hides the resolution drop
    bulbLight.shadow.mapSize.height = 256;
    bulbLight.shadow.bias = -0.0005; // Slightly deeper bias to prevent artifacts at lower resolution
    bulbLight.shadow.focus = 1;

    scene.bulb = bulb;
    scene.bulbLight = bulbLight;

    // Lensflares
    // const lensflare = addLensflare(bulb, bulbColor);

    // lensflare.addElement(new LensflareElement(textureFlare0, 2100, 0, bulbColor));
    // lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
    // lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
    // lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
    // lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));

    // lensflare.position.copy(bulbLight.position);
    // bulb.add(lensflare);


    //add a plane to the bulb
    return bulb
}