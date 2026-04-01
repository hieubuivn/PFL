import * as THREE from 'three';

// --- Conversation Manager Module ---

export function initConversationBox(model, scene) {
    if (!model || !scene) {
        console.error("initConversationBox: Missing model or scene");
        return null;
    }

    // 1. Find Target (Spine2 for Stability)
    let targetBone = null;

    // Direct targeting: mixamorigSpine2 is the chest bone (stable, high enough)
    model.traverse((child) => {
        if (child.isBone && child.name === 'mixamorigSpine2') {
            targetBone = child;
        }
    });

    // Fallback chain
    if (!targetBone) {
        model.traverse((child) => {
            if (child.isBone && child.name === 'mixamorigSpine') targetBone = child;
        });
    }
    if (!targetBone) {
        model.traverse((child) => {
            if (child.isBone && child.name === 'mixamorigHips') targetBone = child;
        });
    }
    if (!targetBone) targetBone = model.getObjectByName('Ch23_Hair');

    if (!targetBone) {
        console.warn("initConversationBox: No head found.");
        return null;
    }

    // State
    let _element = null;
    let _targetOpacity = 0.0;
    let _currentOpacity = 0.0;
    let _shoutTimeout = null;
    let _isVisible = false;
    let _screenPos = new THREE.Vector2();

    // Config
    const FADE_SPEED = 3.0;
    const Y_OFFSET = 2.0; // Balanced clearance over the head

    // --- Helper: Create/Update HTML Element ---
    function initHTMLElement() {
        if (document.getElementById('scifi-shout-box')) return;

        _element = document.createElement('div');
        _element.id = 'scifi-shout-box';

        // Match existing appearance with CSS
        Object.assign(_element.style, {
            position: 'absolute', // Relative to experience-container for perfect projection
            top: '0',
            left: '0',
            pointerEvents: 'none',
            zIndex: '5000',
            padding: '10px 20px',
            color: '#ffffff',
            fontFamily: '"Rajdhani", sans-serif',
            fontWeight: '600',
            fontSize: '18px',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: '1.4',
            backgroundColor: 'rgba(5, 10, 25, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1.5px solid #00F0FF',
            boxShadow: '0 0 30px rgba(0, 240, 255, 0.25)',
            opacity: '0',
            whiteSpace: 'pre-wrap',
            transform: 'translate(-50%, -100%) scale(0.8)',
            transition: 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.25)',
            letterSpacing: '1px',
            textTransform: 'none',
            borderRadius: '2px',
            clipPath: 'none'
        });

        // 2. Add "Tail" (Speech Bubble Pointer) - Stroke Only
        const tail = document.createElement('div');
        Object.assign(tail.style, {
            position: 'absolute',
            bottom: '-7.5px', // Aligns the peak of the rotated square
            left: '50%',
            width: '12px',
            height: '12px',
            backgroundColor: 'rgba(5, 10, 25, 0.95)', // Slightly more opaque than parent for masking
            borderLeft: '1.5px solid #00F0FF',
            borderBottom: '1.5px solid #00F0FF',
            transform: 'translateX(-50%) rotate(-45deg)',
            zIndex: '1' // Stays above/under to blend with parent border
        });
        _element.appendChild(tail);

        // 3. Accent Corner Logic (Bottom Right)
        const accent = document.createElement('div');
        Object.assign(accent.style, {
            position: 'absolute',
            bottom: '4px',
            right: '4px',
            width: '8px',
            height: '8px',
            borderRight: '2px solid #00F0FF',
            borderBottom: '2px solid #00F0FF'
        });
        _element.appendChild(accent);

        document.getElementById('experience-container').appendChild(_element);
    }

    function updateElementText(input, options = {}) {
        if (!_element) initHTMLElement();

        let text = input;
        if (Array.isArray(input)) {
            text = input[Math.floor(Math.random() * input.length)];
        }

        // Find or create span content
        let content = _element.querySelector('.text-content');
        if (!content) {
            content = document.createElement('span');
            content.className = 'text-content';
            _element.insertBefore(content, _element.firstChild);
        }
        content.innerText = text;

        // Font size options
        const baseSize = 18;
        let multiplier = 1.0;
        if (options.extraSmall) multiplier = 0.56; // Increased by 25% (from 0.45)
        else if (options.small) multiplier = 0.65;

        _element.style.fontSize = `${baseSize * multiplier}px`;

        // Dynamic scaling based on text length to avoid "weird" empty space
        _element.style.minWidth = text.length > 20 ? '160px' : '95px';
    }

    initHTMLElement();

    // Removed Sprite Initialization


    // --- Public API ---
    const manager = {
        update: (delta) => {
            if (!_element) return;

            // 1. Opacity Transition
            if (Math.abs(_currentOpacity - _targetOpacity) > 0.01) {
                const fadeStep = FADE_SPEED * delta;
                if (_currentOpacity < _targetOpacity) {
                    _currentOpacity = Math.min(_currentOpacity + fadeStep, _targetOpacity);
                } else {
                    _currentOpacity = Math.max(_currentOpacity - fadeStep, _targetOpacity);
                }
                _element.style.opacity = _currentOpacity;
                _element.style.display = _currentOpacity > 0.01 ? 'block' : 'none';
            } else {
                _element.style.opacity = _targetOpacity;
                _element.style.display = _targetOpacity > 0.01 ? 'block' : 'none';
            }

            // 2. Position Sync: 3D to 2D Projection
            if (_targetOpacity > 0.01 && targetBone && scene.camera && scene.renderer) {
                const worldPos = new THREE.Vector3();
                targetBone.getWorldPosition(worldPos);
                worldPos.y += Y_OFFSET;

                // Project to NDC (-1 to +1)
                worldPos.project(scene.camera);

                // Use renderer dimensions for accurate projection in split-screen/layout containers
                const canvas = scene.renderer.domElement;
                const widthHalf = canvas.clientWidth / 2;
                const heightHalf = canvas.clientHeight / 2;

                const x = (worldPos.x * widthHalf) + widthHalf;
                const y = -(worldPos.y * heightHalf) + heightHalf;

                // Update DOM Position (Adding scale based on opacity for 1.0 peak)
                const scale = 0.8 + (0.2 * _currentOpacity);
                _element.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px) scale(${scale})`;
            }
        },

        updateText: (text, options = {}) => {
            updateElementText(text, options);
        },

        show: () => {
            _isVisible = true;
            _targetOpacity = 1.0;
            if (_element) _element.style.display = 'block';
        },

        hide: () => {
            _isVisible = false;
            _targetOpacity = 0.0;
        },

        shout: (text, duration = 3000, options = {}) => {
            // 1. Clean up previous
            if (_shoutTimeout) clearTimeout(_shoutTimeout);

            // 2. Update Content
            updateElementText(text, options);

            // 3. Show
            manager.show();

            // 4. Set Timer to Hide
            _shoutTimeout = setTimeout(() => {
                manager.hide();
                _shoutTimeout = null;
            }, duration);

            return _shoutTimeout;
        },

        clear: () => {
            if (_shoutTimeout) {
                clearTimeout(_shoutTimeout);
                _shoutTimeout = null;
            }
            _targetOpacity = 0.0;
            _currentOpacity = 0.0;
            _isVisible = false;
            if (_element) {
                _element.style.opacity = '0';
                _element.style.display = 'none';
            }
        }
    };

    return manager;
}
