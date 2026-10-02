import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { jsonError, requireApiUser } from "@/lib/api";
import { deleteGalleryImage, updateGalleryImage } from "@/lib/data/gallery";
import { revalidateSite } from "@/lib/revalidate";
import { z } from "zod";

const updateSchema = z.object({
  alt: z.string().trim().max(180).nullable(),
  caption: z.string().trim().max(180).nullable(),
  displayOrder: z.number().int(),
});

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  const auth = await requireApiUser();
  if (auth.error) return auth.error;
  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return jsonError("Geçersiz görsel.");
  try {
    const image = await updateGalleryImage(id, parsed.data);
    revalidateSite();
    return NextResponse.json(image);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return jsonError("Görsel bulunamadı.", 404);
    }
    throw error;
  }
}

export async function DELETE(_request: Request, context: Context) {
  const auth = await requireApiUser();
  if (auth.error) return auth.error;
  const { id } = await context.params;
  const removed = await deleteGalleryImage(id);
  if (!removed) return jsonError("Görsel bulunamadı.", 404);
  revalidateSite();
  return NextResponse.json({ ok: true });
}
