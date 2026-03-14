# React Component Structure

## **Component Hierarchy**

```
App (Root)
├── Header
│   └── Logo & Title
├── Main Container
│   ├── InputPanel
│   │   ├── RequirementInput
│   │   ├── ProviderSelector (Dropdown)
│   │   ├── ApiKeyInput
│   │   └── GenerateButton
│   │
│   ├── LoadingSpinner (conditional)
│   │
│   └── ResultsPanel
│       ├── TestCaseTable
│       │   ├── TableHeader
│       │   └── TableRow (repeated for each test case)
│       │
│       ├── ExportButton (CSV)
│       └── ErrorMessage (conditional)
│
└── Footer
    └── Info/Help Text
```

---

## **Component Specifications**

### **1. App Component**
- **Purpose:** Root component, manages overall state, handles API calls
- **State:**
  - `requirement: string`
  - `selectedProvider: string`
  - `apiKey: string`
  - `testCases: TestCase[]`
  - `loading: boolean`
  - `error: string | null`
- **Props:** None
- **Children:** Header, InputPanel, ResultsPanel, Footer
- **Responsibilities:**
  - Manage global component state
  - Handle API communication
  - Pass state to children

---

### **2. Header Component**
- **Purpose:** Display application title and branding
- **Props:** None
- **Content:**
  - App logo/icon
  - "LocalLLMTestGenBuddy" title
  - Subtitle: "Generate Test Cases from Requirements"
- **Styling:** Based on design.png

---

### **3. InputPanel Component**
- **Purpose:** Container for all user input controls
- **Props:**
  - `onGenerateTests: (requirement, provider, apiKey) => void`
  - `loading: boolean`
- **Children:** RequirementInput, ProviderSelector, ApiKeyInput, GenerateButton
- **Responsibilities:**
  - Collect all user inputs
  - Validate inputs before submission
  - Trigger API call on generate

---

### **4. RequirementInput Component**
- **Purpose:** Text input for user requirements
- **Props:**
  - `value: string`
  - `onChange: (value: string) => void`
  - `placeholder: string`
- **HTML:** `<textarea>`
- **Attributes:**
  - Rows: 8-10
  - Placeholder: "Enter your test requirement here... (e.g., 'User should be able to login with email and password')"
  - Max length: 5000 characters
- **Responsibilities:**
  - Accept requirement text
  - Update parent state on change

---

### **5. ProviderSelector Component**
- **Purpose:** Dropdown to select LLM provider
- **Props:**
  - `value: string`
  - `onChange: (value: string) => void`
- **HTML:** `<select>` dropdown
- **Options:**
  - Ollama (local)
  - LM Studio (local)
  - OpenAI
  - Groq
  - Claude (Claude.ai)
- **Responsibilities:**
  - Display available providers
  - Update parent state on selection

---

### **6. ApiKeyInput Component**
- **Purpose:** Conditionally show API key input based on selected provider
- **Props:**
  - `provider: string`
  - `value: string`
  - `onChange: (value: string) => void`
  - `required: boolean`
- **HTML:** `<input type="password">`
- **Logic:**
  - Show only if provider is "openai", "groq", or "claude"
  - Hide for "ollama" and "lmstudio" (local)
  - Label changes based on provider
- **Responsibilities:**
  - Conditionally render based on provider
  - Mask input for security

---

### **7. GenerateButton Component**
- **Purpose:** Submit button to trigger test case generation
- **Props:**
  - `onClick: () => void`
  - `disabled: boolean`
  - `loading: boolean`
- **HTML:** `<button>`
- **Behavior:**
  - Disabled when: requirement is empty, provider not selected, required API key missing, already loading
  - Shows "Generating..." when loading with spinner
  - Click triggers test case generation API call
- **Responsibilities:**
  - Validate inputs
  - Trigger API call

---

### **8. LoadingSpinner Component**
- **Purpose:** Show loading state during API call
- **Props:**
  - `visible: boolean`
  - `message: string` (optional)
- **Content:** Animated spinner with "Generating test cases..." message
- **Responsibilities:**
  - Display loading feedback to user

---

### **9. ResultsPanel Component**
- **Purpose:** Container for displaying generated test cases
- **Props:**
  - `testCases: TestCase[]`
  - `loading: boolean`
  - `error: string | null`
- **Children:** TestCaseTable, ExportButton, ErrorMessage
- **Conditional Rendering:**
  - Show error if error exists
  - Show spinner if loading
  - Show table if testCases exist
- **Responsibilities:**
  - Organize results display
  - Handle conditional rendering

---

### **10. TestCaseTable Component**
- **Purpose:** Display test cases in tabular format
- **Props:**
  - `testCases: TestCase[]`
- **Children:** TableHeader, TableRow
- **HTML Structure:**
  ```
  <table>
    <thead>
      <tr>
        <th>Test Case ID</th>
        <th>Title</th>
        <th>Preconditions</th>
        <th>Steps</th>
        <th>Expected Result</th>
        <th>Actual Result</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <TableRow /> (for each test case)
    </tbody>
  </table>
  ```
- **Styling:**
  - Bordered table
  - Alternating row colors
  - Scrollable if needed
  - Column widths optimized
- **Responsibilities:**
  - Render structured table
  - Map test case data to rows

---

### **11. TableRow Component**
- **Purpose:** Display single test case as table row
- **Props:**
  - `testCase: TestCase`
- **HTML:** `<tr>` with 7 `<td>` cells
- **Content Mapping:**
  - Col 1: testCaseId
  - Col 2: title
  - Col 3: preconditions
  - Col 4: steps (may wrap or truncate)
  - Col 5: expectedResult
  - Col 6: actualResult (initially "Pending")
  - Col 7: status (initially "Not Executed")
- **Responsibilities:**
  - Map test case object to row cells

---

### **12. ExportButton Component**
- **Purpose:** Download test cases as CSV
- **Props:**
  - `testCases: TestCase[]`
  - `disabled: boolean`
- **HTML:** `<button>`
- **Behavior:**
  - Disabled if no test cases
  - Converts testCases array to CSV format
  - Triggers browser download
  - File name: `test_cases_[timestamp].csv`
- **CSV Format:**
  ```
  Test Case ID,Title,Preconditions,Steps,Expected Result,Actual Result,Status
  TC_001,Login with Email,...
  ```
- **Responsibilities:**
  - Convert data to CSV
  - Trigger download

---

### **13. ErrorMessage Component**
- **Purpose:** Display error messages
- **Props:**
  - `message: string`
  - `onDismiss: () => void` (optional)
- **HTML:** `<div>` with error styling
- **Styling:**
  - Red background/border
  - Dismissible (X button optional)
- **Responsibilities:**
  - Display error text
  - Allow dismissal

---

### **14. Footer Component**
- **Purpose:** Footer with info/help text
- **Props:** None
- **Content:**
  - "© 2026 LocalLLMTestGenBuddy"
  - Help text about supported providers
  - Link to design reference
- **Responsibilities:**
  - Provide context/help information

---

## **State Management Strategy**

### **Option 1: React Context (Recommended for simple app)**
- Create `TestCaseContext` to manage test cases
- Create `AppStateContext` for loading/error states
- Use `useContext` hook in components

### **Option 2: Props Drilling**
- Pass state down from App component
- Works for this small app size

### **Recommendation:** Use React Context for cleaner component structure

---

## **Styling Approach**

- **CSS Framework:** Tailwind CSS (utility-first)
- **Colors:** Based on design.png specifications
- **Responsive Design:**
  - Mobile: Stack vertically
  - Tablet: Optimize columns
  - Desktop: Full layout
- **Accessibility:**
  - Semantic HTML
  - ARIA labels where needed
  - Keyboard navigation support

---

## **Component File Structure**

```
src/
├── components/
│   ├── App.tsx
│   ├── Header.tsx
│   ├── InputPanel.tsx
│   │   ├── RequirementInput.tsx
│   │   ├── ProviderSelector.tsx
│   │   ├── ApiKeyInput.tsx
│   │   └── GenerateButton.tsx
│   ├── LoadingSpinner.tsx
│   ├── ResultsPanel.tsx
│   │   ├── TestCaseTable.tsx
│   │   │   └── TableRow.tsx
│   │   ├── ExportButton.tsx
│   │   └── ErrorMessage.tsx
│   └── Footer.tsx
├── types/
│   └── index.ts (TypeScript interfaces)
├── services/
│   └── api.ts (API calls)
├── styles/
│   └── global.css (Tailwind + custom CSS)
└── App.tsx
```

---

## **Interface Definitions (TypeScript)**

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
  provider: string;
  apiKey?: string;
  providerConfig?: {
    model?: string;
    temperature?: number;
  };
}

interface GenerateTestsResponse {
  success: boolean;
  testCases?: TestCase[];
  error?: string;
}
```
