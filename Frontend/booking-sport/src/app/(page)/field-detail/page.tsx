"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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


const FieldDetail = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        date: new Date(),
        duration: "1.5",
        note: "",
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
    
    const schedule: DaySlot[] = [
        generateDaySlot("Monday", "2025-04-08"),
        generateDaySlot("Tuesday", "2025-04-09")
    ];
    const [images, setImages] = useState<string[]>([]);
    const [fieldInfo, setFieldInfo] = useState<{
        name: string;
        address: string;
        rating: number;
        openTime: string;
        numberOfFields: number;
        price: string;
        services: { icon: JSX.Element; text: string }[];
    } | null>(null);
 
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    // Dữ liệu giả
    const fakeImages = ["/images/stadium.jpg", "/images/stadium.jpg", "/images/stadium.jpg","/images/stadium.jpg","/images/stadium.jpg"];
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
                setFieldInfo(fakeFieldInfo);
            }
        };

        fetchFieldData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
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

    if (!fieldInfo) return null; // Có thể thêm spinner nếu muốn

    return (
        <div className="mt-[70px] flex-col bg-white h-auto w-full">
            {/* Fields Info */}
            <div className="flex bg-white flex-col md:flex-row gap-2 items-start justify-between pt-[30px] pb-[30px] ml-[20px] mr-[20px] md:mr-[50px]">
                <div className="flex flex-col gap-3 items-start text-center md:items-start">
                    <h1 className="pl-[20px] text-3xl font-bold md:text-3xl md:pl-7">{fieldInfo.name}</h1>
                    <div className="flex items-center gap-2 md:pl-6">
                        <FaMapMarkerAlt size={24} className="text-red-500 ml-[20px] md:ml-[0px]" />
                        <h3 className="text-md ">{fieldInfo.address}</h3>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-end md:justify-end gap-5 mt-5 md:mt-0 w-full md:w-auto pr-5">
                    <div className="flex items-center justify-center flex-col gap-2">
                        <p>Đánh giá</p>
                        <RatingStar initialRating={fieldInfo.rating} totalStars={5} />
                    </div>
                    <HeartButton size={30} className="mb-2 md:mb-4 flex items-center justify-center" />
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

                <div className="border md:1/3 p-4 w-full md:max-w-[500px] md:w-2/4 h-auto rounded-lg flex-col justify-center gap-1 flex">
                    <h1 className="font-bold text-3xl text-black text-center rounded-lg">Thông tin sân</h1>
                    <div className="space-y-2 text-sm text-gray-700 mt-4">
                        <div className="flex justify-between">
                            <span className="font-bold text-[18px]">Giờ mở cửa:</span>
                            <span className="text-gray-600 text-[18px]">{fieldInfo.openTime}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold text-[18px]">Số lượng sân:</span>
                            <span className="text-gray-600 text-[18px]">{fieldInfo.numberOfFields} sân</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold text-[18px]">Giá sân:</span>
                            <span className="text-gray-600 text-[18px]">{fieldInfo.price}</span>
                        </div>
                    </div>
                    <div className="mt-5">
                        <p className="font-bold">✔ Dịch vụ tiện ích:</p>
                        <ul className="grid mt-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pl-6">
                            {fieldInfo.services.map((service, idx) => (
                                <li key={idx} className="flex items-center justify-center text-center gap-2 p-2 bg-gray-300 h-[50px] rounded-md mb-2 max-w-[160px] w-full">
                                    {service.icon}
                                    {service.text}
                                </li>
                            ))}
                        </ul>
                    </div>
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
                                <Select value={form.duration} onValueChange={(value) => setForm({ ...form, duration: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn thời lượng" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1.5">1.5 giờ</SelectItem>
                                        <SelectItem value="2">2 giờ</SelectItem>
                                        <SelectItem value="2.5">2.5 giờ</SelectItem>
                                        <SelectItem value="3">3 giờ</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={form.duration} onValueChange={(value) => setForm({ ...form, duration: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn giờ bắt đ" />
                                    </SelectTrigger>
                                    <SelectContent>
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
                            <Button onClick={handleSubmit}>Đặt sân</Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Schedule */}
                <div className="p-4 space-y-4">
                    <h1 className="text-2xl font-bold">Chi tiết sân</h1>
                    <TimeSlotGrid schedule={schedule} />
                </div>
            </div>
        </div>
    );
};

export default FieldDetail;
