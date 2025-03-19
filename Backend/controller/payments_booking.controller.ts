import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Lấy tất cả các thanh toán đặt chỗ
export const getAllPaymentBookings = async (req: any, res: any) => {
  try {
    const paymentBookings = await prisma.payments_Booking.findMany({
      include: { payment: true, booking: true },
    });
    res.status(200).json(paymentBookings);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Lỗi server' });
  }
};

// Lấy một thanh toán đặt chỗ theo PaymentID và BookingID
export const getPaymentBookingById = async (req: any, res: any) => {
  try {
    const { paymentId, bookingId } = req.params;
    const paymentBooking = await prisma.payments_Booking.findUnique({
      where: { PaymentID_BookingID: { PaymentID: paymentId, BookingID: bookingId } },
      include: { payment: true, booking: true },
    });
    if (!paymentBooking) return res.status(404).json({ error: 'Không tìm thấy thanh toán đặt chỗ' });
    res.status(200).json(paymentBooking);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Lỗi server' });
  }
};

// Tạo mới một thanh toán đặt chỗ
export const createPaymentBooking = async (req: any, res: any) => {
  try {
    const { isDeposit, PaymentID, BookingID } = req.body;
    if (!PaymentID || !BookingID) {
      return res.status(400).json({ error: 'Thiếu trường dữ liệu' });
    }
    const newPaymentBooking = await prisma.payments_Booking.create({
      data: { isDeposit, PaymentID, BookingID },
    });
    res.status(201).json(newPaymentBooking);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Lỗi server' });
  }
};

// Cập nhật thanh toán đặt chỗ
export const updatePaymentBooking = async (req: any, res: any) => {
  try {
    const { paymentId, bookingId } = req.params;
    const { isDeposit } = req.body;
    const updatedPaymentBooking = await prisma.payments_Booking.update({
      where: { PaymentID_BookingID: { PaymentID: paymentId, BookingID: bookingId } },
      data: { isDeposit },
    });
    res.status(200).json(updatedPaymentBooking);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Không tìm thấy thanh toán đặt chỗ' });
    }
    console.error(error);
    res.status(500).json({ error: error.message || 'Lỗi server' });
  }
};

// Xóa thanh toán đặt chỗ
export const deletePaymentBooking = async (req: any, res: any) => {
  try {
    const { paymentId, bookingId } = req.params;
    await prisma.payments_Booking.delete({
      where: { PaymentID_BookingID: { PaymentID: paymentId, BookingID: bookingId } },
    });
    res.status(200).json({ message: 'Xóa thanh toán đặt chỗ thành công' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Không tìm thấy thanh toán đặt chỗ' });
    }
    console.error(error);
    res.status(500).json({ error: error.message || 'Lỗi server' });
  }
};
