"use server";

import { companyProfile } from "@/data/company";
import { requireUser } from "@/lib/auth/require-user";
import {
  COMPANY_SINGLETON_KEY,
  CompanyDocument,
  CompanyModel,
} from "@/lib/db/models";
import { connectToDatabase } from "@/lib/db/mongoose";

const DEFAULT_PROFILE = {
  ...companyProfile,
  singletonKey: COMPANY_SINGLETON_KEY,
};

export const getCompanyProfileAction = async (): Promise<CompanyDocument> => {
  try {
    await connectToDatabase();
    await requireUser();

    const data = await CompanyModel.findOne({
      singletonKey: COMPANY_SINGLETON_KEY,
    })
      .lean<CompanyDocument>()
      .exec();

    return data
      ? {
          ...data,
          _id: data._id?.toString(),
        }
      : DEFAULT_PROFILE;
  } catch (error) {
    console.error("Company Profile retrieve failed.", error);
    return DEFAULT_PROFILE;
  }
};
