"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { FaMapMarkerAlt } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeartButton from "@/components/features/heart-button";
import TimeSlotGrid from "@/components/features/TimeSlotGrid";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface SpacePerHour {
    space_per_hour_id: string;
    from_hour_value: string;
    to_hour_value: string;
    price: number;
    FieldID: string;
    day_of_week: string;
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

interface FieldSchedule {
    schedule_id: string;
    day_of_week: string;
    open_time: string;
    close_time: string;
    FieldID: string;
    isClosed: boolean;
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
    Space_Per_Hour: SpacePerHour[];
    Hours: {
        hours_id: string;
        hour_value: number;
        status_hour_on: string;
        status_hour_off: string;
        FieldID: string;
    }[];
    schedules: FieldSchedule[];
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
    isClosed: boolean;
}

const FieldDetail = () => {
    const router = useRouter();
    const { id } = useParams();
    const field_id = id as string;
    const [images, setImages] = useState<string[]>([]);
    const [fieldInfo, setFieldInfo] = useState<FieldDetail | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [schedule, setSchedule] = useState<DaySlot[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<Date>(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    });
    const [endDate, setEndDate] = useState<Date>(() => {
        const date = new Date();
        date.setDate(date.getDate() + 13);
        date.setHours(0, 0, 0, 0);
        return date;
    });

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
                console.log("Bookings:", bookings);

                const scheduleRes = await axios.get<FieldDetail>(`http://localhost:5000/api/admin/fields/getById/${field_id}`);
                const fieldSchedules = scheduleRes.data.schedules;
                const spacePerHour = scheduleRes.data.Space_Per_Hour;
                console.log("Field Schedules:", fieldSchedules);
                console.log("Space Per Hour:", spacePerHour);

                if (!fieldSchedules || fieldSchedules.length === 0) {
                    setError("Sân chưa được thiết lập lịch hoạt động. Vui lòng liên hệ quản trị viên.");
                    setSchedule([]);
                    return;
                }

                const newSchedule: DaySlot[] = [];
                const dayOfWeekMap: { [key: number]: string } = {
                    0: "Chủ Nhật",
                    1: "Thứ Hai",
                    2: "Thứ Ba",
                    3: "Thứ Tư",
                    4: "Thứ Năm",
                    5: "Thứ Sáu",
                    6: "Thứ Bảy",
                };
                const dayOfWeekShortMap: { [key: number]: string } = {
                    0: "Sun",
                    1: "Mon",
                    2: "Tue",
                    3: "Wed",
                    4: "Thu",
                    5: "Fri",
                    6: "Sat",
                };

                if (endDate < startDate) {
                    setError("Ngày kết thúc không được trước ngày bắt đầu.");
                    setSchedule([]);
                    return;
                }

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                console.log("Today:", today);
                console.log("Start Date:", startDate);
                console.log("End Date:", endDate);

                if (startDate < today) {
                    setStartDate(today);
                    setError("Ngày bắt đầu không được trước ngày hiện tại. Đã điều chỉnh về hôm nay.");
                    return;
                }

                const timeDiff = endDate.getTime() - startDate.getTime();
                const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

                if (daysDiff > 30) {
                    setError("Khoảng thời gian không được vượt quá 30 ngày.");
                    setSchedule([]);
                    return;
                }

                for (let i = 0; i < daysDiff; i++) {
                    const date = new Date(startDate.getTime());
                    date.setDate(startDate.getDate() + i);
                    date.setHours(0, 0, 0, 0);
                    console.log("Processing Date:", date);

                    const dayOfWeekIndex = date.getDay();
                    const dayOfWeek = dayOfWeekShortMap[dayOfWeekIndex];
                    const dayLabel = dayOfWeekMap[dayOfWeekIndex] || "Unknown";
                    const dateStr = date.toISOString().split("T")[0];

                    const fieldSchedule = fieldSchedules.find((schedule) => schedule.day_of_week === dayOfWeek);
                    const isClosed = !fieldSchedule || fieldSchedule.isClosed || !fieldSchedule.open_time || !fieldSchedule.close_time;

                    if (isClosed) {
                        newSchedule.push({
                            dayLabel,
                            date: dateStr,
                            slots: [],
                            isClosed: true,
                        });
                        continue;
                    }

                    const parseTime = (time: string): number => {
                        const hour = parseInt(time.split(":")[0].split("T")[1] || time.split(":")[0]);
                        return isNaN(hour) ? 0 : hour;
                    };

                    const openHour = parseTime(fieldSchedule.open_time);
                    const closeHour = parseTime(fieldSchedule.close_time);

                    if (openHour >= closeHour) {
                        newSchedule.push({
                            dayLabel,
                            date: dateStr,
                            slots: [],
                            isClosed: true,
                        });
                        continue;
                    }

                    const relevantPrices = spacePerHour.filter((sph) => sph.day_of_week === dayOfWeek);
                    console.log("Relevant Prices for", dayOfWeek, ":", relevantPrices);

                    const slots: TimeSlot[] = [];
                    for (let hour = openHour; hour < closeHour; hour++) {
                        const hourStr = `${hour.toString().padStart(2, "0")}:00`;

                        const isBooked = bookings.some((b) => {
                            const bookingDate = new Date(b.booking_date);
                            bookingDate.setHours(0, 0, 0, 0);
                            const bookingDateStr = bookingDate.toISOString().split("T")[0];
                            const bookingStart = parseInt(b.time_start.includes("T") ? b.time_start.split("T")[1].split(":")[0] : b.time_start.split(":")[0]);
                            const bookingEnd = parseInt(b.time_end.includes("T") ? b.time_end.split("T")[1].split(":")[0] : b.time_end.split(":")[0]);
                            return bookingDateStr === dateStr && hour >= bookingStart && hour < bookingEnd;
                        });

                        const priceEntry = relevantPrices.find((sph) => {
                            const fromHour = parseInt(sph.from_hour_value.split(":")[0]);
                            const toHour = parseInt(sph.to_hour_value.split(":")[0]);
                            return hour >= fromHour && hour < toHour;
                        });

                        const price = priceEntry ? priceEntry.price : 0;

                        slots.push({
                            time: hourStr,
                            available: !isBooked,
                            price,
                        });
                    }

                    newSchedule.push({
                        dayLabel,
                        date: dateStr,
                        slots,
                        isClosed: false,
                    });
                }

                if (newSchedule.every((day) => day.isClosed)) {
                    setError("Không có ngày nào mở cửa trong khoảng thời gian được chọn.");
                    setSchedule([]);
                    return;
                }

                setSchedule(newSchedule);
                console.log("Generated Schedule:", newSchedule);
            } catch (error) {
                console.error("Lỗi khi lấy lịch:", error);
                setError("Không thể tải lịch sân. Vui lòng thử lại.");
                setSchedule([]);
            }
        };

        if (field_id && fieldInfo) fetchScheduleAndBookings();
    }, [field_id, fieldInfo, startDate, endDate]);

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
                        <h3 className="text-md">{fieldInfo?.location}</h3>
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

                <div className="md:1/3 p-4 w-full md:max-w-[500px] md:w-2/4 h-auto rounded-lg flex-col justify-center gap-1 flex">
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
                                {fieldInfo.schedules?.length > 0 && fieldInfo.schedules[0].open_time
                                    ? fieldInfo.schedules[0].open_time.substring(11, 16)
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
                                    ? Math.min(...fieldInfo.Space_Per_Hour.map((sph: SpacePerHour) => sph.price))
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
                <div className="p-4 space-y-4 w-full">
                    <h1 className="text-2xl font-bold">Chi tiết sân</h1>
                    <div className="flex gap-4 mb-4">
                        <div>
                            <label className="block mb-1 font-medium">Từ ngày:</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {format(startDate, "dd/MM/yyyy")}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={(date) => date && setStartDate(date)}
                                        initialFocus
                                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Đến ngày:</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {format(endDate, "dd/MM/yyyy")}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        onSelect={(date) => date && setEndDate(date)}
                                        initialFocus
                                        disabled={(date) => date < startDate}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="w-full max-w-full overflow-x-auto">
                        <TimeSlotGrid schedule={schedule} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FieldDetail;