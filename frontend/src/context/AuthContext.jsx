import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useWalletContext } from './WalletProvider';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const { connectWallet } = useWalletContext();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('/api/auth/user', {
            headers: {
              'x-auth-token': token,
            },
          });
          setUser(res.data);
        } catch (err) {
            console.error('Error loading user:', err);
            localStorage.removeItem('token');
            setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (formData) => {
    try {
      const res = await axios.post(
          '/api/auth/login',
          formData
      );
      // Backend should return { token, user } or just { token }
      if (res.data.token) {
          localStorage.setItem('token', res.data.token);
      }
      // Set user from response
      setUser(res.data.user || res.data);
      return res;
    } catch (err) {
        console.error('Error logging in:', err);
        localStorage.removeItem('token');
        setUser(null);
        throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
        {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
