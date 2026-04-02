import * as THREE from 'three';
import * as CONSTANTS from '../utils/constant.js';

// --- Material Definitions ---
export const goldInnerGlowMatSkinned = CONSTANTS.createInnerGlowMatSkinned("#FBC189", 1.5, 1, THREE.FrontSide);

export class Raycaster {
    constructor(scene, camera, renderer, size = 32) {
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        this.domElement = (renderer && renderer.domElement) ? renderer.domElement : scene.domElement;
        if (!this.domElement) {
            this.domElement = document.body;
        }

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        scene.raycasterWrapper = this;

        // Placeholder materials for highlight
        const POOL_SIZE = 10;
        this.raycastHightlightMaterials = [];
        for (let i = 0; i < POOL_SIZE; i++) {
            let mat = new THREE.MeshStandardMaterial({ name: `Pool_Mat_${i}` });
            this.raycastHightlightMaterials.push(mat);
        }

        // --- Dynamic Element Creation ---
        // 1. Container/Group (Virtual or just shared logic) - handled via separate elements

        // MAIN WRAPPER (everything moves together)
        const mainWrapper = document.createElement('div');
        mainWrapper.id = 'cursor-informer-main-wrapper';
        Object.assign(mainWrapper.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            pointerEvents: 'none',
            zIndex: '99999',
            display: 'none', // Start hidden
            // justifyContent: 'center',
            // alignItems: 'center'
        });
        document.body.appendChild(mainWrapper);
        this.cursorInformer = mainWrapper;
        scene.cursorInformer = this.cursorInformer;

        // API
        this.cursorInformer.show = () => { this.cursorInformer.style.display = 'block'; }
        this.cursorInformer.hide = () => { this.cursorInformer.style.display = 'none'; }


        // Text
        const informerText = document.createElement('div');
        informerText.id = 'cursor-informer-text';
        informerText.textContent = "INFO HERE";
        // informerText.style.display = 'none'; // Controlled by parent
        mainWrapper.appendChild(informerText); // Append to wrapper
        this.cursorInformerText = informerText;
        scene.cursorInformerText = this.cursorInformerText;


        // Box (Handling Border & Background Color - Stationary relative to wrapper)
        const informerBox = document.createElement('div');
        informerBox.id = 'cursor-informer-box';
        // informerBox.style.display = 'none'; // Controlled by parent
        mainWrapper.appendChild(informerBox); // Append to wrapper
        this.cursorInformerBox = informerBox;
        scene.cursorInformerBox = this.cursorInformerBox;

        // Icon (Handling BG Image & Rotation - Rotates)
        const informerIcon = document.createElement('div');
        informerIcon.id = 'cursor-informer-icon';
        Object.assign(informerIcon.style, {
            position: 'relative',
            zIndex: '2',
            width: '100%',
            height: '100%',
            backgroundSize: '68%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        });
        informerBox.appendChild(informerIcon);

        // Progress Bar (Vertical Filling Effect)
        const informerProgressBar = document.createElement('div');
        informerProgressBar.id = 'cursor-informer-progress';
        Object.assign(informerProgressBar.style, {
            position: 'absolute',
            bottom: '0',
            left: '0',
            height: '0%', // Controlled by JS (0 to 100)
            width: '100%',
            backgroundColor: 'var(--c-cyan, #00f3ff)',
            // boxShadow: '0 0 15px var(--c-cyan, #00f3ff)',
            opacity: '1',
            zIndex: '1',
            transition: 'height 0.1s linear'
        });
        informerBox.appendChild(informerProgressBar);
        this.informerProgressBar = informerProgressBar;
        scene.cursorInformerProgressBar = this.informerProgressBar;

        this.informerIcon = informerIcon;
        scene.cursorInformerIcon = this.informerIcon;
        this.iconSize = size;

        this.isHoveringRaycastObject = false;

        // --- State Variables ---
        this.currentHoveredGroup = null;
        this.originalMaterialsMap = new Map();
        this.currentIntersection = null;
        this.currentObject = null;
        this.currentObjectTarget = null;
        this.lastObjectTarget = null;

        // --- Smoothing Variables ---
        this.targetMouse = new THREE.Vector2(0, 0);
        this.smoothedMouse = new THREE.Vector2(0, 0);
        this.easingFactor = 0.08;

        // --- 1. BIND EVENTS ONCE ---
        this._onPointerMove = this.onPointerMove.bind(this);
        this._onMouseDown = this.onMouseDown.bind(this);
        this._onKeyDown = this.onKeyDown.bind(this);

        // --- 2. ADD LISTENERS ---
        window.addEventListener('pointermove', this._onPointerMove, { passive: true });
        this.domElement.addEventListener('mousedown', this._onMouseDown, { passive: true, capture: false });
        window.addEventListener('keydown', this._onKeyDown, { passive: true });

        // --- Container Tracking ---
        this.mouseInContainer = false;
        this.domElement.addEventListener('mouseenter', () => { this.mouseInContainer = true; });
        this.domElement.addEventListener('mouseleave', () => { this.mouseInContainer = false; });
    }

    // --- Event Handlers ---

    onKeyDown(event) {
    }

    onMouseEnter() {
        // console.log('Entered something')
    }

    onPointerMove(event) {
        let rect;
        if (this.domElement && this.domElement.getBoundingClientRect) {
            rect = this.domElement.getBoundingClientRect();
        } else {
            rect = { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
        }

        // Update pointer vector for raycasting
        const localX = event.clientX - rect.left;
        const localY = event.clientY - rect.top;
        this.pointer.x = (localX / rect.width) * 2 - 1;
        this.pointer.y = - (localY / rect.height) * 2 + 1;

        // Update TARGET mouse (for smoothing)
        this.targetMouse.set(this.pointer.x, this.pointer.y);

        // MOVE THE MAIN WRAPPER
        if (this.cursorInformer) {
            const winW = window.innerWidth;
            const winH = window.innerHeight;
            const size = this.iconSize;

            // Standard Offsets (Top-Left of icon relative to mouse)
            const offsetX = size * -0.5;
            const offsetY = size * -1.5;

            let finalX = event.clientX + offsetX;
            let finalY = event.clientY + offsetY;

            // 1. Clamp Horizontal (Box only)
            finalX = Math.max(10, Math.min(finalX, winW - size - 10));

            // 2. Clamp Vertical (Box only)
            finalY = Math.max(10, Math.min(finalY, winH - size - 10));

            // 3. Smart Text Position (If too close to top, flip text to bottom)
            if (this.cursorInformerText) {
                const isUIMode = this.cursorInformer.classList.contains('ui-mode');
                const gap = isUIMode ? '42px' : '8px';

                if (event.clientY < 120) { // If mouse is in top 120px
                    this.cursorInformerText.style.bottom = 'auto';
                    this.cursorInformerText.style.top = '100%';
                    this.cursorInformerText.style.marginTop = gap;
                    this.cursorInformerText.style.marginBottom = '0';
                } else {
                    this.cursorInformerText.style.top = 'auto';
                    this.cursorInformerText.style.bottom = '100%';
                    this.cursorInformerText.style.marginTop = '0';
                    this.cursorInformerText.style.marginBottom = gap;
                }
            }

            this.cursorInformer.style.transform = `translate(${finalX}px, ${finalY}px)`;
        }
    }

    onMouseDown(event) {
        // Calculate Screen Space Click (0-1)
        const screenX = event.clientX / window.innerWidth;
        const screenY = 1.0 - (event.clientY / window.innerHeight); // Invert Y for GL-like coords if needed, or keep standard DOM top-left:
        // User asked for "coordinate ... based on screen". usually normalized 0-1 is best.
        // Let's stick to standard top-left 0,0 to bottom-right 1,1 for "Space" unless specified otherwise,
        // BUT for shader UV mapping, bottom-left is usually 0,0.
        // However, `uDivSpaceMouseClick` replaces `uDivMouseClick` (which was UV). UV is bottom-left 0,0.
        // So I will normalize to Bottom-Left 0,0.

        const normScreenX = event.clientX / window.innerWidth;
        const normScreenY = 1.0 - (event.clientY / window.innerHeight);

        // if (this.scene.constantUniform.uScreenSpaceMouseClick) {
        //     this.scene.constantUniform.uScreenSpaceMouseClick.value.set(normScreenX, normScreenY);
        // }

        // Calculate Div/Canvas Space Click (0-1)
        if (this.domElement) {
            const rect = this.domElement.getBoundingClientRect();
            const divX = (event.clientX - rect.left) / rect.width;
            const divY = 1.0 - ((event.clientY - rect.top) / rect.height); // Bottom-left origin

            // if (this.scene.constantUniform.uDivSpaceMouseClick) {
            //     this.scene.constantUniform.uDivSpaceMouseClick.value.set(divX, divY);
            // }
        }

        if (this.currentIntersection) {
            this.currentObjectTarget?.onMouseDown?.(this.currentObjectTarget, this.currentIntersection);
        }
    }

    onMouseLeave(event) {
        if (this.currentIntersection) {
            this.currentObjectTarget?.onMouseLeave?.(this.currentObjectTarget, this.currentIntersection);
        }
    }

    updateGravityCenter(event) {
        if (this.scene.world && this.scene.world.gravityCenterForBalls) {
            let targetIntersection = null;

            if (this.allIntersections && this.allIntersections.length > 0) {
                for (let i = 0; i < this.allIntersections.length; i++) {
                    const hit = this.allIntersections[i];
                    // Skip Dragon Balls themselves to find what's "behind" them for gravity
                    if (hit.object && hit.object.userData && hit.object.userData.isPhysicsBall) {
                        continue;
                    }
                    targetIntersection = hit;
                    break;
                }
            }

            if (targetIntersection && targetIntersection.point) {
                // 1. OPTION A: True 3D Depth. Stick the gravity center to the point on the geometry!
                this.scene.world.gravityCenterForBalls.copy(targetIntersection.point);

                // 2. We don't want the balls smashing into the physical mesh, so pull out slightly.
                // Reusing a single cached vector (_tempVec) to avoid memory allocations and protect the 60 FPS target.
                // this._tempVec = this._tempVec || new THREE.Vector3();
                // this._tempVec.subVectors(this.camera.position, targetIntersection.point).normalize();

                // // Float the target exactly 1.5 units in front of the intersection surface
                // this.scene.world.gravityCenterForBalls.addScaledVector(this._tempVec, 1.5);

                // // Maintain the scene's manual X-axis / depth offset
                // this.scene.world.gravityCenterForBalls.x += 2;
            } else {
                // FALLBACK: The Void. If the ray isn't hitting anything, fall back to the flat 20-unit plane.
                const fixedDistance = 20;
                this.raycaster.ray.at(fixedDistance, this.scene.world.gravityCenterForBalls);
                this.scene.world.gravityCenterForBalls.x += 2;
            }
        }
    }

    updateInformer(image) {
        if (this.informerIcon) { // Use icon specific ref
            this.informerIcon.style.backgroundImage = `url('${image}')`;
        }
    }

    update() {
        // PERFORMANCE GUARD: Hard interruption during transitions or when explicitly disabled
        if (this.scene && (this.scene.isTransitioning || this.scene.raycasterEnabled === false || this.scene.isPersonaActive)) {
            // Ensure informer is hidden when raycasting is disabled
            if (this.isHoveringRaycastObject) {
                this.isHoveringRaycastObject = false;
                this.currentObjectTarget?.onMouseLeave?.();
                this.currentObjectTarget = null;
                this.currentIntersection = null;
                this.currentObject = null;
                if (this.cursorInformer) this.cursorInformer.style.display = 'none';
            }
            return;
        }

        // --- OPTIMIZATION: Skip if mouse and camera have not changed ---
        const moveThreshold = 0.0001;
        const mouseChanged = !this._lastPointer || (Math.abs(this._lastPointer.x - this.pointer.x) > moveThreshold || Math.abs(this._lastPointer.y - this.pointer.y) > moveThreshold);
        
        // Use a lightweight check for camera matrix change
        const camMatrix = this.camera.matrixWorld.elements;
        let cameraChanged = false;
        if (!this._lastCamMatrix) {
            this._lastCamMatrix = new Float32Array(16);
            cameraChanged = true;
        } else {
            for (let i = 0; i < 16; i++) {
                if (Math.abs(this._lastCamMatrix[i] - camMatrix[i]) > moveThreshold) {
                    cameraChanged = true;
                    break;
                }
            }
        }

        if (!mouseChanged && !cameraChanged && this._hasLastIntersections) return;

        // Update caches
        if (!this._lastPointer) this._lastPointer = new THREE.Vector2();
        this._lastPointer.copy(this.pointer);
        for (let i = 0; i < 16; i++) this._lastCamMatrix[i] = camMatrix[i];

        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.raycastObjects, true);
        this.allIntersections = intersects;
        this._hasLastIntersections = true;

        // Global Update: Handle dragon ball gravity center based on mouse
        this.updateGravityCenter();

        if (intersects.length > 0) {
            this.currentIntersection = intersects[0];

            // NEW: Ancestor Search Logic (Optimized with O(1) lookup)
            let registeredMatch = null;
            let current = intersects[0].object;

            while (current) {
                if (current.userData && current.userData.isRaycastTarget) {
                    registeredMatch = current;
                    break;
                }
                current = current.parent;
            }

            // Fallback to older ignoreRaycast logic if no match found (safeguard)
            if (!registeredMatch) {
                const hitObject = intersects[0].object;
                registeredMatch = hitObject.ignoreRaycast ? hitObject.parent : hitObject;
            }

            this.currentObject = registeredMatch;

            if (this.currentObject !== this.currentObjectTarget) {
                // Restore old target
                this.lastObjectTarget = this.currentObjectTarget;
                this.currentObjectTarget = this.currentObject;

                // 1. Enter/Leave Logic (Runs ONCE per target switch)
                if (this.lastObjectTarget !== this.currentObjectTarget) {
                    this.lastObjectTarget?.onMouseLeave?.();
                    this.currentObjectTarget?.onMouseEnter?.();
                }
            }

            // 2. Continuous Hover Logic (Runs EVERY FRAME while hovering)
            // Passes 2 arguments: the target object and the intersection
            if (this.currentObjectTarget) {
                this.currentObjectTarget.onMouseHover?.(this.currentObjectTarget, this.currentIntersection);
            }

        } else if (this.currentObjectTarget) {
            // Mouse left the object completely
            this.isHoveringRaycastObject = false;
            this.currentObjectTarget?.onMouseLeave?.();
            this.currentObjectTarget = null;
            this.currentIntersection = null;
            this.currentObject = null;
        }

        this.lastObjectTarget = this.currentObjectTarget;
    }

    dispose() {
        if (this.domElement) {
            this.domElement.removeEventListener('mousedown', this._onMouseDown, false);
        }
        window.removeEventListener('pointermove', this._onPointerMove);
        window.removeEventListener('keydown', this._onKeyDown);

        if (this.cursorInformer && this.cursorInformer.parentNode) {
            this.cursorInformer.parentNode.removeChild(this.cursorInformer);
        }
        // Text and Box are children of cursorInformer, so they get removed automatically.

        this.cursorInformer = null;
        this.informerIcon = null;
        if (this.scene) {
            this.scene.cursorInformer = null;
            this.scene.cursorInformerIcon = null;
            this.scene.raycaster = null;
        }
    }
}

// --- Utility Functions ---

export function addRaycastObject(scene, object, options = {}) {
    // Destructure options with defaults
    const {
        onMouseEnter = null,
        onMouseLeave = null,
        onMouseDown = null,
        onMouseHover = null
    } = options;

    scene.raycastObjects = scene.raycastObjects || [];
    scene.raycastObjects.push(object);
    object.userData.isRaycastTarget = true; // Optimized O(1) identification for ancestor search
    let objectTarget = object;

    // Store original material on traverse
    objectTarget.traverse((child) => {
        if (child.material) child.userData.originalMaterial = child.material
    })

    // Attach custom event handlers to the object
    objectTarget.onMouseEnter = () => onMouseEnter && onMouseEnter(objectTarget);
    objectTarget.onMouseLeave = () => onMouseLeave && onMouseLeave(objectTarget);

    // UPDATED: Continuous hover handler
    if (onMouseHover) {
        objectTarget.onMouseHover = (target, intersection) => onMouseHover(target, intersection);
    }

    if (onMouseDown) {
        objectTarget.onMouseDown = (target, intersection) => onMouseDown(target, intersection);
    }
}

export function highlightObject(scene, object) {
    restoreMaterials(scene)
    const POOL_SIZE = 10;

    // 1. Initialize the Fixed Material Pool
    if (!scene.raycastMaterials) {
        scene.raycastMaterials = [];
        for (let i = 0; i < POOL_SIZE; i++) {
            const mat = new THREE.MeshStandardMaterial({ name: `Pool_Mat_${i}` });
            scene.raycastMaterials.push(mat);
        }
    }

    // 2. Analyze the object
    const materialUsageMap = new Map();

    object.traverse((child) => {
        if (child.ignoreRaycast) return;
        if (child.name && (child.name.toLowerCase().includes('hitbox') || child.name.toLowerCase().includes('collider'))) return;

        if (child.isMesh && child.material) {
            // Safety Check: Skip Shaders
            if (child.material.isShaderMaterial) return;

            if (!child.userData.originalMaterial) {
                child.userData.originalMaterial = child.material;
            }
            const uuid = child.material.uuid;

            if (!materialUsageMap.has(uuid)) {
                materialUsageMap.set(uuid, { count: 0, material: child.material });
            }
            const entry = materialUsageMap.get(uuid);
            entry.count++;
        }
    });

    // 3. Sort materials by frequency
    const sortedMaterials = Array.from(materialUsageMap.values())
        .sort((a, b) => b.count - a.count);

    // 4. Map original UUIDs to Pool Materials
    const activeMapping = new Map();
    const limit = Math.min(sortedMaterials.length, POOL_SIZE);

    for (let i = 0; i < limit; i++) {
        const originalMat = sortedMaterials[i].material;
        const poolMat = scene.raycastMaterials[i];

        poolMat.copy(originalMat);
        if (originalMat.toneMapped === false) {
            poolMat.envMap = originalMat.envMap ? originalMat.envMap : scene.environment
            poolMat.envMapIntensity = originalMat.envMap ? originalMat.envMapIntensity * 4 : 4
        } else {
            poolMat.toneMapped = false;
        }


        activeMapping.set(originalMat.uuid, poolMat);
    }

    // 5. Apply the pooled materials & Register for reset
    if (!scene._dirtyRaycastObjects) scene._dirtyRaycastObjects = new Set();
    scene._dirtyRaycastObjects.add(object);

    object.traverse((child) => {
        if (child.ignoreRaycast) return;
        if (child.name && (child.name.toLowerCase().includes('hitbox') || child.name.toLowerCase().includes('collider'))) return;

        if (child.isMesh && child.material) {
            const replacementMat = activeMapping.get(child.material.uuid);

            if (replacementMat) {
                child.material = replacementMat;
            }
        }
    });
}

export function changeMaterial(scene, child, newMaterial = goldInnerGlowMatSkinned) {
    if (!scene._dirtyRaycastObjects) scene._dirtyRaycastObjects = new Set();
    scene._dirtyRaycastObjects.add(child);

    child.traverse((d) => {
        if (d.ignoreRaycast) return;
        if (d.name && (d.name.toLowerCase().includes('hitbox') || d.name.toLowerCase().includes('collider'))) return;
        
        if (d.isMesh && d.material) {
            if (!d.userData.originalMaterial) {
                d.userData.originalMaterial = d.material;
            }
            d.material = newMaterial;
        }
    })
}

export function restoreMaterials(scene) {
    if (!scene._dirtyRaycastObjects || scene._dirtyRaycastObjects.size === 0) return;

    scene._dirtyRaycastObjects.forEach(object => {
        object.traverse((d) => {
            if (d.material && d.userData.originalMaterial) {
                d.material = d.userData.originalMaterial;
            }
        });
    });

    scene._dirtyRaycastObjects.clear();
}

export function applyImpulse(scene, bodyHostingObject, intersection, forceMultiplier = null) {
    const rapierBody = bodyHostingObject.rapierBody;
    if (!rapierBody) return; // Silent return if the object has no physics body attached

    const intersectPoint = intersection.point;
    const forceDirection = new THREE.Vector3();
    forceDirection.subVectors(intersectPoint, scene.raycasterWrapper.camera.position).normalize();

    const mass = rapierBody.mass() || 0;
    forceMultiplier = forceMultiplier || Math.random() * 1 + 2.5;
    const forceMagnitude = mass * forceMultiplier;
    const impulse = forceDirection.multiplyScalar(forceMagnitude);

    impulse.y = Math.max(2 * Math.abs(forceDirection.y), 2);
    impulse.x /= 10;
    impulse.y *= 3;
    impulse.z /= 10;

    rapierBody.applyImpulseAtPoint(
        { x: impulse.x, y: impulse.y, z: impulse.z },
        { x: intersectPoint.x, y: intersectPoint.y, z: intersectPoint.z },
        true
    );



    // Trigger Drone Beam if available — guard: no beam aimed at the cats
    const CAT_NAMES = ['Object_12001', 'Object_108'];
    if (scene.shootDroneBeam && !CAT_NAMES.includes(bodyHostingObject?.name)) {
        scene.shootDroneBeam(scene, bodyHostingObject, "", intersectPoint);
    }
}

export function adjustNebula(scene) {
    const A = scene.raycasterWrapper.pointer
    const P = new THREE.Vector2(0.0, 0.29);
    const dist = A.distanceTo(P);

    const nebula = (scene.objectMap && scene.objectMap.get("Lathe_Center")) || scene.getObjectByName("Lathe_Center");
    if (!nebula) return;

    const u = nebula.material.uniforms

    if (dist === 0.0) {
        return 2;
    } else if (dist > 0.39) {
        u.nebulaCoreRadius.value = 40;
        u.nebulaTwistFactor.value = 0
    } else {
        const t = dist / 0.39;
        const easedT = t * t;
        u.nebulaCoreRadius.value = 2 + (100 - 2) * easedT;

        const sourceMax = 0.2;
        const clampedEasedT = Math.max(0, Math.min(easedT, sourceMax));
        const normalizedT = clampedEasedT / sourceMax;

        u.nebulaTwistFactor.value = 1 - normalizedT;
    }
    return dist
}



// --- Informer Helpers (Moved from loadedModelRaycast.js) ---
// --- Informer Helpers (Moved from loadedModelRaycast.js) ---
export function setInformerBg(scene, iconData, text = "INFO HERE", force = false, isContact = false) {
    // 0. CHECK ENABLED FLAG: Do not show if explicit disabled
    if (scene.cursorInformerEnabled === false && !force) return;

    // 1. UPDATE ICON (if icon data is provided)
    if (scene.cursorInformerBox) {
        if (iconData) {
            scene.cursorInformerBox.style.display = 'flex';
            if (scene.cursorInformerIcon) {
                // If it's the new coordinate object { row, col }
                if (typeof iconData === 'object' && iconData.row !== undefined) {
                    // Sprite sheet is 320x240 (4 cols x 3 rows)
                    const posX = ((iconData.col - 1) * 100) / 3;
                    const posY = ((iconData.row - 1) * 100) / 2;

                    Object.assign(scene.cursorInformerIcon.style, {
                        backgroundImage: "url('./textures/icons.png')",
                        backgroundSize: '400% 300%',
                        backgroundPosition: `${posX}% ${posY}%`,
                        filter: 'none'
                    });
                } else if (typeof iconData === 'string') {
                    // Fallback for legacy Base64 string support
                    const cleanB64 = iconData.replace(/\s+/g, '');
                    scene.cursorInformerIcon.style.backgroundImage = `url('data:image/svg+xml;base64,${cleanB64}')`;
                    scene.cursorInformerIcon.style.backgroundSize = 'contain';
                    scene.cursorInformerIcon.style.backgroundPosition = 'center';
                }
            }
        } else {
            scene.cursorInformerBox.style.display = 'none';
        }
    }

    // 2. SHOW MAIN WRAPPER
    if (scene.cursorInformer) {
        if (isContact) {
            scene.cursorInformer.classList.add('ui-mode');
        } else {
            scene.cursorInformer.classList.remove('ui-mode');
        }
        scene.cursorInformer.style.display = 'block';
        scene.cursorInformer.style.opacity = '1';
        scene.cursorInformer.style.visibility = 'visible';
    }


    // Reset text before updating
    if (scene.cursorInformerText) {
        scene.cursorInformerText.style.display = 'none';
        scene.cursorInformerText.style.opacity = '0';
    }



    // 4. UPDATE TEXT
    if (scene.cursorInformerText) {
        scene.cursorInformerText.innerHTML = text;
        scene.cursorInformerText.style.display = 'block';
        scene.cursorInformerText.style.opacity = '1'; // Ensure visible
    }
}

export function hideInformer(scene) {
    // HIDE MAIN WRAPPER
    if (scene.cursorInformer && scene.cursorInformer.hide) {
        scene.cursorInformer.hide();
    } else if (scene.cursorInformer) {
        scene.cursorInformer.style.display = 'none';
    }

    // Optional: Reset Icon
    if (scene.cursorInformerIcon) {
        scene.cursorInformerIcon.style.backgroundImage = 'none';
        scene.cursorInformerIcon.style.transform = 'rotate(0deg)'; // Good practice to reset rotation too
    }
}