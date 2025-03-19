import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Tạo tài khoản ngân hàng mới
export const createBankAccount = async (req: any, res: any) => {
    try {
        const { bank_account_number, bank_account_name, UserID } = req.body;
        if (!bank_account_number || !bank_account_name || !UserID) {
            return res.status(400).json({ error: 'Thiếu trường dữ liệu' });
        }
        const newBankAccount = await prisma.bank_account.create({
            data: { bank_account_number, bank_account_name, UserID }
        });
        return res.status(201).json(newBankAccount);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: error.message || 'Lỗi server' });
    }
};

// Lấy danh sách tất cả tài khoản ngân hàng
export const getBankAccounts = async (req: any, res: any) => {
    try {
        const bankAccounts = await prisma.bank_account.findMany({
            include: { user: true }
        });
        return res.status(200).json(bankAccounts);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: error.message || 'Lỗi server' });
    }
};

// Lấy tài khoản ngân hàng theo ID
export const getBankAccountById = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const bankAccount = await prisma.bank_account.findUnique({
            where: { bank_id: id },
            include: { user: true }
        });
        if (!bankAccount) return res.status(404).json({ error: 'Không tìm thấy tài khoản ngân hàng' });
        return res.status(200).json(bankAccount);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: error.message || 'Lỗi server' });
    }
};

// Cập nhật tài khoản ngân hàng
export const updateBankAccount = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { bank_account_number, bank_account_name } = req.body;
        const updatedBankAccount = await prisma.bank_account.update({
            where: { bank_id: id },
            data: { bank_account_number, bank_account_name }
        });
        return res.status(200).json(updatedBankAccount);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Không tìm thấy tài khoản ngân hàng' });
        }
        console.error(error);
        return res.status(500).json({ error: error.message || 'Lỗi server' });
    }
};

// Xóa tài khoản ngân hàng
export const deleteBankAccount = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        await prisma.bank_account.delete({
            where: { bank_id: id }
        });
        return res.status(200).json({ message: 'Xóa tài khoản ngân hàng thành công' });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Không tìm thấy tài khoản ngân hàng' });
        }
        console.error(error);
        return res.status(500).json({ error: error.message || 'Lỗi server' });
    }
};
