import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next';
import CookieConsentComponent from '@/components/CookieConsent';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Academy Consult Challenge',
  description: 'Mach mit bei unserer Challenge und gewinne tolle Preise',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        {children}
        <CookieConsentComponent />
      </body>
    </html>
  );
}
