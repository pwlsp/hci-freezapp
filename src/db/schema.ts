import { relations, sql } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";

export const CATEGORIES = ["fruits", "vegetables", "meat", "drinks", "dairy"] as const;
export const UNITS = ["ml", "g", "l", "kg", "pcs"] as const;

export const freezers = t.sqliteTable("freezers", {
    code: t.text("code").notNull().unique().$defaultFn(uuidv4),
    name: t.text("name").notNull(),
});

export const members = t.sqliteTable(
    "members",
    {
        member_id: t.text("member_id").primaryKey().$defaultFn(uuidv4),
        freezer_code: t
            .text("freezer_code")
            .notNull()
            .references(() => freezers.code),

        nickname: t.text("nickname").notNull(),
        isDeleted: t.int("is_deleted", { mode: "boolean" }),
    },
    (table) => [t.unique("uq-constraint-nickname-freezer_code").on(table.member_id, table.freezer_code)]
);

export const products = t.sqliteTable(
    "products",
    {
        id: t.int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
        freezer_code: t
            .text("freezer_code")
            .notNull()
            .references(() => freezers.code),

        name: t.text("name").notNull(),
        expirationDate: t.int("expiration_date", { mode: "timestamp" }),
        category: t.text("category", { enum: CATEGORIES }),
        quantity: t.int("quantity", { mode: "number" }).notNull(),
        unit: t.text("unit", { enum: UNITS }).notNull(),
    },
    (table) => [t.check("ck-check-negative-quantity", sql`${table.quantity} >= 0`)]
);

export const product_owners = t.sqliteTable(
    "product_owners",
    {
        product_id: t
            .int("product_id", { mode: "number" })
            .notNull()
            .references(() => products.id),
        member_id: t
            .text("member_id")
            .notNull()
            .references(() => members.member_id),
    },
    (table) => [t.primaryKey({ columns: [table.product_id, table.member_id] })]
);

export const freezerRelations = relations(freezers, ({ many }) => ({
    members: many(members),
    products: many(products),
}));

export const membersRelations = relations(members, ({ one }) => ({
    freezer: one(freezers, { fields: [members.freezer_code], references: [freezers.code] }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
    freezer: one(freezers, { fields: [products.freezer_code], references: [freezers.code] }),
    owners: many(product_owners),
}));

export const ownerToProducts = relations(product_owners, ({ one }) => ({
    product: one(products, { fields: [product_owners.product_id], references: [products.id] }),
    owner: one(members, { fields: [product_owners.member_id], references: [members.member_id] }),
}));
