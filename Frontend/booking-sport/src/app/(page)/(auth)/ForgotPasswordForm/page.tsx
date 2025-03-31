"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(
      "Nếu email của bạn có trong hệ thống, chúng tôi sẽ gửi một liên kết đặt lại mật khẩu."
    );

    // Chuyển về trang đăng nhập sau 3 giây
    setTimeout(() => {
      router.push("/auth/LoginForm");
    }, 3000);
  };

  return (
    <div
      className="flex h-screen w-screen items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/background/bg2.jpg')" }}
    >
      <div className="bg-gradient-to-b from-[#f7f6f6] via-[#95f4f4] to-[#50f8f0] p-10 rounded-2xl shadow-xl text-white w-96">
        <h1 className="text-2xl font-bold text-black text-center mb-4">
          Quên Mật Khẩu
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 pl-10 rounded-lg bg-white text-black focus:outline-none"
            />
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          {/* Nút gửi */}
          <button className="w-full bg-gray-600 text-white font-semibold py-3 rounded-lg hover:bg-gray-500">
            Gửi liên kết đặt lại mật khẩu
          </button>

          {/* Hiển thị thông báo */}
          {message && <p className="text-center text-gray-700">{message}</p>}

          {/* Quay lại đăng nhập */}
          <p className="text-center text-sm mt-4 text-gray-500">
            <Link href="/LoginForm" className="font-bold hover:underline">
              Quay lại đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
