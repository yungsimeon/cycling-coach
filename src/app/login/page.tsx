import LoginForm from "@/app/login/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div>
      <h1>Log In</h1>
      <LoginForm />
      <p>
        Don&apos;t have an account? <Link href="/signup">Sign Up</Link>
      </p>
    </div>
  );
}
