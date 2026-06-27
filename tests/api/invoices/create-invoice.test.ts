import { POST } from '@/app/api/invoices/route';
import { createTestUser, createTestUserWithCompany } from '../helpers/auth.helper';
import { generateInvoicePayload } from '../helpers/invoice.helper';
import { createMockRequest, parseResponse, BASE_URL } from '../helpers/request.helper';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/db';

jest.mock('next-auth/next');
const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;

describe('POST /api/invoices', () => {
  describe('Authentication', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = createMockRequest({
        method: 'POST',
        url: `${BASE_URL}/api/invoices`,
        body: generateInvoicePayload(),
      });

      const response = await POST(request);
      const data = await parseResponse(response);

      expect(response.status).toBe(401);
      expect(data.message).toBe('Unauthorized');
    });
  });

  describe('Successful Creation', () => {
    it('should create invoice with valid data', async () => {
      const user = await createTestUserWithCompany();
      mockGetServerSession.mockResolvedValue({
        user: { id: user.id, email: user.email, name: user.name },
        expires: new Date().toISOString(),
      } as any);

      const invoiceData = generateInvoicePayload();
      const request = createMockRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/invoices',
        body: invoiceData,
      });

      const response = await POST(request);
      const data = await parseResponse(response);

      expect(response.status).toBe(201);
      expect(data).toHaveProperty('id');
      expect(data.clientName).toBe(invoiceData.clientName);
      expect(data.totalAmount).toBe(invoiceData.totalAmount);
      expect(data.currency).toBe(invoiceData.currency);
      expect(data.ownerId).toBe(user.id);
    });

    it('should auto-generate invoice number', async () => {
      const user = await createTestUserWithCompany();
      mockGetServerSession.mockResolvedValue({
        user: { id: user.id, email: user.email, name: user.name },
        expires: new Date().toISOString(),
      } as any);

      const request = createMockRequest({
        method: 'POST',
        url: `${BASE_URL}/api/invoices`,
        body: generateInvoicePayload(),
      });

      const response = await POST(request);
      const data = await parseResponse(response);

      expect(response.status).toBe(201);
      expect(data.invoiceNumber).toMatch(/^INV-\d+$/);
    });

    it('should include sender information from user company data', async () => {
      const user = await createTestUserWithCompany({
        companyName: 'My Test Company',
        companyAddress: 'Test Street 123',
        companyIco: '99887766',
      });

      mockGetServerSession.mockResolvedValue({
        user: { id: user.id, email: user.email, name: user.name },
        expires: new Date().toISOString(),
      } as any);

      const request = createMockRequest({
        method: 'POST',
        url: `${BASE_URL}/api/invoices`,
        body: generateInvoicePayload(),
      });

      const response = await POST(request);
      const data = await parseResponse(response);

      expect(response.status).toBe(201);
      expect(data.senderName).toBe('My Test Company');
      expect(data.senderAddress).toBe('Test Street 123');
      expect(data.senderIco).toBe('99887766');
    });

    it('should default currency to USD if not provided', async () => {
      const user = await createTestUserWithCompany();
      mockGetServerSession.mockResolvedValue({
        user: { id: user.id, email: user.email, name: user.name },
        expires: new Date().toISOString(),
      } as any);

      const invoiceData = generateInvoicePayload();
      delete invoiceData.currency;

      const request = createMockRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/invoices',
        body: invoiceData,
      });

      const response = await POST(request);
      const data = await parseResponse(response);

      expect(response.status).toBe(201);
      expect(data.currency).toBe('USD');
    });
  });

  describe('Validation', () => {
    it('should return 400 when clientName is missing', async () => {
      const user = await createTestUser();
      mockGetServerSession.mockResolvedValue({
        user: { id: user.id, email: user.email, name: user.name },
        expires: new Date().toISOString(),
      } as any);

      const invoiceData = generateInvoicePayload();
      delete invoiceData.clientName;

      const request = createMockRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/invoices',
        body: invoiceData,
      });

      const response = await POST(request);
      const data = await parseResponse(response);

      expect(response.status).toBe(400);
      expect(data.message).toBe('Missing required fields');
    });

    it('should return 400 when issueDate is missing', async () => {
      const user = await createTestUser();
      mockGetServerSession.mockResolvedValue({
        user: { id: user.id, email: user.email, name: user.name },
        expires: new Date().toISOString(),
      } as any);

      const invoiceData = generateInvoicePayload();
      delete invoiceData.issueDate;

      const request = createMockRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/invoices',
        body: invoiceData,
      });

      const response = await POST(request);
      const data = await parseResponse(response);

      expect(response.status).toBe(400);
      expect(data.message).toBe('Missing required fields');
    });

    it('should return 400 when items array is missing', async () => {
      const user = await createTestUser();
      mockGetServerSession.mockResolvedValue({
        user: { id: user.id, email: user.email, name: user.name },
        expires: new Date().toISOString(),
      } as any);

      const invoiceData = generateInvoicePayload();
      delete invoiceData.items;

      const request = createMockRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/invoices',
        body: invoiceData,
      });

      const response = await POST(request);
      const data = await parseResponse(response);

      expect(response.status).toBe(400);
      expect(data.message).toBe('Missing required fields');
    });
  });

  describe('Database Persistence', () => {
    it('should persist invoice to database', async () => {
      const user = await createTestUserWithCompany();
      mockGetServerSession.mockResolvedValue({
        user: { id: user.id, email: user.email, name: user.name },
        expires: new Date().toISOString(),
      } as any);

      const invoiceData = generateInvoicePayload();
      const request = createMockRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/invoices',
        body: invoiceData,
      });

      const response = await POST(request);
      const data = await parseResponse(response);

      // Verify in database
      const dbInvoice = await prisma.invoice.findUnique({
        where: { id: data.id },
      });

      expect(dbInvoice).not.toBeNull();
      expect(dbInvoice?.clientName).toBe(invoiceData.clientName);
      expect(dbInvoice?.totalAmount).toBe(invoiceData.totalAmount);
    });
  });
});
