import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Tạo Space_Per_Hour mới
export const createSpacePerHour = async (req: any, res: any) => {
  try {
    const { from_hour_value, to_hour_value, price, FieldID } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!from_hour_value || !to_hour_value || !price || !FieldID) {
      return res.status(400).json({ error: 'Thiếu trường dữ liệu' });
    }

    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ error: 'price phải là số dương' });
    }

    const newSpacePerHour = await prisma.space_Per_Hour.create({
      data: {
        from_hour_value,
        to_hour_value,
        price,
        FieldID,
      },
    });

    return res.status(201).json(newSpacePerHour);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Lấy danh sách Space_Per_Hour
export const getAllSpacePerHour = async (req: any, res: any) => {
  try {
    const spacePerHours = await prisma.space_Per_Hour.findMany({
      include: {
        fields: true,
      },
    });

    return res.status(200).json(spacePerHours);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Lấy Space_Per_Hour theo ID
export const getSpacePerHourById = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const spacePerHour = await prisma.space_Per_Hour.findUnique({
      where: { space_per_hour_id: id },
      include: {
        fields: true,
      },
    });

    if (!spacePerHour) {
      return res.status(404).json({ error: 'Không tìm thấy Space_Per_Hour' });
    }

    return res.status(200).json(spacePerHour);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Cập nhật Space_Per_Hour
export const updateSpacePerHour = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { from_hour_value, to_hour_value, price, FieldID } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!from_hour_value || !to_hour_value || !price || !FieldID) {
      return res.status(400).json({ error: 'Thiếu trường dữ liệu' });
    }

    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ error: 'price phải là số dương' });
    }

    const updatedSpacePerHour = await prisma.space_Per_Hour.update({
      where: { space_per_hour_id: id },
      data: {
        from_hour_value,
        to_hour_value,
        price,
        FieldID,
      },
    });

    return res.status(200).json(updatedSpacePerHour);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Không tìm thấy Space_Per_Hour' });
    }
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Xóa Space_Per_Hour
export const deleteSpacePerHour = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    await prisma.space_Per_Hour.delete({
      where: { space_per_hour_id: id },
    });

    return res.status(200).json({ message: 'Xóa Space_Per_Hour thành công' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Không tìm thấy Space_Per_Hour' });
    }
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
