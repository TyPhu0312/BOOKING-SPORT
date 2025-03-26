// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper"; // <-- Import navbar custom của bạn

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
        <NavbarWrapper>
          <main >{children}</main>
        </NavbarWrapper>
      </body>
    </html>
  );
}
