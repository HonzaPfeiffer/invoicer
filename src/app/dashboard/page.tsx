import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Navigation from '../components/Navigation';
import { getInvoices } from '@/lib/data';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const invoices = await getInvoices();
  
  // Calculate statistics
  const totalRevenue = invoices
    .filter(inv => inv.status === 'PAID')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);
    
  const pendingInvoices = invoices.filter(inv => inv.status === 'SENT').length;
  const totalInvoices = invoices.length;
  const recentInvoices = invoices.slice(0, 5);

  const stats = [
    {
      name: 'Total Revenue',
      value: new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 0
      }).format(totalRevenue),
    },
    {
      name: 'Total Invoices',
      value: totalInvoices.toString(),
    },
    {
      name: 'Pending',
      value: pendingInvoices.toString(),
    },
    {
      name: 'Paid Invoices',
      value: invoices.filter(inv => inv.status === 'PAID').length.toString(),
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation session={session} />
      
      <div className="lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {session.user?.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Here's an overview of your invoices
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Invoices</h2>
            
            {recentInvoices.length > 0 ? (
              <div className="space-y-3">
                {recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-gray-600">{invoice.clientName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {new Intl.NumberFormat('en-US', { 
                          style: 'currency', 
                          currency: 'USD' 
                        }).format(invoice.totalAmount)}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        invoice.status === 'PAID' 
                          ? 'bg-green-100 text-green-800' 
                          : invoice.status === 'SENT'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No invoices yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
