import { GET } from '@/app/api/invoices/route';
import { createTestUser, createTestUserWithCompany } from '../helpers/auth.helper';
import { createTestInvoice } from '../helpers/invoice.helper';
import { parseResponse, BASE_URL } from '../helpers/request.helper';
import { getServerSession } from 'next-auth/next';

// Mock NextAuth
jest.mock('next-auth/next');
const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;

describe('GET /api/invoices', () => {
  describe('Authentication', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const response = await GET();
      const data = await parseResponse(response);

      expect(response.status).toBe(401);
      expect(data.message).toBe('Unauthorized');
    });

    it('should return 401 when session has no user ID', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { email: 'test@example.com' },
        expires: new Date().toISOString(),
      } as any);

      const response = await GET();
      const data = await parseResponse(response);

      expect(response.status).toBe(401);
      expect(data.message).toBe('Unauthorized');
    });
  });

  describe('Successful Retrieval', () => {
    it('should return empty array when user has no invoices', async () => {
      const user = await createTestUser();
      mockGetServerSession.mockResolvedValue({
        user: { id: user.id, email: user.email, name: user.name },
        expires: new Date().toISOString(),
      } as any);

      const response = await GET();
      const data = await parseResponse(response);

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(0);
    });

    it('should return all invoices for authenticated user', async () => {
      const user = await createTestUserWithCompany();
      mockGetServerSession.mockResolvedValue({
        user: { id: user.id, email: user.email, name: user.name },
        expires: new Date().toISOString(),
      } as any);

      // Create multiple invoices
      await createTestInvoice(user.id, { invoiceNumber: 'INV-001' });
      await createTestInvoice(user.id, { invoiceNumber: 'INV-002' });
      await createTestInvoice(user.id, { invoiceNumber: 'INV-003' });

      const response = await GET();
      const data = await parseResponse(response);

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(3);
    });

    it('should return invoices sorted by creation date (newest first)', async () => {
      const user = await createTestUserWithCompany();
      mockGetServerSession.mockResolvedValue({
        user: { id: user.id, email: user.email, name: user.name },
        expires: new Date().toISOString(),
      } as any);

      // Create invoices with slight delays
      const invoice1 = await createTestInvoice(user.id, { invoiceNumber: 'INV-001' });
      await new Promise(resolve => setTimeout(resolve, 10));
      const invoice2 = await createTestInvoice(user.id, { invoiceNumber: 'INV-002' });
      await new Promise(resolve => setTimeout(resolve, 10));
      const invoice3 = await createTestInvoice(user.id, { invoiceNumber: 'INV-003' });

      const response = await GET();
      const data = await parseResponse(response);

      expect(response.status).toBe(200);
      expect(data[0].invoiceNumber).toBe('INV-003'); // Newest first
      expect(data[1].invoiceNumber).toBe('INV-002');
      expect(data[2].invoiceNumber).toBe('INV-001');
    });

    it('should only return invoices owned by the authenticated user', async () => {
      const user1 = await createTestUserWithCompany();
      const user2 = await createTestUserWithCompany();

      // Create invoices for both users
      await createTestInvoice(user1.id, { invoiceNumber: 'USER1-INV-001' });
      await createTestInvoice(user1.id, { invoiceNumber: 'USER1-INV-002' });
      await createTestInvoice(user2.id, { invoiceNumber: 'USER2-INV-001' });

      // Authenticate as user1
      mockGetServerSession.mockResolvedValue({
        user: { id: user1.id, email: user1.email, name: user1.name },
        expires: new Date().toISOString(),
      } as any);

      const response = await GET();
      const data = await parseResponse(response);

      expect(response.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(data.every((inv: any) => inv.ownerId === user1.id)).toBe(true);
      expect(data.some((inv: any) => inv.invoiceNumber.startsWith('USER2'))).toBe(false);
    });
  });

  describe('Invoice Data Structure', () => {
    it('should return invoices with all required fields', async () => {
      const user = await createTestUserWithCompany();
      mockGetServerSession.mockResolvedValue({
        user: { id: user.id, email: user.email, name: user.name },
        expires: new Date().toISOString(),
      } as any);

      await createTestInvoice(user.id);

      const response = await GET();
      const data = await parseResponse(response);

      expect(response.status).toBe(200);
      const invoice = data[0];

      expect(invoice).toHaveProperty('id');
      expect(invoice).toHaveProperty('invoiceNumber');
      expect(invoice).toHaveProperty('clientName');
      expect(invoice).toHaveProperty('clientAddress');
      expect(invoice).toHaveProperty('clientEmail');
      expect(invoice).toHaveProperty('totalAmount');
      expect(invoice).toHaveProperty('currency');
      expect(invoice).toHaveProperty('status');
      expect(invoice).toHaveProperty('ownerId');
      expect(invoice).toHaveProperty('createdAt');
      expect(invoice).toHaveProperty('updatedAt');
    });
  });

  describe('Error Handling', () => {
    it('should return 500 on database error', async () => {
      const user = await createTestUser();
      mockGetServerSession.mockResolvedValue({
        user: { id: user.id, email: user.email, name: user.name },
        expires: new Date().toISOString(),
      } as any);

      // Mock prisma to throw error
      const { prisma } = require('@/lib/db');
      const originalFindMany = prisma.invoice.findMany;
      prisma.invoice.findMany = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await GET();
      const data = await parseResponse(response);

      expect(response.status).toBe(500);
      expect(data.message).toBe('Something went wrong');

      // Restore original function
      prisma.invoice.findMany = originalFindMany;
    });
  });
});
