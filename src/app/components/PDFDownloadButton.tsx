'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';
import { Invoice } from '@prisma/client';
import { useEffect, useState } from 'react';

interface PDFDownloadButtonProps {
  invoice: Invoice;
}

const PDFDownloadButton = ({ invoice }: PDFDownloadButtonProps) => {
  // This is a workaround to prevent Next.js from trying to render this component on the server.
  // `@react-pdf/renderer` is client-side only.
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
        <button disabled className="bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed">
            Loading...
        </button>
    );
  }

  return (
    <PDFDownloadLink
      document={<InvoicePDF invoice={invoice} />}
      fileName={`invoice-${invoice.invoiceNumber}.pdf`}
    >
      {({ loading }) => (
        <button disabled={loading} className={`px-4 py-2 text-white rounded-md transition-colors ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
          {loading ? 'Generating PDF...' : 'Download PDF'}
        </button>
      )}
    </PDFDownloadLink>
  );
};

export default PDFDownloadButton;
