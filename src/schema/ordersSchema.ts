import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";
import { userSchema as Users } from "./userSchema";
import { cartsSchema } from "./cartsSchema";

export const statusOrder = pgEnum("status_order", [
  "pending",
  "paid",
  "cancelled",
]);

export const orderSchema = pgTable("orders", {
  id: serial().primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => Users.id, {
      onDelete: "cascade",
    }),
  cartId: integer("cart_id").references(() => cartsSchema.id, {
    onDelete: "set null",
  }),
  status: statusOrder().default("pending"),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp().defaultNow(),
});
