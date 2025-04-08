"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaUser, FaLock } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";
export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [triggerLogin, setTriggerLogin] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setTriggerLogin(true);
  };

  useEffect(() => {
    const handleLogin = async () => {
      try {
        const response = await axios.post("https://booking-sport-lljl.onrender.com/api/admin/user/login", {
          username: formData.username,
          passWord: formData.password,
        });

        if (response.status === 200) {
          alert("Đăng nhập thành công!");
          sessionStorage.setItem("shouldReload", "true");
          login({ user_id: response.data.user_id, username: response.data.username });
          router.push("/");
        }
        
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || "Đăng nhập thất bại");
        } else {
          setError("Đã xảy ra lỗi không xác định");
        }
      } finally {
        setTriggerLogin(false);
      }
    };

    if (triggerLogin) {
      handleLogin();
    }
  }, [triggerLogin, formData.username, formData.password, login, router]);


  return (
    <div className="flex h-screen w-screen items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/background/bg2.jpg')" }}>
      <form onSubmit={handleSubmit}
        className="bg-gradient-to-b from-[#f7f6f6] via-[#95f4f4] to-[#50f8f0] p-10 rounded-2xl shadow-xl text-white w-96">
        <h2 className="text-3xl font-bold text-black text-center mb-6">Đăng nhập</h2>

        <div className="relative mb-4">
          <input
            type="text"
            name="username"
            placeholder="Tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-3 pl-10 rounded-lg bg-white text-black focus:outline-none"
          />
          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        <div className="relative mb-4">
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 pl-10 rounded-lg bg-white text-black focus:outline-none"
          />
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        {error && <p className="text-red-600 text-sm text-center font-semibold mb-4">{error}</p>}

        <button type="submit"
          className="w-full bg-gray-600 text-white font-semibold py-3 rounded-lg hover:bg-gray-500 cursor-pointer transition duration-200 ease-in-out">
          Đăng nhập
        </button>

        <p className="text-center text-sm mt-4 text-gray-500">
          Chưa có tài khoản?{" "}
          <a href="/RegisterForm" className="font-bold hover:underline cursor-pointer transition duration-200 ease-in-out">Đăng ký</a>
        </p>
      </form>
    </div>
  );
}
