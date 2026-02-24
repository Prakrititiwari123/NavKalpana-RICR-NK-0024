import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // 👈 IMPORTANT

  // 🔁 REHYDRATION LOGIC
  useEffect(() => {
    const storedUser = localStorage.getItem("healthnexus_user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    setLoading(false); // 👈 hydration complete
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("healthnexus_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("healthnexus_user");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);