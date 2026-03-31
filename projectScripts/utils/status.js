
let fpsElement;
let coordsElement;
let storyElement;
let qualityElement;
let subtitleElement;
let statusContainer;

let lastTime = 0;
let frameCount = 0;
let fps = 0;
let storyTimeout;

export function initStatus() {
    fpsElement = null; // Removed
    coordsElement = document.getElementById('stat-coords');
    storyElement = document.querySelector('.frame_story-text');
    qualityElement = null; // Removed
    subtitleElement = document.getElementById('stat-subtitle');
    statusContainer = null; // Removed

    // Initial placeholder to match the new combined format
    if (coordsElement) coordsElement.innerText = "00 FPS | 1.0 DPR | 000 DRC";



    lastTime = performance.now();
}

const applyStatusClass = (element, state) => {
    if (!element) return;
    // Remove all potential status classes first
    element.classList.remove('stat-optimal', 'stat-critical', 'stat-stable');

    // Add the specific state class
    if (state === 'optimal') element.classList.add('stat-optimal');
    else if (state === 'critical') element.classList.add('stat-critical');
    else element.classList.add('stat-stable');
};

let lerpFPS = 0.9;
let lerpQuality = 0.9;

export function updateStatus(scene, factor = 1) {
    frameCount += factor;
    const currentTime = performance.now();
    const delta = currentTime - lastTime;

    // Smoothed bar updates (Interpolation)
    if (scene.HUD && scene.HUD.material.uniforms) {
        const targetFPSRatio = Math.min(1, fps / 60);
        const current1 = scene.HUD.material.uniforms.uIslBarProgress1.value;
        scene.HUD.material.uniforms.uIslBarProgress1.value = current1 + (targetFPSRatio - current1) * 0.05;

        if (scene.renderer) {
            const ratio = scene.renderer.getPixelRatio();
            const dpr = window.devicePixelRatio || 1;
            const targetQualityRatio = ratio / dpr;
            const current2 = scene.HUD.material.uniforms.uIslBarProgress2.value;
            scene.HUD.material.uniforms.uIslBarProgress2.value = current2 + (targetQualityRatio - current2) * 0.05;
        }
    }

    // 1. Live Coordinate System (Responsive updates every call)
    if (coordsElement && scene.renderer) {
        const dpr = window.devicePixelRatio || 1;
        const ratio = Math.round((scene.renderer.getPixelRatio() / dpr) * 100);

        // Coloring States
        const getStatusClass = (val, opt) => (val >= opt ? 'stat-optimal' : (val < 40 ? 'stat-critical' : 'stat-stable'));

        // Initialize spans once if not present
        if (!coordsElement.querySelector('.stat-fps-val')) {
            coordsElement.innerHTML = `<span class="stat-fps-val">FPS 00</span> | <span class="stat-dpr-val">DPR 00%</span> | <span class="stat-drc-val">DRC 000</span>`;
        }

        const fpsSpan = coordsElement.querySelector('.stat-fps-val');
        const dprSpan = coordsElement.querySelector('.stat-dpr-val');
        const drcSpan = coordsElement.querySelector('.stat-drc-val');


        // Update FPS part
        const newFPS = `FPS ${fps}`;
        if (fpsSpan.textContent !== newFPS) {
            fpsSpan.textContent = newFPS;
            fpsSpan.className = `stat-fps-val ${getStatusClass(fps, 54)}`;
        }

        // Update DPR part
        const newDPR = `DPR ${ratio}%`;
        if (dprSpan.textContent !== newDPR) {
            dprSpan.textContent = newDPR;
            dprSpan.className = `stat-dpr-val ${getStatusClass(ratio, 90)}`;
        }

        // Update DRC (Draw Call) part
        const drc = scene.renderer.info.render.calls;
        const newDRC = `DRC ${drc.toString().padStart(3, '0')}`;
        if (drcSpan.textContent !== newDRC) {
            drcSpan.textContent = newDRC;
            // Optimal < 100, Stable < 200, Critical > 200
            drcSpan.className = `stat-drc-val ${drc < 100 ? 'stat-optimal' : (drc > 200 ? 'stat-critical' : 'stat-stable')}`;
        }
    }

    // 2. Scheduled Logical Updates (Once per second)
    if (delta >= 1000) {
        fps = Math.round((frameCount * 1000) / delta);
        frameCount = 0;
        lastTime = currentTime;
    }
}

export function updateStory(text) {
    if (window.scene && window.scene._spawnStopSignal) {
        if (storyElement) storyElement.textContent = "";
        return;
    }
    if (storyElement) {
        // PERF: Skip layout calculation if text is the same
        if (storyElement.textContent === text) return;
        
        storyElement.textContent = text;
        storyElement.style.willChange = 'transform, opacity'; // Force GPU layer

        // --- Screen-size-independent positioning (Throttled) ---
        const lastHeight = storyElement.dataset.lastHudHeight;
        const hud = window.scene && window.scene.HUD;
        
        if (hud && hud.material && hud.material.uniforms) {
            const u = hud.material.uniforms;
            const hVal = u.uBNotchHRatio.value;
            
            // Only update height if the HUD notch has actually changed
            if (lastHeight !== hVal.toString()) {
                const vMarginFrac  = u.uMarginPct.value;
                const innerHFrac   = 1.0 - 2.0 * vMarginFrac;
                const bNotchHFrac  = innerHFrac * hVal;
                const zoneHFrac    = vMarginFrac + bNotchHFrac;
                storyElement.style.bottom = '0';
                storyElement.style.height = (zoneHFrac * 100).toFixed(4) + 'vh';
                storyElement.dataset.lastHudHeight = hVal;
            }
        }

        if (storyTimeout) clearTimeout(storyTimeout);
        storyTimeout = setTimeout(() => {
            if (storyElement) storyElement.textContent = "";
        }, 5000);
    }
}

// --- SUBTITLE SYSTEM ---
// --- SUBTITLE SYSTEM ---
let subtitleRequestId;

import { deployHolographicSubtitle } from './hologramEffects.js';

export function updateSubtitle(text) {
    if (window.scene && window.scene._spawnStopSignal) {
        clearSubtitle(true);
        return;
    }
    if (!subtitleElement) subtitleElement = document.getElementById('stat-subtitle');
    if (subtitleElement) {
        // Clear existing reveal
        if (subtitleRequestId) cancelAnimationFrame(subtitleRequestId);

        // Show container via DNA-compliant class swap
        subtitleElement.classList.add('active');

        // Reset content: Removed dot, added Close Icon, added Scanner Line
        subtitleElement.innerHTML = '<div class="subtitle-close">×</div><span class="subtitle-text"></span><div class="scanner-line"></div>';
        const textContainer = subtitleElement.querySelector('.subtitle-text');
        const closeBtn = subtitleElement.querySelector('.subtitle-close');
        if (closeBtn) {
            closeBtn.onclick = () => {
                clearSubtitle();
                window.dispatchEvent(new CustomEvent('subtitleClose', { detail: { manual: true } }));
            };
        }

        // Cyber-Decryption effect
        const minDuration = 1000; // ms minimum duration
        const maxDuration = 3000; // ms maximum duration
        // Add 50ms per character, clamp between min/max
        const duration = Math.min(Math.max(text.length * 50, minDuration), maxDuration);

        // Sync CSS animation duration with JS effect
        subtitleElement.style.setProperty('--reveal-dur', `${duration}ms`);

        // Trigger Holographic Deployment with synced duration
        if (window.scene) deployHolographicSubtitle(window.scene, duration);

        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*";
        const fps = 24; // Lower FPS slightly for a more "chunky" terminal feel
        const frameInterval = 1000 / fps;

        let startTime = performance.now();
        let lastFrameTime = startTime;

        const render = (time) => {
            // KILL SWITCH: Abort if user left the room mid-animation
            if (window.scene && window.scene._spawnStopSignal) {
                if (subtitleRequestId) cancelAnimationFrame(subtitleRequestId);
                clearSubtitle(true); // Fixed typo: immediate = true
                return;
            }

            if (!time) time = performance.now();
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1.0);

            // Throttle
            if (time - lastFrameTime > frameInterval || progress === 1.0) {
                lastFrameTime = time;
                const len = text.length;
                let scrambledText = "";

                for (let i = 0; i < len; i++) {
                    const char = text[i];
                    // Keep spaces and newlines intact for structural stability
                    if (char === ' ' || char === '\n') {
                        scrambledText += char;

                    }
                    // As progress approaches 1, left-to-right characters lock in
                    else if (progress * (len + 5) > i) {
                        scrambledText += char;
                    }
                    // Unlocked characters scramble
                    else {
                        scrambledText += chars[Math.floor(Math.random() * chars.length)];
                    }
                }

                textContainer.textContent = scrambledText;
            }

            if (progress < 1.0) {
                subtitleRequestId = requestAnimationFrame(render);
            } else {
                textContainer.textContent = text; // Final snap
            }
        };

        subtitleRequestId = requestAnimationFrame(render);
    }
}

export function clearSubtitle(immediate = false) {
    if (subtitleRequestId) cancelAnimationFrame(subtitleRequestId);
    if (!subtitleElement) subtitleElement = document.getElementById('stat-subtitle');
    if (subtitleElement) {
        subtitleElement.classList.remove('active');
        
        if (immediate) {
            subtitleElement.innerHTML = "";
            return;
        }

        // Wait for 0.6s CSS transition before hard-culling
        setTimeout(() => {
            if (!subtitleElement.classList.contains('active')) {
                subtitleElement.innerHTML = "";
            }
        }, 650);
    }
}
