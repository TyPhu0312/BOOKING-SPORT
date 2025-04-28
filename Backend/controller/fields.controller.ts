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
// Định nghĩa kiểu dữ liệu cho PriceRange
interface PriceRange {
  from_hour: string;
  to_hour: string;
  price: string;
}

// Định nghĩa kiểu dữ liệu cho DayPriceRange
interface DayPriceRange {
  day_of_week: string;
  priceRanges: PriceRange[];
}

// Hàm kiểm tra định dạng thời gian HH:mm
const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

// Hàm kiểm tra các trường bắt buộc và trả về danh sách lỗi
const validateRequiredFields = (
  fieldData: any,
  user_id: string | undefined,
  category_id: string | undefined,
  option_ids: string[],
  schedules: ScheduleInput[],
  day_price_ranges: DayPriceRange[],
  file: Express.Multer.File | undefined
): string[] => {
  const errors: string[] = [];

  if (!fieldData.field_name) errors.push("Thiếu trường field_name");
  else if (fieldData.field_name.length > 255)
    errors.push("field_name không được dài quá 255 ký tự");

  if (fieldData.half_hour === undefined) errors.push("Thiếu trường half_hour");

  if (!fieldData.location) errors.push("Thiếu trường location");
  else if (fieldData.location.length > 255)
    errors.push("location không được dài quá 255 ký tự");

  if (!fieldData.description) errors.push("Thiếu trường description");
  else if (fieldData.description.length > 255)
    errors.push("description không được dài quá 255 ký tự");

  if (!user_id) errors.push("Thiếu trường user_id (OwnerID)");

  if (!category_id) errors.push("Thiếu trường category_id");

  if (!option_ids || !Array.isArray(option_ids) || option_ids.length === 0) {
    errors.push("option_ids phải là một mảng không rỗng");
  }

  if (!schedules || !Array.isArray(schedules)) {
    errors.push("schedules phải là một mảng");
  } else if (schedules.length !== 7) {
    errors.push("schedules phải có đúng 7 ngày trong tuần");
  }

  if (!day_price_ranges || !Array.isArray(day_price_ranges)) {
    errors.push("day_price_ranges phải là một mảng");
  }

  if (!file) errors.push("Thiếu file hình ảnh");

  return errors;
};

// Hàm validate schedules
const validateSchedules = (schedules: ScheduleInput[]): string[] => {
  const errors: string[] = [];
  const validDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  for (const schedule of schedules) {
    if (!schedule.day_of_week) {
      errors.push("Thiếu trường day_of_week trong schedule");
      continue;
    }

    if (!validDays.includes(schedule.day_of_week)) {
      errors.push(`Ngày không hợp lệ: ${schedule.day_of_week}. Phải là một trong: ${validDays.join(", ")}`);
      continue;
    }

    if (schedule.isClosed === undefined) {
      errors.push(`Thiếu trường isClosed cho ngày ${schedule.day_of_week}`);
      continue;
    }

    if (!schedule.isClosed) {
      if (!schedule.open_time) {
        errors.push(`Thiếu trường open_time cho ngày ${schedule.day_of_week}`);
      } else if (!isValidTimeFormat(schedule.open_time)) {
        errors.push(
          `Định dạng giờ mở không hợp lệ (HH:mm) cho ngày ${schedule.day_of_week}`
        );
      }

      if (!schedule.close_time) {
        errors.push(`Thiếu trường close_time cho ngày ${schedule.day_of_week}`);
      } else if (!isValidTimeFormat(schedule.close_time)) {
        errors.push(
          `Định dạng giờ đóng không hợp lệ (HH:mm) cho ngày ${schedule.day_of_week}`
        );
      }

      if (
        schedule.open_time &&
        schedule.close_time &&
        isValidTimeFormat(schedule.open_time) &&
        isValidTimeFormat(schedule.close_time)
      ) {
        const from = new Date(`1970-01-01T${schedule.open_time}:00`);
        const to = new Date(`1970-01-01T${schedule.close_time}:00`);
        if (from >= to) {
          errors.push(
            `Giờ mở cửa phải nhỏ hơn giờ đóng cửa cho ngày ${schedule.day_of_week}`
          );
        }
      }
    }
  }

  const daysCovered = schedules.map((s) => s.day_of_week);
  for (const day of validDays) {
    if (!daysCovered.includes(day)) {
      errors.push(`Thiếu lịch cho ngày ${day}`);
    }
  }
  return errors;
};

// Hàm validate day_price_ranges
const validateDayPriceRanges = (day_price_ranges: DayPriceRange[]): string[] => {
  const errors: string[] = [];
  const validDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  for (const dayPriceRange of day_price_ranges) {
    if (!dayPriceRange.day_of_week) {
      errors.push("Thiếu trường day_of_week trong day_price_ranges");
      continue;
    }

    if (!validDays.includes(dayPriceRange.day_of_week)) {
      errors.push(`Ngày không hợp lệ: ${dayPriceRange.day_of_week}. Phải là một trong: ${validDays.join(", ")}`);
      continue;
    }

    if (!dayPriceRange.priceRanges || !Array.isArray(dayPriceRange.priceRanges)) {
      errors.push(`priceRanges phải là một mảng cho ngày ${dayPriceRange.day_of_week}`);
      continue;
    }

    for (const range of dayPriceRange.priceRanges) {
      if (!range.from_hour) {
        errors.push(`Thiếu trường from_hour cho ngày ${dayPriceRange.day_of_week}`);
      } else if (!isValidTimeFormat(range.from_hour)) {
        errors.push(`Định dạng từ giờ không hợp lệ (HH:mm) cho ngày ${dayPriceRange.day_of_week}`);
      }

      if (!range.to_hour) {
        errors.push(`Thiếu trường to_hour cho ngày ${dayPriceRange.day_of_week}`);
      } else if (!isValidTimeFormat(range.to_hour)) {
        errors.push(`Định dạng đến giờ không hợp lệ (HH:mm) cho ngày ${dayPriceRange.day_of_week}`);
      }

      if (!range.price) {
        errors.push(`Thiếu trường price cho ngày ${dayPriceRange.day_of_week}`);
      } else {
        const price = parseFloat(range.price);
        if (isNaN(price) || price <= 0) {
          errors.push(`Giá phải là số dương cho ngày ${dayPriceRange.day_of_week}`);
        }
      }

      if (
        range.from_hour &&
        range.to_hour &&
        isValidTimeFormat(range.from_hour) &&
        isValidTimeFormat(range.to_hour)
      ) {
        const from = new Date(`1970-01-01T${range.from_hour}:00`);
        const to = new Date(`1970-01-01T${range.to_hour}:00`);
        if (from >= to) {
          errors.push(`Giờ bắt đầu phải nhỏ hơn giờ kết thúc cho ngày ${dayPriceRange.day_of_week}`);
        }
      }
    }

    for (let i = 0; i < dayPriceRange.priceRanges.length; i++) {
      const range1 = dayPriceRange.priceRanges[i];
      if (!range1.from_hour || !range1.to_hour) continue;

      const from1 = new Date(`1970-01-01T${range1.from_hour}:00`);
      const to1 = new Date(`1970-01-01T${range1.to_hour}:00`);

      for (let j = i + 1; j < dayPriceRange.priceRanges.length; j++) {
        const range2 = dayPriceRange.priceRanges[j];
        if (!range2.from_hour || !range2.to_hour) continue;

        const from2 = new Date(`1970-01-01T${range2.from_hour}:00`);
        const to2 = new Date(`1970-01-01T${range2.to_hour}:00`);

        if ((from1 <= to2 && to1 >= from2) || (from2 <= to1 && to2 >= from1)) {
          errors.push(`Các khung giờ không được trùng lặp trong ngày ${dayPriceRange.day_of_week}`);
          break;
        }
      }
    }
  }

  const daysCovered = day_price_ranges.map((d) => d.day_of_week);
  for (const day of validDays) {
    if (!daysCovered.includes(day)) {
      errors.push(`Thiếu giá cho ngày ${day}`);
    }
  }

  return errors;
};

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
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file ảnh (jpeg, jpg, png)!"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");

// Hàm chuyển đổi chuỗi HH:mm thành định dạng ISO-8601 DateTime
const convertTimeToISO = (time: string): string => {
  const date = new Date(`1970-01-01T${time}:00Z`);
  return date.toISOString();
};

export const createField = async (req: Request, res: Response): Promise<void> => {
  upload(req, res, async (err: any) => {
    if (err) {
      res.status(400).json({ errors: [err.message] });
      return;
    }

    try {
      // Parse dữ liệu từ body
      const field_name = req.body.field_name as string | undefined;
      const half_hour = req.body.half_hour === "true"; // Chuyển đổi từ string thành boolean
      const location = req.body.address ? JSON.parse(req.body.address).location : req.body.location;
      const description = req.body.description as string | undefined;
      const user_id = req.body.user_id as string | undefined; // OwnerID
      const category_id = req.body.category_id as string | undefined;
      const option_ids = req.body.option_ids ? JSON.parse(req.body.option_ids) : [];
      const schedules: ScheduleInput[] = req.body.schedules ? JSON.parse(req.body.schedules) : [];
      const day_price_ranges: DayPriceRange[] = req.body.day_price_ranges ? JSON.parse(req.body.day_price_ranges) : [];

      // Tạo fieldData để validate
      const fieldData = {
        field_name,
        half_hour,
        location,
        description
      };

      // Validate các trường bắt buộc
      const requiredFieldErrors = validateRequiredFields(
        fieldData,
        user_id,
        category_id,
        option_ids,
        schedules,
        day_price_ranges,
        req.file
      );

      // Validate schedules
      const scheduleErrors = validateSchedules(schedules);

      // Validate day_price_ranges
      const priceRangeErrors = validateDayPriceRanges(day_price_ranges);

      // Kết hợp tất cả lỗi
      const allErrors = [...requiredFieldErrors, ...scheduleErrors, ...priceRangeErrors];

      if (allErrors.length > 0) {
        res.status(400).json({ errors: allErrors });
        return;
      }

      // Kiểm tra OwnerID và CategoryID
      const userExists = await prisma.user.findUnique({
        where: { user_id },
      });
      if (!userExists) {
        res.status(400).json({ errors: ["User không tồn tại"] });
        return;
      }

      const categoryExists = await prisma.category.findUnique({
        where: { category_id },
      });
      if (!categoryExists) {
        res.status(400).json({ errors: ["Category không tồn tại"] });
        return;
      }

      // Kiểm tra option_ids thuộc về Category
      const validOptions = await prisma.option_Fields.findMany({
        where: {
          option_field_id: { in: option_ids },
          CategoryID: category_id,
        },
      });
      if (validOptions.length !== option_ids.length) {
        res.status(400).json({ errors: ["Một số option không thuộc category đã chọn"] });
        return;
      }

      const imageUrl = `/uploads/${req.file!.filename}`;

      // Tạo Field mới
      const newField = await prisma.fields.create({
        data: {
          field_name: field_name!,
          half_hour,
          location: location!,
          description: description!,
          status: Fields_status.Inactive,
          image_url: imageUrl,
          OwnerID: user_id!,
          CategoryID: category_id!,
          schedules: {
            create: schedules.map((schedule: ScheduleInput) => ({
              day_of_week: schedule.day_of_week as DayOfWeek,
              open_time:
                schedule.isClosed || !schedule.open_time
                  ? null
                  : new Date(convertTimeToISO(schedule.open_time)),
              close_time:
                schedule.isClosed || !schedule.close_time
                  ? null
                  : new Date(convertTimeToISO(schedule.close_time)),
              isClosed: schedule.isClosed,
            })),
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
      const spacePerHourData = day_price_ranges.flatMap((dayPriceRange: DayPriceRange) =>
        dayPriceRange.priceRanges.map((range: PriceRange) => ({
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
        res.status(400).json({ errors: ["Dữ liệu bị trùng lặp"] });
        return;
      }
      if (error.code === "P2003") {
        res.status(400).json({ errors: ["Không tìm thấy User hoặc Category liên quan"] });
        return;
      }
      res.status(500).json({ errors: ["Lỗi server: " + error.message] });
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
        owner: true,
        Space_Per_Hour: true,
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
        owner: true,
        Space_Per_Hour: true,
        bookings: true,
      },
    });

    if (!field) {
      res.status(404).json({ error: "Không tìm thấy Field" });
      return;
    }

    const fieldWithFormattedSchedule = {
      ...field,
      schedules: field.schedules.map((s) => ({
        ...s,
        open_time: s.open_time ? new Date(s.open_time).toISOString().substring(11, 16) : null,
        close_time: s.close_time ? new Date(s.close_time).toISOString().substring(11, 16) : null,
      })),
    };

    res.status(200).json(fieldWithFormattedSchedule);
  } catch (error: any) {
    console.error("Error fetching field:", error);
    res.status(500).json({ error: "Lỗi server: " + error.message });
  }
};

// Cập nhật Field
export const updateField = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { field_name, half_hour, location, description, status, image_url, create_at, OwnerID, CategoryID, option_ids } = req.body;

    const updateData: any = {};

    if (field_name !== undefined) {
      if (typeof field_name !== "string" || field_name.length > 30) {
        res.status(400).json({ error: "field_name không hợp lệ (tối đa 30 ký tự)" });
        return;
      }
      updateData.field_name = field_name;
    }

    if (half_hour !== undefined) {
      if (typeof half_hour !== "boolean") {
        res.status(400).json({ error: "half_hour phải là boolean" });
        return;
      }
      updateData.half_hour = half_hour;
    }

    if (location !== undefined) {
      if (typeof location !== "string" || location.length > 30) {
        res.status(400).json({ error: "location không hợp lệ (tối đa 30 ký tự)" });
        return;
      }
      updateData.location = location;
    }

    if (description !== undefined) {
      if (typeof description !== "string" || description.length > 30) {
        res.status(400).json({ error: "description không hợp lệ (tối đa 255 ký tự)" });
        return;
      }
      updateData.description = description;
    }

    if (status !== undefined) {
      if (!Object.values(Fields_status).includes(status)) {
        res.status(400).json({ error: "Trạng thái không hợp lệ" });
        return;
      }
      updateData.status = status;
    }

    if (image_url !== undefined) {
      if (typeof image_url !== "string") {
        res.status(400).json({ error: "image_url không hợp lệ" });
        return;
      }
      updateData.image_url = image_url;
    }

    if (create_at !== undefined) {
      if (typeof create_at !== "string" || isNaN(new Date(create_at).getTime())) {
        res.status(400).json({ error: "create_at không hợp lệ" });
        return;
      }
      updateData.create_at = create_at;
    }

    if (OwnerID !== undefined) {
      const userExists = await prisma.user.findUnique({
        where: { user_id: OwnerID },
      });
      if (!userExists) {
        res.status(400).json({ error: "User không tồn tại" });
        return;
      }
      updateData.OwnerID = OwnerID;
    }

    if (CategoryID !== undefined) {
      const categoryExists = await prisma.category.findUnique({
        where: { category_id: CategoryID },
      });
      if (!categoryExists) {
        res.status(400).json({ error: "Category không tồn tại" });
        return;
      }
      updateData.CategoryID = CategoryID;
    }

    if (option_ids !== undefined) {
      if (!Array.isArray(option_ids)) {
        res.status(400).json({ error: "option_ids phải là một mảng" });
        return;
      }

      const validOptions = await prisma.option_Fields.findMany({
        where: {
          option_field_id: { in: option_ids },
          CategoryID: req.body.CategoryID || (await prisma.fields.findUnique({ where: { field_id: id } }))?.CategoryID,
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

    if (Object.keys(updateData).length === 0 && !option_ids) {
      res.status(400).json({ error: "Không có dữ liệu nào để cập nhật" });
      return;
    }

    const updatedField = await prisma.fields.update({
      where: { field_id: id },
      data: updateData,
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