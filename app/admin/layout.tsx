import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { logoutAdminAction } from "@/lib/actions/admin-auth";
import { isAdminAuthenticated } from "@/lib/admin-session";

export const metadata: Metadata = {
  title: "TeeWorld Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const authenticated = await isAdminAuthenticated();

  return (
    <div className="min-h-screen bg-surface-2">
      <header className="flex items-center justify-between border-b border-line-strong bg-ink px-6 py-4">
        <Link href="/admin/orders" className="font-display text-sm font-extrabold uppercase tracking-[0.08em] text-bg">
          TeeWorld Admin
        </Link>
        {authenticated ? (
          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="font-mono text-xs uppercase tracking-[0.06em] text-bg/70 transition-colors hover:text-bg"
            >
              Log out
            </button>
          </form>
        ) : null}
      </header>
      {children}
    </div>
  );
}
