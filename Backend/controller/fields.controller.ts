import { PrismaClient, Fields_status, DayOfWeek } from "@prisma/client";
import multer from "multer";
import path from "path";
import { Request, Response } from "express";

// Định nghĩa interface cho dữ liệu schedule từ frontend
interface ScheduleInput {
  day_of_week: string;
  open_time: string;
  close_time: string;
  isClosed: boolean;
}

const prisma = new PrismaClient();

// Cấu hình multer để upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file ảnh (jpeg, jpg, png)!"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
}).single("image");

// Hàm chuyển đổi chuỗi HH:mm thành định dạng ISO-8601 DateTime
const convertTimeToISO = (time: string): string => {
  // Sử dụng ngày cố định (1970-01-01) để ghép với giờ và phút
  const date = new Date(`1970-01-01T${time}:00Z`);
  return date.toISOString(); // Trả về định dạng ISO-8601, ví dụ: "1970-01-01T06:00:00.000Z"
};

export const createField = async (req: Request, res: Response): Promise<void> => {
  upload(req, res, async (err: any) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    try {
      const fieldData = req.body.field ? JSON.parse(req.body.field) : {};
      const field_name = fieldData.field_name as string | undefined;
      const half_hour = fieldData.half_hour as boolean | undefined;
      const location = fieldData.location as string | undefined;
      const description = fieldData.description as string | undefined;
      const OwnerID = req.body.user_id as string | undefined;
      const CategoryID = req.body.category_id as string | undefined;
      const option_ids = req.body.option_ids ? JSON.parse(req.body.option_ids) : [];
      const schedules: ScheduleInput[] = req.body.schedules ? JSON.parse(req.body.schedules) : [];
      const day_price_ranges = req.body.day_price_ranges ? JSON.parse(req.body.day_price_ranges) : [];

      // Validation
      if (
        !field_name ||
        field_name.length > 30 ||
        half_hour === undefined ||
        !location ||
        location.length > 30 ||
        !description ||
        description.length > 30 ||
        !OwnerID ||
        !CategoryID ||
        !option_ids.length ||
        !Array.isArray(option_ids) ||
        !Array.isArray(schedules) ||
        schedules.length !== 7 ||
        !Array.isArray(day_price_ranges) ||
        !req.file
      ) {
        res.status(400).json({ error: "Thiếu trường dữ liệu hoặc dữ liệu không hợp lệ" });
        return;
      }

      // Validate schedules
      for (const schedule of schedules) {
        if (
          !schedule.day_of_week ||
          !['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].includes(schedule.day_of_week)
        ) {
          res.status(400).json({ error: `Ngày không hợp lệ: ${schedule.day_of_week}` });
          return;
        }

        // Chỉ validate open_time và close_time nếu isClosed là false
        if (!schedule.isClosed) {
          if (!schedule.open_time || !schedule.close_time) {
            res.status(400).json({ error: `Vui lòng điền giờ mở/đóng cửa cho ngày ${schedule.day_of_week}` });
            return;
          }
          const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
          if (!timeRegex.test(schedule.open_time) || !timeRegex.test(schedule.close_time)) {
            res.status(400).json({ error: `Định dạng giờ mở/đóng không hợp lệ (HH:mm) cho ngày ${schedule.day_of_week}` });
            return;
          }
          const from = new Date(`1970-01-01T${schedule.open_time}:00`);
          const to = new Date(`1970-01-01T${schedule.close_time}:00`);
          if (from >= to) {
            res.status(400).json({ error: `Giờ mở cửa phải nhỏ hơn giờ đóng cửa cho ngày ${schedule.day_of_week}` });
            return;
          }
        }
      }

      // Validate day_price_ranges
      for (const dayPriceRange of day_price_ranges) {
        if (!dayPriceRange.day_of_week || !['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].includes(dayPriceRange.day_of_week)) {
          res.status(400).json({ error: `Ngày không hợp lệ: ${dayPriceRange.day_of_week}` });
          return;
        }

        for (const range of dayPriceRange.priceRanges) {
          if (!range.from_hour || !range.to_hour || !range.price) {
            res.status(400).json({ error: `Dữ liệu khung giờ và giá không hợp lệ cho ngày ${dayPriceRange.day_of_week}` });
            return;
          }

          const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
          if (!timeRegex.test(range.from_hour) || !timeRegex.test(range.to_hour)) {
            res.status(400).json({ error: `Định dạng khung giờ không hợp lệ cho ngày ${dayPriceRange.day_of_week}` });
            return;
          }

          const from = new Date(`1970-01-01T${range.from_hour}:00`);
          const to = new Date(`1970-01-01T${range.to_hour}:00`);
          if (from >= to) {
            res.status(400).json({ error: `Giờ bắt đầu phải nhỏ hơn giờ kết thúc cho ngày ${dayPriceRange.day_of_week}` });
            return;
          }

          const price = parseFloat(range.price);
          if (isNaN(price) || price <= 0) {
            res.status(400).json({ error: `Giá phải là số dương cho ngày ${dayPriceRange.day_of_week}` });
            return;
          }
        }

        // Check for overlapping price ranges in the same day
        for (let i = 0; i < dayPriceRange.priceRanges.length; i++) {
          const range1 = dayPriceRange.priceRanges[i];
          const from1 = new Date(`1970-01-01T${range1.from_hour}:00`);
          const to1 = new Date(`1970-01-01T${range1.to_hour}:00`);

          for (let j = i + 1; j < dayPriceRange.priceRanges.length; j++) {
            const range2 = dayPriceRange.priceRanges[j];
            const from2 = new Date(`1970-01-01T${range2.from_hour}:00`);
            const to2 = new Date(`1970-01-01T${range2.to_hour}:00`);

            if ((from1 <= to2 && to1 >= from2) || (from2 <= to1 && to2 >= from1)) {
              res.status(400).json({ error: `Các khung giờ không được trùng lặp trong ngày ${dayPriceRange.day_of_week}` });
              return;
            }
          }
        }
      }

      // Kiểm tra OwnerID và CategoryID
      const userExists = await prisma.user.findUnique({ where: { user_id: OwnerID } });
      if (!userExists) {
        res.status(400).json({ error: "User không tồn tại" });
        return;
      }

      const categoryExists = await prisma.category.findUnique({ where: { category_id: CategoryID } });
      if (!categoryExists) {
        res.status(400).json({ error: "Category không tồn tại" });
        return;
      }

      // Kiểm tra option_ids thuộc về Category
      const validOptions = await prisma.option_Fields.findMany({
        where: {
          option_field_id: { in: option_ids },
          CategoryID: CategoryID,
        },
      });
      if (validOptions.length !== option_ids.length) {
        res.status(400).json({ error: "Một số option không thuộc category đã chọn" });
        return;
      }

      const imageUrl = `/uploads/${req.file.filename}`;

      // Tạo Field mới
      const newField = await prisma.fields.create({
        data: {
          field_name,
          half_hour,
          location,
          description,
          status: Fields_status.Inactive,
          image_url: imageUrl,
          OwnerID,
          CategoryID,
          schedules: {
            create: schedules.map((schedule: ScheduleInput) => {
              if (!['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].includes(schedule.day_of_week)) {
                throw new Error(`day_of_week không hợp lệ: ${schedule.day_of_week}`);
              }
              return {
                day_of_week: schedule.day_of_week as DayOfWeek,
                open_time: schedule.isClosed ? undefined : new Date(convertTimeToISO(schedule.open_time)), // Chuyển đổi thành ISO-8601
                close_time: schedule.isClosed ? undefined : new Date(convertTimeToISO(schedule.close_time)), // Chuyển đổi thành ISO-8601
                isClosed: schedule.isClosed,
              };
            }),
          },
        },
      });

      // Lưu quan hệ giữa Field và Option_Fields vào bảng Field_Option
      await prisma.field_Option.createMany({
        data: option_ids.map((option_field_id: string) => ({
          field_id: newField.field_id,
          option_field_id,
        })),
      });

      // Lưu day_price_ranges vào Space_Per_Hour
      const spacePerHourData = day_price_ranges.flatMap((dayPriceRange: any) =>
        dayPriceRange.priceRanges.map((range: any) => ({
          from_hour_value: range.from_hour,
          to_hour_value: range.to_hour,
          price: parseFloat(range.price),
          FieldID: newField.field_id,
          day_of_week: dayPriceRange.day_of_week,
        }))
      );

      await prisma.space_Per_Hour.createMany({
        data: spacePerHourData,
      });

      res.status(201).json(newField);
    } catch (error: any) {
      console.error("Error creating field:", error);
      if (error.code === "P2002") {
        res.status(400).json({ error: "Dữ liệu bị trùng lặp" });
        return;
      }
      if (error.code === "P2003") {
        res.status(400).json({ error: "Không tìm thấy User hoặc Category liên quan" });
        return;
      }
      res.status(500).json({ error: "Lỗi server: " + error.message });
    }
  });
};

// Lấy danh sách Fields
export const getAllFields = async (req: Request, res: Response): Promise<void> => {
  try {
    const fields = await prisma.fields.findMany({
      include: {
        schedules: true,
        category: {
          include: {
            optionFields: true,
          },
        },
        options: {
          include: {
            optionField: true,
          },
        },
      },
    });

    res.status(200).json(fields);
  } catch (error: any) {
    console.error("Error fetching fields:", error);
    res.status(500).json({ error: "Lỗi server: " + error.message });
  }
};

// Lấy Field theo ID
export const getFieldById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const field = await prisma.fields.findUnique({
      where: { field_id: id },
      include: {
        schedules: true,
        category: {
          include: {
            optionFields: true,
          },
        },
        options: {
          include: {
            optionField: true,
          },
        },
      },
    });

    if (!field) {
      res.status(404).json({ error: "Không tìm thấy Field" });
      return;
    }

    res.status(200).json(field);
  } catch (error: any) {
    console.error("Error fetching field:", error);
    res.status(500).json({ error: "Lỗi server: " + error.message });
  }
};

// Cập nhật Field
export const updateField = async (req: Request, res: Response): Promise<void> => {
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
      option_ids,
    } = req.body;

    if (
      !field_name ||
      field_name.length > 30 ||
      half_hour === undefined ||
      !location ||
      location.length > 30 ||
      !description ||
      description.length > 30 ||
      !status ||
      !image_url ||
      !create_at ||
      !OwnerID ||
      !CategoryID
    ) {
      res.status(400).json({ error: "Thiếu trường dữ liệu hoặc dữ liệu không hợp lệ" });
      return;
    }

    if (!Object.values(Fields_status).includes(status)) {
      res.status(400).json({ error: "Trạng thái không hợp lệ" });
      return;
    }

    const userExists = await prisma.user.findUnique({ where: { user_id: OwnerID } });
    if (!userExists) {
      res.status(400).json({ error: "User không tồn tại" });
      return;
    }

    const categoryExists = await prisma.category.findUnique({ where: { category_id: CategoryID } });
    if (!categoryExists) {
      res.status(400).json({ error: "Category không tồn tại" });
      return;
    }

    if (option_ids && Array.isArray(option_ids)) {
      const validOptions = await prisma.option_Fields.findMany({
        where: {
          option_field_id: { in: option_ids },
          CategoryID: CategoryID,
        },
      });
      if (validOptions.length !== option_ids.length) {
        res.status(400).json({ error: "Một số option không thuộc category đã chọn" });
        return;
      }

      await prisma.field_Option.deleteMany({
        where: { field_id: id },
      });

      await prisma.field_Option.createMany({
        data: option_ids.map((option_field_id: string) => ({
          field_id: id,
          option_field_id,
        })),
      });
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
        OwnerID,
        CategoryID,
      },
      include: {
        category: {
          include: {
            optionFields: true,
          },
        },
        options: {
          include: {
            optionField: true,
          },
        },
      },
    });

    res.status(200).json(updatedField);
  } catch (error: any) {
    console.error("Error updating field:", error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "Không tìm thấy Field" });
      return;
    }
    if (error.code === "P2003") {
      res.status(400).json({ error: "Không tìm thấy User hoặc Category liên quan" });
      return;
    }
    res.status(500).json({ error: "Lỗi server: " + error.message });
  }
};

// Xóa Field
export const deleteField = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.fields.delete({
      where: { field_id: id },
    });

    res.status(200).json({ message: "Xóa Field thành công" });
  } catch (error: any) {
    console.error("Error deleting field:", error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "Không tìm thấy Field" });
      return;
    }
    res.status(500).json({ error: "Lỗi server: " + error.message });
  }
};