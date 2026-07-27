import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";

const accountLinks = [
  { label: "Shop All", href: "/shop", description: "Browse the full graphic tee lineup." },
  { label: "Your Cart", href: "/cart", description: "Review what's waiting to check out." },
];

export async function AccountView() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="mt-8 max-w-[30rem] border border-line-strong bg-surface p-8">
        <p className="text-ink-soft">Sign in to view your TeeWorld profile.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="bg-ink px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-bg transition-colors hover:bg-accent hover:text-accent-ink"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="border border-ink px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  const joined = user.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mt-8 max-w-[30rem]">
      <div className="flex items-center gap-4 border border-line-strong bg-surface p-6">
        <div
          aria-hidden="true"
          className="flex h-14 w-14 shrink-0 items-center justify-center bg-accent text-xl font-extrabold uppercase text-accent-ink"
        >
          {user.username.charAt(0)}
        </div>
        <div>
          <p className="text-lg font-semibold">{user.username}</p>
          <p className="text-sm text-ink-faint">Member since {joined}</p>
        </div>
      </div>

      <ul className="mt-5 flex flex-col divide-y divide-line border border-line-strong bg-surface">
        {accountLinks.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-surface-2">
              <span>
                <span className="block text-sm font-semibold">{link.label}</span>
                <span className="block text-sm text-ink-faint">{link.description}</span>
              </span>
              <span aria-hidden="true" className="text-ink-faint">
                &rarr;
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <form action={logoutAction} className="mt-5">
        <button
          type="submit"
          className="text-sm font-semibold text-ink-soft underline-offset-2 hover:text-urgent hover:underline"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
