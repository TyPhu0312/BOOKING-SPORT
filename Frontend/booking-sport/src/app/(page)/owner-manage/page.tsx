"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ManageFields = () => {
  const [fields, setFields] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedFields = JSON.parse(localStorage.getItem("fields") || "[]");
    setFields(storedFields);
  }, []);

  const deleteField = (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa sân này?")) {
      const updatedFields = fields.filter((field) => field.id !== id);
      setFields(updatedFields);
      localStorage.setItem("fields", JSON.stringify(updatedFields));
    }
  };

  const editField = (id) => {
    const fieldToEdit = fields.find((field) => field.id === id);
    localStorage.setItem("editingField", JSON.stringify(fieldToEdit)); // Lưu dữ liệu sân cần sửa
    router.push("/edit-field"); // Chuyển đến trang sửa sân
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 mt-25">Quản lý sân</h1>
      <div className="flex justify-end mb-4">
        <button onClick={() => router.push("/add-field")} className="px-4 py-2 bg-green-500 text-white rounded-lg">
          Thêm sân
        </button>
      </div>
      <table className="w-full bg-white shadow-lg rounded-xl overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-3 text-center">Tên sân</th>
            <th className="p-3 text-center">Địa chỉ</th>
            <th className="p-3 text-center">Tình trạng</th>
            <th className="p-3 text-center">Giá</th>
            <th className="p-3 text-center">Giờ hoạt động</th>
            <th className="p-3 text-center">Hình ảnh</th>
            <th className="p-3 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field) => (
            <tr key={field.id} className="border-b hover:bg-gray-100">
              <td className="p-3 text-center">{field.name}</td>
              <td className="p-3 text-center">{field.address}</td>
              <td className="p-3 text-center">{field.status}</td>
              <td className="p-3 text-center">{field.price} VNĐ/h</td>
              <td className="p-3 text-center">{field.openTime} - {field.closeTime}</td>
              <td className="p-3 text-center">
                {field.image && <img src={field.image} alt={field.name} className="w-20 h-14 object-cover rounded-lg" />}
              </td>
              <td className="p-3 text-center space-x-2">
                <button onClick={() => editField(field.id)} className="px-2 py-1 bg-yellow-500 text-white rounded">
                  Sửa
                </button>
                <button onClick={() => deleteField(field.id)} className="px-2 py-1 bg-red-500 text-white rounded">
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageFields;
