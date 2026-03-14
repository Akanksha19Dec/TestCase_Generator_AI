import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            © 2026 LocalLLMTestGenBuddy. All rights reserved.
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>
              Supported Providers: Ollama, LM Studio, OpenAI, Groq, Claude
            </p>
            <p>For help, refer to design specifications</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
