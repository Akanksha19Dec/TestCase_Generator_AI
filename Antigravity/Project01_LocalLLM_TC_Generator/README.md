# AI Test Case Generator (Project01)

This project contains the **Antigravity** agent's implementation of the Local LLM Test Case Generator. It is designed to take raw Jira requirements for APIs and Web Applications and automatically generate functional and non-functional test cases using Large Language Models.

## 🌟 Project Overview

This implementation focuses on a clean, scalable architecture separating the React frontend from the Node.js backend to provide a robust user interface and API routing system.

- **Frontend**: React application for pasting Jira requirements and viewing the tabular output.
- **Backend**: Node.js API that handles routing Prompts to various AI providers.
- **Supported Providers**: OpenAI, Anthropic Claude, Google Gemini, Groq, Ollama, and LM Studio.

## 📂 Structure

- `/frontend`: Contains the React/Vite web application. Includes chat inputs, settings for LLM configuration, and test case tables.
- `/backend`: Contains the Node.js/Express server used to orchestrate AI API calls and process responses into Jira format.
- `task_plan.md`: Tracks the phases of the project, goals, and architectural blueprint.
- `context.md` / `findings.md`: Development logs and context records maintained by the Antigravity agent.

## 🚀 Running the Project

For a quick start, you can use the provided Windows batch script:

```cmd
run.bat
```
*(This will attempt to start both the frontend and backend servers concurrently).*

### Manual Setup
**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🎯 Current Status
The project is currently in **Phase 3 (Implementation)**. The frontend UI and backend LLM routing interfaces are actively being scaffolded based on the approved blueprint specifications.
