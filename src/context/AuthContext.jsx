import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // Mock initial users
  const initialUsers = [
    { username: 'student1', password: 'password', role: 'user' },
    { username: 'student2', password: 'password', role: 'user' },
    { username: 'teacher', password: 'password', role: 'admin' },
    { username: 'admin', password: 'password', role: 'admin' }
  ];

  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : initialUsers;
  });

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

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const login = (username, password) => {
    const foundUser = users.find(u => u.username === username);

    if (foundUser) {        
       const role = foundUser.role;
       const userData = {
         id: Date.now(),
         username: foundUser.username,
         role
       };
       setUser(userData);
       return { success: true };
    }
    return { success: false, message: 'Invalid username or password' };
  };

  const logout = () => {
    setUser(null);
  };

  const register = (username, password) => {
    if (users.find(u => u.username === username)) {
        return { success: false, message: 'Username already taken' };
    }

    const newUser = {
      username,
      password,
      role: 'user'
    };
    
    setUsers([...users, newUser]);
    
    const userData = {
      id: Date.now(),
      username,
      role: 'user'
    };
    setUser(userData);
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
