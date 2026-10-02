import { NextResponse } from "next/server";
import { jsonError, requireApiUser } from "@/lib/api";
import { getStorage } from "@/lib/storage";

export const runtime = "nodejs";

const folders = new Set(["products", "gallery", "content", "settings"]);

export async function POST(request: Request) {
  const auth = await requireApiUser();
  if (auth.error) return auth.error;

  const form = await request.formData();
  const file = form.get("file");
  const folder = String(form.get("folder") ?? "");
  if (!(file instanceof File)) return jsonError("Dosya gerekli.");
  if (!folders.has(folder)) return jsonError("Geçersiz klasör.");
  if (file.size > 8 * 1024 * 1024) return jsonError("Görsel 8 MB'dan küçük olmalı.");

  try {
    const stored = await getStorage().upload(
      {
        buffer: Buffer.from(await file.arrayBuffer()),
        filename: file.name,
        contentType: file.type,
      },
      folder,
    );
    return NextResponse.json(stored);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Yükleme başarısız.");
  }
}
