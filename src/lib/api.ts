import { GenerateRequest, StudySetData } from '../types/study';
import { validateResult } from './validateResult';

export class ApiError extends Error {
  code: string;
  statusCode?: number;

  constructor(message: string, code: string = 'API_ERROR', statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

/**
 * Calls backend /api/generate and validates structured JSON output
 */
export async function generateStudySetApi(
  params: GenerateRequest,
  signal?: AbortSignal
): Promise<StudySetData> {
  let response: Response;

  try {
    response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
      signal,
    });
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new ApiError('Request was cancelled.', 'ABORTED');
    }
    throw new ApiError(
      'Unable to connect to the backend server. Please verify the server is running.',
      'NETWORK_ERROR'
    );
  }

  let json: any;
  try {
    json = await response.json();
  } catch (err) {
    throw new ApiError(
      'Server returned invalid or non-JSON response.',
      'MALFORMED_JSON',
      response.status
    );
  }

  if (!response.ok) {
    throw new ApiError(
      json.error || `Server responded with status ${response.status}`,
      json.code || 'SERVER_ERROR',
      response.status
    );
  }

  // Frontend Schema Validation
  const validation = validateResult(json);
  if (!validation.valid) {
    throw new ApiError(
      `Frontend validation error: ${validation.error}`,
      'CLIENT_VALIDATION_FAILED'
    );
  }

  return validation.data;
}

/**
 * Check backend health status
 */
export async function checkBackendHealth(): Promise<{ status: string; hasApiKey: boolean }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return { status: 'error', hasApiKey: false };
    return await res.json();
  } catch {
    return { status: 'offline', hasApiKey: false };
  }
}
