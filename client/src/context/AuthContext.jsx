import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { WhatsAppNotificationModal } from '../components/notifications/WhatsAppNotificationModal';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('replate_token') || null);
  const [loading, setLoading] = useState(true);
  const [whatsappNotification, setWhatsappNotification] = useState(null);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('replate_token');
      if (storedToken) {
        try {
          const res = await authAPI.getProfile();
          if (res.data?.success) {
            setUser(res.data.user);
          }
        } catch (error) {
          console.error('Session restoration failed:', error);
          localStorage.removeItem('replate_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const triggerWhatsAppAlert = (notification) => {
    if (notification && notification.message) {
      setWhatsappNotification(notification);
      setIsWhatsAppModalOpen(true);
    }
  };

  const closeWhatsAppAlert = () => {
    setIsWhatsAppModalOpen(false);
  };

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data?.success) {
      const { token: newToken, user: userData, whatsappNotification: waNotif } = res.data;
      localStorage.setItem('replate_token', newToken);
      setToken(newToken);
      setUser(userData);

      if (waNotif) {
        triggerWhatsAppAlert(waNotif);
      }

      return { success: true, user: userData, whatsappNotification: waNotif };
    }
    return { success: false, message: res.data?.message || 'Login failed' };
  };

  const register = async (formData) => {
    const res = await authAPI.register(formData);
    if (res.data?.success) {
      const { token: newToken, user: userData, whatsappNotification: waNotif } = res.data;
      localStorage.setItem('replate_token', newToken);
      setToken(newToken);
      setUser(userData);

      if (waNotif) {
        triggerWhatsAppAlert(waNotif);
      }

      return { success: true, user: userData, whatsappNotification: waNotif };
    }
    return { success: false, message: res.data?.message || 'Registration failed' };
  };

  const logout = () => {
    localStorage.removeItem('replate_token');
    setToken(null);
    setUser(null);
    setIsWhatsAppModalOpen(false);
    setWhatsappNotification(null);
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const res = await authAPI.getProfile();
      if (res.data?.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshProfile,
        setUser,
        whatsappNotification,
        triggerWhatsAppAlert,
        closeWhatsAppAlert,
      }}
    >
      {children}
      <WhatsAppNotificationModal
        isOpen={isWhatsAppModalOpen}
        onClose={closeWhatsAppAlert}
        notification={whatsappNotification}
      />
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
