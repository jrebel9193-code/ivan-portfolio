import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { transaction } from "@/lib/db";

export async function PATCH(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  const { ids } = await request.json() as { ids?: string[] };
  if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) return NextResponse.json({ error: "Некорректный порядок" }, { status: 400 });
  await transaction(async (client) => {
    for (const [index, id] of ids.entries()) await client.query("UPDATE portfolio_items SET sort_order=$1 WHERE id=$2", [index, id]);
  });
  return NextResponse.json({ ok: true });
}
