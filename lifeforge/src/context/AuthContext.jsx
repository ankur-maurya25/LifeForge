import React, { createContext, useContext, useState } from 'react';
import { loginApi, registerApi, getMeApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Pure React state per rules: strictly no localStorage in this step
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  /**
   * Login action handler
   */
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await loginApi({ email, password });
      setUser(data.user);
      setToken(data.token);
      setLoading(false);
      return { success: true, user: data.user, token: data.token };
    } catch (err) {
      setLoading(false);
      const msg = err.message || 'Login failed. Please check your credentials.';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  /**
   * Register action handler
   */
  const register = async ({ name, username, email, password }) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await registerApi({ name, username, email, password });
      setUser(data.user);
      setToken(data.token);
      setLoading(false);
      return { success: true, user: data.user, token: data.token };
    } catch (err) {
      setLoading(false);
      const msg = err.message || 'Registration failed. Please try again.';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  /**
   * Update current user in-memory state (e.g. after earning XP or leveling up)
   */
  const updateUser = (fields) => {
    setUser(prev => (prev ? { ...prev, ...fields } : prev));
  };

  /**
   * Logout handler
   * Clears state immediately and cleans up session in memory
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthError(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    loading,
    authError,
    setAuthError,
    login,
    register,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
