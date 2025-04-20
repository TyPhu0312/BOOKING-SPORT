"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const RegisterField = () => {
    const router = useRouter();
    const [form, setForm] = useState({
        username: "",
        email: "",
        phone_number: "",
        password: "",
        field_name: "",
        location: "",
        description: "",
        price_per_hour: "",
        open_time: "06:00",
        close_time: "22:00",
    });
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setError(null);

        // Kiểm tra các trường bắt buộc
        if (
            !form.username ||
            !form.email ||
            !form.phone_number ||
            !form.password ||
            !form.field_name ||
            !form.location ||
            !form.price_per_hour
        ) {
            setError("Vui lòng điền đầy đủ các trường bắt buộc.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/admin/owner/register", {
                username: form.username,
                email: form.email,
                phone_number: form.phone_number,
                password: form.password,
                field: {
                    field_name: form.field_name,
                    location: form.location,
                    description: form.description,
                    price_per_hour: parseFloat(form.price_per_hour),
                    open_time: form.open_time,
                    close_time: form.close_time,
                },
            });

            if (response.status === 201) {
                alert("Đăng ký chủ sân thành công!");
                router.push("/login");
            }
        } catch (err) {
            const error = err as AxiosError<{ error?: string }>;
            console.error("Lỗi khi đăng ký chủ sân:", error.response?.data || error.message);
            setError(error.response?.data?.error || "Đăng ký thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <div className="min-h-screen max-w-screen h-auto flex justify-start bg-gray-50 px-4 pt-10">
            <div className="bg-amber-50 rounded-xl h-fit shadow-lg p-8 w-full max-w-screen md:max-w-[50vw] border-black">
                <h1 className="text-2xl font-bold mb-6 text-center">Đăng Ký Chủ Sân</h1>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-700">Thông tin cá nhân</h2>
                    <Input
                        placeholder="Họ và tên"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                    />
                    <Input
                        placeholder="Email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    <Input
                        placeholder="Số điện thoại"
                        type="tel"
                        value={form.phone_number}
                        onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                    />
                    <Input
                        placeholder="Mật khẩu"
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />

                    <h2 className="text-xl font-semibold text-gray-700 mt-6">Thông tin sân</h2>
                    <Input
                        placeholder="Tên sân"
                        value={form.field_name}
                        onChange={(e) => setForm({ ...form, field_name: e.target.value })}
                    />
                    <Input
                        placeholder="Địa điểm"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                    />
                    <Textarea
                        placeholder="Mô tả sân"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                    <Input
                        placeholder="Giá thuê theo giờ (VND)"
                        type="number"
                        value={form.price_per_hour}
                        onChange={(e) => setForm({ ...form, price_per_hour: e.target.value })}
                    />
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label className="block text-gray-700 font-medium mb-2">Giờ mở cửa:</label>
                            <Input
                                type="time"
                                value={form.open_time}
                                onChange={(e) => setForm({ ...form, open_time: e.target.value })}
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-gray-700 font-medium mb-2">Giờ đóng cửa:</label>
                            <Input
                                type="time"
                                value={form.close_time}
                                onChange={(e) => setForm({ ...form, close_time: e.target.value })}
                            />
                        </div>
                    </div>
                    <Button
                        onClick={handleSubmit}
                        className="w-full mt-6 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Đăng Ký Chủ Sân
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RegisterField;