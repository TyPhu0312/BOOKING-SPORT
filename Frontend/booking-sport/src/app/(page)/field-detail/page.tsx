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
import { FaMapMarkerAlt } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeartButton from "@/components/features/heart-button";
import RatingStar from "@/components/features/ratingStar";
import { FaWifi, FaBasketballBall, FaCookieBite, FaCoffee, FaCar } from 'react-icons/fa';
interface TimeSlot {
    time: string;
    price: number;
    available: boolean;
}

interface DaySlot {
    date: string;
    slots: TimeSlot[];
}

const FieldDetail = () => {
    const [schedule, setSchedule] = useState<DaySlot[]>([]);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        date: new Date(),
        duration: "1.5",
        note: "",
    });

    const images = [
        "/images/stadium.jpg",
        "/images/stadium.jpg",
        "/images/stadium.jpg",
        "/images/stadium.jpg",
        "/images/stadium.jpg",
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const res = await axios.get<DaySlot[]>("/api/schedule");
                setSchedule(res.data);
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu lịch đặt sân", err);
            }
        };
        fetchSchedule();
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

    const prevImage = () => {
        setCurrentImageIndex(
            (prev) => (prev - 1 + images.length) % images.length
        );
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    return (
        <div className="mt-[70px] flex-col">
            {/* Fields Info */}
            <div className="flex flex-col md:flex-row gap-2 items-start justify-between pt-[30px] pb-[30px] ml-[20px] mr-[50px] md:mr-[0px]">
                <div className="flex flex-col gap-3 items-start">
                    <h1 className="pl-[20px] text-3xl font-bold md:text-3xl md:pl-7">Sân cầu lông Quỳnh Anh Shyn</h1>
                    <div className="flex items-center gap-2 md:pl-6">
                        <FaMapMarkerAlt size={24} className="text-red-500 ml-[20px] md:ml-[0px]" />
                        <h3 className="text-md">Đường Cao Lỗ, Phường 4, Quận 8, Hồ Chí Minh</h3>
                    </div>
                </div>
                <div className="flex gap-10 mt-5 items-end justify-start mx-auto">
                    <div className="flex items-center justify-center flex-col gap-2">
                        <p>Đánh giá</p>
                        <RatingStar initialRating={4} totalStars={5} />
                    </div>
                    <HeartButton size={30} className="mb-4" />
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1450px] flex flex-col md:flex-row items-center md:items-start gap-4 h-auto mx-auto p-5 bg-white shadow-md rounded-lg">
                {/* Main Image */}
                <div className="relative md:w-2/4 w-full h-[400px] overflow-hidden rounded-lg">
                    <Image
                        src={images[currentImageIndex]}
                        alt="Main"
                        fill
                        className="object-cover transition-all duration-500"
                    />
                    <Button
                        onClick={prevImage}
                        className="absolute top-1/2 left-2 z-10 cursor-pointer bg-black/50 text-white hover:bg-black/80"
                        size="icon"
                    >
                        <ChevronLeft />
                    </Button>
                    <Button
                        onClick={nextImage}
                        className="absolute top-1/2 right-2 z-10 cursor-pointer bg-black/50 text-white hover:bg-black/80"
                        size="icon"
                    >
                        <ChevronRight />
                    </Button>
                </div>

                {/* Thumbnails */}
                {/* Thumbnails */}
                <ScrollArea className="h-[120px] md:h-[400px] w-full md:w-auto rounded-md p-2 overflow-x-auto md:overflow-y-auto">
                    <div className="flex flex-row md:flex-col gap-4 items-start">
                        {images.map((src, index) => (
                            <div
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`relative h-[80px] w-[130px] rounded-2xl shrink-0 cursor-pointer border-3 transition-all duration-300 ${currentImageIndex === index
                                    ? "border-blue-900 shadow-xl"
                                    : "border-transparent"
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


                {/* Field Info */}
                <div className="border md:1/3 p-4 w-full md:max-w-[500px] md:w-2/4 h-auto rounded-lg flex-col justify-center gap-4 flex">
                    <h1 className="font-bold text-3xl">Thông tin sân</h1>
                    <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex justify-between">
                            <span className="font-bold text-[18px]">Giờ mở cửa:</span>
                            <span className="text-gray-600">6h - 23h</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold text-[18px]">Số lượng sân:</span>
                            <span className="text-gray-600">2 sân</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold text-[18px]">Giá sân:</span>
                            <span className="text-gray-600">150.000đ</span>
                        </div>
                    </div>


                    <div className="mt-5 ">
                        <p className="font-bold">✔ Dịch vụ tiện ích:</p>
                        <ul className="grid mt-3 grid-cols-1 h-auto md:h-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 pl-6">
                            <li className="flex items-center justify-center text-center gap-2 p-2 bg-gray-300 h-[50px] rounded-md mb-2 max-w-[160px] w-full">
                                <FaWifi className="text-blue-500" />
                                Wifi miễn phí
                            </li>
                            <li className="flex items-center justify-center text-center gap-2 p-2 bg-gray-300 h-[50px] rounded-md mb-2 max-w-[160px] w-full">
                                <FaBasketballBall className="text-green-500" />
                                Cho thuê vợt
                            </li>
                            <li className="flex items-center justify-center text-center gap-2 p-2 bg-gray-300 h-[50px] rounded-md mb-2 max-w-[160px] w-full">
                                <FaCookieBite className="text-yellow-500" />
                                Thức ăn nhẹ
                            </li>
                            <li className="flex items-center justify-center text-center gap-2 p-2 bg-gray-300 h-[50px] rounded-md mb-2 max-w-[160px] w-full">
                                <FaCoffee className="text-brown-500" />
                                Nước ngọt các loại
                            </li>
                            <li className="flex items-center justify-center text-center gap-2 p-2 bg-gray-300 h-[50px] rounded-md mb-2 max-w-[160px] w-full">
                                <FaCoffee className="text-brown-500" />
                                Trà đá
                            </li>
                            <li className="flex items-center justify-center text-center gap-2 p-2 bg-gray-300 h-[50px] rounded-md mb-2 max-w-[160px] w-full">
                                <FaCar className="text-gray-500" />
                                Bãi đỗ xe ô tô
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Booking Form */}
            <div className="max-w-[1400px] mx-auto p-4 flex-col md:flex-row md:flex gap-4">
                <div className="w-full md:w-1/3 space-y-4">
                    <Card>
                        <CardContent className="space-y-4 pt-4">
                            <h2 className="text-lg font-semibold">Thông tin đặt sân</h2>
                            <Input placeholder="Họ và tên" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                            <Input placeholder="Số điện thoại" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                            <Calendar mode="single" selected={form.date} onSelect={(date) => date && setForm({ ...form, date })} />
                            <Select value={form.duration} onValueChange={(value) => setForm({ ...form, duration: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn thời lượng" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1 giờ</SelectItem>
                                    <SelectItem value="1.5">1.5 giờ</SelectItem>
                                    <SelectItem value="2">2 giờ</SelectItem>
                                </SelectContent>
                            </Select>
                            <Textarea placeholder="Ghi chú" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
                            <Button className="w-full" onClick={handleSubmit}>Đặt sân</Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Time Slot */}
                <div className="w-full md:w-2/3 space-y-4">
                    <Card>
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">Khung giờ</h2>
                                <div className="flex gap-2">
                                    <Button variant="outline">Khung sáng</Button>
                                    <Button>Khung chiều</Button>
                                </div>
                            </div>
                            <div className="overflow-auto">
                                <div className="grid grid-cols-7 gap-2 min-w-[800px]">
                                    {schedule.map((day) => (
                                        <div key={day.date} className="space-y-2">
                                            <div className="font-semibold text-sm text-center">{day.date}</div>
                                            {day.slots.map((slot, idx) => (
                                                <Button key={idx} variant="outline" className="w-full" disabled={!slot.available}>
                                                    {slot.time} - {slot.price.toLocaleString()}đ
                                                </Button>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default FieldDetail;
