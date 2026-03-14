/**
 * Base prompt template for test case generation
 */
export const BASE_PROMPT = `You are an expert QA engineer specializing in test case design.

Your task is to generate comprehensive test cases based on the user requirement provided below.

USER REQUIREMENT:
{REQUIREMENT}

Generate test cases that systematically cover:
1. Happy path (main functionality)
2. Edge cases and boundary conditions
3. Error scenarios
4. Input validation scenarios
5. State transitions if applicable

For EACH test case, provide the following information in valid JSON format:

Generate 3-5 test cases that comprehensively cover the requirement.

Return ONLY a valid JSON array with the following structure for each test case:
[
  {
    "testCaseId": "TC_001",
    "title": "Brief, descriptive test case name",
    "preconditions": "System state or prerequisites needed before executing this test",
    "steps": "Step 1: First action\\nStep 2: Second action\\nStep 3: Third action\\n...",
    "expectedResult": "What should happen after all steps are completed",
    "actualResult": "Pending",
    "status": "Not Executed"
  }
]

Rules:
- Generate between 3-5 test cases per requirement
- Test case IDs must follow pattern TC_001, TC_002, TC_003, etc.
- "actualResult" MUST always be set to "Pending"
- "status" MUST always be set to "Not Executed"
- Steps should be clear, numbered, and actionable (use \\n for line breaks)
- Titles should be concise (max 100 characters)
- Preconditions should describe necessary system state
- Expected results should be specific and testable
- Return ONLY valid JSON array, no markdown code blocks, no extra text
- Ensure all quotes in text are escaped properly for JSON`;

/**
 * Generate prompt with requirement
 */
export function generateBasePrompt(requirement: string): string {
  return BASE_PROMPT.replace('{REQUIREMENT}', requirement);
}
