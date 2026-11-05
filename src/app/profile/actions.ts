"use server";

import { profileSchema } from "@/lib/profile/schema";
import { createClient } from "@/lib/supabase/server";
import { refresh } from "next/cache";
import z from "zod";

export type ProfileFormState =
  | {
      fieldErrors?: { ftp?: string[]; max_hr?: string[] };
      message?: string;
      success?: boolean;
    }
  | undefined;

export async function updateProfile(
  prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const result = profileSchema.safeParse({
    ftp: formData.get("ftp"),
    max_hr: formData.get("max_hr"),
  });

  if (!result.success) {
    const fieldErrors = z.flattenError(result.error).fieldErrors;
    return { fieldErrors: fieldErrors, success: false };
  }
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { message: "Please log in again.", success: false };
  const { error } = await supabase
    .from("profiles")
    .update(result.data)
    .eq("id", data.user.id);
  if (error) {
    console.error(error);
    return {
      message: "Couldn't save your profile. Please try again.",
      success: false,
    };
  }
  refresh();
  return {
    message: "Profile saved.",
    success: true,
  };
}
