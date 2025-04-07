import { useEffect, useState } from "react";
import axios from "axios";  // Đảm bảo đã cài axios
import StadiumCard from "@/components/features/stadiumCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface Stadium {
    id: number;
    name: string;
    location: string;
    price: string;
}

export default function StadiumCardList() {
    const [stadiums, setStadiums] = useState<Stadium[]>([]); // Tạo kiểu dữ liệu cho stadiums

    useEffect(() => {
        const fetchStadiums = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/admin/fields/get");
                setStadiums(res.data);  // Gán dữ liệu vào state
            } catch (err) {
                console.error("Lỗi khi fetch sân:", err);
            }
        };

        fetchStadiums();
    }, []);

    // Debug stadiums state
    useEffect(() => {
        console.log("State stadiums:", stadiums);
    }, [stadiums]); useEffect(() => {
        const fetchStadiums = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/admin/fields/get");

                // Chuyển đổi dữ liệu
                const transformedData = res.data.map((field: any) => {
                    const minPrice = field.Space_Per_Hour?.length
                        ? Math.min(...field.Space_Per_Hour.map((sph: any) => sph.price))
                        : 0;

                    return {
                        id: field.field_id,
                        name: field.field_name,
                        location: field.location,
                        price: minPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
                    };
                });

                setStadiums(transformedData);
            } catch (err) {
                console.error("Lỗi khi fetch sân:", err);
            }
        };

        fetchStadiums();
    }, []);


    return (
        <div className="relative w-full flex justify-center px-10">
            <div className="relative w-full max-w-[1300px]">
                <Carousel className="h-auto w-full overflow-hidden">
                    <CarouselContent className="flex">
                        {stadiums.map((stadium) => (
                            <CarouselItem
                                key={stadium.id} // Dùng id để làm key
                                className="basis-full sm:basis-1/3 lg:basis-1/4 xl:basis-1/5 flex justify-center"
                            >
                                {/* Truyền dữ liệu vào StadiumCard */}
                                <StadiumCard stadium={stadium} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Thêm padding-x vào nút để đẩy nội dung */}
                    <CarouselPrevious className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-200 text-black hover:bg-gray-400 hover:scale-110 transition-all duration-200 z-10" />
                    <CarouselNext className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-200 text-black hover:bg-gray-400 hover:scale-110 transition-all duration-200 z-10" />
                </Carousel>
            </div>
        </div>
    );
}
