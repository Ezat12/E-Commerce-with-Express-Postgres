import { db } from "../config/db";
import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { cartsSchema as Carts } from "../schema/cartsSchema";
import { and, eq, sql } from "drizzle-orm";
import { cartItemsSchema as CartItems } from "../schema/cartItemsSchema";
import { productsSchema as Products } from "../schema/productSchema";
import { alias } from "drizzle-orm/pg-core";
import { ApiError } from "../utils/apiError";

export const getTotalCart = async (cart: { id: number }) => {
  const ci = alias(CartItems, "ci");
  const p = alias(Products, "p");

  const total = await db
    .select({
      total: sql<bigint>`COALESCE(SUM(${p.price} * ${ci.quantity}), 0)`,
    })
    .from(ci)
    .leftJoin(p, eq(ci.productId, p.id))
    .where(eq(ci.cartId, cart.id));

  await db
    .update(Carts)
    .set({
      totalPrice: total[0].total.toString(),
    })
    .where(eq(Carts.id, cart.id));
};

export const handleCartToUser = async (cart: { id: number }) => {
  const [cartUserOnly] = await db
    .select()
    .from(Carts)
    .where(eq(Carts.id, cart.id));

  const ci = alias(CartItems, "ci");
  const p = alias(Products, "p");

  const cartItemsUser = await db
    .select({
      id: ci.id,
      productId: ci.productId,
      productName: p.name,
      productDescription: p.description,
      productImages: p.images,
      productPrice: p.price,
      quantity: ci.quantity,
    })
    .from(ci)
    .innerJoin(p, eq(p.id, ci.productId))
    .where(eq(ci.cartId, cart.id));

  return {
    cartId: cartUserOnly.id,
    userId: cartUserOnly.userId,
    items: cartItemsUser.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      productDescription: item.productDescription,
      productImages: item.productImages,
      productPrice: item.productPrice,
      quantity: item.quantity,
    })),
    totalPrice: cartUserOnly.totalPrice,
    createdAt: cartUserOnly.createdAt,
  };
};

export const createCart = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const userId = (req as any).user?.id;
    if (!userId) {
      return next(new ApiError("User ID is required", 401));
    }

    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return next(new ApiError("Product ID and quantity are required", 400));
    }

    let [cart] = await db.select().from(Carts).where(eq(Carts.userId, userId));

    if (!cart) {
      const [newCart] = await db.insert(Carts).values({ userId }).returning();

      const cartItems = await db
        .insert(CartItems)
        .values({ cartId: newCart.id, productId, quantity })
        .returning();

      await getTotalCart({ id: newCart.id });

      const cartToUser = await handleCartToUser({ id: newCart.id });

      return res.status(201).json({ status: "success", data: cartToUser });
    } else {
      const [existingItem] = await db
        .select()
        .from(CartItems)
        .where(
          and(eq(CartItems.cartId, cart.id), eq(CartItems.productId, productId))
        );

      if (existingItem) {
        await db
          .update(CartItems)
          .set({ quantity: existingItem.quantity + quantity })
          .where(eq(CartItems.id, existingItem.id));
      } else {
        await db.insert(CartItems).values({
          cartId: cart.id,
          productId,
          quantity,
        });
      }

      await getTotalCart({ id: cart.id });

      const cartToUser = await handleCartToUser({ id: cart.id });

      return res.status(200).json({ status: "success", data: cartToUser });
    }
  }
);

export const getCartToUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const userId = (req as any).user.id;

    const [cart] = await db
      .select()
      .from(Carts)
      .where(eq(Carts.userId, userId));

    if (!cart) {
      return res.status(200).json({ status: "success", data: [] });
    }

    const cartToUser = await handleCartToUser({ id: cart.id });

    return res.status(200).json({ status: "success", data: cartToUser });
  }
);

export const updateCartItemQuantity = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const itemId = Number(req.params.itemId);
    const { quantity } = req.body;
    const userId = (req as any).user.id;

    if (!quantity || quantity <= 0) {
      return next(new ApiError("Quantity must be greater than zero", 400));
    }

    const [cart] = await db
      .select()
      .from(Carts)
      .where(eq(Carts.userId, userId));

    if (!cart) {
      return next(new ApiError("not fount cart to user", 404));
    }

    const [item] = await db
      .update(CartItems)
      .set({ quantity: quantity })
      .where(and(eq(CartItems.id, itemId), eq(CartItems.cartId, cart.id)))
      .returning();

    if (!item) {
      return next(new ApiError("Item not found in your cart", 404));
    }

    await getTotalCart({ id: cart.id });

    res.status(200).json({
      status: "success",
      message: "Item quantity updated",
      data: item,
    });
  }
);

export const deleteCartItem = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const itemId = Number(req.params.itemId);
    const userId = (req as any).user.id;

    const [cart] = await db
      .select()
      .from(Carts)
      .where(eq(Carts.userId, userId));

    if (!cart) {
      return next(new ApiError("not fount cart to user", 404));
    }

    const [item] = await db
      .delete(CartItems)
      .where(and(eq(CartItems.id, itemId), eq(CartItems.cartId, cart.id)))
      .returning();

    if (!item) {
      return next(new ApiError("Item not found in your cart", 404));
    }

    await getTotalCart({ id: cart.id });

    res.status(200).json({
      status: "success",
      message: "Deleted item successfully",
      data: {
        deletedItem: item,
      },
    });
  }
);

export const clearCart = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;

    const [cart] = await db
      .delete(Carts)
      .where(eq(Carts.userId, userId))
      .returning();

    if (!cart) {
      return next(new ApiError("User doesn't have a cart already", 404));
    }

    res
      .status(200)
      .json({ status: "success", message: "Deleted successfully" });
  }
);
