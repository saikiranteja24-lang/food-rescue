import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Wraps any route that requires the user to be authenticated.
 * Redirects to /login with the current path as `?next=` so the user
 * is sent back after a successful login.
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // While the auth context is restoring a session from localStorage, render nothing
  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 p-1 border border-brand-500/20 shadow-lg overflow-hidden">
            <img src="/logo.png" alt="Replate" className="w-full h-full object-contain" />
          </div>
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ next: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;
