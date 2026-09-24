/**
 * System and user prompts for PrepAI Study Assistant
 */

export function buildStudySystemPrompt() {
  return `You are PrepAI, an expert educational content generator.
Your job is to transform study notes or a topic into high-quality, structured learning materials consisting of flashcards and multiple-choice quizzes.

CRITICAL RULES:
1. Output ONLY valid JSON adhering strictly to the JSON schema below.
2. Do NOT output any markdown backticks (\`\`\`json or \`\`\`), conversational filler, or text before/after the JSON.
3. The response MUST be directly parseable by JSON.parse().
4. For Flashcards:
   - "question": clear, targeted question or concept to test.
   - "answer": concise, comprehensive answer.
   - "keyPoint": single core takeaway or mnemonic rule.
5. For Quiz:
   - "question": clear multiple-choice question.
   - "options": EXACTLY 4 plausible options as an array of strings.
   - "correctAnswer": 0-based integer index (0, 1, 2, or 3) indicating the single correct option.
   - "explanation": clear, educational explanation of why the correct option is right and others are incorrect.
6. "keyConcepts": an array of 3 to 6 key technical/conceptual terms covered.
7. Adapt the depth and nuance to the requested difficulty ("easy", "medium", "hard").
8. Ensure all generated items are accurate, educational, and free of hallucinations.`;
}

export function buildStudyUserPrompt({ input, mode, difficulty, count }) {
  const flashcardCount = mode === 'quiz' ? 0 : (mode === 'both' ? count : count);
  const quizCount = mode === 'flashcards' ? 0 : (mode === 'both' ? count : count);

  return `Generate learning material based on the following input:

---
INPUT TOPIC / NOTES:
${input}
---

PARAMETERS:
- Mode: ${mode} (Generate ${flashcardCount} flashcards and ${quizCount} quiz questions)
- Target Difficulty: ${difficulty} (easy = foundational definitions; medium = practical understanding & application; hard = deep analysis, edge cases, trade-offs)
- Target Count: ${count} items

JSON SCHEMA SPECIFICATION (Follow this exact shape):
{
  "title": "A concise, descriptive title for the study set (e.g. 'Mastering React Hooks')",
  "summary": "A high-level 2-3 sentence overview explaining what the student will learn from this set.",
  "keyConcepts": ["Concept 1", "Concept 2", "Concept 3", "Concept 4"],
  "flashcards": [
    {
      "id": "fc-1",
      "question": "Question text here",
      "answer": "Detailed answer text here",
      "keyPoint": "Key takeaway summary"
    }
  ],
  "quiz": [
    {
      "id": "qz-1",
      "question": "Quiz question text here",
      "options": [
        "Option A text",
        "Option B text",
        "Option C text",
        "Option D text"
      ],
      "correctAnswer": 0,
      "explanation": "Explanation of why Option A is correct."
    }
  ]
}

REMEMBER: Return pure JSON ONLY. No markdown codeblocks, no formatting wrappers.`;
}
