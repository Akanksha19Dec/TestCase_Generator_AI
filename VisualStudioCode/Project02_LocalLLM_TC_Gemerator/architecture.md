# Architecture Design - LocalLLMTestGenBuddy

## **System Architecture Overview**

```
┌─────────────────────────────────────────────────────────────────┐
│                         WEB BROWSER                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    REACT FRONTEND                        │   │
│  │  ┌─────────────┬──────────────┬────────────────────┐    │   │
│  │  │   Input UI  │  Provider    │   Display Output   │    │   │
│  │  │  Component  │  Selector    │   (Table + Export) │    │   │
│  │  └─────────────┴──────────────┴────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↕ HTTP/REST
│  ┌──────────────────────────────────────────────────────────┐   │
│  │        NODE.JS/TYPESCRIPT BACKEND SERVER                │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  API Routes (Express)                           │   │   │
│  │  │  ├─ POST /api/generate-tests                    │   │   │
│  │  │  ├─ GET /api/export-csv                         │   │   │
│  │  │  └─ Health checks                               │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                      ↓                                   │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │    LLM Integration Layer                         │   │   │
│  │  │  ├─ Ollama Client                                │   │   │
│  │  │  ├─ LM Studio Client                             │   │   │
│  │  │  ├─ OpenAI Client                                │   │   │
│  │  │  ├─ Grok API Client                              │   │   │
│  │  │  └─ Claude.ai Client                             │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                      ↓                                   │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  Test Case Generator (Business Logic)            │   │   │
│  │  │  ├─ Prompt Engineering                           │   │   │
│  │  │  ├─ Response Parsing                             │   │   │
│  │  │  └─ Table Formatting                             │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
         ↕ External LLM APIs (OpenAI, Groq, Claude, etc.)
     (Ollama & LM Studio run locally)
```

---

## **Data Flow Diagram**

```
USER INPUT FLOW:
1. User enters requirement in React text area
2. User selects LLM provider (dropdown)
3. User enters API key(s) if needed
4. Clicks "Generate Test Cases"
         ↓
5. Frontend sends POST request to /api/generate-tests
         ↓
6. Backend receives requirement + provider + API key
         ↓
7. Test Case Generator creates optimized prompt
         ↓
8. Route to appropriate LLM client (Ollama/LM Studio/API)
         ↓
9. LLM generates test case response
         ↓
10. Parse response into structured format
         ↓
11. Map to Jira table schema (7 columns)
         ↓
12. Return JSON to frontend
         ↓
13. Frontend renders results in table
         ↓
14. User can download as CSV or copy
```

---

## **Component Layer Separation**

### **Frontend Layer (React)**
- Presentation components (UI, forms, tables)
- State management (user inputs, API responses)
- API communication (HTTP client)
- CSV export logic

### **Backend Layer (Node.js/TypeScript)**
- Express API server
- LLM client abstractions
- Business logic (prompt engineering, response parsing)
- Session management (API keys in memory only)

### **LLM Integration Layer**
- Provider-specific client wrappers
- Unified interface for all providers
- Error handling and retry logic
- Streaming support (optional)

---

## **Key Design Principles**

1. **No Data Persistence** - All data (API keys, generated tests) kept in memory/session only
2. **Provider Abstraction** - Unified interface for all LLM providers
3. **Stateless Backend** - Each request is independent (no session database)
4. **Security** - API keys handled in memory, never logged or stored
5. **Modularity** - Easy to add new LLM providers
6. **Error Handling** - Graceful fallback for API failures

---

## **Technology Stack Details**

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend Framework | React 18+ | UI component library |
| HTTP Client | Axios/Fetch | Backend communication |
| Styling | CSS/Tailwind | UI styling |
| CSV Export | papaparse or csv-writer | CSV generation |
| Backend Framework | Express.js | REST API server |
| Language | TypeScript | Type safety |
| LLM Integration | Various SDKs | Provider-specific clients |
| Development | Vite (React) + Nodemon (Backend) | Development server |

---

## **Session Management (No Persistence)**

- User session in memory only
- API keys discarded when tab/app closed
- Generated test cases not saved to database
- Each request includes all necessary context
- No user authentication needed (local use assumed)

---

## **API Communication Pattern**

```
POST /api/generate-tests
├─ Request Body:
│  ├─ requirement: string
│  ├─ provider: "ollama" | "lmstudio" | "openai" | "groq" | "claude"
│  ├─ apiKey: string (if needed)
│  └─ providerConfig: object (model name, temperature, etc.)
│
└─ Response:
   ├─ success: boolean
   ├─ testCases: Array<TestCase>
   │  └─ TestCase:
   │     ├─ testCaseId: string
   │     ├─ title: string
   │     ├─ preconditions: string
   │     ├─ steps: string
   │     ├─ expectedResult: string
   │     ├─ actualResult: string (auto-set to "Pending")
   │     └─ status: string (auto-set to "Not Executed")
   └─ error: string (if failed)
```

---

## **Export (CSV) Flow**

```
User clicks "Export as CSV"
         ↓
Frontend receives in-memory test cases
         ↓
Convert array to CSV format
         ↓
Generate downloadable blob
         ↓
Trigger browser download (LocalTestCases_[timestamp].csv)
```
