# Backend API Design

## **API Endpoints Overview**

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/generate-tests` | Generate test cases from requirement | None |
| GET | `/api/health` | Health check | None |
| GET | `/api/providers` | List available LLM providers | None |

---

## **Endpoint: POST /api/generate-tests**

### **Purpose**
Accept user requirement and generate test cases using specified LLM provider

### **Request**

```json
{
  "requirement": "User should be able to login with email and password",
  "provider": "openai",
  "apiKey": "sk-...",
  "providerConfig": {
    "model": "gpt-4",
    "temperature": 0.7
  }
}
```

### **Request Body Fields**

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|-----------|
| `requirement` | string | Yes | User requirement text | Min 10, Max 5000 chars |
| `provider` | string | Yes | LLM provider selection | Enum: ollama, lmstudio, openai, groq, claude |
| `apiKey` | string | Conditional | API key for provider | Required if provider is openai, groq, or claude |
| `providerConfig.model` | string | No | Model name to use | Provider-specific defaults |
| `providerConfig.temperature` | number | No | Sampling temperature | 0.0-1.0, default 0.7 |

### **Response (Success - 200 OK)**

```json
{
  "success": true,
  "testCases": [
    {
      "testCaseId": "TC_001",
      "title": "Login with Valid Email and Password",
      "preconditions": "User must have valid email account, application must be accessible",
      "steps": "1. Navigate to login page\n2. Enter valid email\n3. Enter password\n4. Click Login button",
      "expectedResult": "User is logged in successfully and redirected to dashboard",
      "actualResult": "Pending",
      "status": "Not Executed"
    },
    {
      "testCaseId": "TC_002",
      "title": "Login with Invalid Email",
      "preconditions": "User must be on login page",
      "steps": "1. Navigate to login page\n2. Enter invalid email format\n3. Click Login button",
      "expectedResult": "Error message displayed: 'Invalid email format'",
      "actualResult": "Pending",
      "status": "Not Executed"
    }
  ]
}
```

### **Response (Error - 400 Bad Request)**

```json
{
  "success": false,
  "error": "Requirement must be between 10 and 5000 characters"
}
```

### **Response (Error - 401 Unauthorized API Key)**

```json
{
  "success": false,
  "error": "Invalid API key for OpenAI. Please check your credentials."
}
```

### **Response (Error - 500 Server Error)**

```json
{
  "success": false,
  "error": "Failed to generate test cases. Please try again later."
}
```

### **HTTP Status Codes**

| Code | Situation |
|------|-----------|
| 200 | Test cases generated successfully |
| 400 | Invalid request (missing fields, validation errors) |
| 401 | Invalid API key |
| 500 | Server error, LLM API failure |

### **Implementation Logic**

```
1. Validate request body
   - Check: requirement exists and length valid
   - Check: provider is in allowed list
   - Check: apiKey provided if needed

2. Route to LLM provider client
   - If provider = "ollama" → OllamaClient
   - If provider = "lmstudio" → LMStudioClient
   - If provider = "openai" → OpenAIClient
   - If provider = "groq" → GroqClient
   - If provider = "claude" → ClaudeClient

3. Call LLM with optimized prompt
   - Prompt templates per provider
   - Insert requirement into prompt
   - Request response in JSON format

4. Parse LLM response
   - Extract test case data
   - Validate structure
   - Handle parsing errors

5. Format to Jira schema
   - Map LLM response to TestCase interface
   - Assign auto-generated IDs
   - Set default values (actualResult=Pending, status=Not Executed)

6. Return formatted response
```

---

## **Endpoint: GET /api/health**

### **Purpose**
Health check endpoint for monitoring

### **Response (200 OK)**

```json
{
  "status": "ok",
  "timestamp": "2026-03-08T10:30:45Z",
  "version": "1.0.0"
}
```

---

## **Endpoint: GET /api/providers**

### **Purpose**
List available LLM providers with their configuration

### **Response (200 OK)**

```json
{
  "providers": [
    {
      "id": "ollama",
      "name": "Ollama",
      "type": "local",
      "requiresApiKey": false,
      "defaultModel": "llama2",
      "description": "Local Ollama instance"
    },
    {
      "id": "lmstudio",
      "name": "LM Studio",
      "type": "local",
      "requiresApiKey": false,
      "defaultModel": "default",
      "description": "Local LM Studio instance"
    },
    {
      "id": "openai",
      "name": "OpenAI",
      "type": "api",
      "requiresApiKey": true,
      "defaultModel": "gpt-3.5-turbo",
      "description": "OpenAI GPT models"
    },
    {
      "id": "groq",
      "name": "Groq",
      "type": "api",
      "requiresApiKey": true,
      "defaultModel": "mixtral-8x7b-32768",
      "description": "Groq fast inference"
    },
    {
      "id": "claude",
      "name": "Claude",
      "type": "api",
      "requiresApiKey": true,
      "defaultModel": "claude-3-opus",
      "description": "Anthropic Claude models"
    }
  ]
}
```

---

## **Error Handling Strategy**

### **Validation Errors (400)**
- Empty requirement
- Requirement too short/long
- Invalid provider
- Missing required API key
- Invalid provider config

### **Authentication Errors (401)**
- Invalid/expired API key
- API key not provided when required
- Insufficient API quotas

### **Server Errors (500)**
- LLM API timeout
- LLM API rate limiting
- Parsing failures
- Unexpected exceptions

### **Error Response Format**
```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE" (optional)
}
```

---

## **Request/Response Examples by Provider**

### **Ollama (Local)**
```json
// Request
{
  "requirement": "User login functionality",
  "provider": "ollama",
  "providerConfig": {
    "model": "llama2"
  }
}

// Note: No apiKey needed
```

### **OpenAI**
```json
// Request
{
  "requirement": "User login functionality",
  "provider": "openai",
  "apiKey": "sk-...",
  "providerConfig": {
    "model": "gpt-4",
    "temperature": 0.7
  }
}
```

### **Groq**
```json
// Request
{
  "requirement": "User login functionality",
  "provider": "groq",
  "apiKey": "gsk_...",
  "providerConfig": {
    "model": "mixtral-8x7b-32768"
  }
}
```

### **Claude**
```json
// Request
{
  "requirement": "User login functionality",
  "provider": "claude",
  "apiKey": "sk-ant-...",
  "providerConfig": {
    "model": "claude-3-opus"
  }
}
```

---

## **Rate Limiting & Timeouts**

### **Timeouts**
- Request timeout: 30 seconds
- LLM response timeout: 60 seconds
- API key validation timeout: 10 seconds

### **Rate Limiting**
- No server-side rate limiting (assuming single user, local use)
- Client respects LLM provider rate limits
- Error handling for rate limit responses

---

## **Security Considerations**

1. **API Keys**
   - Never log API keys
   - Accept only in request body
   - Not stored in session or database
   - Discarded after request completes
   - Consider environment variables for development

2. **Request Validation**
   - Validate all input fields
   - Sanitize requirement text (no code injection)
   - Limit request size

3. **Response Security**
   - Don't expose internal error details
   - Generic error messages to users

---

## **Express.js Implementation Structure**

```typescript
// routes/testGeneration.ts
router.post('/api/generate-tests', async (req, res) => {
  try {
    // 1. Validate request
    // 2. Extract data
    // 3. Get LLM client
    // 4. Call LLM
    // 5. Parse response
    // 6. Format to schema
    // 7. Send response
  } catch (error) {
    // Handle errors
  }
});

router.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

router.get('/api/providers', (req, res) => {
  res.json({ providers: PROVIDERS_LIST });
});
```

---

## **TypeScript Interfaces (Backend)**

```typescript
interface GenerateTestsRequest {
  requirement: string;
  provider: 'ollama' | 'lmstudio' | 'openai' | 'groq' | 'claude';
  apiKey?: string;
  providerConfig?: {
    model?: string;
    temperature?: number;
  };
}

interface TestCase {
  testCaseId: string;
  title: string;
  preconditions: string;
  steps: string;
  expectedResult: string;
  actualResult: string;
  status: string;
}

interface GenerateTestsResponse {
  success: boolean;
  testCases?: TestCase[];
  error?: string;
}

interface ProviderConfig {
  id: string;
  name: string;
  type: 'local' | 'api';
  requiresApiKey: boolean;
  defaultModel: string;
  description: string;
}
```
