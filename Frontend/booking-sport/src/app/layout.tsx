// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/features/navbar"; // <-- Import navbar custom của bạn

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
    <html lang="vi">
      <body className="bg-gray-100 text-gray-800 font-sans">
        {/* Navbar mới */}
        <Navbar />

        {/* Nội dung từng page */}
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-green-600 text-white text-center py-4 mt-10">
          © {new Date().getFullYear()} Đặt Sân Bóng. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
