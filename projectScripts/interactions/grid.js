import TWEEN from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/tween.module.min.js';
import { EVENTS } from '../configs/events.js';

export function initGridInteractions(scene) {
    // Ensure we have access to the global uniforms
    if (!scene.globalUniformsHub || !scene.globalUniformsHub.uniforms) {
        console.warn('GridSystem: Global Uniforms Hub not found');
        return;
    }

    const hub = scene.globalUniformsHub.uniforms;
    const gridTweenState = { currentTween: null };

    // --- Event Listeners ---

    // Hover Start -> Activate Grid
    window.addEventListener(EVENTS.GARDEN.HOVER_START, () => {
        // Trigger System Grid Scan
        hub.uWorldGridActive.value = 1.0;

        if (gridTweenState.currentTween) gridTweenState.currentTween.stop();

        gridTweenState.currentTween = new TWEEN.Tween(hub.uWorldGridProgress)
            .to({ value: 1.0 }, 1110) // 666ms / 0.6 = 1110ms total for staggered reveal
            .easing(TWEEN.Easing.Cubic.Out)
            .start();
    });

    // Hover End -> Deactivate Grid
    window.addEventListener(EVENTS.GARDEN.HOVER_END, () => {
        // Graceful Exit
        if (gridTweenState.currentTween) gridTweenState.currentTween.stop();

        gridTweenState.currentTween = new TWEEN.Tween(hub.uWorldGridProgress)
            .to({ value: 0.0 }, 1110)
            .easing(TWEEN.Easing.Cubic.In)
            .onComplete(() => {
                if (hub.uWorldGridProgress.value < 0.01) {
                    hub.uWorldGridActive.value = 0.0;
                }
            })
            .start();
    });
}
