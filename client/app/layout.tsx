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
import { Analytics } from '@vercel/analytics/next';

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
        {/* Meta Pixel Code */}
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1607054414500016');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img height="1" width="1" style={{ display: 'none' }} src="https://www.facebook.com/tr?id=1607054414500016&ev=PageView&noscript=1" alt="" />
        </noscript>
      </head>
      <body>
        {children}
        <WhatsAppFloat />
        <Analytics />
      </body>
    </html>
  );
}
