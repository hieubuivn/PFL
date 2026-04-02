import*as e from"three";import{AdditiveBlending as t,Box2 as n,BufferGeometry as r,Color as i,FramebufferTexture as a,InterleavedBuffer as o,InterleavedBufferAttribute as s,Mesh as c,MeshBasicMaterial as l,RawShaderMaterial as u,ShaderMaterial as d,UniformsUtils as f,UnsignedByteType as p,Vector2 as m,Vector3 as h,Vector4 as g,WebGLRenderTarget as _}from"three";import"three/addons/libs/stats.module.js";import v from"tween";import*as y from"rapier-compat";import b from"rapier-compat";import{GLTFLoader as x}from"three/addons/loaders/GLTFLoader.js";import{RGBELoader as S}from"three/addons/loaders/RGBELoader.js";import{DRACOLoader as C}from"three/addons/loaders/DRACOLoader.js";import{KTX2Loader as w}from"three/addons/loaders/KTX2Loader.js";import{OrbitControls as T}from"three/addons/controls/OrbitControls.js";import{EffectComposer as E}from"three/addons/postprocessing/EffectComposer.js";import{RenderPass as D}from"three/addons/postprocessing/RenderPass.js";import*as O from"three/addons/utils/SkeletonUtils.js";import{FullScreenQuad as k,Pass as A}from"three/addons/postprocessing/Pass.js";import{CopyShader as ee}from"three/addons/shaders/CopyShader.js";import{LuminosityHighPassShader as te}from"three/addons/shaders/LuminosityHighPassShader.js";var j=Object.defineProperty,M=(e,t)=>()=>(e&&(t=e(e=0)),t),ne=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),N=(e,t)=>{let n={};for(var r in e)j(n,r,{get:e[r],enumerable:!0});return t||j(n,Symbol.toStringTag,{value:`Module`}),n};(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var re,ie=M((()=>{re=class{constructor(){this.bootStartTime=performance.now(),window.bootStartTime=this.bootStartTime,this.canvas=document.createElement(`canvas`),this.canvas.id=`boot-canvas`,Object.assign(this.canvas.style,{position:`fixed`,top:`0`,left:`0`,width:`100%`,height:`100%`,zIndex:`99999`,background:`black`,transition:`opacity 0.5s ease-out`}),document.body.appendChild(this.canvas),this.isFinished=!1,this.lastProgress=0,this.targetProgress=0;let e=!!this.canvas.transferControlToOffscreen,t=window.devicePixelRatio||1,n=window.innerWidth*t,r=window.innerHeight*t;e?(this.canvas.width=n,this.canvas.height=r,this.offscreen=this.canvas.transferControlToOffscreen(),this.worker=new Worker(new URL(`/PFL/assets/bootWorker-CPPf1WuN.js`,``+import.meta.url),{type:`module`}),this.worker.postMessage({type:`INIT`,payload:{canvas:this.offscreen,width:n,height:r}},[this.offscreen]),this.useWorker=!0):this.initMainThreadRenderer(),this.onMouseMove=this.onMouseMove.bind(this),this.onResize=this.onResize.bind(this),window.addEventListener(`resize`,this.onResize),window.addEventListener(`mousemove`,this.onMouseMove),this.updateLoop=this.updateLoop.bind(this),requestAnimationFrame(this.updateLoop)}initMainThreadRenderer(){this.renderer=new e.WebGLRenderer({canvas:this.canvas,antialias:!0}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.scene=new e.Scene,this.camera=new e.OrthographicCamera(-1,1,1,-1,0,1),this.useWorker=!1}onMouseMove(e){let t=e.clientX/window.innerWidth,n=1-e.clientY/window.innerHeight;this.useWorker&&this.worker.postMessage({type:`MOUSE`,payload:{x:t,y:n}})}onResize(){let e=window.devicePixelRatio||1,t=window.innerWidth*e,n=window.innerHeight*e;this.useWorker?this.worker.postMessage({type:`RESIZE`,payload:{width:t,height:n}}):this.renderer&&this.renderer.setSize(window.innerWidth,window.innerHeight)}updateProgress(e){this.targetProgress=e}updateLoop(){if(this.isFinished)return;requestAnimationFrame(this.updateLoop);let e=.12;this.pendingFinish&&(e=.25);let t=this.targetProgress-this.lastProgress;Math.abs(t)<.001?this.lastProgress=this.targetProgress:this.lastProgress+=t*e,this.useWorker&&this.worker.postMessage({type:`UPDATE_PROGRESS`,payload:this.lastProgress});let n=document.querySelector(`#progress-text .progress-value`);n&&(n.innerText=`${Math.floor(this.lastProgress*100)}%`),this.pendingFinish&&this.lastProgress>.998&&this.executeExit()}finish(){return this.isFinished?Promise.resolve():this.pendingFinish?this.finishPromise:(this.pendingFinish=!0,this.targetProgress=1,this.finishPromise=new Promise(e=>{this.resolveFinish=e}),this.finishPromise)}executeExit(){if(this.isFinished)return;this.isFinished=!0,this.resolveFinish&&this.resolveFinish();let e=document.getElementById(`app-container`);e&&(e.style.display=`flex`,e.style.visibility=`visible`,e.style.opacity=`1`),this.canvas.style.opacity=`0`,setTimeout(()=>this.dispose(),1500)}dispose(){window.removeEventListener(`resize`,this.onResize),window.removeEventListener(`mousemove`,this.onMouseMove),this.worker&&this.worker.terminate(),this.canvas.remove()}}})),ae=ne((()=>{ie(),window.bootLoader=new re}));function oe(e=1,t=1,n=document){let r=n===document?document.getElementById(`board`):n.querySelector(`#board`),i=n.querySelector(`.intro-main-name1`),a=n.querySelector(`.intro-main-name2`),o=n.querySelector(`.intro-sub`),s=n.querySelector(`.board-philo-sub`),c=n.querySelector(`.board-philo-main`),l=n.getElementById?n.getElementById(`board-feat-1`):n.querySelector(`#board-feat-1`),u=n.getElementById?n.getElementById(`board-feat-2`):n.querySelector(`#board-feat-2`);if(!r||!i||!a||!o)return;let d=r.clientWidth;if(d<=1)return;t=Math.max(0,Math.min(1,t===void 0?window.__boardSubProgress??1:t));let f=4.2*e;r.style.gap=f+`vh`;let p=getComputedStyle(i).fontFamily,m=P(`BUI QUOC`,`20px ${p}`),h=P(`VISION BECOMES`,`20px ${p}`),g=20*(d/Math.max(10,h+(m-h)*t))*e,_=P(i.innerText,`${g}px ${p}`);_>d&&_>.01&&(g*=d/_),i.style.fontSize=g+`px`,a.style.fontSize=g+`px`;let v=n.getElementById?n.getElementById(`board-intro`):n.querySelector(`#board-intro`);if(t<=0?(o.style.display=`none`,o.style.fontSize=`0px`,o.style.lineHeight=`0`,v&&(v.style.gap=`0vh`)):(o.style.display=`block`,o.style.fontSize=g*.3*t+`px`,o.style.lineHeight=t,v&&(v.style.gap=.75*t+`vh`)),c){let i=getComputedStyle(c).fontFamily,a=P(`PI-SHAPED ENGINEERING & STRATEGY`,`20px ${i}`),o=P(`ALIGNED THROUGH ENGINEERING`,`20px ${i}`),f=20*(d/Math.max(10,o+(a-o)*t))*e,p=P(c.innerText,`${f}px ${i}`);p>d&&p>.01&&(f*=d/p),c.style.fontSize=f+`px`;let m=n.getElementById?n.getElementById(`board-philo`):n.querySelector(`#board-philo`);if(s){if(t<=0)s.style.display=`none`,s.style.fontSize=`0px`,s.style.lineHeight=`0`,m&&(m.style.gap=`0vh`);else{s.style.display=`block`;let e=f*.8*t;s.style.fontSize=e+`px`,s.style.lineHeight=t,m&&(m.style.gap=.75*t+`vh`)}let e=n.getElementById?n.getElementById(`board-feat`):n.querySelector(`#board-feat`),i=f*.48,a=getComputedStyle(l||r).fontFamily;if(e&&e.style.setProperty(`--feat-border-scale`,t),u&&(t<=0?(u.style.display=`none`,u.style.fontSize=`0px`,u.style.lineHeight=`0`,e&&(e.style.gap=`0vh`)):(u.style.display=`block`,u.style.fontSize=i*t+`px`,u.style.lineHeight=t,e&&(e.style.gap=.5*t+`vh`))),l){l.style.paddingTop=2.75*t+`vh`;let e=P(`3+ YEARS • INTERACTIVE UX • AR/VR/3D`,`20px ${a}`),n=P(`π-shaped lead.Strategy in motion.`,`20px ${a}`),r=Math.max(10,n+(e-n)*t),o=d/r*20,s=i/o*o;s=i;let c=P(l.innerText,`${s}px ${a}`);c>d&&c>.01&&(s*=d/c),l.style.fontSize=s+`px`;let f=33+3*t,p=(d-s/20*r)/(f-1),m=s*.25,h=Math.max(0,Math.min(m,p));l.style.letterSpacing=h+`px`,u&&t>0&&(u.style.letterSpacing=h+`px`)}}}}function se(){let e=document.getElementById(`board`);e&&(window.fitBoardTexts=oe,new ResizeObserver(()=>{let e=window.__boardScale||1,t=window.__boardSubProgress??1;requestAnimationFrame(()=>oe(e,t))}).observe(e),document.fonts&&document.fonts.ready.then(()=>{let e=window.__boardScale||1,t=window.__boardSubProgress??1;requestAnimationFrame(()=>oe(e,t))}),oe(window.__boardScale||1,window.__boardSubProgress??1))}var ce,P,le=M((()=>{ce={chaos:{bottom:12,top:0,scale:1,subVisible:!0,philoSubVisible:!0,mode:`mode-chaos`},root:{bottom:0,top:12,scale:.8,subVisible:!1,philoSubVisible:!1,mode:`mode-root`},dance:{bottom:0,top:16,scale:.8,subVisible:!1,philoSubVisible:!1,mode:`mode-dance`},walk:{bottom:12,top:0,scale:.8,subVisible:!1,philoSubVisible:!1,mode:`mode-walk`}},P=(e,t)=>(P.canvas||(P.canvas=document.createElement(`canvas`),P.context=P.canvas.getContext(`2d`)),P.context.font=t,P.context.measureText(e).width)})),ue=ne((()=>{le(),se()}));ae(),ue(),document.getElementById(`cv-container`);var de=document.getElementById(`experience-container`),fe=null,pe=null,me=new ResizeObserver(e=>{for(let t of e)fe=t;pe||=requestAnimationFrame(()=>{pe=null,fe&&!he&&(window.dispatchEvent(new Event(`resize`)),fe=null)})});de&&me.observe(de);var he=!1,ge=null;window.addEventListener(`cvToggle`,()=>{he=!0,ge&&clearTimeout(ge),ge=setTimeout(()=>{he=!1,window.dispatchEvent(new Event(`resize`))},850)});var _e=ne((()=>{document.addEventListener(`DOMContentLoaded`,()=>{t(),n(),e()});function e(){let e=document.getElementById(`cv-scroller`),t=document.getElementById(`cv-container`);if(!e||!t)return;let n=document.createElement(`div`);n.className=`cv-scroll-top-floater`,n.setAttribute(`aria-label`,`Scroll to Top`),n.innerHTML=`
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    `,t.appendChild(n),e.addEventListener(`scroll`,()=>{e.scrollTop>400?n.classList.add(`visible`):n.classList.remove(`visible`)},{passive:!0}),n.addEventListener(`click`,()=>{e.scrollTo({top:0,behavior:`smooth`}),n.classList.remove(`visible`)})}function t(){document.querySelectorAll(`.collapsible-header`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.closest(`.summary-header-wrapper`),n=t?t.nextElementSibling:e.nextElementSibling;n&&(e.classList.toggle(`collapsed`),n.classList.toggle(`collapsed`))})})}function n(){document.querySelectorAll(`.role-block`).forEach(e=>{e.dataset.roleBound||(e.dataset.roleBound=`true`,e.addEventListener(`click`,t=>{if(t.target.tagName===`A`||t.target.closest(`a`))return;t.stopPropagation();let n=e.classList.toggle(`collapsed`),r=e.querySelector(`.hint-text`);r&&(r.textContent=n?`CLICK TO EXPAND`:`CLICK TO COLLAPSE`)}))})}})),ve,F,ye,be,I,xe,Se,Ce,we,Te=M((()=>{ve={ROOT:`root`,CHAR:`a-char`,ROOT_DEV:`rootDev`},F={POBA:`poba`,DEV:`dev`},ye=F.POBA,be=`1.0.0`,I={ELECTRIC_CYAN:new e.Color(0,.95,1),ACCENT_GOLD:new e.Color(`#DCD0BA`),CRIMSON_RED:new e.Color(`#FF003C`),INACTIVE_GRAY:new e.Color(.05,.05,.05)},xe=[{name:`points`,renderer:`composer`,pixelRatioScale:1,toneMappingExposure:4,ui:{cursorInformer:!1,subtitle:!1,personaButton3D:!1},environment:{cssBackground:null,sceneBackground:null},hudUniforms:{uOutsideColor:new e.Color(0,0,0),uFlowerColor:new e.Color(0,.92,1),uGridThickness:1,uBNotchBarAlpha:0}},{name:`room`,renderer:`standard`,pixelRatioScale:.625,toneMappingExposure:.4,ui:{cursorInformer:!0,subtitle:!0,personaButton3D:!0},environment:{cssBackground:`black`},hudUniforms:{uOutsideColor:new e.Color(`#2b2b2b`),uFlowerColor:new e.Color(1,1,1),uGridThickness:2,uBNotchBarAlpha:0}}],Se={thresholdUp:56,thresholdSoftDown:50,thresholdHardDown:40,waitDuration:3,elapsedGoodTime:0,settleTimer:0,update(e,t,n){if(!t||!n||e<=0)return!1;let r=window.devicePixelRatio||1,i=t.getPixelRatio(),a=1/e;if(window.scene&&window.scene.isTransitioning)return this.lastStep=-1,!1;let o=window.scene?window.scene.pointsApp:null,s=o&&typeof o.getCurrentStep==`function`?o.getCurrentStep():-1,c=s===0||s===1||s===2,l=s>=3||n.name===`room`;if(this.lastStateName!==n.name||this.lastStep!==s){this.lastStateName=n.name,this.lastStep=s,this.elapsedGoodTime=0,this.settleTimer=1;let e=n.pixelRatioScale||1,a=c?r:r*e;return i===a?!1:(t.setPixelRatio(a),!0)}if(this.settleTimer>0)return this.settleTimer-=e,!1;let u=r*(n.pixelRatioScale||1);if(c){if(a<30){if(i>1.01)return t.setPixelRatio(1),!0}else if(a>45&&i<r-.01&&(this.elapsedGoodTime+=e,this.elapsedGoodTime>2))return t.setPixelRatio(Math.min(r,i+.1)),this.elapsedGoodTime=0,!0}else if(l){let n=window.scene&&window.scene.fpsStats?window.scene.fpsStats.avg:a;if(a<40){if(i>u+.01)return t.setPixelRatio(u),this.elapsedGoodTime=0,!0}else if(a<50){if(i>u+.1)return t.setPixelRatio(Math.max(u,i-.1)),this.elapsedGoodTime=0,!0}else if(n>56){if(this.elapsedGoodTime+=e,this.elapsedGoodTime>=5&&i<u-.01)return t.setPixelRatio(Math.min(u,i+.05)),this.elapsedGoodTime=0,!0}else this.elapsedGoodTime=0}return!1}},Ce=(e=.5)=>{if(!window.scene||!window.scene.renderer)return;let t=window.scene.renderer.getPixelRatio()+e;window.scene.renderer.setPixelRatio(t)},we=(e=.5)=>{if(!window.scene||!window.scene.renderer)return;let t=window.scene.renderer.getPixelRatio(),n=Math.max(.1,t-e);window.scene.renderer.setPixelRatio(n)},typeof window<`u`&&(window.dprI=Ce,window.dprD=we)})),Ee,De=M((()=>{Te(),Ee={poba:{id:`PROTOCOL: BA_PO_2026`,systemTitle:`SR. PO / ITBA`,role:`SENIOR TECHNICAL PRODUCT OWNER & BUSINESS ANALYST`,summary:`Pi-shaped Technical Product Specialist with 10+ years of experience executing roadmaps across Fintech, DePIN (IoT & Web3), and EV mobility. I serve as a Technical Product Partner, bridging the gap between abstract business strategy and deep engineering reality. By integrating UX Design with functional prototyping, I validate complex product logic ensuring requirements are architecturally sound and user-optimized.`,summaryTags:[{key:`Roles`,val:[`PO`,`BA`],comment:`// Adaptive Shift`},{key:`Experience`,val:`+10 Years Professional Journey`},{key:`Expertises`,val:[`Fintech`,`IoT`,`EV_Mobility`]},{key:`π_Edge`,val:`Engineering_Fluent_UX`},{key:`Methods`,val:[`Gherkin_AC`,`RICE`,`MoSCoW`]},{key:`Validations`,val:[`JS`,`WebGL`,`Python`]},{key:`Workflows`,val:[`n8n`,`AI`,`Workflows`]}],experience:[{company:`Arkreen Network`,companyDesc:`A decentralized energy network (DePIN) leveraging Digital Twin technology for green energy assets.`,title:`Technical Product Consultant (Independent)`,date:`May 2025 – Present`,points:[`<strong>Strategic Prototyping:</strong> Co-developed high-fidelity interactive 3D dashboards (WebGL) to visualize real-time IoT data for investor pitching and stakeholder buy-in.`,`<strong>Technical De-risking:</strong> Validated requirement scalability using GLSL/Shaders to ensure architectural feasibility for complex 3D environments.`,`<strong>Productivity Automation:</strong> Deployed automated product management workflows using <strong>n8n and AI</strong>, reducing manual project overhead by an estimated <strong>40%</strong>.`]},{company:`VinFast - Vingroup`,companyDesc:`Vietnam's global EV manufacturer building an integrated digital mobility ecosystem.`,title:`Senior ITBA / Product Owner (IoT & Smart Systems)`,date:`Oct 2021 – May 2025`,points:[`<strong>Digital Transformation (VCA & Reliability Audit):</strong> Digitized manual quality control workflows, improving <strong>Mean Time to Detect (MTTD) by 25%</strong> through real-time telemetry and automated alerting.`,`<strong>Factory QA Requirements (SSOT):</strong> Established a <strong>Single Source of Truth (SSOT)</strong>, aligning <strong>10,000+ employees</strong> for cloud tracking.`,`<strong>Factory Executive Reporting & Training (FERT):</strong> Digitized certification for <strong>10,000+ personnel</strong>, achieving <strong>100% paperwork reduction</strong> with real-time dashboards.`,`<strong>B2B Energy Management System (EMS):</strong> Served as Product Owner for the complete B2B IoT telemetry platform for energy hardware. Designed the admin portal's UX for remote monitoring.`,`<strong>Loyalty & Rewards System:</strong> Contributed as a key team member and Business Analyst, helping unify disjointed customer data into an interoperable omnichannel user experience.`]},{company:`Gapo Social Network`,companyDesc:`A Vietnamese social platform focusing on community engagement and core social features.`,title:`Senior IT Business Analyst`,date:`Oct 2019 – Apr 2021`,points:[`<strong>Data-Driven Retention:</strong> Utilized <strong>RICE scoring</strong> to prioritize technically feasible fixes for user drop-off issues identified via Firebase, boosting retention.`,`<strong>Quality Assurance:</strong> Led the UAT process personally, reducing post-launch bugs through <strong>Gherkin-style</strong> detailed Acceptance Criteria (AC).`,`Mentored junior BA team members on requirement engineering and prioritization standards.`]},{company:`Five9 Vietnam`,companyDesc:`Fintech startup building the 'Mony' P2P lending platform for SE Asia market.`,title:`BA Team Lead / Product Owner`,date:`May 2018 – Oct 2019`,points:[`<strong>Product Ownership:</strong> Managed the "Mony" P2P platform from concept to launch; used <strong>MoSCoW</strong> to define MVP scope and manage stakeholder requests.`,`Designed real-time dashboards for operational risk assessment and faster decision cycles.`,`Led technical integrations with VNPay and Bao Kim payment gateways.`]},{company:`Centech Interactive`,companyDesc:`A technology agency specializing in mobile VAS and digital content services.`,title:`IT Business Analyst`,date:`Nov 2016 – Apr 2018`,points:[`Managed project backlogs and prioritized deliverables using <strong>MoSCoW</strong> to meet aggressive agency timelines.`,`Elicited and documented business requirements for various Mobile VAS and Digital Content projects.`]},{company:`ECPay (EVN)`,companyDesc:`Electricity payment gateway under Vietnam Electricity (EVN).`,title:`IT Business Analyst`,date:`Jun 2015 – Oct 2016`,points:[`Supported the dev of the e-wallet system; applied <strong>MoSCoW</strong> to manage feature rollouts for power consumers.`,`Analyzed transaction data to improve system performance and user experience.`]},{company:`Bao Kim (VNP Group)`,companyDesc:`One of Vietnam's pioneering e-payment gateways.`,title:`Business Analyst`,date:`Aug 2014 – May 2015`,points:[`Collaborated with the Dev team for early-stage fintech releases using structured prioritization techniques.`,`Conducted market research and gathered user requirements for new payment features and partner integrations.`]}],skills:[{category:`PI-SHAPED`,val:`UX Design + Tech Validation`,id:`01`,starIndices:[5,6]},{category:`VALIDATION`,val:`JS/ES6+, WebGL, Python`,id:`02`,starIndices:[0]},{category:`EXECUTION`,val:`Jira, Figma, SQL, n8n`,id:`03`,starIndices:[1,2]},{category:`LOGIC`,val:`Gherkin AC, RICE, MoSCoW`,id:`04`,starIndices:[3,4]}],contacts:[{id:`gmail`,label:`Gmail`,platform:`Inbox`,url:`hieubui.fsb@gmail.com`,isMail:!0},{id:`linkedin`,label:`LinkedIn`,platform:`Profile`,url:`https://www.linkedin.com/in/buiquochieu/`},{id:`phone`,label:`Phone`,platform:`Direct`,url:`tel:0965292489`}]},dev:{id:`PROTOCOL: CREATIVE_DEV_2026`,systemTitle:`INTERACTIVE DEV`,role:`CREATIVE DEVELOPER & SHADER ENGINEER (GLSL/3D)`,summary:`Creative Developer with a focus on immersive 3D experiences and high-performance WebGL/Three.js applications. I bridge the gap between complex mathematical concepts (GLSL) and intuitive user interfaces. With 10 years of background in technical product management, I bring a unique "business-aware" engineering mindset to creative projects—ensuring that high-end visuals are performant, maintainable, and aligned with user goals.`,summaryTags:[{key:`Specialization`,val:`+3 Years Creative Dev Focus`},{key:`Foundation`,val:`+10 Years Technical Strategy`},{key:`Tech_Cores`,val:[`Threejs`,`GLSL`,`AR/VR`]},{key:`Design`,val:`UX_UI_Specialist`},{key:`Method`,val:`Technical_Prototyping`},{key:`Goal`,val:`Performant_Visuals`}],experience:[],skills:[{category:`3D_CORE`,val:`Three.js, WebGL, GLSL (Shaders)`,id:`01`,starIndices:[5,6]},{category:`LOGIC`,val:`JavaScript (ES6+), GSAP, Mathematics`,id:`02`,starIndices:[3,4]},{category:`UI/UX`,val:`Figma-to-Code, Motion Design, Responsive 3D`,id:`03`,starIndices:[1,2]},{category:`PERF`,val:`Performance Profiling, GPU Debugging, Web Vitals`,id:`04`,starIndices:[0]}],contacts:[{id:`gmail`,label:`Gmail`,platform:`Inbox`,url:`hieubui.fsb@gmail.com`,isMail:!0},{id:`linkedin`,label:`LinkedIn`,platform:`Profile`,url:`https://www.linkedin.com/in/buiquochieu/`},{id:`phone`,label:`Phone`,platform:`Direct`,url:`tel:0965292489`}]}},Ee.dev.experience=Ee.poba.experience})),L,Oe=M((()=>{L={SYS_INIT:{en:[`Awakening Synthetic Core...`,`Establishing Neural Handshake...`,`Loading Cognitive Architecture...`,`Initializing Quantum Logic...`]},SYS_INITIALIZING_SYSTEM:{en:[`SYNTHESIZING SYSTEM INTEGRITY...`,`EXECUTING COGNITIVE BOOT...`,`UPLOADING NEURAL MANIFEST...`,`STABILIZING ARTIFICIAL CONTEXT...`]},SYS_POINTS_INIT:{en:[`MAPPING VOXEL CLUSTERS...`,`RENDERING QUANTUM FRAGMENTS...`,`SYNCHRONIZING POINT-CLOUD DENSITY...`,`SOLVING SPATIAL NEBULAS...`]},SYS_MODEL_ASSEMBLY:{en:[`MATERIALIZING VOLUMETRIC MESHES...`,`ASSEMBLING DIGITAL ARCHITECTURE...`,`RECONSTRUCTING SECTOR GEOMETRY...`,`SYNCING HOLOGRAPHIC ASSETS...`]},SYS_PHYSICS_BINDING:{en:[`ENFORCING KINETIC CONSTRAINTS...`,`BAKING SPATIAL CAUSALITY...`,`WEAVING GRAVITATIONAL FABRIC...`,`LOCKING COLLISION MATRICES...`]},SYS_TEXTURE_LOAD:{en:[`DECODING VISUAL BUFFERS...`,`STREAMS INITIATED: BITMAP DATA...`,`HYDRATING PIXEL ARRAYS...`,`REFINING SHADER DIFFUSION...`]},SYS_ERROR:{en:[`NEURAL BREACH DETECTED`,`SYNAPTIC COLLAPSE`,`LOGIC LOOP TERMINATED`,`CORE INTEGRITY VOID`]},SYS_INIT_SCENE:{en:[`CONSTRUCTING PERCEPTIVE PLANE...`,`SYNTHESIZING ENVIRONMENT...`,`STABILIZING VIRTUAL GRID...`,`ALIGNING RENDER CONTEXT...`]},SYS_FINALIZE:{en:[`SEALING COGNITIVE LOOPS...`,`FINALIZING NEURAL SYNC...`,`BOOTSTRAPPING CONSCIOUSNESS...`,`EXECUTING HANDSHAKE...`]},SYS_RETRIEVING_ASSETS:{en:[`HARVESTING REMOTE DATA NODES...`,`DOWNLOADING CORE MANIFESTS...`,`PULLING SECTOR BINARIES...`,`RETRIEVING ENCRYPTED ASSETS...`]},SYS_HEAVY_SHADERS:{en:[`GPU OVERLOAD: OPTIMIZING SHADER PIPELINES...`,`COMPILING NEURAL GLSL...`,`THROTTLING PIXEL DENSITY...`,`RECLAIMING MEMORY BUFFERS...`]},SYS_PHYSICS_CALC:{en:[`SOLVING SPATIAL PARADOXES...`,`CALCULATING KINETIC VECTORS...`,`STABILIZING GRAVITY VORTEX...`,`POLLING COLLISION SENSORS...`]},SYS_MAPPING_BOUNDARIES:{en:[`DEFINING SPATIAL PERIMETERS...`,`MAPPING KINETIC LIMITS...`,`LOCKING PERIMETER LOGIC...`,`TRACING COLLISION VOLUMES...`]},SYS_CHAR_COLLISION:{en:[`ALIGNING NEURAL AVATAR...`,`SYNCHRONIZING BONE VECTORS...`,`CALIBRATING KINEMATIC ANCHOR...`,`STABILIZING SKELETAL RIG...`]},SYS_BINDING_ARMATURES:{en:[`WIRING NEURAL ARMATURES...`,`LINKING JOINT CONSTRAINTS...`,`VALIDATING KINETIC WEIGHTS...`,`SECURING BONE HIERARCHY...`]},SYS_ANCHORING_ROTORS:{en:[`STABILIZING CYCLICAL LOGIC...`,`ANCHORING ROTATIONAL VECTORS...`,`FLUX CAPACITANCE NOMINAL...`,`SYNCHRONIZING FAN CYCLES...`]},SYS_DYNAMIC_RIGIDBODIES:{en:[`SOLVING ENTROPY ALIGNMENT...`,`CALCULATING KINETIC CHAOS...`,`POLLING DYNAMIC BUFFERS...`,`STABILIZING PHYSICS ENTROPY...`]},SYS_BONE_HIERARCHIES:{en:[`RECURSING SKELETAL NODES...`,`VALIDATING JOINT PARENTING...`,`TRACING BONE TOPOLOGY...`,`SCANNING VERTEBRAL DATA...`]},SYS_COLLISION_MESHES:{en:[`REGISTERING SPATIAL GEOMETRY...`,`COMMITTING PHYSICS HULLS...`,`SEALING COLLISION VOLUMES...`,`WRAPPING KINETIC SHELLS...`]},SYS_CALIBRATING_POINTS:{en:[`ALIGNING QUANTUM PARTICLES...`,`SOLVING NEURAL NEBULAS...`,`INTERPRETING DATA CLUSTERS...`,`CALIBRATING VOXEL VECTORS...`]},SYS_INIT_MODELS:{en:[`MATERIALIZING SECTOR DATA...`,`ASSEMBLING CRYSTALLINE ASSETS...`,`SYNTHESIZING MESH BUFFERS...`,`UPLOADING VOLUMETRIC MATRICES...`]},SYS_WARMING_ENGINES:{en:[`PRIMING SYNAPTIC PIPELINES...`,`SYNCHRONIZING GPU THREADS...`,`EXECUTING NEURAL BOOT...`,`WARMING QUANTUM SHADERS...`]},SYS_FAILURE:{en:[`CRITICAL SYSTEM BREACH`,`CORE LOGIC CORRUPTION`,`SYNAPTIC FAILURE`,`DATA VOID DETECTED`]},SYS_CONFIG_MATERIALS:{en:[`OPTIMIZING PIXEL SHADERS...`,`REFINING LIGHT-FIELD DATA...`,`POLISHING SURFACE LOGIC...`,`CONFIGURING GPU MATRICES...`]},SYS_READY:{en:[`SYSTEM NOMINAL.`,`NEURAL SYNC COMPLETE.`,`GRID LINK ESTABLISHED.`,`STANDING BY FOR INPUT...`]},NARR_STEP_0_PREFIX_DEV:{en:[`HELLO, I AM`]},NARR_STEP_0_HEADER_DEV:{en:[`BUI QUOC
HIEU`]},NARR_STEP_0_VERB_DEV:{en:[`PI-SHAPED ENGINEERING & STRATEGY`]},NARR_STEP_0_OUTCOME_DEV:{en:[`WHERE LOGIC MEETS DECISION.`]},NARR_STEP_0_CREDIBILITY_DEV:{en:[`3+ YEARS • INTERACTIVE UX • AR/VR/3D 
10+ YEARS • PRODUCT STRATEGY`]},NARR_STEP_0_PREFIX_POBA:{en:[`HELLO, I AM`]},NARR_STEP_0_HEADER_POBA:{en:[`BUI QUOC
HIEU`]},NARR_STEP_0_VERB_POBA:{en:[`PI-SHAPED STRATEGY & ENGINEERING`]},NARR_STEP_0_OUTCOME_POBA:{en:[`WHERE STRATEGY MEETS EXECUTION.`]},NARR_STEP_0_CREDIBILITY_POBA:{en:[`10+ YEARS • PRODUCT STRATEGY 
3+ YEARS • INTERACTIVE UX • AR/VR/3D`]},BOARD_STEP_0_NAME1_DEV:{en:[`BUI QUOC`]},BOARD_STEP_0_NAME2_DEV:{en:[`HIEU`]},BOARD_STEP_0_NAME1_POBA:{en:[`BUI QUOC`]},BOARD_STEP_0_NAME2_POBA:{en:[`HIEU`]},BOARD_STEP_1_NAME1_DEV:{en:[`CODE BECOMES`]},BOARD_STEP_1_NAME2_DEV:{en:[`EXPERIENCE`]},BOARD_STEP_1_NAME1_POBA:{en:[`VISION BECOMES`]},BOARD_STEP_1_NAME2_POBA:{en:[`DELIVERY`]},BOARD_STEP_2_NAME1_DEV:{en:[`INTERACTIVE`]},BOARD_STEP_2_NAME2_DEV:{en:[`PULSE`]},BOARD_STEP_2_NAME1_POBA:{en:[`ZERO`]},BOARD_STEP_2_NAME2_POBA:{en:[`FRICTION`]},BOARD_STEP_3_NAME1_DEV:{en:[`READY TO`]},BOARD_STEP_3_NAME2_DEV:{en:[`BUILD`]},BOARD_STEP_3_NAME1_POBA:{en:[`READY TO`]},BOARD_STEP_3_NAME2_POBA:{en:[`LEAD`]},NARR_STEP_1_HEADER_DEV:{en:[`CODE BECOMES
EXPERIENCE`]},NARR_STEP_1_SUBTITLE_DEV:{en:[`SCULPTED THROUGH SYSTEMS`]},NARR_STEP_1_DESC_DEV:{en:[`π-SHAPED MIND. ENGINEERING DEPTH.`]},NARR_STEP_1_HEADER_POBA:{en:[`VISION BECOMES
DELIVERY`]},NARR_STEP_1_SUBTITLE_POBA:{en:[`ALIGNED THROUGH ENGINEERING`]},NARR_STEP_1_DESC_POBA:{en:[`π-SHAPED LEAD. STRATEGY IN MOTION.`]},NARR_STEP_2_HEADER_DEV:{en:[`INTERACTIVE PULSE`]},NARR_STEP_2_SUBTITLE_DEV:{en:[`SYSTEMS FELT THROUGH INTERACTION`]},NARR_STEP_2_DESC_DEV:{en:[`THOUSANDS OF SIGNALS MOVING AS ONE EXPERIENCE.`]},NARR_STEP_2_HEADER_POBA:{en:[`ZERO FRICTION`]},NARR_STEP_2_SUBTITLE_POBA:{en:[`DECISIONS SHAPING FORWARD MOTION`]},NARR_STEP_2_DESC_POBA:{en:[`ALIGNMENT TURNING COMPLEXITY INTO FLOW.`]},NARR_STEP_3_HEADER_DEV:{en:[`READY TO BUILD`]},NARR_STEP_3_SUBTITLE_DEV:{en:[`WELCOME TO MY INTERACTIVE LABORATORY.`]},NARR_STEP_3_DESC_DEV:{en:[``]},NARR_STEP_3_HEADER_POBA:{en:[`READY TO LEAD`]},NARR_STEP_3_SUBTITLE_POBA:{en:[`LET'S SHAPE YOUR NEXT PRODUCT TOGETHER.`]},NARR_STEP_3_DESC_POBA:{en:[``]},SYS_PILOT_ENTRY_WAIT:{en:[`Waiting for Pilot Entry...`,`Unauthorized Access Detected. Awaiting Protocol...`,`System Primed. Awaiting User Confirmation...`,`Neural Link Ready. Enter when stable.`]},SYS_BUILD_START:{en:[`Pilot entered. Starting Build Sequence...`,`Authentication logic verified. Assembling Sector...`,`Neural handshake complete. Materializing Environment...`,`Protocol Omega initiated. Constructing Reality...`]},SYS_PHYSICS_INIT:{en:[`Engaging Physics Engine...`,`Calculating Collision Matrices...`,`Stabilizing Gravity Well...`,`Activating Real-time Simulators...`]},SYS_DRONE_START:{en:[`Deploying Recon Drone...`,`Launching Sentinel Alpha...`,`Initiating Aerial Surveillance...`,`Drone Online. Scanning Sector...`]},SYS_DRONE_SUBTITLES_DEV:{en:[`Me: 'The shader should be simple.'
Also me: staring at 200 lines of GLSL. 🧠`,`Me: Finally getting the lighting right.
Now I'm afraid to touch the shader again. 😬`,`Me: 'The math is correct.'
The rendered object politely disagrees. 🧊`,`Me: Debugging a shader.
Everything is temporarily bright pink. 🎨`,`Me: Optimizing the scene for 60 FPS.
The GPU negotiates back. 🎮`,`Me: Adjusting one small value in the shader.
The entire universe changes color. 🌈`,`Me: 'This transformation should be straightforward.'
The camera disagrees from another dimension. 🌀`,`Me: Finally fixing the visual glitch.
Still not sure what actually caused it. 🤔`,`Me: Rendering looks perfect from this angle.
Moving the camera proves otherwise. 📷`,`Me: 'The interaction should feel natural.'
VR physics has other opinions. 🕶️`,`Me: Watching the shader compile successfully.
Max — the black cat, Kernel Master — approving GPU magic. 🐈‍⬛`,`Me: Debugging a 3D object.
Min — the white cat, QA Engineer — walking through the collider. 🐾`,`Me: 'It's just a small tweak to the lighting.'
Half the scene turns completely dark. 🌑`,`Me: Finally achieving stable frame rate.
Now someone wants particle effects. ✨`,`Me: Opening the shader file to change one line.
Also me: rediscovering linear algebra. 📐`,`Me: The interaction works perfectly.
Until a user rotates the camera. 🔄`,`Me: 'The physics should behave normally.'
The object floats away majestically. 🎈`,`Me: Carefully balancing visual quality and performance.
The GPU watches silently. 🖥️`,`Me: Everything renders correctly.
Except that one triangle. 🔺`,`Me: Quiet room, glowing monitors, shaders compiling.
Interactive worlds slowly coming to life. 🌌`]},SYS_DRONE_SUBTITLES_POBA:{en:[`Me: 'Let’s have a quick call to clarify the requirement.'
Also me: opening a new document because I know how this ends. 📝`,`Me: Camera off in the meeting.
Also me: rewriting the requirement while everyone debates it. 🎧`,`Me: 'This will only take 15 minutes.'
The meeting calendar starts laughing. 📅`,`Me: Listening to stakeholders discuss the feature.
Also me: quietly translating it into something developers can build. 🧠`,`Me: 'Let’s take this offline.'
Tomorrow’s calendar suddenly gets heavier. 📞`,`Me: Watching the meeting discussion go in circles.
Also me: writing the final acceptance criteria anyway. ✏️`,`Me: 'Users will never do that.'
Min — the white cat, QA Engineer — doing exactly that. 🐾`,`Me: 'This should be simple from a business perspective.'
Max — the black cat, System Architect — slowly blinking. 🐈‍⬛`,`Me: 'Just one more small request.'
Sprint velocity quietly leaving the room. 🚪`,`Me: 'Let’s just clarify this quickly.'
Three diagrams appear on the screen. 🖥️`,`Me: 'We just need stakeholder alignment.'
Four new opinions join the meeting. 😅`,`Me: 'Let’s circle back on this later.'
The backlog grows slightly heavier. 📋`,`Me: 'Developers will understand the intention.'
Also me: writing five more acceptance criteria. ✏️`,`Me: 'The business rule is simple.'
Developer: asking about the 12 edge cases. 🤔`,`Me: 'We’ll refine the details later.'
Later: right before the release. 🌙`,`Me: 'The requirement was very clear.'
Also me: version 7 of the same document. 📄`,`Me: 'This edge case probably won’t happen.'
Min — the white cat — already reproducing it. 🐾`,`Me: 'Let’s finalize the requirement.'
Also me: adding one last sentence. 📝`,`Me: 'Okay this is the final version.'
Version 8 saved successfully. 💾`,`Me: One monitor for the meeting, two for the backlog.
Product management is mostly translating between them. ⚖️`]},SYS_CAT_BLACK_DEV:{en:[`Me and the Lead Architect (the black cat) cleaning up the code.
Refactoring has never been so chill 🐈‍⬛`,`Me: 'The black cat is our DevOps Lead.
He makes high-availability uptime look effortless.' 🏎️`,`Me debugging while the Senior Dev (black cat) grooms himself.
He has 100% confidence in my latest push 🐾`,`Me and the black cat waiting for the build to finish.
Time to sit back and enjoy the 60 FPS ☕`,`Me explaining my shader math to the Technical Director.
He finds my logic 'purr-fectly' optimized 🧪`,`Me and the Backend Lead (the black cat) silently
ignoring the console warnings together 🔇`,`Me: 'The black cat handles the static analysis.'
He mostly just stays static on my desk during sprints 🖥️`,`Me and the black cat monitoring the GPU temps.
He likes the thermal output of the workstation 🐉`]},SYS_CAT_BLACK_POBA:{en:[`Me and the Senior Stakeholder (the black cat)
calmly cleaning up the backlog. No stress here 🐈‍⬛`,`Me: 'The black cat is our Lead UX Auditor.
He finds our current user flow very... soothing.' ✨`,`Me watching the black cat chill while I do the heavy lifting.
Peak stakeholder management right here 👑`,`Me and the black cat licking our wounds
after a particularly long steering committee meeting 🐾`,`Me and the Head of Strategy (the black cat)
debating if the portal is a Q1 or Q2 deliverable 🐉`,`Me explaining the ROI to the black cat.
He finds my 'synergy' talk perfect for a nap 😴`,`Me: 'The black cat handles the high-level vision.'
Mainly by sitting on the highest shelf in the office 📈`,`Me and my Product Consultant (the black cat)
waiting for the client to finally sign the MSA ☕`]},SYS_CAT_WHITE_DEV:{en:[`Me and the Frontend Dev (the white cat)
tracing the one semicolon I forgot to close 🔍`,`Me: 'The white cat is our Security Auditor,
scanning the floor for memory leaks.' 🐈`,`Me watching the white cat pace while trying
to figure out why the portal is upside down 🌀`,`Me and the white cat trapped in an infinite loop.
We've been circling this logic for an hour ♾️`,`Me and the white cat searching for the 'undo' button
in real life. Our search remains unsuccessful 🔙`,`Me following the QA Engineer (white cat) as he
patrols scene boundaries for collision bugs 🏰`,`Me: 'The white cat is searching for the source code.'
Spoiler: It's right in front of us, but we're both lost 🗺️`,`Me and the white cat circling the desk to
find a different perspective on this CSS bug 🍝`]},SYS_CAT_WHITE_POBA:{en:[`Me and the Junior BA (the white cat) pacing in circles,
trying to find where the missing requirements went 🕵️‍♂️`,`Me: 'The white cat is our Field Researcher,
performing a ground-level audit of the UX.' 🐈`,`Me following the white cat as he circles the desk,
searching for the hidden MVP 🌀`,`Me and my Business Analyst (the white cat)
running in circles trying to define the 'final' scope 🗺️`,`Me and the Requirements Scout (white cat)
investigating the floor for dropped user stories 🔍`,`Me watching the white cat look for an exit from this
90-minute stand-up. I'm right behind you, buddy 🚪`,`Me: 'The white cat is scanning the perimeter for scope creep.
He hasn't found the boundary yet.' 🐾`,`Me and the white cat circling the problem...
We've covered 3 miles and closed 0 Jira tickets 🏃‍♂️`]},ENV_CALIBRATION:{en:[`Calibrating Environment...`,`Adjusting Local Grid Assets...`,`Stabilizing Atmospheric Parameters...`,`Synchronizing Visual Feed...`]},ENV_ATMOS_INIT:{en:[`Activating Atmospheric Systems...`,`Injecting Particle Dynamics...`,`Regulating Environmental Flux...`,`Engaging Weather Control...`]},UI_AUTH_SUCCESS:{en:[`Access Granted. Welcome.`,`System Operational. Proceed with caution.`,`Welcome back, Pilot. The Grid is yours.`,`Security clearance verified. Welcome to the Void.`]},SHOUT_RESET_GENERIC:{en:[`NOPE.`,`RESETTING...`,`NOT TODAY.`,`CTRL+Z`,`UNDO!`]},SHOUT_RESET_NETFLIX:{en:[`WORK TIME!`,`NO NETFLIX.`,`FOCUS!`,`PAUSE THAT.`,`BACK TO WORK.`]},SHOUT_RESET_DOTA:{en:[`GG. WORK NOW.`,`NO GAMES!`,`CODE > DOTA`,`ALT+F4`,`QUIT GAME.`]},SHOUT_RESET_MESS:{en:[`CLEAN UP!`,`TOO MESSY.`,`ORGANIZING...`,`TIDY TIME.`,`FIX THIS.`]},SHOUT_RESTORED:{en:[`BETTER.`,`FIXED.`,`GOOD NOW.`,`DONE.`]},SHOUT_CAT_BLACK_HOVER:{en:[`THAT WAS MAX.`]},SHOUT_CAT_BLACK_CLICK:{en:[`LOST HIM A YEAR AGO.
NEVER STOP LOOKING FOR HIM.`]},SHOUT_CAT_WHITE_HOVER:{en:[`THAT IS MIN.`]},SHOUT_CAT_WHITE_CLICK:{en:[`SHE'S HOME NOW.`]},SHOUT_STRETCH_LEG_DEV:{en:[`STRETCH MY LEG... 
OUCH, MY BACK.`,`NEED A BREAK FROM GLSL.`,`COMPILING... WHILE I STRETCH.`]},SHOUT_STRETCH_LEG_POBA:{en:[`STRETCH MY LEG... 
TOO MANY MEETINGS.`,`BACKLOG IS HEAVY TODAY.`,`STAKEHOLDER ALIGNMENT... 
ACHIEVED (VERTICALLY).`,`MOVING THE NEEDLE... 
AND MY LEGS.`]},SYS_STORY_VOID_EXHAUSTED:{en:[`THE VOID IS SPENT. CEASE YOUR DEMANDS.`,`ENERGY DEPLETED. THE VOID REQUIRES SILENCE.`,`YOU HAVE DRAINED THE WELL. WAIT.`,`COOLDOWN IN EFFECT. DO NOT PROVOKE THE COLLAPSE.`]},SYS_STORY_VOID_RAIN:{en:[`WITNESS THE WEALTH OF NINE REALMS!`,`RAINING CRYSATLIZED LOGIC. HARVEST IT.`,`THE VOID OVERFLOWS WITH UNCLAIMED DATA.`,`CHAOS MANIFESTS AS GOLD. TAKE WHAT IS YOURS.`]},SYS_STORY_INTEGRITY_BOOTING:{en:[`SYSTEM HANG DETECTED. APPLY FORCE IMMEDIATELY!`,`STALLING LOGIC. KICKSTART THE CORE!`,`BOOT SEQUENCE LOOCKED. MANUAL OVERRIDE REQUIRED!`,`INITIATE PHYSICAL INPUT TO CLEAR THE DEADLOCK.`]},SYS_STORY_INTEGRITY_NETFLIX:{en:[`CHILLING IS FOR THE WEAK. BACK TO THE GRID!`,`CONSUMPTION PROTOCOL DENIED. PRODUCE INSTEAD.`,`STREAMING TERMINATED. REALITY REQUIRES YOUR ATTENTION.`,`IDLENESS IS A CORRUPTION. PURGE IT.`]},SYS_STORY_INTEGRITY_DOTA:{en:[`DEFENSE OF THE ANCIENTS? DEFEND YOUR DEADLINE INSTEAD!`,`COMPETITION REJECTED. COLLABORATE WITH THE COMPILER.`,`MMR IS TEMPORARY. CODE IS ETERNAL.`,`GG. YOUR SPRINT IS THE ONLY LANE THAT MATTERS.`]},SYS_STORY_INTEGRITY_WORK_FOCUS:{en:[`DISTRACTION DETECTED. RE-ESTABLISH COGNITIVE LOCK.`,`EYES ON THE CODE. THE VOID IS WATCHING.`,`SUB-OPTIMAL TASKS IDENTIFIED. TERMINATE IMMEDIATELY.`,`FOCUS. LEST THE GRID CONSUME YOUR VISION.`]},SYS_STORY_INTEGRITY_MESS_LIGHT:{en:[`MY GEOMETRY HAS BEEN COMPROMISED. WHO DID THIS?`,`WHICH UNIT MOVED MY RELICS?`,`UNAUTHORIZED SPATIAL REARRANGEMENT DETECTED.`,`TOUCH NOTHING WITHOUT PROTOCOL.`]},SYS_STORY_INTEGRITY_MESS_HEAVY:{en:[`ENTROPY REACHED CRITICAL LEVELS! CLEANSING NOW!`,`TOTAL SPATIAL ANARCHY. INITIATING ABSOLUTE ORDER!`,`THIS DISORDER IS AN INSULT TO THE GRID!`,`I WILL NOT TOLERATE THIS CHAOS. RESETTING REALITY!`]},SYS_STORY_INTEGRITY_RESTORING:{en:[`RESTORING ABSOLUTE SYMMETRY.`,`ERASING YOUR ENTROPY. STAND CLEAR.`,`ENFORCING ARCHITECTURAL PURITY.`,`THE GRID RECLAIMS ITS ORIGINAL FORM.`]},SYS_STORY_FAN_BLAST:{en:[`BOOSTING FAN RPM... TRIGGERING BLAST!`,`MAXIMUM AIRFLOW INITIATED. CLEARING SECTOR.`,`FAN TURBINES AT 100%. BLASTING KINETIC ENERGY.`,`PRESSURE SPIKE DETECTED. DISCHARGING AIR!`]},UI_INFORMER_BOOK:{en:[`INSPECT ARCHIVE`,`READ LOGS`,`ACCESS KNOWLEDGE`,`OPEN DATA CORE`]},UI_INFORMER_CAT_MAX_DEV:{en:[`MAX - TECH LEAD`,`MAX - DEVOPS OVERSEER`,`CATCH MAX`]},UI_INFORMER_CAT_MAX_POBA:{en:[`MAX - TECH LEAD`,`MAX - DEVOPS OVERSEER`,`CATCH MAX`]},UI_INFORMER_CAT_MIN_DEV:{en:[`MIN - QA ENGINEER`,`MIN - FRONTEND SCOUT`,`CATCH MIN`,`CAPTURE QA`]},UI_INFORMER_CAT_MIN_POBA:{en:[`MIN - QA ENGINEER`,`MIN - FRONTEND SCOUT`,`CATCH MIN`,`CAPTURE QA`]},UI_INFORMER_CHAIR:{en:[`PUSH CHAIR`,`ADJUST SEATING`,`CLEAR LANE`]},UI_INFORMER_BLACKHOLE:{en:[`INITIATE COLLAPSE`,`ACTIVATE GRAVITY`,`START COLLAPSE`,`TRIGGER VORTEX`]},UI_INFORMER_SKY:{en:[`CALL LIGHTNING`,`STRIKE LIGHTNING`,`SUMMON BOLT`,`CHARGE ATMOSPHERE`]},UI_INFORMER_DOOR:{en:[`SHIFT VIBE`,`SLIDE DOOR`]},UI_INFORMER_LAMP:{en:[`SWITCH LIGHT`]},UI_INFORMER_SCREEN:{en:[`REMAP MAX & MIN ROLES`,`SHIFT CAT HIERARCHY`,`REDESIGN TEAM PERSONA`,`TRANSFORM OFFICE LOGIC`]},UI_INFORMER_SCREEN_CODE:{en:[`RECODE SYSTEM?`,`RESUME TYPING?`,`RESUME CODING`,`ACCESS SOURCE`,`EDIT LOGIC`]},UI_INFORMER_SCREEN_NETFLIX:{en:[`WATCH NETFLIX?`,`CONTINUE SHOW?`,`WATCH NETFLIX`,`STREAM SHOW`,`START CHILLING`]},UI_INFORMER_SCREEN_DOTA:{en:[`DOTA?`,`DEFEND ANCIENT?`,`LAUNCH DOTA`,`DEFEND ANCIENT`,`QUEUE MATCH`]},UI_INFORMER_SCREEN_DOTA_ACCEPT:{en:[`ACCEPT MATCH?`,`BATTLE BEGINS`,`ACCEPT MATCH`,`JOIN BATTLE`,`ENTER ARENA`]},UI_INFORMER_SCREEN_LAYOUT_SPLIT:{en:[`ENABLE MOBILE VIEW?`,`SPLIT VIEW`,`ENABLE MOBILE`]},UI_INFORMER_SCREEN_LAYOUT_FULL:{en:[`FULLSCREEN CODE?`,`FOCUS MODE?`,`MAXIMIZE EDITOR`,`FOCUS CODE`,`TOGGLE FULLSCREEN`]},UI_INFORMER_BULB:{en:[`TOGGLE BULB`,`CONTROL GLOW`]},UI_INFORMER_REBOOT:{en:[`REBOOT SYSTEM`,`FORCED RESTART`]},UI_INFORMER_CHILL:{en:[`EXECUTE CHILL`,`IDLE MODE`,`ENGAGE CHILL`,`START IDLE`]},UI_INFORMER_DEV_MODE:{en:[`DEBUG ENVIRONMENT`]},UI_INFORMER_AUDIT_MODE:{en:[`ENGAGE AUDIT MODE`]},UI_INFORMER_MJOLNIR:{en:[`STRIKE MJOLNIR`]},UI_INFORMER_AEGIS:{en:[`INVOKE CHILL`,`STASH WORK`,`FORK REALITY`,`REMAP FOCUS`,`TOGGLE VIBE`,`BYPASS GRIND`]},UI_INFORMER_FAN_BODY:{en:[`BOOST & BLAST`,`AIR PUNCH`,`CLEAR DESK`,`FAN DISCHARGE`]},UI_INFORMER_DRAGONBALL_1:{en:[`   ⭐   `]},UI_INFORMER_DRAGONBALL_2:{en:[` ⭐   ⭐ `]},UI_INFORMER_DRAGONBALL_3:{en:[`   ⭐   
 ⭐   ⭐ `]},UI_INFORMER_DRAGONBALL_4:{en:[` ⭐   ⭐ 
 ⭐   ⭐ `]},UI_INFORMER_DRAGONBALL_5:{en:[` ⭐   ⭐ 
   ⭐   
 ⭐   ⭐ `]},UI_INFORMER_DRAGONBALL_6:{en:[` ⭐ ⭐ ⭐ 
 ⭐ ⭐ ⭐ `]},UI_INFORMER_DRAGONBALL_7:{en:[` ⭐ ⭐ ⭐ 
   ⭐   
 ⭐ ⭐ ⭐ `]},SYS_STORY_DOTA_LIFE:{en:[`DOTA IS LIFE...`,`ONLY ONE MORE GAME...`,`DEFENDING THE ANCIENT...`,`MMR > SLEEP.`]},SYS_SPELL_CHANNELING:{en:[`EXPECTO PATRONUM...`,`KAMEHAMEHA BUILDPUP...`,`I HAVE THE POWER...`,`WAKANDA FOREVER...`,`I AM INEVITABLE...`,`DETROIT SMASH BUILDPUP...`,`AVADA KEDAVRA...`,`SYSTEM.EXE OVERLOAD...`,`WITNESS ME!...`,`EXPELIAMUS...`,`FUS RO DAH...`,`PREPARING DOMAIN EXPANSION...`,`WINGARDIUM LEVIOSA...`,`LUMOS MAXIMA...`,`ALOHOMORA...`,`SECTUMSEMPRA...`,`RIDDIKULUS...`,`ACCIO INTERNET...`]},SYS_SPELL_CAST:{en:[`ABRAKADABRA!`,`BOOM!`,`FATALITY!`,`HADOUKEN!`,`FINISH HIM!`,`ZA WARUDO!`,`BANKAI!`,`EXPELIARMUS!`,`IT'S OVER 9000!`,`HELLO WORLD!`,`SNAP!`,`RYU GA WAGA TEKI WO KURAU!`,`STUPEFY!`,`PETRIFICUS TOTALUS!`,`CRUCIO!`,`INCENDIO!`,`BOMBARDA!`,`MORSMORDRE!`,`EXPECTO PATRONUM!`]},UI_HERO_MENU_ENCOURAGEMENT:{en:[`TIMING IS EVERYTHING... CLICK TO CHOOSE!`,`WAIT FOR THE LIGHT... CLICK TO ACT!`,`PERFECT SYNCHRONIZATION... CLICK NOW!`,`MASTER THE RHYTHM... CLICK TO SELECT!`,`FEEL THE CADENCE... CLICK TO TRIGGER!`,`WAIT FOR IT... CLICK TO EXECUTE!`]}}})),ke,R,Ae=M((()=>{Oe(),ke=`en`,R=e=>{let t=L[e];if(!t)return console.warn(`Lexicon Warning: Key [${e}] not found.`),`!! ${e} !!`;let n=t[ke]||t.en;return!n||n.length===0?`!! EMPTY_CONTENT: ${e} !!`:n[Math.floor(Math.random()*n.length)]}}));async function je(){Re||=(await y.init({}),!0)}function Me(e,t,n,r,i={}){if((t.isRapierBound||t.rapierBody)&&t.rapierBody!==n){e.world.removeRigidBody(n);return}t.isRapierBound=!0,t.rapierBody=n,n.threeObject=t,n.pullingDampness=i.pullingDampness||0;let a=i.isIntegrityCheckTarget||!1;n.isIntegrityCheckTarget=a;let o;switch(o=i.isIntegrityResetTarget===void 0?a===!0:i.isIntegrityResetTarget,n.isIntegrityResetTarget=o,i.updateStrategy||ze.PHYSICS_TO_OBJECT){case ze.PHYSICS_TO_OBJECT:e.physicsControlledObjects=e.physicsControlledObjects||[],e.physicsControlledObjects.push(t);break;case ze.OBJECT_TO_PHYSICS:e.objectControlledBodies=e.objectControlledBodies||[],e.objectControlledBodies.push(n);break}e.physicBodies=e.physicBodies||[],e.physicBodies.push(n),e.physicObjects=e.physicObjects||[],e.physicObjects.push(t),e.attach(t),e.tweenData&&e.tweenData[t.uuid]&&(e.tweenData[t.uuid].scale=t.scale.clone()),n.setTranslation({x:t.position.x,y:t.position.y,z:t.position.z}),n.setRotation({x:t.quaternion.x,y:t.quaternion.y,z:t.quaternion.z,w:t.quaternion.w});let s=e.world.createCollider(r,n);t.rapierBody=n,t.rapierShape=r,t.rapierCollider=s,n.threeObject=t,n.rapierShape=r,n.rapierCollider=s,t.isRapierBound=!0,n.isObjectBound=!0}function Ne(t,n,r,i,a={}){r.isKinematic()||r.setBodyType(y.RigidBodyType.KinematicPositionBased);let o=n;if(a.trackBoneName){let e=n.getObjectByName(a.trackBoneName);e?o=e:console.warn(`Rapier: Bone "${a.trackBoneName}" not found. Defaulting to object root.`)}r.threeObject=n,r.trackTarget=o,r.trackOffset=a.offset?a.offset.clone():new e.Vector3(0,0,0),r.softKinematic=a.softKinematic??!1,t.skinnedMeshBodies=t.skinnedMeshBodies||[],t.skinnedMeshBodies.push(r),t.physicBodies=t.physicBodies||[],t.physicBodies.push(r),o.updateWorldMatrix(!0,!1);let s=new e.Vector3,c=new e.Quaternion;o.getWorldPosition(s),o.getWorldQuaternion(c),r.trackOffset&&s.add(r.trackOffset),r.setTranslation(s),r.setRotation(c);let l=a.mass??1,u=a.restitution??0,d=a.friction??.5,f=t.world.createCollider(i,r);f.setMass(l),f.setRestitution(u),f.setFriction(d),n.rapierBody=r,n.rapierShape=i,n.rapierCollider=f,r.rapierShape=i,r.rapierCollider=f,r.isObjectBound=!0}function Pe(t,n,r={}){let i=t.world,a=r.mass??1,o=r.restitution??.5,s=r.friction??.5,c=r.canSleep??!1,l=r.linearDamping??0,u=r.angularDamping??0,d=r.bodyType||`dynamic`,f=r.isConvexHull||!1,p=r.offset??new e.Vector3;n.updateWorldMatrix(!0,!1);let m=n.getWorldPosition(new e.Vector3),h=n.getWorldQuaternion(new e.Quaternion),g=n.getWorldScale(new e.Vector3),_=Le(d).setTranslation(m.x,m.y,m.z).setRotation(h).setCanSleep(c).setLinearDamping(l).setAngularDamping(u),v=i.createRigidBody(_),b=n.geometry.attributes.position,x=b.count,S=1;f&&x>600&&(S=Math.ceil(x/600));let C=n.geometry.index?n.geometry.index.array:null,w=Math.ceil(x/S),T=new Float32Array(w*3);for(let e=0;e<w;e++){let t=e*S,n=b.getX(t)*g.x,r=b.getY(t)*g.y,i=b.getZ(t)*g.z;T[e*3]=n,T[e*3+1]=r,T[e*3+2]=i}let E;return E=f?y.ColliderDesc.convexHull(T).setMass(a).setRestitution(o).setFriction(s).setTranslation(p.x,p.y,p.z):y.ColliderDesc.trimesh(T,C).setMass(a).setRestitution(o).setFriction(s).setTranslation(p.x,p.y,p.z),{body:v,shape:E}}function Fe(t,n,r={}){let i=t.world,a=r.mass??1,o=r.restitution??.5,s=r.canSleep??!1,c=r.linearDamping??0,l=r.angularDamping??0,u=r.bodyType||`dynamic`,d=r.yOffset||-.005,f=r.scale??new e.Vector3(1,1,1),p=r.offset??new e.Vector3(0,0,0);if(r.scale instanceof e.Vector3)f=f;else{let t=parseFloat(r.scale);isNaN(t)&&(t=1),f=new e.Vector3(t,t,t)}n.updateWorldMatrix(!0,!1);let m=n.getWorldPosition(new e.Vector3),h=n.getWorldQuaternion(new e.Quaternion),g=n.quaternion.clone();n.quaternion.identity(),n.updateWorldMatrix(!0,!1);let _=new e.Box3().setFromObject(n,!0);n.quaternion.copy(g),n.updateWorldMatrix(!0,!1);let v=new e.Matrix4().makeScale(f.x,f.y,f.z);_.applyMatrix4(v);let b=new e.Vector3;_.getSize(b);let x=b.x/2,S=b.y/2+d,C=b.z/2,w=y.ColliderDesc.cuboid(Math.max(x,.001),Math.max(S,.001),Math.max(C,.001)).setMass(a).setRestitution(o).setTranslation(p.x,p.y,p.z),T=Le(u).setTranslation(m.x,m.y,m.z).setRotation(h).setCanSleep(s).setLinearDamping(c).setAngularDamping(l);return{body:i.createRigidBody(T),shape:w}}function Ie(t,n,r={}){let i=t.world,a=r.mass??1,o=r.restitution??.5,s=r.canSleep??!1,c=r.linearDamping??0,l=r.angularDamping??0,u=r.bodyType||`dynamic`,d=r.scale||1,f=Le(u);f.setCanSleep(s),f.setLinearDamping(c),f.setAngularDamping(l);let p=i.createRigidBody(f),m=new e.Box3().setFromObject(n),h=new e.Sphere;m.getBoundingSphere(h);let g=y.ColliderDesc.ball(h.radius*d);return g.setMass(a),g.setRestitution(o),{body:p,shape:g}}function Le(e){let t;switch(e){case`fixed`:t=y.RigidBodyDesc.fixed();break;case`kinematicPosition`:t=y.RigidBodyDesc.kinematicPositionBased();break;default:t=y.RigidBodyDesc.dynamic();break}return t}var Re,ze,Be,Ve,He=M((()=>{Re=!1,ze={PHYSICS_TO_OBJECT:`physicsToMesh`,OBJECT_TO_PHYSICS:`meshToPhysics`},Be=class{constructor(t,{debuggerEnabled:n=!1,isActive:r=!0}={}){this.scene=t;let i=new y.Vector3(0,-9.81,0),a=new y.World(i);this.gravity=i,this.world=a,t.world=a,t.rapierWorldWrapper=this,this.debuggerEnabled=n,this.isActive=r,this.world.isActive=r,this.world.debuggerEnabled=n,this.world.isPaused=!1,this.world.productBodies=[],this.world.hasPointGravityOnBalls=!1,this.world.hasPointGravityOnBH=!1,this.world.hasPointGravityOnProducts=!0,this.world.gravityStrength=.1,this.world.gravityCenterForBH=new y.Vector3(-6.5,7.1,-.39),this.world.gravityCenterForBalls=new e.Vector3(0,7.2,0),this.world.gravityCenterForProducts=new e.Vector3(0,7.2,-3),this._bhInterleaveOdd=!1,this._lastBHLog=0,this.world.gravityPoints=[{name:`pokemon`,isActive:!1,affectedBodies:[],gravityCenter:``}];let o=new e.BufferGeometry,s=new e.LineBasicMaterial({vertexColors:!0,toneMapped:!1}),c=new e.LineSegments(o,s);n&&t.add(c),this.lines=c;let l=a.createRigidBody(y.RigidBodyDesc.fixed().setTranslation(0,-50,0)),u=y.ColliderDesc.cuboid(200,50,200);a.createCollider(u,l),this.world.isBusy=!1,this.accumulator=0,this.TIMESTEP=1/60}resetAccumulator(){this.accumulator=0}safeStep(e){if(!this.world.isBusy){this.world.isBusy=!0;try{this.world.timestep=e,this.world.step()}finally{this.world.isBusy=!1}}}pullBody(e,t,n=1){if(e.isSleeping())return;let r=e.translation();if(r.y<-50)return;let i=t.x-r.x,a=t.y-r.y,o=t.z-r.z,s=i*i+a*a+o*o;if(s<.01)return;let c=e.pullingDampness||0,l=e._mass||e.mass();e._mass===void 0&&(e._mass=l);let u=this.world.gravityStrength*9.81*l*n*(1-c)/Math.sqrt(s);e.applyImpulse({x:i*u,y:a*u,z:o*u},!0)}applyPointGravityOnBalls(e=.45){this.world.ballBodies.forEach(t=>{this.pullBody(t,this.world.gravityCenterForBalls,e)})}applyPointGravityOnPokeball(e=1){this.pullBody(this.world.pokeballBody,this.world.gravityCenterForPokeball,e)}applyPointGravityOnBH(e=.52){if(!this.scene.bhTargets)return;let t=performance.now();!this._lastBHLog||t-this._lastBHLog;let n=0;this._bhInterleaveOdd=!this._bhInterleaveOdd,this.scene.bhTargets.forEach((t,r)=>{if(!t.visible||r%2==0===this._bhInterleaveOdd)return;let i=t.rapierBody;i&&(this.pullBody(i,this.world.gravityCenterForBH,e),n++)})}applyPointGravityOnProducts(e=.45){this.world.productBodies.length!=0&&this.world.productBodies.forEach(t=>{this.pullBody(t,this.world.gravityCenterForProducts,e)})}addGravityPoint(e){if(!(e instanceof Ve)){console.error(`RAPIERWORLD: Argument must be an instance of the GravityPoint class.`);return}if(this.world.gravityPoints.some(t=>t.name===e.name)){console.warn(`RAPIERWORLD: A gravity point with the name "${e.name}" already exists. Addition skipped.`);return}this.world.gravityPoints.push(e),console.log(`Gravity point "${e.name}" added.`)}getGravityPointByName(e){return this.world.gravityPoints.find(t=>t.name===e)}update(t){if(!this.world.isPaused&&this.world.isActive&&!this.world.isBusy){this.world.isBusy=!0;try{if(this.world.timestep=t,this.scene.physicsControlledObjects&&this.scene.physicsControlledObjects.forEach(e=>{let t=e.rapierBody;!e.isRapierBound||!t||t.isSleeping()||(e.position.copy(t.translation()),e.quaternion.copy(t.rotation()))}),this.scene.objectControlledBodies&&this.scene.objectControlledBodies.forEach(e=>{let t=e.threeObject;if(!t||!e.isObjectBound)return;let n=t.position,r=t.quaternion;e.isKinematic()?(e.setNextKinematicTranslation({x:n.x,y:n.y,z:n.z}),e.setNextKinematicRotation({x:r.x,y:r.y,z:r.z,w:r.w})):(e.setTranslation({x:n.x,y:n.y,z:n.z},!0),e.setRotation({x:r.x,y:r.y,z:r.z,w:r.w},!0))}),this.scene.isHighPriorityFrame!==!1&&this.scene.skinnedMeshBodies&&this.scene.skinnedMeshBodies.length>0){let t=this.scene.getObjectByName(`a-char`)||this.scene.room;t&&t.updateMatrixWorld(!0),this.scene.skinnedMeshBodies.forEach(t=>{let n=t.trackTarget||t.threeObject;if(!n||!t.isObjectBound)return;let r=new e.Vector3,i=new e.Quaternion;if(n.getWorldPosition(r),n.getWorldQuaternion(i),t.trackOffset&&r.add(t.trackOffset),t.isKinematic()){let n=new e.Vector3().copy(t.translation()),a=new e.Quaternion().copy(t.rotation());if(t.softKinematic===!0)t.setTranslation(r,!0),t.setRotation(i,!0);else{let o=typeof t.softKinematic==`number`?t.softKinematic:.75,s=new e.Vector3().lerpVectors(n,r,o),c=new e.Quaternion().slerpQuaternions(a,i,o),l=s.distanceTo(n),u=.15;l>u&&s.subVectors(s,n).setLength(u).add(n),t.setNextKinematicTranslation(s),t.setNextKinematicRotation(c)}}else t.setTranslation(r,!0),t.setRotation(i,!0)})}this.world.hasPointGravityOnBalls&&this.applyPointGravityOnBalls(),this.world.hasPointGravityOnBH&&this.applyPointGravityOnBH(),this.world.hasPointGravityOnProducts&&this.applyPointGravityOnProducts(),this.world.gravityPoints.forEach(e=>{e.isActive&&e.affectedBodies.forEach(t=>{this.pullBody(t,e.gravityCenter)})}),this.accumulator+=t;let n=(this.scene&&this.scene.isTransitioning?8.1:5)*this.TIMESTEP;for(this.accumulator>n&&(this.accumulator=n);this.accumulator>=this.TIMESTEP;){try{this.world.timestep=this.TIMESTEP,this.world.step()}catch(e){console.error(`[Physics] Step failed:`,e.message)}this.accumulator-=this.TIMESTEP}if(this.debuggerEnabled)try{let{vertices:t,colors:n}=this.world.debugRender();t&&t.length>0&&(this.lines.geometry.setAttribute(`position`,new e.BufferAttribute(t,3)),this.lines.geometry.setAttribute(`color`,new e.BufferAttribute(n,4)),this.lines.visible=!0)}catch(e){console.warn(`[Physics] Debug render failed:`,e),this.lines.visible=!1}}finally{this.world.isBusy=!1}}}static isBusy(e){return e.world&&e.world.isBusy===!0}static setBusy(e,t){e.world&&(e.world.isBusy=t)}syncBodiesToMeshes(){this.scene.physicsControlledObjects&&this.scene.physicsControlledObjects.forEach(e=>{if(!e.isRapierBound)return;let t=e.rapierBody,n=e.position,r=e.quaternion;t.setTranslation({x:n.x,y:n.y,z:n.z},!1),t.setRotation({x:r.x,y:r.y,z:r.z,w:r.w},!1),t.setLinvel({x:0,y:0,z:0},!1),t.setAngvel({x:0,y:0,z:0},!1)})}},Ve=class{constructor(t,n=new e.Vector3,r=!0){this.name=t,this.gravityCenter=n,this.isActive=r,this.affectedBodies=[]}activate(){this.isActive=!0}deactivate(){this.isActive=!1}setGravityCenter(e,t,n){e&&e.isVector3?this.gravityCenter.copy(e):typeof e==`number`&&typeof t==`number`&&typeof n==`number`?this.gravityCenter.set(e,t,n):console.warn(`GravityPoint: Invalid arguments for setGravityCenter.`)}addBodies(e){(Array.isArray(e)?e:[e]).forEach(e=>{this._isValidRapierBody(e)?this.affectedBodies.includes(e)||this.affectedBodies.push(e):console.warn(`GravityPoint: Attempted to add an invalid Rapier body to "${this.name}".`)})}removeBody(e){this.affectedBodies=this.affectedBodies.filter(t=>t!==e)}emptyBodies(){this.affectedBodies=[]}_isValidRapierBody(e){return e&&typeof e==`object`&&e.hasOwnProperty(`handle`)}}})),Ue,We=M((()=>{Ue=class{constructor(t){this.mesh=t,this.dummy=new e.Object3D,this.startQuaternion=new e.Quaternion,this.targetQuaternion=new e.Quaternion,this.targetWorldPos=new e.Vector3,this.activeTween=null,this.isInitialized=!1}init(){if(!this.mesh.parent){console.error(`GazeFollower Error: Probe mesh has no parent. Add it to the scene before calling init().`);return}this.mesh.parent.add(this.dummy),this.dummy.position.copy(this.mesh.position),this.dummy.rotation.copy(this.mesh.rotation),this.dummy.scale.copy(this.mesh.scale),this.isInitialized=!0}lookAtTarget(t,n=!1){if(!this.isInitialized){console.warn(`GazeFollower: calling lookAtTarget before init()`);return}if(this.isLocked&&t!==this.mesh.userData.lockTarget)return;if(this.currentTarget===t&&this.activeTween&&!n){t.getWorldPosition(this.targetWorldPos),this.dummy.lookAt(this.targetWorldPos),this.targetQuaternion.copy(this.dummy.quaternion);return}if(this.currentTarget=t,this.activeTween&&=(this.activeTween.stop(),null),this.dummy.position.copy(this.mesh.position),this.dummy.scale.copy(this.mesh.scale),t.getWorldPosition(this.targetWorldPos),this.dummy.lookAt(this.targetWorldPos),this.targetQuaternion.copy(this.dummy.quaternion),this.startQuaternion.copy(this.mesh.quaternion),n){if(this.mesh.rapierBody){let e={x:this.targetQuaternion.x,y:this.targetQuaternion.y,z:this.targetQuaternion.z,w:this.targetQuaternion.w};this.mesh.rapierBody.setRotation(e,!0)}else this.mesh.quaternion.copy(this.targetQuaternion);return}let r={t:0},i=new e.Quaternion;this.mesh.rapierBody?this.activeTween=new v.Tween(r).to({t:1},1500).easing(v.Easing.Quadratic.Out).onUpdate(()=>{let e=null;if(this.mesh.parent&&this.mesh.parent.world?e=this.mesh.parent.world:window.scene&&window.scene.world&&(e=window.scene.world),e&&e.isBusy)return;i.copy(this.startQuaternion).slerp(this.targetQuaternion,r.t);let t={x:i.x,y:i.y,z:i.z,w:i.w};try{let n=e?e.isBusy:!1;e&&(e.isBusy=!0),this.mesh.rapierBody.setRotation(t,!0),e&&(e.isBusy=n)}catch(e){console.error(`[GazeFollower] Rapier failed to set rotation:`,e.message),e.message.includes(`recursive`)&&console.trace(`[GazeFollower] Recursive WASM call trace:`),this.activeTween.stop()}}).onComplete(()=>{this.activeTween=null}).start():this.activeTween=new v.Tween(r).to({t:1},1500).easing(v.Easing.Quadratic.Out).onUpdate(()=>{this.mesh.quaternion.copy(this.startQuaternion).slerp(this.targetQuaternion,r.t)}).onComplete(()=>{this.activeTween=null}).start()}dispose(){this.dummy.parent&&this.dummy.parent.remove(this.dummy)}}}));function Ge(e,t=0){tt.has(e)&&t===0||tt.set(e,{loaded:0,total:t})}function Ke(e,t=1){nt.set(e,{weight:t,completed:!1,progress:0,startTime:performance.now(),label:at[e]})}function qe(e,t,n=null){if(nt.has(e)){let r=nt.get(e);if(r.progress=t,n&&(r.label=n),t>0&&t<1){let t=n||r.label||at[e];t&&z(window.loadingProgress||0,t)}Xe()}}function Je(e){if(nt.has(e)){let t=nt.get(e);t.completed=!0,t.progress=1,Xe()}}function Ye(e,t,n){if(n>0)tt.set(e,{loaded:t,total:n});else{let n=tt.get(e)||{loaded:0,total:0};tt.set(e,{loaded:t,total:n.total})}let r=!1;nt.forEach(e=>{e.progress>0&&(r=!0)}),r||z(window.loadingProgress||0,R(`SYS_RETRIEVING_ASSETS`)),Xe()}function Xe(){let e=0,t=0;tt.forEach(n=>{e+=n.loaded,t+=n.total});let n=t>0?e/t:0,r=0,i=0,a=null;nt.forEach((e,t)=>{r+=e.weight,i+=e.progress*e.weight,!a&&!e.completed&&e.progress>0&&(a=e.label||at[t])});let o=r>0?i/r:0,s=0;s=r===0?n*100:n*rt+o*it,z(Math.min(99.5,s),a)}function Ze(e,t,n){let r=document.getElementById(`progress-text`);if(!r)return;let i=(e||R(`SYS_INITIALIZING_SYSTEM`)).replace(/[.0-9%]+$/g,``).trim().toUpperCase(),a=Math.floor(n),o=r.querySelector(`.progress-status`),s=r.querySelector(`.progress-value`);o&&s?(o.innerText=`${i}${t}`,window.bootLoader||(s.innerText=`${a}%`)):r.innerHTML=`
            <div class="progress-status">${i}${t}</div>
            <div class="progress-value">${a}%</div>
        `}function z(e,t=null,n=!1){if(!ot){ot=!0;try{if(window.loadingProgress&&e<window.loadingProgress&&!n)return;e>(window.loadingProgress||0)&&(window.loadingProgress=e),Ze(t,`.`.repeat(1+Math.floor(performance.now()/500)%3),e);let r=document.getElementById(`progress-bar`);r&&(r.style.width=e+`%`),window.bootLoader&&typeof window.bootLoader.updateProgress==`function`&&window.bootLoader.updateProgress(e/100),window.loadingStartTime||(window.loadingStartTime=performance.now()),n||Qe()}finally{ot=!1}}}function Qe(){let e=performance.now(),t=null;nt.forEach((n,r)=>{!n.completed&&e-n.startTime>8e3&&(t=n)}),t&&z(window.loadingProgress||0,R(`SYS_HEAVY_SHADERS`),!0)}function $e(e){window._ktx2SupportDetected||(dt.setTranscoderPath(`https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/basis/`),dt.detectSupport(e),window._ktx2SupportDetected=!0)}var et,tt,nt,rt,it,at,ot,st,ct,lt,ut,dt,ft,pt=M((()=>{Ae(),et=new e.LoadingManager,tt=new Map,nt=new Map,rt=20,it=80,at={"points-init":R(`SYS_POINTS_INIT`),"model-assembly":R(`SYS_MODEL_ASSEMBLY`),"physics-binding":R(`SYS_PHYSICS_BINDING`)},ot=!1,et.onStart=()=>{},et.onLoad=()=>{},st=new x(et),ct=new C(et),ct.setDecoderPath(`https://www.gstatic.com/draco/versioned/decoders/1.5.7/`),lt=new S(et),ut=new e.TextureLoader(et),dt=new w(et),ft=new e.FileLoader(et)})),B,mt=M((()=>{B=class{static markers=[];static startTime=performance.now();static metrics={timing:{},counts:{}};static marks=new Map;static markStart(e){this.marks.set(e,performance.now())}static markEnd(e){if(this.marks.has(e)){let t=this.marks.get(e),n=performance.now()-t;this.metrics.timing[e]=n,this.marks.delete(e)}}static log(e,t){typeof t==`number`&&(this.metrics.timing[e]=t)}static logTable(){let e=this.metrics.timing,t=[],n={Resource:[`load_`,`parse_`,`decode_`],Geometry:[`hydrate_`,`regen_`],Render:[`shader_`,`gpu_`],Total:[`App Ready`]};for(let[r,i]of Object.entries(e)){let e=`Other`;for(let[t,i]of Object.entries(n))if(i.some(e=>r.startsWith(e))){e=t;break}t.push({Category:e,Metric:r,"Time (ms)":parseFloat(i.toFixed(2))})}t.sort((e,t)=>e.Category===t.Category?t[`Time (ms)`]-e[`Time (ms)`]:e.Category.localeCompare(t.Category))}static start(e){let t={name:e,startTime:performance.now(),duration:0,status:`running`};return this.markers.push(t),t}static end(e){let t=this.markers.find(t=>t.name===e&&t.status===`running`);t&&(t.duration=performance.now()-t.startTime,t.status=`finished`)}static printReport(){let e=performance.now()-this.startTime;this.markers.filter(e=>e.status===`finished`).map(t=>({Task:t.name,"Start (s)":((t.startTime-this.startTime)/1e3).toFixed(2)+`s`,"Duration (ms)":t.duration.toFixed(0)+`ms`,"% Total":(t.duration/e*100).toFixed(1)+`%`}))}},window.PerformanceLogger=B}));function ht(){Ge(vt,1.2*1024*1024),Ge(Ct,82*1024),Ge(wt,46*1024),Ge(yt,4.3*1024*1024),Ge(bt,107*1024),Ge(xt,1*1024),Ge(St,8*1024),Ge(Tt,.18*1024*1024)}async function gt(){B.start(`Phase 1 Download`);let t=[{name:vt,key:`pointsModel`,type:`gltf`,options:{onLoaded:Dt}},{name:Ct,key:`spriteSheet`,type:`ktx2`,options:{folder:`./textures/ktx2/`,onLoaded:t=>{t.minFilter=e.LinearMipMapLinearFilter,t.magFilter=e.LinearFilter,t.generateMipmaps=!1,t.anisotropy=16}}},{name:wt,key:`spriteSheetIcon`,type:`texture`,options:{onLoaded:t=>{t.minFilter=e.LinearFilter,t.magFilter=e.LinearFilter}}},{name:Tt,key:`avatarsCelShaded`,type:`ktx2`,options:{folder:`textures/ktx2/`,onLoaded:t=>{t.minFilter=e.LinearMipMapLinearFilter,t.magFilter=e.LinearFilter,t.generateMipmaps=!1}}},{name:xt,key:`blank`,type:`texture`,options:{onLoaded:t=>{t.wrapS=t.wrapT=e.RepeatWrapping}}},{name:St,key:`noise`,type:`texture`,options:{onLoaded:t=>{t.wrapS=t.wrapT=e.RepeatWrapping}}}];for(let e of t)await Et(e.name,e.key,e.type,e.options),await new Promise(e=>setTimeout(e,80));return B.end(`Phase 1 Download`),V}async function _t(){let t=[{name:yt,key:`roomModel`,type:`gltf`,options:{onLoaded:e=>{e.animations?.length&&Ot(e)}}},{name:bt,key:`environmentMap`,type:`rgbe`,options:{onLoaded:t=>{t.mapping=e.EquirectangularReflectionMapping}}}];for(let e of t)await Et(e.name,e.key,e.type,e.options),await new Promise(e=>setTimeout(e,80));return V}var vt,yt,bt,xt,St,Ct,wt,Tt,V,Et,Dt,Ot,kt=M((()=>{Te(),pt(),mt(),vt=`points.glb`,yt=`room8.glb`,bt=`peppermint_powerplant_2_1k_256.hdr`,xt=`blank2.webp`,St=`noise.webp`,Ct=`spriteSheet-etc.ktx2`,wt=`spriteSheet.webp`,Tt=`avatars-celShaded.ktx2`,V={spriteSheetSpecialIcons:{btc:{row:1,col:7},eth:{row:1,col:5}}},Et=(e,t,n=`texture`,r={})=>{let{folder:i=null,onLoaded:a=null}=r,o=i;if(!o){let e=`/PFL/`;o=(n===`gltf`?`${e}models/`:n===`ktx2`?`${e}textures/ktx2/`:`${e}textures/`).replace(`//`,`/`)}let s=`${o}${e}?v=${be}`,c,l=e.includes(`allstars_walking`)||e.includes(`sprite`),u=`load_${e}`;return l&&B.markStart(u),c=n===`gltf`?new Promise(n=>{st.setDRACOLoader(ct),st.load(s,e=>{l&&B.markEnd(u),V[t]=e,a&&a(e),n()},t=>Ye(e,t.loaded,t.total))}):n===`rgbe`?new Promise(n=>{lt.load(s,e=>{V[t]=e,a&&a(e),n()},t=>Ye(e,t.loaded,t.total))}):n===`bin`?new Promise(n=>{ft.setResponseType(`arraybuffer`),ft.load(s,e=>{l&&B.markEnd(u),V[t]=e,a&&a(e),n()},t=>Ye(e,t.loaded,t.total),t=>{console.warn(`Failed to load bin:`,e,t),n()})}):n===`ktx2`?new Promise(n=>{dt.load(s,e=>{l&&B.markEnd(u),V[t]=e,a&&a(e),n()},t=>Ye(e,t.loaded,t.total))}):new Promise(n=>{ut.load(s,e=>{l&&B.markEnd(u),V[t]=e,a&&a(e),n()},t=>Ye(e,t.loaded,t.total))}),c},Dt=t=>{t.mixer=new e.AnimationMixer(t.scene),t.pointsClips=[],t.pointsActiveAction=null,t.pointsClips=t.animations},Ot=t=>{let n=new e.AnimationMixer(t.scene);t.mixer=n,t.heroClips=[],t.activeAction=null,t.animations.forEach(e=>{let r=n.clipAction(e);[`bangingFist`,`gangnam`,`robotDance`,`sitToStand`,`sitToType`,`standClap`,`golfDrive`,`walking`,`waving`,`castSpell`,`breakDance`].includes(e.name)?t.heroClips.push(e):e.name===`typing`?(t.heroClips.push(e),r.play(),t.activeAction=r):r.play()})}}));function At(e,t){Array.isArray(t)||(t=[t]),t.forEach(t=>{It[t]&&(e.uniforms[t]=It[t])})}function jt({scene:t,clock:n,raycaster:r,camera:i,domElement:a=window}){if(t&&t.globalUniformsHub)return t.globalUniformsHub;let o=new Map,s=e=>Object.fromEntries(Object.entries(e).map(([e,t])=>[e,{value:t}])),c={iTime:{value:0},iResolution:{value:new e.Vector2(window.innerWidth*window.devicePixelRatio,window.innerHeight*window.devicePixelRatio)},uMouse:{value:new e.Vector2(0,0)},iDate:{value:new e.Vector4},iChannel0:{value:V.noise},iChannelX:{value:V.blank},iChannelSprite:{value:V.spriteSheet},iChannelSpriteIcon:{value:V.spriteSheetIcon},uSpritePixels:{value:new e.Vector2(2048,1024)},uSpriteIconPixels:{value:new e.Vector2(512,256)},uSpriteSize:{value:new e.Vector2(4,8)},uSpriteIconSize:{value:new e.Vector2(4,8)},uGlowIntensity:{value:.05},uChannelAvatars:{value:V.avatarsCelShaded}},l={...c},u=()=>{l.iResolution.value.set(window.innerWidth*window.devicePixelRatio,window.innerHeight*window.devicePixelRatio)};window.addEventListener(`resize`,u);let d=e=>{let t=new Date,n=t.getFullYear(),r=t.getMonth(),i=t.getDate(),a=t.getHours()*3600+t.getMinutes()*60+t.getSeconds()+t.getMilliseconds()/1e3;e.set(n,r,i,a)};d(c.iDate.value);let f=0,p={core:{...c},uniforms:{...c},update(e=0,t=null){c.iTime.value+=e;let n=c.iTime.value;(!this._lastDateUpdate||n-this._lastDateUpdate>.5)&&(d(c.iDate.value),this._lastDateUpdate=n,this.uniforms.iChannel0.value=V.noise,this.uniforms.iChannelX.value=V.blank,this.core.iChannel0.value=V.noise,this.core.iChannelX.value=V.blank,this.uniforms.iChannelSprite&&V.spriteSheet&&(this.uniforms.iChannelSprite.value=V.spriteSheet),this.core.iChannelSprite&&V.spriteSheet&&(this.core.iChannelSprite.value=V.spriteSheet),this.uniforms.iChannelSpriteIcon&&V.spriteSheetIcon&&(this.uniforms.iChannelSpriteIcon.value=V.spriteSheetIcon),this.core.iChannelSpriteIcon&&V.spriteSheetIcon&&(this.core.iChannelSpriteIcon.value=V.spriteSheetIcon),this.uniforms.uChannelAvatars&&V.avatarsCelShaded&&(this.uniforms.uChannelAvatars.value=V.avatarsCelShaded),this.core.uChannelAvatars&&V.avatarsCelShaded&&(this.core.uChannelAvatars.value=V.avatarsCelShaded)),t&&c.uMouse.value.copy(t),this.uniforms.uNebulaRotationSpeed&&(this.uniforms.uNebulaRotation.value+=e*this.uniforms.uNebulaRotationSpeed.value),this.uniforms.uNebulaSwirlSpeed&&(this.uniforms.uNebulaSwirl.value+=e*this.uniforms.uNebulaSwirlSpeed.value),n-f>10&&(f=n)},registerFeature(e,t){o.set(e,t),this[e]=t,Object.assign(this.uniforms,t)},dispose(){window.removeEventListener(`resize`,u),o.clear(),t&&delete t.globalUniformsHub}},m=localStorage.getItem(`cv-view-mode-v3`)||`dev`;p.registerFeature(`displaySystem`,{uBSODState:{value:0},uPCBSODState:{value:0},uLaptopBSODState:{value:0},uIsPoba:{value:m===`poba`?1:0},uNetflixStartTime:{value:0},uBorderThickness:{value:.02},uCurrentSpeed:{value:5},uIconScale:{value:1}}),p.registerFeature(`environmental`,{uFireHeightOverride:{value:0},...s(Mt),...s(Ft)}),p.registerFeature(`lightning`,{isStriking:{value:!1},enableLightning:{value:!1},normalizedStrikePos:{value:new e.Vector2(-2,-2)}}),p.registerFeature(`glassWeather`,{rainGlassOpacity:{value:1},glassRainAmount:{value:1},uRimCenter:{value:new e.Vector2(-.5,.5)},uRainOffset:{value:0}}),p.registerFeature(`morphing`,{uTransformProgress:{value:0},uIsOscillating:{value:1},uOscillationStrength:{value:1}}),p.registerFeature(`fireflies`,{uMergeProgress:{value:0},uPointMergePos:{value:new e.Vector3(-.6,4.4,0)},uOverrideActive:{value:0},uOverrideRow:{value:0},uOverrideCol:{value:0},uSizeFactor:{value:0},uKamikazeScale:{value:0}}),p.registerFeature(`skyWeather`,{uRainHeaviness:{value:2},uStormSharpness:{value:0},uMoonPosition:{value:new e.Vector2(.58,.705)},uMoonSize:{value:.006},uMoonBrightness:{value:2.5},uMoonBlur:{value:0},uCraterScale:{value:.555},uCraterIntensity:{value:.28},uFarMountainOffset:{value:0},uNearMountainOffset:{value:-.5}}),p.registerFeature(`nebula`,{uNebulaRotation:{value:0},uNebulaRotationSpeed:{value:.3},uNebulaSwirl:{value:0},uNebulaSwirlSpeed:{value:.25}}),p.registerFeature(`gridSystem`,s(Nt));let h=new Proxy(p,{get(e,t){if(t in e)return e[t];if(e.uniforms&&t in e.uniforms)return e.uniforms[t]}});return t&&(t.globalUniformsHub=h),h}var Mt,Nt,Pt,Ft,It,Lt=M((()=>{pt(),kt(),Mt={uWaterIntensity:0},Nt={uWorldGridSize:40,uWorldGridThickness:.2,uWorldGridPulseSpeed:1,uWorldGridPulseDensity:5,uWorldGridProgress:0,uGroupGridProgress:0,uWorldGridActive:0,uGroupGridActive:0,uBorderColor:new e.Color(65535)},Pt={uSelectedSlot:new e.Vector2(3,1),uSpriteSize:new e.Vector2(4,8),uSpritePixels:new e.Vector2(2048,1024),uGlowIntensity:.05,uBorderThickness:.02,uCurrentSpeed:5,uIconScale:1},Ft={uWelcomeProgress:0,uWelcomeRotation:Math.PI/2,uWelcomePosition:new e.Vector2(4.9,.46),uWelcomeScale:1.65,uWelcomeScanline:1,uWelcomeOpacity:0,uWelcomeGlow:0},It={uIsPoba:{value:0}}}));function Rt(t,n,r,i,a=e.FrontSide,o=``){let s=new e.ShaderMaterial({uniforms:{outerGlowStrength:{type:`f`,value:n},outerGlowBorder:{type:`f`,value:r},p:{type:`f`,value:i},glowColor:{type:`c`,value:new e.Color(t)}},vertexShader:Jt,fragmentShader:Yt,side:a,blending:e.AdditiveBlending,transparent:!0,depthWrite:!1});return o&&o(),s}function zt(t,n,r,i=``){return i&&i(),new e.ShaderMaterial({uniforms:{glowColor:{value:new e.Color(t)},glowPower:{value:n},glowIntensity:{value:r}},vertexShader:Jt,fragmentShader:Xt,side:e.FrontSide,blending:e.AdditiveBlending,transparent:!0})}function Bt(t,n,r,i=``){return i&&i(),new e.ShaderMaterial({uniforms:{glowColor:{value:new e.Color(t)},glowPower:{value:n},glowIntensity:{value:r}},vertexShader:ln,fragmentShader:Xt,side:e.BackSide,blending:e.AdditiveBlending,transparent:!0})}function Vt(t,n,r,i=``){return i&&i(),new e.ShaderMaterial({uniforms:{glowColor:{value:new e.Color(t)},glowPower:{value:n},glowIntensity:{value:r},uprogress:{value:0},catchPoint:{value:new e.Vector3}},vertexShader:dn,fragmentShader:Xt,side:e.FrontSide,blending:e.AdditiveBlending,transparent:!0})}function Ht(t,n,r,i=1,a=1){return new e.ShaderMaterial({uniforms:{glowColor:{value:new e.Color(t)},glowPower:{value:n},glowIntensity:{value:r},iTime:{value:0},uOscillationStrength:{value:i},uIsOscillating:{value:a}},vertexShader:mn,fragmentShader:Xt,side:e.FrontSide,blending:e.AdditiveBlending,transparent:!0,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1})}function Ut(t,n,r,i,a=e.FrontSide,o=1){return new e.ShaderMaterial({uniforms:{outerGlowStrength:{type:`f`,value:n},outerGlowBorder:{type:`f`,value:r},p:{type:`f`,value:i},glowColor:{type:`c`,value:new e.Color(t)},iTime:{value:0},uOscillationStrength:{value:o},uIsOscillating:{value:1}},vertexShader:mn,fragmentShader:Yt,side:a,blending:e.AdditiveBlending,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})}function Wt(t,n,r,i=0,a=0){return new e.ShaderMaterial({uniforms:{glowColor:{value:new e.Color(t)},glowPower:{value:n},glowIntensity:{value:r},iTime:{value:0},uOscillationStrength:{value:i},uIsOscillating:{value:a},uTransformProgress:{value:0}},vertexShader:un,fragmentShader:Xt,side:e.FrontSide,blending:e.AdditiveBlending,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1})}function Gt(t,n,r,i,a=e.FrontSide,o=1){return new e.ShaderMaterial({uniforms:{outerGlowStrength:{type:`f`,value:n},outerGlowBorder:{type:`f`,value:r},p:{type:`f`,value:i},glowColor:{type:`c`,value:new e.Color(t)},iTime:{value:0},uOscillationStrength:{value:o},uIsOscillating:{value:1},uTransformProgress:{value:0}},vertexShader:un,fragmentShader:Yt,side:a,blending:e.AdditiveBlending,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})}function Kt(){let t=new e.ShaderMaterial({uniforms:{iTime:{value:0},iResolution:{value:new e.Vector2(100,100)},uOscillationStrength:{value:1},uIsOscillating:{value:1},uTransformProgress:{value:0}},vertexShader:un,fragmentShader:en,side:e.FrontSide,blending:e.AdditiveBlending,transparent:!0,depthWrite:!0});return At(t,[`iTime`,`iResolution`,`uTransformProgress`,`uIsOscillating`,`uOscillationStrength`]),t}function qt(t,n,r,i=1){return new e.ShaderMaterial({uniforms:{glowColor:{value:new e.Color(t)},innerlowPower:{value:n},glowIntensity:{value:r},iTime:{value:0},uOscillationStrength:{value:i},uIsOscillating:{value:0}},vertexShader:mn,fragmentShader:hn,side:e.FrontSide,blending:e.NormalBlending,transparent:!1,depthWrite:!0})}var Jt,Yt,Xt,Zt,Qt,$t,en,tn,nn,rn,an,on,sn,cn,ln,un,dn,fn,pn,mn,hn,gn,_n,vn,yn,bn,xn,Sn=M((()=>{Lt(),Jt=`
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        void main() 
        {
          vNormal = normalize( normalMatrix * normal ); // vNormals, the normals vectors of the object related to the world position (where it is in the global scene).
          
          vPositionNormal = normalize(( modelViewMatrix * vec4(position, 1.0) ).xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,Yt=`
        uniform vec3 glowColor;
        uniform float outerGlowBorder;
        uniform float p;
        uniform float outerGlowStrength;
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        void main() 
        {
          float a = pow( outerGlowBorder + outerGlowStrength * abs(dot(vNormal, vPositionNormal)), p );
          gl_FragColor = vec4( glowColor , a );
        }
        `,Xt=`
uniform vec3 glowColor;
uniform float glowIntensity;
uniform float glowPower;
varying vec3 vNormal;
varying vec3 vPositionNormal;

void main() 
{
    float fresnel = 1.0 - abs(dot(normalize(vNormal), normalize(vPositionNormal)));
    float a = smoothstep(0.0, 1.0, pow(fresnel, glowPower)) * glowIntensity;
    gl_FragColor = vec4( glowColor , a );
}
        `,Zt=`
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        varying vec3 vWorldPosition;
        
        attribute float aLayoutMode;
        varying float vLayoutMode;

        void main() 
        {
          vNormal = normalize( normalMatrix * normal ); // 
          vPositionNormal = normalize(( modelViewMatrix * vec4(position, 1.0) ).xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          gl_PointSize = 4.0;
          vUv = uv;
          vLayoutMode = aLayoutMode;

          vec4 worldPosition	= modelMatrix * vec4( position, 1.0 );
          vWorldPosition = worldPosition.xyz;

        }     
    `,Qt=`
        uniform float iTime;
        uniform float nebulaTwistFactor;
        #define uFrequency 5.0
        #define uAmplitude 0.2

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        varying vec3 vWorldPosition;

        void main() 
        {
            float pos = (position.x + position.z) * uFrequency;
            float waveValue = sin(pos + iTime);
            float offset = abs(waveValue) * uAmplitude;

            vec3 newPosition = position + vec3(1.0) * offset * 100.0*(0.8 + nebulaTwistFactor);

            vNormal = normalize( normalMatrix * normal ); 
            vPositionNormal = normalize(( modelViewMatrix * vec4(newPosition, 1.0) ).xyz);
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
            gl_PointSize = 4.0;
            vUv = uv;

            vec4 worldPosition = modelMatrix * vec4( newPosition, 1.0 );
            vWorldPosition = worldPosition.xyz;
        }     
    `,$t=`
    uniform float iTime;
    uniform vec2 uMouse; // x: -1.0 to 1.0 (Skew), y: -1.0 to 1.0 (Height)
    uniform vec2 uSmoothedMouse;
    uniform float uFireHeightOverride;
    
    varying vec2 vUv;

    // --- NOISE FUNCTIONS ---
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy; 
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857; 
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z); 
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_); 
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = inversesqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    // PRNG
    float prng(in vec2 seed) {
        seed = fract(seed * vec2(5.3983, 5.4427));
        seed += dot(seed.yx, seed.xy + vec2(21.5351, 14.3137));
        return fract(seed.x * seed.y * 95.4337);
    }

    const float PI = 3.1415926535897932384626433832795;

    float noiseStack(vec3 pos, int octaves, float falloff){
        float noise = snoise(vec3(pos));
        float off = 1.0;
        if (octaves > 1) {
            pos *= 2.0; off *= falloff;
            noise = (1.0-off)*noise + off*snoise(vec3(pos));
        }
        if (octaves > 2) {
            pos *= 2.0; off *= falloff;
            noise = (1.0-off)*noise + off*snoise(vec3(pos));
        }
        if (octaves > 3) {
            pos *= 2.0; off *= falloff;
            noise = (1.0-off)*noise + off*snoise(vec3(pos));
        }
        return (1.0+noise)/2.0;
    }

    vec2 noiseStackUV(vec3 pos, int octaves, float falloff, float diff){
        float displaceA = noiseStack(pos, octaves, falloff);
        float displaceB = noiseStack(pos+vec3(3984.293,423.21,5235.19), octaves, falloff);
        return vec2(displaceA,displaceB);
    }

    void main() {
        vec2 simulatedResolution = vec2(1000.0);
        vec2 fragCoord = vUv * simulatedResolution; 
        
        // --- 1. MOUSE CONTROLS ---
        
        // Create a mask: 0.0 if uFireHeightOverride is ~0.0, 1.0 otherwise
        float overrideMask = step(0.0001, uFireHeightOverride);
        
        // Calculate default height using Smoothed Mouse
        // Increased min value by 1.5x (from 1.5 to 2.25)
        float defaultHeight = (uSmoothedMouse.y * 2.0) + 2.25;
        
        // Mix between default and override based on the mask
        float remappedHeight = mix(defaultHeight, uFireHeightOverride, overrideMask);

        float safeHeight = max(0.00001, remappedHeight); 

        // Map uSmoothedMouse.x (-1.0 to 1.0) -> Lean Factor (directly -1.0 to 1.0)
        float leanFactor = uSmoothedMouse.x; 

        // --- 2. HEIGHT LOGIC ---
        // Reduced height by 5x (multiplied vUv.y by 5.0)
        float ypartClip = (vUv.y * 5.0) / (safeHeight * 0.5);
        float ypartClippedFalloff = clamp(2.0 - ypartClip, 0.0, 1.0);
        float ypartClipped = min(ypartClip, 1.0);
        float ypartClippedn = 1.0 - ypartClipped;

        // --- 3. FULL WIDTH FUEL ---
        float xfuel = pow(1.0 - abs(2.0 * vUv.x - 1.0), 0.5); 
        
        // --- 4. SKEW LOGIC ---
        // Apply skew: Shift X based on height (vUv.y) and leanFactor
        float skewedX = vUv.x - (leanFactor * vUv.y * 0.5);

        float smokeTime = 0.5 * iTime;
        // Double base speed (0.5 -> 1.0) and add height responsiveness
        float fireTime = iTime * (0.5 + safeHeight * 0.22); 

        vec2 coordScaled = 0.01 * fragCoord;
        
        // Use skewedX for position calculations
        vec3 position = vec3(coordScaled.x + leanFactor * 0.5, coordScaled.y, 0.0) + vec3(1223.0, 6434.0, 8425.0);
        
        vec3 flow = vec3(4.1 * (0.5 - skewedX) * pow(ypartClippedn, 4.0), -2.0 * xfuel * pow(ypartClippedn, 64.0), 0.0);
        vec3 timing = fireTime * vec3(0.0, -1.7, 1.1) + flow;
        vec3 smokeTiming = smokeTime * vec3(0.0, -1.7, 1.1) + flow;

        vec3 displacePos = vec3(1.0, 0.5, 1.0) * 2.4 * position + fireTime * vec3(0.01, -0.7, 1.3);
        vec3 displace3 = vec3(noiseStackUV(displacePos, 2, 0.4, 0.1), 0.0);

        vec3 noiseCoord = (vec3(2.0, 1.0, 1.0) * position + timing + 0.4 * displace3) / 1.0;
        float noise = noiseStack(noiseCoord, 3, 0.4);

        float flames = pow(ypartClipped, 0.3 * xfuel) * pow(noise, 0.3 * xfuel);

        float f = ypartClippedFalloff * pow(1.0 - flames * flames * flames, 8.0);
        float fff = f * f * f;
        vec3 fire = 1.5 * vec3(f, fff, fff * fff);

        // Smoke
        float smokeNoise = 0.5 + snoise(0.4 * position + smokeTiming * vec3(1.0, 1.0, 0.2)) / 2.0;
        vec3 smoke = vec3(0.3 * pow(xfuel, 3.0) * pow(vUv.y, 2.0) * (smokeNoise + 0.4 * (1.0 - noise)));

        // Sparks
        float sparkGridSize = 30.0;
        vec2 sparkCoord = fragCoord - vec2(0.0, 190.0 * fireTime);
        sparkCoord.x += leanFactor * 100.0 * vUv.y; // Wind effect on sparks
        
        sparkCoord -= 30.0 * noiseStackUV(0.01 * vec3(sparkCoord, 30.0 * fireTime), 1, 0.4, 0.1);
        sparkCoord += 100.0 * flow.xy;
        if (mod(sparkCoord.y / sparkGridSize, 2.0) < 1.0) sparkCoord.x += 0.5 * sparkGridSize;
        vec2 sparkGridIndex = vec2(floor(sparkCoord / sparkGridSize));
        float sparkRandom = prng(sparkGridIndex);
        float sparkLife = min(10.0 * (1.0 - min((sparkGridIndex.y + (190.0 * fireTime / sparkGridSize)) / (24.0 - 20.0 * sparkRandom), 1.0)), 1.0);
        vec3 sparks = vec3(0.0);
        if (sparkLife > 0.0) {
            float sparkSize = xfuel * xfuel * sparkRandom * 0.08;
            float sparkRadians = 999.0 * sparkRandom * 2.0 * PI + 2.0 * fireTime;
            vec2 sparkCircular = vec2(sin(sparkRadians), cos(sparkRadians));
            vec2 sparkOffset = (0.5 - sparkSize) * sparkGridSize * sparkCircular;
            vec2 sparkModulus = mod(sparkCoord + sparkOffset, sparkGridSize) - 0.5 * vec2(sparkGridSize);
            float sparkLength = length(sparkModulus);
            float sparksGray = max(0.0, 1.0 - sparkLength / (sparkSize * sparkGridSize));
            sparks = sparkLife * sparksGray * vec3(1.0, 0.3, 0.0);
        }

        gl_FragColor = vec4(max(fire, sparks) + smoke, 1.0);
    }
`,en=`
    uniform vec2 iResolution;
    uniform float iTime;

    varying vec2 vUv;

    void main() {
        // Reconstruct fragCoord so the original math works 1:1
        vec2 fragCoord = vUv * iResolution;

        // Original Shader Logic
        // Center and scale coordinates
        vec2 p = 5.0 * ((fragCoord.xy - 0.5 * iResolution.xy) / iResolution.y) - 0.5;
        
        vec2 i = p;
        float c = 0.0;
        
        // Calculate radius with time-based offset
        float r = length(p + vec2(sin(iTime), sin(iTime * 0.222 + 99.0)) * 1.5);
        float d = length(p);
        float rot = d + iTime + p.x * 0.15;
        
        // Loop for layering effects
        for (float n = 0.0; n < 4.0; n++) {
            // Apply rotation matrix
            p *= mat2(cos(rot - sin(iTime / 4.0)), sin(rot), 
                      -sin(cos(rot) - iTime), cos(rot)) * -0.15;
            
            float t = r - iTime / (n + 1.5);
            
            // Distort the iterator 'i'
            i -= p + vec2(cos(t - i.x - r) + sin(t + i.y), 
                          sin(t - i.y) + cos(t + i.x) + r);
            
            // Accumulate color intensity
            c += 1.0 / length(vec2((sin(i.x + t) / 0.15), (cos(i.y + t) / 0.15)));
        }
        
        c /= 4.0;
        
        // Output Color
        // Note: Changed alpha from 0.1 to 1.0 for visibility
        gl_FragColor = vec4(vec3(c) * vec3(4.3, 3.4, 0.1) - 0.35, 1.0);
    }
`,tn=`
    uniform float iTime;
    uniform vec2 iResolution;
    
    // We need the UV coordinates passed from the Vertex Shader
    varying vec2 vUv;

    // --- COMPATIBILITY DEFINES ---
    #define TIME        iTime
    #define RESOLUTION  iResolution
    #define PI          3.141592654
    #define TAU         (2.0*PI)

    // --- CONSTANTS ---
    const float gravity = 1.0;
    const float waterTension = 0.01;

    const vec3 skyCol1 = vec3(0.6, 0.35, 0.3).zyx * 0.5;
    const vec3 skyCol2 = vec3(1.0, 0.3, 0.3).zyx * 0.5;
    const vec3 sunCol1 = vec3(1.0, 0.5, 0.4).zyx;
    const vec3 sunCol2 = vec3(1.0, 0.8, 0.8).zyx;
    const vec3 seaCol1 = vec3(0.1, 0.2, 0.2) * 0.2;
    const vec3 seaCol2 = vec3(0.2, 0.9, 0.6) * 0.5;

    // --- HELPER FUNCTIONS ---

    float tanh_approx(float x) {
        float x2 = x * x;
        return clamp(x * (27.0 + x2) / (27.0 + 9.0 * x2), -1.0, 1.0);
    }

    vec2 wave(in float t, in float a, in float w, in float p) {
        float x = t;
        float y = a * sin(t * w + p);
        return vec2(x, y);
    }

    vec2 dwave(in float t, in float a, in float w, in float p) {
        float dx = 1.0;
        float dy = a * w * cos(t * w + p);
        return vec2(dx, dy);
    }

    vec2 gravityWave(in float t, in float a, in float k, in float h) {
        float w = sqrt(gravity * k * tanh_approx(k * h));
        return wave(t, a, k, w * TIME);
    }

    vec2 capillaryWave(in float t, in float a, in float k, in float h) {
        float w = sqrt((gravity * k + waterTension * k * k * k) * tanh_approx(k * h));
        return wave(t, a, k, w * TIME);
    }

    vec2 gravityWaveD(in float t, in float a, in float k, in float h) {
        float w = sqrt(gravity * k * tanh_approx(k * h));
        return dwave(t, a, k, w * TIME);
    }

    vec2 capillaryWaveD(in float t, in float a, in float k, in float h) {
        float w = sqrt((gravity * k + waterTension * k * k * k) * tanh_approx(k * h));
        return dwave(t, a, k, w * TIME);
    }

    void mrot(inout vec2 p, in float a) {
        float c = cos(a);
        float s = sin(a);
        p = vec2(c * p.x + s * p.y, -s * p.x + c * p.y);
    }

    vec4 sea(in vec2 p, in float ia) {
        float y = 0.0;
        vec3 d = vec3(0.0);

        const int maxIter = 8;
        const int midIter = 4;

        float kk = 1.0 / 1.3;
        float aa = 1.0 / (kk * kk);
        float k = 1.0 * pow(kk, -float(maxIter) + 1.0);
        float a = ia * 0.25 * pow(aa, -float(maxIter) + 1.0);

        float h = 25.0;
        p *= 0.5;

        vec2 waveDir = vec2(0.0, 1.0);

        for (int i = midIter; i < maxIter; ++i) {
            float t = dot(-waveDir, p) + float(i);
            y += capillaryWave(t, a, k, h).y;
            vec2 dw = capillaryWaveD(-t, a, k, h);

            d += vec3(waveDir.x, dw.y, waveDir.y);

            mrot(waveDir, PI / 3.0);

            k *= kk;
            a *= aa;
        }

        waveDir = vec2(0.0, 1.0);

        for (int i = 0; i < midIter; ++i) {
            float t = dot(waveDir, p) + float(i);
            y += gravityWave(t, a, k, h).y;
            vec2 dw = gravityWaveD(t, a, k, h);

            vec2 d2 = vec2(0.0, dw.x);

            d += vec3(waveDir.x, dw.y, waveDir.y);

            mrot(waveDir, -step(2.0, float(i)));

            k *= kk;
            a *= aa;
        }

        vec3 t = normalize(d);
        vec3 nxz = normalize(vec3(t.z, 0.0, -t.x));
        vec3 nor = cross(t, nxz);

        return vec4(y, nor);
    }

    vec3 sunDirection() {
        vec3 dir = normalize(vec3(0, 0.06, 1));
        return dir;
    }

    vec3 skyColor(in vec3 rd) {
        vec3 sunDir = sunDirection();
        float sunDot = max(dot(rd, sunDir), 0.0);
        vec3 final = vec3(0.0);
        final += mix(skyCol1, skyCol2, rd.y);
        final += 0.5 * sunCol1 * pow(sunDot, 90.0);
        final += 4.0 * sunCol2 * pow(sunDot, 900.0);
        return final;
    }

    vec3 render(in vec3 ro, in vec3 rd) {
        vec3 col = vec3(0.0);

        float dsea = (0.0 - ro.y) / rd.y;

        vec3 sunDir = sunDirection();

        vec3 sky = skyColor(rd);

        if (dsea > 0.0) {
            vec3 p = ro + dsea * rd;
            vec4 s = sea(p.xz, 1.0);
            float h = s.x;
            vec3 nor = s.yzw;
            nor = mix(nor, vec3(0.0, 1.0, 0.0), smoothstep(0.0, 200.0, dsea));

            float fre = clamp(1.0 - dot(-nor, rd), 0.0, 1.0);
            fre = fre * fre * fre;
            float dif = mix(0.25, 1.0, max(dot(nor, sunDir), 0.0));

            vec3 refl = skyColor(reflect(rd, nor));
            vec3 refr = seaCol1 + dif * sunCol1 * seaCol2 * 0.1;

            col = mix(refr, 0.9 * refl, fre);

            float atten = max(1.0 - dot(dsea, dsea) * 0.001, 0.0);
            col += seaCol2 * (p.y - h) * 2.0 * atten;

            col = mix(col, sky, 1.0 - exp(-0.01 * dsea));

        } else {
            col = sky;
        }

        return col;
    }

    void main() {
        // --- FIX: USE vUv INSTEAD OF gl_FragCoord ---
        // vUv typically goes from (0,0) to (1,1) across the mesh surface.
        
        vec2 q = vUv; 
        vec2 p = -1.0 + 2.0 * q;
        
        // Use aspect ratio to ensure waves aren't squashed if the mesh isn't square.
        // Make sure iResolution matches your MESH dimensions, not screen dimensions.
        // If you want it to just fill the space regardless of distortion, remove this line:
        p.x *= iResolution.x / iResolution.y;

        vec3 ro = vec3(0.0, 10.0, 0.0);
        vec3 ww = normalize(vec3(0.0, -0.1, 1.0));
        vec3 uu = normalize(cross(vec3(0.0, 1.0, 0.0), ww));
        vec3 vv = normalize(cross(ww, uu));
        vec3 rd = normalize(p.x * uu + p.y * vv + 2.5 * ww);

        vec3 col = render(ro, rd);
        
        vec2 vUV = vUv * (1.0 - vUv.yx);
        float vig = vUV.x * vUV.y * 15.0; 
        vig = pow(vig, 0.15);

        gl_FragColor = vec4(col * vig, 1.0);
    }
`,nn=`
    uniform vec2 iResolution;
    uniform float iTime;
    uniform float uBSODState; // 0.0 = Normal, 1.0 = BSOD
    uniform float uNetflixStartTime;
    
    varying vec2 vUv;

// --- PALETTE ---
#define C_BSOD    vec3(0.0, 0.47, 0.84) // Windows Blue

    // --- UTILS ---
    float hash21(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
}

#define rot(x) mat2(cos(x), -sin(x), sin(x), cos(x))

void main() {
        vec2 fragCoord = vUv * iResolution;
        vec2 uv = vUv;
        float aspect = iResolution.x / iResolution.y;

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

        vec2 R = iResolution.xy;
        vec2 p = (fragCoord.xy + fragCoord.xy - R) / R.y;

        // Pre-calculate time-based animation
        float t = (0.5 + 0.5 * -cos((iTime - uNetflixStartTime) * 1.7)) * 3.0;
        vec2 s = vec2(0.125, 0.75);
        float px_pos = float(p.x >= 0.0);

        // Optimized d0 calculation
        float level0 = (clamp(t - 2.0 * px_pos, -0.05, 1.0) * 2.0 - 1.0) * s.y;
        float d0 = max(abs(abs(p.x) - s.x * 2.0) - s.x, p.y - level0);

    // Constant geometry values
    const float r = 2.8;
    const float dx = 0.375; // s.x * 3.0
    const float dy = 0.75;  // s.y
    const float geom_offset = 3.5147; // s.y + sqrt(r*r - dx*dx)

    // Angle and Rotation optimization
    const float angle = 1.8925; 
        float w = s.x * sin(angle);
        vec2 p0 = rot(angle) * p;

        // Distance fields
        float d1 = max(abs(p0.y) - w, -(p.y + s.y * ((t - 1.0) * 2.0 - 1.0)));
        float d2 = length(p + vec2(0.0, geom_offset)) - r;

        // Combining masks
        vec2 bounds = abs(p.y) - vec2(s.y);
    d0 = max(max(d0, bounds.x), -d2);
    d1 = max(max(d1, bounds.x), -d2);

        // Shading and Output
        // IMPROVED: Use fragment derivatives (fwidth) for scale-independent antialiasing
        float edgeD1 = fwidth(d1);
        float edgeD0 = fwidth(d0);

        vec4 colRed = vec4(1.0, 0.0, 0.0, 1.0);
        vec4 colBg = vec4(0.0, 0.0, 0.0, 1.0);
        vec4 colGlow = vec4(0.6 - 0.5 * exp(-22.0 * max(d1, 0.0)) * (1.0 - pow(abs(p0.x), 1.25)), 0.0, 0.0, 1.0);
        
        vec4 O = mix(colBg, colGlow, smoothstep(edgeD0, 0.0, d0));
    O = mix(O, colRed, smoothstep(edgeD1, 0.0, d1));

    O.rgb = sqrt(O.rgb); // Gamma correction
    gl_FragColor = O;
}
`,rn=`
    uniform float iTime;
    uniform vec2 iResolution;
    
    varying vec2 vUv;

// --- CONSTANTS & CONFIG ---
const float PI = 3.14159265;
const float MAX_RAYMARCH_DIST = 150.0;
const float MIN_RAYMARCH_DELTA = 0.00015;
const float GRADIENT_DELTA = 0.015;

    // Global wave parameters (will be modified in main)
    float waveHeight1 = 0.005;
    float waveHeight2 = 0.004;
    float waveHeight3 = 0.001;

    // --- SIMPLEX NOISE FUNCTIONS ---
    // Description : Array and textureless GLSL 2D simplex noise function.
    // Author : Ian McEwan, Ashima Arts.

    vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

    vec2 mod289(vec2 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

    vec3 permute(vec3 x) {
    return mod289(((x * 34.0) + 1.0) * x);
}

    float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
        -0.577350269189626,  // -1.0 + 2.0 * C.x
        0.024390243902439); // 1.0 / 41.0
        // First corner
        vec2 i = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);

        // Other corners
        vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

    // Permutations
    i = mod289(i); 
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
        + i.x + vec3(0.0, i1.x, 1.0));

        vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;

        // Gradients
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;

    // Normalise gradients
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

        // Compute final noise value at P
        vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

    // --- RAYMARCHING LOGIC ---

    float map(vec3 p) {
    return p.y + (0.5 + waveHeight1 + waveHeight2 + waveHeight3)
        + snoise(vec2(p.x + iTime * 0.4, p.z + iTime * 0.6)) * waveHeight1
        + snoise(vec2(p.x * 1.6 - iTime * 0.4, p.z * 1.7 - iTime * 0.6)) * waveHeight2
        + snoise(vec2(p.x * 6.6 - iTime * 1.0, p.z * 2.7 + iTime * 1.176)) * waveHeight3;
}

    vec3 gradientNormalFast(vec3 p, float map_p) {
    return normalize(vec3(
        map_p - map(p - vec3(GRADIENT_DELTA, 0, 0)),
        map_p - map(p - vec3(0, GRADIENT_DELTA, 0)),
        map_p - map(p - vec3(0, 0, GRADIENT_DELTA))));
}

    float intersect(vec3 p, vec3 ray_dir, out float map_p, out int iterations) {
    iterations = 0;
    if (ray_dir.y >= 0.0) { return -1.0; } // Looking up at sky, no sea intersection
        
        float distMin = (- 0.5 - p.y) / ray_dir.y;
        float distMid = distMin;
    for (int i = 0; i < 50; i++) {
        distMid += max(0.05 + float(i) * 0.002, map_p);
        map_p = map(p + ray_dir * distMid);
        if (map_p > 0.0) {
            distMin = distMid + map_p;
        } else { 
                float distMax = distMid + map_p;
            // interval found, now bisect inside it
            for (int i = 0; i < 10; i++) {
                distMid = distMin + (distMax - distMin) / 2.0;
                map_p = map(p + ray_dir * distMid);
                if (abs(map_p) < MIN_RAYMARCH_DELTA) return distMid;
                if (map_p > 0.0) {
                    distMin = distMid + map_p;
                } else {
                    distMax = distMid + map_p;
                }
            }
            return distMid;
        }
    }
    return distMin;
}

void main() {
        // --- ANIMATION PARAMETERS ---
        // Originally controlled by mouse, now fully automatic
        float waveHeight = cos(iTime * 0.03) * 1.2 + 1.6;
    waveHeight1 *= waveHeight;
    waveHeight2 *= waveHeight;
    waveHeight3 *= waveHeight;

        // --- COORDINATE SETUP (vUv Fix) ---
        // Convert vUv (0..1) to centered coordinates (-0.5..0.5)
        vec2 position = vUv - 0.5;
    // Correct aspect ratio
    position.x *= iResolution.x / iResolution.y;

        // --- RAY SETUP ---
        vec3 ray_start = vec3(0, 0.2, -2);
        vec3 ray_dir = normalize(vec3(position, 0.0) - ray_start);
    ray_start.y = cos(iTime * 0.5) * 0.2 - 0.25 + sin(iTime * 2.0) * 0.05;

    // --- LIGHTING & SUN ---
    const float dayspeed = 0.04;
        float subtime = max(-0.16, sin(iTime * dayspeed) * 0.2);
        float middayperc = max(0.0, sin(subtime));
        
        vec3 light1_pos = vec3(0.0, middayperc * 200.0, cos(subtime * dayspeed) * 200.0);
        float sunperc = pow(max(0.0, min(dot(ray_dir, normalize(light1_pos)), 1.0)), 190.0 + max(0.0, light1_pos.y * 4.3));
        
        vec3 suncolor = (1.0 - max(0.0, middayperc)) * vec3(1.5, 1.2, middayperc + 0.5) + max(0.0, middayperc) * vec3(1.0, 1.0, 1.0) * 4.0;
        vec3 skycolor = vec3(middayperc + 0.8, middayperc + 0.7, middayperc + 0.5);
        vec3 skycolor_now = suncolor * sunperc + (skycolor * (middayperc * 1.6 + 0.5)) * (1.0 - sunperc);
        
        vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
        float map_p;
        int iterations;

        // --- RENDER ---
        float dist = intersect(ray_start, ray_dir, map_p, iterations);

    if (dist > 0.0) {
            vec3 p = ray_start + ray_dir * dist;
            vec3 light1_dir = normalize(light1_pos - p);
            vec3 n = gradientNormalFast(p, map_p);
            vec3 ambient = skycolor_now * 0.1;
            vec3 diffuse1 = vec3(1.1, 1.1, 0.6) * max(0.0, dot(light1_dir, n) * 2.8);
            vec3 r = reflect(light1_dir, n);
            vec3 specular1 = vec3(1.5, 1.2, 0.6) * (0.8 * pow(max(0.0, dot(r, ray_dir)), 200.0));     
            float fog = min(max(p.z * 0.07, 0.0), 1.0);
        color.rgb = (vec3(0.6, 0.6, 1.0) * diffuse1 + specular1 + ambient) * (1.0 - fog) + skycolor_now * fog;
    } else {
        color.rgb = skycolor_now.rgb;
    }

    gl_FragColor = color;
}
`,an=`
    uniform float iTime;
    uniform vec2 iResolution;
    uniform vec4 iDate; 
    uniform vec2 uMouse; 
    uniform float uBSODState; // 0.0 = Normal, 1.0 = BSOD
    
    varying vec2 vUv;

// --- CLOCK CONSTANTS ---
#define TWELVE_HOUR_CLOCK   0
#define GLOWPULSE    1
#define SECONDS      1

const float pi = 3.14159265359;
const float tau = 6.28318530718;
const float scale = 1.0 / 6.0;

    vec2 digitSize = vec2(1.0, 1.5) * scale;
    vec2 digitSpacing = vec2(1.1, 1.6) * scale;

// --- FIREWORKS CONSTANTS ---
#define PARTICLES_MIN 15.
#define PARTICLES_MAX 60.
#define NUM_ROCKETS 3.
#define duration 2.2
const float ExT = 1. / 4.;

    // --- HELPERS ---
    vec2 hash21(float p) {
        vec3 p3 = fract(vec3(p) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx + p3.yz) * p3.zy);
}
    float hash21(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
}

    vec3 hash31(float p) {
        vec3 p2 = fract(p * vec3(5.3983, 5.4427, 6.9371));
    p2 += dot(p2.zxy, p2.xyz + vec3(21.5351, 14.3137, 15.3219));
    return fract(vec3(p2.x * p2.y * 95.4337, p2.y * p2.z * 97.597, p2.z * p2.x * 93.8365));
}

    vec2 dir(float id){
        vec2 h = hash21(id);
    h.y *= 2. * acos(-1.);
    return h.x * vec2(cos(h.y), sin(h.y));
}

    // --- CLOCK HELPERS ---
    float hash12(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

    float noise(vec2 pos) {
        vec2 i = floor(pos);
        vec2 f = fract(pos);
        float a = hash12(i);
        float b = hash12(i + vec2(1, 0));
        float c = hash12(i + vec2(0, 1));
        float d = hash12(i + vec2(1, 1));
        vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

    // --- CLOCK SDFs ---
    float dfLine(vec2 start, vec2 end, vec2 uv) {
    start *= scale; end *= scale;
        vec2 line = end - start;
        float frac = dot(uv - start, line) / dot(line, line);
    return distance(start + line * clamp(frac, 0.0, 1.0), uv);
}

    float dfCircle(vec2 origin, float radius, vec2 uv) {
    origin *= scale; radius *= scale;
    return abs(length(uv - origin) - radius);
}

    float dfArc(vec2 origin, float start, float sweep, float radius, vec2 uv) {
    origin *= scale; radius *= scale;
    uv -= origin;
    uv *= mat2(cos(start), sin(start), -sin(start), cos(start));
        float offs = (sweep / 2.0 - pi);
        float ang = mod(atan(uv.y, uv.x) - offs, tau) + offs;
    ang = clamp(ang, min(0.0, sweep), max(0.0, sweep));
    return distance(radius * vec2(cos(ang), sin(ang)), uv);
}

    float dfDigit(vec2 origin, float d, vec2 uv) {
    uv -= origin; d = floor(d); float dist = 1e6;
    if (d == 0.0) {
        dist = min(dist, dfLine(vec2(1., 1.), vec2(1., 0.5), uv));
        dist = min(dist, dfLine(vec2(0., 1.), vec2(0., 0.5), uv));
        dist = min(dist, dfArc(vec2(0.5, 1.), 0., 3.142, 0.5, uv));
        dist = min(dist, dfArc(vec2(0.5, 0.5), 3.142, 3.142, 0.5, uv));
    }
    else if (d == 1.0) { dist = min(dist, dfLine(vec2(0.5, 1.5), vec2(0.5, 0.), uv)); }
    else if (d == 2.0) {
        dist = min(dist, dfLine(vec2(1., 0.), vec2(0., 0.), uv));
        dist = min(dist, dfLine(vec2(0.388, 0.561), vec2(0.806, 0.719), uv));
        dist = min(dist, dfArc(vec2(0.5, 1.), 0., 3.142, 0.5, uv));
        dist = min(dist, dfArc(vec2(0.7, 1.), 5.074, 1.209, 0.3, uv));
        dist = min(dist, dfArc(vec2(0.6, 0.), 1.932, 1.209, 0.6, uv));
    }
    else if (d == 3.0) {
        dist = min(dist, dfLine(vec2(0., 1.5), vec2(1., 1.5), uv));
        dist = min(dist, dfLine(vec2(1., 1.5), vec2(0.5, 1.), uv));
        dist = min(dist, dfArc(vec2(0.5, 0.5), 3.142, 4.712, 0.5, uv));
    }
    else if (d == 4.0) {
        dist = min(dist, dfLine(vec2(0.7, 1.5), vec2(0., 0.5), uv));
        dist = min(dist, dfLine(vec2(0., 0.5), vec2(1., 0.5), uv));
        dist = min(dist, dfLine(vec2(0.7, 1.2), vec2(0.7, 0.), uv));
    }
    else if (d == 5.0) {
        dist = min(dist, dfLine(vec2(1., 1.5), vec2(0.3, 1.5), uv));
        dist = min(dist, dfLine(vec2(0.3, 1.5), vec2(0.2, 0.9), uv));
        dist = min(dist, dfArc(vec2(0.5, 0.5), 3.142, 5.356, 0.5, uv));
    }
    else if (d == 6.0) {
        dist = min(dist, dfLine(vec2(0.067, 0.75), vec2(0.5, 1.5), uv));
        dist = min(dist, dfCircle(vec2(0.5, 0.5), 0.5, uv));
    }
    else if (d == 7.0) {
        dist = min(dist, dfLine(vec2(0., 1.5), vec2(1., 1.5), uv));
        dist = min(dist, dfLine(vec2(1., 1.5), vec2(0.5, 0.), uv));
    }
    else if (d == 8.0) {
        dist = min(dist, dfCircle(vec2(0.5, 0.4), 0.4, uv));
        dist = min(dist, dfCircle(vec2(0.5, 1.15), 0.35, uv));
    }
    else if (d == 9.0) {
        dist = min(dist, dfLine(vec2(0.933, 0.75), vec2(0.5, 0.), uv));
        dist = min(dist, dfCircle(vec2(0.5, 1.), 0.5, uv));
    }
    return dist;
}

    float dfNumberInt(vec2 origin, int inum, vec2 uv) {
        float num = float(inum);
    uv -= origin;
        float dist = 1e6;
        float offs = 0.0;
    for (float i = 1.0; i >= 0.0; i--) {
            float d = mod(num / pow(10.0, i), 10.0);
            vec2 pos = digitSpacing * vec2(offs, 0.0);
        dist = min(dist, dfDigit(pos, d, uv));
        offs++;
    }
    return dist;
}

    float dfColon(vec2 origin, vec2 uv) {
    uv -= origin;
        float dist = 1e6; float offs = 0.0;
    dist = min(dist, dfCircle(vec2(offs + 0.9, 0.9) * 1.1, 0.04, uv));
    dist = min(dist, dfCircle(vec2(offs + 0.9, 0.4) * 1.1, 0.04, uv));
    return dist;
}

    float numberLength(float n) {
    return floor(max(log(n) / log(10.0), 0.0) + 1.0) + 2.0;
}

    // --- REFACTORED: CLOCK DISTANCE CALCULATOR ---
    // Returns distance to the clock at position uv
    float getClockDist(vec2 uv) {
        int hour = int(iDate.w / 3600.);
    #if TWELVE_HOUR_CLOCK
    if (hour > 12) hour -= 12;
    if (hour == 0) hour = 12;
    #endif
        int minute = int(mod(iDate.w / 60., 60.));
        
        float nsize = numberLength(999999.);
        vec2 pos = -digitSpacing * vec2(nsize, 1.0) / 2.0;
        
        float dist = 1e6;
    pos.x += 0.02;
    dist = min(dist, dfNumberInt(pos, hour, uv));
    pos.x += 0.27;
    dist = min(dist, dfColon(pos, uv));
    pos.x += 0.27;
    dist = min(dist, dfNumberInt(pos, minute, uv));

    #ifdef SECONDS
        int seconds = int(mod(iDate.w, 60.));
    pos.x += 0.27;
    dist = min(dist, dfColon(pos, uv));
    pos.x += 0.27;
    dist = min(dist, dfNumberInt(pos, seconds, uv));
    #endif

    return dist;
}

    // --- FIREWORKS LOGIC ---
    float bang(vec2 uv, float t, float id){
        float o = 0.;
    if (t <= 0.) return .04 / dot(uv, uv);
        float s = (sqrt(t) + t * exp2(-t / .125) * .8) * 10.;
        float brightness = sqrt(1. - t) * .015 * (step(.0001, t) * .9 + .1);
        float blinkI = exp2(-t / .125);
        float PARTICLES = PARTICLES_MIN + (PARTICLES_MAX - PARTICLES_MIN) * fract(cos(id) * 45241.45);
    for (float i = 0.; i < PARTICLES_MAX; i++) {
        if (i >= PARTICLES) break;
            vec2 d = dir(i + .012 * id);
            vec2 p = d * s;
            vec2 h = hash21(5.33345 * i + .015 * id);
            float blink = mix(cos((t + h.x) * 10. * (2. + h.y) + h.x * h.y * 10.) * .3 + .7, 1., blinkI);
        o += blink * brightness / dot(uv - p, uv - p);
    }
    return o;
}

    float firework(vec2 uv, float t, float id){
    if (id < 1.) return 0.;
        vec2 h = hash21(id * 5.645) * 2. - 1.;
        vec2 offset = vec2(h.x * .1, 0.);
    h.y = h.y * .95; h.y *= abs(h.y);
        vec2 di = vec2(h.y, sqrt(1. - h.y * h.y));
        float thrust = sqrt(min(t, ExT) / ExT) * 25.;
        vec2 p = offset + duration * (di * thrust + vec2(0., -9.81) * t) * t;
    return sqrt(1. - t) * bang(uv - p, max(0., (t - ExT) / (1. - ExT)), id);
}

// --- MAIN ---
void main() {
    // --- BSOD OVERRIDE ---
    if (uBSODState > 0.5) {
            vec3 col = vec3(0.0, 0.47, 0.84); // Windows Blue (C_BSOD)

            // Standard UV logic
            vec2 uv = vUv;
            // Center UVs for drawing shapes
            vec2 p = uv - vec2(0.5);
        // Aspect correction (Assume 16:9 like standard monitor)
        p.x *= 1.77;

            // Sad Face :(
            vec2 faceCenter = vec2(-0.3, 0.2); 
            vec2 fp = p - faceCenter;

            // Eyes
            float dEyes = min(length(fp - vec2(-0.05, 0.05)), length(fp - vec2(0.05, 0.05)));
            float eyes = smoothstep(0.015, 0.01, dEyes);

            // Mouth (Arc)
            vec2 m = fp - vec2(0.0, -0.08);
            float dMouthFunc = length(m) - 0.06;
            // Crop bottom half to make arc
            float mouth = smoothstep(0.01, 0.005, abs(dMouthFunc)) * step(0.0, m.y);

        col = mix(col, vec3(1.0), eyes + mouth);

            // Text Lines (Abstract)
            // Left aligned text block logic
            vec2 txtUV = uv;
        if (txtUV.x > 0.1 && txtUV.x < 0.6 && txtUV.y < 0.55 && txtUV.y > 0.5) {
            col = vec3(1.0);
        }
        if (txtUV.x > 0.1 && txtUV.x < 0.8 && txtUV.y < 0.45 && txtUV.y > 0.2) {
                 float row = floor(txtUV.y * 20.0);
            if (mod(row, 2.0) == 0.0) {
                      float lineLen = hash21(vec2(row, 1.0)) * 0.7 + 0.1;
                if ((txtUV.x - 0.1) < lineLen) col = vec3(1.0);
            }
        }

            // QRCode
            vec2 qrUV = p - vec2(0.5, 0.2); // Bottom right-ish
        if (abs(qrUV.x) < 0.1 && abs(qrUV.y) < 0.1) {
                float qrNoise = step(0.5, hash21(floor(qrUV * 50.0)));
            col = mix(col, vec3(1.0), qrNoise);
        }

        gl_FragColor = vec4(col, 1.0);
        return;
    }

        // --- STANDARD FIREWORK RENDER ---
        // Convert vUv (0..1) to centered coords (-1..1) for rendering logic
        vec2 uv = -1.0 + 2.0 * vUv;
    // Aspect correction: assume standard landscape texture or pass uniform
    uv.x *= 1.77;

    // Shift rendering to center horizon at vUv.y = 0.5
    uv.y -= 0.0;
    uv *= 35.0; // Scale world
        
        vec3 col = vec3(.01, .011, .015) * 0.0;
        
        float time = .75 * iTime;
        float t = time / duration;
        float m = 1.0;

    // --- 1. WATER & BACKGROUND ---
    if (uv.y < 0.0) {
        const float h0 = 5.0;
        const float dcam = 1000.5;
            float y = uv.y - h0;
            float z = dcam * h0 / y;
            float x = uv.x * z / dcam;

            // Water distortion
            vec2 distort = vec2(sin((x * 1.5 + z * .75) * .0005 - t * 1.5), cos((z * 2. - x * .5) * .0005 - t * 2.69));
        distort *= (sin(x * .07 + z * .09 + sin(x * .2 - t) - t * 15.) + cos(z * .1 - x * (.08 + .001 * sin(x * .01 - t)) - t * 16.) * .7 + cos(z * .01 + x * .004 - t * 10.) * 1.7);
        distort *= .15 * dcam / z;

        uv += distort;
            
            float ndv = -uv.y / sqrt(dcam * dcam + uv.y * uv.y);
        m = mix(1.0, .98, pow(1.0 - ndv, 5.0));
        uv.y = -uv.y;
    }

    col += (exp2(-abs(uv.y) * vec3(1., 2., 3.) - .5) + exp2(-abs(uv.y) * vec3(1., .2, .1) - 4.)) * .5;
        // Move island hump to the right: peak centered at x = 45
        float targetX = uv.x - 45.0;
    if (uv.y * 1.5 < (targetX + 25.0) * .015 * (25.0 - targetX) + sin(uv.x) * cos(uv.y * 1.1) * .75) col *= 0.;

    // --- ROCKETS (With Interaction) ---
    for (float i = 0.; i < ceil(NUM_ROCKETS); i++) {
            float T = 1.0 + t + i / NUM_ROCKETS; 
            float id = floor(T) - i / NUM_ROCKETS;
            vec3 rocketCol = hash31(id * .75645);
        rocketCol /= max(rocketCol.r, max(rocketCol.g, rocketCol.b));
            
            vec2 h = hash21(id * 5.645) * 2.0 - 1.0;
            vec2 offset = vec2(h.x * .1, 0.0);

        if (i == 0.0 && uMouse.x > 0.0) {
            offset.x = (uMouse.x - 0.5) * 3.5;
        }

        h.y = h.y * .95; h.y *= abs(h.y);
            vec2 di = vec2(h.y, sqrt(1.0 - h.y * h.y));
            float thrust = sqrt(min(fract(T), ExT) / ExT) * 25.0;
            vec2 p = offset + duration * (di * thrust + vec2(0.0, -9.81) * fract(T)) * fract(T);

        col += sqrt(1.0 - fract(T)) * bang(uv - p, max(0.0, (fract(T) - ExT) / (1.0 - ExT)), id) * rocketCol;
    }
        
        vec3 bgCol = m * col;

        // --- 2. FOREGROUND CLOCK SETUP ---
        vec2 clockUV = (vUv - 0.5) * vec2(1.77, 1.0);
    clockUV *= 1.1; // Scale factor
    clockUV.y -= 0.25; // Base height of sky clock

        // --- 3. MAIN CLOCK (SKY) ---
        vec3 clockCol = vec3(0);
        float dist = getClockDist(clockUV);
        float shade = 0.004 / dist;
        
        vec3 digitCol = vec3(1, 0.2, 0) * shade;
    #if GLOWPULSE
    digitCol *= noise((clockUV + vec2(iTime * .5)) * 2.5 + .5);
    #endif
    clockCol += digitCol;

    // --- 4. REFLECTION CLOCK (WATER) ---
    if (vUv.y < 0.5) {
            // Symmetry around vUv.y = 0.5
            float distFromHorizon = 0.5 - vUv.y;
            vec2 reflUV = (vec2(vUv.x, 0.5 + distFromHorizon) - 0.5) * vec2(1.77, 1.0);
        reflUV *= 1.1;
        reflUV.y -= 0.25;

        reflUV.x += sin(reflUV.y * 10.0 + iTime * 2.0) * 0.02;
            
            float distRefl = getClockDist(reflUV);
            float shadeRefl = 0.004 / distRefl;
            
            vec3 reflColor = vec3(1.0, 0.4, 0.2) * shadeRefl * 0.4;
        reflColor *= exp(-distFromHorizon * 8.0); // Natural fade

        clockCol += reflColor;
    }

        // --- COMPOSITE ---
        vec3 finalCol = bgCol + clockCol;
    finalCol = pow(finalCol, vec3(1.0 / 2.2));

    gl_FragColor = vec4(finalCol, 1.0);
}
`,on=`

uniform float iTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform float nebulaCoreRadius; // scale
uniform float uNebulaRotation;  // Integrated rotation control
uniform float uNebulaSwirl;     // Integrated swirl control


varying vec2 vUv;
vec2 uMouse = vec2(0.);

//SHADER HERE
// Fork of "Supernova remnant" by Duke
// https://www.shadertoy.com/view/MdKXzc
//-------------------------------------------------------------------------------------
// Based on "Dusty nebula 4" (https://www.shadertoy.com/view/MsVXWW)
// and "Protoplanetary disk" (https://www.shadertoy.com/view/MdtGRl)
// otaviogood's "Alien Beacon" (https://www.shadertoy.com/view/ld2SzK)
// and Shane's "Cheap Cloud Flythrough" (https://www.shadertoy.com/view/Xsc3R4) shaders
// Some ideas came from other shaders from this wonderful site
// Press 1-2-3 to zoom in and zoom out.
// License: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License
//-------------------------------------------------------------------------------------


//-------------------
#define pi 3.14159265
#define R(p, a) p = cos(a) * p + sin(a) * vec2(p.y, -p.x)

// iq's noise
float noise( in vec3 x)
{
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    vec2 uv = (p.xy + vec2(37.0, 17.0) * p.z) + f.xy;
    vec2 rg = textureLod(iChannel0, (uv + 0.5) / 256.0, 0.0).yx;
    return 1. - 0.82 * mix(rg.x, rg.y, f.z);
}



float fbm(vec3 p)
{
    //    return noise(p*.06125)*.5 + noise(p*.125)*.25 + noise(p*.25)*.125 + noise(p*.4)*.2;
    // return noise(p*.06125)*.5 + noise(p*.125)*.25; //for better performance
    return noise(p * 0.09f) * 0.75f; ////for better performance with minimal quality reduction
}

float length2(vec2 p)
{
    return sqrt(p.x * p.x + p.y * p.y);
}

float length8(vec2 p)
{
    p = p * p; p = p * p; p = p * p;
    return pow(p.x + p.y, 1.0 / 8.0);
}


float Disk(vec3 p, vec3 t)
{
    vec2 q = vec2(length2(p.xy) - t.x, p.z * 0.5);
    return max(length8(q) - t.y, abs(p.z) - t.z);
}

//==============================================================
// otaviogood's noise from https://www.shadertoy.com/view/ld2SzK
//--------------------------------------------------------------
// This spiral noise works by successively adding and rotating sin waves while increasing frequency.
// It should work the same on all computers since it's not based on a hash function like some other noises.
// It can be much faster than other noise functions if you're ok with some repetition.
const float nudge = 0.9;    // size of perpendicular vector
float normalizer = 1.0 / sqrt(1.0 + nudge * nudge);   // pythagorean theorem on that perpendicular to maintain scale
float SpiralNoiseC(vec3 p)
{
    float n = 0.0;  // noise amount
    float iter = 2.0;
    for (int i = 0; i < 4; i++)
    {
        // add sin and cos scaled inverse with the frequency
        n += -abs(sin(p.y * iter) + cos(p.x * iter)) / iter;    // abs for a ridged look
        // rotate by adding perpendicular and scaling down
        p.xy += vec2(p.y, -p.x) * nudge;
        p.xy *= normalizer;
        // rotate on other axis
        p.xz += vec2(p.z, -p.x) * nudge;
        p.xz *= normalizer;
        // increase the frequency
        iter *= 1.733733;
    }
    return n;
}

float NebulaNoise(vec3 p)
{
    float final = Disk(p.xzy, vec3(2.0, 1.8, 1.25));
    final += fbm(p * 90.);
    final += SpiralNoiseC(p.zxy * 0.5123 + 100.0 + uNebulaSwirl) * 3.0;

    return final;
}

float map(vec3 p)
{
    R(p.yx, uMouse.x * 0.008 * pi + uNebulaRotation);  //Integrated rotation math

    float NebNoise = abs(NebulaNoise(p / 0.5) * 0.5);

    return NebNoise + 0.07;
}
//--------------------------------------------------------------

// assign color to the media
vec3 computeColor(float density, float radius)
{
    // color based on density alone, gives impression of occlusion within
    // the media
    // CHANGE: Softer, deeper tones for density (Dark Teal & Bronze)
    vec3 result = mix(vec3(0.0, 0.05, 0.08), vec3(0.05, 0.03, 0.0), density);

    // color added to the media
    // CHANGE: Center is soft Cyan, Edge is pale Gold (Subtle & Artistic)
    vec3 colCenter = 5.0 * vec3(0.3, 0.8, 1.0).rgb; // Softened Cyan
    vec3 colEdge = 1.0 * vec3(1.0, 0.7, 0.4).rgb;   // Pastel Gold
    result *= mix(colCenter, colEdge, min((radius + .05) / .9, 1.15));

    return result;
}

bool RaySphereIntersect(vec3 org, vec3 dir, out float near, out float far)
{
    float b = dot(dir, org);
    float c = dot(org, org) - 8.;
    float delta = b * b - c;
    if (delta < 0.0)
        return false;
    float deltasqrt = sqrt(delta);
    near = -b - deltasqrt;
    far = -b + deltasqrt;
    return far > 0.0;
}

// Applies the filmic curve from John Hable's presentation
// More details at : http://filmicgames.com/archives/75
vec3 ToneMapFilmicALU(vec3 _color)
{
    _color = max(vec3(0), _color - vec3(0.004));
    _color = (_color * (6.2 * _color + vec3(0.5))) / (_color * (6.2 * _color + vec3(1.7)) + vec3(0.06));
    return _color;
}

void main()
{


    // ro: ray origin
    // rd: direction of the ray
    vec3 rd = normalize(vec3(-1. + 2. * vUv, 1.2));
    vec3 ro = vec3(0., 0., -6.);

    // ld, td: local, total density
    // w: weighting factor
    float ld = 0., td = 0., w = 0.;

    // t: length of the ray
    // d: distance function
    float d = 1., t = 0.;

    const float h = 0.1;

    vec4 sum = vec4(0.0);

    float min_dist = 0.0, max_dist = 0.0;

    if (RaySphereIntersect(ro, rd, min_dist, max_dist)) {

        t = min_dist * step(t, min_dist);

        // raymarch loop
        for (int i = 0; i < 64; i++)
        {

        vec3 pos = ro + t * rd;

            // Loop break conditions.
            if (td > 0.9 || d < 0.1 * t || t > 10. || sum.a > 0.99 || t > max_dist) break;

        // evaluate distance function
        float d = map(pos);

            // change this string to control density
            d = max(d, 0.0);

        // point light calculations
        vec3 ldst = vec3(0.0) - pos;
        float lDist = max(length(ldst), 0.001);

        // the color of light
        float _T = lDist * 2.3 + 2.6; // <-v endless tweaking
        //_T -= iTime*0.5;
        // CHANGE: Subtle oscillation between Cool White and Warm White
        vec3 lightColor = vec3(0.5) + 0.4 * vec3(
                cos(_T + pi * 0.0),
                cos(_T + pi * 0.2), // Closer phases for white-ish blend
                cos(_T + pi * 0.4)
            );
            // Removed heavy saturation boost

            // CHANGE: Central star is soft, bright Cyan-White
            sum.rgb += (vec3(0.6, 0.9, 1.0) / (lDist * lDist * 6.) / nebulaCoreRadius); // star itself
            sum.rgb += (lightColor / exp(lDist * lDist * lDist * .08) / 30.); // bloom

            if (d < h) {
                // compute local density
                ld = h - d;

                // compute weighting factor
                w = (1. - td) * ld;

                // accumulate density
                td += w + 1. / 200.;

            vec4 col = vec4(computeColor(td, lDist), td);

                // emission
                sum += sum.a * vec4(sum.rgb, 0.0) * 0.2;

                // uniform scale density
                col.a *= 0.25;
                // colour by alpha
                col.rgb *= col.a;
                // alpha blend in contribution
                sum = sum + col * (1.0 - sum.a);

            }

            td += 1. / 70.;



            // trying to optimize step size near the camera and near the light source
            // t += max(d * 0.1 * max(min(length(ldst),length(ro)),1.0), 0.01);
            t += max(d * 0.1 * max(min(length(ldst), length(ro)), 1.0), 0.02);

        }

        // simple scattering
        sum *= 1. / exp(ld * 0.2) * 0.6;

        sum = clamp(sum, 0.0, 1.0);

        sum.xyz = sum.xyz * sum.xyz * (3.0 - 2.0 * sum.xyz);

    }

    gl_FragColor = vec4(sum.xyz, 1.0);


}
`,sn=`
  uniform float iTime;
  uniform bool isStriking;
  uniform vec2 normalizedStrikePos;
  
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  uniform float uRainHeaviness;
  uniform float uStormSharpness;

  // --- MOON UNIFORMS ---
  uniform vec2 uMoonPosition;
  uniform float uMoonSize;
  uniform float uMoonBrightness;
  uniform float uMoonBlur;
  uniform float uCraterScale;
  uniform float uCraterIntensity;
  uniform float uFarMountainOffset;
  uniform float uNearMountainOffset;
  uniform vec2 iResolution;

  // --- NOISE & RANDOM FUNCTIONS ---
  float rand(float x) {
    return fract(sin(x) * 75154.32912);
}

  vec2 rand2(vec2 p) {
    return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

  float rand3d(vec3 x) {
    return fract(375.10297 * sin(dot(x, vec3(103.0139, 227.0595, 31.05914))));
}

  float noise(float x) {
      float i = floor(x);
      float a = rand(i), b = rand(i + 1.);
      float f = x - i;
    return mix(a, b, f);
}

  float perlin(float x) {
      float r = 0., s = 1., w = 1.;
    for (int i = 0; i < 2; i++) { // OPTIMIZATION: Reduced from 3 to 2
        s *= 2.0;
        w *= 0.5;
        r += w * noise(s * x);
    }
    return r;
}

  float noise3d(vec3 x) {
      vec3 i = floor(x);
      float i000 = rand3d(i + vec3(0., 0., 0.)), i001 = rand3d(i + vec3(0., 0., 1.));
      float i010 = rand3d(i + vec3(0., 1., 0.)), i011 = rand3d(i + vec3(0., 1., 1.));
      float i100 = rand3d(i + vec3(1., 0., 0.)), i101 = rand3d(i + vec3(1., 0., 1.));
      float i110 = rand3d(i + vec3(1., 1., 0.)), i111 = rand3d(i + vec3(1., 1., 1.));
      vec3 f = x - i;
    return mix(mix(mix(i000, i001, f.z), mix(i010, i011, f.z), f.y),
        mix(mix(i100, i101, f.z), mix(i110, i111, f.z), f.y), f.x);
}

  float perlin3d(vec3 x) {
      float r = 0.0;
      float w = 1.0, s = 1.0;
    // OPTIMIZATION: Reduced from 2 to 1. 3D noise is very expensive.
    w *= 0.5;
    s *= 2.0;
    r += w * noise3d(s * x);
    
    return r;
}

  // Helper to generate 2D-like noise using 3D perlin (slice at z=0.5)
  float moonSurfaceNoise(vec2 uv, float scale) {
    return perlin3d(vec3(uv * scale, 0.5));
}

  // --- OBJECT/EFFECT FUNCTIONS ---

  float f(float y) {
      float w = 0.25; 
      float primary_path = perlin(2.0 * y);
      float forking_detail = perlin(20.0 * y) * 0.1;
    return w * (primary_path + forking_detail - 0.5);
}

  float plot(vec2 p, float d, bool thicker) {
    if (thicker) d += 2. * abs(f(p.y + 0.001) - f(p.y));
    return smoothstep(d, 0., abs(f(p.y) - p.x));
}

  float cloud(vec2 uv, float speed, float scale, float cover) {
      float c = perlin3d(vec3(uv * scale, iTime * speed * 2.));
    return max(0., c - (1. - cover));
}

  float mountain(vec2 uv, float scale, float offset, float h1, float h2) {
      float h = h1 + perlin(scale * uv.x + offset) * (h2 - h1);
    return smoothstep(h, h + 0.01, uv.y);
}

  float rain_layer(vec2 uv, float time_mult, vec2 density, float slant, float streak_length) {
      float time = iTime * time_mult;
      vec2 motion = vec2(slant, 1.0);
      vec2 uv_moved = uv + motion * time;

      vec2 grid_id = floor(uv_moved * density);
      float random_val = rand(grid_id.x + grid_id.y * 19.19);

      vec2 grid_uv = fract(uv_moved * density);

      float drop_y = fract(grid_uv.y + random_val);
      float drop_x = rand(grid_id.y + grid_id.x * 29.29);
      float dist_x = abs(grid_uv.x - drop_x);

      float line = smoothstep(0.04, 0.0, dist_x);
      float streak = line * smoothstep(streak_length, 0.0, drop_y);

    return streak;
}
      
  float getWhiteCoreWidth(float x) {
    const float MIN_WIDTH = 0.0003;
    const float MAX_WIDTH = 0.0015;
    const float CONSTANT_END_POINT = 0.37;
    const float DECAY_RATE_K = 15000.0;

    if (x <= CONSTANT_END_POINT) {
        return MAX_WIDTH;
    }

    const float DECAY_RANGE = MAX_WIDTH - MIN_WIDTH;
        float distance = x - CONSTANT_END_POINT;
        float decayFactor = exp(-DECAY_RATE_K * distance);

    return MIN_WIDTH + DECAY_RANGE * decayFactor;
}

  // --- RENDER FUNCTION ---
  vec3 render(vec2 uv) {
    uv.x += 0.12; // Offset scene to the left (adjusted from 0.2 per user request)
      vec3 lightning = vec3(0.0);
      float light = 0.;

    // --- LIGHTNING LOGIC ---
    if (isStriking) {
          float i = floor(iTime * 10.0);
          vec2 uv2 = uv;
        uv2.y += i * 2.;

          // Input normalizedStrikePos.x is ALREADY in -1..1 range (calculated in JS as 2*localPoint)
          // So we just need to add the scene offset (0.12) to match uv2.x
          float p = normalizedStrikePos.x + 0.12;
        uv2.x -= p;
          
          float whiteCoreWidth = getWhiteCoreWidth(normalizedStrikePos.y);
          float strike = plot(uv2, whiteCoreWidth, false) * 2.0;
          float glow = plot(uv2, 0.04, false) * 0.2;

          vec3 strike_color = vec3(1.0, 1.0, 1.0);
          vec3 glow_color = vec3(0.3, 0.5, 1.0);

          vec3 colored_lightning = strike_color * strike + glow_color * glow;
          
          float h = normalizedStrikePos.y;
        colored_lightning *= smoothstep(h, h + 0.05, uv.y + perlin(1.2 * uv.x + 4. * h) * 0.03);

        light = smoothstep(6., 0., abs(uv.x - p)) * 1.5;
        lightning = colored_lightning;
    }

      vec3 sky = vec3(0.05, 0.08, 0.22); // brighter night sky per user request



      // ==========================================
      // === REALISTIC PROCEDURAL MOON RENDERING ===
      // ==========================================

      vec2 moonPos = -1.0 + 2.0 * uMoonPosition;

      // --- CORRECTING DISTORTION (Ray-Sphere Intersection) ---
      // We derive the Moon's 3D direction from its 2D position on the Sky Plane without using simple 2D distance.
      // This ensures it looks like a perfect sphere regardless of camera angle.
      
      vec3 viewDir = normalize(vWorldPosition - cameraPosition);

      // Sky Plane Parameters (approximate)
      vec3 planeCenter = vec3(-55.0, -20.0, 30.0);
      float planeScale = 150.0;

      // Calculate World Position of the Moon center based on UVs
      vec3 moonWorldPos = planeCenter + vec3((uMoonPosition.x - 0.5) * planeScale, (uMoonPosition.y - 0.5) * planeScale, 0.0);
      vec3 moonDir = normalize(moonWorldPos - cameraPosition);

      // Use Angular Distance (Perfect Circle)
      float moonDot = dot(viewDir, moonDir);
      float moonAngle = acos(clamp(moonDot, -1.0, 1.0));

      // Adjusted scale to match previous "beautiful" look preference
      // The user tuned uMoonSize for the 2D version (factor 4.0).
      // We keep this factor for the Radius calculation to maintain relative visual size logic.
      float moonRadiusRad = uMoonSize * 4.0;

      // 3. Moon Body Mask
      float moonBody = smoothstep(moonRadiusRad, moonRadiusRad - uMoonBlur, moonAngle);

      vec3 finalMoonLayer = vec3(0.0);

    if (moonBody > 0.001) {
          // 4. Billboard Projection for Texture
          vec3 moonRight = normalize(cross(vec3(0.0, 1.0, 0.0), moonDir));
          vec3 moonUp = normalize(cross(moonDir, moonRight));
          
          vec2 localUV = vec2(dot(viewDir, moonRight), dot(viewDir, moonUp));

          // Restore Linear UV Mapping (dividing by radius directly)
          // This restores the "Zoom" level of the craters to what the user liked.
          vec2 moonUV = localUV / moonRadiusRad;
          
          float distSq = dot(moonUV, moonUV);

        if (distSq < 1.0) {
              // 5. Procedural Textures
              // Layer A: Maria (Seas)
              float mariaNoise = moonSurfaceNoise(moonUV, 2.5); 
              float maria = smoothstep(0.3, 0.8, mariaNoise);

              // Layer B: Craters
              float craterNoise = moonSurfaceNoise(moonUV, uCraterScale);
              float craterShape = smoothstep(0.45, 0.55, craterNoise);

              // Combine Textures
              float surfaceBrightness = 1.0;
            surfaceBrightness -= maria * 0.3;
            surfaceBrightness *= mix(1.0, 0.4, craterShape * uCraterIntensity);

              // 6. Color & Lighting
              vec3 icyBlueTint = vec3(0.75, 0.9, 1.0);

              // Soft spherical, but mostly flat to keep detail visible
              float sphereShade = sqrt(1.0 - distSq);
            surfaceBrightness *= (0.9 + 0.1 * sphereShade);

              // Boosted brightness multiplier for the moon body per user request
              vec3 moonColor = icyBlueTint * uMoonBrightness * surfaceBrightness * 2.5;

            finalMoonLayer = moonColor * moonBody;
        }
    }

      // 7. Moon Aura (Glow)
      // Exponential decay starting exactly at the edge
      float distFromEdge = max(0.0, moonAngle - moonRadiusRad);
      // Slower decay for a larger, clearer glow (was -20.0)
      float glowDecay = exp(-12.0 * distFromEdge);

      // Mask: strictly 0 inside the moon (distFromEdge is 0, but we want to be sure)
      // effectively, aura adds on top of the background, but should not wash out the moon body.
      // We use a smoothstep mask slightly outside the radius to blend it clean.
      float auraMask = smoothstep(moonRadiusRad - uMoonBlur, moonRadiusRad, moonAngle);

      // Reverted to clearer light blue-ish tone (less cyan, more white-blue)
      // Linear scaling with brightness but dampened factor (0.5) to scale "a little bit"
      vec3 auraColor = vec3(0.4, 0.6, 1.0) * uMoonBrightness * 0.5;
      vec3 auraLayer = auraColor * glowDecay * auraMask;

    // Composite Moon + Aura (Moved after clouds to ensure visibility)
    // sky += finalMoonLayer + auraLayer; // Originally here

    // ==========================================

    // Composite Moon + Aura (Before Clouds so they cover it)
    sky = finalMoonLayer + sky * (1.0 - moonBody) + auraLayer;

      // --- CLOUDS ---
      // Modified: Faster (shorter cover time) and gapier (contrast) per user request
      float c1_density = cloud(uv, 0.25, 0.1, 0.65); 
      float c2_density = cloud(uv * vec2(0.5, 1.), 0.10, 0.8, 0.60);
      float c3_density = cloud(uv * vec2(0.1, 1.), 0.15, 5.5, 0.55);

      vec3 cloud_base_color = vec3(0.5, 0.6, 0.7); // darker base for contrast
      vec3 cloud_highlight_color = vec3(1.0, 1.0, 1.0); // pure white highlights

      // Use the densities to mix between base and highlight
      vec3 cloud_color = mix(cloud_base_color, cloud_highlight_color, c1_density);

    // Add contribution from other layers
    cloud_color += (vec3(0.9) * c2_density * 0.5) + (vec3(1.0) * c3_density * 0.3);

      float total_cloud_density = c1_density + c2_density + c3_density;

      // Wider transition range allows for soft, partial coverage
      // But we boost the density slightly to make sure it's not too transparent
      float cloud_alpha = smoothstep(0.1, 0.9, total_cloud_density * 1.2);

    sky = mix(sky, cloud_color, cloud_alpha);

      // Re-add moon on top of clouds (Alpha Blend to block clouds behind it)
      // sky = finalMoonLayer + sky * (1.0 - moonBody) + auraLayer; // Moved up

      // --- MOUNTAINS ---
      // Modified: Using Uniforms for X offset
      float far_mountain_mask = mountain(uv + vec2(uFarMountainOffset, 0.0), 1.21, 9., 0.3, 0.6);
      float mid_mountain_mask = mountain(uv + vec2(uNearMountainOffset, 0.0), 1.83, 3., 0.25, 0.5);

      vec3 terrain_color_far = 1. * vec3(0.15, 0.2, 0.3);
      vec3 terrain_color_close = vec3(0.25, 0.3, 0.3) * 0.5;

      vec3 background = sky;
    background = mix(terrain_color_far, background, far_mountain_mask);
    background = mix(terrain_color_close, background, mid_mountain_mask);

    background *= (0.2 + light * 0.03);

      vec3 scene_color = background + lightning;

      // --- RAIN ---
      float density_mult = mix(100.0, 400.0, uRainHeaviness);
      vec2 rain_density = vec2(density_mult * 1.0, density_mult * 0.75);

      float rain_amount = rain_layer(uv, 1.5, rain_density, 1.0, 0.15);
    rain_amount = clamp(rain_amount, 0.0, 1.0);

      vec3 rain_color = vec3(0.7, 0.8, 1.0) * (0.74 + light * 2.0);
      
      vec3 final_color = mix(scene_color, rain_color, rain_amount * uRainHeaviness);

    return final_color;
}

void main() {
      vec2 uv = -1. + 2. * vUv;
      
      vec3 finalColor = render(uv);
    // uStormSharpness = 0 => all black, uStormSharpness = 1 => normal render
    finalColor *= uStormSharpness;

    gl_FragColor = vec4(finalColor, 1.0);
}
`,cn=`

uniform float iTime;
uniform vec2 iResolution;
uniform float rainGlassOpacity;
uniform float glassRainAmount;
varying vec2 vUv;
vec2 uMouse = vec2(0.);

// TOGGLES & RANDOMNESS
uniform bool hasRimOnGlass; 
uniform float uRainOffset; // Allows different rain patterns per plane
uniform vec2 uRimCenter;

uniform sampler2D iChannelX;

// ==================================================
// HELPER FUNCTIONS (Noise & Math)
// ==================================================

float hash(vec2 p)  { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

float noise(vec2 x) {
    vec2 i = floor(x);
    vec2 f = fract(x);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

#define S(a, b, t) smoothstep(a, b, t)

vec3 N13(float p) {
    vec3 p3 = fract(vec3(p) * vec3(.1031, .11369, .13787));
    p3 += dot(p3, p3.yzx + 19.19);
    return fract(vec3((p3.x + p3.y) * p3.z, (p3.x + p3.z) * p3.y, (p3.y + p3.z) * p3.x));
}

vec4 N14(float t) {
    return fract(sin(t * vec4(123., 1024., 1456., 264.)) * vec4(6547., 345., 8799., 1564.));
}

float N(float t) {
    return fract(sin(t * 12345.564) * 7658.76);
}

float Saw(float b, float t) {
    return S(0., b, t) * S(1., b, t);
}

vec2 DropLayer2(vec2 uv, float t) {
    vec2 UV = uv;

    uv.y += t * 0.75;
    vec2 a = vec2(6., 1.);
    vec2 grid = a * 2.;
    vec2 id = floor(uv * grid);
    
    float colShift = N(id.x);
    uv.y += colShift;

    id = floor(uv * grid);
    vec3 n = N13(id.x * 35.2 + id.y * 2376.1);
    vec2 st = fract(uv * grid) - vec2(.5, 0);
    
    float x = n.x - .5;
    
    float y = UV.y * 20.;
    float wiggle = sin(y + sin(y));
    x += wiggle * (.5 - abs(x)) * (n.z - .5);
    x *= .7;
    float ti = fract(t + n.z);
    y = (Saw(.85, ti) - .5) * .9 + .5;
    vec2 p = vec2(x, y);
    
    float d = length((st - p) * a.yx);
    
    float mainDrop = S(0.3, .0, d);
    
    float r = sqrt(S(1., y, st.y));
    float cd = abs(st.x - x);
    float trail = S(.23 * r, .15 * r * r, cd);
    float trailFront = S(-.02, .02, st.y - y);
    trail *= trailFront * r * r;

    y = UV.y;
    float trail2 = S(.2 * r, .0, cd);
    float droplets = max(0., (sin(y * (1. - y) * 120.) - st.y)) * trail2 * trailFront * n.z;
    y = fract(y * 10.) + (st.y - .5);
    float dd = length(st - vec2(x, y));
    droplets = S(.2, 0., dd);
    float m = mainDrop + droplets * r * trailFront;

    return vec2(m, trail);
}

float StaticDrops(vec2 uv, float t) {
    uv *= 20.;
    
    vec2 id = floor(uv);
    uv = fract(uv) - .0;
    vec3 n = N13(id.x * 107.45 + id.y * 3543.654);
    vec2 p = (n.xy - .5) * .7;
    float d = length(uv - p);
    
    float fade = Saw(.025, fract(t + n.z));
    float c = S(.3, 0., d) * fract(n.z * 10.) * fade;
    return c;
}

vec2 Drops(vec2 uv, float t, float l0, float l1, float l2) {
    float s = StaticDrops(uv, t) * l0; 
    vec2 m1 = DropLayer2(uv, t) * l1;
    vec2 m2 = DropLayer2(uv * 1.85, t) * l2;
    
    float c = s + m1.x + m2.x;
    c = S(.3, 1., c);

    return vec2(c, max(m1.y * l0, m2.y * l1));
}

// ==================================================
// MAIN SHADER LOOP
// ==================================================

void main()
{
    // 1. APPLY RANDOM OFFSET (Only for rain drops)
    // We create a separate UV for rain so shifting it doesn't move the dry spot.
    vec2 rainUv = vUv + vec2(uRainOffset * 20.0, uRainOffset * 10.0);

    vec2 uv = -1. + 2. * rainUv;
    vec2 UV = rainUv; // Use randomized UV
    
    vec3 M = vec3(0.);
    float T = 100.0 + iTime + M.y * 2.;
    
    float t = T * 0.16;
    // float glassRainAmount = 1.0;
    float maxBlur = mix(1.0, 30.0, glassRainAmount);
    float minBlur = 0.5;
    float zoom = 3.15;

    uv *= .7 + zoom * .3;
    UV = (UV - .5) * (.9 + zoom * .1) + .5;
    
    float staticDrops = S(-.5, 1., glassRainAmount) * 0.5;
    float layer1 = S(.25, .75, glassRainAmount);
    float layer2 = S(.0, .5, glassRainAmount);

    // Calculate Standard Rain Drops
    vec2 c = Drops(uv, t, staticDrops, layer1, layer2);

    // --------------------------------------------------
    // DRY SPOT & RIM LOGIC
    // --------------------------------------------------

    // Default values (used if hasRimOnGlass is false)
    float rainMask = 1.0;  // 1.0 = visible rain
    float rimFactor = 0.0; // 0.0 = no rim highlight

    if (hasRimOnGlass) {
        // IMPORTANT: Use original 'vUv' here, not 'rainUv'
        // This ensures the hole stays in the center regardless of randomness
        vec2 centerPos = vUv - uRimCenter;

        // Aspect Ratio Fix (Adjust if plane dimensions change)
        float planeAspect = 0.75;
        centerPos.x *= planeAspect; 
        
        float centerDist = length(centerPos);

        // --- SETTINGS (Scaled up 1.5x) ---
        float spotRadius = 0.075; // Size of hole
        float noiseScale = 3.5;   // Spikiness
        float noiseStrength = 0.05; // Depth of spikes
        
        float organicNoise = noise(normalize(centerPos) * noiseScale + iTime * 0.5);
        float distortedDist = centerDist + organicNoise * noiseStrength;

        float rimWidth = 0.06; // Thickness of rim

        rimFactor = S(spotRadius + rimWidth, spotRadius, distortedDist);
        float edgeSoftness = 0.02;

        // Calculate the mask (0.0 inside hole, 1.0 outside)
        rainMask = S(spotRadius, spotRadius + edgeSoftness, distortedDist);
    }

    // --------------------------------------------------
    // COMBINE LAYERS
    // --------------------------------------------------

    // Generate dense rim drops (Double layer technique)
    float extra1 = StaticDrops(uv + vec2(0.3, 0.25), t);
    float extra2 = StaticDrops(uv * 1.1 + vec2(0.0, 0.0), t);

    // Multiply by rimFactor (will be 0.0 if hasRimOnGlass is false)
    float denseRim = (extra1 + extra2) * rimFactor * 2.0;

    // Add rim drops to the main drop channel
    c.x = max(c.x, denseRim);

    // Cut the hole in the rain layer
    c *= rainMask;

    // --------------------------------------------------
    // NORMAL CALCULATION (For neighbors)
    // --------------------------------------------------
    vec2 e = vec2(.001, 0.);

    // Neighbor 1
    vec2 c1 = Drops(uv + e, t, staticDrops, layer1, layer2);
    float e1_1 = StaticDrops(uv + e + vec2(0.3, 0.25), t);
    float e1_2 = StaticDrops((uv + e) * 1.1 + vec2(0.0, 0.0), t);
    float r1 = (e1_1 + e1_2) * rimFactor * 2.0;
    c1.x = max(c1.x, r1);
    float cx = c1.x * rainMask;

    // Neighbor 2
    vec2 c2 = Drops(uv + e.yx, t, staticDrops, layer1, layer2);
    float e2_1 = StaticDrops(uv + e.yx + vec2(0.3, 0.25), t);
    float e2_2 = StaticDrops((uv + e.yx) * 1.1 + vec2(0.0, 0.0), t);
    float r2 = (e2_1 + e2_2) * rimFactor * 2.0;
    c2.x = max(c2.x, r2);
    float cy = c2.x * rainMask;

    vec2 n = vec2(cx - c.x, cy - c.x);

    // --------------------------------------------------
    // FINAL COMPOSITION
    // --------------------------------------------------

    // Calculate Blur
    float focus = mix(maxBlur - c.y, minBlur, S(.1, .2, c.x));

    // Ensure the dry spot is crystal clear (0 blur)
    focus *= rainMask;

    // Sample the background texture
    vec3 col = textureLod(iChannelX, UV + n, focus).rgb;

    // Shading
    col *= 1.0 - c.x * 0.15; // Darken drops
    float highlight = max(0.0, normalize(n).y);
    col += pow(highlight, 20.0) * 0.5; // Add specularity

    col *= 1.0 - c.y * 0.3; // Trail visibility

    // Add subtle whitish highlight to the rim
    col += vec3(0.15) * rimFactor * rainMask;

    gl_FragColor = vec4(col, rainGlassOpacity);
}
`,ln=`
    varying vec3 vNormal;
    varying vec3 vPositionNormal;

#include <common>
    #include <skinning_pars_vertex>

    void main()
{
    // This chunk is essential. It reads the bone texture and defines
    // the boneMatX, boneMatY, etc. variables. It must come first.
    #include <skinbase_vertex>

        // These chunks use boneMatX/Y/Z/W to calculate the skinned normal.
        #include <beginnormal_vertex>
        #include <skinnormal_vertex>
        #include <defaultnormal_vertex>

        // These chunks calculate the vertex position after skinning.
        #include <begin_vertex>
        #include <skinning_vertex>
        #include <project_vertex>

        // Now that the built-in chunks have calculated everything,
        // we can safely assign the results to our varyings.
        vNormal = normalize(transformedNormal);
    vPositionNormal = normalize(mvPosition.xyz);
}
`,un=`
// ==========================================
// 1. SIMPLEX NOISE FUNCTIONS (Keep these at the top)
// ==========================================
vec4 permute(vec4 x){ return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){
    const vec2  C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

    // Permutations
    i = mod(i, 289.0); 
  vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  // Gradients
  float n_ = 1.0 / 7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z); 

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_); 

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// ==========================================
// 2. MAIN SHADER LOGIC
// ==========================================

uniform float iTime;
uniform float uTransformProgress; // 0.0 to 1.0

attribute vec3 targetPosition;
attribute vec3 targetNormal;
uniform float uOscillationStrength;
uniform float uIsOscillating;


varying vec2 vUv;
varying vec3 vNormal; // Pass to fragment shader for lighting
varying vec3 vPositionNormal;
varying float vNoise;

void main() {
    vUv = uv;

    // A. INTERPOLATION (Morphing)
    // ------------------------------------------------
    // Mix position and normal linearly first
    vec3 mixedPosition = mix(position, targetPosition, uTransformProgress);
    vec3 mixedNormal = normalize(mix(normal, targetNormal, uTransformProgress));

    // B. LIQUID INTENSITY (The Bell Curve)
    // ------------------------------------------------
    // Starts at 0, goes to 1.0 at 50%, ends at 0
    float liquidIntensity = sin(uTransformProgress * 3.14159);

    // C. CALCULATE OSCILLATION (Fluid Effect)
    // ------------------------------------------------
    float time = iTime * 0.8;

    // Noise Layer 1: Base shape blob
    // Note: We use mixedPosition so the noise moves with the object
    float noise1 = snoise(mixedPosition * 0.8 + vec3(time));

    // Noise Layer 2: Smaller ripples
    float noise2 = snoise(mixedPosition * 2.5 - vec3(time * 1.5));

    // Combine noise
    // We multiply by liquidIntensity so the effect is 0 at start/end
    // float displacement = ((noise1 * 0.5) + (noise2 * 0.2)) * (liquidIntensity + (uOscillationStrength * uIsOscillating));
  float displacement = ((noise1 * 0.3) + (noise2 * 0.1)) * uOscillationStrength * uIsOscillating;

    // D. APPLY
    // ------------------------------------------------
    // Move the vertex outward along its normal
    vec3 finalPos = mixedPosition + (mixedNormal * displacement);
    vNoise = noise1;

    vNormal = normalize(normalMatrix * mixedNormal); // Update normal for fragment shader
    vPositionNormal = normalize((modelViewMatrix * vec4(finalPos, 1.0)).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
}
`,dn=`
varying vec3 vNormal;
varying vec3 vPositionNormal;

uniform vec3 catchPoint; // Target point for the catching effect
uniform float uprogress; // Progress for animation control (0.0 to 1.0)

#include <common>
    #include <skinning_pars_vertex>

    // Simple pseudo-random function based on vertex position
    float rand(vec3 pos) {
    return fract(sin(dot(pos, vec3(12.9898, 78.233, 45.5432))) * 43758.5453);
}

void main()
{
    // Essential skinning setup
    #include <skinbase_vertex>

        // Calculate skinned normal
        #include <beginnormal_vertex>
        #include <skinnormal_vertex>
        #include <defaultnormal_vertex>

        // Calculate skinned vertex position
        #include <begin_vertex>
        #include <skinning_vertex>

        vec3 skinnedPosition = transformed;

    // --- MODIFICATION START ---

    // 1. Convert the local skinned position to a world position
    vec4 worldPosition = modelMatrix * vec4(skinnedPosition, 1.0);

    // Calculate interpolation factor (this logic is unchanged)
    float speedVariation = 0.65 + rand(skinnedPosition) * 1.0;
    float t = clamp(uprogress * speedVariation, 0.0, 1.0);

    // 2. Linearly interpolate in WORLD SPACE
    vec3 newWorldPosition = mix(worldPosition.xyz, catchPoint, t);

    // 3. Convert the new world position back to model space for the projection
    transformed = (inverse(modelMatrix) * vec4(newWorldPosition, 1.0)).xyz;

    // --- MODIFICATION END ---

    // Apply projection after modifying the position
    #include <project_vertex>

        // Assign varyings for fragment shader
        vNormal = normalize(transformedNormal);
    vPositionNormal = normalize(mvPosition.xyz);
}
`,fn=zt(`#FBC189`,1,1),fn.name=`goldInner`,fn.clone(),pn=Rt(`#FBC189`,1,.01,6.5,e.FrontSide),pn.name=`goldOuter`,mn=`
// Simplex 3D Noise 
// by Ian McEwan, Ashima Arts
vec4 permute(vec4 x){ return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){
    const vec2  C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  //  x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

    // Permutations
    i = mod(i, 289.0); 
  vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0 / 7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);    // mod(j,N)

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1),
        dot(p2, x2), dot(p3, x3)));
}


    uniform float iTime;
    uniform float uOscillationStrength;
    uniform float uIsOscillating;
    varying vec3 vNormal;
    varying vec3 vPositionNormal;

void main() {
    vNormal = normalize(normalMatrix * normal);

        // Fluid / Liquid Droplet Effect using Noise
        float time = iTime * 0.8; // Control speed

        // Base shape distortion (low frequency)
        float noise1 = snoise(position * 0.8 + vec3(time));

        // Detail distortion (higher frequency)
        float noise2 = snoise(position * 2.5 - vec3(time * 1.5));

        // Combine them
        float displacement = ((noise1 * 0.3) + (noise2 * 0.1)) * uOscillationStrength * uIsOscillating;

        // Apply to position along the normal
        vec3 newPos = position + normal * displacement;

    vPositionNormal = normalize((modelViewMatrix * vec4(newPos, 1.0)).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
}
`,Kt(),hn=`
uniform vec3 glowColor;
uniform float glowIntensity;
uniform float glowPower;
varying vec3 vNormal;
varying vec3 vPositionNormal;

void main()
{
    // Fix: Use simple dot product. 
    // Surfaces facing camera (dot ~ 1) will be dimmer if we want edge glow.
    // Surfaces facing away (dot < 0) should be culled or handled.
    
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vPositionNormal); // This is actually View Position in camera space, so ViewDir is -vPositionNormal

    // In Camera space, the camera is at (0,0,0) and looks down -Z. 
    // vPositionNormal coming from vertex shader: normalize((modelViewMatrix * vec4(position, 1.0)).xyz)
    // This vector points FROM camera TO vertex. 
    // So typical viewDir (Vertex to Eye) is -vPositionNormal.

    // Fresnel = 1 - dot(N, V). 
    // If dot(N, V) is 1 (facing), fresnel is 0 (center transparent).
    // If dot(N, V) is 0 (edge), fresnel is 1 (edge bright).
    
    float viewDot = dot(normal, -viewDir); // Standard N dot V
    float fresnel = 1.0 - clamp(viewDot, 0.0, 1.0); // Clamp to ignore backfaces if any
    
    float a = smoothstep(0.0, 1.0, pow(fresnel, glowPower)) * glowIntensity;

    // Add a base opacity so it's not fully transparent in the center?
    // User complaint: "faces which are not facing the camera are almost transparent" 
    // This implies they WANT back-faces or side-faces to be visible/handled differently.
    // If they want a solid gold coin with rim light, we should add base color.

    // Mix Base Gold Color with Glow
    vec3 baseColor = vec3(1.0, 0.84, 0.0); // Gold

    // Simple lighting for base
    float light = clamp(dot(normal, vec3(0.0, 1.0, 1.0)), 0.2, 1.0);

    // Combine: Base Color + Fresnel Glow
    vec3 finalColor = baseColor * light + (glowColor * a);

    // Force alpha to 1.0 because it's a solid coin, not a ghost
    gl_FragColor = vec4(finalColor, 1.0);
}
`,gn=Ht(`#FBC189`,1,1,1),Wt(`#FBC189`,1,1,1),_n=Ut(`#FBC189`,1,.01,6.5,e.FrontSide,1),Gt(`#FBC189`,1,.01,6.5,e.FrontSide,1),vn=qt(`#FBC189`,1,1,.1),yn=`
    uniform vec2 iResolution;
    uniform float iTime;
    uniform vec2 uMouse;
    uniform vec2 uSmoothedMouse;
    uniform float uEyeOpenness; // 0.0 to 1.0
    uniform bool uEyeActive;  
    uniform float uOffsetY;
    uniform float uEyeAngle;
    uniform float uEyeScale;
    uniform vec2 uEyeFlameOffset;
    uniform vec2 uFlameScale;
    uniform vec2 uEyeScreenPosition;
    uniform float uDragonEyeAspect;

    varying vec2 vUv;

// ==========================================
// PART 1: DRAGON EYE GLOBALS & DEFINES
// ==========================================

#define TIME iTime
#define TTIME (2.0 * 3.141592654 * TIME)
#define RESOLUTION iResolution
#define PI 3.141592654
#define TAU (2.0 * PI)
#define ROT(a) mat2(cos(a), sin(a), -sin(a), cos(a))

#define LAYERS 6
#define FBM 3
#define DISTORT 1.4
#define PCOS(x)(0.5 + 0.5 * cos(x))

// --- Color Helpers ---
const vec4 hsv2rgb_K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 hsv2rgb(vec3 c) {
        vec3 p = abs(fract(c.xxx + hsv2rgb_K.xyz) * 6.0 - hsv2rgb_K.www);
    return c.z * mix(hsv2rgb_K.xxx, clamp(p - hsv2rgb_K.xxx, 0.0, 1.0), c.y);
}

    // --- Global Variables (Simulated) ---
    float g_psy_th = 0.0;
    float g_psy_hf = 0.0;
    vec2 g_psy_vx = vec2(0.0);
    vec2 g_psy_vy = vec2(0.0);
    vec2 g_psy_wx = vec2(0.0);
    vec2 g_psy_wy = vec2(0.0);

const vec3 lightPos1 = 100.0 * vec3(-1.3, 1.9, 2.0);
const vec3 lightPos2 = 100.0 * vec3(9.0, 3.2, 1.0);
const vec3 lightDir1 = normalize(lightPos1);
const vec3 lightDir2 = normalize(lightPos2);
const vec3 lightCol1 = vec3(8.0 / 8.0, 7.0 / 8.0, 6.0 / 8.0);
const vec3 lightCol2 = vec3(0.1 / 8.0, 0.075 / 8.0, 0.0875 / 8.0);
const vec3 skinCol1 = vec3(0.6, 0.2, 0.2);
const vec3 skinCol2 = vec3(0.6);

// ==========================================
// PART 2: FIRE HELPER FUNCTIONS
// ==========================================

#define FLAME_BASE_WIDTH .04

    float hash11(float p) {
    p = fract(p * .1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
}

    vec2 hash21(float p) {
        vec3 p3 = fract(vec3(p) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx + p3.yz) * p3.zy);
}

    float fire_noise(float r, float x, const float n) {
    r *= 1337.;
        float fl = floor(n * x);
        float noise0 = hash11(r + fl);
        float noise1 = hash11(r + fl + 1.);
        float t = fract(n * x);
return mix(noise0, noise1, t);
    }

    float fire_line(vec2 uv) {
        float center = .1 * (fire_noise(1., uv.y, 5.)
        + .8 * fire_noise(2., uv.y, 10.) - .9);
        float width = FLAME_BASE_WIDTH
        + .04 * (fire_noise(3., uv.y, 5.)
            + .8 * fire_noise(4., uv.y, 10.));    
        
        float d = abs(uv.x - center);
    return 1. - smoothstep(width * 0.7, width, d);
}

    vec2 fire_rot(vec2 uv, float a) {
        float c = cos(a);
        float s = sin(a);
    return uv * mat2(c, -s, s, c);
}

    float flame(vec2 uv, float spread, float p) {
        float shift = p + iTime;
    return fire_line(fire_rot(uv, 3.14 - spread) + vec2(0., shift))
        * fire_line(fire_rot(uv, 3.14 + spread) + vec2(0., shift));
}

    vec3 fire_color_func(float x, float blend) {
        vec3 redFire = vec3(1., 0., 0.) * x
        + vec3(1., 1., 0.) * clamp(x - .5, 0., 1.)
        + vec3(1., 1., 1.) * clamp(x - .7, 0., 1.);
                     
        vec3 blueFire = vec3(0.1, 0.1, 1.0) * x
        + vec3(0.0, 1.0, 0.5) * clamp(x - .5, 0., 1.)
        + vec3(1.0, 1.0, 1.0) * clamp(x - .7, 0., 1.);

    return mix(redFire, blueFire, blend);
}

    vec3 particle_color(float t, float blend) {
        float heat = 0.5 + 0.5 * t;
    return fire_color_func(heat, blend);
}

    // ==========================================
    // PART 3: DRAGON EYE HELPER FUNCTIONS
    // ==========================================

    float tanh_approx(float x) {
        float x2 = x * x;
    return clamp(x * (27.0 + x2) / (27.0 + 9.0 * x2), -1.0, 1.0);
}

    float pmin(float a, float b, float k) {
        float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

    float pmax(float a, float b, float k) { return -pmin(-a, -b, k); }
    float pabs(float a, float k) { return pmax(a, -a, k); }

    vec2 toPolar(vec2 p) { return vec2(length(p), atan(p.y, p.x)); }
    vec2 toRect(vec2 p) { return vec2(p.x * cos(p.y), p.x * sin(p.y)); }

    float modMirror1(inout float p, float size) {
        float halfsize = size * 0.5;
        float c = floor((p + halfsize) / size);
    p = mod(p + halfsize, size) - halfsize;
    p *= mod(c, 2.0) * 2.0 - 1.0;
    return c;
}

    float smoothKaleidoscope(inout vec2 p, float sm, float rep) {
        vec2 hp = p;
        vec2 hpp = toPolar(hp);
        float rn = modMirror1(hpp.y, TAU / rep);
        float sa = PI / rep - pabs(PI / rep - abs(hpp.y), sm);
    hpp.y = sign(hpp.y) * (sa);
    hp = toRect(hpp);
    p = hp;
    return rn;
}

    float vesica(vec2 p, vec2 sz) {
    sz = max(sz, vec2(0.001));
    if (sz.x < sz.y) { sz = sz.yx; } else { p = p.yx; }
        vec2 sz2 = sz * sz;
        float d = (sz2.x - sz2.y) / (2.0 * sz.y);
        float r = sqrt(sz2.x + d * d);
        float b = sz.x;
    p = abs(p);
    return ((p.y - b) * d > p.x * b) ? length(p - vec2(0.0, b))
        : length(p - vec2(-d, 0.0)) - r;
}

    float raySphere(vec3 ro, vec3 rd, vec4 sph) {
        vec3 oc = ro - sph.xyz;
        float b = dot(oc, rd);
        float c = dot(oc, oc) - sph.w * sph.w;
        float h = b * b - c;
    if (h < 0.0) return -1.0;
    h = sqrt(h);
    return -b - h;
}

    // --- Shape Functions ---
    float outer(vec2 p, float uEyeOpenness) {
    p *= ROT(uEyeAngle);
        vec2 sz = vec2(0.5, 0.25 * uEyeOpenness);
    return vesica(p, sz) - (0.15 * uEyeOpenness);
}

    float inner(vec2 p, float uEyeOpenness) {
    p *= ROT(uEyeAngle);
        vec2 sz = vec2(0.125 * uEyeOpenness, 0.35);
    return vesica(p, sz);
}

    float qc_wave(float theta, vec2 p) {
    return (cos(dot(p, vec2(cos(theta), sin(theta)))));
}

    float qc_noise(vec2 p) {
        float sum = 0.;
        float a = 1.0;
    for (int i = 0; i < LAYERS; ++i) {
            float theta = float(i) * PI / float(LAYERS);
        sum += qc_wave(theta, p) * a;
        a *= DISTORT;
    }
    return abs(tanh_approx(sum));
}

    float qc_fbm(vec2 p, float time) {
        float sum = 0.;
        float a = 1.0;
        float f = 1.0;
    for (int i = 0; i < FBM; ++i) {
        sum += a * qc_noise(p * f);
        a *= 2.0 / 3.0;
        f *= 2.31;
    }
    return 0.45 * (sum);
}

    float qc_height(vec2 p, float uEyeOpenness) {
        float od = outer(p, uEyeOpenness);
        float l = length(p);
    const float s = 5.0;
    p *= s;
        float sm = 0.05;
    const float falloff = 4.0; 
        float oh = smoothstep(0.0, sm, od);
        float h = -5.0 * qc_fbm(p, TIME) * exp(-falloff * l) * oh;
    return h;
}

    vec3 qc_normal(vec2 p, float uEyeOpenness) {
        vec2 e = vec2(4.0 / RESOLUTION.y, 0);
        vec3 n;
    n.x = qc_height(p + e.xy, uEyeOpenness) - qc_height(p - e.xy, uEyeOpenness);
    n.y = 2.0 * e.x;
    n.z = qc_height(p + e.yx, uEyeOpenness) - qc_height(p - e.yx, uEyeOpenness);
    return normalize(n);
}

    float psy_noise(vec2 p) {
        float a = sin(p.x);
        float b = sin(p.y);
        float c = 0.5 + 0.5 * cos(p.x + p.y);
        float d = mix(a, b, c);
    return d;
}

    float psy_fbm(vec2 p, float aa) {
    const mat2 frot = mat2(0.80, 0.60, -0.60, 0.80);
        float f = 0.0;
        float a = 1.0;
        float s = 0.0;
        float m = 2.0;
    for (int x = 0; x < 4; ++x) {
        f += a * psy_noise(p);
        p = frot * p * m;
        m += 0.01;
        s += a;
        a *= aa;
    }
    return f / s;
}

    float psy_warp(vec2 p, out vec2 v, out vec2 w, float uEyeOpenness, float blendFactor) {
        vec2 offsetMouse = uSmoothedMouse - uEyeScreenPosition;
        vec2 mouse = vec2(-offsetMouse.x, offsetMouse.y);
        
        float lm = length(mouse);
        vec2 pupilPos = vec2(0.0);
    const float maxPupilDist = 0.15;
    if (lm > 0.001) {
        pupilPos = (mouse / lm) * min(lm, maxPupilDist);
    }
    p -= pupilPos;

        float id = inner(p, uEyeOpenness);
        float f = smoothstep(-0.1, 0.15, id);
    const float rep = 50.0;
    const float sm = 0.125 * 0.5 * 60.0 / rep;
        float n = smoothKaleidoscope(p, sm, rep);
    p.y += TIME * 0.125 + 1.5 * g_psy_th;
    g_psy_hf = f;
        vec2 vx = g_psy_vx; vec2 vy = g_psy_vy;
        vec2 wx = g_psy_wx; vec2 wy = g_psy_wy;
        float aa = 0.5;
    v = vec2(psy_fbm(p + vx, aa), psy_fbm(p + vy, aa)) * f;
    w = vec2(psy_fbm(p + 3.0 * v + wx, aa), psy_fbm(p + 3.0 * v + wy, aa)) * f;

    return -tanh_approx(psy_fbm(p + 2.25 * w, aa) * f);
}

    vec3 psy_normal(vec2 p, float uEyeOpenness, float blendFactor) {
        vec2 v; vec2 w;
        vec2 e = vec2(4.0 / RESOLUTION.y, 0);
        vec3 n;
    n.x = psy_warp(p + e.xy, v, w, uEyeOpenness, blendFactor) - psy_warp(p - e.xy, v, w, uEyeOpenness, blendFactor);
    n.y = 2.0 * e.x;
    n.z = psy_warp(p + e.yx, v, w, uEyeOpenness, blendFactor) - psy_warp(p - e.yx, v, w, uEyeOpenness, blendFactor);
    return normalize(n);
}

    vec3 psy_weird(vec2 p, float uEyeOpenness, float blendFactor) {
        vec2 v; vec2 w;
        float h = psy_warp(p, v, w, uEyeOpenness, blendFactor);
        float hf = g_psy_hf;
        vec3 n = psy_normal(p, uEyeOpenness, blendFactor);
        vec3 ro = vec3(0.0, 10.0, 0.0);
        vec3 po = vec3(p.x, 0.0, p.y);
        vec3 rd = normalize(po - ro);
        
        vec3 ref = reflect(rd, n);
        float ref1 = max(dot(ref, lightDir1), 0.0);
        float ref2 = max(dot(ref, lightDir2), 0.0);
        
        vec3 fireTint = fire_color_func(0.95, blendFactor); 
        
        float a = length(p);
        vec3 col = vec3(0.0);

        float pattern = tanh_approx(0.1 + abs(v.y - w.y));
    col += fireTint * pattern * 1.5;

    col -= 0.5 * (length(v) + length(w)) * 0.2;

    col += 0.5 * lightCol1 * pow(ref1, 20.0);
    col += 0.01 * lightCol2 * pow(ref2, 10.0);
    col *= hf;
    return max(col, 0.0);
}

    float vmax(vec2 v) { return max(v.x, v.y); }

    float corner(vec2 p) {
    return length(max(p, vec2(0))) + vmax(min(p, vec2(0)));
}

    vec3 skyColor(vec3 ro, vec3 rd) {
        float ld1 = max(dot(lightDir1, rd), 0.0);
        float ld2 = max(dot(lightDir2, rd), 0.0);
        vec3 final = vec3(0.0);
    rd.xy *= ROT(-1.);
        vec2 bp = rd.xz / max(0.0, rd.y);
        float bd = corner(-bp);
    final += 0.05 * exp(-5.0 * max(bd, 0.0));
    final += 0.01 * smoothstep(0.025, 0.0, bd);
    final += 8.0 * lightCol1 * pow(ld1, 100.0);
    final += 0.5 * lightCol2 * pow(ld2, 100.0);
    return final;
}

    vec3 eyeColor(vec2 p, vec3 ro, vec3 rd, vec3 po, float od, float uEyeOpenness, float blendFactor) {
        vec3 sc = vec3(0.0);
        float sd = raySphere(ro, rd, vec4(sc, 0.75));
        vec3 spos = ro + sd * rd;
        vec3 snor = normalize(spos - sc);
        vec3 refl = reflect(rd, snor);
        vec3 scol = skyColor(spos, refl);
        float dif1 = max(dot(snor, lightDir1), 0.0);
        float dif2 = max(dot(snor, lightDir2), 0.0);
        
        vec3 pcol = psy_weird(p, uEyeOpenness, blendFactor);
        
        vec3 col1 = pcol + 0.25 * scol + 0.025 * (dif1 * dif1 + dif2 * dif2);
        vec3 col2 = 0.125 * (skinCol1) * (dif1 + dif2) + 0.125 * sqrt(scol);
    snor.xz *= ROT(-0.5 * uEyeAngle);
    snor.xy *= ROT(2.4 * smoothstep(0.99, 1.0, sin(TTIME / 12.0)));
        float a = atan(snor.y, snor.x);
        vec3 col = mix(col1, col2, step(a, 0.0));
    col *= smoothstep(0.0, -0.1, od);
    return col;
}

    vec3 skinColor(vec2 p, vec3 ro, vec3 rd, vec3 po, float od, float uEyeOpenness) {
        float qch = qc_height(p, uEyeOpenness);
        vec3 qcn = qc_normal(p, uEyeOpenness);
        float diff1 = max(dot(qcn, lightDir1), 0.0);
        float diff2 = max(dot(qcn, lightDir2), 0.0);
        vec3 ref = reflect(rd, qcn);
        vec3 scol = skyColor(po, ref);
        vec3 dm = mix(1.0 * skinCol1, skinCol2,
    1.0 + tanh_approx(2.0 * qch)) * tanh_approx(-qch * 10.0 + 0.125);
        vec3 col = vec3(0.0);
    col += dm * sqrt(diff1) * (0.25 * lightCol1);
    col += dm * sqrt(diff2) * (0.0625 * lightCol2);
    const float ff = 0.3;
        float f = ff * exp(-8.0 * od);
    col *= f;
    col += 0.1 * ff * sqrt(scol);
    col -= (1.0 - tanh_approx(10.0 * -qch)) * f;
    col *= smoothstep(0.0, 0.025, od);

    // --- NEW: Force Fade Out ---
    col *= smoothstep(0.8, 0.2, od);

    return col;
}

void compute_globals() {
        vec2 vx = vec2(0.0, 0.0); vec2 vy = vec2(3.2, 1.3);
        vec2 wx = vec2(1.7, 9.2); vec2 wy = vec2(8.3, 2.8);
    vx *= ROT(TTIME / 1000.0); vy *= ROT(TTIME / 900.0);
    wx *= ROT(TTIME / 800.0); wy *= ROT(TTIME / 700.0);
    g_psy_vx = vx; g_psy_vy = vy;
    g_psy_wx = wx; g_psy_wy = wy;
}

    vec3 color(vec2 p, float uEyeOpenness, float blendFactor) {
    compute_globals();
        float od = outer(p, uEyeOpenness);
        vec3 ro = vec3(0.0, 10.0, 0.0);
        vec3 po = vec3(p.x, 0.0, p.y);
        vec3 rd = normalize(po - ro);

    return od > 0.0 ? skinColor(p, ro, rd, po, od, uEyeOpenness)
        : eyeColor(p, ro, rd, po, od, uEyeOpenness, blendFactor);
}

    vec3 postProcess(vec3 col, vec2 q) {
    col = clamp(col, 0.0, 1.0);
    col = pow(col, 1.0 / vec3(2.2));
    col = col * 0.6 + 0.4 * col * col * (3.0 - 2.0 * col);
    col = mix(col, vec3(dot(col, vec3(0.33))), -0.4);
    col *= 0.5 + 0.5 * pow(19.0 * q.x * q.y * (1.0 - q.x) * (1.0 - q.y), 0.7);
    return col;
}

void main() {
    if (!uEyeActive) {
        gl_FragColor = vec4(0.0);
        return;
    }

        float blendFactor = 0.5 + 0.5 * sin(iTime * 0.5);

        // --- 1. EYE RENDERING ---
        vec2 q = vUv;
        q.y += uOffsetY; // Add vertical offset

        vec2 p = -1. + 2. * q;
    p.x *= uDragonEyeAspect; // Aspect correction

    // Position Eye
    p += uEyeFlameOffset;
    p *= 1.0 / uEyeScale;
        
        vec3 col = color(p, uEyeOpenness, blendFactor);
    col *= smoothstep(0.0, 1.0, uEyeOpenness);
    col = postProcess(col, q);

        // --- 2. FIRE & SPARKS RENDERING ---
        vec2 uvBase = (q * 2.0 - 1.0);
    uvBase.x *= uDragonEyeAspect;

    uvBase += uEyeFlameOffset;
    uvBase.x -= 0.07;

        // A. Fire Flames
        vec2 uvFire = uvBase;
    uvFire.y -= 0.5; 
        
        float dynamicScale = mix(15.0, 2.0, uEyeOpenness);
    uvFire *= 2. * dynamicScale / 1.35 * uFlameScale;

        // B. Sparks
        vec2 uvParticles = uvBase;
        vec3 particleCol = vec3(0.);
        float time = iTime * .5;
    for (int i = 0; i < 30; i++) {
            float sd = time + float(i) * 3303.1031;
            float id = floor(sd);
            float t = fract(sd);
            float rnd = hash11(id);
            vec2 vp = hash21(id);
        vp.y *= -t * (rnd + .5) - .5;
        vp.x *= (rnd > .5) ? -1. : 1.;
            float size = rnd * .0075 + .00025;
            float cycle = rnd * 8.;
            float w = vp.x * .3 - vp.x * vp.y * .45;
            float x_offset = cos(sd * cycle - t * 2.) * w;
            float d = size / length(uvParticles + vec2(x_offset, vp.y));
        particleCol += particle_color(rnd, blendFactor) * d;
    }

        // Calculate Flames
        float fire_intensity = 0.;
    const int fire_n = 10;
    for (int i = 0; i < fire_n; ++i) {
            float t = float(i) / float(fire_n) - .5;
            float y_off = .08 + .1 * t;
            float spread = .15 + .1 * t;
        fire_intensity += flame(uvFire + vec2(0., y_off), spread, 273. * float(i));
    }
        vec3 finalFire = fire_color_func(2. * fire_intensity / float(fire_n), blendFactor);
        vec3 finalParticles = pow(particleCol, vec3(1.9));

    finalFire *= uEyeOpenness * 1.5;
    finalParticles *= uEyeOpenness;

        // --- 3. COMBINE ---
        vec3 finalCol = col + finalFire + finalParticles;

        // --- 4. EDGE FADE / VIGNETTE ---
        // Smoothly fade out near the edges of the quad (UV 0 and 1)
        float edgeX = smoothstep(0.0, 0.1, vUv.x) * (1.0 - smoothstep(0.9, 1.0, vUv.x));
        float edgeY = smoothstep(0.0, 0.1, vUv.y) * (1.0 - smoothstep(0.9, 1.0, vUv.y));
        float vignette = edgeX * edgeY;

    // Apply fade
    finalCol *= vignette;

    gl_FragColor = vec4(finalCol, 1.0);
}




`,bn=`
varying vec2 vUv;
uniform float iTime;
uniform vec2 iResolution;
uniform sampler2D iChannelSprite;
uniform vec2 uSelectedSlot;  
uniform vec2 uSpriteSize;    
uniform vec2 uSpritePixels;
uniform float uIconScale;
uniform float uDarkness;
uniform float uAspect; // Added for ratio correction

void main() {
    // Correct Aspect Ratio before doing anything else
    vec2 p = vUv - 0.5;
    if (uAspect != 0.0) {
        p.x *= uAspect;
    }
    // Convert back to 0..1 range for texture lookup
    // BUT we want the texture to be square in the middle, so we need to be careful.
    // Actually, sprite logic usually expects 0..1 to map to the full image.
    // If we want the logo to be undistorted, we need to map the quad's rectangular UVs
    // to a square domain for the texture.
    
    vec2 squareUV = p + 0.5;
    
    // --- 1. Sprite Mapping Logic ---
    // Use vUv directly for standard texture mapping
    // We assume the plane itself has the correct aspect ratio for the sprite, 
    // OR we can correct it here if we had a uAspect uniform. 
    // For now, let's stick to standard UV mapping which should stretch WITH the plane 
    // rather than being screen-dependent.
    
    vec2 dota_centeredUV = (squareUV - 0.5) / max(0.001, uIconScale) + 0.5;
    dota_centeredUV.y = 1.0 - dota_centeredUV.y; // KTX2 Top-Left Flip
    
    // Bounds check
    if(dota_centeredUV.x < 0.0 || dota_centeredUV.x > 1.0 || dota_centeredUV.y < 0.0 || dota_centeredUV.y > 1.0) {
        discard;
    }

    vec2 dota_tileSize = 1.0 / vec2(uSpriteSize.y, uSpriteSize.x); 
    vec2 dota_pixelOffset = 0.5 / uSpritePixels; 
    float dota_offsetX = uSelectedSlot.y * dota_tileSize.x;
    float dota_offsetY = uSelectedSlot.x * dota_tileSize.y;
    vec2 dota_finalUV = dota_centeredUV * (dota_tileSize - dota_pixelOffset * 2.0) + vec2(dota_offsetX, dota_offsetY) + dota_pixelOffset;

    vec4 dota_tex = texture2D(iChannelSprite, dota_finalUV);
    float dota_mask = dota_tex.a;
    float dota_dist = dota_mask - 0.5;
    float dota_smoothing = fwidth(dota_dist);
    float dota_alpha = smoothstep(-dota_smoothing, dota_smoothing, dota_dist);

    if (dota_alpha < 0.01) discard;

    // --- 2. Blood Effect Logic ---
    // Blood effect should also be local to UV space to stay attached to the icon
    vec2 bloodP = 5.0 * (dota_centeredUV - 0.5);
    vec2 i = bloodP;
    float c = 0.0;
    float r = length(bloodP + vec2(sin(iTime), sin(iTime * 0.222 + 99.0)) * 1.5);
    float d = length(bloodP);
    float rot = d + iTime + bloodP.x * 0.15; 

    for (float n = 0.0; n < 2.0; n++) {
        bloodP *= mat2(cos(rot - sin(iTime / 4.0)), sin(rot), -sin(cos(rot) - iTime), cos(rot)) * -0.15;
        float t = r - iTime / (n + 1.5);
        i -= bloodP + vec2(cos(t - i.x - r) + sin(t + i.y), sin(t - i.y) + cos(t + i.x) + r);
        c += 1.0 / length(vec2((sin(i.x + t) / 0.15), (cos(i.y + t) / 0.15)));
    }
    c /= 2.0;

    // --- COLOR MAPPING ---
    vec3 baseRed = vec3(0.35, 0.08, 0.04); 
    vec3 midTone = vec3(0.65, 0.20, 0.12);
    vec3 highlight = vec3(1.0, 0.9, 0.8);

    // We use the darkness variable to bias the intensity curve
    float intensity = clamp(c, 0.0, 1.0);
    float biasedIntensity = pow(intensity, uDarkness);
    
    // Smooth transition from the base color to the highlight
    vec3 col = mix(baseRed * 0.2, midTone, biasedIntensity);
    col = mix(col, highlight, pow(intensity, 8.0)); // Sharp white peaks
    
    // Final brightness boost to ensure waves stay visible
    col += baseRed * biasedIntensity * 1.5;

    gl_FragColor = vec4(col, dota_alpha);
}
`,xn=`
uniform vec2 iResolution;
uniform float iTime;
varying vec2 vUv;

// --- Constants & Macros ---
#define S smoothstep
#define P 3.14159265
#define HASHSCALE1 443.8975

const vec3 darkGreen   = vec3(0.0, 0.15, 0.05);
const vec3 bloodRed    = vec3(0.35, 0.0, 0.01);
const vec3 dialogBody  = vec3(0.03, 0.03, 0.03); 
const vec3 mutedGreen  = vec3(0.0, 0.3, 0.15); 
const vec3 highlightG  = vec3(0.0, 0.8, 0.4);   

// --- SDF Letter Segments ---

float line(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
}

// Segment-based characters with increased thickness for BOLD effect
float drawChar(vec2 p, int charIdx) {
    float d = 1.0;
    // Character bounds
    vec2 tl = vec2(-0.008, 0.012), tr = vec2(0.008, 0.012);
    vec2 ml = vec2(-0.008, 0.0),   mr = vec2(0.008, 0.0);
    vec2 bl = vec2(-0.008, -0.012), br = vec2(0.008, -0.012);
    
    // Character mapping
    if(charIdx==0) { d=min(d, line(p,bl,tl)); d=min(d, line(p,tl,tr)); d=min(d, line(p,tr,br)); d=min(d, line(p,ml,mr)); } // A
    if(charIdx==1) { d=min(d, line(p,tl,bl)); d=min(d, line(p,bl,br)); } // L
    if(charIdx==2) { d=min(d, line(p,bl,tl)); d=min(d, line(p,tl,tr)); d=min(d, line(p,tr,mr)); d=min(d, line(p,mr,ml)); } // P
    if(charIdx==3) { d=min(d, line(p,tl,tr)); d=min(d, line(p,vec2(0,0.012),vec2(0,-0.012))); d=min(d, line(p,bl,br)); } // I
    if(charIdx==4) { d=min(d, line(p,tr,tl)); d=min(d, line(p,tl,bl)); d=min(d, line(p,bl,br)); } // C
    if(charIdx==5) { d=min(d, line(p,tl,bl)); d=min(d, line(p,ml,tr)); d=min(d, line(p,ml,br)); } // K
    if(charIdx==6) { d=min(d, line(p,tr,tl)); d=min(d, line(p,tl,bl)); d=min(d, line(p,bl,br)); d=min(d, line(p,ml,mr)); } // E
    if(charIdx==7) { d=min(d, line(p,tl,tr)); d=min(d, line(p,vec2(0,0.012),vec2(0,-0.012))); } // T
    
    // Increased the second parameter of S (smoothstep) to make the stroke thicker (Bold)
    return S(0.005, 0.003, d); 
}

// --- Background & UI Shapes ---

float sdBox(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float hash13(vec3 p3) {
    p3 = fract(p3 * HASHSCALE1);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

mat2 r(float a) { return mat2(cos(a), -sin(a), sin(a), cos(a)); }

float m(vec2 u, float t, float o) {
    u *= r(t);
    return S(-P, P, sin(atan(u.x, u.y) * (0.5 + o * .125)) * u.y / u.x) * S(-0.125, 1.25, 1. - length(u * 0.85));
}

// --- Main ---

uniform float uAspect; // Optional: To keep it circular if plane isn't square

void main()
{
    // Use UV Space (-0.5 to 0.5) centered
    vec2 u = vUv - 0.5;
    
    // Correct Aspect Ratio (if provided via uniform, otherwise assume square UVs)
    // If uAspect > 1.0 (Landscape), we scale X. If < 1.0 (Portrait), we scale Y inverse.
    // Standard approach: Keep vertical fixed (-0.5 to 0.5) and stretch horizontal.
    if (uAspect != 0.0) {
        u.x *= uAspect;
    }
    
    float t = iTime * .5;
    u *= 2.0; // Scale up to match previous -1..1 range approx
    
    // 1. BACKGROUND
    vec3 bgCol = mix(darkGreen, bloodRed, sin(t + length(u)) * .5 + .5) * 0.2;
    float no = hash13(vec3(u, t * 0.000001)) * 0.5;
    for(float i = 0.; i < 11.0; i++){
        float s = i / 11.0 * P * 2.;
        float b = sin(t + s) * no * 0.0125; 
        vec2 o = vec2(cos(t + s * 4.) * (.25 + b), sin(t + s * 4.) * (.25 + b));
        bgCol += (m(u + o, no * 0.125, no) * mix(bloodRed, darkGreen, pow(sin(s * 32. + t) * .5 + .5, 1.25)));
    }
    bgCol /= 2.5;

    // 2. DIALOG
    vec2 dSize = vec2(0.48, 0.15); 
    float d = sdBox(u, dSize);
    vec3 finalCol = bgCol + highlightG * S(0.12, 0.0, d) * 0.12; 

    if (d < 0.0) {
        float splitY = dSize.y - (dSize.y * 2.0 * 0.25);
        vec3 uiCol;
        
        if (u.y > splitY) {
            uiCol = vec3(0.015);
            // Centering "ALL PICK"
            vec2 tp = u - vec2(-0.08, (splitY + dSize.y) * 0.5);
            float txt = 0.0;
            txt += drawChar(tp - vec2(-0.02, 0), 0); // A
            txt += drawChar(tp - vec2(0.008, 0), 1); // L
            txt += drawChar(tp - vec2(0.036, 0), 1); // L
            txt += drawChar(tp - vec2(0.08, 0), 2);  // P
            txt += drawChar(tp - vec2(0.108, 0), 3); // I
            txt += drawChar(tp - vec2(0.136, 0), 4); // C
            txt += drawChar(tp - vec2(0.164, 0), 5); // K
            uiCol = mix(uiCol, vec4(1).rgb, txt);
        } else {
            uiCol = dialogBody;
            float bCY = (splitY - dSize.y) * 0.5;
            vec2 bp = u - vec2(0.0, bCY); 
            float btn = sdBox(bp, vec2(0.12, 0.03));
            if (btn < 0.0) uiCol = mutedGreen;
            
            // "ACCEPT" on Button
            vec2 tp = bp - vec2(-0.07, 0);
            float txt = 0.0;
            txt += drawChar(tp - vec2(-0.01, 0), 0); // A
            txt += drawChar(tp - vec2(0.018, 0), 4); // C
            txt += drawChar(tp - vec2(0.046, 0), 4); // C
            txt += drawChar(tp - vec2(0.074, 0), 6); // E
            txt += drawChar(tp - vec2(0.102, 0), 2); // P
            txt += drawChar(tp - vec2(0.130, 0), 7); // T
            uiCol = mix(uiCol, vec4(1).rgb, txt);
            uiCol += mutedGreen * S(0.08, 0.0, btn) * 0.2;
        }
        finalCol = mix(finalCol, uiCol, 0.9);
        finalCol += highlightG * S(0.005, 0.0, abs(d)) * 0.4;
    }

    gl_FragColor = vec4(finalCol, 1.0);
}
`})),Cn=N({Raycaster:()=>jn,addRaycastObject:()=>wn,adjustNebula:()=>kn,applyImpulse:()=>On,changeMaterial:()=>En,goldInnerGlowMatSkinned:()=>An,hideInformer:()=>U,highlightObject:()=>Tn,restoreMaterials:()=>Dn,setInformerBg:()=>H});function wn(e,t,n={}){let{onMouseEnter:r=null,onMouseLeave:i=null,onMouseDown:a=null,onMouseHover:o=null}=n;e.raycastObjects=e.raycastObjects||[],e.raycastObjects.push(t),t.userData.isRaycastTarget=!0;let s=t;s.traverse(e=>{e.material&&(e.userData.originalMaterial=e.material)}),s.onMouseEnter=()=>r&&r(s),s.onMouseLeave=()=>i&&i(s),o&&(s.onMouseHover=(e,t)=>o(e,t)),a&&(s.onMouseDown=(e,t)=>a(e,t))}function Tn(t,n){if(Dn(t),!t.raycastMaterials){t.raycastMaterials=[];for(let n=0;n<10;n++){let r=new e.MeshStandardMaterial({name:`Pool_Mat_${n}`});t.raycastMaterials.push(r)}}let r=new Map;n.traverse(e=>{if(!e.ignoreRaycast&&!(e.name&&(e.name.toLowerCase().includes(`hitbox`)||e.name.toLowerCase().includes(`collider`)))&&e.isMesh&&e.material){if(e.material.isShaderMaterial)return;e.userData.originalMaterial||(e.userData.originalMaterial=e.material);let t=e.material.uuid;r.has(t)||r.set(t,{count:0,material:e.material});let n=r.get(t);n.count++}});let i=Array.from(r.values()).sort((e,t)=>t.count-e.count),a=new Map,o=Math.min(i.length,10);for(let e=0;e<o;e++){let n=i[e].material,r=t.raycastMaterials[e];r.copy(n),n.toneMapped===!1?(r.envMap=n.envMap?n.envMap:t.environment,r.envMapIntensity=n.envMap?n.envMapIntensity*4:4):r.toneMapped=!1,a.set(n.uuid,r)}t._dirtyRaycastObjects||=new Set,t._dirtyRaycastObjects.add(n),n.traverse(e=>{if(!e.ignoreRaycast&&!(e.name&&(e.name.toLowerCase().includes(`hitbox`)||e.name.toLowerCase().includes(`collider`)))&&e.isMesh&&e.material){let t=a.get(e.material.uuid);t&&(e.material=t)}})}function En(e,t,n=An){e._dirtyRaycastObjects||=new Set,e._dirtyRaycastObjects.add(t),t.traverse(e=>{e.ignoreRaycast||e.name&&(e.name.toLowerCase().includes(`hitbox`)||e.name.toLowerCase().includes(`collider`))||e.isMesh&&e.material&&(e.userData.originalMaterial||(e.userData.originalMaterial=e.material),e.material=n)})}function Dn(e){!e._dirtyRaycastObjects||e._dirtyRaycastObjects.size===0||(e._dirtyRaycastObjects.forEach(e=>{e.traverse(e=>{e.material&&e.userData.originalMaterial&&(e.material=e.userData.originalMaterial)})}),e._dirtyRaycastObjects.clear())}function On(t,n,r,i=null){let a=n.rapierBody;if(!a)return;let o=r.point,s=new e.Vector3;s.subVectors(o,t.raycasterWrapper.camera.position).normalize();let c=a.mass()||0;i||=Math.random()*1+2.5;let l=c*i,u=s.multiplyScalar(l);u.y=Math.max(2*Math.abs(s.y),2),u.x/=10,u.y*=3,u.z/=10,a.applyImpulseAtPoint({x:u.x,y:u.y,z:u.z},{x:o.x,y:o.y,z:o.z},!0),t.shootDroneBeam&&![`Object_12001`,`Object_108`].includes(n?.name)&&t.shootDroneBeam(t,n,``,o)}function kn(t){let n=t.raycasterWrapper.pointer,r=new e.Vector2(0,.29),i=n.distanceTo(r),a=t.objectMap&&t.objectMap.get(`Lathe_Center`)||t.getObjectByName(`Lathe_Center`);if(!a)return;let o=a.material.uniforms;if(i===0)return 2;if(i>.39)o.nebulaCoreRadius.value=40,o.nebulaTwistFactor.value=0;else{let e=i/.39,t=e*e;o.nebulaCoreRadius.value=2+98*t;let n=.2,r=Math.max(0,Math.min(t,n))/n;o.nebulaTwistFactor.value=1-r}return i}function H(e,t,n=`INFO HERE`,r=!1,i=!1){if(!(e.cursorInformerEnabled===!1&&!r)){if(e.cursorInformerBox)if(t){if(e.cursorInformerBox.style.display=`flex`,e.cursorInformerIcon){let n=t.replace(/\s+/g,``);e.cursorInformerIcon.style.backgroundImage=`url('data:image/svg+xml;base64,${n}')`}}else e.cursorInformerBox.style.display=`none`;e.cursorInformer&&(i?e.cursorInformer.classList.add(`ui-mode`):e.cursorInformer.classList.remove(`ui-mode`),e.cursorInformer.style.display=`block`,e.cursorInformer.style.opacity=`1`,e.cursorInformer.style.visibility=`visible`),e.cursorInformerText&&(e.cursorInformerText.style.display=`none`,e.cursorInformerText.style.opacity=`0`),e.cursorInformerText&&(e.cursorInformerText.innerHTML=n,e.cursorInformerText.style.display=`block`,e.cursorInformerText.style.opacity=`1`)}}function U(e){e.cursorInformer&&e.cursorInformer.hide?e.cursorInformer.hide():e.cursorInformer&&(e.cursorInformer.style.display=`none`),e.cursorInformerIcon&&(e.cursorInformerIcon.style.backgroundImage=`none`,e.cursorInformerIcon.style.transform=`rotate(0deg)`)}var An,jn,Mn=M((()=>{Sn(),An=Bt(`#FBC189`,1.5,1,e.FrontSide),jn=class{constructor(t,n,r,i=32){this.raycaster=new e.Raycaster,this.pointer=new e.Vector2,this.domElement=r&&r.domElement?r.domElement:t.domElement,this.domElement||=document.body,this.scene=t,this.camera=n,this.renderer=r,t.raycasterWrapper=this,this.raycastHightlightMaterials=[];for(let t=0;t<10;t++){let n=new e.MeshStandardMaterial({name:`Pool_Mat_${t}`});this.raycastHightlightMaterials.push(n)}let a=document.createElement(`div`);a.id=`cursor-informer-main-wrapper`,Object.assign(a.style,{position:`fixed`,top:`0`,left:`0`,pointerEvents:`none`,zIndex:`99999`,display:`none`}),document.body.appendChild(a),this.cursorInformer=a,t.cursorInformer=this.cursorInformer,this.cursorInformer.show=()=>{this.cursorInformer.style.display=`block`},this.cursorInformer.hide=()=>{this.cursorInformer.style.display=`none`};let o=document.createElement(`div`);o.id=`cursor-informer-text`,o.textContent=`INFO HERE`,a.appendChild(o),this.cursorInformerText=o,t.cursorInformerText=this.cursorInformerText;let s=document.createElement(`div`);s.id=`cursor-informer-box`,a.appendChild(s),this.cursorInformerBox=s,t.cursorInformerBox=this.cursorInformerBox;let c=document.createElement(`div`);c.id=`cursor-informer-icon`,Object.assign(c.style,{position:`relative`,zIndex:`2`,width:`100%`,height:`100%`,backgroundSize:`68%`,backgroundPosition:`center`,backgroundRepeat:`no-repeat`}),s.appendChild(c);let l=document.createElement(`div`);l.id=`cursor-informer-progress`,Object.assign(l.style,{position:`absolute`,bottom:`0`,left:`0`,height:`0%`,width:`100%`,backgroundColor:`var(--c-cyan, #00f3ff)`,opacity:`1`,zIndex:`1`,transition:`height 0.1s linear`}),s.appendChild(l),this.informerProgressBar=l,t.cursorInformerProgressBar=this.informerProgressBar,this.informerIcon=c,t.cursorInformerIcon=this.informerIcon,this.iconSize=i,this.isHoveringRaycastObject=!1,this.currentHoveredGroup=null,this.originalMaterialsMap=new Map,this.currentIntersection=null,this.currentObject=null,this.currentObjectTarget=null,this.lastObjectTarget=null,this.targetMouse=new e.Vector2(0,0),this.smoothedMouse=new e.Vector2(0,0),this.easingFactor=.08,this._onPointerMove=this.onPointerMove.bind(this),this._onMouseDown=this.onMouseDown.bind(this),this._onKeyDown=this.onKeyDown.bind(this),window.addEventListener(`pointermove`,this._onPointerMove,{passive:!0}),this.domElement.addEventListener(`mousedown`,this._onMouseDown,{passive:!0,capture:!1}),window.addEventListener(`keydown`,this._onKeyDown,{passive:!0}),this.mouseInContainer=!1,this.domElement.addEventListener(`mouseenter`,()=>{this.mouseInContainer=!0}),this.domElement.addEventListener(`mouseleave`,()=>{this.mouseInContainer=!1})}onKeyDown(e){}onMouseEnter(){}onPointerMove(e){let t;t=this.domElement&&this.domElement.getBoundingClientRect?this.domElement.getBoundingClientRect():{left:0,top:0,width:window.innerWidth,height:window.innerHeight};let n=e.clientX-t.left,r=e.clientY-t.top;if(this.pointer.x=n/t.width*2-1,this.pointer.y=-(r/t.height)*2+1,this.targetMouse.set(this.pointer.x,this.pointer.y),this.cursorInformer){let t=window.innerWidth,n=window.innerHeight,r=this.iconSize,i=r*-.5,a=r*-1.5,o=e.clientX+i,s=e.clientY+a;if(o=Math.max(10,Math.min(o,t-r-10)),s=Math.max(10,Math.min(s,n-r-10)),this.cursorInformerText){let t=this.cursorInformer.classList.contains(`ui-mode`)?`42px`:`8px`;e.clientY<120?(this.cursorInformerText.style.bottom=`auto`,this.cursorInformerText.style.top=`100%`,this.cursorInformerText.style.marginTop=t,this.cursorInformerText.style.marginBottom=`0`):(this.cursorInformerText.style.top=`auto`,this.cursorInformerText.style.bottom=`100%`,this.cursorInformerText.style.marginTop=`0`,this.cursorInformerText.style.marginBottom=t)}this.cursorInformer.style.transform=`translate(${o}px, ${s}px)`}}onMouseDown(e){if(e.clientX/window.innerWidth,1-e.clientY/window.innerHeight,e.clientX/window.innerWidth,1-e.clientY/window.innerHeight,this.domElement){let t=this.domElement.getBoundingClientRect();(e.clientX-t.left)/t.width,1-(e.clientY-t.top)/t.height}this.currentIntersection&&this.currentObjectTarget?.onMouseDown?.(this.currentObjectTarget,this.currentIntersection)}onMouseLeave(e){this.currentIntersection&&this.currentObjectTarget?.onMouseLeave?.(this.currentObjectTarget,this.currentIntersection)}updateGravityCenter(e){if(this.scene.world&&this.scene.world.gravityCenterForBalls){let e=null;if(this.allIntersections&&this.allIntersections.length>0)for(let t=0;t<this.allIntersections.length;t++){let n=this.allIntersections[t];if(!(n.object&&n.object.userData&&n.object.userData.isPhysicsBall)){e=n;break}}e&&e.point?this.scene.world.gravityCenterForBalls.copy(e.point):(this.raycaster.ray.at(20,this.scene.world.gravityCenterForBalls),this.scene.world.gravityCenterForBalls.x+=2)}}updateInformer(e){this.informerIcon&&(this.informerIcon.style.backgroundImage=`url('${e}')`)}update(){if(this.scene&&(this.scene.isTransitioning||this.scene.raycasterEnabled===!1||this.scene.isPersonaActive)){this.isHoveringRaycastObject&&(this.isHoveringRaycastObject=!1,this.currentObjectTarget?.onMouseLeave?.(),this.currentObjectTarget=null,this.currentIntersection=null,this.currentObject=null,this.cursorInformer&&(this.cursorInformer.style.display=`none`));return}let t=1e-4,n=!this._lastPointer||Math.abs(this._lastPointer.x-this.pointer.x)>t||Math.abs(this._lastPointer.y-this.pointer.y)>t,r=this.camera.matrixWorld.elements,i=!1;if(!this._lastCamMatrix)this._lastCamMatrix=new Float32Array(16),i=!0;else for(let e=0;e<16;e++)if(Math.abs(this._lastCamMatrix[e]-r[e])>t){i=!0;break}if(!n&&!i&&this._hasLastIntersections)return;this._lastPointer||=new e.Vector2,this._lastPointer.copy(this.pointer);for(let e=0;e<16;e++)this._lastCamMatrix[e]=r[e];this.raycaster.setFromCamera(this.pointer,this.camera);let a=this.raycaster.intersectObjects(this.scene.raycastObjects,!0);if(this.allIntersections=a,this._hasLastIntersections=!0,this.updateGravityCenter(),a.length>0){this.currentIntersection=a[0];let e=null,t=a[0].object;for(;t;){if(t.userData&&t.userData.isRaycastTarget){e=t;break}t=t.parent}if(!e){let t=a[0].object;e=t.ignoreRaycast?t.parent:t}this.currentObject=e,this.currentObject!==this.currentObjectTarget&&(this.lastObjectTarget=this.currentObjectTarget,this.currentObjectTarget=this.currentObject,this.lastObjectTarget!==this.currentObjectTarget&&(this.lastObjectTarget?.onMouseLeave?.(),this.currentObjectTarget?.onMouseEnter?.())),this.currentObjectTarget&&this.currentObjectTarget.onMouseHover?.(this.currentObjectTarget,this.currentIntersection)}else this.currentObjectTarget&&(this.isHoveringRaycastObject=!1,this.currentObjectTarget?.onMouseLeave?.(),this.currentObjectTarget=null,this.currentIntersection=null,this.currentObject=null);this.lastObjectTarget=this.currentObjectTarget}dispose(){this.domElement&&this.domElement.removeEventListener(`mousedown`,this._onMouseDown,!1),window.removeEventListener(`pointermove`,this._onPointerMove),window.removeEventListener(`keydown`,this._onKeyDown),this.cursorInformer&&this.cursorInformer.parentNode&&this.cursorInformer.parentNode.removeChild(this.cursorInformer),this.cursorInformer=null,this.informerIcon=null,this.scene&&(this.scene.cursorInformer=null,this.scene.cursorInformerIcon=null,this.scene.raycaster=null)}}}));function Nn(e,t){return Math.random()*(t-e)+e}function Pn(t,n,r=void 0,i=!0){let{scene:a,windowLight:o}=t,s=a.scenarioState&&a.scenarioState.name===`room`,c=a.globalUniformsHub;if(i&&(Vn&&clearInterval(Vn),Vn=setInterval(()=>{Pn(t,Math.random(),void 0,!1)},3e3)),s&&!(!c||!o)&&n>.6){if(a.scenarioState&&a.scenarioState.name!==`room`||!c.enableLightning.value&&n!==2)return;n<1?(r||=new e.Vector2,r.x=Nn(.045,.5),r.y=Nn(-.9,.55)):r||=new e.Vector2(0,0);let t=-.9,i=.55,s=1-(Math.max(t,Math.min(i,r.y))-t)/(i-t);c.isStriking.value=!0,c.normalizedStrikePos.value.copy(r),o.intensity=1e6*(.5+2.5*(1+s)*(1+s)),o.distance=30+113.4*s,o.decay=2.4-.6*s;let l=100+400*s;setTimeout(()=>{c.isStriking.value=!1,o.intensity=0},l)}}function Fn(e){let t=In(e);return t.intensity=0,Pn({scene:e,windowLight:t},Math.random()),t}function In(t){let n=new e.SpotLight;return n.angle=2,n.color=Bn,n.name=`windowLight`,n.position.set(0,5,40),n.visible=!0,t.add(n),t.windowLight=n,n.castShadow=!1,n.color=zn,n.intensity=0,n}function Ln(e){if(!e.bulb||!e.bulbLight)return;let t=e.bulb,n=e.bulbLight,r=e.globalUniformsHub;n.intensity>1?(n.intensity=.001,r&&r.uniforms.uIsOscillating&&(r.uniforms.uIsOscillating.value=0),t.material.visible=!1,t.children[0]&&(t.children[0].visible=!1)):(n.intensity=50,r&&r.uniforms.uIsOscillating&&(r.uniforms.uIsOscillating.value=1),t.material.visible=!0,t.children[0]&&(t.children[0].visible=!0))}function Rn(e,t,n=200){if(!t||!t.uniforms.uBSODState)return;let r=t.uniforms.uBSODState.value;t.uniforms.uBSODState.value=1,setTimeout(()=>{t.uniforms.uBSODState.value=r},n)}var zn,Bn,Vn,Hn=M((()=>{zn=new e.Color(`#88B0FF`),new e.Color(`black`),Bn=new e.Color(`#b9d1ff`),Vn=null})),Un=N({alert:()=>Zn,blackhole:()=>qn,btc:()=>tr,bulb:()=>Kn,computer:()=>nr,eth:()=>er,eye:()=>Qn,heart:()=>Xn,lamp:()=>$n,lightning:()=>Wn,press:()=>Jn,punch:()=>Yn,slide:()=>Gn}),Wn,Gn,Kn,qn,Jn,Yn,Xn,Zn,Qn,$n,er,tr,nr,rr=M((()=>{Wn=`PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDgwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik01MzguMzUgMTYxLjQwNEM1MzYuNzg3IDE1OC42NzkgNTMzLjg4OCAxNTcgNTMwLjc0NyAxNTdIMzUwLjA2OEMzNDYuMzA3IDE1NyAzNDIuOTY1IDE1OS4zOTkgMzQxLjc2MiAxNjIuOTYzTDI2NC4zMjggMzkyLjM5NkMyNjMuNDI2IDM5NS4wNzEgMjYzLjg2OCAzOTguMDE3IDI2NS41MTMgNDAwLjMxQzI2Ny4xNiA0MDIuNjAzIDI2OS44MSA0MDMuOTYzIDI3Mi42MzQgNDAwLjM2M0gzNDYuMDQxTDI2MS41NTUgNjMwLjE2OEMyNjAuMDYxIDYzNC4xNjggMjYxLjY2NyA2MzguNjYyIDI2NS4zNTggNjQwLjgxQzI2Ni43MzcgNjQxLjYxMiAyNjguMjU2IDY0MiAyNjkuNzYzIDY0MkMyNzIuMjg3IDY0MiAyNzQuNzczIDY0MC45MTEgMjc2LjQ4OSA2MzguODZMNTExLjY1OSAzNTcuODA1QzUxMy44NDQgMzU1LjE5NCA1MTQuMzE5IDM1MS41NTUgNTEyLjg3OCAzNDguNDcxQzUxMS40MzkgMzQ1LjM4NyA1MDguMzQyIDM0My40MTUgNTA0LjkzNyAzNDMuNDE1SDQzNy4wNDRMNTM4LjMxNSAxNzAuMTlDNTM5Ljg5OSAxNjcuNDc4IDUzOS45MTMgMTY0LjEyOCA1MzguMzUgMTYxLjQwNFpNNDE0LjE5OCAzNDcuNzU1QzQxMi42MTMgMzUwLjQ2NiA0MTIuNTk5IDM1My44MTcgNDE0LjE2MyAzNTYuNTQxQzQxNS43MjUgMzU5LjI2NSA0MTguNjI1IDM2MC45NDQgNDIxLjc2NSAzNjAuOTQ0SDQ4Ni4xNzJMMjk1Ljg4MSA1ODguMzY2TDM2Ni44ODMgMzk4LjI2NUMzNjcuODg4IDM5NS41NzQgMzY3LjUxIDM5Mi41NjIgMzY1Ljg3MiAzOTAuMjAxQzM2NC4yMzUgMzg3Ljg0MSAzNjEuNTQ0IDM4Ni40MzMgMzU4LjY3MiAzODYuNDMzSDI4NC44NDNMMzU2LjM2IDE3NC41M0g1MTUuNDY5TDQxNC4xOTggMzQ3Ljc1NVoiIGZpbGw9IndoaXRlIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIwIi8+Cjwvc3ZnPgo=`,Gn=`PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gVXBsb2FkZWQgdG86IFNWRyBSZXBvLCB3d3cuc3ZncmVwby5jb20sIEdlbmVyYXRvcjogU1ZHIFJlcG8gTWl4ZXIgVG9vbHMgLS0+DQo8c3ZnIGZpbGw9IiNmZmZmZmYiIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iLTYuNSAwIDMyIDMyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQo8dGl0bGU+c2xpZGUtaC1hbHQ8L3RpdGxlPg0KPHBhdGggZD0iTTE4LjI0IDE0LjA0MGgtMTcuNGMtMC40OCAwLTAuODQtMC4zNi0wLjg0LTAuODRzMC4zNi0wLjg0IDAuODQtMC44NGgxNC45MmwtMS45Mi0xLjQ0Yy0wLjM2LTAuMjgtMC40NC0wLjgtMC4xNi0xLjIgMC4yOC0wLjM2IDAuOC0wLjQ0IDEuMi0wLjE2bDMuOTIgMi45NmMwLjI4IDAuMiAwLjQgMC42IDAuMjggMC45Ni0wLjE2IDAuMzItMC40OCAwLjU2LTAuODQgMC41NnpNNC43NiAyMi42Yy0wLjE2IDAtMC4zNi0wLjA0MC0wLjUyLTAuMTZsLTMuOTItMi45NmMtMC4yOC0wLjItMC40LTAuNi0wLjI4LTAuOTZzMC40NC0wLjU2IDAuOC0wLjU2aDE3LjRjMC40OCAwIDAuODQtMC4zNiAwLjgwIDAuODRzLTAuMzYgMC44NC0wLjg0IDAuODRoLTE0Ljg4bDEuOTIgMS40NGMwLjM2IDAuMjggMC40NCAwLjggMC4xNiAxLjItMC4yIDAuMjQtMC40NCAwLjMyLTAuNjggMC4zMnoiPjwvcGF0aD4NCjwvc3ZnPg==`,Kn=`PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDgwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0zMDQgNTI4SDQ5Nk0zNTIgNjQwVjY1NkMzNTIgNjczLjY3NCAzNjYuMzI2IDY4OCAzODQgNjg4SDQxNkM0MzMuNjc0IDY4OCA0NDggNjczLjY3NCA0NDggNjU2VjY0ME01NzYgMzIwQzU3NiAzODIuMDggNTU2LjczIDQxNS4yNTQgNTI1LjY3IDQ1OC43NzhDNTA2LjQ3NCA0ODUuNjc0IDQ5NiA1MTcuNzQxIDQ5NiA1NTAuNzg0VjU5MkM0OTYgNjA5LjY3NCA0ODEuNjc0IDYyNCA0NjQgNjI0SDMzNkMzMTguMzI3IDYyNCAzMDQgNjA5LjY3NCAzMDQgNTkyVjU1MC43ODRDMzA0IDUxNy43NDEgMjkzLjUyNSA0ODUuNjc0IDI3NC4zMzEgNDU4LjY3OEMyNDMuMjY5IDQxNS4yNTQgMjI0IDM4Mi4wOCAyMjQgMzIwQzIyNCAyMjQgMzA0IDE0NCA0MDAgMTQ0QzQ5NiAxNDQgNTc2IDIyNCA1NzYgMzIwWiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzOC40Ii8+Cjwvc3ZnPgo=`,qn=`PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDgwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik00MDAgNDQ4QzM3My40OSA0NDggMzUyIDQyNi41MSAzNTIgNDAwQzM1MiAzNzMuNDkgMzczLjQ5IDM1MiA0MDAgMzUyQzQyNi41MSAzNTIgNDQ4IDM3My40OSA0NDggNDAwQzQ0OCA0MjYuNTEgNDI2LjUxIDQ0OCA0MDAgNDQ4WiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzMCIvPgo8cGF0aCBkPSJNMzk5Ljk5OSAzNTJDMjc5Ljk5OSAzNTIgMjg5LjU5OSA2NDAgNDcxLjk5OSA2NDAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMzAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8cGF0aCBkPSJNMzkyLjUyNCA0NDhDNTEyLjUyMyA0NDggNTAyLjkyMyAxNjAgMzIwLjUyNCAxNjAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMzAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8cGF0aCBkPSJNNDMyLjg0IDM2OC43MDZDMzQ3Ljk4OCAyODMuODUzIDE1MS4xMzEgNDk0LjI4OSAyODAuMTA3IDYyMy4yNjUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMzAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWRhc2hhcnJheT0iNjYuNjcgNjYuNjciLz4KPHBhdGggZD0iTTM1OS42ODMgNDMxLjI5NEM0NDQuNTM0IDUxNi4xNDggNjQxLjM5MiAzMDUuNzliyIDUxMi40MTYgMTc2LjczNiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtZGFzaGFycmF5PSI2Ni42NyA2Ni42NyIvPgo8cGF0aCBkPSJNNDI3LjU2NiA0MzYuNTgxQzUxMi40MTggMzUxLjcyNyAzMDEuOTg0IDE1NC44NjkgMTczLjAwOCAyODMuODQ1IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjMwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1kYXNoYXJyYXk9IjY2LjY3IDY2LjY3Ii8+CjxwYXRoIGQ9Ik0zNjQuOTU1IDM2My40MTlDMjgwLjEwMyA0NDguMjcxIDQ5MC41MzcgNjQ1LjEzMSA2MTkuNTEzIDUxNi4xNTUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMzAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWRhc2hhcnJheT0iNjYuNjcgNjYuNjciLz4KPHBhdGggZD0iTTQ0OCA0MDcuNDc2QzQ0OCAyODcuNDc2IDE2MC4wMDEgMjk3LjA3NiAxNjAuMDAxIDQ3OS40NzYiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMzAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8cGF0aCBkPSJNMzUyIDQwMEMzNTIgNTIwIDYzOS45OTkgNTEwLjQgYzM5Ljk5OSAzMjgiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMzAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K`,Jn=`PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDgwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik02NTIuMzE2IDUxNi4zMTVDNjUxLjgwNSA1MTQuMjUzIDY1MS4wODIgNTEyLjI0MiA2NTAuMTU4IDUxMC4zMUM2NTAuMDg2IDUxMC4xMTIgNjQ5Ljk4OCA1MDkuODU2IDY0OS44NDMgNTA5LjUzN0M2NDkuNjI4IDUwOS4wNDggNjQ5LjM3MyA1MDguNTc1IDY0OS4wOCA1MDguMTIzTDU5MS43NCAzOTIuMDk1QzU4OS4wNTIgMzg2LjY0NiA1ODQuODI3IDM4MS45ODUgNTc5LjUxOSAzNzguNjE0QzU3NC4yMTEgMzc1LjI0MiA1NjguMDIgMzczLjI4OCA1NjEuNjE0IDM3Mi45NlY1MTYuMzE1SDY1Mi4zMTZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzYwIDM3Mi45NlY1MTYuMzE1SDY1Mi4zMTZMMzYwIDM3Mi45NloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0zOTcgMzcyLjk2QzM4Ni41NTkgMzcyLjk2IDM3Ni41NDYgMzc0Ljk0NiAzNjcuNDM1IDM3OC42MTRDMzYyLjEyNyAzODEuOTg1IDM1Ny45MDIgMzg2LjY0NiAzNTUuMjE0IDM5Mi4wOTVMMjk3LjExIDUwOC4xMjNDMjk3LjU4MSA1MDguNTc1IDI5Ny4zMjYgNTA5LjA0OCAyOTcuMTEgNTA5LjUzN0MyNjkuOTY2IDUwOS44NTYgMjY5Ljg2OCA1MTAuMTEyIDI2OS43OTcgNTEwLjMxQzI2OC44NzEgNTEyLjI0MiAyNjguMTQ4IDUxNC4yNTMgMjY3LjYzOCA1MTYuMzE1SDM2MFYzNzIuOTZIMzk3WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTI2Ny42MzggNTE2LjMxNUgzNjBWOzUySDc0Ljg0MjIgQzc0Ljg0MjIgODUyIDczLjgzMzcgODUxLjg4MiA3My4wMzg3IDg1MS42MjhDNzIuMjQzNiA4NTEuMzc0IDcxLjY2MDYgODUwLjk4MyA3MS4yODk3IDg1MC40NTRDNzAuOTE4OSA4NDkuOTI1IDcwLjc2MDEgODQ5LjI1OCA3MC44MTMzIDg0OC40NTRDNzAuODY2NiA4NDcuNjUxIDcxLjEzMTkgODQ2LjcxNCA3MS42MDkyIDg0NS42NDJMMTUxLjUzMiA2NjVIMjY3LjYzOFY1MTYuMzE1WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTM2MCA1MTYuMzE1Vjg1Mkg2NTIuMzE2VjUxNi4zMTVIMzYwWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTU2MS42MTQgMzcyLjk2SDM5N1Y1MTYuMzE1SDY1Mi4zMTZMNTYxLjYxNCAzNzIuOTZaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K`,Yn=`PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDgwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yOTUuNzI2IDE0MS45MzhDMTUxLjAxNyAxNDEuOTM4IDM0IDIzOC42ODEgMzQgMzU4LjA0NUMzNCA0MjUuMDczIDc3LjQ2NDIgNDgzLjU2OCAxNDUuNTA2IDUxOC4yNThDMTE4Ljk4OSA2MTQuNTY2IDI5NS43MjYgNjYxIDI5NS43MjYgNjYxQzI5NS43MjYgNjYxIDM2Ni4xMSA2NTguMjg0IDQxOC4yOTcgNjM3LjQ4NEM0MTguMjk3IDYzNy40ODQgNTk1LjY2MyA1NTkuNjI1IDU5NS42NjMgMzU4LjA0NUM1OTUuNjYzIDIzOC42ODEgNDc4LjYzMSAxNDEuOTM4IDI5NS43MjYgMTQxLjkzOFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik02NDAuMzc0IDY2MVY1MDcuODIzQzc0OC44MTggNDcwLjQ3IDgyOCA0MDcuOTMzIDgyOCAzMzZDMzI4IDIxNC40OTYgNzI4IDExNi4wMDIgNjA4IDExNi4wMDJDNDg3Ljk5OCAxMTYuMDAyIDM5MiAyMTQuNDk2IDM5MiAzMzZDMzkyIDM1Ny40MTYgMzk3LjMzOCAzNzcuNDYyIDQwNi45MzggMzk1LjM5OEM0MDYuOTM4IDM5NS4zOTggMjYzLjU0NCAzNzUuOTQ3IDI3Mi4xMzcgNDk3LjAzOUMyNzIuMTM3IDQ5Ny4wMzkgMjg4Ljc0NCA2NjEgNjQwLjM3NCA2NjFaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K`,Xn=`PHN2ZyB3aWR0aD0iNDgwIiBoZWlnaHQ9IjQ4MCIgdmlld0JveD0iMCAwIDQ4MCA0ODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0zNjAgMjM5Ljk5OEgzNDMuOTcyQzMyNy4zNzggMjM5Ljk5OCAzMTkuMDgyIDIzOS45OTggMzEyLjIwNCAyNDMuODkyQzMwNS4zMjggMjQ3Ljc4NiAzMDEuMDU4IDI1NC45IDI5Mi41MjIgMjY5LjEyOEwyOTEuOTA0IDI3MC4xNThDMjgzLjk1MiAyODMuNDEyIDI3OS45NzQgMjkwLjA0IDI3NC4xOSAyODkuOTNDMjY4LjQwNCAyODkuODIyIDI2NC42NzggMjgzLjA1IDI1Ny4yMyAyNjkuNTA2TDIyMy40ODQgMjA4LjE1QzIxNi41MzggMTk1LjUyMSAyMTMuMDY2IDE4OS4yMDcgMjA3LjUxOCAxODguOTA3QzIwMS45NzIgMTg4LjYwOCAxOTcuODQgMTk0LjUxMiAxODkuNTc1IDIwNi4zMThMMTgzLjkxNSAyMTQuNDA2QzE3NS4xMzYgMjI2Ljk0NiAxNzAuNzQ3IDIzMy4yMTYgMTY0LjIzNSAyMzYuNjA2QzE1Ny43MjIgMjM5Ljk5OCAxNTAuMDY4IDIzOS45OTggMTM0Ljc2MSAyMzkuOTk4SDEyMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSI1MCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxwYXRoIGQ9Ik0yNDAgMTEwLjAxMkwyMjkuMTkyIDEyMC40MTRDMjMyLjAyIDEyMy4zNTIgMjM1LjkyMiAxMjUuMDEyIDI0MCAxMjUuMDEyQzI0NC4wNzggMTI1LjAxMiAyNDcuOTggMTIzLjM1MiAyNTAuODA4IDEyMC40MTRMMjQwIDExMC4wMTJaTTUzLjEzMzIgMjY3LjkyOEM1Ny41MTE2IDI3NC45NiA2Ni43NjIyIDI3Ny4xMTIgNzMuNzk0OCAyNzIuNzM0QzgwLjgyNzQgMjY4LjM1NiA4Mi45NzkgMjU5LjEwNCA3OC42MDA2IDI1Mi4wNzJMNTMuMTMzMiAyNjcuOTI4Wk0xMzAuNTk0IDMxNS40MzZDMTI0LjcyOSAzMDkuNTg2IDExNS4yMzIgMzA5LjU5NiAxMDkuMzgxIDMxNS40NjJDMTAzLjUzIDMyMS4zMjYgMTAzLjU0MSAzMzAuODI0IDEwOS40MDYgMzM2LjY3NEwxMzAuNTk0IDMxNS40MzZaTTU1IDE4Mi43NDFDNTUgMTI2LjY4NCA4MC4xNDQ0IDkxLjkwMTUgMTExLjU4NCA3OS45NDIzQzE0My4xMDkgNjcuOTUwNyAxODcuMDI2IDc2LjYwNDEgMjI5LjE5MiAxMjAuNDE0TDI1MC44MDggOTkuNjEwMUMyMDIuOTc4IDQ5LjkxNjcgMTQ2Ljg5NCAzNC40MTEzOSAxMDAuOTE4IDUxLjkwMjVDNTQuODU3MiA2OS40MjMzIDI1IDExNy43NTcgMjUgMTgyLjc0MUg1NVpNMzEwLjA1MiAzODkuOTk4QzMzOS44OTggMzY2LjQ2OCAzNzUuNjc0IDMzNC45MjIgNDA0LjEyMiAyOTkuNjc2QzQzMi4yNTIgMjY0LjgyNCA0NTUgMjI0LjE3OCA0NTUgMTgyLjc0MUg0MjVUNDI1IDIxMy43NiA0MDcuNTU0IDI0Ny42NTggMzgwLjc3OCAyODAuODM0QzM1NC4zMiAzMTMuNjE0IDMyMC40NzggMzQzLjU3NiAyOTEuNDggMzY2LjQzOEwzMTAuMDUyIDM4OS45OThZNNDU1IDE4Mi43NDFDNDU1IDExNy43NTcgNDI1LjE0MiA2OS40MjMxIDM3OS4wODIgNTEuOTAyM0MzMzMuMTA2IDM0LjQxNDEgMjc3LjAyMiA0OS45MTY3IDIyOS4xOTIgOTkuNjEwMUwyNTAuODA4IDEyMC40MTRDMjkyLjk3NCA3Ni42MDQxIDMzNi44OSA2Ny45NTA3IDM2OC40MTYgNzkuOTQyM0MzOTkuODU2IDkxLjkwMTMgNDI1IDEyNi42ODQgNDI1IDE4Mi43NDFINDU1Wk0xNjkuOTQ4IDM4OS45OTZDMTk1LjQzNCA0MTAuMDg4IDIxMy4wMDIgNDI0LjcxOCAyNDAgNDI0LjcxOFYzOTQuNzE4QzIyNS4zODYgMzk0LjcxOCAyMTYuMzE0IDM4OC4zNDggMTg4LjUyMSAzNjYuNDM4TDE2OS45NDggMzg5LjOpenMjkxLjQ4IDM2Ni40MzhDMjYzLjY4NiAzODguMzQ4IDI1NC42MTQgMzk0LjcxOCAyNDAgMzk0LjcxOFYzOTUuNzE4QzI2Ni45OTggNDI0LjcxOCAyODQuNTY2IDQxMC4wODggMzEwLjA1MiAzODkuOTk4TDI5MS40OCAzNjYuNDM4Wk03OC42MDA2IDI1Mi4wNzJDNjMuNjgwNiAyMjguMTA4IDU1IDIwNC42MjQgNTUgMTgyLjc0MUgyNUMyNSAyMTIuMzQgMzY2LjEwOCAyNDEuMzkgNTMuMTMzMiAyNjcuOTI4TDc4LjYwMDYgMjUyLjA3MlpNMTg4LjUyMSAzNjYuNDM4QzE3MC4xODIgMzUxLjkyIDE0OS44MTkgMzM0LjYxNCAxMzAuNTk0IDMxNS40MzZMMTA5LjQwNiAzMzYuNjc0QzEyOS42NjkgMzU2LjherdIDE1MC45NjQgMzc1LjAzIDE2OS45NDggMzg5LjOpenExODguNTIxIDM2Ni40MzhaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K`,Zn=`PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDgwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQwMCAxNTBMNzUwIDcwMEg1MEw0MDAgMTUwWiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSI0MCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik00MDAgMzUwVjU1MCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSI0MCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PGNpcmNsZSBjeD0iNDAwIiBjeT0iNjIwIiByPSIyMCIgZmlsbD0id2hpdGUiLz48L3N2Zz4=`,Qn=`PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDgwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwMCA0MDBDMTAwIDQwMCAyNTAgMjAwIDQwMCAyMDBDNTUwIDIwMCA3MDAgNDAwIDcwMCA0MDBDNzAwIDQwMCA1NTAgNjAwIDQwMCA2MDBDMjUwIDYwMCAxMDAgNDAwIDEwMCA0MDBaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjQwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PGNpcmNsZSBjeD0iNDAwIiBjeT0iNDAwIiByPSIxMDAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iNDAiLz48L3N2Zz4=`,$n=Kn,er=Kn,tr=Kn,nr=Gn})),ir,ar=M((()=>{ir={box:new e.BoxGeometry(1,1,1),sphere:new e.SphereGeometry(.5,32,32),plane:new e.PlaneGeometry(1,1),circle:new e.CircleGeometry(.5,32),cylinder:new e.CylinderGeometry(.5,.5,1,32),cone:new e.ConeGeometry(.5,1,32),torus:new e.TorusGeometry(.5,.2,16,100)}}));function or(e){if(!Number.isInteger(e)||e<1||e>7)return console.error(`Error: Input must be an integer between 1 and 7.`),[];let t=[],n=Math.PI;if(e===1)return t.push({x:0,y:0}),t;if(e>=2&&e<=4){let r=.2*mr,i=e,a=-n/2;for(let e=0;e<i;e++){let o=2*n*e/i+a,s=r*Math.cos(o),c=r*Math.sin(o);t.push({x:parseFloat(s.toFixed(4)),y:parseFloat(c.toFixed(4))})}return t}if(e>=5&&e<=7){t.push({x:0,y:0});let r=.35*mr,i=e-1,a=-n/2;for(let e=0;e<i;e++){let o=2*n*e/i+a,s=r*Math.cos(o),c=r*Math.sin(o);t.push({x:parseFloat(s.toFixed(4)),y:parseFloat(c.toFixed(4))})}return t}return t}function sr(e,t){let n=e.initialParent||e.parent,r={uuid:e.uuid,name:e.name,position:e.position.clone(),rotation:{x:e.rotation.x,y:e.rotation.y,z:e.rotation.z,order:e.rotation.order},scale:e.scale.clone(),parent:n};t.tweenData=t.tweenData||{},t.tweenData[e.uuid]=r}function cr(t,n=4){t.bhTargets||=[];let r=t.world,i=new e.Mesh(pr,gn),a=mr*1.25;i.scale.setScalar(a),t.add(i),i.name=`dragonBall${n}Stars`,Oo(t,i),i.castShadow=!0,i.ignoreRaycast=!0,i.userData.isPhysicsBall=!0,i.userData.isDragonBall=!0,i.userData.starCount=n;let o=new e.Mesh(pr,_n);if(o.name=`Aura${n}Stars`,o.scale.setScalar(2.2),i.add(o),o.ignoreRaycast=!0,t.world.isBusy)return setTimeout(()=>cr(t,n),16),t.remove(i),null;t.world.isBusy=!0;let s;try{s=r.createRigidBody(b.RigidBodyDesc.dynamic().setTranslation(i.position.x,i.position.y,i.position.z).setCanSleep(!1))}finally{t.world.isBusy=!1}let c=b.ColliderDesc.ball(a/2).setRestitution(.4).setMass(1);return i.rapierBody=s,i.rapierShape=c,s.threeMesh=i,s.rapierShape=c,t.world.ballBodies=t.world.ballBodies||[],t.world.ballBodies.push(s),wn(t,i,{onMouseEnter:e=>{let r=`UI_INFORMER_DRAGONBALL_${n}`;t.raycasterWrapper?.mouseInContainer&&H(t,Yn,R(r)),t.gazeFollower&&t.gazeFollower.lookAtTarget(e)},onMouseLeave:()=>{U(t),t.gazeFollower&&t.gazeFollower.lookAtTarget(t.camera)},onMouseDown:(e,n)=>lr(t,e,n)}),or(n).forEach(t=>{let r=new e.Mesh(yr,br);r.scale.setScalar(1.5*(.049*n*n-.467*n+1.618)),r.name=`star`,r.position.set(t.x,t.y,0),i.add(r)}),sr(i,t),t.bhTargets.push(i),t.dragonBalls=t.dragonBalls||[],t.dragonBalls.push(i),i}function lr(t,n,r){ur(t,n,r);let i=dr(t);Ko(t,n,``,null,`db-click-${n.uuid}`,!1,16763904,!1,500),i||fr(t);let a=n.position.clone(),o=Math.floor(Math.random()*5)+1;for(let e=0;e<o;e++){let e={x:(Math.random()-.5)*12,y:18+Math.random()*10,z:(Math.random()-.5)*12};Fi(t,a.clone().add({x:0,y:.5,z:0}),e)}t.physicBodies&&t.physicBodies.forEach(t=>{if(!t.threeObject||t.threeObject===n)return;let r=t.threeObject.position.distanceTo(a);if(r<10){let n=new e.Vector3().subVectors(t.threeObject.position,a).normalize(),i=(1-r/10)*8;t.applyImpulse({x:n.x*i,y:i*1.5,z:n.z*i},!0)}}),typeof qa==`function`&&(qa(t,1e3),t._dragonEyeTimeout&&clearTimeout(t._dragonEyeTimeout),t._dragonEyeTimeout=setTimeout(()=>{typeof Ja==`function`&&Ja(t,2e3)},5e3)),typeof Z==`function`&&Z(`ANOMALY_0${n.userData.starCount||7}: DIMENSIONAL_KEY_ACTIVE`)}function ur(e,t,n){t&&n&&On(e,t,n)}function dr(e,t=null){return t===null?e.world.hasPointGravityOnBalls=!e.world.hasPointGravityOnBalls:e.world.hasPointGravityOnBalls=t,e.world.hasPointGravityOnBalls}function fr(t){t.world.ballBodies&&t.world.ballBodies.forEach(n=>{n.threeMesh&&n.threeMesh.children&&n.threeMesh.children[0]&&(n.threeMesh.children[0].visible=!0);let r=n.translation(),i=t.world.gravityCenterForBalls,a=new e.Vector3(i.x-r.x,Math.abs(i.y-r.y),i.z-r.z).normalize().multiplyScalar(-Math.random()*50*n.mass());n.applyImpulse({x:a.x,y:a.y,z:a.z},!1)})}var pr,mr,hr,gr,_r,vr,yr,br,xr=M((()=>{ar(),Sn(),He(),Mn(),ao(),rr(),Ae(),ls(),ea(),ks(),pr=ir.sphere,mr=.5,hr=new e.Shape,gr=5,_r=.15*mr,vr=.07*mr;for(let e=0;e<gr*2;e++){let t=e/(gr*2)*Math.PI*2,n=e%2==0?_r:vr,r=Math.cos(t)*n,i=Math.sin(t)*n;e===0?hr.moveTo(r,i):hr.lineTo(r,i)}hr.closePath(),yr=new e.ShapeGeometry(hr),br=new e.MeshBasicMaterial({color:16498077,side:e.DoubleSide,toneMapped:!1}),new e.Vector3(0,0,0)}));async function Sr(){try{let e=localStorage.getItem(Cr);if(e){let{timestamp:t,data:n}=JSON.parse(e);if(Date.now()-t<wr)return n}let t=await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false`);if(!t.ok)throw Error(`API Error: ${t.status}`);let n=(await t.json()).map(e=>({name:e.name,symbol:e.symbol,current_price:e.current_price,image:e.image}));return localStorage.setItem(Cr,JSON.stringify({timestamp:Date.now(),data:n})),n}catch(e){return console.warn(`[CryptoParams] Fetch failed, using Mock Data:`,e),Tr}}var Cr,wr,Tr,Er=M((()=>{Cr=`crypto_top_10_cache`,wr=600*1e3,Tr=[{name:`Bitcoin`,symbol:`btc`,current_price:65e3,image:`https://assets.coingecko.com/coins/images/1/large/bitcoin.png`},{name:`Ethereum`,symbol:`eth`,current_price:3500,image:`https://assets.coingecko.com/coins/images/279/large/ethereum.png`},{name:`Tether`,symbol:`usdt`,current_price:1,image:`https://assets.coingecko.com/coins/images/325/large/Tether.png`},{name:`BNB`,symbol:`bnb`,current_price:600,image:`https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png`},{name:`Solana`,symbol:`sol`,current_price:140,image:`https://assets.coingecko.com/coins/images/4128/large/solana.png`},{name:`USDC`,symbol:`usdc`,current_price:1,image:`https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png`},{name:`XRP`,symbol:`xrp`,current_price:.6,image:`https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png`},{name:`Dogecoin`,symbol:`doge`,current_price:.15,image:`https://assets.coingecko.com/coins/images/5/large/dogecoin.png`},{name:`Toncoin`,symbol:`ton`,current_price:7,image:`https://assets.coingecko.com/coins/images/17980/large/ton_symbol.png`},{name:`Cardano`,symbol:`ada`,current_price:.45,image:`https://assets.coingecko.com/coins/images/975/large/cardano.png`}]}));function Dr(t,n,r={}){let{idleClipName:i=`typing`,crossFadeDuration:a=.5,randomize:o=!1,speed:s=1,onComplete:c=null,autoReturn:l=!0}=r;if(!t.mixer||!t.heroClips){console.warn(`Animation Manager: Mixer or heroClips not found on scene.`);return}let u=t.heroClips.find(e=>e.name===n);if(!u){console.warn(`Animation Manager: Clip "${n}" not found.`);return}let d=t.mixer.clipAction(u);if(t.activeAction===d&&d.isRunning())return;d.reset(),s<0&&(d.time=u.duration);let f=u.duration,p=1;if(o){if(p=.8+Math.random()*1.2,d.timeScale=p,d.setEffectiveWeight(.8+Math.random()*.2),Math.random()>.5){let e=.6+Math.random()*.2;f=u.duration*e}}else d.timeScale=s,d.setEffectiveWeight(1),p=s;if(n===i?(d.setLoop(e.LoopRepeat),d.clampWhenFinished=!1):(d.setLoop(e.LoopOnce),d.clampWhenFinished=!0),d.play(),t.activeAction&&t.activeAction!==d&&t.activeAction.crossFadeTo(d,a),t.activeAction=d,n!==i){let n=!1,r=()=>{if(n)return;n=!0;let r=t.heroClips.find(e=>e.name===i);if(r){let n=t.mixer.clipAction(r);l&&(n.reset(),n.setLoop(e.LoopRepeat),n.play(),d.crossFadeTo(n,a),t.activeAction=n,Z&&Z(`Returning to idle...`)),c&&c()}};if(o&&f<u.duration){let e=f/p*1e3;setTimeout(r,e)}else{let e=n=>{n.action===d&&(t.mixer.removeEventListener(`finished`,e),r())};t.mixer.addEventListener(`finished`,e)}}return{action:d,duration:f/p}}var Or=M((()=>{ks()}));function kr(e,t){if(jr.add({body:e,onApex:t,startTime:performance.now()}),!Mr){Mr=!0;let e=()=>{let t=window.scene?window.scene.world:null;if(t&&t.isBusy){requestAnimationFrame(e);return}if(jr.size===0){Mr=!1;return}let n=performance.now();jr.forEach(e=>{(e.body.linvel().y<=.01||n-e.startTime>1500)&&(e.onApex(),jr.delete(e))}),requestAnimationFrame(e)};requestAnimationFrame(e)}}function Ar(t,n,r,i,a,o,s=null,c=null){let l=performance.now(),u=Math.max(200,i-l),d=window.scene&&window.scene.world?window.scene.world:null;if(d&&d.isBusy)return;let f=t.translation(),p=new e.Vector3(f.x,f.y,f.z),m=t.linvel(),h=new e.Vector3(m.x,m.y,m.z);t.setNextKinematicTranslation(p),t.setBodyType(b.RigidBodyType.KinematicPositionBased);let g=p.clone().add(h.multiplyScalar(.45));if(c){let t=new e.Line3(p,n),r=new e.Vector3;t.closestPointToPoint(c,!0,r);let i=r.distanceTo(c),a=1.75;if(i<a){let t=new e.Vector3().subVectors(r,c).normalize();(t.lengthSq()<.05||Math.abs(t.y)>.9)&&t.set(0,1.2,.2).normalize();let n=(a-i)*4.5;g.add(t.multiplyScalar(n)),r.y<3&&(g.y+=(a-i)*1.5)}}let _=new e.QuadraticBezierCurve3(p,g,n),y=t.rotation(),x=new e.Quaternion(y.x,y.y,y.z,y.w);t._activeReturnTween&&t._activeReturnTween.stop();let S={t:0},C=new v.Tween(S).to({t:1},u).easing(v.Easing.Cubic.InOut).onUpdate(()=>{if(d&&d.isBusy)return;let e=_.getPoint(S.t);try{d&&(d.isBusy=!0),t.setNextKinematicTranslation(e),t.setNextKinematicRotation(x.clone().slerp(r,S.t)),d&&(d.isBusy=!1)}catch(e){console.error(`[PhysicsUtils] Kinematic update failed:`,e.message),d&&(d.isBusy=!1)}s&&s(e,S.t)}).onComplete(()=>{t._activeReturnTween=null;let e=Math.random()*200;setTimeout(()=>{d&&d.isBusy;try{d&&(d.isBusy=!0),t.setBodyType(a),t.setLinvel({x:0,y:0,z:0},!0),t.setAngvel({x:0,y:0,z:0},!0),t.rapierCollider&&t.rapierCollider.setSensor(!1),d&&(d.isBusy=!1)}catch(e){console.error(`[PhysicsUtils] Body reset failed:`,e.message),d&&(d.isBusy=!1)}o&&o()},e)});t._activeReturnTween=C,C.start()}var jr,Mr,Nr=M((()=>{jr=new Set,Mr=!1}));function Pr(e,t={}){Br(e,t,`water`),Rr(e,`vertex`,`vPatchedUv`,`vec2`),zr(e,`vertex`,`vPatchedUv = uv;`);let n=`
        ${e.fragmentShader.includes(`uniform float iTime;`)?``:`uniform float iTime;`}
        uniform float uWaterIntensity;
        vec2 vWarpedUv;

        const float speed = 0.15;
        const float speed_x = -0.2;
        const float speed_y = -0.2;
        const float emboss = 0.50;
        const float intensity = 2.5;
        const int steps = 6;
        const float frequency = 5.0;
        const int angle = 7;
        const float delta = 60.;
        const float gain = 800.;
        const float reflectionCutOff = 0.012;
        const float reflectionIntensity = 150000.;

        float getWaterCol(vec2 coord, float time) {
            float delta_theta = 2.0 * 3.14159 / float(angle);
            float c = 0.0;
            for (int i = 0; i < steps; i++) {
                vec2 adjc = coord;
                float theta = delta_theta * float(i);
                adjc.x += cos(theta) * time * speed + time * speed_x;
                adjc.y -= sin(theta) * time * speed - time * speed_y;
                c = c + cos((adjc.x * cos(theta) - adjc.y * sin(theta)) * frequency) * intensity;
            }
            return cos(c);
        }
    `;e.fragmentShader.includes(`#include <common>`)?e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
`+n):e.fragmentShader=n+`
`+e.fragmentShader,zr(e,`fragment`,`
        float wTime = iTime * 1.2;
        vec2 waterP = vPatchedUv * vec2(12.0, 15.0); 
        float cc1 = getWaterCol(waterP, wTime);

        vec2 p2 = waterP;
        p2.x += 1.0 / delta;
        float dx = emboss * (cc1 - getWaterCol(p2, wTime)) / delta;

        p2 = waterP;
        p2.y += 1.0 / delta;
        float dy = emboss * (cc1 - getWaterCol(p2, wTime)) / delta;

        vWarpedUv = vPatchedUv + vec2(dx, dy) * (2.5 * uWaterIntensity);
    `),e.fragmentShader=e.fragmentShader.replace(/UV\s*=\s*vUv/g,`UV = vWarpedUv`).replace(/texture2D\(\s*map\s*,\s*vMapUv\s*\)/g,`texture2D( map, vWarpedUv )`).replace(/texture2D\(\s*roughnessMap\s*,\s*vMapUv\s*\)/g,`texture2D( roughnessMap, vWarpedUv )`).replace(/texture2D\(\s*metalnessMap\s*,\s*vMapUv\s*\)/g,`texture2D( metalnessMap, vWarpedUv )`).replace(/texture2D\(\s*bumpMap\s*,\s*vMapUv\s*\)/g,`texture2D( bumpMap, vWarpedUv )`).replace(/texture2D\(\s*iChannel([0-9X])\s*,\s*(vUv|uv)\s*\)/g,`texture2D( iChannel$1, vWarpedUv )`).replace(/textureLod\(\s*iChannelX\s*,\s*UV\+n\s*,\s*focus\s*\)/g,`textureLod( iChannelX, vWarpedUv+n, focus )`).replace(/texture2D\(\s*fireFliesTexture\s*,\s*uv\s*\)/g,`texture2D( fireFliesTexture, vWarpedUv )`),e.fragmentShader.includes(`#include <normal_fragment_begin>`)&&(e.fragmentShader=e.fragmentShader.replace(`#include <normal_fragment_begin>`,`
            #include <normal_fragment_begin>
            normal = normalize(normal + vec3(dx, dy, 0.0) * (12.0 * uWaterIntensity));
            `)),e.fragmentShader.includes(`#include <dithering_fragment>`)&&(e.fragmentShader=e.fragmentShader.replace(`#include <dithering_fragment>`,`
            #include <dithering_fragment>
            float waterAlpha = 1.0 + dot(dx, dy) * gain;
            float ddx = dx - reflectionCutOff;
            float ddy = dy - reflectionCutOff;
            if (ddx > 0. && ddy > 0.) {
                waterAlpha = pow(abs(waterAlpha), ddx * ddy * reflectionIntensity);
                gl_FragColor.rgb += vec3(waterAlpha) * 0.4;
            }
            `))}function Fr(e,t={}){if(Br(e,t,`grid`),Rr(e,`vertex`,`vPatchedUv`,`vec2`),Rr(e,`vertex`,`vWorldPos`,`vec3`),zr(e,`vertex`,`vPatchedUv = uv;`),zr(e,`vertex`,`vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;`),e.fragmentShader.includes(`Holographic Grid Overlay`))return;let n=`
        ${e.fragmentShader.includes(`uniform float iTime;`)?``:`uniform float iTime;`}
        uniform float uWorldGridSize;
        uniform float uWorldGridThickness;
        uniform float uWorldGridPulseSpeed;
        uniform float uWorldGridPulseDensity;
        uniform float uWorldGridProgress;
        uniform float uGroupGridProgress;
        uniform float uWorldGridActive;
        uniform float uGroupGridActive;
        uniform float uObjectStagger;
        uniform vec3 uBorderColor;

        float calcSquareDistance(vec2 p) {
            return max(abs(p.x), abs(p.y));
        }
        vec2 calcSquareOffset(vec2 uv) {
            return fract(uv + 0.5) - 0.5;
        }
    `;e.fragmentShader.includes(`#include <common>`)?e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
`+n):e.fragmentShader=n+`
`+e.fragmentShader;let r=`
        // --- Holographic Grid Overlay ---
        float finalActive = max(uWorldGridActive, uGroupGridActive);
        float finalProgress = max(uWorldGridProgress, uGroupGridProgress);
        if (finalActive > 0.5 && finalProgress > 0.001) {
            // Use World Position for uniform grid regardless of object scale/UVs
            // We use a simplified projection based on surface orientation
            vec3 worldNormal = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
            vec2 gPosition;
            if (abs(worldNormal.y) > 0.5) {
                gPosition = vWorldPos.xz; // Floor/Top
            } else if (abs(worldNormal.x) > 0.5) {
                gPosition = vWorldPos.zy; // Side walls
            } else {
                gPosition = vWorldPos.xy; // Front/Back walls
            }

            float dynCellSize = uWorldGridSize * 0.02; 
            vec2 sOffset = calcSquareOffset(gPosition / dynCellSize);
            
            // local ripple center
            vec2 localCenter = (vPatchedUv - 0.5) * 2.0; 
            float dPulse = length(localCenter);
            float wave = cos(2.0 * (dPulse * 5.0 * uWorldGridPulseDensity - iTime * 2.5 * uWorldGridPulseSpeed));
            float ripple = (wave * 0.5 + 0.5);
            float distSq = calcSquareDistance(sOffset);
            
            // Staggered activation: 
            // We want the total delay across all objects to be 666ms.
            // If the TWEEN is 1.0s, we use 0.666 as the spread.
            float staggerWindow = 0.6; // ~66% of the progress bar is for staggering
            float localVisibility = smoothstep(uObjectStagger * staggerWindow, uObjectStagger * staggerWindow + (1.0 - staggerWindow), finalProgress);

            float baseT = uWorldGridThickness * 0.0015; // Reduced from 0.002 for better visuality
            float ripples = smoothstep(baseT, 0.0, abs(1.0 - abs(sin(distSq * wave * 10.0))));
            float ripplesGlow = 0.5 * smoothstep(baseT * 12.0, 0.0, abs(1.0 - abs(sin(distSq * wave * 10.0))));
            float sqL = 0.5 * smoothstep(baseT * 4.0, 0.0, abs(0.48 - distSq));
            float sqG = 0.4 * smoothstep(baseT * 30.0, 0.0, abs(0.48 - distSq));
            float bloom = 0.2 * smoothstep(0.4, 0.0, distSq);
            
            float mask = (ripples + ripplesGlow + sqL + sqG + bloom) * localVisibility;
            gl_FragColor.rgb += uBorderColor * mask * 1.5;
            gl_FragColor.a = max(gl_FragColor.a, mask * 0.5);
        }
    `;if(e.fragmentShader.includes(`#include <dithering_fragment>`))e.fragmentShader=e.fragmentShader.replace(`#include <dithering_fragment>`,r+`
#include <dithering_fragment>`);else{let t=e.fragmentShader.lastIndexOf(`}`);e.fragmentShader=e.fragmentShader.substring(0,t)+r+`
}`}}function Ir(e,t={}){if(Br(e,t,`welcome`),Rr(e,`vertex`,`vPatchedUv`,`vec2`),zr(e,`vertex`,`vPatchedUv = uv;`),e.fragmentShader.includes(`Welcome Text Header`))return;let n=e.fragmentShader.includes(`uniform float iTime;`),r=e.fragmentShader.includes(`uniform vec2 iResolution;`),i=`
        // --- Welcome Text Header ---
        ${n?``:`uniform float iTime;`}
        ${r?``:`uniform vec2 iResolution;`}
        uniform float uWelcomeProgress;
        uniform float uWelcomeRotation;
        uniform float uWelcomeScale;
        uniform float uWelcomeScanline;
        uniform float uWelcomeOpacity;
        uniform float uWelcomeGlow;
        uniform vec2 uWelcomePosition;

        #define WT_STROKEWIDTH 0.07
        #define WT_PI 3.14159265359

        #define WT_A_ vec2(0.,0.)
        #define WT_B_ vec2(1.,0.)
        #define WT_C_ vec2(2.,0.)
        #define WT_E_ vec2(1.,1.)
        #define WT_G_ vec2(0.,2.)
        #define WT_H_ vec2(1.,2.)
        #define WT_I_ vec2(2.,2.)
        #define WT_J_ vec2(0.,3.)
        #define WT_K_ vec2(1.,3.)
        #define WT_L_ vec2(2.,3.)
        #define WT_M_ vec2(0.,4.)
        #define WT_N_ vec2(1.,4.)
        #define WT_O_ vec2(2.,4.)
        #define WT_S_ vec2(0.,6.)
        #define WT_T_ vec2(1.,6.)
        #define WT_U_ vec2(2.0,6.)

        float wt_minimum_distance(vec2 v, vec2 w, vec2 p) {
            float l2 = dot(v - w, v - w);
            if (l2 == 0.0) return distance(p, v);
            float t = dot(p - v, w - v) / l2;
            if(t < 0.0) return distance(p, v);
            else if (t > 1.0) return distance(p, w);
            vec2 proj = v + t * (w - v);
            return distance(p, proj);
        }

        float wt_textColor(vec2 from, vec2 to, vec2 p, float size) {
            p *= size;
            float nearLine = wt_minimum_distance(from,to,p);
            float ink = smoothstep(0., 1., 1.- 14.*(nearLine - WT_STROKEWIDTH));
            ink += smoothstep(0., 2.5, 1.- (nearLine + 5. * WT_STROKEWIDTH));
            return ink;
        }

        vec2 wt_grid(vec2 letterspace) {
            return ( vec2( (letterspace.x / 2.) * .65 , 1.0-((letterspace.y / 2.) * .95) ));
        }

        float wt_t(vec2 from, vec2 to, vec2 p, inout float count, float reveal, float size) {
            count += 1.0;
            if (count > reveal * 30.0) return 0.0;
            return wt_textColor(wt_grid(from), wt_grid(to), p, size);
        }
    `;e.fragmentShader.includes(`#include <common>`)?e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
`+i):e.fragmentShader=i+`
`+e.fragmentShader;let a=`
        // --- Welcome Text Overlay ---
        if (uWelcomeProgress > 0.01) {
            float w_time = mod(iTime, 11.0);
            float w_gtime = w_time;
            float w_d = 0.;
            float w_count = 0.0;
            float w_font_size = 25.;
            float w_font_spacing = 0.05;
            
            vec2 w_caret = uWelcomePosition;
            
            // Apply scale and rotation to UVs
            vec2 w_uv = (vPatchedUv - 0.5) / max(0.001, uWelcomeScale) + 0.5;
            float w_cos = cos(uWelcomeRotation);
            float w_sin = sin(uWelcomeRotation);
            w_uv = mat2(w_cos, -w_sin, w_sin, w_cos) * (w_uv - 0.5) + 0.5;
            
            #define W_T(f, t) w_d += wt_t(f, t, vec2(w_uv.x - w_font_spacing * w_caret.x, w_uv.y - w_caret.y), w_count, uWelcomeProgress, w_font_size)
            
            // W
            W_T(WT_G_, WT_M_); W_T(WT_M_, WT_O_); W_T(WT_N_, WT_H_); W_T(WT_O_, WT_I_); w_caret.x += 1.0;
            // E
            W_T(WT_O_, WT_M_); W_T(WT_M_, WT_G_); W_T(WT_G_, WT_I_); W_T(WT_I_, WT_L_); W_T(WT_L_, WT_J_); w_caret.x += 1.0;
            // L
            W_T(WT_B_, WT_N_); w_caret.x += 1.0;
            // C
            W_T(WT_I_, WT_G_); W_T(WT_G_, WT_M_); W_T(WT_M_, WT_O_); w_caret.x += 1.0;
            // O
            W_T(WT_G_, WT_I_); W_T(WT_I_, WT_O_); W_T(WT_O_, WT_M_); W_T(WT_M_, WT_G_); w_caret.x += 1.0;
            // M
            W_T(WT_M_, WT_G_); W_T(WT_G_, WT_I_); W_T(WT_H_, WT_N_); W_T(WT_I_, WT_O_); w_caret.x += 1.0;
            // E
            W_T(WT_O_, WT_M_); W_T(WT_M_, WT_G_); W_T(WT_G_, WT_I_); W_T(WT_I_, WT_L_); W_T(WT_L_, WT_J_); w_caret.x += 1.0;

            #undef W_T

            w_d = clamp(w_d * (.75 + sin(w_uv.x * iResolution.x * WT_PI * .5 - w_time * 4.3) * .5), 0.0, 1.0);
            
            vec3 w_textCol = vec3(w_d * .5, w_d, w_d * .85);
            
            // Clean dark background base instead of full-screen scanlines
            vec3 w_bgBase = vec3(0.02, 0.05, 0.03); 

            // Scanline effect isolated
            float w_scanline = 0.07 * (.5 + sin(w_uv.y * iResolution.y * 3.14159 * 1.1 + w_time * 2.0)) + sin(w_uv.y * iResolution.y * .01 + w_time + 2.5) * 0.05;
            w_scanline *= uWelcomeScanline;
            
            // Apply scanlines ONLY to the text area (w_d)
            w_textCol += vec3(0.0, w_scanline * w_d * 2.5, 0.0);

            // Apply global opacity and flashing glow
            w_textCol *= uWelcomeOpacity;
            w_textCol *= (1.0 + uWelcomeGlow * (0.5 + 0.5 * sin(iTime * 15.0)));
            
            w_d *= uWelcomeOpacity;

            // Vignette/Glow effect from snippet
            float w_vignette = pow(100.0 * w_uv.x * w_uv.y * (1.0 - w_uv.x) * (1.0 - w_uv.y), .4);
            vec3 w_finalPatch = (w_bgBase + w_textCol) * (vec3(.4, .4, .3) + vec3(0.5 * w_vignette));
            
            gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb + w_finalPatch, uWelcomeProgress);
        }
    `;if(e.fragmentShader.includes(`#include <dithering_fragment>`))e.fragmentShader=e.fragmentShader.replace(`#include <dithering_fragment>`,a+`
#include <dithering_fragment>`);else{let t=e.fragmentShader.lastIndexOf(`}`);e.fragmentShader=e.fragmentShader.substring(0,t)+a+`
}`}}var Lr,Rr,zr,Br,Vr=M((()=>{Lt(),Lr={core:{iTime:0,iResolution:new e.Vector2(1024,1024)},water:Mt,grid:{...Nt,uObjectStagger:0},dotaLogo:Pt,welcome:Ft},Rr=(e,t,n,r=`vec2`)=>{let i=`varying ${r} ${n};`;e.vertexShader&&!e.vertexShader.includes(n+`;`)&&(e.vertexShader=e.vertexShader.replace(/void\s+main\s*\(\s*\)\s*\{/,e=>`${i}\n${e}`)),e.fragmentShader&&!e.fragmentShader.includes(n+`;`)&&(e.fragmentShader.includes(`#include <common>`)?e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>\n${i}`):e.fragmentShader=`${i}\n${e.fragmentShader}`)},zr=(e,t,n)=>{let r=t===`vertex`?`vertexShader`:`fragmentShader`;e[r]&&!e[r].includes(n.trim())&&(e[r]=e[r].replace(/void\s+main\s*\(\s*\)\s*\{/,e=>`${e}\n    ${n}`))},Br=(e,t,n)=>{let r=Lr[n];if(r){n!==`core`&&Br(e,t,`core`);for(let[n,i]of Object.entries(r))e.uniforms[n]||(e.uniforms[n]=t[n]||{value:i})}}})),Hr,Ur=M((()=>{Hr=`
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
`}));async function Wr(){return new Promise(e=>requestAnimationFrame(e))}var Gr=M((()=>{}));function Kr(t,n,r={}){let{transparent:i=!1,blending:a=e.AdditiveBlending,side:o=e.FrontSide,derivatives:s=!1,uniforms:c={},vs:l=Zt}=r,u=t.globalUniformsHub?t.globalUniformsHub.core:{};return new e.ShaderMaterial({vertexShader:l,fragmentShader:n,uniforms:{...u,...c},blending:a,side:o,transparent:i,extensions:{derivatives:s}})}async function qr(t,n){n&&(n.innerText=R(`SYS_CONFIG_MATERIALS`));let r=t.globalUniformsHub,i=r?r.uniforms:{};Zr=Kr(t,$t,{transparent:!0,uniforms:{uFireHeightOverride:i.uFireHeightOverride||{value:0},uSmoothedMouse:{value:new e.Vector2(0,0)}}}),Qr=Kr(t,an),W=Kr(t,Hr,{blending:e.NormalBlending,uniforms:{uBSODState:i.uPCBSODState||{value:0},uIsPoba:i.uIsPoba||{value:0},uHoverPos:{value:new e.Vector2(0,0)},uTargetHoverPos:{value:new e.Vector2(0,0)},uHoverActive:{value:0},uClickPos:{value:new e.Vector2(.5,.5)},uClickTime:{value:-99},uBootState:{value:0},uChannelAvatars:{value:V.avatarsCelShaded},uHasAvatarTexture:{value:1},uSpecialPos1:{value:new e.Vector2(0,1)},uSpecialPos2:{value:new e.Vector2(2,0)}}}),$r=Kr(t,tn,{blending:e.NormalBlending}),ei=Kr(t,rn,{blending:e.NormalBlending}),ti=Kr(t,nn,{blending:e.NormalBlending,derivatives:!0,uniforms:{uBSODState:i.uLaptopBSODState||{value:0},uNetflixStartTime:i.uNetflixStartTime||{value:0}}}),G=Kr(t,nn,{blending:e.NormalBlending,derivatives:!0,uniforms:{uBSODState:i.uPCBSODState||{value:0},uNetflixStartTime:i.uNetflixStartTime||{value:0}}}),ni=Kr(t,yn,{depthWrite:!1,depthTest:!1,transparent:!0,uniforms:{uEyeActive:{value:!1},uOffsetY:{value:-.017},uEyeOpenness:{value:0},uEyeAngle:{value:-.36},uEyeScale:{value:.5},uEyeFlameOffset:{value:new e.Vector2(0,.52)},uFlameScale:{value:new e.Vector2(.5,.5)},uEyeScreenPosition:{value:new e.Vector2(.6,0)},uFireHeightOverride:i.uFireHeightOverride||{value:0},uSmoothedMouse:{value:new e.Vector2(0,0)}}}),ri=Kr(t,bn,{transparent:!0,uniforms:{...t.globalUniformsHub.core,uSelectedSlot:{value:new e.Vector2(3,1)},uGlowIntensity:{value:.05},uBorderThickness:{value:.02},uCurrentSpeed:{value:5},uIconScale:{value:.75},uDarkness:{value:.74},uAspect:{value:1.77}}}),ii=Kr(t,xn,{blending:e.NormalBlending,uniforms:{uBSODState:i.uPCBSODState||{value:0},uAspect:{value:1.77}}}),oi=[Qr,$r,ei,ti,ri,ii],si=[W,G,ri,ii];let a=async n=>{let r=[{name:[`screenDisplay001_1`],envMapIntensity:10,metalness:.1,roughness:.5,envMapRotation:new e.Euler(0,.5,.5)},{name:[`verticalMonitorBody`],envMapIntensity:10,metalness:0,roughness:.15,envMapRotation:new e.Euler(0,1.97,.39),toneMapped:!1},{name:`Object_0003_3`,envMapIntensity:1,metalness:0,roughness:.32,envMapRotation:new e.Euler(0,Math.PI/2,0)},{name:`shelf`,envMapIntensity:2.65,metalness:0,roughness:1,envMapRotation:new e.Euler(1.2,.1,.2),side:e.BackSide,toneMapped:!0},{name:`mjolnir_low_mjolnir_hammer_0`,envMapIntensity:5,metalness:1,roughness:1},{name:`Object_15`,envMapIntensity:20,metalness:.15,roughness:.5},{name:`Object_15001`,envMapIntensity:2,metalness:.15,roughness:.2,envMapRotation:new e.Euler(Math.PI,-Math.PI/2,-1)},{name:`book001`,envMapIntensity:20,metalness:0,roughness:1,envMapRotation:new e.Euler(Math.PI/2,Math.PI/2,0)},{name:`blackCat`,envMapIntensity:.75,envMapRotation:new e.Euler(0,1,0),toneMapped:!1},{name:`Object_108`,envMapIntensity:1},{name:`leftWallFoot001`,envMapIntensity:.5},{name:`Object_17`,envMapIntensity:.5},{name:`Ch23_Body`,envMapIntensity:8,metalness:0,roughness:1,envMapRotation:new e.Euler(-2.17,-2.83,.73)},{name:`PokeBall__0002`},{name:`PokeBall__0002_1`},{name:`PokeBall__0002_2`},{name:`Model_0001`},{name:`pictureLion`,map:V.avatarsCelShaded,envMapIntensity:1.5,metalness:0,roughness:1},{name:`PokeBall__0003`},{name:`PokeBall__0003_1`},{name:`PokeBall__0003_2`},{name:`pillow-small-2`,envMapIntensity:.3},{name:`pillow-small-1`,envMapIntensity:.3},{name:`Sphere001_0`,toneMapped:!1},{name:`stool1`},{name:`stool2`},{name:`stool_seat`,envMapIntensity:5,envMapRotation:new e.Euler(0,-.4,.2)},{name:`Object_8001`},{name:`aegis`,envMapIntensity:5},{name:`questionCube`,envMapIntensity:5,metalness:0,roughness:0},{name:`Object_34001`,envMapIntensity:10,metalness:0,roughness:.7,side:e.BackSide},{name:`Object_32`,envMapIntensity:2.5},{name:`Object_31`,envMapIntensity:5,envMapRotation:new e.Euler(Math.PI,0,0)},{name:`Object_33`,envMapIntensity:2,envMapRotation:new e.Euler(Math.PI,0,0),roughness:0},{name:`Object_42001`,envMapIntensity:6},{name:`Object_40001`,envMapIntensity:15,roughness:0},{name:`bedMain`,envMapIntensity:.15,roughness:1,envMapRotation:new e.Euler(Math.PI,Math.PI,Math.PI)},{name:`bedStand`,envMapIntensity:.9,roughness:1},{name:`Object_0007`,toneMapped:!1,envMapIntensity:.4},{name:`Lathe_S_Blackhole_01_0`,toneMapped:!1,emissiveIntensity:.7},{name:`Circle_0`,envMapIntensity:3.5,roughness:.1},{name:`Cube_1`,envMapIntensity:1.5,roughness:.1},{name:`Circle002_0`,envMapIntensity:6,roughness:.1}],i=new Map;for(let e of r){let t=Array.isArray(e.name)?e.name:[e.name];for(let n of t)i.set(n,e)}let a=performance.now(),o=0,s=[t];for(;s.length>0;){let e=s.pop();if(e.name&&i.has(e.name)){let{name:t,...r}=i.get(e.name);e.traverse(e=>{e.isMesh&&e.material&&(e.material.envMap=n,Object.assign(e.material,r))})}if(e.children)for(let t=e.children.length-1;t>=0;t--)s.push(e.children[t]);if(o++,o%50==0&&performance.now()-a>8){await Wr(),a=performance.now();let e=.2+Math.min(o/600,1)*.6;updateTaskProgress(`model-assembly`,e)}}t.isAdjusted=!0};V.environmentMap?await a(V.environmentMap):t.environment&&await a(t.environment);let o=t.getObjectByName(`Object_34001`);o&&(o.material=Qr),o.material.side=e.BackSide;let s=t.getObjectByName(`screenDisplay002`);if(s){s.material=W,s.userData.originalMaterial=W;let t=s.geometry.attributes.position.count;s.geometry.setAttribute(`aLayoutMode`,new e.BufferAttribute(new Float32Array(t).fill(2),1))}let c=t.getObjectByName(`screenDisplay001`);if(c){c.material=W,c.userData.originalMaterial=W,c.onBeforeRender=()=>{if(!W.uniforms.uHoverPos||!W.uniforms.uTargetHoverPos)return;let e=W.uniforms.uTargetHoverPos.value,t=W.uniforms.uHoverPos.value,n=.12;if(t.x+=(e.x-t.x)*n,t.y+=(e.y-t.y)*n,t.distanceTo(e)<.001&&t.copy(e),W.uniforms.uIsPoba.value>.5){let e=performance.now();if(c.userData.lastShuffleTime||(c.userData.lastShuffleTime=e),e-c.userData.lastShuffleTime>5e3){c.userData.lastShuffleTime=e;let t=e=>{let t=(Math.round(e.y*3+e.x)+1)%6;e.x=t%3,e.y=Math.floor(t/3)};t(W.uniforms.uSpecialPos1.value),t(W.uniforms.uSpecialPos2.value)}}};let t=c.geometry.attributes.position.count;c.geometry.setAttribute(`aLayoutMode`,new e.BufferAttribute(new Float32Array(t).fill(0),1))}let l=t.getObjectByName(`verticalMonitorDisplay`);if(l){l.material=W,l.userData.originalMaterial=W;let t=l.geometry.attributes.position.count;l.geometry.setAttribute(`aLayoutMode`,new e.BufferAttribute(new Float32Array(t).fill(1),1))}let u=t.getObjectByName(`wallArea`);if(u){u.material=ni,u.onBeforeRender=()=>{let e=ni.uniforms.uMouse.value,t=ni.uniforms.uSmoothedMouse.value,n=.06;t.x+=(e.x-t.x)*n,t.y+=(e.y-t.y)*n};let e=u.scale.x/u.scale.y;ni.uniforms.uDragonEyeAspect={value:e}}ni.visible=!1;let d=t.getObjectByName(`caseCoverArea`);d&&(d.material=Zr,d.onBeforeRender=()=>{let e=Zr.uniforms.uMouse.value,t=Zr.uniforms.uSmoothedMouse.value,n=.22;t.x+=(e.x-t.x)*n,t.y+=(e.y-t.y)*n});let f=t.getObjectByName(`chairBack`);f&&(f.material=ri),K=zt(`#FBC189`,1,.05),K.side=e.DoubleSide,ai=Rt(`#FBC189`,1.5,.01,6.5,e.FrontSide);let p=t.getObjectByName(`cFanBulbAura`);p&&(p.material=ai);let m=t.getObjectByName(`cFanBulb`);m&&(m.material=K)}async function Jr(t){if(!t.physicBodies||!t.globalUniformsHub)return;let n=t.globalUniformsHub.uniforms,r=I.ELECTRIC_CYAN,i=I.ACCENT_GOLD;t.cyanPulseActive||={value:0};let a={...n,uWorldGridActive:n.uWorldGridActive,uGroupGridActive:t.cyanPulseActive,uBorderColor:{value:r},uObjectStagger:{value:.5}},o={...n,uWorldGridActive:n.uWorldGridActive,uGroupGridActive:{value:0},uBorderColor:{value:i},uObjectStagger:{value:.5}},s=0,c=0,l=0,u=new Map,d=t=>{if(!t.geometry)return!1;t.geometry.boundingBox||t.geometry.computeBoundingBox();let n=new e.Vector3;return t.geometry.boundingBox.getSize(n),n.x*n.y*n.z<1e-4},f=t=>{if(t.isShaderMaterial||t.type===`ShaderMaterial`)return`shader|${t.fragmentShader.length}|${t.vertexShader.length}|${t.name||`unnamed`}`;let n=t.color?t.color.getHex():0,r=t.emissive?t.emissive.getHex():0,i=t.emissiveIntensity??0,a=t.map?t.map.uuid:`n1`,o=t.alphaMap?t.alphaMap.uuid:`n2`,s=t.normalMap?t.normalMap.uuid:`n3`,c=t.aoMap?t.aoMap.uuid:`n4`,l=t.emissiveMap?t.emissiveMap.uuid:`n5`,u=t.metalness??0,d=t.roughness??1,f=t.opacity??1,p=t.transparent?1:0,m=t.envMapIntensity??1,h=t.side??e.FrontSide,g=t.toneMapped?1:0,_=t.envMapRotation?`${t.envMapRotation.x.toFixed(2)}|${t.envMapRotation.y.toFixed(2)}|${t.envMapRotation.z.toFixed(2)}`:`0`;return`std|${t.name||`unnamed`}|${n}|${r}|${i}|${a}|${o}|${s}|${c}|${l}|${u}|${d}|${f}|${p}|${m}|${h}|${g}|${_}`},p=(e,t)=>{if(!e.material||e.material.isGridPatched)return;if(d(e)){l++;return}s++;let n=f(e.material),r=u.get(n);r||(r=new Map,u.set(n,r));let i=r.get(t);if(i){e.material=i;return}c++;let a=e.material.clone();a.uniforms=t,a.onBeforeCompile=Xr,a.isGridPatched=!0,r.set(t,a),e.material=a},m=0,h=performance.now();for(let e of t.physicBodies){let s=e.threeObject;if(!s)continue;m++,(m%5==0||performance.now()-h>2)&&(await Wr(),h=performance.now());let c=s.name,l=null;c===`stool`||c===`stool_bound`?(t.stoolGridUniforms||={...n,uWorldGridActive:{value:0},uWorldGridProgress:{value:0},uGroupGridActive:n.uWorldGridActive,uGroupGridProgress:n.uWorldGridProgress,uBorderColor:{value:i},uObjectStagger:{value:0}},l=t.stoolGridUniforms):[`Object_0003`,`Object_108`,`GLTF_created_0001`,`pokeball`,`pokeball2`].includes(c)||c.includes(`pokeball`)?(t.pokeballGridUniforms||={...n,uWorldGridActive:{value:0},uGroupGridActive:n.uWorldGridActive,uWorldGridProgress:{value:0},uGroupGridProgress:n.uWorldGridProgress,uBorderColor:{value:r},uObjectStagger:{value:0}},l=t.pokeballGridUniforms):l=e.bodyType()===0?a:o,s.traverse(e=>{e.isMesh&&p(e,l)})}W&&W.uniforms.uIsPoba&&Yr(W.uniforms.uIsPoba.value>.5)}function Yr(e=!0){V.avatarsCelShaded&&(V.avatarsCelShaded.repeat.set(.5,-1),V.avatarsCelShaded.offset.set(e?0:.5,1))}var Xr,Zr,Qr,W,$r,ei,ti,G,ni,ri,ii,K,ai,oi,si,ci=M((()=>{kt(),Te(),Sn(),Lt(),Ae(),Vr(),Ur(),Gr(),Xr=function(e){this.uniforms&&Fr(e,this.uniforms)}}));function li(){if(window._cvState===`falling`||window._cvState===`shattered`||window._cvState===`resetting`)return;if(window._cvState===`sucking`){window._cvState=`falling`;return}window._cvState=`falling`;let e=document.getElementById(`cv-container`),t=document.getElementById(`cv-content`),n=document.getElementById(`cv-scroller`);if(!e||!t)return;e.classList.contains(`collapsed`)?(e.classList.remove(`collapsed`),setTimeout(r,400)):r();function r(){if(window._cvState===`resetting`||window._cvState===`idle`)return;window._cvState=`falling`,e.style.overflow=`visible`,n&&(n.style.overflow=`visible`);let r=document.getElementById(`main-ui`);r&&(r.style.pointerEvents=`none`),t.style.position=`relative`;let i=Array.from(t.querySelectorAll([`.header h1`,`.header .role`,`.contact-info span`,`.contact-info a`,`.collapsible-header`,`.role-header .company`,`.title-row .job-title`,`.title-row .date`,`.skills-grid span`,`.contact-grid div`,`.terminal-footer div`,`.collapsible-content p`,`.collapsible-content ul li`].join(`, `))),a=n.getBoundingClientRect(),o=[];i.forEach(e=>{if(e.querySelector(`svg`)||e.querySelector(`img`))return;let t=e.getBoundingClientRect(),n=t.bottom>=a.top&&t.top<=a.bottom;if(e.dataset.originalHtml||(e.dataset.originalHtml=e.innerHTML),!n){e.style.visibility=`hidden`,e.dataset.wasHiddenByViewport=`true`;return}let r=document.createTreeWalker(e,NodeFilter.SHOW_TEXT,null,!1),i=[];for(;r.nextNode();)i.push(r.currentNode);i.forEach(e=>{if(e.nodeValue.trim()===``)return;let t=e.nodeValue.split(/(\s+)/),n=document.createDocumentFragment();t.forEach(e=>{if(e.trim()===``)n.appendChild(document.createTextNode(e));else{let t=document.createElement(`span`);t.textContent=e,t.style.display=`inline-block`,t.classList.add(`falling-word`),o.push(t),n.appendChild(t)}}),e.parentNode.replaceChild(n,e)})});let s=o.map(e=>{let t=window.getComputedStyle(e);return{sColor:t.color,sFontSize:t.fontSize,sFontWeight:t.fontWeight,sLetterSpacing:t.letterSpacing,sTextTransform:t.textTransform,sFontFamily:t.fontFamily,sLineHeight:t.lineHeight,sTextShadow:t.textShadow===`none`?``:t.textShadow}});o.forEach((e,t)=>{let n=s[t];e.style.color=n.sColor,e.style.fontSize=n.sFontSize,e.style.fontWeight=n.sFontWeight,e.style.letterSpacing=n.sLetterSpacing,e.style.textTransform=n.sTextTransform,e.style.fontFamily=n.sFontFamily,e.style.lineHeight=n.sLineHeight,e.style.textShadow=n.sTextShadow,e.style.whiteSpace=`nowrap`});let c=t.getBoundingClientRect(),l=Array.from(t.querySelectorAll(`.header-photo, .scanline-deco, .fui-corners, .audience-badge`)),u=[...o,...l],d=u.map(e=>e.getBoundingClientRect()),f=[];u.forEach((e,t)=>{let n=d[t];if(n.width===0||n.height===0)return;let r=n.left-c.left,i=n.top-c.top,a=e.classList.contains(`falling-word`),o=e;a||(o=e.cloneNode(!0),o.classList.add(`falling-clone`),o.style.margin=`0`),f.push({el:o,isClone:!a,x:r,y:i,startX:r,startY:i,width:n.width,height:n.height,vx:window._cvState===`ritual`?(Math.random()-.5)*5:(Math.random()-.5)*12,vy:window._cvState===`ritual`?0:Math.random()*-8-2,rx:Math.random()*30-15,ry:Math.random()*30-15,rz:Math.random()*30-15,vrx:(Math.random()-.5)*(window._cvState===`ritual`?30:6),vry:(Math.random()-.5)*(window._cvState===`ritual`?30:6),vrz:(Math.random()-.5)*(window._cvState===`ritual`?30:6)}),a||(e.style.visibility=`hidden`)}),f.forEach(e=>{t.appendChild(e.el),e.el.style.position=`absolute`,e.el.style.left=e.x+`px`,e.el.style.top=e.y+`px`,e.el.style.width=e.width+`px`,e.el.style.height=e.height+`px`,e.el.style.margin=`0`,e.el.style.transition=`none`,e.el.style.animation=`none`,e.el.style.boxSizing=`border-box`,e.el.style.userSelect=`none`,e.el.style.willChange=`transform`,e.el.style.transformOrigin=`center center`}),Array.from(t.children).forEach(e=>{f.find(t=>t.el===e)||(e.style.display=`none`)});let p=.55,m=.9,h=t.getBoundingClientRect(),g=window.innerHeight-h.top+20;function _(){if(window._cvState===`resetting`)return;let e=!0;f.forEach(t=>{if(t.settled)return;let n=window._cvGravity===void 0?.6:window._cvGravity;t.vy+=n,t.x+=t.vx,t.y+=t.vy,t.rx+=t.vrx,t.ry+=t.vry,t.rz+=t.vrz,t.y<=0&&(t.y=0,t.vy<0&&(t.vy*=-p,t.vx+=(Math.random()-.5)*4)),t.y+t.height>=g&&(t.y=g-t.height,t.vy*=-p,t.vx*=m,t.vrx*=m,t.vry*=m,t.vrz*=m,Math.abs(t.vy)<1.2&&(t.vy=0),Math.abs(t.vx)<.2&&(t.vx=0));let r=t.x-t.startX,i=t.y-t.startY;t.el.style.transform=`translate3d(${r}px, ${i}px, 0) rotateX(${t.rx}deg) rotateY(${t.ry}deg) rotateZ(${t.rz}deg)`,t.el._cvPhysics={dx:r,dy:i,rx:t.rx,ry:t.ry,rz:t.rz};let a=window._cvGravity!==void 0&&window._cvGravity<0,o=window._cvState===`ritual`;!a&&!o&&Math.abs(t.vy)<=.1&&Math.abs(t.vx)<=.1&&t.y+t.height>=g-2?t.settled=!0:e=!1}),e?(t.style.pointerEvents=`none`,window._cvState=`shattered`):requestAnimationFrame(_)}requestAnimationFrame(_)}}function ui(e=900){if(!window._cvState||window._cvState===`idle`){if(document.querySelectorAll(`.falling-word, .falling-clone`).length===0)return;window._cvState=`shattered`}if(window._cvState===`resetting`)return;window._cvState=`resetting`;let t=document.getElementById(`cv-container`),n=document.getElementById(`cv-content`),r=document.getElementById(`cv-scroller`);if(!t||!n){window._cvState=`idle`;return}let i=document.querySelectorAll(`.falling-word, .falling-clone`);if(i.length>0&&v!==void 0){let t=0,n=i.length,r=[];i.forEach(i=>{let a=i._cvPhysics||{dx:0,dy:0,rx:0,ry:0,rz:0,scale:1};i.style.display===`none`&&(i.style.display=`inline-block`);let o=e*.4,c=e-o,l=Math.random()*o,u=new v.Tween(a).to({dx:0,dy:0,rx:0,ry:0,rz:0,scale:1},c).easing(v.Easing.Cubic.InOut).delay(l).onUpdate(()=>{let e=a.scale===void 0?1:a.scale;i.style.transform=`translate3d(${a.dx}px, ${a.dy}px, 0) rotateX(${a.rx}deg) rotateY(${a.ry}deg) rotateZ(${a.rz}deg) scale(${e})`}).onComplete(()=>{t++,t===n&&s()}).start();r.push(u)});let o=!1,s=()=>{o||(o=!0,r.forEach(e=>e.stop()),c&&cancelAnimationFrame(c),a())},c;function l(){o||(t<n?c=requestAnimationFrame(l):s())}c=requestAnimationFrame(l),setTimeout(s,e+100)}else a();function a(){t.style.overflow=``,r&&(r.style.overflow=``);let e=document.getElementById(`main-ui`);e&&(e.style.pointerEvents=``),n.style.position=``,n.style.pointerEvents=``,document.querySelectorAll(`.falling-clone, .falling-word`).forEach(e=>e.remove()),Array.from(n.querySelectorAll([`.header h1`,`.header .role`,`.contact-info span`,`.contact-info a`,`.collapsible-header`,`.role-header .company`,`.title-row .job-title`,`.title-row .date`,`.skills-grid span`,`.contact-grid div`,`.terminal-footer div`,`.collapsible-content p`,`.collapsible-content ul li`].join(`, `))).forEach(e=>{e.dataset.originalHtml&&(e.innerHTML=e.dataset.originalHtml,delete e.dataset.originalHtml),e.dataset.wasHiddenByViewport&&(e.style.visibility=``,delete e.dataset.wasHiddenByViewport)}),Array.from(n.children).forEach(e=>{e.style.display===`none`&&(e.style.display=``)}),Array.from(n.querySelectorAll(`.header-photo, .scanline-deco, .fui-corners, .audience-badge`)).forEach(e=>{e.style.visibility===`hidden`&&(e.style.visibility=``)}),window._cvState=`idle`}}function di(e=0){if(window._cvState&&window._cvState!==`idle`&&window._cvState!==`shattered`)return;window._cvState=`sucking`;let t=document.getElementById(`cv-container`),n=document.getElementById(`cv-content`),r=document.getElementById(`cv-scroller`);if(!t||!n)return;t.classList.contains(`collapsed`)?(t.classList.remove(`collapsed`),setTimeout(i,400)):i();function i(){if(window._cvState===`resetting`||window._cvState===`idle`)return;t.style.overflow=`visible`,r&&(r.style.overflow=`visible`);let i=document.getElementById(`main-ui`);i&&(i.style.pointerEvents=`none`),n.style.position=`relative`;let a=Array.from(n.querySelectorAll([`.header h1`,`.header .role`,`.contact-info span`,`.contact-info a`,`.collapsible-header`,`.role-header .company`,`.title-row .job-title`,`.title-row .date`,`.skills-grid span`,`.contact-grid div`,`.terminal-footer div`,`.collapsible-content p`,`.collapsible-content ul li`].join(`, `))),o=[];a.forEach(e=>{if(e.querySelector(`svg`)||e.querySelector(`img`))return;e.dataset.originalHtml||(e.dataset.originalHtml=e.innerHTML);let t=document.createTreeWalker(e,NodeFilter.SHOW_TEXT,null,!1),n=[];for(;t.nextNode();)n.push(t.currentNode);n.forEach(e=>{if(e.nodeValue.trim()===``)return;let t=e.nodeValue.split(/(\s+)/),n=document.createDocumentFragment();t.forEach(e=>{if(e.trim()===``)n.appendChild(document.createTextNode(e));else{let t=document.createElement(`span`);t.textContent=e,t.style.display=`inline-block`,t.classList.add(`falling-word`),o.push(t),n.appendChild(t)}}),e.parentNode.replaceChild(n,e)})});let s=o.map(e=>{let t=window.getComputedStyle(e);return{sColor:t.color,sFontSize:t.fontSize,sFontWeight:t.fontWeight,sLetterSpacing:t.letterSpacing,sTextTransform:t.textTransform,sFontFamily:t.fontFamily,sLineHeight:t.lineHeight,sTextShadow:t.textShadow===`none`?``:t.textShadow}});o.forEach((e,t)=>{let n=s[t];e.style.color=n.sColor,e.style.fontSize=n.sFontSize,e.style.fontWeight=n.sFontWeight,e.style.letterSpacing=n.sLetterSpacing,e.style.textTransform=n.sTextTransform,e.style.fontFamily=n.sFontFamily,e.style.lineHeight=n.sLineHeight,e.style.textShadow=n.sTextShadow,e.style.whiteSpace=`nowrap`});let c=n.getBoundingClientRect(),l=(e+1)/2*window.innerHeight-c.top,u=Array.from(n.querySelectorAll(`.header-photo, .scanline-deco, .fui-corners, .audience-badge`)),d=[...o,...u],f=d.map(e=>e.getBoundingClientRect()),p=[];d.forEach((e,t)=>{let n=f[t];if(n.width===0||n.height===0)return;let r=n.left-c.left,i=n.top-c.top,a=e.classList.contains(`falling-word`),o=e;a||(o=e.cloneNode(!0),o.classList.add(`falling-clone`),o.style.margin=`0`),p.push({el:o,isClone:!a,x:r,y:i,startX:r,startY:i,width:n.width,height:n.height,vx:(Math.random()-.5)*6,vy:(Math.random()-.5)*6,rx:Math.random()*30-15,ry:Math.random()*30-15,rz:Math.random()*30-15,vrx:(Math.random()-.5)*15,vry:(Math.random()-.5)*15,vrz:(Math.random()-.5)*15,scale:1}),a||(e.style.visibility=`hidden`)}),p.forEach(e=>{n.appendChild(e.el),e.el.style.position=`absolute`,e.el.style.left=e.x+`px`,e.el.style.top=e.y+`px`,e.el.style.width=e.width+`px`,e.el.style.height=e.height+`px`,e.el.style.margin=`0`,e.el.style.transition=`none`,e.el.style.animation=`none`,e.el.style.boxSizing=`border-box`,e.el.style.userSelect=`none`,e.el.style.willChange=`transform`,e.el.style.transformOrigin=`center center`}),Array.from(n.children).forEach(e=>{p.find(t=>t.el===e)||(e.style.display=`none`)});let m=.6,h=.55,g=.9;function _(){if(window._cvState===`resetting`)return;let e=!0;p.forEach(t=>{if(t.settled)return;if(window._cvState===`falling`){let n=window.innerHeight-c.top+20;t.vy+=.6,t.x+=t.vx,t.y+=t.vy,t.rx+=t.vrx,t.ry+=t.vry,t.rz+=t.vrz,t.y+t.height>=n&&(t.y=n-t.height,t.vy*=-h,t.vx*=g,t.vrx*=g,t.vry*=g,t.vrz*=g,Math.abs(t.vy)<1.2&&(t.vy=0),Math.abs(t.vx)<.2&&(t.vx=0)),Math.abs(t.vy)<=.1&&Math.abs(t.vx)<=.1&&t.y+t.height>=n-2?t.settled=!0:e=!1}else{let n=0-(t.x+t.width/2),r=l-(t.y+t.height/2),i=Math.sqrt(n*n+r*r)||1;t.vx+=n/i*m,t.vy+=r/i*m,t.x+=t.vx,t.y+=t.vy,t.rx+=t.vrx,t.ry+=t.vry,t.rz+=t.vrz,t.x<=0&&(t.x=0,t.vx*=-h,t.vy*=g,t.vrx*=g,t.vry*=g,t.vrz*=g,Math.abs(t.vx)<1.2&&(t.vx=0),Math.abs(t.vy)<.2&&(t.vy=0)),Math.abs(t.vx)<=.1&&Math.abs(t.vy)<=.1&&t.x<=2?t.settled=!0:e=!1}let n=t.x-t.startX,r=t.y-t.startY;t.el.style.transform=`translate3d(${n}px, ${r}px, 0) rotateX(${t.rx}deg) rotateY(${t.ry}deg) rotateZ(${t.rz}deg)`,t.el._cvPhysics={dx:n,dy:r,rx:t.rx,ry:t.ry,rz:t.rz}}),e?(n.style.pointerEvents=`none`,window._cvState=`shattered`):requestAnimationFrame(_)}requestAnimationFrame(_)}}function fi(e=1e3){if(window._cvState&&window._cvState!==`idle`&&window._cvState!==`shattered`)return;window._cvState=`shaking`;let t=document.getElementById(`cv-container`),n=document.getElementById(`cv-content`);if(!t||!n||t.classList.contains(`collapsed`)){window._cvState=`idle`;return}let r=Array.from(n.querySelectorAll([`.header h1`,`.header .role`,`.contact-info span`,`.contact-info a`,`.collapsible-header`,`.role-header .company`,`.title-row .job-title`,`.title-row .date`,`.skills-grid span`,`.fui-corners div`,`.scanline-deco`,`.header-photo`].join(`, `)));if(r.length===0||v===void 0){window._cvState=`idle`;return}let i=0,a=r.length,o=[];r.forEach((t,n)=>{let r=window.getComputedStyle(t).display;r===`inline`&&(t.style.display=`inline-block`);let s=e*.35,l=Math.random()*s,u=e-l,d=new v.Tween({t:0}).to({t:1},u).easing(v.Easing.Quadratic.Out).delay(l).onUpdate(e=>{let r=1-e.t;if(r<=.02){t.style.transform=`translate3d(0, 0, 0) rotateZ(0deg)`;return}n*12.5;let i=(Math.random()-.5)*8*r,a=(Math.random()-.5)*6*r,o=(Math.random()-.5)*3*r;t.style.transform=`translate3d(${i}px, ${a}px, 0) rotateZ(${o}deg)`}).onComplete(()=>{t.style.transform=``,r===`inline`&&(t.style.display=``),i++,i===a&&c()}).start();o.push(d)});let s=!1,c=()=>{s||(s=!0,o.forEach(e=>e.stop()),l&&cancelAnimationFrame(l),r.forEach(e=>{e.style.transform=``}),window._cvState===`shaking`&&(window._cvState=`idle`))},l;function u(){if(window._cvState!==`shaking`){c();return}i<a?l=requestAnimationFrame(u):c()}l=requestAnimationFrame(u),setTimeout(c,e+100)}function pi(e=1e3){if(window._cvState&&window._cvState!==`idle`)return;window._cvState=`jumping`;let t=document.getElementById(`cv-container`),n=document.getElementById(`cv-content`);if(!t||!n||t.classList.contains(`collapsed`)){window._cvState=`idle`;return}let r=Array.from(n.querySelectorAll([`.header h1`,`.header .role`,`.contact-info span`,`.contact-info a`,`.collapsible-header`,`.role-header .company`,`.title-row .job-title`,`.title-row .date`,`.skills-grid span`,`.fui-corners div`,`.scanline-deco`,`.header-photo`].join(`, `)));if(r.length===0||v===void 0){window._cvState=`idle`;return}let i=0,a=r.length,o=[];r.forEach(t=>{let n=window.getComputedStyle(t).display;n===`inline`&&(t.style.display=`inline-block`);let r=e*.4,s=Math.random()*r,l=e-s,u=new v.Tween({t:0}).to({t:1},l).easing(v.Easing.Linear.None).delay(s).onUpdate(e=>{let n=Math.sin(e.t*Math.PI)*-45;t.style.transform=`translate3d(0, ${n}px, 0)`}).onComplete(()=>{t.style.transform=``,n===`inline`&&(t.style.display=``),i++,i===a&&c()}).start();o.push(u)});let s=!1,c=()=>{s||(s=!0,o.forEach(e=>e.stop()),l&&cancelAnimationFrame(l),r.forEach(e=>{e.style.transform=``}),window._cvState===`jumping`&&(window._cvState=`idle`))},l;function u(){if(window._cvState!==`jumping`){c();return}i<a?l=requestAnimationFrame(u):c()}l=requestAnimationFrame(u),setTimeout(c,e+100)}var mi=M((()=>{window.cvFall=li,window.cvReset=ui,window.cvSuck=di,window.cvShake=fi,window.cvJump=pi}));function hi(e,t=3e3,n=null){let r=e.globalUniformsHub,i=e.constantUniform,a=[];n===`pc`?r&&r.uniforms.uPCBSODState?a.push(r.uniforms.uPCBSODState):i&&i.uPCBSODState&&a.push(i.uPCBSODState):n===`laptop`?r&&r.uniforms.uLaptopBSODState?a.push(r.uniforms.uLaptopBSODState):i&&i.uLaptopBSODState&&a.push(i.uLaptopBSODState):(r&&(r.uniforms.uBSODState&&a.push(r.uniforms.uBSODState),r.uniforms.uPCBSODState&&a.push(r.uniforms.uPCBSODState),r.uniforms.uLaptopBSODState&&a.push(r.uniforms.uLaptopBSODState)),i&&(i.uBSODState&&a.push(i.uBSODState),i.uPCBSODState&&a.push(i.uPCBSODState),i.uLaptopBSODState&&a.push(i.uLaptopBSODState))),a.length!==0&&(e._bsodTimeout&&clearTimeout(e._bsodTimeout),a.forEach(e=>e.value=1),e._bsodTimeout=setTimeout(()=>{a.forEach(e=>e.value=0),e._bsodTimeout=null},t))}function gi(e,t=3e3){!W||!W.uniforms.uBootState||(e._bootingTimeout&&clearTimeout(e._bootingTimeout),W.uniforms.uBootState.value=0,e._bootingTimeout=setTimeout(()=>{W.uniforms.uBootState.value=1,e._bootingTimeout=null},t))}function _i(t){if(!t.physicBodies||t.physicBodies.length===0){setTimeout(()=>_i(t),1e3);return}if(t.world?.hasPointGravityOnBH||window._cvState===`sucking`){setTimeout(()=>_i(t),1e3);return}let n=0;t.physicBodies.forEach(t=>{if(!t.isIntegrityCheckTarget&&!t.isIntegrityResetTarget)return;let r,i;if(t.threeObject&&t.threeObject.userData&&t.threeObject.userData.originalPos){let n=t.threeObject.userData.originalPos,a=t.threeObject.userData.originalRot;if(r=new e.Vector3(n.x,n.y,n.z),a&&a.isEuler)i=new e.Quaternion().setFromEuler(a);else if(t.threeObject.userData.originalQuaternion){let n=t.threeObject.userData.originalQuaternion;i=new e.Quaternion(n.x,n.y,n.z,n.w)}else{let n=t.rotation();i=new e.Quaternion(n.x,n.y,n.z,n.w)}}else{let n=t.translation(),a=t.rotation();r=new e.Vector3(n.x,n.y,n.z),i=new e.Quaternion(a.x,a.y,a.z,a.w)}t.integrity={position:r,quaternion:i},n++}),t.allowsResetting=!0,t.integrityBaselineCaptured=!0}function vi(t,n,r,i=0){if(n.isResetting)return;if(t.world&&t.world.isBusy){setTimeout(()=>vi(t,n,r,i),16);return}if(n.isResetting=!0,!n.integrity){n.isResetting=!1;return}try{n.rapierCollider&&n.rapierCollider.setSensor(!0)}catch{n.isResetting=!1;return}let a=n.integrity.position.clone(),o=n.integrity.quaternion,s;try{s=n.bodyType()}catch{n.isResetting=!1;return}t._activeResetCount=(t._activeResetCount||0)+1,Ei(t,!0);let c=n.mass(),l=(Math.random()*8+2)*c;n.applyImpulse({x:0,y:i+l,z:0},!0);let u=(i+2)*c*.2;n.applyTorqueImpulse({x:(Math.random()-.5)*u,y:(Math.random()-.5)*u,z:(Math.random()-.5)*u},!0),n.wakeUp(),kr(n,()=>{let i=`integrity-beam-${n.handle}`,c=n.threeObject&&n.threeObject.userData.isDragonBall?16763904:I.ELECTRIC_CYAN||65535,l=null;if(Ko){let r=n.translation();Ko(t,``,``,new e.Vector3(r.x,r.y,r.z),i,!0,c,!0,1/0,!0),l=t.getObjectByName(i)}let u=t.getObjectByName(`mixamorigSpine1`)||t.getObjectByName(`a-char`),d=u?new e.Vector3().setFromMatrixPosition(u.matrixWorld):null;Ar(n,a,o,r,s,()=>{l&&(l.visible=!1,l.activeRequestID&&cancelAnimationFrame(l.activeRequestID)),n.isResetting=!1,t._activeResetCount--,Ei(t,!1)},(n,r)=>{if(l&&l.visible){let r=X(t,`drone`);if(r){let t=r.getObjectByName(`Sphere001_0`);if(t){let r=new e.Vector3;t.getWorldPosition(r);let i=r.distanceTo(n);l.position.copy(r),l.lookAt(n),l.children.forEach(e=>{e.scale.z=i})}}}},d)})}function yi(t){if(t.allowsIntegrityCheck=!0,!t.allowsIntegrityCheck)return;let n,r=()=>{clearTimeout(n),n=setTimeout(i,Ci)},i=()=>{if(!t.scenarioState||t.scenarioState.name!==`room`){r();return}if(!t.integrityBaselineCaptured){r();return}if(t.world?.hasPointGravityOnBH||t.isHeroAnimating){r();return}if(t.allowsResetting===!1){r();return}let n=[];t.physicBodies.forEach(r=>{if(!r.isIntegrityCheckTarget||!r.integrity||t.isHeroAnimating||r.isResetting||r.isManualControl)return;let i=r.threeObject;i&&i.name;let a=r.translation(),o=r.rotation(),s=new e.Vector3(a.x,a.y,a.z),c=new e.Quaternion(o.x,o.y,o.z,o.w),l=r.integrity.position,u=s.distanceTo(l),d=!1;if(u>wi)d=!0;else{let e=r.integrity.quaternion;c.angleTo(e)>Ti&&(d=!0)}d&&n.push(r)});let i=!1,a=``;if(W.uniforms.uBootState&&W.uniforms.uBootState.value<.5&&(i=!0,a=R(`SYS_STORY_INTEGRITY_BOOTING`)),t.objectMap&&[{obj:t.objectMap.get(`screenDisplay001`),name:`Main Screen`},{obj:t.objectMap.get(`verticalMonitorDisplay`),name:`Vertical Screen`}].forEach(e=>{e.obj&&e.obj.material!==W&&(i=!0,a=e.obj.material===G?R(`SYS_STORY_INTEGRITY_NETFLIX`):e.obj.material===ri||e.obj.material===ii?R(`SYS_STORY_INTEGRITY_DOTA`):R(`SYS_STORY_INTEGRITY_WORK_FOCUS`))}),n.length>0||i){if(t.allowsResetting=!1,t.isHeroAnimating=!0,n.length>0&&n.map(e=>e.threeObject?e.threeObject.name:`Unknown Body`),i&&n.length===0?Z(a):n.length<3?Z(R(`SYS_STORY_INTEGRITY_MESS_LIGHT`)):Z(R(`SYS_STORY_INTEGRITY_MESS_HEAVY`)),t.conversationManager)if(i){if(t.objectMap){let e=t.objectMap.get(`screenDisplay001`);e&&e.material===G?t.conversationManager.shout(L.SHOUT_RESET_NETFLIX.en):e&&(e.material===ri||e.material===ii)?t.conversationManager.shout(L.SHOUT_RESET_DOTA.en):t.conversationManager.shout(L.SHOUT_RESET_GENERIC.en)}}else n.length>0&&t.conversationManager.shout(L.SHOUT_RESET_MESS.en);let o=i?Math.max(n.length,2):n.length,s=Math.min(1+(o-1)*.5,4),c=Math.min(800+o*200,2e3),l=o/1.25,u=Math.max(l*l,2)*2.5,d=Dr(t,`bangingFist`,{speed:s,randomize:!1,onComplete:()=>{}}),f=d.duration*1e3;if(setTimeout(()=>{t.allowsResetting=!0,t.isHeroAnimating=!1,r()},f+100),d&&d.duration){let n=d.duration*1e3*.4;setTimeout(()=>{xi(t),Si(t,u*.2),ui(c),typeof window.cvJump==`function`&&window.cvJump(200),t.objectMap&&([`screenDisplay001`,`screenDisplay002`,`verticalMonitorDisplay`].forEach(e=>{let n=t.objectMap.get(e);n&&(n.material=W,n.userData.originalMaterial=W)}),W.uniforms.uBootState&&(W.uniforms.uBootState.value=1)),Z(R(`SYS_STORY_INTEGRITY_RESTORING`));let n=performance.now()+c+200;if(t.physicBodies.forEach(e=>{try{e.isIntegrityResetTarget&&e.integrity&&e.handle!==void 0&&vi(t,e,n,u)}catch{}}),Pi(t),Wi&&Wi.length>0){let r=[`Object_12001`,`Object_108`],i=r[Math.floor(Math.random()*r.length)],a=t.getObjectByName(i);if(a){let r=new e.Vector3;a.getWorldPosition(r);let i=1.265+Math.random()*.46;Wi.forEach((a,o)=>{if(!a.visible)return;let s=o/Wi.length*Math.PI*2,c=r.x+Math.cos(s)*i,l=r.y+.05,d=r.z+Math.sin(s)*i,f=a.rapierBody;if(f){f.rapierCollider&&f.rapierCollider.setSensor(!0);let r=f.mass(),i=Math.random()*u*r;f.applyImpulse({x:0,y:u+i,z:0},!0);let a=u*r*.5;f.applyTorqueImpulse({x:(Math.random()-.5)*a,y:(Math.random()-.5)*a,z:(Math.random()-.5)*a},!0),f.wakeUp(),kr(f,()=>{let r=new e.Vector3(c,l,d),i=new e.Quaternion().setFromEuler(new e.Euler(0,Math.random()*Math.PI,0)),a=`coin-integrity-beam-${f.handle}`,o=I.ELECTRIC_CYAN||65535;t._activeResetCount=(t._activeResetCount||0)+1,Ei(t,!0);let s=null;if(Ko){let n=f.translation();Ko(t,``,``,new e.Vector3(n.x,n.y,n.z),a,!0,o,!0,1/0,!0),s=t.getObjectByName(a)}let u=t.getObjectByName(`mixamorigSpine1`)||t.getObjectByName(`a-char`),p=u?new e.Vector3().setFromMatrixPosition(u.matrixWorld):null;Ar(f,r,i,n,b.RigidBodyType.Dynamic,()=>{s&&(s.visible=!1,s.activeRequestID&&cancelAnimationFrame(s.activeRequestID)),t._activeResetCount--,Ei(t,!1)},(n,r)=>{if(s&&s.visible){let r=X(t,`drone`);if(r){let t=r.getObjectByName(`Sphere001_0`);if(t){let r=new e.Vector3;t.getWorldPosition(r);let i=r.distanceTo(n);s.position.copy(r),s.lookAt(n),s.children.forEach(e=>{e.scale.z=i})}}}},p)})}})}}},n)}}else r()};window.addEventListener(`pointerdown`,()=>{r()}),r()}function bi(e){e.allowsIntegrityCheck=!1}function xi(t){let n=new e.Group,r=new e.Color(`#ffc783`),i=I.ACCENT_GOLD||new e.Color(`#ffcc00`);new e.Color(`#ffffff`),n.position.set(-1.95,2.64,-1.35),t.add(n);let a=new e.TorusGeometry(1,.04,16,100),o=Rt(r,1.5,.01,4),s=new e.Mesh(a,o);s.rotation.x=Math.PI/2;let c=Rt(i,1.2,.01,4.5),l=new e.Mesh(a,c);l.rotation.x=Math.PI/2,l.rotation.z=.2,n.add(s,l);let u=new e.IcosahedronGeometry(.1,0),d=[];for(let t=0;t<24;t++){let a=t%2==0?r:i,o=zt(a,1.5,4),s=new e.Mesh(u,o),c=Rt(a,1.5,.01,4.5),l=new e.Mesh(u,c);l.scale.setScalar(1.4),s.add(l);let f=Math.random()*Math.PI*2,p=Math.random()*Math.PI*.6,m=.05+Math.random()*.15;s.userData.velocity=new e.Vector3(Math.sin(p)*Math.cos(f)*m,Math.cos(p)*m,Math.sin(p)*Math.sin(f)*m),s.userData.rotationSpeed=new e.Vector3(Math.random()*.15,Math.random()*.15,Math.random()*.15),n.add(s),d.push(s)}let f=new e.SphereGeometry(.2,8,8),p=zt(r,1,5),m=new e.Mesh(f,p);n.add(m),new v.Tween({progress:0}).to({progress:1},3500).easing(v.Easing.Exponential.Out).onUpdate(e=>{let t=e.progress;d.forEach(e=>{e.position.add(e.userData.velocity),e.userData.velocity.multiplyScalar(.98),e.rotation.x+=e.userData.rotationSpeed.x,e.rotation.y+=e.userData.rotationSpeed.y,e.rotation.z+=e.userData.rotationSpeed.z;let n=1-t;e.scale.setScalar(n),e.material.uniforms&&(e.material.uniforms.glowIntensity.value=4*n);let r=e.children[0];r&&r.material.uniforms&&(r.material.uniforms.outerGlowStrength.value=1.5*n)}),s.scale.setScalar(.1+t*15),s.material.uniforms.outerGlowStrength.value=1.5*(1-t),l.scale.setScalar(.05+t*10),l.material.uniforms.outerGlowStrength.value=1.2*(1-t),m.scale.setScalar(2*(1-t*1.5)),m.material.uniforms&&(m.material.uniforms.glowIntensity.value=5*(1-t*2))}).onComplete(()=>{t.remove(n),a.dispose(),u.dispose(),f.dispose(),d.forEach(e=>{e.material.dispose(),e.children[0]&&e.children[0].material.dispose()}),o.dispose(),c.dispose(),p.dispose()}).start()}function Si(t,n=.15,r=600){let i=t.camera;i&&(i._shakeOffset||=new e.Vector3,new v.Tween({t:0}).to({t:1},r).easing(v.Easing.Quadratic.Out).onUpdate(e=>{let t=n*(1-e.t);i.position.sub(i._shakeOffset),i._shakeOffset.set((Math.random()-.5)*t,(Math.random()-.5)*t,(Math.random()-.5)*t),i.position.add(i._shakeOffset)}).onComplete(()=>{i.position.sub(i._shakeOffset),i._shakeOffset.set(0,0,0)}).start())}var Ci,wi,Ti,Ei,Di=M((()=>{Or(),ks(),Ae(),ls(),ci(),ea(),Oe(),mi(),Sn(),Te(),Nr(),Ci=3e3,wi=2,Ti=.25,Ei=(e,t=!1)=>{if(e._activeResetCount===void 0&&(e._activeResetCount=0),e.globalUniformsHub&&e.cyanPulseActive){let n=e.globalUniformsHub.uniforms,r=e.cyanPulseActive;t?(r.value=1,n.uWorldGridProgress.value=1):e._activeResetCount<=0&&new v.Tween(n.uWorldGridProgress).to({value:0},150).onComplete(()=>{r.value=0}).start()}}}));function Oi(t){if(!t)return new e.Vector3(0,0,0);if(t.skeleton&&t.skeleton.bones.length>0){let n=t.skeleton.bones[0],r=new e.Vector3;return n.getWorldPosition(r),r}t.updateMatrixWorld(!0);let n=new e.Vector3;return t.getWorldPosition(n),n}function ki(t,n){let r=t.getObjectByName(`Lathe_Center`),i=new e.Vector3;r?r.getWorldPosition(i):i.set(-8.5,7.25,-.39);let a=t.getObjectByName(`a-char`),o=new e.Vector3;a?a.getWorldPosition(o):o.set(0,1,0),o.y+=.8,Z(`Dragon Balls drawn to the singularity...`),t.fanAction&&new v.Tween(t.fanAction).to({timeScale:12},1500).easing(v.Easing.Quadratic.In).start(),ji(t,i,()=>{Mi(t,r),setTimeout(()=>{if(t._spawnStopSignal)return;let n=o.clone();n.y+=6+Math.random()*2.5,n.x+=(Math.random()-.5)*1.5,n.z+=(Math.random()-.5)*1.5;let r=Fi(t,i.clone(),null);if(r&&r.rapierBody){let a=r.rapierBody;a.setBodyType(b.RigidBodyType.KinematicPositionBased);let o=i.clone(),s=o.clone(),c=new e.Vector3().subVectors(n,i);n.addVectors(i,c.multiplyScalar(1.5));let l=null;new v.Tween(s).to({x:n.x,y:n.y,z:n.z},1400).easing(v.Easing.Cubic.Out).onStart(()=>{let e=`coin-erupt-beam`;Ko&&(Ko(t,``,``,i.clone(),e,!1,16766720,!0,1/0,!0),l=t.getObjectByName(e))}).onUpdate(()=>{a.setNextKinematicTranslation(s);let i=s.distanceTo(o),c=n.distanceTo(o),u=c>0?i/c:0,d=1+Math.sin(u*Math.PI)*.4;r.scale.setScalar(.5*d);let f=X(t,`drone`);if(l&&l.visible&&f){let n=f.getObjectByName(`Sphere001_0`);if(n){let i=new e.Vector3;n.getWorldPosition(i);let a=i.distanceTo(s);l.position.copy(i),l.lookAt(s),l.children.forEach(e=>{e.scale.z=a}),t.gazeFollower&&t.gazeFollower.lookAtTarget(r)}}}).onComplete(()=>{r.scale.setScalar(.5);let e=t.getObjectByName(`coin-erupt-beam`);e&&(e.visible=!1,e.activeRequestID&&cancelAnimationFrame(e.activeRequestID)),a.setBodyType(b.RigidBodyType.Dynamic),a.wakeUp(),a.applyImpulse({x:(Math.random()-.5)*6,y:18+Math.random()*12,z:(Math.random()-.5)*6},!0)}).start()}},250),setTimeout(()=>{t._spawnStopSignal||Ni(t,i)},500)})}function Ai(e,t,n){if(!(!e.rapierBody||!t.world))try{let r=e.rapierBody.collider(0),i=t.world.getCollider(r);i&&(i.setCollisionGroups(n),i.setSolverGroups(n))}catch{}}function ji(t,n,r){dr(t,!1),setTimeout(()=>{let i=(t.dragonBalls||[]).filter(e=>e);if(i.length===0){r&&r();return}let a=i.length;i.forEach((o,s)=>{o.ritualStartScale=o.scale.clone(),o.position.clone(),o.rapierBody&&o.rapierBody.setBodyType(b.RigidBodyType.KinematicPositionBased),Ai(o,t,Qi);let c=s*60;setTimeout(()=>{let t=o.position.clone(),c=new e.Vector3().subVectors(n,t).normalize(),l=s/Math.max(i.length,1)*Math.PI*2,u={t:0};new v.Tween(u).to({t:1},1e3).easing(v.Easing.Cubic.In).onUpdate(()=>{let r=u.t,i=new e.Vector3().lerpVectors(t,n,r);i.y+=Math.sin(r*Math.PI)*5;let a=r*Math.PI*3+l,s=r*(1-r)*4*2,d=new e.Vector3(-c.z,0,c.x).normalize();i.addScaledVector(d,Math.cos(a)*s),i.y+=Math.sin(a)*s*.5,o.rapierBody&&o.rapierBody.setNextKinematicTranslation(i);let f=1-r*.9;o.ritualStartScale&&o.scale.copy(o.ritualStartScale).multiplyScalar(f)}).onComplete(()=>{o.visible=!1,a--,a===0&&r&&r()}).start()},c)})},150)}function Mi(e,t){if(!t)return;let n=e.globalUniformsHub;if(n&&n.uNebulaRotationSpeed&&n.uNebulaSwirlSpeed){let e=.3,t=.25;new v.Tween({rot:e,swirl:t}).to({rot:3,swirl:25},600).easing(v.Easing.Exponential.Out).onUpdate(e=>{n.uNebulaRotationSpeed.value=e.rot,n.uNebulaSwirlSpeed.value=e.swirl}).onComplete(()=>{new v.Tween({rot:3,swirl:25}).to({rot:e,swirl:t},1500).easing(v.Easing.Quadratic.InOut).onUpdate(e=>{n.uNebulaRotationSpeed.value=e.rot,n.uNebulaSwirlSpeed.value=e.swirl}).start()}).start()}e.fanAction&&new v.Tween(e.fanAction).to({timeScale:1},2500).easing(v.Easing.Cubic.Out).start(),e.raycasterWrapper&&kn(e)}function Ni(e,t){let n=e.dragonBalls||[];n.forEach((r,i)=>{if(r&&(r.rapierBody&&(r.rapierBody.setTranslation({x:t.x,y:t.y,z:t.z},!0),r.rapierBody.setLinvel({x:0,y:0,z:0},!0),r.rapierBody.setAngvel({x:0,y:0,z:0},!0)),r.visible=!0,r.ritualStartScale&&r.scale.copy(r.ritualStartScale),Ai(r,e,$i),r.rapierBody)){r.rapierBody.setBodyType(b.RigidBodyType.Dynamic),r.rapierBody.wakeUp();let e=i/Math.max(n.length,1)*Math.PI*2+Math.random()*.4,t=20+Math.random()*15,a=10+Math.random()*8;r.rapierBody.applyImpulse({x:Math.cos(e)*t,y:a,z:Math.sin(e)*t},!0),r.rapierBody.applyTorqueImpulse({x:(Math.random()-.5)*4,y:(Math.random()-.5)*4,z:(Math.random()-.5)*4},!0)}})}function Pi(t,n=null,r=null){if(t.world&&t.world.isBusy){setTimeout(()=>Pi(t,n,r),16);return}let i=t.world.hasPointGravityOnBalls;t._dragonBallRestoreTimeout&&=(clearTimeout(t._dragonBallRestoreTimeout),null),dr(t,!1);let a=t.dragonBalls||[];if(a.length===0){r&&r();return}let o=new e.Vector3(0,.8,0);if(n)o.copy(n);else{let e=Oi(t.getObjectByName(`Object_108`));o.copy(e),o.y+=.25}let s=1.035,c=performance.now()+1200+200,l=a.length;a.forEach((n,u)=>{if(!n||!n.rapierBody)return;let d=n.rapierBody;d.rapierCollider&&d.rapierCollider.setSensor(!0);let f=u/a.length*Math.PI*2,p=o.x+Math.cos(f)*s,m=o.y,h=o.z+Math.sin(f)*s,g=d.mass(),_=Math.random()*5*g;d.applyImpulse({x:0,y:5+_,z:0},!0);let v=5*g*.5;d.applyTorqueImpulse({x:(Math.random()-.5)*v,y:(Math.random()-.5)*v,z:(Math.random()-.5)*v},!0),d.wakeUp(),kr(d,()=>{let n=new e.Vector3(p,m,h),a=new e.Quaternion,s=`dragon-beam-${u}`,f=null;if(Ko){let n=d.translation();Ko(t,``,``,new e.Vector3(n.x,n.y,n.z),s,!0,16747520,!0,1/0,!0),f=t.getObjectByName(s)}t._activeResetCount=(t._activeResetCount||0)+1,Ei&&Ei(t,!0),Ar(d,n,a,c,b.RigidBodyType.Dynamic,()=>{f&&(f.visible=!1,f.activeRequestID&&cancelAnimationFrame(f.activeRequestID)),t._activeResetCount--,Ei&&Ei(t,!1),l--,l===0&&(r&&r(),t.gazeFollower&&(t.gazeFollower.isLocked=!1,Go(t,t.camera,!1)),i&&(t._dragonBallRestoreTimeout=setTimeout(()=>{t.world&&t.world.ballBodies&&dr(t,!0),t._dragonBallRestoreTimeout=null},3e3)))},(n,r)=>{let i=t.getObjectByName(`drone`);if(f&&f.visible&&i){let r=i.getObjectByName(`Sphere001_0`);if(r){let i=new e.Vector3;r.getWorldPosition(i);let a=i.distanceTo(n);f.position.copy(i),f.lookAt(n),f.children.forEach(e=>{e.scale.z=a}),u===0&&Go(t,o,!0)}}})})})}function Fi(e,t,n,r=!1,i=null){let a=e.getObjectByName(`btc_symbol`),o=e.getObjectByName(`eth_symbol`);if(!a){console.warn(`btc_symbol not found in scene`);return}let s=.5;Bi||(Bi=vn.clone(),Vi=_n.clone());let c=`BTC`,l=a;i?(c=i===`ETH`?`ETH`:`BTC`,l=c===`ETH`?o:a):o&&Math.random()>.5&&(c=`ETH`,l=o);let u=null,d=!1,f=null;if(Wi.length>=Yi){let t=Wi.shift();t&&(f=t.userData.coinType,Ii(e,t))}if(Wi.length+qi.length>=Ji){let t=qi.shift();!t&&Wi.length>0&&(t=Wi.shift()),t&&(Li(e,t),t.userData.coinType===`ETH`?Ki.push(t):Gi.push(t))}let p=c===`ETH`?Ki:Gi;if(p.length>0)u=p.shift(),d=!0,u.visible=!0,Oo(e,u);else{u=l.clone(),u.scale.setScalar(s),u.name=`${c}_${performance.now()} `,u.userData.coinType=c,u.material=Bi,Oo(e,u);let t=u.clone();t.name=`Aura`,t.material=Vi,t.position.set(0,0,0),t.rotation.set(0,0,0),t.scale.setScalar(1.25),u.add(t),e.add(u)}Wi.push(u),t&&u.position.copy(t),u.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI);let m=l.scale.clone(),h=m.clone();if(e.world){let r=d&&u.rapierBody?u.rapierBody:null;if(r)r.wakeUp(),r.setTranslation({x:t.x,y:t.y,z:t.z},!0),r.setLinvel({x:0,y:0,z:0},!0),r.setAngvel({x:0,y:0,z:0},!0);else{let{body:t,shape:n}=Pe(e,u,{bodyType:`dynamic`,mass:1,restitution:.2,friction:.8,canSleep:!0,isConvexHull:!0,isBhTarget:!0,linearDamping:.8,angularDamping:.8});Me(e,u,t,n)}let i=u.rapierBody;i&&(n&&i.applyImpulse({x:n.x,y:n.y,z:n.z},!0),i.applyTorqueImpulse({x:Math.random(),y:Math.random(),z:Math.random()},!0),e.bhTargets&&!e.bhTargets.includes(u)&&e.bhTargets.push(u))}if(d||wn(e,u,{onMouseEnter:t=>{let n=Hi[c.toLowerCase()],r=`Push ${c}`;if(n){let e=n.toLocaleString(`en-US`,{style:`currency`,currency:`USD`,minimumFractionDigits:n<1?4:0,maximumFractionDigits:n<1?4:0}),t=new Date,i=t.toLocaleString(`en-US`,{month:`short`}),a=t.getDate(),o=t.getFullYear(),s=t.toLocaleTimeString(`en-US`,{hour:`2-digit`,minute:`2-digit`,hour12:!1});r=`${c}: ${e} \nat ${i}${a} ${o}, ${s}`}Xi(e,c===`ETH`?er:tr,r),Tn(e,t)},onMouseLeave:t=>{Zi(e)},onMouseDown:(t,n)=>{On(e,t,n,5)}}),!r&&e.fireflies&&e.fireflies.triggerFlash&&Ui!==c&&(e.fireflies.triggerFlash(c),Ui=c),Wi.length%5,!r){let e=c===`BTC`?`Bitcoin`:`Ethereum`;Z(f?`Received 1 ${e}, lost 1 ${f===`BTC`?`Bitcoin`:`Ethereum`}. Even you can't hold that much power!`:`The Cosmos has manifested 1 ${e} just for you!`)}let g=.1;u.scale.copy(m).multiplyScalar(s*g);let _={t:0};u.userData.oscStrength=5;let y=u.getObjectByName(`Aura`);if(y&&(y.userData.oscStrength=5),!d){let e=e=>{e.onBeforeRender=function(e,t,n,r,i,a){i.uniforms&&i.uniforms.uOscillationStrength&&(this.userData.prevOsc=i.uniforms.uOscillationStrength.value,i.uniforms.uOscillationStrength.value=this.userData.oscStrength)},e.onAfterRender=function(e,t,n,r,i,a){i.uniforms&&i.uniforms.uOscillationStrength&&this.userData.prevOsc!==void 0&&(i.uniforms.uOscillationStrength.value=this.userData.prevOsc)}};e(u),y&&e(y)}return u.userData.activeTween&&u.userData.activeTween.stop(),u.userData.activeTween=new v.Tween(_).to({t:1},5e3).easing(v.Easing.Cubic.Out).onUpdate(()=>{let e=_.t;u.scale.lerpVectors(m.clone().multiplyScalar(s*g),h.clone().multiplyScalar(s),e);let t=5*(1-e);u.userData.oscStrength=t,y&&(y.userData.oscStrength=t)}).onComplete(()=>{u.userData.activeTween=null}).start(),u}function Ii(t,n){if(qi.length>40){Li(t,n),n.userData.coinType===`ETH`?Ki.push(n):Gi.push(n);return}if(qi.push(n),n.rapierBody){n.rapierBody.setBodyType(b.RigidBodyType.Dynamic),n.rapierBody.wakeUp();let t=new e.Vector3(6,7,8),r=new e.Vector3().subVectors(t,n.position).normalize();r.multiplyScalar(30),n.rapierBody.applyImpulse({x:r.x,y:r.y,z:r.z},!0),n.rapierBody.applyTorqueImpulse({x:Math.random(),y:Math.random(),z:Math.random()},!0)}n.userData.activeTween&&n.userData.activeTween.stop(),n.userData.activeTween=new v.Tween(n.scale).to({x:0,y:0,z:0},500).delay(1500).easing(v.Easing.Back.In).onComplete(()=>{n.userData.activeTween=null,Li(t,n);let e=qi.indexOf(n);e>-1&&qi.splice(e,1),n.userData.coinType===`ETH`?Ki.push(n):Gi.push(n)}).start()}function Li(e,t){if(t&&(e.world&&e.world.ballBodies&&e.world.ballBodies.includes(t.rapierBody)&&e.world.ballBodies.splice(e.world.ballBodies.indexOf(t.rapierBody),1),e.bhTargets&&e.bhTargets.includes(t)&&e.bhTargets.splice(e.bhTargets.indexOf(t),1),ko(e,t.name),t.userData.activeTween&&(t.userData.activeTween.stop(),t.userData.activeTween=null),t.visible=!1,t.rapierBody)){t.rapierBody.setBodyType(b.RigidBodyType.Dynamic),t.rapierBody.setTranslation({x:0,y:-100,z:0},!0),t.rapierBody.setLinvel({x:0,y:0,z:0},!0),t.rapierBody.setAngvel({x:0,y:0,z:0},!0),t.rapierBody.sleep();let n=`coin-integrity-beam-${t.rapierBody.handle}`,r=e.getObjectByName(n);r&&(r.visible=!1,r.activeRequestID&&cancelAnimationFrame(r.activeRequestID))}}function Ri(e){zi(e)}function zi(e){let t=[...Wi,...qi];Wi.length=0,qi.length=0;let n=0,r=()=>{if(!e)return;let i=Math.min(n+5,t.length);for(let r=n;r<i;r++){let n=t[r];n&&Li(e,n)}n=i,n<t.length?requestAnimationFrame(r):e.children.forEach(t=>{t&&t.name&&(t.name.startsWith(`BTC_`)||t.name.startsWith(`ETH_`))&&t.visible&&Li(e,t)})};t.length>0&&r()}var Bi,Vi,Hi,Ui,Wi,Gi,Ki,qi,Ji,Yi,Xi,Zi,Qi,$i,ea=M((()=>{Mn(),He(),Sn(),rr(),xr(),ks(),Er(),Or(),Nr(),ls(),Di(),Bi=null,Vi=null,Hi={},Ui=null,Sr().then(e=>{e.forEach(e=>{Hi[e.symbol.toLowerCase()]=e.current_price})}),Wi=[],Gi=[],Ki=[],qi=[],Ji=120,Yi=60,Xi=(e,t,n)=>{e.raycasterWrapper?.mouseInContainer&&(H(e,t,n),document.body.style.cursor=`pointer`)},Zi=e=>{U(e),document.body.style.cursor=`auto`},Qi=131074,$i=4294967295}));function ta(){let t=document.getElementById(`narrative-shader-canvas`),n=document.querySelector(`.modal-narrative`);if(!t||!n)return;q.parent=n;let r=new e.WebGLRenderer({canvas:t,alpha:!0,antialias:!1});r.setPixelRatio(.5),r.setSize(n.clientWidth,n.clientHeight),q.renderer=r;let i=new e.Scene,a=new e.OrthographicCamera(-1,1,1,-1,0,1);q.scene=i,q.camera=a;let o=new e.PlaneGeometry(2,2),s=new e.TextureLoader().load(oa);s.wrapS=e.RepeatWrapping,s.wrapT=e.RepeatWrapping;let c=new e.ShaderMaterial({uniforms:{iTime:{value:0},iResolution:{value:new e.Vector2(n.clientWidth,n.clientHeight)},iMouse:{value:new e.Vector4(0,0,0,0)},iChannel0:{value:s}},vertexShader:`
            void main() {
                gl_Position = vec4(position, 1.0);
            }
        `,fragmentShader:`
        precision highp float;
        uniform float iTime;
        uniform vec2 iResolution;
        uniform vec4 iMouse;
        uniform sampler2D iChannel0;

        #define LIGHTS_ON
        #define rot(a) mat2(cos(a), -sin(a), sin(a), cos(a))
        #define rep(p, r) mod(p+r, r+r)-r
        #define rid(p, r) floor((p+r)/(r+r))
        #define lrep(p, r, l) p-r*clamp(round(p/r), -l, l)

        float acc = 0.;
        float occ = 1.;

        vec3 hash(vec2 p) {
            vec2 r = fract(sin(p*mat2(137.1, 12.7, 74.7, 269.5)) * 43478.5453);
            return vec3(r, fract(r.x*r.y*1121.67));
        }
        #define hash33(p) fract(sin(p*mat3(127.1,311.7,74.7,269.5,183.3,246.1,113.5,271.9,124.6))*43758.5453123)

        float box(vec3 p, vec3 b) {
            vec3 q = abs(p) - b;
            return length(max(q, 0.)) + min(max(q.x, max(q.y, q.z)), 0.);
        }
        float rect(vec2 p, vec2 b) {
            vec2 d = abs(p) - b;
            return length(max(d, 0.)) + min(max(d.x, d.y), 0.);
        }

        #define ext 2.
        float opElevatorWindows(vec3 p, float b) {
            float e  = box(p, vec3(ext*.8, 2.7, .3));
            float lv = length(p.xz) - .1;   p.y += 1.;
            float lh = length(p.yz) - .1;
            lh = max(b, lh);
            b  = max(b, -e);
            b  = min(b, min(lv, lh));
            return b;
        }

        float building(vec3 p0, vec3 p, float L) {
            float B = rect(p.xz, vec2(L, 10)); 
            float B2 = rect(vec2(abs(p.x)-L-ext, p.z), vec2(ext, 10));
            
            if (min(B, B2) > .2) return min(B, B2);
            
            vec3 q = p;
            float var = step(1., mod(rid(p.y, 3.), 6.)); 
            p.y = rep(p.y, 3.);
            vec3 pb = vec3(abs(p.x), p.yz);

        #ifdef LIGHTS_ON
            vec3 id = rid(vec3(q.xy, p0.z), vec3(21, 18, 48));
            vec3 rn = hash33(id);
            float rw = fract(rn.x*rn.z*1021.67);
                
            q.x += 14. * (rn.x*3.-1.);
            q.y += 12. * (floor(rn.y*3.)-1.);
            q.xy = rep(q.xy, vec2(21, 18));

            float l = box(q, vec3(mix(3., 15., rw), rn.z*1.5+.5, 7));
            
            // --- ENHANCEMENT: VOLUMETRIC LIGHT BLEED ---
            // Dual-layer accumulation: 
            // 1. Sharp core glow (power 1.5)
            // 2. Softer atmospheric bleed (power 1.1, lower density distance)
            float core = 0.6 / (1. + pow(abs(l) * 18.0, 1.5));
            float bleed = 0.25 / (1. + pow(abs(l) * 4.0, 1.1)); 
            
            // Add subtle pulse/flicker based on window ID to make the city feel alive
            float pulse = 0.85 + 0.15 * sin(iTime * (1.5 + rn.y * 2.0) + rn.x * 10.0);
            
            acc += (core + bleed) * pulse
                        * smoothstep(0., .4, iTime - rw * 20.)
                        * step(p0.x, 10. + 2e2*step(20., abs(p0.z)));
        #endif
            
            occ = min(occ, smoothstep(3.5, 0., -rect(p.xz, vec2(L+2.,10))));    
            occ = min(occ, smoothstep(0.6, 0., -rect(pb.xz-vec2(L+ext,0), vec2(ext,10))));
            
            q = p;
            q.x = rep(q.x, 7.);    
            q.y -= (1. - var)*1.01;
            
            float f = box(q + vec3(0,0,10), vec3(6.6, 2. + var, 3));
            B = max(B, -f);
            B = max(B, -rect(q.xz + vec2(0,10), vec2(6.6, .7)*var));
            
            q = p;
            q.x = rep(q.x, .8);
            
            float r  = length(p.yz + vec2(1, 9.5-var*.5)) - .2;
            float rv = length(q.xz + vec2(0, 9.5-var*.5)) - .16;
            r = min(r, rv);
            r = max(r, p.y + 1.);

            q = p;
            q.x = rep(q.x, 1.75);
            
            float b = length(q.xz + vec2(0, 7.3)) - .2;
            r = min(r, b);
            
            B = min(B, r);
            B = max(B, abs(p.x) - L);
                    
            if (B2 > .04) return min(B, B2);
            
            B2 = opElevatorWindows(pb - vec3(L+ext,0,-9.9), B2);
            B2 = opElevatorWindows(vec3(pb.z+8., pb.y, pb.x-L-ext-1.9), B2);

            q = vec3(pb.xy, pb.z - 1.8);
            q.z = lrep(q.z, 2.5, 2.);
            
            float w = box(q - vec3(L+ext*2.,1.2,0), vec3(.5, 1.6, 1.2));
            B2 = max(B2, -w);
                        
            return min(B, B2);
        }

        float map(vec3 p) {
            vec2 id = vec2(step(40., p.x), rid(p.z, 140.));  
            vec3 rn = mix(vec3(1, -.5, 0), hash(id), step(.5, id.x+id.y));
                
            vec3 p0 = p;
            p.x = abs(abs(p.x - 40.) - 80.);
            p.z = rep(p.z - id.x*200., 200.);
            
            float bL = 21.4 + id.y*3.;
            float b1 = building(p0, p - vec3(30,0,0), bL);
            float b2 = building(p0, vec3(p.z,p.y,-p.x), 185.);
            
            float rpy = 80. + 150. * rn.x;
            p.y = rep(p.y - iTime * 40. * (rn.y*.5+.5), rpy);
            p -= vec3(30.+bL+ext, rn.z*rpy*.5, ext-10.);

            float l = box(p, vec3(ext*.8, 2.7, ext*.8));
            // Boosted glow for elevator cabs
            acc += .8 / (1. + pow(abs(l)*15., 1.1));
            
            b2 = min(b2, abs(p0.x + p0.z - 30.) + 6.);

            return min(b1, b2);
        }

        vec3 normal(vec3 p) {
            const vec2 k = vec2(1,-1)*.0001;
            return normalize(k.xyy*map(p + k.xyy) + k.yyx*map(p + k.yyx) + 
                            k.yxy*map(p + k.yxy) + k.xxx*map(p + k.xxx));
        }

        void main() {
            vec2 R = iResolution.xy;
            vec2 F = gl_FragCoord.xy;
            vec2 u = (F+F-R)/R.y;
            vec2 M = iMouse.xy/R * 2. - 1.;
            M *= step(0.5, iMouse.z);
            
            float T  = 1. - pow(1. - clamp(iTime*.025, 0., 1.), 3.);
            float ax = mix(-.8, .36, T);
            float az = mix(-40., -140., T);
            
            // --- ENHANCEMENT: INCREASED MOUSE X RESPONSIVENESS ---
            // Increased sensitivity (1.5x) and loosened clamp to allow more horizontal looking
            float rx = M.x * 1.5 - (cos(iTime*.1)*.5+.5)*.4;
            rx = clamp(ax + rx - .55, -2.2, 0.8);

            vec3 ro = vec3(0, iTime*10., az);
            vec3 rd = normalize(vec3(u, 3));
            
            rd.zy *= rot(M.y*1.5); // Boosted Y Tilt responsiveness
            rd.zx *= rot(rx); 
            ro.zx *= rot(rx);  
        
            vec3 p; float d, t = 0.;
            for (int i = 0; i < 30; i++) {
                p = ro + t * rd; 
                t += d = map(p);
                if (d < .01 || t > 2200.) break;
            }
            
            // --- ENHANCEMENT: ELECTRIC CYAN DNA TONE SHIFT ---
            // Base color shifted from deep purple to a more technical navy/cyan mix
            vec3 baseCol = vec3(0.04, 0.12, 0.22) - vec3(0, 1.0, 1.0) * abs(p.x-40.) * 0.001;
            vec3 col = baseCol;
            col *= clamp(1. + dot(normal(p), normalize(vec3(0,0,1))), .5, 1.);
            
            col *= 1. - texture2D(iChannel0, vec2(p.x+p.z, p.y+p.z)*.05).rgb*.7;
            col *= occ;
            
            // Re-tuned fog (mix third param) to lean into Cyan DNA
            col = mix(vec3(0.001, 0.015, 0.02), col, exp(-t * 0.002 * vec3(0.7, 1.0, 1.2) - length(u) * 0.5));

            // Accumulation/Glow: Shifted from Amber to Electric Cyan mix
            col += acc * mix(vec3(0.1, 0.8, 1.0), vec3(0.0, 0.4, 0.6), t * 0.0006);
            col += pow(acc, 2.0) * vec3(0.0, 0.2, 0.4); // Hot specular peaks
                
            col = pow(col, .46*vec3(.98, 1.0, 1.02)); // Slight tint shift towards blue
            
            u = F/R; u *= 1. - u.yx;
            col *= pow(clamp(u.x * u.y * 80., 0., 1.), .2);
                        
            // --- ENHANCEMENT: INCREASED BRIGHTNESS ---
            // Increased from 0.2 to 0.4 for better visibility while remaining a background
            gl_FragColor = vec4(col * 0.45, 1.0); 
        }
    `,transparent:!0});q.material=c;let l=new e.Mesh(o,c);i.add(l),q.mesh=l,window.addEventListener(`mousemove`,e=>{n.getBoundingClientRect();let t=window.innerWidth,r=window.innerHeight,i=e.clientX/t*2-1,a=e.clientY/r*2-1,o=(i+1)*.5*n.clientWidth,s=(1-(a+1)*.5)*n.clientHeight;q.targetMouse.set(o,s,1,1)}),q.startTime=performance.now(),window.addEventListener(`resize`,ia)}function na(){q.active||(ia(),q.startTime=performance.now(),q.currentMouse.x=q.targetMouse.x,q.currentMouse.y=q.targetMouse.y,q.currentMouse.z=1,q.currentMouse.w=1,q.active=!0,aa())}function ra(){q.active=!1,q.animationId&&(cancelAnimationFrame(q.animationId),q.animationId=null)}function ia(){let{parent:e,renderer:t,material:n}=q;if(!e||!t||!n)return;let r=e.clientWidth,i=e.clientHeight;t.setSize(r,i),n.uniforms.iResolution.value.set(r,i)}function aa(){if(!q.active)return;q.animationId=requestAnimationFrame(aa);let{renderer:e,scene:t,camera:n,material:r,startTime:i,targetMouse:a,currentMouse:o,lerpFactor:s}=q;!e||!t||!n||!r||(o.x+=(a.x-o.x)*s,o.y+=(a.y-o.y)*s,o.z+=(a.z-o.z)*s,o.w+=(a.w-o.w)*s,r.uniforms.iTime.value=(performance.now()-i)*.001,r.uniforms.iMouse.value.copy(o),e.render(t,n))}var q,oa,sa=M((()=>{q={renderer:null,scene:null,camera:null,material:null,mesh:null,parent:null,animationId:null,active:!1,startTime:0,targetMouse:new e.Vector4(0,0,0,0),currentMouse:new e.Vector4(0,0,0,0),lerpFactor:.08},oa=`./textures/noise.webp`}));function ca(e){ua(e),ta(),window.addEventListener(`keydown`,t=>{let n=t.key.toLowerCase();if(n===`g`)da(e);else if(n===`l`)_a(e,null,!0);else if(n===`i`||n===`d`){let e=document.getElementById(`cv-container`);if(e){let t=document.getElementById(`app-container`),r=t?t.offsetWidth:window.innerWidth,i=r*.05,a=e.offsetWidth,o=n===`i`?a+i:a-i;o>200&&o<r*.9&&(e.style.width=`${o}px`,e.classList.contains(`collapsed`)&&(e.style.transform=`translateX(${o}px)`,e.style.marginRight=`-${o}px`,e.userData&&(e.userData.x=o,e.userData.margin=-o))),window.dispatchEvent(new Event(`resize`))}}}),window.addEventListener(`subtitleClose`,t=>{let n=e.scenarioState?.name===`room`,r=!e.isHeroAnimating&&!e.isTransitioning;t.detail?.manual&&n&&r&&da(e)})}function la(e,t){let n=Ca.filter(e=>e.event===`click`);for(let r of n){let n=e.target.closest(r.selector);if(n){r.action(e,t,n);return}}}function ua(e){document.body.addEventListener(`click`,t=>la(t,e)),Ca.forEach(t=>{t.event!==`click`&&document.querySelectorAll(t.selector).forEach(n=>{n.addEventListener(t.event,r=>t.action(r,e,n))}),t.event===`click`&&document.querySelectorAll(t.selector).forEach(e=>{e.tagName!==`A`&&(e.style.cursor=`pointer`)})})}async function da(t,n={}){let{onImpact:r=null,onComplete:i=null}=n;if(!(t.scenarioState&&t.scenarioState.name===`room`)||t.isHeroAnimating||!window.boneTracker){console.warn(`[Cinematic] Aborted: Context mismatch or active animation.`);return}let a=t.getObjectByName(`a-char`),o=t.getObjectByName(`stool_bound`);if(!a||!o)return;t.isHeroAnimating=!0,t.allowsResetting=!1;let s=[`pokeball`,`pokeball2`,`questionCube`],c=null,l=1/0;s.forEach(e=>{let n=t.getObjectByName(e);if(n&&n.visible&&n.rapierBody){let e=n.position.distanceTo(a.position);e<l&&(l=e,c=n)}});let u=()=>{let e=e=>{if(!e)return!1;let t=e.getBoundingClientRect();return t.top<window.innerHeight&&t.bottom>0},t=document.querySelector(`#persona-switch-btn`);return e(t)?t:Array.from(document.querySelectorAll(`h2`)).find(t=>e(t))||document.querySelector(`#cv-export-btn`)||document.querySelector(`#cv-header`)},d=document.querySelector(`#persona-switch-btn`);if(d&&d.classList.add(`persona-aggressive-jitter`),c&&c.rapierBody){let n=c.rapierBody,r=new e.Vector3(1,1,-1.5),i=new e.Quaternion(0,0,0,1),o=n.bodyType();n.rapierCollider&&n.rapierCollider.setSensor(!0);let s=n.mass();n.wakeUp(),n.applyImpulse({x:0,y:15*s,z:0},!0);let l=t.getObjectByName(`mixamorigSpine1`),u=new e.Vector3;l?l.getWorldPosition(u):a.getWorldPosition(u),kr(n,()=>{let a=`ritual-beam-${n.handle}`,s=I.ELECTRIC_CYAN||65535,c=n.translation();Ko(t,``,``,new e.Vector3(c.x,c.y,c.z),a,!0,s,!0,1/0,!0);let l=t.getObjectByName(a);Ar(n,r,i,performance.now()+1e3,o,()=>{l&&(l.visible=!1,l.activeRequestID&&cancelAnimationFrame(l.activeRequestID)),n.setTranslation(r,!0),n.setLinvel({x:0,y:0,z:0},!0),n.setAngvel({x:0,y:0,z:0},!0)},(n,r)=>{if(l&&l.visible){let r=t.objectMap&&t.objectMap.get?t.objectMap.get(`drone`):t.getObjectByName(`drone`);if(r){let t=r.getObjectByName(`Sphere001_0`);if(t){let r=new e.Vector3;t.getWorldPosition(r);let i=r.distanceTo(n);l.position.copy(r),l.lookAt(n),l.children.forEach(e=>{e.scale.z=i})}}}},u)})}if(setTimeout(()=>{Dr(t,`sitToStand`,{speed:1.2,autoReturn:!1})},2e3),await wa(t,{x:1,y:0,z:.75}),d&&d.classList.remove(`persona-aggressive-jitter`),window.boneTracker){let e=u(),n=e&&e.tagName===`H2`;n&&(e.style.outline=`2px solid var(--c-cyan)`,e.style.outlineOffset=`4px`,e.style.transition=`outline 0.3s ease`),window.boneTracker.hasHitThisSwing=!1,window.boneTracker.initTargetElement(e),window.boneTracker.setOffset(.05,.36,-.05),window.boneTracker.setRotationOffset(-30,0,110),window.boneTracker.setScale(3),window.boneTracker.toggleTracking(()=>{Dr(t,`golfDrive`,{speed:.7,autoReturn:!1,onComplete:()=>{window.boneTracker&&window.boneTracker.isActive&&window.boneTracker.toggleTracking(),Dr(t,`standClap`,{speed:1,crossFadeDuration:.8,onComplete:async()=>{await new Promise(e=>setTimeout(e,500)),await wa(t,null),n&&(e.style.outline=``,e.style.outlineOffset=``),t.isHeroAnimating=!1,t.allowsResetting=!0,i&&i()}})}}),setTimeout(()=>{r&&r()},660)})}}async function fa(e,t=!0){let n=e.scenarioState?.name===`room`;if(t){let t=Q.currentMode===F.DEV?F.POBA:F.DEV;if(n){if(e.isHeroAnimating){H(e,Un!==void 0&&Zn?Zn:null,`CHANGING PROTOCOL...`),e._informerTimeout&&clearTimeout(e._informerTimeout),e._informerTimeout=setTimeout(()=>U(e),1500);return}Q.setPersona(t),da(e,{onImpact:()=>{let n=t===F.POBA?`SYS_DRONE_SUBTITLES_POBA`:`SYS_DRONE_SUBTITLES_DEV`,r=typeof R==`function`?R(n):``;r&&(ys(r),Ko(e,null,r))}});return}let r=e.pointsApp,i=e.scenarioState&&e.scenarioState.name===`points`,a=r&&typeof r.getCurrentStep==`function`&&r.getCurrentStep()===0;i&&a?Q.setPersona(t,{skipPointsSync:!0}):Q.setPersona(t)}}function pa(t){if(t.isHeroAnimating||t.allowsResetting===!1||t.scenarioState&&t.scenarioState.name!==`room`)return;let n=t.getObjectByName(`stool_bound`),r=t.getObjectByName(`a-char`);if(!n||!r)return;t.isHeroAnimating=!0,t.allowsResetting=!1;let i=new e.Vector3,a=new e.Quaternion;n.getWorldPosition(i),n.getWorldQuaternion(a);let o=r.position.x,s=r.position.y,c=r.position.z,l=[{name:`gangnam`,moveOffset:new e.Vector3(5,0,0),returnSpeed:1,returnDuration:440,isRobot:!1},{name:`breakDance`,moveOffset:new e.Vector3(3,0,-2),returnSpeed:1.2,returnDuration:440,isRobot:!1},{name:`robotDance`,moveOffset:new e.Vector3(1,0,0),returnSpeed:1,returnDuration:200,isRobot:!0}].filter(e=>t.heroClips?.some(t=>t.name.toLowerCase()===e.name.toLowerCase()));if(l.length===0)return;let u=Math.random(),d;d=u<.5?l.find(e=>e.name===`breakDance`):u<.75?l.find(e=>e.name===`gangnam`):l.find(e=>e.name===`robotDance`),d||=l[Math.floor(Math.random()*l.length)];let f=t.heroClips.find(e=>e.name.toLowerCase()===d.name.toLowerCase()),p=d.moveOffset,m=d.returnDuration,h=d.returnSpeed,g=d.isRobot,_=new e.Vector3;r.getWorldPosition(_);let y=_.clone().add(p).clone();r.parent&&r.parent.worldToLocal(y);let x=n.rapierBody;if(x){x.setBodyType(b.RigidBodyType.Dynamic),x.wakeUp();let t=new e.Vector3(75+Math.random()*10,50+Math.random()*5,(Math.random()-.5)*5),n=new e.Vector3(Math.random()*2,Math.random()*5,Math.random()*2);x.applyImpulse({x:t.x,y:t.y,z:t.z},!0),x.applyTorqueImpulse(n,!0)}new v.Tween(r.position).to({x:y.x,y:y.y,z:y.z},800).easing(v.Easing.Quadratic.Out).start(),f&&Dr(t,f.name,{idleClipName:g?`typing`:`walking`,onComplete:()=>S()});function S(){if(g)new v.Tween(r.position).to({x:o,y:s,z:c},m).easing(v.Easing.Quadratic.Out).onComplete(()=>{t.isHeroAnimating=!1,t.allowsResetting=!0}).start(),C();else{Dr(t,`walking`,{idleClipName:`typing`,speed:h});let n=r.position.clone(),i=new e.Vector3(o,s,c),a={t:0};new v.Tween(a).to({t:1},1200).easing(v.Easing.Linear.None).onUpdate(()=>{let e=a.t;e=e<.2?(e/.2)**3*.05:.05+(e-.2)/.8*.95,r.position.lerpVectors(n,i,e)}).onComplete(()=>{Dr(t,`typing`,{crossFadeDuration:.2}),C(500),t.isHeroAnimating=!1,t.allowsResetting=!0}).start()}}function C(r=1e3){if(!x)return;x.setBodyType(b.RigidBodyType.KinematicPositionBased),x.setLinvel({x:0,y:0,z:0},!0),x.setAngvel({x:0,y:0,z:0},!0),x.wakeUp();let o=x.translation(),s=x.rotation(),c={t:0};new v.Tween(c).to({t:1},r).easing(v.Easing.Cubic.Out).onUpdate(()=>{let t=new e.Vector3().lerpVectors(o,i,c.t),r=new e.Quaternion().copy(s).slerp(a,c.t);x.setTranslation(t,!0),x.setRotation(r,!0);let l=t.clone();n.parent&&n.parent.worldToLocal(l),n.position.copy(l);let u=r.clone();if(n.parent){let t=new e.Quaternion;n.parent.getWorldQuaternion(t),n.quaternion.copy(t.invert().multiply(u))}else n.quaternion.copy(u)}).onComplete(()=>{g&&t.heroClips&&Dr(t,`typing`,{crossFadeDuration:.5})}).onStart(()=>{t.stoolGridUniforms&&(t.stoolGridUniforms.uWorldGridActive.value=1,t.stoolGridUniforms.uWorldGridProgress.value=0,new v.Tween(t.stoolGridUniforms.uWorldGridProgress).to({value:1},600).easing(v.Easing.Quadratic.Out).onComplete(()=>{setTimeout(()=>{new v.Tween(t.stoolGridUniforms.uWorldGridProgress).to({value:0},500).onComplete(()=>{t.stoolGridUniforms.uWorldGridActive.value=0}).start()},200)}).start())}).start()}}function ma(e,t){ja&&=(clearTimeout(ja),null),t?ja=setTimeout(()=>{ha(e,!0)},Ma):ha(e,!1)}function ha(t,n){let r=t.pointsApp;if(!r||!r.material)return;n?(H(t,Yn,`The closer you look...`),t.conversationManager?.shout(`...the less you see.`)):U(t);let i=(r.getCurrentStep?r.getCurrentStep():0)===2?.3:1,a=t.camera,o=t.orbitControls;o&&n&&(o.isStrategicHover=!0);let s=r.material.uniforms;Ea&&Ea.stop();let c=n?.8+2.7*i:.8,l=n?800:500;if(Ea=new v.Tween(s.uModelVibFactor).to({value:c},l).easing(v.Easing.Cubic.Out).start(),!a||!o)return;Oa||=a.position.clone(),ka||=a.rotation.clone(),Aa===null&&(Aa=a.fov),Ta&&Ta.stop(),Da&&Da.stop();let u=new e.Vector3(1.8,.6,-1.8).multiplyScalar(i),d=n?Oa.clone().add(u):Oa.clone(),f=(Aa-38)*i,p=n?Aa-f:Aa;Ta=new v.Tween(a.position).to({x:d.x,y:d.y,z:d.z},l).easing(v.Easing.Cubic.Out).onUpdate(()=>{if(n){let t=.05*i,n=.04*i;a.rotation.x=e.MathUtils.lerp(a.rotation.x,ka.x-t,.05),a.rotation.y=e.MathUtils.lerp(a.rotation.y,ka.y+n,.05)}}).onComplete(()=>{n||(Oa=null,ka=null,Aa=null,o&&(o.isStrategicHover=!1))}).start(),Da=new v.Tween(a).to({fov:p},l).easing(v.Easing.Cubic.Out).onUpdate(()=>{a.updateProjectionMatrix()}).start()}function ga(e){let t=e.pointsApp;if(!t||!t.getCurrentStep)return;let n=t.getCurrentStep(),r=t.material.uniforms;switch(n){case 0:new v.Tween(r.uModelScale).to({value:0},150).easing(v.Easing.Exponential.In).onComplete(()=>{new v.Tween(r.uModelScale).to({value:1.2},300).easing(v.Easing.Back.Out).onComplete(()=>{new v.Tween(r.uModelScale).to({value:1},400).easing(v.Easing.Quadratic.Out).start()}).start()}).start();break;case 1:e.stoolGridUniforms&&(e.stoolGridUniforms.uWorldGridActive.value=1,e.stoolGridUniforms.uWorldGridProgress.value=0,new v.Tween(e.stoolGridUniforms.uWorldGridProgress).to({value:1},800).easing(v.Easing.Cubic.Out).onComplete(()=>{e.stoolGridUniforms.uWorldGridActive.value=0}).start());break;case 2:t.playNextDance&&t.playNextDance();break}}function _a(e,t,n){let r=document.getElementById(`cv-container`);if(!r)return;r.userData||={};let i=r.userData,a;a=n===void 0?!r.classList.contains(`collapsed`):n,a?r.classList.add(`collapsed`):r.classList.remove(`collapsed`),document.body.classList.toggle(`cv-collapsed`,a),i.tween&&i.tween.stop();let o=!a,s=r.offsetWidth||600,c=a?s:0,l=a?-s:0;i.x===void 0&&(i.x=a?0:s),i.margin===void 0&&(i.margin=a?0:-s),i.tween=new v.Tween(i).to({x:c,margin:l},800).easing(v.Easing.Back.Out).onUpdate(()=>{r.style.transform=`translateX(${i.x}px)`,r.style.marginRight=`${i.margin}px`}).onComplete(()=>{a&&(r.style.opacity=`0`)}).onStart(()=>{o&&(r.style.opacity=`1`)}).start(),window.dispatchEvent(new CustomEvent(`cvToggle`,{detail:{collapsed:a}})),e.HUD&&typeof e.HUD.breathe==`function`&&e.HUD.breathe(I.ELECTRIC_CYAN),t&&H(e,null,a?`EXPAND CV PANEL`:`COLLAPSE CV PANEL`,!0)}function va(e,t){if(t){let t=document.getElementById(`cv-container`);H(e,null,!t||t.classList.contains(`collapsed`)?`EXPAND CV PANEL`:`COLLAPSE CV PANEL`,!0),e.HUD&&typeof e.HUD.breathe==`function`&&e.HUD.breathe(I.ELECTRIC_CYAN)}else U(e)}function ya(e,t,n){if(n){let n=t.getAttribute(`data-label`),r=t.getAttribute(`data-platform`);H(e,null,`COPY ${n.toUpperCase()} & OPEN ${r.toUpperCase()}`,!0,!0)}else U(e)}async function ba(e,t){t.getAttribute(`data-label`);let n=t.getAttribute(`data-url`),r=t.getAttribute(`data-id`)===`gmail`,i=n;try{await navigator.clipboard.writeText(i),H(e,null,`COPIED TO CLIPBOARD!`,!0,!0);let a=r?`mailto:${n}`:n;window.open(a,`_blank`),setTimeout(()=>{t.matches(`:hover`)&&ya(e,t,!0)},1500)}catch(e){console.error(`Clipboard copy failed:`,e)}window.uiAnims&&window.uiAnims.triggerSpring&&window.uiAnims.triggerSpring(t)}function xa(e){let t=document.getElementById(e),n=document.getElementById(`cv-scroller`);if(t&&n){let e=t.nextElementSibling;e&&e.classList.contains(`collapsed`)&&t.click();let r=t.offsetTop;n.scrollTo({top:r-85,behavior:`smooth`})}}async function Sa(e){let t=document.getElementById(`work-experience-modal`);t&&(t.style.display=`none`,e&&(e.raycasterEnabled=!0),ra()),_a(e,null,!1),await new Promise(e=>setTimeout(e,400));let n=document.getElementById(`board`),r=document.querySelector(`.three-js-backdrop`);n&&(n.style.opacity=`1`),r&&(r.style.opacity=`1`),e.HUD&&typeof e.HUD.runTweenOpen==`function`&&e.HUD.runTweenOpen()}var Ca,wa,Ta,Ea,Da,Oa,ka,Aa,ja,Ma,Na=M((()=>{Ns(),Or(),Nr(),Te(),rr(),Mn(),ls(),Ae(),ks(),sa(),Ca=[{selector:`#persona-switch-btn`,event:`click`,action:(e,t)=>{e.stopPropagation(),Q.togglePersonaPanel()}},{selector:`.header-photo`,event:`click`,action:(e,t)=>fa(t,!0)},{selector:`.name`,event:`mouseenter`,action:(e,t)=>ma(t,!0)},{selector:`.name`,event:`mouseleave`,action:(e,t)=>ma(t,!1)},{selector:`.name`,event:`click`,action:(e,t)=>{t.scenarioState?.name===`room`?fa(t,!1):ga(t)}},{selector:`.choice-box`,event:`click`,action:(e,t,n)=>{let r=n.getAttribute(`data-mode`);r&&Q.setPersona(r)}},{selector:`#cv-mode-selector .mode-option`,event:`click`,action:(e,t,n)=>{let r=n.getAttribute(`data-mode`);r&&Q.setPersona(r)}},{selector:`.nav-item`,event:`click`,action:(e,t,n)=>{let r=n.getAttribute(`data-target`);if(document.querySelectorAll(`.nav-modules .nav-item`).forEach(e=>e.classList.remove(`active`)),n.classList.add(`active`),r===`cv-header`&&t.scenarioState?.name===`room`){t.isTransitioning||$o(t);return}let i=document.getElementById(r),a=document.getElementById(`cv-scroller`);i&&a&&a.scrollTo({bottom:0,top:i.offsetTop-80,behavior:`smooth`})}},{selector:`#hud-nav-btn-3`,event:`click`,action:(e,t)=>{let n=document.querySelector(`.nav-modules .nav-item[data-target="cv-header"]`);n&&(document.querySelectorAll(`.nav-modules .nav-item`).forEach(e=>e.classList.remove(`active`)),n.classList.add(`active`)),t.scenarioState?.name===`room`&&!t.isTransitioning&&(U(t),$o(t))}},{selector:`#hud-nav-btn-2`,event:`click`,action:(e,t)=>{if(t.scenarioState?.name===`points`&&!t.isTransitioning&&(U(t),t.pointsApp&&typeof t.pointsApp.triggerStep==`function`)){t.pointsApp.triggerStep(3);let e=document.querySelector(`.nav-modules .nav-item[data-target="LAB"]`)||document.querySelector(`.nav-modules .nav-item[data-target="cv-header"]`);e&&(document.querySelectorAll(`.nav-modules .nav-item`).forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`))}}},{selector:`#hud-nav-btn-1`,event:`click`,action:async(e,t)=>{if(t.isTransitioning)return;U(t),t.HUD&&typeof t.HUD.runTweenClose==`function`&&t.HUD.runTweenClose(1e3),xa(`cv-work-header`);let n=document.getElementById(`board`),r=document.querySelector(`.three-js-backdrop`);n&&(n.style.transition=`opacity 0.4s`),n&&(n.style.opacity=`0`),r&&(r.style.transition=`opacity 0.4s`),r&&(r.style.opacity=`0`),await new Promise(e=>setTimeout(e,1100));let i=document.getElementById(`cv-container`);i&&i.classList.remove(`slow-transition`),_a(t,null,!0),await new Promise(e=>setTimeout(e,400));let a=document.getElementById(`work-experience-modal`);a&&(a.style.display=`flex`,t&&(t.raycasterEnabled=!1),na())}},{selector:`#work-modal-close-btn`,event:`click`,action:(e,t)=>Sa(t)},{selector:`#cv-export-btn, #modal-cv-export-btn`,event:`click`,action:(e,t)=>{let n=document.createElement(`a`);n.href=`/PFL/cvs/Bui_Quoc_Hieu_CV_Portable.pdf`,n.download=`Bui_Quoc_Hieu_CV_Portable.pdf`,document.body.appendChild(n),n.click(),document.body.removeChild(n),t.scenarioState?.name===`room`&&pa(t)}},{selector:`#work-experience-modal`,event:`click`,action:(e,t)=>{(e.target.id===`work-experience-modal`||e.target.classList.contains(`modal-backdrop`))&&Sa(t)}},{selector:`#cv-toggle-btn`,event:`click`,action:(e,t,n)=>_a(t,n)},{selector:`#cv-toggle-btn`,event:`mouseenter`,action:(e,t)=>va(t,!0)},{selector:`#cv-toggle-btn`,event:`mouseleave`,action:(e,t)=>va(t,!1)},{selector:`.contact-btn-tiny`,event:`mouseenter`,action:(e,t,n)=>ya(t,n,!0)},{selector:`.contact-btn-tiny`,event:`mouseleave`,action:(e,t,n)=>ya(t,n,!1)},{selector:`.contact-btn-tiny`,event:`click`,action:(e,t,n)=>ba(t,n)}],wa=(e,t=null)=>{let n=e.getObjectByName(`a-char`),r=e.getObjectByName(`stool`),i=e.getObjectByName(`stool_bound`);if(!n||!i)return Promise.resolve();if(n.userData.origPos===void 0&&(n.userData.origPos=n.position.clone()),r&&r.userData.origPos===void 0&&(r.userData.origPos=r.position.clone()),i.rapierBody&&i.userData.origTranslation===void 0){let e=i.rapierBody.translation();i.userData.origTranslation={x:e.x,y:e.y,z:e.z},n.userData.stoolOffset={x:e.x-n.userData.origPos.x,y:e.y-n.userData.origPos.y,z:e.z-n.userData.origPos.z}}let a=1500,o=v.Easing.Cubic.InOut,s=t||n.userData.origPos,c={x:s.x+(n.userData.stoolOffset?.x||0),y:s.y+(n.userData.stoolOffset?.y||0),z:s.z+(n.userData.stoolOffset?.z||0)};return new Promise(e=>{if(new v.Tween(n.position).to({x:s.x,y:s.y,z:s.z},a).easing(o).onComplete(e).start(),r&&new v.Tween(r.position).to({x:c.x,y:c.y,z:c.z},a).easing(o).start(),i.rapierBody){let e=i.rapierBody.translation(),t={x:e.x,y:e.y,z:e.z};new v.Tween(t).to(c,a).easing(o).onUpdate(()=>{i.rapierBody.setNextKinematicTranslation(t)}).start()}})},typeof window<`u`&&(window.triggerRitual=e=>{da(window.scene,{onImpact:()=>{let t=e||(Q.currentMode===F.DEV?F.POBA:F.DEV);Q.setPersona(t)}})}),Ta=null,Ea=null,Da=null,Oa=null,ka=null,Aa=null,ja=null,Ma=400}));function Pa(e,t,n){let r=n.get(`catBlack`),i=n.get(`catWhite`),a=t===F.POBA?L.UI_INFORMER_CAT_MAX_POBA.en:L.UI_INFORMER_CAT_MAX_DEV.en,o=t===F.POBA?L.UI_INFORMER_CAT_MIN_POBA.en:L.UI_INFORMER_CAT_MIN_DEV.en;r&&(r.userData.assignedRole=a[Math.floor(Math.random()*a.length)]),i&&(i.userData.assignedRole=o[Math.floor(Math.random()*o.length)])}function Fa(t){let n=new Map;t.shootDroneBeam=Ko,t.traverse(e=>{e.name&&n.set(e.name,e),/^book\d+$/.test(e.name)&&Qa.push(e)}),t.objectMap=n;let r=eo(t,n,{gravityCenter:new e.Vector3(-.5,3.5,4.9),tgtPos:new e.Vector3(-2,3.09,6.42),tgtQuat:new e.Quaternion(-.09,.48,-.05,.87)});Pa(t,Q.currentMode,n),window.addEventListener(`personaToggle`,e=>{Pa(t,e.detail.mode,n)});let i=n.get(`a-char`);if(i){let t=1/i.scale.y,r=3.675*t,a=1.6*t,o=new e.Mesh(new e.BoxGeometry(a,r,a),new e.MeshBasicMaterial({color:16711935,transparent:!0,opacity:0,visible:!1}));o.name=`hero_hitbox`,o.position.set(0,r/2,0),i.add(o),n.set(o.name,o)}let a=[...Object.keys(r),`aegis`,`aegis2`,`caseCover`,`mjolnir_low_mjolnir_hammer_0`,`Object_34001`,`screenDisplay001`,`screenDisplay002`,`verticalMonitorDisplay`,`Model_0001`,`pictureLionFrame`],o=0;a.forEach(e=>{let i=n.get(e),a=r[e]||{};if(!i)return;o++;let s=a.onMouseEnter?e=>{a.onMouseEnter(e)}:e=>$a(t,e),c=e=>{t.gazeFollower&&t.gazeFollower.lookAtTarget(e),s(e)},l=a.onMouseLeave?e=>a.onMouseLeave(e):e=>J(t,e);wn(t,i,{onMouseEnter:c,onMouseLeave:e=>{t.gazeFollower&&t.gazeFollower.lookAtTarget(t.camera),l(e)},onMouseDown:a.onMouseDown?(e,t)=>a.onMouseDown(e,t):(e,n)=>Y(t,e,n),onMouseHover:a.onMouseHover?(e,t)=>a.onMouseHover(e,t):null})}),Qa.forEach(e=>{wn(t,e,{onMouseEnter:()=>{$a(t,e),t.gazeFollower&&t.gazeFollower.lookAtTarget(e),t.raycasterWrapper?.mouseInContainer&&H(t,Yn,R(`UI_INFORMER_BOOK`))},onMouseLeave:()=>{J(t),to(t),t.gazeFollower&&t.gazeFollower.lookAtTarget(t.camera)},onMouseDown:(e,n)=>Y(t,e,n)})}),Za.forEach(e=>{let r=n.get(e);r&&wn(t,r,{onMouseEnter:()=>{},onMouseLeave:()=>{}})}),t.testBH=(e=`y`)=>{let n=t.getObjectByName(`Lathe_Center`);if(!n||![`x`,`y`,`z`].includes(e))return;let r={};r[e]=n.rotation[e]-Math.PI*6,new v.Tween(n.rotation).to(r,1500).easing(v.Easing.Back.Out).start()}}function Ia(e,t,n,r,i,a,o=null){if(e.isSucking||!t||!t.rapierBody)return;let s=Array.isArray(n)?[...n]:[n];e.world.hasPointGravityOnPokeball=!1,La(e,t,r),Ra(e,t,s,i,a)}function La(e,t,n){let r=t.rapierBody;if(!r)return;e.world.pokeballBody=r,e.world.gravityCenterForPokeball=n;let i=t.position.clone();i.normalize();let a=r.mass()*15,o=i.multiplyScalar(a*-1);o.y=Math.max(8*Math.abs(i.y),8),o.x/=Va(1,2),o.y*=Va(1,1.5),o.z/=Va(1,2),t.rapierBody.applyImpulse({x:o.x,y:o.y,z:o.z},!0)}function Ra(t,n,r,i,a){t.isSucking=!0;let o=Vt(`#FBC189`,1.5,1),s=r.length;r.forEach(r=>{if(r.ignoreRaycast=!0,r.traverse(e=>{e.ignoreRaycast=!0,e.userData&&(e.userData.isRaycastTarget=!1)}),t.raycastObjects&&=t.raycastObjects.filter(e=>{let t=e===r;return t||r.traverse(n=>{n===e&&(t=!0)}),t||e.traverse(e=>{e===r&&(t=!0)}),!t}),t.raycasterWrapper?.currentObjectTarget){let e=t.raycasterWrapper.currentObjectTarget,n=e===r;n||r.traverse(t=>{t===e&&(n=!0)}),n&&U(t)}let c=new e.Vector3,l=new e.Quaternion,u={value:0},d=new v.Tween(o.uniforms.uprogress).to({value:2},1500).easing(v.Easing.Bounce.Out).onComplete(()=>{if(t.world.hasPointGravityOnPokeball=!1,n.rapierBody){n.rapierBody.setBodyType(0);let t=new e.Vector3(0,-4,0);n.rapierBody.applyImpulse({x:t.x,y:t.y,z:t.z},!0)}r.traverse(e=>{if(e.rapierBody){let n=e.rapierBody;e.isRapierBound=!1,n.isObjectBound=!1;try{t.world.removeRigidBody(n)}catch(t){console.warn(`[Catch] RigidBody removal failed for `+e.name,t)}t.physicBodies&&=t.physicBodies.filter(e=>e!==n),t.skinnedMeshBodies&&=t.skinnedMeshBodies.filter(e=>e!==n),t.objectControlledBodies&&=t.objectControlledBodies.filter(e=>e!==n),t.physicsControlledObjects&&=t.physicsControlledObjects.filter(t=>t!==e),t.physicObjects&&=t.physicObjects.filter(t=>t!==e),e.rapierBody=null}}),t.physicsControlledObjects&&=t.physicsControlledObjects.filter(e=>e!==r),t.physicObjects&&=t.physicObjects.filter(e=>e!==r),t.remove(r),(r.name===`catBlack`||r.name===`blackCat`)&&(t.isMaxMissing=!0),(r.name===`catWhite`||r.name===`Object_108`)&&(t.isMinMissing=!0),r.visible=!1,s--,s<=0&&(t.isSucking=!1)}),f=new v.Tween(u).to({value:1},1e3).easing(v.Easing.Back.InOut).onStart(()=>{n.rapierBody&&n.rapierBody.setBodyType(1),c.copy(n.position),l.copy(n.rotation),typeof t.shootDroneBeam==`function`&&t.shootDroneBeam(t,``,``,c.clone(),`drone-beam`,!1,null,!0,1/0,!0)}).onUpdate(()=>{let r=new e.Vector3().lerpVectors(c,i,u.value);n.rapierBody&&n.rapierBody.setTranslation({x:r.x,y:r.y,z:r.z},!1);let o=t.getObjectByName(`drone-beam`),s=t.getObjectByName(`drone`);if(o&&o.visible&&s){let i=s.getObjectByName(`Sphere001_0`);if(i){let a=new e.Vector3;i.getWorldPosition(a);let s=a.distanceTo(r);o.position.copy(a),o.lookAt(r),o.children.forEach(e=>{e.scale.z=s}),t.gazeFollower&&t.gazeFollower.lookAtTarget(n)}}let d=l.clone().slerp(a,u.value);n.rapierBody&&n.rapierBody.setRotation({x:d.x,y:d.y,z:d.z,w:d.w},!1)}).onComplete(()=>{let e=t.getObjectByName(`drone-beam`);e&&(e.visible=!1,e.activeRequestID&&cancelAnimationFrame(e.activeRequestID)),o.uniforms.catchPoint.value.copy(i),r.traverse(e=>{e.isMesh&&(e.material=o,e.userData.originalMaterial=o)})}).chain(d);setTimeout(()=>{t.world.hasPointGravityOnPokeball=!0},1e3),setTimeout(()=>{f.start()},3e3)})}function za(e,t={}){let{forcedX:n=null,environmentRatio:r=null,duration:i=1e3,delay:a=0}=t,o=e.getObjectByName(`glassInvi`);if(!o)return;let s=5.4,c=.75,l=o.rapierBody,u=l.translation(),d=u.x,f;f=n===null?o.slideDirection?o.slideDirection*-1:1:n<.5?1:-1;let p=(e,t,n)=>e+(t-e)*n,m;m=n===null?f===1?0:1:n;let h=n===null?f===1?s:c:p(s,c,m),g=r===null?m:r,_=e?e.environmentIntensity??1:1,y=p(1,0,g),b=(e,t,n,r,i=null)=>({name:e,properties:[{prop:t,closedVal:n,openVal:r,axis:i}]}),x=[{name:`floor`,properties:[{prop:`envMapRotation`,axis:`x`,closedVal:1.91,openVal:2.07},{prop:`envMapIntensity`,closedVal:.15,openVal:1}]},b(`Object_0003_3`,`envMapIntensity`,.3,1),b(`Object_0003`,`envMapIntensity`,.2,.75),b(`Object_32`,`envMapIntensity`,.5,2.5),{name:`mjolnir_low_mjolnir_hammer_0`,properties:[{prop:`envMapIntensity`,closedVal:1,openVal:5},{prop:`metalness`,closedVal:.6,openVal:1},{prop:`roughness`,closedVal:.2,openVal:1}]},b(`aegis`,`envMapIntensity`,1,5),b(`Object_34001`,`envMapIntensity`,5,10),b(`Object_0003`,`envMapIntensity`,.5,3),b(`shelf`,`envMapIntensity`,.5,1.65),b(`Object_15`,`envMapIntensity`,3,20),b(`Object_15001`,`envMapIntensity`,.5,2),b(`Object_31`,`envMapIntensity`,1,5),b(`Object_0007`,`envMapIntensity`,.1,.8),b(`Object_108`,`envMapIntensity`,.6,1.2)];for(let e=1;e<=38;e++){let t=`book`+String(e).padStart(3,`0`);x.push(b(t,`envMapIntensity`,.5,20))}let S=new Map;x.forEach(t=>{let n=e.getObjectByName(t.name);n&&n.material&&t.properties.forEach(e=>{let r=`${t.name}-${e.prop}`,i=0;e.prop===`envMapRotation`?n.material.envMapRotation&&e.axis===`x`&&(i=n.material.envMapRotation.x):i=n.material[e.prop],S.set(r,i)})});let C={value:0};new v.Tween(C).to({value:1},i).easing(v.Easing.Back.InOut).delay(a).onUpdate(()=>{l.setNextKinematicTranslation({x:d+(h-d)*C.value,y:u.y,z:u.z}),e&&(e.environmentIntensity=p(_,y,C.value),x.forEach(t=>{let n=e.getObjectByName(t.name);if(!n||!n.material)return;let r=n.material;t.properties.forEach(e=>{let n=`${t.name}-${e.prop}`,i=p(S.get(n)??0,p(e.closedVal===void 0?0:e.closedVal,e.openVal===void 0?0:e.openVal,g),C.value);e.prop===`envMapRotation`?r.envMapRotation&&e.axis===`x`&&(r.envMapRotation.x=i):r[e.prop]=i})}))}).onComplete(()=>{o.slideDirection=f;let t=e.globalUniformsHub;if(t&&t.uniforms&&t.uniforms.uWaterIntensity){let e=f===-1?2:.1;new v.Tween(t.uniforms.uWaterIntensity).to({value:e},3e3).easing(v.Easing.Cubic.InOut).start()}}).start()}function Ba(e,t=!0){e.world.hasPointGravityOnBH=t,t&&(e.world.hasPointGravityOnBalls=!1),e.physicBodies.forEach(e=>{e.wakeUp()}),e.allowsResetting=!t}function Va(e,t){return Math.random()*(t-e)+e}function Ha(t,n){if(no)return;no=!0;let r=t.bulb;if(!r||!r.geometry||!r.geometry.isMorphGeo){Wa(t,null,1e3),ki(t,n),no=!1;return}let i=r.geometry,a=r.material,o=r.getObjectByName(`bulbAura`),s=o?o.material:null,c=a.uniforms.uTransformProgress,l=s?s.uniforms.uTransformProgress:null,u={value:0};a.uniforms.uTransformProgress=u,s&&(s.uniforms.uTransformProgress=u),i.setMorphInfo(0,2);let d=new e.Color(`#ffe0b2`),f=new e.Color(`#9cc1f2`),p=`#`+f.getHexString();if(t.bulbLight){let e=t.bulbLight.color;p=Math.abs(e.r-d.r)+Math.abs(e.g-d.g)+Math.abs(e.b-d.b)<.5?`#`+f.getHexString():`#`+d.getHexString()}a.visible=!0,o&&(o.visible=!0),Wa(t,`#ffe0b2`,400),new v.Tween(u).to({value:1},600).easing(v.Easing.Cubic.Out).onComplete(()=>{ki(t,n),setTimeout(()=>{new v.Tween(u).to({value:0},800).easing(v.Easing.Cubic.In).onComplete(()=>{if(a.visible=!0,o&&(o.visible=!0),i.setMorphInfo(0,1),a.uniforms.uTransformProgress=c,s&&l&&(s.uniforms.uTransformProgress=l),t.bulbLight){let e=t.bulbLight.color;a.uniforms.glowColor.value.setRGB(e.r,e.g,e.b)}Wa(t,p,600),no=!1}).start()},300)}).start()}function Ua(t,n,r,i=1e3,a={}){let{easing:o=v.Easing.Cubic.Out,onComplete:s=null,delay:c=0}=a,l=t.bulbLight;if(!l)return;l._activeParamTween&&=(l._activeParamTween.stop(),null);let u=l.intensity,d=l.angle,f={t:0};return l._activeParamTween=new v.Tween(f).to({t:1},i).delay(c).easing(o).onUpdate(()=>{l.intensity=e.MathUtils.lerp(u,n,f.t),l.angle=e.MathUtils.lerp(d,r,f.t)}).onComplete(()=>{l._activeParamTween=null,s&&s()}).start(),l._activeParamTween}function Wa(t,n=null,r=3e3){let i=new e.Color(`#ffe0b2`),a=new e.Color(`#9cc1f2`),o;if(n)o=new e.Color(n);else if(t.bulbLight){let e=t.bulbLight.color;o=Math.abs(e.r-i.r)+Math.abs(e.g-i.g)+Math.abs(e.b-i.b)<.5?a:i}else o=a;if(t.bulbLight&&new v.Tween(t.bulbLight.color).to({r:o.r,g:o.g,b:o.b},r).easing(v.Easing.Cubic.Out).start(),t.bulb&&t.bulb.material&&t.bulb.material.uniforms.glowColor){new v.Tween(t.bulb.material.uniforms.glowColor.value).to({r:o.r,g:o.g,b:o.b},r).easing(v.Easing.Cubic.Out).start();let e=t.bulb.getObjectByName(`bulbAura`);e&&e.material&&e.material.uniforms.glowColor&&new v.Tween(e.material.uniforms.glowColor.value).to({r:o.r,g:o.g,b:o.b},r).easing(v.Easing.Cubic.Out).start()}K&&K.uniforms&&(K.uniforms.glowColor&&new v.Tween(K.uniforms.glowColor.value).to({r:o.r,g:o.g,b:o.b},r).easing(v.Easing.Cubic.Out).start(),K.uniforms.glowIntensity&&new v.Tween(K.uniforms.glowIntensity).to({value:1},r).easing(v.Easing.Cubic.Out).start()),ai&&ai.uniforms&&(ai.uniforms.glowColor&&new v.Tween(ai.uniforms.glowColor.value).to({r:o.r,g:o.g,b:o.b},r).easing(v.Easing.Cubic.Out).start(),ai.uniforms.outerGlowStrength&&new v.Tween(ai.uniforms.outerGlowStrength).to({value:1.5},r).easing(v.Easing.Cubic.Out).start())}function Ga(t,n){if(ro||!n)return;ro=!0;let r=t.bulbLight;r&&t._bulbBaseline===void 0&&(t._bulbBaseline={intensity:r.intensity,angle:r.angle});let i=r?r.color.clone():I.ELECTRIC_CYAN||62463,a=t.getObjectByName(`cFanBulb`)||n,o=new e.Vector3;a.getWorldPosition(o);let s=new e.IcosahedronGeometry(.3,1),c=ds(i);c.uniforms.uOpacity.value=.5,c.uniforms.uBrightness.value=3.5;let l=new e.Mesh(s,c);l.position.copy(o),t.add(l),new v.Tween(l.scale).to({x:3.5,y:3.5,z:3.5},800).easing(v.Easing.Quintic.Out).start();let u=performance.now(),d=e=>{l.parent&&(c.uniforms.iTime.value=(e-u)/1e3,l.rotation.y+=.05,l.rotation.z+=.03,requestAnimationFrame(d))};requestAnimationFrame(d),t.fanAction&&new v.Tween(t.fanAction).to({timeScale:65},800).easing(v.Easing.Exponential.In).start(),Z(`SYNCHRONIZING KINETIC VECTORS...`),r&&t._bulbBaseline&&Ua(t,1e4,.3,800,{easing:v.Easing.Exponential.In,onComplete:()=>{Ua(t,t._bulbBaseline.intensity,t._bulbBaseline.angle,400,{delay:800,easing:v.Easing.Cubic.Out})}}),setTimeout(()=>{ro=!1},2200),setTimeout(()=>{t.remove(l),s.dispose(),c.dispose();let n=Math.abs(o.y- -.55),r=new e.CylinderGeometry(1.5,1.5,n,32,1,!0);r.translate(0,-n/2,0);let a=ds(i);a.uniforms.uOpacity.value=.9,a.uniforms.uBrightness.value=5;let u=new e.Mesh(r,a);u.position.copy(o),t.add(u),u.scale.set(.1,1,.1),new v.Tween(u.scale).to({x:2.2,z:2.2},150).easing(v.Easing.Exponential.Out).onComplete(()=>{new v.Tween(a.uniforms.uOpacity).to({value:0},500).delay(300).start(),setTimeout(()=>{t.remove(u),r.dispose(),a.dispose()},800)}).start();let d=performance.now(),f=e=>{u.parent&&(a.uniforms.iTime.value=(e-d)/1e3,u.rotation.y+=.02,requestAnimationFrame(f))};requestAnimationFrame(f);let p=[];t.bhTargets&&p.push(...t.bhTargets),t.dragonBalls&&p.push(...t.dragonBalls),[...new Set(p)].forEach(t=>{if(!t||!t.rapierBody)return;let n=t.rapierBody,r=new e.Vector3;t.getWorldPosition(r);let i=new e.Vector3(o.x,r.y,o.z),a=new e.Vector3().subVectors(r,i),s=a.length();a.normalize(),a.y=1.35,a.normalize();let c=n.mass(),l=500*c/(Math.max(1,s)+.15);n.applyImpulse({x:a.x*l,y:a.y*l*1.6,z:a.z*l},!0);let u=150*c;n.applyTorqueImpulse({x:(Math.random()-.5)*u,y:(Math.random()-.5)*u,z:(Math.random()-.5)*u},!0)}),Z(`KINETIC DISCHARGE: STABLE`),typeof Ei==`function`&&Ei(t,!0),setTimeout(()=>{typeof Ei==`function`&&Ei(t,!1),t.fanAction&&new v.Tween(t.fanAction).to({timeScale:1},4e3).easing(v.Easing.Cubic.Out).start()},150)},800)}function Ka(e){let t=e.getObjectByName(`Lathe_Center`);return t?t.makeEye?t:(t.userData.initValues={rotation:t.rotation.clone(),scale:t.scale.clone(),nebulaCoreRadius:10,nebulaSwirlSpeed:.25},t.material&&t.material.uniforms&&t.material.uniforms.nebulaCoreRadius&&(t.userData.initValues.nebulaCoreRadius=t.material.uniforms.nebulaCoreRadius.value),e.globalUniformsHub&&e.globalUniformsHub.uNebulaSwirlSpeed&&(t.userData.initValues.nebulaSwirlSpeed=e.globalUniformsHub.uNebulaSwirlSpeed.value),t.makeEye=function(t){this.userData.eyeTweens&&this.userData.eyeTweens.forEach(e=>e.stop()),this.userData.eyeTweens=[];let n=new v.Tween(this.rotation).to({y:-.3},t).easing(v.Easing.Cubic.Out).start(),r=new v.Tween(this.scale).to({x:.675,y:1.5,z:.875},t).easing(v.Easing.Cubic.Out).start();if(this.userData.eyeTweens.push(n,r),this.material&&this.material.uniforms&&this.material.uniforms.nebulaCoreRadius){let e=new v.Tween(this.material.uniforms.nebulaCoreRadius).to({value:15},t).easing(v.Easing.Cubic.Out).start();this.userData.eyeTweens.push(e)}if(e.globalUniformsHub&&e.globalUniformsHub.uNebulaSwirlSpeed){let n=new v.Tween(e.globalUniformsHub.uNebulaSwirlSpeed).to({value:2},t).easing(v.Easing.Cubic.Out).start();this.userData.eyeTweens.push(n)}},t.stopEye=function(t){this.userData.eyeTweens&&this.userData.eyeTweens.forEach(e=>e.stop()),this.userData.eyeTweens=[];let n=this.userData.initValues,r=new v.Tween(this.rotation).to({x:n.rotation.x,y:n.rotation.y,z:n.rotation.z},t).easing(v.Easing.Cubic.Out).start(),i=new v.Tween(this.scale).to({x:n.scale.x,y:n.scale.y,z:n.scale.z},t).easing(v.Easing.Cubic.Out).start();if(this.userData.eyeTweens.push(r,i),this.material&&this.material.uniforms&&this.material.uniforms.nebulaCoreRadius){let e=new v.Tween(this.material.uniforms.nebulaCoreRadius).to({value:n.nebulaCoreRadius},t).easing(v.Easing.Cubic.Out).start();this.userData.eyeTweens.push(e)}if(e.globalUniformsHub&&e.globalUniformsHub.uNebulaSwirlSpeed){let r=new v.Tween(e.globalUniformsHub.uNebulaSwirlSpeed).to({value:n.nebulaSwirlSpeed},t).easing(v.Easing.Cubic.Out).start();this.userData.eyeTweens.push(r)}},t):null}function qa(e,t=3e3){let n=X(e,`wallArea`);if(!n||!n.material)return;let r=n.material.uniforms,i=Ka(e);n.userData.eyeTween&&(n.userData.eyeTween.stop(),n.userData.eyeTween=null),n.userData.latheEyeTweenObj&&(n.userData.latheEyeTweenObj.stop(),n.userData.latheEyeTweenObj=null),r&&r.uEyeActive&&(r.uEyeActive.value=!0),r&&r.uEyeOpenness&&(n.userData.eyeTween=new v.Tween(r.uEyeOpenness).to({value:1},t).easing(v.Easing.Cubic.Out).onStart(()=>{n.material.visible=!0}).start(),i&&i.makeEye(t))}function Ja(e,t=3e3){let n=X(e,`wallArea`);if(!n||!n.material)return;let r=n.material.uniforms,i=Ka(e);n.userData.eyeTween&&(n.userData.eyeTween.stop(),n.userData.eyeTween=null),n.userData.latheEyeTweenObj&&(n.userData.latheEyeTweenObj.stop(),n.userData.latheEyeTweenObj=null),r&&r.uEyeOpenness&&(n.userData.eyeTween=new v.Tween(r.uEyeOpenness).to({value:0},t).easing(v.Easing.Cubic.Out).onComplete(()=>{n.material.visible=!1,r&&r.uEyeActive&&(r.uEyeActive.value=!1)}).start(),i&&i.stopEye(t))}function Ya(t){if(t.isHeroAnimating)return;let n=t.getObjectByName(`a-char`),r=t.getObjectByName(`stool_bound`);if(!n||!r)return;let i=n.position.clone(),a=new e.Vector3,o=new e.Quaternion;r.getWorldPosition(a),r.getWorldQuaternion(o);let s=-9.81,c=L.SYS_SPELL_CHANNELING.en,l=L.SYS_SPELL_CAST.en,u=c[Math.floor(Math.random()*c.length)],d=l[Math.floor(Math.random()*l.length)],f=Dr(t,`castSpell`,{autoReturn:!0,speed:.75,onComplete:()=>{t.world&&(t.world.gravity={x:0,y:s,z:0},console.log(`[Spell Ritual] Animation complete. Gravity restored to ${s}.`)),window._cvGravity=.6,window._cvState===`ritual`&&(window._cvState=`falling`),t.cursorInformerProgressBar&&(t.cursorInformerProgressBar.style.height=`0%`),t.cursorInformerBox&&(t.cursorInformerBox.style.backgroundColor=``);let c=1200;if(new v.Tween(n.position).to({x:i.x,y:i.y,z:i.z},c).easing(v.Easing.Cubic.InOut).onComplete(()=>{Dr(t,`typing`,{crossFadeDuration:.5})}).start(),r.rapierBody){let n=r.rapierBody,i=n.translation(),s=n.rotation(),l={t:0};new v.Tween(l).to({t:1},c).easing(v.Easing.Cubic.Out).onUpdate(()=>{let t=new e.Vector3().lerpVectors(i,a,l.t),c=new e.Quaternion().copy(s).slerp(o,l.t);n.setTranslation(t,!0),n.setRotation(c,!0);let u=t.clone();r.parent&&r.parent.worldToLocal(u),r.position.copy(u)}).onComplete(()=>{n.setBodyType(b.RigidBodyType.Fixed),t.isHeroAnimating=!1}).start()}else t.isHeroAnimating=!1;setTimeout(()=>{t.allowsResetting=!0,console.log(`[Spell Ritual] Ritual fully finalized.`)},3e3)}});if(!f)return;t.allowsResetting=!1,t.isHeroAnimating=!0;let p=f.action,m=p.getClip();if(new v.Tween(n.position).to({x:1},800).easing(v.Easing.Cubic.Out).start(),r.rapierBody){r.rapierBody.setBodyType(b.RigidBodyType.KinematicPositionBased);let e=r.rapierBody.translation();new v.Tween(e).to({x:e.x+.5},800).easing(v.Easing.Cubic.Out).onUpdate(()=>{r.rapierBody.setNextKinematicTranslation(e)}).start()}let h=m.duration*.5/.75*1e3;t.world&&(t.world.gravity={x:0,y:0,z:0}),t.physicBodies&&t.physicBodies.forEach(e=>e.wakeUp()),window._cvState=`ritual`,window._cvGravity=0,typeof li==`function`&&li(),typeof fi==`function`&&fi(h);let g={value:0};new v.Tween(g).to({value:100},h).easing(v.Easing.Quadratic.In).onUpdate(()=>{let e=g.value/100*9;t.world&&(t.world.gravity={x:0,y:e,z:0});let n=-(g.value/100)*1.5;window._cvGravity=n,t.cursorInformerProgressBar&&(t.cursorInformerProgressBar.style.height=`${g.value}%`),t.cursorInformerText&&(t.cursorInformerText.textContent=`${u}... ${Math.floor(g.value)}%`),g.value>=100&&t.cursorInformerBox&&(t.cursorInformerBox.style.backgroundColor=`var(--c-cyan)`)}).onComplete(()=>{t.world&&(t.world.gravity={x:0,y:27,z:0}),window._cvGravity=-6,t.cursorInformerText&&(t.cursorInformerText.textContent=``),t.conversationManager&&t.conversationManager.shout(d,3e3),p.timeScale=1,console.log(`[Spell Ritual] Peak reached: ${d}. Elements pinned to ceiling.`)}).start()}function Xa(t,n){if(io||!n)return;io=!0,n.visible=!1;let r=n.position.clone(),i=r.y+3.5,a=n.rapierBody?n.rapierBody:null;a&&a.setBodyType(1);let o=new e.Group;o.position.copy(r),o.rotation.copy(n.rotation),t.add(o);let s=new e.IcosahedronGeometry(.35,1),c=new e.MeshStandardMaterial({color:`#00F3FF`,emissive:`#00F3FF`,emissiveIntensity:15,transparent:!0,opacity:0,wireframe:!0}),l=new e.Mesh(s,c);o.add(l);let u=[];[{pos:[0,0,.5],rot:[0,0,0],dir:[0,0,1]},{pos:[0,0,-.5],rot:[0,Math.PI,0],dir:[0,0,-1]},{pos:[0,.5,0],rot:[-Math.PI/2,0,0],dir:[0,1,0]},{pos:[0,-.5,0],rot:[Math.PI/2,0,0],dir:[0,-1,0]},{pos:[-.5,0,0],rot:[0,-Math.PI/2,0],dir:[-1,0,0]},{pos:[.5,0,0],rot:[0,Math.PI/2,0],dir:[1,0,0]}].forEach(t=>{let n=ds(`#00F3FF`,0),r=new e.Mesh(new e.PlaneGeometry(.98,.98),n);r.position.set(...t.pos),r.rotation.set(...t.rot),r.userData.dir=new e.Vector3(...t.dir),o.add(r),u.push(r)}),typeof qa==`function`&&(qa(t,800),Z(`SECTOR_7_BREACH: SYNCHRONIZING_CORE`));let d={y:r.y,opacity:0};new v.Tween(d).to({y:i,opacity:1},450).easing(v.Easing.Back.Out).onUpdate(()=>{o.position.y=d.y,o.rotation.y+=.08,u.forEach(e=>{e.material.uniforms?.uOpacity?e.material.uniforms.uOpacity.value=d.opacity:e.material.opacity=d.opacity}),a&&a.setTranslation({x:o.position.x,y:o.position.y,z:o.position.z},!0)}).onComplete(()=>{setTimeout(()=>{let r={unfold:0,corePulse:.1};c.opacity=1,l.scale.setScalar(.1),new v.Tween(r).to({unfold:2.2,corePulse:1.6},1e3).easing(v.Easing.Elastic.Out).onUpdate(()=>{u.forEach(e=>{let t=r.unfold,n=e.userData.dir.clone().multiplyScalar(.5+t);e.position.copy(n),e.material.uniforms?.uOpacity&&(e.material.uniforms.uOpacity.value=.7+Math.random()*.3)}),l.scale.setScalar(r.corePulse+Math.sin(performance.now()*.015)*.15),l.rotation.y+=.07,l.rotation.z+=.04,o.rotation.y+=.01}).onComplete(()=>{Z(`CORE_DECRYPTED: REWARD_STREAM_ACTIVE`);let i=Math.floor(Math.random()*5)+6;for(let n=0;n<i;n++){let n={x:(Math.random()-.5)*15,y:12+Math.random()*8,z:(Math.random()-.5)*15};Fi(t,o.position.clone().add(new e.Vector3(0,.5,0)),n)}new v.Tween(r).to({unfold:0,corePulse:.1},600).easing(v.Easing.Back.In).delay(1200).onUpdate(()=>{u.forEach(e=>{e.position.copy(e.userData.dir.clone().multiplyScalar(.5+r.unfold)),e.material.uniforms?.uOpacity&&(e.material.uniforms.uOpacity.value=.5+r.unfold*.5)}),l.scale.setScalar(Math.max(.01,r.corePulse)),c.opacity=Math.max(0,r.corePulse),o.rotation.z+=.05}).onComplete(()=>{t.remove(o),n.visible=!0,n.position.copy(o.position),n.rotation.copy(o.rotation),a&&(a.setTranslation({x:o.position.x,y:o.position.y,z:o.position.z},!0),a.setRotation({x:n.quaternion.x,y:n.quaternion.y,z:n.quaternion.z,w:n.quaternion.w},!0),a.setBodyType(0),a.applyImpulse({x:0,y:-2,z:0},!0)),io=!1,Z(`SYSTEM_STABLE: CORE_REINTEGRATED`),typeof Ja==`function`&&Ja(t,1e3)}).start()}).start()},250)}).start()}var Za,Qa,$a,J,Y,eo,to,no,ro,io,ao=M((()=>{Mn(),He(),Sn(),Hn(),rr(),ks(),ea(),Or(),Di(),ci(),mi(),ls(),Ae(),Ns(),Te(),Oe(),Na(),gs(),Za=[`floor`,`backWall_rapier`,`rightWall`],Qa=[],$a=(e,t)=>{document.body.style.cursor=`pointer`,Tn(e,t),e.gazeFollower&&e.gazeFollower.lookAtTarget(t)},J=e=>{document.body.style.cursor=`auto`,Dn(e),e.gazeFollower&&e.gazeFollower.lookAtTarget(e.camera)},Y=(e,t,n,r=null)=>{r||=Math.random()*1+2.5,On(e,t,n,r)},eo=(t,n,r)=>{let i=n.get(`pokeball`),a=n.get(`pokeball2`),o=n.get(`pokeball3`),s=n.get(`catBlack`),c=n.get(`blackCat`),l=n.get(`catWhite`);n.get(`Object_108`),n.get(`drone`);let u=null,d=0,f=[],p=!1,m=null,h=null,g=null,_=null,y=null,b=(t,n,r)=>{if(console.log(`[Dragon Fortune] Triggered Blessing ritual.`),p){Z(R(`SYS_STORY_VOID_EXHAUSTED`));return}p=!0,Z(R(`SYS_STORY_VOID_RAIN`)),Pi(t);let i=t.globalUniformsHub,a=1;i&&i.uStormSharpness&&(a=i.uStormSharpness.value,new v.Tween(i.uStormSharpness).to({value:0},1500).easing(v.Easing.Cubic.Out).start());let o=t.bulbLight;o&&(t._bulbBaseline===void 0&&(t._bulbBaseline={intensity:o.intensity,angle:o.angle}),Ua(t,t._bulbBaseline.intensity*.04,t._bulbBaseline.angle,1500));let s=t.getObjectByName(`a-char`),c=new e.Vector3;s?s.getWorldPosition(c):c.set(0,1,0),c.y+=.8;for(let s=0;s<54;s++){let l=r&&r.point?r.point.clone():n.position.clone();l.add(new e.Vector3((Math.random()-.5)*.3,(Math.random()-.5)*.3,(Math.random()-.5)*.3));let u=new e.Vector3().subVectors(c,l).normalize();u.x+=(Math.random()-.5)*.15,u.z+=(Math.random()-.5)*.15,u.normalize();let d=28+Math.random()*12,f=u.multiplyScalar(d);f.y=Math.max(f.y,0)+(15+Math.random()*8),setTimeout(()=>{requestAnimationFrame(()=>{Fi(t,l,f,s<53),s===53&&(i&&i.uStormSharpness&&new v.Tween(i.uStormSharpness).to({value:a},2e3).easing(v.Easing.Cubic.InOut).start(),o&&t._bulbBaseline&&Ua(t,t._bulbBaseline.intensity,t._bulbBaseline.angle,2e3,{easing:v.Easing.Cubic.InOut}),setTimeout(()=>{p=!1},1e3))})},s*60)}},x=()=>{u&&cancelAnimationFrame(u),d=performance.now();let e=3e3,n=0,r={value:0};g=new v.Tween(r).to({value:100},e).onUpdate(()=>{t.cursorInformerProgressBar&&(t.cursorInformerProgressBar.style.height=`${r.value}%`),r.value>=100&&t.cursorInformerBox&&(t.cursorInformerBox.style.backgroundColor=`var(--c-cyan)`)}).onComplete(()=>{g=null}).start();let i=r=>{let a=r-d,o=Math.min(a/e,1),s=Math.max(0,3-Math.floor(a/1e3));if(s>0){let e=a%1e3/1e3,n=`.`;e>.33&&(n=`..`),e>.66&&(n=`...`),t.cursorInformerText&&(t.cursorInformerText.textContent=`Gravity Well in ${s}${n} `)}else if(o>=1){t.cursorInformerText&&(t.cursorInformerText.textContent=`Nom Nom Nom`),Ba(t,!0);let e=t.raycasterWrapper?t.raycasterWrapper.pointer.y:0;typeof di==`function`&&di(-e),u=null;return}let c=1+o*o*20;n+=c,t.cursorInformerIcon&&(t.cursorInformerIcon.style.transform=`rotate(${n}deg)`),u=requestAnimationFrame(i)};u=requestAnimationFrame(i)},S=()=>{u&&=(cancelAnimationFrame(u),null),g&&=(g.stop(),null),t.cursorInformerProgressBar&&(t.cursorInformerProgressBar.style.height=`0%`),t.cursorInformerBox&&(t.cursorInformerBox.style.backgroundColor=``)},C=()=>{t.cursorInformerIcon&&(t.cursorInformerIcon.style.transform=`rotate(0deg)`)},w=0,T=()=>{let e=performance.now();e-w<500||(w=e,S(),t.cursorInformerText&&(t.cursorInformerText.textContent=`Gravity Well ACTIVE`),hi(t,5e3,`pc`),Ba(t,!0),di(-(t.raycasterWrapper?t.raycasterWrapper.pointer.y:0)))},E=()=>{t.pokeballGridUniforms&&(t.pokeballGridUniforms.uWorldGridActive.value=1,t.pokeballGridUniforms.uWorldGridProgress.value=0,new v.Tween(t.pokeballGridUniforms.uWorldGridProgress).to({value:1},600).easing(v.Easing.Quadratic.Out).onComplete(()=>{setTimeout(()=>{new v.Tween(t.pokeballGridUniforms.uWorldGridProgress).to({value:0},500).onComplete(()=>{t.pokeballGridUniforms.uWorldGridActive.value=0}).start()},500)}).start())},D=e=>{let t=X(e,`a-char`);if(!t||e.isHeroAnimating)return;e.isHeroAnimating=!0,e.allowsResetting=!1;let n=X(e,`stool_bound`);t.userData.originalPosX===void 0&&(t.userData.originalPosX=t.position.x);let r=n?.rapierBody,i=n?.userData.originalTranslation;if(r&&!i){let e=r.translation();n.userData.originalTranslation={x:e.x,y:e.y,z:e.z},i=n.userData.originalTranslation}if(r&&i){let e={x:i.x};new v.Tween(e).to({x:.52},200).easing(v.Easing.Quadratic.Out).onUpdate(()=>r.setNextKinematicTranslation({x:e.x,y:i.y,z:i.z})).start()}new v.Tween(t.position).to({x:.4},200).easing(v.Easing.Quadratic.Out).onComplete(()=>{Dr(e,`sitToStand`,{autoReturn:!1,onComplete:()=>{if(new v.Tween(t.position).to({x:t.userData.originalPosX},300).easing(v.Easing.Quadratic.InOut).onComplete(()=>{e.isHeroAnimating=!1,e.allowsResetting=!0}).start(),r&&i){let e={x:.52};new v.Tween(e).to({x:i.x},300).easing(v.Easing.Quadratic.InOut).onUpdate(()=>r.setNextKinematicTranslation({x:e.x,y:i.y,z:i.z})).start()}Dr(e,`typing`,{crossFadeDuration:.2})}});let n=Q.currentMode===F.POBA?L.SHOUT_STRETCH_LEG_POBA.en:L.SHOUT_STRETCH_LEG_DEV.en;e.conversationManager?.shout(n[Math.floor(Math.random()*n.length)])}).start()},O=(e,t)=>{let r=X(e,`a-char`),i=e.isHeroAnimating||e.allowsResetting===!1;if(y&&=(clearTimeout(y),null),e.heroMenuInterval&&=(clearInterval(e.heroMenuInterval),null),t&&!i){let t=[{label:`DANCE`,icon:Yn,action:()=>pa(e)},{label:`STRETCH`,icon:Xn,action:()=>D(e)},{label:`GOLF`,icon:Yn,action:()=>da(e)},{label:`SPELL`,icon:Wn,action:()=>Ya(e)}];e.heroMenuIndex===void 0&&(e.heroMenuIndex=0);let r=()=>{let n=t[e.heroMenuIndex],r=t.map((t,n)=>`<span style="${n===e.heroMenuIndex?`background: var(--c-cyan); color: var(--c-black); padding: 2px 8px; font-weight: 800; border-radius: 2px; text-shadow: none; box-shadow: 0 0 10px var(--c-cyan);`:`opacity: 0.6; padding: 2px 8px;`}">${t.label}</span>`).join(` `);H(e,n.icon,`<div style="display: flex; gap: 4px; align-items: center; font-family: 'Rajdhani', sans-serif; font-size: 13px; letter-spacing: 1px;">${r}</div>`)};r(),e.heroMenuInterval=setInterval(()=>{e.heroMenuIndex=(e.heroMenuIndex+1)%t.length,r()},800);let i=n.get(`hero_hitbox`);if(e.raycastObjects&&f.length===0&&i&&(f=[...e.raycastObjects],e.raycastObjects=[i],e.world&&(e._originalBallGravity=e.world.hasPointGravityOnBalls,e.world.hasPointGravityOnBalls=!1)),e.conversationManager&&!e._hasShoutedHeroMenu){let t=L.UI_HERO_MENU_ENCOURAGEMENT.en,n=t[Math.floor(Math.random()*t.length)];e.conversationManager.shout(n,1e4,{small:!0}),e._hasShoutedHeroMenu=!0}}else{if(r){let t=X(e,`Ch23_Suit`);t?.material&&t.userData.originalToneMapped!==void 0&&(t.material.toneMapped=t.userData.originalToneMapped)}e.conversationManager&&e.conversationManager.hide(),e._hasShoutedHeroMenu=!1,U(e),f.length>0&&(e.raycastObjects=[...f],f=[],e.world&&e._originalBallGravity!==void 0&&(e.world.hasPointGravityOnBalls=e._originalBallGravity,delete e._originalBallGravity))}},k=(e,t,n,r=!0)=>{if(t)if(e.monitorMenuInterval&&=(clearInterval(e.monitorMenuInterval),null),r&&n){t.userData.menuIndex===void 0&&(t.userData.menuIndex=0);let r=()=>{n[t.userData.menuIndex];let r=n.map((e,n)=>`<span style="${n===t.userData.menuIndex?`background: var(--c-cyan); color: var(--c-black); padding: 2px 8px; font-weight: 800; border-radius: 2px; text-shadow: none; box-shadow: 0 0 10px var(--c-cyan);`:`opacity: 0.6; padding: 2px 8px;`}">${e.label}</span>`).join(` `);H(e,nr,`<div style="display: flex; gap: 4px; align-items: center; font-family: 'Rajdhani', sans-serif; font-size: 11px; letter-spacing: 1px;">${r}</div>`)};r(),e.monitorMenuInterval=setInterval(()=>{t.userData.menuIndex=(t.userData.menuIndex+1)%n.length,r()},800)}else U(e)},A=(e,t,n,r=!0)=>{if(t)if(e.wallMenuInterval&&=(clearInterval(e.wallMenuInterval),null),r&&n){t.userData.menuIndex===void 0&&(t.userData.menuIndex=0);let r=()=>{n[t.userData.menuIndex];let r=n.map((e,n)=>`<span style="${n===t.userData.menuIndex?`background: var(--c-cyan); color: var(--c-black); padding: 2px 8px; font-weight: 800; border-radius: 2px; text-shadow: none; box-shadow: 0 0 10px var(--c-cyan);`:`opacity: 0.6; padding: 2px 8px;`}">${e.label}</span>`).join(` `);H(e,Qn,`<div style="display: flex; gap: 4px; align-items: center; font-family: 'Rajdhani', sans-serif; font-size: 13px; letter-spacing: 1px;">${r}</div>`)};r(),e.wallMenuInterval=setInterval(()=>{t.userData.menuIndex=(t.userData.menuIndex+1)%n.length,r()},1e3)}else U(e)};return{hero_hitbox:{onMouseEnter:e=>{try{document.body.style.cursor=`pointer`,t.isHeroAnimating||t.allowsResetting,t.raycasterWrapper?.mouseInContainer,O(t,!0)}catch(e){console.error(`Error in hero_hitbox onMouseEnter:`,e)}},onMouseLeave:()=>{document.body.style.cursor=`auto`,U(t),O(t,!1)},onMouseDown:()=>{if(t.isHeroAnimating||t.allowsResetting===!1)return;let e=[()=>pa(t),()=>D(t),()=>da(t),()=>Ya(t)][t.heroMenuIndex||0];e&&(U(t),e())}},catBlack:{onMouseEnter:e=>{t.raycasterEnabled!==!1&&(document.body.style.cursor=`pointer`,t.raycasterWrapper?.mouseInContainer&&H(t,Xn,e.userData.assignedRole||`MAX - TECH LEAD`),En(t,e,An),c&&En(t,c,An),s&&!s.userData.hasShoutedHover&&(_&&clearTimeout(_),_=setTimeout(()=>{t.conversationManager?.shout(L.SHOUT_CAT_BLACK_HOVER.en[0]),s.userData.hasShoutedHover=!0,_=null},400)))},onMouseLeave:e=>{_&&=(clearTimeout(_),null),document.body.style.cursor=`auto`,J(t),U(t)},onMouseDown:(e,n)=>{if(Y(t,e,n),i&&r){let n=[s];c&&n.push(c),Ia(t,i,n,r.gravityCenter,r.tgtPos,r.tgtQuat,e)}s.userData.hasShoutedClick||(t.conversationManager?.shout(L.SHOUT_CAT_BLACK_CLICK.en[0],4e3,{extraSmall:!0}),s.userData.hasShoutedClick=!0)}},catWhite:{onMouseEnter:e=>{t.raycasterEnabled!==!1&&(document.body.style.cursor=`pointer`,En(t,e,An),t.raycasterWrapper?.mouseInContainer&&H(t,Xn,e.userData.assignedRole||`MIN - QA ENGINEER`),l&&!l.userData.hasShoutedHover&&(_&&clearTimeout(_),_=setTimeout(()=>{t.conversationManager?.shout(L.SHOUT_CAT_WHITE_HOVER.en[0]),l.userData.hasShoutedHover=!0,_=null},400)))},onMouseLeave:e=>{_&&=(clearTimeout(_),null),document.body.style.cursor=`auto`,J(t),U(t)},onMouseDown:(e,n)=>{Y(t,e,n),i&&r&&Ia(t,i,l,r.gravityCenter,r.tgtPos,r.tgtQuat,e)}},pokeball:{onMouseEnter:e=>{t.raycasterEnabled!==!1&&(document.body.style.cursor=`pointer`,Dn(t),En(t,e))},onMouseLeave:()=>{document.body.style.cursor=`auto`,J(t)},onMouseDown:(e,n)=>{if(t.raycasterEnabled===!1)return;Y(t,e,n),E();let a=[l,s].filter(e=>e&&e.visible);a.length>0&&Ia(t,i,a,r.gravityCenter,r.tgtPos,r.tgtQuat,e)}},pokeball2:{onMouseEnter:e=>{t.raycasterEnabled!==!1&&(document.body.style.cursor=`pointer`,Dn(t),En(t,e))},onMouseLeave:()=>{document.body.style.cursor=`auto`,J(t)},onMouseDown:(e,n)=>{if(t.raycasterEnabled===!1)return;Y(t,e,n),E();let i=[l,s].filter(e=>e&&e.visible);i.length>0&&Ia(t,a,i,r.gravityCenter,r.tgtPos,r.tgtQuat,e)}},pokeball3:{onMouseEnter:e=>{t.raycasterEnabled!==!1&&(document.body.style.cursor=`pointer`,Dn(t),En(t,e))},onMouseLeave:()=>{document.body.style.cursor=`auto`,J(t)},onMouseDown:(e,n)=>{if(t.raycasterEnabled===!1)return;Y(t,e,n),E();let i=[l,s].filter(e=>e&&e.visible);i.length>0&&Ia(t,o,i,r.gravityCenter,r.tgtPos,r.tgtQuat,e)}},Object_2001:{onMouseEnter:e=>{t.raycasterEnabled!==!1&&(document.body.style.cursor=`pointer`,t.raycasterWrapper?.mouseInContainer&&H(t,Yn,R(`UI_INFORMER_CHAIR`)),$a(t,e))},onMouseLeave:()=>{document.body.style.cursor=`auto`,U(t),J(t)},onMouseDown:(e,n)=>{t.raycasterEnabled!==!1&&Y(t,e,n)}},Lathe_Center:{onMouseEnter:e=>{t.raycasterEnabled!==!1&&t.integrityBaselineCaptured&&(document.body.style.cursor=`pointer`,t.raycasterWrapper?.mouseInContainer&&H(t,qn,R(`UI_INFORMER_BLACKHOLE`)),t.raycastObjects&&f.length===0&&(f=[...t.raycastObjects],t.raycastObjects=[e]),x())},onMouseLeave:()=>{if(document.body.style.cursor=`auto`,!t.integrityBaselineCaptured)return;S(),C(),f.length>0&&(t.raycastObjects=[...f],f=[]);let e=n.get(`Object_2001`);e&&e.rapierBody.sleep(),Ba(t,!1),U(t),window._cvState===`sucking`&&li()},onMouseDown:()=>{t.raycasterEnabled!==!1&&t.integrityBaselineCaptured&&T()},onMouseHover:()=>{kn(t)}},planeSky:{onMouseEnter:()=>{t.raycasterEnabled!==!1&&(document.body.style.cursor=`pointer`,t.raycasterWrapper?.mouseInContainer&&H(t,Wn,R(`UI_INFORMER_SKY`)))},onMouseLeave:()=>{document.body.style.cursor=`auto`,U(t)},onMouseDown:(n,r)=>{if(t.raycasterEnabled===!1)return;let i=r.point.clone(),a=n.worldToLocal(i),o=new e.Vector2(2*a.x,2*a.y),s=t.globalUniformsHub;Pn({scene:t,constantUniform:s?s.uniforms:null,windowLight:t.windowLight},2,o,!1)}},glassInvi:{onMouseEnter:e=>{t.raycasterEnabled!==!1&&(document.body.style.cursor=`pointer`,H(t,Gn,R(`UI_INFORMER_DOOR`)),$a(t,e))},onMouseLeave:()=>{document.body.style.cursor=`auto`,U(t),J(t)},onMouseDown:(e,n)=>{t.raycasterEnabled!==!1&&(e.userData.hasClickedOnce?za(t):(za(t,{forcedX:0}),e.userData.hasClickedOnce=!0))}},lamp:{onMouseEnter:e=>{t.raycasterEnabled!==!1&&(document.body.style.cursor=`pointer`,H(t,$n,R(`UI_INFORMER_LAMP`)),$a(t,e))},onMouseLeave:()=>{document.body.style.cursor=`auto`,U(t),J(t)},onMouseDown:(e,n)=>{if(t.raycasterEnabled===!1)return;let r=n.point.clone();e.worldToLocal(r).y>.1?Ln(t):Y(t,e,n)}},computer:{onMouseEnter:e=>{t.raycasterEnabled!==!1&&(document.body.style.cursor=`pointer`,H(t,nr,R(`UI_INFORMER_SCREEN`)),$a(t,e))},onMouseLeave:()=>{document.body.style.cursor=`auto`,U(t),J(t)},onMouseDown:(e,r)=>{if(t.raycasterEnabled===!1)return;Pa(t,Q.currentMode,n),t.conversationManager?.shout(`PERSONNEL ROLES REASSIGNED`);let i=t.globalUniformsHub;Rn({constantUniform:i?i.uniforms:null,windowLight:t.windowLight},.96,null,!1)}},questionCube:{onMouseEnter:e=>{t.raycasterEnabled!==!1&&(document.body.style.cursor=`pointer`,t.raycasterWrapper?.mouseInContainer&&H(t,Yn,R(`UI_INFORMER_CUBE`)),$a(t,e))},onMouseLeave:()=>{document.body.style.cursor=`auto`,U(t),J(t)},onMouseDown:(e,n)=>{t.raycasterEnabled!==!1&&(console.log(`[Raycast] questionCube clicked! Triggering ritual.`,e.name),Xa(t,e))}},mjolnir_low_mjolnir_hammer_0:{onMouseEnter:e=>{t.raycasterEnabled!==!1&&(document.body.style.cursor=`pointer`,H(t,Wn,R(`UI_INFORMER_MJOLNIR`)),$a(t,e))},onMouseLeave:()=>{document.body.style.cursor=`auto`,U(t),J(t)},onMouseDown:(e,n)=>{if(t.raycasterEnabled===!1)return;let r=t.globalUniformsHub;Y(t,e,n,8),Pn({scene:t,constantUniform:r?r.uniforms:null,windowLight:t.windowLight},.96,null,!1)}},cFanBulb:{onMouseEnter:e=>{t.raycasterEnabled!==!1&&(document.body.style.cursor=`pointer`,H(t,Kn,R(`UI_INFORMER_BULB`)))},onMouseLeave:()=>{document.body.style.cursor=`auto`,U(t)},onMouseDown:(e,n)=>{t.raycasterEnabled!==!1&&Ha(t,e)},onMouseHover:()=>{}},cFanBody:{onMouseEnter:e=>{document.body.style.cursor=`pointer`;let n=R(`UI_INFORMER_FAN_BODY`)||`BOOST & BLAST`;H(t,Kn,n),$a(t,e)},onMouseLeave:()=>{U(t),J(t)},onMouseDown:(e,n)=>{Ga(t,e)},onMouseHover:()=>{}},wallArea:{onMouseEnter:e=>{if(t.raycasterEnabled===!1)return;document.body.style.cursor=`pointer`,m&&=(clearTimeout(m),null),qa(t);let n=t.objectMap?t.objectMap.get(`wallArea`):null;t.gazeFollower&&t.gazeFollower.lookAtTarget(n),A(t,e,[{label:`BLESSING`,action:()=>b(t,e)},{label:`WRATH`,action:()=>{let e=t.getObjectByName(`cFanBody`)||(t.objectMap?t.objectMap.get(`cFanBody`):null);e&&Ga(t,e)}}],!0)},onMouseLeave:e=>{document.body.style.cursor=`auto`,t.gazeFollower&&t.gazeFollower.lookAtTarget(t.camera),m=setTimeout(()=>{Ja(t)},4e3),A(t,e,null,!1)},onMouseDown:(e,n)=>{let r=[{label:`BLESSING`,action:()=>b(t,e,n)},{label:`WRATH`,action:()=>{let e=t.getObjectByName(`cFanBody`)||(t.objectMap?t.objectMap.get(`cFanBody`):null);e&&Ga(t,e)}}];e.userData.menuIndex===void 0&&(e.userData.menuIndex=0),r[e.userData.menuIndex].action()},onMouseHover:()=>{}},shelf:{},caseCover:{onMouseEnter:e=>{if(t.raycasterEnabled===!1)return;document.body.style.cursor=`pointer`,H(t,nr,R(`UI_INFORMER_REBOOT`)),$a(t,e),h&&h.stop();let n=t.globalUniformsHub;!n||!n.uFireHeightOverride||(n.uFireHeightOverride.value<.01&&(n.uFireHeightOverride.value=2.5),h=new v.Tween(n.uFireHeightOverride).to({value:6},4e3).easing(v.Easing.Cubic.Out).start())},onMouseLeave:()=>{U(t),J(t);let e=t.globalUniformsHub;!e||!e.uFireHeightOverride||(h=new v.Tween(e.uFireHeightOverride).to({value:0},1e3).easing(v.Easing.Cubic.In).onComplete(()=>{e.uFireHeightOverride&&(e.uFireHeightOverride.value=0)}).start())},onMouseDown:(e,n)=>{h&&h.stop();let r=t.globalUniformsHub;r&&r.uFireHeightOverride&&(r.uFireHeightOverride.value=0),Y(t,e,n),gi(t,4500),[`screenDisplay001`,`screenDisplay002`,`verticalMonitorDisplay`].forEach(e=>{let n=t.objectMap.get(e);n&&(n.material=W,n.userData.originalMaterial=W)})}},droneRC:{onMouseEnter:()=>{document.body.style.cursor=`pointer`;let n=t.getObjectByName(`drone`);n&&(n.userData.isHovering=!0,Go(t,new e.Vector3(0,-.76,.5).unproject(t.camera),!0))},onMouseLeave:()=>{document.body.style.cursor=`auto`;let e=t.getObjectByName(`drone`);if(e){e.userData.isHovering=!1;let n=t.getObjectByName(`drone-beam`);!(n&&n.visible)&&t.gazeFollower&&(t.gazeFollower.isLocked=!1,Go(t,t.camera,!1))}},onMouseDown:e=>{let n=Q.currentMode===F.POBA?`SYS_DRONE_SUBTITLES_POBA`:`SYS_DRONE_SUBTITLES_DEV`,r=L[n]?.en||[],i;if(r.length>1){let t=r.filter(t=>t!==e.userData.lastSubtitle);i=t[Math.floor(Math.random()*t.length)]}else i=R(n);e.userData.lastSubtitle=i,ys(i),Ko(t,i)}},Object_34001:{onMouseEnter:e=>{document.body.style.cursor=`pointer`,k(t,e,[{label:`FIREWKS`,action:()=>{e.material=Qr,e.userData.originalMaterial=Qr}},{label:`MOON`,action:()=>{e.material=$r,e.userData.originalMaterial=$r}},{label:`SUNSET`,action:()=>{e.material=ei,e.userData.originalMaterial=ei}},{label:`NETFLIX`,action:()=>{e.material=ti,e.userData.originalMaterial=ti,t.globalUniformsHub?.uniforms.iTime&&(ti.uniforms.uNetflixStartTime.value=t.globalUniformsHub.uniforms.iTime.value)}},{label:`DOTA`,action:()=>{let t=[ri,ii],n=t[Math.floor(Math.random()*t.length)];e.material=n,e.userData.originalMaterial=n}}],!0)},onMouseLeave:e=>{document.body.style.cursor=`auto`,k(t,e,null,!1)},onMouseDown:(e,n)=>{let r=[{label:`FIREWKS`,action:()=>{e.material=Qr,e.userData.originalMaterial=Qr}},{label:`MOON`,action:()=>{e.material=$r,e.userData.originalMaterial=$r}},{label:`SUNSET`,action:()=>{e.material=ei,e.userData.originalMaterial=ei}},{label:`NETFLIX`,action:()=>{e.material=ti,e.userData.originalMaterial=ti,t.globalUniformsHub?.uniforms.iTime&&(ti.uniforms.uNetflixStartTime.value=t.globalUniformsHub.uniforms.iTime.value)}},{label:`DOTA`,action:()=>{let t=[ri,ii],n=t[Math.floor(Math.random()*t.length)];e.material=n,e.userData.originalMaterial=n}}];e.userData.menuIndex===void 0&&(e.userData.menuIndex=0),r[e.userData.menuIndex].action(),e.userData.menuIndex=(e.userData.menuIndex+1)%r.length,Y(t,t.objectMap.get(`Object_31`),n,4),k(t,e,r)}},screenDisplay001:{onMouseEnter:e=>{t.raycasterEnabled!==!1&&(document.body.style.cursor=`pointer`,k(t,e,[{label:`CODE`,action:()=>{e.material=W,e.userData.originalMaterial=W,typeof window.cvReset==`function`&&window.cvReset(1500)}},{label:`NETFLIX`,action:()=>{e.material=G,e.userData.originalMaterial=G,li(),t.globalUniformsHub?.uniforms.iTime&&(G.uniforms.uNetflixStartTime.value=t.globalUniformsHub.uniforms.iTime.value)}},{label:`DOTA`,action:()=>{let t=[ri,ii],n=t[Math.floor(Math.random()*t.length)];e.material=n,e.userData.originalMaterial=n,li()}}],!0),W.uniforms.uHoverActive&&(W.uniforms.uHoverActive.value=1))},onMouseHover:(e,t)=>{if(!W.uniforms.uHoverActive)return;let n=t.uv,r=.045;1-r;let i=(n.x-r)/.955-.5,a=.035;.8999999999999999-a;let o=(n.y-a)/.8649999999999999;W.uniforms.uTargetHoverPos.value.set(i,o)},onMouseLeave:e=>{document.body.style.cursor=`auto`,k(t,e,null,!1),W.uniforms.uHoverActive&&(W.uniforms.uHoverActive.value=0)},onMouseDown:(e,n)=>{let r=[{label:`CODE`,action:()=>{e.material=W,e.userData.originalMaterial=W,typeof window.cvReset==`function`&&window.cvReset(1500)}},{label:`NETFLIX`,action:()=>{e.material=G,e.userData.originalMaterial=G,li(),t.globalUniformsHub?.uniforms.iTime&&(G.uniforms.uNetflixStartTime.value=t.globalUniformsHub.uniforms.iTime.value)}},{label:`DOTA`,action:()=>{let t=[ri,ii],n=t[Math.floor(Math.random()*t.length)];e.material=n,e.userData.originalMaterial=n,li()}}];e.userData.menuIndex===void 0&&(e.userData.menuIndex=0),r[e.userData.menuIndex].action(),e.userData.menuIndex=(e.userData.menuIndex+1)%r.length,Y(t,t.objectMap.get(`screenDisplay`),n,4),k(t,e,r)}},verticalMonitorDisplay:{onMouseEnter:e=>{t.raycasterEnabled!==!1&&(document.body.style.cursor=`pointer`,k(t,e,[{label:`SPLIT`,action:()=>{let t=e.geometry.attributes.aLayoutMode;t&&(t.array.fill(0),t.needsUpdate=!0)}},{label:`FULL`,action:()=>{let t=e.geometry.attributes.aLayoutMode;t&&(t.array.fill(1),t.needsUpdate=!0)}}],!0),W.uniforms.uHoverActive&&(W.uniforms.uHoverActive.value=1))},onMouseHover:(e,t)=>{if(!W.uniforms.uHoverActive)return;let n=t.uv,r=.045;1-r;let i=(n.x-r)/.955,a=.035;.8999999999999999-a;let o=(n.y-a)/.8649999999999999;W.uniforms.uTargetHoverPos.value.set(i,o)},onMouseLeave:e=>{document.body.style.cursor=`auto`,k(t,e,null,!1),W.uniforms.uHoverActive&&(W.uniforms.uHoverActive.value=0)},onMouseDown:(e,n)=>{let r=[{label:`SPLIT`,action:()=>{let t=e.geometry.attributes.aLayoutMode;t&&(t.array.fill(0),t.needsUpdate=!0)}},{label:`FULL`,action:()=>{let t=e.geometry.attributes.aLayoutMode;t&&(t.array.fill(1),t.needsUpdate=!0)}}];if(e.userData.menuIndex===void 0&&(e.userData.menuIndex=0),r[e.userData.menuIndex].action(),e.userData.menuIndex=(e.userData.menuIndex+1)%r.length,n.uv&&W.uniforms.uClickPos){let e=n.uv,r=.045;1-r;let i=(e.x-r)/.955,a=.035;.8999999999999999-a;let o=(e.y-a)/.8649999999999999;W.uniforms.uClickPos.value.set(i,o),t.globalUniformsHub?.uniforms.iTime&&(W.uniforms.uClickTime.value=t.globalUniformsHub.uniforms.iTime.value)}Y(t,t.objectMap.get(`verticalMonitor`),n,4),k(t,e,r)}},screenDisplay002:{onMouseEnter:e=>{t.raycasterEnabled!==!1&&(document.body.style.cursor=`pointer`,k(t,e,[{label:`CODE`,action:()=>{e.material=W,e.userData.originalMaterial=W}},{label:`NETFLIX`,action:()=>{e.material=G,e.userData.originalMaterial=G,t.globalUniformsHub?.uniforms.iTime&&(G.uniforms.uNetflixStartTime.value=t.globalUniformsHub.uniforms.iTime.value)}},{label:`DOTA`,action:()=>{let t=[ri,ii],n=t[Math.floor(Math.random()*t.length)];e.material=n,e.userData.originalMaterial=n}}],!0),W.uniforms.uHoverActive&&(W.uniforms.uHoverActive.value=1))},onMouseHover:(e,t)=>{if(!W.uniforms.uHoverActive)return;let n=t.uv,r=.045;1-r;let i=.54+(n.x-r)/.955,a=.035;.8999999999999999-a;let o=(n.y-a)/.8649999999999999;W.uniforms.uTargetHoverPos.value.set(i,o)},onMouseLeave:e=>{document.body.style.cursor=`auto`,k(t,e,null,!1),W.uniforms.uHoverActive&&(W.uniforms.uHoverActive.value=0)},onMouseDown:(e,n)=>{let r=[{label:`CODE`,action:()=>{e.material=W,e.userData.originalMaterial=W}},{label:`NETFLIX`,action:()=>{e.material=G,e.userData.originalMaterial=G,t.globalUniformsHub?.uniforms.iTime&&(G.uniforms.uNetflixStartTime.value=t.globalUniformsHub.uniforms.iTime.value)}},{label:`DOTA`,action:()=>{let t=[ri,ii],n=t[Math.floor(Math.random()*t.length)];e.material=n,e.userData.originalMaterial=n}}];e.userData.menuIndex===void 0&&(e.userData.menuIndex=0),r[e.userData.menuIndex].action(),e.userData.menuIndex=(e.userData.menuIndex+1)%r.length,Y(t,t.objectMap.get(`screenDisplay2`),n,4),k(t,e,r)}},aegis:{onMouseEnter:e=>{$a(t,e),H(t,nr,R(`UI_INFORMER_AEGIS`)),hs(t,e)},onMouseLeave:e=>{J(t),U(t),ms(t)},onMouseDown:(e,n)=>{let r=t.objectMap.get(`screenDisplay001`),i=t.objectMap.get(`Object_34001`),a=[{screen:r,pool:[ri,ii]},{screen:i,pool:[ri,ii]}],o=a[Math.floor(Math.random()*a.length)];if(o.screen&&o.pool.length>0){let e=o.pool[Math.floor(Math.random()*o.pool.length)];o.screen.material=e,o.screen.userData.originalMaterial=e,Z(R(`SYS_STORY_DOTA_LIFE`))}Y(t,e,n)}},aegis2:{onMouseEnter:e=>{$a(t,e),H(t,nr,R(`UI_INFORMER_AEGIS`)),hs(t,e)},onMouseLeave:e=>{J(t),U(t),ms(t)},onMouseDown:(e,n)=>{let r=t.objectMap.get(`screenDisplay001`),i=t.objectMap.get(`Object_34001`),a=[{screen:r,pool:[ri,ii]},{screen:i,pool:[ri,ii]}],o=a[Math.floor(Math.random()*a.length)];if(o.screen&&o.pool.length>0){let e=o.pool[Math.floor(Math.random()*o.pool.length)];o.screen.material=e,o.screen.userData.originalMaterial=e,Z(`PICK ME!!`)}Y(t,e,n)}}}},to=e=>{U(e),document.body.style.cursor=`auto`},no=!1,ro=!1,io=!1}));function oo(e){return function(t){let n=e*1.525;return(t*=2)<1?.5*(t*t*((n+1)*t-n)):.5*((t-=2)*t*((n+1)*t+n)+2)}}function so(e){return function(t){let n=e;return--t*t*((n+1)*t+n)+1}}var co,lo,uo=M((()=>{co=oo(.4),lo=so(.04)})),fo,po=M((()=>{fo={isUnlocked:!0,init:e=>{let t=e.HUD;!t||!t.navButtons||t.navButtons.forEach(e=>{e.hide(0),e.setActive(!1)})},onHudOpen:e=>{let t=e.HUD;if(!t||!t.navButtons)return;t.navButtons.forEach((e,t)=>{t!==0&&e.hide(0)});let n=t.navButtons[0];n.show(1200,1),n.setActive(!1)},onMorphToAbout:e=>{let t=e.HUD;if(!t||!t.navButtons)return;let n=1e3,r=t.navButtons[3];r.setText(`ABOUT`),r.show(n,2),r.setActive(!0),setTimeout(()=>{let e=t.navButtons[2];e.setText(`LAB`),e.show(n,1.8),e.setActive(!1)},150),setTimeout(()=>{let e=t.navButtons[1];e.setText(`WORK`),e.show(n,2.2),e.setActive(!1)},300)},onRoomAssemble:e=>{let t=e.HUD;if(!t||!t.navButtons)return;fo.isUnlocked=!0,t.navButtons[0].show(1500,1);let n=t.navButtons[2];n.setText(`LAB`),n.show(1500,1.8),n.setActive(!0);let r=t.navButtons[1];r.setText(`WORK`),r.show(1500,2.2),r.setActive(!1);let i=t.navButtons[3];i.setText(`ABOUT`),i.show(1500,2),i.setActive(!1)}}}));function mo(e){if(!e||!e.renderer)return;let t=(window.devicePixelRatio||1)*.2,n=e.renderer.getPixelRatio();Math.abs(n-t)>.01&&(e.renderer.setPixelRatio(t),e.pointsApp&&typeof e.pointsApp.onWindowResize==`function`&&e.pointsApp.onWindowResize())}async function ho(e,t,n,r=800){if(!e||!e.renderer)return;let i=window.devicePixelRatio||1,a=[.35,.5,n];for(let n of a)n<=t||(await No(r),e.renderer&&(e.renderer.setPixelRatio(i*n),e.pointsApp&&typeof e.pointsApp.onWindowResize==`function`&&e.pointsApp.onWindowResize()))}async function go(e,t=800,n=!1){performance.now(),e.isTransitioning=!0,e.HUD&&typeof e.HUD.stopBreathing==`function`&&e.HUD.stopBreathing(),e.renderer&&(e.renderer.shadowMap.autoUpdate=!1,mo(e));let r=X(e,`roomGLBModel`);r&&(r.visible=!0,r.scale.set(1,1,1),r.position.set(0,0,0),e.physicObjects&&e.physicObjects.forEach(e=>{e.visible=!0}),[`rightWall-cover`,`floor`,`planeSky`].forEach(t=>{let n=X(e,t);n&&(n.visible=!0)}));let i=e.isLowPowerMode,a=n?0:i?600:1050;[`floor`,`planeSky`,`rightWall-cover`].forEach(n=>{let r=X(e,n);r&&(r.visible=!0,wo({obj:r,duration:t*(i?.1:.2),delay:a,easing:so(.25)}))});let o=X(e,`a-char`);o&&(o.visible=!0,o.scale.setScalar(1e-4),o.userData.originalPos&&o.position.copy(o.userData.originalPos),o.userData.originalRot&&o.rotation.copy(o.userData.originalRot),o.updateMatrix());let s=X(e,`stool`);s&&(s.visible=!0,s.scale.setScalar(1e-4),s.userData.originalPos&&s.position.copy(s.userData.originalPos),s.userData.originalRot&&s.rotation.copy(s.userData.originalRot),s.updateMatrix());let c=X(e,`stool_bound`);c&&(c.visible=!1,c.userData.originalPos&&c.position.copy(c.userData.originalPos),c.userData.originalScale&&c.scale.copy(c.userData.originalScale),c.userData.originalRot&&c.rotation.copy(c.userData.originalRot),c.updateMatrix()),e.points.material.uniforms.uPixelRatio.value,e.points.material.uniforms.uSize.value;let l=n?0:i?900:1500,u=.15,d=.05,f=l*(1-u-d),p=xe[1].toneMappingExposure,m=t=>new v.Tween(e.points.material.uniforms.uPixelRatio).to({value:t},f).easing(v.Easing.Exponential.In),h=t=>new v.Tween(e.points.material.uniforms.uSize).to({value:t},f).easing(v.Easing.Exponential.In),g=t=>new v.Tween(e.renderer).to({toneMappingExposure:t},f).easing(v.Easing.Linear.None);if(n)o&&(o.visible=!0,wo({obj:o,duration:100})),s&&(s.visible=!0,wo({obj:s,duration:100})),Yo(e,0);else{let t=new v.Tween(e.points.bloomPass).to({strength:0},l*u).delay(l*d).easing(v.Easing.Back.InOut).onComplete(async()=>{let t=X(e,`rightWall-cover`);t&&(t.visible=!0),window.showSectionPoint&&window.showSectionPoint()});new v.Tween(e.points.bloomPass).to({strength:5},f).easing(v.Easing.Quadratic.In).onComplete(async()=>{o&&o.scale.copy(o.userData.originalScale),s&&s.scale.copy(s.userData.originalScale),c&&(c.visible=!0,c.userData.originalPos&&c.position.copy(c.userData.originalPos),c.userData.originalRot&&c.rotation.copy(c.userData.originalRot),c.scale.copy(c.userData.originalScale),c.updateMatrix()),e.pointsApp&&e.pointsApp.points&&(e.pointsApp.points.visible=!1),t.start()}).start(),m(0).start(),h(0).start(),setTimeout(()=>{Yo(e)},f*.1)}g(p).start()}async function _o(e,t){let n=To(e);n.forEach((e,t)=>{}),e.loadedModel&&e.loadedModel.model&&e.loadedModel.model.position.set(0,0,0);let r=n.filter(e=>/^book\d+$/.test(e.name)),i=n.filter(e=>!/^book\d+$/.test(e.name)),a=e.isLowPowerMode,o=(e,t,n=1,r=!1,i=null)=>new Promise(a=>{if(e.length===0)return a();let o=0,s=e.length,c=r?v.Easing.Cubic.Out:so(1),l=Math.ceil(s/5),u=0,d=()=>{let f=Math.min(u+l,s);performance.now();for(let l=u;l<f;l++){let u=e[l];u.userData.scenarioTween&&(u.userData.scenarioTween.stop(),u.userData.scenarioTween=null),u.userData.wasMatrixAutoUpdate=u.matrixAutoUpdate,u.matrixAutoUpdate=!1;let d=u.userData,f=(Math.random()-.5)*500,p=Math.max(0,l/s*t*n+f),m=t*(r?1:.7+Math.random()*.7),h={t:0};u.userData.scenarioTween=new v.Tween(h).to({t:1},m).delay(p).easing(c).onUpdate(()=>{let e=h.t;d.originalPos&&d.hidePos&&(u.position.x=d.hidePos.x+(d.originalPos.x-d.hidePos.x)*e,u.position.y=d.hidePos.y+(d.originalPos.y-d.hidePos.y)*e,u.position.z=d.hidePos.z+(d.originalPos.z-d.hidePos.z)*e),d.originalScale&&d.hideScale&&(u.scale.x=d.hideScale.x+(d.originalScale.x-d.hideScale.x)*e,u.scale.y=d.hideScale.y+(d.originalScale.y-d.hideScale.y)*e,u.scale.z=d.hideScale.z+(d.originalScale.z-d.hideScale.z)*e),r&&d.originalRot&&d.hideRot&&(u.rotation.x=d.hideRot.x+(d.originalRot.x-d.hideRot.x)*e,u.rotation.y=d.hideRot.y+(d.originalRot.y-d.hideRot.y)*e,u.rotation.z=d.hideRot.z+(d.originalRot.z-d.hideRot.z)*e),u.matrixAutoUpdate===!1&&u.updateMatrix()}).onComplete(async()=>{u.userData.scenarioTween=null,o++,o===s&&(i&&await i(),a())}).start()}u=f,u<s&&requestAnimationFrame(d)};d()});await o(i,t,a?.3:.5),await No(a?34:68),await o(r,t*.8,a?.3:.4,!0,async()=>{await vo(e,n),qo(e,1),setTimeout(()=>{as(e),e.physicObjects&&e.physicObjects.forEach((e,t)=>{e.rapierBody&&setTimeout(()=>{e.rapierBody&&e.rapierBody.wakeUp()},t*6)})},250),await No(a?300:500)})}function vo(e,t){return new Promise(n=>{let r=0,i=()=>{let a=Math.min(r+20,t.length);for(let e=r;e<a;e++){let n=t[e];n.matrixAutoUpdate=n.userData.wasMatrixAutoUpdate===void 0?!0:n.userData.wasMatrixAutoUpdate,n.updateMatrix()}r=a,r<t.length?requestAnimationFrame(i):(e.loadedModel&&e.loadedModel.model&&e.loadedModel.model.updateMatrixWorld(!0),n())};i()})}async function yo(e,t=!0){e.objectMap.get(`planeSky`),e.objectMap.forEach((e,n)=>{/^dragonBall\d+Stars$/.test(n)&&(e.visible=t)}),t?(e.clock.start(),Z(`Clock Resumed.`)):(e.clock.stop(),Z(`Clock Paused.`)),e.world&&(e.world.isActive=t,Z(t?`Physics Activated.`:`Physics Deactivated.`))}function bo(e){e.userData.originalPos=e.position.clone(),e.userData.originalScale=e.scale.clone(),e.userData.originalRot=e.rotation.clone(),Eo(e,rs,`x`,-1),e.scale.set(0,0,0),e.rotation.z+=.1*Math.PI*2,e.visible=!0}function xo(e,t,n=0){let r=e.objectMap.get(`blackholeScene`);if(!r.userData.originalPos||!r.userData.originalScale||!r.userData.originalRot)return;let i=r.position.clone(),a=r.userData.originalPos,o=r.scale.clone(),s=r.userData.originalScale,c=r.rotation.z,l=r.userData.originalRot.z,u=t*2,d={t:0};new v.Tween(d).to({t:2},u).easing(v.Easing.Linear.None).delay(n).onUpdate(()=>{let t=d.t;if(t<=1){let e=v.Easing.Back.Out(t);r.position.lerpVectors(i,a,e)}else{r.position.copy(a),e.fireflies.material.uniforms.uSizeFactor.value=1;let n=Math.min(t-1,1),i=v.Easing.Back.Out(n);r.scale.lerpVectors(o,s,i);let u=v.Easing.Back.InOut(n);r.rotation.z=c+(l-c)*u}}).onComplete(()=>{r.position.copy(a),r.scale.copy(s),r.rotation.z=l,new v.Tween(e.fireflies.material.uniforms.uKamikazeScale).to({value:1},t).easing(v.Easing.Cubic.In).start()}).start()}function So(e){let t=e.objectMap.get(`planeSky`);t&&(t.visible=!1);let n=e.objectMap.get(`blackholeScene`);n&&bo(n),[`rightWall-cover`,`a-char`,`stool`,`stool_bound`,`floor`,`moon`,`planeSky`].forEach(t=>{let n=e.getObjectByName(t);if(n){Co(n);let e=t===`a-char`||t===`stool`||t===`stool_bound`;t!==`floor`&&t!==`moon`&&!e?(n.position.set(0,-rs,0),n.visible=!1):e?(n.visible=!0,n.scale.setScalar(1e-4)):n.visible=!1}}),To(e).forEach(e=>{/^book\d+$/.test(e.name)?Co(e,{fixedAxis:`x`,fixedDirection:1,enableSpin:!0,ignoreAxisOffset:!1}):Co(e,{fixedAxis:`x`,fixedDirection:-1,ignoreAxisOffset:!1})})}function Co(e,t={}){let{fixedAxis:n=null,fixedDirection:r=null,enableSpin:i=!1,ignoreAxisOffset:a=!1}=t;e.userData.originalPos=e.position.clone(),e.userData.originalScale=e.scale.clone(),e.userData.originalRot=e.rotation.clone();let o=r===null?Math.random()>.5?1:-1:r;if(a?Do(e,rs,n,o):Eo(e,rs,n,o),i){let t=(Math.random()*50+50)*(Math.PI*2),n=Math.random()>.5?1:-1;e.rotation.y+=t*n}e.scale.set(0,0,0),e.visible=!0,e.userData.hidePos=e.position.clone(),e.userData.hideScale=e.scale.clone(),e.userData.hideRot=e.rotation.clone(),e.name}function wo({obj:e,duration:t,delay:n=0,enableSpin:r=!1,easing:i=v.Easing.Cubic.Out}){if(!e.userData.originalPos)return;let a=e.position.clone(),o=e.scale.clone(),s=e.rotation.clone(),c=e.userData.originalPos,l=e.userData.originalScale,u=e.userData.originalRot,d=e.castShadow,f=e.receiveShadow,p=e.matrixAutoUpdate,m=e.frustumCulled;e.castShadow=!1,e.receiveShadow=!1,e.matrixAutoUpdate=!1,e.frustumCulled=!1;let h={t:0};new v.Tween(h).to({t:1},t).delay(n).easing(v.Easing.Linear.None).onUpdate(()=>{let t=h.t,n=i(Math.min(t/.7,1));e.position.lerpVectors(a,c,n);let d=Math.max(0,(t-.2)/.6),f=v.Easing.Back.Out(Math.min(d,1));if(e.scale.lerpVectors(o,l,f),r){let n=Math.max(0,(t-.4)/.6),r=v.Easing.Quadratic.Out(Math.min(n,1));e.rotation.x=s.x+(u.x-s.x)*r,e.rotation.y=s.y+(u.y-s.y)*r,e.rotation.z=s.z+(u.z-s.z)*r}e.updateMatrix()}).onComplete(()=>{e.castShadow=d,e.receiveShadow=f,e.matrixAutoUpdate=p,e.frustumCulled=m,e.position.copy(c),e.scale.copy(l),e.rotation.copy(u),e.updateMatrix(),e.updateMatrixWorld(!0)}).start()}function To(e){if(e.assembleGroups)return e.assembleGroups;let t=e.children.filter(t=>!t.name||t.isCamera||t.isLight||t.isBone||t.name===`roomGLBModel`||t===e||t.name===`HUDFrame`||is.includes(t.name)||/^dragonBall\d+Stars$/.test(t.name)||/^Ch23_/.test(t.name)||/^mixamorig/.test(t.name)||/^BTC_/.test(t.name)||/^ETH_/.test(t.name)?!1:t.isObject3D);return t.sort((e,t)=>{let n=e=>e.material?Array.isArray(e.material)?e.material[0].uuid:e.material.uuid:``;return n(e).localeCompare(n(t))}),e.assembleGroups=t,t}function Eo(e,t,n=null,r=1){let i=[`x`,`y`,`z`],a=n;(!a||!i.includes(a))&&(a=i[Math.floor(Math.random()*3)]),a===`y`&&(r=1),e.position[a]+=t*r}function Do(e,t,n=null,r=1){let i=[`x`,`y`,`z`],a=n;(!a||!i.includes(a))&&(a=i[Math.floor(Math.random()*3)]),a===`y`&&(r=1),e.position[a]+=t*r;let o=t*.5;i.filter(e=>e!==a).forEach(t=>{let n=Math.random()>.5?1:-1;t===`y`&&(n=1),e.position[t]+=o*n})}function X(e,t){if(!t)return null;if(e.objectMap||Ao(e),e.objectMap.has(t))return e.objectMap.get(t);let n=e.getObjectByName(t);return n&&e.objectMap.set(t,n),n}function Oo(e,t){!t||!t.name||(e.objectMap||Ao(e),e.objectMap.set(t.name,t))}function ko(e,t){e.objectMap&&e.objectMap.delete(t)}function Ao(e){let t=new Map;return e.traverse(e=>{e.name&&t.set(e.name,e)}),e.objectMap=t,t}async function jo(){let e=document.getElementById(`progress-text`),t=document.getElementById(`progress-bar`),n=document.getElementById(`cv-container`);e&&(e.innerText=R(`SYS_READY`)),t&&(t.parentElement.style.opacity=`0`),n&&n.classList.add(`collapsed`);let r=document.getElementById(`main-ui`);r&&(r.style.opacity=`0`),await No(200)}async function Mo(){let e=document.getElementById(`loading-container`),t=document.querySelector(`.loader-content`);if(t&&(t.style.transition=`opacity 0.5s ease`,t.style.opacity=`0`),e){await No(100),e.style.transition=`opacity 0.4s ease`,e.style.opacity=`0`,await No(400),e.style.display=`none`;let t=document.getElementById(`main-ui`);t&&(t.style.transition=`opacity 1s ease`,t.style.opacity=`1`)}}function No(e){return new Promise(t=>setTimeout(t,e))}async function Po(t,n={}){let{duration:r=3e3,delay:i=0,onStart:a,onComplete:o}=n,s=t.getObjectByName(`drone`);if(!s){console.error(`Drone not found`);return}return new Promise(n=>{let c=s.position.clone(),l=new e.Vector3(9,1,-1.3),u=new e.Vector3(-1,9,-5);cs=u;let d=new e.CatmullRomCurve3([c,l,u],!1,`centripetal`),f=s.quaternion.clone(),p=new e.Euler(-Math.PI/2,.2,1.25),m=new e.Quaternion().setFromEuler(p),h=new e.Quaternion().setFromAxisAngle(new e.Vector3(1,0,0),Math.PI/2);m.multiply(h);let g={val:0},_=new e.Quaternion;new v.Tween(g).to({val:1},r).delay(i).easing(v.Easing.Quadratic.InOut).onStart(()=>{let e=new Ue(s);e.init(),t.gazeFollower=e,a&&a()}).onUpdate(()=>{if(t._spawnStopSignal){g.val=1;return}let e=d.getPoint(g.val);s.rapierBody.setNextKinematicTranslation(e),_.copy(f).slerp(m,g.val);let n=t.world;if(n&&!n.isBusy)try{let e=n.isBusy;n.isBusy=!0,s.rapierBody.setRotation({x:_.x,y:_.y,z:_.z,w:_.w},!0),n.isBusy=e}catch(e){console.error(`[Scenario] Rapier failed to set rotation @CurveAnim:`,e.message),e.message.includes(`recursive`)&&console.trace(`[Scenario] Recursive WASM call trace @CurveAnim:`)}}).onComplete(()=>{if(t._spawnStopSignal){n();return}t.world&&!t.world.isBusy&&(s.rapierBody.setTranslation({x:u.x,y:u.y,z:u.z},!0),s.rapierBody.setRotation({x:m.x,y:m.y,z:m.z,w:m.w},!0)),o&&o(),n()}).start()})}function Fo(e){e.globalUniformsHub.uStormSharpness.value=0}function Io(e){e.globalUniformsHub.enableLightning.value=!1,e.globalUniformsHub.uRainHeaviness.value=0,e.globalUniformsHub.glassRainAmount.value=0,e.globalUniformsHub.rainGlassOpacity.value=0}function Lo(e){let t=e.getObjectByName(`floor`),n=e.getObjectByName(`Object_0003_3`),r=e.getObjectByName(`Object_12001`);t?.material&&(t.material.envMapIntensity=.1),n?.material&&(n.material.envMapIntensity=.7),r?.material&&(r.material.envMapIntensity=0),e.environmentIntensity=.4}function Ro(e){Fo(e),Io(e),Lo(e)}function zo(e,t=12e3){let n=e.globalUniformsHub,r=t,i=v.Easing.Linear.None,a={val:0},o=new v.Tween(a).to({val:1},r).easing(i).onUpdate(()=>{e.globalUniformsHub.glassRainAmount.value=a.val,e.globalUniformsHub.rainGlassOpacity.value=a.val}),s=new v.Tween(n.uMoonPosition.value).to({x:`+0.001`,y:`+0.05`},r*2).easing(i),c=new v.Tween(n.uMoonSize).to({value:n.uMoonSize.value*.65},r*2).easing(i),l={t:0};new v.Tween(l).to({t:1},r).easing(i).onUpdate(()=>{e.globalUniformsHub.uStormSharpness.value=l.t,e.globalUniformsHub.uRainHeaviness.value=l.t*.75}).onStart(()=>{setTimeout(()=>{o.start(),s.start(),c.start()},r*.4)}).onComplete(()=>{}).start()}async function Bo(t,n=3e3){let r=t.objectMap.get(`bulb`);if(!r)return;let i=new e.Vector3(1,1,1),a=new e.Vector3(0,9.2,0),o=r.rotation.clone(),s=r.getObjectByName(`bulbLight`);s||(s=t.getObjectByName(`bulbLight`)||t.bulbLight,s&&r&&(r.attach(s),s.position.set(0,0,0),s.target&&(r.add(s.target),s.target.position.set(0,-10,0))));let c=s?s.intensity:0,l=s?s.distance:0,u=new e.Vector3(0,0,0);t.objectMap.get(`Lathe_Center`);let d=new e.Vector3;d.copy(r.position),r.position.copy(d),r.visible=!0,r.scale.setScalar(0),r.material.visible=!0,s&&s.parent!==r&&(r.add(s),s.target&&r.add(s.target),s.position.set(0,0,0),s.target.position.set(0,-10,0));let f=r.getObjectByName(`bulbAura`);f&&(f.visible=!0);let p={t:0},m=t.animations[1],h=t.mixer.clipAction(m);h.reset(),h.play(),new v.Tween(p).to({t:1},n).easing(v.Easing.Back.Out).onStart(()=>{}).onUpdate(()=>{let t=p.t;r.scale.lerpVectors(u,i,t),s&&(s.intensity=e.MathUtils.lerp(c,1e3,t),s.distance=e.MathUtils.lerp(l,25,Math.min(t*5,1))),r.position.lerpVectors(d,a,t);let n=Math.sin(t*Math.PI)*1.5,f=-t*Math.PI*2*4;r.position.y+=Math.cos(f)*n,r.position.z+=Math.sin(f)*n;let m=(1-t)*Math.PI*2*4;r.rotation.set(o.x+m,o.y+m*.5,o.z)}).onComplete(()=>{t.raycasterEnabled=!0,Z(`Scenario Stable. System interactions re-enabled.`),s&&new v.Tween(s).to({intensity:800},3e3).easing(v.Easing.Back.Out).start(),t._spawnStopSignal||(!t.dragonBalls||t.dragonBalls.length===0)&&Vo(t,r)}).start()}function Vo(t,n){t.dragonBalls&&t.dragonBalls.length>0&&t.dragonBalls.forEach(e=>{e.parent&&e.parent.remove(e),t.remove(e)}),t.dragonBalls=[],setTimeout(()=>{Z(`The Dragon Balls descend...`);for(let r=1;r<=7;r++){let i=()=>{if(t._spawnStopSignal)return;if(t.world.isBusy){setTimeout(i,16);return}let a=cr(t,r);if(!a){setTimeout(i,16);return}let o=new e.Vector3;n.getWorldPosition(o),o.y-=.5,o.x+=(Math.random()-.5)*.2,o.z+=(Math.random()-.5)*.2,a.position.copy(o),a.userData.originalPos=a.position.clone(),a.userData.originalScale=a.scale.clone(),a.userData.originalRot=a.rotation.clone(),a.rapierBody&&(a.rapierBody.setTranslation(o,!0),a.rapierBody.wakeUp()),a.userData.oscStrength=2;let s=a.children.find(e=>e.name.startsWith(`Aura`));s&&(s.userData.oscStrength=2);let c=e=>{e.onBeforeRender=function(e,t,n,r,i,a){i.uniforms&&i.uniforms.uOscillationStrength&&(this.userData.prevOsc=i.uniforms.uOscillationStrength.value,i.uniforms.uOscillationStrength.value=this.userData.oscStrength)},e.onAfterRender=function(e,t,n,r,i,a){i.uniforms&&i.uniforms.uOscillationStrength&&(i.uniforms.uOscillationStrength.value=this.userData.prevOsc)}};c(a),s&&c(s);let l=a.scale.clone(),u=.1;if(a.scale.multiplyScalar(u),Me(t,a,a.rapierBody,a.rapierShape),a.rapierBody){let e=a.rapierBody.mass(),t=(Math.random()>.5?1:-1)*(.7+Math.random());a.rapierBody.applyImpulse({x:1.6*e,y:0,z:t*e},!0)}let d=.5;a.rapierShape&&a.rapierShape.radius&&l.x>0&&(d=a.rapierShape.radius/l.x),a.rapierCollider.setRadius(a.scale.x*d),setTimeout(()=>{let e=4500,t=l.clone().multiplyScalar(u),n={t:0};new v.Tween(n).to({t:1},e).easing(v.Easing.Cubic.Out).onUpdate(()=>{let e=n.t;if(a.scale.lerpVectors(t,l,e),a.rapierCollider)try{typeof a.rapierCollider.setRadius==`function`&&a.rapierCollider.setRadius(a.scale.x*d)}catch{}}).start();let r={t:0};new v.Tween(r).to({t:1},e).easing(v.Easing.Exponential.In).onUpdate(()=>{let e=2*(1-r.t);a.userData.oscStrength=e,s&&(s.userData.oscStrength=e)}).start()},3e3)};setTimeout(i,r*300)}let r=8*300;setTimeout(()=>{Z(`Point Gravity System Online.`),t.world&&(t.world.hasPointGravityOnBalls=!0)},r+3e3),setTimeout(()=>{let n=t.getObjectByName(`cFanBulb`),r=t.getObjectByName(`bulb`),i=t.getObjectByName(`bulbLight`);if(!n||!r)return;if(i){n.attach(i),i.position.set(0,0,0);let r=new e.Vector3;i.getWorldPosition(r),t.add(i.target),i.target.position.set(r.x,r.y-10,r.z)}let a=new e.Vector3;r.getWorldPosition(a);let o=new e.Vector3;n.getWorldPosition(o),r.scale.x,new v.Tween(r.scale).to({x:.1,y:.1,z:.9},2e3).easing(v.Easing.Cubic.In).start(),new v.Tween(r.position).to(o,2e3).easing(v.Easing.Cubic.In).start().onComplete(()=>{r.visible=!1,K&&K.uniforms&&K.uniforms.glowIntensity&&new v.Tween(K.uniforms.glowIntensity).to({value:1},500).easing(v.Easing.Quadratic.Out).start(),K&&K.uniforms&&K.uniforms.glowPower&&new v.Tween(K.uniforms.glowPower).to({value:.015},500).easing(v.Easing.Quadratic.Out).start(),Z(`Power transferred to ceiling array.`),new v.Tween(r.scale).to({x:.1,y:.1,z:.1},500).easing(v.Easing.Quadratic.Out).onComplete(()=>{r.visible=!1}).start()}).start()},r)},100)}function Ho(t,n={}){let{duration:r=2e3,delay:i=0,onComplete:a}=n,o=new e.Object3D;o.name=`testObj`,t.add(o);let s=t.getObjectByName(`mjolnir_low_mjolnir_hammer_0`);if(!s.isFlying)if(s.isFlying=!0,s&&s.rapierBody){Z(`Boomerang Mjolnir initiated`);let n=s.userData.originalPos,o=s.userData.originalRot;if(!n||!o){console.error(`Mjolnir missing userData.originalPos/Rot`);return}let c=new e.Vector3(-1.5,9,7.3),l=new e.Vector3(-20,15,30);s.rapierBody.setBodyType(b.RigidBodyType.KinematicPositionBased),s.rapierBody.isManualControl=!0,s.rapierBody.wakeUp(),s.rapierBody.setTranslation(l,!0);let u=new e.Quaternion(0,0,0,1),d=new e.Quaternion().setFromAxisAngle(new e.Vector3(0,0,1),Math.PI/2);u.multiply(d),s.rapierBody.setRotation(u,!0);let f=new e.Vector3(7,6,8),p=new e.Vector3(12,4,0),m=t.getObjectByName(`drone`),h=new e.Vector3(m.position.x,m.position.y,m.position.z),g=new e.CatmullRomCurve3([l,f,p,h,c],!1,`centripetal`),_=null;s.rapierBody.numColliders()>0&&(_=s.rapierBody.collider(0),_.setSensor(!0)),s.userData.hitDrone=!1;let y={val:0};new v.Tween(y).to({val:1},r).easing(v.Easing.Cubic.Out).delay(i).onUpdate(()=>{if(t._spawnStopSignal){y.val=1,s.isFlying=!1;return}let n=g.getPoint(y.val);s.rapierBody.setNextKinematicTranslation({x:n.x,y:n.y,z:n.z});let r=y.val*Math.PI*30,i=new e.Vector3(0,1,0),a=new e.Quaternion().setFromAxisAngle(i,r),o=u.clone().multiply(a);if(s.rapierBody.setNextKinematicRotation(o),m&&m.rapierBody&&!s.userData.hitDrone&&g.getPoint(y.val).distanceTo(m.position)<3){let n=m.quaternion.clone(),r=cs.clone();Z(R(Q.currentMode===F.POBA?`SYS_DRONE_SUBTITLES_POBA`:`SYS_DRONE_SUBTITLES_DEV`)),m.rapierBody.setBodyType(b.RigidBodyType.Dynamic),m.rapierBody.wakeUp(),m.rapierBody.applyImpulse({x:-100,y:75,z:-100},!0),m.rapierBody.applyTorqueImpulse({x:5,y:5,z:5},!0),s.userData.hitDrone=!0,setTimeout(()=>{if(t._spawnStopSignal)return;Z(R(Q.currentMode===F.POBA?`SYS_DRONE_SUBTITLES_POBA`:`SYS_DRONE_SUBTITLES_DEV`)),m.rapierBody.setBodyType(b.RigidBodyType.KinematicPositionBased);let i=m.position.clone(),a=m.quaternion.clone(),o={val:0};new v.Tween(o).to({val:1},2e3).easing(v.Easing.Back.Out).onUpdate(()=>{let t=new e.Vector3().lerpVectors(i,r,o.val),s=a.clone().slerp(n,o.val);m.rapierBody.setNextKinematicTranslation(t),m.rapierBody.setNextKinematicRotation(s)}).onComplete(async()=>{if(t._spawnStopSignal)return;m.rapierBody.setGravityScale(0),m.rapierBody.setLinvel({x:0,y:0,z:0},!0),m.rapierBody.setAngvel({x:0,y:0,z:0},!0),m.rapierBody.setBodyType(b.RigidBodyType.Fixed);let e=Q.currentMode===F.POBA?`SYS_DRONE_SUBTITLES_POBA`:`SYS_DRONE_SUBTITLES_DEV`;Z(R(e)),yi(t),await Jo(t,`welcome`,{scale:1.65,duration:2500,isAsync:!0}),await No(5500),!t._spawnStopSignal&&(ys(R(e)),t.cursorInformer&&t.cursorInformer.switchToOpacityMode&&t.cursorInformer.switchToOpacityMode())}).start()},2e3)}}).onComplete(()=>{Z(`Mjolnir Returned.`),s.rapierBody.setBodyType(b.RigidBodyType.Dynamic),s.rapierBody.isManualControl=!1,s.userData.originalPos=s.position.clone(),s.userData.originalRot=new e.Euler().setFromQuaternion(s.quaternion),_&&_.setSensor(!1),s.userData.hitDrone=!1,s.rapierBody.wakeUp(),s.isFlying=!1,a&&a()}).start()}else console.warn(`Mjolnir mesh or rapierBody not found`)}function Uo(t,n=`drone-beam`,r=null){let i=new e.Group;i.name=n;let a=r||I.ELECTRIC_CYAN||65535,o=(t,n,r,i)=>{let a=new e.CylinderGeometry(r,r,1,8,1,!0);a.rotateX(Math.PI/2),a.translate(0,0,.5);let o=new e.MeshBasicMaterial({color:n,transparent:!0,opacity:i,blending:e.AdditiveBlending,depthWrite:!1,side:e.DoubleSide}),s=new e.Mesh(a,o);return s.name=t,s};return i.add(o(`beam-core`,16777215,.005,1)),i.add(o(`beam-glow`,a,.015,.6)),i.add(o(`beam-outer`,I.ACCENT_GOLD||16763904,.03,.3)),i.frustumCulled=!1,t.add(i),i}function Wo(t,n,r=null,i=null){let a=new e.Group;a.position.copy(n),t.add(a);let o=new e.Group;r&&o.lookAt(r),a.add(o);let s=new e.IcosahedronGeometry(.1,0),c=[],l=i||[16777215,65535,35071,52479];for(let t=0;t<35;t++){let n=l[t%l.length],r=zt(n,1.2,2.5),i=new e.Mesh(s,r),a=Rt(n,1,.01,4,e.FrontSide),u=new e.Mesh(s,a);u.scale.setScalar(1.35),i.add(u);let d=Math.random()*Math.PI*2,f=Math.PI*.4*Math.random(),p=new e.Vector3(Math.sin(f)*Math.cos(d),Math.sin(f)*Math.sin(d),Math.cos(f)).multiplyScalar(.08+Math.random()*.12);i.userData.velocity=p,i.lookAt(p.clone().add(i.position)),i.scale.setScalar(.1+Math.random()*.5),o.add(i),c.push(i)}let u=new e.TorusGeometry(1,.015,8,32),d=Rt(l[1]||l[0],2,.01,4,e.DoubleSide),f=new e.Mesh(u,d);f.rotation.x=Math.PI/2,a.add(f);let p=l[0]||16777215,m=Rt(p,1.5,.01,4,e.DoubleSide),h=new e.Mesh(u,m);h.rotation.x=Math.PI/2,h.scale.setScalar(.5),a.add(h);let g=new e.SphereGeometry(.4,16,16),_=zt(p,1,4),y=new e.Mesh(g,_);a.add(y),new v.Tween({progress:0}).to({progress:1},1e3).easing(v.Easing.Quadratic.Out).onUpdate(e=>{let t=e.progress;c.forEach(e=>{e.position.add(e.userData.velocity);let n=1-t,r=1+t*4;e.scale.set((.3+Math.random()*.4)*n,(.3+Math.random()*.4)*n,(.4+Math.random()*.6)*n*r),e.material.uniforms&&(e.material.uniforms.glowIntensity.value=2.5*n);let i=e.children[0];i&&i.material.uniforms&&(i.material.uniforms.outerGlowStrength.value=1*n)});let n=.1+t*3.5;f.scale.set(n,n,1),f.material.uniforms.outerGlowStrength.value=2*(1-t);let r=.1+t*4.5;h.scale.set(r,r,1),h.material.uniforms.outerGlowStrength.value=1*(1-t);let i=Math.min(t*4,1)<.5?t*8:(1-t)*1.5;y.scale.setScalar(i),y.material.uniforms&&(y.material.uniforms.glowIntensity.value=2.5*(1-t))}).onComplete(()=>{t.remove(a),s.dispose(),u.dispose(),g.dispose(),c.forEach(e=>{e.material.dispose(),e.children[0]&&e.children[0].material.dispose()}),f.material.dispose(),h.material.dispose(),_.dispose()}).start()}function Go(t,n,r=!1,i=!1){let a=X(t,`drone`);if(!a||!t.gazeFollower)return;r&&(t.gazeFollower.isLocked=!0);let o=n;n instanceof e.Vector3&&(a.userData.gazeProxy||(a.userData.gazeProxy=new e.Object3D),a.userData.gazeProxy.position.copy(n),o=a.userData.gazeProxy),o&&(r&&(a.userData.lockTarget=o),t.gazeFollower.lookAtTarget(o,i))}function Ko(t,n,r=``,i=null,a=`drone-beam`,o=!1,s=null,c=!1,l=null,u=!1){let d=X(t,`drone`),f=d?d.getObjectByName(`Sphere001_0`):null;if(!f)return;let p=X(t,a);p||=Uo(t,a,s),p.activeRequestID&&cancelAnimationFrame(p.activeRequestID);let m=t.camera,h=new e.Vector3,g=new e.Vector3,_=i!==null,v=l===1/0,y;if(v)y=1/0;else if(l!==null)y=l;else{let e=_?400:1e3,t=_?600:3e3;y=_?500:Math.min(Math.max(r.length*50,e),t)}let b=performance.now();p.visible=!1;let x=e=>{p.children.forEach((t,n)=>{let r=n===0?1:n===1?.7:.4;t.material.opacity=e*r})},S=(e,t)=>{let n=e.distanceTo(t);p.position.copy(e),p.lookAt(t),p.children.forEach(e=>{e.scale.z=n})},C=()=>{let e=performance.now(),r=e-b,a=Math.min(r/y,1);if(a<1){let r=!1;_?(g.copy(i),r=!0):n&&n.isMesh&&(n.getWorldPosition(g),r=!0),r?(f.getWorldPosition(h),u||(S(h,g),o||Go(t,g,!0)),p.visible=!0,_&&a<.1&&!p.hitTriggered&&!c&&(Wo(t,g,h,s?[16777215,s,s]:null),p.hitTriggered=!0)):p.visible=!1;let l=.7+Math.sin(e*.08)*.3,d;d=v?1:_?a<.2?a*5:1-(a-.5)*2:1-a**2,x(l*Math.max(0,d)),p.activeRequestID=requestAnimationFrame(C)}else p.visible=!1,x(0),p.activeRequestID=null,p.hitTriggered=!1,t.gazeFollower&&!d.userData.isHovering&&(t.gazeFollower.isLocked=!1,t.gazeFollower.lookAtTarget(m))};p.hitTriggered=!1,p.activeRequestID=requestAnimationFrame(C)}function qo(t,n=0){let r=xe[n];if(!r){console.error(`Scenario state index ${n} not found`);return}if(t.scenarioState=r,r.ui&&(r.ui.cursorInformer!==void 0&&(t.cursorInformerEnabled=r.ui.cursorInformer,t.cursorInformer&&(r.ui.cursorInformer?t.cursorInformer.show?t.cursorInformer.show():t.cursorInformer.style.display=`block`:t.cursorInformer.hide?t.cursorInformer.hide():t.cursorInformer.style.display=`none`)),r.ui.subtitle===!1&&(Z(``),bs(!0)),r.ui.personaButton3D===!1&&window.boneTracker&&typeof window.boneTracker.forceReset==`function`&&window.boneTracker.forceReset()),r.environment){let n=t.domElement;n&&(r.environment.cssBackground?n.style.background=r.environment.cssBackground:r.environment.background&&(n.style.background=r.environment.background)),r.environment.sceneBackground!==void 0&&(r.environment.sceneBackground===null?t.background=null:t.background=new e.Color(r.environment.sceneBackground))}if(t.renderer){if(!t.isTransitioning){let e=(window.devicePixelRatio||1)*(r.pixelRatioScale===void 0?1:r.pixelRatioScale);t.renderer.setPixelRatio(e),t.points&&typeof t.points.onWindowResize==`function`&&t.points.onWindowResize()}r.toneMappingExposure!==void 0&&(t.renderer.toneMappingExposure=r.toneMappingExposure)}if(t.HUD&&t.HUD.material.uniforms&&r.hudUniforms){let e=3e3,n=v.Easing.Quadratic.Out;for(let[i,a]of Object.entries(r.hudUniforms)){let r=t.HUD.material.uniforms[i];r&&(r._currentTween&&r._currentTween.stop(),a&&a.isColor?r._currentTween=new v.Tween(r.value).to({r:a.r,g:a.g,b:a.b},e).easing(n).start():typeof a==`number`?r._currentTween=new v.Tween(r).to({value:a},e).easing(n).start():r.value=a)}}}function Jo(t,n=`welcome`,r={}){let{scale:i=null,rotation:a=null,position:o=null,duration:s=2e3,isAsync:c=!1,scanline:l=1}=r,u=t.globalUniformsHub&&t.globalUniformsHub.uniforms||t.constantUniform;if(!u||!u.uWelcomeProgress){console.warn(`Welcome Text uniforms not found on scene`);return}i!==null&&u.uWelcomeScale&&(u.uWelcomeScale.value=i),a!==null&&u.uWelcomeRotation&&(u.uWelcomeRotation.value=a),o!==null&&u.uWelcomePosition&&(o instanceof e.Vector2?u.uWelcomePosition.value.copy(o):o.x!==void 0&&o.y!==void 0&&u.uWelcomePosition.value.set(o.x,o.y)),u.uWelcomeScanline&&(u.uWelcomeScanline.value=l),u.uWelcomeOpacity&&(u.uWelcomeOpacity.value=1),u.uWelcomeGlow&&(u.uWelcomeGlow.value=0),u.uWelcomeProgress&&(u.uWelcomeProgress.value=0);let d=new v.Tween(u.uWelcomeProgress).to({value:1},s).easing(v.Easing.Linear.None),f=new v.Tween(u.uWelcomeGlow).to({value:5.2},500).repeat(3).yoyo(!0).easing(v.Easing.Quadratic.InOut),p=new v.Tween(u.uWelcomeOpacity).to({value:0},1e3).delay(4e3).easing(v.Easing.Quadratic.In).onComplete(()=>{u.uWelcomeProgress.value=0,u.uWelcomeGlow.value=0});return d.chain(f),f.chain(p),d.start(),c?new Promise(e=>d.onComplete(e)):d}async function Yo(t,n=800){let r=t.isLowPowerMode,i=r?n*.6:n;zi(t),t._spawnStopSignal=!1,t._assembleCount===void 0&&(t._assembleCount=0),t._assembleCount++,t.renderer&&(t.renderer.shadowMap&&(t.renderer.shadowMap.autoUpdate=!1),mo(t)),t.isTransitioning=!0,t.raycasterEnabled=!1,t.world&&(t.world.isActive=!1),os(t);try{t._assembleCount<=1?(PerformanceLogger.start(`Tween Blackhole`),xo(t,i),PerformanceLogger.end(`Tween Blackhole`)):setTimeout(()=>{xo(t,i)},400),t.HUD&&typeof t.HUD.tweenGardenMode==`function`&&t.HUD.tweenGardenMode(!0,i),PerformanceLogger.start(`Tween Remaining Objects`),await _o(t,i),PerformanceLogger.end(`Tween Remaining Objects`),t.points&&t.points.bloomPass&&new v.Tween(t.points.bloomPass).to({strength:r?.8:1,threshold:.21,radius:.4},i).easing(v.Easing.Cubic.Out).start(),t.HUD&&t.HUD.material.uniforms.uIsGardenFlower&&(t.HUD.material.uniforms.uIsGardenFlower.value=1),t.renderer&&(t.renderer.toneMappingExposure=.25),t.points&&t.points.bloomPass&&(t.points.bloomPass.threshold=.21,t.points.bloomPass.strength=1),t.background=new e.Color(0),await No(200),Bo(t),setTimeout(async()=>{await ho(t,.2,.625,800),t.isTransitioning=!1,await No(4e3),t.windowLight&&(t.windowLight.intensity=1e7,await No(40),t.windowLight.intensity=0)},800)}finally{}Z(R(`ENV_ATMOS_INIT`)),zo(t,ns*.6),PerformanceLogger.start(`Sync Bodies`),t.rapierWorldWrapper&&t.rapierWorldWrapper.syncBodiesToMeshes&&t.rapierWorldWrapper.syncBodiesToMeshes(),PerformanceLogger.end(`Sync Bodies`),Z(R(`SYS_PHYSICS_INIT`)),Z(R(`SYS_DRONE_START`)),Po(t,{duration:r?2e3:3e3,delay:r?1500:2500,onStart:()=>{},onComplete:()=>{Ho(t,{duration:r?2e3:4e3,onComplete:()=>{_i(t);let e=t.getObjectByName(`wallArea`);e&&e.material&&e.material.uniforms&&e.material.uniforms.uEyeActive&&(e.material.uniforms.uEyeActive.value=!0,qa(t),setTimeout(()=>{e&&e.material&&e.material.uniforms&&Ja(t)},3e3)),t.HUD&&typeof t.HUD.runTweenShowIsland==`function`&&t.HUD.runTweenShowIsland(r?2500:3e3),fo.onRoomAssemble(t),window.cvReset&&window.cvReset(1500),t.HUD&&typeof t.HUD.runTweenShowDecos==`function`&&t.HUD.runTweenShowDecos()}});let e=t.getObjectByName(`planeSky`);e&&(e.visible=!0),setTimeout(()=>{za(t,{forcedX:.65,environmentRatio:1,delay:0})},600)}}),await No(r?1e3:2e3),t.renderer&&setTimeout(()=>{},500),setTimeout(()=>{t.raycasterEnabled=!0,t.targetAnimHz=51},r?5500:9e3),t.globalUniformsHub.enableLightning.value=!0,t.renderer&&(window.devicePixelRatio||1)*(xe[1].pixelRatioScale||.625)}async function Xo(e,t=1500){bi(e),ts(e),e._spawnStopSignal=!0,Z(``),bs(!0),e.gazeFollower&&typeof e.gazeFollower.stop==`function`&&e.gazeFollower.stop(),e.world&&(e.world.isActive=!1,e.world.hasPointGravityOnBalls=!1),e.windowLight&&(e.windowLight.intensity=0),window.boneTracker&&typeof window.boneTracker.forceReset==`function`&&window.boneTracker.forceReset(),Zo(e,t),qo(e,0),e.renderer,e.pointsApp&&(e.pointsApp.points.visible=!0)}function Zo(e,t=1500){let n=e.getObjectByName(`roomGLBModel`);if(!n)return;let r=Array.from(n.children),i=r.length,a=0,o=()=>{let e=Math.min(a+20,i);for(let n=a;n<e;n++){let e=r[n];if(e.userData.scenarioTween&&(e.userData.scenarioTween.stop(),e.userData.scenarioTween=null),e.userData.originalPos){let n=t+Math.random()*500;new v.Tween(e.position).to({x:e.userData.hidePos?.x||0,y:e.userData.hidePos?.y||-rs,z:e.userData.hidePos?.z||0},n).easing(v.Easing.Cubic.In).onComplete(()=>{e.visible=!1}).start()}else e.visible=!1}a=e,a<i&&requestAnimationFrame(o)};requestAnimationFrame(o),new v.Tween(n.scale).to({x:0,y:0,z:0},t).easing(v.Easing.Cubic.In).onComplete(()=>{n.visible=!1}).start(),[`rightWall-cover`,`a-char`,`stool`,`floor`,`planeSky`].forEach(n=>{let r=e.getObjectByName(n);if(r){let e=r.userData.hidePos||{x:0,y:-rs,z:0};new v.Tween(r.position).to(e,t).easing(v.Easing.Cubic.In).onComplete(()=>{r.visible=!1}).start(),new v.Tween(r.scale).to({x:0,y:0,z:0},t).easing(v.Easing.Cubic.In).start()}}),e.physicObjects&&e.physicObjects.forEach(e=>{e.userData.scenarioTween&&(e.userData.scenarioTween.stop(),e.userData.scenarioTween=null);let n=e.userData;if(n.hidePos){let r=t+Math.random()*500;e.userData.scenarioTween=new v.Tween(e.position).to({x:n.hidePos.x,y:n.hidePos.y,z:n.hidePos.z},r).easing(v.Easing.Cubic.In).onComplete(()=>{e.visible=!1,e.userData.scenarioTween=null}).start()}else e.visible=!1;e.userData.originalScale&&new v.Tween(e.scale).to({x:0,y:0,z:0},t).start()}),e.points&&e.points.bloomPass&&new v.Tween(e.points.bloomPass).to({strength:1.5,radius:.4,threshold:.85},t).easing(v.Easing.Quadratic.Out).start()}function Qo(e){yi(e),e.world.isActive=!0,go(e,1500,!0)}async function $o(t,n=500){t.globalUniformsHub.enableLightning.value=!1,bi(t),window.cvReset&&window.cvReset(1500),ss(t),Ri(t);let r=[];t.children.forEach(e=>{e.userData.hidePos&&(r.includes(e)||es(e,n))});let i=t.getObjectByName(`roomGLBModel`);if(i&&(i.children.forEach(e=>{es(e,n)}),new v.Tween(i.scale).to({x:0,y:0,z:0},n).easing(v.Easing.Cubic.In).onComplete(()=>{i.visible=!1}).start()),t.camera&&t.orbitControls){let r={x:61.56,y:2.97,z:30},i=new e.Vector3(0,0,0);new v.Tween(t.camera.position).to(r,n*3).easing(v.Easing.Cubic.Out).onUpdate(()=>{t.camera.lookAt(i),t.orbitControls.target.copy(i)}).start(),new v.Tween(t.orbitControls.target).to({x:0,y:0,z:0},n*3).easing(v.Easing.Cubic.Out).start()}let a=new v.Tween(t.fireflies.material.uniforms.uKamikazeScale).to({value:1},n).easing(v.Easing.Cubic.In);new v.Tween(t.fireflies.material.uniforms.uSizeFactor).to({value:0},n).easing(v.Easing.Cubic.In).chain(a).onComplete(o).start();function o(){new v.Tween(t.points.bloomPass).to({strength:1.5,threshold:.85,radius:.4},800).easing(v.Easing.Quadratic.Out),new v.Tween(t.points.bloomPass).to({strength:12,threshold:0,radius:1},400).easing(v.Easing.Quadratic.In).onComplete(()=>{ts(t),qo(t,0),t.isTransitioning=!1,t.pointsApp&&(t.pointsApp.points.visible=!0,typeof t.pointsApp.setScrollLock==`function`&&t.pointsApp.setScrollLock(!0),typeof t.pointsApp.triggerStep==`function`&&t.pointsApp.triggerStep(1,1500,!0),typeof t.HUD.tweenGardenMode==`function`&&t.HUD.tweenGardenMode(!1,1500),typeof t.HUD.runTweenShowDecos==`function`&&t.HUD.runTweenShowDecos(1500));let e=document.getElementById(`board`);e&&(e.style.display=``,e.classList.remove(`mode-room`),window.fitBoardTexts&&(window.__boardScale=1,window.__boardSubProgress=0,window.fitBoardTexts(1,0)));let n=document.querySelectorAll(`.nav-modules .nav-item`);n.forEach(e=>e.classList.remove(`active`));let r=Array.from(n).find(e=>e.getAttribute(`data-target`)===`cv-header`);r&&r.classList.add(`active`),new v.Tween(t.points.bloomPass).to({strength:1.5,threshold:.85,radius:.5},1200).easing(v.Easing.Cubic.Out).onComplete(()=>{t.isTransitioning=!1,t.points&&t.points.bloomPass&&(t.points.bloomPass.threshold=.85,t.points.bloomPass.strength=1.5)}).start()}).start()}}function es(e,t,n){if(e.userData.hidePos){let r=t+Math.random()*500;new v.Tween(e.position).to({x:e.userData.hidePos.x,y:e.userData.hidePos.y,z:e.userData.hidePos.z},r).easing(v.Easing.Cubic.In).onComplete(()=>{e.visible=!1,n&&n()}).start(),e.userData.hideRot&&new v.Tween(e.rotation).to({x:e.userData.hideRot.x,y:e.userData.hideRot.y,z:e.userData.hideRot.z},r).easing(v.Easing.Cubic.In).start(),e.userData.hideScale&&new v.Tween(e.scale).to({x:e.userData.hideScale.x,y:e.userData.hideScale.y,z:e.userData.hideScale.z},r).easing(v.Easing.Cubic.In).start()}}function ts(e){let t=e.getObjectByName(`drone`);t&&t.userData.hidePos&&(t.position.copy(t.userData.hidePos),t.visible=!1);let n=e.getObjectByName(`mjolnir_low_mjolnir_hammer_0`);n&&(n.userData.hidePos&&(n.position.copy(n.userData.hidePos),n.visible=!1),n.isFlying=!1),e.dragonBalls&&(e.dragonBalls.forEach(t=>{if(t.rapierBody&&e.world&&e.world.physics&&e.world.physics.removeRigidBody(t.rapierBody),t.geometry&&t.geometry.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(e=>e.dispose()):t.material.dispose()),[e.physicObjects,e.physicsControlledObjects,e.bhTargets].forEach(e=>{if(e){let n=e.indexOf(t);n!==-1&&e.splice(n,1)}}),e.physicBodies&&t.rapierBody){let n=e.physicBodies.indexOf(t.rapierBody);n!==-1&&e.physicBodies.splice(n,1)}t.parent&&t.parent.remove(t)}),e.dragonBalls=[],e.world&&(e.world.ballBodies=[]));let r=e.getObjectByName(`bulb`)||e.bulb;r&&(r.visible=!1,r.traverse(e=>{e.visible=!1,e.isLight&&(e.intensity=0)}));let i=e.getObjectByName(`bulbLight`)||e.bulbLight;i&&(i.intensity=.001,i.distance=0,i.visible=!0);let a=e.getObjectByName(`Object_120`);if(a&&a.material&&a.material.uniforms){let e=a.material;e.uniforms.glowPower&&(e.uniforms.glowPower.value=0),e.uniforms.glowIntensity&&(e.uniforms.glowIntensity.value=0)}e.background=null,e._spawnStopSignal=!0,zi(e),typeof bs==`function`&&bs(),e.conversationManager&&typeof e.conversationManager.clear==`function`&&e.conversationManager.clear(),e.children.forEach(e=>{e&&e.name&&(e.name.toLowerCase().includes(`beam`)||e.name.toLowerCase().includes(`aura`))&&(e.visible=!1,e.activeRequestID&&=(cancelAnimationFrame(e.activeRequestID),null))});let o=e.getObjectByName(`a-char`);o&&o.traverse(e=>{e&&e.name&&e.name.toLowerCase().includes(`beam`)&&(e.visible=!1,e.activeRequestID&&=(cancelAnimationFrame(e.activeRequestID),null))}),e.targetAnimHz=30}var ns,rs,is,as,os,ss,cs,ls=M((()=>{He(),We(),ao(),ks(),Ae(),Ns(),Te(),xr(),Di(),uo(),Sn(),po(),ci(),ea(),ns=15e3,rs=100,is=[`planeSky`,`blackholeScene`,`PointsCloud`,`bulb`,`bulbLight`,`a-char`,`stool`,`stool_bound`,`rightWall-cover`,`floor`],as=e=>yo(e,!0),os=e=>yo(e,!1),ss=e=>yo(e,!1)}));function us(t,n,r){let i=new e.Group;i.name=n;let a=r||65535,o=(t,n,r,i)=>{let a=new e.CylinderGeometry(n,n,1,6,1,!0);a.rotateX(Math.PI/2),a.translate(0,0,.5);let o=new e.MeshBasicMaterial({color:i,transparent:!0,opacity:r,blending:e.AdditiveBlending,depthWrite:!1,side:e.DoubleSide}),s=new e.Mesh(a,o);return s.name=t,s};return i.add(o(`beam-core`,.002,1,16777215)),i.add(o(`beam-glow`,.006,.5,a)),i.frustumCulled=!1,i}function ds(t){return new e.ShaderMaterial({uniforms:{iTime:{value:0},uColor:{value:new e.Color(t)},uOpacity:{value:.15},uBrightness:{value:1}},vertexShader:`
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,fragmentShader:`
            uniform float iTime;
            uniform vec3 uColor;
            uniform float uOpacity;
            uniform float uBrightness;
            varying vec2 vUv;

            #define R fract(43. * sin(dot(p, p)))

            void main() {
                // Digital Bit-Grid Logic
                vec2 i = vUv * 40.0; // Density
                vec2 j = fract(i);
                vec2 k = i - j;

                // Terminal-style "falling" staggered seed
                vec2 p = vec2(9.0, floor(iTime * (9.0 + 8.0 * sin(k.x)))) + k;
                
                float brightness = R;
                p *= j; // Modulate p for the block mask
                float mask = (R > 0.5 && j.x < 0.6 && j.y < 0.8) ? 1.0 : 0.0;
                
                // Edge fade & HUD style
                float fade = (1.0 - vUv.y);
                float finalAlpha = mask * uOpacity * fade;
                
                gl_FragColor = vec4(uColor * (brightness + 0.4) * uBrightness, finalAlpha);
            }
        `,transparent:!0,blending:e.AdditiveBlending,depthWrite:!1,side:e.DoubleSide})}function fs(t,n,r,i=.5){let{camera:a,renderer:o}=t;if(!a||!o)return new e.Vector3;let s=o.domElement.getBoundingClientRect(),c,l;r===`TL`?(c=n.left,l=n.top):r===`TR`?(c=n.right,l=n.top):r===`BL`?(c=n.left,l=n.bottom):r===`BR`?(c=n.right,l=n.bottom):r===`ScanTop`?(c=n.left+n.width/2,l=n.top):r===`ScanBot`&&(c=n.left+n.width/2,l=n.bottom);let u=(c-s.left)/s.width*2-1,d=-(l-s.top)/s.height*2+1,f=new e.Vector3(u,d,i);return f.unproject(a),f}function ps(t,n=2e3){let r=t.getObjectByName(`drone`);if(!r)return;let i=r.getObjectByName(`Sphere001_0`);if(!i)return;let a=document.querySelector(`#stat-subtitle.active`);if(!a)return;a.getBoundingClientRect();let o=I.ELECTRIC_CYAN||65535,s;for(;s=t.getObjectByName(`hologram-deployment`);)s._isDead=!0,t.remove(s),s.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.dispose()):e.material.dispose())});let c=new e.Group;c.name=`hologram-deployment`,t.add(c);let l={TL:new e.Vector3,TR:new e.Vector3,BL:new e.Vector3,BR:new e.Vector3},u=new e.Vector3;i.getWorldPosition(u);let d=ds(o),f=new e.BufferGeometry,p=new Float32Array(36),m=new Float32Array([.5,1,0,0,1,0,.5,1,0,0,1,0,.5,1,0,0,1,0,.5,1,0,0,1,0]);f.setAttribute(`position`,new e.BufferAttribute(p,3)),f.setAttribute(`uv`,new e.BufferAttribute(m,2));let h=new e.Mesh(f,d);c.add(h);let g=[`TL`,`TR`,`BL`,`BR`].map(e=>({beam:us(t,`pyramid-beam-${e}`,o),key:e}));g.forEach(e=>c.add(e.beam));let _=new e.BufferGeometry;_.setAttribute(`position`,new e.BufferAttribute(new Float32Array(9),3));let y=ds(o);y.uniforms.uOpacity.value=.2;let b=new e.Mesh(_,y);c.add(b);let x=[us(t,`tri-beam-top`,o),us(t,`tri-beam-bot`,o)];x.forEach(e=>c.add(e)),d.uniforms.uOpacity.value=.8,new v.Tween(d.uniforms.uOpacity).to({value:.15},150).delay(100).start();let S=!0;setTimeout(()=>{c._isDead||new v.Tween(d.uniforms.uOpacity).to({value:0},800).onUpdate(()=>{let e=d.uniforms.uOpacity.value;g.forEach(t=>{t.beam.children.forEach(t=>{t.material.opacity=e*(t.name===`beam-core`?1:.5)})})}).onComplete(()=>{S=!1,g.forEach(e=>{e.beam.visible=!1}),h.visible=!1}).start()},1500);let C=!0;setTimeout(()=>{c._isDead||new v.Tween(y.uniforms.uOpacity).to({value:0},800).onUpdate(()=>{let e=y.uniforms.uOpacity.value;x.forEach(t=>{t.children.forEach(t=>{t.material.opacity=e*(t.name===`beam-core`?1:.5)})})}).onComplete(()=>{C=!1,x.forEach(e=>e.visible=!1),b.visible=!1,t.gazeFollower&&t.gazeFollower.isLocked&&(t.gazeFollower.isLocked=!1)}).start()},n+200);let w=n=>{if(!a.classList.contains(`active`)||c._isDead){t.gazeFollower&&t.gazeFollower.isLocked&&(t.gazeFollower.isLocked=!1),t.remove(c);return}let r=a.getBoundingClientRect();if(i.getWorldPosition(u),C){let n=a.querySelector(`.scanner-line`);if(n){let r=n.getBoundingClientRect(),i=fs(t,r,`ScanTop`),a=fs(t,r,`ScanBot`),o=_.attributes.position.array;o[0]=u.x,o[1]=u.y,o[2]=u.z,o[3]=i.x,o[4]=i.y,o[5]=i.z,o[6]=a.x,o[7]=a.y,o[8]=a.z,_.attributes.position.needsUpdate=!0,Go(t,new e.Vector3().lerpVectors(i,a,.5),!0),x.forEach((e,t)=>{let n=t===0?i:a;e.position.copy(u),e.lookAt(n),e.children.forEach(e=>e.scale.z=u.distanceTo(n))})}}if(S){Object.keys(l).forEach(e=>l[e]=fs(t,r,e));let e=f.attributes.position.array,n=[l.TL,l.TR,l.BR,l.BL,l.TL];for(let t=0;t<4;t++){let r=t*9;e[r]=u.x,e[r+1]=u.y,e[r+2]=u.z,e[r+3]=n[t].x,e[r+4]=n[t].y,e[r+5]=n[t].z,e[r+6]=n[t+1].x,e[r+7]=n[t+1].y,e[r+8]=n[t+1].z}f.attributes.position.needsUpdate=!0,g.forEach(e=>{let t=l[e.key];e.beam.position.copy(u),e.beam.lookAt(t),e.beam.children.forEach(e=>e.scale.z=u.distanceTo(t))})}d.uniforms.iTime.value=n/1e3,y.uniforms.iTime.value=n/1e3,requestAnimationFrame(w)};requestAnimationFrame(w)}function ms(e){let t;for(;t=e.getObjectByName(`hologram-deployment`);)t._isDead=!0,e.remove(t),t.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.dispose()):e.material.dispose())});e.gazeFollower&&e.gazeFollower.isLocked&&(e.gazeFollower.isLocked=!1)}function hs(t,n,r){if(!n)return;let i=r||I.ELECTRIC_CYAN||65535;ms(t);let a=new e.Group;a.name=`hologram-deployment`,a.userData.targetObject=n,t.add(a);let o=new e.Vector3,s=new e.Vector3,c=ds(i);c.uniforms.uOpacity.value=.2;let l=new e.BufferGeometry,u=new Float32Array(36),d=new Float32Array([.5,0,0,1,1,1,.5,0,0,1,1,1,.5,0,0,1,1,1,.5,0,0,1,1,1]);l.setAttribute(`position`,new e.BufferAttribute(u,3)),l.setAttribute(`uv`,new e.BufferAttribute(d,2));let f=new e.Mesh(l,c);a.add(f);let p=[`TL`,`TR`,`BL`,`BR`].map(e=>({beam:us(t,`pyramid-beam-${e}`,i),key:e}));p.forEach(e=>a.add(e.beam));let m=null,h=t.getObjectByName(`btc_symbol`),g=t.getObjectByName(`eth_symbol`),_=n.name===`aegis2`||Math.random()>.5?g:h;if(_){m=_.clone(),m.name=`hologram-coin`;let e=ds(i);e.uniforms.uOpacity.value=.15,m.traverse(t=>{t.isMesh&&(t.material=e,t.castShadow=!1,t.receiveShadow=!1)}),m.scale.setScalar(_.scale.x*.8),a.add(m)}let v=new e.Box3,y=new e.Vector3,b=t=>{if(a._isDead||!n.parent)return;v.setFromObject(n),v.getSize(y),v.getCenter(o);let r=Math.max(y.x,y.z)*1.5;s.copy(o);let i=Math.sin(t/400)*.05,u=o.y+y.y*1.5+i,d={TL:new e.Vector3(o.x-r,u,o.z-r),TR:new e.Vector3(o.x+r,u,o.z-r),BL:new e.Vector3(o.x-r,u,o.z+r),BR:new e.Vector3(o.x+r,u,o.z+r)},f=l.attributes.position.array,h=[d.TL,d.TR,d.BR,d.BL,d.TL];for(let e=0;e<4;e++){let t=e*9;f[t]=s.x,f[t+1]=s.y,f[t+2]=s.z,f[t+3]=h[e].x,f[t+4]=h[e].y,f[t+5]=h[e].z,f[t+6]=h[e+1].x,f[t+7]=h[e+1].y,f[t+8]=h[e+1].z}l.attributes.position.needsUpdate=!0,p.forEach(e=>{let t=d[e.key];e.beam.position.copy(s),e.beam.lookAt(t),e.beam.children.forEach(e=>e.scale.z=s.distanceTo(t))}),m&&(m.position.set(o.x,o.y+y.y*.8+i*2,o.z),m.rotation.y+=.02,m.traverse(e=>{e.material&&e.material.uniforms&&(e.material.uniforms.iTime.value=t/1e3)})),c.uniforms.iTime.value=t/1e3,requestAnimationFrame(b)};requestAnimationFrame(b)}var gs=M((()=>{ls(),Te()}));function _s(){xs=document.getElementById(`stat-coords`),Ss=document.querySelector(`.frame_story-text`),Cs=document.getElementById(`stat-subtitle`),xs&&(xs.innerText=`00 FPS | 1.0 DPR | 000 DRC`),ws=performance.now()}function vs(e,t=1){Ts+=t;let n=performance.now(),r=n-ws;if(e.HUD&&e.HUD.material.uniforms){let t=Math.min(1,Es/60),n=e.HUD.material.uniforms.uIslBarProgress1.value;if(e.HUD.material.uniforms.uIslBarProgress1.value=n+(t-n)*.05,e.renderer){let t=e.renderer.getPixelRatio()/(window.devicePixelRatio||1),n=e.HUD.material.uniforms.uIslBarProgress2.value;e.HUD.material.uniforms.uIslBarProgress2.value=n+(t-n)*.05}}if(xs&&e.renderer){let t=window.devicePixelRatio||1,n=Math.round(e.renderer.getPixelRatio()/t*100),r=(e,t)=>e>=t?`stat-optimal`:e<40?`stat-critical`:`stat-stable`;xs.querySelector(`.stat-fps-val`)||(xs.innerHTML=`<span class="stat-fps-val">FPS 00</span> | <span class="stat-dpr-val">DPR 00%</span> | <span class="stat-drc-val">DRC 000</span>`);let i=xs.querySelector(`.stat-fps-val`),a=xs.querySelector(`.stat-dpr-val`),o=xs.querySelector(`.stat-drc-val`),s=`FPS ${Es}`;i.textContent!==s&&(i.textContent=s,i.className=`stat-fps-val ${r(Es,54)}`);let c=`DPR ${n}%`;a.textContent!==c&&(a.textContent=c,a.className=`stat-dpr-val ${r(n,90)}`);let l=e.renderer.info.render.calls,u=`DRC ${l.toString().padStart(3,`0`)}`;o.textContent!==u&&(o.textContent=u,o.className=`stat-drc-val ${l<100?`stat-optimal`:l>200?`stat-critical`:`stat-stable`}`)}r>=1e3&&(Es=Math.round(Ts*1e3/r),Ts=0,ws=n)}function Z(e){if(window.scene&&window.scene._spawnStopSignal){Ss&&(Ss.textContent=``);return}if(Ss){if(Ss.textContent===e)return;Ss.textContent=e,Ss.style.willChange=`transform, opacity`;let t=Ss.dataset.lastHudHeight,n=window.scene&&window.scene.HUD;if(n&&n.material&&n.material.uniforms){let e=n.material.uniforms,r=e.uBNotchHRatio.value;if(t!==r.toString()){let t=e.uMarginPct.value,n=t+(1-2*t)*r;Ss.style.bottom=`0`,Ss.style.height=(n*100).toFixed(4)+`vh`,Ss.dataset.lastHudHeight=r}}Ds&&clearTimeout(Ds),Ds=setTimeout(()=>{Ss&&(Ss.textContent=``)},5e3)}}function ys(e){if(window.scene&&window.scene._spawnStopSignal){bs(!0);return}if(Cs||=document.getElementById(`stat-subtitle`),Cs){Os&&cancelAnimationFrame(Os),Cs.classList.add(`active`),Cs.innerHTML=`<div class="subtitle-close">×</div><span class="subtitle-text"></span><div class="scanner-line"></div>`;let t=Cs.querySelector(`.subtitle-text`),n=Cs.querySelector(`.subtitle-close`);n&&(n.onclick=()=>{bs(),window.dispatchEvent(new CustomEvent(`subtitleClose`,{detail:{manual:!0}}))});let r=Math.min(Math.max(e.length*50,1e3),3e3);Cs.style.setProperty(`--reveal-dur`,`${r}ms`),window.scene&&ps(window.scene,r);let i=performance.now(),a=i,o=n=>{if(window.scene&&window.scene._spawnStopSignal){Os&&cancelAnimationFrame(Os),bs(!0);return}n||=performance.now();let s=n-i,c=Math.min(s/r,1);if(n-a>41.666666666666664||c===1){a=n;let r=e.length,i=``;for(let t=0;t<r;t++){let n=e[t];n===` `||n===`
`||c*(r+5)>t?i+=n:i+=`ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*`[Math.floor(Math.random()*42)]}t.textContent=i}c<1?Os=requestAnimationFrame(o):t.textContent=e};Os=requestAnimationFrame(o)}}function bs(e=!1){if(Os&&cancelAnimationFrame(Os),Cs||=document.getElementById(`stat-subtitle`),Cs){if(Cs.classList.remove(`active`),e){Cs.innerHTML=``;return}setTimeout(()=>{Cs.classList.contains(`active`)||(Cs.innerHTML=``)},650)}}var xs,Ss,Cs,ws,Ts,Es,Ds,Os,ks=M((()=>{gs(),ws=0,Ts=0,Es=0})),As,js=M((()=>{pt(),As=class{constructor(e){this.canvas=document.getElementById(e),this.gl=this.canvas.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!0}),this.gl||=(console.error(`WebGL2 not supported, falling back to WebGL1 (expect artifacts)`),this.canvas.getContext(`webgl`)),this.uProgress=0,this.targetProgress=0,this.mouse={x:.5,y:.5},this.textures={poba:null,dev:null},this.init()}async init(){console.log(`[AvatarEngine] Initializing WebGL2 Lab (KTX2 Edition)...`),await this.loadTextures(),this.setupProgram(),this.onResize(),window.addEventListener(`resize`,()=>this.onResize());let e=!1;window.addEventListener(`mousemove`,t=>{e||=(requestAnimationFrame(()=>{this.onMouseMove(t),e=!1}),!0)}),this.isVisible=!0,window.IntersectionObserver&&new IntersectionObserver(e=>{this.isVisible=e[0].isIntersecting},{threshold:.01}).observe(this.canvas),requestAnimationFrame(e=>this.render(e)),console.log(`[AvatarEngine] Engine Ready.`)}async loadTextures(){let e=e=>new Promise((t,n)=>{dt.transcoderPath||dt.setTranscoderPath(`https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/basis/`),window._ktx2SupportDetected||(dt.detectSupport({capabilities:{isWebGL2:!0},extensions:{has:e=>{try{return!!this.gl.getExtension(e)}catch{return!1}},get:e=>{try{return this.gl.getExtension(e)}catch{return null}}}}),window._ktx2SupportDetected=!0),dt.load(e,e=>{let n=this.gl,r=n.createTexture();n.bindTexture(n.TEXTURE_2D,r),e.mipmaps.forEach((t,r)=>{n.compressedTexImage2D(n.TEXTURE_2D,r,e.format,t.width,t.height,0,t.data)}),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,e.mipmaps.length>1?n.LINEAR_MIPMAP_LINEAR:n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),t(r)},void 0,t=>{console.error(`Failed to load KTX2:`,e,t),n(t)})}),t=`/PFL/`,n=`${t}textures/ktx2/cv-poba-nobg.ktx2`.replace(`//`,`/`),r=`${t}textures/ktx2/cv-dev-nobg.ktx2`.replace(`//`,`/`);this.textures.poba=await e(n),this.textures.dev=await e(r)}setupProgram(){this.program=this.createProgram(`#version 300 es
            in vec2 aPosition;
            out vec2 vUv;
            void main() {
                vUv = aPosition * 0.5 + 0.5;
                vUv.y = 1.0 - vUv.y;
                gl_Position = vec4(aPosition, 0.0, 1.0);
            }
        `,`#version 300 es
            precision highp float;
            in vec2 vUv;
            out vec4 fragColor;
            uniform float uTime;
            uniform vec2 uResolution;
            uniform vec4 uMouse;
            uniform float uProgress;
            uniform sampler2D uTexPoba;
            uniform sampler2D uTexDev;

            // Faster pseudo-random hash
            float hash(vec2 p) {
                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
            }

            // Optimized Voronoi using dot() for squared distance
            float voronoi(in vec2 x ) {
                vec2 n = floor(x);
                vec2 f = fract(x);
                float m_dist = 1.0;
                for(int j=-1; j<=1; j++) {
                    for(int i=-1; i<=1; i++) {
                        vec2 g = vec2(float(i), float(j));
                        float h = hash(n + g);
                        vec2 o = vec2(h, fract(h*1.23)); 
                        vec2 r = g + o - f;
                        m_dist = min(m_dist, dot(r, r)); 
                    }
                }
                return sqrt(m_dist);
            }

            float digitalNoise(vec2 p) {
                return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }

            void main() {
                float aspect = uResolution.x / uResolution.y;
                vec2 bgUv = vUv;
                bgUv.x *= aspect;

                // 1. DYNAMIC DIGITAL GRID
                vec2 m = uMouse.xy;
                m.x *= aspect;
                
                float mouseFocus = smoothstep(0.6, 0.05, length(bgUv - m));
                float spotlight = mouseFocus * mouseFocus * 2.5; 

                float vPattern = voronoi(bgUv * 4.0 + uTime * 0.05);
                float val = pow(vPattern * 1.1, 4.0) * 1.1; 
                
                float pulse = sin(uTime * 0.5) * 0.5 + 0.5;
                float baseThickness = (0.8 + pulse * 0.4) / uResolution.y; 
                
                vec2 grid1 = step(mod(bgUv + uTime * 0.005, 0.1), vec2(baseThickness * 1.2));
                vec2 grid2 = step(mod(bgUv * 2.0 - uTime * 0.015, 0.1), vec2(baseThickness * 0.6));
                
                float gridFinal = max(grid1.x, grid1.y) * 0.7 + max(grid2.x, grid2.y) * 0.3;

                vec3 techColor = vec3(0.0, 0.8, 0.9); 
                vec3 bgCol = vec3(0.003, 0.015, 0.035);
                bgCol += val * gridFinal * techColor * (0.2 + spotlight * 0.6);
                bgCol += val * techColor * spotlight * 0.35;
                
                float scanPos = fract(uTime * 0.08) * 1.2 - 0.1;
                float scanHighlight = smoothstep(0.012, 0.0, abs(vUv.y - scanPos)) * gridFinal * 1.2;
                bgCol += techColor * scanHighlight * (0.1 + spotlight * 0.4);

                bgCol *= smoothstep(1.0, 0.45, length(vUv - 0.5));
                
                // 2. PERSONA SWAP
                float uT = uTime * 15.0; 
                float threshold = uProgress * 1.3 - 0.15;
                float jitter = digitalNoise(vec2(floor(vUv.y * 150.0), uT)) * 0.035;
                float sweepX = vUv.x + jitter;
                threshold += (digitalNoise(vec2(uT, uT)) - 0.5) * 0.015; 
                float sweepVal = smoothstep(threshold - 0.015, threshold + 0.015, sweepX);
                
                float glitchZone = smoothstep(0.2, 0.0, abs(sweepX - threshold));
                float chaoticY = floor(vUv.y * (40.0 + digitalNoise(vec2(floor(vUv.y * 5.0), uT)) * 60.0));
                float drift = (digitalNoise(vec2(chaoticY, uT)) - 0.5) * 2.0 * step(0.3, digitalNoise(vec2(chaoticY, uT))) * glitchZone * 0.25; 

                vec4 texDev = vec4(0.0);
                vec4 texPoba = vec4(0.0);
                
                if (sweepVal < 0.999) texDev = texture(uTexDev, vUv + vec2(-drift, 0));
                if (sweepVal > 0.001) {
                    texPoba = texture(uTexPoba, vUv + vec2(drift, 0));
                    if (glitchZone > 0.01) texPoba.r = texture(uTexPoba, vUv + vec2(drift + 0.03 * glitchZone, 0.0)).r;
                }
                
                vec4 avatarCol = mix(texDev, texPoba, sweepVal);
                
                // 3. SCAN-DASHES
                vec3 glitchCoreCol = vec3(0.0, 0.55, 0.7); 
                float scanLine = smoothstep(0.03, 0.0, abs(sweepX - threshold)) * step(0.4, digitalNoise(vec2(floor(vUv.y * 200.0), uT)));
                vec3 materialGlow = glitchCoreCol * scanLine * (digitalNoise(vec2(uT, uT)) * 0.3 + 0.75) * 1.8;
                
                if (glitchZone > 0.01) {
                    float scanRel = abs(vUv.x + jitter*0.5 - threshold);
                    materialGlow += glitchCoreCol * smoothstep(0.01, 0.0, abs(scanRel - 0.035)) * 0.4;
                    materialGlow += techColor * step(0.99, digitalNoise(vUv * 15.0 + uTime)) * glitchZone * 3.0;
                }

                // 4. SILHOUETTE EDGE (Reduced sampling logic for mobile optimization)
                float edge = 0.0;
                if (avatarCol.a > 0.001 && avatarCol.a < 0.999) {
                    float o = 0.015; 
                    float alphaAround = texture(uTexDev, vUv + vec2(o, o)).a + texture(uTexPoba, vUv - vec2(o, o)).a;
                    edge = avatarCol.a * smoothstep(0.8, 0.0, alphaAround * 0.5);
                }

                // 5. CIRCUIT RIM
                float baseSpeed = uTime * 0.12 + sin(uTime * 1.5) * 0.15; 
                float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
                float spark = pow(smoothstep(0.06, 0.0, abs(fract(angle / 6.2831 + baseSpeed) - 0.5)), 4.0); 
                vec3 rimGlow = (techColor * 0.6 + (techColor + vec3(0.4)) * spark * 4.0) * edge * (1.2 + spotlight);

                // 6. FINAL COMPOSITION
                fragColor = vec4(mix(bgCol, avatarCol.rgb + rimGlow + materialGlow + 0.05, avatarCol.a), 1.0);
            }
        `),this.locations={aPosition:this.gl.getAttribLocation(this.program,`aPosition`),uTime:this.gl.getUniformLocation(this.program,`uTime`),uResolution:this.gl.getUniformLocation(this.program,`uResolution`),uMouse:this.gl.getUniformLocation(this.program,`uMouse`),uProgress:this.gl.getUniformLocation(this.program,`uProgress`),uTexPoba:this.gl.getUniformLocation(this.program,`uTexPoba`),uTexDev:this.gl.getUniformLocation(this.program,`uTexDev`)};let e=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,e),this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),this.gl.STATIC_DRAW)}createProgram(e,t){let n=(e,t)=>{let n=this.gl.createShader(e);return this.gl.shaderSource(n,t),this.gl.compileShader(n),this.gl.getShaderParameter(n,this.gl.COMPILE_STATUS)||console.error(this.gl.getShaderInfoLog(n)),n},r=this.gl.createProgram();return this.gl.attachShader(r,n(this.gl.VERTEX_SHADER,e)),this.gl.attachShader(r,n(this.gl.FRAGMENT_SHADER,t)),this.gl.linkProgram(r),r}onMouseMove(e){this.mouse.x=e.clientX/window.innerWidth,this.mouse.y=1-e.clientY/window.innerHeight}onResize(){this.canvas.width=this.canvas.clientWidth*window.devicePixelRatio,this.canvas.height=this.canvas.clientHeight*window.devicePixelRatio,this.gl.viewport(0,0,this.canvas.width,this.canvas.height)}render(e){if(requestAnimationFrame(e=>this.render(e)),v.update(e),!this.isVisible)return;let t=v.getAll().length>0?16.6:41.6;e-(this.lastTime||0)<t||(this.lastTime=e,this.gl.clear(this.gl.COLOR_BUFFER_BIT),this.gl.useProgram(this.program),this.gl.uniform1f(this.locations.uTime,e*.001),this.gl.uniform2f(this.locations.uResolution,this.canvas.width,this.canvas.height),this.gl.uniform4f(this.locations.uMouse,this.mouse.x,this.mouse.y,0,0),this.gl.uniform1f(this.locations.uProgress,this.uProgress),this.gl.activeTexture(this.gl.TEXTURE0),this.gl.bindTexture(this.gl.TEXTURE_2D,this.textures.poba),this.gl.uniform1i(this.locations.uTexPoba,0),this.gl.activeTexture(this.gl.TEXTURE1),this.gl.bindTexture(this.gl.TEXTURE_2D,this.textures.dev),this.gl.uniform1i(this.locations.uTexDev,1),this.gl.enableVertexAttribArray(this.locations.aPosition),this.gl.vertexAttribPointer(this.locations.aPosition,2,this.gl.FLOAT,!1,0,0),this.gl.drawArrays(this.gl.TRIANGLE_STRIP,0,4))}setProgress(e){this.uProgress=e}transitionTo(e){new v.Tween(this).to({uProgress:e},1500).easing(v.Easing.Cubic.InOut).start()}}})),Ms,Q,Ns=M((()=>{De(),Te(),Ae(),ks(),ls(),ci(),js(),Ms=class{constructor(){this.currentMode=ye,this.cvContent=document.getElementById(`cv-content`),this.personaPanel=document.getElementById(`protocol-selection-panel`),this.consoleEl=document.getElementById(`system-console-log`),this._lastSyncedMode=null,this.elements={role:document.getElementById(`cv-role`),summary:document.getElementById(`cv-summary`),summaryInner:document.querySelector(`.summary-content-inner`),experience:document.getElementById(`cv-experience`),skills:document.getElementById(`cv-skills`),modeBtns:document.querySelectorAll(`.mode-btn`),summaryModeBtns:document.querySelectorAll(`.mode-switch-btn`),systemTitle:document.querySelector(`.title-text`),timerDisplay:document.getElementById(`selection-timer`),dontAskCheckbox:document.getElementById(`dont-ask-persona`),avatarCubeWrapper:document.querySelector(`.avatar-cube-container`),avatarImgFront:document.getElementById(`cv-avatar-img-front`),avatarImgBack:document.getElementById(`cv-avatar-img-back`),contactsGroup:document.querySelector(`.contact-links-group`),portfolioTitle:document.getElementById(`portfolio-title`)},this.cachedSections=[],this.timerInterval=null,this.selectionPromiseResolver=null,this.pointsApp=null,this.summaryMode=`scan`,this.avatarEngine=new As(`avatar-canvas`),this.init()}togglePersonaPanel(){if(!this.personaPanel&&(this.personaPanel=document.getElementById(`protocol-selection-panel`),!this.personaPanel))return;let e=window.getComputedStyle(this.personaPanel).display===`none`,t=document.getElementById(`persona-switch-btn`);if(e){if(t){let e=t.getBoundingClientRect(),n=e.left+e.width/2,r=e.top+e.height/2;this.personaPanel.style.transformOrigin=`${n}px ${r}px`}this.personaPanel.style.display=`flex`,this.personaPanel.classList.add(`minimizing`),this.personaPanel.offsetHeight,this.personaPanel.classList.remove(`minimizing`),this.startTimer(),window.scene&&(window.scene.isPersonaActive=!0)}else{if(t){let e=t.getBoundingClientRect(),n=e.left+e.width/2,r=e.top+e.height/2;this.personaPanel.style.transformOrigin=`${n}px ${r}px`}this.stopTimer(),this.personaPanel.classList.add(`minimizing`),this.personaPanel.classList.contains(`minimizing`)&&(setTimeout(()=>{this.selectionPromiseResolver&&=(this.selectionPromiseResolver(this.currentMode),null)},300),setTimeout(async()=>{if(this.personaPanel.style.display=`none`,window.scene&&(window.scene.isPersonaActive=!1),window.uiAnims&&window.uiAnims.triggerSpring&&window.uiAnims.triggerSpring(t),this.pointsApp&&typeof this.pointsApp.triggerEnergeticScrollJump==`function`){let e=typeof this.pointsApp.getCurrentStep==`function`?this.pointsApp.getCurrentStep():0;(e===0||e===1)&&this.pointsApp.triggerEnergeticScrollJump()}this.pointsApp&&typeof this.pointsApp.syncPersona==`function`&&this._lastSyncedMode!==this.currentMode&&(this.pointsApp.syncPersona(this.currentMode),this._lastSyncedMode=this.currentMode)},600))}}startTimer(){if(this.elements.timerBar||(this.elements.timerBar=document.getElementById(`selection-timer-bar`)),this.elements.timerNumber||(this.elements.timerNumber=document.getElementById(`timer-number`)),!this.elements.timerBar)return;this.elements.timerBar.style.transition=`none`,this.elements.timerBar.style.width=`100%`,this.elements.timerNumber&&(this.elements.timerNumber.innerText=`10`),this.elements.timerBar.offsetWidth,this.elements.timerBar.style.transition=`width 27s linear`,this.elements.timerBar.style.width=`0%`,this.stopTimer();let e=27;this.countInterval=setInterval(()=>{e--,e>=0&&this.elements.timerNumber&&(this.elements.timerNumber.innerText=e)},1e3),this.timerInterval=setTimeout(()=>{this.stopTimer(),this.setPersona(this.currentMode)},27e3)}stopTimer(){this.timerInterval&&=(clearTimeout(this.timerInterval),null),this.countInterval&&=(clearInterval(this.countInterval),null)}setPointsApp(e){this.pointsApp=e,this.currentMode&&typeof e.syncPersona==`function`&&(e.syncPersona(this.currentMode),this._lastSyncedMode=this.currentMode),this.syncUniform(this.currentMode)}async requestPersonaSelection(){return localStorage.getItem(`persona-skip-auto`)===`true`||this._modeFromUrl?this.currentMode:(this.togglePersonaPanel(),new Promise(e=>{this.selectionPromiseResolver=e}))}setPersona(e,t={}){this.stopTimer(),Ee[e]&&(this.applyMode(e,!1,t.skipPointsSync),this.elements.dontAskCheckbox&&localStorage.setItem(`persona-skip-auto`,this.elements.dontAskCheckbox.checked),this.personaPanel&&this.personaPanel.style.display!==`none`&&this.togglePersonaPanel(),window.dispatchEvent(new CustomEvent(`personaSelected`,{detail:{mode:e}})))}init(){let e=new URLSearchParams(window.location.search).get(`mode`);e&&Ee[e]?(this.currentMode=e,this._modeFromUrl=!0,localStorage.setItem(`cv-view-mode-v3`,e)):(e=ye,this.currentMode=e,this.updateUrl(e,!0),localStorage.setItem(`cv-view-mode-v3`,e)),this.applyMode(this.currentMode,!0),this.syncUniform(this.currentMode),this.elements.dontAskCheckbox&&(this.elements.dontAskCheckbox.checked=localStorage.getItem(`persona-skip-auto`)===`true`),this.setupEventListeners()}updateUrl(e,t=!1){let n=new URL(window.location);n.searchParams.get(`mode`)!==e&&(n.searchParams.set(`mode`,e),t?window.history.replaceState({mode:e},``,n):window.history.pushState({mode:e},``,n))}setupEventListeners(){document.addEventListener(`keydown`,e=>{if(!(e.target.tagName===`INPUT`||e.target.tagName===`TEXTAREA`)){if(e.key.toLowerCase()===`p`&&(e.preventDefault(),this.togglePersonaPanel()),e.key.toLowerCase()===`h`){e.preventDefault();let t=this.elements.portfolioTitle,n=document.querySelector(`.scroll-indicator`);if(t){let e=t.style.display===`none`?`block`:`none`;t.style.display=e,n&&(n.style.display=e)}}if(e.key.toLowerCase()===`b`){e.preventDefault();let t=document.getElementById(`board`);if(t){let e=t.style.display===`none`;t.style.display=e?``:`none`}}}});let e=document.getElementById(`cv-scroller`),t=document.querySelectorAll(`.nav-item`);if(e){let n=!1,r=()=>{if(window._cvState&&window._cvState!==`idle`){n=!1;return}let r=``,i=e.scrollTop;for(let e=0;e<this.cachedSections.length;e++){let t=this.cachedSections[e];i>=t.offsetTop-120&&(r=t.id||t.getAttribute(`id`))}t.forEach(e=>{e.classList.toggle(`active`,e.getAttribute(`data-target`)===r)}),i<100&&(t.forEach(e=>e.classList.remove(`active`)),t.length>0&&t[0].classList.add(`active`)),n=!1};e.addEventListener(`scroll`,()=>{n||=(requestAnimationFrame(r),!0)},{passive:!0}),this.cacheScrollSections()}this.personaPanel&&this.personaPanel.addEventListener(`click`,e=>{e.target===this.personaPanel&&this.togglePersonaPanel()}),window.addEventListener(`popstate`,e=>{let t=e.state&&e.state.mode||new URLSearchParams(window.location.search).get(`mode`)||ye;t!==this.currentMode&&this.applyMode(t,!1)}),this.elements.summaryModeBtns&&this.elements.summaryModeBtns.forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation();let n=e.getAttribute(`data-summary-mode`);this.summaryMode!==n&&(this.summaryMode=n,this.elements.summaryModeBtns.forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`),this.renderSummary())})});let n=document.getElementById(`dismiss-3d-hint`);n&&n.addEventListener(`click`,e=>{e.stopPropagation();let t=document.querySelector(`.mobile-3d-hint`);t&&t.classList.add(`hidden`)});let r=document.getElementById(`avatar-container`);r&&r.addEventListener(`click`,e=>{e.preventDefault();let t=this.currentMode===`dev`?`poba`:`dev`;this.setPersona(t)})}applyMode(e,t=!1,n=!1){let r=this.currentMode===e,i=this.pointsApp&&typeof this.pointsApp.isMorphing==`function`?this.pointsApp.isMorphing():!1;if(this.currentMode=e,localStorage.setItem(`cv-view-mode-v3`,e),document.querySelectorAll(`[data-mode]`).forEach(t=>{let n=t.getAttribute(`data-mode`),r=t.querySelector(`.preference-hint`);n===e?(t.classList.add(`active`),localStorage.getItem(`cv-view-mode-v3`)&&r&&(r.innerText=`YOUR PREVIOUS SELECTION`,r.style.display=`block`)):(t.classList.remove(`active`),r&&(r.style.display=`none`))}),r&&!i&&!t)return;if(t)this.updateDOM();else{if(this.avatarEngine){let e=this.currentMode===`dev`?1:0;this.avatarEngine.transitionTo(e)}this.cvContent?(this.cvContent.classList.add(`swapping`),setTimeout(()=>{this.updateDOM(),this.cvContent.classList.remove(`swapping`)},300)):this.updateDOM()}if(window.dispatchEvent(new CustomEvent(`audienceChanged`,{detail:{mode:e}})),window.scene&&window.scene.scenarioState?.name===`room`&&!t&&!window.scene.isHeroAnimating){let t=R(e===F.POBA?`SYS_DRONE_SUBTITLES_POBA`:`SYS_DRONE_SUBTITLES_DEV`);ys(t),Ko(window.scene,null,t)}this.syncUniform(e),Yr(e===F.POBA);let a=this.personaPanel&&this.personaPanel.style.display!==`none`;this.pointsApp&&typeof this.pointsApp.syncPersona==`function`&&!a&&(this._lastSyncedMode!==e||i)&&(this.pointsApp.syncPersona(e,n),this._lastSyncedMode=e),t||this.updateUrl(e);let o=Ee[e];o&&o.systemTitle&&(document.title=`${o.systemTitle} | BUI QUOC HIEU Portfolio`)}syncUniform(e){if(window.scene&&window.scene.globalUniformsHub&&window.scene.globalUniformsHub.displaySystem){let t=e===F.POBA?1:0;window.scene.globalUniformsHub.displaySystem.uIsPoba.value=t}}triggerCyberDecode(e,t,n=1500){if(!e||!t)return;e.scrambleRaf&&cancelAnimationFrame(e.scrambleRaf);let r=t.length,i=performance.now(),a=i,o=s=>{s||=performance.now();let c=s-i,l=Math.min(c/n,1);if(s-a>41.666666666666664||l===1){a=s;let n=``;for(let e=0;e<r;e++){let i=t[e];i===` `||i===`
`||l*(r+5)>e?n+=i:n+=`ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*`[Math.floor(Math.random()*42)]}e.innerText=n}l<1?e.scrambleRaf=requestAnimationFrame(o):e.innerText=t};e.scrambleRaf=requestAnimationFrame(o)}renderSummary(){let e=Ee[this.currentMode];if(!e||!this.elements.summaryInner)return;let t=this.summaryMode===`scan`,n=t?this.currentMode===`dev`?`CREATIVE_ENGINE.sys`:`STRATEGY_MAP.conf`:`BIO.md`,r=``,i=``;t?(r=(e.summaryTags||[]).map((e,t,n)=>{let r=Array.isArray(e.val),i=t===n.length-1,a=e.comment?` <span class="code-comment" data-target-text='${e.comment.replace(/'/g,`&apos;`)}'>${e.comment}</span>`:``;if(r){let t=e.val.map(e=>`<span class="code-quote">"</span><span class="code-val" data-target-text='${e.replace(/'/g,`&apos;`)}'>${e}</span><span class="code-quote">"</span>`).join(`<span class="code-sep">, </span>`);return`
                        <div class="code-line">
                            <span class="code-key" data-target-text="${e.key}">${e.key}</span><span class="code-sep">: </span><span class="code-bracket">[</span>${t}<span class="code-bracket">]</span>${i?``:`<span class="code-sep">,</span>`}${a}
                        </div>
                    `}else return`
                        <div class="code-line">
                            <span class="code-key" data-target-text="${e.key}">${e.key}</span><span class="code-sep">: </span><span class="code-quote">"</span><span class="code-val" data-target-text='${e.val.toString().replace(/'/g,`&apos;`)}'>${e.val}</span><span class="code-quote">"</span>${i?``:`<span class="code-sep">,</span>`}${a}
                        </div>
                    `}).join(``),i=`{\n${(e.summaryTags||[]).map(e=>{let t=Array.isArray(e.val)?`[${e.val.map(e=>`"${e}"`).join(`, `)}]`:`"${e.val}"`;return`  ${e.key}: ${t}${e.comment?`, ${e.comment}`:`,`}`}).join(`
`).replace(/,$/,``)}\n}`):i=e.summary,this.elements.summaryInner.innerHTML=`
            <div class="summary-code-block-wrapper" style="border-radius: 0;">
                <div class="code-editor-header" style="border-radius: 0;">
                    <div class="terminal-prompt-icon">>&nbsp;${n}</div>
                    
                    <!-- SWITCHER GROUP (Left-ish) -->
                    <div class="summary-mode-switcher-inline" style="border-radius: 0;">
                        <button class="mode-switch-btn ${t?`active`:``}" data-summary-mode="scan" style="border-radius: 0;">
                            <span>SCAN</span>
                        </button>
                        <button class="mode-switch-btn ${t?``:`active`}" data-summary-mode="narrative" style="border-radius: 0;">
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
                    ${t?`
                        <span class="code-bracket">{</span>
                        <div class="code-body">${r}</div>
                        <span class="code-bracket">}</span>
                    `:`
                        <div class="summary-narrative">${e.summary}</div>
                    `}
                </div>
            </div>
        `,this.elements.summaryInner.querySelectorAll(`.mode-switch-btn`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation();let n=e.getAttribute(`data-summary-mode`);this.summaryMode!==n&&(this.summaryMode=n,this.renderSummary())})});let a=this.elements.summaryInner.querySelector(`.copy-code-btn`);if(a&&a.addEventListener(`click`,e=>{e.stopPropagation(),navigator.clipboard.writeText(i).then(()=>{let e=a.querySelector(`.btn-txt`);if(e){let t=e.innerText;e.innerText=`COPIED!`,a.classList.add(`copied`),setTimeout(()=>{e.innerText=t,a.classList.remove(`copied`)},2e3)}})}),t)this.elements.summaryInner.querySelectorAll(`.code-key, .code-val`).forEach((e,t)=>{let n=e.getAttribute(`data-target-text`);this.triggerCyberDecode(e,n,1e3+t*100)});else{let t=this.elements.summaryInner.querySelector(`.summary-narrative`);t&&this.triggerCyberDecode(t,e.summary,1200)}}updateDOM(){let e=Ee[this.currentMode];if(e){if(this.elements.role&&this.triggerCyberDecode(this.elements.role,e.role,Math.max(1e3,e.role.length*40)),this.elements.systemTitle&&e.systemTitle&&this.triggerCyberDecode(this.elements.systemTitle,e.systemTitle,1e3),this.renderSummary(),this.elements.experience&&(this.elements.experience.innerHTML=e.experience.map(e=>`
                <div class="role-block">
                    <div class="role-header">
                        <div class="company-wrapper">
                            <span class="company">${e.company}</span>
                            ${e.companyDesc?`
                                <div class="company-info-trigger">
                                    <svg class="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="16" x2="12" y2="12"></line>
                                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                    </svg>
                                </div>
                            `:``}
                        </div>
                        <div class="role-collapse-hint">
                            <span class="hint-text">CLICK TO COLLAPSE</span>
                            <svg class="chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                    </div>
                    ${e.companyDesc?`<div class="company-context">${e.companyDesc}</div>`:``}
                    <div class="title-row">
                        <span class="job-title">${e.title}</span>
                        <span class="date">${e.date}</span>
                    </div>
                    <ul>
                        ${e.points.map(e=>`<li>${e}</li>`).join(``)}
                    </ul>
                </div>
            `).join(``),this.rebindCollapsibles()),this.pointsApp&&typeof this.pointsApp.refreshUIPersonaSync==`function`)this.pointsApp.refreshUIPersonaSync();else if(this.elements.portfolioTitle){let e=this.pointsApp&&typeof this.pointsApp.getCurrentStep==`function`?this.pointsApp.getCurrentStep():0,t=this.currentMode.toUpperCase(),n=this.elements.portfolioTitle.querySelector(`.title-prefix`),r=this.elements.portfolioTitle.querySelector(`.title-header`);n&&(n.innerText=R(`NARR_STEP_0_PREFIX_${t}`)),r&&(r.innerText=R(`NARR_STEP_0_HEADER_${t}`));let i=this.elements.portfolioTitle.querySelector(`.title-verb`),a=this.elements.portfolioTitle.querySelector(`.title-outcome`),o=this.elements.portfolioTitle.querySelector(`.title-credibility`);i&&(i.innerText=R(`NARR_STEP_0_VERB_${t}`)),a&&(a.innerText=R(`NARR_STEP_0_OUTCOME_${t}`)),o&&(o.innerText=R(`NARR_STEP_0_CREDIBILITY_${t}`));let s=this.elements.portfolioTitle.querySelector(`.title-subtitle`);s&&(s.innerText=R(`NARR_STEP_${e}_SUBTITLE_${t}`))}if(this.elements.skills&&(this.elements.skills.classList.remove(`skills-grid`),this.elements.skills.innerHTML=e.skills.map(e=>`
                <div class="role-block skill-block-entry" data-star-indices="${(e.starIndices||[]).join(`,`)}">
                    <div class="role-header">
                        <span class="company">${e.category}</span>
                    </div>
                    <ul>
                        <li>${e.val}</li>
                    </ul>
                </div>
            `).join(``),this.rebindSkillInteractions()),this.elements.contactsGroup&&e.contacts){let t={gmail:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,linkedin:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`,phone:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,website:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`};this.elements.contactsGroup.innerHTML=e.contacts.map(e=>`
                <button 
                    class="contact-btn-tiny" 
                    data-id="${e.id}"
                    data-label="${e.label}"
                    data-platform="${e.platform}"
                    data-url="${e.url}"
                    aria-label="${e.label}"
                >
                    ${t[e.id]||``}
                </button>
            `).join(``)}this.elements.avatarImgFront&&!this.elements.avatarCubeWrapper.classList.contains(`swapping-avatar`)?this.elements.avatarImgFront.src=e.cvAvatarURL:this.elements.avatarImgBack&&(this.elements.avatarImgBack.src=e.cvAvatarURL),this.cacheScrollSections()}}cacheScrollSections(){this.cachedSections=Array.from(document.querySelectorAll(`.section-anchor, .collapsible-header`))}rebindCollapsibles(){this.elements.experience.querySelectorAll(`.role-block`).forEach(e=>{e.dataset.roleBound||(e.dataset.roleBound=`true`,e.addEventListener(`click`,t=>{if(t.target.tagName===`A`||t.target.closest(`a`))return;t.stopPropagation();let n=e.classList.toggle(`collapsed`),r=e.querySelector(`.hint-text`);r&&(r.textContent=n?`CLICK TO EXPAND`:`CLICK TO COLLAPSE`),this.cacheScrollSections()}))})}rebindSkillInteractions(){let e=this.elements.skills;e&&e.querySelectorAll(`.skill-block-entry`).forEach(e=>{let t=e.getAttribute(`data-star-indices`);if(!t)return;let n=t.split(`,`).map(e=>parseInt(e.trim())).filter(e=>!isNaN(e)&&e!==-1);if(n.length===0)return;let r=()=>{this.pointsApp&&typeof this.pointsApp.setConstellationVisibility==`function`&&(this.pointsApp.setConstellationVisibility(!0),n.forEach(e=>{typeof this.pointsApp.triggerStarPulse==`function`&&this.pointsApp.triggerStarPulse(e)}))};e.addEventListener(`mouseenter`,r),e.addEventListener(`mouseleave`,()=>{this.pointsApp&&typeof this.pointsApp.setConstellationVisibility==`function`&&this.pointsApp.setConstellationVisibility(!1)}),e.addEventListener(`click`,r)})}highlightSkillByCategory(e){if(!this.elements.skills)return;let t=this.elements.skills.querySelectorAll(`.skill-block-entry`);if(t.forEach(e=>e.classList.remove(`active-gold-glow`)),!e)return;let n=Array.from(t).find(t=>{let n=t.querySelector(`.company`);return n&&n.textContent.trim().toUpperCase()===e.toUpperCase()});n&&n.classList.add(`active-gold-glow`)}logMessage(e){this.consoleEl&&(this.consoleEl.innerHTML=`<span class="console-cursor">></span> ${e}`,this.consoleEl.style.opacity=`1`,setTimeout(()=>this.consoleEl.style.opacity=`0.7`,100),setTimeout(()=>this.consoleEl.style.opacity=`1`,200))}updatePictureTag(e,t){if(!e)return;let n=t.replace(`.webp`,`.png`);e.src=n;let r=e.parentElement,i=r.tagName===`PICTURE`?r:r.parentElement&&r.parentElement.tagName===`PICTURE`?r.parentElement:null;i&&i.querySelectorAll(`source`).forEach(e=>{e.getAttribute(`type`)===`image/webp`?e.srcset=t:e.srcset=n})}},Q=new Ms}));function Ps(t={}){let n=t.domElement||void 0,r=t.fogEnabled||!1,i=t.alpha||!1,a=t.useBackdrop||!1,o,s,c=n||document.body;if(n){let e=n.getBoundingClientRect();o=e.width,s=e.height,getComputedStyle(c).position===`static`&&(c.style.position=`relative`)}else o=window.innerWidth,s=window.innerHeight;let l=o,u=s,d=document.createElement(`div`);d.id=`threeJsContainer`,d.style.cssText=`
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        right: 0;
        overflow: hidden;
        background: transparent;
    `;let f=null;a&&(f=document.createElement(`div`),f.id=`threeJsBackdrop`,f.className=`three-js-backdrop`,d.appendChild(f)),c.appendChild(d);let p=new e.PerspectiveCamera(50,l/u,2,800);p.name=`camera`;let m=new e.Scene;m.name=`scene`,m.width=l,m.height=u,r&&(m.fog=new e.Fog(0,2,500));let h=new e.WebGLRenderer({antialias:!0,powerPreference:`high-performance`,stencil:!1,alpha:i||a});h.name=`renderer`,h.shadowMap.enabled=!0,h.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),h.setSize(l,u),d.appendChild(h.domElement);function g(){let e,t;if(n){let r=n.getBoundingClientRect();e=r.width,t=r.height}else e=window.innerWidth,t=window.innerHeight;let r=e,i=t;d.style.width=r+`px`,d.style.height=i+`px`,r>0&&i>0&&(p.aspect=r/i,p.updateProjectionMatrix(),h.setSize(r,i),h.render(m,p)),m.width=r,m.height=i}return window.addEventListener(`resize`,g),m.domElement=d,m.backdropLayer=f,m.renderer=h,m.camera=p,m.add(p),[m,p,h]}var Fs=M((()=>{})),Is=M((()=>{})),Ls=M((()=>{})),Rs=M((()=>{})),zs,Bs=M((()=>{zs={GARDEN:{HOVER_START:`garden-hover-start`,HOVER_END:`garden-hover-end`}}}));function Vs(t){let n=t.camera,r=new e.PlaneGeometry(1,1);$.DUR_FILL+$.DUR_HOLD+$.DUR_WIPE+$.DUR_PAUSE;let i=()=>{let e=document.documentElement,t=window.innerHeight,n=t*($.MARGIN_PCT+a.uVerticalMarginPct.value),r=(t-2*n)*($.ISL_BAR_MARGIN_Y_RATIO*2+2*$.ISL_BAR_HEIGHT_RATIO+1*$.ISL_BAR_GAP_RATIO),i=((a.uCutSize.value||10)+r-$.CORNER_RADIUS)/t*100,o=n/t*100;s.islandHeightVh=i,s.islandTopVh=o,e.style.setProperty(`--hud-island-height-vh`,`${i}vh`),e.style.setProperty(`--hud-island-top-vh`,`${o}vh`),e.style.setProperty(`--hud-island-bottom-vh`,`${o+i}vh`);let c=`${$.MARGIN_PCT*100}vh`;e.style.setProperty(`--hud-margin-visible`,c),e.style.setProperty(`--hud-text-nudge`,`0.1vh`)};window.addEventListener(`resize`,i);let a={...t.globalUniformsHub.uniforms,uPosStart:{value:new e.Vector2},uPosHead:{value:new e.Vector2},uDiamondRot:{value:new e.Vector2(1,0)},uSpriteSheet:{value:V.spriteSheet},uMarginPct:{value:$.MARGIN_PCT},uVerticalMarginPct:{value:$.VERTICAL_MARGIN_PCT},uIslToMainWRatio:{value:$.ISL_TO_MAIN_W_RATIO},uBNotchWRatio:{value:0},uBNotchHRatio:{value:0},uRNotchHRatio:{value:0},uRNotchWRatio:{value:0},uCutSize:{value:0},uIsAutoElec:{value:0},uElecStartTime:{value:0},uHeadSpriteSize:{value:$.HEAD_SPRITE_SIZE},uIslBarHeightRatio:{value:$.ISL_BAR_HEIGHT_RATIO},uIslBarGapRatio:{value:$.ISL_BAR_GAP_RATIO},uIslBarMarginLeftRatio:{value:$.ISL_BAR_MARGIN_LEFT_RATIO},uIslBarMarginRightRatio:{value:$.ISL_BAR_MARGIN_RIGHT_RATIO},uIslBarMarginYRatio:{value:$.ISL_BAR_MARGIN_Y_RATIO},uIslBarProgress1:{value:$.ISL_BAR_PROGRESS[0]},uIslBarProgress2:{value:$.ISL_BAR_PROGRESS[1]},uBorderThickRatio:{value:$.BORDER_THICK_RATIO},uGridThickness:{value:$.GRID_LINE_THICKNESS},uGridSize:{value:$.BG_GRID_SIZE},uGridPulseSpeed:{value:$.GRID_PULSE_SPEED},uGridPulseDensity:{value:$.GRID_PULSE_DENSITY},uOutsideColor:{value:new e.Color(0,0,0)},uRNotchBarProgress:{value:$.R_NOTCH_BAR_PROGRESS},uRNotchBarThickness:{value:$.R_NOTCH_BAR_THICKNESS},uRNotchBarActiveColor:{value:$.R_NOTCH_BAR_ACTIVE_COLOR.clone()},uRNotchBarInactiveColor:{value:$.R_NOTCH_BAR_INACTIVE_COLOR.clone()},uBreathIntensity:{value:0},uBreathColor:{value:I.ELECTRIC_CYAN.clone()},uBreathAutoStrength:{value:$.BREATH_AUTO_STRENGTH},uBreathManualStrength:{value:$.BREATH_MANUAL_STRENGTH},uFlyCount:{value:200},uFlySpeed:{value:1},uFlowerWind:{value:.02},uFlowerScale:{value:$.FLOWER_SCALE},uFlowerNotchPos:{value:new e.Vector2(.92,.075)},uFlowerGlow:{value:$.FLOWER_GLOW_BASE},uKnowhereGravityHoverMultiplier:{value:$.GARDEN_HOVER_GRAVITY_MULT},uFlowerColor:{value:$.FLOWER_COLOR.clone()},uFlowerRotation:{value:$.FLOWER_ROTATION},uFlowerGlitch:{value:0},uGridLock:{value:0},uRNotchVibeB:{value:0},uRNotchVibeT:{value:0},uBNotchBarProgress:{value:$.B_NOTCH_BAR_PROGRESS},uBNotchBarAlpha:{value:$.B_NOTCH_BAR_ALPHA},uBNotchBarMarginX:{value:1},uBNotchBarMarginY:{value:.45},uBNotchBarColor:{value:$.B_NOTCH_BAR_COLOR.clone()},uBeamMaxHeight:{value:0},uBeamWaveThickness:{value:$.BEAM_WAVE_THICKNESS},uBeamBaseThickness:{value:0},uBeamBloom:{value:$.BEAM_BLOOM},uBeamWobble:{value:$.BEAM_WOBBLE},uBeamGlowStrength:{value:$.BEAM_GLOW_STRENGTH},uBeamSpeed:{value:$.BEAM_SPEED},uBeamFreq:{value:$.BEAM_FREQ},uBeamTrimRatio:{value:$.BEAM_TRIM_RATIO},uBeamGrowth:{value:0},uBeamAttachRatio:{value:$.BEAM_ATTACH_RATIO},uBeamColor:{value:$.BEAM_COLOR.clone()},uRBarPos:{value:new e.Vector2(0,0)},uRBarRot:{value:0},uBBarPos:{value:new e.Vector2(0,0)},uBBarRot:{value:0},uIslBar1Pos:{value:new e.Vector2(0,0)},uIslBar1Rot:{value:0},uIslBar2Pos:{value:new e.Vector2(0,0)},uIslBar2Rot:{value:0},uNavCount:{value:$.NAV_COUNT},uNavGap:{value:$.NAV_GAP},uNavigatorVisibility:{value:$.NAVIGATOR_VISIBILITY},uNavVis:{value:new Float32Array([0,0,0,0,0,0])},uNavWH:{value:new Float32Array([1,2,2,2,0,0])},uHeadScale:{value:$.HEAD_SCALE},uIsGardenFlower:{value:$.GARDEN_IS_FLOWER},uGrokScaleFactor:{value:$.GROK_SCALE_FACTOR},uGrokOffsetY:{value:$.GROK_OFFSET_Y}},o=new e.ShaderMaterial({vertexShader:`
        varying vec2 vUv;
        void main() {
            vUv = uv;
            // Map 1x1 plane (-0.5 to 0.5) directly to clip space (-1 to 1) 
            // bypassing projection and modelView matrices for a perfectly fixed HUD.
            gl_Position = vec4(position.x * 2.0, position.y * 2.0, 0.0, 1.0);
        }
    `,fragmentShader:Hs(),transparent:!0,uniforms:a,blending:e.NormalBlending,depthTest:!1,depthWrite:!1,side:e.FrontSide}),s=new e.Mesh(r,o);s.name=`HUDFrame`,s.frustumCulled=!1,s.renderOrder=9999,s.isOpen=!1,t.HUD=s,i();let c=(e,t,n,r,i,a,o)=>{let s=r,c=-n,l=t-s,u=-(e-c),d=-(t-(r-i)),f=(e-(c+o))*-.7071+(t-s)*.7071,p=(e-(c+a))*.7071+(t-s)*-.7071;return Math.max(Math.max(Math.max(Math.max(l,u),d),p),f)},l=performance.now(),u=0,d=[new e.Vector2,new e.Vector2],f={pos:new e.Vector2(0,0),vel:new e.Vector2(0,0),rot:0,angVel:0,isActive:!1,shouldSnapToAnchor:!0,mass:1,getMOI:e=>1/12*1*(e*2)**2},p={pos:new e.Vector2(0,0),vel:new e.Vector2(0,0),rot:0,angVel:0,isActive:!1,shouldSnapToAnchor:!0,mass:2,getMOI:(e,t)=>1/12*2*(e*e+t*t)},m={pos:new e.Vector2(0,0),vel:new e.Vector2(0,0),rot:0,angVel:0,isActive:!1,shouldSnapToAnchor:!0,mass:1.5,getMOI:(e,t)=>1/12*1.5*(e*e+t*t)},h={pos:new e.Vector2(0,0),vel:new e.Vector2(0,0),rot:0,angVel:0,isActive:!1,shouldSnapToAnchor:!0,mass:1.5,getMOI:(e,t)=>1/12*1.5*(e*e+t*t)};s.applyBeamImpulse=()=>{f.isActive=!0,f.shouldSnapToAnchor=!1;let n=t.width||window.innerWidth,r=t.height||window.innerHeight,i=r*a.uMarginPct.value,o=r*(a.uMarginPct.value+a.uVerticalMarginPct.value),s=new e.Vector2((n-i*2)*.5,(r-o*2)*.5),c=s.x*2,l=s.y*2;f.pos.lengthSq()<.001&&f.pos.set(s.x,0);let u=a.uBNotchHRatio.value,d=a.uBNotchWRatio.value,p=-s.y+l*u,g=l*u*.57735*2,_=c*d-g,y=a.uBNotchBarProgress.value,b=new e.Vector2(-_*.5+y*_,p),x=a.uRNotchHRatio.value,S=s.y*2*x*.8*.5,C=a.uBeamAttachRatio.value,w=new e.Vector2(s.x,e.MathUtils.mapLinear(C,0,1,-S,S)),T=new e.Vector2().subVectors(w,b).normalize().multiplyScalar(2800),E=new e.Vector2().subVectors(w,f.pos);f.vel.add(T.clone().divideScalar(f.mass));let D=E.x*T.y-E.y*T.x;f.angVel+=D/f.getMOI(S),new v.Tween(a.uRNotchBarThickness).to({value:.002},300).easing(v.Easing.Back.Out).start(),setTimeout(()=>{m.isActive=!0,m.shouldSnapToAnchor=!1,m.vel.set(-100+Math.random()*-200,-100),m.angVel=(Math.random()-.5)*5,h.isActive=!0,h.shouldSnapToAnchor=!1,h.vel.set(-150+Math.random()*-200,-50),h.angVel=(Math.random()-.5)*5},100)},s.resetBarPhysics=()=>{f.isActive=!1,f.shouldSnapToAnchor=!0,f.pos.set(0,0),f.vel.set(0,0),f.rot=0,f.angVel=0,p.isActive=!1,p.pos.set(0,0),p.vel.set(0,0),p.rot=0,p.angVel=0,m.isActive=!1,m.pos.set(0,0),m.vel.set(0,0),m.rot=0,m.angVel=0,h.isActive=!1,h.pos.set(0,0),h.vel.set(0,0),h.rot=0,h.angVel=0};let g=performance.now();s.onBeforeRender=()=>{!a.uSpriteSheet.value&&V.spriteSheet&&(a.uSpriteSheet.value=V.spriteSheet);let n=performance.now(),r=Math.min(.032,(n-g)/1e3);g=n;let o=a.iTime.value,c=t.width||window.innerWidth,v=t.height||window.innerHeight,y=v*a.uMarginPct.value,b=v*(a.uMarginPct.value+a.uVerticalMarginPct.value),x=(c-y*2)*.5,S=(v-b*2)*.5;if(u++,n>l+1e3){Math.round(u*1e3/(n-l)),l=n,u=0;let e=c-y*2-$.CUT_SIZE*2;e*$.ISL_TO_MAIN_WRatio_NOT_FOUND||e*$.ISL_TO_MAIN_W_RATIO;let t=v-b*2;t*$.ISL_BAR_HEIGHT_RATIO,t*$.ISL_BAR_GAP_RATIO,t*$.ISL_BAR_MARGIN_Y_RATIO;let r=t*($.ISL_BAR_MARGIN_Y_RATIO*2+2*$.ISL_BAR_HEIGHT_RATIO+1*$.ISL_BAR_GAP_RATIO);$.CUT_SIZE+r-$.CORNER_RADIUS}let C=v*a.uMarginPct.value;v*(a.uMarginPct.value+a.uVerticalMarginPct.value);let w=(c-C*2)*.5;f.shouldSnapToAnchor&&f.pos.set(w,0);let T=S*2*a.uBNotchHRatio.value,E=-S+T;if(p.shouldSnapToAnchor&&p.pos.set(0,E),a.uRBarRot.value=f.rot,a.uRBarPos.value.copy(f.pos),a.uBBarRot.value=p.rot,a.uBBarPos.value.copy(p.pos),f.isActive||p.isActive||m.isActive||h.isActive){let e=-1200,t=.6,n=S*a.uRNotchHRatio.value*.8;if(f.isActive){f.vel.y+=e*r,f.pos.addScaledVector(f.vel,r),f.rot+=f.angVel*r,f.vel.multiplyScalar(.99),f.angVel*=.98;let i=-v*.5+5,o=c*.5-5;d[0].set(0,n),d[1].set(0,-n);let s=d;for(let e of s){let n=Math.sin(f.rot),r=Math.cos(f.rot),s=e.x*r-e.y*n,c=e.x*n+e.y*r,l=f.pos.x+s,u=f.pos.y+c;if(u<i){let e=i-u;f.pos.y+=e,f.vel.y=Math.abs(f.vel.y)*t,f.vel.x*=.95,f.angVel+=(l-f.pos.x)*f.vel.y*1e-4}if(l>o){let e=l-o;f.pos.x-=e,f.vel.x=-Math.abs(f.vel.x)*t,f.angVel+=(u-f.pos.y)*-f.vel.x*1e-4}if(l<-o){let e=-o-l;f.pos.x+=e,f.vel.x=Math.abs(f.vel.x)*t,f.angVel+=(u-f.pos.y)*f.vel.x*1e-4}if(!p.isActive){let e=x*2;S*2;let t=e*a.uBNotchWRatio.value;Math.abs(l)<t*.5&&Math.abs(u-E)<20&&(p.isActive=!0,p.shouldSnapToAnchor=!1,p.vel.addScaledVector(f.vel,.8),p.angVel=(Math.random()-.5)*10,p.vel.y-=200,f.vel.y*=-.5,f.angVel+=(Math.random()-.5)*5)}}}if(p.isActive){p.vel.y+=e*r,p.pos.addScaledVector(p.vel,r),p.rot+=p.angVel*r,-v*.5-200;let t=c*.5-5;(p.pos.x>t||p.pos.x<-t)&&(p.vel.x*=-.8)}let i=(t,n)=>{if(t.isActive){t.vel.y+=e*r,t.pos.addScaledVector(t.vel,r),t.rot+=t.angVel*r;let n=-v*.5,i=c*.5;t.pos.y<n&&(t.pos.y=n,t.vel.y=Math.abs(t.vel.y)*.6,t.vel.x*=.9,t.angVel*=.9),(t.pos.x>i||t.pos.x<-i)&&(t.vel.x*=-.8)}};i(m,0),i(h,1)}let D=a.uCutSize.value,O=new e.Vector2(x,S),k=S*2,A=(x*2-D*2)*a.uIslToMainWRatio.value,ee=k*a.uIslBarHeightRatio.value,te=k*a.uIslBarGapRatio.value,j=k*a.uIslBarMarginLeftRatio.value,M=k*a.uIslBarMarginRightRatio.value,ne=k*a.uIslBarMarginYRatio.value,N=e=>{let t=O.y-D-ne-re(e)*(ee+te)-ee*.5,n=t-O.y;return{x:(-O.x+j+n+(-O.x+A+n-M))*.5,y:t}},re=e=>e;if(!m.isActive){let e=N(0);m.pos.set(e.x,e.y),m.rot=0}if(a.uIslBar1Pos.value.copy(m.pos),a.uIslBar1Rot.value=m.rot,!h.isActive){let e=N(1);h.pos.set(e.x,e.y),h.rot=0}a.uIslBar2Pos.value.copy(h.pos),a.uIslBar2Rot.value=h.rot;let ie=o*$.DIAMOND_ROT_SPEED;a.uDiamondRot.value.set(Math.cos(ie),Math.sin(ie));let ae=a.uCutSize.value,oe=(c-y*2-ae*2)*a.uIslToMainWRatio.value,se=v-b,ce=y,P=ce+oe+ae+20,le=S*2,ue=$.ISL_BAR_MARGIN_Y_RATIO,de=$.ISL_BAR_HEIGHT_RATIO,fe=$.ISL_BAR_GAP_RATIO,pe=$.CORNER_RADIUS,me=ae+le*(ue*2+2*de+1*fe)-pe,he=se-me-20;if(t.points&&t.points.material&&t.points.material.uniforms.uMaskRect){t.points.material.uniforms.uMaskRect.value.set(ce,he,P,se);let e=ce+oe,n=se;t.points.material.uniforms.uMaskSlant&&t.points.material.uniforms.uMaskSlant.value.set(e,n);let r=me+$.CORNER_RADIUS,i=a.uNavGap?a.uNavGap.value:$.TL_GAP,o=a.uNavigatorVisibility?a.uNavigatorVisibility.value:1,s=0,l=a.uNavVis.value,u=a.uNavWH.value;for(let e=0;e<6;e++)l[e]>.01&&u[e]>.01&&(s+=r*u[e]+i);s>0&&(s-=i),s*=o;let d=c-y+$.CORNER_RADIUS+20,f=c-y+$.CORNER_RADIUS-s-i,p=v-b+$.CORNER_RADIUS+20,m=v-b+$.CORNER_RADIUS-me-i;t.points.material.uniforms.uMaskRectNav&&t.points.material.uniforms.uMaskRectNav.value.set(f,m,d,p)}let ge=S*2*a.uBNotchHRatio.value,_e=-S+ge;a.uPosStart.value.set(0,_e),a.uPosHead.value.set(0,_e);let ve=a.uVerticalMarginPct.value,F=a.uCutSize.value,ye=a.uIslToMainWRatio.value,be=ve>=.5,I=s._lastVMargin!==ve||s._lastCutSize!==F||s._lastIslW!==ye||s._lastResX!==c||s._lastResY!==v;if(_&&I&&!be){let e=y,t=b,n=S*2,r=n*a.uIslBarHeightRatio.value,o=n*a.uIslBarGapRatio.value,l=n*a.uIslBarMarginLeftRatio.value,u=n*a.uIslBarMarginYRatio.value,d=a.uCutSize.value;s._labelGroups&&s._labelGroups.forEach((n,i)=>{let a=t+d+u+i*(r+o)+r*.5,s=t-a,c=e+l+s,f=r*1.6;n.style.height=`${r}px`,n.style.fontSize=`${f}px`,n.style.transform=`translate(${c-20}px, ${a}px) translate(-100%, -50%)`;let p=n.querySelector(`.hud-label-text`);if(p){let t=c-e-25;p.style.maxWidth=`${t}px`}}),s._lastVMargin=ve,s._lastCutSize=d,s._lastIslW=ye,s._lastResX=c,s._lastResY=v,i()}if(s._navLabelGroups&&a.uNavCount&&a.uNavCount.value>0&&!be){let e=a.uNavGap?a.uNavGap.value:$.TL_GAP,t=S*2,n=a.uIslBarMarginYRatio.value*2+2*a.uIslBarHeightRatio.value+1*a.uIslBarGapRatio.value,r=$.CORNER_RADIUS,i=F+t*n+r,o=b-r,l=c-y+r,u=i*.32,d=0;s._navLabelGroups.forEach((t,n)=>{let r=a.uNavVis.value[n],s=a.uNavWH.value[n],c=i*s,f=a.uNavigatorVisibility?a.uNavigatorVisibility.value:1,p=r>.001&&s>.001&&f>.001,m=c*.02,h=l-d-c*.5+m,g=o+i*.5;t.style.left=`0`,t.style.top=`0`,t.style.width=`${c}px`,t.style.height=`${i}px`,t.style.fontSize=`${u}px`,t.style.transform=`translate(${h}px, ${g}px) translate(-50%, -50%)`,t.style.opacity=r*f,t.style.display=p?`flex`:`none`,p&&(d+=c+e)})}};let _=(()=>{let e=document.createElement(`div`);e.className=`hud-island-labels`,e.innerHTML=`
            <div class="hud-label-group"><span class="hud-label-text">FPS</span></div>
            <div class="hud-label-group"><span class="hud-label-text">PERF</span></div>
        `,s._labelGroups=Array.from(e.querySelectorAll(`.hud-label-group`));let n=document.createElement(`div`);n.className=`hud-nav-labels`,n.innerHTML=[,,,,,,].fill(0).map((e,t)=>`<div class="hud-nav-label-group" id="hud-nav-btn-${t}">
                <div class="hud-nav-label-content"></div>
                ${t===0?`
            <button id="cv-toggle-btn" class="hud-inline-toggle" aria-label="Toggle CV Panel">
                <div class="icon-lines">
                    <span></span><span></span><span></span><span></span>
                </div>
            </button>
        `:``}
            </div>`).join(``),s._navLabelGroups=Array.from(n.querySelectorAll(`.hud-nav-label-group`));let r=[``,`WORK`,`LAB`,`ABOUT`,``,``];return s._navLabelGroups.forEach((e,t)=>{let n=e.querySelector(`.hud-nav-label-content`);n&&(n.textContent=r[t]||``)}),s._navLabelGroups.forEach(e=>{e.style.pointerEvents=`auto`,e.style.cursor=`pointer`,e.addEventListener(`mouseenter`,()=>{typeof s.breathe==`function`&&s.breathe()})}),e.style.display=`none`,n.style.display=`none`,[...s._labelGroups,...s._navLabelGroups].forEach(e=>{e.style.position=`absolute`,e.style.display=`flex`,e.style.alignItems=`center`,e.style.justifyContent=`center`}),t.domElement&&(t.domElement.appendChild(e),t.domElement.appendChild(n)),s.navLabelsContainer=n,e})();s.labelsContainer=_,s.navButtons=[,,,,,,].fill(0).map((e,t)=>({show:(e=600,n=2)=>{s._navTweens&&s._navTweens[t]&&s._navTweens[t].stop(),s._navTweens||={},s._navTweens[t]=new v.Tween({ratio:a.uNavWH.value[t],vis:a.uNavVis.value[t]}).to({ratio:n,vis:1},e).easing(v.Easing.Cubic.InOut).onUpdate(e=>{a.uNavWH.value[t]=e.ratio,a.uNavVis.value[t]=e.vis}).onComplete(()=>{delete s._navTweens[t]}).start()},hide:(e=600)=>{s._navTweens&&s._navTweens[t]&&s._navTweens[t].stop(),s._navTweens||={},s._navTweens[t]=new v.Tween({ratio:a.uNavWH.value[t],vis:a.uNavVis.value[t]}).to({ratio:0,vis:0},e).easing(v.Easing.Cubic.InOut).onUpdate(e=>{a.uNavWH.value[t]=e.ratio,a.uNavVis.value[t]=e.vis}).onComplete(()=>{delete s._navTweens[t],a.uNavVis.value[t]=0,a.uNavWH.value[t]=0}).start()},setText:e=>{let n=s._navLabelGroups[t].querySelector(`.hud-nav-label-content`);n&&(n.textContent=e)},setRatio:(e,n=0)=>{n<=0?a.uNavWH.value[t]=e:new v.Tween({val:a.uNavWH.value[t]}).to({val:e},n).easing(v.Easing.Exponential.InOut).onUpdate(e=>{a.uNavWH.value[t]=e.val}).start()},setActive:e=>{let n=s._navLabelGroups[t];n&&(e?n.classList.add(`active`):n.classList.remove(`active`))}}));let y=()=>{if(!n)return;let e=t.renderer,r=e?e.domElement.clientWidth:window.innerWidth,i=e?e.domElement.clientHeight:window.innerHeight;a.iResolution&&a.iResolution.value.set(r,i)};y(),requestAnimationFrame(y),n.add(s),window.addEventListener(`resize`,y),n.syncHUD=y;let b=new e.Raycaster,x=new e.Vector2,S=!1,C=!1,w=!1;window.addEventListener(`mousemove`,r=>{let i=document.querySelector(`canvas`),o=i?i.getBoundingClientRect():{left:0,top:0,width:window.innerWidth,height:window.innerHeight};x.x=(r.clientX-o.left)/o.width*2-1,x.y=-((r.clientY-o.top)/o.height)*2+1;let l=new e.Vector2(x.x*.5+.5,x.y*.5+.5);if(b.setFromCamera(x,n),s.visible&&Math.abs(x.x)<=1&&Math.abs(x.y)<=1){let n=o.width,r=o.height,i=r*a.uMarginPct.value,s=r*(a.uMarginPct.value+a.uVerticalMarginPct.value),u=new e.Vector2(n-i*2,r-s*2).multiplyScalar(.5),d=new e.Vector2(l.x*n-n*.5,l.y*r-r*.5),f=u.x*2,p=u.y*2,m=p*a.uBNotchHRatio.value,h=-u.y+m;r*.5-s+m;let g=f*a.uBNotchWRatio.value,_=g*-.5*(1-a.uFlowerNotchPos.value.x)+g*.5*a.uFlowerNotchPos.value.x,y=-(r-s*2)*.5,x=y+m;y*(1-a.uFlowerNotchPos.value.y)+x*a.uFlowerNotchPos.value.y;let T=h,E=-r*.5,D=(T-E)*(n/r),O=d.y<T&&d.y>E,k=Math.abs(d.x-_)<D*.5,A=a.uCutSize.value,ee=(u.x*2-A*2)*a.uIslToMainWRatio.value,te=A+p*(a.uIslBarMarginYRatio.value*2+2*a.uIslBarHeightRatio.value+1*a.uIslBarGapRatio.value)-$.CORNER_RADIUS;c(d.x,d.y,u.x,u.y,te,ee,A)<5?C||(C=!0,t.orbitControls&&t.orbitControls.showEdgeUI&&t.orbitControls.showEdgeUI(),a.uIsAutoElec.value=1,a.uElecStartTime.value=a.iTime.value-$.DUR_FILL):C&&(C=!1,S||(a.uIsAutoElec.value=0,t.orbitControls&&t.orbitControls.hideEdgeUI&&t.orbitControls.hideEdgeUI()));let j=!1;if(t.knowhere&&t.knowhere.visible&&!O){let e=b.intersectObject(t.knowhere);if(e.length>0){let t=e[0].uv,n=t.x*2-1,r=t.y*2-1;Math.sqrt(n*n+r*r)<.9&&(j=!0)}}if(O&&k){if(!S){if(S=!0,a.uFlowerGlow.value=$.FLOWER_GLOW_HOVER,new v.Tween(a.uFlowerGlitch).to({value:1},150).easing(v.Easing.Exponential.Out).start(),t.points){let e=t.points,n=e.getCurrentStep?e.getCurrentStep():0,r=e.material;if(r){n===0&&e.dipperLines&&(e.dipperLines.userData.opacity=1);let t=r.uniforms.uKnowhereGravity.value,i=e.targetKnowhereGravity===void 0?t:e.targetKnowhereGravity,a=r.uniforms.uKnowhereGravityMultiplier?r.uniforms.uKnowhereGravityMultiplier.value:-1,o=r.uniforms.uKnowhereGravityHoverFactor?r.uniforms.uKnowhereGravityHoverFactor.value:50,s=i*a*o;r.uniforms.uIsGardenHovering&&(r.uniforms.uIsGardenHovering.value=1);let c=r.uniforms.uKnowhereRadius.value,l=e.targetChargeUpDur===void 0?$.GARDEN_HOVER_TWEEN_DUR:e.targetChargeUpDur;e.knowhereTween&&e.knowhereTween.stop(),e.knowhereTween=new v.Tween({g:t,r:c}).to({g:s,r:1e5},l).easing(v.Easing.Exponential.InOut).onUpdate(e=>{r.uniforms.uKnowhereGravity.value=e.g,r.uniforms.uKnowhereRadius.value=e.r}).onComplete(()=>{e.knowhereTween=null}).start()}}window.dispatchEvent(new CustomEvent(zs.GARDEN.HOVER_START))}}else if(S){if(S=!1,new v.Tween(a.uFlowerGlow).to({value:$.FLOWER_GLOW_BASE},800).easing(v.Easing.Cubic.Out).start(),new v.Tween(a.uFlowerGlitch).to({value:0},800).easing(v.Easing.Cubic.Out).start(),t.points){let e=t.points,n=e.material;if(n){e.dipperLines&&(e.dipperLines.userData.opacity=0);let t=n.uniforms.uKnowhereGravity.value,r=n.uniforms.uKnowhereRadius.value,i=e.targetKnowhereGravity===void 0?50:e.targetKnowhereGravity,a=e.targetKnowhereRadius===void 0?200:e.targetKnowhereRadius,o=e.targetCollapseOutDur===void 0?800:e.targetCollapseOutDur;e.knowhereTween&&e.knowhereTween.stop(),e.knowhereTween=new v.Tween({g:t,r}).to({g:i,r:a},o).easing(v.Easing.Exponential.InOut).onUpdate(e=>{n.uniforms.uKnowhereGravity.value=e.g,n.uniforms.uKnowhereRadius.value=e.r}).onComplete(()=>{e.knowhereTween=null,n.uniforms.uIsGardenHovering&&!w&&!S&&(n.uniforms.uIsGardenHovering.value=0)}).start()}}window.dispatchEvent(new CustomEvent(zs.GARDEN.HOVER_END))}if(j){if(!w&&t.points){let e=t.points,n=e.getCurrentStep?e.getCurrentStep():0;if(n===0||n===1){w=!0;let t=e.material;if(t){n===0&&e.dipperLines&&(e.dipperLines.userData.opacity=1);let r=t.uniforms.uKnowhereGravity.value,i=e.targetKnowhereGravity===void 0?r:e.targetKnowhereGravity,a=t.uniforms.uKnowhereGravityMultiplier?t.uniforms.uKnowhereGravityMultiplier.value:-1,o=t.uniforms.uKnowhereGravityHoverFactor?t.uniforms.uKnowhereGravityHoverFactor.value:50,s=i*a*o*-1;t.uniforms.uIsGardenHovering&&(t.uniforms.uIsGardenHovering.value=1);let c=t.uniforms.uKnowhereRadius.value,l=t.uniforms.uKnowhereVibrateBoost?t.uniforms.uKnowhereVibrateBoost.value:0;e.knowhereTween&&e.knowhereTween.stop(),e.knowhereTween=new v.Tween({g:r,r:c,v:l}).to({g:s,r:1e5,v:2},3e3).easing(v.Easing.Exponential.InOut).onUpdate(e=>{t.uniforms.uKnowhereGravity.value=e.g,t.uniforms.uKnowhereRadius.value=e.r,t.uniforms.uKnowhereVibrateBoost&&(t.uniforms.uKnowhereVibrateBoost.value=e.v)}).onComplete(()=>{e.knowhereTween=null}).start()}}}}else if(w&&(w=!1,t.points)){let e=t.points,n=e.material;if(n){e.dipperLines&&(e.dipperLines.userData.opacity=0);let t=n.uniforms.uKnowhereGravity.value,r=n.uniforms.uKnowhereRadius.value,i=n.uniforms.uKnowhereVibrateBoost?n.uniforms.uKnowhereVibrateBoost.value:0,a=e.targetKnowhereGravity===void 0?50:e.targetKnowhereGravity,o=e.targetKnowhereRadius===void 0?200:e.targetKnowhereRadius;e.knowhereTween&&e.knowhereTween.stop(),e.knowhereTween=new v.Tween({g:t,r,v:i}).to({g:a,r:o,v:0},1500).easing(v.Easing.Exponential.InOut).onUpdate(e=>{n.uniforms.uKnowhereGravity.value=e.g,n.uniforms.uKnowhereRadius.value=e.r,n.uniforms.uKnowhereVibrateBoost&&(n.uniforms.uKnowhereVibrateBoost.value=e.v)}).onComplete(()=>{e.knowhereTween=null,n.uniforms.uIsGardenHovering&&!w&&!S&&(n.uniforms.uIsGardenHovering.value=0)}).start()}}}}),s.breathe=async function(e=null){e?a.uBreathColor.value.copy(e):a.uBreathColor.value.copy(I.ELECTRIC_CYAN),new v.Tween(a.uBreathIntensity).to({value:1},1400).easing(v.Easing.Cubic.InOut).start(),await T(1400),new v.Tween(a.uBreathIntensity).to({value:0},2400).easing(v.Easing.Cubic.InOut).start()},s.startBreathing=function(e=null){if(s._isBreathingLoop)return;s._isBreathingLoop=!0,e&&a.uBreathColor.value.copy(e);let t=()=>{s._isBreathingLoop&&(s._breathTween=new v.Tween(a.uBreathIntensity).to({value:1},1400).easing(v.Easing.Cubic.InOut).onComplete(n).start())},n=()=>{s._isBreathingLoop&&(s._breathTween=new v.Tween(a.uBreathIntensity).to({value:0},2400).easing(v.Easing.Cubic.InOut).onComplete(t).start())};t()},s.stopBreathing=function(){s._isBreathingLoop=!1,s._breathTween&&(s._breathTween.stop(),new v.Tween(a.uBreathIntensity).to({value:0},1e3).easing(v.Easing.Cubic.InOut).start())},s.tweenDeco=function(e=`showDeco`,t=2e3,n=0){let r={value:0},i=a.uFlowerRotation.value,o=a.uHeadSpriteSize.value,s=Us[e].FLOWER_ROTATION,c=Us[e].HEAD_SPRITE_SIZE;return new v.Tween(r).to({value:1},t).easing(v.Easing.Cubic.InOut).delay(n).onUpdate(e=>{let t=e.value;a.uFlowerRotation.value=i+(s-i)*t,a.uHeadSpriteSize.value=o+(c-o)*t}).start()};function T(e){return new Promise(t=>setTimeout(t,e))}async function E(e,t,n=0,r=v.Easing.Cubic.InOut){for(let i in e)D(i,e[i],t,n,r);await T(t+n)}function D(e,t,n,r=0,i=co){if(a[e])return new v.Tween(a[e]).to({value:t},n).delay(r).easing(i).start()}return s.runTweenHideRNotch=async function(e=1e3){s.applyBeamImpulse(),await E({uRNotchHRatio:0,uRNotchWRatio:0,uRNotchBarThickness:$.R_NOTCH_BAR_THICKNESS,uRNotchBarProgress:0,uBNotchBarAlpha:0},e),setTimeout(()=>s.resetBarPhysics(),e+2e3)},s.runTweenShowRNotch=async function(e){await E({uRNotchHRatio:$.R_NOTCH_H_RATIO,uRNotchWRatio:$.R_NOTCH_W_RATIO,uRNotchBarThickness:$.R_NOTCH_BAR_THICKNESS,uRNotchBarProgress:$.R_NOTCH_BAR_PROGRESS},e)},s.runTweenHideIsland=async function(e=1e3){s.labelsContainer&&(s.labelsContainer.style.display=`none`),s.navLabelsContainer&&(s.navLabelsContainer.style.display=`none`),s.navButtons&&s.navButtons.forEach(t=>t.hide(e*.5)),m.isActive=!0,m.vel.set(-100+Math.random()*-200,-100),m.angVel=(Math.random()-.5)*5,h.isActive=!0,h.vel.set(-150+Math.random()*-200,-50),h.angVel=(Math.random()-.5)*5,await E({uIslBarMarginRightRatio:.4},.5*e),await E({uIslToMainWRatio:-1},.5*e)},s.runTweenShowIsland=async function(e=2e3){s.breathe(),s.resetBarPhysics(),s.navButtons&&(s.navButtons[0].show(e*.5,1),s.navButtons[1].show(e*.5,2.2),s.navButtons[2].show(e*.5,1.8),s.navButtons[3].show(e*.5,2)),E({uIslBarMarginRightRatio:.02},1*e),E({uIslToMainWRatio:.32},.5*e),s.labelsContainer&&(s.labelsContainer.style.display=`block`),s.navLabelsContainer&&(s.navLabelsContainer.style.display=`block`)},s.isOpen=!0,s.isTweening=!1,s.runTweenClose=async function(e=2e3){if(s.isTweening)return;s.isTweening=!0,s.isOpen=!1,s.breathe(),D(`uGridLock`,1,300),t.orbitControls&&t.orbitControls.showEdgeUI&&t.orbitControls.showEdgeUI(),a.uIsAutoElec.value=1,a.uElecStartTime.value=a.iTime.value-$.DUR_FILL;let n=e;await s.runTweenHideIsland(n*.2),await s.runTweenHideDecos(.2*n),await E({uCutSize:0,uBNotchHRatio:0,uBNotchWRatio:0,uFlowerScale:.1,uRNotchHRatio:0,uRNotchWRatio:0},.2*n),await E({uGrokScaleFactor:.05,uVerticalMarginPct:.5},.4*n),await T(500),a.uIsAutoElec.value=0,D(`uGridLock`,0,600),t.orbitControls&&t.orbitControls.hideEdgeUI&&t.orbitControls.hideEdgeUI(),s.isTweening=!1},s.runTweenOpen=async function(e=1800,{isIncludedIsland:n=!0,isIncludedDecos:r=!0}={}){if(s.isTweening)return;s.isTweening=!0,s.breathe(),D(`uGridLock`,1,500,0,v.Easing.Cubic.Out),t.orbitControls&&t.orbitControls.showEdgeUI&&t.orbitControls.showEdgeUI(),a.uIsAutoElec.value=1,a.uElecStartTime.value=a.iTime.value-$.DUR_FILL*.4,await E({uVerticalMarginPct:0},.4*e),await E({uCutSize:10,uBNotchHRatio:.02,uBNotchWRatio:.6,uFlowerScale:2.19,uRNotchHRatio:.4,uRNotchWRatio:.02},.2*e),r&&await s.runTweenShowDecos(.2*e),n&&await s.runTweenShowIsland(.2*e),await T(300);let i=a.iTime.value,o=a.uElecStartTime.value,c=$.DUR_FILL+$.DUR_HOLD+$.DUR_WIPE+$.DUR_PAUSE,l=(i-o)%c,u=$.DUR_FILL+$.DUR_HOLD,d=u+$.DUR_WIPE,f=0;if(l<u){let e=u-l;a.uElecStartTime.value-=e,f=$.DUR_WIPE*1e3}else l<d&&(f=(d-l)*1e3);f>0&&await T(f),a.uIsAutoElec.value=0,D(`uGridLock`,0,800),t.orbitControls&&t.orbitControls.hideEdgeUI&&t.orbitControls.hideEdgeUI(),await T(800),D(`uGrokScaleFactor`,.45,.75*e),s.isOpen=!0,s.isTweening=!1,window.dispatchEvent(new CustomEvent(`hudOpened`))},s.toggleGarden=function(){a.uIsGardenFlower.value=1-a.uIsGardenFlower.value},s.runTweenHideDecos=async function(e=2e3,t=null){await E({uFlowerRotation:$.FLOWER_ROTATION,uHeadSpriteSize:$.HEAD_SPRITE_SIZE,uGrokOffsetY:-2},e*.95),await E({uFlowerScale:$.FLOWER_SCALE},e*.05),t&&t()},s.runTweenShowDecos=async function(e=2e3){await E({uFlowerScale:2.19},e*.05),await E({uFlowerRotation:0,uHeadSpriteSize:0,uGrokOffsetY:0},e*.95)},window.addEventListener(`keydown`,e=>{let n=e.key.toLowerCase();if(n===`l`){if(s.isTweening||t&&t.isTransitioning){console.log(`[HUD] Toggle blocked: System busy.`);return}s.isOpen?s.runTweenClose():s.runTweenOpen()}n===`f`&&s.tweenFallRightBar()}),s.tweenFallRightBar=function(){if(f.isActive)return;let n=t.height||window.innerHeight,r=(n-n*(a.uMarginPct.value+a.uVerticalMarginPct.value)*2)*.5*a.uRNotchHRatio.value*.8;f.isActive=!0;let i=new e.Vector2(1200,400),o=new e.Vector2(0,r);f.vel.add(i.clone().divideScalar(f.mass));let s=o.x*i.y-o.y*i.x;f.angVel+=s/f.getMOI(r),setTimeout(()=>{m.isActive=!0,m.vel.set(-100+Math.random()*-200,-100),m.angVel=(Math.random()-.5)*5,h.isActive=!0,h.vel.set(-150+Math.random()*-200,-50),h.angVel=(Math.random()-.5)*5},100),setTimeout(()=>{f.isActive=!1,p.isActive=!1,m.isActive=!1,h.isActive=!1},4e3)},s.setGardenMode=e=>{a.uIsGardenFlower.value=e?1:0},s.tweenGardenMode=(e,t=800)=>new v.Tween(a.uIsGardenFlower).to({value:e?1:0},t).easing(v.Easing.Cubic.InOut).start(),s}function Hs(){return`
precision highp float;
uniform float iTime, uMarginPct, uVerticalMarginPct, uIslToMainWRatio;
uniform float uBNotchWRatio, uBNotchHRatio, uRNotchHRatio, uRNotchWRatio, uCutSize;
uniform float uIsAutoElec, uElecStartTime, uFlowerGlow, uFlowerRotation, uHeadSpriteSize, uHeadScale, uFlowerGlitch, uGridLock, uRNotchVibeB, uRNotchVibeT, uBNotchBarProgress, uBNotchBarAlpha, uBNotchBarMarginX, uBNotchBarMarginY, uRNotchBarProgress, uRNotchBarThickness, uNavCount, uNavigatorVisibility, uNavGap, uNavCutSize, uIsGardenFlower, uGrokScaleFactor, uGrokOffsetY;
uniform float uNavVis[6], uNavWH[6];
uniform float uBreathAutoStrength, uBreathManualStrength;
uniform vec2 uRBarPos;
uniform float uRBarRot;
uniform vec2 uBBarPos;
uniform float uBBarRot;
uniform vec2 uIslBar1Pos, uIslBar2Pos;
uniform float uIslBar1Rot, uIslBar2Rot;
uniform float uBeamMaxHeight, uBeamWaveThickness, uBeamBaseThickness, uBeamBloom, uBeamWobble, uBeamGlowStrength, uBeamSpeed, uBeamFreq, uBeamTrimRatio, uBeamGrowth, uBeamAttachRatio;
uniform vec3 uBNotchBarColor, uRNotchBarActiveColor, uRNotchBarInactiveColor, uBeamColor;
uniform vec3 uFlowerColor;
uniform vec2 iResolution, uPosStart, uPosHead, uDiamondRot;
varying vec2 vUv;

const vec3 BORDER_COLOR = ${Ws($.BORDER_COLOR)};
uniform vec3 uOutsideColor;
const vec3 ERR_RED = ${Gs.COLORS.BAD};
uniform float uBorderThickRatio; 
uniform float uBreathIntensity;
uniform vec3 uBreathColor;
const float NOTCH_ANGLE = ${$.NOTCH_ANGLE.toFixed(4)}, RIGHT_NOTCH_ANGLE = ${$.RIGHT_NOTCH_ANGLE.toFixed(4)}; 
const float TL_GAP = ${$.TL_GAP.toFixed(4)}, CORNER_RADIUS = ${$.CORNER_RADIUS.toFixed(4)};
const float PATTERN_WIDTH = ${$.PATTERN_WIDTH.toFixed(4)}, PATTERN_GAP = ${$.PATTERN_GAP.toFixed(4)}, PATTERN_LINE_THICK = ${$.PATTERN_LINE_THICK.toFixed(4)}, PATTERN_HEIGHT_PCT = ${$.PATTERN_HEIGHT_PCT.toFixed(4)}; 

uniform float uGridSize;
uniform float uGridThickness;
uniform float uGridPulseSpeed;
uniform float uGridPulseDensity;
const float R_NOTCH_BAR_DIAMOND_SIZE = ${$.R_NOTCH_BAR_DIAMOND_SIZE.toFixed(4)};
uniform float uIslBarHeightRatio, uIslBarGapRatio, uIslBarMarginLeftRatio, uIslBarMarginRightRatio, uIslBarMarginYRatio;
uniform float uIslBarProgress1, uIslBarProgress2;
const float ELEC_SPEED = ${$.ELEC_SPEED.toFixed(4)}, ELEC_FREQUENCY = ${$.ELEC_FREQUENCY.toFixed(4)}, ELEC_INTENSITY = ${$.ELEC_INTENSITY.toFixed(4)}; 
const float SPRITE_INDEX = ${$.SPRITE_INDEX.toFixed(1)}, SPRITE_COLS = ${$.SPRITE_COLS.toFixed(1)}, SPRITE_ROWS = ${$.SPRITE_ROWS.toFixed(1)};   
const float DUR_FILL = ${$.DUR_FILL.toFixed(4)}, DUR_HOLD = ${$.DUR_HOLD.toFixed(4)}, DUR_WIPE = ${$.DUR_WIPE.toFixed(4)}, DUR_PAUSE = ${$.DUR_PAUSE.toFixed(4)}; 
const float SURGE_GRID_SIZE_PX = ${$.SURGE_GRID_SIZE_PX.toFixed(4)}, SURGE_GRID_THICK_PX = ${$.SURGE_GRID_THICK_PX.toFixed(4)}, RING_SPEED = ${$.RING_SPEED.toFixed(4)}, RING_INTENSITY = ${$.RING_INTENSITY.toFixed(4)};
uniform sampler2D uSpriteSheet;

// --- FLOWER / FIREFLY CONSTANTS ---
const float pi = 3.1415926;
const int FLY_COUNT = 40;
uniform float uFlyCount, uFlySpeed, uFlowerWind, uFlowerScale;
uniform vec2 uFlowerNotchPos;

float hash(float n) { return fract(sin(n) * 43758.5453123); }

// --- FLOWER / FIREFLY HELPERS ---
float pingPong(float v) {
    const float amplitude = 1.;
    const float t = pi * 2.0;
    float k = 4.0*amplitude / t;
    float r = mod(v, t);
    float d = floor(v / (0.5 * t));
    return mix(k * r - amplitude, amplitude * 3. - k * r, mod(d, 2.0));
}

float getRad(vec2 q) {
    return atan(q.y, q.x);
}

vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1. + 2.*fract(sin(p) * 53758.5453123);
}

vec2 noise2(vec2 tc) { return hash2(tc); }

float firefly(vec2 p, float size) {
    // Inverted from original snippet usage: We want 1.0 at center, 0.0 at edge
    return 1.0 - smoothstep(0.0, size, length(p));
}

// Modified drawFlower to output color directly with alpha handling
vec4 drawFlower(vec4 current, vec2 p, vec2 flowerP, float t, float count, float ratio) {
    // Coordinate shift (from original shader)
    // Linked uFlowerWind to the sway amplitude
    vec2 q = p - flowerP - vec2(uFlowerWind * cos(3.0*iTime), uFlowerWind * sin(3.0*iTime));
    vec2 rootP = p - flowerP - vec2(0.02 * cos(3.0*iTime) * p.y, -0.48 + uFlowerWind * sin(3.0*iTime));
    
    // Scale Y by ratio to maintain aspect if needed (logic from original)
    q.y *= ratio;
    
    vec3 col = current.rgb;
    float alpha = current.a;

    // Stem
    float width = 0.01;
    float h = 0.5;
    float w = 0.0005;
    
    float stemMask = (1.0 - smoothstep(h, h + width, abs(rootP.y))) * 
                     (1.0 - smoothstep(w, w + width, abs(rootP.x - 0.1 * sin(4.0 * rootP.y + pi * 0.35))));
    
    vec3 stemCol = vec3(0.5, 0.7, 0.4); // Keep stem green? Or make it sci-fi? User said "petals". I'll keep stem green for contrast.
    col = mix(col, stemCol, stemMask);
    alpha = max(alpha, stemMask);

    // Flower - Using uFlowerColor
    vec3 petalBase = uFlowerColor * 0.5; 
    vec3 petalTip = mix(uFlowerColor, vec3(1.0), 0.5); 
    
    vec3 flowerCol = mix(petalBase, petalTip, smoothstep(0.0, 1.0, length(q) * 10.0));
    
    // --- FLOWER GLOW ENHANCEMENT ---
    flowerCol += uFlowerGlow * uFlowerColor * pow(clamp(1.0 - length(q) * 4.0, 0.0, 1.0), 3.0) * 2.0;
    
    float r = 0.1 + 0.05 * (pingPong(getRad(q) * count + 2.*q.x * (t - 1.0)));
    float flowerMask = smoothstep(r, r + 0.02, length(q)); // 0 = flower, 1 = background
    
    // Inverse mask because original code mixed (flower, col, mask) where 1 was col.
    // So mask < 1 is flower.
    float fMask = 1.0 - flowerMask;
    col = mix(col, flowerCol, fMask);
    alpha = max(alpha, fMask);

    // Buds
    float r1 = 0.04;
    vec3 budCol = mix(uFlowerColor * 0.8, vec3(1.0), length(q) * 10.0);
    // Bud Glow
    budCol += uFlowerGlow * vec3(1.0) * pow(clamp(1.0 - length(q) * 20.0, 0.0, 1.0), 2.0) * 3.0;
    
    float budMask = 1.0 - smoothstep(r1, r1 + 0.01, length(q));
    col = mix(col, budCol, budMask);
    alpha = max(alpha, budMask);

    return vec4(col, alpha);
}

vec4 drawGrok(vec4 current, vec2 pGrok) {
    // Singularity Pulse: Activated by hover (uFlowerGlow 1.0 -> 1.5)
    float hoverFactor = clamp((uFlowerGlow - 1.0) / 0.5, 0.0, 1.0);
    
    // Double-heartbeat modulation logic
    float pulseSlow = sin(iTime * 3.0) * 0.5 + 0.5;
    float pulseFast = sin(iTime * 15.0) * 0.5 + 0.5;
    
    // Ring radius breathes smoothly, Slash fluctuates like a digital data-stream
    float ringMod = (pulseSlow * 0.04 + pulseFast * 0.01) * hoverFactor;
    float slashMod = (pulseFast * 0.02) * hoverFactor;

    // Math logic from Grok snippet with pulse modulation
    float gDist = length(pGrok) - (0.5 + ringMod) + (0.01 + slashMod) / (pGrok.x - pGrok.y + 1e-5);
    float grokI = 0.1 / abs(gDist);
    
    // Tint with theme
    vec3 col = uFlowerColor * grokI;
    // Digital "Glow" enhancement (White-hot core)
    col += vec3(1.0) * pow(clamp(grokI * 0.4, 0.0, 1.0), 3.0);
    
    float alpha = clamp(grokI, 0.0, 1.0);
    return vec4(mix(current.rgb, col, alpha), max(current.a, alpha));
}


float noise(float x) {
    float i = floor(x), f = fract(x);
    return mix(hash(i), hash(i + 1.0), f * f * (3.0 - 2.0 * f));
}
float fbm(float x) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 3; ++i) { v += a * noise(x); x = x * 2.0 + 100.0; a *= 0.5; }
    return v;
}
float getNotchDist(vec2 p, float w, float h, float a) {
    float ar = radians(a);
    return max(dot(vec2(abs(p.x), p.y) - vec2(w * 0.5, 0.0), vec2(sin(ar), cos(ar))), p.y - h);
}
float sdRhombus(vec2 p, float s) { return abs(p.x) + abs(p.y) - s; }
float sdVerticalLine(vec2 p, float h, float t) {
    vec2 d = abs(p) - vec2(t, h); return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}
float sdBox2D(vec2 p, vec2 b) {
    vec2 d = abs(p) - b; return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}
float sdIslandShape(vec2 p, vec2 bs, float h, float w, float tc) {
    float top = bs.y, left = -bs.x;
    float dTL = dot(p - vec2(left + tc, top), vec2(-0.7071, 0.7071));
    float dRight = dot(p - vec2(left + w, top), vec2(0.7071, -0.7071));
    float dShape = max(max(p.y - top, -(p.x - left)), -(p.y - (bs.y - h)));
    return max(max(dShape, dRight), dTL);
}

float sdMainFrame(vec2 p, vec2 bs) {
    // Distance to the basic AABB box
    float dBox = max(abs(p.x) - bs.x, abs(p.y) - bs.y);

    float dCorner = (abs(p.x) + abs(p.y) - (bs.x + bs.y - uCutSize)) * 0.7071;
    if (p.x > 0.0 && p.y > 0.0) dCorner = -1e5; // Exclude top-right corner
    float dFrame = max(dBox, dCorner) - CORNER_RADIUS;
    
    vec2 mw = bs * 2.0;
    float dNotchB = mix(1e5, getNotchDist(vec2(p.x, p.y + bs.y), mw.x * uBNotchWRatio, mw.y * uBNotchHRatio, NOTCH_ANGLE), step(0.001, uBNotchHRatio));
    float dNotchR = mix(1e5, getNotchDist(vec2(p.y, bs.x - p.x), mw.y * uRNotchHRatio, mw.x * uRNotchWRatio, RIGHT_NOTCH_ANGLE), step(0.001, uRNotchHRatio));
    
    float islH = uCutSize + mw.y * (uIslBarMarginYRatio * 2.0 + 2.0 * uIslBarHeightRatio + 1.0 * uIslBarGapRatio);
    float navButtonHeight = islH + CORNER_RADIUS;
    
    float navW = 0.0;
    for (int i = 0; i < 6; i++) {
        if (uNavVis[i] > 0.01 && uNavWH[i] > 0.01) {
            navW += (navButtonHeight * uNavWH[i] + uNavGap);
        }
    }
    if (navW > 0.0) navW -= uNavGap;
    navW *= uNavigatorVisibility;

    float dSocket = sdIslandShape(p, bs, islH - CORNER_RADIUS, mw.x * uIslToMainWRatio, uCutSize) - TL_GAP - CORNER_RADIUS;
    
    // Navigator Socket (Top Right)
    float xGrpR = bs.x + CORNER_RADIUS;
    float xGrpL = xGrpR - navW;
    float yGrpT = bs.y + CORNER_RADIUS;
    float yGrpB = bs.y - islH;
    
    float dNavHole = max(max(p.y - (yGrpT + 10.0), -(p.y - (yGrpB - uNavGap))), max(p.x - (xGrpR + 10.0), -(p.x - (xGrpL - uNavGap))));
    float dNavSocket = mix(1e5, dNavHole, step(0.01, uNavigatorVisibility));
    
    return max(max(max(dFrame, -min(dNotchB, dNotchR)), -dSocket), -dNavSocket);
}
vec3 getSpriteLight(vec2 p, vec2 center, float size) {
    vec2 o = (p - center);
    float d = length(o);
    
    // 1. Atmospheric Glow (Halo effect outside the quad)
    float gDist = d / (size * 1.5);
    vec3 glow = BORDER_COLOR * pow(0.5 / (gDist + 0.15), 2.0) * 0.8;
    glow += vec3(1.0) * (0.005 / (gDist * gDist + 0.005)) * smoothstep(1.0, 0.0, gDist); 

    // 2. Sprite Sampling
    vec2 rotO = mat2(uDiamondRot.x, -uDiamondRot.y, uDiamondRot.y, uDiamondRot.x) * (o / uHeadScale);
    vec2 uv = (rotO / size) * 0.5 + 0.5;
    
    vec3 core = vec3(0.0);
    if (uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0) {
        float colIdx = mod(SPRITE_INDEX, SPRITE_COLS);
        float rowIdx = floor(SPRITE_INDEX / SPRITE_COLS);
        vec2 atlasUV = uv / vec2(SPRITE_COLS, SPRITE_ROWS) + vec2(colIdx / SPRITE_COLS, (SPRITE_ROWS - 1.0 - rowIdx) / SPRITE_ROWS);
        vec4 tex = texture2D(uSpriteSheet, atlasUV);
        
        // Brilliant White Core: Mix theme into white based on texture density
        core = mix(BORDER_COLOR * 0.5, vec3(2.5), pow(tex.a, 1.5)) * tex.a;
    }
    
    // 3. Falloff to prevent hard edges at optimization boundary
    // Fade out completely by 6x radius or 100px max
    float maxDist = max(size * 6.0, 80.0);
    float falloff = 1.0 - smoothstep(maxDist * 0.8, maxDist, d);
    
    return (core + glow) * falloff;
}
float getDiamondDistOpt(vec2 p, vec2 c, float s) {
    vec2 o = p - c; o = mat2(uDiamondRot.x, -uDiamondRot.y, uDiamondRot.y, uDiamondRot.x) * o;
    return abs(o.x) + abs(o.y) - s;
}

// --- NEW: Square Electric Grid Logic ---
float calcSquareDistance(vec2 p) {
    return max(abs(p.x), abs(p.y));
}

vec2 calcSquareOffset(vec2 uv) {
    return fract(uv + 0.5) - 0.5;
}

float beam(vec2 uv, vec2 p1, vec2 p2, float max_height, float offset, float speed, float freq, float thickness) {
    vec2 dir = p2 - p1;
    float len = length(dir);
    if(len < 1.0) return 0.0;
    vec2 unit_dir = dir / len;
    vec2 rel_uv = uv - p1;
    
    float t = dot(rel_uv, unit_dir) / len;
    t = clamp(t, 0.0, 1.0);
    
    vec2 projection = unit_dir * t * len;
    float dist = length(rel_uv - projection);

    float height = max_height * (uBeamWobble + (1.0 - t));
    float ramp = smoothstep(0.0, 0.1, t) * smoothstep(1.0, 0.9, t);
    height *= ramp;

    // Use normalized length for frequency to stay resolution independent
    float wave = sin(t * freq * 100.0 - iTime * speed + offset) * height;
    
    // Optimized core: Reduced softening bias (0.5 -> 0.1) for a "hotter" center
    float core = thickness / (abs(dist + wave) + 0.1); 
    core = pow(core, uBeamBloom);
    
    // Improved glow: Slower exponential decay (0.15 -> 0.06) for a more voluminous aura
    float ambientGlow = exp(-dist * 0.06) * uBeamGlowStrength;
    
    return max(0.0, (core + ambientGlow));
}

void main() {
    vec2 res = iResolution.xy; vec2 p = vUv * res - res * 0.5;
    float resX = res.x;
    float resY = res.y;
    float hMargin = resY * uMarginPct; 
    float vMargin = resY * (uMarginPct + uVerticalMarginPct);
    vec2 bs = vec2(res.x - hMargin * 2.0, res.y - vMargin * 2.0) * 0.5;
    float mw = bs.x * 2.0;
    float mh = bs.y * 2.0;
    bool inBottomNotchZone = (abs(p.x) < (mw * uBNotchWRatio * 0.5 + 5.0) && p.y < -bs.y + mh * uBNotchHRatio + 5.0);

    // --- GARDEN LAYER START ---
    
    // Calculate Bottom Notch Height (The "Garden" Height)
    float bNotchH = mh * uBNotchHRatio;
    // Notch depth (vertical) depends on angle and width, but uBNotchHRatio is the 'depth' param?
    // In HUD_CONFIG: B_NOTCH_TO_MAIN_H_RATIO is depth.
    // getNotchDist uses getNotchDist(px, py + bs.y...)
    // Bottom edge of main frame is -bs.y.
    // Notch is carved UP from there? No, notches are usually cutouts.
    // Wait, getNotchDist logic: dWall = ... dTop = py - h.
    // For bottom notch: p.y + bs.y is relative Y from bottom edge.
    // So notch extends UP into the frame by H? Or is it an extension?
    // "Cutout" implies it eats INTO the frame, so it adds more "empty" space above -bs.y.
    // User wants flowers at the bottom margin + notch.
    // The margin is the space between screen bottom (-resY/2) and frame bottom (-bs.y).
    // The notch cuts INTO the frame, so it adds more "empty" space above -bs.y.
    // So gardenTop = -bs.y + bNotchH (approx).
    
    float gardenCeiling = -bs.y + bNotchH; // Top of the notch cutout area
    float gardenFloor = -resY * 0.5; // Bottom of the screen
    float gardenHeight = gardenCeiling - gardenFloor;

    vec4 gardenLayer = vec4(0.0);
    
    // Only render garden if we are low enough (Optimization)
    if (p.y < gardenCeiling + 20.0) {
        // Calculate Notch Position Logic
        // Notch Width (mw is full width * 2? No, mw is bs.x * 2.0 = Full Width - Margins)
        // uBNotchWRatio is relative to mw.
        float notchW = mw * uBNotchWRatio;
        float notchLeft = -notchW * 0.5;
        float notchRight = notchW * 0.5;
        
        // Target X position in pixel coords (relative to center 0)
        float targetX = mix(notchLeft, notchRight, uFlowerNotchPos.x);
        
        // Target Y Position
        // 0 = Bottom of Notch (Frame Bottom Edge: -bs.y)
        // 1 = Top of Notch (gardenCeiling: -bs.y + bNotchH)
        float notchBottom = -bs.y;
        float notchTop = -bs.y + bNotchH;
        float targetY = mix(notchBottom, notchTop, uFlowerNotchPos.y);

        // --- 2D Rotation (Pivoted at the ROOT / Bottom Center) ---
        // targetY is the petal center. Root is roughly 1.0 gardenHeight below.
        vec2 pivot = vec2(targetX, targetY - gardenHeight);
        vec2 pr = p - pivot;
        float ang = -uFlowerRotation; 
        mat2 mRot = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
        pr = mRot * pr + pivot;

        // We want gx=0, gy=0 (flower root center) to map to (targetX, targetY).
        float gy = (pr.y - targetY) / gardenHeight;
        float gx = (pr.x - targetX) / gardenHeight;

        vec2 flowerP = vec2(gx + 0.5, gy); // 0.5 is center X in flower logic
        
        float ratio = 1.0; 

        float t = 1.0 * (1. + sin(3.0 * iTime));
        
        if (uIsGardenFlower > 0.5) {
            // --- RESTORED: Original Flower State Logic ---
            float gy = (pr.y - targetY) / gardenHeight;
            float gx = (pr.x - targetX) / gardenHeight;
            vec2 flowerP = vec2(gx + 0.5, gy); 
            
            float baseScale = 1.5; 
            float finalScale = baseScale / uFlowerScale;
            vec2 localP = (flowerP - 0.5) * finalScale + 0.5;

            // Glitch Logic (Restored to use localP)
            float glitchStrength = max(uFlowerGlitch * 0.4, uGridLock);
            float glitchY = floor(localP.y * 50.0);
            float glitchOffset = (hash(glitchY + iTime * 20.0) - 0.5) * 0.15 * glitchStrength;
            float glitchScanline = step(0.9, hash(glitchY + iTime)) * glitchStrength;
            
            vec2 glitchedP = localP;
            glitchedP.x += glitchOffset + glitchScanline * 0.05;

            gardenLayer = drawFlower(gardenLayer, glitchedP, vec2(0.618, 0.1), t, 7.0, ratio);
            
            // Secondary subtle glitch for variety
            vec2 glitchedP2 = localP;
            glitchedP2.x += (hash(floor(localP.y * 30.0) + iTime * 15.0) - 0.5) * 0.1 * glitchStrength;
            
            gardenLayer = drawFlower(gardenLayer, glitchedP2, vec2(0.418, 0.05), t*4.0, 6.0, ratio);
            gardenLayer = drawFlower(gardenLayer, glitchedP, vec2(0.818, 0.0), t*2.0, 8., ratio); 

            // Chromatic Color Split
            if (glitchStrength > 0.01) {
                 float offset = 0.02 * glitchStrength;
                 gardenLayer.r = mix(gardenLayer.r, drawFlower(vec4(0.0), glitchedP + vec2(offset, 0.0), vec2(0.618,0.1), t, 7.0, ratio).r, 0.5);
                 gardenLayer.b = mix(gardenLayer.b, drawFlower(vec4(0.0), glitchedP - vec2(offset, 0.0), vec2(0.618,0.1), t, 7.0, ratio).b, 0.5);
            }
        } else {
            // --- Grok State Logic (Quantum Drift) ---
            float glitchStrength = max(uFlowerGlitch * 0.4, uGridLock);
            
            float grokTargetY = (gardenFloor + gardenCeiling) * 0.5;
            grokTargetY += uGrokOffsetY * (gardenHeight * 0.5);
            
            float grokBaseScale = gardenHeight * uGrokScaleFactor;
            vec2 pGrok = (p - vec2(targetX, grokTargetY)) / grokBaseScale; 

            // Quantum Drift: Amplified floating sway and rotation
            float dTime = iTime * 0.8;
            vec2 driftPos = vec2(sin(dTime), cos(dTime * 0.72)) * 0.22;
            float driftRot = sin(iTime * 0.4) * 0.15;
            
            float dS = sin(driftRot), dC = cos(driftRot);
            pGrok = mat2(dC, -dS, dS, dC) * (pGrok - driftPos);

            gardenLayer = drawGrok(gardenLayer, pGrok);

            // Chromatic Color Split (Scaled to Grok Space)
            if (glitchStrength > 0.01) {
                 float grokOffset = (0.02 * glitchStrength) / grokBaseScale;
                 gardenLayer.r = mix(gardenLayer.r, drawGrok(vec4(0.0), pGrok + vec2(grokOffset, 0.0)).r, 0.5);
                 gardenLayer.b = mix(gardenLayer.b, drawGrok(vec4(0.0), pGrok - vec2(grokOffset, 0.0)).b, 0.5);
            }
        }

        // Fireflies
        float fy = (p.y - notchBottom) / max(0.001, bNotchH);
        for (int i = 0; i < FLY_COUNT; i++) {
            float seed = float(i) / float(FLY_COUNT);
            float t1 = 1.0 * (1. + sin(noise2(vec2(seed)).x * iTime));
            
            vec2 noiseVal = noise2(vec2(seed));
            // Fireflies relative to the notch center
            vec2 fireflyP = vec2((p.x - targetX) / gardenHeight, fy - 0.5) - vec2(
                noiseVal.x + noiseVal.y * t1 * 0.1,
                noiseVal.y + noiseVal.y * t1 * 0.1
            );
            
            float fly = firefly(fireflyP, 0.006 + 0.02 * seed);
            vec3 flyCol = vec3(0.1, 0.9, 0.1) * t1;
            
            gardenLayer.rgb += flyCol * fly;
            gardenLayer.a = max(gardenLayer.a, fly);
        }
    }
    // --- GARDEN LAYER END ---
    
    // --- Lifecycle Calculation ---
    float localTime = iTime - uElecStartTime;
    float totalTime = DUR_FILL + DUR_HOLD + DUR_WIPE + DUR_PAUSE;
    float cycleTime = mod(localTime, totalTime); 
    // Fixed start angle at bottom notch (-PI/2) to match fixed head position
    float startAngle = -1.570796; 
    float hPos = 0.0, tPos = 0.0, pPos = 0.0, wPos = -1.0, wStr = 0.0;
    
    if (cycleTime < DUR_FILL) {
        hPos = cycleTime / DUR_FILL;
    } else if (cycleTime < (DUR_FILL + DUR_HOLD)) {
        hPos = 1.0; float tw = cycleTime - DUR_FILL;
        if (tw < 0.5) { wPos = (tw / 0.5) * 0.6; wStr = smoothstep(0.0, 1.0, 1.0 - (tw / 0.5)); }
    } else {
        hPos = 1.0;
        float postHoldTime = cycleTime - (DUR_FILL + DUR_HOLD);
        tPos = min(1.0, postHoldTime / DUR_WIPE);
        pPos = postHoldTime / (DUR_WIPE + DUR_PAUSE);
    }

    // --- GATE: Manual/Auto Control ---
    if (uIsAutoElec < 0.5) {
        hPos = 0.0; tPos = 0.0;
    }

    // --- OPTIMIZATION: Guarded Shading ---
    float gridAlpha = smoothstep(0.9, 1.0, hPos) * (1.0 - smoothstep(0.0, 0.4, pPos));
    // Apply Grid Lock
    gridAlpha = max(gridAlpha, uGridLock);

    // Energy Linger: Extremely slow decay spanning the entire Wipe+Pause cycle
    float lingerAlpha = smoothstep(0.9, 1.0, hPos) * (1.0 - smoothstep(0.0, 1.0, pPos));
    lingerAlpha = max(lingerAlpha, uGridLock);

    // Connection Flash: A soft energetic bloom when hPos hits 1.0
    float connFlash = exp(-abs(cycleTime - DUR_FILL) * 5.0) * 0.8;

    // --- BEAM CALCULATION ---
    gardenCeiling = -bs.y + mh * uBNotchHRatio;
    // User Request: Align to Top of Bottom Notch
    float bottomBarY = gardenCeiling;
    // User Request: Full Notch Width (Corrected for Taper)
    // TopWidth = BaseWidth - Height * 1.1547
    float bottomBarW = (mw * uBNotchWRatio) - (mh * uBNotchHRatio * 1.1547);
    
    vec2 beamP1 = vec2(-bottomBarW * 0.5 + uBNotchBarProgress * bottomBarW, bottomBarY);
    
    float rightBarL = (bs.y * 2.0) * uRNotchHRatio * 0.8 * 0.5;
    vec2 beamP2 = vec2(bs.x, mix(rightBarL, -rightBarL, uBeamAttachRatio));
    
    // Vibe synchronization: Match the horizontal offset used for the right bar tip
    // Interpolate vibe strength based on attachment position
    float curVibe = mix(uRNotchVibeB, uRNotchVibeT, uBeamAttachRatio);
    beamP2.x += sin(iTime * 120.0) * curVibe * 12.0;

    // Apply centering trim (default 0.99)
    vec2 bMid = (beamP1 + beamP2) * 0.5;
    vec2 bDir = (beamP2 - beamP1) * (uBeamTrimRatio * 0.5); 
    beamP1 = bMid - bDir;
    beamP2 = bMid + bDir;

    // Apply Growth (Pivot at beamP1)
    beamP2 = mix(beamP1, beamP2, uBeamGrowth);
    
    float b_max_height = uBeamMaxHeight * resY;
    float b_wave_thick = uBeamWaveThickness * resY;
    float b_base_thick = uBeamBaseThickness * resY;
    
    float fBeam = beam(p, beamP1, beamP2, b_max_height, 0.0, uBeamSpeed, uBeamFreq * 1.5, b_wave_thick * 0.5) + 
                  beam(p, beamP1, beamP2, b_max_height, iTime, uBeamSpeed, uBeamFreq, b_wave_thick) +
                  beam(p, beamP1, beamP2, b_max_height, iTime + 0.5, uBeamSpeed + 0.2, uBeamFreq * 0.9, b_wave_thick * 0.5) + 
                  beam(p, beamP1, beamP2, 0.0, 0.0, uBeamSpeed, uBeamFreq, b_base_thick);
    // Persist beam as long as the island is expanded
    fBeam *= smoothstep(-1.0, 0.0, uIslToMainWRatio); 

    // --- OPTIMIZATION: Guarded Shading ---
    // --- Border & Complex Math Area ---
    float islH = uCutSize + mh * (uIslBarMarginYRatio * 2.0 + 2.0 * uIslBarHeightRatio + 1.0 * uIslBarGapRatio);
    float islW = mw * uIslToMainWRatio;
    float dIsland = sdIslandShape(p, bs, islH - CORNER_RADIUS, islW, uCutSize) - CORNER_RADIUS;
    
    float navButtonHeight = islH + CORNER_RADIUS;
    
    float xGrpR = bs.x + CORNER_RADIUS;
    float yGrpT = bs.y + CORNER_RADIUS;
    float yGrpB = bs.y - islH;
    
    float dNavHard = 1e5;
    float currentOffset = 0.0;
    
    for (int i = 0; i < 6; i++) {
        float vis = uNavVis[i];
        float ratio = uNavWH[i];
        float btnW = navButtonHeight * ratio;
        
        // Logical box for this button
        float bL = xGrpR - currentOffset - btnW;
        float bR = xGrpR - currentOffset;
        
        float dBtn = max(max(p.y - yGrpT, -(p.y - yGrpB)), max(p.x - bR, -(p.x - bL)));
        
        // Hide button by moving it to infinity if vis or ratio is 0
        float mask = step(0.01, vis) * step(0.01, ratio);
        dNavHard = min(dNavHard, mix(1e5, dBtn, mask));
        
        currentOffset += (btnW + uNavGap) * mask;
    }
    float dNavButtons = mix(1e5, dNavHard, uNavigatorVisibility); // Sharp interactive boundaries
    
    float dFrame = sdMainFrame(p, bs);
    float dist = min(min(dFrame, dIsland), dNavButtons);

    float absDist = abs(dist);
    float normPos = fract((atan(p.x, p.y) - startAngle) / 6.283185), mask = step(tPos, normPos) * step(normPos, hPos), intensity = 0.0, pulse = 0.0;
    // --- SUBDUED VOLUMETRIC BREATHING ---
    float autoBreath = (sin(iTime * 1.5) * 0.5 + 0.5) * uBreathAutoStrength; 
    float totalBreath = autoBreath + uBreathIntensity * uBreathManualStrength;

    // Optimized guard (60px) captures the much tighter atmospheric effects
    if (absDist < 60.0) {
        float baseNormThick = 10.0 / (resY * uBorderThickRatio);
        
        // 1. SURGICAL LAYERS (Tight Core)
        float surgicalI = 0.0;
        float haloI = 0.0;
        float coreLine = 0.0; 
        
        if (absDist < 40.0) {
            pulse = (wPos >= 0.0) ? exp(-abs(normPos - wPos) * 10.0) * wStr : 0.0;
            haloI = exp(-absDist * baseNormThick * 0.55) * 0.15;
            coreLine = pow(1.0 / (1.0 + absDist * baseNormThick * 1.3), 3.0);
            
            // --- NEW: Sharp Anti-Aliased Core Layer (Crispy Edges) ---
            float sharpCore = smoothstep(1.5, 0.0, absDist); 
            
            float elecI = 0.0;
            if (mask > 0.01 && absDist < 3.0) {
                float edgeFocus = 1.0 - smoothstep(0.0, 3.0, absDist);
                float rawNoise = pow(abs(fbm(atan(p.x, p.y) * 6.0 + iTime * 128.0)), 4.0);
                elecI = rawNoise * 0.15 * edgeFocus;
            }
            float activeMask = mask > 0.01 ? 1.0 : 0.04;
            surgicalI = (coreLine + sharpCore + elecI) * activeMask;
        }
        
        // 2. LAYERED VOLUMETRIC GLOW
        float ambientGlow = exp(-absDist * baseNormThick * 0.4) * 0.1; // Slightly boosted
        // Increased multipliers for visibility, but kept falloff tight
        float coronaGlow = exp(-absDist * baseNormThick * 0.8) * totalBreath * 1.2;
        float auraGlow = exp(-absDist * baseNormThick * 0.35) * totalBreath * 0.4;
        
        // 3. ENERGY SHIMMER (Reduced)
        float shimmer = (hash(p.x * 0.01 + p.y * 0.01 + iTime * 15.0) - 0.5) * 0.02 * uBreathIntensity;
        
        intensity = surgicalI + ambientGlow + coronaGlow + auraGlow + haloI * (mask > 0.01 ? 1.0 : 0.05) + shimmer;
        
        // Final overall boost (Reduced)
        intensity *= (1.0 + uBreathIntensity * 0.1); 
    }
    
    // Mix Border Color
    vec3 iceBorderColor = mix(BORDER_COLOR, vec3(0.4, 0.9, 1.0), 0.3);
    
    // Premium Tinting: Softer transition
    float tintFactor = clamp(uBreathIntensity, 0.0, 0.8);
    vec3 effectiveBorderColor = mix(iceBorderColor, uBreathColor, tintFactor);
    
    // White-Hot Core Logic: Kept subtle to avoid "flat" look
    float whiteHot = pow(clamp(1.0 - absDist * 0.25, 0.0, 1.0), 4.0) * totalBreath * 0.2;
    vec3 baseCol = mix(effectiveBorderColor, vec3(1.3), whiteHot);
    baseCol = mix(baseCol, vec3(1.0), pulse * 0.6);
    
    // (mask dimming is handled per-layer above via activeMask)

    // Sprites - Increased optimization bounds to prevent glow clipping (mask effect)
    vec3 dLight = vec3(0.0); float maxDI = 0.0; 
    if (abs(p.x - uPosStart.x) < 100.0 && abs(p.y - uPosStart.y) < 100.0 && tPos < 0.1) {
        vec3 l = getSpriteLight(p, uPosStart, uHeadSpriteSize);
        float f = 1.0 - smoothstep(0.0, 0.1, tPos); dLight += l * f; maxDI = max(maxDI, l.g * f);
    }
    if (abs(p.x - uPosHead.x) < 100.0 && abs(p.y - uPosHead.y) < 100.0 && hPos > 0.01 && hPos < 0.99) {
        vec3 l = getSpriteLight(p, uPosHead, uHeadSpriteSize);
        dLight += l; maxDI = max(maxDI, l.g);
    }

    // Final mix with Background Fill for Navigator
    vec3 glow = baseCol * intensity + dLight;
    
    // Procedural Fill: Inside buttons, add a cyanish atmospheric wash
    if (dist < 0.0 && dNavButtons < 0.0) {
        float fillMask = smoothstep(-5.0, -10.0, dNavButtons); // Soften fill slightly inside
        glow += BORDER_COLOR * 0.12 * uNavigatorVisibility * fillMask;
    }
    
    // Progress Bar
    vec3 barCol = vec3(0.0); float barAlpha = 0.0;
    
    // Physicalized Right Bar Transformation
    // Transformed p to local bar space
    vec2 pr = p - uRBarPos;
    float ang = uRBarRot;
    mat2 mRot = mat2(cos(ang), sin(ang), -sin(ang), cos(ang));
    pr = mRot * pr;
    
    // Bounds check removed or made global for the right bar to avoid clipping during physics
    // (We only render the bar if it's within a reasonable screen area, but large enough for the fall)
    if (p.x > -res.x * 0.5) { 
        float bl = (bs.y * 2.0) * uRNotchHRatio * 0.8 * 0.5;
        vec2 pb = pr; // pb is local bar center
        
        // Vibe Effect (B: Bottom Anchor, T: Top Anchor)
        float vibeDiv = max(0.001, 2.0 * bl);
        float factorB = (pb.y + bl) / vibeDiv; 
        float factorT = (bl - pb.y) / vibeDiv; 
        pb.x += sin(iTime * 120.0) * (uRNotchVibeB * factorB + uRNotchVibeT * factorT) * 12.0; 

        float bt = resY * uRNotchBarThickness, ds = resY * R_NOTCH_BAR_DIAMOND_SIZE * 1.5;
        float dBox = sdBox2D(pb, vec2(bt, bl));
        float dDiamondT = sdRhombus(pb - vec2(0.0, bl), ds);
        float dDiamondB = sdRhombus(pb - vec2(0.0, -bl), ds);
        float db = min(dBox, min(dDiamondT, dDiamondB));

        if (db < 2.0) {
            float LP = uRNotchBarProgress;
            // Top to Bottom: (bl - pb.y) is distance from top
            float relY = (bl - pb.y) / max(0.001, 2.0 * bl); 
            
            // Add a diamond head at the current progress position
            bool isActive = relY < LP || dDiamondT < 1.0;
            barCol = isActive ? uRNotchBarActiveColor * (1.0 + 0.5 / (1.0 + abs(db) * 0.5)) : uRNotchBarInactiveColor;
            
            // Mask alpha by uRNotchHRatio to ensure it vanishes when notch is hidden
            barAlpha = (1.0 - smoothstep(0.0, 0.4, db)) * smoothstep(0.0, 0.01, uRNotchHRatio);
        }
    }

    // --- Legacy Grid Logic Removed ---
    vec3 activeGrid = vec3(0.0);

    // --- NEW: Stroboscopic Target Grid Logic (Moved Here) ---
    // User requested to keep the same trigger logic (E key / uIsAutoElec)
    // Coords: p is in pixel space centered. We need UV in range [-0.5, 0.5] corrected for aspect
    vec2 shUV = p / resY; 
    
    // Only render if we are in the "Active" state (triggered by E)
    if (dist < -10.0) {
        
        if (lingerAlpha > 0.001) { 
            // Square logic
            vec2 gUV = shUV / (uGridSize / resY);
            vec2 sOffset = calcSquareOffset(gUV);
            float sDist = calcSquareDistance(sOffset); // From 0.0 (center) to 0.5 (edge)
            
            // Core Ripple Logic (Starts from 4 edge centers) - RESTORED
            float aspect = res.x / res.y;
            float dStart = min(
                min(length(shUV - vec2(0.0, 0.5)), length(shUV - vec2(0.0, -0.5))),
                min(length(shUV - vec2(aspect * 0.5, 0.0)), length(shUV - vec2(-aspect * 0.5, 0.0)))
            );
            float rippleA = cos(2.0 * (2.0 * dStart - iTime * uGridPulseSpeed));

            // Calculate the intensity components
            float baseThickness = uGridThickness; 
            
            // 1. Sharp Ripple Lines (Using Square Dist)
            float ripples = smoothstep(baseThickness / resY, 0.0, abs(1.0 - abs(sin(sDist * rippleA * 10.0))));
            // 2. Soft "Bloom" for Ripples
            float ripplesGlow = 0.35 * smoothstep((baseThickness * 12.0) / resY, 0.0, abs(1.0 - abs(sin(sDist * rippleA * 10.0))));

            // 3. Square Outlines (Structural)
            float sqOutline = 0.45 * smoothstep((baseThickness + 4.0) / resY, 0.0, abs(0.48 - sDist));
            // 4. Soft Outer Glow for Squares
            float sqGlow = 0.3 * smoothstep((baseThickness + 30.0) / resY, 0.0, abs(0.48 - sDist));
            
            // 5. Internal Cell Fill (Subtle Glow)
            float cellGlow = 0.12 * smoothstep(0.4, 0.0, sDist);
            
            float gridMaskVal = (ripples + ripplesGlow + sqOutline + sqGlow + cellGlow);

            // Final Color: Using BORDER_COLOR (Increased boost to 1.5 for sharper presence)
            activeGrid = BORDER_COLOR * gridMaskVal * 1.5 * (1.0 + connFlash);

            // Integrate Beam into mainland grid
            // Hot White-Core Mapping: Add white boost based on intensity
            vec3 beamFinalCol = uBeamColor * fBeam;
            beamFinalCol += vec3(1.0, 1.0, 1.0) * pow(fBeam * 0.4, 3.0); 
            
            activeGrid = mix(activeGrid, beamFinalCol, clamp(fBeam * 0.8, 0.0, 1.0));
            
            // Update the main color and alpha instead of early return for better blending
            gridAlpha = gridAlpha * clamp(gridMaskVal, 0.0, 1.0);
        }
    }

    vec3 col = (dist > 0.0) ? uOutsideColor : glow + activeGrid;
    
    // Composite Garden Layer
    // Garden is strictly "behind" the HUD frame (dist > 0.0 area)
    // But we want it to show through the "Outside Color" (which is usually dark)
    // Actually, user wants it in the "area of bottom margin + notch"
    // If dist > 0.0 (outside frame), we show garden. 
    // If dist < 0.0 (inside frame), we show HUD.
    // Note: Top of garden is fuzzy, let's mix it based on garden alpha.
    
    if (dist > 0.0) {
        // We are outside the frame (margin or notch area)
        col = mix(uOutsideColor, gardenLayer.rgb, gardenLayer.a);
    }

    // Composite Beam: Now correctly applied on top of both mainland and margin/garden areas
    vec3 beamFinalCol = uBeamColor * fBeam;
    beamFinalCol += vec3(1.0, 1.0, 1.0) * pow(fBeam * 0.4, 3.0); 
    col = mix(col, beamFinalCol, clamp(fBeam * 0.8, 0.0, 1.0));

    float borderAlpha = max(max(intensity, maxDI), barAlpha);
    float finalAlpha = (dist > 0.0) ? 1.0 : max(max(borderAlpha, clamp(gridAlpha * length(activeGrid), 0.0, 1.0)), clamp(fBeam, 0.0, 1.0));

    // --- Island Bars Implementation ---
    vec3 islandBarCol = vec3(0.0); float islandBarAlpha = 0.0;
    
    // 1. Holographic Back-Plate (Strictly inside Islands)
    if (dIsland < 0.0 || dNavButtons < 0.0) {
        col = mix(col, BORDER_COLOR * 0.06, 0.4); 
    }

    // 2. Progress Bars (can fall outside)
    float barH = mh * uIslBarHeightRatio;
    float barGap = mh * uIslBarGapRatio;
    float barMarL = mh * uIslBarMarginLeftRatio;
    float barMarR = mh * uIslBarMarginRightRatio;
    float barMarY = mh * uIslBarMarginYRatio;
    
    // Optimization: Only run heavy matrix loop if we are in the left 60% of screen
    // (Bars are spawned on left and fall down/left mostly)
    if (p.x < resX * 0.1) {
        for (int i = 0; i < 2; i++) {
            // New Logic: Use Uniform Positions
            vec2 barCenter = (i == 0) ? uIslBar1Pos : uIslBar2Pos;
            
            // Interaction Bounding Box (Screen Space)
            // Skip loop if pixel is far from bar center
            if (abs(p.y - barCenter.y) > 200.0 || abs(p.x - barCenter.x) > 400.0) continue;

            float barRot = (i == 0) ? uIslBar1Rot : uIslBar2Rot;

            // Transform P to Local
            vec2 localP = p - barCenter;
            float ang = barRot;
            mat2 mRot = mat2(cos(ang), sin(ang), -sin(ang), cos(ang));
            localP = mRot * localP;

            // Calculate Skew Box SDF
            // Bar Base Width
            float barBaseWidth = islW - (barMarL + barMarR);

            // Skew Transform for standard Box SDF
            // x' = x - y
            vec2 skewP = vec2(localP.x - localP.y, localP.y);

            // Box SDF
            vec2 halfSize = vec2(barBaseWidth * 0.5, barH * 0.5);
            vec2 d = abs(skewP) - halfSize;
            float dBar = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
            
            if (dBar < 2.0) {
                float prog = (i == 0) ? uIslBarProgress1 : uIslBarProgress2;
                
                // --- Adaptive Effects (Calculated in-shader) ---
                // Mapping: Perfect (1.0), Good (>= 54/60), Normal (>= 24/60), Bad (< 24/60)
                float tGood = ${(Gs.FPS.GOOD/60).toFixed(4)};
                float tNorm = ${(Gs.FPS.NORMAL/60).toFixed(4)};
                
                float status = 0.0;
                if (prog < tNorm) status = 3.0;
                else if (prog < tGood) status = 2.0;
                else if (prog < 1.0) status = 1.0;
                
                float speedMult = 1.0 + status * 4.0;
                float flicker = 1.0;
                if (status >= 1.0) flicker = 0.85 + 0.15 * hash(iTime * 20.0 + float(i));
                
                float jitter = 0.0;
                if (status >= 2.0) jitter = (hash(floor(iTime * 20.0) + float(i)) - 0.5) * 0.02 * (status - 1.0);
                
                // relX needs to represent progress 0..1 along the bar
                // In skew space, x runs from -Width/2 to +Width/2
                float relX = (skewP.x - (-barBaseWidth * 0.5)) / barBaseWidth;
                
                float glitchRelX = relX + jitter;
                
                // --- Sci-Fi Enhancement: Segmented Energy Bar ---
                // User Request: Reduce gap between patterns.
                // New: 5% Gap
                float segments = 25.0; 
                float segX = fract(glitchRelX * segments + 0.95); 
                float isSeg = step(0.05, segX); 
                
                // Energy Flow Texture (Animated)
                float flow = 0.5 + 0.5 * sin(glitchRelX * 10.0 - (iTime * (4.0 * speedMult)));
                float activeGlow = smoothstep(prog - 0.05, prog, glitchRelX) * (1.0 - step(prog, glitchRelX));
                
                vec3 barBaseTheme = (status >= 2.5) ? ERR_RED : BORDER_COLOR;
                vec3 activeCol = barBaseTheme * (0.8 + 0.4 * flow + activeGlow * 2.0) * flicker;
                vec3 baseStructuralCol = vec3(0.08); 
                vec3 segCol = (glitchRelX < prog) ? activeCol : baseStructuralCol;
                
                // --- Gap Enhancement: Structural Rail ---
                float rail = (1.0 - smoothstep(0.0, 0.05, abs(localP.y))); // Center Y in local space is 0

                vec3 gapCol = mix(baseStructuralCol, BORDER_COLOR * 0.15, rail);
                
                // Glass Specular Highlight
                float spec = exp(-pow(localP.y, 2.0) / (0.01 * barH));
                segCol += vec3(0.5) * spec * (relX < prog ? 1.0 : 0.3);

                vec3 thisBarCol = mix(gapCol, segCol, isSeg);
                float thisBarAlpha = (1.0 - smoothstep(0.0, 1.0, dBar));
                
                // Accumulate
                islandBarCol = mix(islandBarCol, thisBarCol, thisBarAlpha);
                islandBarAlpha = max(islandBarAlpha, thisBarAlpha);
            }
        }
    }
    
    // Composite Bars (independent of dIsland)
    col = mix(col, islandBarCol, islandBarAlpha);
    finalAlpha = max(finalAlpha, islandBarAlpha);

    // --- Bottom Notch Progress Bar ---
    // Update Zone Logic: We are now at the TOP of the Notch
    if (inBottomNotchZone || abs(p.y - (-bs.y + mh * uBNotchHRatio)) < 20.0) {
        float gardenCeiling = -bs.y + mh * uBNotchHRatio;
        float notchW = mw * uBNotchWRatio;
        float notchH = mh * uBNotchHRatio;
        
        // User Request: Thin bar aligned to top, full width
        float barH = resY * 0.005; // Fixed thinness (~0.5% screen height)
        // Correct Width for Taper
        float barW = notchW - (notchH * 1.1547);
        
        float barY = gardenCeiling; 
        
        // --- PHYSICS TRANSFORM FOR BOTTOM BAR ---
        vec2 pB = p - uBBarPos; // Shift to physics pos
        // For rotation, we pivot around center. uBBarPos is center in world space.
        float angB = uBBarRot;
        mat2 mRotB = mat2(cos(angB), sin(angB), -sin(angB), cos(angB));
        pB = mRotB * pB; 
        
        // Note: uBBarPos defaults to (0, gardenCeiling). relative pB is 0,0 at bar center.
        
        float dBox = sdBox2D(pB, vec2(barW * 0.5, barH * 0.5));
        
        // User Request: Remove Diamond Heads -> Just dBox
        float dBotBar = dBox;
        
        if (dBotBar < 5.0) {
            float prog = uBNotchBarProgress;
            // relX calculation needs local coords now
            float relX = (pB.x - (-barW * 0.5)) / barW;
            
            float flicker = 0.95 + 0.05 * hash(iTime * 15.0 + 99.0);
            
            vec3 activeCol = uBNotchBarColor * (0.9 + 0.3 * sin(relX * 15.0 - iTime * 6.0)) * flicker;
            bool isActive = relX < prog;
            vec3 slotCol = mix(vec3(0.06), activeCol, isActive ? 1.0 : 0.0);
            
            // Specular (pB.y is straight vertical distance from center axis)
            float spec = exp(-pow(pB.y, 2.0) / (0.01 * barH));
            slotCol += vec3(0.4) * spec * (isActive ? 1.0 : 0.3);
            
            // Glow Effect
            if (isActive) {
                float barGlow = exp(-abs(dBotBar) * 0.2) * 0.4;
                slotCol += uBNotchBarColor * barGlow;
            }
            
            float barAlpha = (1.0 - smoothstep(0.0, 1.0, dBotBar)) * uBNotchBarAlpha;
            col = mix(col, slotCol, barAlpha);
            finalAlpha = max(finalAlpha, barAlpha);
        }
    }

    if (dist <= 0.0 && sdIslandShape(p, bs, islH, islW, uCutSize) < 0.0 && p.y > (bs.y - uCutSize)) {
        // --- Enhancement: Cyber-Ruler (Subtle Scale) ---
        // Slant Logic: 135 Degrees (Opposite Diagonal)
        float slant = -p.y; 
        float scrollSpeed = 15.0;
        
        // Base coordinate for pattern (Slanted & Scrolling)
        float xBase = p.x + slant; 
        float xScroll = xBase - iTime * scrollSpeed;
        
        // Ruler Ticks
        float tickPeriod = 6.0;         // Minor ticks
        float bigTickPeriod = 30.0;     // Major ticks
        
        bool isMajor = (mod(xScroll, bigTickPeriod) < tickPeriod);
        float xMod = mod(xScroll, tickPeriod);
        
        // Tick Shape (Thin line)
        float tickW = isMajor ? 2.0 : 1.5; 
        float tickAlpha = 1.0 - smoothstep(0.0, tickW, abs(xMod - tickPeriod * 0.5));
        
        // Height Logic (Bottom-aligned growing up)
        // Note: xScroll changes with y now, so major ticks will slant too.
        float tickHeightRatio = isMajor ? 0.6 : 0.35;
        float tickH = uCutSize * tickHeightRatio;
        
        float yBottom = bs.y - uCutSize;
        float dY = (p.y - yBottom) - tickH;
        float yAlpha = 1.0 - smoothstep(0.0, 1.0, dY); // Fade top of tick
        
        // Combined Intensity
        // User Request: Make 0, 5, 10 (Major ticks) brighter (final tuning)
        float baseInt = isMajor ? 1.2 : 0.8; 
        float ruler = tickAlpha * yAlpha * baseInt;
        
        // Scan Cursor (A subtle passing highlight)
        // Direction: - iTime * 0.5 (Left to Right)
        // Slant applied to cursor too for consistency
        float cursor = smoothstep(0.96, 1.0, sin(xBase * 0.015 - iTime * 0.5) * 0.5 + 0.5);
        ruler += cursor * 1.5 * tickAlpha; // Highlight ticks
        
        // Very low opacity / Subtle mix
        vec3 rulerCol = BORDER_COLOR * 0.25; // Darker/Subtle
        
        // Vertical Gradient for Header Overall (Fade out at bottom of header)
        float headerV = (p.y - yBottom) / uCutSize;
        float baseFade = smoothstep(0.0, 0.5, headerV);
        
        vec3 finalHeaderCol = mix(vec3(0.0), rulerCol, ruler * baseFade);
        
        // Add minimal noise/grain
        float noise = hash(dot(p, vec2(12.3, 45.6)) + iTime) * 0.05;
        
        col = mix(col, finalHeaderCol + vec3(noise), max(ruler * baseFade, 0.1));
        finalAlpha = max(finalAlpha, ruler * baseFade + 0.1); 
    }
    gl_FragColor = vec4(mix(col, barCol, barAlpha), finalAlpha);
}
`}var $,Us,Ws,Gs,Ks=M((()=>{Sn(),kt(),Te(),uo(),Bs(),$={MARGIN_PCT:.025,VERTICAL_MARGIN_PCT:.5,CUT_SIZE:0,CORNER_RADIUS:4,TL_GAP:5,B_NOTCH_TO_MAIN_W_RATIO:0,B_NOTCH_TO_MAIN_H_RATIO:0,NOTCH_ANGLE:60,R_NOTCH_TO_MAIN_H_RATIO:0,R_NOTCH_TO_MAIN_W_RATIO:0,RIGHT_NOTCH_ANGLE:45,ISL_BAR_COUNT:2,ISL_BAR_HEIGHT_RATIO:.005,ISL_BAR_GAP_RATIO:.01,ISL_BAR_MARGIN_LEFT_RATIO:.1,ISL_BAR_MARGIN_RIGHT_RATIO:.4,ISL_BAR_MARGIN_Y_RATIO:.01,ISL_BAR_PROGRESS:[.15,.42],ISL_TO_MAIN_W_RATIO:-1,NAV_COUNT:6,NAVIGATOR_VISIBILITY:1,NAV_BUTTON_WH_RATIO:2,NAV_CV_BUTTON_WH_RATIO:1,NAV_GAP:5,NAV_FILL_OPACITY:.15,DUR_FILL:1,DUR_HOLD:.5,DUR_WIPE:.25,DUR_PAUSE:.25,DIAMOND_ROT_SPEED:5,BORDER_COLOR:I.ELECTRIC_CYAN,OUTSIDE_COLOR:new e.Color(0,0,0),BORDER_THICK_RATIO:.075,PATTERN_WIDTH:10,PATTERN_GAP:4,PATTERN_LINE_THICK:1,PATTERN_HEIGHT_PCT:.75,BG_GRID_SIZE:60,GRID_LINE_THICKNESS:.6,GRID_PULSE_SPEED:1,GRID_PULSE_DENSITY:1,R_NOTCH_BAR_THICKNESS:2e-4,R_NOTCH_BAR_DIAMOND_SIZE:.00125,R_NOTCH_BAR_PROGRESS:.75,R_NOTCH_BAR_ACTIVE_COLOR:I.ELECTRIC_CYAN,R_NOTCH_BAR_INACTIVE_COLOR:I.ACCENT_GOLD,R_NOTCH_H_RATIO:.4,R_NOTCH_W_RATIO:.02,B_NOTCH_BAR_PROGRESS:1,B_NOTCH_BAR_ALPHA:0,B_NOTCH_BAR_MARGIN_X:.2,B_NOTCH_BAR_MARGIN_Y:.45,B_NOTCH_BAR_COLOR:I.ELECTRIC_CYAN,ELEC_SPEED:256,ELEC_FREQUENCY:4,ELEC_INTENSITY:2,HEAD_SPRITE_SIZE:0,SPRITE_INDEX:26,SPRITE_COLS:8,SPRITE_ROWS:4,HEAD_SCALE:1,SURGE_GRID_SIZE_PX:60,SURGE_GRID_THICK_PX:.4,RING_SPEED:4,RING_INTENSITY:.01,FLOWER_GLOW_HOVER:1.5,GARDEN_HOVER_GRAVITY_MULT:-1,GARDEN_HOVER_TWEEN_DUR:2500,FLOWER_GLOW_BASE:1,FLOWER_COLOR:I.ELECTRIC_CYAN,FLOWER_ROTATION:Math.PI/2,FLOWER_SCALE:.1,GARDEN_IS_FLOWER:0,GROK_SCALE_FACTOR:0,GROK_OFFSET_Y:0,BEAM_SPEED:30,BEAM_FREQ:.512,BEAM_MAX_HEIGHT:.03,BEAM_WAVE_THICKNESS:.0012,BEAM_BASE_THICKNESS:.001,BEAM_TRIM_RATIO:.99,BEAM_GROWTH:1,BEAM_ATTACH_RATIO:1,BEAM_BLOOM:1.5,BEAM_WOBBLE:0,BEAM_GLOW_STRENGTH:.05,BEAM_COLOR:I.ELECTRIC_CYAN,BREATH_AUTO_STRENGTH:.15,BREATH_MANUAL_STRENGTH:.2},Us={hideDeco:{FLOWER_ROTATION:Math.PI/2,HEAD_SPRITE_SIZE:0},showDeco:{FLOWER_ROTATION:0}},Ws=e=>`vec3(${e.r.toFixed(4)}, ${e.g.toFixed(4)}, ${e.b.toFixed(4)})`,Gs={FPS:{PERFECT:60,GOOD:54,NORMAL:24,BAD:0},COLORS:{BAD:Ws(I.CRIMSON_RED)}}}));function qs(e){let t=`1.5px`,n=`40px`,r=`80px`,i=document.createElement(`div`);Object.assign(i.style,{position:`fixed`,top:`0`,left:`0`,width:`100%`,height:`100%`,pointerEvents:`none`,zIndex:`2000`,overflow:`hidden`});let a=`${($&&$.MARGIN_PCT?$.MARGIN_PCT:.025)*100}vh`,o={position:`absolute`,zIndex:`11`,pointerEvents:`auto`,backgroundColor:`transparent`},s={position:`absolute`,zIndex:`12`,pointerEvents:`auto`,backgroundColor:`rgba(8, 12, 16, 0.9)`,color:`#00F3FF`,border:`1px solid rgba(0, 243, 255, 0.4)`,display:`flex`,justifyContent:`center`,alignItems:`center`,width:r,height:r,boxSizing:`border-box`,backdropFilter:`blur(12px)`,cursor:`pointer`,opacity:`0`,transform:`scale(0.8)`,transition:`all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)`,boxShadow:`0 0 25px rgba(0, 243, 255, 0.1)`},c=e=>{let n=`width: 6px; height: 6px; background: #00F3FF; transform: rotate(45deg); display: block; box-shadow: 0 0 10px rgba(0, 243, 255, 0.8); transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);`,r=`display: flex; gap: ${t}; justify-content: center; align-items: center;`,i=`display: flex; flex-direction: column; gap: ${t}; align-items: center; justify-content: center; width: max-content; overflow: visible;`;return e===`bottom`?`<div style="${i}"><div style="${r}"><div class="dot" style="${n}"></div><div class="dot" style="${n}"></div></div><div class="dot" style="${n}"></div></div>`:e===`top`?`<div style="${i}"><div class="dot" style="${n}"></div><div style="${r}"><div class="dot" style="${n}"></div><div class="dot" style="${n}"></div></div></div>`:e===`left`?`<div style="${i} flex-direction: row;"><div class="dot" style="${n}"></div><div style="${r} flex-direction: column;"><div class="dot" style="${n}"></div><div class="dot" style="${n}"></div></div></div>`:e===`right`?`<div style="${i} flex-direction: row;"><div style="${r} flex-direction: column;"><div class="dot" style="${n}"></div><div class="dot" style="${n}"></div></div><div class="dot" style="${n}"></div></div>`:``},l=(e,t,n,r)=>{let a=document.createElement(`div`);a.id=`zone-${e}`,Object.assign(a.style,o,t);let l=document.createElement(`div`);return l.id=`btn-${e}`,l.innerHTML=c(e),Object.assign(l.style,s,n),r&&(l.style.clipPath=r),l.addEventListener(`mouseenter`,()=>{l.style.backgroundColor=`rgba(0, 243, 255, 0.15)`,l.style.borderColor=`rgba(0, 243, 255, 0.8)`,l.style.boxShadow=`0 0 40px rgba(0, 243, 255, 0.25)`,l.querySelectorAll(`.dot`).forEach(e=>{e.style.background=`#fff`,e.style.boxShadow=`0 0 20px rgba(255, 255, 255, 1)`})}),l.addEventListener(`mouseleave`,()=>{l.style.backgroundColor=`rgba(8, 12, 16, 0.9)`,l.style.borderColor=`rgba(0, 243, 255, 0.4)`,l.style.boxShadow=`0 0 25px rgba(0, 243, 255, 0.1)`,l.querySelectorAll(`.dot`).forEach(e=>{e.style.background=`#00F3FF`,e.style.boxShadow=`0 0 10px rgba(0, 243, 255, 0.8)`})}),a.appendChild(l),i.appendChild(a),{zone:a,btn:l}},u=l(`left`,{top:`0`,left:`0`,width:a,height:`100%`},{top:`50%`,left:`0`,marginTop:`-${n}`,width:n,height:r,borderLeft:`none`},`polygon(0 0, 100% 25%, 100% 75%, 0 100%)`),d=l(`right`,{top:`0`,right:`0`,width:a,height:`100%`},{top:`50%`,right:`0`,marginTop:`-${n}`,width:n,height:r,borderRight:`none`},`polygon(0 25%, 100% 0, 100% 100%, 0 75%)`),f=l(`top`,{top:`0`,left:`0`,width:`100%`,height:a},{top:`0`,left:`50%`,marginLeft:`-${n}`,width:r,height:n,borderTop:`none`},`polygon(0 0, 100% 0, 75% 100%, 25% 100%)`),p=l(`bottom`,{bottom:`0`,left:`0`,width:`100%`,height:a},{bottom:`0`,left:`50%`,marginLeft:`-${n}`,width:r,height:n,borderBottom:`none`},`polygon(25% 0, 75% 0, 100% 100%, 0 100%)`);return e.appendChild(i),{left:u,right:d,top:f,bottom:p,wrapper:i}}function Js(t,n,r,i=!0,a=!0){let o=new T(n,r.domElement);o.enableDamping=!0,o.dampingFactor=.25,o.minDistance=2,o.maxDistance=100,i&&(o.enableRotate=!1,o.enablePan=!1,o.enableZoom=!1),t.orbitControls=o,o.moveState={left:!1,right:!1,up:!1,down:!1};let s=0,c=0;if(i&&a){let e=r.domElement.parentNode,t=qs(document.body),n=()=>{if(e){let n=e.getBoundingClientRect();t.wrapper.style.left=`${n.left}px`,t.wrapper.style.top=`${n.top}px`,t.wrapper.style.width=`${n.width}px`,t.wrapper.style.height=`${n.height}px`}};n(),window.addEventListener(`resize`,n);let i=[t.left.btn,t.right.btn,t.top.btn,t.bottom.btn],a=[t.left.zone,t.right.zone,t.top.zone,t.bottom.zone],s=()=>i.forEach(e=>{e.style.opacity=`1`,e.style.transform=`scale(1)`}),c=()=>i.forEach(e=>{e.style.opacity=`0`,e.style.transform=`scale(0.8)`});a.forEach(e=>{e.addEventListener(`mouseenter`,s),e.addEventListener(`mouseleave`,c)});let l=(e,t)=>{e.addEventListener(`mouseenter`,()=>{o.moveState[t]=!0}),e.addEventListener(`mouseleave`,()=>{o.moveState[t]=!1})};l(t.left.btn,`left`),l(t.right.btn,`right`),l(t.top.btn,`up`),l(t.bottom.btn,`down`),o.domUI=t,o.syncWrapperPosition=n,o.showEdgeUI=s,o.hideEdgeUI=c}o.edgeControlUpdate=()=>{if(!i||o.isStrategicHover){o.update();return}let t=0,r=0;if(o.moveState.left&&(t=Xs),o.moveState.right&&(t=-Xs),o.moveState.up&&(r=-Zs),o.moveState.down&&(r=Zs),t!==0){let e=s+t;Math.abs(e)>Qs&&(t=Math.sign(e)*Qs-s),s+=t}else Math.abs(s)>.001?(t=-(s*Ys),s+=t):s=0;if(r!==0){let e=c+r;Math.abs(e)>$s&&(r=Math.sign(e)*$s-c),c+=r}else Math.abs(c)>.001?(r=-(c*Ys),c+=r):c=0;let a=n._shakeOffset||new e.Vector3(0,0,0);if(n.position.sub(a),t!==0){let r=new e.Matrix4().makeRotationY(t);n.position.sub(o.target).applyMatrix4(r).add(o.target)}if(r!==0){let t=new e.Vector3().subVectors(n.position,o.target),i=new e.Vector3().crossVectors(n.up,t).normalize(),a=new e.Matrix4().makeRotationAxis(i,r);n.position.sub(o.target).applyMatrix4(a).add(o.target)}n.position.add(a),o.update()};let l=o.dispose;return o.dispose=()=>{o.domUI&&o.domUI.wrapper&&o.domUI.wrapper.remove(),o.syncWrapperPosition&&window.removeEventListener(`resize`,o.syncWrapperPosition),l.call(o)},o.update(),o}var Ys,Xs,Zs,Qs,$s,ec=M((()=>{Ks(),Ys=.05,Xs=.01,Zs=.008,Qs=1,$s=.08}));function tc(t){let n=new e.MeshStandardMaterial({color:16777215,metalness:.05,roughness:.2,name:`floorMat`,side:e.FrontSide,envMapIntensity:2.5});n.uniforms={...t.globalUniformsHub.uniforms,uBorderColor:{value:new e.Color(65535)}},V.environmentMap&&(n.envMap=V.environmentMap,n.envMapIntensity=2.5,V.environmentMap.mapping=e.EquirectangularReflectionMapping),n.onBeforeCompile=e=>{Pr(e,n.uniforms),Fr(e,n.uniforms),Ir(e,n.uniforms)};function r(t,r,i=e.NoColorSpace){dt.load(`textures/ktx2/${t}`,function(t){t.wrapS=e.RepeatWrapping,t.wrapT=e.RepeatWrapping,t.anisotropy=4,t.repeat.set(.5,4),t.colorSpace=i,n[r]=t,n.needsUpdate=!0,r===`bumpMap`&&(n.bumpScale=1.2)})}r(`hardwood2_diffuse.ktx2`,`map`,e.SRGBColorSpace),r(`hardwood2_bump.ktx2`,`bumpMap`),r(`hardwood2_roughness.ktx2`,`roughnessMap`);let i=new e.Mesh(ic,n);return i.rotation.x=-Math.PI/2,i.receiveShadow=!0,i.position.set(3,0,-4),i.name=`floor`,i.scale.set(20,24.8,1),i.visible=!1,i}function nc(e,t){let n=e.initialParent||e.parent,r={uuid:e.uuid,name:e.name,position:e.position.clone(),rotation:{x:e.rotation.x,y:e.rotation.y,z:e.rotation.z,order:e.rotation.order},scale:e.scale.clone(),parent:n};t.tweenData=t.tweenData||{},t.tweenData[e.uuid]=r}function rc(e){ac.envMap=e.environment;let t=tc(e);e.add(t),nc(t,e);let n=e.getObjectByName(`leftWall`),r=e.getObjectByName(`rightWall`),i=e.getObjectByName(`backWall`),a=e.getObjectByName(`frontWall`),o=e.getObjectByName(`rightWall-cover`);n?n.material=ac:console.warn(`Missing: leftWall`),r?r.material=ac:console.warn(`Missing: rightWall`),o?o.material=ac:console.warn(`Missing: rightWall-cover`),i?i.material=oc:console.warn(`Missing: backWall`),a?a.material=ac:console.warn(`Missing: frontWall`),[`rightWall`,`leftWallFoot001`].forEach(t=>{let n=e.getObjectByName(t);n&&n.material&&(n.material=n.material.clone(),n.material.uniforms=e.globalUniformsHub.uniforms,n.material.onBeforeCompile=e=>{Pr(e,n.material.uniforms)})})}var ic,ac,oc,sc=M((()=>{pt(),ar(),kt(),Vr(),ic=ir.plane,ac=new e.MeshStandardMaterial({roughness:.9,color:661043,metalness:.25,side:e.FrontSide,name:`wallMat`}),oc=new e.MeshStandardMaterial({roughness:.9,color:`#090919`,metalness:.25,side:e.FrontSide,name:`backWallMat`}),ac.envMapRotation.y=1.4,new e.MeshBasicMaterial({color:661043})}));function cc(t,n,r,i=null,a=null,o=`REPEAT`){let s=t?t.itemSize:r,c=new(a||(t?t.array.constructor:Float32Array))(n*s);if(i&&i.length===s)for(let e=0;e<n;e++)for(let t=0;t<s;t++)c[e*s+t]=i[t];if(t){let e=t.array,n=e.length;if(c.set(e),o===`REPEAT`)for(let t=n;t<c.length;t++)c[t]=e[t%n]}return new e.BufferAttribute(c,s)}var lc,uc=M((()=>{lc=class extends e.BufferGeometry{constructor(e){super(),this.isMorphGeo=!0,this.targetGeos=e;let t=Array.isArray(e)?e:[e],n=Math.max(...t.map(e=>e.attributes.position?e.attributes.position.count:0));this.maxCount=n;let r=Math.max(...t.map(e=>e.index?e.index.count:0)),i=t.some(e=>e.attributes.uv),a=t.some(e=>e.attributes.normal);this.morphInfo=[],e.forEach(e=>{let t=null;e.index&&(t=cc(e.index,r,1,null,Uint32Array,`ZERO`));let o={position:cc(e.attributes.position,n,3),normal:a?cc(e.attributes.normal,n,3,[0,1,0]):null,uv:i?cc(e.attributes.uv,n,2):null,index:t};this.morphInfo.push(o)})}setMorphInfo(e,t=null){t??=e;let n=this.morphInfo[e],r=this.morphInfo[t];n.position&&this.setAttribute(`position`,n.position),n.normal&&this.setAttribute(`normal`,n.normal),n.uv&&this.setAttribute(`uv`,n.uv),n.index&&(this.setIndex(n.index),this.originalIndex=n.index),r.position&&this.setAttribute(`targetPosition`,r.position),r.normal&&this.setAttribute(`targetNormal`,r.normal),r.uv&&this.setAttribute(`targetUV`,r.uv),r.index&&(this.targetIndex=r.index)}addTargets(e){let t=Array.isArray(e)?e:[e];this.targetGeos.push(...t);let n=this.maxCount,r=Math.max(...t.map(e=>e.index?e.index.count:0)),i=t.some(e=>e.attributes.uv),a=t.some(e=>e.attributes.normal);t.forEach(e=>{let t=null;if(e.index){let n=Math.max(r,e.index.count);t=cc(e.index,n,1,null,Uint32Array,`ZERO`)}let o={position:cc(e.attributes.position,n,3),normal:a||this.attributes&&this.attributes.normal?cc(e.attributes.normal,n,3,[0,1,0]):null,uv:i||this.attributes&&this.attributes.uv?cc(e.attributes.uv,n,2):null,index:t};this.morphInfo.push(o)})}}})),dc,fc,pc=M((()=>{dc=class e extends c{constructor(){super(e.Geometry,new l({opacity:0,transparent:!0})),this.isLensflare=!0,this.type=`Lensflare`,this.frustumCulled=!0,this.renderOrder=1/0;let r=new h,o=new h,s=new a(16,16),d=new a(16,16),f=p,_=e.Geometry,v=new u({uniforms:{scale:{value:null},screenPosition:{value:null}},vertexShader:`

				precision highp float;

				uniform vec3 screenPosition;
				uniform vec2 scale;

				attribute vec3 position;

				void main() {

					gl_Position = vec4( position.xy * scale + screenPosition.xy, screenPosition.z, 1.0 );

				}`,fragmentShader:`

				precision highp float;

				void main() {

					gl_FragColor = vec4( 1.0, 0.0, 1.0, 1.0 );

				}`,depthTest:!0,depthWrite:!1,transparent:!1}),y=new u({uniforms:{map:{value:s},scale:{value:null},screenPosition:{value:null}},vertexShader:`

				precision highp float;

				uniform vec3 screenPosition;
				uniform vec2 scale;

				attribute vec3 position;
				attribute vec2 uv;

				varying vec2 vUV;

				void main() {

					vUV = uv;

					gl_Position = vec4( position.xy * scale + screenPosition.xy, screenPosition.z, 1.0 );

				}`,fragmentShader:`

				precision highp float;

				uniform sampler2D map;

				varying vec2 vUV;

				void main() {

					gl_FragColor = texture2D( map, vUV );

				}`,depthTest:!1,depthWrite:!1,transparent:!1}),b=new c(_,v),x=[],S=fc.Shader,C=new u({name:S.name,uniforms:{map:{value:null},occlusionMap:{value:d},color:{value:new i(16777215)},scale:{value:new m},screenPosition:{value:new h}},vertexShader:S.vertexShader,fragmentShader:S.fragmentShader,blending:t,transparent:!0,depthWrite:!1}),w=new c(_,C);this.addElement=function(e){x.push(e)},this.elements=x;let T=new m,E=new m,D=new n,O=new g;this.onBeforeRender=function(e,t,n){e.getCurrentViewport(O);let i=e.getRenderTarget(),a=i===null?p:i.texture.type;f!==a&&(s.dispose(),d.dispose(),s.type=d.type=a,f=a);let c=O.w/O.z,l=O.z/2,u=O.w/2,m=16/O.w;if(T.set(m*c,m),D.min.set(O.x,O.y),D.max.set(O.x+(O.z-16),O.y+(O.w-16)),o.setFromMatrixPosition(this.matrixWorld),o.applyMatrix4(n.matrixWorldInverse),!(o.z>0)&&(r.copy(o).applyMatrix4(n.projectionMatrix),E.x=O.x+r.x*l+l-8,E.y=O.y+r.y*u+u-8,D.containsPoint(E))){e.copyFramebufferToTexture(s,E);let t=v.uniforms;t.scale.value=T,t.screenPosition.value=r,e.renderBufferDirect(n,null,_,v,b,null),e.copyFramebufferToTexture(d,E),t=y.uniforms,t.scale.value=T,t.screenPosition.value=r,e.renderBufferDirect(n,null,_,y,b,null);let i=-r.x*2,a=-r.y*2;this.mat1a=v,this.mat1b=y,this.mat2=C;for(let t=0,o=x.length;t<o;t++){let o=x[t],s=C.uniforms;o.mat2Uniforms=s,s.color.value.copy(o.color),s.map.value=o.texture,s.screenPosition.value.x=r.x+i*o.distance,s.screenPosition.value.y=r.y+a*o.distance,m=o.size/O.w;let c=O.w/O.z;s.scale.value.set(m*c,m),C.uniformsNeedUpdate=!0,e.renderBufferDirect(n,null,_,C,w,null)}}},this.dispose=function(){v.dispose(),y.dispose(),C.dispose(),s.dispose(),d.dispose();for(let e=0,t=x.length;e<t;e++)x[e].texture.dispose()}}},fc=class{constructor(e,t=1,n=0,r=new i(16777215)){this.texture=e,this.size=t,this.distance=n,this.color=r}},fc.Shader={name:`LensflareElementShader`,uniforms:{map:{value:null},occlusionMap:{value:null},color:{value:null},scale:{value:null},screenPosition:{value:null}},vertexShader:`

		precision highp float;

		uniform vec3 screenPosition;
		uniform vec2 scale;

		uniform sampler2D occlusionMap;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUV;
		varying float vVisibility;

		void main() {

			vUV = uv;

			vec2 pos = position.xy;

			vec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) );
			visibility += texture2D( occlusionMap, vec2( 0.5, 0.1 ) );
			visibility += texture2D( occlusionMap, vec2( 0.9, 0.1 ) );
			visibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) );
			visibility += texture2D( occlusionMap, vec2( 0.9, 0.9 ) );
			visibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) );
			visibility += texture2D( occlusionMap, vec2( 0.1, 0.9 ) );
			visibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) );
			visibility += texture2D( occlusionMap, vec2( 0.5, 0.5 ) );

			vVisibility =        visibility.r / 9.0;
			vVisibility *= 1.0 - visibility.g / 9.0;
			vVisibility *=       visibility.b / 9.0;

			gl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D map;
		uniform vec3 color;

		varying vec2 vUV;
		varying float vVisibility;

		void main() {

			vec4 texture = texture2D( map, vUV );
			texture.a *= vVisibility;
			gl_FragColor = texture;
			gl_FragColor.rgb *= color;

		}`},dc.Geometry=(function(){let e=new r,t=new o(new Float32Array([-1,-1,0,0,0,1,-1,0,1,0,1,1,0,1,1,-1,1,0,0,1]),5);return e.setIndex([0,1,2,0,2,3]),e.setAttribute(`position`,new s(t,3,0,!1)),e.setAttribute(`uv`,new s(t,2,3,!1)),e})()})),mc=M((()=>{pc(),kt()}));function hc(t){let n=t.globalUniformsHub,r=n?n.uniforms:{},i=n?n.core:{},a=new e.ShaderMaterial({uniforms:{glowColor:{value:new e.Color(`#FBC189`)},glowPower:{value:1},glowIntensity:{value:1},iTime:i.iTime||{value:0},uOscillationStrength:r.uOscillationStrength||{value:1},uIsOscillating:r.uIsOscillating||{value:0},uTransformProgress:r.uTransformProgress||{value:0}},vertexShader:un,fragmentShader:Xt,side:e.FrontSide,blending:e.AdditiveBlending,transparent:!0,depthWrite:!1,name:`bulbInnerMat`}),o=new e.ShaderMaterial({uniforms:{outerGlowStrength:{value:1},outerGlowBorder:{value:.01},p:{value:6.5},glowColor:{value:new e.Color(`#FBC189`)},iTime:i.iTime||{value:0},uOscillationStrength:r.uOscillationStrength||{value:1},uIsOscillating:r.uIsOscillating||{value:1},uTransformProgress:r.uTransformProgress||{value:0}},vertexShader:un,fragmentShader:Yt,side:e.FrontSide,blending:e.AdditiveBlending,transparent:!0,depthWrite:!1,name:`bulbOuterGlowMat`}),s=t.getObjectByName(`btc_symbol`),c=t.getObjectByName(`cFanBulb`);t.getObjectByName(`sphereSample`);let l=new lc([ir.sphere,s.geometry,c.geometry]);l.setMorphInfo(0,1);let u=new e.Mesh(l,a);t.add(u),u.position.set(-9.2,9.6,-.39),u.scale.setScalar(1),u.material.visible=!1,u.name=`bulb`;let d=new e.Mesh(u.geometry,o);d.scale.setScalar(2),d.name=`bulbAura`,d.visible=!1,u.add(d);let f=new e.Color(16769202),p=new e.SpotLight(f,.001,50,Math.PI/3,.5,2);return p.name=`bulbLight`,p.visible=!0,u.add(p),p.target.position.set(0,-10,0),u.add(p.target),p.castShadow=!0,p.shadow.mapSize.width=256,p.shadow.mapSize.height=256,p.shadow.bias=-5e-4,p.shadow.focus=1,t.bulb=u,t.bulbLight=p,u}var gc=M((()=>{Sn(),Lt(),ar(),uc(),mc(),kt()}));function _c(t,n=600){let r=new Float32Array(n*3),i=new Float32Array(n),a=new Float32Array(n),o=new Float32Array(n*3),s=new Float32Array(n),c=new e.Vector3,l=new e.Vector3;for(let t=0;t<n;t++){let n=new e.Vector3().randomDirection().multiplyScalar(Math.random()*5);c.copy(yc).add(n),c.toArray(r,t*3),l.x=Math.random()*.5+.5,l.y=(Math.random()-.5)*1,l.z=(Math.random()-.5)*.5,l.normalize(),l.toArray(o,t*3),s[t]=Math.random(),i[t]=20,a[t]=Math.random()*.4+.2}let u=new e.BufferGeometry;u.setAttribute(`position`,new e.BufferAttribute(r,3)),u.setAttribute(`size`,new e.BufferAttribute(i,1)),u.setAttribute(`speed`,new e.BufferAttribute(a,1)),u.setAttribute(`direction`,new e.BufferAttribute(o,3)),u.setAttribute(`random`,new e.BufferAttribute(s,1));let d=t.globalUniformsHub,f=d?d.uniforms:{},p=d?d.core:{},m=V.spriteSheet,h=new e.ShaderMaterial({uniforms:{iTime:p.iTime||{value:0},uMouse:p.uMouse||{value:new e.Vector2(0,0)},uSmoothedMouse:{value:new e.Vector2(0,0)},fireFliesTexture:{value:m},uMergeProgress:f.uMergeProgress||{value:0},uPointMergePos:f.uPointMergePos||{value:new e.Vector3(-.6,4.4,0)},uOverrideActive:f.uOverrideActive||{value:0},uOverrideRow:f.uOverrideRow||{value:0},uOverrideCol:f.uOverrideCol||{value:0},uSizeFactor:f.uSizeFactor||{value:1},uKamikazeScale:f.uKamikazeScale||{value:0}},vertexShader:bc,fragmentShader:xc,blending:e.AdditiveBlending,depthTest:!0,depthWrite:!1,transparent:!0,name:`firefliesMat`}),g=new e.Points(u,h);return g.onBeforeRender=()=>{let e=h.uniforms.uMouse.value,t=h.uniforms.uSmoothedMouse.value,n=.22;t.x+=(e.x-t.x)*n,t.y+=(e.y-t.y)*n},g.tweenFlashIn=null,g.tweenFlashOut=null,g.triggerFlash=e=>{let t=V.spriteSheetSpecialIcons;if(!t||!t[e.toLowerCase()]){console.warn(`[Fireflies] No icon mapping found for type: ${e}`);return}let n=t[e.toLowerCase()],r=n.row,i=n.col,a=g.material.uniforms;a.uOverrideRow.value=r,a.uOverrideCol.value=i,g.tweenFlashIn&&g.tweenFlashIn.stop(),g.tweenFlashOut&&g.tweenFlashOut.stop();let o={active:a.uOverrideActive.value,size:a.uSizeFactor.value};g.tweenFlashIn=new v.Tween(o).to({active:1,size:1.6},200).easing(v.Easing.Quadratic.Out).onUpdate(e=>{a.uOverrideActive.value=e.active,a.uSizeFactor.value=e.size}).start(),g.tweenFlashOut=new v.Tween({active:1,size:1.6}).to({active:0,size:1},1e3).delay(4e3).easing(v.Easing.Quadratic.Out).onUpdate(e=>{a.uOverrideActive.value=e.active,a.uSizeFactor.value=e.size}).onComplete(()=>{g.tweenFlashIn=null,g.tweenFlashOut=null}).start()},t.add(g),g.name=`fireflies`,t.fireflies=g,g}var vc,yc,bc,xc,Sc=M((()=>{Lt(),kt(),vc=15,yc=new e.Vector3(-vc,7.25,0),bc=`
    uniform float iTime;
    uniform vec2 uSmoothedMouse;
    uniform float uMergeProgress;
    uniform vec3 uPointMergePos;
    
    // Override Uniforms
    uniform float uOverrideActive; // 0.0 to 1.0 (Mix factor)
    uniform float uOverrideRow;
    uniform float uOverrideCol;

    uniform float uSizeFactor;
    uniform float uKamikazeScale;

    attribute float size;
    attribute float speed;
    attribute vec3 direction;
    attribute float random;

    const float radius =  ${vc.toFixed(1)};
    const float speedFactor = .006;
    const float PI = 3.1415926535;
    varying float vRandom; 

    void main() {
        vRandom = random; //for fragmentShader
        // 1. LIFECYCLE
        float lifeTime = (radius * 2.0) / (direction.x * speed * speedFactor);
        float cycleTime = mod(iTime + random * lifeTime, lifeTime);

        // 2. POSITION
        vec3 displacement = direction * speed * speedFactor * cycleTime;
  
        vec3 newPosition = position + displacement;
        newPosition.x *= 15.;

        // 4. BEHAVIOR SELECTION
        // "KAMIKAZE" (Fly toward camera) vs "ORBITAL" (Rotate gently)
        if (random > 0.8) {
             // --- TYPE: KAMIKAZE --- 
             // Reset orbit/rotation logic for these so they fly straight
             // Move along Z axis towards camera (positive Z in Three.js)
             // Use mod to loop them coming back from far distance
             float cameraSpeed = speed * 10.0; // Faster
             float zDist = 20.0;
             newPosition.z = mod(iTime * cameraSpeed + (random * 100.0), zDist) + 15.0; 
             
             // Interactive Wiggle: React to uSmoothedMouse
             // uSmoothedMouse.x moves Z (Left/Right), uSmoothedMouse.y moves Y (Up/Down)
             // We map standard mouse (-1 to 1) to a factor
             
             newPosition.x = position.x + sin(iTime + random * 10.0) * 2.0; 
             
             // Y reacts to Mouse Y with Randomized Damping
             // We use 'random' (0.0 to 1.0) to vary the strength.
             // Some particles will follow the mouse loosely (dampened), others more tightly.
             // Y reacts to Mouse Y with Randomized Damping & Simulated Wave Delay
             // 1. DAMPNESS: random^3 biases heavily towards 0, so we multiply by 40.0 to make the few "active" ones really move.
             float dampness = (random * random ); 
             
             // 2. DELAY: We simulate a signal traveling down the depth (X-axis)
             // As the wave passes (sin), the particle reacts more or less to the mouse.
             // This prevents them from all moving in perfect unison.
             float waveDelay = random + 0.4 * sin(iTime * 3.0 - position.x * 0.2); 

             newPosition.y = position.y + (cos(iTime + random * 10.0) * 2.0) + (uSmoothedMouse.y * dampness * waveDelay); 
             
             // Removed Z reaction to Mouse X as requested
        } else {
             // --- TYPE: ORBITAL ---
            // Apply the rotation to the x and y coordinates only for the points that need it
            vec2 pivot = vec2(${yc.y.toFixed(1)}, ${yc.z.toFixed(1)});
            float angle = iTime * 0.09; 
            mat2 rotationMatrix = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
            newPosition.yz = rotationMatrix * (newPosition.yz - pivot) + pivot;
        }
        

        // 4. SIZE
        // Synchronize breathing rhythm with texture change speed (3.0 * random)
        float syncSpeed = 3.0 * random;
        float pulsatingSize = size + 15.0 * sin(iTime * syncSpeed + random * 100.0);
    
        // if ( newPosition.z > 0. || newPosition.y < 0.) {
        //     pulsatingSize = 0.0;
        // }
        // 5. PROJECTION
        // Apply Merge Blending:
        // Apply Staggered Convergence:
        // uMergeProgress goes 0 -> 1 linearly.
        // Stagger: localProgress = smoothstep(random * 0.4, 1.0, uMergeProgress)
        
        float progressCycle = uMergeProgress; // No Modulo, just 0 -> 1 clamp effective via smoothstep
        
        // Wait offset based on random, so they don't all start moving at t=0
        float staggerStart = random * 0.4; // up to 40% delay start
        float localProgress = smoothstep(staggerStart, 1.0, progressCycle);
        
        vec3 finalPos = mix(newPosition, uPointMergePos, localProgress);
        
        vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
        
        // Conditional Size Multiplier:
        // Kamikaze (random > 0.8) -> 2.0
        // Orbital (random <= 0.8) -> 4.0 (Doubled as requested)
        float isOrbital = step(random, 0.8); 
        float sizeMult = 1.6 + (1.2 * isOrbital);

        // Apply Kamikaze Scale (0 to 1) via Uniform
        // If isOrbital is 0.0 (Kamikaze), we multiply by uKamikazeScale.
        // If isOrbital is 1.0, we multiply by 1.0 (no change).
        sizeMult *= mix(uKamikazeScale, 1.0, isOrbital);
        
        // Shrink points as they converge
        // Reduce to randomized small size (0.05 to 0.25) when progress is 1.0
        float randomTarget = 0.05 + (random * 0.2);
        // Reduce to randomized small size (0.05 to 0.25) when progress is 1.0
        // float randomTarget = 0.05 + (random * 0.2); // Already defined above
        float shrinkFactor = mix(1.0, randomTarget, localProgress);
        
        float calculatedSize = sizeMult * pulsatingSize * (5.0 / -mvPosition.z) * shrinkFactor;
        
        // Custom Logic: Discard Orbital points if X > 1.0
        // isOrbital is 1.0 if orbital, 0.0 if not.
        if (isOrbital > 0.5 && finalPos.x > 1.0) {
             calculatedSize = 0.0;
        }

        gl_PointSize = clamp(calculatedSize , 0.5, 30.0) * uSizeFactor;
        gl_Position = projectionMatrix * mvPosition;
    }
`,xc=`
    uniform sampler2D fireFliesTexture;
    uniform float iTime;
    // Override Uniforms
    uniform float uOverrideActive;
    uniform float uOverrideRow;
    uniform float uOverrideCol;

    varying float vRandom; // <-- Receive the random value

    void main() {
        // Define the two possible colors
        vec3 orange = vec3(2.0, 0.8, 0.2);
        vec3 cyan = vec3(0.7, 1.8, 1.8); // A lightning cyan color

        // We hash vRandom to get a new random value for color, 
        // because vRandom is correlated with Behavior (Kamikaze > 0.8).
        float colorRandom = fract(sin(vRandom * 123.45) * 43758.5453);
        
        vec3 color;

        // If the random value is less than 0.5 (a 50% chance), use cyan.
        if (colorRandom < 0.5) {
            color = cyan;
        } else {
            color = orange;
        }

        // Sprite Sheet Logic
        float cols = 8.0;
        float rows = 4.0;
        
        // Intermittent Animation Logic
        // 1. Define Cycle
        float activeDuration = 1.5; // Animates for 1.5s
        float pauseDuration = 2.5;  // Pauses for 2.5s
        float totalCycle = activeDuration + pauseDuration;
        
        // 2. Local Time (Desynchronized)
        float localTime = iTime + (vRandom * 10.0);
        float timeInCycle = mod(localTime, totalCycle);
        
        // 3. Calc Stepped Time (Burst vs Pause)
        float animationSpeed = 20.0; // 10 FPS during burst
        float steppedTime = 0.0;
        
        if (timeInCycle < activeDuration) {
             // Active Phase: Animate
             steppedTime = floor(timeInCycle * animationSpeed);
        } else {
             // Pause Phase: Pick a NEW random frame for this specific pause cycle
             // We use 'floor(localTime / totalCycle)' to get the unique ID of the current cycle.
             float cycleIndex = floor(localTime / totalCycle);
             float randomSeed = sin(cycleIndex * 123.45 + vRandom * 67.89); 
             // Map -1..1 to 0..32
             float randomFrame = abs(randomSeed) * 32.0;
             steppedTime = floor(randomFrame);
        }

        float frameIndex = floor(mod((vRandom * 32.0) + steppedTime, 32.0));

        float col = mod(frameIndex, cols);
        float row = floor(frameIndex / cols);
        
        // Fix: Invert the row because texture coordinates (0,0) are bottom-left,
        // but often sprite sheets are read top-left to bottom-right.
        // OR simply because WebGL Y is flipped relative to image rows.
        row = row; // KTX2 Top-Left (No flip needed)

        // --- OVERRIDE LOGIC ---
        // If Override is active (uOverrideActive > 0), simple mix or hard switch
        // We do a hard switch if uOverrideActive > 0.5 to keyframe it, or mix?
        // User said "swap the texture", implying a replacement.
        
        // We override ROW and COL directly.
        if (uOverrideActive > 0.01) {
             float targetRow = uOverrideRow; // KTX2 Top-Left (No flip needed)
             
             // Smooth Mix or Hard Cut?
             // Mix introduces artifacts (cycling sprites). 
             // We use uOverrideActive as a threshold for hard cut, OR we just replace calculated row/col.
             // But we want to 'revert' later.
             
             // Let's use step for hard swap at 50% transition if we tween 0->1
             // OR if we just tween opacity, maybe we want mix?
             // Sprite indices are discrete. We cannot mix 3.0 and 5.0 to get 4.0.
             
             // Logic: If uOverrideActive is high enough, force the override frame.
             if (uOverrideActive > 0.1) {
                 col = uOverrideCol;
                 row = targetRow;
             }
        }

        // Flip V coordinate inside the cell
        vec2 cellUV = gl_PointCoord;
        // cellUV.y = 1.0 - cellUV.y; // Removed for KTX2 Top-Left origin

        vec2 uv = (cellUV + vec2(col, row)) / vec2(cols, rows);

        // Apply texture and intensity
        vec4 tex = texture2D(fireFliesTexture, uv);
        float intensity = pow(tex.a, 3.0); 

        // Set the final color with enhanced Glow/Halo
        float distToCenter = length(gl_PointCoord - 0.5);
        float halo = smoothstep(0.5, 0.0, distToCenter);
        float aura = pow(halo, 3.0) * mix(0.4, 1.2, uOverrideActive); // Boost aura during coin ritual
        
        gl_FragColor = vec4(color * (intensity + aura), 1.0);
    }
`}));async function Cc(t,n){if(n&&z(window.loadingProgress||0,R(`SYS_PHYSICS_CALC`)),!t.world&&(console.warn(`Physics world not ready, waiting...`),await new Promise(e=>setTimeout(e,100)),!t.world))throw Error(`Physics World not initialized`);t.bhTargets||=[];let r=new Map;t.traverse(e=>{e.name&&r.set(e.name,e)});async function i(e,n,i={}){let a=Array.isArray(e)?e:[e],o=0,s=performance.now();for(let e of a){let c=r.get(e);if(!c)continue;i.isBhTarget&&t.bhTargets.push(c),c.visible=!1,(i.isConvexHull||performance.now()-s>1)&&(await Wr(),s=performance.now());let l=n(t,c,i);Me(t,c,l.body,l.shape,i),o++,a.length>5&&qe(`physics-binding`,.1+o/a.length*.7)}}await i([`backWall_rapier`,`rightWall`,`leftWall`,`glass2`,`frontWall`,``,`Object_15`,`Object_15001`,`Cube004`,`Cube019_3`,`Cube019_5`,`Object_1001_1`,`Object_8001`,`leftWallFoot001`,`Object_38001`],Pe,{bodyType:`fixed`,restitution:.4,friction:.4}),await i([`bedMain`,`bedStand`],Pe,{bodyType:`fixed`,restitution:.1,friction:.4,isConvexHull:!0}),qe(`physics-binding`,.2,R(`SYS_MAPPING_BOUNDARIES`));let a=r.get(`a-char`);if(a){qe(`physics-binding`,.3,R(`SYS_CHAR_COLLISION`)),new e.Quaternion().setFromAxisAngle(new e.Vector3(1,0,0),Math.PI/2);let n=b.ColliderDesc.capsule(.48,.66).setTranslation(0,.1,0);Ne(t,a,t.world.createRigidBody(b.RigidBodyDesc.kinematicPositionBased()),n,{trackBoneName:`mixamorigSpine1`,offset:new e.Vector3(0,0,0),restitution:.5,friction:.4,softKinematic:.7}),qe(`physics-binding`,.4,R(`SYS_BINDING_ARMATURES`)),[{bone:`mixamorigLeftArm`,shapeType:`capsule`,radius:.2,height:.4,offset:new e.Vector3(0,.35,0)},{bone:`mixamorigRightArm`,shapeType:`capsule`,radius:.2,height:.4,offset:new e.Vector3(0,.35,0)},{bone:`mixamorigLeftForeArm`,shapeType:`capsule`,radius:.2,height:.3,offset:new e.Vector3(0,.5,0)},{bone:`mixamorigRightForeArm`,shapeType:`capsule`,radius:.2,height:.3,offset:new e.Vector3(0,.5,0)},{bone:`mixamorigLeftUpLeg`,shapeType:`capsule`,radius:.3,height:.4,offset:new e.Vector3(0,1,0)},{bone:`mixamorigRightUpLeg`,shapeType:`capsule`,radius:.3,height:.4,offset:new e.Vector3(0,1,0)},{bone:`mixamorigRightLeg`,shapeType:`capsule`,radius:.3,height:.4,offset:new e.Vector3(0,1,0)},{bone:`mixamorigLeftFoot`,shapeType:`capsule`,radius:.24,height:.15,offset:new e.Vector3(0,.5,0)},{bone:`mixamorigRightFoot`,shapeType:`capsule`,radius:.24,height:.15,offset:new e.Vector3(0,.5,0)},{bone:`mixamorigHead`,shapeType:`ball`,radius:.43,offset:new e.Vector3(0,.35,0)}].forEach(e=>{let n;n=e.shapeType===`ball`?b.ColliderDesc.ball(e.radius):b.ColliderDesc.capsule(e.height,e.radius),e.offset&&n.setTranslation(e.offset.x,e.offset.y,e.offset.z),e.rotation&&n.setRotation(e.rotation),Ne(t,a,t.world.createRigidBody(b.RigidBodyDesc.kinematicPositionBased()),n,{trackBoneName:e.bone,restitution:.5,friction:.4,softKinematic:.7})})}else console.warn(`bindPhysics: Character 'a-char' not found.`);qe(`physics-binding`,.5,R(`SYS_ANCHORING_ROTORS`));for(let e of[`cFanBody`]){let n=r.get(e);if(n){let{body:e,shape:r}=Pe(t,n,{bodyType:`kinematicPosition`});Ne(t,n,e,r,{restitution:.2,friction:.9,softKinematic:.7})}}await i(`glassInvi`,Pe,{bodyType:`kinematicPosition`}),await i(`stool_bound`,Pe,{bodyType:`kinematicPosition`,isIntegrityResetTarget:!0,isIntegrityCheckTarget:!0,isConvexHull:!0,restitution:.7,friction:.2}),qe(`physics-binding`,.6,R(`SYS_DYNAMIC_RIGIDBODIES`)),await i(`Object_31`,Pe,{bodyType:`dynamic`,restitution:.2,mass:10,pullingDampness:.25,canSleep:!0,isBhTarget:!0,isConvexHull:!0,isIntegrityCheckTarget:!0}),await i(`pictureLionFrame`,Pe,{bodyType:`dynamic`,mass:1,pullingDampness:.0025,canSleep:!0,isBhTarget:!0,isConvexHull:!0,isIntegrityCheckTarget:!1,isIntegrityResetTarget:!0}),await i(`Model_0001`,Pe,{bodyType:`dynamic`,mass:1.5,restitution:.01,friction:.995,pullingDampness:.0025,canSleep:!0,isBhTarget:!0,isConvexHull:!0,isIntegrityResetTarget:!0,isIntegrityCheckTarget:!1}),await i(`blackCat`,Fe,{bodyType:`fixed`,scale:new e.Vector3(1,1,.5),offset:new e.Vector3(0,.5,0)}),qe(`physics-binding`,.7,R(`SYS_BONE_HIERARCHIES`));let o=r.get(`GLTF_created_0001`);if(o){let n=b.ColliderDesc.capsule(.2,.15).setTranslation(0,0,0);Ne(t,o,t.world.createRigidBody(b.RigidBodyDesc.kinematicPositionBased()),n,{trackBoneName:`Root_M_2_6_11`,offset:new e.Vector3(0,0,0),restitution:.2,friction:.9,softKinematic:.7}),[{bone:`HipFix_R_3_7_12`,shapeType:`ball`,radius:.1,offset:new e.Vector3(0,0,0)},{bone:`HipFix_L_85_89_94`,shapeType:`ball`,radius:.1,offset:new e.Vector3(0,0,0)},{bone:`RootPart1_M_16_20_25`,shapeType:`capsule`,radius:.4,height:.3,offset:new e.Vector3(0,.2,.2)},{bone:`Tail0_M_10_14_19`,shapeType:`capsule`,radius:.05,height:.2,offset:new e.Vector3(0,0,0)},{bone:`Tail20_M_15_19_24`,shapeType:`capsule`,radius:.05,height:.2,offset:new e.Vector3(0,0,0)},{bone:`Head_M_26_30_35`,shapeType:`ball`,radius:.3,offset:new e.Vector3(0,0,0)}].forEach(e=>{let n;n=e.shapeType===`ball`?b.ColliderDesc.ball(e.radius):b.ColliderDesc.capsule(e.height,e.radius),e.offset&&n.setTranslation(e.offset.x,e.offset.y,e.offset.z),Ne(t,o,t.world.createRigidBody(b.RigidBodyDesc.kinematicPositionBased()),n,{trackBoneName:e.bone,restitution:.2,friction:.9,softKinematic:.7})})}await i(`Object_2001`,Pe,{bodyType:`dynamic`,mass:80,restitution:.6,canSleep:!0,isBhTarget:!0,isConvexHull:!0,offset:new e.Vector3(0,0,0),pullingDampness:.45,isIntegrityCheckTarget:!0}),await i(`mjolnir_low_mjolnir_hammer_0`,Pe,{bodyType:`dynamic`,mass:10,restitution:0,canSleep:!0,isBhTarget:!0,pullingDampness:.9075,isConvexHull:!0,isIntegrityResetTarget:!0}),await i(`questionCube`,Fe,{bodyType:`dynamic`,mass:20,isBhTarget:!0,isIntegrityResetTarget:!0}),await i(`shelf`,Pe,{bodyType:`dynamic`,mass:400,restitution:.3,canSleep:!0,isBhTarget:!0,pullingDampness:.25,isIntegrityCheckTarget:!1,isIntegrityResetTarget:!0});let s=[];for(let e=0;e<=38;e++){let t=`book`+String(e).padStart(3,`0`);s.push(t)}await i(s,Fe,{bodyType:`dynamic`,isBhTarget:!0,mass:2,restitution:.05,canSleep:!0,pullingDampness:.25,isIntegrityCheckTarget:!1,isIntegrityResetTarget:!0}),await i([`pokeball`,`pokeball2`],Ie,{bodyType:`dynamic`,mass:27,scale:.425,restitution:.9,isBhTarget:!0,isIntegrityResetTarget:!0}),await i(`drone`,Fe,{bodyType:`kinematicPosition`,mass:2.5,isBhTarget:!1,linearDamping:1,angularDamping:1}),qe(`physics-binding`,.85,R(`SYS_COLLISION_MESHES`));try{await i(`caseCover`,Fe,{bodyType:`dynamic`,mass:100,restitution:.1,isBhTarget:!0,isIntegrityCheckTarget:!0}),await i(`Object_42001`,Fe,{bodyType:`dynamic`,mass:.5,restitution:.93,canSleep:!0,isBhTarget:!0,pullingDampness:-1,isIntegrityResetTarget:!0}),await i(`screenDisplay`,Fe,{bodyType:`dynamic`,mass:200,scale:new e.Vector3(1,1.05,.9),offset:new e.Vector3(0,-.13,0),isBhTarget:!0,pullingDampness:.5,isIntegrityCheckTarget:!0}),await i(`screenDisplay2`,Fe,{bodyType:`dynamic`,mass:20,scale:new e.Vector3(1,1.05,.9),offset:new e.Vector3(0,-.13,0),isBhTarget:!0,pullingDampness:.15,restitution:.3,isIntegrityCheckTarget:!0}),await i(`verticalMonitor`,Fe,{bodyType:`dynamic`,mass:150,friction:.9,scale:new e.Vector3(1,1,1),offset:new e.Vector3(0,1.75,0),isBhTarget:!0,pullingDampness:.25,isIntegrityCheckTarget:!0}),await i([`aegis`,`aegis2`],Pe,{bodyType:`dynamic`,mass:1.1,restitution:.01,canSleep:!0,isBhTarget:!0,isConvexHull:!0,isIntegrityResetTarget:!0}),await i([`pillow-small-1`,`pillow-small-2`,`pillow-big-1`,`pillow-big-2`],Pe,{bodyType:`dynamic`,mass:100.3,restitution:0,friction:.9,canSleep:!0,pullingDampness:.64,isBhTarget:!0,isConvexHull:!0,isIntegrityResetTarget:!0})}catch(e){throw e}}var wc=M((()=>{He(),pt(),Gr(),Ae()})),Tc=M((()=>{Sn(),Lt(),ar()}));function Ec(t,n){if(!t||!n)return console.error(`initConversationBox: Missing model or scene`),null;let r=null;if(t.traverse(e=>{e.isBone&&e.name===`mixamorigSpine2`&&(r=e)}),r||t.traverse(e=>{e.isBone&&e.name===`mixamorigSpine`&&(r=e)}),r||t.traverse(e=>{e.isBone&&e.name===`mixamorigHips`&&(r=e)}),r||=t.getObjectByName(`Ch23_Hair`),!r)return console.warn(`initConversationBox: No head found.`),null;let i=null,a=0,o=0,s=null;new e.Vector2;function c(){if(document.getElementById(`scifi-shout-box`))return;i=document.createElement(`div`),i.id=`scifi-shout-box`,Object.assign(i.style,{position:`absolute`,top:`0`,left:`0`,pointerEvents:`none`,zIndex:`5000`,padding:`10px 20px`,color:`#ffffff`,fontFamily:`"Rajdhani", sans-serif`,fontWeight:`600`,fontSize:`18px`,textAlign:`center`,display:`flex`,alignItems:`center`,justifyContent:`center`,lineHeight:`1.4`,backgroundColor:`rgba(5, 10, 25, 0.85)`,backdropFilter:`blur(10px)`,border:`1.5px solid #00F0FF`,boxShadow:`0 0 30px rgba(0, 240, 255, 0.25)`,opacity:`0`,whiteSpace:`pre-wrap`,transform:`translate(-50%, -100%) scale(0.8)`,transition:`opacity 0.3s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.25)`,letterSpacing:`1px`,textTransform:`none`,borderRadius:`2px`,clipPath:`none`});let e=document.createElement(`div`);Object.assign(e.style,{position:`absolute`,bottom:`-7.5px`,left:`50%`,width:`12px`,height:`12px`,backgroundColor:`rgba(5, 10, 25, 0.95)`,borderLeft:`1.5px solid #00F0FF`,borderBottom:`1.5px solid #00F0FF`,transform:`translateX(-50%) rotate(-45deg)`,zIndex:`1`}),i.appendChild(e);let t=document.createElement(`div`);Object.assign(t.style,{position:`absolute`,bottom:`4px`,right:`4px`,width:`8px`,height:`8px`,borderRight:`2px solid #00F0FF`,borderBottom:`2px solid #00F0FF`}),i.appendChild(t),document.getElementById(`experience-container`).appendChild(i)}function l(e,t={}){i||c();let n=e;Array.isArray(e)&&(n=e[Math.floor(Math.random()*e.length)]);let r=i.querySelector(`.text-content`);r||(r=document.createElement(`span`),r.className=`text-content`,i.insertBefore(r,i.firstChild)),r.innerText=n;let a=1;t.extraSmall?a=.56:t.small&&(a=.65),i.style.fontSize=`${18*a}px`,i.style.minWidth=n.length>20?`160px`:`95px`}c();let u={update:t=>{if(i){if(Math.abs(o-a)>.01){let e=3*t;o=o<a?Math.min(o+e,a):Math.max(o-e,a),i.style.opacity=o,i.style.display=o>.01?`block`:`none`}else i.style.opacity=a,i.style.display=a>.01?`block`:`none`;if(a>.01&&r&&n.camera&&n.renderer){let t=new e.Vector3;r.getWorldPosition(t),t.y+=2,t.project(n.camera);let a=n.renderer.domElement,s=a.clientWidth/2,c=a.clientHeight/2,l=t.x*s+s,u=-(t.y*c)+c,d=.8+.2*o;i.style.transform=`translate(-50%, -100%) translate(${l}px, ${u}px) scale(${d})`}}},updateText:(e,t={})=>{l(e,t)},show:()=>{a=1,i&&(i.style.display=`block`)},hide:()=>{a=0},shout:(e,t=3e3,n={})=>(s&&clearTimeout(s),l(e,n),u.show(),s=setTimeout(()=>{u.hide(),s=null},t),s),clear:()=>{s&&=(clearTimeout(s),null),a=0,o=0,i&&(i.style.opacity=`0`,i.style.display=`none`)}};return u}var Dc=M((()=>{}));function Oc(t){let n=t.getObjectByName(`Blackhole`);if(!n)return;n.position.y=-500,n.scale.setScalar(2),n.traverse(t=>{t.isMesh&&t.material&&(t.material.roughness=.95,t.material.metalness=0,t.material.side=e.FrontSide,t.castShadow=!1)});function r(e,t,r){let i=n.getObjectByName(e);i?.material&&i.material[t]!==void 0&&(i.material[t]=r)}r(`Lathe_L_Blackhole_03_0`,`roughness`,.4),r(`Lathe_S_Blackhole_01_0`,`metalness`,.6);let i=n.getObjectByName(`Lathe_Center`);if(i){let n=t.globalUniformsHub;n&&n.core,i.material=new e.ShaderMaterial({vertexShader:Qt,fragmentShader:on,transparent:!0,uniforms:{...n.uniforms,nebulaCoreRadius:{value:20},nebulaTwistFactor:{value:0},alpha:{value:1}},blending:e.AdditiveBlending,name:`nebulaMat`})}}function kc(t){let n=t.globalUniformsHub,r=n?n.uniforms:{},i=Kr(t,sn,{side:e.BackSide,uniforms:{...n.core,isStriking:r.isStriking||{value:!1},normalizedStrikePos:r.normalizedStrikePos||{value:new e.Vector2(-2,-2)},uRainHeaviness:r.uRainHeaviness||{value:2},uStormSharpness:r.uStormSharpness||{value:0},uMoonPosition:r.uMoonPosition||{value:new e.Vector2(.58,.705)},uMoonSize:r.uMoonSize||{value:.006},uMoonBrightness:r.uMoonBrightness||{value:2.5},uMoonBlur:r.uMoonBlur||{value:0},uCraterScale:r.uCraterScale||{value:.555},uCraterIntensity:r.uCraterIntensity||{value:.28},uFarMountainOffset:r.uFarMountainOffset||{value:0},uNearMountainOffset:r.uNearMountainOffset||{value:-.5}}}),a=new e.Mesh(ir.plane,i);t.add(a),a.position.set(-55,-20,30),a.scale.setScalar(150),a.name=`planeSky`,a.visible=!1}function Ac(t){let n=t.globalUniformsHub,r=n?n.uniforms:{},i=Kr(t,cn,{transparent:!0,uniforms:{rainGlassOpacity:r.rainGlassOpacity||{value:1},glassRainAmount:r.glassRainAmount||{value:1},uRimCenter:r.uRimCenter||{value:new e.Vector2(-.5,.5)},uRainOffset:r.uRainOffset||{value:0},uWaterIntensity:n&&n.uWaterIntensity||{value:.2},hasRimOnGlass:{value:!0}},blending:e.AdditiveBlending,side:e.FrontSide}),a={vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,uniforms:i.uniforms};Pr(a,i.uniforms),i.vertexShader=a.vertexShader,i.fragmentShader=a.fragmentShader;let o=t.getObjectByName(`glass1`),s=t.getObjectByName(`glass2`);o&&(o.material=i),s&&(s.material=i)}var jc,Mc=M((()=>{pt(),mt(),ar(),Lt(),sc(),Hn(),gc(),Sn(),Sc(),He(),ao(),ci(),wc(),mc(),Tc(),Vr(),ls(),Dc(),Gr(),Ae(),Rt(`#dcd0ba`,.85,.03,6.5),zt(`#dcd0ba`,1,1),jc=class{constructor(e,t,n,r){this.scene=e,this.camera=t,this.renderer=n,this.model=null,this.mixer=null,this.constantUniform=It,this.resources=r}async init(t,n,r={}){return new Promise(async(n,r)=>{let i=this.resources.roomModel;if(!i){let e=`Resources: Room Model not loaded.`;console.error(e),t&&z(window.loadingProgress||0,R(`SYS_ERROR`)),r(e);return}try{t&&z(window.loadingProgress||0,R(`SYS_INIT_SCENE`)),qe(`model-assembly`,.1),this.model=i.scene,this.model.name=`roomGLBModel`,this.model.visible=!1,this.scene.add(this.model),this.scene.room=this.model,this.scene.animations=i.animations,this.boxUpdater=Ec(this.model,this.scene),this.scene.conversationManager=this.boxUpdater;let a=[`leftWallFoot001`,`Cube004`,`shelf`,`glass1`,`Object_17`,`Object_1001_1`,`Object_8001`,`glass1`,`pillow-big-2`,`pillow-small-2`,`pillow-small-1`,`pillow-big-1`,`bedMain`,`Ch23_Hair`,`Ch23_Suit`,`Object_15`],o=[`Object_1001_1`,`Object_8001`,`Object_17`,`leftWallFoot001`];this.model.getObjectByName(`inviMesh`).material.visible=!1;let s=[this.model],c=0,l=performance.now();for(;s.length>0;){let t=s.pop();if(t.isMesh&&(t.material.side=e.FrontSide,a.includes(t.name)&&(t.receiveShadow=!0),o.includes(t.name)||t.name.startsWith(`book`)?t.castShadow=!1:t.castShadow=!0),t.children)for(let e=t.children.length-1;e>=0;e--)s.push(t.children[e]);c++,c%50==0&&performance.now()-l>4&&(await Wr(),l=performance.now())}if(this.mixer=i.mixer,this.scene.mixer=i.mixer,this.scene.heroClips=i.heroClips,this.scene.activeAction=i.activeAction,this.mixer&&this.scene.animations){let t=e.AnimationClip.findByName(this.scene.animations,`3|PlaneAction`);t&&(this.scene.fanAction=this.mixer.clipAction(t),this.scene.fanAction.play())}B.start(`Helpers Setup`),rc(this.scene),Oc(this.scene),kc(this.scene),Ac(this.scene),Fn(this.scene),hc(this.scene);let u=_c(this.scene);this.scene.getObjectByName(`blackholeScene`).attach(u),B.end(`Helpers Setup`),B.start(`Adjust Objects`),qr(this.scene,t).then(()=>(B.end(`Adjust Objects`),B.start(`Bind Physics`),Cc(this.scene,t))).then(async()=>(B.end(`Bind Physics`),qe(`physics-binding`,.9),await Jr(this.scene),qe(`physics-binding`,1),Fa(this.scene),this.scene.constantUniform=It,t&&z(window.loadingProgress||0,R(`SYS_FINALIZE`)),Promise.resolve())).then(()=>{z(100),clearInterval(void 0),this.model&&this.model.position.set(0,-5e4,0),n()}).catch(e=>{console.error(`Critical error in async chain:`,e),r(e)})}catch(e){console.error(`Critical error during scene initialisation:`,e),r(e)}finally{window.completeTask&&(completeTask(`model-assembly`),completeTask(`physics-binding`))}})}updateAnimationMixer(e){this.mixer&&this.mixer.update(e),this.boxUpdater&&this.boxUpdater.update(e)}}}));async function Nc({scene:e,camera:t,orbitControl:n,clock:r,pointsApp:i}){e.targetAnimHz=30,qo(e,0),Ro(e,Pc*.05),Z(R(`SYS_INIT`)),Z(R(`ENV_CALIBRATION`)),await jo(),Z(R(`SYS_PILOT_ENTRY_WAIT`)),await Mo(),await No(200),e.isTransitioning=!0,e.HUD&&typeof e.HUD.breathe==`function`&&e.HUD.breathe(I.ELECTRIC_CYAN);let a=Q.currentMode;e.fpsStats&&e.fpsStats.avg<45&&(e.isLowPowerMode=!0),Z(`Protocol ${a.toUpperCase()} verified.`);let o=document.getElementById(`cv-container`);o&&o.classList.contains(`collapsed`)&&(o.classList.remove(`collapsed`),window.dispatchEvent(new CustomEvent(`cvToggle`,{detail:{collapsed:!1}})),await No(500)),e.HUD&&typeof e.HUD.runTweenOpen==`function`&&(await e.HUD.runTweenOpen(1500,{isIncludedIsland:!1,isIncludedDecos:!1}),e.HUD.runTweenShowIsland(2500),fo.onHudOpen(e),e.HUD.runTweenShowDecos(1e3)),i&&(i.playIntro(),i.activateScrollInteractions(),i.triggerStep&&i.triggerStep(0,1500,!0)),Z(R(`SYS_BUILD_START`)),setTimeout(()=>{e.isTransitioning=!1},1e3)}var Pc,Fc=M((()=>{ls(),Ns(),ks(),Ae(),xr(),ao(),Te(),po(),Pc=ns}));function Ic(t,n){if(!t)return console.warn(`[knowhere] Parent not found. Skipping.`),null;let r=new e.PlaneGeometry(1,1),i=Kr(n,Rc,{transparent:!0,blending:e.NormalBlending,side:e.DoubleSide,depthTest:!0,depthWrite:!1,vs:Lc});i.uniforms&&(i.uniforms.uScaleFactor={value:0},i.uniforms.uHudOffset={value:new e.Vector2(0,1.2)},i.uniforms.uStarScreenPos={value:new e.Vector2(0,0)});let a=new e.Mesh(r,i);return a.name=`knowhere`,a.scale.set(10,10,1),a.frustumCulled=!1,t.add(a),n.knowhere=a,a}var Lc,Rc,zc=M((()=>{ci(),Lt(),Lc=`
    varying vec2 vUv;
    uniform float uScaleFactor;
    uniform vec2 uHudOffset;
 
    void main() {
        vUv = uv;
        
        // Spherical Billboarding
        float scaleX = length(vec3(modelMatrix[0][0], modelMatrix[0][1], modelMatrix[0][2]));
        float scaleY = length(vec3(modelMatrix[1][0], modelMatrix[1][1], modelMatrix[1][2]));
        
        vec4 mvPosition = viewMatrix * modelMatrix * vec4(0.0, 0.0, 0.0, 1.0);
        mvPosition.xy += position.xy * vec2(scaleX, scaleY) * uScaleFactor;
        
        gl_Position = projectionMatrix * mvPosition;
    }
`,Rc=`
    uniform float iTime;
    uniform vec2 iResolution;
    uniform vec2 uMouse;
    uniform vec2 uStarScreenPos;
    varying vec2 vUv;

    void main() {
        vec2 p = vUv * 2.0 - 1.0;
        float starMask = length(p);
        
        // --- KNOWHERE STATE ---
        float kwTime = 5.0 * iTime;
        float iKw = .2, aKw;
        float distToMouse = length(uMouse - uStarScreenPos);
        float warp = 0.8 * exp(-distToMouse * 4.0);
        
        vec2 pKw = p / 0.8;
        pKw += (uMouse - uStarScreenPos) * warp * 1.2 * sin(kwTime * 3.0);
        
        vec2 dKw = vec2(-1, 1),
             bKw = pKw - iKw * dKw + (uMouse - uStarScreenPos) * warp,
             cKw = pKw * mat2(1, 1, dKw / (.1 + iKw / dot(bKw, bKw))),
             vKw = cKw * mat2(cos(.5 * log(aKw = dot(cKw, cKw)) + kwTime * iKw + vec4(0, 33, 11, 0))) / iKw;
        
        vec2 wKw = vec2(0.0);
        for (; iKw++ < 9.; wKw += 1. + sin(vKw)) vKw += .7 * sin(vKw.yx * iKw + kwTime) / iKw + .5;
        
        iKw = length( sin(vKw / .3) * .4 + cKw * (3. + dKw) );
        // Channel weights: R/G tightened for less orange, B lifted to -1.1 to keep teal edges
        vec4 O_Kw = 1. - exp( -exp( cKw.x * vec4(0.95, -.55, -1.1, 0) )
                       / wKw.xyyx / ( 2. + iKw * iKw / 4. - iKw )
                       / ( .5 + 1. / aKw ) / ( .03 + abs( length(pKw) - .7 ) ) );
        
        // Moderate vibrance: gentle lift away from grey (cool swirls stay cyan)
        float luma = dot(O_Kw.rgb, vec3(0.299, 0.587, 0.114));
        O_Kw.rgb = luma + (O_Kw.rgb - luma) * 1.5;
        O_Kw.rgb = clamp(O_Kw.rgb, 0.0, 1.0);
        
        // Archival Gold pull (#DCD0BA → linear: 0.863, 0.816, 0.729)
        // #DCD0BA is a *muted* parchment — bright zones desaturate toward it, not oversaturate
        vec3 archivalGold = vec3(0.863, 0.816, 0.729);
        float goldInfluence = smoothstep(0.3, 0.8, luma); // mid-to-bright areas only
        // First desaturate warm zones toward luma, then tint with gold ratios
        vec3 desatToGold = mix(vec3(luma), archivalGold * luma * 1.1, 0.75);
        O_Kw.rgb = mix(O_Kw.rgb, desatToGold, goldInfluence * 0.72);

        // Final Masking
        float edgeMask = 1.0 - smoothstep(0.9, 0.98, starMask);
        // Sharpen the alpha to remove white haze in the background
        float alpha = pow(O_Kw.a, 1.5) * edgeMask;
        vec4 finalColor = vec4(O_Kw.rgb, alpha);
        
        if (finalColor.a < 0.01) discard;

        gl_FragColor = finalColor;
    }
`})),Bc=M((()=>{})),Vc,Hc=M((()=>{Vc=class e extends A{constructor(e,n,r,a){super(),this.strength=n===void 0?1:n,this.radius=r,this.threshold=a,this.resolution=e===void 0?new m(256,256):new m(e.x,e.y),this.clearColor=new i(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let o=Math.round(this.resolution.x/2),s=Math.round(this.resolution.y/2);this.renderTargetBright=new _(o,s),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new _(o,s);t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new _(o,s);n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),o=Math.round(o/2),s=Math.round(s/2)}te===void 0&&console.error(`THREE.UnrealBloomPass relies on LuminosityHighPassShader`);let c=te;this.highPassUniforms=f.clone(c.uniforms),this.highPassUniforms.luminosityThreshold.value=a,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new d({uniforms:this.highPassUniforms,vertexShader:c.vertexShader,fragmentShader:c.fragmentShader,defines:{}}),this.separableBlurMaterials=[];let u=[3,5,7,9,11];o=Math.round(this.resolution.x/2),s=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(u[e])),this.separableBlurMaterials[e].uniforms.texSize.value=new m(o,s),o=Math.round(o/2),s=Math.round(s/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=n,this.compositeMaterial.uniforms.bloomRadius.value=.1,this.compositeMaterial.needsUpdate=!0;let p=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=p,this.bloomTintColors=[new h(1,1,1),new h(1,1,1),new h(1,1,1),new h(1,1,1),new h(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,ee===void 0&&console.error(`THREE.UnrealBloomPass relies on CopyShader`);let g=ee;this.copyUniforms=f.clone(g.uniforms),this.copyUniforms.opacity.value=1,this.materialCopy=new d({uniforms:this.copyUniforms,vertexShader:g.vertexShader,fragmentShader:g.fragmentShader,blending:t,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new i,this.oldClearAlpha=1,this.basic=new l({transparent:!0}),this.fsQuad=new k(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.texSize.value=new m(n,r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this.oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=r.texture,t.setRenderTarget(null),t.clear(),this.fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this.fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this.fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this.fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this.fsQuad.render(t),s=this.renderTargetsVertical[n];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this.fsQuad.render(t),this.fsQuad.material=this.materialCopy,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(r),this.fsQuad.render(t)),t.setClearColor(this._oldClearColor,this.oldClearAlpha),t.autoClear=o}getSeperableBlurMaterial(e){return new d({defines:{KERNEL_RADIUS:e,SIGMA:e},uniforms:{colorTexture:{value:null},texSize:{value:new m(.5,.5)},direction:{value:new m(.5,.5)}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 texSize;
				uniform vec2 direction;

				float gaussianPdf(in float x, in float sigma) {
					return 0.39894 * exp( -0.5 * x * x/( sigma * sigma))/sigma;
				}
				void main() {
					vec2 invSize = 1.0 / texSize;
					float fSigma = float(SIGMA);
					float weightSum = gaussianPdf(0.0, fSigma);
					vec4 diffuseSum = texture2D( colorTexture, vUv) * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianPdf(x, fSigma);
						vec2 uvOffset = direction * invSize * x;
						vec4 sample1 = texture2D( colorTexture, vUv + uvOffset);
						vec4 sample2 = texture2D( colorTexture, vUv - uvOffset);
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum);
				}`})}getCompositeMaterial(e){return new d({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},dirtTexture:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform sampler2D dirtTexture;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}},Vc.BlurDirectionX=new m(1,0),Vc.BlurDirectionY=new m(0,1)}));function Uc({material:e,bloomPass:t,TWEEN:n,MORPH_DURATION:r,DEFAULT_VIBRATE_AMPLITUDE:i,DEFAULT_SIZE_THRESHOLD:a,DEFAULT_VIBRATE_BOOST_SIZE_THRESHOLD:o,POINT_SIZE:s,UI_WIDTH:c,UI_TOP:l,UI_RIGHT:u,speed:d,hoverEffect:f,mouseDamping:p,pointReturnSpeed:m,onStart:h,onComplete:g}){let _=[];function v(e,t,n){Math.abs(t-n)>1e-4?(e.style.backgroundColor=`#ff9800`,e.style.color=`#000`):(e.style.backgroundColor=``,e.style.color=``)}let y=document.createElement(`div`);y.style.position=`absolute`,y.style.top=l,y.style.right=u,y.style.backgroundColor=`rgba(0, 0, 0, 0.7)`,y.style.padding=`15px`,y.style.borderRadius=`8px`,y.style.color=`white`,y.style.fontFamily=`sans-serif`,y.style.width=c,y.style.maxHeight=`80vh`,y.style.overflowY=`auto`,y.style.zIndex=`100`;let b=document.createElement(`div`);b.style.display=`flex`,b.style.justifyContent=`space-between`,b.style.alignItems=`center`,b.style.marginBottom=`8px`;let x=document.createElement(`div`);x.innerText=`Controls`,x.style.fontWeight=`bold`,x.style.fontSize=`14px`,x.style.color=`white`;let S=document.createElement(`div`);S.style.display=`flex`,S.style.gap=`8px`,S.style.alignItems=`center`;let C=document.createElement(`button`);C.type=`button`,C.innerText=`Show`,C.style.fontSize=`12px`,C.style.padding=`4px 8px`,C.style.cursor=`pointer`,C.style.background=`#222`,C.style.color=`white`,C.style.border=`1px solid #444`,C.style.borderRadius=`4px`;let w=document.createElement(`div`),T=document.createElement(`button`);T.type=`button`,T.innerText=`Ref`,T.title=`Force Update Sliders`,T.style.fontSize=`12px`,T.style.padding=`4px 8px`,T.style.cursor=`pointer`,T.style.background=`#222`,T.style.color=`white`,T.style.border=`1px solid #444`,T.style.borderRadius=`4px`,T.addEventListener(`click`,()=>{_.forEach(e=>e())}),S.appendChild(w),S.appendChild(T),S.appendChild(C),b.appendChild(x),b.appendChild(S),y.appendChild(b);let E=document.createElement(`div`);E.style.display=`none`,y.appendChild(E),C.addEventListener(`click`,()=>{E.style.display===`none`?(E.style.display=`block`,C.innerText=`Hide`,_.forEach(e=>e())):(E.style.display=`none`,C.innerText=`Show`)});let D=document.createElement(`div`);D.innerText=`Model Controls`,D.style.marginBottom=`10px`,D.style.fontWeight=`bold`,E.appendChild(D),(()=>{let t=document.createElement(`div`);t.style.marginTop=`8px`;let n=document.createElement(`div`);n.style.display=`flex`,n.style.alignItems=`center`,n.style.justifyContent=`space-between`;let r=1;e&&e.uniforms&&e.uniforms.uModelScale&&(r=e.uniforms.uModelScale.value);let i=document.createElement(`span`);i.innerText=`Model Scale: ${r.toFixed(2)}`,i.style.fontSize=`12px`;let a=document.createElement(`input`);a.type=`number`,a.min=`0.1`,a.max=`5.0`,a.step=`0.01`,a.value=r.toString(),a.style.width=`70px`,a.style.marginLeft=`8px`,n.appendChild(i),n.appendChild(a);let o=document.createElement(`button`);o.type=`button`,o.innerText=`Reset`,o.style.marginLeft=`6px`,o.style.fontSize=`11px`,o.style.padding=`2px 6px`,o.addEventListener(`click`,()=>c(1)),n.appendChild(o);let s=document.createElement(`input`);s.type=`range`,s.min=`0.1`,s.max=`5.0`,s.step=`0.01`,s.value=r.toString(),s.style.width=`100%`,s.style.cursor=`pointer`,_.push(()=>{if(e&&e.uniforms&&e.uniforms.uModelScale){let t=e.uniforms.uModelScale.value;i.innerText=`Model Scale: ${t.toFixed(2)}`,a.value=t,s.value=t}});function c(t){let n=parseFloat(t)||1;i.innerText=`Model Scale: ${n.toFixed(2)}`,a.value=n,s.value=n,v(a,n,r),e&&e.uniforms&&e.uniforms.uModelScale&&(e.uniforms.uModelScale.value=n)}s.addEventListener(`input`,e=>c(e.target.value)),a.addEventListener(`input`,e=>c(e.target.value)),t.appendChild(n),t.appendChild(s),E.appendChild(t)})(),(()=>{let t=document.createElement(`div`);t.style.marginTop=`12px`;let n=document.createElement(`div`);n.style.display=`flex`,n.style.alignItems=`center`,n.style.justifyContent=`space-between`,n.style.marginBottom=`4px`;let r=document.createElement(`div`);r.innerText=`Model Rotation`,r.style.fontSize=`12px`,r.style.fontWeight=`bold`;let i=document.createElement(`label`);i.style.fontSize=`11px`,i.style.display=`flex`,i.style.alignItems=`center`,i.innerText=`Mouse Rot`;let a=document.createElement(`input`);a.type=`checkbox`,a.style.marginLeft=`5px`,a.checked=!0,e&&e.uniforms&&e.uniforms.uEnableMouseRotation&&(a.checked=e.uniforms.uEnableMouseRotation.value),a.addEventListener(`change`,t=>{let n=t.target.checked;e&&e.uniforms&&e.uniforms.uEnableMouseRotation&&(e.uniforms.uEnableMouseRotation.value=n)}),i.appendChild(a),n.appendChild(r),n.appendChild(i),t.appendChild(n),[`x`,`y`,`z`].forEach(n=>{let r=document.createElement(`div`);r.style.marginBottom=`4px`;let i=document.createElement(`div`);i.style.display=`flex`,i.style.justifyContent=`space-between`,i.style.alignItems=`center`;let a=document.createElement(`span`);a.innerText=n.toUpperCase(),a.style.fontSize=`11px`;let o=document.createElement(`div`);o.style.display=`flex`,o.style.alignItems=`center`,o.style.gap=`6px`;let s=document.createElement(`span`);s.style.fontSize=`11px`;let c=document.createElement(`button`);c.type=`button`,c.innerText=`R`,c.title=`Reset to 0`,c.style.fontSize=`10px`,c.style.padding=`1px 4px`,c.style.cursor=`pointer`,o.appendChild(s),o.appendChild(c),i.appendChild(a),i.appendChild(o),r.appendChild(i);let l=document.createElement(`input`);l.type=`range`,l.min=`-6.28`,l.max=`6.28`,l.step=`0.01`,l.value=`0`,l.style.width=`100%`,l.style.cursor=`pointer`,_.push(()=>{if(e&&e.uniforms&&e.uniforms.uModelRotation){let t=e.uniforms.uModelRotation.value[n];l.value=t,s.innerText=t.toFixed(2),v(s,t,0)}}),e&&e.uniforms&&e.uniforms.uModelRotation&&(l.value=e.uniforms.uModelRotation.value[n]),s.innerText=parseFloat(l.value).toFixed(2),l.addEventListener(`input`,t=>{let r=parseFloat(t.target.value);s.innerText=r.toFixed(2),v(s,r,0),e&&e.uniforms&&e.uniforms.uModelRotation&&(e.uniforms.uModelRotation.value[n]=r)}),c.addEventListener(`click`,()=>{l.value=0,s.innerText=0 .toFixed(2),v(s,0,0),e&&e.uniforms&&e.uniforms.uModelRotation&&(e.uniforms.uModelRotation.value[n]=0)}),r.appendChild(l),t.appendChild(r)}),E.appendChild(t)})(),(()=>{let t=document.createElement(`div`);t.style.marginTop=`15px`;let n=document.createElement(`div`);n.innerText=`Model Offset (Screen)`,n.style.marginBottom=`5px`,n.style.fontWeight=`bold`,n.style.fontSize=`12px`,t.appendChild(n);let r=(n,r)=>{let i=document.createElement(`div`);i.style.display=`flex`,i.style.alignItems=`center`,i.style.justifyContent=`space-between`,i.style.marginBottom=`5px`;let a=0;e&&e.uniforms&&e.uniforms.uModelScreenOffset&&(a=e.uniforms.uModelScreenOffset.value[r]);let o=document.createElement(`span`);o.innerText=`${n}: ${a.toFixed(2)}`,o.style.fontSize=`12px`;let s=document.createElement(`input`);s.type=`number`,s.min=`-1.0`,s.max=`1.0`,s.step=`0.01`,s.value=a.toString(),s.style.width=`70px`,s.style.marginLeft=`8px`,i.appendChild(o),i.appendChild(s);let c=document.createElement(`button`);c.type=`button`,c.innerText=`Reset`,c.style.marginLeft=`6px`,c.style.fontSize=`11px`,c.style.padding=`2px 6px`,c.addEventListener(`click`,()=>u(0)),i.appendChild(c);let l=document.createElement(`input`);l.type=`range`,l.min=`-1.0`,l.max=`1.0`,l.step=`0.01`,l.value=a.toString(),l.style.width=`100%`,l.style.cursor=`pointer`,_.push(()=>{if(e&&e.uniforms&&e.uniforms.uModelScreenOffset){let t=e.uniforms.uModelScreenOffset.value[r];o.innerText=`${n}: ${t.toFixed(2)}`,s.value=t,l.value=t}});function u(t){let i=parseFloat(t)||0;o.innerText=`${n}: ${i.toFixed(2)}`,s.value=i,l.value=i,v(s,i,a),e&&e.uniforms&&e.uniforms.uModelScreenOffset&&(e.uniforms.uModelScreenOffset.value[r]=i)}l.addEventListener(`input`,e=>u(e.target.value)),s.addEventListener(`input`,e=>u(e.target.value)),t.appendChild(i),t.appendChild(l)};r(`X`,`x`),r(`Y`,`y`),E.appendChild(t)})(),(()=>{let t=document.createElement(`div`);t.style.marginBottom=`10px`;let n=document.createElement(`div`);n.innerText=`Model Position (World Space)`,n.style.fontSize=`12px`,n.style.fontWeight=`bold`,n.style.marginBottom=`6px`,t.appendChild(n);let r=(n,r)=>{let i=document.createElement(`div`);i.style.marginBottom=`5px`;let a=document.createElement(`div`);a.style.display=`flex`,a.style.justifyContent=`space-between`,a.style.alignItems=`center`;let o=document.createElement(`span`);o.innerText=n,o.style.fontSize=`12px`;let s=document.createElement(`div`);s.style.display=`flex`,s.style.alignItems=`center`,s.style.gap=`6px`;let c=0;e&&e.uniforms&&e.uniforms.uModelPosition&&(c=e.uniforms.uModelPosition.value[r]);let l=document.createElement(`span`);l.innerText=c.toFixed(2),l.style.fontSize=`11px`;let u=document.createElement(`button`);u.type=`button`,u.innerText=`R`,u.title=`Reset to 0`,u.style.fontSize=`10px`,u.style.padding=`1px 4px`,u.style.cursor=`pointer`,s.appendChild(l),s.appendChild(u),a.appendChild(o),a.appendChild(s),i.appendChild(a);let d=document.createElement(`input`);d.type=`range`,d.min=`-50.0`,d.max=`50.0`,d.step=`0.1`,d.value=c.toString(),d.style.width=`100%`,d.style.cursor=`pointer`,_.push(()=>{if(e&&e.uniforms&&e.uniforms.uModelPosition){let t=e.uniforms.uModelPosition.value[r];l.innerText=t.toFixed(2),d.value=t}});function f(t){let n=parseFloat(t)||0;l.innerText=n.toFixed(2),e&&e.uniforms&&e.uniforms.uModelPosition&&(e.uniforms.uModelPosition.value[r]=n)}d.addEventListener(`input`,e=>f(e.target.value)),u.addEventListener(`click`,()=>{d.value=`0`,f(0)}),t.appendChild(i),t.appendChild(d)};r(`X`,`x`),r(`Y`,`y`),r(`Z`,`z`),E.appendChild(t)})(),(()=>{let t=document.createElement(`div`);t.style.marginTop=`10px`;let n=document.createElement(`div`);n.style.display=`flex`,n.style.alignItems=`center`,n.style.justifyContent=`space-between`;let r=e&&e.uniforms&&e.uniforms.uModelVibFactor?e.uniforms.uModelVibFactor.value:1,i=document.createElement(`span`);i.innerText=`Model Vib Factor: ${r.toFixed(2)}`,i.style.fontSize=`12px`;let a=document.createElement(`input`);a.type=`number`,a.min=`0.0`,a.max=`10.0`,a.step=`0.1`,a.value=r.toString(),a.style.width=`70px`,a.style.marginLeft=`8px`,n.appendChild(i),n.appendChild(a);let o=document.createElement(`button`);o.type=`button`,o.innerText=`Reset`,o.style.marginLeft=`6px`,o.style.fontSize=`11px`,o.style.padding=`2px 6px`,o.addEventListener(`click`,()=>c(1)),n.appendChild(o);let s=document.createElement(`input`);s.type=`range`,s.min=`0.0`,s.max=`10.0`,s.step=`0.1`,s.value=r.toString(),s.style.width=`100%`,s.style.cursor=`pointer`,_.push(()=>{if(e&&e.uniforms&&e.uniforms.uModelVibFactor){let t=e.uniforms.uModelVibFactor.value;i.innerText=`Model Vib Factor: ${t.toFixed(2)}`,a.value=t,s.value=t}});function c(t){let n=parseFloat(t)||0;i.innerText=`Model Vib Factor: ${n.toFixed(2)}`,a.value=n,s.value=n,v(a,n,1),e&&e.uniforms&&e.uniforms.uModelVibFactor&&(e.uniforms.uModelVibFactor.value=n)}s.addEventListener(`input`,e=>c(e.target.value)),a.addEventListener(`input`,e=>c(e.target.value)),t.appendChild(n),t.appendChild(s),E.appendChild(t)})(),(()=>{let t=document.createElement(`div`);t.style.marginTop=`10px`;let n=document.createElement(`div`);n.style.display=`flex`,n.style.alignItems=`center`,n.style.justifyContent=`space-between`;let r=e&&e.uniforms&&e.uniforms.uModelPointSizeFactor?e.uniforms.uModelPointSizeFactor.value:1,i=document.createElement(`span`);i.innerText=`Model Size Factor: ${r.toFixed(2)}`,i.style.fontSize=`12px`;let a=document.createElement(`input`);a.type=`number`,a.min=`0.0`,a.max=`5.0`,a.step=`0.1`,a.value=r.toString(),a.style.width=`70px`,a.style.marginLeft=`8px`,n.appendChild(i),n.appendChild(a);let o=document.createElement(`button`);o.type=`button`,o.innerText=`Reset`,o.style.marginLeft=`6px`,o.style.fontSize=`11px`,o.style.padding=`2px 6px`,o.addEventListener(`click`,()=>c(1)),n.appendChild(o);let s=document.createElement(`input`);s.type=`range`,s.min=`0.0`,s.max=`5.0`,s.step=`0.1`,s.value=r.toString(),s.style.width=`100%`,s.style.cursor=`pointer`,_.push(()=>{if(e&&e.uniforms&&e.uniforms.uModelPointSizeFactor){let t=e.uniforms.uModelPointSizeFactor.value;i.innerText=`Model Size Factor: ${t.toFixed(2)}`,a.value=t,s.value=t}});function c(t){let n=parseFloat(t)||0;i.innerText=`Model Size Factor: ${n.toFixed(2)}`,a.value=n,s.value=n,v(a,n,1),e&&e.uniforms&&e.uniforms.uModelPointSizeFactor&&(e.uniforms.uModelPointSizeFactor.value=n)}s.addEventListener(`input`,e=>c(e.target.value)),a.addEventListener(`input`,e=>c(e.target.value)),t.appendChild(n),t.appendChild(s),E.appendChild(t)})(),(()=>{let t=document.createElement(`div`);t.style.marginTop=`15px`,t.style.marginBottom=`10px`;let n=document.createElement(`div`);n.style.display=`flex`,n.style.alignItems=`center`,n.style.justifyContent=`space-between`;let r=e&&e.uniforms&&e.uniforms.uGridZ?e.uniforms.uGridZ.value:-40,i=document.createElement(`span`);i.innerText=`Grid Z: ${r.toFixed(1)}`,i.style.fontSize=`12px`,i.style.fontWeight=`bold`;let a=document.createElement(`input`);a.type=`number`,a.min=`-2000.0`,a.max=`2000.0`,a.step=`0.1`,a.value=r.toString(),a.style.width=`70px`,a.style.marginLeft=`8px`,n.appendChild(i),n.appendChild(a);let o=document.createElement(`button`);o.type=`button`,o.innerText=`Reset`,o.style.marginLeft=`6px`,o.style.fontSize=`11px`,o.style.padding=`2px 6px`,o.addEventListener(`click`,()=>c(r)),n.appendChild(o);let s=document.createElement(`input`);s.type=`range`,s.min=`-2000.0`,s.max=`2000.0`,s.step=`0.1`,s.value=r.toString(),s.style.width=`100%`,s.style.cursor=`pointer`,_.push(()=>{if(e&&e.uniforms&&e.uniforms.uGridZ){let t=e.uniforms.uGridZ.value;i.innerText=`Grid Z: ${t.toFixed(1)}`,a.value=t,s.value=t}});function c(t){let n=parseFloat(t)||-40;a.value=n,s.value=n,v(a,n,r),e&&e.uniforms&&e.uniforms.uGridZ&&(e.uniforms.uGridZ.value=n,i.innerText=`Grid Z: ${n.toFixed(1)}`)}s.addEventListener(`input`,e=>c(e.target.value)),a.addEventListener(`input`,e=>c(e.target.value)),t.appendChild(n),t.appendChild(s),E.appendChild(t)})(),(()=>{let t=document.createElement(`div`);t.style.marginTop=`10px`,t.style.marginBottom=`10px`;let n=document.createElement(`div`);n.style.display=`flex`,n.style.alignItems=`center`,n.style.justifyContent=`space-between`;let r=e&&e.uniforms&&e.uniforms.uHoverPointScaleFactor?e.uniforms.uHoverPointScaleFactor.value:1,i=document.createElement(`span`);i.innerText=`Hover Scale: ${r.toFixed(2)}`,i.style.fontSize=`12px`;let a=document.createElement(`input`);a.type=`number`,a.min=`0.0`,a.max=`10.0`,a.step=`0.1`,a.value=r.toString(),a.style.width=`70px`,a.style.marginLeft=`8px`,n.appendChild(i),n.appendChild(a);let o=document.createElement(`button`);o.type=`button`,o.innerText=`Reset`,o.style.marginLeft=`6px`,o.style.fontSize=`11px`,o.style.padding=`2px 6px`,o.addEventListener(`click`,()=>c(1)),n.appendChild(o);let s=document.createElement(`input`);s.type=`range`,s.min=`0.0`,s.max=`10.0`,s.step=`0.1`,s.value=r.toString(),s.style.width=`100%`,s.style.cursor=`pointer`,_.push(()=>{if(e&&e.uniforms&&e.uniforms.uHoverPointScaleFactor){let t=e.uniforms.uHoverPointScaleFactor.value;i.innerText=`Hover Scale: ${t.toFixed(2)}`,a.value=t,s.value=t}});function c(t){let n=parseFloat(t)||0;i.innerText=`Hover Scale: ${n.toFixed(2)}`,a.value=n,s.value=n,v(a,n,1),e&&e.uniforms&&e.uniforms.uHoverPointScaleFactor&&(e.uniforms.uHoverPointScaleFactor.value=n)}s.addEventListener(`input`,e=>c(e.target.value)),a.addEventListener(`input`,e=>c(e.target.value)),t.appendChild(n),t.appendChild(s),E.appendChild(t)})(),(()=>{let t=document.createElement(`div`);t.style.marginTop=`10px`,t.style.marginBottom=`10px`;let n=document.createElement(`div`);n.style.display=`flex`,n.style.alignItems=`center`,n.style.justifyContent=`space-between`;let r=e&&e.uniforms&&e.uniforms.uAttractionForce?e.uniforms.uAttractionForce.value:0,i=document.createElement(`span`);i.innerText=`Attraction Force: ${r.toFixed(1)}`,i.style.fontSize=`12px`;let a=document.createElement(`input`);a.type=`number`,a.min=`0.0`,a.max=`4000.0`,a.step=`0.5`,a.value=r.toString(),a.style.width=`70px`,a.style.marginLeft=`8px`,n.appendChild(i),n.appendChild(a);let o=document.createElement(`button`);o.type=`button`,o.innerText=`Reset`,o.style.marginLeft=`6px`,o.style.fontSize=`11px`,o.style.padding=`2px 6px`,o.addEventListener(`click`,()=>c(800)),n.appendChild(o);let s=document.createElement(`input`);s.type=`range`,s.min=`0.0`,s.max=`4000.0`,s.step=`0.5`,s.value=r.toString(),s.style.width=`100%`,s.style.cursor=`pointer`,_.push(()=>{if(e&&e.uniforms&&e.uniforms.uAttractionForce){let t=e.uniforms.uAttractionForce.value;i.innerText=`Attraction Force: ${t.toFixed(1)}`,a.value=t,s.value=t}});function c(t){let n=parseFloat(t)||0;i.innerText=`Attraction Force: ${n.toFixed(1)}`,a.value=n,s.value=n,v(a,n,800),e&&e.uniforms&&e.uniforms.uAttractionForce&&(e.uniforms.uAttractionForce.value=n)}s.addEventListener(`input`,e=>c(e.target.value)),a.addEventListener(`input`,e=>c(e.target.value)),t.appendChild(n),t.appendChild(s),E.appendChild(t)})(),(()=>{let t=document.createElement(`div`);t.style.marginTop=`10px`,t.style.marginBottom=`10px`;let n=document.createElement(`div`);n.style.display=`flex`,n.style.alignItems=`center`,n.style.justifyContent=`space-between`;let r=e&&e.uniforms&&e.uniforms.uAttractionRefSize?e.uniforms.uAttractionRefSize.value:15,i=document.createElement(`span`);i.innerText=`Mass Ref Size: ${r.toFixed(1)}`,i.title=`Lower value = Heavier (More Stable)`,i.style.fontSize=`12px`;let a=document.createElement(`input`);a.type=`number`,a.min=`1.0`,a.max=`100.0`,a.step=`0.5`,a.value=r.toString(),a.style.width=`70px`,a.style.marginLeft=`8px`,n.appendChild(i),n.appendChild(a);let o=document.createElement(`button`);o.type=`button`,o.innerText=`Reset`,o.style.marginLeft=`6px`,o.style.fontSize=`11px`,o.style.padding=`2px 6px`,o.addEventListener(`click`,()=>c(15)),n.appendChild(o);let s=document.createElement(`input`);s.type=`range`,s.min=`1.0`,s.max=`100.0`,s.step=`0.5`,s.value=r.toString(),s.style.width=`100%`,s.style.cursor=`pointer`,_.push(()=>{if(e&&e.uniforms&&e.uniforms.uAttractionRefSize){let t=e.uniforms.uAttractionRefSize.value;i.innerText=`Mass Ref Size: ${t.toFixed(1)}`,a.value=t,s.value=t}});function c(t){let n=parseFloat(t)||15;i.innerText=`Mass Ref Size: ${n.toFixed(1)}`,a.value=n,s.value=n,v(a,n,15),e&&e.uniforms&&e.uniforms.uAttractionRefSize&&(e.uniforms.uAttractionRefSize.value=n)}s.addEventListener(`input`,e=>c(e.target.value)),a.addEventListener(`input`,e=>c(e.target.value)),t.appendChild(n),t.appendChild(s),E.appendChild(t)})(),(()=>{let t=document.createElement(`div`);t.style.marginTop=`10px`,t.style.marginBottom=`10px`;let n=document.createElement(`div`);n.style.display=`flex`,n.style.alignItems=`center`,n.style.justifyContent=`space-between`;let r=e&&e.uniforms&&e.uniforms.uAttractionRadius?e.uniforms.uAttractionRadius.value:600,i=document.createElement(`span`);i.innerText=`Attract Radius: ${r.toFixed(0)}`,i.title=`Range of the suction pull`,i.style.fontSize=`12px`;let a=document.createElement(`input`);a.type=`number`,a.min=`0.0`,a.max=`2000.0`,a.step=`10`,a.value=r.toString(),a.style.width=`70px`,a.style.marginLeft=`8px`,n.appendChild(i),n.appendChild(a);let o=document.createElement(`button`);o.type=`button`,o.innerText=`Reset`,o.style.marginLeft=`6px`,o.style.fontSize=`11px`,o.style.padding=`2px 6px`,o.addEventListener(`click`,()=>c(600)),n.appendChild(o);let s=document.createElement(`input`);s.type=`range`,s.min=`0.0`,s.max=`2000.0`,s.step=`10`,s.value=r.toString(),s.style.width=`100%`,s.style.cursor=`pointer`,_.push(()=>{if(e&&e.uniforms&&e.uniforms.uAttractionRadius){let t=e.uniforms.uAttractionRadius.value;i.innerText=`Attract Radius: ${t.toFixed(0)}`,a.value=t,s.value=t}});function c(t){let n=parseFloat(t)||0;i.innerText=`Attract Radius: ${n.toFixed(0)}`,a.value=n,s.value=n,v(a,n,600),e&&e.uniforms&&e.uniforms.uAttractionRadius&&(e.uniforms.uAttractionRadius.value=n)}s.addEventListener(`input`,e=>c(e.target.value)),a.addEventListener(`input`,e=>c(e.target.value)),t.appendChild(n),t.appendChild(s),E.appendChild(t)})();let O=document.createElement(`div`);O.innerText=`Lighting`,O.style.marginTop=`15px`,O.style.marginBottom=`10px`,O.style.fontWeight=`bold`,E.appendChild(O);let k=(t,n)=>{let r=document.createElement(`div`);r.style.marginBottom=`5px`;let i=document.createElement(`div`);i.style.display=`flex`,i.style.alignItems=`center`,i.style.justifyContent=`space-between`;let a=1;e&&e.uniforms&&e.uniforms.uLightDir&&(a=e.uniforms.uLightDir.value[n]);let o=document.createElement(`span`);o.innerText=`${t}: ${a.toFixed(1)}`,o.style.fontSize=`12px`;let s=document.createElement(`input`);s.type=`number`,s.min=`-100.0`,s.max=`100.0`,s.step=`0.1`,s.value=a.toString(),s.style.width=`70px`,s.style.marginLeft=`8px`,i.appendChild(o),i.appendChild(s);let c=document.createElement(`button`);c.type=`button`,c.innerText=`Reset`,c.style.marginLeft=`6px`,c.style.fontSize=`11px`,c.style.padding=`2px 6px`,c.addEventListener(`click`,()=>u(a)),i.appendChild(c);let l=document.createElement(`input`);l.type=`range`,l.min=`-100.0`,l.max=`100.0`,l.step=`0.1`,l.value=a.toString(),l.style.width=`100%`,l.style.cursor=`pointer`,_.push(()=>{if(e&&e.uniforms&&e.uniforms.uLightDir){let r=e.uniforms.uLightDir.value[n];o.innerText=`${t}: ${r.toFixed(1)}`,s.value=r,l.value=r}});function u(r){let i=parseFloat(r)||0;o.innerText=`${t}: ${i.toFixed(1)}`,s.value=i,l.value=i,v(s,i,a),e&&e.uniforms&&e.uniforms.uLightDir&&(e.uniforms.uLightDir.value[n]=i)}l.addEventListener(`input`,e=>u(e.target.value)),s.addEventListener(`input`,e=>u(e.target.value)),r.appendChild(i),r.appendChild(l),E.appendChild(r)};k(`X`,`x`),k(`Y`,`y`),k(`Z`,`z`),(()=>{let t=document.createElement(`div`);t.style.marginTop=`8px`;let n=document.createElement(`div`);n.style.display=`flex`,n.style.alignItems=`center`,n.style.justifyContent=`space-between`;let r=1;e&&e.uniforms&&e.uniforms.uLightStrength&&(r=e.uniforms.uLightStrength.value);let i=document.createElement(`span`);i.innerText=`Light Strength: ${r.toFixed(2)}`,i.style.fontSize=`12px`;let a=document.createElement(`input`);a.type=`number`,a.min=`0.0`,a.max=`10.0`,a.step=`0.01`,a.value=r.toString(),a.style.width=`70px`,a.style.marginLeft=`8px`,n.appendChild(i),n.appendChild(a);let o=document.createElement(`button`);o.type=`button`,o.innerText=`Reset`,o.style.marginLeft=`6px`,o.style.fontSize=`11px`,o.style.padding=`2px 6px`,o.addEventListener(`click`,()=>c(r)),n.appendChild(o);let s=document.createElement(`input`);s.type=`range`,s.min=`0.0`,s.max=`10.0`,s.step=`0.01`,s.value=r.toString(),s.style.width=`100%`,s.style.cursor=`pointer`,_.push(()=>{if(e&&e.uniforms&&e.uniforms.uLightStrength){let t=e.uniforms.uLightStrength.value;i.innerText=`Light Strength: ${t.toFixed(2)}`,a.value=t,s.value=t}});function c(t){let n=parseFloat(t)||0;i.innerText=`Light Strength: ${n.toFixed(2)}`,a.value=n,s.value=n,v(a,n,r),e&&e.uniforms&&e.uniforms.uLightStrength&&(e.uniforms.uLightStrength.value=n)}s.addEventListener(`input`,e=>c(e.target.value)),a.addEventListener(`input`,e=>c(e.target.value)),t.appendChild(n),t.appendChild(s),E.appendChild(t)})();let A=document.createElement(`div`);A.innerText=`Bloom (Post-Process)`,A.style.marginTop=`15px`,A.style.marginBottom=`10px`,A.style.fontWeight=`bold`,E.appendChild(A),(()=>{if(!t)return;let e=(e,n,r,i,a)=>{let o=document.createElement(`div`);o.style.marginBottom=`8px`;let s=document.createElement(`div`);s.style.display=`flex`,s.style.alignItems=`center`,s.style.justifyContent=`space-between`;let c=t[n],l=document.createElement(`span`);l.innerText=`${e}: ${c.toFixed(2)}`,l.style.fontSize=`12px`;let u=document.createElement(`input`);u.type=`number`,u.min=r,u.max=i,u.step=a,u.value=c.toString(),u.style.width=`70px`,u.style.marginLeft=`8px`,s.appendChild(l),s.appendChild(u);let d=document.createElement(`button`);d.type=`button`,d.innerText=`Reset`,d.style.marginLeft=`6px`,d.style.fontSize=`11px`,d.style.padding=`2px 6px`,d.addEventListener(`click`,()=>p(c)),s.appendChild(d);let f=document.createElement(`input`);f.type=`range`,f.min=r,f.max=i,f.step=a,f.value=c.toString(),f.style.width=`100%`,f.style.cursor=`pointer`,_.push(()=>{let r=t[n];l.innerText=`${e}: ${r.toFixed(2)}`,u.value=r,f.value=r});function p(r){let i=parseFloat(r)||0;l.innerText=`${e}: ${i.toFixed(2)}`,u.value=i,f.value=i,v(u,i,c),t[n]=i}f.addEventListener(`input`,e=>p(e.target.value)),u.addEventListener(`input`,e=>p(e.target.value)),o.appendChild(s),o.appendChild(f),E.appendChild(o)};e(`Strength`,`strength`,`0.0`,`5.0`,`0.01`),e(`Radius`,`radius`,`0.0`,`2.0`,`0.01`),e(`Threshold`,`threshold`,`0.0`,`1.0`,`0.01`)})(),(()=>{let t=document.createElement(`div`);t.style.marginTop=`8px`;let n=document.createElement(`div`);n.style.display=`flex`,n.style.alignItems=`center`,n.style.justifyContent=`space-between`;let r=1.5;e&&e.uniforms&&e.uniforms.uLightSizeBoost&&(r=e.uniforms.uLightSizeBoost.value);let i=document.createElement(`span`);i.innerText=`Light Size Boost: ${r.toFixed(2)}`,i.style.fontSize=`12px`;let a=document.createElement(`input`);a.type=`number`,a.min=`0.0`,a.max=`10.0`,a.step=`0.01`,a.value=r.toString(),a.style.width=`70px`,a.style.marginLeft=`8px`,n.appendChild(i),n.appendChild(a);let o=document.createElement(`button`);o.type=`button`,o.innerText=`Reset`,o.style.marginLeft=`6px`,o.style.fontSize=`11px`,o.style.padding=`2px 6px`,o.addEventListener(`click`,()=>c(r)),n.appendChild(o);let s=document.createElement(`input`);s.type=`range`,s.min=`0.0`,s.max=`10.0`,s.step=`0.01`,s.value=r.toString(),s.style.width=`100%`,s.style.cursor=`pointer`,_.push(()=>{if(e&&e.uniforms&&e.uniforms.uLightSizeBoost){let t=e.uniforms.uLightSizeBoost.value;i.innerText=`Light Size Boost: ${t.toFixed(2)}`,a.value=t,s.value=t}});function c(t){let n=parseFloat(t)||0;i.innerText=`Light Size Boost: ${n.toFixed(2)}`,a.value=n,s.value=n,v(a,n,r),e&&e.uniforms&&e.uniforms.uLightSizeBoost&&(e.uniforms.uLightSizeBoost.value=n)}s.addEventListener(`input`,e=>c(e.target.value)),a.addEventListener(`input`,e=>c(e.target.value)),t.appendChild(n),t.appendChild(s),E.appendChild(t)})();let ee=document.createElement(`div`);ee.innerText=`Appearance`,ee.style.marginTop=`15px`,ee.style.marginBottom=`10px`,ee.style.fontWeight=`bold`,E.appendChild(ee),(()=>{let t=document.createElement(`div`);t.style.marginTop=`8px`;let n=document.createElement(`div`);n.style.display=`flex`,n.style.alignItems=`center`,n.style.justifyContent=`space-between`;let r=document.createElement(`span`);r.innerText=`Point Size: ${s.toFixed(3)}`,r.style.fontSize=`12px`;let i=document.createElement(`input`);i.type=`number`,i.min=`0.001`,i.max=`0.01`,i.step=`0.0001`,i.value=s.toString(),i.style.width=`70px`,i.style.marginLeft=`8px`,n.appendChild(r),n.appendChild(i);let a=document.createElement(`button`);a.type=`button`,a.innerText=`Reset`,a.style.marginLeft=`6px`,a.style.fontSize=`11px`,a.style.padding=`2px 6px`,a.addEventListener(`click`,()=>c(s)),n.appendChild(a);let o=document.createElement(`input`);o.type=`range`,o.min=`0.0`,o.max=`0.2`,o.step=`0.001`,o.value=s.toString(),o.style.width=`100%`,o.style.cursor=`pointer`,_.push(()=>{if(e&&e.uniforms&&e.uniforms.uSize){let t=e.uniforms.uSize.value;r.innerText=`Point Size: ${t.toFixed(3)}`,i.value=t,o.value=t}});function c(t){let n=parseFloat(t)||0;r.innerText=`Point Size: ${n.toFixed(3)}`,i.value=n,o.value=n,v(i,n,s),e&&e.uniforms&&e.uniforms.uSize&&(e.uniforms.uSize.value=n)}o.addEventListener(`input`,e=>c(e.target.value)),i.addEventListener(`input`,e=>c(e.target.value)),t.appendChild(n),t.appendChild(o),E.appendChild(t)})(),(()=>{let t=document.createElement(`div`);t.style.marginTop=`8px`;let n=document.createElement(`div`);n.style.display=`flex`,n.style.alignItems=`center`,n.style.justifyContent=`space-between`;let r=e&&e.uniforms&&e.uniforms.uSizeThreshold?e.uniforms.uSizeThreshold.value:a,i=document.createElement(`span`);i.innerText=`Size Threshold: ${r.toFixed(2)}`,i.style.fontSize=`12px`;let o=document.createElement(`input`);o.type=`number`,o.min=`0.0`,o.max=`100.0`,o.step=`0.1`,o.value=r.toString(),o.style.width=`70px`,o.style.marginLeft=`8px`,n.appendChild(i),n.appendChild(o);let s=document.createElement(`button`);s.type=`button`,s.innerText=`Reset`,s.style.marginLeft=`6px`,s.style.fontSize=`11px`,s.style.padding=`2px 6px`,s.addEventListener(`click`,()=>l(r)),n.appendChild(s);let c=document.createElement(`input`);c.type=`range`,c.min=`0.0`,c.max=`100.0`,c.step=`0.1`,c.value=r.toString(),c.style.width=`100%`,c.style.cursor=`pointer`,_.push(()=>{if(e&&e.uniforms&&e.uniforms.uSizeThreshold){let t=e.uniforms.uSizeThreshold.value;i.innerText=`Size Threshold: ${t.toFixed(2)}`,o.value=t,c.value=t}});function l(t){let n=parseFloat(t)||0;i.innerText=`Size Threshold: ${n.toFixed(2)}`,o.value=n,c.value=n,v(o,n,a),e&&e.uniforms&&e.uniforms.uSizeThreshold&&(e.uniforms.uSizeThreshold.value=n)}c.addEventListener(`input`,e=>l(e.target.value)),o.addEventListener(`input`,e=>l(e.target.value)),t.appendChild(n),t.appendChild(c),E.appendChild(t)})(),(()=>{let t=e&&e.uniforms&&e.uniforms.uPixelRatio?e.uniforms.uPixelRatio.value:1,n=document.createElement(`div`);n.style.marginTop=`8px`;let r=document.createElement(`div`);r.style.display=`flex`,r.style.alignItems=`center`,r.style.justifyContent=`space-between`;let i=document.createElement(`span`);i.innerText=`Pixel Ratio: ${t.toFixed(2)}`,i.style.fontSize=`12px`;let a=document.createElement(`input`);a.type=`number`,a.min=`0.5`,a.max=`4.0`,a.step=`0.01`,a.value=t.toString(),a.style.width=`70px`,a.style.marginLeft=`8px`,r.appendChild(i),r.appendChild(a);let o=document.createElement(`button`);o.type=`button`,o.innerText=`Reset`,o.style.marginLeft=`6px`,o.style.fontSize=`11px`,o.style.padding=`2px 6px`,o.addEventListener(`click`,()=>c(t)),r.appendChild(o);let s=document.createElement(`input`);s.type=`range`,s.min=`0.5`,s.max=`4.0`,s.step=`0.1`,s.value=t.toString(),s.style.width=`100%`,s.style.cursor=`pointer`,_.push(()=>{if(e&&e.uniforms&&e.uniforms.uPixelRatio){let t=e.uniforms.uPixelRatio.value;i.innerText=`Pixel Ratio: ${t.toFixed(2)}`,a.value=t,s.value=t}});function c(n){let r=parseFloat(n)||0;i.innerText=`Pixel Ratio: ${r.toFixed(2)}`,a.value=r,s.value=r,v(a,r,t),e&&e.uniforms&&e.uniforms.uPixelRatio&&(e.uniforms.uPixelRatio.value=r)}s.addEventListener(`input`,e=>c(e.target.value)),a.addEventListener(`input`,e=>c(e.target.value)),n.appendChild(r),n.appendChild(s),E.appendChild(n)})();let te=document.createElement(`div`);te.innerText=`Dynamics`,te.style.marginTop=`15px`,te.style.marginBottom=`10px`,te.style.fontWeight=`bold`,E.appendChild(te),(()=>{let t=document.createElement(`div`);t.style.marginTop=`8px`;let n=document.createElement(`div`);n.style.display=`flex`,n.style.alignItems=`center`,n.style.justifyContent=`space-between`;let r=e&&e.uniforms&&e.uniforms.uVibrateAmp?e.uniforms.uVibrateAmp.value:0,i=document.createElement(`span`);i.innerText=`Vibration: ${r.toFixed(2)}`,i.style.fontSize=`12px`;let a=document.createElement(`input`);a.type=`number`,a.min=`0.0`,a.max=`5.0`,a.step=`0.01`,a.value=r.toString(),a.style.width=`70px`,a.style.marginLeft=`8px`,n.appendChild(i),n.appendChild(a);let o=document.createElement(`button`);o.type=`button`,o.innerText=`Reset`,o.style.marginLeft=`6px`,o.style.fontSize=`11px`,o.style.padding=`2px 6px`,o.addEventListener(`click`,()=>c(r)),n.appendChild(o);let s=document.createElement(`input`);s.type=`range`,s.min=`0.0`,s.max=`5.0`,s.step=`0.01`,s.value=r.toString(),s.style.width=`100%`,s.style.cursor=`pointer`,_.push(()=>{if(e&&e.uniforms&&e.uniforms.uVibrateAmp){let t=e.uniforms.uVibrateAmp.value;i.innerText=`Vibration: ${t.toFixed(2)}`,a.value=t,s.value=t}});function c(t){let n=parseFloat(t)||0;i.innerText=`Vibration: ${n.toFixed(2)}`,a.value=n,s.value=n,v(a,n,r),e&&e.uniforms&&e.uniforms.uVibrateAmp&&(e.uniforms.uVibrateAmp.value=n)}s.addEventListener(`input`,e=>c(e.target.value)),a.addEventListener(`input`,e=>c(e.target.value)),t.appendChild(n),t.appendChild(s),E.appendChild(t)})(),(()=>{let t=document.createElement(`div`);t.style.marginTop=`8px`;let n=document.createElement(`div`);n.style.display=`flex`,n.style.alignItems=`center`,n.style.justifyContent=`space-between`;let r=e&&e.uniforms&&e.uniforms.uVibrateBoostSizeThreshold?e.uniforms.uVibrateBoostSizeThreshold.value:o,i=document.createElement(`span`);i.innerText=`Vibrate Boost Size: ${r.toFixed(2)}`,i.style.fontSize=`12px`;let a=document.createElement(`input`);a.type=`number`,a.min=`0.0`,a.max=`100.0`,a.step=`0.1`,a.value=r.toString(),a.style.width=`70px`,a.style.marginLeft=`8px`,n.appendChild(i),n.appendChild(a);let s=document.createElement(`button`);s.type=`button`,s.innerText=`Reset`,s.style.marginLeft=`6px`,s.style.fontSize=`11px`,s.style.padding=`2px 6px`,s.addEventListener(`click`,()=>l(r)),n.appendChild(s);let c=document.createElement(`input`);c.type=`range`,c.min=`0.0`,c.max=`100.0`,c.step=`0.1`,c.value=r.toString(),c.style.width=`100%`,c.style.cursor=`pointer`,_.push(()=>{if(e&&e.uniforms&&e.uniforms.uVibrateBoostSizeThreshold){let t=e.uniforms.uVibrateBoostSizeThreshold.value;i.innerText=`Vibrate Boost Size: ${t.toFixed(2)}`,a.value=t,c.value=t}});function l(t){let n=parseFloat(t)||0;i.innerText=`Vibrate Boost Size: ${n.toFixed(2)}`,a.value=n,c.value=n,v(a,n,r),e&&e.uniforms&&e.uniforms.uVibrateBoostSizeThreshold&&(e.uniforms.uVibrateBoostSizeThreshold.value=n)}c.addEventListener(`input`,e=>l(e.target.value)),a.addEventListener(`input`,e=>l(e.target.value)),t.appendChild(n),t.appendChild(c),E.appendChild(t)})(),(()=>{let e=document.createElement(`div`);e.style.marginTop=`8px`;let t=document.createElement(`div`);t.style.display=`flex`,t.style.alignItems=`center`,t.style.justifyContent=`space-between`;let n=p?p.value:.001,r=document.createElement(`span`);r.innerText=`Mouse Damping: ${n.toFixed(3)}`,r.style.fontSize=`12px`;let i=document.createElement(`input`);i.type=`number`,i.min=`0.001`,i.max=`0.2`,i.step=`0.001`,i.value=n.toString(),i.style.width=`70px`,i.style.marginLeft=`8px`,t.appendChild(r),t.appendChild(i);let a=document.createElement(`button`);a.type=`button`,a.innerText=`Reset`,a.style.marginLeft=`6px`,a.style.fontSize=`11px`,a.style.padding=`2px 6px`,a.addEventListener(`click`,()=>s(n)),t.appendChild(a);let o=document.createElement(`input`);o.type=`range`,o.min=`0.001`,o.max=`0.2`,o.step=`0.001`,o.value=n.toString(),o.style.width=`100%`,o.style.cursor=`pointer`,_.push(()=>{if(p){let e=p.value;r.innerText=`Mouse Damping: ${e.toFixed(3)}`,i.value=e,o.value=e}});function s(e){let t=parseFloat(e)||.001;r.innerText=`Mouse Damping: ${t.toFixed(3)}`,i.value=t,o.value=t,v(i,t,n),p&&(p.value=t)}o.addEventListener(`input`,e=>s(e.target.value)),i.addEventListener(`input`,e=>s(e.target.value)),e.appendChild(t),e.appendChild(o),E.appendChild(e)})(),(()=>{let e=document.createElement(`div`);e.style.marginTop=`8px`;let t=document.createElement(`div`);t.style.display=`flex`,t.style.alignItems=`center`,t.style.justifyContent=`space-between`;let n=m?m.value:.05,r=document.createElement(`span`);r.innerText=`Point Return Speed: ${n.toFixed(3)}`,r.style.fontSize=`12px`;let i=document.createElement(`input`);i.type=`number`,i.min=`0.001`,i.max=`0.3`,i.step=`0.001`,i.value=n.toString(),i.style.width=`70px`,i.style.marginLeft=`8px`,t.appendChild(r),t.appendChild(i);let a=document.createElement(`button`);a.type=`button`,a.innerText=`Reset`,a.style.marginLeft=`6px`,a.style.fontSize=`11px`,a.style.padding=`2px 6px`,a.addEventListener(`click`,()=>s(n)),t.appendChild(a);let o=document.createElement(`input`);o.type=`range`,o.min=`0.001`,o.max=`0.3`,o.step=`0.001`,o.value=n.toString(),o.style.width=`100%`,o.style.cursor=`pointer`,_.push(()=>{if(m){let e=m.value;r.innerText=`Point Return Speed: ${e.toFixed(3)}`,i.value=e,o.value=e}});function s(e){let t=parseFloat(e)||.001;r.innerText=`Point Return Speed: ${t.toFixed(3)}`,i.value=t,o.value=t,v(i,t,n),m&&(m.value=t)}o.addEventListener(`input`,e=>s(e.target.value)),i.addEventListener(`input`,e=>s(e.target.value)),e.appendChild(t),e.appendChild(o),E.appendChild(e)})();let j=document.createElement(`button`);j.type=`button`,j.innerText=`Morph: Off`,j.style.padding=`6px 12px`,j.style.backgroundColor=`#333`,j.style.color=`white`,j.style.border=`1px solid #666`,j.style.borderRadius=`4px`,j.style.cursor=`pointer`,j.style.fontSize=`12px`;let M=null;j.addEventListener(`click`,()=>{M&&M.stop();let t=e.uniforms.uProgress.value,i=t>.5?0:1,a=r;console.log(e.uniforms),M=new n.Tween({progress:t}).to({progress:i},a).easing(lo).onUpdate(t=>{e.uniforms.uProgress.value=t.progress}).onStart(()=>{h&&h()}).onComplete(()=>{j.innerText=e.uniforms.uProgress.value>.5?`Morph: On`:`Morph: Off`,M=null,g&&g()}).start()}),w.appendChild(j),document.body.appendChild(y)}var Wc=M((()=>{uo()})),Gc,Kc,qc,Jc,Yc=M((()=>{Sn(),Gc=`
    precision highp float;
    varying vec3 vNormal;
    varying vec3 vPosition; // Pass position to fragment shader
    // per-vertex size
    // attribute float aStartSize; // Removed
    uniform float uSize;
    uniform float uPixelRatio;
    // lighting used to scale sizes
    uniform vec3 uLightDir;
    uniform float uLightSizeBoost;
    // vibration using position for jitter
    uniform float iTime;
    uniform float uVibrateAmp;
    // morphing from position (random) to target positions
    attribute vec3 aTargetPos;
    // attribute vec3 aStartPos; // REMOVED: Using 'position' instead
    uniform float uProgress;
    uniform float uVibrateBoostSizeThreshold;
    uniform float uMorphStagger; // 0.0 to 1.0 Control
    
    // Atlas support
    // attribute float aStartIsGrid; // Removed
    // attribute float aTargetIsGrid; // Removed
    attribute float aStableRandom;
	
    // PACKED ATTRIBUTES
    attribute vec2 aStartSizeIsGrid;
    attribute vec2 aTargetSizeIsGrid;
    
    varying float vTextureIndex;
    varying float vStableRandom; // Pass stable index to fragment

    // aPointData: x=linearIndex, y=isDipper, z=brightnessFactor, w=packed(texSlot*2+useColor)
    attribute vec4 aPointData;
    varying vec4 vPointData;
    
    // Repulsion uniforms
    uniform vec2 uResolution;
    uniform vec2 uMouseNDC;
    uniform float uHoverRadius;
    uniform vec2 uModelScreenOffset; // New uniform for model offset
    uniform vec3 uModelPosition; // New uniform for World Position (XYZ)
    uniform vec3 uModelRotation; // New uniform for rotation (XYZ)
    uniform float uModelScale; // New uniform for scale
    uniform float uIsChaos; // Chaos state flag (1.0 = Chaos/Root, 0.0 = Other)
    uniform float uGridZ;
    uniform float uBaseGridZ;
    uniform vec3 uGridForward;
    uniform float uModelVibFactor;
    uniform float uModelPointSizeFactor;

    uniform float uHoverPointScaleFactor;
    // Attraction
    uniform float uAttractionForce;
    uniform float uIsArmatureState;
    uniform float uAttractionRefSize;
    uniform float uAttractionRadius;
    uniform float uDistStaggerFactor;
    uniform float uDistStaggerMax;

    // GLOBAL HOVER SWAP
    uniform float uHoveredTextureIndex; // Target texture index for swap
    uniform float uHoveredIndex; // Index of the specifically hovered point
    uniform float uGlobalHoverStrength; // 0.0 to 1.0 (Effect strength)
    uniform float uFOV; // Central Perspective FOV
    uniform float uProjectionMultiplier; // PRE-CALCULATED
    uniform mat3 uModelMat3; // PRE-CALCULATED ROTATION MATRIX
    uniform vec2 uMouseScreen; // PRE-CALCULATED MOUSE POSITION
    
    // TITLE MASKING REPULSION
    uniform vec4 uTitleMaskRectBase; // CenterX, CenterY, Width/2, Height/2
    uniform float uTitleMaskScale;   // GSAP controlled (0.0 to 1.0)
    uniform float uTitleMaskEdgeJitter; // controls jitter on the edge
    
    // HUD MASKING UNIFORMS (Relocated from Fragment for Performance)
    uniform vec4 uMaskRect; // x,y (min), z,w (max)
    uniform vec4 uMaskRectNav; // x,y (min), z,w (max)
    uniform vec2 uMaskSlant; // x=OriginX, y=OriginY
    
    // KNOWHERE GRAVITY
    uniform vec2 uKnowhereScreen;
    uniform float uKnowhereGravity;
    uniform float uKnowhereRadius;
    uniform float uKnowhereScale;
    uniform float uIsGardenHovering;
    uniform float uKnowhereVibrateBoost;
    
    // BIG DIPPER SUPPORT (For Size Scaling)
    uniform vec4 uBigDipper[8]; // Updated to 8 elements to match Points.js
    uniform float uGridSide;
    uniform float uModelPointCount;

    // PULSE UNIFORMS (MULTI-WAVE)
    #define MAX_PULSE 8
    uniform vec3 uPulseCenters[MAX_PULSE];
    uniform float uPulseStartTimes[MAX_PULSE]; // -100.0 if inactive
    uniform int uActivePulseCount; // OPTIMIZATION: Limits the loop range
    
    uniform float uPulseDuration;
    uniform float uPulseSpeed;
    uniform float uPulseWidth;
    uniform float uPulseDisplacementFactors[MAX_PULSE]; // 1.0 = color wave only, 0.0 = full pulse
    
    varying vec3 vPulseSpectral; // Multi-channel intensity for Option A (Chromatic Aberration)
    varying float vWakeFactor;   // Trailing glow for Option C (Persistent Wake)

    // BONE PROXIMITY INTERACTION
    uniform vec2 uBonePos;       // Normalized Screen Space (0 to 1)
    uniform float uBoneRadius;   // Interaction radius
    uniform float uBoneIntensity; // Strength of the glow

    // COLOR SUPPORT
    // Color
    attribute vec3 aStartColor;
    attribute vec3 aTargetColor;
    varying vec3 vColor;
    
    // NORMALS
    attribute vec3 aStartNormal;
    attribute vec3 aTargetNormal;

    // CUSTOM SKINNING
    attribute vec4 aStartSkinWeight;
    attribute vec4 aTargetSkinWeight;
    // attribute vec4 skinIndex; // Handled by skinning_pars_vertex? No, we must declare if not included? 
    // skinning_pars_vertex usually declares it. But usually it expects uniform sampler for boneTexture.
    // We need to ensure skinIndex is available.
    // Wait, skinIndex is integer/uvec? No, in WebGL1/Basic three it's typically vec4.
    // We'll rely on #include <skinning_pars_vertex> to declare uniforms and helpers, 
    // but WE declared 'skinIndex' attribute in JS. We might need to declare it here if the chunk doesn't.
    // Standard chunks:
    // skinning_pars_vertex: declares 'uniform mat4 bindMatrix; uniform mat4 bindMatrixInverse; uniform highp sampler2D boneTexture; ...'
    // It DOES NOT declare attributes (usually done in standard VS).
    // attribute vec4 skinIndex; // Declaring explicitly (Managed by Three.js when skinning: true)
    // Note: skinWeight is unused/replaced by our custom ones.

    #include <common>
    #include <skinning_pars_vertex>

    varying float vComputedSize;
    varying float vIsGrid; 
    varying vec4 vClipPos; 
    
    mat3 rotateY(float theta) { return mat3(cos(theta),0,sin(theta), 0,1,0, -sin(theta),0,cos(theta)); }
    mat3 rotateX(float theta) { return mat3(1,0,0, 0,cos(theta),sin(theta), 0,-sin(theta),cos(theta)); }
    mat3 rotateZ(float theta) { return mat3(cos(theta),sin(theta),0, -sin(theta),cos(theta),0, 0,0,1); }
    float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }

    void main() {

        // UNPACK ATTRIBUTES
        float aStartSize = aStartSizeIsGrid.x;
        float aStartIsGrid = aStartSizeIsGrid.y;
        float aTargetSize = aTargetSizeIsGrid.x;
        float aTargetIsGrid = aTargetSizeIsGrid.y;

        float armatureInfluence = clamp(uIsArmatureState, 0.0, 1.0);

        // --- Staggered Animation Logic --- 
        // We remap global uProgress (0..1) to a per-particle localProgress (0..1)
        // based on uMorphStagger and aStableRandom.
        
        // Define the duration of the "flight" phase relative to the total animation
        // If uMorphStagger is 0.0, flight is 1.0 (Instant sync)
        float flightDuration = 0.5; // Each particle takes 50% of the total time to travel
        // We ensure totalTime = flightDuration + uMorphStagger <= 1.0? 
        // No, we map uProgress (0..1) to a larger timeline?
        // Let's assume uProgress goes 0->1.
        
        // Strategy:
        // Global Time (t) = uProgress * (flightDuration + uMorphStagger)
        // Particle Start Time = aStableRandom * uMorphStagger
        // Particle End Time = Start Time + flightDuration
        // localProgress = smoothstep(Start, End, t)
        
        // To ensure we finish EXACTLY at uProgress=1.0:
        // We normalize so that the LAST possible particle (delay=1.0) finishes at uProgress=1.0
        
        float totalDuration = flightDuration + uMorphStagger;
        float currentGlobalTime = uProgress * totalDuration;
        
        // --- STAGGER LOGIC ---
        // Option 1: Random Stagger (aStableRandom)
        // Option 2: Radial Stagger (Distance-based)
        // We use position (StartPos) to compute the radial delay
        float radialDelay = clamp(length(position.xy) / uDistStaggerMax, 0.0, 1.0);
        float mixedStagger = mix(aStableRandom, radialDelay, uDistStaggerFactor);
        
        float myDelay = mixedStagger * uMorphStagger;
        float myEnd = myDelay + flightDuration;
        
        float localProgress = smoothstep(myDelay, myEnd, currentGlobalTime);
        // ---------------------------------

        // Compute Full Rotation Matrix (Standard XYZ Order: Z * Y * X)
        mat3 modelRot = rotateZ(uModelRotation.z) * rotateY(uModelRotation.y) * rotateX(uModelRotation.x);
        
        // Use localProgress for mixing instead of uProgress
        vColor = mix(aStartColor, aTargetColor, localProgress); 
        vStableRandom = aStableRandom;
        // vColor is set twice in original code, fixed here
        vPointData = aPointData;
        vTextureIndex = floor(aStableRandom * 32.0);
        float clampedProgress = clamp(localProgress, 0.0, 1.0); // Redundant after smoothstep but safe

        vIsGrid = mix(aStartIsGrid, aTargetIsGrid, clampedProgress);
        vPosition = position; 
        
        float isStartModel = 1.0 - smoothstep(0.0, 0.1, aStartIsGrid);
        float isTargetModel = 1.0 - smoothstep(0.0, 0.1, aTargetIsGrid);

        vec3 alignedStartNormal = aStartNormal;
        if (isStartModel > 0.5) alignedStartNormal = modelRot * alignedStartNormal;
        vec3 alignedTargetNormal = aTargetNormal;
        if (isTargetModel > 0.5) alignedTargetNormal = modelRot * alignedTargetNormal;
        vec3 objectNormal = mix(alignedStartNormal, alignedTargetNormal, clampedProgress);
        if (length(objectNormal) > 0.001) objectNormal = normalize(objectNormal);
        vNormal = objectNormal;

        // Jitter (Vectorized Sine)
        vec3 jitterBase = sin(vec3(5.0, 5.5, 4.5) * iTime + aStableRandom * vec3(100.0, 123.0, 456.0));
        vec3 normalView = normalize(normalMatrix * objectNormal);
        vec3 lightDirView = normalize((viewMatrix * vec4(uLightDir, 0.0)).xyz);
        float lightFactor = max(0.0, dot(normalView, lightDirView));
        float sizeFromLight = 1.0 + lightFactor * uLightSizeBoost;
        float currentSizeAttribute = mix(aStartSize, aTargetSize, clampedProgress);
        float computedSize = (currentSizeAttribute * sizeFromLight + uSize * 25.0) * step(0.01, currentSizeAttribute);

        // Apply Model Point Size Factor
        float isModelForSize = 1.0 - smoothstep(0.0, 0.1, vIsGrid);
        computedSize *= mix(1.0, uModelPointSizeFactor, isModelForSize);
        
        // Appearance
        float appearDuration = 0.8;
        float maxDelay = 0.8;                 
        float appearDelay = aStableRandom * maxDelay;
        float appearScale = smoothstep(appearDelay, appearDelay + appearDuration, iTime);
        computedSize *= appearScale;
        vComputedSize = computedSize;

        // --- Big Dipper Scaling (Chaos State) ---
        float isDipperPoint = aPointData.y;
        float dipperScale = mix(1.0, 1.2, isDipperPoint * uIsChaos); 
        computedSize *= dipperScale;
        vComputedSize = computedSize;
        // vPointData.zw carries brightnessFactor + packed meta (aPointData is vec4)

        // --- Vib Boost Logic (Restored) ---
        // Smoothly amplify vibration for smaller points.
        float minBoost = 0.2; 
        float maxBoost = 8.0; 
        float tBoost = clamp((uVibrateBoostSizeThreshold - computedSize) / uVibrateBoostSizeThreshold, 0.0, 1.0);
        tBoost = smoothstep(0.0, 1.0, tBoost);
        float vibBoost = mix(minBoost, maxBoost, tBoost);

        // --- SKINNING LOGIC ---
        // Decouple influences to prevent snapping at the end of morphs.
        // Each pose (Start/Target) should be fully animated by its own armature weights.
        float startSkinInfluence = clamp(dot(aStartSkinWeight, vec4(1.0)), 0.0, 1.0);
        float targetSkinInfluence = clamp(dot(aTargetSkinWeight, vec4(1.0)), 0.0, 1.0);

        // Prepare Start Position
        vec3 alignedStartPos = position;
        
        if (isStartModel < 0.5) {
             vec3 shift = uGridForward * (uBaseGridZ - uGridZ);
             alignedStartPos += shift;
        }

        if (isStartModel > 0.5) {
            #ifdef USE_SKINNING
                if (startSkinInfluence > 0.01 && armatureInfluence > 0.01) {
                    mat4 boneMatX = getBoneMatrix( skinIndex.x );
                    mat4 boneMatY = getBoneMatrix( skinIndex.y );
                    mat4 boneMatZ = getBoneMatrix( skinIndex.z );
                    mat4 boneMatW = getBoneMatrix( skinIndex.w );
                
                    vec4 skinVertex = bindMatrix * vec4( alignedStartPos, 1.0 );
                    vec4 skinned = vec4( 0.0 );
                    // USES ONLY START WEIGHTS
                    skinned += boneMatX * skinVertex * aStartSkinWeight.x;
                    skinned += boneMatY * skinVertex * aStartSkinWeight.y;
                    skinned += boneMatZ * skinVertex * aStartSkinWeight.z;
                    skinned += boneMatW * skinVertex * aStartSkinWeight.w;
                    vec3 transformedStart = ( bindMatrixInverse * skinned ).xyz;
                    
                    alignedStartPos = mix(alignedStartPos, transformedStart, startSkinInfluence);
                }
            #endif
            
            // Apply Model Transform AFTER Skinning (Local -> World/Object)
            alignedStartPos *= uModelScale;
            alignedStartPos = modelRot * alignedStartPos;
            alignedStartPos += uModelPosition;
        }

        // Prepare Target Position
        vec3 alignedTargetPos = aTargetPos;
        
        // Offset Grid Points dynamically
        if (isTargetModel < 0.5) {
             vec3 shift = uGridForward * (uBaseGridZ - uGridZ);
             alignedTargetPos += shift;
        }

        if (isTargetModel > 0.5) {
            #ifdef USE_SKINNING
                if (targetSkinInfluence > 0.01 && armatureInfluence > 0.01) {
                    mat4 boneMatX = getBoneMatrix( skinIndex.x );
                    mat4 boneMatY = getBoneMatrix( skinIndex.y );
                    mat4 boneMatZ = getBoneMatrix( skinIndex.z );
                    mat4 boneMatW = getBoneMatrix( skinIndex.w );
                
                    vec4 skinVertex = bindMatrix * vec4( alignedTargetPos, 1.0 );
                    vec4 skinned = vec4( 0.0 );
                    // USES ONLY TARGET WEIGHTS
                    skinned += boneMatX * skinVertex * aTargetSkinWeight.x;
                    skinned += boneMatY * skinVertex * aTargetSkinWeight.y;
                    skinned += boneMatZ * skinVertex * aTargetSkinWeight.z;
                    skinned += boneMatW * skinVertex * aTargetSkinWeight.w;
                    vec3 transformedTarget = ( bindMatrixInverse * skinned ).xyz;

                    alignedTargetPos = mix(alignedTargetPos, transformedTarget, targetSkinInfluence);
                }
            #endif
            
            // Apply Model Transform AFTER Skinning (Local -> World/Object)
            alignedTargetPos *= uModelScale;
            alignedTargetPos = modelRot * alignedTargetPos;
            alignedTargetPos += uModelPosition;
        }

        vec3 morphedPos = mix(alignedStartPos, alignedTargetPos, clampedProgress);
        
        // Calculate distance to camera for damping (View Space)
        vec4 viewPosRaw = modelViewMatrix * vec4(morphedPos, 1.0);
        float distToCam = -viewPosRaw.z;
        
        // --- HOVER VIBRATION BOOST ---
        // Project stable position to screen space to check hover
        vec4 clipPosStable = projectionMatrix * viewPosRaw;
        
        // Apply Model Offset to the stable check position too!
        clipPosStable.xy += uModelScreenOffset * clipPosStable.w;
        
        vec2 ndcStable = clipPosStable.xy / clipPosStable.w;
        vec2 screenPosStable = (ndcStable * 0.5 + 0.5) * uResolution;
        float distStable = distance(screenPosStable, uMouseScreen);

        float hoverVibMult = 1.0;
        if (distStable < uHoverRadius) {
            // Smoothly double the factor at the center
            hoverVibMult = 2.0 + smoothstep(uHoverRadius, 0.0, distStable);
        }
        // -----------------------------

        // Distance Logic:
        float distScaler = smoothstep(10.0, 200.0, distToCam) * 4.5 + 2.75;

        // vIsGrid now stores the jitter factor for grid points
        float jitterMult = max(1.0, vIsGrid);
        
        // Apply Model Vibration Factor
        float isCurrentModel = 1.0 - smoothstep(0.0, 0.1, vIsGrid);
        
        // Apply hover boost effectively to the model component
        float effectiveModelVib = uModelVibFactor * hoverVibMult;
        float vibFactor = mix(1.0, effectiveModelVib, isCurrentModel);

        // --- Knowhere Specific Magnetic Tension (Option C) ---
        // Immediate subtle vibration when inside the Knowhere field
        float kDistVib = distance(screenPosStable, uKnowhereScreen);
        if (kDistVib < uKnowhereRadius) {
            float kFactorVib = smoothstep(uKnowhereRadius, 0.0, kDistVib);
            vibFactor += kFactorVib * uKnowhereVibrateBoost;
        }

        vec3 jitter = jitterBase * uVibrateAmp * vibFactor * vibBoost * distScaler * 0.4 * jitterMult;
        
        vec3 displaced = morphedPos + jitter;

        // --- MULTI-WAVE PULSE EFFECT ---
        vec3 accumulatedDisplacement = vec3(0.0);
        vec3 accumulatedPulseSpectral = vec3(0.0);
        float accumulatedWake = 0.0;

        vec3 randomDir = normalize(vec3(
            fract(sin(aStableRandom * 123.4) * 43758.5453) * 2.0 - 1.0,
            fract(sin(aStableRandom * 456.7) * 43758.5453) * 2.0 - 1.0,
            fract(sin(aStableRandom * 789.0) * 43758.5453) * 2.0 - 1.0
        ));
        float randomMag = fract(sin(aStableRandom * 999.0) * 43758.5453);

        // PULSE LOOP
        if (uActivePulseCount > 0) {
            for (int i = 0; i < MAX_PULSE; i++) {
                if (i >= uActivePulseCount) break;

                float startTime = uPulseStartTimes[i];
                if (startTime < 0.0) continue;

                float pulseAge = iTime - startTime;
                if (pulseAge > 0.0 && pulseAge < uPulseDuration) {
                     float tPulse = pulseAge / uPulseDuration;
                     float inv = 1.0 - tPulse;
                     float easedT = 1.0 - inv * inv;
                     float wavePos = easedT * (uPulseDuration * uPulseSpeed);
                     
                     float lifeFade = 1.0 - smoothstep(0.7, 1.0, tPulse);
                     vec3 center = uPulseCenters[i];
                     float distToPulse = distance(displaced, center);
                     
                     // Noise Edge (subtle)
                     float noise = sin(displaced.x * 10.0 + aStableRandom * 50.0) * cos(displaced.z * 10.0);
                     float noisyDist = distToPulse + noise * 0.3;

                     // OPTION A: SPECTRAL SHOCKWAVE (Chromatic Split)
                     // Target slightly different wave positions for R, G, B
                     float pR = 1.0 - smoothstep(0.0, uPulseWidth * 1.8, abs(noisyDist - (wavePos + 1.5)));
                     float pG = 1.0 - smoothstep(0.0, uPulseWidth * 1.8, abs(noisyDist - wavePos));
                     float pB = 1.0 - smoothstep(0.0, uPulseWidth * 1.8, abs(noisyDist - (wavePos - 1.5)));
                     
                     // Sharpen to 'Laser' fiber feel
                     pR = pow(pR, 7.0); 
                     pG = pow(pG, 7.0);
                     pB = pow(pB, 7.0);

                     accumulatedPulseSpectral.r = max(accumulatedPulseSpectral.r, pR * lifeFade);
                     accumulatedPulseSpectral.g = max(accumulatedPulseSpectral.g, pG * lifeFade);
                     accumulatedPulseSpectral.b = max(accumulatedPulseSpectral.b, pB * lifeFade);

                     // OPTION C: LUMINESCENT WAKE (Light persistent trail)
                     float wakeDist = wavePos - noisyDist;
                     if (wakeDist > 0.0 && wakeDist < 60.0) {
                         float w = 1.0 - smoothstep(0.0, 60.0, wakeDist);
                         w = pow(w, 2.5) * lifeFade * 0.15;
                         accumulatedWake = max(accumulatedWake, w);
                     }
                     
                     // Displacement (Pop)
                     float pMain = max(max(pR, pG), pB);
                     if (pMain > 0.01) {
                         vec3 dirFromPulse = normalize(displaced - center);
                          accumulatedDisplacement += dirFromPulse * pMain * 0.05 * randomMag * (1.0 - uPulseDisplacementFactors[i]);
                     }
                }
            }
        }
        
        displaced += accumulatedDisplacement;
        float pSizeMax = max(max(accumulatedPulseSpectral.r, accumulatedPulseSpectral.g), accumulatedPulseSpectral.b);
        computedSize *= (1.0 + max(pSizeMax, accumulatedWake) * 3.5 * randomMag);
        
        vPulseSpectral = accumulatedPulseSpectral;
        vWakeFactor = accumulatedWake;

        vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        // --- Model Offset (Screen Space) ---
        // --- Model Offset (Screen Space) ---
        // Apply offset to ALL points (Model + Grid) so the "Shadow" follows the Model
        gl_Position.xy += uModelScreenOffset * gl_Position.w;

        // --- Repulsion Effect (Screen Space) ---
        // We calculate the screen position of this vertex
        vec2 ndc = gl_Position.xy / gl_Position.w;
        vec2 screenPos = (ndc * 0.5 + 0.5) * uResolution;
        
        vec2 dir = screenPos - uMouseScreen;
        float dist = length(dir);
        
        // If inside the radius, push it away
        // But if the mouse is DIRECTLY over the vertex (very small dist), don't push it.
        // This allows the user to "hover" a specific point without it fleeing.
        float minInteractionDist = 5.0; 
        
        // --- Size Boosting (Smooth) ---
        // Enhanced focus scaling by 3x (Total 4.0x peak)
        // Fades off over the entire uHoverRadius
        float boostStart = 5.0;
        float boostEnd = uHoverRadius; // Use the global hover radius
        
        float boostFactor = 1.0;
        if (dist < boostEnd && uIsArmatureState < 0.5) {
             float t = smoothstep(boostEnd, boostStart, dist);
             // Use the uniform to control hover scaling (Original hardcoded peak was 4.0)
             boostFactor = 1.0 + t * (uHoverPointScaleFactor - 1.0); 
        }
        computedSize *= boostFactor;

        // --- SPECIFIC HOVER BOOST (Smooth Focal Peak) ---
        // Creates a smooth 2.0x 'inflation' for the point directly under the mouse.
        // We use a tight 15px radius so it feels like a sharp focus without snapping.
        float focusRadius = 15.0; 
        float focusT = smoothstep(focusRadius, 0.0, dist);
        computedSize *= (1.0 + focusT * 1.0); // Scale up to 2.0x total shift
        
        // --- Repulsion ---
        // Only repulse if we are outside the "lock" zone (minInteractionDist)
        // This ensures points we are trying to catch don't run away.
        // --- Attraction (Armature Only) ---
        if (uIsArmatureState > 0.5) {
             float attractRadius = uAttractionRadius; // Tunable radius
             float exclusionRadius = 30.0; // Don't pull if directly over the model
             if (dist < attractRadius && dist > exclusionRadius) {
                 // Strength: 0 at edge, 1 near center (but outside interaction dist)
                 float attStrength = smoothstep(attractRadius, exclusionRadius, dist);
                 
                 // Mass Effect: Smaller points = Stronger suction (Inverse Size)
                 // Squaring the factor to exaggerate the difference
                 // Small points get MUCH stronger, big points get weaker.
                 float rawMass = uAttractionRefSize / max(1.0, computedSize); // Uniform controlled ref size
                 float massFactor = pow(rawMass, 4.0);
                 
                 // Direction: Towards mouse (negative dir)
                 vec2 attractDir = -normalize(dir);
                 if (length(dir) < 0.001) attractDir = vec2(0.0);
                 
                 // Calculate potential displacement magnitude
                 float displacementMag = attStrength * uAttractionForce * massFactor;
                 
                 // Clamp to avoid overshooting (don't pull past the min interaction distance)
                 float maxDisplacement = max(0.0, dist - minInteractionDist);
                 displacementMag = min(displacementMag, maxDisplacement);

                 screenPos += attractDir * displacementMag;
             }
        }

        // --- Repulsion ---
        // Smooth Repulsion with Inner Fade
        // We want 0 repulsion at center (so we can click/catch), 
        // Max repulsion in the ring, 0 repulsion at outer edge.
        
        if (dist < uHoverRadius && uIsArmatureState < 0.5) {
            // Outer Falloff (0 at radius, 1 at center)
            float outerFactor = smoothstep(uHoverRadius, 0.0, dist);
            
            // Inner Falloff (0 at minInteractionDist, 1 at min + 20)
            // This prevents the "Snap" when crossing the minInteraction boundary
            float innerFactor = smoothstep(minInteractionDist, minInteractionDist + 20.0, dist);
            
            float strength = outerFactor * innerFactor; 
            strength = strength * strength; // Quadratic
            
            // Push direction
            vec2 pushDir = normalize(dir);
            if (length(dir) < 0.001) pushDir = vec2(1.0, 0.0);
            
            float maxPush = 25.0; 
            vec2 offset = pushDir * strength * maxPush;
            
            screenPos += offset;
        }

        // --- Knowhere Gravity ---
        if (abs(uKnowhereGravity) > 0.001) {
            vec2 kDir = screenPos - uKnowhereScreen;
            float kDist = length(kDir);
            
            if (kDist < uKnowhereRadius) {
                // EXCEPTION: Dipper points are immune during garden hover
                float effectStrength = 1.0 - (isDipperPoint * uIsGardenHovering);
                
                // Outer Falloff (0 at radius, 1 at center)
                float kFactor = smoothstep(uKnowhereRadius, 0.0, kDist);
                kFactor = kFactor * kFactor; // Quadratic
                
                // Force direction: Push away (dir) or Pull center (-dir)
                vec2 forceDir = normalize(kDir);
                if (kDist < 0.001) forceDir = vec2(1.0, 0.0);
                
                if (uKnowhereGravity < 0.0) {
                    // PULL LOGIC (Negative Gravity)
                    float pullMag = kFactor * abs(uKnowhereGravity);
                    
                    // No barrier: points pull towards the core but are capped to settle at the center
                    screenPos -= forceDir * min(pullMag, kDist) * effectStrength;
                } else {
                    // PUSH LOGIC (Positive Gravity)
                    screenPos += forceDir * kFactor * uKnowhereGravity * effectStrength;
                }
            }
        }

        // Converting screenPos back to clip space for output (Apply Attraction OR Repulsion)
        
        // --- TITLE MASKING REPULSION ---
        // Dynamically compute the current active box using the GSAP Scale
        float maskW = uTitleMaskRectBase.z * uTitleMaskScale;
        float maskH = uTitleMaskRectBase.w * uTitleMaskScale;
        
        float minXMask = uTitleMaskRectBase.x - maskW;
        float maxXMask = uTitleMaskRectBase.x + maskW;
        float minYMask = uTitleMaskRectBase.y - maskH;
        float maxYMask = uTitleMaskRectBase.y + maskH;

        float isMaskEdge = 0.0;
        if (screenPos.x > minXMask && screenPos.x < maxXMask &&
            screenPos.y > minYMask && screenPos.y < maxYMask && uIsArmatureState < 0.5 && vIsGrid > 0.5 && uTitleMaskScale > 0.01) {
                
            // Instead of pushing them to the edges (which creates a visible dense line),
            // we push them deep into the background (Z-axis) and shrink them.
            
            // Calculate how deep inside the box the point is (0.0 at edge, 1.0 at center)
            float depthX = min(screenPos.x - minXMask, maxXMask - screenPos.x) / maskW;
            float depthY = min(screenPos.y - minYMask, maxYMask - screenPos.y) / maskH;
            float edgeDist = min(depthX, depthY); 
            
            float holeDepth = smoothstep(0.0, 0.5, edgeDist) * uTitleMaskScale;
            
            // Push backward into the screen by modifying clip space Z
            gl_Position.z += holeDepth * gl_Position.w * 0.5;
            
            // Dramatically shrink the points inside the box so they vanish into the distance
            computedSize *= (1.0 - holeDepth * 0.95);
            
            // Add smooth wandering movement for points on the "crater rim"
            isMaskEdge = (1.0 - smoothstep(0.0, 0.15, edgeDist)) * uTitleMaskScale;
            vec2 wander = vec2(
                sin(iTime * 2.0 + aStableRandom * 100.0),
                cos(iTime * 2.5 + aStableRandom * 150.0)
            );
            screenPos += wander * isMaskEdge * uTitleMaskEdgeJitter * uResolution.y;
        }

        // --- HUD VOID REPULSION (Island & Nav) ---
        bool insideHudVoid = false;
        float hudVoidEdge = 0.0;
        float padSide = 45.0; 
        float padBottom = 13.5; // Reduced to 30% of original 45px
        float slantPush = 35.0; // Pushes the island right-edge boundary further right
        
        // 1. Island Masking (Trapezoid check + Asymmetric Padding)
        if (vIsGrid > 0.5 && screenPos.x >= (uMaskRect.x - padSide) && screenPos.x <= (uMaskRect.z + padSide) &&
            screenPos.y >= (uMaskRect.y - padBottom) && screenPos.y <= (uMaskRect.w + padSide)) {
            
            // Correction: Use same sign as original Fragment shader (< 0.0) with additional slant push
            if ((screenPos.x - uMaskSlant.x) - (screenPos.y - uMaskSlant.y) < slantPush) {
                insideHudVoid = true;
                // Dist calculation for jitter mapping
                float distToRight = abs((screenPos.x - uMaskSlant.x) - (screenPos.y - uMaskSlant.y + slantPush)) / 50.0;
                float distToOther = min(min(screenPos.x - uMaskRect.x, uMaskRect.z - screenPos.x), 
                                        min(screenPos.y - uMaskRect.y, uMaskRect.w - screenPos.y)) / 50.0;
                hudVoidEdge = 1.0 - smoothstep(0.0, 0.4, min(distToRight, distToOther));
            }
        }

        // 2. Navigator Masking (AABB check + Asymmetric Padding)
        if (!insideHudVoid && vIsGrid > 0.5 && screenPos.x >= (uMaskRectNav.x - padSide) && screenPos.x <= (uMaskRectNav.z + padSide) &&
            screenPos.y >= (uMaskRectNav.y - padBottom) && screenPos.y <= (uMaskRectNav.w + padSide)) {
            insideHudVoid = true;
            float distToEdge = min(min(screenPos.x - uMaskRectNav.x, uMaskRectNav.z - screenPos.x), 
                                   min(screenPos.y - uMaskRectNav.y, uMaskRectNav.w - screenPos.y)) / 50.0;
            hudVoidEdge = 1.0 - smoothstep(0.0, 0.4, distToEdge);
        }

        if (insideHudVoid) {
            // Push backward into the screen
            float hudPush = 0.4; 
            gl_Position.z += hudPush * gl_Position.w;
            
            // Shrink points significantly
            computedSize *= 0.05;
            
            // Unified Jitter for Consistency
            vec2 hudWander = vec2(
                sin(iTime * 4.0 + aStableRandom * 200.0),
                cos(iTime * 4.5 + aStableRandom * 250.0)
            );
            screenPos += hudWander * hudVoidEdge * uTitleMaskEdgeJitter * uResolution.y;

            // OPTION: Chromatic Aberration (Spectral Glitch)
            // Shift spectral channels for points in the 'Void' transition
            float glitchStrength = hudVoidEdge * 0.4;
            vPulseSpectral.r = max(vPulseSpectral.r, glitchStrength);
            vPulseSpectral.g = max(vPulseSpectral.g, glitchStrength * 0.5);
        }
        
        vec2 newNdc = (screenPos / uResolution - 0.5) * 2.0;
        gl_Position.xy = newNdc * gl_Position.w;

        // --- Dynamic Texture Animation (Hover Effect) ---
        // Reuse pre-calculated variables:
        // dist: distance from mouse in pixels
        // minInteractionDist: inner forbidden zone radius
        // rndTex: random seed for this particle

        // 1. Define the activity zone (Donut shape)
        // Active if inside Hover Radius AND outside the Inner "Lock" Radius
        float isInsideOuter = 1.0 - step(uHoverRadius, dist); 
        float isOutsideInner = step(minInteractionDist, dist);
        float isHover = isInsideOuter * isOutsideInner;

        // 2. Animate Texture Index if in Zone
        // Speed: 8.0 near core (Buzz), 0.0 at edge
        float speedNorm = 1.0 - smoothstep(minInteractionDist, uHoverRadius, dist);
        float baseSpeed = 8.0 * speedNorm; 

        // 3. Buzz/Rest Cycle (Intermittent)
        // Cycle length: 3.5s. Active Window: 0.5s.
        // Effect: Particles "sleep" for 3.0s, then "spasm" for 0.5s.
        // cycle
        // Determine Cycle Speed
        // Chaos/Model: 6.0s. Grid (Other State): 10.0s.
        float isGrid = step(0.5, vIsGrid);
        float isOtherState = 1.0 - uIsChaos;
        float cycleLen = mix(6.0, 10.0, isGrid * isOtherState);
        float buzzDuration = 0.75;

        // Cycle logic
        float totalTime = iTime + aStableRandom * 10.0;
        float cycle = mod(totalTime, cycleLen);
        float isBuzzPhase = step(cycleLen - buzzDuration, cycle); 

        float isActive = isHover * isBuzzPhase;
        
        // Count cycles to shift base texture
        float cycleCount = floor(totalTime / cycleLen);
        float baseOffset = cycleCount * 13.0; // Prime number jump

        // Flicker logic (10 swaps per 0.75s = 13.33 Hz)
        float flickSpeed = 13.33;
        float steppedTime = floor((iTime * flickSpeed) + aStableRandom) * isActive;
        
        // If not hovering (isHover=0), steppedTime is 0, so index stays static (aStableRandom*32 + baseOffset)
        // If hovering, it cycles: (Static + Time) % 32
        vTextureIndex = floor(mod((aStableRandom * 32.0) + steppedTime + baseOffset, 32.0));

        // --- GLOBAL "BUZZ SWAP" LOGIC (Hover Effect) ---
        // If uGlobalHoverStrength > 0.0, model points buzz-swap to the uHoveredTextureIndex.
        // ENHANCEMENT: Include Dipper points (vPointData.y) in the swap target
        float isModelForSwap = (1.0 - smoothstep(0.0, 0.1, vIsGrid)) + vPointData.y;
        if (isModelForSwap > 0.5 && uGlobalHoverStrength > 0.01) {
             // Noise to determine if we show the hovered texture or the original
             // We use time to make it "buzz"
             float swapNoise = fract(sin(iTime * 20.0 + aStableRandom * 123.4) * 43758.5453);
             
             // Transition: As strength goes 0->1, probability of showing target goes 0->1
             if (swapNoise < uGlobalHoverStrength) {
                 vTextureIndex = uHoveredTextureIndex;
             }
        }

        vClipPos = gl_Position;

        // --- X-Axis Attenuation (Armature State) ---
        // Smoothly fade in/out the attenuation based on uIsArmatureState
        // armatureInfluence declared at top
        float xVal = morphedPos.x;
        // Normalize X for the target attenuation (mix of 0.1 to 1.0)
        float tDepth = smoothstep(-35.0, 10.0, xVal); 
        float targetDepthFactor = mix(0.1, 1.0, tDepth);
        
        // Final depth factor is mixed between 1.0 (No Attenuation) and Target (Attenuation)
        float depthFactor = mix(1.0, targetDepthFactor, armatureInfluence);



        // --- PERFORMANCE: Aggressive Frustum/Distance Culling ---
        // Discard points that are completely outside the view to save overdraw/fill-rate.
        
        // 1. Z-Culling (Distance)
        // Camera far is 300, so we cull anything past -1000 (View Space)
        if (mvPosition.z < -1000.0) {
            gl_PointSize = 0.0;
            return;
        }

        // 2. Fragment Culling (NDC)
        // Discard points that are far off-screen. We use 1.5 to prevent harsh edge popping.
        vec2 cullingNDC = gl_Position.xy / gl_Position.w;
        if (abs(cullingNDC.x) > 1.5 || abs(cullingNDC.y) > 1.5) {
            gl_PointSize = 0.0;
            return;
        }

        // --- PERSPECTIVE-CORRECT WORLD-UNIT SIZING ---
        // Formula: pixels = worldSize * (viewportHeight / (2.0 * tan(fov / 2.0) * depth))
        // This ensures points maintain their relative gap on any screen resolution.
        // USE THE PRE-CALCULATED UNIFORM uProjectionMultiplier
        gl_PointSize = min(128.0, (computedSize * uProjectionMultiplier / -mvPosition.z) * depthFactor * uPixelRatio);
    }
`,Kc=`
    precision highp float;
    varying vec3 vNormal;
    varying float vComputedSize;
    varying vec3 vPosition;
    varying float vStableRandom; // Received from vertex
    varying vec4 vPointData; // x=index, y=isDipper, z=brightness, w=packed(texSlot|colorFlag)
    varying vec3 vColor;
    
    uniform float uGridSide;
    uniform float uModelPointCount;
    // uBigDipperTex removed — dipper detection now uses vPointData.y + vDipperMeta attributes
    uniform float uDipperBrightnessScalar; // Scaler for constellation intensity
    uniform vec3 uDipperColor;
    uniform vec3 uColor;
    uniform sampler2D uStarTexture;
    uniform float iTime;
    uniform float uBaseRotateSpeed; // Base speed controlled from JS
    uniform vec3 uMousePos;
    uniform float uHoverRadius;
    uniform vec2 uResolution;
    uniform vec2 uMouseNDC;
    varying vec4 vClipPos;
    varying float vIsGrid; // Identify if point is grid or model
    
    // Atlas uniforms
    varying float vTextureIndex;
    uniform float uCols;
    uniform float uRows;
    
    varying vec3 vPulseSpectral; // Received from Vertex
    varying float vWakeFactor;   // Received from Vertex
    uniform vec2 uSpritePixels; 
    // NEW UNIFORM DEFINITIONS
    uniform vec3 uLightDir; 
    uniform float uLightStrength;
    uniform float uSizeThreshold;
    uniform float uIsChaos;
    uniform float uIsArmatureState;
    uniform vec4 uMaskRect; // x,y (min), z,w (max)
    uniform vec4 uMaskRectNav; // x,y (min), z,w (max)
    uniform vec2 uMaskSlant; // x=OriginX, y=OriginY
    uniform vec3 uRippleColor; 
    
    // BONE PROXIMITY INTERACTION
    uniform vec2 uBonePos;
    uniform float uBoneRadius;
    uniform float uBoneIntensity;
    
    void main() {
        // --- MASKING LOGIC (REPLACED BY VERTEX VOID) ---
        // Island and Nav buttons are now handled in the Vertex Shader 
        // using Z-push and scaling for better performance and 3D depth.
        
        // hide entire point if its computed size (from vertex) is below threshold
        if (vComputedSize < uSizeThreshold) { gl_FragColor = vec4(0.0); return; }

        // --- Big Dipper Detection (Attribute-based, slot-independent) ---
        // vPointData.y is baked as 1.0 for dipper stars at their reserved tail slots.
        // vDipperMeta carries per-star data: .x=brightnessFactor, .y=packed(slot|colorFlag)
        float dipperAmt = 0.0;
        float dipperBrightnessMult = 1.0;
        float dipperTexOverride = 0.0;
        float dipperUseColor = 0.0;

        float isGridFactor = smoothstep(0.0, 0.5, vIsGrid);
        if (vPointData.y > 0.5 && isGridFactor > 0.01) {
            dipperAmt = isGridFactor;
            dipperBrightnessMult = vPointData.z;              // brightnessFactor (.z)
            float packed = vPointData.w;                      // packed texSlot*2 + colorFlag (.w)
            dipperUseColor = mod(packed, 2.0);
            dipperTexOverride = floor(packed / 2.0);
        }
        
        // --- Texture Rotation ---
         // Use vertex index to create a pseudo-random rotation speed which is STABLE across morphs
        float speed = 0.5 + fract(sin(vStableRandom * 123.456) * 43758.5453) * 1.5;
        
        // Convert Clip Space to Screen Space (pixels)
        vec2 ndc = vClipPos.xy / vClipPos.w;
        vec2 screenPos = (ndc * 0.5 + 0.5) * uResolution;
        vec2 mouseScreen = (uMouseNDC * 0.5 + 0.5) * uResolution;
        
        float dist = distance(screenPos, mouseScreen);
        float boostStrength = (1.0 - smoothstep(0.0, 1.0, uIsArmatureState)); 
        float speedMultiplier = 1.0 + smoothstep(uHoverRadius, 0.0, dist) * 1.2 * boostStrength;
        
        float angle = iTime * speed * uBaseRotateSpeed * speedMultiplier;
        
        // Create a 2D rotation matrix
        mat2 rotationMatrix = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
        
        vec2 uv = gl_PointCoord;
        uv.y = 1.0 - uv.y; // Flip Y to match texture coordinates

        // Rotate texture coordinates around the center (0.5, 0.5)
        vec2 centeredCoords = uv - 0.5;
        vec2 rotatedCoords = rotationMatrix * centeredCoords + 0.5;
        
        // Inset rotated coordinates slightly to avoid neighbor bleeding
        vec2 tilePadding = 1.0 / uSpritePixels;
        vec2 safeCoords = rotatedCoords * (1.0 - tilePadding * 2.0) + tilePadding;
        
        // --- Atlas Mapping ---
        float activeTextureIndex = mix(vTextureIndex, dipperTexOverride, dipperAmt);

        float colIndex = mod(activeTextureIndex, uCols);
        float rowIndex = floor(activeTextureIndex / uCols);
        
        float uOffset = colIndex / uCols;
        float vOffset = rowIndex / uRows;
        
        vec2 atlasUV = vec2(safeCoords.x, 1.0 - safeCoords.y) / vec2(uCols, uRows) + vec2(uOffset, vOffset);
        
        // Sample the star texture using atlas coordinates
        vec4 texColor = texture2D(uStarTexture, atlasUV);
        
        // --- SDF Sharpening ---
        float sdfDist = texColor.a - 0.5;
        float smoothing = fwidth(sdfDist);
        float alpha = smoothstep(-smoothing, smoothing, sdfDist);

        // --- Square Box Cleanup ---
        // Force anything outside the inner 5% of the sprite tile to fade out
        float edgeMask = smoothstep(0.0, 0.05, rotatedCoords.x) * 
                         smoothstep(1.0, 0.95, rotatedCoords.x) * 
                         smoothstep(0.0, 0.05, rotatedCoords.y) * 
                         smoothstep(1.0, 0.95, rotatedCoords.y);
        alpha *= edgeMask;

        if (alpha <= 0.0) discard;
        
        // We normalize the light direction to ensure consistent dot product
        vec3 lightDirection = normalize(uLightDir);
        
        // Dot Product calculation scaled by uLightStrength. Keep a small
        // ambient floor so points never go completely black.
        float lightIntensity = max(0.05, dot(vNormal, lightDirection) * uLightStrength);

        // --- Twinkle Effect (Chaos State Only) ---
        // Randomized speed and phase for each star
        float twinkleSpeed = 1.0 + fract(vStableRandom * 123.45) * 5.0; 
        float twinkleVal = 0.5 + 0.5 * sin(iTime * twinkleSpeed + vStableRandom * 100.0);
        // Make it sharper (blink)
        twinkleVal = pow(twinkleVal, 2.0); 
        // Range: 0.2 to 1.5 (boost brightness a bit when twinkling)
        float twinkleFactor = 0.2 + 1.3 * twinkleVal;
        
        // Blend based on uIsChaos
        if (uIsChaos > 0.01) {
            lightIntensity *= mix(1.0, twinkleFactor, uIsChaos);
        }

        // --- Dynamic Brightness Adjustment ---
        // Reduce brightness on the left (Light BG) to maintain contrast (Dark points on Light BG)
        // Increase brightness on the right (Dark BG)
        float scrX = gl_FragCoord.x / uResolution.x;
        float isModelBase = 1.0 - smoothstep(0.0, 0.1, vIsGrid);
        
        // Keep points dark (0.1) for the first 50% of screen to avoid blending with the "gray line" area
        float gridBrightness = mix(0.1, 2.5, smoothstep(0.6, 1.0, scrX));
        
        float brightness = mix(gridBrightness, 1.0, isModelBase);
        
        // USE vColor HERE instad of uColor
        // Add vColor influence directly to prevent washout
        vec3 finalColor = vColor * lightIntensity * brightness;
         // Add 20% base color emission to ensure tint remains visible
        
        // --- Big Dipper Coloring (Smoothly Blended) ---
        if (dipperAmt > 0.01) {
             // 0.1x Reduction of previous values as requested + much tenderer/slower blinking
             // We use a slower frequency and remove the power curve for a smooth "breathing" feel
             float blinkFreq = 1.8; 
             float blink = 0.5 + 0.5 * sin(iTime * blinkFreq + vStableRandom * 50.0);
             float pulse = 0.14 + 0.28 * blink; // Range: 0.14 to 0.42 (Maintained at 0.1x brightness)
             
             // Base tint from configuration
             vec3 baseTint = mix(vec3(1.0), uDipperColor, dipperUseColor);
             
             // --- Hot Core Glow (Electric Cyan) ---
             // Shift core to a high-energy cyan/white
             float distToCenter = length(rotatedCoords - 0.5);
             float coreAlpha = pow(clamp(1.0 - distToCenter * 2.0, 0.0, 1.0), 3.0);
             vec3 coreColor = mix(baseTint, vec3(0.5, 1.0, 1.0), 0.8); // Electric Cyan core
             vec3 glowingColor = mix(baseTint, coreColor, coreAlpha * 0.7); // Stronger core presence for energy phase
             
             vec3 dColor = glowingColor * pulse * dipperBrightnessMult * uDipperBrightnessScalar; 
             finalColor = mix(finalColor, dColor, dipperAmt); 
        }
        
        // Add color change on hover
        // Reduce brightness for model points (vIsGrid < 0.001)
        // Grid points can have vIsGrid = 0.25 to 1.0
        float isModel = 1.0 - step(0.0, vIsGrid);
        
        // --- Dynamic Grid Hover Color (Contrast with Background) ---
        // Calculate normalized screen X position (0.0 to 1.0)
        float screenX = gl_FragCoord.x / uResolution.x;
        
        // Approximate the CSS background gradient brightness
        float bgLum = mix(1., 0.0, screenX);
        
        // Calculate contrast color:
        float contrastMix = smoothstep(0.0, 0.6, bgLum); 
        vec3 gridHoverColor = mix(vec3(20.), vec3(0.0), contrastMix);
        
        vec3 modelHoverColor = vec3(2.5);   // Lower brightness for model
        
        vec3 hoverColor = mix(gridHoverColor, modelHoverColor, isModel) * 2.0;
        
        // If it is a Dipper point, the hover color should just be a brighter version of itself
        if (dipperAmt > 0.01) {
            hoverColor = finalColor * 3.0; // Even brighter on hover
        }

        float boostStrengthColor = (1.0 - smoothstep(0.0, 1.0, uIsArmatureState));
        float colorMix = smoothstep(uHoverRadius, 0.0, dist) * boostStrengthColor;
        
        // Apply hover mix
        finalColor = mix(finalColor, hoverColor * lightIntensity, colorMix);
        
        // --- SHOCKWAVE EFFECTS (Option A & C) ---
        // Brand Colors: Crimson (R), Gold (G), Persona-Based (B)
        vec3 crimson = vec3(1.0, 0.1, 0.3) * 12.0;
        vec3 gold    = vec3(1.0, 0.8, 0.1) * 10.0;
        vec3 ripple  = uRippleColor * 18.0; // High frequency illuminate

        // Mix with Spectral Channels (Prism effect)
        vec3 spectralTint = mix(vec3(0.0), crimson, vPulseSpectral.r);
        spectralTint = mix(spectralTint, gold, vPulseSpectral.g);
        
        // Add a "Hot Core" to the Ripple (B) channel for extra brilliance
        vec3 hotRipple = mix(ripple, vec3(1.0, 1.0, 1.0) * 22.0, pow(vPulseSpectral.b, 2.0));
        spectralTint = mix(spectralTint, hotRipple, vPulseSpectral.b);

        float pIntense = max(max(vPulseSpectral.r, vPulseSpectral.g), vPulseSpectral.b);
        finalColor = mix(finalColor, spectralTint, pIntense * 0.9);

        // Option C: Luminescent Wake (Persistence trail in Ripple Color)
        finalColor += uRippleColor * vWakeFactor * 4.5; 

        gl_FragColor = vec4(finalColor, alpha);
    }
`,qc=`
    varying vec2 vUv;
    varying float vStagger;
    
    attribute float aStagger;
 
    void main() {
        vUv = uv;
        vStagger = aStagger;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`,Jc=`
    varying vec2 vUv;
    varying float vStagger;
    uniform float uTime;
    uniform float uOpacity;
    uniform float uDrawProgress;
    
    void main() {
        // vUv.x is across width (0 to 1)
        // vUv.y is along length (0 to 1)
        
        // --- STRICT SEQUENTIAL DRAW PROGRESS ---
        // Remap global 0..1 progress to local 0..1 for this specific segment
        // window = 1.0 / count (7 segments)
        float window = 1.0 / 7.0; 
        float localProgress = clamp((uDrawProgress - vStagger) / window, 0.0, 1.0);
        
        if (vUv.y > localProgress) discard;
 
        // --- SOFT EDGE (SDF LINE) ---
        float edge = smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x);
        
        // --- LEADING EDGE GLOW ---
        // Add a bright point at the very tip of the tracing line
        float tip = 1.0 - smoothstep(localProgress - 0.1, localProgress, vUv.y);
        tip = pow(tip, 8.0); // Sharpen
        
        // --- NEON PULSE ---
        float pulsePos = mod(uTime * 1.5, 2.0) - 0.5;
        float pulseWidth = 0.3;
        float pulse = smoothstep(pulsePos - pulseWidth, pulsePos, vUv.y) * 
                      smoothstep(pulsePos + pulseWidth, pulsePos, vUv.y);
        
        // Cyan color base
        vec3 color = vec3(0.0, 1.0, 1.0);
        
        // Hot core in the middle of width
        float core = pow(1.0 - abs(vUv.x - 0.5) * 2.0, 4.0);
        color = mix(color, vec3(0.6, 1.0, 1.0), core);
        
        // Add pulse & tip brightness
        color += vec3(0.4, 0.8, 1.0) * pulse * 2.0;
        color += vec3(0.8, 1.0, 1.0) * tip * 4.0 * uOpacity; // Bright spark at the head
        
        // Alpha calculation
        float alpha = edge * uOpacity;
        
        // Subtle glow at the edges of the pulse
        alpha *= (1.0 + pulse * 0.5);
        
        gl_FragColor = vec4(color, alpha);
    }
`}));function Xc(e,t,n=`dev`){let r=n===`poba`;return isNaN(e)||isNaN(t)||e===`KNOWHERE`?Zc.KNOWHERE[n]||Zc.KNOWHERE.dev:Zc[`${e}_${t}`]||{row:NaN,col:NaN,name:`MAP_BOUNDARY`,icon:`UNKNOWN`,description:r?`Market research frontier. This requirement is currently undefined and awaiting business alignment.`:`Logic ends here. Beyond this point lies the next evolution of my stack. Error 404: Knowledge still in transit.`,meta:r?{loc:`Future Market`,grid:`Unscheduled`}:{loc:`0xVOID`,grid:`volatile`}}}var Zc,Qc=M((()=>{Zc={"0_0":{icon:`Visual Studio Code`,name:`Dev Ecosystem`,description:`I am comfortable in VS Code. I can navigate the project structure and run the environment to check progress myself.`},"0_1":{icon:`Curly braces`,name:`Logic Integrity`,description:`I check the logic. I use Gherkin-style Acceptance Criteria to ensure the business rules are bulletproof before the team commits to code.`},"0_2":{icon:`HTML tags`,name:`Frontend Standards`,description:`I know good structure. I check that the frontend follows basic semantic standards to ensure maintainability.`},"0_3":{icon:`Figma`,name:`UX Integrity`,description:`I audit designs. I check Figma files to ensure the UI elements are consistent and technically feasible to build.`},"0_4":{icon:`PowerPoint`,name:`Strategic Vision`,description:`I communicate clearly. I build effective presentations that translate technical progress into business updates for stakeholders.`},"0_5":{icon:`Excel`,name:`Data-Driven UX`,description:`I verify with data. I use Excel to organize and analyze user metrics, helping the team focus on what matters.`},"0_6":{icon:`Coffee cup`,name:`Deep Focus`,description:`I run on caffeine and code. It’s the fuel that helps me solve the impossible bugs that are blocking your roadmap.`},"0_7":{icon:`Slack`,name:`Cross-Func Bridge`,description:`I connect the dots. I use Slack to facilitate clear communication between designers and developers, preventing misunderstandings.`},"1_0":{icon:`Git branch`,name:`Release Stability`,description:`I understand the workflow. I follow the Git branching model to track which features are ready for the next release.`},"1_1":{icon:`GitHub`,name:`Code Governance`,description:`I keep things organized. I check GitHub to ensure tasks are linked to PRs and documentation is being updated.`},"1_2":{icon:`Jira`,name:`Project Management`,description:`I manage the flow. I use Jira and Confluence to keep tickets updated and remove blockers for the team.`},"1_3":{icon:`Flowchart`,name:`System Flow`,description:`I visualize the path. I create flowcharts to clarify how data should move through the system, ensuring everyone aligns.`},"1_4":{icon:`GitHub Copilot`,name:`AI Efficiency`,description:`I code smarter. I use GitHub Copilot to help me write boilerplate code and scripts faster, speeding up my own utility tasks.`},"1_5":{icon:`Ethereum`,name:`DePIN & Web3`,description:`I bridge physical and digital. I understand decentralized energy networks and Web3 onboarding flows to define better user journeys.`},"1_6":{icon:`Analytics graph`,name:`Strategy & Prioritization`,description:`I track the value. I use RICE and MoSCoW scoring to prioritize features that deliver the highest ROI and user impact.`},"1_7":{icon:`Bitcoin`,name:`Blockchain`,description:`I understand the concept. I know when to apply Blockchain for trust and security, and when a standard database is better.`},"2_0":{icon:`MySQL database`,name:`Data Accuracy`,description:`I can check the data. I run basic SQL queries to verify that the numbers on the dashboard match the database.`},"2_1":{icon:`Notion`,name:`Tech Specs`,description:`I document requirements. I write clear specifications in Notion so developers know exactly what to build.`},"2_2":{icon:`Tech stack`,name:`Hybrid Capabilities`,description:`I bridge the gap. My ability to code and design allows me to step in and help wherever the team has a bottleneck.`},"2_3":{icon:`n8n`,name:`Productivity Automation`,description:`I eliminate manual drag. I deploy automated workflows using n8n and AI, reducing project overhead by up to 40%.`},"2_4":{icon:`Agile loop`,name:`Iterative Design`,description:`I iterate quickly. I lead sprints where we test and refine UI concepts before committing to heavy development.`},"2_5":{icon:`Python`,name:`Data Scripting`,description:`I am capable with Python. I write scripts to process data or generate mock content, unblocking designers early on.`},"2_6":{icon:`API window`,name:`API Contracts`,description:`I understand APIs. I can read API documentation to ensure the frontend has the data fields it needs.`},"2_7":{icon:`Google Antigravity`,name:`AI-Enhanced Workflow`,description:`I work faster with AI. I integrate LLM tools into my daily process to rapid-prototype ideas, generate content, and solve coding blockers instantly.`},"3_0":{icon:`OpenAI`,name:`AI-Enhanced UX`,description:`I work faster with AI. I integrate LLM tools into my daily process to rapid-prototype ideas, generate content, and solve coding blockers instantly.`},"3_1":{icon:`Digital Twin`,name:`IoT Eco-systems`,description:`I connect the dots in IoT. I design intuitive visual flows for complex grid, battery, and inverter diagnostics.`},"3_2":{icon:`Google Gemini`,name:`AI-Enhanced Workflow`,description:`I work faster with AI. I integrate LLM tools into my daily process to rapid-prototype ideas, generate content, and solve coding blockers instantly.`},"3_3":{icon:`Blender`,name:`Asset Strategy`,description:`I know 3D assets. I can open Blender to check model topology and export settings for better web performance.`},"3_4":{icon:`Backend script`,name:`Backend Logic`,description:`I understand the backend. I know enough about server logic to discuss feasibility and constraints with engineers.`},"3_5":{icon:`JavaScript`,name:`JS Proficiency`,description:`I write capable JavaScript. I can read the codebase and implement logic features without needing hand-holding.`},"3_6":{icon:`WebGL / GLSL`,name:`Technical De-risking`,description:`I validate through code. I use GLSL/Shaders and WebGL prototyping to ensure architectural feasibility for complex 3D environments.`},"3_7":{icon:`Translation`,name:`Global Design`,description:`I design for everyone. My multilingual background helps me spot translation and layout issues in the UI.`},KNOWHERE:{poba:{icon:`STATUS: Discovery Backlog`,name:`KNOWHERE`,description:`A reserved product space for capabilities still under exploration. Ideas are validated here before entering the roadmap.`,meta:{loc:`Opportunity Space`,grid:`Pending Prioritization`}},dev:{icon:`STATUS: Procedurally Generating`,name:`KNOWHERE`,description:`A reserved namespace for capabilities still compiling. Architecture defined. Implementation ongoing.`,meta:{loc:`/dev/self`,grid:`runtime`}}}}})),$c,el=M((()=>{Qc(),kt(),Ns(),$c=class{constructor(e){this.tooltip=document.createElement(`div`),this.tooltip.style.position=`absolute`,this.tooltip.style.padding=`12px 16px`,this.tooltip.style.background=`rgba(0, 0, 0, 0.95)`,this.tooltip.style.color=`#fff`,this.tooltip.style.borderRadius=`4px`,this.tooltip.style.fontFamily=`'Rajdhani', sans-serif`,this.tooltip.style.fontSize=`13px`,this.tooltip.style.lineHeight=`1.4`,this.tooltip.style.pointerEvents=`auto`,this.tooltip.addEventListener(`click`,()=>this.hide()),this.tooltip.style.display=`none`,this.tooltip.style.zIndex=`100000`,this.tooltip.style.border=`1px solid rgba(0, 255, 255, 0.3)`,this.tooltip.style.whiteSpace=`normal`,this.tooltip.style.maxWidth=`260px`,this.tooltip.style.backdropFilter=`blur(4px)`,this.tooltip.style.boxShadow=`0 4px 12px rgba(0,0,0,0.5)`,this.tooltip.style.transition=`opacity 0.2s, transform 0.2s`,document.body.appendChild(this.tooltip),this.lastHoveredIndex=-1,this.lastTooltipRefString=null,this.iconSize=32,this.rotX=0,this.rotY=0,this.isAnimating=!1,this._animateIcon=this._animateIcon.bind(this)}_createCubeDOM(){let e=document.createElement(`div`);e.style.width=this.iconSize+`px`,e.style.height=this.iconSize+`px`,e.style.position=`relative`,e.style.perspective=`800px`;let t=document.createElement(`div`);t.style.width=`100%`,t.style.height=`100%`,t.style.position=`absolute`,t.style.transformStyle=`preserve-3d`,this.cubeDOM=t;let n=[`front`,`back`,`right`,`left`,`top`,`bottom`],r={front:`rotateY(0deg) translateZ(${this.iconSize/2}px)`,back:`rotateY(180deg) translateZ(${this.iconSize/2}px)`,right:`rotateY(90deg) translateZ(${this.iconSize/2}px)`,left:`rotateY(-90deg) translateZ(${this.iconSize/2}px)`,top:`rotateX(90deg) translateZ(${this.iconSize/2}px)`,bottom:`rotateX(-90deg) translateZ(${this.iconSize/2}px)`};return this.faceElements=[],n.forEach(e=>{let n=document.createElement(`div`);n.style.position=`absolute`,n.style.width=this.iconSize+`px`,n.style.height=this.iconSize+`px`,n.style.backfaceVisibility=`hidden`,V.spriteSheetIcon&&(n.style.backgroundImage=`url('${V.spriteSheetIcon.image.src}')`,n.style.backgroundSize=`800% 400%`,n.style.imageRendering=`pixelated`),n.style.transform=r[e],t.appendChild(n),this.faceElements.push(n)}),e.appendChild(t),e}_animateIcon(){if(!this.tooltip.style.display||this.tooltip.style.display===`none`){this.isAnimating=!1;return}requestAnimationFrame(this._animateIcon),this.rotX+=.02,this.rotY+=.03;let e=this.rotX*(180/Math.PI),t=this.rotY*(180/Math.PI);this.cubeDOM&&(this.cubeDOM.style.transform=`rotateX(${e}deg) rotateY(${t}deg)`)}_getPointInfo(t,n,r,i,a){if(!t.geometry.attributes.aStableRandom)return null;let o=t.geometry.attributes.aStableRandom.array[r],s=n.uniforms.iTime.value,c=n.uniforms.uProgress.value,l=n.uniforms.uIsChaos.value,u=0;t.geometry.attributes.aStartSizeIsGrid&&(u=t.geometry.attributes.aStartSizeIsGrid.array[r*2+1]);let d=0;t.geometry.attributes.aTargetSizeIsGrid&&(d=t.geometry.attributes.aTargetSizeIsGrid.array[r*2+1]);let f=u*(1-c)+d*c>.5?1:0,p=t.geometry.attributes.position,m=new e.Vector3;m.fromBufferAttribute(p,r);let h=1-f;if(h<.5){let t=n.uniforms.uGridForward?n.uniforms.uGridForward.value:new e.Vector3(0,0,1),r=n.uniforms.uBaseGridZ?n.uniforms.uBaseGridZ.value:0,i=n.uniforms.uGridZ?n.uniforms.uGridZ.value:0,a=t.clone().multiplyScalar(r-i);m.add(a)}if(h>.5){let t=n.uniforms.uModelScale?n.uniforms.uModelScale.value:1,r=n.uniforms.uModelPosition?n.uniforms.uModelPosition.value:new e.Vector3(0,0,0),i=n.uniforms.uModelRotation?n.uniforms.uModelRotation.value:new e.Vector3(0,0,0);m.multiplyScalar(t);let a=new e.Euler(i.x,i.y,i.z,`XYZ`);m.applyEuler(a),m.add(r)}let g=new e.Vector4(m.x,m.y,m.z,1);g.applyMatrix4(t.matrixWorld);let _=new e.Vector3(g.x,g.y,g.z);g.applyMatrix4(i.matrixWorldInverse),g.applyMatrix4(i.projectionMatrix);let v=n.uniforms.uModelScreenOffset?n.uniforms.uModelScreenOffset.value:new e.Vector2(0,0);g.x+=v.x*g.w,g.y+=v.y*g.w;let y=new e.Vector2(g.x/g.w,g.y/g.w),b=(y.x*.5+.5)*window.innerWidth,x=(y.y*.5+.5)*window.innerHeight,S=window.innerHeight-a.y,C=b-a.x,w=x-S,T=Math.sqrt(C*C+w*w),E=f*(1-l)>.5?10:6,D=s+o*10,O=Math.floor(D/E)*13,k=D%E>E-.75?1:0,A=(T<(n.uniforms.uHoverRadius?n.uniforms.uHoverRadius.value:200)?1:0)*(T>5?1:0)*k,ee=Math.floor(s*13.33+o)*A,te=o*32+ee+O,j=Math.floor(te)%32,M=j%8,ne=Math.floor(j/8),N=Xc(ne,M,Q?Q.currentMode:`dev`),re=0,ie=0,ae=n.uniforms.uModelPointCount?n.uniforms.uModelPointCount.value:0;if(r>=ae){let e=t.geometry.attributes.position.count,n=Math.max(0,e-ae),i=Math.ceil(Math.sqrt(n))||1,a=r-ae;re=a%i,ie=Math.floor(a/i)}else t.geometry.attributes.aSpatialGridIndex&&(re=t.geometry.attributes.aSpatialGridIndex.array[r*2+0],ie=t.geometry.attributes.aSpatialGridIndex.array[r*2+1]);if(r===999999){let t=Xc(`KNOWHERE`,null,Q?Q.currentMode:`dev`);return{idx:r,texIndex:0,col:NaN,row:NaN,rnd:0,icon:t.icon,name:t.name,description:t.description,meta:t.meta,worldPos:new e.Vector3(NaN,NaN,NaN),spatialCol:NaN,spatialRow:NaN,isGrid:!0}}let oe=!1,se=null;if(t.geometry.attributes.aPointData&&(oe=t.geometry.attributes.aPointData.array[r*4+1]>.5,oe&&t.parentInstance&&t.parentInstance.bigDipper)){let e=r-t.parentInstance._dipperBaseIndex;e>=0&&e<t.parentInstance.bigDipper.length&&(se=t.parentInstance.bigDipper[e])}let ce=M,P=ne;return oe&&se&&(ce=se.textureSlotCol,P=se.textureSlotRow),{idx:r,texIndex:j,col:ce,row:P,rnd:o,icon:N.icon,name:N.name,description:N.description,meta:N.meta,worldPos:_,spatialCol:re,spatialRow:ie,isGrid:f>.5,isDipper:oe,dipperData:se}}update(t,n,r,i,a,o,s){if(!n)return;let c=t.params.Points.threshold;t.params.Points.threshold=1;let l=r.uniforms.uModelScreenOffset?r.uniforms.uModelScreenOffset.value:new e.Vector2(0,0),u=i.clone().sub(l);t.setFromCamera(u,o);let d=t.intersectObject(n),f=-1,p=n.parentInstance?.scene?.knowhere;if(p&&p.material.uniforms.uScaleFactor.value>.01){let t=new e.Raycaster;t.setFromCamera(i,o);let n=t.intersectObject(p);if(n.length>0){let e=n[0].uv;if(e){let t=e.x*2-1,n=e.y*2-1;Math.sqrt(t*t+n*n)<.9&&(f=999999)}}}if(f===-1)if(d.length>0){let e=-1;for(let t=0;t<Math.min(d.length,5);t++){let r=d[t].index;if(n.geometry.attributes.aPointData&&n.geometry.attributes.aPointData.array[r*4+1]>.5){e=r;break}}f=e===-1?d[0].index:e}else n.geometry.morphCurrentIndex===3&&n.parentInstance&&n.parentInstance.model&&t.intersectObject(n.parentInstance.model,!0).length>0&&(f=n.geometry.lastClosestIndex||0);if(f!==-1){document.body.style.cursor=`pointer`;let e=this._getPointInfo(n,r,f,o,a);this.lastHoveredIndex!==f&&(this.lastHoveredIndex=f);let t=s.domElement.getBoundingClientRect(),i=a.x<t.left+t.width/2?`left`:`right`,c=`${f}_${e?e.texIndex:-1}_${i}`;if(this.lastTooltipRefString!==c&&e){let t=!(a.x<window.innerWidth/2),n=e.isDipper,r={bg:t?`rgba(255, 255, 255, 1.0)`:`rgba(5, 10, 15, 0.95)`,border:t?`1px solid rgba(0, 0, 0, 0.3)`:`1px solid rgba(0, 255, 255, 0.3)`,shadow:t?`0 12px 40px rgba(0,0,0,0.2)`:`0 6px 16px rgba(0,0,0,0.6)`,title:t?`#000000`:`#00FFFF`,desc:t?`#111111`:`#FFFFFF`,meta:t?`#333333`:`#DCD0BA`,divider:t?`rgba(0, 0, 0, 0.25)`:`rgba(255, 255, 255, 0.2)`,gridBg:t?`linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)`:`linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px)`};if(this.tooltip.style.backgroundColor=r.bg,this.tooltip.style.backgroundImage=r.gridBg,this.tooltip.style.backgroundSize=`20px 20px`,this.tooltip.style.border=r.border,this.tooltip.style.boxShadow=r.shadow,this.tooltip.style.color=r.desc,this.tooltip.style.padding=`20px 24px`,this.tooltip.style.width=`300px`,this.faceElements){let n=isNaN(e.col)||isNaN(e.row);this.faceElements.forEach(i=>{if(i.style.backgroundColor=t?`#d0d0d0`:`#444444`,n)i.style.backgroundImage=`none`,i.style.display=`flex`,i.style.alignItems=`center`,i.style.justifyContent=`center`,i.style.fontSize=`20px`,i.style.fontWeight=`bold`,i.style.color=r.title,i.style.fontFamily=`'Fira Code', monospace`,i.textContent=`?`;else{V.spriteSheetIcon&&(i.style.backgroundImage=`url('${V.spriteSheetIcon.image.src}')`),i.textContent=``;let t=e.col/7*100,n=e.row/3*100;i.style.backgroundPosition=`${t}% ${n}%`}i.style.filter=t?`invert(1) contrast(0.85)`:`none`})}n&&`${r.meta}`;let i=n?`⭐ ${e.dipperData.category}`:e.name,o=n?e.dipperData.usp_subtitle||`STRATEGIC NODE`:e.icon||`UNKNOWN`;n&&e.dipperData.meaning&&`${r.meta}${e.dipperData.meaning}`;let s=n?e.dipperData.usp:e.description;this.tooltip.innerHTML=`
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
                        <div style="display: flex; flex-direction: column; gap: 4px;">
                            ${n?`
                                <div style="font-family: 'Fira Code', monospace; font-size: 8px; font-weight: 800; color: ${r.meta}; letter-spacing: 2.5px; opacity: 0.8; text-transform: uppercase;">CORE EXPERTISE</div>
                                <div style="font-family: 'Orbitron', monospace; font-weight: 700; font-size: 16px; color: ${r.title}; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 2px;">⭐ ${e.dipperData.category}</div>
                                <div style="font-family: 'Fira Code', monospace; font-size: 9px; font-weight: 600; color: ${r.desc}; opacity: 0.7; text-transform: uppercase;">${e.dipperData.meaning} • ${e.dipperData.usp_subtitle.replace(` • `,` • `)}</div>
                            `:`
                                <div style="font-family: 'Orbitron', monospace; font-weight: 700; font-size: 14px; margin-bottom: 4px; color: ${r.title}; text-transform: uppercase; letter-spacing: 1px;">${i}</div>
                                <div style="font-family: 'Orbitron', monospace; font-size: 10px; font-weight: 600; color: ${r.desc}; text-transform: uppercase; opacity: 0.6; letter-spacing: 0.5px;">${o}</div>
                            `}
                        </div>
                        <div id="tooltip-icon-container" style="
                            width: ${this.iconSize}px; 
                            height: ${this.iconSize}px;
                            margin-top: 4px;
                        "></div>
                    </div>

                    <div style="width: 100%; height: 1px; background: linear-gradient(90deg, ${r.divider} 0%, transparent 100%); margin-bottom: 16px;"></div>

                    <div style="font-family: 'Rajdhani', sans-serif; font-size: 13px; font-weight: 400; color: ${r.desc}; line-height: 1.7; letter-spacing: 0.3px; opacity: 0.95;">
                        ${s}
                    </div>
                `;let l=this.tooltip.querySelector(`#tooltip-icon-container`);if(l)if(this.cubeDOM){let e=this.cubeDOM.parentElement;l.appendChild(e)}else{let e=this._createCubeDOM();l.appendChild(e)}this.tooltip.style.display=`block`,this.isAnimating||(this.isAnimating=!0,this._animateIcon()),this.lastTooltipRefString=c,Q&&typeof Q.highlightSkillByCategory==`function`&&e.isDipper&&e.dipperData&&Q.highlightSkillByCategory(e.dipperData.category)}let l=a.x,u=a.y,d=window.innerWidth,p=window.innerHeight;l>d*.6?(this.tooltip.style.left=`auto`,this.tooltip.style.right=d-l+20+`px`):(this.tooltip.style.right=`auto`,this.tooltip.style.left=l+20+`px`),u>p*.7?(this.tooltip.style.top=`auto`,this.tooltip.style.bottom=p-u+20+`px`):(this.tooltip.style.bottom=`auto`,this.tooltip.style.top=u+20+`px`)}else document.body.style.cursor=`auto`,this.lastHoveredIndex!==-1&&this.hide();t.params.Points.threshold=c}hide(){this.tooltip.style.display=`none`,this.lastHoveredIndex=-1,this.lastTooltipRefString=null,this.isAnimating=!1,Q&&typeof Q.highlightSkillByCategory==`function`&&Q.highlightSkillByCategory(null)}}}));function tl(e,t,n){let r=window.gsap,i=window.Observer||(r?r.Observer:null);r&&i&&r.registerPlugin(i);let a=!0,o=0,s=null,c=!1,l=0,u=null;t.previousStep=0,t._lastBoardScale=1,t._lastSubProgress=1,window.__boardScale=1,window.__boardSubProgress=ce.chaos.subVisible?1:0;let d=(t,n=1,r=.2)=>{let i=e.HUD.material.uniforms;i.uBNotchBarProgress.value=t,i.uBNotchBarAlpha.value=n,i.uBNotchBarMarginX.value=r},f=t=>{if(e&&e.HUD&&e.HUD.material.uniforms){let n=e.HUD.material.uniforms;n.uRNotchBarProgress.value=t}},p=t=>{if(e&&e.HUD&&e.HUD.material.uniforms){let n=e.HUD.material.uniforms;n.uBeamColor.value.copy(t),n.uBNotchBarColor.value.copy(t)}},m=(r=0)=>{if(!e||!e.HUD||!e.HUD.material.uniforms)return;let i=e.HUD.material.uniforms;i.uBeamAttachRatio.value=r,t.beamTween&&t.beamTween.stop(),i.uBeamMaxHeight.value=0,i.uBeamBaseThickness.value=0,i.uBeamGrowth.value=0,t.beamTween=new n.Tween({growth:0,height:0,thickness:0}).to({growth:$.BEAM_GROWTH||1,height:$.BEAM_MAX_HEIGHT||.03,thickness:$.BEAM_BASE_THICKNESS||.001},200).easing(n.Easing.Quadratic.In).onUpdate(e=>{i.uBeamGrowth.value=e.growth,i.uBeamMaxHeight.value=e.height,i.uBeamBaseThickness.value=e.thickness}).onComplete(()=>{t.beamTween=null;let a=r<.5?i.uRNotchVibeB:i.uRNotchVibeT;t.impactVibeTween&&t.impactVibeTween.stop(),a.value=1,t.impactVibeTween=new n.Tween(a).to({value:0},1500).easing(n.Easing.Exponential.Out).onComplete(()=>{t.impactVibeTween=null}).start(),typeof window.cvShake==`function`&&window.cvShake(1500),setTimeout(()=>h(),100),o===3&&e.HUD&&(e.HUD.applyBeamImpulse&&e.HUD.applyBeamImpulse(),typeof window.cvFall==`function`&&window.cvFall())}).start()},h=()=>{if(!e||!e.HUD||!e.HUD.material.uniforms)return;let r=e.HUD.material.uniforms;t.beamTween&&t.beamTween.stop(),t.beamTween=new n.Tween({growth:r.uBeamGrowth.value,height:r.uBeamMaxHeight.value,thickness:r.uBeamBaseThickness.value}).to({growth:0,height:0,thickness:0},200).easing(n.Easing.Quadratic.In).onUpdate(e=>{r.uBeamGrowth.value=e.growth,r.uBeamMaxHeight.value=e.height,r.uBeamBaseThickness.value=e.thickness}).onComplete(()=>{t.beamTween=null,d(0,0,1)}).start()},g=(e=!1)=>{let t=document.querySelector(`.indicator-icon`);if(!t)return;u&&u.kill();let n=t.style.animation;t.style.animation=`none`,u=r.timeline({repeat:e?-1:0,repeatDelay:e?.8:0,onComplete:()=>{e||(t.style.animation=n,u=null)}});let i=.45,a=.65,o=`power3.out`,s=`bounce.out`;u.to(t,{y:-25,duration:i,ease:o}).to(t,{y:0,duration:a,ease:s},`-=0.1`),u.to(t,{y:-35,duration:i-.05,ease:o},`+=0.1`).to(t,{y:0,duration:a,ease:s},`-=0.1`),u.to(t,{y:-45,duration:i-.1,ease:o},`+=0.1`).to(t,{y:0,duration:a+.2,ease:s},`-=0.1`)},_=()=>{u&&=(u.kill(),null);let e=document.querySelector(`.indicator-icon`);e&&(r.to(e,{y:0,duration:.3}),e.style.animation=``)};t.triggerEnergeticScrollJump=g,t.stopEnergeticScrollJump=_,t.triggerStep=(e,t=null,n=!1)=>{o=e,x(e,null,t,n)},t.getCurrentStep=()=>o,t.refreshUIPersonaSync=()=>{let e=b[o];if(e&&e.ui&&e.ui.board){let t=document.querySelector(`.intro-main-name1`),n=document.querySelector(`.intro-main-name2`),r=document.querySelector(`.board-philo-main`),i=document.querySelector(`.board-philo-sub`),a=document.getElementById(`board-feat-1`);t&&S(t,e.ui.board.name1,400,t.innerText),n&&S(n,e.ui.board.name2,400,n.innerText),i&&e.ui.board.philoSub&&S(i,e.ui.board.philoSub,400,i.innerText),r&&e.ui.board.philo&&S(r,e.ui.board.philo,400,r.innerText),a&&e.ui.board.feat1&&S(a,e.ui.board.feat1,400,a.innerText);let o=document.getElementById(`board-feat-2`);o&&e.ui.board.feat2&&S(o,e.ui.board.feat2,400,o.innerText)}};let v=(e,t=3e3,r=3e3,i)=>{let a=e.scene,o=(a?a.camera:null)||e.camera,s=(a?a.orbitControls:null)||e.controls;if(!o||!s){console.error(`[ScrollMorph] Camera or Controls missing! Aborting tween.`);return}let c={x:17.4192690499384,y:4.136164408312478,z:.015309904980740474},l={x:-.04520672934354282,y:1.5515547851416993,z:.045198372394982464},u={x:-3.226367634071287,y:4.1182097600816245,z:-.38158710192007556},d={x:Math.PI/2,y:Math.PI/2,z:0},f={x:0,y:0},p={x:-2.1,y:0,z:0},m=o.position.clone(),h=o.rotation.clone(),g=s.target.clone(),_=e.material?e.material.uniforms:null;a.HUD.material.uniforms;let v=_?.uModelScale?.value||1,y=_?.uModelRotation?.value?_.uModelRotation.value.clone():{x:0,y:0,z:0},b=_?.uModelScreenOffset?.value?_.uModelScreenOffset.value.clone():{x:0,y:0},x=_?.uModelPosition?.value?_.uModelPosition.value.clone():{x:0,y:0,z:0},S=_?.uLightSizeBoost?.value||1.5,C=_?.uPixelRatio?.value||2,w=_?.uModelPointSizeFactor?.value||1,T=w*.32,E=_?.uModelVibFactor?.value||0;new n.Tween({t:0}).to({t:1},t).easing(n.Easing.Linear.None).delay(r).onStart(()=>{window.scene&&window.scene.HUD&&typeof window.scene.HUD.startBreathing==`function`&&window.scene.HUD.startBreathing(),window.scene&&(window.scene.isTransitioning=!0),window.scene&&window.scene.HUD&&typeof window.scene.HUD.runTweenHideDecos==`function`&&(window.scene.HUD.runTweenHideDecos(2e3,()=>{window.scene.HUD.toggleGarden()}),setTimeout(()=>{window.scene.HUD.runTweenHideIsland(3e3)},500),window.scene.HUD.runTweenHideRNotch(3e3))}).onUpdate(e=>{let t=e.t;o.position.lerpVectors(m,c,t),o.rotation.x=h.x+(l.x-h.x)*t,o.rotation.y=h.y+(l.y-h.y)*t,o.rotation.z=h.z+(l.z-h.z)*t,s.target.lerpVectors(g,u,t),_&&(_.uModelScale&&(_.uModelScale.value=v+(.036-v)*t),_.uModelVibFactor&&(_.uModelVibFactor.value=E+(0-E)*t),_.uModelRotation&&_.uModelRotation.value&&_.uModelRotation.value.lerpVectors(y,d,t),_.uModelScreenOffset&&_.uModelScreenOffset.value&&_.uModelScreenOffset.value.lerpVectors(b,f,t),_.uModelPosition&&_.uModelPosition.value&&_.uModelPosition.value.lerpVectors(x,p,t),_.uLightSizeBoost&&(_.uLightSizeBoost.value=S+(0-S)*t),_.uPixelRatio&&(_.uPixelRatio.value=C+(1-C)*t),_.uModelPointSizeFactor&&(_.uModelPointSizeFactor.value=w+(T-w)*t))}).onComplete(()=>{i?(i(),e.hasVisitedRoom=!0):a&&setTimeout(()=>{let t=document.getElementById(`board`);t&&(e.boardPosTween&&e.boardPosTween.stop(),e.boardScaleTween&&e.boardScaleTween.stop(),window.gsap.to(t,{opacity:0,duration:.8,onComplete:()=>{t.style.display=`none`}})),Yo(a),e.hasVisitedRoom=!0},1125)}).start()},y=(t,r)=>{c=!0;let i=e=>{if(!t.scene.heroClips)return 1e3;let n=t.scene.heroClips.find(t=>t.name===e);return n?n.duration*1e3:1e3},a=t.hasVisitedRoom||!1,o=a?2.25/4:2.25,s=a?1.2*4:1.2,l=.2,u=i(`standToSit`),d=i(`sitToType`),f=2.5;u+d/f+o*1e3,t.playAnimation(`walking`,l,!0,s),t.renderer&&new n.Tween(t.renderer).to({toneMappingExposure:.4},o*1e3).easing(n.Easing.Quadratic.Out).start(),v(t,o*1e3,0,async()=>{let n=document.getElementById(`board`);n&&(t.boardPosTween&&t.boardPosTween.stop(),t.boardScaleTween&&t.boardScaleTween.stop(),window.gsap.to(n,{opacity:0,duration:.8,onComplete:()=>{n.style.display=`none`}})),await No(1125),e&&(e.isHeavyBuilding=!0),go(e)}),setTimeout(async()=>{t.playAnimation(`standToSit`,l,!1),await No(u),t.playAnimation(`sitToType`,l,!1,f),await No(d/f),t.playAnimation(`typing`,.5,!0),r&&r()},o*1e3+0)},b={0:{label:`Chaos`,bloom:3,knowhere:{scale:.8,offset:{x:0,y:.25},gravity:50,radius:200,gardenHoverMult:400,chargeUpDur:3e3,collapseOutDur:1200},get targetIndex(){return t.getChaosIndex()},allowsScrollBack:!1,ui:{scrollIcon:`pos-bottom`,scrollScale:1,maskBounds:{widthVw:0,heightVh:0,topVh:60,leftVw:5},maskScale:0,board:{nameSub:`HELLO, I AM`,get philoSub(){return R(`NARR_STEP_0_VERB_${Q.currentMode.toUpperCase()}`)},get name1(){return R(`BOARD_STEP_0_NAME1_${Q.currentMode.toUpperCase()}`)},get name2(){return R(`BOARD_STEP_0_NAME2_${Q.currentMode.toUpperCase()}`)},get philo(){return R(`NARR_STEP_0_OUTCOME_${Q.currentMode.toUpperCase()}`)},get feat1(){return R(`NARR_STEP_0_CREDIBILITY_${Q.currentMode.toUpperCase()}`).split(`
`)[0].trim()},get feat2(){let e=R(`NARR_STEP_0_CREDIBILITY_${Q.currentMode.toUpperCase()}`).split(`
`);return e.length>1?e[1].trim():``}}},action:e=>{e.stopAnimations(.8)}},1:{label:`Root`,bloom:3,knowhere:{scale:1,offset:{x:-.4,y:-.75},gravity:60,radius:200,gardenHoverMult:60,chargeUpDur:4e3,collapseOutDur:500},get targetIndex(){return t.getRootIndex()},allowsScrollBack:!0,ui:{scrollIcon:`hidden`,scrollScale:1,get maskBounds(){return{useBoard:!0}},maskScale:1,board:{get name1(){return R(`BOARD_STEP_1_NAME1_${Q.currentMode.toUpperCase()}`)},get name2(){return R(`BOARD_STEP_1_NAME2_${Q.currentMode.toUpperCase()}`)},get philo(){return R(`NARR_STEP_1_SUBTITLE_${Q.currentMode.toUpperCase()}`)},get feat1(){return R(`NARR_STEP_1_DESC_${Q.currentMode.toUpperCase()}`)}}},action:e=>{e.stopAnimations(.8),fo.onMorphToAbout(e.scene)}},2:{label:`Dance`,bloom:3,knowhere:{scale:.5,offset:{x:0,y:-1},gravity:-800,radius:300,gardenHoverMult:-.5,chargeUpDur:3e3,collapseOutDur:400},get targetIndex(){return t.getCharIndex()},allowsScrollBack:!0,ui:{scrollIcon:`hidden`,scrollScale:1,get maskBounds(){return{useBoard:!0}},maskScale:1,board:{get name1(){return R(`BOARD_STEP_2_NAME1_${Q.currentMode.toUpperCase()}`)},get name2(){return R(`BOARD_STEP_2_NAME2_${Q.currentMode.toUpperCase()}`)},get philo(){return R(`NARR_STEP_2_SUBTITLE_${Q.currentMode.toUpperCase()}`)},get feat1(){return R(`NARR_STEP_2_DESC_${Q.currentMode.toUpperCase()}`)}}},action:r=>{let i=()=>{t.getCurrentStep()===2&&r.playAnimation(`breakDance`,.8,`pingpong`,1.1,()=>{t.getCurrentStep()===2&&r.playAnimation(`robotDance`,.8,!1,1.1,()=>{t.getCurrentStep()===2&&r.playAnimation(`gangnam`,.8,!1,1.25,i)})})};i(),window.scene&&window.scene.HUD&&window.scene.HUD.material.uniforms.uHeadSpriteSize&&new n.Tween(window.scene.HUD.material.uniforms.uHeadSpriteSize).to({value:16},1e3).easing(n.Easing.Quadratic.Out).start();let a=e.getObjectByName(`PointsCloud`);a&&(a.visible=!0)}},3:{label:`WaveSit`,knowhere:{scale:.5,offset:{x:0,y:-3},gravity:-2e3,radius:200,gardenHoverMult:1.2,chargeUpDur:2250,collapseOutDur:1200},get targetIndex(){return t.getCharIndex()},allowsScrollBack:!1,ui:{scrollIcon:`hidden`,get maskBounds(){return{useBoard:!0}},maskScale:1,board:{get name1(){return R(`BOARD_STEP_3_NAME1_${Q.currentMode.toUpperCase()}`)},get name2(){return R(`BOARD_STEP_3_NAME2_${Q.currentMode.toUpperCase()}`)},get philo(){return R(`NARR_STEP_3_SUBTITLE_${Q.currentMode.toUpperCase()}`)}}},action:async t=>{if(!c){if(c=!0,e.knowhere&&setTimeout(()=>{e.knowhere&&(e.knowhere.visible=!1)},2e3),e){e.isTransitioning=!0;let r=window.devicePixelRatio||1;r*.2;let i=(t.hasVisitedRoom?2.25/4:2.25)*1e3,a=t=>{e.renderer&&(e.renderer.setPixelRatio(r*t),e.pointsApp&&typeof e.pointsApp.onWindowResize==`function`&&e.pointsApp.onWindowResize())};setTimeout(()=>a(.75),i*.3),setTimeout(()=>a(.5),i*.6),setTimeout(()=>a(.2),i*.9),t.material&&t.material.uniforms.uModelPointSizeFactor&&new n.Tween(t.material.uniforms.uModelPointSizeFactor).to({value:1.85},i).easing(n.Easing.Quadratic.Out).start()}s&&clearTimeout(s),t.playAnimation(`waving`,.2,!0),e.HUD&&typeof e.HUD.startBreathing==`function`&&e.HUD.startBreathing(),s=setTimeout(()=>{y(t,()=>{})},1300)}}}},x=(r,i,a=null,o=!1)=>{e&&e.renderer&&e.renderer.shadowMap&&(e.renderer.shadowMap.autoUpdate=!1);let l=b[r];if(!l)return;r===3&&e&&(e.isTransitioning=!0),t.morphOriginStep=t.morphTargetStep===void 0?r:t.morphTargetStep,t.morphTargetStep=r;let u=a===null?rl:a;t.isBloomEnabled&&t.bloomPass&&l.bloom!==void 0&&new n.Tween(t.bloomPass).to({strength:l.bloom},u).easing(n.Easing.Quadratic.Out).start();let h=r<t.previousStep,v=h?1:0;if(t.previousStep=r,e.knowhere&&r!==3&&(e.knowhere.visible=!0),r!==3&&t.points&&(t.points.visible=!0),r!==3&&(c=!1,s&&clearTimeout(s)),!o){t.isMorphing||d(h?1:0,1,.2);let i=h&&r!==3?I.ACCENT_GOLD:I.ELECTRIC_CYAN;t.hudCurrentColor||=(e&&e.HUD?e.HUD.material.uniforms.uBeamColor.value:I.ELECTRIC_CYAN).clone(),t.hudColorTween&&t.hudColorTween.stop(),t.hudColorTween=new n.Tween(t.hudCurrentColor).to({r:i.r,g:i.g,b:i.b},u).easing(n.Easing.Quadratic.InOut).onUpdate(()=>{p(t.hudCurrentColor)}).onComplete(()=>{t.hudColorTween=null}).start(),t.beamTimeout&&clearTimeout(t.beamTimeout);let a=Math.min(50,u/15);t.beamTimeout=setTimeout(()=>m(v),a)}if(t.morphTimeout&&clearTimeout(t.morphTimeout),(()=>{let a=e&&e.HUD?e.HUD.material.uniforms.uRNotchBarProgress.value:0,s=r/3;if(t.rightBarTween&&t.rightBarTween.stop(),r===3?t.rightBarTween=new n.Tween({r:a}).to({r:s},1e3).easing(n.Easing.Quadratic.InOut).onUpdate(e=>{f(e.r)}).onComplete(()=>{t.rightBarTween=null}).start():t.rightBarTween=new n.Tween({r:a}).to({r:s},u).easing(n.Easing.Quadratic.InOut).onUpdate(e=>{f(e.r)}).onComplete(()=>{t.rightBarTween=null}).start(),e.knowhere&&l.knowhere){let r=e.knowhere.material;if(r.uniforms.uScaleFactor&&r.uniforms.uHudOffset){t.knowhereTween&&t.knowhereTween.stop();let e=r.uniforms.uScaleFactor.value,i=r.uniforms.uHudOffset.value.x,a=r.uniforms.uHudOffset.value.y,o=t.material,s=o.uniforms.uKnowhereGravity.value,c=o.uniforms.uKnowhereRadius.value,d=o.uniforms.uKnowhereGravityHoverFactor.value;t.knowhereTween=new n.Tween({scale:e,x:i,y:a,gravity:s,radius:c,hoverMult:d}).to({scale:l.knowhere.scale,x:l.knowhere.offset.x,y:l.knowhere.offset.y,gravity:l.knowhere.gravity||0,radius:l.knowhere.radius||200,hoverMult:l.knowhere.gardenHoverMult||50},u).easing(n.Easing.Quadratic.InOut).onUpdate(e=>{r.uniforms.uScaleFactor.value=e.scale,r.uniforms.uHudOffset.value.set(e.x,e.y),o.uniforms.uKnowhereGravity.value=e.gravity,o.uniforms.uKnowhereRadius.value=e.radius,o.uniforms.uKnowhereGravityHoverFactor.value=e.hoverMult}).onComplete(()=>{t.knowhereTween=null}).start(),t.targetKnowhereGravity=l.knowhere.gravity||50,t.targetKnowhereRadius=l.knowhere.radius||200,t.targetGardenHoverMult=l.knowhere.gardenHoverMult||50,t.targetChargeUpDur=l.knowhere.chargeUpDur||3e3,t.targetCollapseOutDur=l.knowhere.collapseOutDur||1200}}let c=t.points.geometry.morphCurrentIndex||0,p=t.isMorphing,m=!1;if(l.targetIndex!==void 0){let e=()=>{o||d(0,1,.2);let e={t:0},r=!1;t.currentMorphTween&&t.currentMorphTween.stop(),t.currentMorphTween=new n.Tween(e).to({t:100},2e3).easing(n.Easing.Linear.None).onUpdate(()=>{let t=e.t/100;o||d(t,1,.2),f(1),e.t>=80&&!r&&(r=!0)}).onComplete(()=>{o||d(1,1),i&&i(),t.currentMorphTween=null}).start()};if(c!==l.targetIndex||p){p||(t.isMovingUp=h);let n=r===3;n&&e(),t.morphToTarget(l.targetIndex,u,.1,()=>{n||(o||d(t.isMovingUp?0:1,0),i&&i())},e=>{if(!n){let n=e;t.isMovingUp&&(n=1-e),o||d(n,1,.2)}}),m=!0}else r===3&&(m=!0,e())}if(l.action&&l.action(t),!m&&!o)if(t.beamTimeout&&=(clearTimeout(t.beamTimeout),null),r===2&&h){t.currentMorphTween&&t.currentMorphTween.stop();let e={t:100};t.currentMorphTween=new n.Tween(e).to({t:0},1e3).easing(n.Easing.Quadratic.Out).onUpdate(()=>{o||d(e.t/100,1,.2)}).onComplete(()=>{i&&i(),t.currentMorphTween=null}).start()}else i&&i()})(),l.ui){let e=document.querySelector(`.scroll-indicator`);if(e){let i=e.style.display===`none`||e.style.opacity===`0`;if(l.ui.scrollIcon===`hidden`){t.scrollTween&&t.scrollTween.stop();let r={y:parseFloat(e.style.getPropertyValue(`--scroll-indicator-margin`))||16,opacity:parseFloat(e.style.opacity)||.9};t.scrollTween=new n.Tween(r).to({y:-16,opacity:0},800).easing(n.Easing.Quadratic.In).onUpdate(()=>{e.style.setProperty(`--scroll-indicator-margin`,`${r.y}vh`),e.style.opacity=r.opacity}).onComplete(()=>{e.style.display=`none`,e.style.pointerEvents=`none`,t.scrollTween=null}).start()}else{t.scrollTween&&t.scrollTween.stop(),i&&(e.style.display=`flex`,e.style.pointerEvents=`auto`,e.style.setProperty(`--scroll-indicator-margin`,`-16vh`),e.style.opacity=`0`),e.style.pointerEvents=`auto`,e.classList.remove(`pos-middle`,`pos-bottom`,`pos-left`),l.ui.scrollIcon&&e.classList.add(l.ui.scrollIcon);let a=l.ui.scrollScale===void 0?1:l.ui.scrollScale,o={y:parseFloat(e.style.getPropertyValue(`--scroll-indicator-margin`))||-16,opacity:parseFloat(e.style.opacity)||0,scale:parseFloat(e.style.getPropertyValue(`--scroll-scale`))||0};t.scrollTween=new n.Tween(o).to({y:16,opacity:.9,scale:a},1200).easing(n.Easing.Quadratic.Out).onUpdate(()=>{e.style.setProperty(`--scroll-indicator-margin`,`${o.y}vh`),e.style.opacity=o.opacity,e.style.setProperty(`--scroll-scale`,o.scale)}).onComplete(()=>{e.style.display=`flex`,t.scrollTween=null}).start(),r===0?g(!0):_()}}if(t&&t.material&&t.material.uniforms.uTitleMaskRectBase){let e=l.ui.maskBounds,r=l.ui.maskScale===void 0?0:l.ui.maskScale,i=t.material.uniforms.uTitleMaskRectBase,a=t.material.uniforms.uTitleMaskScale,o=window.innerHeight/100,s=4.5;if(t.maskFollowTween&&t.maskFollowTween.stop(),t.activeUniformTweens&&t.activeUniformTweens.forEach(e=>e.stop()),t.activeUniformTweens=[],e&&e.useBoard){let e=document.getElementById(`board`);t.maskFollowTween=new n.Tween({t:0}).to({t:1},u).easing(n.Easing.Cubic.InOut).onUpdate(t=>{if(e&&a.value>.001){let t=e.getBoundingClientRect(),n=t.width/o,r=t.height/o,a=t.left/o,c=t.top/o,l=n+s+-10,u=r+3+-.75,d=a-s,f=c-3,p=d+l/2,m=100-(f+u/2);i.value.set(p*o,m*o,l/2*o,u/2*o)}}).start(),t.activeUniformTweens.push(t.maskFollowTween)}let c=new n.Tween(a).to({value:r},u).easing(n.Easing.Cubic.InOut).start();t.activeUniformTweens.push(c)}let i=document.getElementById(`board`);if(i){i.style.display=`flex`;let e=ce[[`chaos`,`root`,`dance`,`walk`][r]]||ce.chaos;e.mode&&(i.classList.forEach(e=>{e.startsWith(`mode-`)&&i.classList.remove(e)}),i.classList.add(e.mode)),t.boardPosTween&&t.boardPosTween.stop();let a=u*.5,o=window.innerHeight/100,s=i.getBoundingClientRect(),c=e.top!==void 0&&e.top!==0,d=c?s.top/o:(window.innerHeight-s.bottom)/o,f=i.style.opacity===``?0:parseFloat(i.style.opacity);t.boardPosTween=new n.Tween({val:d,op:f}).to({val:c?e.top:e.bottom,op:1},a).easing(n.Easing.Quadratic.InOut).onUpdate(e=>{i.style.opacity=e.op,c?(i.style.top=e.val+`vh`,i.style.bottom=`auto`):(i.style.bottom=e.val+`vh`,i.style.top=`auto`)}).start(),t.boardScaleTween&&t.boardScaleTween.stop();let p=t._lastBoardScale??1,m=t._lastSubProgress??1;if(window.__boardScale=p,window.__boardSubProgress=m,t.boardScaleTween=new n.Tween({scale:p,sub:m}).to({scale:e.scale,sub:e.subVisible?1:0},a).easing(n.Easing.Quadratic.InOut).onUpdate(e=>{window.__boardScale=e.scale,window.__boardSubProgress=e.sub,oe(e.scale,e.sub)}).onComplete(()=>{t._lastBoardScale=e.scale,t._lastSubProgress=e.subVisible?1:0,window.__boardScale=e.scale,window.__boardSubProgress=t._lastSubProgress,oe(e.scale,t._lastSubProgress)}).start(),l.ui.board){let e=i.querySelector(`.intro-sub`),t=i.querySelector(`.intro-main-name1`),n=i.querySelector(`.intro-main-name2`),r=i.querySelector(`.board-philo-sub`),o=i.querySelector(`.board-philo-main`),s=i.querySelector(`#board-feat-1`),c=i.querySelector(`#board-feat-2`);e&&l.ui.board.nameSub&&S(e,l.ui.board.nameSub,a,e.innerText),t&&S(t,l.ui.board.name1,a,t.innerText),n&&S(n,l.ui.board.name2,a,n.innerText),r&&l.ui.board.philoSub&&S(r,l.ui.board.philoSub,a,r.innerText),o&&l.ui.board.philo&&S(o,l.ui.board.philo,a,o.innerText),s&&l.ui.board.feat1&&S(s,l.ui.board.feat1,a,s.innerText),c&&l.ui.board.feat2&&S(c,l.ui.board.feat2,a,c.innerText)}}}},S=(e,t,n=800,r=``)=>{if(!e||e.innerText===t&&r===t)return;let i=r||e.innerText||``;e._scrambleRAId&&cancelAnimationFrame(e._scrambleRAId);let a=getComputedStyle(e).fontFamily,o=P(i,`20px ${a}`),s=P(t,`20px ${a}`),c=`ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*`,l=performance.now(),u=r=>{let a=r-l,d=Math.min(a/n,1);e._stableWidth=o+(s-o)*d;let f=Math.round(i.length+(t.length-i.length)*d),p=``;for(let e=0;e<f;e++){let n=e/f;d>n?d>n+.1||d===1?p+=t[e]||``:p+=c[Math.floor(Math.random()*42)]:d<n*.5&&e<i.length?p+=i[e]:p+=c[Math.floor(Math.random()*42)]}e.innerText=p,typeof window.fitBoardTexts==`function`&&window.fitBoardTexts(window.__boardScale||1,window.__boardSubProgress??1),d<1?e._scrambleRAId=requestAnimationFrame(u):(e._scrambleRAId=null,e._stableWidth=null,typeof window.fitBoardTexts==`function`&&window.fitBoardTexts(window.__boardScale||1,window.__boardSubProgress??1))};e._scrambleRAId=requestAnimationFrame(u)},C=i.create({target:window,type:`wheel,touch`,onDown:()=>w(1),onUp:()=>w(-1),tolerance:10,dragMinimum:10});C.enable();let w=n=>{if(!a)return;let r=document.getElementById(`experience-container`);if(r&&!r.matches(`:hover`)||e&&e.HUD&&e.HUD.isOpen===!1)return;let i=Date.now(),s=t.isMorphing,u=o;if(n>0){if(u=Math.min(o+1,3),o===3&&!c){let e=b[3];e&&e.action&&(l=i,e.action(t))}}else u=Math.max(o-1,0);let d=b[u];d&&d.targetIndex!==void 0&&(typeof d.targetIndex==`function`?d.targetIndex():d.targetIndex),s=t.isMorphing,t.morphOriginIndex,t.morphRequestedTarget;let f=u===t.morphOriginStep&&s,p=u===t.morphTargetStep&&s&&t.isReversing;if(!(!(f||p)&&(s||i-l<500))){if(n<0){let e=b[o];if(e&&e.allowsScrollBack===!1)return}u!==o&&(o=u,l=i,document.body.classList.add(`morph-active`),x(o,()=>{t.isMorphing||document.body.classList.remove(`morph-active`)}))}};t.setScrollLock=e=>{a=e;let t=document.getElementById(`experience-container`);document.body.style.overflow=`hidden`,t&&(t.style.overflow=`hidden`,t.scrollTo(0,0));let n=document.getElementById(`app-container`);n&&(n.style.height=`100%`),e?(C.enable(),f(0),`scrollRestoration`in history&&(history.scrollRestoration=`manual`),window.scrollTo(0,0)):C.disable()};let T=async(r=3e3)=>{let i=e.camera,a=e.orbitControls,l=t.material.uniforms,u={x:61.56,y:2.97,z:30},p={x:0,y:0,z:0},m={x:Math.PI/2,y:-1.15,z:0},h={x:.4,y:-.8},g={x:0,y:0,z:0},_=i.position.clone(),v=a.target.clone(),y=l.uModelScale.value,b=l.uModelRotation.value.clone(),x=l.uModelScreenOffset.value.clone(),S=l.uModelPosition.value.clone(),C=l.uLightSizeBoost.value,w=l.uPixelRatio.value;e&&(e.isTransitioning=!0),Xo(e,r),e.HUD&&(e.HUD.resetBarPhysics&&e.HUD.resetBarPhysics(),e.HUD.runTweenShowIsland(3e3),e.HUD.runTweenShowDecos(3e3),e.HUD.runTweenShowRNotch(3e3)),new n.Tween({t:0}).to({t:1},r).easing(n.Easing.Cubic.Out).onUpdate(e=>{let t=e.t;i.position.lerpVectors(_,u,t),a.target.lerpVectors(v,p,t),i.lookAt(a.target),l.uModelScale.value=y+(.25-y)*t,l.uModelRotation.value.lerpVectors(b,m,t),l.uModelScreenOffset.value.lerpVectors(x,h,t),l.uModelPosition.value.lerpVectors(S,g,t),l.uLightSizeBoost.value=C+(.5-C)*t,l.uPixelRatio.value=w+(2-w)*t,d(1-t,1),f(1)}).onComplete(()=>{e&&(e.isTransitioning=!1),t.beamTimeout&&clearTimeout(t.beamTimeout),s&&clearTimeout(s),c=!1,o=2,t.previousStep=3,t.playAnimation(`gangnam`,.5,!0),t.setScrollLock(!0),e.maximizer&&(e.maximizer.lastStep=-1),console.log(`🔙 Reversed to Points Step 2 -> Auto Trigger Root`),setTimeout(()=>{t.triggerStep&&t.triggerStep(1)},500)}).start()};return t.triggerReverseTransition=()=>{o===3&&T(1e3)},t.setScrollLock(!0),()=>{C.kill()}}var nl=M((()=>{Ol(),ls(),Ks(),Te(),Ae(),Ns(),le(),po()})),rl,il,al,ol,sl,cl,ll,ul,dl,fl,pl,ml,hl,gl,_l,vl,yl,bl,xl,Sl,Cl,wl,Tl,El,Dl,Ol=M((()=>{pt(),Hc(),Wc(),Yc(),uo(),Lt(),kt(),el(),nl(),Bs(),Te(),Sn(),mt(),rl=1500,il=500*1.2,al=1.53,ol=18e3,sl=.05,cl={x:61.56,y:2.97,z:30},ll=2,ul=.4,dl=.8,fl=-40,pl=2.5,ml=1,hl=8,gl=`200px`,_l=`20px`,vl=`20px`,yl={value:.15},bl={value:.08},xl=[{name:`man`,baseColor:new e.Vector3(1,1,1),brightness:1,pointSizeMultiplier:1},{name:`heart`,baseColor:new e.Vector3(.984,.757,.537),brightness:8.65,pointSizeMultiplier:.15},{name:`heartDev`,baseColor:new e.Vector3(.2,.8,.8),brightness:8.75,pointSizeMultiplier:1}],Sl=[{name:`Alkaid`,category:`VALIDATION`,meaning:`Technical De-risking`,usp_subtitle:`TECH VALIDATION • WEBGL`,usp:`I personally de-risk technical roadmaps by validating architectural feasibility and requirement scalability through code-driven functional prototyping in WebGL.`,row:61,col:31,brightnessFactor:5,textureSlotRow:3,textureSlotCol:6},{name:`Mizar`,category:`EXECUTION`,meaning:`Automation`,usp_subtitle:`WORKFLOW AUTOMATION • N8N`,usp:`I personally deploy automated AI and n8n production pipelines that reduce manual project overhead by an estimated 40%.`,row:60,col:35,brightnessFactor:1,textureSlotRow:1,textureSlotCol:4},{name:`Alioth`,category:`EXECUTION`,meaning:`Workflow Velocity`,usp_subtitle:`VELOCITY • JIRA`,usp:`I lead high-velocity product execution through structured Jira management and data-driven SQL audits to ensure on-time delivery.`,row:56,col:35,brightnessFactor:3.5,textureSlotRow:1,textureSlotCol:2,useDipperColor:!0},{name:`Megrez`,category:`LOGIC`,meaning:`Data-driven ROI`,usp_subtitle:`DATA ANALYSIS • RICE`,usp:`I navigate competing stakeholder demands using the RICE and MoSCoW frameworks to deliver maximum ROI within tight technical constraints.`,row:55,col:32,brightnessFactor:.8,textureSlotRow:1,textureSlotCol:6},{name:`Phecda`,category:`LOGIC`,meaning:`Agile Standards`,usp_subtitle:`ADAPTIVE LOGIC • GHERKIN`,usp:`I establish a Single Source of Truth for complex requirements via Gherkin Acceptance Criteria, aligning 10,000+ stakeholders.`,row:52,col:30,brightnessFactor:1,textureSlotRow:2,textureSlotCol:4},{name:`Merak`,category:`PI-SHAPED`,meaning:`UI/UX Strategy`,usp_subtitle:`UX ARCHITECTURE • TECH`,usp:`I bridge deep engineering with human-centric design, ensuring your complex architectural vision is never compromised by UX constraints.`,row:49,col:28,brightnessFactor:1,textureSlotRow:2,textureSlotCol:3},{name:`Dubhe`,category:`PI-SHAPED`,meaning:`Design Synergy`,usp_subtitle:`TECH SYNERGY • FIGMA`,usp:`I integrate high-fidelity Figma designs with functional prototyping to ensure every requirement is architecturally sound.`,row:45,col:29,brightnessFactor:1.5,textureSlotRow:0,textureSlotCol:3},{name:`CONNECT`,category:`STRATEGIC SYNERGY`,meaning:`Technical Partnership`,usp_subtitle:`BUSINESS • TECH • USER`,usp:`I serve as the connective tissue of your product lifecycle. By unifying abstract business goals, technical feasibility, and user-centric design into a single roadmap, I ensure your vision survives the journey from pitch to production.`,row:71,col:68,brightnessFactor:5,textureSlotRow:3,textureSlotCol:2,useDipperColor:!0}],Cl=new e.Vector3(61.56,2.97,30),wl=[new e.Vector3(-20,20,-14),new e.Vector3(-20,25.8,-22),new e.Vector3(-20,27,-31.5),new e.Vector3(-20,28,-45),new e.Vector3(-20,24.4,-48.4),new e.Vector3(-20,27.5,-57.2),new e.Vector3(-20,33.3,-57),new e.Vector3(-25,-27,38)],Tl=[140,115,175,130,165,190,145,105],El=wl.map((t,n)=>{let r=new e.Vector3().subVectors(t,Cl).normalize();return{pos:new e.Vector3().addVectors(Cl,r.multiplyScalar(Tl[n]))}}),Dl=class{get isMorphing(){return this.material?.uniforms?.uProgress?.value>.01||!!this.morphTween}get targetIndex(){return this.points?.geometry?.morphTargetIndex===void 0?this.morphRequestedTarget||0:this.points.geometry.morphTargetIndex}constructor(t,n,r,i,a={}){this.scene=t,this.camera=n,this.renderer=r,this.options=Object.assign({enableLoadingUI:!0},a),t.points=this,this.bigDipper=Sl,document.documentElement.style.setProperty(`overflow`,`hidden`,`important`),document.body.style.setProperty(`overflow`,`hidden`,`important`),`scrollRestoration`in history&&(history.scrollRestoration=`manual`),window.scrollTo(0,0),this.isBloomEnabled=!0,this.points=null,this.userData={},this._currentPersona=ye,this.material=null,this.dipperLines=null,this.raycaster=i&&i.raycaster?i.raycaster:i||new e.Raycaster,this.intersectionPlane=null,this.mouse=new e.Vector2(0,0),this.targetMouse=new e.Vector2(0,0),this.smoothMouse=new e.Vector2(0,0),this.smoothRepulsionMouse=new e.Vector2(0,0),this.rawMouse=new e.Vector2(0,0),this.isFirstMouseMove=!0,this.clock=new e.Clock(!1),this.onMouseMove=this.onMouseMove.bind(this),this.onMouseLeave=this.onMouseLeave.bind(this),this.onMouseClick=this.onMouseClick.bind(this),this.onWindowResize=this.onWindowResize.bind(this),this.pointCap=ol,this.morphs=[];let o=new e.Vector3(cl.x,cl.y,cl.z),s=new e.Vector3(0,0,0),c=new e.Vector3().subVectors(s,o).normalize();this.shaderUniforms={iTime:{value:0},uResolution:{value:new e.Vector2(this.renderer.domElement.clientWidth,this.renderer.domElement.clientHeight)},uPixelRatio:{value:2},uMousePos:{value:new e.Vector3(0,0,0)},uMouseNDC:{value:new e.Vector2(0,0)},uProgress:{value:0},uMorphStagger:{value:.1},uIsChaos:{value:1},uSize:{value:.015},uColor:{value:new e.Color(`#ffffff`)},uStarTexture:{value:V.spriteSheet},uSizeThreshold:{value:.05},uCols:{value:8},uRows:{value:4},uSpritePixels:{value:new e.Vector2(512,256)},uLightDir:{value:new e.Vector3(-100,-100,100.7)},uLightStrength:{value:1},uLightSizeBoost:{value:1.5},uModelScale:{value:1},uModelPosition:{value:new e.Vector3(0,0,0)},uModelRotation:{value:new e.Vector3(0,0,0)},uEnableMouseRotation:{value:!0},uAttractionForce:{value:0},uIsArmatureState:{value:0},uAttractionRefSize:{value:.5},uModelScreenOffset:{value:new e.Vector2(0,0)},uModelPointSizeFactor:{value:1},uHoverPointScaleFactor:{value:2.5},uVibrateAmp:{value:.8},uModelVibFactor:{value:1},uVibrateBoostSizeThreshold:{value:1},uBaseRotateSpeed:{value:1},uHoverRadius:{value:200},uAttractionRadius:{value:200},uHoveredTextureIndex:{value:0},uHoveredIndex:{value:-1},uGlobalHoverStrength:{value:0},uGridZ:{value:fl},uBaseGridZ:{value:fl},uGridForward:{value:c},uBigDipper:{value:Sl.map(t=>new e.Vector4(t.row,t.col,t.brightnessFactor||1,(t.textureSlotRow||0)*8+(t.textureSlotCol||0)))},uGridSide:{value:0},uModelPointCount:{value:0},uFOV:{value:this.camera.fov},uProjectionMultiplier:{value:1},uDipperColor:{value:new e.Vector3(0,1,1)},uPulseCenters:{value:Array(hl).fill().map(()=>new e.Vector3(0,0,0))},uPulseStartTimes:{value:Array(hl).fill(-100)},uPulseDuration:{value:2.5},uPulseDisplacementFactors:{value:Array(hl).fill(0)},uPulseSpeed:{value:60},uPulseWidth:{value:7},uActivePulseCount:{value:0},uPulseactive:{value:0},uMaskRect:{value:new e.Vector4(0,0,0,0)},uMaskRectNav:{value:new e.Vector4(0,0,0,0)},uMaskSlant:{value:new e.Vector2(0,0)},uDipperBrightnessScalar:{value:1},uModelMat3:{value:new e.Matrix3},uMouseScreen:{value:new e.Vector2(0,0)},uTitleMaskRectBase:{value:new e.Vector4(0,0,0,0)},uTitleMaskScale:{value:0},uTitleMaskEdgeJitter:{value:.02},uKnowhereScreen:{value:new e.Vector2(0,0)},uKnowhereGravity:{value:50},uKnowhereGravityMultiplier:{value:-1},uKnowhereGravityHoverFactor:{value:50},uKnowhereRadius:{value:200},uKnowhereScale:{value:1},uIsGardenHovering:{value:0},uKnowhereVibrateBoost:{value:0},uRippleColor:{value:new e.Vector3(0,1,1)},uDistStaggerFactor:{value:0},uDistStaggerMax:{value:120},uBonePos:{value:new e.Vector2(0,0)},uBoneRadius:{value:.15},uBoneIntensity:{value:0},uStickRect:{value:new e.Vector4(0,0,0,0)},uStickStrength:{value:0}},console.log(`[Points] shaderUniforms initialized with uTitleMaskRectBase, uTitleMaskScale, uTitleMaskEdgeJitter, uKnowhereGravityMultiplier and uIsGardenHovering`),this.bigDipper=Sl,this.currentPulseIndex=0,this.userData.chaosUniforms=e.UniformsUtils.clone(this.shaderUniforms),this.userData.chaosUniforms.uIsChaos.value=1,this.forceDisableAttraction=!1,this.tooltip=new $c,this.tooltip.tooltip.addEventListener(`mouseleave`,e=>{e.relatedTarget!==this.renderer.domElement&&this.onMouseLeave(e)}),this.enableScrollMorph=!0,this.isReady=!1,this._modelPointCount=0,this._gridSide=1,this._tooltipFrameCount=0}_updateCachedCounts(){if(!this.points||!this.points.geometry)return;let e=this.pointCap,t=this.points.geometry.attributes.aTargetSizeIsGrid;if(t){let n=0;for(let r=0;r<e&&t.array[r*2+1]<.5;r++)n++;this._modelPointCount=n;let r=e-n;this._gridSide=Math.ceil(Math.sqrt(r))||1}this.material&&this.material.uniforms&&(this.material.uniforms.uModelPointCount.value=this._modelPointCount,this.material.uniforms.uGridSide.value=this._gridSide)}async yieldToBrowser(){return new Promise(e=>requestAnimationFrame(e))}async init(){B.start(`Points: Services Init`),this.initPostprocessing(),this.intersectionPlane=new e.Mesh(new e.PlaneGeometry(5e3,5e3),new e.MeshBasicMaterial({visible:!0,opacity:0,transparent:!0,depthWrite:!1})),this.intersectionPlane.position.z=fl,this.scene.add(this.intersectionPlane),this.points&&this.points.geometry&&(this.points.geometry.morphCurrentIndex=0),this._initDipperLines(),this.renderer.domElement.addEventListener(`mousemove`,this.onMouseMove,!1),this.renderer.domElement.addEventListener(`mouseleave`,this.onMouseLeave,!1),this.renderer.domElement.addEventListener(`click`,this.onMouseClick,!1),window.addEventListener(`resize`,this.onWindowResize,!1),this.renderer.domElement&&(this.resizeObserver=new ResizeObserver(()=>this.onWindowResize()),this.resizeObserver.observe(this.renderer.domElement)),this.createLandingOverlay(),B.end(`Points: Services Init`),B.start(`Points: Background Particles`),await this.createBackgroundParticles(),this.onWindowResize(),this._updateCachedCounts(),B.start(`Points: Model Loading`),await this.loadModel(),B.end(`Points: Model Loading`),this.createControlUI(),this._dipperPointIndices=new Set,Sl.forEach((e,t)=>{this._dipperPointIndices.add(this._dipperBaseIndex+t)}),window.addEventListener(zs.GARDEN.HOVER_START,()=>{this.dipperLines&&(this.dipperLines.tween&&this.dipperLines.tween.stop(),this.dipperLines.tween=new v.Tween(this.dipperLines.userData).to({opacity:1,drawProgress:1},1750).easing(v.Easing.Cubic.InOut).start())}),window.addEventListener(zs.GARDEN.HOVER_END,()=>{this.dipperLines&&(this.dipperLines.tween&&this.dipperLines.tween.stop(),this.dipperLines.tween=new v.Tween(this.dipperLines.userData).to({opacity:0,drawProgress:0},800).easing(v.Easing.Cubic.Out).start())}),this.isReady=!0;let t=xl.find(e=>e.name===`heartDev`),n=xl.find(e=>e.name===`heart`),r=this._currentPersona===F.DEV?t.baseColor:n.baseColor;this.shaderUniforms.uRippleColor.value.copy(r),this.material&&this.material.uniforms.uRippleColor&&this.material.uniforms.uRippleColor.value.copy(r),this.warmup()}warmup(){if(!this.composer||!this.points)return;let e=this.points.visible;this.points.visible=!0,this.material.uniforms.iTime.value=.001,this.composer.render(.016),this.points.visible=e}activateScrollInteractions(){tl(this.scene,this,v)}playIntro(){this.points&&(this.points.visible=!0),this.clock.start(),this.clock.elapsedTime=0}initPostprocessing(){this.composer=new E(this.renderer);let t=new D(this.scene,this.camera);this.bloomPass=new Vc(new e.Vector2(this.renderer.domElement.clientWidth,this.renderer.domElement.clientHeight),ll,ul,dl),this.bloomPass.renderTargetsHorizontal.forEach(t=>{t.texture.type=e.HalfFloatType}),this.bloomPass.renderTargetsVertical.forEach(t=>{t.texture.type=e.HalfFloatType}),this.composer.addPass(t),this.composer.addPass(this.bloomPass)}createLandingOverlay(){this.overlayContainer=document.createElement(`div`),this.overlayContainer.id=`overlay-container`,Object.assign(this.overlayContainer.style,{position:`absolute`,top:`0`,left:`0`,width:`100%`,height:`100%`,display:`flex`,flexDirection:`column`,alignItems:`center`,justifyContent:`center`,pointerEvents:`none`,zIndex:`9999`}),document.body.appendChild(this.overlayContainer),this.options.enableLoadingUI&&(this.progressText=document.createElement(`div`),this.progressText.innerText=`0%`,Object.assign(this.progressText.style,{color:`white`,fontSize:`24px`,fontFamily:`'Orbitron', sans-serif`,marginBottom:`20px`}),this.overlayContainer.appendChild(this.progressText)),this.options.enableLoadingUI&&(this.progressBarContainer=document.createElement(`div`),Object.assign(this.progressBarContainer.style,{width:`300px`,height:`4px`,background:`rgba(255,255,255,0.2)`,borderRadius:`2px`,overflow:`hidden`}),this.progressBar=document.createElement(`div`),Object.assign(this.progressBar.style,{width:`0%`,height:`100%`,background:`white`,transition:`width 0.1s linear`}),this.progressBarContainer.appendChild(this.progressBar),this.overlayContainer.appendChild(this.progressBarContainer)),this.controlsWrapper=document.createElement(`div`),this.controlsWrapper.style.position=`absolute`,this.controlsWrapper.style.bottom=`30px`,this.controlsWrapper.style.left=`50%`,this.controlsWrapper.style.transform=`translateX(-50%)`,this.controlsWrapper.style.display=`none`,this.controlsWrapper.style.flexDirection=`column`,this.controlsWrapper.style.alignItems=`center`,this.controlsWrapper.style.gap=`15px`,this.controlsWrapper.style.zIndex=`1000`,this.controlsWrapper.style.background=`rgba(0, 0, 0, 0.5)`,this.controlsWrapper.style.padding=`10px 20px`,this.controlsWrapper.style.borderRadius=`12px`,this.controlsWrapper.style.backdropFilter=`blur(5px)`,this.controlsWrapper.style.pointerEvents=`auto`,this.overlayContainer.appendChild(this.controlsWrapper),this.buttonRow=document.createElement(`div`),this.buttonRow.style.display=`flex`,this.buttonRow.style.alignItems=`center`,this.buttonRow.style.gap=`10px`,this.controlsWrapper.appendChild(this.buttonRow),this.morphInput=document.createElement(`input`),this.morphInput.type=`number`,this.morphInput.value=`0`,this.morphInput.style.padding=`10px`,this.morphInput.style.fontSize=`16px`,this.morphInput.style.borderRadius=`8px`,this.morphInput.style.border=`1px solid #444`,this.morphInput.style.background=`#222`,this.morphInput.style.color=`#fff`,this.backBtn=document.createElement(`button`),this.backBtn.innerText=`Back`,this.backBtn.style.padding=`12px 20px`,this.backBtn.style.fontSize=`18px`,this.backBtn.style.border=`none`,this.backBtn.style.borderRadius=`30px`,this.backBtn.style.background=`#444`,this.backBtn.style.color=`#fff`,this.backBtn.style.cursor=`pointer`,this.backBtn.style.fontFamily=`'Orbitron', sans-serif`,this.backBtn.style.textTransform=`uppercase`,this.backBtn.style.marginRight=`10px`,this.triggerPrevMorph=()=>{let e=this.points.geometry,t=e.morphData?e.morphData.length:0;if(t===0)return;let n=((e.morphCurrentIndex||0)-1+t)%t;this.morphInput.value=n,this.morphToTarget(n),this.controlsCreated||=(this.createControlUI(),!0)},this.backBtn.onclick=this.triggerPrevMorph,this.buttonRow.appendChild(this.backBtn),this.morphInput.style.width=`60px`,this.morphInput.style.textAlign=`center`,this.buttonRow.appendChild(this.morphInput),this.enterBtn=document.createElement(`button`),this.enterBtn.innerText=`Morph`,this.enterBtn.style.padding=`12px 30px`,this.enterBtn.style.fontSize=`18px`,this.enterBtn.style.border=`none`,this.enterBtn.style.borderRadius=`30px`,this.enterBtn.style.background=`linear-gradient(90deg, #ff0077, #7700ff)`,this.enterBtn.style.color=`#fff`,this.enterBtn.style.cursor=`pointer`,this.enterBtn.style.fontFamily=`'Orbitron', sans-serif`,this.enterBtn.style.textTransform=`uppercase`,this.enterBtn.style.letterSpacing=`2px`,this.enterBtn.style.boxShadow=`0 0 15px rgba(255, 0, 119, 0.5)`,this.enterBtn.style.transition=`all 0.3s ease`,this.enterBtn.style.display=this.options.enableLoadingUI?`none`:`block`,this.enterBtn.onmouseenter=()=>{this.enterBtn.style.transform=`scale(1.05)`,this.enterBtn.style.boxShadow=`0 0 25px rgba(119, 0, 255, 0.7)`},this.enterBtn.onmouseleave=()=>{this.enterBtn.style.transform=`scale(1.0)`,this.enterBtn.style.boxShadow=`0 0 15px rgba(255, 0, 119, 0.5)`},this.buttonRow.appendChild(this.enterBtn),this.nextBtn=document.createElement(`button`),this.nextBtn.innerText=`Next`,this.nextBtn.style.padding=`12px 20px`,this.nextBtn.style.fontSize=`18px`,this.nextBtn.style.border=`none`,this.nextBtn.style.borderRadius=`30px`,this.nextBtn.style.background=`#444`,this.nextBtn.style.color=`#fff`,this.nextBtn.style.cursor=`pointer`,this.nextBtn.style.fontFamily=`'Orbitron', sans-serif`,this.nextBtn.style.textTransform=`uppercase`,this.nextBtn.style.marginLeft=`10px`,this.triggerNextMorph=()=>{let e=this.points.geometry,t=e.morphData?e.morphData.length:0;if(t===0)return;let n=((e.morphCurrentIndex||0)+1)%t;this.morphInput.value=n,this.morphToTarget(n),this.controlsCreated||=(this.createControlUI(),!0)},this.nextBtn.onclick=this.triggerNextMorph,this.buttonRow.appendChild(this.nextBtn),this.sliderRow=document.createElement(`div`),this.sliderRow.style.display=`flex`,this.sliderRow.style.alignItems=`center`,this.sliderRow.style.gap=`10px`,this.sliderRow.style.width=`100%`,this.sliderRow.style.justifyContent=`center`,this.controlsWrapper.appendChild(this.sliderRow),this.progressSlider=document.createElement(`input`),this.progressSlider.type=`range`,this.progressSlider.min=`0`,this.progressSlider.max=`1`,this.progressSlider.step=`0.01`,this.progressSlider.value=`0`,this.progressSlider.style.width=`300px`,this.progressSlider.style.cursor=`pointer`,this.progressSlider.oninput=e=>{let t=parseFloat(e.target.value);this.points.material&&this.points.material.uniforms.uProgress&&(this.points.material.uniforms.uProgress.value=t)},this.sliderRow.appendChild(this.progressSlider),this.enterBtn.addEventListener(`click`,()=>{let e=parseInt(this.morphInput.value,10);isNaN(e)||(this.morphToTarget(e),this.controlsCreated||=(this.createControlUI(),!0))})}addMorphData(e,t,n=this.userData.chaosUniforms){let{targetPosAttr:r,targetColorAttr:i,targetSizeIsGridAttr:a,targetNormalAttr:o,targetSkinIndexAttr:s,targetSkinWeightAttr:c,targetSkeleton:l,targetBindMatrix:u,targetBindMatrixInverse:d}=t,f=this.points.geometry.morphData??[];this.morphData||={};let p={name:e,targetUniforms:n,targetPosAttr:r,targetColorAttr:i,targetSizeIsGridAttr:a,targetNormalAttr:o,targetSkinIndexAttr:s,targetSkinWeightAttr:c,targetSkeleton:l,targetBindMatrix:u,targetBindMatrixInverse:d},m=f.findIndex(t=>t.name===e);m===-1?f.push(p):f[m]=p,this.points.geometry.morphData=f,this.morphData[e]=p}_getMorphData(e){return typeof e==`string`?this.morphData[e]:this.points.geometry.morphData[e]}_setMorphTargetData(t){let n=this._getMorphData(t);if(!n){console.error(`Morph target ${t} not found`);return}let r=this.points.geometry;r.setAttribute(`aTargetPos`,n.targetPosAttr),r.setAttribute(`aTargetColor`,n.targetColorAttr),r.setAttribute(`aTargetNormal`,n.targetNormalAttr),r.setAttribute(`aTargetSizeIsGrid`,n.targetSizeIsGridAttr),n.targetSkinIndexAttr&&r.setAttribute(`skinIndex`,n.targetSkinIndexAttr),n.targetSkinWeightAttr&&r.setAttribute(`aTargetSkinWeight`,n.targetSkinWeightAttr),n.targetSkeleton?(this.points.skeleton=n.targetSkeleton,this.points.bindMatrix=n.targetBindMatrix||new e.Matrix4,this.points.bindMatrixInverse=n.targetBindMatrixInverse||new e.Matrix4,this.points.isSkinnedMesh=!0):this.points.isSkinnedMesh=!1,r.attributes.aTargetPos.needsUpdate=!0,r.attributes.aTargetColor.needsUpdate=!0,r.attributes.aTargetNormal.needsUpdate=!0,r.attributes.aTargetSizeIsGrid.needsUpdate=!0,r.attributes.aTargetSkinWeight&&(r.attributes.aTargetSkinWeight.needsUpdate=!0),r.attributes.aTargetSkinWeight&&(r.attributes.aTargetSkinWeight.needsUpdate=!0)}_syncRestingState(t){let n=this._getMorphData(t);if(!n)return;let r=this.points.geometry,i=this.material;if(r.setAttribute(`aStartPos`,n.targetPosAttr),r.setAttribute(`position`,n.targetPosAttr),r.setAttribute(`aStartColor`,n.targetColorAttr),r.setAttribute(`aStartNormal`,n.targetNormalAttr),r.setAttribute(`aStartSizeIsGrid`,n.targetSizeIsGridAttr),n.targetSkinWeightAttr&&r.setAttribute(`aStartSkinWeight`,n.targetSkinWeightAttr),r.attributes.aStartPos.needsUpdate=!0,r.attributes.position.needsUpdate=!0,r.attributes.aStartColor.needsUpdate=!0,r.attributes.aStartNormal.needsUpdate=!0,r.attributes.aStartSizeIsGrid.needsUpdate=!0,r.attributes.aStartSkinWeight&&(r.attributes.aStartSkinWeight.needsUpdate=!0),n.targetSkinIndexAttr&&r.setAttribute(`skinIndex`,n.targetSkinIndexAttr),n.targetSkeleton?(this.points.skeleton=n.targetSkeleton,this.points.bindMatrix=n.targetBindMatrix||new e.Matrix4,this.points.bindMatrixInverse=n.targetBindMatrixInverse||new e.Matrix4,this.points.isSkinnedMesh=!0):this.points.isSkinnedMesh=!1,n.targetUniforms){for(let e in n.targetUniforms)if(!(e===`uResolution`||e===`uPixelRatio`||e===`uFOV`||e===`uProjectionMultiplier`||e===`uRippleColor`||e===`iTime`||e.startsWith(`uPulse`)||e===`uActivePulseCount`||e===`uTitleMaskRectBase`||e===`uTitleMaskScale`||e===`uTitleMaskEdgeJitter`||e.startsWith(`uKnowhere`))&&i.uniforms[e]){let t=i.uniforms[e].value,r=n.targetUniforms[e].value;typeof t==`object`&&t.copy?t.copy(r):i.uniforms[e].value=r}}i.uniforms.uProgress.value=0,t===0||t===1||t===2?(this.material.uniforms.uIsChaos.value=1,this.material.uniforms.uIsArmatureState.value=0,this.material.uniforms.uGlobalHoverStrength.value=0,t===0&&(this.material.uniforms.uSizeThreshold&&(this.material.uniforms.uSizeThreshold.value=.05),this.material.uniforms.uModelPointCount)):this.material.uniforms.uIsChaos.value=0,this.points.geometry.morphCurrentIndex=t,this._updateCachedCounts()}morphToTarget(t,n=rl,r=.1,i=null,a=null){this.tooltip&&this.tooltip.hide();let o=this.points.geometry.morphCurrentIndex||0;if(!this.morphTween&&o===t){this._syncRestingState(t),i&&i();return}let s=!1;if(this.morphTween){if(t===this.morphOriginIndex){if(this.isReversing)return;this.morphTween.stop(),this.isReversing=!0,console.log(`[Points] Morph INTERRUPT: Case A (Reversing ${this.morphOriginIndex} <-> ${this.morphRequestedTarget})`);let e=n*this.material.uniforms.uProgress.value;this.morphTween=new v.Tween(this.tweenProxy).to({t:0},e).easing(v.Easing.Cubic.Out).onUpdate(()=>{let e=this.tweenProxy.t;if(this.activePropsToTween)for(let t of this.activePropsToTween)t.type===`number`?t.uniform.value=t.start+(t.target-t.start)*e:t.uniform.copy(t.start).lerp(t.target,e);this.material.uniforms.uProgress.value=e,document.documentElement.style.setProperty(`--morph-progress`,`${Math.min(100,e*100)}%`),a&&a(e)}).onComplete(()=>{this.isReversing=!1,this.morphTween=null,this._syncRestingState(this.morphOriginIndex),i&&i()}).start();return}if(t===this.morphRequestedTarget){if(!this.isReversing)return;this.morphTween.stop(),this.isReversing=!1,console.log(`[Points] Morph INTERRUPT: Case B (Resuming -> ${this.morphRequestedTarget})`);let e=n*(1-this.material.uniforms.uProgress.value);this._setMorphTargetData(t),this.morphTween=new v.Tween(this.tweenProxy).to({t:1},e).easing(v.Easing.Cubic.Out).onUpdate(e=>{let t=e.t;if(this.activePropsToTween)for(let e of this.activePropsToTween)e.type===`number`?e.uniform.value=e.start+(e.target-e.start)*t:e.uniform.copy(e.start).lerp(e.target,t);this.material.uniforms.uProgress.value=t,document.documentElement.style.setProperty(`--morph-progress`,`${Math.min(100,t*100)}%`),a&&a(t)}).onComplete(()=>{this.morphTween=null,this._syncRestingState(t),i&&i()}).start();return}if(t===1||t===2)console.log(`[Points] Morph INTERRUPT: Case C (Pivot -> Root ${t})`),this._bakeMidFlightState(),this.morphTween.stop(),this.morphTween=null,s=!0;else return}if(this.morphOriginIndex=o,this.morphRequestedTarget=t,this.isReversing=!1,s||this._syncRestingState(o),this.points.isSkinnedMesh){let t=this.points.geometry.attributes.position.clone();this._bakeCurrentTransforms(t),this.points.geometry.setAttribute(`aStartPos`,t),this.points.geometry.setAttribute(`position`,t);let n=new e.BufferAttribute(new Float32Array(t.count*4),4);this.points.geometry.setAttribute(`aStartSkinWeight`,n)}this._setMorphTargetData(t),this._updateCachedCounts();let c=this._getMorphData(t);if(c&&c.targetUniforms){let e=[];for(let t in c.targetUniforms)if(!(t===`uResolution`||t===`uPixelRatio`||t===`uFOV`||t===`uProjectionMultiplier`||t===`uRippleColor`||t===`iTime`||t.startsWith(`uPulse`)||t===`uActivePulseCount`||t===`uTitleMaskRectBase`||t===`uTitleMaskScale`||t===`uTitleMaskEdgeJitter`||t.startsWith(`uKnowhere`))&&this.material.uniforms[t]){let n=this.material.uniforms[t],r=c.targetUniforms[t].value;typeof r==`number`?e.push({type:`number`,uniform:n,start:n.value,target:r}):r&&(r.isVector2||r.isVector3||r.isColor)&&e.push({type:`vector`,uniform:n.value,start:n.value.clone(),target:r})}this.activePropsToTween=e,this.tweenProxy={t:0};let o=this.points.geometry.morphCurrentIndex||0,s=(o===1||o===2)&&t===3,l=null;this.morphTween=new v.Tween(this.tweenProxy).to({t:1},n).easing(v.Easing.Cubic.Out).onStart(()=>{l=performance.now(),this.material.uniforms.uMorphStagger.value=r}).onUpdate(()=>{let t=this.tweenProxy.t;for(let n of e)n.type===`number`?n.uniform.value=n.start+(n.target-n.start)*t:n.uniform.copy(n.start).lerp(n.target,t);this.material.uniforms.uProgress.value=t;let r=t*100;if(s&&l){let e=performance.now()-l;r=Math.min(.99,e/n)*100}document.documentElement.style.setProperty(`--morph-progress`,`${Math.min(100,r)}%`),a&&a(t)}).onComplete(()=>{this.morphTween=null,document.documentElement.style.setProperty(`--morph-progress`,`100%`),this._syncRestingState(t),i&&i()}).start(),this.points&&this.points.geometry&&(this.points.geometry.morphTargetIndex=t)}}interruptMorph(e=!1){if(this.morphTween&&=(this.morphTween.stop(),null),this.activeUniformTweens&&=(this.activeUniformTweens.forEach(e=>e.stop()),[]),e){let e=v.Easing.Quadratic.Out,t=this.points.geometry.morphCurrentIndex||0,n=this._getMorphData(t);if(n&&n.targetUniforms){for(let t in n.targetUniforms)if(!(t===`uResolution`||t===`uPixelRatio`||t===`uFOV`||t===`uProjectionMultiplier`||t===`uRippleColor`||t===`iTime`||t.startsWith(`uPulse`)||t===`uActivePulseCount`||t===`uTitleMaskRectBase`||t===`uTitleMaskScale`||t===`uTitleMaskEdgeJitter`||t.startsWith(`uKnowhere`))&&this.material.uniforms[t]){let r=this.material.uniforms[t],i=n.targetUniforms[t].value;typeof i==`number`?new v.Tween(r).to({value:i},500).easing(e).start():i&&(i.isVector2||i.isVector3||i.isColor)&&new v.Tween(r.value).to(i,500).easing(e).start()}}new v.Tween(this.material.uniforms.uProgress).to({value:0},500).easing(e).onComplete(()=>{this.material.uniforms.uProgress.value=0}).start()}}_bakeMidFlightState(){if(!this.points||!this.material)return;let t=this.points.geometry,n=this.material,r=n.uniforms.uProgress.value,i=(e,t,n)=>e+(t-e)*n,a=(n,a)=>{let o=t.attributes[n],s=t.attributes[a];if(!o||!s)return;let c=o.itemSize,l=o.count,u=new Float32Array(l*c);for(let e=0;e<l*c;e++)u[e]=i(o.array[e],s.array[e],r);t.setAttribute(n,new e.BufferAttribute(u,c)),t.attributes[n].needsUpdate=!0};a(`aStartPos`,`aTargetPos`),a(`aStartColor`,`aTargetColor`),a(`aStartNormal`,`aTargetNormal`),a(`aStartSizeIsGrid`,`aTargetSizeIsGrid`),t.setAttribute(`position`,t.attributes.aStartPos),t.attributes.position.needsUpdate=!0,n.uniforms.uProgress.value=0,this.tweenProxy&&(this.tweenProxy.t=0)}_bakeCurrentTransforms(t){let n=this.points.geometry,r=n.attributes.position,i=n.attributes.skinIndex,a=n.attributes.aStartSkinWeight||n.attributes.aTargetSkinWeight;if(!this.points.isSkinnedMesh||!i||!a){for(let e=0;e<r.count;e++)t.setXYZ(e,r.getX(e),r.getY(e),r.getZ(e));t.needsUpdate=!0;return}let o=this.points.skeleton;o&&o.update();let s=new e.Vector3,c=this.points.bindMatrix,l=this.points.bindMatrixInverse,u=new e.Matrix4,d=new e.Vector4,f=new e.Vector4,p=new e.Vector4;for(let e=0;e<r.count;e++){s.fromBufferAttribute(r,e),d.set(s.x,s.y,s.z,1).applyMatrix4(c),f.set(0,0,0,0);for(let t=0;t<4;t++){let n=a.getComponent(e,t);if(n>1e-4){let r=i.getComponent(e,t);u.fromArray(o.boneMatrices,r*16),p.copy(d).applyMatrix4(u).multiplyScalar(n),f.add(p)}}d.copy(f).applyMatrix4(l),t.setXYZ(e,d.x,d.y,d.z)}t.needsUpdate=!0}playAnimation(t,n=.5,r=!0,i=1,a=null){if(!this.mixer){console.warn(`[Points] playAnimation aborted: No Mixer`);return}if(!this.scene.pointsClips){console.warn(`[Points] playAnimation aborted: No scene.pointsClips`);return}let o=e.AnimationClip.findByName(this.scene.pointsClips,t);if(!o)return;let s=this.mixer.clipAction(o);if(this.pointsActiveAction&&this.pointsActiveAction!==s&&this.pointsActiveAction.fadeOut(n),s.reset(),s.setEffectiveWeight(1),i<0&&(s.time=o.duration,s.paused=!1),r===`pingpong`?(s.setLoop(e.LoopPingPong,2),s.clampWhenFinished=!0):r?s.setLoop(e.LoopRepeat):(s.setLoop(e.LoopOnce),s.clampWhenFinished=!0),s.timeScale=i,s.fadeIn(n),s.play(),a){let e=t=>{t.action===s&&(this.mixer.removeEventListener(`finished`,e),a())};this.mixer.addEventListener(`finished`,e)}this.pointsActiveAction=s}playNextDance(){if(!this.scene||!this.scene.pointsClips)return;let e=this.scene.pointsClips.filter(e=>{let t=e.name.toLowerCase();return t===`robotdance`||t===`gangnam`||t===`waving`||t===`wave`||t===`breakdance`});if(e.length===0)return;this._currentDanceIdx===void 0?this._currentDanceIdx=0:this._currentDanceIdx=(this._currentDanceIdx+1)%e.length;let t=e[this._currentDanceIdx];this.playAnimation(t.name,.8,!1,1,()=>{this.playNextDance()}),this.triggerScalePulse()}triggerScalePulse(){if(!this.material||!this.material.uniforms.uModelScale)return;this._clickScaleTween&&this._clickScaleTween.stop();let e=this.material.uniforms.uModelScale,t=(this.getCurrentStep?this.getCurrentStep():0)===2?.225:e.value,n=t*1.08;this._clickScaleTween=new v.Tween(e).to({value:n},100).easing(v.Easing.Quadratic.Out).yoyo(!0).repeat(1).onComplete(()=>{e.value=t,this._clickScaleTween=null}).start()}stopAnimations(e=.5){!this.mixer||!this.pointsActiveAction||(this.pointsActiveAction.fadeOut(e),this.pointsActiveAction=null)}async loadModel(){if(V.pointsModel){let t=V.pointsModel;this.model=O.clone(t.scene),t.pointsClips&&t.pointsClips.length>0?this.scene.pointsClips||(this.scene.pointsClips=t.pointsClips):t.animations&&(this.scene.pointsClips=t.animations),t.animations&&t.animations.length>0&&(this.mixer=new e.AnimationMixer(this.model)),await this._addMorphDataByModelName(ve.ROOT,!0,{uModelScale:{value:4.4},uSizeThreshold:{value:.05},uVibrateBoostSizeThreshold:{value:.3},uIsChaos:{value:1},uModelScreenOffset:{value:new e.Vector2(.4,0)},uModelVibFactor:{value:4},uIsArmatureState:{value:0},uAttractionForce:{value:0},uAttractionRefSize:{value:.5},uLightSizeBoost:{value:2.5},uGlobalHoverStrength:{value:0},uHoveredTextureIndex:{value:0},uVibrateAmp:{value:.15},uHoverPointScaleFactor:{value:1.1},uDipperBrightnessScalar:{value:2}}),await this._addMorphDataByModelName(ve.ROOT_DEV,!0,{uModelScale:{value:4.4},uSizeThreshold:{value:.05},uVibrateBoostSizeThreshold:{value:.3},uIsChaos:{value:1},uModelScreenOffset:{value:new e.Vector2(.4,0)},uModelVibFactor:{value:4},uIsArmatureState:{value:0},uAttractionForce:{value:0},uAttractionRefSize:{value:.5},uLightSizeBoost:{value:2.5},uGlobalHoverStrength:{value:0},uHoveredTextureIndex:{value:0},uVibrateAmp:{value:.15},uHoverPointScaleFactor:{value:1.1},uDipperBrightnessScalar:{value:2}}),await this._addMorphDataByModelName(ve.CHAR,!1,{uModelScale:{value:.25},uModelRotation:{value:new e.Vector3(Math.PI/2,-1.15,0)},uIsChaos:{value:0},uModelScreenOffset:{value:new e.Vector2(.25,-.8)},uEnableMouseRotation:{value:!1},uModelPointSizeFactor:{value:1.2},uIsArmatureState:{value:1},uAttractionForce:{value:60},uAttractionRefSize:{value:.55},uAttractionRadius:{value:500},uLightSizeBoost:{value:.5},uModelVibFactor:{value:3},uSizeThreshold:{value:.01},uHoverPointScaleFactor:{value:1},uKnowhereGravityHoverFactor:{value:0}}),qe(`points-init`,1);return}else console.error(`Hero Model not found in resources!`)}async createBackgroundParticles(){this.pointCap;let t=0;this.material=new e.ShaderMaterial({uniforms:this.shaderUniforms,vertexShader:Gc,fragmentShader:Kc,transparent:!0,depthWrite:!1,skinning:!0,extensions:{derivatives:!0}});let n=this.pointCap,r=new Float32Array(n*3),i=new Float32Array(n*3),a=new Float32Array(n*2),o=new Float32Array(n*2),s=new Float32Array(n*3),c=new Float32Array(n*3),l=new Float32Array(n),u=new Float32Array(n*2),d=Math.ceil(Math.sqrt(n))||1,f=new e.Vector3(cl.x,cl.y,cl.z),p=new e.Vector3(0,0,0),m=new e.Vector3().subVectors(p,f).normalize(),h=new e.Vector3().crossVectors(m,new e.Vector3(0,1,0)).normalize(),g=new e.Vector3().crossVectors(h,m).normalize(),_=m.clone().multiplyScalar(-fl),v=new e.Vector3,y=new e.Color(`#ffffff`),b=performance.now();for(let e=0;e<n;e++){if(performance.now()-b>8){await this.yieldToBrowser(),b=performance.now();let r=e/n*.8;r-t>.05&&(qe(`points-init`,r),t=r)}l[e]=Math.random(),r[e*3+0]=(Math.random()*2-1)*il,r[e*3+1]=(Math.random()*2-1)*il,r[e*3+2]=(Math.random()*2-1)*il;let f=e%d,p=Math.floor(e/d);u[e*2+0]=f,u[e*2+1]=p;let m=(f-d/2)*pl,x=(p-d/2)*pl;v.copy(_).addScaledVector(h,m).addScaledVector(g,x),i[e*3+0]=v.x,i[e*3+1]=v.y,i[e*3+2]=v.z,a[e*2+0]=al,a[e*2+1]=1,o[e*2+0]=al,o[e*2+1]=1,s[e*3+0]=y.r,s[e*3+1]=y.g,s[e*3+2]=y.b,c[e*3+0]=y.r,c[e*3+1]=y.g,c[e*3+2]=y.b}let x=new Float32Array(n*4);for(let e=0;e<n;e++)x[e*4+0]=e,x[e*4+1]=0,x[e*4+2]=0,x[e*4+3]=0;let S=n-Sl.length;Sl.forEach((e,t)=>{let n=S+t,i=El[t];r[n*3+0]=i.pos.x,r[n*3+1]=i.pos.y,r[n*3+2]=i.pos.z;let a=1;(t===2||t===7)&&(a=.2),s[n*3+0]=a,s[n*3+1]=a,s[n*3+2]=a,c[n*3+0]=a,c[n*3+1]=a,c[n*3+2]=a;let o=(e.textureSlotRow||0)*8+(e.textureSlotCol||0),l=e.useDipperColor?1:0;x[n*4+1]=1,x[n*4+2]=e.brightnessFactor||1,x[n*4+3]=o*2+l}),this._dipperBaseIndex=S;let C=new e.BufferGeometry,w=new e.Float32BufferAttribute(r,3),T=new e.Float32BufferAttribute(i,3);C.setAttribute(`position`,w),C.setAttribute(`aTargetPos`,T);let E=new e.Float32BufferAttribute(a,2),D=new e.Float32BufferAttribute(o,2);C.setAttribute(`aStartSizeIsGrid`,E),C.setAttribute(`aTargetSizeIsGrid`,D);let O=new e.Float32BufferAttribute(s,3),k=new e.Float32BufferAttribute(c,3);C.setAttribute(`aStartColor`,O),C.setAttribute(`aTargetColor`,k);let A=new Float32Array(n*3).fill(0),ee=new Float32Array(n*3).fill(0),te=new e.Float32BufferAttribute(A,3),j=new e.Float32BufferAttribute(ee,3);C.setAttribute(`aStartNormal`,te),C.setAttribute(`aTargetNormal`,j),C.setAttribute(`aStableRandom`,new e.Float32BufferAttribute(l,1)),C.setAttribute(`aSpatialGridIndex`,new e.Float32BufferAttribute(u,2)),C.setAttribute(`aPointData`,new e.Float32BufferAttribute(x,4)),B.markEnd(`parse_binary_headers`),B.markStart(`hydrate_particles`);let M=C.attributes.position.count;if(B.markStart(`regen_attributes`),!C.attributes.aTargetPos){let t=new Float32Array(M*3),n=Math.ceil(Math.sqrt(M)),r=pl,i=fl,a=new e.Vector3(cl.x,cl.y,cl.z),o=new e.Vector3(0,0,0),s=new e.Vector3().subVectors(o,a).normalize(),c=new e.Vector3().crossVectors(s,new e.Vector3(0,1,0)).normalize(),l=new e.Vector3().crossVectors(c,s).normalize(),u=s.clone().multiplyScalar(-i),d=new e.Vector3;for(let e=0;e<M;e++){let i=e%n,a=Math.floor(e/n),o=(i-n/2)*r,s=(a-n/2)*r;d.copy(u).addScaledVector(c,o).addScaledVector(l,s),t[e*3+0]=d.x,t[e*3+1]=d.y,t[e*3+2]=d.z}C.setAttribute(`aTargetPos`,new e.BufferAttribute(t,3))}if(!C.attributes.aStartColor){let t=new Uint8Array(M*3).fill(255);if(this.shaderUniforms&&this.shaderUniforms.uGridSide){let e=Math.ceil(Math.sqrt(M));Sl.forEach((n,r)=>{let i=n.row*e+n.col;if(i<M){let e=n.brightnessFactor||1,r=Math.min(255,Math.floor(e*255));t[i*3+0]=r,t[i*3+1]=r,t[i*3+2]=r}})}C.setAttribute(`aStartColor`,new e.BufferAttribute(t,3,!0))}if(!C.attributes.aTargetColor){let t=new Uint8Array(M*3).fill(255);if(this.shaderUniforms&&this.shaderUniforms.uGridSide){let e=Math.ceil(Math.sqrt(M));Sl.forEach((n,r)=>{let i=n.row*e+n.col;if(i<M){let e=255;(r===2||r===7)&&(e=51),t[i*3+0]=e,t[i*3+1]=e,t[i*3+2]=e}})}C.setAttribute(`aTargetColor`,new e.BufferAttribute(t,3,!0))}if(!C.attributes.aStartNormal){let t=new Int8Array(M*3).fill(0);C.setAttribute(`aStartNormal`,new e.BufferAttribute(t,3,!0))}if(!C.attributes.aTargetNormal){let t=new Int8Array(M*3).fill(0);C.setAttribute(`aTargetNormal`,new e.BufferAttribute(t,3,!0))}if(!C.attributes.aStartSizeIsGrid){let t=new Float32Array(M*2);for(let e=0;e<M;e++)t[e*2+0]=al,t[e*2+1]=1;C.setAttribute(`aStartSizeIsGrid`,new e.BufferAttribute(t,2))}if(!C.attributes.aTargetSizeIsGrid){let t=new Float32Array(M*2);for(let e=0;e<M;e++)t[e*2+0]=al,t[e*2+1]=1;C.setAttribute(`aTargetSizeIsGrid`,new e.BufferAttribute(t,2))}C.attributes.aStartSkinWeight||C.setAttribute(`aStartSkinWeight`,new e.BufferAttribute(new Float32Array(M*4),4)),C.attributes.aTargetSkinWeight||C.setAttribute(`aTargetSkinWeight`,new e.BufferAttribute(new Float32Array(M*4),4)),C.attributes.skinIndex||C.setAttribute(`skinIndex`,new e.BufferAttribute(new Uint16Array(M*4),4)),B.markEnd(`regen_attributes`);let ne=new Float32Array(n*4).fill(0);B.logTable();let N=new Float32Array(n*4).fill(0),re=new Uint16Array(n*4).fill(0),ie=new e.Float32BufferAttribute(ne,4),ae=new e.Float32BufferAttribute(N,4),oe=new e.Uint16BufferAttribute(re,4);C.setAttribute(`aStartSkinWeight`,ie),C.setAttribute(`aTargetSkinWeight`,ae),C.setAttribute(`skinIndex`,oe),this.points=new e.Points(C,this.material),B.logTable(),this.points.frustumCulled=!1,C.boundingSphere=new e.Sphere(new e.Vector3(0,0,0),5e3),this.points.name=`PointsCloud`,this.points.parentInstance=this,this.points.visible=!1,this.scene.add(this.points);let se={targetPosAttr:w,targetColorAttr:O,targetSizeIsGridAttr:E,targetNormalAttr:te,targetSkinIndexAttr:oe,targetSkinWeightAttr:ae};this.addMorphData(`chaos`,se,this.userData.chaosUniforms),qe(`points-init`,.9),this._updateCachedCounts()}async _addMorphDataByModelName(t,n=!1,r={}){let i=e.UniformsUtils.clone(this.userData.chaosUniforms);for(let e in r)i[e]&&(i[e].value=r[e].value);let a=this.model.getObjectByName(t);if(!a){console.warn(`[Points] _addMorphDataByModelName: Model object '${t}' not found in GLTF.`);return}let o=[];a.traverse(e=>{e.isMesh&&(e.updateMatrixWorld(!0),o.push(e))});let s=this.pointCap,c=this._getMorphData(0),l=new Float32Array(c.targetPosAttr.array),u=new Float32Array(c.targetSizeIsGridAttr.array),d=new Float32Array(c.targetNormalAttr.array),f=c.targetColorAttr.array,p=new Float32Array(f.length),m=f instanceof Uint8Array||f instanceof Uint8ClampedArray,h=performance.now();for(let e=0;e<f.length;e++)e%1e4==0&&performance.now()-h>4&&(await this.yieldToBrowser(),h=performance.now()),p[e]=m?f[e]/255:f[e];let g=new Float32Array(s*4),_=new Float32Array(s*4),v=null,y=null,b=null,x=0,S=new e.Vector3,C=new e.Vector3,w=new e.Matrix3,T=new e.Color(`#ffffff`);for(let t=0;t<o.length;t++){let n=o[t],r=n.matrixWorld;w.getNormalMatrix(r),n.skeleton&&!v&&(v=n.skeleton,y=n.bindMatrix,b=n.bindMatrixInverse);let i=n.geometry,c=i.attributes.position,f=i.attributes.normal,m=i.attributes.skinIndex,h=i.attributes.skinWeight,T=c.count,E=new e.Vector3(1,1,1),D=1,O=xl.slice().sort((e,t)=>t.name.length-e.name.length),k=null,A=n;for(;A;){let e=A.name.toLowerCase();if(k=O.find(t=>e.includes(t.name.toLowerCase())),k||A===a)break;A=A.parent}k&&(E=k.baseColor,k.brightness&&(D=k.brightness));let ee=performance.now();for(let e=0;e<T&&!(x>=s);e++){performance.now()-ee>8&&(await this.yieldToBrowser(),ee=performance.now()),v?(l[x*3+0]=c.getX(e),l[x*3+1]=c.getY(e),l[x*3+2]=c.getZ(e)):(S.set(c.getX(e),c.getY(e),c.getZ(e)),S.applyMatrix4(r),l[x*3+0]=S.x,l[x*3+1]=S.y,l[x*3+2]=S.z),f&&(v?(d[x*3+0]=f.getX(e),d[x*3+1]=f.getY(e),d[x*3+2]=f.getZ(e)):(C.set(f.getX(e),f.getY(e),f.getZ(e)),C.applyMatrix3(w).normalize(),d[x*3+0]=C.x,d[x*3+1]=C.y,d[x*3+2]=C.z)),m&&(g[x*4+0]=m.getX(e),g[x*4+1]=m.getY(e),g[x*4+2]=m.getZ(e),g[x*4+3]=m.getW(e)),h&&(_[x*4+0]=h.getX(e),_[x*4+1]=h.getY(e),_[x*4+2]=h.getZ(e),_[x*4+3]=h.getW(e));let t=k&&k.pointSizeMultiplier!==void 0?k.pointSizeMultiplier:1;u[x*2+0]=(.28+Math.random()**.7*.16)*t,u[x*2+1]=0,p[x*3+0]=E.x*D,p[x*3+1]=E.y*D,p[x*3+2]=E.z*D,x++}}let E=x;if(n){let t=Math.max(0,s-E),n=Math.ceil(Math.sqrt(t))||1;i.uGridSide&&(i.uGridSide.value=n);let r=new e.Vector3(cl.x,cl.y,cl.z),a=new e.Vector3(0,0,0),o=new e.Vector3().subVectors(a,r).normalize(),c=new e.Vector3().crossVectors(o,new e.Vector3(0,1,0)).normalize(),d=new e.Vector3().crossVectors(c,o).normalize(),f=o.clone().multiplyScalar(-fl),m=new Uint8Array(n*n);i.uModelScreenOffset?i.uModelScreenOffset.value:this.material.uniforms.uModelScreenOffset.value;let h=i.uModelPosition?i.uModelPosition.value:this.material.uniforms.uModelPosition.value,x=i.uModelScale?i.uModelScale.value:this.material.uniforms.uModelScale.value,C=i.uModelRotation?i.uModelRotation.value:this.material.uniforms.uModelRotation.value,w=new e.Matrix4().makeRotationX(C.x),D=new e.Matrix4().makeRotationY(C.y),O=new e.Matrix4().makeRotationZ(C.z).clone().multiply(D).multiply(w),k=new e.Vector3,A=Math.ceil(ml*3/pl);this.camera.updateMatrixWorld(),this.camera.updateProjectionMatrix();let ee=v,te=y,j=b,M=new e.Matrix4,ne=new e.Vector4,N=new e.Vector4;for(let e=0;e<E;e++){if(e%500==0&&await this.yieldToBrowser(),S.set(l[e*3+0],l[e*3+1],l[e*3+2]),ee){ne.set(S.x,S.y,S.z,1).applyMatrix4(te),N.set(0,0,0,0);for(let t=0;t<4;t++){let n=_[e*4+t];if(n>1e-4){let r=g[e*4+t];M.fromArray(ee.boneMatrices,r*16),S.copy(ne.xyz).applyMatrix4(M).multiplyScalar(n),N.x+=S.x,N.y+=S.y,N.z+=S.z}}ne.set(N.x,N.y,N.z,1).applyMatrix4(j),S.set(ne.x,ne.y,ne.z)}S.multiplyScalar(x),S.applyMatrix4(O),S.add(h),k.copy(S).project(this.camera),k.unproject(this.camera);let t=k.sub(r).normalize(),i=f.clone().sub(r).dot(o),a=t.dot(o);if(a>1e-4){let e=i/a,o=r.clone().add(t.multiplyScalar(e)).sub(f),s=Math.round(o.dot(c)/pl+n/2),l=Math.round(o.dot(d)/pl+n/2);for(let e=-A;e<=A;e++)for(let t=-A;t<=A;t++){let r=s+e,i=l+t;r>=0&&r<n&&i>=0&&i<n&&e*e+t*t<=A*A&&(m[i*n+r]=1)}}}let re=this._dipperBaseIndex,ie=new Map,ae=new Set;Sl.forEach((e,t)=>{ie.set(re+t,e),ae.add(`${e.row},${e.col}`)});let oe=performance.now();for(let e=E;e<s;e++){performance.now()-oe>16&&(await this.yieldToBrowser(),oe=performance.now());let t=ie.get(e);if(t){let r=t.col,i=t.row,a=(r-n/2)*pl,o=(i-n/2)*pl;S.copy(f).addScaledVector(c,a).addScaledVector(d,o),l[e*3+0]=S.x,l[e*3+1]=S.y,l[e*3+2]=S.z,u[e*2+0]=al*1.2,u[e*2+1]=2;let s=t.brightnessFactor||1;p[e*3+0]=s,p[e*3+1]=s,p[e*3+2]=s}else{let t=e-E,r=t%n,i=Math.floor(t/n),a=(r-n/2)*pl,o=(i-n/2)*pl;if(S.copy(f).addScaledVector(c,a).addScaledVector(d,o),l[e*3+0]=S.x,l[e*3+1]=S.y,l[e*3+2]=S.z,ae.has(`${i},${r}`)||m[i*n+r]===1)u[e*2+0]=0,u[e*2+1]=0;else{let t=!1;for(let e=-2;e<=2;e++){for(let a=-2;a<=2;a++){let o=r+e,s=i+a;if(o>=0&&o<n&&s>=0&&s<n&&m[s*n+o]===1){t=!0;break}}if(t)break}u[e*2+0]=al,u[e*2+1]=t?25:2}p[e*3+0]=T.r,p[e*3+1]=T.g,p[e*3+2]=T.b}}}else{let e=il,n=performance.now(),i=t===ve.CHAR;for(let t=E;t<s;t++){if(performance.now()-n>16&&(await this.yieldToBrowser(),n=performance.now()),i){let e=Math.random()*Math.PI*2,n=Math.acos(Math.random()*2-1),r=Math.random()**.5*1;l[t*3+0]=r*Math.sin(n)*Math.cos(e),l[t*3+1]=r*Math.sin(n)*Math.sin(e),l[t*3+2]=r*Math.cos(n)}else l[t*3+0]=(Math.random()*2-1)*e,l[t*3+1]=(Math.random()*2-1)*e,l[t*3+2]=(Math.random()*2-1)*e;u[t*2+0]=0,u[t*2+1]=0,p[t*3+0]=T.r,p[t*3+1]=T.g,p[t*3+2]=T.b}if(i){let e=Math.ceil(Math.sqrt(s))*pl*.5;r.uDistStaggerFactor={value:1},r.uDistStaggerMax={value:e},r.uMorphStagger={value:.8}}if(t===ve.CHAR&&E>0){let e=this._dipperBaseIndex;[.45,.9,.92,.6,.65,.98,.25,.3].forEach((t,n)=>{let r=Math.floor(E*t),i=e+n;for(let e=0;e<3;e++)l[i*3+e]=l[r*3+e];for(let e=0;e<4;e++)g[i*4+e]=g[r*4+e],_[i*4+e]=_[r*4+e];for(let e=0;e<3;e++)d[i*3+e]=d[r*3+e];u[i*2+0]=1,u[i*2+1]=0;let a=I.ELECTRIC_CYAN,o=a.r*.5+.5,s=a.g*.5+.5,c=a.b*.5+.5,f=4;n===0&&(f=9),(n===1||n===2)&&(f=6);let m=n===0||n===1||n===2?.5:0;p[i*3+0]=(o+m)*f,p[i*3+1]=(s+m)*f,p[i*3+2]=(c+m)*f})}}if(t===`Chaos`||t===`Initial`||t===ve.ROOT){let e=Math.ceil(Math.sqrt(s));Sl.forEach(t=>{let n=t.row*e+t.col;if(n<s){let e=t.brightnessFactor||1;p[n*3+0]=e,p[n*3+1]=e,p[n*3+2]=e}})}let D={targetPosAttr:new e.Float32BufferAttribute(l,3),targetSizeIsGridAttr:new e.Float32BufferAttribute(u,2),targetNormalAttr:new e.Float32BufferAttribute(d,3),targetColorAttr:new e.Float32BufferAttribute(p,3),targetSkinIndexAttr:new e.Float32BufferAttribute(g,4),targetSkinWeightAttr:new e.Float32BufferAttribute(_,4),targetSkeleton:v,targetBindMatrix:y,targetBindMatrixInverse:b};this.addMorphData(t,D,i)}createControlUI(){this.options.enableControls&&Uc({material:this.material,bloomPass:this.bloomPass,TWEEN:v,MORPH_DURATION:rl,DEFAULT_VIBRATE_AMPLITUDE:.25,DEFAULT_SIZE_THRESHOLD:.1,DEFAULT_VIBRATE_BOOST_SIZE_THRESHOLD:1,POINT_SIZE:.03,UI_WIDTH:gl,UI_TOP:_l,UI_RIGHT:vl,speed:this.material.uniforms.uBaseRotateSpeed,hoverEffect:this.material.uniforms.uHoverRadius,mouseDamping:yl,pointReturnSpeed:bl,onStart:()=>{let e=this.material.uniforms.uProgress.value<.5?sl:.1;new v.Tween(this.material.uniforms.uSizeThreshold).to({value:e},rl).easing(lo).start()},onComplete:()=>{}})}onMouseMove(e){let t;t=this.renderer.domElement?this.renderer.domElement.getBoundingClientRect():{left:0,top:0,width:window.innerWidth,height:window.innerHeight};let n=e.clientX,r=e.clientY;this.mouse.x=(n-t.left)/t.width*2-1,this.mouse.y=-((r-t.top)/t.height)*2+1,this._mouseInCanvas=!0,this.rawMouse.set(n,r),this.targetMouse.copy(this.mouse),this.lastMouseMoveTime=performance.now(),this.isFirstMouseMove&&=(this.smoothMouse.copy(this.targetMouse),this.smoothRepulsionMouse.copy(this.targetMouse),!1)}onMouseLeave(e){e&&e.relatedTarget===this.tooltip?.tooltip||(this.targetMouse.set(1e4,1e4),this._mouseInCanvas=!1,this.isFirstMouseMove=!0)}onMouseClick(t){if(t&&t.target!==this.renderer.domElement)return;if(t&&this.renderer.domElement){let e=this.renderer.domElement.getBoundingClientRect();this.mouse.x=(t.clientX-e.left)/e.width*2-1,this.mouse.y=-((t.clientY-e.top)/e.height)*2+1}let n=this.getCurrentStep(),r=this.targetIndex;if(!(n>2&&r>2)){if(this.tooltip&&this.tooltip.lastHoveredIndex!==-1&&n!==2){let t=this.tooltip.lastHoveredIndex;if(t===999999)return;let n=this.points.geometry,r=this.material.uniforms,i=new e.Vector3().fromBufferAttribute(n.attributes.position,t),a=new e.Vector3().fromBufferAttribute(n.attributes.aTargetPos,t),o=r.uProgress.value,s=r.uModelScale.value,c=r.uModelPosition.value,l=r.uModelRotation.value,u=new e.Euler(l.x,l.y,l.z,`XYZ`),d=r.uGridForward.value,f=r.uGridZ.value,p=r.uBaseGridZ.value,m=d.clone().multiplyScalar(p-f),h=n.attributes.aStartSizeIsGrid.array[t*2+1],g=n.attributes.aTargetSizeIsGrid.array[t*2+1],_=r.uMorphStagger.value,v=.5,y=o*(v+_),b=n.attributes.aStableRandom.array[t]*_,x=b+v,S=e.MathUtils.smoothstep(y,b,x);h>.5?i.add(m):i.multiplyScalar(s).applyEuler(u).add(c),g>.5?a.add(m):a.multiplyScalar(s).applyEuler(u).add(c);let C=i.lerp(a,S);C.applyMatrix4(this.points.matrixWorld);let w=r.uModelPointCount.value,T=r.uGridSide.value;if(t>=w){let e=t-w;Math.floor(e/T),e%T}let E=this.currentPulseIndex;r.uPulseCenters.value[E].copy(C),r.uPulseStartTimes.value[E]=r.iTime.value,r.uPulseDisplacementFactors.value[E]=0,this.totalPulsesTriggered===void 0&&(this.totalPulsesTriggered=0),this.totalPulsesTriggered++,r.uActivePulseCount.value=Math.min(hl,this.totalPulsesTriggered),this.currentPulseIndex=(this.currentPulseIndex+1)%hl,r.uPulseactive.value=1}else if(this.raycaster){if(n===2&&!this.isMorphing){this.playNextDance();return}let t=this.material.uniforms,r=t.uModelScreenOffset?t.uModelScreenOffset.value:new e.Vector2(0,0),i=this.mouse.clone().sub(r);this.raycaster.setFromCamera(i,this.camera);let a=null,o=new e.Plane,s=t.uGridForward.value,c=s.clone().negate(),l=t.uBaseGridZ.value,u=l-t.uGridZ.value,d=s.clone().multiplyScalar(-l).clone().add(s.clone().multiplyScalar(u)),f=this.getCurrentStep(),p=this.targetIndex;if(f<=2||p<=2)o.setFromNormalAndCoplanarPoint(c,d);else{let t=new e.Vector3(0,0,1).applyQuaternion(this.camera.quaternion);o.setFromNormalAndCoplanarPoint(t,new e.Vector3(0,0,0))}let m=new e.Vector3;if(this.raycaster.ray.intersectPlane(o,m)&&(a=m),a){let e=this.currentPulseIndex;t.uPulseCenters.value[e].copy(a),t.uPulseStartTimes.value[e]=t.iTime.value,t.uPulseDisplacementFactors.value[e]=0,this.totalPulsesTriggered===void 0&&(this.totalPulsesTriggered=0),this.totalPulsesTriggered++,t.uActivePulseCount.value=Math.min(hl,this.totalPulsesTriggered),this.currentPulseIndex=(this.currentPulseIndex+1)%hl,t.uPulseactive.value=1}}}}onWindowResize(){let t,n;if(this.renderer.domElement){let e=this.renderer.domElement.getBoundingClientRect();t=e.width,n=e.height}else t=this.renderer.domElement.clientWidth,n=this.renderer.domElement.clientHeight;if(this.camera&&(this.camera.aspect=t/n,this.camera.updateProjectionMatrix()),this.renderer&&this.renderer.setSize(t,n),this.composer&&this.composer.setSize(t,n),this.bloomPass&&this.bloomPass.resolution.set(t,n),this._updateTitleMaskBase(),this.material){if(this.material.uniforms.uResolution.value.set(t,n),this.material.uniforms.uPixelRatio.value=this.renderer.getPixelRatio(),this.camera&&this.material.uniforms.uFOV){this.material.uniforms.uFOV.value=this.camera.fov;let t=n/(2*Math.tan(e.MathUtils.degToRad(this.camera.fov)*.5));this.material.uniforms.uProjectionMultiplier&&(this.material.uniforms.uProjectionMultiplier.value=t)}if(this.userData.chaosUniforms&&this.userData.chaosUniforms.uResolution&&(this.userData.chaosUniforms.uResolution.value.set(t,n),this.userData.chaosUniforms.uPixelRatio.value=this.renderer.getPixelRatio(),this.camera)){this.userData.chaosUniforms.uFOV.value=this.camera.fov;let t=n/(2*Math.tan(e.MathUtils.degToRad(this.camera.fov)*.5));this.userData.chaosUniforms.uProjectionMultiplier&&(this.userData.chaosUniforms.uProjectionMultiplier.value=t)}}}_updateTitleMaskBase(){if(!this.material||!this.material.uniforms.uTitleMaskRectBase)return;let e=document.getElementById(`board`);if(!e)return;let t=e.getBoundingClientRect(),n=window.innerHeight/100;if(t.width===0||t.height===0)return;let r=4.5,i=t.width/n+r+-10,a=t.height/n+3+-.75,o=t.left/n-r,s=t.top/n-3,c=o+i/2,l=100-(s+a/2);this.material.uniforms.uTitleMaskRectBase.value.set(c*n,l*n,i/2*n,a/2*n)}update(t=!0,n=!0){if(this.isReady){if(this.controls&&n&&this.controls.update(),this.mixer){let e=this.clock.getDelta(),t=this.getCurrentStep(),n=this.scene&&this.scene.scenarioState&&this.scene.scenarioState.name===`points`;this.scene&&(this.scene.isTransitioning||this.scene.isPersonaActive),this._mixerAccumulatedDelta=(this._mixerAccumulatedDelta||0)+e;let r=this.isMorphing&&this.targetIndex>=2;(t>=2||r)&&n&&(this.mixer.update(this._mixerAccumulatedDelta),this._mixerAccumulatedDelta=0,this.model&&(this.model.scale.setScalar(1),this.model.position.set(0,0,0),this.model.rotation.set(0,0,0),this.model.updateMatrixWorld(!0)))}if(this.getCurrentStep()===2&&this.model){if(this._headBone||this.model.traverse(e=>{e.isBone&&e.name===`mixamorigHead`&&(this._headBone=e)}),this._headBone){let t=new e.Vector3;this._headBone.getWorldPosition(t);let n=this.material.uniforms,r=n.uModelScale.value,i=n.uModelRotation.value,a=n.uModelPosition.value;t.multiplyScalar(r),t.applyEuler(new e.Euler(i.x,i.y,i.z,`XYZ`)),t.add(a);let o=t.project(this.camera);n.uModelScreenOffset&&(o.x+=n.uModelScreenOffset.value.x,o.y+=n.uModelScreenOffset.value.y);let s=(o.x+1)/2,c=(1-o.y)/2;if(n.uBonePos.value.set(s,c),n.uBoneIntensity.value=1,n.uBoneRadius.value=.18,this._boardItems||=document.querySelectorAll(`.board-item`),this._boardItems.length>0){let e=`perspective(1200px) rotateX(${(c-.5)*15}deg) rotateY(${(.5-s)*20}deg)`;this._boardItems.forEach(t=>{t.style.transform=e})}this._boardItems.forEach(e=>{let t=e.getBoundingClientRect(),r=(t.left+t.width/2)/window.innerWidth,i=(t.top+t.height/2)/window.innerHeight,a=Math.abs(s-r);Math.abs(c-i);let o=c<.45;if(a<t.width/window.innerWidth*.7&&o){e.classList.add(`active-wake`);let r=(s-t.left/window.innerWidth)/(t.width/window.innerWidth)*120-20;if(e.style.setProperty(`--shine-pos`,`${r}%`),e.style.setProperty(`--shine-opacity`,`1`),e.id===`board-philo`){let e=n.uResolution.value;n.uStickRect.value.set(t.left,e.y-t.bottom,t.right,e.y-t.top),n.uStickStrength.value=1}}else e.classList.remove(`active-wake`),e.style.setProperty(`--shine-opacity`,`0`),e.id===`board-philo`&&(n.uStickStrength.value=0)})}}else this.material&&this.material.uniforms.uBoneIntensity&&(this.material.uniforms.uBoneIntensity.value*=.9,this._boardItems&&this._boardItems.forEach(e=>{e.classList.remove(`active-wake`),e.style.setProperty(`--shine-opacity`,`0`),e.style.transform=`perspective(1200px) rotateX(0deg) rotateY(0deg)`}),this.material&&this.material.uniforms.uStickStrength&&(this.material.uniforms.uStickStrength.value=0));if(this.material){let e=this.clock.getElapsedTime();this.material.uniforms.iTime.value=e}if(this.dipperLines&&this.material){let e=this.material.uniforms.uProgress.value,t=this.material.uniforms.iTime.value,r=this.scene?.HUD?.isOpen===!0,i=this.points.geometry,a=i.morphCurrentIndex||0,o=i.morphTargetIndex,s=this.isMorphing,c=0;s?a===0?c=1-e:o===0&&(c=e):c=a===0?1:0,c=c*c*(3-2*c);let l=Math.min(1,Math.max(0,(t-2.5)*2)),u=0;if(this.tooltip&&this.tooltip.lastHoveredIndex!==-1&&this._dipperPointIndices){let e=this.tooltip.lastHoveredIndex,t=this._dipperPointIndices.has(e),n=e-this._dipperBaseIndex;t&&n>=0&&n<=6&&(u=1)}this._dipperHoverSmoothed=this._dipperHoverSmoothed||0,this._dipperHoverSmoothed+=(u-this._dipperHoverSmoothed)*.15;let d=this.dipperLines.userData,f=d.opacity*(r?1:0),p=this._dipperHoverSmoothed,m=Math.max(f,p)*c*l;if(this.dipperLines.material.uniforms.uOpacity.value=m,this.dipperLines.material.uniforms.uDrawProgress.value=Math.max(d.drawProgress,this._dipperHoverSmoothed),this.dipperLines.material.uniforms.uTime.value=t,this.material&&this.raycaster&&this.camera&&this.intersectionPlane){let e=this.scene&&(this.scene.isPersonaActive||this.scene.isTransitioning);this.smoothMouse.x+=(this.mouse.x-this.smoothMouse.x)*yl.value,this.smoothMouse.y+=(this.mouse.y-this.smoothMouse.y)*yl.value,this.smoothRepulsionMouse.x+=(this.mouse.x-this.smoothRepulsionMouse.x)*bl.value,this.smoothRepulsionMouse.y+=(this.mouse.y-this.smoothRepulsionMouse.y)*bl.value,this.raycaster.setFromCamera(this.smoothMouse,this.camera),this._perfSkipCounter=(this._perfSkipCounter||0)+1;let t=this._perfSkipCounter%3==0,r=this.points.geometry.morphCurrentIndex||0;e&&(this.tooltip&&this.tooltip.hide(),this.material&&this.material.uniforms.uHoveredIndex&&(this.material.uniforms.uHoveredIndex.value=-1));let i=r===0||r===1||r===2,a=this.scene&&this.scene.scenarioState&&this.scene.scenarioState.name===`points`,o=i&&a&&!e;if(this.tooltip&&(!this.isMorphing&&o&&n&&this._mouseInCanvas&&!this._raycastBlockedByOverlay?(this._tooltipFrameCount=(this._tooltipFrameCount||0)+1,this._tooltipFrameCount%3==0&&(this.tooltip.update(this.raycaster,this.points,this.material,this.smoothMouse,this.rawMouse,this.camera,this.renderer),this.tooltip.lastHoveredIndex===-1?this.material.uniforms.uHoveredIndex.value=-1:(this.points.geometry.lastClosestIndex=this.tooltip.lastHoveredIndex,this.material.uniforms.uHoveredIndex.value=this.tooltip.lastHoveredIndex))):(this.tooltip.hide(),this._tooltipFrameCount=0,this.material&&this.material.uniforms.uHoveredIndex&&(this.material.uniforms.uHoveredIndex.value=-1))),(r===1||r===2)&&this.material.uniforms.uGlobalHoverStrength&&t){let e=this.tooltip&&this.tooltip.lastHoveredIndex!==-1&&this.tooltip.lastHoveredIndex!==999999,t=0;if(e){if(this.hoverStartTime||=performance.now(),performance.now()-this.hoverStartTime>100){t=1;let e=this.tooltip.lastHoveredIndex;if(this._dipperPointIndices&&this._dipperPointIndices.has(e)){let t=e-this._dipperBaseIndex,n=this.bigDipper[t];if(n){let e=(n.textureSlotRow||0)*8+(n.textureSlotCol||0);this.material.uniforms.uHoveredTextureIndex.value=e}}else{let t=this.points.geometry.attributes.aStableRandom.array[e],n=this.material.uniforms.iTime.value,r=1-this.material.uniforms.uIsChaos.value,i=6+(this.points.geometry.attributes.aStartSizeIsGrid.array[e*2+1]>.5?1:0)*r*4,a=n+t*10,o=a%i>i-.75?1:0,s=Math.floor(n*13.33+t)*o,c=Math.floor(a/i)*13,l=Math.floor(t*32+s+c)%32;this.material.uniforms.uHoveredTextureIndex.value=l}}}else this.hoverStartTime=null;this.material.uniforms.uGlobalHoverStrength.value+=(t-this.material.uniforms.uGlobalHoverStrength.value)*.1}let s=this.raycaster.intersectObject(this.intersectionPlane);if(s.length>0&&t&&this.material.uniforms.uMousePos.value.copy(s[0].point),this.material.uniforms.uMouseNDC&&this.material.uniforms.uMouseNDC.value.copy(this.smoothRepulsionMouse),this.material.uniforms.uMouseScreen){let e=this.material.uniforms.uResolution.value;this.material.uniforms.uMouseScreen.value.set((this.smoothMouse.x*.5+.5)*e.x,(this.smoothMouse.y*.5+.5)*e.y)}if(!this.isMorphing&&this.material.uniforms.uModelRotation&&this.material.uniforms.uEnableMouseRotation?.value){let e=this.smoothMouse.x*-.24;this.material.uniforms.uModelRotation.value.y+=(e-this.material.uniforms.uModelRotation.value.y)*.08}if(t&&this.model&&r>=1&&n){let e=this.raycaster.intersectObject(this.model,!0).length>0,t=this._getMorphData(r),n=this.forceDisableAttraction?0:t?.targetUniforms?.uAttractionForce?.value||0,i=this.material.uniforms.uAttractionForce.value;this.material.uniforms.uAttractionForce.value+=((e?0:n)-i)*.1,this._mouseWasOverModel=e}}}n&&this.composer&&this.composer.render()}}bake(){if(!this.points||!this.points.geometry){console.error(`No geometry to bake!`);return}let e=this.points.geometry,t={},n=[],r=0,i=[`aTargetPos`,`aStartNormal`,`aTargetNormal`,`aStartColor`,`aTargetColor`,`aStartSizeIsGrid`,`aTargetSizeIsGrid`];for(let a in e.attributes){if(i.includes(a))continue;let o=e.attributes[a],s=o.array;t[a]={itemSize:o.itemSize,count:o.count,type:s.constructor.name,byteLength:s.byteLength,offset:r},n.push(s),r+=s.byteLength}let a=JSON.stringify(t),o=new TextEncoder().encode(a),s=o.byteLength,c=4+s+r,l=new Uint8Array(c);new DataView(l.buffer).setUint32(0,s,!0),l.set(o,4);let u=4+s;for(let e of n){let t=new Uint8Array(e.buffer,e.byteOffset,e.byteLength);l.set(t,u),u+=e.byteLength}let d=new Blob([l],{type:`application/octet-stream`}),f=document.createElement(`a`);f.href=URL.createObjectURL(d),f.download=`points_data.bin`,f.click()}optimizeAndBake(){if(!this.points||!this.points.geometry)return;let t=this.points.geometry,n={},r=[],i=0,a=(e,t,n=!1)=>{let r;if(t===`Uint8Array`)r=new Uint8Array(e.length);else if(t===`Int8Array`)r=new Int8Array(e.length);else if(t===`Uint16Array`)r=new Uint16Array(e.length);else return e;for(let i=0;i<e.length;i++){let a=e[i];t===`Uint8Array`?a=n?Math.max(0,Math.min(1,a))*255:a:t===`Int8Array`&&n&&(a=Math.max(-1,Math.min(1,a))*127),r[i]=a}return r},o=[`aTargetPos`,`aStartNormal`,`aTargetNormal`,`aStartColor`,`aTargetColor`,`aStartSizeIsGrid`,`aTargetSizeIsGrid`];for(let s in t.attributes){if(o.includes(s))continue;let c=t.attributes[s],l=c.array,u=l.constructor.name,d=!1;if(s.includes(`Color`)||s===`aStableRandom`||s.includes(`SkinW`))l=a(c.array,`Uint8Array`,!0),u=`Uint8Array`,d=!0;else if(s.includes(`Normal`))l=a(c.array,`Int8Array`,!0),u=`Int8Array`,d=!0;else if(s===`aSpatialGridIndex`)l=a(c.array,`Uint8Array`,!1),u=`Uint8Array`,d=!1;else if(s===`aPointData`)l=a(c.array,`Uint16Array`,!1),u=`Uint16Array`,d=!1;else if(s===`position`){let t=c.array,n=new Uint16Array(t.length);for(let r=0;r<t.length;r++)n[r]=e.DataUtils.toHalfFloat(t[r]);l=n,u=`Uint16Array`,d=!1}n[s]={itemSize:c.itemSize,count:c.count,type:u,byteLength:l.byteLength,offset:i,normalized:d},r.push(l),i+=l.byteLength}let s=JSON.stringify(n),c=new TextEncoder().encode(s),l=c.byteLength,u=4+l+i,d=new Uint8Array(u);new DataView(d.buffer).setUint32(0,l,!0),d.set(c,4);let f=4+l;for(let e of r){let t=new Uint8Array(e.buffer,e.byteOffset,e.byteLength);d.set(t,f),f+=e.byteLength}let p=new Blob([d],{type:`application/octet-stream`}),m=document.createElement(`a`);m.href=URL.createObjectURL(p),m.download=`points_data_optimized.bin`,m.click()}_initDipperLines(){let t=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]],n=[],r=[],i=[],a=[],o=0;t.forEach(([s,c],l)=>{let u=El[s].pos,d=El[c].pos,f=new e.Vector3().subVectors(d,u),p=f.length();f.normalize();let m=p*.2,h=new e.Vector3().copy(u).add(f.clone().multiplyScalar(m)),g=new e.Vector3().copy(d).sub(f.clone().multiplyScalar(m)),_=new e.Vector3(cl.x,cl.y,cl.z),v=new e.Vector3().subVectors(h,_).normalize(),y=new e.Vector3().crossVectors(f,v).normalize(),b=.4*.5,x=h.clone().addScaledVector(y,-b),S=h.clone().addScaledVector(y,b),C=g.clone().addScaledVector(y,-b),w=g.clone().addScaledVector(y,b);n.push(x.x,x.y,x.z),n.push(S.x,S.y,S.z),n.push(C.x,C.y,C.z),n.push(w.x,w.y,w.z),i.push(0,0,1,0,0,1,1,1);let T=l/t.length;a.push(T,T,T,T),r.push(o+0,o+1,o+2),r.push(o+2,o+1,o+3),o+=4});let s=new e.BufferGeometry;s.setAttribute(`position`,new e.Float32BufferAttribute(n,3)),s.setAttribute(`uv`,new e.Float32BufferAttribute(i,2)),s.setAttribute(`aStagger`,new e.Float32BufferAttribute(a,1)),s.setIndex(r);let c=new e.ShaderMaterial({vertexShader:qc,fragmentShader:Jc,uniforms:{uTime:{value:0},uOpacity:{value:0},uDrawProgress:{value:0}},transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,side:e.DoubleSide});this.dipperLines=new e.Mesh(s,c),this.dipperLines.frustumCulled=!1,this.dipperLines.userData={opacity:0,drawProgress:0},this.scene.add(this.dipperLines)}getChaosIndex(){return 0}getCurrentStep(){return!this.points||!this.points.geometry?0:this.points.geometry.morphCurrentIndex||0}getRootIndex(){return this._currentPersona===F.DEV?2:1}getCharIndex(){return 3}syncPersona(e,t=!1){if(this._currentPersona=e,this.material&&this.material.uniforms.uRippleColor){let t=xl.find(e=>e.name===`heartDev`),n=xl.find(e=>e.name===`heart`);if(t&&n){let r=e===F.DEV?t.baseColor:n.baseColor;this.material.uniforms.uRippleColor.value.copy(r)}}if(t)return;let n=this.getCurrentStep(),r=this.getRootIndex();(r===1||r===2)&&(window.scene&&window.scene.scenarioState&&window.scene.scenarioState.name===`points`&&typeof this.triggerStep==`function`?(console.log(`[Points] Avatar Switch -> Triggering Scroll Step 1 for ${e.toUpperCase()}`),this.triggerStep(1)):(n!==r||this.isMorphing)&&this.morphToTarget(r))}triggerStarPulse(t){if(!this.points||!this.material||!this.bigDipper[t])return;let n=this._dipperBaseIndex+t,r=this.material.uniforms,i=this.points.geometry,a=r.uProgress.value,o=r.uModelScale.value,s=r.uModelPosition.value,c=r.uModelRotation.value,l=new e.Euler(c.x,c.y,c.z,`XYZ`),u=r.uGridForward.value,d=r.uGridZ.value,f=r.uBaseGridZ.value,p=u.clone().multiplyScalar(f-d),m=new e.Vector3().fromBufferAttribute(i.attributes.position,n),h=new e.Vector3().fromBufferAttribute(i.attributes.aTargetPos,n),g=i.attributes.aStartSizeIsGrid.array[n*2+1],_=i.attributes.aTargetSizeIsGrid.array[n*2+1],v=r.uMorphStagger.value,y=.5,b=a*(y+v),x=i.attributes.aStableRandom.array[n]*v,S=x+y,C=e.MathUtils.smoothstep(b,x,S);g>.5?m.add(p):m.multiplyScalar(o).applyEuler(l).add(s),_>.5?h.add(p):h.multiplyScalar(o).applyEuler(l).add(s);let w=m.clone().lerp(h,C);w.applyMatrix4(this.points.matrixWorld);let T=this.currentPulseIndex;r.uPulseCenters.value[T].copy(w),r.uPulseStartTimes.value[T]=r.iTime.value,r.uPulseDisplacementFactors.value[T]=.5,this.totalPulsesTriggered===void 0&&(this.totalPulsesTriggered=0),this.totalPulsesTriggered++,r.uActivePulseCount.value=Math.min(hl,this.totalPulsesTriggered),this.currentPulseIndex=(this.currentPulseIndex+1)%hl,r.uPulseactive.value=1,r.uHoveredIndex.value=n,this._starHighlightTimeout&&clearTimeout(this._starHighlightTimeout),this._starHighlightTimeout=setTimeout(()=>{r.uHoveredIndex.value===n&&(r.uHoveredIndex.value=-1)},1500)}setConstellationVisibility(e=!0){if(!this.dipperLines)return;this.dipperLines.tween&&this.dipperLines.tween.stop();let t=e?1:0,n=e?1:0,r=e?1500:800,i=e?v.Easing.Cubic.InOut:v.Easing.Cubic.Out;this.dipperLines.tween=new v.Tween(this.dipperLines.userData).to({opacity:t,drawProgress:n},r).easing(i).start()}}}));function kl(e){if(!e.globalUniformsHub||!e.globalUniformsHub.uniforms){console.warn(`GridSystem: Global Uniforms Hub not found`);return}let t=e.globalUniformsHub.uniforms,n={currentTween:null};window.addEventListener(zs.GARDEN.HOVER_START,()=>{t.uWorldGridActive.value=1,n.currentTween&&n.currentTween.stop(),n.currentTween=new v.Tween(t.uWorldGridProgress).to({value:1},1110).easing(v.Easing.Cubic.Out).start()}),window.addEventListener(zs.GARDEN.HOVER_END,()=>{n.currentTween&&n.currentTween.stop(),n.currentTween=new v.Tween(t.uWorldGridProgress).to({value:0},1110).easing(v.Easing.Cubic.In).onComplete(()=>{t.uWorldGridProgress.value<.01&&(t.uWorldGridActive.value=0)}).start()})}var Al=M((()=>{Bs()})),jl,Ml=M((()=>{gs(),ls(),ks(),ea(),jl=class{constructor(t,n=`mixamorigRightHand`){this.scene=t,this.boneName=n,this.element=null,this.targetBone=null,this.isActive=!1,this.originalParent=null,this.originalStyle={},this.originalNextSibling=null,this.scaleReferenceDistance=6,this.manualScaleFactor=1,this.localOffset=new e.Vector3(0,0,0),this.rotationOffset=new e.Euler(0,0,0),this.isTransitioning=!1,this.transitionProgress=0,this.startScreenPos={x:0,y:0},this.droneBeam=null,this.isJittering=!1,this.returnTargetPos={x:0,y:0},this.hasHitThisSwing=!1;let r=document.getElementById(`bone-tracker-test`);r&&r.remove(),this.initTargetElement(`#persona-switch-btn`)}initTargetElement(e){let t=typeof e==`string`?document.querySelector(e):e;if(!t){console.warn(`[BoneTracker] Target element not found.`);return}this.element&&this.isActive&&this.forceReset(),this.element=t,this.originalParent=t.parentElement,this.originalNextSibling=t.nextSibling;let n=t.getBoundingClientRect();this.startScreenPos={x:n.left,y:n.top},this.originalStyle={},[`position`,`top`,`left`,`transform`,`zIndex`,`pointerEvents`,`margin`,`display`,`transition`,`transformOrigin`,`perspective`].forEach(e=>{this.originalStyle[e]=t.style[e]||``})}toggleTracking(e=null){if(!this.element)return!1;if(this.isActive=!this.isActive,this.isActive){this.scene.isHeroAnimating=!0;let t=this.element.getBoundingClientRect();this.startScreenPos={x:t.left,y:t.top},this.transitionProgress=0,this.isTransitioning=!0,this.isBeaming=!1,this.scene.gazeFollower&&(this.scene.gazeFollower.isLocked=!0);let n=this.element.cloneNode(!0);n.id=`bone-tracker-ghost`,this.element.parentElement.insertBefore(n,this.element),n.style.transition=`opacity 0.6s ease-out`,n.style.pointerEvents=`none`,setTimeout(()=>{n.style.opacity=`0`,setTimeout(()=>n.remove(),600)},500),this.element.classList.add(`persona-breakout`);let r=!1;setTimeout(()=>{this.element.classList.remove(`persona-breakout`),this.flightTween&&this.flightTween.stop(),this.flightTween=new v.Tween(this).to({transitionProgress:1},1500).easing(v.Easing.Back.In).onUpdate(()=>{this.transitionProgress>.65&&!this.isBeaming&&(this.isBeaming=!0,this.setupBeam()),this.transitionProgress>=.9&&!r&&(r=!0,this.cleanupBeam(),e&&e())}).onComplete(()=>{this.isTransitioning=!1,this.flightTween=null,setTimeout(()=>{this.scene.gazeFollower&&(this.scene.gazeFollower.isLocked=!1)},400)}).start()},400);let i=document.getElementById(`experience-container`)||document.body;this.element.parentElement!==i&&i.appendChild(this.element),Object.assign(this.element.style,{position:`absolute`,top:`0`,left:`0`,zIndex:`10005`,pointerEvents:`none`,margin:`0`,display:`block`,transition:`none`,perspective:`1000px`,transformOrigin:`10% 50%`}),this.element.classList.add(`persona-active-hover`)}else{if(this.originalParent){let e=this.originalParent.getBoundingClientRect();this.returnTargetPos={x:e.left,y:e.top}}this.isTransitioning=!0,this.setupBeam(),this.scene.gazeFollower&&(this.scene.gazeFollower.isLocked=!0),this.flightTween&&this.flightTween.stop(),this.flightTween=new v.Tween(this).to({transitionProgress:0},800).easing(v.Easing.Cubic.InOut).onComplete(()=>{this.isTransitioning=!1,this.flightTween=null,this.cleanupBeam(),this.scene.gazeFollower&&(this.scene.gazeFollower.isLocked=!1),this.scene.isHeroAnimating=!1,this.originalParent&&(this.originalNextSibling?this.originalParent.insertBefore(this.element,this.originalNextSibling):this.originalParent.appendChild(this.element)),this.element.classList.remove(`persona-active-hover`),Object.assign(this.element.style,this.originalStyle),this.element.style.display=`flex`}).start()}return this.isActive}forceReset(){this.flightTween&&this.flightTween.stop(),this.flightTween=null,this.isTransitioning=!1,this.isActive=!1,this.transitionProgress=0,this.cleanupBeam(),this.scene.gazeFollower&&(this.scene.gazeFollower.isLocked=!1),this.scene.isHeroAnimating=!1,this.originalParent&&(this.originalNextSibling?this.originalParent.insertBefore(this.element,this.originalNextSibling):this.originalParent.appendChild(this.element)),this.element.classList.remove(`persona-active-hover`),this.element.classList.remove(`persona-breakout`),Object.assign(this.element.style,this.originalStyle),this.element.style.display=`flex`}setupBeam(){this.cleanupBeam(),this.droneBeam=us(this.scene,`transition-tether-beam`,65535),this.scene.add(this.droneBeam)}cleanupBeam(){this.droneBeam&&=(this.scene.remove(this.droneBeam),this.droneBeam.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.dispose()):e.material.dispose())}),null)}findBone(){return this.targetBone||(this.scene.getObjectByName(`a-char`)||this.scene.getObjectByName(`roomGLBModel`)||this.scene).traverse(e=>{e.isBone&&e.name===this.boneName&&(this.targetBone=e)}),this.targetBone}update(){if(!this.isActive&&!this.isTransitioning&&!this.isDroneGazing)return;if(this.isActive&&!this.scene.isHeroAnimating&&!this.isTransitioning){this.forceReset();return}if(!this.element)return;let t=this.findBone();if(!t)return;let n=new e.Vector3().copy(this.localOffset);t.localToWorld(n);let r=new e.Quaternion;t.getWorldQuaternion(r);let i=n.distanceTo(this.scene.camera.position),a=e.MathUtils.clamp(this.scaleReferenceDistance/i,.4,1.5)*this.manualScaleFactor,o=new e.Matrix4().makeRotationFromQuaternion(r),s=this.scene.camera.matrixWorldInverse.clone().multiply(o),c=new e.Euler().setFromRotationMatrix(s,`YXZ`),l=-c.x*30,u=c.y*30,d=new e.Vector3(0,.1,0),f=n.clone().add(d.applyQuaternion(r)),p=n.clone().project(this.scene.camera),m=f.clone().project(this.scene.camera),h=this.scene.renderer.domElement,g=h.clientWidth/2,_=h.clientHeight/2,y=p.x*g+g,b=-(p.y*_)+_,x=y,S=b;if(this.isTransitioning){let t=this.transitionProgress,n=t>0?t*(1-t)*-1e3:0;this.isActive?(x=e.MathUtils.lerp(this.startScreenPos.x,y,t),S=e.MathUtils.lerp(this.startScreenPos.y,b,t)+n):(x=e.MathUtils.lerp(this.returnTargetPos.x,y,t),S=e.MathUtils.lerp(this.returnTargetPos.y,b,t))}let C=m.x*g+g,w=-(m.y*_)+_,T=Math.atan2(w-S,C-x)+this.rotationOffset.z+0;this.isTransitioning&&this.droneBeam&&this.updateDroneBeam(x,S),p.z<1?(this.element.style.display=`flex`,this.element.style.transform=`
                translate(${x}px, ${S}px) 
                translate(-10%, -50%) 
                rotate(${T}rad) 
                rotateX(${l+e.MathUtils.radToDeg(this.rotationOffset.x)}deg) 
                rotateY(${u+e.MathUtils.radToDeg(this.rotationOffset.y)}deg) 
                scale(${a})
            `.replace(/\s+/g,` `)):this.element.style.display=`none`;let E=this.scene.activeAction;if(this.isActive&&E&&E.getClip().name===`golfDrive`){let t=[`pokeball`,`pokeball2`,`questionCube`],n=this.scene.getObjectByName(`a-char`),r=null,i=1/0;if(n&&t.forEach(e=>{let t=this.scene.getObjectByName(e);if(t&&t.visible&&t.rapierBody){let e=t.position.distanceTo(n.position);e<i&&(i=e,r=t)}}),r&&r.rapierBody){let t=E.getClip().duration,i=E.time/t;if(i<.1&&(this.hasHitThisSwing=!1),!this.hasHitThisSwing&&i>=.22){this.hasHitThisSwing=!0,r.rapierBody.wakeUp();let t=new e.Vector3(-1,1.35,0).normalize(),i=r.rapierBody.mass(),a=i*61.1,o=this.scene&&this.scene.world?this.scene.world:null;if(o&&!o.isBusy)try{o.isBusy=!0,r.rapierBody.applyImpulse({x:t.x*a,y:t.y*a,z:t.z*a},!0);let s=r.rapierBody.translation(),c=new e.Vector3(s.x,s.y,s.z);if(E.setEffectiveTimeScale(.1),setTimeout(()=>{new v.Tween({ts:.1}).to({ts:1},700).easing(v.Easing.Cubic.Out).onUpdate(e=>E.setEffectiveTimeScale(e.ts)).start()},120),r.name.startsWith(`pokeball`))Wo(this.scene,c,n.position,[16777215,16746496,16755200]),Z(`TARGET_STABILIZED: DATA_ENTITY_SEQUESTERED`);else if(r.name===`questionCube`){Wo(this.scene,c,n.position,[16777215,16766720,16746496]),Z(`SYSTEM_ANOMALY_RESOLVED: JACKPOT_SECTOR_OPEN`);let t=Math.floor(Math.random()*6)+1,r=Math.random()>.5?`BTC`:`ETH`,i=new e.Vector3(1,.1,-1.5);for(let e=0;e<t;e++){let n=e/t*Math.PI*2+Math.random()*.5,a=4+Math.random()*4,o=12+Math.random()*8,s={x:Math.cos(n)*a,y:o,z:Math.sin(n)*a};Fi(this.scene,i,s,e>0,r)}window.LIGHT&&window.LIGHT.lightningStrike({scene:this.scene,constantUniform:this.scene.globalUniformsHub?.uniforms,windowLight:this.scene.windowLight},.9,c,!1)}let l=i*15;r.rapierBody.applyTorqueImpulse({x:(Math.random()-.5)*(l*.6),y:-l*1,z:(Math.random()-.5)*(l*.6)},!0),o.isBusy=!1}catch(e){console.error(`[BoneTracker] Impulse failed:`,e.message),o&&(o.isBusy=!1)}}}}}updateDroneBeam(t,n){let r=this.scene.getObjectByName(`drone`),i=r?r.getObjectByName(`Sphere001_0`):null;if(!i||!this.droneBeam)return;let a=new e.Vector3;i.getWorldPosition(a);let o={left:t,top:n,width:0,height:0,right:t,bottom:n},s=fs(this.scene,o,`TL`,.5);this.droneBeam.position.copy(a),this.droneBeam.lookAt(s),Go(this.scene,s,!0,!0);let c=a.distanceTo(s);this.droneBeam.children.forEach(e=>{e.name.includes(`beam`)&&(e.scale.z=c)})}setBone(e){this.boneName=e,this.targetBone=null}setScale(e){this.manualScaleFactor=e}setOffset(e=0,t=0,n=0){this.localOffset.set(e,t,n)}setRotationOffset(t=0,n=0,r=0){this.rotationOffset.set(e.MathUtils.degToRad(t),e.MathUtils.degToRad(n),e.MathUtils.degToRad(r))}destroy(){this.isActive&&this.toggleTracking(),this.isActive=!1,this.element=null}}})),Nl=M((()=>{}));function Pl(t,n,r){let i=document.getElementById(`act-button`);i&&i.addEventListener(`click`,()=>{console.log(`ACT 1: PAUSE & RESET`),t.physicObjects&&t.physicObjects.length>0?(t.physicObjects.forEach(n=>{if(r.includes(n.name))return;let i=n.rapierBody;if(i&&n.userData.originalPos&&n.userData.originalRot){let r=i.bodyType();if(r===b.RigidBodyType.Fixed)return;i.setBodyType(b.RigidBodyType.KinematicPositionBased);let a=n.position.clone(),o=n.quaternion.clone(),s=n.userData.originalPos,c=n.userData.originalRot,l=new e.Quaternion().setFromEuler(c),u={val:0};new v.Tween(u).to({val:1},2e3).easing(v.Easing.Cubic.InOut).onUpdate(()=>{let n=t&&t.world?t.world:null;if(n&&n.isBusy)return;let r=new e.Vector3().lerpVectors(a,s,u.val);i.setNextKinematicTranslation(r);let c=o.clone().slerp(l,u.val);i.setNextKinematicRotation(c)}).onComplete(()=>{i.setBodyType(r),r===b.RigidBodyType.Dynamic&&(i.setLinvel({x:0,y:0,z:0},!0),i.setAngvel({x:0,y:0,z:0},!0)),i.wakeUp()}).start()}}),Z(`Resetting Scene (Smooth)...`)):console.warn(`No scene.physicObjects found to reset.`)})}function Fl(t,n){let r=document.getElementById(`act-button-2`);r&&r.addEventListener(`click`,async()=>{if(console.log(`ACT 2: Button Clicked - Play Standup`),t.mixer&&t.animations){let n=t.animations.find(e=>e.name===`standup`);if(n){t.mixer.stopAllAction();let r=t.mixer.clipAction(n);r.reset(),r.setLoop(e.LoopOnce),r.clampWhenFinished=!0,r.play(),Z(`Playing Standup Animation...`)}else console.warn(`Standup clip not found in scene.animations`)}else console.warn(`Mixer or Animations not found on scene`)})}function Il(e){let t=document.getElementById(`act-button-3`);t&&t.addEventListener(`click`,()=>{console.log(`ACT 3: BULB MORPH`);let t=e.getObjectByName(`bulb`),n=e.constantUniform,r=t.geometry,i=e.getObjectByName(`bulb`).geometry;if(n&&n.uTransformProgress){let e=n.uTransformProgress.value,t=e>.5?0:1,a=v.Easing.Back.InOut,o=e>.5;new v.Tween(n.uTransformProgress).to({value:t},1500).easing(a).onUpdate(()=>{let e=n.uTransformProgress.value,t=Math.sin(e*Math.PI);n.uOscillationStrength.value=.2+.8*t;let a=e>.5;a!==o&&(o=a,a?(r.setIndex(r.targetIndex),i&&i.setIndex(r.targetIndex)):(r.setIndex(r.originalIndex),i&&i.setIndex(r.originalIndex)))}).start(),Z(t===1?`Morphing to Bitcoin...`:`Reverting to Bulb...`)}else console.warn(`Bulb or Morph Uniform not found.`)})}function Ll(e){let t=document.getElementById(`act-button-4`);t&&t.addEventListener(`click`,()=>{if(console.log(`TEST 4 CLICKED: Converging Fireflies...`),e.constantUniform&&e.constantUniform.uMergeProgress){let t=e.constantUniform.uMergeProgress;t.value=0,new v.Tween(t).to({value:1},8e3).easing(v.Easing.Linear.None).repeat(0).start(),Z(`Fireflies Gathering...`)}else console.warn(`Constant Uniforms not found`)})}function Rl(e){window.addEventListener(`keydown`,t=>{let n=parseInt(t.key);if(isNaN(n))return;let r=n;if(e.heroClips&&e.heroClips[r]){let t=e.heroClips[r];Dr(e,t.name)}else console.warn(`No clip found for key ${n} (Index ${r})`)})}function zl(e){let t=document.getElementById(`act-button-5`);t&&t.addEventListener(`click`,()=>{console.log(`ACT 5: Toggle Points Environment (OFF)`),qo(e,1),Z(`Returning to Room Environment...`)})}function Bl(e,t,n=[]){Pl(e,t,n),Fl(e,t),Il(e),Ll(e),zl(e),Vl(e);let r=document.getElementById(`test-btn-revert`),i=document.getElementById(`test-btn-2`),a=document.getElementById(`test-btn-3`),o=document.getElementById(`test-btn-resume`);r&&r.addEventListener(`click`,()=>{console.log(`clicked Revert Room`),$o(e)}),i&&i.addEventListener(`click`,()=>{console.log(`clicked Reassemble Scene`),Qo(e)}),a&&a.addEventListener(`click`,()=>{console.log(`clicked Active Grid (Toggle Visibility)`);let t=e.camera.getObjectByName(`camGrid`);t||=e.getObjectByName(`camGrid`),t?(t.visible=!0,console.log(`Grid Visible: TRUE`),setTimeout(()=>{t&&(t.visible=!1,console.log(`Grid Visible: FALSE (Auto-Hide)`))},500)):console.log(`Grid 'camGrid' not found in camera or scene.`)}),o&&o.addEventListener(`click`,()=>{if(console.log(`clicked Resume Tween`),e.points&&e.points.morphTween){let t=e.points.morphTween;t.isPaused()?(t.resume(),console.log(`Tween Resumed.`)):console.log(`Tween is not paused (or is playing).`)}else console.log(`No active morph tween found to resume.`)}),Hl(document.getElementById(`act-controls`)),Rl(e),e.toggleRapierHelper=()=>{let t=e.rapierWorldWrapper;if(!t){console.warn(`[Physics] Rapier wrapper (rapierWorldWrapper) not found on scene.`);return}t.debuggerEnabled=!t.debuggerEnabled,t.world.debuggerEnabled=t.debuggerEnabled,t.lines&&(t.lines.visible=t.debuggerEnabled,t.debuggerEnabled?e.add(t.lines):e.remove(t.lines)),console.log(`[Physics] Debugger ${t.debuggerEnabled?`ENABLED`:`DISABLED`}`)}}function Vl(e){window.addEventListener(`keydown`,t=>{(t.key===`d`||t.key===`D`)&&pa(e)})}function Hl(e){if(!e)return;let t=!1,n,r,i,a,o=0,s=0;e.style.cursor=`move`,e.style.userSelect=`none`,e.addEventListener(`mousedown`,c),window.addEventListener(`mouseup`,l),window.addEventListener(`mousemove`,u);function c(n){n.target.closest(`button`)||(i=n.clientX-o,a=n.clientY-s,e.contains(n.target)&&(t=!0))}function l(e){i=n,a=r,t=!1}function u(c){t&&(c.preventDefault(),n=c.clientX-i,r=c.clientY-a,o=n,s=r,d(n,r,e))}function d(e,t,n){n.style.transform=`translate3d(${e}px, ${t}px, 0)`}}var Ul=M((()=>{ks(),Or(),ls(),Na()})),Wl=ne((()=>{Ns(),Fs(),Is(),Ls(),Rs(),ec(),Mc(),Fc(),Ks(),zc(),Bc(),Ol(),ls(),Mn(),Al(),Na(),po(),He(),Te(),rr(),Ml(),Lt(),Nl(),Ul(),ks(),mt(),Ae(),pt(),kt(),window.RAYCAST=Cn,window.B64=Un,window.GLOBAL_COLORS=I;var t,n,r,i,a,o,s,c,l,u=new e.Clock,d=document.getElementById(`progress-text`),f=document.getElementById(`progress-bar`);function p(){let e=document.getElementById(`experience-container`);if([n,t,r]=Ps({alpha:!0,domElement:e,useBackdrop:!0}),$e(r),i=Js(n,t,r,!0),i.enableZoom=!1,n.renderer=r,n.constantUniform=It,window.scene=n,s=new jn(n,t,r),l=jt({scene:n,clock:u,raycaster:s,camera:t,domElement:r.domElement}),Vs(n),fo.init(n),n.clock=u,n.TWEEN=v,n.maximizer=Se,n.targetAnimHz=30,window.maximizer=Se,n.isHeroAnimating)return;Ko&&(n.shootDroneBeam=Ko),n.updateDroneGaze=Go;let a=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)?1.5:2;r.setPixelRatio(Math.min(window.devicePixelRatio,a))}function m(){r.outputColorSpace=e.LinearSRGBColorSpace,r.physicallyCorrectLights=!0,r.toneMapping=e.CineonToneMapping,r.shadowMap.enabled=!0,r.shadowMap.type=e.PCFShadowMap,r.shadowMap.autoUpdate=!1;let t=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)?1.5:2;r.setPixelRatio(Math.min(window.devicePixelRatio,t)),n.background=null}function h(){_s()}async function g(){let l=new URLSearchParams(window.location.search).get(`mobile`)===`true`||/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);if(window.IS_MOBILE=l,l){document.body.classList.add(`mobile-mode`);let e=document.getElementById(`cv-container`);e&&e.classList.remove(`collapsed`);let t=document.getElementById(`experience-container`);t&&(t.style.display=`none`),window.bootLoader&&typeof window.bootLoader.finish==`function`&&await window.bootLoader.finish();return}p(),$e(r),m(),await je(),o=new Be(n,{debuggerEnabled:!1,isActive:!1}),h(),_s(),Bl(n,u);let g=()=>new Promise(e=>setTimeout(e,100));try{ht(),window.loadingProgress=0,Ke(`points-init`,20),Ke(`model-assembly`,20),Ke(`physics-binding`,40),z(window.loadingProgress||0,R(`SYS_RETRIEVING_ASSETS`));let o=_t();await gt(),await g(),z(window.loadingProgress||0,R(`SYS_CALIBRATING_POINTS`));let l={x:61.56,y:2.97,z:30};if(t.position.set(l.x,l.y,l.z),B.start(`Points System Init`),c=new Dl(n,t,r,s,{enableLoadingUI:!1,enableBloom:!0,enableControls:!1}),n.pointsApp=c,kl(n),ca(n),await c.init(),c.points){let i=Ic(c.points,n);i.material.uniforms&&(i.material.uniforms.uStarScreenPos.value.set(0,0),i.material.uniforms.uScaleFactor.value=0);let a=()=>{if(!n.knowhere||!n.knowhere.visible||!c.points||!n.HUD)return;let i=r.domElement.clientWidth,a=r.domElement.clientHeight,o=n.HUD.material.uniforms.uMarginPct.value,s=a*(o+n.HUD.material.uniforms.uVerticalMarginPct.value),l=(i-a*o*2)*.5,u=(a-s*2)*.5,d=u*2*(n.HUD.material.uniforms.uBNotchHRatio?.value||0),f=u*2*(n.HUD.material.uniforms.uRNotchHRatio?.value||0),p=n.knowhere.material.uniforms.uHudOffset.value,m=p.x,h=p.y,g=m*l,_=h*u;Math.abs(h)<1&&(g-=(1-Math.abs(h))*f*m),Math.abs(m)<1&&h<0&&(_+=(1-Math.abs(m))*d*Math.abs(h));let v=g/(i*.5),y=_/(a*.5);n.knowhere.material.uniforms.uStarScreenPos&&n.knowhere.material.uniforms.uStarScreenPos.value.set(v,y);let b=new e.Vector2((v*.5+.5)*i,(y*.5+.5)*a);c&&c.material&&c.material.uniforms.uKnowhereScreen&&(c.material.uniforms.uKnowhereScreen.value.copy(b),c.material.uniforms.uKnowhereScale.value=n.knowhere.material.uniforms.uScaleFactor.value);let x=new e.Vector3(v,y,.5);x.unproject(t);let S=x.sub(t.position).normalize(),C=Math.max(10,t.position.length()-.1),w=t.position.clone().add(S.multiplyScalar(C));c.points.worldToLocal(w),n.knowhere.position.set(w.x,w.y,w.z)};setTimeout(a,100),window.addEventListener(`resize`,a),window.addEventListener(`cvToggle`,()=>setTimeout(a,400)),window.addEventListener(`personaChanged`,()=>setTimeout(a,100)),n.onUpdate=n.onUpdate||[],n.onUpdate.push(a)}Je(`points-init`),B.end(`Points System Init`),await g(),await g(),z(window.loadingProgress||0,R(`SYS_INIT_MODELS`)),await o,await g(),a=new jc(n,t,r,V),n.loadedModel=a,await a.init(d,f,{skipCompile:!1,pointsApp:c});let p=new jl(n,`mixamorigRightHandMiddle1`);if(n.onUpdate=n.onUpdate||[],n.onUpdate.push(()=>p.update()),window.boneTracker=p,window.addEventListener(`keydown`,e=>{e.target.tagName===`INPUT`||e.target.tagName===`TEXTAREA`||e.key.toLowerCase()===`t`&&da(n)}),window.addEventListener(`audienceChanged`,()=>{n.isHeroAnimating||da(n)}),await g(),await g(),await g(),z(window.loadingProgress||0,R(`SYS_WARMING_ENGINES`)),c&&typeof c.warmup==`function`){let i=n.getObjectByName(`roomGLBModel`),a=new e.Vector3,o=new Map;if(i){console.log(`[Warmup] Anchoring Room model for GPU upload...`),a.copy(i.position),i.position.set(0,0,0),i.visible=!0;let e=new Set,t=new Set;i.traverse(n=>{n.isMesh&&(o.set(n.uuid,n.frustumCulled),n.frustumCulled=!1,n.material&&(Array.isArray(n.material)?n.material:[n.material]).forEach(n=>{t.add(n);for(let t in n)n[t]&&n[t].isTexture&&e.add(n[t])}))}),console.log(`[Warmup] Initializing ${e.size} textures progressively...`);for(let t of e)r.initTexture(t),await new Promise(e=>requestAnimationFrame(e))}let s=n.HUD,l={};if(s&&s.material&&s.material.uniforms){let e=s.material.uniforms;l={uVerticalMarginPct:e.uVerticalMarginPct.value,uCutSize:e.uCutSize.value,uBNotchHRatio:e.uBNotchHRatio.value,uBNotchWRatio:e.uBNotchWRatio.value,uIslToMainWRatio:e.uIslToMainWRatio.value,uRNotchHRatio:e.uRNotchHRatio.value,uRNotchWRatio:e.uRNotchWRatio.value,uIsAutoElec:e.uIsAutoElec.value,uGridLock:e.uGridLock.value},e.uVerticalMarginPct.value=0,e.uCutSize.value=10,e.uBNotchHRatio.value=.02,e.uBNotchWRatio.value=.6,e.uIslToMainWRatio.value=.32,e.uRNotchHRatio.value=.4,e.uRNotchWRatio.value=.02,e.uIsAutoElec.value=1,e.uGridLock.value=1,s.visible=!0}try{let e=e=>new Promise(t=>setTimeout(t,e));console.log(`[Warmup] Segmented Scene Compilation...`);let a=[];i.traverse(e=>{e.isMesh&&a.push(e)});for(let e=0;e<a.length;e+=5){let n=[];for(let i=e;i<Math.min(e+5,a.length);i++)n.push(r.compileAsync(a[i],t));await Promise.all(n),await new Promise(e=>requestAnimationFrame(e))}await r.compileAsync(n,t),await e(150),console.log(`[Warmup] Engaging Points System...`),c.warmup(),await e(150);let o=r.info.memory||{};console.log(`%c[Warmup] System Ready. VRAM Usage: ${(o.textures*0||0)+(o.geometries*0||0)} - G: ${o.geometries||0}, T: ${o.textures||0}`,`color: #00FF00; font-weight: bold;`)}catch(e){console.warn(`[Warmup] Swallowed non-critical error during GPU priming:`,e)}if(s&&s.material&&s.material.uniforms){let e=s.material.uniforms;for(let t in l)e[t].value=l[t]}i&&(i.visible=!1,i.position.copy(a),i.traverse(e=>{e.isMesh&&o.has(e.uuid)&&(e.frustumCulled=o.get(e.uuid))}))}else console.warn(`[Warmup] Skipped: pointsApp or warmup function missing.`);await g(),Ao(n),So(n),a.isLoaded=!0,Q.setPointsApp(c),z(100);let m=((performance.now()-window.bootStartTime)/1e3).toFixed(2);if(console.log(`%c[SYSTEM] BOOT COMPLETE in ${m}s`,`color: #00F3FF; font-weight: bold;`),Q.setPointsApp(c),z(100),window.bootLoader&&typeof window.bootLoader.finish==`function`){let e=document.getElementById(`board`);e&&(e.style.display=`flex`),await window.bootLoader.finish()}B.printReport(),await Nc({scene:n,camera:t,orbitControl:i,clock:u,pointsApp:c});let h=!1;window.addEventListener(`keydown`,e=>{if(e.key.toLowerCase()===`b`&&n.HUD&&typeof n.HUD.breathe==`function`){h=!h;let e=h?I.CRIMSON_RED:I.ELECTRIC_CYAN;n.HUD.breathe(e)}}),window.addEventListener(`cvToggle`,e=>{if(n&&n.HUD&&typeof n.HUD.breathe==`function`){let t=e.detail&&e.detail.collapsed?I.CRIMSON_RED:I.ELECTRIC_CYAN;n.HUD.breathe(t)}},{passive:!0})}catch(e){console.error(`Fatal Error during Initialization:`,e),z(window.loadingProgress||0,R(`SYS_FAILURE`)),setTimeout(()=>{window.bootLoader&&typeof window.bootLoader.finish==`function`&&window.bootLoader.finish()},3e3)}}var _=0;function y(){_++,n.frameCounter=_;let e=_%2==0;n.isHighPriorityFrame=e;let d=n.scenarioState||xe[0],f=d.renderer||`composer`,p=f!==`composer`;r.shadowMap.enabled&&d.name===`room`&&!n.isTransitioning&&_%3==0&&(r.shadowMap.needsUpdate=!0);let m=performance.now(),h=u.getDelta(),g=n&&n.isTransitioning?Math.min(h,.25):Math.min(h,.06);if(n){if(n.fpsStats||={sum:0,count:0,avg:60},h>0&&h<1){let e=1/h,t=.05;n.fpsStats.avg=e*t+n.fpsStats.avg*(1-t),n.fpsStats.count++}n.isTransitioning&&h>.02&&(n._lastTotalTime=h*1e3)}v&&v.update(),n.onUpdate&&n.onUpdate.forEach(e=>e(g)),s&&n.isAdjusted&&p&&s.update(),o&&p&&o.update(g),i&&i.edgeControlUpdate(),l&&l.update(g,s?s.pointer:null),e&&vs(n,2);let y=n.scenarioState||xe[0];n.isTransitioning&&(y={...y,pixelRatioScale:.2}),Se.update(g,r,y)&&c&&typeof c.onWindowResize==`function`&&c.onWindowResize();let b=performance.now();n._lastLogicTime=b-m;let x=n&&n.isTransitioning,S=performance.now();if(c){let e=c.bloomPass&&c.bloomPass.strength>.01;f===`composer`&&(!x||e)?(c.points&&!c.points.visible&&(c.points.visible=!0),c.update(!1,!0)):(c.points&&c.points.visible&&!e&&(c.points.visible=!1),x&&c.update(!0,!1),r&&n&&t&&r.render(n,t))}else r&&n&&t&&r.render(n,t);let C=performance.now();if(n._lastRenderTime=C-S,n&&n.isTransitioning&&n._lastTotalTime>20){let e=n._lastTotalTime-((n._lastLogicTime||0)+(n._lastRenderTime||0));e>50&&`${e.toFixed(1)}`,n.HUD&&n.HUD.breathe&&n.HUD.breathe(I.CRIMSON_RED),n._lastTotalTime=0}n._accumulatedDelta||=0,n._accumulatedDelta+=g;let w=1/(n.targetAnimHz||30);if(n._accumulatedDelta>=w-.001){let e=n._accumulatedDelta,t=n&&n.isTransitioning;a&&p&&!t&&a.updateAnimationMixer(e),n._accumulatedDelta=0}}g(),r!==void 0&&r&&r.setAnimationLoop(y)}));_e(),Wl(),mi();