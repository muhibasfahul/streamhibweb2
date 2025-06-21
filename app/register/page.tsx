"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from '@/hooks/use-language';
import { Eye, EyeOff, User, Mail, Phone, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nama lengkap wajib diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone || null,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to pricing page to select package
        window.location.href = '/#pricing';
      } else {
        setErrors({ submit: data.message || 'Registrasi gagal' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: 'Terjadi kesalahan. Silakan coba lagi.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Link>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Daftar StreamHib
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Mulai live streaming 24/7 tanpa ribet
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nama Lengkap *
                </Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`pl-10 ${errors.fullName ? 'border-red-500' : ''}`}
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email *
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="nama@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nomor WhatsApp (Opsional)
                </Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-10"
                    placeholder="08123456789"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password *
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Minimal 6 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Konfirmasi Password *
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="Ulangi password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {errors.submit && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                  <p className="text-red-600 dark:text-red-400 text-sm">{errors.submit}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 text-base"
              >
                {isLoading ? 'Mendaftar...' : 'Daftar Sekarang'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sudah punya akun?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  Login di sini
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Dengan mendaftar, Anda menyetujui{' '}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Syarat & Ketentuan
                </Link>{' '}
                dan{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Kebijakan Privasi
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}