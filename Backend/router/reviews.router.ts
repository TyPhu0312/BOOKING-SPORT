import express from 'express';
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from '../controller/reviews.controller';

const router = express.Router();

// Định nghĩa các route cho Reviews
router.get('/get', getAllReviews); // Lấy tất cả Reviews
router.get('/getByID/:id', getReviewById); // Lấy Review theo ID
router.post('/create', createReview); // Tạo Review mới
router.put('/update/:id', updateReview); // Cập nhật Review
router.delete('/delete/:id', deleteReview); // Xóa Review

export default router;
