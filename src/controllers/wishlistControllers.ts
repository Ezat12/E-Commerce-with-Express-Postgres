import { db } from "../config/db";
import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import {
  productsSchema as Products,
  wishlistItemsSchema as WishlistItems,
  wishlistSchema as Wishlists,
} from "../schema";
import { and, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { ApiError } from "../utils/apiError";

export const addToWishlist = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const userId = (req as any).user.id;
    const productId = req.body.productId;

    if (!productId) {
      return next(new ApiError("Product id must be required", 400));
    }

    const [wishlist] = await db
      .select()
      .from(Wishlists)
      .where(eq(Wishlists.userId, userId));

    if (!wishlist) {
      const [newWishlist] = await db
        .insert(Wishlists)
        .values({ userId })
        .returning();

      const [item] = await db
        .insert(WishlistItems)
        .values({ wishlistId: newWishlist.id, productId })
        .returning();

      res.status(201).json({ status: "success", data: item });
    } else {
      const [item] = await db
        .insert(WishlistItems)
        .values({ wishlistId: wishlist.id, productId })
        .returning();

      res.status(200).json({ status: "success", data: item });
    }
  }
);

export const getWishlistToUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const userId = (req as any).user.id;

    const [wishlistUser] = await db
      .select()
      .from(Wishlists)
      .where(eq(Wishlists.userId, userId));

    if (!wishlistUser) {
      return res.status(200).json({ status: "success", data: {} });
    }

    const wl = alias(Wishlists, "wl");
    const wli = alias(WishlistItems, "wli");
    const p = alias(Products, "p");

    const wishlistItemsUser = await db
      .select()
      .from(wli)
      .innerJoin(p, eq(wli.productId, p.id))
      .where(eq(wli.wishlistId, wishlistUser.id));

    const wishlistFinally = {
      id: wishlistUser.id,
      userId: wishlistUser.userId,
      items: wishlistItemsUser.map((item) => ({
        id: item.wli.id,
        productId: item.p.id,
        productName: item.p.name,
        productDescription: item.p.description,
        productImages: item.p.images,
        productPrice: item.p.price,
      })),
      createdAt: wishlistUser.createdAt,
    };

    res.status(200).json({ status: "success", data: wishlistFinally });
  }
);

export const deleteWishlistItem = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const itemId = Number(req.params.itemId);

    const [wishlistUser] = await db
      .select()
      .from(Wishlists)
      .where(eq(Wishlists.userId, userId));

    if (!wishlistUser) {
      return next(new ApiError("Not found wishlist to user", 404));
    }

    const item = await db
      .delete(WishlistItems)
      .where(
        and(
          eq(WishlistItems.wishlistId, wishlistUser.id),
          eq(WishlistItems.id, itemId)
        )
      )
      .returning();

    res.status(200).json({
      status: "success",
      message: "Deleted item Successfully",
      data: { deletedItem: item },
    });
  }
);

export const clearWishlistUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;

    const [wishlist] = await db
      .delete(Wishlists)
      .where(eq(Wishlists.userId, userId))
      .returning();

    if (!wishlist) {
      return next(new ApiError("User doesn't have a cart already", 404));
    }

    res
      .status(200)
      .json({ status: "success", message: "Deleted successfully" });
  }
);
