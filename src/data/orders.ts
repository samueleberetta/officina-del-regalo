export interface Order {
  id: string;
  numero: string;
  cliente: string;
  email: string;
  indirizzo: string;
  citta: string;
  cap: string;
  data: string;
  totale: number;
  stato: "In lavorazione" | "Spedito" | "Consegnato";
  prodotti: { id: string; nome: string; prezzo: number; quantita: number }[];
}

export const mockOrders: Order[] = [
  {
    id: "ord-1",
    numero: "ODR-2841",
    cliente: "Maria Rossi",
    email: "maria.rossi@email.it",
    indirizzo: "Via Roma 15",
    citta: "Milano",
    cap: "20121",
    data: "2024-12-01",
    totale: 73.0,
    stato: "Consegnato",
    prodotti: [
      { id: "mat-1", nome: "Portafoto in legno inciso", prezzo: 28.0, quantita: 1 },
      { id: "mat-2", nome: "Set calligrafia sposi", prezzo: 45.0, quantita: 1 },
    ],
  },
  {
    id: "ord-2",
    numero: "ODR-2842",
    cliente: "Luca Bianchi",
    email: "luca.bianchi@email.it",
    indirizzo: "Corso Italia 42",
    citta: "Roma",
    cap: "00185",
    data: "2024-12-02",
    totale: 22.0,
    stato: "Spedito",
    prodotti: [
      { id: "reg-1", nome: "Scatola regalo sorpresa", prezzo: 22.0, quantita: 1 },
    ],
  },
  {
    id: "ord-3",
    numero: "ODR-2843",
    cliente: "Giulia Verdi",
    email: "giulia.verdi@email.it",
    indirizzo: "Via Garibaldi 8",
    citta: "Firenze",
    cap: "50122",
    data: "2024-12-03",
    totale: 81.0,
    stato: "In lavorazione",
    prodotti: [
      { id: "com-1", nome: "Rosario personalizzato", prezzo: 24.0, quantita: 1 },
      { id: "com-3", nome: "Libro dei ricordi Comunione", prezzo: 42.0, quantita: 1 },
      { id: "com-2", nome: "Portarosario in velluto", prezzo: 15.0, quantita: 1 },
    ],
  },
  {
    id: "ord-4",
    numero: "ODR-2844",
    cliente: "Andrea Neri",
    email: "andrea.neri@email.it",
    indirizzo: "Piazza Duomo 3",
    citta: "Napoli",
    cap: "80133",
    data: "2024-12-04",
    totale: 65.0,
    stato: "Spedito",
    prodotti: [
      { id: "reg-4", nome: "Cesto prodotti artigianali", prezzo: 65.0, quantita: 1 },
    ],
  },
  {
    id: "ord-5",
    numero: "ODR-2845",
    cliente: "Sara Colombo",
    email: "sara.colombo@email.it",
    indirizzo: "Via Manzoni 22",
    citta: "Torino",
    cap: "10121",
    data: "2024-12-05",
    totale: 118.0,
    stato: "In lavorazione",
    prodotti: [
      { id: "mat-4", nome: "Album ricordi artigianale", prezzo: 55.0, quantita: 1 },
      { id: "mat-3", nome: "Candele profumate personalizzate", prezzo: 32.0, quantita: 1 },
      { id: "reg-3", nome: "Kit profumeria casalinga", prezzo: 38.0, quantita: 1 },
    ],
  },
];
