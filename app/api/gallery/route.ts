import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api";
import { createGalleryImage, listGallery } from "@/lib/data/gallery";
import { revalidateSite } from "@/lib/revalidate";
import { fieldErrors, gallerySchema } from "@/lib/validators";

export async function GET() {
  const auth = await requireApiUser();
  if (auth.error) return auth.error;
  return NextResponse.json(await listGallery());
}

export async function POST(request: Request) {
  const auth = await requireApiUser();
  if (auth.error) return auth.error;
  const body = await request.json().catch(() => null);
  const parsed = gallerySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz görsel.", fieldErrors: fieldErrors(parsed.error) }, { status: 400 });
  }
  const image = await createGalleryImage(parsed.data);
  revalidateSite();
  return NextResponse.json(image, { status: 201 });
}
