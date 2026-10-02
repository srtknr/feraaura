export async function uploadImage(file: File, folder: string) {
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Görsel 8 MB'dan küçük olmalı.");
  }
  const body = new FormData();
  body.set("file", file);
  body.set("folder", folder);
  const response = await fetch("/api/upload", { method: "POST", body });
  const data = (await response.json()) as { url?: string; key?: string; error?: string };
  if (!response.ok || !data.url || !data.key) {
    throw new Error(data.error || "Görsel yüklenemedi.");
  }
  return { url: data.url, key: data.key };
}
