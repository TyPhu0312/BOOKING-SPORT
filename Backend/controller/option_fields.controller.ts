import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Lấy tất cả Option Fields
export const getAllOptionFields = async (req: any, res: any) => {
  try {
    const optionFields = await prisma.option_Fields.findMany({
      include: { category: true }, // include category
    });
    res.status(200).json(optionFields);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Lỗi server' });
  }
};

// Lấy Option Field theo ID
export const getOptionFieldById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const optionField = await prisma.option_Fields.findUnique({
      where: { option_field_id: id },
      include: { category: true },
    });
    if (!optionField) return res.status(404).json({ error: 'Không tìm thấy Option Field' });
    res.status(200).json(optionField);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Lỗi server' });
  }
};

// Lấy Option Fields theo Category ID
export const getOptionFieldsByCategory = async (req: any, res: any) => {
  try {
    const { categoryId } = req.params;
    const optionFields = await prisma.option_Fields.findMany({
      where: { CategoryID: categoryId },
      include: { category: true },
    });
    res.status(200).json(optionFields);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Lỗi server' });
  }
};

// Tạo mới Option Field
export const createOptionField = async (req: any, res: any) => {
  try {
    const { option_name, CategoryID } = req.body;

    if (!option_name || !CategoryID) {
      return res.status(400).json({ error: 'Thiếu option field hoặc CategoryID' });
    }

    const newOptionField = await prisma.option_Fields.create({
      data: {
        option_name,
        CategoryID,
      },
    });
    res.status(201).json(newOptionField);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Lỗi server' });
  }
};

// Cập nhật Option Field
export const updateOptionField = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { option_name, CategoryID } = req.body;

    const updatedOptionField = await prisma.option_Fields.update({
      where: { option_field_id: id },
      data: {
        option_name,
        CategoryID,
      },
    });

    res.status(200).json(updatedOptionField);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Không tìm thấy Option Field' });
    }
    console.error(error);
    res.status(500).json({ error: error.message || 'Lỗi server' });
  }
};

// Xóa Option Field
export const deleteOptionField = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await prisma.option_Fields.delete({
      where: { option_field_id: id },
    });
    res.status(200).json({ message: 'Xóa Option Field thành công' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Không tìm thấy Option Field' });
    }
    console.error(error);
    res.status(500).json({ error: error.message || 'Lỗi server' });
  }
};
