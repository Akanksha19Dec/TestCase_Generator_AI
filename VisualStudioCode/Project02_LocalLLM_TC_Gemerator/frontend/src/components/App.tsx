import React, { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { InputPanel } from './InputPanel';
import { ResultsPanel } from './ResultsPanel';
import { LLMProvider, TestCase } from '../types';
import { apiClient } from '../services/api';

export const App: React.FC = () => {
  const [requirement, setRequirement] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<LLMProvider>('openai');
  const [apiKey, setApiKey] = useState('');
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateTestCases = async () => {
    if (!requirement.trim()) {
      setError('Please enter a requirement');
      return;
    }

    if (!selectedProvider) {
      setError('Please select a provider');
      return;
    }

    const providersRequiringKey: LLMProvider[] = ['openai', 'groq', 'claude'];
    if (providersRequiringKey.includes(selectedProvider) && !apiKey.trim()) {
      setError('Please enter an API key for the selected provider');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.generateTestCases({
        requirement,
        provider: selectedProvider,
        apiKey: apiKey || undefined,
        providerConfig: {
          temperature: 0.7,
        },
      });

      if (response.success && response.testCases) {
        setTestCases(response.testCases);
      } else {
        setError(response.error || 'Failed to generate test cases');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearError = () => {
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-6 py-12 max-w-4xl">
        <div className="space-y-8">
          {/* Input Section */}
          <InputPanel
            requirement={requirement}
            onRequirementChange={setRequirement}
            provider={selectedProvider}
            onProviderChange={setSelectedProvider}
            apiKey={apiKey}
            onApiKeyChange={setApiKey}
            onGenerate={handleGenerateTestCases}
            loading={loading}
          />

          {/* Results Section */}
          <ResultsPanel
            testCases={testCases}
            loading={loading}
            error={error}
            onErrorDismiss={handleClearError}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};
