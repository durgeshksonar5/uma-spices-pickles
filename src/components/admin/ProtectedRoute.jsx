import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AdminLogin } from '../../pages/admin/AdminLogin';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#9A6428] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-[#5E3718] font-serif">Verifying Admin Session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <Outlet />;
};
