'use client';

import { redirect } from 'next/navigation';
import Navigation from '../components/Navigation';
import { useSettings } from '@/contexts/SettingsContext';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import ClientOnly from '../components/ClientOnly';
import { currencies } from '@/lib/currencies';

function SettingsContent({ session }: { session: any }) {
  const { language, currency, setLanguage, setCurrency, t } = useSettings();
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation session={session} />
      
      <div className="lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{t('settings.title')}</h1>
            <p className="text-gray-600 mt-1">{t('settings.subtitle')}</p>
          </div>

          {showSaved && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
              {t('settings.changesSaved')}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
            {/* Language Setting */}
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{t('settings.language')}</h2>
                <p className="text-sm text-gray-500 mt-1">{t('settings.languageDesc')}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setLanguage('en');
                    handleSave();
                  }}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    language === 'en'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="font-medium text-gray-900">English</div>
                      <div className="text-sm text-gray-500">English (US)</div>
                    </div>
                    {language === 'en' && (
                      <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => {
                    setLanguage('cs');
                    handleSave();
                  }}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    language === 'cs'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Čeština</div>
                      <div className="text-sm text-gray-500">Czech</div>
                    </div>
                    {language === 'cs' && (
                      <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Currency Setting */}
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{t('settings.currency')}</h2>
                <p className="text-sm text-gray-500 mt-1">{t('settings.currencyDesc')}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {currencies.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => {
                      setCurrency(curr.code as any);
                      handleSave();
                    }}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      currency === curr.code
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{curr.code}</div>
                        <div className="text-sm text-gray-500">{curr.name}</div>
                      </div>
                      {currency === curr.code && (
                        <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!session) {
    redirect('/login');
  }

  return (
    <ClientOnly>
      <SettingsContent session={session} />
    </ClientOnly>
  );
}
