import express from 'express';
import {
  getAllFields,
  getFieldById,
  createField,
  updateField,
  deleteField,
} from '../controller/fields.controller';

const router = express.Router();

// Định nghĩa các route cho Fields
router.get('/get', getAllFields); // Lấy tất cả Fields
router.get('/getByID/:id', getFieldById); // Lấy Field theo ID
router.post('/create', createField); // Tạo Field mới
router.put('/update/:id', updateField); // Cập nhật Field
router.delete('/delete/:id', deleteField); // Xóa Field

export default router;
