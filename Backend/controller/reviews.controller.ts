import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Tạo Review mới
export const createReview = async (req: any, res: any) => {
  try {
    const { rating, comment, create_at, UserID, FieldID } = req.body;

    if (!rating || !comment || !create_at || !UserID || !FieldID) {
      return res.status(400).json({ error: 'Thiếu trường dữ liệu' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating phải nằm trong khoảng 1-5' });
    }

    const newReview = await prisma.reviews.create({
      data: {
        rating,
        comment,
        create_at,
        UserID,
        FieldID,
      },
    });

    return res.status(201).json(newReview);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Lấy danh sách Reviews
export const getAllReviews = async (req: any, res: any) => {
  try {
    const reviews = await prisma.reviews.findMany({
      include: {
        user: true,
        fields: true,
      },
    });

    return res.status(200).json(reviews);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Lấy Review theo ID
export const getReviewById = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const review = await prisma.reviews.findUnique({
      where: { review_id: id },
      include: {
        user: true,
        fields: true,
      },
    });

    if (!review) {
      return res.status(404).json({ error: 'Không tìm thấy Review' });
    }

    return res.status(200).json(review);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Cập nhật Review
export const updateReview = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { rating, comment, create_at, UserID, FieldID } = req.body;

    if (!rating || !comment || !create_at || !UserID || !FieldID) {
      return res.status(400).json({ error: 'Thiếu trường dữ liệu' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating phải nằm trong khoảng 1-5' });
    }

    const updatedReview = await prisma.reviews.update({
      where: { review_id: id },
      data: {
        rating,
        comment,
        create_at,
        UserID,
        FieldID,
      },
    });

    return res.status(200).json(updatedReview);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Không tìm thấy Review' });
    }
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Xóa Review
export const deleteReview = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    await prisma.reviews.delete({
      where: { review_id: id },
    });

    return res.status(200).json({ message: 'Xóa Review thành công' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Không tìm thấy Review' });
    }
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
