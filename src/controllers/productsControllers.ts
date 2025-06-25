import { NextFunction, Request, Response } from "express";
import { db } from "../config/db";
import { products as Products } from "../schema";
import { eq } from "drizzle-orm";
import { ApiError } from "../utils/apiError";
import asyncHandler from "express-async-handler";

export const createProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const files = req.files as Express.Multer.File[];

      if (!req.body.name || !req.body.price || !req.body.quantity) {
        throw new Error("Name, price and quantity are required");
      }

      const [product] = await db
        .insert(Products)
        .values({
          name: req.body.name,
          description: req.body.description || null,
          images: req.body.images || ["/uploads/default-product-image.jpg"],
          price: req.body.price.toString(),
          quantity: Number(req.body.quantity),
        })
        .returning();

      res.status(201).json({
        status: "success",
        data: product,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to create product",
      });
    }
  }
);

export const getAllProducts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await db.select().from(Products);

    res.status(200).json({ status: "success", data: products });
  }
);

export const getProductById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    const product = await db.select().from(Products).where(eq(Products.id, id));

    if (product.length === 0) {
      return next(new ApiError("product not found", 404));
    }

    res.status(200).json({ status: "success", data: product[0] });
  }
);

export const updateProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const body = req.body;

    const product = await db.select().from(Products).where(eq(Products.id, id));

    if (product.length === 0) {
      return next(new ApiError("product not found", 404));
    }

    await db.update(Products).set(body).where(eq(Products.id, id));

    const updatedProduct = await db
      .select()
      .from(Products)
      .where(eq(Products.id, id));

    res.status(200).json({ status: "success", data: updatedProduct });
  }
);

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    const product = await db.select().from(Products).where(eq(Products.id, id));

    if (!product.length) {
      return next(new ApiError("product not found", 404));
    }

    await db.delete(Products).where(eq(Products.id, id));

    res
      .status(200)
      .json({ status: "success", message: "Product Deleted Successfully" });
  }
);
