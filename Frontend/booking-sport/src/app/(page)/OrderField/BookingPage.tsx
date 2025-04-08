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


    const [form, setForm] = useState({
        booking_date: '', // dạng "YYYY-MM-DD"
        time_start: '',   // dạng "HH:mm"
        time_end: '',     // dạng "HH:mm"
        total_price: '',  // string hoặc number
        deposit: '',      // string hoặc number
        Status: 'Pending',
        prove_payment: '', // ví dụ: 'none' hoặc URL
        UserID: '',       // ID người dùng
        FieldID: '',      // ID sân
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
                const res = await axios.get(`https://booking-sport-lljl.onrender.com/api/admin/fields/getById/${field_id}`);
                setField(res.data);
            } catch (error) {
                console.error("Lỗi khi fetch sân:", error);
            }
        };
        if (field_id) {
            setForm((prev) => ({
                ...prev,
                FieldID: field_id,
            }));
        }

        if (field_id) fetchField();
    }, [field_id]);



    // Tạo danh sách thời gian cho dropdown (từ 06:00 AM đến 10:00 PM, cách nhau 30 phút)
    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 6; hour <= 22; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const hourStr = hour.toString().padStart(2, '0');
                const minuteStr = minute.toString().padStart(2, '0');
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
        try {
            const unitPrice = field?.Space_Per_Hour?.length
                ? Math.min(...field.Space_Per_Hour.map((sph) => sph.price))
                : 0;

            const timeStart24h = form.time_start;
            const timeEnd24h = form.time_end;

            const parseTime = (time: string) => {
                const [hour, minute] = time.split(":").map(Number);
                return hour * 60 + minute;
            };

            const startMinutes = parseTime(timeStart24h);
            const endMinutes = parseTime(timeEnd24h);
            const durationHours = (endMinutes - startMinutes) / 60;

            const total_price = Math.round(unitPrice * durationHours);
            const deposit = Math.round(total_price * 0.3);

            const response = await axios.post("https://booking-sport-lljl.onrender.com/api/admin/booking/create", {
                booking_date: form.booking_date,
                time_start: timeStart24h,
                time_end: timeEnd24h,
                total_price: total_price.toString(),
                deposit: deposit.toString(),
                Status: form.Status,
                prove_payment: form.prove_payment,
                UserID: form.UserID,
                FieldID: form.FieldID,
            });

            alert("Đặt sân thành công!");
            router.push(`/`);
        } catch (err: any) {
            console.error("Lỗi khi đặt sân", err.response?.data || err.message);
            alert("Đặt sân thất bại");
        }
    };
    useEffect(() => {
        const unitPrice = field?.Space_Per_Hour?.length
            ? Math.min(...field.Space_Per_Hour.map((sph) => sph.price))
            : 0;

        if (form.time_start && form.time_end) {
            const start = form.time_start;
            const end = form.time_end;

            const [sh, sm] = start.split(":").map(Number);
            const [eh, em] = end.split(":").map(Number);

            const duration = (eh * 60 + em - (sh * 60 + sm)) / 60;

            const total_price = Math.round(unitPrice * duration);
            const deposit = Math.round(total_price * 0.3);

            setForm(prev => ({
                ...prev,
                total_price: total_price.toString(),
                deposit: deposit.toString()
            }));
        }
    }, [form.time_start, form.time_end, field]);





    const timeOptions = generateTimeOptions();
    if (!field) return <p className="text-center mt-20">Đang tải thông tin sân...</p>;

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
                            value={form.booking_date}
                            onChange={(e) => setForm({ ...form, booking_date: e.target.value })}
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
                {/* Hiển thị giá và tiền cọc */}
                {form.total_price && (
                    <div className="mt-4 text-center text-gray-700">
                        <p><strong>Tổng giá:</strong> {parseInt(form.total_price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                        <p><strong>Tiền cọc (30%):</strong> {parseInt(form.deposit).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                    </div>
                )}

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