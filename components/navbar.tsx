"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Menu, X, User } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/streamhiblandscapetrnsprant.png"
                alt="StreamHib Logo"
                width={150}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/tutorial" className="text-sm font-medium hover:text-primary transition-colors">
              Tutorial
            </a>
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              {t('features')}
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              {t('pricing')}
            </a>
            <a href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              {t('testimonials')}
            </a>
            <a href="#faq" className="text-sm font-medium hover:text-primary transition-colors">
              {t('faq')}
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            <ThemeToggle />
            
            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="w-4 h-4" />
                      <span className="text-gray-600 dark:text-gray-300">{user.fullName}</span>
                    </div>
                    {user.status === 'active' && (
                      <Link href="/dashboard">
                        <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                          Dashboard
                        </Button>
                      </Link>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleLogout}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link href="/login">
                      <Button size="sm" variant="outline">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 font-semibold">
                        {t('startNow')}
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <a href="/tutorial" className="block px-3 py-2 text-sm font-medium hover:text-primary transition-colors">
                Tutorial
              </a>
              <a href="#features" className="block px-3 py-2 text-sm font-medium hover:text-primary transition-colors">
                {t('features')}
              </a>
              <a href="#pricing" className="block px-3 py-2 text-sm font-medium hover:text-primary transition-colors">
                {t('pricing')}
              </a>
              <a href="#testimonials" className="block px-3 py-2 text-sm font-medium hover:text-primary transition-colors">
                {t('testimonials')}
              </a>
              <a href="#faq" className="block px-3 py-2 text-sm font-medium hover:text-primary transition-colors">
                {t('faq')}
              </a>
              
              {!isLoading && (
                <div className="px-3 py-2 space-y-2">
                  {user ? (
                    <>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Halo, {user.fullName}
                      </div>
                      {user.status === 'active' && (
                        <Link href="/dashboard">
                          <Button size="sm" className="w-full bg-green-500 hover:bg-green-600 text-white">
                            Dashboard
                          </Button>
                        </Link>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={handleLogout}
                        className="w-full text-red-600 border-red-600"
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <Button size="sm" variant="outline" className="w-full">
                          Login
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button size="sm" className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold">
                          {t('startNow')}
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}