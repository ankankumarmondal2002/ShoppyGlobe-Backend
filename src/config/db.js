// src/config/db.js
import mongoose from "mongoose";

export const connectDB = async (mongoUri) => {
  try {
    // Modern mongoose (v6+/v7+) doesn't need the old options
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
