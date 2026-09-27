import { NextResponse } from "next/server";
import { adminPassword, sessionToken, validSession, sessionFromRequest } from "@/lib/admin-auth";

export async function GET(req: Request) {
  return NextResponse.json({ ok: validSession(sessionFromRequest(req)) });
}

export async function POST(req: Request) {
  try {
    const { password } = (await req.json()) ?? {};
    if (!adminPassword()) {
      return NextResponse.json(
        { ok: false, error: "ADMIN_PASSWORD not set on server" },
        { status: 503 }
      );
    }
    if (typeof password !== "string" || password !== adminPassword()) {
      return NextResponse.json({ ok: false, error: "Wrong password" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set("xtox_admin", sessionToken(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 12,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("xtox_admin", "", { httpOnly: true, maxAge: 0, path: "/" });
  return res;
}
