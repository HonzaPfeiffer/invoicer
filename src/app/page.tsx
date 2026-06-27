import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Navigation from './components/Navigation';
import InvoicesClient from './components/InvoicesClient';
import { getInvoices } from '@/lib/data';

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
          <InvoicesClient invoices={invoices} />
        </div>
      </div>
    </div>
  );
}
