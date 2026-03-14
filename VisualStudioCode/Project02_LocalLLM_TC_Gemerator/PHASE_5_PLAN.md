# Phase 5: Integration & Testing Plan

**Phase:** 5  
**Duration:** Verification + Integration  
**Status:** Starting  
**Date:** March 8, 2026

---

## **Phase 5 Objectives**

1. ✅ **Initialize Backend:** Install dependencies and verify functionality
2. ✅ **Test API Endpoints:** Verify all 3 endpoints work correctly
3. ✅ **Integrate Frontend:** Connect React frontend to Express backend
4. ✅ **End-to-End Testing:** Test complete user flow
5. ✅ **Verify CSV Export:** Ensure download functionality works
6. ✅ **Error Handling:** Test error scenarios

---

## **Deliverables**

| # | Task | Status | Verified |
|---|------|--------|----------|
| 1 | Backend dependencies installed | ⏳ | - |
| 2 | .env configured with providers | ⏳ | - |
| 3 | Backend server starts on 5000 | ⏳ | - |
| 4 | Health check endpoint works | ⏳ | - |
| 5 | Providers endpoint works | ⏳ | - |
| 6 | Generate test cases endpoint works | ⏳ | - |
| 7 | Frontend connects to backend | ⏳ | - |
| 8 | Full user flow works end-to-end | ⏳ | - |
| 9 | CSV export works | ⏳ | - |
| 10 | Error handling verified | ⏳ | - |

---

## **Part 1: Backend Initialization (5 min)**

### Task 1.1: Install Dependencies
```bash
cd backend
npm install
```
Expected: "added X packages"

### Task 1.2: Create .env File
```bash
cp .env.example .env
```

Configure `.env` with at least one provider:
```env
PORT=5000
NODE_ENV=development
OLLAMA_URL=http://localhost:11434
```

### Task 1.3: Start Backend
```bash
npm run dev
```
Expected: "Server running on port 5000"

---

## **Part 2: API Endpoint Testing (5 min)**

### Test 2.1: Health Check
```bash
curl http://localhost:5000/api/health
```
Expected: `{"status":"ok","timestamp":"...","version":"1.0.0"}`

### Test 2.2: List Providers
```bash
curl http://localhost:5000/api/providers
```
Expected: Array of 5 providers

### Test 2.3: Generate Test Cases
```bash
curl -X POST http://localhost:5000/api/generate-tests \
  -H "Content-Type: application/json" \
  -d '{"requirement":"User login","provider":"ollama","providerConfig":{"model":"llama2"}}'
```
Expected: Test cases array with 3-5 items

---

## **Part 3: Frontend Integration (5 min)**

### Task 3.1: Start Frontend
```bash
cd frontend
npm run dev
```
Expected: "Local: http://localhost:3000"

### Task 3.2: Open Browser
Navigate to: `http://localhost:3000`

### Task 3.3: Test UI Flow
1. Select provider from dropdown
2. Enter requirement (e.g., "User should be able to reset password")
3. Click "Generate Test Cases"
4. Verify test cases display in table
5. Click "Export to CSV" and verify download

---

## **Part 4: Error Testing (3 min)**

Test these error scenarios:

| Scenario | Expected Response |
|----------|-------------------|
| Empty requirement | 400 Bad Request |
| Invalid provider | 400 Bad Request |
| Missing API key (OpenAI) | 401 Unauthorized |
| Provider not running (Ollama) | 503 Service Unavailable |
| Very long requirement (>5000) | 400 Bad Request |

---

## **Part 5: Documentation & Wrap-up**

### Create Phase 5 Summary
- Record what was tested
- Document any issues found
- Verify all deliverables complete

### Update Progress Files
- progress.md - Mark Phase 5 complete
- context.md - Final project state

---

## **Success Criteria**

All of these must be true:
- ✅ Backend server starts without errors
- ✅ All 3 API endpoints respond
- ✅ At least 1 provider generates test cases
- ✅ Frontend displays test cases correctly
- ✅ CSV export downloads successfully
- ✅ Error handling shows appropriate messages
- ✅ Frontend ↔ Backend communication works

---

## **Tools Available During Testing**

| Tool | Use Case |
|------|----------|
| curl | Test API endpoints from CLI |
| Chrome DevTools | Debug frontend, inspect network |
| Terminal | Run servers and install packages |
| VS Code | Edit code if issues found |

---

## **Troubleshooting Guide (If Needed)**

### Backend won't start
- Check port 5000 is available: `netstat -ano | findstr :5000`
- Check .env syntax (no extra spaces)
- Check Node.js version: `node --version` (need 16+)

### "Connection refused" for Ollama
- Start Ollama: `ollama serve` (in another terminal)
- Pull model: `ollama pull llama2`
- Check URL in .env is correct

### Frontend can't reach backend
- Ensure backend is running on 5000
- Check CORS is enabled (should be by default)
- Open DevTools → Network tab → check /api calls

### Test cases not generating
- Check requirement text is entered
- Check provider is selected
- Check backend logs for errors
- Try different provider (Groq is fastest)

---

## **Notes**

- Backend code is 100% complete and tested for compilation
- Frontend code is 100% complete and ready to use
- Ollama/LM Studio are optional (can use API providers instead)
- API keys are not persisted (session-only)
- No database needed (stateless architecture)

---

## **Timeline**

| Task | Time | Cumulative |
|------|------|-----------|
| Install & Configure | 5 min | 5 min |
| Test Endpoints | 5 min | 10 min |
| Frontend Integration | 5 min | 15 min |
| Error Testing | 3 min | 18 min |
| Documentation | 2 min | 20 min |

**Total Phase 5 Time:** ~20 minutes

---

## **Next Phase (Phase 6)**

After successful integration testing:
- Production build setup
- Deployment configuration
- Performance optimization
- Final documentation

---

## **Checklist Before Starting**

- [ ] Backend code exists in `backend/` folder
- [ ] Frontend code exists in `frontend/` folder
- [ ] QUICKSTART_PHASE4.md is available
- [ ] Terminal access available
- [ ] Internet connection (for API providers)
- [ ] Port 5000 is available
- [ ] Port 3000 is available

---

## **Ready to Begin Phase 5 Testing?**

Starting with Backend Initialization...
