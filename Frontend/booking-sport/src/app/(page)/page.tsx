"use client";
import { useState, useEffect } from "react";
import BookingTable from "@/components/features/fastBookingTable";
import TitleListCard from "@/components/features/TitleListCard"; // Import component mới
import StadiumCardList from "@/components/features/stadiumCardList";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import FilterBox from "@/components/features/filterBox";
import QuickIntro from "@/components/features/QuickIntro";

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false);
  const [showBookingTable, setShowBookingTable] = useState(false);
  const [showStadiumList, setShowStadiumList] = useState(false);
  const images = ["/images/Banner.png", "/images/banner2.jpg", "/images/banner3.png", "/images/banner4.jpg"];

  useEffect(() => {
    if (sessionStorage.getItem("shouldReload") === "true") {
      sessionStorage.removeItem("shouldReload");
      window.location.reload();
    }
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = () => {
    setShowStadiumList(true);
  };

  const mockFilterOptions = {
    stadiumType: [
      { value: "all", label: "Tất cả" },
      { value: "grass", label: "Sân cầu lông" },
      { value: "indoor", label: "Sân cầu tiêu" },
    ],
    priceRange: [
      { value: "low", label: "Dưới 200.000 VNĐ" },
      { value: "medium", label: "200.000 VNĐ - 500.000VNĐ" },
      { value: "high", label: "Trên 500.000 VNĐ" },
    ],
    location: [
      { value: "hanoi", label: "Hà Nội" },
      { value: "hcm", label: "Hồ Chí Minh" },
      { value: "danang", label: "Đà Nẵng" },
    ],
  };

  const filtersConfig = [
    { title: "Loại sân", fetchOptions: () => Promise.resolve(mockFilterOptions.stadiumType) },
    { title: "Khoảng giá", fetchOptions: () => Promise.resolve(mockFilterOptions.priceRange) },
    { title: "Khu vực", fetchOptions: () => Promise.resolve(mockFilterOptions.location) },
  ];

  const handleFilter = (selectedFilters: { [key: string]: string }) => {
    console.log("Bộ lọc đã chọn:", selectedFilters);
  };

  return (
    <section className="w-screen flex flex-col items-center gap-6">
      {/* Slide ảnh chạy tự động */}
      <div className="w-full h-fit mt-[30px]"> {/* Giảm chiều cao slider */}
        {isMobile ? (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            className="h-full"
          >
            {images.map((src, index) => (
              <SwiperSlide key={index} className="flex items-center justify-center h-full w-full">
                <Image
                  src={src}
                  width={800}
                  height={1000} 
                  alt={`Banner ${index + 1}`}
                  className="object-fit realtive w-fit h-fit"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (<Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={4}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          className="h-full"
        >
          {images.map((src, index) => (
            <SwiperSlide key={index} className="flex items-center justify-center h-full w-full">
              <Image
                src={src}
                width={800}
                height={1000} // Giảm chiều cao ảnh
                alt={`Banner ${index + 1}`}
                className="object-fit w-fit h-fit"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        )}
      </div>

      {/* Booking Table */}
      {/*  {isMobile ? (
        <Button
          onClick={() => setShowBookingTable(!showBookingTable)}
          className="w-full cursor-pointer max-w-xs bg-gradient-to-r from-gray-800 to-black text-white font-semibold py-3 
       transition duration-300 ease-in-out transform hover:scale-105 hover:from-black hover:to-gray-900 shadow-xl h-14 rounded-none"
        >
          Đặt sân nhanh ngay bây giờ
        </Button>
      ) : (
        <div className="w-full md:w-1/2 rounded-lg">
          <BookingTable onSearch={handleSearch} />
        </div>
      )} */}

      {/*   {isMobile && showBookingTable && (
        <div className="w-full md:w-1/2 rounded-lg">
          <BookingTable onSearch={handleSearch} />
        </div>
      )}
 */}
      {/* Danh sách sân tìm được */}
      {showStadiumList && (
        <TitleListCard title="Sân tìm được">
          <StadiumCardList />
        </TitleListCard>
      )}

      {/* Bộ lọc sân bóng */}
      <div className="w-full mt-5 flex flex-col items-center gap-5 m-auto">
        {/* Tiêu đề + gạch ngang */}
        <div className="relative w-full flex items-center justify-center">
          <div className="w-3/4 border-t border-gray-300 absolute"></div>
          <h2 className="bg-white rounded-lg px-4 text-xl font-semibold text-gray-800 relative z-10">Bộ lọc</h2>
        </div>
        {/* Bộ lọc chính giữa */}
        <FilterBox filters={filtersConfig} onFilter={handleFilter} />
      </div>

      {/* Sân được yêu thích */}
      <TitleListCard title="Sân được yêu thích" link="#">
        <StadiumCardList />
      </TitleListCard>

      <TitleListCard title="Sân giá cực tốt" link="#">
        <StadiumCardList />
      </TitleListCard>

      <TitleListCard title="Sân si" link="#">
        <StadiumCardList />
      </TitleListCard>

      <QuickIntro />
    </section>
  );
}
