export const typingFS = `
    uniform vec2 iResolution;
    uniform float iTime;
    uniform float uBSODState; // 0.0 = Normal, 1.0 = BSOD
    uniform float uIsPoba;    // 0.0 = Normal, 1.0 = Meeting Mode
    uniform vec2 uHoverPos;
    uniform float uHoverActive;
    uniform vec2 uClickPos;
    uniform float uClickTime;
    uniform float uBootState; // 0.0 = Booting, 1.0 = Working
    uniform sampler2D uChannelAvatars;
    uniform float uHasAvatarTexture;
    uniform vec2 uSpecialPos1;
    uniform vec2 uSpecialPos2;

    varying vec2 vUv;
    varying float vLayoutMode; // 0.0 = Full (Phone + Code), 1.0 = Code Only (Primary), 2.0 = Code Only (Secondary)

    // --- CONFIGURATION ---
    #define PI 3.14159265
    #define TAU 6.28318530
    #define CODE_SIZE 38.0
    #define SCROLL_SPEED 2.0
    #define TAB_WIDTH 3.0
    #define CURSOR_ROW 16.0

    // UI DIMENSIONS
    #define TITLE_HEIGHT 0.05
    #define TABBAR_HEIGHT 0.05
    #define STATUS_HEIGHT 0.035
    #define ACTIVITY_W 0.045

    // --- PALETTE ---
    #define C_BG      vec3(0.12, 0.12, 0.12)
    #define C_BSOD    vec3(0.0, 0.47, 0.84) // Windows Blue
    #define C_CONSOLE vec3(0.08, 0.08, 0.08) // Darker console BG
    #define C_ACT_BAR vec3(0.20, 0.20, 0.20)
    #define C_SIDE_FG vec3(0.50, 0.50, 0.50)
    #define C_GUTTER  vec3(0.18, 0.18, 0.18)
    #define C_GUIDE   vec3(0.22, 0.22, 0.22)
    #define C_LINENUM vec3(0.35, 0.45, 0.50)
    #define C_DEF     vec3(0.85, 0.85, 0.85)
    #define C_KEY     vec3(0.77, 0.52, 0.75)
    #define C_FUNC    vec3(0.86, 0.86, 0.66)
    #define C_TYPE    vec3(0.30, 0.60, 0.80)
    #define C_STR     vec3(0.80, 0.57, 0.47)
    #define C_COM     vec3(0.41, 0.60, 0.33)
    #define C_ERR     vec3(0.80, 0.20, 0.20) // Console Error Color

    // --- UTILS ---
    float hash21(vec2 p) {
        p = fract(p * vec2(234.34, 435.345));
        p += dot(p, p + 34.23);
        return fract(p.x * p.y);
    }
    float STK_hash12(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * .1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
    }
    float noise(float x) { return fract(sin(x) * 43758.5453); }
    float noise(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

    vec2 STK_randVec(vec2 p) {
        float a = STK_hash12(p) * 6.28318 + iTime;
        return vec2(sin(a), cos(a));
    }
    float STK_perlin(vec2 p) {
        vec2 i = floor(p); vec2 f = fract(p);
        vec2 s = f * f * (3.0 - 2.0 * f); 
        float a = dot(STK_randVec(i), f);
        float b = dot(STK_randVec(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
        float c = dot(STK_randVec(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
        float d = dot(STK_randVec(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
        return mix(mix(a, b, s.x), mix(c, d, s.x), s.y) * 1.41421;
    }

    // --- SHAPE FUNCTIONS ---
    float STK_square(vec2 p, vec2 s) {
        vec2 d = abs(p) - s;
        return length(max(d, 0.0)) + min(0.0, max(d.x, d.y));
    }
    float sdRoundedBox(vec2 p, vec2 b, float r) {
        vec2 q = abs(p) - b + r;
        return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
    }

    // Global Phone SDF
    float getPhoneDist(vec2 p) {
        vec2 phoneDim = vec2(0.40, 0.78);
        float bezelRad = 0.08;
        float dBody = sdRoundedBox(p, phoneDim, bezelRad);
        
        if (p.x < phoneDim.x - 0.02) return dBody;

        float buttonWidth = 0.015;
        vec2 pBtn = p - vec2(phoneDim.x, 0.0);
        float dVolUp = sdRoundedBox(pBtn - vec2(0.0, 0.15), vec2(buttonWidth, 0.06), 0.01);
        float dVolDn = sdRoundedBox(pBtn - vec2(0.0, 0.0), vec2(buttonWidth, 0.06), 0.01);
        float dPower = sdRoundedBox(pBtn - vec2(0.0, -0.2), vec2(buttonWidth, 0.04), 0.01);
        
        return min(dBody, min(min(dVolUp, dVolDn), dPower));
    }

    // --- BITMAP FONT ---
    float getBit(int charID, vec2 uv) {
        if (uv.x < 0. || uv.x > 1. || uv.y < 0. || uv.y > 1.) return 0.;
        int x = int(floor(uv.x * 4.0)); 
        int y = int(floor(uv.y * 5.0)); 
        int bits = 0;
        
        if (charID < 10) {
            if(charID==0) bits=31599; else if(charID==1) bits=9362;
            else if(charID==2) bits=29671; else if(charID==3) bits=29391;
            else if(charID==4) bits=23497; else if(charID==5) bits=31183;
            else if(charID==6) bits=31215; else if(charID==7) bits=29257;
            else if(charID==8) bits=31727; else if(charID==9) bits=31695;
        } else if (charID >= 10 && charID <= 16) {
            if (charID == 10) bits = 10240; else if (charID == 11) bits = 6928;
            else if (charID == 12) bits = 14476; else if (charID == 13) bits = 2312;
            else if (charID == 14) bits = 4740; else if (charID == 15) bits = 17556;
            else bits = 320;
        } else {
            int r = charID % 6;
            if(r==0) bits = 23509; else if(r==1) bits = 31214;
            else if(r==2) bits = 29351; else if(r==3) bits = 23925;
            else if(r==4) bits = 23669; else bits = 15340;
        }
        return float((bits >> (x + y * 4)) & 1);
    }

    // --- STOCK CHART UTILS ---
    float STK_curve(in vec2 p, in float fy, in float minLimit, in float maxLimit) {
        if(p.x < minLimit || p.x > maxLimit) return 0.;
        float d = 1. - 150.*abs(p.y - fy);
        return clamp(d, 0., 1.);
    }
    float STK_nSin(in float t) { return 0.5 + 0.5 * sin(t); }
    float STK_glowingPoint(in vec2 uv, in vec2 pos, in float size) {
        float dist = distance(uv, pos);
        // Medical monitor style: Sharp central pixel-point with soft halo
        float core = smoothstep(0.005, 0.0, dist);
        float glow = clamp(1.0 - (1.0/size) * dist, 0.0, 1.0);
        return core + sqrt(glow) * 0.5;
    }
    float STK_stockFunc(in float x, float time, float trend) {
        float speed = 0.15;
        float t = x + time * speed;
        float f0 = 6.28; float f1 = 3.68; float f2 = 13.28; float f3 = 32.43;
        float f4 = 123.0; float f5 = 331.0; float f6 = 730.0; float f7 = 1232.0;
        float wave = sin(f0*t)*0.4 + sin(f1*t)*0.2 + sin(f2*t)*0.1 + cos(f3*t)*0.15 + sin(f4*t)*0.1 + sin(f5*t)*0.05 + sin(f6*t)*0.035 + sin(f7*t)*0.02;
        float modVal = mod(sin(f1*t)*sin(f2*t), 0.1) * (5.0*sqrt(STK_nSin(f0*t)));
        
        // trend=1.0 for gentler slope, x goes 0->1.6
        // wave * 0.8 for more visible ups/downs
        float fy = (1.0 * x) - 0.8 * (wave + modVal); 
        return fy * 0.12; // Scale down for height constraint
    }
    float STK_d_stockFunc(in float x, float delta, float time, float trend) {
        return (STK_stockFunc(x - delta, time, trend) - STK_stockFunc(x, time, trend)) / delta;
    }
    float STK_longTrend(in float x, float time, float trend) {
        return (STK_d_stockFunc(x, 0.025, time, trend) + STK_d_stockFunc(x, 0.05, time, trend) + STK_d_stockFunc(x, 0.1, time, trend)) / 3.0;
    }
    float STK_shortTrend(in float x, float time, float trend) {
        return (STK_d_stockFunc(x, 0.004, time, trend) + STK_d_stockFunc(x, 0.005, time, trend) + STK_d_stockFunc(x, 0.006, time, trend)) / 3.0;
    }
    vec3 STK_trendColor(in float trendVal) {
        // Amplified: sharper atan + more saturated red/green
        vec3 red = vec3(1.0, 0.12, 0.08); vec3 green = vec3(0.08, 1.0, 0.32);
        float t = atan(trendVal * 200.0) / 1.570796; // was 100.0 - sharpened
        return mix(green, red, (t + 1.0) / 2.0);
    }

    float STK_heartbeat_ECG(in float x) {
        float hei = 0.0;
        // High frequency jitter
        hei += sin(x * 60.0) * 0.01;
        // Low frequency wobble
        hei += sin(x * 15.0) * 0.03;
        
        // Periodic Heartbeat Spikes (Every 0.5 units)
        float pX = mod(x, 0.5) - 0.25; 
        float hb_mult = smoothstep(0.12, 0.01, abs(pX));
        float hb_hei = sin(pX / 0.1 * 3.14159) * 0.8; // Increased height
        
        return mix(hei, hb_hei, hb_mult);
    }

    // --- BOOTING SCREEN UTILS ---
    float sdBox(vec2 p, float b) {
        vec2 d = abs(p) - b;
        return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
    }

    vec3 Logo(vec2 p, float aa_width, out float t_logo) {
        // High-contrast blue gradient with a slight glow
        vec3 col = mix(vec3(0.0, 0.1, 0.8), vec3(0.1, 0.6, 1.0), p.y * 0.5 + 0.5);
        const float b = 0.4875;
        const float c = 0.5125;
        
        t_logo = sdBox(abs(p) - c, b);
        t_logo = 1.0 - smoothstep(-aa_width, aa_width, t_logo);
        return col * t_logo;
    }

    float SpinningCircle(vec2 p, float aa_width, float iTime) {
        const float anim_speed = 0.7;
        float time = iTime * anim_speed;
        const float r_big   = 0.85714286;
        const float r_small = 0.14285714;

        float d_ring = length(p) - r_big;
        // Sharpen the ring AA
        float t_ring = 1.0 - smoothstep(-aa_width, aa_width, abs(d_ring) - r_small);
        
        vec2 phase = pow(vec2(mod(time, 3.0) / 3.0), vec2(0.8, 1.25)) * TAU * 3.0;

        vec2 sc1 = vec2(sin(phase.x), cos(phase.x));
        vec2 sc2 = vec2(sin(phase.y), cos(phase.y));
        
        float d_cir1 = length(p - sc1 * r_big) - r_small;
        float d_cir2 = length(p - sc2 * r_big) - r_small;
        float t_cir = 1.0 - smoothstep(-aa_width, aa_width, min(d_cir1, d_cir2));

        float angle = atan(p.x, p.y); 
        if(angle < 0.0) angle += TAU;
        
        float angle_start = mod(phase.y, TAU);
        float angle_end   = mod(phase.x, TAU);
        
        float mask = 0.0;
        if (angle_start < angle_end) {
            mask = step(angle_start, angle) * step(angle, angle_end);
        } else {
            mask = step(angle_start, angle) + step(angle, angle_end);
        }

        return min(1.0, mask + t_cir) * t_ring;
    }

    void main() {
        vec2 fragCoord = vUv * iResolution;
        vec2 uv = fragCoord / iResolution.xy;
        float aspect = iResolution.x / iResolution.y;

        // --- BOOTING STATE ---
        if (uBootState < 0.5) {
            // fwidth(uv) gives 1/Pixels. So (1/H) / (1/W) = W/H = physical aspect.
            float dx = fwidth(vUv.x);
            float dy = fwidth(vUv.y);
            float meshAspect = dy / dx; 
            
            // Center UV around (0,0)
            vec2 bootUV = (vUv - 0.5);
            
            // 1. Correct the aspect distortion
            bootUV.x *= meshAspect;
            
            // 2. Normalize scale so the logo stays consistent relative to the SHORTEST side.
            // This prevents it from scaling out of bounds on vertical/thin monitors.
            float localScale = min(1.0, meshAspect);
            bootUV /= localScale;
            
            float t_logo;
            // Scale down logo (3.5 -> 5.5) and push it higher up (0.08 -> 0.15)
            vec2 p_logo = (bootUV - vec2(0.0, 0.15)) * 5.5;
            float aaLogo = length(fwidth(p_logo)) * 0.75;
            vec3 logo_col = Logo(p_logo, aaLogo, t_logo);
            
            // Scale down circle (11.0 -> 18.0) and push it further down (0.12 -> 0.3)
            vec2 p_sp_cir = (bootUV + vec2(0.0, 0.3)) * 18.0;
            float aaCir = length(fwidth(p_sp_cir)) * 0.75;
            float t_sp_cir = SpinningCircle(p_sp_cir, aaCir, iTime);
            
            vec3 col = mix(logo_col, vec3(1.0), t_sp_cir);
            gl_FragColor = vec4(pow(col, vec3(0.4545)), 1.0);
            return;
        }

        // --- BSOD OVERRIDE ---
        if (uBSODState > 0.5) {
            vec3 col = C_BSOD;
            
            // Sad Face :(
            vec2 center = vec2(0.2, 0.7); // Top Left-ish
            vec2 p = uv - center;
            p.x *= aspect;
            
            // Eyes
            float dEyes = min(length(p - vec2(-0.05, 0.05)), length(p - vec2(0.05, 0.05)));
            float eyes = smoothstep(0.015, 0.01, dEyes);
            
            // Mouth (Arc)
            vec2 m = p - vec2(0.0, -0.08);
            float dMouthFunc = length(m) - 0.06;
            // Crop bottom half to make arc
            float mouth = smoothstep(0.01, 0.005, abs(dMouthFunc)) * step(0.0, m.y);
            
            col = mix(col, vec3(1.0), eyes + mouth);
            
            // Text Lines (Abstract)
            // Header
            if (uv.x > 0.1 && uv.x < 0.6 && uv.y < 0.55 && uv.y > 0.5) {
                col = vec3(1.0);
            }
            // Paragraphs
            if (uv.x > 0.1 && uv.x < 0.8 && uv.y < 0.45 && uv.y > 0.2) {
                 float row = floor(uv.y * 20.0);
                 if (mod(row, 2.0) == 0.0) {
                      float lineLen = hash21(vec2(row, 1.0)) * 0.7 + 0.1;
                      if ((uv.x - 0.1) < lineLen) col = vec3(1.0);
                 }
            }
            
            // QRCode (Fake Block)
            vec2 qrUV = uv - vec2(0.15, 0.15);
            qrUV.x *= aspect;
            if (abs(qrUV.x) < 0.06 && abs(qrUV.y) < 0.06) {
                float qrNoise = step(0.5, hash21(floor(qrUV * 100.0)));
                col = mix(col, vec3(1.0), qrNoise);
            }

            gl_FragColor = vec4(col, 1.0);
            return;
        }
        
        // --- LAYOUT BOUNDARIES ---
        float topBarBot    = 1.0 - TITLE_HEIGHT;
        float tabBot       = topBarBot - TABBAR_HEIGHT;
        float statusTop    = STATUS_HEIGHT;
        float activityRight= ACTIVITY_W;
        
        // 1. STATUS BAR
        if (uv.y < statusTop) { 
            gl_FragColor = vec4(0.0, 0.48, 0.8, 1.0); 
            return; 
        }
        
        // 2. TITLE BAR
        if (uv.y > topBarBot) {
            vec3 col = vec3(0.18); 
            if (uv.x > 0.85) {
                float rx = (uv.x - 0.85);
                float wFactor = 0.05 * aspect;
                int btnIdx = int(floor(rx / wFactor)); 
                vec2 btnUV = vec2(fract(rx / wFactor), (uv.y - topBarBot) / TITLE_HEIGHT);
                vec2 icoUV = abs(btnUV - 0.5);
                float icon = 0.0;
                if (btnIdx == 0) icon = step(abs(btnUV.y - 0.4), 0.01) * step(icoUV.x, 0.15); 
                else if (btnIdx == 1) { float m = max(icoUV.x, icoUV.y); icon = step(0.12, m) * step(m, 0.15); } 
                else if (btnIdx == 2) { 
                    col = vec3(0.8, 0.1, 0.1); 
                    float xShp = min(abs((btnUV.x-0.5)-(btnUV.y-0.5)), abs((btnUV.x-0.5)+(btnUV.y-0.5)));
                    icon = step(xShp, 0.02) * step(icoUV.x, 0.15);
                }
                col = mix(col, vec3(1.0), icon);
            }
            if (abs(uv.x - 0.5) < 0.2 && uv.y > topBarBot + 0.01 && uv.y < 1.0 - 0.01) col = vec3(0.24);
            gl_FragColor = vec4(col, 1.0); 
            return;
        }
        
        // 3. ACTIVITY BAR
        if (uv.x < activityRight) {
            vec3 col = C_ACT_BAR;
            float iconY = uv.y * 10.0; float iconId = floor(iconY);
            if (iconId > 5.0 && iconId < 9.0) {
                 if (abs(fract(iconY) - 0.5) < 0.2 && abs(uv.x - activityRight*0.5) < 0.01)
                     col = (iconId == 8.0) ? C_DEF : C_SIDE_FG;
            }
            gl_FragColor = vec4(col, 1.0); 
            return;
        }

        // 4. TAB BAR
        if (uv.y > tabBot && uv.y < topBarBot) {
            vec3 col = vec3(0.14);
            float relX = (uv.x - activityRight); 
            float tabIndex = floor(relX / 0.15);
            if (tabIndex < 3.0 && tabIndex >= 0.0) {
                bool isActive = (int(tabIndex) == 0);
                col = isActive ? C_BG : vec3(0.16);
                if (isActive && uv.y > topBarBot - 0.002) col = vec3(0.0, 0.48, 0.8);
            }
            gl_FragColor = vec4(col, 1.0); 
            return;
        }

        // 5. MAIN AREA LAYOUT
        float editorW = 1.0 - activityRight;
        float editorH = tabBot - statusTop;
        vec2 eUV = vec2((uv.x - activityRight) / editorW, (uv.y - statusTop) / editorH);
        
        // --- MULTI-LAYOUT MODE ---
        // vLayoutMode 0.0: Primary Monitor (Left: Code, Right: Graph Part 1)
        // vLayoutMode 2.0: Secondary Monitor (Full: Graph Part 2)
        // vLayoutMode 1.0: Vertical Monitor (Full: Phone)
        bool isVerticalMode = abs(vLayoutMode - 1.0) < 0.1;
        bool isSecondaryMode = abs(vLayoutMode - 2.0) < 0.1;
        
        bool displayGraph = isSecondaryMode || (!isVerticalMode && eUV.x >= 0.5);
        bool displayCode = !isVerticalMode && !isSecondaryMode && eUV.x < 0.5;

        // Vertical Divider (Only in split mode on Primary)
        if (!isVerticalMode && !isSecondaryMode && abs(eUV.x - 0.5) < 0.002) { gl_FragColor = vec4(vec3(0.08), 1.0); return; }

        vec2 paneUV = vec2(isVerticalMode ? eUV.x : (displayCode ? (eUV.x * 2.0) : eUV.x), eUV.y);
        vec3 col = C_BG;

        // ============================
        // LEFT PANE (SPLIT: 70% CODE, 30% CONSOLE)
        // ============================
        if (displayCode) {
            // Define Split Point (0.0 is bottom, 1.0 is top)
            float consoleSplit = 0.3; // 30% height for console

            // -- UPPER AREA: CODE EDITOR --
            if (paneUV.y > consoleSplit) {
                // Remap Y to allow scrolling text to flow naturally or just mask it.
                float speedMult = 1.0 + vLayoutMode * 0.3; // 1.3x faster on vertical monitor
                float paneScroll = floor(iTime * SCROLL_SPEED * speedMult);
                
                float paneAspect = (aspect * editorW) * (isVerticalMode ? 1.0 : 0.5); 
                vec2 grid = vec2(CODE_SIZE * paneAspect * 1.5, CODE_SIZE);
                vec2 pos = paneUV * grid; pos.y -= (paneScroll + vLayoutMode * 500.0); // Seed offset
                vec2 cellID = floor(pos); vec2 cellUV = fract(pos) * 1.3 - 0.15;
                
                if (cellID.x > 80.0) { gl_FragColor = vec4(col, 1.0); return; }

                float screenRow = floor(eUV.y * CODE_SIZE);
                float cursorRow = CURSOR_ROW;
                float cursorX = 7.5 + mod((iTime + vLayoutMode * 42.0) * 15.0, 40.0);
                
                bool isCursorRow = abs(screenRow - cursorRow) < 0.5;
                if (screenRow < cursorRow || (isCursorRow && (cellID.x > cursorX))) {
                    gl_FragColor = vec4(col, 1.0); return; 
                }

                if (cellID.x < 3.5) {
                    col = C_GUTTER;
                    if (cellID.x >= 1.0 && cellID.x < 3.0 && mod(cellID.y, 2.0) == 0.0) {
                        float seedY = abs(cellID.y + vLayoutMode * 77.0);
                        int digit = int(mod(seedY * (cellID.x==1.0?0.1:1.0), 10.0));
                        col = mix(col, C_LINENUM, getBit(digit, cellUV));
                    }
                } else {
                    // Flattened text rendering
                    float row = cellID.y + vLayoutMode * 123.45;
                    float rowHash = hash21(vec2(row, 12.34));
                    float structure = sin(row * 0.15) + sin(row * 0.4) * 0.5;
                    float currentIndent = floor(max(0.0, structure * 2.0 + 1.5));
                    bool isClosingBlock = (rowHash > 0.85);
                    float indentChars = (isClosingBlock ? max(0.0, currentIndent - 1.0) : currentIndent) * TAB_WIDTH;
                    float localX = cellID.x - 3.5;
                    
                    if (localX < indentChars) {
                        if (mod(localX, TAB_WIDTH) < 0.4 && localX > 0.5 && abs(cellUV.x - 0.5) < 0.15) col = C_GUIDE;
                    } else {
                        if (hash21(vec2(row, 99.0)) <= 0.94) { 
                            float wordX = localX - indentChars;
                            float lineLen = isClosingBlock ? 1.0 : 15.0 + noise(row)*25.0;
                            if (wordX < lineLen) {
                                float charNoiseVal = noise(vec2(wordX*0.2, row));
                                if (charNoiseVal >= 0.25) {
                                    vec3 textCol = C_DEF;
                                    if (isClosingBlock) { 
                                        col = mix(col, textCol, getBit(12, cellUV)); 
                                    } else {
                                        int charType = 17 + int(charNoiseVal * 100.0) % 10;
                                        if (wordX < 4.0 && noise(vec2(0.0, row)) > 0.4) {
                                            float nextI = floor(max(0.0, (sin((row+1.0)*0.15) + sin((row+1.0)*0.4)*0.5)*2.0+1.5));
                                            textCol = (nextI > currentIndent) ? (noise(row) < 0.4 ? C_KEY : C_FUNC) : C_TYPE;
                                        } else {
                                            float wordHash = noise(floor(wordX/4.0) + row*10.0);
                                            if (wordHash < 0.2) textCol = C_STR; else if (wordHash < 0.35) textCol = C_KEY;
                                        }
                                        if (rowHash > 0.9) textCol = C_COM;
                                        col = mix(col, textCol, getBit(charType, cellUV));
                                    }
                                }
                            }
                        }
                    }
                }
                // Cursor
                if (isCursorRow && abs(cellID.x - cursorX) < 0.5) col = mix(col, C_DEF, step(0.5, sin(iTime*12.0)));
            } 
            // -- LOWER AREA: CONSOLE / TERMINAL --
            else {
                // Divider Line
                if (paneUV.y > consoleSplit - 0.005) {
                    col = vec3(0.08); // Splitter line color
                } else {
                    // Console Background
                    col = C_CONSOLE;
                    
                    // Console Block Logic
                    // Remap UV to 0-1 within console area
                    float cY = paneUV.y / consoleSplit;
                    vec2 cUV = vec2(paneUV.x, cY);
                    
                    // Create Scrolling Grid
                    float rowCount = 8.0;
                    float consoleSpeed = iTime * (1.5 + vLayoutMode * 0.5); // Faster console on vertical
                    float rowID = floor(cUV.y * rowCount + consoleSpeed + vLayoutMode * 99.0);
                    
                    // Generate random blocks per row
                    float rowHash = hash21(vec2(rowID, 42.0));
                    
                    // Only draw on some lines (sparse log output)
                    if (rowHash > 0.3) {
                         // Determine block width based on row hash
                         float lineLength = (hash21(vec2(rowID, 1.0)) * 0.6) + 0.1; 
                         
                         // Determine color (White usually, Red occasionally for errors)
                         vec3 blockCol = (hash21(vec2(rowID, 2.0)) > 0.9) ? C_ERR : vec3(0.7);
                         
                         if (cUV.x < lineLength && cUV.x > 0.02) {
                             // Make it look like separate blocks/words
                             float wordHash = hash21(vec2(floor(cUV.x * 20.0), rowID));
                             if (wordHash > 0.2) {
                                 col = blockCol;
                             }
                         }
                    }
                }
            }
        } 
        // ============================
        // RIGHT PANE: ANIMATED PHONE (Unchanged)
        // ============================
        else {
            if (displayGraph) {
                // PANORAMIC SEAMLESS STOCK CHART
                float trendVal = 1.5;
                float bezelWidth = 0.04;
                float globalX = isSecondaryMode ? (0.5 + bezelWidth + eUV.x) : (eUV.x - 0.5);
                vec3 stkColor = vec3(0.0);

                if (uIsPoba > 0.5) {
                    // ============================
                    // MEETING UI (POBA MODE - v5)
                    // ============================
                    // User Rule: Only in 2 half areas (Right of Primary, Left of Secondary)
                    bool inMeetingZone = (isSecondaryMode && eUV.x < 0.5) || (!isSecondaryMode && eUV.x >= 0.5);
                    
                    if (!inMeetingZone) {
                        stkColor = C_BG; 
                    } else {
                        vec3 meetCol = vec3(0.12, 0.12, 0.13); 
                        float totalMeetingW = 1.0 + bezelWidth;
                        float nX = globalX / totalMeetingW;
                        float nY = eUV.y; 

                        // 1. HEADER AREA
                        if (nY > 0.88) {
                            meetCol = vec3(0.09, 0.09, 0.1);
                            // REC Icon & "RECORDING" label
                            float dRec = length(vec2(nX, nY) - vec2(0.06, 0.94)) - 0.012;
                            float recBlink = step(0.0, sin(iTime * 6.0));
                            meetCol = mix(meetCol, vec3(1.0, 0.2, 0.2), smoothstep(fwidth(dRec), -fwidth(dRec), dRec) * recBlink);
                            
                            float tX = (nX - 0.4) / 0.2;
                            if (tX > 0.0 && tX < 1.0 && abs(nY - 0.94) < 0.01) {
                                meetCol = mix(meetCol, vec3(0.8), step(0.2, hash21(floor(vec2(tX * 60.0, 0.0)))) * 0.5);
                            }
                            if (nX > 0.92) {
                                float winX = fract(nX * 50.0);
                                if (abs(nY - 0.94) < 0.015 && winX > 0.2 && winX < 0.8) meetCol = vec3(0.6);
                            }
                        } 
                        // 2. TITLE BAR
                        else if (nY > 0.80) {
                            meetCol = vec3(0.12, 0.12, 0.13);
                            float tX = (nX - 0.05) / 0.4;
                            if (tX > 0.0 && tX < 1.0) {
                                if (abs(nY - 0.84) < 0.012) meetCol = mix(meetCol, vec3(1.0, 0.8, 0.0), 0.8);
                                if (abs(nY - 0.81) < 0.005) meetCol = mix(meetCol, vec3(0.5), 0.6);
                            }
                        }
                        // 3. FOOTER
                        else if (nY < 0.12) {
                            meetCol = vec3(0.08, 0.08, 0.09);
                            float btnAreaX = (nX - 0.25) / 0.5;
                            if (btnAreaX > 0.0 && btnAreaX < 1.0 && nY > 0.03 && nY < 0.09) {
                                float btnID = floor(btnAreaX * 7.0);
                                float btnX = fract(btnAreaX * 7.0);
                                vec2 bUV = vec2(btnX, (nY - 0.03) / 0.06);
                                float dBtn = length(bUV - 0.5) - 0.35;
                                vec3 btnC = (btnID == 6.0) ? vec3(1.0, 0.2, 0.2) : vec3(0.4, 0.42, 0.45);
                                meetCol = mix(meetCol, btnC, smoothstep(fwidth(dBtn), -fwidth(dBtn), dBtn));
                            }
                        }
                        // 4. GRID (6 Avatars)
                        else {
                            vec2 gridUV = vec2(nX, (nY - 0.12) / 0.68);
                            vec2 tUV = fract(gridUV * vec2(3.0, 2.0));
                            vec2 id = floor(gridUV * vec2(3.0, 2.0));
                            float mask = smoothstep(0.01, 0.02, tUV.x) * smoothstep(0.99, 0.98, tUV.x) *
                                         smoothstep(0.02, 0.03, tUV.y) * smoothstep(0.98, 0.97, tUV.y);
                            
                            if (mask > 0.0) {
                                vec3 tileCol = vec3(0.18, 0.19, 0.21);
                                vec2 pUV = (tUV - 0.5) * 1.5;
                                
                                // Participant Definitions & Labels
                                vec3 personaCol = vec3(0.6); // Default person color
                                
                                bool isSpec1 = (id == uSpecialPos1);
                                bool isSpec2 = (id == uSpecialPos2);

                                if (uHasAvatarTexture > 0.5 && (isSpec1 || isSpec2)) {
                                     float avatarScale = 0.6;
                                     float glitch = hash21(vec2(floor(iTime * 15.0), id.x)) * 0.005 * step(0.9, hash21(vec2(iTime, 0.0)));
                                     vec2 scaledUV = (tUV - 0.5) / avatarScale + 0.5 + vec2(glitch, -glitch);
                                     
                                     // Sample Half-Texture
                                     float xOff = isSpec1 ? 0.0 : 0.5;
                                     // KTX2 Orientation Fix: Flip Y manually since sampler2D ignores texture.repeat/offset
                                     vec2 texUV = vec2(xOff + scaledUV.x * 0.5, 1.0 - scaledUV.y);
                                     
                                     vec4 tex = texture2D(uChannelAvatars, texUV);
                                     
                                     // Wrap in Circle with margin
                                     float d = length(tUV - 0.5);
                                     float circMask = smoothstep(0.48 * avatarScale, 0.46 * avatarScale, d);
                                     
                                     // Ensure we don't sample outside scaled UV bounds
                                     float bounds = step(0.0, scaledUV.x) * step(scaledUV.x, 1.0) * step(0.0, scaledUV.y) * step(scaledUV.y, 1.0);
                                     tileCol = mix(tileCol, tex.rgb, tex.a * circMask * bounds);
                                } else {
                                     float d = min(length(pUV - vec2(0.0, 0.15)) - 0.12, 
                                                   length(vec2(pUV.x, (pUV.y + 0.45) * 1.8)) - 0.38);
                                     float person = smoothstep(fwidth(d), -fwidth(d), d);
                                     tileCol = mix(tileCol, personaCol, person); 
                                }
                                
                                // Dynamic Active Selection (Hover-based)
                                vec2 activeId = vec2(2.0, 1.0); // Default User 3
                                if (uHoverActive > 0.5) {
                                    vec2 hGridUV = vec2(uHoverPos.x / totalMeetingW, (uHoverPos.y - 0.12) / 0.68);
                                    vec2 hId = floor(hGridUV * vec2(3.0, 2.0));
                                    if (hId.x >= 0.0 && hId.x < 3.0 && hId.y >= 0.0 && hId.y < 2.0) {
                                        activeId = hId;
                                    }
                                }

                                // Speaking Highlight (Cyan Border & Pulse)
                                if (id == activeId) {
                                    float bD = abs(max(abs(tUV.x-0.5), abs(tUV.y-0.5)) - 0.49);
                                    float bF = fwidth(bD);
                                    tileCol = mix(tileCol, vec3(0.0, 1.0, 1.0), smoothstep(bF + 0.005, bF, bD));
                                    
                                    // Aggressive Pulsating Speaking Indicator
                                    float speakPulse = 0.5 + 0.5 * sin(iTime * 12.0);
                                    float dSpeak = length(tUV - vec2(0.12, 0.15)) - (0.04 + 0.02 * speakPulse);
                                    float glow = smoothstep(0.08, 0.0, length(tUV - vec2(0.12, 0.15)));
                                    
                                    tileCol = mix(tileCol, vec3(0.0, 1.0, 1.0), smoothstep(fwidth(dSpeak), -fwidth(dSpeak), dSpeak));
                                    tileCol += vec3(0.0, 1.0, 1.0) * glow * speakPulse * 0.6; 
                                } else {
                                    float dMic = length(tUV - vec2(0.1, 0.12)) - 0.02;
                                    tileCol = mix(tileCol, vec3(1.0, 0.3, 0.3), smoothstep(fwidth(dMic), -fwidth(dMic), dMic));
                                }

                                // Participant Labels (Abstract)
                                if (tUV.x > 0.08 && tUV.y > 0.85) {
                                    float lbl = step(0.4, hash21(floor(tUV * vec2(40.0, 20.0)) + id * 10.0));
                                    tileCol = mix(tileCol, vec3(0.95), lbl * 0.6);
                                }
                                meetCol = mix(meetCol, tileCol, mask);
                            }
                        }
                        stkColor = meetCol;
                    }

                } else {
                    // ============================
                    // STANDARD GRAPHS (STOCK/ECG)
                    // ============================
                    // Lower baseline to 12% (0.12)
                    vec2 stkUV = vec2(globalX, eUV.y - 0.12); 
                    
                    vec3 points = vec3(0.0);
                    float pkgSize = 0.025; 
                    
                    for(float offset = 0.; offset < 1.6 ; offset += 0.08) {
                        float pos = offset; 
                        bool isLeading = (offset >= 1.44);
                        vec3 baseColor = STK_trendColor(STK_longTrend(pos, iTime, trendVal));
                        vec3 pColor;
                        if (isLeading) {
                            float pointVal = STK_glowingPoint(stkUV, vec2(pos, STK_stockFunc(pos, iTime, trendVal)), pkgSize);
                            pColor = mix(baseColor, vec3(1.0), 0.85) * pointVal * 2.4;
                        } else {
                            pColor = STK_glowingPoint(stkUV, vec2(pos, STK_stockFunc(pos, iTime, trendVal)), pkgSize) * baseColor;
                        }
                        points = max(points, pColor);
                        pkgSize *= 0.94;
                    }
                   
                    float rawCurve = STK_curve(stkUV, STK_stockFunc(stkUV.x, iTime, trendVal), -0.1, 2.0);
                    vec3 line = STK_trendColor(STK_shortTrend(stkUV.x, iTime, trendVal)) * (rawCurve + rawCurve * rawCurve * 2.0);
                    
                    float totalWidth = 0.5 + bezelWidth + 1.0; 
                    float scanX = mod(iTime * 0.6, totalWidth);
                    float mask = (1.0 - step(scanX, globalX)); 
                    float scanDist = scanX - globalX;
                    float taper = smoothstep(1.6, 0.0, scanDist);
                    float thicknessFactor = taper * 0.7 + 0.3; 

                    float hbY = STK_heartbeat_ECG(globalX);
                    float hbDist = abs(hbY * 0.12 - (eUV.y - 0.05));
                    float hbLine = (smoothstep(0.015 * thicknessFactor, 0.005 * thicknessFactor, hbDist) + 
                                    smoothstep(0.08 * thicknessFactor, 0.0, hbDist) * 0.4) * taper * mask;
                    
                    float currentHbY = STK_heartbeat_ECG(scanX);
                    vec2 iconPos = vec2(scanX, currentHbY * 0.12 + 0.05);
                    float icon = STK_glowingPoint(vec2(globalX, eUV.y), iconPos, 0.03);
                    
                    vec3 hbCol = vec3(0.0, 1.0, 1.0) * (hbLine * 0.8 + icon * 1.5);
                    stkColor = max(max(line, points), hbCol);

                    if (globalX > 0.01 && globalX < (1.0 + bezelWidth - 0.01) && eUV.y > 0.38 && eUV.y < 0.92) {
                        float regionH = 0.54;
                        vec2 lUV = vec2((globalX - (1.0 + bezelWidth) * 0.5) * aspect / regionH, (eUV.y - 0.65) / regionH);
                        float ar = (1.0 + bezelWidth) * aspect / regionH;
                        lUV *= 1.1;
                        
                        float nLimit = 0.5 * STK_perlin(vec2(10.0 * lUV.y, 3.0 * iTime));
                        float distG = 0.2 * nLimit - 0.6 + sin(0.3 * iTime);
                        vec2 distUV = lUV; 
                        distUV.x += smoothstep(0.15, 0.0, abs(distG)) * nLimit;
                        
                        float s_val = STK_perlin(vec2(0.3 * iTime));
                        float s_curve = smoothstep(-0.5, -0.1, s_val);
                        vec2 p_idle = vec2(STK_perlin(vec2(0.3 * iTime + 7.0)), 0.5 * STK_perlin(vec2(-0.8 * iTime))) * 0.4;
                        p_idle.y -= 0.1 * sin(6.0 * p_idle.x + iTime);
                        vec2 p_hover = vec2((uHoverPos.x - (1.0 + bezelWidth) * 0.5) * aspect / regionH, (uHoverPos.y - 0.65) / regionH);
                        vec2 p_move = mix(p_idle, p_hover, uHoverActive);
                        float r_glow = 0.0;
                        float waveBase = 5.0 * distUV.x + iTime;
                        float focusScale = max(smoothstep(0.2, 0.0, abs(lUV.x - p_move.x)) * uHoverActive, smoothstep(0.2, 0.0, abs(lUV.y - p_move.y)) * uHoverActive);
                        for (float i = 1.0; i <= 6.0; i++) {
                            float f = distUV.y + 0.2 * sin(waveBase + s_curve * sin(i + iTime) * 1.25 * cos(waveBase + 0.5 * i));
                            r_glow += (0.003 + 0.004 * focusScale) / abs(f);
                        }
                        float ui = 1.5 * smoothstep(fwidth(lUV.x + lUV.y), -fwidth(lUV.x + lUV.y), abs(STK_square(lUV, 0.5 * vec2(0.85 * ar, 0.9))));
                        float cr = max(smoothstep(fwidth(lUV.x + lUV.y), 0.0, abs(min(abs(lUV.x - p_move.x), abs(lUV.y - p_move.y)))), 3.0 * smoothstep(fwidth(lUV.x + lUV.y), -fwidth(lUV.x + lUV.y), abs(STK_square(lUV - p_move, vec2((0.1 + smoothstep(-0.25, 0.5, s_val)) * 0.15)))));
                        ui = max(ui, cr * step(STK_square(lUV, 0.5 * vec2(0.85 * ar, 0.9)), 0.0));
                        float finalR = max(r_glow, 2.0 * ui);
                        finalR *= 0.5 + 0.5 * STK_hash12(vec2(globalX, eUV.y) * 1000.0 + iTime);
                        stkColor = max(stkColor, mix(vec3(finalR), vec3(pow(max(0.0, 1.0 - finalR), 3.0)), smoothstep(-0.025, 0.025, distG)) * 0.55);
                    }
                }
                
                // --- SECOND PHONE (Right half of secondary screen) ---
                
                // --- SECOND PHONE (Right half of secondary screen) ---
                if (isSecondaryMode && eUV.x >= 0.5) {
                    vec2 p = vec2((eUV.x - 0.5) * 2.0, eUV.y) * 2.0 - 1.0;
                    p.x *= 0.65;
                    
                    float dPhone = getPhoneDist(p);
                    float maskPhone = 1.0 - smoothstep(0.0, 0.005, dPhone);
                    
                    if (maskPhone > 0.01) {
                        vec2 sDim = vec2(0.40, 0.78) - vec2(0.025);
                        float dScr = sdRoundedBox(p, sDim, 0.05);
                        float mScr = 1.0 - smoothstep(0.0, 0.005, dScr);
                        float dNch = sdRoundedBox(p - vec2(0.0, sDim.y - 0.01), vec2(0.1, 0.025), 0.02);
                        float mNch = 1.0 - smoothstep(0.0, 0.005, dNch);

                        vec3 pCol = vec3(0.05); 
                        vec3 sCol = vec3(0.10, 0.11, 0.15); // Dark/Snap Theme base

                        if (mScr > 0.5 && mNch < 0.5) {
                            vec2 sUV = (p + sDim) / (sDim * 2.0);
                            
                            // SNAP SCROLLING Logic
                            float cycleDur = 5.0;
                            float snapDur = 0.8;
                            float phase = mod(iTime, cycleDur);
                            float snapProgress = smoothstep(cycleDur - snapDur, cycleDur, phase);
                            float scrollY = (floor(iTime / cycleDur) + snapProgress) * 0.25; 
                            float yPos = sUV.y + scrollY;
                            float row = floor(yPos / 0.25);
                            vec2 rUV = vec2(sUV.x, fract(yPos / 0.25));

                            if (rUV.x > 0.08 && rUV.x < 0.92 && rUV.y > 0.1 && rUV.y < 0.9) {
                                float rowH = hash21(vec2(row, 131.0));
                                sCol = mix(vec3(0.16, 0.17, 0.22), vec3(0.22, 0.22, 0.28), rowH);
                                float rowSin = 0.5 + 0.5 * sin(iTime + row);
                                float accent = smoothstep(0.05, 0.0, abs(rUV.x - 0.1));
                                sCol = mix(sCol, vec3(0.0, 0.9, 1.0), accent * rowSin);
                                float textM = step(0.4, hash21(floor(rUV * vec2(25.0, 12.0)) + row * 7.0));
                                if (rUV.x > 0.18 && rUV.x < 0.85 && rUV.y > 0.25 && rUV.y < 0.75) {
                                     sCol = mix(sCol, vec3(0.7, 0.7, 0.8), textM * 0.35);
                                }
                                float thumb = smoothstep(0.08, 0.07, length(rUV - vec2(0.2, 0.82)));
                                sCol = mix(sCol, vec3(0.0, 0.7, 0.9), thumb);
                            }
                            if (sUV.y > 0.93) sCol = vec3(0.06, 0.06, 0.09);
                        }
                        vec3 phUI = mix(pCol, sCol, mScr * (1.0 - mNch));
                        phUI = mix(phUI, vec3(0.02), mNch);
                        stkColor = mix(stkColor, phUI, maskPhone);
                    } else if (eUV.x > 0.5) {
                        stkColor = C_BG; 
                    }
                }
                
                gl_FragColor = vec4(max(C_BG, stkColor), 1.0);
                return;
            }
            // --- VERTICAL MONITOR: LIGHT PHONE ---
            vec2 p = paneUV * 2.0 - 1.0;
            p.x *= aspect * 0.45;

            float dPhone = getPhoneDist(p);
            float maskPhone = 1.0 - smoothstep(0.0, 0.01, dPhone);
            
            vec3 phoneBodyCol = vec3(1.0); // White Frame
            vec3 phoneScreenCol = vec3(0.95); // Light Theme base

            if (maskPhone > 0.01) {
                vec2 sDim = vec2(0.40, 0.78) - vec2(0.025);
                float dScr = sdRoundedBox(p, sDim, 0.05);
                float mScr = 1.0 - smoothstep(0.0, 0.005, dScr);
                float dNch = sdRoundedBox(p - vec2(0.0, sDim.y - 0.01), vec2(0.1, 0.025), 0.02);
                float mNch = 1.0 - smoothstep(0.0, 0.005, dNch);

                if (mScr > 0.5 && mNch < 0.5) {
                    vec2 sUV = (p + sDim) / (sDim * 2.0);
                    
                    // LIGHT THEME SCROLLING
                    float cycleDur = 2.0;
                    float scrollVal = floor(iTime / cycleDur) + smoothstep(1.5, 2.0, mod(iTime, cycleDur));
                    
                    // --- APP NOTIFICATION PING (Hover Card Selection) ---
                    // Map eUV hover position to phone screen space
                    // paneUV = eUV for vertical mode, then p = paneUV*2-1, sUV = (p+sDim)/(sDim*2)
                    float hoverPhoneY = -1.0; // off-screen default
                    if (uHoverActive > 0.5 && isVerticalMode) {
                        // Remap eUV.y -> paneUV.y -> p.y -> sUV.y
                        vec2 hP = (uHoverPos * 2.0 - 1.0);
                        hP.x *= aspect * 0.45;
                        hoverPhoneY = (hP.y + sDim.y) / (sDim.y * 2.0);
                    }
                    
                    if (sUV.y > 0.88) phoneScreenCol = (sUV.y > 0.96) ? vec3(0.98) : vec3(0.0, 0.48, 0.8);
                    else {
                        float sY = (0.88 - sUV.y) + scrollVal * 0.5;
                        float rId = floor(sY / 0.12);
                        vec2 rUV = vec2(sUV.x, fract(sY / 0.12));
                        phoneScreenCol = (rUV.x > 0.05 && rUV.x < 0.2 && abs(rUV.y - 0.5) < 0.3) ? vec3(0.8) : vec3(0.95);
                        if (rUV.x > 0.25 && rUV.x < 0.9) {
                            if (abs(rUV.y - 0.35) < 0.1) phoneScreenCol = vec3(0.2);
                            if (abs(rUV.y - 0.65) < 0.06 && rUV.x < 0.7) phoneScreenCol = vec3(0.6);
                        }
                        
                        // Notification Ping: highlight hovered row with a cyan selection glow
                        if (uHoverActive > 0.5 && isVerticalMode) {
                            float hoverSY = (0.88 - hoverPhoneY) + scrollVal * 0.5;
                            float hoveredRow = floor(hoverSY / 0.12);
                            
                            // Glow the matched card row
                            float rowMatch = smoothstep(1.5, 0.5, abs(rId - hoveredRow));
                            // Animated selection pulse
                            float ping = 0.5 + 0.5 * sin(iTime * 5.0);
                            // Left accent bar highlight
                            float selAccent = smoothstep(0.06, 0.04, abs(rUV.x - 0.13)) * rowMatch;
                            phoneScreenCol = mix(phoneScreenCol, vec3(0.0, 0.6, 1.0), selAccent * (0.7 + 0.3 * ping) * uHoverActive);
                            // Card edge glow
                            float edgeDist = min(min(rUV.x - 0.05, 0.95 - rUV.x), min(rUV.y - 0.05, 0.95 - rUV.y));
                            float edgeGlow = smoothstep(0.08, 0.0, edgeDist) * rowMatch * uHoverActive;
                            phoneScreenCol += vec3(0.0, 0.4, 0.8) * edgeGlow * 0.4;
                        }
                    }
                    
                    // --- TOUCH RIPPLE (Click Effect) ---
                    float timeSinceClick = iTime - uClickTime;
                    if (timeSinceClick > 0.0 && timeSinceClick < 1.2 && isVerticalMode) {
                        // Map click screen pos to phone sUV space
                        vec2 cP = (uClickPos * 2.0 - 1.0);
                        cP.x *= aspect * 0.45;
                        vec2 clickSUV = (cP + sDim) / (sDim * 2.0);
                        
                        // FIX: Correct for non-square sUV space.
                        // sUV.x encodes p.x which was stretched by (aspect * 0.45).
                        // Compensation factor undoes this so distance is visually circular.
                        float suvCorrection = sDim.x / (sDim.y * aspect * 0.45);
                        vec2 rippleDelta = sUV - clickSUV;
                        rippleDelta.x *= suvCorrection;
                        float rippleDist = length(rippleDelta);
                        
                        float rippleRadius = timeSinceClick * 0.45; // Speed in corrected space
                        float rippleFade = 1.0 - smoothstep(0.6, 1.2, timeSinceClick);
                        float rippleRing = smoothstep(0.018, 0.0, abs(rippleDist - rippleRadius)) * rippleFade;
                        
                        // Inner flash at t=0
                        float innerFlash = smoothstep(0.05, 0.0, rippleDist) * smoothstep(0.15, 0.0, timeSinceClick);
                        phoneScreenCol += vec3(0.5, 0.9, 1.0) * (rippleRing + innerFlash) * 0.7;
                    }
                }
                col = mix(phoneBodyCol, phoneScreenCol, mScr * (1.0 - mNch));
                col = mix(col, vec3(0.01), mNch);
            } else {
                col = C_BG;
            }
            // Apply mask and background color
            col *= maskPhone;
            col += C_BG * (1.0 - maskPhone);
        }
        
        vec2 vUV = uv * (1.0 - uv.yx);
        float vig = vUV.x * vUV.y * 15.0; 
        vig = pow(vig, 0.15);
        gl_FragColor = vec4(col * vig, 1.0);
    }
`;