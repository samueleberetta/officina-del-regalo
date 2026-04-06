export interface Product {
  id: string;
  nome: string;
  prezzo: number;
  categoria: "Matrimonio" | "Idee Regalo" | "Comunione";
  descrizione: string;
  immagine: string;
  slug: string;
  attivo: boolean;
}

export const defaultProducts: Product[] = [
  // Matrimonio
  {
    id: "mat-1",
    nome: "Portafoto in legno inciso",
    prezzo: 28.0,
    categoria: "Matrimonio",
    descrizione:
      "Un elegante portafoto realizzato a mano in legno di noce, personalizzabile con incisione dei nomi degli sposi e la data del matrimonio. Un ricordo che dura per sempre.",
    immagine: "https://picsum.photos/seed/portafoto/600/600",
    slug: "portafoto-legno-inciso",
    attivo: true,
  },
  {
    id: "mat-2",
    nome: "Set calligrafia sposi",
    prezzo: 45.0,
    categoria: "Matrimonio",
    descrizione:
      "Un raffinato set di calligrafia artigianale, perfetto per scrivere i voti nuziali o le partecipazioni. Include penna, inchiostro e carta pregiata.",
    immagine: "https://picsum.photos/seed/calligrafia/600/600",
    slug: "set-calligrafia-sposi",
    attivo: true,
  },
  {
    id: "mat-3",
    nome: "Candele profumate personalizzate",
    prezzo: 32.0,
    categoria: "Matrimonio",
    descrizione:
      "Candele in cera di soia con fragranze naturali, personalizzabili con i nomi degli sposi. Ideali come bomboniera o regalo per la coppia.",
    immagine: "https://picsum.photos/seed/candele-mat/600/600",
    slug: "candele-profumate-personalizzate",
    attivo: true,
  },
  {
    id: "mat-4",
    nome: "Album ricordi artigianale",
    prezzo: 55.0,
    categoria: "Matrimonio",
    descrizione:
      "Album fotografico fatto a mano con copertina in tela e dettagli dorati. Contiene 60 pagine in carta avorio per conservare i momenti più belli.",
    immagine: "https://picsum.photos/seed/album-ricordi/600/600",
    slug: "album-ricordi-artigianale",
    attivo: true,
  },
  // Idee Regalo
  {
    id: "reg-1",
    nome: "Scatola regalo sorpresa",
    prezzo: 22.0,
    categoria: "Idee Regalo",
    descrizione:
      "Una scatola regalo curata con una selezione di piccoli oggetti artigianali a sorpresa. Ogni scatola è unica e confezionata con cura.",
    immagine: "https://picsum.photos/seed/scatola-regalo/600/600",
    slug: "scatola-regalo-sorpresa",
    attivo: true,
  },
  {
    id: "reg-2",
    nome: "Tazza personalizzata",
    prezzo: 18.0,
    categoria: "Idee Regalo",
    descrizione:
      "Tazza in ceramica artigianale decorata a mano. Personalizzabile con nome, iniziali o un breve messaggio. Perfetta per ogni occasione.",
    immagine: "https://picsum.photos/seed/tazza/600/600",
    slug: "tazza-personalizzata",
    attivo: true,
  },
  {
    id: "reg-3",
    nome: "Kit profumeria casalinga",
    prezzo: 38.0,
    categoria: "Idee Regalo",
    descrizione:
      "Un kit completo per profumare la casa: diffusore in ceramica, oli essenziali naturali e sacchetti profumati alla lavanda. Tutto realizzato artigianalmente.",
    immagine: "https://picsum.photos/seed/profumeria/600/600",
    slug: "kit-profumeria-casalinga",
    attivo: true,
  },
  {
    id: "reg-4",
    nome: "Cesto prodotti artigianali",
    prezzo: 65.0,
    categoria: "Idee Regalo",
    descrizione:
      "Un cesto in vimini intrecciato a mano, riempito con prodotti artigianali locali: miele, marmellata, saponi naturali e cioccolato fondente.",
    immagine: "https://picsum.photos/seed/cesto/600/600",
    slug: "cesto-prodotti-artigianali",
    attivo: true,
  },
  // Comunione
  {
    id: "com-1",
    nome: "Rosario personalizzato",
    prezzo: 24.0,
    categoria: "Comunione",
    descrizione:
      "Un rosario realizzato con perle di vetro di Murano e croce in argento. Personalizzabile con incisione del nome e della data della Prima Comunione.",
    immagine: "https://picsum.photos/seed/rosario/600/600",
    slug: "rosario-personalizzato",
    attivo: true,
  },
  {
    id: "com-2",
    nome: "Portarosario in velluto",
    prezzo: 15.0,
    categoria: "Comunione",
    descrizione:
      "Elegante custodia in velluto bordeaux per rosario, con chiusura magnetica e interno foderato in seta. Un accessorio raffinato per un giorno speciale.",
    immagine: "https://picsum.photos/seed/portarosario/600/600",
    slug: "portarosario-velluto",
    attivo: true,
  },
  {
    id: "com-3",
    nome: "Libro dei ricordi Comunione",
    prezzo: 42.0,
    categoria: "Comunione",
    descrizione:
      "Un libro dei ricordi illustrato con pagine da compilare per conservare foto, pensieri e dediche del giorno della Prima Comunione. Copertina rigida con dettagli oro.",
    immagine: "https://picsum.photos/seed/libro-comunione/600/600",
    slug: "libro-ricordi-comunione",
    attivo: true,
  },
  {
    id: "com-4",
    nome: "Candela Comunione con nome",
    prezzo: 20.0,
    categoria: "Comunione",
    descrizione:
      "Candela decorativa in cera bianca con croce dorata e nome del bambino inciso. Confezionata in scatola regalo trasparente.",
    immagine: "https://picsum.photos/seed/candela-comunione/600/600",
    slug: "candela-comunione-nome",
    attivo: true,
  },
];
