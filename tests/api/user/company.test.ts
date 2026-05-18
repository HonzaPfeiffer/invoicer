import { GET, PUT } from '@/app/api/user/company/route';
import { createTestUser, createTestUserWithCompany } from '../helpers/auth.helper';
import { createMockRequest, parseResponse, BASE_URL } from '../helpers/request.helper';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/db';

jest.mock('next-auth/next');
const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;

describe('GET /api/user/company', () => {
  describe('Authentication', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = createMockRequest({
        method: 'GET',
        url: `${BASE_URL}/api/user/company`,
      });

      const response = await GET(request);
      const data = await parseResponse(response);

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('Successful Retrieval', () => {
    it('should return empty object when user has no company info', async () => {
      const user = await createTestUser();
      mockGetServerSession.mockResolvedValue({
        user: { id: user.id, email: user.email, name: user.name },
        expires: new Date().toISOString(),
      } as any);

      const request = createMockRequest({
        method: 'GET',
        url: `${BASE_URL}/api/user/company`,
      });

      const response = await GET(request);
      const data = await parseResponse(response);

      expect(response.status).toBe(200);
      expect(data).toEqual({});
    });

    it('should return company information when available', async () => {
      const user = await createTestUserWithCompany({
        companyName: 'Test Company Ltd.',
        companyAddress: 'Test Street 123',
        companyIco: '12345678',
      });

      mockGetServerSession.mockResolvedValue({
        user: { id: user.id, email: user.email, name: user.name },
        expires: new Date().toISOString(),
      } as any);

      const request = createMockRequest({
        method: 'GET',
        url: `${BASE_URL}/api/user/company`,
      });

      const response = await GET(request);
      const data = await parseResponse(response);

      expect(response.status).toBe(200);
      expect(data.companyName).toBe('Test Company Ltd.');
      expect(data.companyAddress).toBe('Test Street 123');
      expect(data.companyIco).toBe('12345678');
    });
  });
});

describe('PUT /api/user/company', () => {
  describe('Authentication', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = createMockRequest({
        method: 'PUT',
        url: `${BASE_URL}/api/user/company`,
        body: {
          companyName: 'New Company',
          companyAddress: 'New Address',
          companyIco: '87654321',
        },
      });

      const response = await PUT(request);
      const data = await parseResponse(response);

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('Successful Update', () => {
    it('should update company information', async () => {
      const user = await createTestUser();
      mockGetServerSession.mockResolvedValue({
        user: { id: user.id, email: user.email, name: user.name },
        expires: new Date().toISOString(),
      } as any);

      const companyData = {
        companyName: 'Updated Company Ltd.',
        companyAddress: 'Updated Address 456',
        companyIco: '99887766',
      };

      const request = createMockRequest({
        method: 'PUT',
        url: 'http://localhost:3000/api/user/company',
        body: companyData,
      });

      const response = await PUT(request);
      const data = await parseResponse(response);

      expect(response.status).toBe(200);
      expect(data.companyName).toBe(companyData.companyName);
      expect(data.companyAddress).toBe(companyData.companyAddress);
      expect(data.companyIco).toBe(companyData.companyIco);

      // Verify in database
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      expect(dbUser?.companyName).toBe(companyData.companyName);
      expect(dbUser?.companyAddress).toBe(companyData.companyAddress);
      expect(dbUser?.companyIco).toBe(companyData.companyIco);
    });

    it('should update only provided fields', async () => {
      const user = await createTestUserWithCompany({
        companyName: 'Original Company',
        companyAddress: 'Original Address',
        companyIco: '11111111',
      });

      mockGetServerSession.mockResolvedValue({
        user: { id: user.id, email: user.email, name: user.name },
        expires: new Date().toISOString(),
      } as any);

      const request = createMockRequest({
        method: 'PUT',
        url: 'http://localhost:3000/api/user/company',
        body: {
          companyName: 'Updated Name Only',
        },
      });

      const response = await PUT(request);
      const data = await parseResponse(response);

      expect(response.status).toBe(200);
      expect(data.companyName).toBe('Updated Name Only');
    });
  });
});
