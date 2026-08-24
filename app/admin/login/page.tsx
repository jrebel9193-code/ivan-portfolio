"use client";

import { FormEvent, useState } from "react";
import "../admin.css";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    const result = await response.json();
    if (!response.ok) { setError(result.error || "Не удалось войти"); setBusy(false); return; }
    window.location.href = "/admin";
  }

  return (
    <main className="admin-shell login-shell">
      <form className="login-card" onSubmit={submit}>
        <p className="admin-kicker">Иван Чернявский · сайт</p>
        <h1>Вход в админку</h1>
        <p>Введите пароль, который будет задан в настройках Timeweb.</p>
        <label>Пароль<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required autoFocus /></label>
        {error && <p className="error">{error}</p>}
        <button className="primary-button" disabled={busy}>{busy ? "Вхожу…" : "Войти"}</button>
        <a className="back-link" href="/">← Вернуться на сайт</a>
      </form>
    </main>
  );
}
