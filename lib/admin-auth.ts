import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "xtox_admin";

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "";
}

export function sessionToken(): string {
  // Deterministic token derived from the password; rotates when the password changes.
  return createHmac("sha256", adminPassword()).update("xtox-admin-session").digest("hex");
}

export function validSession(cookieValue: string | undefined): boolean {
  if (!adminPassword() || !cookieValue) return false;
  const a = Buffer.from(cookieValue);
  const b = Buffer.from(sessionToken());
  return a.length === b.length && timingSafeEqual(a, b);
}

export function sessionFromRequest(req: Request): string | undefined {
  const cookie = req.headers
    .get("cookie")
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(ADMIN_COOKIE + "="));
  return cookie?.split("=")[1];
}
