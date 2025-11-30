import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import "express-async-errors";
import mongoose from "mongoose";

dotenv.config();

import authRouter from "./apps/auth/routes/auth.route.js";
import productRouter from "./apps/products/routes/product.route.js";
import cartRouter from "./apps/cart/routes/cart.route.js";
import orderRouter from "./apps/orders/routes/order.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { setupSwagger } from "./infrastructures/config/swagger.config.js";

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || (process.env.NODE_ENV === "production" ? false : true),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-cart-token"]
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Setup Swagger UI (mounts at /api-docs)
try {
  setupSwagger(app);
} catch (e) {
  console.warn("Swagger setup failed (maybe missing deps):", e && e.message ? e.message : e);
}

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

// health
app.get("/health", (req, res) => res.json({ ok: true }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, { dbName: "clothing_ecom" })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
