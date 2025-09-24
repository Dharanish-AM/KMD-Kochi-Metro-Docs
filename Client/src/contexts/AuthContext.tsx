import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, getUser, clearAuthData } from '../Utils/Auth/token';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const getUserFromToken = (token: string): User | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      _id: payload.userId || payload.id,
      name: payload.name || '',
      email: payload.email || '',
      role: payload.role || '',
      department: payload.department
    };
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const logout = () => {
    clearAuthData();
    setUser(null);
    setToken(null);
    window.location.href = '/login';
  };

  const checkAuth = (): boolean => {
    const storedToken = getToken();
    if (!storedToken || isTokenExpired(storedToken)) {
      logout();
      return false;
    }
    return true;
  };

  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getUser();
    
    if (storedToken && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      const tokenUser = getUserFromToken(storedToken);
      setUser(tokenUser || storedUser);
    } else if (storedToken) {
      logout();
    }
  }, []);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'Admin';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      isAdmin,
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};