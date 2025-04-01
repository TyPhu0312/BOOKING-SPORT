"use client";

import React from "react";
import Footer from "@/components/features/footer";
import Navbar from "@/components/features/navigation";

export default function ContactPage() {
  return (
    <main>
      <section className="bg-gray-50 py-10 bg-[url('/background.jpg')]">
        <div className="container mx-auto px-4 mt-4 mb-4 ">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-12">
  <h2 className="text-3xl font-semibold text-center text-amber-400 mb-6">Contact with us</h2>
  <p className="text-center text-gray-600 mb-6">Feel free to reach out for any inquiries or support. We're here to help!
  "We are committed to responding to all your inquiries within 24 hours to ensure convenience and timeliness."
"Our support team is always ready and will get back to you promptly within 24 hours."
"We understand the importance of time, so we make sure every question is answered within 24 hours."
"With 24-hour support service, you can rest assured that all your concerns will be addressed quickly and effectively."
"No need to wait long! All requests will be processed and responded to within 24 hours."
  </p>
</div>


          <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0 mt-5">
            {/* Thông tin liên hệ */}
            <div className="md:w-1/2 bg-white shadow-lg rounded-lg p-6">
              <h4 className="text-xl font-semibold mb-4">Our information</h4>
              <p className="mb-2"><strong>Adrress:</strong> 123 Đường Fast Food, Quận 1, TP.HCM</p>
              <p className="mb-2"><strong>Email:</strong> support@fastfoodqt.vn</p>
              <p className="mb-2"><strong>Number Phone:</strong> 0123 456 789</p>
              <p className="mb-2"><strong>Work Time:</strong> 8:00 AM - 10:00 PM (Hằng ngày)</p>
            </div>

            {/* Form liên hệ */}
            <div className="md:w-1/2 bg-white shadow-lg rounded-lg p-6">
              <h4 className="text-xl font-semibold mb-4">Gửi tin nhắn</h4>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Họ và tên:</label>
                  <input 
                    type="text" 
                    id="name" 
                    placeholder="Nhập họ và tên" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email:</label>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="Nhập email của bạn" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-1">Lời nhắn:</label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    placeholder="Nhập nội dung lời nhắn" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-[#FFA008] to-[#FF6F00] text-white font-medium rounded-lg px-4 py-2 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">
                  Gửi
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
