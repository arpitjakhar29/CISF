import { pgTable, text, serial, integer, timestamp, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("officer"), // admin, officer, medical-officer
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

// Officers Table
export const officers = pgTable("officers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  rank: text("rank").notNull(),
  officerId: text("officer_id").notNull().unique(),
  station: text("station").notNull(),
  joiningDate: text("joining_date").notNull(),
  contactNumber: text("contact_number"),
  email: text("email"),
  address: text("address"),
  dateOfBirth: text("date_of_birth"),
  bloodGroup: text("blood_group"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOfficerSchema = createInsertSchema(officers).pick({
  userId: true,
  name: true,
  rank: true,
  officerId: true,
  station: true,
  joiningDate: true,
  contactNumber: true,
  email: true,
  address: true,
  dateOfBirth: true,
  bloodGroup: true,
  isActive: true,
});

// Claims Table
export const claims = pgTable("claims", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  category: text("category").notNull(), // domiciliary, chronic, hospitalization
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  billNumber: text("bill_number"),
  billDate: text("bill_date"),
  hospitalName: text("hospital_name"),
  doctorName: text("doctor_name"),
  patientName: text("patient_name"),
  relationship: text("relationship"),
  submissionDate: timestamp("submission_date").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  approvedAmount: numeric("approved_amount", { precision: 10, scale: 2 }),
  approvedBy: integer("approved_by"),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  comments: text("comments"),
});

export const insertClaimSchema = createInsertSchema(claims).pick({
  userId: true,
  category: true,
  description: true,
  amount: true,
  billNumber: true,
  billDate: true,
  hospitalName: true,
  doctorName: true,
  patientName: true,
  relationship: true,
  submissionDate: true,
  status: true,
});

// Entitlements Table
export const entitlements = pgTable("entitlements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  usedAmount: numeric("used_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  fiscalYear: text("fiscal_year").notNull(),
  category: text("category").notNull(), // domiciliary, chronic, hospitalization
});

export const insertEntitlementSchema = createInsertSchema(entitlements).pick({
  name: true,
  description: true,
  totalAmount: true,
  usedAmount: true,
  fiscalYear: true,
  category: true,
});

// Form validation schema for claim submission
export const claimFormSchema = z.object({
  category: z.enum(["domiciliary", "chronic", "hospitalization"], {
    required_error: "Please select a category",
  }),
  description: z.string().min(5, {
    message: "Description must be at least 5 characters",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number",
  }),
  billNumber: z.string().optional(),
  billDate: z.string().optional(),
  hospitalName: z.string().optional(),
  doctorName: z.string().optional(),
  patientName: z.string().min(3, {
    message: "Patient name must be at least 3 characters",
  }),
  relationship: z.string().min(1, {
    message: "Please specify the relationship",
  }),
});