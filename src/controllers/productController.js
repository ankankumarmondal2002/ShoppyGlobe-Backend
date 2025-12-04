import Product from "../models/Product.js";
import { validationResult } from "express-validator";

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// Optional: create product (admin), useful for seeding data
export const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, stock } = req.body;
    const product = await Product.create({ name, price, description, stock });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};
