"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
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
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { FaMapMarkerAlt, FaWifi, FaBasketballBall, FaCookieBite, FaCoffee, FaCar } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeartButton from "@/components/features/heart-button";
import RatingStar from "@/components/features/ratingStar";
import TimeSlotGrid from "@/components/features/TimeSlotGrid";
// import { useRouter } from "next/router";
import { useParams } from 'next/navigation';


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
        note: "",
        startTime: "",
    });
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
    const generateDaySlot = (dayLabel: string, date: string): DaySlot => {
        const slots = Array.from({ length: 24 }, (_, i) => {
            const hourStr = String(i).padStart(2, '0') + ":00";
            const available = Math.random() > 0.3;
            const price = available ? Math.floor(Math.random() * 100000) + 50000 : 0;
            return { time: hourStr, available, price };
        });

        return { dayLabel, date, slots };
    };
    const generateTimeOptions = () => {
        const times: string[] = [];
        for (let hour = 0; hour < 24; hour++) {
            const hourStr = hour.toString().padStart(2, '0');
            times.push(`${hourStr}:00`);
            times.push(`${hourStr}:30`);
        }
        return times;
    };

    const schedule: DaySlot[] = [
        generateDaySlot("Monday", "2025-04-08"),
        generateDaySlot("Tuesday", "2025-04-09"),
        generateDaySlot("Wednesday", "2025-04-10"),
        generateDaySlot("Thursday", "2025-04-11"),
        generateDaySlot("Friday", "2025-04-12"),
        generateDaySlot("Saturday", "2025-04-13"),
        generateDaySlot("Sunday", "2025-04-14"),
        generateDaySlot("Monday", "2025-04-15"),
        generateDaySlot("Tuesday", "2025-04-16"),
        generateDaySlot("Wednesday", "2025-04-17"),
        generateDaySlot("Thursday", "2025-04-18"),
        generateDaySlot("Friday", "2025-04-19"),
        generateDaySlot("Saturday", "2025-04-20"),
        generateDaySlot("Sunday", "2025-04-21"),
    ];

    const [images, setImages] = useState<string[]>([]);
    const [fieldInfo, setFieldInfo] = useState<FieldDetail | null>(null);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    // Dữ liệu giả
    const fakeImages = ["/images/stadium.jpg", "/images/stadium.jpg", "/images/stadium.jpg", "/images/stadium.jpg", "/images/stadium.jpg"];
    const fakeFieldInfo = {
        name: "Sân cầu lông Quỳnh Anh Shyn",
        address: "Đường Cao Lỗ, Phường 4, Quận 8, Hồ Chí Minh",
        rating: 4,
        openTime: "6h - 23h",
        numberOfFields: 2,
        price: "150.000đ",
        services: [
            { icon: <FaWifi className="text-blue-500" />, text: "Wifi miễn phí" },
            { icon: <FaBasketballBall className="text-green-500" />, text: "Cho thuê vợt" },
            { icon: <FaCookieBite className="text-yellow-500" />, text: "Thức ăn nhẹ" },
            { icon: <FaCoffee className="text-brown-500" />, text: "Nước ngọt các loại" },
            { icon: <FaCoffee className="text-brown-500" />, text: "Trà đá" },
            { icon: <FaCar className="text-gray-500" />, text: "Bãi đỗ xe ô tô" },
        ],
    };
    useEffect(() => {
        const fetchFieldData = async () => {
            try {
                const [imageRes, infoRes] = await Promise.all([
                    axios.get("/api/field/images"),
                    axios.get("/api/field/info"),
                    axios.get("/api/field/schedule"),
                ]);
                setImages(imageRes.data);
                setFieldInfo(infoRes.data);
            } catch (error) {
                console.error("Lỗi fetch dữ liệu:", error);
                setImages(fakeImages);
            }
        };

        fetchFieldData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fetchField = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/admin/fields/getById/${field_id}`);
                setFieldInfo(res.data);
            } catch (error) {
                console.error("Lỗi khi fetch sân:", error);
            }
        };

        if (field_id) fetchField();
    }, [field_id]);
    const handleSubmit = async () => {
        try {
            await axios.post("/api/book", form);
            alert("Đặt sân thành công!");
        } catch (err) {
            console.error("Lỗi khi đặt sân", err);
            alert("Đặt sân thất bại");
        }
    };

    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);

    if (!fieldInfo) return <p className="text-center mt-20">Đang tải thông tin sân...</p>;

    return (
        <div className="mt-[70px] flex-col bg-white h-auto w-full">
            {/* Fields Info */}
            <div className="flex bg-white flex-col md:flex-row gap-10 items-start justify-start pt-[30px] pb-[30px]">
                <div className="flex flex-col gap-3 items-start text-center md:items-start md:pl-[190px]">
                    <h1 className="pl-[20px] text-3xl font-bold md:text-3xl md:pl-7">{fieldInfo?.field_name}</h1>
                    <div className="flex items-center gap-2 md:pl-6">
                        <FaMapMarkerAlt size={24} className="text-red-500 ml-[20px] md:ml-[0px]" />
                        <h3 className="text-md ">{fieldInfo?.location}</h3>
                    </div>
                </div>


            </div>

            {/* Main Content */}
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
                                className={`relative h-[80px] w-[130px] rounded-2xl shrink-0 cursor-pointer border-3 transition-all duration-300 ${currentImageIndex === index ? "border-blue-900 shadow-xl" : "border-transparent"
                                    } hover:shadow-md`}
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
                        onClick={() => router.push("/OrderField")}
                    >
                        Đặt sân ngay
                    </Button>
                    <h1 className="font-bold text-3xl text-black text-center rounded-lg">Thông tin sân</h1>
                    <div className="space-y-2 text-sm text-gray-700 mt-4">
                        <div className="flex justify-between">
                            <span className="font-bold text-[18px]">Giờ mở cửa:</span>
                            <span className="text-gray-600 text-[18px]">{(fieldInfo.Fields_Schedule.open_time).substring(11, 16)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold text-[18px]">Số lượng sân:</span>
                            <span className="text-gray-600 text-[18px]">{fieldInfo?.option?.number_of_field ?? 1} sân</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold text-[18px]">Giá sân:</span>
                            <span className="text-gray-600 text-[18px]">{(fieldInfo.Space_Per_Hour?.length
                                ? Math.min(...fieldInfo.Space_Per_Hour.map((sph: any) => sph.price))
                                : 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
                        </div>
                    </div>
                    <div className="mt-5">
                        <p className="font-bold">✔ Dịch vụ tiện ích:</p>
                        {/* <ul className="grid mt-3 grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 pl-6">
                            {fieldInfo.services.map((service, idx) => (
                                <li key={idx} className="flex items-center justify-center text-center gap-2 p-2 bg-gray-300 h-[50px] rounded-md mb-2 max-w-[160px] w-full">
                                    {service.icon}
                                    {service.text}
                                </li>
                            ))}
                        </ul> */}
                        <div className="flex justify-center md:flex-row md:items-center md:justify-center gap-15 md:gap-5 mt-5 md:mt-5 w-full md:w-auto pr-5">
                            <div className="flex items-center justify-center flex-col gap-2">
                                <span className="mr-2">⭐ Đánh giá: 4.7/5</span> 
                                {/* <RatingStar initialRating={fieldInfo.rating} totalStars={5} /> */}
                            </div>
                            <HeartButton size={30} className="mb-2 md:mb-4 flex items-center justify-center" />
                        </div>
                    </div>
                    <Button
                        className="bg-black text-xl text-white hover:bg-gray-900 cursor-pointer w-full md:w-auto mt-4 hidden md:block"
                        onClick={() => router.push(`/OrderField/?field_id=${field_id}`)}
                    >
                        Đặt sân ngay
                    </Button>
                </div>
            </div>

            {/* Booking Form */}
            <div className="max-w-[1400px] mx-auto p-4 flex-col md:flex-row md:flex gap-4">
                <div className="w-full md:w-1/3 space-y-4">
                    <Card>
                        <CardContent className="space-y-4 pt-4 flex justify-center items-center flex-col">
                            <h1 className="text-2xl font-bold">Đặt sân tại đây</h1>
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

                {/* Schedule */}
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
