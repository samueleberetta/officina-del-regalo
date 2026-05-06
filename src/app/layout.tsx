import type { Metadata } from "next";
import "./globals.css";
import ConditionalHeader from "@/components/ConditionalHeader";
import ConditionalFooter from "@/components/ConditionalFooter";
import CookieBanner from "@/components/CookieBanner";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "RetroStation 00's — Rivivi la tua infanzia, ovunque.",
  description:
    "Vendita di console, controller e giochi retro: PS1, PS2, PS3, Wii, Nintendo. Rivivi la tua infanzia con RetroStation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body text-text-dark bg-retro-dark antialiased">
        <CartProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#12122a",
                color: "#e2e8f0",
                border: "1px solid #1e1e3a",
                borderRadius: "12px",
                padding: "12px 24px",
                fontSize: "14px",
              },
            }}
          />
          <ConditionalHeader />
          <main className="min-h-screen">{children}</main>
          <ConditionalFooter />
          <CookieBanner />
        </CartProvider>
      </body>
    </html>
  );
}
