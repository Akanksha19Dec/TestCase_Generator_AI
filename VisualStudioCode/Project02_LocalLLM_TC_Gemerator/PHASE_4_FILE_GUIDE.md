# Phase 4 Backend: File-by-File Overview

## **Complete File Listing**

### **Configuration Files (Root)**

#### `backend/package.json`
- Express.js dependencies and npm scripts
- Scripts: `dev` (nodemon), `build` (TypeScript), `start` (production)
- 14 dependencies total

#### `backend/tsconfig.json`
- TypeScript compiler configuration
- Strict mode enabled for type safety
- Target: ES2020
- Output: `dist/` folder

#### `backend/nodemon.json`
- Watches `src/` folder for changes
- Executes with `ts-node`
- Excludes node_modules

#### `backend/.env.example`
- Template for environment variables
- 12 variables: PORT, NODE_ENV, provider URLs, API keys
- Copy to `.env` and fill in sensible values

#### `backend/.gitignore`
- Excludes from Git: node_modules, dist, .env, logs

#### `backend/SETUP.md`
- **NEW** Complete development guide
- Installation, configuration, testing instructions
- API endpoint documentation
- LLM provider setup guides
- Troubleshooting tips

---

### **Server (Entry Point)**

#### `src/server.ts` (45 lines)
**Purpose:** Initialize Express app and start listening

**Key Code:**
```typescript
const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json({ limit: '10kb' }));
app.use(requestLogger);
app.use('/api', testGenerationRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

**Dependencies:** 
- Express, cors, middleware, routes

**Exports:** None (just runs)

---

### **Configuration System**

#### `src/config/env.ts` (25 lines)
**Purpose:** Load and validate environment variables

**Key Functions:**
- `loadEnv()` - Loads from .env file
- Provides defaults for optional variables
- Validates required variables in production

**Exports:**
```typescript
export const config = {
  port: number,
  nodeEnv: string,
  ollamaUrl: string,
  lmStudioUrl: string,
  openaiKey: string,
  // ... more config
}
```

---

### **Type Definitions**

#### `src/types/index.ts` (120 lines)
**Purpose:** Centralized TypeScript interfaces for entire backend

**Key Types:**
```typescript
interface TestCase {
  testCaseId: string;
  title: string;
  preconditions: string;
  steps: string;
  expectedResult: string;
  actualResult: string;
  status: string;
}

interface GenerateTestsRequest {
  requirement: string;
  provider: LLMProviderType;
  apiKey?: string;
  providerConfig?: ProviderOptions;
}

interface GenerateTestsResponse {
  success: boolean;
  testCases?: TestCase[];
  error?: string;
}

// + 5 more interfaces
```

**Usage:** Imported in all services, routes, providers

---

### **Utilities**

#### `src/utils/logger.ts` (30 lines)
**Purpose:** Structured logging with multiple levels

**Key Methods:**
```typescript
logger.debug(message, data?)
logger.info(message, data?)
logger.warn(message, data?)
logger.error(message, error?)
```

**Features:**
- Respects `LOG_LEVEL` environment variable
- Formats with timestamps
- Color-coded output in console

#### `src/utils/validators.ts` (50 lines)
**Purpose:** Input validation functions

**Key Functions:**
```typescript
validateGenerateRequest(req: any): string | null
  // Returns error if invalid, null if valid

sanitizeRequirement(text: string): string
  // Removes XSS, trims whitespace

validateApiKey(key: string, provider: string): boolean
  // Checks if key format is correct for provider
```

---

### **LLM Provider System**

#### `src/llm/providers/ILLMProvider.ts` (Interface - 25 lines)
**Purpose:** Define contract all providers must follow

**Methods:**
```typescript
interface ILLMProvider {
  generate(prompt: string, options?: any): Promise<string>;
  validate(): Promise<boolean>;
  getInfo(): ProviderInfo;
}
```

**Usage:** All 5 providers implement this interface

---

#### `src/llm/providers/OllamaProvider.ts` (60 lines)
**Purpose:** Local LLM via Ollama

**Key Implementation:**
```typescript
async generate(prompt: string, options?: ProviderOptions): Promise<string> {
  const response = await axios.post(
    `${this.ollamaUrl}/api/generate`,
    {
      model: options?.model || 'llama2',
      prompt: prompt,
      stream: false
    }
  );
  return response.data.response;
}
```

**Features:**
- HTTP-based API
- No authentication needed
- Slow but free and private

---

#### `src/llm/providers/LMStudioProvider.ts` (60 lines)
**Purpose:** Local LLM via LM Studio

**Key Implementation:**
```typescript
async generate(prompt: string, options?: ProviderOptions): Promise<string> {
  const response = await axios.post(
    `${this.lmStudioUrl}/v1/chat/completions`,
    {
      model: options?.model || 'default',
      messages: [{ role: 'user', content: prompt }]
    }
  );
  return response.data.choices[0].message.content;
}
```

**Features:**
- OpenAI-compatible API
- No authentication needed
- Slow but free and private

---

#### `src/llm/providers/OpenAIProvider.ts` (80 lines)
**Purpose:** OpenAI GPT models via official SDK

**Key Implementation:**
```typescript
const client = new OpenAI({ apiKey: this.apiKey });
const response = await client.chat.completions.create({
  model: this.model,
  messages: [{ role: 'user', content: prompt }],
  temperature: 0.7
});
return response.choices[0].message.content;
```

**Features:**
- Official SDK with error handling
- Token usage tracking
- Requires valid API key
- Fast and reliable

---

#### `src/llm/providers/GroqProvider.ts` (80 lines)
**Purpose:** Groq fast inference API

**Key Implementation:**
```typescript
const client = new Groq({ apiKey: this.apiKey });
const response = await client.chat.completions.create({
  model: this.model,
  messages: [{ role: 'user', content: prompt }],
  max_tokens: 1024
});
return response.choices[0].message.content;
```

**Features:**
- Fastest inference engine
- Official SDK
- Cheapest API option
- Requires API key

---

#### `src/llm/providers/ClaudeProvider.ts` (80 lines)
**Purpose:** Anthropic Claude models

**Key Implementation:**
```typescript
const client = new Anthropic({ apiKey: this.apiKey });
const response = await client.messages.create({
  model: this.model,
  max_tokens: 1024,
  messages: [{ role: 'user', content: prompt }]
});
return response.content[0].text;
```

**Features:**
- High-quality responses
- Official Anthropic SDK
- Requires API key
- Good balance of speed and quality

---

#### `src/llm/factory.ts` (40 lines)
**Purpose:** Factory pattern for provider instantiation

**Key Code:**
```typescript
class ProviderFactory {
  static createProvider(
    type: LLMProviderType,
    config: ProviderConfig
  ): ILLMProvider {
    switch (type) {
      case 'ollama':
        return new OllamaProvider(config.ollamaUrl);
      case 'openai':
        return new OpenAIProvider(config.apiKey, config.model);
      // ... more cases
    }
  }
}
```

**Usage:** Services use factory to get provider without knowing implementation

---

### **Prompt System**

#### `src/llm/prompts/basePrompt.ts` (60 lines)
**Purpose:** Generate prompt for LLM to create test cases

**Key Content:**
- 400+ words of instructions
- Specifies exact JSON format required
- Lists 5 test case scenarios (happy path, edge cases, errors, validation, state)
- Sets mandatory field values

**Example Output:**
```json
{
  "testCases": [
    {
      "testCaseId": "TC_001",
      "title": "Login with valid credentials",
      // ... more fields
    }
  ]
}
```

**Usage:** Called by testCaseGenerator service before LLM call

---

### **Response Processing**

#### `src/services/responseParser.ts` (100 lines)
**Purpose:** Extract and validate test cases from LLM response

**Key Functions:**
```typescript
parseTestCases(content: string): TestCase[] | null
  // Extracts JSON from response, handles markdown blocks

parseTestCase(item: any, index: number): TestCase | null
  // Converts raw data to TestCase, validates fields

validateTestCase(testCase: TestCase): string | null
  // Checks all required fields exist and are valid

validateAllTestCases(testCases: TestCase[]): string | null
  // Final validation before returning to frontend
```

**Features:**
- Tolerant parsing (handles markdown, missing quotes)
- Field validation
- Fallback extraction if JSON malformed
- Error reporting

---

#### `src/services/testCaseGenerator.ts` (120 lines)
**Purpose:** Main orchestrator service - coordinates entire pipeline

**Key Functions:**
```typescript
async generateTestCases(request: GenerateTestsRequest): Promise<GenerateTestsResponse>
  // Main entry point
  // 1. Validate request
  // 2. Create provider
  // 3. Generate prompt
  // 4. Call LLM
  // 5. Parse response
  // 6. Validate test cases
  // 7. Return response

getAvailableProviders(): LLMProvider[]
  // Returns metadata for all 5 providers

async validateProvider(type: LLMProviderType, apiKey?: string): Promise<boolean>
  // Health check for specific provider
```

**Error Handling:**
- Validation errors → 400 Bad Request
- Auth errors → 401 Unauthorized
- Provider errors → 503 Service Unavailable
- Timeout → 504 Gateway Timeout

---

### **API Routes**

#### `src/routes/testGeneration.ts` (100 lines)
**Purpose:** Define REST API endpoints

**Endpoints:**

**Endpoint 1: POST /api/generate-tests**
```typescript
router.post('/generate-tests', async (req, res, next) => {
  try {
    const response = await testCaseGenerator.generateTestCases(req.body);
    res.json(response);
  } catch (error) {
    next(error); // Passes to error handler
  }
});
```

**Endpoint 2: GET /api/health**
```typescript
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});
```

**Endpoint 3: GET /api/providers**
```typescript
router.get('/providers', (req, res) => {
  const providers = testCaseGenerator.getAvailableProviders();
  res.json({ providers });
});
```

---

### **Error Handling & Logging**

#### `src/middleware/errorHandler.ts` (80 lines)
**Purpose:** Global error handling and request logging

**Three Middleware Functions:**

**1. requestLogger**
```typescript
(req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
}
```

**2. notFoundHandler**
```typescript
(req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
}
```

**3. errorHandler**
```typescript
(error, req, res, next) => {
  // Maps error types to HTTP status codes:
  // ValidationError → 400
  // AuthenticationError → 401
  // RateLimitError → 429
  // TimeoutError → 504
  // ServerError → 500
}
```

---

## **Data Flow Diagram**

```
REQUEST
  ↓
requestLogger (middleware)
  ↓
expressJson (middleware)
  ↓
POST /api/generate-tests
  ↓
validators.validateGenerateRequest()
  ↓
ProviderFactory.createProvider()
  ↓
basePrompt generation
  ↓
provider.generate() [LLM call]
  ↓
responseParser.parseTestCases()
  ↓
testCaseGenerator.generateTestCases()
  ↓
express response → JSON
  ↓
(If error) errorHandler middleware
  ↓
RESPONSE
```

---

## **File Statistics**

| Category | Files | Lines | Purpose |
|----------|-------|-------|---------|
| Config | 5 | 50 | Environment & setup |
| Types | 1 | 120 | TypeScript interfaces |
| Utils | 2 | 80 | Logging, validation |
| Providers | 6 | 400 | LLM integrations |
| Services | 2 | 220 | Business logic |
| Middleware | 1 | 80 | Error handling |
| Routes | 1 | 100 | API endpoints |
| Server | 1 | 45 | Express setup |
| Docs | 3 | 400 | SETUP.md + guides |
| **TOTAL** | **22** | **~1500** | **Complete backend** |

---

## **Key Statistics**

- **TypeScript Files:** 17
- **Total Lines of Code:** ~1200
- **Total Documentation:** ~400 lines
- **Test Cases Generated Per Request:** 3-5
- **Supported Providers:** 5
- **API Endpoints:** 3
- **Error Codes Handled:** 8+
- **Type Interfaces:** 8

---

## **Dependencies Used**

```json
{
  "dependencies": {
    "express": "^4.18.2",           // HTTP server
    "axios": "^1.6.0",              // HTTP client (Ollama, LM Studio)
    "openai": "^4.28.0",            // OpenAI SDK
    "groq-sdk": "^0.3.0",           // Groq SDK
    "@anthropic-ai/sdk": "^0.10.0", // Claude SDK
    "cors": "^2.8.5",               // CORS middleware
    "dotenv": "^16.3.1"             // Environment variables
  },
  "devDependencies": {
    "typescript": "^5.3.3",         // Type checking
    "ts-node": "^10.9.0",          // TypeScript execution
    "nodemon": "^3.0.0"            // Development reload
  }
}
```

---

## **What Each File Does (Quick Reference)**

| File | Size | Purpose | Key Outputs |
|------|------|---------|------------|
| server.ts | 45L | Start Express server | Port 5000 |
| env.ts | 25L | Load configuration | config object |
| logger.ts | 30L | Structured logging | Console output |
| validators.ts | 50L | Input validation | Errors or null |
| ILLMProvider.ts | 25L | Provider interface | - |
| OllamaProvider.ts | 60L | Ollama client | Generated text |
| LMStudioProvider.ts | 60L | LM Studio client | Generated text |
| OpenAIProvider.ts | 80L | OpenAI client | Generated text |
| GroqProvider.ts | 80L | Groq client | Generated text |
| ClaudeProvider.ts | 80L | Claude client | Generated text |
| factory.ts | 40L | Instantiate providers | ILLMProvider instance |
| basePrompt.ts | 60L | Generate prompt | Prompt string |
| responseParser.ts | 100L | Parse LLM output | TestCase[] |
| testCaseGenerator.ts | 120L | Main orchestrator | GenerateTestsResponse |
| testGeneration.ts | 100L | API routes | REST endpoints |
| errorHandler.ts | 80L | Error & logging middleware | HTTP responses |

---

## **Next Steps**

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Start server:**
   ```bash
   npm run dev
   ```

4. **Test endpoints:** See `QUICKSTART_PHASE4.md`

---

## **Architecture Highlights**

✅ **Modular** - Each file has single responsibility  
✅ **Type-Safe** - Full TypeScript coverage  
✅ **Extensible** - Easy to add new LLM providers  
✅ **Validated** - Input and output validation  
✅ **Logged** - Structured logging throughout  
✅ **Documented** - Comments and guides included  
✅ **Tested** - Ready for endpoint testing  

All files are interconnected and work together as a cohesive system. 🚀
