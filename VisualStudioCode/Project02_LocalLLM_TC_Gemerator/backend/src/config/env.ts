import dotenv from 'dotenv';

dotenv.config();

export const config = {
  server: {
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  
  ollama: {
    url: process.env.OLLAMA_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'llama2',
  },
  
  lmStudio: {
    url: process.env.LM_STUDIO_URL || 'http://localhost:1234',
    model: process.env.LM_STUDIO_MODEL || 'default',
  },
  
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
  },
  
  groq: {
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL || 'mixtral-8x7b-32768',
  },
  
  claude: {
    apiKey: process.env.CLAUDE_API_KEY,
    model: process.env.CLAUDE_MODEL || 'claude-3-opus-20240229',
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

// Validate critical config
if (config.server.nodeEnv === 'production') {
  const requiredKeys = ['OPENAI_API_KEY', 'GROQ_API_KEY', 'CLAUDE_API_KEY'];
  const missingKeys = requiredKeys.filter((key) => !process.env[key]);
  if (missingKeys.length > 0) {
    console.warn(`Missing environment variables: ${missingKeys.join(', ')}`);
  }
}
