// Lokasi: app/privacy/page.tsx

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/hooks/use-language';

export default function PrivacyPolicyPage() {
  const { language } = useLanguage();

  const translations = {
    id: {
      pageTitle: "Kebijakan Privasi",
      lastUpdated: "Terakhir diperbarui: 13 Juni 2025",
      sections: [
        {
          title: "1. Pendahuluan",
          content: "Kebijakan Privasi ini menjelaskan bagaimana StreamHib ('kami') mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat Anda menggunakan layanan kami. Privasi Anda sangat penting bagi kami."
        },
        {
          title: "2. Informasi yang Kami Kumpulkan",
          content: "Kami mengumpulkan informasi yang Anda berikan secara langsung, seperti nama, alamat email, dan informasi kontak saat Anda mendaftar. Kami juga dapat mengumpulkan data teknis secara otomatis, termasuk alamat IP, jenis browser, dan data penggunaan layanan untuk tujuan analitik dan keamanan."
        },
        {
          title: "3. Bagaimana Kami Menggunakan Informasi Anda",
          content: "Informasi Anda digunakan untuk: (a) Menyediakan, mengoperasikan, dan memelihara Layanan kami; (b) Memproses transaksi dan mengirimkan konfirmasi; (c) Berkomunikasi dengan Anda, termasuk untuk dukungan pelanggan dan pemberitahuan layanan; (d) Mencegah aktivitas penipuan dan pelanggaran hukum."
        },
        {
          title: "4. Berbagi dan Pengungkapan Informasi",
          content: "Kami tidak menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga. Kami hanya dapat membagikan informasi Anda kepada pihak ketiga jika diwajibkan oleh hukum, perintah pengadilan, atau untuk melindungi hak, properti, dan keamanan kami atau pengguna lain."
        },
        {
          title: "5. Keamanan Data",
          content: "Kami mengambil langkah-langkah keamanan yang wajar secara teknis dan administratif untuk melindungi informasi pribadi Anda dari kehilangan, pencurian, penyalahgunaan, serta akses, pengungkapan, perubahan, dan perusakan yang tidak sah."
        }
      ]
    },
    en: {
      pageTitle: "Privacy Policy",
      lastUpdated: "Last updated: June 13, 2025",
      sections: [
        {
          title: "1. Introduction",
          content: "This Privacy Policy explains how StreamHib ('we', 'us') collects, uses, and protects your personal information when you use our services. Your privacy is critically important to us."
        },
        {
          title: "2. Information We Collect",
          content: "We collect information you provide directly to us, such as your name, email address, and contact information upon registration. We may also automatically collect technical data, including IP address, browser type, and service usage data for analytics and security purposes."
        },
        {
          title: "3. How We Use Your Information",
          content: "Your information is used to: (a) Provide, operate, and maintain our Services; (b) Process transactions and send related information; (c) Communicate with you, including for customer support and service notifications; (d) Prevent fraudulent activities and legal violations."
        },
        {
          title: "4. Information Sharing and Disclosure",
          content: "We do not sell or rent your personal information to third parties. We may only share your information with third parties if required by law, court order, or to protect the rights, property, and safety of ourselves or others."
        },
        {
          title: "5. Data Security",
          content: "We take reasonable technical and administrative security measures to protect your personal information from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction."
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
