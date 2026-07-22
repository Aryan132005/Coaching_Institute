import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Show a temporary message
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadUser = async () => {
    const token = localStorage.getItem('coaching_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await API.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      console.error('Error fetching user profile', err);
      localStorage.removeItem('coaching_token');
      localStorage.removeItem('coaching_user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      const { token, ...userData } = res.data;
      localStorage.setItem('coaching_token', token);
      localStorage.setItem('coaching_user', JSON.stringify(userData));
      setUser(userData);
      showToast('Logged in successfully!', 'success');
      return { success: true, user: userData };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed. Please check credentials.';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone, role = 'student') => {
    setLoading(true);
    try {
      const res = await API.post('/auth/register', { name, email, password, phone, role });
      const { token, ...userData } = res.data;
      localStorage.setItem('coaching_token', token);
      localStorage.setItem('coaching_user', JSON.stringify(userData));
      setUser(userData);
      showToast('Account registered successfully!', 'success');
      return { success: true, user: userData };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed.';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('coaching_token');
    localStorage.removeItem('coaching_user');
    setUser(null);
    showToast('Logged out successfully!', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        toast,
        showToast,
        setToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
