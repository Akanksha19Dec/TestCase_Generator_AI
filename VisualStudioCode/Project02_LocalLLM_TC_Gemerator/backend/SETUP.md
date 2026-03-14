# Backend Setup & Development Guide

## **Project Overview**

This is the Express.js backend for LocalLLMTestGenBuddy, built with:
- Express.js (HTTP server framework)
- TypeScript (type safety)
- Axios (HTTP client)
- Multiple LLM SDKs (OpenAI, Groq, Anthropic)
- Nodemon (development auto-reload)

---

## **Installation**

### **Prerequisites**
- Node.js 16+ and npm 7+
- Frontend running on `http://localhost:3000` (or reachable)
- At least one LLM provider configured (local or API)

### **Setup Steps**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure `.env` with your credentials:**
   ```env
   PORT=5000
   NODE_ENV=development
   
   # For local providers (Ollama, LM Studio)
   OLLAMA_URL=http://localhost:11434
   LM_STUDIO_URL=http://localhost:1234
   
   # For API providers
   OPENAI_API_KEY=sk-your-key
   GROQ_API_KEY=gsk_your-key
   CLAUDE_API_KEY=sk-ant-your-key
   ```

---

## **Development**

### **Start dev server (with auto-reload):**
```bash
npm run dev
```

Server available at: `http://localhost:5000`

### **Build for production:**
```bash
npm run build
```

### **Run production build:**
```bash
npm start
```

---

## **Project Structure**

```
src/
├── server.ts                    # Express app setup
├── config/
│   └── env.ts                   # Environment configuration
├── middleware/
│   └── errorHandler.ts          # Error handling & logging
├── routes/
│   └── testGeneration.ts        # API endpoints
├── services/
│   ├── testCaseGenerator.ts     # Main business logic
│   └── responseParser.ts        # LLM response parsing
├── llm/
│   ├── providers/
│   │   ├── ILLMProvider.ts      # Provider interface
│   │   ├── OllamaProvider.ts
│   │   ├── LMStudioProvider.ts
│   │   ├── OpenAIProvider.ts
│   │   ├── GroqProvider.ts
│   │   └── ClaudeProvider.ts
│   ├── prompts/
│   │   └── basePrompt.ts        # Prompt templates
│   └── factory.ts                # Provider factory
├── types/
│   └── index.ts                 # TypeScript interfaces
└── utils/
    ├── logger.ts                # Logging utility
    └── validators.ts            # Input validation
```

---

## **API Endpoints**

### **POST /api/generate-tests**
Generate test cases from requirement

**Request:**
```json
{
  "requirement": "User should be able to login with email and password",
  "provider": "openai",
  "apiKey": "sk-...",
  "providerConfig": {
    "model": "gpt-3.5-turbo",
    "temperature": 0.7
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "testCases": [
    {
      "testCaseId": "TC_001",
      "title": "Login with Valid Credentials",
      "preconditions": "User has valid email account",
      "steps": "1. Navigate to login\n2. Enter email\n3. Click login",
      "expectedResult": "User logged in successfully",
      "actualResult": "Pending",
      "status": "Not Executed"
    }
  ]
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### **GET /api/health**
Server health check

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-03-08T10:30:45Z",
  "version": "1.0.0"
}
```

### **GET /api/providers**
List available LLM providers

**Response:**
```json
{
  "providers": [
    {
      "id": "openai",
      "name": "OpenAI",
      "type": "api",
      "requiresApiKey": true,
      "defaultModel": "gpt-3.5-turbo",
      "description": "OpenAI GPT models"
    }
    // ... more providers
  ]
}
```

---

## **LLM Provider Setup**

### **Ollama (Local)**
1. Download from https://ollama.ai
2. Run: `ollama serve`
3. Pull a model: `ollama pull llama2`
4. Backend automatically connects to `http://localhost:11434`

### **LM Studio (Local)**
1. Download from https://lmstudio.ai
2. Load a model in UI
3. Start local server (port 1234)
4. Backend automatically connects to `http://localhost:1234`

### **OpenAI (API)**
1. Get API key from https://platform.openai.com/api-keys
2. Add to `.env`: `OPENAI_API_KEY=sk-...`
3. Backend will use for requests

### **Groq (API)**
1. Get API key from https://console.groq.com
2. Add to `.env`: `GROQ_API_KEY=gsk_...`
3. Fast inference API

### **Claude (API)**
1. Get API key from https://console.anthropic.com
2. Add to `.env`: `CLAUDE_API_KEY=sk-ant-...`
3. High-quality responses

---

## **Error Handling**

### **Connection Errors**
- Local providers (Ollama, LM Studio): Check if running
- API providers: Check API key validity

### **Rate Limiting**
- OpenAI: Wait before retrying
- Groq: May return 429 status
- Claude: Respects rate limits

### **Timeout Errors**
- Default timeout: 60 seconds
- Local providers may be slow
- Consider using faster API providers

---

## **Development Tips**

1. **Enable Debug Logging:**
   ```env
   LOG_LEVEL=debug
   ```

2. **Test Endpoints Locally:**
   ```bash
   curl -X POST http://localhost:5000/api/generate-tests \
     -H "Content-Type: application/json" \
     -d '{
       "requirement": "User login",
       "provider": "ollama",
       "providerConfig": {"model": "llama2"}
     }'
   ```

3. **Check Provider Health:**
   ```bash
   curl http://localhost:5000/api/health
   curl http://localhost:5000/api/providers
   ```

4. **Monitor Logs:**
   - Uses structured logging
   - Check console output for request details

---

## **TypeScript**

All code is fully typed. To add new types:
1. Add interfaces to `src/types/index.ts`
2. Use types in services and routes
3. TypeScript will catch errors at compile time

---

## **Dependencies**

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18.2 | HTTP server |
| typescript | ^5.3.3 | Type safety |
| axios | ^1.6.0 | HTTP client |
| openai | ^4.28.0 | OpenAI SDK |
| groq-sdk | ^0.3.0 | Groq SDK |
| @anthropic-ai/sdk | ^0.10.0 | Claude SDK |
| cors | ^2.8.5 | CORS support |
| dotenv | ^16.3.1 | Environment vars |

---

## **Environment Variables**

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Local Providers
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama2
LM_STUDIO_URL=http://localhost:1234
LM_STUDIO_MODEL=default

# API Providers
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-3.5-turbo
GROQ_API_KEY=gsk_...
GROQ_MODEL=mixtral-8x7b-32768
CLAUDE_API_KEY=sk-ant-...
CLAUDE_MODEL=claude-3-opus-20240229

# Logging
LOG_LEVEL=info
```

---

## **Troubleshooting**

### **Server won't start**
- Check if port 5000 is available
- Check `.env` file syntax
- Run `npm install` to ensure dependencies

### **Provider connection fails**
- Verify provider is running (local only)
- Check `.env` URLs are correct
- Check API keys are valid
- Review logs with `LOG_LEVEL=debug`

### **Test cases not generating**
- Check requirement text is valid
- Verify provider is working with `/api/health`
- Check error message in response
- Review backend logs

### **JSON parsing errors**
- Check LLM response format
- Try with different LLM provider
- Review backend logs for details

---

## **Performance**

- **Local Providers:** Slower but free and private
- **API Providers:** Fast but requires API key and costs money
- **Recommended:** Use Groq for best balance of speed and cost

---

## **Security**

- API keys are never logged or stored
- Requests validated on server side
- CORS configured for frontend only
- Request size limited to 10KB
- Error messages are generic in production

---

## **Testing**

To test all endpoints quickly:
```bash
# Health check
curl http://localhost:5000/api/health

# List providers
curl http://localhost:5000/api/providers

# Generate test cases
curl -X POST http://localhost:5000/api/generate-tests \
  -H "Content-Type: application/json" \
  -d '{
    "requirement": "User login test",
    "provider": "ollama",
    "providerConfig": {"model": "llama2"}
  }'
```

---

## **Next Steps**

1. Install dependencies: `npm install`
2. Configure `.env` with your LLM providers
3. Start backend: `npm run dev`
4. Test endpoints
5. Connect with frontend (already configured to use backend)

Ready to start developing! 🚀
