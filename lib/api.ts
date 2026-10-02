import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export async function requireApiUser() {
  const session = await getSession();
  if (!session) {
    return { user: null, error: NextResponse.json({ error: "Yetkisiz." }, { status: 401 }) };
  }
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true },
  });
  if (!user) {
    return { user: null, error: NextResponse.json({ error: "Yetkisiz." }, { status: 401 }) };
  }
  return { user, error: null };
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
