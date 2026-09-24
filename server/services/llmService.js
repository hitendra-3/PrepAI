import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildStudySystemPrompt, buildStudyUserPrompt } from '../prompts/studyPrompt.js';
import { cleanRawJsonText, validateStudySetSchema } from '../validators/responseValidator.js';

/**
 * Calls Google Gemini LLM with automatic multi-model failover and retry on server load/503
 */
export async function generateStudyMaterial({ input, mode, difficulty, count }) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    throw new Error('GEMINI_API_KEY is not configured in environment variables. Please add your Gemini API key in settings.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const prompt = buildStudyUserPrompt({ input, mode, difficulty, count });

  // Priority list of Gemini models to cycle through on high demand / 503 errors
  const candidateModels = [
    'gemini-2.5-flash',
    'gemini-flash-latest',
    'gemini-2.5-flash-lite',
    'gemini-2.5-pro',
    'gemini-pro-latest',
  ];

  let lastError = null;

  for (const modelName of candidateModels) {
    try {
      console.log(`[LLM Service] Attempting generation with model: ${modelName}`);

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

      console.log(`[LLM Service] ✅ Success via ${modelName}! Generated "${validation.data.title}" with ${validation.data.flashcards.length} cards & ${validation.data.quiz.length} questions.`);
      return validation;
    } catch (err) {
      console.warn(`[LLM Service] Model ${modelName} encountered an error:`, err.message);
      lastError = err;

      // If invalid API key authentication error (400/403 with API_KEY_INVALID), fail immediately
      if (err.message.includes('API_KEY_INVALID') || err.status === 401 || err.status === 403) {
        throw new Error('Invalid Gemini API Key provided. Please verify your GEMINI_API_KEY in environment settings.');
      }

      // If transient Google server error (503 Service Unavailable, 429 rate limit, 500 internal, 404 model not found)
      // seamlessly continue to the next model in candidateModels list!
      console.log(`[LLM Service] 🔄 Failing over to next candidate model...`);
      continue;
    }
  }

  // If all candidate models failed, give a clean user-facing error message
  const isHighDemand = lastError && (lastError.message.includes('503') || lastError.message.includes('high demand') || lastError.message.includes('429'));
  if (isHighDemand) {
    throw new Error('Google Gemini API is currently experiencing peak traffic across all models. Please click "Try Again" in a moment.');
  }

  throw lastError || new Error('Failed to generate study materials with available Gemini models.');
}
