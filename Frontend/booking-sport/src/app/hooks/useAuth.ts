"use client";
import { useEffect, useState } from "react";
import axios from "axios";

type User = {
  user_id: string;
  username: string;
  // thêm các field khác nếu có, ví dụ: avatarUrl
};

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const id = localStorage.getItem("user_id");
      if (id) {
        try {
          const res = await axios.get(`https://booking-sport-lljl.onrender.com/api/admin/user/getByID/${id}`);
          setUser(res.data); // 👈 đây là thông tin user từ backend
          setIsLoggedIn(true);
        } catch (err) {
          console.error("Lỗi khi fetch user:", err);
          setIsLoggedIn(false);
          setUser(null);
        }
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

  return { isLoggedIn, user, logout };
}
