import { PrismaClient, Status_Hour_on, Status_Hour_off } from '@prisma/client';

const prisma = new PrismaClient();

// Tạo Hour mới
export const createHour = async (req: any, res: any) => {
  try {
    const { hour_value, status_hour_on, status_hour_off, FieldID } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!hour_value || !status_hour_on || !status_hour_off || !FieldID) {
      return res.status(400).json({ error: 'Thiếu trường dữ liệu' });
    }

    // Kiểm tra hour_value hợp lệ
    if (typeof hour_value !== 'number' || hour_value < 0) {
      return res.status(400).json({ error: 'hour_value phải là số dương' });
    }

    // Kiểm tra status_hour_on hợp lệ
    if (!Object.values(Status_Hour_on).includes(status_hour_on)) {
      return res.status(400).json({ error: 'status_hour_on không hợp lệ' });
    }

    // Kiểm tra status_hour_off hợp lệ
    if (!Object.values(Status_Hour_off).includes(status_hour_off)) {
      return res.status(400).json({ error: 'status_hour_off không hợp lệ' });
    }

    const newHour = await prisma.hours.create({
      data: {
        hour_value,
        status_hour_on,
        status_hour_off,
        FieldID,
      },
    });

    return res.status(201).json(newHour);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Lấy danh sách Hours
export const getAllHours = async (req: any, res: any) => {
  try {
    const hours = await prisma.hours.findMany({
      include: {
        fields: true,
      },
    });

    return res.status(200).json(hours);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Lấy Hour theo ID
export const getHourById = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const hour = await prisma.hours.findUnique({
      where: { hours_id: id },
      include: {
        fields: true,
      },
    });

    if (!hour) {
      return res.status(404).json({ error: 'Không tìm thấy Hour' });
    }

    return res.status(200).json(hour);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Cập nhật Hour
export const updateHour = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { hour_value, status_hour_on, status_hour_off, FieldID } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!hour_value || !status_hour_on || !status_hour_off || !FieldID) {
      return res.status(400).json({ error: 'Thiếu trường dữ liệu' });
    }

    if (typeof hour_value !== 'number' || hour_value < 0) {
      return res.status(400).json({ error: 'hour_value phải là số dương' });
    }

    if (!Object.values(Status_Hour_on).includes(status_hour_on)) {
      return res.status(400).json({ error: 'status_hour_on không hợp lệ' });
    }

    if (!Object.values(Status_Hour_off).includes(status_hour_off)) {
      return res.status(400).json({ error: 'status_hour_off không hợp lệ' });
    }

    const updatedHour = await prisma.hours.update({
      where: { hours_id: id },
      data: {
        hour_value,
        status_hour_on,
        status_hour_off,
        FieldID,
      },
    });

    return res.status(200).json(updatedHour);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Không tìm thấy Hour' });
    }
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Xóa Hour
export const deleteHour = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    await prisma.hours.delete({
      where: { hours_id: id },
    });

    return res.status(200).json({ message: 'Xóa Hour thành công' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Không tìm thấy Hour' });
    }
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
