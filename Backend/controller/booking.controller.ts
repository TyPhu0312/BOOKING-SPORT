import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Lấy tất cả các booking
export const getAllBookings = async (req: any, res: any) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { user: true, fields: true },
    });
    res.status(200).json(bookings);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Lỗi server' });
  }
};

// Lấy booking theo ID
export const getBookingById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { booking_id: id },
      include: { user: true, fields: true },
    });
    if (!booking) return res.status(404).json({ error: 'Không tìm thấy booking' });
    res.status(200).json(booking);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Lỗi server' });
  }
};

// Tạo booking mới
export const createBooking = async (req: any, res: any) => {
  try {
    const { booking_date, time_start, time_end, total_price, deposit, Status, prove_payment, UserID, FieldID } = req.body;
    if (!booking_date || !time_start || !time_end || !total_price || !deposit || !UserID || !FieldID) {
      return res.status(400).json({ error: 'Thiếu trường dữ liệu' });
    }
    const newBooking = await prisma.booking.create({
      data: { booking_date, time_start, time_end, total_price, deposit, Status, prove_payment, UserID, FieldID },
    });
    res.status(201).json(newBooking);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Lỗi server' });
  }
};

// Cập nhật booking
export const updateBooking = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { booking_date, time_start, time_end, total_price, deposit, Status, prove_payment } = req.body;
    const updatedBooking = await prisma.booking.update({
      where: { booking_id: id },
      data: { booking_date, time_start, time_end, total_price, deposit, Status, prove_payment },
    });
    res.status(200).json(updatedBooking);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Không tìm thấy booking' });
    }
    console.error(error);
    res.status(500).json({ error: error.message || 'Lỗi server' });
  }
};

// Xóa booking
export const deleteBooking = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await prisma.booking.delete({ where: { booking_id: id } });
    res.status(200).json({ message: 'Xóa booking thành công' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Không tìm thấy booking' });
    }
    console.error(error);
    res.status(500).json({ error: error.message || 'Lỗi server' });
  }
};
