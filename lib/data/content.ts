import { prisma } from "@/lib/db";
import { contentDefinitions, contentFallbacks, toContentView, type ContentKey, type ContentView } from "@/lib/content";
import type { ContentInput } from "@/lib/validators";
import { removeStoredImage } from "@/lib/storage";

export async function getContentMap() {
  const rows = await prisma.homepageContent.findMany();
  const stored = new Map(rows.map((row) => [row.key, toContentView(row)]));
  const map = {} as Record<ContentKey, ContentView>;
  for (const definition of contentDefinitions) {
    map[definition.key] = stored.get(definition.key) ?? contentFallbacks[definition.key];
  }
  return map;
}

export async function listContent() {
  const map = await getContentMap();
  return contentDefinitions.map((definition) => ({
    ...definition,
    content: map[definition.key],
  }));
}

export async function upsertContent(input: ContentInput) {
  const current = await prisma.homepageContent.findUnique({ where: { key: input.key } });
  if (current?.imageKey && current.imageKey !== input.imageKey) {
    await removeStoredImage(current.imageKey);
  }

  return prisma.homepageContent.upsert({
    where: { key: input.key },
    create: input,
    update: input,
  });
}
