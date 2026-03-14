import React from 'react';
import { TestCase } from '../types';
import { TestCaseTable } from './TestCaseTable';
import { ExportButton } from './ExportButton';
import { ErrorMessage } from './ErrorMessage';
import { LoadingSpinner } from './LoadingSpinner';

interface ResultsPanelProps {
  testCases: TestCase[];
  loading: boolean;
  error: string | null;
  onErrorDismiss: () => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  testCases,
  loading,
  error,
  onErrorDismiss,
}) => {
  return (
    <div className="card space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Generated Test Cases
        </h2>
      </div>

      {error && (
        <ErrorMessage message={error} onDismiss={onErrorDismiss} />
      )}

      <LoadingSpinner visible={loading} message="Generating test cases..." />

      {testCases.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {testCases.length} test case(s) generated
            </p>
          </div>

          <TestCaseTable testCases={testCases} />

          <div className="flex justify-end pt-4">
            <ExportButton testCases={testCases} />
          </div>
        </div>
      )}

      {!loading && testCases.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No test cases yet. Fill in the form and generate test cases to get started.
          </p>
        </div>
      )}
    </div>
  );
};
