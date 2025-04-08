"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
// Định nghĩa kiểu dữ liệu cho stadium
interface Stadium {
    id: number;
    name: string;
    location: string;
    price: string;
}
interface StadiumCardProps {
    stadium: Stadium;
}
export default function StadiumCard({ stadium }: StadiumCardProps) {
    const router = useRouter();

    const handleBooking = () => {
        router.push(`/field-detail/${stadium.id}`);
    };
    return (
        <div className="bg-white hover:shadow-lg transition-shadow duration-300  w-[270px] h-auto border rounded-lg">
            <div className="w-full h-[160px] relative overflow-hidden">
                <Image
                    src="/images/stadium.jpg"
                    fill
                    alt={stadium.name || "stadium"}
                    className="object-cover"
                />
            </div>
            <div className="p-4 space-y-1">
                <h3 className="text-lg font-semibold truncate">{stadium.name}</h3>
                <p className="text-gray-600 text-sm">{stadium.location}</p>
                <p className="text-green-600 font-bold">{stadium.price}</p>
            </div>
            <div className="px-4 pb-4 flex justify-center">
                <Button onClick={handleBooking} variant="outline" className=" cursor-pointer">
                    Đặt ngay
                </Button>
            </div>
        </div>
    );
}
