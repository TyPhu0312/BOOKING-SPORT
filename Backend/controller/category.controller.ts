import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Lấy tất cả danh mục
export const getAllCategories = async (req: any, res: any) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        optionFields: true,
      },
    });
    res.status(200).json(categories);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Lỗi server" });
  }
};

// Lấy danh mục theo ID
export const getCategoryById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { category_id: id },
      include: {
        fields: true,
        optionFields: true,
      },
    });
    if (!category)
      return res.status(404).json({ error: "Không tìm thấy danh mục" });
    res.status(200).json(category);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Lỗi server" });
  }
};

// Tạo danh mục mới
export const createCategory = async (req: any, res: any) => {
  try {
    const { category_name } = req.body;
    if (!category_name?.trim())
      return res.status(400).json({ error: "Thiếu tên danh mục" });

    const newCategory = await prisma.category.create({
      data: { category_name },
    });
    res.status(201).json(newCategory);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Lỗi server" });
  }
};

// Cập nhật danh mục
export const updateCategory = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { category_name } = req.body;

    const updatedCategory = await prisma.category.update({
      where: { category_id: id },
      data: { category_name },
    });
    res.status(200).json(updatedCategory);
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Không tìm thấy danh mục" });
    }
    console.error(error);
    res.status(500).json({ error: error.message || "Lỗi server" });
  }
};

// Xóa danh mục
export const deleteCategory = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({
      where: { category_id: id },
    });
    res.status(200).json({ message: "Xóa danh mục thành công" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Không tìm thấy danh mục" });
    }
    console.error(error);
    res.status(500).json({ error: error.message || "Lỗi server" });
  }
};
