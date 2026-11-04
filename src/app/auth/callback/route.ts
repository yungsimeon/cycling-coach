import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) redirect("/login");
  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error(error);
    redirect("/login");
  }
  redirect("/dashboard");
}
