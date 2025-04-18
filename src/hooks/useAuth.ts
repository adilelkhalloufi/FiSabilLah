import { useState, useEffect, useCallback } from 'react';
import { authService, LoginCredentials, RegisterData } from '../services/authService';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(authService.isAuthenticated());
  const [user, setUser] = useState<any>(authService.getUserData());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsLoggedIn(!!userData);
      setError(null);
    } catch (err) {
      setError('Failed to verify authentication status');
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsLoggedIn(true);
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(data);
      setUser(response.user);
      setIsLoggedIn(true);
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setIsLoggedIn(false);
      setError(null);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Logout failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return {
    user,
    isLoggedIn,
    loading,
    error,
    login,
    register,
    logout,
    checkAuthStatus
  };
}

export default useAuth;
