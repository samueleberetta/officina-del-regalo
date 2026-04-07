import { Automation, defaultAutomations } from "@/data/automations";

export async function getAutomations(): Promise<Automation[]> {
  try {
    const res = await fetch("/api/automations", { cache: "no-store" });
    if (!res.ok) return defaultAutomations;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return [];
    return data.map(mapDbToAutomation);
  } catch {
    return defaultAutomations;
  }
}

export async function saveAutomation(automation: Automation): Promise<boolean> {
  const res = await fetch("/api/automations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(automation),
  });
  return res.ok;
}

export async function updateAutomation(automation: Automation): Promise<boolean> {
  const res = await fetch("/api/automations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...automation, _action: "update" }),
  });
  return res.ok;
}

export async function deleteAutomation(id: string): Promise<boolean> {
  const res = await fetch("/api/automations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, _action: "delete" }),
  });
  return res.ok;
}

function mapDbToAutomation(row: Record<string, unknown>): Automation {
  return {
    id: row.id as string,
    nome: row.nome as string,
    trigger: {
      tipo: row.trigger_type as Automation["trigger"]["tipo"],
      giorni: row.trigger_value ? parseInt(row.trigger_value as string) || undefined : undefined,
      data: row.trigger_type === "data_specifica" ? (row.trigger_value as string) : undefined,
    },
    pubblico: {
      tipo: row.audience_type as Automation["pubblico"]["tipo"],
      categoria: row.audience_type === "categoria" ? (row.audience_value as Automation["pubblico"]["categoria"]) : undefined,
      importo: row.audience_type === "spesa_minima" ? parseFloat(row.audience_value as string) || undefined : undefined,
      giorni: row.audience_type === "inattivi" ? parseInt(row.audience_value as string) || undefined : undefined,
    },
    azione: row.action_type as Automation["azione"],
    messaggio: {
      oggetto: row.oggetto_email as string,
      corpo: row.corpo_email as string,
    },
    attivo: row.attivo as boolean,
    dataCreazione: (row.created_at as string).split("T")[0],
  };
}
