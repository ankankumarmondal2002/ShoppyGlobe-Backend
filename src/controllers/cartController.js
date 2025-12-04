import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { validationResult } from "express-validator";

/**
 * POST /api/cart
 * body: { productId, quantity }
 * Adds product to user's cart (if exists -> increase qty)
 */
export const addToCart = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const userId = req.user._id;
    const { productId, quantity } = req.body;

    // Check product exists and stock
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.stock < quantity) return res.status(400).json({ message: "Not enough stock" });

    // Get or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    const populated = await cart.populate("items.product");
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/cart/:productId
 * body: { quantity }  -> update quantity of product in cart
 */
export const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { quantity } = req.body;
    const productId = req.params.productId;

    if (!quantity || quantity < 1) return res.status(400).json({ message: "Quantity must be >= 1" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.stock < quantity) return res.status(400).json({ message: "Not enough stock" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(i => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    item.quantity = quantity;
    await cart.save();
    const populated = await cart.populate("items.product");
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/cart/:productId
 * Remove a product from cart
 */
export const removeCartItem = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const initialLen = cart.items.length;
    cart.items = cart.items.filter(i => i.product.toString() !== productId);

    if (cart.items.length === initialLen) return res.status(404).json({ message: "Item not in cart" });

    await cart.save();
    const populated = await cart.populate("items.product");
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/cart
 * Get current user's cart
 */
export const getCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) cart = { user: userId, items: [] };
    res.json(cart);
  } catch (err) {
    next(err);
  }
};
