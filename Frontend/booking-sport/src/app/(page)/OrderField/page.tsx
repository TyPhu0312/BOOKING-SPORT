// app/OrderField/page.tsx
import { Suspense } from 'react';
import BookingClientWrapper from './BookingClientWrapper';

export default function OrderFieldPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Đang tải trang đặt sân...</div>}>
      <BookingClientWrapper />
    </Suspense>
  );
}
