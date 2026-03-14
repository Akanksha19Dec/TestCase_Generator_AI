import React from 'react';
import { LLMProvider } from '../types';

interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  requirement: string;
  provider: LLMProvider;
  apiKey: string;
}

const PROVIDERS_REQUIRING_KEY: LLMProvider[] = ['openai', 'groq', 'claude'];

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  onClick,
  disabled,
  loading,
  requirement,
  provider,
  apiKey,
}) => {
  const isDisabled =
    disabled ||
    !requirement.trim() ||
    !provider ||
    (PROVIDERS_REQUIRING_KEY.includes(provider) && !apiKey.trim());

  return (
    <button
      onClick={onClick}
      disabled={isDisabled || loading}
      className={`w-full btn transition-all duration-200 ${
        isDisabled || loading ? 'btn-primary-disabled' : 'btn-primary'
      }`}
      aria-busy={loading}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="spinner w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Generating...
        </span>
      ) : (
        'Generate Test Cases'
      )}
    </button>
  );
};
