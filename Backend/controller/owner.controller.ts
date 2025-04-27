import { PrismaClient, Fields_status } from '@prisma/client';
import multer from 'multer';
import path from 'path';

const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
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
      cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png)!'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('image');

export const registerField = async (req: any, res: any) => {
  upload(req, res, async (err: any) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: 'Lỗi khi upload ảnh: ' + err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    try {
      const {
        user_id,
        category_id,
        option_ids,
        field,
        schedules,
        price_ranges,
      } = req.body;

      const parsedField = JSON.parse(field);
      const parsedOptionIds = JSON.parse(option_ids);
      const parsedSchedules = JSON.parse(schedules);
      const parsedPriceRanges = JSON.parse(price_ranges);

      if (
        !user_id ||
        !category_id ||
        !parsedOptionIds ||
        !parsedField ||
        !parsedSchedules ||
        !parsedPriceRanges ||
        !req.file
      ) {
        return res.status(400).json({ error: 'Thiếu trường dữ liệu hoặc hình ảnh sân' });
      }

      const { field_name, location, description, half_hour } = parsedField;

      if (
        !field_name ||
        !location ||
        !description ||
        half_hour === undefined
      ) {
        return res.status(400).json({ error: 'Thiếu thông tin sân' });
      }

      if (!Array.isArray(parsedOptionIds) || parsedOptionIds.length === 0) {
        return res.status(400).json({ error: 'Phải chọn ít nhất một loại sân' });
      }

      if (!Array.isArray(parsedSchedules) || parsedSchedules.length !== 7) {
        return res.status(400).json({ error: 'Phải cung cấp giờ mở/đóng cho 7 ngày trong tuần' });
      }

      for (const schedule of parsedSchedules) {
        if (!schedule.day_of_week || !schedule.open_time || !schedule.close_time) {
          return res.status(400).json({ error: 'Dữ liệu giờ mở/đóng không hợp lệ' });
        }
        if (!['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].includes(schedule.day_of_week)) {
          return res.status(400).json({ error: 'Ngày trong tuần không hợp lệ' });
        }
      }

      if (!Array.isArray(parsedPriceRanges) || parsedPriceRanges.length === 0) {
        return res.status(400).json({ error: 'Phải cung cấp ít nhất một khung giờ và giá' });
      }

      for (const range of parsedPriceRanges) {
        if (!range.day_of_week || !range.from_hour || !range.to_hour || !range.price) {
          return res.status(400).json({ error: 'Dữ liệu khung giờ và giá không hợp lệ, bao gồm ngày' });
        }
        const from = new Date(`1970-01-01T${range.from_hour}:00`);
        const to = new Date(`1970-01-01T${range.to_hour}:00`);
        if (from >= to) {
          return res.status(400).json({ error: 'Giờ bắt đầu phải nhỏ hơn giờ kết thúc' });
        }
      }

      for (let i = 0; i < parsedPriceRanges.length; i++) {
        const range1 = parsedPriceRanges[i];
        const from1 = new Date(`1970-01-01T${range1.from_hour}:00`);
        const to1 = new Date(`1970-01-01T${range1.to_hour}:00`);

        for (let j = i + 1; j < parsedPriceRanges.length; j++) {
          const range2 = parsedPriceRanges[j];
          if (range1.day_of_week !== range2.day_of_week) continue; // Chỉ kiểm tra nếu cùng ngày
          const from2 = new Date(`1970-01-01T${range2.from_hour}:00`);
          const to2 = new Date(`1970-01-01T${range2.to_hour}:00`);

          if (
            (from1 <= to2 && to1 >= from2) ||
            (from2 <= to1 && to2 >= from1)
          ) {
            return res.status(400).json({ error: `Các khung giờ không được trùng lặp trong cùng ngày (${range1.day_of_week})` });
          }
        }
      }

      const imageUrl = `/uploads/${req.file.filename}`;

      const newField = await prisma.fields.create({
        data: {
          field_name,
          half_hour: Boolean(half_hour),
          location,
          description,
          status: Fields_status.Inactive,
          image_url: imageUrl,          
          OwnerID: user_id,
          CategoryID: category_id,
          options: parsedOptionIds[0],
        },
      });
      await Promise.all(
        parsedPriceRanges.map((range: any) =>
          prisma.space_Per_Hour.create({
            data: {
              day_of_week: range.day_of_week, // Lưu day_of_week
              from_hour_value: range.from_hour,
              to_hour_value: range.to_hour,
              price: parseFloat(range.price),
              FieldID: newField.field_id,
            },
          })
        )
      );

      return res.status(201).json(newField);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  });
};