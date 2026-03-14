# 🤖 AI Test Case Generator

An automated test case generator powered by local and API-based Large Language Models (LLMs). This tool empowers QA engineers and developers to instantly generate comprehensive, Jira-compatible test cases from raw user requirements or user stories.

## 🌟 What This Project Does

Writing test cases manually is time-consuming. This application solves that by using AI to analyze requirements and automatically generate a structured test plan. 

- **Instant Generation**: Paste your requirements, and the AI generates structured test cases in seconds.
- **Multiple AI Providers**: Supports running completely offline with local models (via Ollama, LM Studio) or using powerful remote APIs (OpenAI, Anthropic Claude, Groq).
- **Jira-Ready Format**: Outputs test cases in a standard 7-column tabular format (Test Case ID, Title, Preconditions, Steps, Expected Result, Actual Result, Status) that can be easily imported into Jira or other test management tools.
- **CSV Export**: Download your generated test cases as a `.csv` file with a single click.

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript *(In Progress)*
- **AI Integration**: Custom abstraction layer for multiple LLM providers

## 📦 Getting Started

### Prerequisites
- Node.js (v16+)
- API Keys for cloud providers (optional) or locally running Ollama/LM Studio instances.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Akanksha19Dec/TestCase_Generator_AI.git
   cd TestCase_Generator_AI
   ```
2. Setup the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. Setup the backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

## 🔐 Privacy & Security
When using local LLM providers (like Ollama or LM Studio), your data never leaves your machine. This makes it safe to use with proprietary or sensitive requirements. API keys for cloud providers are not stored permanently.
