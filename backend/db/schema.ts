import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  boolean,
  json,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

//**--------------------------------------------------------------------------------------**//
//**--------------------------------- User related stuff  --------------------------------**//
//**--------------------------------------------------------------------------------------**//

//** Session table for lucia auth */
export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  verified2Fa: boolean("verified_2fa").notNull().default(false),
});

//** User account table */
export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  name: text("name").notNull(),
  phoneNum: text("phone_num"),
  displayPic: text("display_pic"),
  region: text("region").notNull(),
  campaign: text("campaign"),
  referred_by: text("referred_by"),
  emailVerified: boolean("email_verified").notNull().default(false), //! Change this to 'false'
  registered2FA: boolean("registered_2fa").notNull().default(false), //! Change this to 'false'
  created_at: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  updated_at: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

//** Varification code table */
export const verificationTable = pgTable("email_verification", {
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  code: text("code").primaryKey(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  type: text("type", {
    enum: ["account-activation", "password-reset"],
  }).notNull().default("account-activation"),
});

//**--------------------------------------------------------------------------------------**//
//**--------------------------------------------------------------------------------------**//

//**--------------------------------------------------------------------------------------**//
//**------------------------------- Money related stuff  ---------------------------------**//
//**--------------------------------------------------------------------------------------**//

//** User credit table */
export const userCreditTable = pgTable("user_credits", {
  userId: text("user_id")
    .primaryKey()
    .references(() => userTable.id, { onDelete: "cascade" }),
  creditAmount: integer("credit_amount").notNull().default(1000),
  updated_at: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

//** User credit table */
export const paymentTable = pgTable("payment", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => userTable.id, { onDelete: "no action" })
    .notNull(),
  pgRefId: text("pg_ref_num"),
  currency: text("currency", { enum: ["inr"] }).notNull(),
  amount: integer("amount").notNull(),
  status: text("status", {
    enum: ["success", "failed", "pending"],
  }).notNull(),
  type: text("type", {
    enum: ["credit", "refund", "debit"],
  }).notNull(),
  method: text("method"),
  webhookJson: json<any>("webhook_json"),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const creditTransactionTable = pgTable("credit_transactions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => userTable.id, { onDelete: "no action" })
    .notNull(),
  paymentReferenceId: text("payment_reference_id")
    .references(() => paymentTable.id)
    .unique(),
  operationReferenceId: text("operation_reference_id").references(
    () => operationsTable.id
  ),
  uploadReferenceId: text("upload_reference_id").references(
    () => userFileTable.id
  ),
  creditAmount: integer("credit_amount").notNull(),
  time: timestamp("time", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  category: text("category", {
    enum: [
      "extend_saved_time",
      "transcode",
      "subtitle",
      "download",
      "conversion",
      "refund",
      "credits_purchase",
    ],
  }).notNull(),
  operationType: text("operation_type", {
    enum: ["credit", "debit"],
  }).notNull(),
});

//**--------------------------------------------------------------------------------------**//
//**--------------------------------------------------------------------------------------**//

//**--------------------------------------------------------------------------------------**//
//**----------------------------- Operations related stuff  ------------------------------**//
//**--------------------------------------------------------------------------------------**//

//** User uploaded raw video table */
export const userFileTable = pgTable("uploads", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => userTable.id, { onDelete: "no action" })
    .notNull(),
  fileName: text("file_name"),
  s3Key: text("s3_key").notNull(),
  saveTill: timestamp("save_till", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  status: text("status", {
    enum: ["not-uploaded", "uploaded", "deleted", "error"],
  })
    .notNull()
    .default("not-uploaded"),
  size: integer("size").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const operationsTypeEnum = pgEnum("operation_types", [
  "transcode",
  "subtitle",
  "conversion",
]);

//** Operations table */
export const operationsTable = pgTable("operations", {
  id: text("id").primaryKey(),
  uploadTableId: text("upload_table_id").notNull(),
  userId: text("user_id").notNull(),
  type: operationsTypeEnum().notNull(),
  s3_key: text("s3_key").notNull(),
  size: integer("size").default(0),
  status: text("status", { enum: ["complete", "in-progress", "failed"] }),
  saveTill: timestamp("save_till", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

//**--------------------------------------------------------------------------------------**//
//**--------------------------------------------------------------------------------------**//

//**--------------------------------------------------------------------------------------**//
//**---------------------------------- Types of them all  --------------------------------**//
//**--------------------------------------------------------------------------------------**//

export type SelectSession = typeof sessionTable.$inferSelect;
export type InsertSession = typeof sessionTable.$inferInsert;

export type SelectUser = typeof userTable.$inferSelect;
export type InsertUser = typeof userTable.$inferInsert;

export type SelectCredit = typeof userCreditTable.$inferSelect;
export type InsertCredit = typeof userCreditTable.$inferInsert;

export type SelectPGTransactions = typeof paymentTable.$inferSelect;
export type InsertPGTransactions = typeof paymentTable.$inferInsert;

export type SelectUpload = typeof userFileTable.$inferSelect;
export type InsertUpload = typeof userFileTable.$inferInsert;

export type SelectCreditsHistory = typeof creditTransactionTable.$inferSelect;
export type InsertCreditHistory = typeof creditTransactionTable.$inferInsert;

export type SelectOperations = typeof operationsTable.$inferSelect;
export type InsertOperations = typeof operationsTable.$inferInsert;

//**--------------------------------------------------------------------------------------**//
//**--------------------------------------------------------------------------------------**//

//**--------------------------------------------------------------------------------------**//
//**------------------------------------ Zod Schemas  ------------------------------------**//
//**--------------------------------------------------------------------------------------**//

export const SelectCreditHistoryZodSchema = createSelectSchema(
  creditTransactionTable
);
export const SelectSUserZodSchema = createSelectSchema(userTable);

export const SelectUploadZodSchema = createSelectSchema(userFileTable);

export const SelectOperationsZodSchema = createSelectSchema(operationsTable);

export const SelectUserZodSchema = createSelectSchema(userTable).omit({
  password_hash: true,
});

export type TUserZodSchema = z.infer<typeof SelectUserZodSchema>;

export const SelectPaymentZodSchema = createSelectSchema(paymentTable).omit({
  webhookJson: true,
});
