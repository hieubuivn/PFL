import { cvData } from './cvData.js';
import { PERSONA_IDS, DEFAULT_PERSONA } from '../configs/sceneConfig.js';
import { getDynamicText } from '../utils/contentUtils.js';
import { updateSubtitle } from '../utils/status.js';
import { shootDroneBeam } from '../scenario/scenarioUtility.js';
import { swapPicture } from '../resources/adjustObjects.js';
import { AvatarShaderEngine } from '../test/avatarShaderEngine.js';

/**
 * PersonaManager
 * Handles the viewer-persona state (recruiter vs agency/client)
 * and manages the CV content updates.
 */
class PersonaManager {
    constructor() {
        this.currentMode = DEFAULT_PERSONA; // default
        this.cvContent = document.getElementById('cv-content');
        this.personaPanel = document.getElementById('protocol-selection-panel'); // Reusing ID for now
        this.consoleEl = document.getElementById('system-console-log');
        this._lastSyncedMode = null;


        // Target elements for CV content
        this.elements = {
            role: document.getElementById('cv-role'),
            summary: document.getElementById('cv-summary'),
            summaryInner: document.querySelector('.summary-content-inner'),
            experience: document.getElementById('cv-experience'),
            skills: document.getElementById('cv-skills'),
            modeBtns: document.querySelectorAll('.mode-btn'),
            summaryModeBtns: document.querySelectorAll('.mode-switch-btn'),
            systemTitle: document.querySelector('.title-text'), // Target text span specifically
            timerDisplay: document.getElementById('selection-timer'), // New reference
            dontAskCheckbox: document.getElementById('dont-ask-persona'),
            avatarCubeWrapper: document.querySelector('.avatar-cube-container'), // NEW 3D Container
            avatarImgFront: document.getElementById('cv-avatar-img-front'), // NEW Front image
            avatarImgBack: document.getElementById('cv-avatar-img-back'), // NEW Back image
            contactsGroup: document.querySelector('.contact-links-group'), // NEW for persona links
            portfolioTitle: document.getElementById('portfolio-title') // NEW for persona landing title
        };

        this.cachedSections = []; // For Scroll Spy performance
        this.timerInterval = null;
        this.selectionPromiseResolver = null;
        this.pointsApp = null;
        this.summaryMode = 'scan'; // 'scan' (tags) or 'narrative' (paragraph)
        
        // --- 0. START AVATAR ENGINE ---
        this.avatarEngine = new AvatarShaderEngine('avatar-canvas');

        this.init();
    }

    /**
     * Toggles the Persona Selection Panel visibility with a minimize-to-icon animation.
     */
    togglePersonaPanel() {
        if (!this.personaPanel) {
            this.personaPanel = document.getElementById('protocol-selection-panel');
            if (!this.personaPanel) return;
        }

        const isHidden = window.getComputedStyle(this.personaPanel).display === 'none';
        const personaBtn = document.getElementById('persona-switch-btn');

        if (isHidden) {
            // OPENING
            if (personaBtn) {
                const rect = personaBtn.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                this.personaPanel.style.transformOrigin = `${x}px ${y}px`;
            }

            this.personaPanel.style.display = 'flex';
            this.personaPanel.classList.add('minimizing'); // Start at scale 0

            // Force reflow
            this.personaPanel.offsetHeight;

            this.personaPanel.classList.remove('minimizing'); // Expand to scale 1
            this.startTimer();
            // Flag for performance throttling
            if (window.scene) window.scene.isPersonaActive = true;
        } else {
            // CLOSING
            if (personaBtn) {
                const rect = personaBtn.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                this.personaPanel.style.transformOrigin = `${x}px ${y}px`;
            }

            this.stopTimer();
            this.personaPanel.classList.add('minimizing'); // Shrink to icon

            if (this.personaPanel.classList.contains('minimizing')) {
                // Resolve the selection promise earlier (halfway through animation)
                setTimeout(() => {
                    if (this.selectionPromiseResolver) {
                        this.selectionPromiseResolver(this.currentMode);
                        this.selectionPromiseResolver = null;
                    }
                }, 300);

                // Wait for full transition (matches 0.6s in CSS) to cleanup DOM
                setTimeout(async () => {
                    this.personaPanel.style.display = 'none';

                    // Flag for performance throttling
                    if (window.scene) window.scene.isPersonaActive = false;

                    // Premium Micro-interaction: Elastic Pop on the button implies "Stored"
                    if (window.uiAnims && window.uiAnims.triggerSpring) {
                        window.uiAnims.triggerSpring(personaBtn);
                    }

                    // EDGE CASE: If in Root States (Step 1/2) or Chaos State (Step 0), trigger energetic jump to catch eyes
                    if (this.pointsApp && typeof this.pointsApp.triggerEnergeticScrollJump === 'function') {
                        const currentStep = (typeof this.pointsApp.getCurrentStep === 'function') ? this.pointsApp.getCurrentStep() : 0;
                        if (currentStep === 0 || currentStep === 1) {
                            this.pointsApp.triggerEnergeticScrollJump();
                        }
                    }

                    // ENHANCEMENT: Final Sync for 3D state now that UI is hidden
                    if (this.pointsApp && typeof this.pointsApp.syncPersona === 'function') {
                        if (this._lastSyncedMode !== this.currentMode) {
                            this.pointsApp.syncPersona(this.currentMode);
                            this._lastSyncedMode = this.currentMode;
                        }
                    }
                }, 600);
            }
        }
    }

    startTimer() {
        if (!this.elements.timerBar) {
            this.elements.timerBar = document.getElementById('selection-timer-bar');
        }
        if (!this.elements.timerNumber) {
            this.elements.timerNumber = document.getElementById('timer-number');
        }

        if (!this.elements.timerBar) return;

        // Reset to full width explicitly without animation first
        this.elements.timerBar.style.transition = 'none';
        this.elements.timerBar.style.width = '100%';
        if (this.elements.timerNumber) this.elements.timerNumber.innerText = "10";

        // Force reflow
        void this.elements.timerBar.offsetWidth;

        // Start animation (27s)
        this.elements.timerBar.style.transition = 'width 27s linear';
        this.elements.timerBar.style.width = '0%';

        // Clear existing timeout/interval
        this.stopTimer();

        // Numeric Countdown (Visual Only)
        let remaining = 27;
        this.countInterval = setInterval(() => {
            remaining--;
            if (remaining >= 0 && this.elements.timerNumber) {
                this.elements.timerNumber.innerText = remaining;
            }
        }, 1000);

        // Action Timeout (Trigger)
        this.timerInterval = setTimeout(() => {
            this.stopTimer();
            this.setPersona(this.currentMode);
        }, 27000); // 27 seconds
    }

    stopTimer() {
        if (this.timerInterval) {
            clearTimeout(this.timerInterval);
            this.timerInterval = null;
        }
        if (this.countInterval) {
            clearInterval(this.countInterval);
            this.countInterval = null;
        }
    }

    /**
     * Set the pointsApp instance explicitly (ESM Standard)
     */
    setPointsApp(instance) {
        this.pointsApp = instance;
        if (this.currentMode && typeof instance.syncPersona === 'function') {
            instance.syncPersona(this.currentMode);
            this._lastSyncedMode = this.currentMode;
        }

        // Re-sync uniform now that PointsApp (and likely the Hub) is ready
        this.syncUniform(this.currentMode);
    }

    /**
     * Higher-level API for the Scenario Director.
     * Triggers the UI and returns a promise that resolves when a choice is made 
     * and the panel has finished its closing animation.
     */
    async requestPersonaSelection() {
        // Check if user has opted out of auto-selection panel OR has a direct URL link
        const skipAuto = localStorage.getItem('persona-skip-auto') === 'true';
        if (skipAuto || this._modeFromUrl) {
            // console.log(`[PersonaManager] Skipping Selection Panel: skipAuto=${skipAuto}, modeFromUrl=${this._modeFromUrl}`);
            // If skip is on, we still resolve with current mode but don't show UI
            return this.currentMode;
        }

        this.togglePersonaPanel();
        return new Promise(resolve => {
            this.selectionPromiseResolver = resolve;
        });
    }

    /**
     * Set the persona and update UI/State.
     * @param {string} mode - 'poba' or 'dev'
     */
    setPersona(mode, options = {}) {
        this.stopTimer(); // Ensure timer stops on manual selection

        if (!cvData[mode]) {
            return;
        }

        // Helper log (Removed)
        // const roleName = mode === PERSONA_IDS.POBA ? 'Reviewing Product Strategy...' : 'Loading Interactive Experiments...';
        // this.logMessage(roleName);

        this.applyMode(mode, false, options.skipPointsSync);

        // Save "Don't ask again" state
        if (this.elements.dontAskCheckbox) {
            localStorage.setItem('persona-skip-auto', this.elements.dontAskCheckbox.checked);
        }

        // Hide panel after selection
        if (this.personaPanel && this.personaPanel.style.display !== 'none') {
            this.togglePersonaPanel();
        }

        // Emit event for other systems to react
        window.dispatchEvent(new CustomEvent('personaSelected', { detail: { mode } }));
    }

    init() {
        // --- PROPOSED LOGIC (URL > STORAGE > DEFAULT) ---
        const urlParams = new URLSearchParams(window.location.search);
        let mode = urlParams.get('mode');

        if (mode && cvData[mode]) {
            // Priority 1: URL Parameter explicitly set
            this.currentMode = mode;
            this._modeFromUrl = true;
            localStorage.setItem('cv-view-mode-v3', mode);
        } else {
            // Priority 2: Default fallback (Always POBA as per user requirement)
            mode = DEFAULT_PERSONA;
            this.currentMode = mode;
            // EXPLICIT SYNC: Append to URL quietly on first load
            this.updateUrl(mode, true); // true = replaceState
            localStorage.setItem('cv-view-mode-v3', mode);
        }

        // Apply initial state
        this.applyMode(this.currentMode, true);
        this.syncUniform(this.currentMode);

        // Initialize checkbox state from storage
        if (this.elements.dontAskCheckbox) {
            this.elements.dontAskCheckbox.checked = localStorage.getItem('persona-skip-auto') === 'true';
        }

        this.setupEventListeners();
    }

    /**
     * Updates the browser URL without reloading the page.
     * @param {string} mode - The persona mode ('poba' or 'dev')
     * @param {boolean} silent - Use replaceState instead of pushState
     */
    updateUrl(mode, silent = false) {
        const url = new URL(window.location);
        if (url.searchParams.get('mode') !== mode) {
            url.searchParams.set('mode', mode);
            if (silent) {
                window.history.replaceState({ mode }, '', url);
            } else {
                window.history.pushState({ mode }, '', url);
            }
            // console.log(`[PersonaManager] URL Updated (${silent ? 'Silent' : 'History'}): ?mode=${mode}`);
        }
    }

    setupEventListeners() {
        // 1. Key Listener: 'P' to toggle persona panel
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (e.key.toLowerCase() === 'p') {
                e.preventDefault();
                this.togglePersonaPanel();
            }

            if (e.key.toLowerCase() === 'h') {
                e.preventDefault();
                const title = this.elements.portfolioTitle;
                const scrollIndicator = document.querySelector('.scroll-indicator');

                if (title) {
                    const isHidden = title.style.display === 'none';
                    const targetDisplay = isHidden ? 'block' : 'none';
                    title.style.display = targetDisplay;
                    if (scrollIndicator) scrollIndicator.style.display = targetDisplay;
                }
            }

            if (e.key.toLowerCase() === 'b') {
                e.preventDefault();
                const boardToggle = document.getElementById('board');
                if (boardToggle) {
                    const isHiddenBoard = boardToggle.style.display === 'none';
                    boardToggle.style.display = isHiddenBoard ? '' : 'none';
                }
            }
        });

        // 2. Scroll Spy Logic (Throttled & Cached for Performance)
        const scroller = document.getElementById('cv-scroller');
        const navItems = document.querySelectorAll('.nav-item');
        if (scroller) {
            let tick = false;

            const updateActiveSection = () => {
                if (window._cvState && window._cvState !== 'idle') {
                    tick = false;
                    return;
                }

                let currentSection = "";
                const scrollTop = scroller.scrollTop;

                for (let i = 0; i < this.cachedSections.length; i++) {
                    const section = this.cachedSections[i];
                    if (scrollTop >= section.offsetTop - 120) {
                        currentSection = section.id || section.getAttribute('id');
                    }
                }

                navItems.forEach(item => {
                    item.classList.toggle('active', item.getAttribute('data-target') === currentSection);
                });

                if (scrollTop < 100) {
                    navItems.forEach(i => i.classList.remove('active'));
                    if (navItems.length > 0) navItems[0].classList.add('active');
                }

                tick = false;
            };

            scroller.addEventListener('scroll', () => {
                if (!tick) {
                    requestAnimationFrame(updateActiveSection);
                    tick = true;
                }
            }, { passive: true });

            this.cacheScrollSections();
        }

        // 3. Backdrop Click to Close (Keep for self-containment of modal)
        if (this.personaPanel) {
            this.personaPanel.addEventListener('click', (e) => {
                if (e.target === this.personaPanel) {
                    this.togglePersonaPanel();
                }
            });
        }

        // 4. Browser History (Back/Forward) Listener
        window.addEventListener('popstate', (e) => {
            const mode = (e.state && e.state.mode) || new URLSearchParams(window.location.search).get('mode') || DEFAULT_PERSONA;
            if (mode !== this.currentMode) {
                // console.log(`[PersonaManager] History Navigation detected: ${mode}`);
                this.applyMode(mode, false);
            }
        });

        // 5. Summary Mode Switcher
        if (this.elements.summaryModeBtns) {
            this.elements.summaryModeBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const newSummaryMode = btn.getAttribute('data-summary-mode');
                    if (this.summaryMode !== newSummaryMode) {
                        this.summaryMode = newSummaryMode;

                        // Update UI state
                        this.elements.summaryModeBtns.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');

                        // Re-render summary area
                        this.renderSummary();
                    }
                });
            });
        }

        // 6. Mobile 3D Hint Dismissal
        const dismissBtn = document.getElementById('dismiss-3d-hint');
        if (dismissBtn) {
            dismissBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const hint = document.querySelector('.mobile-3d-hint');
                if (hint) {
                    hint.classList.add('hidden');
                    // Completely remove after animation if desired, 
                    // or just keep hidden as per CSS
                }
            });
        }
        
        // 7. Avatar Container Interaction (NEW: Toggle Persona on Click)
        const avatarBox = document.getElementById('avatar-container');
        if (avatarBox) {
            avatarBox.addEventListener('click', (e) => {
                e.preventDefault();
                const nextMode = (this.currentMode === 'dev') ? 'poba' : 'dev';
                this.setPersona(nextMode);
            });
        }
    }

    applyMode(mode, instant = false, skipPointsSync = false) {
        const isSameMode = this.currentMode === mode;
        const isCurrentlyMorphing = this.pointsApp && typeof this.pointsApp.isMorphing === 'function' ? this.pointsApp.isMorphing() : false;

        // Save current mode
        this.currentMode = mode;
        localStorage.setItem('cv-view-mode-v3', mode);

        // Update UI active states (always do this to ensure CSS classes are correct)
        const allModeBtns = document.querySelectorAll('[data-mode]');
        allModeBtns.forEach(btn => {
            const btnMode = btn.getAttribute('data-mode');
            const hintEl = btn.querySelector('.preference-hint');

            if (btnMode === mode) {
                btn.classList.add('active');

                const hasPrevious = localStorage.getItem('cv-view-mode-v3');
                if (hasPrevious && hintEl) {
                    hintEl.innerText = "YOUR PREVIOUS SELECTION";
                    hintEl.style.display = 'block';
                }
            } else {
                btn.classList.remove('active');
                if (hintEl) {
                    hintEl.style.display = 'none';
                }
            }
        });

        // If it's the same mode and we aren't mid-morph, skip heavy UI work (flips, fades)
        if (isSameMode && !isCurrentlyMorphing && !instant) {
            return;
        }

        if (instant) {
            this.updateDOM();
        } else {
            // Trigger 3D Avatar Swap (GLSL Edition)
            if (this.avatarEngine) {
                const targetVal = this.currentMode === 'dev' ? 1.0 : 0.0;
                this.avatarEngine.transitionTo(targetVal);
            }


            if (this.cvContent) {
                // Keep standard fade for heavy paragraph content
                this.cvContent.classList.add('swapping');

                setTimeout(() => {
                    this.updateDOM();
                    this.cvContent.classList.remove('swapping');
                }, 300);
            } else {
                this.updateDOM();
            }
        }



        // Dispatch global event for other systems
        window.dispatchEvent(new CustomEvent('audienceChanged', { detail: { mode } }));

        // TRIGGER DRONE FEEDBACK (Auto-reaction)
        // Corrected: Only trigger when in the 'room' scenario state and HERO is NOT busy
        if (window.scene && window.scene.scenarioState?.name === 'room' && !instant && !window.scene.isHeroAnimating) {
            const isPoba = mode === PERSONA_IDS.POBA;
            const key = isPoba ? 'SYS_DRONE_SUBTITLES_POBA' : 'SYS_DRONE_SUBTITLES_DEV';
            const newText = getDynamicText(key);

            // 1. Update UI Subtitle
            updateSubtitle(newText);

            // 2. Trigger Drone Beam/VFX
            shootDroneBeam(window.scene, null, newText);
        }

        // SYNC UNIFORM: Link persona to Meeting UI (POBA) state
        this.syncUniform(mode);

        // SYNC 3D MESH: Swap the visible half of the room's picture frame
        swapPicture(mode === PERSONA_IDS.POBA);

        // Update the 3D sync if not already handled by a panel close
        // ENHANCEMENT: Allow sync attempt even if modes match IF a morph is currently in progress
        const isPanelVisible = this.personaPanel && this.personaPanel.style.display !== 'none';

        if (this.pointsApp && typeof this.pointsApp.syncPersona === 'function' && !isPanelVisible) {
            if (this._lastSyncedMode !== mode || isCurrentlyMorphing) {
                this.pointsApp.syncPersona(mode, skipPointsSync);
                this._lastSyncedMode = mode;
            }
        }

        // Finally, sync the URL (unless it's an instant/init call)
        if (!instant) {
            this.updateUrl(mode);
        }

        // ALWAYS update Document Title for tab consistency
        const data = cvData[mode];
        if (data && data.systemTitle) {
            document.title = `${data.systemTitle} | BUI QUOC HIEU Portfolio`;
        }
    }

    /**
     * Synchronizes the uIsPoba uniform with the given mode.
     */
    syncUniform(mode) {
        if (window.scene && window.scene.globalUniformsHub && window.scene.globalUniformsHub.displaySystem) {
            const val = (mode === PERSONA_IDS.POBA) ? 1.0 : 0.0;
            window.scene.globalUniformsHub.displaySystem.uIsPoba.value = val;
            // console.log(`[PersonaManager] Uniform Sync: uIsPoba = ${val}`);
        }
    }

    /**
     * Executes the Cyber-Decode (scramble) text effect on a target element
     */
    triggerCyberDecode(element, newText, durationMs = 1500) {
        if (!element || !newText) return;

        // Cancel existing animation if running
        if (element.scrambleRaf) cancelAnimationFrame(element.scrambleRaf);

        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*";
        const fps = 24; // Lower FPS for terminal chunkiness
        const frameInterval = 1000 / fps;
        const textLen = newText.length;

        let startTime = performance.now();
        let lastFrameTime = startTime;

        const render = (time) => {
            if (!time) time = performance.now();
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / durationMs, 1.0);

            if (time - lastFrameTime > frameInterval || progress === 1.0) {
                lastFrameTime = time;
                let scrambledText = "";

                for (let i = 0; i < textLen; i++) {
                    const char = newText[i];
                    if (char === ' ' || char === '\n') {
                        scrambledText += char;
                    } else if (progress * (textLen + 5) > i) {
                        // Lock in characters left-to-right
                        scrambledText += char;
                    } else {
                        // Scramble unlocked characters
                        scrambledText += chars[Math.floor(Math.random() * chars.length)];
                    }
                }
                element.innerText = scrambledText;
            }

            if (progress < 1.0) {
                element.scrambleRaf = requestAnimationFrame(render);
            } else {
                element.innerText = newText; // Final snap to guarantee correct text
            }
        };

        element.scrambleRaf = requestAnimationFrame(render);
    }

    /**
     * Renders the summary section based on the current mode (scan vs narrative)
     */
    renderSummary() {
        const data = cvData[this.currentMode];
        if (!data || !this.elements.summaryInner) return;

        const isScanMode = this.summaryMode === 'scan';
        const fileName = isScanMode
            ? (this.currentMode === 'dev' ? 'CREATIVE_ENGINE.sys' : 'STRATEGY_MAP.conf')
            : 'BIO.md';

        // --- 1. PREPARE SCAN MODE CONTENT ---
        let entriesHtml = '';
        let rawCode = '';
        if (isScanMode) {
            entriesHtml = (data.summaryTags || []).map((tag, index, arr) => {
                const isArray = Array.isArray(tag.val);
                const isLast = index === arr.length - 1;
                const commentHtml = tag.comment ? ` <span class="code-comment" data-target-text='${tag.comment.replace(/'/g, "&apos;")}'>${tag.comment}</span>` : '';

                if (isArray) {
                    const valsHtml = tag.val.map(v => `<span class="code-quote">"</span><span class="code-val" data-target-text='${v.replace(/'/g, "&apos;")}'>${v}</span><span class="code-quote">"</span>`).join('<span class="code-sep">, </span>');
                    return `
                        <div class="code-line">
                            <span class="code-key" data-target-text="${tag.key}">${tag.key}</span><span class="code-sep">: </span><span class="code-bracket">[</span>${valsHtml}<span class="code-bracket">]</span>${isLast ? '' : '<span class="code-sep">,</span>'}${commentHtml}
                        </div>
                    `;
                } else {
                    return `
                        <div class="code-line">
                            <span class="code-key" data-target-text="${tag.key}">${tag.key}</span><span class="code-sep">: </span><span class="code-quote">"</span><span class="code-val" data-target-text='${tag.val.toString().replace(/'/g, "&apos;")}'>${tag.val}</span><span class="code-quote">"</span>${isLast ? '' : '<span class="code-sep">,</span>'}${commentHtml}
                        </div>
                    `;
                }
            }).join('');

            rawCode = `{\n${(data.summaryTags || []).map(t => {
                const val = Array.isArray(t.val) ? `[${t.val.map(v => `"${v}"`).join(', ')}]` : `"${t.val}"`;
                return `  ${t.key}: ${val}${t.comment ? `, ${t.comment}` : ','}`; // Format properly with commas and comments
            }).join('\n').replace(/,$/, '')}\n}`; // Remove trailing comma from last line
        } else {
            // Prepared text for copying in narrative mode
            rawCode = data.summary;
        }

        // --- 2. RENDER UNIFIED WRAPPER ---
        this.elements.summaryInner.innerHTML = `
            <div class="summary-code-block-wrapper" style="border-radius: 0;">
                <div class="code-editor-header" style="border-radius: 0;">
                    <div class="terminal-prompt-icon">>&nbsp;${fileName}</div>
                    
                    <!-- SWITCHER GROUP (Left-ish) -->
                    <div class="summary-mode-switcher-inline" style="border-radius: 0;">
                        <button class="mode-switch-btn ${isScanMode ? 'active' : ''}" data-summary-mode="scan" style="border-radius: 0;">
                            <span>SCAN</span>
                        </button>
                        <button class="mode-switch-btn ${!isScanMode ? 'active' : ''}" data-summary-mode="narrative" style="border-radius: 0;">
                            <span>NARRATIVE</span>
                        </button>
                    </div>

                    <!-- ACTION GROUP (Right) -->
                    <button class="copy-code-btn" id="copy-summary-btn" title="Copy to clipboard" style="border-radius: 0; margin-left: auto;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <rect x="9" y="9" width="13" height="13" rx="0" ry="0"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        <span class="btn-txt">COPY</span>
                    </button>
                </div>

                <div class="summary-code-block" style="border-radius: 0; min-height: 150px;">
                    ${isScanMode ? `
                        <span class="code-bracket">{</span>
                        <div class="code-body">${entriesHtml}</div>
                        <span class="code-bracket">}</span>
                    ` : `
                        <div class="summary-narrative">${data.summary}</div>
                    `}
                </div>
            </div>
        `;

        // --- 3. RE-ATTACH LISTENERS ---
        const internalModeBtns = this.elements.summaryInner.querySelectorAll('.mode-switch-btn');
        internalModeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const newMode = btn.getAttribute('data-summary-mode');
                if (this.summaryMode !== newMode) {
                    this.summaryMode = newMode;
                    this.renderSummary();
                }
            });
        });

        const copyBtn = this.elements.summaryInner.querySelector('.copy-code-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(rawCode).then(() => {
                    const btnTxt = copyBtn.querySelector('.btn-txt');
                    if (btnTxt) {
                        const originalTxt = btnTxt.innerText;
                        btnTxt.innerText = 'COPIED!';
                        copyBtn.classList.add('copied');
                        setTimeout(() => {
                            btnTxt.innerText = originalTxt;
                            copyBtn.classList.remove('copied');
                        }, 2000);
                    }
                });
            });
        }

        // --- 4. TRIGGER ANIMATIONS ---
        if (isScanMode) {
            const codeElements = this.elements.summaryInner.querySelectorAll('.code-key, .code-val');
            codeElements.forEach((el, index) => {
                const targetText = el.getAttribute('data-target-text');
                this.triggerCyberDecode(el, targetText, 1000 + (index * 100)); // Staggered delay
            });
        } else {
            const narrativeEl = this.elements.summaryInner.querySelector('.summary-narrative');
            if (narrativeEl) {
                this.triggerCyberDecode(narrativeEl, data.summary, 1200);
            }
        }
    }

    updateDOM() {
        const data = cvData[this.currentMode];
        if (!data) return;

        // SCRAMBLE CRITICAL HEADERS
        if (this.elements.role) {
            this.triggerCyberDecode(this.elements.role, data.role, Math.max(1000, data.role.length * 40));
        }

        if (this.elements.systemTitle && data.systemTitle) {
            this.triggerCyberDecode(this.elements.systemTitle, data.systemTitle, 1000);
        }

        // FADE HEAVY TEXT BLOCKS (Already handled by .swapping css class timing in applyMode)
        this.renderSummary();

        if (this.elements.experience) {
            this.elements.experience.innerHTML = data.experience.map(job => `
                <div class="role-block">
                    <div class="role-header">
                        <div class="company-wrapper">
                            <span class="company">${job.company}</span>
                            ${job.companyDesc ? `
                                <div class="company-info-trigger">
                                    <svg class="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="16" x2="12" y2="12"></line>
                                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                    </svg>
                                </div>
                            ` : ''}
                        </div>
                        <div class="role-collapse-hint">
                            <span class="hint-text">CLICK TO COLLAPSE</span>
                            <svg class="chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                    </div>
                    ${job.companyDesc ? `<div class="company-context">${job.companyDesc}</div>` : ''}
                    <div class="title-row">
                        <span class="job-title">${job.title}</span>
                        <span class="date">${job.date}</span>
                    </div>
                    <ul>
                        ${job.points.map(p => `<li>${p}</li>`).join('')}
                    </ul>
                </div>
            `).join('');

            this.rebindCollapsibles();
        }

        // --- 5. PORTFOLIO TITLE SYNC ---
        // We defer to the pointsApp UI sync if possible to get the nice "Scramble" effect
        if (this.pointsApp && typeof this.pointsApp.refreshUIPersonaSync === 'function') {
            this.pointsApp.refreshUIPersonaSync();
        } else if (this.elements.portfolioTitle) {
            // FALLBACK: Direct Text Sync (Single pass)
            const currentStep = (this.pointsApp && typeof this.pointsApp.getCurrentStep === 'function') ? this.pointsApp.getCurrentStep() : 0;
            const mode = this.currentMode.toUpperCase();

            const prefix = this.elements.portfolioTitle.querySelector('.title-prefix');
            const header = this.elements.portfolioTitle.querySelector('.title-header');
            if (prefix) prefix.innerText = getDynamicText(`NARR_STEP_0_PREFIX_${mode}`);
            if (header) header.innerText = getDynamicText(`NARR_STEP_0_HEADER_${mode}`);

            const verb = this.elements.portfolioTitle.querySelector('.title-verb');
            const outcome = this.elements.portfolioTitle.querySelector('.title-outcome');
            const credibility = this.elements.portfolioTitle.querySelector('.title-credibility');
            if (verb) verb.innerText = getDynamicText(`NARR_STEP_0_VERB_${mode}`);
            if (outcome) outcome.innerText = getDynamicText(`NARR_STEP_0_OUTCOME_${mode}`);
            if (credibility) credibility.innerText = getDynamicText(`NARR_STEP_0_CREDIBILITY_${mode}`);

            const subtitle = this.elements.portfolioTitle.querySelector('.title-subtitle');
            if (subtitle) {
                const subKey = `NARR_STEP_${currentStep}_SUBTITLE_${mode}`;
                subtitle.innerText = getDynamicText(subKey);
            }
        }

        if (this.elements.skills) {
            // Remove the legacy grid class from the container to allow clean stacking
            this.elements.skills.classList.remove('skills-grid');

            this.elements.skills.innerHTML = data.skills.map(skill => `
                <div class="role-block skill-block-entry" data-star-indices="${(skill.starIndices || []).join(',')}">
                    <div class="role-header">
                        <span class="company">${skill.category}</span>
                    </div>
                    <ul>
                        <li>${skill.val}</li>
                    </ul>
                </div>
            `).join('');
            this.rebindSkillInteractions();
        }

        // --- 4. CONTACT LINKS (Dynamic icons & metadata) ---
        if (this.elements.contactsGroup && data.contacts) {
            const icons = {
                gmail: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
                linkedin: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`,
                phone: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
                website: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`
            };

            this.elements.contactsGroup.innerHTML = data.contacts.map(c => `
                <button 
                    class="contact-btn-tiny" 
                    data-id="${c.id}"
                    data-label="${c.label}"
                    data-platform="${c.platform}"
                    data-url="${c.url}"
                    aria-label="${c.label}"
                >
                    ${icons[c.id] || ''}
                </button>
            `).join('');
        }

        // INSTANT LOAD AVATAR IF INSTANT REFRESH
        // (If not instant, the applyMode block already triggered the 3d rotation and pre-loaded the image into the hidden face)
        if (this.elements.avatarImgFront && !this.elements.avatarCubeWrapper.classList.contains('swapping-avatar')) {
            this.elements.avatarImgFront.src = data.cvAvatarURL;
        } else if (this.elements.avatarImgBack) {
            this.elements.avatarImgBack.src = data.cvAvatarURL;
        }

        // REFRESH SCROLL SPY CACHE
        this.cacheScrollSections();
    }

    cacheScrollSections() {
        this.cachedSections = Array.from(document.querySelectorAll('.section-anchor, .collapsible-header'));
    }

    rebindCollapsibles() {
        const roleBlocks = this.elements.experience.querySelectorAll('.role-block');
        roleBlocks.forEach(block => {
            if (block.dataset.roleBound) return;
            block.dataset.roleBound = 'true';

            block.addEventListener('click', (e) => {
                // Prevent interference if user clicks a link inside
                if (e.target.tagName === 'A' || e.target.closest('a')) return;
                e.stopPropagation();

                const isCollapsed = block.classList.toggle('collapsed');
                const hintText = block.querySelector('.hint-text');

                // Update Header Hints
                if (hintText) {
                    hintText.textContent = isCollapsed ? 'CLICK TO EXPAND' : 'CLICK TO COLLAPSE';
                }

                // Recalculate offsets after UI changes
                this.cacheScrollSections();
            });
        });
    }

    rebindSkillInteractions() {
        const skillsContainer = this.elements.skills;
        if (!skillsContainer) return;

        const skillModules = skillsContainer.querySelectorAll('.skill-block-entry');
        skillModules.forEach(module => {
            const starIndicesAttr = module.getAttribute('data-star-indices');
            if (!starIndicesAttr) return;

            const indices = starIndicesAttr.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n !== -1);
            if (indices.length === 0) return;

            const triggerPulse = () => {
                if (this.pointsApp && typeof this.pointsApp.setConstellationVisibility === 'function') {
                    this.pointsApp.setConstellationVisibility(true);

                    // Trigger pulses for all mapped stars in the cluster
                    indices.forEach(idx => {
                        if (typeof this.pointsApp.triggerStarPulse === 'function') {
                            this.pointsApp.triggerStarPulse(idx);
                        }
                    });
                }
            };

            const untriggerPulse = () => {
                if (this.pointsApp && typeof this.pointsApp.setConstellationVisibility === 'function') {
                    this.pointsApp.setConstellationVisibility(false);
                }
            };

            module.addEventListener('mouseenter', triggerPulse);
            module.addEventListener('mouseleave', untriggerPulse);
            module.addEventListener('click', triggerPulse);
        });
    }

    /**
     * Highlights a skill block in the 2D CV based on its category name.
     * Used for 3D -> 2D synchronization.
     */
    highlightSkillByCategory(category) {
        if (!this.elements.skills) return;

        // Remove all existing highlights first
        const allBlocks = this.elements.skills.querySelectorAll('.skill-block-entry');
        allBlocks.forEach(block => block.classList.remove('active-gold-glow'));

        if (!category) return;

        // Find and highlight the matching block
        const targetBlock = Array.from(allBlocks).find(block => {
            const companySpan = block.querySelector('.company');
            return companySpan && companySpan.textContent.trim().toUpperCase() === category.toUpperCase();
        });

        if (targetBlock) {
            targetBlock.classList.add('active-gold-glow');
        }
    }

    logMessage(msg) {
        if (!this.consoleEl) return;
        // Simple typing effect or direct replace
        this.consoleEl.innerHTML = `<span class="console-cursor">></span> ${msg}`;

        // Optional: flash effect
        this.consoleEl.style.opacity = '1';
        setTimeout(() => this.consoleEl.style.opacity = '0.7', 100);
        setTimeout(() => this.consoleEl.style.opacity = '1', 200);
    }

    /**
     * Helper to update the <picture> tag when changing personas
     */
    updatePictureTag(imgEl, webpUrl) {
        if (!imgEl) return;

        // 1. Update the fallback img tag
        // We assume the URL is a .webp, so we look for the .png version if needed
        const pngUrl = webpUrl.replace('.webp', '.png');
        imgEl.src = pngUrl;

        // 2. Update the <source> tags if inside a <picture>
        const parent = imgEl.parentElement;
        // If it's a <picture> tag, look for <source> children
        // Note: Sometimes the structure might be <picture><source><source><img></picture>
        // so we check parent or parent of parent.
        const picture = parent.tagName === 'PICTURE' ? parent : (parent.parentElement && parent.parentElement.tagName === 'PICTURE' ? parent.parentElement : null);
        
        if (picture) {
            const sources = picture.querySelectorAll('source');
            sources.forEach(source => {
                const type = source.getAttribute('type');
                if (type === 'image/webp') {
                    source.srcset = webpUrl;
                } else {
                    source.srcset = pngUrl;
                }
            });
        }
    }
}

// Global Singleton
export const personaManager = new PersonaManager();
