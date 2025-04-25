import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controller/category.controller';

const router = express.Router();

// Định nghĩa các route cho danh mục (Category)
router.get('/get', getAllCategories); // Lấy tất cả danh mục
router.get('/getById/:id', getCategoryById); // Lấy danh mục theo ID
router.post('/create', createCategory); // Tạo danh mục mới
router.put('/update/:id', updateCategory); // Cập nhật danh mục
router.delete('/delete/:id', deleteCategory); // Xóa danh mục

export default router;
