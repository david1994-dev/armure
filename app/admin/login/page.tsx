import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { isAdminAuthenticated } from "@/lib/admin-session";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) redirect("/admin/orders");

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16">
      <h1 className="font-display text-2xl font-extrabold uppercase tracking-[-0.01em]">Admin Sign In</h1>
      <AdminLoginForm />
    </div>
  );
}
