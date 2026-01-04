import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Initialize auth from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const refresh = localStorage.getItem('refreshToken');

      if (token && refresh) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await authService.getMe();
          console.log(response);
          // defensively read possible shapes from the API
          const userFromResponse = response?.data?.user || response?.data?.data || null;
          setUser(userFromResponse);
          console.log('✅ Auth initialized:', userFromResponse?.email ?? 'no-email');
        } catch (error) {
          console.error('❌ Auth init failed:', error);
          // Clear invalid tokens
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          delete api.defaults.headers.common['Authorization'];
          setUser(null);
        }
      } else {
        // No tokens found - user is not logged in, which is fine
        console.log('ℹ️ No authentication tokens found - user needs to log in');
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // CRITICAL FIX: Ensure proper state update after login
  const login = useCallback(async (email, password) => {
    setIsAuthenticating(true);
    try {
      console.log('🔐 [LOGIN] Step 1: Calling login API...');
      const response = await authService.login(email, password);
      const data = response?.data || {};
      console.log('🔐 [LOGIN] Step 2: Login response received:', data);

      // Backend returns tokens in data.data structure
      const accessToken = data.data?.accessToken || data.accessToken;
      const refreshToken = data.data?.refreshToken || data.refreshToken;

      console.log('🔐 [LOGIN] Step 3: Tokens extracted:', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        tokenLength: accessToken?.length
      });

      // Set token BEFORE fetching user profile
      if (accessToken) localStorage.setItem('accessToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      if (accessToken) api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      console.log('🔐 [LOGIN] Step 4: Tokens saved, verifying...');
      const savedToken = localStorage.getItem('accessToken');
      console.log('🔐 [LOGIN] Step 4.5: Token verification:', {
        saved: !!savedToken,
        matches: savedToken === accessToken
      });

      // Fetch current user from API (some backends return tokens only on login)
      try {
        console.log('🔐 [LOGIN] Step 5: Fetching user profile from /auth/me...');
        const me = await authService.getMe();
        console.log('🔐 [LOGIN] Step 6: User profile response:', me?.data);

        const meUser = me?.data?.user || me?.data?.data || me?.data || null;
        console.log('🔐 [LOGIN] Step 7: Extracted user:', meUser);

        setUser(meUser);
        console.log('✅ [LOGIN] SUCCESS! User logged in:', meUser?.email ?? 'no-email');
      } catch (meErr) {
        // If fetching profile fails, remove tokens and rethrow so caller can handle
        console.error('❌ [LOGIN] Step 5 FAILED: Could not fetch user profile:', {
          error: meErr,
          status: meErr.response?.status,
          data: meErr.response?.data,
          message: meErr.message
        });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        throw meErr;
      }

      return response;
    } catch (error) {
      console.error('❌ [LOGIN] FAILED at top level:', {
        error,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error; // Re-throw to be caught by component
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setIsAuthenticating(true);
    try {
      const response = await authService.register(userData);
      const data = response?.data || {};
      // Backend returns tokens in data.data structure
      const accessToken = data.data?.accessToken || data.accessToken;
      const refreshToken = data.data?.refreshToken || data.refreshToken;

      if (accessToken) localStorage.setItem('accessToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      if (accessToken) api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      // Fetch profile after registration (in case API returns tokens only)
      const me = await authService.getMe();
      const registeredUser = me?.data?.user || me?.data?.data || null;
      setUser(registeredUser);

      console.log('✅ Registration successful:', registeredUser?.email ?? 'no-email');
      return response;
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticating,
    login,
    register,
    logout,
  };

  // Prevent render until auth check is complete
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};