import React from 'react';
import { LLMProvider } from '../types';

interface ProviderSelectorProps {
  value: LLMProvider;
  onChange: (value: LLMProvider) => void;
}

const PROVIDERS: { value: LLMProvider; label: string; type: string }[] = [
  { value: 'ollama', label: 'Ollama (Local)', type: 'local' },
  { value: 'lmstudio', label: 'LM Studio (Local)', type: 'local' },
  { value: 'openai', label: 'OpenAI', type: 'api' },
  { value: 'groq', label: 'Groq', type: 'api' },
  { value: 'claude', label: 'Claude (Anthropic)', type: 'api' },
];

export const ProviderSelector: React.FC<ProviderSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div>
      <label htmlFor="provider" className="label label-required">
        Select LLM Provider
      </label>
      <select
        id="provider"
        value={value}
        onChange={(e) => onChange(e.target.value as LLMProvider)}
        className="input-base"
      >
        <option value="" disabled>
          Choose a provider...
        </option>
        {PROVIDERS.map((provider) => (
          <option key={provider.value} value={provider.value}>
            {provider.label}
            {provider.type === 'local' ? ' - No API key needed' : ' - Requires API key'}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-500 mt-2">
        {value &&
          (PROVIDERS.find((p) => p.value === value)?.type === 'local'
            ? '✓ Local provider - runs on your machine'
            : '* Requires API key from provider')}
      </p>
    </div>
  );
};
