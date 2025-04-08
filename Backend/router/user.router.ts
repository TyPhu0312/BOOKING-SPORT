import express from 'express';
import { loginUser } from "../controller/user.controller";

import {
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
} from '../controller/user.controller';

const router = express.Router();

// Định nghĩa các route cho User
router.post('/create', createUser); // Tạo người dùng mới
router.get('/get', getUsers); // Lấy danh sách người dùng
router.get('/getByID/:id', getUserById); // Lấy người dùng theo ID
router.get('/get/email/:email', getUserByEmail); // Lấy người dùng theo email
router.put('/update/:id', updateUser); // Cập nhật thông tin người dùng
router.delete('/delete/:id', deleteUser); // Xóa người dùng
router.post('/login', loginUser);
export default router;
