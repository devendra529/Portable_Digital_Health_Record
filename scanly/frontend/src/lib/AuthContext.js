'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('scanly_token');
    const savedUser = localStorage.getItem('scanly_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        api.get('/auth/me').then(res => {
          setUser(res.data.user);
          localStorage.setItem('scanly_user', JSON.stringify(res.data.user));
        }).catch(() => {
          localStorage.removeItem('scanly_token');
          localStorage.removeItem('scanly_user');
          setUser(null);
        });
      } catch { setUser(null); }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('scanly_token', res.data.token);
    localStorage.setItem('scanly_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const signup = async (data) => {
    const res = await api.post('/auth/signup', data);
    localStorage.setItem('scanly_token', res.data.token);
    localStorage.setItem('scanly_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('scanly_token');
    localStorage.removeItem('scanly_user');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('scanly_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
