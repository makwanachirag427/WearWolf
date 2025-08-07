import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ENVVARS } from "./uitls/envVars";
import { connectDB } from "./config/db";

//routes
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import productRoutes from "./routes/product.route";
import cartRoutes from "./routes/cart.route";
import paymentRoutes from "./routes/payment.route";
import couponRoutes from "./routes/coupon.route";
import analyticsRoutes from "./routes/coupon.route";

const app = express();
const PORT = ENVVARS.PORT || 5000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/analytics", analyticsRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is runing on port http://localhost:${PORT}`);
});
