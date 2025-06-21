// Lokasi: app/terms/page.tsx

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/hooks/use-language';

export default function TermsOfServicePage() {
  const { language } = useLanguage();

  const translations = {
    id: {
      pageTitle: "Syarat dan Ketentuan",
      lastUpdated: "Terakhir diperbarui: 13 Juni 2025",
      sections: [
        {
          title: "1. Penerimaan Persyaratan",
          content: "Dengan mendaftar dan menggunakan layanan StreamHib ('Layanan'), Anda mengakui bahwa Anda telah membaca, memahami, dan setuju untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak menyetujui bagian mana pun dari persyaratan ini, Anda tidak diizinkan untuk menggunakan Layanan kami."
        },
        {
          title: "2. Penggunaan Layanan dan Konten",
          content: "Anda setuju untuk tidak menggunakan Layanan untuk menyiarkan, mendistribusikan, atau menyimpan materi yang melanggar hukum yang berlaku, termasuk namun tidak terbatas pada konten yang melanggar hak cipta, mengandung unsur perjudian, pornografi, ujaran kebencian, atau aktivitas ilegal lainnya. Anda bertanggung jawab penuh atas semua konten yang Anda siarkan."
        },
        {
          title: "3. Akun dan Keamanan",
          content: "Anda bertanggung jawab untuk menjaga kerahasiaan informasi akun Anda, termasuk kata sandi. Semua aktivitas yang terjadi di bawah akun Anda adalah tanggung jawab Anda sepenuhnya. Segera beri tahu kami jika ada dugaan penggunaan akun tanpa izin."
        },
        {
          title: "4. Penghentian dan Penangguhan Layanan",
          content: "StreamHib berhak, tanpa pemberitahuan sebelumnya, untuk menangguhkan atau menghentikan akses Anda ke Layanan jika kami menemukan adanya pelanggaran terhadap Syarat dan Ketentuan ini. StreamHib tidak bertanggung jawab atas kehilangan data atau kerugian lain yang mungkin timbul dari penghentian layanan."
        },
        {
          title: "5. Hukum yang Mengatur",
          content: "Syarat dan Ketentuan ini diatur dan ditafsirkan sesuai dengan hukum yang berlaku di Republik Indonesia."
        }
      ]
    },
    en: {
      pageTitle: "Terms of Service",
      lastUpdated: "Last updated: June 13, 2025",
      sections: [
        {
          title: "1. Acceptance of Terms",
          content: "By registering for and using the StreamHib services ('Service'), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are not permitted to use our Service."
        },
        {
          title: "2. Use of Service and Content",
          content: "You agree not to use the Service to broadcast, distribute, or store material that violates applicable law, including but not limited to content that infringes copyright, contains gambling elements, pornography, hate speech, or other illegal activities. You are solely responsible for all content you broadcast."
        },
        {
          title: "3. Account and Security",
          content: "You are responsible for maintaining the confidentiality of your account information, including your password. All activities that occur under your account are your sole responsibility. Notify us immediately of any suspected unauthorized use of your account."
        },
        {
          title: "4. Termination and Suspension of Service",
          content: "StreamHib reserves the right, without prior notice, to suspend or terminate your access to the Service if we find any violation of these Terms of Service. StreamHib is not liable for any data loss or other damages that may arise from the termination of service."
        },
        {
          title: "5. Governing Law",
          content: "These Terms of Service are governed by and construed in accordance with the laws of the Republic of Indonesia."
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
