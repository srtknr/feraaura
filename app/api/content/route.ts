import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api";
import { getContentMap, upsertContent } from "@/lib/data/content";
import { revalidateSite } from "@/lib/revalidate";
import { contentSchema, fieldErrors } from "@/lib/validators";

export async function GET() {
  const auth = await requireApiUser();
  if (auth.error) return auth.error;
  return NextResponse.json(await getContentMap());
}

export async function PUT(request: Request) {
  const auth = await requireApiUser();
  if (auth.error) return auth.error;
  const body = await request.json().catch(() => null);
  const parsed = contentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz içerik.", fieldErrors: fieldErrors(parsed.error) }, { status: 400 });
  }
  const content = await upsertContent(parsed.data);
  revalidateSite();
  return NextResponse.json(content);
}
