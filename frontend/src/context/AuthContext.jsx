import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bezawit_planner_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('bezawit_planner_jwt_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.user);
          localStorage.setItem('bezawit_planner_user', JSON.stringify(res.data.user));
        } catch (e) {
          logout();
        }
      }
      setLoading(false);
    }

    checkAuth();

    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: newUser } = res.data;
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('bezawit_planner_jwt_token', newToken);
    localStorage.setItem('bezawit_planner_user', JSON.stringify(newUser));
    return newUser;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    const { token: newToken, user: newUser } = res.data;
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('bezawit_planner_jwt_token', newToken);
    localStorage.setItem('bezawit_planner_user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('bezawit_planner_jwt_token');
    localStorage.removeItem('bezawit_planner_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
