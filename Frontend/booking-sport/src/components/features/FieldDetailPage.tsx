// components/FieldDetailPage.tsx
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
// import các components, icon như bạn đã làm
// ...

interface FieldDetailPageProps {
    fieldId: string;
}

const FieldDetailPage: React.FC<FieldDetailPageProps> = ({ fieldId }) => {
    const [images, setImages] = useState<string[]>([]);
    const [fieldInfo, setFieldInfo] = useState<{
        name: string;
        address: string;
        rating: number;
        openTime: string;
        numberOfFields: number;
        price: string;
        services: { icon: JSX.Element; text: string }[];
    } | null>(null);

    useEffect(() => {
        const fetchFieldData = async () => {
            try {
                const [imageRes, infoRes] = await Promise.all([
                    axios.get(`/api/field/images?id=${fieldId}`),
                    axios.get(`/api/field/info?id=${fieldId}`),
                ]);
                setImages(imageRes.data);
                setFieldInfo(infoRes.data);
            } catch (error) {
                console.error("Lỗi fetch dữ liệu:", error);
                // Dữ liệu giả fallback
                setImages(["/images/stadium.jpg", "/images/stadium.jpg"]);
                setFieldInfo({
                    name: "Sân mặc định",
                    address: "Địa chỉ mặc định",
                    rating: 4,
                    openTime: "6h - 23h",
                    numberOfFields: 2,
                    price: "150.000đ",
                    services: [],
                });
            }
        };
        fetchFieldData();
    }, [fieldId]);

    if (!fieldInfo) return <p>Loading...</p>;

    return (
        <div className="p-4">
            <div className="mb-4">
                {images.length > 0 ? (
                    <div className="flex space-x-2 overflow-x-auto">
                        {images.map((img, idx) => (
                            <Image
                                key={idx}
                                src={img}
                                alt={`Ảnh sân ${idx + 1}`}
                                className="w-64 h-40 object-cover rounded-lg"
                            />
                        ))}
                    </div>
                ) : (
                    <p>Không có ảnh sân.</p>
                )}
            </div>

            <h1 className="text-3xl font-bold">{fieldInfo.name}</h1>
            {/* Thêm các thông tin chi tiết khác ở đây */}
        </div>
    );

};

export default FieldDetailPage;
