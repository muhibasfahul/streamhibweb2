import { Navbar } from '@/components/navbar' // <-- PASTIKAN IMPORT INI ADA
import { Footer } from '@/components/footer' 
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/hooks/use-language';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StreamHib - Tool Live Streaming 24/7 Tanpa Komputer | Server Streaming Otomatis',
  description: 'StreamHib adalah tool live streaming 24/7 yang berjalan otomatis dari server. Live streaming tanpa komputer, tanpa ribet, tanpa khawatir mati sendiri. Coba gratis sekarang!',
  keywords: 'tool live streaming, live streaming 24/7, streaming otomatis, server streaming, live streaming tanpa komputer, streaming youtube otomatis',
  authors: [{ name: 'StreamHib' }],
  creator: 'StreamHib',
  publisher: 'StreamHib',
  openGraph: {
    title: 'StreamHib - Tool Live Streaming 24/7 Tanpa Komputer',
    description: 'Live streaming otomatis dari server. Tanpa install, tanpa takut mati sendiri. Setting 1x, live terus!',
    url: 'https://streamhib.com',
    siteName: 'StreamHib',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StreamHib - Tool Live Streaming 24/7 Tanpa Komputer',
    description: 'Live streaming otomatis dari server. Tanpa install, tanpa takut mati sendiri. Setting 1x, live terus!',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <LanguageProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar /> {/* <-- TAMBAHKAN NAVBAR DI SINI */}
            <main>
              {children}
            </main>
            <Footer /> {/* <-- TAMBAHKAN FOOTER DI SINI */}
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
