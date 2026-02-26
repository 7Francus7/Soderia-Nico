import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

interface AuthContextType {
       token: string | null;
       login: (token: string, username: string) => void;
       logout: () => void;
       isAuthenticated: boolean;
       username: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
       const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
       const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));

       const login = (newToken: string, newUsername: string) => {
              localStorage.setItem('token', newToken);
              localStorage.setItem('username', newUsername);
              setToken(newToken);
              setUsername(newUsername);
       };

       const logout = () => {
              localStorage.removeItem('token');
              localStorage.removeItem('username');
              setToken(null);
              setUsername(null);
       };

       return (
              <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token, username }}>
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
