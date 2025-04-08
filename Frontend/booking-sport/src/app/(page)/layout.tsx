import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/features/navbar";
import Footer from "@/components/features/Footer";
import { AuthProvider } from "@/app/context/AuthContext"; // 👈 Thêm dòng này

export const metadata: Metadata = {
  title: "Đặt Sân Bóng Online",
  description: "Hệ thống đặt sân bóng trực tuyến, nhanh chóng và tiện lợi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider> {/* 👈 Bọc toàn bộ app */}
      <div className="bg-gray-100 text-gray-800 font-sans overflow-x-hidden flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container-fluid mx-auto w-full">
          {children}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
