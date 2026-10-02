import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { jsonError, requireApiUser } from "@/lib/api";
import { createProduct, listAdminProducts, serializeProduct } from "@/lib/data/products";
import { revalidateSite } from "@/lib/revalidate";
import { fieldErrors, productSchema } from "@/lib/validators";

export async function GET(request: Request) {
  const auth = await requireApiUser();
  if (auth.error) return auth.error;
  const { searchParams } = new URL(request.url);
  const products = await listAdminProducts(searchParams.get("q") ?? undefined, searchParams.get("status") ?? undefined);
  return NextResponse.json(products.map(serializeProduct));
}

export async function POST(request: Request) {
  const auth = await requireApiUser();
  if (auth.error) return auth.error;
  const body = await request.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz ürün verisi.", fieldErrors: fieldErrors(parsed.error) }, { status: 400 });
  }
  try {
    const product = await createProduct(parsed.data);
    revalidateSite([`/products/${product.slug}`]);
    return NextResponse.json(serializeProduct(product), { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return jsonError("Bu slug zaten kullanılıyor.", 409);
    }
    throw error;
  }
}
