import './globals.css'
import { Inter } from 'next/font/google'

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
      <body className={inter.className}>{children}</body>
    </html>
  )
}
