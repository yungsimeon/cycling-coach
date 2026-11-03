"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signUp(
  prevState: { error: string } | undefined,
  formData: FormData,
) {
  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Invalid email or password" };
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    console.error(error);
    if (error.code === "weak_password") {
      return { error: "Password is too weak" };
    } else if (error.code === "email_address_invalid") {
      return { error: "Invalid email address" };
    } else {
      return { error: "Signup failed" };
    }
  }
  redirect("/dashboard");
}

export async function signIn(
  prevState: { error: string } | undefined,
  formData: FormData,
) {
  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Invalid email or password" };
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    console.error(error);
    if (error.code === "invalid_credentials")
      return { error: "Invalid email or password" };
    return { error: "Something went wrong. Please try again" };
  }
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) console.error(error);
  redirect("/login");
}
