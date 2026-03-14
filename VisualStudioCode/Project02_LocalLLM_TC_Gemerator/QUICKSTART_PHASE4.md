# Quick Start: Phase 4 Backend Verification

## **Goal**
Get the Express.js backend running and verify all 5 LLM providers work.

---

## **Step 1: Install Dependencies** (2 minutes)

```bash
cd backend
npm install
```

**Expected output:** Shows packages installing, ends with "added XX packages"

---

## **Step 2: Configure Environment** (3 minutes)

```bash
cp .env.example .env
```

Then edit `.env`:

### **Minimal Setup (for local providers only)**
```env
PORT=5000
NODE_ENV=development
OLLAMA_URL=http://localhost:11434
LM_STUDIO_URL=http://localhost:1234
OPENAI_API_KEY=
GROQ_API_KEY=
CLAUDE_API_KEY=
```

### **Full Setup (for API providers)**
```env
PORT=5000
NODE_ENV=development

# Local providers
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama2
LM_STUDIO_URL=http://localhost:1234
LM_STUDIO_MODEL=default

# API providers
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-3.5-turbo
GROQ_API_KEY=gsk_your-key-here
GROQ_MODEL=mixtral-8x7b-32768
CLAUDE_API_KEY=sk-ant-your-key-here
CLAUDE_MODEL=claude-3-opus-20240229
```

**How to get API keys:**
- OpenAI: https://platform.openai.com/api-keys
- Groq: https://console.groq.com/keys
- Claude: https://console.anthropic.com/account/keys

---

## **Step 3: Start Backend Server** (1 minute)

```bash
npm run dev
```

**Expected output:**
```
[nodemon] restarting due to changes...
Server running on http://localhost:5000
```

Leave this terminal running.

---

## **Step 4: Test Endpoint 1 - Health Check** (Open new terminal)

```bash
curl http://localhost:5000/api/health
```

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2024-03-08T10:30:45Z",
  "version": "1.0.0"
}
```

✅ **If you see this, backend is running!**

---

## **Step 5: Test Endpoint 2 - List Providers**

```bash
curl http://localhost:5000/api/providers
```

**Expected response:**
```json
{
  "providers": [
    {
      "id": "ollama",
      "name": "Ollama",
      "type": "local",
      "requiresApiKey": false,
      "defaultModel": "llama2",
      "description": "Local LLM via Ollama"
    },
    // ... 4 more providers
  ]
}
```

---

## **Step 6: Test Endpoint 3 - Generate Test Cases**

### **Test with Ollama (Local) - NO API KEY NEEDED**

First, make sure Ollama is running:
```bash
# In another terminal:
ollama serve
ollama pull llama2  # If not already downloaded
```

Then generate test cases:
```bash
curl -X POST http://localhost:5000/api/generate-tests \
  -H "Content-Type: application/json" \
  -d '{
    "requirement": "User should be able to login with email and password",
    "provider": "ollama",
    "providerConfig": {
      "model": "llama2"
    }
  }'
```

**Expected response (after 10-30 seconds):**
```json
{
  "success": true,
  "testCases": [
    {
      "testCaseId": "TC_001",
      "title": "Valid Login",
      "preconditions": "User has existing account",
      "steps": "1. Navigate to login\n2. Enter email\n3. Click login",
      "expectedResult": "User logged in successfully",
      "actualResult": "Pending",
      "status": "Not Executed"
    }
  ]
}
```

✅ **Congratulations! Backend is working!**

---

## **Alternative: Test with OpenAI (API)**

```bash
curl -X POST http://localhost:5000/api/generate-tests \
  -H "Content-Type: application/json" \
  -d '{
    "requirement": "User should be able to login with email and password",
    "provider": "openai",
    "apiKey": "sk-your-api-key",
    "providerConfig": {
      "model": "gpt-3.5-turbo"
    }
  }'
```

**Expected:** Test cases generated in 2-5 seconds

---

## **Alternative: Test with Groq (Fastest!)**

```bash
curl -X POST http://localhost:5000/api/generate-tests \
  -H "Content-Type: application/json" \
  -d '{
    "requirement": "User should be able to login with email and password",
    "provider": "groq",
    "apiKey": "gsk_your-api-key",
    "providerConfig": {
      "model": "mixtral-8x7b-32768"
    }
  }'
```

**Expected:** Test cases generated in 1-3 seconds (fastest!)

---

## **Troubleshooting**

### **"Connection refused" for Ollama**
```bash
# Ollama not running. Start it:
ollama serve
```

### **"Invalid API Key" error**
```bash
# Check your API key is correct and in .env
# Make sure there are no extra spaces
```

### **"Network error" for local providers**
```bash
# Check LM Studio or Ollama is actually running
# Check URLs in .env are correct (usually http://localhost:XXXX)
```

### **Request timeout (took > 60 seconds)**
```bash
# LLM response was very slow
# Try with faster provider (Groq is fastest)
# Or try smaller/faster model
```

---

## **Success Checklist**

- [ ] `npm install` completed
- [ ] `.env` file created and configured
- [ ] `npm run dev` shows "Server running on port 5000"
- [ ] Health check returns status "ok"
- [ ] Provider list shows 5 providers
- [ ] Test case generation works with at least 1 provider
- [ ] Response has all required fields (testCaseId, title, steps, etc.)

---

## **What's Next?**

1. ✅ Backend is verified and working
2. ⏳ **Start frontend dev server:** `cd frontend && npm run dev`
3. ⏳ **Open browser:** http://localhost:3000
4. ⏳ **Test full integration:** Generate test cases from frontend
5. ⏳ **Export to CSV:** Download test cases

---

## **Common Commands**

| Task | Command |
|------|---------|
| Start backend | `cd backend && npm run dev` |
| Stop backend | Ctrl+C in terminal |
| View logs | Watch terminal while running |
| Enable debug logs | `LOG_LEVEL=debug npm run dev` |
| Rebuild TypeScript | `npm run build` |
| Check backend live | `curl http://localhost:5000/api/health` |

---

## **Performance Reference**

| Provider | Speed | Cost | API Key |
|----------|-------|------|---------|
| Groq | ⚡ 1-3s | Cheap | Yes |
| OpenAI | 🚗 2-5s | $$ | Yes |
| Claude | 🚗 3-8s | $ | Yes |
| LM Studio | 🐢 5-30s | Free | No |
| Ollama | 🐢 5-30s | Free | No |

**Recommendation:** Use **Groq** for speed, **Ollama** for privacy, **Claude** for quality.

---

## **Next Steps**

When all tests pass:

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Open browser
# Navigate to http://localhost:3000
```

Then test the full application flow! 🎉
