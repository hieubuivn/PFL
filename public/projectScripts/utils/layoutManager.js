/**
 * layoutManager.js
 * Handles UI structural logic: Resize observation and performance suppression.
 */

const cvContainer = document.getElementById('cv-container');
const expContainer = document.getElementById('experience-container');

// Performance: Throttled ResizeObserver using requestAnimationFrame
let resizeValues = null;
let resizeFrame = null;

const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
        resizeValues = entry;
    }

    if (!resizeFrame) {
        resizeFrame = requestAnimationFrame(() => {
            resizeFrame = null;
            if (resizeValues && !isResizingSuppressed) {
                window.dispatchEvent(new Event('resize'));
                resizeValues = null;
            }
        });
    }
});

// Start observing if elements exist
if (expContainer) {
    resizeObserver.observe(expContainer);
}

let isResizingSuppressed = false;
let suppressTimeout = null;

/**
 * PERFORMANCE: RESIZE SUPPRESSION
 * Suppresses Three.js window resizes during CSS transitions to prevent stuttering.
 */
window.addEventListener('cvToggle', () => {
    isResizingSuppressed = true;
    if (suppressTimeout) clearTimeout(suppressTimeout);

    suppressTimeout = setTimeout(() => {
        isResizingSuppressed = false;
        window.dispatchEvent(new Event('resize'));
    }, 850); // Buffer slightly longer than the 800ms TWEEN duration
});

export { resizeObserver };
