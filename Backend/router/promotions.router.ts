import express from 'express';
import {
  createPromotion,
  getAllPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion,
} from '../controller/promotions.controller';

const router = express.Router();

// Định nghĩa các route cho Promotions
router.get('/get', getAllPromotions); // Lấy danh sách khuyến mãi
router.get('/getByID/:id', getPromotionById); // Lấy khuyến mãi theo ID
router.post('/create', createPromotion); // Tạo khuyến mãi mới
router.put('/update/:id', updatePromotion); // Cập nhật khuyến mãi
router.delete('/delete/:id', deletePromotion); // Xóa khuyến mãi

export default router;
