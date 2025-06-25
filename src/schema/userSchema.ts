import {
  boolean,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["admin", "user"]);

export const userSchema = pgTable("users", {
  id: serial().primaryKey(),
  name: varchar({ length: 200 }).notNull(),
  email: varchar().unique().notNull(),
  password: varchar({ length: 50 }).notNull(),
  phone: varchar({ length: 15 }),
  avatar: varchar(),
  active: boolean().default(true),
  role: userRole().default("user"),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
});
