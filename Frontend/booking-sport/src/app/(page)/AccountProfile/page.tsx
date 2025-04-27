'use client';

import { useState, useEffect } from 'react';

// Định nghĩa interface cho dữ liệu người dùng dựa trên schema.prisma
interface User {
  user_id: string;
  username: string;
  email: string;
  phone_number: string;
  role: {
    roleName: 'Customer' | 'Owner';
  };
  create_at: string;
  Fields?: { field_id: string }[];
}

// Định nghĩa interface cho dữ liệu booking
interface Booking {
  booking_id: string;
  booking_date: string;
  time_start: string;
  time_end: string;
  total_price: number;
  Status: 'Pending' | 'Confirmed' | 'Cancelled';
  fields: {
    field_name: string;
    location: string;
  };
}

// Component TabNavigation
const TabNavigation = ({ activeTab, setActiveTab, isOwner }: { activeTab: string; setActiveTab: (tab: string) => void; isOwner: boolean }) => {
  return (
    <div className="bg-white text-black rounded-lg p-2 mb-6 max-w-4xl mx-auto">
      <ul className="flex space-x-2">
        <li>
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'Hồ Sơ' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
            onClick={() => setActiveTab('Hồ Sơ')}
          >
            Hồ Sơ
          </button>
        </li>
        {isOwner && (
          <li>
            <button
              className={`px-4 py-2 rounded-md ${activeTab === 'Danh Sách Sân' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
              onClick={() => setActiveTab('Danh Sách Sân')}
            >
              Danh Sách Sân
            </button>
          </li>
        )}
        <li>
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'Lịch Đặt Sân' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
            onClick={() => setActiveTab('Lịch Đặt Sân')}
          >
            Lịch Đặt Sân
          </button>
        </li>
      </ul>
    </div>
  );
};

// Component ProfileCard
const ProfileCard = ({ user }: { user: User }) => {
  const roleColor = user.role.roleName === 'Owner' ? 'bg-green-500' : 'bg-blue-500';
  const roleText = user.role.roleName === 'Owner' ? 'Chủ Sân' : 'Khách Hàng';
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-bold text-gray-600">
          {user.username[0].toUpperCase()}
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-semibold">{user.username}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
      <div className="mb-4">
        <span className={`inline-block ${roleColor} text-white px-3 py-1 rounded-full text-sm`}>
          {roleText}
        </span>
      </div>
      <div className="text-gray-700">
        <p><strong>Số Điện Thoại:</strong> {user.phone_number}</p>
        <p><strong>Ngày Tham Gia:</strong> {new Date(user.create_at).toLocaleDateString('vi-VN')}</p>
      </div>
    </div>
  );
};

// Component StatsCard
const StatsCard = ({ bookingsCount, fieldsCount }: { bookingsCount: number; fieldsCount: number }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <h3 className="text-lg font-semibold mb-4">Thống Kê Hoạt Động</h3>
      <div className="space-y-2">
        <p><strong>Lượt Đặt Sân:</strong> {bookingsCount}</p>
        <p><strong>Sân Sở Hữu:</strong> {fieldsCount}</p>
      </div>
    </div>
  );
};

// Component FieldsList
const FieldsList = ({ fields }: { fields: any[] }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full">
      <h3 className="text-lg font-semibold mb-4">Danh Sách Sân</h3>
      {fields.length === 0 ? (
        <p className="text-gray-600">Chưa có sân nào.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.field_id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-lg">{field.field_name}</h4>
              <p><strong>Địa chỉ:</strong> {field.location}</p>
              <p><strong>Giá:</strong> {field.price_per_hour.toLocaleString('vi-VN')} VND/giờ</p>
              <p><strong>Trạng thái:</strong> {field.status ? 'Đang hoạt động' : 'Tạm ngưng'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Component BookingList
const BookingList = ({ bookings }: { bookings: Booking[] }) => {
  const statusText = {
    Pending: 'Chờ Xác Nhận',
    Confirmed: 'Đã Xác Nhận',
    Cancelled: 'Đã Hủy',
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full">
      <h3 className="text-lg font-semibold mb-4">Lịch Đặt Sân</h3>
      {bookings.length === 0 ? (
        <p className="text-gray-600">Chưa có lịch đặt sân.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.booking_id} className="border-b pb-4">
              <p><strong>Sân:</strong> {booking.fields.field_name}</p>
              <p><strong>Địa điểm:</strong> {booking.fields.location}</p>
              <p><strong>Ngày đặt:</strong> {new Date(booking.booking_date).toLocaleDateString('vi-VN')}</p>
              <p>
                <strong>Giờ:</strong>{' '}
                {new Date(booking.time_start).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} -{' '}
                {new Date(booking.time_end).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p><strong>Tổng giá:</strong> {booking.total_price.toLocaleString('vi-VN')} VND</p>
              <p><strong>Trạng thái:</strong> {statusText[booking.Status]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Component chính
export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Hồ Sơ');

  // Lấy userId từ localStorage
  const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') || '' : '';

  useEffect(() => {
    const loadData = async () => {
      if (!userId) {
        setError('Không tìm thấy user ID. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }

      try {
        // Fetch thông tin người dùng
        const userResponse = await fetch(`http://localhost:5000/api/admin/user/getByID/${userId}`);
        if (!userResponse.ok) {
          const text = await userResponse.text();
          console.error('User API response:', text);
          let errorData;
          try {
            errorData = JSON.parse(text);
          } catch {
            throw new Error(`Lỗi server: Nhận được HTML thay vì JSON (${text.slice(0, 50)}...)`);
          }
          throw new Error(errorData.error || `Lỗi ${userResponse.status}: Không thể lấy dữ liệu người dùng`);
        }
        const userData: User = await userResponse.json();
        setUser(userData);

        // Nếu là chủ sân, lấy danh sách sân
        if (userData.role.roleName === 'Owner') {
          const fieldsResponse = await fetch(`http://localhost:5000/api/admin/fields/get`);
          if (!fieldsResponse.ok) {
            throw new Error('Không thể lấy danh sách sân');
          }
          const fieldsData = await fieldsResponse.json();
          // Lọc chỉ lấy sân của owner hiện tại
          const ownerFields = fieldsData.filter((field: any) => field.UserID === userId);
          setFields(ownerFields);
        }

        // Fetch bookings của người dùng
        const bookingsResponse = await fetch(`http://localhost:5000/api/admin/booking/get`);
        if (!bookingsResponse.ok) {
          const text = await bookingsResponse.text();
          console.error('Bookings API response:', text);
          let errorData;
          try {
            errorData = JSON.parse(text);
          } catch {
            throw new Error(`Lỗi server: Nhận được HTML thay vì JSON (${text.slice(0, 50)}...)`);
          }
          throw new Error(errorData.error || `Lỗi ${bookingsResponse.status}: Không thể lấy dữ liệu booking`);
        }
        const bookingsData = await bookingsResponse.json();
        // Lọc chỉ lấy booking của user hiện tại
        const userBookings = bookingsData.filter((booking: any) => booking.UserID === userId);
        setBookings(userBookings);
      } catch (error: any) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        setError(error.message || 'Đã xảy ra lỗi khi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userId]);

  return (
    <div className="bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Hồ Sơ Người Dùng</h1>
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} isOwner={user?.role.roleName === 'Owner'} />
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : user ? (
          activeTab === 'Hồ Sơ' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileCard user={user} />
              <StatsCard bookingsCount={bookings.length} fieldsCount={user.role.roleName === 'Owner' ? (fields.length || 0) : 0} />
            </div>
          ) : activeTab === 'Danh Sách Sân' && user.role.roleName === 'Owner' ? (
            <FieldsList fields={fields} />
          ) : (
            <BookingList bookings={bookings} />
          )
        ) : (
          <p className="text-red-500 text-center">Không thể tải dữ liệu người dùng.</p>
        )}
      </div>
    </div>
  );
}