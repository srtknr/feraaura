export const SESSION_COOKIE = "feraaura_session";

export function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("AUTH_SECRET tanımlı değil veya çok kısa.");
  }
  return new TextEncoder().encode(secret);
}
