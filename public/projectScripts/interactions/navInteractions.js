/**
 * HUD Navigation Interactions Orchestrator
 * Dedicated logic for managing button lifecycle and state transitions.
 */

export const NavInteractions = {
    isUnlocked: true,

    init: (scene) => {
        const hud = scene.HUD;
        if (!hud || !hud.navButtons) return;

        // 1. Initial State: Force all buttons to hidden
        hud.navButtons.forEach(btn => {
            btn.hide(0);
            btn.setActive(false);
        });


    },

    onHudOpen: (scene) => {
        const hud = scene.HUD;
        if (!hud || !hud.navButtons) return;

        const DUR = 1200;    // Expansion duration

        // Physical Order (Right to Left): CV (0) | WORK (1) | LAB (2) | ABOUT (3)

        // 1. ALL OTHERS: Force hidden initially
        hud.navButtons.forEach((btn, i) => {
            if (i !== 0) btn.hide(0);
        });

        // 2. CV Toggle (Collapse/Expand): Show immediately
        const cvBtn = hud.navButtons[0];
        cvBtn.show(DUR, 1.0); // Square Ratio
        cvBtn.setActive(false);
    },

    /**
     * Triggered when user first scrolls out of Chaos into the Morph (Root) state.
     */
    onMorphToAbout: (scene) => {
        const hud = scene.HUD;
        if (!hud || !hud.navButtons) return;

        const STAGGER = 150;
        const DUR = 1000;

        // 1. ABOUT: Active by default on first reveal
        const aboutBtn = hud.navButtons[3];
        aboutBtn.setText("ABOUT");
        aboutBtn.show(DUR, 2.0);
        aboutBtn.setActive(true);

        // 2. LAB
        setTimeout(() => {
            const labBtn = hud.navButtons[2];
            labBtn.setText("LAB");
            labBtn.show(DUR, 1.8);
            labBtn.setActive(false);
        }, STAGGER);

        // 3. WORK
        setTimeout(() => {
            const workBtn = hud.navButtons[1];
            workBtn.setText("WORK");
            workBtn.show(DUR, 2.2);
            workBtn.setActive(false);
        }, STAGGER * 2);
    },

    /**
     * Triggered during the Room Assembly sequence.
     */
    onRoomAssemble: (scene) => {
        const hud = scene.HUD;
        if (!hud || !hud.navButtons) return;

        // UNLOCK PERMANENTLY: Once assembly starts, we consider the nav "unlocked"
        NavInteractions.isUnlocked = true;



        // 1. CV Toggle: Always visible
        hud.navButtons[0].show(1500, 1.0);

        // 2. LAB (Active in room)
        const labBtn = hud.navButtons[2];
        labBtn.setText("LAB");
        labBtn.show(1500, 1.8);
        labBtn.setActive(true);

        // 3. WORK
        const workBtn = hud.navButtons[1];
        workBtn.setText("WORK");
        workBtn.show(1500, 2.2);
        workBtn.setActive(false);

        // 4. ABOUT
        const aboutBtn = hud.navButtons[3];
        aboutBtn.setText("ABOUT");
        aboutBtn.show(1500, 2.0);
        aboutBtn.setActive(false);
    }
};
