import * as THREE from 'three';
import { getSpriteInfo } from './spriteMapping.js';
import { resources } from '../resources/loadResources.js';
import { personaManager } from '../content-manager/personaManager.js';

export class Tooltip {
    constructor(scene) { // Added scene parameter
        this.tooltip = document.createElement('div');
        this.tooltip.style.position = 'absolute';
        this.tooltip.style.padding = '12px 16px';
        this.tooltip.style.background = 'rgba(0, 0, 0, 0.95)'; // Darker
        this.tooltip.style.color = '#fff';
        this.tooltip.style.borderRadius = '4px'; // Sharper corners
        this.tooltip.style.fontFamily = "'Rajdhani', sans-serif"; // Body font default
        this.tooltip.style.fontSize = '13px'; // Smaller body
        this.tooltip.style.lineHeight = '1.4';
        this.tooltip.style.pointerEvents = 'auto';
        this.tooltip.addEventListener('click', () => this.hide());
        this.tooltip.style.display = 'none';
        this.tooltip.style.zIndex = '100000';
        this.tooltip.style.border = '1px solid rgba(0, 255, 255, 0.3)'; // Cyan border hint
        this.tooltip.style.whiteSpace = 'normal';
        this.tooltip.style.maxWidth = '260px'; // Slightly narrower
        this.tooltip.style.backdropFilter = 'blur(4px)';
        this.tooltip.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
        this.tooltip.style.transition = 'opacity 0.2s, transform 0.2s';
        document.body.appendChild(this.tooltip);

        this.lastHoveredIndex = -1;
        this.lastTooltipRefString = null;

        // --- CSS 3D Icon Setup ---
        this.iconSize = 32;

        // Internal DOM state for rotation
        this.rotX = 0;
        this.rotY = 0;

        this.isAnimating = false;
        this._animateIcon = this._animateIcon.bind(this);
    }

    _createCubeDOM() {
        const container = document.createElement('div');
        container.style.width = this.iconSize + 'px';
        container.style.height = this.iconSize + 'px';
        container.style.position = 'relative';
        container.style.perspective = '800px';

        const cube = document.createElement('div');
        cube.style.width = '100%';
        cube.style.height = '100%';
        cube.style.position = 'absolute';
        cube.style.transformStyle = 'preserve-3d';
        this.cubeDOM = cube;

        const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
        const transformMap = {
            'front': `rotateY(0deg) translateZ(${this.iconSize / 2}px)`,
            'back': `rotateY(180deg) translateZ(${this.iconSize / 2}px)`,
            'right': `rotateY(90deg) translateZ(${this.iconSize / 2}px)`,
            'left': `rotateY(-90deg) translateZ(${this.iconSize / 2}px)`,
            'top': `rotateX(90deg) translateZ(${this.iconSize / 2}px)`,
            'bottom': `rotateX(-90deg) translateZ(${this.iconSize / 2}px)`
        };

        this.faceElements = [];

        faces.forEach(face => {
            const el = document.createElement('div');
            el.style.position = 'absolute';
            el.style.width = this.iconSize + 'px';
            el.style.height = this.iconSize + 'px';
            el.style.backfaceVisibility = 'hidden'; // Optional: or 'visible' if transparent
            // Apply Sprite Texture
            if (resources.spriteSheetIcon) {
                el.style.backgroundImage = `url('${resources.spriteSheetIcon.image.src}')`;
                el.style.backgroundSize = '800% 400%'; // 8 cols, 4 rows
                el.style.imageRendering = 'pixelated'; // Keep crisp
            }
            el.style.transform = transformMap[face];

            // Border to define edges slightly?
            // el.style.border = '1px solid rgba(255,255,255,0.1)'; 

            cube.appendChild(el);
            this.faceElements.push(el);
        });

        container.appendChild(cube);
        return container;
    }

    _animateIcon() {
        if (!this.tooltip.style.display || this.tooltip.style.display === 'none') {
            this.isAnimating = false;
            return;
        }

        requestAnimationFrame(this._animateIcon);

        this.rotX += 0.02; // Rads
        this.rotY += 0.03;

        // Convert Rads to Degs for CSS
        const degX = this.rotX * (180 / Math.PI);
        const degY = this.rotY * (180 / Math.PI);

        if (this.cubeDOM) {
            this.cubeDOM.style.transform = `rotateX(${degX}deg) rotateY(${degY}deg)`;
        }
    }

    // Removed renderIcon(renderer) - Not needed for CSS

    _getPointInfo(points, material, idx, camera, rawMouse) {
        if (!points.geometry.attributes.aStableRandom) return null;

        const rnd = points.geometry.attributes.aStableRandom.array[idx];

        // Get Uniforms
        const time = material.uniforms.iTime.value;
        const progress = material.uniforms.uProgress.value;
        const chaos = material.uniforms.uIsChaos.value;

        // Calculate vIsGrid (Approx)
        let startVal = 0;
        if (points.geometry.attributes.aStartSizeIsGrid) startVal = points.geometry.attributes.aStartSizeIsGrid.array[idx * 2 + 1];

        let targetVal = 0;
        if (points.geometry.attributes.aTargetSizeIsGrid) targetVal = points.geometry.attributes.aTargetSizeIsGrid.array[idx * 2 + 1];

        const vIsGridVal = startVal * (1.0 - progress) + targetVal * progress;
        const isGrid = vIsGridVal > 0.5 ? 1.0 : 0.0;

        // --- Calculate Screen Distance (Shader Simulation) ---
        // We must replicate the vertex shader to know WHERE the point visually is
        // to determine if it is "Locked" by the hover effect.

        // 1. Get Base Position
        const positionAttribute = points.geometry.attributes.position;
        const pt = new THREE.Vector3();
        pt.fromBufferAttribute(positionAttribute, idx);

        // 2. Apply Grid Shift (Shader Sync for Chaos/Grid points)
        // Shader: if (isStartModel < 0.5) { alignedStartPos += uGridForward * (uBaseGridZ - uGridZ); }
        const isModel = 1.0 - isGrid;

        if (isModel < 0.5) {
             const uGridForward = material.uniforms.uGridForward ? material.uniforms.uGridForward.value : new THREE.Vector3(0, 0, 1);
             const uBaseGridZ = material.uniforms.uBaseGridZ ? material.uniforms.uBaseGridZ.value : 0.0;
             const uGridZ = material.uniforms.uGridZ ? material.uniforms.uGridZ.value : 0.0;
             const shift = uGridForward.clone().multiplyScalar(uBaseGridZ - uGridZ);
             pt.add(shift);
        }

        if (isModel > 0.5) {
            // Uniforms
            const uModelScale = material.uniforms.uModelScale ? material.uniforms.uModelScale.value : 1.0;
            const uModelPosition = material.uniforms.uModelPosition ? material.uniforms.uModelPosition.value : new THREE.Vector3(0, 0, 0);
            const uModelRotation = material.uniforms.uModelRotation ? material.uniforms.uModelRotation.value : new THREE.Vector3(0, 0, 0);

            // Scale
            pt.multiplyScalar(uModelScale);

            // Rotate (Z * Y * X)
            const euler = new THREE.Euler(uModelRotation.x, uModelRotation.y, uModelRotation.z, 'XYZ');
            // Shader uses custom matrix calc Z*Y*X, Three.js Euler 'XYZ' applies X then Y then Z (intrinsic) or Z then Y then X (extrinsic)?
            // Three.js applyEuler with Default XYZ: Applies RotX, then RotY, then RotZ.
            // Shader: rotateZ * rotateY * rotateX.
            // This matches Three.js 'ZYX' order??
            // Verify: Matrix = RotZ * RotY * RotX. Vector * Matrix.
            // This means we apply X first, then Y, then Z.
            // Three.js default is XYZ.
            // Let's assume XYZ for now or use manually constructed matrix if precise match needed.
            // For simple Y rotation it matters less.
            pt.applyEuler(euler);

            // Translate
            pt.add(uModelPosition);
        }

        // 3-5. Project to Clip Space & Convert to Screen
        let pt4 = new THREE.Vector4(pt.x, pt.y, pt.z, 1.0);
        pt4.applyMatrix4(points.matrixWorld); // Model -> World
        const worldPos = new THREE.Vector3(pt4.x, pt4.y, pt4.z); // Capture World Position
        pt4.applyMatrix4(camera.matrixWorldInverse); // World -> View
        pt4.applyMatrix4(camera.projectionMatrix); // View -> Clip

        // 4. Apply Screen Offset (Shader Logic)
        const uModelScreenOffset = material.uniforms.uModelScreenOffset ? material.uniforms.uModelScreenOffset.value : new THREE.Vector2(0, 0);
        pt4.x += uModelScreenOffset.x * pt4.w;
        pt4.y += uModelScreenOffset.y * pt4.w;

        const ndc = new THREE.Vector2(pt4.x / pt4.w, pt4.y / pt4.w);
        const screenX = (ndc.x * 0.5 + 0.5) * window.innerWidth;
        const screenY = (ndc.y * 0.5 + 0.5) * window.innerHeight;

        // 6. Calculate Distance
        // Note: rawMouse.y in Three.js usually is Top-Left or Bottom-Left?
        // rawMouse passed from points.js is clientX, clientY (Top-Left origin).
        // screenY above: ndc.y=1 is Top? No, WebGL Y=1 is Top. screenY calc assumes bottom-left 0?
        // (ndc.y * 0.5 + 0.5). If Y=1 -> 1.0 * H.
        // DOM Y=0 is Top.
        // So we need to flip Y comparison.
        const glScreenY = screenY;
        const mouseScreenY = window.innerHeight - rawMouse.y; // Convert DOM mouse to GL coords
        const dx = screenX - rawMouse.x;
        const dy = glScreenY - mouseScreenY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // --- Logic Checks ---
        // Cycle Logic from Shader
        const isOtherState = 1.0 - chaos;
        const cycleLen = (isGrid * isOtherState) > 0.5 ? 10.0 : 6.0;

        const totalTime = time + rnd * 10.0;
        const cycleCount = Math.floor(totalTime / cycleLen);
        const baseOffset = cycleCount * 13.0; // Prime number jump

        // Buzz Phase
        const buzzDuration = 0.75;
        const cycle = totalTime % cycleLen;
        const isBuzzPhase = cycle > (cycleLen - buzzDuration) ? 1.0 : 0.0;

        // --- LOCK LOGIC ---
        // Shader:
        // float isInsideOuter = 1.0 - step(uHoverRadius, dist);
        // float isOutsideInner = step(minInteractionDist, dist);
        // float isHover = isInsideOuter * isOutsideInner;
        // float isActive = isHover * isBuzzPhase;

        const uHoverRadius = material.uniforms.uHoverRadius ? material.uniforms.uHoverRadius.value : 200.0;
        const minInteractionDist = 5.0; // Hardcoded in Shader

        const isInsideOuter = dist < uHoverRadius ? 1.0 : 0.0;
        const isOutsideInner = dist > minInteractionDist ? 1.0 : 0.0;
        const isHover = isInsideOuter * isOutsideInner;

        const isActive = isHover * isBuzzPhase;

        // Stepped Time (Flicker)
        const flickSpeed = 13.33;
        const steppedTime = Math.floor((time * flickSpeed) + rnd) * isActive;

        // Final Index
        const finalIndexRaw = (rnd * 32.0) + steppedTime + baseOffset;
        const totalFrames = 32;
        const finalTexIndex = Math.floor(finalIndexRaw) % totalFrames;

        const cols = 8;
        const col = finalTexIndex % cols;
        const row = Math.floor(finalTexIndex / cols);

        const persona = personaManager ? personaManager.currentMode : 'dev';
        const sprite = getSpriteInfo(row, col, persona);

        // --- Grid Coordinates Calculation (Dynamic Fix) ---
        // Dynamically calculate coordinates based on the CURRENT visual grid layout.
        // This ensures the Tooltip matches the visual grid even when shifted by a model.

        let spatialCol = 0;
        let spatialRow = 0;

        // 1. Get Model Count (Shift Amount)
        const uModelPointCount = material.uniforms.uModelPointCount ? material.uniforms.uModelPointCount.value : 0.0;

        // 2. Check if this point is part of the Background Grid
        // (Indices >= uModelPointCount are the "Flowed" grid)
        if (idx >= uModelPointCount) {
            // It is a Grid Point (or Chaos Point if count=0)
            const totalPoints = points.geometry.attributes.position.count;
            const remainingPoints = Math.max(0, totalPoints - uModelPointCount);
            const currentGridSide = Math.ceil(Math.sqrt(remainingPoints)) || 1;

            // Calculate relative index in the "New" grid
            const localIndex = idx - uModelPointCount;

            spatialCol = localIndex % currentGridSide;
            spatialRow = Math.floor(localIndex / currentGridSide);
        } else {
            // It is a Model Point
            // Fallback to the original baked attribute (Origin Identity)
            if (points.geometry.attributes.aSpatialGridIndex) {
                spatialCol = points.geometry.attributes.aSpatialGridIndex.array[idx * 2 + 0];
                spatialRow = points.geometry.attributes.aSpatialGridIndex.array[idx * 2 + 1];
            }
        }

        // --- SPECIAL CASE: KNOWHERE SENTINEL ---
        if (idx === 999999) {
            const persona = personaManager ? personaManager.currentMode : 'dev';
            const kwData = getSpriteInfo("KNOWHERE", null, persona);
            return {
                idx,
                texIndex: 0,
                col: NaN,
                row: NaN,
                rnd: 0,
                icon: kwData.icon,
                name: kwData.name,
                description: kwData.description,
                meta: kwData.meta,
                worldPos: new THREE.Vector3(NaN, NaN, NaN), // Narrative NaN
                spatialCol: NaN,
                spatialRow: NaN,
                isGrid: true
            };
        }

        // --- DIPPER DETECTION ---
        let isDipper = false;
        let dipperData = null;
        if (points.geometry.attributes.aPointData) {
            isDipper = points.geometry.attributes.aPointData.array[idx * 4 + 1] > 0.5;
            if (isDipper && points.parentInstance && points.parentInstance.bigDipper) {
                const dipperBase = points.parentInstance._dipperBaseIndex;
                const starIdx = idx - dipperBase;
                if (starIdx >= 0 && starIdx < points.parentInstance.bigDipper.length) {
                    dipperData = points.parentInstance.bigDipper[starIdx];
                }
            }
        }

        // --- FINAL RECOVERY: Use fixed texture slots for Dipper stars ---
        let finalCol = col;
        let finalRow = row;
        if (isDipper && dipperData) {
            finalCol = dipperData.textureSlotCol;
            finalRow = dipperData.textureSlotRow;
        }

        return {
            idx,
            texIndex: finalTexIndex,
            col: finalCol,
            row: finalRow,
            rnd,
            icon: sprite.icon,
            name: sprite.name,
            description: sprite.description,
            meta: sprite.meta,
            worldPos: worldPos,
            spatialCol,
            spatialRow,
            isGrid: isGrid > 0.5, // Pass boolean
            isDipper,
            dipperData
        };
    }

    update(raycaster, points, material, smoothMouse, rawMouse, camera, renderer) {
        if (!points) return;

        // Throttled raycasting or state-tracking can go here...

        // Raycasting Logic
        const currentThreshold = raycaster.params.Points.threshold;
        raycaster.params.Points.threshold = 1.0;

        // Fix for Offset Raycasting:
        // Because the Shader applies 'uModelScreenOffset' (2D shift),
        // the visual points do NOT match the physics points (geometry).
        // We must inverse-shift the mouse for raycasting to hit the "real" geometry.
        const offset = material.uniforms.uModelScreenOffset ? material.uniforms.uModelScreenOffset.value : new THREE.Vector2(0, 0);

        // Raycaster uses Normalized Device Coordinates (-1 to +1)
        // smoothMouse is already in NDC.
        // uModelScreenOffset is added to NDC in shader.
        // So: VisualPos = GeoPos + Offset.
        // If Mouse hits VisualPos, then Mouse = GeoPos + Offset.
        // So GeoPos = Mouse - Offset.
        const correctedMouse = smoothMouse.clone().sub(offset);

        // Temporarily override raycaster to use corrected mouse
        raycaster.setFromCamera(correctedMouse, camera);

        const pointIntersects = raycaster.intersectObject(points);
        let idx = -1;

        // --- CASE 1: KNOWHERE ARTIFACT ---
        // Special interaction for the Celestial hub
        const scene = points.parentInstance?.scene;
        const knowhere = scene?.knowhere;
        if (knowhere && knowhere.material.uniforms.uScaleFactor.value > 0.01) {
            // IMPORTANT: Create a clean raycaster that does not use 'correctedMouse', 
            // since Knowhere operates in pure screen space without the points offset.
            const pureRaycaster = new THREE.Raycaster();
            pureRaycaster.setFromCamera(smoothMouse, camera);
            
            const kwIntersects = pureRaycaster.intersectObject(knowhere);
            if (kwIntersects.length > 0) {
                const uv = kwIntersects[0].uv;
                if (uv) {
                    const px = uv.x * 2.0 - 1.0;
                    const py = uv.y * 2.0 - 1.0;
                    // Check exact visual area (radius < 0.9 matches shader mask)
                    if (Math.sqrt(px * px + py * py) < 0.9) {
                        idx = 999999;
                    }
                }
            }
        }

        // --- CASE 2: REGULAR POINTS ---
        if (idx === -1) {
            if (pointIntersects.length > 0) {
                // PRIORITIZATION: Scan for Big Dipper stars (Core Expertise)
                // In chaos mode, points are dense. We want to always prioritize expert nodes if hovered.
                let dipperHitIdx = -1;
                for (let i = 0; i < Math.min(pointIntersects.length, 5); i++) {
                    const hitIdx = pointIntersects[i].index;
                    // Check aPointData.y for dipper flag
                    if (points.geometry.attributes.aPointData && points.geometry.attributes.aPointData.array[hitIdx * 4 + 1] > 0.5) {
                        dipperHitIdx = hitIdx;
                        break;
                    }
                }

                idx = (dipperHitIdx !== -1) ? dipperHitIdx : pointIntersects[0].index;
            } else if (points.geometry.morphCurrentIndex === 3 && points.parentInstance && points.parentInstance.model) {
                // AREA HOVER CHECK: If we missed individual points but we are in Armature state (Index 3),
                // check against the hidden proxy mesh for the "area".
                const modelIntersects = raycaster.intersectObject(points.parentInstance.model, true);
                if (modelIntersects.length > 0) {
                    idx = points.geometry.lastClosestIndex || 0;
                }
            }
        }

        if (idx !== -1) {
            document.body.style.cursor = 'pointer'; // UX Improvement: Indicate Clickable

            const info = this._getPointInfo(points, material, idx, camera, rawMouse);

            if (this.lastHoveredIndex !== idx) {
                this.lastHoveredIndex = idx;
            }

            // Dynamic Style
            // Dynamic Style based on Side (Renderer Container Context)
            const rect = renderer.domElement.getBoundingClientRect();
            const isLeft = rawMouse.x < rect.left + (rect.width / 2);
            const side = isLeft ? 'left' : 'right';

            // Track changes using composite key (Index + TextureIndex + Side)
            const currentRefString = `${idx}_${info ? info.texIndex : -1}_${side}`;

            if (this.lastTooltipRefString !== currentRefString && info) {
                // --- THEME DEFINITIONS ---
                const isLeft = rawMouse.x < window.innerWidth / 2;
                const isLightTheme = !isLeft;
                const isGoldHUD = info.isDipper; // High-precision identifying flag

                const theme = {
                    bg: isLightTheme ? 'rgba(255, 255, 255, 1.0)' : 'rgba(5, 10, 15, 0.95)',
                    border: isLightTheme ? '1px solid rgba(0, 0, 0, 0.3)' : '1px solid rgba(0, 255, 255, 0.3)',
                    shadow: isLightTheme ? '0 12px 40px rgba(0,0,0,0.2)' : '0 6px 16px rgba(0,0,0,0.6)',
                    title: isLightTheme ? '#000000' : '#00FFFF', // Pure black in Light Mode
                    desc: isLightTheme ? '#111111' : '#FFFFFF',
                    meta: isLightTheme ? '#333333' : '#DCD0BA',
                    divider: isLightTheme ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.2)',
                    gridBg: isLightTheme ? 'linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)'
                        : 'linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px)'
                };

                // Apply Container Styles
                this.tooltip.style.backgroundColor = theme.bg;
                this.tooltip.style.backgroundImage = theme.gridBg;
                this.tooltip.style.backgroundSize = '20px 20px';
                this.tooltip.style.border = theme.border;
                this.tooltip.style.boxShadow = theme.shadow;
                this.tooltip.style.color = theme.desc;
                this.tooltip.style.padding = '20px 24px'; // Increased padding
                this.tooltip.style.width = '300px'; // Consistent Width

                // --- 3D CUBE FACE UPDATES ---
                if (this.faceElements) {
                    const isNaNPos = isNaN(info.col) || isNaN(info.row);
                    this.faceElements.forEach(el => {
                        // REVERT: Standard theme color for all cubes (no gold background)
                        el.style.backgroundColor = isLightTheme ? '#d0d0d0' : '#444444';
                        
                        if (isNaNPos) {
                            el.style.backgroundImage = 'none';
                            el.style.display = 'flex';
                            el.style.alignItems = 'center';
                            el.style.justifyContent = 'center';
                            el.style.fontSize = '20px';
                            el.style.fontWeight = 'bold';
                            el.style.color = theme.title;
                            el.style.fontFamily = "'Fira Code', monospace";
                            el.textContent = '?';
                        } else {
                            if (resources.spriteSheetIcon) {
                                el.style.backgroundImage = `url('${resources.spriteSheetIcon.image.src}')`;
                            }
                            el.textContent = '';
                            const bgX = (info.col / 7) * 100;
                            const bgY = (info.row / 3) * 100;
                            el.style.backgroundPosition = `${bgX}% ${bgY}%`;
                        }
                        
                        // Invert icons for better contrast on light backgrounds
                        el.style.filter = isLightTheme ? 'invert(1) contrast(0.85)' : 'none';
                    });
                }

                // --- CONTENT GENERATION ---
                const headerLine1 = isGoldHUD ? `<div style="font-family: 'Orbitron', sans-serif; font-size: 8px; font-weight: 800; color: ${theme.meta}; letter-spacing: 2px; margin-bottom: 5px; text-transform: uppercase;">CORE EXPERTISE</div>` : '';
                const headerTitle = isGoldHUD ? `⭐ ${info.dipperData.category}` : info.name;
                const subTitle = isGoldHUD ? (info.dipperData.usp_subtitle || 'STRATEGIC NODE') : (info.icon || 'UNKNOWN');
                const focusLine = (isGoldHUD && info.dipperData.meaning) ? `<div style="font-family: 'Fira Code', monospace; font-size: 8px; font-weight: 700; color: ${theme.meta}; letter-spacing: 1.5px; margin-top: 6px; text-transform: uppercase;">FOCUS: ${info.dipperData.meaning}</div>` : '';
                const description = isGoldHUD ? info.dipperData.usp : info.description;

                this.tooltip.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
                        <div style="display: flex; flex-direction: column; gap: 4px;">
                            ${isGoldHUD ? `
                                <div style="font-family: 'Fira Code', monospace; font-size: 8px; font-weight: 800; color: ${theme.meta}; letter-spacing: 2.5px; opacity: 0.8; text-transform: uppercase;">CORE EXPERTISE</div>
                                <div style="font-family: 'Orbitron', monospace; font-weight: 700; font-size: 16px; color: ${theme.title}; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 2px;">⭐ ${info.dipperData.category}</div>
                                <div style="font-family: 'Fira Code', monospace; font-size: 9px; font-weight: 600; color: ${theme.desc}; opacity: 0.7; text-transform: uppercase;">${info.dipperData.meaning} • ${info.dipperData.usp_subtitle.replace(' • ', ' • ')}</div>
                            ` : `
                                <div style="font-family: 'Orbitron', monospace; font-weight: 700; font-size: 14px; margin-bottom: 4px; color: ${theme.title}; text-transform: uppercase; letter-spacing: 1px;">${headerTitle}</div>
                                <div style="font-family: 'Orbitron', monospace; font-size: 10px; font-weight: 600; color: ${theme.desc}; text-transform: uppercase; opacity: 0.6; letter-spacing: 0.5px;">${subTitle}</div>
                            `}
                        </div>
                        <div id="tooltip-icon-container" style="
                            width: ${this.iconSize}px; 
                            height: ${this.iconSize}px;
                            margin-top: 4px;
                        "></div>
                    </div>

                    <div style="width: 100%; height: 1px; background: linear-gradient(90deg, ${theme.divider} 0%, transparent 100%); margin-bottom: 16px;"></div>

                    <div style="font-family: 'Rajdhani', sans-serif; font-size: 13px; font-weight: 400; color: ${theme.desc}; line-height: 1.7; letter-spacing: 0.3px; opacity: 0.95;">
                        ${description}
                    </div>
                `;

                // Append CSS 3D Cube
                const container = this.tooltip.querySelector('#tooltip-icon-container');
                if (container) {
                    if (!this.cubeDOM) {
                        const cube = this._createCubeDOM();
                        container.appendChild(cube);
                    } else {
                        // Re-append existing (reusing DOM)
                        const wrapper = this.cubeDOM.parentElement;
                        container.appendChild(wrapper);
                    }
                }

                this.tooltip.style.display = 'block';

                if (!this.isAnimating) {
                    this.isAnimating = true;
                    this._animateIcon();
                }

                this.lastTooltipRefString = currentRefString;

                // --- 3D -> 2D SYNC: HIGHLIGHT CORRESPONDING CV CATEGORY ---
                if (personaManager && typeof personaManager.highlightSkillByCategory === 'function' && info.isDipper && info.dipperData) {
                    personaManager.highlightSkillByCategory(info.dipperData.category);
                }
            }

            // Smart Positioning (Responsive)
            const x = rawMouse.x;
            const y = rawMouse.y;
            const winW = window.innerWidth;
            const winH = window.innerHeight;

            if (x > winW * 0.6) {
                this.tooltip.style.left = 'auto';
                this.tooltip.style.right = (winW - x + 20) + 'px';
            } else {
                this.tooltip.style.right = 'auto';
                this.tooltip.style.left = (x + 20) + 'px';
            }

            if (y > winH * 0.7) {
                this.tooltip.style.top = 'auto';
                this.tooltip.style.bottom = (winH - y + 20) + 'px';
            } else {
                this.tooltip.style.bottom = 'auto';
                this.tooltip.style.top = (y + 20) + 'px';
            }

        } else {
            document.body.style.cursor = 'auto'; // Reset Cursor
            if (this.lastHoveredIndex !== -1) {
                this.hide();
            }
        }
        raycaster.params.Points.threshold = currentThreshold;
    }

    hide() {
        this.tooltip.style.display = 'none';
        this.lastHoveredIndex = -1;
        this.lastTooltipRefString = null;
        this.isAnimating = false; // Stop loop

        // Clear highlight in CV
        if (personaManager && typeof personaManager.highlightSkillByCategory === 'function') {
            personaManager.highlightSkillByCategory(null);
        }
    }
}
