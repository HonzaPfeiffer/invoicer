'use client';

import Link from 'next/link';
import { Invoice } from '@prisma/client';
import PDFDownloadButton from './PDFDownloadButton';
import { useSettings } from '@/contexts/SettingsContext';
import ClientOnly from './ClientOnly';
import { 
  ArrowLeftIcon,
  CalendarIcon,
  UserIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

interface InvoiceDetailClientProps {
  invoice: Invoice;
  items: { description: string; quantity: number; price: number }[];
}

function InvoiceDetailContent({ invoice, items }: InvoiceDetailClientProps) {
  const { t, formatCurrency } = useSettings();

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 fade-in">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <Link href="/">
            <button className="btn-glass p-2">
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black mb-1">{t('invoices.invoice')} {invoice.invoiceNumber}</h1>
            <p className="text-gray-500 text-sm sm:text-base">{t('invoices.details')}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`inline-block px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${
            invoice.status === 'PAID' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : invoice.status === 'SENT'
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              : 'bg-gray-500/20 text-gray-500 border border-gray-500/30'
          }`}>
            {t(`status.${invoice.status}`)}
          </span>
          <PDFDownloadButton invoice={invoice} />
        </div>
      </div>

      {/* Invoice Content */}
      <div className="glass-card p-6 sm:p-8 fade-in" style={{ animationDelay: '100ms' }}>
        {/* Client and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {/* Billed To */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <UserIcon className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-black">{t('invoice.billedTo')}</h2>
            </div>
            <div className="space-y-2">
              <p className="text-black font-medium">{invoice.clientName}</p>
              <div className="flex items-start space-x-2 text-gray-500 text-sm">
                <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{invoice.clientAddress}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-500 text-sm">
                <EnvelopeIcon className="w-4 h-4 flex-shrink-0" />
                <span>{invoice.clientEmail}</span>
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <CalendarIcon className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-black">{t('invoice.invoiceDetails')}</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">{t('invoice.issueDate')}</span>
                <span className="text-black text-sm">{new Date(invoice.issueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">{t('invoice.dueDate')}</span>
                <span className="text-black text-sm">{new Date(invoice.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">{t('invoice.totalAmount')}</span>
                <span className="text-black font-medium text-sm">{formatCurrency(invoice.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-3 sm:p-4 text-gray-500 font-medium text-sm">{t('invoice.description')}</th>
                <th className="text-right p-3 sm:p-4 text-gray-500 font-medium text-sm">{t('invoice.quantity')}</th>
                <th className="text-right p-3 sm:p-4 text-gray-500 font-medium text-sm">{t('invoice.price')}</th>
                <th className="text-right p-3 sm:p-4 text-gray-500 font-medium text-sm">{t('invoice.total')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b border-gray-800">
                  <td className="p-3 sm:p-4 text-gray-500 text-sm">{item.description}</td>
                  <td className="p-3 sm:p-4 text-gray-500 text-sm text-right">{item.quantity}</td>
                  <td className="p-3 sm:p-4 text-gray-500 text-sm text-right">{formatCurrency(item.price)}</td>
                  <td className="p-3 sm:p-4 text-black font-medium text-sm text-right">{formatCurrency(item.quantity * item.price)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="text-right font-bold p-3 sm:p-4 text-black text-sm">{t('invoice.grandTotal')}</td>
                <td className="text-right font-bold p-3 sm:p-4 text-lg text-purple-400">{formatCurrency(invoice.totalAmount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
}

export default function InvoiceDetailClient({ invoice, items }: InvoiceDetailClientProps) {
  return (
    <ClientOnly>
      <InvoiceDetailContent invoice={invoice} items={items} />
    </ClientOnly>
  );
}
