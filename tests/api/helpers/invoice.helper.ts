import { prisma } from '@/lib/db';

export interface TestInvoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  totalAmount: number;
  currency: string;
  status: string;
  ownerId: string;
}

export async function createTestInvoice(
  ownerId: string,
  invoiceData?: Partial<TestInvoice>
): Promise<TestInvoice> {
  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber: invoiceData?.invoiceNumber || `INV-TEST-${Date.now()}`,
      clientName: invoiceData?.clientName || 'Test Client Ltd.',
      clientAddress: invoiceData?.clientAddress || 'Client Address 123',
      clientEmail: invoiceData?.clientEmail || 'client@test.com',
      clientIco: '87654321',
      senderName: 'Test Company Ltd.',
      senderAddress: 'Test Address 123',
      senderIco: '12345678',
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      items: [
        {
          description: 'Test Service',
          quantity: 1,
          unitPrice: 1000,
          total: 1000,
        },
      ],
      totalAmount: invoiceData?.totalAmount || 1000,
      currency: invoiceData?.currency || 'CZK',
      status: invoiceData?.status || 'DRAFT',
      ownerId,
    },
  });

  return {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    clientName: invoice.clientName,
    clientAddress: invoice.clientAddress,
    clientEmail: invoice.clientEmail,
    totalAmount: invoice.totalAmount,
    currency: invoice.currency || 'CZK',
    status: invoice.status,
    ownerId: invoice.ownerId,
  };
}

export function generateInvoicePayload(overrides?: any) {
  return {
    clientName: 'Test Client Ltd.',
    clientAddress: 'Prague 1, Main Street 10',
    clientEmail: 'client@test.com',
    clientIco: '87654321',
    issueDate: new Date().toISOString(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        description: 'Consulting Services',
        quantity: 10,
        unitPrice: 1500,
        total: 15000,
      },
    ],
    totalAmount: 15000,
    currency: 'CZK',
    status: 'DRAFT',
    ...overrides,
  };
}
