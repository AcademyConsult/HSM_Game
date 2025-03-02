import './globals.css'
import { Inter } from 'next/font/google'
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] })

// Aktualisierter Code mit Icon- und OpenGraph-Konfiguration
export const metadata = {
  title: 'AC-Challenge',
  description: 'Spiele und gewinne mit Academy Consult',
  icons: {
    icon: 'https://raw.githubusercontent.com/AcademyConsult/HSM_Game/main/public/logo.png',
    apple: 'https://raw.githubusercontent.com/AcademyConsult/HSM_Game/main/public/logo.png',
    shortcut: 'https://raw.githubusercontent.com/AcademyConsult/HSM_Game/main/public/logo.png',
  },
  // OpenGraph-Metadaten für soziale Medien
  openGraph: {
    title: 'AC-Challenge',
    description: 'Spiele und gewinne mit Academy Consult',
    images: [
      {
        url: 'https://raw.githubusercontent.com/AcademyConsult/HSM_Game/main/public/logo.png', // Verwenden Sie hier ein eigenes Vorschaubild
        width: 1200,
        height: 630,
        alt: 'AC-Challenge',
      }
    ],
    type: 'website',
  },
  // Twitter/X Card (optional)
  twitter: {
    card: 'summary_large_image',
    title: 'AC-Challenge',
    description: 'Spiele und gewinne mit Academy Consult',
    images: ['https://raw.githubusercontent.com/AcademyConsult/HSM_Game/main/public/logo.png'], // Verwenden Sie hier ein eigenes Vorschaubild
  },
  // Zusätzliche Metadaten für Telegram
  other: {
    'telegram:channel': '@AcademyConsult', // Falls vorhanden
    'telegram:image': 'https://raw.githubusercontent.com/AcademyConsult/HSM_Game/main/public/og-image.jpg',
  }
};

export const viewport = {
  themeColor: '#993333',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <head>
        {/* Explizite Meta-Tags für Telegram (zusätzlich zu Next.js Metadaten) */}
        <meta property="og:title" content="AC-Challenge" />
        <meta property="og:description" content="Spiele und gewinne mit Academy Consult" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
