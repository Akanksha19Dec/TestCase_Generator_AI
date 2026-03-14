# LLM Integration Strategy

## **Overview**

The test case generation relies on carefully crafted prompts sent to LLM providers. This document outlines the prompt engineering strategy, provider-specific implementation details, and response parsing logic.

---

## **Core Prompt Strategy**

### **Objective**
Generate structurally sound test cases that conform to Jira format with exactly 7 fields per test case.

### **Prompt Template (Base)**

```
You are an expert QA engineer. Your task is to generate test cases from user requirements.

USER REQUIREMENT:
{REQUIREMENT}

Generate test cases that cover:
1. Happy path (main functionality)
2. Edge cases
3. Error scenarios
4. Boundary conditions

For EACH test case, provide the following in JSON format:

[
  {
    "testCaseId": "TC_001",
    "title": "Clear test case title",
    "preconditions": "System state or prerequisites needed",
    "steps": "Step 1: action\nStep 2: action\nStep 3: action",
    "expectedResult": "What should happen",
    "actualResult": "Pending",
    "status": "Not Executed"
  }
]

Rules:
- Generate 3-5 test cases per requirement
- Test case IDs must be sequential (TC_001, TC_002, etc.)
- "actualResult" should always be "Pending" initially
- "status" should always be "Not Executed" initially
- Steps should be numbered and clear
- Keep titles concise (max 100 chars)
- Return ONLY valid JSON, no extra text
```

### **Prompt Optimization**

The prompt will be tailored per provider to account for:
- Different model capabilities
- Cost considerations (tokens)
- Response quality variations
- Provider-specific features

---

## **Provider-Specific Implementation**

### **1. Ollama (Local)**

**Setup Requirements:**
- Ollama must be running locally (typically http://localhost:11434)
- Default model: `llama2` (or user-specified)

**Configuration:**
```typescript
{
  baseURL: 'http://localhost:11434',
  defaultModel: 'llama2',
  temperature: 0.7,
  topP: 0.9,
  timeout: 60000
}
```

**Prompt Variant:**
```
[Shorter, more explicit instructions]
You are a QA expert. Generate 3-4 test cases for this requirement.
Return ONLY JSON array, no explanation.
```

**Response Parsing:**
```
1. Check if response contains valid JSON
2. Extract array from response
3. Validate each test case has required fields
4. Generate IDs if missing
```

**Advantages:**
- Free, runs locally
- No API key needed
- Privacy-friendly

**Disadvantages:**
- Slower response time
- Quality depends on model size
- Requires local setup

---

### **2. LM Studio (Local)**

**Setup Requirements:**
- LM Studio must be running locally
- Default port: `http://localhost:1234`
- Model must be loaded in LM Studio

**Configuration:**
```typescript
{
  baseURL: 'http://localhost:1234/v1',
  defaultModel: 'default',
  temperature: 0.7,
  maxTokens: 2000,
  timeout: 60000
}
```

**API Compatibility:**
- Uses OpenAI-compatible API
- Can use OpenAI SDK with custom baseURL

**Prompt Variant:**
```
Similar to Ollama, optimized for LM Studio
```

**Response Parsing:**
```
Same as Ollama
```

**Advantages:**
- Free, local, user-friendly
- Compatible with many models
- Good quality/speed tradeoff

**Disadvantages:**
- Requires setup
- Model-dependent quality
- Network latency

---

### **3. OpenAI**

**Setup Requirements:**
- API key required: `sk-...`
- Models available: gpt-3.5-turbo, gpt-4, etc.

**Configuration:**
```typescript
{
  apiKey: userProvidedKey,
  defaultModel: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 2000,
  timeout: 30000
}
```

**SDK Usage:**
```typescript
import OpenAI from 'openai';

const client = new OpenAI({ apiKey });
const response = await client.chat.completions.create({
  model: userModel,
  messages: [{ role: 'user', content: prompt }],
  temperature: 0.7,
  max_tokens: 2000
});
```

**Prompt Variant:**
```
More detailed prompt leveraging GPT capabilities:
- More context about testing best practices
- Request for edge cases specifically
- JSON formatting emphasized
```

**Response Parsing:**
```typescript
const content = response.choices[0].message.content;
const testCases = JSON.parse(content);
```

**Advantages:**
- Highest quality responses
- Fast, reliable
- Well-documented

**Disadvantages:**
- Costs money (tokens)
- Requires internet
- API key management needed

---

### **4. Groq**

**Setup Requirements:**
- API key required: `gsk_...`
- Models available: mixtral-8x7b-32768, etc.

**Configuration:**
```typescript
{
  apiKey: userProvidedKey,
  defaultModel: 'mixtral-8x7b-32768',
  temperature: 0.7,
  maxTokens: 2000,
  timeout: 30000
}
```

**SDK Usage:**
```typescript
import Groq from 'groq-sdk';

const client = new Groq({ apiKey });
const response = await client.chat.completions.create({
  model: userModel,
  messages: [{ role: 'user', content: prompt }],
  temperature: 0.7,
  max_tokens: 2000
});
```

**Prompt Variant:**
```
GPT-like quality but optimized for Groq's inference speed
```

**Response Parsing:**
```typescript
const content = response.choices[0].message.content;
const testCases = JSON.parse(content);
```

**Advantages:**
- Fast inference (optimized hardware)
- Good quality
- Reasonable cost
- First token time very fast

**Disadvantages:**
- Requires internet
- API key needed
- Less familiar than OpenAI

---

### **5. Claude (Anthropic)**

**Setup Requirements:**
- API key required: `sk-ant-...`
- Models available: claude-3-opus, claude-3-sonnet, etc.

**Configuration:**
```typescript
{
  apiKey: userProvidedKey,
  defaultModel: 'claude-3-opus',
  temperature: 0.7,
  maxTokens: 2000,
  timeout: 30000
}
```

**SDK Usage:**
```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey });
const response = await client.messages.create({
  model: userModel,
  max_tokens: 2000,
  temperature: 0.7,
  messages: [
    { role: 'user', content: prompt }
  ]
});
```

**Prompt Variant:**
```
Claude-optimized with emphasis on:
- Clear structure (uses XML-like hierarchies well)
- Detailed instructions
- Specific formatting requirements
```

**Response Parsing:**
```typescript
const content = response.content[0].text;
const testCases = JSON.parse(content);
```

**Advantages:**
- Excellent quality
- Strong reasoning
- Good for complex test scenarios
- Handles edge cases well

**Disadvantages:**
- Higher cost per request
- Requires internet
- API key management

---

## **Request Flow by Provider**

```
POST /api/generate-tests
  ↓
├─ Validate request
├─ Extract: requirement, provider, apiKey, config
  ↓
├─ SELECT provider branch:
│
├─ IF provider = "ollama"
│  ├─ Create Ollama client
│  ├─ Send prompt
│  └─ Parse JSON response
│
├─ IF provider = "lmstudio"
│  ├─ Create LM Studio client (OpenAI-compatible)
│  ├─ Send prompt
│  └─ Parse JSON response
│
├─ IF provider = "openai"
│  ├─ Create OpenAI client
│  ├─ Send prompt with gpt model
│  └─ Parse JSON response
│
├─ IF provider = "groq"
│  ├─ Create Groq client
│  ├─ Send prompt
│  └─ Parse JSON response
│
├─ IF provider = "claude"
│  ├─ Create Anthropic client
│  ├─ Send prompt
│  └─ Parse JSON response
│
└─ Format response to Jira schema
```

---

## **Response Parsing & Validation**

### **Step 1: Extract JSON**
```typescript
function extractJSON(response: string): object {
  // Remove markdown code blocks if present
  const cleaned = response
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '');
  
  // Parse JSON
  return JSON.parse(cleaned);
}
```

### **Step 2: Validate Structure**
```typescript
function validateTestCase(testCase: any): boolean {
  return (
    typeof testCase.testCaseId === 'string' &&
    typeof testCase.title === 'string' &&
    typeof testCase.preconditions === 'string' &&
    typeof testCase.steps === 'string' &&
    typeof testCase.expectedResult === 'string' &&
    typeof testCase.actualResult === 'string' &&
    typeof testCase.status === 'string'
  );
}
```

### **Step 3: Normalize Data**
```typescript
function normalizeTestCase(testCase: any): TestCase {
  return {
    testCaseId: testCase.testCaseId || generateId(),
    title: testCase.title.substring(0, 100),
    preconditions: testCase.preconditions || 'N/A',
    steps: testCase.steps || 'N/A',
    expectedResult: testCase.expectedResult || 'N/A',
    actualResult: 'Pending', // Always set to Pending
    status: 'Not Executed' // Always set to Not Executed
  };
}
```

### **Step 4: Generate Missing IDs**
```typescript
function generateId(index: number): string {
  return `TC_${String(index + 1).padStart(3, '0')}`;
}
```

---

## **Error Handling**

### **LLM API Errors**
```typescript
if (response.status === 401) {
  throw Error('Invalid API key');
}
if (response.status === 429) {
  throw Error('Rate limit exceeded. Try again later.');
}
if (response.status === 500) {
  throw Error('LLM service error. Try again later.');
}
if (timeout) {
  throw Error('Request timed out. Try shorter requirement or different provider.');
}
```

### **JSON Parsing Errors**
```typescript
try {
  const data = JSON.parse(response);
} catch (e) {
  // Attempt to extract JSON from text
  const match = response.match(/\[\s*{[\s\S]*}\s*\]/);
  if (match) {
    return JSON.parse(match[0]);
  }
  throw Error('Failed to parse test cases from response');
}
```

### **Validation Errors**
```typescript
if (!Array.isArray(testCases)) {
  throw Error('Response must be array of test cases');
}
if (testCases.length === 0) {
  throw Error('No test cases generated');
}
```

---

## **Provider Comparison Matrix**

| Aspect | Ollama | LM Studio | OpenAI | Groq | Claude |
|--------|--------|-----------|--------|------|--------|
| **Cost** | Free | Free | $$$ | $$ | $$$$ |
| **Speed** | Slow | Medium | Fast | Very Fast | Medium |
| **Quality** | Medium | Medium | Excellent | Very Good | Excellent |
| **Setup** | Local req | Local req | None | API key | API key |
| **Privacy** | Excellent | Excellent | Poor | Good | Good |
| **Reliability** | Local only | Local only | High | High | High |
| **JSON Support** | Good | Good | Excellent | Excellent | Excellent |

---

## **Recommendation**

**For Development:** Use Ollama or LM Studio (free, local, privacy)
**For Production:** Use OpenAI or Claude (quality + reliability)
**For Speed:** Use Groq (fast inference, reasonable cost)

---

## **File Structure**

```
backend/src/
├── llm/
│   ├── providers/
│   │   ├── OllamaProvider.ts
│   │   ├── LMStudioProvider.ts
│   │   ├── OpenAIProvider.ts
│   │   ├── GroqProvider.ts
│   │   ├── ClaudeProvider.ts
│   │   └── ILLMProvider.ts (interface)
│   │
│   ├── prompts/
│   │   ├── basePrompt.ts
│   │   ├── ollamaPrompt.ts
│   │   ├── openaiPrompt.ts
│   │   ├── groqPrompt.ts
│   │   └── claudePrompt.ts
│   │
│   └── parser/
│       ├── ResponseParser.ts
│       ├── JSONExtractor.ts
│       └── Validator.ts
└── services/
    └── TestCaseGenerator.ts
```
