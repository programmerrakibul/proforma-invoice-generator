import { z } from "zod";

const optionalUrlSchema = z
  .string("URL must be a string")
  .trim()
  .url("Please enter a valid logo URL")
  .optional()
  .or(z.literal(""))
  .transform((val) => (val === "" ? undefined : val));

export const companyProfileBaseSchema = z.object({
  companyName: z
    .string("Company Name must be a string")
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(120, "Company name is too long"),
  email: z
    .string("Email must be a string")
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address"),
  address: z
    .string("Address must be a string")
    .trim()
    .min(3, "Address is required")
    .max(250, "Address is too long"),
  corporateOffice: z
    .string("Corporate Office Address must be a string")
    .trim()
    .min(3, "Corporate office is required")
    .max(250, "Corporate office is too long"),
  contactNumber: z
    .string("Company Number must be BD Number")
    .trim()
    .min(11, "Contact number is too short")
    .max(11, "Contact number is too long"),
  logoUrl: optionalUrlSchema,
});

export const updateCompanyProfileSchema = companyProfileBaseSchema;

export type UpdateCompanyProfileInput = z.infer<
  typeof updateCompanyProfileSchema
>;
