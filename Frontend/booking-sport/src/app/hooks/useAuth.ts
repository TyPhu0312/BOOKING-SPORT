"use client";
import { useEffect, useState } from "react";
import axios from "axios";

type User = {
  user_id: string;
  username: string;
  role: {
    roleName: string;
  };
};

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true); // Start loading
      const id = localStorage.getItem("user_id");
      if (id) {
        try {
          const res = await axios.get(`http://localhost:5000/api/admin/user/getByID/${id}`);
          setUser(res.data);
          setIsLoggedIn(true);
        } catch (err) {
          console.error("Lỗi khi fetch user:", err);
          setIsLoggedIn(false);
          setUser(null);
        } finally {
          setLoading(false); // End loading
        }
      } else {
        setLoading(false); // No user_id in localStorage
      }
    };
    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("user_id");
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = "/LoginForm";
  };

  return { isLoggedIn, user, loading, logout };
}