import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * @swagger
 * /api/user/company:
 *   get:
 *     summary: Získat informace o společnosti uživatele
 *     description: Vrací informace o společnosti přihlášeného uživatele (název, adresa, IČO)
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Informace o společnosti úspěšně načteny
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCompany'
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
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        companyName: true,
        companyAddress: true,
        companyIco: true,
      },
    });

    return NextResponse.json(user || {});
  } catch (error) {
    console.error('Error fetching user company info:', error);
    return NextResponse.json({ error: 'Failed to fetch company info' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/user/company:
 *   put:
 *     summary: Aktualizovat informace o společnosti uživatele
 *     description: Aktualizuje informace o společnosti přihlášeného uživatele (název, adresa, IČO)
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *                 description: Název společnosti
 *               companyAddress:
 *                 type: string
 *                 description: Adresa společnosti
 *               companyIco:
 *                 type: string
 *                 description: IČO společnosti
 *     responses:
 *       200:
 *         description: Informace o společnosti úspěšně aktualizovány
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCompany'
 *       401:
 *         description: Neautorizovaný přístup
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Chyba při aktualizaci informací
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { companyName, companyAddress, companyIco } = body;

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        companyName,
        companyAddress,
        companyIco,
      },
    });

    return NextResponse.json({
      companyName: user.companyName,
      companyAddress: user.companyAddress,
      companyIco: user.companyIco,
    });
  } catch (error) {
    console.error('Error updating user company info:', error);
    return NextResponse.json({ error: 'Failed to update company info' }, { status: 500 });
  }
}
