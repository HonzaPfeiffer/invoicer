import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Navigation from './components/Navigation';
import { getInvoices } from '@/lib/data';
import Link from 'next/link';
import type { Invoice } from '@prisma/client';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const invoices = await getInvoices();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation session={session} />
      
      <div className="lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
              <p className="text-gray-600 mt-1">Manage and track all your invoices</p>
            </div>
            <Link href="/invoices/new">
              <button className="mt-4 sm:mt-0 w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                Create Invoice
              </button>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {invoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Invoice</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Client</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
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
                          {new Intl.NumberFormat('en-US', { 
                            style: 'currency', 
                            currency: 'USD' 
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
                            {invoice.status}
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices yet</h3>
                <p className="text-gray-500 mb-6">Create your first invoice to get started</p>
                <Link href="/invoices/new">
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                    Create Your First Invoice
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
