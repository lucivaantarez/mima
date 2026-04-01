import type { Metadata } from 'next';
import { Cormorant_Garamond, Montserrat } from 'next/font/google';
import './globals.css';

// ─── Fonts loaded via next/font (self-hosted through Vercel, zero FOUT) ────────

// Cormorant Garamond — poem italic body
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic', 'normal'],
  variable: '--font-cormorant',
  display: 'swap',
});

// Montserrat — letter body weight 300
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-montserrat',
  display: 'swap',
});

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Saturnity',
  description: 'A cosmic experience.',
};

// ─── Root layout ──────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // CSS variable injection — components reference var(--font-cormorant) etc.
      className={`${cormorant.variable} ${montserrat.variable}`}
    >
      <head>
        {/* Viewport: locked to iPhone dimensions, viewport-fit=cover unlocks safe area insets */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />

        {/* Explicitly tell Safari to use dark palette — prevents white flash */}
        <meta name="color-scheme" content="dark" />

        {/* Exo 2 — UI chrome (extralight 200, light 300, regular 400) via CDN */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Exo+2:wght@200;300;400&display=swap"
          rel="stylesheet"
        />

        {/* iOS home screen / PWA */}
        <meta name="apple-mobile-web-app-capable"          content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color"                           content="#050510" />
      </head>
      <body>
        {/* Three-layer CSS starfield — rendered as fixed DOM nodes so they sit
            behind all content without creating stacking context issues */}
        <div className="stars-sm" aria-hidden="true" />
        <div className="stars-md" aria-hidden="true" />
        <div className="stars-lg" aria-hidden="true" />

        {children}
      </body>
    </html>
  );
}
