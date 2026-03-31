import * as THREE from 'three';
import TWEEN from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/tween.module.min.js';
import { updateDroneGaze } from '../scenario/scenarioUtility.js';
import { GLOBAL_COLORS } from '../configs/sceneConfig.js';

/**
 * Thinner, purely cyan holographic beam to distinguish from heavy interaction beams.
 */
export function createHologramBeam(scene, name, color) {
    const group = new THREE.Group();
    group.name = name;
    const beamColor = color || 0x00ffff;

    const createSegment = (name, radius, opacity, col) => {
        const geom = new THREE.CylinderGeometry(radius, radius, 1, 6, 1, true);
        geom.rotateX(Math.PI / 2);
        geom.translate(0, 0, 0.5);
        const mat = new THREE.MeshBasicMaterial({
            color: col,
            transparent: true,
            opacity: opacity,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geom, mat);
        mesh.name = name;
        return mesh;
    };

    group.add(createSegment('beam-core', 0.002, 1.0, 0xffffff)); // Sharp Core
    group.add(createSegment('beam-glow', 0.006, 0.5, beamColor)); // Soft Glow

    group.frustumCulled = false;
    return group;
}

/**
 * Creates a material for hologram pyramid faces with a Digital Bit-Grid effect.
 * Logic uses a staggered rectangular tiling to create a data-stream aesthetic.
 */
export function createHologramFaceMat(color) {
    return new THREE.ShaderMaterial({
        uniforms: {
            iTime: { value: 0 },
            uColor: { value: new THREE.Color(color) },
            uOpacity: { value: 0.15 },
            uBrightness: { value: 1.0 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float iTime;
            uniform vec3 uColor;
            uniform float uOpacity;
            uniform float uBrightness;
            varying vec2 vUv;

            #define R fract(43. * sin(dot(p, p)))

            void main() {
                // Digital Bit-Grid Logic
                vec2 i = vUv * 40.0; // Density
                vec2 j = fract(i);
                vec2 k = i - j;

                // Terminal-style "falling" staggered seed
                vec2 p = vec2(9.0, floor(iTime * (9.0 + 8.0 * sin(k.x)))) + k;
                
                float brightness = R;
                p *= j; // Modulate p for the block mask
                float mask = (R > 0.5 && j.x < 0.6 && j.y < 0.8) ? 1.0 : 0.0;
                
                // Edge fade & HUD style
                float fade = (1.0 - vUv.y);
                float finalAlpha = mask * uOpacity * fade;
                
                gl_FragColor = vec4(uColor * (brightness + 0.4) * uBrightness, finalAlpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    });
}

/**
 * Maps a DOM element's corner to a world position at a specific depth.
 */
export function projectDOMToWorld(scene, rect, corner, depth = 0.5) {
    const { camera, renderer } = scene;
    if (!camera || !renderer) return new THREE.Vector3();

    const cRect = renderer.domElement.getBoundingClientRect();

    let x, y;
    if (corner === 'TL') { x = rect.left; y = rect.top; }
    else if (corner === 'TR') { x = rect.right; y = rect.top; }
    else if (corner === 'BL') { x = rect.left; y = rect.bottom; }
    else if (corner === 'BR') { x = rect.right; y = rect.bottom; }
    else if (corner === 'ScanTop') { x = rect.left + rect.width / 2; y = rect.top; }
    else if (corner === 'ScanBot') { x = rect.left + rect.width / 2; y = rect.bottom; }

    const ndcX = (x - cRect.left) / cRect.width * 2 - 1;
    const ndcY = -(y - cRect.top) / cRect.height * 2 + 1;

    const vec = new THREE.Vector3(ndcX, ndcY, depth);
    vec.unproject(camera);
    return vec;
}

/**
 * Deploys the holographic pyramid and sweep triangle for a subtitle.
 */
export function deployHolographicSubtitle(scene, typingDuration = 2000) {
    const drone = scene.getObjectByName('drone');
    if (!drone) return;
    const eye = drone.getObjectByName('Sphere001_0');
    if (!eye) return;

    const subtitle = document.querySelector('#stat-subtitle.active');
    if (!subtitle) return;

    const rect = subtitle.getBoundingClientRect();
    const cyan = GLOBAL_COLORS.ELECTRIC_CYAN || 0x00ffff;

    // 0. SINGLETON GUARD: Clear ALL existing deployments to prevent ghosting
    let existing;
    while (existing = scene.getObjectByName('hologram-deployment')) {
        existing._isDead = true;
        scene.remove(existing);
        // Clean up children's resources
        existing.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
                else child.material.dispose();
            }
        });
    }

    const group = new THREE.Group();
    group.name = 'hologram-deployment';
    scene.add(group);

    const corners = { TL: new THREE.Vector3(), TR: new THREE.Vector3(), BL: new THREE.Vector3(), BR: new THREE.Vector3() };
    const eyePos = new THREE.Vector3();
    eye.getWorldPosition(eyePos);

    // 1. PYRAMID (Temporary Deployment Effect)
    const faceMat = createHologramFaceMat(cyan);
    const pyramidGeom = new THREE.BufferGeometry();
    const vertices = new Float32Array(36); // 4 faces * 3 pts * 3 coords
    const uvs = new Float32Array([0.5, 1, 0, 0, 1, 0, 0.5, 1, 0, 0, 1, 0, 0.5, 1, 0, 0, 1, 0, 0.5, 1, 0, 0, 1, 0]);
    pyramidGeom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    pyramidGeom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    const pyramidMesh = new THREE.Mesh(pyramidGeom, faceMat);
    group.add(pyramidMesh);

    const pyramidBeams = ['TL', 'TR', 'BL', 'BR'].map(key => ({
        beam: createHologramBeam(scene, `pyramid-beam-${key}`, cyan),
        key
    }));
    pyramidBeams.forEach(b => group.add(b.beam));

    // 2. SCANNER (Persistent until text is finished)
    const triangleGeom = new THREE.BufferGeometry();
    triangleGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(9), 3));
    const triMat = createHologramFaceMat(cyan);
    triMat.uniforms.uOpacity.value = 0.2;
    const triMesh = new THREE.Mesh(triangleGeom, triMat);
    group.add(triMesh);

    const triBeams = [createHologramBeam(scene, 'tri-beam-top', cyan), createHologramBeam(scene, 'tri-beam-bot', cyan)];
    triBeams.forEach(b => group.add(b));

    // Lifecycle Animation
    faceMat.uniforms.uOpacity.value = 0.8; // Initial flash
    new TWEEN.Tween(faceMat.uniforms.uOpacity)
        .to({ value: 0.15 }, 150)
        .delay(100)
        .start();

    // Auto-hide pyramid after duration
    let pyramidActive = true;
    setTimeout(() => {
        if (group._isDead) return;
        new TWEEN.Tween(faceMat.uniforms.uOpacity) // TARGET VALUE DIRECTLY
            .to({ value: 0 }, 800)
            .onUpdate(() => {
                const alpha = faceMat.uniforms.uOpacity.value;
                pyramidBeams.forEach(b => {
                    b.beam.children.forEach(c => {
                        c.material.opacity = alpha * (c.name === 'beam-core' ? 1.0 : 0.5);
                    });
                });
            })
            .onComplete(() => {
                pyramidActive = false;
                pyramidBeams.forEach(b => {
                    b.beam.visible = false;
                });
                pyramidMesh.visible = false;
            })
            .start();
    }, 1500);

    // Auto-hide scanner triangle after typing duration + dynamic buffer
    let scannerActive = true;
    setTimeout(() => {
        if (group._isDead) return;
        new TWEEN.Tween(triMat.uniforms.uOpacity)
            .to({ value: 0 }, 800)
            .onUpdate(() => {
                const alpha = triMat.uniforms.uOpacity.value;
                triBeams.forEach(b => {
                    b.children.forEach(c => {
                        c.material.opacity = alpha * (c.name === 'beam-core' ? 1.0 : 0.5);
                    });
                });
            })
            .onComplete(() => {
                scannerActive = false;
                triBeams.forEach(b => b.visible = false);
                triMesh.visible = false;
                // RELEASE DRONE GAZE
                if (scene.gazeFollower && scene.gazeFollower.isLocked) {
                    scene.gazeFollower.isLocked = false;
                }
            })
            .start();
    }, typingDuration + 200);

    const animate = (now) => {
        // Stop if subtitle closed OR a new deployment replaced this one
        if (!subtitle.classList.contains('active') || group._isDead) {
            if (scene.gazeFollower && scene.gazeFollower.isLocked) {
                scene.gazeFollower.isLocked = false;
            }
            scene.remove(group);
            return;
        }

        const rect = subtitle.getBoundingClientRect();
        eye.getWorldPosition(eyePos);

        // Update Scan Triangle (if active)
        if (scannerActive) {
            const scannerLine = subtitle.querySelector('.scanner-line');
            if (scannerLine) {
                const sRect = scannerLine.getBoundingClientRect();
                const top = projectDOMToWorld(scene, sRect, 'ScanTop');
                const bot = projectDOMToWorld(scene, sRect, 'ScanBot');

                const triPos = triangleGeom.attributes.position.array;
                triPos[0] = eyePos.x; triPos[1] = eyePos.y; triPos[2] = eyePos.z;
                triPos[3] = top.x; triPos[4] = top.y; triPos[5] = top.z;
                triPos[6] = bot.x; triPos[7] = bot.y; triPos[8] = bot.z;
                triangleGeom.attributes.position.needsUpdate = true;

                updateDroneGaze(scene, new THREE.Vector3().lerpVectors(top, bot, 0.5), true);

                triBeams.forEach((b, i) => {
                    const target = i === 0 ? top : bot;
                    b.position.copy(eyePos);
                    b.lookAt(target);
                    b.children.forEach(c => c.scale.z = eyePos.distanceTo(target));
                });
            }
        }

        // Update Pyramid (if active)
        if (pyramidActive) {
            Object.keys(corners).forEach(key => corners[key] = projectDOMToWorld(scene, rect, key));
            const pos = pyramidGeom.attributes.position.array;
            const pts = [corners.TL, corners.TR, corners.BR, corners.BL, corners.TL];
            for (let i = 0; i < 4; i++) {
                const base = i * 9;
                pos[base] = eyePos.x; pos[base + 1] = eyePos.y; pos[base + 2] = eyePos.z;
                pos[base + 3] = pts[i].x; pos[base + 4] = pts[i].y; pos[base + 5] = pts[i].z;
                pos[base + 6] = pts[i + 1].x; pos[base + 7] = pts[i + 1].y; pos[base + 8] = pts[i + 1].z;
            }
            pyramidGeom.attributes.position.needsUpdate = true;

            pyramidBeams.forEach(b => {
                const target = corners[b.key];
                b.beam.position.copy(eyePos);
                b.beam.lookAt(target);
                b.beam.children.forEach(c => c.scale.z = eyePos.distanceTo(target));
            });
        }

        faceMat.uniforms.iTime.value = now / 1000;
        triMat.uniforms.iTime.value = now / 1000;

        requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
}

/**
 * Stops any active holographic scan and cleans up resources.
 */
export function stopHologramScan(scene) {
    let existing;
    while (existing = scene.getObjectByName('hologram-deployment')) {
        existing._isDead = true;
        scene.remove(existing);
        existing.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
                else child.material.dispose();
            }
        });
    }

    // Release drone gaze if it was locked by a scan
    if (scene.gazeFollower && scene.gazeFollower.isLocked) {
        scene.gazeFollower.isLocked = false;
    }
}

/**
 * Deploys a continuous holographic "Data Funnel" emanating from the object.
 * The peak is anchored at the object's center, and a rotating BTC/ETH symbol floats inside.
 */
export function deployHolographicObjectScan(scene, object, color) {
    if (!object) return;

    const cyan = color || GLOBAL_COLORS.ELECTRIC_CYAN || 0x00ffff;

    // 0. SINGLETON GUARD
    stopHologramScan(scene);

    const group = new THREE.Group();
    group.name = 'hologram-deployment';
    group.userData.targetObject = object;
    scene.add(group);

    const center = new THREE.Vector3();
    const apexPos = new THREE.Vector3();

    // 1. PYRAMID MESH
    const faceMat = createHologramFaceMat(cyan);
    faceMat.uniforms.uOpacity.value = 0.2;
    const pyramidGeom = new THREE.BufferGeometry();
    const vertices = new Float32Array(36); 
    const uvs = new Float32Array([0.5, 0, 0, 1, 1, 1, 0.5, 0, 0, 1, 1, 1, 0.5, 0, 0, 1, 1, 1, 0.5, 0, 0, 1, 1, 1]);
    pyramidGeom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    pyramidGeom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    const pyramidMesh = new THREE.Mesh(pyramidGeom, faceMat);
    group.add(pyramidMesh);

    // 2. CORNER BEAMS
    const pyramidBeams = ['TL', 'TR', 'BL', 'BR'].map(key => ({
        beam: createHologramBeam(scene, `pyramid-beam-${key}`, cyan),
        key
    }));
    pyramidBeams.forEach(b => group.add(b.beam));

    // 3. HOLOGRAPHIC COIN SYMBOL
    let hCoin = null;
    const btcSymbol = scene.getObjectByName("btc_symbol");
    const ethSymbol = scene.getObjectByName("eth_symbol");
    // Alternate based on object or random
    const template = (object.name === 'aegis2' || Math.random() > 0.5) ? ethSymbol : btcSymbol;
    
    if (template) {
        hCoin = template.clone();
        hCoin.name = "hologram-coin";
        // Apply a special translucent version of the hologram material
        const coinMat = createHologramFaceMat(cyan);
        coinMat.uniforms.uOpacity.value = 0.15;
        hCoin.traverse(c => {
            if (c.isMesh) {
                c.material = coinMat;
                c.castShadow = false;
                c.receiveShadow = false;
            }
        });
        hCoin.scale.setScalar(template.scale.x * 0.8);
        group.add(hCoin);
    }

    const box = new THREE.Box3();
    const size = new THREE.Vector3();

    const animate = (now) => {
        if (group._isDead || !object.parent) {
            return;
        }

        box.setFromObject(object);
        box.getSize(size);
        box.getCenter(center);

        const radius = Math.max(size.x, size.z) * 1.5;
        // The peak is exactly at the object's center
        apexPos.copy(center);
        
        // The base square floats above the object
        const pulse = Math.sin(now / 400) * 0.05;
        const baseHeight = center.y + size.y * 1.5 + pulse;

        const corners = {
            TL: new THREE.Vector3(center.x - radius, baseHeight, center.z - radius),
            TR: new THREE.Vector3(center.x + radius, baseHeight, center.z - radius),
            BL: new THREE.Vector3(center.x - radius, baseHeight, center.z + radius),
            BR: new THREE.Vector3(center.x + radius, baseHeight, center.z + radius)
        };

        const pos = pyramidGeom.attributes.position.array;
        const pts = [corners.TL, corners.TR, corners.BR, corners.BL, corners.TL];
        for (let i = 0; i < 4; i++) {
            const base = i * 9;
            // Vertex 0: Apex (Center of Aegis)
            pos[base] = apexPos.x; pos[base + 1] = apexPos.y; pos[base + 2] = apexPos.z;
            // Vertices 1 & 2: Base corners (Floating above)
            pos[base + 3] = pts[i].x; pos[base + 4] = pts[i].y; pos[base + 5] = pts[i].z;
            pos[base + 6] = pts[i + 1].x; pos[base + 7] = pts[i + 1].y; pos[base + 8] = pts[i + 1].z;
        }
        pyramidGeom.attributes.position.needsUpdate = true;

        pyramidBeams.forEach(b => {
            const target = corners[b.key];
            b.beam.position.copy(apexPos); 
            b.beam.lookAt(target);        
            b.beam.children.forEach(c => c.scale.z = apexPos.distanceTo(target));
        });

        // Update Floating Coin
        if (hCoin) {
            // Position it centrally in the funnel
            hCoin.position.set(center.x, center.y + size.y * 0.8 + pulse * 2, center.z);
            hCoin.rotation.y += 0.02; // Constant spin
            hCoin.traverse(c => {
                if (c.material && c.material.uniforms) {
                    c.material.uniforms.iTime.value = now / 1000;
                }
            });
        }

        faceMat.uniforms.iTime.value = now / 1000;
        requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
}
