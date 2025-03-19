import express from 'express';
import {
  getAllHours,
  getHourById,
  createHour,
  updateHour,
  deleteHour,
} from '../controller/hours.controller';

const router = express.Router();

// Định nghĩa các route cho Hours
router.get('/get', getAllHours); // Lấy tất cả Hours
router.get('/getByID/:id', getHourById); // Lấy Hour theo ID
router.post('/create', createHour); // Tạo Hour mới
router.put('/update/:id', updateHour); // Cập nhật Hour
router.delete('/delete/:id', deleteHour); // Xóa Hour

export default router;
