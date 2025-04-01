"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
const EditFieldPage = () => {
  const router = useRouter();
  const [field, setField] = useState({
    id: null,
    type: "",
    name: "",
    description: "",
    address: "",
    status: "Đang hoạt động",
    image: "",
    price: "10000",
    openTime: "06:00",
    closeTime: "22:00",
  });

  useEffect(() => {
    const savedField = JSON.parse(localStorage.getItem("editingField") || "{}");
    if (savedField.id) {
      setField(savedField);
    } else {
      router.push("/owner-manage"); // Nếu không có dữ liệu, quay lại trang quản lý
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (e.target.name === "image") {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setField({ ...field, image: imageUrl });
      }
    } else {
      setField({ ...field, [e.target.name]: e.target.value });
    }
  };

  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
      <h1 className="text-3xl font-bold text-center mb-6">Chỉnh sửa sân</h1>
      <form className="space-y-4">
        <input type="text" name="type" value={field.type} onChange={handleChange} className="w-full p-2 border rounded-lg" required placeholder="Thể loại sân" />
        <input type="text" name="name" value={field.name} onChange={handleChange} className="w-full p-2 border rounded-lg" required placeholder="Tên sân" />
        <textarea name="description" value={field.description} onChange={handleChange} className="w-full p-2 border rounded-lg" required placeholder="Mô tả"></textarea>
        <input type="text" name="address" value={field.address} onChange={handleChange} className="w-full p-2 border rounded-lg" required placeholder="Địa chỉ" />

        <label className="block font-semibold">Tình trạng:</label>
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

        {/* Hiển thị ảnh cũ và chọn ảnh mới */}
        <label className="block font-semibold">Ảnh sân:</label>
        {field.image && <Image width={40} height={28} src={field.image} alt="" className="w-40 h-28 object-cover rounded-lg mb-2" />}
        <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full p-2 border rounded-lg" />

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">Lưu thay đổi</button>
        <button type="button" onClick={() => router.push("/owner-manage")} className="w-full bg-gray-400 text-white py-2 rounded-lg mt-2">Hủy</button>
      </form>
    </div>
  );
};

export default EditFieldPage;
