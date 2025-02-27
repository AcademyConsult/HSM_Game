import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

// Aktualisierter Code mit Icon-Konfiguration
export const metadata = {
  title: 'AC-Challenge',
  description: 'Spiele und gewinne mit Academy Consult',
  icons: {
    icon: 'https://raw.githubusercontent.com/AcademyConsult/HSM_Game/main/public/logo.png', // Standard-Favicon
    apple: 'https://raw.githubusercontent.com/AcademyConsult/HSM_Game/main/public/logo.png', // Apple Touch Icon
    shortcut: 'https://raw.githubusercontent.com/AcademyConsult/HSM_Game/main/public/logo.png', // Shortcut Icon
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
