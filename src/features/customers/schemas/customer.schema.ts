import z from "zod";

export const createCustomerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required!")
    .min(3, "Name must be at least 3 characters!")
    .max(50, "Name must be 50 characters or fewer!"),

  address: z
    .string()
    .trim()
    .min(1, "Address is required!")
    .min(3, "Address must be at least 3 characters!")
    .max(100, "Address must be 100 characters or fewer!"),

  email: z
    .email("Invalid email address!")
    .transform((value) => value.toLowerCase())
    .transform((value) => value.trim())
    .optional(),

  phone: z
    .string()
    .trim()
    .min(11, "Phone number must be 11 characters!")
    .max(11, "Phone number must be 11 characters!")
    .optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
