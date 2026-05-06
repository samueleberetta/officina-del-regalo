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

export function getProductImages(product: Product): string[] {
  if (product.immagini && product.immagini.length > 0) {
    return product.immagini;
  }
  return [product.immagine];
}

export const CATEGORIE = [
  "PlayStation",
  "Nintendo",
  "Xbox",
  "Console",
  "Controller",
  "Giochi",
  "Accessori",
] as const;

export const defaultProducts: Product[] = [
  {
    id: "ps-1",
    nome: "PlayStation 1 — Console completa",
    prezzo: 89.0,
    categoria: "PlayStation",
    descrizione:
      "PlayStation 1 originale in ottime condizioni, testata e funzionante. Include cavi AV, alimentatore e un controller originale.",
    immagine: "https://picsum.photos/seed/ps1-console/600/600",
    slug: "playstation-1-console-completa",
    attivo: true,
  },
  {
    id: "ps-2",
    nome: "PlayStation 2 Slim — Nera",
    prezzo: 75.0,
    categoria: "PlayStation",
    descrizione:
      "PS2 Slim in versione nera. Lettore funzionante, include alimentatore e cavi. Pronta per giocare.",
    immagine: "https://picsum.photos/seed/ps2-slim/600/600",
    slug: "playstation-2-slim-nera",
    attivo: true,
  },
  {
    id: "nin-1",
    nome: "Nintendo Wii — Bianca + Wiimote",
    prezzo: 55.0,
    categoria: "Nintendo",
    descrizione:
      "Nintendo Wii bianca con Wiimote e Nunchuk. Perfetta per le serate con gli amici. Sensor bar inclusa.",
    immagine: "https://picsum.photos/seed/wii-console/600/600",
    slug: "nintendo-wii-bianca-wiimote",
    attivo: true,
  },
  {
    id: "nin-2",
    nome: "Game Boy Advance SP",
    prezzo: 95.0,
    categoria: "Nintendo",
    descrizione:
      "GBA SP con schermo retroilluminato, caricatore incluso. Scocca in buone condizioni.",
    immagine: "https://picsum.photos/seed/gba-sp/600/600",
    slug: "game-boy-advance-sp",
    attivo: true,
  },
  {
    id: "con-1",
    nome: "Controller DualShock 2 — Originale",
    prezzo: 22.0,
    categoria: "Controller",
    descrizione:
      "Controller DualShock 2 originale Sony per PS2. Analogici precisi, vibrazione funzionante.",
    immagine: "https://picsum.photos/seed/dualshock2/600/600",
    slug: "controller-dualshock-2-originale",
    attivo: true,
  },
  {
    id: "con-2",
    nome: "Controller Nintendo GameCube — Viola",
    prezzo: 35.0,
    categoria: "Controller",
    descrizione:
      "Controller originale GameCube viola. Stick e pulsanti reattivi. Cavo lungo 2 metri.",
    immagine: "https://picsum.photos/seed/gc-controller/600/600",
    slug: "controller-gamecube-viola",
    attivo: true,
  },
  {
    id: "gio-1",
    nome: "Crash Bandicoot — PS1",
    prezzo: 18.0,
    categoria: "Giochi",
    descrizione:
      "Crash Bandicoot per PlayStation 1. Disco in ottime condizioni, custodia e manuale inclusi.",
    immagine: "https://picsum.photos/seed/crash-ps1/600/600",
    slug: "crash-bandicoot-ps1",
    attivo: true,
  },
  {
    id: "gio-2",
    nome: "Super Mario Bros. — NES",
    prezzo: 30.0,
    categoria: "Giochi",
    descrizione:
      "La cartuccia originale di Super Mario Bros. per NES. Un pezzo di storia dei videogiochi.",
    immagine: "https://picsum.photos/seed/mario-nes/600/600",
    slug: "super-mario-bros-nes",
    attivo: true,
  },
  {
    id: "acc-1",
    nome: "Memory Card PS2 — 8MB",
    prezzo: 8.0,
    categoria: "Accessori",
    descrizione:
      "Memory Card originale Sony da 8MB per PlayStation 2. Formattata e pronta all'uso.",
    immagine: "https://picsum.photos/seed/memcard-ps2/600/600",
    slug: "memory-card-ps2-8mb",
    attivo: true,
  },
  {
    id: "acc-2",
    nome: "Cavo AV Composito — Multi console",
    prezzo: 10.0,
    categoria: "Accessori",
    descrizione:
      "Cavo AV composito compatibile con PS1, PS2, PS3. Connettori dorati per migliore qualita audio/video.",
    immagine: "https://picsum.photos/seed/cavo-av/600/600",
    slug: "cavo-av-composito-multi",
    attivo: true,
  },
  {
    id: "ps-3",
    nome: "PlayStation 3 Slim — 250GB",
    prezzo: 95.0,
    categoria: "PlayStation",
    descrizione:
      "PS3 Slim 250GB. Firmware aggiornato, lettore Blu-ray funzionante. Include controller e cavi.",
    immagine: "https://picsum.photos/seed/ps3-slim/600/600",
    slug: "playstation-3-slim-250gb",
    attivo: true,
  },
  {
    id: "gio-3",
    nome: "Mario Kart Wii + Volante",
    prezzo: 28.0,
    categoria: "Giochi",
    descrizione:
      "Mario Kart Wii con volante Wii Wheel incluso. Disco perfetto, ore di divertimento assicurate.",
    immagine: "https://picsum.photos/seed/mariokart-wii/600/600",
    slug: "mario-kart-wii-volante",
    attivo: true,
  },
];
