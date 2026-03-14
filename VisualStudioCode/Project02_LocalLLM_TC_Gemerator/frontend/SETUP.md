# Frontend Setup & Development Guide

## **Project Overview**
This is the React frontend for LocalLLMTestGenBuddy, built with:
- React 18+
- TypeScript for type safety
- Vite for fast development
- Tailwind CSS for styling
- Axios for API calls

---

## **Installation**

### **Prerequisites**
- Node.js 16+ and npm 7+ installed
- Backend server should be running on `http://localhost:5000` (or configured in `.env`)

### **Setup Steps**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   - Edit `.env` if backend is on different host/port
   - Default: `VITE_API_URL=http://localhost:5000`

---

## **Development**

### **Start dev server:**
```bash
npm run dev
```
- Opens browser to `http://localhost:3000`
- Hot module replacement enabled
- API calls proxied to backend

### **Build for production:**
```bash
npm run build
```
- Creates optimized `dist/` folder
- Ready for deployment

### **Preview production build:**
```bash
npm run preview
```
- Serves the built app locally

---

## **Project Structure**

```
src/
├── components/           # React components (14 total)
│   ├── App.tsx
│   ├── Header.tsx
│   ├── InputPanel.tsx    # Main form container
│   ├── RequirementInput.tsx
│   ├── ProviderSelector.tsx
│   ├── ApiKeyInput.tsx
│   ├── GenerateButton.tsx
│   ├── LoadingSpinner.tsx
│   ├── ResultsPanel.tsx  # Results container
│   ├── TestCaseTable.tsx
│   ├── TableRow.tsx
│   ├── ExportButton.tsx
│   ├── ErrorMessage.tsx
│   └── Footer.tsx
│
├── services/            # Business logic
│   ├── api.ts           # API client (Axios)
│   └── csvExport.ts     # CSV download functionality
│
├── context/             # React Context
│   └── AppContext.tsx   # Global state management
│
├── types/               # TypeScript interfaces
│   └── index.ts
│
├── main.tsx             # React entry point
├── index.css            # Global styles & Tailwind
└── index.html           # HTML root
```

---

## **Component Hierarchy**

```
App (State Management)
├── Header
├── InputPanel
│   ├── RequirementInput
│   ├── ProviderSelector
│   ├── ApiKeyInput
│   └── GenerateButton
├── ResultsPanel
│   ├── LoadingSpinner
│   ├── ErrorMessage
│   ├── TestCaseTable
│   │   └── TableRow (multiple)
│   └── ExportButton
└── Footer
```

---

## **Key Features**

### **Input Form**
- Requirement textarea (max 5000 chars, with counter)
- Provider dropdown (Ollama, LM Studio, OpenAI, Groq, Claude)
- Conditional API key input (only for API-based providers)
- Form validation
- Generate button (disabled until valid)

### **Results Display**
- Beautiful table with 7 columns (Jira format)
- Loading spinner during generation
- Error message display
- CSV export button

### **Styling**
- Tailwind CSS utility-first
- Responsive design (mobile, tablet, desktop)
- Custom component styles in `index.css`

---

## **Environment Variables**

Create `.env` file (or modify `.env.local`):

```env
# Backend API URL (change if running elsewhere)
VITE_API_URL=http://localhost:5000

# Optional: add others as needed
```

---

## **API Integration**

### **Axios Client** (`services/api.ts`)
```typescript
apiClient.generateTestCases(request) // POST /api/generate-tests
apiClient.getProviders()              // GET /api/providers
apiClient.healthCheck()               // GET /api/health
```

### **Request/Response Types**
All types are defined in `types/index.ts`:
- `TestCase` - Single test case object
- `GenerateTestsRequest` - Request payload
- `GenerateTestsResponse` - Response from backend
- `LLMProvider` - Union type of providers

---

## **State Management**

### **React Context API** (`context/AppContext.tsx`)
Global state includes:
- `requirement` - User input
- `selectedProvider` - Chosen LLM
- `apiKey` - API key (session-only)
- `testCases` - Generated test cases
- `loading` - Loading state
- `error` - Error message

### **Usage in Components**
```typescript
import { useAppContext } from '../context/AppContext';

const { state, setRequirement, setLoading } = useAppContext();
```

---

## **CSV Export**

### **Function** (`services/csvExport.ts`)
```typescript
csvExport.downloadCSV(testCases, filename?)
```

### **Features**
- Converts test case array to CSV
- Uses papaparse for formatting
- Auto-generates filename with date
- Triggers browser download

### **Output Filename**
`test_cases_YYYY-MM-DD.csv`

---

## **Dependencies**

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.2.0 | UI framework |
| react-dom | ^18.2.0 | DOM rendering |
| axios | ^1.6.0 | HTTP client |
| papaparse | ^5.4.1| CSV parsing |
| typescript | ^5.0.0 | Type checking |
| vite | ^5.0.0 | Build tool |
| tailwindcss | ^3.3.0 | CSS framework |

---

## **Development Tips**

1. **Component Creation:** Use TypeScript interfaces for props
2. **Styling:** Use Tailwind utility classes first
3. **API Calls:** Use `apiClient` from services
4. **Type Safety:** Export types from `types/index.ts`
5. **Testing:** Components are designed to be testable

---

## **Troubleshooting**

### **API Connection Failed**
- Check backend is running on `localhost:5000`
- Check `.env` has correct `VITE_API_URL`
- Check network tab in DevTools

### **Styling Not Applied**
- Ensure Tailwind CSS is compiled
- Check `index.css` is imported in `main.tsx`
- Clear browser cache

### **TypeScript Errors**
- Run `npm install` to ensure all types are installed
- Check `tsconfig.json` is correct

---

## **Next Steps**

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Verify API connectivity
4. Test form submission
5. Test CSV export
6. Build for production when ready

---

## **Support**

For questions, refer to:
- Component specifications: `component_structure.md`
- Architecture overview: `architecture.md`
- API documentation: `api_design.md`
