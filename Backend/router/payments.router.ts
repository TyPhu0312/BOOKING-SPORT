import express from 'express';
import {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
} from '../controller/payments.controller';

const router = express.Router();

// Định nghĩa các route cho Payments
router.get('/get', getAllPayments); // Lấy tất cả các thanh toán
router.get('/getByID/:id', getPaymentById); // Lấy một thanh toán theo ID
router.post('/create', createPayment); // Tạo mới một thanh toán
router.put('/update/:id', updatePayment); // Cập nhật thanh toán
router.delete('/delete/:id', deletePayment); // Xóa thanh toán

export default router;
