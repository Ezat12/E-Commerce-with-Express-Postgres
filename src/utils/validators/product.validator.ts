import { check } from "express-validator";
import { errorValidator } from "../../middlewares/expressValidator";

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

  check("images")
    .isArray({ min: 1 })
    .withMessage("At least one image is required")
    .isArray({ max: 4 })
    .withMessage("Maximum 5 images allowed"),

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

  errorValidator,
];

export const validatorUpdateProduct = [
  check("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product name cannot be empty")
    .isLength({ min: 2, max: 250 })
    .withMessage("Name must be between 2 to 250 characters"),

  check("description")
    .optional()
    .isString()
    .withMessage("Description must be a text"),

  check("images")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one image is required when providing images")
    .isArray({ max: 4 })
    .withMessage("Maximum 5 images allowed"),

  check("price")
    .optional()
    .notEmpty()
    .withMessage("Price cannot be empty")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number")
    .toFloat(),

  check("quantity")
    .optional()
    .notEmpty()
    .withMessage("Quantity cannot be empty")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer")
    .toInt(),

  errorValidator,
];
