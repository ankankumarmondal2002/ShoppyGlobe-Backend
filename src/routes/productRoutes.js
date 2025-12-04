import express from "express";
import { getProducts, getProductById, createProduct } from "../controllers/productController.js";
import { body } from "express-validator";
const router = express.Router();

/**
 * GET /api/products
 */
router.get("/", getProducts);

/**
 * GET /api/products/:id
 */
router.get("/:id", getProductById);

/**
 * POST /api/products
 * optional: create product (for seeding/admin)
 */
router.post(
  "/",
  [
    body("name").notEmpty(),
    body("price").isNumeric(),
    body("stock").isInt({ min: 0 })
  ],
  createProduct
);

export default router;
