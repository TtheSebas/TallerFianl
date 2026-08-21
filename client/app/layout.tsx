import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Línea de Muebles Mesías',
  description:
    'Fabrica de muebles a medida en Ambato, Ecuador. Cocinas integrales, closets, dormitorios, comedores y mas. Carpinteria arquitectonica con garantia de 1 año. Cotiza por WhatsApp.',
  keywords: [
    'fabrica de muebles Ambato',
    'muebles a medida Ecuador',
    'cocinas integrales Ambato',
    'closets a medida',
    'carpinteria arquitectonica Ecuador',
    'muebles de madera Ambato',
    'Muebles Mesias',
  ],
  authors: [{ name: 'Linea de Muebles Mesias' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Fabrica de Muebles a Medida en Ambato | Muebles Mesias Ecuador',
    description:
      'Muebles artesanales de calidad premium en Ecuador. Cocinas integrales, closets, dormitorios y mas. Cotiza sin compromiso por WhatsApp.',
    type: 'website',
    locale: 'es_EC',
    siteName: 'Muebles Mesias',
  },
};

import WhatsAppFloat from '@/components/WhatsAppFloat';
import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`} style={{ scrollBehavior: 'smooth' }}>
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-TJZE4354DT`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-TJZE4354DT', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body>
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}
