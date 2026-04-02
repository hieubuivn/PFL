import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';

/**
 * STANDALONE BOOTLOADER - WORKER ISOLATED VERSION
 */

export class BootLoader {
    constructor() {
        this.bootStartTime = performance.now();
        window.bootStartTime = this.bootStartTime;

        this.canvas = document.createElement('canvas');
        this.canvas.id = 'boot-canvas';
        Object.assign(this.canvas.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '99999',
            background: 'black',
            transition: 'opacity 0.5s ease-out'
        });
        document.body.appendChild(this.canvas);

        this.isFinished = false;
        this.lastProgress = 0;
        this.targetProgress = 0;

        // --- WORKER INITIALIZATION ---
        const workerSupported = !!this.canvas.transferControlToOffscreen;
        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth * dpr;
        const height = window.innerHeight * dpr;

        if (workerSupported) {
            // Set physical size before transferring control
            this.canvas.width = width;
            this.canvas.height = height;

            this.offscreen = this.canvas.transferControlToOffscreen();
            this.worker = new Worker(new URL('./bootWorker.js', import.meta.url), { type: 'module' });

            this.worker.postMessage({
                type: 'INIT',
                payload: {
                    canvas: this.offscreen,
                    width: width,
                    height: height
                }
            }, [this.offscreen]);

            this.useWorker = true;
        } else {
            this.initMainThreadRenderer();
        }

        // --- Common Controllers ---
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onResize = this.onResize.bind(this);
        window.addEventListener('resize', this.onResize);
        window.addEventListener('mousemove', this.onMouseMove);

        // Progress Smoother for Worker fallback or linear interpolation
        this.updateLoop = this.updateLoop.bind(this);
        requestAnimationFrame(this.updateLoop);
    }

    initMainThreadRenderer() {
        // Fallback implementation using Three.js as before
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        // (Existing shader logic would go here if we wanted a true fallback, 
        // but for now we focus on the worker path)
        this.useWorker = false;
    }

    onMouseMove(e) {
        const x = e.clientX / window.innerWidth;
        const y = 1.0 - (e.clientY / window.innerHeight);
        if (this.useWorker) {
            this.worker.postMessage({ type: 'MOUSE', payload: { x, y } });
        }
    }

    onResize() {
        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth * dpr;
        const height = window.innerHeight * dpr;

        if (this.useWorker) {
            this.worker.postMessage({
                type: 'RESIZE',
                payload: { width, height }
            });
        } else if (this.renderer) {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    updateProgress(percentage) {
        this.targetProgress = percentage;
    }

    updateLoop() {
        if (this.isFinished) return;
        requestAnimationFrame(this.updateLoop);

        // --- CINEMATIC PROGRESS SMOOTHER ---
        // Adaptive Lerp: Scales with proximity to ensure it hits 100% perfectly
        let lerpFactor = 0.12;
        if (this.pendingFinish) lerpFactor = 0.25; // Faster 'Flush' during finish

        const diff = this.targetProgress - this.lastProgress;
        if (Math.abs(diff) < 0.001) {
            this.lastProgress = this.targetProgress;
        } else {
            this.lastProgress += diff * lerpFactor;
        }

        if (this.useWorker) {
            this.worker.postMessage({ type: 'UPDATE_PROGRESS', payload: this.lastProgress });
        }

        // --- SYNC TEXT WITH SMOOTHED BAR ---
        const valueEl = document.querySelector('#progress-text .progress-value');
        if (valueEl) {
            valueEl.innerText = `${Math.floor(this.lastProgress * 100)}%`;
        }

        // --- SYNCHRONIZED EXIT LOGIC ---
        // Wait for bar to be 99.8% full before starting the 'shatter/dispersal' exit
        if (this.pendingFinish && this.lastProgress > 0.998) {
            this.executeExit();
        }
    }

    finish() {
        if (this.isFinished) return Promise.resolve();
        if (this.pendingFinish) return this.finishPromise;

        this.pendingFinish = true;
        this.targetProgress = 1.0; // Ensure bar fills up

        this.finishPromise = new Promise(resolve => {
            this.resolveFinish = resolve;
        });

        return this.finishPromise;
    }

    executeExit() {
        if (this.isFinished) return;
        this.isFinished = true;

        if (this.resolveFinish) this.resolveFinish();

        const app = document.getElementById('app-container');
        if (app) {
            app.style.display = 'flex';
            app.style.visibility = 'visible';
            app.style.opacity = '1';
        }

        this.canvas.style.opacity = '0';
        setTimeout(() => this.dispose(), 1500);
    }

    dispose() {
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('mousemove', this.onMouseMove);
        if (this.worker) this.worker.terminate();
        this.canvas.remove();
    }
}
