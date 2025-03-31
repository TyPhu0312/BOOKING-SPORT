"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const AddFieldPage = () => {
  const router = useRouter();
  const [field, setField] = useState({
    type: "",
    name: "",
    description: "",
    address: "",
    status: "Đang hoạt động",
    image: null,
    price: "10000",
    openTime: "06:00",
    closeTime: "22:00",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (e.target.name === "image") {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setField({ ...field, image: file ? URL.createObjectURL(file) : null });
    } else {
      setField({ ...field, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Lấy danh sách sân cũ từ localStorage
    const existingFields = JSON.parse(localStorage.getItem("fields") || "[]");

    // Thêm sân mới vào danh sách
    const newField = { ...field, id: Date.now() };
    const updatedFields = [...existingFields, newField];

    // Lưu vào localStorage
    localStorage.setItem("fields", JSON.stringify(updatedFields));

    // Chuyển hướng về trang quản lý sân
    router.push("/owner-manage");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
      <h1 className="text-3xl font-bold text-center mb-6">Thêm sân mới</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="type" placeholder="Thể loại sân" value={field.type} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
        <input type="text" name="name" placeholder="Tên sân" value={field.name} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
        <textarea name="description" placeholder="Mô tả" value={field.description} onChange={handleChange} className="w-full p-2 border rounded-lg" required></textarea>
        <input type="text" name="address" placeholder="Địa chỉ" value={field.address} onChange={handleChange} className="w-full p-2 border rounded-lg" required />

        <select name="status" value={field.status} onChange={handleChange} className="w-full p-2 border rounded-lg">
          <option value="Đang hoạt động">Đang hoạt động</option>
          <option value="Bảo trì">Bảo trì</option>
        </select>

        <label className="block font-semibold">Giá thuê (VNĐ/h):</label>
        <select name="price" value={field.price} onChange={handleChange} className="w-full p-2 border rounded-lg">
          <option value="10000">10,000 VNĐ</option>
          <option value="20000">20,000 VNĐ</option>
          <option value="30000">30,000 VNĐ</option>
          <option value="40000">40,000 VNĐ</option>
          <option value="50000">50,000 VNĐ</option>
        </select>

        <label className="block font-semibold">Giờ hoạt động:</label>
        <div className="flex space-x-2">
          <select name="openTime" value={field.openTime} onChange={handleChange} className="w-1/2 p-2 border rounded-lg">
            {Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`).map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          <span>-</span>
          <select name="closeTime" value={field.closeTime} onChange={handleChange} className="w-1/2 p-2 border rounded-lg">
            {Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`).map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full p-2 border rounded-lg" />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">Thêm sân</button>
        <button type="button" onClick={() => router.push("/owner-manage")} className="w-full bg-gray-400 text-white py-2 rounded-lg mt-2">Trở lại</button>
      </form>
    </div>
  );
};

export default AddFieldPage;
