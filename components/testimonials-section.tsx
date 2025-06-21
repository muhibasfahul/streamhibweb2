"use client";

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

const testimonials = [
  {
    name: "Lisa P.",
    avatar: "/avatars/lisa.jpg",
    channel: "Relaxing Music ID",
    content: {
      id: "Udah 1 bulan live nonstop, gila sih! Dulu pakai komputer sendiri, 2 hari udah overheat. Sekarang tenang banget, tinggal cek dari HP doang.",
      en: "Been live nonstop for 1 month, crazy! Used to use my own computer, overheated in 2 days. Now so relaxed, just check from phone."
    },
    rating: 5,
    duration: {
      id: "1 bulan live",
      en: "1 month live"
    }
  },
  {
    name: "Maya R.",
    avatar: "/avatars/maya.jpg",
    channel: "ASMR Hujan",
    content: {
      id: "Pernah pakai yang lain, 3 hari mati. Pindah ke StreamHib, udah 2 minggu lancar jaya! Channel ASMR gue sekarang live 24/7 tanpa drama.",
      en: "Used others before, died in 3 days. Switched to StreamHib, been smooth for 2 weeks! My ASMR channel now live 24/7 without drama."
    },
    rating: 5,
    duration: {
      id: "2 minggu live",
      en: "2 weeks live"
    }
  },
  {
    name: "Budi T.",
    avatar: "/avatars/budi.jpg",
    channel: "Lo-Fi Beats",
    content: {
      id: "Cuma modal HP dan dashboard ini, live terus jalan. Subscriber naik terus karena selalu ada konten. ROI-nya gila!",
      en: "Just with phone and this dashboard, live keeps running. Subscribers keep growing because there's always content. ROI is crazy!"
    },
    rating: 5,
    duration: {
      id: "3 minggu live",
      en: "3 weeks live"
    }
  },
  {
    name: "Sari K.",
    avatar: "/avatars/sari.jpg",
    channel: "Nature Sounds",
    content: {
      id: "Sebagai content creator yang sibuk kerja, StreamHib life saver banget. Set jadwal sekali, live otomatis jalan pas jam prime time.",
      en: "As a busy working content creator, StreamHib is a life saver. Set schedule once, live automatically runs during prime time."
    },
    rating: 5,
    duration: {
      id: "2 minggu live",
      en: "2 weeks live"
    }
  },
  {
    name: "Doni P.",
    avatar: "/avatars/doni.jpg",
    channel: "Chill Vibes",
    content: {
      id: "Server stabil parah, dashboard gampang banget dipahami. Yang paling penting, live streaming gak pernah putus-putus lagi.",
      en: "Server is super stable, dashboard is very easy to understand. Most importantly, live streaming never cuts out anymore."
    },
    rating: 5,
    duration: {
      id: "1 minggu live",
      en: "1 week live"
    }
  },
  {
    name: "Khoirun Nisa",
    avatar: "/avatars/nisa.png",
    channel: "Study Music",
    content: {
      id: "Perfect banget buat channel musik study. Viewers selalu ada karena live 24/7. Engagement naik 300% sejak pakai StreamHib!",
      en: "Perfect for study music channel. Always have viewers because live 24/7. Engagement increased 300% since using StreamHib!"
    },
    rating: 5,
    duration: {
      id: "3 minggu live",
      en: "3 weeks live"
    }
  }
];

export function TestimonialsSection() {
  const { t, language } = useLanguage();

  return (
    <section id="testimonials" className="py-20 bg-white dark:bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 font-medium mb-4">
            <Star className="w-4 h-4 mr-2 fill-current" />
            {t('trustedBy')}
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('testimonialsTitle')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('testimonialsDesc')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:shadow-xl hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {testimonial.duration[language]}
                  </span>
                </div>
                
                <div className="relative mb-4">
                  <Quote className="absolute -top-2 -left-2 w-6 h-6 text-blue-500 opacity-20" />
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-4">
                    "{testimonial.content[language]}"
                  </p>
                </div>
                
                <div className="flex items-center">
                  <Image
    src={testimonial.avatar}
    alt={`Avatar of ${testimonial.name}`}
    width={40}
    height={40}
    className="w-10 h-10 rounded-full object-cover"
  />
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {testimonial.name}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      {testimonial.channel}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-500 to-red-500 rounded-2xl p-8 text-white">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">100+</div>
              <div className="text-blue-100">{t('activeChannelsCount')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">{t('serverUptime')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">{t('monitoring247')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">5000+</div>
              <div className="text-blue-100">{t('totalLiveHours')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
