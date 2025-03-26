"use client";

import { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="flex h-screen w-screen items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/background/bg2.jpg')" }}
    >
      <div className="bg-gradient-to-b from-[#f7f6f6] via-[#95f4f4] to-[#50f8f0] p-10 rounded-2xl shadow-xl text-white w-96">
        <h2 className="text-3xl font-bold text-black text-center mb-6">
          Đăng ký
        </h2>

        {/* Form đăng ký */}
        <div className="space-y-4">
          {/* Username */}
          <div className="relative">
            <input
              type="text"
              name="username"
              placeholder="Tên đăng nhập"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 pl-10 rounded-lg bg-white text-black focus:outline-none"
            />
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 pl-10 rounded-lg bg-white text-black focus:outline-none"
            />
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 pl-10 rounded-lg bg-white text-black focus:outline-none"
            />
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 pl-10 rounded-lg bg-white text-black focus:outline-none"
            />
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          {/* Nút đăng ký */}
          <button className="w-full bg-gray-600 text-white font-semibold py-3 rounded-lg hover:bg-gray-500">
            Đăng ký
          </button>

          {/* Chuyển sang đăng nhập */}
          <p className="text-center text-sm mt-4 text-gray-500">
            Đã có tài khoản?{" "}
            <a href="/LoginForm" className="font-bold hover:underline">
              Đăng nhập ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
