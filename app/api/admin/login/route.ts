import { NextResponse } from "next/server";
import { ADMIN_COOKIE, createSessionToken, passwordMatches, sessionCookieOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json() as { password?: string };
    if (!password || !passwordMatches(password)) return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, createSessionToken(), sessionCookieOptions());
    return response;
  } catch {
    return NextResponse.json({ error: "Не удалось выполнить вход" }, { status: 500 });
  }
}
