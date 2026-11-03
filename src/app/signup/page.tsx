import SignupForm from "@/app/signup/signup-form";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div>
      <h1>Create Account</h1>
      <SignupForm />
      <p>Already have an account?</p>

      <Link href="/login">Log in</Link>
    </div>
  );
}
