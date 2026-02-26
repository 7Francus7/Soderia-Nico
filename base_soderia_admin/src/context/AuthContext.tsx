import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

interface UserInfo {
       username: string;
       role: string;
       full_name: string | null;
}

interface AuthContextType {
       token: string | null;
       login: (token: string, username: string) => void;
       logout: () => void;
       isAuthenticated: boolean;
       username: string | null;
       userRole: string | null;
       isAdmin: boolean;
       userInfo: UserInfo | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
       const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
       const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
       const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

       const fetchUserInfo = useCallback(async () => {
              if (!token) return;
              try {
                     const res = await api.get('/users/me');
                     setUserInfo({
                            username: res.data.username,
                            role: res.data.role,
                            full_name: res.data.full_name
                     });
              } catch {
                     // If token is invalid, this will trigger 401 which auto-logouts
              }
       }, [token]);

       useEffect(() => {
              fetchUserInfo();
       }, [fetchUserInfo]);

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
              setUserInfo(null);
       };

       const userRole = userInfo?.role || null;
       const isAdmin = userRole === 'ADMIN';

       return (
              <AuthContext.Provider value={{
                     token, login, logout,
                     isAuthenticated: !!token,
                     username: userInfo?.username || username,
                     userRole,
                     isAdmin,
                     userInfo
              }}>
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
