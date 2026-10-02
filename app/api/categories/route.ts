import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { jsonError, requireApiUser } from "@/lib/api";
import { createCategory, listCategories } from "@/lib/data/categories";
import { revalidateSite } from "@/lib/revalidate";
import { categorySchema, fieldErrors } from "@/lib/validators";

export async function GET() {
  const auth = await requireApiUser();
  if (auth.error) return auth.error;
  return NextResponse.json(await listCategories());
}

export async function POST(request: Request) {
  const auth = await requireApiUser();
  if (auth.error) return auth.error;
  const body = await request.json().catch(() => null);
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz kategori.", fieldErrors: fieldErrors(parsed.error) }, { status: 400 });
  }
  try {
    const category = await createCategory(parsed.data);
    revalidateSite();
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return jsonError("Bu slug zaten kullanılıyor.", 409);
    }
    throw error;
  }
}
