import { LocalStorageProvider } from "@/lib/storage/local";
import type { StorageProvider } from "@/lib/storage/types";

const localStorageProvider = new LocalStorageProvider();

/**
 * Görseller veritabanına ikili veri olarak yazılmaz.
 * STORAGE_PROVIDER=local geliştirme için public/uploads kullanır.
 * Üretimde Cloudinary, S3 veya Supabase için burada yeni bir
 * StorageProvider eklemek yeterlidir; çağıran kod değişmez.
 */
export function getStorage(): StorageProvider {
  const provider = process.env.STORAGE_PROVIDER ?? "local";
  if (provider === "local") return localStorageProvider;
  throw new Error(
    `STORAGE_PROVIDER "${provider}" tanımlı değil. lib/storage altına bir sağlayıcı ekleyin.`,
  );
}

export async function removeStoredImage(key: string | null | undefined) {
  if (!key) return;
  await getStorage().delete(key);
}
