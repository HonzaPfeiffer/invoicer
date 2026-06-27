import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { getInvoiceById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Navigation from '@/app/components/Navigation';
import InvoiceDetailClient from '@/app/components/InvoiceDetailClient';

function parseItems(items: any): any[] | null {
    try {
        const parsed = typeof items === 'string' ? JSON.parse(items) : items;
        return Array.isArray(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

export default async function InvoiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const invoice = await getInvoiceById(id);
  const parsedItems = invoice ? parseItems(invoice.items) : null;

  if (!invoice || !parsedItems) {
    notFound();
  }

  const items = parsedItems as { description: string; quantity: number; price: number }[];

  return (
    <div className="min-h-screen">
      <Navigation session={session} />
      
      <div className="lg:ml-64">
        <div className="p-6 lg:p-8 pt-20 lg:pt-8">
          <InvoiceDetailClient invoice={invoice} items={items} />
        </div>
      </div>
    </div>
  );
}
