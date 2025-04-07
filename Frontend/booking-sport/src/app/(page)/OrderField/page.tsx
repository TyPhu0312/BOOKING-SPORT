// BookingPage.jsx
import React from 'react';

const BookingPage = () => {
  // Thông tin sân
  const field = {
    name: 'Sân Bóng Đá Cần Giờ',
    address: 'Ấp Dương Văn Hạnh, xã Lý Nhơn, huyện Cần Giuộc, thành phố Hồ Chí Minh',
    owner: 'Nguyễn Thành Tỷ Phú',
    capacity: 5,
    price: '200.000 VND/giờ',
    openingHours: '06:00 - 22:00',
    rating: '4.5/5',
    description: 'Sân bóng đá nhân tạo đạt chuẩn, có hệ thống đèn chiếu sáng hiện đại.',
    amenities: [
      'Cho thuê giày',
      'Bán nước',
      'Chỗ đỗ xe miễn phí'
    ]
  };

  // Tạo danh sách thời gian cho dropdown (từ 06:00 AM đến 10:00 PM, cách nhau 30 phút)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 6; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const period = hour < 12 ? 'AM' : 'PM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const time = `${displayHour}:${minute === 0 ? '00' : minute} ${period}`;
        times.push(time);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="w-[75%] mx-auto p-6 bg-gray-100 min-h-screen">
      {/* Tiêu đề */}
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 mt-20">
        Đặt Sân Thể Thao
      </h1>

      {/* Thông tin sân */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">{field.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
          <div>
            <p className="flex items-center">
              <span className="mr-2">📍</span> {field.address}
            </p>
            <p className="flex items-center">
              <span className="mr-2">👤</span> Chủ sân: {field.owner}
            </p>
            <p className="flex items-center">
              <span className="mr-2">🏟️</span> Số lượng sân: {field.capacity}
            </p>
          </div>
          <div>
            <p className="flex items-center">
              <span className="mr-2">💰</span> Giá thuê: {field.price}
            </p>
            <p className="flex items-center">
              <span className="mr-2">⏰</span> Giờ mở cửa: {field.openingHours}
            </p>
            <p className="flex items-center">
              <span className="mr-2">⭐</span> Đánh giá: {field.rating}
            </p>
          </div>
        </div>
      </div>

      {/* Mô tả sân và Dịch vụ hữu ích (gộp chung card) */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        {/* Mô tả sân */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 flex items-center mb-4">
            <span className="mr-2">📜</span> Mô tả sân
            
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
            <div>
              <p>{field.description}</p>
            </div>
            <div>
              <p className="flex items-center">
                <span className="mr-2">⏰</span> Giờ mở cửa: {field.openingHours}
              </p>
              <p className="flex items-center">
                <span className="mr-2">⭐</span> Đánh giá: 4.7/5
              </p>
            </div>
          </div>
        </div>

        {/* Dịch vụ hữu ích */}
        <div>
          <h3 className="text-xl font-semibold text-gray-700 flex items-center mb-4">
            <span className="mr-2">🎉</span> Dịch vụ hữu ích
          </h3>
          <ul className="text-gray-600 list-disc list-inside columns-2">
            {field.amenities.map((amenity, index) => (
              <li key={index}>{amenity}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Form đặt sân */}
      <form className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chọn ngày */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Ngày đặt:
            </label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Chọn giờ (bắt đầu và kết thúc) */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Giờ đặt:
            </label>
            <div className="flex items-center space-x-4">
              <select
                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {timeOptions.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <span className="text-gray-600">→</span>
              <select
                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {timeOptions.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full mt-6 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Xác nhận đặt sân
        </button>
      </form>

      {/* Thông tin thanh toán */}
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Thông tin thanh toán
        </h2>
        <p className="text-gray-600 mb-4">
          Vui lòng chuyển khoản theo thông tin sau:
        </p>
        <div className="text-gray-700">
          <p><strong>Số tài khoản:</strong> 1234-5678-9012 (Ngân hàng ABC)</p>
          <p><strong>Chủ tài khoản:</strong> Công ty Thể Thao XYZ</p>
        </div>
        <img
          src="/images/qrcode.jpg"
          alt="QR Code Thanh Toán"
          className="mx-auto mt-4 max-w-[200px]"
        />
      </div>
    </div>
  );
};

export default BookingPage;