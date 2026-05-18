import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/db';

/**
 * @swagger
 * /api/user/company:
 *   get:
 *     summary: Get user company information
 *     description: Returns company information for the authenticated user (name, address, IČO)
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Company information successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCompany'
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
 *     summary: Update user company information
 *     description: Updates company information for the authenticated user (name, address, IČO)
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
 *                 description: Company name
 *               companyAddress:
 *                 type: string
 *                 description: Company address
 *               companyIco:
 *                 type: string
 *                 description: Company IČO
 *     responses:
 *       200:
 *         description: Company information successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCompany'
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error updating information
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
