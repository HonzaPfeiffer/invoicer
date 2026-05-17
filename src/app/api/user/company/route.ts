import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';

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
