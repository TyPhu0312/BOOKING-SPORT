import React from 'react';

const CheckoutSuccess = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5 4.1A9.004 9.004 0 1112 3v0a9.004 9.004 0 015 16.9z"
              ></path>
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">Thanh toán thành công!</h2>
        <p className="mt-4 text-gray-600">
          Cảm ơn bạn đã mua hàng. Hóa đơn của bạn đã được xử lý thành công.
        </p>
        <div className="mt-6">
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none"
          >
            Quay lại trang chủ
          </button>
          <button
            onClick={() => window.location.href = '/orders'}
            className="px-6 py-3 ml-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none"
          >
            Xem đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
