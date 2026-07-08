import { apiRequest, ApiError, setAccessToken } from './api';

export interface User {
  id: string;
  email: string;
  displayname: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export const signUpRequest = async (
  email: string,
  password: string,
  displayname: string
): Promise<AuthResult> => {
  try {
    const data = await apiRequest<{ user: User }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayname }),
    });
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: (error as ApiError).message };
  }
};

export const signInRequest = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  try {
    const data = await apiRequest<{ access_token: string; user: User }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
    setAccessToken(data.access_token);
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: (error as ApiError).message };
  }
};

export const logOutRequest = async (): Promise<void> => {
  try {
    await apiRequest('/api/auth/logout', { method: 'POST' });
  } finally {
    setAccessToken(null);
  }
};

export const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    const data = await apiRequest<{ user: User }>('/api/auth/me');
    return data.user;
  } catch {
    return null;
  }
};
