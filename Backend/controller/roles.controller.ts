import { PrismaClient, RoleName } from '@prisma/client';

const prisma = new PrismaClient();

// Tạo vai trò mới
export const createRole = async (req: any, res: any) => {
  try {
    const { roleName } = req.body;

    if (!roleName || !Object.values(RoleName).includes(roleName)) {
      return res.status(400).json({ error: 'RoleName không hợp lệ' });
    }

    const newRole = await prisma.role.create({
      data: {
        roleName,
      },
    });

    return res.status(201).json(newRole);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Lấy danh sách các vai trò
export const getRoles = async (req: any, res: any) => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        users: true, // Bao gồm thông tin của người dùng trong mỗi vai trò
      },
    });

    return res.status(200).json(roles);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Lấy vai trò theo ID
export const getRoleById = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const role = await prisma.role.findUnique({
      where: { role_id: id },
      include: {
        users: true,
      },
    });

    if (!role) {
      return res.status(404).json({ error: 'Không tìm thấy vai trò' });
    }

    return res.status(200).json(role);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Cập nhật vai trò
export const updateRole = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { roleName } = req.body;

    if (!roleName || !Object.values(RoleName).includes(roleName)) {
      return res.status(400).json({ error: 'RoleName không hợp lệ' });
    }

    const updatedRole = await prisma.role.update({
      where: { role_id: id },
      data: { roleName },
    });

    return res.status(200).json(updatedRole);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Không tìm thấy vai trò' });
    }
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Xóa vai trò
export const deleteRole = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    await prisma.role.delete({
      where: { role_id: id },
    });

    return res.status(200).json({ message: 'Xóa vai trò thành công' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Không tìm thấy vai trò' });
    }
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
