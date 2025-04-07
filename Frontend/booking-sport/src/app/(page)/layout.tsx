import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/features/navbar";
import Footer from "@/components/features/Footer";

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
    <html lang="vi"> {/* Set the language attribute to Vietnamese */}
      <head>
        {/* Add meta tags or other head elements here */}
      </head>
      <body className="bg-gray-100 text-gray-800 font-sans overflow-x-hidden flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Nội dung từng page */}
        <main className="flex-grow container-fluid mx-auto w-full">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
