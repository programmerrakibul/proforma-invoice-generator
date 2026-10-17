"use server";

import bcrypt from "bcryptjs";
import { z, ZodError } from "zod";

import { connectToDatabase } from "@/lib/db/mongoose";
import { UserModel } from "@/lib/db/models";
import { ActionResult, zodErrorToActionResult } from "@/lib/validations/action-result";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required.").trim(),
  email: z.string().email("Please enter a valid email address.").trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type RegisterInput = z.infer<typeof registerSchema>;

export async function registerUserAction(
  input: RegisterInput,
): Promise<ActionResult<{ userId: string }>> {
  "use server";

  try {
    const validated = registerSchema.parse(input);

    await connectToDatabase();

    const existing = await UserModel.findOne({
      email: validated.email,
    }).lean<{ _id: string }>();

    if (existing) {
      return {
        ok: false,
        message: "An account with this email already exists.",
      };
    }

    const passwordHash = await bcrypt.hash(validated.password, 12);

    const user = await UserModel.create({
      name: validated.name,
      email: validated.email,
      passwordHash,
      role: "member",
      companyProfile: {
        companyName: "",
        address: "",
        corporateOffice: "",
        contactNumber: "",
        email: "",
        logoUrl: "",
      },
    });

    return {
      ok: true,
      data: { userId: String(user._id) },
      message: "Account created successfully.",
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorToActionResult<{ userId: string }>(
        error,
        "Please fix the highlighted fields.",
      );
    }
    return { ok: false, message: "Failed to create account." };
  }
}
