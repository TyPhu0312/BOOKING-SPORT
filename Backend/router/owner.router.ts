import express from 'express';
import { registerField } from '../controller/owner.controller';

const router = express.Router();

// Route đăng ký chủ sân, không yêu cầu xác thực
router.post('/register', registerField);

export default router;