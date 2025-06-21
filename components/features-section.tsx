"use client";

import { Card, CardContent } from '@/components/ui/card';
import { 
  Server, 
  Smartphone, 
  Shield, 
  Clock, 
  Music, 
  MousePointer 
} from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export function FeaturesSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Server,
      title: t('serverFeature'),
      description: t('serverFeatureDesc')
    },
    {
      icon: Smartphone,
      title: t('controlFeature'),
      description: t('controlFeatureDesc')
    },
    {
      icon: Shield,
      title: t('reliableFeature'),
      description: t('reliableFeatureDesc')
    },
    {
      icon: Clock,
      title: t('scheduleFeature'),
      description: t('scheduleFeatureDesc')
    },
    {
      icon: Music,
      title: t('contentFeature'),
      description: t('contentFeatureDesc')
    },
    {
      icon: MousePointer,
      title: t('easyFeature'),
      description: t('easyFeatureDesc')
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('featuresTitle')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('featuresDescription')}
            <span className="font-semibold text-gray-900 dark:text-white"> {t('featuresDescriptionBold')}</span>
            {' '}{t('featuresDescriptionContinue')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:shadow-xl hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Visual Demo Section */}
        <div className="mt-20">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 lg:p-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('howToUseTitle')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('howToUseDesc')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('step1')}</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {t('step1Desc')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('step2')}</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {t('step2Desc')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('step3')}</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {t('step3Desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}