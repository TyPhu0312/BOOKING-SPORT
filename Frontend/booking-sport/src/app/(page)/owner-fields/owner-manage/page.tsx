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
            <tr className="border-b hover:bg-gray-100">
              <td className="p-3 text-center">abc</td>
              <td className="p-3 text-center">abc</td>
              <td className="p-3 text-center">abc</td>
              <td className="p-3 text-center">abc VNĐ/h</td>
              <td className="p-3 text-center">6:30 - 18:00</td>
              <td className="p-3 text-center">
                <img src="/images/logos/cat.jpg" className="w-20 h-14 object-cover rounded-lg" />
              </td>
              <td className="p-3 text-center space-x-2">
                <button className="px-2 py-1 bg-yellow-500 text-white rounded">
                  Sửa
                </button>
                <button className="px-2 py-1 bg-red-500 text-white rounded">
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
