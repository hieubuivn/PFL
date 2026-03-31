/**
 * cvInteractions.js
 * Handles DOM-specific UI interactions for the CV panel (toggles, collapsibles).
 */

document.addEventListener('DOMContentLoaded', () => {
    initCollapsibles();
    initScrollToTop();
});

/**
 * 0. Scroll to Top Floater
 * Creates and manages the "Jump to Top" interaction for the CV.
 */
function initScrollToTop() {
    const scroller = document.getElementById('cv-scroller');
    const container = document.getElementById('cv-container');
    if (!scroller || !container) return;

    // Create the floater element
    const floater = document.createElement('div');
    floater.className = 'cv-scroll-top-floater';
    floater.setAttribute('aria-label', 'Scroll to Top');
    floater.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    `;
    container.appendChild(floater);

    // Visibility Listener
    scroller.addEventListener('scroll', () => {
        if (scroller.scrollTop > 400) {
            floater.classList.add('visible');
        } else {
            floater.classList.remove('visible');
        }
    }, { passive: true });

    // Click Action: Smooth Scroll to Top
    floater.addEventListener('click', () => {
        scroller.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Hide immediately after click to prevent stuttering
        floater.classList.remove('visible');
    });
}

/**
 * 1. Section Toggles
 * Handles the main CV sections (Summary, Experience, etc.)
 */
function initCollapsibles() {
    const headers = document.querySelectorAll('.collapsible-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            // Check if header is inside a wrapper (like the new Summary section)
            const wrapper = header.closest('.summary-header-wrapper');
            const content = wrapper ? wrapper.nextElementSibling : header.nextElementSibling;
            
            if (!content) return;

            // Toggle state
            header.classList.toggle('collapsed');
            content.classList.toggle('collapsed');
        });
    });
}

