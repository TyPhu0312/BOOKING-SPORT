import React from "react";
import Image from "next/image"
const AboutPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 mt-7">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
        
        {/* GIỚI THIỆU */}
        <div className="bg-white shadow-xl rounded-2xl p-6 text-center flex flex-col justify-between transition-shadow hover:shadow-2xl">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">GIỚI THIỆU</h1>
          <Image width={1200} height={300}  src="/images/san1.jpg" alt="Giới thiệu" className="w-full h-48 object-cover rounded-xl" />
          <p className="text-gray-700 mt-4 text-justify">
            Chào mừng bạn đến với hệ thống quản lý đặt sân thể thao như bóng đá, bóng chuyền, cầu lông,... của Booking Sport! 
            Chúng tôi cung cấp nền tảng giúp người chơi có thể tìm kiếm, đặt lịch và quản lý sân bóng một cách thuận tiện. 
            Với hệ thống thông minh, bạn có thể dễ dàng lựa chọn sân phù hợp theo vị trí, thời gian, và giá cả hợp lý.
          </p>
        </div>

        {/* DỊCH VỤ */}
        <div className="bg-white shadow-xl rounded-2xl p-6 text-center flex flex-col justify-between transition-shadow hover:shadow-2xl">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">DỊCH VỤ</h1>
          <Image width={1200} height={300} src="/images/san2.jpg" alt="Dịch vụ" className="w-full h-48 object-cover rounded-xl" />
          <ul className="text-gray-700 mt-4 text-left list-disc px-6">
            <li>Hỗ trợ đặt sân trực tuyến nhanh chóng và tiện lợi.</li>
            <li>Hệ thống tìm kiếm sân thông minh theo địa điểm, giá cả, và khung giờ trống.</li>
            <li>Chương trình khuyến mãi và giảm giá cho khách hàng thân thiết.</li>
            <li>Hỗ trợ đặt thuê trọng tài, đồng phục, và dụng cụ thể thao.</li>
            <li>Chế độ đánh giá sân giúp bạn đưa ra lựa chọn tốt nhất.</li>
          </ul>
        </div>

        {/* LIÊN HỆ */}
        <div className="bg-white shadow-xl rounded-2xl p-6 text-center flex flex-col justify-between transition-shadow hover:shadow-2xl">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">LIÊN HỆ</h1>
          <Image width={1200} height={300} src="/images/san3.jpg" alt="Liên hệ" className="w-full h-48 object-cover rounded-xl" />
          <p className="text-gray-700 mt-4 text-justify">
            Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ, hãy liên hệ với chúng tôi qua:
          </p>
          <p className="text-gray-700 font-semibold mt-4">📧 Email: bookingsportq8@gmail.com</p>
          <p className="text-gray-700 font-semibold">📍 Địa chỉ: 43 Cao Lỗ, Quận 8, TP.HCM</p>
          <p className="text-gray-700 font-semibold">📞 Hotline: 0909-111-735</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
