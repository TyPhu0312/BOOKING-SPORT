"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userId: string | null;
  username: string | null;
  login: (data: { user_id: string; username: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userId: null,
  username: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    const name = localStorage.getItem("username");
    if (id) {
      setUserId(id);
      setUsername(name);
      setIsLoggedIn(true);
    }
  }, []);

  const login = ({ user_id, username }: { user_id: string; username: string }) => {
    localStorage.setItem("user_id", user_id);
    localStorage.setItem("username", username);
    setUserId(user_id);
    setUsername(username);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    setUserId(null);
    setUsername(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
