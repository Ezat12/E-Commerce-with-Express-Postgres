import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { userSchema as Users } from "./userSchema";

export const wishlistSchema = pgTable("wishlists", {
  id: serial().primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => Users.id, { onDelete: "cascade" }),
  createdAt: timestamp().defaultNow(),
});
