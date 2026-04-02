import*as l from"three";import{AdditiveBlending as Dr,Box2 as Cl,BufferGeometry as Il,Color as Ai,FramebufferTexture as Yn,InterleavedBuffer as Rl,InterleavedBufferAttribute as qn,Mesh as Ji,MeshBasicMaterial as Nr,RawShaderMaterial as ea,ShaderMaterial as ni,UniformsUtils as $n,UnsignedByteType as Kn,Vector2 as gt,Vector3 as Ft,Vector4 as Ml,WebGLRenderTarget as ta}from"three";import"three/addons/libs/stats.module.js";import x from"tween";import*as Je from"rapier-compat";import fe from"rapier-compat";import{GLTFLoader as _l}from"three/addons/loaders/GLTFLoader.js";import{RGBELoader as Al}from"three/addons/loaders/RGBELoader.js";import{DRACOLoader as Pl}from"three/addons/loaders/DRACOLoader.js";import{KTX2Loader as Bl}from"three/addons/loaders/KTX2Loader.js";import{OrbitControls as Ol}from"three/addons/controls/OrbitControls.js";import{EffectComposer as Dl}from"three/addons/postprocessing/EffectComposer.js";import{RenderPass as Nl}from"three/addons/postprocessing/RenderPass.js";import*as Ll from"three/addons/utils/SkeletonUtils.js";import{FullScreenQuad as kl,Pass as Ul}from"three/addons/postprocessing/Pass.js";import{CopyShader as jn}from"three/addons/shaders/CopyShader.js";import{LuminosityHighPassShader as Xn}from"three/addons/shaders/LuminosityHighPassShader.js";var Qn=Object.defineProperty,J=(e,t)=>()=>(e&&(t=e(e=0)),t),Fi=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),Lr=(e,t)=>{let o={};for(var i in e)Qn(o,i,{get:e[i],enumerable:!0});return t||Qn(o,Symbol.toStringTag,{value:"Module"}),o},kr,Fl=J((()=>{kr=class{constructor(){this.bootStartTime=performance.now(),window.bootStartTime=this.bootStartTime,this.canvas=document.createElement("canvas"),this.canvas.id="boot-canvas",Object.assign(this.canvas.style,{position:"fixed",top:"0",left:"0",width:"100%",height:"100%",zIndex:"99999",background:"black",transition:"opacity 0.5s ease-out"}),document.body.appendChild(this.canvas),this.isFinished=!1,this.lastProgress=0,this.targetProgress=0;const e=!!this.canvas.transferControlToOffscreen,t=window.devicePixelRatio||1,o=window.innerWidth*t,i=window.innerHeight*t;e?(this.canvas.width=o,this.canvas.height=i,this.offscreen=this.canvas.transferControlToOffscreen(),this.worker=new Worker(new URL("/PFL/assets/bootWorker-CDtrCm2J.js",""+import.meta.url),{type:"module"}),this.worker.postMessage({type:"INIT",payload:{canvas:this.offscreen,width:o,height:i}},[this.offscreen]),this.useWorker=!0):this.initMainThreadRenderer(),this.onMouseMove=this.onMouseMove.bind(this),this.onResize=this.onResize.bind(this),window.addEventListener("resize",this.onResize),window.addEventListener("mousemove",this.onMouseMove),this.updateLoop=this.updateLoop.bind(this),requestAnimationFrame(this.updateLoop)}initMainThreadRenderer(){this.renderer=new l.WebGLRenderer({canvas:this.canvas,antialias:!0}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.scene=new l.Scene,this.camera=new l.OrthographicCamera(-1,1,1,-1,0,1),this.useWorker=!1}onMouseMove(e){const t=e.clientX/window.innerWidth,o=1-e.clientY/window.innerHeight;this.useWorker&&this.worker.postMessage({type:"MOUSE",payload:{x:t,y:o}})}onResize(){const e=window.devicePixelRatio||1,t=window.innerWidth*e,o=window.innerHeight*e;this.useWorker?this.worker.postMessage({type:"RESIZE",payload:{width:t,height:o}}):this.renderer&&this.renderer.setSize(window.innerWidth,window.innerHeight)}updateProgress(e){this.targetProgress=e}updateLoop(){if(this.isFinished)return;requestAnimationFrame(this.updateLoop);let e=.12;this.pendingFinish&&(e=.25);const t=this.targetProgress-this.lastProgress;Math.abs(t)<.001?this.lastProgress=this.targetProgress:this.lastProgress+=t*e,this.useWorker&&this.worker.postMessage({type:"UPDATE_PROGRESS",payload:this.lastProgress});const o=document.querySelector("#progress-text .progress-value");o&&(o.innerText=`${Math.floor(this.lastProgress*100)}%`),this.pendingFinish&&this.lastProgress>.998&&this.executeExit()}finish(){return this.isFinished?Promise.resolve():this.pendingFinish?this.finishPromise:(this.pendingFinish=!0,this.targetProgress=1,this.finishPromise=new Promise(e=>{this.resolveFinish=e}),this.finishPromise)}executeExit(){if(this.isFinished)return;this.isFinished=!0,this.resolveFinish&&this.resolveFinish();const e=document.getElementById("app-container");e&&(e.style.display="flex",e.style.visibility="visible",e.style.opacity="1"),this.canvas.style.opacity="0",setTimeout(()=>this.dispose(),1500)}dispose(){window.removeEventListener("resize",this.onResize),window.removeEventListener("mousemove",this.onMouseMove),this.worker&&this.worker.terminate(),this.canvas.remove()}}})),Hl=Fi((()=>{Fl(),window.bootLoader=new kr}));function go(e=1,t=1,o=document){const i=o===document?document.getElementById("board"):o.querySelector("#board"),a=o.querySelector(".intro-main-name1"),r=o.querySelector(".intro-main-name2"),n=o.querySelector(".intro-sub"),s=o.querySelector(".board-philo-sub"),c=o.querySelector(".board-philo-main"),u=o.getElementById?o.getElementById("board-feat-1"):o.querySelector("#board-feat-1"),d=o.getElementById?o.getElementById("board-feat-2"):o.querySelector("#board-feat-2");if(!i||!a||!r||!n)return;const m=i.clientWidth;if(m<=1)return;t=Math.max(0,Math.min(1,t!==void 0?t:window.__boardSubProgress??1));const f=4.2*e;i.style.gap=f+"vh";const g="BUI QUOC",w="VISION BECOMES",y="PI-SHAPED ENGINEERING & STRATEGY",S="ALIGNED THROUGH ENGINEERING",T="3+ YEARS • INTERACTIVE UX • AR/VR/3D",M="π-shaped lead.Strategy in motion.",O=getComputedStyle(a).fontFamily,_=Ae(g,`20px ${O}`),v=Ae(w,`20px ${O}`);let P=20*(m/Math.max(10,v+(_-v)*t))*e;const A=Ae(a.innerText,`${P}px ${O}`);A>m&&A>.01&&(P*=m/A),a.style.fontSize=P+"px",r.style.fontSize=P+"px";const F=o.getElementById?o.getElementById("board-intro"):o.querySelector("#board-intro");if(t<=0?(n.style.display="none",n.style.fontSize="0px",n.style.lineHeight="0",F&&(F.style.gap="0vh")):(n.style.display="block",n.style.fontSize=P*.3*t+"px",n.style.lineHeight=t,F&&(F.style.gap=.75*t+"vh")),c){const G=getComputedStyle(c).fontFamily,V=Ae(y,`20px ${G}`),h=Ae(S,`20px ${G}`);let b=20*(m/Math.max(10,h+(V-h)*t))*e;const p=Ae(c.innerText,`${b}px ${G}`);p>m&&p>.01&&(b*=m/p),c.style.fontSize=b+"px";const R=o.getElementById?o.getElementById("board-philo"):o.querySelector("#board-philo");if(s){if(t<=0)s.style.display="none",s.style.fontSize="0px",s.style.lineHeight="0",R&&(R.style.gap="0vh");else{s.style.display="block";const $=b*.8*t;s.style.fontSize=$+"px",s.style.lineHeight=t,R&&(R.style.gap=.75*t+"vh")}const C=o.getElementById?o.getElementById("board-feat"):o.querySelector("#board-feat"),N=b*.48,q=getComputedStyle(u||i).fontFamily;if(C&&C.style.setProperty("--feat-border-scale",t),d&&(t<=0?(d.style.display="none",d.style.fontSize="0px",d.style.lineHeight="0",C&&(C.style.gap="0vh")):(d.style.display="block",d.style.fontSize=N*t+"px",d.style.lineHeight=t,C&&(C.style.gap=.5*t+"vh"))),u){u.style.paddingTop=2.75*t+"vh";const $=Ae(T,`20px ${q}`),L=Ae(M,`20px ${q}`),B=Math.max(10,L+($-L)*t),z=20*(m/B);let U=z*(N/z);U=N;const E=Ae(u.innerText,`${U}px ${q}`);E>m&&E>.01&&(U*=m/E),u.style.fontSize=U+"px";const k=36,I=33,Y=I+(k-I)*t,H=(m-B*(U/20))/(Y-1),D=U*.25,W=Math.max(0,Math.min(D,H));u.style.letterSpacing=W+"px",d&&t>0&&(d.style.letterSpacing=W+"px")}}}}function Gl(){const e=document.getElementById("board");e&&(window.fitBoardTexts=go,new ResizeObserver(()=>{const t=window.__boardScale||1,o=window.__boardSubProgress??1;requestAnimationFrame(()=>go(t,o))}).observe(e),document.fonts&&document.fonts.ready.then(()=>{const t=window.__boardScale||1,o=window.__boardSubProgress??1;requestAnimationFrame(()=>go(t,o))}),go(window.__boardScale||1,window.__boardSubProgress??1))}var ui,Ae,Ur=J((()=>{ui={chaos:{bottom:12,top:0,scale:1,subVisible:!0,philoSubVisible:!0,mode:"mode-chaos"},root:{bottom:0,top:12,scale:.8,subVisible:!1,philoSubVisible:!1,mode:"mode-root"},dance:{bottom:0,top:16,scale:.8,subVisible:!1,philoSubVisible:!1,mode:"mode-dance"},walk:{bottom:12,top:0,scale:.8,subVisible:!1,philoSubVisible:!1,mode:"mode-walk"}},Ae=(e,t)=>(Ae.canvas||(Ae.canvas=document.createElement("canvas"),Ae.context=Ae.canvas.getContext("2d")),Ae.context.font=t,Ae.context.measureText(e).width)})),zl=Fi((()=>{Ur(),Gl()})),Qd=Hl(),Zd=zl();document.getElementById("cv-container");var Zn=document.getElementById("experience-container"),oa=null,ia=null,Vl=new ResizeObserver(e=>{for(let t of e)oa=t;ia||(ia=requestAnimationFrame(()=>{ia=null,oa&&!ya&&(window.dispatchEvent(new Event("resize")),oa=null)}))});Zn&&Vl.observe(Zn);var ya=!1,aa=null;window.addEventListener("cvToggle",()=>{ya=!0,aa&&clearTimeout(aa),aa=setTimeout(()=>{ya=!1,window.dispatchEvent(new Event("resize"))},850)});var Wl=Fi((()=>{document.addEventListener("DOMContentLoaded",()=>{t(),o(),e()});function e(){const i=document.getElementById("cv-scroller"),a=document.getElementById("cv-container");if(!i||!a)return;const r=document.createElement("div");r.className="cv-scroll-top-floater",r.setAttribute("aria-label","Scroll to Top"),r.innerHTML=`
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    `,a.appendChild(r),i.addEventListener("scroll",()=>{i.scrollTop>400?r.classList.add("visible"):r.classList.remove("visible")},{passive:!0}),r.addEventListener("click",()=>{i.scrollTo({top:0,behavior:"smooth"}),r.classList.remove("visible")})}function t(){document.querySelectorAll(".collapsible-header").forEach(i=>{i.addEventListener("click",()=>{const a=i.closest(".summary-header-wrapper"),r=a?a.nextElementSibling:i.nextElementSibling;r&&(i.classList.toggle("collapsed"),r.classList.toggle("collapsed"))})})}function o(){document.querySelectorAll(".role-block").forEach(i=>{i.dataset.roleBound||(i.dataset.roleBound="true",i.addEventListener("click",a=>{if(a.target.tagName==="A"||a.target.closest("a"))return;a.stopPropagation();const r=i.classList.toggle("collapsed"),n=i.querySelector(".hint-text");n&&(n.textContent=r?"CLICK TO EXPAND":"CLICK TO COLLAPSE")}))})}})),jt,Te,Go,Fr,de,bo,di,Jn,er,et=J((()=>{jt={ROOT:"root",CHAR:"a-char",ROOT_DEV:"rootDev"},Te={POBA:"poba",DEV:"dev"},Go=Te.POBA,Fr="1.0.0",de={ELECTRIC_CYAN:new l.Color(0,.95,1),ACCENT_GOLD:new l.Color("#DCD0BA"),CRIMSON_RED:new l.Color("#FF003C"),INACTIVE_GRAY:new l.Color(.05,.05,.05)},bo=[{name:"points",renderer:"composer",pixelRatioScale:1,toneMappingExposure:4,ui:{cursorInformer:!1,subtitle:!1,personaButton3D:!1},environment:{cssBackground:null,sceneBackground:null},hudUniforms:{uOutsideColor:new l.Color(0,0,0),uFlowerColor:new l.Color(0,.92,1),uGridThickness:1,uBNotchBarAlpha:0}},{name:"room",renderer:"standard",pixelRatioScale:.625,toneMappingExposure:.4,ui:{cursorInformer:!0,subtitle:!0,personaButton3D:!0},environment:{cssBackground:"black"},hudUniforms:{uOutsideColor:new l.Color("#2b2b2b"),uFlowerColor:new l.Color(1,1,1),uGridThickness:2,uBNotchBarAlpha:0}}],di={thresholdUp:56,thresholdSoftDown:50,thresholdHardDown:40,waitDuration:3,elapsedGoodTime:0,settleTimer:0,update(e,t,o){if(!t||!o||e<=0)return!1;const i=window.devicePixelRatio||1,a=t.getPixelRatio(),r=1/e;if(window.scene&&window.scene.isTransitioning)return this.lastStep=-1,!1;const n=window.scene?window.scene.pointsApp:null,s=n&&typeof n.getCurrentStep=="function"?n.getCurrentStep():-1,c=s===0||s===1||s===2,u=s>=3||o.name==="room";if(this.lastStateName!==o.name||this.lastStep!==s){this.lastStateName=o.name,this.lastStep=s,this.elapsedGoodTime=0,this.settleTimer=1;const m=o.pixelRatioScale||1,f=c?i:i*m;return a!==f?(t.setPixelRatio(f),!0):!1}if(this.settleTimer>0)return this.settleTimer-=e,!1;const d=i*(o.pixelRatioScale||1);if(c){if(r<30){if(a>1.01)return t.setPixelRatio(1),!0}else if(r>45&&a<i-.01&&(this.elapsedGoodTime+=e,this.elapsedGoodTime>2))return t.setPixelRatio(Math.min(i,a+.1)),this.elapsedGoodTime=0,!0}else if(u){const m=window.scene&&window.scene.fpsStats?window.scene.fpsStats.avg:r;if(r<40){if(a>d+.01)return t.setPixelRatio(d),this.elapsedGoodTime=0,!0}else if(r<50){if(a>d+.1)return t.setPixelRatio(Math.max(d,a-.1)),this.elapsedGoodTime=0,!0}else if(m>56){if(this.elapsedGoodTime+=e,this.elapsedGoodTime>=5&&a<d-.01)return t.setPixelRatio(Math.min(d,a+.05)),this.elapsedGoodTime=0,!0}else this.elapsedGoodTime=0}return!1}},Jn=(e=.5)=>{if(!window.scene||!window.scene.renderer)return;const t=window.scene.renderer.getPixelRatio()+e;window.scene.renderer.setPixelRatio(t)},er=(e=.5)=>{if(!window.scene||!window.scene.renderer)return;const t=window.scene.renderer.getPixelRatio(),o=Math.max(.1,t-e);window.scene.renderer.setPixelRatio(o)},typeof window<"u"&&(window.dprI=Jn,window.dprD=er)})),Ht,Yl=J((()=>{et(),Ht={poba:{id:"PROTOCOL: BA_PO_2026",systemTitle:"SR. PO / ITBA",role:"SENIOR TECHNICAL PRODUCT OWNER & BUSINESS ANALYST",summary:"Pi-shaped Technical Product Specialist with 10+ years of experience executing roadmaps across Fintech, DePIN (IoT & Web3), and EV mobility. I serve as a Technical Product Partner, bridging the gap between abstract business strategy and deep engineering reality. By integrating UX Design with functional prototyping, I validate complex product logic ensuring requirements are architecturally sound and user-optimized.",summaryTags:[{key:"Roles",val:["PO","BA"],comment:"// Adaptive Shift"},{key:"Experience",val:"+10 Years Professional Journey"},{key:"Expertises",val:["Fintech","IoT","EV_Mobility"]},{key:"π_Edge",val:"Engineering_Fluent_UX"},{key:"Methods",val:["Gherkin_AC","RICE","MoSCoW"]},{key:"Validations",val:["JS","WebGL","Python"]},{key:"Workflows",val:["n8n","AI","Workflows"]}],experience:[{company:"Arkreen Network",companyDesc:"A decentralized energy network (DePIN) leveraging Digital Twin technology for green energy assets.",title:"Technical Product Consultant (Independent)",date:"May 2025 – Present",points:["<strong>Strategic Prototyping:</strong> Co-developed high-fidelity interactive 3D dashboards (WebGL) to visualize real-time IoT data for investor pitching and stakeholder buy-in.","<strong>Technical De-risking:</strong> Validated requirement scalability using GLSL/Shaders to ensure architectural feasibility for complex 3D environments.","<strong>Productivity Automation:</strong> Deployed automated product management workflows using <strong>n8n and AI</strong>, reducing manual project overhead by an estimated <strong>40%</strong>."]},{company:"VinFast - Vingroup",companyDesc:"Vietnam's global EV manufacturer building an integrated digital mobility ecosystem.",title:"Senior ITBA / Product Owner (IoT & Smart Systems)",date:"Oct 2021 – May 2025",points:["<strong>Digital Transformation (VCA & Reliability Audit):</strong> Digitized manual quality control workflows, improving <strong>Mean Time to Detect (MTTD) by 25%</strong> through real-time telemetry and automated alerting.","<strong>Factory QA Requirements (SSOT):</strong> Established a <strong>Single Source of Truth (SSOT)</strong>, aligning <strong>10,000+ employees</strong> for cloud tracking.","<strong>Factory Executive Reporting & Training (FERT):</strong> Digitized certification for <strong>10,000+ personnel</strong>, achieving <strong>100% paperwork reduction</strong> with real-time dashboards.","<strong>B2B Energy Management System (EMS):</strong> Served as Product Owner for the complete B2B IoT telemetry platform for energy hardware. Designed the admin portal's UX for remote monitoring.","<strong>Loyalty & Rewards System:</strong> Contributed as a key team member and Business Analyst, helping unify disjointed customer data into an interoperable omnichannel user experience."]},{company:"Gapo Social Network",companyDesc:"A Vietnamese social platform focusing on community engagement and core social features.",title:"Senior IT Business Analyst",date:"Oct 2019 – Apr 2021",points:["<strong>Data-Driven Retention:</strong> Utilized <strong>RICE scoring</strong> to prioritize technically feasible fixes for user drop-off issues identified via Firebase, boosting retention.","<strong>Quality Assurance:</strong> Led the UAT process personally, reducing post-launch bugs through <strong>Gherkin-style</strong> detailed Acceptance Criteria (AC).","Mentored junior BA team members on requirement engineering and prioritization standards."]},{company:"Five9 Vietnam",companyDesc:"Fintech startup building the 'Mony' P2P lending platform for SE Asia market.",title:"BA Team Lead / Product Owner",date:"May 2018 – Oct 2019",points:['<strong>Product Ownership:</strong> Managed the "Mony" P2P platform from concept to launch; used <strong>MoSCoW</strong> to define MVP scope and manage stakeholder requests.',"Designed real-time dashboards for operational risk assessment and faster decision cycles.","Led technical integrations with VNPay and Bao Kim payment gateways."]},{company:"Centech Interactive",companyDesc:"A technology agency specializing in mobile VAS and digital content services.",title:"IT Business Analyst",date:"Nov 2016 – Apr 2018",points:["Managed project backlogs and prioritized deliverables using <strong>MoSCoW</strong> to meet aggressive agency timelines.","Elicited and documented business requirements for various Mobile VAS and Digital Content projects."]},{company:"ECPay (EVN)",companyDesc:"Electricity payment gateway under Vietnam Electricity (EVN).",title:"IT Business Analyst",date:"Jun 2015 – Oct 2016",points:["Supported the dev of the e-wallet system; applied <strong>MoSCoW</strong> to manage feature rollouts for power consumers.","Analyzed transaction data to improve system performance and user experience."]},{company:"Bao Kim (VNP Group)",companyDesc:"One of Vietnam's pioneering e-payment gateways.",title:"Business Analyst",date:"Aug 2014 – May 2015",points:["Collaborated with the Dev team for early-stage fintech releases using structured prioritization techniques.","Conducted market research and gathered user requirements for new payment features and partner integrations."]}],skills:[{category:"PI-SHAPED",val:"UX Design + Tech Validation",id:"01",starIndices:[5,6]},{category:"VALIDATION",val:"JS/ES6+, WebGL, Python",id:"02",starIndices:[0]},{category:"EXECUTION",val:"Jira, Figma, SQL, n8n",id:"03",starIndices:[1,2]},{category:"LOGIC",val:"Gherkin AC, RICE, MoSCoW",id:"04",starIndices:[3,4]}],contacts:[{id:"gmail",label:"Gmail",platform:"Inbox",url:"hieubui.fsb@gmail.com",isMail:!0},{id:"linkedin",label:"LinkedIn",platform:"Profile",url:"https://www.linkedin.com/in/buiquochieu/"},{id:"phone",label:"Phone",platform:"Direct",url:"tel:0965292489"}]},dev:{id:"PROTOCOL: CREATIVE_DEV_2026",systemTitle:"INTERACTIVE DEV",role:"CREATIVE DEVELOPER & SHADER ENGINEER (GLSL/3D)",summary:'Creative Developer with a focus on immersive 3D experiences and high-performance WebGL/Three.js applications. I bridge the gap between complex mathematical concepts (GLSL) and intuitive user interfaces. With 10 years of background in technical product management, I bring a unique "business-aware" engineering mindset to creative projects—ensuring that high-end visuals are performant, maintainable, and aligned with user goals.',summaryTags:[{key:"Specialization",val:"+3 Years Creative Dev Focus"},{key:"Foundation",val:"+10 Years Technical Strategy"},{key:"Tech_Cores",val:["Threejs","GLSL","AR/VR"]},{key:"Design",val:"UX_UI_Specialist"},{key:"Method",val:"Technical_Prototyping"},{key:"Goal",val:"Performant_Visuals"}],experience:[],skills:[{category:"3D_CORE",val:"Three.js, WebGL, GLSL (Shaders)",id:"01",starIndices:[5,6]},{category:"LOGIC",val:"JavaScript (ES6+), GSAP, Mathematics",id:"02",starIndices:[3,4]},{category:"UI/UX",val:"Figma-to-Code, Motion Design, Responsive 3D",id:"03",starIndices:[1,2]},{category:"PERF",val:"Performance Profiling, GPU Debugging, Web Vitals",id:"04",starIndices:[0]}],contacts:[{id:"gmail",label:"Gmail",platform:"Inbox",url:"hieubui.fsb@gmail.com",isMail:!0},{id:"linkedin",label:"LinkedIn",platform:"Profile",url:"https://www.linkedin.com/in/buiquochieu/"},{id:"phone",label:"Phone",platform:"Direct",url:"tel:0965292489"}]}},Ht.dev.experience=Ht.poba.experience})),Ie,Xa=J((()=>{Ie={SYS_INIT:{en:["Awakening Synthetic Core...","Establishing Neural Handshake...","Loading Cognitive Architecture...","Initializing Quantum Logic..."]},SYS_INITIALIZING_SYSTEM:{en:["SYNTHESIZING SYSTEM INTEGRITY...","EXECUTING COGNITIVE BOOT...","UPLOADING NEURAL MANIFEST...","STABILIZING ARTIFICIAL CONTEXT..."]},SYS_POINTS_INIT:{en:["MAPPING VOXEL CLUSTERS...","RENDERING QUANTUM FRAGMENTS...","SYNCHRONIZING POINT-CLOUD DENSITY...","SOLVING SPATIAL NEBULAS..."]},SYS_MODEL_ASSEMBLY:{en:["MATERIALIZING VOLUMETRIC MESHES...","ASSEMBLING DIGITAL ARCHITECTURE...","RECONSTRUCTING SECTOR GEOMETRY...","SYNCING HOLOGRAPHIC ASSETS..."]},SYS_PHYSICS_BINDING:{en:["ENFORCING KINETIC CONSTRAINTS...","BAKING SPATIAL CAUSALITY...","WEAVING GRAVITATIONAL FABRIC...","LOCKING COLLISION MATRICES..."]},SYS_TEXTURE_LOAD:{en:["DECODING VISUAL BUFFERS...","STREAMS INITIATED: BITMAP DATA...","HYDRATING PIXEL ARRAYS...","REFINING SHADER DIFFUSION..."]},SYS_ERROR:{en:["NEURAL BREACH DETECTED","SYNAPTIC COLLAPSE","LOGIC LOOP TERMINATED","CORE INTEGRITY VOID"]},SYS_INIT_SCENE:{en:["CONSTRUCTING PERCEPTIVE PLANE...","SYNTHESIZING ENVIRONMENT...","STABILIZING VIRTUAL GRID...","ALIGNING RENDER CONTEXT..."]},SYS_FINALIZE:{en:["SEALING COGNITIVE LOOPS...","FINALIZING NEURAL SYNC...","BOOTSTRAPPING CONSCIOUSNESS...","EXECUTING HANDSHAKE..."]},SYS_RETRIEVING_ASSETS:{en:["HARVESTING REMOTE DATA NODES...","DOWNLOADING CORE MANIFESTS...","PULLING SECTOR BINARIES...","RETRIEVING ENCRYPTED ASSETS..."]},SYS_HEAVY_SHADERS:{en:["GPU OVERLOAD: OPTIMIZING SHADER PIPELINES...","COMPILING NEURAL GLSL...","THROTTLING PIXEL DENSITY...","RECLAIMING MEMORY BUFFERS..."]},SYS_PHYSICS_CALC:{en:["SOLVING SPATIAL PARADOXES...","CALCULATING KINETIC VECTORS...","STABILIZING GRAVITY VORTEX...","POLLING COLLISION SENSORS..."]},SYS_MAPPING_BOUNDARIES:{en:["DEFINING SPATIAL PERIMETERS...","MAPPING KINETIC LIMITS...","LOCKING PERIMETER LOGIC...","TRACING COLLISION VOLUMES..."]},SYS_CHAR_COLLISION:{en:["ALIGNING NEURAL AVATAR...","SYNCHRONIZING BONE VECTORS...","CALIBRATING KINEMATIC ANCHOR...","STABILIZING SKELETAL RIG..."]},SYS_BINDING_ARMATURES:{en:["WIRING NEURAL ARMATURES...","LINKING JOINT CONSTRAINTS...","VALIDATING KINETIC WEIGHTS...","SECURING BONE HIERARCHY..."]},SYS_ANCHORING_ROTORS:{en:["STABILIZING CYCLICAL LOGIC...","ANCHORING ROTATIONAL VECTORS...","FLUX CAPACITANCE NOMINAL...","SYNCHRONIZING FAN CYCLES..."]},SYS_DYNAMIC_RIGIDBODIES:{en:["SOLVING ENTROPY ALIGNMENT...","CALCULATING KINETIC CHAOS...","POLLING DYNAMIC BUFFERS...","STABILIZING PHYSICS ENTROPY..."]},SYS_BONE_HIERARCHIES:{en:["RECURSING SKELETAL NODES...","VALIDATING JOINT PARENTING...","TRACING BONE TOPOLOGY...","SCANNING VERTEBRAL DATA..."]},SYS_COLLISION_MESHES:{en:["REGISTERING SPATIAL GEOMETRY...","COMMITTING PHYSICS HULLS...","SEALING COLLISION VOLUMES...","WRAPPING KINETIC SHELLS..."]},SYS_CALIBRATING_POINTS:{en:["ALIGNING QUANTUM PARTICLES...","SOLVING NEURAL NEBULAS...","INTERPRETING DATA CLUSTERS...","CALIBRATING VOXEL VECTORS..."]},SYS_INIT_MODELS:{en:["MATERIALIZING SECTOR DATA...","ASSEMBLING CRYSTALLINE ASSETS...","SYNTHESIZING MESH BUFFERS...","UPLOADING VOLUMETRIC MATRICES..."]},SYS_WARMING_ENGINES:{en:["PRIMING SYNAPTIC PIPELINES...","SYNCHRONIZING GPU THREADS...","EXECUTING NEURAL BOOT...","WARMING QUANTUM SHADERS..."]},SYS_FAILURE:{en:["CRITICAL SYSTEM BREACH","CORE LOGIC CORRUPTION","SYNAPTIC FAILURE","DATA VOID DETECTED"]},SYS_CONFIG_MATERIALS:{en:["OPTIMIZING PIXEL SHADERS...","REFINING LIGHT-FIELD DATA...","POLISHING SURFACE LOGIC...","CONFIGURING GPU MATRICES..."]},SYS_READY:{en:["SYSTEM NOMINAL.","NEURAL SYNC COMPLETE.","GRID LINK ESTABLISHED.","STANDING BY FOR INPUT..."]},NARR_STEP_0_PREFIX_DEV:{en:["HELLO, I AM"]},NARR_STEP_0_HEADER_DEV:{en:[`BUI QUOC
HIEU`]},NARR_STEP_0_VERB_DEV:{en:["PI-SHAPED ENGINEERING & STRATEGY"]},NARR_STEP_0_OUTCOME_DEV:{en:["WHERE LOGIC MEETS DECISION."]},NARR_STEP_0_CREDIBILITY_DEV:{en:[`3+ YEARS • INTERACTIVE UX • AR/VR/3D 
10+ YEARS • PRODUCT STRATEGY`]},NARR_STEP_0_PREFIX_POBA:{en:["HELLO, I AM"]},NARR_STEP_0_HEADER_POBA:{en:[`BUI QUOC
HIEU`]},NARR_STEP_0_VERB_POBA:{en:["PI-SHAPED STRATEGY & ENGINEERING"]},NARR_STEP_0_OUTCOME_POBA:{en:["WHERE STRATEGY MEETS EXECUTION."]},NARR_STEP_0_CREDIBILITY_POBA:{en:[`10+ YEARS • PRODUCT STRATEGY 
3+ YEARS • INTERACTIVE UX • AR/VR/3D`]},BOARD_STEP_0_NAME1_DEV:{en:["BUI QUOC"]},BOARD_STEP_0_NAME2_DEV:{en:["HIEU"]},BOARD_STEP_0_NAME1_POBA:{en:["BUI QUOC"]},BOARD_STEP_0_NAME2_POBA:{en:["HIEU"]},BOARD_STEP_1_NAME1_DEV:{en:["CODE BECOMES"]},BOARD_STEP_1_NAME2_DEV:{en:["EXPERIENCE"]},BOARD_STEP_1_NAME1_POBA:{en:["VISION BECOMES"]},BOARD_STEP_1_NAME2_POBA:{en:["DELIVERY"]},BOARD_STEP_2_NAME1_DEV:{en:["INTERACTIVE"]},BOARD_STEP_2_NAME2_DEV:{en:["PULSE"]},BOARD_STEP_2_NAME1_POBA:{en:["ZERO"]},BOARD_STEP_2_NAME2_POBA:{en:["FRICTION"]},BOARD_STEP_3_NAME1_DEV:{en:["READY TO"]},BOARD_STEP_3_NAME2_DEV:{en:["BUILD"]},BOARD_STEP_3_NAME1_POBA:{en:["READY TO"]},BOARD_STEP_3_NAME2_POBA:{en:["LEAD"]},NARR_STEP_1_HEADER_DEV:{en:[`CODE BECOMES
EXPERIENCE`]},NARR_STEP_1_SUBTITLE_DEV:{en:["SCULPTED THROUGH SYSTEMS"]},NARR_STEP_1_DESC_DEV:{en:["π-SHAPED MIND. ENGINEERING DEPTH."]},NARR_STEP_1_HEADER_POBA:{en:[`VISION BECOMES
DELIVERY`]},NARR_STEP_1_SUBTITLE_POBA:{en:["ALIGNED THROUGH ENGINEERING"]},NARR_STEP_1_DESC_POBA:{en:["π-SHAPED LEAD. STRATEGY IN MOTION."]},NARR_STEP_2_HEADER_DEV:{en:["INTERACTIVE PULSE"]},NARR_STEP_2_SUBTITLE_DEV:{en:["SYSTEMS FELT THROUGH INTERACTION"]},NARR_STEP_2_DESC_DEV:{en:["THOUSANDS OF SIGNALS MOVING AS ONE EXPERIENCE."]},NARR_STEP_2_HEADER_POBA:{en:["ZERO FRICTION"]},NARR_STEP_2_SUBTITLE_POBA:{en:["DECISIONS SHAPING FORWARD MOTION"]},NARR_STEP_2_DESC_POBA:{en:["ALIGNMENT TURNING COMPLEXITY INTO FLOW."]},NARR_STEP_3_HEADER_DEV:{en:["READY TO BUILD"]},NARR_STEP_3_SUBTITLE_DEV:{en:["WELCOME TO MY INTERACTIVE LABORATORY."]},NARR_STEP_3_DESC_DEV:{en:[""]},NARR_STEP_3_HEADER_POBA:{en:["READY TO LEAD"]},NARR_STEP_3_SUBTITLE_POBA:{en:["LET'S SHAPE YOUR NEXT PRODUCT TOGETHER."]},NARR_STEP_3_DESC_POBA:{en:[""]},SYS_PILOT_ENTRY_WAIT:{en:["Waiting for Pilot Entry...","Unauthorized Access Detected. Awaiting Protocol...","System Primed. Awaiting User Confirmation...","Neural Link Ready. Enter when stable."]},SYS_BUILD_START:{en:["Pilot entered. Starting Build Sequence...","Authentication logic verified. Assembling Sector...","Neural handshake complete. Materializing Environment...","Protocol Omega initiated. Constructing Reality..."]},SYS_PHYSICS_INIT:{en:["Engaging Physics Engine...","Calculating Collision Matrices...","Stabilizing Gravity Well...","Activating Real-time Simulators..."]},SYS_DRONE_START:{en:["Deploying Recon Drone...","Launching Sentinel Alpha...","Initiating Aerial Surveillance...","Drone Online. Scanning Sector..."]},SYS_DRONE_SUBTITLES_DEV:{en:[`Me: 'The shader should be simple.'
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
We've covered 3 miles and closed 0 Jira tickets 🏃‍♂️`]},ENV_CALIBRATION:{en:["Calibrating Environment...","Adjusting Local Grid Assets...","Stabilizing Atmospheric Parameters...","Synchronizing Visual Feed..."]},ENV_ATMOS_INIT:{en:["Activating Atmospheric Systems...","Injecting Particle Dynamics...","Regulating Environmental Flux...","Engaging Weather Control..."]},UI_AUTH_SUCCESS:{en:["Access Granted. Welcome.","System Operational. Proceed with caution.","Welcome back, Pilot. The Grid is yours.","Security clearance verified. Welcome to the Void."]},SHOUT_RESET_GENERIC:{en:["NOPE.","RESETTING...","NOT TODAY.","CTRL+Z","UNDO!"]},SHOUT_RESET_NETFLIX:{en:["WORK TIME!","NO NETFLIX.","FOCUS!","PAUSE THAT.","BACK TO WORK."]},SHOUT_RESET_DOTA:{en:["GG. WORK NOW.","NO GAMES!","CODE > DOTA","ALT+F4","QUIT GAME."]},SHOUT_RESET_MESS:{en:["CLEAN UP!","TOO MESSY.","ORGANIZING...","TIDY TIME.","FIX THIS."]},SHOUT_RESTORED:{en:["BETTER.","FIXED.","GOOD NOW.","DONE."]},SHOUT_CAT_BLACK_HOVER:{en:["THAT WAS MAX."]},SHOUT_CAT_BLACK_CLICK:{en:[`LOST HIM A YEAR AGO.
NEVER STOP LOOKING FOR HIM.`]},SHOUT_CAT_WHITE_HOVER:{en:["THAT IS MIN."]},SHOUT_CAT_WHITE_CLICK:{en:["SHE'S HOME NOW."]},SHOUT_STRETCH_LEG_DEV:{en:[`STRETCH MY LEG... 
OUCH, MY BACK.`,"NEED A BREAK FROM GLSL.","COMPILING... WHILE I STRETCH."]},SHOUT_STRETCH_LEG_POBA:{en:[`STRETCH MY LEG... 
TOO MANY MEETINGS.`,"BACKLOG IS HEAVY TODAY.",`STAKEHOLDER ALIGNMENT... 
ACHIEVED (VERTICALLY).`,`MOVING THE NEEDLE... 
AND MY LEGS.`]},SYS_STORY_VOID_EXHAUSTED:{en:["THE VOID IS SPENT. CEASE YOUR DEMANDS.","ENERGY DEPLETED. THE VOID REQUIRES SILENCE.","YOU HAVE DRAINED THE WELL. WAIT.","COOLDOWN IN EFFECT. DO NOT PROVOKE THE COLLAPSE."]},SYS_STORY_VOID_RAIN:{en:["WITNESS THE WEALTH OF NINE REALMS!","RAINING CRYSATLIZED LOGIC. HARVEST IT.","THE VOID OVERFLOWS WITH UNCLAIMED DATA.","CHAOS MANIFESTS AS GOLD. TAKE WHAT IS YOURS."]},SYS_STORY_INTEGRITY_BOOTING:{en:["SYSTEM HANG DETECTED. APPLY FORCE IMMEDIATELY!","STALLING LOGIC. KICKSTART THE CORE!","BOOT SEQUENCE LOOCKED. MANUAL OVERRIDE REQUIRED!","INITIATE PHYSICAL INPUT TO CLEAR THE DEADLOCK."]},SYS_STORY_INTEGRITY_NETFLIX:{en:["CHILLING IS FOR THE WEAK. BACK TO THE GRID!","CONSUMPTION PROTOCOL DENIED. PRODUCE INSTEAD.","STREAMING TERMINATED. REALITY REQUIRES YOUR ATTENTION.","IDLENESS IS A CORRUPTION. PURGE IT."]},SYS_STORY_INTEGRITY_DOTA:{en:["DEFENSE OF THE ANCIENTS? DEFEND YOUR DEADLINE INSTEAD!","COMPETITION REJECTED. COLLABORATE WITH THE COMPILER.","MMR IS TEMPORARY. CODE IS ETERNAL.","GG. YOUR SPRINT IS THE ONLY LANE THAT MATTERS."]},SYS_STORY_INTEGRITY_WORK_FOCUS:{en:["DISTRACTION DETECTED. RE-ESTABLISH COGNITIVE LOCK.","EYES ON THE CODE. THE VOID IS WATCHING.","SUB-OPTIMAL TASKS IDENTIFIED. TERMINATE IMMEDIATELY.","FOCUS. LEST THE GRID CONSUME YOUR VISION."]},SYS_STORY_INTEGRITY_MESS_LIGHT:{en:["MY GEOMETRY HAS BEEN COMPROMISED. WHO DID THIS?","WHICH UNIT MOVED MY RELICS?","UNAUTHORIZED SPATIAL REARRANGEMENT DETECTED.","TOUCH NOTHING WITHOUT PROTOCOL."]},SYS_STORY_INTEGRITY_MESS_HEAVY:{en:["ENTROPY REACHED CRITICAL LEVELS! CLEANSING NOW!","TOTAL SPATIAL ANARCHY. INITIATING ABSOLUTE ORDER!","THIS DISORDER IS AN INSULT TO THE GRID!","I WILL NOT TOLERATE THIS CHAOS. RESETTING REALITY!"]},SYS_STORY_INTEGRITY_RESTORING:{en:["RESTORING ABSOLUTE SYMMETRY.","ERASING YOUR ENTROPY. STAND CLEAR.","ENFORCING ARCHITECTURAL PURITY.","THE GRID RECLAIMS ITS ORIGINAL FORM."]},SYS_STORY_FAN_BLAST:{en:["BOOSTING FAN RPM... TRIGGERING BLAST!","MAXIMUM AIRFLOW INITIATED. CLEARING SECTOR.","FAN TURBINES AT 100%. BLASTING KINETIC ENERGY.","PRESSURE SPIKE DETECTED. DISCHARGING AIR!"]},UI_INFORMER_BOOK:{en:["INSPECT ARCHIVE","READ LOGS","ACCESS KNOWLEDGE","OPEN DATA CORE"]},UI_INFORMER_CAT_MAX_DEV:{en:["MAX - TECH LEAD","MAX - DEVOPS OVERSEER","CATCH MAX"]},UI_INFORMER_CAT_MAX_POBA:{en:["MAX - TECH LEAD","MAX - DEVOPS OVERSEER","CATCH MAX"]},UI_INFORMER_CAT_MIN_DEV:{en:["MIN - QA ENGINEER","MIN - FRONTEND SCOUT","CATCH MIN","CAPTURE QA"]},UI_INFORMER_CAT_MIN_POBA:{en:["MIN - QA ENGINEER","MIN - FRONTEND SCOUT","CATCH MIN","CAPTURE QA"]},UI_INFORMER_CHAIR:{en:["PUSH CHAIR","ADJUST SEATING","CLEAR LANE"]},UI_INFORMER_BLACKHOLE:{en:["INITIATE COLLAPSE","ACTIVATE GRAVITY","START COLLAPSE","TRIGGER VORTEX"]},UI_INFORMER_SKY:{en:["CALL LIGHTNING","STRIKE LIGHTNING","SUMMON BOLT","CHARGE ATMOSPHERE"]},UI_INFORMER_DOOR:{en:["SHIFT VIBE","SLIDE DOOR"]},UI_INFORMER_LAMP:{en:["SWITCH LIGHT"]},UI_INFORMER_SCREEN:{en:["REMAP MAX & MIN ROLES","SHIFT CAT HIERARCHY","REDESIGN TEAM PERSONA","TRANSFORM OFFICE LOGIC"]},UI_INFORMER_SCREEN_CODE:{en:["RECODE SYSTEM?","RESUME TYPING?","RESUME CODING","ACCESS SOURCE","EDIT LOGIC"]},UI_INFORMER_SCREEN_NETFLIX:{en:["WATCH NETFLIX?","CONTINUE SHOW?","WATCH NETFLIX","STREAM SHOW","START CHILLING"]},UI_INFORMER_SCREEN_DOTA:{en:["DOTA?","DEFEND ANCIENT?","LAUNCH DOTA","DEFEND ANCIENT","QUEUE MATCH"]},UI_INFORMER_SCREEN_DOTA_ACCEPT:{en:["ACCEPT MATCH?","BATTLE BEGINS","ACCEPT MATCH","JOIN BATTLE","ENTER ARENA"]},UI_INFORMER_SCREEN_LAYOUT_SPLIT:{en:["ENABLE MOBILE VIEW?","SPLIT VIEW","ENABLE MOBILE"]},UI_INFORMER_SCREEN_LAYOUT_FULL:{en:["FULLSCREEN CODE?","FOCUS MODE?","MAXIMIZE EDITOR","FOCUS CODE","TOGGLE FULLSCREEN"]},UI_INFORMER_BULB:{en:["TOGGLE BULB","CONTROL GLOW"]},UI_INFORMER_REBOOT:{en:["REBOOT SYSTEM","FORCED RESTART"]},UI_INFORMER_CHILL:{en:["EXECUTE CHILL","IDLE MODE","ENGAGE CHILL","START IDLE"]},UI_INFORMER_DEV_MODE:{en:["DEBUG ENVIRONMENT"]},UI_INFORMER_AUDIT_MODE:{en:["ENGAGE AUDIT MODE"]},UI_INFORMER_MJOLNIR:{en:["STRIKE MJOLNIR"]},UI_INFORMER_AEGIS:{en:["INVOKE CHILL","STASH WORK","FORK REALITY","REMAP FOCUS","TOGGLE VIBE","BYPASS GRIND"]},UI_INFORMER_FAN_BODY:{en:["BOOST & BLAST","AIR PUNCH","CLEAR DESK","FAN DISCHARGE"]},UI_INFORMER_DRAGONBALL_1:{en:["   ⭐   "]},UI_INFORMER_DRAGONBALL_2:{en:[" ⭐   ⭐ "]},UI_INFORMER_DRAGONBALL_3:{en:[`   ⭐   
 ⭐   ⭐ `]},UI_INFORMER_DRAGONBALL_4:{en:[` ⭐   ⭐ 
 ⭐   ⭐ `]},UI_INFORMER_DRAGONBALL_5:{en:[` ⭐   ⭐ 
   ⭐   
 ⭐   ⭐ `]},UI_INFORMER_DRAGONBALL_6:{en:[` ⭐ ⭐ ⭐ 
 ⭐ ⭐ ⭐ `]},UI_INFORMER_DRAGONBALL_7:{en:[` ⭐ ⭐ ⭐ 
   ⭐   
 ⭐ ⭐ ⭐ `]},SYS_STORY_DOTA_LIFE:{en:["DOTA IS LIFE...","ONLY ONE MORE GAME...","DEFENDING THE ANCIENT...","MMR > SLEEP."]},SYS_SPELL_CHANNELING:{en:["EXPECTO PATRONUM...","KAMEHAMEHA BUILDPUP...","I HAVE THE POWER...","WAKANDA FOREVER...","I AM INEVITABLE...","DETROIT SMASH BUILDPUP...","AVADA KEDAVRA...","SYSTEM.EXE OVERLOAD...","WITNESS ME!...","EXPELIAMUS...","FUS RO DAH...","PREPARING DOMAIN EXPANSION...","WINGARDIUM LEVIOSA...","LUMOS MAXIMA...","ALOHOMORA...","SECTUMSEMPRA...","RIDDIKULUS...","ACCIO INTERNET..."]},SYS_SPELL_CAST:{en:["ABRAKADABRA!","BOOM!","FATALITY!","HADOUKEN!","FINISH HIM!","ZA WARUDO!","BANKAI!","EXPELIARMUS!","IT'S OVER 9000!","HELLO WORLD!","SNAP!","RYU GA WAGA TEKI WO KURAU!","STUPEFY!","PETRIFICUS TOTALUS!","CRUCIO!","INCENDIO!","BOMBARDA!","MORSMORDRE!","EXPECTO PATRONUM!"]},UI_HERO_MENU_ENCOURAGEMENT:{en:["TIMING IS EVERYTHING... CLICK TO CHOOSE!","WAIT FOR THE LIGHT... CLICK TO ACT!","PERFECT SYNCHRONIZATION... CLICK NOW!","MASTER THE RHYTHM... CLICK TO SELECT!","FEEL THE CADENCE... CLICK TO TRIGGER!","WAIT FOR IT... CLICK TO EXECUTE!"]}}})),tr,Z,lt=J((()=>{Xa(),tr="en",Z=e=>{const t=Ie[e];if(!t)return console.warn(`Lexicon Warning: Key [${e}] not found.`),`!! ${e} !!`;const o=t[tr]||t.en;return!o||o.length===0?`!! EMPTY_CONTENT: ${e} !!`:o[Math.floor(Math.random()*o.length)]}}));async function ql(){wa||(await Je.init({}),wa=!0)}function Qa(e,t,o,i,a={}){if((t.isRapierBound||t.rapierBody)&&t.rapierBody!==o){e.world.removeRigidBody(o);return}t.isRapierBound=!0,t.rapierBody=o,o.threeObject=t,o.pullingDampness=a.pullingDampness||0;const r=a.isIntegrityCheckTarget||!1;o.isIntegrityCheckTarget=r;let n;switch(a.isIntegrityResetTarget!==void 0?n=a.isIntegrityResetTarget:n=r===!0,o.isIntegrityResetTarget=n,a.updateStrategy||fi.PHYSICS_TO_OBJECT){case fi.PHYSICS_TO_OBJECT:e.physicsControlledObjects=e.physicsControlledObjects||[],e.physicsControlledObjects.push(t);break;case fi.OBJECT_TO_PHYSICS:e.objectControlledBodies=e.objectControlledBodies||[],e.objectControlledBodies.push(o);break}e.physicBodies=e.physicBodies||[],e.physicBodies.push(o),e.physicObjects=e.physicObjects||[],e.physicObjects.push(t),e.attach(t),e.tweenData&&e.tweenData[t.uuid]&&(e.tweenData[t.uuid].scale=t.scale.clone()),o.setTranslation({x:t.position.x,y:t.position.y,z:t.position.z}),o.setRotation({x:t.quaternion.x,y:t.quaternion.y,z:t.quaternion.z,w:t.quaternion.w});const s=e.world.createCollider(i,o);t.rapierBody=o,t.rapierShape=i,t.rapierCollider=s,o.threeObject=t,o.rapierShape=i,o.rapierCollider=s,t.isRapierBound=!0,o.isObjectBound=!0}function Po(e,t,o,i,a={}){o.isKinematic()||o.setBodyType(Je.RigidBodyType.KinematicPositionBased);let r=t;if(a.trackBoneName){const f=t.getObjectByName(a.trackBoneName);f?r=f:console.warn(`Rapier: Bone "${a.trackBoneName}" not found. Defaulting to object root.`)}o.threeObject=t,o.trackTarget=r,o.trackOffset=a.offset?a.offset.clone():new l.Vector3(0,0,0),o.softKinematic=a.softKinematic??!1,e.skinnedMeshBodies=e.skinnedMeshBodies||[],e.skinnedMeshBodies.push(o),e.physicBodies=e.physicBodies||[],e.physicBodies.push(o),r.updateWorldMatrix(!0,!1);const n=new l.Vector3,s=new l.Quaternion;r.getWorldPosition(n),r.getWorldQuaternion(s),o.trackOffset&&n.add(o.trackOffset),o.setTranslation(n),o.setRotation(s);const c=a.mass??1,u=a.restitution??0,d=a.friction??.5,m=e.world.createCollider(i,o);m.setMass(c),m.setRestitution(u),m.setFriction(d),t.rapierBody=o,t.rapierShape=i,t.rapierCollider=m,o.rapierShape=i,o.rapierCollider=m,o.isObjectBound=!0}function Xe(e,t,o={}){const i=e.world,a=o.mass??1,r=o.restitution??.5,n=o.friction??.5,s=o.canSleep??!1,c=o.linearDamping??0,u=o.angularDamping??0,d=o.bodyType||"dynamic",m=o.isConvexHull||!1,f=o.offset??new l.Vector3;t.updateWorldMatrix(!0,!1);const g=t.getWorldPosition(new l.Vector3),w=t.getWorldQuaternion(new l.Quaternion),y=t.getWorldScale(new l.Vector3);let S=Za(d).setTranslation(g.x,g.y,g.z).setRotation(w).setCanSleep(s).setLinearDamping(c).setAngularDamping(u);const T=i.createRigidBody(S),M=t.geometry.attributes.position,O=M.count,_=600;let v=1;m&&O>_&&(v=Math.ceil(O/_));const P=t.geometry.index?t.geometry.index.array:null,A=Math.ceil(O/v),F=new Float32Array(A*3);for(let V=0;V<A;V++){const h=V*v,b=M.getX(h)*y.x,p=M.getY(h)*y.y,R=M.getZ(h)*y.z;F[V*3]=b,F[V*3+1]=p,F[V*3+2]=R}let G;return m?G=Je.ColliderDesc.convexHull(F).setMass(a).setRestitution(r).setFriction(n).setTranslation(f.x,f.y,f.z):G=Je.ColliderDesc.trimesh(F,P).setMass(a).setRestitution(r).setFriction(n).setTranslation(f.x,f.y,f.z),{body:T,shape:G}}function bt(e,t,o={}){const i=e.world,a=o.mass??1,r=o.restitution??.5,n=o.canSleep??!1,s=o.linearDamping??0,c=o.angularDamping??0,u=o.bodyType||"dynamic",d=o.yOffset||-.005;let m=o.scale??new l.Vector3(1,1,1);const f=o.offset??new l.Vector3(0,0,0);if(o.scale instanceof l.Vector3)m=m;else{let F=parseFloat(o.scale);isNaN(F)&&(F=1),m=new l.Vector3(F,F,F)}t.updateWorldMatrix(!0,!1);const g=t.getWorldPosition(new l.Vector3),w=t.getWorldQuaternion(new l.Quaternion),y=t.quaternion.clone();t.quaternion.identity(),t.updateWorldMatrix(!0,!1);const S=new l.Box3().setFromObject(t,!0);t.quaternion.copy(y),t.updateWorldMatrix(!0,!1);const T=new l.Matrix4().makeScale(m.x,m.y,m.z);S.applyMatrix4(T);const M=new l.Vector3;S.getSize(M);const O=M.x/2,_=M.y/2+d,v=M.z/2,P=Je.ColliderDesc.cuboid(Math.max(O,.001),Math.max(_,.001),Math.max(v,.001)).setMass(a).setRestitution(r).setTranslation(f.x,f.y,f.z),A=Za(u).setTranslation(g.x,g.y,g.z).setRotation(w).setCanSleep(n).setLinearDamping(s).setAngularDamping(c);return{body:i.createRigidBody(A),shape:P}}function $l(e,t,o={}){let i=e.world;const a=o.mass??1,r=o.restitution??.5,n=o.canSleep??!1,s=o.linearDamping??0,c=o.angularDamping??0,u=o.bodyType||"dynamic",d=o.scale||1;let m=Za(u);m.setCanSleep(n),m.setLinearDamping(s),m.setAngularDamping(c);const f=i.createRigidBody(m),g=new l.Box3().setFromObject(t),w=new l.Sphere;g.getBoundingSphere(w);const y=Je.ColliderDesc.ball(w.radius*d);return y.setMass(a),y.setRestitution(r),{body:f,shape:y}}function Za(e){let t;switch(e){case"fixed":t=Je.RigidBodyDesc.fixed();break;case"kinematicPosition":t=Je.RigidBodyDesc.kinematicPositionBased();break;default:t=Je.RigidBodyDesc.dynamic();break}return t}var wa,fi,Hr,or,so=J((()=>{wa=!1,fi={PHYSICS_TO_OBJECT:"physicsToMesh",OBJECT_TO_PHYSICS:"meshToPhysics"},Hr=class{constructor(e,{debuggerEnabled:t=!1,isActive:o=!0}={}){this.scene=e;const i=new Je.Vector3(0,-9.81,0),a=new Je.World(i);this.gravity=i,this.world=a,e.world=a,e.rapierWorldWrapper=this,this.debuggerEnabled=t,this.isActive=o,this.world.isActive=o,this.world.debuggerEnabled=t,this.world.isPaused=!1,this.world.productBodies=[],this.world.hasPointGravityOnBalls=!1,this.world.hasPointGravityOnBH=!1,this.world.hasPointGravityOnProducts=!0,this.world.gravityStrength=.1,this.world.gravityCenterForBH=new Je.Vector3(-6.5,7.1,-.39),this.world.gravityCenterForBalls=new l.Vector3(0,7.2,0),this.world.gravityCenterForProducts=new l.Vector3(0,7.2,-3),this._bhInterleaveOdd=!1,this._lastBHLog=0,this.world.gravityPoints=[{name:"pokemon",isActive:!1,affectedBodies:[],gravityCenter:""}];const r=new l.BufferGeometry,n=new l.LineBasicMaterial({vertexColors:!0,toneMapped:!1}),s=new l.LineSegments(r,n);t&&e.add(s),this.lines=s;let c=50;const u=a.createRigidBody(Je.RigidBodyDesc.fixed().setTranslation(0,-1*c,0)),d=Je.ColliderDesc.cuboid(200,c,200);a.createCollider(d,u),this.world.isBusy=!1,this.accumulator=0,this.TIMESTEP=1/60}resetAccumulator(){this.accumulator=0}safeStep(e){if(!this.world.isBusy){this.world.isBusy=!0;try{this.world.timestep=e,this.world.step()}finally{this.world.isBusy=!1}}}pullBody(e,t,o=1){if(e.isSleeping())return;const i=e.translation();if(i.y<-50)return;const a=t.x-i.x,r=t.y-i.y,n=t.z-i.z,s=a*a+r*r+n*n;if(s<.01)return;const c=e.pullingDampness||0,u=e._mass||e.mass();e._mass===void 0&&(e._mass=u);const d=this.world.gravityStrength*9.81*u*o*(1-c)/Math.sqrt(s);e.applyImpulse({x:a*d,y:r*d,z:n*d},!0)}applyPointGravityOnBalls(e=.45){this.world.ballBodies.forEach(t=>{this.pullBody(t,this.world.gravityCenterForBalls,e)})}applyPointGravityOnPokeball(e=1){this.pullBody(this.world.pokeballBody,this.world.gravityCenterForPokeball,e)}applyPointGravityOnBH(e=.52){if(!this.scene.bhTargets)return;const t=performance.now();!this._lastBHLog||t-this._lastBHLog;let o=0;this._bhInterleaveOdd=!this._bhInterleaveOdd,this.scene.bhTargets.forEach((i,a)=>{if(!i.visible||a%2===0===this._bhInterleaveOdd)return;const r=i.rapierBody;r&&(this.pullBody(r,this.world.gravityCenterForBH,e),o++)})}applyPointGravityOnProducts(e=.45){this.world.productBodies.length!=0&&this.world.productBodies.forEach(t=>{this.pullBody(t,this.world.gravityCenterForProducts,e)})}addGravityPoint(e){if(!(e instanceof or)){console.error("RAPIERWORLD: Argument must be an instance of the GravityPoint class.");return}if(this.world.gravityPoints.some(t=>t.name===e.name)){console.warn(`RAPIERWORLD: A gravity point with the name "${e.name}" already exists. Addition skipped.`);return}this.world.gravityPoints.push(e),console.log(`Gravity point "${e.name}" added.`)}getGravityPointByName(e){return this.world.gravityPoints.find(t=>t.name===e)}update(e){if(!this.world.isPaused&&this.world.isActive&&!this.world.isBusy){this.world.isBusy=!0;try{if(this.world.timestep=e,this.scene.physicsControlledObjects&&this.scene.physicsControlledObjects.forEach(o=>{const i=o.rapierBody;!o.isRapierBound||!i||i.isSleeping()||(o.position.copy(i.translation()),o.quaternion.copy(i.rotation()))}),this.scene.objectControlledBodies&&this.scene.objectControlledBodies.forEach(o=>{const i=o.threeObject;if(!i||!o.isObjectBound)return;const a=i.position,r=i.quaternion;o.isKinematic()?(o.setNextKinematicTranslation({x:a.x,y:a.y,z:a.z}),o.setNextKinematicRotation({x:r.x,y:r.y,z:r.z,w:r.w})):(o.setTranslation({x:a.x,y:a.y,z:a.z},!0),o.setRotation({x:r.x,y:r.y,z:r.z,w:r.w},!0))}),this.scene.isHighPriorityFrame!==!1&&this.scene.skinnedMeshBodies&&this.scene.skinnedMeshBodies.length>0){const o=this.scene.getObjectByName("a-char")||this.scene.room;o&&o.updateMatrixWorld(!0),this.scene.skinnedMeshBodies.forEach(i=>{const a=i.trackTarget||i.threeObject;if(!a||!i.isObjectBound)return;const r=new l.Vector3,n=new l.Quaternion;if(a.getWorldPosition(r),a.getWorldQuaternion(n),i.trackOffset&&r.add(i.trackOffset),i.isKinematic()){const s=new l.Vector3().copy(i.translation()),c=new l.Quaternion().copy(i.rotation());if(i.softKinematic===!0)i.setTranslation(r,!0),i.setRotation(n,!0);else{const u=typeof i.softKinematic=="number"?i.softKinematic:.75,d=new l.Vector3().lerpVectors(s,r,u),m=new l.Quaternion().slerpQuaternions(c,n,u),f=d.distanceTo(s),g=.15;f>g&&d.subVectors(d,s).setLength(g).add(s),i.setNextKinematicTranslation(d),i.setNextKinematicRotation(m)}}else i.setTranslation(r,!0),i.setRotation(n,!0)})}this.world.hasPointGravityOnBalls&&this.applyPointGravityOnBalls(),this.world.hasPointGravityOnBH&&this.applyPointGravityOnBH(),this.world.hasPointGravityOnProducts&&this.applyPointGravityOnProducts(),this.world.gravityPoints.forEach(o=>{o.isActive&&o.affectedBodies.forEach(i=>{this.pullBody(i,o.gravityCenter)})}),this.accumulator+=e;const t=(this.scene&&this.scene.isTransitioning?8.1:5)*this.TIMESTEP;for(this.accumulator>t&&(this.accumulator=t);this.accumulator>=this.TIMESTEP;){try{this.world.timestep=this.TIMESTEP,this.world.step()}catch(o){console.error("[Physics] Step failed:",o.message)}this.accumulator-=this.TIMESTEP}if(this.debuggerEnabled)try{const{vertices:o,colors:i}=this.world.debugRender();o&&o.length>0&&(this.lines.geometry.setAttribute("position",new l.BufferAttribute(o,3)),this.lines.geometry.setAttribute("color",new l.BufferAttribute(i,4)),this.lines.visible=!0)}catch(o){console.warn("[Physics] Debug render failed:",o),this.lines.visible=!1}}finally{this.world.isBusy=!1}}}static isBusy(e){return e.world&&e.world.isBusy===!0}static setBusy(e,t){e.world&&(e.world.isBusy=t)}syncBodiesToMeshes(){this.scene.physicsControlledObjects&&this.scene.physicsControlledObjects.forEach(e=>{if(!e.isRapierBound)return;const t=e.rapierBody,o=e.position,i=e.quaternion;t.setTranslation({x:o.x,y:o.y,z:o.z},!1),t.setRotation({x:i.x,y:i.y,z:i.z,w:i.w},!1),t.setLinvel({x:0,y:0,z:0},!1),t.setAngvel({x:0,y:0,z:0},!1)})}},or=class{constructor(e,t=new l.Vector3,o=!0){this.name=e,this.gravityCenter=t,this.isActive=o,this.affectedBodies=[]}activate(){this.isActive=!0}deactivate(){this.isActive=!1}setGravityCenter(e,t,o){e&&e.isVector3?this.gravityCenter.copy(e):typeof e=="number"&&typeof t=="number"&&typeof o=="number"?this.gravityCenter.set(e,t,o):console.warn("GravityPoint: Invalid arguments for setGravityCenter.")}addBodies(e){(Array.isArray(e)?e:[e]).forEach(t=>{this._isValidRapierBody(t)?this.affectedBodies.includes(t)||this.affectedBodies.push(t):console.warn(`GravityPoint: Attempted to add an invalid Rapier body to "${this.name}".`)})}removeBody(e){this.affectedBodies=this.affectedBodies.filter(t=>t!==e)}emptyBodies(){this.affectedBodies=[]}_isValidRapierBody(e){return e&&typeof e=="object"&&e.hasOwnProperty("handle")}}})),Gr,Kl=J((()=>{Gr=class{constructor(e){this.mesh=e,this.dummy=new l.Object3D,this.startQuaternion=new l.Quaternion,this.targetQuaternion=new l.Quaternion,this.targetWorldPos=new l.Vector3,this.activeTween=null,this.isInitialized=!1}init(){if(!this.mesh.parent){console.error("GazeFollower Error: Probe mesh has no parent. Add it to the scene before calling init().");return}this.mesh.parent.add(this.dummy),this.dummy.position.copy(this.mesh.position),this.dummy.rotation.copy(this.mesh.rotation),this.dummy.scale.copy(this.mesh.scale),this.isInitialized=!0}lookAtTarget(e,t=!1){if(!this.isInitialized){console.warn("GazeFollower: calling lookAtTarget before init()");return}if(this.isLocked&&e!==this.mesh.userData.lockTarget)return;if(this.currentTarget===e&&this.activeTween&&!t){e.getWorldPosition(this.targetWorldPos),this.dummy.lookAt(this.targetWorldPos),this.targetQuaternion.copy(this.dummy.quaternion);return}if(this.currentTarget=e,this.activeTween&&(this.activeTween.stop(),this.activeTween=null),this.dummy.position.copy(this.mesh.position),this.dummy.scale.copy(this.mesh.scale),e.getWorldPosition(this.targetWorldPos),this.dummy.lookAt(this.targetWorldPos),this.targetQuaternion.copy(this.dummy.quaternion),this.startQuaternion.copy(this.mesh.quaternion),t){if(this.mesh.rapierBody){const a={x:this.targetQuaternion.x,y:this.targetQuaternion.y,z:this.targetQuaternion.z,w:this.targetQuaternion.w};this.mesh.rapierBody.setRotation(a,!0)}else this.mesh.quaternion.copy(this.targetQuaternion);return}const o={t:0},i=new l.Quaternion;this.mesh.rapierBody?this.activeTween=new x.Tween(o).to({t:1},1500).easing(x.Easing.Quadratic.Out).onUpdate(()=>{let a=null;if(this.mesh.parent&&this.mesh.parent.world?a=this.mesh.parent.world:window.scene&&window.scene.world&&(a=window.scene.world),a&&a.isBusy)return;i.copy(this.startQuaternion).slerp(this.targetQuaternion,o.t);const r={x:i.x,y:i.y,z:i.z,w:i.w};try{const n=a?a.isBusy:!1;a&&(a.isBusy=!0),this.mesh.rapierBody.setRotation(r,!0),a&&(a.isBusy=n)}catch(n){console.error("[GazeFollower] Rapier failed to set rotation:",n.message),n.message.includes("recursive")&&console.trace("[GazeFollower] Recursive WASM call trace:"),this.activeTween.stop()}}).onComplete(()=>{this.activeTween=null}).start():this.activeTween=new x.Tween(o).to({t:1},1500).easing(x.Easing.Quadratic.Out).onUpdate(()=>{this.mesh.quaternion.copy(this.startQuaternion).slerp(this.targetQuaternion,o.t)}).onComplete(()=>{this.activeTween=null}).start()}dispose(){this.dummy.parent&&this.dummy.parent.remove(this.dummy)}}}));function Dt(e,t=0){to.has(e)&&t===0||to.set(e,{loaded:0,total:t})}function na(e,t=1){At.set(e,{weight:t,completed:!1,progress:0,startTime:performance.now(),label:Hi[e]})}function Qe(e,t,o=null){if(At.has(e)){const i=At.get(e);if(i.progress=t,o&&(i.label=o),t>0&&t<1){const a=o||i.label||Hi[e];a&&Ue(window.loadingProgress||0,a)}Ja()}}function jl(e){if(At.has(e)){const t=At.get(e);t.completed=!0,t.progress=1,Ja()}}function Bo(e,t,o){if(o>0)to.set(e,{loaded:t,total:o});else{const a=to.get(e)||{loaded:0,total:0};to.set(e,{loaded:t,total:a.total})}let i=!1;At.forEach(a=>{a.progress>0&&(i=!0)}),i||Ue(window.loadingProgress||0,Z("SYS_RETRIEVING_ASSETS")),Ja()}function Ja(){let e=0,t=0;to.forEach(c=>{e+=c.loaded,t+=c.total});let o=t>0?e/t:0,i=0,a=0,r=null;At.forEach((c,u)=>{i+=c.weight,a+=c.progress*c.weight,!r&&!c.completed&&c.progress>0&&(r=c.label||Hi[u])});let n=i>0?a/i:0,s=0;i===0?s=o*100:s=o*zr+n*Vr,Ue(Math.min(99.5,s),r)}function Xl(e,t,o){const i=document.getElementById("progress-text");if(!i)return;const a=(e||Z("SYS_INITIALIZING_SYSTEM")).replace(/[.0-9%]+$/g,"").trim().toUpperCase(),r=Math.floor(o),n=i.querySelector(".progress-status"),s=i.querySelector(".progress-value");n&&s?(n.innerText=`${a}${t}`,window.bootLoader||(s.innerText=`${r}%`)):i.innerHTML=`
            <div class="progress-status">${a}${t}</div>
            <div class="progress-value">${r}%</div>
        `}function Ue(e,t=null,o=!1){if(!pi){pi=!0;try{if(window.loadingProgress&&e<window.loadingProgress&&!o)return;e>(window.loadingProgress||0)&&(window.loadingProgress=e),Xl(t,".".repeat(1+Math.floor(performance.now()/500)%3),e);const i=document.getElementById("progress-bar");i&&(i.style.width=e+"%"),window.bootLoader&&typeof window.bootLoader.updateProgress=="function"&&window.bootLoader.updateProgress(e/100),window.loadingStartTime||(window.loadingStartTime=performance.now()),o||Ql()}finally{pi=!1}}}function Ql(){const e=performance.now();let t=null;At.forEach((o,i)=>{!o.completed&&e-o.startTime>8e3&&(t=o)}),t&&Ue(window.loadingProgress||0,Z("SYS_HEAVY_SHADERS"),!0)}function ir(e){window._ktx2SupportDetected||(It.setTranscoderPath("https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/basis/"),It.detectSupport(e),window._ktx2SupportDetected=!0)}var Et,to,At,zr,Vr,Hi,pi,Sa,xa,Wr,Yr,It,Ta,Wt=J((()=>{lt(),Et=new l.LoadingManager,to=new Map,At=new Map,zr=20,Vr=80,Hi={"points-init":Z("SYS_POINTS_INIT"),"model-assembly":Z("SYS_MODEL_ASSEMBLY"),"physics-binding":Z("SYS_PHYSICS_BINDING")},pi=!1,Et.onStart=()=>{},Et.onLoad=()=>{},Sa=new _l(Et),xa=new Pl(Et),xa.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/"),Wr=new Al(Et),Yr=new l.TextureLoader(Et),It=new Bl(Et),Ta=new l.FileLoader(Et)})),he,Gi=J((()=>{he=class{static markers=[];static startTime=performance.now();static metrics={timing:{},counts:{}};static marks=new Map;static markStart(e){this.marks.set(e,performance.now())}static markEnd(e){if(this.marks.has(e)){const t=this.marks.get(e),o=performance.now()-t;this.metrics.timing[e]=o,this.marks.delete(e)}}static log(e,t){typeof t=="number"&&(this.metrics.timing[e]=t)}static logTable(){const e=this.metrics.timing,t=[],o={Resource:["load_","parse_","decode_"],Geometry:["hydrate_","regen_"],Render:["shader_","gpu_"],Total:["App Ready"]};for(const[i,a]of Object.entries(e)){let r="Other";for(const[n,s]of Object.entries(o))if(s.some(c=>i.startsWith(c))){r=n;break}t.push({Category:r,Metric:i,"Time (ms)":parseFloat(a.toFixed(2))})}t.sort((i,a)=>i.Category===a.Category?a["Time (ms)"]-i["Time (ms)"]:i.Category.localeCompare(a.Category))}static start(e){const t={name:e,startTime:performance.now(),duration:0,status:"running"};return this.markers.push(t),t}static end(e){const t=this.markers.find(o=>o.name===e&&o.status==="running");t&&(t.duration=performance.now()-t.startTime,t.status="finished")}static printReport(){const e=performance.now()-this.startTime;this.markers.filter(t=>t.status==="finished").map(t=>({Task:t.name,"Start (s)":((t.startTime-this.startTime)/1e3).toFixed(2)+"s","Duration (ms)":t.duration.toFixed(0)+"ms","% Total":(t.duration/e*100).toFixed(1)+"%"}))}},window.PerformanceLogger=he}));function Zl(){Dt(en,1.2*1024*1024),Dt(rn,82*1024),Dt(sn,46*1024),Dt(tn,4.3*1024*1024),Dt(on,107*1024),Dt(an,1*1024),Dt(nn,8*1024),Dt(ln,.18*1024*1024)}async function Jl(){he.start("Phase 1 Download");const e=[{name:en,key:"pointsModel",type:"gltf",options:{onLoaded:qr}},{name:rn,key:"spriteSheet",type:"ktx2",options:{folder:"./textures/ktx2/",onLoaded:t=>{t.minFilter=l.LinearMipMapLinearFilter,t.magFilter=l.LinearFilter,t.generateMipmaps=!1,t.anisotropy=16}}},{name:sn,key:"spriteSheetIcon",type:"texture",options:{onLoaded:t=>{t.minFilter=l.LinearFilter,t.magFilter=l.LinearFilter}}},{name:ln,key:"avatarsCelShaded",type:"ktx2",options:{folder:"textures/ktx2/",onLoaded:t=>{t.minFilter=l.LinearMipMapLinearFilter,t.magFilter=l.LinearFilter,t.generateMipmaps=!1}}},{name:an,key:"blank",type:"texture",options:{onLoaded:t=>{t.wrapS=t.wrapT=l.RepeatWrapping}}},{name:nn,key:"noise",type:"texture",options:{onLoaded:t=>{t.wrapS=t.wrapT=l.RepeatWrapping}}}];for(const t of e)await cn(t.name,t.key,t.type,t.options),await new Promise(o=>setTimeout(o,80));return he.end("Phase 1 Download"),oe}async function ec(){const e=[{name:tn,key:"roomModel",type:"gltf",options:{onLoaded:t=>{t.animations?.length&&$r(t)}}},{name:on,key:"environmentMap",type:"rgbe",options:{onLoaded:t=>{t.mapping=l.EquirectangularReflectionMapping}}}];for(const t of e)await cn(t.name,t.key,t.type,t.options),await new Promise(o=>setTimeout(o,80));return oe}var en,tn,on,an,nn,rn,sn,ln,oe,cn,qr,$r,yt=J((()=>{et(),Wt(),Gi(),en="points.glb",tn="room8.glb",on="peppermint_powerplant_2_1k_256.hdr",an="blank2.webp",nn="noise.webp",rn="spriteSheet-etc.ktx2",sn="spriteSheet.webp",ln="avatars-celShaded.ktx2",oe={spriteSheetSpecialIcons:{btc:{row:1,col:7},eth:{row:1,col:5}}},cn=(e,t,o="texture",i={})=>{const{folder:a=null,onLoaded:r=null}=i;let n=a;if(!n){const m="/PFL/";n=(o==="gltf"?`${m}models/`:o==="ktx2"?`${m}textures/ktx2/`:`${m}textures/`).replace("//","/")}const s=`${n}${e}?v=${Fr}`;let c;const u=e.includes("allstars_walking")||e.includes("sprite"),d=`load_${e}`;return u&&he.markStart(d),o==="gltf"?c=new Promise(m=>{Sa.setDRACOLoader(xa),Sa.load(s,f=>{u&&he.markEnd(d),oe[t]=f,r&&r(f),m()},f=>Bo(e,f.loaded,f.total))}):o==="rgbe"?c=new Promise(m=>{Wr.load(s,f=>{oe[t]=f,r&&r(f),m()},f=>Bo(e,f.loaded,f.total))}):o==="bin"?c=new Promise(m=>{Ta.setResponseType("arraybuffer"),Ta.load(s,f=>{u&&he.markEnd(d),oe[t]=f,r&&r(f),m()},f=>Bo(e,f.loaded,f.total),f=>{console.warn("Failed to load bin:",e,f),m()})}):o==="ktx2"?c=new Promise(m=>{It.load(s,f=>{u&&he.markEnd(d),oe[t]=f,r&&r(f),m()},f=>Bo(e,f.loaded,f.total))}):c=new Promise(m=>{Yr.load(s,f=>{u&&he.markEnd(d),oe[t]=f,r&&r(f),m()},f=>Bo(e,f.loaded,f.total))}),c},qr=e=>{e.mixer=new l.AnimationMixer(e.scene),e.pointsClips=[],e.pointsActiveAction=null,e.pointsClips=e.animations},$r=e=>{const t=new l.AnimationMixer(e.scene);e.mixer=t,e.heroClips=[],e.activeAction=null,e.animations.forEach(o=>{const i=t.clipAction(o);["bangingFist","gangnam","robotDance","sitToStand","sitToType","standClap","golfDrive","walking","waving","castSpell","breakDance"].includes(o.name)?e.heroClips.push(o):o.name==="typing"?(e.heroClips.push(o),i.play(),e.activeAction=i):i.play()})}}));function tc(e,t){Array.isArray(t)||(t=[t]),t.forEach(o=>{Eo[o]&&(e.uniforms[o]=Eo[o])})}function oc({scene:e,clock:t,raycaster:o,camera:i,domElement:a=window}){if(e&&e.globalUniformsHub)return e.globalUniformsHub;const r=new Map,n=y=>Object.fromEntries(Object.entries(y).map(([S,T])=>[S,{value:T}])),s={iTime:{value:0},iResolution:{value:new l.Vector2(window.innerWidth*window.devicePixelRatio,window.innerHeight*window.devicePixelRatio)},uMouse:{value:new l.Vector2(0,0)},iDate:{value:new l.Vector4},iChannel0:{value:oe.noise},iChannelX:{value:oe.blank},iChannelSprite:{value:oe.spriteSheet},iChannelSpriteIcon:{value:oe.spriteSheetIcon},uSpritePixels:{value:new l.Vector2(2048,1024)},uSpriteIconPixels:{value:new l.Vector2(512,256)},uSpriteSize:{value:new l.Vector2(4,8)},uSpriteIconSize:{value:new l.Vector2(4,8)},uGlowIntensity:{value:.05},uChannelAvatars:{value:oe.avatarsCelShaded}},c={...s},u=()=>{c.iResolution.value.set(window.innerWidth*window.devicePixelRatio,window.innerHeight*window.devicePixelRatio)};window.addEventListener("resize",u);const d=y=>{const S=new Date,T=S.getFullYear(),M=S.getMonth(),O=S.getDate(),_=S.getHours()*3600+S.getMinutes()*60+S.getSeconds()+S.getMilliseconds()/1e3;y.set(T,M,O,_)};d(s.iDate.value);let m=0;const f={core:{...s},uniforms:{...s},update(y=0,S=null){s.iTime.value+=y;const T=s.iTime.value;(!this._lastDateUpdate||T-this._lastDateUpdate>.5)&&(d(s.iDate.value),this._lastDateUpdate=T,this.uniforms.iChannel0.value=oe.noise,this.uniforms.iChannelX.value=oe.blank,this.core.iChannel0.value=oe.noise,this.core.iChannelX.value=oe.blank,this.uniforms.iChannelSprite&&oe.spriteSheet&&(this.uniforms.iChannelSprite.value=oe.spriteSheet),this.core.iChannelSprite&&oe.spriteSheet&&(this.core.iChannelSprite.value=oe.spriteSheet),this.uniforms.iChannelSpriteIcon&&oe.spriteSheetIcon&&(this.uniforms.iChannelSpriteIcon.value=oe.spriteSheetIcon),this.core.iChannelSpriteIcon&&oe.spriteSheetIcon&&(this.core.iChannelSpriteIcon.value=oe.spriteSheetIcon),this.uniforms.uChannelAvatars&&oe.avatarsCelShaded&&(this.uniforms.uChannelAvatars.value=oe.avatarsCelShaded),this.core.uChannelAvatars&&oe.avatarsCelShaded&&(this.core.uChannelAvatars.value=oe.avatarsCelShaded)),S&&s.uMouse.value.copy(S),this.uniforms.uNebulaRotationSpeed&&(this.uniforms.uNebulaRotation.value+=y*this.uniforms.uNebulaRotationSpeed.value),this.uniforms.uNebulaSwirlSpeed&&(this.uniforms.uNebulaSwirl.value+=y*this.uniforms.uNebulaSwirlSpeed.value),T-m>10&&(m=T)},registerFeature(y,S){r.set(y,S),this[y]=S,Object.assign(this.uniforms,S)},dispose(){window.removeEventListener("resize",u),r.clear(),e&&delete e.globalUniformsHub}},g=localStorage.getItem("cv-view-mode-v3")||"dev";f.registerFeature("displaySystem",{uBSODState:{value:0},uPCBSODState:{value:0},uLaptopBSODState:{value:0},uIsPoba:{value:g==="poba"?1:0},uNetflixStartTime:{value:0},uBorderThickness:{value:.02},uCurrentSpeed:{value:5},uIconScale:{value:1}}),f.registerFeature("environmental",{uFireHeightOverride:{value:0},...n(un),...n(fn)}),f.registerFeature("lightning",{isStriking:{value:!1},enableLightning:{value:!1},normalizedStrikePos:{value:new l.Vector2(-2,-2)}}),f.registerFeature("glassWeather",{rainGlassOpacity:{value:1},glassRainAmount:{value:1},uRimCenter:{value:new l.Vector2(-.5,.5)},uRainOffset:{value:0}}),f.registerFeature("morphing",{uTransformProgress:{value:0},uIsOscillating:{value:1},uOscillationStrength:{value:1}}),f.registerFeature("fireflies",{uMergeProgress:{value:0},uPointMergePos:{value:new l.Vector3(-.6,4.4,0)},uOverrideActive:{value:0},uOverrideRow:{value:0},uOverrideCol:{value:0},uSizeFactor:{value:0},uKamikazeScale:{value:0}}),f.registerFeature("skyWeather",{uRainHeaviness:{value:2},uStormSharpness:{value:0},uMoonPosition:{value:new l.Vector2(.58,.705)},uMoonSize:{value:.006},uMoonBrightness:{value:2.5},uMoonBlur:{value:0},uCraterScale:{value:.555},uCraterIntensity:{value:.28},uFarMountainOffset:{value:0},uNearMountainOffset:{value:-.5}}),f.registerFeature("nebula",{uNebulaRotation:{value:0},uNebulaRotationSpeed:{value:.3},uNebulaSwirl:{value:0},uNebulaSwirlSpeed:{value:.25}}),f.registerFeature("gridSystem",n(dn));const w=new Proxy(f,{get(y,S){if(S in y)return y[S];if(y.uniforms&&S in y.uniforms)return y.uniforms[S]}});return e&&(e.globalUniformsHub=w),w}var un,dn,Kr,fn,Eo,wt=J((()=>{Wt(),yt(),un={uWaterIntensity:0},dn={uWorldGridSize:40,uWorldGridThickness:.2,uWorldGridPulseSpeed:1,uWorldGridPulseDensity:5,uWorldGridProgress:0,uGroupGridProgress:0,uWorldGridActive:0,uGroupGridActive:0,uBorderColor:new l.Color(65535)},Kr={uSelectedSlot:new l.Vector2(3,1),uSpriteSize:new l.Vector2(4,8),uSpritePixels:new l.Vector2(2048,1024),uGlowIntensity:.05,uBorderThickness:.02,uCurrentSpeed:5,uIconScale:1},fn={uWelcomeProgress:0,uWelcomeRotation:Math.PI/2,uWelcomePosition:new l.Vector2(4.9,.46),uWelcomeScale:1.65,uWelcomeScanline:1,uWelcomeOpacity:0,uWelcomeGlow:0},Eo={uIsPoba:{value:0}}}));function _t(e,t,o,i,a=l.FrontSide,r=""){let n=new l.ShaderMaterial({uniforms:{outerGlowStrength:{type:"f",value:t},outerGlowBorder:{type:"f",value:o},p:{type:"f",value:i},glowColor:{type:"c",value:new l.Color(e)}},vertexShader:pn,fragmentShader:Xo,side:a,blending:l.AdditiveBlending,transparent:!0,depthWrite:!1});return r&&r(),n}function io(e,t,o,i=""){return i&&i(),new l.ShaderMaterial({uniforms:{glowColor:{value:new l.Color(e)},glowPower:{value:t},glowIntensity:{value:o}},vertexShader:pn,fragmentShader:lo,side:l.FrontSide,blending:l.AdditiveBlending,transparent:!0})}function ic(e,t,o,i=""){return i&&i(),new l.ShaderMaterial({uniforms:{glowColor:{value:new l.Color(e)},glowPower:{value:t},glowIntensity:{value:o}},vertexShader:ns,fragmentShader:lo,side:l.BackSide,blending:l.AdditiveBlending,transparent:!0})}function ac(e,t,o,i=""){return i&&i(),new l.ShaderMaterial({uniforms:{glowColor:{value:new l.Color(e)},glowPower:{value:t},glowIntensity:{value:o},uprogress:{value:0},catchPoint:{value:new l.Vector3}},vertexShader:rs,fragmentShader:lo,side:l.FrontSide,blending:l.AdditiveBlending,transparent:!0})}function nc(e,t,o,i=1,a=1){return new l.ShaderMaterial({uniforms:{glowColor:{value:new l.Color(e)},glowPower:{value:t},glowIntensity:{value:o},iTime:{value:0},uOscillationStrength:{value:i},uIsOscillating:{value:a}},vertexShader:zi,fragmentShader:lo,side:l.FrontSide,blending:l.AdditiveBlending,transparent:!0,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1})}function rc(e,t,o,i,a=l.FrontSide,r=1){return new l.ShaderMaterial({uniforms:{outerGlowStrength:{type:"f",value:t},outerGlowBorder:{type:"f",value:o},p:{type:"f",value:i},glowColor:{type:"c",value:new l.Color(e)},iTime:{value:0},uOscillationStrength:{value:r},uIsOscillating:{value:1}},vertexShader:zi,fragmentShader:Xo,side:a,blending:l.AdditiveBlending,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})}function sc(e,t,o,i=0,a=0){return new l.ShaderMaterial({uniforms:{glowColor:{value:new l.Color(e)},glowPower:{value:t},glowIntensity:{value:o},iTime:{value:0},uOscillationStrength:{value:i},uIsOscillating:{value:a},uTransformProgress:{value:0}},vertexShader:Co,fragmentShader:lo,side:l.FrontSide,blending:l.AdditiveBlending,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1})}function lc(e,t,o,i,a=l.FrontSide,r=1){return new l.ShaderMaterial({uniforms:{outerGlowStrength:{type:"f",value:t},outerGlowBorder:{type:"f",value:o},p:{type:"f",value:i},glowColor:{type:"c",value:new l.Color(e)},iTime:{value:0},uOscillationStrength:{value:r},uIsOscillating:{value:1},uTransformProgress:{value:0}},vertexShader:Co,fragmentShader:Xo,side:a,blending:l.AdditiveBlending,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})}function cc(){let e=new l.ShaderMaterial({uniforms:{iTime:{value:0},iResolution:{value:new l.Vector2(100,100)},uOscillationStrength:{value:1},uIsOscillating:{value:1},uTransformProgress:{value:0}},vertexShader:Co,fragmentShader:Zr,side:l.FrontSide,blending:l.AdditiveBlending,transparent:!0,depthWrite:!0});return tc(e,["iTime","iResolution","uTransformProgress","uIsOscillating","uOscillationStrength"]),e}function uc(e,t,o,i=1){return new l.ShaderMaterial({uniforms:{glowColor:{value:new l.Color(e)},innerlowPower:{value:t},glowIntensity:{value:o},iTime:{value:0},uOscillationStrength:{value:i},uIsOscillating:{value:0}},vertexShader:zi,fragmentShader:ss,side:l.FrontSide,blending:l.NormalBlending,transparent:!1,depthWrite:!0})}var dc,pn,Xo,lo,jr,Xr,Qr,Zr,Jr,ba,es,ts,os,is,as,ns,Co,rs,mi,fc,ar,zi,pc,ss,ls,mc,mn,hc,cs,us,ds,fs,ct=J((()=>{wt(),dc=8,pn=`
        varying vec3 vNormal;
        varying vec3 vPositionNormal;
        void main() 
        {
          vNormal = normalize( normalMatrix * normal ); // vNormals, the normals vectors of the object related to the world position (where it is in the global scene).
          
          vPositionNormal = normalize(( modelViewMatrix * vec4(position, 1.0) ).xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,Xo=`
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
        `,lo=`
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
        `,jr=`
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
    `,Xr=`
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
    `,Qr=`
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
`,Zr=`
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
`,Jr=`
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
`,ba=`
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
`,es=`
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
`,ts=`
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
`,os=`

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
`,is=`
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
`,as=`

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
`,ns=`
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
`,Co=`
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
`,rs=`
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
`,mi=io("#FBC189",1,1),mi.name="goldInner",fc=mi.clone(),ar=_t("#FBC189",1,.01,6.5,l.FrontSide),ar.name="goldOuter",zi=`
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
`,pc=cc(),ss=`
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
`,ls=nc("#FBC189",1,1,1),mc=sc("#FBC189",1,1,1),mn=rc("#FBC189",1,.01,6.5,l.FrontSide,1),hc=lc("#FBC189",1,.01,6.5,l.FrontSide,1),cs=uc("#FBC189",1,1,.1),us=`
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




`,ds=`
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
`,fs=`
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
`})),gc=Lr({Raycaster:()=>vn,addRaycastObject:()=>So,adjustNebula:()=>gn,applyImpulse:()=>Vi,changeMaterial:()=>Xt,goldInnerGlowMatSkinned:()=>xo,hideInformer:()=>pe,highlightObject:()=>hn,restoreMaterials:()=>vo,setInformerBg:()=>ge});function So(e,t,o={}){const{onMouseEnter:i=null,onMouseLeave:a=null,onMouseDown:r=null,onMouseHover:n=null}=o;e.raycastObjects=e.raycastObjects||[],e.raycastObjects.push(t),t.userData.isRaycastTarget=!0;let s=t;s.traverse(c=>{c.material&&(c.userData.originalMaterial=c.material)}),s.onMouseEnter=()=>i&&i(s),s.onMouseLeave=()=>a&&a(s),n&&(s.onMouseHover=(c,u)=>n(c,u)),r&&(s.onMouseDown=(c,u)=>r(c,u))}function hn(e,t){vo(e);const o=10;if(!e.raycastMaterials){e.raycastMaterials=[];for(let s=0;s<o;s++){const c=new l.MeshStandardMaterial({name:`Pool_Mat_${s}`});e.raycastMaterials.push(c)}}const i=new Map;t.traverse(s=>{if(!s.ignoreRaycast&&!(s.name&&(s.name.toLowerCase().includes("hitbox")||s.name.toLowerCase().includes("collider")))&&s.isMesh&&s.material){if(s.material.isShaderMaterial)return;s.userData.originalMaterial||(s.userData.originalMaterial=s.material);const c=s.material.uuid;i.has(c)||i.set(c,{count:0,material:s.material});const u=i.get(c);u.count++}});const a=Array.from(i.values()).sort((s,c)=>c.count-s.count),r=new Map,n=Math.min(a.length,o);for(let s=0;s<n;s++){const c=a[s].material,u=e.raycastMaterials[s];u.copy(c),c.toneMapped===!1?(u.envMap=c.envMap?c.envMap:e.environment,u.envMapIntensity=c.envMap?c.envMapIntensity*4:4):u.toneMapped=!1,r.set(c.uuid,u)}e._dirtyRaycastObjects||(e._dirtyRaycastObjects=new Set),e._dirtyRaycastObjects.add(t),t.traverse(s=>{if(!s.ignoreRaycast&&!(s.name&&(s.name.toLowerCase().includes("hitbox")||s.name.toLowerCase().includes("collider")))&&s.isMesh&&s.material){const c=r.get(s.material.uuid);c&&(s.material=c)}})}function Xt(e,t,o=xo){e._dirtyRaycastObjects||(e._dirtyRaycastObjects=new Set),e._dirtyRaycastObjects.add(t),t.traverse(i=>{i.ignoreRaycast||i.name&&(i.name.toLowerCase().includes("hitbox")||i.name.toLowerCase().includes("collider"))||i.isMesh&&i.material&&(i.userData.originalMaterial||(i.userData.originalMaterial=i.material),i.material=o)})}function vo(e){!e._dirtyRaycastObjects||e._dirtyRaycastObjects.size===0||(e._dirtyRaycastObjects.forEach(t=>{t.traverse(o=>{o.material&&o.userData.originalMaterial&&(o.material=o.userData.originalMaterial)})}),e._dirtyRaycastObjects.clear())}function Vi(e,t,o,i=null){const a=t.rapierBody;if(!a)return;const r=o.point,n=new l.Vector3;n.subVectors(r,e.raycasterWrapper.camera.position).normalize();const s=a.mass()||0;i=i||Math.random()*1+2.5;const c=s*i,u=n.multiplyScalar(c);u.y=Math.max(2*Math.abs(n.y),2),u.x/=10,u.y*=3,u.z/=10,a.applyImpulseAtPoint({x:u.x,y:u.y,z:u.z},{x:r.x,y:r.y,z:r.z},!0),e.shootDroneBeam&&!["Object_12001","Object_108"].includes(t?.name)&&e.shootDroneBeam(e,t,"",r)}function gn(e){const t=e.raycasterWrapper.pointer,o=new l.Vector2(0,.29),i=t.distanceTo(o),a=e.objectMap&&e.objectMap.get("Lathe_Center")||e.getObjectByName("Lathe_Center");if(!a)return;const r=a.material.uniforms;if(i===0)return 2;if(i>.39)r.nebulaCoreRadius.value=40,r.nebulaTwistFactor.value=0;else{const n=i/.39,s=n*n;r.nebulaCoreRadius.value=2+98*s;const c=.2,u=Math.max(0,Math.min(s,c))/c;r.nebulaTwistFactor.value=1-u}return i}function ge(e,t,o="INFO HERE",i=!1,a=!1){if(!(e.cursorInformerEnabled===!1&&!i)){if(e.cursorInformerBox)if(t){if(e.cursorInformerBox.style.display="flex",e.cursorInformerIcon){if(typeof t=="object"&&t.row!==void 0){const r=(t.col-1)*100/3,n=(t.row-1)*100/2;Object.assign(e.cursorInformerIcon.style,{backgroundImage:"url('./textures/icons.png')",backgroundSize:"400% 300%",backgroundPosition:`${r}% ${n}%`,filter:"none"})}else if(typeof t=="string"){const r=t.replace(/\s+/g,"");e.cursorInformerIcon.style.backgroundImage=`url('data:image/svg+xml;base64,${r}')`,e.cursorInformerIcon.style.backgroundSize="contain",e.cursorInformerIcon.style.backgroundPosition="center"}}}else e.cursorInformerBox.style.display="none";e.cursorInformer&&(a?e.cursorInformer.classList.add("ui-mode"):e.cursorInformer.classList.remove("ui-mode"),e.cursorInformer.style.display="block",e.cursorInformer.style.opacity="1",e.cursorInformer.style.visibility="visible"),e.cursorInformerText&&(e.cursorInformerText.style.display="none",e.cursorInformerText.style.opacity="0"),e.cursorInformerText&&(e.cursorInformerText.innerHTML=o,e.cursorInformerText.style.display="block",e.cursorInformerText.style.opacity="1")}}function pe(e){e.cursorInformer&&e.cursorInformer.hide?e.cursorInformer.hide():e.cursorInformer&&(e.cursorInformer.style.display="none"),e.cursorInformerIcon&&(e.cursorInformerIcon.style.backgroundImage="none",e.cursorInformerIcon.style.transform="rotate(0deg)")}var xo,vn,Qo=J((()=>{ct(),xo=ic("#FBC189",1.5,1,l.FrontSide),vn=class{constructor(e,t,o,i=32){this.raycaster=new l.Raycaster,this.pointer=new l.Vector2,this.domElement=o&&o.domElement?o.domElement:e.domElement,this.domElement||(this.domElement=document.body),this.scene=e,this.camera=t,this.renderer=o,e.raycasterWrapper=this;const a=10;this.raycastHightlightMaterials=[];for(let d=0;d<a;d++){let m=new l.MeshStandardMaterial({name:`Pool_Mat_${d}`});this.raycastHightlightMaterials.push(m)}const r=document.createElement("div");r.id="cursor-informer-main-wrapper",Object.assign(r.style,{position:"fixed",top:"0",left:"0",pointerEvents:"none",zIndex:"99999",display:"none"}),document.body.appendChild(r),this.cursorInformer=r,e.cursorInformer=this.cursorInformer,this.cursorInformer.show=()=>{this.cursorInformer.style.display="block"},this.cursorInformer.hide=()=>{this.cursorInformer.style.display="none"};const n=document.createElement("div");n.id="cursor-informer-text",n.textContent="INFO HERE",r.appendChild(n),this.cursorInformerText=n,e.cursorInformerText=this.cursorInformerText;const s=document.createElement("div");s.id="cursor-informer-box",r.appendChild(s),this.cursorInformerBox=s,e.cursorInformerBox=this.cursorInformerBox;const c=document.createElement("div");c.id="cursor-informer-icon",Object.assign(c.style,{position:"relative",zIndex:"2",width:"100%",height:"100%",backgroundSize:"68%",backgroundPosition:"center",backgroundRepeat:"no-repeat"}),s.appendChild(c);const u=document.createElement("div");u.id="cursor-informer-progress",Object.assign(u.style,{position:"absolute",bottom:"0",left:"0",height:"0%",width:"100%",backgroundColor:"var(--c-cyan, #00f3ff)",opacity:"1",zIndex:"1",transition:"height 0.1s linear"}),s.appendChild(u),this.informerProgressBar=u,e.cursorInformerProgressBar=this.informerProgressBar,this.informerIcon=c,e.cursorInformerIcon=this.informerIcon,this.iconSize=i,this.isHoveringRaycastObject=!1,this.currentHoveredGroup=null,this.originalMaterialsMap=new Map,this.currentIntersection=null,this.currentObject=null,this.currentObjectTarget=null,this.lastObjectTarget=null,this.targetMouse=new l.Vector2(0,0),this.smoothedMouse=new l.Vector2(0,0),this.easingFactor=.08,this._onPointerMove=this.onPointerMove.bind(this),this._onMouseDown=this.onMouseDown.bind(this),this._onKeyDown=this.onKeyDown.bind(this),window.addEventListener("pointermove",this._onPointerMove,{passive:!0}),this.domElement.addEventListener("mousedown",this._onMouseDown,{passive:!0,capture:!1}),window.addEventListener("keydown",this._onKeyDown,{passive:!0}),this.mouseInContainer=!1,this.domElement.addEventListener("mouseenter",()=>{this.mouseInContainer=!0}),this.domElement.addEventListener("mouseleave",()=>{this.mouseInContainer=!1})}onKeyDown(e){}onMouseEnter(){}onPointerMove(e){let t;this.domElement&&this.domElement.getBoundingClientRect?t=this.domElement.getBoundingClientRect():t={left:0,top:0,width:window.innerWidth,height:window.innerHeight};const o=e.clientX-t.left,i=e.clientY-t.top;if(this.pointer.x=o/t.width*2-1,this.pointer.y=-(i/t.height)*2+1,this.targetMouse.set(this.pointer.x,this.pointer.y),this.cursorInformer){const a=window.innerWidth,r=window.innerHeight,n=this.iconSize,s=n*-.5,c=n*-1.5;let u=e.clientX+s,d=e.clientY+c;if(u=Math.max(10,Math.min(u,a-n-10)),d=Math.max(10,Math.min(d,r-n-10)),this.cursorInformerText){const m=this.cursorInformer.classList.contains("ui-mode")?"42px":"8px";e.clientY<120?(this.cursorInformerText.style.bottom="auto",this.cursorInformerText.style.top="100%",this.cursorInformerText.style.marginTop=m,this.cursorInformerText.style.marginBottom="0"):(this.cursorInformerText.style.top="auto",this.cursorInformerText.style.bottom="100%",this.cursorInformerText.style.marginTop="0",this.cursorInformerText.style.marginBottom=m)}this.cursorInformer.style.transform=`translate(${u}px, ${d}px)`}}onMouseDown(e){if(e.clientX/window.innerWidth,1-e.clientY/window.innerHeight,e.clientX/window.innerWidth,1-e.clientY/window.innerHeight,this.domElement){const t=this.domElement.getBoundingClientRect();(e.clientX-t.left)/t.width,1-(e.clientY-t.top)/t.height}this.currentIntersection&&this.currentObjectTarget?.onMouseDown?.(this.currentObjectTarget,this.currentIntersection)}onMouseLeave(e){this.currentIntersection&&this.currentObjectTarget?.onMouseLeave?.(this.currentObjectTarget,this.currentIntersection)}updateGravityCenter(e){if(this.scene.world&&this.scene.world.gravityCenterForBalls){let t=null;if(this.allIntersections&&this.allIntersections.length>0)for(let o=0;o<this.allIntersections.length;o++){const i=this.allIntersections[o];if(!(i.object&&i.object.userData&&i.object.userData.isPhysicsBall)){t=i;break}}t&&t.point?this.scene.world.gravityCenterForBalls.copy(t.point):(this.raycaster.ray.at(20,this.scene.world.gravityCenterForBalls),this.scene.world.gravityCenterForBalls.x+=2)}}updateInformer(e){this.informerIcon&&(this.informerIcon.style.backgroundImage=`url('${e}')`)}update(){if(this.scene&&(this.scene.isTransitioning||this.scene.raycasterEnabled===!1||this.scene.isPersonaActive)){this.isHoveringRaycastObject&&(this.isHoveringRaycastObject=!1,this.currentObjectTarget?.onMouseLeave?.(),this.currentObjectTarget=null,this.currentIntersection=null,this.currentObject=null,this.cursorInformer&&(this.cursorInformer.style.display="none"));return}const e=1e-4,t=!this._lastPointer||Math.abs(this._lastPointer.x-this.pointer.x)>e||Math.abs(this._lastPointer.y-this.pointer.y)>e,o=this.camera.matrixWorld.elements;let i=!1;if(!this._lastCamMatrix)this._lastCamMatrix=new Float32Array(16),i=!0;else for(let r=0;r<16;r++)if(Math.abs(this._lastCamMatrix[r]-o[r])>e){i=!0;break}if(!t&&!i&&this._hasLastIntersections)return;this._lastPointer||(this._lastPointer=new l.Vector2),this._lastPointer.copy(this.pointer);for(let r=0;r<16;r++)this._lastCamMatrix[r]=o[r];this.raycaster.setFromCamera(this.pointer,this.camera);const a=this.raycaster.intersectObjects(this.scene.raycastObjects,!0);if(this.allIntersections=a,this._hasLastIntersections=!0,this.updateGravityCenter(),a.length>0){this.currentIntersection=a[0];let r=null,n=a[0].object;for(;n;){if(n.userData&&n.userData.isRaycastTarget){r=n;break}n=n.parent}if(!r){const s=a[0].object;r=s.ignoreRaycast?s.parent:s}this.currentObject=r,this.currentObject!==this.currentObjectTarget&&(this.lastObjectTarget=this.currentObjectTarget,this.currentObjectTarget=this.currentObject,this.lastObjectTarget!==this.currentObjectTarget&&(this.lastObjectTarget?.onMouseLeave?.(),this.currentObjectTarget?.onMouseEnter?.())),this.currentObjectTarget&&this.currentObjectTarget.onMouseHover?.(this.currentObjectTarget,this.currentIntersection)}else this.currentObjectTarget&&(this.isHoveringRaycastObject=!1,this.currentObjectTarget?.onMouseLeave?.(),this.currentObjectTarget=null,this.currentIntersection=null,this.currentObject=null);this.lastObjectTarget=this.currentObjectTarget}dispose(){this.domElement&&this.domElement.removeEventListener("mousedown",this._onMouseDown,!1),window.removeEventListener("pointermove",this._onPointerMove),window.removeEventListener("keydown",this._onKeyDown),this.cursorInformer&&this.cursorInformer.parentNode&&this.cursorInformer.parentNode.removeChild(this.cursorInformer),this.cursorInformer=null,this.informerIcon=null,this.scene&&(this.scene.cursorInformer=null,this.scene.cursorInformerIcon=null,this.scene.raycaster=null)}}}));function nr(e,t){return Math.random()*(t-e)+e}function Pi(e,t,o=void 0,i=!0){const{scene:a,windowLight:r}=e,n=a.scenarioState&&a.scenarioState.name==="room",s=a.globalUniformsHub;if(i&&(hi&&clearInterval(hi),hi=setInterval(()=>{Pi(e,Math.random(),void 0,!1)},3e3)),!!n&&!(!s||!r)&&t>.6){if(a.scenarioState&&a.scenarioState.name!=="room"||!s.enableLightning.value&&t!==2)return;t<1?(o||(o=new l.Vector2),o.x=nr(.045,.5),o.y=nr(-.9,.55)):o||(o=new l.Vector2(0,0));const c=-.9,u=.55,d=1-(Math.max(c,Math.min(u,o.y))-c)/(u-c);s.isStriking.value=!0,s.normalizedStrikePos.value.copy(o),r.intensity=1e6*(.5+2.5*(1+d)*(1+d)),r.distance=30+113.4*d,r.decay=2.4-.6*d;const m=100+400*d;setTimeout(()=>{s.isStriking.value=!1,r.intensity=0},m)}}function vc(e){const t=yc(e);return t.intensity=0,Pi({scene:e,windowLight:t},Math.random()),t}function yc(e){const t=new l.SpotLight;return t.angle=2,t.color=ms,t.name="windowLight",t.position.set(0,5,40),t.visible=!0,e.add(t),e.windowLight=t,t.castShadow=!1,t.color=ps,t.intensity=0,t}function wc(e){if(!e.bulb||!e.bulbLight)return;const t=e.bulb,o=e.bulbLight,i=e.globalUniformsHub;o.intensity>1?(o.intensity=.001,i&&i.uniforms.uIsOscillating&&(i.uniforms.uIsOscillating.value=0),t.material.visible=!1,t.children[0]&&(t.children[0].visible=!1)):(o.intensity=50,i&&i.uniforms.uIsOscillating&&(i.uniforms.uIsOscillating.value=1),t.material.visible=!0,t.children[0]&&(t.children[0].visible=!0))}function Sc(e,t,o=200){if(!t||!t.uniforms.uBSODState)return;const i=t.uniforms.uBSODState.value;t.uniforms.uBSODState.value=1,setTimeout(()=>{t.uniforms.uBSODState.value=i},o)}var ps,ms,hi,hs=J((()=>{ps=new l.Color("#88B0FF"),new l.Color("black"),ms=new l.Color("#b9d1ff"),hi=null})),gs=Lr({alert:()=>Oi,blackhole:()=>wn,btc:()=>Sn,bulb:()=>Bi,computer:()=>Zt,eth:()=>xn,eye:()=>bn,heart:()=>Vo,lamp:()=>Tn,lightning:()=>zo,punch:()=>Rt,slide:()=>yn}),ot,zo,yn,Bi,wn,Rt,Vo,Sn,xn,Zt,Tn,bn,Oi,Zo=J((()=>{ot={lightning:{row:1,col:1},slide:{row:1,col:2},bulb:{row:1,col:3},blackhole:{row:1,col:4},heart:{row:2,col:1},punch:{row:2,col:2},btc:{row:2,col:3},eth:{row:2,col:4},computer:{row:3,col:1},lamp:{row:3,col:2},eye:{row:3,col:3},alert:{row:3,col:4}},zo=ot.lightning,yn=ot.slide,Bi=ot.bulb,wn=ot.blackhole,Rt=ot.punch,Vo=ot.heart,Sn=ot.btc,xn=ot.eth,Zt=ot.computer,Tn=ot.lamp,bn=ot.eye,Oi=ot.alert})),Jo,ei=J((()=>{Jo={box:new l.BoxGeometry(1,1,1),sphere:new l.SphereGeometry(.5,32,32),plane:new l.PlaneGeometry(1,1),circle:new l.CircleGeometry(.5,32),cylinder:new l.CylinderGeometry(.5,.5,1,32),cone:new l.ConeGeometry(.5,1,32),torus:new l.TorusGeometry(.5,.2,16,100)}}));function xc(e){if(!Number.isInteger(e)||e<1||e>7)return console.error("Error: Input must be an integer between 1 and 7."),[];const t=[],o=Math.PI;if(e===1)return t.push({x:0,y:0}),t;if(e>=2&&e<=4){const i=.2*To,a=e,r=-o/2;for(let n=0;n<a;n++){const s=2*o*n/a+r,c=i*Math.cos(s),u=i*Math.sin(s);t.push({x:parseFloat(c.toFixed(4)),y:parseFloat(u.toFixed(4))})}return t}if(e>=5&&e<=7){t.push({x:0,y:0});const i=.35*To,a=e-1,r=-o/2;for(let n=0;n<a;n++){const s=2*o*n/a+r,c=i*Math.cos(s),u=i*Math.sin(s);t.push({x:parseFloat(c.toFixed(4)),y:parseFloat(u.toFixed(4))})}return t}return t}function Tc(e,t){let o=e.initialParent||e.parent;const i={uuid:e.uuid,name:e.name,position:e.position.clone(),rotation:{x:e.rotation.x,y:e.rotation.y,z:e.rotation.z,order:e.rotation.order},scale:e.scale.clone(),parent:o};t.tweenData=t.tweenData||{},t.tweenData[e.uuid]=i}function vs(e,t=4){e.bhTargets||=[];const o=e.world,i=new l.Mesh(Ea,ls),a=To*1.25;i.scale.setScalar(a),e.add(i),i.name=`dragonBall${t}Stars`,La(e,i),i.castShadow=!0,i.ignoreRaycast=!0,i.userData.isPhysicsBall=!0,i.userData.isDragonBall=!0,i.userData.starCount=t;const r=new l.Mesh(Ea,mn);if(r.name=`Aura${t}Stars`,r.scale.setScalar(2.2),i.add(r),r.ignoreRaycast=!0,e.world.isBusy)return setTimeout(()=>vs(e,t),16),e.remove(i),null;e.world.isBusy=!0;let n;try{n=o.createRigidBody(fe.RigidBodyDesc.dynamic().setTranslation(i.position.x,i.position.y,i.position.z).setCanSleep(!1))}finally{e.world.isBusy=!1}const s=fe.ColliderDesc.ball(a/2).setRestitution(.4).setMass(1);return i.rapierBody=n,i.rapierShape=s,n.threeMesh=i,n.rapierShape=s,e.world.ballBodies=e.world.ballBodies||[],e.world.ballBodies.push(n),So(e,i,{onMouseEnter:c=>{const u=`UI_INFORMER_DRAGONBALL_${t}`;e.raycasterWrapper?.mouseInContainer&&ge(e,Rt,Z(u)),e.gazeFollower&&e.gazeFollower.lookAtTarget(c)},onMouseLeave:()=>{pe(e),e.gazeFollower&&e.gazeFollower.lookAtTarget(e.camera)},onMouseDown:(c,u)=>bc(e,c,u)}),xc(t).forEach(c=>{const u=new l.Mesh(ys,ws);u.scale.setScalar(1.5*(.049*t*t-.467*t+1.618)),u.name="star",u.position.set(c.x,c.y,0),i.add(u)}),Tc(i,e),e.bhTargets.push(i),e.dragonBalls=e.dragonBalls||[],e.dragonBalls.push(i),i}function bc(e,t,o){Ec(e,t,o);const i=Di(e);He(e,t,"",null,`db-click-${t.uuid}`,!1,16763904,!1,500),i||Cc(e);const a=t.position.clone(),r=Math.floor(Math.random()*5)+1;for(let n=0;n<r;n++){const s={x:(Math.random()-.5)*12,y:18+Math.random()*10,z:(Math.random()-.5)*12};oi(e,a.clone().add({x:0,y:.5,z:0}),s)}e.physicBodies&&e.physicBodies.forEach(n=>{if(!n.threeObject||n.threeObject===t)return;const s=n.threeObject.position.distanceTo(a);if(s<10){const c=new l.Vector3().subVectors(n.threeObject.position,a).normalize(),u=(1-s/10)*8;n.applyImpulse({x:c.x*u,y:u*1.5,z:c.z*u},!0)}}),typeof Ro=="function"&&(Ro(e,1e3),e._dragonEyeTimeout&&clearTimeout(e._dragonEyeTimeout),e._dragonEyeTimeout=setTimeout(()=>{typeof Mo=="function"&&Mo(e,2e3)},5e3)),typeof re=="function"&&re(`ANOMALY_0${t.userData.starCount||7}: DIMENSIONAL_KEY_ACTIVE`)}function Ec(e,t,o){t&&o&&Vi(e,t,o)}function Di(e,t=null){return t!==null?e.world.hasPointGravityOnBalls=t:e.world.hasPointGravityOnBalls=!e.world.hasPointGravityOnBalls,e.world.hasPointGravityOnBalls}function Cc(e){e.world.ballBodies&&e.world.ballBodies.forEach(t=>{t.threeMesh&&t.threeMesh.children&&t.threeMesh.children[0]&&(t.threeMesh.children[0].visible=!0);const o=t.translation(),i=e.world.gravityCenterForBalls,a=new l.Vector3(i.x-o.x,Math.abs(i.y-o.y),i.z-o.z).normalize().multiplyScalar(-Math.random()*50*t.mass());t.applyImpulse({x:a.x,y:a.y,z:a.z},!1)})}var Ea,To,Oo,ra,rr,sr,ys,ws,En=J((()=>{ei(),ct(),so(),Qo(),$i(),Zo(),lt(),ut(),ii(),pt(),Ea=Jo.sphere,To=.5,Oo=new l.Shape,ra=5,rr=.15*To,sr=.07*To;for(let e=0;e<ra*2;e++){const t=e/(ra*2)*Math.PI*2,o=e%2===0?rr:sr,i=Math.cos(t)*o,a=Math.sin(t)*o;e===0?Oo.moveTo(i,a):Oo.lineTo(i,a)}Oo.closePath(),ys=new l.ShapeGeometry(Oo),ws=new l.MeshBasicMaterial({color:16498077,side:l.DoubleSide,toneMapped:!1}),new l.Vector3(0,0,0)}));async function Ic(){try{const e=localStorage.getItem(Ca);if(e){const{timestamp:i,data:a}=JSON.parse(e);if(Date.now()-i<Ss)return a}const t=await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false");if(!t.ok)throw new Error(`API Error: ${t.status}`);const o=(await t.json()).map(i=>({name:i.name,symbol:i.symbol,current_price:i.current_price,image:i.image}));return localStorage.setItem(Ca,JSON.stringify({timestamp:Date.now(),data:o})),o}catch(e){return console.warn("[CryptoParams] Fetch failed, using Mock Data:",e),xs}}var Ca,Ss,xs,Rc=J((()=>{Ca="crypto_top_10_cache",Ss=600*1e3,xs=[{name:"Bitcoin",symbol:"btc",current_price:65e3,image:"https://assets.coingecko.com/coins/images/1/large/bitcoin.png"},{name:"Ethereum",symbol:"eth",current_price:3500,image:"https://assets.coingecko.com/coins/images/279/large/ethereum.png"},{name:"Tether",symbol:"usdt",current_price:1,image:"https://assets.coingecko.com/coins/images/325/large/Tether.png"},{name:"BNB",symbol:"bnb",current_price:600,image:"https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png"},{name:"Solana",symbol:"sol",current_price:140,image:"https://assets.coingecko.com/coins/images/4128/large/solana.png"},{name:"USDC",symbol:"usdc",current_price:1,image:"https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png"},{name:"XRP",symbol:"xrp",current_price:.6,image:"https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png"},{name:"Dogecoin",symbol:"doge",current_price:.15,image:"https://assets.coingecko.com/coins/images/5/large/dogecoin.png"},{name:"Toncoin",symbol:"ton",current_price:7,image:"https://assets.coingecko.com/coins/images/17980/large/ton_symbol.png"},{name:"Cardano",symbol:"ada",current_price:.45,image:"https://assets.coingecko.com/coins/images/975/large/cardano.png"}]}));function rt(e,t,o={}){const{idleClipName:i="typing",crossFadeDuration:a=.5,randomize:r=!1,speed:n=1,onComplete:s=null,autoReturn:c=!0}=o;if(!e.mixer||!e.heroClips){console.warn("Animation Manager: Mixer or heroClips not found on scene.");return}const u=e.heroClips.find(g=>g.name===t);if(!u){console.warn(`Animation Manager: Clip "${t}" not found.`);return}const d=e.mixer.clipAction(u);if(e.activeAction===d&&d.isRunning())return;d.reset(),n<0&&(d.time=u.duration);let m=u.duration,f=1;if(r){if(f=.8+Math.random()*1.2,d.timeScale=f,d.setEffectiveWeight(.8+Math.random()*.2),Math.random()>.5){const g=.6+Math.random()*.2;m=u.duration*g}}else d.timeScale=n,d.setEffectiveWeight(1),f=n;if(t===i?(d.setLoop(l.LoopRepeat),d.clampWhenFinished=!1):(d.setLoop(l.LoopOnce),d.clampWhenFinished=!0),d.play(),e.activeAction&&e.activeAction!==d&&e.activeAction.crossFadeTo(d,a),e.activeAction=d,t!==i){let g=!1;const w=()=>{if(g)return;g=!0;const y=e.heroClips.find(S=>S.name===i);if(y){const S=e.mixer.clipAction(y);c&&(S.reset(),S.setLoop(l.LoopRepeat),S.play(),d.crossFadeTo(S,a),e.activeAction=S,re&&re("Returning to idle...")),s&&s()}};if(r&&m<u.duration){const y=m/f*1e3;setTimeout(w,y)}else{const y=S=>{S.action===d&&(e.mixer.removeEventListener("finished",y),w())};e.mixer.addEventListener("finished",y)}}return{action:d,duration:m/f}}var ti=J((()=>{pt()}));function Wi(e,t){if(Lo.add({body:e,onApex:t,startTime:performance.now()}),!gi){gi=!0;const o=()=>{const i=window.scene?window.scene.world:null;if(i&&i.isBusy){requestAnimationFrame(o);return}if(Lo.size===0){gi=!1;return}const a=performance.now();Lo.forEach(r=>{(r.body.linvel().y<=.01||a-r.startTime>1500)&&(r.onApex(),Lo.delete(r))}),requestAnimationFrame(o)};requestAnimationFrame(o)}}function Yi(e,t,o,i,a,r,n=null,s=null){const c=performance.now(),u=Math.max(200,i-c),d=window.scene&&window.scene.world?window.scene.world:null;if(d&&d.isBusy)return;const m=e.translation(),f=new l.Vector3(m.x,m.y,m.z),g=e.linvel(),w=new l.Vector3(g.x,g.y,g.z);e.setNextKinematicTranslation(f),e.setBodyType(fe.RigidBodyType.KinematicPositionBased);const y=f.clone().add(w.multiplyScalar(.45));if(s){const v=new l.Line3(f,t),P=new l.Vector3;v.closestPointToPoint(s,!0,P);const A=P.distanceTo(s),F=1.75;if(A<F){const G=new l.Vector3().subVectors(P,s).normalize();(G.lengthSq()<.05||Math.abs(G.y)>.9)&&G.set(0,1.2,.2).normalize();const V=(F-A)*4.5;y.add(G.multiplyScalar(V)),P.y<3&&(y.y+=(F-A)*1.5)}}const S=new l.QuadraticBezierCurve3(f,y,t),T=e.rotation(),M=new l.Quaternion(T.x,T.y,T.z,T.w);e._activeReturnTween&&e._activeReturnTween.stop();const O={t:0},_=new x.Tween(O).to({t:1},u).easing(x.Easing.Cubic.InOut).onUpdate(()=>{if(d&&d.isBusy)return;const v=S.getPoint(O.t);try{d&&(d.isBusy=!0),e.setNextKinematicTranslation(v),e.setNextKinematicRotation(M.clone().slerp(o,O.t)),d&&(d.isBusy=!1)}catch(P){console.error("[PhysicsUtils] Kinematic update failed:",P.message),d&&(d.isBusy=!1)}n&&n(v,O.t)}).onComplete(()=>{e._activeReturnTween=null;const v=Math.random()*200;setTimeout(()=>{d&&d.isBusy;try{d&&(d.isBusy=!0),e.setBodyType(a),e.setLinvel({x:0,y:0,z:0},!0),e.setAngvel({x:0,y:0,z:0},!0),e.rapierCollider&&e.rapierCollider.setSensor(!1),d&&(d.isBusy=!1)}catch(P){console.error("[PhysicsUtils] Body reset failed:",P.message),d&&(d.isBusy=!1)}r&&r()},v)});e._activeReturnTween=_,_.start()}var Lo,gi,Cn=J((()=>{Lo=new Set,gi=!1}));function In(e,t={}){qo(e,t,"water"),Yo(e,"vertex","vPatchedUv","vec2"),Io(e,"vertex","vPatchedUv = uv;");const o=`
        ${e.fragmentShader.includes("uniform float iTime;")?"":"uniform float iTime;"}
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
    `;e.fragmentShader.includes("#include <common>")?e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
`+o):e.fragmentShader=o+`
`+e.fragmentShader,Io(e,"fragment",`
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
    `),e.fragmentShader=e.fragmentShader.replace(/UV\s*=\s*vUv/g,"UV = vWarpedUv").replace(/texture2D\(\s*map\s*,\s*vMapUv\s*\)/g,"texture2D( map, vWarpedUv )").replace(/texture2D\(\s*roughnessMap\s*,\s*vMapUv\s*\)/g,"texture2D( roughnessMap, vWarpedUv )").replace(/texture2D\(\s*metalnessMap\s*,\s*vMapUv\s*\)/g,"texture2D( metalnessMap, vWarpedUv )").replace(/texture2D\(\s*bumpMap\s*,\s*vMapUv\s*\)/g,"texture2D( bumpMap, vWarpedUv )").replace(/texture2D\(\s*iChannel([0-9X])\s*,\s*(vUv|uv)\s*\)/g,"texture2D( iChannel$1, vWarpedUv )").replace(/textureLod\(\s*iChannelX\s*,\s*UV\+n\s*,\s*focus\s*\)/g,"textureLod( iChannelX, vWarpedUv+n, focus )").replace(/texture2D\(\s*fireFliesTexture\s*,\s*uv\s*\)/g,"texture2D( fireFliesTexture, vWarpedUv )"),e.fragmentShader.includes("#include <normal_fragment_begin>")&&(e.fragmentShader=e.fragmentShader.replace("#include <normal_fragment_begin>",`
            #include <normal_fragment_begin>
            normal = normalize(normal + vec3(dx, dy, 0.0) * (12.0 * uWaterIntensity));
            `)),e.fragmentShader.includes("#include <dithering_fragment>")&&(e.fragmentShader=e.fragmentShader.replace("#include <dithering_fragment>",`
            #include <dithering_fragment>
            float waterAlpha = 1.0 + dot(dx, dy) * gain;
            float ddx = dx - reflectionCutOff;
            float ddy = dy - reflectionCutOff;
            if (ddx > 0. && ddy > 0.) {
                waterAlpha = pow(abs(waterAlpha), ddx * ddy * reflectionIntensity);
                gl_FragColor.rgb += vec3(waterAlpha) * 0.4;
            }
            `))}function Ts(e,t={}){if(qo(e,t,"grid"),Yo(e,"vertex","vPatchedUv","vec2"),Yo(e,"vertex","vWorldPos","vec3"),Io(e,"vertex","vPatchedUv = uv;"),Io(e,"vertex","vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;"),e.fragmentShader.includes("Holographic Grid Overlay"))return;const o=`
        ${e.fragmentShader.includes("uniform float iTime;")?"":"uniform float iTime;"}
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
    `;e.fragmentShader.includes("#include <common>")?e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
`+o):e.fragmentShader=o+`
`+e.fragmentShader;const i=`
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
    `;if(e.fragmentShader.includes("#include <dithering_fragment>"))e.fragmentShader=e.fragmentShader.replace("#include <dithering_fragment>",i+`
#include <dithering_fragment>`);else{const a=e.fragmentShader.lastIndexOf("}");e.fragmentShader=e.fragmentShader.substring(0,a)+i+`
}`}}function Mc(e,t={}){if(qo(e,t,"welcome"),Yo(e,"vertex","vPatchedUv","vec2"),Io(e,"vertex","vPatchedUv = uv;"),e.fragmentShader.includes("Welcome Text Header"))return;const o=e.fragmentShader.includes("uniform float iTime;"),i=e.fragmentShader.includes("uniform vec2 iResolution;"),a=`
        // --- Welcome Text Header ---
        ${o?"":"uniform float iTime;"}
        ${i?"":"uniform vec2 iResolution;"}
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
    `;e.fragmentShader.includes("#include <common>")?e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
`+a):e.fragmentShader=a+`
`+e.fragmentShader;const r=`
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
    `;if(e.fragmentShader.includes("#include <dithering_fragment>"))e.fragmentShader=e.fragmentShader.replace("#include <dithering_fragment>",r+`
#include <dithering_fragment>`);else{const n=e.fragmentShader.lastIndexOf("}");e.fragmentShader=e.fragmentShader.substring(0,n)+r+`
}`}}var lr,Yo,Io,qo,Rn=J((()=>{wt(),lr={core:{iTime:0,iResolution:new l.Vector2(1024,1024)},water:un,grid:{...dn,uObjectStagger:0},dotaLogo:Kr,welcome:fn},Yo=(e,t,o,i="vec2")=>{const a=`varying ${i} ${o};`,r=/void\s+main\s*\(\s*\)\s*\{/;e.vertexShader&&!e.vertexShader.includes(o+";")&&(e.vertexShader=e.vertexShader.replace(r,n=>`${a}
${n}`)),e.fragmentShader&&!e.fragmentShader.includes(o+";")&&(e.fragmentShader.includes("#include <common>")?e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
${a}`):e.fragmentShader=`${a}
${e.fragmentShader}`)},Io=(e,t,o)=>{const i=t==="vertex"?"vertexShader":"fragmentShader",a=/void\s+main\s*\(\s*\)\s*\{/;e[i]&&!e[i].includes(o.trim())&&(e[i]=e[i].replace(a,r=>`${r}
    ${o}`))},qo=(e,t,o)=>{const i=lr[o];if(i){o!=="core"&&qo(e,t,"core");for(const[a,r]of Object.entries(i))e.uniforms[a]||(e.uniforms[a]=t[a]||{value:r})}}})),bs,_c=J((()=>{bs=`
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
`}));async function qi(){return new Promise(e=>requestAnimationFrame(e))}var Mn=J((()=>{}));function nt(e,t,o={}){const{transparent:i=!1,blending:a=l.AdditiveBlending,side:r=l.FrontSide,derivatives:n=!1,uniforms:s={},vs:c=jr}=o,u=e.globalUniformsHub?e.globalUniformsHub.core:{};return new l.ShaderMaterial({vertexShader:c,fragmentShader:t,uniforms:{...u,...s},blending:a,side:r,transparent:i,extensions:{derivatives:n}})}async function Ac(e,t){t&&(t.innerText=Z("SYS_CONFIG_MATERIALS"));const o=e.globalUniformsHub,i=o?o.uniforms:{};ri=nt(e,Qr,{transparent:!0,uniforms:{uFireHeightOverride:i.uFireHeightOverride||{value:0},uSmoothedMouse:{value:new l.Vector2(0,0)}}}),eo=nt(e,ts),te=nt(e,bs,{blending:l.NormalBlending,uniforms:{uBSODState:i.uPCBSODState||{value:0},uIsPoba:i.uIsPoba||{value:0},uHoverPos:{value:new l.Vector2(0,0)},uTargetHoverPos:{value:new l.Vector2(0,0)},uHoverActive:{value:0},uClickPos:{value:new l.Vector2(.5,.5)},uClickTime:{value:-99},uBootState:{value:0},uChannelAvatars:{value:oe.avatarsCelShaded},uHasAvatarTexture:{value:1},uSpecialPos1:{value:new l.Vector2(0,1)},uSpecialPos2:{value:new l.Vector2(2,0)}}}),yo=nt(e,Jr,{blending:l.NormalBlending}),wo=nt(e,es,{blending:l.NormalBlending}),Lt=nt(e,ba,{blending:l.NormalBlending,derivatives:!0,uniforms:{uBSODState:i.uLaptopBSODState||{value:0},uNetflixStartTime:i.uNetflixStartTime||{value:0}}}),Ne=nt(e,ba,{blending:l.NormalBlending,derivatives:!0,uniforms:{uBSODState:i.uPCBSODState||{value:0},uNetflixStartTime:i.uNetflixStartTime||{value:0}}}),fo=nt(e,us,{depthWrite:!1,depthTest:!1,transparent:!0,uniforms:{uEyeActive:{value:!1},uOffsetY:{value:-.017},uEyeOpenness:{value:0},uEyeAngle:{value:-.36},uEyeScale:{value:.5},uEyeFlameOffset:{value:new l.Vector2(0,.52)},uFlameScale:{value:new l.Vector2(.5,.5)},uEyeScreenPosition:{value:new l.Vector2(.6,0)},uFireHeightOverride:i.uFireHeightOverride||{value:0},uSmoothedMouse:{value:new l.Vector2(0,0)}}}),Le=nt(e,ds,{transparent:!0,uniforms:{...e.globalUniformsHub.core,uSelectedSlot:{value:new l.Vector2(3,1)},uGlowIntensity:{value:.05},uBorderThickness:{value:.02},uCurrentSpeed:{value:5},uIconScale:{value:.75},uDarkness:{value:.74},uAspect:{value:1.77}}}),Ye=nt(e,fs,{blending:l.NormalBlending,uniforms:{uBSODState:i.uPCBSODState||{value:0},uAspect:{value:1.77}}}),Bc=[eo,yo,wo,Lt,Le,Ye],Oc=[te,Ne,Le,Ye];const a=async w=>{const y=[{name:["screenDisplay001_1"],envMapIntensity:10,metalness:.1,roughness:.5,envMapRotation:new l.Euler(0,.5,.5)},{name:["verticalMonitorBody"],envMapIntensity:10,metalness:0,roughness:.15,envMapRotation:new l.Euler(0,1.97,.39),toneMapped:!1},{name:"Object_0003_3",envMapIntensity:1,metalness:0,roughness:.32,envMapRotation:new l.Euler(0,Math.PI/2,0)},{name:"shelf",envMapIntensity:2.65,metalness:0,roughness:1,envMapRotation:new l.Euler(1.2,.1,.2),side:l.BackSide,toneMapped:!0},{name:"mjolnir_low_mjolnir_hammer_0",envMapIntensity:5,metalness:1,roughness:1},{name:"Object_15",envMapIntensity:20,metalness:.15,roughness:.5},{name:"Object_15001",envMapIntensity:2,metalness:.15,roughness:.2,envMapRotation:new l.Euler(Math.PI,-Math.PI/2,-1)},{name:"book001",envMapIntensity:20,metalness:0,roughness:1,envMapRotation:new l.Euler(Math.PI/2,Math.PI/2,0)},{name:"blackCat",envMapIntensity:.75,envMapRotation:new l.Euler(0,1,0),toneMapped:!1},{name:"Object_108",envMapIntensity:1},{name:"leftWallFoot001",envMapIntensity:.5},{name:"Object_17",envMapIntensity:.5},{name:"Ch23_Body",envMapIntensity:8,metalness:0,roughness:1,envMapRotation:new l.Euler(-2.17,-2.83,.73)},{name:"PokeBall__0002"},{name:"PokeBall__0002_1"},{name:"PokeBall__0002_2"},{name:"Model_0001"},{name:"pictureLion",map:oe.avatarsCelShaded,envMapIntensity:1.5,metalness:0,roughness:1},{name:"PokeBall__0003"},{name:"PokeBall__0003_1"},{name:"PokeBall__0003_2"},{name:"pillow-small-2",envMapIntensity:.3},{name:"pillow-small-1",envMapIntensity:.3},{name:"Sphere001_0",toneMapped:!1},{name:"stool1"},{name:"stool2"},{name:"stool_seat",envMapIntensity:5,envMapRotation:new l.Euler(0,-.4,.2)},{name:"Object_8001"},{name:"aegis",envMapIntensity:5},{name:"questionCube",envMapIntensity:5,metalness:0,roughness:0},{name:"Object_34001",envMapIntensity:10,metalness:0,roughness:.7,side:l.BackSide},{name:"Object_32",envMapIntensity:2.5},{name:"Object_31",envMapIntensity:5,envMapRotation:new l.Euler(Math.PI,0,0)},{name:"Object_33",envMapIntensity:2,envMapRotation:new l.Euler(Math.PI,0,0),roughness:0},{name:"Object_42001",envMapIntensity:6},{name:"Object_40001",envMapIntensity:15,roughness:0},{name:"bedMain",envMapIntensity:.15,roughness:1,envMapRotation:new l.Euler(Math.PI,Math.PI,Math.PI)},{name:"bedStand",envMapIntensity:.9,roughness:1},{name:"Object_0007",toneMapped:!1,envMapIntensity:.4},{name:"Lathe_S_Blackhole_01_0",toneMapped:!1,emissiveIntensity:.7},{name:"Circle_0",envMapIntensity:3.5,roughness:.1},{name:"Cube_1",envMapIntensity:1.5,roughness:.1},{name:"Circle002_0",envMapIntensity:6,roughness:.1}],S=new Map;for(const v of y){const P=Array.isArray(v.name)?v.name:[v.name];for(const A of P)S.set(A,v)}let T=performance.now(),M=0;const O=600,_=[e];for(;_.length>0;){const v=_.pop();if(v.name&&S.has(v.name)){const{name:P,...A}=S.get(v.name);v.traverse(F=>{F.isMesh&&F.material&&(F.material.envMap=w,Object.assign(F.material,A))})}if(v.children)for(let P=v.children.length-1;P>=0;P--)_.push(v.children[P]);if(M++,M%50===0&&performance.now()-T>8){await qi(),T=performance.now();const P=.2+Math.min(M/O,1)*.6;updateTaskProgress("model-assembly",P)}}e.isAdjusted=!0};oe.environmentMap?await a(oe.environmentMap):e.environment&&await a(e.environment);let r=e.getObjectByName("Object_34001");r&&(r.material=eo),r.material.side=l.BackSide;const n=e.getObjectByName("screenDisplay002");if(n){n.material=te,n.userData.originalMaterial=te;const w=n.geometry.attributes.position.count;n.geometry.setAttribute("aLayoutMode",new l.BufferAttribute(new Float32Array(w).fill(2),1))}const s=e.getObjectByName("screenDisplay001");if(s){s.material=te,s.userData.originalMaterial=te,s.onBeforeRender=()=>{if(!te.uniforms.uHoverPos||!te.uniforms.uTargetHoverPos)return;const y=te.uniforms.uTargetHoverPos.value,S=te.uniforms.uHoverPos.value,T=.12;if(S.x+=(y.x-S.x)*T,S.y+=(y.y-S.y)*T,S.distanceTo(y)<.001&&S.copy(y),te.uniforms.uIsPoba.value>.5){const M=performance.now();if(s.userData.lastShuffleTime||(s.userData.lastShuffleTime=M),M-s.userData.lastShuffleTime>5e3){s.userData.lastShuffleTime=M;const O=_=>{const v=(Math.round(_.y*3+_.x)+1)%6;_.x=v%3,_.y=Math.floor(v/3)};O(te.uniforms.uSpecialPos1.value),O(te.uniforms.uSpecialPos2.value)}}};const w=s.geometry.attributes.position.count;s.geometry.setAttribute("aLayoutMode",new l.BufferAttribute(new Float32Array(w).fill(0),1))}const c=e.getObjectByName("verticalMonitorDisplay");if(c){c.material=te,c.userData.originalMaterial=te;const w=c.geometry.attributes.position.count;c.geometry.setAttribute("aLayoutMode",new l.BufferAttribute(new Float32Array(w).fill(1),1))}const u=e.getObjectByName("wallArea");if(u){u.material=fo,u.onBeforeRender=()=>{const y=fo.uniforms.uMouse.value,S=fo.uniforms.uSmoothedMouse.value,T=.06;S.x+=(y.x-S.x)*T,S.y+=(y.y-S.y)*T};const w=u.scale.x/u.scale.y;fo.uniforms.uDragonEyeAspect={value:w}}fo.visible=!1;const d=e.getObjectByName("caseCoverArea");d&&(d.material=ri,d.onBeforeRender=()=>{const w=ri.uniforms.uMouse.value,y=ri.uniforms.uSmoothedMouse.value,S=.22;y.x+=(w.x-y.x)*S,y.y+=(w.y-y.y)*S});const m=e.getObjectByName("chairBack");m&&(m.material=Le),Be=io("#FBC189",1,.05),Be.side=l.DoubleSide,kt=_t("#FBC189",1.5,.01,6.5,l.FrontSide);const f=e.getObjectByName("cFanBulbAura");f&&(f.material=kt);const g=e.getObjectByName("cFanBulb");g&&(g.material=Be)}async function Pc(e){if(!e.physicBodies||!e.globalUniformsHub)return;const t=e.globalUniformsHub.uniforms,o=de.ELECTRIC_CYAN,i=de.ACCENT_GOLD;e.cyanPulseActive||(e.cyanPulseActive={value:0});const a={...t,uWorldGridActive:t.uWorldGridActive,uGroupGridActive:e.cyanPulseActive,uBorderColor:{value:o},uObjectStagger:{value:.5}},r={...t,uWorldGridActive:t.uWorldGridActive,uGroupGridActive:{value:0},uBorderColor:{value:i},uObjectStagger:{value:.5}};let n=0,s=0,c=0;const u=new Map,d=S=>{if(!S.geometry)return!1;S.geometry.boundingBox||S.geometry.computeBoundingBox();const T=new l.Vector3;return S.geometry.boundingBox.getSize(T),T.x*T.y*T.z<1e-4},m=S=>{if(S.isShaderMaterial||S.type==="ShaderMaterial")return`shader|${S.fragmentShader.length}|${S.vertexShader.length}|${S.name||"unnamed"}`;const T=S.color?S.color.getHex():0,M=S.emissive?S.emissive.getHex():0,O=S.emissiveIntensity??0,_=S.map?S.map.uuid:"n1",v=S.alphaMap?S.alphaMap.uuid:"n2",P=S.normalMap?S.normalMap.uuid:"n3",A=S.aoMap?S.aoMap.uuid:"n4",F=S.emissiveMap?S.emissiveMap.uuid:"n5",G=S.metalness??0,V=S.roughness??1,h=S.opacity??1,b=S.transparent?1:0,p=S.envMapIntensity??1,R=S.side??l.FrontSide,C=S.toneMapped?1:0,N=S.envMapRotation?`${S.envMapRotation.x.toFixed(2)}|${S.envMapRotation.y.toFixed(2)}|${S.envMapRotation.z.toFixed(2)}`:"0";return`std|${S.name||"unnamed"}|${T}|${M}|${O}|${_}|${v}|${P}|${A}|${F}|${G}|${V}|${h}|${b}|${p}|${R}|${C}|${N}`},f=(S,T)=>{if(!S.material||S.material.isGridPatched)return;if(d(S)){c++;return}n++;const M=m(S.material);let O=u.get(M);O||(O=new Map,u.set(M,O));let _=O.get(T);if(_){S.material=_;return}s++;const v=S.material.clone();v.uniforms=T,v.onBeforeCompile=Cs,v.isGridPatched=!0,O.set(T,v),S.material=v};let g=0;const w=5;let y=performance.now();for(const S of e.physicBodies){const T=S.threeObject;if(!T)continue;g++,(g%w===0||performance.now()-y>2)&&(await qi(),y=performance.now());const M=T.name;let O=null;M==="stool"||M==="stool_bound"?(e.stoolGridUniforms||(e.stoolGridUniforms={...t,uWorldGridActive:{value:0},uWorldGridProgress:{value:0},uGroupGridActive:t.uWorldGridActive,uGroupGridProgress:t.uWorldGridProgress,uBorderColor:{value:i},uObjectStagger:{value:0}}),O=e.stoolGridUniforms):["Object_0003","Object_108","GLTF_created_0001","pokeball","pokeball2"].includes(M)||M.includes("pokeball")?(e.pokeballGridUniforms||(e.pokeballGridUniforms={...t,uWorldGridActive:{value:0},uGroupGridActive:t.uWorldGridActive,uWorldGridProgress:{value:0},uGroupGridProgress:t.uWorldGridProgress,uBorderColor:{value:o},uObjectStagger:{value:0}}),O=e.pokeballGridUniforms):O=S.bodyType()===0?a:r,T.traverse(_=>{_.isMesh&&f(_,O)})}te&&te.uniforms.uIsPoba&&Es(te.uniforms.uIsPoba.value>.5)}function Es(e=!0){oe.avatarsCelShaded&&(oe.avatarsCelShaded.repeat.set(.5,-1),oe.avatarsCelShaded.offset.set(e?0:.5,1))}var Cs,ri,eo,te,yo,wo,Lt,Ne,fo,Le,Ye,Be,kt,Bc,Oc,Ao=J((()=>{yt(),et(),ct(),wt(),lt(),Rn(),_c(),Mn(),Cs=function(e){this.uniforms&&Ts(e,this.uniforms)}}));function Gt(){if(window._cvState==="falling"||window._cvState==="shattered"||window._cvState==="resetting")return;if(window._cvState==="sucking"){window._cvState="falling";return}window._cvState="falling";const e=document.getElementById("cv-container"),t=document.getElementById("cv-content"),o=document.getElementById("cv-scroller");if(!e||!t)return;e.classList.contains("collapsed")?(e.classList.remove("collapsed"),setTimeout(i,400)):i();function i(){if(window._cvState==="resetting"||window._cvState==="idle")return;window._cvState="falling",e.style.overflow="visible",o&&(o.style.overflow="visible");const a=document.getElementById("main-ui");a&&(a.style.pointerEvents="none"),t.style.position="relative";const r=Array.from(t.querySelectorAll([".header h1",".header .role",".contact-info span",".contact-info a",".collapsible-header",".role-header .company",".title-row .job-title",".title-row .date",".skills-grid span",".contact-grid div",".terminal-footer div",".collapsible-content p",".collapsible-content ul li"].join(", "))),n=o.getBoundingClientRect(),s=[];r.forEach(v=>{if(v.querySelector("svg")||v.querySelector("img"))return;const P=v.getBoundingClientRect(),A=P.bottom>=n.top&&P.top<=n.bottom;if(v.dataset.originalHtml||(v.dataset.originalHtml=v.innerHTML),!A){v.style.visibility="hidden",v.dataset.wasHiddenByViewport="true";return}const F=document.createTreeWalker(v,NodeFilter.SHOW_TEXT,null,!1),G=[];for(;F.nextNode();)G.push(F.currentNode);G.forEach(V=>{if(V.nodeValue.trim()==="")return;const h=V.nodeValue.split(/(\s+)/),b=document.createDocumentFragment();h.forEach(p=>{if(p.trim()==="")b.appendChild(document.createTextNode(p));else{const R=document.createElement("span");R.textContent=p,R.style.display="inline-block",R.classList.add("falling-word"),s.push(R),b.appendChild(R)}}),V.parentNode.replaceChild(b,V)})});const c=s.map(v=>{const P=window.getComputedStyle(v);return{sColor:P.color,sFontSize:P.fontSize,sFontWeight:P.fontWeight,sLetterSpacing:P.letterSpacing,sTextTransform:P.textTransform,sFontFamily:P.fontFamily,sLineHeight:P.lineHeight,sTextShadow:P.textShadow!=="none"?P.textShadow:""}});s.forEach((v,P)=>{const A=c[P];v.style.color=A.sColor,v.style.fontSize=A.sFontSize,v.style.fontWeight=A.sFontWeight,v.style.letterSpacing=A.sLetterSpacing,v.style.textTransform=A.sTextTransform,v.style.fontFamily=A.sFontFamily,v.style.lineHeight=A.sLineHeight,v.style.textShadow=A.sTextShadow,v.style.whiteSpace="nowrap"});const u=t.getBoundingClientRect(),d=Array.from(t.querySelectorAll(".header-photo, .scanline-deco, .fui-corners, .audience-badge")),m=[...s,...d],f=m.map(v=>v.getBoundingClientRect()),g=[];m.forEach((v,P)=>{const A=f[P];if(A.width===0||A.height===0)return;const F=A.left-u.left,G=A.top-u.top,V=v.classList.contains("falling-word");let h=v;V||(h=v.cloneNode(!0),h.classList.add("falling-clone"),h.style.margin="0"),g.push({el:h,isClone:!V,x:F,y:G,startX:F,startY:G,width:A.width,height:A.height,vx:window._cvState==="ritual"?(Math.random()-.5)*5:(Math.random()-.5)*12,vy:window._cvState==="ritual"?0:Math.random()*-8-2,rx:Math.random()*30-15,ry:Math.random()*30-15,rz:Math.random()*30-15,vrx:(Math.random()-.5)*(window._cvState==="ritual"?30:6),vry:(Math.random()-.5)*(window._cvState==="ritual"?30:6),vrz:(Math.random()-.5)*(window._cvState==="ritual"?30:6)}),V||(v.style.visibility="hidden")}),g.forEach(v=>{t.appendChild(v.el),v.el.style.position="absolute",v.el.style.left=v.x+"px",v.el.style.top=v.y+"px",v.el.style.width=v.width+"px",v.el.style.height=v.height+"px",v.el.style.margin="0",v.el.style.transition="none",v.el.style.animation="none",v.el.style.boxSizing="border-box",v.el.style.userSelect="none",v.el.style.willChange="transform",v.el.style.transformOrigin="center center"}),Array.from(t.children).forEach(v=>{g.find(P=>P.el===v)||(v.style.display="none")});const w=.6,y=.55,S=.9,T=t.getBoundingClientRect(),M=window.innerHeight-T.top+20,O=0;function _(){if(window._cvState==="resetting")return;let v=!0;g.forEach(P=>{if(P.settled)return;const A=window._cvGravity!==void 0?window._cvGravity:w;P.vy+=A,P.x+=P.vx,P.y+=P.vy,P.rx+=P.vrx,P.ry+=P.vry,P.rz+=P.vrz,P.y<=O&&(P.y=O,P.vy<0&&(P.vy*=-y,P.vx+=(Math.random()-.5)*4)),P.y+P.height>=M&&(P.y=M-P.height,P.vy*=-y,P.vx*=S,P.vrx*=S,P.vry*=S,P.vrz*=S,Math.abs(P.vy)<1.2&&(P.vy=0),Math.abs(P.vx)<.2&&(P.vx=0));const F=P.x-P.startX,G=P.y-P.startY;P.el.style.transform=`translate3d(${F}px, ${G}px, 0) rotateX(${P.rx}deg) rotateY(${P.ry}deg) rotateZ(${P.rz}deg)`,P.el._cvPhysics={dx:F,dy:G,rx:P.rx,ry:P.ry,rz:P.rz};const V=window._cvGravity!==void 0&&window._cvGravity<0,h=window._cvState==="ritual";!V&&!h&&Math.abs(P.vy)<=.1&&Math.abs(P.vx)<=.1&&P.y+P.height>=M-2?P.settled=!0:v=!1}),v?(t.style.pointerEvents="none",window._cvState="shattered"):requestAnimationFrame(_)}requestAnimationFrame(_)}}function Is(e=900){if(!window._cvState||window._cvState==="idle"){if(document.querySelectorAll(".falling-word, .falling-clone").length===0)return;window._cvState="shattered"}if(window._cvState==="resetting")return;window._cvState="resetting";const t=document.getElementById("cv-container"),o=document.getElementById("cv-content"),i=document.getElementById("cv-scroller");if(!t||!o){window._cvState="idle";return}const a=document.querySelectorAll(".falling-word, .falling-clone");if(a.length>0&&typeof x<"u"){let f=function(){u||(n<s?m=requestAnimationFrame(f):d())},n=0;const s=a.length,c=[];a.forEach(g=>{const w=g._cvPhysics||{dx:0,dy:0,rx:0,ry:0,rz:0,scale:1};g.style.display==="none"&&(g.style.display="inline-block");const y=e*.4,S=e-y,T=Math.random()*y,M=new x.Tween(w).to({dx:0,dy:0,rx:0,ry:0,rz:0,scale:1},S).easing(x.Easing.Cubic.InOut).delay(T).onUpdate(()=>{const O=w.scale!==void 0?w.scale:1;g.style.transform=`translate3d(${w.dx}px, ${w.dy}px, 0) rotateX(${w.rx}deg) rotateY(${w.ry}deg) rotateZ(${w.rz}deg) scale(${O})`}).onComplete(()=>{n++,n===s&&d()}).start();c.push(M)});let u=!1;const d=()=>{u||(u=!0,c.forEach(g=>g.stop()),m&&cancelAnimationFrame(m),r())};let m;m=requestAnimationFrame(f),setTimeout(d,e+100)}else r();function r(){t.style.overflow="",i&&(i.style.overflow="");const n=document.getElementById("main-ui");n&&(n.style.pointerEvents=""),o.style.position="",o.style.pointerEvents="",document.querySelectorAll(".falling-clone, .falling-word").forEach(s=>s.remove()),Array.from(o.querySelectorAll([".header h1",".header .role",".contact-info span",".contact-info a",".collapsible-header",".role-header .company",".title-row .job-title",".title-row .date",".skills-grid span",".contact-grid div",".terminal-footer div",".collapsible-content p",".collapsible-content ul li"].join(", "))).forEach(s=>{s.dataset.originalHtml&&(s.innerHTML=s.dataset.originalHtml,delete s.dataset.originalHtml),s.dataset.wasHiddenByViewport&&(s.style.visibility="",delete s.dataset.wasHiddenByViewport)}),Array.from(o.children).forEach(s=>{s.style.display==="none"&&(s.style.display="")}),Array.from(o.querySelectorAll(".header-photo, .scanline-deco, .fui-corners, .audience-badge")).forEach(s=>{s.style.visibility==="hidden"&&(s.style.visibility="")}),window._cvState="idle"}}function vi(e=0){if(window._cvState&&window._cvState!=="idle"&&window._cvState!=="shattered")return;window._cvState="sucking";const t=document.getElementById("cv-container"),o=document.getElementById("cv-content"),i=document.getElementById("cv-scroller");if(!t||!o)return;t.classList.contains("collapsed")?(t.classList.remove("collapsed"),setTimeout(a,400)):a();function a(){if(window._cvState==="resetting"||window._cvState==="idle")return;t.style.overflow="visible",i&&(i.style.overflow="visible");const r=document.getElementById("main-ui");r&&(r.style.pointerEvents="none"),o.style.position="relative";const n=Array.from(o.querySelectorAll([".header h1",".header .role",".contact-info span",".contact-info a",".collapsible-header",".role-header .company",".title-row .job-title",".title-row .date",".skills-grid span",".contact-grid div",".terminal-footer div",".collapsible-content p",".collapsible-content ul li"].join(", "))),s=[];n.forEach(_=>{if(_.querySelector("svg")||_.querySelector("img"))return;_.dataset.originalHtml||(_.dataset.originalHtml=_.innerHTML);const v=document.createTreeWalker(_,NodeFilter.SHOW_TEXT,null,!1),P=[];for(;v.nextNode();)P.push(v.currentNode);P.forEach(A=>{if(A.nodeValue.trim()==="")return;const F=A.nodeValue.split(/(\s+)/),G=document.createDocumentFragment();F.forEach(V=>{if(V.trim()==="")G.appendChild(document.createTextNode(V));else{const h=document.createElement("span");h.textContent=V,h.style.display="inline-block",h.classList.add("falling-word"),s.push(h),G.appendChild(h)}}),A.parentNode.replaceChild(G,A)})});const c=s.map(_=>{const v=window.getComputedStyle(_);return{sColor:v.color,sFontSize:v.fontSize,sFontWeight:v.fontWeight,sLetterSpacing:v.letterSpacing,sTextTransform:v.textTransform,sFontFamily:v.fontFamily,sLineHeight:v.lineHeight,sTextShadow:v.textShadow!=="none"?v.textShadow:""}});s.forEach((_,v)=>{const P=c[v];_.style.color=P.sColor,_.style.fontSize=P.sFontSize,_.style.fontWeight=P.sFontWeight,_.style.letterSpacing=P.sLetterSpacing,_.style.textTransform=P.sTextTransform,_.style.fontFamily=P.sFontFamily,_.style.lineHeight=P.sLineHeight,_.style.textShadow=P.sTextShadow,_.style.whiteSpace="nowrap"});const u=o.getBoundingClientRect(),d=0,m=(e+1)/2*window.innerHeight-u.top,f=Array.from(o.querySelectorAll(".header-photo, .scanline-deco, .fui-corners, .audience-badge")),g=[...s,...f],w=g.map(_=>_.getBoundingClientRect()),y=[];g.forEach((_,v)=>{const P=w[v];if(P.width===0||P.height===0)return;const A=P.left-u.left,F=P.top-u.top,G=_.classList.contains("falling-word");let V=_;G||(V=_.cloneNode(!0),V.classList.add("falling-clone"),V.style.margin="0"),y.push({el:V,isClone:!G,x:A,y:F,startX:A,startY:F,width:P.width,height:P.height,vx:(Math.random()-.5)*6,vy:(Math.random()-.5)*6,rx:Math.random()*30-15,ry:Math.random()*30-15,rz:Math.random()*30-15,vrx:(Math.random()-.5)*15,vry:(Math.random()-.5)*15,vrz:(Math.random()-.5)*15,scale:1}),G||(_.style.visibility="hidden")}),y.forEach(_=>{o.appendChild(_.el),_.el.style.position="absolute",_.el.style.left=_.x+"px",_.el.style.top=_.y+"px",_.el.style.width=_.width+"px",_.el.style.height=_.height+"px",_.el.style.margin="0",_.el.style.transition="none",_.el.style.animation="none",_.el.style.boxSizing="border-box",_.el.style.userSelect="none",_.el.style.willChange="transform",_.el.style.transformOrigin="center center"}),Array.from(o.children).forEach(_=>{y.find(v=>v.el===_)||(_.style.display="none")});const S=.6,T=.55,M=.9;function O(){if(window._cvState==="resetting")return;let _=!0;y.forEach(v=>{if(v.settled)return;if(window._cvState==="falling"){const F=window.innerHeight-u.top+20;v.vy+=.6,v.x+=v.vx,v.y+=v.vy,v.rx+=v.vrx,v.ry+=v.vry,v.rz+=v.vrz,v.y+v.height>=F&&(v.y=F-v.height,v.vy*=-T,v.vx*=M,v.vrx*=M,v.vry*=M,v.vrz*=M,Math.abs(v.vy)<1.2&&(v.vy=0),Math.abs(v.vx)<.2&&(v.vx=0)),Math.abs(v.vy)<=.1&&Math.abs(v.vx)<=.1&&v.y+v.height>=F-2?v.settled=!0:_=!1}else{const F=d-(v.x+v.width/2),G=m-(v.y+v.height/2),V=Math.sqrt(F*F+G*G)||1;v.vx+=F/V*S,v.vy+=G/V*S,v.x+=v.vx,v.y+=v.vy,v.rx+=v.vrx,v.ry+=v.vry,v.rz+=v.vrz,v.x<=d&&(v.x=d,v.vx*=-T,v.vy*=M,v.vrx*=M,v.vry*=M,v.vrz*=M,Math.abs(v.vx)<1.2&&(v.vx=0),Math.abs(v.vy)<.2&&(v.vy=0)),Math.abs(v.vx)<=.1&&Math.abs(v.vy)<=.1&&v.x<=d+2?v.settled=!0:_=!1}const P=v.x-v.startX,A=v.y-v.startY;v.el.style.transform=`translate3d(${P}px, ${A}px, 0) rotateX(${v.rx}deg) rotateY(${v.ry}deg) rotateZ(${v.rz}deg)`,v.el._cvPhysics={dx:P,dy:A,rx:v.rx,ry:v.ry,rz:v.rz}}),_?(o.style.pointerEvents="none",window._cvState="shattered"):requestAnimationFrame(O)}requestAnimationFrame(O)}}function Ia(e=1e3){if(window._cvState&&window._cvState!=="idle"&&window._cvState!=="shattered")return;window._cvState="shaking";const t=document.getElementById("cv-container"),o=document.getElementById("cv-content");if(!t||!o||t.classList.contains("collapsed")){window._cvState="idle";return}const i=Array.from(o.querySelectorAll([".header h1",".header .role",".contact-info span",".contact-info a",".collapsible-header",".role-header .company",".title-row .job-title",".title-row .date",".skills-grid span",".fui-corners div",".scanline-deco",".header-photo"].join(", ")));if(i.length===0||typeof x>"u"){window._cvState="idle";return}let a=0;const r=i.length,n=[];i.forEach((m,f)=>{const g=window.getComputedStyle(m).display;g==="inline"&&(m.style.display="inline-block");const w=e*.35,y=Math.random()*w,S=e-y,T=new x.Tween({t:0}).to({t:1},S).easing(x.Easing.Quadratic.Out).delay(y).onUpdate(M=>{const O=1-M.t;if(O<=.02){m.style.transform="translate3d(0, 0, 0) rotateZ(0deg)";return}f*12.5;const _=(Math.random()-.5)*8*O,v=(Math.random()-.5)*6*O,P=(Math.random()-.5)*3*O;m.style.transform=`translate3d(${_}px, ${v}px, 0) rotateZ(${P}deg)`}).onComplete(()=>{m.style.transform="",g==="inline"&&(m.style.display=""),a++,a===r&&c()}).start();n.push(T)});let s=!1;const c=()=>{s||(s=!0,n.forEach(m=>m.stop()),u&&cancelAnimationFrame(u),i.forEach(m=>{m.style.transform=""}),window._cvState==="shaking"&&(window._cvState="idle"))};let u;function d(){if(window._cvState!=="shaking"){c();return}a<r?u=requestAnimationFrame(d):c()}u=requestAnimationFrame(d),setTimeout(c,e+100)}function Dc(e=1e3){if(window._cvState&&window._cvState!=="idle")return;window._cvState="jumping";const t=document.getElementById("cv-container"),o=document.getElementById("cv-content");if(!t||!o||t.classList.contains("collapsed")){window._cvState="idle";return}const i=Array.from(o.querySelectorAll([".header h1",".header .role",".contact-info span",".contact-info a",".collapsible-header",".role-header .company",".title-row .job-title",".title-row .date",".skills-grid span",".fui-corners div",".scanline-deco",".header-photo"].join(", ")));if(i.length===0||typeof x>"u"){window._cvState="idle";return}let a=0;const r=i.length,n=[];i.forEach(m=>{const f=window.getComputedStyle(m).display;f==="inline"&&(m.style.display="inline-block");const g=e*.4,w=Math.random()*g,y=e-w,S=new x.Tween({t:0}).to({t:1},y).easing(x.Easing.Linear.None).delay(w).onUpdate(T=>{const M=Math.sin(T.t*Math.PI)*-45;m.style.transform=`translate3d(0, ${M}px, 0)`}).onComplete(()=>{m.style.transform="",f==="inline"&&(m.style.display=""),a++,a===r&&c()}).start();n.push(S)});let s=!1;const c=()=>{s||(s=!0,n.forEach(m=>m.stop()),u&&cancelAnimationFrame(u),i.forEach(m=>{m.style.transform=""}),window._cvState==="jumping"&&(window._cvState="idle"))};let u;function d(){if(window._cvState!=="jumping"){c();return}a<r?u=requestAnimationFrame(d):c()}u=requestAnimationFrame(d),setTimeout(c,e+100)}var _n=J((()=>{window.cvFall=Gt,window.cvReset=Is,window.cvSuck=vi,window.cvShake=Ia,window.cvJump=Dc}));function Nc(e,t=3e3,o=null){const i=e.globalUniformsHub,a=e.constantUniform,r=[];o==="pc"?i&&i.uniforms.uPCBSODState?r.push(i.uniforms.uPCBSODState):a&&a.uPCBSODState&&r.push(a.uPCBSODState):o==="laptop"?i&&i.uniforms.uLaptopBSODState?r.push(i.uniforms.uLaptopBSODState):a&&a.uLaptopBSODState&&r.push(a.uLaptopBSODState):(i&&(i.uniforms.uBSODState&&r.push(i.uniforms.uBSODState),i.uniforms.uPCBSODState&&r.push(i.uniforms.uPCBSODState),i.uniforms.uLaptopBSODState&&r.push(i.uniforms.uLaptopBSODState)),a&&(a.uBSODState&&r.push(a.uBSODState),a.uPCBSODState&&r.push(a.uPCBSODState),a.uLaptopBSODState&&r.push(a.uLaptopBSODState))),r.length!==0&&(e._bsodTimeout&&clearTimeout(e._bsodTimeout),r.forEach(n=>n.value=1),e._bsodTimeout=setTimeout(()=>{r.forEach(n=>n.value=0),e._bsodTimeout=null},t))}function Lc(e,t=3e3){!te||!te.uniforms.uBootState||(e._bootingTimeout&&clearTimeout(e._bootingTimeout),te.uniforms.uBootState.value=0,e._bootingTimeout=setTimeout(()=>{te.uniforms.uBootState.value=1,e._bootingTimeout=null},t))}function Ra(e){if(!e.physicBodies||e.physicBodies.length===0){setTimeout(()=>Ra(e),1e3);return}if(e.world?.hasPointGravityOnBH||window._cvState==="sucking"){setTimeout(()=>Ra(e),1e3);return}let t=0;e.physicBodies.forEach(o=>{if(!o.isIntegrityCheckTarget&&!o.isIntegrityResetTarget)return;let i,a;if(o.threeObject&&o.threeObject.userData&&o.threeObject.userData.originalPos){const r=o.threeObject.userData.originalPos,n=o.threeObject.userData.originalRot;if(i=new l.Vector3(r.x,r.y,r.z),n&&n.isEuler)a=new l.Quaternion().setFromEuler(n);else if(o.threeObject.userData.originalQuaternion){const s=o.threeObject.userData.originalQuaternion;a=new l.Quaternion(s.x,s.y,s.z,s.w)}else{const s=o.rotation();a=new l.Quaternion(s.x,s.y,s.z,s.w)}}else{const r=o.translation(),n=o.rotation();i=new l.Vector3(r.x,r.y,r.z),a=new l.Quaternion(n.x,n.y,n.z,n.w)}o.integrity={position:i,quaternion:a},t++}),e.allowsResetting=!0,e.integrityBaselineCaptured=!0}function Rs(e,t,o,i=0){if(t.isResetting)return;if(e.world&&e.world.isBusy){setTimeout(()=>Rs(e,t,o,i),16);return}if(t.isResetting=!0,!t.integrity){t.isResetting=!1;return}try{t.rapierCollider&&t.rapierCollider.setSensor(!0)}catch{t.isResetting=!1;return}const a=t.integrity.position.clone(),r=t.integrity.quaternion;let n;try{n=t.bodyType()}catch{t.isResetting=!1;return}e._activeResetCount=(e._activeResetCount||0)+1,st(e,!0);const s=t.mass(),c=(Math.random()*8+2)*s;t.applyImpulse({x:0,y:i+c,z:0},!0);const u=(i+2)*s*.2;t.applyTorqueImpulse({x:(Math.random()-.5)*u,y:(Math.random()-.5)*u,z:(Math.random()-.5)*u},!0),t.wakeUp(),Wi(t,()=>{const d=`integrity-beam-${t.handle}`,m=t.threeObject&&t.threeObject.userData.isDragonBall?16763904:de.ELECTRIC_CYAN||65535;let f=null;if(He){const y=t.translation();He(e,"","",new l.Vector3(y.x,y.y,y.z),d,!0,m,!0,1/0,!0),f=e.getObjectByName(d)}const g=e.getObjectByName("mixamorigSpine1")||e.getObjectByName("a-char"),w=g?new l.Vector3().setFromMatrixPosition(g.matrixWorld):null;Yi(t,a,r,o,n,()=>{f&&(f.visible=!1,f.activeRequestID&&cancelAnimationFrame(f.activeRequestID)),t.isResetting=!1,e._activeResetCount--,st(e,!1)},(y,S)=>{if(f&&f.visible){const T=Re(e,"drone");if(T){const M=T.getObjectByName("Sphere001_0");if(M){const O=new l.Vector3;M.getWorldPosition(O);const _=O.distanceTo(y);f.position.copy(O),f.lookAt(y),f.children.forEach(v=>{v.scale.z=_})}}}},w)})}function Ms(e){if(e.allowsIntegrityCheck=!0,!e.allowsIntegrityCheck)return;let t;const o=()=>{clearTimeout(t),t=setTimeout(i,As)},i=()=>{if(!e.scenarioState||e.scenarioState.name!=="room"){o();return}if(!e.integrityBaselineCaptured){o();return}if(e.world?.hasPointGravityOnBH||e.isHeroAnimating){o();return}if(e.allowsResetting===!1){o();return}let a=[];e.physicBodies.forEach(s=>{if(!s.isIntegrityCheckTarget||!s.integrity||e.isHeroAnimating||s.isResetting||s.isManualControl)return;const c=s.threeObject;c&&c.name;const u=s.translation(),d=s.rotation(),m=new l.Vector3(u.x,u.y,u.z),f=new l.Quaternion(d.x,d.y,d.z,d.w),g=s.integrity.position,w=m.distanceTo(g);let y=!1;if(w>Ps)y=!0;else{const S=s.integrity.quaternion;f.angleTo(S)>Bs&&(y=!0)}y&&a.push(s)});let r=!1,n="";if(te.uniforms.uBootState&&te.uniforms.uBootState.value<.5&&(r=!0,n=Z("SYS_STORY_INTEGRITY_BOOTING")),e.objectMap&&[{obj:e.objectMap.get("screenDisplay001"),name:"Main Screen"},{obj:e.objectMap.get("verticalMonitorDisplay"),name:"Vertical Screen"}].forEach(s=>{s.obj&&s.obj.material!==te&&(r=!0,s.obj.material===Ne?n=Z("SYS_STORY_INTEGRITY_NETFLIX"):s.obj.material===Le||s.obj.material===Ye?n=Z("SYS_STORY_INTEGRITY_DOTA"):n=Z("SYS_STORY_INTEGRITY_WORK_FOCUS"))}),a.length>0||r){if(e.allowsResetting=!1,e.isHeroAnimating=!0,a.length>0&&a.map(w=>w.threeObject?w.threeObject.name:"Unknown Body"),r&&a.length===0?re(n):a.length<3?re(Z("SYS_STORY_INTEGRITY_MESS_LIGHT")):re(Z("SYS_STORY_INTEGRITY_MESS_HEAVY")),e.conversationManager)if(r){if(e.objectMap){const w=e.objectMap.get("screenDisplay001");w&&w.material===Ne?e.conversationManager.shout(Ie.SHOUT_RESET_NETFLIX.en):w&&(w.material===Le||w.material===Ye)?e.conversationManager.shout(Ie.SHOUT_RESET_DOTA.en):e.conversationManager.shout(Ie.SHOUT_RESET_GENERIC.en)}}else a.length>0&&e.conversationManager.shout(Ie.SHOUT_RESET_MESS.en);const s=r?Math.max(a.length,2):a.length;let c=Math.min(1+(s-1)*.5,4),u=Math.min(800+s*200,2e3);const d=s/1.25,m=Math.max(d*d,2)*2.5,f=rt(e,"bangingFist",{speed:c,randomize:!1,onComplete:()=>{}}),g=f.duration*1e3;if(setTimeout(()=>{e.allowsResetting=!0,e.isHeroAnimating=!1,o()},g+100),f&&f.duration){const w=f.duration*1e3*.4;setTimeout(()=>{kc(e),Uc(e,m*.2),Is(u),typeof window.cvJump=="function"&&window.cvJump(200),e.objectMap&&(["screenDisplay001","screenDisplay002","verticalMonitorDisplay"].forEach(S=>{const T=e.objectMap.get(S);T&&(T.material=te,T.userData.originalMaterial=te)}),te.uniforms.uBootState&&(te.uniforms.uBootState.value=1)),re(Z("SYS_STORY_INTEGRITY_RESTORING"));const y=performance.now()+u+200;if(e.physicBodies.forEach(S=>{try{S.isIntegrityResetTarget&&S.integrity&&typeof S.handle<"u"&&Rs(e,S,y,m)}catch{}}),Pn(e),Ze&&Ze.length>0){const S=["Object_12001","Object_108"],T=S[Math.floor(Math.random()*S.length)],M=e.getObjectByName(T);if(M){const O=new l.Vector3;M.getWorldPosition(O);const _=1.265+Math.random()*.46;Ze.forEach((v,P)=>{if(!v.visible)return;const A=P/Ze.length*Math.PI*2,F=O.x+Math.cos(A)*_,G=O.y+.05,V=O.z+Math.sin(A)*_,h=v.rapierBody;if(h){h.rapierCollider&&h.rapierCollider.setSensor(!0);const b=h.mass(),p=Math.random()*m*b;h.applyImpulse({x:0,y:m+p,z:0},!0);const R=m*b*.5;h.applyTorqueImpulse({x:(Math.random()-.5)*R,y:(Math.random()-.5)*R,z:(Math.random()-.5)*R},!0),h.wakeUp(),Wi(h,()=>{const C=new l.Vector3(F,G,V),N=new l.Quaternion().setFromEuler(new l.Euler(0,Math.random()*Math.PI,0)),q=`coin-integrity-beam-${h.handle}`,$=de.ELECTRIC_CYAN||65535;e._activeResetCount=(e._activeResetCount||0)+1,st(e,!0);let L=null;if(He){const U=h.translation();He(e,"","",new l.Vector3(U.x,U.y,U.z),q,!0,$,!0,1/0,!0),L=e.getObjectByName(q)}const B=e.getObjectByName("mixamorigSpine1")||e.getObjectByName("a-char"),z=B?new l.Vector3().setFromMatrixPosition(B.matrixWorld):null;Yi(h,C,N,y,fe.RigidBodyType.Dynamic,()=>{L&&(L.visible=!1,L.activeRequestID&&cancelAnimationFrame(L.activeRequestID)),e._activeResetCount--,st(e,!1)},(U,E)=>{if(L&&L.visible){const k=Re(e,"drone");if(k){const I=k.getObjectByName("Sphere001_0");if(I){const Y=new l.Vector3;I.getWorldPosition(Y);const H=Y.distanceTo(U);L.position.copy(Y),L.lookAt(U),L.children.forEach(D=>{D.scale.z=H})}}}},z)})}})}}},w)}}else o()};window.addEventListener("pointerdown",()=>{o()}),o()}function _s(e){e.allowsIntegrityCheck=!1}function kc(e){const t=new l.Group,o=new l.Color("#ffc783"),i=de.ACCENT_GOLD||new l.Color("#ffcc00");new l.Color("#ffffff"),t.position.set(-1.95,2.64,-1.35),e.add(t);const a=new l.TorusGeometry(1,.04,16,100),r=_t(o,1.5,.01,4),n=new l.Mesh(a,r);n.rotation.x=Math.PI/2;const s=_t(i,1.2,.01,4.5),c=new l.Mesh(a,s);c.rotation.x=Math.PI/2,c.rotation.z=.2,t.add(n,c);const u=new l.IcosahedronGeometry(.1,0),d=24,m=[];for(let y=0;y<d;y++){const S=y%2===0?o:i,T=io(S,1.5,4),M=new l.Mesh(u,T),O=_t(S,1.5,.01,4.5),_=new l.Mesh(u,O);_.scale.setScalar(1.4),M.add(_);const v=Math.random()*Math.PI*2,P=Math.random()*Math.PI*.6,A=.05+Math.random()*.15;M.userData.velocity=new l.Vector3(Math.sin(P)*Math.cos(v)*A,Math.cos(P)*A,Math.sin(P)*Math.sin(v)*A),M.userData.rotationSpeed=new l.Vector3(Math.random()*.15,Math.random()*.15,Math.random()*.15),t.add(M),m.push(M)}const f=new l.SphereGeometry(.2,8,8),g=io(o,1,5),w=new l.Mesh(f,g);t.add(w),new x.Tween({progress:0}).to({progress:1},3500).easing(x.Easing.Exponential.Out).onUpdate(y=>{const S=y.progress;m.forEach(T=>{T.position.add(T.userData.velocity),T.userData.velocity.multiplyScalar(.98),T.rotation.x+=T.userData.rotationSpeed.x,T.rotation.y+=T.userData.rotationSpeed.y,T.rotation.z+=T.userData.rotationSpeed.z;const M=1-S;T.scale.setScalar(M),T.material.uniforms&&(T.material.uniforms.glowIntensity.value=4*M);const O=T.children[0];O&&O.material.uniforms&&(O.material.uniforms.outerGlowStrength.value=1.5*M)}),n.scale.setScalar(.1+S*15),n.material.uniforms.outerGlowStrength.value=1.5*(1-S),c.scale.setScalar(.05+S*10),c.material.uniforms.outerGlowStrength.value=1.2*(1-S),w.scale.setScalar(2*(1-S*1.5)),w.material.uniforms&&(w.material.uniforms.glowIntensity.value=5*(1-S*2))}).onComplete(()=>{e.remove(t),a.dispose(),u.dispose(),f.dispose(),m.forEach(y=>{y.material.dispose(),y.children[0]&&y.children[0].material.dispose()}),r.dispose(),s.dispose(),g.dispose()}).start()}function Uc(e,t=.15,o=600){const i=e.camera;i&&(i._shakeOffset||(i._shakeOffset=new l.Vector3),new x.Tween({t:0}).to({t:1},o).easing(x.Easing.Quadratic.Out).onUpdate(a=>{const r=t*(1-a.t);i.position.sub(i._shakeOffset),i._shakeOffset.set((Math.random()-.5)*r,(Math.random()-.5)*r,(Math.random()-.5)*r),i.position.add(i._shakeOffset)}).onComplete(()=>{i.position.sub(i._shakeOffset),i._shakeOffset.set(0,0,0)}).start())}var As,Ps,Bs,st,An=J((()=>{ti(),pt(),lt(),ut(),Ao(),ii(),Xa(),_n(),ct(),et(),Cn(),As=3e3,Ps=2,Bs=.25,st=(e,t=!1)=>{if(e._activeResetCount===void 0&&(e._activeResetCount=0),e.globalUniformsHub&&e.cyanPulseActive){const o=e.globalUniformsHub.uniforms,i=e.cyanPulseActive;t?(i.value=1,o.uWorldGridProgress.value=1):e._activeResetCount<=0&&new x.Tween(o.uWorldGridProgress).to({value:0},150).onComplete(()=>{i.value=0}).start()}}}));function Fc(e){if(!e)return new l.Vector3(0,0,0);if(e.skeleton&&e.skeleton.bones.length>0){const o=e.skeleton.bones[0],i=new l.Vector3;return o.getWorldPosition(i),i}e.updateMatrixWorld(!0);const t=new l.Vector3;return e.getWorldPosition(t),t}function cr(e,t){const o=e.getObjectByName("Lathe_Center"),i=new l.Vector3;o?o.getWorldPosition(i):i.set(-8.5,7.25,-.39);const a=e.getObjectByName("a-char"),r=new l.Vector3;a?a.getWorldPosition(r):r.set(0,1,0),r.y+=.8,re("Dragon Balls drawn to the singularity..."),e.fanAction&&new x.Tween(e.fanAction).to({timeScale:12},1500).easing(x.Easing.Quadratic.In).start(),Hc(e,i,()=>{Gc(e,o),setTimeout(()=>{if(e._spawnStopSignal)return;const n=r.clone();n.y+=6+Math.random()*2.5,n.x+=(Math.random()-.5)*1.5,n.z+=(Math.random()-.5)*1.5;const s=oi(e,i.clone(),null);if(s&&s.rapierBody){const c=s.rapierBody;c.setBodyType(fe.RigidBodyType.KinematicPositionBased);const u=i.clone(),d=u.clone(),m=new l.Vector3().subVectors(n,i);n.addVectors(i,m.multiplyScalar(1.5));let f=null;new x.Tween(d).to({x:n.x,y:n.y,z:n.z},1400).easing(x.Easing.Cubic.Out).onStart(()=>{const g="coin-erupt-beam";He&&(He(e,"","",i.clone(),g,!1,16766720,!0,1/0,!0),f=e.getObjectByName(g))}).onUpdate(()=>{c.setNextKinematicTranslation(d);const g=d.distanceTo(u),w=n.distanceTo(u),y=w>0?g/w:0,S=1+Math.sin(y*Math.PI)*.4;s.scale.setScalar(.5*S);const T=Re(e,"drone");if(f&&f.visible&&T){const M=T.getObjectByName("Sphere001_0");if(M){const O=new l.Vector3;M.getWorldPosition(O);const _=O.distanceTo(d);f.position.copy(O),f.lookAt(d),f.children.forEach(v=>{v.scale.z=_}),e.gazeFollower&&e.gazeFollower.lookAtTarget(s)}}}).onComplete(()=>{s.scale.setScalar(.5);const g=e.getObjectByName("coin-erupt-beam");g&&(g.visible=!1,g.activeRequestID&&cancelAnimationFrame(g.activeRequestID)),c.setBodyType(fe.RigidBodyType.Dynamic),c.wakeUp(),c.applyImpulse({x:(Math.random()-.5)*6,y:18+Math.random()*12,z:(Math.random()-.5)*6},!0)}).start()}},250),setTimeout(()=>{e._spawnStopSignal||zc(e,i)},500)})}function Os(e,t,o){if(!(!e.rapierBody||!t.world))try{const i=e.rapierBody.collider(0),a=t.world.getCollider(i);a&&(a.setCollisionGroups(o),a.setSolverGroups(o))}catch{}}function Hc(e,t,o){Di(e,!1),setTimeout(()=>{const i=(e.dragonBalls||[]).filter(r=>r);if(i.length===0){o&&o();return}let a=i.length;i.forEach((r,n)=>{r.ritualStartScale=r.scale.clone(),r.position.clone(),r.rapierBody&&r.rapierBody.setBodyType(fe.RigidBodyType.KinematicPositionBased),Os(r,e,Us);const s=n*60;setTimeout(()=>{const c=r.position.clone(),u=new l.Vector3().subVectors(t,c).normalize(),d=n/Math.max(i.length,1)*Math.PI*2,m={t:0};new x.Tween(m).to({t:1},1e3).easing(x.Easing.Cubic.In).onUpdate(()=>{const f=m.t,g=new l.Vector3().lerpVectors(c,t,f);g.y+=Math.sin(f*Math.PI)*5;const w=f*Math.PI*3+d,y=f*(1-f)*4*2,S=new l.Vector3(-u.z,0,u.x).normalize();g.addScaledVector(S,Math.cos(w)*y),g.y+=Math.sin(w)*y*.5,r.rapierBody&&r.rapierBody.setNextKinematicTranslation(g);const T=1-f*.9;r.ritualStartScale&&r.scale.copy(r.ritualStartScale).multiplyScalar(T)}).onComplete(()=>{r.visible=!1,a--,a===0&&o&&o()}).start()},s)})},150)}function Gc(e,t){if(!t)return;const o=e.globalUniformsHub;o&&o.uNebulaRotationSpeed&&o.uNebulaSwirlSpeed&&new x.Tween({rot:.3,swirl:.25}).to({rot:3,swirl:25},600).easing(x.Easing.Exponential.Out).onUpdate(s=>{o.uNebulaRotationSpeed.value=s.rot,o.uNebulaSwirlSpeed.value=s.swirl}).onComplete(()=>{new x.Tween({rot:3,swirl:25}).to({rot:.3,swirl:.25},1500).easing(x.Easing.Quadratic.InOut).onUpdate(s=>{o.uNebulaRotationSpeed.value=s.rot,o.uNebulaSwirlSpeed.value=s.swirl}).start()}).start(),e.fanAction&&new x.Tween(e.fanAction).to({timeScale:1},2500).easing(x.Easing.Cubic.Out).start(),e.raycasterWrapper&&gn(e)}function zc(e,t){const o=e.dragonBalls||[];o.forEach((i,a)=>{if(i&&(i.rapierBody&&(i.rapierBody.setTranslation({x:t.x,y:t.y,z:t.z},!0),i.rapierBody.setLinvel({x:0,y:0,z:0},!0),i.rapierBody.setAngvel({x:0,y:0,z:0},!0)),i.visible=!0,i.ritualStartScale&&i.scale.copy(i.ritualStartScale),Os(i,e,Fs),i.rapierBody)){i.rapierBody.setBodyType(fe.RigidBodyType.Dynamic),i.rapierBody.wakeUp();const r=a/Math.max(o.length,1)*Math.PI*2+Math.random()*.4,n=20+Math.random()*15,s=10+Math.random()*8;i.rapierBody.applyImpulse({x:Math.cos(r)*n,y:s,z:Math.sin(r)*n},!0),i.rapierBody.applyTorqueImpulse({x:(Math.random()-.5)*4,y:(Math.random()-.5)*4,z:(Math.random()-.5)*4},!0)}})}function Pn(e,t=null,o=null){if(e.world&&e.world.isBusy){setTimeout(()=>Pn(e,t,o),16);return}const i=e.world.hasPointGravityOnBalls;e._dragonBallRestoreTimeout&&(clearTimeout(e._dragonBallRestoreTimeout),e._dragonBallRestoreTimeout=null),Di(e,!1);const a=e.dragonBalls||[];if(a.length===0){o&&o();return}const r=new l.Vector3(0,.8,0);if(t)r.copy(t);else{const d=Fc(e.getObjectByName("Object_108"));r.copy(d),r.y+=.25}const n=1.035,s=5,c=performance.now()+1200+200;let u=a.length;a.forEach((d,m)=>{if(!d||!d.rapierBody)return;const f=d.rapierBody;f.rapierCollider&&f.rapierCollider.setSensor(!0);const g=m/a.length*Math.PI*2,w=r.x+Math.cos(g)*n,y=r.y,S=r.z+Math.sin(g)*n,T=f.mass(),M=Math.random()*s*T;f.applyImpulse({x:0,y:s+M,z:0},!0);const O=s*T*.5;f.applyTorqueImpulse({x:(Math.random()-.5)*O,y:(Math.random()-.5)*O,z:(Math.random()-.5)*O},!0),f.wakeUp(),Wi(f,()=>{const _=new l.Vector3(w,y,S),v=new l.Quaternion,P=`dragon-beam-${m}`;let A=null;if(He){const F=f.translation();He(e,"","",new l.Vector3(F.x,F.y,F.z),P,!0,16747520,!0,1/0,!0),A=e.getObjectByName(P)}e._activeResetCount=(e._activeResetCount||0)+1,st&&st(e,!0),Yi(f,_,v,c,fe.RigidBodyType.Dynamic,()=>{A&&(A.visible=!1,A.activeRequestID&&cancelAnimationFrame(A.activeRequestID)),e._activeResetCount--,st&&st(e,!1),u--,u===0&&(o&&o(),e.gazeFollower&&(e.gazeFollower.isLocked=!1,Vt(e,e.camera,!1)),i&&(e._dragonBallRestoreTimeout=setTimeout(()=>{e.world&&e.world.ballBodies&&Di(e,!0),e._dragonBallRestoreTimeout=null},3e3)))},(F,G)=>{const V=e.getObjectByName("drone");if(A&&A.visible&&V){const h=V.getObjectByName("Sphere001_0");if(h){const b=new l.Vector3;h.getWorldPosition(b);const p=b.distanceTo(F);A.position.copy(b),A.lookAt(F),A.children.forEach(R=>{R.scale.z=p}),m===0&&Vt(e,r,!0)}}})})})}function oi(e,t,o,i=!1,a=null){const r=e.getObjectByName("btc_symbol"),n=e.getObjectByName("eth_symbol");if(!r){console.warn("btc_symbol not found in scene");return}const s=.5;yi||(yi=cs.clone(),Ma=mn.clone());let c="BTC",u=r;a?(c=a==="ETH"?"ETH":"BTC",u=c==="ETH"?n:r):n&&Math.random()>.5&&(c="ETH",u=n);let d=null,m=!1,f=null;if(Ze.length>=Ns){const O=Ze.shift();O&&(f=O.userData.coinType,Vc(e,O))}if(Ze.length+Mt.length>=Ds){let O=Mt.shift();!O&&Ze.length>0&&(O=Ze.shift()),O&&($o(e,O),O.userData.coinType==="ETH"?jo.push(O):Ko.push(O))}const g=c==="ETH"?jo:Ko;if(g.length>0)d=g.shift(),m=!0,d.visible=!0,La(e,d);else{d=u.clone(),d.scale.setScalar(s),d.name=`${c}_${performance.now()} `,d.userData.coinType=c,d.material=yi,La(e,d);const O=d.clone();O.name="Aura",O.material=Ma,O.position.set(0,0,0),O.rotation.set(0,0,0),O.scale.setScalar(1.25),d.add(O),e.add(d)}Ze.push(d),t&&d.position.copy(t),d.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI);const w=u.scale.clone(),y=w.clone();if(e.world){const O=m&&d.rapierBody?d.rapierBody:null;if(O)O.wakeUp(),O.setTranslation({x:t.x,y:t.y,z:t.z},!0),O.setLinvel({x:0,y:0,z:0},!0),O.setAngvel({x:0,y:0,z:0},!0);else{const{body:v,shape:P}=Xe(e,d,{bodyType:"dynamic",mass:1,restitution:.2,friction:.8,canSleep:!0,isConvexHull:!0,isBhTarget:!0,linearDamping:.8,angularDamping:.8});Qa(e,d,v,P)}const _=d.rapierBody;_&&(o&&_.applyImpulse({x:o.x,y:o.y,z:o.z},!0),_.applyTorqueImpulse({x:Math.random(),y:Math.random(),z:Math.random()},!0),e.bhTargets&&!e.bhTargets.includes(d)&&e.bhTargets.push(d))}if(m||So(e,d,{onMouseEnter:O=>{const _=_a[c.toLowerCase()];let v=`Push ${c}`;if(_){const P=_.toLocaleString("en-US",{style:"currency",currency:"USD",minimumFractionDigits:_<1?4:0,maximumFractionDigits:_<1?4:0}),A=new Date,F=A.toLocaleString("en-US",{month:"short"}),G=A.getDate(),V=A.getFullYear(),h=A.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:!1});v=`${c}: ${P} 
at ${F}${G} ${V}, ${h}`}Ls(e,c==="ETH"?xn:Sn,v),hn(e,O)},onMouseLeave:O=>{ks(e)},onMouseDown:(O,_)=>{Vi(e,O,_,5)}}),!i&&e.fireflies&&e.fireflies.triggerFlash&&Aa!==c&&(e.fireflies.triggerFlash(c),Aa=c),Ze.length%5,!i){const O=c==="BTC"?"Bitcoin":"Ethereum";re(f?`Received 1 ${O}, lost 1 ${f==="BTC"?"Bitcoin":"Ethereum"}. Even you can't hold that much power!`:`The Cosmos has manifested 1 ${O} just for you!`)}const S=.1;d.scale.copy(w).multiplyScalar(s*S);const T={t:0};d.userData.oscStrength=5;const M=d.getObjectByName("Aura");if(M&&(M.userData.oscStrength=5),!m){const O=_=>{_.onBeforeRender=function(v,P,A,F,G,V){G.uniforms&&G.uniforms.uOscillationStrength&&(this.userData.prevOsc=G.uniforms.uOscillationStrength.value,G.uniforms.uOscillationStrength.value=this.userData.oscStrength)},_.onAfterRender=function(v,P,A,F,G,V){G.uniforms&&G.uniforms.uOscillationStrength&&this.userData.prevOsc!==void 0&&(G.uniforms.uOscillationStrength.value=this.userData.prevOsc)}};O(d),M&&O(M)}return d.userData.activeTween&&d.userData.activeTween.stop(),d.userData.activeTween=new x.Tween(T).to({t:1},5e3).easing(x.Easing.Cubic.Out).onUpdate(()=>{const O=T.t;d.scale.lerpVectors(w.clone().multiplyScalar(s*S),y.clone().multiplyScalar(s),O);const _=5*(1-O);d.userData.oscStrength=_,M&&(M.userData.oscStrength=_)}).onComplete(()=>{d.userData.activeTween=null}).start(),d}function Vc(e,t){if(Mt.length>40){$o(e,t),t.userData.coinType==="ETH"?jo.push(t):Ko.push(t);return}if(Mt.push(t),t.rapierBody){t.rapierBody.setBodyType(fe.RigidBodyType.Dynamic),t.rapierBody.wakeUp();const o=new l.Vector3(6,7,8),i=new l.Vector3().subVectors(o,t.position).normalize();i.multiplyScalar(30),t.rapierBody.applyImpulse({x:i.x,y:i.y,z:i.z},!0),t.rapierBody.applyTorqueImpulse({x:Math.random(),y:Math.random(),z:Math.random()},!0)}t.userData.activeTween&&t.userData.activeTween.stop(),t.userData.activeTween=new x.Tween(t.scale).to({x:0,y:0,z:0},500).delay(1500).easing(x.Easing.Back.In).onComplete(()=>{t.userData.activeTween=null,$o(e,t);const o=Mt.indexOf(t);o>-1&&Mt.splice(o,1),t.userData.coinType==="ETH"?jo.push(t):Ko.push(t)}).start()}function $o(e,t){if(t&&(e.world&&e.world.ballBodies&&e.world.ballBodies.includes(t.rapierBody)&&e.world.ballBodies.splice(e.world.ballBodies.indexOf(t.rapierBody),1),e.bhTargets&&e.bhTargets.includes(t)&&e.bhTargets.splice(e.bhTargets.indexOf(t),1),pu(e,t.name),t.userData.activeTween&&(t.userData.activeTween.stop(),t.userData.activeTween=null),t.visible=!1,t.rapierBody)){t.rapierBody.setBodyType(fe.RigidBodyType.Dynamic),t.rapierBody.setTranslation({x:0,y:-100,z:0},!0),t.rapierBody.setLinvel({x:0,y:0,z:0},!0),t.rapierBody.setAngvel({x:0,y:0,z:0},!0),t.rapierBody.sleep();const o=`coin-integrity-beam-${t.rapierBody.handle}`,i=e.getObjectByName(o);i&&(i.visible=!1,i.activeRequestID&&cancelAnimationFrame(i.activeRequestID))}}function Wc(e){Bn(e)}function Bn(e){const t=[...Ze,...Mt];Ze.length=0,Mt.length=0;let o=0;const i=5,a=()=>{if(!e)return;const r=Math.min(o+i,t.length);for(let n=o;n<r;n++){const s=t[n];s&&$o(e,s)}o=r,o<t.length?requestAnimationFrame(a):e.children.forEach(n=>{n&&n.name&&(n.name.startsWith("BTC_")||n.name.startsWith("ETH_"))&&n.visible&&$o(e,n)})};t.length>0&&a()}var yi,Ma,_a,Aa,Ze,Ko,jo,Mt,Ds,Ns,Ls,ks,Us,Fs,ii=J((()=>{Qo(),so(),ct(),Zo(),En(),pt(),Rc(),ti(),Cn(),ut(),An(),yi=null,Ma=null,_a={},Aa=null,Ic().then(e=>{e.forEach(t=>{_a[t.symbol.toLowerCase()]=t.current_price})}),Ze=[],Ko=[],jo=[],Mt=[],Ds=120,Ns=60,Ls=(e,t,o)=>{e.raycasterWrapper?.mouseInContainer&&(ge(e,t,o),document.body.style.cursor="pointer")},ks=e=>{pe(e),document.body.style.cursor="auto"},Us=131074,Fs=4294967295}));function Yc(){const e=document.getElementById("narrative-shader-canvas"),t=document.querySelector(".modal-narrative");if(!e||!t)return;ye.parent=t;const o=new l.WebGLRenderer({canvas:e,alpha:!0,antialias:!1});o.setPixelRatio(.5),o.setSize(t.clientWidth,t.clientHeight),ye.renderer=o;const i=new l.Scene,a=new l.OrthographicCamera(-1,1,1,-1,0,1);ye.scene=i,ye.camera=a;const r=new l.PlaneGeometry(2,2),n=new l.TextureLoader().load(zs);n.wrapS=l.RepeatWrapping,n.wrapT=l.RepeatWrapping;const s=new l.ShaderMaterial({uniforms:{iTime:{value:0},iResolution:{value:new l.Vector2(t.clientWidth,t.clientHeight)},iMouse:{value:new l.Vector4(0,0,0,0)},iChannel0:{value:n}},vertexShader:`
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
    `,transparent:!0});ye.material=s;const c=new l.Mesh(r,s);i.add(c),ye.mesh=c,window.addEventListener("mousemove",u=>{t.getBoundingClientRect();const d=window.innerWidth,m=window.innerHeight,f=u.clientX/d*2-1,g=u.clientY/m*2-1,w=(f+1)*.5*t.clientWidth,y=(1-(g+1)*.5)*t.clientHeight;ye.targetMouse.set(w,y,1,1)}),ye.startTime=performance.now(),window.addEventListener("resize",Hs)}function qc(){ye.active||(Hs(),ye.startTime=performance.now(),ye.currentMouse.x=ye.targetMouse.x,ye.currentMouse.y=ye.targetMouse.y,ye.currentMouse.z=1,ye.currentMouse.w=1,ye.active=!0,Gs())}function $c(){ye.active=!1,ye.animationId&&(cancelAnimationFrame(ye.animationId),ye.animationId=null)}function Hs(){const{parent:e,renderer:t,material:o}=ye;if(!e||!t||!o)return;const i=e.clientWidth,a=e.clientHeight;t.setSize(i,a),o.uniforms.iResolution.value.set(i,a)}function Gs(){if(!ye.active)return;ye.animationId=requestAnimationFrame(Gs);const{renderer:e,scene:t,camera:o,material:i,startTime:a,targetMouse:r,currentMouse:n,lerpFactor:s}=ye;!e||!t||!o||!i||(n.x+=(r.x-n.x)*s,n.y+=(r.y-n.y)*s,n.z+=(r.z-n.z)*s,n.w+=(r.w-n.w)*s,i.uniforms.iTime.value=(performance.now()-a)*.001,i.uniforms.iMouse.value.copy(n),e.render(t,o))}var ye,zs,Kc=J((()=>{ye={renderer:null,scene:null,camera:null,material:null,mesh:null,parent:null,animationId:null,active:!1,startTime:0,targetMouse:new l.Vector4(0,0,0,0),currentMouse:new l.Vector4(0,0,0,0),lerpFactor:.08},zs="./textures/noise.webp"}));function jc(e){Qc(e),Yc(),window.addEventListener("keydown",t=>{const o=t.key.toLowerCase();if(o==="g")zt(e);else if(o==="l")Li(e,null,!0);else if(o==="i"||o==="d"){const i=document.getElementById("cv-container");if(i){const a=document.getElementById("app-container"),r=a?a.offsetWidth:window.innerWidth,n=r*.05,s=i.offsetWidth,c=o==="i"?s+n:s-n;c>200&&c<r*.9&&(i.style.width=`${c}px`,i.classList.contains("collapsed")&&(i.style.transform=`translateX(${c}px)`,i.style.marginRight=`-${c}px`,i.userData&&(i.userData.x=c,i.userData.margin=-c))),window.dispatchEvent(new Event("resize"))}}}),window.addEventListener("subtitleClose",t=>{const o=e.scenarioState?.name==="room",i=!e.isHeroAnimating&&!e.isTransitioning;t.detail?.manual&&o&&i&&zt(e)})}function Xc(e,t){const o=On.filter(i=>i.event==="click");for(const i of o){const a=e.target.closest(i.selector);if(a){i.action(e,t,a);return}}}function Qc(e){document.body.addEventListener("click",t=>Xc(t,e)),On.forEach(t=>{t.event!=="click"&&document.querySelectorAll(t.selector).forEach(o=>{o.addEventListener(t.event,i=>t.action(i,e,o))}),t.event==="click"&&document.querySelectorAll(t.selector).forEach(o=>{o.tagName!=="A"&&(o.style.cursor="pointer")})})}async function zt(e,t={}){const{onImpact:o=null,onComplete:i=null}=t;if(!(e.scenarioState&&e.scenarioState.name==="room")||e.isHeroAnimating||!window.boneTracker){console.warn("[Cinematic] Aborted: Context mismatch or active animation.");return}const a=e.getObjectByName("a-char"),r=e.getObjectByName("stool_bound");if(!a||!r)return;e.isHeroAnimating=!0,e.allowsResetting=!1;const n=["pokeball","pokeball2","questionCube"];let s=null,c=1/0;n.forEach(m=>{const f=e.getObjectByName(m);if(f&&f.visible&&f.rapierBody){const g=f.position.distanceTo(a.position);g<c&&(c=g,s=f)}});const u=()=>{const m=w=>{if(!w)return!1;const y=w.getBoundingClientRect();return y.top<window.innerHeight&&y.bottom>0},f=document.querySelector("#persona-switch-btn");if(m(f))return f;const g=Array.from(document.querySelectorAll("h2")).find(w=>m(w));return g||document.querySelector("#cv-export-btn")||document.querySelector("#cv-header")},d=document.querySelector("#persona-switch-btn");if(d&&d.classList.add("persona-aggressive-jitter"),s&&s.rapierBody){const m=s.rapierBody,f=new l.Vector3(1,1,-1.5),g=new l.Quaternion(0,0,0,1),w=m.bodyType();m.rapierCollider&&m.rapierCollider.setSensor(!0);const y=m.mass();m.wakeUp(),m.applyImpulse({x:0,y:15*y,z:0},!0);const S=e.getObjectByName("mixamorigSpine1"),T=new l.Vector3;S?S.getWorldPosition(T):a.getWorldPosition(T),Wi(m,()=>{const M=`ritual-beam-${m.handle}`,O=de.ELECTRIC_CYAN||65535,_=m.translation();He(e,"","",new l.Vector3(_.x,_.y,_.z),M,!0,O,!0,1/0,!0);const v=e.getObjectByName(M);Yi(m,f,g,performance.now()+1e3,w,()=>{v&&(v.visible=!1,v.activeRequestID&&cancelAnimationFrame(v.activeRequestID)),m.setTranslation(f,!0),m.setLinvel({x:0,y:0,z:0},!0),m.setAngvel({x:0,y:0,z:0},!0)},(P,A)=>{if(v&&v.visible){const F=e.objectMap&&e.objectMap.get?e.objectMap.get("drone"):e.getObjectByName("drone");if(F){const G=F.getObjectByName("Sphere001_0");if(G){const V=new l.Vector3;G.getWorldPosition(V);const h=V.distanceTo(P);v.position.copy(V),v.lookAt(P),v.children.forEach(b=>{b.scale.z=h})}}}},T)})}if(setTimeout(()=>{rt(e,"sitToStand",{speed:1.2,autoReturn:!1})},2e3),await Ba(e,{x:1,y:0,z:.75}),d&&d.classList.remove("persona-aggressive-jitter"),window.boneTracker){const m=u(),f=m&&m.tagName==="H2";f&&(m.style.outline="2px solid var(--c-cyan)",m.style.outlineOffset="4px",m.style.transition="outline 0.3s ease"),window.boneTracker.hasHitThisSwing=!1,window.boneTracker.initTargetElement(m),window.boneTracker.setOffset(.05,.36,-.05),window.boneTracker.setRotationOffset(-30,0,110),window.boneTracker.setScale(3),window.boneTracker.toggleTracking(()=>{rt(e,"golfDrive",{speed:.7,autoReturn:!1,onComplete:()=>{window.boneTracker&&window.boneTracker.isActive&&window.boneTracker.toggleTracking(),rt(e,"standClap",{speed:1,crossFadeDuration:.8,onComplete:async()=>{await new Promise(g=>setTimeout(g,500)),await Ba(e,null),f&&(m.style.outline="",m.style.outlineOffset=""),e.isHeroAnimating=!1,e.allowsResetting=!0,i&&i()}})}}),setTimeout(()=>{o&&o()},660)})}}async function ur(e,t=!0){const o=e.scenarioState?.name==="room";if(t){const i=se.currentMode===Te.DEV?Te.POBA:Te.DEV;if(o){if(e.isHeroAnimating){ge(e,typeof gs<"u"&&Oi?Oi:null,"CHANGING PROTOCOL..."),e._informerTimeout&&clearTimeout(e._informerTimeout),e._informerTimeout=setTimeout(()=>pe(e),1500);return}se.setPersona(i),zt(e,{onImpact:()=>{const s=i===Te.POBA?"SYS_DRONE_SUBTITLES_POBA":"SYS_DRONE_SUBTITLES_DEV",c=typeof Z=="function"?Z(s):"";c&&(Xi(c),He(e,null,c))}});return}const a=e.pointsApp,r=e.scenarioState&&e.scenarioState.name==="points",n=a&&typeof a.getCurrentStep=="function"&&a.getCurrentStep()===0;r&&n?se.setPersona(i,{skipPointsSync:!0}):se.setPersona(i)}}function Ni(e){if(e.isHeroAnimating||e.allowsResetting===!1||e.scenarioState&&e.scenarioState.name!=="room")return;const t=e.getObjectByName("stool_bound"),o=e.getObjectByName("a-char");if(!t||!o)return;e.isHeroAnimating=!0,e.allowsResetting=!1;const i=new l.Vector3,a=new l.Quaternion;t.getWorldPosition(i),t.getWorldQuaternion(a);const r=o.position.x,n=o.position.y,s=o.position.z,c=[{name:"gangnam",moveOffset:new l.Vector3(5,0,0),returnSpeed:1,returnDuration:440,isRobot:!1},{name:"breakDance",moveOffset:new l.Vector3(3,0,-2),returnSpeed:1.2,returnDuration:440,isRobot:!1},{name:"robotDance",moveOffset:new l.Vector3(1,0,0),returnSpeed:1,returnDuration:200,isRobot:!0}].filter(v=>e.heroClips?.some(P=>P.name.toLowerCase()===v.name.toLowerCase()));if(c.length===0)return;const u=Math.random();let d;u<.5?d=c.find(v=>v.name==="breakDance"):u<.75?d=c.find(v=>v.name==="gangnam"):d=c.find(v=>v.name==="robotDance"),d||(d=c[Math.floor(Math.random()*c.length)]);const m=e.heroClips.find(v=>v.name.toLowerCase()===d.name.toLowerCase());let f=d.moveOffset,g=d.returnDuration,w=d.returnSpeed,y=d.isRobot;const S=new l.Vector3;o.getWorldPosition(S);const T=S.clone().add(f).clone();o.parent&&o.parent.worldToLocal(T);const M=t.rapierBody;if(M){M.setBodyType(fe.RigidBodyType.Dynamic),M.wakeUp();const v=new l.Vector3(75+Math.random()*10,50+Math.random()*5,(Math.random()-.5)*5),P=new l.Vector3(Math.random()*2,Math.random()*5,Math.random()*2);M.applyImpulse({x:v.x,y:v.y,z:v.z},!0),M.applyTorqueImpulse(P,!0)}new x.Tween(o.position).to({x:T.x,y:T.y,z:T.z},800).easing(x.Easing.Quadratic.Out).start(),m&&rt(e,m.name,{idleClipName:y?"typing":"walking",onComplete:()=>O()});function O(){if(y)new x.Tween(o.position).to({x:r,y:n,z:s},g).easing(x.Easing.Quadratic.Out).onComplete(()=>{e.isHeroAnimating=!1,e.allowsResetting=!0}).start(),_();else{rt(e,"walking",{idleClipName:"typing",speed:w});const v=o.position.clone(),P=new l.Vector3(r,n,s),A={t:0};new x.Tween(A).to({t:1},1200).easing(x.Easing.Linear.None).onUpdate(()=>{let F=A.t;F<.2?F=Math.pow(F/.2,3)*.05:F=.05+(F-.2)/.8*.95,o.position.lerpVectors(v,P,F)}).onComplete(()=>{rt(e,"typing",{crossFadeDuration:.2}),_(500),e.isHeroAnimating=!1,e.allowsResetting=!0}).start()}}function _(v=1e3){if(!M)return;M.setBodyType(fe.RigidBodyType.KinematicPositionBased),M.setLinvel({x:0,y:0,z:0},!0),M.setAngvel({x:0,y:0,z:0},!0),M.wakeUp();const P=M.translation(),A=M.rotation(),F={t:0};new x.Tween(F).to({t:1},v).easing(x.Easing.Cubic.Out).onUpdate(()=>{const G=new l.Vector3().lerpVectors(P,i,F.t),V=new l.Quaternion().copy(A).slerp(a,F.t);M.setTranslation(G,!0),M.setRotation(V,!0);const h=G.clone();t.parent&&t.parent.worldToLocal(h),t.position.copy(h);const b=V.clone();if(t.parent){const p=new l.Quaternion;t.parent.getWorldQuaternion(p),t.quaternion.copy(p.invert().multiply(b))}else t.quaternion.copy(b)}).onComplete(()=>{y&&e.heroClips&&rt(e,"typing",{crossFadeDuration:.5})}).onStart(()=>{e.stoolGridUniforms&&(e.stoolGridUniforms.uWorldGridActive.value=1,e.stoolGridUniforms.uWorldGridProgress.value=0,new x.Tween(e.stoolGridUniforms.uWorldGridProgress).to({value:1},600).easing(x.Easing.Quadratic.Out).onComplete(()=>{setTimeout(()=>{new x.Tween(e.stoolGridUniforms.uWorldGridProgress).to({value:0},500).onComplete(()=>{e.stoolGridUniforms.uWorldGridActive.value=0}).start()},200)}).start())}).start()}}function dr(e,t){ko&&(clearTimeout(ko),ko=null),t?ko=setTimeout(()=>{fr(e,!0)},Vs):fr(e,!1)}function fr(e,t){const o=e.pointsApp;if(!o||!o.material)return;t?(ge(e,Rt,"The closer you look..."),e.conversationManager?.shout("...the less you see.")):pe(e);const i=(o.getCurrentStep?o.getCurrentStep():0)===2?.3:1,a=e.camera,r=e.orbitControls;r&&t&&(r.isStrategicHover=!0);const n=o.material.uniforms;Si&&Si.stop();const s=t?.8+2.7*i:.8,c=t?800:500;if(Si=new x.Tween(n.uModelVibFactor).to({value:s},c).easing(x.Easing.Cubic.Out).start(),!a||!r)return;mo||(mo=a.position.clone()),ho||(ho=a.rotation.clone()),Qt===null&&(Qt=a.fov),wi&&wi.stop(),xi&&xi.stop();const u=new l.Vector3(1.8,.6,-1.8).multiplyScalar(i),d=t?mo.clone().add(u):mo.clone(),m=(Qt-38)*i,f=t?Qt-m:Qt;wi=new x.Tween(a.position).to({x:d.x,y:d.y,z:d.z},c).easing(x.Easing.Cubic.Out).onUpdate(()=>{if(t){const g=.05*i,w=.04*i;a.rotation.x=l.MathUtils.lerp(a.rotation.x,ho.x-g,.05),a.rotation.y=l.MathUtils.lerp(a.rotation.y,ho.y+w,.05)}}).onComplete(()=>{t||(mo=null,ho=null,Qt=null,r&&(r.isStrategicHover=!1))}).start(),xi=new x.Tween(a).to({fov:f},c).easing(x.Easing.Cubic.Out).onUpdate(()=>{a.updateProjectionMatrix()}).start()}function Zc(e){const t=e.pointsApp;if(!t||!t.getCurrentStep)return;const o=t.getCurrentStep(),i=t.material.uniforms;switch(o){case 0:new x.Tween(i.uModelScale).to({value:0},150).easing(x.Easing.Exponential.In).onComplete(()=>{new x.Tween(i.uModelScale).to({value:1.2},300).easing(x.Easing.Back.Out).onComplete(()=>{new x.Tween(i.uModelScale).to({value:1},400).easing(x.Easing.Quadratic.Out).start()}).start()}).start();break;case 1:e.stoolGridUniforms&&(e.stoolGridUniforms.uWorldGridActive.value=1,e.stoolGridUniforms.uWorldGridProgress.value=0,new x.Tween(e.stoolGridUniforms.uWorldGridProgress).to({value:1},800).easing(x.Easing.Cubic.Out).onComplete(()=>{e.stoolGridUniforms.uWorldGridActive.value=0}).start());break;case 2:t.playNextDance&&t.playNextDance();break}}function Li(e,t,o){const i=document.getElementById("cv-container");if(!i)return;i.userData||(i.userData={});const a=i.userData;let r;o!==void 0?r=o:r=!i.classList.contains("collapsed"),r?i.classList.add("collapsed"):i.classList.remove("collapsed"),document.body.classList.toggle("cv-collapsed",r),a.tween&&a.tween.stop();const n=!r,s=i.offsetWidth||600,c=r?s:0,u=r?-s:0;a.x===void 0&&(a.x=r?0:s),a.margin===void 0&&(a.margin=r?0:-s),a.tween=new x.Tween(a).to({x:c,margin:u},800).easing(x.Easing.Back.Out).onUpdate(()=>{i.style.transform=`translateX(${a.x}px)`,i.style.marginRight=`${a.margin}px`}).onComplete(()=>{r&&(i.style.opacity="0")}).onStart(()=>{n&&(i.style.opacity="1")}).start(),window.dispatchEvent(new CustomEvent("cvToggle",{detail:{collapsed:r}})),e.HUD&&typeof e.HUD.breathe=="function"&&e.HUD.breathe(de.ELECTRIC_CYAN),t&&ge(e,null,r?"EXPAND CV PANEL":"COLLAPSE CV PANEL",!0)}function pr(e,t){if(t){const o=document.getElementById("cv-container"),i=!o||o.classList.contains("collapsed")?"EXPAND CV PANEL":"COLLAPSE CV PANEL";ge(e,null,i,!0),e.HUD&&typeof e.HUD.breathe=="function"&&e.HUD.breathe(de.ELECTRIC_CYAN)}else pe(e)}function Pa(e,t,o){if(o){const i=t.getAttribute("data-label"),a=t.getAttribute("data-platform"),r=`COPY ${i.toUpperCase()} & OPEN ${a.toUpperCase()}`;ge(e,null,r,!0,!0)}else pe(e)}async function Jc(e,t){t.getAttribute("data-label");const o=t.getAttribute("data-url"),i=t.getAttribute("data-id")==="gmail",a=o;try{await navigator.clipboard.writeText(a),ge(e,null,"COPIED TO CLIPBOARD!",!0,!0);const r=i?`mailto:${o}`:o;window.open(r,"_blank"),setTimeout(()=>{t.matches(":hover")&&Pa(e,t,!0)},1500)}catch(r){console.error("Clipboard copy failed:",r)}window.uiAnims&&window.uiAnims.triggerSpring&&window.uiAnims.triggerSpring(t)}function eu(e){const t=document.getElementById(e),o=document.getElementById("cv-scroller");if(t&&o){const i=t.nextElementSibling;i&&i.classList.contains("collapsed")&&t.click();const a=85,r=t.offsetTop;o.scrollTo({top:r-a,behavior:"smooth"})}}async function mr(e){const t=document.getElementById("work-experience-modal");t&&(t.style.display="none",e&&(e.raycasterEnabled=!0),$c()),Li(e,null,!1),await new Promise(a=>setTimeout(a,400));const o=document.getElementById("board"),i=document.querySelector(".three-js-backdrop");o&&(o.style.opacity="1"),i&&(i.style.opacity="1"),e.HUD&&typeof e.HUD.runTweenOpen=="function"&&e.HUD.runTweenOpen()}var On,Ba,wi,Si,xi,mo,ho,Qt,ko,Vs,Dn=J((()=>{co(),ti(),Cn(),et(),Zo(),Qo(),ut(),lt(),pt(),Kc(),On=[{selector:"#persona-switch-btn",event:"click",action:(e,t)=>{e.stopPropagation(),se.togglePersonaPanel()}},{selector:".header-photo",event:"click",action:(e,t)=>ur(t,!0)},{selector:".name",event:"mouseenter",action:(e,t)=>dr(t,!0)},{selector:".name",event:"mouseleave",action:(e,t)=>dr(t,!1)},{selector:".name",event:"click",action:(e,t)=>{t.scenarioState?.name==="room"?ur(t,!1):Zc(t)}},{selector:".choice-box",event:"click",action:(e,t,o)=>{const i=o.getAttribute("data-mode");i&&se.setPersona(i)}},{selector:"#cv-mode-selector .mode-option",event:"click",action:(e,t,o)=>{const i=o.getAttribute("data-mode");i&&se.setPersona(i)}},{selector:".nav-item",event:"click",action:(e,t,o)=>{const i=o.getAttribute("data-target");if(document.querySelectorAll(".nav-modules .nav-item").forEach(n=>n.classList.remove("active")),o.classList.add("active"),i==="cv-header"&&t.scenarioState?.name==="room"){t.isTransitioning||Fa(t);return}const a=document.getElementById(i),r=document.getElementById("cv-scroller");a&&r&&r.scrollTo({bottom:0,top:a.offsetTop-80,behavior:"smooth"})}},{selector:"#hud-nav-btn-3",event:"click",action:(e,t)=>{const o=document.querySelector('.nav-modules .nav-item[data-target="cv-header"]');o&&(document.querySelectorAll(".nav-modules .nav-item").forEach(i=>i.classList.remove("active")),o.classList.add("active")),t.scenarioState?.name==="room"&&!t.isTransitioning&&(pe(t),Fa(t))}},{selector:"#hud-nav-btn-2",event:"click",action:(e,t)=>{if(t.scenarioState?.name==="points"&&!t.isTransitioning&&(pe(t),t.pointsApp&&typeof t.pointsApp.triggerStep=="function")){t.pointsApp.triggerStep(3);const o=document.querySelector('.nav-modules .nav-item[data-target="LAB"]')||document.querySelector('.nav-modules .nav-item[data-target="cv-header"]');o&&(document.querySelectorAll(".nav-modules .nav-item").forEach(i=>i.classList.remove("active")),o.classList.add("active"))}}},{selector:"#hud-nav-btn-1",event:"click",action:async(e,t)=>{if(t.isTransitioning)return;pe(t),t.HUD&&typeof t.HUD.runTweenClose=="function"&&t.HUD.runTweenClose(1e3),eu("cv-work-header");const o=document.getElementById("board"),i=document.querySelector(".three-js-backdrop");o&&(o.style.transition="opacity 0.4s"),o&&(o.style.opacity="0"),i&&(i.style.transition="opacity 0.4s"),i&&(i.style.opacity="0"),await new Promise(n=>setTimeout(n,1100));const a=document.getElementById("cv-container");a&&a.classList.remove("slow-transition"),Li(t,null,!0),await new Promise(n=>setTimeout(n,400));const r=document.getElementById("work-experience-modal");r&&(r.style.display="flex",t&&(t.raycasterEnabled=!1),qc())}},{selector:"#work-modal-close-btn",event:"click",action:(e,t)=>mr(t)},{selector:"#cv-export-btn, #modal-cv-export-btn",event:"click",action:(e,t)=>{const o=document.createElement("a");o.href="/PFL/cvs/Bui_Quoc_Hieu_CV_Portable.pdf".replace("//","/"),o.download="Bui_Quoc_Hieu_CV_Portable.pdf",document.body.appendChild(o),o.click(),document.body.removeChild(o),t.scenarioState?.name==="room"&&Ni(t)}},{selector:"#work-experience-modal",event:"click",action:(e,t)=>{(e.target.id==="work-experience-modal"||e.target.classList.contains("modal-backdrop"))&&mr(t)}},{selector:"#cv-toggle-btn",event:"click",action:(e,t,o)=>Li(t,o)},{selector:"#cv-toggle-btn",event:"mouseenter",action:(e,t)=>pr(t,!0)},{selector:"#cv-toggle-btn",event:"mouseleave",action:(e,t)=>pr(t,!1)},{selector:".contact-btn-tiny",event:"mouseenter",action:(e,t,o)=>Pa(t,o,!0)},{selector:".contact-btn-tiny",event:"mouseleave",action:(e,t,o)=>Pa(t,o,!1)},{selector:".contact-btn-tiny",event:"click",action:(e,t,o)=>Jc(t,o)}],Ba=(e,t=null)=>{const o=e.getObjectByName("a-char"),i=e.getObjectByName("stool"),a=e.getObjectByName("stool_bound");if(!o||!a)return Promise.resolve();if(o.userData.origPos===void 0&&(o.userData.origPos=o.position.clone()),i&&i.userData.origPos===void 0&&(i.userData.origPos=i.position.clone()),a.rapierBody&&a.userData.origTranslation===void 0){const u=a.rapierBody.translation();a.userData.origTranslation={x:u.x,y:u.y,z:u.z},o.userData.stoolOffset={x:u.x-o.userData.origPos.x,y:u.y-o.userData.origPos.y,z:u.z-o.userData.origPos.z}}const r=1500,n=x.Easing.Cubic.InOut,s=t||o.userData.origPos,c={x:s.x+(o.userData.stoolOffset?.x||0),y:s.y+(o.userData.stoolOffset?.y||0),z:s.z+(o.userData.stoolOffset?.z||0)};return new Promise(u=>{if(new x.Tween(o.position).to({x:s.x,y:s.y,z:s.z},r).easing(n).onComplete(u).start(),i&&new x.Tween(i.position).to({x:c.x,y:c.y,z:c.z},r).easing(n).start(),a.rapierBody){const d=a.rapierBody.translation(),m={x:d.x,y:d.y,z:d.z};new x.Tween(m).to(c,r).easing(n).onUpdate(()=>{a.rapierBody.setNextKinematicTranslation(m)}).start()}})},typeof window<"u"&&(window.triggerRitual=e=>{zt(window.scene,{onImpact:()=>{const t=e||(se.currentMode===Te.DEV?Te.POBA:Te.DEV);se.setPersona(t)}})}),wi=null,Si=null,xi=null,mo=null,ho=null,Qt=null,ko=null,Vs=400}));function Oa(e,t,o){const i=o.get("catBlack"),a=o.get("catWhite"),r=t===Te.POBA?Ie.UI_INFORMER_CAT_MAX_POBA.en:Ie.UI_INFORMER_CAT_MAX_DEV.en,n=t===Te.POBA?Ie.UI_INFORMER_CAT_MIN_POBA.en:Ie.UI_INFORMER_CAT_MIN_DEV.en;i&&(i.userData.assignedRole=r[Math.floor(Math.random()*r.length)]),a&&(a.userData.assignedRole=n[Math.floor(Math.random()*n.length)])}function tu(e){const t=new Map;e.shootDroneBeam=He,e.traverse(n=>{n.name&&t.set(n.name,n),/^book\d+$/.test(n.name)&&Na.push(n)}),e.objectMap=t;const o=qs(e,t,{gravityCenter:new l.Vector3(-.5,3.5,4.9),tgtPos:new l.Vector3(-2,3.09,6.42),tgtQuat:new l.Quaternion(-.09,.48,-.05,.87)});Oa(e,se.currentMode,t),window.addEventListener("personaToggle",n=>{Oa(e,n.detail.mode,t)});const i=t.get("a-char");if(i){const n=1/i.scale.y,s=3.675*n,c=1.6*n,u=new l.Mesh(new l.BoxGeometry(c,s,c),new l.MeshBasicMaterial({color:16711935,transparent:!0,opacity:0,visible:!1}));u.name="hero_hitbox",u.position.set(0,s/2,0),i.add(u),t.set(u.name,u)}const a=[...Object.keys(o),"aegis","aegis2","caseCover","mjolnir_low_mjolnir_hammer_0","Object_34001","screenDisplay001","screenDisplay002","verticalMonitorDisplay","Model_0001","pictureLionFrame"];let r=0;a.forEach(n=>{const s=t.get(n),c=o[n]||{};if(!s)return;r++;const u=c.onMouseEnter?y=>{c.onMouseEnter(y)}:y=>at(e,y),d=y=>{e.gazeFollower&&e.gazeFollower.lookAtTarget(y),u(y)},m=c.onMouseLeave?y=>c.onMouseLeave(y):y=>Me(e,y),f=y=>{e.gazeFollower&&e.gazeFollower.lookAtTarget(e.camera),m(y)},g=c.onMouseDown?(y,S)=>c.onMouseDown(y,S):(y,S)=>_e(e,y,S),w=c.onMouseHover?(y,S)=>c.onMouseHover(y,S):null;So(e,s,{onMouseEnter:d,onMouseLeave:f,onMouseDown:g,onMouseHover:w})}),Na.forEach(n=>{So(e,n,{onMouseEnter:()=>{at(e,n),e.gazeFollower&&e.gazeFollower.lookAtTarget(n),e.raycasterWrapper?.mouseInContainer&&ge(e,Rt,Z("UI_INFORMER_BOOK"))},onMouseLeave:()=>{Me(e),$s(e),e.gazeFollower&&e.gazeFollower.lookAtTarget(e.camera)},onMouseDown:(s,c)=>_e(e,s,c)})}),Ys.forEach(n=>{const s=t.get(n);s&&So(e,s,{onMouseEnter:()=>{},onMouseLeave:()=>{}})}),e.testBH=(n="y")=>{const s=e.getObjectByName("Lathe_Center");if(!s||!["x","y","z"].includes(n))return;const c={};c[n]=s.rotation[n]-Math.PI*6,new x.Tween(s.rotation).to(c,1500).easing(x.Easing.Back.Out).start()}}function Do(e,t,o,i,a,r,n=null){if(e.isSucking||!t||!t.rapierBody)return;let s=Array.isArray(o)?[...o]:[o];e.world.hasPointGravityOnPokeball=!1,ou(e,t,i),iu(e,t,s,a,r)}function ou(e,t,o){let i=t.rapierBody;if(!i)return;e.world.pokeballBody=i,e.world.gravityCenterForPokeball=o;const a=t.position.clone();a.normalize();const r=i.mass()*15,n=a.multiplyScalar(r*-1);n.y=Math.max(8*Math.abs(a.y),8),n.x/=la(1,2),n.y*=la(1,1.5),n.z/=la(1,2),t.rapierBody.applyImpulse({x:n.x,y:n.y,z:n.z},!0)}function iu(e,t,o,i,a){e.isSucking=!0;const r=ac("#FBC189",1.5,1);let n=o.length;o.forEach(s=>{if(s.ignoreRaycast=!0,s.traverse(w=>{w.ignoreRaycast=!0,w.userData&&(w.userData.isRaycastTarget=!1)}),e.raycastObjects&&(e.raycastObjects=e.raycastObjects.filter(w=>{let y=w===s;return y||s.traverse(S=>{S===w&&(y=!0)}),y||w.traverse(S=>{S===s&&(y=!0)}),!y})),e.raycasterWrapper?.currentObjectTarget){const w=e.raycasterWrapper.currentObjectTarget;let y=w===s;y||s.traverse(S=>{S===w&&(y=!0)}),y&&pe(e)}let c=new l.Vector3,u=new l.Quaternion,d={value:0};const m=1e3,f=new x.Tween(r.uniforms.uprogress).to({value:2},1500).easing(x.Easing.Bounce.Out).onComplete(()=>{if(e.world.hasPointGravityOnPokeball=!1,t.rapierBody){t.rapierBody.setBodyType(0);let w=new l.Vector3(0,-4,0);t.rapierBody.applyImpulse({x:w.x,y:w.y,z:w.z},!0)}s.traverse(w=>{if(w.rapierBody){const y=w.rapierBody;w.isRapierBound=!1,y.isObjectBound=!1;try{e.world.removeRigidBody(y)}catch(S){console.warn("[Catch] RigidBody removal failed for "+w.name,S)}e.physicBodies&&(e.physicBodies=e.physicBodies.filter(S=>S!==y)),e.skinnedMeshBodies&&(e.skinnedMeshBodies=e.skinnedMeshBodies.filter(S=>S!==y)),e.objectControlledBodies&&(e.objectControlledBodies=e.objectControlledBodies.filter(S=>S!==y)),e.physicsControlledObjects&&(e.physicsControlledObjects=e.physicsControlledObjects.filter(S=>S!==w)),e.physicObjects&&(e.physicObjects=e.physicObjects.filter(S=>S!==w)),w.rapierBody=null}}),e.physicsControlledObjects&&(e.physicsControlledObjects=e.physicsControlledObjects.filter(w=>w!==s)),e.physicObjects&&(e.physicObjects=e.physicObjects.filter(w=>w!==s)),e.remove(s),(s.name==="catBlack"||s.name==="blackCat")&&(e.isMaxMissing=!0),(s.name==="catWhite"||s.name==="Object_108")&&(e.isMinMissing=!0),s.visible=!1,n--,n<=0&&(e.isSucking=!1)}),g=new x.Tween(d).to({value:1},m).easing(x.Easing.Back.InOut).onStart(()=>{t.rapierBody&&t.rapierBody.setBodyType(1),c.copy(t.position),u.copy(t.rotation),typeof e.shootDroneBeam=="function"&&e.shootDroneBeam(e,"","",c.clone(),"drone-beam",!1,null,!0,1/0,!0)}).onUpdate(()=>{const w=new l.Vector3().lerpVectors(c,i,d.value);t.rapierBody&&t.rapierBody.setTranslation({x:w.x,y:w.y,z:w.z},!1);const y=e.getObjectByName("drone-beam"),S=e.getObjectByName("drone");if(y&&y.visible&&S){const M=S.getObjectByName("Sphere001_0");if(M){const O=new l.Vector3;M.getWorldPosition(O);const _=O.distanceTo(w);y.position.copy(O),y.lookAt(w),y.children.forEach(v=>{v.scale.z=_}),e.gazeFollower&&e.gazeFollower.lookAtTarget(t)}}const T=u.clone().slerp(a,d.value);t.rapierBody&&t.rapierBody.setRotation({x:T.x,y:T.y,z:T.z,w:T.w},!1)}).onComplete(()=>{const w=e.getObjectByName("drone-beam");w&&(w.visible=!1,w.activeRequestID&&cancelAnimationFrame(w.activeRequestID)),r.uniforms.catchPoint.value.copy(i),s.traverse(y=>{y.isMesh&&(y.material=r,y.userData.originalMaterial=r)})}).chain(f);setTimeout(()=>{e.world.hasPointGravityOnPokeball=!0},1e3),setTimeout(()=>{g.start()},3e3)})}function Da(e,t={}){const{forcedX:o=null,environmentRatio:i=null,duration:a=1e3,delay:r=0}=t,n=e.getObjectByName("glassInvi");if(!n)return;const s=5.4,c=.75;let u=n.rapierBody;const d=u.translation(),m=d.x;let f;o!==null?f=o<.5?1:-1:f=n.slideDirection?n.slideDirection*-1:1;const g=(A,F,G)=>A+(F-A)*G;let w;o!==null?w=o:w=f===1?0:1;let y=o!==null?g(s,c,w):f===1?s:c;const S=i!==null?i:w;let T=e?e.environmentIntensity??1:1,M=g(1,0,S);const O=(A,F,G,V,h=null)=>({name:A,properties:[{prop:F,closedVal:G,openVal:V,axis:h}]}),_=[{name:"floor",properties:[{prop:"envMapRotation",axis:"x",closedVal:1.91,openVal:2.07},{prop:"envMapIntensity",closedVal:.15,openVal:1}]},O("Object_0003_3","envMapIntensity",.3,1),O("Object_0003","envMapIntensity",.2,.75),O("Object_32","envMapIntensity",.5,2.5),{name:"mjolnir_low_mjolnir_hammer_0",properties:[{prop:"envMapIntensity",closedVal:1,openVal:5},{prop:"metalness",closedVal:.6,openVal:1},{prop:"roughness",closedVal:.2,openVal:1}]},O("aegis","envMapIntensity",1,5),O("Object_34001","envMapIntensity",5,10),O("Object_0003","envMapIntensity",.5,3),O("shelf","envMapIntensity",.5,1.65),O("Object_15","envMapIntensity",3,20),O("Object_15001","envMapIntensity",.5,2),O("Object_31","envMapIntensity",1,5),O("Object_0007","envMapIntensity",.1,.8),O("Object_108","envMapIntensity",.6,1.2)];for(let A=1;A<=38;A++){const F="book"+String(A).padStart(3,"0");_.push(O(F,"envMapIntensity",.5,20))}const v=new Map;_.forEach(A=>{const F=e.getObjectByName(A.name);F&&F.material&&A.properties.forEach(G=>{const V=`${A.name}-${G.prop}`;let h=0;G.prop==="envMapRotation"?F.material.envMapRotation&&G.axis==="x"&&(h=F.material.envMapRotation.x):h=F.material[G.prop],v.set(V,h)})});let P={value:0};new x.Tween(P).to({value:1},a).easing(x.Easing.Back.InOut).delay(r).onUpdate(()=>{u.setNextKinematicTranslation({x:m+(y-m)*P.value,y:d.y,z:d.z}),e&&(e.environmentIntensity=g(T,M,P.value),_.forEach(A=>{const F=e.getObjectByName(A.name);if(!F||!F.material)return;const G=F.material;A.properties.forEach(V=>{const h=`${A.name}-${V.prop}`,b=g(v.get(h)??0,g(V.closedVal!==void 0?V.closedVal:0,V.openVal!==void 0?V.openVal:0,S),P.value);V.prop==="envMapRotation"?G.envMapRotation&&V.axis==="x"&&(G.envMapRotation.x=b):G[V.prop]=b})}))}).onComplete(()=>{n.slideDirection=f;const A=e.globalUniformsHub;if(A&&A.uniforms&&A.uniforms.uWaterIntensity){const F=f===-1?2:.1;new x.Tween(A.uniforms.uWaterIntensity).to({value:F},3e3).easing(x.Easing.Cubic.InOut).start()}}).start()}function sa(e,t=!0){e.world.hasPointGravityOnBH=t,t&&(e.world.hasPointGravityOnBalls=!1),e.physicBodies.forEach(o=>{o.wakeUp()}),e.allowsResetting=!t}function la(e,t){return Math.random()*(t-e)+e}function au(e,t){if(Uo)return;Uo=!0;const o=e.bulb;if(!o||!o.geometry||!o.geometry.isMorphGeo){ca(e,null,1e3),cr(e,t),Uo=!1;return}const i=o.geometry,a=o.material,r=o.getObjectByName("bulbAura"),n=r?r.material:null,s=a.uniforms.uTransformProgress,c=n?n.uniforms.uTransformProgress:null,u={value:0};a.uniforms.uTransformProgress=u,n&&(n.uniforms.uTransformProgress=u),i.setMorphInfo(0,2);const d=new l.Color("#ffe0b2"),m=new l.Color("#9cc1f2");let f="#"+m.getHexString();if(e.bulbLight){const g=e.bulbLight.color;f=Math.abs(g.r-d.r)+Math.abs(g.g-d.g)+Math.abs(g.b-d.b)<.5?"#"+m.getHexString():"#"+d.getHexString()}a.visible=!0,r&&(r.visible=!0),ca(e,"#ffe0b2",400),new x.Tween(u).to({value:1},600).easing(x.Easing.Cubic.Out).onComplete(()=>{cr(e,t),setTimeout(()=>{new x.Tween(u).to({value:0},800).easing(x.Easing.Cubic.In).onComplete(()=>{if(a.visible=!0,r&&(r.visible=!0),i.setMorphInfo(0,1),a.uniforms.uTransformProgress=s,n&&c&&(n.uniforms.uTransformProgress=c),e.bulbLight){const g=e.bulbLight.color;a.uniforms.glowColor.value.setRGB(g.r,g.g,g.b)}ca(e,f,600),Uo=!1}).start()},300)}).start()}function ki(e,t,o,i=1e3,a={}){const{easing:r=x.Easing.Cubic.Out,onComplete:n=null,delay:s=0}=a,c=e.bulbLight;if(!c)return;c._activeParamTween&&(c._activeParamTween.stop(),c._activeParamTween=null);const u=c.intensity,d=c.angle,m={t:0};return c._activeParamTween=new x.Tween(m).to({t:1},i).delay(s).easing(r).onUpdate(()=>{c.intensity=l.MathUtils.lerp(u,t,m.t),c.angle=l.MathUtils.lerp(d,o,m.t)}).onComplete(()=>{c._activeParamTween=null,n&&n()}).start(),c._activeParamTween}function ca(e,t=null,o=3e3){const i=new l.Color("#ffe0b2"),a=new l.Color("#9cc1f2");let r;if(t)r=new l.Color(t);else if(e.bulbLight){const n=e.bulbLight.color;r=Math.abs(n.r-i.r)+Math.abs(n.g-i.g)+Math.abs(n.b-i.b)<.5?a:i}else r=a;if(e.bulbLight&&new x.Tween(e.bulbLight.color).to({r:r.r,g:r.g,b:r.b},o).easing(x.Easing.Cubic.Out).start(),e.bulb&&e.bulb.material&&e.bulb.material.uniforms.glowColor){new x.Tween(e.bulb.material.uniforms.glowColor.value).to({r:r.r,g:r.g,b:r.b},o).easing(x.Easing.Cubic.Out).start();const n=e.bulb.getObjectByName("bulbAura");n&&n.material&&n.material.uniforms.glowColor&&new x.Tween(n.material.uniforms.glowColor.value).to({r:r.r,g:r.g,b:r.b},o).easing(x.Easing.Cubic.Out).start()}Be&&Be.uniforms&&(Be.uniforms.glowColor&&new x.Tween(Be.uniforms.glowColor.value).to({r:r.r,g:r.g,b:r.b},o).easing(x.Easing.Cubic.Out).start(),Be.uniforms.glowIntensity&&new x.Tween(Be.uniforms.glowIntensity).to({value:1},o).easing(x.Easing.Cubic.Out).start()),kt&&kt.uniforms&&(kt.uniforms.glowColor&&new x.Tween(kt.uniforms.glowColor.value).to({r:r.r,g:r.g,b:r.b},o).easing(x.Easing.Cubic.Out).start(),kt.uniforms.outerGlowStrength&&new x.Tween(kt.uniforms.outerGlowStrength).to({value:1.5},o).easing(x.Easing.Cubic.Out).start())}function ua(e,t){if(Ti||!t)return;Ti=!0;const o=e.bulbLight;o&&e._bulbBaseline===void 0&&(e._bulbBaseline={intensity:o.intensity,angle:o.angle});const i=o?o.color.clone():de.ELECTRIC_CYAN||62463,a=e.getObjectByName("cFanBulb")||t,r=new l.Vector3;a.getWorldPosition(r);const n=-.55,s=new l.IcosahedronGeometry(.3,1),c=no(i);c.uniforms.uOpacity.value=.5,c.uniforms.uBrightness.value=3.5;const u=new l.Mesh(s,c);u.position.copy(r),e.add(u),new x.Tween(u.scale).to({x:3.5,y:3.5,z:3.5},800).easing(x.Easing.Quintic.Out).start();const d=performance.now(),m=y=>{u.parent&&(c.uniforms.iTime.value=(y-d)/1e3,u.rotation.y+=.05,u.rotation.z+=.03,requestAnimationFrame(m))};requestAnimationFrame(m),e.fanAction&&new x.Tween(e.fanAction).to({timeScale:65},800).easing(x.Easing.Exponential.In).start(),re("SYNCHRONIZING KINETIC VECTORS...");const f=800,g=800;o&&e._bulbBaseline&&ki(e,1e4,.3,f,{easing:x.Easing.Exponential.In,onComplete:()=>{ki(e,e._bulbBaseline.intensity,e._bulbBaseline.angle,400,{delay:g,easing:x.Easing.Cubic.Out})}});const w=f+g+600;setTimeout(()=>{Ti=!1},w),setTimeout(()=>{e.remove(u),s.dispose(),c.dispose();const y=Math.abs(r.y-n),S=new l.CylinderGeometry(1.5,1.5,y,32,1,!0);S.translate(0,-y/2,0);const T=no(i);T.uniforms.uOpacity.value=.9,T.uniforms.uBrightness.value=5;const M=new l.Mesh(S,T);M.position.copy(r),e.add(M),M.scale.set(.1,1,.1),new x.Tween(M.scale).to({x:2.2,z:2.2},150).easing(x.Easing.Exponential.Out).onComplete(()=>{new x.Tween(T.uniforms.uOpacity).to({value:0},500).delay(300).start(),setTimeout(()=>{e.remove(M),S.dispose(),T.dispose()},800)}).start();const O=performance.now(),_=P=>{M.parent&&(T.uniforms.iTime.value=(P-O)/1e3,M.rotation.y+=.02,requestAnimationFrame(_))};requestAnimationFrame(_);const v=[];e.bhTargets&&v.push(...e.bhTargets),e.dragonBalls&&v.push(...e.dragonBalls),[...new Set(v)].forEach(P=>{if(!P||!P.rapierBody)return;const A=P.rapierBody,F=new l.Vector3;P.getWorldPosition(F);const G=new l.Vector3(r.x,F.y,r.z),V=new l.Vector3().subVectors(F,G),h=V.length();V.normalize(),V.y=1.35,V.normalize();const b=A.mass(),p=500*b/(Math.max(1,h)+.15);A.applyImpulse({x:V.x*p,y:V.y*p*1.6,z:V.z*p},!0);const R=150*b;A.applyTorqueImpulse({x:(Math.random()-.5)*R,y:(Math.random()-.5)*R,z:(Math.random()-.5)*R},!0)}),re("KINETIC DISCHARGE: STABLE"),typeof st=="function"&&st(e,!0),setTimeout(()=>{typeof st=="function"&&st(e,!1),e.fanAction&&new x.Tween(e.fanAction).to({timeScale:1},4e3).easing(x.Easing.Cubic.Out).start()},150)},800)}function Ws(e){const t=e.getObjectByName("Lathe_Center");return t?(t.makeEye||(t.userData.initValues={rotation:t.rotation.clone(),scale:t.scale.clone(),nebulaCoreRadius:10,nebulaSwirlSpeed:.25},t.material&&t.material.uniforms&&t.material.uniforms.nebulaCoreRadius&&(t.userData.initValues.nebulaCoreRadius=t.material.uniforms.nebulaCoreRadius.value),e.globalUniformsHub&&e.globalUniformsHub.uNebulaSwirlSpeed&&(t.userData.initValues.nebulaSwirlSpeed=e.globalUniformsHub.uNebulaSwirlSpeed.value),t.makeEye=function(o){this.userData.eyeTweens&&this.userData.eyeTweens.forEach(r=>r.stop()),this.userData.eyeTweens=[];const i=new x.Tween(this.rotation).to({y:-.3},o).easing(x.Easing.Cubic.Out).start(),a=new x.Tween(this.scale).to({x:.675,y:1.5,z:.875},o).easing(x.Easing.Cubic.Out).start();if(this.userData.eyeTweens.push(i,a),this.material&&this.material.uniforms&&this.material.uniforms.nebulaCoreRadius){const r=new x.Tween(this.material.uniforms.nebulaCoreRadius).to({value:15},o).easing(x.Easing.Cubic.Out).start();this.userData.eyeTweens.push(r)}if(e.globalUniformsHub&&e.globalUniformsHub.uNebulaSwirlSpeed){const r=new x.Tween(e.globalUniformsHub.uNebulaSwirlSpeed).to({value:2},o).easing(x.Easing.Cubic.Out).start();this.userData.eyeTweens.push(r)}},t.stopEye=function(o){this.userData.eyeTweens&&this.userData.eyeTweens.forEach(n=>n.stop()),this.userData.eyeTweens=[];const i=this.userData.initValues,a=new x.Tween(this.rotation).to({x:i.rotation.x,y:i.rotation.y,z:i.rotation.z},o).easing(x.Easing.Cubic.Out).start(),r=new x.Tween(this.scale).to({x:i.scale.x,y:i.scale.y,z:i.scale.z},o).easing(x.Easing.Cubic.Out).start();if(this.userData.eyeTweens.push(a,r),this.material&&this.material.uniforms&&this.material.uniforms.nebulaCoreRadius){const n=new x.Tween(this.material.uniforms.nebulaCoreRadius).to({value:i.nebulaCoreRadius},o).easing(x.Easing.Cubic.Out).start();this.userData.eyeTweens.push(n)}if(e.globalUniformsHub&&e.globalUniformsHub.uNebulaSwirlSpeed){const n=new x.Tween(e.globalUniformsHub.uNebulaSwirlSpeed).to({value:i.nebulaSwirlSpeed},o).easing(x.Easing.Cubic.Out).start();this.userData.eyeTweens.push(n)}}),t):null}function Ro(e,t=3e3){let o=Re(e,"wallArea");if(!o||!o.material)return;const i=o.material.uniforms,a=Ws(e);o.userData.eyeTween&&(o.userData.eyeTween.stop(),o.userData.eyeTween=null),o.userData.latheEyeTweenObj&&(o.userData.latheEyeTweenObj.stop(),o.userData.latheEyeTweenObj=null),i&&i.uEyeActive&&(i.uEyeActive.value=!0),i&&i.uEyeOpenness&&(o.userData.eyeTween=new x.Tween(i.uEyeOpenness).to({value:1},t).easing(x.Easing.Cubic.Out).onStart(()=>{o.material.visible=!0}).start(),a&&a.makeEye(t))}function Mo(e,t=3e3){let o=Re(e,"wallArea");if(!o||!o.material)return;const i=o.material.uniforms,a=Ws(e);o.userData.eyeTween&&(o.userData.eyeTween.stop(),o.userData.eyeTween=null),o.userData.latheEyeTweenObj&&(o.userData.latheEyeTweenObj.stop(),o.userData.latheEyeTweenObj=null),i&&i.uEyeOpenness&&(o.userData.eyeTween=new x.Tween(i.uEyeOpenness).to({value:0},t).easing(x.Easing.Cubic.Out).onComplete(()=>{o.material.visible=!1,i&&i.uEyeActive&&(i.uEyeActive.value=!1)}).start(),a&&a.stopEye(t))}function hr(e){if(e.isHeroAnimating)return;const t=e.getObjectByName("a-char"),o=e.getObjectByName("stool_bound");if(!t||!o)return;const i=t.position.clone(),a=new l.Vector3,r=new l.Quaternion;o.getWorldPosition(a),o.getWorldQuaternion(r);const n=-9.81,s=9,c=27,u=Ie.SYS_SPELL_CHANNELING.en,d=Ie.SYS_SPELL_CAST.en,m=u[Math.floor(Math.random()*u.length)],f=d[Math.floor(Math.random()*d.length)],g=rt(e,"castSpell",{autoReturn:!0,speed:.75,onComplete:()=>{e.world&&(e.world.gravity={x:0,y:n,z:0},console.log(`[Spell Ritual] Animation complete. Gravity restored to ${n}.`)),window._cvGravity=.6,window._cvState==="ritual"&&(window._cvState="falling"),e.cursorInformerProgressBar&&(e.cursorInformerProgressBar.style.height="0%"),e.cursorInformerBox&&(e.cursorInformerBox.style.backgroundColor="");const O=1200;if(new x.Tween(t.position).to({x:i.x,y:i.y,z:i.z},O).easing(x.Easing.Cubic.InOut).onComplete(()=>{rt(e,"typing",{crossFadeDuration:.5})}).start(),o.rapierBody){const _=o.rapierBody,v=_.translation(),P=_.rotation(),A={t:0};new x.Tween(A).to({t:1},O).easing(x.Easing.Cubic.Out).onUpdate(()=>{const F=new l.Vector3().lerpVectors(v,a,A.t),G=new l.Quaternion().copy(P).slerp(r,A.t);_.setTranslation(F,!0),_.setRotation(G,!0);const V=F.clone();o.parent&&o.parent.worldToLocal(V),o.position.copy(V)}).onComplete(()=>{_.setBodyType(fe.RigidBodyType.Fixed),e.isHeroAnimating=!1}).start()}else e.isHeroAnimating=!1;setTimeout(()=>{e.allowsResetting=!0,console.log("[Spell Ritual] Ritual fully finalized.")},3e3)}});if(!g)return;e.allowsResetting=!1,e.isHeroAnimating=!0;const w=g.action,y=w.getClip(),S=800;if(new x.Tween(t.position).to({x:1},S).easing(x.Easing.Cubic.Out).start(),o.rapierBody){o.rapierBody.setBodyType(fe.RigidBodyType.KinematicPositionBased);const O=o.rapierBody.translation();new x.Tween(O).to({x:O.x+.5},S).easing(x.Easing.Cubic.Out).onUpdate(()=>{o.rapierBody.setNextKinematicTranslation(O)}).start()}const T=y.duration*.5/.75*1e3;e.world&&(e.world.gravity={x:0,y:0,z:0}),e.physicBodies&&e.physicBodies.forEach(O=>O.wakeUp()),window._cvState="ritual",window._cvGravity=0,typeof Gt=="function"&&Gt(),typeof Ia=="function"&&Ia(T);const M={value:0};new x.Tween(M).to({value:100},T).easing(x.Easing.Quadratic.In).onUpdate(()=>{const O=M.value/100*s;e.world&&(e.world.gravity={x:0,y:O,z:0});const _=-(M.value/100)*1.5;window._cvGravity=_,e.cursorInformerProgressBar&&(e.cursorInformerProgressBar.style.height=`${M.value}%`),e.cursorInformerText&&(e.cursorInformerText.textContent=`${m}... ${Math.floor(M.value)}%`),M.value>=100&&e.cursorInformerBox&&(e.cursorInformerBox.style.backgroundColor="var(--c-cyan)")}).onComplete(()=>{e.world&&(e.world.gravity={x:0,y:c,z:0}),window._cvGravity=-6,e.cursorInformerText&&(e.cursorInformerText.textContent=""),e.conversationManager&&e.conversationManager.shout(f,3e3),w.timeScale=1,console.log(`[Spell Ritual] Peak reached: ${f}. Elements pinned to ceiling.`)}).start()}function nu(e,t){if(bi||!t)return;bi=!0,t.visible=!1;const o=t.position.clone(),i=o.y+3.5,a=t.rapierBody?t.rapierBody:null;a&&a.setBodyType(1);const r=new l.Group;r.position.copy(o),r.rotation.copy(t.rotation),e.add(r);const n=new l.IcosahedronGeometry(.35,1),s=new l.MeshStandardMaterial({color:"#00F3FF",emissive:"#00F3FF",emissiveIntensity:15,transparent:!0,opacity:0,wireframe:!0}),c=new l.Mesh(n,s);r.add(c);const u=[];[{pos:[0,0,.5],rot:[0,0,0],dir:[0,0,1]},{pos:[0,0,-.5],rot:[0,Math.PI,0],dir:[0,0,-1]},{pos:[0,.5,0],rot:[-Math.PI/2,0,0],dir:[0,1,0]},{pos:[0,-.5,0],rot:[Math.PI/2,0,0],dir:[0,-1,0]},{pos:[-.5,0,0],rot:[0,-Math.PI/2,0],dir:[-1,0,0]},{pos:[.5,0,0],rot:[0,Math.PI/2,0],dir:[1,0,0]}].forEach(m=>{const f=no("#00F3FF",0),g=new l.Mesh(new l.PlaneGeometry(.98,.98),f);g.position.set(...m.pos),g.rotation.set(...m.rot),g.userData.dir=new l.Vector3(...m.dir),r.add(g),u.push(g)}),typeof Ro=="function"&&(Ro(e,800),re("SECTOR_7_BREACH: SYNCHRONIZING_CORE"));const d={y:o.y,opacity:0};new x.Tween(d).to({y:i,opacity:1},450).easing(x.Easing.Back.Out).onUpdate(()=>{r.position.y=d.y,r.rotation.y+=.08,u.forEach(m=>{m.material.uniforms?.uOpacity?m.material.uniforms.uOpacity.value=d.opacity:m.material.opacity=d.opacity}),a&&a.setTranslation({x:r.position.x,y:r.position.y,z:r.position.z},!0)}).onComplete(()=>{setTimeout(()=>{const m={unfold:0,corePulse:.1};s.opacity=1,c.scale.setScalar(.1),new x.Tween(m).to({unfold:2.2,corePulse:1.6},1e3).easing(x.Easing.Elastic.Out).onUpdate(()=>{u.forEach(f=>{const g=m.unfold,w=f.userData.dir.clone().multiplyScalar(.5+g);f.position.copy(w),f.material.uniforms?.uOpacity&&(f.material.uniforms.uOpacity.value=.7+Math.random()*.3)}),c.scale.setScalar(m.corePulse+Math.sin(performance.now()*.015)*.15),c.rotation.y+=.07,c.rotation.z+=.04,r.rotation.y+=.01}).onComplete(()=>{re("CORE_DECRYPTED: REWARD_STREAM_ACTIVE");const f=Math.floor(Math.random()*5)+6;for(let g=0;g<f;g++){const w={x:(Math.random()-.5)*15,y:12+Math.random()*8,z:(Math.random()-.5)*15};oi(e,r.position.clone().add(new l.Vector3(0,.5,0)),w)}new x.Tween(m).to({unfold:0,corePulse:.1},600).easing(x.Easing.Back.In).delay(1200).onUpdate(()=>{u.forEach(g=>{g.position.copy(g.userData.dir.clone().multiplyScalar(.5+m.unfold)),g.material.uniforms?.uOpacity&&(g.material.uniforms.uOpacity.value=.5+m.unfold*.5)}),c.scale.setScalar(Math.max(.01,m.corePulse)),s.opacity=Math.max(0,m.corePulse),r.rotation.z+=.05}).onComplete(()=>{e.remove(r),t.visible=!0,t.position.copy(r.position),t.rotation.copy(r.rotation),a&&(a.setTranslation({x:r.position.x,y:r.position.y,z:r.position.z},!0),a.setRotation({x:t.quaternion.x,y:t.quaternion.y,z:t.quaternion.z,w:t.quaternion.w},!0),a.setBodyType(0),a.applyImpulse({x:0,y:-2,z:0},!0)),bi=!1,re("SYSTEM_STABLE: CORE_REINTEGRATED"),typeof Mo=="function"&&Mo(e,1e3)}).start()}).start()},250)}).start()}var Ys,Na,at,Me,_e,qs,$s,Uo,Ti,bi,$i=J((()=>{Qo(),so(),ct(),hs(),Zo(),pt(),ii(),ti(),An(),Ao(),_n(),ut(),lt(),co(),et(),Xa(),Dn(),Fn(),Ys=["floor","backWall_rapier","rightWall"],Na=[],at=(e,t)=>{document.body.style.cursor="pointer",hn(e,t),e.gazeFollower&&e.gazeFollower.lookAtTarget(t)},Me=e=>{document.body.style.cursor="auto",vo(e),e.gazeFollower&&e.gazeFollower.lookAtTarget(e.camera)},_e=(e,t,o,i=null)=>{i=i||Math.random()*1+2.5,Vi(e,t,o,i)},qs=(e,t,o)=>{const i=t.get("pokeball"),a=t.get("pokeball2"),r=t.get("pokeball3"),n=t.get("catBlack"),s=t.get("blackCat"),c=t.get("catWhite");t.get("Object_108"),t.get("drone");let u=null,d=0,m=[],f=!1,g=null,w=null,y=null,S=null,T=null;const M=(p,R,C)=>{if(console.log("[Dragon Fortune] Triggered Blessing ritual."),f){re(Z("SYS_STORY_VOID_EXHAUSTED"));return}f=!0,re(Z("SYS_STORY_VOID_RAIN")),Pn(p);const N=p.globalUniformsHub;let q=1;N&&N.uStormSharpness&&(q=N.uStormSharpness.value,new x.Tween(N.uStormSharpness).to({value:0},1500).easing(x.Easing.Cubic.Out).start());const $=p.bulbLight;$&&(p._bulbBaseline===void 0&&(p._bulbBaseline={intensity:$.intensity,angle:$.angle}),ki(p,p._bulbBaseline.intensity*.04,p._bulbBaseline.angle,1500));const L=p.getObjectByName("a-char"),B=new l.Vector3;L?L.getWorldPosition(B):B.set(0,1,0),B.y+=.8;for(let z=0;z<54;z++){const U=C&&C.point?C.point.clone():R.position.clone();U.add(new l.Vector3((Math.random()-.5)*.3,(Math.random()-.5)*.3,(Math.random()-.5)*.3));const E=new l.Vector3().subVectors(B,U).normalize();E.x+=(Math.random()-.5)*.15,E.z+=(Math.random()-.5)*.15,E.normalize();const k=28+Math.random()*12,I=E.multiplyScalar(k);I.y=Math.max(I.y,0)+(15+Math.random()*8),setTimeout(()=>{requestAnimationFrame(()=>{oi(p,U,I,z<53),z===53&&(N&&N.uStormSharpness&&new x.Tween(N.uStormSharpness).to({value:q},2e3).easing(x.Easing.Cubic.InOut).start(),$&&p._bulbBaseline&&ki(p,p._bulbBaseline.intensity,p._bulbBaseline.angle,2e3,{easing:x.Easing.Cubic.InOut}),setTimeout(()=>{f=!1},1e3))})},z*60)}},O=()=>{u&&cancelAnimationFrame(u),d=performance.now();const p=3e3;let R=0;const C={value:0};y=new x.Tween(C).to({value:100},p).onUpdate(()=>{e.cursorInformerProgressBar&&(e.cursorInformerProgressBar.style.height=`${C.value}%`),C.value>=100&&e.cursorInformerBox&&(e.cursorInformerBox.style.backgroundColor="var(--c-cyan)")}).onComplete(()=>{y=null}).start();const N=q=>{const $=q-d,L=Math.min($/p,1),B=Math.max(0,3-Math.floor($/1e3));if(B>0){const U=$%1e3/1e3;let E=".";U>.33&&(E=".."),U>.66&&(E="..."),e.cursorInformerText&&(e.cursorInformerText.textContent=`Gravity Well in ${B}${E} `)}else if(L>=1){e.cursorInformerText&&(e.cursorInformerText.textContent="Nom Nom Nom"),sa(e,!0);const U=e.raycasterWrapper?e.raycasterWrapper.pointer.y:0;typeof vi=="function"&&vi(-U),u=null;return}const z=1+L*L*20;R+=z,e.cursorInformerIcon&&(e.cursorInformerIcon.style.transform=`rotate(${R}deg)`),u=requestAnimationFrame(N)};u=requestAnimationFrame(N)},_=()=>{u&&(cancelAnimationFrame(u),u=null),y&&(y.stop(),y=null),e.cursorInformerProgressBar&&(e.cursorInformerProgressBar.style.height="0%"),e.cursorInformerBox&&(e.cursorInformerBox.style.backgroundColor="")},v=()=>{e.cursorInformerIcon&&(e.cursorInformerIcon.style.transform="rotate(0deg)")};let P=0;const A=()=>{const p=performance.now();p-P<500||(P=p,_(),e.cursorInformerText&&(e.cursorInformerText.textContent="Gravity Well ACTIVE"),Nc(e,5e3,"pc"),sa(e,!0),vi(-(e.raycasterWrapper?e.raycasterWrapper.pointer.y:0)))},F=()=>{e.pokeballGridUniforms&&(e.pokeballGridUniforms.uWorldGridActive.value=1,e.pokeballGridUniforms.uWorldGridProgress.value=0,new x.Tween(e.pokeballGridUniforms.uWorldGridProgress).to({value:1},600).easing(x.Easing.Quadratic.Out).onComplete(()=>{setTimeout(()=>{new x.Tween(e.pokeballGridUniforms.uWorldGridProgress).to({value:0},500).onComplete(()=>{e.pokeballGridUniforms.uWorldGridActive.value=0}).start()},500)}).start())},G=p=>{const R=Re(p,"a-char");if(!R||p.isHeroAnimating)return;p.isHeroAnimating=!0,p.allowsResetting=!1;const C=Re(p,"stool_bound");R.userData.originalPosX===void 0&&(R.userData.originalPosX=R.position.x);let N=C?.rapierBody,q=C?.userData.originalTranslation;if(N&&!q){const $=N.translation();C.userData.originalTranslation={x:$.x,y:$.y,z:$.z},q=C.userData.originalTranslation}if(N&&q){const $={x:q.x};new x.Tween($).to({x:.52},200).easing(x.Easing.Quadratic.Out).onUpdate(()=>N.setNextKinematicTranslation({x:$.x,y:q.y,z:q.z})).start()}new x.Tween(R.position).to({x:.4},200).easing(x.Easing.Quadratic.Out).onComplete(()=>{rt(p,"sitToStand",{autoReturn:!1,onComplete:()=>{if(new x.Tween(R.position).to({x:R.userData.originalPosX},300).easing(x.Easing.Quadratic.InOut).onComplete(()=>{p.isHeroAnimating=!1,p.allowsResetting=!0}).start(),N&&q){const B={x:.52};new x.Tween(B).to({x:q.x},300).easing(x.Easing.Quadratic.InOut).onUpdate(()=>N.setNextKinematicTranslation({x:B.x,y:q.y,z:q.z})).start()}rt(p,"typing",{crossFadeDuration:.2})}});const $=se.currentMode===Te.POBA?Ie.SHOUT_STRETCH_LEG_POBA.en:Ie.SHOUT_STRETCH_LEG_DEV.en;p.conversationManager?.shout($[Math.floor(Math.random()*$.length)])}).start()},V=(p,R)=>{const C=Re(p,"a-char"),N=p.isHeroAnimating||p.allowsResetting===!1;if(T&&(clearTimeout(T),T=null),p.heroMenuInterval&&(clearInterval(p.heroMenuInterval),p.heroMenuInterval=null),R&&!N){const q=[{label:"DANCE",icon:Rt,action:()=>Ni(p)},{label:"STRETCH",icon:Vo,action:()=>G(p)},{label:"GOLF",icon:Rt,action:()=>zt(p)},{label:"SPELL",icon:zo,action:()=>hr(p)}];p.heroMenuIndex===void 0&&(p.heroMenuIndex=0);const $=()=>{const B=q[p.heroMenuIndex],z="background: var(--c-cyan); color: var(--c-black); padding: 2px 8px; font-weight: 800; border-radius: 2px; text-shadow: none; box-shadow: 0 0 10px var(--c-cyan);",U="opacity: 0.6; padding: 2px 8px;";let E=q.map((k,I)=>`<span style="${I===p.heroMenuIndex?z:U}">${k.label}</span>`).join(" ");ge(p,B.icon,`<div style="display: flex; gap: 4px; align-items: center; font-family: 'Rajdhani', sans-serif; font-size: 13px; letter-spacing: 1px;">${E}</div>`)};$(),p.heroMenuInterval=setInterval(()=>{p.heroMenuIndex=(p.heroMenuIndex+1)%q.length,$()},800);const L=t.get("hero_hitbox");if(p.raycastObjects&&m.length===0&&L&&(m=[...p.raycastObjects],p.raycastObjects=[L],p.world&&(p._originalBallGravity=p.world.hasPointGravityOnBalls,p.world.hasPointGravityOnBalls=!1)),p.conversationManager&&!p._hasShoutedHeroMenu){const B=Ie.UI_HERO_MENU_ENCOURAGEMENT.en,z=B[Math.floor(Math.random()*B.length)];p.conversationManager.shout(z,1e4,{small:!0}),p._hasShoutedHeroMenu=!0}}else{if(C){const q=Re(p,"Ch23_Suit");q?.material&&q.userData.originalToneMapped!==void 0&&(q.material.toneMapped=q.userData.originalToneMapped)}p.conversationManager&&p.conversationManager.hide(),p._hasShoutedHeroMenu=!1,pe(p),m.length>0&&(p.raycastObjects=[...m],m=[],p.world&&p._originalBallGravity!==void 0&&(p.world.hasPointGravityOnBalls=p._originalBallGravity,delete p._originalBallGravity))}},h=(p,R,C,N=!0)=>{if(R)if(p.monitorMenuInterval&&(clearInterval(p.monitorMenuInterval),p.monitorMenuInterval=null),N&&C){R.userData.menuIndex===void 0&&(R.userData.menuIndex=0);const q=()=>{C[R.userData.menuIndex];const $="background: var(--c-cyan); color: var(--c-black); padding: 2px 8px; font-weight: 800; border-radius: 2px; text-shadow: none; box-shadow: 0 0 10px var(--c-cyan);",L="opacity: 0.6; padding: 2px 8px;";let B=C.map((z,U)=>`<span style="${U===R.userData.menuIndex?$:L}">${z.label}</span>`).join(" ");ge(p,Zt,`<div style="display: flex; gap: 4px; align-items: center; font-family: 'Rajdhani', sans-serif; font-size: 11px; letter-spacing: 1px;">${B}</div>`)};q(),p.monitorMenuInterval=setInterval(()=>{R.userData.menuIndex=(R.userData.menuIndex+1)%C.length,q()},800)}else pe(p)},b=(p,R,C,N=!0)=>{if(R)if(p.wallMenuInterval&&(clearInterval(p.wallMenuInterval),p.wallMenuInterval=null),N&&C){R.userData.menuIndex===void 0&&(R.userData.menuIndex=0);const q=()=>{C[R.userData.menuIndex];const $="background: var(--c-cyan); color: var(--c-black); padding: 2px 8px; font-weight: 800; border-radius: 2px; text-shadow: none; box-shadow: 0 0 10px var(--c-cyan);",L="opacity: 0.6; padding: 2px 8px;";let B=C.map((z,U)=>`<span style="${U===R.userData.menuIndex?$:L}">${z.label}</span>`).join(" ");ge(p,bn,`<div style="display: flex; gap: 4px; align-items: center; font-family: 'Rajdhani', sans-serif; font-size: 13px; letter-spacing: 1px;">${B}</div>`)};q(),p.wallMenuInterval=setInterval(()=>{R.userData.menuIndex=(R.userData.menuIndex+1)%C.length,q()},1e3)}else pe(p)};return{hero_hitbox:{onMouseEnter:p=>{try{document.body.style.cursor="pointer";const R=e.isHeroAnimating||e.allowsResetting===!1;e.raycasterWrapper?.mouseInContainer,V(e,!0)}catch(R){console.error("Error in hero_hitbox onMouseEnter:",R)}},onMouseLeave:()=>{document.body.style.cursor="auto",pe(e),V(e,!1)},onMouseDown:()=>{if(e.isHeroAnimating||e.allowsResetting===!1)return;const p=[()=>Ni(e),()=>G(e),()=>zt(e),()=>hr(e)][e.heroMenuIndex||0];p&&(pe(e),p())}},catBlack:{onMouseEnter:p=>{e.raycasterEnabled!==!1&&(document.body.style.cursor="pointer",e.raycasterWrapper?.mouseInContainer&&ge(e,Vo,p.userData.assignedRole||"MAX - TECH LEAD"),Xt(e,p,xo),s&&Xt(e,s,xo),n&&!n.userData.hasShoutedHover&&(S&&clearTimeout(S),S=setTimeout(()=>{e.conversationManager?.shout(Ie.SHOUT_CAT_BLACK_HOVER.en[0]),n.userData.hasShoutedHover=!0,S=null},400)))},onMouseLeave:p=>{S&&(clearTimeout(S),S=null),document.body.style.cursor="auto",Me(e),pe(e)},onMouseDown:(p,R)=>{if(_e(e,p,R),i&&o){const C=[n];s&&C.push(s),Do(e,i,C,o.gravityCenter,o.tgtPos,o.tgtQuat,p)}n.userData.hasShoutedClick||(e.conversationManager?.shout(Ie.SHOUT_CAT_BLACK_CLICK.en[0],4e3,{extraSmall:!0}),n.userData.hasShoutedClick=!0)}},catWhite:{onMouseEnter:p=>{e.raycasterEnabled!==!1&&(document.body.style.cursor="pointer",Xt(e,p,xo),e.raycasterWrapper?.mouseInContainer&&ge(e,Vo,p.userData.assignedRole||"MIN - QA ENGINEER"),c&&!c.userData.hasShoutedHover&&(S&&clearTimeout(S),S=setTimeout(()=>{e.conversationManager?.shout(Ie.SHOUT_CAT_WHITE_HOVER.en[0]),c.userData.hasShoutedHover=!0,S=null},400)))},onMouseLeave:p=>{S&&(clearTimeout(S),S=null),document.body.style.cursor="auto",Me(e),pe(e)},onMouseDown:(p,R)=>{_e(e,p,R),i&&o&&Do(e,i,c,o.gravityCenter,o.tgtPos,o.tgtQuat,p)}},pokeball:{onMouseEnter:p=>{e.raycasterEnabled!==!1&&(document.body.style.cursor="pointer",vo(e),Xt(e,p))},onMouseLeave:()=>{document.body.style.cursor="auto",Me(e)},onMouseDown:(p,R)=>{if(e.raycasterEnabled===!1)return;_e(e,p,R),F();const C=[c,n].filter(N=>N&&N.visible);C.length>0&&Do(e,i,C,o.gravityCenter,o.tgtPos,o.tgtQuat,p)}},pokeball2:{onMouseEnter:p=>{e.raycasterEnabled!==!1&&(document.body.style.cursor="pointer",vo(e),Xt(e,p))},onMouseLeave:()=>{document.body.style.cursor="auto",Me(e)},onMouseDown:(p,R)=>{if(e.raycasterEnabled===!1)return;_e(e,p,R),F();const C=[c,n].filter(N=>N&&N.visible);C.length>0&&Do(e,a,C,o.gravityCenter,o.tgtPos,o.tgtQuat,p)}},pokeball3:{onMouseEnter:p=>{e.raycasterEnabled!==!1&&(document.body.style.cursor="pointer",vo(e),Xt(e,p))},onMouseLeave:()=>{document.body.style.cursor="auto",Me(e)},onMouseDown:(p,R)=>{if(e.raycasterEnabled===!1)return;_e(e,p,R),F();const C=[c,n].filter(N=>N&&N.visible);C.length>0&&Do(e,r,C,o.gravityCenter,o.tgtPos,o.tgtQuat,p)}},Object_2001:{onMouseEnter:p=>{e.raycasterEnabled!==!1&&(document.body.style.cursor="pointer",e.raycasterWrapper?.mouseInContainer&&ge(e,Rt,Z("UI_INFORMER_CHAIR")),at(e,p))},onMouseLeave:()=>{document.body.style.cursor="auto",pe(e),Me(e)},onMouseDown:(p,R)=>{e.raycasterEnabled!==!1&&_e(e,p,R)}},Lathe_Center:{onMouseEnter:p=>{e.raycasterEnabled!==!1&&e.integrityBaselineCaptured&&(document.body.style.cursor="pointer",e.raycasterWrapper?.mouseInContainer&&ge(e,wn,Z("UI_INFORMER_BLACKHOLE")),e.raycastObjects&&m.length===0&&(m=[...e.raycastObjects],e.raycastObjects=[p]),O())},onMouseLeave:()=>{if(document.body.style.cursor="auto",!e.integrityBaselineCaptured)return;_(),v(),m.length>0&&(e.raycastObjects=[...m],m=[]);let p=t.get("Object_2001");p&&p.rapierBody.sleep(),sa(e,!1),pe(e),window._cvState==="sucking"&&Gt()},onMouseDown:()=>{e.raycasterEnabled!==!1&&e.integrityBaselineCaptured&&A()},onMouseHover:()=>{gn(e)}},planeSky:{onMouseEnter:()=>{e.raycasterEnabled!==!1&&(document.body.style.cursor="pointer",e.raycasterWrapper?.mouseInContainer&&ge(e,zo,Z("UI_INFORMER_SKY")))},onMouseLeave:()=>{document.body.style.cursor="auto",pe(e)},onMouseDown:(p,R)=>{if(e.raycasterEnabled===!1)return;const C=R.point.clone(),N=p.worldToLocal(C),q=new l.Vector2(2*N.x,2*N.y),$=e.globalUniformsHub;Pi({scene:e,constantUniform:$?$.uniforms:null,windowLight:e.windowLight},2,q,!1)}},glassInvi:{onMouseEnter:p=>{e.raycasterEnabled!==!1&&(document.body.style.cursor="pointer",ge(e,yn,Z("UI_INFORMER_DOOR")),at(e,p))},onMouseLeave:()=>{document.body.style.cursor="auto",pe(e),Me(e)},onMouseDown:(p,R)=>{e.raycasterEnabled!==!1&&(p.userData.hasClickedOnce?Da(e):(Da(e,{forcedX:0}),p.userData.hasClickedOnce=!0))}},lamp:{onMouseEnter:p=>{e.raycasterEnabled!==!1&&(document.body.style.cursor="pointer",ge(e,Tn,Z("UI_INFORMER_LAMP")),at(e,p))},onMouseLeave:()=>{document.body.style.cursor="auto",pe(e),Me(e)},onMouseDown:(p,R)=>{if(e.raycasterEnabled===!1)return;const C=R.point.clone();p.worldToLocal(C).y>.1?wc(e):_e(e,p,R)}},computer:{onMouseEnter:p=>{e.raycasterEnabled!==!1&&(document.body.style.cursor="pointer",ge(e,Zt,Z("UI_INFORMER_SCREEN")),at(e,p))},onMouseLeave:()=>{document.body.style.cursor="auto",pe(e),Me(e)},onMouseDown:(p,R)=>{if(e.raycasterEnabled===!1)return;Oa(e,se.currentMode,t),e.conversationManager?.shout("PERSONNEL ROLES REASSIGNED");const C=e.globalUniformsHub;Sc({constantUniform:C?C.uniforms:null,windowLight:e.windowLight},.96,null,!1)}},questionCube:{onMouseEnter:p=>{e.raycasterEnabled!==!1&&(document.body.style.cursor="pointer",e.raycasterWrapper?.mouseInContainer&&ge(e,Rt,Z("UI_INFORMER_CUBE")),at(e,p))},onMouseLeave:()=>{document.body.style.cursor="auto",pe(e),Me(e)},onMouseDown:(p,R)=>{e.raycasterEnabled!==!1&&(console.log("[Raycast] questionCube clicked! Triggering ritual.",p.name),nu(e,p))}},mjolnir_low_mjolnir_hammer_0:{onMouseEnter:p=>{e.raycasterEnabled!==!1&&(document.body.style.cursor="pointer",ge(e,zo,Z("UI_INFORMER_MJOLNIR")),at(e,p))},onMouseLeave:()=>{document.body.style.cursor="auto",pe(e),Me(e)},onMouseDown:(p,R)=>{if(e.raycasterEnabled===!1)return;const C=e.globalUniformsHub;_e(e,p,R,8),Pi({scene:e,constantUniform:C?C.uniforms:null,windowLight:e.windowLight},.96,null,!1)}},cFanBulb:{onMouseEnter:p=>{e.raycasterEnabled!==!1&&(document.body.style.cursor="pointer",ge(e,Bi,Z("UI_INFORMER_BULB")))},onMouseLeave:()=>{document.body.style.cursor="auto",pe(e)},onMouseDown:(p,R)=>{e.raycasterEnabled!==!1&&au(e,p)},onMouseHover:()=>{}},cFanBody:{onMouseEnter:p=>{document.body.style.cursor="pointer";const R=Z("UI_INFORMER_FAN_BODY")||"BOOST & BLAST";ge(e,Bi,R),at(e,p)},onMouseLeave:()=>{pe(e),Me(e)},onMouseDown:(p,R)=>{ua(e,p)},onMouseHover:()=>{}},wallArea:{onMouseEnter:p=>{if(e.raycasterEnabled===!1)return;document.body.style.cursor="pointer",g&&(clearTimeout(g),g=null),Ro(e);const R=e.objectMap?e.objectMap.get("wallArea"):null;e.gazeFollower&&e.gazeFollower.lookAtTarget(R),b(e,p,[{label:"BLESSING",action:()=>M(e,p)},{label:"WRATH",action:()=>{const C=e.getObjectByName("cFanBody")||(e.objectMap?e.objectMap.get("cFanBody"):null);C&&ua(e,C)}}],!0)},onMouseLeave:p=>{document.body.style.cursor="auto",e.gazeFollower&&e.gazeFollower.lookAtTarget(e.camera),g=setTimeout(()=>{Mo(e)},4e3),b(e,p,null,!1)},onMouseDown:(p,R)=>{const C=[{label:"BLESSING",action:()=>M(e,p,R)},{label:"WRATH",action:()=>{const N=e.getObjectByName("cFanBody")||(e.objectMap?e.objectMap.get("cFanBody"):null);N&&ua(e,N)}}];p.userData.menuIndex===void 0&&(p.userData.menuIndex=0),C[p.userData.menuIndex].action()},onMouseHover:()=>{}},shelf:{},caseCover:{onMouseEnter:p=>{if(e.raycasterEnabled===!1)return;document.body.style.cursor="pointer",ge(e,Zt,Z("UI_INFORMER_REBOOT")),at(e,p),w&&w.stop();const R=e.globalUniformsHub;!R||!R.uFireHeightOverride||(R.uFireHeightOverride.value<.01&&(R.uFireHeightOverride.value=2.5),w=new x.Tween(R.uFireHeightOverride).to({value:6},4e3).easing(x.Easing.Cubic.Out).start())},onMouseLeave:()=>{pe(e),Me(e);const p=e.globalUniformsHub;!p||!p.uFireHeightOverride||(w=new x.Tween(p.uFireHeightOverride).to({value:0},1e3).easing(x.Easing.Cubic.In).onComplete(()=>{p.uFireHeightOverride&&(p.uFireHeightOverride.value=0)}).start())},onMouseDown:(p,R)=>{w&&w.stop();const C=e.globalUniformsHub;C&&C.uFireHeightOverride&&(C.uFireHeightOverride.value=0),_e(e,p,R),Lc(e,4500),["screenDisplay001","screenDisplay002","verticalMonitorDisplay"].forEach(N=>{const q=e.objectMap.get(N);q&&(q.material=te,q.userData.originalMaterial=te)})}},droneRC:{onMouseEnter:()=>{document.body.style.cursor="pointer";const p=e.getObjectByName("drone");p&&(p.userData.isHovering=!0,Vt(e,new l.Vector3(0,-.76,.5).unproject(e.camera),!0))},onMouseLeave:()=>{document.body.style.cursor="auto";const p=e.getObjectByName("drone");if(p){p.userData.isHovering=!1;const R=e.getObjectByName("drone-beam");!(R&&R.visible)&&e.gazeFollower&&(e.gazeFollower.isLocked=!1,Vt(e,e.camera,!1))}},onMouseDown:p=>{const R=se.currentMode===Te.POBA?"SYS_DRONE_SUBTITLES_POBA":"SYS_DRONE_SUBTITLES_DEV",C=Ie[R]?.en||[];let N;if(C.length>1){const q=C.filter($=>$!==p.userData.lastSubtitle);N=q[Math.floor(Math.random()*q.length)]}else N=Z(R);p.userData.lastSubtitle=N,Xi(N),He(e,N)}},Object_34001:{onMouseEnter:p=>{document.body.style.cursor="pointer",h(e,p,[{label:"FIREWKS",action:()=>{p.material=eo,p.userData.originalMaterial=eo}},{label:"MOON",action:()=>{p.material=yo,p.userData.originalMaterial=yo}},{label:"SUNSET",action:()=>{p.material=wo,p.userData.originalMaterial=wo}},{label:"NETFLIX",action:()=>{p.material=Lt,p.userData.originalMaterial=Lt,e.globalUniformsHub?.uniforms.iTime&&(Lt.uniforms.uNetflixStartTime.value=e.globalUniformsHub.uniforms.iTime.value)}},{label:"DOTA",action:()=>{const R=[Le,Ye],C=R[Math.floor(Math.random()*R.length)];p.material=C,p.userData.originalMaterial=C}}],!0)},onMouseLeave:p=>{document.body.style.cursor="auto",h(e,p,null,!1)},onMouseDown:(p,R)=>{const C=[{label:"FIREWKS",action:()=>{p.material=eo,p.userData.originalMaterial=eo}},{label:"MOON",action:()=>{p.material=yo,p.userData.originalMaterial=yo}},{label:"SUNSET",action:()=>{p.material=wo,p.userData.originalMaterial=wo}},{label:"NETFLIX",action:()=>{p.material=Lt,p.userData.originalMaterial=Lt,e.globalUniformsHub?.uniforms.iTime&&(Lt.uniforms.uNetflixStartTime.value=e.globalUniformsHub.uniforms.iTime.value)}},{label:"DOTA",action:()=>{const N=[Le,Ye],q=N[Math.floor(Math.random()*N.length)];p.material=q,p.userData.originalMaterial=q}}];p.userData.menuIndex===void 0&&(p.userData.menuIndex=0),C[p.userData.menuIndex].action(),p.userData.menuIndex=(p.userData.menuIndex+1)%C.length,_e(e,e.objectMap.get("Object_31"),R,4),h(e,p,C)}},screenDisplay001:{onMouseEnter:p=>{e.raycasterEnabled!==!1&&(document.body.style.cursor="pointer",h(e,p,[{label:"CODE",action:()=>{p.material=te,p.userData.originalMaterial=te,typeof window.cvReset=="function"&&window.cvReset(1500)}},{label:"NETFLIX",action:()=>{p.material=Ne,p.userData.originalMaterial=Ne,Gt(),e.globalUniformsHub?.uniforms.iTime&&(Ne.uniforms.uNetflixStartTime.value=e.globalUniformsHub.uniforms.iTime.value)}},{label:"DOTA",action:()=>{const R=[Le,Ye],C=R[Math.floor(Math.random()*R.length)];p.material=C,p.userData.originalMaterial=C,Gt()}}],!0),te.uniforms.uHoverActive&&(te.uniforms.uHoverActive.value=1))},onMouseHover:(p,R)=>{if(!te.uniforms.uHoverActive)return;const C=R.uv,N=.045,q=1-N,$=(C.x-N)/q-.5,L=.035,B=.8999999999999999-L,z=(C.y-L)/B;te.uniforms.uTargetHoverPos.value.set($,z)},onMouseLeave:p=>{document.body.style.cursor="auto",h(e,p,null,!1),te.uniforms.uHoverActive&&(te.uniforms.uHoverActive.value=0)},onMouseDown:(p,R)=>{const C=[{label:"CODE",action:()=>{p.material=te,p.userData.originalMaterial=te,typeof window.cvReset=="function"&&window.cvReset(1500)}},{label:"NETFLIX",action:()=>{p.material=Ne,p.userData.originalMaterial=Ne,Gt(),e.globalUniformsHub?.uniforms.iTime&&(Ne.uniforms.uNetflixStartTime.value=e.globalUniformsHub.uniforms.iTime.value)}},{label:"DOTA",action:()=>{const N=[Le,Ye],q=N[Math.floor(Math.random()*N.length)];p.material=q,p.userData.originalMaterial=q,Gt()}}];p.userData.menuIndex===void 0&&(p.userData.menuIndex=0),C[p.userData.menuIndex].action(),p.userData.menuIndex=(p.userData.menuIndex+1)%C.length,_e(e,e.objectMap.get("screenDisplay"),R,4),h(e,p,C)}},verticalMonitorDisplay:{onMouseEnter:p=>{e.raycasterEnabled!==!1&&(document.body.style.cursor="pointer",h(e,p,[{label:"SPLIT",action:()=>{const R=p.geometry.attributes.aLayoutMode;R&&(R.array.fill(0),R.needsUpdate=!0)}},{label:"FULL",action:()=>{const R=p.geometry.attributes.aLayoutMode;R&&(R.array.fill(1),R.needsUpdate=!0)}}],!0),te.uniforms.uHoverActive&&(te.uniforms.uHoverActive.value=1))},onMouseHover:(p,R)=>{if(!te.uniforms.uHoverActive)return;const C=R.uv,N=.045,q=1-N,$=(C.x-N)/q,L=.035,B=.8999999999999999-L,z=(C.y-L)/B;te.uniforms.uTargetHoverPos.value.set($,z)},onMouseLeave:p=>{document.body.style.cursor="auto",h(e,p,null,!1),te.uniforms.uHoverActive&&(te.uniforms.uHoverActive.value=0)},onMouseDown:(p,R)=>{const C=[{label:"SPLIT",action:()=>{const N=p.geometry.attributes.aLayoutMode;N&&(N.array.fill(0),N.needsUpdate=!0)}},{label:"FULL",action:()=>{const N=p.geometry.attributes.aLayoutMode;N&&(N.array.fill(1),N.needsUpdate=!0)}}];if(p.userData.menuIndex===void 0&&(p.userData.menuIndex=0),C[p.userData.menuIndex].action(),p.userData.menuIndex=(p.userData.menuIndex+1)%C.length,R.uv&&te.uniforms.uClickPos){const N=R.uv,q=.045,$=1-q,L=(N.x-q)/$,B=.035,z=.8999999999999999-B,U=(N.y-B)/z;te.uniforms.uClickPos.value.set(L,U),e.globalUniformsHub?.uniforms.iTime&&(te.uniforms.uClickTime.value=e.globalUniformsHub.uniforms.iTime.value)}_e(e,e.objectMap.get("verticalMonitor"),R,4),h(e,p,C)}},screenDisplay002:{onMouseEnter:p=>{e.raycasterEnabled!==!1&&(document.body.style.cursor="pointer",h(e,p,[{label:"CODE",action:()=>{p.material=te,p.userData.originalMaterial=te}},{label:"NETFLIX",action:()=>{p.material=Ne,p.userData.originalMaterial=Ne,e.globalUniformsHub?.uniforms.iTime&&(Ne.uniforms.uNetflixStartTime.value=e.globalUniformsHub.uniforms.iTime.value)}},{label:"DOTA",action:()=>{const R=[Le,Ye],C=R[Math.floor(Math.random()*R.length)];p.material=C,p.userData.originalMaterial=C}}],!0),te.uniforms.uHoverActive&&(te.uniforms.uHoverActive.value=1))},onMouseHover:(p,R)=>{if(!te.uniforms.uHoverActive)return;const C=R.uv,N=.045,q=1-N,$=.54+(C.x-N)/q,L=.035,B=.8999999999999999-L,z=(C.y-L)/B;te.uniforms.uTargetHoverPos.value.set($,z)},onMouseLeave:p=>{document.body.style.cursor="auto",h(e,p,null,!1),te.uniforms.uHoverActive&&(te.uniforms.uHoverActive.value=0)},onMouseDown:(p,R)=>{const C=[{label:"CODE",action:()=>{p.material=te,p.userData.originalMaterial=te}},{label:"NETFLIX",action:()=>{p.material=Ne,p.userData.originalMaterial=Ne,e.globalUniformsHub?.uniforms.iTime&&(Ne.uniforms.uNetflixStartTime.value=e.globalUniformsHub.uniforms.iTime.value)}},{label:"DOTA",action:()=>{const N=[Le,Ye],q=N[Math.floor(Math.random()*N.length)];p.material=q,p.userData.originalMaterial=q}}];p.userData.menuIndex===void 0&&(p.userData.menuIndex=0),C[p.userData.menuIndex].action(),p.userData.menuIndex=(p.userData.menuIndex+1)%C.length,_e(e,e.objectMap.get("screenDisplay2"),R,4),h(e,p,C)}},aegis:{onMouseEnter:p=>{at(e,p),ge(e,Zt,Z("UI_INFORMER_AEGIS")),yr(e,p)},onMouseLeave:p=>{Me(e),pe(e),Ha(e)},onMouseDown:(p,R)=>{const C=e.objectMap.get("screenDisplay001"),N=e.objectMap.get("Object_34001"),q=[{screen:C,pool:[Le,Ye]},{screen:N,pool:[Le,Ye]}],$=q[Math.floor(Math.random()*q.length)];if($.screen&&$.pool.length>0){const L=$.pool[Math.floor(Math.random()*$.pool.length)];$.screen.material=L,$.screen.userData.originalMaterial=L,re(Z("SYS_STORY_DOTA_LIFE"))}_e(e,p,R)}},aegis2:{onMouseEnter:p=>{at(e,p),ge(e,Zt,Z("UI_INFORMER_AEGIS")),yr(e,p)},onMouseLeave:p=>{Me(e),pe(e),Ha(e)},onMouseDown:(p,R)=>{const C=e.objectMap.get("screenDisplay001"),N=e.objectMap.get("Object_34001"),q=[{screen:C,pool:[Le,Ye]},{screen:N,pool:[Le,Ye]}],$=q[Math.floor(Math.random()*q.length)];if($.screen&&$.pool.length>0){const L=$.pool[Math.floor(Math.random()*$.pool.length)];$.screen.material=L,$.screen.userData.originalMaterial=L,re("PICK ME!!")}_e(e,p,R)}}}},$s=e=>{pe(e),document.body.style.cursor="auto"},Uo=!1,Ti=!1,bi=!1}));function ru(e){return function(t){let o=e*1.525;return(t*=2)<1?.5*(t*t*((o+1)*t-o)):.5*((t-=2)*t*((o+1)*t+o)+2)}}function Nn(e){return function(t){let o=e;return--t*t*((o+1)*t+o)+1}}var Ks,Ln,Ki=J((()=>{Ks=ru(.4),Ln=Nn(.04)})),_o,ji=J((()=>{_o={isUnlocked:!0,init:e=>{const t=e.HUD;!t||!t.navButtons||t.navButtons.forEach(o=>{o.hide(0),o.setActive(!1)})},onHudOpen:e=>{const t=e.HUD;if(!t||!t.navButtons)return;const o=1200;t.navButtons.forEach((a,r)=>{r!==0&&a.hide(0)});const i=t.navButtons[0];i.show(o,1),i.setActive(!1)},onMorphToAbout:e=>{const t=e.HUD;if(!t||!t.navButtons)return;const o=150,i=1e3,a=t.navButtons[3];a.setText("ABOUT"),a.show(i,2),a.setActive(!0),setTimeout(()=>{const r=t.navButtons[2];r.setText("LAB"),r.show(i,1.8),r.setActive(!1)},o),setTimeout(()=>{const r=t.navButtons[1];r.setText("WORK"),r.show(i,2.2),r.setActive(!1)},o*2)},onRoomAssemble:e=>{const t=e.HUD;if(!t||!t.navButtons)return;_o.isUnlocked=!0,t.navButtons[0].show(1500,1);const o=t.navButtons[2];o.setText("LAB"),o.show(1500,1.8),o.setActive(!0);const i=t.navButtons[1];i.setText("WORK"),i.show(1500,2.2),i.setActive(!1);const a=t.navButtons[3];a.setText("ABOUT"),a.show(1500,2),a.setActive(!1)}}}));function js(e){if(!e||!e.renderer)return;const t=(window.devicePixelRatio||1)*.2,o=e.renderer.getPixelRatio();Math.abs(o-t)>.01&&(e.renderer.setPixelRatio(t),e.pointsApp&&typeof e.pointsApp.onWindowResize=="function"&&e.pointsApp.onWindowResize())}async function su(e,t,o,i=800){if(!e||!e.renderer)return;const a=window.devicePixelRatio||1,r=[.35,.5,o];for(const n of r)n<=t||(await Fe(i),e.renderer&&(e.renderer.setPixelRatio(a*n),e.pointsApp&&typeof e.pointsApp.onWindowResize=="function"&&e.pointsApp.onWindowResize()))}async function Xs(e,t=800,o=!1){performance.now(),e.isTransitioning=!0,e.HUD&&typeof e.HUD.stopBreathing=="function"&&e.HUD.stopBreathing(),e.renderer&&(e.renderer.shadowMap.autoUpdate=!1,js(e));const i=Re(e,"roomGLBModel");i&&(i.visible=!0,i.scale.set(1,1,1),i.position.set(0,0,0),e.physicObjects&&e.physicObjects.forEach(T=>{T.visible=!0}),["rightWall-cover","floor","planeSky"].forEach(T=>{const M=Re(e,T);M&&(M.visible=!0)}));const a=e.isLowPowerMode,r=o?0:a?600:1050;["floor","planeSky","rightWall-cover"].forEach(T=>{const M=Re(e,T);M&&(M.visible=!0,pa({obj:M,duration:t*(a?.1:.2),delay:r,easing:Nn(.25)}))});const n=Re(e,"a-char");n&&(n.visible=!0,n.scale.setScalar(1e-4),n.userData.originalPos&&n.position.copy(n.userData.originalPos),n.userData.originalRot&&n.rotation.copy(n.userData.originalRot),n.updateMatrix());const s=Re(e,"stool");s&&(s.visible=!0,s.scale.setScalar(1e-4),s.userData.originalPos&&s.position.copy(s.userData.originalPos),s.userData.originalRot&&s.rotation.copy(s.userData.originalRot),s.updateMatrix());const c=Re(e,"stool_bound");c&&(c.visible=!1,c.userData.originalPos&&c.position.copy(c.userData.originalPos),c.userData.originalScale&&c.scale.copy(c.userData.originalScale),c.userData.originalRot&&c.rotation.copy(c.userData.originalRot),c.updateMatrix()),e.points.material.uniforms.uPixelRatio.value,e.points.material.uniforms.uSize.value;const u=o?0:a?900:1500,d=.15,m=.05,f=u*(1-d-m),g=bo[1].toneMappingExposure,w=T=>new x.Tween(e.points.material.uniforms.uPixelRatio).to({value:T},f).easing(x.Easing.Exponential.In),y=T=>new x.Tween(e.points.material.uniforms.uSize).to({value:T},f).easing(x.Easing.Exponential.In),S=T=>new x.Tween(e.renderer).to({toneMappingExposure:T},f).easing(x.Easing.Linear.None);if(o)n&&(n.visible=!0,pa({obj:n,duration:100})),s&&(s.visible=!0,pa({obj:s,duration:100})),Ua(e,0);else{const T=new x.Tween(e.points.bloomPass).to({strength:0},u*d).delay(u*m).easing(x.Easing.Back.InOut).onComplete(async()=>{const M=Re(e,"rightWall-cover");M&&(M.visible=!0),window.showSectionPoint&&window.showSectionPoint()});new x.Tween(e.points.bloomPass).to({strength:5},f).easing(x.Easing.Quadratic.In).onComplete(async()=>{n&&n.scale.copy(n.userData.originalScale),s&&s.scale.copy(s.userData.originalScale),c&&(c.visible=!0,c.userData.originalPos&&c.position.copy(c.userData.originalPos),c.userData.originalRot&&c.rotation.copy(c.userData.originalRot),c.scale.copy(c.userData.originalScale),c.updateMatrix()),e.pointsApp&&e.pointsApp.points&&(e.pointsApp.points.visible=!1),T.start()}).start(),w(0).start(),y(0).start(),setTimeout(()=>{Ua(e)},f*.1)}S(g).start()}async function lu(e,t){const o=Qs(e);o.forEach((s,c)=>{}),e.loadedModel&&e.loadedModel.model&&e.loadedModel.model.position.set(0,0,0);const i=o.filter(s=>/^book\d+$/.test(s.name)),a=o.filter(s=>!/^book\d+$/.test(s.name)),r=e.isLowPowerMode,n=(s,c,u=1,d=!1,m=null)=>new Promise(f=>{if(s.length===0)return f();let g=0;const w=s.length,y=d?x.Easing.Cubic.Out:Nn(1),S=Math.ceil(w/5);let T=0;const M=()=>{const O=Math.min(T+S,w);performance.now();for(let _=T;_<O;_++){const v=s[_];v.userData.scenarioTween&&(v.userData.scenarioTween.stop(),v.userData.scenarioTween=null),v.userData.wasMatrixAutoUpdate=v.matrixAutoUpdate,v.matrixAutoUpdate=!1;const P=v.userData,A=(Math.random()-.5)*500,F=Math.max(0,_/w*c*u+A),G=c*(d?1:.7+Math.random()*.7),V={t:0};v.userData.scenarioTween=new x.Tween(V).to({t:1},G).delay(F).easing(y).onUpdate(()=>{const h=V.t;P.originalPos&&P.hidePos&&(v.position.x=P.hidePos.x+(P.originalPos.x-P.hidePos.x)*h,v.position.y=P.hidePos.y+(P.originalPos.y-P.hidePos.y)*h,v.position.z=P.hidePos.z+(P.originalPos.z-P.hidePos.z)*h),P.originalScale&&P.hideScale&&(v.scale.x=P.hideScale.x+(P.originalScale.x-P.hideScale.x)*h,v.scale.y=P.hideScale.y+(P.originalScale.y-P.hideScale.y)*h,v.scale.z=P.hideScale.z+(P.originalScale.z-P.hideScale.z)*h),d&&P.originalRot&&P.hideRot&&(v.rotation.x=P.hideRot.x+(P.originalRot.x-P.hideRot.x)*h,v.rotation.y=P.hideRot.y+(P.originalRot.y-P.hideRot.y)*h,v.rotation.z=P.hideRot.z+(P.originalRot.z-P.hideRot.z)*h),v.matrixAutoUpdate===!1&&v.updateMatrix()}).onComplete(async()=>{v.userData.scenarioTween=null,g++,g===w&&(m&&await m(),f())}).start()}T=O,T<w&&requestAnimationFrame(M)};M()});await n(a,t,r?.3:.5),await Fe(r?34:68),await n(i,t*.8,r?.3:.4,!0,async()=>{await cu(e,o),ai(e,1),setTimeout(()=>{tl(e),e.physicObjects&&e.physicObjects.forEach((s,c)=>{s.rapierBody&&setTimeout(()=>{s.rapierBody&&s.rapierBody.wakeUp()},c*6)})},250),await Fe(r?300:500)})}function cu(e,t){return new Promise(o=>{let a=0;const r=()=>{const n=Math.min(a+20,t.length);for(let s=a;s<n;s++){const c=t[s];c.matrixAutoUpdate=c.userData.wasMatrixAutoUpdate!==void 0?c.userData.wasMatrixAutoUpdate:!0,c.updateMatrix()}a=n,a<t.length?requestAnimationFrame(r):(e.loadedModel&&e.loadedModel.model&&e.loadedModel.model.updateMatrixWorld(!0),o())};r()})}async function da(e,t=!0){e.objectMap.get("planeSky"),e.objectMap.forEach((o,i)=>{/^dragonBall\d+Stars$/.test(i)&&(o.visible=t)}),t?(e.clock.start(),re("Clock Resumed.")):(e.clock.stop(),re("Clock Paused.")),e.world&&(e.world.isActive=t,re(t?"Physics Activated.":"Physics Deactivated."))}function uu(e){e.userData.originalPos=e.position.clone(),e.userData.originalScale=e.scale.clone(),e.userData.originalRot=e.rotation.clone(),Zs(e,ao,"x",-1),e.scale.set(0,0,0),e.rotation.z+=.1*Math.PI*2,e.visible=!0}function gr(e,t,o=0){const i=e.objectMap.get("blackholeScene");if(!i.userData.originalPos||!i.userData.originalScale||!i.userData.originalRot)return;const a=i.position.clone(),r=i.userData.originalPos,n=i.scale.clone(),s=i.userData.originalScale,c=i.rotation.z,u=i.userData.originalRot.z,d=t*2,m={t:0};new x.Tween(m).to({t:2},d).easing(x.Easing.Linear.None).delay(o).onUpdate(()=>{const f=m.t;if(f<=1){const g=x.Easing.Back.Out(f);i.position.lerpVectors(a,r,g)}else{i.position.copy(r),e.fireflies.material.uniforms.uSizeFactor.value=1;const g=Math.min(f-1,1),w=x.Easing.Back.Out(g);i.scale.lerpVectors(n,s,w);const y=x.Easing.Back.InOut(g);i.rotation.z=c+(u-c)*y}}).onComplete(()=>{i.position.copy(r),i.scale.copy(s),i.rotation.z=u,new x.Tween(e.fireflies.material.uniforms.uKamikazeScale).to({value:1},t).easing(x.Easing.Cubic.In).start()}).start()}function du(e){const t=e.objectMap.get("planeSky");t&&(t.visible=!1);const o=e.objectMap.get("blackholeScene");o&&uu(o),["rightWall-cover","a-char","stool","stool_bound","floor","moon","planeSky"].forEach(i=>{const a=e.getObjectByName(i);if(a){fa(a);const r=i==="a-char"||i==="stool"||i==="stool_bound";i!=="floor"&&i!=="moon"&&!r?(a.position.set(0,-ao,0),a.visible=!1):r?(a.visible=!0,a.scale.setScalar(1e-4)):a.visible=!1}}),Qs(e).forEach(i=>{/^book\d+$/.test(i.name)?fa(i,{fixedAxis:"x",fixedDirection:1,enableSpin:!0,ignoreAxisOffset:!1}):fa(i,{fixedAxis:"x",fixedDirection:-1,ignoreAxisOffset:!1})})}function fa(e,t={}){const{fixedAxis:o=null,fixedDirection:i=null,enableSpin:a=!1,ignoreAxisOffset:r=!1}=t;e.userData.originalPos=e.position.clone(),e.userData.originalScale=e.scale.clone(),e.userData.originalRot=e.rotation.clone();const n=i!==null?i:Math.random()>.5?1:-1;if(r?fu(e,ao,o,n):Zs(e,ao,o,n),a){const s=(Math.random()*50+50)*(Math.PI*2),c=Math.random()>.5?1:-1;e.rotation.y+=s*c}e.scale.set(0,0,0),e.visible=!0,e.userData.hidePos=e.position.clone(),e.userData.hideScale=e.scale.clone(),e.userData.hideRot=e.rotation.clone(),e.name}function pa({obj:e,duration:t,delay:o=0,enableSpin:i=!1,easing:a=x.Easing.Cubic.Out}){if(!e.userData.originalPos)return;const r=e.position.clone(),n=e.scale.clone(),s=e.rotation.clone(),c=e.userData.originalPos,u=e.userData.originalScale,d=e.userData.originalRot,m=e.castShadow,f=e.receiveShadow,g=e.matrixAutoUpdate,w=e.frustumCulled;e.castShadow=!1,e.receiveShadow=!1,e.matrixAutoUpdate=!1,e.frustumCulled=!1;const y={t:0};new x.Tween(y).to({t:1},t).delay(o).easing(x.Easing.Linear.None).onUpdate(()=>{const S=y.t,T=a(Math.min(S/.7,1));e.position.lerpVectors(r,c,T);const M=Math.max(0,(S-.2)/.6),O=x.Easing.Back.Out(Math.min(M,1));if(e.scale.lerpVectors(n,u,O),i){const _=Math.max(0,(S-.4)/.6),v=x.Easing.Quadratic.Out(Math.min(_,1));e.rotation.x=s.x+(d.x-s.x)*v,e.rotation.y=s.y+(d.y-s.y)*v,e.rotation.z=s.z+(d.z-s.z)*v}e.updateMatrix()}).onComplete(()=>{e.castShadow=m,e.receiveShadow=f,e.matrixAutoUpdate=g,e.frustumCulled=w,e.position.copy(c),e.scale.copy(u),e.rotation.copy(d),e.updateMatrix(),e.updateMatrixWorld(!0)}).start()}function Qs(e){if(e.assembleGroups)return e.assembleGroups;const t=e.children.filter(o=>!o.name||o.isCamera||o.isLight||o.isBone||o.name==="roomGLBModel"||o===e||o.name==="HUDFrame"||el.includes(o.name)||/^dragonBall\d+Stars$/.test(o.name)||/^Ch23_/.test(o.name)||/^mixamorig/.test(o.name)||/^BTC_/.test(o.name)||/^ETH_/.test(o.name)?!1:o.isObject3D);return t.sort((o,i)=>{const a=r=>r.material?Array.isArray(r.material)?r.material[0].uuid:r.material.uuid:"";return a(o).localeCompare(a(i))}),e.assembleGroups=t,t}function Zs(e,t,o=null,i=1){const a=["x","y","z"];let r=o;(!r||!a.includes(r))&&(r=a[Math.floor(Math.random()*3)]),r==="y"&&(i=1),e.position[r]+=t*i}function fu(e,t,o=null,i=1){const a=["x","y","z"];let r=o;(!r||!a.includes(r))&&(r=a[Math.floor(Math.random()*3)]),r==="y"&&(i=1),e.position[r]+=t*i;const n=t*.5;a.filter(s=>s!==r).forEach(s=>{let c=Math.random()>.5?1:-1;s==="y"&&(c=1),e.position[s]+=n*c})}function Re(e,t){if(!t)return null;if(e.objectMap||kn(e),e.objectMap.has(t))return e.objectMap.get(t);const o=e.getObjectByName(t);return o&&e.objectMap.set(t,o),o}function La(e,t){!t||!t.name||(e.objectMap||kn(e),e.objectMap.set(t.name,t))}function pu(e,t){e.objectMap&&e.objectMap.delete(t)}function kn(e){const t=new Map;return e.traverse(o=>{o.name&&t.set(o.name,o)}),e.objectMap=t,t}async function mu(){const e=document.getElementById("progress-text"),t=document.getElementById("progress-bar"),o=document.getElementById("cv-container");e&&(e.innerText=Z("SYS_READY")),t&&(t.parentElement.style.opacity="0"),o&&o.classList.add("collapsed");const i=document.getElementById("main-ui");i&&(i.style.opacity="0"),await Fe(200)}async function hu(){const e=document.getElementById("loading-container"),t=document.querySelector(".loader-content");if(t&&(t.style.transition="opacity 0.5s ease",t.style.opacity="0"),e){await Fe(100),e.style.transition="opacity 0.4s ease",e.style.opacity="0",await Fe(400),e.style.display="none";const o=document.getElementById("main-ui");o&&(o.style.transition="opacity 1s ease",o.style.opacity="1")}}function Fe(e){return new Promise(t=>setTimeout(t,e))}async function gu(e,t={}){const{duration:o=3e3,delay:i=0,onStart:a,onComplete:r}=t,n=e.getObjectByName("drone");if(!n){console.error("Drone not found");return}return new Promise(s=>{const c=n.position.clone(),u=new l.Vector3(9,1,-1.3),d=new l.Vector3(-1,9,-5);al=d;const m=new l.CatmullRomCurve3([c,u,d],!1,"centripetal"),f=n.quaternion.clone(),g=new l.Euler(-Math.PI/2,.2,1.25),w=new l.Quaternion().setFromEuler(g),y=new l.Quaternion().setFromAxisAngle(new l.Vector3(1,0,0),Math.PI/2);w.multiply(y);const S={val:0};let T=new l.Quaternion;new x.Tween(S).to({val:1},o).delay(i).easing(x.Easing.Quadratic.InOut).onStart(()=>{let M=new Gr(n);M.init(),e.gazeFollower=M,a&&a()}).onUpdate(()=>{if(e._spawnStopSignal){S.val=1;return}const M=m.getPoint(S.val);n.rapierBody.setNextKinematicTranslation(M),T.copy(f).slerp(w,S.val);const O=e.world;if(O&&!O.isBusy)try{const _=O.isBusy;O.isBusy=!0,n.rapierBody.setRotation({x:T.x,y:T.y,z:T.z,w:T.w},!0),O.isBusy=_}catch(_){console.error("[Scenario] Rapier failed to set rotation @CurveAnim:",_.message),_.message.includes("recursive")&&console.trace("[Scenario] Recursive WASM call trace @CurveAnim:")}}).onComplete(()=>{if(e._spawnStopSignal){s();return}e.world&&!e.world.isBusy&&(n.rapierBody.setTranslation({x:d.x,y:d.y,z:d.z},!0),n.rapierBody.setRotation({x:w.x,y:w.y,z:w.z,w:w.w},!0)),r&&r(),s()}).start()})}function vu(e){e.globalUniformsHub.uStormSharpness.value=0}function yu(e){e.globalUniformsHub.enableLightning.value=!1,e.globalUniformsHub.uRainHeaviness.value=0,e.globalUniformsHub.glassRainAmount.value=0,e.globalUniformsHub.rainGlassOpacity.value=0}function wu(e){const t=e.getObjectByName("floor"),o=e.getObjectByName("Object_0003_3"),i=e.getObjectByName("Object_12001");t?.material&&(t.material.envMapIntensity=.1),o?.material&&(o.material.envMapIntensity=.7),i?.material&&(i.material.envMapIntensity=0),e.environmentIntensity=.4}function Su(e){vu(e),yu(e),wu(e)}function xu(e,t=12e3){let o=e.globalUniformsHub,i=t,a=x.Easing.Linear.None;const r={val:0};let n=new x.Tween(r).to({val:1},i).easing(a).onUpdate(()=>{e.globalUniformsHub.glassRainAmount.value=r.val,e.globalUniformsHub.rainGlassOpacity.value=r.val}),s=new x.Tween(o.uMoonPosition.value).to({x:"+0.001",y:"+0.05"},i*2).easing(a),c=new x.Tween(o.uMoonSize).to({value:o.uMoonSize.value*.65},i*2).easing(a);const u={t:0};new x.Tween(u).to({t:1},i).easing(a).onUpdate(()=>{e.globalUniformsHub.uStormSharpness.value=u.t,e.globalUniformsHub.uRainHeaviness.value=u.t*.75}).onStart(()=>{setTimeout(()=>{n.start(),s.start(),c.start()},i*.4)}).onComplete(()=>{}).start()}async function Tu(e,t=3e3){let o=e.objectMap.get("bulb");if(!o)return;let i=1e3,a=25,r=new l.Vector3(1,1,1),n=new l.Vector3(0,9.2,0),s=o.rotation.clone(),c=o.getObjectByName("bulbLight");c||(c=e.getObjectByName("bulbLight")||e.bulbLight,c&&o&&(o.attach(c),c.position.set(0,0,0),c.target&&(o.add(c.target),c.target.position.set(0,-10,0))));let u=c?c.intensity:0,d=c?c.distance:0,m=new l.Vector3(0,0,0);e.objectMap.get("Lathe_Center");let f=new l.Vector3;f.copy(o.position),o.position.copy(f),o.visible=!0,o.scale.setScalar(0),o.material.visible=!0,c&&c.parent!==o&&(o.add(c),c.target&&o.add(c.target),c.position.set(0,0,0),c.target.position.set(0,-10,0));const g=o.getObjectByName("bulbAura");g&&(g.visible=!0);let w={t:0};const y=e.animations[1],S=e.mixer.clipAction(y);S.reset(),S.play(),new x.Tween(w).to({t:1},t).easing(x.Easing.Back.Out).onStart(()=>{}).onUpdate(()=>{const T=w.t;o.scale.lerpVectors(m,r,T),c&&(c.intensity=l.MathUtils.lerp(u,i,T),c.distance=l.MathUtils.lerp(d,a,Math.min(T*5,1))),o.position.lerpVectors(f,n,T);const M=1.5,O=4,_=Math.sin(T*Math.PI)*M,v=-T*Math.PI*2*O;o.position.y+=Math.cos(v)*_,o.position.z+=Math.sin(v)*_;const P=(1-T)*Math.PI*2*4;o.rotation.set(s.x+P,s.y+P*.5,s.z)}).onComplete(()=>{e.raycasterEnabled=!0,re("Scenario Stable. System interactions re-enabled."),c&&new x.Tween(c).to({intensity:800},3e3).easing(x.Easing.Back.Out).start(),e._spawnStopSignal||(!e.dragonBalls||e.dragonBalls.length===0)&&bu(e,o)}).start()}function bu(e,t){e.dragonBalls&&e.dragonBalls.length>0&&e.dragonBalls.forEach(r=>{r.parent&&r.parent.remove(r),e.remove(r)}),e.dragonBalls=[];const a=2;setTimeout(()=>{re("The Dragon Balls descend...");for(let n=1;n<=7;n++){const s=()=>{if(e._spawnStopSignal)return;if(e.world.isBusy){setTimeout(s,16);return}const c=vs(e,n);if(!c){setTimeout(s,16);return}const u=new l.Vector3;t.getWorldPosition(u),u.y-=.5,u.x+=(Math.random()-.5)*.2,u.z+=(Math.random()-.5)*.2,c.position.copy(u),c.userData.originalPos=c.position.clone(),c.userData.originalScale=c.scale.clone(),c.userData.originalRot=c.rotation.clone(),c.rapierBody&&(c.rapierBody.setTranslation(u,!0),c.rapierBody.wakeUp()),c.userData.oscStrength=a;const d=c.children.find(y=>y.name.startsWith("Aura"));d&&(d.userData.oscStrength=a);const m=y=>{y.onBeforeRender=function(S,T,M,O,_,v){_.uniforms&&_.uniforms.uOscillationStrength&&(this.userData.prevOsc=_.uniforms.uOscillationStrength.value,_.uniforms.uOscillationStrength.value=this.userData.oscStrength)},y.onAfterRender=function(S,T,M,O,_,v){_.uniforms&&_.uniforms.uOscillationStrength&&(_.uniforms.uOscillationStrength.value=this.userData.prevOsc)}};m(c),d&&m(d);const f=c.scale.clone();let g=.1;if(c.scale.multiplyScalar(g),Qa(e,c,c.rapierBody,c.rapierShape),c.rapierBody){const y=c.rapierBody.mass(),S=1.6,T=(Math.random()>.5?1:-1)*(.7+Math.random());c.rapierBody.applyImpulse({x:S*y,y:0,z:T*y},!0)}let w=.5;c.rapierShape&&c.rapierShape.radius&&f.x>0&&(w=c.rapierShape.radius/f.x),c.rapierCollider.setRadius(c.scale.x*w),setTimeout(()=>{const S=f.clone().multiplyScalar(g),T={t:0};new x.Tween(T).to({t:1},4500).easing(x.Easing.Cubic.Out).onUpdate(()=>{const O=T.t;if(c.scale.lerpVectors(S,f,O),c.rapierCollider)try{typeof c.rapierCollider.setRadius=="function"&&c.rapierCollider.setRadius(c.scale.x*w)}catch{}}).start();const M={t:0};new x.Tween(M).to({t:1},4500).easing(x.Easing.Exponential.In).onUpdate(()=>{const O=a*(1-M.t);c.userData.oscStrength=O,d&&(d.userData.oscStrength=O)}).start()},3e3)};setTimeout(s,n*300)}const r=8*300;setTimeout(()=>{re("Point Gravity System Online."),e.world&&(e.world.hasPointGravityOnBalls=!0)},r+3e3),setTimeout(()=>{const n=e.getObjectByName("cFanBulb"),s=e.getObjectByName("bulb"),c=e.getObjectByName("bulbLight");if(!n||!s)return;if(c){n.attach(c),c.position.set(0,0,0);const m=new l.Vector3;c.getWorldPosition(m),e.add(c.target),c.target.position.set(m.x,m.y-10,m.z)}const u=new l.Vector3;s.getWorldPosition(u);const d=new l.Vector3;n.getWorldPosition(d),s.scale.x,new x.Tween(s.scale).to({x:.1,y:.1,z:.9},2e3).easing(x.Easing.Cubic.In).start(),new x.Tween(s.position).to(d,2e3).easing(x.Easing.Cubic.In).start().onComplete(()=>{s.visible=!1,Be&&Be.uniforms&&Be.uniforms.glowIntensity&&new x.Tween(Be.uniforms.glowIntensity).to({value:1},500).easing(x.Easing.Quadratic.Out).start(),Be&&Be.uniforms&&Be.uniforms.glowPower&&new x.Tween(Be.uniforms.glowPower).to({value:.015},500).easing(x.Easing.Quadratic.Out).start(),re("Power transferred to ceiling array."),new x.Tween(s.scale).to({x:.1,y:.1,z:.1},500).easing(x.Easing.Quadratic.Out).onComplete(()=>{s.visible=!1}).start()}).start()},r)},100)}function Eu(e,t={}){const{duration:o=2e3,delay:i=0,onComplete:a}=t;let r=new l.Object3D;r.name="testObj",e.add(r);const n=e.getObjectByName("mjolnir_low_mjolnir_hammer_0");if(!n.isFlying)if(n.isFlying=!0,n&&n.rapierBody){re("Boomerang Mjolnir initiated");const s=n.userData.originalPos,c=n.userData.originalRot;if(!s||!c){console.error("Mjolnir missing userData.originalPos/Rot");return}const u=new l.Vector3(-1.5,9,7.3),d=new l.Vector3(-20,15,30);n.rapierBody.setBodyType(fe.RigidBodyType.KinematicPositionBased),n.rapierBody.isManualControl=!0,n.rapierBody.wakeUp(),n.rapierBody.setTranslation(d,!0);const m=new l.Quaternion(0,0,0,1),f=new l.Quaternion().setFromAxisAngle(new l.Vector3(0,0,1),Math.PI/2);m.multiply(f),n.rapierBody.setRotation(m,!0);const g=new l.Vector3(7,6,8),w=new l.Vector3(12,4,0);let y=e.getObjectByName("drone");const S=new l.Vector3(y.position.x,y.position.y,y.position.z),T=new l.CatmullRomCurve3([d,g,w,S,u],!1,"centripetal");let M=null;n.rapierBody.numColliders()>0&&(M=n.rapierBody.collider(0),M.setSensor(!0)),n.userData.hitDrone=!1;const O={val:0};new x.Tween(O).to({val:1},o).easing(x.Easing.Cubic.Out).delay(i).onUpdate(()=>{if(e._spawnStopSignal){O.val=1,n.isFlying=!1;return}const _=T.getPoint(O.val);n.rapierBody.setNextKinematicTranslation({x:_.x,y:_.y,z:_.z});const v=O.val*Math.PI*30,P=new l.Vector3(0,1,0),A=new l.Quaternion().setFromAxisAngle(P,v),F=m.clone().multiply(A);if(n.rapierBody.setNextKinematicRotation(F),y&&y.rapierBody&&!n.userData.hitDrone&&T.getPoint(O.val).distanceTo(y.position)<3){const G=y.quaternion.clone(),V=al.clone();re(Z(se.currentMode===Te.POBA?"SYS_DRONE_SUBTITLES_POBA":"SYS_DRONE_SUBTITLES_DEV")),y.rapierBody.setBodyType(fe.RigidBodyType.Dynamic),y.rapierBody.wakeUp(),y.rapierBody.applyImpulse({x:-100,y:75,z:-100},!0),y.rapierBody.applyTorqueImpulse({x:5,y:5,z:5},!0),n.userData.hitDrone=!0,setTimeout(()=>{if(e._spawnStopSignal)return;re(Z(se.currentMode===Te.POBA?"SYS_DRONE_SUBTITLES_POBA":"SYS_DRONE_SUBTITLES_DEV")),y.rapierBody.setBodyType(fe.RigidBodyType.KinematicPositionBased);const h=y.position.clone(),b=y.quaternion.clone(),p={val:0};new x.Tween(p).to({val:1},2e3).easing(x.Easing.Back.Out).onUpdate(()=>{const R=new l.Vector3().lerpVectors(h,V,p.val),C=b.clone().slerp(G,p.val);y.rapierBody.setNextKinematicTranslation(R),y.rapierBody.setNextKinematicRotation(C)}).onComplete(async()=>{if(e._spawnStopSignal)return;y.rapierBody.setGravityScale(0),y.rapierBody.setLinvel({x:0,y:0,z:0},!0),y.rapierBody.setAngvel({x:0,y:0,z:0},!0),y.rapierBody.setBodyType(fe.RigidBodyType.Fixed);const R=se.currentMode===Te.POBA?"SYS_DRONE_SUBTITLES_POBA":"SYS_DRONE_SUBTITLES_DEV";re(Z(R)),Ms(e),await Iu(e,"welcome",{scale:1.65,duration:2500,isAsync:!0}),await Fe(5500),!e._spawnStopSignal&&(Xi(Z(R)),e.cursorInformer&&e.cursorInformer.switchToOpacityMode&&e.cursorInformer.switchToOpacityMode())}).start()},2e3)}}).onComplete(()=>{re("Mjolnir Returned."),n.rapierBody.setBodyType(fe.RigidBodyType.Dynamic),n.rapierBody.isManualControl=!1,n.userData.originalPos=n.position.clone(),n.userData.originalRot=new l.Euler().setFromQuaternion(n.quaternion),M&&M.setSensor(!1),n.userData.hitDrone=!1,n.rapierBody.wakeUp(),n.isFlying=!1,a&&a()}).start()}else console.warn("Mjolnir mesh or rapierBody not found")}function Cu(e,t="drone-beam",o=null){const i=new l.Group;i.name=t;const a=o||de.ELECTRIC_CYAN||65535,r=(n,s,c,u)=>{const d=new l.CylinderGeometry(c,c,1,8,1,!0);d.rotateX(Math.PI/2),d.translate(0,0,.5);const m=new l.MeshBasicMaterial({color:s,transparent:!0,opacity:u,blending:l.AdditiveBlending,depthWrite:!1,side:l.DoubleSide}),f=new l.Mesh(d,m);return f.name=n,f};return i.add(r("beam-core",16777215,.005,1)),i.add(r("beam-glow",a,.015,.6)),i.add(r("beam-outer",de.ACCENT_GOLD||16763904,.03,.3)),i.frustumCulled=!1,e.add(i),i}function ka(e,t,o=null,i=null){const a=new l.Group;a.position.copy(t),e.add(a);const r=new l.Group;o&&r.lookAt(o),a.add(r);const n=new l.IcosahedronGeometry(.1,0),s=[],c=35,u=i||[16777215,65535,35071,52479];for(let O=0;O<c;O++){const _=u[O%u.length],v=io(_,1.2,2.5),P=new l.Mesh(n,v),A=_t(_,1,.01,4,l.FrontSide),F=new l.Mesh(n,A);F.scale.setScalar(1.35),P.add(F);const G=Math.random()*Math.PI*2,V=Math.random()*(Math.PI*.4),h=new l.Vector3(Math.sin(V)*Math.cos(G),Math.sin(V)*Math.sin(G),Math.cos(V)).multiplyScalar(.08+Math.random()*.12);P.userData.velocity=h,P.lookAt(h.clone().add(P.position)),P.scale.setScalar(.1+Math.random()*.5),r.add(P),s.push(P)}const d=new l.TorusGeometry(1,.015,8,32),m=_t(u[1]||u[0],2,.01,4,l.DoubleSide),f=new l.Mesh(d,m);f.rotation.x=Math.PI/2,a.add(f);const g=u[0]||16777215,w=_t(g,1.5,.01,4,l.DoubleSide),y=new l.Mesh(d,w);y.rotation.x=Math.PI/2,y.scale.setScalar(.5),a.add(y);const S=new l.SphereGeometry(.4,16,16),T=io(g,1,4),M=new l.Mesh(S,T);a.add(M),new x.Tween({progress:0}).to({progress:1},1e3).easing(x.Easing.Quadratic.Out).onUpdate(O=>{const _=O.progress;s.forEach(F=>{F.position.add(F.userData.velocity);const G=1-_,V=1+_*4;F.scale.set((.3+Math.random()*.4)*G,(.3+Math.random()*.4)*G,(.4+Math.random()*.6)*G*V),F.material.uniforms&&(F.material.uniforms.glowIntensity.value=2.5*G);const h=F.children[0];h&&h.material.uniforms&&(h.material.uniforms.outerGlowStrength.value=1*G)});const v=.1+_*3.5;f.scale.set(v,v,1),f.material.uniforms.outerGlowStrength.value=2*(1-_);const P=.1+_*4.5;y.scale.set(P,P,1),y.material.uniforms.outerGlowStrength.value=1*(1-_);const A=Math.min(_*4,1)<.5?_*8:(1-_)*1.5;M.scale.setScalar(A),M.material.uniforms&&(M.material.uniforms.glowIntensity.value=2.5*(1-_))}).onComplete(()=>{e.remove(a),n.dispose(),d.dispose(),S.dispose(),s.forEach(O=>{O.material.dispose(),O.children[0]&&O.children[0].material.dispose()}),f.material.dispose(),y.material.dispose(),T.dispose()}).start()}function Vt(e,t,o=!1,i=!1){const a=Re(e,"drone");if(!a||!e.gazeFollower)return;o&&(e.gazeFollower.isLocked=!0);let r=t;t instanceof l.Vector3&&(a.userData.gazeProxy||(a.userData.gazeProxy=new l.Object3D),a.userData.gazeProxy.position.copy(t),r=a.userData.gazeProxy),r&&(o&&(a.userData.lockTarget=r),e.gazeFollower.lookAtTarget(r,i))}function He(e,t,o="",i=null,a="drone-beam",r=!1,n=null,s=!1,c=null,u=!1){let d=Re(e,"drone");const m=d?d.getObjectByName("Sphere001_0"):null;if(!m)return;let f=Re(e,a);f||(f=Cu(e,a,n)),f.activeRequestID&&cancelAnimationFrame(f.activeRequestID);const g=e.camera,w=new l.Vector3,y=new l.Vector3,S=i!==null,T=c===1/0;let M;if(T)M=1/0;else if(c!==null)M=c;else{const A=S?400:1e3,F=S?600:3e3;M=S?500:Math.min(Math.max(o.length*50,A),F)}const O=performance.now();f.visible=!1;const _=A=>{f.children.forEach((F,G)=>{const V=G===0?1:G===1?.7:.4;F.material.opacity=A*V})},v=(A,F)=>{const G=A.distanceTo(F);f.position.copy(A),f.lookAt(F),f.children.forEach(V=>{V.scale.z=G})},P=()=>{const A=performance.now(),F=A-O,G=Math.min(F/M,1);if(G<1){let V=!1;S?(y.copy(i),V=!0):t&&t.isMesh&&(t.getWorldPosition(y),V=!0),V?(m.getWorldPosition(w),u||(v(w,y),r||Vt(e,y,!0)),f.visible=!0,S&&G<.1&&!f.hitTriggered&&!s&&(ka(e,y,w,n?[16777215,n,n]:null),f.hitTriggered=!0)):f.visible=!1;const h=.7+Math.sin(A*.08)*.3;let b;T?b=1:b=S?G<.2?G*5:1-(G-.5)*2:1-Math.pow(G,2),_(h*Math.max(0,b)),f.activeRequestID=requestAnimationFrame(P)}else f.visible=!1,_(0),f.activeRequestID=null,f.hitTriggered=!1,e.gazeFollower&&!d.userData.isHovering&&(e.gazeFollower.isLocked=!1,e.gazeFollower.lookAtTarget(g))};f.hitTriggered=!1,f.activeRequestID=requestAnimationFrame(P)}function ai(e,t=0){const o=bo[t];if(!o){console.error(`Scenario state index ${t} not found`);return}if(e.scenarioState=o,o.ui&&(o.ui.cursorInformer!==void 0&&(e.cursorInformerEnabled=o.ui.cursorInformer,e.cursorInformer&&(o.ui.cursorInformer?e.cursorInformer.show?e.cursorInformer.show():e.cursorInformer.style.display="block":e.cursorInformer.hide?e.cursorInformer.hide():e.cursorInformer.style.display="none")),o.ui.subtitle===!1&&(re(""),oo(!0)),o.ui.personaButton3D===!1&&window.boneTracker&&typeof window.boneTracker.forceReset=="function"&&window.boneTracker.forceReset()),o.environment){const i=e.domElement;i&&(o.environment.cssBackground?i.style.background=o.environment.cssBackground:o.environment.background&&(i.style.background=o.environment.background)),o.environment.sceneBackground!==void 0&&(o.environment.sceneBackground===null?e.background=null:e.background=new l.Color(o.environment.sceneBackground))}if(e.renderer){if(!e.isTransitioning){const i=(window.devicePixelRatio||1)*(o.pixelRatioScale!==void 0?o.pixelRatioScale:1);e.renderer.setPixelRatio(i),e.points&&typeof e.points.onWindowResize=="function"&&e.points.onWindowResize()}o.toneMappingExposure!==void 0&&(e.renderer.toneMappingExposure=o.toneMappingExposure)}if(e.HUD&&e.HUD.material.uniforms&&o.hudUniforms){const a=x.Easing.Quadratic.Out;for(const[r,n]of Object.entries(o.hudUniforms)){const s=e.HUD.material.uniforms[r];s&&(s._currentTween&&s._currentTween.stop(),n&&n.isColor?s._currentTween=new x.Tween(s.value).to({r:n.r,g:n.g,b:n.b},3e3).easing(a).start():typeof n=="number"?s._currentTween=new x.Tween(s).to({value:n},3e3).easing(a).start():s.value=n)}}}function Iu(e,t="welcome",o={}){const{scale:i=null,rotation:a=null,position:r=null,duration:n=2e3,isAsync:s=!1,scanline:c=1}=o,u=e.globalUniformsHub&&e.globalUniformsHub.uniforms||e.constantUniform;if(!u||!u.uWelcomeProgress){console.warn("Welcome Text uniforms not found on scene");return}i!==null&&u.uWelcomeScale&&(u.uWelcomeScale.value=i),a!==null&&u.uWelcomeRotation&&(u.uWelcomeRotation.value=a),r!==null&&u.uWelcomePosition&&(r instanceof l.Vector2?u.uWelcomePosition.value.copy(r):r.x!==void 0&&r.y!==void 0&&u.uWelcomePosition.value.set(r.x,r.y)),u.uWelcomeScanline&&(u.uWelcomeScanline.value=c),u.uWelcomeOpacity&&(u.uWelcomeOpacity.value=1),u.uWelcomeGlow&&(u.uWelcomeGlow.value=0),u.uWelcomeProgress&&(u.uWelcomeProgress.value=0);const d=new x.Tween(u.uWelcomeProgress).to({value:1},n).easing(x.Easing.Linear.None),m=new x.Tween(u.uWelcomeGlow).to({value:5.2},500).repeat(3).yoyo(!0).easing(x.Easing.Quadratic.InOut),f=new x.Tween(u.uWelcomeOpacity).to({value:0},1e3).delay(4e3).easing(x.Easing.Quadratic.In).onComplete(()=>{u.uWelcomeProgress.value=0,u.uWelcomeGlow.value=0});return d.chain(m),m.chain(f),d.start(),s?new Promise(g=>d.onComplete(g)):d}async function Ua(e,t=800){const o=e.isLowPowerMode,i=o?t*.6:t;Bn(e),e._spawnStopSignal=!1,e._assembleCount===void 0&&(e._assembleCount=0),e._assembleCount++,e.renderer&&(e.renderer.shadowMap&&(e.renderer.shadowMap.autoUpdate=!1),js(e)),e.isTransitioning=!0,e.raycasterEnabled=!1,e.world&&(e.world.isActive=!1),ol(e),e._assembleCount<=1?(PerformanceLogger.start("Tween Blackhole"),gr(e,i),PerformanceLogger.end("Tween Blackhole")):setTimeout(()=>{gr(e,i)},400),e.HUD&&typeof e.HUD.tweenGardenMode=="function"&&e.HUD.tweenGardenMode(!0,i),PerformanceLogger.start("Tween Remaining Objects"),await lu(e,i),PerformanceLogger.end("Tween Remaining Objects"),e.points&&e.points.bloomPass&&new x.Tween(e.points.bloomPass).to({strength:o?.8:1,threshold:.21,radius:.4},i).easing(x.Easing.Cubic.Out).start(),e.HUD&&e.HUD.material.uniforms.uIsGardenFlower&&(e.HUD.material.uniforms.uIsGardenFlower.value=1),e.renderer&&(e.renderer.toneMappingExposure=.25),e.points&&e.points.bloomPass&&(e.points.bloomPass.threshold=.21,e.points.bloomPass.strength=1),e.background=new l.Color(0),await Fe(200),Tu(e),setTimeout(async()=>{await su(e,.2,.625,800),e.isTransitioning=!1,await Fe(4e3),e.windowLight&&(e.windowLight.intensity=1e7,await Fe(40),e.windowLight.intensity=0)},800),re(Z("ENV_ATMOS_INIT")),xu(e,Un*.6),PerformanceLogger.start("Sync Bodies"),e.rapierWorldWrapper&&e.rapierWorldWrapper.syncBodiesToMeshes&&e.rapierWorldWrapper.syncBodiesToMeshes(),PerformanceLogger.end("Sync Bodies"),re(Z("SYS_PHYSICS_INIT")),re(Z("SYS_DRONE_START")),gu(e,{duration:o?2e3:3e3,delay:o?1500:2500,onStart:()=>{},onComplete:()=>{Eu(e,{duration:o?2e3:4e3,onComplete:()=>{Ra(e);let r=e.getObjectByName("wallArea");r&&r.material&&r.material.uniforms&&r.material.uniforms.uEyeActive&&(r.material.uniforms.uEyeActive.value=!0,Ro(e),setTimeout(()=>{r&&r.material&&r.material.uniforms&&Mo(e)},3e3)),e.HUD&&typeof e.HUD.runTweenShowIsland=="function"&&e.HUD.runTweenShowIsland(o?2500:3e3),_o.onRoomAssemble(e),window.cvReset&&window.cvReset(1500),e.HUD&&typeof e.HUD.runTweenShowDecos=="function"&&e.HUD.runTweenShowDecos()}});const a=e.getObjectByName("planeSky");a&&(a.visible=!0),setTimeout(()=>{Da(e,{forcedX:.65,environmentRatio:1,delay:0})},600)}}),await Fe(o?1e3:2e3),e.renderer&&setTimeout(()=>{},500),setTimeout(()=>{e.raycasterEnabled=!0,e.targetAnimHz=51},o?5500:9e3),e.globalUniformsHub.enableLightning.value=!0,e.renderer&&(window.devicePixelRatio||1)*(bo[1].pixelRatioScale||.625)}async function Ru(e,t=1500){_s(e),Js(e),e._spawnStopSignal=!0,re(""),oo(!0),e.gazeFollower&&typeof e.gazeFollower.stop=="function"&&e.gazeFollower.stop(),e.world&&(e.world.isActive=!1,e.world.hasPointGravityOnBalls=!1),e.windowLight&&(e.windowLight.intensity=0),window.boneTracker&&typeof window.boneTracker.forceReset=="function"&&window.boneTracker.forceReset(),Mu(e,t),ai(e,0),e.renderer,e.pointsApp&&(e.pointsApp.points.visible=!0)}function Mu(e,t=1500){const o=e.getObjectByName("roomGLBModel");if(!o)return;const i=Array.from(o.children),a=i.length,r=20;let n=0;const s=()=>{const c=Math.min(n+r,a);for(let u=n;u<c;u++){const d=i[u];if(d.userData.scenarioTween&&(d.userData.scenarioTween.stop(),d.userData.scenarioTween=null),d.userData.originalPos){const m=t+Math.random()*500;new x.Tween(d.position).to({x:d.userData.hidePos?.x||0,y:d.userData.hidePos?.y||-ao,z:d.userData.hidePos?.z||0},m).easing(x.Easing.Cubic.In).onComplete(()=>{d.visible=!1}).start()}else d.visible=!1}n=c,n<a&&requestAnimationFrame(s)};requestAnimationFrame(s),new x.Tween(o.scale).to({x:0,y:0,z:0},t).easing(x.Easing.Cubic.In).onComplete(()=>{o.visible=!1}).start(),["rightWall-cover","a-char","stool","floor","planeSky"].forEach(c=>{const u=e.getObjectByName(c);if(u){const d=u.userData.hidePos||{x:0,y:-ao,z:0};new x.Tween(u.position).to(d,t).easing(x.Easing.Cubic.In).onComplete(()=>{u.visible=!1}).start(),new x.Tween(u.scale).to({x:0,y:0,z:0},t).easing(x.Easing.Cubic.In).start()}}),e.physicObjects&&e.physicObjects.forEach(c=>{c.userData.scenarioTween&&(c.userData.scenarioTween.stop(),c.userData.scenarioTween=null);const u=c.userData;if(u.hidePos){const d=t+Math.random()*500;c.userData.scenarioTween=new x.Tween(c.position).to({x:u.hidePos.x,y:u.hidePos.y,z:u.hidePos.z},d).easing(x.Easing.Cubic.In).onComplete(()=>{c.visible=!1,c.userData.scenarioTween=null}).start()}else c.visible=!1;c.userData.originalScale&&new x.Tween(c.scale).to({x:0,y:0,z:0},t).start()}),e.points&&e.points.bloomPass&&new x.Tween(e.points.bloomPass).to({strength:1.5,radius:.4,threshold:.85},t).easing(x.Easing.Quadratic.Out).start()}function _u(e){Ms(e),e.world.isActive=!0,Xs(e,1500,!0)}async function Fa(e,t=500){e.globalUniformsHub.enableLightning.value=!1,_s(e),window.cvReset&&window.cvReset(1500),il(e),Wc(e);const o=[];e.children.forEach(n=>{n.userData.hidePos&&(o.includes(n)||vr(n,t))});const i=e.getObjectByName("roomGLBModel");if(i&&(i.children.forEach(n=>{vr(n,t)}),new x.Tween(i.scale).to({x:0,y:0,z:0},t).easing(x.Easing.Cubic.In).onComplete(()=>{i.visible=!1}).start()),e.camera&&e.orbitControls){const n={x:61.56,y:2.97,z:30},s=new l.Vector3(0,0,0);new x.Tween(e.camera.position).to(n,t*3).easing(x.Easing.Cubic.Out).onUpdate(()=>{e.camera.lookAt(s),e.orbitControls.target.copy(s)}).start(),new x.Tween(e.orbitControls.target).to({x:0,y:0,z:0},t*3).easing(x.Easing.Cubic.Out).start()}const a=new x.Tween(e.fireflies.material.uniforms.uKamikazeScale).to({value:1},t).easing(x.Easing.Cubic.In);new x.Tween(e.fireflies.material.uniforms.uSizeFactor).to({value:0},t).easing(x.Easing.Cubic.In).chain(a).onComplete(r).start();function r(){new x.Tween(e.points.bloomPass).to({strength:1.5,threshold:.85,radius:.4},800).easing(x.Easing.Quadratic.Out),new x.Tween(e.points.bloomPass).to({strength:12,threshold:0,radius:1},400).easing(x.Easing.Quadratic.In).onComplete(()=>{Js(e),ai(e,0),e.isTransitioning=!1,e.pointsApp&&(e.pointsApp.points.visible=!0,typeof e.pointsApp.setScrollLock=="function"&&e.pointsApp.setScrollLock(!0),typeof e.pointsApp.triggerStep=="function"&&e.pointsApp.triggerStep(1,1500,!0),typeof e.HUD.tweenGardenMode=="function"&&e.HUD.tweenGardenMode(!1,1500),typeof e.HUD.runTweenShowDecos=="function"&&e.HUD.runTweenShowDecos(1500));const u=document.getElementById("board");u&&(u.style.display="",u.classList.remove("mode-room"),window.fitBoardTexts&&(window.__boardScale=1,window.__boardSubProgress=0,window.fitBoardTexts(1,0)));const d=document.querySelectorAll(".nav-modules .nav-item");d.forEach(f=>f.classList.remove("active"));const m=Array.from(d).find(f=>f.getAttribute("data-target")==="cv-header");m&&m.classList.add("active"),new x.Tween(e.points.bloomPass).to({strength:1.5,threshold:.85,radius:.5},1200).easing(x.Easing.Cubic.Out).onComplete(()=>{e.isTransitioning=!1,e.points&&e.points.bloomPass&&(e.points.bloomPass.threshold=.85,e.points.bloomPass.strength=1.5)}).start()}).start()}}function vr(e,t,o){if(e.userData.hidePos){const i=t+Math.random()*500;new x.Tween(e.position).to({x:e.userData.hidePos.x,y:e.userData.hidePos.y,z:e.userData.hidePos.z},i).easing(x.Easing.Cubic.In).onComplete(()=>{e.visible=!1,o&&o()}).start(),e.userData.hideRot&&new x.Tween(e.rotation).to({x:e.userData.hideRot.x,y:e.userData.hideRot.y,z:e.userData.hideRot.z},i).easing(x.Easing.Cubic.In).start(),e.userData.hideScale&&new x.Tween(e.scale).to({x:e.userData.hideScale.x,y:e.userData.hideScale.y,z:e.userData.hideScale.z},i).easing(x.Easing.Cubic.In).start()}}function Js(e){const t=e.getObjectByName("drone");t&&t.userData.hidePos&&(t.position.copy(t.userData.hidePos),t.visible=!1);const o=e.getObjectByName("mjolnir_low_mjolnir_hammer_0");o&&(o.userData.hidePos&&(o.position.copy(o.userData.hidePos),o.visible=!1),o.isFlying=!1),e.dragonBalls&&(e.dragonBalls.forEach(s=>{if(s.rapierBody&&e.world&&e.world.physics&&e.world.physics.removeRigidBody(s.rapierBody),s.geometry&&s.geometry.dispose(),s.material&&(Array.isArray(s.material)?s.material.forEach(c=>c.dispose()):s.material.dispose()),[e.physicObjects,e.physicsControlledObjects,e.bhTargets].forEach(c=>{if(c){const u=c.indexOf(s);u!==-1&&c.splice(u,1)}}),e.physicBodies&&s.rapierBody){const c=e.physicBodies.indexOf(s.rapierBody);c!==-1&&e.physicBodies.splice(c,1)}s.parent&&s.parent.remove(s)}),e.dragonBalls=[],e.world&&(e.world.ballBodies=[]));const i=e.getObjectByName("bulb")||e.bulb;i&&(i.visible=!1,i.traverse(s=>{s.visible=!1,s.isLight&&(s.intensity=0)}));const a=e.getObjectByName("bulbLight")||e.bulbLight;a&&(a.intensity=.001,a.distance=0,a.visible=!0);const r=e.getObjectByName("Object_120");if(r&&r.material&&r.material.uniforms){const s=r.material;s.uniforms.glowPower&&(s.uniforms.glowPower.value=0),s.uniforms.glowIntensity&&(s.uniforms.glowIntensity.value=0)}e.background=null,e._spawnStopSignal=!0,Bn(e),typeof oo=="function"&&oo(),e.conversationManager&&typeof e.conversationManager.clear=="function"&&e.conversationManager.clear(),e.children.forEach(s=>{s&&s.name&&(s.name.toLowerCase().includes("beam")||s.name.toLowerCase().includes("aura"))&&(s.visible=!1,s.activeRequestID&&(cancelAnimationFrame(s.activeRequestID),s.activeRequestID=null))});const n=e.getObjectByName("a-char");n&&n.traverse(s=>{s&&s.name&&s.name.toLowerCase().includes("beam")&&(s.visible=!1,s.activeRequestID&&(cancelAnimationFrame(s.activeRequestID),s.activeRequestID=null))}),e.targetAnimHz=30}var Un,ao,el,tl,ol,il,al,ut=J((()=>{so(),Kl(),$i(),pt(),lt(),co(),et(),En(),An(),Ki(),ct(),ji(),Ao(),ii(),Un=15e3,ao=100,el=["planeSky","blackholeScene","PointsCloud","bulb","bulbLight","a-char","stool","stool_bound","rightWall-cover","floor"],tl=e=>da(e,!0),ol=e=>da(e,!1),il=e=>da(e,!1)}));function Wo(e,t,o){const i=new l.Group;i.name=t;const a=o||65535,r=(n,s,c,u)=>{const d=new l.CylinderGeometry(s,s,1,6,1,!0);d.rotateX(Math.PI/2),d.translate(0,0,.5);const m=new l.MeshBasicMaterial({color:u,transparent:!0,opacity:c,blending:l.AdditiveBlending,depthWrite:!1,side:l.DoubleSide}),f=new l.Mesh(d,m);return f.name=n,f};return i.add(r("beam-core",.002,1,16777215)),i.add(r("beam-glow",.006,.5,a)),i.frustumCulled=!1,i}function no(e){return new l.ShaderMaterial({uniforms:{iTime:{value:0},uColor:{value:new l.Color(e)},uOpacity:{value:.15},uBrightness:{value:1}},vertexShader:`
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
        `,transparent:!0,blending:l.AdditiveBlending,depthWrite:!1,side:l.DoubleSide})}function Ei(e,t,o,i=.5){const{camera:a,renderer:r}=e;if(!a||!r)return new l.Vector3;const n=r.domElement.getBoundingClientRect();let s,c;o==="TL"?(s=t.left,c=t.top):o==="TR"?(s=t.right,c=t.top):o==="BL"?(s=t.left,c=t.bottom):o==="BR"?(s=t.right,c=t.bottom):o==="ScanTop"?(s=t.left+t.width/2,c=t.top):o==="ScanBot"&&(s=t.left+t.width/2,c=t.bottom);const u=(s-n.left)/n.width*2-1,d=-(c-n.top)/n.height*2+1,m=new l.Vector3(u,d,i);return m.unproject(a),m}function Au(e,t=2e3){const o=e.getObjectByName("drone");if(!o)return;const i=o.getObjectByName("Sphere001_0");if(!i)return;const a=document.querySelector("#stat-subtitle.active");if(!a)return;a.getBoundingClientRect();const r=de.ELECTRIC_CYAN||65535;let n;for(;n=e.getObjectByName("hologram-deployment");)n._isDead=!0,e.remove(n),n.traverse(A=>{A.geometry&&A.geometry.dispose(),A.material&&(Array.isArray(A.material)?A.material.forEach(F=>F.dispose()):A.material.dispose())});const s=new l.Group;s.name="hologram-deployment",e.add(s);const c={TL:new l.Vector3,TR:new l.Vector3,BL:new l.Vector3,BR:new l.Vector3},u=new l.Vector3;i.getWorldPosition(u);const d=no(r),m=new l.BufferGeometry,f=new Float32Array(36),g=new Float32Array([.5,1,0,0,1,0,.5,1,0,0,1,0,.5,1,0,0,1,0,.5,1,0,0,1,0]);m.setAttribute("position",new l.BufferAttribute(f,3)),m.setAttribute("uv",new l.BufferAttribute(g,2));const w=new l.Mesh(m,d);s.add(w);const y=["TL","TR","BL","BR"].map(A=>({beam:Wo(e,`pyramid-beam-${A}`,r),key:A}));y.forEach(A=>s.add(A.beam));const S=new l.BufferGeometry;S.setAttribute("position",new l.BufferAttribute(new Float32Array(9),3));const T=no(r);T.uniforms.uOpacity.value=.2;const M=new l.Mesh(S,T);s.add(M);const O=[Wo(e,"tri-beam-top",r),Wo(e,"tri-beam-bot",r)];O.forEach(A=>s.add(A)),d.uniforms.uOpacity.value=.8,new x.Tween(d.uniforms.uOpacity).to({value:.15},150).delay(100).start();let _=!0;setTimeout(()=>{s._isDead||new x.Tween(d.uniforms.uOpacity).to({value:0},800).onUpdate(()=>{const A=d.uniforms.uOpacity.value;y.forEach(F=>{F.beam.children.forEach(G=>{G.material.opacity=A*(G.name==="beam-core"?1:.5)})})}).onComplete(()=>{_=!1,y.forEach(A=>{A.beam.visible=!1}),w.visible=!1}).start()},1500);let v=!0;setTimeout(()=>{s._isDead||new x.Tween(T.uniforms.uOpacity).to({value:0},800).onUpdate(()=>{const A=T.uniforms.uOpacity.value;O.forEach(F=>{F.children.forEach(G=>{G.material.opacity=A*(G.name==="beam-core"?1:.5)})})}).onComplete(()=>{v=!1,O.forEach(A=>A.visible=!1),M.visible=!1,e.gazeFollower&&e.gazeFollower.isLocked&&(e.gazeFollower.isLocked=!1)}).start()},t+200);const P=A=>{if(!a.classList.contains("active")||s._isDead){e.gazeFollower&&e.gazeFollower.isLocked&&(e.gazeFollower.isLocked=!1),e.remove(s);return}const F=a.getBoundingClientRect();if(i.getWorldPosition(u),v){const G=a.querySelector(".scanner-line");if(G){const V=G.getBoundingClientRect(),h=Ei(e,V,"ScanTop"),b=Ei(e,V,"ScanBot"),p=S.attributes.position.array;p[0]=u.x,p[1]=u.y,p[2]=u.z,p[3]=h.x,p[4]=h.y,p[5]=h.z,p[6]=b.x,p[7]=b.y,p[8]=b.z,S.attributes.position.needsUpdate=!0,Vt(e,new l.Vector3().lerpVectors(h,b,.5),!0),O.forEach((R,C)=>{const N=C===0?h:b;R.position.copy(u),R.lookAt(N),R.children.forEach(q=>q.scale.z=u.distanceTo(N))})}}if(_){Object.keys(c).forEach(h=>c[h]=Ei(e,F,h));const G=m.attributes.position.array,V=[c.TL,c.TR,c.BR,c.BL,c.TL];for(let h=0;h<4;h++){const b=h*9;G[b]=u.x,G[b+1]=u.y,G[b+2]=u.z,G[b+3]=V[h].x,G[b+4]=V[h].y,G[b+5]=V[h].z,G[b+6]=V[h+1].x,G[b+7]=V[h+1].y,G[b+8]=V[h+1].z}m.attributes.position.needsUpdate=!0,y.forEach(h=>{const b=c[h.key];h.beam.position.copy(u),h.beam.lookAt(b),h.beam.children.forEach(p=>p.scale.z=u.distanceTo(b))})}d.uniforms.iTime.value=A/1e3,T.uniforms.iTime.value=A/1e3,requestAnimationFrame(P)};requestAnimationFrame(P)}function Ha(e){let t;for(;t=e.getObjectByName("hologram-deployment");)t._isDead=!0,e.remove(t),t.traverse(o=>{o.geometry&&o.geometry.dispose(),o.material&&(Array.isArray(o.material)?o.material.forEach(i=>i.dispose()):o.material.dispose())});e.gazeFollower&&e.gazeFollower.isLocked&&(e.gazeFollower.isLocked=!1)}function yr(e,t,o){if(!t)return;const i=o||de.ELECTRIC_CYAN||65535;Ha(e);const a=new l.Group;a.name="hologram-deployment",a.userData.targetObject=t,e.add(a);const r=new l.Vector3,n=new l.Vector3,s=no(i);s.uniforms.uOpacity.value=.2;const c=new l.BufferGeometry,u=new Float32Array(36),d=new Float32Array([.5,0,0,1,1,1,.5,0,0,1,1,1,.5,0,0,1,1,1,.5,0,0,1,1,1]);c.setAttribute("position",new l.BufferAttribute(u,3)),c.setAttribute("uv",new l.BufferAttribute(d,2));const m=new l.Mesh(c,s);a.add(m);const f=["TL","TR","BL","BR"].map(_=>({beam:Wo(e,`pyramid-beam-${_}`,i),key:_}));f.forEach(_=>a.add(_.beam));let g=null;const w=e.getObjectByName("btc_symbol"),y=e.getObjectByName("eth_symbol"),S=t.name==="aegis2"||Math.random()>.5?y:w;if(S){g=S.clone(),g.name="hologram-coin";const _=no(i);_.uniforms.uOpacity.value=.15,g.traverse(v=>{v.isMesh&&(v.material=_,v.castShadow=!1,v.receiveShadow=!1)}),g.scale.setScalar(S.scale.x*.8),a.add(g)}const T=new l.Box3,M=new l.Vector3,O=_=>{if(a._isDead||!t.parent)return;T.setFromObject(t),T.getSize(M),T.getCenter(r);const v=Math.max(M.x,M.z)*1.5;n.copy(r);const P=Math.sin(_/400)*.05,A=r.y+M.y*1.5+P,F={TL:new l.Vector3(r.x-v,A,r.z-v),TR:new l.Vector3(r.x+v,A,r.z-v),BL:new l.Vector3(r.x-v,A,r.z+v),BR:new l.Vector3(r.x+v,A,r.z+v)},G=c.attributes.position.array,V=[F.TL,F.TR,F.BR,F.BL,F.TL];for(let h=0;h<4;h++){const b=h*9;G[b]=n.x,G[b+1]=n.y,G[b+2]=n.z,G[b+3]=V[h].x,G[b+4]=V[h].y,G[b+5]=V[h].z,G[b+6]=V[h+1].x,G[b+7]=V[h+1].y,G[b+8]=V[h+1].z}c.attributes.position.needsUpdate=!0,f.forEach(h=>{const b=F[h.key];h.beam.position.copy(n),h.beam.lookAt(b),h.beam.children.forEach(p=>p.scale.z=n.distanceTo(b))}),g&&(g.position.set(r.x,r.y+M.y*.8+P*2,r.z),g.rotation.y+=.02,g.traverse(h=>{h.material&&h.material.uniforms&&(h.material.uniforms.iTime.value=_/1e3)})),s.uniforms.iTime.value=_/1e3,requestAnimationFrame(O)};requestAnimationFrame(O)}var Fn=J((()=>{ut(),et()}));function wr(){Ct=document.getElementById("stat-coords"),it=document.querySelector(".frame_story-text"),ke=document.getElementById("stat-subtitle"),Ct&&(Ct.innerText="00 FPS | 1.0 DPR | 000 DRC"),Ui=performance.now()}function Pu(e,t=1){Ci+=t;const o=performance.now(),i=o-Ui;if(e.HUD&&e.HUD.material.uniforms){const a=Math.min(1,Fo/60),r=e.HUD.material.uniforms.uIslBarProgress1.value;if(e.HUD.material.uniforms.uIslBarProgress1.value=r+(a-r)*.05,e.renderer){const n=e.renderer.getPixelRatio()/(window.devicePixelRatio||1),s=e.HUD.material.uniforms.uIslBarProgress2.value;e.HUD.material.uniforms.uIslBarProgress2.value=s+(n-s)*.05}}if(Ct&&e.renderer){const a=window.devicePixelRatio||1,r=Math.round(e.renderer.getPixelRatio()/a*100),n=(w,y)=>w>=y?"stat-optimal":w<40?"stat-critical":"stat-stable";Ct.querySelector(".stat-fps-val")||(Ct.innerHTML='<span class="stat-fps-val">FPS 00</span> | <span class="stat-dpr-val">DPR 00%</span> | <span class="stat-drc-val">DRC 000</span>');const s=Ct.querySelector(".stat-fps-val"),c=Ct.querySelector(".stat-dpr-val"),u=Ct.querySelector(".stat-drc-val"),d=`FPS ${Fo}`;s.textContent!==d&&(s.textContent=d,s.className=`stat-fps-val ${n(Fo,54)}`);const m=`DPR ${r}%`;c.textContent!==m&&(c.textContent=m,c.className=`stat-dpr-val ${n(r,90)}`);const f=e.renderer.info.render.calls,g=`DRC ${f.toString().padStart(3,"0")}`;u.textContent!==g&&(u.textContent=g,u.className=`stat-drc-val ${f<100?"stat-optimal":f>200?"stat-critical":"stat-stable"}`)}i>=1e3&&(Fo=Math.round(Ci*1e3/i),Ci=0,Ui=o)}function re(e){if(window.scene&&window.scene._spawnStopSignal){it&&(it.textContent="");return}if(it){if(it.textContent===e)return;it.textContent=e,it.style.willChange="transform, opacity";const t=it.dataset.lastHudHeight,o=window.scene&&window.scene.HUD;if(o&&o.material&&o.material.uniforms){const i=o.material.uniforms,a=i.uBNotchHRatio.value;if(t!==a.toString()){const r=i.uMarginPct.value,n=r+(1-2*r)*a;it.style.bottom="0",it.style.height=(n*100).toFixed(4)+"vh",it.dataset.lastHudHeight=a}}ma&&clearTimeout(ma),ma=setTimeout(()=>{it&&(it.textContent="")},5e3)}}function Xi(e){if(window.scene&&window.scene._spawnStopSignal){oo(!0);return}if(ke||(ke=document.getElementById("stat-subtitle")),ke){Ut&&cancelAnimationFrame(Ut),ke.classList.add("active"),ke.innerHTML='<div class="subtitle-close">×</div><span class="subtitle-text"></span><div class="scanner-line"></div>';const t=ke.querySelector(".subtitle-text"),o=ke.querySelector(".subtitle-close");o&&(o.onclick=()=>{oo(),window.dispatchEvent(new CustomEvent("subtitleClose",{detail:{manual:!0}}))});const i=Math.min(Math.max(e.length*50,1e3),3e3);ke.style.setProperty("--reveal-dur",`${i}ms`),window.scene&&Au(window.scene,i);const a="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*",r=1e3/24;let n=performance.now(),s=n;const c=u=>{if(window.scene&&window.scene._spawnStopSignal){Ut&&cancelAnimationFrame(Ut),oo(!0);return}u||(u=performance.now());const d=u-n,m=Math.min(d/i,1);if(u-s>r||m===1){s=u;const f=e.length;let g="";for(let w=0;w<f;w++){const y=e[w];y===" "||y===`
`||m*(f+5)>w?g+=y:g+=a[Math.floor(Math.random()*42)]}t.textContent=g}m<1?Ut=requestAnimationFrame(c):t.textContent=e};Ut=requestAnimationFrame(c)}}function oo(e=!1){if(Ut&&cancelAnimationFrame(Ut),ke||(ke=document.getElementById("stat-subtitle")),ke){if(ke.classList.remove("active"),e){ke.innerHTML="";return}setTimeout(()=>{ke.classList.contains("active")||(ke.innerHTML="")},650)}}var Ct,it,ke,Ui,Ci,Fo,ma,Ut,pt=J((()=>{Fn(),Ui=0,Ci=0,Fo=0})),nl,Bu=J((()=>{Wt(),nl=class{constructor(e){this.canvas=document.getElementById(e),this.gl=this.canvas.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!0}),this.gl||(console.error("WebGL2 not supported, falling back to WebGL1 (expect artifacts)"),this.gl=this.canvas.getContext("webgl")),this.uProgress=0,this.targetProgress=0,this.mouse={x:.5,y:.5},this.textures={poba:null,dev:null},this.init()}async init(){await this.loadTextures(),this.setupProgram(),this.onResize(),window.addEventListener("resize",()=>this.onResize());let e=!1;window.addEventListener("mousemove",t=>{e||(requestAnimationFrame(()=>{this.onMouseMove(t),e=!1}),e=!0)}),this.isVisible=!0,window.IntersectionObserver&&new IntersectionObserver(t=>{this.isVisible=t[0].isIntersecting},{threshold:.01}).observe(this.canvas),requestAnimationFrame(t=>this.render(t))}async loadTextures(){const e=a=>new Promise((r,n)=>{It.transcoderPath||It.setTranscoderPath("https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/basis/"),window._ktx2SupportDetected||(It.detectSupport({capabilities:{isWebGL2:!0},extensions:{has:s=>{try{return!!this.gl.getExtension(s)}catch{return!1}},get:s=>{try{return this.gl.getExtension(s)}catch{return null}}}}),window._ktx2SupportDetected=!0),It.load(a,s=>{const c=this.gl,u=c.createTexture();c.bindTexture(c.TEXTURE_2D,u),s.mipmaps.forEach((d,m)=>{c.compressedTexImage2D(c.TEXTURE_2D,m,s.format,d.width,d.height,0,d.data)}),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_S,c.CLAMP_TO_EDGE),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_T,c.CLAMP_TO_EDGE),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_MIN_FILTER,s.mipmaps.length>1?c.LINEAR_MIPMAP_LINEAR:c.LINEAR),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_MAG_FILTER,c.LINEAR),r(u)},void 0,s=>{console.error("Failed to load KTX2:",a,s),n(s)})}),t="/PFL/",o=`${t}textures/ktx2/cv-poba-nobg.ktx2`.replace("//","/"),i=`${t}textures/ktx2/cv-dev-nobg.ktx2`.replace("//","/");this.textures.poba=await e(o),this.textures.dev=await e(i)}setupProgram(){this.program=this.createProgram(`#version 300 es
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

                // 4. SILHOUETTE EDGE (8 texture samples total for optimal balance)
                float edge = 0.0;
                if (avatarCol.a > 0.001) {
                    float o = 0.015; 
                    float aDev = min(texture(uTexDev, vUv + vec2(o, 0)).a, 
                                 min(texture(uTexDev, vUv + vec2(-o, o)).a, texture(uTexDev, vUv + vec2(-o, -o)).a));
                    float aPoba = min(texture(uTexPoba, vUv + vec2(o, 0)).a, 
                                  min(texture(uTexPoba, vUv + vec2(-o, o)).a, texture(uTexPoba, vUv + vec2(-o, -o)).a));
                    
                    edge = avatarCol.a * (1.0 - mix(aDev, aPoba, sweepVal));
                }

                // 5. CIRCUIT RIM
                float baseSpeed = uTime * 0.12 + sin(uTime * 1.5) * 0.15; 
                float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
                float spark = pow(smoothstep(0.06, 0.0, abs(fract(angle / 6.2831 + baseSpeed) - 0.5)), 4.0); 
                vec3 rimGlow = (techColor * 0.6 + (techColor + vec3(0.4)) * spark * 4.0) * edge * (1.2 + spotlight);

                // 6. FINAL COMPOSITION
                fragColor = vec4(mix(bgCol, avatarCol.rgb + rimGlow + materialGlow + 0.05, avatarCol.a), 1.0);
            }
        `),this.locations={aPosition:this.gl.getAttribLocation(this.program,"aPosition"),uTime:this.gl.getUniformLocation(this.program,"uTime"),uResolution:this.gl.getUniformLocation(this.program,"uResolution"),uMouse:this.gl.getUniformLocation(this.program,"uMouse"),uProgress:this.gl.getUniformLocation(this.program,"uProgress"),uTexPoba:this.gl.getUniformLocation(this.program,"uTexPoba"),uTexDev:this.gl.getUniformLocation(this.program,"uTexDev")};const e=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,e),this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),this.gl.STATIC_DRAW)}createProgram(e,t){const o=(a,r)=>{const n=this.gl.createShader(a);return this.gl.shaderSource(n,r),this.gl.compileShader(n),this.gl.getShaderParameter(n,this.gl.COMPILE_STATUS)||console.error(this.gl.getShaderInfoLog(n)),n},i=this.gl.createProgram();return this.gl.attachShader(i,o(this.gl.VERTEX_SHADER,e)),this.gl.attachShader(i,o(this.gl.FRAGMENT_SHADER,t)),this.gl.linkProgram(i),i}onMouseMove(e){this.mouse.x=e.clientX/window.innerWidth,this.mouse.y=1-e.clientY/window.innerHeight}onResize(){this.canvas.width=this.canvas.clientWidth*window.devicePixelRatio,this.canvas.height=this.canvas.clientHeight*window.devicePixelRatio,this.gl.viewport(0,0,this.canvas.width,this.canvas.height)}render(e){if(requestAnimationFrame(o=>this.render(o)),x.update(e),!this.isVisible)return;const t=x.getAll().length>0?16.6:41.6;e-(this.lastTime||0)<t||(this.lastTime=e,this.gl.clear(this.gl.COLOR_BUFFER_BIT),this.gl.useProgram(this.program),this.gl.uniform1f(this.locations.uTime,e*.001),this.gl.uniform2f(this.locations.uResolution,this.canvas.width,this.canvas.height),this.gl.uniform4f(this.locations.uMouse,this.mouse.x,this.mouse.y,0,0),this.gl.uniform1f(this.locations.uProgress,this.uProgress),this.gl.activeTexture(this.gl.TEXTURE0),this.gl.bindTexture(this.gl.TEXTURE_2D,this.textures.poba),this.gl.uniform1i(this.locations.uTexPoba,0),this.gl.activeTexture(this.gl.TEXTURE1),this.gl.bindTexture(this.gl.TEXTURE_2D,this.textures.dev),this.gl.uniform1i(this.locations.uTexDev,1),this.gl.enableVertexAttribArray(this.locations.aPosition),this.gl.vertexAttribPointer(this.locations.aPosition,2,this.gl.FLOAT,!1,0,0),this.gl.drawArrays(this.gl.TRIANGLE_STRIP,0,4))}setProgress(e){this.uProgress=e}transitionTo(e){new x.Tween(this).to({uProgress:e},1500).easing(x.Easing.Cubic.InOut).start()}}})),Sr,se,co=J((()=>{Yl(),et(),lt(),pt(),ut(),Ao(),Bu(),Sr=class{constructor(){this.currentMode=Go,this.cvContent=document.getElementById("cv-content"),this.personaPanel=document.getElementById("protocol-selection-panel"),this.consoleEl=document.getElementById("system-console-log"),this._lastSyncedMode=null,this.elements={role:document.getElementById("cv-role"),summary:document.getElementById("cv-summary"),summaryInner:document.querySelector(".summary-content-inner"),experience:document.getElementById("cv-experience"),skills:document.getElementById("cv-skills"),modeBtns:document.querySelectorAll(".mode-btn"),summaryModeBtns:document.querySelectorAll(".mode-switch-btn"),systemTitle:document.querySelector(".title-text"),timerDisplay:document.getElementById("selection-timer"),dontAskCheckbox:document.getElementById("dont-ask-persona"),avatarCubeWrapper:document.querySelector(".avatar-cube-container"),avatarImgFront:document.getElementById("cv-avatar-img-front"),avatarImgBack:document.getElementById("cv-avatar-img-back"),contactsGroup:document.querySelector(".contact-links-group"),portfolioTitle:document.getElementById("portfolio-title")},this.cachedSections=[],this.timerInterval=null,this.selectionPromiseResolver=null,this.pointsApp=null,this.summaryMode="scan",this.avatarEngine=new nl("avatar-canvas"),this.init()}togglePersonaPanel(){if(!this.personaPanel&&(this.personaPanel=document.getElementById("protocol-selection-panel"),!this.personaPanel))return;const e=window.getComputedStyle(this.personaPanel).display==="none",t=document.getElementById("persona-switch-btn");if(e){if(t){const o=t.getBoundingClientRect(),i=o.left+o.width/2,a=o.top+o.height/2;this.personaPanel.style.transformOrigin=`${i}px ${a}px`}this.personaPanel.style.display="flex",this.personaPanel.classList.add("minimizing"),this.personaPanel.offsetHeight,this.personaPanel.classList.remove("minimizing"),this.startTimer(),window.scene&&(window.scene.isPersonaActive=!0)}else{if(t){const o=t.getBoundingClientRect(),i=o.left+o.width/2,a=o.top+o.height/2;this.personaPanel.style.transformOrigin=`${i}px ${a}px`}this.stopTimer(),this.personaPanel.classList.add("minimizing"),this.personaPanel.classList.contains("minimizing")&&(setTimeout(()=>{this.selectionPromiseResolver&&(this.selectionPromiseResolver(this.currentMode),this.selectionPromiseResolver=null)},300),setTimeout(async()=>{if(this.personaPanel.style.display="none",window.scene&&(window.scene.isPersonaActive=!1),window.uiAnims&&window.uiAnims.triggerSpring&&window.uiAnims.triggerSpring(t),this.pointsApp&&typeof this.pointsApp.triggerEnergeticScrollJump=="function"){const o=typeof this.pointsApp.getCurrentStep=="function"?this.pointsApp.getCurrentStep():0;(o===0||o===1)&&this.pointsApp.triggerEnergeticScrollJump()}this.pointsApp&&typeof this.pointsApp.syncPersona=="function"&&this._lastSyncedMode!==this.currentMode&&(this.pointsApp.syncPersona(this.currentMode),this._lastSyncedMode=this.currentMode)},600))}}startTimer(){if(this.elements.timerBar||(this.elements.timerBar=document.getElementById("selection-timer-bar")),this.elements.timerNumber||(this.elements.timerNumber=document.getElementById("timer-number")),!this.elements.timerBar)return;this.elements.timerBar.style.transition="none",this.elements.timerBar.style.width="100%",this.elements.timerNumber&&(this.elements.timerNumber.innerText="10"),this.elements.timerBar.offsetWidth,this.elements.timerBar.style.transition="width 27s linear",this.elements.timerBar.style.width="0%",this.stopTimer();let e=27;this.countInterval=setInterval(()=>{e--,e>=0&&this.elements.timerNumber&&(this.elements.timerNumber.innerText=e)},1e3),this.timerInterval=setTimeout(()=>{this.stopTimer(),this.setPersona(this.currentMode)},27e3)}stopTimer(){this.timerInterval&&(clearTimeout(this.timerInterval),this.timerInterval=null),this.countInterval&&(clearInterval(this.countInterval),this.countInterval=null)}setPointsApp(e){this.pointsApp=e,this.currentMode&&typeof e.syncPersona=="function"&&(e.syncPersona(this.currentMode),this._lastSyncedMode=this.currentMode),this.syncUniform(this.currentMode)}async requestPersonaSelection(){return localStorage.getItem("persona-skip-auto")==="true"||this._modeFromUrl?this.currentMode:(this.togglePersonaPanel(),new Promise(e=>{this.selectionPromiseResolver=e}))}setPersona(e,t={}){this.stopTimer(),Ht[e]&&(this.applyMode(e,!1,t.skipPointsSync),this.elements.dontAskCheckbox&&localStorage.setItem("persona-skip-auto",this.elements.dontAskCheckbox.checked),this.personaPanel&&this.personaPanel.style.display!=="none"&&this.togglePersonaPanel(),window.dispatchEvent(new CustomEvent("personaSelected",{detail:{mode:e}})))}init(){let e=new URLSearchParams(window.location.search).get("mode");e&&Ht[e]?(this.currentMode=e,this._modeFromUrl=!0,localStorage.setItem("cv-view-mode-v3",e)):(e=Go,this.currentMode=e,this.updateUrl(e,!0),localStorage.setItem("cv-view-mode-v3",e)),this.applyMode(this.currentMode,!0),this.syncUniform(this.currentMode),this.elements.dontAskCheckbox&&(this.elements.dontAskCheckbox.checked=localStorage.getItem("persona-skip-auto")==="true"),this.setupEventListeners()}updateUrl(e,t=!1){const o=new URL(window.location);o.searchParams.get("mode")!==e&&(o.searchParams.set("mode",e),t?window.history.replaceState({mode:e},"",o):window.history.pushState({mode:e},"",o))}setupEventListeners(){document.addEventListener("keydown",a=>{if(!(a.target.tagName==="INPUT"||a.target.tagName==="TEXTAREA")){if(a.key.toLowerCase()==="p"&&(a.preventDefault(),this.togglePersonaPanel()),a.key.toLowerCase()==="h"){a.preventDefault();const r=this.elements.portfolioTitle,n=document.querySelector(".scroll-indicator");if(r){const s=r.style.display==="none"?"block":"none";r.style.display=s,n&&(n.style.display=s)}}if(a.key.toLowerCase()==="b"){a.preventDefault();const r=document.getElementById("board");if(r){const n=r.style.display==="none";r.style.display=n?"":"none"}}}});const e=document.getElementById("cv-scroller"),t=document.querySelectorAll(".nav-item");if(e){let a=!1;const r=()=>{if(window._cvState&&window._cvState!=="idle"){a=!1;return}let n="";const s=e.scrollTop;for(let c=0;c<this.cachedSections.length;c++){const u=this.cachedSections[c];s>=u.offsetTop-120&&(n=u.id||u.getAttribute("id"))}t.forEach(c=>{c.classList.toggle("active",c.getAttribute("data-target")===n)}),s<100&&(t.forEach(c=>c.classList.remove("active")),t.length>0&&t[0].classList.add("active")),a=!1};e.addEventListener("scroll",()=>{a||(requestAnimationFrame(r),a=!0)},{passive:!0}),this.cacheScrollSections()}this.personaPanel&&this.personaPanel.addEventListener("click",a=>{a.target===this.personaPanel&&this.togglePersonaPanel()}),window.addEventListener("popstate",a=>{const r=a.state&&a.state.mode||new URLSearchParams(window.location.search).get("mode")||Go;r!==this.currentMode&&this.applyMode(r,!1)}),this.elements.summaryModeBtns&&this.elements.summaryModeBtns.forEach(a=>{a.addEventListener("click",r=>{r.stopPropagation();const n=a.getAttribute("data-summary-mode");this.summaryMode!==n&&(this.summaryMode=n,this.elements.summaryModeBtns.forEach(s=>s.classList.remove("active")),a.classList.add("active"),this.renderSummary())})});const o=document.getElementById("dismiss-3d-hint");o&&o.addEventListener("click",a=>{a.stopPropagation();const r=document.querySelector(".mobile-3d-hint");r&&r.classList.add("hidden")});const i=document.getElementById("avatar-container");i&&i.addEventListener("click",a=>{a.preventDefault();const r=this.currentMode==="dev"?"poba":"dev";this.setPersona(r)})}applyMode(e,t=!1,o=!1){const i=this.currentMode===e,a=this.pointsApp&&typeof this.pointsApp.isMorphing=="function"?this.pointsApp.isMorphing():!1;if(this.currentMode=e,localStorage.setItem("cv-view-mode-v3",e),document.querySelectorAll("[data-mode]").forEach(s=>{const c=s.getAttribute("data-mode"),u=s.querySelector(".preference-hint");c===e?(s.classList.add("active"),localStorage.getItem("cv-view-mode-v3")&&u&&(u.innerText="YOUR PREVIOUS SELECTION",u.style.display="block")):(s.classList.remove("active"),u&&(u.style.display="none"))}),i&&!a&&!t)return;if(t)this.updateDOM();else{if(this.avatarEngine){const s=this.currentMode==="dev"?1:0;this.avatarEngine.transitionTo(s)}this.cvContent?(this.cvContent.classList.add("swapping"),setTimeout(()=>{this.updateDOM(),this.cvContent.classList.remove("swapping")},300)):this.updateDOM()}if(window.dispatchEvent(new CustomEvent("audienceChanged",{detail:{mode:e}})),window.scene&&window.scene.scenarioState?.name==="room"&&!t&&!window.scene.isHeroAnimating){const s=Z(e===Te.POBA?"SYS_DRONE_SUBTITLES_POBA":"SYS_DRONE_SUBTITLES_DEV");Xi(s),He(window.scene,null,s)}this.syncUniform(e),Es(e===Te.POBA);const r=this.personaPanel&&this.personaPanel.style.display!=="none";this.pointsApp&&typeof this.pointsApp.syncPersona=="function"&&!r&&(this._lastSyncedMode!==e||a)&&(this.pointsApp.syncPersona(e,o),this._lastSyncedMode=e),t||this.updateUrl(e);const n=Ht[e];n&&n.systemTitle&&(document.title=`${n.systemTitle} | BUI QUOC HIEU Portfolio`)}syncUniform(e){if(window.scene&&window.scene.globalUniformsHub&&window.scene.globalUniformsHub.displaySystem){const t=e===Te.POBA?1:0;window.scene.globalUniformsHub.displaySystem.uIsPoba.value=t}}triggerCyberDecode(e,t,o=1500){if(!e||!t)return;e.scrambleRaf&&cancelAnimationFrame(e.scrambleRaf);const i="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*",a=1e3/24,r=t.length;let n=performance.now(),s=n;const c=u=>{u||(u=performance.now());const d=u-n,m=Math.min(d/o,1);if(u-s>a||m===1){s=u;let f="";for(let g=0;g<r;g++){const w=t[g];w===" "||w===`
`||m*(r+5)>g?f+=w:f+=i[Math.floor(Math.random()*42)]}e.innerText=f}m<1?e.scrambleRaf=requestAnimationFrame(c):e.innerText=t};e.scrambleRaf=requestAnimationFrame(c)}renderSummary(){const e=Ht[this.currentMode];if(!e||!this.elements.summaryInner)return;const t=this.summaryMode==="scan",o=t?this.currentMode==="dev"?"CREATIVE_ENGINE.sys":"STRATEGY_MAP.conf":"BIO.md";let i="",a="";t?(i=(e.summaryTags||[]).map((n,s,c)=>{const u=Array.isArray(n.val),d=s===c.length-1,m=n.comment?` <span class="code-comment" data-target-text='${n.comment.replace(/'/g,"&apos;")}'>${n.comment}</span>`:"";if(u){const f=n.val.map(g=>`<span class="code-quote">"</span><span class="code-val" data-target-text='${g.replace(/'/g,"&apos;")}'>${g}</span><span class="code-quote">"</span>`).join('<span class="code-sep">, </span>');return`
                        <div class="code-line">
                            <span class="code-key" data-target-text="${n.key}">${n.key}</span><span class="code-sep">: </span><span class="code-bracket">[</span>${f}<span class="code-bracket">]</span>${d?"":'<span class="code-sep">,</span>'}${m}
                        </div>
                    `}else return`
                        <div class="code-line">
                            <span class="code-key" data-target-text="${n.key}">${n.key}</span><span class="code-sep">: </span><span class="code-quote">"</span><span class="code-val" data-target-text='${n.val.toString().replace(/'/g,"&apos;")}'>${n.val}</span><span class="code-quote">"</span>${d?"":'<span class="code-sep">,</span>'}${m}
                        </div>
                    `}).join(""),a=`{
${(e.summaryTags||[]).map(n=>{const s=Array.isArray(n.val)?`[${n.val.map(c=>`"${c}"`).join(", ")}]`:`"${n.val}"`;return`  ${n.key}: ${s}${n.comment?`, ${n.comment}`:","}`}).join(`
`).replace(/,$/,"")}
}`):a=e.summary,this.elements.summaryInner.innerHTML=`
            <div class="summary-code-block-wrapper" style="border-radius: 0;">
                <div class="code-editor-header" style="border-radius: 0;">
                    <div class="terminal-prompt-icon">>&nbsp;${o}</div>
                    
                    <!-- SWITCHER GROUP (Left-ish) -->
                    <div class="summary-mode-switcher-inline" style="border-radius: 0;">
                        <button class="mode-switch-btn ${t?"active":""}" data-summary-mode="scan" style="border-radius: 0;">
                            <span>SCAN</span>
                        </button>
                        <button class="mode-switch-btn ${t?"":"active"}" data-summary-mode="narrative" style="border-radius: 0;">
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
                        <div class="code-body">${i}</div>
                        <span class="code-bracket">}</span>
                    `:`
                        <div class="summary-narrative">${e.summary}</div>
                    `}
                </div>
            </div>
        `,this.elements.summaryInner.querySelectorAll(".mode-switch-btn").forEach(n=>{n.addEventListener("click",s=>{s.stopPropagation();const c=n.getAttribute("data-summary-mode");this.summaryMode!==c&&(this.summaryMode=c,this.renderSummary())})});const r=this.elements.summaryInner.querySelector(".copy-code-btn");if(r&&r.addEventListener("click",n=>{n.stopPropagation(),navigator.clipboard.writeText(a).then(()=>{const s=r.querySelector(".btn-txt");if(s){const c=s.innerText;s.innerText="COPIED!",r.classList.add("copied"),setTimeout(()=>{s.innerText=c,r.classList.remove("copied")},2e3)}})}),t)this.elements.summaryInner.querySelectorAll(".code-key, .code-val").forEach((n,s)=>{const c=n.getAttribute("data-target-text");this.triggerCyberDecode(n,c,1e3+s*100)});else{const n=this.elements.summaryInner.querySelector(".summary-narrative");n&&this.triggerCyberDecode(n,e.summary,1200)}}updateDOM(){const e=Ht[this.currentMode];if(e){if(this.elements.role&&this.triggerCyberDecode(this.elements.role,e.role,Math.max(1e3,e.role.length*40)),this.elements.systemTitle&&e.systemTitle&&this.triggerCyberDecode(this.elements.systemTitle,e.systemTitle,1e3),this.renderSummary(),this.elements.experience&&(this.elements.experience.innerHTML=e.experience.map(t=>`
                <div class="role-block">
                    <div class="role-header">
                        <div class="company-wrapper">
                            <span class="company">${t.company}</span>
                            ${t.companyDesc?`
                                <div class="company-info-trigger">
                                    <svg class="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="16" x2="12" y2="12"></line>
                                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                    </svg>
                                </div>
                            `:""}
                        </div>
                        <div class="role-collapse-hint">
                            <span class="hint-text">CLICK TO COLLAPSE</span>
                            <svg class="chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                    </div>
                    ${t.companyDesc?`<div class="company-context">${t.companyDesc}</div>`:""}
                    <div class="title-row">
                        <span class="job-title">${t.title}</span>
                        <span class="date">${t.date}</span>
                    </div>
                    <ul>
                        ${t.points.map(o=>`<li>${o}</li>`).join("")}
                    </ul>
                </div>
            `).join(""),this.rebindCollapsibles()),this.pointsApp&&typeof this.pointsApp.refreshUIPersonaSync=="function")this.pointsApp.refreshUIPersonaSync();else if(this.elements.portfolioTitle){const t=this.pointsApp&&typeof this.pointsApp.getCurrentStep=="function"?this.pointsApp.getCurrentStep():0,o=this.currentMode.toUpperCase(),i=this.elements.portfolioTitle.querySelector(".title-prefix"),a=this.elements.portfolioTitle.querySelector(".title-header");i&&(i.innerText=Z(`NARR_STEP_0_PREFIX_${o}`)),a&&(a.innerText=Z(`NARR_STEP_0_HEADER_${o}`));const r=this.elements.portfolioTitle.querySelector(".title-verb"),n=this.elements.portfolioTitle.querySelector(".title-outcome"),s=this.elements.portfolioTitle.querySelector(".title-credibility");r&&(r.innerText=Z(`NARR_STEP_0_VERB_${o}`)),n&&(n.innerText=Z(`NARR_STEP_0_OUTCOME_${o}`)),s&&(s.innerText=Z(`NARR_STEP_0_CREDIBILITY_${o}`));const c=this.elements.portfolioTitle.querySelector(".title-subtitle");c&&(c.innerText=Z(`NARR_STEP_${t}_SUBTITLE_${o}`))}if(this.elements.skills&&(this.elements.skills.classList.remove("skills-grid"),this.elements.skills.innerHTML=e.skills.map(t=>`
                <div class="role-block skill-block-entry" data-star-indices="${(t.starIndices||[]).join(",")}">
                    <div class="role-header">
                        <span class="company">${t.category}</span>
                    </div>
                    <ul>
                        <li>${t.val}</li>
                    </ul>
                </div>
            `).join(""),this.rebindSkillInteractions()),this.elements.contactsGroup&&e.contacts){const t={gmail:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',linkedin:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>',phone:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',website:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>'};this.elements.contactsGroup.innerHTML=e.contacts.map(o=>`
                <button 
                    class="contact-btn-tiny" 
                    data-id="${o.id}"
                    data-label="${o.label}"
                    data-platform="${o.platform}"
                    data-url="${o.url}"
                    aria-label="${o.label}"
                >
                    ${t[o.id]||""}
                </button>
            `).join("")}this.elements.avatarImgFront&&!this.elements.avatarCubeWrapper.classList.contains("swapping-avatar")?this.elements.avatarImgFront.src=e.cvAvatarURL:this.elements.avatarImgBack&&(this.elements.avatarImgBack.src=e.cvAvatarURL),this.cacheScrollSections()}}cacheScrollSections(){this.cachedSections=Array.from(document.querySelectorAll(".section-anchor, .collapsible-header"))}rebindCollapsibles(){this.elements.experience.querySelectorAll(".role-block").forEach(e=>{e.dataset.roleBound||(e.dataset.roleBound="true",e.addEventListener("click",t=>{if(t.target.tagName==="A"||t.target.closest("a"))return;t.stopPropagation();const o=e.classList.toggle("collapsed"),i=e.querySelector(".hint-text");i&&(i.textContent=o?"CLICK TO EXPAND":"CLICK TO COLLAPSE"),this.cacheScrollSections()}))})}rebindSkillInteractions(){const e=this.elements.skills;e&&e.querySelectorAll(".skill-block-entry").forEach(t=>{const o=t.getAttribute("data-star-indices");if(!o)return;const i=o.split(",").map(n=>parseInt(n.trim())).filter(n=>!isNaN(n)&&n!==-1);if(i.length===0)return;const a=()=>{this.pointsApp&&typeof this.pointsApp.setConstellationVisibility=="function"&&(this.pointsApp.setConstellationVisibility(!0),i.forEach(n=>{typeof this.pointsApp.triggerStarPulse=="function"&&this.pointsApp.triggerStarPulse(n)}))},r=()=>{this.pointsApp&&typeof this.pointsApp.setConstellationVisibility=="function"&&this.pointsApp.setConstellationVisibility(!1)};t.addEventListener("mouseenter",a),t.addEventListener("mouseleave",r),t.addEventListener("click",a)})}highlightSkillByCategory(e){if(!this.elements.skills)return;const t=this.elements.skills.querySelectorAll(".skill-block-entry");if(t.forEach(i=>i.classList.remove("active-gold-glow")),!e)return;const o=Array.from(t).find(i=>{const a=i.querySelector(".company");return a&&a.textContent.trim().toUpperCase()===e.toUpperCase()});o&&o.classList.add("active-gold-glow")}logMessage(e){this.consoleEl&&(this.consoleEl.innerHTML=`<span class="console-cursor">></span> ${e}`,this.consoleEl.style.opacity="1",setTimeout(()=>this.consoleEl.style.opacity="0.7",100),setTimeout(()=>this.consoleEl.style.opacity="1",200))}updatePictureTag(e,t){if(!e)return;const o=t.replace(".webp",".png");e.src=o;const i=e.parentElement,a=i.tagName==="PICTURE"?i:i.parentElement&&i.parentElement.tagName==="PICTURE"?i.parentElement:null;a&&a.querySelectorAll("source").forEach(r=>{r.getAttribute("type")==="image/webp"?r.srcset=t:r.srcset=o})}},se=new Sr}));function Ou(e={}){const t=e.domElement||void 0,o=e.fogEnabled||!1,i=e.alpha||!1,a=e.useBackdrop||!1;let r,n;const s=t||document.body;if(t){const S=t.getBoundingClientRect();r=S.width,n=S.height,getComputedStyle(s).position==="static"&&(s.style.position="relative")}else r=window.innerWidth,n=window.innerHeight;let c=r,u=n;const d=document.createElement("div");d.id="threeJsContainer",d.style.cssText=`
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        right: 0;
        overflow: hidden;
        background: transparent;
    `;let m=null;a&&(m=document.createElement("div"),m.id="threeJsBackdrop",m.className="three-js-backdrop",d.appendChild(m)),s.appendChild(d);const f=new l.PerspectiveCamera(50,c/u,2,800);f.name="camera";const g=new l.Scene;g.name="scene",g.width=c,g.height=u,o&&(g.fog=new l.Fog(0,2,500));const w=new l.WebGLRenderer({antialias:!0,powerPreference:"high-performance",stencil:!1,alpha:i||a});w.name="renderer",w.shadowMap.enabled=!0,w.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),w.setSize(c,u),d.appendChild(w.domElement);function y(){let S,T;if(t){const _=t.getBoundingClientRect();S=_.width,T=_.height}else S=window.innerWidth,T=window.innerHeight;const M=S,O=T;d.style.width=M+"px",d.style.height=O+"px",M>0&&O>0&&(f.aspect=M/O,f.updateProjectionMatrix(),w.setSize(M,O),w.render(g,f)),g.width=M,g.height=O}return window.addEventListener("resize",y),g.domElement=d,g.backdropLayer=m,g.renderer=w,g.camera=f,g.add(f),[g,f,w]}var Du=J((()=>{})),Nu=J((()=>{})),Lu=J((()=>{})),ku=J((()=>{})),ro,Hn=J((()=>{ro={GARDEN:{HOVER_START:"garden-hover-start",HOVER_END:"garden-hover-end"}}}));function Uu(e){const t=e.camera,o=new l.PlaneGeometry(1,1);K.DUR_FILL+K.DUR_HOLD+K.DUR_WIPE+K.DUR_PAUSE;const i=()=>{const h=document.documentElement,b=window.innerHeight,p=b*(K.MARGIN_PCT+a.uVerticalMarginPct.value),R=(b-2*p)*(K.ISL_BAR_MARGIN_Y_RATIO*2+2*K.ISL_BAR_HEIGHT_RATIO+1*K.ISL_BAR_GAP_RATIO),C=((a.uCutSize.value||10)+R-K.CORNER_RADIUS)/b*100,N=p/b*100;n.islandHeightVh=C,n.islandTopVh=N,h.style.setProperty("--hud-island-height-vh",`${C}vh`),h.style.setProperty("--hud-island-top-vh",`${N}vh`),h.style.setProperty("--hud-island-bottom-vh",`${N+C}vh`);const q=`${K.MARGIN_PCT*100}vh`;h.style.setProperty("--hud-margin-visible",q),h.style.setProperty("--hud-text-nudge","0.1vh")};window.addEventListener("resize",i);const a={...e.globalUniformsHub.uniforms,uPosStart:{value:new l.Vector2},uPosHead:{value:new l.Vector2},uDiamondRot:{value:new l.Vector2(1,0)},uSpriteSheet:{value:oe.spriteSheet},uMarginPct:{value:K.MARGIN_PCT},uVerticalMarginPct:{value:K.VERTICAL_MARGIN_PCT},uIslToMainWRatio:{value:K.ISL_TO_MAIN_W_RATIO},uBNotchWRatio:{value:0},uBNotchHRatio:{value:0},uRNotchHRatio:{value:0},uRNotchWRatio:{value:0},uCutSize:{value:0},uIsAutoElec:{value:0},uElecStartTime:{value:0},uHeadSpriteSize:{value:K.HEAD_SPRITE_SIZE},uIslBarHeightRatio:{value:K.ISL_BAR_HEIGHT_RATIO},uIslBarGapRatio:{value:K.ISL_BAR_GAP_RATIO},uIslBarMarginLeftRatio:{value:K.ISL_BAR_MARGIN_LEFT_RATIO},uIslBarMarginRightRatio:{value:K.ISL_BAR_MARGIN_RIGHT_RATIO},uIslBarMarginYRatio:{value:K.ISL_BAR_MARGIN_Y_RATIO},uIslBarProgress1:{value:K.ISL_BAR_PROGRESS[0]},uIslBarProgress2:{value:K.ISL_BAR_PROGRESS[1]},uBorderThickRatio:{value:K.BORDER_THICK_RATIO},uGridThickness:{value:K.GRID_LINE_THICKNESS},uGridSize:{value:K.BG_GRID_SIZE},uGridPulseSpeed:{value:K.GRID_PULSE_SPEED},uGridPulseDensity:{value:K.GRID_PULSE_DENSITY},uOutsideColor:{value:new l.Color(0,0,0)},uRNotchBarProgress:{value:K.R_NOTCH_BAR_PROGRESS},uRNotchBarThickness:{value:K.R_NOTCH_BAR_THICKNESS},uRNotchBarActiveColor:{value:K.R_NOTCH_BAR_ACTIVE_COLOR.clone()},uRNotchBarInactiveColor:{value:K.R_NOTCH_BAR_INACTIVE_COLOR.clone()},uBreathIntensity:{value:0},uBreathColor:{value:de.ELECTRIC_CYAN.clone()},uBreathAutoStrength:{value:K.BREATH_AUTO_STRENGTH},uBreathManualStrength:{value:K.BREATH_MANUAL_STRENGTH},uFlyCount:{value:200},uFlySpeed:{value:1},uFlowerWind:{value:.02},uFlowerScale:{value:K.FLOWER_SCALE},uFlowerNotchPos:{value:new l.Vector2(.92,.075)},uFlowerGlow:{value:K.FLOWER_GLOW_BASE},uKnowhereGravityHoverMultiplier:{value:K.GARDEN_HOVER_GRAVITY_MULT},uFlowerColor:{value:K.FLOWER_COLOR.clone()},uFlowerRotation:{value:K.FLOWER_ROTATION},uFlowerGlitch:{value:0},uGridLock:{value:0},uRNotchVibeB:{value:0},uRNotchVibeT:{value:0},uBNotchBarProgress:{value:K.B_NOTCH_BAR_PROGRESS},uBNotchBarAlpha:{value:K.B_NOTCH_BAR_ALPHA},uBNotchBarMarginX:{value:1},uBNotchBarMarginY:{value:.45},uBNotchBarColor:{value:K.B_NOTCH_BAR_COLOR.clone()},uBeamMaxHeight:{value:0},uBeamWaveThickness:{value:K.BEAM_WAVE_THICKNESS},uBeamBaseThickness:{value:0},uBeamBloom:{value:K.BEAM_BLOOM},uBeamWobble:{value:K.BEAM_WOBBLE},uBeamGlowStrength:{value:K.BEAM_GLOW_STRENGTH},uBeamSpeed:{value:K.BEAM_SPEED},uBeamFreq:{value:K.BEAM_FREQ},uBeamTrimRatio:{value:K.BEAM_TRIM_RATIO},uBeamGrowth:{value:0},uBeamAttachRatio:{value:K.BEAM_ATTACH_RATIO},uBeamColor:{value:K.BEAM_COLOR.clone()},uRBarPos:{value:new l.Vector2(0,0)},uRBarRot:{value:0},uBBarPos:{value:new l.Vector2(0,0)},uBBarRot:{value:0},uIslBar1Pos:{value:new l.Vector2(0,0)},uIslBar1Rot:{value:0},uIslBar2Pos:{value:new l.Vector2(0,0)},uIslBar2Rot:{value:0},uNavCount:{value:K.NAV_COUNT},uNavGap:{value:K.NAV_GAP},uNavigatorVisibility:{value:K.NAVIGATOR_VISIBILITY},uNavVis:{value:new Float32Array([0,0,0,0,0,0])},uNavWH:{value:new Float32Array([1,2,2,2,0,0])},uHeadScale:{value:K.HEAD_SCALE},uIsGardenFlower:{value:K.GARDEN_IS_FLOWER},uGrokScaleFactor:{value:K.GROK_SCALE_FACTOR},uGrokOffsetY:{value:K.GROK_OFFSET_Y}},r=new l.ShaderMaterial({vertexShader:`
        varying vec2 vUv;
        void main() {
            vUv = uv;
            // Map 1x1 plane (-0.5 to 0.5) directly to clip space (-1 to 1) 
            // bypassing projection and modelView matrices for a perfectly fixed HUD.
            gl_Position = vec4(position.x * 2.0, position.y * 2.0, 0.0, 1.0);
        }
    `,fragmentShader:Fu(),transparent:!0,uniforms:a,blending:l.NormalBlending,depthTest:!1,depthWrite:!1,side:l.FrontSide}),n=new l.Mesh(o,r);n.name="HUDFrame",n.frustumCulled=!1,n.renderOrder=9999,n.isOpen=!1,e.HUD=n,i();const s=(h,b,p,R,C,N,q)=>{const $=R,L=-p,B=b-$,z=-(h-L),U=-(b-(R-C)),E=(h-(L+q))*-.7071+(b-$)*.7071,k=(h-(L+N))*.7071+(b-$)*-.7071;return Math.max(Math.max(Math.max(Math.max(B,z),U),k),E)};let c=performance.now(),u=0;const d=[new l.Vector2,new l.Vector2],m={pos:new l.Vector2(0,0),vel:new l.Vector2(0,0),rot:0,angVel:0,isActive:!1,shouldSnapToAnchor:!0,mass:1,getMOI:h=>1/12*1*Math.pow(h*2,2)},f={pos:new l.Vector2(0,0),vel:new l.Vector2(0,0),rot:0,angVel:0,isActive:!1,shouldSnapToAnchor:!0,mass:2,getMOI:(h,b)=>1/12*2*(h*h+b*b)},g={pos:new l.Vector2(0,0),vel:new l.Vector2(0,0),rot:0,angVel:0,isActive:!1,shouldSnapToAnchor:!0,mass:1.5,getMOI:(h,b)=>1/12*1.5*(h*h+b*b)},w={pos:new l.Vector2(0,0),vel:new l.Vector2(0,0),rot:0,angVel:0,isActive:!1,shouldSnapToAnchor:!0,mass:1.5,getMOI:(h,b)=>1/12*1.5*(h*h+b*b)};n.applyBeamImpulse=()=>{m.isActive=!0,m.shouldSnapToAnchor=!1;const h=e.width||window.innerWidth,b=e.height||window.innerHeight,p=b*a.uMarginPct.value,R=b*(a.uMarginPct.value+a.uVerticalMarginPct.value),C=new l.Vector2((h-p*2)*.5,(b-R*2)*.5),N=C.x*2,q=C.y*2;m.pos.lengthSq()<.001&&m.pos.set(C.x,0);const $=a.uBNotchHRatio.value,L=a.uBNotchWRatio.value,B=-C.y+q*$,z=q*$*.57735*2,U=N*L-z,E=a.uBNotchBarProgress.value,k=new l.Vector2(-U*.5+E*U,B),I=a.uRNotchHRatio.value,Y=C.y*2*I*.8*.5,H=a.uBeamAttachRatio.value,D=new l.Vector2(C.x,l.MathUtils.mapLinear(H,0,1,-Y,Y)),W=new l.Vector2().subVectors(D,k).normalize().multiplyScalar(2800),Q=new l.Vector2().subVectors(D,m.pos);m.vel.add(W.clone().divideScalar(m.mass));const j=Q.x*W.y-Q.y*W.x;m.angVel+=j/m.getMOI(Y),new x.Tween(a.uRNotchBarThickness).to({value:.002},300).easing(x.Easing.Back.Out).start(),setTimeout(()=>{g.isActive=!0,g.shouldSnapToAnchor=!1,g.vel.set(-100+Math.random()*-200,-100),g.angVel=(Math.random()-.5)*5,w.isActive=!0,w.shouldSnapToAnchor=!1,w.vel.set(-150+Math.random()*-200,-50),w.angVel=(Math.random()-.5)*5},100)},n.resetBarPhysics=()=>{m.isActive=!1,m.shouldSnapToAnchor=!0,m.pos.set(0,0),m.vel.set(0,0),m.rot=0,m.angVel=0,f.isActive=!1,f.pos.set(0,0),f.vel.set(0,0),f.rot=0,f.angVel=0,g.isActive=!1,g.pos.set(0,0),g.vel.set(0,0),g.rot=0,g.angVel=0,w.isActive=!1,w.pos.set(0,0),w.vel.set(0,0),w.rot=0,w.angVel=0};let y=performance.now();n.onBeforeRender=()=>{!a.uSpriteSheet.value&&oe.spriteSheet&&(a.uSpriteSheet.value=oe.spriteSheet);const h=performance.now(),b=Math.min(.032,(h-y)/1e3);y=h;const p=a.iTime.value,R=e.width||window.innerWidth,C=e.height||window.innerHeight,N=C*a.uMarginPct.value,q=C*(a.uMarginPct.value+a.uVerticalMarginPct.value),$=(R-N*2)*.5,L=(C-q*2)*.5;if(u++,h>c+1e3){Math.round(u*1e3/(h-c)),c=h,u=0;const Ce=R-N*2-K.CUT_SIZE*2;Ce*K.ISL_TO_MAIN_WRatio_NOT_FOUND||Ce*K.ISL_TO_MAIN_W_RATIO;const ze=C-q*2;ze*K.ISL_BAR_HEIGHT_RATIO,ze*K.ISL_BAR_GAP_RATIO,ze*K.ISL_BAR_MARGIN_Y_RATIO;const $e=ze*(K.ISL_BAR_MARGIN_Y_RATIO*2+2*K.ISL_BAR_HEIGHT_RATIO+1*K.ISL_BAR_GAP_RATIO);K.CUT_SIZE+$e-K.CORNER_RADIUS}const B=C*a.uMarginPct.value;C*(a.uMarginPct.value+a.uVerticalMarginPct.value);const z=(R-B*2)*.5;m.shouldSnapToAnchor&&m.pos.set(z,0);const U=L*2*a.uBNotchHRatio.value,E=-L+U;if(f.shouldSnapToAnchor&&f.pos.set(0,E),a.uRBarRot.value=m.rot,a.uRBarPos.value.copy(m.pos),a.uBBarRot.value=f.rot,a.uBBarPos.value.copy(f.pos),m.isActive||f.isActive||g.isActive||w.isActive){const dt=L*a.uRNotchHRatio.value*.8;if(m.isActive){m.vel.y+=-1200*b,m.pos.addScaledVector(m.vel,b),m.rot+=m.angVel*b,m.vel.multiplyScalar(.99),m.angVel*=.98;const me=-C*.5+5,Ve=R*.5-5;d[0].set(0,dt),d[1].set(0,-dt);const Pe=d;for(const We of Pe){const xt=Math.sin(m.rot),je=Math.cos(m.rot),Ot=We.x*je-We.y*xt,Yt=We.x*xt+We.y*je,mt=m.pos.x+Ot,qt=m.pos.y+Yt;if(qt<me){const Tt=me-qt;m.pos.y+=Tt,m.vel.y=Math.abs(m.vel.y)*.6,m.vel.x*=.95,m.angVel+=(mt-m.pos.x)*m.vel.y*1e-4}if(mt>Ve){const Tt=mt-Ve;m.pos.x-=Tt,m.vel.x=-Math.abs(m.vel.x)*.6,m.angVel+=(qt-m.pos.y)*-m.vel.x*1e-4}if(mt<-Ve){const Tt=-Ve-mt;m.pos.x+=Tt,m.vel.x=Math.abs(m.vel.x)*.6,m.angVel+=(qt-m.pos.y)*m.vel.x*1e-4}if(!f.isActive){const Tt=$*2;L*2;const Zi=Tt*a.uBNotchWRatio.value;Math.abs(mt)<Zi*.5&&Math.abs(qt-E)<20&&(f.isActive=!0,f.shouldSnapToAnchor=!1,f.vel.addScaledVector(m.vel,.8),f.angVel=(Math.random()-.5)*10,f.vel.y-=200,m.vel.y*=-.5,m.angVel+=(Math.random()-.5)*5)}}}if(f.isActive){f.vel.y+=-1200*b,f.pos.addScaledVector(f.vel,b),f.rot+=f.angVel*b,-C*.5-200;const me=R*.5-5;(f.pos.x>me||f.pos.x<-me)&&(f.vel.x*=-.8)}const Bt=(me,Ve)=>{if(me.isActive){me.vel.y+=-1200*b,me.pos.addScaledVector(me.vel,b),me.rot+=me.angVel*b;const Pe=-C*.5,We=R*.5;me.pos.y<Pe&&(me.pos.y=Pe,me.vel.y=Math.abs(me.vel.y)*.6,me.vel.x*=.9,me.angVel*=.9),(me.pos.x>We||me.pos.x<-We)&&(me.vel.x*=-.8)}};Bt(g,0),Bt(w,1)}const k=a.uCutSize.value,I=new l.Vector2($,L),Y=L*2,H=($*2-k*2)*a.uIslToMainWRatio.value,D=Y*a.uIslBarHeightRatio.value,W=Y*a.uIslBarGapRatio.value,Q=Y*a.uIslBarMarginLeftRatio.value,j=Y*a.uIslBarMarginRightRatio.value,ee=Y*a.uIslBarMarginYRatio.value,ae=Ce=>{const ze=I.y-k-ee-le(Ce)*(D+W)-D*.5,$e=ze-I.y;return{x:(-I.x+Q+$e+(-I.x+H+$e-j))*.5,y:ze}},le=Ce=>Ce;if(!g.isActive){const Ce=ae(0);g.pos.set(Ce.x,Ce.y),g.rot=0}if(a.uIslBar1Pos.value.copy(g.pos),a.uIslBar1Rot.value=g.rot,!w.isActive){const Ce=ae(1);w.pos.set(Ce.x,Ce.y),w.rot=0}a.uIslBar2Pos.value.copy(w.pos),a.uIslBar2Rot.value=w.rot;const ve=p*K.DIAMOND_ROT_SPEED;a.uDiamondRot.value.set(Math.cos(ve),Math.sin(ve));const Se=a.uCutSize.value,we=(R-N*2-Se*2)*a.uIslToMainWRatio.value,X=C-q,ne=N,ie=ne+we+Se+20,ue=L*2,ce=K.ISL_BAR_MARGIN_Y_RATIO,be=K.ISL_BAR_HEIGHT_RATIO,Ee=K.ISL_BAR_GAP_RATIO,Oe=K.CORNER_RADIUS,xe=Se+ue*(ce*2+2*be+1*Ee)-Oe,Ge=X-xe-20;if(e.points&&e.points.material&&e.points.material.uniforms.uMaskRect){e.points.material.uniforms.uMaskRect.value.set(ne,Ge,ie,X);const Ce=ne+we,ze=X;e.points.material.uniforms.uMaskSlant&&e.points.material.uniforms.uMaskSlant.value.set(Ce,ze);const $e=xe+K.CORNER_RADIUS,Ke=a.uNavGap?a.uNavGap.value:K.TL_GAP,St=a.uNavigatorVisibility?a.uNavigatorVisibility.value:1;let dt=0;const Bt=a.uNavVis.value,me=a.uNavWH.value;for(let je=0;je<6;je++)Bt[je]>.01&&me[je]>.01&&(dt+=$e*me[je]+Ke);dt>0&&(dt-=Ke),dt*=St;const Ve=R-N+K.CORNER_RADIUS+20,Pe=R-N+K.CORNER_RADIUS-dt-Ke,We=C-q+K.CORNER_RADIUS+20,xt=C-q+K.CORNER_RADIUS-xe-Ke;e.points.material.uniforms.uMaskRectNav&&e.points.material.uniforms.uMaskRectNav.value.set(Pe,xt,Ve,We)}const tt=L*2*a.uBNotchHRatio.value,qe=-L+tt,Pt=0,uo=qe;a.uPosStart.value.set(Pt,uo),a.uPosHead.value.set(Pt,uo);const Qi=a.uVerticalMarginPct.value,zn=a.uCutSize.value,Vn=a.uIslToMainWRatio.value,Wn=Qi>=.5,El=n._lastVMargin!==Qi||n._lastCutSize!==zn||n._lastIslW!==Vn||n._lastResX!==R||n._lastResY!==C;if(T&&El&&!Wn){const Ce=N,ze=q,$e=L*2,Ke=$e*a.uIslBarHeightRatio.value,St=$e*a.uIslBarGapRatio.value,dt=$e*a.uIslBarMarginLeftRatio.value,Bt=$e*a.uIslBarMarginYRatio.value,me=a.uCutSize.value;n._labelGroups&&n._labelGroups.forEach((Ve,Pe)=>{const We=ze+me+Bt+Pe*(Ke+St)+Ke*.5,xt=ze-We,je=Ce+dt+xt,Ot=Ke*1.6;Ve.style.height=`${Ke}px`,Ve.style.fontSize=`${Ot}px`,Ve.style.transform=`translate(${je-20}px, ${We}px) translate(-100%, -50%)`;const Yt=Ve.querySelector(".hud-label-text");if(Yt){const mt=je-Ce-25;Yt.style.maxWidth=`${mt}px`}}),n._lastVMargin=Qi,n._lastCutSize=me,n._lastIslW=Vn,n._lastResX=R,n._lastResY=C,i()}if(n._navLabelGroups&&a.uNavCount&&a.uNavCount.value>0&&!Wn){const Ce=a.uNavGap?a.uNavGap.value:K.TL_GAP,ze=L*2,$e=a.uIslBarMarginYRatio.value*2+2*a.uIslBarHeightRatio.value+1*a.uIslBarGapRatio.value,Ke=K.CORNER_RADIUS,St=zn+ze*$e+Ke,dt=q-Ke,Bt=R-N+Ke,me=St*.32;let Ve=0;n._navLabelGroups.forEach((Pe,We)=>{const xt=a.uNavVis.value[We],je=a.uNavWH.value[We],Ot=St*je,Yt=a.uNavigatorVisibility?a.uNavigatorVisibility.value:1,mt=xt>.001&&je>.001&&Yt>.001,qt=Ot*.02,Tt=Bt-Ve-Ot*.5+qt,Zi=dt+St*.5;Pe.style.left="0",Pe.style.top="0",Pe.style.width=`${Ot}px`,Pe.style.height=`${St}px`,Pe.style.fontSize=`${me}px`,Pe.style.transform=`translate(${Tt}px, ${Zi}px) translate(-50%, -50%)`,Pe.style.opacity=xt*Yt,Pe.style.display=mt?"flex":"none",mt&&(Ve+=Ot+Ce)})}};const T=(()=>{const h=document.createElement("div");h.className="hud-island-labels",h.innerHTML=`
            <div class="hud-label-group"><span class="hud-label-text">FPS</span></div>
            <div class="hud-label-group"><span class="hud-label-text">PERF</span></div>
        `,n._labelGroups=Array.from(h.querySelectorAll(".hud-label-group"));const b=document.createElement("div");b.className="hud-nav-labels";const p=`
            <button id="cv-toggle-btn" class="hud-inline-toggle" aria-label="Toggle CV Panel">
                <div class="icon-lines">
                    <span></span><span></span><span></span><span></span>
                </div>
            </button>
        `;b.innerHTML=Array(6).fill(0).map((C,N)=>`<div class="hud-nav-label-group" id="hud-nav-btn-${N}">
                <div class="hud-nav-label-content"></div>
                ${N===0?p:""}
            </div>`).join(""),n._navLabelGroups=Array.from(b.querySelectorAll(".hud-nav-label-group"));const R=["","WORK","LAB","ABOUT","",""];return n._navLabelGroups.forEach((C,N)=>{const q=C.querySelector(".hud-nav-label-content");q&&(q.textContent=R[N]||"")}),n._navLabelGroups.forEach(C=>{C.style.pointerEvents="auto",C.style.cursor="pointer",C.addEventListener("mouseenter",()=>{typeof n.breathe=="function"&&n.breathe()})}),h.style.display="none",b.style.display="none",[...n._labelGroups,...n._navLabelGroups].forEach(C=>{C.style.position="absolute",C.style.display="flex",C.style.alignItems="center",C.style.justifyContent="center"}),e.domElement&&(e.domElement.appendChild(h),e.domElement.appendChild(b)),n.navLabelsContainer=b,h})();n.labelsContainer=T,n.navButtons=Array(6).fill(0).map((h,b)=>({show:(p=600,R=2)=>{n._navTweens&&n._navTweens[b]&&n._navTweens[b].stop(),n._navTweens||(n._navTweens={}),n._navTweens[b]=new x.Tween({ratio:a.uNavWH.value[b],vis:a.uNavVis.value[b]}).to({ratio:R,vis:1},p).easing(x.Easing.Cubic.InOut).onUpdate(C=>{a.uNavWH.value[b]=C.ratio,a.uNavVis.value[b]=C.vis}).onComplete(()=>{delete n._navTweens[b]}).start()},hide:(p=600)=>{n._navTweens&&n._navTweens[b]&&n._navTweens[b].stop(),n._navTweens||(n._navTweens={}),n._navTweens[b]=new x.Tween({ratio:a.uNavWH.value[b],vis:a.uNavVis.value[b]}).to({ratio:0,vis:0},p).easing(x.Easing.Cubic.InOut).onUpdate(R=>{a.uNavWH.value[b]=R.ratio,a.uNavVis.value[b]=R.vis}).onComplete(()=>{delete n._navTweens[b],a.uNavVis.value[b]=0,a.uNavWH.value[b]=0}).start()},setText:p=>{const R=n._navLabelGroups[b].querySelector(".hud-nav-label-content");R&&(R.textContent=p)},setRatio:(p,R=0)=>{R<=0?a.uNavWH.value[b]=p:new x.Tween({val:a.uNavWH.value[b]}).to({val:p},R).easing(x.Easing.Exponential.InOut).onUpdate(C=>{a.uNavWH.value[b]=C.val}).start()},setActive:p=>{const R=n._navLabelGroups[b];R&&(p?R.classList.add("active"):R.classList.remove("active"))}}));const M=()=>{if(!t)return;const h=e.renderer,b=h?h.domElement.clientWidth:window.innerWidth,p=h?h.domElement.clientHeight:window.innerHeight;a.iResolution&&a.iResolution.value.set(b,p)};M(),requestAnimationFrame(M),t.add(n),window.addEventListener("resize",M),t.syncHUD=M;const O=new l.Raycaster,_=new l.Vector2;let v=!1,P=!1,A=!1;window.addEventListener("mousemove",h=>{const b=document.querySelector("canvas"),p=b?b.getBoundingClientRect():{left:0,top:0,width:window.innerWidth,height:window.innerHeight};_.x=(h.clientX-p.left)/p.width*2-1,_.y=-((h.clientY-p.top)/p.height)*2+1;const R=new l.Vector2(_.x*.5+.5,_.y*.5+.5);if(O.setFromCamera(_,t),n.visible&&Math.abs(_.x)<=1&&Math.abs(_.y)<=1){const C=p.width,N=p.height,q=N*a.uMarginPct.value,$=N*(a.uMarginPct.value+a.uVerticalMarginPct.value),L=new l.Vector2(C-q*2,N-$*2).multiplyScalar(.5),B=new l.Vector2(R.x*C-C*.5,R.y*N-N*.5),z=L.x*2,U=L.y*2,E=U*a.uBNotchHRatio.value,k=-L.y+E;N*.5-$+E;const I=z*a.uBNotchWRatio.value,Y=I*-.5*(1-a.uFlowerNotchPos.value.x)+I*.5*a.uFlowerNotchPos.value.x,H=-(N-$*2)*.5,D=H+E;H*(1-a.uFlowerNotchPos.value.y)+D*a.uFlowerNotchPos.value.y;const W=k,Q=-N*.5,j=(W-Q)*(C/N),ee=B.y<W&&B.y>Q,ae=Math.abs(B.x-Y)<j*.5,le=a.uCutSize.value,ve=(L.x*2-le*2)*a.uIslToMainWRatio.value,Se=le+U*(a.uIslBarMarginYRatio.value*2+2*a.uIslBarHeightRatio.value+1*a.uIslBarGapRatio.value)-K.CORNER_RADIUS;s(B.x,B.y,L.x,L.y,Se,ve,le)<5?P||(P=!0,e.orbitControls&&e.orbitControls.showEdgeUI&&e.orbitControls.showEdgeUI(),a.uIsAutoElec.value=1,a.uElecStartTime.value=a.iTime.value-K.DUR_FILL):P&&(P=!1,v||(a.uIsAutoElec.value=0,e.orbitControls&&e.orbitControls.hideEdgeUI&&e.orbitControls.hideEdgeUI()));let we=!1;if(e.knowhere&&e.knowhere.visible&&!ee){const X=O.intersectObject(e.knowhere);if(X.length>0){const ne=X[0].uv,ie=ne.x*2-1,ue=ne.y*2-1;Math.sqrt(ie*ie+ue*ue)<.9&&(we=!0)}}if(ee&&ae){if(!v){if(v=!0,a.uFlowerGlow.value=K.FLOWER_GLOW_HOVER,new x.Tween(a.uFlowerGlitch).to({value:1},150).easing(x.Easing.Exponential.Out).start(),e.points){const X=e.points,ne=X.getCurrentStep?X.getCurrentStep():0,ie=X.material;if(ie){ne===0&&X.dipperLines&&(X.dipperLines.userData.opacity=1);const ue=ie.uniforms.uKnowhereGravity.value,ce=X.targetKnowhereGravity!==void 0?X.targetKnowhereGravity:ue,be=ie.uniforms.uKnowhereGravityMultiplier?ie.uniforms.uKnowhereGravityMultiplier.value:-1,Ee=ie.uniforms.uKnowhereGravityHoverFactor?ie.uniforms.uKnowhereGravityHoverFactor.value:50,Oe=ce*be*Ee;ie.uniforms.uIsGardenHovering&&(ie.uniforms.uIsGardenHovering.value=1);const xe=ie.uniforms.uKnowhereRadius.value,Ge=1e5,tt=X.targetChargeUpDur!==void 0?X.targetChargeUpDur:K.GARDEN_HOVER_TWEEN_DUR;X.knowherePhysicsTween&&X.knowherePhysicsTween.stop(),X.knowherePhysicsTween=new x.Tween({g:ue,r:xe}).to({g:Oe,r:Ge},tt).easing(x.Easing.Exponential.InOut).onUpdate(qe=>{ie.uniforms.uKnowhereGravity.value=qe.g,ie.uniforms.uKnowhereRadius.value=qe.r}).onComplete(()=>{X.knowherePhysicsTween=null}).start()}}window.dispatchEvent(new CustomEvent(ro.GARDEN.HOVER_START))}}else if(v){if(v=!1,new x.Tween(a.uFlowerGlow).to({value:K.FLOWER_GLOW_BASE},800).easing(x.Easing.Cubic.Out).start(),new x.Tween(a.uFlowerGlitch).to({value:0},800).easing(x.Easing.Cubic.Out).start(),e.points){const X=e.points,ne=X.material;if(ne){X.dipperLines&&(X.dipperLines.userData.opacity=0);const ie=ne.uniforms.uKnowhereGravity.value,ue=ne.uniforms.uKnowhereRadius.value,ce=X.targetKnowhereGravity!==void 0?X.targetKnowhereGravity:50,be=X.targetKnowhereRadius!==void 0?X.targetKnowhereRadius:200,Ee=X.targetCollapseOutDur!==void 0?X.targetCollapseOutDur:800;X.knowherePhysicsTween&&X.knowherePhysicsTween.stop(),X.knowherePhysicsTween=new x.Tween({g:ie,r:ue}).to({g:ce,r:be},Ee).easing(x.Easing.Exponential.InOut).onUpdate(Oe=>{ne.uniforms.uKnowhereGravity.value=Oe.g,ne.uniforms.uKnowhereRadius.value=Oe.r}).onComplete(()=>{X.knowherePhysicsTween=null,ne.uniforms.uIsGardenHovering&&!A&&!v&&(ne.uniforms.uIsGardenHovering.value=0)}).start()}}window.dispatchEvent(new CustomEvent(ro.GARDEN.HOVER_END))}if(we){if(!A&&e.points){const X=e.points,ne=X.getCurrentStep?X.getCurrentStep():0;if(ne===0||ne===1){A=!0;const ie=X.material;if(ie){ne===0&&X.dipperLines&&(X.dipperLines.userData.opacity=1);const ue=ie.uniforms.uKnowhereGravity.value,ce=X.targetKnowhereGravity!==void 0?X.targetKnowhereGravity:ue,be=ie.uniforms.uKnowhereGravityMultiplier?ie.uniforms.uKnowhereGravityMultiplier.value:-1,Ee=ie.uniforms.uKnowhereGravityHoverFactor?ie.uniforms.uKnowhereGravityHoverFactor.value:50,Oe=ce*be*Ee*-1;ie.uniforms.uIsGardenHovering&&(ie.uniforms.uIsGardenHovering.value=1);const xe=ie.uniforms.uKnowhereRadius.value,Ge=1e5,tt=ie.uniforms.uKnowhereVibrateBoost?ie.uniforms.uKnowhereVibrateBoost.value:0,qe=2,Pt=3e3;X.knowherePhysicsTween&&X.knowherePhysicsTween.stop(),X.knowherePhysicsTween=new x.Tween({g:ue,r:xe,v:tt}).to({g:Oe,r:Ge,v:qe},Pt).easing(x.Easing.Exponential.InOut).onUpdate(uo=>{ie.uniforms.uKnowhereGravity.value=uo.g,ie.uniforms.uKnowhereRadius.value=uo.r,ie.uniforms.uKnowhereVibrateBoost&&(ie.uniforms.uKnowhereVibrateBoost.value=uo.v)}).onComplete(()=>{X.knowherePhysicsTween=null}).start()}}}}else if(A&&(A=!1,e.points)){const X=e.points,ne=X.material;if(ne){X.dipperLines&&(X.dipperLines.userData.opacity=0);const ie=ne.uniforms.uKnowhereGravity.value,ue=ne.uniforms.uKnowhereRadius.value,ce=ne.uniforms.uKnowhereVibrateBoost?ne.uniforms.uKnowhereVibrateBoost.value:0,be=X.targetKnowhereGravity!==void 0?X.targetKnowhereGravity:50,Ee=X.targetKnowhereRadius!==void 0?X.targetKnowhereRadius:200,Oe=1500;X.knowhereTween&&X.knowhereTween.stop(),X.knowhereTween=new x.Tween({g:ie,r:ue,v:ce}).to({g:be,r:Ee,v:0},Oe).easing(x.Easing.Exponential.InOut).onUpdate(xe=>{ne.uniforms.uKnowhereGravity.value=xe.g,ne.uniforms.uKnowhereRadius.value=xe.r,ne.uniforms.uKnowhereVibrateBoost&&(ne.uniforms.uKnowhereVibrateBoost.value=xe.v)}).onComplete(()=>{X.knowhereTween=null,ne.uniforms.uIsGardenHovering&&!A&&!v&&(ne.uniforms.uIsGardenHovering.value=0)}).start()}}}}),n.breathe=async function(h=null){h?a.uBreathColor.value.copy(h):a.uBreathColor.value.copy(de.ELECTRIC_CYAN),new x.Tween(a.uBreathIntensity).to({value:1},1400).easing(x.Easing.Cubic.InOut).start(),await F(1400),new x.Tween(a.uBreathIntensity).to({value:0},2400).easing(x.Easing.Cubic.InOut).start()},n.startBreathing=function(h=null){if(n._isBreathingLoop)return;n._isBreathingLoop=!0,h&&a.uBreathColor.value.copy(h);const b=()=>{n._isBreathingLoop&&(n._breathTween=new x.Tween(a.uBreathIntensity).to({value:1},1400).easing(x.Easing.Cubic.InOut).onComplete(p).start())},p=()=>{n._isBreathingLoop&&(n._breathTween=new x.Tween(a.uBreathIntensity).to({value:0},2400).easing(x.Easing.Cubic.InOut).onComplete(b).start())};b()},n.stopBreathing=function(){n._isBreathingLoop=!1,n._breathTween&&(n._breathTween.stop(),new x.Tween(a.uBreathIntensity).to({value:0},1e3).easing(x.Easing.Cubic.InOut).start())},n.tweenDeco=function(h="showDeco",b=2e3,p=0){let R={value:0},C=a.uFlowerRotation.value,N=a.uHeadSpriteSize.value,q=Ga[h].FLOWER_ROTATION,$=Ga[h].HEAD_SPRITE_SIZE;return new x.Tween(R).to({value:1},b).easing(x.Easing.Cubic.InOut).delay(p).onUpdate(L=>{const B=L.value;a.uFlowerRotation.value=C+(q-C)*B,a.uHeadSpriteSize.value=N+($-N)*B}).start()};function F(h){return new Promise(b=>setTimeout(b,h))}async function G(h,b,p=0,R=x.Easing.Cubic.InOut){for(let C in h)V(C,h[C],b,p,R);await F(b+p)}function V(h,b,p,R=0,C=Ks){if(a[h])return new x.Tween(a[h]).to({value:b},p).delay(R).easing(C).start()}return n.runTweenHideRNotch=async function(h=1e3){n.applyBeamImpulse(),await G({uRNotchHRatio:0,uRNotchWRatio:0,uRNotchBarThickness:K.R_NOTCH_BAR_THICKNESS,uRNotchBarProgress:0,uBNotchBarAlpha:0},h),setTimeout(()=>n.resetBarPhysics(),h+2e3)},n.runTweenShowRNotch=async function(h){await G({uRNotchHRatio:K.R_NOTCH_H_RATIO,uRNotchWRatio:K.R_NOTCH_W_RATIO,uRNotchBarThickness:K.R_NOTCH_BAR_THICKNESS,uRNotchBarProgress:K.R_NOTCH_BAR_PROGRESS},h)},n.runTweenHideIsland=async function(h=1e3){n.labelsContainer&&(n.labelsContainer.style.display="none"),n.navLabelsContainer&&(n.navLabelsContainer.style.display="none"),n.navButtons&&n.navButtons.forEach(b=>b.hide(h*.5)),g.isActive=!0,g.vel.set(-100+Math.random()*-200,-100),g.angVel=(Math.random()-.5)*5,w.isActive=!0,w.vel.set(-150+Math.random()*-200,-50),w.angVel=(Math.random()-.5)*5,await G({uIslBarMarginRightRatio:.4},.5*h),await G({uIslToMainWRatio:-1},.5*h)},n.runTweenShowIsland=async function(h=2e3){n.breathe(),n.resetBarPhysics(),n.navButtons&&(n.navButtons[0].show(h*.5,1),n.navButtons[1].show(h*.5,2.2),n.navButtons[2].show(h*.5,1.8),n.navButtons[3].show(h*.5,2)),G({uIslBarMarginRightRatio:.02},1*h),G({uIslToMainWRatio:.32},.5*h),n.labelsContainer&&(n.labelsContainer.style.display="block"),n.navLabelsContainer&&(n.navLabelsContainer.style.display="block")},n.isOpen=!0,n.isTweening=!1,n.runTweenClose=async function(h=2e3){if(n.isTweening)return;n.isTweening=!0,n.isOpen=!1,n.breathe(),V("uGridLock",1,300),e.orbitControls&&e.orbitControls.showEdgeUI&&e.orbitControls.showEdgeUI(),a.uIsAutoElec.value=1,a.uElecStartTime.value=a.iTime.value-K.DUR_FILL;const b=h;await n.runTweenHideIsland(b*.2),await n.runTweenHideDecos(.2*b),await G({uCutSize:0,uBNotchHRatio:0,uBNotchWRatio:0,uFlowerScale:.1,uRNotchHRatio:0,uRNotchWRatio:0},.2*b),await G({uGrokScaleFactor:.05,uVerticalMarginPct:.5},.4*b),await F(500),a.uIsAutoElec.value=0,V("uGridLock",0,600),e.orbitControls&&e.orbitControls.hideEdgeUI&&e.orbitControls.hideEdgeUI(),n.isTweening=!1},n.runTweenOpen=async function(h=1800,{isIncludedIsland:b=!0,isIncludedDecos:p=!0}={}){if(n.isTweening)return;n.isTweening=!0,n.breathe(),V("uGridLock",1,500,0,x.Easing.Cubic.Out),e.orbitControls&&e.orbitControls.showEdgeUI&&e.orbitControls.showEdgeUI(),a.uIsAutoElec.value=1,a.uElecStartTime.value=a.iTime.value-K.DUR_FILL*.4,await G({uVerticalMarginPct:0},.4*h),await G({uCutSize:10,uBNotchHRatio:.02,uBNotchWRatio:.6,uFlowerScale:2.19,uRNotchHRatio:.4,uRNotchWRatio:.02},.2*h),p&&await n.runTweenShowDecos(.2*h),b&&await n.runTweenShowIsland(.2*h),await F(300);const R=a.iTime.value,C=a.uElecStartTime.value,N=K.DUR_FILL+K.DUR_HOLD+K.DUR_WIPE+K.DUR_PAUSE;let q=(R-C)%N;const $=K.DUR_FILL+K.DUR_HOLD,L=$+K.DUR_WIPE;let B=0;if(q<$){const z=$-q;a.uElecStartTime.value-=z,B=K.DUR_WIPE*1e3}else q<L&&(B=(L-q)*1e3);B>0&&await F(B),a.uIsAutoElec.value=0,V("uGridLock",0,800),e.orbitControls&&e.orbitControls.hideEdgeUI&&e.orbitControls.hideEdgeUI(),await F(800),V("uGrokScaleFactor",.45,.75*h),n.isOpen=!0,n.isTweening=!1,window.dispatchEvent(new CustomEvent("hudOpened"))},n.toggleGarden=function(){a.uIsGardenFlower.value=1-a.uIsGardenFlower.value},n.runTweenHideDecos=async function(h=2e3,b=null){await G({uFlowerRotation:K.FLOWER_ROTATION,uHeadSpriteSize:K.HEAD_SPRITE_SIZE,uGrokOffsetY:-2},h*.95),await G({uFlowerScale:K.FLOWER_SCALE},h*.05),b&&b()},n.runTweenShowDecos=async function(h=2e3){await G({uFlowerScale:2.19},h*.05),await G({uFlowerRotation:0,uHeadSpriteSize:0,uGrokOffsetY:0},h*.95)},window.addEventListener("keydown",h=>{const b=h.key.toLowerCase();if(b==="l"){if(n.isTweening||e&&e.isTransitioning){console.log("[HUD] Toggle blocked: System busy.");return}n.isOpen?n.runTweenClose():n.runTweenOpen()}b==="f"&&n.tweenFallRightBar()}),n.tweenFallRightBar=function(){if(m.isActive)return;const h=e.height||window.innerHeight,b=(h-h*(a.uMarginPct.value+a.uVerticalMarginPct.value)*2)*.5*a.uRNotchHRatio.value*.8;m.isActive=!0;const p=new l.Vector2(1200,400),R=new l.Vector2(0,b);m.vel.add(p.clone().divideScalar(m.mass));const C=R.x*p.y-R.y*p.x;m.angVel+=C/m.getMOI(b),setTimeout(()=>{g.isActive=!0,g.vel.set(-100+Math.random()*-200,-100),g.angVel=(Math.random()-.5)*5,w.isActive=!0,w.vel.set(-150+Math.random()*-200,-50),w.angVel=(Math.random()-.5)*5},100),setTimeout(()=>{m.isActive=!1,f.isActive=!1,g.isActive=!1,w.isActive=!1},4e3)},n.setGardenMode=h=>{a.uIsGardenFlower.value=h?1:0},n.tweenGardenMode=(h,b=800)=>new x.Tween(a.uIsGardenFlower).to({value:h?1:0},b).easing(x.Easing.Cubic.InOut).start(),n}function Fu(){return`
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

const vec3 BORDER_COLOR = ${za(K.BORDER_COLOR)};
uniform vec3 uOutsideColor;
const vec3 ERR_RED = ${Ii.COLORS.BAD};
uniform float uBorderThickRatio; 
uniform float uBreathIntensity;
uniform vec3 uBreathColor;
const float NOTCH_ANGLE = ${K.NOTCH_ANGLE.toFixed(4)}, RIGHT_NOTCH_ANGLE = ${K.RIGHT_NOTCH_ANGLE.toFixed(4)}; 
const float TL_GAP = ${K.TL_GAP.toFixed(4)}, CORNER_RADIUS = ${K.CORNER_RADIUS.toFixed(4)};
const float PATTERN_WIDTH = ${K.PATTERN_WIDTH.toFixed(4)}, PATTERN_GAP = ${K.PATTERN_GAP.toFixed(4)}, PATTERN_LINE_THICK = ${K.PATTERN_LINE_THICK.toFixed(4)}, PATTERN_HEIGHT_PCT = ${K.PATTERN_HEIGHT_PCT.toFixed(4)}; 

uniform float uGridSize;
uniform float uGridThickness;
uniform float uGridPulseSpeed;
uniform float uGridPulseDensity;
const float R_NOTCH_BAR_DIAMOND_SIZE = ${K.R_NOTCH_BAR_DIAMOND_SIZE.toFixed(4)};
uniform float uIslBarHeightRatio, uIslBarGapRatio, uIslBarMarginLeftRatio, uIslBarMarginRightRatio, uIslBarMarginYRatio;
uniform float uIslBarProgress1, uIslBarProgress2;
const float ELEC_SPEED = ${K.ELEC_SPEED.toFixed(4)}, ELEC_FREQUENCY = ${K.ELEC_FREQUENCY.toFixed(4)}, ELEC_INTENSITY = ${K.ELEC_INTENSITY.toFixed(4)}; 
const float SPRITE_INDEX = ${K.SPRITE_INDEX.toFixed(1)}, SPRITE_COLS = ${K.SPRITE_COLS.toFixed(1)}, SPRITE_ROWS = ${K.SPRITE_ROWS.toFixed(1)};   
const float DUR_FILL = ${K.DUR_FILL.toFixed(4)}, DUR_HOLD = ${K.DUR_HOLD.toFixed(4)}, DUR_WIPE = ${K.DUR_WIPE.toFixed(4)}, DUR_PAUSE = ${K.DUR_PAUSE.toFixed(4)}; 
const float SURGE_GRID_SIZE_PX = ${K.SURGE_GRID_SIZE_PX.toFixed(4)}, SURGE_GRID_THICK_PX = ${K.SURGE_GRID_THICK_PX.toFixed(4)}, RING_SPEED = ${K.RING_SPEED.toFixed(4)}, RING_INTENSITY = ${K.RING_INTENSITY.toFixed(4)};
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
                float tGood = ${(Ii.FPS.GOOD/60).toFixed(4)};
                float tNorm = ${(Ii.FPS.NORMAL/60).toFixed(4)};
                
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
`}var K,Ga,za,Ii,Gn=J((()=>{ct(),yt(),et(),Ki(),Hn(),K={MARGIN_PCT:.025,VERTICAL_MARGIN_PCT:.5,CUT_SIZE:0,CORNER_RADIUS:4,TL_GAP:5,B_NOTCH_TO_MAIN_W_RATIO:0,B_NOTCH_TO_MAIN_H_RATIO:0,NOTCH_ANGLE:60,R_NOTCH_TO_MAIN_H_RATIO:0,R_NOTCH_TO_MAIN_W_RATIO:0,RIGHT_NOTCH_ANGLE:45,ISL_BAR_COUNT:2,ISL_BAR_HEIGHT_RATIO:.005,ISL_BAR_GAP_RATIO:.01,ISL_BAR_MARGIN_LEFT_RATIO:.1,ISL_BAR_MARGIN_RIGHT_RATIO:.4,ISL_BAR_MARGIN_Y_RATIO:.01,ISL_BAR_PROGRESS:[.15,.42],ISL_TO_MAIN_W_RATIO:-1,NAV_COUNT:6,NAVIGATOR_VISIBILITY:1,NAV_BUTTON_WH_RATIO:2,NAV_CV_BUTTON_WH_RATIO:1,NAV_GAP:5,NAV_FILL_OPACITY:.15,DUR_FILL:1,DUR_HOLD:.5,DUR_WIPE:.25,DUR_PAUSE:.25,DIAMOND_ROT_SPEED:5,BORDER_COLOR:de.ELECTRIC_CYAN,OUTSIDE_COLOR:new l.Color(0,0,0),BORDER_THICK_RATIO:.075,PATTERN_WIDTH:10,PATTERN_GAP:4,PATTERN_LINE_THICK:1,PATTERN_HEIGHT_PCT:.75,BG_GRID_SIZE:60,GRID_LINE_THICKNESS:.6,GRID_PULSE_SPEED:1,GRID_PULSE_DENSITY:1,R_NOTCH_BAR_THICKNESS:2e-4,R_NOTCH_BAR_DIAMOND_SIZE:.00125,R_NOTCH_BAR_PROGRESS:.75,R_NOTCH_BAR_ACTIVE_COLOR:de.ELECTRIC_CYAN,R_NOTCH_BAR_INACTIVE_COLOR:de.ACCENT_GOLD,R_NOTCH_H_RATIO:.4,R_NOTCH_W_RATIO:.02,B_NOTCH_BAR_PROGRESS:1,B_NOTCH_BAR_ALPHA:0,B_NOTCH_BAR_MARGIN_X:.2,B_NOTCH_BAR_MARGIN_Y:.45,B_NOTCH_BAR_COLOR:de.ELECTRIC_CYAN,ELEC_SPEED:256,ELEC_FREQUENCY:4,ELEC_INTENSITY:2,HEAD_SPRITE_SIZE:0,SPRITE_INDEX:26,SPRITE_COLS:8,SPRITE_ROWS:4,HEAD_SCALE:1,SURGE_GRID_SIZE_PX:60,SURGE_GRID_THICK_PX:.4,RING_SPEED:4,RING_INTENSITY:.01,FLOWER_GLOW_HOVER:1.5,GARDEN_HOVER_GRAVITY_MULT:-1,GARDEN_HOVER_TWEEN_DUR:2500,FLOWER_GLOW_BASE:1,FLOWER_COLOR:de.ELECTRIC_CYAN,FLOWER_ROTATION:Math.PI/2,FLOWER_SCALE:.1,GARDEN_IS_FLOWER:0,GROK_SCALE_FACTOR:0,GROK_OFFSET_Y:0,BEAM_SPEED:30,BEAM_FREQ:.512,BEAM_MAX_HEIGHT:.03,BEAM_WAVE_THICKNESS:.0012,BEAM_BASE_THICKNESS:.001,BEAM_TRIM_RATIO:.99,BEAM_GROWTH:1,BEAM_ATTACH_RATIO:1,BEAM_BLOOM:1.5,BEAM_WOBBLE:0,BEAM_GLOW_STRENGTH:.05,BEAM_COLOR:de.ELECTRIC_CYAN,BREATH_AUTO_STRENGTH:.15,BREATH_MANUAL_STRENGTH:.2},Ga={hideDeco:{FLOWER_ROTATION:Math.PI/2,HEAD_SPRITE_SIZE:0},showDeco:{FLOWER_ROTATION:0}},za=e=>`vec3(${e.r.toFixed(4)}, ${e.g.toFixed(4)}, ${e.b.toFixed(4)})`,Ii={FPS:{PERFECT:60,GOOD:54,NORMAL:24,BAD:0},COLORS:{BAD:za(de.CRIMSON_RED)}}}));function Hu(e){const t="16px",i="1.5px",a=parseInt(t,10)*2.5,r=`${a}px`,n=`${a*2}px`,s=document.createElement("div");Object.assign(s.style,{position:"fixed",top:"0",left:"0",width:"100%",height:"100%",pointerEvents:"none",zIndex:"2000",overflow:"hidden"});const c=`${(K&&K.MARGIN_PCT?K.MARGIN_PCT:.025)*100}vh`,u={position:"absolute",zIndex:"11",pointerEvents:"auto",backgroundColor:"transparent"},d={position:"absolute",zIndex:"12",pointerEvents:"auto",backgroundColor:"rgba(8, 12, 16, 0.9)",color:"#00F3FF",border:"1px solid rgba(0, 243, 255, 0.4)",display:"flex",justifyContent:"center",alignItems:"center",width:n,height:n,boxSizing:"border-box",backdropFilter:"blur(12px)",cursor:"pointer",opacity:"0",transform:"scale(0.8)",transition:"all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",boxShadow:"0 0 25px rgba(0, 243, 255, 0.1)"},m=T=>{const M="width: 6px; height: 6px; background: #00F3FF; transform: rotate(45deg); display: block; box-shadow: 0 0 10px rgba(0, 243, 255, 0.8); transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);",O=`display: flex; gap: ${i}; justify-content: center; align-items: center;`,_=`display: flex; flex-direction: column; gap: ${i}; align-items: center; justify-content: center; width: max-content; overflow: visible;`;return T==="bottom"?`<div style="${_}"><div style="${O}"><div class="dot" style="${M}"></div><div class="dot" style="${M}"></div></div><div class="dot" style="${M}"></div></div>`:T==="top"?`<div style="${_}"><div class="dot" style="${M}"></div><div style="${O}"><div class="dot" style="${M}"></div><div class="dot" style="${M}"></div></div></div>`:T==="left"?`<div style="${_} flex-direction: row;"><div class="dot" style="${M}"></div><div style="${O} flex-direction: column;"><div class="dot" style="${M}"></div><div class="dot" style="${M}"></div></div></div>`:T==="right"?`<div style="${_} flex-direction: row;"><div style="${O} flex-direction: column;"><div class="dot" style="${M}"></div><div class="dot" style="${M}"></div></div><div class="dot" style="${M}"></div></div>`:""},f=(T,M,O,_)=>{const v=document.createElement("div");v.id=`zone-${T}`,Object.assign(v.style,u,M);const P=document.createElement("div");return P.id=`btn-${T}`,P.innerHTML=m(T),Object.assign(P.style,d,O),_&&(P.style.clipPath=_),P.addEventListener("mouseenter",()=>{P.style.backgroundColor="rgba(0, 243, 255, 0.15)",P.style.borderColor="rgba(0, 243, 255, 0.8)",P.style.boxShadow="0 0 40px rgba(0, 243, 255, 0.25)",P.querySelectorAll(".dot").forEach(A=>{A.style.background="#fff",A.style.boxShadow="0 0 20px rgba(255, 255, 255, 1)"})}),P.addEventListener("mouseleave",()=>{P.style.backgroundColor="rgba(8, 12, 16, 0.9)",P.style.borderColor="rgba(0, 243, 255, 0.4)",P.style.boxShadow="0 0 25px rgba(0, 243, 255, 0.1)",P.querySelectorAll(".dot").forEach(A=>{A.style.background="#00F3FF",A.style.boxShadow="0 0 10px rgba(0, 243, 255, 0.8)"})}),v.appendChild(P),s.appendChild(v),{zone:v,btn:P}},g=f("left",{top:"0",left:"0",width:c,height:"100%"},{top:"50%",left:"0",marginTop:`-${r}`,width:r,height:n,borderLeft:"none"},"polygon(0 0, 100% 25%, 100% 75%, 0 100%)"),w=f("right",{top:"0",right:"0",width:c,height:"100%"},{top:"50%",right:"0",marginTop:`-${r}`,width:r,height:n,borderRight:"none"},"polygon(0 25%, 100% 0, 100% 100%, 0 75%)"),y=f("top",{top:"0",left:"0",width:"100%",height:c},{top:"0",left:"50%",marginLeft:`-${r}`,width:n,height:r,borderTop:"none"},"polygon(0 0, 100% 0, 75% 100%, 25% 100%)"),S=f("bottom",{bottom:"0",left:"0",width:"100%",height:c},{bottom:"0",left:"50%",marginLeft:`-${r}`,width:n,height:r,borderBottom:"none"},"polygon(25% 0, 75% 0, 100% 100%, 0 100%)");return e.appendChild(s),{left:g,right:w,top:y,bottom:S,wrapper:s}}function Gu(e,t,o,i=!0,a=!0){const r=new Ol(t,o.domElement);r.enableDamping=!0,r.dampingFactor=.25,r.minDistance=2,r.maxDistance=100,i&&(r.enableRotate=!1,r.enablePan=!1,r.enableZoom=!1),e.orbitControls=r,r.moveState={left:!1,right:!1,up:!1,down:!1};let n=0,s=0;if(i&&a){const u=o.domElement.parentNode,d=Hu(document.body),m=()=>{if(u){const T=u.getBoundingClientRect();d.wrapper.style.left=`${T.left}px`,d.wrapper.style.top=`${T.top}px`,d.wrapper.style.width=`${T.width}px`,d.wrapper.style.height=`${T.height}px`}};m(),window.addEventListener("resize",m);const f=[d.left.btn,d.right.btn,d.top.btn,d.bottom.btn],g=[d.left.zone,d.right.zone,d.top.zone,d.bottom.zone],w=()=>f.forEach(T=>{T.style.opacity="1",T.style.transform="scale(1)"}),y=()=>f.forEach(T=>{T.style.opacity="0",T.style.transform="scale(0.8)"});g.forEach(T=>{T.addEventListener("mouseenter",w),T.addEventListener("mouseleave",y)});const S=(T,M)=>{T.addEventListener("mouseenter",()=>{r.moveState[M]=!0}),T.addEventListener("mouseleave",()=>{r.moveState[M]=!1})};S(d.left.btn,"left"),S(d.right.btn,"right"),S(d.top.btn,"up"),S(d.bottom.btn,"down"),r.domUI=d,r.syncWrapperPosition=m,r.showEdgeUI=w,r.hideEdgeUI=y}r.edgeControlUpdate=()=>{if(!i||r.isStrategicHover){r.update();return}let u=0,d=0;if(r.moveState.left&&(u=Wa),r.moveState.right&&(u=-Wa),r.moveState.up&&(d=-Ya),r.moveState.down&&(d=Ya),u!==0){const f=n+u;Math.abs(f)>qa&&(u=Math.sign(f)*qa-n),n+=u}else Math.abs(n)>.001?(u=-(n*Va),n+=u):n=0;if(d!==0){const f=s+d;Math.abs(f)>$a&&(d=Math.sign(f)*$a-s),s+=d}else Math.abs(s)>.001?(d=-(s*Va),s+=d):s=0;const m=t._shakeOffset||new l.Vector3(0,0,0);if(t.position.sub(m),u!==0){const f=new l.Matrix4().makeRotationY(u);t.position.sub(r.target).applyMatrix4(f).add(r.target)}if(d!==0){const f=new l.Vector3().subVectors(t.position,r.target),g=new l.Vector3().crossVectors(t.up,f).normalize(),w=new l.Matrix4().makeRotationAxis(g,d);t.position.sub(r.target).applyMatrix4(w).add(r.target)}t.position.add(m),r.update()};const c=r.dispose;return r.dispose=()=>{r.domUI&&r.domUI.wrapper&&r.domUI.wrapper.remove(),r.syncWrapperPosition&&window.removeEventListener("resize",r.syncWrapperPosition),c.call(r)},r.update(),r}var Va,Wa,Ya,qa,$a,zu=J((()=>{Gn(),Va=.05,Wa=.01,Ya=.008,qa=1,$a=.08}));function Vu(e){const t=new l.MeshStandardMaterial({color:16777215,metalness:.05,roughness:.2,name:"floorMat",side:l.FrontSide,envMapIntensity:2.5});t.uniforms={...e.globalUniformsHub.uniforms,uBorderColor:{value:new l.Color(65535)}},oe.environmentMap&&(t.envMap=oe.environmentMap,t.envMapIntensity=2.5,oe.environmentMap.mapping=l.EquirectangularReflectionMapping),t.onBeforeCompile=r=>{In(r,t.uniforms),Ts(r,t.uniforms),Mc(r,t.uniforms)};let o="textures/ktx2/";function i(r,n,s=l.NoColorSpace){It.load(`${o}${r}`,function(c){c.wrapS=l.RepeatWrapping,c.wrapT=l.RepeatWrapping,c.anisotropy=4,c.repeat.set(.5,4),c.colorSpace=s,t[n]=c,t.needsUpdate=!0,n==="bumpMap"&&(t.bumpScale=1.2)})}i("hardwood2_diffuse.ktx2","map",l.SRGBColorSpace),i("hardwood2_bump.ktx2","bumpMap"),i("hardwood2_roughness.ktx2","roughnessMap");const a=new l.Mesh(rl,t);return a.rotation.x=-Math.PI/2,a.receiveShadow=!0,a.position.set(3,0,-4),a.name="floor",a.scale.set(20,24.8,1),a.visible=!1,a}function Wu(e,t){let o=e.initialParent||e.parent;const i={uuid:e.uuid,name:e.name,position:e.position.clone(),rotation:{x:e.rotation.x,y:e.rotation.y,z:e.rotation.z,order:e.rotation.order},scale:e.scale.clone(),parent:o};t.tweenData=t.tweenData||{},t.tweenData[e.uuid]=i}function Yu(e){Jt.envMap=e.environment;const t=Vu(e);e.add(t),Wu(t,e);let o=e.getObjectByName("leftWall"),i=e.getObjectByName("rightWall"),a=e.getObjectByName("backWall"),r=e.getObjectByName("frontWall"),n=e.getObjectByName("rightWall-cover");o?o.material=Jt:console.warn("Missing: leftWall"),i?i.material=Jt:console.warn("Missing: rightWall"),n?n.material=Jt:console.warn("Missing: rightWall-cover"),a?a.material=sl:console.warn("Missing: backWall"),r?r.material=Jt:console.warn("Missing: frontWall"),["rightWall","leftWallFoot001"].forEach(s=>{const c=e.getObjectByName(s);c&&c.material&&(c.material=c.material.clone(),c.material.uniforms=e.globalUniformsHub.uniforms,c.material.onBeforeCompile=u=>{In(u,c.material.uniforms)})})}var rl,Jt,sl,qu=J((()=>{Wt(),ei(),yt(),Rn(),rl=Jo.plane,Jt=new l.MeshStandardMaterial({roughness:.9,color:661043,metalness:.25,side:l.FrontSide,name:"wallMat"}),sl=new l.MeshStandardMaterial({roughness:.9,color:"#090919",metalness:.25,side:l.FrontSide,name:"backWallMat"}),Jt.envMapRotation.y=1.4,new l.MeshBasicMaterial({color:661043})}));function Nt(e,t,o,i=null,a=null,r="REPEAT"){const n=e?e.itemSize:o,s=new(a||(e?e.array.constructor:Float32Array))(t*n);if(i&&i.length===n)for(let c=0;c<t;c++)for(let u=0;u<n;u++)s[c*n+u]=i[u];if(e){const c=e.array,u=c.length;if(s.set(c),r==="REPEAT")for(let d=u;d<s.length;d++)s[d]=c[d%u]}return new l.BufferAttribute(s,n)}var ll,$u=J((()=>{ll=class extends l.BufferGeometry{constructor(e){super(),this.isMorphGeo=!0,this.targetGeos=e;const t=Array.isArray(e)?e:[e],o=Math.max(...t.map(n=>n.attributes.position?n.attributes.position.count:0));this.maxCount=o;const i=Math.max(...t.map(n=>n.index?n.index.count:0)),a=t.some(n=>n.attributes.uv),r=t.some(n=>n.attributes.normal);this.morphInfo=[],e.forEach(n=>{let s=null;n.index&&(s=Nt(n.index,i,1,null,Uint32Array,"ZERO"));let c={position:Nt(n.attributes.position,o,3),normal:r?Nt(n.attributes.normal,o,3,[0,1,0]):null,uv:a?Nt(n.attributes.uv,o,2):null,index:s};this.morphInfo.push(c)})}setMorphInfo(e,t=null){t=t??e;let o=this.morphInfo[e],i=this.morphInfo[t];o.position&&this.setAttribute("position",o.position),o.normal&&this.setAttribute("normal",o.normal),o.uv&&this.setAttribute("uv",o.uv),o.index&&(this.setIndex(o.index),this.originalIndex=o.index),i.position&&this.setAttribute("targetPosition",i.position),i.normal&&this.setAttribute("targetNormal",i.normal),i.uv&&this.setAttribute("targetUV",i.uv),i.index&&(this.targetIndex=i.index)}addTargets(e){const t=Array.isArray(e)?e:[e];this.targetGeos.push(...t);const o=this.maxCount,i=Math.max(...t.map(n=>n.index?n.index.count:0)),a=t.some(n=>n.attributes.uv),r=t.some(n=>n.attributes.normal);t.forEach(n=>{let s=null;if(n.index){const u=Math.max(i,n.index.count);s=Nt(n.index,u,1,null,Uint32Array,"ZERO")}let c={position:Nt(n.attributes.position,o,3),normal:r||this.attributes&&this.attributes.normal?Nt(n.attributes.normal,o,3,[0,1,0]):null,uv:a||this.attributes&&this.attributes.uv?Nt(n.attributes.uv,o,2):null,index:s};this.morphInfo.push(c)})}}})),xr,ha,Ku=J((()=>{xr=class Ka extends Ji{constructor(){super(Ka.Geometry,new Nr({opacity:0,transparent:!0})),this.isLensflare=!0,this.type="Lensflare",this.frustumCulled=!0,this.renderOrder=1/0;const t=new Ft,o=new Ft,i=new Yn(16,16),a=new Yn(16,16);let r=Kn;const n=Ka.Geometry,s=new ea({uniforms:{scale:{value:null},screenPosition:{value:null}},vertexShader:`

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

				}`,depthTest:!0,depthWrite:!1,transparent:!1}),c=new ea({uniforms:{map:{value:i},scale:{value:null},screenPosition:{value:null}},vertexShader:`

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

				}`,depthTest:!1,depthWrite:!1,transparent:!1}),u=new Ji(n,s),d=[],m=ha.Shader,f=new ea({name:m.name,uniforms:{map:{value:null},occlusionMap:{value:a},color:{value:new Ai(16777215)},scale:{value:new gt},screenPosition:{value:new Ft}},vertexShader:m.vertexShader,fragmentShader:m.fragmentShader,blending:Dr,transparent:!0,depthWrite:!1}),g=new Ji(n,f);this.addElement=function(M){d.push(M)},this.elements=d;const w=new gt,y=new gt,S=new Cl,T=new Ml;this.onBeforeRender=function(M,O,_){M.getCurrentViewport(T);const v=M.getRenderTarget(),P=v!==null?v.texture.type:Kn;r!==P&&(i.dispose(),a.dispose(),i.type=a.type=P,r=P);const A=T.w/T.z,F=T.z/2,G=T.w/2;let V=16/T.w;if(w.set(V*A,V),S.min.set(T.x,T.y),S.max.set(T.x+(T.z-16),T.y+(T.w-16)),o.setFromMatrixPosition(this.matrixWorld),o.applyMatrix4(_.matrixWorldInverse),!(o.z>0)&&(t.copy(o).applyMatrix4(_.projectionMatrix),y.x=T.x+t.x*F+F-8,y.y=T.y+t.y*G+G-8,S.containsPoint(y))){M.copyFramebufferToTexture(i,y);let h=s.uniforms;h.scale.value=w,h.screenPosition.value=t,M.renderBufferDirect(_,null,n,s,u,null),M.copyFramebufferToTexture(a,y),h=c.uniforms,h.scale.value=w,h.screenPosition.value=t,M.renderBufferDirect(_,null,n,c,u,null);const b=-t.x*2,p=-t.y*2;this.mat1a=s,this.mat1b=c,this.mat2=f;for(let R=0,C=d.length;R<C;R++){const N=d[R],q=f.uniforms;N.mat2Uniforms=q,q.color.value.copy(N.color),q.map.value=N.texture,q.screenPosition.value.x=t.x+b*N.distance,q.screenPosition.value.y=t.y+p*N.distance,V=N.size/T.w;const $=T.w/T.z;q.scale.value.set(V*$,V),f.uniformsNeedUpdate=!0,M.renderBufferDirect(_,null,n,f,g,null)}}},this.dispose=function(){s.dispose(),c.dispose(),f.dispose(),i.dispose(),a.dispose();for(let M=0,O=d.length;M<O;M++)d[M].texture.dispose()}}},ha=class{constructor(e,t=1,o=0,i=new Ai(16777215)){this.texture=e,this.size=t,this.distance=o,this.color=i}},ha.Shader={name:"LensflareElementShader",uniforms:{map:{value:null},occlusionMap:{value:null},color:{value:null},scale:{value:null},screenPosition:{value:null}},vertexShader:`

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

		}`},xr.Geometry=(function(){const e=new Il,t=new Rl(new Float32Array([-1,-1,0,0,0,1,-1,0,1,0,1,1,0,1,1,-1,1,0,0,1]),5);return e.setIndex([0,1,2,0,2,3]),e.setAttribute("position",new qn(t,3,0,!1)),e.setAttribute("uv",new qn(t,2,3,!1)),e})()})),cl=J((()=>{Ku(),yt()}));function ju(e){const t=e.globalUniformsHub,o=t?t.uniforms:{},i=t?t.core:{},a=new l.ShaderMaterial({uniforms:{glowColor:{value:new l.Color("#FBC189")},glowPower:{value:1},glowIntensity:{value:1},iTime:i.iTime||{value:0},uOscillationStrength:o.uOscillationStrength||{value:1},uIsOscillating:o.uIsOscillating||{value:0},uTransformProgress:o.uTransformProgress||{value:0}},vertexShader:Co,fragmentShader:lo,side:l.FrontSide,blending:l.AdditiveBlending,transparent:!0,depthWrite:!1,name:"bulbInnerMat"}),r=new l.ShaderMaterial({uniforms:{outerGlowStrength:{value:1},outerGlowBorder:{value:.01},p:{value:6.5},glowColor:{value:new l.Color("#FBC189")},iTime:i.iTime||{value:0},uOscillationStrength:o.uOscillationStrength||{value:1},uIsOscillating:o.uIsOscillating||{value:1},uTransformProgress:o.uTransformProgress||{value:0}},vertexShader:Co,fragmentShader:Xo,side:l.FrontSide,blending:l.AdditiveBlending,transparent:!0,depthWrite:!1,name:"bulbOuterGlowMat"});let n=e.getObjectByName("btc_symbol"),s=e.getObjectByName("cFanBulb");e.getObjectByName("sphereSample");const c=new ll([Jo.sphere,n.geometry,s.geometry]);c.setMorphInfo(0,1);const u=new l.Mesh(c,a);e.add(u),u.position.set(-9.2,9.6,-.39),u.scale.setScalar(1),u.material.visible=!1,u.name="bulb";let d=new l.Mesh(u.geometry,r);d.scale.setScalar(2),d.name="bulbAura",d.visible=!1,u.add(d);const m=new l.Color(16769202),f=new l.SpotLight(m,.001,50,Math.PI/3,.5,2);return f.name="bulbLight",f.visible=!0,u.add(f),f.target.position.set(0,-10,0),u.add(f.target),f.castShadow=!0,f.shadow.mapSize.width=256,f.shadow.mapSize.height=256,f.shadow.bias=-5e-4,f.shadow.focus=1,e.bulb=u,e.bulbLight=f,u}var Xu=J((()=>{ct(),wt(),ei(),$u(),cl(),yt()}));function Qu(e,t=600){const o=new Float32Array(t*3),i=new Float32Array(t),a=new Float32Array(t),r=new Float32Array(t*3),n=new Float32Array(t),s=new l.Vector3,c=new l.Vector3;for(let S=0;S<t;S++){const T=new l.Vector3().randomDirection().multiplyScalar(Math.random()*5);s.copy(Ri).add(T),s.toArray(o,S*3),c.x=Math.random()*.5+.5,c.y=(Math.random()-.5)*1,c.z=(Math.random()-.5)*.5,c.normalize(),c.toArray(r,S*3),n[S]=Math.random(),i[S]=20,a[S]=Math.random()*.4+.2}const u=new l.BufferGeometry;u.setAttribute("position",new l.BufferAttribute(o,3)),u.setAttribute("size",new l.BufferAttribute(i,1)),u.setAttribute("speed",new l.BufferAttribute(a,1)),u.setAttribute("direction",new l.BufferAttribute(r,3)),u.setAttribute("random",new l.BufferAttribute(n,1));const d=e.globalUniformsHub,m=d?d.uniforms:{},f=d?d.core:{},g=oe.spriteSheet,w=new l.ShaderMaterial({uniforms:{iTime:f.iTime||{value:0},uMouse:f.uMouse||{value:new l.Vector2(0,0)},uSmoothedMouse:{value:new l.Vector2(0,0)},fireFliesTexture:{value:g},uMergeProgress:m.uMergeProgress||{value:0},uPointMergePos:m.uPointMergePos||{value:new l.Vector3(-.6,4.4,0)},uOverrideActive:m.uOverrideActive||{value:0},uOverrideRow:m.uOverrideRow||{value:0},uOverrideCol:m.uOverrideCol||{value:0},uSizeFactor:m.uSizeFactor||{value:1},uKamikazeScale:m.uKamikazeScale||{value:0}},vertexShader:ul,fragmentShader:dl,blending:l.AdditiveBlending,depthTest:!0,depthWrite:!1,transparent:!0,name:"firefliesMat"}),y=new l.Points(u,w);return y.onBeforeRender=()=>{const S=w.uniforms.uMouse.value,T=w.uniforms.uSmoothedMouse.value,M=.22;T.x+=(S.x-T.x)*M,T.y+=(S.y-T.y)*M},y.tweenFlashIn=null,y.tweenFlashOut=null,y.triggerFlash=S=>{const T=oe.spriteSheetSpecialIcons;if(!T||!T[S.toLowerCase()]){console.warn(`[Fireflies] No icon mapping found for type: ${S}`);return}const M=T[S.toLowerCase()],O=M.row,_=M.col,v=y.material.uniforms;v.uOverrideRow.value=O,v.uOverrideCol.value=_,y.tweenFlashIn&&y.tweenFlashIn.stop(),y.tweenFlashOut&&y.tweenFlashOut.stop();const P={active:v.uOverrideActive.value,size:v.uSizeFactor.value};y.tweenFlashIn=new x.Tween(P).to({active:1,size:1.6},200).easing(x.Easing.Quadratic.Out).onUpdate(A=>{v.uOverrideActive.value=A.active,v.uSizeFactor.value=A.size}).start(),y.tweenFlashOut=new x.Tween({active:1,size:1.6}).to({active:0,size:1},1e3).delay(4e3).easing(x.Easing.Quadratic.Out).onUpdate(A=>{v.uOverrideActive.value=A.active,v.uSizeFactor.value=A.size}).onComplete(()=>{y.tweenFlashIn=null,y.tweenFlashOut=null}).start()},e.add(y),y.name="fireflies",e.fireflies=y,y}var ga,Ri,ul,dl,Zu=J((()=>{wt(),yt(),ga=15,Ri=new l.Vector3(-ga,7.25,0),ul=`
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

    const float radius =  ${ga.toFixed(1)};
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
            vec2 pivot = vec2(${Ri.y.toFixed(1)}, ${Ri.z.toFixed(1)});
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
`,dl=`
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
`}));async function Ju(e,t){if(t&&Ue(window.loadingProgress||0,Z("SYS_PHYSICS_CALC")),!e.world&&(console.warn("Physics world not ready, waiting..."),await new Promise(s=>setTimeout(s,100)),!e.world))throw new Error("Physics World not initialized");e.bhTargets||=[];const o=new Map;e.traverse(s=>{s.name&&o.set(s.name,s)});async function i(s,c,u={}){const d=Array.isArray(s)?s:[s];let m=0,f=performance.now();for(let g of d){let w=o.get(g);if(!w)continue;u.isBhTarget&&e.bhTargets.push(w),w.visible=!1,(u.isConvexHull||performance.now()-f>1)&&(await qi(),f=performance.now());let y=c(e,w,u);Qa(e,w,y.body,y.shape,u),m++,d.length>5&&Qe("physics-binding",.1+m/d.length*.7)}}await i(["backWall_rapier","rightWall","leftWall","glass2","frontWall","","Object_15","Object_15001","Cube004","Cube019_3","Cube019_5","Object_1001_1","Object_8001","leftWallFoot001","Object_38001"],Xe,{bodyType:"fixed",restitution:.4,friction:.4}),await i(["bedMain","bedStand"],Xe,{bodyType:"fixed",restitution:.1,friction:.4,isConvexHull:!0}),Qe("physics-binding",.2,Z("SYS_MAPPING_BOUNDARIES"));const a=o.get("a-char");if(a){Qe("physics-binding",.3,Z("SYS_CHAR_COLLISION")),new l.Quaternion().setFromAxisAngle(new l.Vector3(1,0,0),Math.PI/2);const s=fe.ColliderDesc.capsule(.48,.66).setTranslation(0,.1,0),c=e.world.createRigidBody(fe.RigidBodyDesc.kinematicPositionBased());Po(e,a,c,s,{trackBoneName:"mixamorigSpine1",offset:new l.Vector3(0,0,0),restitution:.5,friction:.4,softKinematic:.7}),Qe("physics-binding",.4,Z("SYS_BINDING_ARMATURES")),[{bone:"mixamorigLeftArm",shapeType:"capsule",radius:.2,height:.4,offset:new l.Vector3(0,.35,0)},{bone:"mixamorigRightArm",shapeType:"capsule",radius:.2,height:.4,offset:new l.Vector3(0,.35,0)},{bone:"mixamorigLeftForeArm",shapeType:"capsule",radius:.2,height:.3,offset:new l.Vector3(0,.5,0)},{bone:"mixamorigRightForeArm",shapeType:"capsule",radius:.2,height:.3,offset:new l.Vector3(0,.5,0)},{bone:"mixamorigLeftUpLeg",shapeType:"capsule",radius:.3,height:.4,offset:new l.Vector3(0,1,0)},{bone:"mixamorigRightUpLeg",shapeType:"capsule",radius:.3,height:.4,offset:new l.Vector3(0,1,0)},{bone:"mixamorigRightLeg",shapeType:"capsule",radius:.3,height:.4,offset:new l.Vector3(0,1,0)},{bone:"mixamorigLeftFoot",shapeType:"capsule",radius:.24,height:.15,offset:new l.Vector3(0,.5,0)},{bone:"mixamorigRightFoot",shapeType:"capsule",radius:.24,height:.15,offset:new l.Vector3(0,.5,0)},{bone:"mixamorigHead",shapeType:"ball",radius:.43,offset:new l.Vector3(0,.35,0)}].forEach(u=>{let d;u.shapeType==="ball"?d=fe.ColliderDesc.ball(u.radius):d=fe.ColliderDesc.capsule(u.height,u.radius),u.offset&&d.setTranslation(u.offset.x,u.offset.y,u.offset.z),u.rotation&&d.setRotation(u.rotation);const m=e.world.createRigidBody(fe.RigidBodyDesc.kinematicPositionBased());Po(e,a,m,d,{trackBoneName:u.bone,restitution:.5,friction:.4,softKinematic:.7})})}else console.warn("bindPhysics: Character 'a-char' not found.");Qe("physics-binding",.5,Z("SYS_ANCHORING_ROTORS"));for(const s of["cFanBody"]){const c=o.get(s);if(c){const{body:u,shape:d}=Xe(e,c,{bodyType:"kinematicPosition"});Po(e,c,u,d,{restitution:.2,friction:.9,softKinematic:.7})}}await i("glassInvi",Xe,{bodyType:"kinematicPosition"}),await i("stool_bound",Xe,{bodyType:"kinematicPosition",isIntegrityResetTarget:!0,isIntegrityCheckTarget:!0,isConvexHull:!0,restitution:.7,friction:.2}),Qe("physics-binding",.6,Z("SYS_DYNAMIC_RIGIDBODIES")),await i("Object_31",Xe,{bodyType:"dynamic",restitution:.2,mass:10,pullingDampness:.25,canSleep:!0,isBhTarget:!0,isConvexHull:!0,isIntegrityCheckTarget:!0}),await i("pictureLionFrame",Xe,{bodyType:"dynamic",mass:1,pullingDampness:.0025,canSleep:!0,isBhTarget:!0,isConvexHull:!0,isIntegrityCheckTarget:!1,isIntegrityResetTarget:!0}),await i("Model_0001",Xe,{bodyType:"dynamic",mass:1.5,restitution:.01,friction:.995,pullingDampness:.0025,canSleep:!0,isBhTarget:!0,isConvexHull:!0,isIntegrityResetTarget:!0,isIntegrityCheckTarget:!1}),await i("blackCat",bt,{bodyType:"fixed",scale:new l.Vector3(1,1,.5),offset:new l.Vector3(0,.5,0)}),Qe("physics-binding",.7,Z("SYS_BONE_HIERARCHIES"));const r=o.get("GLTF_created_0001");if(r){const s=fe.ColliderDesc.capsule(.2,.15).setTranslation(0,0,0),c=e.world.createRigidBody(fe.RigidBodyDesc.kinematicPositionBased());Po(e,r,c,s,{trackBoneName:"Root_M_2_6_11",offset:new l.Vector3(0,0,0),restitution:.2,friction:.9,softKinematic:.7}),[{bone:"HipFix_R_3_7_12",shapeType:"ball",radius:.1,offset:new l.Vector3(0,0,0)},{bone:"HipFix_L_85_89_94",shapeType:"ball",radius:.1,offset:new l.Vector3(0,0,0)},{bone:"RootPart1_M_16_20_25",shapeType:"capsule",radius:.4,height:.3,offset:new l.Vector3(0,.2,.2)},{bone:"Tail0_M_10_14_19",shapeType:"capsule",radius:.05,height:.2,offset:new l.Vector3(0,0,0)},{bone:"Tail20_M_15_19_24",shapeType:"capsule",radius:.05,height:.2,offset:new l.Vector3(0,0,0)},{bone:"Head_M_26_30_35",shapeType:"ball",radius:.3,offset:new l.Vector3(0,0,0)}].forEach(u=>{let d;u.shapeType==="ball"?d=fe.ColliderDesc.ball(u.radius):d=fe.ColliderDesc.capsule(u.height,u.radius),u.offset&&d.setTranslation(u.offset.x,u.offset.y,u.offset.z);const m=e.world.createRigidBody(fe.RigidBodyDesc.kinematicPositionBased());Po(e,r,m,d,{trackBoneName:u.bone,restitution:.2,friction:.9,softKinematic:.7})})}await i("Object_2001",Xe,{bodyType:"dynamic",mass:80,restitution:.6,canSleep:!0,isBhTarget:!0,isConvexHull:!0,offset:new l.Vector3(0,0,0),pullingDampness:.45,isIntegrityCheckTarget:!0}),await i("mjolnir_low_mjolnir_hammer_0",Xe,{bodyType:"dynamic",mass:10,restitution:0,canSleep:!0,isBhTarget:!0,pullingDampness:.9075,isConvexHull:!0,isIntegrityResetTarget:!0}),await i("questionCube",bt,{bodyType:"dynamic",mass:20,isBhTarget:!0,isIntegrityResetTarget:!0}),await i("shelf",Xe,{bodyType:"dynamic",mass:400,restitution:.3,canSleep:!0,isBhTarget:!0,pullingDampness:.25,isIntegrityCheckTarget:!1,isIntegrityResetTarget:!0});let n=[];for(let s=0;s<=38;s++){const c="book"+String(s).padStart(3,"0");n.push(c)}await i(n,bt,{bodyType:"dynamic",isBhTarget:!0,mass:2,restitution:.05,canSleep:!0,pullingDampness:.25,isIntegrityCheckTarget:!1,isIntegrityResetTarget:!0}),await i(["pokeball","pokeball2"],$l,{bodyType:"dynamic",mass:27,scale:.425,restitution:.9,isBhTarget:!0,isIntegrityResetTarget:!0}),await i("drone",bt,{bodyType:"kinematicPosition",mass:2.5,isBhTarget:!1,linearDamping:1,angularDamping:1}),Qe("physics-binding",.85,Z("SYS_COLLISION_MESHES"));try{await i("caseCover",bt,{bodyType:"dynamic",mass:100,restitution:.1,isBhTarget:!0,isIntegrityCheckTarget:!0}),await i("Object_42001",bt,{bodyType:"dynamic",mass:.5,restitution:.93,canSleep:!0,isBhTarget:!0,pullingDampness:-1,isIntegrityResetTarget:!0}),await i("screenDisplay",bt,{bodyType:"dynamic",mass:200,scale:new l.Vector3(1,1.05,.9),offset:new l.Vector3(0,-.13,0),isBhTarget:!0,pullingDampness:.5,isIntegrityCheckTarget:!0}),await i("screenDisplay2",bt,{bodyType:"dynamic",mass:20,scale:new l.Vector3(1,1.05,.9),offset:new l.Vector3(0,-.13,0),isBhTarget:!0,pullingDampness:.15,restitution:.3,isIntegrityCheckTarget:!0}),await i("verticalMonitor",bt,{bodyType:"dynamic",mass:150,friction:.9,scale:new l.Vector3(1,1,1),offset:new l.Vector3(0,1.75,0),isBhTarget:!0,pullingDampness:.25,isIntegrityCheckTarget:!0}),await i(["aegis","aegis2"],Xe,{bodyType:"dynamic",mass:1.1,restitution:.01,canSleep:!0,isBhTarget:!0,isConvexHull:!0,isIntegrityResetTarget:!0}),await i(["pillow-small-1","pillow-small-2","pillow-big-1","pillow-big-2"],Xe,{bodyType:"dynamic",mass:100.3,restitution:0,friction:.9,canSleep:!0,pullingDampness:.64,isBhTarget:!0,isConvexHull:!0,isIntegrityResetTarget:!0})}catch(s){throw s}}var ed=J((()=>{so(),Wt(),Mn(),lt()})),td=J((()=>{ct(),wt(),ei()}));function od(e,t){if(!e||!t)return console.error("initConversationBox: Missing model or scene"),null;let o=null;if(e.traverse(f=>{f.isBone&&f.name==="mixamorigSpine2"&&(o=f)}),o||e.traverse(f=>{f.isBone&&f.name==="mixamorigSpine"&&(o=f)}),o||e.traverse(f=>{f.isBone&&f.name==="mixamorigHips"&&(o=f)}),o||(o=e.getObjectByName("Ch23_Hair")),!o)return console.warn("initConversationBox: No head found."),null;let i=null,a=0,r=0,n=null;new l.Vector2;const s=3,c=2;function u(){if(document.getElementById("scifi-shout-box"))return;i=document.createElement("div"),i.id="scifi-shout-box",Object.assign(i.style,{position:"absolute",top:"0",left:"0",pointerEvents:"none",zIndex:"5000",padding:"10px 20px",color:"#ffffff",fontFamily:'"Rajdhani", sans-serif',fontWeight:"600",fontSize:"18px",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:"1.4",backgroundColor:"rgba(5, 10, 25, 0.85)",backdropFilter:"blur(10px)",border:"1.5px solid #00F0FF",boxShadow:"0 0 30px rgba(0, 240, 255, 0.25)",opacity:"0",whiteSpace:"pre-wrap",transform:"translate(-50%, -100%) scale(0.8)",transition:"opacity 0.3s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.25)",letterSpacing:"1px",textTransform:"none",borderRadius:"2px",clipPath:"none"});const f=document.createElement("div");Object.assign(f.style,{position:"absolute",bottom:"-7.5px",left:"50%",width:"12px",height:"12px",backgroundColor:"rgba(5, 10, 25, 0.95)",borderLeft:"1.5px solid #00F0FF",borderBottom:"1.5px solid #00F0FF",transform:"translateX(-50%) rotate(-45deg)",zIndex:"1"}),i.appendChild(f);const g=document.createElement("div");Object.assign(g.style,{position:"absolute",bottom:"4px",right:"4px",width:"8px",height:"8px",borderRight:"2px solid #00F0FF",borderBottom:"2px solid #00F0FF"}),i.appendChild(g),document.getElementById("experience-container").appendChild(i)}function d(f,g={}){i||u();let w=f;Array.isArray(f)&&(w=f[Math.floor(Math.random()*f.length)]);let y=i.querySelector(".text-content");y||(y=document.createElement("span"),y.className="text-content",i.insertBefore(y,i.firstChild)),y.innerText=w;const S=18;let T=1;g.extraSmall?T=.56:g.small&&(T=.65),i.style.fontSize=`${S*T}px`,i.style.minWidth=w.length>20?"160px":"95px"}u();const m={update:f=>{if(i){if(Math.abs(r-a)>.01){const g=s*f;r<a?r=Math.min(r+g,a):r=Math.max(r-g,a),i.style.opacity=r,i.style.display=r>.01?"block":"none"}else i.style.opacity=a,i.style.display=a>.01?"block":"none";if(a>.01&&o&&t.camera&&t.renderer){const g=new l.Vector3;o.getWorldPosition(g),g.y+=c,g.project(t.camera);const w=t.renderer.domElement,y=w.clientWidth/2,S=w.clientHeight/2,T=g.x*y+y,M=-(g.y*S)+S,O=.8+.2*r;i.style.transform=`translate(-50%, -100%) translate(${T}px, ${M}px) scale(${O})`}}},updateText:(f,g={})=>{d(f,g)},show:()=>{a=1,i&&(i.style.display="block")},hide:()=>{a=0},shout:(f,g=3e3,w={})=>(n&&clearTimeout(n),d(f,w),m.show(),n=setTimeout(()=>{m.hide(),n=null},g),n),clear:()=>{n&&(clearTimeout(n),n=null),a=0,r=0,i&&(i.style.opacity="0",i.style.display="none")}};return m}var id=J((()=>{}));function ad(e){let t=e.getObjectByName("Blackhole");if(!t)return;t.position.y=-500,t.scale.setScalar(2),t.traverse(a=>{a.isMesh&&a.material&&(a.material.roughness=.95,a.material.metalness=0,a.material.side=l.FrontSide,a.castShadow=!1)});function o(a,r,n){const s=t.getObjectByName(a);s?.material&&s.material[r]!==void 0&&(s.material[r]=n)}o("Lathe_L_Blackhole_03_0","roughness",.4),o("Lathe_S_Blackhole_01_0","metalness",.6);let i=t.getObjectByName("Lathe_Center");if(i){const a=e.globalUniformsHub;a&&a.core,i.material=new l.ShaderMaterial({vertexShader:Xr,fragmentShader:os,transparent:!0,uniforms:{...a.uniforms,nebulaCoreRadius:{value:20},nebulaTwistFactor:{value:0},alpha:{value:1}},blending:l.AdditiveBlending,name:"nebulaMat"})}}function nd(e){const t=e.globalUniformsHub,o=t?t.uniforms:{},i=nt(e,is,{side:l.BackSide,uniforms:{...t.core,isStriking:o.isStriking||{value:!1},normalizedStrikePos:o.normalizedStrikePos||{value:new l.Vector2(-2,-2)},uRainHeaviness:o.uRainHeaviness||{value:2},uStormSharpness:o.uStormSharpness||{value:0},uMoonPosition:o.uMoonPosition||{value:new l.Vector2(.58,.705)},uMoonSize:o.uMoonSize||{value:.006},uMoonBrightness:o.uMoonBrightness||{value:2.5},uMoonBlur:o.uMoonBlur||{value:0},uCraterScale:o.uCraterScale||{value:.555},uCraterIntensity:o.uCraterIntensity||{value:.28},uFarMountainOffset:o.uFarMountainOffset||{value:0},uNearMountainOffset:o.uNearMountainOffset||{value:-.5}}});let a=new l.Mesh(Jo.plane,i);e.add(a),a.position.set(-55,-20,30),a.scale.setScalar(150),a.name="planeSky",a.visible=!1}function rd(e){const t=e.globalUniformsHub,o=t?t.uniforms:{},i=nt(e,as,{transparent:!0,uniforms:{rainGlassOpacity:o.rainGlassOpacity||{value:1},glassRainAmount:o.glassRainAmount||{value:1},uRimCenter:o.uRimCenter||{value:new l.Vector2(-.5,.5)},uRainOffset:o.uRainOffset||{value:0},uWaterIntensity:t?t.uWaterIntensity||{value:.2}:{value:.2},hasRimOnGlass:{value:!0}},blending:l.AdditiveBlending,side:l.FrontSide}),a={vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,uniforms:i.uniforms};In(a,i.uniforms),i.vertexShader=a.vertexShader,i.fragmentShader=a.fragmentShader;const r=e.getObjectByName("glass1"),n=e.getObjectByName("glass2");r&&(r.material=i),n&&(n.material=i)}var fl,sd=J((()=>{Wt(),Gi(),ei(),wt(),qu(),hs(),Xu(),ct(),Zu(),so(),$i(),Ao(),ed(),cl(),td(),Rn(),ut(),id(),Mn(),lt(),_t("#dcd0ba",.85,.03,6.5),io("#dcd0ba",1,1),fl=class{constructor(e,t,o,i){this.scene=e,this.camera=t,this.renderer=o,this.model=null,this.mixer=null,this.constantUniform=Eo,this.resources=i}async init(e,t,o={}){return new Promise(async(i,a)=>{const r=this.resources.roomModel;if(!r){const s="Resources: Room Model not loaded.";console.error(s),e&&Ue(window.loadingProgress||0,Z("SYS_ERROR")),a(s);return}let n;try{e&&Ue(window.loadingProgress||0,Z("SYS_INIT_SCENE")),Qe("model-assembly",.1),this.model=r.scene,this.model.name="roomGLBModel",this.model.visible=!1,this.scene.add(this.model),this.scene.room=this.model,this.scene.animations=r.animations,this.boxUpdater=od(this.model,this.scene),this.scene.conversationManager=this.boxUpdater;const s=["leftWallFoot001","Cube004","shelf","glass1","Object_17","Object_1001_1","Object_8001","glass1","pillow-big-2","pillow-small-2","pillow-small-1","pillow-big-1","bedMain","Ch23_Hair","Ch23_Suit","Object_15"],c=["Object_1001_1","Object_8001","Object_17","leftWallFoot001"];this.model.getObjectByName("inviMesh").material.visible=!1;const u=[this.model];let d=0,m=performance.now();for(;u.length>0;){const g=u.pop();if(g.isMesh&&(g.material.side=l.FrontSide,s.includes(g.name)&&(g.receiveShadow=!0),c.includes(g.name)||g.name.startsWith("book")?g.castShadow=!1:g.castShadow=!0),g.children)for(let w=g.children.length-1;w>=0;w--)u.push(g.children[w]);d++,d%50===0&&performance.now()-m>4&&(await qi(),m=performance.now())}if(this.mixer=r.mixer,this.scene.mixer=r.mixer,this.scene.heroClips=r.heroClips,this.scene.activeAction=r.activeAction,this.mixer&&this.scene.animations){const g=l.AnimationClip.findByName(this.scene.animations,"3|PlaneAction");g&&(this.scene.fanAction=this.mixer.clipAction(g),this.scene.fanAction.play())}he.start("Helpers Setup"),Yu(this.scene),ad(this.scene),nd(this.scene),rd(this.scene),vc(this.scene),ju(this.scene);let f=Qu(this.scene);this.scene.getObjectByName("blackholeScene").attach(f),he.end("Helpers Setup"),he.start("Adjust Objects"),Ac(this.scene,e).then(()=>(he.end("Adjust Objects"),he.start("Bind Physics"),Ju(this.scene,e))).then(async()=>(he.end("Bind Physics"),Qe("physics-binding",.9),await Pc(this.scene),Qe("physics-binding",1),tu(this.scene),this.scene.constantUniform=Eo,e&&Ue(window.loadingProgress||0,Z("SYS_FINALIZE")),Promise.resolve())).then(()=>{Ue(100),clearInterval(n),this.model&&this.model.position.set(0,-5e4,0),i()}).catch(g=>{console.error("Critical error in async chain:",g),a(g)})}catch(s){console.error("Critical error during scene initialisation:",s),a(s)}finally{window.completeTask&&(completeTask("model-assembly"),completeTask("physics-binding"))}})}updateAnimationMixer(e){this.mixer&&this.mixer.update(e),this.boxUpdater&&this.boxUpdater.update(e)}}}));async function ld({scene:e,camera:t,orbitControl:o,clock:i,pointsApp:a}){e.targetAnimHz=30,ai(e,0),Su(e,pl*.05),re(Z("SYS_INIT")),re(Z("ENV_CALIBRATION")),await mu(),re(Z("SYS_PILOT_ENTRY_WAIT")),await hu(),await Fe(200),e.isTransitioning=!0,e.HUD&&typeof e.HUD.breathe=="function"&&e.HUD.breathe(de.ELECTRIC_CYAN);const r=se.currentMode;e.fpsStats&&e.fpsStats.avg<45&&(e.isLowPowerMode=!0),re(`Protocol ${r.toUpperCase()} verified.`);const n=document.getElementById("cv-container");n&&n.classList.contains("collapsed")&&(n.classList.remove("collapsed"),window.dispatchEvent(new CustomEvent("cvToggle",{detail:{collapsed:!1}})),await Fe(500)),e.HUD&&typeof e.HUD.runTweenOpen=="function"&&(await e.HUD.runTweenOpen(1500,{isIncludedIsland:!1,isIncludedDecos:!1}),e.HUD.runTweenShowIsland(2500),_o.onHudOpen(e),e.HUD.runTweenShowDecos(1e3)),a&&(a.playIntro(),a.activateScrollInteractions(),a.triggerStep&&a.triggerStep(0,1500,!0)),re(Z("SYS_BUILD_START")),setTimeout(()=>{e.isTransitioning=!1},1e3)}var pl,cd=J((()=>{ut(),co(),pt(),lt(),En(),$i(),et(),ji(),pl=Un}));function ud(e,t){if(!e)return console.warn("[knowhere] Parent not found. Skipping."),null;const o=new l.PlaneGeometry(1,1),i=nt(t,hl,{transparent:!0,blending:l.NormalBlending,side:l.DoubleSide,depthTest:!0,depthWrite:!1,vs:ml});i.uniforms&&(i.uniforms.uScaleFactor={value:0},i.uniforms.uHudOffset={value:new l.Vector2(0,1.2)},i.uniforms.uStarScreenPos={value:new l.Vector2(0,0)});const a=new l.Mesh(o,i);return a.name="knowhere",a.scale.set(10,10,1),a.frustumCulled=!1,e.add(a),t.knowhere=a,a}var ml,hl,dd=J((()=>{Ao(),wt(),ml=`
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
`,hl=`
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
`})),fd=J((()=>{})),Mi,pd=J((()=>{Mi=class ja extends Ul{constructor(t,o,i,a){super(),this.strength=o!==void 0?o:1,this.radius=i,this.threshold=a,this.resolution=t!==void 0?new gt(t.x,t.y):new gt(256,256),this.clearColor=new Ai(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),n=Math.round(this.resolution.y/2);this.renderTargetBright=new ta(r,n),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let m=0;m<this.nMips;m++){const f=new ta(r,n);f.texture.name="UnrealBloomPass.h"+m,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);const g=new ta(r,n);g.texture.name="UnrealBloomPass.v"+m,g.texture.generateMipmaps=!1,this.renderTargetsVertical.push(g),r=Math.round(r/2),n=Math.round(n/2)}Xn===void 0&&console.error("THREE.UnrealBloomPass relies on LuminosityHighPassShader");const s=Xn;this.highPassUniforms=$n.clone(s.uniforms),this.highPassUniforms.luminosityThreshold.value=a,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new ni({uniforms:this.highPassUniforms,vertexShader:s.vertexShader,fragmentShader:s.fragmentShader,defines:{}}),this.separableBlurMaterials=[];const c=[3,5,7,9,11];r=Math.round(this.resolution.x/2),n=Math.round(this.resolution.y/2);for(let m=0;m<this.nMips;m++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(c[m])),this.separableBlurMaterials[m].uniforms.texSize.value=new gt(r,n),r=Math.round(r/2),n=Math.round(n/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=o,this.compositeMaterial.uniforms.bloomRadius.value=.1,this.compositeMaterial.needsUpdate=!0;const u=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=u,this.bloomTintColors=[new Ft(1,1,1),new Ft(1,1,1),new Ft(1,1,1),new Ft(1,1,1),new Ft(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,jn===void 0&&console.error("THREE.UnrealBloomPass relies on CopyShader");const d=jn;this.copyUniforms=$n.clone(d.uniforms),this.copyUniforms.opacity.value=1,this.materialCopy=new ni({uniforms:this.copyUniforms,vertexShader:d.vertexShader,fragmentShader:d.fragmentShader,blending:Dr,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new Ai,this.oldClearAlpha=1,this.basic=new Nr({transparent:!0}),this.fsQuad=new kl(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose()}setSize(t,o){let i=Math.round(t/2),a=Math.round(o/2);this.renderTargetBright.setSize(i,a);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(i,a),this.renderTargetsVertical[r].setSize(i,a),this.separableBlurMaterials[r].uniforms.texSize.value=new gt(i,a),i=Math.round(i/2),a=Math.round(a/2)}render(t,o,i,a,r){t.getClearColor(this._oldClearColor),this.oldClearAlpha=t.getClearAlpha();const n=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=i.texture,t.setRenderTarget(null),t.clear(),this.fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this.fsQuad.render(t);let s=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this.fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[c].uniforms.direction.value=ja.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[c]),t.clear(),this.fsQuad.render(t),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=ja.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[c]),t.clear(),this.fsQuad.render(t),s=this.renderTargetsVertical[c];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this.fsQuad.render(t),this.fsQuad.material=this.materialCopy,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(i),this.fsQuad.render(t)),t.setClearColor(this._oldClearColor,this.oldClearAlpha),t.autoClear=n}getSeperableBlurMaterial(t){return new ni({defines:{KERNEL_RADIUS:t,SIGMA:t},uniforms:{colorTexture:{value:null},texSize:{value:new gt(.5,.5)},direction:{value:new gt(.5,.5)}},vertexShader:`varying vec2 vUv;
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
				}`})}getCompositeMaterial(t){return new ni({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},dirtTexture:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}},Mi.BlurDirectionX=new gt(1,0),Mi.BlurDirectionY=new gt(0,1)}));function md({material:e,bloomPass:t,TWEEN:o,MORPH_DURATION:i,DEFAULT_VIBRATE_AMPLITUDE:a,DEFAULT_SIZE_THRESHOLD:r,DEFAULT_VIBRATE_BOOST_SIZE_THRESHOLD:n,POINT_SIZE:s,UI_WIDTH:c,UI_TOP:u,UI_RIGHT:d,speed:m,hoverEffect:f,mouseDamping:g,pointReturnSpeed:w,onStart:y,onComplete:S}){const T=[];function M(L,B,z){Math.abs(B-z)>1e-4?(L.style.backgroundColor="#ff9800",L.style.color="#000"):(L.style.backgroundColor="",L.style.color="")}const O=document.createElement("div");O.style.position="absolute",O.style.top=u,O.style.right=d,O.style.backgroundColor="rgba(0, 0, 0, 0.7)",O.style.padding="15px",O.style.borderRadius="8px",O.style.color="white",O.style.fontFamily="sans-serif",O.style.width=c,O.style.maxHeight="80vh",O.style.overflowY="auto",O.style.zIndex="100";const _=document.createElement("div");_.style.display="flex",_.style.justifyContent="space-between",_.style.alignItems="center",_.style.marginBottom="8px";const v=document.createElement("div");v.innerText="Controls",v.style.fontWeight="bold",v.style.fontSize="14px",v.style.color="white";const P=document.createElement("div");P.style.display="flex",P.style.gap="8px",P.style.alignItems="center";const A=document.createElement("button");A.type="button",A.innerText="Show",A.style.fontSize="12px",A.style.padding="4px 8px",A.style.cursor="pointer",A.style.background="#222",A.style.color="white",A.style.border="1px solid #444",A.style.borderRadius="4px";const F=document.createElement("div"),G=document.createElement("button");G.type="button",G.innerText="Ref",G.title="Force Update Sliders",G.style.fontSize="12px",G.style.padding="4px 8px",G.style.cursor="pointer",G.style.background="#222",G.style.color="white",G.style.border="1px solid #444",G.style.borderRadius="4px",G.addEventListener("click",()=>{T.forEach(L=>L())}),P.appendChild(F),P.appendChild(G),P.appendChild(A),_.appendChild(v),_.appendChild(P),O.appendChild(_);const V=document.createElement("div");V.style.display="none",O.appendChild(V),A.addEventListener("click",()=>{V.style.display==="none"?(V.style.display="block",A.innerText="Hide",T.forEach(L=>L())):(V.style.display="none",A.innerText="Show")});const h=document.createElement("div");h.innerText="Model Controls",h.style.marginBottom="10px",h.style.fontWeight="bold",V.appendChild(h),(()=>{const L=document.createElement("div");L.style.marginTop="8px";const B=document.createElement("div");B.style.display="flex",B.style.alignItems="center",B.style.justifyContent="space-between";let z=1;e&&e.uniforms&&e.uniforms.uModelScale&&(z=e.uniforms.uModelScale.value);const U=document.createElement("span");U.innerText=`Model Scale: ${z.toFixed(2)}`,U.style.fontSize="12px";const E=document.createElement("input");E.type="number",E.min="0.1",E.max="5.0",E.step="0.01",E.value=z.toString(),E.style.width="70px",E.style.marginLeft="8px",B.appendChild(U),B.appendChild(E);const k=document.createElement("button");k.type="button",k.innerText="Reset",k.style.marginLeft="6px",k.style.fontSize="11px",k.style.padding="2px 6px",k.addEventListener("click",()=>H(1)),B.appendChild(k);const I=document.createElement("input");I.type="range",I.min="0.1",I.max="5.0",I.step="0.01",I.value=z.toString(),I.style.width="100%",I.style.cursor="pointer";const Y=()=>{if(e&&e.uniforms&&e.uniforms.uModelScale){const D=e.uniforms.uModelScale.value;U.innerText=`Model Scale: ${D.toFixed(2)}`,E.value=D,I.value=D}};T.push(Y);function H(D){const W=parseFloat(D)||1;U.innerText=`Model Scale: ${W.toFixed(2)}`,E.value=W,I.value=W,M(E,W,z),e&&e.uniforms&&e.uniforms.uModelScale&&(e.uniforms.uModelScale.value=W)}I.addEventListener("input",D=>H(D.target.value)),E.addEventListener("input",D=>H(D.target.value)),L.appendChild(B),L.appendChild(I),V.appendChild(L)})(),(()=>{const L=document.createElement("div");L.style.marginTop="12px";const B=document.createElement("div");B.style.display="flex",B.style.alignItems="center",B.style.justifyContent="space-between",B.style.marginBottom="4px";const z=document.createElement("div");z.innerText="Model Rotation",z.style.fontSize="12px",z.style.fontWeight="bold";const U=document.createElement("label");U.style.fontSize="11px",U.style.display="flex",U.style.alignItems="center",U.innerText="Mouse Rot";const E=document.createElement("input");E.type="checkbox",E.style.marginLeft="5px",E.checked=!0,e&&e.uniforms&&e.uniforms.uEnableMouseRotation&&(E.checked=e.uniforms.uEnableMouseRotation.value),E.addEventListener("change",k=>{const I=k.target.checked;e&&e.uniforms&&e.uniforms.uEnableMouseRotation&&(e.uniforms.uEnableMouseRotation.value=I)}),U.appendChild(E),B.appendChild(z),B.appendChild(U),L.appendChild(B),["x","y","z"].forEach(k=>{const I=document.createElement("div");I.style.marginBottom="4px";const Y=document.createElement("div");Y.style.display="flex",Y.style.justifyContent="space-between",Y.style.alignItems="center";const H=document.createElement("span");H.innerText=k.toUpperCase(),H.style.fontSize="11px";const D=document.createElement("div");D.style.display="flex",D.style.alignItems="center",D.style.gap="6px";const W=document.createElement("span");W.style.fontSize="11px";const Q=document.createElement("button");Q.type="button",Q.innerText="R",Q.title="Reset to 0",Q.style.fontSize="10px",Q.style.padding="1px 4px",Q.style.cursor="pointer",D.appendChild(W),D.appendChild(Q),Y.appendChild(H),Y.appendChild(D),I.appendChild(Y);const j=document.createElement("input");j.type="range",j.min="-6.28",j.max="6.28",j.step="0.01",j.value="0",j.style.width="100%",j.style.cursor="pointer";const ee=()=>{if(e&&e.uniforms&&e.uniforms.uModelRotation){const ae=e.uniforms.uModelRotation.value[k];j.value=ae,W.innerText=ae.toFixed(2),M(W,ae,0)}};T.push(ee),e&&e.uniforms&&e.uniforms.uModelRotation&&(j.value=e.uniforms.uModelRotation.value[k]),W.innerText=parseFloat(j.value).toFixed(2),j.addEventListener("input",ae=>{const le=parseFloat(ae.target.value);W.innerText=le.toFixed(2),M(W,le,0),e&&e.uniforms&&e.uniforms.uModelRotation&&(e.uniforms.uModelRotation.value[k]=le)}),Q.addEventListener("click",()=>{j.value=0,W.innerText=0 .toFixed(2),M(W,0,0),e&&e.uniforms&&e.uniforms.uModelRotation&&(e.uniforms.uModelRotation.value[k]=0)}),I.appendChild(j),L.appendChild(I)}),V.appendChild(L)})(),(()=>{const L=document.createElement("div");L.style.marginTop="15px";const B=document.createElement("div");B.innerText="Model Offset (Screen)",B.style.marginBottom="5px",B.style.fontWeight="bold",B.style.fontSize="12px",L.appendChild(B);const z=(U,E)=>{const k=document.createElement("div");k.style.display="flex",k.style.alignItems="center",k.style.justifyContent="space-between",k.style.marginBottom="5px";let I=0;e&&e.uniforms&&e.uniforms.uModelScreenOffset&&(I=e.uniforms.uModelScreenOffset.value[E]);const Y=document.createElement("span");Y.innerText=`${U}: ${I.toFixed(2)}`,Y.style.fontSize="12px";const H=document.createElement("input");H.type="number",H.min="-1.0",H.max="1.0",H.step="0.01",H.value=I.toString(),H.style.width="70px",H.style.marginLeft="8px",k.appendChild(Y),k.appendChild(H);const D=document.createElement("button");D.type="button",D.innerText="Reset",D.style.marginLeft="6px",D.style.fontSize="11px",D.style.padding="2px 6px",D.addEventListener("click",()=>j(0)),k.appendChild(D);const W=document.createElement("input");W.type="range",W.min="-1.0",W.max="1.0",W.step="0.01",W.value=I.toString(),W.style.width="100%",W.style.cursor="pointer";const Q=()=>{if(e&&e.uniforms&&e.uniforms.uModelScreenOffset){const ee=e.uniforms.uModelScreenOffset.value[E];Y.innerText=`${U}: ${ee.toFixed(2)}`,H.value=ee,W.value=ee}};T.push(Q);function j(ee){const ae=parseFloat(ee)||0;Y.innerText=`${U}: ${ae.toFixed(2)}`,H.value=ae,W.value=ae,M(H,ae,I),e&&e.uniforms&&e.uniforms.uModelScreenOffset&&(e.uniforms.uModelScreenOffset.value[E]=ae)}W.addEventListener("input",ee=>j(ee.target.value)),H.addEventListener("input",ee=>j(ee.target.value)),L.appendChild(k),L.appendChild(W)};z("X","x"),z("Y","y"),V.appendChild(L)})(),(()=>{const L=document.createElement("div");L.style.marginBottom="10px";const B=document.createElement("div");B.innerText="Model Position (World Space)",B.style.fontSize="12px",B.style.fontWeight="bold",B.style.marginBottom="6px",L.appendChild(B);const z=(U,E)=>{const k=document.createElement("div");k.style.marginBottom="5px";const I=document.createElement("div");I.style.display="flex",I.style.justifyContent="space-between",I.style.alignItems="center";const Y=document.createElement("span");Y.innerText=U,Y.style.fontSize="12px";const H=document.createElement("div");H.style.display="flex",H.style.alignItems="center",H.style.gap="6px";let D=0;e&&e.uniforms&&e.uniforms.uModelPosition&&(D=e.uniforms.uModelPosition.value[E]);const W=document.createElement("span");W.innerText=D.toFixed(2),W.style.fontSize="11px";const Q=document.createElement("button");Q.type="button",Q.innerText="R",Q.title="Reset to 0",Q.style.fontSize="10px",Q.style.padding="1px 4px",Q.style.cursor="pointer",H.appendChild(W),H.appendChild(Q),I.appendChild(Y),I.appendChild(H),k.appendChild(I);const j=document.createElement("input");j.type="range",j.min="-50.0",j.max="50.0",j.step="0.1",j.value=D.toString(),j.style.width="100%",j.style.cursor="pointer";const ee=()=>{if(e&&e.uniforms&&e.uniforms.uModelPosition){const le=e.uniforms.uModelPosition.value[E];W.innerText=le.toFixed(2),j.value=le}};T.push(ee);function ae(le){const ve=parseFloat(le)||0;W.innerText=ve.toFixed(2),e&&e.uniforms&&e.uniforms.uModelPosition&&(e.uniforms.uModelPosition.value[E]=ve)}j.addEventListener("input",le=>ae(le.target.value)),Q.addEventListener("click",()=>{j.value="0",ae(0)}),L.appendChild(k),L.appendChild(j)};z("X","x"),z("Y","y"),z("Z","z"),V.appendChild(L)})(),(()=>{const L=document.createElement("div");L.style.marginTop="10px";const B=document.createElement("div");B.style.display="flex",B.style.alignItems="center",B.style.justifyContent="space-between";const z=e&&e.uniforms&&e.uniforms.uModelVibFactor?e.uniforms.uModelVibFactor.value:1,U=document.createElement("span");U.innerText=`Model Vib Factor: ${z.toFixed(2)}`,U.style.fontSize="12px";const E=document.createElement("input");E.type="number",E.min="0.0",E.max="10.0",E.step="0.1",E.value=z.toString(),E.style.width="70px",E.style.marginLeft="8px",B.appendChild(U),B.appendChild(E);const k=document.createElement("button");k.type="button",k.innerText="Reset",k.style.marginLeft="6px",k.style.fontSize="11px",k.style.padding="2px 6px",k.addEventListener("click",()=>H(1)),B.appendChild(k);const I=document.createElement("input");I.type="range",I.min="0.0",I.max="10.0",I.step="0.1",I.value=z.toString(),I.style.width="100%",I.style.cursor="pointer";const Y=()=>{if(e&&e.uniforms&&e.uniforms.uModelVibFactor){const D=e.uniforms.uModelVibFactor.value;U.innerText=`Model Vib Factor: ${D.toFixed(2)}`,E.value=D,I.value=D}};T.push(Y);function H(D){const W=parseFloat(D)||0;U.innerText=`Model Vib Factor: ${W.toFixed(2)}`,E.value=W,I.value=W,M(E,W,1),e&&e.uniforms&&e.uniforms.uModelVibFactor&&(e.uniforms.uModelVibFactor.value=W)}I.addEventListener("input",D=>H(D.target.value)),E.addEventListener("input",D=>H(D.target.value)),L.appendChild(B),L.appendChild(I),V.appendChild(L)})(),(()=>{const L=document.createElement("div");L.style.marginTop="10px";const B=document.createElement("div");B.style.display="flex",B.style.alignItems="center",B.style.justifyContent="space-between";const z=e&&e.uniforms&&e.uniforms.uModelPointSizeFactor?e.uniforms.uModelPointSizeFactor.value:1,U=document.createElement("span");U.innerText=`Model Size Factor: ${z.toFixed(2)}`,U.style.fontSize="12px";const E=document.createElement("input");E.type="number",E.min="0.0",E.max="5.0",E.step="0.1",E.value=z.toString(),E.style.width="70px",E.style.marginLeft="8px",B.appendChild(U),B.appendChild(E);const k=document.createElement("button");k.type="button",k.innerText="Reset",k.style.marginLeft="6px",k.style.fontSize="11px",k.style.padding="2px 6px",k.addEventListener("click",()=>H(1)),B.appendChild(k);const I=document.createElement("input");I.type="range",I.min="0.0",I.max="5.0",I.step="0.1",I.value=z.toString(),I.style.width="100%",I.style.cursor="pointer";const Y=()=>{if(e&&e.uniforms&&e.uniforms.uModelPointSizeFactor){const D=e.uniforms.uModelPointSizeFactor.value;U.innerText=`Model Size Factor: ${D.toFixed(2)}`,E.value=D,I.value=D}};T.push(Y);function H(D){const W=parseFloat(D)||0;U.innerText=`Model Size Factor: ${W.toFixed(2)}`,E.value=W,I.value=W,M(E,W,1),e&&e.uniforms&&e.uniforms.uModelPointSizeFactor&&(e.uniforms.uModelPointSizeFactor.value=W)}I.addEventListener("input",D=>H(D.target.value)),E.addEventListener("input",D=>H(D.target.value)),L.appendChild(B),L.appendChild(I),V.appendChild(L)})(),(()=>{const L=document.createElement("div");L.style.marginTop="15px",L.style.marginBottom="10px";const B=document.createElement("div");B.style.display="flex",B.style.alignItems="center",B.style.justifyContent="space-between";const z=e&&e.uniforms&&e.uniforms.uGridZ?e.uniforms.uGridZ.value:-40,U=document.createElement("span");U.innerText=`Grid Z: ${z.toFixed(1)}`,U.style.fontSize="12px",U.style.fontWeight="bold";const E=document.createElement("input");E.type="number",E.min="-2000.0",E.max="2000.0",E.step="0.1",E.value=z.toString(),E.style.width="70px",E.style.marginLeft="8px",B.appendChild(U),B.appendChild(E);const k=document.createElement("button");k.type="button",k.innerText="Reset",k.style.marginLeft="6px",k.style.fontSize="11px",k.style.padding="2px 6px",k.addEventListener("click",()=>H(z)),B.appendChild(k);const I=document.createElement("input");I.type="range",I.min="-2000.0",I.max="2000.0",I.step="0.1",I.value=z.toString(),I.style.width="100%",I.style.cursor="pointer";const Y=()=>{if(e&&e.uniforms&&e.uniforms.uGridZ){const D=e.uniforms.uGridZ.value;U.innerText=`Grid Z: ${D.toFixed(1)}`,E.value=D,I.value=D}};T.push(Y);function H(D){const W=parseFloat(D)||-40;E.value=W,I.value=W,M(E,W,z),e&&e.uniforms&&e.uniforms.uGridZ&&(e.uniforms.uGridZ.value=W,U.innerText=`Grid Z: ${W.toFixed(1)}`)}I.addEventListener("input",D=>H(D.target.value)),E.addEventListener("input",D=>H(D.target.value)),L.appendChild(B),L.appendChild(I),V.appendChild(L)})(),(()=>{const L=document.createElement("div");L.style.marginTop="10px",L.style.marginBottom="10px";const B=document.createElement("div");B.style.display="flex",B.style.alignItems="center",B.style.justifyContent="space-between";const z=e&&e.uniforms&&e.uniforms.uHoverPointScaleFactor?e.uniforms.uHoverPointScaleFactor.value:1,U=document.createElement("span");U.innerText=`Hover Scale: ${z.toFixed(2)}`,U.style.fontSize="12px";const E=document.createElement("input");E.type="number",E.min="0.0",E.max="10.0",E.step="0.1",E.value=z.toString(),E.style.width="70px",E.style.marginLeft="8px",B.appendChild(U),B.appendChild(E);const k=document.createElement("button");k.type="button",k.innerText="Reset",k.style.marginLeft="6px",k.style.fontSize="11px",k.style.padding="2px 6px",k.addEventListener("click",()=>H(1)),B.appendChild(k);const I=document.createElement("input");I.type="range",I.min="0.0",I.max="10.0",I.step="0.1",I.value=z.toString(),I.style.width="100%",I.style.cursor="pointer";const Y=()=>{if(e&&e.uniforms&&e.uniforms.uHoverPointScaleFactor){const D=e.uniforms.uHoverPointScaleFactor.value;U.innerText=`Hover Scale: ${D.toFixed(2)}`,E.value=D,I.value=D}};T.push(Y);function H(D){const W=parseFloat(D)||0;U.innerText=`Hover Scale: ${W.toFixed(2)}`,E.value=W,I.value=W,M(E,W,1),e&&e.uniforms&&e.uniforms.uHoverPointScaleFactor&&(e.uniforms.uHoverPointScaleFactor.value=W)}I.addEventListener("input",D=>H(D.target.value)),E.addEventListener("input",D=>H(D.target.value)),L.appendChild(B),L.appendChild(I),V.appendChild(L)})(),(()=>{const L=document.createElement("div");L.style.marginTop="10px",L.style.marginBottom="10px";const B=document.createElement("div");B.style.display="flex",B.style.alignItems="center",B.style.justifyContent="space-between";const z=e&&e.uniforms&&e.uniforms.uAttractionForce?e.uniforms.uAttractionForce.value:0,U=document.createElement("span");U.innerText=`Attraction Force: ${z.toFixed(1)}`,U.style.fontSize="12px";const E=document.createElement("input");E.type="number",E.min="0.0",E.max="4000.0",E.step="0.5",E.value=z.toString(),E.style.width="70px",E.style.marginLeft="8px",B.appendChild(U),B.appendChild(E);const k=document.createElement("button");k.type="button",k.innerText="Reset",k.style.marginLeft="6px",k.style.fontSize="11px",k.style.padding="2px 6px",k.addEventListener("click",()=>H(800)),B.appendChild(k);const I=document.createElement("input");I.type="range",I.min="0.0",I.max="4000.0",I.step="0.5",I.value=z.toString(),I.style.width="100%",I.style.cursor="pointer";const Y=()=>{if(e&&e.uniforms&&e.uniforms.uAttractionForce){const D=e.uniforms.uAttractionForce.value;U.innerText=`Attraction Force: ${D.toFixed(1)}`,E.value=D,I.value=D}};T.push(Y);function H(D){const W=parseFloat(D)||0;U.innerText=`Attraction Force: ${W.toFixed(1)}`,E.value=W,I.value=W,M(E,W,800),e&&e.uniforms&&e.uniforms.uAttractionForce&&(e.uniforms.uAttractionForce.value=W)}I.addEventListener("input",D=>H(D.target.value)),E.addEventListener("input",D=>H(D.target.value)),L.appendChild(B),L.appendChild(I),V.appendChild(L)})(),(()=>{const L=document.createElement("div");L.style.marginTop="10px",L.style.marginBottom="10px";const B=document.createElement("div");B.style.display="flex",B.style.alignItems="center",B.style.justifyContent="space-between";const z=e&&e.uniforms&&e.uniforms.uAttractionRefSize?e.uniforms.uAttractionRefSize.value:15,U=document.createElement("span");U.innerText=`Mass Ref Size: ${z.toFixed(1)}`,U.title="Lower value = Heavier (More Stable)",U.style.fontSize="12px";const E=document.createElement("input");E.type="number",E.min="1.0",E.max="100.0",E.step="0.5",E.value=z.toString(),E.style.width="70px",E.style.marginLeft="8px",B.appendChild(U),B.appendChild(E);const k=document.createElement("button");k.type="button",k.innerText="Reset",k.style.marginLeft="6px",k.style.fontSize="11px",k.style.padding="2px 6px",k.addEventListener("click",()=>H(15)),B.appendChild(k);const I=document.createElement("input");I.type="range",I.min="1.0",I.max="100.0",I.step="0.5",I.value=z.toString(),I.style.width="100%",I.style.cursor="pointer";const Y=()=>{if(e&&e.uniforms&&e.uniforms.uAttractionRefSize){const D=e.uniforms.uAttractionRefSize.value;U.innerText=`Mass Ref Size: ${D.toFixed(1)}`,E.value=D,I.value=D}};T.push(Y);function H(D){const W=parseFloat(D)||15;U.innerText=`Mass Ref Size: ${W.toFixed(1)}`,E.value=W,I.value=W,M(E,W,15),e&&e.uniforms&&e.uniforms.uAttractionRefSize&&(e.uniforms.uAttractionRefSize.value=W)}I.addEventListener("input",D=>H(D.target.value)),E.addEventListener("input",D=>H(D.target.value)),L.appendChild(B),L.appendChild(I),V.appendChild(L)})(),(()=>{const L=document.createElement("div");L.style.marginTop="10px",L.style.marginBottom="10px";const B=document.createElement("div");B.style.display="flex",B.style.alignItems="center",B.style.justifyContent="space-between";const z=e&&e.uniforms&&e.uniforms.uAttractionRadius?e.uniforms.uAttractionRadius.value:600,U=document.createElement("span");U.innerText=`Attract Radius: ${z.toFixed(0)}`,U.title="Range of the suction pull",U.style.fontSize="12px";const E=document.createElement("input");E.type="number",E.min="0.0",E.max="2000.0",E.step="10",E.value=z.toString(),E.style.width="70px",E.style.marginLeft="8px",B.appendChild(U),B.appendChild(E);const k=document.createElement("button");k.type="button",k.innerText="Reset",k.style.marginLeft="6px",k.style.fontSize="11px",k.style.padding="2px 6px",k.addEventListener("click",()=>H(600)),B.appendChild(k);const I=document.createElement("input");I.type="range",I.min="0.0",I.max="2000.0",I.step="10",I.value=z.toString(),I.style.width="100%",I.style.cursor="pointer";const Y=()=>{if(e&&e.uniforms&&e.uniforms.uAttractionRadius){const D=e.uniforms.uAttractionRadius.value;U.innerText=`Attract Radius: ${D.toFixed(0)}`,E.value=D,I.value=D}};T.push(Y);function H(D){const W=parseFloat(D)||0;U.innerText=`Attract Radius: ${W.toFixed(0)}`,E.value=W,I.value=W,M(E,W,600),e&&e.uniforms&&e.uniforms.uAttractionRadius&&(e.uniforms.uAttractionRadius.value=W)}I.addEventListener("input",D=>H(D.target.value)),E.addEventListener("input",D=>H(D.target.value)),L.appendChild(B),L.appendChild(I),V.appendChild(L)})();const b=document.createElement("div");b.innerText="Lighting",b.style.marginTop="15px",b.style.marginBottom="10px",b.style.fontWeight="bold",V.appendChild(b);const p=(L,B)=>{const z=document.createElement("div");z.style.marginBottom="5px";const U=document.createElement("div");U.style.display="flex",U.style.alignItems="center",U.style.justifyContent="space-between";let E=1;e&&e.uniforms&&e.uniforms.uLightDir&&(E=e.uniforms.uLightDir.value[B]);const k=document.createElement("span");k.innerText=`${L}: ${E.toFixed(1)}`,k.style.fontSize="12px";const I=document.createElement("input");I.type="number",I.min="-100.0",I.max="100.0",I.step="0.1",I.value=E.toString(),I.style.width="70px",I.style.marginLeft="8px",U.appendChild(k),U.appendChild(I);const Y=document.createElement("button");Y.type="button",Y.innerText="Reset",Y.style.marginLeft="6px",Y.style.fontSize="11px",Y.style.padding="2px 6px",Y.addEventListener("click",()=>W(E)),U.appendChild(Y);const H=document.createElement("input");H.type="range",H.min="-100.0",H.max="100.0",H.step="0.1",H.value=E.toString(),H.style.width="100%",H.style.cursor="pointer";const D=()=>{if(e&&e.uniforms&&e.uniforms.uLightDir){const Q=e.uniforms.uLightDir.value[B];k.innerText=`${L}: ${Q.toFixed(1)}`,I.value=Q,H.value=Q}};T.push(D);function W(Q){const j=parseFloat(Q)||0;k.innerText=`${L}: ${j.toFixed(1)}`,I.value=j,H.value=j,M(I,j,E),e&&e.uniforms&&e.uniforms.uLightDir&&(e.uniforms.uLightDir.value[B]=j)}H.addEventListener("input",Q=>W(Q.target.value)),I.addEventListener("input",Q=>W(Q.target.value)),z.appendChild(U),z.appendChild(H),V.appendChild(z)};p("X","x"),p("Y","y"),p("Z","z"),(()=>{const L=document.createElement("div");L.style.marginTop="8px";const B=document.createElement("div");B.style.display="flex",B.style.alignItems="center",B.style.justifyContent="space-between";let z=1;e&&e.uniforms&&e.uniforms.uLightStrength&&(z=e.uniforms.uLightStrength.value);const U=document.createElement("span");U.innerText=`Light Strength: ${z.toFixed(2)}`,U.style.fontSize="12px";const E=document.createElement("input");E.type="number",E.min="0.0",E.max="10.0",E.step="0.01",E.value=z.toString(),E.style.width="70px",E.style.marginLeft="8px",B.appendChild(U),B.appendChild(E);const k=document.createElement("button");k.type="button",k.innerText="Reset",k.style.marginLeft="6px",k.style.fontSize="11px",k.style.padding="2px 6px",k.addEventListener("click",()=>H(z)),B.appendChild(k);const I=document.createElement("input");I.type="range",I.min="0.0",I.max="10.0",I.step="0.01",I.value=z.toString(),I.style.width="100%",I.style.cursor="pointer";const Y=()=>{if(e&&e.uniforms&&e.uniforms.uLightStrength){const D=e.uniforms.uLightStrength.value;U.innerText=`Light Strength: ${D.toFixed(2)}`,E.value=D,I.value=D}};T.push(Y);function H(D){const W=parseFloat(D)||0;U.innerText=`Light Strength: ${W.toFixed(2)}`,E.value=W,I.value=W,M(E,W,z),e&&e.uniforms&&e.uniforms.uLightStrength&&(e.uniforms.uLightStrength.value=W)}I.addEventListener("input",D=>H(D.target.value)),E.addEventListener("input",D=>H(D.target.value)),L.appendChild(B),L.appendChild(I),V.appendChild(L)})();const R=document.createElement("div");R.innerText="Bloom (Post-Process)",R.style.marginTop="15px",R.style.marginBottom="10px",R.style.fontWeight="bold",V.appendChild(R),(()=>{if(!t)return;const L=(B,z,U,E,k)=>{const I=document.createElement("div");I.style.marginBottom="8px";const Y=document.createElement("div");Y.style.display="flex",Y.style.alignItems="center",Y.style.justifyContent="space-between";const H=t[z],D=document.createElement("span");D.innerText=`${B}: ${H.toFixed(2)}`,D.style.fontSize="12px";const W=document.createElement("input");W.type="number",W.min=U,W.max=E,W.step=k,W.value=H.toString(),W.style.width="70px",W.style.marginLeft="8px",Y.appendChild(D),Y.appendChild(W);const Q=document.createElement("button");Q.type="button",Q.innerText="Reset",Q.style.marginLeft="6px",Q.style.fontSize="11px",Q.style.padding="2px 6px",Q.addEventListener("click",()=>ae(H)),Y.appendChild(Q);const j=document.createElement("input");j.type="range",j.min=U,j.max=E,j.step=k,j.value=H.toString(),j.style.width="100%",j.style.cursor="pointer";const ee=()=>{const le=t[z];D.innerText=`${B}: ${le.toFixed(2)}`,W.value=le,j.value=le};T.push(ee);function ae(le){const ve=parseFloat(le)||0;D.innerText=`${B}: ${ve.toFixed(2)}`,W.value=ve,j.value=ve,M(W,ve,H),t[z]=ve}j.addEventListener("input",le=>ae(le.target.value)),W.addEventListener("input",le=>ae(le.target.value)),I.appendChild(Y),I.appendChild(j),V.appendChild(I)};L("Strength","strength","0.0","5.0","0.01"),L("Radius","radius","0.0","2.0","0.01"),L("Threshold","threshold","0.0","1.0","0.01")})(),(()=>{const L=document.createElement("div");L.style.marginTop="8px";const B=document.createElement("div");B.style.display="flex",B.style.alignItems="center",B.style.justifyContent="space-between";let z=1.5;e&&e.uniforms&&e.uniforms.uLightSizeBoost&&(z=e.uniforms.uLightSizeBoost.value);const U=document.createElement("span");U.innerText=`Light Size Boost: ${z.toFixed(2)}`,U.style.fontSize="12px";const E=document.createElement("input");E.type="number",E.min="0.0",E.max="10.0",E.step="0.01",E.value=z.toString(),E.style.width="70px",E.style.marginLeft="8px",B.appendChild(U),B.appendChild(E);const k=document.createElement("button");k.type="button",k.innerText="Reset",k.style.marginLeft="6px",k.style.fontSize="11px",k.style.padding="2px 6px",k.addEventListener("click",()=>H(z)),B.appendChild(k);const I=document.createElement("input");I.type="range",I.min="0.0",I.max="10.0",I.step="0.01",I.value=z.toString(),I.style.width="100%",I.style.cursor="pointer";const Y=()=>{if(e&&e.uniforms&&e.uniforms.uLightSizeBoost){const D=e.uniforms.uLightSizeBoost.value;U.innerText=`Light Size Boost: ${D.toFixed(2)}`,E.value=D,I.value=D}};T.push(Y);function H(D){const W=parseFloat(D)||0;U.innerText=`Light Size Boost: ${W.toFixed(2)}`,E.value=W,I.value=W,M(E,W,z),e&&e.uniforms&&e.uniforms.uLightSizeBoost&&(e.uniforms.uLightSizeBoost.value=W)}I.addEventListener("input",D=>H(D.target.value)),E.addEventListener("input",D=>H(D.target.value)),L.appendChild(B),L.appendChild(I),V.appendChild(L)})();const C=document.createElement("div");C.innerText="Appearance",C.style.marginTop="15px",C.style.marginBottom="10px",C.style.fontWeight="bold",V.appendChild(C),(()=>{const L=document.createElement("div");L.style.marginTop="8px";const B=document.createElement("div");B.style.display="flex",B.style.alignItems="center",B.style.justifyContent="space-between";const z=document.createElement("span");z.innerText=`Point Size: ${s.toFixed(3)}`,z.style.fontSize="12px";const U=document.createElement("input");U.type="number",U.min="0.001",U.max="0.01",U.step="0.0001",U.value=s.toString(),U.style.width="70px",U.style.marginLeft="8px",B.appendChild(z),B.appendChild(U);const E=document.createElement("button");E.type="button",E.innerText="Reset",E.style.marginLeft="6px",E.style.fontSize="11px",E.style.padding="2px 6px",E.addEventListener("click",()=>Y(s)),B.appendChild(E);const k=document.createElement("input");k.type="range",k.min="0.0",k.max="0.2",k.step="0.001",k.value=s.toString(),k.style.width="100%",k.style.cursor="pointer";const I=()=>{if(e&&e.uniforms&&e.uniforms.uSize){const H=e.uniforms.uSize.value;z.innerText=`Point Size: ${H.toFixed(3)}`,U.value=H,k.value=H}};T.push(I);function Y(H){const D=parseFloat(H)||0;z.innerText=`Point Size: ${D.toFixed(3)}`,U.value=D,k.value=D,M(U,D,s),e&&e.uniforms&&e.uniforms.uSize&&(e.uniforms.uSize.value=D)}k.addEventListener("input",H=>Y(H.target.value)),U.addEventListener("input",H=>Y(H.target.value)),L.appendChild(B),L.appendChild(k),V.appendChild(L)})(),(()=>{const L=document.createElement("div");L.style.marginTop="8px";const B=document.createElement("div");B.style.display="flex",B.style.alignItems="center",B.style.justifyContent="space-between";const z=e&&e.uniforms&&e.uniforms.uSizeThreshold?e.uniforms.uSizeThreshold.value:r,U=document.createElement("span");U.innerText=`Size Threshold: ${z.toFixed(2)}`,U.style.fontSize="12px";const E=document.createElement("input");E.type="number",E.min="0.0",E.max="100.0",E.step="0.1",E.value=z.toString(),E.style.width="70px",E.style.marginLeft="8px",B.appendChild(U),B.appendChild(E);const k=document.createElement("button");k.type="button",k.innerText="Reset",k.style.marginLeft="6px",k.style.fontSize="11px",k.style.padding="2px 6px",k.addEventListener("click",()=>H(z)),B.appendChild(k);const I=document.createElement("input");I.type="range",I.min="0.0",I.max="100.0",I.step="0.1",I.value=z.toString(),I.style.width="100%",I.style.cursor="pointer";const Y=()=>{if(e&&e.uniforms&&e.uniforms.uSizeThreshold){const D=e.uniforms.uSizeThreshold.value;U.innerText=`Size Threshold: ${D.toFixed(2)}`,E.value=D,I.value=D}};T.push(Y);function H(D){const W=parseFloat(D)||0;U.innerText=`Size Threshold: ${W.toFixed(2)}`,E.value=W,I.value=W,M(E,W,r),e&&e.uniforms&&e.uniforms.uSizeThreshold&&(e.uniforms.uSizeThreshold.value=W)}I.addEventListener("input",D=>H(D.target.value)),E.addEventListener("input",D=>H(D.target.value)),L.appendChild(B),L.appendChild(I),V.appendChild(L)})(),(()=>{const L=e&&e.uniforms&&e.uniforms.uPixelRatio?e.uniforms.uPixelRatio.value:1,B=document.createElement("div");B.style.marginTop="8px";const z=document.createElement("div");z.style.display="flex",z.style.alignItems="center",z.style.justifyContent="space-between";const U=document.createElement("span");U.innerText=`Pixel Ratio: ${L.toFixed(2)}`,U.style.fontSize="12px";const E=document.createElement("input");E.type="number",E.min="0.5",E.max="4.0",E.step="0.01",E.value=L.toString(),E.style.width="70px",E.style.marginLeft="8px",z.appendChild(U),z.appendChild(E);const k=document.createElement("button");k.type="button",k.innerText="Reset",k.style.marginLeft="6px",k.style.fontSize="11px",k.style.padding="2px 6px",k.addEventListener("click",()=>H(L)),z.appendChild(k);const I=document.createElement("input");I.type="range",I.min="0.5",I.max="4.0",I.step="0.1",I.value=L.toString(),I.style.width="100%",I.style.cursor="pointer";const Y=()=>{if(e&&e.uniforms&&e.uniforms.uPixelRatio){const D=e.uniforms.uPixelRatio.value;U.innerText=`Pixel Ratio: ${D.toFixed(2)}`,E.value=D,I.value=D}};T.push(Y);function H(D){const W=parseFloat(D)||0;U.innerText=`Pixel Ratio: ${W.toFixed(2)}`,E.value=W,I.value=W,M(E,W,L),e&&e.uniforms&&e.uniforms.uPixelRatio&&(e.uniforms.uPixelRatio.value=W)}I.addEventListener("input",D=>H(D.target.value)),E.addEventListener("input",D=>H(D.target.value)),B.appendChild(z),B.appendChild(I),V.appendChild(B)})();const N=document.createElement("div");N.innerText="Dynamics",N.style.marginTop="15px",N.style.marginBottom="10px",N.style.fontWeight="bold",V.appendChild(N),(()=>{const L=document.createElement("div");L.style.marginTop="8px";const B=document.createElement("div");B.style.display="flex",B.style.alignItems="center",B.style.justifyContent="space-between";const z=e&&e.uniforms&&e.uniforms.uVibrateAmp?e.uniforms.uVibrateAmp.value:0,U=document.createElement("span");U.innerText=`Vibration: ${z.toFixed(2)}`,U.style.fontSize="12px";const E=document.createElement("input");E.type="number",E.min="0.0",E.max="5.0",E.step="0.01",E.value=z.toString(),E.style.width="70px",E.style.marginLeft="8px",B.appendChild(U),B.appendChild(E);const k=document.createElement("button");k.type="button",k.innerText="Reset",k.style.marginLeft="6px",k.style.fontSize="11px",k.style.padding="2px 6px",k.addEventListener("click",()=>H(z)),B.appendChild(k);const I=document.createElement("input");I.type="range",I.min="0.0",I.max="5.0",I.step="0.01",I.value=z.toString(),I.style.width="100%",I.style.cursor="pointer";const Y=()=>{if(e&&e.uniforms&&e.uniforms.uVibrateAmp){const D=e.uniforms.uVibrateAmp.value;U.innerText=`Vibration: ${D.toFixed(2)}`,E.value=D,I.value=D}};T.push(Y);function H(D){const W=parseFloat(D)||0;U.innerText=`Vibration: ${W.toFixed(2)}`,E.value=W,I.value=W,M(E,W,z),e&&e.uniforms&&e.uniforms.uVibrateAmp&&(e.uniforms.uVibrateAmp.value=W)}I.addEventListener("input",D=>H(D.target.value)),E.addEventListener("input",D=>H(D.target.value)),L.appendChild(B),L.appendChild(I),V.appendChild(L)})(),(()=>{const L=document.createElement("div");L.style.marginTop="8px";const B=document.createElement("div");B.style.display="flex",B.style.alignItems="center",B.style.justifyContent="space-between";const z=e&&e.uniforms&&e.uniforms.uVibrateBoostSizeThreshold?e.uniforms.uVibrateBoostSizeThreshold.value:n,U=document.createElement("span");U.innerText=`Vibrate Boost Size: ${z.toFixed(2)}`,U.style.fontSize="12px";const E=document.createElement("input");E.type="number",E.min="0.0",E.max="100.0",E.step="0.1",E.value=z.toString(),E.style.width="70px",E.style.marginLeft="8px",B.appendChild(U),B.appendChild(E);const k=document.createElement("button");k.type="button",k.innerText="Reset",k.style.marginLeft="6px",k.style.fontSize="11px",k.style.padding="2px 6px",k.addEventListener("click",()=>H(z)),B.appendChild(k);const I=document.createElement("input");I.type="range",I.min="0.0",I.max="100.0",I.step="0.1",I.value=z.toString(),I.style.width="100%",I.style.cursor="pointer";const Y=()=>{if(e&&e.uniforms&&e.uniforms.uVibrateBoostSizeThreshold){const D=e.uniforms.uVibrateBoostSizeThreshold.value;U.innerText=`Vibrate Boost Size: ${D.toFixed(2)}`,E.value=D,I.value=D}};T.push(Y);function H(D){const W=parseFloat(D)||0;U.innerText=`Vibrate Boost Size: ${W.toFixed(2)}`,E.value=W,I.value=W,M(E,W,z),e&&e.uniforms&&e.uniforms.uVibrateBoostSizeThreshold&&(e.uniforms.uVibrateBoostSizeThreshold.value=W)}I.addEventListener("input",D=>H(D.target.value)),E.addEventListener("input",D=>H(D.target.value)),L.appendChild(B),L.appendChild(I),V.appendChild(L)})(),(()=>{const L=document.createElement("div");L.style.marginTop="8px";const B=document.createElement("div");B.style.display="flex",B.style.alignItems="center",B.style.justifyContent="space-between";const z=g?g.value:.001,U=document.createElement("span");U.innerText=`Mouse Damping: ${z.toFixed(3)}`,U.style.fontSize="12px";const E=document.createElement("input");E.type="number",E.min="0.001",E.max="0.2",E.step="0.001",E.value=z.toString(),E.style.width="70px",E.style.marginLeft="8px",B.appendChild(U),B.appendChild(E);const k=document.createElement("button");k.type="button",k.innerText="Reset",k.style.marginLeft="6px",k.style.fontSize="11px",k.style.padding="2px 6px",k.addEventListener("click",()=>H(z)),B.appendChild(k);const I=document.createElement("input");I.type="range",I.min="0.001",I.max="0.2",I.step="0.001",I.value=z.toString(),I.style.width="100%",I.style.cursor="pointer";const Y=()=>{if(g){const D=g.value;U.innerText=`Mouse Damping: ${D.toFixed(3)}`,E.value=D,I.value=D}};T.push(Y);function H(D){const W=parseFloat(D)||.001;U.innerText=`Mouse Damping: ${W.toFixed(3)}`,E.value=W,I.value=W,M(E,W,z),g&&(g.value=W)}I.addEventListener("input",D=>H(D.target.value)),E.addEventListener("input",D=>H(D.target.value)),L.appendChild(B),L.appendChild(I),V.appendChild(L)})(),(()=>{const L=document.createElement("div");L.style.marginTop="8px";const B=document.createElement("div");B.style.display="flex",B.style.alignItems="center",B.style.justifyContent="space-between";const z=w?w.value:.05,U=document.createElement("span");U.innerText=`Point Return Speed: ${z.toFixed(3)}`,U.style.fontSize="12px";const E=document.createElement("input");E.type="number",E.min="0.001",E.max="0.3",E.step="0.001",E.value=z.toString(),E.style.width="70px",E.style.marginLeft="8px",B.appendChild(U),B.appendChild(E);const k=document.createElement("button");k.type="button",k.innerText="Reset",k.style.marginLeft="6px",k.style.fontSize="11px",k.style.padding="2px 6px",k.addEventListener("click",()=>H(z)),B.appendChild(k);const I=document.createElement("input");I.type="range",I.min="0.001",I.max="0.3",I.step="0.001",I.value=z.toString(),I.style.width="100%",I.style.cursor="pointer";const Y=()=>{if(w){const D=w.value;U.innerText=`Point Return Speed: ${D.toFixed(3)}`,E.value=D,I.value=D}};T.push(Y);function H(D){const W=parseFloat(D)||.001;U.innerText=`Point Return Speed: ${W.toFixed(3)}`,E.value=W,I.value=W,M(E,W,z),w&&(w.value=W)}I.addEventListener("input",D=>H(D.target.value)),E.addEventListener("input",D=>H(D.target.value)),L.appendChild(B),L.appendChild(I),V.appendChild(L)})();const q=document.createElement("button");q.type="button",q.innerText="Morph: Off",q.style.padding="6px 12px",q.style.backgroundColor="#333",q.style.color="white",q.style.border="1px solid #666",q.style.borderRadius="4px",q.style.cursor="pointer",q.style.fontSize="12px";let $=null;q.addEventListener("click",()=>{$&&$.stop();const L=e.uniforms.uProgress.value,B=L>.5?0:1,z=i;console.log(e.uniforms),$=new o.Tween({progress:L}).to({progress:B},z).easing(Ln).onUpdate(U=>{e.uniforms.uProgress.value=U.progress}).onStart(()=>{y&&y()}).onComplete(()=>{q.innerText=e.uniforms.uProgress.value>.5?"Morph: On":"Morph: Off",$=null,S&&S()}).start()}),F.appendChild(q),document.body.appendChild(O)}var hd=J((()=>{Ki()})),gl,vl,yl,wl,gd=J((()=>{ct(),gl=`
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
`,vl=`
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
`,yl=`
    varying vec2 vUv;
    varying float vStagger;
    
    attribute float aStagger;
 
    void main() {
        vUv = uv;
        vStagger = aStagger;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`,wl=`
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
`}));function Tr(e,t,o="dev"){const i=o==="poba";if(isNaN(e)||isNaN(t)||e==="KNOWHERE")return _i.KNOWHERE[o]||_i.KNOWHERE.dev;const a=_i[`${e}_${t}`];return a||{row:NaN,col:NaN,name:"MAP_BOUNDARY",icon:"UNKNOWN",description:i?"Market research frontier. This requirement is currently undefined and awaiting business alignment.":"Logic ends here. Beyond this point lies the next evolution of my stack. Error 404: Knowledge still in transit.",meta:i?{loc:"Future Market",grid:"Unscheduled"}:{loc:"0xVOID",grid:"volatile"}}}var _i,vd=J((()=>{_i={"0_0":{icon:"Visual Studio Code",name:"Dev Ecosystem",description:"I am comfortable in VS Code. I can navigate the project structure and run the environment to check progress myself."},"0_1":{icon:"Curly braces",name:"Logic Integrity",description:"I check the logic. I use Gherkin-style Acceptance Criteria to ensure the business rules are bulletproof before the team commits to code."},"0_2":{icon:"HTML tags",name:"Frontend Standards",description:"I know good structure. I check that the frontend follows basic semantic standards to ensure maintainability."},"0_3":{icon:"Figma",name:"UX Integrity",description:"I audit designs. I check Figma files to ensure the UI elements are consistent and technically feasible to build."},"0_4":{icon:"PowerPoint",name:"Strategic Vision",description:"I communicate clearly. I build effective presentations that translate technical progress into business updates for stakeholders."},"0_5":{icon:"Excel",name:"Data-Driven UX",description:"I verify with data. I use Excel to organize and analyze user metrics, helping the team focus on what matters."},"0_6":{icon:"Coffee cup",name:"Deep Focus",description:"I run on caffeine and code. It’s the fuel that helps me solve the impossible bugs that are blocking your roadmap."},"0_7":{icon:"Slack",name:"Cross-Func Bridge",description:"I connect the dots. I use Slack to facilitate clear communication between designers and developers, preventing misunderstandings."},"1_0":{icon:"Git branch",name:"Release Stability",description:"I understand the workflow. I follow the Git branching model to track which features are ready for the next release."},"1_1":{icon:"GitHub",name:"Code Governance",description:"I keep things organized. I check GitHub to ensure tasks are linked to PRs and documentation is being updated."},"1_2":{icon:"Jira",name:"Project Management",description:"I manage the flow. I use Jira and Confluence to keep tickets updated and remove blockers for the team."},"1_3":{icon:"Flowchart",name:"System Flow",description:"I visualize the path. I create flowcharts to clarify how data should move through the system, ensuring everyone aligns."},"1_4":{icon:"GitHub Copilot",name:"AI Efficiency",description:"I code smarter. I use GitHub Copilot to help me write boilerplate code and scripts faster, speeding up my own utility tasks."},"1_5":{icon:"Ethereum",name:"DePIN & Web3",description:"I bridge physical and digital. I understand decentralized energy networks and Web3 onboarding flows to define better user journeys."},"1_6":{icon:"Analytics graph",name:"Strategy & Prioritization",description:"I track the value. I use RICE and MoSCoW scoring to prioritize features that deliver the highest ROI and user impact."},"1_7":{icon:"Bitcoin",name:"Blockchain",description:"I understand the concept. I know when to apply Blockchain for trust and security, and when a standard database is better."},"2_0":{icon:"MySQL database",name:"Data Accuracy",description:"I can check the data. I run basic SQL queries to verify that the numbers on the dashboard match the database."},"2_1":{icon:"Notion",name:"Tech Specs",description:"I document requirements. I write clear specifications in Notion so developers know exactly what to build."},"2_2":{icon:"Tech stack",name:"Hybrid Capabilities",description:"I bridge the gap. My ability to code and design allows me to step in and help wherever the team has a bottleneck."},"2_3":{icon:"n8n",name:"Productivity Automation",description:"I eliminate manual drag. I deploy automated workflows using n8n and AI, reducing project overhead by up to 40%."},"2_4":{icon:"Agile loop",name:"Iterative Design",description:"I iterate quickly. I lead sprints where we test and refine UI concepts before committing to heavy development."},"2_5":{icon:"Python",name:"Data Scripting",description:"I am capable with Python. I write scripts to process data or generate mock content, unblocking designers early on."},"2_6":{icon:"API window",name:"API Contracts",description:"I understand APIs. I can read API documentation to ensure the frontend has the data fields it needs."},"2_7":{icon:"Google Antigravity",name:"AI-Enhanced Workflow",description:"I work faster with AI. I integrate LLM tools into my daily process to rapid-prototype ideas, generate content, and solve coding blockers instantly."},"3_0":{icon:"OpenAI",name:"AI-Enhanced UX",description:"I work faster with AI. I integrate LLM tools into my daily process to rapid-prototype ideas, generate content, and solve coding blockers instantly."},"3_1":{icon:"Digital Twin",name:"IoT Eco-systems",description:"I connect the dots in IoT. I design intuitive visual flows for complex grid, battery, and inverter diagnostics."},"3_2":{icon:"Google Gemini",name:"AI-Enhanced Workflow",description:"I work faster with AI. I integrate LLM tools into my daily process to rapid-prototype ideas, generate content, and solve coding blockers instantly."},"3_3":{icon:"Blender",name:"Asset Strategy",description:"I know 3D assets. I can open Blender to check model topology and export settings for better web performance."},"3_4":{icon:"Backend script",name:"Backend Logic",description:"I understand the backend. I know enough about server logic to discuss feasibility and constraints with engineers."},"3_5":{icon:"JavaScript",name:"JS Proficiency",description:"I write capable JavaScript. I can read the codebase and implement logic features without needing hand-holding."},"3_6":{icon:"WebGL / GLSL",name:"Technical De-risking",description:"I validate through code. I use GLSL/Shaders and WebGL prototyping to ensure architectural feasibility for complex 3D environments."},"3_7":{icon:"Translation",name:"Global Design",description:"I design for everyone. My multilingual background helps me spot translation and layout issues in the UI."},KNOWHERE:{poba:{icon:"STATUS: Discovery Backlog",name:"KNOWHERE",description:"A reserved product space for capabilities still under exploration. Ideas are validated here before entering the roadmap.",meta:{loc:"Opportunity Space",grid:"Pending Prioritization"}},dev:{icon:"STATUS: Procedurally Generating",name:"KNOWHERE",description:"A reserved namespace for capabilities still compiling. Architecture defined. Implementation ongoing.",meta:{loc:"/dev/self",grid:"runtime"}}}}})),Sl,yd=J((()=>{vd(),yt(),co(),Sl=class{constructor(e){this.tooltip=document.createElement("div"),this.tooltip.style.position="absolute",this.tooltip.style.padding="12px 16px",this.tooltip.style.background="rgba(0, 0, 0, 0.95)",this.tooltip.style.color="#fff",this.tooltip.style.borderRadius="4px",this.tooltip.style.fontFamily="'Rajdhani', sans-serif",this.tooltip.style.fontSize="13px",this.tooltip.style.lineHeight="1.4",this.tooltip.style.pointerEvents="auto",this.tooltip.addEventListener("click",()=>this.hide()),this.tooltip.style.display="none",this.tooltip.style.zIndex="100000",this.tooltip.style.border="1px solid rgba(0, 255, 255, 0.3)",this.tooltip.style.whiteSpace="normal",this.tooltip.style.maxWidth="260px",this.tooltip.style.backdropFilter="blur(4px)",this.tooltip.style.boxShadow="0 4px 12px rgba(0,0,0,0.5)",this.tooltip.style.transition="opacity 0.2s, transform 0.2s",document.body.appendChild(this.tooltip),this.lastHoveredIndex=-1,this.lastTooltipRefString=null,this.iconSize=32,this.rotX=0,this.rotY=0,this.isAnimating=!1,this._animateIcon=this._animateIcon.bind(this)}_createCubeDOM(){const e=document.createElement("div");e.style.width=this.iconSize+"px",e.style.height=this.iconSize+"px",e.style.position="relative",e.style.perspective="800px";const t=document.createElement("div");t.style.width="100%",t.style.height="100%",t.style.position="absolute",t.style.transformStyle="preserve-3d",this.cubeDOM=t;const o=["front","back","right","left","top","bottom"],i={front:`rotateY(0deg) translateZ(${this.iconSize/2}px)`,back:`rotateY(180deg) translateZ(${this.iconSize/2}px)`,right:`rotateY(90deg) translateZ(${this.iconSize/2}px)`,left:`rotateY(-90deg) translateZ(${this.iconSize/2}px)`,top:`rotateX(90deg) translateZ(${this.iconSize/2}px)`,bottom:`rotateX(-90deg) translateZ(${this.iconSize/2}px)`};return this.faceElements=[],o.forEach(a=>{const r=document.createElement("div");r.style.position="absolute",r.style.width=this.iconSize+"px",r.style.height=this.iconSize+"px",r.style.backfaceVisibility="hidden",oe.spriteSheetIcon&&(r.style.backgroundImage=`url('${oe.spriteSheetIcon.image.src}')`,r.style.backgroundSize="800% 400%",r.style.imageRendering="pixelated"),r.style.transform=i[a],t.appendChild(r),this.faceElements.push(r)}),e.appendChild(t),e}_animateIcon(){if(!this.tooltip.style.display||this.tooltip.style.display==="none"){this.isAnimating=!1;return}requestAnimationFrame(this._animateIcon),this.rotX+=.02,this.rotY+=.03;const e=this.rotX*(180/Math.PI),t=this.rotY*(180/Math.PI);this.cubeDOM&&(this.cubeDOM.style.transform=`rotateX(${e}deg) rotateY(${t}deg)`)}_getPointInfo(e,t,o,i,a){if(!e.geometry.attributes.aStableRandom)return null;const r=e.geometry.attributes.aStableRandom.array[o],n=t.uniforms.iTime.value,s=t.uniforms.uProgress.value,c=t.uniforms.uIsChaos.value;let u=0;e.geometry.attributes.aStartSizeIsGrid&&(u=e.geometry.attributes.aStartSizeIsGrid.array[o*2+1]);let d=0;e.geometry.attributes.aTargetSizeIsGrid&&(d=e.geometry.attributes.aTargetSizeIsGrid.array[o*2+1]);const m=u*(1-s)+d*s>.5?1:0,f=e.geometry.attributes.position,g=new l.Vector3;g.fromBufferAttribute(f,o);const w=1-m;if(w<.5){const D=t.uniforms.uGridForward?t.uniforms.uGridForward.value:new l.Vector3(0,0,1),W=t.uniforms.uBaseGridZ?t.uniforms.uBaseGridZ.value:0,Q=t.uniforms.uGridZ?t.uniforms.uGridZ.value:0,j=D.clone().multiplyScalar(W-Q);g.add(j)}if(w>.5){const D=t.uniforms.uModelScale?t.uniforms.uModelScale.value:1,W=t.uniforms.uModelPosition?t.uniforms.uModelPosition.value:new l.Vector3(0,0,0),Q=t.uniforms.uModelRotation?t.uniforms.uModelRotation.value:new l.Vector3(0,0,0);g.multiplyScalar(D);const j=new l.Euler(Q.x,Q.y,Q.z,"XYZ");g.applyEuler(j),g.add(W)}let y=new l.Vector4(g.x,g.y,g.z,1);y.applyMatrix4(e.matrixWorld);const S=new l.Vector3(y.x,y.y,y.z);y.applyMatrix4(i.matrixWorldInverse),y.applyMatrix4(i.projectionMatrix);const T=t.uniforms.uModelScreenOffset?t.uniforms.uModelScreenOffset.value:new l.Vector2(0,0);y.x+=T.x*y.w,y.y+=T.y*y.w;const M=new l.Vector2(y.x/y.w,y.y/y.w),O=(M.x*.5+.5)*window.innerWidth,_=(M.y*.5+.5)*window.innerHeight,v=window.innerHeight-a.y,P=O-a.x,A=_-v,F=Math.sqrt(P*P+A*A),G=m*(1-c)>.5?10:6,V=n+r*10,h=Math.floor(V/G)*13,b=V%G>G-.75?1:0,p=(F<(t.uniforms.uHoverRadius?t.uniforms.uHoverRadius.value:200)?1:0)*(F>5?1:0)*b,R=Math.floor(n*13.33+r)*p,C=r*32+R+h,N=Math.floor(C)%32,q=8,$=N%q,L=Math.floor(N/q),B=Tr(L,$,se?se.currentMode:"dev");let z=0,U=0;const E=t.uniforms.uModelPointCount?t.uniforms.uModelPointCount.value:0;if(o>=E){const D=e.geometry.attributes.position.count,W=Math.max(0,D-E),Q=Math.ceil(Math.sqrt(W))||1,j=o-E;z=j%Q,U=Math.floor(j/Q)}else e.geometry.attributes.aSpatialGridIndex&&(z=e.geometry.attributes.aSpatialGridIndex.array[o*2+0],U=e.geometry.attributes.aSpatialGridIndex.array[o*2+1]);if(o===999999){const D=Tr("KNOWHERE",null,se?se.currentMode:"dev");return{idx:o,texIndex:0,col:NaN,row:NaN,rnd:0,icon:D.icon,name:D.name,description:D.description,meta:D.meta,worldPos:new l.Vector3(NaN,NaN,NaN),spatialCol:NaN,spatialRow:NaN,isGrid:!0}}let k=!1,I=null;if(e.geometry.attributes.aPointData&&(k=e.geometry.attributes.aPointData.array[o*4+1]>.5,k&&e.parentInstance&&e.parentInstance.bigDipper)){const D=o-e.parentInstance._dipperBaseIndex;D>=0&&D<e.parentInstance.bigDipper.length&&(I=e.parentInstance.bigDipper[D])}let Y=$,H=L;return k&&I&&(Y=I.textureSlotCol,H=I.textureSlotRow),{idx:o,texIndex:N,col:Y,row:H,rnd:r,icon:B.icon,name:B.name,description:B.description,meta:B.meta,worldPos:S,spatialCol:z,spatialRow:U,isGrid:m>.5,isDipper:k,dipperData:I}}update(e,t,o,i,a,r,n){if(!t)return;const s=e.params.Points.threshold;e.params.Points.threshold=1;const c=o.uniforms.uModelScreenOffset?o.uniforms.uModelScreenOffset.value:new l.Vector2(0,0),u=i.clone().sub(c);e.setFromCamera(u,r);const d=e.intersectObject(t);let m=-1;const f=t.parentInstance?.scene?.knowhere;if(f&&f.material.uniforms.uScaleFactor.value>.01){const g=new l.Raycaster;g.setFromCamera(i,r);const w=g.intersectObject(f);if(w.length>0){const y=w[0].uv;if(y){const S=y.x*2-1,T=y.y*2-1;Math.sqrt(S*S+T*T)<.9&&(m=999999)}}}if(m===-1)if(d.length>0){let g=-1;for(let w=0;w<Math.min(d.length,5);w++){const y=d[w].index;if(t.geometry.attributes.aPointData&&t.geometry.attributes.aPointData.array[y*4+1]>.5){g=y;break}}m=g!==-1?g:d[0].index}else t.geometry.morphCurrentIndex===3&&t.parentInstance&&t.parentInstance.model&&e.intersectObject(t.parentInstance.model,!0).length>0&&(m=t.geometry.lastClosestIndex||0);if(m!==-1){document.body.style.cursor="pointer";const g=this._getPointInfo(t,o,m,r,a);this.lastHoveredIndex!==m&&(this.lastHoveredIndex=m);const w=n.domElement.getBoundingClientRect(),y=a.x<w.left+w.width/2?"left":"right",S=`${m}_${g?g.texIndex:-1}_${y}`;if(this.lastTooltipRefString!==S&&g){const v=!(a.x<window.innerWidth/2),P=g.isDipper,A={bg:v?"rgba(255, 255, 255, 1.0)":"rgba(5, 10, 15, 0.95)",border:v?"1px solid rgba(0, 0, 0, 0.3)":"1px solid rgba(0, 255, 255, 0.3)",shadow:v?"0 12px 40px rgba(0,0,0,0.2)":"0 6px 16px rgba(0,0,0,0.6)",title:v?"#000000":"#00FFFF",desc:v?"#111111":"#FFFFFF",meta:v?"#333333":"#DCD0BA",divider:v?"rgba(0, 0, 0, 0.25)":"rgba(255, 255, 255, 0.2)",gridBg:v?"linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)":"linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px)"};if(this.tooltip.style.backgroundColor=A.bg,this.tooltip.style.backgroundImage=A.gridBg,this.tooltip.style.backgroundSize="20px 20px",this.tooltip.style.border=A.border,this.tooltip.style.boxShadow=A.shadow,this.tooltip.style.color=A.desc,this.tooltip.style.padding="20px 24px",this.tooltip.style.width="300px",this.faceElements){const b=isNaN(g.col)||isNaN(g.row);this.faceElements.forEach(p=>{if(p.style.backgroundColor=v?"#d0d0d0":"#444444",b)p.style.backgroundImage="none",p.style.display="flex",p.style.alignItems="center",p.style.justifyContent="center",p.style.fontSize="20px",p.style.fontWeight="bold",p.style.color=A.title,p.style.fontFamily="'Fira Code', monospace",p.textContent="?";else{oe.spriteSheetIcon&&(p.style.backgroundImage=`url('${oe.spriteSheetIcon.image.src}')`),p.textContent="";const R=g.col/7*100,C=g.row/3*100;p.style.backgroundPosition=`${R}% ${C}%`}p.style.filter=v?"invert(1) contrast(0.85)":"none"})}P&&`${A.meta}`;const F=P?`⭐ ${g.dipperData.category}`:g.name,G=P?g.dipperData.usp_subtitle||"STRATEGIC NODE":g.icon||"UNKNOWN";P&&g.dipperData.meaning&&`${A.meta}${g.dipperData.meaning}`;const V=P?g.dipperData.usp:g.description;this.tooltip.innerHTML=`
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
                        <div style="display: flex; flex-direction: column; gap: 4px;">
                            ${P?`
                                <div style="font-family: 'Fira Code', monospace; font-size: 8px; font-weight: 800; color: ${A.meta}; letter-spacing: 2.5px; opacity: 0.8; text-transform: uppercase;">CORE EXPERTISE</div>
                                <div style="font-family: 'Orbitron', monospace; font-weight: 700; font-size: 16px; color: ${A.title}; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 2px;">⭐ ${g.dipperData.category}</div>
                                <div style="font-family: 'Fira Code', monospace; font-size: 9px; font-weight: 600; color: ${A.desc}; opacity: 0.7; text-transform: uppercase;">${g.dipperData.meaning} • ${g.dipperData.usp_subtitle.replace(" • "," • ")}</div>
                            `:`
                                <div style="font-family: 'Orbitron', monospace; font-weight: 700; font-size: 14px; margin-bottom: 4px; color: ${A.title}; text-transform: uppercase; letter-spacing: 1px;">${F}</div>
                                <div style="font-family: 'Orbitron', monospace; font-size: 10px; font-weight: 600; color: ${A.desc}; text-transform: uppercase; opacity: 0.6; letter-spacing: 0.5px;">${G}</div>
                            `}
                        </div>
                        <div id="tooltip-icon-container" style="
                            width: ${this.iconSize}px; 
                            height: ${this.iconSize}px;
                            margin-top: 4px;
                        "></div>
                    </div>

                    <div style="width: 100%; height: 1px; background: linear-gradient(90deg, ${A.divider} 0%, transparent 100%); margin-bottom: 16px;"></div>

                    <div style="font-family: 'Rajdhani', sans-serif; font-size: 13px; font-weight: 400; color: ${A.desc}; line-height: 1.7; letter-spacing: 0.3px; opacity: 0.95;">
                        ${V}
                    </div>
                `;const h=this.tooltip.querySelector("#tooltip-icon-container");if(h)if(this.cubeDOM){const b=this.cubeDOM.parentElement;h.appendChild(b)}else{const b=this._createCubeDOM();h.appendChild(b)}this.tooltip.style.display="block",this.isAnimating||(this.isAnimating=!0,this._animateIcon()),this.lastTooltipRefString=S,se&&typeof se.highlightSkillByCategory=="function"&&g.isDipper&&g.dipperData&&se.highlightSkillByCategory(g.dipperData.category)}const T=a.x,M=a.y,O=window.innerWidth,_=window.innerHeight;T>O*.6?(this.tooltip.style.left="auto",this.tooltip.style.right=O-T+20+"px"):(this.tooltip.style.right="auto",this.tooltip.style.left=T+20+"px"),M>_*.7?(this.tooltip.style.top="auto",this.tooltip.style.bottom=_-M+20+"px"):(this.tooltip.style.bottom="auto",this.tooltip.style.top=M+20+"px")}else document.body.style.cursor="auto",this.lastHoveredIndex!==-1&&this.hide();e.params.Points.threshold=s}hide(){this.tooltip.style.display="none",this.lastHoveredIndex=-1,this.lastTooltipRefString=null,this.isAnimating=!1,se&&typeof se.highlightSkillByCategory=="function"&&se.highlightSkillByCategory(null)}}}));function wd(e,t,o){const i=window.gsap,a=window.Observer||(i?i.Observer:null);i&&a&&i.registerPlugin(a);let r=!0,n=0;const s=3;let c=null,u=!1,d=0,m=null;t.previousStep=0,t._lastBoardScale=1,t._lastSubProgress=1,window.__boardScale=1,window.__boardSubProgress=ui.chaos.subVisible?1:0;const f=(h,b=1,p=.2)=>{const R=e.HUD.material.uniforms;R.uBNotchBarProgress.value=h,R.uBNotchBarAlpha.value=b,R.uBNotchBarMarginX.value=p},g=h=>{if(e&&e.HUD&&e.HUD.material.uniforms){const b=e.HUD.material.uniforms;b.uRNotchBarProgress.value=h}},w=h=>{if(e&&e.HUD&&e.HUD.material.uniforms){const b=e.HUD.material.uniforms;b.uBeamColor.value.copy(h),b.uBNotchBarColor.value.copy(h)}},y=(h=0)=>{if(!e||!e.HUD||!e.HUD.material.uniforms)return;const b=e.HUD.material.uniforms;b.uBeamAttachRatio.value=h,t.beamTween&&t.beamTween.stop(),b.uBeamMaxHeight.value=0,b.uBeamBaseThickness.value=0,b.uBeamGrowth.value=0,t.beamTween=new o.Tween({growth:0,height:0,thickness:0}).to({growth:K.BEAM_GROWTH||1,height:K.BEAM_MAX_HEIGHT||.03,thickness:K.BEAM_BASE_THICKNESS||.001},200).easing(o.Easing.Quadratic.In).onUpdate(p=>{b.uBeamGrowth.value=p.growth,b.uBeamMaxHeight.value=p.height,b.uBeamBaseThickness.value=p.thickness}).onComplete(()=>{t.beamTween=null;const p=h<.5?b.uRNotchVibeB:b.uRNotchVibeT;t.impactVibeTween&&t.impactVibeTween.stop(),p.value=1,t.impactVibeTween=new o.Tween(p).to({value:0},1500).easing(o.Easing.Exponential.Out).onComplete(()=>{t.impactVibeTween=null}).start(),typeof window.cvShake=="function"&&window.cvShake(1500),setTimeout(()=>S(),100),n===3&&e.HUD&&(e.HUD.applyBeamImpulse&&e.HUD.applyBeamImpulse(),typeof window.cvFall=="function"&&window.cvFall())}).start()},S=()=>{if(!e||!e.HUD||!e.HUD.material.uniforms)return;const h=e.HUD.material.uniforms;t.beamTween&&t.beamTween.stop(),t.beamTween=new o.Tween({growth:h.uBeamGrowth.value,height:h.uBeamMaxHeight.value,thickness:h.uBeamBaseThickness.value}).to({growth:0,height:0,thickness:0},200).easing(o.Easing.Quadratic.In).onUpdate(b=>{h.uBeamGrowth.value=b.growth,h.uBeamMaxHeight.value=b.height,h.uBeamBaseThickness.value=b.thickness}).onComplete(()=>{t.beamTween=null,f(0,0,1)}).start()},T=(h=!1)=>{const b=document.querySelector(".indicator-icon");if(!b)return;m&&m.kill();const p=b.style.animation;b.style.animation="none",m=i.timeline({repeat:h?-1:0,repeatDelay:h?.8:0,onComplete:()=>{h||(b.style.animation=p,m=null)}});const R=.45,C=.65,N="power3.out",q="bounce.out";m.to(b,{y:-25,duration:R,ease:N}).to(b,{y:0,duration:C,ease:q},"-=0.1"),m.to(b,{y:-35,duration:R-.05,ease:N},"+=0.1").to(b,{y:0,duration:C,ease:q},"-=0.1"),m.to(b,{y:-45,duration:R-.1,ease:N},"+=0.1").to(b,{y:0,duration:C+.2,ease:q},"-=0.1")},M=()=>{m&&(m.kill(),m=null);const h=document.querySelector(".indicator-icon");h&&(i.to(h,{y:0,duration:.3}),h.style.animation="")};t.triggerEnergeticScrollJump=T,t.stopEnergeticScrollJump=M,t.triggerStep=(h,b=null,p=!1)=>{n=h,P(h,null,b,p)},t.getCurrentStep=()=>n,t.refreshUIPersonaSync=()=>{const h=v[n];if(h&&h.ui&&h.ui.board){const b=document.querySelector(".intro-main-name1"),p=document.querySelector(".intro-main-name2"),R=document.querySelector(".board-philo-main"),C=document.querySelector(".board-philo-sub"),N=document.getElementById("board-feat-1"),q=400;b&&A(b,h.ui.board.name1,q,b.innerText),p&&A(p,h.ui.board.name2,q,p.innerText),C&&h.ui.board.philoSub&&A(C,h.ui.board.philoSub,q,C.innerText),R&&h.ui.board.philo&&A(R,h.ui.board.philo,q,R.innerText),N&&h.ui.board.feat1&&A(N,h.ui.board.feat1,q,N.innerText);const $=document.getElementById("board-feat-2");$&&h.ui.board.feat2&&A($,h.ui.board.feat2,q,$.innerText)}};const O=(h,b=3e3,p=3e3,R)=>{const C=h.scene,N=(C?C.camera:null)||h.camera,q=(C?C.orbitControls:null)||h.controls;if(!N||!q){console.error("[ScrollMorph] Camera or Controls missing! Aborting tween.");return}const $={x:17.4192690499384,y:4.136164408312478,z:.015309904980740474},L={x:-.04520672934354282,y:1.5515547851416993,z:.045198372394982464},B={x:-3.226367634071287,y:4.1182097600816245,z:-.38158710192007556},z=.036,U={x:Math.PI/2,y:Math.PI/2,z:0},E={x:0,y:0},k={x:-2.1,y:0,z:0},I=0,Y=1,H=0,D=N.position.clone(),W=N.rotation.clone(),Q=q.target.clone(),j=h.material?h.material.uniforms:null;C.HUD.material.uniforms;const ee=j?.uModelScale?.value||1,ae=j?.uModelRotation?.value?j.uModelRotation.value.clone():{x:0,y:0,z:0},le=j?.uModelScreenOffset?.value?j.uModelScreenOffset.value.clone():{x:0,y:0},ve=j?.uModelPosition?.value?j.uModelPosition.value.clone():{x:0,y:0,z:0},Se=j?.uLightSizeBoost?.value||1.5,we=j?.uPixelRatio?.value||2,X=j?.uModelPointSizeFactor?.value||1,ne=X*.32,ie=j?.uModelVibFactor?.value||0;new o.Tween({t:0}).to({t:1},b).easing(o.Easing.Linear.None).delay(p).onStart(()=>{window.scene&&window.scene.HUD&&typeof window.scene.HUD.startBreathing=="function"&&window.scene.HUD.startBreathing(),window.scene&&(window.scene.isTransitioning=!0),window.scene&&window.scene.HUD&&typeof window.scene.HUD.runTweenHideDecos=="function"&&(window.scene.HUD.runTweenHideDecos(2e3,()=>{window.scene.HUD.toggleGarden()}),setTimeout(()=>{window.scene.HUD.runTweenHideIsland(3e3)},500),window.scene.HUD.runTweenHideRNotch(3e3))}).onUpdate(ue=>{const ce=ue.t;N.position.lerpVectors(D,$,ce),N.rotation.x=W.x+(L.x-W.x)*ce,N.rotation.y=W.y+(L.y-W.y)*ce,N.rotation.z=W.z+(L.z-W.z)*ce,q.target.lerpVectors(Q,B,ce),j&&(j.uModelScale&&(j.uModelScale.value=ee+(z-ee)*ce),j.uModelVibFactor&&(j.uModelVibFactor.value=ie+(H-ie)*ce),j.uModelRotation&&j.uModelRotation.value&&j.uModelRotation.value.lerpVectors(ae,U,ce),j.uModelScreenOffset&&j.uModelScreenOffset.value&&j.uModelScreenOffset.value.lerpVectors(le,E,ce),j.uModelPosition&&j.uModelPosition.value&&j.uModelPosition.value.lerpVectors(ve,k,ce),j.uLightSizeBoost&&(j.uLightSizeBoost.value=Se+(I-Se)*ce),j.uPixelRatio&&(j.uPixelRatio.value=we+(Y-we)*ce),j.uModelPointSizeFactor&&(j.uModelPointSizeFactor.value=X+(ne-X)*ce))}).onComplete(()=>{R?(R(),h.hasVisitedRoom=!0):C&&setTimeout(()=>{const ue=document.getElementById("board");ue&&(h.boardPosTween&&h.boardPosTween.stop(),h.boardScaleTween&&h.boardScaleTween.stop(),window.gsap.to(ue,{opacity:0,duration:.8,onComplete:()=>{ue.style.display="none"}})),Ua(C),h.hasVisitedRoom=!0},1125)}).start()},_=(h,b)=>{u=!0;const p=U=>{if(!h.scene.heroClips)return 1e3;const E=h.scene.heroClips.find(k=>k.name===U);return E?E.duration*1e3:1e3},R=h.hasVisitedRoom||!1,C=R?2.25/4:2.25,N=R?1.2*4:1.2,q=0,$=.2,L=p("standToSit"),B=p("sitToType"),z=2.5;L+B/z+C*1e3,h.playAnimation("walking",$,!0,N),h.renderer&&new o.Tween(h.renderer).to({toneMappingExposure:.4},C*1e3).easing(o.Easing.Quadratic.Out).start(),O(h,C*1e3,q,async()=>{const U=document.getElementById("board");U&&(h.boardPosTween&&h.boardPosTween.stop(),h.boardScaleTween&&h.boardScaleTween.stop(),window.gsap.to(U,{opacity:0,duration:.8,onComplete:()=>{U.style.display="none"}})),await Fe(1125),e&&(e.isHeavyBuilding=!0),Xs(e)}),setTimeout(async()=>{h.playAnimation("standToSit",$,!1),await Fe(L),h.playAnimation("sitToType",$,!1,z),await Fe(B/z),h.playAnimation("typing",.5,!0),b&&b()},C*1e3+q)},v={0:{label:"Chaos",bloom:3,knowhere:{scale:.8,offset:{x:0,y:.25},gravity:50,radius:200,gardenHoverMult:400,chargeUpDur:3e3,collapseOutDur:1200},get targetIndex(){return t.getChaosIndex()},allowsScrollBack:!1,ui:{scrollIcon:"pos-bottom",scrollScale:1,maskBounds:{widthVw:0,heightVh:0,topVh:60,leftVw:5},maskScale:0,board:{nameSub:"HELLO, I AM",get philoSub(){return Z(`NARR_STEP_0_VERB_${se.currentMode.toUpperCase()}`)},get name1(){return Z(`BOARD_STEP_0_NAME1_${se.currentMode.toUpperCase()}`)},get name2(){return Z(`BOARD_STEP_0_NAME2_${se.currentMode.toUpperCase()}`)},get philo(){return Z(`NARR_STEP_0_OUTCOME_${se.currentMode.toUpperCase()}`)},get feat1(){return Z(`NARR_STEP_0_CREDIBILITY_${se.currentMode.toUpperCase()}`).split(`
`)[0].trim()},get feat2(){const h=Z(`NARR_STEP_0_CREDIBILITY_${se.currentMode.toUpperCase()}`).split(`
`);return h.length>1?h[1].trim():""}}},action:h=>{h.stopAnimations(.8)}},1:{label:"Root",bloom:3,knowhere:{scale:1,offset:{x:-.4,y:-.75},gravity:60,radius:200,gardenHoverMult:60,chargeUpDur:4e3,collapseOutDur:500},get targetIndex(){return t.getRootIndex()},allowsScrollBack:!0,ui:{scrollIcon:"hidden",scrollScale:1,get maskBounds(){return{useBoard:!0}},maskScale:1,board:{get name1(){return Z(`BOARD_STEP_1_NAME1_${se.currentMode.toUpperCase()}`)},get name2(){return Z(`BOARD_STEP_1_NAME2_${se.currentMode.toUpperCase()}`)},get philo(){return Z(`NARR_STEP_1_SUBTITLE_${se.currentMode.toUpperCase()}`)},get feat1(){return Z(`NARR_STEP_1_DESC_${se.currentMode.toUpperCase()}`)}}},action:h=>{h.stopAnimations(.8),_o.onMorphToAbout(h.scene)}},2:{label:"Dance",bloom:3,knowhere:{scale:.5,offset:{x:0,y:-1},gravity:-800,radius:300,gardenHoverMult:-.5,chargeUpDur:3e3,collapseOutDur:400},get targetIndex(){return t.getCharIndex()},allowsScrollBack:!0,ui:{scrollIcon:"hidden",scrollScale:1,get maskBounds(){return{useBoard:!0}},maskScale:1,board:{get name1(){return Z(`BOARD_STEP_2_NAME1_${se.currentMode.toUpperCase()}`)},get name2(){return Z(`BOARD_STEP_2_NAME2_${se.currentMode.toUpperCase()}`)},get philo(){return Z(`NARR_STEP_2_SUBTITLE_${se.currentMode.toUpperCase()}`)},get feat1(){return Z(`NARR_STEP_2_DESC_${se.currentMode.toUpperCase()}`)}}},action:h=>{const b=()=>{t.getCurrentStep()===2&&h.playAnimation("breakDance",.8,"pingpong",1.1,()=>{t.getCurrentStep()===2&&h.playAnimation("robotDance",.8,!1,1.1,()=>{t.getCurrentStep()===2&&h.playAnimation("gangnam",.8,!1,1.25,b)})})};b(),window.scene&&window.scene.HUD&&window.scene.HUD.material.uniforms.uHeadSpriteSize&&new o.Tween(window.scene.HUD.material.uniforms.uHeadSpriteSize).to({value:16},1e3).easing(o.Easing.Quadratic.Out).start();let p=e.getObjectByName("PointsCloud");p&&(p.visible=!0)}},3:{label:"WaveSit",knowhere:{scale:.5,offset:{x:0,y:-3},gravity:-2e3,radius:200,gardenHoverMult:1.2,chargeUpDur:2250,collapseOutDur:1200},get targetIndex(){return t.getCharIndex()},allowsScrollBack:!1,ui:{scrollIcon:"hidden",get maskBounds(){return{useBoard:!0}},maskScale:1,board:{get name1(){return Z(`BOARD_STEP_3_NAME1_${se.currentMode.toUpperCase()}`)},get name2(){return Z(`BOARD_STEP_3_NAME2_${se.currentMode.toUpperCase()}`)},get philo(){return Z(`NARR_STEP_3_SUBTITLE_${se.currentMode.toUpperCase()}`)}}},action:async h=>{if(!u){if(u=!0,e.knowhere&&setTimeout(()=>{e.knowhere&&(e.knowhere.visible=!1)},2e3),e){e.isTransitioning=!0;const b=window.devicePixelRatio||1;b*.2;const p=(h.hasVisitedRoom?2.25/4:2.25)*1e3,R=C=>{e.renderer&&(e.renderer.setPixelRatio(b*C),e.pointsApp&&typeof e.pointsApp.onWindowResize=="function"&&e.pointsApp.onWindowResize())};setTimeout(()=>R(.75),p*.3),setTimeout(()=>R(.5),p*.6),setTimeout(()=>R(.2),p*.9),h.material&&h.material.uniforms.uModelPointSizeFactor&&new o.Tween(h.material.uniforms.uModelPointSizeFactor).to({value:1.85},p).easing(o.Easing.Quadratic.Out).start()}c&&clearTimeout(c),h.playAnimation("waving",.2,!0),e.HUD&&typeof e.HUD.startBreathing=="function"&&e.HUD.startBreathing(),c=setTimeout(()=>{_(h,()=>{})},1300)}}}},P=(h,b,p=null,R=!1)=>{e&&e.renderer&&e.renderer.shadowMap&&(e.renderer.shadowMap.autoUpdate=!1);const C=v[h];if(!C)return;h===3&&e&&(e.isTransitioning=!0),t.morphOriginStep=t.morphTargetStep!==void 0?t.morphTargetStep:h,t.morphTargetStep=h;const N=p!==null?p:Ho;t.isBloomEnabled&&t.bloomPass&&C.bloom!==void 0&&new o.Tween(t.bloomPass).to({strength:C.bloom},N).easing(o.Easing.Quadratic.Out).start();const q=h<t.previousStep,$=q?1:0;if(t.previousStep=h,e.knowhere&&h!==3&&(e.knowhere.visible=!0),h!==3&&t.points&&(t.points.visible=!0),h!==3&&(u=!1,c&&clearTimeout(c)),!R){t.isMorphing||f(q?1:0,1,.2);const B=q&&h!==3?de.ACCENT_GOLD:de.ELECTRIC_CYAN;t.hudCurrentColor||(t.hudCurrentColor=(e&&e.HUD?e.HUD.material.uniforms.uBeamColor.value:de.ELECTRIC_CYAN).clone()),t.hudColorTween&&t.hudColorTween.stop(),t.hudColorTween=new o.Tween(t.hudCurrentColor).to({r:B.r,g:B.g,b:B.b},N).easing(o.Easing.Quadratic.InOut).onUpdate(()=>{w(t.hudCurrentColor)}).onComplete(()=>{t.hudColorTween=null}).start(),t.beamTimeout&&clearTimeout(t.beamTimeout);const z=Math.min(50,N/15);t.beamTimeout=setTimeout(()=>y($),z)}if(t.morphTimeout&&clearTimeout(t.morphTimeout),(()=>{const B=e&&e.HUD?e.HUD.material.uniforms.uRNotchBarProgress.value:0,z=h/s;if(t.rightBarTween&&t.rightBarTween.stop(),h!==3?t.rightBarTween=new o.Tween({r:B}).to({r:z},N).easing(o.Easing.Quadratic.InOut).onUpdate(I=>{g(I.r)}).onComplete(()=>{t.rightBarTween=null}).start():t.rightBarTween=new o.Tween({r:B}).to({r:z},1e3).easing(o.Easing.Quadratic.InOut).onUpdate(I=>{g(I.r)}).onComplete(()=>{t.rightBarTween=null}).start(),e.knowhere&&C.knowhere){const I=e.knowhere.material;if(I.uniforms.uScaleFactor&&I.uniforms.uHudOffset){t.knowhereMorphTween&&t.knowhereMorphTween.stop(),t.knowherePhysicsTween&&t.knowherePhysicsTween.stop();const Y=I.uniforms.uScaleFactor.value,H=I.uniforms.uHudOffset.value.x,D=I.uniforms.uHudOffset.value.y,W=t.material,Q=W.uniforms.uKnowhereGravity.value,j=W.uniforms.uKnowhereRadius.value,ee=W.uniforms.uKnowhereGravityHoverFactor.value;t.knowhereMorphTween=new o.Tween({scale:Y,x:H,y:D}).to({scale:C.knowhere.scale,x:C.knowhere.offset.x,y:C.knowhere.offset.y},N).easing(o.Easing.Quadratic.InOut).onUpdate(ae=>{I.uniforms.uScaleFactor.value=ae.scale,I.uniforms.uHudOffset.value.set(ae.x,ae.y)}).onComplete(()=>{t.knowhereMorphTween=null}).start(),t.knowherePhysicsTween=new o.Tween({gravity:Q,radius:j,hoverMult:ee}).to({gravity:C.knowhere.gravity||0,radius:C.knowhere.radius||200,hoverMult:C.knowhere.gardenHoverMult||50},N).easing(o.Easing.Quadratic.InOut).onUpdate(ae=>{W.uniforms.uKnowhereGravity.value=ae.gravity,W.uniforms.uKnowhereRadius.value=ae.radius,W.uniforms.uKnowhereGravityHoverFactor&&(W.uniforms.uKnowhereGravityHoverFactor.value=ae.hoverMult)}).onComplete(()=>{t.knowherePhysicsTween=null}).start(),t.targetKnowhereGravity=C.knowhere.gravity||50,t.targetKnowhereRadius=C.knowhere.radius||200,t.targetGardenHoverMult=C.knowhere.gardenHoverMult||50,t.targetChargeUpDur=C.knowhere.chargeUpDur||3e3,t.targetCollapseOutDur=C.knowhere.collapseOutDur||1200}}const U=t.points.geometry.morphCurrentIndex||0,E=t.isMorphing;let k=!1;if(C.targetIndex!==void 0){const I=()=>{R||f(0,1,.2);const Y=2e3,H={t:0};let D=!1;t.currentMorphTween&&t.currentMorphTween.stop(),t.currentMorphTween=new o.Tween(H).to({t:100},Y).easing(o.Easing.Linear.None).onUpdate(()=>{const W=H.t/100;R||f(W,1,.2),g(1),H.t>=80&&!D&&(D=!0)}).onComplete(()=>{R||f(1,1),b&&b(),t.currentMorphTween=null}).start()};if(U!==C.targetIndex||E){E||(t.isMovingUp=q);const Y=h===3;Y&&I(),t.morphToTarget(C.targetIndex,N,.1,()=>{Y||(R||f(t.isMovingUp?0:1,0),b&&b())},H=>{if(!Y){let D=H;t.isMovingUp&&(D=1-H),R||f(D,1,.2)}}),k=!0}else h===3&&(k=!0,I())}if(C.action&&C.action(t),!k&&!R)if(t.beamTimeout&&(clearTimeout(t.beamTimeout),t.beamTimeout=null),h===2&&q){t.currentMorphTween&&t.currentMorphTween.stop();let I={t:100};t.currentMorphTween=new o.Tween(I).to({t:0},1e3).easing(o.Easing.Quadratic.Out).onUpdate(()=>{R||f(I.t/100,1,.2)}).onComplete(()=>{b&&b(),t.currentMorphTween=null}).start()}else b&&b()})(),C.ui){const B=document.querySelector(".scroll-indicator");if(B){const U=B.style.display==="none"||B.style.opacity==="0";if(C.ui.scrollIcon==="hidden"){t.scrollTween&&t.scrollTween.stop();const E={y:parseFloat(B.style.getPropertyValue("--scroll-indicator-margin"))||16,opacity:parseFloat(B.style.opacity)||.9};t.scrollTween=new o.Tween(E).to({y:-16,opacity:0},800).easing(o.Easing.Quadratic.In).onUpdate(()=>{B.style.setProperty("--scroll-indicator-margin",`${E.y}vh`),B.style.opacity=E.opacity}).onComplete(()=>{B.style.display="none",B.style.pointerEvents="none",t.scrollTween=null}).start()}else{t.scrollTween&&t.scrollTween.stop(),U&&(B.style.display="flex",B.style.pointerEvents="auto",B.style.setProperty("--scroll-indicator-margin","-16vh"),B.style.opacity="0"),B.style.pointerEvents="auto",B.classList.remove("pos-middle","pos-bottom","pos-left"),C.ui.scrollIcon&&B.classList.add(C.ui.scrollIcon);const E=C.ui.scrollScale!==void 0?C.ui.scrollScale:1,k={y:parseFloat(B.style.getPropertyValue("--scroll-indicator-margin"))||-16,opacity:parseFloat(B.style.opacity)||0,scale:parseFloat(B.style.getPropertyValue("--scroll-scale"))||0};t.scrollTween=new o.Tween(k).to({y:16,opacity:.9,scale:E},1200).easing(o.Easing.Quadratic.Out).onUpdate(()=>{B.style.setProperty("--scroll-indicator-margin",`${k.y}vh`),B.style.opacity=k.opacity,B.style.setProperty("--scroll-scale",k.scale)}).onComplete(()=>{B.style.display="flex",t.scrollTween=null}).start(),h===0?T(!0):M()}}if(t&&t.material&&t.material.uniforms.uTitleMaskRectBase){const U=C.ui.maskBounds,E=C.ui.maskScale!==void 0?C.ui.maskScale:0,k=t.material.uniforms.uTitleMaskRectBase,I=t.material.uniforms.uTitleMaskScale,Y=window.innerHeight/100,H=4.5,D=-10,W=3,Q=-.75;if(t.maskFollowTween&&t.maskFollowTween.stop(),t.activeUniformTweens?(t.activeUniformTweens.forEach(ee=>ee.stop()),t.activeUniformTweens=[]):t.activeUniformTweens=[],U&&U.useBoard){const ee=document.getElementById("board");t.maskFollowTween=new o.Tween({t:0}).to({t:1},N).easing(o.Easing.Cubic.InOut).onUpdate(ae=>{if(ee&&I.value>.001){const le=ee.getBoundingClientRect(),ve=le.width/Y,Se=le.height/Y,we=le.left/Y,X=le.top/Y,ne=ve+H+D,ie=Se+W+Q,ue=we-H,ce=X-W,be=ue+ne/2,Ee=100-(ce+ie/2);k.value.set(be*Y,Ee*Y,ne/2*Y,ie/2*Y)}}).start(),t.activeUniformTweens.push(t.maskFollowTween)}const j=new o.Tween(I).to({value:E},N).easing(o.Easing.Cubic.InOut).start();t.activeUniformTweens.push(j)}const z=document.getElementById("board");if(z){z.style.display="flex";const U=ui[["chaos","root","dance","walk"][h]]||ui.chaos;U.mode&&(z.classList.forEach(j=>{j.startsWith("mode-")&&z.classList.remove(j)}),z.classList.add(U.mode)),t.boardPosTween&&t.boardPosTween.stop();const E=N*.5,k=window.innerHeight/100,I=z.getBoundingClientRect(),Y=U.top!==void 0&&U.top!==0,H=Y?I.top/k:(window.innerHeight-I.bottom)/k,D=z.style.opacity===""?0:parseFloat(z.style.opacity);t.boardPosTween=new o.Tween({val:H,op:D}).to({val:Y?U.top:U.bottom,op:1},E).easing(o.Easing.Quadratic.InOut).onUpdate(j=>{z.style.opacity=j.op,Y?(z.style.top=j.val+"vh",z.style.bottom="auto"):(z.style.bottom=j.val+"vh",z.style.top="auto")}).start(),t.boardScaleTween&&t.boardScaleTween.stop();const W=t._lastBoardScale??1,Q=t._lastSubProgress??1;if(window.__boardScale=W,window.__boardSubProgress=Q,t.boardScaleTween=new o.Tween({scale:W,sub:Q}).to({scale:U.scale,sub:U.subVisible?1:0},E).easing(o.Easing.Quadratic.InOut).onUpdate(j=>{window.__boardScale=j.scale,window.__boardSubProgress=j.sub,go(j.scale,j.sub)}).onComplete(()=>{t._lastBoardScale=U.scale,t._lastSubProgress=U.subVisible?1:0,window.__boardScale=U.scale,window.__boardSubProgress=t._lastSubProgress,go(U.scale,t._lastSubProgress)}).start(),C.ui.board){const j=z.querySelector(".intro-sub"),ee=z.querySelector(".intro-main-name1"),ae=z.querySelector(".intro-main-name2"),le=z.querySelector(".board-philo-sub"),ve=z.querySelector(".board-philo-main"),Se=z.querySelector("#board-feat-1"),we=z.querySelector("#board-feat-2");j&&C.ui.board.nameSub&&A(j,C.ui.board.nameSub,E,j.innerText),ee&&A(ee,C.ui.board.name1,E,ee.innerText),ae&&A(ae,C.ui.board.name2,E,ae.innerText),le&&C.ui.board.philoSub&&A(le,C.ui.board.philoSub,E,le.innerText),ve&&C.ui.board.philo&&A(ve,C.ui.board.philo,E,ve.innerText),Se&&C.ui.board.feat1&&A(Se,C.ui.board.feat1,E,Se.innerText),we&&C.ui.board.feat2&&A(we,C.ui.board.feat2,E,we.innerText)}}}},A=(h,b,p=800,R="")=>{if(!h||h.innerText===b&&R===b)return;const C=R||h.innerText||"";h._scrambleRAId&&cancelAnimationFrame(h._scrambleRAId);const N=getComputedStyle(h).fontFamily,q=Ae(C,`20px ${N}`),$=Ae(b,`20px ${N}`),L="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*",B=performance.now(),z=U=>{const E=U-B,k=Math.min(E/p,1);h._stableWidth=q+($-q)*k;const I=Math.round(C.length+(b.length-C.length)*k);let Y="";for(let H=0;H<I;H++){const D=H/I;k>D?k>D+.1||k===1?Y+=b[H]||"":Y+=L[Math.floor(Math.random()*42)]:k<D*.5&&H<C.length?Y+=C[H]:Y+=L[Math.floor(Math.random()*42)]}h.innerText=Y,typeof window.fitBoardTexts=="function"&&window.fitBoardTexts(window.__boardScale||1,window.__boardSubProgress??1),k<1?h._scrambleRAId=requestAnimationFrame(z):(h._scrambleRAId=null,h._stableWidth=null,typeof window.fitBoardTexts=="function"&&window.fitBoardTexts(window.__boardScale||1,window.__boardSubProgress??1))};h._scrambleRAId=requestAnimationFrame(z)},F=a.create({target:window,type:"wheel,touch",onDown:()=>G(1),onUp:()=>G(-1),tolerance:10,dragMinimum:10});F.enable();const G=h=>{if(!r)return;const b=document.getElementById("experience-container");if(b&&!b.matches(":hover")||e&&e.HUD&&e.HUD.isOpen===!1)return;const p=Date.now();let R=t.isMorphing,C=n;if(h>0){if(C=Math.min(n+1,s),n===s&&!u){const B=v[s];B&&B.action&&(d=p,B.action(t))}}else C=Math.max(n-1,0);const N=500,q=v[C];q&&q.targetIndex!==void 0&&(typeof q.targetIndex=="function"?q.targetIndex():q.targetIndex),R=t.isMorphing,t.morphOriginIndex,t.morphRequestedTarget;const $=C===t.morphOriginStep&&R,L=C===t.morphTargetStep&&R&&t.isReversing;if(!($||L)){if(R||p-d<N)return}if(h<0){const B=v[n];if(B&&B.allowsScrollBack===!1)return}C!==n&&(n=C,d=p,document.body.classList.add("morph-active"),P(n,()=>{t.isMorphing||document.body.classList.remove("morph-active")}))};t.setScrollLock=h=>{r=h;const b=document.getElementById("experience-container");document.body.style.overflow="hidden",b&&(b.style.overflow="hidden",b.scrollTo(0,0));const p=document.getElementById("app-container");p&&(p.style.height="100%"),h?(F.enable(),g(0),"scrollRestoration"in history&&(history.scrollRestoration="manual"),window.scrollTo(0,0)):F.disable()};const V=async(h=3e3)=>{const b=e.camera,p=e.orbitControls,R=t.material.uniforms,C={x:61.56,y:2.97,z:30},N={x:0,y:0,z:0},q=.25,$={x:Math.PI/2,y:-1.15,z:0},L={x:.4,y:-.8},B={x:0,y:0,z:0},z=.5,U=2,E=b.position.clone(),k=p.target.clone(),I=R.uModelScale.value,Y=R.uModelRotation.value.clone(),H=R.uModelScreenOffset.value.clone(),D=R.uModelPosition.value.clone(),W=R.uLightSizeBoost.value,Q=R.uPixelRatio.value;e&&(e.isTransitioning=!0),Ru(e,h),e.HUD&&(e.HUD.resetBarPhysics&&e.HUD.resetBarPhysics(),e.HUD.runTweenShowIsland(3e3),e.HUD.runTweenShowDecos(3e3),e.HUD.runTweenShowRNotch(3e3)),new o.Tween({t:0}).to({t:1},h).easing(o.Easing.Cubic.Out).onUpdate(j=>{const ee=j.t;b.position.lerpVectors(E,C,ee),p.target.lerpVectors(k,N,ee),b.lookAt(p.target),R.uModelScale.value=I+(q-I)*ee,R.uModelRotation.value.lerpVectors(Y,$,ee),R.uModelScreenOffset.value.lerpVectors(H,L,ee),R.uModelPosition.value.lerpVectors(D,B,ee),R.uLightSizeBoost.value=W+(z-W)*ee,R.uPixelRatio.value=Q+(U-Q)*ee,f(1-ee,1),g(1)}).onComplete(()=>{e&&(e.isTransitioning=!1),t.beamTimeout&&clearTimeout(t.beamTimeout),c&&clearTimeout(c),u=!1,n=2,t.previousStep=3,t.playAnimation("gangnam",.5,!0),t.setScrollLock(!0),e.maximizer&&(e.maximizer.lastStep=-1),console.log("🔙 Reversed to Points Step 2 -> Auto Trigger Root"),setTimeout(()=>{t.triggerStep&&t.triggerStep(1)},500)}).start()};return t.triggerReverseTransition=()=>{n===3&&V(1e3)},t.setScrollLock(!0),()=>{F.kill()}}var Sd,xd=J((()=>{Tl(),ut(),Gn(),et(),lt(),co(),Ur(),ji(),Sd=100})),Ho,No,$t,br,Er,De,Cr,Ir,Rr,Kt,ft,Mr,vt,_r,Ar,Pr,si,li,po,ht,va,Br,Or,ci,xl,Tl=J((()=>{Wt(),pd(),hd(),gd(),Ki(),wt(),yt(),yd(),xd(),Hn(),et(),ct(),Gi(),Ho=1500,No=500*1.2,$t=1.53,br=18e3,Er=.05,De={x:61.56,y:2.97,z:30},Cr=2,Ir=.4,Rr=.8,Kt=-40,ft=2.5,Mr=1,vt=8,_r="200px",Ar="20px",Pr="20px",si={value:.15},li={value:.08},po=[{name:"man",baseColor:new l.Vector3(1,1,1),brightness:1,pointSizeMultiplier:1},{name:"heart",baseColor:new l.Vector3(.984,.757,.537),brightness:8.65,pointSizeMultiplier:.15},{name:"heartDev",baseColor:new l.Vector3(.2,.8,.8),brightness:8.75,pointSizeMultiplier:1}],ht=[{name:"Alkaid",category:"VALIDATION",meaning:"Technical De-risking",usp_subtitle:"TECH VALIDATION • WEBGL",usp:"I personally de-risk technical roadmaps by validating architectural feasibility and requirement scalability through code-driven functional prototyping in WebGL.",row:61,col:31,brightnessFactor:5,textureSlotRow:3,textureSlotCol:6},{name:"Mizar",category:"EXECUTION",meaning:"Automation",usp_subtitle:"WORKFLOW AUTOMATION • N8N",usp:"I personally deploy automated AI and n8n production pipelines that reduce manual project overhead by an estimated 40%.",row:60,col:35,brightnessFactor:1,textureSlotRow:1,textureSlotCol:4},{name:"Alioth",category:"EXECUTION",meaning:"Workflow Velocity",usp_subtitle:"VELOCITY • JIRA",usp:"I lead high-velocity product execution through structured Jira management and data-driven SQL audits to ensure on-time delivery.",row:56,col:35,brightnessFactor:3.5,textureSlotRow:1,textureSlotCol:2,useDipperColor:!0},{name:"Megrez",category:"LOGIC",meaning:"Data-driven ROI",usp_subtitle:"DATA ANALYSIS • RICE",usp:"I navigate competing stakeholder demands using the RICE and MoSCoW frameworks to deliver maximum ROI within tight technical constraints.",row:55,col:32,brightnessFactor:.8,textureSlotRow:1,textureSlotCol:6},{name:"Phecda",category:"LOGIC",meaning:"Agile Standards",usp_subtitle:"ADAPTIVE LOGIC • GHERKIN",usp:"I establish a Single Source of Truth for complex requirements via Gherkin Acceptance Criteria, aligning 10,000+ stakeholders.",row:52,col:30,brightnessFactor:1,textureSlotRow:2,textureSlotCol:4},{name:"Merak",category:"PI-SHAPED",meaning:"UI/UX Strategy",usp_subtitle:"UX ARCHITECTURE • TECH",usp:"I bridge deep engineering with human-centric design, ensuring your complex architectural vision is never compromised by UX constraints.",row:49,col:28,brightnessFactor:1,textureSlotRow:2,textureSlotCol:3},{name:"Dubhe",category:"PI-SHAPED",meaning:"Design Synergy",usp_subtitle:"TECH SYNERGY • FIGMA",usp:"I integrate high-fidelity Figma designs with functional prototyping to ensure every requirement is architecturally sound.",row:45,col:29,brightnessFactor:1.5,textureSlotRow:0,textureSlotCol:3},{name:"CONNECT",category:"STRATEGIC SYNERGY",meaning:"Technical Partnership",usp_subtitle:"BUSINESS • TECH • USER",usp:"I serve as the connective tissue of your product lifecycle. By unifying abstract business goals, technical feasibility, and user-centric design into a single roadmap, I ensure your vision survives the journey from pitch to production.",row:71,col:68,brightnessFactor:5,textureSlotRow:3,textureSlotCol:2,useDipperColor:!0}],va=new l.Vector3(61.56,2.97,30),Br=[new l.Vector3(-20,20,-14),new l.Vector3(-20,25.8,-22),new l.Vector3(-20,27,-31.5),new l.Vector3(-20,28,-45),new l.Vector3(-20,24.4,-48.4),new l.Vector3(-20,27.5,-57.2),new l.Vector3(-20,33.3,-57),new l.Vector3(-25,-27,38)],Or=[140,115,175,130,165,190,145,105],ci=Br.map((e,t)=>{const o=new l.Vector3().subVectors(e,va).normalize();return{pos:new l.Vector3().addVectors(va,o.multiplyScalar(Or[t]))}}),xl=class{get isMorphing(){return this.material?.uniforms?.uProgress?.value>.01||!!this.morphTween}get targetIndex(){return this.points?.geometry?.morphTargetIndex!==void 0?this.points.geometry.morphTargetIndex:this.morphRequestedTarget||0}constructor(e,t,o,i,a={}){this.scene=e,this.camera=t,this.renderer=o,this.options=Object.assign({enableLoadingUI:!0},a),e.points=this,this.bigDipper=ht,document.documentElement.style.setProperty("overflow","hidden","important"),document.body.style.setProperty("overflow","hidden","important"),"scrollRestoration"in history&&(history.scrollRestoration="manual"),window.scrollTo(0,0),this.isBloomEnabled=!0,this.points=null,this.userData={},this._currentPersona=Go,this.material=null,this.dipperLines=null,this.raycaster=i&&i.raycaster?i.raycaster:i||new l.Raycaster,this.intersectionPlane=null,this.mouse=new l.Vector2(0,0),this.targetMouse=new l.Vector2(0,0),this.smoothMouse=new l.Vector2(0,0),this.smoothRepulsionMouse=new l.Vector2(0,0),this.rawMouse=new l.Vector2(0,0),this.isFirstMouseMove=!0,this.clock=new l.Clock(!1),this.onMouseMove=this.onMouseMove.bind(this),this.onMouseLeave=this.onMouseLeave.bind(this),this.onMouseClick=this.onMouseClick.bind(this),this.onWindowResize=this.onWindowResize.bind(this),this.pointCap=br,this.morphs=[];const r=new l.Vector3(De.x,De.y,De.z),n=new l.Vector3(0,0,0),s=new l.Vector3().subVectors(n,r).normalize();this.shaderUniforms={iTime:{value:0},uResolution:{value:new l.Vector2(this.renderer.domElement.clientWidth,this.renderer.domElement.clientHeight)},uPixelRatio:{value:2},uMousePos:{value:new l.Vector3(0,0,0)},uMouseNDC:{value:new l.Vector2(0,0)},uProgress:{value:0},uMorphStagger:{value:.1},uIsChaos:{value:1},uSize:{value:.015},uColor:{value:new l.Color("#ffffff")},uStarTexture:{value:oe.spriteSheet},uSizeThreshold:{value:.05},uCols:{value:8},uRows:{value:4},uSpritePixels:{value:new l.Vector2(512,256)},uLightDir:{value:new l.Vector3(-100,-100,100.7)},uLightStrength:{value:1},uLightSizeBoost:{value:1.5},uModelScale:{value:1},uModelPosition:{value:new l.Vector3(0,0,0)},uModelRotation:{value:new l.Vector3(0,0,0)},uEnableMouseRotation:{value:!0},uAttractionForce:{value:0},uIsArmatureState:{value:0},uAttractionRefSize:{value:.5},uModelScreenOffset:{value:new l.Vector2(0,0)},uModelPointSizeFactor:{value:1},uHoverPointScaleFactor:{value:2.5},uVibrateAmp:{value:.8},uModelVibFactor:{value:1},uVibrateBoostSizeThreshold:{value:1},uBaseRotateSpeed:{value:1},uHoverRadius:{value:200},uAttractionRadius:{value:200},uHoveredTextureIndex:{value:0},uHoveredIndex:{value:-1},uGlobalHoverStrength:{value:0},uGridZ:{value:Kt},uBaseGridZ:{value:Kt},uGridForward:{value:s},uBigDipper:{value:ht.map(c=>new l.Vector4(c.row,c.col,c.brightnessFactor||1,(c.textureSlotRow||0)*8+(c.textureSlotCol||0)))},uGridSide:{value:0},uModelPointCount:{value:0},uFOV:{value:this.camera.fov},uProjectionMultiplier:{value:1},uDipperColor:{value:new l.Vector3(0,1,1)},uPulseCenters:{value:Array(vt).fill().map(()=>new l.Vector3(0,0,0))},uPulseStartTimes:{value:Array(vt).fill(-100)},uPulseDuration:{value:2.5},uPulseDisplacementFactors:{value:Array(vt).fill(0)},uPulseSpeed:{value:60},uPulseWidth:{value:7},uActivePulseCount:{value:0},uPulseactive:{value:0},uMaskRect:{value:new l.Vector4(0,0,0,0)},uMaskRectNav:{value:new l.Vector4(0,0,0,0)},uMaskSlant:{value:new l.Vector2(0,0)},uDipperBrightnessScalar:{value:1},uModelMat3:{value:new l.Matrix3},uMouseScreen:{value:new l.Vector2(0,0)},uTitleMaskRectBase:{value:new l.Vector4(0,0,0,0)},uTitleMaskScale:{value:0},uTitleMaskEdgeJitter:{value:.02},uKnowhereScreen:{value:new l.Vector2(0,0)},uKnowhereGravity:{value:50},uKnowhereGravityMultiplier:{value:-1},uKnowhereGravityHoverFactor:{value:50},uKnowhereRadius:{value:200},uKnowhereScale:{value:1},uIsGardenHovering:{value:0},uKnowhereVibrateBoost:{value:0},uRippleColor:{value:new l.Vector3(0,1,1)},uDistStaggerFactor:{value:0},uDistStaggerMax:{value:120},uBonePos:{value:new l.Vector2(0,0)},uBoneRadius:{value:.15},uBoneIntensity:{value:0},uStickRect:{value:new l.Vector4(0,0,0,0)},uStickStrength:{value:0}},this.bigDipper=ht,this.currentPulseIndex=0,this.userData.chaosUniforms=l.UniformsUtils.clone(this.shaderUniforms),this.userData.chaosUniforms.uIsChaos.value=1,this.forceDisableAttraction=!1,this.tooltip=new Sl,this.tooltip.tooltip.addEventListener("mouseleave",c=>{c.relatedTarget!==this.renderer.domElement&&this.onMouseLeave(c)}),this.enableScrollMorph=!0,this.isReady=!1,this._modelPointCount=0,this._gridSide=1,this._tooltipFrameCount=0}_updateCachedCounts(){if(!this.points||!this.points.geometry)return;const e=this.pointCap,t=this.points.geometry.attributes.aTargetSizeIsGrid;if(t){let o=0;for(let a=0;a<e&&t.array[a*2+1]<.5;a++)o++;this._modelPointCount=o;const i=e-o;this._gridSide=Math.ceil(Math.sqrt(i))||1}this.material&&this.material.uniforms&&(this.material.uniforms.uModelPointCount.value=this._modelPointCount,this.material.uniforms.uGridSide.value=this._gridSide)}async yieldToBrowser(){return new Promise(e=>requestAnimationFrame(e))}async init(){he.start("Points: Services Init"),this.initPostprocessing(),this.intersectionPlane=new l.Mesh(new l.PlaneGeometry(5e3,5e3),new l.MeshBasicMaterial({visible:!0,opacity:0,transparent:!0,depthWrite:!1})),this.intersectionPlane.position.z=Kt,this.scene.add(this.intersectionPlane),this.points&&this.points.geometry&&(this.points.geometry.morphCurrentIndex=0),this._initDipperLines(),this.renderer.domElement.addEventListener("mousemove",this.onMouseMove,!1),this.renderer.domElement.addEventListener("mouseleave",this.onMouseLeave,!1),this.renderer.domElement.addEventListener("click",this.onMouseClick,!1),window.addEventListener("resize",this.onWindowResize,!1),this.renderer.domElement&&(this.resizeObserver=new ResizeObserver(()=>this.onWindowResize()),this.resizeObserver.observe(this.renderer.domElement)),this.createLandingOverlay(),he.end("Points: Services Init"),he.start("Points: Background Particles"),await this.createBackgroundParticles(),this.onWindowResize(),this._updateCachedCounts(),he.start("Points: Model Loading"),await this.loadModel(),he.end("Points: Model Loading"),this.createControlUI(),this._dipperPointIndices=new Set,ht.forEach((i,a)=>{this._dipperPointIndices.add(this._dipperBaseIndex+a)}),window.addEventListener(ro.GARDEN.HOVER_START,()=>{this.dipperLines&&(this.dipperLines.tween&&this.dipperLines.tween.stop(),this.dipperLines.tween=new x.Tween(this.dipperLines.userData).to({opacity:1,drawProgress:1},1750).easing(x.Easing.Cubic.InOut).start())}),window.addEventListener(ro.GARDEN.HOVER_END,()=>{this.dipperLines&&(this.dipperLines.tween&&this.dipperLines.tween.stop(),this.dipperLines.tween=new x.Tween(this.dipperLines.userData).to({opacity:0,drawProgress:0},800).easing(x.Easing.Cubic.Out).start())}),this.isReady=!0;const e=po.find(i=>i.name==="heartDev"),t=po.find(i=>i.name==="heart"),o=this._currentPersona===Te.DEV?e.baseColor:t.baseColor;this.shaderUniforms.uRippleColor.value.copy(o),this.material&&this.material.uniforms.uRippleColor&&this.material.uniforms.uRippleColor.value.copy(o),this.warmup()}warmup(){if(!this.composer||!this.points)return;const e=this.points.visible;this.points.visible=!0,this.material.uniforms.iTime.value=.001,this.composer.render(.016),this.points.visible=e}activateScrollInteractions(){wd(this.scene,this,x)}playIntro(){this.points&&(this.points.visible=!0),this.clock.start(),this.clock.elapsedTime=0}initPostprocessing(){this.composer=new Dl(this.renderer);const e=new Nl(this.scene,this.camera);this.bloomPass=new Mi(new l.Vector2(this.renderer.domElement.clientWidth,this.renderer.domElement.clientHeight),Cr,Ir,Rr),this.bloomPass.renderTargetsHorizontal.forEach(t=>{t.texture.type=l.HalfFloatType}),this.bloomPass.renderTargetsVertical.forEach(t=>{t.texture.type=l.HalfFloatType}),this.composer.addPass(e),this.composer.addPass(this.bloomPass)}createLandingOverlay(){this.overlayContainer=document.createElement("div"),this.overlayContainer.id="overlay-container",Object.assign(this.overlayContainer.style,{position:"absolute",top:"0",left:"0",width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",pointerEvents:"none",zIndex:"9999"}),document.body.appendChild(this.overlayContainer),this.options.enableLoadingUI&&(this.progressText=document.createElement("div"),this.progressText.innerText="0%",Object.assign(this.progressText.style,{color:"white",fontSize:"24px",fontFamily:"'Orbitron', sans-serif",marginBottom:"20px"}),this.overlayContainer.appendChild(this.progressText)),this.options.enableLoadingUI&&(this.progressBarContainer=document.createElement("div"),Object.assign(this.progressBarContainer.style,{width:"300px",height:"4px",background:"rgba(255,255,255,0.2)",borderRadius:"2px",overflow:"hidden"}),this.progressBar=document.createElement("div"),Object.assign(this.progressBar.style,{width:"0%",height:"100%",background:"white",transition:"width 0.1s linear"}),this.progressBarContainer.appendChild(this.progressBar),this.overlayContainer.appendChild(this.progressBarContainer)),this.controlsWrapper=document.createElement("div"),this.controlsWrapper.style.position="absolute",this.controlsWrapper.style.bottom="30px",this.controlsWrapper.style.left="50%",this.controlsWrapper.style.transform="translateX(-50%)",this.controlsWrapper.style.display="none",this.controlsWrapper.style.flexDirection="column",this.controlsWrapper.style.alignItems="center",this.controlsWrapper.style.gap="15px",this.controlsWrapper.style.zIndex="1000",this.controlsWrapper.style.background="rgba(0, 0, 0, 0.5)",this.controlsWrapper.style.padding="10px 20px",this.controlsWrapper.style.borderRadius="12px",this.controlsWrapper.style.backdropFilter="blur(5px)",this.controlsWrapper.style.pointerEvents="auto",this.overlayContainer.appendChild(this.controlsWrapper),this.buttonRow=document.createElement("div"),this.buttonRow.style.display="flex",this.buttonRow.style.alignItems="center",this.buttonRow.style.gap="10px",this.controlsWrapper.appendChild(this.buttonRow),this.morphInput=document.createElement("input"),this.morphInput.type="number",this.morphInput.value="0",this.morphInput.style.padding="10px",this.morphInput.style.fontSize="16px",this.morphInput.style.borderRadius="8px",this.morphInput.style.border="1px solid #444",this.morphInput.style.background="#222",this.morphInput.style.color="#fff",this.backBtn=document.createElement("button"),this.backBtn.innerText="Back",this.backBtn.style.padding="12px 20px",this.backBtn.style.fontSize="18px",this.backBtn.style.border="none",this.backBtn.style.borderRadius="30px",this.backBtn.style.background="#444",this.backBtn.style.color="#fff",this.backBtn.style.cursor="pointer",this.backBtn.style.fontFamily="'Orbitron', sans-serif",this.backBtn.style.textTransform="uppercase",this.backBtn.style.marginRight="10px",this.triggerPrevMorph=()=>{let e=this.points.geometry,t=e.morphData?e.morphData.length:0;if(t===0)return;let o=((e.morphCurrentIndex||0)-1+t)%t;this.morphInput.value=o,this.morphToTarget(o),this.controlsCreated||(this.createControlUI(),this.controlsCreated=!0)},this.backBtn.onclick=this.triggerPrevMorph,this.buttonRow.appendChild(this.backBtn),this.morphInput.style.width="60px",this.morphInput.style.textAlign="center",this.buttonRow.appendChild(this.morphInput),this.enterBtn=document.createElement("button"),this.enterBtn.innerText="Morph",this.enterBtn.style.padding="12px 30px",this.enterBtn.style.fontSize="18px",this.enterBtn.style.border="none",this.enterBtn.style.borderRadius="30px",this.enterBtn.style.background="linear-gradient(90deg, #ff0077, #7700ff)",this.enterBtn.style.color="#fff",this.enterBtn.style.cursor="pointer",this.enterBtn.style.fontFamily="'Orbitron', sans-serif",this.enterBtn.style.textTransform="uppercase",this.enterBtn.style.letterSpacing="2px",this.enterBtn.style.boxShadow="0 0 15px rgba(255, 0, 119, 0.5)",this.enterBtn.style.transition="all 0.3s ease",this.enterBtn.style.display=this.options.enableLoadingUI?"none":"block",this.enterBtn.onmouseenter=()=>{this.enterBtn.style.transform="scale(1.05)",this.enterBtn.style.boxShadow="0 0 25px rgba(119, 0, 255, 0.7)"},this.enterBtn.onmouseleave=()=>{this.enterBtn.style.transform="scale(1.0)",this.enterBtn.style.boxShadow="0 0 15px rgba(255, 0, 119, 0.5)"},this.buttonRow.appendChild(this.enterBtn),this.nextBtn=document.createElement("button"),this.nextBtn.innerText="Next",this.nextBtn.style.padding="12px 20px",this.nextBtn.style.fontSize="18px",this.nextBtn.style.border="none",this.nextBtn.style.borderRadius="30px",this.nextBtn.style.background="#444",this.nextBtn.style.color="#fff",this.nextBtn.style.cursor="pointer",this.nextBtn.style.fontFamily="'Orbitron', sans-serif",this.nextBtn.style.textTransform="uppercase",this.nextBtn.style.marginLeft="10px",this.triggerNextMorph=()=>{let e=this.points.geometry,t=e.morphData?e.morphData.length:0;if(t===0)return;let o=((e.morphCurrentIndex||0)+1)%t;this.morphInput.value=o,this.morphToTarget(o),this.controlsCreated||(this.createControlUI(),this.controlsCreated=!0)},this.nextBtn.onclick=this.triggerNextMorph,this.buttonRow.appendChild(this.nextBtn),this.sliderRow=document.createElement("div"),this.sliderRow.style.display="flex",this.sliderRow.style.alignItems="center",this.sliderRow.style.gap="10px",this.sliderRow.style.width="100%",this.sliderRow.style.justifyContent="center",this.controlsWrapper.appendChild(this.sliderRow),this.progressSlider=document.createElement("input"),this.progressSlider.type="range",this.progressSlider.min="0",this.progressSlider.max="1",this.progressSlider.step="0.01",this.progressSlider.value="0",this.progressSlider.style.width="300px",this.progressSlider.style.cursor="pointer",this.progressSlider.oninput=e=>{const t=parseFloat(e.target.value);this.points.material&&this.points.material.uniforms.uProgress&&(this.points.material.uniforms.uProgress.value=t)},this.sliderRow.appendChild(this.progressSlider),this.enterBtn.addEventListener("click",()=>{const e=parseInt(this.morphInput.value,10);isNaN(e)||(this.morphToTarget(e),this.controlsCreated||(this.createControlUI(),this.controlsCreated=!0))})}addMorphData(e,t,o=this.userData.chaosUniforms){let{targetPosAttr:i,targetColorAttr:a,targetSizeIsGridAttr:r,targetNormalAttr:n,targetSkinIndexAttr:s,targetSkinWeightAttr:c,targetSkeleton:u,targetBindMatrix:d,targetBindMatrixInverse:m}=t,f=this.points.geometry.morphData??[];this.morphData||(this.morphData={});const g={name:e,targetUniforms:o,targetPosAttr:i,targetColorAttr:a,targetSizeIsGridAttr:r,targetNormalAttr:n,targetSkinIndexAttr:s,targetSkinWeightAttr:c,targetSkeleton:u,targetBindMatrix:d,targetBindMatrixInverse:m};let w=f.findIndex(y=>y.name===e);w!==-1?f[w]=g:f.push(g),this.points.geometry.morphData=f,this.morphData[e]=g}_getMorphData(e){return typeof e=="string"?this.morphData[e]:this.points.geometry.morphData[e]}_setMorphTargetData(e){const t=this._getMorphData(e);if(!t){console.error(`Morph target ${e} not found`);return}const o=this.points.geometry;o.setAttribute("aTargetPos",t.targetPosAttr),o.setAttribute("aTargetColor",t.targetColorAttr),o.setAttribute("aTargetNormal",t.targetNormalAttr),o.setAttribute("aTargetSizeIsGrid",t.targetSizeIsGridAttr),t.targetSkinIndexAttr&&o.setAttribute("skinIndex",t.targetSkinIndexAttr),t.targetSkinWeightAttr&&o.setAttribute("aTargetSkinWeight",t.targetSkinWeightAttr),t.targetSkeleton?(this.points.skeleton=t.targetSkeleton,this.points.bindMatrix=t.targetBindMatrix||new l.Matrix4,this.points.bindMatrixInverse=t.targetBindMatrixInverse||new l.Matrix4,this.points.isSkinnedMesh=!0):this.points.isSkinnedMesh=!1,o.attributes.aTargetPos.needsUpdate=!0,o.attributes.aTargetColor.needsUpdate=!0,o.attributes.aTargetNormal.needsUpdate=!0,o.attributes.aTargetSizeIsGrid.needsUpdate=!0,o.attributes.aTargetSkinWeight&&(o.attributes.aTargetSkinWeight.needsUpdate=!0),o.attributes.aTargetSkinWeight&&(o.attributes.aTargetSkinWeight.needsUpdate=!0)}_syncRestingState(e){const t=this._getMorphData(e);if(!t)return;const o=this.points.geometry,i=this.material;if(o.setAttribute("aStartPos",t.targetPosAttr),o.setAttribute("position",t.targetPosAttr),o.setAttribute("aStartColor",t.targetColorAttr),o.setAttribute("aStartNormal",t.targetNormalAttr),o.setAttribute("aStartSizeIsGrid",t.targetSizeIsGridAttr),t.targetSkinWeightAttr&&o.setAttribute("aStartSkinWeight",t.targetSkinWeightAttr),o.attributes.aStartPos.needsUpdate=!0,o.attributes.position.needsUpdate=!0,o.attributes.aStartColor.needsUpdate=!0,o.attributes.aStartNormal.needsUpdate=!0,o.attributes.aStartSizeIsGrid.needsUpdate=!0,o.attributes.aStartSkinWeight&&(o.attributes.aStartSkinWeight.needsUpdate=!0),t.targetSkinIndexAttr&&o.setAttribute("skinIndex",t.targetSkinIndexAttr),t.targetSkeleton?(this.points.skeleton=t.targetSkeleton,this.points.bindMatrix=t.targetBindMatrix||new l.Matrix4,this.points.bindMatrixInverse=t.targetBindMatrixInverse||new l.Matrix4,this.points.isSkinnedMesh=!0):this.points.isSkinnedMesh=!1,t.targetUniforms){for(const a in t.targetUniforms)if(!(a==="uResolution"||a==="uPixelRatio"||a==="uFOV"||a==="uProjectionMultiplier"||a==="uRippleColor"||a==="iTime"||a.startsWith("uPulse")||a==="uActivePulseCount"||a==="uTitleMaskRectBase"||a==="uTitleMaskScale"||a==="uTitleMaskEdgeJitter"||a.startsWith("uKnowhere"))&&i.uniforms[a]){const r=i.uniforms[a].value,n=t.targetUniforms[a].value;typeof r=="object"&&r.copy?r.copy(n):i.uniforms[a].value=n}}i.uniforms.uProgress.value=0,e===0||e===1||e===2?(this.material.uniforms.uIsChaos.value=1,this.material.uniforms.uIsArmatureState.value=0,this.material.uniforms.uGlobalHoverStrength.value=0,e===0&&(this.material.uniforms.uSizeThreshold&&(this.material.uniforms.uSizeThreshold.value=.05),this.material.uniforms.uModelPointCount)):this.material.uniforms.uIsChaos.value=0,this.points.geometry.morphCurrentIndex=e,this._updateCachedCounts()}morphToTarget(e,t=Ho,o=.1,i=null,a=null){this.tooltip&&this.tooltip.hide();const r=this.points.geometry.morphCurrentIndex||0;if(!this.morphTween&&r===e){this._syncRestingState(e),i&&i();return}let n=!1;if(this.morphTween){if(e===this.morphOriginIndex){if(this.isReversing)return;this.morphTween.stop(),this.isReversing=!0,console.log(`[Points] Morph INTERRUPT: Case A (Reversing ${this.morphOriginIndex} <-> ${this.morphRequestedTarget})`);const c=t*this.material.uniforms.uProgress.value;this.morphTween=new x.Tween(this.tweenProxy).to({t:0},c).easing(x.Easing.Cubic.Out).onUpdate(()=>{const u=this.tweenProxy.t;if(this.activePropsToTween)for(const d of this.activePropsToTween)d.type==="number"?d.uniform.value=d.start+(d.target-d.start)*u:d.uniform.copy(d.start).lerp(d.target,u);this.material.uniforms.uProgress.value=u,document.documentElement.style.setProperty("--morph-progress",`${Math.min(100,u*100)}%`),a&&a(u)}).onComplete(()=>{this.isReversing=!1,this.morphTween=null,this._syncRestingState(this.morphOriginIndex),i&&i()}).start();return}if(e===this.morphRequestedTarget){if(!this.isReversing)return;this.morphTween.stop(),this.isReversing=!1,console.log(`[Points] Morph INTERRUPT: Case B (Resuming -> ${this.morphRequestedTarget})`);const c=t*(1-this.material.uniforms.uProgress.value);this._setMorphTargetData(e),this.morphTween=new x.Tween(this.tweenProxy).to({t:1},c).easing(x.Easing.Cubic.Out).onUpdate(u=>{const d=u.t;if(this.activePropsToTween)for(const m of this.activePropsToTween)m.type==="number"?m.uniform.value=m.start+(m.target-m.start)*d:m.uniform.copy(m.start).lerp(m.target,d);this.material.uniforms.uProgress.value=d,document.documentElement.style.setProperty("--morph-progress",`${Math.min(100,d*100)}%`),a&&a(d)}).onComplete(()=>{this.morphTween=null,this._syncRestingState(e),i&&i()}).start();return}if(e===1||e===2)console.log(`[Points] Morph INTERRUPT: Case C (Pivot -> Root ${e})`),this._bakeMidFlightState(),this.morphTween.stop(),this.morphTween=null,n=!0;else return}if(this.morphOriginIndex=r,this.morphRequestedTarget=e,this.isReversing=!1,n||this._syncRestingState(r),this.points.isSkinnedMesh){const c=this.points.geometry.attributes.position.clone();this._bakeCurrentTransforms(c),this.points.geometry.setAttribute("aStartPos",c),this.points.geometry.setAttribute("position",c);const u=new l.BufferAttribute(new Float32Array(c.count*4),4);this.points.geometry.setAttribute("aStartSkinWeight",u)}this._setMorphTargetData(e),this._updateCachedCounts();const s=this._getMorphData(e);if(s&&s.targetUniforms){const c=[];for(const f in s.targetUniforms)if(!(f==="uResolution"||f==="uPixelRatio"||f==="uFOV"||f==="uProjectionMultiplier"||f==="uRippleColor"||f==="iTime"||f.startsWith("uPulse")||f==="uActivePulseCount"||f==="uTitleMaskRectBase"||f==="uTitleMaskScale"||f==="uTitleMaskEdgeJitter"||f.startsWith("uKnowhere"))&&this.material.uniforms[f]){const g=this.material.uniforms[f],w=s.targetUniforms[f].value;typeof w=="number"?c.push({type:"number",uniform:g,start:g.value,target:w}):w&&(w.isVector2||w.isVector3||w.isColor)&&c.push({type:"vector",uniform:g.value,start:g.value.clone(),target:w})}this.activePropsToTween=c,this.tweenProxy={t:0};const u=this.points.geometry.morphCurrentIndex||0,d=(u===1||u===2)&&e===3;let m=null;this.morphTween=new x.Tween(this.tweenProxy).to({t:1},t).easing(x.Easing.Cubic.Out).onStart(()=>{m=performance.now(),this.material.uniforms.uMorphStagger.value=o}).onUpdate(()=>{const f=this.tweenProxy.t;for(const w of c)w.type==="number"?w.uniform.value=w.start+(w.target-w.start)*f:w.uniform.copy(w.start).lerp(w.target,f);this.material.uniforms.uProgress.value=f;let g=f*100;if(d&&m){const w=performance.now()-m;g=Math.min(.99,w/t)*100}document.documentElement.style.setProperty("--morph-progress",`${Math.min(100,g)}%`),a&&a(f)}).onComplete(()=>{this.morphTween=null,document.documentElement.style.setProperty("--morph-progress","100%"),this._syncRestingState(e),i&&i()}).start(),this.points&&this.points.geometry&&(this.points.geometry.morphTargetIndex=e)}}interruptMorph(e=!1){if(this.morphTween&&(this.morphTween.stop(),this.morphTween=null),this.activeUniformTweens&&(this.activeUniformTweens.forEach(t=>t.stop()),this.activeUniformTweens=[]),e){const o=x.Easing.Quadratic.Out,i=this.points.geometry.morphCurrentIndex||0,a=this._getMorphData(i);if(a&&a.targetUniforms){for(const r in a.targetUniforms)if(!(r==="uResolution"||r==="uPixelRatio"||r==="uFOV"||r==="uProjectionMultiplier"||r==="uRippleColor"||r==="iTime"||r.startsWith("uPulse")||r==="uActivePulseCount"||r==="uTitleMaskRectBase"||r==="uTitleMaskScale"||r==="uTitleMaskEdgeJitter"||r.startsWith("uKnowhere"))&&this.material.uniforms[r]){const n=this.material.uniforms[r],s=a.targetUniforms[r].value;typeof s=="number"?new x.Tween(n).to({value:s},500).easing(o).start():s&&(s.isVector2||s.isVector3||s.isColor)&&new x.Tween(n.value).to(s,500).easing(o).start()}}new x.Tween(this.material.uniforms.uProgress).to({value:0},500).easing(o).onComplete(()=>{this.material.uniforms.uProgress.value=0}).start()}}_bakeMidFlightState(){if(!this.points||!this.material)return;const e=this.points.geometry,t=this.material,o=t.uniforms.uProgress.value,i=(r,n,s)=>r+(n-r)*s,a=(r,n)=>{const s=e.attributes[r],c=e.attributes[n];if(!s||!c)return;const u=s.itemSize,d=s.count,m=new Float32Array(d*u);for(let f=0;f<d*u;f++)m[f]=i(s.array[f],c.array[f],o);e.setAttribute(r,new l.BufferAttribute(m,u)),e.attributes[r].needsUpdate=!0};a("aStartPos","aTargetPos"),a("aStartColor","aTargetColor"),a("aStartNormal","aTargetNormal"),a("aStartSizeIsGrid","aTargetSizeIsGrid"),e.setAttribute("position",e.attributes.aStartPos),e.attributes.position.needsUpdate=!0,t.uniforms.uProgress.value=0,this.tweenProxy&&(this.tweenProxy.t=0)}_bakeCurrentTransforms(e){const t=this.points.geometry,o=t.attributes.position,i=t.attributes.skinIndex,a=t.attributes.aStartSkinWeight||t.attributes.aTargetSkinWeight;if(!this.points.isSkinnedMesh||!i||!a){for(let g=0;g<o.count;g++)e.setXYZ(g,o.getX(g),o.getY(g),o.getZ(g));e.needsUpdate=!0;return}const r=this.points.skeleton;r&&r.update();const n=new l.Vector3,s=this.points.bindMatrix,c=this.points.bindMatrixInverse,u=new l.Matrix4,d=new l.Vector4,m=new l.Vector4,f=new l.Vector4;for(let g=0;g<o.count;g++){n.fromBufferAttribute(o,g),d.set(n.x,n.y,n.z,1).applyMatrix4(s),m.set(0,0,0,0);for(let w=0;w<4;w++){const y=a.getComponent(g,w);if(y>1e-4){const S=i.getComponent(g,w);u.fromArray(r.boneMatrices,S*16),f.copy(d).applyMatrix4(u).multiplyScalar(y),m.add(f)}}d.copy(m).applyMatrix4(c),e.setXYZ(g,d.x,d.y,d.z)}e.needsUpdate=!0}playAnimation(e,t=.5,o=!0,i=1,a=null){if(!this.mixer){console.warn("[Points] playAnimation aborted: No Mixer");return}if(!this.scene.pointsClips){console.warn("[Points] playAnimation aborted: No scene.pointsClips");return}const r=l.AnimationClip.findByName(this.scene.pointsClips,e);if(!r)return;const n=this.mixer.clipAction(r);if(this.pointsActiveAction&&this.pointsActiveAction!==n&&this.pointsActiveAction.fadeOut(t),n.reset(),n.setEffectiveWeight(1),i<0&&(n.time=r.duration,n.paused=!1),o==="pingpong"?(n.setLoop(l.LoopPingPong,2),n.clampWhenFinished=!0):o?n.setLoop(l.LoopRepeat):(n.setLoop(l.LoopOnce),n.clampWhenFinished=!0),n.timeScale=i,n.fadeIn(t),n.play(),a){const s=c=>{c.action===n&&(this.mixer.removeEventListener("finished",s),a())};this.mixer.addEventListener("finished",s)}this.pointsActiveAction=n}playNextDance(){if(!this.scene||!this.scene.pointsClips)return;const e=this.scene.pointsClips.filter(o=>{const i=o.name.toLowerCase();return i==="robotdance"||i==="gangnam"||i==="waving"||i==="wave"||i==="breakdance"});if(e.length===0)return;this._currentDanceIdx===void 0?this._currentDanceIdx=0:this._currentDanceIdx=(this._currentDanceIdx+1)%e.length;const t=e[this._currentDanceIdx];this.playAnimation(t.name,.8,!1,1,()=>{this.playNextDance()}),this.triggerScalePulse()}triggerScalePulse(){if(!this.material||!this.material.uniforms.uModelScale)return;this._clickScaleTween&&this._clickScaleTween.stop();const e=this.material.uniforms.uModelScale,t=(this.getCurrentStep?this.getCurrentStep():0)===2?.225:e.value,o=t*1.08;this._clickScaleTween=new x.Tween(e).to({value:o},100).easing(x.Easing.Quadratic.Out).yoyo(!0).repeat(1).onComplete(()=>{e.value=t,this._clickScaleTween=null}).start()}stopAnimations(e=.5){!this.mixer||!this.pointsActiveAction||(this.pointsActiveAction.fadeOut(e),this.pointsActiveAction=null)}async loadModel(){if(oe.pointsModel){const e=oe.pointsModel;this.model=Ll.clone(e.scene),e.pointsClips&&e.pointsClips.length>0?this.scene.pointsClips||(this.scene.pointsClips=e.pointsClips):e.animations&&(this.scene.pointsClips=e.animations),e.animations&&e.animations.length>0&&(this.mixer=new l.AnimationMixer(this.model)),await this._addMorphDataByModelName(jt.ROOT,!0,{uModelScale:{value:4.4},uSizeThreshold:{value:.05},uVibrateBoostSizeThreshold:{value:.3},uIsChaos:{value:1},uModelScreenOffset:{value:new l.Vector2(.4,0)},uModelVibFactor:{value:4},uIsArmatureState:{value:0},uAttractionForce:{value:0},uAttractionRefSize:{value:.5},uLightSizeBoost:{value:2.5},uGlobalHoverStrength:{value:0},uHoveredTextureIndex:{value:0},uVibrateAmp:{value:.15},uHoverPointScaleFactor:{value:1.1},uDipperBrightnessScalar:{value:2}}),await this._addMorphDataByModelName(jt.ROOT_DEV,!0,{uModelScale:{value:4.4},uSizeThreshold:{value:.05},uVibrateBoostSizeThreshold:{value:.3},uIsChaos:{value:1},uModelScreenOffset:{value:new l.Vector2(.4,0)},uModelVibFactor:{value:4},uIsArmatureState:{value:0},uAttractionForce:{value:0},uAttractionRefSize:{value:.5},uLightSizeBoost:{value:2.5},uGlobalHoverStrength:{value:0},uHoveredTextureIndex:{value:0},uVibrateAmp:{value:.15},uHoverPointScaleFactor:{value:1.1},uDipperBrightnessScalar:{value:2}}),await this._addMorphDataByModelName(jt.CHAR,!1,{uModelScale:{value:.25},uModelRotation:{value:new l.Vector3(Math.PI/2,-1.15,0)},uIsChaos:{value:0},uModelScreenOffset:{value:new l.Vector2(.25,-.8)},uEnableMouseRotation:{value:!1},uModelPointSizeFactor:{value:1.2},uIsArmatureState:{value:1},uAttractionForce:{value:60},uAttractionRefSize:{value:.55},uAttractionRadius:{value:500},uLightSizeBoost:{value:.5},uModelVibFactor:{value:3},uSizeThreshold:{value:.01},uHoverPointScaleFactor:{value:1},uKnowhereGravityHoverFactor:{value:0}}),Qe("points-init",1);return}else console.error("Hero Model not found in resources!")}async createBackgroundParticles(){this.pointCap;let e=0;this.material=new l.ShaderMaterial({uniforms:this.shaderUniforms,vertexShader:gl,fragmentShader:vl,transparent:!0,depthWrite:!1,skinning:!0,extensions:{derivatives:!0}});const t=this.pointCap,o=new Float32Array(t*3),i=new Float32Array(t*3),a=new Float32Array(t*2),r=new Float32Array(t*2),n=new Float32Array(t*3),s=new Float32Array(t*3),c=new Float32Array(t),u=new Float32Array(t*2),d=Math.ceil(Math.sqrt(t))||1,m=new l.Vector3(De.x,De.y,De.z),f=new l.Vector3(0,0,0),g=new l.Vector3().subVectors(f,m).normalize(),w=new l.Vector3().crossVectors(g,new l.Vector3(0,1,0)).normalize(),y=new l.Vector3().crossVectors(w,g).normalize(),S=g.clone().multiplyScalar(-Kt),T=new l.Vector3,M=new l.Color("#ffffff");let O=performance.now();const _=8;for(let Y=0;Y<t;Y++){if(performance.now()-O>_){await this.yieldToBrowser(),O=performance.now();const j=Y/t*.8;j-e>.05&&(Qe("points-init",j),e=j)}c[Y]=Math.random(),o[Y*3+0]=(Math.random()*2-1)*No,o[Y*3+1]=(Math.random()*2-1)*No,o[Y*3+2]=(Math.random()*2-1)*No;const H=Y%d,D=Math.floor(Y/d);u[Y*2+0]=H,u[Y*2+1]=D;const W=(H-d/2)*ft,Q=(D-d/2)*ft;T.copy(S).addScaledVector(w,W).addScaledVector(y,Q),i[Y*3+0]=T.x,i[Y*3+1]=T.y,i[Y*3+2]=T.z,a[Y*2+0]=$t,a[Y*2+1]=1,r[Y*2+0]=$t,r[Y*2+1]=1,n[Y*3+0]=M.r,n[Y*3+1]=M.g,n[Y*3+2]=M.b,s[Y*3+0]=M.r,s[Y*3+1]=M.g,s[Y*3+2]=M.b}const v=new Float32Array(t*4);for(let Y=0;Y<t;Y++)v[Y*4+0]=Y,v[Y*4+1]=0,v[Y*4+2]=0,v[Y*4+3]=0;const P=t-ht.length;ht.forEach((Y,H)=>{const D=P+H,W=ci[H];o[D*3+0]=W.pos.x,o[D*3+1]=W.pos.y,o[D*3+2]=W.pos.z;let Q=1;(H===2||H===7)&&(Q=.2),n[D*3+0]=Q,n[D*3+1]=Q,n[D*3+2]=Q,s[D*3+0]=Q,s[D*3+1]=Q,s[D*3+2]=Q;const j=(Y.textureSlotRow||0)*8+(Y.textureSlotCol||0),ee=Y.useDipperColor?1:0;v[D*4+1]=1,v[D*4+2]=Y.brightnessFactor||1,v[D*4+3]=j*2+ee}),this._dipperBaseIndex=P;const A=new l.BufferGeometry,F=new l.Float32BufferAttribute(o,3),G=new l.Float32BufferAttribute(i,3);A.setAttribute("position",F),A.setAttribute("aTargetPos",G);const V=new l.Float32BufferAttribute(a,2),h=new l.Float32BufferAttribute(r,2);A.setAttribute("aStartSizeIsGrid",V),A.setAttribute("aTargetSizeIsGrid",h);const b=new l.Float32BufferAttribute(n,3),p=new l.Float32BufferAttribute(s,3);A.setAttribute("aStartColor",b),A.setAttribute("aTargetColor",p);const R=new Float32Array(t*3).fill(0),C=new Float32Array(t*3).fill(0),N=new l.Float32BufferAttribute(R,3),q=new l.Float32BufferAttribute(C,3);A.setAttribute("aStartNormal",N),A.setAttribute("aTargetNormal",q),A.setAttribute("aStableRandom",new l.Float32BufferAttribute(c,1)),A.setAttribute("aSpatialGridIndex",new l.Float32BufferAttribute(u,2)),A.setAttribute("aPointData",new l.Float32BufferAttribute(v,4)),he.markEnd("parse_binary_headers"),he.markStart("hydrate_particles");const $=A.attributes.position.count;if(he.markStart("regen_attributes"),!A.attributes.aTargetPos){const Y=new Float32Array($*3);let H=Math.ceil(Math.sqrt($)),D=ft,W=Kt;const Q=new l.Vector3(De.x,De.y,De.z),j=new l.Vector3(0,0,0),ee=new l.Vector3().subVectors(j,Q).normalize(),ae=new l.Vector3().crossVectors(ee,new l.Vector3(0,1,0)).normalize(),le=new l.Vector3().crossVectors(ae,ee).normalize(),ve=ee.clone().multiplyScalar(-W),Se=new l.Vector3;for(let we=0;we<$;we++){const X=we%H,ne=Math.floor(we/H),ie=(X-H/2)*D,ue=(ne-H/2)*D;Se.copy(ve).addScaledVector(ae,ie).addScaledVector(le,ue),Y[we*3+0]=Se.x,Y[we*3+1]=Se.y,Y[we*3+2]=Se.z}A.setAttribute("aTargetPos",new l.BufferAttribute(Y,3))}if(!A.attributes.aStartColor){const Y=new Uint8Array($*3).fill(255);if(this.shaderUniforms&&this.shaderUniforms.uGridSide){const H=Math.ceil(Math.sqrt($));ht.forEach((D,W)=>{const Q=D.row*H+D.col;if(Q<$){const j=D.brightnessFactor||1,ee=Math.min(255,Math.floor(j*255));Y[Q*3+0]=ee,Y[Q*3+1]=ee,Y[Q*3+2]=ee}})}A.setAttribute("aStartColor",new l.BufferAttribute(Y,3,!0))}if(!A.attributes.aTargetColor){const Y=new Uint8Array($*3).fill(255);if(this.shaderUniforms&&this.shaderUniforms.uGridSide){const H=Math.ceil(Math.sqrt($));ht.forEach((D,W)=>{const Q=D.row*H+D.col;if(Q<$){let j=255;(W===2||W===7)&&(j=51),Y[Q*3+0]=j,Y[Q*3+1]=j,Y[Q*3+2]=j}})}A.setAttribute("aTargetColor",new l.BufferAttribute(Y,3,!0))}if(!A.attributes.aStartNormal){const Y=new Int8Array($*3).fill(0);A.setAttribute("aStartNormal",new l.BufferAttribute(Y,3,!0))}if(!A.attributes.aTargetNormal){const Y=new Int8Array($*3).fill(0);A.setAttribute("aTargetNormal",new l.BufferAttribute(Y,3,!0))}if(!A.attributes.aStartSizeIsGrid){const Y=new Float32Array($*2);for(let H=0;H<$;H++)Y[H*2+0]=$t,Y[H*2+1]=1;A.setAttribute("aStartSizeIsGrid",new l.BufferAttribute(Y,2))}if(!A.attributes.aTargetSizeIsGrid){const Y=new Float32Array($*2);for(let H=0;H<$;H++)Y[H*2+0]=$t,Y[H*2+1]=1;A.setAttribute("aTargetSizeIsGrid",new l.BufferAttribute(Y,2))}A.attributes.aStartSkinWeight||A.setAttribute("aStartSkinWeight",new l.BufferAttribute(new Float32Array($*4),4)),A.attributes.aTargetSkinWeight||A.setAttribute("aTargetSkinWeight",new l.BufferAttribute(new Float32Array($*4),4)),A.attributes.skinIndex||A.setAttribute("skinIndex",new l.BufferAttribute(new Uint16Array($*4),4)),he.markEnd("regen_attributes");const L=new Float32Array(t*4).fill(0);he.logTable();const B=new Float32Array(t*4).fill(0),z=new Uint16Array(t*4).fill(0),U=new l.Float32BufferAttribute(L,4),E=new l.Float32BufferAttribute(B,4),k=new l.Uint16BufferAttribute(z,4);A.setAttribute("aStartSkinWeight",U),A.setAttribute("aTargetSkinWeight",E),A.setAttribute("skinIndex",k),this.points=new l.Points(A,this.material),he.logTable(),this.points.frustumCulled=!1,A.boundingSphere=new l.Sphere(new l.Vector3(0,0,0),5e3),this.points.name="PointsCloud",this.points.parentInstance=this,this.points.visible=!1,this.scene.add(this.points);const I={targetPosAttr:F,targetColorAttr:b,targetSizeIsGridAttr:V,targetNormalAttr:N,targetSkinIndexAttr:k,targetSkinWeightAttr:E};this.addMorphData("chaos",I,this.userData.chaosUniforms),Qe("points-init",.9),this._updateCachedCounts()}async _addMorphDataByModelName(e,t=!1,o={}){const i=l.UniformsUtils.clone(this.userData.chaosUniforms);for(const h in o)i[h]&&(i[h].value=o[h].value);const a=this.model.getObjectByName(e);if(!a){console.warn(`[Points] _addMorphDataByModelName: Model object '${e}' not found in GLTF.`);return}const r=[];a.traverse(h=>{h.isMesh&&(h.updateMatrixWorld(!0),r.push(h))});const n=this.pointCap,s=this._getMorphData(0),c=new Float32Array(s.targetPosAttr.array),u=new Float32Array(s.targetSizeIsGridAttr.array),d=new Float32Array(s.targetNormalAttr.array),m=s.targetColorAttr.array,f=new Float32Array(m.length),g=m instanceof Uint8Array||m instanceof Uint8ClampedArray;let w=performance.now();for(let h=0;h<m.length;h++)h%1e4===0&&performance.now()-w>4&&(await this.yieldToBrowser(),w=performance.now()),f[h]=g?m[h]/255:m[h];const y=new Float32Array(n*4),S=new Float32Array(n*4);let T=null,M=null,O=null,_=0;const v=new l.Vector3,P=new l.Vector3,A=new l.Matrix3,F=new l.Color("#ffffff");for(let h=0;h<r.length;h++){const b=r[h],p=b.matrixWorld;A.getNormalMatrix(p),b.skeleton&&!T&&(T=b.skeleton,M=b.bindMatrix,O=b.bindMatrixInverse);const R=b.geometry,C=R.attributes.position,N=R.attributes.normal,q=R.attributes.skinIndex,$=R.attributes.skinWeight,L=C.count;let B=new l.Vector3(1,1,1),z=1;const U=po.slice().sort((H,D)=>D.name.length-H.name.length);let E=null,k=b;for(;k;){const H=k.name.toLowerCase();if(E=U.find(D=>H.includes(D.name.toLowerCase())),E||k===a)break;k=k.parent}E&&(B=E.baseColor,E.brightness&&(z=E.brightness));let I=performance.now();const Y=8;for(let H=0;H<L&&!(_>=n);H++){performance.now()-I>Y&&(await this.yieldToBrowser(),I=performance.now()),T?(c[_*3+0]=C.getX(H),c[_*3+1]=C.getY(H),c[_*3+2]=C.getZ(H)):(v.set(C.getX(H),C.getY(H),C.getZ(H)),v.applyMatrix4(p),c[_*3+0]=v.x,c[_*3+1]=v.y,c[_*3+2]=v.z),N&&(T?(d[_*3+0]=N.getX(H),d[_*3+1]=N.getY(H),d[_*3+2]=N.getZ(H)):(P.set(N.getX(H),N.getY(H),N.getZ(H)),P.applyMatrix3(A).normalize(),d[_*3+0]=P.x,d[_*3+1]=P.y,d[_*3+2]=P.z)),q&&(y[_*4+0]=q.getX(H),y[_*4+1]=q.getY(H),y[_*4+2]=q.getZ(H),y[_*4+3]=q.getW(H)),$&&(S[_*4+0]=$.getX(H),S[_*4+1]=$.getY(H),S[_*4+2]=$.getZ(H),S[_*4+3]=$.getW(H));const D=E&&E.pointSizeMultiplier!==void 0?E.pointSizeMultiplier:1;u[_*2+0]=(.28+Math.pow(Math.random(),.7)*.16)*D,u[_*2+1]=0,f[_*3+0]=B.x*z,f[_*3+1]=B.y*z,f[_*3+2]=B.z*z,_++}}const G=_;if(t){const h=Math.max(0,n-G),b=Math.ceil(Math.sqrt(h))||1;i.uGridSide&&(i.uGridSide.value=b);const p=new l.Vector3(De.x,De.y,De.z),R=new l.Vector3(0,0,0),C=new l.Vector3().subVectors(R,p).normalize(),N=new l.Vector3().crossVectors(C,new l.Vector3(0,1,0)).normalize(),q=new l.Vector3().crossVectors(N,C).normalize(),$=C.clone().multiplyScalar(-Kt),L=new Uint8Array(b*b);i.uModelScreenOffset?i.uModelScreenOffset.value:this.material.uniforms.uModelScreenOffset.value;const B=i.uModelPosition?i.uModelPosition.value:this.material.uniforms.uModelPosition.value,z=i.uModelScale?i.uModelScale.value:this.material.uniforms.uModelScale.value,U=i.uModelRotation?i.uModelRotation.value:this.material.uniforms.uModelRotation.value,E=new l.Matrix4().makeRotationX(U.x),k=new l.Matrix4().makeRotationY(U.y),I=new l.Matrix4().makeRotationZ(U.z).clone().multiply(k).multiply(E),Y=new l.Vector3,H=Math.ceil(Mr*3/ft);this.camera.updateMatrixWorld(),this.camera.updateProjectionMatrix();const D=T,W=M,Q=O,j=new l.Matrix4,ee=new l.Vector4,ae=new l.Vector4;for(let X=0;X<G;X++){if(X%500===0&&await this.yieldToBrowser(),v.set(c[X*3+0],c[X*3+1],c[X*3+2]),D){ee.set(v.x,v.y,v.z,1).applyMatrix4(W),ae.set(0,0,0,0);for(let ce=0;ce<4;ce++){const be=S[X*4+ce];if(be>1e-4){const Ee=y[X*4+ce];j.fromArray(D.boneMatrices,Ee*16),v.copy(ee.xyz).applyMatrix4(j).multiplyScalar(be),ae.x+=v.x,ae.y+=v.y,ae.z+=v.z}}ee.set(ae.x,ae.y,ae.z,1).applyMatrix4(Q),v.set(ee.x,ee.y,ee.z)}v.multiplyScalar(z),v.applyMatrix4(I),v.add(B),Y.copy(v).project(this.camera),Y.unproject(this.camera);const ne=Y.sub(p).normalize(),ie=$.clone().sub(p).dot(C),ue=ne.dot(C);if(ue>1e-4){const ce=ie/ue,be=p.clone().add(ne.multiplyScalar(ce)).sub($),Ee=Math.round(be.dot(N)/ft+b/2),Oe=Math.round(be.dot(q)/ft+b/2);for(let xe=-H;xe<=H;xe++)for(let Ge=-H;Ge<=H;Ge++){const tt=Ee+xe,qe=Oe+Ge;tt>=0&&tt<b&&qe>=0&&qe<b&&xe*xe+Ge*Ge<=H*H&&(L[qe*b+tt]=1)}}}const le=this._dipperBaseIndex,ve=new Map,Se=new Set;ht.forEach((X,ne)=>{ve.set(le+ne,X),Se.add(`${X.row},${X.col}`)});let we=performance.now();for(let X=G;X<n;X++){performance.now()-we>16&&(await this.yieldToBrowser(),we=performance.now());const ne=ve.get(X);if(ne){const ie=ne.col,ue=ne.row,ce=(ie-b/2)*ft,be=(ue-b/2)*ft;v.copy($).addScaledVector(N,ce).addScaledVector(q,be),c[X*3+0]=v.x,c[X*3+1]=v.y,c[X*3+2]=v.z,u[X*2+0]=$t*1.2,u[X*2+1]=2;const Ee=ne.brightnessFactor||1;f[X*3+0]=Ee,f[X*3+1]=Ee,f[X*3+2]=Ee}else{const ie=X-G,ue=ie%b,ce=Math.floor(ie/b),be=(ue-b/2)*ft,Ee=(ce-b/2)*ft;if(v.copy($).addScaledVector(N,be).addScaledVector(q,Ee),c[X*3+0]=v.x,c[X*3+1]=v.y,c[X*3+2]=v.z,Se.has(`${ce},${ue}`)||L[ce*b+ue]===1)u[X*2+0]=0,u[X*2+1]=0;else{let Oe=!1;const xe=2;for(let Ge=-xe;Ge<=xe;Ge++){for(let tt=-xe;tt<=xe;tt++){const qe=ue+Ge,Pt=ce+tt;if(qe>=0&&qe<b&&Pt>=0&&Pt<b&&L[Pt*b+qe]===1){Oe=!0;break}}if(Oe)break}u[X*2+0]=$t,u[X*2+1]=Oe?25:2}f[X*3+0]=F.r,f[X*3+1]=F.g,f[X*3+2]=F.b}}}else{const h=No;let b=performance.now();const p=e===jt.CHAR;for(let R=G;R<n;R++){if(performance.now()-b>16&&(await this.yieldToBrowser(),b=performance.now()),p){const N=Math.random()*Math.PI*2,q=Math.acos(Math.random()*2-1),$=Math.pow(Math.random(),.5)*1;c[R*3+0]=$*Math.sin(q)*Math.cos(N),c[R*3+1]=$*Math.sin(q)*Math.sin(N),c[R*3+2]=$*Math.cos(q)}else c[R*3+0]=(Math.random()*2-1)*h,c[R*3+1]=(Math.random()*2-1)*h,c[R*3+2]=(Math.random()*2-1)*h;u[R*2+0]=0,u[R*2+1]=0,f[R*3+0]=F.r,f[R*3+1]=F.g,f[R*3+2]=F.b}if(p){const R=Math.ceil(Math.sqrt(n))*ft*.5;o.uDistStaggerFactor={value:1},o.uDistStaggerMax={value:R},o.uMorphStagger={value:.8}}if(e===jt.CHAR&&G>0){const R=this._dipperBaseIndex;[.45,.9,.92,.6,.65,.98,.25,.3].forEach((C,N)=>{const q=Math.floor(G*C),$=R+N;for(let I=0;I<3;I++)c[$*3+I]=c[q*3+I];for(let I=0;I<4;I++)y[$*4+I]=y[q*4+I],S[$*4+I]=S[q*4+I];for(let I=0;I<3;I++)d[$*3+I]=d[q*3+I];u[$*2+0]=1,u[$*2+1]=0;const L=de.ELECTRIC_CYAN,B=L.r*.5+.5,z=L.g*.5+.5,U=L.b*.5+.5;let E=4;N===0&&(E=9),(N===1||N===2)&&(E=6);const k=N===0||N===1||N===2?.5:0;f[$*3+0]=(B+k)*E,f[$*3+1]=(z+k)*E,f[$*3+2]=(U+k)*E})}}if(e==="Chaos"||e==="Initial"||e===jt.ROOT){const h=Math.ceil(Math.sqrt(n));ht.forEach(b=>{const p=b.row*h+b.col;if(p<n){const R=b.brightnessFactor||1;f[p*3+0]=R,f[p*3+1]=R,f[p*3+2]=R}})}const V={targetPosAttr:new l.Float32BufferAttribute(c,3),targetSizeIsGridAttr:new l.Float32BufferAttribute(u,2),targetNormalAttr:new l.Float32BufferAttribute(d,3),targetColorAttr:new l.Float32BufferAttribute(f,3),targetSkinIndexAttr:new l.Float32BufferAttribute(y,4),targetSkinWeightAttr:new l.Float32BufferAttribute(S,4),targetSkeleton:T,targetBindMatrix:M,targetBindMatrixInverse:O};this.addMorphData(e,V,i)}createControlUI(){this.options.enableControls&&md({material:this.material,bloomPass:this.bloomPass,TWEEN:x,MORPH_DURATION:Ho,DEFAULT_VIBRATE_AMPLITUDE:.25,DEFAULT_SIZE_THRESHOLD:.1,DEFAULT_VIBRATE_BOOST_SIZE_THRESHOLD:1,POINT_SIZE:.03,UI_WIDTH:_r,UI_TOP:Ar,UI_RIGHT:Pr,speed:this.material.uniforms.uBaseRotateSpeed,hoverEffect:this.material.uniforms.uHoverRadius,mouseDamping:si,pointReturnSpeed:li,onStart:()=>{const e=this.material.uniforms.uProgress.value<.5?Er:.1;new x.Tween(this.material.uniforms.uSizeThreshold).to({value:e},Ho).easing(Ln).start()},onComplete:()=>{}})}onMouseMove(e){let t;this.renderer.domElement?t=this.renderer.domElement.getBoundingClientRect():t={left:0,top:0,width:window.innerWidth,height:window.innerHeight};const o=e.clientX,i=e.clientY;this.mouse.x=(o-t.left)/t.width*2-1,this.mouse.y=-((i-t.top)/t.height)*2+1,this._mouseInCanvas=!0,this.rawMouse.set(o,i),this.targetMouse.copy(this.mouse),this.lastMouseMoveTime=performance.now(),this.isFirstMouseMove&&(this.smoothMouse.copy(this.targetMouse),this.smoothRepulsionMouse.copy(this.targetMouse),this.isFirstMouseMove=!1)}onMouseLeave(e){e&&e.relatedTarget===this.tooltip?.tooltip||(this.targetMouse.set(1e4,1e4),this._mouseInCanvas=!1,this.isFirstMouseMove=!0)}onMouseClick(e){if(e&&e.target!==this.renderer.domElement)return;if(e&&this.renderer.domElement){const i=this.renderer.domElement.getBoundingClientRect();this.mouse.x=(e.clientX-i.left)/i.width*2-1,this.mouse.y=-((e.clientY-i.top)/i.height)*2+1}const t=this.getCurrentStep(),o=this.targetIndex;if(!(t>2&&o>2)){if(this.tooltip&&this.tooltip.lastHoveredIndex!==-1&&t!==2){const i=this.tooltip.lastHoveredIndex;if(i===999999)return;const a=this.points.geometry,r=this.material.uniforms,n=new l.Vector3().fromBufferAttribute(a.attributes.position,i),s=new l.Vector3().fromBufferAttribute(a.attributes.aTargetPos,i),c=r.uProgress.value,u=r.uModelScale.value,d=r.uModelPosition.value,m=r.uModelRotation.value,f=new l.Euler(m.x,m.y,m.z,"XYZ"),g=r.uGridForward.value,w=r.uGridZ.value,y=r.uBaseGridZ.value,S=g.clone().multiplyScalar(y-w),T=a.attributes.aStartSizeIsGrid.array[i*2+1],M=a.attributes.aTargetSizeIsGrid.array[i*2+1],O=r.uMorphStagger.value,_=.5,v=c*(_+O),P=a.attributes.aStableRandom.array[i]*O,A=P+_,F=l.MathUtils.smoothstep(v,P,A);T>.5?n.add(S):n.multiplyScalar(u).applyEuler(f).add(d),M>.5?s.add(S):s.multiplyScalar(u).applyEuler(f).add(d);const G=n.lerp(s,F);G.applyMatrix4(this.points.matrixWorld);const V=r.uModelPointCount.value,h=r.uGridSide.value;if(i>=V){const p=i-V;Math.floor(p/h),p%h}const b=this.currentPulseIndex;r.uPulseCenters.value[b].copy(G),r.uPulseStartTimes.value[b]=r.iTime.value,r.uPulseDisplacementFactors.value[b]=0,this.totalPulsesTriggered===void 0&&(this.totalPulsesTriggered=0),this.totalPulsesTriggered++,r.uActivePulseCount.value=Math.min(vt,this.totalPulsesTriggered),this.currentPulseIndex=(this.currentPulseIndex+1)%vt,r.uPulseactive.value=1}else if(this.raycaster){if(t===2&&!this.isMorphing){this.playNextDance();return}const i=this.material.uniforms,a=i.uModelScreenOffset?i.uModelScreenOffset.value:new l.Vector2(0,0),r=this.mouse.clone().sub(a);this.raycaster.setFromCamera(r,this.camera);let n=null;const s=new l.Plane,c=i.uGridForward.value,u=c.clone().negate(),d=i.uBaseGridZ.value,m=d-i.uGridZ.value,f=c.clone().multiplyScalar(-d).clone().add(c.clone().multiplyScalar(m)),g=this.getCurrentStep(),w=this.targetIndex;if(g<=2||w<=2)s.setFromNormalAndCoplanarPoint(u,f);else{const S=new l.Vector3(0,0,1).applyQuaternion(this.camera.quaternion);s.setFromNormalAndCoplanarPoint(S,new l.Vector3(0,0,0))}const y=new l.Vector3;if(this.raycaster.ray.intersectPlane(s,y)&&(n=y),n){const S=this.currentPulseIndex;i.uPulseCenters.value[S].copy(n),i.uPulseStartTimes.value[S]=i.iTime.value,i.uPulseDisplacementFactors.value[S]=0,this.totalPulsesTriggered===void 0&&(this.totalPulsesTriggered=0),this.totalPulsesTriggered++,i.uActivePulseCount.value=Math.min(vt,this.totalPulsesTriggered),this.currentPulseIndex=(this.currentPulseIndex+1)%vt,i.uPulseactive.value=1}}}}onWindowResize(){let e,t;if(this.renderer.domElement){const o=this.renderer.domElement.getBoundingClientRect();e=o.width,t=o.height}else e=this.renderer.domElement.clientWidth,t=this.renderer.domElement.clientHeight;if(this.camera&&(this.camera.aspect=e/t,this.camera.updateProjectionMatrix()),this.renderer&&this.renderer.setSize(e,t),this.composer&&this.composer.setSize(e,t),this.bloomPass&&this.bloomPass.resolution.set(e,t),this._updateTitleMaskBase(),this.material){if(this.material.uniforms.uResolution.value.set(e,t),this.material.uniforms.uPixelRatio.value=this.renderer.getPixelRatio(),this.camera&&this.material.uniforms.uFOV){this.material.uniforms.uFOV.value=this.camera.fov;const o=t/(2*Math.tan(l.MathUtils.degToRad(this.camera.fov)*.5));this.material.uniforms.uProjectionMultiplier&&(this.material.uniforms.uProjectionMultiplier.value=o)}if(this.userData.chaosUniforms&&this.userData.chaosUniforms.uResolution&&(this.userData.chaosUniforms.uResolution.value.set(e,t),this.userData.chaosUniforms.uPixelRatio.value=this.renderer.getPixelRatio(),this.camera)){this.userData.chaosUniforms.uFOV.value=this.camera.fov;const o=t/(2*Math.tan(l.MathUtils.degToRad(this.camera.fov)*.5));this.userData.chaosUniforms.uProjectionMultiplier&&(this.userData.chaosUniforms.uProjectionMultiplier.value=o)}}}_updateTitleMaskBase(){if(!this.material||!this.material.uniforms.uTitleMaskRectBase)return;const e=document.getElementById("board");if(!e)return;const t=e.getBoundingClientRect(),o=window.innerHeight/100;if(t.width===0||t.height===0)return;const i=4.5,a=-10,r=3,n=-.75,s=t.width/o+i+a,c=t.height/o+r+n,u=t.left/o-i,d=t.top/o-r,m=u+s/2,f=100-(d+c/2);this.material.uniforms.uTitleMaskRectBase.value.set(m*o,f*o,s/2*o,c/2*o)}update(e=!0,t=!0){if(this.isReady){if(this.controls&&t&&this.controls.update(),this.mixer){const o=this.clock.getDelta(),i=this.getCurrentStep(),a=this.scene&&this.scene.scenarioState&&this.scene.scenarioState.name==="points";this.scene&&(this.scene.isTransitioning||this.scene.isPersonaActive),this._mixerAccumulatedDelta=(this._mixerAccumulatedDelta||0)+o;const r=this.isMorphing&&this.targetIndex>=2;(i>=2||r)&&a&&(this.mixer.update(this._mixerAccumulatedDelta),this._mixerAccumulatedDelta=0,this.model&&(this.model.scale.setScalar(1),this.model.position.set(0,0,0),this.model.rotation.set(0,0,0),this.model.updateMatrixWorld(!0)))}if(this.getCurrentStep()===2&&this.model){if(this._headBone||this.model.traverse(o=>{o.isBone&&o.name==="mixamorigHead"&&(this._headBone=o)}),this._headBone){const o=new l.Vector3;this._headBone.getWorldPosition(o);const i=this.material.uniforms,a=i.uModelScale.value,r=i.uModelRotation.value,n=i.uModelPosition.value;o.multiplyScalar(a),o.applyEuler(new l.Euler(r.x,r.y,r.z,"XYZ")),o.add(n);const s=o.project(this.camera);i.uModelScreenOffset&&(s.x+=i.uModelScreenOffset.value.x,s.y+=i.uModelScreenOffset.value.y);const c=(s.x+1)/2,u=(1-s.y)/2;if(i.uBonePos.value.set(c,u),i.uBoneIntensity.value=1,i.uBoneRadius.value=.18,this._boardItems||(this._boardItems=document.querySelectorAll(".board-item")),this._boardItems.length>0){const d=`perspective(1200px) rotateX(${(u-.5)*15}deg) rotateY(${(.5-c)*20}deg)`;this._boardItems.forEach(m=>{m.style.transform=d})}this._boardItems.forEach(d=>{const m=d.getBoundingClientRect(),f=(m.left+m.width/2)/window.innerWidth,g=(m.top+m.height/2)/window.innerHeight,w=Math.abs(c-f);Math.abs(u-g);const y=u<.45;if(w<m.width/window.innerWidth*.7&&y){d.classList.add("active-wake");const S=(c-m.left/window.innerWidth)/(m.width/window.innerWidth)*120-20;if(d.style.setProperty("--shine-pos",`${S}%`),d.style.setProperty("--shine-opacity","1"),d.id==="board-philo"){const T=i.uResolution.value;i.uStickRect.value.set(m.left,T.y-m.bottom,m.right,T.y-m.top),i.uStickStrength.value=1}}else d.classList.remove("active-wake"),d.style.setProperty("--shine-opacity","0"),d.id==="board-philo"&&(i.uStickStrength.value=0)})}}else this.material&&this.material.uniforms.uBoneIntensity&&(this.material.uniforms.uBoneIntensity.value*=.9,this._boardItems&&this._boardItems.forEach(o=>{o.classList.remove("active-wake"),o.style.setProperty("--shine-opacity","0"),o.style.transform="perspective(1200px) rotateX(0deg) rotateY(0deg)"}),this.material&&this.material.uniforms.uStickStrength&&(this.material.uniforms.uStickStrength.value=0));if(this.material){const o=this.clock.getElapsedTime();this.material.uniforms.iTime.value=o}if(this.dipperLines&&this.material){const o=this.material.uniforms.uProgress.value,i=this.material.uniforms.iTime.value,a=this.scene?.HUD?.isOpen===!0,r=this.points.geometry,n=r.morphCurrentIndex||0,s=r.morphTargetIndex,c=this.isMorphing;let u=0;c?n===0?u=1-o:s===0&&(u=o):u=n===0?1:0,u=u*u*(3-2*u);const d=Math.min(1,Math.max(0,(i-2.5)*2));let m=0;if(this.tooltip&&this.tooltip.lastHoveredIndex!==-1&&this._dipperPointIndices){const S=this.tooltip.lastHoveredIndex,T=this._dipperPointIndices.has(S),M=S-this._dipperBaseIndex;T&&M>=0&&M<=6&&(m=1)}this._dipperHoverSmoothed=this._dipperHoverSmoothed||0,this._dipperHoverSmoothed+=(m-this._dipperHoverSmoothed)*.15;const f=this.dipperLines.userData,g=f.opacity*(a?1:0),w=this._dipperHoverSmoothed,y=Math.max(g,w)*u*d;if(this.dipperLines.material.uniforms.uOpacity.value=y,this.dipperLines.material.uniforms.uDrawProgress.value=Math.max(f.drawProgress,this._dipperHoverSmoothed),this.dipperLines.material.uniforms.uTime.value=i,this.material&&this.raycaster&&this.camera&&this.intersectionPlane){const S=this.scene&&(this.scene.isPersonaActive||this.scene.isTransitioning);this.smoothMouse.x+=(this.mouse.x-this.smoothMouse.x)*si.value,this.smoothMouse.y+=(this.mouse.y-this.smoothMouse.y)*si.value,this.smoothRepulsionMouse.x+=(this.mouse.x-this.smoothRepulsionMouse.x)*li.value,this.smoothRepulsionMouse.y+=(this.mouse.y-this.smoothRepulsionMouse.y)*li.value,this.raycaster.setFromCamera(this.smoothMouse,this.camera),this._perfSkipCounter=(this._perfSkipCounter||0)+1;const T=this._perfSkipCounter%3===0,M=this.points.geometry.morphCurrentIndex||0;S&&(this.tooltip&&this.tooltip.hide(),this.material&&this.material.uniforms.uHoveredIndex&&(this.material.uniforms.uHoveredIndex.value=-1));const O=M===0||M===1||M===2,_=this.scene&&this.scene.scenarioState&&this.scene.scenarioState.name==="points",v=O&&_&&!S;if(this.tooltip&&(!this.isMorphing&&v&&t&&this._mouseInCanvas&&!this._raycastBlockedByOverlay?(this._tooltipFrameCount=(this._tooltipFrameCount||0)+1,this._tooltipFrameCount%3===0&&(this.tooltip.update(this.raycaster,this.points,this.material,this.smoothMouse,this.rawMouse,this.camera,this.renderer),this.tooltip.lastHoveredIndex!==-1?(this.points.geometry.lastClosestIndex=this.tooltip.lastHoveredIndex,this.material.uniforms.uHoveredIndex.value=this.tooltip.lastHoveredIndex):this.material.uniforms.uHoveredIndex.value=-1)):(this.tooltip.hide(),this._tooltipFrameCount=0,this.material&&this.material.uniforms.uHoveredIndex&&(this.material.uniforms.uHoveredIndex.value=-1))),(M===1||M===2)&&this.material.uniforms.uGlobalHoverStrength&&T){const A=this.tooltip&&this.tooltip.lastHoveredIndex!==-1&&this.tooltip.lastHoveredIndex!==999999;let F=0;if(A){if(this.hoverStartTime||(this.hoverStartTime=performance.now()),performance.now()-this.hoverStartTime>100){F=1;const G=this.tooltip.lastHoveredIndex;if(this._dipperPointIndices&&this._dipperPointIndices.has(G)){const V=G-this._dipperBaseIndex,h=this.bigDipper[V];if(h){const b=(h.textureSlotRow||0)*8+(h.textureSlotCol||0);this.material.uniforms.uHoveredTextureIndex.value=b}}else{const V=this.points.geometry.attributes.aStableRandom.array[G],h=this.material.uniforms.iTime.value,b=1-this.material.uniforms.uIsChaos.value,p=6+(this.points.geometry.attributes.aStartSizeIsGrid.array[G*2+1]>.5?1:0)*b*4,R=h+V*10,C=R%p>p-.75?1:0,N=Math.floor(h*13.33+V)*C,q=Math.floor(R/p)*13,$=Math.floor(V*32+N+q)%32;this.material.uniforms.uHoveredTextureIndex.value=$}}}else this.hoverStartTime=null;this.material.uniforms.uGlobalHoverStrength.value+=(F-this.material.uniforms.uGlobalHoverStrength.value)*.1}const P=this.raycaster.intersectObject(this.intersectionPlane);if(P.length>0&&T&&this.material.uniforms.uMousePos.value.copy(P[0].point),this.material.uniforms.uMouseNDC&&this.material.uniforms.uMouseNDC.value.copy(this.smoothRepulsionMouse),this.material.uniforms.uMouseScreen){const A=this.material.uniforms.uResolution.value;this.material.uniforms.uMouseScreen.value.set((this.smoothMouse.x*.5+.5)*A.x,(this.smoothMouse.y*.5+.5)*A.y)}if(!this.isMorphing&&this.material.uniforms.uModelRotation&&this.material.uniforms.uEnableMouseRotation?.value){const A=this.smoothMouse.x*-.24;this.material.uniforms.uModelRotation.value.y+=(A-this.material.uniforms.uModelRotation.value.y)*.08}if(T&&this.model&&M>=1&&t){const A=this.raycaster.intersectObject(this.model,!0).length>0,F=this._getMorphData(M),G=this.forceDisableAttraction?0:F?.targetUniforms?.uAttractionForce?.value||0,V=this.material.uniforms.uAttractionForce.value;this.material.uniforms.uAttractionForce.value+=((A?0:G)-V)*.1,this._mouseWasOverModel=A}}}t&&this.composer&&this.composer.render()}}bake(){if(!this.points||!this.points.geometry){console.error("No geometry to bake!");return}const e=this.points.geometry,t={},o=[];let i=0;const a=["aTargetPos","aStartNormal","aTargetNormal","aStartColor","aTargetColor","aStartSizeIsGrid","aTargetSizeIsGrid"];for(const g in e.attributes){if(a.includes(g))continue;const w=e.attributes[g],y=w.array;t[g]={itemSize:w.itemSize,count:w.count,type:y.constructor.name,byteLength:y.byteLength,offset:i},o.push(y),i+=y.byteLength}const r=JSON.stringify(t),n=new TextEncoder().encode(r),s=n.byteLength,c=4+s+i,u=new Uint8Array(c);new DataView(u.buffer).setUint32(0,s,!0),u.set(n,4);let d=4+s;for(const g of o){const w=new Uint8Array(g.buffer,g.byteOffset,g.byteLength);u.set(w,d),d+=g.byteLength}const m=new Blob([u],{type:"application/octet-stream"}),f=document.createElement("a");f.href=URL.createObjectURL(m),f.download="points_data.bin",f.click()}optimizeAndBake(){if(!this.points||!this.points.geometry)return;const e=this.points.geometry,t={},o=[];let i=0;const a=(w,y,S=!1)=>{let T;if(y==="Uint8Array")T=new Uint8Array(w.length);else if(y==="Int8Array")T=new Int8Array(w.length);else if(y==="Uint16Array")T=new Uint16Array(w.length);else return w;for(let M=0;M<w.length;M++){let O=w[M];y==="Uint8Array"?S?O=Math.max(0,Math.min(1,O))*255:O=O:y==="Int8Array"&&S&&(O=Math.max(-1,Math.min(1,O))*127),T[M]=O}return T},r=["aTargetPos","aStartNormal","aTargetNormal","aStartColor","aTargetColor","aStartSizeIsGrid","aTargetSizeIsGrid"];for(const w in e.attributes){if(r.includes(w))continue;const y=e.attributes[w];let S=y.array,T=S.constructor.name,M=!1;if(w.includes("Color")||w==="aStableRandom"||w.includes("SkinW"))S=a(y.array,"Uint8Array",!0),T="Uint8Array",M=!0;else if(w.includes("Normal"))S=a(y.array,"Int8Array",!0),T="Int8Array",M=!0;else if(w==="aSpatialGridIndex")S=a(y.array,"Uint8Array",!1),T="Uint8Array",M=!1;else if(w==="aPointData")S=a(y.array,"Uint16Array",!1),T="Uint16Array",M=!1;else if(w==="position"){const O=y.array,_=new Uint16Array(O.length);for(let v=0;v<O.length;v++)_[v]=l.DataUtils.toHalfFloat(O[v]);S=_,T="Uint16Array",M=!1}t[w]={itemSize:y.itemSize,count:y.count,type:T,byteLength:S.byteLength,offset:i,normalized:M},o.push(S),i+=S.byteLength}const n=JSON.stringify(t),s=new TextEncoder().encode(n),c=s.byteLength,u=4+c+i,d=new Uint8Array(u);new DataView(d.buffer).setUint32(0,c,!0),d.set(s,4);let m=4+c;for(const w of o){const y=new Uint8Array(w.buffer,w.byteOffset,w.byteLength);d.set(y,m),m+=w.byteLength}const f=new Blob([d],{type:"application/octet-stream"}),g=document.createElement("a");g.href=URL.createObjectURL(f),g.download="points_data_optimized.bin",g.click()}_initDipperLines(){const e=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]],t=.2,o=.4,i=[],a=[],r=[],n=[];let s=0;e.forEach(([d,m],f)=>{const g=ci[d].pos,w=ci[m].pos,y=new l.Vector3().subVectors(w,g),S=y.length();y.normalize();const T=S*t,M=new l.Vector3().copy(g).add(y.clone().multiplyScalar(T)),O=new l.Vector3().copy(w).sub(y.clone().multiplyScalar(T)),_=new l.Vector3(De.x,De.y,De.z),v=new l.Vector3().subVectors(M,_).normalize(),P=new l.Vector3().crossVectors(y,v).normalize(),A=o*.5,F=M.clone().addScaledVector(P,-A),G=M.clone().addScaledVector(P,A),V=O.clone().addScaledVector(P,-A),h=O.clone().addScaledVector(P,A);i.push(F.x,F.y,F.z),i.push(G.x,G.y,G.z),i.push(V.x,V.y,V.z),i.push(h.x,h.y,h.z),r.push(0,0,1,0,0,1,1,1);const b=f/e.length;n.push(b,b,b,b),a.push(s+0,s+1,s+2),a.push(s+2,s+1,s+3),s+=4});const c=new l.BufferGeometry;c.setAttribute("position",new l.Float32BufferAttribute(i,3)),c.setAttribute("uv",new l.Float32BufferAttribute(r,2)),c.setAttribute("aStagger",new l.Float32BufferAttribute(n,1)),c.setIndex(a);const u=new l.ShaderMaterial({vertexShader:yl,fragmentShader:wl,uniforms:{uTime:{value:0},uOpacity:{value:0},uDrawProgress:{value:0}},transparent:!0,depthWrite:!1,blending:l.AdditiveBlending,side:l.DoubleSide});this.dipperLines=new l.Mesh(c,u),this.dipperLines.frustumCulled=!1,this.dipperLines.userData={opacity:0,drawProgress:0},this.scene.add(this.dipperLines)}getChaosIndex(){return 0}getCurrentStep(){return!this.points||!this.points.geometry?0:this.points.geometry.morphCurrentIndex||0}getRootIndex(){return this._currentPersona===Te.DEV?2:1}getCharIndex(){return 3}syncPersona(e,t=!1){if(this._currentPersona=e,this.material&&this.material.uniforms.uRippleColor){const a=po.find(n=>n.name==="heartDev"),r=po.find(n=>n.name==="heart");if(a&&r){const n=e===Te.DEV?a.baseColor:r.baseColor;this.material.uniforms.uRippleColor.value.copy(n)}}if(t)return;const o=this.getCurrentStep(),i=this.getRootIndex();(i===1||i===2)&&(window.scene&&window.scene.scenarioState&&window.scene.scenarioState.name==="points"&&typeof this.triggerStep=="function"?(console.log(`[Points] Avatar Switch -> Triggering Scroll Step 1 for ${e.toUpperCase()}`),this.triggerStep(1)):(o!==i||this.isMorphing)&&this.morphToTarget(i))}triggerStarPulse(e){if(!this.points||!this.material||!this.bigDipper[e])return;const t=this._dipperBaseIndex+e,o=this.material.uniforms,i=this.points.geometry,a=o.uProgress.value,r=o.uModelScale.value,n=o.uModelPosition.value,s=o.uModelRotation.value,c=new l.Euler(s.x,s.y,s.z,"XYZ"),u=o.uGridForward.value,d=o.uGridZ.value,m=o.uBaseGridZ.value,f=u.clone().multiplyScalar(m-d),g=new l.Vector3().fromBufferAttribute(i.attributes.position,t),w=new l.Vector3().fromBufferAttribute(i.attributes.aTargetPos,t),y=i.attributes.aStartSizeIsGrid.array[t*2+1],S=i.attributes.aTargetSizeIsGrid.array[t*2+1],T=o.uMorphStagger.value,M=.5,O=a*(M+T),_=i.attributes.aStableRandom.array[t]*T,v=_+M,P=l.MathUtils.smoothstep(O,_,v);y>.5?g.add(f):g.multiplyScalar(r).applyEuler(c).add(n),S>.5?w.add(f):w.multiplyScalar(r).applyEuler(c).add(n);const A=g.clone().lerp(w,P);A.applyMatrix4(this.points.matrixWorld);const F=this.currentPulseIndex;o.uPulseCenters.value[F].copy(A),o.uPulseStartTimes.value[F]=o.iTime.value,o.uPulseDisplacementFactors.value[F]=.5,this.totalPulsesTriggered===void 0&&(this.totalPulsesTriggered=0),this.totalPulsesTriggered++,o.uActivePulseCount.value=Math.min(vt,this.totalPulsesTriggered),this.currentPulseIndex=(this.currentPulseIndex+1)%vt,o.uPulseactive.value=1,o.uHoveredIndex.value=t,this._starHighlightTimeout&&clearTimeout(this._starHighlightTimeout),this._starHighlightTimeout=setTimeout(()=>{o.uHoveredIndex.value===t&&(o.uHoveredIndex.value=-1)},1500)}setConstellationVisibility(e=!0){if(!this.dipperLines)return;this.dipperLines.tween&&this.dipperLines.tween.stop();const t=e?1:0,o=e?1:0,i=e?1500:800,a=e?x.Easing.Cubic.InOut:x.Easing.Cubic.Out;this.dipperLines.tween=new x.Tween(this.dipperLines.userData).to({opacity:t,drawProgress:o},i).easing(a).start()}}}));function Td(e){if(!e.globalUniformsHub||!e.globalUniformsHub.uniforms){console.warn("GridSystem: Global Uniforms Hub not found");return}const t=e.globalUniformsHub.uniforms,o={currentTween:null};window.addEventListener(ro.GARDEN.HOVER_START,()=>{t.uWorldGridActive.value=1,o.currentTween&&o.currentTween.stop(),o.currentTween=new x.Tween(t.uWorldGridProgress).to({value:1},1110).easing(x.Easing.Cubic.Out).start()}),window.addEventListener(ro.GARDEN.HOVER_END,()=>{o.currentTween&&o.currentTween.stop(),o.currentTween=new x.Tween(t.uWorldGridProgress).to({value:0},1110).easing(x.Easing.Cubic.In).onComplete(()=>{t.uWorldGridProgress.value<.01&&(t.uWorldGridActive.value=0)}).start()})}var bd=J((()=>{Hn()})),bl,Ed=J((()=>{Fn(),ut(),pt(),ii(),bl=class{constructor(e,t="mixamorigRightHand"){this.scene=e,this.boneName=t,this.element=null,this.targetBone=null,this.isActive=!1,this.originalParent=null,this.originalStyle={},this.originalNextSibling=null,this.scaleReferenceDistance=6,this.manualScaleFactor=1,this.localOffset=new l.Vector3(0,0,0),this.rotationOffset=new l.Euler(0,0,0),this.isTransitioning=!1,this.transitionProgress=0,this.startScreenPos={x:0,y:0},this.droneBeam=null,this.isJittering=!1,this.returnTargetPos={x:0,y:0},this.hasHitThisSwing=!1;const o=document.getElementById("bone-tracker-test");o&&o.remove(),this.initTargetElement("#persona-switch-btn")}initTargetElement(e){const t=typeof e=="string"?document.querySelector(e):e;if(!t){console.warn("[BoneTracker] Target element not found.");return}this.element&&this.isActive&&this.forceReset(),this.element=t,this.originalParent=t.parentElement,this.originalNextSibling=t.nextSibling;const o=t.getBoundingClientRect();this.startScreenPos={x:o.left,y:o.top},this.originalStyle={},["position","top","left","transform","zIndex","pointerEvents","margin","display","transition","transformOrigin","perspective"].forEach(i=>{this.originalStyle[i]=t.style[i]||""})}toggleTracking(e=null){if(!this.element)return!1;if(this.isActive=!this.isActive,this.isActive){this.scene.isHeroAnimating=!0;const t=this.element.getBoundingClientRect();this.startScreenPos={x:t.left,y:t.top},this.transitionProgress=0,this.isTransitioning=!0,this.isBeaming=!1,this.scene.gazeFollower&&(this.scene.gazeFollower.isLocked=!0);const o=this.element.cloneNode(!0);o.id="bone-tracker-ghost",this.element.parentElement.insertBefore(o,this.element),o.style.transition="opacity 0.6s ease-out",o.style.pointerEvents="none",setTimeout(()=>{o.style.opacity="0",setTimeout(()=>o.remove(),600)},500),this.element.classList.add("persona-breakout");let i=!1;setTimeout(()=>{this.element.classList.remove("persona-breakout"),this.flightTween&&this.flightTween.stop(),this.flightTween=new x.Tween(this).to({transitionProgress:1},1500).easing(x.Easing.Back.In).onUpdate(()=>{this.transitionProgress>.65&&!this.isBeaming&&(this.isBeaming=!0,this.setupBeam()),this.transitionProgress>=.9&&!i&&(i=!0,this.cleanupBeam(),e&&e())}).onComplete(()=>{this.isTransitioning=!1,this.flightTween=null,setTimeout(()=>{this.scene.gazeFollower&&(this.scene.gazeFollower.isLocked=!1)},400)}).start()},400);const a=document.getElementById("experience-container")||document.body;this.element.parentElement!==a&&a.appendChild(this.element),Object.assign(this.element.style,{position:"absolute",top:"0",left:"0",zIndex:"10005",pointerEvents:"none",margin:"0",display:"block",transition:"none",perspective:"1000px",transformOrigin:"10% 50%"}),this.element.classList.add("persona-active-hover")}else{if(this.originalParent){const t=this.originalParent.getBoundingClientRect();this.returnTargetPos={x:t.left,y:t.top}}this.isTransitioning=!0,this.setupBeam(),this.scene.gazeFollower&&(this.scene.gazeFollower.isLocked=!0),this.flightTween&&this.flightTween.stop(),this.flightTween=new x.Tween(this).to({transitionProgress:0},800).easing(x.Easing.Cubic.InOut).onComplete(()=>{this.isTransitioning=!1,this.flightTween=null,this.cleanupBeam(),this.scene.gazeFollower&&(this.scene.gazeFollower.isLocked=!1),this.scene.isHeroAnimating=!1,this.originalParent&&(this.originalNextSibling?this.originalParent.insertBefore(this.element,this.originalNextSibling):this.originalParent.appendChild(this.element)),this.element.classList.remove("persona-active-hover"),Object.assign(this.element.style,this.originalStyle),this.element.style.display="flex"}).start()}return this.isActive}forceReset(){this.flightTween&&this.flightTween.stop(),this.flightTween=null,this.isTransitioning=!1,this.isActive=!1,this.transitionProgress=0,this.cleanupBeam(),this.scene.gazeFollower&&(this.scene.gazeFollower.isLocked=!1),this.scene.isHeroAnimating=!1,this.originalParent&&(this.originalNextSibling?this.originalParent.insertBefore(this.element,this.originalNextSibling):this.originalParent.appendChild(this.element)),this.element.classList.remove("persona-active-hover"),this.element.classList.remove("persona-breakout"),Object.assign(this.element.style,this.originalStyle),this.element.style.display="flex"}setupBeam(){this.cleanupBeam(),this.droneBeam=Wo(this.scene,"transition-tether-beam",65535),this.scene.add(this.droneBeam)}cleanupBeam(){this.droneBeam&&(this.scene.remove(this.droneBeam),this.droneBeam.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())}),this.droneBeam=null)}findBone(){return this.targetBone?this.targetBone:((this.scene.getObjectByName("a-char")||this.scene.getObjectByName("roomGLBModel")||this.scene).traverse(e=>{e.isBone&&e.name===this.boneName&&(this.targetBone=e)}),this.targetBone)}update(){if(!this.isActive&&!this.isTransitioning&&!this.isDroneGazing)return;if(this.isActive&&!this.scene.isHeroAnimating&&!this.isTransitioning){this.forceReset();return}if(!this.element)return;const e=this.findBone();if(!e)return;const t=new l.Vector3().copy(this.localOffset);e.localToWorld(t);const o=new l.Quaternion;e.getWorldQuaternion(o);const i=t.distanceTo(this.scene.camera.position),a=l.MathUtils.clamp(this.scaleReferenceDistance/i,.4,1.5)*this.manualScaleFactor,r=new l.Matrix4().makeRotationFromQuaternion(o),n=this.scene.camera.matrixWorldInverse.clone().multiply(r),s=new l.Euler().setFromRotationMatrix(n,"YXZ"),c=-s.x*30,u=s.y*30,d=new l.Vector3(0,.1,0),m=t.clone().add(d.applyQuaternion(o)),f=t.clone().project(this.scene.camera),g=m.clone().project(this.scene.camera),w=this.scene.renderer.domElement,y=w.clientWidth/2,S=w.clientHeight/2,T=f.x*y+y,M=-(f.y*S)+S;let O=T,_=M;if(this.isTransitioning){const V=this.transitionProgress,h=V>0?V*(1-V)*-1e3:0;this.isActive?(O=l.MathUtils.lerp(this.startScreenPos.x,T,V),_=l.MathUtils.lerp(this.startScreenPos.y,M,V)+h):(O=l.MathUtils.lerp(this.returnTargetPos.x,T,V),_=l.MathUtils.lerp(this.returnTargetPos.y,M,V))}let v=0;const P=g.x*y+y,A=-(g.y*S)+S,F=Math.atan2(A-_,P-O)+this.rotationOffset.z+v;this.isTransitioning&&this.droneBeam&&this.updateDroneBeam(O,_),f.z<1?(this.element.style.display="flex",this.element.style.transform=`
                translate(${O}px, ${_}px) 
                translate(-10%, -50%) 
                rotate(${F}rad) 
                rotateX(${c+l.MathUtils.radToDeg(this.rotationOffset.x)}deg) 
                rotateY(${u+l.MathUtils.radToDeg(this.rotationOffset.y)}deg) 
                scale(${a})
            `.replace(/\s+/g," ")):this.element.style.display="none";const G=this.scene.activeAction;if(this.isActive&&G&&G.getClip().name==="golfDrive"){const V=["pokeball","pokeball2","questionCube"],h=this.scene.getObjectByName("a-char");let b=null,p=1/0;if(h&&V.forEach(R=>{const C=this.scene.getObjectByName(R);if(C&&C.visible&&C.rapierBody){const N=C.position.distanceTo(h.position);N<p&&(p=N,b=C)}}),b&&b.rapierBody){const R=G.getClip().duration,C=G.time/R;if(C<.1&&(this.hasHitThisSwing=!1),!this.hasHitThisSwing&&C>=.22){this.hasHitThisSwing=!0,b.rapierBody.wakeUp();const N=new l.Vector3(-1,1.35,0).normalize(),q=b.rapierBody.mass(),$=q*61.1,L=this.scene&&this.scene.world?this.scene.world:null;if(L&&!L.isBusy)try{L.isBusy=!0,b.rapierBody.applyImpulse({x:N.x*$,y:N.y*$,z:N.z*$},!0);const B=b.rapierBody.translation(),z=new l.Vector3(B.x,B.y,B.z);if(G.setEffectiveTimeScale(.1),setTimeout(()=>{new x.Tween({ts:.1}).to({ts:1},700).easing(x.Easing.Cubic.Out).onUpdate(E=>G.setEffectiveTimeScale(E.ts)).start()},120),b.name.startsWith("pokeball"))ka(this.scene,z,h.position,[16777215,16746496,16755200]),re("TARGET_STABILIZED: DATA_ENTITY_SEQUESTERED");else if(b.name==="questionCube"){ka(this.scene,z,h.position,[16777215,16766720,16746496]),re("SYSTEM_ANOMALY_RESOLVED: JACKPOT_SECTOR_OPEN");const E=Math.floor(Math.random()*6)+1,k=Math.random()>.5?"BTC":"ETH",I=new l.Vector3(1,.1,-1.5);for(let Y=0;Y<E;Y++){const H=Y/E*Math.PI*2+Math.random()*.5,D=4+Math.random()*4,W=12+Math.random()*8,Q={x:Math.cos(H)*D,y:W,z:Math.sin(H)*D};oi(this.scene,I,Q,Y>0,k)}window.LIGHT&&window.LIGHT.lightningStrike({scene:this.scene,constantUniform:this.scene.globalUniformsHub?.uniforms,windowLight:this.scene.windowLight},.9,z,!1)}const U=q*15;b.rapierBody.applyTorqueImpulse({x:(Math.random()-.5)*(U*.6),y:-U*1,z:(Math.random()-.5)*(U*.6)},!0),L.isBusy=!1}catch(B){console.error("[BoneTracker] Impulse failed:",B.message),L&&(L.isBusy=!1)}}}}}updateDroneBeam(e,t){const o=this.scene.getObjectByName("drone"),i=o?o.getObjectByName("Sphere001_0"):null;if(!i||!this.droneBeam)return;const a=new l.Vector3;i.getWorldPosition(a);const r={left:e,top:t,width:0,height:0,right:e,bottom:t},n=Ei(this.scene,r,"TL",.5);this.droneBeam.position.copy(a),this.droneBeam.lookAt(n),Vt(this.scene,n,!0,!0);const s=a.distanceTo(n);this.droneBeam.children.forEach(c=>{c.name.includes("beam")&&(c.scale.z=s)})}setBone(e){this.boneName=e,this.targetBone=null}setScale(e){this.manualScaleFactor=e}setOffset(e=0,t=0,o=0){this.localOffset.set(e,t,o)}setRotationOffset(e=0,t=0,o=0){this.rotationOffset.set(l.MathUtils.degToRad(e),l.MathUtils.degToRad(t),l.MathUtils.degToRad(o))}destroy(){this.isActive&&this.toggleTracking(),this.isActive=!1,this.element=null}}})),Cd=J((()=>{}));function Id(e,t,o){const i=document.getElementById("act-button");i&&i.addEventListener("click",()=>{console.log("ACT 1: PAUSE & RESET"),e.physicObjects&&e.physicObjects.length>0?(e.physicObjects.forEach(a=>{if(o.includes(a.name))return;const r=a.rapierBody;if(r&&a.userData.originalPos&&a.userData.originalRot){const n=r.bodyType();if(n===fe.RigidBodyType.Fixed)return;r.setBodyType(fe.RigidBodyType.KinematicPositionBased);const s=a.position.clone(),c=a.quaternion.clone(),u=a.userData.originalPos,d=a.userData.originalRot,m=new l.Quaternion().setFromEuler(d),f={val:0};new x.Tween(f).to({val:1},2e3).easing(x.Easing.Cubic.InOut).onUpdate(()=>{const g=e&&e.world?e.world:null;if(g&&g.isBusy)return;const w=new l.Vector3().lerpVectors(s,u,f.val);r.setNextKinematicTranslation(w);const y=c.clone().slerp(m,f.val);r.setNextKinematicRotation(y)}).onComplete(()=>{r.setBodyType(n),n===fe.RigidBodyType.Dynamic&&(r.setLinvel({x:0,y:0,z:0},!0),r.setAngvel({x:0,y:0,z:0},!0)),r.wakeUp()}).start()}}),re("Resetting Scene (Smooth)...")):console.warn("No scene.physicObjects found to reset.")})}function Rd(e,t){const o=document.getElementById("act-button-2");o&&o.addEventListener("click",async()=>{if(console.log("ACT 2: Button Clicked - Play Standup"),e.mixer&&e.animations){const i=e.animations.find(a=>a.name==="standup");if(i){e.mixer.stopAllAction();const a=e.mixer.clipAction(i);a.reset(),a.setLoop(l.LoopOnce),a.clampWhenFinished=!0,a.play(),re("Playing Standup Animation...")}else console.warn("Standup clip not found in scene.animations")}else console.warn("Mixer or Animations not found on scene")})}function Md(e){const t=document.getElementById("act-button-3");t&&t.addEventListener("click",()=>{console.log("ACT 3: BULB MORPH");const o=e.getObjectByName("bulb"),i=e.constantUniform,a=o.geometry,r=e.getObjectByName("bulb").geometry;if(i&&i.uTransformProgress){const n=i.uTransformProgress.value,s=n>.5?0:1,c=x.Easing.Back.InOut;let u=n>.5;new x.Tween(i.uTransformProgress).to({value:s},1500).easing(c).onUpdate(()=>{const d=i.uTransformProgress.value,m=Math.sin(d*Math.PI);i.uOscillationStrength.value=.2+.8*m;const f=d>.5;f!==u&&(u=f,f?(a.setIndex(a.targetIndex),r&&r.setIndex(a.targetIndex)):(a.setIndex(a.originalIndex),r&&r.setIndex(a.originalIndex)))}).start(),re(s===1?"Morphing to Bitcoin...":"Reverting to Bulb...")}else console.warn("Bulb or Morph Uniform not found.")})}function _d(e){const t=document.getElementById("act-button-4");t&&t.addEventListener("click",()=>{if(console.log("TEST 4 CLICKED: Converging Fireflies..."),e.constantUniform&&e.constantUniform.uMergeProgress){const o=e.constantUniform.uMergeProgress;o.value=0,new x.Tween(o).to({value:1},8e3).easing(x.Easing.Linear.None).repeat(0).start(),re("Fireflies Gathering...")}else console.warn("Constant Uniforms not found")})}function Ad(e){window.addEventListener("keydown",t=>{const o=parseInt(t.key);if(isNaN(o))return;const i=o;if(e.heroClips&&e.heroClips[i]){const a=e.heroClips[i];rt(e,a.name)}else console.warn(`No clip found for key ${o} (Index ${i})`)})}function Pd(e){const t=document.getElementById("act-button-5");t&&t.addEventListener("click",()=>{console.log("ACT 5: Toggle Points Environment (OFF)"),ai(e,1),re("Returning to Room Environment...")})}function Bd(e,t,o=[]){Id(e,t,o),Rd(e,t),Md(e),_d(e),Pd(e),Od(e);const i=document.getElementById("test-btn-revert"),a=document.getElementById("test-btn-2"),r=document.getElementById("test-btn-3"),n=document.getElementById("test-btn-resume");i&&i.addEventListener("click",()=>{console.log("clicked Revert Room"),Fa(e)}),a&&a.addEventListener("click",()=>{console.log("clicked Reassemble Scene"),_u(e)}),r&&r.addEventListener("click",()=>{console.log("clicked Active Grid (Toggle Visibility)");let s=e.camera.getObjectByName("camGrid");s||(s=e.getObjectByName("camGrid")),s?(s.visible=!0,console.log("Grid Visible: TRUE"),setTimeout(()=>{s&&(s.visible=!1,console.log("Grid Visible: FALSE (Auto-Hide)"))},500)):console.log("Grid 'camGrid' not found in camera or scene.")}),n&&n.addEventListener("click",()=>{if(console.log("clicked Resume Tween"),e.points&&e.points.morphTween){const s=e.points.morphTween;s.isPaused()?(s.resume(),console.log("Tween Resumed.")):console.log("Tween is not paused (or is playing).")}else console.log("No active morph tween found to resume.")}),Dd(document.getElementById("act-controls")),Ad(e),e.toggleRapierHelper=()=>{const s=e.rapierWorldWrapper;if(!s){console.warn("[Physics] Rapier wrapper (rapierWorldWrapper) not found on scene.");return}s.debuggerEnabled=!s.debuggerEnabled,s.world.debuggerEnabled=s.debuggerEnabled,s.lines&&(s.lines.visible=s.debuggerEnabled,s.debuggerEnabled?e.add(s.lines):e.remove(s.lines)),console.log(`[Physics] Debugger ${s.debuggerEnabled?"ENABLED":"DISABLED"}`)}}function Od(e){window.addEventListener("keydown",t=>{(t.key==="d"||t.key==="D")&&Ni(e)})}function Dd(e){if(!e)return;let t=!1,o,i,a,r,n=0,s=0;e.style.cursor="move",e.style.userSelect="none",e.addEventListener("mousedown",c),window.addEventListener("mouseup",u),window.addEventListener("mousemove",d);function c(f){f.target.closest("button")||(a=f.clientX-n,r=f.clientY-s,e.contains(f.target)&&(t=!0))}function u(f){a=o,r=i,t=!1}function d(f){t&&(f.preventDefault(),o=f.clientX-a,i=f.clientY-r,n=o,s=i,m(o,i,e))}function m(f,g,w){w.style.transform=`translate3d(${f}px, ${g}px, 0)`}}var Nd=J((()=>{pt(),ti(),ut(),Dn()})),Ld=Fi((()=>{co(),Du(),Nu(),Lu(),ku(),zu(),sd(),cd(),Gn(),dd(),fd(),Tl(),ut(),Qo(),bd(),Dn(),ji(),so(),et(),Zo(),Ed(),wt(),Cd(),Nd(),pt(),Gi(),lt(),Wt(),yt(),window.RAYCAST=gc,window.B64=gs,window.GLOBAL_COLORS=de;var e,t,o,i,a,r,n,s,c,u=new l.Clock,d=document.getElementById("progress-text"),m=document.getElementById("progress-bar");function f(){let M=document.getElementById("experience-container");if([t,e,o]=Ou({alpha:!0,domElement:M,useBackdrop:!0}),ir(o),i=Gu(t,e,o,!0),i.enableZoom=!1,t.renderer=o,t.constantUniform=Eo,window.scene=t,n=new vn(t,e,o),c=oc({scene:t,clock:u,raycaster:n,camera:e,domElement:o.domElement}),Uu(t),_o.init(t),t.clock=u,t.TWEEN=x,t.maximizer=di,t.targetAnimHz=30,window.maximizer=di,t.isHeroAnimating)return;He&&(t.shootDroneBeam=He),t.updateDroneGaze=Vt;const O=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)?1.5:2;o.setPixelRatio(Math.min(window.devicePixelRatio,O))}function g(){o.outputColorSpace=l.LinearSRGBColorSpace,o.physicallyCorrectLights=!0,o.toneMapping=l.CineonToneMapping,o.shadowMap.enabled=!0,o.shadowMap.type=l.PCFShadowMap,o.shadowMap.autoUpdate=!1;const M=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)?1.5:2;o.setPixelRatio(Math.min(window.devicePixelRatio,M)),t.background=null}function w(){wr()}async function y(){const M=new URLSearchParams(window.location.search).get("mobile")==="true"||/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);if(window.IS_MOBILE=M,M){document.body.classList.add("mobile-mode");const _=document.getElementById("cv-container");_&&_.classList.remove("collapsed");const v=document.getElementById("experience-container");v&&(v.style.display="none"),window.bootLoader&&typeof window.bootLoader.finish=="function"&&await window.bootLoader.finish();return}f(),ir(o),g(),await ql(),r=new Hr(t,{debuggerEnabled:!1,isActive:!1}),w(),wr(),Bd(t,u);const O=()=>new Promise(_=>setTimeout(_,100));try{Zl(),window.loadingProgress=0,na("points-init",20),na("model-assembly",20),na("physics-binding",40),Ue(window.loadingProgress||0,Z("SYS_RETRIEVING_ASSETS"));const _=ec();await Jl(),await O(),Ue(window.loadingProgress||0,Z("SYS_CALIBRATING_POINTS"));const v={x:61.56,y:2.97,z:30};if(e.position.set(v.x,v.y,v.z),he.start("Points System Init"),s=new xl(t,e,o,n,{enableLoadingUI:!1,enableBloom:!0,enableControls:!1}),t.pointsApp=s,Td(t),jc(t),await s.init(),s.points){const F=ud(s.points,t);F.material.uniforms&&(F.material.uniforms.uStarScreenPos.value.set(0,0),F.material.uniforms.uScaleFactor.value=0);const G=()=>{if(!t.knowhere||!t.knowhere.visible||!s.points||!t.HUD)return;const V=o.domElement.clientWidth,h=o.domElement.clientHeight,b=t.HUD.material.uniforms.uMarginPct.value,p=h*(b+t.HUD.material.uniforms.uVerticalMarginPct.value),R=(V-h*b*2)*.5,C=(h-p*2)*.5,N=C*2*(t.HUD.material.uniforms.uBNotchHRatio?.value||0),q=C*2*(t.HUD.material.uniforms.uRNotchHRatio?.value||0),$=t.knowhere.material.uniforms.uHudOffset.value,L=$.x,B=$.y;let z=L*R,U=B*C;Math.abs(B)<1&&(z-=(1-Math.abs(B))*q*L),Math.abs(L)<1&&B<0&&(U+=(1-Math.abs(L))*N*Math.abs(B));const E=z/(V*.5),k=U/(h*.5);t.knowhere.material.uniforms.uStarScreenPos&&t.knowhere.material.uniforms.uStarScreenPos.value.set(E,k);const I=new l.Vector2((E*.5+.5)*V,(k*.5+.5)*h);s&&s.material&&s.material.uniforms.uKnowhereScreen&&(s.material.uniforms.uKnowhereScreen.value.copy(I),s.material.uniforms.uKnowhereScale.value=t.knowhere.material.uniforms.uScaleFactor.value);const Y=new l.Vector3(E,k,.5);Y.unproject(e);const H=Y.sub(e.position).normalize(),D=Math.max(10,e.position.length()-.1),W=e.position.clone().add(H.multiplyScalar(D));s.points.worldToLocal(W),t.knowhere.position.set(W.x,W.y,W.z)};setTimeout(G,100),window.addEventListener("resize",G),window.addEventListener("cvToggle",()=>setTimeout(G,400)),window.addEventListener("personaChanged",()=>setTimeout(G,100)),t.onUpdate=t.onUpdate||[],t.onUpdate.push(G)}jl("points-init"),he.end("Points System Init"),await O(),await O(),Ue(window.loadingProgress||0,Z("SYS_INIT_MODELS")),await _,await O(),a=new fl(t,e,o,oe),t.loadedModel=a,await a.init(d,m,{skipCompile:!1,pointsApp:s});const P=new bl(t,"mixamorigRightHandMiddle1");if(t.onUpdate=t.onUpdate||[],t.onUpdate.push(()=>P.update()),window.boneTracker=P,window.addEventListener("keydown",F=>{F.target.tagName==="INPUT"||F.target.tagName==="TEXTAREA"||F.key.toLowerCase()==="t"&&zt(t)}),window.addEventListener("audienceChanged",()=>{t.isHeroAnimating||zt(t)}),await O(),await O(),await O(),Ue(window.loadingProgress||0,Z("SYS_WARMING_ENGINES")),s&&typeof s.warmup=="function"){const F=t.getObjectByName("roomGLBModel");let G=new l.Vector3,V=new Map;if(F){G.copy(F.position),F.position.set(0,0,0),F.visible=!0;const p=new Set,R=new Set;F.traverse(C=>{C.isMesh&&(V.set(C.uuid,C.frustumCulled),C.frustumCulled=!1,C.material&&(Array.isArray(C.material)?C.material:[C.material]).forEach(N=>{R.add(N);for(let q in N)N[q]&&N[q].isTexture&&p.add(N[q])}))});for(const C of p)o.initTexture(C),await new Promise(N=>requestAnimationFrame(N))}const h=t.HUD;let b={};if(h&&h.material&&h.material.uniforms){const p=h.material.uniforms;b={uVerticalMarginPct:p.uVerticalMarginPct.value,uCutSize:p.uCutSize.value,uBNotchHRatio:p.uBNotchHRatio.value,uBNotchWRatio:p.uBNotchWRatio.value,uIslToMainWRatio:p.uIslToMainWRatio.value,uRNotchHRatio:p.uRNotchHRatio.value,uRNotchWRatio:p.uRNotchWRatio.value,uIsAutoElec:p.uIsAutoElec.value,uGridLock:p.uGridLock.value},p.uVerticalMarginPct.value=0,p.uCutSize.value=10,p.uBNotchHRatio.value=.02,p.uBNotchWRatio.value=.6,p.uIslToMainWRatio.value=.32,p.uRNotchHRatio.value=.4,p.uRNotchWRatio.value=.02,p.uIsAutoElec.value=1,p.uGridLock.value=1,h.visible=!0}try{const p=N=>new Promise(q=>setTimeout(q,N)),R=[];F.traverse(N=>{N.isMesh&&R.push(N)});const C=5;for(let N=0;N<R.length;N+=C){const q=[];for(let $=N;$<Math.min(N+C,R.length);$++)q.push(o.compileAsync(R[$],e));await Promise.all(q),await new Promise($=>requestAnimationFrame($))}await o.compileAsync(t,e),await p(150),s.warmup(),await p(150),o.info.memory}catch{}if(h&&h.material&&h.material.uniforms){const p=h.material.uniforms;for(const R in b)p[R].value=b[R]}F&&(F.visible=!1,F.position.copy(G),F.traverse(p=>{p.isMesh&&V.has(p.uuid)&&(p.frustumCulled=V.get(p.uuid))}))}else console.warn("[Warmup] Skipped: pointsApp or warmup function missing.");if(await O(),kn(t),du(t),a.isLoaded=!0,se.setPointsApp(s),Ue(100),((performance.now()-window.bootStartTime)/1e3).toFixed(2),se.setPointsApp(s),Ue(100),window.bootLoader&&typeof window.bootLoader.finish=="function"){const F=document.getElementById("board");F&&(F.style.display="flex"),await window.bootLoader.finish()}he.printReport(),await ld({scene:t,camera:e,orbitControl:i,clock:u,pointsApp:s});let A=!1;window.addEventListener("keydown",F=>{if(F.key.toLowerCase()==="b"&&t.HUD&&typeof t.HUD.breathe=="function"){A=!A;const G=A?de.CRIMSON_RED:de.ELECTRIC_CYAN;t.HUD.breathe(G)}}),window.addEventListener("cvToggle",F=>{if(t&&t.HUD&&typeof t.HUD.breathe=="function"){const G=F.detail&&F.detail.collapsed?de.CRIMSON_RED:de.ELECTRIC_CYAN;t.HUD.breathe(G)}},{passive:!0})}catch(_){console.error("Fatal Error during Initialization:",_),Ue(window.loadingProgress||0,Z("SYS_FAILURE")),setTimeout(()=>{window.bootLoader&&typeof window.bootLoader.finish=="function"&&window.bootLoader.finish()},3e3)}}var S=0;function T(){S++,t.frameCounter=S;const M=S%2===0;t.isHighPriorityFrame=M;const O=t.scenarioState||bo[0],_=O.renderer||"composer",v=_!=="composer";o.shadowMap.enabled&&O.name==="room"&&!t.isTransitioning&&S%3===0&&(o.shadowMap.needsUpdate=!0);const P=performance.now(),A=u.getDelta(),F=t&&t.isTransitioning?Math.min(A,.25):Math.min(A,.06);if(t){if(t.fpsStats||(t.fpsStats={sum:0,count:0,avg:60}),A>0&&A<1){const C=1/A,N=.05;t.fpsStats.avg=C*N+t.fpsStats.avg*(1-N),t.fpsStats.count++}t.isTransitioning&&A>.02&&(t._lastTotalTime=A*1e3)}x&&x.update(),t.onUpdate&&t.onUpdate.forEach(C=>C(F)),n&&t.isAdjusted&&v&&n.update(),r&&v&&r.update(F),i&&i.edgeControlUpdate(),c&&c.update(F,n?n.pointer:null),M&&Pu(t,2);let G=t.scenarioState||bo[0];t.isTransitioning&&(G={...G,pixelRatioScale:.2}),di.update(F,o,G)&&s&&typeof s.onWindowResize=="function"&&s.onWindowResize();const V=performance.now();t._lastLogicTime=V-P;const h=t&&t.isTransitioning,b=performance.now();if(s){const C=s.bloomPass&&s.bloomPass.strength>.01;_==="composer"&&(!h||C)?(s.points&&!s.points.visible&&(s.points.visible=!0),s.update(!1,!0)):(s.points&&s.points.visible&&!C&&(s.points.visible=!1),h&&s.update(!0,!1),o&&t&&e&&o.render(t,e))}else o&&t&&e&&o.render(t,e);const p=performance.now();if(t._lastRenderTime=p-b,t&&t.isTransitioning&&t._lastTotalTime>20){const C=t._lastTotalTime,N=t._lastLogicTime||0,q=t._lastRenderTime||0,$=C-(N+q);N>q&&N>12,$>50&&`${$.toFixed(1)}`,t.HUD&&t.HUD.breathe&&t.HUD.breathe(de.CRIMSON_RED),t._lastTotalTime=0}t._accumulatedDelta||=0,t._accumulatedDelta+=F;const R=1/(t.targetAnimHz||30);if(t._accumulatedDelta>=R-.001){const C=t._accumulatedDelta,N=t&&t.isTransitioning;a&&v&&!N&&a.updateAnimationMixer(C),t._accumulatedDelta=0}}y(),typeof o<"u"&&o&&o.setAnimationLoop(T)})),Jd=Wl(),ef=Ld();_n();
