import { Pool, type PoolClient, type QueryResultRow } from "pg";
import { defaultContacts, defaultContent, defaultPortfolioItems, type ContactSettings, type PortfolioItem, type SiteContent } from "./portfolio-config";

declare global {
  var ivanPortfolioPool: Pool | undefined;
  var ivanPortfolioSchemaPromise: Promise<void> | undefined;
}

function pool() {
  if (!global.ivanPortfolioPool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL is not configured");
    global.ivanPortfolioPool = new Pool({
      connectionString,
      ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false },
      max: 8,
    });
  }
  return global.ivanPortfolioPool;
}

async function ensureSchema() {
  if (!global.ivanPortfolioSchemaPromise) {
    global.ivanPortfolioSchemaPromise = (async () => {
      const client = await pool().connect();
      try {
        await client.query("BEGIN");
        await client.query(`
          CREATE TABLE IF NOT EXISTS portfolio_items (
            id TEXT PRIMARY KEY,
            category TEXT NOT NULL,
            src TEXT NOT NULL,
            storage_key TEXT,
            alt TEXT NOT NULL,
            shape TEXT NOT NULL,
            sort_order INTEGER NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );
          CREATE TABLE IF NOT EXISTS site_settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
          );
        `);
        const count = await client.query<{ count: string }>("SELECT COUNT(*)::text AS count FROM portfolio_items");
        if (count.rows[0]?.count === "0") {
          for (const item of defaultPortfolioItems) {
            await client.query(
              `INSERT INTO portfolio_items (id, category, src, storage_key, alt, shape, sort_order, created_at)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (id) DO NOTHING`,
              [item.id, item.category, item.src, item.storageKey, item.alt, item.shape, item.sortOrder, item.createdAt],
            );
          }
        }
        await client.query(
          `INSERT INTO site_settings (key, value) VALUES ('contacts', $1), ('content', $2)
           ON CONFLICT (key) DO NOTHING`,
          [JSON.stringify(defaultContacts), JSON.stringify(defaultContent)],
        );
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        global.ivanPortfolioSchemaPromise = undefined;
        throw error;
      } finally {
        client.release();
      }
    })();
  }
  return global.ivanPortfolioSchemaPromise;
}

export async function query<T extends QueryResultRow>(text: string, values: unknown[] = []) {
  await ensureSchema();
  return pool().query<T>(text, values);
}

export async function transaction<T>(work: (client: PoolClient) => Promise<T>) {
  await ensureSchema();
  const client = await pool().connect();
  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

type ItemRow = {
  id: string; category: PortfolioItem["category"]; src: string; storage_key: string | null;
  alt: string; shape: PortfolioItem["shape"]; sort_order: number; created_at: Date;
};

function mapItem(row: ItemRow): PortfolioItem {
  return { id: row.id, category: row.category, src: row.src, storageKey: row.storage_key, alt: row.alt, shape: row.shape, sortOrder: row.sort_order, createdAt: row.created_at.toISOString() };
}

export async function getSiteData() {
  const [itemsResult, settingsResult] = await Promise.all([
    query<ItemRow>("SELECT * FROM portfolio_items ORDER BY sort_order, created_at"),
    query<{ key: string; value: string }>("SELECT key, value FROM site_settings WHERE key IN ('contacts','content')"),
  ]);
  const settings = Object.fromEntries(settingsResult.rows.map((row) => [row.key, row.value]));
  return {
    items: itemsResult.rows.map(mapItem),
    contacts: settings.contacts ? JSON.parse(settings.contacts) as ContactSettings : defaultContacts,
    content: settings.content ? JSON.parse(settings.content) as SiteContent : defaultContent,
  };
}

export async function saveSetting(key: "contacts" | "content", value: ContactSettings | SiteContent) {
  await query(
    "INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
    [key, JSON.stringify(value)],
  );
}
