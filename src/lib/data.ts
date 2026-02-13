import { prisma } from './db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getInvoices() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return [];
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
        return invoices;
    } catch (error) {
        console.error('Error fetching invoices:', error);
        return [];
    }
}

export async function getInvoiceById(id: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return null;
    }

    try {
        const invoice = await prisma.invoice.findUnique({
            where: {
                id: id,
                ownerId: session.user.id, // Ensure user can only access their own invoices
            },
        });
        return invoice;
    } catch (error) {
        console.error('Error fetching invoice by ID:', error);
        return null;
    }
}
