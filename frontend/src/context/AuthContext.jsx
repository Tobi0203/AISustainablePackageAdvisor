import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const hydrate = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
      setSupplier(data.supplier);
    } catch (error) {
      if (error.response?.status === 401) localStorage.removeItem("accessToken");
      setUser(null);
      setSupplier(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    hydrate();
  }, []);
  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    if (data.token) localStorage.setItem("accessToken", data.token);
    setUser(data.user);
    if (data.user.role === "supplier") await hydrate();
    return data.user;
  };
  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    if (data.token) localStorage.setItem("accessToken", data.token);
    setUser(data.user);
    if (data.user.role === "supplier") await hydrate();
    return data.user;
  };
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
      setSupplier(null);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        supplier,
        loading,
        login,
        register,
        logout,
        refresh: hydrate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
