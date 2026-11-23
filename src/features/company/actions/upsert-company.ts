"use server";

import { requireUser } from "@/lib/auth/require-user";
import {
  COMPANY_SINGLETON_KEY,
  CompanyDocument,
  CompanyModel,
} from "@/lib/db/models";
import { connectToDatabase } from "@/lib/db/mongoose";
import {
  ActionResult,
  zodErrorToActionResult,
} from "@/lib/validations/action-result";
import { revalidateTag } from "next/cache";
import { updateCompanyProfileSchema } from "../validation";

export const upsertCompanyProfileAction = async (
  payload: unknown,
): Promise<ActionResult<CompanyDocument>> => {
  const sanitizedPayload = updateCompanyProfileSchema.safeParse(payload);

  if (!sanitizedPayload.success) {
    return zodErrorToActionResult(
      sanitizedPayload.error,
      "Please fix the highlighted fields.",
    );
  }

  console.log(sanitizedPayload);

  try {
    await connectToDatabase();
    await requireUser();

    const updated = await CompanyModel.findOneAndUpdate(
      { singletonKey: COMPANY_SINGLETON_KEY },
      {
        $set: sanitizedPayload,
        $setOnInsert: { singletonKey: COMPANY_SINGLETON_KEY },
      },
      {
        upsert: true,
        runValidators: true,
        new: true,
      },
    )
      .lean<CompanyDocument>()
      .exec();

    if (!updated) {
      throw new Error("Failed to save company profile");
    }

    revalidateTag("COMPANY_PROFILE", { expire: 60 });

    return {
      data: { ...updated, _id: updated._id?.toString() },
      ok: true,
      message: "Company Profile updated successfully!",
    };
  } catch (error: unknown) {
    console.error("Company Profile update failed.", error);
    return { ok: false, message: "Failed to update company profile." };
  }
};
