import { PATCH } from '@/app/api/invoices/[id]/route';
import { createTestUser, createTestUserWithCompany } from '../helpers/auth.helper';
import { createTestInvoice } from '../helpers/invoice.helper';
import { createMockRequest, parseResponse, BASE_URL } from '../helpers/request.helper';
import { getServerSession } from 'next-auth/next';

jest.mock('next-auth/next');
const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;

describe('PATCH /api/invoices/[id]', () => {
  describe('Authentication', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = createMockRequest({
        method: 'PATCH',
        url: `${BASE_URL}/api/invoices/test-id`,
        body: { status: 'PAID' },
      });

      const response = await PATCH(request, { params: Promise.resolve({ id: 'test-id' }) });
      const data = await parseResponse(response);

      expect(response.status).toBe(401);
      expect(data.message).toBe('Unauthorized');
    });
  });

  describe('Validation', () => {
    it('should return 400 for invalid status', async () => {
      const user = await createTestUser();
      mockGetServerSession.mockResolvedValue({
        user: { id: user.id, email: user.email, name: user.name },
        expires: new Date().toISOString(),
      } as any);

      const request = createMockRequest({
        method: 'PATCH',
        url: 'http://localhost:3000/api/invoices/test-id',
        body: { status: 'INVALID_STATUS' },
      });

      const response = await PATCH(request, { params: Promise.resolve({ id: 'test-id' }) });
      const data = await parseResponse(response);

      expect(response.status).toBe(400);
      expect(data.message).toBe('Invalid status');
    });

    it('should accept valid statuses: DRAFT, SENT, PAID', async () => {
      const user = await createTestUserWithCompany();
      const invoice = await createTestInvoice(user.id);

      mockGetServerSession.mockResolvedValue({
        user: { id: user.id, email: user.email, name: user.name },
        expires: new Date().toISOString(),
      } as any);

      const validStatuses = ['DRAFT', 'SENT', 'PAID'];

      for (const status of validStatuses) {
        const request = createMockRequest({
          method: 'PATCH',
          url: `http://localhost:3000/api/invoices/${invoice.id}`,
          body: { status },
        });

        const response = await PATCH(request, { params: Promise.resolve({ id: invoice.id }) });
        expect(response.status).toBe(200);
      }
    });
  });

  describe('Authorization', () => {
    it('should return 404 when invoice does not exist', async () => {
      const user = await createTestUser();
      mockGetServerSession.mockResolvedValue({
        user: { id: user.id, email: user.email, name: user.name },
        expires: new Date().toISOString(),
      } as any);

      const request = createMockRequest({
        method: 'PATCH',
        url: 'http://localhost:3000/api/invoices/non-existent-id',
        body: { status: 'PAID' },
      });

      const response = await PATCH(request, { params: Promise.resolve({ id: 'non-existent-id' }) });
      const data = await parseResponse(response);

      expect(response.status).toBe(404);
      expect(data.message).toBe('Invoice not found');
    });

    it('should return 403 when user tries to update another users invoice', async () => {
      const user1 = await createTestUserWithCompany();
      const user2 = await createTestUser();
      const invoice = await createTestInvoice(user1.id);

      // Authenticate as user2
      mockGetServerSession.mockResolvedValue({
        user: { id: user2.id, email: user2.email, name: user2.name },
        expires: new Date().toISOString(),
      } as any);

      const request = createMockRequest({
        method: 'PATCH',
        url: `http://localhost:3000/api/invoices/${invoice.id}`,
        body: { status: 'PAID' },
      });

      const response = await PATCH(request, { params: Promise.resolve({ id: invoice.id }) });
      const data = await parseResponse(response);

      expect(response.status).toBe(403);
      expect(data.message).toBe('Forbidden');
    });
  });

  describe('Successful Update', () => {
    it('should update invoice status', async () => {
      const user = await createTestUserWithCompany();
      const invoice = await createTestInvoice(user.id, { status: 'DRAFT' });

      mockGetServerSession.mockResolvedValue({
        user: { id: user.id, email: user.email, name: user.name },
        expires: new Date().toISOString(),
      } as any);

      const request = createMockRequest({
        method: 'PATCH',
        url: `http://localhost:3000/api/invoices/${invoice.id}`,
        body: { status: 'PAID' },
      });

      const response = await PATCH(request, { params: Promise.resolve({ id: invoice.id }) });
      const data = await parseResponse(response);

      expect(response.status).toBe(200);
      expect(data.status).toBe('PAID');
      expect(data.id).toBe(invoice.id);
    });
  });
});
