import type { Metadata } from "next";
import "./globals.css";

const deploymentUrl = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(deploymentUrl),
  title: "Juan × Walewska — Nuestro primer año",
  description: "365 días, millones de latidos y una historia infinita. Una experiencia creada para celebrar el primer año de Juan y Walewska.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Juan × Walewska — Nuestro primer año",
    description: "Un año merece sentirse, no solo contarse.",
    type: "website",
    images: [{ url: "/photos/hero.jpg", width: 1685, height: 957, alt: "Juan y Walewska" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Juan × Walewska — Nuestro primer año",
    description: "365 días. Una historia infinita.",
    images: ["/photos/hero.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
