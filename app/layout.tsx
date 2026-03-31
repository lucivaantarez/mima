import type { Metadata, Viewport } from 'next';
import './globals.css';
import { cormorant, inter } from './fonts';

export const metadata: Metadata = {
  title: 'Project Saturnity',
  description: 'An immersive cosmic experience',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Saturnity',
  },
};

export const viewport: Viewport = {
  width:         'device-width',
  initialScale:  1,
  maximumScale:  1,
  userScalable:  false,
  viewportFit:   'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="bg-saturn-space text-white antialiased overflow-hidden">
        <div className="stars-layer-1" aria-hidden="true" />
        <div className="stars-layer-2" aria-hidden="true" />
        <div className="stars-layer-3" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
