
import * as SU from './scenarioUtility.js';
import { personaManager } from '../content-manager/personaManager.js';
import { updateStory } from '../utils/status.js';
import { getDynamicText } from '../utils/contentUtils.js';
import { activateDragonBallPointGravity } from '../resources/addDragonBalls.js';
import { slideGlassAnimation } from '../raycast/loadedModelRaycast.js';
import { GLOBAL_COLORS } from '../configs/sceneConfig.js';
import { NavInteractions } from '../interactions/navInteractions.js';

const MASTER_TIME = SU.MASTER_TIME

// --- MAIN ORCHESTRATOR ---

/**
 * runPointsScenario
 * 
 * Central orchestrator for the intro narrative sequence. 
 * This follows the "Director's Script" approach where all high-level 
 * UI transitions and state changes are called explicitly in one place.
 */
export async function runPointsScenario({ scene, camera, orbitControl, clock, pointsApp }) {
    // 1. Initialize Scenario (Static state 0: Blackhole/Chaos)
    scene.targetAnimHz = 30; // Force 30Hz lock for intro/transitions
    SU.setScenarioState(scene, 0);
    SU.deactivateEnvironment(scene, MASTER_TIME * 0.05);

    // 2. Initial Discovery Messages
    updateStory(getDynamicText('SYS_INIT'));
    updateStory(getDynamicText('ENV_CALIBRATION'));

    // 3. System Readiness
    // This step transitions the Loading Bar from "100%" to "SYSTEM READY"
    await SU.prepareSystemReady();

    // 4. Greetings & Access Protocol (The "Black Veil" is lifted)
    updateStory(getDynamicText('SYS_PILOT_ENTRY_WAIT'));

    // Technical Unveiling
    await SU.hideLoadingScreen();
    await SU.delay(200); // SETTLE WINDOW: Give the browser 200ms to clean up GC after 100MB load
    scene.isTransitioning = true; // --- PERFORMANCE MODE: ON (Post-Cleanup) ---

    // EAGER POWER-ON: Let the HUD start breathing immediately so the system feels 'alive' 
    // while the user is choosing their persona protocol.
    if (scene.HUD && typeof scene.HUD.breathe === 'function') {
        scene.HUD.breathe(GLOBAL_COLORS.ELECTRIC_CYAN);
    }

    // 6. Persona Selection (Defaults to POBA unless URL override exists)
    const selectedMode = personaManager.currentMode;

    // 6. Performance Assessment (Option B)
    if (scene.fpsStats && scene.fpsStats.avg < 45) {
        scene.isLowPowerMode = true;
    }

    // 7. Access Granted & HUD Deployment
    updateStory(`Protocol ${selectedMode.toUpperCase()} verified.`);

    // 7.1. Phase 1: CV Expansion
    const cvContainer = document.getElementById('cv-container');
    if (cvContainer && cvContainer.classList.contains('collapsed')) {
        cvContainer.classList.remove('collapsed');
        window.dispatchEvent(new CustomEvent('cvToggle', { detail: { collapsed: false } }));

        // Wait for CV Pane to finish its 350ms transition
        await SU.delay(500);
    }

    // 7.2. Phase 2: HUD Deployment
    if (scene.HUD && typeof scene.HUD.runTweenOpen === 'function') {
        // Wait for HUD expansion to finish for a sequential flow
        // await SU.delay(500000);
        await scene.HUD.runTweenOpen(1500, { isIncludedIsland: false, isIncludedDecos: false });

        scene.HUD.runTweenShowIsland(2500);
        NavInteractions.onHudOpen(scene);
        scene.HUD.runTweenShowDecos(1000);
    }

    // 7.3. Phase 3: Synchronized Reveal (Points + HTML Elements)
    // We reveal the Points system and the main UI overlays (Title, Scroll Icon, Logs) simultaneously
    // as per the requested sequence.
    if (pointsApp) {
        pointsApp.playIntro(); // Trigger shader "materialization" animation
        pointsApp.activateScrollInteractions();

        if (pointsApp.triggerStep) {
            // This triggers the appearance of the Portfolio Title and Scroll Icon
            pointsApp.triggerStep(0, 1500, true);
        }
    }

    // 8. Final Log Update
    updateStory(getDynamicText('SYS_BUILD_START'));

    // 9. Narrative Handoff
    // The narrative now shifts focus to the Scroll interaction.
    // The next story block (Assembly) will be triggered when the user scrolls to Step 2.
    // updateStory(getDynamicText('SYS_BUILD_START'));

    // We stay in Transition Mode until we are fully landed in Step 0
    setTimeout(() => {
        scene.isTransitioning = false; // --- PERFORMANCE MODE: OFF ---
    }, 1000);
}
