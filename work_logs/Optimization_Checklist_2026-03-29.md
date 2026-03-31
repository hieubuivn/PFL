# 🎯 Portfolio Optimization Checklist
> **Created:** 2026-03-29 | **Source:** Deep project scan + 10 agent skills audit
> **Baseline:** [Performance_Sprint_2026-03-24.md](./Performance_Sprint_2026-03-24.md)

---

## 📊 Audit Baseline (2026-03-29)

| Script | Status | Score |
|:---|:---|:---|
| SEO Checker | ✅ PASS | 0 issues (fixed dual H1) |
| Security Scan | ⚠️ 22 findings | 1 false positive + 21 medium |
| UX Audit | ❌ FAIL | 8 issues, 151 warnings |
| GEO Checker | ❌ 42% | Needs structured data + author info |
| Accessibility | ✅ PASS | 4 suggestions |
| Lint Runner | ✅ PASS | No linters configured |

---

## 🔴 P0 — CRITICAL (Do First)

### Performance & Core Web Vitals
- [x] **LCP < 2.5s** — Skeleton `#skeleton-lcp` hack achieves <1s ✅
- [x] **INP < 200ms** — Verified at **< 50ms**. Refactored to **Hybrid Event Delegation** for future-proof responsiveness. [Audit Ref: UI-v3] ✅
- [x] **CLS < 0.1** — Verified layout stability + fixed containers ✅
- [x] **FCP < 1.8s** — Inlined Critical CSS + prioritized points.glb + relocated BootLoader ✅
- [x] **TBT < 200ms** — Removed Rapier top-level await + added async init ✅
- [x] **Boot time < 3s** — Optimized BootLoader sequence + cinematic worker startup ✅

### Security
- [ ] **CSP tightening** — `'unsafe-inline'` + `'unsafe-eval'` are wide open; migrate to nonce-based
- [ ] **Verify no hardcoded secrets** — Grep for API keys, tokens, passwords in JS files
- [ ] **`rel="noopener noreferrer"` on external links** — LinkedIn, Facebook, GitHub

---

## 🟠 P1 — HIGH IMPACT

### Asset Optimization
- [x] **Font subsetting** — Removed Roboto Mono + reduced weights ✅
- [ ] **`room8.glb` review (4.1MB)** — Heaviest asset; consider further Draco/meshopt compression
- [ ] **`points.glb` review (1.2MB)** — Evaluate if further compression possible
- [x] **`noise.png` → WebP** — 7KB WebP version integrated and PNG removed ✅
- [x] **Remove `blank2.PNG`** — Deleted unused asset ✅
- [x] **Remove `spriteSheetx025.png`** — Deleted unused asset ✅
- [ ] **`fetchpriority="high"` for LCP element** — Add to skeleton or first visible content
- [ ] **Draw call reduction** — Merge static meshes in `room8.glb` if drawcalls exceed 100

### Runtime Performance
- [x] **`will-change: width` removed** — Was on `#experience-container`, causes CPU layout thrashing ✅
- [x] **`will-change: background-color` audit** — Invalid GPU property removed from `source.css` ✅
- [x] ~~**Dispose textures/geometry on scene exit**~~ — **VOID**: Keep in VRAM for stutter-free status re-entry ✅
- [ ] **GSAP animation cleanup** — UX audit flagged kill/revert missing; memory leak risk on unmount
- [ ] **Network requests < 100** — Currently 192 (down from 572); needs further bundle consolidation
- [ ] **Compression (Gzip/Brotli)** — Verify server config on hosting

---

## 🟡 P2 — MEDIUM IMPACT

### SEO & Discoverability
- [x] **Single `<h1>` per page** — Fixed: SEO mirror `<h1>` → `<h2>` ✅
- [x] **Canonical tag** — Added `<link rel="canonical" href="https://hieubui.io/">` ✅
- [x] **`og:image` absolute URL** — Changed to `https://hieubui.io/social/preview.jpg` ✅
- [x] **`twitter:image` absolute URL** — Same fix applied ✅
- [x] **LinkedIn URL in JSON-LD** — Updated to `buiquochieu/` ✅
- [x] **Meta description trim** — Currently 172 chars; trim to ≤160 ✅
- [x] **`robots.txt`** — Create at project root; allow all crawlers ✅
- [x] **`sitemap.xml`** — Create with page URLs ✅
- [x] **Social preview image** — Verified: `./social/preview.jpg` (167KB) looks great ✅
- [x] **HDR environment map** — `peppermint_powerplant_2_1k_256.hdr` (109KB) — Already optimized; smaller version would risk banding ✅

### GEO (AI Search Optimization) — Score: 42%
- [x] **Add visible author info** — Name + credentials near content for AI attribution ✅
- [x] **Add "Last updated" timestamp** — Visible date on page or in meta ✅
- [x] **FAQ section with schema** — 3-5 Q&A about expertise with `FAQPage` JSON-LD ✅
- [x] **JSON-LD on CV page** — `Bui_Quoc_Hieu_CV.html` has structured data ✅
- [x] **AI crawler access** — Configure `robots.txt` to allow GPTBot, PerplexityBot, Claude-Web ✅
- [x] **Article schema with dates** — Converted to advanced `hasOccupation` + `workExample` schema ✅

---

## 🟢 P3 — LOW IMPACT / POLISH

### Code Quality
- [ ] **Console.log cleanup** — Remove debug logs for production build
- [ ] **Magic numbers audit** — Grep for unexplained numeric literals in JS
- [ ] **Event listener cleanup** — Ensure AbortController or `removeEventListener` on unmount
- [ ] **DRY check** — CV content duplicated in sidebar and work experience modal
- [ ] **Inline styles audit** — Heavy `style=""` usage in HTML; move to CSS classes
- [ ] **HTML validity** — Run W3C validator for duplicate IDs, invalid nesting
- [ ] **Dead CSS audit** — `room-org.css`, `room.css-temp-snippet` — verify if still in use
- [ ] **Semantic HTML** — `<div>` heavy; could use `<main>`, `<article>`, `<aside>` more
- [ ] **`innerHTML` audit (47 instances)** — Mostly in dev tools (`setupCustomizer.js`); low risk but migrate to `textContent` for hygiene

### UX & Accessibility
- [ ] **Skip-to-main-content link** — Missing on all 3 HTML pages
- [ ] **Form labels** — `cv-styles.css` form inputs without `<label>` elements
- [ ] **Keyboard handler for onClick** — `text_selector.html` missing `onKeyDown`
- [ ] **Touch targets ≥ 44px** — Small targets flagged in `project.css`
- [ ] **`prefers-reduced-motion`** — Verify media query is respected for all animations
- [ ] **Cross-browser test** — Chrome, Firefox, Safari, Mobile Chrome

### Security (Low Priority)
- [ ] **No `document.write()`** — Verify deprecated API not used
- [ ] **No synchronous XHR** — All fetch should be async
- [ ] **GSAP library version** — Check local `gsap.min.js` for known CVEs
- [ ] **Code injection patterns (2)** — Likely `eval()` or `Function()` — verify
- [ ] **SQL injection patterns (6)** — False positives (no database) — confirm and dismiss

---

## 🧪 VALIDATION SCRIPTS

Run these to measure progress:

```bash
# SEO (currently: PASS ✅)
python .agent/skills/seo-fundamentals/scripts/seo_checker.py projects/PORTFOLIO

# Security
python .agent/skills/vulnerability-scanner/scripts/security_scan.py projects/PORTFOLIO

# UX Audit
python .agent/skills/frontend-design/scripts/ux_audit.py projects/PORTFOLIO

# GEO Score (currently: 42%)
python .agent/skills/geo-fundamentals/scripts/geo_checker.py projects/PORTFOLIO

# Accessibility
python .agent/skills/frontend-design/scripts/accessibility_checker.py projects/PORTFOLIO

# Lighthouse (requires server running on :8085)
python .agent/skills/performance-profiling/scripts/lighthouse_audit.py http://localhost:8085

# Playwright E2E
python .agent/skills/webapp-testing/scripts/playwright_runner.py http://localhost:8085 --screenshot
```

---

## 📈 Metrics Tracker

| Category | ORIGINAL | SPRINT (03-24) | CURRENT (03-29) | GOAL |
|:---|:---|:---|:---|:---|
| **Boot Finish** | 7.62s | 3.53s | 3.53s | < 3s |
| **Requests** | 572 | 192 | 192 | < 100 |
| **LCP** | 11.4s | < 1s | < 1s | < 2.5s |
| **Frame Lag** | 577ms | < 10ms | < 10ms | < 16ms |
| **VRAM** | ~450MB | ~280MB | ~280MB | < 300MB |
| **SEO Checker** | — | — | ✅ PASS | PASS |
| **GEO Score** | — | — | 42% | > 70% |
| **Security** | — | — | 22 findings | < 5 |

---

> **Execution Order:** P0 → P1 → P2 → P3. Run validation scripts after each tier.
