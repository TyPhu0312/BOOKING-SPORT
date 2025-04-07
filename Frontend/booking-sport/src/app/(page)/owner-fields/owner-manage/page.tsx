"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const ManageFields = () => {
  const router = useRouter();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">Quản lý sân thể thao</h1>

      <div className="flex justify-end mb-6 cursor-pointer">
        <button
          onClick={() => router.push("/owner-fields/add-field")}
          className="px-5 py-2 bg-green-600 hover:bg-green-700 transition text-white rounded-xl font-medium shadow-md"
        >
          + Thêm sân mới
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-black text-white text-base">
            <tr>
              <th className="p-4 text-center">Tên sân</th>
              <th className="p-4 text-center">Địa chỉ</th>
              <th className="p-4 text-center">Tình trạng</th>
              <th className="p-4 text-center">Giá thuê</th>
              <th className="p-4 text-center">Giờ hoạt động</th>
              <th className="p-4 text-center">Hình ảnh</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                name: "Sân bóng đá mini A1",
                address: "123 Lê Văn Việt, Thủ Đức",
                status: "Hoạt động",
                price: "300,000 VNĐ/h",
                time: "6:00 - 22:00",
                img: "/images/fields/san-bong-da.jpg",
              },
              {
                name: "Sân cầu lông B2",
                address: "456 Trường Chinh, Tân Bình",
                status: "Hoạt động",
                price: "150,000 VNĐ/h",
                time: "7:00 - 21:00",
                img: "/images/fields/san-cau-long.jpg",
              },
              {
                name: "Sân bóng chuyền C3",
                address: "789 Nguyễn Trãi, Quận 5",
                status: "Bảo trì",
                price: "200,000 VNĐ/h",
                time: "8:00 - 20:00",
                img: "/images/fields/san-bong-chuyen.jpg",
              },
              {
                name: "Sân tennis D4",
                address: "12 Phạm Văn Đồng, Gò Vấp",
                status: "Hoạt động",
                price: "400,000 VNĐ/h",
                time: "5:30 - 23:00",
                img: "/images/fields/san-tennis.jpg",
              },
            ].map((field, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50 transition-all duration-200 text-center"
              >
                <td className="p-4 font-semibold">{field.name}</td>
                <td className="p-4">{field.address}</td>
                <td className={`p-4 ${field.status === "Bảo trì" ? "text-red-500" : "text-green-600"}`}>
                  {field.status}
                </td>
                <td className="p-4">{field.price}</td>
                <td className="p-4">{field.time}</td>
                <td className="p-4 flex justify-center">
                  <Image
                    width={80}
                    height={56}
                    src={field.img}
                    className="w-24 h-16 object-cover rounded-lg shadow"
                    alt={field.name}
                  />
                </td>
                <td className="p-4 space-x-2">
                  <Link href="owner-fields/edit-fields" className="cursor-pointer">
                    <button className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg shadow-sm transition">
                      Sửa
                    </button>
                  </Link>
                  <Link href="owner-fields/view-field">
                  </Link>
                  <button className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm transition">
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageFields;
