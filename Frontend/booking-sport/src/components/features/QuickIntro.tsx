import { FaFutbol, FaUsers, FaClipboardList, FaStar } from "react-icons/fa";

const QuickIntro = () => {
  const features = [
    {
      icon: <FaFutbol className="text-green-500 text-5xl" />,
      title: "Đặt sân nhanh chóng",
      description: "Tìm kiếm, so sánh và đặt sân bóng dễ dàng trong vài phút với hệ thống thông minh.",
    },
    {
      icon: <FaUsers className="text-blue-500 text-5xl" />,
      title: "Kết nối chủ sân",
      description: "Chủ sân có thể đăng ký sân, cập nhật thông tin và tiếp cận hàng ngàn người chơi mỗi ngày.",
    },
    {
      icon: <FaClipboardList className="text-orange-500 text-5xl" />,
      title: "Quản lý & Theo dõi",
      description: "Người dùng có thể theo dõi lịch đặt sân, thông tin đối thủ và quản lý đội bóng dễ dàng.",
    },
    {
      icon: <FaStar className="text-yellow-500 text-5xl" />,
      title: "Đánh giá & Xếp hạng",
      description: "Người chơi có thể đánh giá sân, giúp nâng cao chất lượng dịch vụ trong cộng đồng bóng đá.",
    },
  ];

  return (
    <section className="w-full py-16 bg-gray-100 flex flex-col items-center px-6">
      <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        ⚽ VỀ BOOKING SPORT
      </h2>
      <p className="text-gray-600 max-w-2xl text-center mb-10">
        Với mục tiêu đem lại trải nghiệm tốt nhất cho người chơi bóng, Booking Sport là nền tảng giúp bạn dễ dàng tìm kiếm, đặt sân và kết nối với những người yêu thích thể thao. Chúng tôi cam kết mang đến dịch vụ chất lượng và tiện lợi nhất cho cộng đồng thể thao Việt Nam.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center 
                       transition duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            {feature.icon}
            <h3 className="text-2xl font-semibold text-gray-700 mt-4">{feature.title}</h3>
            <p className="text-gray-600 mt-3">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QuickIntro;
