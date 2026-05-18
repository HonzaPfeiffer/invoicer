import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/invoices:
 *   get:
 *     summary: Get all invoices for the authenticated user
 *     description: Returns a list of all invoices belonging to the currently authenticated user, sorted by creation date (newest first)
 *     tags:
 *       - Invoices
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of invoices successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Invoice'
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/invoices:
 *   post:
 *     summary: Create a new invoice
 *     description: Creates a new invoice with sender information (from user settings) and recipient details
 *     tags:
 *       - Invoices
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientName
 *               - clientAddress
 *               - clientEmail
 *               - issueDate
 *               - dueDate
 *               - items
 *               - totalAmount
 *               - currency
 *             properties:
 *               clientName:
 *                 type: string
 *                 description: Client/recipient name
 *               clientAddress:
 *                 type: string
 *                 description: Client address
 *               clientEmail:
 *                 type: string
 *                 format: email
 *                 description: Client email
 *               clientIco:
 *                 type: string
 *                 description: Client IČO (optional)
 *               issueDate:
 *                 type: string
 *                 format: date
 *                 description: Invoice issue date
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: Invoice due date
 *               items:
 *                 type: array
 *                 description: Invoice items
 *                 items:
 *                   $ref: '#/components/schemas/InvoiceItem'
 *               totalAmount:
 *                 type: number
 *                 description: Total invoice amount
 *               currency:
 *                 type: string
 *                 enum: [USD, EUR, CZK]
 *                 description: Invoice currency
 *     responses:
 *       201:
 *         description: Invoice successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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
