"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";

interface Booking {
  booking_id: string;
  booking_date: string;
  time_start: string;
  time_end: string;
  total_price: string;
  deposit: string;
  Status: string;
  UserID: string;
  FieldID: string;
}

interface Field {
  field_id: string;
  field_name: string;
}

const BookingHistory = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState<(Booking & { field_name: string })[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Kiểm tra đăng nhập và lấy lịch đặt sân
  useEffect(() => {
    const fetchBookings = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        alert("Vui lòng đăng nhập để xem lịch đặt sân!");
        router.push("/login");
        return;
      }

      try {
        // Lấy tất cả bookings
        const bookingsRes = await axios.get<Booking[]>("http://localhost:5000/api/admin/booking/get");
        const userBookings = bookingsRes.data.filter((b) => b.UserID === userId);

        // Lấy thông tin sân cho từng booking
        const bookingsWithFieldName = await Promise.all(
          userBookings.map(async (booking) => {
            const fieldRes = await axios.get<Field>(
              `http://localhost:5000/api/admin/fields/getById/${booking.FieldID}`
            );
            return { ...booking, field_name: fieldRes.data.field_name };
          })
        );

        setBookings(bookingsWithFieldName);
      } catch (err) {
        console.error("Lỗi khi lấy lịch đặt sân:", err);
        setError("Không thể tải lịch đặt sân. Vui lòng thử lại.");
      }
    };

    fetchBookings();
  }, [router]);

  // Xử lý hủy lịch
  const handleCancel = async (bookingId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/booking/delete/${bookingId}`);
      setBookings(bookings.filter((b) => b.booking_id !== bookingId));
      alert("Hủy lịch thành công!");
    } catch (err) {
      const error = err as AxiosError<{ error?: string }>;
      setError(error.response?.data?.error || "Hủy lịch thất bại. Vui lòng thử lại.");
    }
  };

  if (error) return <p className="text-red-500 text-center mt-20">{error}</p>;
  if (bookings.length === 0) return <p className="text-center mt-20">Bạn chưa có lịch đặt sân nào.</p>;

  return (
    <div className="max-w-[1200px] mx-auto p-4 mt-[70px]">
      <h1 className="text-3xl font-bold text-center mb-6">Lịch sử đặt sân</h1>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.booking_id}
            className="p-4 border rounded-lg shadow-sm flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{booking.field_name}</h2>
              <p>Ngày đặt: {booking.booking_date.split("T")[0]}</p>
              <p>
                Giờ: {booking.time_start.split("T")[1].substring(0, 5)} -{" "}
                {booking.time_end.split("T")[1].substring(0, 5)}
              </p>
              <p>
                Tổng giá: {parseInt(booking.total_price).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
              <p>Trạng thái: <span className={booking.Status === "Pending" ? "text-yellow-500" : "text-green-500"}>{booking.Status}</span></p>
            </div>
            {booking.Status === "Pending" && (
              <Button
                onClick={() => handleCancel(booking.booking_id)}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Hủy
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingHistory;