"use client"
import AdminHeader from "@/components/features/admin-header"
import AdminSidebar from "@/components/features/admin-sidebar"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Admin({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // const router = useRouter();
    // const [isLoading, setIsLoading] = useState<boolean>(true); // isLoading để kiểm tra xem có cần tải không

    // useEffect(() => {
    //     const storedUserInfo = sessionStorage.getItem("user_info");

    //     if (!storedUserInfo) {
    //         // Nếu không có thông tin người dùng, chuyển hướng đến trang đăng nhập
    //         alert("Bạn chưa đăng nhập");
    //         router.push("../login");
    //     } else {
    //         const user = JSON.parse(storedUserInfo);
    //         if (user.role.roleName !== 'Admin') {
    //             // Nếu người dùng không phải Admin, chuyển hướng về trang chủ
    //             alert("Bạn không có quyền truy cập");
    //             router.push("../");
    //         } else {
    //             // Nếu tất cả điều kiện đều hợp lệ, set isLoading thành false để hiển thị nội dung
    //             setIsLoading(false);
    //         }
    //     }
    // }, [router]);

    // // Nếu đang tải (isLoading), hiển thị một màn hình chờ
    // if (isLoading) {
    //     return (
    //         <div className="flex justify-center items-center min-h-screen bg-gray-100">
    //             <div className="text-xl text-center text-gray-500">Đang kiểm tra quyền truy cập...</div>
    //         </div>
    //     );
    // }

    // Khi isLoading là false, hiển thị nội dung trang Admin
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <AdminSidebar />
            </div>
            <div className="flex flex-col">
                <AdminHeader />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
