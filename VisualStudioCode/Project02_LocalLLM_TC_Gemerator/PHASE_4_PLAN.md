# Phase 4: Backend Development Plan

## **Objectives**
✅ Set up Node.js/TypeScript project with Express.js
✅ Implement 3 REST API endpoints
✅ Create LLM provider client abstractions (5 providers)
✅ Implement prompt engineering system
✅ Build response parsing & validation
✅ Set up error handling & middleware
✅ Create test case generation service

---

## **Phase 4 Checklist**

### **Project Setup**
- [ ] Create Node.js project structure
- [ ] Install dependencies (Express, TypeScript, axios, etc.)
- [ ] Configure TypeScript (tsconfig.json)
- [ ] Create environment configuration (.env)
- [ ] Set up dev dependencies (ts-node, nodemon)

### **Express Server**
- [ ] Create main server file (server.ts)
- [ ] Set up middleware (CORS, JSON parsing, error handling)
- [ ] Configure port and startup
- [ ] Add health check endpoint

### **API Routes (3 Endpoints)**
- [ ] POST /api/generate-tests - Main endpoint
- [ ] GET /api/health - Health check
- [ ] GET /api/providers - List available providers

### **LLM Provider Integration (5 Providers)**
- [ ] Create provider interface (ILLMProvider)
- [ ] Implement Ollama client
- [ ] Implement LM Studio client
- [ ] Implement OpenAI client
- [ ] Implement Groq client
- [ ] Implement Claude client

### **Prompt Engineering**
- [ ] Create base prompt template
- [ ] Create provider-specific prompt variants
- [ ] Implement prompt builder
- [ ] Add temperature/config support

### **Response Processing**
- [ ] Create JSON response parser
- [ ] Implement validation service
- [ ] Create error handler
- [ ] Add retry logic

### **Business Logic**
- [ ] Create test case generator service
- [ ] Implement Jira format mapping
- [ ] Add ID generation
- [ ] Handle edge cases

### **Error Handling**
- [ ] API error middleware
- [ ] Provider error handling
- [ ] Timeout handling
- [ ] Rate limit handling

---

## **File Structure (Final)**

```
backend/
├── src/
│   ├── server.ts                 # Main Express server
│   ├── config/
│   │   └── env.ts                # Environment variables
│   ├── middleware/
│   │   ├── errorHandler.ts       # Error handling
│   │   ├── cors.ts               # CORS configuration
│   │   └── logging.ts            # Request logging
│   ├── routes/
│   │   └── testGeneration.ts     # API routes
│   ├── controllers/
│   │   └── testController.ts     # Route handlers
│   ├── services/
│   │   ├── testCaseGenerator.ts  # Main service
│   │   └── responseParser.ts     # Response parsing
│   ├── llm/
│   │   ├── providers/
│   │   │   ├── ILLMProvider.ts   # Interface
│   │   │   ├── OllamaProvider.ts
│   │   │   ├── LMStudioProvider.ts
│   │   │   ├── OpenAIProvider.ts
│   │   │   ├── GroqProvider.ts
│   │   │   └── ClaudeProvider.ts
│   │   ├── prompts/
│   │   │   ├── basePrompt.ts
│   │   │   ├── ollamaPrompt.ts
│   │   │   ├── openaiPrompt.ts
│   │   │   ├── groqPrompt.ts
│   │   │   └── claudePrompt.ts
│   │   └── factory.ts            # Provider factory
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   └── utils/
│       ├── logger.ts             # Logging utility
│       └── validators.ts         # Input validation
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
├── SETUP.md                      # Backend setup guide
└── nodemon.json
```

---

## **Dependencies to Install**

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "axios": "^1.6.0",
    "openai": "^4.0.0",
    "groq-sdk": "^0.1.0",
    "@anthropic-ai/sdk": "^0.4.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "ts-node": "^10.9.0",
    "nodemon": "^3.0.0"
  }
}
```

---

## **Implementation Order**

1. ✅ Project setup (package.json, configs)
2. ✅ Server configuration (Express, middleware)
3. ✅ TypeScript interfaces and types
4. ✅ LLM provider interface
5. ✅ Provider clients (all 5)
6. ✅ Prompt engineering system
7. ✅ Response parsing service
8. ✅ API routes
9. ✅ Error handling middleware
10. ✅ Test case generator service
11. ✅ Testing and verification

---

## **Environment Variables**

```env
# Server
PORT=5000
NODE_ENV=development

# Ollama (local)
OLLAMA_URL=http://localhost:11434

# LM Studio (local)
LM_STUDIO_URL=http://localhost:1234

# OpenAI
OPENAI_API_KEY=sk-...

# Groq
GROQ_API_KEY=gsk_...

# Claude
CLAUDE_API_KEY=sk-ant-...
```

---

## **Next Actions**
- Create Node.js project directory structure
- Generate package.json and configuration files
- Set up Express server
- Create TypeScript interfaces
- Implement LLM provider clients
- Test with frontend
