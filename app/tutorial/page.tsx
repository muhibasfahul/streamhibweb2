// Lokasi: app/tutorial/page.tsx

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/hooks/use-language';
import { Video } from 'lucide-react';

export default function TutorialPage() {
  const { language } = useLanguage();

  const tutorialsData = {
    id: {
      pageTitle: '🎥 Panduan Lengkap Penggunaan StreamHib',
      tutorials: [
        { title: 'Tutorial Download dari Google Drive', url: 'https://youtu.be/oF7ao3PS2sA' },
        { title: 'Tutorial Cara Live Manual YouTube', url: 'https://youtu.be/ggYNFEUrQWA' },
        { title: 'Tutorial Cara Live Facebook', url: 'https://youtu.be/GBMkHpmpGkg' },
        { title: 'Tutorial Cara Penjadwalan Live', url: 'https://youtu.be/5FfQbSuHw60' },
        { title: 'Tutorial Cara Live Lagi tanpa atur Stream Key', url: 'https://youtu.be/EIqYm9mbgsw' },
        { title: 'Tutorial Cara Buat Bitrate CBR di Filmora dan Capcut', url: 'https://youtu.be/3Fdl-OwKw8g' },
        { title: 'Tutorial Cara Live Vertikal', url: 'https://youtu.be/ZLdsNlTzOpA' },
        { title: 'Tutorial Menambah Live di 1 Channel', url: 'https://youtu.be/QLe_cFUHSO4' },
      ],
    },
    en: {
      pageTitle: '🎥 Comprehensive StreamHib Usage Guide',
      tutorials: [
        { title: 'Tutorial: Download from Google Drive', url: 'https://youtu.be/oF7ao3PS2sA' },
        { title: 'Tutorial: Live Streaming YouTube Channels Manually', url: 'https://youtu.be/ggYNFEUrQWA' },
        { title: 'Tutorial: Live Streaming on Facebook', url: 'https://youtu.be/GBMkHpmpGkg' },
        { title: 'Tutorial: Scheduling Live Streams', url: 'https://youtu.be/5FfQbSuHw60' },
        { title: 'Tutorial: Resume Live without Setting Stream Key', url: 'https://youtu.be/EIqYm9mbgsw' },
        { title: 'Tutorial: Create CBR Bitrate in Filmora and Capcut', url: 'https://youtu.be/3Fdl-OwKw8g' },
        { title: 'Tutorial: Vertical Live Streaming', url: 'https://youtu.be/ZLdsNlTzOpA' },
        { title: 'Tutorial: Add Multiple Lives to One Channel', url: 'https://youtu.be/QLe_cFUHSO4' },
      ],
    },
  };

  const t = tutorialsData[language] || tutorialsData.id;

  return (
    <main className="bg-gray-50 dark:bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">
              {t.pageTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {t.tutorials.map((tutorial, index) => (
                <a
                  key={index}
                  href={tutorial.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-white dark:bg-gray-900/50 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <Video className="w-6 h-6 text-blue-500 mr-4 flex-shrink-0" />
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {tutorial.title}
                  </span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
