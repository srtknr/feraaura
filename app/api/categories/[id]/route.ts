import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { jsonError, requireApiUser } from "@/lib/api";
import { deleteCategory, getCategoryById, updateCategory } from "@/lib/data/categories";
import { revalidateSite } from "@/lib/revalidate";
import { categorySchema, fieldErrors } from "@/lib/validators";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  const auth = await requireApiUser();
  if (auth.error) return auth.error;
  const { id } = await context.params;
  const category = await getCategoryById(id);
  if (!category) return jsonError("Kategori bulunamadı.", 404);
  return NextResponse.json(category);
}

export async function PATCH(request: Request, context: Context) {
  const auth = await requireApiUser();
  if (auth.error) return auth.error;
  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz kategori.", fieldErrors: fieldErrors(parsed.error) }, { status: 400 });
  }
  try {
    const category = await updateCategory(id, parsed.data);
    revalidateSite();
    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return jsonError("Kategori bulunamadı.", 404);
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return jsonError("Bu slug zaten kullanılıyor.", 409);
    }
    throw error;
  }
}

export async function DELETE(_request: Request, context: Context) {
  const auth = await requireApiUser();
  if (auth.error) return auth.error;
  const { id } = await context.params;
  try {
    await deleteCategory(id);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return jsonError("Kategori bulunamadı.", 404);
    }
    return jsonError(error instanceof Error ? error.message : "Kategori silinemedi.");
  }
  revalidateSite();
  return NextResponse.json({ ok: true });
}
