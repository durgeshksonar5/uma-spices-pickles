import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('gajanan_admin_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('gajanan_admin_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const res = await authApi.getProfile();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('gajanan_admin_user', JSON.stringify(res.data));
          }
        } catch (error) {
          if (error.isOffline) {
            console.log('[Auth] Backend server offline. Maintaining active offline admin session.');
          } else {
            logout();
          }
        }
      }
      setIsLoading(false);
    };

    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.data) {
        const { token: newToken, ...userData } = res.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('gajanan_admin_token', newToken);
        localStorage.setItem('gajanan_admin_user', JSON.stringify(userData));
        return res;
      }
      throw new Error(res.message || 'Login failed');
    } catch (err) {
      if (err.isOffline) {
        // Fallback login for offline preview when server is not started yet
        if (email.toLowerCase() === 'admin@gajananservices.com' && password === 'admin123') {
          const offlineUser = {
            _id: 'usr-admin-offline',
            name: 'Admin Gajanan (Offline Mode)',
            email: 'admin@gajananservices.com',
            role: 'superadmin'
          };
          const offlineToken = 'offline_admin_token_2026';
          setToken(offlineToken);
          setUser(offlineUser);
          localStorage.setItem('gajanan_admin_token', offlineToken);
          localStorage.setItem('gajanan_admin_user', JSON.stringify(offlineUser));
          return { success: true, isOfflineMode: true, message: 'Logged in via Offline Mode' };
        } else {
          throw new Error('Invalid email or password');
        }
      }
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('gajanan_admin_token');
    localStorage.removeItem('gajanan_admin_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
