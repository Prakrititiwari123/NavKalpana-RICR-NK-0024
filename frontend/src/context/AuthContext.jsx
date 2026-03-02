import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4500",
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000 // 10 second timeout
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use ref to prevent multiple refresh calls in development
  const refreshAttempted = useRef(false);

  // Clear error helper
  const clearError = useCallback(() => setError(null), []);

  // 🔁 REFRESH TOKEN FUNCTION (handles 401 gracefully)
  const refreshAuth = useCallback(async (isRetry = false) => {
    // Skip if already attempted and not a retry
    if (refreshAttempted.current && !isRetry) {
      return;
    }

    try {
      refreshAttempted.current = true;
      setError(null);
      
      // Only log in development
      if (import.meta.env.DEV) {
        console.log("🔄 Attempting to refresh session...");
      }

      const res = await axiosInstance.get("/auth/refresh");
      
      if (res.data?.accessToken) {
        setAccessToken(res.data.accessToken);
        setUser(res.data.user || null);
        setIsAuthenticated(true);
        
        if (import.meta.env.DEV) {
          console.log("✅ Session refreshed successfully");
        }
      } else {
        // No accessToken in response
        setUser(null);
        setAccessToken(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      // Expected: 401 when no valid refresh token (first visit or logged out)
      const status = err.response?.status;
      
      if (status === 401) {
        // This is expected behavior - user is not logged in
        if (import.meta.env.DEV) {
          console.log("ℹ️ No active session found (expected on first load)");
        }
      } else if (status === 500) {
        // Server error - maybe show a friendly message
        console.error("Server error during refresh:", err.message);
        setError("Unable to connect to server. Please try again.");
      } else if (err.code === 'ECONNABORTED') {
        // Timeout error
        console.error("Refresh request timeout");
        setError("Connection timeout. Please check your network.");
      } else {
        // Other errors (network issues, etc.)
        console.error("Unexpected error during refresh:", err.message);
        // Don't show error to user for network issues on first load
      }
      
      // Always reset auth state on any error
      setUser(null);
      setAccessToken(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial refresh on mount
  useEffect(() => {
    refreshAuth();
    
    // Cleanup function
    return () => {
      refreshAttempted.current = false;
    };
  }, [refreshAuth]);

  // 🔐 LOGIN
  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const res = await axiosInstance.post("/auth/login", { email, password });
      
      if (res.data?.accessToken) {
        setAccessToken(res.data.accessToken);
        setUser(res.data.user || null);
        setIsAuthenticated(true);
        
        if (import.meta.env.DEV) {
          console.log("✅ Login successful");
        }
        
        return { 
          success: true, 
          data: res.data 
        };
      }
      
      throw new Error("Invalid response from server");
      
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || err.message;
      
      let userMessage = "Login failed";
      
      if (status === 401) {
        userMessage = "Invalid email or password";
      } else if (status === 400) {
        userMessage = "Please provide email and password";
      } else if (status === 429) {
        userMessage = "Too many attempts. Please try again later";
      } else if (err.code === 'ECONNABORTED') {
        userMessage = "Connection timeout. Please try again";
      } else if (!err.response) {
        userMessage = "Network error. Please check your connection";
      }
      
      setError(userMessage);
      
      if (import.meta.env.DEV) {
        console.error("❌ Login failed:", { status, message });
      }
      
      return { 
        success: false, 
        error: userMessage 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // 📝 REGISTER
  const register = useCallback(async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      const res = await axiosInstance.post("/auth/register", userData);
      
      if (res.data?.accessToken) {
        setAccessToken(res.data.accessToken);
        setUser(res.data.user || null);
        setIsAuthenticated(true);
        
        if (import.meta.env.DEV) {
          console.log("✅ Registration successful");
        }
        
        return { 
          success: true, 
          data: res.data 
        };
      }
      
      throw new Error("Invalid response from server");
      
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || err.message;
      
      let userMessage = "Registration failed";
      
      if (status === 400) {
        userMessage = err.response?.data?.message || "Invalid registration data";
      } else if (status === 409) {
        userMessage = "User already exists";
      } else if (err.code === 'ECONNABORTED') {
        userMessage = "Connection timeout. Please try again";
      } else if (!err.response) {
        userMessage = "Network error. Please check your connection";
      }
      
      setError(userMessage);
      
      if (import.meta.env.DEV) {
        console.error("❌ Registration failed:", { status, message });
      }
      
      return { 
        success: false, 
        error: userMessage 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // 🚪 LOGOUT
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      
      await axiosInstance.post("/auth/logout", {}).catch(() => {
        // Silently fail - we want to logout locally anyway
      });
      
      if (import.meta.env.DEV) {
        console.log("👋 Logged out successfully");
      }
      
    } catch (err) {
      // Ignore errors during logout
      if (import.meta.env.DEV) {
        console.log("Logout warning:", err.message);
      }
    } finally {
      // Always clear local state
      setUser(null);
      setAccessToken(null);
      setIsAuthenticated(false);
      setError(null);
      setLoading(false);
      
      // Reset refresh flag for next login
      refreshAttempted.current = false;
    }
  }, []);

  // ✏️ UPDATE USER
  const updateUser = useCallback((updatedUser) => {
    setUser(prevUser => {
      if (!prevUser) return updatedUser;
      return { ...prevUser, ...updatedUser };
    });
  }, []);

  // 🔄 SETUP AXIOS INTERCEPTOR for token refresh on 401
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If 401 and not already retrying and not a refresh request
        if (
          error.response?.status === 401 && 
          !originalRequest._retry &&
          !originalRequest.url.includes('/auth/refresh')
        ) {
          originalRequest._retry = true;
          
          try {
            // Try to refresh the token
            await refreshAuth(true); // true = isRetry
            
            // Retry the original request
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            // If refresh fails, logout
            logout();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor
    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [refreshAuth, logout]);

  // Context value
  const value = {
    // State
    user,
    accessToken,
    isAuthenticated,
    loading,
    error,
    
    // Methods
    login,
    register,
    logout,
    updateUser,
    refreshAuth,
    clearError,
    
    // Utilities
    axios: axiosInstance
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook with error checking
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined || context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};

// Higher-order component for route protection
export const withAuth = (Component, options = {}) => {
  const { fallback = null, redirectTo = '/login' } = options;
  
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
      return fallback || <div className="auth-loading">Loading...</div>;
    }
    
    if (!isAuthenticated) {
      // You can implement redirect here if needed
      // navigate(redirectTo);
      return null;
    }
    
    return <Component {...props} />;
  };
};

// Hook for protected API calls
export const useProtectedAxios = () => {
  const { accessToken, isAuthenticated, logout } = useAuth();
  
  const protectedAxios = useCallback(async (config) => {
    if (!isAuthenticated) {
      throw new Error("Not authenticated");
    }
    
    try {
      const response = await axiosInstance({
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`
        }
      });
      return response;
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      }
      throw error;
    }
  }, [accessToken, isAuthenticated, logout]);
  
  return protectedAxios;
};

export default AuthProvider;