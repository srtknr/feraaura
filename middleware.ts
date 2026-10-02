import { jwtVerify } from "jose/jwt/verify";
import { NextResponse, type NextRequest } from "next/server";
import { getAuthSecret, SESSION_COOKIE } from "@/lib/auth/secret";

function safeAdminPath(value: string | null) {
  if (!value || !value.startsWith("/admin") || value.startsWith("//") || value.includes("\\")) {
    return "/admin/dashboard";
  }
  return value;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdmin = pathname.startsWith("/admin");
  const isApi = pathname.startsWith("/api");
  if (!isAdmin && !isApi) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const isLogin = pathname === "/admin/login";

  if (!token) {
    if (isLogin) return NextResponse.next();
    if (isApi) {
      return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  try {
    await jwtVerify(token, getAuthSecret());
    if (isLogin) {
      const url = request.nextUrl.clone();
      url.pathname = safeAdminPath(url.searchParams.get("next"));
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  } catch {
    if (isApi) {
      return NextResponse.json({ error: "Oturum geçersiz." }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    const response = NextResponse.redirect(url);
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
