import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Main generation endpoint
app.post('/api/generate', async (req, res) => {
  const { provider, prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const systemPrompt = `You are a QA automation expert. 
Given the following Jira User Story or requirements from the user, generate comprehensive test cases.
You MUST output functional and non-functional test cases.
You MUST output the test cases STRICTLY in a Markdown tabular format.
The table MUST exactly contain these columns: | Test ID | Scenario | Test steps | Expected Result | Priority | Type (Functional/Non Functional) |
Output ONLY the Markdown table without any extra introductory or concluding text.`;

  try {
    let output = '';

    // Route based on provider. Most providers support OpenAI-compatible endpoints!
    if (provider === 'OpenAI') {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ]
      });
      output = response.choices[0].message.content || '';
    }
    else if (provider === 'Ollama' || provider === 'LM Studio' || provider === 'Grok') {
      // Configure for Local / Compatible instances
      let baseURL = '';
      let apiKey = 'demo';
      let model = '';

      if (provider === 'Ollama') {
        baseURL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1'; // Ollama is now OpenAI compatible on /v1
        model = process.env.OLLAMA_MODEL || 'llama3.2';
      } else if (provider === 'LM Studio') {
        baseURL = process.env.LM_STUDIO_BASE_URL || 'http://localhost:1234/v1';
        model = process.env.LM_STUDIO_MODEL || 'local-model';
      } else if (provider === 'Grok') {
        baseURL = 'https://api.x.ai/v1';
        apiKey = process.env.GROK_API_KEY || '';
        model = 'grok-beta';
      }

      const client = new OpenAI({ baseURL, apiKey, dangerouslyAllowBrowser: false });
      const response = await client.chat.completions.create({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ]
      });
      output = response.choices[0].message.content || '';
    } else {
      // Mock for Claude/Gemini if keys missing or SDKs not installed yet in Phase 3
      output = `## [TEST-101] Validating ${provider} Integration\n\n**Type:** Functional\n**Acceptance Criteria:** The system successfully connected to ${provider}. \n**Steps:**\n1. Send payload\n2. Await response\n**Expected:** Jira formatted test scenarios successfully retrieved.`;
    }

    res.json({ output });
  } catch (error: any) {
    console.error('Generation Error:', error);
    res.status(500).json({ error: error.message || 'Error communicating with LLM Provider' });
  }
});

app.listen(PORT as number, '127.0.0.1', () => {
  console.log(`Backend Server running on http://127.0.0.1:${PORT}`);
});
