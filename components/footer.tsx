"use client";

import Image from 'next/image';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { useLanguage } from '@/hooks/use-language';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Image
              src="/streamhiblandscapetrnsprant.png"
              alt="StreamHib Logo"
              width={150}
              height={40}
              className="h-8 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-gray-300 mb-4 leading-relaxed">
              {t('footerDesc')}
            </p>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-300 hover:text-white transition-colors">{t('features')}</a></li>
              <li><a href="#pricing" className="text-gray-300 hover:text-white transition-colors">{t('pricing')}</a></li>
              <li><a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">{t('testimonials')}</a></li>
              <li><a href="#faq" className="text-gray-300 hover:text-white transition-colors">{t('faq')}</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('support')}</h3>
            <ul className="space-y-2">
              <li><a href="mailto:support@streamhib.com" className="text-gray-300 hover:text-white transition-colors">{t('emailSupport')}</a></li>
              <li><a href="https://wa.me/6285722165165" className="text-gray-300 hover:text-white transition-colors">{t('whatsappSupport')}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            {t('allRightsReserved')}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">{t('privacyPolicy')}</a>
            <a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">{t('termsOfService')}</a>
            <a href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">{t('cookiePolicy')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
