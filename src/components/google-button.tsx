import { signInWithGoogle } from "@/app/auth/actions";

export default function GoogleButton() {
  return (
    <form action={signInWithGoogle}>
      <button type="submit">Continue with Google</button>
    </form>
  );
}
