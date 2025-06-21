"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from '@/hooks/use-language';

const faqs = {
  id: [
    {
      question: "Apa harus install software atau aplikasi?",
      answer: "Gak perlu install apa-apa! StreamHib berbasis web, bisa dibuka dari HP atau laptop. Cukup buka browser, login ke dashboard, dan kamu udah bisa kontrol live streaming dari mana aja."
    },
    {
      question: "Gimana kalau internet rumah gue mati?",
      answer: "Santai aja! Live streaming jalan di server kami, bukan di perangkat kamu. Jadi meskipun internet kamu mati, live streaming tetap jalan normal. Kamu cuma butuh internet buat akses dashboard kontrol."
    },
    {
      question: "Bisa set jadwal live otomatis gak?",
      answer: "Bisa banget! Tinggal atur jamnya di dashboard, terus sistem kami otomatis mulai/stop live sesuai jadwal. Kamu bisa set jadwal harian, mingguan, atau custom sesuai kebutuhan."
    },
    {
      question: "Video bisa di-loop terus gak?",
      answer: "Bisa dong! Kamu upload 1 video, bakal terus diputar selama live aktif. Perfect banget buat konten kayak musik relaksasi, ASMR, suara hujan, atau video ambient lainnya."
    },
    {
      question: "Kualitas streaming gimana? Bisa HD?",
      answer: "Server kami support streaming sampai 4K dengan bitrate stabil. Kualitas bakal otomatis menyesuaikan dengan koneksi viewer buat pengalaman terbaik."
    },
    {
      question: "Ada batasan durasi live gak?",
      answer: "Gak ada batasan! Kamu bisa live 24/7 selama langganan masih aktif. Server kami didesain khusus buat live streaming jangka panjang tanpa gangguan."
    },
    {
      question: "Cara upload video gimana?",
      answer: "Gampang banget! Login ke dashboard, klik 'Upload Video', pilih file dari perangkat kamu, tunggu proses upload selesai, terus video siap buat di-streaming."
    },
    {
      question: "Bisa streaming ke beberapa platform sekaligus?",
      answer: "Bisa! Kamu bisa streaming simultan ke YouTube dan Facebook dari satu dashboard. Fitur ini tersedia di semua paket."
    },
    {
      question: "Kalau ada masalah, support-nya gimana?",
      answer: "Kami sediain support email untuk semua paket. Tim support kami siap bantu kapan aja dengan respon cepat."
    },
    {
      question: "Data dan video gue aman gak?",
      answer: "Pasti aman! Kami pakai enkripsi SSL, backup otomatis, dan server yang memenuhi standar keamanan internasional. Video dan data kamu terlindungi dengan baik."
    }
  ],
  en: [
    {
      question: "Do I need to install software or applications?",
      answer: "No need to install anything! StreamHib is web-based, can be opened from phone or laptop. Just open browser, login to dashboard, and you can control live streaming from anywhere."
    },
    {
      question: "What if my home internet dies?",
      answer: "No worries! Live streaming runs on our server, not on your device. So even if your internet dies, live streaming continues normally. You only need internet to access the control dashboard."
    },
    {
      question: "Can I set automatic live schedule?",
      answer: "Absolutely! Just set the time in dashboard, then our system automatically starts/stops live according to schedule. You can set daily, weekly, or custom schedule as needed."
    },
    {
      question: "Can videos be looped continuously?",
      answer: "Of course! You upload 1 video, it will keep playing while live is active. Perfect for content like relaxing music, ASMR, rain sounds, or other ambient videos."
    },
    {
      question: "How's the streaming quality? Can it be HD?",
      answer: "Our server supports streaming up to 4K with stable bitrate. Quality will automatically adjust to viewer's connection for the best experience."
    },
    {
      question: "Is there a live duration limit?",
      answer: "No limits! You can live 24/7 as long as subscription is active. Our server is specifically designed for long-term live streaming without interruption."
    },
    {
      question: "How to upload videos?",
      answer: "Super easy! Login to dashboard, click 'Upload Video', select file from your device, wait for upload process to complete, then video is ready for streaming."
    },
    {
      question: "Can I stream to multiple platforms simultaneously?",
      answer: "Yes! You can stream simultaneously to YouTube and Facebook from one dashboard. This feature is available in all packages."
    },
    {
      question: "If there are problems, how's the support?",
      answer: "We provide email support for all packages. Our support team is ready to help anytime with fast response."
    },
    {
      question: "Are my data and videos safe?",
      answer: "Absolutely safe! We use SSL encryption, automatic backup, and servers that meet international security standards. Your videos and data are well protected."
    }
  ]
};

export function FAQSection() {
  const { t, language } = useLanguage();

  return (
    <section id="faq" className="py-20 bg-white dark:bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('faqTitle')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('faqDesc')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs[language].map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-gray-200 dark:border-gray-700 rounded-lg px-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <AccordionTrigger className="text-left font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Support */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-red-50 dark:from-blue-950/20 dark:to-red-950/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('stillHaveQuestions')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('supportDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@streamhib.com" 
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-300"
              >
                {t('emailSupport')}
              </a>
              <a 
                href="https://wa.me/6285722165165" 
                className="inline-flex items-center justify-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-300"
              >
                {t('whatsappSupport')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
