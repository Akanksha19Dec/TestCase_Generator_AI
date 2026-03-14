# LocalLLMTestGenBuddy - Task Plan

## **Project Overview**
**Name:** LocalLLMTestGenBuddy  
**Purpose:** Local test case generator using LLM providers (Ollama, LM Studio, Grok API, OpenAI, Claude.ai)  
**Problem Solved:** Automates test case generation from user requirements in Jira-compliant tabular format

---

## **Phase Breakdown**

### **Phase 1: Discovery & Blueprint ✅ (CURRENT)**
- [x] Gather project requirements
- [x] Understand tech stack (React frontend, Node.js/TypeScript backend)
- [x] Identify key features
- [ ] Ask clarifying questions (if needed)
- [ ] Get design folder walkthrough
- [ ] Finalize detailed blueprint

### **Phase 2: Architecture & Design Planning**
- [ ] Define React component structure
- [ ] Design Node.js/TypeScript backend API endpoints
- [ ] Plan LLM integration strategy
- [ ] Design data flow (requirement → test case)
- [ ] Define Jira table schema

### **Phase 3: Frontend Development ✅ (COMPLETE)**
- [x] Set up React project structure with Vite
- [x] Created 14 React components (fully typed)
- [x] Implemented tabular test case display
- [x] Designed UI/UX with Tailwind CSS
- [x] Set up API client and CSV export
- [x] Configured TypeScript and state management

### **Phase 4: Backend Development**
- [ ] Set up Node.js/TypeScript server
- [ ] Create API endpoints for requirements intake
- [ ] Implement LLM integration (Ollama, LM Studio, APIs)
- [ ] Build test case generation logic
- [ ] Implement response formatting (Jira-compatible table)

### **Phase 5: Integration & Testing**
- [ ] Connect frontend to backend
- [ ] Test end-to-end workflow
- [ ] Validate test case generation quality
- [ ] Error handling & edge cases

### **Phase 6: Deployment & Optimization**
- [ ] Prepare for deployment
- [ ] Performance optimization
- [ ] Documentation

---

## **Key Features Checklist**
- [ ] Accept user requirements (text input)
- [ ] Generate test cases based on Jira ID + requirement
- [ ] Display results in tabular format
- [ ] Support multiple LLM providers
- [ ] Reference design folder assets
- [ ] Jira-compliant test case format

---

## **BLUEPRINT STATUS: ✅ APPROVED**
*All clarifications received and confirmed by user. Ready to proceed to Phase 2.*

---

## **Finalized Specifications Summary**
| Aspect | Decision |
|--------|----------|
| **Frontend Framework** | React |
| **Backend Stack** | Node.js + TypeScript |
| **LLM Providers** | Ollama, LM Studio, Grok API, OpenAI, Claude.ai |
| **Provider Selection UI** | Dropdown menu |
| **Test Case Columns** | Test Case ID, Title, Preconditions, Steps, Expected Result, Actual Result, Status |
| **Data Persistence** | Temporary (session-based, no database) |
| **API Key Handling** | User enters per session |
| **Design Reference** | @design.png |
| **Export Format** | CSV |
| **Deployment Model** | Web browser application |
