'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';
import { Invoice } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

interface PDFDownloadButtonProps {
  invoice: Invoice;
}

const PDFDownloadButton = ({ invoice }: PDFDownloadButtonProps) => {
  const [isClient, setIsClient] = useState(false);
  const { t, language } = useSettings();
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
        <button disabled className="bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed">
            {t('common.loading')}
        </button>
    );
  }

  return (
    <PDFDownloadLink
      document={<InvoicePDF invoice={invoice} currency={invoice.currency || 'USD'} language={language} />}
      fileName={`invoice-${invoice.invoiceNumber}.pdf`}
    >
      {({ loading }) => (
        <button disabled={loading} className={`px-4 py-2 text-white rounded-md transition-colors ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
          {loading ? t('invoices.generatingPdf') : t('invoices.downloadPdf')}
        </button>
      )}
    </PDFDownloadLink>
  );
};

export default PDFDownloadButton;
