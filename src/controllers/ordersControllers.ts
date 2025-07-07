import { db } from "../config/db";
import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import {
  cartItemsSchema as CartItems,
  cartsSchema as Carts,
  orderItemsSchema,
  orderSchema as Orders,
  productsSchema as Products,
} from "../schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import { ApiError } from "../utils/apiError";
import { alias } from "drizzle-orm/pg-core";

export const createOrder = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    if (!userId) {
      return next(new ApiError("User ID is required", 401));
    }

    const order = await db.transaction(async (tx) => {
      const [cartUser] = await tx
        .select()
        .from(Carts)
        .where(eq(Carts.userId, userId));

      if (!cartUser) {
        throw new ApiError("No cart found for this user", 404);
      }

      const existingOrder = await tx
        .select()
        .from(Orders)
        .where(and(eq(Orders.userId, userId), eq(Orders.cartId, cartUser.id)));

      if (existingOrder.length > 0) {
        throw new ApiError("This cart already has an order", 400);
      }

      const ci = alias(CartItems, "ci");
      const p = alias(Products, "p");
      const items = await tx
        .select({
          cartItemId: ci.id,
          productId: ci.productId,
          quantity: ci.quantity,
          price: p.price,
          productName: p.name,
        })
        .from(ci)
        .innerJoin(p, eq(ci.productId, p.id))
        .where(eq(ci.cartId, cartUser.id));

      if (!items.length) {
        throw new ApiError("Cart is empty", 400);
      }

      const [newOrder] = await tx
        .insert(Orders)
        .values({
          userId,
          cartId: cartUser.id,
          totalPrice: String(cartUser.totalPrice),
          status:
            req.body?.status &&
            ["pending", "paid", "cancelled"].includes(req.body?.status)
              ? req.body?.status
              : "pending",
        })
        .returning();

      await tx.insert(orderItemsSchema).values(
        items.map((item) => ({
          orderId: newOrder.id,
          productId: item.productId,
          productName: item.productName,
          price: item.price.toString(),
          quantity: item.quantity,
        }))
      );

      await tx.delete(Carts).where(eq(Carts.id, cartUser.id));
      await tx.delete(CartItems).where(eq(CartItems.cartId, cartUser.id));

      return newOrder;
    });

    res.status(201).json({
      status: "success",
      message: "Created order successfully",
      data: {
        orderId: order.id,
        cartId: order.cartId,
        totalPrice: order.totalPrice,
        status: order.status,
      },
    });
  }
);

export const getAllOrdersUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const userId = (req as any).user?.id;

    const orders = await db
      .select()
      .from(Orders)
      .where(eq(Orders.userId, userId))
      .orderBy(sql`${Orders.createdAt} DESC`);
    if (!orders.length) {
      return res.status(200).json({ status: "success", data: [] });
    }

    console.log(orders);

    const orderItems = await db
      .select({
        orderId: orderItemsSchema.orderId,
        productId: orderItemsSchema.productId,
        price: orderItemsSchema.price,
        quantity: orderItemsSchema.quantity,
      })
      .from(orderItemsSchema)
      .where(
        inArray(
          orderItemsSchema.orderId,
          orders.map((o) => o.id)
        )
      );

    const ordersWithItems = orders.map((order) => ({
      orderId: order.id,
      cartId: order.cartId,
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      items: orderItems
        .filter((item) => item.orderId === order.id)
        .map((item) => ({
          productId: item.productId,
          price: item.price,
          quantity: item.quantity,
          itemTotal: Number(item.price) * item.quantity,
        })),
    }));

    res.status(200).json({ status: "success", data: ordersWithItems });
  }
);
