
/**
 * Yields control to the browser's main thread to allow UI updates and event processing.
 * Usage: await yieldToBrowser();
 */
export async function yieldToBrowser() {
    return new Promise(resolve => requestAnimationFrame(resolve));
}
