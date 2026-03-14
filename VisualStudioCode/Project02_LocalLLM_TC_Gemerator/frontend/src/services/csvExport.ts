import Papa from 'papaparse';
import { TestCase } from '../types';

export const csvExport = {
  /**
   * Convert test cases array to CSV string
   */
  testCasesToCSV(testCases: TestCase[]): string {
    const headers = [
      'Test Case ID',
      'Title',
      'Preconditions',
      'Steps',
      'Expected Result',
      'Actual Result',
      'Status',
    ];

    const data = testCases.map((tc) => [
      tc.testCaseId,
      tc.title,
      tc.preconditions,
      tc.steps,
      tc.expectedResult,
      tc.actualResult,
      tc.status,
    ]);

    return Papa.unparse({
      fields: headers,
      data: data,
    });
  },

  /**
   * Download test cases as CSV file
   */
  downloadCSV(testCases: TestCase[], filename?: string): void {
    const csv = this.testCasesToCSV(testCases);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().slice(0, 10);
    const finalFilename = filename || `test_cases_${timestamp}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', finalFilename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
