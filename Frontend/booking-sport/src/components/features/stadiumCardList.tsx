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
interface Space_Per_Hour {
    space_per_hour_id: string;
    from_hour_value: string;
    to_hour_value: string;
    price: number;
    FieldID: string;
  }

export interface FieldDetail {
    field_id: string;
    field_name: string;
    half_hour: boolean;
    location: string;
    description: string;
    status: string;
    image_url: string;
    create_at: string;
    OwnerID: string;
    CategoryID: string;
    OptionID: string;
    user: {
      user_id: string;
      username: string;
      passWord: string;
      email: string;
      phone_number: string;
      create_at: string;
      roleID: string;
    };
    category: {
      category_id: string;
      category_name: string;
    };
    option: {
      option_field_id: string;
      number_of_field: string;
      CategoryID: string;
    };
    Reviews: {
      review_id: string;
      rating: number;
      comment: string;
      create_at: string;
      UserID: string;
      FieldID: string;
    }[];
    Booking: {
      booking_id: string;
      booking_date: string;
      time_start: string;
      time_end: string;
      total_price: string;
      deposit: string;
      Status: string;
      prove_payment: string;
      UserID: string;
      FieldID: string;
    }[];
    Space_Per_Hour: {
      space_per_hour_id: string;
      from_hour_value: string;
      to_hour_value: string;
      price: number;
      FieldID: string;
    }[];
    Hours: {
      hours_id: string;
      hour_value: number;
      status_hour_on: string;
      status_hour_off: string;
      FieldID: string;
    }[];
    Fields_Schedule: {
      schedule_id: string;
      day_of_week: string;
      open_time: string;
      close_time: string;
      FieldID: string;
    };
    Promotions: {
      promotion_id: string;
      discount: string;
      start_date: string;
      end_date: string;
      FieldID: string;
    }[];
  }
  

export default function StadiumCardList() {
    const [stadiums, setStadiums] = useState<Stadium[]>([]); // Tạo kiểu dữ liệu cho stadiums

    useEffect(() => {
        const fetchStadiums = async () => {
            try {
                const res = await axios.get("https://booking-sport-lljl.onrender.com/api/admin/fields/get");
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
                const res = await axios.get("https://booking-sport-lljl.onrender.com/api/admin/fields/get");

                // Chuyển đổi dữ liệu
                const transformedData = res.data.map((field: FieldDetail) => {
                    const minPrice = field.Space_Per_Hour?.length
                        ? Math.min(...field.Space_Per_Hour.map((sph: Space_Per_Hour) => sph.price))
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
        <div className="relative w-full max-w-[1700px]">
            <div className="relative w-full">
                <Carousel className="h-auto w-full overflow-hidden">
                    <CarouselContent className="flex">
                        {stadiums.map((stadium) => (
                            <CarouselItem
                                key={stadium.id} 
                                className="basis-full sm:basis-1/2 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6 3xl:basis-1/7 flex justify-center"
                            >
                                <StadiumCard stadium={stadium} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute cursor-pointer left-4 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-200 text-black hover:bg-gray-400 hover:scale-110 transition-all duration-200 z-10" />
                    <CarouselNext className="absolute  cursor-pointer right-4 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-200 text-black hover:bg-gray-400 hover:scale-110 transition-all duration-200 z-10" />
                </Carousel>
            </div>
        </div>
    );
}
