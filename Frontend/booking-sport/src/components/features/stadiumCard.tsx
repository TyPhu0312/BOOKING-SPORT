"use client"


import Image from "next/image";
import { Button } from "@/components/ui/button"
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
        router.push(`/OrderField?field_id=${stadium.id}`);
      };
    return (
        <div className="bg-white shadow-md pb-2 rounded-lg w-[270px] h-auto">
            <Image
                src="/images/stadium.jpg"
                width={300}
                height={300}
                alt={stadium.name}
                className="object-cover rounded-t-lg"
            />
            <div className="p-4 ">
                <h3 className="mt-1 text-lg font-semibold">{stadium.name}</h3>
                <p className="text-gray-600 text-sm pb-3">{stadium.location}</p>
                <p className="text-green-600 font-bold">{stadium.price}</p>
            </div>
            <div className="m-auto cursor-pointer flex justify-center items-center">
                <Button onClick={handleBooking} variant="outline" className="cursor-pointer">Đặt ngay</Button>
            </div>
        </div>
    );
}
