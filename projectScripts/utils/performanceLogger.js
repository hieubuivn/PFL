export class PerformanceLogger {
    static markers = [];
    static startTime = performance.now();

    static metrics = {
        timing: {},
        counts: {}
    };
    static marks = new Map();

    static markStart(label) {
        this.marks.set(label, performance.now());
    }

    static markEnd(label) {
        if (this.marks.has(label)) {
            const start = this.marks.get(label);
            const duration = performance.now() - start;
            this.metrics.timing[label] = duration;
            this.marks.delete(label);
        }
    }

    static log(metricName, value) {
        if (typeof value === 'number') {
            this.metrics.timing[metricName] = value;
        } else {
            // console.log(`[Perf] ${metricName}:`, value);
        }
    }

    static logTable() {
        const timings = this.metrics.timing;
        const data = [];

        // Group by Categories
        const categories = {
            'Resource': ['load_', 'parse_', 'decode_'],
            'Geometry': ['hydrate_', 'regen_'],
            'Render': ['shader_', 'gpu_'],
            'Total': ['App Ready']
        };

        for (const [key, value] of Object.entries(timings)) {
            let category = 'Other';
            for (const [cat, prefixes] of Object.entries(categories)) {
                if (prefixes.some(p => key.startsWith(p))) {
                    category = cat;
                    break;
                }
            }
            data.push({
                Category: category,
                Metric: key,
                'Time (ms)': parseFloat(value.toFixed(2))
            });
        }

        data.sort((a, b) => {
            if (a.Category === b.Category) return b['Time (ms)'] - a['Time (ms)'];
            return a.Category.localeCompare(b.Category);
        });

        // console.group("%c ⏱️ PERFORMANCE PROFILE ", "background: #222; color: #bada55; font-size: 14px; padding: 4px;");
        // console.table(data);
        // console.groupEnd();
    }

    /**
     * Start a new performance segment
     * @param {string} name 
     */
    static start(name) {
        const marker = {
            name,
            startTime: performance.now(),
            duration: 0,
            status: 'running'
        };
        this.markers.push(marker);
        return marker;
    }

    /**
     * End a performance segment
     * @param {string} name 
     */
    static end(name) {
        const marker = this.markers.find(m => m.name === name && m.status === 'running');
        if (marker) {
            marker.duration = performance.now() - marker.startTime;
            marker.status = 'finished';
        }
    }

    /**
     * Print a summary table of all finished markers
     */
    static printReport() {
        const totalDuration = performance.now() - this.startTime;
        const report = this.markers
            .filter(m => m.status === 'finished')
            .map(m => ({
                'Task': m.name,
                'Start (s)': ((m.startTime - this.startTime) / 1000).toFixed(2) + 's',
                'Duration (ms)': m.duration.toFixed(0) + 'ms',
                '% Total': ((m.duration / totalDuration) * 100).toFixed(1) + '%'
            }));

        // console.log(`%c ⚡ PERFORMANCE HEALTH REPORT (Total Init: ${(totalDuration / 1000).toFixed(2)}s) `, 'background: #ff0000; color: #ffffff; font-weight: bold; font-size: 14px; padding: 4px;');
        // console.table(report);
    }
}

window.PerformanceLogger = PerformanceLogger; // Optional global access
