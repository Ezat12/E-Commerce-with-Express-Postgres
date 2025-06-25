import { body, check, ValidationChain } from "express-validator";
import { errorValidator } from "../../middlewares/expressValidator";
import { db } from "../../config/db";
import { eq } from "drizzle-orm";
import { userSchema as User } from "../../schema";
import { Request, Response, NextFunction } from "express-serve-static-core";

export const validateUserCreation: (
  | ValidationChain
  | ((req: Request, res: Response, next: NextFunction) => void)
)[] = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 200 })
    .withMessage("Name must be less than 200 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail()
    .custom(async (value, { req }) => {
      const [user] = await db.select().from(User).where(eq(User.email, value));
      if (user) {
        throw new Error("email is already exist");
      }
      return true;
    }),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 50 })
    .withMessage("Password must be between 8 and 50 characters"),
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  // )
  // .withMessage(
  //   "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
  // ),

  body("phone")
    .optional()
    .trim()
    .isLength({ max: 15 })
    .withMessage("Phone must be less than 15 characters")
    .matches(/^[0-9+]+$/)
    .withMessage("Phone must contain only numbers and + sign"),

  check("avatar")
    .optional()
    .isString()
    .withMessage("Avatar must be a string")
    .isURL()
    .withMessage("Avatar must be a valid URL"),

  body("role").optional().isIn(["admin", "user"]).withMessage("Invalid role"),

  body("active")
    .optional()
    .isBoolean()
    .withMessage("Active must be a boolean value"),

  errorValidator,
];

export const validateUserUpdate: (
  | ValidationChain
  | ((req: Request, res: Response, next: NextFunction) => void)
)[] = [
  body("name")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Name must be less than 200 characters"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail()
    .custom(async (value, { req }) => {
      const [user] = await db.select().from(User).where(eq(User.email, value));
      if (user) {
        throw new Error("email is already exist");
      }
      return true;
    }),

  body("password")
    .optional()
    .trim()
    .isLength({ min: 8, max: 50 })
    .withMessage("Password must be between 8 and 50 characters"),
  body("phone")
    .optional()
    .trim()
    .isLength({ max: 15 })
    .withMessage("Phone must be less than 15 characters")
    .matches(/^[0-9+]+$/)
    .withMessage("Phone must contain only numbers and + sign"),

  check("avatar")
    .optional()
    .isString()
    .withMessage("Avatar must be a string")
    .isURL()
    .withMessage("Avatar must be a valid URL"),

  body("role").optional().isIn(["admin", "user"]).withMessage("Invalid role"),

  body("active")
    .optional()
    .isBoolean()
    .withMessage("Active must be a boolean value"),
  errorValidator,
];
