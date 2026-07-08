'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { refreshAccessToken } from '@/lib/api';
import {
  User,
  fetchCurrentUser,
  logOutRequest,
  signInRequest,
  signUpRequest,
} from '@/lib/auth';

interface AuthActionResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthActionResult>;
  signUp: (
    email: string,
    password: string,
    displayname: string
  ) => Promise<AuthActionResult>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  logOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // The access token only lives in memory, so a hard refresh loses it —
    // recover the session from the HttpOnly refresh-token cookie instead.
    const restoreSession = async () => {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        setUser(await fetchCurrentUser());
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await signInRequest(email, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return { success: result.success, error: result.error };
  };

  const signUp = async (
    email: string,
    password: string,
    displayname: string
  ) => {
    const result = await signUpRequest(email, password, displayname);
    if (!result.success) {
      return { success: false, error: result.error };
    }

    // Signup doesn't establish a session by itself, so log in right after to
    // match the "create account and land in the app" flow.
    const loginResult = await signInRequest(email, password);
    if (loginResult.success && loginResult.user) {
      setUser(loginResult.user);
      return { success: true };
    }
    return {
      success: false,
      error: loginResult.error || 'Account created, but sign in failed.',
    };
  };

  const logOut = async () => {
    await logOutRequest();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
