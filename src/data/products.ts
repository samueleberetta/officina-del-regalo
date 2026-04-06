export interface Product {
  id: string;
  nome: string;
  prezzo: number;
  categoria: string;
  descrizione: string;
  immagine: string;
  immagini?: string[];
  slug: string;
  attivo: boolean;
}

// Helper to get all images for a product (backward compatible)
export function getProductImages(product: Product): string[] {
  if (product.immagini && product.immagini.length > 0) {
    return product.immagini;
  }
  return [product.immagine];
}

export const CATEGORIE = [
  "Bomboniere",
  "Tavola e Cucina",
  "Argento e Cristallo",
  "Natale",
  "Idee Regalo",
  "Casa",
  "Moda e Bijoux",
] as const;

export const defaultProducts: Product[] = [
  // Bomboniere
  {
    id: "bom-1",
    nome: "Portafoto in legno inciso",
    prezzo: 28.0,
    categoria: "Bomboniere",
    descrizione:
      "Un elegante portafoto realizzato a mano in legno di noce, personalizzabile con incisione dei nomi degli sposi e la data del matrimonio.",
    immagine: "https://picsum.photos/seed/portafoto/600/600",
    slug: "portafoto-legno-inciso",
    attivo: true,
  },
  {
    id: "bom-2",
    nome: "Candele profumate personalizzate",
    prezzo: 32.0,
    categoria: "Bomboniere",
    descrizione:
      "Candele in cera di soia con fragranze naturali, personalizzabili con i nomi degli sposi. Ideali come bomboniera.",
    immagine: "https://picsum.photos/seed/candele-mat/600/600",
    slug: "candele-profumate-personalizzate",
    attivo: true,
  },
  // Tavola e Cucina
  {
    id: "tav-1",
    nome: "Set calligrafia sposi",
    prezzo: 45.0,
    categoria: "Tavola e Cucina",
    descrizione:
      "Un raffinato set artigianale, perfetto come regalo per la casa. Include penna, inchiostro e carta pregiata.",
    immagine: "https://picsum.photos/seed/calligrafia/600/600",
    slug: "set-calligrafia-sposi",
    attivo: true,
  },
  {
    id: "tav-2",
    nome: "Tazza personalizzata",
    prezzo: 18.0,
    categoria: "Tavola e Cucina",
    descrizione:
      "Tazza in ceramica artigianale decorata a mano. Personalizzabile con nome, iniziali o un breve messaggio.",
    immagine: "https://picsum.photos/seed/tazza/600/600",
    slug: "tazza-personalizzata",
    attivo: true,
  },
  // Argento e Cristallo
  {
    id: "arg-1",
    nome: "Rosario personalizzato",
    prezzo: 24.0,
    categoria: "Argento e Cristallo",
    descrizione:
      "Un rosario realizzato con perle di vetro di Murano e croce in argento. Personalizzabile con incisione del nome.",
    immagine: "https://picsum.photos/seed/rosario/600/600",
    slug: "rosario-personalizzato",
    attivo: true,
  },
  {
    id: "arg-2",
    nome: "Portarosario in velluto",
    prezzo: 15.0,
    categoria: "Argento e Cristallo",
    descrizione:
      "Elegante custodia in velluto bordeaux per rosario, con chiusura magnetica e interno foderato in seta.",
    immagine: "https://picsum.photos/seed/portarosario/600/600",
    slug: "portarosario-velluto",
    attivo: true,
  },
  // Idee Regalo
  {
    id: "reg-1",
    nome: "Scatola regalo sorpresa",
    prezzo: 22.0,
    categoria: "Idee Regalo",
    descrizione:
      "Una scatola regalo curata con una selezione di piccoli oggetti artigianali a sorpresa. Ogni scatola e unica.",
    immagine: "https://picsum.photos/seed/scatola-regalo/600/600",
    slug: "scatola-regalo-sorpresa",
    attivo: true,
  },
  {
    id: "reg-2",
    nome: "Cesto prodotti artigianali",
    prezzo: 65.0,
    categoria: "Idee Regalo",
    descrizione:
      "Un cesto in vimini intrecciato a mano, riempito con prodotti artigianali locali: miele, marmellata, saponi naturali.",
    immagine: "https://picsum.photos/seed/cesto/600/600",
    slug: "cesto-prodotti-artigianali",
    attivo: true,
  },
  // Casa
  {
    id: "cas-1",
    nome: "Kit profumeria casalinga",
    prezzo: 38.0,
    categoria: "Casa",
    descrizione:
      "Un kit completo per profumare la casa: diffusore in ceramica, oli essenziali naturali e sacchetti profumati alla lavanda.",
    immagine: "https://picsum.photos/seed/profumeria/600/600",
    slug: "kit-profumeria-casalinga",
    attivo: true,
  },
  {
    id: "cas-2",
    nome: "Album ricordi artigianale",
    prezzo: 55.0,
    categoria: "Casa",
    descrizione:
      "Album fotografico fatto a mano con copertina in tela e dettagli dorati. Contiene 60 pagine in carta avorio.",
    immagine: "https://picsum.photos/seed/album-ricordi/600/600",
    slug: "album-ricordi-artigianale",
    attivo: true,
  },
  // Natale
  {
    id: "nat-1",
    nome: "Candela Natale decorativa",
    prezzo: 20.0,
    categoria: "Natale",
    descrizione:
      "Candela decorativa in cera rossa con dettagli dorati. Confezionata in scatola regalo trasparente.",
    immagine: "https://picsum.photos/seed/candela-comunione/600/600",
    slug: "candela-natale-decorativa",
    attivo: true,
  },
  {
    id: "nat-2",
    nome: "Libro dei ricordi",
    prezzo: 42.0,
    categoria: "Natale",
    descrizione:
      "Un libro dei ricordi illustrato con pagine da compilare per conservare foto, pensieri e dediche. Copertina rigida con dettagli oro.",
    immagine: "https://picsum.photos/seed/libro-comunione/600/600",
    slug: "libro-ricordi",
    attivo: true,
  },
];
