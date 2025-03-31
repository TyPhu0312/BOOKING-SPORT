import StadiumCard from "@/components/features/stadiumCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const stadiums = [
    { id: 1, name: "Sân Quỳnh Anh", location: "230 Quỳnh Quỳnh, Quận 8", price: "200.000 VNĐ" },
    { id: 2, name: "Sân Cao Lỗ", location: "230 Quỳnh Quỳnh, Quận 3", price: "250.000 VNĐ" },
    { id: 3, name: "Sân Cao Cấp", location: "230 Quỳnh Quỳnh, Quận 5", price: "300.000 VNĐ" },
    { id: 4, name: "Sân Thể Thao Xanh", location: "120 Nguyễn Văn Linh, Quận 7", price: "280.000 VNĐ" },
    { id: 5, name: "Sân Mini Phú Nhuận", location: "45 Hoàng Văn Thụ, Phú Nhuận", price: "220.000 VNĐ" },
    { id: 6, name: "Sân Cỏ Nhân Tạo Kỳ Hòa", location: "150 Lý Thái Tổ, Quận 10", price: "350.000 VNĐ" }
];

export default function StadiumCardList() {
    return (
        <div className="relative w-full flex justify-center px-10"> {/* Thêm padding ngang */}
            <div className="relative w-full max-w-[1300px]">
                <Carousel className="h-auto w-full overflow-hidden">
                    <CarouselContent className="flex">
                        {stadiums.map((stadium) => (
                            <CarouselItem
                                key={stadium.id}
                                className="basis-full sm:basis-1/3 lg:basis-1/4 xl:basis-1/5 flex justify-center"
                            >
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





