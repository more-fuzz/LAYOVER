/**
 * Client-side API fetch helper for Trails & Tales ("Field Guide, After Dark").
 * - Enforces same-origin requests with timeout (10s)
 * - Safe JSON parsing that never throws on non-JSON payloads
 * - Sanitizes server error messages, eliminating technical jargon, SQL, and stack traces
 */

export interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  data: T | null;
  message: string;
}

const FALLBACK_ERRORS: Record<number, string> = {
  401: 'Please log in to continue.',
  403: "You don't have access to that.",
  404: "We couldn't find that.",
};

const DEFAULT_NETWORK_ERROR =
  "We can't reach the trail right now. Check your connection and try again.";
const DEFAULT_SERVER_ERROR = 'Something went wrong on our side. Please try again.';

export function sanitizeErrorMessage(raw: string | undefined | null, status: number): string {
  if (!raw || typeof raw !== 'string') {
    return FALLBACK_ERRORS[status] || (status >= 500 ? DEFAULT_SERVER_ERROR : DEFAULT_NETWORK_ERROR);
  }

  const trimmed = raw.trim();

  // Reject long strings or technical stack traces
  if (trimmed.length > 160) {
    return FALLBACK_ERRORS[status] || (status >= 500 ? DEFAULT_SERVER_ERROR : DEFAULT_NETWORK_ERROR);
  }

  const lower = trimmed.toLowerCase();
  const technicalIndicators = [
    'at ',
    'error:',
    'exception',
    'sql',
    'supabase',
    'osrm',
    'postgres',
    'prisma',
    'column',
    'relation',
    'syntax error',
    'econnrefused',
    'fetch failed',
    'status: 500',
    'status: 502',
    'status: 503',
  ];

  if (technicalIndicators.some((tech) => lower.includes(tech))) {
    return FALLBACK_ERRORS[status] || (status >= 500 ? DEFAULT_SERVER_ERROR : DEFAULT_NETWORK_ERROR);
  }

  return trimmed;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(endpoint, {
      ...options,
      credentials: 'same-origin',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    clearTimeout(timeoutId);

    let parsedData: any = null;
    let message = '';

    try {
      const text = await res.text();
      if (text) {
        parsedData = JSON.parse(text);
      }
    } catch {
      // Non-JSON response
      parsedData = null;
    }

    if (parsedData && typeof parsedData === 'object') {
      message = parsedData.message || parsedData.error || '';
    }

    const sanitizedMsg = sanitizeErrorMessage(message, res.status);

    return {
      ok: res.ok,
      status: res.status,
      data: parsedData?.data ?? (parsedData && !parsedData.message ? parsedData : null),
      message: sanitizedMsg,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    const isTimeout = err.name === 'AbortError';
    return {
      ok: false,
      status: isTimeout ? 408 : 0,
      data: null,
      message: isTimeout
        ? 'The request took too long. Please check your connection and try again.'
        : DEFAULT_NETWORK_ERROR,
    };
  }
}
