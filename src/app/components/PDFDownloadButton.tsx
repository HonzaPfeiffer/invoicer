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
        <button disabled className="px-6 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed">
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
        <button disabled={loading} className={`px-6 py-2 text-white rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
          {loading ? 'Generating PDF...' : 'Download PDF'}
        </button>
      )}
    </PDFDownloadLink>
  );
};

export default PDFDownloadButton;
