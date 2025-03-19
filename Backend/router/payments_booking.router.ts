import express from 'express';
import {
  getAllPaymentBookings,
  getPaymentBookingById,
  createPaymentBooking,
  updatePaymentBooking,
  deletePaymentBooking,
} from '../controller/payments_booking.controller';

const router = express.Router();

// Định nghĩa các route cho Payments_Booking
router.get('/get', getAllPaymentBookings); // Lấy tất cả các thanh toán đặt chỗ
router.get('/getByID/:paymentId/:bookingId', getPaymentBookingById); // Lấy thanh toán đặt chỗ theo ID
router.post('/create', createPaymentBooking); // Tạo thanh toán đặt chỗ mới
router.put('/update/:paymentId/:bookingId', updatePaymentBooking); // Cập nhật thanh toán đặt chỗ
router.delete('/delete/:paymentId/:bookingId', deletePaymentBooking); // Xóa thanh toán đặt chỗ

export default router;