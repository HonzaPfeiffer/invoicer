import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { getInvoiceById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Invoice, Prisma } from '@prisma/client';
import PDFDownloadButton from '@/app/components/PDFDownloadButton';
import Navigation from '@/app/components/Navigation';
import { 
  DocumentTextIcon, 
  ArrowLeftIcon,
  CalendarIcon,
  UserIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

type InvoiceWithItems = Invoice & {
  items: Prisma.JsonValue;
};

// Helper to assert type
function isInvoiceWithItems(invoice: any): invoice is InvoiceWithItems {
    return invoice && invoice.items && Array.isArray(JSON.parse(invoice.items as string));
}

export default async function InvoiceDetailsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const invoice = await getInvoiceById(params.id);

  if (!invoice || !isInvoiceWithItems(invoice)) {
    notFound();
  }

  const items = JSON.parse(invoice.items as string) as { description: string; quantity: number; price: number }[];

  return (
    <div className="min-h-screen">
      <Navigation session={session} />
      
      {/* Main Content */}
      <div className="lg:ml-64">
        <div className="p-6 lg:p-8 pt-20 lg:pt-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 fade-in">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <Link href="/">
                <button className="btn-glass p-2">
                  <ArrowLeftIcon className="w-5 h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Invoice {invoice.invoiceNumber}</h1>
                <p className="text-gray-400 text-sm sm:text-base">Invoice details and information</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`inline-block px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${
                invoice.status === 'PAID' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : invoice.status === 'SENT'
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              }`}>
                {invoice.status}
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
                  <h2 className="text-lg font-semibold text-white">Billed To</h2>
                </div>
                <div className="space-y-2">
                  <p className="text-white font-medium">{invoice.clientName}</p>
                  <div className="flex items-start space-x-2 text-gray-400 text-sm">
                    <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{invoice.clientAddress}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <EnvelopeIcon className="w-4 h-4 flex-shrink-0" />
                    <span>{invoice.clientEmail}</span>
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <CalendarIcon className="w-5 h-5 text-purple-400" />
                  <h2 className="text-lg font-semibold text-white">Invoice Details</h2>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Issue Date:</span>
                    <span className="text-white text-sm">{new Date(invoice.issueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Due Date:</span>
                    <span className="text-white text-sm">{new Date(invoice.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Total Amount:</span>
                    <span className="text-white font-medium text-sm">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoice.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-3 sm:p-4 text-gray-400 font-medium text-sm">Description</th>
                    <th className="text-right p-3 sm:p-4 text-gray-400 font-medium text-sm">Quantity</th>
                    <th className="text-right p-3 sm:p-4 text-gray-400 font-medium text-sm">Price</th>
                    <th className="text-right p-3 sm:p-4 text-gray-400 font-medium text-sm">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="p-3 sm:p-4 text-gray-300 text-sm">{item.description}</td>
                      <td className="p-3 sm:p-4 text-gray-300 text-sm text-right">{item.quantity}</td>
                      <td className="p-3 sm:p-4 text-gray-300 text-sm text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price)}</td>
                      <td className="p-3 sm:p-4 text-white font-medium text-sm text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.quantity * item.price)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="text-right font-bold p-3 sm:p-4 text-white text-sm">Grand Total</td>
                    <td className="text-right font-bold p-3 sm:p-4 text-lg text-purple-400">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoice.totalAmount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
