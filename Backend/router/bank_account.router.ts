import express from 'express';
import {
  createBankAccount,
  getBankAccounts,
  getBankAccountById,
  updateBankAccount,
  deleteBankAccount,
} from '../controller/bank_account.controller';

const router = express.Router();

// Định nghĩa các route cho Bank Accounts
router.post('/create', createBankAccount); // Tạo tài khoản ngân hàng mới
router.get('/get', getBankAccounts); // Lấy danh sách tài khoản ngân hàng
router.get('/getByID/:id', getBankAccountById); // Lấy tài khoản ngân hàng theo ID
router.put('/update/:id', updateBankAccount); // Cập nhật tài khoản ngân hàng
router.delete('/delete/:id', deleteBankAccount); // Xóa tài khoản ngân hàng

export default router;
