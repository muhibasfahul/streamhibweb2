"use client";

import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2"
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium">{language === 'id' ? 'ID' : 'EN'}</span>
    </Button>
  );
}