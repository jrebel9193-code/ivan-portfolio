import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { saveSetting } from "@/lib/db";
import { defaultContent, type SiteContent } from "@/lib/portfolio-config";

function text(value: unknown, fallback = "") { return typeof value === "string" ? value.trim().slice(0, 1000) : fallback; }

function normalize(body: SiteContent): SiteContent {
  return {
    hero: {
      eyebrow: text(body.hero?.eyebrow, defaultContent.hero.eyebrow),
      titleLine1: text(body.hero?.titleLine1, defaultContent.hero.titleLine1),
      titleLine2: text(body.hero?.titleLine2, defaultContent.hero.titleLine2),
      description: text(body.hero?.description, defaultContent.hero.description),
    },
    approach: text(body.approach, defaultContent.approach),
    portfolioIntro: text(body.portfolioIntro, defaultContent.portfolioIntro),
    categories: defaultContent.categories.map((fallback, index) => ({
      ...fallback,
      title: text(body.categories?.[index]?.title, fallback.title),
      note: text(body.categories?.[index]?.note, fallback.note),
      description: text(body.categories?.[index]?.description, fallback.description),
    })),
    services: defaultContent.services.map((fallback, index) => ({
      ...fallback,
      title: text(body.services?.[index]?.title, fallback.title),
      text: text(body.services?.[index]?.text, fallback.text),
    })),
    about: {
      nameLine1: text(body.about?.nameLine1, defaultContent.about.nameLine1),
      nameLine2: text(body.about?.nameLine2, defaultContent.about.nameLine2),
      lead: text(body.about?.lead, defaultContent.about.lead),
      body: text(body.about?.body, defaultContent.about.body),
    },
    process: defaultContent.process.map((fallback, index) => ({
      ...fallback,
      title: text(body.process?.[index]?.title, fallback.title),
      text: text(body.process?.[index]?.text, fallback.text),
    })),
    contact: {
      titleLine1: text(body.contact?.titleLine1, defaultContent.contact.titleLine1),
      titleLine2: text(body.contact?.titleLine2, defaultContent.contact.titleLine2),
      note: text(body.contact?.note, defaultContent.contact.note),
    },
  };
}

export async function PATCH(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  const content = normalize(await request.json() as SiteContent);
  await saveSetting("content", content);
  return NextResponse.json({ ok: true, content });
}
