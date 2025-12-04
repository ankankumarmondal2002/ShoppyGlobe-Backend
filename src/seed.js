import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import Product from "./models/Product.js";

dotenv.config();
const seed = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Product.deleteMany({});
    const products = [
      { name: "Black T-Shirt", price: 399, description: "100% cotton", stock: 50 },
      { name: "Wireless Headphones", price: 1999, description: "Bluetooth 5.0", stock: 20 },
      { name: "Sneakers", price: 2499, description: "Comfortable running shoes", stock: 15 }
    ];
    await Product.insertMany(products);
    console.log("Seed done");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
