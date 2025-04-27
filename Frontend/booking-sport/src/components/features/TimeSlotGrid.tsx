// components/features/TimeSlotGrid.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Hàm tiện ích để kết hợp className (nếu bạn dùng shadcn/ui)

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

interface TimeSlotGridProps {
    schedule: DaySlot[];
}

const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({ schedule }) => {
    // Hàm xử lý khi người dùng bấm vào một khung giờ
    const handleSlotClick = (day: DaySlot, slot: TimeSlot) => {
        if (day.isClosed || !slot.available) return; // Không làm gì nếu ngày đóng cửa hoặc khung giờ đã được đặt
        alert(`Bạn đã chọn khung giờ ${slot.time} vào ngày ${day.dayLabel} (${day.date}) với giá ${slot.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`);
        // Thêm logic đặt sân ở đây (ví dụ: gọi API để đặt sân)
    };

    // Nếu không có lịch, hiển thị thông báo
    if (!schedule || schedule.length === 0) {
        return <p className="text-center text-gray-500">Không có lịch sân để hiển thị</p>;
    }

    // Tìm tất cả các khung giờ duy nhất để làm hàng tiêu đề
    const allTimes = Array.from(
        new Set(
            schedule
                .flatMap((day) => day.slots.map((slot) => slot.time))
                .sort((a, b) => a.localeCompare(b))
        )
    );

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                {/* Tiêu đề cột (các ngày) */}
                <thead>
                    <tr>
                        <th className="border p-2 bg-gray-100 sticky left-0 z-10">Thời gian</th>
                        {schedule.map((day) => (
                            <th
                                key={day.date}
                                className={cn(
                                    "border p-2 text-center",
                                    day.isClosed ? "bg-gray-300 text-gray-500" : "bg-gray-100"
                                )}
                            >
                                {day.dayLabel} ({new Date(day.date).toLocaleDateString("vi-VN")})
                            </th>
                        ))}
                    </tr>
                </thead>
                {/* Nội dung (các khung giờ) */}
                <tbody>
                    {allTimes.map((time) => (
                        <tr key={time}>
                            <td className="border p-2 bg-gray-100 sticky left-0 z-10">{time}</td>
                            {schedule.map((day) => {
                                const slot = day.slots.find((s) => s.time === time);
                                return (
                                    <td key={`${day.date}-${time}`} className="border p-2 text-center">
                                        {day.isClosed || !slot ? (
                                            <div className="h-10 w-full bg-gray-300 rounded" />
                                        ) : (
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full h-10",
                                                    slot.available
                                                        ? "bg-green-100 hover:bg-green-200 text-green-800"
                                                        : "bg-red-100 text-red-800 cursor-not-allowed"
                                                )}
                                                disabled={!slot.available}
                                                onClick={() => handleSlotClick(day, slot)}
                                            >
                                                {slot.available
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
    );
};

export default TimeSlotGrid;