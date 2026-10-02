import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type { StorageProvider, UploadInput } from "@/lib/storage/types";

const CONTENT_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const KEY_PATTERN = /^[a-z0-9-]+\/[a-z0-9-]+\.(jpg|jpeg|png|webp|gif)$/i;

export class LocalStorageProvider implements StorageProvider {
  async upload(file: UploadInput, folder: string): Promise<{ url: string; key: string }> {
    const extension = CONTENT_TYPES[file.contentType];
    if (!extension) {
      throw new Error("Yalnızca JPG, PNG, WEBP veya GIF yüklenebilir.");
    }
    if (!/^[a-z0-9-]+$/.test(folder)) {
      throw new Error("Geçersiz klasör.");
    }

    const key = `${folder}/${randomUUID()}${extension}`;
    const target = this.resolve(key);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, file.buffer);
    return { url: `/uploads/${key}`, key };
  }

  async delete(key: string) {
    if (!key || !KEY_PATTERN.test(key)) return;
    await unlink(this.resolve(key)).catch(() => undefined);
  }

  private resolve(key: string) {
    const root = path.join(process.cwd(), "public", "uploads");
    const target = path.resolve(root, key);
    if (!target.startsWith(root + path.sep)) {
      throw new Error("Geçersiz dosya yolu.");
    }
    return target;
  }
}
