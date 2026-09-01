import { createContext, useContext, useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedAccessToken = localStorage.getItem('access_token');
      const storedRefreshToken = localStorage.getItem('refresh_token');

      if (!storedAccessToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/me`, {
          headers: { Authorization: `Bearer ${storedAccessToken}` },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
        } else if (response.status === 401 && storedRefreshToken) {
          const refreshed = await attemptTokenRefresh(storedRefreshToken);
          if (!refreshed) clearTokens();
        } else {
          clearTokens();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearTokens();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const attemptTokenRefresh = async (storedRefreshToken) => {
    try {
      const response = await fetch(`${API_URL}/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: storedRefreshToken }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      setAccessToken(data.access_token);

      const userResponse = await fetch(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      if (userResponse.ok) {
        setUser(await userResponse.json());
      }
      return true;
    } catch (err) {
      console.error('Token refresh failed:', err);
      return false;
    }
  };

  const googleLogin = async (googleAccessToken) => {
    clearTokens();
    try {
      const response = await fetch(`${API_URL}/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ google_access_token: googleAccessToken }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Google Login failed');

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);

      const userResponse = await fetch(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      setUser(await userResponse.json());

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    clearTokens();
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Login failed');

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);

      const userResponse = await fetch(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      setUser(await userResponse.json());

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (fullName, email, password, confirmPassword) => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          confirm_password: confirmPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Signup failed');

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const resendVerification = async (email) => {
    try {
      const response = await fetch(`${API_URL}/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to resend verification');

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to send reset link');

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      if (accessToken) {
        await fetch(`${API_URL}/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken || '' }),
        });
      }
    } catch (_) {
      // always clear tokens regardless
    } finally {
      clearTokens();
    }
  };

  const value = {
    user,
    accessToken,
    signup,
    login,
    googleLogin,
    resendVerification,
    forgotPassword,
    logout,
    isAuthenticated: !!accessToken,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}