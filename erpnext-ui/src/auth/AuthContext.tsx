import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getLoggedUser, login as apiLogin, logout as apiLogout } from "../api/frappe";

interface AuthState {
  user: string | null;
  loading: boolean;
  login: (usr: string, pwd: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLoggedUser()
      .then((u) => setUser(u && u !== "Guest" ? u : null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (usr: string, pwd: string) => {
    await apiLogin(usr, pwd);
    setUser(await getLoggedUser());
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
