import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET all invoices for the logged-in user
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        ownerId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(invoices);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}

// POST a new invoice
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { clientName, clientAddress, clientEmail, clientIco, issueDate, dueDate, items, totalAmount, currency, status } = body;

        // Basic validation
        if (!clientName || !issueDate || !dueDate || !items || !totalAmount) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                companyName: true,
                companyAddress: true,
                companyIco: true,
            },
        });

        const invoice = await prisma.invoice.create({
            data: {
                clientName,
                clientAddress,
                clientEmail,
                clientIco,
                senderName: user?.companyName,
                senderAddress: user?.companyAddress,
                senderIco: user?.companyIco,
                issueDate: new Date(issueDate),
                dueDate: new Date(dueDate),
                items,
                totalAmount,
                currency: currency || 'USD',
                status,
                ownerId: session.user.id,
                invoiceNumber: `INV-${Date.now()}` 
            }
        });

        return NextResponse.json(invoice, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
}
