import express, { Application, NextFunction } from "express";
import { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Import các router
import routerUser from "./router/user.router";
import routerCategory from "./router/category.router";
import routerBankAccount from "./router/bank_account.router";
import routerBooking from "./router/booking.router";
import routerFieldsSchedules from "./router/fields_schedules.router";
import routerFields from "./router/fields.router";
import routerHours from "./router/hours.router";
import routerOptionFields from "./router/option_fields.router";
import routerPayments from "./router/payments.router";
import routerPromotions from "./router/promotions.router";
import routerReviews from "./router/reviews.router";
import routerRoles from "./router/roles.router";
import routerSpacePerHour from "./router/space_per_hour.router";
import ownerRouter from './router/owner.router';
dotenv.config();

const app: Application = express();
const port: number = parseInt(process.env.PORT || "5000", 10);
const allowedOrigins = [
  "http://localhost:3000",
];
// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
//Tuan sua? cai nay`
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Định nghĩa router
app.use("/api/admin/user", routerUser);
app.use("/api/admin/category", routerCategory);
app.use("/api/admin/bankaccount", routerBankAccount);
app.use("/api/admin/booking", routerBooking);
app.use("/api/admin/fieldschedules", routerFieldsSchedules);
app.use('/uploads', express.static('uploads'));
app.use("/api/admin/fields", routerFields);
app.use("/api/admin/hours", routerHours);
app.use("/api/admin/optionfields", routerOptionFields);
app.use("/api/admin/payments", routerPayments);
app.use("/api/admin/promotions", routerPromotions);
app.use("/api/admin/reviews", routerReviews);
app.use("/api/admin/roles", routerRoles);
app.use("/api/admin/spaceperhour", routerSpacePerHour);
app.use('/api/admin/owner', ownerRouter);
app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
  try {
    await prisma.$connect();
    console.log("Database connected");
  } catch (err) {
    console.error("Error connecting to database:", err);
  }
});
