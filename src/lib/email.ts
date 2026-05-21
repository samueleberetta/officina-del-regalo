import { Resend } from "resend";

/**
 * Helper email transactional con Resend.
 *
 * Env vars:
 *   RESEND_API_KEY      — key dalla dashboard Resend (https://resend.com)
 *   RESEND_FROM_EMAIL   — mittente verificato (es. "RetroStation <ordini@retrostation00s.it>")
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

const DEFAULT_FROM = "RetroStation <onboarding@resend.dev>";

export interface OrderEmailData {
  numero_ordine: string;
  cliente_nome: string;
  cliente_email: string;
  prodotti: Array<{ nome: string; prezzo: number; quantita?: number }>;
  totale: number;
  spedizione: number;
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
        <td style="padding:8px 0;color:#94a3b8;">Spedizione</td>
        <td style="padding:8px 0;color:#94a3b8;text-align:right;">${
          data.spedizione === 0 ? "Gratuita" : fmt(data.spedizione)
        }</td>
      </tr>
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
    const res = await client.emails.send({
      from,
      to: data.cliente_email,
      subject: `Ordine ${data.numero_ordine} confermato — RetroStation`,
      html,
    });
    return res;
  } catch (err) {
    console.error("[email] send error:", err);
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
