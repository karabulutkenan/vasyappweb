import { redirect } from "next/navigation";

/** Eski yol — /n8ntest’e yönlendirir. */
export default function LegacyN8nTestRedirectPage() {
  redirect("/n8ntest");
}
