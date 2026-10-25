import { createContext, useContext, useMemo, useState } from "react";
import apiClient from "../api/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  });

  const login = async (email, password) => {
    const response = await apiClient.post("/auth/login", {
      email,
      password,
    });

    const authData = response.data;

    const currentUser = {
      userId: authData.userId,
      email: authData.email,
      role: authData.role,
    };

    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", JSON.stringify(currentUser));

    setUser(currentUser);

    return currentUser;
  };

  const register = async (formData) => {
    return apiClient.post("/auth/register", formData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
