import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { saveSetting } from "@/lib/db";
import type { ContactSettings } from "@/lib/portfolio-config";

export async function PATCH(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  const body = await request.json() as ContactSettings;
  const contacts = { telegram: String(body.telegram || "").trim(), vk: String(body.vk || "").trim(), phone: String(body.phone || "").trim() };
  await saveSetting("contacts", contacts);
  return NextResponse.json({ ok: true });
}
