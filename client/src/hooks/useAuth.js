import { useState, useEffect } from 'react';
import axios from 'axios';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/admin/me');
        console.log('Auth check response:', response.data);
        if (response.data && response.data.user) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLoginStateChange = (state, userData = null) => {
    console.log('Login state changed:', state, userData);
    setIsAuthenticated(state);
    setUser(userData);
  };

  return {
    isAuthenticated,
    loading,
    user,
    handleLoginStateChange
  };
} 