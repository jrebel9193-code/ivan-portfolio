import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { putObject } from "@/lib/storage";
import type { CategoryId, ImageShape } from "@/lib/portfolio-config";

const validCategories = new Set<CategoryId>(["music", "brand", "portrait", "product"]);
const validShapes = new Set<ImageShape>(["tall", "wide", "square"]);
const validTypes = new Map([["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"]]);

export async function POST(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  try {
    const form = await request.formData();
    const file = form.get("file");
    const category = String(form.get("category") || "") as CategoryId;
    const shape = String(form.get("shape") || "") as ImageShape;
    const alt = String(form.get("alt") || "Фотография").trim().slice(0, 240);
    if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: "Выберите изображение" }, { status: 400 });
    if (file.size > 20 * 1024 * 1024) return NextResponse.json({ error: "Файл больше 20 МБ" }, { status: 400 });
    const ext = validTypes.get(file.type);
    if (!ext || !validCategories.has(category) || !validShapes.has(shape)) return NextResponse.json({ error: "Проверьте формат и поля" }, { status: 400 });
    const id = randomUUID();
    const key = `portfolio/${id}.${ext}`;
    await putObject(key, new Uint8Array(await file.arrayBuffer()), file.type);
    const max = await query<{ value: number }>("SELECT COALESCE(MAX(sort_order), -1) + 1 AS value FROM portfolio_items");
    await query(
      `INSERT INTO portfolio_items (id, category, src, storage_key, alt, shape, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [id, category, `/media/${key}`, key, alt || "Фотография", shape, max.rows[0]?.value ?? 0],
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Не удалось загрузить фотографию" }, { status: 500 });
  }
}
