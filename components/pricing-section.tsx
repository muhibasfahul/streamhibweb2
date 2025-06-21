"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Gift, Zap, CreditCard } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

const subscriptionLinks = {
  trial: "http://164.92.143.123:5000",
};

export function PricingSection() {
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const plans = [
    {
      id: 'starter',
      name: t('starterName'),
      price: "200k",
      period: "bulan",
      description: t('starterDesc'),
      features: t('starterFeatures'),
      popular: false,
      cta: t('selectPlan')
    },
    {
      id: 'pro',
      name: t('proName'),
      price: "250k",
      period: "bulan", 
      description: t('proDesc'),
      features: t('proFeatures'),
      popular: true,
      cta: t('selectPlan')
    },
    {
      id: 'business',
      name: t('businessName'),
      price: "350k",
      period: "bulan",
      description: t('businessDesc'),
      features: t('businessFeatures'),
      popular: false,
      cta: t('contactSales')
    }
  ];

  const handleSelectPackage = async (packageId) => {
    setIsProcessing(true);
    setSelectedPackage(packageId);

    try {
      // Check if user is logged in first
      const authResponse = await fetch('/api/auth/me', {
        credentials: 'include'
      });

      if (!authResponse.ok) {
        // User not logged in, redirect to register
        window.location.href = '/register';
        return;
      }

      const authData = await authResponse.json();
      if (!authData.success) {
        window.location.href = '/register';
        return;
      }

      // User is logged in, create payment
      const paymentResponse = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          packageType: packageId,
          userEmail: authData.user.email,
          userName: authData.user.fullName,
          userPhone: authData.user.phone
        })
      });

      const paymentData = await paymentResponse.json();

      if (paymentData.success) {
        // Load Midtrans Snap
        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', 'SB-Mid-client-YnXAE6VufDGa3w61');
        document.head.appendChild(script);

        script.onload = () => {
          window.snap.pay(paymentData.snapToken, {
            onSuccess: function(result) {
              console.log('Payment success:', result);
              window.location.href = '/payment-successful';
            },
            onPending: function(result) {
              console.log('Payment pending:', result);
              alert('Pembayaran sedang diproses. Silakan cek email untuk update status.');
            },
            onError: function(result) {
              console.log('Payment error:', result);
              alert('Terjadi kesalahan dalam pembayaran. Silakan coba lagi.');
            },
            onClose: function() {
              console.log('Payment popup closed');
            }
          });
        };
      } else {
        alert(paymentData.message || 'Gagal membuat pembayaran');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
      setSelectedPackage(null);
    }
  };

  return (
    <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('pricingTitle')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            {t('pricingDesc')}
          </p>
          
          {/* Special Offer Banner */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium mb-8">
            <Gift className="w-5 h-5 mr-2" />
            {t('specialOffer')}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-blue-500 shadow-xl scale-105' : 'shadow-md'} hover:shadow-lg transition-all duration-300`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    {t('mostPopular')}
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  {plan.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    Rp{plan.price}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">/{plan.period}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                  {plan.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {Array.isArray(plan.features) && plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full py-3 font-semibold ${
                    plan.popular 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                      : 'bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
                  }`}
                  size="lg"
                  onClick={() => handleSelectPackage(plan.id)}
                  disabled={isProcessing && selectedPackage === plan.id}
                >
                  {isProcessing && selectedPackage === plan.id ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Memproses...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      {plan.cta}
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-center space-x-3">
              <Zap className="w-6 h-6 text-yellow-500" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {t('startingFrom')}
              </span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Gift className="w-6 h-6 text-green-500" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {t('freeTrialNoCard')}
              </span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Check className="w-6 h-6 text-blue-500" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {t('activeIn5Min')}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button 
              size="lg" 
              className="bg-red-500 hover:bg-red-600 text-white px-12 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 mr-4"
              onClick={() => window.open(subscriptionLinks.trial, '_blank')}
            >
              {t('tryFreeNow')}
            </Button>
            <Button 
              size="lg" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-12 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => window.location.href = '/register'}
            >
              {t('startLiveToday')}
            </Button>
          </div>
          
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
            {t('setupNote')}
          </p>
        </div>
      </div>
    </section>
  );
}