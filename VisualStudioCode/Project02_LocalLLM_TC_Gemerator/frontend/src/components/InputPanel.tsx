import React from 'react';
import { LLMProvider } from '../types';
import { RequirementInput } from './RequirementInput';
import { ProviderSelector } from './ProviderSelector';
import { ApiKeyInput } from './ApiKeyInput';
import { GenerateButton } from './GenerateButton';

interface InputPanelProps {
  requirement: string;
  onRequirementChange: (value: string) => void;
  provider: LLMProvider;
  onProviderChange: (value: LLMProvider) => void;
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  onGenerate: () => void;
  loading: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  requirement,
  onRequirementChange,
  provider,
  onProviderChange,
  apiKey,
  onApiKeyChange,
  onGenerate,
  loading,
}) => {
  return (
    <div className="card space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Create Test Cases
        </h2>
      </div>

      <RequirementInput value={requirement} onChange={onRequirementChange} />

      <ProviderSelector value={provider} onChange={onProviderChange} />

      <ApiKeyInput provider={provider} value={apiKey} onChange={onApiKeyChange} />

      <GenerateButton
        onClick={onGenerate}
        disabled={loading}
        loading={loading}
        requirement={requirement}
        provider={provider}
        apiKey={apiKey}
      />
    </div>
  );
};
