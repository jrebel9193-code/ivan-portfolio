import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { deleteObject } from "@/lib/storage";
import type { CategoryId, ImageShape } from "@/lib/portfolio-config";

const validCategories = new Set<CategoryId>(["music", "brand", "portrait", "product"]);
const validShapes = new Set<ImageShape>(["tall", "wide", "square"]);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  const { id } = await params;
  const body = await request.json() as { category?: CategoryId; shape?: ImageShape; alt?: string };
  if (!body.category || !body.shape || !validCategories.has(body.category) || !validShapes.has(body.shape)) return NextResponse.json({ error: "Некорректные поля" }, { status: 400 });
  await query("UPDATE portfolio_items SET category=$1, shape=$2, alt=$3 WHERE id=$4", [body.category, body.shape, String(body.alt || "Фотография").slice(0, 240), id]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdmin()) return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  const { id } = await params;
  const found = await query<{ storage_key: string | null }>("SELECT storage_key FROM portfolio_items WHERE id=$1", [id]);
  await query("DELETE FROM portfolio_items WHERE id=$1", [id]);
  const key = found.rows[0]?.storage_key;
  if (key) await deleteObject(key).catch((error) => console.error("S3 delete failed", error));
  return NextResponse.json({ ok: true });
}
