import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getProfile } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      setUser(response.data);
    } catch (err) {
      console.error('Profile fetch failed', err);
      logout();
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await loginUser({ email, password });
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, phone, password, name) => {
    setLoading(true);
    try {
      await registerUser({ email, phone, password, name });
      return await login(email, password);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
