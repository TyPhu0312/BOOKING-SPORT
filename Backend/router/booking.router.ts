import express from 'express';
import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} from '../controller/booking.controller';

const router = express.Router();

// Định nghĩa các route cho Booking
router.get('/get', getAllBookings); // Lấy tất cả booking
router.get('/getByID/:id', getBookingById); // Lấy booking theo ID
router.post('/create', createBooking); // Tạo booking mới
router.put('/update/:id', updateBooking); // Cập nhật booking
router.delete('/delete/:id', deleteBooking); // Xóa booking

export default router;
