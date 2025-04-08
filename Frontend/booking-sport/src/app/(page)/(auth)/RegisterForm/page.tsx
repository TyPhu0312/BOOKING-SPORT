"use client";

import { useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaPhone } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
    roleID: "1", // giả sử 1 là Customer
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Mật khẩu xác nhận không khớp");
    }

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        passWord: formData.password, // BE nhận field là `passWord`
        phone_number: formData.phone_number,
        roleID: Number(formData.roleID),
        create_at: new Date().toISOString(), // ISO format
      };

      await axios.post("https://booking-sport-lljl.onrender.com/api/admin/user/create", payload);
      alert("Tạo tài khoản thành công!");
      router.push('../LoginForm'); // chuyển sang trang đăng nhập
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.error || "Đã có lỗi xảy ra");
      } else {
        setError("Lỗi không xác định");
      }
    }
  };

  return (
    <div
      className="flex h-screen w-screen items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/background/bg2.jpg')" }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-b from-[#f7f6f6] via-[#95f4f4] to-[#50f8f0] p-10 rounded-2xl shadow-xl text-white w-96"
      >
        <h2 className="text-3xl font-bold text-black text-center mb-6">
          Đăng ký
        </h2>

        <div className="space-y-4">
          {/* Username */}
          <div className="relative">
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

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 pl-10 rounded-lg bg-white text-black focus:outline-none"
            />
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          {/* Phone number */}
          <div className="relative">
            <input
              type="text"
              name="phone_number"
              placeholder="Số điện thoại"
              value={formData.phone_number}
              onChange={handleChange}
              required
              className="w-full p-3 pl-10 rounded-lg bg-white text-black focus:outline-none"
            />
            <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          {/* Password */}
          <div className="relative">
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

          {/* Confirm Password */}
          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full p-3 pl-10 rounded-lg bg-white text-black focus:outline-none"
            />
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          {/* Hiển thị lỗi */}
          {error && (
            <p className="text-red-600 text-sm text-center font-semibold">
              {error}
            </p>
          )}

          {/* Nút đăng ký */}
          <button
            type="submit"
            className="w-full bg-gray-600 text-white font-semibold py-3 rounded-lg hover:bg-gray-500 cursor-pointer transition duration-200 ease-in-out"
          >
            Đăng ký
          </button>

          <p className="text-center text-sm mt-4 text-gray-700">
            Đã có tài khoản?{" "}
            <a href="/LoginForm" className="font-bold hover:underline cursor-pointer transition duration-200 ease-in-out">
              Đăng nhập ngay
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
