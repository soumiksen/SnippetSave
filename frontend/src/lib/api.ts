import { API_BASE_URL } from './config';

// Kept in memory only (never localStorage/sessionStorage) so it isn't
// readable by an XSS payload. The refresh token that backs it lives in an
// HttpOnly cookie the browser manages on its own.
let accessToken: string | null = null;

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

export const getAccessToken = (): string | null => accessToken;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function extractErrorMessage(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (Array.isArray(data.errors)) return data.errors.join(' ');
    if (typeof data.error === 'string') return data.error;
  } catch {
    // response had no JSON body
  }
  return 'An unexpected error occurred. Please try again.';
}

// The refresh endpoint rotates the token on every call, so two concurrent
// callers (e.g. React StrictMode's double-effect, or two components hitting
// a 401 at once) racing separate requests would have the loser present an
// already-rotated-out token — tripping the server's reuse-detection and
// revoking the session the winner just established. Sharing one in-flight
// promise means concurrent callers await the same request instead of racing.
let refreshPromise: Promise<boolean> | null = null;

export const refreshAccessToken = (): Promise<boolean> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) {
        setAccessToken(null);
        return false;
      }
      const data = await res.json();
      setAccessToken(data.access_token);
      return true;
    } catch {
      setAccessToken(null);
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

async function rawFetch(path: string, options: RequestInit): Promise<Response> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });
}

/**
 * Fetch wrapper that attaches the access token and transparently retries
 * once via a refreshed token when the server reports the token has expired.
 */
async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  let res = await rawFetch(path, options);

  if (res.status === 401 && path !== '/api/auth/refresh') {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      res = await rawFetch(path, options);
    }
  }

  return res;
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await apiFetch(path, options);

  if (!res.ok) {
    throw new ApiError(await extractErrorMessage(res), res.status);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json();
}
