import * as THREE from 'three';

export function addObjectMaterialUniformCustomizer(scene, shortcuts) {
    return new ObjectMaterialUniformCustomizer(scene, shortcuts);
}

export class ObjectMaterialUniformCustomizer {
    /**
     * @param {THREE.Scene} scene The Three.js scene object.
     * @param {string[]|string} [shortcuts] Optional shortcut object names to add.
     */
    constructor(scene, shortcuts = []) {
        this.scene = scene;
        this.targetObject = null;
        this.initialStates = new Map(); // Map<Material, Map<string, any>>

        // Normalize shortcuts: Start with defaults, add provided ones
        let shortcutNames = ['HUDFrame', 'PointsCloud'];
        if (shortcuts) {
            if (Array.isArray(shortcuts)) shortcutNames.push(...shortcuts);
            else if (typeof shortcuts === 'string') shortcutNames.push(shortcuts);
        }
        // Remove duplicates and empty strings
        shortcutNames = [...new Set(shortcutNames.filter(name => !!name))];

        // --- Main Panel Style ---
        const panel = document.createElement('div');
        Object.assign(panel.style, {
            position: 'fixed',
            left: '310px', // Offset from ConstantUniformsCustomizer
            top: '100px',
            background: 'white',
            color: 'black',
            padding: '0',
            borderRadius: '5px',
            fontFamily: 'monospace',
            fontSize: '12px',
            zIndex: '999999',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            minWidth: '300px',
            userSelect: 'none',
            resize: 'both',
            overflow: 'hidden',
            maxHeight: '90vh'
        });

        // --- Header Style ---
        const head = document.createElement('div');
        Object.assign(head.style, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            background: '#333',
            color: 'white',
            padding: '6px 10px',
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
            cursor: 'move',
            flexShrink: '0',
            letterSpacing: '1px'
        });

        const title = document.createElement('span');
        title.textContent = 'Object Uniform Customizer';

        const chevron = document.createElement('span');
        chevron.innerHTML = '&#x25BC;';
        chevron.style.transition = 'transform 0.2s';
        chevron.style.cursor = 'pointer';

        head.appendChild(title);
        head.appendChild(chevron);

        // --- Search Section ---
        const searchHeader = document.createElement('div');
        Object.assign(searchHeader.style, {
            padding: '8px 10px',
            background: '#eee',
            borderBottom: '1px solid #ddd',
            display: 'flex',
            gap: '5px',
            flexShrink: '0'
        });

        const searchInput = document.createElement('input');
        searchInput.placeholder = 'Object Name...';
        Object.assign(searchInput.style, {
            flex: '1',
            padding: '4px 8px',
            border: '1px solid #ccc',
            borderRadius: '3px',
            fontSize: '12px'
        });

        const findButton = document.createElement('button');
        findButton.textContent = 'Find';
        Object.assign(findButton.style, {
            padding: '4px 10px',
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontWeight: 'bold'
        });

        findButton.onclick = () => this.findObject(searchInput.value);
        searchInput.onkeydown = (e) => { if (e.key === 'Enter') this.findObject(searchInput.value); };

        searchHeader.appendChild(searchInput);
        searchHeader.appendChild(findButton);

        // --- Shortcuts Section ---
        const shortcutsRow = document.createElement('div');
        Object.assign(shortcutsRow.style, {
            padding: '4px 10px 8px 10px',
            background: '#eee',
            borderBottom: '1px solid #ddd',
            display: 'flex',
            gap: '8px',
            flexShrink: '0',
            flexWrap: 'wrap'
        });

        const shortcutLabel = document.createElement('span');
        shortcutLabel.textContent = 'Quick:';
        shortcutLabel.style.fontSize = '10px';
        shortcutLabel.style.color = '#666';
        shortcutLabel.style.alignSelf = 'center';
        shortcutsRow.appendChild(shortcutLabel);

        shortcutNames.forEach(objName => {
            const btn = document.createElement('button');
            btn.textContent = objName;
            Object.assign(btn.style, {
                padding: '2px 8px',
                background: '#fafafa',
                border: '1px solid #ccc',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '11px',
                transition: 'background 0.2s'
            });
            btn.onmouseover = () => btn.style.background = '#f0f0f0';
            btn.onmouseout = () => btn.style.background = '#fafafa';
            btn.onclick = () => {
                searchInput.value = objName;
                this.findObject(objName);
            };
            shortcutsRow.appendChild(btn);
        });

        // --- Body Style ---
        const body = document.createElement('div');
        Object.assign(body.style, {
            padding: '8px 10px 10px 10px',
            flex: '1',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minHeight: '0'
        });
        this.body = body;

        // --- Add to document ---
        panel.appendChild(head);
        panel.appendChild(searchHeader);
        panel.appendChild(shortcutsRow);
        panel.appendChild(body);
        document.body.appendChild(panel);

        this.makeDraggableAndCollapsible(panel, head, body, chevron);

        // Prevent wheel events from scrolling the page while interacting with the customizer
        panel.addEventListener('wheel', (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, { passive: false });
    }


    findObject(name) {
        if (!name) return;

        const obj = this.scene.getObjectByName(name);
        if (!obj) {
            console.warn(`Object "${name}" not found.`);
            this.updateStatusText(`Not found: ${name}`, 'red');
            return;
        }

        this.targetObject = obj;
        this.populateUniforms();
        this.updateStatusText(`Found: ${name}`, 'green');
    }

    updateStatusText(text, color) {
        // Clear previous status if any
        if (this.statusTimeout) clearTimeout(this.statusTimeout);

        let statusEl = this.body.querySelector('.search-status');
        if (!statusEl) {
            statusEl = document.createElement('div');
            statusEl.className = 'search-status';
            statusEl.style.fontSize = '10px';
            statusEl.style.marginBottom = '5px';
            this.body.prepend(statusEl);
        }
        statusEl.textContent = text;
        statusEl.style.color = color;

        this.statusTimeout = setTimeout(() => {
            if (statusEl.parentNode) statusEl.remove();
        }, 3000);
    }

    populateUniforms() {
        // Clear all controls
        while (this.body.firstChild) {
            this.body.removeChild(this.body.firstChild);
        }

        if (!this.targetObject) return;

        // Header for the found object
        const objInfo = document.createElement('div');
        objInfo.style.fontWeight = 'bold';
        objInfo.style.color = '#1976d2';
        objInfo.style.marginBottom = '5px';
        objInfo.textContent = `Target: ${this.targetObject.name} (${this.targetObject.type})`;
        this.body.appendChild(objInfo);

        const materials = [];
        if (this.targetObject.material) {
            if (Array.isArray(this.targetObject.material)) materials.push(...this.targetObject.material);
            else materials.push(this.targetObject.material);
        }

        let foundAnyUniforms = false;
        const constantUniformKeys = new Set(Object.keys(this.scene.constantUniform || {}));

        materials.forEach((mat, idx) => {
            if (mat.uniforms) {
                foundAnyUniforms = true;
                this.createGroupHeader(`Material ${materials.length > 1 ? idx : ''}: ${mat.type}`);

                // Track initial states for this material if not already tracked
                if (!this.initialStates.has(mat)) {
                    const states = {};
                    for (const key in mat.uniforms) {
                        const val = mat.uniforms[key].value;
                        if (val instanceof THREE.Color) states[key] = val.clone();
                        else if (val instanceof THREE.Vector4 || val instanceof THREE.Vector3 || val instanceof THREE.Vector2) states[key] = val.clone();
                        else states[key] = val;
                    }
                    this.initialStates.set(mat, states);
                }

                const states = this.initialStates.get(mat);
                const uniforms = mat.uniforms;
                const keys = Object.keys(uniforms);

                // Split into two groups
                const objectSpecificKeys = keys.filter(k => !constantUniformKeys.has(k)).sort();
                const sharedConstantKeys = keys.filter(k => constantUniformKeys.has(k)).sort();

                const renderKeys = (keyList, groupTitle) => {
                    if (keyList.length === 0) return;

                    const subHeader = document.createElement('div');
                    subHeader.textContent = `--- ${groupTitle} ---`;
                    subHeader.style.fontSize = '10px';
                    subHeader.style.color = '#888';
                    subHeader.style.marginTop = '4px';
                    subHeader.style.marginBottom = '2px';
                    subHeader.style.textAlign = 'center';
                    this.body.appendChild(subHeader);

                    keyList.forEach(key => {
                        const uniform = uniforms[key];
                        const value = uniform.value;
                        const initialValue = states[key];
                        let control;

                        if (value instanceof THREE.Color) {
                            control = this.createColorControl(key, value, initialValue, (newVal) => {
                                uniform.value.set(newVal);
                            });
                        } else if (value instanceof THREE.Vector4 || value instanceof THREE.Vector3 || value instanceof THREE.Vector2) {
                            const components = (value instanceof THREE.Vector4) ? ['x', 'y', 'z', 'w'] : (value instanceof THREE.Vector3) ? ['x', 'y', 'z'] : ['x', 'y'];
                            control = this.createVectorControl(key, value, components, initialValue, () => { });
                        } else if (typeof value === 'number') {
                            control = this.createNumberControl(key, value, initialValue, (newVal) => {
                                uniform.value = newVal;
                            }, { min: -10, max: 10, step: 0.01 });
                        } else if (typeof value === 'boolean') {
                            control = this.createCheckboxControl(key, value, initialValue, (newVal) => {
                                uniform.value = newVal;
                            });
                        }

                        if (control) this.body.appendChild(control);
                    });
                };

                // Render Groups: Specific first, then Shared
                renderKeys(objectSpecificKeys, "Object Specific");
                renderKeys(sharedConstantKeys, "Shared Constants");
            }
        });

        if (!foundAnyUniforms) {
            const msg = document.createElement('div');
            msg.textContent = 'No materials with uniforms found on this object.';
            msg.style.fontStyle = 'italic';
            msg.style.color = '#666';
            this.body.appendChild(msg);
        }
    }



    // --- Helper UI Methods ---

    createCopyButton(text) {
        const btn = document.createElement('span');
        btn.textContent = '📋'; // Copy icon
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '10px';
        btn.style.marginRight = '4px';
        btn.title = 'Copy uniform name';

        btn.onclick = (e) => {
            e.stopPropagation(); // Prevent triggering row clicks if any
            navigator.clipboard.writeText(text).then(() => {
                const original = btn.textContent;
                btn.textContent = '✅';
                setTimeout(() => { btn.textContent = original; }, 1000);
            }).catch(err => {
                console.error('Failed to copy code: ', err);
            });
        };
        return btn;
    }

    updateLabelState(labelSpan, current, initial) {
        let changed = false;
        if (initial instanceof THREE.Color) changed = !current.equals(initial);
        else if (initial instanceof THREE.Vector4 || initial instanceof THREE.Vector3 || initial instanceof THREE.Vector2) changed = !current.equals(initial);
        else changed = current !== initial;

        labelSpan.style.color = changed ? 'red' : 'black';
        labelSpan.style.cursor = 'pointer';
        labelSpan.title = changed ? 'Click to reset to default' : '';
    }

    createGroupHeader(text) {
        const div = document.createElement('div');
        div.textContent = text;
        div.style.fontWeight = 'bold';
        div.style.marginTop = '10px';
        div.style.marginBottom = '5px';
        div.style.borderBottom = '1px solid #ccc';
        div.style.paddingBottom = '2px';
        this.body.appendChild(div);
    }

    createVectorControl(label, vector, components, initial, onChange) {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.gap = '8px';

        const labelSpan = document.createElement('span');
        labelSpan.textContent = label;
        labelSpan.style.fontWeight = '500';
        labelSpan.style.width = '120px';

        const copyBtn = this.createCopyButton(label);
        row.appendChild(copyBtn);

        const updateAll = () => {
            this.updateLabelState(labelSpan, vector, initial);
            if (onChange) onChange();
        };

        labelSpan.onclick = () => {
            if (initial) {
                vector.copy(initial);
                inputs.forEach((input, i) => { input.value = vector[components[i]].toFixed(3); });
                updateAll();
            }
        };

        const inputBox = document.createElement('div');
        inputBox.style.display = 'flex';
        inputBox.style.gap = '8px';

        const inputs = [];
        components.forEach(axis => {
            const input = document.createElement('input');
            input.type = 'number';
            input.value = vector[axis]; // Full precision
            input.step = 'any';
            input.style.width = '50px';
            input.style.fontFamily = 'monospace';
            input.style.fontSize = '12px';
            input.style.padding = '2px 4px';
            input.style.border = '1px solid #bbb';
            input.style.borderRadius = '3px';
            input.oninput = () => {
                let val = parseFloat(input.value);
                if (isNaN(val)) val = 0;
                vector[axis] = val;
                updateAll();
            };
            inputBox.appendChild(input);
            inputs.push(input);
        });

        this.updateLabelState(labelSpan, vector, initial);
        row.appendChild(labelSpan);
        row.appendChild(inputBox);

        // Add context menu or way to copy values if needed, 
        // but for vectors we'll stick to direct input as per user's prompt focus on sliders
        return row;
    }

    createColorControl(label, color, initial, onChange) {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.gap = '8px';

        const labelSpan = document.createElement('span');
        labelSpan.textContent = label;
        labelSpan.style.width = '120px';
        labelSpan.style.fontWeight = '500';

        const copyBtn = this.createCopyButton(label);
        row.appendChild(copyBtn);

        const input = document.createElement('input');
        input.type = 'color';
        input.value = '#' + color.getHexString();
        input.style.border = '1px solid #bbb';
        input.style.padding = '0';
        input.style.height = '24px';

        const updateAll = (val) => {
            input.value = val;
            onChange(val);
            this.updateLabelState(labelSpan, color, initial);
        };

        labelSpan.onclick = () => {
            if (initial) {
                const hex = '#' + initial.getHexString();
                updateAll(hex);
            }
        };

        input.oninput = () => updateAll(input.value);

        this.updateLabelState(labelSpan, color, initial);
        row.appendChild(labelSpan);
        row.appendChild(input);
        return row;
    }

    createNumberControl(label, value, initial, onChange, options) {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.flexDirection = 'column';
        row.style.gap = '4px';

        const mainRow = document.createElement('div');
        mainRow.style.display = 'flex';
        mainRow.style.alignItems = 'center';
        mainRow.style.gap = '8px';

        const labelSpan = document.createElement('span');
        labelSpan.textContent = label;
        labelSpan.style.width = '120px';
        labelSpan.style.fontWeight = '500';
        labelSpan.style.fontSize = '11px';
        labelSpan.style.overflow = 'hidden';
        labelSpan.style.textOverflow = 'ellipsis';
        labelSpan.style.whiteSpace = 'nowrap';

        const copyBtn = this.createCopyButton(label);
        mainRow.appendChild(copyBtn);

        const rangeInput = document.createElement('input');
        rangeInput.type = 'range';
        rangeInput.min = options?.min ?? -10;
        rangeInput.max = options?.max ?? 10;
        rangeInput.step = 'any'; // Always use 'any' for the slider's internal state to avoid snapping during manual input
        rangeInput.value = value;
        rangeInput.style.flex = '1';

        const numberInput = document.createElement('input');
        numberInput.type = 'text'; // Use text to prevent browser 'number' quirks (like stripping decimals)
        numberInput.value = value;
        numberInput.style.width = '70px';
        numberInput.style.border = '1px solid #bbb';
        numberInput.style.borderRadius = '3px';
        numberInput.style.padding = '2px 4px';
        numberInput.style.fontSize = '11px';

        // Settings Dropdown
        const settingsBtn = document.createElement('span');
        settingsBtn.innerHTML = '&#x2332;'; // Chevrolet-like icon (v-shape)
        settingsBtn.style.cursor = 'pointer';
        settingsBtn.style.fontSize = '14px';
        settingsBtn.style.color = '#888';
        settingsBtn.title = 'Range Settings';

        const settingsPanel = document.createElement('div');
        Object.assign(settingsPanel.style, {
            display: 'none',
            background: '#f9f9f9',
            padding: '5px',
            border: '1px solid #ddd',
            borderRadius: '3px',
            marginTop: '2px',
            fontSize: '10px',
            gap: '10px',
            alignItems: 'center',
            justifyContent: 'space-between'
        });

        const createConfigInput = (label, val, setter) => {
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.gap = '2px';
            const sLabel = document.createElement('span');
            sLabel.textContent = label;
            const sInput = document.createElement('input');
            sInput.type = 'number';
            sInput.step = 'any';
            sInput.value = val;
            sInput.style.width = '45px';
            sInput.style.fontSize = '10px';
            sInput.oninput = () => setter(parseFloat(sInput.value));
            container.appendChild(sLabel);
            container.appendChild(sInput);
            return container;
        };

        settingsPanel.appendChild(createConfigInput('min:', rangeInput.min, (v) => { rangeInput.min = v; }));
        settingsPanel.appendChild(createConfigInput('max:', rangeInput.max, (v) => { rangeInput.max = v; }));
        settingsPanel.appendChild(createConfigInput('step:', options?.step ?? 0.01, (v) => { /* internal step is 'any', this just visualizes/configures wheel delta if needed */ }));

        settingsBtn.onclick = () => {
            const isVisible = settingsPanel.style.display === 'flex';
            settingsPanel.style.display = isVisible ? 'none' : 'flex';
            settingsBtn.style.color = isVisible ? '#888' : '#1976d2';
        };

        const updateAll = (val, skipNumberInput = false) => {
            if (isNaN(val)) return;

            // Auto-expand range to accept any value regardless of initial config
            const curMin = parseFloat(rangeInput.min);
            const curMax = parseFloat(rangeInput.max);
            if (val < curMin) {
                rangeInput.min = val - Math.abs(val) * 0.1 - 1;
            } else if (val > curMax) {
                rangeInput.max = val + Math.abs(val) * 0.1 + 1;
            }

            rangeInput.value = val;
            if (!skipNumberInput) {
                numberInput.value = val;
            }
            onChange(val);
            this.updateLabelState(labelSpan, val, initial);
        };

        labelSpan.onclick = () => updateAll(initial);

        rangeInput.oninput = () => updateAll(parseFloat(rangeInput.value));
        numberInput.oninput = () => {
            // Handle typing without setting value back (skipping)
            const val = parseFloat(numberInput.value);
            if (!isNaN(val)) updateAll(val, true);
        };

        // Clean up formatting on blur
        numberInput.onblur = () => {
            const val = parseFloat(numberInput.value);
            if (!isNaN(val)) {
                numberInput.value = val;
            } else {
                // Restore last valid value
                numberInput.value = rangeInput.value;
            }
        };

        // Scroll to slide
        rangeInput.addEventListener('wheel', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const step = parseFloat(rangeInput.step) || 0.01;
            const direction = e.deltaY < 0 ? 1 : -1;
            const newVal = parseFloat(rangeInput.value) + direction * step * 5; // Multiply for feel
            updateAll(newVal);
        }, { passive: false });

        this.updateLabelState(labelSpan, value, initial);
        mainRow.appendChild(labelSpan);
        mainRow.appendChild(rangeInput);
        mainRow.appendChild(numberInput);
        mainRow.appendChild(settingsBtn);

        row.appendChild(mainRow);
        row.appendChild(settingsPanel);
        return row;
    }

    createCheckboxControl(label, value, initial, onChange) {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.gap = '8px';

        const labelSpan = document.createElement('label');
        labelSpan.textContent = label;
        labelSpan.style.width = '120px';
        labelSpan.style.fontWeight = '500';
        labelSpan.style.cursor = 'pointer';

        const copyBtn = this.createCopyButton(label);
        row.appendChild(copyBtn);

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = !!value;

        const updateAll = (val) => {
            input.checked = val;
            onChange(val);
            this.updateLabelState(labelSpan, val, initial);
        };

        labelSpan.onclick = (e) => {
            if (e.target === labelSpan) {
                updateAll(initial);
                e.preventDefault();
            }
        };

        input.onchange = () => updateAll(input.checked);

        this.updateLabelState(labelSpan, value, initial);
        row.appendChild(labelSpan);
        row.appendChild(input);
        return row;
    }

    makeDraggableAndCollapsible(panel, head, body, chevron) {
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        let dragMoved = false;

        head.style.cursor = 'move';

        head.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragMoved = false;
            const rect = panel.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            document.body.style.userSelect = 'none';
        }, { passive: true });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            dragMoved = true;
            panel.style.left = (e.clientX - dragOffsetX) + 'px';
            panel.style.top = (e.clientY - dragOffsetY) + 'px';
        }, { passive: true });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.userSelect = '';
                setTimeout(() => { dragMoved = false; }, 0);
            }
        });

        let collapsed = false;
        head.addEventListener('click', () => {
            if (dragMoved) return;
            collapsed = !collapsed;
            body.style.display = collapsed ? 'none' : 'flex';
            chevron.innerHTML = collapsed ? '&#x25B2;' : '&#x25BC;';
        }, { passive: true });
    }
}
