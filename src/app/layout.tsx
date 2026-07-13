import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';

import { brand } from '@/cms/content';
import { SITE } from '@/utils/constants';
import { Providers } from '@/providers';
import { Loader } from '@/components/layout/Loader';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CustomCursor } from '@/components/shared/CustomCursor';
import { NoiseOverlay } from '@/components/shared/NoiseOverlay';

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  axes: ['opsz'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s — ${brand.name}`,
  },
  description: SITE.description,
  applicationName: brand.name,
  authors: [{ name: brand.name }],
  keywords: [
    'luxury furniture',
    'collectible design',
    'furniture atelier',
    'bespoke furniture',
    'editorial interiors',
    brand.name,
  ],
  openGraph: {
    type: 'website',
    url: SITE.url,
    siteName: brand.name,
    title: SITE.title,
    description: SITE.description,
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: brand.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.title,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#F4F1EA',
  colorScheme: 'light',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FurnitureStore',
  name: brand.name,
  description: SITE.description,
  slogan: brand.tagline,
  url: SITE.url,
  foundingDate: brand.founded,
  areaServed: 'Worldwide',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Copenhagen',
    addressCountry: 'DK',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          <Loader />
          <CustomCursor />
          <NoiseOverlay />
          <a
            href="#collections"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-espresso focus:px-5 focus:py-2 focus:text-sm focus:text-bone"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
