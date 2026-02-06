import { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser, logoutUser } from '../api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (username, password) => {
    try {
      const result = await loginUser(username, password);
      localStorage.setItem('auth_token', result.token);
      setUser(result.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  };

  const register = async (username, password) => {
    try {
      const result = await registerUser(username, password);
      setUser(result.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
