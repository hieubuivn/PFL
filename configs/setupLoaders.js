import * as THREE from 'three';
import { getDynamicText } from '../projectScripts/utils/contentUtils.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';

const manager = new THREE.LoadingManager();

// --- Honest Progress Tracking (Option B) ---
const progressMap = new Map();
const taskMap = new Map();

// Configuration: Adjust these to balance "Download Time" vs "Initialisation Time"
// If assets are cached, Download Weight becomes 0 effectively, and Tasks take over.
const ASSET_DOWNLOAD_WEIGHT = 20; // Percentage of bar for downloads
const INITIALIZATION_WEIGHT = 80; // Percentage of bar for CPU/GPU tasks

// Map task IDs to user-friendly status labels
const TASK_LABELS = {
    'points-init': getDynamicText("SYS_POINTS_INIT"),
    'model-assembly': getDynamicText("SYS_MODEL_ASSEMBLY"),
    'physics-binding': getDynamicText("SYS_PHYSICS_BINDING")
};

export function registerFile(url, estimatedSize = 0) {
    // PROTECT ESTIMATES: Never overwrite an existing estimate with 0 (which happens in addToLoader)
    if (progressMap.has(url) && estimatedSize === 0) return;
    progressMap.set(url, { loaded: 0, total: estimatedSize });
}

export function registerTask(id, weight = 1) {
    taskMap.set(id, { weight, completed: false, progress: 0, startTime: performance.now(), label: TASK_LABELS[id] });
}

export function updateTaskProgress(id, factor, customLabel = null) {
    // factor: 0..1
    if (taskMap.has(id)) {
        const task = taskMap.get(id);
        task.progress = factor;
        if (customLabel) task.label = customLabel;

        // Auto-update text
        if (factor > 0 && factor < 1) {
            const label = customLabel || task.label || TASK_LABELS[id];
            if (label) {
                const progress = window.loadingProgress || 0;
                updateProgressUI(progress, label);
            }
        }

        calculateAndUpdateProgress();
    }
}

export function completeTask(id) {
    if (taskMap.has(id)) {
        const task = taskMap.get(id);
        task.completed = true;
        task.progress = 1;
        calculateAndUpdateProgress();
    }
}

export function clearProgressMap() {
    progressMap.clear();
    taskMap.clear();
}

export function handleProgress(url, loaded, total) {
    if (total > 0) {
        progressMap.set(url, { loaded, total });
    } else {
        const existing = progressMap.get(url) || { loaded: 0, total: 0 };
        progressMap.set(url, { loaded, total: existing.total });
    }

    // During downloads, update text if no initialization tasks have started
    let initializationStarted = false;
    taskMap.forEach(t => { if (t.progress > 0) initializationStarted = true; });

    if (!initializationStarted) {
        const progress = window.loadingProgress || 0;
        updateProgressUI(progress, getDynamicText("SYS_RETRIEVING_ASSETS"));
    }

    calculateAndUpdateProgress();
}

function calculateAndUpdateProgress() {
    // 1. Calculate Download Component (0 to 1)
    let totalLoadedBytes = 0;
    let totalEstimatedBytes = 0;
    progressMap.forEach((data) => {
        totalLoadedBytes += data.loaded;
        totalEstimatedBytes += data.total;
    });

    let downloadFactor = totalEstimatedBytes > 0 ? (totalLoadedBytes / totalEstimatedBytes) : 0; // Default to 0 if no files registered yet to prevent jumping to 100%

    // 2. Calculate Task Component (0 to 1)
    let totalTaskWeight = 0;
    let completedTaskWeight = 0;
    let currentTaskLabel = null;

    // Sort tasks or iterate to find the most "active" one for the label
    taskMap.forEach((task, id) => {
        totalTaskWeight += task.weight;
        completedTaskWeight += (task.progress * task.weight);

        // The current label should be the first uncompleted task that has started
        if (!currentTaskLabel && !task.completed && task.progress > 0) {
            currentTaskLabel = task.label || TASK_LABELS[id];
        }
    });

    let taskFactor = totalTaskWeight > 0 ? (completedTaskWeight / totalTaskWeight) : 0;

    // 3. Combine using Weights
    let finalProgress = 0;
    if (totalTaskWeight === 0) {
        finalProgress = downloadFactor * 100;
    } else {
        finalProgress = (downloadFactor * ASSET_DOWNLOAD_WEIGHT) + (taskFactor * INITIALIZATION_WEIGHT);
    }

    // Safety: Cap at 99 until manual 100% call
    const progress = Math.min(99.5, finalProgress);
    updateProgressUI(progress, currentTaskLabel);
}

// Global state to prevent recursion
let isUpdatingUI = false;

/**
 * Internal helper to update only the text/DOM part of the loading screen.
 * This is a "leaf" function - it must NEVER call back into updateProgressUI or checkStallWarning.
 */
function updateProgressStatus(label, dots, percentage) {
    const progressText = document.getElementById('progress-text');
    if (!progressText) return;

    const displayLabel = label || getDynamicText("SYS_INITIALIZING_SYSTEM");
    const cleanLabel = displayLabel.replace(/[.0-9%]+$/g, '').trim().toUpperCase();
    const integerProgress = Math.floor(percentage);

    const statusEl = progressText.querySelector('.progress-status');
    const valueEl = progressText.querySelector('.progress-value');
    
    if (statusEl && valueEl) {
        statusEl.innerText = `${cleanLabel}${dots}`;
        if (!window.bootLoader) {
            valueEl.innerText = `${integerProgress}%`;
        }
    } else {
        progressText.innerHTML = `
            <div class="progress-status">${cleanLabel}${dots}</div>
            <div class="progress-value">${integerProgress}%</div>
        `;
    }
}

export function updateProgressUI(percentage, activeLabel = null, fromStallCheck = false) {
    // 1. Re-entrancy Guard
    if (isUpdatingUI) return;
    isUpdatingUI = true;

    try {
        // 2. Prevent rubber-banding
        if (window.loadingProgress && percentage < window.loadingProgress && !fromStallCheck) {
            return;
        }
        if (percentage > (window.loadingProgress || 0)) {
            window.loadingProgress = percentage;
        }

        const dots = ".".repeat(1 + (Math.floor(performance.now() / 500) % 3));
        updateProgressStatus(activeLabel, dots, percentage);

        const progressBar = document.getElementById('progress-bar');
        if (progressBar) progressBar.style.width = percentage + '%';

        if (window.bootLoader && typeof window.bootLoader.updateProgress === 'function') {
            window.bootLoader.updateProgress(percentage / 100);
        }

        if (!window.loadingStartTime) window.loadingStartTime = performance.now();

        // 3. Trigger stall check only if not already in a stall check cycle
        if (!fromStallCheck) {
            checkStallWarning();
        }
    } finally {
        isUpdatingUI = false;
    }
}

function checkStallWarning() {
    const NOW = performance.now();
    let stalledTask = null;

    taskMap.forEach((task, id) => {
        if (!task.completed && (NOW - task.startTime > 8000)) {
            stalledTask = task;
        }
    });

    if (stalledTask) {
        const progress = window.loadingProgress || 0;
        // Pass true as 3rd arg to prevent recursion
        updateProgressUI(progress, getDynamicText("SYS_HEAVY_SHADERS"), true);
    }
}

manager.onStart = () => { };
manager.onLoad = () => { };

export const gltfLoader = new GLTFLoader(manager);
export const dracoLoader = new DRACOLoader(manager);
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');

export const rgbeLoader = new RGBELoader(manager);
export const textureLoader = new THREE.TextureLoader(manager);
export const ktx2Loader = new KTX2Loader(manager);
export const fileLoader = new THREE.FileLoader(manager);

export function initKTX2Loader(renderer) {
    ktx2Loader.setTranscoderPath('https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/basis/');
    ktx2Loader.detectSupport(renderer);
}
