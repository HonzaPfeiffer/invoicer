'use client';

import Link from 'next/link';
import type { Invoice } from '@prisma/client';
import { useSettings } from '@/contexts/SettingsContext';
import ClientOnly from './ClientOnly';

interface InvoicesClientProps {
  invoices: Invoice[];
}

function InvoicesContent({ invoices }: InvoicesClientProps) {
  const { t, language } = useSettings();

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('invoices.title')}</h1>
          <p className="text-gray-600 mt-1">{t('invoices.subtitle')}</p>
        </div>
        <Link href="/invoices/new">
          <button className="mt-4 sm:mt-0 w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
            {t('invoices.create')}
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t('invoices.invoice')}</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t('invoices.client')}</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t('invoices.amount')}</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t('invoices.status')}</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">{t('invoices.date')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map((invoice: Invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/invoices/${invoice.id}`} className="text-indigo-600 hover:text-indigo-900 font-medium">
                        {invoice.invoiceNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{invoice.clientName}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {new Intl.NumberFormat(language === 'cs' ? 'cs-CZ' : 'en-US', {
                        style: 'currency',
                        currency: invoice.currency || 'USD'
                      }).format(invoice.totalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        invoice.status === 'PAID' 
                          ? 'bg-green-100 text-green-800' 
                          : invoice.status === 'SENT'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {t(`status.${invoice.status}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('invoices.noInvoices')}</h3>
            <p className="text-gray-500 mb-6">{t('invoices.noInvoicesDesc')}</p>
            <Link href="/invoices/new">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                {t('invoices.createFirst')}
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default function InvoicesClient({ invoices }: InvoicesClientProps) {
  return (
    <ClientOnly>
      <InvoicesContent invoices={invoices} />
    </ClientOnly>
  );
}
