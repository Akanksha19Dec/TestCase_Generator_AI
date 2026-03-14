import React from 'react';
import { TestCase } from '../types';
import { TableRow } from './TableRow';

interface TestCaseTableProps {
  testCases: TestCase[];
}

export const TestCaseTable: React.FC<TestCaseTableProps> = ({ testCases }) => {
  if (testCases.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          No test cases generated yet. Generate test cases to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table-standard w-full">
        <thead>
          <tr>
            <th className="bg-gray-50">Test Case ID</th>
            <th className="bg-gray-50">Title</th>
            <th className="bg-gray-50">Preconditions</th>
            <th className="bg-gray-50">Steps</th>
            <th className="bg-gray-50">Expected Result</th>
            <th className="bg-gray-50">Actual Result</th>
            <th className="bg-gray-50">Status</th>
          </tr>
        </thead>
        <tbody>
          {testCases.map((testCase) => (
            <TableRow key={testCase.testCaseId} testCase={testCase} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
