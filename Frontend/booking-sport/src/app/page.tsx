// app/page.tsx
export default function HomePage() {
    return (
      <section className="text-center py-10">
        <h2 className="text-4xl font-bold mb-4 text-green-600">Chào mừng đến với hệ thống đặt sân bóng!</h2>
        <p className="text-lg text-gray-600">Đặt sân nhanh chóng - Tiện lợi - Dễ dàng.</p>
  
        <div className="mt-8 flex justify-center">
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
            Đặt sân ngay
          </button>
        </div>
      </section>
    );
  }
  