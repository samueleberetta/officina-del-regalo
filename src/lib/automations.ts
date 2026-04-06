import { Automation, defaultAutomations } from "@/data/automations";
import { supabase } from "./supabase";

export async function getAutomations(): Promise<Automation[]> {
  const { data, error } = await supabase
    .from("automations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) {
    return defaultAutomations;
  }

  return data.map(mapDbToAutomation);
}

export async function saveAutomation(automation: Automation): Promise<boolean> {
  const { error } = await supabase.from("automations").insert(mapAutomationToDb(automation));

  // If anon key can't insert, try via API
  if (error) {
    const res = await fetch("/api/automations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(automation),
    });
    return res.ok;
  }
  return true;
}

export async function updateAutomation(automation: Automation): Promise<boolean> {
  const res = await fetch("/api/automations", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(automation),
  });
  return res.ok;
}

export async function deleteAutomation(id: string): Promise<boolean> {
  const res = await fetch(`/api/automations?id=${id}`, { method: "DELETE" });
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

function mapAutomationToDb(a: Automation) {
  let triggerValue = "";
  if (a.trigger.giorni) triggerValue = String(a.trigger.giorni);
  if (a.trigger.data) triggerValue = a.trigger.data;

  let audienceValue = "";
  if (a.pubblico.categoria) audienceValue = a.pubblico.categoria;
  if (a.pubblico.importo) audienceValue = String(a.pubblico.importo);
  if (a.pubblico.giorni) audienceValue = String(a.pubblico.giorni);

  return {
    id: a.id,
    nome: a.nome,
    trigger_type: a.trigger.tipo,
    trigger_value: triggerValue,
    audience_type: a.pubblico.tipo,
    audience_value: audienceValue,
    action_type: a.azione,
    oggetto_email: a.messaggio.oggetto,
    corpo_email: a.messaggio.corpo,
    attivo: a.attivo,
  };
}
