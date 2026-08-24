import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getSiteData } from "@/lib/db";
import AdminClient from "./admin-client";
import "./admin.css";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!await isAdmin()) redirect("/admin/login");
  const data = await getSiteData();
  return <AdminClient initialItems={data.items} initialContacts={data.contacts} initialContent={data.content} />;
}
