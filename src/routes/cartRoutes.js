import express from "express";
import { addToCart, updateCartItem, removeCartItem, getCart } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";
import { body } from "express-validator";

const router = express.Router();

/**
 * Protect all cart routes
 */
router.use(protect);

/**
 * POST /api/cart
 * body { productId, quantity }
 */
router.post(
  "/",
  [
    body("productId").notEmpty().withMessage("productId required"),
    body("quantity").isInt({ min: 1 }).withMessage("Quantity at least 1")
  ],
  addToCart
);

/**
 * PUT /api/cart/:productId
 * body { quantity }
 */
router.put(
  "/:productId",
  [ body("quantity").isInt({ min: 1 }).withMessage("Quantity at least 1") ],
  updateCartItem
);

/**
 * DELETE /api/cart/:productId
 */
router.delete("/:productId", removeCartItem);

/**
 * GET /api/cart
 */
router.get("/", getCart);

export default router;
