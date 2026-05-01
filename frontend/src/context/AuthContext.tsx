import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/axios';
import { useQueryClient } from '@tanstack/react-query';

export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  lastLogin: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/auth/profile');
        if (data.success && data.data) {
          setUser(data.data);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const login = (newUser: User, accessToken: string) => {
    setUser(newUser);
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error(e);
    } finally {
      setUser(null);
      api.defaults.headers.common['Authorization'] = '';
      queryClient.clear();
    }
  };

  const setAccessToken = (token: string) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setAccessToken }}>
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
