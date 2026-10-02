import { revalidatePath } from "next/cache";

export function revalidateSite(paths: string[] = []) {
  revalidatePath("/", "layout");
  revalidatePath("/products");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/sitemap.xml");
  for (const path of paths) revalidatePath(path);
}
