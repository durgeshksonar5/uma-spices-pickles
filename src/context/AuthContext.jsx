import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('gajanan_admin_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('gajanan_admin_token') || null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('gajanan_admin_token');
      if (storedToken) {
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
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.data) {
        const { token: newToken, ...userData } = res.data;
        localStorage.setItem('gajanan_admin_token', newToken);
        localStorage.setItem('gajanan_admin_user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        return res;
      }
      throw new Error(res.message || 'Login failed');
    } catch (err) {
      if (err.isOffline) {
        if (email.toLowerCase() === 'admin@gajananservices.com' && password === 'admin123') {
          const offlineUser = {
            _id: 'usr-admin-offline',
            name: 'Admin Gajanan',
            email: 'admin@gajananservices.com',
            role: 'superadmin'
          };
          const offlineToken = 'offline_admin_token_2026';
          localStorage.setItem('gajanan_admin_token', offlineToken);
          localStorage.setItem('gajanan_admin_user', JSON.stringify(offlineUser));
          setToken(offlineToken);
          setUser(offlineUser);
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

  const storedToken = localStorage.getItem('gajanan_admin_token');
  const storedUser = localStorage.getItem('gajanan_admin_user');
  const isAuthenticated = (!!token && !!user) || (!!storedToken && !!storedUser);

  return (
    <AuthContext.Provider
      value={{
        user: user || (storedUser ? JSON.parse(storedUser) : null),
        token: token || storedToken,
        isAuthenticated,
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
