import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { db } from "../config/db";
import { userSchema as User } from "../schema";
import { ApiError } from "../utils/apiError";
import { eq } from "drizzle-orm";

export const createUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let body = req.body;

    if (req.body.image) {
      body = {
        ...body,
        avatar: req.body.image,
      };
    }

    const [user] = await db.insert(User).values(body).returning();

    res.status(201).json({ status: "success", data: user });
  }
);

export const getAllUsers = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await db.select().from(User);
    res.status(200).json({ status: "success", data: users });
  }
);

export const getUserById = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const [user] = await db
      .select()
      .from(User)
      .where(eq(User.id, Number(id)));

    if (!user) {
      return next(new ApiError("user not found", 404));
    }

    res.status(200).json({ status: "success", data: user });
  }
);

export const updateUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const id = Number(req.params.id);

    const [user] = await db.select().from(User).where(eq(User.id, id));

    if (!user) {
      return next(new ApiError("user not found", 404));
    }

    const userUpdate = await db
      .update(User)
      .set(body)
      .where(eq(User.id, id))
      .returning();

    res.status(200).json({ status: "success", data: userUpdate });
  }
);

export const deleteUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    const [user] = await db.select().from(User).where(eq(User.id, id));

    if (!user) {
      return next(new ApiError("user not found", 404));
    }

    await db.delete(User).where(eq(User.id, id));

    res
      .status(200)
      .json({ status: "success", message: "User Deleted Successfully" });
  }
);
