import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext();
const STORAGE_KEY = "newsaggregator.auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = ({ username, email, token }) => {
    const nextUser = {
      username: username || null,
      email: email || null,
      token: token || null,
    };

    setUser(nextUser);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    // Backwards compatibility with previous storage keys
    if (token) {
      localStorage.setItem("token", token);
    }
    if (username) {
      localStorage.setItem("username", username);
    }
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("username");
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user?.token || user?.username || user?.email),
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
