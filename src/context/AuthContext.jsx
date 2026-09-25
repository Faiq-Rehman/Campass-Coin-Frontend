import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import adminService from '../services/adminService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('campus_coin_token') || null);
  const [admin, setAdmin] = useState(null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('campus_coin_admin_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify student & admin sessions on mount
  useEffect(() => {
    const initializeAuth = async () => {
      // 1. Verify student session if token exists
      const savedToken = localStorage.getItem('campus_coin_token');
      if (savedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.data) {
            setUser(res.data);
            setToken(savedToken);
          } else {
            localStorage.removeItem('campus_coin_token');
            setUser(null);
            setToken(null);
          }
        } catch (err) {
          // Token expired or invalid
          localStorage.removeItem('campus_coin_token');
          setUser(null);
          setToken(null);
        }
      }

      // 2. Restore admin session if token exists
      const savedAdminToken = localStorage.getItem('campus_coin_admin_token');
      const savedAdminUser = localStorage.getItem('campus_coin_admin_user');
      if (savedAdminToken && savedAdminUser) {
        try {
          setAdmin(JSON.parse(savedAdminUser));
          setAdminToken(savedAdminToken);
        } catch (e) {
          localStorage.removeItem('campus_coin_admin_token');
          localStorage.removeItem('campus_coin_admin_user');
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Student Login
  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.success && res.data) {
      const { user: userData, token: userToken } = res.data;
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('campus_coin_token', userToken);
      localStorage.setItem('campus_coin_user', JSON.stringify(userData));
    }
    return res;
  };

  // Student Register
  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.success && res.data) {
      const { user: newUser, token: userToken } = res.data;
      setUser(newUser);
      setToken(userToken);
      localStorage.setItem('campus_coin_token', userToken);
      localStorage.setItem('campus_coin_user', JSON.stringify(newUser));
    }
    return res;
  };

  // Student Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('campus_coin_token');
    localStorage.removeItem('campus_coin_user');
  };

  // Update Student Profile State
  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('campus_coin_user', JSON.stringify(next));
      return next;
    });
  };

  // Administrator Login
  const loginAdmin = async (username, password) => {
    const res = await adminService.login({ username, password });
    if (res.success && res.data) {
      const { admin: adminData, token: admToken } = res.data;
      setAdmin(adminData);
      setAdminToken(admToken);
      localStorage.setItem('campus_coin_admin_token', admToken);
      localStorage.setItem('campus_coin_admin_user', JSON.stringify(adminData));
    }
    return res;
  };

  // Administrator Logout
  const logoutAdmin = () => {
    setAdmin(null);
    setAdminToken(null);
    localStorage.removeItem('campus_coin_admin_token');
    localStorage.removeItem('campus_coin_admin_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        admin,
        adminToken,
        loading,
        isAuthenticated: !!user && !!token,
        isAdminAuthenticated: !!admin && !!adminToken,
        login,
        register,
        logout,
        updateUser,
        loginAdmin,
        logoutAdmin
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
