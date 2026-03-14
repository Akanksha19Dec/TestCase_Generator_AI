import React from 'react';
import { TestCase } from '../types';

interface TableRowProps {
  testCase: TestCase;
}

export const TableRow: React.FC<TableRowProps> = ({ testCase }) => {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-4 py-3 text-sm font-medium text-gray-900">
        {testCase.testCaseId}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700 font-medium">
        {testCase.title}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <span className="line-clamp-2" title={testCase.preconditions}>
          {testCase.preconditions}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 whitespace-pre-wrap max-w-xs">
        <span className="line-clamp-3" title={testCase.steps}>
          {testCase.steps}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <span className="line-clamp-2" title={testCase.expectedResult}>
          {testCase.expectedResult}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
          {testCase.actualResult}
        </span>
      </td>
      <td className="px-4 py-3 text-sm">
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
            testCase.status === 'Not Executed'
              ? 'bg-gray-100 text-gray-800'
              : testCase.status === 'Passed'
              ? 'bg-success-100 text-success-800'
              : 'bg-danger-100 text-danger-800'
          }`}
        >
          {testCase.status}
        </span>
      </td>
    </tr>
  );
};
