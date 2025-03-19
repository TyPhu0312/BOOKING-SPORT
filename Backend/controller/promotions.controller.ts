import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Tạo khuyến mãi mới
export const createPromotion = async (req: any, res: any) => {
  try {
    const { discount, start_date, end_date, FieldID } = req.body;

    if (!discount || !start_date || !end_date || !FieldID) {
      return res.status(400).json({ error: 'Thiếu trường dữ liệu' });
    }

    if (new Date(start_date) >= new Date(end_date)) {
      return res.status(400).json({ error: 'Ngày bắt đầu phải trước ngày kết thúc' });
    }

    const newPromotion = await prisma.promotions.create({
      data: {
        discount,
        start_date,
        end_date,
        FieldID,
      },
    });

    return res.status(201).json(newPromotion);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Lấy danh sách khuyến mãi
export const getAllPromotions = async (req: any, res: any) => {
  try {
    const promotions = await prisma.promotions.findMany({
      include: {
        fields: true,
      },
    });

    return res.status(200).json(promotions);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Lấy khuyến mãi theo ID
export const getPromotionById = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const promotion = await prisma.promotions.findUnique({
      where: { promotion_id: id },
      include: {
        fields: true,
      },
    });

    if (!promotion) {
      return res.status(404).json({ error: 'Không tìm thấy khuyến mãi' });
    }

    return res.status(200).json(promotion);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Cập nhật khuyến mãi
export const updatePromotion = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { discount, start_date, end_date, FieldID } = req.body;

    if (!discount || !start_date || !end_date || !FieldID) {
      return res.status(400).json({ error: 'Thiếu trường dữ liệu' });
    }

    if (new Date(start_date) >= new Date(end_date)) {
      return res.status(400).json({ error: 'Ngày bắt đầu phải trước ngày kết thúc' });
    }

    const updatedPromotion = await prisma.promotions.update({
      where: { promotion_id: id },
      data: {
        discount,
        start_date,
        end_date,
        FieldID,
      },
    });

    return res.status(200).json(updatedPromotion);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Không tìm thấy khuyến mãi' });
    }
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Xóa khuyến mãi
export const deletePromotion = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    await prisma.promotions.delete({
      where: { promotion_id: id },
    });

    return res.status(200).json({ message: 'Xóa khuyến mãi thành công' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Không tìm thấy khuyến mãi' });
    }
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
