export type Marchio = "PlayStation" | "Nintendo" | "Xbox" | "Altro";
export type Tipo = "Console" | "Controller" | "Giochi" | "Accessori";

export interface Product {
  id: string;
  nome: string;
  prezzo: number;
  /** Marchio della console. "Altro" raggruppa multi-console o brand minori. */
  marchio: Marchio;
  /** Tipologia di prodotto. */
  tipo: Tipo;
  /**
   * Categoria storica (deprecata). Per i nuovi prodotti viene ricavata
   * da `tipo`. Mantenuta per retro-compatibilita con il DB esistente.
   */
  categoria: string;
  descrizione: string;
  immagine: string;
  immagini?: string[];
  slug: string;
  attivo: boolean;
}

export function getProductImages(product: Product): string[] {
  if (product.immagini && product.immagini.length > 0) {
    return product.immagini;
  }
  return [product.immagine];
}

export const MARCHI: { value: Marchio; label: string }[] = [
  { value: "PlayStation", label: "PlayStation" },
  { value: "Nintendo", label: "Nintendo" },
  { value: "Xbox", label: "Xbox" },
  { value: "Altro", label: "Altre console" },
];

export const TIPI: { value: Tipo; label: string }[] = [
  { value: "Console", label: "Console" },
  { value: "Controller", label: "Controller" },
  { value: "Giochi", label: "Giochi" },
  { value: "Accessori", label: "Altro / Accessori" },
];

// Mantengo CATEGORIE per evitare di rompere import esistenti. Usa il nuovo modello.
export const CATEGORIE = [
  "PlayStation",
  "Nintendo",
  "Xbox",
  "Console",
  "Controller",
  "Giochi",
  "Accessori",
] as const;

/**
 * Inferisce il marchio dalla vecchia `categoria` o dal nome del prodotto.
 * Usato come fallback quando il DB non ha ancora la colonna marchio popolata.
 */
export function inferMarchio(p: { categoria?: string; nome?: string }): Marchio {
  const cat = (p.categoria || "").toLowerCase();
  const nome = (p.nome || "").toLowerCase();
  if (cat === "playstation" || /playstation|ps[123]|dualshock/.test(nome)) return "PlayStation";
  if (cat === "nintendo" || /nintendo|wii|game ?boy|nes|gamecube|mario/.test(nome)) return "Nintendo";
  if (cat === "xbox" || /xbox/.test(nome)) return "Xbox";
  return "Altro";
}

/**
 * Inferisce il tipo dalla vecchia `categoria`.
 */
export function inferTipo(p: { categoria?: string; nome?: string }): Tipo {
  const cat = (p.categoria || "").toLowerCase();
  if (cat === "controller") return "Controller";
  if (cat === "giochi") return "Giochi";
  if (cat === "accessori") return "Accessori";
  if (cat === "console" || cat === "playstation" || cat === "nintendo" || cat === "xbox") return "Console";
  const nome = (p.nome || "").toLowerCase();
  if (/controller|dualshock|wiimote|joypad/.test(nome)) return "Controller";
  if (/cavo|memory card|caricatore|adattatore|alimentatore/.test(nome)) return "Accessori";
  if (/gioco|cartuccia|disco/.test(nome)) return "Giochi";
  return "Console";
}

export const defaultProducts: Product[] = [
  {
    id: "ps-1",
    nome: "PlayStation 1 — Console completa",
    prezzo: 89.0,
    marchio: "PlayStation",
    tipo: "Console",
    categoria: "PlayStation",
    descrizione:
      "PlayStation 1 originale in ottime condizioni, testata e funzionante. Include cavi AV, alimentatore e un controller originale.",
    immagine: "https://loremflickr.com/600/600/playstation,console,ps1?lock=101",
    slug: "playstation-1-console-completa",
    attivo: true,
  },
  {
    id: "ps-2",
    nome: "PlayStation 2 Slim — Nera",
    prezzo: 75.0,
    marchio: "PlayStation",
    tipo: "Console",
    categoria: "PlayStation",
    descrizione:
      "PS2 Slim in versione nera. Lettore funzionante, include alimentatore e cavi. Pronta per giocare.",
    immagine: "https://loremflickr.com/600/600/playstation2,ps2,console?lock=102",
    slug: "playstation-2-slim-nera",
    attivo: true,
  },
  {
    id: "nin-1",
    nome: "Nintendo Wii — Bianca + Wiimote",
    prezzo: 55.0,
    marchio: "Nintendo",
    tipo: "Console",
    categoria: "Nintendo",
    descrizione:
      "Nintendo Wii bianca con Wiimote e Nunchuk. Perfetta per le serate con gli amici. Sensor bar inclusa.",
    immagine: "https://loremflickr.com/600/600/nintendo,wii,console?lock=104",
    slug: "nintendo-wii-bianca-wiimote",
    attivo: true,
  },
  {
    id: "nin-2",
    nome: "Game Boy Advance SP",
    prezzo: 95.0,
    marchio: "Nintendo",
    tipo: "Console",
    categoria: "Nintendo",
    descrizione:
      "GBA SP con schermo retroilluminato, caricatore incluso. Scocca in buone condizioni.",
    immagine: "https://loremflickr.com/600/600/gameboy,advance,nintendo?lock=105",
    slug: "game-boy-advance-sp",
    attivo: true,
  },
  {
    id: "con-1",
    nome: "Controller DualShock 2 — Originale",
    prezzo: 22.0,
    marchio: "PlayStation",
    tipo: "Controller",
    categoria: "Controller",
    descrizione:
      "Controller DualShock 2 originale Sony per PS2. Analogici precisi, vibrazione funzionante.",
    immagine: "https://loremflickr.com/600/600/dualshock,controller,playstation?lock=106",
    slug: "controller-dualshock-2-originale",
    attivo: true,
  },
  {
    id: "con-2",
    nome: "Controller Nintendo GameCube — Viola",
    prezzo: 35.0,
    marchio: "Nintendo",
    tipo: "Controller",
    categoria: "Controller",
    descrizione:
      "Controller originale GameCube viola. Stick e pulsanti reattivi. Cavo lungo 2 metri.",
    immagine: "https://loremflickr.com/600/600/gamecube,controller,nintendo?lock=107",
    slug: "controller-gamecube-viola",
    attivo: true,
  },
  {
    id: "gio-1",
    nome: "Crash Bandicoot — PS1",
    prezzo: 18.0,
    marchio: "PlayStation",
    tipo: "Giochi",
    categoria: "Giochi",
    descrizione:
      "Crash Bandicoot per PlayStation 1. Disco in ottime condizioni, custodia e manuale inclusi.",
    immagine: "https://loremflickr.com/600/600/crash,bandicoot,playstation?lock=108",
    slug: "crash-bandicoot-ps1",
    attivo: true,
  },
  {
    id: "gio-2",
    nome: "Super Mario Bros. — NES",
    prezzo: 30.0,
    marchio: "Nintendo",
    tipo: "Giochi",
    categoria: "Giochi",
    descrizione:
      "La cartuccia originale di Super Mario Bros. per NES. Un pezzo di storia dei videogiochi.",
    immagine: "https://loremflickr.com/600/600/mario,nintendo,nes?lock=109",
    slug: "super-mario-bros-nes",
    attivo: true,
  },
  {
    id: "acc-1",
    nome: "Memory Card PS2 — 8MB",
    prezzo: 8.0,
    marchio: "PlayStation",
    tipo: "Accessori",
    categoria: "Accessori",
    descrizione:
      "Memory Card originale Sony da 8MB per PlayStation 2. Formattata e pronta all'uso.",
    immagine: "https://loremflickr.com/600/600/memorycard,playstation,gaming?lock=111",
    slug: "memory-card-ps2-8mb",
    attivo: true,
  },
  {
    id: "acc-2",
    nome: "Cavo AV Composito — Multi console",
    prezzo: 10.0,
    marchio: "Altro",
    tipo: "Accessori",
    categoria: "Accessori",
    descrizione:
      "Cavo AV composito compatibile con PS1, PS2, PS3. Connettori dorati per migliore qualita audio/video.",
    immagine: "https://loremflickr.com/600/600/cable,console,gaming?lock=112",
    slug: "cavo-av-composito-multi",
    attivo: true,
  },
  {
    id: "ps-3",
    nome: "PlayStation 3 Slim — 250GB",
    prezzo: 95.0,
    marchio: "PlayStation",
    tipo: "Console",
    categoria: "PlayStation",
    descrizione:
      "PS3 Slim 250GB. Firmware aggiornato, lettore Blu-ray funzionante. Include controller e cavi.",
    immagine: "https://loremflickr.com/600/600/playstation3,ps3,console?lock=103",
    slug: "playstation-3-slim-250gb",
    attivo: true,
  },
  {
    id: "gio-3",
    nome: "Mario Kart Wii + Volante",
    prezzo: 28.0,
    marchio: "Nintendo",
    tipo: "Giochi",
    categoria: "Giochi",
    descrizione:
      "Mario Kart Wii con volante Wii Wheel incluso. Disco perfetto, ore di divertimento assicurate.",
    immagine: "https://loremflickr.com/600/600/mariokart,wii,nintendo?lock=110",
    slug: "mario-kart-wii-volante",
    attivo: true,
  },
];
