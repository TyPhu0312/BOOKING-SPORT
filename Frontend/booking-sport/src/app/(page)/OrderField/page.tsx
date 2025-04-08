// BookingPage.jsx

"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Space_Per_Hour {
  space_per_hour_id: string;
  from_hour_value: string;
  to_hour_value: string;
  price: number;
  FieldID: string;
}

interface FieldDetail {
  field_id: string;
  field_name: string;
  half_hour: boolean;
  location: string;
  description: string;
  status: string;
  image_url: string;
  create_at: string;
  OwnerID: string;
  CategoryID: string;
  OptionID: string;
  user: {
    user_id: string;
    username: string;
    passWord: string;
    email: string;
    phone_number: string;
    create_at: string;
    roleID: string;
  };
  category: {
    category_id: string;
    category_name: string;
  };
  option: {
    option_field_id: string;
    number_of_field: string;
    CategoryID: string;
  };
  Reviews: {
    review_id: string;
    rating: number;
    comment: string;
    create_at: string;
    UserID: string;
    FieldID: string;
  }[];
  Booking: {
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
  Space_Per_Hour: {
    space_per_hour_id: string;
    from_hour_value: string;
    to_hour_value: string;
    price: number;
    FieldID: string;
  }[];
  Hours: {
    hours_id: string;
    hour_value: number;
    status_hour_on: string;
    status_hour_off: string;
    FieldID: string;
  }[];
  Fields_Schedule: {
    schedule_id: string;
    day_of_week: string;
    open_time: string;
    close_time: string;
    FieldID: string;
  };
  Promotions: {
    promotion_id: string;
    discount: string;
    start_date: string;
    end_date: string;
    FieldID: string;
  }[];
}


const BookingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const field_id = searchParams.get("field_id");
  const [field, setField] = useState<FieldDetail | null>(null);

  useEffect(() => {
    const fetchField = async () => {
      try {
        const res = await axios.get(`https://booking-sport-lljl.onrender.com/api/admin/fields/getById/${field_id}`);
        setField(res.data);
      } catch (error) {
        console.error("Lỗi khi fetch sân:", error);
      }
    };

    if (field_id) fetchField();
  }, [field_id]);

  if (!field) return <p className="text-center mt-20">Đang tải thông tin sân...</p>;

  // Tạo danh sách thời gian cho dropdown (từ 06:00 AM đến 10:00 PM, cách nhau 30 phút)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 6; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const period = hour < 12 ? 'AM' : 'PM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const time = `${displayHour}:${minute === 0 ? '00' : minute} ${period}`;
        times.push(time);
      }
    }
    return times;
  };

  const handleSubmit = async () => {
    try {
        await axios.post("/api/book");
        alert("Đặt sân thành công!");
        router.push(`/page`);
    } catch (err) {
        console.error("Lỗi khi đặt sân", err);
        alert("Đặt sân thất bại");
        
        
    }
};

  const timeOptions = generateTimeOptions();


  return (
    <div className="w-[75%] mx-auto p-6 bg-gray-100 min-h-screen">
      {/* Tiêu đề */}
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 mt-20">
        Đặt Sân Thể Thao
      </h1>

      {/* Thông tin sân */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">{field.field_name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
          <div>
            <p className="flex items-center">
              <span className="mr-2">📍</span> {field.location}
            </p>
            <p className="flex items-center">
              <span className="mr-2">👤</span> Chủ sân: {field.user.username}
            </p>
            <p className="flex items-center">
              <span className="mr-2">🏟️</span> Trạng thái sân: {field.status || "Không có"}
            </p>
          </div>
          <div>
            <p className="flex items-center">
              <span className="mr-2">💰</span> Giá thuê: {(field.Space_Per_Hour?.length
                ? Math.min(...field.Space_Per_Hour.map((sph: any) => sph.price))
                : 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
            </p>
            <p className="flex items-center">
              <span className="mr-2">⏰</span> Giờ mở cửa: {(field.Fields_Schedule.open_time).substring(11, 16)}
            </p>
          </div>
        </div>
      </div>

      {/* Mô tả sân và Dịch vụ hữu ích (gộp chung card) */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        {/* Mô tả sân */}
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
                <span className="mr-2">⏰</span> Giờ đóng cửa: {(field.Fields_Schedule.close_time).substring(11, 16)}
              </p>
              <p className="flex items-center">
                <span className="mr-2">⭐</span> Đánh giá: 4.7/5
              </p>
            </div>
          </div>
        </div>

        {/* Dịch vụ hữu ích */}
        {/* <div>
          <h3 className="text-xl font-semibold text-gray-700 flex items-center mb-4">
            <span className="mr-2">🎉</span> Dịch vụ hữu ích
          </h3>
          <ul className="text-gray-600 list-disc list-inside columns-2">
            {field.amenities.map((amenity, index) => (
              <li key={index}>{amenity}</li>
            ))}
          </ul>
        </div> */}
      </div>

      {/* Form đặt sân */}
      <form className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chọn ngày */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Ngày đặt:
            </label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Chọn giờ (bắt đầu và kết thúc) */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Giờ đặt:
            </label>
            <div className="flex items-center space-x-4">
              <select
                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {timeOptions.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <span className="text-gray-600">→</span>
              <select
                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
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
      </form>

      {/* Thông tin thanh toán */}
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
        <img
          src="/images/qrcode.jpg"
          alt="QR Code Thanh Toán"
          className="mx-auto mt-4 max-w-[200px]"
        />
      </div>
    </div>
  );
};

export default BookingPage;