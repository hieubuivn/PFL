
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

export class RapierBodyCustomizer {
    constructor(scene) {
        this.scene = scene;
        this.initialState = new Map(); // Store initial values for active collider
        this.createPanel();
    }

    createPanel() {
        // --- Main Panel ---
        this.panel = document.createElement('div');
        Object.assign(this.panel.style, {
            position: 'fixed',
            right: '10px',
            top: '100px',
            background: 'white',
            color: 'black',
            padding: '0',
            borderRadius: '5px',
            fontFamily: 'monospace',
            fontSize: '11px',
            zIndex: '999999',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            width: '280px',
            maxHeight: '80vh',
            overflow: 'hidden'
        });

        // --- Header ---
        const head = document.createElement('div');
        Object.assign(head.style, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#333',
            color: 'white',
            padding: '8px 10px',
            fontWeight: 'bold',
            cursor: 'move'
        });
        head.textContent = "Rapier Body Inspector";

        // --- Close Button ---
        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = "&times;";
        closeBtn.style.cursor = "pointer";
        closeBtn.onclick = () => this.panel.style.display = 'none';
        head.appendChild(closeBtn);
        this.panel.appendChild(head);

        // --- Search Section ---
        const searchRow = document.createElement('div');
        Object.assign(searchRow.style, { padding: '10px', background: '#eee', display: 'flex', gap: '5px' });

        this.input = document.createElement('input');
        Object.assign(this.input.style, { flex: '1', padding: '4px', border: '1px solid #ccc' });
        this.input.placeholder = "Obj Name / Bone Name";
        this.input.onkeydown = (e) => { if (e.key === 'Enter') this.inspect(this.input.value); };

        const searchBtn = document.createElement('button');
        searchBtn.textContent = "🔍";
        searchBtn.onclick = () => this.inspect(this.input.value);

        searchRow.appendChild(this.input);
        searchRow.appendChild(searchBtn);
        this.panel.appendChild(searchRow);

        // --- Content Area ---
        this.content = document.createElement('div');
        Object.assign(this.content.style, { padding: '10px', overflowY: 'auto' });
        this.panel.appendChild(this.content);

        document.body.appendChild(this.panel);
        this.makeDraggable(head);
    }

    makeDraggable(handle) {
        let isDragging = false;
        let startX, startY, initLeft, initTop;

        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = this.panel.getBoundingClientRect();
            initLeft = rect.left;
            initTop = rect.top;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            this.panel.style.left = (initLeft + e.clientX - startX) + 'px';
            this.panel.style.top = (initTop + e.clientY - startY) + 'px';
            this.panel.style.right = 'auto'; // Disable right-lock
        });

        document.addEventListener('mouseup', () => isDragging = false);
    }

    inspect(name) {
        this.content.innerHTML = "";
        this.initialState.clear(); // Reset initial states
        if (!name) return;

        console.log(`[RapierInspector] Searching for: ${name}`);

        // 1. Try Direct Object UserData
        let targetBody = null;
        let targetCollider = null;

        const obj = this.scene.getObjectByName(name);
        if (obj && obj.userData && obj.userData.collider) {
            targetCollider = obj.userData.collider;
            targetBody = obj.userData.body;
            console.log("Found via userData.collider on:", obj.name);
        }

        // 2. Try SkinnedMeshBindings (Bone Tracking)
        if (!targetCollider && this.scene.skinnedMeshBodies) {
            const found = this.scene.skinnedMeshBodies.find(b => b.trackTarget && b.trackTarget.name === name);
            if (found) {
                targetBody = found;
                targetCollider = found.collider(0); // Assume 1st collider
                console.log("Found via SkinnedMeshBodies tracking:", name);
            }
        }

        if (!targetCollider) {
            this.content.innerHTML = `<div style='color:red;'>No Collider found for "${name}"</div>`;
            return;
        }

        this.targetCollider = targetCollider;

        // Capture logic logic will happen inside buildUI as we read values
        this.buildUI(targetCollider);
    }

    // --- Helpers to Get Relative Transform (Safe Fallback) ---
    getRotationWrtParent(collider) {
        if (collider.rotationWrtParent) return collider.rotationWrtParent();

        // Calculated Fallback
        const body = collider.parent();
        if (!body) return collider.rotation();

        const bRot = body.rotation();
        const cRot = collider.rotation();

        const bQ = new THREE.Quaternion(bRot.x, bRot.y, bRot.z, bRot.w);
        const cQ = new THREE.Quaternion(cRot.x, cRot.y, cRot.z, cRot.w);

        // local = bodyInverse * global
        return bQ.invert().multiply(cQ);
    }

    getTranslationWrtParent(collider) {
        if (collider.translationWrtParent) return collider.translationWrtParent();

        const body = collider.parent();
        if (!body) return collider.translation();

        const bPos = body.translation();
        const cPos = collider.translation();
        const bRot = body.rotation();

        const bQ = new THREE.Quaternion(bRot.x, bRot.y, bRot.z, bRot.w);
        const relPos = new THREE.Vector3(cPos.x - bPos.x, cPos.y - bPos.y, cPos.z - bPos.z);

        relPos.applyQuaternion(bQ.invert());
        return relPos;
    }


    buildUI(collider) {
        const shape = collider.shape;

        let shapeName = "Unknown";
        if (shape instanceof RAPIER.Ball) shapeName = "Ball";
        if (shape instanceof RAPIER.Cuboid) shapeName = "Cuboid";
        if (shape instanceof RAPIER.Capsule) shapeName = "Capsule";

        this.addHeader(`Collider: ${shapeName}`);

        // --- Dimensions ---
        if (shape instanceof RAPIER.Ball) {
            this.addSmartControl("Radius", shape.radius, (v) => this.updateGeometry(collider, 'radius', v));
        } else if (shape instanceof RAPIER.Capsule) {
            // Swap order: HalfHeight first, then Radius
            this.addSmartControl("HalfHeight", shape.halfHeight, (v) => this.updateGeometry(collider, 'halfHeight', v));
            this.addSmartControl("Radius", shape.radius, (v) => this.updateGeometry(collider, 'radius', v));
        } else if (shape instanceof RAPIER.Cuboid) {
            this.addSmartControl("HalfExt X", shape.halfExtents.x, (v) => this.updateGeometry(collider, 'hx', v));
            this.addSmartControl("HalfExt Y", shape.halfExtents.y, (v) => this.updateGeometry(collider, 'hy', v));
            this.addSmartControl("HalfExt Z", shape.halfExtents.z, (v) => this.updateGeometry(collider, 'hz', v));
        }

        // --- Offsets (Local to Body) ---
        const t = this.getTranslationWrtParent(collider);
        const r = this.getRotationWrtParent(collider);
        const euler = new THREE.Euler().setFromQuaternion(new THREE.Quaternion(r.x, r.y, r.z, r.w));

        this.addHeader("Offset (Pos)");
        this.addSmartControl("X", t.x, (v) => this.updateOffset(collider, 'x', v), 0.05, "posX");
        this.addSmartControl("Y", t.y, (v) => this.updateOffset(collider, 'y', v), 0.05, "posY");
        this.addSmartControl("Z", t.z, (v) => this.updateOffset(collider, 'z', v), 0.05, "posZ");

        this.addHeader("Offset (Rot Deg)");
        this.addSmartControl("X", THREE.MathUtils.radToDeg(euler.x), (v) => this.updateRotation(collider, 'x', v), 1.0, "rotX");
        this.addSmartControl("Y", THREE.MathUtils.radToDeg(euler.y), (v) => this.updateRotation(collider, 'y', v), 1.0, "rotY");
        this.addSmartControl("Z", THREE.MathUtils.radToDeg(euler.z), (v) => this.updateRotation(collider, 'z', v), 1.0, "rotZ");
    }

    addHeader(text) {
        const d = document.createElement('div');
        d.textContent = text;
        d.style.fontWeight = "bold";
        d.style.marginTop = "10px";
        d.style.borderBottom = "1px solid #ccc";
        this.content.appendChild(d);
    }

    addSmartControl(label, val, onChange, step = 0.01, uniqueKey = null) {
        // Generate a key if not provided (simple labels might clash, but ok active session)
        const key = uniqueKey || label;

        // Store Initial State if not exists
        if (!this.initialState.has(key)) {
            this.initialState.set(key, val);
        }
        const initialVal = this.initialState.get(key);

        // --- Container ---
        const container = document.createElement('div');
        Object.assign(container.style, { marginTop: '5px', display: 'flex', flexDirection: 'column' });

        // --- Row 1: Label | Slider | Input | Config ---
        const row = document.createElement('div');
        Object.assign(row.style, { display: 'flex', gap: '5px', alignItems: 'center' });

        const lbl = document.createElement('label');
        lbl.textContent = label;
        lbl.style.width = "70px";
        lbl.style.cursor = "pointer";
        lbl.title = "Click to Reset";

        // Determine Defaults
        let defaultMin = (val < 0) ? -5 : 0;
        let defaultMax = (val < 0) ? 5 : 5;
        if (Math.abs(val) > 5) { defaultMin = -20; defaultMax = 20; }

        const slider = document.createElement('input');
        slider.type = "range";
        slider.min = defaultMin;
        slider.max = defaultMax;
        slider.step = step;
        slider.value = val;
        Object.assign(slider.style, { flex: '1', minWidth: '50px' });

        const numberInput = document.createElement('input');
        Object.assign(numberInput.style, { width: '45px' });
        numberInput.type = "number";
        numberInput.step = step;
        numberInput.value = (Math.abs(val) < 0.0001) ? 0 : val;

        const configBtn = document.createElement('button');
        configBtn.textContent = "⚙️";
        Object.assign(configBtn.style, { cursor: 'pointer', border: 'none', background: 'transparent', width: '20px', padding: '0' });

        row.appendChild(lbl);
        row.appendChild(slider);
        row.appendChild(numberInput);
        row.appendChild(configBtn);

        // --- Row 2: Config (Hidden) ---
        const configRow = document.createElement('div');
        Object.assign(configRow.style, {
            display: 'none',
            gap: '5px',
            alignItems: 'center',
            fontSize: '10px',
            paddingLeft: '10px', // Reduced padding
            marginTop: '2px',
            flexWrap: 'wrap', // FIX: Wrap to avoid horizontal scroll
            background: '#f9f9f9',
            padding: '4px',
            borderRadius: '4px'
        });

        const createConfigInput = (placeholder, def, update) => {
            const i = document.createElement('input');
            i.type = "number";
            i.value = def;
            i.placeholder = placeholder;
            Object.assign(i.style, { width: '40px' });
            i.onchange = () => { update(parseFloat(i.value)); sync(); };
            return i;
        };

        configRow.appendChild(document.createTextNode("Min:"));
        configRow.appendChild(createConfigInput("Min", defaultMin, (v) => slider.min = v));
        configRow.appendChild(document.createTextNode("Max:"));
        configRow.appendChild(createConfigInput("Max", defaultMax, (v) => slider.max = v));
        configRow.appendChild(document.createTextNode("Step:"));
        configRow.appendChild(createConfigInput("Step", step, (v) => { slider.step = v; numberInput.step = v; }));

        configBtn.onclick = () => {
            configRow.style.display = (configRow.style.display === 'none') ? 'flex' : 'none';
        };

        container.appendChild(row);
        container.appendChild(configRow);
        this.content.appendChild(container);

        // --- Logic ---

        const checkDiff = () => {
            const curr = parseFloat(numberInput.value);
            if (Math.abs(curr - initialVal) > 0.001) {
                lbl.style.color = "red";
                lbl.style.fontWeight = "bold";
            } else {
                lbl.style.color = "black";
                lbl.style.fontWeight = "normal";
            }
        };
        checkDiff();

        const sync = () => {
            const v = parseFloat(numberInput.value);
            onChange(v);
            checkDiff();
        };

        slider.oninput = () => {
            numberInput.value = slider.value;
            sync();
        };

        numberInput.onchange = () => {
            slider.value = numberInput.value;
            sync();
        };

        // Reset Handler
        lbl.onclick = () => {
            numberInput.value = initialVal;
            slider.value = initialVal;
            sync();
        };
    }

    // --- Update Logic ---

    updateGeometry(collider, prop, value) {
        const body = collider.parent();
        const oldShape = collider.shape;

        let newShapeDesc;

        // 1. Capture current Radius/Height/etc
        let r, hh, hx, hy, hz;

        if (oldShape instanceof RAPIER.Ball) {
            r = (prop === 'radius') ? value : oldShape.radius;
            newShapeDesc = RAPIER.ColliderDesc.ball(r);
        }
        else if (oldShape instanceof RAPIER.Capsule) {
            r = (prop === 'radius') ? value : oldShape.radius;
            hh = (prop === 'halfHeight') ? value : oldShape.halfHeight;
            newShapeDesc = RAPIER.ColliderDesc.capsule(hh, r);
        }
        else if (oldShape instanceof RAPIER.Cuboid) {
            hx = (prop === 'hx') ? value : oldShape.halfExtents.x;
            hy = (prop === 'hy') ? value : oldShape.halfExtents.y;
            hz = (prop === 'hz') ? value : oldShape.halfExtents.z;
            newShapeDesc = RAPIER.ColliderDesc.cuboid(hx, hy, hz);
        }

        if (!newShapeDesc) return;

        // Preserve Offsets
        const t = this.getTranslationWrtParent(collider);
        const rot = this.getRotationWrtParent(collider);
        newShapeDesc.setTranslation(t.x, t.y, t.z);
        newShapeDesc.setRotation(rot);

        // Swap
        this.scene.world.removeCollider(collider, false);
        const newCollider = this.scene.world.createCollider(newShapeDesc, body);
        this.targetCollider = newCollider;

        console.log("Updated Geometry:", prop, value);

        // Refresh UI with new collider
        this.content.innerHTML = "";
        this.buildUI(newCollider);
    }

    updateOffset(collider, axis, value) {
        if (collider.setTranslationWrtParent) {
            const t = { ...this.getTranslationWrtParent(collider) };
            t[axis] = value;
            collider.setTranslationWrtParent(t);
        } else {
            console.warn("setTranslationWrtParent missing. Recreating collider.");
        }
    }

    updateRotation(collider, axis, degrees) {
        if (collider.setRotationWrtParent) {
            const r = this.getRotationWrtParent(collider);
            const euler = new THREE.Euler().setFromQuaternion(new THREE.Quaternion(r.x, r.y, r.z, r.w));
            euler[axis] = THREE.MathUtils.degToRad(degrees);
            const newQ = new THREE.Quaternion().setFromEuler(euler);
            collider.setRotationWrtParent({ x: newQ.x, y: newQ.y, z: newQ.z, w: newQ.w });
        } else {
            console.warn("setRotationWrtParent missing.");
        }
    }
}

export function addRapierBodyCustomizer(scene) {
    return new RapierBodyCustomizer(scene);
}
