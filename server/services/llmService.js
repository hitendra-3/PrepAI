import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildStudySystemPrompt, buildStudyUserPrompt } from '../prompts/studyPrompt.js';
import { cleanRawJsonText, validateStudySetSchema } from '../validators/responseValidator.js';

/**
 * Calls Google Gemini LLM directly with structured JSON output enforcement
 */
export async function generateStudyMaterial({ input, mode, difficulty, count }) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    throw new Error('GEMINI_API_KEY is not configured in .env. Please provide a valid Gemini API key.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const prompt = buildStudyUserPrompt({ input, mode, difficulty, count });

  // Priority list of Gemini models
  const candidateModels = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.5-pro', 'gemini-2.5-flash-lite'];
  let lastError = null;

  for (const modelName of candidateModels) {
    try {
      console.log(`[LLM Service] Calling Gemini API (${modelName}) for input: "${input.slice(0, 60)}..."`);
      
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
        systemInstruction: buildStudySystemPrompt(),
      });

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      const cleanedText = cleanRawJsonText(responseText);
      if (!cleanedText) {
        throw new Error('Received empty response from Gemini API.');
      }

      let parsed;
      try {
        parsed = JSON.parse(cleanedText);
      } catch (parseErr) {
        console.error(`[LLM Service] JSON parse error on raw output from ${modelName}:`, responseText);
        throw new Error('Gemini API returned malformed JSON: ' + parseErr.message);
      }

      const validation = validateStudySetSchema(parsed);
      if (!validation.valid) {
        console.error(`[LLM Service] Schema validation failed for ${modelName}:`, validation.error);
        throw new Error('Gemini output schema validation failed: ' + validation.error);
      }

      console.log(`[LLM Service] ✅ Success via ${modelName}! Generated "${validation.data.title}" with ${validation.data.flashcards.length} flashcards and ${validation.data.quiz.length} quiz questions.`);
      return validation;
    } catch (err) {
      console.warn(`[LLM Service] Failed with model ${modelName}:`, err.message);
      lastError = err;
      // Continue to try next candidate model if it's a 404/not supported error
      if (err.message.includes('not found') || err.message.includes('404')) {
        continue;
      }
      // If it's another error (like auth or schema), fail immediately
      throw err;
    }
  }

  throw lastError || new Error('Failed to generate study materials with all configured Gemini models.');
}
