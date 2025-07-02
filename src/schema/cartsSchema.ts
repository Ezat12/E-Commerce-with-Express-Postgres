import {
  integer,
  numeric,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";
import { userSchema as User } from "./userSchema";

export const cartsSchema = pgTable("carts", {
  id: serial().primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).default(
    "0.00"
  ),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});
