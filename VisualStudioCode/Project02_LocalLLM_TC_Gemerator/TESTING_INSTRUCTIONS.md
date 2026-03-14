# Phase 5 Complete! 🎉 - Ready for Testing Instructions

**Status:** ✅ Both servers running and integrated  
**Backend:** http://localhost:5000 (Express.js)  
**Frontend:** http://localhost:3000 (React)  

---

## **What's Ready**

- ✅ Backend server with 5 LLM providers (Ollama, LM Studio, OpenAI, Groq, Claude)
- ✅ Frontend React app with UI for requirements input
- ✅ Full integration - frontend communicates with backend
- ✅ API endpoints verified (health, providers, generate-tests)
- ✅ CORS configured for localhost communication

---

## **How to Test (Next Steps)**

### **Step 1: Open the Application**

**In browser, navigate to:**
```
http://localhost:3000
```

You should see:
- Header: "LocalLLMTestGenBuddy"
- Input section with fields for requirement and provider selection
- Empty results panel below

### **Step 2: Prepare a Provider (Choose One)**

**Option A: Use Ollama (Recommended for Local Testing)**
1. Download from https://ollama.ai
2. Run: `ollama serve` (in new terminal)
3. Pull a model: `ollama pull llama2` (wait for download)
4. Model ready on http://localhost:11434

**Option B: Use LM Studio**
1. Download from https://lmstudio.ai
2. Load a model in the UI
3. Start local inference server
4. Backend will connect to localhost:1234

**Option C: Use API Provider (Groq - Cheapest/Fastest)**
1. Sign up at https://console.groq.com
2. Get API key (free tier available)
3. In frontend, paste key when selecting Groq provider
4. Ready to test

**Option D: Use OpenAI or Claude**
1. Get API keys from respective platforms
2. Paste into frontend when selecting provider
3. Requires paid API accounts

### **Step 3: Test Full User Flow**

**In the frontend (http://localhost:3000):**

1. **Enter Requirement:**
   ```
   "User should be able to reset their password using their email address"
   ```
   - Character counter shows progress
   - Must be 10-5000 characters

2. **Select Provider:**
   - Click dropdown under "LLM Provider"
   - Choose your provider (Ollama, LM Studio, Groq, etc.)

3. **Enter API Key (If API Provider):**
   - If you selected Groq/OpenAI/Claude, a password field appears
   - Paste your API key
   - Key is NOT saved (session only)

4. **Click "Generate Test Cases":**
   - Button disables
   - Spinner appears
   - Wait for LLM to generate (5-30 seconds depending on provider)

5. **View Results:**
   - Table appears with 3-5 test cases
   - Columns: ID | Title | Preconditions | Steps | Expected Result | Actual Result | Status

6. **Export to CSV:**
   - Click "Export to CSV" button
   - File downloads as `test_cases.csv`
   - Open in Excel/Sheets to verify format

### **Step 4: Test Error Scenarios**

**Invalid Requirement (Too Short):**
1. Enter: "Login"
2. Try to generate → Should show error: "Requirement must be at least 10 characters"

**Missing API Key:**
1. Select Groq provider
2. Don't enter API key
3. Click Generate → Should show error about missing key

**Provider Not Running:**
1. Select Ollama (without running ollama serve)
2. Click Generate → Should show: "Service Unavailable - Check if provider is running"

**Very Long Requirement:**
1. Enter 5001+ characters
2. Try to generate → Should show validation error

---

## **What You Should See**

### **Success Scenario (Groq Provider)**

**Input:**
```
Requirement: "User should be able to login with email and password"
Provider: Groq
API Key: [pasted from console.groq.com]
```

**Output (After 1-3 seconds):**
```
Test Case 1:
- ID: TC_001
- Title: "Login with valid email and password"
- Preconditions: "User has valid account"
- Steps: "1. Navigate to login\n2. Enter email\n3. Enter password\n4. Click Login"
- Expected: "User logged in successfully"
- Actual: "Pending"
- Status: "Not Executed"

Test Case 2:
- ID: TC_002
- Title: "Login with invalid email"
- ...

Test Case 3:
- ID: TC_003
- Title: "Login with empty password"
- ...
```

**CSV Export:**
Opens download with all test cases in tabular format

### **Error Scenario**

If you select Ollama without running it:
```
Error Message:
"Failed to generate test cases: Service Unavailable"
"Make sure your provider is running and accessible"
```

---

## **Troubleshooting**

### **Frontend shows blank page**
- Check if http://localhost:3000 loads in browser
- Check console for errors (F12 → Console tab)
- Restart frontend: `npm run dev` in frontend folder

### **"Connection refused" error**
- Verify backend is running: `http://localhost:5000/api/health`
- If not working, restart: `npm start` in backend folder
- Check both ports are available

### **Provider not found error**
- For Ollama: Make sure `ollama serve` is running in separate terminal
- For API: Verify API key is correct format (sk-... for OpenAI, gsk_... for Groq)
- For LM Studio: Ensure it's running and server is started

### **Test generation takes very long (>60s)**
- Local providers (Ollama, LM Studio) are slower - normal
- Groq is much faster (1-3 seconds) - recommended
- Some models might be slower - try different one

### **CSV download not working**
- Check browser's download folder
- Allow popups if browser blocked it
- Try with different provider

---

## **Test Checklist**

Complete these to verify full functionality:

- [ ] Frontend loads at http://localhost:3000
- [ ] Provider dropdown shows all 5 options
- [ ] Can type in requirement field
- [ ] Error shows when requirement < 10 chars
- [ ] Error shows when requirement > 5000 chars
- [ ] API key field appears for Groq/OpenAI/Claude
- [ ] Generate button disables during request
- [ ] Loading spinner displays
- [ ] Test cases display in table (3-5 rows)
- [ ] Table has 7 columns (ID, Title, Preconditions, Steps, Expected, Actual, Status)
- [ ] CSV export button downloads file
- [ ] CSV opens correctly in Excel/Sheets
- [ ] Error handling works (provider down, invalid key, etc.)

**Expected Pass Rate:** 13/13 ✅

---

## **Performance Expectations**

| Provider | Speed | Cost | Recommendation |
|----------|-------|------|-----------------|
| **Groq** | ⚡ 1-3s | Cheap | **BEST for testing** |
| OpenAI | 🚗 2-5s | $$ | Good quality |
| Claude | 🚗 3-8s | $ | Excellent quality |
| LM Studio | 🐢 5-30s | Free | Local/private |
| Ollama | 🐢 5-30s | Free | Local/private |

**Recommendation:** Use Groq for fastest testing. Sign up at https://console.groq.com (free tier available).

---

## **Architecture Verification**

When you use the app, here's what happens behind the scenes:

```
1. You enter requirement in React form
2. You select provider and click "Generate"
3. Frontend (React) sends POST to http://localhost:3000/api/generate-tests
4. Vite proxy forwards to http://localhost:5000/api/generate-tests (backend)
5. Backend validates request, creates provider client
6. Backend sends request to LLM provider (local or API)
7. LLM generates test cases in JSON
8. Backend parses and validates JSON
9. Backend returns test cases to frontend
10. Frontend renders table with results
11. You click "Export to CSV"
12. PapaParse converts table to CSV
13. Browser downloads file
```

**Key Points:**
- Frontend never talks to LLM directly (all goes through backend)
- API keys never stored (session only)
- Request validated before and after LLM call
- CORS enabled for localhost:3000 to localhost:5000

---

## **Both Servers Running**

Verify both are running (keep terminals open):

**Terminal 1 (Backend):**
```
cd backend
npm start
# Should show no errors, listening on 5000
```

**Terminal 2 (Frontend):**
```
cd frontend
npm run dev
# Should show "VITE ready in X ms"
```

**Terminal 3 (Test Your Provider - Optional):**
```
ollama serve
# OR LM Studio (launched via UI)
# OR just use API provider
```

---

## **Files You Can Inspect**

For reference while testing:

**Backend Code:**
- `backend/src/server.ts` - Express setup
- `backend/src/routes/testGeneration.ts` - API endpoints
- `backend/src/services/testCaseGenerator.ts` - Main logic

**Frontend Code:**
- `frontend/src/App.tsx` - Main component
- `frontend/src/context/AppContext.tsx` - State management
- `frontend/src/services/api.ts` - Axios client

**Documentation:**
- `PHASE_5_TESTING_REPORT.md` - Full test results
- `backend/SETUP.md` - Backend setup guide
- `frontend/SETUP.md` - Frontend setup guide

---

## **Support Information**

### **Quick Reference**

| Issue | Solution |
|-------|----------|
| Server won't start | Check port availability: `netstat -ano \| findstr :5000` |
| CORS error | Verify backend CORS allows localhost:3000 |
| API key not working | Check format: `sk-...` for OpenAI, `gsk_...` for Groq, `sk-ant-...` for Claude |
| Slow generation | Switch to Groq (fastest), or ensure local provider is running |
| CSV not downloading | Try different provider, check browser settings |

### **Ports**
- Backend: 5000
- Frontend: 3000
- Ollama: 11434
- LM Studio: 1234

### **API Reference**

Health check:
```bash
curl http://localhost:5000/api/health
```

Get providers:
```bash
curl http://localhost:5000/api/providers
```

Generate test cases (example - Groq):
```bash
curl -X POST http://localhost:5000/api/generate-tests \
  -H "Content-Type: application/json" \
  -d '{"requirement":"User login","provider":"groq","apiKey":"gsk_...","providerConfig":{"model":"mixtral-8x7b-32768"}}'
```

---

## **Summary**

✅ **Infrastructure Complete**
- Backend compiled and running
- Frontend built and running
- APIs verified responding
- Integration working

✅ **Ready for Testing**
- Open http://localhost:3000
- Select provider (Groq recommended)
- Enter requirement
- Generate test cases
- Export to CSV

✅ **Error Handling Ready**
- Validation on all inputs
- Graceful error messages
- Provider fallback handling

---

## **Next Phase (After UAT)**

Once you've tested the full flow:
1. Phase 6: Production deployment
2. Optimization and performance tuning
3. Final documentation
4. Project completion

---

## **Questions or Issues?**

1. Check PHASE_5_TESTING_REPORT.md for detailed results
2. Check backend/SETUP.md for backend-specific issues
3. Check frontend/SETUP.md for frontend-specific issues
4. Review error logs in browser console (F12)
5. Review backend logs in terminal

---

**Ready to test? Open http://localhost:3000 in your browser! 🚀**
