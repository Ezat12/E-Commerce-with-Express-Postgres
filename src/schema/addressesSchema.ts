import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { userSchema as User } from "./userSchema";

export const addressesSchema = pgTable("addresses", {
  id: serial().primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  city: varchar({ length: 100 }).notNull(),
  street: text().notNull(),
  buildingNumber: varchar("building_number", { length: 20 }),
});
