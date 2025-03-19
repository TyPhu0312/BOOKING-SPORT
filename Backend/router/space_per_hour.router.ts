import express from 'express';
import {
  createSpacePerHour,
  getAllSpacePerHour,
  getSpacePerHourById,
  updateSpacePerHour,
  deleteSpacePerHour,
} from '../controller/space_per_hour.controller';

const router = express.Router();

// Định nghĩa các route cho Space_Per_Hour
router.get('/get', getAllSpacePerHour); // Lấy tất cả Space_Per_Hour
router.get('/getByID/:id', getSpacePerHourById); // Lấy Space_Per_Hour theo ID
router.post('/create', createSpacePerHour); // Tạo Space_Per_Hour mới
router.put('/update/:id', updateSpacePerHour); // Cập nhật Space_Per_Hour
router.delete('/delete/:id', deleteSpacePerHour); // Xóa Space_Per_Hour

export default router;
