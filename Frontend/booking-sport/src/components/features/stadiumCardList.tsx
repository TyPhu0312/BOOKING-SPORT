import { useEffect, useState } from "react";
import axios from "axios";
import StadiumCard from "@/components/features/stadiumCard";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

interface SpacePerHour {
    id: number;
    price: number;
}

interface RawStadium {
    field_id: number;
    field_name: string;
    location: string;
    Space_Per_Hour: SpacePerHour[];
}

interface Stadium {
    id: number;
    name: string;
    location: string;
    price: string;
}

export default function StadiumCardList() {
    const [stadiums, setStadiums] = useState<Stadium[]>([]);

    useEffect(() => {
        const fetchStadiums = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/admin/fields/get");

                const transformedData = res.data.map((field: RawStadium): Stadium => {
                    const minPrice = field.Space_Per_Hour?.length
                        ? Math.min(...field.Space_Per_Hour.map((sph) => sph.price))
                        : 0;

                    return {
                        id: field.field_id,
                        name: field.field_name,
                        location: field.location,
                        price: minPrice.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }),
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
        <div className="relative w-full flex justify-center ml-10 mr-10 cursor-pointer">
            <div className="relative w-full pl-10 pr-10">
                <Carousel className="h-auto w-full overflow-hidden">
                    <CarouselContent className="flex">
                        {stadiums.map((stadium) => (
                            <CarouselItem
                                key={stadium.id}
                                className="basis-full sm:basis-1/2 rounded-xl lg:basis-1/3 xl:basis-1/5 2xl:basis-1/6 flex justify-between items-center"
                            >
                                <div className="transform transition-transform duration-300 hover:scale-105">
                                    <StadiumCard stadium={stadium} />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <CarouselPrevious className="absolute cursor-pointer left-4 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-200 text-black hover:bg-gray-400 hover:scale-110 transition-all duration-200 z-10" />
                    <CarouselNext className="absolute cursor-pointer right-4 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-200 text-black hover:bg-gray-400 hover:scale-110 transition-all duration-200 z-10" />
                </Carousel>
            </div>
        </div>
    );
}
