import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE_NAME, isValidAdminToken } from "@/lib/admin-session";

// Central enforcement for /admin/* — a page under app/admin/ that forgets its own
// isAdminAuthenticated() check is still protected here.
export function proxy(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!isValidAdminToken(token)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};
