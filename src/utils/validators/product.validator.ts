import { check } from "express-validator";
import { validator } from "../../middlewares/expressValidator";

export const validatorCreateProduct = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2, max: 250 })
    .withMessage("Name must be between 2 to 250 characters"),

  check("description")
    .optional()
    .isString()
    .withMessage("Description must be a text"),

  check("images").notEmpty().withMessage("At least one image is required"),

  check("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number")
    .toFloat(),

  check("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer")
    .toInt(),

  validator,
];
