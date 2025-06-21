"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from '@/hooks/use-language';
import { Eye, EyeOff, Mail, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // Check user status and redirect accordingly
        if (data.user.status === 'pending_payment') {
          window.location.href = '/#pricing';
        } else if (data.user.status === 'active') {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/';
        }
      } else {
        setErrors({ submit: data.message || 'Login gagal' });
      }
    } catch (error) {
      console.error('Login error:', error);
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
              Login StreamHib
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Masuk ke akun Anda
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
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
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Masukkan password"
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

              {errors.submit && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                  <p className="text-red-600 dark:text-red-400 text-sm">{errors.submit}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 text-base"
              >
                {isLoading ? 'Masuk...' : 'Masuk'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Belum punya akun?{' '}
                <Link href="/register" className="text-red-600 hover:text-red-500 font-medium">
                  Daftar di sini
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}