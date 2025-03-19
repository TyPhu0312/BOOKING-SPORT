import { PrismaClient } from '@prisma/client';
import validator from 'validator';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

// Tạo người dùng mới
export const createUser = async (req: any, res: any) => {
    try {
        const { username, passWord, email, phone_number, roleID } = req.body;
        if (!username || !passWord || !email || !phone_number || !roleID) {
            return res.status(400).json({ error: 'Thiếu trường dữ liệu' });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'Địa chỉ email không hợp lệ' });
        }
        const hashedPassword = createHash('sha3-512').update(passWord).digest('hex');
        const newUser = await prisma.user.create({
            data: {
                username,
                passWord: hashedPassword,
                email,
                phone_number,
                roleID,
                create_at: new Date()
            }
        });
        return res.status(201).json(newUser);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

// Lấy danh sách người dùng
export const getUsers = async (req: any, res: any) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                role: true,
                Bank_accounts: true,
                Bookings: true,
                Fields: true,
                Reviews: true
            }
        });
        return res.status(200).json(users);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

// Lấy người dùng theo ID
export const getUserById = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { user_id: id },
            include: {
                role: true,
                Bank_accounts: true,
                Bookings: true,
                Fields: true,
                Reviews: true
            }
        });
        if (!user) return res.status(404).json({ error: 'Không tìm thấy User' });
        return res.status(200).json(user);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

// Lấy người dùng theo Email
export const getUserByEmail = async (req: any, res: any) => {
    try {
        const { email } = req.params;
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                role: true,
                Bank_accounts: true,
                Bookings: true,
                Fields: true,
                Reviews: true
            }
        });
        if (!user) return res.status(404).json({ error: 'Không tìm thấy User' });
        return res.status(200).json(user);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

// Cập nhật thông tin người dùng
export const updateUser = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { username, passWord, email, phone_number, roleID } = req.body;
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'Địa chỉ email không hợp lệ' });
        }
        if (!username || !passWord || !email || !phone_number || !roleID) {
            return res.status(400).json({ error: 'Thiếu trường dữ liệu' });
        }
        const hashedPassword = createHash('sha3-512').update(passWord).digest('hex');
        const updatedUser = await prisma.user.update({
            where: { user_id: id },
            data: {
                username,
                passWord: hashedPassword,
                email,
                phone_number,
                roleID
            }
        });
        return res.status(200).json(updatedUser);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Không tìm thấy User' });
        }
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

// Xóa người dùng
export const deleteUser = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({
            where: { user_id: id }
        });
        return res.status(200).json({ message: 'Xóa User thành công' });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Không tìm thấy User' });
        }
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};
