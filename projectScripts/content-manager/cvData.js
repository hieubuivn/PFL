import { ASSET_VERSION } from '../configs/sceneConfig.js';

export const cvData = {
    poba: {
        id: "PROTOCOL: BA_PO_2026",
        systemTitle: "STRATEGIC PRODUCT LEAD",
        role: "SENIOR TECHNICAL PRODUCT OWNER & BUSINESS ANALYST",
        summary: `Pi-shaped Technical Product Specialist with 10+ years of experience executing roadmaps across Fintech, DePIN (IoT & Web3), and EV mobility. I serve as a Technical Product Partner, bridging the gap between abstract business strategy and deep engineering reality. By integrating UX Design with functional prototyping, I validate complex product logic ensuring requirements are architecturally sound and user-optimized.`,
        summaryTags: [
            { key: "Roles", val: ["PO", "BA"], comment: "// Adaptive Shift" },
            { key: "Experience", val: "+10 Years Professional Journey" },
            { key: "Expertises", val: ["Fintech", "IoT", "EV_Mobility"] },
            { key: "π_Edge", val: "Engineering_Fluent_UX" },
            { key: "Methods", val: ["Gherkin_AC", "RICE", "MoSCoW"] },
            { key: "Validations", val: ["JS", "WebGL", "Python"] },
            { key: "Workflows", val: ["n8n", "AI", "Workflows"] }
        ],
        experience: [
            {
                company: "Arkreen Network",
                companyDesc: "A decentralized energy network (DePIN) leveraging Digital Twin technology for green energy assets.",
                title: "Technical Product Consultant (Independent)",
                date: "May 2025 – Present",
                points: [
                    "<strong>Strategic Prototyping:</strong> Co-developed high-fidelity interactive 3D dashboards (WebGL) to visualize real-time IoT data for investor pitching and stakeholder buy-in.",
                    "<strong>Technical De-risking:</strong> Validated requirement scalability using GLSL/Shaders to ensure architectural feasibility for complex 3D environments.",
                    "<strong>Productivity Automation:</strong> Deployed automated product management workflows using <strong>n8n and AI</strong>, reducing manual project overhead by an estimated <strong>40%</strong>."
                ]
            },
            {
                company: "VinFast - Vingroup",
                companyDesc: "Vietnam's global EV manufacturer building an integrated digital mobility ecosystem.",
                title: "Senior ITBA / Product Owner (IoT & Smart Systems)",
                date: "Oct 2021 – May 2025",
                points: [
                    "<strong>Digital Transformation (VCA & Reliability Audit):</strong> Digitized manual quality control workflows, improving <strong>Mean Time to Detect (MTTD) by 25%</strong> through real-time telemetry and automated alerting.",
                    "<strong>Factory QA Requirements (SSOT):</strong> Established a <strong>Single Source of Truth (SSOT)</strong>, aligning <strong>10,000+ employees</strong> for cloud tracking.",
                    "<strong>Factory Executive Reporting & Training (FERT):</strong> Digitized certification for <strong>10,000+ personnel</strong>, achieving <strong>100% paperwork reduction</strong> with real-time dashboards.",
                    "<strong>B2B Energy Management System (EMS):</strong> Served as Product Owner for the complete B2B IoT telemetry platform for energy hardware. Designed the admin portal's UX for remote monitoring.",
                    "<strong>Loyalty & Rewards System:</strong> Contributed as a key team member and Business Analyst, helping unify disjointed customer data into an interoperable omnichannel user experience."
                ]
            },
            {
                company: "Gapo Social Network",
                companyDesc: "A Vietnamese social platform focusing on community engagement and core social features.",
                title: "Senior IT Business Analyst",
                date: "Oct 2019 – Apr 2021",
                points: [
                    "<strong>Data-Driven Retention:</strong> Utilized <strong>RICE scoring</strong> to prioritize technically feasible fixes for user drop-off issues identified via Firebase, boosting retention.",
                    "<strong>Quality Assurance:</strong> Led the UAT process personally, reducing post-launch bugs through <strong>Gherkin-style</strong> detailed Acceptance Criteria (AC).",
                    "Mentored junior BA team members on requirement engineering and prioritization standards."
                ]
            },
            {
                company: "Five9 Vietnam",
                companyDesc: "Fintech startup building the 'Mony' P2P lending platform for SE Asia market.",
                title: "BA Team Lead / Product Owner",
                date: "May 2018 – Oct 2019",
                points: [
                    "<strong>Product Ownership:</strong> Managed the \"Mony\" P2P platform from concept to launch; used <strong>MoSCoW</strong> to define MVP scope and manage stakeholder requests.",
                    "Designed real-time dashboards for operational risk assessment and faster decision cycles.",
                    "Led technical integrations with VNPay and Bao Kim payment gateways."
                ]
            },
            {
                company: "Centech Interactive",
                companyDesc: "A technology agency specializing in mobile VAS and digital content services.",
                title: "IT Business Analyst",
                date: "Nov 2016 – Apr 2018",
                points: [
                    "Managed project backlogs and prioritized deliverables using <strong>MoSCoW</strong> to meet aggressive agency timelines.",
                    "Elicited and documented business requirements for various Mobile VAS and Digital Content projects."
                ]
            },
            {
                company: "ECPay (EVN)",
                companyDesc: "Electricity payment gateway under Vietnam Electricity (EVN).",
                title: "IT Business Analyst",
                date: "Jun 2015 – Oct 2016",
                points: [
                    "Supported the dev of the e-wallet system; applied <strong>MoSCoW</strong> to manage feature rollouts for power consumers.",
                    "Analyzed transaction data to improve system performance and user experience."
                ]
            },
            {
                company: "Bao Kim (VNP Group)",
                companyDesc: "One of Vietnam's pioneering e-payment gateways.",
                title: "Business Analyst",
                date: "Aug 2014 – May 2015",
                points: [
                    "Collaborated with the Dev team for early-stage fintech releases using structured prioritization techniques.",
                    "Conducted market research and gathered user requirements for new payment features and partner integrations."
                ]
            }
        ],
        skills: [
            { category: "PI-SHAPED", val: "UX Design + Tech Validation", id: "01", starIndices: [5, 6] },
            { category: "VALIDATION", val: "JS/ES6+, WebGL, Python", id: "02", starIndices: [0] },
            { category: "EXECUTION", val: "Jira, Figma, SQL, n8n", id: "03", starIndices: [1, 2] },
            { category: "LOGIC", val: "Gherkin AC, RICE, MoSCoW", id: "04", starIndices: [3, 4] }
        ],
        contacts: [
            { id: 'gmail', label: 'Gmail', platform: 'Inbox', url: 'hieubui.fsb@gmail.com', isMail: true },
            { id: 'linkedin', label: 'LinkedIn', platform: 'Profile', url: 'https://www.linkedin.com/in/buiquochieu/' },
            { id: 'phone', label: 'Phone', platform: 'Direct', url: 'tel:0965292489' }
        ]
    },
    dev: {
        id: "PROTOCOL: DEV_EX_2026",
        systemTitle: "INTERACTIVE DEVELOPER",
        role: "INTERACTIVE WEBGL DEVELOPER & CREATIVE ENGINEER",
        summary: `Creative Developer with a focus on immersive 3D experiences and high-performance WebGL/Three.js applications. I bridge the gap between complex mathematical concepts (GLSL) and intuitive user interfaces. With 10 years of background in technical product management, I bring a unique "business-aware" engineering mindset to creative projects—ensuring that high-end visuals are performant, maintainable, and aligned with user goals.`,
        summaryTags: [
            { key: "Specialization", val: "+3 Years Creative Dev Focus" },
            { key: "Foundation", val: "+10 Years Technical Strategy" },
            { key: "Tech_Cores", val: ["Threejs", "GLSL", "AR/VR"] },
            { key: "Design", val: "UX_UI_Specialist" },
            { key: "Method", val: "Technical_Prototyping" },
            { key: "Goal", val: "Performant_Visuals" }
        ],
        experience: [], // Shared via reference below
        skills: [
            { category: "3D_CORE", val: "Three.js, WebGL, GLSL (Shaders)", id: "01", starIndices: [5, 6] },
            { category: "LOGIC", val: "JavaScript (ES6+), GSAP, Mathematics", id: "02", starIndices: [3, 4] },
            { category: "UI/UX", val: "Figma-to-Code, Motion Design, Responsive 3D", id: "03", starIndices: [1, 2] },
            { category: "PERF", val: "Performance Profiling, GPU Debugging, Web Vitals", id: "04", starIndices: [0] }
        ],
        contacts: [
            { id: 'gmail', label: 'Gmail', platform: 'Inbox', url: 'hieubui.fsb@gmail.com', isMail: true },
            { id: 'linkedin', label: 'LinkedIn', platform: 'Profile', url: 'https://www.linkedin.com/in/buiquochieu/' },
            { id: 'phone', label: 'Phone', platform: 'Direct', url: 'tel:0965292489' }
        ]
    }
};

// Sync experience array across personas
cvData.dev.experience = cvData.poba.experience;
