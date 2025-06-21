"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Server, Users, Clock, Zap } from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/me', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user.status === 'active') {
          setUser(data.user);
        } else {
          window.location.href = '/';
        }
      } else {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Auth check error:', error);
      window.location.href = '/login';
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard StreamHib
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Selamat datang, {user.fullName}! Server Anda sedang dipersiapkan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status Server</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">Preparing</div>
              <p className="text-xs text-muted-foreground">
                Server sedang dipersiapkan
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paket Aktif</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.subscription || 'N/A'}</div>
              <p className="text-xs text-muted-foreground">
                Paket berlangganan Anda
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Live Sessions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Sesi live aktif
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0h</div>
              <p className="text-xs text-muted-foreground">
                Total waktu live
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Status Provisioning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Membuat Server</span>
                  <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Instalasi Software</span>
                  <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Konfigurasi</span>
                  <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Testing</span>
                  <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                </div>
              </div>
              <div className="mt-6">
                <div className="bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-1/4 transition-all duration-300"></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">25% Complete - Estimasi 5-10 menit</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informasi Akun</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Nama Lengkap</label>
                  <p className="text-sm">{user.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {user.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Paket</label>
                  <p className="text-sm font-semibold">{user.subscription}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Langkah Selanjutnya</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">Server Sedang Dipersiapkan</h3>
                  <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                    Tim kami sedang menyiapkan server khusus untuk Anda. Proses ini biasanya memakan waktu 5-10 menit.
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">Notifikasi Email</h3>
                  <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                    Anda akan menerima email dengan detail akses server dan panduan penggunaan setelah setup selesai.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 dark:text-green-100">Dukungan 24/7</h3>
                  <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                    Jika ada pertanyaan, tim support kami siap membantu melalui WhatsApp atau Telegram.
                  </p>
                  <div className="flex space-x-3 mt-3">
                    <Button size="sm" className="bg-green-500 hover:bg-green-600">
                      WhatsApp Support
                    </Button>
                    <Button size="sm" variant="outline">
                      Telegram Support
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}