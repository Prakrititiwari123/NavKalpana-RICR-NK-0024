import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔁 REHYDRATION FROM BACKEND (BEST PRACTICE)
  useEffect(() => {
    const refreshAuth = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4500/auth/refresh",
          { withCredentials: true }
        );
        
        
        setAccessToken(res.data.accessToken);
        setUser(res.data.user); // optional if backend sends user
        setIsAuthenticated(true);

         if (res.data.accessToken) {
          localStorage.setItem("accessToken", res.data.accessToken);
          
        }
        if (res.data.user) {
          localStorage.setItem("healthnexus_user", JSON.stringify(res.data.user));
        }
      } catch {
        setUser(null);
        setAccessToken(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // 👈 IMPORTANT
      }
    };

    refreshAuth();
  }, []);

  // 🔐 LOGIN
  const login = (data) => {
    setUser(data.user);
    setAccessToken(data.accessToken);
    setIsAuthenticated(true);

    if (data?.user) {
      localStorage.setItem("healthnexus_user", JSON.stringify(data.user));
    }
    if (data?.accessToken) {
      localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
    }
  };

  // 🚪 LOGOUT
  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:4500/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch {
      void 0;
    }

    setUser(null);
    setAccessToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("healthnexus_user");
  };

  // AuthContext.js (MODIFICATION ONLY)

const updateUser = (updatedUser) => {
  setUser(updatedUser);
};

  
  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        updateUser,
        isAuthenticated,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
