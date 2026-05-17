import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/invoices:
 *   get:
 *     summary: Získat všechny faktury přihlášeného uživatele
 *     description: Vrací seznam všech faktur patřících aktuálně přihlášenému uživateli, seřazených podle data vytvoření (nejnovější první)
 *     tags:
 *       - Invoices
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Seznam faktur úspěšně načten
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Invoice'
 *       401:
 *         description: Neautorizovaný přístup
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Interní chyba serveru
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
 *     summary: Vytvořit novou fakturu
 *     description: Vytvoří novou fakturu s informacemi o dodavateli (z nastavení uživatele) a odběrateli
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
 *                 description: Název klienta/odběratele
 *               clientAddress:
 *                 type: string
 *                 description: Adresa klienta
 *               clientEmail:
 *                 type: string
 *                 format: email
 *                 description: Email klienta
 *               clientIco:
 *                 type: string
 *                 description: IČO klienta (volitelné)
 *               issueDate:
 *                 type: string
 *                 format: date
 *                 description: Datum vystavení faktury
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: Datum splatnosti faktury
 *               items:
 *                 type: array
 *                 description: Položky faktury
 *                 items:
 *                   $ref: '#/components/schemas/InvoiceItem'
 *               totalAmount:
 *                 type: number
 *                 description: Celková částka faktury
 *               currency:
 *                 type: string
 *                 enum: [USD, EUR, CZK]
 *                 description: Měna faktury
 *     responses:
 *       201:
 *         description: Faktura úspěšně vytvořena
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       401:
 *         description: Neautorizovaný přístup
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Interní chyba serveru
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
