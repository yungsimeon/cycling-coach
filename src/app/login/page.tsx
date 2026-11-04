import LoginForm from "@/app/login/login-form";
import Link from "next/link";
import GoogleButton from "@/components/google-button";

export default function LoginPage() {
  return (
    <div>
      <h1>Log In</h1>
      <LoginForm />
      <GoogleButton />

      <p>
        Don&apos;t have an account? <Link href="/signup">Sign Up</Link>
      </p>
    </div>
  );
}
