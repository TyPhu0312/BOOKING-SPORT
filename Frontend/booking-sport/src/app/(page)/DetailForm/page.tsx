"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Court {
    id: number;
    name: string;
    address: string;
    owner: string;
    numFields: number;
    pricePerHour: number;
    openingHours: string;
    description: string;
    services: string[];
    rating: number;
    reviews: { user: string; comment: string; rating: number }[];
    contact: { phone: string; email: string };
    location: string;
    images: string[];
}

export default function DetailForm() {
    const [court, setCourt] = useState<Court | null>(null);

    useEffect(() => {
       const mockData: Court = {
            id: 1,
            name: "Sân Bóng Đá Cần Giờ",
            address: "Ấp Dương Văn Hạnh, xã Lý Nhơn, huyện Cần Giờ, thành phố Hồ Chí MinhMinh",
            owner: "Nguyễn Thành Tỷ Phú",
            numFields: 5,
            pricePerHour: 200000,
            openingHours: "06:00 - 22:00",
            description: "Sân bóng đá nhân tạo đạt chuẩn, có hệ thống đèn chiếu sáng hiện đại.",
            services: ["Cho thuê giày", "Bán nước", "Chỗ đỗ xe miễn phí"],
            rating: 4.5,
            reviews: [
              { user: "Trần Anh Tuấn", comment: "Sân đẹp, chất lượng tốt, chủ hơi cợt nhả.", rating: 5 },
              { user: "Đỗ Minh Trí", comment: "Giá hơi cao nhưng dịch vụ rất bình thường.", rating: 4 },
            ],
            contact: { phone: "0767 392 039", email: "typhucangio@gmail.com" },
            location: "https://goo.gl/maps/xyz123",
            images: [
              "/images/court1.jpg",
              "/images/court2.jpg",
              "/images/court3.jpg",
            ],
          };

        setCourt(mockData);
    }, []);

    if (!court) return <p className="text-center mt-10 text-lg">Đang tải...</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center pt-20">
            <div className="bg-white shadow-lg rounded-lg p-6 md:p-10 max-w-6xl w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{court.name}</h1>
                        <p className="text-gray-600">📍 {court.address}</p>
                        <p className="text-gray-600">👤 Chủ sân: {court.owner}</p>
                        <p className="text-gray-600">🏟️ Số lượng sân: {court.numFields}</p>
                        <p className="text-gray-600">💰 Giá thuê: {court.pricePerHour.toLocaleString()} VNĐ/giờ</p>
                        <p className="text-gray-600">⏰ Giờ mở cửa: {court.openingHours}</p>
                        <p className="text-gray-600">⭐ Đánh giá: {court.rating} / 5</p>
                        <h2 className="text-xl font-semibold mt-4">📜 Mô tả sân</h2>
                        <p className="text-gray-700">{court.description}</p>
                        <h2 className="text-xl font-semibold mt-4">🎾 Dịch vụ hiện có</h2>
                        <ul className="list-disc list-inside text-gray-700">
                            {court.services.map((service, index) => (
                                <li key={index}>{service}</li>
                            ))}
                        </ul>
                        <h2 className="text-xl font-semibold mt-4">💬 Đánh giá từ khách hàng</h2>
                        <div className="space-y-4">
                            {court.reviews.map((review, index) => (
                                <div key={index} className="border p-4 rounded-lg shadow-md">
                                    <p className="font-semibold">{review.user}</p>
                                    <p className="text-gray-600">⭐ {review.rating} / 5</p>
                                    <p className="text-gray-700">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        {court.images.map((img, index) => (
                            <Image
                                key={index}
                                src={img}
                                alt="Hình ảnh sân"
                                width={300}
                                height={160}
                                className="w-full h-40 object-cover rounded-lg shadow-md"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
