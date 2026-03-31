// Vanilla JS Kinetic Loop for CV panel "Gravity Fall" Easter Egg
// Strict ESM Module matching the project's technical standards

import TWEEN from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/tween.module.min.js';

export function cvFall() {
    // //console.log('[cvFall] Called. Current state:', window._cvState);
    // Prevent multiple triggers
    if (window._cvState === 'falling' || window._cvState === 'shattered' || window._cvState === 'resetting') {
        // //console.log('[cvFall] Aborting: already falling, shattered, or resetting.');
        return;
    }

    // Direct translation: If it's already sucked to the left, seamlessly switch its physics engine to freefall
    if (window._cvState === 'sucking') {
        // //console.log('[cvFall] Transitioning from sucking to falling.');
        window._cvState = 'falling';
        return;
    }

    window._cvState = 'falling';

    const cvContainer = document.getElementById('cv-container');
    const cvContent = document.getElementById('cv-content');
    const cvScroller = document.getElementById('cv-scroller');

    if (!cvContainer || !cvContent) return;

    // 1. Force the panel open if it's currently closed
    if (cvContainer.classList.contains('collapsed')) {
        cvContainer.classList.remove('collapsed');
        // Wait for the CSS sliding transition (0.35s defined in layout.css) before popping elements out
        setTimeout(startPhysicsFall, 400);
    } else {
        startPhysicsFall();
    }

    function startPhysicsFall() {
        if (window._cvState === 'resetting' || window._cvState === 'idle') {
            //console.log('[cvFall] Race condition intercepted. Aborting physics fall.');
            return;
        }

        // Solidify the fall state (in case transitioned from sucking)
        window._cvState = 'falling';

        // Unclip boundaries so elements can fall beyond the panel bounds
        cvContainer.style.overflow = 'visible';

        // EXCEPTION: Keep the grid background intact 
        if (cvScroller) {
            cvScroller.style.overflow = 'visible';
            // We no longer remove background-image or background-color here!
        }

        // EXCEPTION: Keep the UI / Fixed layer at the top intact
        // We removed the code that previously forced fixedHeader.style.display = 'none'.

        const mainUi = document.getElementById('main-ui');
        if (mainUi) mainUi.style.pointerEvents = 'none';

        cvContent.style.position = 'relative';

        const targetSelectors = [
            '.header h1', '.header .role', '.contact-info span', '.contact-info a',
            '.collapsible-header',
            '.role-header .company', '.title-row .job-title', '.title-row .date',
            '.skills-grid span',
            '.contact-grid div',
            '.terminal-footer div',
            '.collapsible-content p',
            '.collapsible-content ul li'
        ];

        const coreBlocks = Array.from(cvContent.querySelectorAll(targetSelectors.join(', ')));

        // PERFORMANCE: Viewport-Aware Shattering
        const scrollerRect = cvScroller.getBoundingClientRect();

        // Traverse blocks & split text into word-spans
        const wordSpans = [];
        coreBlocks.forEach(block => {
            if (block.querySelector('svg') || block.querySelector('img')) return;

            // VIEWPORT CHECK: If the block is not visible, don't shatter it (hidden optimization)
            const blockRect = block.getBoundingClientRect();
            const isVisible = (
                blockRect.bottom >= scrollerRect.top &&
                blockRect.top <= scrollerRect.bottom
            );

            if (!block.dataset.originalHtml) {
                block.dataset.originalHtml = block.innerHTML;
            }

            if (!isVisible) {
                // If it's not visible, we don't break it into spans. 
                // We just hide it so it 'disappears' with the rest of the destruction.
                block.style.visibility = 'hidden';
                block.dataset.wasHiddenByViewport = 'true';
                return;
            }

            const treeWalker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, null, false);
            const textNodes = [];
            while (treeWalker.nextNode()) {
                textNodes.push(treeWalker.currentNode);
            }

            textNodes.forEach(node => {
                if (node.nodeValue.trim() === '') return;

                const words = node.nodeValue.split(/(\s+)/);
                const fragment = document.createDocumentFragment();

                words.forEach(word => {
                    if (word.trim() === '') {
                        fragment.appendChild(document.createTextNode(word));
                    } else {
                        const span = document.createElement('span');
                        span.textContent = word;
                        span.style.display = 'inline-block';
                        span.classList.add('falling-word');
                        wordSpans.push(span);
                        fragment.appendChild(span);
                    }
                });
                node.parentNode.replaceChild(fragment, node);
            });
        });

        // 1.5. Pre-compute and freeze inherited styles before detaching the text from their native CSS classes.
        // If we don't do this, the words lose their CSS hierarchy (like .role-header coloring or h1 font-sizes) when moved.
        // PERFORMANCE: Read all styles first, then write all styles, to prevent catastrophic layout thrashing!
        const computedStylesMap = wordSpans.map(span => {
            const comp = window.getComputedStyle(span);
            return {
                sColor: comp.color,
                sFontSize: comp.fontSize,
                sFontWeight: comp.fontWeight,
                sLetterSpacing: comp.letterSpacing,
                sTextTransform: comp.textTransform,
                sFontFamily: comp.fontFamily,
                sLineHeight: comp.lineHeight,
                sTextShadow: comp.textShadow !== 'none' ? comp.textShadow : ''
            };
        });

        // Lock them as explicit inline styles in a separate write-only loop
        wordSpans.forEach((span, i) => {
            const css = computedStylesMap[i];
            span.style.color = css.sColor;
            span.style.fontSize = css.sFontSize;
            span.style.fontWeight = css.sFontWeight;
            span.style.letterSpacing = css.sLetterSpacing;
            span.style.textTransform = css.sTextTransform;
            span.style.fontFamily = css.sFontFamily;
            span.style.lineHeight = css.sLineHeight;
            span.style.textShadow = css.sTextShadow;
            span.style.whiteSpace = 'nowrap';
        });

        const parentRect = cvContent.getBoundingClientRect();

        // 2. Grab EVERYTHING we want to fall: Word spans + Structure wrappers
        const extraTargets = Array.from(cvContent.querySelectorAll('.header-photo, .scanline-deco, .fui-corners, .audience-badge'));
        const domTargets = [...wordSpans, ...extraTargets];

        const rectMap = domTargets.map(el => el.getBoundingClientRect());
        const particles = [];

        domTargets.forEach((el, index) => {
            const rect = rectMap[index];
            if (rect.width === 0 || rect.height === 0) return;

            const localX = rect.left - parentRect.left;
            const localY = rect.top - parentRect.top;

            const isWord = el.classList.contains('falling-word');
            let physicalEl = el;

            // Clone images and decos so we don't break their DOM tree permanently 
            if (!isWord) {
                physicalEl = el.cloneNode(true);
                physicalEl.classList.add('falling-clone');
                // Ensure no conflicting margins on clones
                physicalEl.style.margin = '0';
            }

            particles.push({
                el: physicalEl,
                isClone: !isWord,
                x: localX,
                y: localY,
                startX: localX,
                startY: localY,
                width: rect.width,
                height: rect.height,
                vx: window._cvState === 'ritual' ? (Math.random() - 0.5) * 5 : (Math.random() - 0.5) * 12,
                vy: window._cvState === 'ritual' ? 0 : (Math.random() * -8) - 2,
                rx: Math.random() * 30 - 15,
                ry: Math.random() * 30 - 15,
                rz: Math.random() * 30 - 15,
                vrx: (Math.random() - 0.5) * (window._cvState === 'ritual' ? 30 : 6),
                vry: (Math.random() - 0.5) * (window._cvState === 'ritual' ? 30 : 6),
                vrz: (Math.random() - 0.5) * (window._cvState === 'ritual' ? 30 : 6),
            });

            // Hide the original un-cloned elements immediately visually
            if (!isWord) {
                el.style.visibility = 'hidden';
            }
        });

        // 3. Detach/Spawn elements
        particles.forEach(p => {
            cvContent.appendChild(p.el);

            p.el.style.position = 'absolute';
            p.el.style.left = p.x + 'px';
            p.el.style.top = p.y + 'px';
            p.el.style.width = p.width + 'px';
            p.el.style.height = p.height + 'px';
            p.el.style.margin = '0';
            p.el.style.transition = 'none';
            p.el.style.animation = 'none';
            p.el.style.boxSizing = 'border-box';
            p.el.style.userSelect = 'none';
            p.el.style.willChange = 'transform'; // hardware acceleration
            p.el.style.transformOrigin = `center center`;
        });

        // Hide old structural containers from the screen so only particles are visible
        Array.from(cvContent.children).forEach(child => {
            if (!particles.find(p => p.el === child)) {
                child.style.display = 'none';
            }
        });

        const GRAVITY = 0.6;
        const DAMPING = 0.55;
        const FRICTION = 0.90;

        // PERFORMANCE OPTIMIZATION: Cache floor Y once, instead of calling getBoundingClientRect() every single frame
        const initialCvRect = cvContent.getBoundingClientRect();
        const FLOOR_Y = window.innerHeight - initialCvRect.top + 20; // 20px padding
        const CEILING_Y = 0; // Top of the cv-content div

        function loop() {
            if (window._cvState === 'resetting') return;

            let allSettled = true;

            particles.forEach(p => {
                if (p.settled) return;

                // Dynamic Gravity Logic
                const currentGravity = (window._cvGravity !== undefined) ? window._cvGravity : GRAVITY;
                p.vy += currentGravity;

                p.x += p.vx;
                p.y += p.vy;

                p.rx += p.vrx;
                p.ry += p.vry;
                p.rz += p.vrz;

                // Ceiling Collision (Bounce)
                if (p.y <= CEILING_Y) {
                    p.y = CEILING_Y;
                    if (p.vy < 0) {
                        p.vy *= -DAMPING; // Bounce back down
                        // Add some horizontal jitter on ceiling impact
                        p.vx += (Math.random() - 0.5) * 4;
                    }
                }

                // Floor Collision
                if (p.y + p.height >= FLOOR_Y) {
                    p.y = FLOOR_Y - p.height;
                    p.vy *= -DAMPING;

                    p.vx *= FRICTION;
                    p.vrx *= FRICTION;
                    p.vry *= FRICTION;
                    p.vrz *= FRICTION;

                    if (Math.abs(p.vy) < 1.2) p.vy = 0;
                    if (Math.abs(p.vx) < 0.2) p.vx = 0;
                }

                // PERFORMANCE OPTIMIZATION: Use precalculated startX/Y instead of slow DOM parseFloat string conversions
                const deltaX = p.x - p.startX;
                const deltaY = p.y - p.startY;

                // Falling elements tumble in 3D
                p.el.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) rotateX(${p.rx}deg) rotateY(${p.ry}deg) rotateZ(${p.rz}deg)`;

                // Store physics state on element in case we want to tween it back
                p.el._cvPhysics = { dx: deltaX, dy: deltaY, rx: p.rx, ry: p.ry, rz: p.rz };

                // Settlement Check
                // Disable settlement if gravity is currently pulling up (negative) or if in ritual state
                const isGravityUp = (window._cvGravity !== undefined && window._cvGravity < 0);
                const isRitual = (window._cvState === 'ritual');

                if (!isGravityUp && !isRitual && Math.abs(p.vy) <= 0.1 && Math.abs(p.vx) <= 0.1 && p.y + p.height >= FLOOR_Y - 2) {
                    p.settled = true;
                    // Keep element locked on floor, skip physics next frame
                } else {
                    allSettled = false;
                }
            });

            if (!allSettled) {
                requestAnimationFrame(loop);
            } else {
                // PERFORMANCE OPTIMIZATION: Loop has completely settled.
                cvContent.style.pointerEvents = 'none';
                window._cvState = 'shattered';
                //console.log('%c[cvFall] Physics Simulation Settled. Engine Sleeping.', 'color: #00f3ff');
            }
        }

        requestAnimationFrame(loop);
    }
}

export function cvReset(duration = 900) {
    //console.log('[cvReset] Called. Current state:', window._cvState);
    if (!window._cvState || window._cvState === 'idle') {
        // Only allow if we're actually in a messed up state or have shattered elements
        const fallingElements = document.querySelectorAll('.falling-word, .falling-clone');
        if (fallingElements.length === 0) {
            //console.log('[cvReset] Aborting: state is idle and no messy elements found.');
            return;
        }
        //console.log('[cvReset] Proceeding with reset from idle state because messy elements exist.');
        window._cvState = 'shattered';
    }
    if (window._cvState === 'resetting') {
        //console.log('[cvReset] Aborting: already resetting.');
        return;
    }
    window._cvState = 'resetting';
    //console.log('[cvReset] Starting reset process. Duration:', duration);

    const cvContainer = document.getElementById('cv-container');
    const cvContent = document.getElementById('cv-content');
    const cvScroller = document.getElementById('cv-scroller');

    if (!cvContainer || !cvContent) {
        window._cvState = 'idle';
        return;
    }

    // Try to grab all scattered elements
    const fallingElements = document.querySelectorAll('.falling-word, .falling-clone');

    // If TWEEN is available, tween them back for drama before we nuke the spans
    if (fallingElements.length > 0 && typeof TWEEN !== 'undefined') {
        let completedTweens = 0;
        const totalTweens = fallingElements.length;
        const activeTweens = [];

        fallingElements.forEach((el) => {
            const physics = el._cvPhysics || { dx: 0, dy: 0, rx: 0, ry: 0, rz: 0, scale: 1 };

            // If the element vanished into the singularity, unhide it for the reverse animation
            if (el.style.display === 'none') {
                el.style.display = 'inline-block';
            }

            // Distribute stagger exactly across the provided duration
            const maxDelay = duration * 0.4;
            const tweenDuration = duration - maxDelay;
            const delay = Math.random() * maxDelay;

            const tween = new TWEEN.Tween(physics)
                .to({ dx: 0, dy: 0, rx: 0, ry: 0, rz: 0, scale: 1 }, tweenDuration)
                .easing(TWEEN.Easing.Cubic.InOut)
                .delay(delay)
                .onUpdate(() => {
                    const sc = physics.scale !== undefined ? physics.scale : 1;
                    el.style.transform = `translate3d(${physics.dx}px, ${physics.dy}px, 0) rotateX(${physics.rx}deg) rotateY(${physics.ry}deg) rotateZ(${physics.rz}deg) scale(${sc})`;
                })
                .onComplete(() => {
                    completedTweens++;
                    if (completedTweens === totalTweens) {
                        doFinalize();
                    }
                })
                .start();
            activeTweens.push(tween);
        });

        let isFinalized = false;
        const doFinalize = () => {
            //console.log('[cvReset] doFinalize called. isFinalized:', isFinalized);
            if (isFinalized) return;
            isFinalized = true;
            activeTweens.forEach(t => t.stop());
            if (resetAnimationFrame) cancelAnimationFrame(resetAnimationFrame);
            finalizeReset();
        };

        let resetAnimationFrame;
        function updateTweens() {
            if (isFinalized) return;
            // TWEEN.update() is handled by the main loop
            if (completedTweens < totalTweens) {
                resetAnimationFrame = requestAnimationFrame(updateTweens);
            } else {
                doFinalize();
            }
        }
        resetAnimationFrame = requestAnimationFrame(updateTweens);

        // Failsafe strictly bounded to duration
        setTimeout(doFinalize, duration + 100);

    } else {
        //console.log('[cvReset] TWEEN unavailable or no elements. Immediate finalizeReset().');
        // Fallback or immediate reset
        finalizeReset();
    }

    function finalizeReset() {
        //console.log('[cvReset] finalizeReset() executing.');
        cvContainer.style.overflow = '';
        if (cvScroller) {
            cvScroller.style.overflow = '';
        }

        const mainUi = document.getElementById('main-ui');
        if (mainUi) mainUi.style.pointerEvents = '';

        cvContent.style.position = '';
        cvContent.style.pointerEvents = '';

        // Remove all clones and leftover absolute words
        const clones = document.querySelectorAll('.falling-clone, .falling-word');
        clones.forEach(c => c.remove());

        // Restore text content directly
        const targetSelectors = [
            '.header h1', '.header .role', '.contact-info span', '.contact-info a',
            '.collapsible-header',
            '.role-header .company', '.title-row .job-title', '.title-row .date',
            '.skills-grid span',
            '.contact-grid div',
            '.terminal-footer div',
            '.collapsible-content p',
            '.collapsible-content ul li'
        ];

        const coreBlocks = Array.from(cvContent.querySelectorAll(targetSelectors.join(', ')));
        coreBlocks.forEach(block => {
            if (block.dataset.originalHtml) {
                block.innerHTML = block.dataset.originalHtml;
                delete block.dataset.originalHtml;
            }
            if (block.dataset.wasHiddenByViewport) {
                block.style.visibility = '';
                delete block.dataset.wasHiddenByViewport;
            }
        });

        // 1. Unhide ONLY the direct structural containers that cvFall hid
        Array.from(cvContent.children).forEach(child => {
            if (child.style.display === 'none') {
                child.style.display = '';
            }
        });

        // 2. Unhide original instances of extra targets (images, decos) that were cloned
        const extraTargets = Array.from(cvContent.querySelectorAll('.header-photo, .scanline-deco, .fui-corners, .audience-badge'));
        extraTargets.forEach(el => {
            if (el.style.visibility === 'hidden') {
                el.style.visibility = '';
            }
        });

        // 3. We don't indiscriminately wipe inline styles from all descendants as it destroys legitimate CSS!
        // The original html restoring above completely recreates pristine DOM structures internally.

        window._cvState = 'idle';
    }
}

export function cvSuck(yTarget = 0) {
    if (window._cvState && (window._cvState !== 'idle' && window._cvState !== 'shattered')) return;
    window._cvState = 'sucking';

    const cvContainer = document.getElementById('cv-container');
    const cvContent = document.getElementById('cv-content');
    const cvScroller = document.getElementById('cv-scroller');

    if (!cvContainer || !cvContent) return;

    if (cvContainer.classList.contains('collapsed')) {
        cvContainer.classList.remove('collapsed');
        setTimeout(startSingularity, 400);
    } else {
        startSingularity();
    }

    function startSingularity() {
        if (window._cvState === 'resetting' || window._cvState === 'idle') {
            //console.log('[cvSuck] Race condition intercepted. Aborting singularity.');
            return;
        }

        cvContainer.style.overflow = 'visible';
        if (cvScroller) cvScroller.style.overflow = 'visible';

        const mainUi = document.getElementById('main-ui');
        if (mainUi) mainUi.style.pointerEvents = 'none';

        cvContent.style.position = 'relative';

        const targetSelectors = [
            '.header h1', '.header .role', '.contact-info span', '.contact-info a',
            '.collapsible-header', '.role-header .company', '.title-row .job-title', '.title-row .date',
            '.skills-grid span', '.contact-grid div', '.terminal-footer div',
            '.collapsible-content p', '.collapsible-content ul li'
        ];

        const coreBlocks = Array.from(cvContent.querySelectorAll(targetSelectors.join(', ')));
        const wordSpans = [];

        // Traverse and split just like cvFall
        coreBlocks.forEach(block => {
            if (block.querySelector('svg') || block.querySelector('img')) return;

            if (!block.dataset.originalHtml) {
                block.dataset.originalHtml = block.innerHTML;
            }

            const treeWalker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, null, false);
            const textNodes = [];
            while (treeWalker.nextNode()) textNodes.push(treeWalker.currentNode);

            textNodes.forEach(node => {
                if (node.nodeValue.trim() === '') return;
                const words = node.nodeValue.split(/(\s+)/);
                const fragment = document.createDocumentFragment();

                words.forEach(word => {
                    if (word.trim() === '') {
                        fragment.appendChild(document.createTextNode(word));
                    } else {
                        const span = document.createElement('span');
                        span.textContent = word;
                        span.style.display = 'inline-block';
                        span.classList.add('falling-word');
                        wordSpans.push(span);
                        fragment.appendChild(span);
                    }
                });
                node.parentNode.replaceChild(fragment, node);
            });
        });

        // Compute styling mapping & explicit inline to prevent layout thrashing
        const computedStylesMap = wordSpans.map(span => {
            const comp = window.getComputedStyle(span);
            return {
                sColor: comp.color, sFontSize: comp.fontSize, sFontWeight: comp.fontWeight,
                sLetterSpacing: comp.letterSpacing, sTextTransform: comp.textTransform,
                sFontFamily: comp.fontFamily, sLineHeight: comp.lineHeight,
                sTextShadow: comp.textShadow !== 'none' ? comp.textShadow : ''
            };
        });

        wordSpans.forEach((span, i) => {
            const css = computedStylesMap[i];
            span.style.color = css.sColor; span.style.fontSize = css.sFontSize;
            span.style.fontWeight = css.sFontWeight; span.style.letterSpacing = css.sLetterSpacing;
            span.style.textTransform = css.sTextTransform; span.style.fontFamily = css.sFontFamily;
            span.style.lineHeight = css.sLineHeight; span.style.textShadow = css.sTextShadow;
            span.style.whiteSpace = 'nowrap';
        });

        const initialCvRect = cvContent.getBoundingClientRect();

        // Target calculation: yTarget (-1 to 1) mapped to top of screen (-1), middle of screen (0), bottom of screen (1)
        const targetXLocal = 0; // Left border
        const targetYLocal = ((yTarget + 1) / 2) * window.innerHeight - initialCvRect.top;

        const extraTargets = Array.from(cvContent.querySelectorAll('.header-photo, .scanline-deco, .fui-corners, .audience-badge'));
        const domTargets = [...wordSpans, ...extraTargets];
        const rectMap = domTargets.map(el => el.getBoundingClientRect());
        const particles = [];

        domTargets.forEach((el, index) => {
            const rect = rectMap[index];
            if (rect.width === 0 || rect.height === 0) return;

            const localX = rect.left - initialCvRect.left;
            const localY = rect.top - initialCvRect.top;

            const isWord = el.classList.contains('falling-word');
            let physicalEl = el;

            if (!isWord) {
                physicalEl = el.cloneNode(true);
                physicalEl.classList.add('falling-clone');
                physicalEl.style.margin = '0';
            }

            particles.push({
                el: physicalEl,
                isClone: !isWord,
                x: localX, y: localY,
                startX: localX, startY: localY,
                width: rect.width, height: rect.height,
                vx: (Math.random() - 0.5) * 6, // Low initial burst
                vy: (Math.random() - 0.5) * 6,
                rx: Math.random() * 30 - 15, ry: Math.random() * 30 - 15, rz: Math.random() * 30 - 15,
                vrx: (Math.random() - 0.5) * 15, vry: (Math.random() - 0.5) * 15, vrz: (Math.random() - 0.5) * 15,
                scale: 1
            });

            if (!isWord) el.style.visibility = 'hidden';
        });

        particles.forEach(p => {
            cvContent.appendChild(p.el);
            p.el.style.position = 'absolute';
            p.el.style.left = p.x + 'px'; p.el.style.top = p.y + 'px';
            p.el.style.width = p.width + 'px'; p.el.style.height = p.height + 'px';
            p.el.style.margin = '0'; p.el.style.transition = 'none'; p.el.style.animation = 'none';
            p.el.style.boxSizing = 'border-box'; p.el.style.userSelect = 'none';
            p.el.style.willChange = 'transform'; p.el.style.transformOrigin = `center center`;
        });

        Array.from(cvContent.children).forEach(child => {
            if (!particles.find(p => p.el === child)) child.style.display = 'none';
        });

        const GRAVITY = 0.6;
        const DAMPING = 0.55;
        const FRICTION = 0.90;

        function loop() {
            if (window._cvState === 'resetting') return;

            let allSettled = true;

            particles.forEach(p => {
                if (p.settled) return;

                if (window._cvState === 'falling') {
                    // SEAMLESS FALL STATE: Switch back to cvFall downward gravity logic mid-air
                    const FLOOR_Y = window.innerHeight - initialCvRect.top + 20;

                    p.vy += 0.6; // downward GRAVITY
                    p.x += p.vx;
                    p.y += p.vy;
                    p.rx += p.vrx;
                    p.ry += p.vry;
                    p.rz += p.vrz;

                    if (p.y + p.height >= FLOOR_Y) {
                        p.y = FLOOR_Y - p.height;
                        p.vy *= -DAMPING;
                        p.vx *= FRICTION;
                        p.vrx *= FRICTION;
                        p.vry *= FRICTION;
                        p.vrz *= FRICTION;
                        if (Math.abs(p.vy) < 1.2) p.vy = 0;
                        if (Math.abs(p.vx) < 0.2) p.vx = 0;
                    }

                    if (Math.abs(p.vy) <= 0.1 && Math.abs(p.vx) <= 0.1 && p.y + p.height >= FLOOR_Y - 2) {
                        p.settled = true;
                    } else {
                        allSettled = false;
                    }

                } else {
                    // ORIGINAL SUCKING STATE
                    // Directional gravity towards (targetXLocal, targetYLocal)
                    const dx = targetXLocal - (p.x + p.width / 2);
                    const dy = targetYLocal - (p.y + p.height / 2);
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

                    // Acceleration exactly like gravity but directional
                    p.vx += (dx / dist) * GRAVITY;
                    p.vy += (dy / dist) * GRAVITY;

                    p.x += p.vx;
                    p.y += p.vy;

                    p.rx += p.vrx;
                    p.ry += p.vry;
                    p.rz += p.vrz;

                    // Left wall acts as physical floor
                    if (p.x <= targetXLocal) {
                        p.x = targetXLocal;
                        p.vx *= -DAMPING;

                        p.vy *= FRICTION;
                        p.vrx *= FRICTION;
                        p.vry *= FRICTION;
                        p.vrz *= FRICTION;

                        if (Math.abs(p.vx) < 1.2) p.vx = 0;
                        if (Math.abs(p.vy) < 0.2) p.vy = 0;
                    }

                    // Settlement Check
                    if (Math.abs(p.vx) <= 0.1 && Math.abs(p.vy) <= 0.1 && p.x <= targetXLocal + 2) {
                        p.settled = true;
                    } else {
                        allSettled = false;
                    }
                }

                const deltaX = p.x - p.startX;
                const deltaY = p.y - p.startY;

                p.el.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) rotateX(${p.rx}deg) rotateY(${p.ry}deg) rotateZ(${p.rz}deg)`;
                // We keep scale out entirely, tracking cvFall's structure
                p.el._cvPhysics = { dx: deltaX, dy: deltaY, rx: p.rx, ry: p.ry, rz: p.rz };


            });

            if (!allSettled) {
                requestAnimationFrame(loop);
            } else {
                cvContent.style.pointerEvents = 'none';
                window._cvState = 'shattered';
                //console.log('%c[cvSuck] Elements settled on the left wall.', 'color: #8800ff');
            }
        }

        requestAnimationFrame(loop);
    }
}

window.cvFall = cvFall;
window.cvReset = cvReset;
window.cvSuck = cvSuck;

export function cvShake(duration = 1000) {
    if (window._cvState && window._cvState !== 'idle' && window._cvState !== 'shattered') return;
    window._cvState = 'shaking';

    const cvContainer = document.getElementById('cv-container');
    const cvContent = document.getElementById('cv-content');

    // Only allow shake if panel is physically open
    if (!cvContainer || !cvContent || cvContainer.classList.contains('collapsed')) {
        window._cvState = 'idle';
        return;
    }

    // Pick visual targets to agitate for earthquake effect
    const targetSelectors = [
        '.header h1', '.header .role', '.contact-info span', '.contact-info a',
        '.collapsible-header', '.role-header .company', '.title-row .job-title', '.title-row .date',
        '.skills-grid span', '.fui-corners div', '.scanline-deco', '.header-photo'
    ];

    const blocks = Array.from(cvContent.querySelectorAll(targetSelectors.join(', ')));
    if (blocks.length === 0 || typeof TWEEN === 'undefined') {
        window._cvState = 'idle';
        return;
    }

    let completedTweens = 0;
    const totalTweens = blocks.length;
    const activeTweens = [];

    blocks.forEach((el, index) => {
        // Enforce transform capability
        const baseDisplay = window.getComputedStyle(el).display;
        if (baseDisplay === 'inline') {
            el.style.display = 'inline-block';
        }

        // Exact staggered timing math
        const maxStagger = duration * 0.35;
        const delay = Math.random() * maxStagger;
        const activeShakeDuration = duration - delay;

        const tween = new TWEEN.Tween({ t: 0 })
            .to({ t: 1 }, activeShakeDuration)
            // Decay sine wave amplitude perfectly
            .easing(TWEEN.Easing.Quadratic.Out)
            .delay(delay)
            .onUpdate((obj) => {
                const intensity = 1.0 - obj.t;
                if (intensity <= 0.02) {
                    el.style.transform = `translate3d(0, 0, 0) rotateZ(0deg)`;
                    return;
                }

                // Deterministic high frequency math based on element index to prevent uniform swaying
                const rStep = index * 12.5;
                const tx = (Math.random() - 0.5) * 8 * intensity;
                const ty = (Math.random() - 0.5) * 6 * intensity;
                const tr = (Math.random() - 0.5) * 3 * intensity;

                el.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotateZ(${tr}deg)`;
            })
            .onComplete(() => {
                el.style.transform = '';
                if (baseDisplay === 'inline') el.style.display = '';

                completedTweens++;
                if (completedTweens === totalTweens) {
                    doFinalize();
                }
            })
            .start();
        activeTweens.push(tween);
    });

    let isFinalized = false;
    const doFinalize = () => {
        if (isFinalized) return;
        isFinalized = true;
        activeTweens.forEach(t => t.stop());
        if (shakeAnimFrame) cancelAnimationFrame(shakeAnimFrame);
        blocks.forEach(el => { el.style.transform = ''; });
        if (window._cvState === 'shaking') {
            window._cvState = 'idle';
        }
    };

    let shakeAnimFrame;
    function updateShakeTweens() {
        if (window._cvState !== 'shaking') {
            doFinalize();
            return;
        }

        if (completedTweens < totalTweens) {
            shakeAnimFrame = requestAnimationFrame(updateShakeTweens);
        } else {
            doFinalize();
        }
    }
    shakeAnimFrame = requestAnimationFrame(updateShakeTweens);
    setTimeout(doFinalize, duration + 100);
}

window.cvShake = cvShake;


export function cvJump(duration = 1000) {
    if (window._cvState && window._cvState !== 'idle') return;
    window._cvState = 'jumping';

    const cvContainer = document.getElementById('cv-container');
    const cvContent = document.getElementById('cv-content');

    if (!cvContainer || !cvContent || cvContainer.classList.contains('collapsed')) {
        window._cvState = 'idle';
        return;
    }

    const targetSelectors = [
        '.header h1', '.header .role', '.contact-info span', '.contact-info a',
        '.collapsible-header', '.role-header .company', '.title-row .job-title', '.title-row .date',
        '.skills-grid span', '.fui-corners div', '.scanline-deco', '.header-photo'
    ];

    const blocks = Array.from(cvContent.querySelectorAll(targetSelectors.join(', ')));
    if (blocks.length === 0 || typeof TWEEN === 'undefined') {
        window._cvState = 'idle';
        return;
    }

    let completedTweens = 0;
    const totalTweens = blocks.length;
    const activeTweens = [];

    blocks.forEach((el) => {
        const baseDisplay = window.getComputedStyle(el).display;
        if (baseDisplay === 'inline') {
            el.style.display = 'inline-block';
        }

        const maxStagger = duration * 0.4;
        const delay = Math.random() * maxStagger;
        const activeJumpDuration = duration - delay;

        const tween = new TWEEN.Tween({ t: 0 })
            .to({ t: 1 }, activeJumpDuration)
            .easing(TWEEN.Easing.Linear.None) // Using mathematical Sine curve mapping inside the update loop
            .delay(delay)
            .onUpdate((obj) => {
                // Math.sin of (0 to PI) creates a perfect bounce arc peaking at 1 at obj.t = 0.5
                const jumpHeight = Math.sin(obj.t * Math.PI) * -45; // Jumps up 45 pixels natively (Y-negative is UP in css)
                el.style.transform = `translate3d(0, ${jumpHeight}px, 0)`;
            })
            .onComplete(() => {
                el.style.transform = '';
                if (baseDisplay === 'inline') el.style.display = '';

                completedTweens++;
                if (completedTweens === totalTweens) {
                    doFinalize();
                }
            })
            .start();
        activeTweens.push(tween);
    });

    let isFinalized = false;
    const doFinalize = () => {
        if (isFinalized) return;
        isFinalized = true;
        activeTweens.forEach(t => t.stop());
        if (jumpAnimFrame) cancelAnimationFrame(jumpAnimFrame);
        blocks.forEach(el => { el.style.transform = ''; });
        if (window._cvState === 'jumping') {
            window._cvState = 'idle';
        }
    };

    let jumpAnimFrame;
    function updateJumpTweens() {
        if (window._cvState !== 'jumping') {
            doFinalize();
            return;
        }

        if (completedTweens < totalTweens) {
            jumpAnimFrame = requestAnimationFrame(updateJumpTweens);
        } else {
            doFinalize();
        }
    }
    jumpAnimFrame = requestAnimationFrame(updateJumpTweens);
    setTimeout(doFinalize, duration + 100);
}

window.cvJump = cvJump;
