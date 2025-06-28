import { check } from "express-validator";
import { errorValidator } from "../../middlewares/expressValidator";
import { db } from "../../config/db";
import { userSchema as User } from "../../schema";
import { eq } from "drizzle-orm";

export const validatorCreateAddress = [
  check("city").notEmpty().withMessage("city must be required"),
  check("street").notEmpty().withMessage("street must be required"),
  check("userId").custom(async (value, { req }) => {
    const [user] = await db
      .select()
      .from(User)
      .where(eq(User.id, (req as any).user.id));

    if (!user) {
      throw new Error("user not found, please login again");
    }

    return true;
  }),
  check("buildingNumber")
    .optional()
    .isLength({ max: 20 })
    .withMessage("building number must not exceed 20 characters"),
  errorValidator,
];

export const validatorUpdateAddress = [
  check("city")
    .optional()
    .notEmpty()
    .withMessage("city must not be empty if provided"),

  check("street")
    .optional()
    .notEmpty()
    .withMessage("street must not be empty if provided"),

  check("buildingNumber")
    .optional()
    .isLength({ max: 20 })
    .withMessage("building number must not exceed 20 characters"),

  errorValidator,
];
