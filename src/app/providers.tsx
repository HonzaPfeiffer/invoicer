'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { SettingsProvider } from '@/contexts/SettingsContext';

interface Props {
    children: ReactNode;
}

const Providers = ({ children }: Props) => {
    return (
        <SessionProvider>
            <SettingsProvider>
                {children}
            </SettingsProvider>
        </SessionProvider>
    );
};

export default Providers;
