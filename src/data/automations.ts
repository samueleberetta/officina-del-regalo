export interface Automation {
  id: string;
  nome: string;
  trigger: {
    tipo: "dopo_acquisto" | "giorni_dopo_acquisto" | "giorni_prima_data" | "data_specifica" | "manuale";
    giorni?: number;
    data?: string;
  };
  pubblico: {
    tipo: "tutti" | "categoria" | "spesa_minima" | "inattivi";
    categoria?: string;
    importo?: number;
    giorni?: number;
  };
  azione: "email" | "newsletter" | "sconto";
  messaggio: {
    oggetto: string;
    corpo: string;
  };
  attivo: boolean;
  dataCreazione: string;
}

export const defaultAutomations: Automation[] = [
  {
    id: "auto-1",
    nome: "Benvenuto dopo primo acquisto",
    trigger: { tipo: "dopo_acquisto" },
    pubblico: { tipo: "tutti" },
    azione: "email",
    messaggio: {
      oggetto: "Grazie per il tuo acquisto!",
      corpo: "Ciao {{nome_cliente}},\n\nGrazie per aver acquistato {{prodotto_acquistato}}! Speriamo ti riporti bei ricordi.\n\nScopri altri pezzi retro: {{link_negozio}}\n\nA presto,\nRetroStation",
    },
    attivo: true,
    dataCreazione: "2024-11-15",
  },
  {
    id: "auto-2",
    nome: "Follow-up 7 giorni dopo acquisto",
    trigger: { tipo: "giorni_dopo_acquisto", giorni: 7 },
    pubblico: { tipo: "tutti" },
    azione: "email",
    messaggio: {
      oggetto: "Come va con la tua console?",
      corpo: "Ciao {{nome_cliente}},\n\nSono passati alcuni giorni dal tuo acquisto. Come va con {{prodotto_acquistato}}? Funziona tutto bene?\n\nSe hai bisogno, siamo qui.\n\nRetroStation",
    },
    attivo: false,
    dataCreazione: "2024-11-20",
  },
];
