document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       0. RESET SCROLL POSITION
       ========================================= */
    if (history.scrollRestoration) {
        history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    /* =========================================
       1. VARIABLES & CACHING
       ========================================= */
    const bgLayer = document.querySelector(".change-bg");

    // Select ALL sections for visibility toggling
    const sections = document.querySelectorAll(".placeholder-section");
    const progressLines = document.querySelectorAll(".progress_time-line");

    let cachedScrollHeight = 0;
    let cachedClientHeight = 0;

    // Set to track visible sections for 3D quality optimization
    const visibleSections = new Set();

    function updatePageMetrics() {
        cachedScrollHeight = document.documentElement.scrollHeight;
        cachedClientHeight = document.documentElement.clientHeight;
    }

    updatePageMetrics();
    window.addEventListener("resize", updatePageMetrics);


    /* =========================================
       2. VISIBILITY & 3D QUALITY TOGGLER
       ========================================= */
    // Use experience-container as root since that's what scrolls now
    const scrollRoot = document.getElementById('experience-container');

    let visibilityObserver = null;
    let colorObserver = null;

    function initializeObservers() {
        // Disconnect existing observers if any
        if (visibilityObserver) visibilityObserver.disconnect();
        if (colorObserver) colorObserver.disconnect();

        // --- VISIBILITY OBSERVER ---
        if (sections.length > 0) {
            visibilityObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        visibleSections.add(entry.target);
                    } else {
                        entry.target.classList.remove('is-visible');
                        visibleSections.delete(entry.target);
                    }
                });

                if (window.setLowQualityMode) {
                    const shouldBeLowQuality = visibleSections.size > 0;
                    window.setLowQualityMode(shouldBeLowQuality);
                }
            }, {
                root: scrollRoot,
                threshold: 0.1,
                rootMargin: "50px"
            });

            sections.forEach((section) => {
                visibilityObserver.observe(section);
            });
        }

        // --- COLOR OBSERVER ---
        if (bgLayer && sections.length > 0) {
            colorObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const newColor = entry.target.getAttribute("section-bg");
                        if (newColor) {
                            bgLayer.style.backgroundColor = newColor;
                        }
                    }
                });
            }, {
                root: scrollRoot,
                threshold: 0.5
            });

            sections.forEach((section) => {
                colorObserver.observe(section);
            });
        }
    }

    // Initialize once on load
    initializeObservers();

    // EXPOSE GLOBAL FUNCTION to re-initialize after scroll unlock
    window.reinitializeScrollObservers = function () {
        initializeObservers();
    };


    /* =========================================
       4. OPTIMIZED SCROLL LOOP (Progress Bar)
       ========================================= */
    if (progressLines.length > 0) {
        function updateMetricsForContainer() {
            if (scrollRoot) {
                cachedScrollHeight = scrollRoot.scrollHeight;
                cachedClientHeight = scrollRoot.clientHeight;
            }
        }

        function onScroll() {
            if (!scrollRoot) return;

            const scrollTop = scrollRoot.scrollTop;
            const maxScroll = cachedScrollHeight - cachedClientHeight;

            if (maxScroll <= 0) return;

            const scrollPercent = Math.min((scrollTop / maxScroll) * 100, 100);

            requestAnimationFrame(() => {
                progressLines.forEach(line => {
                    line.style.height = `${scrollPercent}%`;
                });
            });
        }

        // Listen to scroll on experience-container (not window)
        if (scrollRoot) {
            scrollRoot.addEventListener("scroll", onScroll, { passive: true });
            window.addEventListener("resize", updateMetricsForContainer);
        }

        // --- EXPOSE GLOBAL FUNCTION ---
        window.showSectionPoint = function () {
            const pointsSec = document.getElementById("section-points");
            if (pointsSec) {
                pointsSec.style.display = "block";
                const addedHeight = pointsSec.getBoundingClientRect().height;

                // Adjust scroll so user stays visually on the same content (prevent jump)
                if (scrollRoot) scrollRoot.scrollBy(0, addedHeight);

                // Update metrics for scroll progress calculation
                updateMetricsForContainer();

                // Manually trigger progress update
                onScroll();
            }
        };
    }
});