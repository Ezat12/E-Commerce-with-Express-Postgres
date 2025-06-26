import { Multer } from "multer";
import { userSchema } from "../schema";
import { InferModel } from "drizzle-orm";

type User = InferModel<typeof userSchema, "select">;

declare global {
  namespace Express {
    interface Request {
      user?: Partial<User>;
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
    }
  }
}
