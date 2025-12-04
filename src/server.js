import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// connect DB
const MONGO_URI = process.env.MONGO_URI;
connectDB(MONGO_URI);

// routes
app.use("/api", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// health
app.get("/", (req, res) => {
  res.send("ShoppyGlobe API is running");
});

// error handlers (should be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
