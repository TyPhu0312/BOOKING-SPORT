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
function combineDateAndTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00Z`);
}
// Lấy booking theo UserID
export const getBookingsByUserId = async (req: any, res: any) => {
  try {
    const { userId } = req.params;
    const bookings = await prisma.booking.findMany({
      where: { UserID: userId },
      include: {
        fields: {
          select: {
            field_name: true,
            location: true,
          },
        },
      },
      orderBy: { booking_date: 'desc' }, // Sắp xếp theo ngày đặt mới nhất
    });
    if (!bookings.length) {
      return res.status(404).json({ error: 'Không tìm thấy booking nào cho người dùng này' });
    }
    res.status(200).json(bookings);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Lỗi server' });
  }
};

// Tạo booking mới
export const createBooking = async (req: any, res: any) => {
  try {
    const {
      booking_date,
      time_start,
      time_end,
      total_price,
      deposit,
      Status,
      prove_payment,
      UserID,
      FieldID,
    } = req.body;

    if (
      !booking_date ||
      !time_start ||
      !time_end ||
      !total_price ||
      !deposit ||
      !UserID ||
      !FieldID
    ) {
      return res.status(400).json({ error: 'Thiếu trường dữ liệu' });
    }

    const startDateTime = combineDateAndTime(booking_date, time_start);
    const endDateTime = combineDateAndTime(booking_date, time_end);

    // 1. Kiểm tra xem đã có người đặt trong khoảng giờ đó chưa
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        FieldID: FieldID,
        booking_date: new Date(booking_date),
        OR: [
          {
            time_start: {
              lt: endDateTime,
            },
            time_end: {
              gt: startDateTime,
            },
          },
        ],
      },
    });

    if (overlappingBooking) {
      const overlapStart = new Date(Math.max(
        startDateTime.getTime(),
        overlappingBooking.time_start.getTime()
      ));
    
      const overlapEnd = new Date(Math.min(
        endDateTime.getTime(),
        overlappingBooking.time_end.getTime()
      ));
    
      const formatTime = (date: Date) => {
        const vnTime = new Date(date.getTime() - 7 * 60 * 60 * 1000);
        return vnTime.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
      };

      return res.status(400).json({
        error: `Khung giờ từ ${formatTime(overlapStart)} đến ${formatTime(overlapEnd)} đã có người đặt.`,
      });
    }

    // 2. Nếu không có booking trùng thì tiến hành tạo
    const newBooking = await prisma.booking.create({
      data: {
        booking_date: new Date(booking_date),
        time_start: startDateTime,
        time_end: endDateTime,
        total_price: parseInt(total_price),
        deposit: parseInt(deposit),
        Status: Status || 'Pending',
        prove_payment: prove_payment || '',
        UserID,
        FieldID,
      },
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
