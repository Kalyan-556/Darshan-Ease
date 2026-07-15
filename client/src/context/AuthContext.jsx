import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth from localStorage on boot
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Optionally fetch fresh profile details in background
          const response = await api.get('/auth/profile');
          if (response.data.success) {
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
        } catch (err) {
          console.warn('Silent token validation failed:', err.message);
          // If 401 is thrown, the api interceptor will handle it
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen for logout events dispatched by api interceptor
    const handleLogoutEvent = () => {
      logout();
    };

    window.addEventListener('auth-logout', handleLogoutEvent);
    return () => {
      window.removeEventListener('auth-logout', handleLogoutEvent);
    };
  }, []);

  const login = async (email, password, rememberMe) => {
    const response = await api.post('/auth/login', { email, password, rememberMe });
    if (response.data.success) {
      const { user: userData, accessToken, refreshToken } = response.data;
      setUser(userData);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, message: response.data.message || 'Login failed.' };
  };

  const signup = async (name, email, phone, password, role) => {
    const response = await api.post('/auth/register', { name, email, phone, password, role });
    if (response.data.success) {
      const { user: userData, accessToken, refreshToken } = response.data;
      setUser(userData);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, message: response.data.message || 'Registration failed.' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  const updateProfile = async (formData) => {
    // If formData contains a file upload, use multipart/form-data config
    const headers = formData instanceof FormData 
      ? { 'Content-Type': 'multipart/form-data' } 
      : { 'Content-Type': 'application/json' };

    const response = await api.put('/auth/profile', formData, { headers });
    if (response.data.success) {
      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    }
    return { success: false, message: response.data.message || 'Profile update failed.' };
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
