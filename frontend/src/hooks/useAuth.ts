'use client';

import { useCallback, useState } from 'react';

import { login } from '../services/auth.service';
import type { AuthenticatedUser, LoginInput } from '../types/user';

const TOKEN_KEY = 'abaco.auth.token';

function readStoredToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(TOKEN_KEY);
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => readStoredToken());

  const loginUser = useCallback(async (credentials: LoginInput) => {
    const response = await login(credentials);
    window.localStorage.setItem(TOKEN_KEY, response.token);
    setToken(response.token);
    return response.token;
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  return {
    token,
    isAuthenticated: token !== null,
    login: loginUser,
    logout,
  };
}
