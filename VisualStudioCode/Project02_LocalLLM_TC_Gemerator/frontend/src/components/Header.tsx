import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 py-6">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🧪</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              LocalLLMTestGenBuddy
            </h1>
            <p className="text-sm text-gray-600">
              Generate Test Cases from Requirements
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
