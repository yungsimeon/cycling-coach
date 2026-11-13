import Link from "next/link";
import UploadRideForm from "./upload-form";
import { page, pageTitle } from "@/components/ui/styles";

export default function UploadRidePage() {
  return (
    <main className={page}>
      <Link href="/rides" className="text-sm text-muted hover:text-fg">
        ← Rides
      </Link>
      <h1 className={`${pageTitle} mt-2 mb-6`}>
        Upload ride
      </h1>
      <UploadRideForm />
    </main>
  );
}
