"use client"
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
export default function FastBookingTable({ onSearch }: { onSearch: () => void }) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [startTime, setStartTime] = useState("13:30 PM");
    const [endTime, setEndTime] = useState("17:30 PM");
    const [city, setCity] = useState("hcm");
    const [district, setDistrict] = useState("quan8");
    const [ward, setWard] = useState("phuong7");
    const [fieldType, setFieldType] = useState("sanbong");
    const [fieldSize, setFieldSize] = useState("san5");
    const [minPrice, setMinPrice] = useState("150.000 VNĐ");
    const [maxPrice, setMaxPrice] = useState("450.000 VNĐ");

    return (
        <div className="w-[400px] md:w-[600px] m-auto bg-white shadow-lg flex flex-col items-center overflow-hidden">
            <div className="relative w-full h-[70px] overflow-hidden">
                {/* Hình ảnh */}
                <Image
                    src="/images/blue.png"
                    alt="Fast booking"
                    layout="fill"
                    objectFit="cover"
                    className="" // Giảm độ sáng hình (tạo hiệu ứng mờ đen)
                />
                {/* Chữ trên hình */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">Đặt sân nhanh, ưu đãi gấp!</span>
                </div>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 gap-2">
                    {/* Thời gian */}
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="w-full flex flex-col items-center md:items-start gap-2 mb-4 md:mb-1">
                            <label className="block text-sm font-medium text-center md:text-left pl-1">Thời gian</label>
                            <div className="flex flex-col md:flex-row gap-2">
                                <Popover>
                                    <div className="w-[250px]">
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-between">
                                                {date ? format(date, "dd/MM/yyyy") : "Chọn ngày"}
                                                <CalendarIcon className="ml-2 h-4 w-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto h-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                className="rounded-md border shadow-md"
                                            />

                                        </PopoverContent>
                                    </div>
                                </Popover>
                                <div className="flex gap-2 items-center">
                                    <Select value={startTime} onValueChange={setStartTime}>
                                        <SelectTrigger className="w-[110px]">
                                            <SelectValue placeholder="Bắt đầu" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="13:30 PM">13:30 PM</SelectItem>
                                            <SelectItem value="14:30 PM">14:30 PM</SelectItem>
                                            <SelectItem value="15:30 PM">15:30 PM</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <span>→</span>
                                    <Select value={endTime} onValueChange={setEndTime}>
                                        <SelectTrigger className="w-[110px]">
                                            <SelectValue placeholder="Kết thúc" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="17:30 PM">17:30 PM</SelectItem>
                                            <SelectItem value="18:30 PM">18:30 PM</SelectItem>
                                            <SelectItem value="19:30 PM">19:30 PM</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Khu vực */}
                    <div className="flex flex-col gap-2 mb-5 md:mb-1">
                        <label className="block text-sm font-medium text-center md:text-left pl-1">Khu vực</label>
                        <div className="flex flex-col md:flex-row gap-2 items-center">
                            <Select value={city} onValueChange={setCity}>
                                <SelectTrigger>
                                    <SelectValue placeholder="TP. HỒ CHÍ MINH" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hcm">TP.Hồ Chí Minh</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex gap-2">
                                <Select value={district} onValueChange={setDistrict}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Quận 8" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="quan8">Quận 8</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={ward} onValueChange={setWard}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Phường 7" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="phuong7">Phường 7</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Loại sân */}
                    <div className="flex flex-col gap-2 mb-4 md:mb-1">
                        <label className="block text-sm font-medium text-center md:text-left pl-1">Loại sân</label>
                        <div className="flex items-center gap-4 justify-center md:flex-row md:justify-start">
                            <Select value={fieldType} onValueChange={setFieldType}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Sân bóng đá" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sanbong">Sân bóng đá</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={fieldSize} onValueChange={setFieldSize}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Sân 5" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="san5">Sân 5</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Giá sân */}
                    <div className="flex flex-col gap-2">
                        <label className="block text-sm font-medium text-center md:text-left pl-1">Giá sân</label>
                        <div className="flex gap-2 items-center">
                            <Select value={minPrice} onValueChange={setMinPrice}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Tối thiểu" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="150.000 VNĐ">150.000 VNĐ</SelectItem>
                                    <SelectItem value="250.000 VNĐ">250.000 VNĐ</SelectItem>
                                    <SelectItem value="300.000 VNĐ">300.000 VNĐ</SelectItem>
                                </SelectContent>
                            </Select>
                            <span>→</span>
                            <Select value={maxPrice} onValueChange={setMaxPrice}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Tối đa" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="450.000 VNĐ">450.000 VNĐ</SelectItem>
                                    <SelectItem value="550.000 VNĐ">550.000 VNĐ</SelectItem>
                                    <SelectItem value="600.000 VNĐ">600.000 VNĐ</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="mt-[20px] flex justify-center ">
                    <button
                        onClick={onSearch}
                        className="group relative flex items-center gap-2 px-6 py-2 border cursor-pointer border-black text-black font-semibold 
                   hover:bg-black hover:text-white transition-all duration-300 ease-in-out transform hover:translate-x-1"
                    >
                        Tìm sân
                        <span className="hidden group-hover:inline-block translate-x-[-5px] group-hover:translate-x-0 transition-all duration-50">
                            →
                        </span>
                    </button>
                </div>


            </div>

        </div>
    );
}
