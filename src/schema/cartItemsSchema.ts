import {
  integer,
  numeric,
  pgTable,
  serial,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { cartsSchema as Carts } from "./cartsSchema";
import { productsSchema as Products } from "./productSchema";

export const cartItemsSchema = pgTable(
  "cart_items",
  {
    id: serial().primaryKey(),
    cartId: integer("cart_id")
      .notNull()
      .references(() => Carts.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => Products.id),
    priceProduct: numeric("price_product", {
      precision: 10,
      scale: 2,
    }).notNull(),
    quantity: integer().notNull(),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow(),
  },
  (table) => ({
    uniqueCartProduct: unique().on(table.cartId, table.productId),
  })
);
