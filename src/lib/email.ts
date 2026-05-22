import { Resend } from "resend";

/**
 * Helper email transactional con Resend.
 *
 * Env vars:
 *   RESEND_API_KEY     — key dalla dashboard Resend (https://resend.com)
 *   RESEND_FROM_EMAIL  — mittente verificato (es. "RetroStation <negozio@retrostation00s.it>")
 *                        Richiede verifica DNS del dominio su Resend.
 *   RESEND_REPLY_TO    — indirizzo a cui arrivano le risposte dei clienti
 *                        (es. "retrostation@gmail.com"). Opzionale.
 *
 * Se la key non e' configurata, le funzioni ritornano `null` senza
 * lanciare errori: il flusso ordine continua e l'email viene saltata
 * (utile in dev e fallback se Resend e' down).
 */

let cached: Resend | null = null;
function getClient(): Resend | null {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  cached = new Resend(key);
  return cached;
}

const DEFAULT_FROM = "RetroStation <negozio@retrostation00s.it>";
const DEFAULT_REPLY_TO = "retrostation00s@gmail.com";
const DEFAULT_ADMIN_NOTIFICATION = "retrostation00s@gmail.com";

export interface OrderEmailData {
  numero_ordine: string;
  cliente_nome: string;
  cliente_email: string;
  prodotti: Array<{ nome: string; prezzo: number; quantita?: number }>;
  totale: number;
  indirizzo: string;
  citta: string;
  cap: string;
  stato: string; // "Pagato" | "In lavorazione" | ...
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const client = getClient();
  if (!client) {
    console.warn("[email] RESEND_API_KEY non configurata: email saltata");
    return null;
  }

  const from = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;
  const fmt = (n: number) => `€${n.toFixed(2)}`;
  const paymentLine =
    data.stato === "Pagato"
      ? "✅ Pagamento ricevuto. Stiamo preparando la spedizione."
      : "🕓 Ti contatteremo a breve per gli estremi di pagamento (bonifico) o per concordare la consegna in contanti.";

  const itemsHtml = data.prodotti
    .map(
      (p) => `
        <tr>
          <td style="padding:8px 0;color:#1e293b;">${escapeHtml(p.nome)}</td>
          <td style="padding:8px 0;color:#1e293b;text-align:right;">${fmt(
            Number(p.prezzo)
          )}</td>
        </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="it">
<body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#0a0a1a;color:#e2e8f0;margin:0;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#12122a;border:1px solid #1e1e3a;border-radius:16px;padding:32px;">
    <h1 style="font-family:Orbitron,sans-serif;letter-spacing:.1em;margin:0 0 4px;">
      <span style="color:#00d4ff;">RETRO</span><span style="color:#8b5cf6;">STATION</span>
    </h1>
    <p style="color:#94a3b8;margin:0 0 24px;font-size:13px;letter-spacing:.2em;">00&rsquo;s</p>

    <h2 style="color:#e2e8f0;font-size:20px;margin:0 0 8px;">Grazie ${escapeHtml(
      data.cliente_nome
    )}!</h2>
    <p style="color:#94a3b8;margin:0 0 16px;">Abbiamo ricevuto il tuo ordine <strong style="color:#00d4ff;">${escapeHtml(
      data.numero_ordine
    )}</strong>.</p>

    <p style="color:#e2e8f0;background:#0a0a1a;border-left:3px solid #00d4ff;padding:12px 16px;border-radius:8px;margin:0 0 24px;">
      ${paymentLine}
    </p>

    <h3 style="color:#8b5cf6;font-size:14px;letter-spacing:.15em;text-transform:uppercase;margin:0 0 12px;">Prodotti</h3>
    <table style="width:100%;border-collapse:collapse;margin:0 0 24px;">
      ${itemsHtml}
      <tr><td colspan="2" style="border-top:1px solid #1e1e3a;"></td></tr>
      <tr>
        <td style="padding:8px 0;color:#e2e8f0;font-weight:bold;">Totale</td>
        <td style="padding:8px 0;color:#00d4ff;font-weight:bold;text-align:right;">${fmt(
          data.totale
        )}</td>
      </tr>
    </table>

    <h3 style="color:#8b5cf6;font-size:14px;letter-spacing:.15em;text-transform:uppercase;margin:0 0 12px;">Spedizione</h3>
    <p style="color:#94a3b8;margin:0 0 24px;line-height:1.6;">
      ${escapeHtml(data.cliente_nome)}<br>
      ${escapeHtml(data.indirizzo)}<br>
      ${escapeHtml(data.cap)} ${escapeHtml(data.citta)}
    </p>

    <p style="color:#94a3b8;font-size:13px;margin:24px 0 0;border-top:1px solid #1e1e3a;padding-top:16px;">
      Per qualsiasi domanda scrivici su Instagram
      <a href="https://www.instagram.com/retrostation00s/" style="color:#8b5cf6;">@retrostation00s</a>.<br>
      RetroStation &mdash; P.IVA 04273720138
    </p>
  </div>
</body>
</html>`;

  try {
    const replyTo = process.env.RESEND_REPLY_TO || DEFAULT_REPLY_TO;
    const res = await client.emails.send({
      from,
      to: data.cliente_email,
      replyTo,
      subject: `Ordine ${data.numero_ordine} confermato — RetroStation`,
      html,
    });
    return res;
  } catch (err) {
    console.error("[email] send error:", err);
    return null;
  }
}

/**
 * Notifica admin: ad ogni ordine arriva una mail al gestore con i dati
 * completi del cliente, prodotti, totale e metodo di pagamento.
 * Mittente identico (negozio@), destinatario RESEND_ADMIN_EMAIL.
 */
export interface AdminOrderNotificationData extends OrderEmailData {
  telefono?: string;
  metodo_pagamento?: string; // es. "PayPal" | "Bonifico / contanti alla consegna"
}

export async function sendOrderAdminNotification(data: AdminOrderNotificationData) {
  const client = getClient();
  if (!client) {
    console.warn("[email] RESEND_API_KEY non configurata: notifica admin saltata");
    return null;
  }

  const from = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;
  const adminTo = process.env.RESEND_ADMIN_EMAIL || DEFAULT_ADMIN_NOTIFICATION;
  const fmt = (n: number) => `€${n.toFixed(2)}`;

  const rows = data.prodotti
    .map(
      (p) => `
        <tr>
          <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;color:#0f172a;">${escapeHtml(p.nome)}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;color:#0f172a;text-align:right;">${fmt(Number(p.prezzo))}</td>
        </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="it">
<body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#f8fafc;color:#0f172a;margin:0;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:24px;">
    <p style="font-size:12px;letter-spacing:.15em;text-transform:uppercase;color:#8b5cf6;margin:0 0 4px;font-weight:bold;">
      🛒 Nuovo ordine RetroStation
    </p>
    <h1 style="font-size:22px;margin:0 0 20px;color:#0f172a;">
      ${escapeHtml(data.numero_ordine)} &middot; ${fmt(data.totale)}
    </h1>

    <h2 style="font-size:13px;text-transform:uppercase;letter-spacing:.1em;color:#64748b;margin:16px 0 8px;border-top:1px solid #e2e8f0;padding-top:16px;">Cliente</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:4px 0;color:#64748b;width:110px;">Nome</td><td style="color:#0f172a;font-weight:bold;">${escapeHtml(data.cliente_nome)}</td></tr>
      <tr><td style="padding:4px 0;color:#64748b;">Email</td><td><a href="mailto:${escapeHtml(data.cliente_email)}" style="color:#0ea5e9;">${escapeHtml(data.cliente_email)}</a></td></tr>
      ${data.telefono ? `<tr><td style="padding:4px 0;color:#64748b;">Telefono</td><td><a href="tel:${escapeHtml(data.telefono)}" style="color:#0ea5e9;">${escapeHtml(data.telefono)}</a></td></tr>` : ""}
      <tr><td style="padding:4px 0;color:#64748b;">Indirizzo</td><td style="color:#0f172a;">${escapeHtml(data.indirizzo)}, ${escapeHtml(data.cap)} ${escapeHtml(data.citta)}</td></tr>
      ${data.metodo_pagamento ? `<tr><td style="padding:4px 0;color:#64748b;">Pagamento</td><td style="color:#0f172a;font-weight:bold;">${escapeHtml(data.metodo_pagamento)}</td></tr>` : ""}
      <tr><td style="padding:4px 0;color:#64748b;">Stato</td><td><span style="display:inline-block;padding:2px 8px;background:${data.stato === "Pagato" ? "#dcfce7;color:#15803d" : "#fef3c7;color:#92400e"};border-radius:999px;font-size:12px;font-weight:bold;">${escapeHtml(data.stato)}</span></td></tr>
    </table>

    <h2 style="font-size:13px;text-transform:uppercase;letter-spacing:.1em;color:#64748b;margin:24px 0 8px;border-top:1px solid #e2e8f0;padding-top:16px;">Prodotti</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${rows}
      <tr>
        <td style="padding:8px;background:#f1f5f9;color:#0f172a;font-weight:bold;">Totale</td>
        <td style="padding:8px;background:#f1f5f9;color:#0f172a;font-weight:bold;text-align:right;">${fmt(data.totale)}</td>
      </tr>
    </table>

    <p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;text-align:center;">
      Gestisci l'ordine dal <a href="https://www.retrostation00s.it/admin/ordini" style="color:#8b5cf6;text-decoration:none;font-weight:bold;">pannello admin</a>.
    </p>
  </div>
</body>
</html>`;

  try {
    const res = await client.emails.send({
      from,
      to: adminTo,
      replyTo: data.cliente_email, // rispondendo si scrive direttamente al cliente
      subject: `🛒 Nuovo ordine ${data.numero_ordine} — ${data.cliente_nome} — ${fmt(data.totale)}`,
      html,
    });
    return res;
  } catch (err) {
    console.error("[email] admin notification error:", err);
    return null;
  }
}

function escapeHtml(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
