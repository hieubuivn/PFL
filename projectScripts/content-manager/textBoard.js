/**
 * textBoard.js
 * Handles dynamic text sizing and layout configurations for the board UI.
 */

export const BOARD_LAYOUT_CONFIG = {
    chaos: { bottom: 12, top: 0, scale: 1.0, subVisible: true, philoSubVisible: true, mode: 'mode-chaos' },
    root: { bottom: 0, top: 12, scale: 0.8, subVisible: false, philoSubVisible: false, mode: 'mode-root' },
    dance: { bottom: 0, top: 16, scale: 0.8, subVisible: false, philoSubVisible: false, mode: 'mode-dance' },
    walk: { bottom: 12, top: 0, scale: 0.8, subVisible: false, philoSubVisible: false, mode: 'mode-walk' }
};

// Helper to get text width without layout thrashing
export const getTextWidth = (text, font) => {
    if (!getTextWidth.canvas) {
        getTextWidth.canvas = document.createElement('canvas');
        getTextWidth.context = getTextWidth.canvas.getContext('2d');
    }
    getTextWidth.context.font = font;
    return getTextWidth.context.measureText(text).width;
};

export function fitBoardTexts(externalScale = 1.0, subProgress = 1.0, root = document) {
    const board = root === document ? document.getElementById('board') : root.querySelector('#board');
    const name1 = root.querySelector('.intro-main-name1');
    const name2 = root.querySelector('.intro-main-name2');
    const sub = root.querySelector('.intro-sub');

    const philoSub = root.querySelector('.board-philo-sub');
    const philoMain = root.querySelector('.board-philo-main');

    const feat1 = root.getElementById ? root.getElementById('board-feat-1') : root.querySelector('#board-feat-1');
    const feat2 = root.getElementById ? root.getElementById('board-feat-2') : root.querySelector('#board-feat-2');

    if (!board || !name1 || !name2 || !sub) return;
    const targetW = board.clientWidth;
    if (targetW <= 1) return; // Ignore zero or tiny widths

    // Ensure subProgress is a reliable number
    subProgress = Math.max(0, Math.min(1, (subProgress !== undefined ? subProgress : (window.__boardSubProgress ?? 1.0))));

    // Apply scale to board gap (Reference is 6vh * 0.7 = ~4.2vh at scale 1.0)
    const baseGapVh = 4.2;
    const currentGap = baseGapVh * externalScale;
    board.style.gap = currentGap + 'vh';

    // --- RULER SYSTEM (Nailing the sizes) ---
    // Instead of measuring the dynamic scrambled text, we measure hardcoded "Baselines".
    // 1 = Chaos (fits BUI QUOC), 0 = Root+ (fits VISION BECOMES at 0.8)
    const NameRef_C = "BUI QUOC";
    const NameRef_R = "VISION BECOMES";
    const PhiloRef_C = "PI-SHAPED ENGINEERING & STRATEGY";
    const PhiloRef_R = "ALIGNED THROUGH ENGINEERING";
    const FeatRef_C = "3+ YEARS • INTERACTIVE UX • AR/VR/3D";
    const FeatRef_R = "π-shaped lead.Strategy in motion.";

    // 1. Name logic
    const nameFont = getComputedStyle(name1).fontFamily;
    const wC_Name = getTextWidth(NameRef_C, `20px ${nameFont}`);
    const wR_Name = getTextWidth(NameRef_R, `20px ${nameFont}`);
    // FLOOR: Never let ruler width hit near-zero
    const rulerW_Name = Math.max(10, wR_Name + (wC_Name - wR_Name) * subProgress);

    const baselineSizeName = 20 * (targetW / rulerW_Name);
    let sizeName = baselineSizeName * externalScale;

    // Squeeze Safeguard for Names: If scrambled text > board, shrink it
    const currentNameW = getTextWidth(name1.innerText, `${sizeName}px ${nameFont}`);
    if (currentNameW > targetW && currentNameW > 0.01) sizeName *= (targetW / currentNameW);

    name1.style.fontSize = sizeName + 'px';
    name2.style.fontSize = sizeName + 'px';

    // Intro Sub Sizing (Shrink to 0)
    const introContainer = root.getElementById ? root.getElementById('board-intro') : root.querySelector('#board-intro');
    if (subProgress <= 0) {
        sub.style.display = 'none';
        sub.style.fontSize = '0px';
        sub.style.lineHeight = '0';
        if (introContainer) introContainer.style.gap = '0vh';
    } else {
        sub.style.display = 'block';
        sub.style.fontSize = (sizeName * 0.3) * subProgress + 'px';
        sub.style.lineHeight = subProgress;
        if (introContainer) introContainer.style.gap = (0.75 * subProgress) + 'vh';
    }

    // 2. Philosophy logic
    if (philoMain) {
        const philoFont = getComputedStyle(philoMain).fontFamily;
        const wC_Philo = getTextWidth(PhiloRef_C, `20px ${philoFont}`);
        const wR_Philo = getTextWidth(PhiloRef_R, `20px ${philoFont}`);
        const rulerW_Philo = Math.max(10, wR_Philo + (wC_Philo - wR_Philo) * subProgress);

        let sizePhiloMain = 20 * (targetW / rulerW_Philo) * externalScale;

        // Squeeze Safeguard for Philo: If scrambled text > board, shrink it
        const currentPhiloW = getTextWidth(philoMain.innerText, `${sizePhiloMain}px ${philoFont}`);
        if (currentPhiloW > targetW && currentPhiloW > 0.01) sizePhiloMain *= (targetW / currentPhiloW);

        philoMain.style.fontSize = sizePhiloMain + 'px';

        const philoContainer = root.getElementById ? root.getElementById('board-philo') : root.querySelector('#board-philo');
        if (philoSub) {
            // Philo Sub Sizing (Shrink to 0)
            if (subProgress <= 0) {
                philoSub.style.display = 'none';
                philoSub.style.fontSize = '0px';
                philoSub.style.lineHeight = '0';
                if (philoContainer) philoContainer.style.gap = '0vh';
            } else {
                philoSub.style.display = 'block';
                const sizePhiloSub = (sizePhiloMain * 0.8) * subProgress; // Relative to current philo main
                philoSub.style.fontSize = sizePhiloSub + 'px';
                philoSub.style.lineHeight = subProgress;
                if (philoContainer) philoContainer.style.gap = (0.75 * subProgress) + 'vh';
            }

            // 3. Features logic
            const featContainer = root.getElementById ? root.getElementById('board-feat') : root.querySelector('#board-feat');
            const sizeFeat_Target = sizePhiloMain * 0.48;
            const featFont = getComputedStyle(feat1 || board).fontFamily;

            // NEW: Tween border length (via scaleX)
            if (featContainer) {
                featContainer.style.setProperty('--feat-border-scale', subProgress);
            }

            if (feat2) {
                if (subProgress <= 0) {
                    feat2.style.display = 'none';
                    feat2.style.fontSize = '0px';
                    feat2.style.lineHeight = '0';
                    if (featContainer) featContainer.style.gap = '0vh';
                } else {
                    feat2.style.display = 'block';
                    feat2.style.fontSize = (sizeFeat_Target * subProgress) + 'px';
                    feat2.style.lineHeight = subProgress;
                    if (featContainer) featContainer.style.gap = (0.5 * subProgress) + 'vh';
                }
            }

            // Stabilize letter spacing and size for Feat 1 by using the ruler lerp
            if (feat1) {
                // NEW: Tween padding-top
                feat1.style.paddingTop = (2.75 * subProgress) + 'vh';

                // Ruler for features also lerps to avoid jumps
                const wC_FeatAt20 = getTextWidth(FeatRef_C, `20px ${featFont}`);
                const wR_FeatAt20 = getTextWidth(FeatRef_R, `20px ${featFont}`);
                const rulerW_FeatAt20 = Math.max(10, wR_FeatAt20 + (wC_FeatAt20 - wR_FeatAt20) * subProgress);
                const sizeFeat_Baseline = 20 * (targetW / rulerW_FeatAt20);

                let finalSizeFeat = sizeFeat_Baseline * (sizeFeat_Target / sizeFeat_Baseline); // Simplified as sizeFeat_Target but kept for structure
                finalSizeFeat = sizeFeat_Target;

                // Squeeze Safeguard for Feat
                const currentFeatW = getTextWidth(feat1.innerText, `${finalSizeFeat}px ${featFont}`);
                if (currentFeatW > targetW && currentFeatW > 0.01) finalSizeFeat *= (targetW / currentFeatW);

                feat1.style.fontSize = finalSizeFeat + 'px';

                // Letter Spacing Ruler (Lerped)
                const charCount_C = FeatRef_C.length;
                const charCount_R = FeatRef_R.length;
                const charCount_Lerp = charCount_R + (charCount_C - charCount_R) * subProgress;

                const fitSpacing = (targetW - (rulerW_FeatAt20 * (finalSizeFeat / 20))) / (charCount_Lerp - 1);
                const goalSpacing = finalSizeFeat * 0.25;
                const finalSpacing = Math.max(0, Math.min(goalSpacing, fitSpacing));
                feat1.style.letterSpacing = finalSpacing + 'px';

                if (feat2 && subProgress > 0) {
                    feat2.style.letterSpacing = finalSpacing + 'px';
                }
            }
        }
    }
}

/**
 * Initializes the board observers
 */
export function initBoardAutoFit() {
    const board = document.getElementById('board');
    if (!board) return;

    // Attach to window for global access (e.g., from scramble helpers)
    window.fitBoardTexts = fitBoardTexts;

    // Use a window-level variable to track the active scale across modules
    // This ensures ResizeObserver doesn't reset to 1.0 during a window resize
    const ro = new ResizeObserver(() => {
        const activeScale = window.__boardScale || 1.0;
        const subProgress = window.__boardSubProgress ?? 1.0;
        requestAnimationFrame(() => fitBoardTexts(activeScale, subProgress));
    });

    ro.observe(board);

    if (document.fonts) {
        document.fonts.ready.then(() => {
            const activeScale = window.__boardScale || 1.0;
            const subProgress = window.__boardSubProgress ?? 1.0;
            requestAnimationFrame(() => fitBoardTexts(activeScale, subProgress));
        });
    }

    // Initial run
    fitBoardTexts(window.__boardScale || 1.0, window.__boardSubProgress ?? 1.0);
}
