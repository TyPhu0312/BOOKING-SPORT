import express from 'express';
import {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
} from '../controller/roles.controller';

const router = express.Router();

// Định nghĩa các route cho Role
router.get('/get', getRoles); // Lấy danh sách vai trò
router.get('/getByID/:id', getRoleById); // Lấy vai trò theo ID
router.post('/create', createRole); // Tạo vai trò mới
router.put('/update/:id', updateRole); // Cập nhật vai trò
router.delete('/delete/:id', deleteRole); // Xóa vai trò

export default router;
