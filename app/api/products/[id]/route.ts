import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { jsonError, requireApiUser } from "@/lib/api";
import { deleteProduct, getProductById, serializeProduct, updateProduct } from "@/lib/data/products";
import { revalidateSite } from "@/lib/revalidate";
import { fieldErrors, productSchema } from "@/lib/validators";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  const auth = await requireApiUser();
  if (auth.error) return auth.error;
  const { id } = await context.params;
  const product = await getProductById(id);
  if (!product) return jsonError("Ürün bulunamadı.", 404);
  return NextResponse.json(serializeProduct(product));
}

export async function PATCH(request: Request, context: Context) {
  const auth = await requireApiUser();
  if (auth.error) return auth.error;
  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz ürün verisi.", fieldErrors: fieldErrors(parsed.error) }, { status: 400 });
  }
  try {
    const product = await updateProduct(id, parsed.data);
    if (!product) return jsonError("Ürün bulunamadı.", 404);
    revalidateSite([`/products/${product.slug}`]);
    return NextResponse.json(serializeProduct(product));
  } catch (error) {
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
  const existing = await getProductById(id);
  const removed = await deleteProduct(id);
  if (!removed) return jsonError("Ürün bulunamadı.", 404);
  revalidateSite(existing ? [`/products/${existing.slug}`] : []);
  return NextResponse.json({ ok: true });
}
