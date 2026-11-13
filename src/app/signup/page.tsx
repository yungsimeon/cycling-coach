import SignupForm from "@/app/signup/signup-form";
import Link from "next/link";
import GoogleButton from "@/components/google-button";
import { authPage, card, link, pageTitle } from "@/components/ui/styles";

export default function SignupPage() {
  return (
    <main className={authPage}>
      <h1 className={`${pageTitle} mb-6`}>Create Account</h1>
      <div className={`${card} flex flex-col gap-4`}>
        <SignupForm />
        <Divider />
        <GoogleButton />
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className={link}>
          Log in
        </Link>
      </p>
    </main>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 text-2xs uppercase tracking-wider text-muted">
      <span className="h-px flex-1 bg-line" />
      or
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
