import SignupForm from "@/app/signup/signup-form";
import Link from "next/link";
import GoogleButton from "@/components/google-button";

export default function SignupPage() {
  return (
    <div>
      <h1>Create Account</h1>
      <SignupForm />
      <GoogleButton />

      <p>
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </div>
  );
}
