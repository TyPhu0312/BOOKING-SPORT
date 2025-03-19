import { PrismaClient, Payments_Method, Payments_Status } from '@prisma/client';

const prisma = new PrismaClient();

// Tạo Payment mới
export const createPayment = async (req: any, res: any) => {
  try {
    const { total_price, payment_date, method, status } = req.body;

    if (!total_price || !payment_date || !method || !status) {
      return res.status(400).json({ error: 'Thiếu trường dữ liệu' });
    }

    if (!Object.values(Payments_Method).includes(method)) {
      return res.status(400).json({ error: 'Phương thức thanh toán không hợp lệ' });
    }

    if (!Object.values(Payments_Status).includes(status)) {
      return res.status(400).json({ error: 'Trạng thái thanh toán không hợp lệ' });
    }

    const newPayment = await prisma.payments.create({
      data: { total_price, payment_date, method, status },
    });

    return res.status(201).json(newPayment);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Lấy danh sách Payments
export const getAllPayments = async (req: any, res: any) => {
  try {
    const payments = await prisma.payments.findMany({
      include: { Payment_Bookings: true },
    });

    return res.status(200).json(payments);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Lấy Payment theo ID
export const getPaymentById = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payments.findUnique({
      where: { payment_id: id },
      include: { Payment_Bookings: true },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Không tìm thấy Payment' });
    }

    return res.status(200).json(payment);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Cập nhật Payment
export const updatePayment = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { total_price, payment_date, method, status } = req.body;

    if (!total_price || !payment_date || !method || !status) {
      return res.status(400).json({ error: 'Thiếu trường dữ liệu' });
    }

    if (!Object.values(Payments_Method).includes(method)) {
      return res.status(400).json({ error: 'Phương thức thanh toán không hợp lệ' });
    }

    if (!Object.values(Payments_Status).includes(status)) {
      return res.status(400).json({ error: 'Trạng thái thanh toán không hợp lệ' });
    }

    const updatedPayment = await prisma.payments.update({
      where: { payment_id: id },
      data: { total_price, payment_date, method, status },
    });

    return res.status(200).json(updatedPayment);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Không tìm thấy Payment' });
    }
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Xóa Payment
export const deletePayment = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    await prisma.payments.delete({
      where: { payment_id: id },
    });

    return res.status(200).json({ message: 'Xóa Payment thành công' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Không tìm thấy Payment' });
    }
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
