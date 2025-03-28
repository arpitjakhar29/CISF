import { z } from "zod";

// Since we're moving to MongoDB, we'll define schemas for validation only
// without the PostgreSQL table definitions

// Form validation schema for claim submission
const claimFormSchema = z.object({
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

// User schema
const insertUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(["admin", "officer", "medical-officer"]).default("officer"),
});

// Officer schema
const insertOfficerSchema = z.object({
  userId: z.number(),
  name: z.string().min(3),
  rank: z.string(),
  officerId: z.string(),
  station: z.string(),
  joiningDate: z.string(),
  contactNumber: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  bloodGroup: z.string().optional(),
  isActive: z.boolean().default(true),
});

// Claim schema
const insertClaimSchema = z.object({
  userId: z.number(),
  category: z.enum(["domiciliary", "chronic", "hospitalization"]),
  description: z.string().min(5),
  amount: z.number().positive(),
  billNumber: z.string().optional(),
  billDate: z.string().optional(),
  hospitalName: z.string().optional(),
  doctorName: z.string().optional(),
  patientName: z.string().optional(),
  relationship: z.string().optional(),
  submissionDate: z.string(),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
});

// Entitlement schema
const insertEntitlementSchema = z.object({
  name: z.string(),
  description: z.string(),
  totalAmount: z.number().positive(),
  usedAmount: z.number().nonnegative().default(0),
  fiscalYear: z.string(),
  category: z.enum(["domiciliary", "chronic", "hospitalization"]),
});

// Export all schemas
export {
  claimFormSchema,
  insertUserSchema,
  insertOfficerSchema,
  insertClaimSchema,
  insertEntitlementSchema
};