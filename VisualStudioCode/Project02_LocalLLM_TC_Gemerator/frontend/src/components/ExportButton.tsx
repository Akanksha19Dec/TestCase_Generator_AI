import React from 'react';
import { TestCase } from '../types';
import { csvExport } from '../services/csvExport';

interface ExportButtonProps {
  testCases: TestCase[];
  disabled?: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  testCases,
  disabled = false,
}) => {
  const handleExport = () => {
    if (testCases.length > 0) {
      csvExport.downloadCSV(testCases);
    }
  };

  const isDisabled = disabled || testCases.length === 0;

  return (
    <button
      onClick={handleExport}
      disabled={isDisabled}
      className={`btn ${
        isDisabled ? 'btn-primary-disabled' : 'btn-secondary'
      }`}
      aria-label="Export test cases as CSV"
    >
      <span className="flex items-center gap-2">
        📥 Download as CSV
      </span>
    </button>
  );
};
