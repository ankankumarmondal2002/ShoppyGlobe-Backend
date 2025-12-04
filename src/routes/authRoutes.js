import express from "express";
import { register, login } from "../controllers/authController.js";
import { body } from "express-validator";

const router = express.Router();

/**
 * POST /api/register
 * body: { name, email, password }
 */
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 chars")
  ],
  register
);

/**
 * POST /api/login
 * body: { email, password }
 */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required")
  ],
  login
);

export default router;
