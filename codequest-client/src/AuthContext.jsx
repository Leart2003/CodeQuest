import { useEffect, useState } from "react";
import { api } from "./api";
import { AuthContext } from "./AuthContextValue";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // on page load, ask the API if we already have a valid cookie
  useEffect(() => {
    api
      .get("/api/auth/me")
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(username, password) {
    setUser(await api.post("/api/auth/login", { username, password }));
  }

  async function register(username, password) {
    setUser(await api.post("/api/auth/register", { username, password }));
  }

  async function logout() {
    await api.post("/api/auth/logout");
    setUser(null);
  }

  function updateXp(totalXp) {
    setUser((current) => current ? { ...current, totalXp } : current);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateXp }}>
      {children}
    </AuthContext.Provider>
  );
}

