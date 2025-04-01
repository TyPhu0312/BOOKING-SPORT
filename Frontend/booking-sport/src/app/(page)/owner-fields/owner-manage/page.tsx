"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ManageFields = () => {
  const router = useRouter();

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
          <tr className="border-b hover:bg-gray-100">
            <td className="p-3 text-center">Lớp học vẽ cơ bản</td>
            <td className="p-3 text-center">Mỹ thuật</td>
            <td className="p-3 text-center">Hoạt động</td>
            <td className="p-3 text-center">200,000 VNĐ/h</td>
            <td className="p-3 text-center">8:00 - 17:00</td>
            <td className="p-3 text-center">
              <Image
                width={80}
                height={56}
                src="/images/courses/art-basic.jpg"
                className="w-20 h-14 object-cover rounded-lg"
                alt="Thumbnail"
              />
            </td>
            <td className="p-3 text-center space-x-2">
              <button className="px-2 py-1 bg-yellow-500 text-white rounded">Sửa</button>
              <button className="px-2 py-1 bg-red-500 text-white rounded">Xóa</button>
            </td>
          </tr>

          <tr className="border-b hover:bg-gray-100">
            <td className="p-3 text-center">Lớp học vẽ nâng cao</td>
            <td className="p-3 text-center">Mỹ thuật</td>
            <td className="p-3 text-center">Hoạt động</td>
            <td className="p-3 text-center">300,000 VNĐ/h</td>
            <td className="p-3 text-center">9:00 - 18:00</td>
            <td className="p-3 text-center">
              <Image
                width={80}
                height={56}
                src="/images/courses/art-advanced.jpg"
                className="w-20 h-14 object-cover rounded-lg"
                alt="Thumbnail"
              />
            </td>
            <td className="p-3 text-center space-x-2">
              <button className="px-2 py-1 bg-yellow-500 text-white rounded">Sửa</button>
              <button className="px-2 py-1 bg-red-500 text-white rounded">Xóa</button>
            </td>
          </tr>

          <tr className="border-b hover:bg-gray-100">
            <td className="p-3 text-center">Khóa học thiết kế đồ họa</td>
            <td className="p-3 text-center">Thiết kế</td>
            <td className="p-3 text-center">Hoạt động</td>
            <td className="p-3 text-center">500,000 VNĐ/h</td>
            <td className="p-3 text-center">10:00 - 19:00</td>
            <td className="p-3 text-center">
              <Image
                width={80}
                height={56}
                src="/images/courses/graphic-design.jpg"
                className="w-20 h-14 object-cover rounded-lg"
                alt="Thumbnail"
              />
            </td>
            <td className="p-3 text-center space-x-2">
              <button className="px-2 py-1 bg-yellow-500 text-white rounded">Sửa</button>
              <button className="px-2 py-1 bg-red-500 text-white rounded">Xóa</button>
            </td>
          </tr>

          <tr className="border-b hover:bg-gray-100">
            <td className="p-3 text-center">Lớp học nhiếp ảnh</td>
            <td className="p-3 text-center">Nhiếp ảnh</td>
            <td className="p-3 text-center">Hoạt động</td>
            <td className="p-3 text-center">250,000 VNĐ/h</td>
            <td className="p-3 text-center">7:30 - 16:30</td>
            <td className="p-3 text-center">
              <Image
                width={80}
                height={56}
                src="/images/courses/photography.jpg"
                className="w-20 h-14 object-cover rounded-lg"
                alt="Thumbnail"
              />
            </td>
            <td className="p-3 text-center space-x-2">
              <button className="px-2 py-1 bg-yellow-500 text-white rounded">Sửa</button>
              <button className="px-2 py-1 bg-red-500 text-white rounded">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ManageFields;
