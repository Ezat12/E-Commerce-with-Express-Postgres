import { integer, numeric, pgTable, serial } from "drizzle-orm/pg-core";
import { orderSchema as Orders } from "./ordersSchema";
import { productsSchema as Products } from "./productSchema";

export const orderItemsSchema = pgTable("order_items", {
  id: serial().primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => Orders.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => Products.id),
  quantity: integer("quantity").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
});
