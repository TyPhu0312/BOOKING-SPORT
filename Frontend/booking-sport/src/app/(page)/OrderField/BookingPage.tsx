// BookingPage.tsx
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Interface phù hợp với schema Prisma hiện tại
interface Space_Per_Hour {
  space_per_hour_id: string;
  from_hour_value: string;
  to_hour_value: string;
  price: number;
  FieldID: string;
  day_of_week: string | null; // Thêm day_of_week từ schema
}

interface FieldDetail {
  field_id: string;
  field_name: string;
  half_hour: boolean;
  location: string;
  description: string;
  status: string;
  image_url: string;
  OwnerID: string;
  CategoryID: string;
  owner: {
    user_id: string;
    username: string;
    email: string;
    phone_number: string;
    create_at: string;
    roleID: string;
  };
  category: {
    category_id: string;
    category_name: string;
  };
  schedules: {
    schedule_id: string;
    day_of_week: string;
    open_time: string | null; // Có thể null nếu isClosed = true
    close_time: string | null; // Có thể null nếu isClosed = true
    FieldID: string;
    isClosed: boolean;
  }[];
  Space_Per_Hour: Space_Per_Hour[];
  bookings: {
    booking_id: string;
    booking_date: string;
    time_start: string;
    time_end: string;
    total_price: string;
    deposit: string;
    Status: string;
    prove_payment: string;
    UserID: string;
    FieldID: string;
  }[];
}

const BookingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const field_id = searchParams.get("field_id") || localStorage.getItem("last_field_id");
  const [field, setField] = useState<FieldDetail | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [form, setForm] = useState({
    booking_date: "",
    time_start: "",
    time_end: "",
    total_price: "",
    deposit: "",
    Status: "Pending",
    prove_payment: "",
    UserID: "",
    FieldID: "",
  });

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      setForm((prev) => ({
        ...prev,
        UserID: userId,
      }));
    }
  }, []);

  useEffect(() => {
    const fetchField = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/admin/fields/getById/${field_id}`);
        setField(res.data);
        console.log("Sân thể thao:", res.data);
      } catch (error) {
        console.error("Lỗi khi fetch sân:", error);
      }
    };
    if (field_id) {
      localStorage.setItem("last_field_id", field_id);
      setForm((prev) => ({
        ...prev,
        FieldID: field_id,
      }));
      fetchField();
    }
  }, [field_id]);

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 6; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hourStr = hour.toString().padStart(2, "0");
        const minuteStr = minute.toString().padStart(2, "0");
        times.push(`${hourStr}:${minuteStr}`);
      }
    }
    return times;
  };

  const handleSubmit = async () => {
    if (!form.booking_date || !form.time_start || !form.time_end) {
      alert("Vui lòng chọn ngày và giờ đặt sân.");
      return;
    }

    const today = new Date();
    const bookingDate = new Date(form.booking_date);
    const todayStr = today.toISOString().split("T")[0];

    if (form.booking_date < todayStr) {
      alert("Không thể đặt sân cho ngày đã qua.");
      return;
    }

    const parseTime = (time: string) => {
      const [hour, minute] = time.split(":").map(Number);
      return hour * 60 + minute;
    };

    const timeStartMinutes = parseTime(form.time_start);
    const timeEndMinutes = parseTime(form.time_end);

    if (timeEndMinutes <= timeStartMinutes) {
      alert("Giờ kết thúc phải lớn hơn giờ bắt đầu.");
      return;
    }

    if (bookingDate.toDateString() === today.toDateString()) {
      const nowMinutes = today.getHours() * 60 + today.getMinutes();
      if (timeStartMinutes < nowMinutes) {
        alert("Giờ bắt đầu phải lớn hơn giờ hiện tại.");
        return;
      }
    }

    try {
      // Lấy ngày trong tuần từ booking_date
      const dayOfWeek = bookingDate.toLocaleString("en-US", { weekday: "short" }).toLowerCase(); // e.g., "sun"
      const matchingPrice = field?.Space_Per_Hour.find(
        (sph) =>
          sph.day_of_week?.toLowerCase() === dayOfWeek &&
          parseTime(sph.from_hour_value) <= timeStartMinutes &&
          parseTime(sph.to_hour_value) >= timeEndMinutes
      );

      const unitPrice = matchingPrice ? matchingPrice.price : Math.min(...(field?.Space_Per_Hour.map((sph) => sph.price) || [0]));
      const durationHours = (timeEndMinutes - timeStartMinutes) / 60;
      const total_price = Math.round(unitPrice * durationHours);
      const deposit = Math.round(total_price * 0.3);

      await axios.post("http://localhost:5000/api/admin/booking/create", {
        booking_date: form.booking_date,
        time_start: form.time_start,
        time_end: form.time_end,
        total_price: total_price.toString(),
        deposit: deposit.toString(),
        Status: form.Status,
        prove_payment: form.prove_payment,
        UserID: form.UserID,
        FieldID: form.FieldID,
      });

      router.push("/");
      alert("Đặt sân thành công!");
    } catch (err: any) {
      console.error("Lỗi khi đặt sân", err);

      const errorMessage = err?.response?.data?.error || "Đặt sân thất bại";
      alert(errorMessage);
    }

  };

  useEffect(() => {
    if (form.time_start && form.time_end && field?.Space_Per_Hour) {
      const parseTime = (time: string) => {
        const [hour, minute] = time.split(":").map(Number);
        return hour * 60 + minute;
      };

      const timeStartMinutes = parseTime(form.time_start);
      const timeEndMinutes = parseTime(form.time_end);
      const bookingDate = new Date(form.booking_date);
      const dayOfWeek = bookingDate.toLocaleString("en-US", { weekday: "short" }).toLowerCase();

      const matchingPrice = field.Space_Per_Hour.find(
        (sph) =>
          sph.day_of_week?.toLowerCase() === dayOfWeek &&
          parseTime(sph.from_hour_value) <= timeStartMinutes &&
          parseTime(sph.to_hour_value) >= timeEndMinutes
      );

      const unitPrice = matchingPrice ? matchingPrice.price : Math.min(...field.Space_Per_Hour.map((sph) => sph.price));
      const durationHours = (timeEndMinutes - timeStartMinutes) / 60;
      const total_price = Math.round(unitPrice * durationHours);
      const deposit = Math.round(total_price * 0.3);

      setForm((prev) => ({
        ...prev,
        total_price: total_price.toString(),
        deposit: deposit.toString(),
      }));
    }
  }, [form.time_start, form.time_end, form.booking_date, field]);

  const timeOptions = generateTimeOptions();
  if (!field) return <p className="text-center mt-20">Đang tải thông tin sân...</p>;

  // Lấy lịch mặc định (ví dụ: ngày đầu tiên trong schedules)
  const defaultSchedule = field.schedules[0] || { open_time: "N/A", close_time: "N/A" };

  return (
    <div className="w-[75%] mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 mt-20">
        Đặt Sân Thể Thao
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">{field.field_name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
          <div>
            <p className="flex items-center">
              <span className="mr-2">📍</span> {field.location}
            </p>
            <p className="flex items-center">
              <span className="mr-2">👤</span> Chủ sân: {field.owner.username}
            </p>
            <p className="flex items-center">
              <span className="mr-2">🏟️</span> Trạng thái sân: {field.status || "Không có"}
            </p>
          </div>
          <div>
            <p className="flex items-center">
              <span className="mr-2">💰</span> Giá thuê: {(field.Space_Per_Hour?.length
                ? Math.min(...field.Space_Per_Hour.map((sph) => sph.price))
                : 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
            </p>
            <p className="flex items-center">
              <span className="mr-2">⏰</span> Giờ mở cửa: {defaultSchedule.open_time || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 flex items-center mb-4">
            <span className="mr-2">📜</span> Mô tả sân
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
            <div>
              <p>{field.description}</p>
            </div>
            <div>
              <p className="flex items-center">
                <span className="mr-2">⏰</span> Giờ đóng cửa: {defaultSchedule.close_time || "N/A"}
              </p>
              <p className="flex items-center">
                <span className="mr-2">⭐</span> Đánh giá: 4.7/5
              </p>
            </div>
          </div>
        </div>
      </div>

      <form className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Ngày đặt:
            </label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.booking_date}
              onChange={(e) => setForm({ ...form, booking_date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Giờ đặt:
            </label>
            <div className="flex items-center space-x-4">
              <select
                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.time_start}
                onChange={(e) => setForm({ ...form, time_start: e.target.value })}
              >
                <option value="">Chọn giờ</option>
                {timeOptions.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <span className="text-gray-600">→</span>
              <select
                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.time_end}
                onChange={(e) => setForm({ ...form, time_end: e.target.value })}
              >
                <option value="">Chọn giờ</option>
                {timeOptions.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          type="submit"
          className="w-full mt-6 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Xác nhận đặt sân
        </Button>
        {form.total_price && (
          <div className="mt-4 text-center text-gray-700">
            <p>
              <strong>Tổng giá:</strong>{" "}
              {parseInt(form.total_price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
            </p>
            <p>
              <strong>Tiền cọc (30%):</strong>{" "}
              {parseInt(form.deposit).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
            </p>
          </div>
        )}
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Thông tin thanh toán
        </h2>
        <p className="text-gray-600 mb-4">
          Vui lòng chuyển khoản theo thông tin sau:
        </p>
        <div className="text-gray-700">
          <p><strong>Số tài khoản:</strong> 1234-5678-9012 (Ngân hàng ABC)</p>
          <p><strong>Chủ tài khoản:</strong> Công ty Thể Thao XYZ</p>
        </div>
        <Image
          src="/images/qrcode.jpg"
          alt="QR Code Thanh Toán"
          className="mx-auto mt-4 max-w-[200px]"
          width={200}
          height={200}
        />
      </div>
    </div>
  );
};

export default BookingPage;