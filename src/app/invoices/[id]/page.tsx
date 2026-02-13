import { getInvoiceById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Invoice, Prisma } from '@prisma/client';
import PDFDownloadButton from '@/app/components/PDFDownloadButton';

type InvoiceWithItems = Invoice & {
  items: Prisma.JsonValue;
};

// Helper to assert type
function isInvoiceWithItems(invoice: any): invoice is InvoiceWithItems {
    console.log(invoice);
    return invoice && invoice.items && Array.isArray(JSON.parse(invoice.items as string));
}

export default async function InvoiceDetailsPage({ params }: { params: { id: string } }) {
  const invoice = await getInvoiceById(params.id);

  if (!invoice || !isInvoiceWithItems(invoice)) {
    notFound();
  }

  const items = JSON.parse(invoice.items as string) as { description: string; quantity: number; price: number }[];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoice {invoice.invoiceNumber}</h1>
            <p className={`mt-1 text-sm font-semibold rounded-full px-3 py-1 inline-block ${
                invoice.status === 'PAID' ? 'bg-green-100 text-green-800' :
                invoice.status === 'SENT' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
            }`}>
              {invoice.status}
            </p>
          </div>
          <PDFDownloadButton invoice={invoice} />
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-sm font-semibold text-gray-500">Billed To</h2>
            <p className="font-medium text-gray-900">{invoice.clientName}</p>
            <p className="text-gray-600">{invoice.clientAddress}</p>
            <p className="text-gray-600">{invoice.clientEmail}</p>
          </div>
          <div className="text-right">
            <h2 className="text-sm font-semibold text-gray-500">Invoice Details</h2>
            <p><span className="font-medium">Issue Date:</span> {new Date(invoice.issueDate).toLocaleDateString()}</p>
            <p><span className="font-medium">Due Date:</span> {new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b-2 p-4">Description</th>
              <th className="border-b-2 p-4 text-right">Quantity</th>
              <th className="border-b-2 p-4 text-right">Price</th>
              <th className="border-b-2 p-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="border-b p-4">{item.description}</td>
                <td className="border-b p-4 text-right">{item.quantity}</td>
                <td className="border-b p-4 text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price)}</td>
                <td className="border-b p-4 text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.quantity * item.price)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-right font-bold p-4">Grand Total</td>
              <td className="text-right font-bold p-4">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoice.totalAmount)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
