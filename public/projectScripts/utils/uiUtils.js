/**
 * UI Animation Utilities
 * Centralized GSAP micro-interactions for consistent feel.
 */

window.uiAnims = {
    /**
     * Triggers a "Spring" or "Elastic Pop" effect on a DOM element.
     * Used for buttons to imply action confirmation or storage.
     * @param {HTMLElement} element - The target button or icon.
     */
    triggerSpring: function (element) {
        if (!element || !window.gsap) return;

        window.gsap.to(element, {
            scale: 1.3,
            duration: 0.8,
            ease: "elastic.out(1.2, 0.4)",
            clearProps: "scale",
            onStart: () => {
                // Ensure it doesn't get stuck if clicked multiple times rapidly
                window.gsap.set(element, { scale: 1 });
            }
        });
    }
};
