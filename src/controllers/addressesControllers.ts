import { db } from "../config/db";
import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { addressesSchema as Addresses, userSchema as User } from "../schema";
import { and, eq } from "drizzle-orm";
import { ApiError } from "../utils/apiError";

export const createAddress = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const [user] = await db
      .select()
      .from(User)
      .where(eq(User.id, (req as any).user?.id));

    if (!user) {
      return next(new ApiError("Not found user, please login again", 404));
    }

    const [address] = await db
      .insert(Addresses)
      .values({
        userId: user.id,
        city: req.body.city,
        street: req.body.street,
        buildingNumber: req.body.buildingNumber || null,
      })
      .returning();

    res.status(201).json({ status: "success", data: address });
  }
);

// to admin
export const getAllAddresses = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const addresses = await db.select().from(Addresses);

    res.status(200).json({ status: "success", data: addresses });
  }
);

export const getAddressById = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const userId = (req as any).user.id;

    const [address] = await db
      .select()
      .from(Addresses)
      .where(and(eq(Addresses.id, id), eq(Addresses.userId, userId)));

    if (!address) {
      return next(new ApiError("Address not found or not yours", 404));
    }

    res.json({ status: "success", data: address });
  }
);

// to user
export const getMyAddresses = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;

    const addresses = await db
      .select()
      .from(Addresses)
      .where(eq(Addresses.userId, userId));

    res.status(200).json({ status: "success", data: addresses });
  }
);

export const updateAddress = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const userId = (req as any).user.id;

    const [address] = await db
      .update(Addresses)
      .set(req.body)
      .where(and(eq(Addresses.id, id), eq(Addresses.userId, userId)))
      .returning();

    if (!address) {
      return next(new ApiError("not found address or user", 404));
    }

    res.status(200).json({ status: "success", data: address });
  }
);

export const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = Number(req.params.id);
  const userId = (req as any).user!.id;

  const [deleted] = await db
    .delete(Addresses)
    .where(and(eq(Addresses.id, id), eq(Addresses.userId, userId)))
    .returning();

  if (!deleted) {
    return next(new ApiError("Address not found or user", 404));
  }

  res.json({ status: "success", message: "Address deleted successfully" });
};
