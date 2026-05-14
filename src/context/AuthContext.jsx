import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const authRes = await api.post('/auth/authenticate', credentials);
    const userId = authRes.data.id;
    try {
      const userRes = await api.get(`/usuarios/${userId}`);
      setUser(userRes.data);
      sessionStorage.setItem('user', JSON.stringify(userRes.data));
    } catch {
      const partialUser = {
        id: userId,
        email: authRes.data.email,
        rol: authRes.data.roles?.find(r => r.startsWith('ROLE_')) || 'ROLE_ESTUDIANTE',
        nombres: '',
        apellidos: '',
      };
      setUser(partialUser);
      sessionStorage.setItem('user', JSON.stringify(partialUser));
    }
    return authRes.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
    } finally {
      setUser(null);
      sessionStorage.removeItem('user');
    }
  };

  const getRole = () => {
    if (!user?.rol) return null;
    return user.rol.replace('ROLE_', '');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, getRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
