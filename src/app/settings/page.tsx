'use client';

import { redirect } from 'next/navigation';
import Navigation from '../components/Navigation';
import { useSettings } from '@/contexts/SettingsContext';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ClientOnly from '../components/ClientOnly';
import { currencies } from '@/lib/currencies';
import LogoutButton from '../components/LogoutButton';
import CompanySearch from '../components/CompanySearch';

function SettingsContent({ session }: { session: any }) {
  const { language, currency, setLanguage, setCurrency, t } = useSettings();
  const [showSaved, setShowSaved] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyIco, setCompanyIco] = useState('');
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);
  const [isSavingCompany, setIsSavingCompany] = useState(false);

  useEffect(() => {
    const loadCompanyInfo = async () => {
      try {
        const response = await fetch('/api/user/company');
        if (response.ok) {
          const data = await response.json();
          setCompanyName(data.companyName || '');
          setCompanyAddress(data.companyAddress || '');
          setCompanyIco(data.companyIco || '');
        }
      } catch (error) {
        console.error('Error loading company info:', error);
      } finally {
        setIsLoadingCompany(false);
      }
    };

    loadCompanyInfo();
  }, []);

  const handleSave = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const handleSaveCompany = async () => {
    setIsSavingCompany(true);
    try {
      const response = await fetch('/api/user/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          companyAddress,
          companyIco,
        }),
      });

      if (response.ok) {
        handleSave();
      }
    } catch (error) {
      console.error('Error saving company info:', error);
    } finally {
      setIsSavingCompany(false);
    }
  };

  const handleCompanySelect = (company: { ico: string; name: string; address: string }) => {
    setCompanyName(company.name);
    setCompanyAddress(company.address);
    setCompanyIco(company.ico);
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
            {/* Company Information */}
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{t('company.title')}</h2>
                <p className="text-sm text-gray-500 mt-1">{t('company.description')}</p>
              </div>

              {isLoadingCompany ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      {t('company.searchByAres')}
                    </label>
                    <CompanySearch
                      onSelect={handleCompanySelect}
                      placeholder={t('company.searchPlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      {t('company.name')}
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder={t('company.namePlaceholder')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      {t('company.address')}
                    </label>
                    <textarea
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      placeholder={t('company.addressPlaceholder')}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      {t('company.ico')}
                    </label>
                    <input
                      type="text"
                      value={companyIco}
                      onChange={(e) => setCompanyIco(e.target.value)}
                      placeholder={t('company.icoPlaceholder')}
                      maxLength={8}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    onClick={handleSaveCompany}
                    disabled={isSavingCompany}
                    className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingCompany ? t('common.loading') : t('common.save')}
                  </button>
                </div>
              )}
            </div>

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

            {/* Account Settings */}
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{t('settings.account')}</h2>
                <p className="text-sm text-gray-500 mt-1">{t('settings.accountDesc')}</p>
              </div>
              
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm font-medium text-gray-900 mb-1">{session?.user?.name}</p>
                  <p className="text-xs text-gray-500">{session?.user?.email}</p>
                </div>
                
                <LogoutButton />
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
