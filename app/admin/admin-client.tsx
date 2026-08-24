"use client";

import { FormEvent, useMemo, useState } from "react";
import type { CategoryId, ContactSettings, ImageShape, PortfolioItem, SiteContent } from "@/lib/portfolio-config";

type Props = { initialItems: PortfolioItem[]; initialContacts: ContactSettings; initialContent: SiteContent };
const categoryOptions: Array<[CategoryId, string]> = [["music", "Музыка"], ["brand", "Имидж / каталог"], ["portrait", "Люди"], ["product", "Предметы"]];
const shapeOptions: Array<[ImageShape, string]> = [["tall", "Вертикальная"], ["wide", "Горизонтальная"], ["square", "Квадратная"]];

export default function AdminClient({ initialItems, initialContacts, initialContent }: Props) {
  const [items, setItems] = useState(initialItems);
  const [contacts, setContacts] = useState(initialContacts);
  const [content, setContent] = useState(initialContent);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"portfolio" | "texts" | "contacts">("portfolio");
  const ordered = useMemo(() => [...items].sort((a, b) => a.sortOrder - b.sortOrder), [items]);

  async function request(url: string, init: RequestInit) {
    setBusy(true); setNotice("");
    try {
      const response = await fetch(url, init);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Ошибка сохранения");
      return result;
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Ошибка сохранения");
      throw error;
    } finally { setBusy(false); }
  }

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try { await request("/api/admin/items", { method: "POST", body: new FormData(event.currentTarget) }); setNotice("Фотография добавлена"); window.location.reload(); } catch { /* notice set */ }
  }

  async function updateItem(item: PortfolioItem) {
    try { await request(`/api/admin/items/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) }); setNotice("Изменения сохранены"); } catch { /* notice set */ }
  }

  async function removeItem(id: string) {
    if (!window.confirm("Удалить эту фотографию с сайта?")) return;
    try { await request(`/api/admin/items/${id}`, { method: "DELETE" }); setItems((current) => current.filter((item) => item.id !== id)); setNotice("Фотография удалена"); } catch { /* notice set */ }
  }

  async function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= ordered.length) return;
    const next = [...ordered]; [next[index], next[target]] = [next[target], next[index]];
    setItems(next.map((item, sortOrder) => ({ ...item, sortOrder })));
    try { await request("/api/admin/items/reorder", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: next.map((item) => item.id) }) }); setNotice("Порядок сохранён"); } catch { window.location.reload(); }
  }

  async function saveContacts(event: FormEvent) {
    event.preventDefault();
    try { await request("/api/admin/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(contacts) }); setNotice("Контакты сохранены"); } catch { /* notice set */ }
  }

  async function saveContent(event: FormEvent) {
    event.preventDefault();
    try {
      const result = await request("/api/admin/content", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
      setContent(result.content); setNotice("Тексты сайта сохранены");
    } catch { /* notice set */ }
  }

  function updateCategory(index: number, field: "title" | "note" | "description", value: string) {
    setContent((current) => ({ ...current, categories: current.categories.map((item, i) => i === index ? { ...item, [field]: value } : item) }));
  }
  function updateService(index: number, field: "title" | "text", value: string) {
    setContent((current) => ({ ...current, services: current.services.map((item, i) => i === index ? { ...item, [field]: value } : item) }));
  }
  function updateProcess(index: number, field: "title" | "text", value: string) {
    setContent((current) => ({ ...current, process: current.process.map((item, i) => i === index ? { ...item, [field]: value } : item) }));
  }
  async function logout() { await fetch("/api/admin/logout", { method: "POST" }); window.location.href = "/admin/login"; }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div><p className="admin-kicker">Иван Чернявский · сайт</p><h1>Управление сайтом</h1></div>
        <div className="header-actions"><a href="/" target="_blank">Открыть сайт ↗</a><button onClick={logout}>Выйти</button></div>
      </header>
      <nav className="admin-tabs" aria-label="Разделы админки">
        <button className={tab === "portfolio" ? "active" : ""} onClick={() => setTab("portfolio")}>Портфолио</button>
        <button className={tab === "texts" ? "active" : ""} onClick={() => setTab("texts")}>Тексты сайта</button>
        <button className={tab === "contacts" ? "active" : ""} onClick={() => setTab("contacts")}>Контакты</button>
      </nav>
      {notice && <div className={`notice ${notice.includes("Ошибка") || notice.includes("удалось") ? "bad" : ""}`}>{notice}</div>}

      {tab === "portfolio" && <section className="admin-section">
        <div className="section-heading"><div><p className="admin-kicker">Изображения</p><h2>Портфолио</h2></div><p>Добавляйте, подписывайте и меняйте порядок фотографий.</p></div>
        <form className="upload-form" onSubmit={upload}>
          <label>Файл<input name="file" type="file" accept="image/jpeg,image/png,image/webp" required /></label>
          <label>Раздел<select name="category" defaultValue="portrait">{categoryOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label>Формат<select name="shape" defaultValue="tall">{shapeOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label>Описание<input name="alt" placeholder="Что изображено на фото" /></label>
          <button className="primary-button" disabled={busy}>Добавить фотографию</button>
        </form>
        <div className="item-grid">
          {ordered.map((item, index) => <article className="item-card" key={item.id}>
            <img src={item.src} alt={item.alt} />
            <div className="item-fields">
              <select value={item.category} onChange={(event) => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, category: event.target.value as CategoryId } : entry))}>{categoryOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
              <select value={item.shape} onChange={(event) => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, shape: event.target.value as ImageShape } : entry))}>{shapeOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
              <input value={item.alt} onChange={(event) => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, alt: event.target.value } : entry))} />
            </div>
            <div className="item-actions"><button title="Выше" onClick={() => move(index, -1)} disabled={index === 0 || busy}>↑</button><button title="Ниже" onClick={() => move(index, 1)} disabled={index === ordered.length - 1 || busy}>↓</button><button onClick={() => updateItem(item)} disabled={busy}>Сохранить</button><button className="danger" onClick={() => removeItem(item.id)} disabled={busy}>Удалить</button></div>
          </article>)}
        </div>
      </section>}

      {tab === "texts" && <form className="admin-section text-form" onSubmit={saveContent}>
        <div className="section-heading"><div><p className="admin-kicker">Редактор</p><h2>Тексты сайта</h2></div><p>Здесь можно менять надписи без обращения к разработчику.</p></div>
        <fieldset><legend>Первый экран</legend><div className="field-row"><label>Строка над заголовком<input value={content.hero.eyebrow} onChange={(e) => setContent({ ...content, hero: { ...content.hero, eyebrow: e.target.value } })} /></label><label>Первая строка заголовка<input value={content.hero.titleLine1} onChange={(e) => setContent({ ...content, hero: { ...content.hero, titleLine1: e.target.value } })} /></label><label>Вторая строка заголовка<input value={content.hero.titleLine2} onChange={(e) => setContent({ ...content, hero: { ...content.hero, titleLine2: e.target.value } })} /></label></div><label>Описание<textarea value={content.hero.description} onChange={(e) => setContent({ ...content, hero: { ...content.hero, description: e.target.value } })} /></label></fieldset>
        <fieldset><legend>Подход</legend><label>Текст блока «ПОДХОД»<textarea rows={4} value={content.approach} onChange={(e) => setContent({ ...content, approach: e.target.value })} /></label></fieldset>
        <fieldset><legend>Портфолио</legend><label>Вводный текст<textarea value={content.portfolioIntro} onChange={(e) => setContent({ ...content, portfolioIntro: e.target.value })} /></label>{content.categories.map((category, index) => <div className="repeat-block" key={category.id}><strong>{category.index}</strong><label>Название<input value={category.title} onChange={(e) => updateCategory(index, "title", e.target.value)} /></label><label>Подпись<input value={category.note} onChange={(e) => updateCategory(index, "note", e.target.value)} /></label><label>Описание<textarea value={category.description} onChange={(e) => updateCategory(index, "description", e.target.value)} /></label></div>)}</fieldset>
        <fieldset><legend>Направления съёмки</legend>{content.services.map((service, index) => <div className="repeat-block" key={service.number}><strong>{service.number}</strong><label>Название<input value={service.title} onChange={(e) => updateService(index, "title", e.target.value)} /></label><label>Описание<textarea value={service.text} onChange={(e) => updateService(index, "text", e.target.value)} /></label></div>)}</fieldset>
        <fieldset><legend>Об авторе</legend><div className="field-row"><label>Имя<input value={content.about.nameLine1} onChange={(e) => setContent({ ...content, about: { ...content.about, nameLine1: e.target.value } })} /></label><label>Фамилия<input value={content.about.nameLine2} onChange={(e) => setContent({ ...content, about: { ...content.about, nameLine2: e.target.value } })} /></label></div><label>Первый абзац<textarea value={content.about.lead} onChange={(e) => setContent({ ...content, about: { ...content.about, lead: e.target.value } })} /></label><label>Второй абзац<textarea value={content.about.body} onChange={(e) => setContent({ ...content, about: { ...content.about, body: e.target.value } })} /></label></fieldset>
        <fieldset><legend>Как работаем</legend>{content.process.map((step, index) => <div className="repeat-block" key={step.number}><strong>{step.number}</strong><label>Название<input value={step.title} onChange={(e) => updateProcess(index, "title", e.target.value)} /></label><label>Описание<textarea value={step.text} onChange={(e) => updateProcess(index, "text", e.target.value)} /></label></div>)}</fieldset>
        <fieldset><legend>Финальный блок</legend><div className="field-row"><label>Первая строка<input value={content.contact.titleLine1} onChange={(e) => setContent({ ...content, contact: { ...content.contact, titleLine1: e.target.value } })} /></label><label>Вторая строка<input value={content.contact.titleLine2} onChange={(e) => setContent({ ...content, contact: { ...content.contact, titleLine2: e.target.value } })} /></label></div><label>Пояснение<textarea value={content.contact.note} onChange={(e) => setContent({ ...content, contact: { ...content.contact, note: e.target.value } })} /></label></fieldset>
        <button className="primary-button sticky-save" disabled={busy}>{busy ? "Сохраняю…" : "Сохранить все тексты"}</button>
      </form>}

      {tab === "contacts" && <form className="admin-section contact-form" onSubmit={saveContacts}>
        <div className="section-heading"><div><p className="admin-kicker">Связь</p><h2>Контакты</h2></div><p>Ссылки и телефон в нижнем блоке сайта.</p></div>
        <label>Telegram<input type="url" value={contacts.telegram} onChange={(e) => setContacts({ ...contacts, telegram: e.target.value })} /></label>
        <label>VK<input type="url" value={contacts.vk} onChange={(e) => setContacts({ ...contacts, vk: e.target.value })} /></label>
        <label>Телефон<input value={contacts.phone} onChange={(e) => setContacts({ ...contacts, phone: e.target.value })} /></label>
        <button className="primary-button" disabled={busy}>Сохранить контакты</button>
      </form>}
    </main>
  );
}
