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
      } catch (err) {
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
  };

  // 🚪 LOGOUT
  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:4500/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (_) {}

    setUser(null);
    setAccessToken(null);
    setIsAuthenticated(false);
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

export const useAuth = () => useContext(AuthContext);