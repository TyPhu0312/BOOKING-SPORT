
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import axios, { AxiosError } from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { FaMapMarkerAlt } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeartButton from "@/components/features/heart-button";
import TimeSlotGrid from "@/components/features/TimeSlotGrid";

interface Space_Per_Hour {
    space_per_hour_id: string;
    from_hour_value: string;
    to_hour_value: string;
    price: number;
    FieldID: string;
}

interface Booking {
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
    Booking: Booking[];
    Space_Per_Hour: Space_Per_Hour[];
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
    } | null; // Cập nhật để cho phép null
}

interface TimeSlot {
    time: string;
    available: boolean;
    price: number;
}

interface DaySlot {
    dayLabel: string;
    date: string;
    slots: TimeSlot[];
}

const FieldDetail = () => {
    const router = useRouter();
    const { id } = useParams();
    const field_id = id as string;

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        date: new Date(),
        duration: "1",
        startTime: "",
        note: "",
    });

    const [images, setImages] = useState<string[]>([]);
    const [fieldInfo, setFieldInfo] = useState<FieldDetail | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [schedule, setSchedule] = useState<DaySlot[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Kiểm tra đăng nhập
    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
            alert("Vui lòng đăng nhập để đặt sân!");
            router.push("/login");
        }
    }, [router]);

    // Lấy thông tin sân
    useEffect(() => {
        const fakeImages = ["/images/stadium.jpg", "/images/stadium.jpg", "/images/stadium.jpg", "/images/stadium.jpg", "/images/stadium.jpg"];

        const fetchField = async () => {
            if (!field_id || field_id === "undefined") {
                setError("Không tìm thấy ID sân. Vui lòng thử lại.");
                setImages(fakeImages);
                return;
            }

            try {
                const res = await axios.get<FieldDetail>(`http://localhost:5000/api/admin/fields/getById/${field_id}`);
                const fieldData = res.data;

                // Chuẩn hóa image_url
                let imageUrl = fieldData.image_url;
                if (imageUrl && !imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
                    imageUrl = `http://localhost:5000/images/${imageUrl}`;
                } else if (!imageUrl) {
                    imageUrl = fakeImages[0];
                }

                setFieldInfo(fieldData);
                setImages([imageUrl, ...fakeImages.slice(1)]);
            } catch (error) {
                console.error("Lỗi khi fetch sân:", error);
                setImages(fakeImages);
                setError("Không thể tải thông tin sân. Vui lòng thử lại.");
            }
        };

        fetchField();
    }, [field_id]);

    // Lấy dữ liệu lịch
    useEffect(() => {
        const fetchScheduleAndBookings = async () => {
            try {
                const bookingsRes = await axios.get<Booking[]>("http://localhost:5000/api/admin/booking/get");
                const bookings = bookingsRes.data.filter((b) => b.FieldID === field_id);

                const scheduleRes = await axios.get<FieldDetail>(`http://localhost:5000/api/admin/fields/getById/${field_id}`);
                const fieldSchedule = scheduleRes.data.Fields_Schedule;

                // Kiểm tra fieldSchedule có tồn tại và hợp lệ
                if (!fieldSchedule || !fieldSchedule.open_time || !fieldSchedule.close_time) {
                    setError("Không có thông tin lịch sân. Vui lòng liên hệ quản trị viên.");
                    setSchedule([]);
                    return;
                }

                // Xử lý open_time và close_time với định dạng linh hoạt
                const parseTime = (time: string) => {
                    // Nếu thời gian ở định dạng ISO (có "T")
                    if (time.includes("T")) {
                        return parseInt(time.split("T")[1].split(":")[0]);
                    }
                    // Nếu thời gian chỉ là "HH:mm"
                    return parseInt(time.split(":")[0]);
                };

                const openHour = parseTime(fieldSchedule.open_time);
                const closeHour = parseTime(fieldSchedule.close_time);

                if (isNaN(openHour) || isNaN(closeHour)) {
                    setError("Định dạng giờ mở/đóng không hợp lệ.");
                    setSchedule([]);
                    return;
                }

                const newSchedule: DaySlot[] = [];
                const today = new Date();
                for (let i = 0; i < 14; i++) {
                    const date = new Date(today);
                    date.setDate(today.getDate() + i);
                    const dayLabel = date.toLocaleDateString("en-US", { weekday: "long" });
                    const dateStr = date.toISOString().split("T")[0];

                    const slots = Array.from({ length: 24 }, (_, hour) => {
                        const hourStr = `${hour.toString().padStart(2, "0")}:00`;
                        const isBooked = bookings.some((b) => {
                            const bookingDate = b.booking_date.split("T")[0];
                            const bookingStart = parseInt(b.time_start.split("T")[1].split(":")[0]);
                            const bookingEnd = parseInt(b.time_end.split("T")[1].split(":")[0]);
                            return bookingDate === dateStr && hour >= bookingStart && hour < bookingEnd;
                        });

                        const isWithinOperatingHours = hour >= openHour && hour < closeHour;

                        const price = fieldInfo?.Space_Per_Hour?.length
                            ? Math.min(...fieldInfo.Space_Per_Hour.map((sph) => sph.price))
                            : 0;

                        return { time: hourStr, available: !isBooked && isWithinOperatingHours, price };
                    });

                    newSchedule.push({ dayLabel, date: dateStr, slots });
                }

                setSchedule(newSchedule);
            } catch (error) {
                console.error("Lỗi khi lấy lịch:", error);
                setError("Không thể tải lịch sân. Vui lòng thử lại.");
                setSchedule([]);
            }
        };

        if (field_id && fieldInfo) fetchScheduleAndBookings();
    }, [field_id, fieldInfo]);

    const generateTimeOptions = () => {
        const times: string[] = [];
        for (let hour = 0; hour < 24; hour++) {
            const hourStr = hour.toString().padStart(2, '0');
            times.push(`${hourStr}:00`);
            times.push(`${hourStr}:30`);
        }
        return times;
    };

    const handleSubmit = async () => {
        setError(null);

        if (!form.startTime || !form.duration || !form.date) {
            setError("Vui lòng chọn ngày, giờ bắt đầu và thời lượng.");
            return;
        }

        try {
            const unitPrice = fieldInfo?.Space_Per_Hour?.length
                ? Math.min(...fieldInfo.Space_Per_Hour.map((sph) => sph.price))
                : 0;

            const parseTime = (time: string) => {
                const [hour, minute] = time.split(":").map(Number);
                return hour * 60 + minute;
            };

            const startMinutes = parseTime(form.startTime);
            const durationMinutes = parseFloat(form.duration) * 60;
            const endMinutes = startMinutes + durationMinutes;

            const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, "0")}:${(endMinutes % 60).toString().padStart(2, "0")}`;

            const total_price = Math.round(unitPrice * parseFloat(form.duration));
            const deposit = Math.round(total_price * 0.3);

            const userId = localStorage.getItem("user_id");
            if (!userId) {
                alert("Vui lòng đăng nhập để đặt sân!");
                router.push("/login");
                return;
            }

            // Kiểm tra khung giờ khả dụng
            const bookingsRes = await axios.get<Booking[]>("http://localhost:5000/api/admin/booking/get");
            const bookings = bookingsRes.data.filter(
                (b) => b.FieldID === field_id && b.booking_date.split("T")[0] === form.date.toISOString().split("T")[0]
            );

            const isTimeSlotBooked = bookings.some((b) => {
                const bookingStart = parseTime(b.time_start.split("T")[1].substring(0, 5));
                const bookingEnd = parseTime(b.time_end.split("T")[1].substring(0, 5));
                return (
                    (startMinutes >= bookingStart && startMinutes < bookingEnd) ||
                    (endMinutes > bookingStart && endMinutes <= bookingEnd) ||
                    (startMinutes <= bookingStart && endMinutes >= bookingEnd)
                );
            });

            if (isTimeSlotBooked) {
                setError("Khung giờ đã chọn không khả dụng. Vui lòng chọn khung giờ khác.");
                return;
            }

            const response = await axios.post("http://localhost:5000/api/admin/booking/create", {
                booking_date: form.date.toISOString().split("T")[0],
                time_start: form.startTime,
                time_end: endTime,
                total_price: total_price.toString(),
                deposit: deposit.toString(),
                Status: "Pending",
                prove_payment: "",
                UserID: userId,
                FieldID: field_id,
            });

            if (response.status === 201) {
                alert("Đặt sân thành công!");
                router.push("/user/bookings");
            }
        } catch (err: unknown) {
            const error = err as AxiosError<{ error?: string }>;
            console.error("Lỗi khi đặt sân", error);
            setError(error.response?.data?.error || "Đặt sân thất bại. Vui lòng thử lại.");
        }
    };

    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);

    if (!fieldInfo) return <p className="text-center mt-20">Đang tải thông tin sân...</p>;

    return (
        <div className="mt-[70px] flex-col bg-white h-auto w-full">
            <div className="flex bg-white flex-col md:flex-row gap-10 items-start justify-start pt-[30px] pb-[30px]">
                <div className="flex flex-col gap-3 items-start text-center md:items-start md:pl-[190px]">
                    <h1 className="pl-[20px] text-3xl font-bold md:text-3xl md:pl-7">{fieldInfo?.field_name}</h1>
                    <div className="flex items-center gap-2 md:pl-6">
                        <FaMapMarkerAlt size={24} className="text-red-500 ml-[20px] md:ml-[0px]" />
                        <h3 className="text-md ">{fieldInfo?.location}</h3>
                    </div>
                </div>
            </div>

            <div className="max-w-[1469px] flex flex-col md:flex-row items-center md:items-start gap-4 h-auto mx-auto p-5 bg-white">
                <div className="relative md:w-2/4 w-full h-[400px] overflow-hidden rounded-lg">
                    <Image
                        src={images[currentImageIndex]}
                        alt="Main"
                        fill
                        className="object-cover transition-all duration-500"
                    />
                    <Button onClick={prevImage} className="absolute top-1/2 left-2 z-10 bg-black/50 text-white hover:bg-black/80" size="icon">
                        <ChevronLeft />
                    </Button>
                    <Button onClick={nextImage} className="absolute top-1/2 right-2 z-10 bg-black/50 text-white hover:bg-black/80" size="icon">
                        <ChevronRight />
                    </Button>
                </div>

                <ScrollArea className="h-[120px] md:h-[400px] w-full md:w-auto rounded-md p-2 overflow-x-auto md:overflow-y-auto">
                    <div className="flex flex-row md:flex-col gap-4 items-start">
                        {images.map((src, index) => (
                            <div
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`relative h-[80px] w-[130px] rounded-2xl shrink-0 cursor-pointer border-3 transition-all duration-300 ${currentImageIndex === index ? "border-blue-900 shadow-xl" : "border-transparent"} hover:shadow-md`}
                            >
                                <Image
                                    src={src}
                                    alt={`Image ${index}`}
                                    fill
                                    className="object-cover rounded-lg transition-transform duration-300 ease-in-out hover:scale-105"
                                />
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <div className=" md:1/3 p-4 w-full md:max-w-[500px] md:w-2/4 h-auto rounded-lg flex-col justify-center gap-1 flex">
                    <Button
                        className="bg-black text-xl text-white hover:bg-gray-900 cursor-pointer mb-4 w-full md:w-auto block md:hidden"
                        onClick={() => router.push(`/OrderField?field_id=${field_id}`)}
                    >
                        Đặt sân ngay
                    </Button>
                    <h1 className="font-bold text-3xl text-black text-center rounded-lg">Thông tin sân</h1>
                    <div className="space-y-2 text-sm text-gray-700 mt-4">
                        <div className="flex justify-between">
                            <span className="font-bold text-[18px]">Giờ mở cửa:</span>
                            <span className="text-gray-600 text-[18px]">
                                {fieldInfo.Fields_Schedule?.open_time
                                    ? fieldInfo.Fields_Schedule.open_time.substring(11, 16)
                                    : "Chưa có thông tin"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold text-[18px]">Số lượng sân:</span>
                            <span className="text-gray-600 text-[18px]">{fieldInfo?.option?.number_of_field ?? 1} sân</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold text-[18px]">Giá sân:</span>
                            <span className="text-gray-600 text-[18px]">
                                {(fieldInfo.Space_Per_Hour?.length
                                    ? Math.min(...fieldInfo.Space_Per_Hour.map((sph: Space_Per_Hour) => sph.price))
                                    : 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                            </span>
                        </div>
                    </div>
                    <div className="mt-5">
                        <p className="font-bold">✔ Dịch vụ tiện ích:</p>
                        <div className="flex justify-center md:flex-row md:items-center md:justify-center gap-15 md:gap-5 mt-5 md:mt-5 w-full md:w-auto pr-5">
                            <div className="flex items-center justify-center flex-col gap-2">
                                <span className="mr-2">⭐ Đánh giá: 4.7/5</span>
                            </div>
                            <HeartButton size={30} className="mb-2 md:mb-4 flex items-center justify-center" />
                        </div>
                    </div>
                    <Button
                        className="bg-black text-xl text-white hover:bg-gray-900 cursor-pointer w-full md:w-auto mt-4 hidden md:block"
                        onClick={() => router.push(`/OrderField?field_id=${field_id}`)}
                    >
                        Đặt sân ngay
                    </Button>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto p-4 flex-col md:flex-row md:flex gap-4">
                <div className="w-full md:w-1/3 space-y-4">
                    <Card>
                        <CardContent className="space-y-4 pt-4 flex justify-center items-center flex-col">
                            <h1 className="text-2xl font-bold">Đặt sân tại đây</h1>
                            {error && <p className="text-red-500">{error}</p>}
                            <Input placeholder="Họ và tên" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                            <Input placeholder="Số điện thoại" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                            <Calendar mode="single" selected={form.date} onSelect={(date) => date && setForm({ ...form, date })} />
                            <div className="flex gap-4 w-full items-center justify-center">
                                <Select
                                    value={form.startTime}
                                    onValueChange={(value) => setForm({ ...form, startTime: value })}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Chọn thời gian bắt đầu" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {generateTimeOptions().map((time) => (
                                            <SelectItem key={time} value={time}>
                                                {time}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={form.duration}
                                    onValueChange={(value) => setForm({ ...form, duration: value })}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Chọn thời lượng" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1 giờ</SelectItem>
                                        <SelectItem value="1.5">1.5 giờ</SelectItem>
                                        <SelectItem value="2">2 giờ</SelectItem>
                                        <SelectItem value="2.5">2.5 giờ</SelectItem>
                                        <SelectItem value="3">3 giờ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Textarea
                                placeholder="Ghi chú"
                                value={form.note}
                                onChange={(e) => setForm({ ...form, note: e.target.value })}
                            />
                            <Button onClick={handleSubmit}>Đặt sân tại đây</Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="p-4 space-y-4">
                    <h1 className="text-2xl font-bold">Chi tiết sân</h1>
                    <div className="w-full overflow-x-auto">
                        <TimeSlotGrid schedule={schedule} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FieldDetail;
