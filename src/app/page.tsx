import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import LogoutButton from './components/LogoutButton';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {session.user?.name}!</h1>
            <p className="text-gray-600">Manage your invoices here.</p>
          </div>
          <LogoutButton />
        </div>
        
        <div className="border-t border-gray-200 pt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Your Invoices</h2>
            <Link href="/invoices/new">
              <span className="cursor-pointer px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                Create New Invoice
              </span>
            </Link>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {invoices.length > 0 ? (
              <ul role="list" className="divide-y divide-gray-200">
                {invoices.map((invoice: Invoice) => (
                  <li key={invoice.id}>
                    <Link href={`/invoices/${invoice.id}`}>
                      <span className="cursor-pointer block hover:bg-gray-50">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-indigo-600 truncate">{invoice.invoiceNumber}</p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  invoice.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                  invoice.status === 'SENT' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                {invoice.status}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">{invoice.clientName}</p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoice.totalAmount)}</p>
                            </div>
                          </div>
                        </div>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg p-12">
                <p>You don't have any invoices yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
