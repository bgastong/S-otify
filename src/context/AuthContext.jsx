import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loadingUser, setLoadingUser] = useState(Boolean(token));

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      if (!token) {
        setLoadingUser(false);
        return;
      }

      setLoadingUser(true);

      try {
        const currentUser = await authService.me(token);

        if (isMounted) {
          setUser(currentUser);
        }
      } catch {
        localStorage.removeItem("token");

        if (isMounted) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoadingUser(false);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = async (email, password) => {
    const data = await authService.login(email, password);

    localStorage.setItem("token", data.token);

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  const logout = async () => {
    try {
      if (token) {
        await authService.logout(token);
      }
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loadingUser,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
    }),
    [user, token, loadingUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);