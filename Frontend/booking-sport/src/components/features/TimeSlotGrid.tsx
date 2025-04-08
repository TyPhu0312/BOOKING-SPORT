import React, { useState, useEffect } from "react";

// Khai báo kiểu dữ liệu
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

interface TimeSlotGridProps {
    schedule: DaySlot[];
}
const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({ schedule }) => {
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [filteredSchedule, setFilteredSchedule] = useState<DaySlot[]>([]);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const handleSlotClick = (time: string) => {
        setSelectedSlot(time === selectedSlot ? null : time);
    };

    const handleDateFilterChange = () => {
        const filtered = schedule.filter((day) => {
            return (new Date(day.date) >= new Date(startDate)) && (new Date(day.date) <= new Date(endDate));
        });
        setFilteredSchedule(filtered);
    };

    useEffect(() => {
        setFilteredSchedule(schedule);
    }, [schedule]);

    return (
        <div className="rounded-lg overflow-hidden shadow min-w-max">
            {/* Bộ lọc ngày */}
            <div className="flex flex-wrap gap-2 mb-4">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border p-2"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border p-2"
                />
                <button
                    onClick={handleDateFilterChange}
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Filter
                </button>
            </div>

            {/* Bảng slot với scroll ngang */}
            <div className="w-full overflow-x-auto">
                <div className="min-w-[2000px]">
                    {/* Tiêu đề giờ */}
                    <div className="grid grid-cols-[minmax(150px,_200px)_repeat(24,_minmax(80px,_1fr))] bg-gray-100">

                        <div></div>
                        {Array.from({ length: 24 }, (_, index) => {
                            const hour = String(index).padStart(2, '0');
                            return (
                                <div
                                    key={index}
                                    className="px-4 py-2 font-semibold text-center text-gray-700 border-l"
                                >
                                    {hour}:00
                                </div>
                            );
                        })}
                    </div>

                    {/* Dữ liệu theo từng ngày */}
                    {filteredSchedule.map((day, index) => (
                        <div key={index} className="grid grid-cols-[200px_repeat(24,_minmax(80px,_1fr))] border-b">
                            <div className="px-4 py-2 font-semibold text-gray-800 border-r whitespace-nowrap">
                                {day.dayLabel} - {day.date}
                            </div>
                            {Array.from({ length: 24 }, (_, hour) => {
                                const hourStr = String(hour).padStart(2, '0') + ':00';
                                const slot = day.slots.find(s => s.time === hourStr);

                                return (
                                    <div
                                        key={hour}
                                        className={`px-2 py-1 text-sm text-center border-l cursor-pointer transition-all duration-300 ease-in-out
                                ${slot?.available ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-300 text-gray-600 hover:bg-gray-400'}
                                ${selectedSlot === hourStr ? 'bg-blue-500 text-white' : ''}`}
                                        onClick={() => slot?.available && handleSlotClick(hourStr)}
                                    >
                                        {slot ? `${slot.price.toLocaleString()}₫` : '--'}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimeSlotGrid;
