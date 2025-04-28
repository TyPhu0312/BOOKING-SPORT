import express from 'express';
import {
  getAllOptionFields,
  getOptionFieldById,
  createOptionField,
  updateOptionField,
  deleteOptionField,
  getOptionFieldsByCategory
} from '../controller/option_fields.controller';

const router = express.Router();

// Định nghĩa các route cho Option Fields
router.get('/get', getAllOptionFields); // Lấy tất cả Option Fields
router.get('/getByID/:id', getOptionFieldById); // Lấy Option Field theo ID
router.get('/getByCategory/:categoryId', getOptionFieldsByCategory); // Lấy Option Fields theo Category ID
router.post('/create', createOptionField); // Tạo Option Field mới
router.put('/update/:id', updateOptionField); // Cập nhật Option Field
router.delete('/delete/:id', deleteOptionField); // Xóa Option Field

export default router;
