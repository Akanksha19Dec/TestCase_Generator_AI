# Task Plan

## Phases and Goals
- [x] **Phase 1: Discovery** - Gather requirements and constraints. (Completed)
- [x] **Phase 2: Blueprint** - Finalize and approve the technical design. (Approved)
- [ ] **Phase 3: Implementation** - Wait for approval before writing code. (In Progress)

## Blueprint (APPROVED)

### 1. Project Overview
A TypeScript-based Web Application (React Frontend + Node.js Backend) that generates Functional and Non-Functional test cases for APIs and Web Applications in Jira format, based on Jira requirements pasted by the user.

### 2. System Architecture
- **Frontend**: React with TypeScript.
  - Chat/Input interface for pasting Jira requirements.
  - Settings window to configure LLM Provider (API Keys, Base URLs, Model selection).
  - Output display window to view and copy generated Jira-format test cases.
- **Backend API**: Node.js with TypeScript (Express or Fastify).
  - Handles routing of the prompt to the correct LLM provider.
  - Manages provider integrations (OpenAI, Anthropic, Google, Grok, Ollama, LM Studio).
- **LLM Integration Layer**:
  - Unified interface to communicate with both Local (Ollama, LM Studio) and Cloud (OpenAI, Claude, Gemini, Grok) models.
  - System prompts designed specifically to enforce outputting Test Cases in the exact Jira format requested.

### 3. Implementation Steps (To be executed in Phase 3)
1. **Initialize Project structure**: Setup frontend ( Vite/React ) and backend ( Node/Express ) folders.
2. **Backend Development**:
   - Create LLM Provider interfaces.
   - Implement the route handling for test case generation.
3. **Frontend Development**:
   - Build UI components (Input Chat, Output View, Settings Modal).
   - Integrate with backend API.
4. **Integration & Testing**:
   - Test prompts against multiple providers to ensure output consistency in Jira format.

---
**TO PROCEED**: Please review the above Blueprint. If you approve, please reply with "Approved" or provide any adjustments. I will not write any application code until approved.
