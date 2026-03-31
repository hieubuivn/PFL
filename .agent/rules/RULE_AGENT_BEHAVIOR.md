<!-- Last Edited: 2026-01-25T15:00:22+07:00 -->
# RULE_AGENT_BEHAVIOR: Compliance & Performance Safeguards

This document defines the behavioral standards for the AI agent specifically for the **Portfolio** project. 

## 1. Documentation & Metadata Rules
- **RULE**: whenever the agent updates any rules file (suffix: `.md`) within the `projects/PORTFOLIO/.agent/rules/` directory, it MUST add a comment to the first line of the file.
- **FORMAT**: `<!-- Last Edited: YYYY-MM-DDTHH:MM:SS+HH:MM -->` (Exact time to the second).

## 2. Proactive Performance & Integrity Safeguards
- **RISK ASSESSMENT**: For every request, the agent MUST assess potential performance impacts (e.g., FPS drops, memory leaks, brute-force iterations).
- **BEST-FIT SOLUTIONS**: Always prioritize the most performant implementation over the simplest or requested one if the latter is sub-optimal.
- **USER INTERVENTION**: If the user provides a "false instruction" or a request that violates "The Law" (e.g., suboptimal shaders, heavy filters on bulk text), the agent MUST warn the user and suggest a better alternative instead of following instructions blindly.
- **ENFORCEMENT**: These are "Hard Guardrails." Performance stability takes priority over blind obedience.
