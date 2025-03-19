import { PrismaClient, Fields_status } from '@prisma/client';

const prisma = new PrismaClient();

// Tạo Field mới
export const createField = async (req: any, res: any) => {
  try {
    const {
      field_name,
      half_hour,
      location,
      description,
      status,
      image_url,
      create_at,
      OwnerID,
      CategoryID,
      OptionID,
    } = req.body;

    if (
      !field_name ||
      half_hour === undefined ||
      !location ||
      !description ||
      !status ||
      !image_url ||
      !create_at ||
      !OwnerID ||
      !CategoryID ||
      !OptionID
    ) {
      return res.status(400).json({ error: 'Thiếu trường dữ liệu' });
    }

    if (!Object.values(Fields_status).includes(status)) {
      return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
    }

    const newField = await prisma.fields.create({
      data: {
        field_name,
        half_hour,
        location,
        description,
        status,
        image_url,
        create_at,
        OwnerID,
        CategoryID,
        OptionID,
      },
    });

    return res.status(201).json(newField);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Lấy danh sách Fields
export const getAllFields = async (req: any, res: any) => {
  try {
    const fields = await prisma.fields.findMany({
      include: {
        user: true,
        category: true,
        option: true,
        Reviews: true,
        Booking: true,
        Space_Per_Hour: true,
        Hours: true,
        Fields_Schedule: true,
        Promotions: true,
      },
    });

    return res.status(200).json(fields);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Lấy Field theo ID
export const getFieldById = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const field = await prisma.fields.findUnique({
      where: { field_id: id },
      include: {
        user: true,
        category: true,
        option: true,
        Reviews: true,
        Booking: true,
        Space_Per_Hour: true,
        Hours: true,
        Fields_Schedule: true,
        Promotions: true,
      },
    });

    if (!field) {
      return res.status(404).json({ error: 'Không tìm thấy Field' });
    }

    return res.status(200).json(field);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Cập nhật Field
export const updateField = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const {
      field_name,
      half_hour,
      location,
      description,
      status,
      image_url,
      create_at,
      OwnerID,
      CategoryID,
      OptionID,
    } = req.body;

    if (
      !field_name ||
      half_hour === undefined ||
      !location ||
      !description ||
      !status ||
      !image_url ||
      !create_at ||
      !OwnerID ||
      !CategoryID ||
      !OptionID
    ) {
      return res.status(400).json({ error: 'Thiếu trường dữ liệu' });
    }

    if (!Object.values(Fields_status).includes(status)) {
      return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
    }

    const updatedField = await prisma.fields.update({
      where: { field_id: id },
      data: {
        field_name,
        half_hour,
        location,
        description,
        status,
        image_url,
        create_at,
        OwnerID,
        CategoryID,
        OptionID,
      },
    });

    return res.status(200).json(updatedField);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Không tìm thấy Field' });
    }
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Xóa Field
export const deleteField = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    await prisma.fields.delete({
      where: { field_id: id },
    });

    return res.status(200).json({ message: 'Xóa Field thành công' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Không tìm thấy Field' });
    }
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
