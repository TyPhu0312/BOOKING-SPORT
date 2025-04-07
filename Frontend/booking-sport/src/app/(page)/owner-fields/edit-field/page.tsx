"use client";

import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditFieldPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-20">
      <h1 className="text-3xl font-bold text-center mb-6">Chỉnh sửa sân</h1>
      <style jsx global>{`
        .react-datepicker-wrapper {
          display: inline-block;
          width: 100%;
        }
        .react-datepicker__input-container input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z"/><path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>')
            no-repeat right 0.5rem center;
          background-size: 16px;
        }
      `}</style>
      <form className="space-y-4">
        <input
          type="text"
          className="w-full p-2 border rounded-lg"
          placeholder="Thể loại sân"
        />
        <input
          type="text"
          className="w-full p-2 border rounded-lg"
          placeholder="Tên sân"
        />
        <textarea
          className="w-full p-2 border rounded-lg"
          placeholder="Mô tả"
        ></textarea>
        <input
          type="text"
          className="w-full p-2 border rounded-lg"
          placeholder="Địa chỉ"
        />

        <label className="block font-semibold">Tình trạng:</label>
        <select className="w-full p-2 border rounded-lg">
          <option value="Đang hoạt động">Đang hoạt động</option>
          <option value="Bảo trì">Bảo trì</option>
        </select>

        <label className="block font-semibold">Giá thuê (VNĐ/h):</label>
        <div className="flex items-center space-x-2">
          <span className="w-1/2 p-2 border rounded-lg bg-gray-100">
            10,000 VNĐ
          </span>
          <button
            type="button"
            className="bg-yellow-500 text-white py-1 px-3 rounded-lg"
          >
            Sửa giá thuê
          </button>
          <button
            type="button"
            className="bg-green-500 text-white py-1 px-3 rounded-lg"
          >
            Lưu giá thuê
          </button>
        </div>

        <label className="block font-semibold">Chọn lịch và giờ:</label>
        <div className="flex items-center space-x-2">
          <div className="w-1/3">
            <DatePicker
              className="w-full p-2 border rounded-lg"
              placeholderText="06/04/2025"
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <select className="w-1/3 p-2 border rounded-lg">
            {Array.from({ length: 48 }, (_, i) => {
              const hour = Math.floor(i / 2) % 12 || 12;
              const minute = i % 2 === 0 ? "00" : "30";
              const period = Math.floor(i / 2) < 12 ? "AM" : "PM";
              return `${hour}:${minute} ${period}`;
            }).map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
            <option value="13:30 PM" selected>
              13:30 PM
            </option>
          </select>
          <span>→</span>
          <select className="w-1/3 p-2 border rounded-lg">
            {Array.from({ length: 48 }, (_, i) => {
              const hour = Math.floor(i / 2) % 12 || 12;
              const minute = i % 2 === 0 ? "00" : "30";
              const period = Math.floor(i / 2) < 12 ? "AM" : "PM";
              return `${hour}:${minute} ${period}`;
            }).map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
            <option value="17:30 PM" selected>
              17:30 PM
            </option>
          </select>
        </div>

        <label className="block font-semibold">Ảnh sân:</label>
        <Image
                  width={80}
                  height={56}
                  src="/images/courses/photography.jpg"
                  className="w-20 h-14 object-cover rounded-lg"
                  alt="Thumbnail"
                />
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="w-full p-2 border rounded-lg"
                />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg"
        >
          Lưu thay đổi
        </button>
        <button
          type="button"
          onClick={() => window.location.href = "/owner-fields/owner-manage"}
          className="w-full bg-gray-400 text-white py-2 rounded-lg mt-2"
        >
          Hủy
        </button>
      </form>
    </div>
  );
};

export default EditFieldPage;