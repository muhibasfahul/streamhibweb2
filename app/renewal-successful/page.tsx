// Lokasi: app/renewal-successful/page.tsx

"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { CheckCircle, MessageSquare, Send } from "lucide-react";
import { useLanguage } from '@/hooks/use-language';

export default function RenewalSuccessPage() {
  const { language } = useLanguage();
  const [isAgreed, setIsAgreed] = useState(false);

  // --- Link Kontak (Teks WhatsApp disesuaikan untuk perpanjangan) ---
  const contactLinks = {
    whatsapp: "https://wa.me/6285722165165?text=Halo%20kak%2C%20saya%20sudah%20memperpanjang%20paket%20di%20StreamHib%2C%20bisa%20segera%20diperbarui%3F",
    telegram: "https://t.me/streamhib"
  };

  // --- Teks Terjemahan (Disesuaikan untuk perpanjangan) ---
  const translations = {
    id: {
      title: 'Perpanjangan Berhasil!',
      message: 'Terima kasih telah memperpanjang layanan Anda. Mohon setujui kembali Syarat & Ketentuan kami sebelum menghubungi tim untuk konfirmasi.',
      checkboxLabel: 'Saya telah membaca dan setuju dengan',
      termsLink: 'Syarat dan Ketentuan',
      buttonWhatsApp: 'Hubungi via WhatsApp',
      buttonTelegram: 'Hubungi via Telegram',
    },
    en: {
      title: 'Renewal Successful!',
      message: 'Thank you for renewing your service. Please re-agree to our Terms and Conditions before contacting our team for confirmation.',
      checkboxLabel: 'I have read and agree to the',
      termsLink: 'Terms and Conditions',
      buttonWhatsApp: 'Contact via WhatsApp',
      buttonTelegram: 'Contact via Telegram',
    },
  };

  const t = translations[language] || translations.id;

  return (
    <main className="flex items-center justify-center bg-gray-50 dark:bg-background px-4 py-24 sm:py-32">
      <div className="max-w-md w-full mx-auto text-center bg-white dark:bg-card shadow-lg rounded-xl p-8 space-y-6">
        
        <CheckCircle className="h-16 w-16 text-blue-500 mx-auto" />
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t.message}
          </p>
        </div>

        <div className="flex items-center justify-center space-x-2 pt-4">
          <input
            type="checkbox"
            id="terms-agreement"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
            className="h-4 w-4 accent-blue-600"
          />
          <label htmlFor="terms-agreement" className="text-sm text-gray-600 dark:text-gray-400">
            {t.checkboxLabel}{' '}
            <Link href="/terms" target="_blank" className="text-blue-600 hover:underline">
              {t.termsLink}
            </Link>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            onClick={() => window.open(contactLinks.whatsapp, '_blank')}
            disabled={!isAgreed}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 disabled:bg-gray-300 disabled:cursor-not-allowed"
            size="lg"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            {t.buttonWhatsApp}
          </Button>
          <Button
            onClick={() => window.open(contactLinks.telegram, '_blank')}
            disabled={!isAgreed}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 disabled:bg-gray-300 disabled:cursor-not-allowed"
            size="lg"
          >
            <Send className="w-5 h-5 mr-2" />
            {t.buttonTelegram}
          </Button>
        </div>

      </div>
    </main>
  );
};
