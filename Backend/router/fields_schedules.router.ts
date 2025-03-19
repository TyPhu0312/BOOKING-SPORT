import express from 'express';
import {
  createFieldSchedule,
  getAllFieldSchedules,
  getFieldScheduleById,
  updateFieldSchedule,
  deleteFieldSchedule,
} from '../controller/fields_schedules.controller';

const router = express.Router();

// Định nghĩa các route cho Fields_Schedules
router.get('/get', getAllFieldSchedules); // Lấy tất cả lịch trình sân
router.get('/getByID/:id', getFieldScheduleById); // Lấy lịch trình sân theo ID
router.post('/create', createFieldSchedule); // Tạo lịch trình sân mới
router.put('/update/:id', updateFieldSchedule); // Cập nhật lịch trình sân
router.delete('/delete/:id', deleteFieldSchedule); // Xóa lịch trình sân

export default router;
