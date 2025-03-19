import { PrismaClient, DayOfWeek } from '@prisma/client';

const prisma = new PrismaClient();

// Tạo mới Fields_Schedules
export const createFieldSchedule = async (req: any, res: any) => {
  try {
    const { day_of_week, open_time, close_time, FieldID } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!day_of_week || !open_time || !close_time || !FieldID) {
      return res.status(400).json({ error: 'Thiếu trường dữ liệu' });
    }

    if (!Object.values(DayOfWeek).includes(day_of_week)) {
      return res.status(400).json({ error: 'day_of_week không hợp lệ' });
    }

    const newSchedule = await prisma.fields_Schedules.create({
      data: {
        day_of_week,
        open_time,
        close_time,
        FieldID,
      },
    });

    return res.status(201).json(newSchedule);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Lấy danh sách Fields_Schedules
export const getAllFieldSchedules = async (req: any, res: any) => {
  try {
    const schedules = await prisma.fields_Schedules.findMany({
      include: {
        fields: true,
      },
    });

    return res.status(200).json(schedules);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Lấy Fields_Schedules theo ID
export const getFieldScheduleById = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const schedule = await prisma.fields_Schedules.findUnique({
      where: { schedule_id: id },
      include: {
        fields: true,
      },
    });

    if (!schedule) {
      return res.status(404).json({ error: 'Không tìm thấy Fields_Schedules' });
    }

    return res.status(200).json(schedule);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Cập nhật Fields_Schedules
export const updateFieldSchedule = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { day_of_week, open_time, close_time, FieldID } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!day_of_week || !open_time || !close_time || !FieldID) {
      return res.status(400).json({ error: 'Thiếu trường dữ liệu' });
    }

    if (!Object.values(DayOfWeek).includes(day_of_week)) {
      return res.status(400).json({ error: 'day_of_week không hợp lệ' });
    }

    const updatedSchedule = await prisma.fields_Schedules.update({
      where: { schedule_id: id },
      data: {
        day_of_week,
        open_time,
        close_time,
        FieldID,
      },
    });

    return res.status(200).json(updatedSchedule);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Không tìm thấy Fields_Schedules' });
    }
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Xóa Fields_Schedules
export const deleteFieldSchedule = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    await prisma.fields_Schedules.delete({
      where: { schedule_id: id },
    });

    return res.status(200).json({ message: 'Xóa Fields_Schedules thành công' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Không tìm thấy Fields_Schedules' });
    }
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
