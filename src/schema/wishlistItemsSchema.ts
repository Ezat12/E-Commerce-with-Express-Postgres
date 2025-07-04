import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { wishlistSchema as Wishlists } from "./wishlistSchema";
import { productsSchema as Products } from "./productSchema";

export const wishlistItemsSchema = pgTable("wishlist_items", {
  id: serial().primaryKey(),
  wishlistId: integer("wishlist_id")
    .notNull()
    .references(() => Wishlists.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => Products.id, { onDelete: "cascade" }),
  createdAt: timestamp().defaultNow(),
});
