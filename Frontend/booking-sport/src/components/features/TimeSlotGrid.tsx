// components/features/TimeSlotGrid.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

// Interface cho một khung giờ
interface TimeSlot {
    time: string;          // Thời gian (VD: "08:00")
    available: boolean;    // Có thể đặt hay không
    price: number;         // Giá tiền
    isAvailable: boolean;  // Sân có hoạt động trong giờ này không
}

// Interface cho một ngày
interface DaySlot {
    dayLabel: string;      // Nhãn ngày (VD: "Thứ Hai")
    date: string;          // Ngày tháng (VD: "27/04/2025")
    slots: TimeSlot[];     // Danh sách các khung giờ
    isClosed: boolean;     // Ngày này có đóng cửa không
}

interface TimeSlotGridProps {
    schedule: DaySlot[];   // Lịch của sân
}

const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({ schedule }) => {
    // Xử lý khi người dùng click vào một khung giờ
    const handleSlotClick = (day: DaySlot, slot: TimeSlot) => {
        if (day.isClosed || !slot.isAvailable || !slot.available) return;
        alert(`Bạn đã chọn khung giờ ${slot.time} vào ngày ${day.dayLabel} (${day.date}) với giá ${slot.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`);
    };

    // Nếu không có lịch, hiển thị thông báo
    if (!schedule || schedule.length === 0) {
        return (
            <Card className="p-6 text-center text-gray-500">
                Không có lịch sân để hiển thị
            </Card>
        );
    }

    // Lấy tất cả các khung giờ duy nhất để làm header
    const allTimes = Array.from(
        new Set(
            schedule
                .flatMap((day) => day.slots.map((slot) => slot.time))
                .sort((a, b) => a.localeCompare(b))
        )
    );

    // Render bảng lịch
    return (
        <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
            <div className="min-w-[800px]">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="border p-3 font-semibold text-gray-700 sticky left-0 z-10 bg-gray-50">
                                Thời gian
                            </th>
                            {schedule.map((day) => (
                                <th
                                    key={day.date}
                                    className={cn(
                                        "border p-3 text-center min-w-[150px]",
                                        day.isClosed ? "bg-gray-200" : "bg-gray-50"
                                    )}
                                >
                                    <div className="font-semibold text-gray-700">{day.dayLabel}</div>
                                    <div className="text-sm text-gray-500">{day.date}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {allTimes.map((time) => (
                            <tr key={time} className="hover:bg-gray-50">
                                <td className="border p-3 font-medium text-gray-700 sticky left-0 z-10 bg-white">
                                    {time}
                                </td>
                                {schedule.map((day) => {
                                    const slot = day.slots.find((s) => s.time === time);
                                    return (
                                        <td key={`${day.date}-${time}`} className="border p-2 text-center">
                                            {day.isClosed || !slot ? (
                                                <div className="h-10 w-full bg-gray-200 rounded" />
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full h-10 font-medium transition-colors",
                                                        !slot.isAvailable 
                                                            ? "bg-gray-100 text-gray-500 cursor-not-allowed hover:bg-gray-100" 
                                                            : slot.available
                                                                ? "bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                                                                : "bg-red-50 text-red-700 cursor-not-allowed hover:bg-red-50 border-red-200"
                                                    )}
                                                    disabled={!slot.isAvailable || !slot.available}
                                                    onClick={() => handleSlotClick(day, slot)}
                                                >
                                                    {!slot.isAvailable 
                                                        ? "Không hoạt động"
                                                        : slot.available
                                                            ? slot.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
                                                            : "Đã đặt"}
                                                </Button>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TimeSlotGrid;