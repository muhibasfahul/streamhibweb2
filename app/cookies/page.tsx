// Lokasi: app/cookies/page.tsx

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/hooks/use-language';

export default function CookiesPolicyPage() {
  const { language } = useLanguage();

  const translations = {
    id: {
      pageTitle: "Kebijakan Cookies",
      lastUpdated: "Terakhir diperbarui: 13 Juni 2025",
      sections: [
        {
          title: "1. Apa itu Cookies?",
          content: "Cookies adalah file teks kecil yang disimpan di perangkat Anda (komputer, tablet, atau ponsel) saat Anda mengunjungi sebuah situs web. Cookies membantu situs web mengenali perangkat Anda dan mengingat informasi tentang preferensi atau kunjungan Anda sebelumnya."
        },
        {
          title: "2. Bagaimana Kami Menggunakan Cookies",
          content: "StreamHib menggunakan cookies untuk beberapa tujuan penting: (a) Cookies Fungsional: Untuk mengingat preferensi Anda, seperti pilihan bahasa, sehingga Anda tidak perlu mengaturnya setiap kali berkunjung. (b) Cookies Analitik: Untuk memahami bagaimana pengunjung berinteraksi dengan situs kami, halaman mana yang populer, dan untuk meningkatkan layanan kami. (c) Cookies Keamanan: Untuk membantu mendeteksi dan mencegah risiko keamanan."
        },
        {
          title: "3. Jenis Cookies yang Kami Gunakan",
          content: "Kami menggunakan 'Session Cookies' (yang akan terhapus setelah Anda menutup browser) dan 'Persistent Cookies' (yang tetap ada di perangkat Anda untuk periode tertentu) untuk fungsionalitas seperti mengingat status login atau preferensi bahasa Anda."
        },
        {
          title: "4. Kontrol Anda",
          content: "Anda memiliki kendali penuh atas cookies. Sebagian besar browser web memungkinkan Anda untuk melihat, mengelola, dan menghapus cookies melalui menu pengaturan. Namun, perlu diketahui bahwa menonaktifkan cookies fungsional dapat memengaruhi pengalaman Anda saat menggunakan situs kami."
        }
      ]
    },
    en: {
      pageTitle: "Cookies Policy",
      lastUpdated: "Last updated: June 13, 2025",
      sections: [
        {
          title: "1. What Are Cookies?",
          content: "Cookies are small text files stored on your device (computer, tablet, or mobile phone) when you visit a website. Cookies help websites recognize your device and remember information about your preferences or past visits."
        },
        {
          title: "2. How We Use Cookies",
          content: "StreamHib uses cookies for several important purposes: (a) Functional Cookies: To remember your preferences, such as your language choice, so you don't have to set it on each visit. (b) Analytical Cookies: To understand how visitors interact with our site, which pages are popular, and to improve our services. (c) Security Cookies: To help detect and prevent security risks."
        },
        {
          title: "3. Types of Cookies We Use",
          content: "We use both 'Session Cookies' (which are deleted after you close your browser) and 'Persistent Cookies' (which remain on your device for a set period) for functionality like remembering your login status or language preferences."
        },
        {
          title: "4. Your Control",
          content: "You have full control over cookies. Most web browsers allow you to view, manage, and delete cookies through their settings menu. However, please be aware that disabling functional cookies may affect your experience while using our site."
        }
      ]
    }
  };

  const t = translations[language] || translations.id;

  return (
    <main className="bg-gray-50 dark:bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">
              {t.pageTitle}
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 pt-1">
              {t.lastUpdated}
            </p>
          </CardHeader>
          <CardContent className="prose prose-lg dark:prose-invert max-w-none">
            {t.sections.map((section, index) => (
              <div key={index} className="space-y-2 not-prose">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white pt-4">
                  {section.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
