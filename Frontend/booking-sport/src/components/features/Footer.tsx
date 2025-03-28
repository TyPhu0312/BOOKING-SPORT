import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-16">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Logo + Giới thiệu */}
          <div>
            <Image src="/images/logos/1.jpeg" width={150} height={50} alt="Logo" className="rounded-lg"/>
            <p className="mt-4 text-gray-400">
              Website đặt sân thể thao nhanh chóng và dễ dàng. Kết nối chủ sân với người chơi trên toàn quốc.
            </p>
          </div>

          {/* Điều hướng */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Trang chủ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Đặt sân</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Đăng ký sân</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Liên hệ</a></li>
            </ul>
          </div>

          {/* Mạng xã hội */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact with us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="text-gray-400 hover:text-white text-2xl"><FaFacebookF /></a>
              <a href="#" className="text-gray-400 hover:text-white text-2xl"><FaTwitter /></a>
              <a href="#" className="text-gray-400 hover:text-white text-2xl"><FaInstagram /></a>
              <a href="#" className="text-gray-400 hover:text-white text-2xl"><FaYoutube /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-500">
        &copy; {new Date().getFullYear()} BookingSport. All rights reserved.
      </div>
    </footer>
  );
}