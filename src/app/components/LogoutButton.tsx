'use client';

import { signOut } from 'next-auth/react';
import { useSettings } from '@/contexts/SettingsContext';

export default function LogoutButton() {
  const { t } = useSettings();
  
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="w-full px-4 py-3 font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
    >
      {t('settings.logout')}
    </button>
  );
}
