import React from 'react';
import { LLMProvider } from '../types';

interface ApiKeyInputProps {
  provider: LLMProvider;
  value: string;
  onChange: (value: string) => void;
}

const PROVIDERS_REQUIRING_KEY: LLMProvider[] = ['openai', 'groq', 'claude'];

const getProviderLabel = (provider: LLMProvider): string => {
  const labels: Record<LLMProvider, string> = {
    ollama: 'Ollama API Key',
    lmstudio: 'LM Studio API Key',
    openai: 'OpenAI API Key',
    groq: 'Groq API Key',
    claude: 'Claude API Key',
  };
  return labels[provider];
};

const getPlaceholder = (provider: LLMProvider): string => {
  const placeholders: Record<LLMProvider, string> = {
    ollama: 'Not required (local)',
    lmstudio: 'Not required (local)',
    openai: 'sk-...',
    groq: 'gsk_...',
    claude: 'sk-ant-...',
  };
  return placeholders[provider];
};

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({
  provider,
  value,
  onChange,
}) => {
  const isRequired = PROVIDERS_REQUIRING_KEY.includes(provider);

  if (!isRequired) {
    return null;
  }

  return (
    <div>
      <label htmlFor="apiKey" className="label label-required">
        {getProviderLabel(provider)}
      </label>
      <input
        id="apiKey"
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={getPlaceholder(provider)}
        className="input-base"
      />
      <p className="text-xs text-gray-500 mt-2">
        Your API key is used only for this session and never stored.
      </p>
    </div>
  );
};
