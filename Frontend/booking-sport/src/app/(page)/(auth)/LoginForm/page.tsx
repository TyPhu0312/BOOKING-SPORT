"use client";

import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-cover bg-center bg-no-repeat"
         style={{ backgroundImage: "url('/images/background/bg2.jpg')" }}> 
<div className="bg-gradient-to-b from-[#f7f6f6] via-[#95f4f4] to-[#50f8f0] p-10 rounded-2xl shadow-xl text-white w-96">

        <h2 className="text-3xl font-bold text-black text-center mb-6">Đăng nhập</h2>
        
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 pl-10 rounded-lg bg-white text-black focus:outline-none"
          />
          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        <div className="relative mb-4">
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pl-10 rounded-lg bg-white text-black focus:outline-none"
          />
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        <div className="flex justify-between items-center text-sm mb-4">
          <label className="flex items-center text-gray-500">
            <input type="checkbox" className="mr-2" /> Lưu mật khẩu
          </label>
          <a href="/ForgotPasswordForm" className="text-gray-500 hover:underline">Quên mật khẫu</a>
        </div>

        <button 
        className="w-full bg-gray-600 text-white font-semibold py-3 rounded-lg hover:bg-gray-500"
        >
          Đăng nhập
        </button>

        <p className="text-center text-sm mt-4 text-gray-500">
          Chưa có tài khoản? <a href="/RegisterForm" className="font-bold hover:underline">Đăng kí</a>
        </p>
      </div>
    </div>
  );
}
